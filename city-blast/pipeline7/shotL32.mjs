import { writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { buildHtml } from './build.mjs';
import { launch, open } from './cdp.mjs';
const html = buildHtml([], true);
const srv = createServer((q, s) => { s.writeHead(200, { 'content-type': 'text/html' }); s.end(html); }).listen(8799);
const { proc, port } = await launch(9342); const pg = await open(port, 'http://127.0.0.1:8799/');
for(let i = 0; i < 60; i++){ await new Promise(r => setTimeout(r, 500)); try{ if(await pg.evaluate('!!(window.__blast && __blast.test)')) break; }catch(e){} }
await new Promise(r => setTimeout(r, 3000));
const info = await pg.evaluate(`(async()=>{ __blast.test.load(31,1); __blast.test.run(4); await new Promise(r=>setTimeout(r,2500)); const L=__blast.test.level(); const B=__blast.test.blocks().filter(b=>!b.anchor); const k={}; B.forEach(b=>k[b.key]=(k[b.key]||0)+1);
  return JSON.stringify({name:L.name, tnt:L.charges, tier:L.tier, f:L.f, tip:L.tip, ftip:L.ftip, parts:(L.parts||[]).map(p=>p.kind+':'+p.id), keeps:(L.keeps||[]).length, members:B.length, keys:k}); })()`);
console.log(info);
writeFileSync(new URL('./out/L32-bench.jpg', import.meta.url), Buffer.from(await pg.shot(), 'base64'));
pg.close(); proc.kill(); srv.close(); process.exit(0);
