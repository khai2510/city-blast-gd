// node keepprobe.mjs <levels.json> <budget> : L03 lesson test (peel, tip away, clean up) + big-blast checks
import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { buildHtml } from './build.mjs';
import { launch, open } from './cdp.mjs';
const lv = JSON.parse(readFileSync(process.argv[2], 'utf8')), bud = +process.argv[3] || 30;
const html = buildHtml(lv, true), port0 = 8830 + Math.floor(Math.random() * 40);
const srv = createServer((q, s) => { s.writeHead(200, { 'content-type': 'text/html' }); s.end(html); }).listen(port0);
const { proc, port } = await launch(9400 + Math.floor(Math.random() * 40)); const pg = await open(port, 'http://127.0.0.1:' + port0 + '/');
for(let i = 0; i < 60; i++){ await new Promise(r => setTimeout(r, 500)); try{ if(await pg.evaluate('!!(window.__blast && __blast.lv7 && __blast.lv7.info)')) break; }catch(e){} }
await new Promise(r => setTimeout(r, 2500));
await pg.evaluate(readFileSync(new URL('./tester.js', import.meta.url), 'utf8'));
const b = await pg.evaluate('__blast.lv7.base');
const runs = (process.env.RUNS || 'R:-1,0;F:0,1;D:0,-1;:1,0;wave').split(';');
for(const q of runs){
  if(q === 'wave'){ console.log('oneWave tap', await pg.evaluate(`JSON.stringify(Object.assign(P7.oneWave(${b}, ${bud}, true), {keep: Math.round(100*__blast.test.collateral())}))`)); continue; }
  if(q === 'waveAll'){ console.log('oneWave all', await pg.evaluate(`JSON.stringify(Object.assign(P7.oneWave(${b}, ${bud}, false), {keep: Math.round(100*__blast.test.collateral())}))`)); continue; }
  const [peel, f] = q.split(':'); const [fx, fz] = f.split(',').map(Number);
  console.log(await pg.evaluate(`JSON.stringify(P7.keepT(${b}, ${fx}, ${fz}, ${bud}, ${JSON.stringify(peel ? peel.split('') : [])}, ${process.env.ANY ? 1 : 0}, null, ${JSON.stringify(process.env.PART || "A")}))`));
}
pg.close(); proc.kill(); srv.close(); process.exit(0);
