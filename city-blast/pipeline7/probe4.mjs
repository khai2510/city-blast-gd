import { readFileSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { launch, open } from './cdp.mjs';
const html = readFileSync(process.argv[2]);
const srv = createServer((q, s) => { s.writeHead(200, { 'content-type': 'text/html' }); s.end(html); }).listen(8811);
const { proc, port } = await launch(9364); const pg = await open(port, 'http://127.0.0.1:8811/');
for(let i = 0; i < 60; i++){ await new Promise(r => setTimeout(r, 500)); try{ if(await pg.evaluate('!!(window.__blast && __blast.lv7)')) break; }catch(e){} }
await new Promise(r => setTimeout(r, 3000));
const r = await pg.evaluate(`(()=>{ __blast.test.play(__blast.lv7.base,1); const a=__blast.lv7.info(); __blast.test.run(8); const b=__blast.lv7.info();
 const o={}; b.forEach((m,i)=>{ if(m.an) return; const k=m.bid+':'+m.key+':f'+m.f; o[k]=o[k]||{n:0,dead:0,moved:0}; o[k].n++; if(m.dead) o[k].dead++; else if(Math.abs(m.y-a[i].y)>0.3) o[k].moved++; });
 return JSON.stringify({n:b.length, g7:__blast.lv7.g7info, o}); })()`);
console.log(r);
pg.close(); proc.kill(); srv.close(); process.exit(0);
