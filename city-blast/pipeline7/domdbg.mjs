import { readFileSync, writeFileSync } from 'node:fs';
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
console.log(await pg.evaluate(`(()=>{ __blast.test.play(${b},1); __blast.test.run(6); __blast.lv7.log.length=0; const I=__blast.lv7.info(); const legs=I.filter(m=>m.bid==='A'&&m.f===0&&m.key==='rc'); const cx=legs.reduce((a,m)=>a+m.x,0)/legs.length; const f=legs.filter(m=>m.x>cx+0.5).sort((a,c)=>Math.abs(a.z)-Math.abs(c.z)).slice(0,2); f.forEach(m=>__blast.test.charge('tnt',m.i,1,0,0)); __blast.test.fire(); const r=__blast.test.run(30); const J=__blast.lv7.info(); const st={}; J.filter(m=>m.bid).forEach(m=>{st[m.bid]=st[m.bid]||[0,0]; st[m.bid][0]++; if(m.st&&!m.dead) st[m.bid][1]++;}); return JSON.stringify({pct:r.pct, log:__blast.lv7.log.slice(0,20), standing:st, legs:f.length}); })()`));
await pg.evaluate('__blast.lv7.syncDraw && __blast.lv7.syncDraw()'); await new Promise(r => setTimeout(r, 1500));
writeFileSync('out/dom.png', Buffer.from(await pg.shot(), 'base64'));
pg.close(); proc.kill(); srv.close(); process.exit(0);
