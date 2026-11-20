// node curveprobe.mjs <levels.json> : the bomb-count response curve of each level's main building
import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { buildHtml } from './build.mjs';
import { launch, open } from './cdp.mjs';
const lv = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const html = buildHtml(lv, true);
const port0 = 8802 + Math.floor(Math.random() * 50);
const srv = createServer((q, s) => { s.writeHead(200, { 'content-type': 'text/html' }); s.end(html); }).listen(port0);
const { proc, port } = await launch(9350 + Math.floor(Math.random() * 40)); const pg = await open(port, 'http://127.0.0.1:' + port0 + '/');
for(let i = 0; i < 60; i++){ await new Promise(r => setTimeout(r, 500)); try{ if(await pg.evaluate('!!(window.__blast && __blast.lv7 && __blast.lv7.info)')) break; }catch(e){} }
await new Promise(r => setTimeout(r, 2500));
await pg.evaluate(readFileSync(new URL('./tester.js', import.meta.url), 'utf8'));
const base = await pg.evaluate('__blast.lv7.base');
for(let k = 0; k < lv.length; k++){
  const c = JSON.parse(await pg.evaluate(`JSON.stringify(P7.curve(${base + k}, null, ${process.env.ALLPARTS ? 'true' : 'false'}))`));
  console.log(lv[k].name.padEnd(22), c.map(p => p.n + ':' + p.pct + '%/' + p.collapse + 'c').join('  '));
}
pg.close(); proc.kill(); srv.close(); process.exit(0);
