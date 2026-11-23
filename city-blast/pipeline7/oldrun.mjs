// old-polish tester (Agents-Game 22/11, levels-gd/OLD-POLISH.md): the run.mjs tests on one hand-built level at ITS budget (tntStart,
// no auto-tune), plus what the old-polish bars need: the level's own expert plan (L.sol) in ONE blast (and one TNT a blast for a
// double-tap level, L.dbl), the reaction curve, and for a rotate / aim level (L.faces = {right:[face], wrong:[faces]}) a fall
// through two neighbouring ground members of the main building on each face, then a clean-up like a player.
//   CB_BASE=out/base-main.html LEVEL_JSON=../levels-gd/O01/level.json BAR=T node oldrun.mjs [out.json]
import { readFileSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { launch, open } from './cdp.mjs';
import { buildHtml } from './build.mjs';
const lv = JSON.parse(readFileSync(process.env.LEVEL_JSON, 'utf8')), L0 = lv[0], TNT = +(process.env.TNT || L0.tntStart), BAR = process.env.BAR || 'N';
const QUICK = +(process.env.QUICK || 0), SEEDS = (process.env.SEEDS || (QUICK ? '1' : '1,2,3')).split(',').map(Number);   // QUICK=1 (batch 2, 23/11): sol + oneBomb + fair seed 1 only, for tuning rounds
const html = buildHtml(lv, true);
const srv = createServer((q, s) => { s.writeHead(200, { 'content-type': 'text/html' }); s.end(html); }).listen(8792);
const { proc, port } = await launch(9335); const pg = await open(port, 'http://127.0.0.1:8792/');
for(let i = 0; i < 80; i++){ await new Promise(r => setTimeout(r, 500)); try{ if(await pg.evaluate('!!(window.__blast && __blast.lv7 && __blast.lv7.info)')) break; }catch(e){} }
await new Promise(r => setTimeout(r, 2500));
await pg.evaluate(readFileSync(new URL('./tester.js', import.meta.url), 'utf8'));
await pg.evaluate(`window.P7tap = false`);
const t0 = Date.now(), log = (...a) => console.log(((Date.now() - t0) / 1000).toFixed(0).padStart(4) + 's', ...a);
const idx = await pg.evaluate('__blast.lv7.base'), J = async (e) => JSON.parse(await pg.evaluate(e));
const R = { bp: L0.bp, name: L0.name, tnt: TNT, bar: BAR };
// the expert plan: every sol entry in one blast (or one blast per entry: L.dbl), at the level's budget
const solRun = (perBlast) => J(`(()=>{ const T=__blast.test, L=__blast.lv7.L()[${idx}], k=L.charges.tnt; L.charges={tnt:${TNT}}; T.play(${idx},1); L.charges={tnt:k}; T.run(6); let r, used=0, waves=0;
  const sol=L.sol; if(${perBlast}){ for(const e of sol){ const s=__blast.state(); if(s.phase!=='plan') break; used+=T.solve([e]); T.fire(); r=T.run(25); waves++; } } else { used=T.solve(sol); T.fire(); r=T.run(25); waves=1; }
  const s=__blast.state(); return JSON.stringify({ pct:Math.round(100*s.pct), win:!!(s.result&&s.result.ok), res:s.result?(s.result.ok?'WIN':'LOSE '+s.result.code):s.phase, placed:used, waves, keep:Math.round(100*(s.collateral||0)) }); })()`);
R.metrics = await J(`JSON.stringify(P7.metrics(${idx}))`);
R.sol = await solRun(false); if(L0.dbl) R.solDbl = await solRun(true); log('sol', JSON.stringify(R.sol), JSON.stringify(R.solDbl || ''));
R.oneBomb = await J(`JSON.stringify(P7.oneBomb(${idx}, 18))`); R.lazy = await J(`JSON.stringify(P7.lazy(${idx}))`); log('oneBomb', JSON.stringify(R.oneBomb), 'lazy', R.lazy.pct);
R.fair = []; for(const s of SEEDS) R.fair.push(await J(`P7.fair(${idx}, ${TNT}, ${s}).then(JSON.stringify)`)); log('fair', R.fair.map(f => f.res + ' ' + f.left + 'left ' + f.waves + 'w ' + f.estSec + 's keep' + f.keep).join(' | '));
if(!QUICK){ R.allFoot = await J(`JSON.stringify(P7.allFoot(${idx}, ${TNT}))`); R.footOnly = await J(`JSON.stringify(P7.footOnly(${idx}, ${TNT}))`); R.oneWave = await J(`JSON.stringify(P7.oneWave(${idx}, ${TNT}, false))`);
log('allFoot', R.allFoot.pct, 'footOnly', R.footOnly.pct, 'oneWave', R.oneWave.pct);
R.curve = await J(`JSON.stringify(P7.curve(${idx}))`); log('curve', R.curve.map(c => c.n + ':' + c.pct).join(' ')); } else { R.allFoot = R.footOnly = R.oneWave = { pct: 0 }; R.curve = []; }
if(L0.faces){
  // a fall through two neighbouring ground members of A on a face (selectMembers 'A:<face>' floor 0, the middle pair), one blast, then clean-up
  const faceRun = (face) => J(`(()=>{ const T=__blast.test, L=__blast.lv7.L()[${idx}], k=L.charges.tnt; L.charges={tnt:${TNT}}; T.play(${idx},1); L.charges={tnt:k}; T.run(6);
    const m=T.select('${(L0.faces && L0.faces.part) || 'A'}:${face}',0), n=m.length, a=Math.max(0,Math.floor(n/2)-1); let used=0; [a,a+1].forEach(j=>{ if(m[j]){ T.placeOn('tnt', m[j].i, m[j].nx, m[j].nz); used++; } }); T.fire(); let r=T.run(25); const first=Math.round(100*r.pct), keep1=Math.round(100*(__blast.state().collateral||0));
    for(let w=0; w<6 && r.phase==='plan' && __blast.state().left>0; w++){ const inf=__blast.lv7.info(); const left=inf.filter(b=>!b.an&&!b.kp&&!b.dead&&b.bid&&(b.st||b.y>1.5)&&b.h>0.5).sort((x,y)=>y.m-x.m); const pick=[];
      for(const b of left){ if(pick.length>=Math.min(3,__blast.state().left)) break; if(pick.some(u=>Math.hypot(u.x-b.x,u.y-b.y,u.z-b.z)<3)) continue; pick.push(b); }
      if(!pick.length) break; pick.forEach(b=>{ T.charge('tnt', b.i, 0, 1, 0); used++; }); T.fire(); r=T.run(25); }
    const s=__blast.state(); return JSON.stringify({ face:'${face}', first, keep1, pct:Math.round(100*s.pct), win:!!(s.result&&s.result.ok), res:s.result?(s.result.ok?'WIN':'LOSE '+s.result.code):s.phase, used, keep:Math.round(100*(s.collateral||0)) }); })()`);
  R.faces = []; for(const f of L0.faces.right) R.faces.push(Object.assign({ right: 1 }, await faceRun(f))); for(const f of L0.faces.wrong) R.faces.push(Object.assign({ right: 0 }, await faceRun(f)));
  log('faces', R.faces.map(f => (f.right ? 'R ' : 'W ') + f.face + ' first' + f.first + ' ' + f.res + ' ' + f.pct + '% blue' + f.keep).join(' | '));
}
// verdicts: T = tutorial (oneBomb < 70, fair 3/3 spare >= 1, the plan wins), N = Normal (+ allFoot / footOnly < 80, spare >= 2, 20-75 s, curve)
const v = [], fw = R.fair.filter(f => f.win).length, spare = Math.min(...R.fair.map(f => f.left)), est = R.fair.map(f => f.estSec);
if(R.oneBomb.pct >= 70) v.push('oneBomb ' + R.oneBomb.pct + '%');
if(!(R.sol.win || (R.solDbl && R.solDbl.win))) v.push('expert plan ' + R.sol.res + ' ' + R.sol.pct + '%');
if(!L0.faces){ if(fw < SEEDS.length) v.push('fair ' + fw + '/' + SEEDS.length); if(spare < (BAR === 'T' ? 1 : 2)) v.push('spare ' + spare); if(R.fair.some(f => f.keep > 0.05)) v.push('fair hits the blue'); }
else { R.faces.forEach(f => { if(f.right && (!f.win || f.keep > 5)) v.push('right face ' + f.face + ' ' + f.res + ' ' + f.pct + '%'); if(!f.right && f.win) v.push('wrong face ' + f.face + ' wins'); }); }
if(BAR !== 'T' && process.env.FOOT !== '0'){ if(R.allFoot.pct >= 80 && !(R.allFoot.keep > 5)) v.push('allFoot ' + R.allFoot.pct + '%'); if(R.footOnly.pct >= 80 && !(R.footOnly.keep > 5)) v.push('footOnly ' + R.footOnly.pct + '%');
  if(!L0.faces && est.some(e => e < 20 || e > 75)) v.push('est ' + est.join('/') + 's');
  let jump = 0; for(let k = 1; k < R.curve.length; k++) jump = Math.max(jump, R.curve[k].pct - R.curve[k - 1].pct); R.jump = jump; if(jump > 40) v.push('curve jump +' + jump); }
R.verdict = v.length ? 'MISS' : 'PASS'; R.issues = v;
log(R.bp, R.verdict, v.join(' | '));
writeFileSync(process.argv[2] || new URL('./out/oldrun-' + R.bp + '.json', import.meta.url).pathname, JSON.stringify(Object.assign({ when: new Date().toISOString() }, R), null, 1));
pg.close(); proc.kill(); srv.close(); process.exit(0);
