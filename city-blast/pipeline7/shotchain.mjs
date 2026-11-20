import { readFileSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { launch, open } from './cdp.mjs';
const html = readFileSync(process.argv[2]), dir = process.argv[3];
const srv = createServer((q, s) => { s.writeHead(200, { 'content-type': 'text/html' }); s.end(html); }).listen(8851);
const { proc, port } = await launch(9391); const pg = await open(port, 'http://127.0.0.1:8851/');
for(let i = 0; i < 60; i++){ await new Promise(r => setTimeout(r, 500)); try{ if(await pg.evaluate('!!(window.__blast && __blast.lv7)')) break; }catch(e){} }
await new Promise(r => setTimeout(r, 3000));
await pg.evaluate(`(()=>{ const T=__blast.test; T.load(__blast.lv7.base,1); T.run(4); const I=__blast.lv7.info();
  const A=I.filter(b=>b.bid==='A'&&b.f===0&&(b.key==='rc'||b.key==='hrc')); window.__f=A.filter(b=>b.x>2); return 1; })()`);
for(let w = 0; w < 4; w++){
  await pg.evaluate(`(()=>{ const T=__blast.test; const I=__blast.lv7.info(); __f.forEach(b=>{ if(I[b.i]&&!I[b.i].dead&&(b.key==='hrc'||b.key==='rc')){ T.charge('tnt',b.i,1,0,0); if(b.key==='hrc') T.charge('tnt',b.i,1,0,.5);} }); T.fire(); return 1; })()`);
  const steps = w < 3 ? [[6, null]] : [[2.2, 'a'], [1.2, 'b'], [1.5, 'c'], [5, 'd']];
  for(const [t, tag] of steps){ await pg.evaluate(`(async()=>{ __blast.test.run(${t}); __blast.lv7.syncDraw(); await new Promise(r=>setTimeout(r,900)); return 1; })()`);
    if(tag) writeFileSync(dir + '/chain-' + tag + '.png', Buffer.from(await pg.shot(), 'base64')); }
}
console.log(await pg.evaluate(`JSON.stringify({tanks:__blast.lv7.info().filter(b=>b.key==='tank').map(b=>(b.dead?'X':'o')+' y'+b.y.toFixed(1)+' x'+b.x.toFixed(1))})`));
pg.close(); proc.kill(); srv.close(); process.exit(0);
