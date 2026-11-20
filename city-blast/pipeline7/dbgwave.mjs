// node wave1probe.mjs <levels.json> <budget> : the whole budget in ONE blast (any member / tap-reachable only)
import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { buildHtml } from './build.mjs';
import { launch, open } from './cdp.mjs';
const lv = JSON.parse(readFileSync(process.argv[2], 'utf8')), bud = +process.argv[3] || 30;
const html = buildHtml(lv, true);
const port0 = 8802 + Math.floor(Math.random() * 50);
const srv = createServer((q, s) => { s.writeHead(200, { 'content-type': 'text/html' }); s.end(html); }).listen(port0);
const { proc, port } = await launch(9350 + Math.floor(Math.random() * 40)); const pg = await open(port, 'http://127.0.0.1:' + port0 + '/');
for(let i = 0; i < 60; i++){ await new Promise(r => setTimeout(r, 500)); try{ if(await pg.evaluate('!!(window.__blast && __blast.lv7 && __blast.lv7.info)')) break; }catch(e){} }
await new Promise(r => setTimeout(r, 2500));
await pg.evaluate(readFileSync(new URL('./tester.js', import.meta.url), 'utf8'));
const base = await pg.evaluate('__blast.lv7.base');
for(let k = 0; k < lv.length; k++){
  const a = JSON.parse(await pg.evaluate(`(()=>{const r=P7.oneWave(${base + k}, ${bud}, false); const I=__blast.lv7.info(); const H=I.filter(b=>/^hard7/.test(b.key)); const tot=I.filter(b=>!b.an&&!b.kp).reduce((a,b)=>a+b.m,0); r.hard=H.map(b=>b.key+(b.dead?"X":"o")+Math.round(b.hp||0)).join(" "); r.hardShare=Math.round(100*H.reduce((a,b)=>a+b.m,0)/tot); r.L=JSON.stringify(__blast.lv7.L()[${base + k}].drop7); r.log=__blast.lv7.log.filter(s=>/^fail/.test(s)).slice(-12); return JSON.stringify(r)})()`));
  const t = {};
  console.log(lv[k].name.padEnd(22), 'any:', JSON.stringify(a), ' tap:', JSON.stringify(t));
}
pg.close(); proc.kill(); srv.close(); process.exit(0);
