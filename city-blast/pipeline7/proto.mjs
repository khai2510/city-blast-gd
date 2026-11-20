// prototype: one rack7 building (steel frame + loose elements of mixed hardness), measured by the same tester
import { writeFileSync, readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { buildHtml } from './build.mjs';
import { launch, open } from './cdp.mjs';
const items = [];
const BX = 3, BZ = 2, N = 5;
for(let f = 0; f < N; f++) for(let i = 0; i < BX; i++) for(let j = 0; j < BZ; j++){
  if(j === BZ - 1 && f < 2) items.push([f, i, j, 'glass', 2.1, 2.1, 0.14, 0, 1.12]);                       // front layer: glass facade
  const corner = i === 0 || i === BX - 1;
  if(corner && (f === 1 || f === 3)) { items.push([f, i, j, 'rc', 0.9, 1.7, 0.9, 0, -0.3]); continue; }   // hard: direct hit only
  const key = f === N - 1 ? 'drum7' : f < 2 ? 'concrete' : 'bkw', s = key === 'drum7' ? 1.0 : 1.1;
  items.push([f, i, j, key, s, s, s, -0.5, -0.3]); items.push([f, i, j, key, s, s, s, 0.6, -0.3]);
}
const lvl = { name: 'Rack Proto', f: N, tier: 'N', kind: 'scene', hero: 'A', heroId: 'F04', teaches: null, target: 0.85, yaw: 0.35, d: 1, fillMax: 0.73,
  parts: [{ id: 'A', kind: 'rack7', x: 0, z: 0, bx: BX, bz: BZ, floors: N, fh: 2.7, items }], charges: { tnt: 40 }, tip: 'proto', rack7: true, sol: [['tnt', 'A:z+', 0, 0]] };
const html = buildHtml([lvl], true);
const srv = createServer((q, s) => { s.writeHead(200, { 'content-type': 'text/html' }); s.end(html); }).listen(8795);
const { proc, port } = await launch(9338); const pg = await open(port, 'http://127.0.0.1:8795/');
for(let i = 0; i < 60; i++){ await new Promise(r => setTimeout(r, 500)); try{ if(await pg.evaluate('!!(window.__blast && __blast.lv7 && __blast.lv7.info)')) break; }catch(e){} }
await new Promise(r => setTimeout(r, 2500));
await pg.evaluate(readFileSync(new URL('./tester.js', import.meta.url), 'utf8'));
const idx = await pg.evaluate('__blast.lv7.base');
await pg.evaluate(`(async()=>{ __blast.test.load(${idx},1); __blast.test.run(4); await new Promise(r=>setTimeout(r,1500)); return 1; })()`);
writeFileSync(new URL('./out/proto.jpg', import.meta.url), Buffer.from(await pg.shot(), 'base64'));
const J = async e => JSON.parse(await pg.evaluate(e));
const st = await J(`(()=>{ __blast.test.play(${idx},1); __blast.test.run(6); const B=__blast.lv7.info().filter(b=>!b.an&&!b.kp); return JSON.stringify({n:B.length, standing:B.filter(b=>b.st).length, links:__blast.test.bonds()}); })()`);
console.log('settle', JSON.stringify(st));
console.log('oneBomb', JSON.stringify(await J(`JSON.stringify(P7.oneBomb(${idx}, 12))`)));
for(const n of [10, 14, 18]) console.log('allFoot', n, JSON.stringify(await J(`JSON.stringify(P7.allFoot(${idx}, ${n}))`)));
console.log('fair40', JSON.stringify(JSON.parse(await pg.evaluate(`P7.fair(${idx}, 40, 1).then(JSON.stringify)`))));
const left = await J(`(()=>{ const B=__blast.lv7.info().filter(b=>!b.an&&!b.kp&&!b.dead&&!(b.y<1.5 && b.sy-b.y>1.2)); const g={}; B.forEach(b=>{const k=b.key+(b.st?'/stand':'/fallen')+'@y'+Math.round(b.y); g[k]=(g[k]||0)+1;}); const M=__blast.members(); return JSON.stringify({left:g, pickable:M.filter(m=>m.pickable&&!m.keep).length}); })()`);
console.log('remaining', JSON.stringify(left));
console.log('errors', pg.logs.slice(0, 3));
pg.close(); proc.kill(); srv.close(); process.exit(0);
