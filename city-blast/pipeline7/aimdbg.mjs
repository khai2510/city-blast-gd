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
console.log(await pg.evaluate(`(()=>{ const T=__blast.test; T.play(${base},1); T.run(6); const I=__blast.lv7.info(); const A=I.filter(b=>b.bid==="A"&&b.f===0&&(b.key==="rc"||b.key==="hrc")); const face=A.filter(b=>b.x>2); const mid=face.find(b=>b.key==="rc"), cor=face.find(b=>b.key==="hrc"); T.charge("tnt",mid.i,1,0,0); for(let q=0;q<3;q++) T.charge("tnt",cor.i,1,0,[0,.5,-.5][q]); T.fire(); const out=[]; for(let k=0;k<6;k++){ T.run(1.5); const J=__blast.lv7.info().filter(b=>b.bid==="A"&&!b.dead); out.push({t:(k+1)*1.5, meanX:+(J.reduce((a,b)=>a+b.x,0)/J.length).toFixed(1), maxX:+Math.max(...J.map(b=>b.x)).toFixed(1), topY:+Math.max(...J.map(b=>b.y)).toFixed(1), alive:J.length}); } const R=__blast.lv7.info().filter(b=>b.bid==="R"); out.push({armory:R.map(b=>(b.dead?"X":"o")+b.x.toFixed(1)).join(" ")}); out.push(__blast.lv7.log.slice(-8)); return JSON.stringify(out); })()`));
pg.close(); proc.kill(); srv.close(); process.exit(0);
