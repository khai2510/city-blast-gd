// prototype v4: a bonded concrete building that collapses, hard members built in (corners at the foot, a hard floor, hard upper corners)
import { writeFileSync, readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { buildHtml } from './build.mjs';
import { launch, open } from './cdp.mjs';
const C = (cx, cz) => { const o = {}; [[0, 0], [cx - 1, 0], [0, cz - 1], [cx - 1, cz - 1]].forEach(([i, j]) => o[i + ',' + j] = 'hard7'); return o; };
const variant = process.argv[2] || 'a';
const tiersB = [{ f: 2, cx: 3, cz: 2, mat: 'conc', skin: 'alt', cols: C(3, 2) }, { f: 1, cx: 3, cz: 2, mat: 'conc', skin: 'alt', cols: C(3, 2), slab: 'hard7s' },
  { f: 1, cx: 3, cz: 2, mat: 'conc', skin: 'alt', cols: C(3, 2) }, { f: 1, cx: 3, cz: 2, mat: 'conc', skin: 'alt', cols: C(3, 2), slab: 'hard7s' }, { f: 1, cx: 3, cz: 2, mat: 'conc', skin: 'alt', cols: C(3, 2) }];
const tiersC = tiersB.map(t => Object.assign({}, t, { cz: 3, cols: C(3, 3) }));
const tiersA = [{ f: 3, cx: 3, cz: 2, mat: 'conc', skin: 'alt', cols: C(3, 2), colsF: 1 }, { f: 1, cx: 3, cz: 2, mat: 'conc', skin: 'alt', slab: 'hard7s' }, { f: 2, cx: 3, cz: 2, mat: 'conc', skin: 'alt', cols: C(3, 2) }];
const lvl = { name: 'Proto4', f: 6, tier: 'N', kind: 'scene', hero: 'A', heroId: 'F04', teaches: null, target: 0.85, yaw: 0.35, d: 1, fillMax: 0.73, hard7: true,
  parts: [{ id: 'A', kind: 'mass', x: 0, tiers: variant === 'c' ? tiersC : variant === 'b' ? tiersB : tiersA, fh: 2.7 }, { id: 'B', kind: 'mass', x: -10, tiers: [{ f: 3, cx: 2, cz: 2, mat: 'wood', skin: 'alt' }], fh: 2.7 }],
  charges: { tnt: 40 }, tip: 'proto', sol: [['tnt', 'A:z+', 0, 0]] };
const html = buildHtml([lvl], true);
const srv = createServer((q, s) => { s.writeHead(200, { 'content-type': 'text/html' }); s.end(html); }).listen(8797);
const { proc, port } = await launch(9340); const pg = await open(port, 'http://127.0.0.1:8797/');
for(let i = 0; i < 60; i++){ await new Promise(r => setTimeout(r, 500)); try{ if(await pg.evaluate('!!(window.__blast && __blast.lv7 && __blast.lv7.info)')) break; }catch(e){} }
await new Promise(r => setTimeout(r, 2500));
await pg.evaluate(readFileSync(new URL('./tester.js', import.meta.url), 'utf8'));
const idx = await pg.evaluate('__blast.lv7.base');
await pg.evaluate(`(async()=>{ __blast.test.load(${idx},1); __blast.test.run(4); await new Promise(r=>setTimeout(r,1500)); return 1; })()`);
writeFileSync(new URL('./out/proto4.jpg', import.meta.url), Buffer.from(await pg.shot(), 'base64'));
const J = async e => JSON.parse(await pg.evaluate(e));
console.log('share', JSON.stringify(await J(`(()=>{ __blast.test.play(${idx},1); __blast.test.run(6); const B=__blast.lv7.info().filter(b=>!b.an&&!b.kp); const tot=B.reduce((a,b)=>a+b.m,0), h=B.filter(b=>/^hard7/.test(b.key)); const hm=h.reduce((a,b)=>a+b.m,0); return JSON.stringify({n:B.length, hard:h.length, hardMassPct:Math.round(100*hm/tot), hardAboveFootPct:Math.round(100*h.filter(b=>b.f>0).reduce((a,b)=>a+b.m,0)/tot)}); })()`)));
console.log('oneBomb', JSON.stringify(await J(`JSON.stringify(P7.oneBomb(${idx}, 14))`)));
for(const n of [10, 16, 22]) console.log('allFoot', n, JSON.stringify(await J(`JSON.stringify(P7.allFoot(${idx}, ${n}))`)));
console.log('footOnly 20', JSON.stringify(await J(`JSON.stringify(P7.footOnly(${idx}, 20))`)));
console.log('fair40', await pg.evaluate(`P7.fair(${idx}, 40, 1).then(JSON.stringify)`));
console.log('left', await pg.evaluate(`(()=>{ const B=__blast.lv7.info().filter(b=>!b.an&&!b.kp&&!b.dead); const g={}; B.forEach(b=>{ const k=b.bid+':'+b.key+(b.st?'/stand':'/down')+'@y'+Math.round(b.y); g[k]=(g[k]||0)+1; }); return JSON.stringify(g); })()`));
console.log('errors', pg.logs.slice(0, 3));
pg.close(); proc.kill(); srv.close(); process.exit(0);
