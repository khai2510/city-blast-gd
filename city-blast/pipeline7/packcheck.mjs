import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { launch, open } from './cdp.mjs';
const html = readFileSync(process.argv[2]);
const srv = createServer((q, s) => { s.writeHead(200, { 'content-type': 'text/html' }); s.end(html); }).listen(8861);
const { proc, port } = await launch(9411); const pg = await open(port, 'http://127.0.0.1:8861/');
for(let i = 0; i < 60; i++){ await new Promise(r => setTimeout(r, 500)); try{ if(await pg.evaluate('!!(window.__blast && __blast.lv7)')) break; }catch(e){} }
await new Promise(r => setTimeout(r, 3000));
console.log(await pg.evaluate(`(()=>{ const out=[]; const b=__blast.lv7.base, L=__blast.lv7.L(); for(let k=0;k<${+process.env.N||3};k++){ __blast.test.play(b+k,1); __blast.test.run(6); const I=__blast.lv7.info(); out.push(L[b+k].name+': '+I.length+' members, dead '+I.filter(x=>x.dead).length+', tnt '+L[b+k].charges.tnt+', tip "'+L[b+k].tip+'"'); } return out.join(' | '); })()`));
pg.close(); proc.kill(); srv.close(); process.exit(0);
