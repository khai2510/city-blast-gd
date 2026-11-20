import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { launch, open } from './cdp.mjs';
const html = readFileSync(new URL('./out/try-1811.html', import.meta.url));
const srv = createServer((q, s) => { s.writeHead(200, { 'content-type': 'text/html' }); s.end(html); }).listen(8798);
const { proc, port } = await launch(9341); const pg = await open(port, 'http://127.0.0.1:8798/');
for(let i = 0; i < 60; i++){ await new Promise(r => setTimeout(r, 500)); try{ if(await pg.evaluate('!!(window.__blast && __blast.lv7 && __blast.lv7.info)')) break; }catch(e){} }
await new Promise(r => setTimeout(r, 2500));
await pg.evaluate(readFileSync(new URL('./tester.js', import.meta.url), 'utf8'));
const idx = await pg.evaluate('__blast.lv7.base');
console.log(await pg.evaluate(`(()=>{ const T=__blast.test; T.play(${idx},1); T.run(6);
  const inf=__blast.lv7.info(); const H0=inf.filter(b=>/^hard7/.test(b.key)); 
  const c=inf.filter(b=>b.key==='concrete'&&b.bid==='A'&&b.f===1&&b.st)[0]; T.charge('tnt',c.i,0,1,0); T.fire(); const r=T.run(25);
  const inf2=__blast.lv7.info(); const H=inf2.filter(b=>/^hard7/.test(b.key));
  return JSON.stringify({pct:Math.round(r.pct*100), hard:H.length, hardDead:H.filter(b=>b.dead).length, vaults:H.filter(b=>b.key==='hard7v').map(b=>[b.dead, b.y]), shatter:__blast.lv7.info && null, scoreSrc: String(__blast.test.score).slice(0,80), keys:[...new Set(inf2.map(b=>b.key))].join(','), hard7flag:T.level().hard7, mine:(()=>{ let rem=0,tot=0; inf2.filter(b=>!b.an&&!b.kp).forEach(b=>{ tot+=b.m; if(b.dead) return; if(/^hard7/.test(b.key)){ rem+=b.m; return;} if(b.sy-b.y>1.2&&b.y<1.5) return; rem+= b.st? b.m : b.m*0.5; }); return Math.round(100*(1-rem/tot)); })(), hardMass:Math.round(100*H.reduce((a,b)=>a+b.m,0)/inf2.filter(b=>!b.an&&!b.kp).reduce((a,b)=>a+b.m,0)) }); })()`));
console.log('errors', pg.logs.slice(0,5));
pg.close(); proc.kill(); srv.close(); process.exit(0);
