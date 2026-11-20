import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { buildHtml } from './build.mjs';
import { launch, open } from './cdp.mjs';
const lv = JSON.parse(readFileSync(process.argv[2], 'utf8')); lv[0].charges = { tnt: +process.argv[3] };
const html = buildHtml(lv, true), port0 = 8830 + Math.floor(Math.random() * 40);
const srv = createServer((q, s) => { s.writeHead(200, { 'content-type': 'text/html' }); s.end(html); }).listen(port0);
const { proc, port } = await launch(9400 + Math.floor(Math.random() * 40)); const pg = await open(port, 'http://127.0.0.1:' + port0 + '/');
for(let i = 0; i < 60; i++){ await new Promise(r => setTimeout(r, 500)); try{ if(await pg.evaluate('!!(window.__blast && __blast.lv7 && __blast.lv7.info)')) break; }catch(e){} }
await new Promise(r => setTimeout(r, 2500));
await pg.evaluate(readFileSync(new URL('./tester.js', import.meta.url), 'utf8'));
const b = await pg.evaluate('__blast.lv7.base');
await pg.evaluate('window.P7tap = true; window.__fd = []; const T0 = __blast.test.charge; __blast.test.charge = function(k, i){ const m = __blast.lv7.info()[i]; window.__fd.push(m.bid + ":" + m.key + "@" + m.x.toFixed(0) + "," + m.z.toFixed(0)); return T0.apply(this, arguments); }; const F0 = __blast.test.fire; __blast.test.fire = function(){ window.__fd.push("|"); return F0.apply(this, arguments); };');
console.log(await pg.evaluate(`JSON.stringify(P7.footOnly(${b}, ${process.argv[3]}))`), await pg.evaluate('window.__fd.join(" ")'));
pg.close(); proc.kill(); srv.close(); process.exit(0);
