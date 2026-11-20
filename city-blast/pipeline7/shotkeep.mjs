// node shotkeep.mjs <levels.json> <peel> <fx> <fz> <budget> <outPrefix> <n1,n2,...> : screenshot the keep route after n waves
import { readFileSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { buildHtml } from './build.mjs';
import { launch, open } from './cdp.mjs';
const [, , lj, peel, fx, fz, bud, pre, ns] = process.argv;
const html = buildHtml(JSON.parse(readFileSync(lj, 'utf8')), true), port0 = 8870 + Math.floor(Math.random() * 40);
const srv = createServer((q, s) => { s.writeHead(200, { 'content-type': 'text/html' }); s.end(html); }).listen(port0);
const { proc, port } = await launch(9450 + Math.floor(Math.random() * 40)); const pg = await open(port, 'http://127.0.0.1:' + port0 + '/');
for(let i = 0; i < 60; i++){ await new Promise(r => setTimeout(r, 500)); try{ if(await pg.evaluate('!!(window.__blast && __blast.lv7 && __blast.lv7.info)')) break; }catch(e){} }
await new Promise(r => setTimeout(r, 2500));
await pg.evaluate(readFileSync(new URL('./tester.js', import.meta.url), 'utf8'));
const b = await pg.evaluate('__blast.lv7.base');
for(const n of ns.split(',').map(Number)){
  console.log(n, await pg.evaluate(`JSON.stringify(P7.keepT(${b}, ${fx}, ${fz}, ${bud}, ${JSON.stringify(peel.split(''))}, ${process.env.ANY ? 1 : 0}, ${n}, ${JSON.stringify(process.env.PART || "A")}))`));
  await pg.evaluate(`__blast.lv7.syncDraw && __blast.lv7.syncDraw(); __blast.lv7.view(${process.env.VIEW || 0})`);
  await new Promise(r => setTimeout(r, 1500));
  writeFileSync(pre + n + '.png', Buffer.from(await pg.shot(), 'base64'));
}
pg.close(); proc.kill(); srv.close(); process.exit(0);
