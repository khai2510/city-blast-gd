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
const b = await pg.evaluate('__blast.lv7.base');
await pg.evaluate('window.P7tap = true');
for(const m of (process.env.MODES || 'core,shell').split(',')){
  if(m === 'wave'){ console.log('oneWave', await pg.evaluate(`JSON.stringify(P7.oneWave(${b}, ${bud}, true))`)); continue; }
  console.log(await pg.evaluate(`JSON.stringify(P7.coreT(${b}, 'A', ${bud}, '${m}'))`));
  console.log(await pg.evaluate(`(()=>{ const B=__blast.test.blocks(), I=__blast.lv7.info(); const o={}; I.forEach((m,i)=>{ if(m.an||m.kp||!m.bid) return; const b=B[i]; const k=m.bid+':'+(m.dead?'dead':(/^(hrc|rc)$/.test(m.key)?'hard':((m.sy-m.y>1.2&&m.y<1.5)?'down':(m.st?'stand':'pile'))));  o[k]=(o[k]||0)+Math.round(m.m||0); }); return JSON.stringify(o); })()`));
}
pg.close(); proc.kill(); srv.close(); process.exit(0);
