// old-polish (batch 2, 23/11): opening shots of the OLD levels in a main build with ?oldlv=1 (the old levels back on their slots),
// for the "old | new" pictures in each levels-gd/O<code>/ folder.   node oldshots.mjs <main.html> <outDir> o4 o5 o22 ...
import { readFileSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { launch, open } from './cdp.mjs';
const [file, outDir, ...olds] = process.argv.slice(2);
const html = readFileSync(file, 'utf8');
const srv = createServer((q, s) => { s.writeHead(200, { 'content-type': 'text/html' }); s.end(html); }).listen(8831);
const { proc, port } = await launch(9381); const pg = await open(port, 'http://127.0.0.1:8831/?oldlv=1');
await pg.send('Emulation.setDeviceMetricsOverride', { width: 393, height: 852, deviceScaleFactor: 1, mobile: true });
for(let i = 0; i < 80; i++){ await new Promise(r => setTimeout(r, 500)); try{ if(await pg.evaluate('!!(window.__blast && __blast.test && window.LV7O)')) break; }catch(e){} }
await new Promise(r => setTimeout(r, 3000));
for(const o of olds){
  const n = +o.slice(1);
  const r = await pg.evaluate(`(async()=>{ const i = LV7O.pos(${n - 1}); __blast.test.load(i, 1); __blast.test.run(4); await new Promise(r=>setTimeout(r,2500)); var L = __blast.lv7 && __blast.lv7.L ? __blast.lv7.L()[i] : null; return i + ' ' + (L && L.name); })()`);
  writeFileSync(outDir + '/old-' + o + '.jpg', Buffer.from(await pg.shot(), 'base64')); console.log(o, r);
}
console.log('errors', JSON.stringify(pg.logs.slice(0, 4)));
pg.close(); proc.kill(); srv.close(); process.exit(0);
