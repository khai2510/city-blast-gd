// measure the foot exploits on a built pack (default: out/final/index-test.html)
import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { launch, open } from './cdp.mjs';
const html = readFileSync(process.argv[2] || new URL('./out/final/index-test.html', import.meta.url));
const srv = createServer((q, s) => { s.writeHead(200, { 'content-type': 'text/html' }); s.end(html); }).listen(8794);
const { proc, port } = await launch(9337); const pg = await open(port, 'http://127.0.0.1:8794/');
for(let i = 0; i < 60; i++){ await new Promise(r => setTimeout(r, 500)); try{ if(await pg.evaluate('!!(window.__blast && __blast.lv7 && __blast.lv7.info)')) break; }catch(e){} }
await new Promise(r => setTimeout(r, 2500));
await pg.evaluate(readFileSync(new URL('./tester.js', import.meta.url), 'utf8'));
const base = await pg.evaluate('__blast.lv7.base'), n = await pg.evaluate('__blast.lv7.L().length') - base;
for(let k = 0; k < n; k++){
  const idx = base + k, L = JSON.parse(await pg.evaluate(`JSON.stringify({n:__blast.lv7.L()[${idx}].name, t:__blast.lv7.L()[${idx}].charges.tnt})`));
  const a = JSON.parse(await pg.evaluate(`JSON.stringify(P7.allFoot(${idx}, ${L.t}))`)), f = JSON.parse(await pg.evaluate(`JSON.stringify(P7.footOnly(${idx}, ${L.t}))`));
  console.log(`L${idx + 1} ${L.n.padEnd(15)} TNT ${String(L.t).padStart(2)} | all-at-foot ${a.pct}% (${a.used} TNT, collapse ${a.collapse}%) ${a.pct >= 85 ? 'WINS' : 'ok'} | foot-only ${f.pct}% in ${f.waves}w ${f.pct >= 85 ? 'WINS' : 'ok'}`);
}
pg.close(); proc.kill(); srv.close(); process.exit(0);
