import { readFileSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { launch, open } from './cdp.mjs';
const html = readFileSync(process.argv[2]), out = process.argv[3];
const srv = createServer((q, s) => { s.writeHead(200, { 'content-type': 'text/html' }); s.end(html); }).listen(8821);
const { proc, port } = await launch(9371); const pg = await open(port, 'http://127.0.0.1:8821/');
for(let i = 0; i < 60; i++){ await new Promise(r => setTimeout(r, 500)); try{ if(await pg.evaluate('!!(window.__blast && __blast.lv7)')) break; }catch(e){} }
await new Promise(r => setTimeout(r, 3000));
await pg.evaluate(readFileSync(new URL('./tester.js', import.meta.url), 'utf8'));
const r = await pg.evaluate(`(async()=>{ const T=__blast.test; T.load(__blast.lv7.base,1); T.run(4);
  const I=__blast.lv7.info(); const hall=I.filter(b=>b.bid==='A'&&(b.key==='rc'||b.key==='hrc')&&b.st);
  // wave 1: gate + 6 hall posts (front and left faces)
  I.filter(b=>b.bid==='S'&&b.key==='bk').forEach(b=>T.charge('tnt',b.i,0,1,0));
  hall.filter(b=>b.key==='rc').slice(0,6).forEach(b=>T.charge('tnt',b.i,0,1,0));
  T.fire(); const a=T.run(25); __blast.lv7.syncDraw(); await new Promise(r=>setTimeout(r,1500));
  const I2=__blast.lv7.info(); const hard=I2.filter(b=>/^hard7/.test(b.key)&&!b.dead).map(b=>b.key+'@y'+b.y.toFixed(1));
  return JSON.stringify({pct:a.pct, hard}); })()`);
console.log(r);
writeFileSync(out, Buffer.from(await pg.shot(), 'base64'));
pg.close(); proc.kill(); srv.close(); process.exit(0);
