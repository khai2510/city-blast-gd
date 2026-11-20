// node floatcheck.mjs <levels.json> : static decor float check per level (decor piece not touching its member or a sibling)
import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { buildHtml } from './build.mjs';
import { launch, open } from './cdp.mjs';
const lv = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const html = buildHtml(lv, true), port0 = 8830 + Math.floor(Math.random() * 40);
const srv = createServer((q, s) => { s.writeHead(200, { 'content-type': 'text/html' }); s.end(html); }).listen(port0);
const { proc, port } = await launch(9400 + Math.floor(Math.random() * 40)); const pg = await open(port, 'http://127.0.0.1:' + port0 + '/');
for(let i = 0; i < 60; i++){ await new Promise(r => setTimeout(r, 500)); try{ if(await pg.evaluate('!!(window.__blast && __blast.lv7 && __blast.lv7.info)')) break; }catch(e){} }
await new Promise(r => setTimeout(r, 2500));
const b = await pg.evaluate('__blast.lv7.base');
for(let k = 0; k < lv.length; k++){
  console.log(lv[k].name, await pg.evaluate(`(()=>{ __blast.test.play(${b + k},1); __blast.test.run(4); const g=__blast.lv7.kdGap(); const by={}; g.floating.forEach(f=>{ const k=f.split('@')[0]; by[k]=(by[k]||0)+1; }); return JSON.stringify({worst:g.worst, n:g.floating.length, by, sample:g.floating.slice(0,12)}); })()`));
}
pg.close(); proc.kill(); srv.close(); process.exit(0);
