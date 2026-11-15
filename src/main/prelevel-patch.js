#!/usr/bin/env node
/* City Blast! MAIN build step "prelevel" (after ui2): appends main/prelevel.js at the end of main() so it wraps the final
 * bstPlay / bstWants / bstPickRender / bstLevelStart / bstUse / bstHave / bstSync (boosters2 + intro + ui2 versions).
 * Same rules as main/perf-patch.js: one text anchor, found exactly once, else exit 1 and nothing written; a marker so it
 * cannot apply twice. The three booster tile arts (design/intro-premium/art-{wreck,net,sky}.webp) go in as data URIs.
 *   node main/prelevel-patch.js <in.html> <out.html>
 * Never writes games/blast/index.html. What it does and why: games/blast/PRELEVEL-STATUS.md. ?pre=0 at runtime = the old picker. */
'use strict';
const fs = require('fs'), path = require('path');
const [IN, OUT] = process.argv.slice(2);
if (!IN || !OUT) { console.error('usage: node main/prelevel-patch.js <in.html> <out.html>'); process.exit(2); }
if (path.resolve(OUT) === path.resolve(__dirname, '..', 'index.html')) { console.error('refusing to write games/blast/index.html'); process.exit(2); }
const src = fs.readFileSync(IN, 'utf8'), MARK = '<!-- main/prelevel.js -->', A = '\n} // main\n';
if (src.includes(MARK)) { console.error('already patched (prelevel): ' + IN); process.exit(1); }
const n = src.split(A).length - 1;
if (n !== 1) { console.error((n ? 'DUPLICATE (' + n + ')' : 'MISSING') + ' anchor "} // main"'); process.exit(1); }
for (const need of ['function bstPlay(i){', 'function bstWants(i){', 'function bstPickRender(){', 'function bstLevelStart(){', 'function bstUse(k){', 'function bstHave(k){', 'function bstSync(){',
  'function skyBtn(){', 'function isHard(Lv){', 'id="bPick"', 'id="bpTiles"', 'id="bpPlay"', 'id="bpClose"', 'id="bpLv"', 'window.__blast.intro = {', 'lockLv:function(k)'])
  if (!src.includes(need)) { console.error('MISSING engine / UI text: ' + need); process.exit(1); }
const t = src.indexOf('<title>'); if (t < 0) { console.error('no <title>'); process.exit(1); }
const ART = path.join(__dirname, '..', 'design', 'intro-premium');
const uri = (k) => 'data:image/webp;base64,' + fs.readFileSync(path.join(ART, 'art-' + k + '.webp')).toString('base64');
const body = fs.readFileSync(path.join(__dirname, 'prelevel.js'), 'utf8').replace(/\s+$/, '').replace(/"PRE:(wreck|net|sky)"/g, (m, k) => '"' + uri(k) + '"');
if (/PRE:(wreck|net|sky)/.test(body)) { console.error('art token left'); process.exit(1); }
let out = src.replace(A, () => '\n' + body + A);
out = out.slice(0, t) + MARK + out.slice(t);
fs.writeFileSync(OUT, out);
console.log('ok   O1 Hard / Boss offer · O2 3 tiles (count / + / locked Lv.N) · O3 1 use at level start, armed as the tray · O4 teach hand  -> ' + path.basename(OUT));
