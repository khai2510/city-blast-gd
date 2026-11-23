// gate50.mjs <levels-gd/Exx dir> (Agents-Game 23/11, SLOTS-50 easy gate; CB_BASE / CB_LIBS / CHROME as run.mjs; env SOLS = candidate expert plans) : SLOTS-50 easy-pack gate in ONE Chrome session: rest (8 s) + pad, budget calibration (fair at 40, 3 seeds),
// expert plan (sol, one blast), fair 3 seeds at the budget (bump until spare holds), oneBomb, lazy, allFoot, footOnly, oneWave, curve,
// shots (open / sol mid / sol after, 393x852 jpg). env BAR=T|N, STEPS=1 (>= 2 blasts wanted), TNT=fixed budget.
import { readFileSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
const P7 = new URL('./', import.meta.url).pathname;
const { buildHtml } = await import(P7 + 'build.mjs');
const { launch, open } = await import(P7 + 'cdp.mjs');
const dir = process.argv[2], lv = JSON.parse(readFileSync(dir + '/level.json', 'utf8')), L0 = lv[0];
const BAR = process.env.BAR || 'N', STEPS = !!+process.env.STEPS, lo = BAR === 'T' ? 1 : 2;
const html = buildHtml(lv, true);
const port0 = 8930 + Math.floor(Math.random() * 30);
const srv = createServer((q, s) => { s.writeHead(200, { 'content-type': 'text/html' }); s.end(html); }).listen(port0);
const { proc, port } = await launch(9500 + Math.floor(Math.random() * 40)); const pg = await open(port, 'http://127.0.0.1:' + port0 + '/');
const t0 = Date.now(), log = (...a) => console.log(((Date.now() - t0) / 1000).toFixed(0).padStart(4) + 's', ...a);
const R = { bp: L0.bp, name: L0.name, slot: L0.slot, bar: BAR, steps: STEPS };
try {
await pg.send('Emulation.setDeviceMetricsOverride', { width: 393, height: 852, deviceScaleFactor: 1, mobile: true });
for(let i = 0; i < 80; i++){ await new Promise(r => setTimeout(r, 500)); try{ if(await pg.evaluate('!!(window.__blast && __blast.lv7 && __blast.lv7.info)')) break; }catch(e){} }
await new Promise(r => setTimeout(r, 3000));
await pg.evaluate(readFileSync(P7 + 'tester.js', 'utf8')); await pg.evaluate('window.P7tap = false');
const idx = await pg.evaluate('__blast.lv7.base'), J = async (e) => JSON.parse(await pg.evaluate(e));
R.rest = await J(`(()=>{ const T=__blast.test; T.play(${idx},1); const bonds=()=>T.bodies().reduce((a,b)=>a+(b.bonds||0),0); const a=__blast.lv7.info(), b0=bonds(); T.step(480); const b=__blast.lv7.info(), b1=bonds();
  let dead=0, moved=0, l=[]; b.forEach((m,i)=>{ if(m.an||m.kp) return; if(m.dead&&!a[i].dead){dead++; l.push(m.key+'@'+m.bid+' dead');} else if(Math.hypot(m.x-a[i].x,m.y-a[i].y,m.z-a[i].z)>0.3){moved++; l.push(m.key+'@'+m.bid+' f'+m.f+' moved');} });
  const keys={}, mass={}; b.forEach(m=>{ if(m.an) return; const k=(m.kp?'keep:':'')+m.key; keys[k]=(keys[k]||0)+1; if(!m.kp) mass[m.bid]=(mass[m.bid]||0)+m.m; });
  let x0=1e9,x1=-1e9,z0=1e9,z1=-1e9,rm=0,who=''; a.forEach(m=>{ if(m.an) return; x0=Math.min(x0,m.sx-m.hx); x1=Math.max(x1,m.sx+m.hx); z0=Math.min(z0,m.sz-m.hz); z1=Math.max(z1,m.sz+m.hz); const r=Math.hypot(Math.abs(m.sx)+m.hx,Math.abs(m.sz)+m.hz); if(r>rm){rm=r; who=m.key+'@'+(m.kp?'keep':m.bid);} });
  return JSON.stringify({ dead, moved, bonds:[b0,b1], list:l.slice(0,8), keys, mass, members:b.filter(m=>!m.an&&!m.kp).length, pad:{ x:[+x0.toFixed(1),+x1.toFixed(1)], z:[+z0.toFixed(1),+z1.toFixed(1)], rmax:+rm.toFixed(1), at:who } }); })()`);
log('rest', JSON.stringify({ dead: R.rest.dead, moved: R.rest.moved, bonds: R.rest.bonds, pad: R.rest.pad, list: R.rest.list }));
let TNT = +(process.env.TNT || 0);
if(!TNT){ R.cal = []; for(const s of [1, 2, 3]) R.cal.push(await J(`P7.fair(${idx}, 40, ${s}).then(JSON.stringify)`));
  TNT = Math.max(...R.cal.map(f => f.used)) + lo; log('calibrate', R.cal.map(f => f.res + ' used' + f.used + ' ' + f.waves + 'w').join(' | '), '-> TNT', TNT); }
for(let bump = 0; bump <= 4; bump++){
  R.fair = []; for(const s of [1, 2, 3]) R.fair.push(await J(`P7.fair(${idx}, ${TNT}, ${s}).then(JSON.stringify)`));
  if(process.env.TNT || (R.fair.every(f => f.win) && Math.min(...R.fair.map(f => f.left)) >= lo)) break; TNT++; }
R.tnt = TNT; log('fair @' + TNT, R.fair.map(f => f.res + ' ' + f.pct + '% ' + f.left + 'left ' + f.waves + 'w ' + f.estSec + 's keep' + f.keep).join(' | '));
const CANDS = process.env.SOLS ? JSON.parse(process.env.SOLS) : null;
if(CANDS){ R.solTry = []; for(const c of CANDS.sort((x, y) => x.length - y.length)){ const r = await J(`(()=>{ const T=__blast.test, L=__blast.lv7.L()[${idx}], k=L.charges.tnt; L.charges={tnt:${TNT}}; T.play(${idx},1); L.charges={tnt:k}; T.run(6); T.solve(${JSON.stringify(c)}); T.fire(); T.run(25); const s=__blast.state(); return JSON.stringify({ pct:Math.round(100*s.pct), win:!!(s.result&&s.result.ok), keep:Math.round(100*(s.collateral||0)) }); })()`); R.solTry.push({ sol: c, r }); log('try', c.length, JSON.stringify(r)); if(r.win){ await pg.evaluate(`__blast.lv7.L()[${idx}].sol = ${JSON.stringify(c)}`); lv[0].sol = c; R.solPick = c; break; } } }
R.sol = await J(`(()=>{ const T=__blast.test, L=__blast.lv7.L()[${idx}], k=L.charges.tnt; L.charges={tnt:${TNT}}; T.play(${idx},1); L.charges={tnt:k}; T.run(6); const used=T.solve(L.sol||[]); T.fire(); const r=T.run(25); const s=__blast.state(); return JSON.stringify({ pct:Math.round(100*s.pct), win:!!(s.result&&s.result.ok), res:s.result?(s.result.ok?'WIN':'LOSE '+s.result.code):s.phase, placed:used.length, keep:Math.round(100*(s.collateral||0)) }); })()`);
log('sol', JSON.stringify(R.sol));
R.oneBomb = await J(`JSON.stringify(P7.oneBomb(${idx}, 18))`); R.lazy = await J(`JSON.stringify(P7.lazy(${idx}))`);
R.allFoot = await J(`JSON.stringify(P7.allFoot(${idx}, ${TNT}))`); R.footOnly = await J(`JSON.stringify(P7.footOnly(${idx}, ${TNT}))`); R.oneWave = await J(`JSON.stringify(P7.oneWave(${idx}, ${TNT}, false))`);
R.curve = await J(`JSON.stringify(P7.curve(${idx}))`);
let jump = 0; for(let k = 1; k < R.curve.length; k++) jump = Math.max(jump, R.curve[k].pct - R.curve[k - 1].pct); R.jump = jump;
log('oneBomb', R.oneBomb.pct, 'lazy', R.lazy.pct, 'allFoot', R.allFoot.pct + (R.allFoot.keep != null ? '/blue' + R.allFoot.keep : ''), 'footOnly', R.footOnly.pct, 'oneWave', R.oneWave.pct, 'curve', R.curve.map(c => c.n + ':' + c.pct).join(' '), 'jump', jump);
// shots
if(process.env.SHOTS !== '0'){
  await pg.evaluate(`(async()=>{ __blast.test.load(${idx},1); __blast.test.run(4); await new Promise(r=>setTimeout(r,2500)); return 1; })()`);
  writeFileSync(dir + '/shot-open.jpg', Buffer.from(await pg.shot(), 'base64'));
  if((L0.sol || []).length){
    await pg.evaluate(`(async()=>{ const T=__blast.test, L=__blast.lv7.L()[${idx}], k=L.charges.tnt; L.charges={tnt:${TNT}}; T.play(${idx},1); L.charges={tnt:k}; T.run(4); T.solve(L.sol); T.fire(); T.step(150); await new Promise(r=>setTimeout(r,1500)); return 1; })()`);
    writeFileSync(dir + '/shot-blast1-mid.jpg', Buffer.from(await pg.shot(), 'base64'));
    await pg.evaluate(`(async()=>{ __blast.test.run(25); await new Promise(q=>setTimeout(q,1500)); return 1; })()`);
    writeFileSync(dir + '/shot-blast1.jpg', Buffer.from(await pg.shot(), 'base64'));
  }
}
// verdicts (easy-pack bar per SLOTS-50 slot band; reported-only rows are not misses)
const v = [], rep = [], fw = R.fair.filter(f => f.win).length, spare = Math.min(...R.fair.map(f => f.left)), waves = R.fair.map(f => f.waves), est = R.fair.map(f => f.estSec);
if(R.oneBomb.pct >= 70) v.push('oneBomb ' + R.oneBomb.pct + '%');
if(fw < 3) v.push('fair ' + fw + '/3'); if(spare < lo) v.push('spare ' + spare); if(R.fair.some(f => f.keep > 5)) v.push('fair hits the blue');
if(!STEPS && !R.sol.win) v.push('expert plan in one blast ' + R.sol.res + ' ' + R.sol.pct + '%');
if(STEPS && Math.min(...waves) < 2) v.push('fair blasts ' + waves.join('/') + ' (want >= 2)');
if(est.some(e => e < 20 || e > 75)) (STEPS ? v : rep).push('est ' + est.join('/') + ' s');
if(jump > 40) rep.push('curve jump +' + jump);
if(R.allFoot.pct >= 80 && !(R.allFoot.keep > 5)) rep.push('allFoot ' + R.allFoot.pct + '%'); if(R.footOnly.pct >= 80 && !(R.footOnly.keep > 5)) rep.push('footOnly ' + R.footOnly.pct + '%');
if(R.rest.dead || R.rest.bonds[0] !== R.rest.bonds[1]) v.push('at rest: ' + R.rest.dead + ' dead, bonds ' + R.rest.bonds.join('>'));
R.verdict = v.length ? 'MISS' : 'PASS'; R.issues = v; R.reported = rep;
log(R.bp, R.verdict, v.join(' | '), '· reported:', rep.join(' | '));
} catch(e){ R.err = String(e).slice(0, 500); log('ERR', R.err); }
writeFileSync(dir + '/results-slots50.json', JSON.stringify(Object.assign({ when: new Date().toISOString() }, R), null, 1));
pg.close(); proc.kill(); srv.close(); process.exit(0);
