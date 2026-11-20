// node aimprobe.mjs <levels.json> <budget> : tip the tower each way, then clean up (L02 lesson test)
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
const base = await pg.evaluate('__blast.lv7.base');
console.log(await pg.evaluate(`(()=>{ const r=P7.aim(${base},1,0,26); const I=__blast.lv7.info(); const left=I.filter(b=>!b.dead&&b.bid&&b.key!=="tank").filter(b=>b.key==="hard7i"||b.st||b.y>1.5); const g={}; left.forEach(b=>{const k=b.bid+":"+b.key+(b.st?":st":":down")+(b.y>1.5?":hi":""); g[k]=(g[k]||0)+Math.round(b.m/1000);}); return JSON.stringify({r,g, hardLeft:left.filter(b=>b.key==="hard7i").map(b=>b.x.toFixed(1)+","+b.z.toFixed(1)+(b.st?"st":"")) }); })()`));
pg.close(); proc.kill(); srv.close(); process.exit(0);
