import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { buildHtml } from './build.mjs';
import { launch, open } from './cdp.mjs';
const lv = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const html = buildHtml(lv, true);
const srv = createServer((q, s) => { s.writeHead(200, { 'content-type': 'text/html' }); s.end(html); }).listen(8800);
const { proc, port } = await launch(9343); const pg = await open(port, 'http://127.0.0.1:8800/');
for(let i = 0; i < 60; i++){ await new Promise(r => setTimeout(r, 500)); try{ if(await pg.evaluate('!!(window.__blast && __blast.lv7 && __blast.lv7.info)')) break; }catch(e){} }
await new Promise(r => setTimeout(r, 2500));
console.log(await pg.evaluate(`(()=>{ const i0=__blast.lv7.base; __blast.test.play(i0,1); __blast.test.run(6); const B=__blast.lv7.info().filter(b=>!b.an&&!b.kp); const g={}; let tot=0; B.forEach(b=>{ g[b.key]=(g[b.key]||0)+b.m; tot+=b.m; }); const out={}; Object.keys(g).sort((a,b)=>g[b]-g[a]).forEach(k=>out[k]=Math.round(100*g[k]/tot)+'%'); return JSON.stringify({totT:Math.round(tot/1000), share:out}); })()`));
pg.close(); proc.kill(); srv.close(); process.exit(0);
