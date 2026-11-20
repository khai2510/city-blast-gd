// node hangcheck.mjs <levels.json> [budget] : after a big blast, find members still high up with NOTHING under them
// (no member or ground within 0.6 m below their footprint) and at rest: they hang on bonds in mid air ("lơ lửng").
import { readFileSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { buildHtml } from './build.mjs';
import { launch, open } from './cdp.mjs';
const lv = JSON.parse(readFileSync(process.argv[2], 'utf8')), bud = +process.argv[3] || 20;
const html = buildHtml(lv, true), port0 = 8830 + Math.floor(Math.random() * 40);
const srv = createServer((q, s) => { s.writeHead(200, { 'content-type': 'text/html' }); s.end(html); }).listen(port0);
const { proc, port } = await launch(9400 + Math.floor(Math.random() * 40)); const pg = await open(port, 'http://127.0.0.1:' + port0 + '/');
for(let i = 0; i < 60; i++){ await new Promise(r => setTimeout(r, 500)); try{ if(await pg.evaluate('!!(window.__blast && __blast.lv7 && __blast.lv7.info)')) break; }catch(e){} }
await new Promise(r => setTimeout(r, 2500));
await pg.evaluate(readFileSync(new URL('./tester.js', import.meta.url), 'utf8'));
const b = await pg.evaluate('__blast.lv7.base');
const HANG = `(()=>{ const B=__blast.test.blocks().map((m,i)=>Object.assign({i},m)).filter(m=>!m.dead&&!m.anchor&&!m.keep&&!m.prop);
  const out=[]; B.forEach(m=>{ const bot=m.y-m.hy; if(bot<1.5) return; const sup=B.some(n=>n!==m && Math.abs(n.x-m.x)<n.hx+m.hx-0.05 && Math.abs(n.z-m.z)<n.hz+m.hz-0.05 && (n.y+n.hy)>bot-0.6 && (n.y+n.hy)<bot+0.4 && n.y<m.y);
    if(!sup) out.push(m); });
  const by={}; out.forEach(m=>{ const k=m.key; by[k]=(by[k]||0)+1; });
  return {hang:out.length, by, high:out.filter(m=>m.y-m.hy>4).map(m=>m.key+'@'+m.x.toFixed(0)+','+m.y.toFixed(0)+','+m.z.toFixed(0)).slice(0,10)}; })()`;
for(let k = 0; k < lv.length; k++){
  const r = await pg.evaluate(`JSON.stringify(P7.oneWave(${b + k}, ${bud}, true))`);
  const h = await pg.evaluate(`JSON.stringify(${HANG})`);
  console.log(lv[k].name, r, h);
  if(process.env.SHOT){ await pg.evaluate('__blast.lv7.syncDraw && __blast.lv7.syncDraw()'); await new Promise(r => setTimeout(r, 1200)); writeFileSync(`out/hang-${k}.png`, Buffer.from(await pg.shot(), 'base64')); }
}
pg.close(); proc.kill(); srv.close(); process.exit(0);
