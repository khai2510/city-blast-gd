// node closeup.mjs <levels.json> <k> <x,y,z,d,yaw,pitch> <out.png> [afterWaves...]
import { readFileSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { buildHtml } from './build.mjs';
import { launch, open } from './cdp.mjs';
const lv = JSON.parse(readFileSync(process.argv[2], 'utf8')), k = +process.argv[3], cam = process.argv[4], out = process.argv[5], pre = process.env.PRE || '';
const html = buildHtml(lv, true), port0 = 8830 + Math.floor(Math.random() * 40);
const srv = createServer((q, s) => { s.writeHead(200, { 'content-type': 'text/html' }); s.end(html); }).listen(port0);
const { proc, port } = await launch(9400 + Math.floor(Math.random() * 40)); const pg = await open(port, 'http://127.0.0.1:' + port0 + '/');
for(let i = 0; i < 60; i++){ await new Promise(r => setTimeout(r, 500)); try{ if(await pg.evaluate('!!(window.__blast && __blast.lv7 && __blast.lv7.info)')) break; }catch(e){} }
await new Promise(r => setTimeout(r, 2500));
await pg.evaluate(readFileSync(new URL('./tester.js', import.meta.url), 'utf8'));
const b = await pg.evaluate('__blast.lv7.base');
await pg.evaluate(`__blast.test.play(${b + k}, 1); __blast.test.run(4); ${pre}`);
for(const c of cam.split(';')){ const [x, y, z, d, yw, pt] = c.split(',').map(Number);
  await pg.evaluate(`__blast.lv7.syncDraw && __blast.lv7.syncDraw(); __blast.test.manual(true); __blast.lv7.closeUp(${x},${y},${z},${d},${isNaN(yw) ? 'null' : yw},${isNaN(pt) ? 'null' : pt})`);
  await new Promise(r => setTimeout(r, 900));
  await pg.evaluate(`__blast.lv7.closeUp(${x},${y},${z},${d},${isNaN(yw) ? 'null' : yw},${isNaN(pt) ? 'null' : pt})`);
  await new Promise(r => setTimeout(r, 300));
  const f = out.replace('.png', '-' + cam.split(';').indexOf(c) + '.png'); writeFileSync(f, Buffer.from(await pg.shot(), 'base64')); console.log(f); }
pg.close(); proc.kill(); srv.close(); process.exit(0);
