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
await pg.evaluate(readFileSync(new URL('./tester.js', import.meta.url), 'utf8'));
const b = await pg.evaluate('__blast.lv7.base');
const t0 = Date.now();
console.log(await pg.evaluate(`(()=>{ __blast.test.play(${b},1); __blast.test.run(6); const S=P7.reach4(); const I=__blast.lv7.info(); return I.filter(m=>m.bid==='${process.argv[3]||'A'}'&&m.f===0&&/rc|hrc|hard7i/.test(m.key)).map(m=>m.x.toFixed(1)+','+m.z.toFixed(1)+(S.has(m.i)?'*':'')).join(' ') + ' | reach ' + S.size; })()`), (Date.now() - t0) + 'ms');
pg.close(); proc.kill(); srv.close(); process.exit(0);
