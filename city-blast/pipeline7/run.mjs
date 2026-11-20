// pipeline7: blueprints -> levels -> build -> headless tester -> auto-tune TNT -> verdicts + report.
//   node run.mjs            full run (all blueprints)
//   node run.mjs B4 B7      only these blueprints (they still get L37+ slots in order)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createServer } from 'node:http';
import { BLUEPRINTS } from './blueprints.mjs';
import { generate4b as generate } from './gen.mjs';
import { launch, open } from './cdp.mjs';
import { buildHtml } from './build.mjs';

const OUT = new URL('./out/', import.meta.url).pathname; mkdirSync(OUT, { recursive: true });
const pick = process.argv.slice(2);
// LEVEL_JSON=path: test hand-built levels (GD step 3) instead of blueprints. Each level carries bp/name/tier.
const LJ = process.env.LEVEL_JSON ? JSON.parse(readFileSync(process.env.LEVEL_JSON, 'utf8')) : null;
const BPS = LJ ? LJ.map(l => ({ id: l.bp, name: l.name, tier: l.tier || 'N', tntStart: l.tntStart, sf: l.sf || [], pattern: l.pattern || 'gd', story: l.story || '', sfMetric: l.sfMetric || {}, json: l }))
  : pick.length ? BLUEPRINTS.filter(b => pick.includes(b.id)) : BLUEPRINTS;
const make = (bp, tnt) => bp.json ? Object.assign(JSON.parse(JSON.stringify(bp.json)), { charges: { tnt } }) : generate(bp, { tnt });
// pass rules (the Smash Fest bands, docs/RULES in report.md)
const RULE = {
  oneBombPct: 70, oneBombCollapse: 101,           // Khai 20/11 (A): one bomb MAY drop the building (the fun), it must never come near the win (< 70%; base 18/11)            // v4: one bomb may drop part of it (the collapse is the fun), never most of it, never the win            // the best single TNT must not take the building
  spare: { N: [2, 5], H: [1, 3], SH: [1, 3] },    // TNT left after a fair player wins (SF: N ~6 balls, Hard 0-3.5)
  minWaves: { N: 2, H: 3, SH: 3 },                // decisions: a level is several reads, not one tap
  estSec: { N: [20, 75], H: [30, 90], SH: [40, 120] },
  keepMax: 0.05,
  footMax: 80                                     // the whole budget at the foot, or foot-only play, must stay below 80% (target 85)
};

async function session(html){
  const srv = createServer((q, s) => { s.writeHead(q.url === '/' || q.url.startsWith('/?') ? 200 : 404, { 'content-type': 'text/html' }); s.end(q.url === '/' || q.url.startsWith('/?') ? html : ''); }).listen(8791);
  const { proc, port } = await launch(9334);
  const pg = await open(port, 'http://127.0.0.1:8791/');
  for(let i = 0; i < 60; i++){ await new Promise(r => setTimeout(r, 500)); try{ if(await pg.evaluate('!!(window.__blast && __blast.lv7 && __blast.lv7.info)')) break; }catch(e){} }
  await new Promise(r => setTimeout(r, 2500));
  await pg.evaluate(readFileSync(new URL('./tester.js', import.meta.url), 'utf8'));
  return { pg, done: () => { pg.close(); proc.kill(); srv.close(); } };
}

const t0 = Date.now(), log = (...a) => console.log(((Date.now() - t0) / 1000).toFixed(0).padStart(4) + 's', ...a);
const levels = BPS.map(bp => make(bp, 40));
let S = await session(buildHtml(levels, true));
const base = await S.pg.evaluate('__blast.lv7.base');
const results = [];
for(let k = 0; k < BPS.length; k++){
  const bp = BPS[k], idx = base + k, R = { id: bp.id, lv: idx + 1, name: bp.name, tier: bp.tier, sf: bp.sf, pattern: bp.pattern, story: bp.story, sfMetric: bp.sfMetric };
  await S.pg.evaluate(`window.P7tap = ${!!(bp.json && (bp.json.keepRoutes || bp.json.seqRoutes))}`);
  R.metrics = await S.pg.evaluate(`JSON.stringify(P7.metrics(${idx}))`).then(JSON.parse);
  log(bp.id, 'metrics'); R.oneBomb = await S.pg.evaluate(`JSON.stringify(P7.oneBomb(${idx}, 18))`).then(JSON.parse);
  R.lazy = await S.pg.evaluate(`JSON.stringify(P7.lazy(${idx}))`).then(JSON.parse);
  log(bp.id, 'oneBomb/lazy done'); const open40 = await S.pg.evaluate(`P7.fair(${idx}, 40, 1).then(JSON.stringify)`).then(JSON.parse);
  R.fairOpen = open40;
  const [lo, hi] = RULE.spare[bp.tier];
  R.tnt = (open40.win || (bp.json && (bp.json.aimFace || bp.json.keepRoutes || bp.json.seqRoutes))) ? (bp.tntStart || open40.used + lo + (bp.tier === 'N' ? 1 : 0)) : null;   // tntStart: a budget proven in an earlier run
  // confirm on 3 seeds; a capped player plays differently from the 40-TNT probe, so raise the budget one TNT at a time
  // (up to +6) until all 3 seeds win, then the verdicts check the spare band
  if(R.tnt){
    for(let bump = 0; bump <= (bp.json && (bp.json.aimFace || bp.json.keepRoutes || bp.json.seqRoutes) ? 0 : 6); bump++){
      R.fair = [];
      for(const seed of [1, 2, 3]) R.fair.push(await S.pg.evaluate(`P7.fair(${idx}, ${R.tnt}, ${seed}).then(JSON.stringify)`).then(JSON.parse));
      if(R.fair.every(f => f.win) && Math.min(...R.fair.map(f => f.left)) >= lo) break;   // every seed wins AND keeps the tier's spare
      R.tnt++;
    }
    R.spare = Math.min(...R.fair.map(f => f.left));
  }
  log(bp.id, 'fair done', R.tnt);
  if(R.tnt){
    R.allFoot = await S.pg.evaluate(`JSON.stringify(P7.allFoot(${idx}, ${R.tnt}))`).then(JSON.parse);
    R.footOnly = await S.pg.evaluate(`JSON.stringify(P7.footOnly(${idx}, ${R.tnt}))`).then(JSON.parse);
    R.oneWave = await S.pg.evaluate(`JSON.stringify(P7.oneWave(${idx}, ${R.tnt}, ${bp.json && (bp.json.keepRoutes || bp.json.seqRoutes) ? 'true' : 'false'}))`).then(JSON.parse);
    if(bp.json && (bp.json.keepRoutes || bp.json.seqRoutes)) R.oneWave.keep = await S.pg.evaluate('Math.round(100*__blast.test.collateral())');   // the whole budget in ONE blast (Khai 20/11)
  }
  // the lesson test (L.aimFace): tip the tower each way, then clean up; the right way must win, the 3 others must not
  if(bp.json && bp.json.aimFace){ const f = bp.json.aimFace, B = R.tnt || bp.tntStart || 24; R.aim = [];
    for(const [fx, fz] of [f, [-f[0], -f[1]], [f[1], f[0]], [-f[1], -f[0]]]) R.aim.push(await S.pg.evaluate(`JSON.stringify(P7.aim(${idx}, ${fx}, ${fz}, ${B}))`).then(JSON.parse)); }
  log(bp.id, 'foot/oneWave done');
  if(bp.json && bp.json.keepRoutes){ const KR = bp.json.keepRoutes; R.keepT = [];
    for(const [peel, f, pt] of KR.right) R.keepT.push(Object.assign({ right: 1 }, await S.pg.evaluate(`JSON.stringify(P7.keepT(${idx}, ${f[0]}, ${f[1]}, ${R.tnt}, ${JSON.stringify(peel.split(''))}, 0, null, ${JSON.stringify(pt || 'A')}))`).then(JSON.parse)));
    for(const f of KR.wrong) R.keepT.push(Object.assign({ right: 0 }, await S.pg.evaluate(`JSON.stringify(P7.keepT(${idx}, ${f[0]}, ${f[1]}, ${R.tnt}, [], 1, null, ${JSON.stringify(f[2] || 'A')}))`).then(JSON.parse))); }
  if(bp.json && bp.json.seqRoutes){ R.keepT = [];
    for(const q of bp.json.seqRoutes.right) R.keepT.push(Object.assign({ right: 1, peel: '', face: '' }, await S.pg.evaluate(`JSON.stringify(P7.seqT(${idx}, ${JSON.stringify(q)}, ${R.tnt}))`).then(JSON.parse)));
    for(const q of bp.json.seqRoutes.wrong) R.keepT.push(Object.assign({ right: 0, peel: '', face: '' }, await S.pg.evaluate(`JSON.stringify(P7.seqT(${idx}, ${JSON.stringify(q)}, ${R.tnt}))`).then(JSON.parse))); }
  // verdicts
  const v = [];
  if(R.oneBomb.pct >= RULE.oneBombPct || R.oneBomb.collapse >= RULE.oneBombCollapse) v.push(`ONE-BOMB ${R.oneBomb.pct}% / collapse ${R.oneBomb.collapse}% at ${R.oneBomb.at}`);
  if(R.lazy.pct >= 85) v.push(`LAZY wins (${R.lazy.pct}%)`);
  if(R.allFoot && R.allFoot.pct >= RULE.footMax && !(R.allFoot.keep > 5)) v.push(`ALL-AT-FOOT reaches ${R.allFoot.pct}%`);
  if(R.oneWave && R.oneWave.pct >= RULE.footMax && !(R.oneWave.keep > 5)) v.push(`ONE-WAVE (all TNT, one BLAST) reaches ${R.oneWave.pct}%`);
  if(R.footOnly && R.footOnly.pct >= RULE.footMax && !(R.footOnly.keep > 5)) v.push(`FOOT-ONLY play reaches ${R.footOnly.pct}%`);
  if(R.aim){ if(R.aim[0].pct < 85) v.push(`AIM right way only ${R.aim[0].pct}%`); R.aim.slice(1).forEach(a => { if(a.pct >= 80) v.push(`AIM wrong way ${a.face} reaches ${a.pct}%`); }); }
  if(R.keepT){ R.keepT.forEach(k => { if(k.right && !k.win) v.push(`KEEP route ${k.seq || k.peel + '>' + k.face} fails (${k.pct}%, blue ${k.keep}%)`); if(!k.right && k.win) v.push(`KEEP wrong ${k.seq || k.face} wins`);
    if(k.right && k.waves.split('>').length < RULE.minWaves[bp.tier]) v.push('keep route: few waves'); });
    const sp = Math.min(...R.keepT.filter(k => k.right).map(k => R.tnt - k.used)); R.spare = sp; if(sp < RULE.spare[bp.tier][0] && R.keepT.filter(k => k.right).every(k => R.tnt - k.used < RULE.spare[bp.tier][0])) v.push(`keep: spare ${sp} TNT`); }
  if(!open40.win && !R.aim && !R.keepT) v.push(`UNWINNABLE for a fair player (${open40.pct}% with 40 TNT)`);
  if(R.aim){ const w = R.aim[0].waves.split('>').length; if(w < RULE.minWaves[bp.tier]) v.push(`aim: only ${w} wave(s)`); if(R.tnt - R.aim[0].used < RULE.spare[bp.tier][0]) v.push(`aim: spare ${R.tnt - R.aim[0].used} TNT`); }
  if(R.fair && !R.aim && !R.keepT){
    const wins = R.fair.filter(f => f.win).length; if(wins < 3 && !R.aim) v.push(`fair player wins ${wins}/3 seeds at ${R.tnt} TNT`);
    const w = Math.min(...R.fair.map(f => f.waves)); if(w < RULE.minWaves[bp.tier]) v.push(`only ${w} wave(s): not enough reads`);
    const e = R.fair[0].estSec, [e0, e1] = RULE.estSec[bp.tier]; if(e < e0 || e > e1) v.push(`est ${e}s outside ${e0}-${e1}s`);
    if(R.fair.some(f => f.keep > RULE.keepMax)) v.push('protected building hit');
    if(R.spare < lo) v.push(`spare ${R.spare} TNT < ${lo}`);
  }
  R.verdict = v.length ? 'FAIL' : 'PASS'; R.issues = v;
  results.push(R); log(bp.id, bp.name, R.verdict, JSON.stringify({ oneBomb: R.oneBomb, lazy: R.lazy.pct, allFoot: R.allFoot && (R.allFoot.pct + (R.allFoot.keep != null ? '/blue' + R.allFoot.keep : '')), footOnly: R.footOnly && (R.footOnly.pct + (R.footOnly.keep != null ? '/blue' + R.footOnly.keep : '')), oneWave: R.oneWave && R.oneWave.pct, keepT: R.keepT && R.keepT.map(k => (k.right ? 'R ' : 'W ') + (k.seq || ((k.part || '') + k.peel + '>' + k.face)) + '=' + k.pct + '%/blue' + k.keep + '/' + k.used + 'tnt/' + k.waves.split('>').length + 'w'), oneWaveKeep: R.oneWave && R.oneWave.keep, aim: R.aim && R.aim.map(a => a.face + '=' + a.pct + '%/' + a.used + 'tnt/' + a.waves.split('>').length + 'w/drums' + a.drums), tnt: R.tnt, fair: R.fair && R.fair.map(f => f.res + ' ' + f.left + 'left ' + f.waves + 'w ' + f.estSec + 's') }), v.join(' | '));
}
S.done();
writeFileSync(OUT + 'results.json', JSON.stringify({ when: new Date().toISOString(), rule: RULE, results }, null, 1));
// tuned budgets -> final levels (test build + release build)
const tuned = BPS.map((bp, k) => make(bp, results[k].tnt || 40));
writeFileSync(OUT + 'levels.json', JSON.stringify(tuned, null, 1));
writeFileSync(OUT + 'index-test.html', buildHtml(tuned, true));
writeFileSync(OUT + 'index-release.html', buildHtml(tuned, false));
log('done', results.filter(r => r.verdict === 'PASS').length + '/' + results.length + ' PASS');
process.exit(0);
