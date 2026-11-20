// baseline: the one-bomb exploit on the shipped L1-L36 (no new levels), same tester
import { readFileSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { launch, open } from './cdp.mjs';
const base = readFileSync(new URL('./base-cb3.html', import.meta.url), 'utf8'), engine = readFileSync(new URL('./engine.js', import.meta.url), 'utf8');
const mark = '})(); }catch(e){ console.error("main/fix4.js", e); }\n';
const html = base.replace(mark, mark + engine + '\n');
const srv = createServer((q, s) => { s.writeHead(200, { 'content-type': 'text/html' }); s.end(html); }).listen(8792);
const { proc, port } = await launch(9335);
const pg = await open(port, 'http://127.0.0.1:8792/');
for(let i = 0; i < 60; i++){ await new Promise(r => setTimeout(r, 500)); try{ if(await pg.evaluate('!!(window.__blast && __blast.lv7 && __blast.lv7.info)')) break; }catch(e){} }
await new Promise(r => setTimeout(r, 2500));
await pg.evaluate(readFileSync(new URL('./tester.js', import.meta.url), 'utf8'));
const out = [];
for(let i = 0; i < 36; i++){
  try{
    const m = JSON.parse(await pg.evaluate(`JSON.stringify(P7.metrics(${i}))`));
    const ob = JSON.parse(await pg.evaluate(`JSON.stringify(P7.oneBomb(${i}, 10))`));
    const tnt = await pg.evaluate(`__blast.lv7.L()[${i}].charges && __blast.lv7.L()[${i}].charges.tnt`);
    const name = await pg.evaluate(`__blast.lv7.L()[${i}].name`);
    out.push({ lv: i + 1, name, tnt, hardPct: m.hardPct, mainHardPct: m.main.hardPct, stacks: m.stacks, oneBomb: ob });
    console.log(i + 1, name, 'TNT', tnt, 'hard%', m.hardPct, 'oneBomb', ob.pct + '% collapse ' + ob.collapse + '%');
  }catch(e){ console.log(i + 1, 'ERR', String(e).slice(0, 120)); }
}
writeFileSync(new URL('./out/baseline.json', import.meta.url), JSON.stringify(out, null, 1));
pg.close(); proc.kill(); srv.close(); process.exit(0);
