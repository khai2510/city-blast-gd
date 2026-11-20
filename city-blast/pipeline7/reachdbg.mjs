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
console.log(await pg.evaluate(`(()=>{ __blast.test.play(${b},1); __blast.test.run(6); const I=__blast.lv7.info(); const out=[]; for(let k=0;k<4;k++){ __blast.lv7.view(k); const M=__blast.members(); const pk=new Set(M.filter(m=>m.pickable).map(m=>m.i)); out.push('v'+k+': '+I.filter(m=>m.bid==='${process.argv[3]||'A'}'&&m.f===0&&/rc|hrc|hard7i/.test(m.key)).map(m=>m.x.toFixed(1)+','+m.z.toFixed(1)+(pk.has(m.i)?'*':'['+(M.find(q=>q.i===m.i)||{}).hitKey+']')).join(' ')); } return out.join('\\n'); })()`));
pg.close(); proc.kill(); srv.close(); process.exit(0);
