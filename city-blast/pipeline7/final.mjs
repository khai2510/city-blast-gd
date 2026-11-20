// merge the passing runs into the final pack: tuned levels, test + release builds, a screenshot per level, results-final.json
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createServer } from 'node:http';
import { BLUEPRINTS } from './blueprints.mjs';
import { generate4b as generate } from './gen.mjs';
import { buildHtml } from './build.mjs';
import { launch, open } from './cdp.mjs';
const O = new URL('./out/final-v3/', import.meta.url).pathname; mkdirSync(O + 'shots', { recursive: true });
const runs = ['results-v3-run6.json'].map(f => JSON.parse(readFileSync(new URL('./out/' + f, import.meta.url))).results);
const best = {}; runs.forEach(rs => rs.forEach(r => { best[r.id] = r; }));
const results = BLUEPRINTS.map(bp => best[bp.id]);
const levels = BLUEPRINTS.map(bp => generate(bp, { tnt: best[bp.id].tnt }));
writeFileSync(O + 'levels.json', JSON.stringify(levels, null, 1));
writeFileSync(O + 'results-final.json', JSON.stringify(results, null, 1));
const test = buildHtml(levels, true); writeFileSync(O + 'index-test.html', test); writeFileSync(O + 'index-release.html', buildHtml(levels, false));
// screenshots: each level as the player first sees it
const srv = createServer((q, s) => { s.writeHead(200, { 'content-type': 'text/html' }); s.end(test); }).listen(8793);
const { proc, port } = await launch(9336);
const pg = await open(port, 'http://127.0.0.1:8793/');
for(let i = 0; i < 60; i++){ await new Promise(r => setTimeout(r, 500)); try{ if(await pg.evaluate('!!(window.__blast && __blast.lv7 && __blast.lv7.info)')) break; }catch(e){} }
await new Promise(r => setTimeout(r, 2500));
const base = await pg.evaluate('__blast.lv7.base');
for(let k = 0; k < levels.length; k++){
  await pg.evaluate(`(async()=>{ __blast.test.load(${base + k},1); __blast.test.run(4); await new Promise(r=>setTimeout(r,1500)); return 1; })()`);
  writeFileSync(O + 'shots/L' + (base + k + 1) + '-' + BLUEPRINTS[k].id + '.jpg', Buffer.from(await pg.shot(), 'base64'));
}
console.log('levels', levels.map(l => l.name + ':' + l.charges.tnt).join(', '), '| errors', pg.logs.filter(x => /levels7/.test(x)));
pg.close(); proc.kill(); srv.close(); process.exit(0);
