// the fair player (tester.js P7.fair) on OLD levels of the base build (index list), at their own budget: old-polish comparison.
//   CB_BASE=out/base-main.html IDX=0,1,2 node oldfair.mjs
import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { launch, open } from './cdp.mjs';
import { buildHtml } from './build.mjs';
const html = buildHtml([JSON.parse(readFileSync('../levels-gd/O01/level.json', 'utf8'))[0]], true);
const srv = createServer((q, s) => { s.writeHead(200, { 'content-type': 'text/html' }); s.end(html); }).listen(8794);
const { proc, port } = await launch(9337); const pg = await open(port, 'http://127.0.0.1:8794/');
for(let i = 0; i < 80; i++){ await new Promise(r => setTimeout(r, 500)); try{ if(await pg.evaluate('!!(window.__blast && __blast.lv7 && __blast.lv7.info)')) break; }catch(e){} }
await new Promise(r => setTimeout(r, 2500)); await pg.evaluate(readFileSync(new URL('./tester.js', import.meta.url), 'utf8'));
for(const i of (process.env.IDX || '0,1,2').split(',').map(Number)){
  const r = [];
  for(const s of [1, 2, 3]) r.push(JSON.parse(await pg.evaluate(`(async()=>{ const L=__blast.lv7.L()[${i}]; const t=(L.charges&&L.charges.tnt)||5; const f=await P7.fair(${i}, t, ${s}); f.name=L.name; f.tnt=t; return JSON.stringify(f); })()`)));
  console.log('old L' + (i + 1), r[0].name, r[0].tnt + ' TNT', r.map(f => f.res + ' ' + f.pct + '% ' + f.left + 'left ' + f.waves + 'w').join(' | '));
}
pg.close(); proc.kill(); srv.close(); process.exit(0);
