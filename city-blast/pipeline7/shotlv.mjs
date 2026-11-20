import { readFileSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { launch, open } from './cdp.mjs';
const html = readFileSync(process.argv[2]);
const srv = createServer((q, s) => { s.writeHead(200, { 'content-type': 'text/html' }); s.end(html); }).listen(8801);
const { proc, port } = await launch(9344); const pg = await open(port, 'http://127.0.0.1:8801/');
for(let i = 0; i < 60; i++){ await new Promise(r => setTimeout(r, 500)); try{ if(await pg.evaluate('!!(window.__blast && __blast.lv7)')) break; }catch(e){} }
await new Promise(r => setTimeout(r, 3000));
await pg.evaluate(`(async()=>{ __blast.test.load(__blast.lv7.base,1); __blast.test.run(4); await new Promise(r=>setTimeout(r,2500)); return 1; })()`);
writeFileSync(process.argv[3], Buffer.from(await pg.shot(), 'base64'));
pg.close(); proc.kill(); srv.close(); process.exit(0);
