#!/usr/bin/env node
/* City Blast! MAIN build step "flick" (FLICK-1128, LAST, after fps): appends main/flick.js inside main() (C1 coplanar decor faces
 * moved 1.5 cm so one surface wins, C2 near plane follows the camera distance; ?flick=0 = off). Same rules as main/perf2-patch.js:
 * one text anchor, found exactly once, else exit 1 and nothing written.
 *   node main/flick-patch.js <in.html> <out.html>
 * Never writes games/blast/index.html. What it does and the numbers: city-blast/levels-gd/FLICK-1128/FLICK-1128.md. */
'use strict';
const fs = require('fs'), path = require('path');
const [IN, OUT] = process.argv.slice(2);
if (!IN || !OUT) { console.error('usage: node main/flick-patch.js <in.html> <out.html>'); process.exit(2); }
if (path.resolve(OUT) === path.resolve(__dirname, '..', 'index.html')) { console.error('refusing to write games/blast/index.html'); process.exit(2); }
const src = fs.readFileSync(IN, 'utf8'), MARK = '<!-- main/flick.js -->', A = '\n} // main\n';
if (src.includes(MARK)) { console.error('already patched (flick): ' + IN); process.exit(1); }
const n = src.split(A).length - 1;
if (n !== 1) { console.error((n ? 'DUPLICATE (' + n + ')' : 'MISSING') + ' anchor "} // main"'); process.exit(1); }
for (const need of ['function l6KdBuild(){', 'function l6KdWrite(b, P, Q){', 'var camDist = 30, camFocusY = 6;', '<!-- main/fps.js -->']) if (!src.includes(need)) { console.error('MISSING engine text: ' + need); process.exit(1); }
const t = src.indexOf('<title>'); if (t < 0) { console.error('no <title>'); process.exit(1); }
let out = src.replace(A, '\n' + fs.readFileSync(path.join(__dirname, 'flick.js'), 'utf8').replace(/\s+$/, '') + A);
out = out.slice(0, t) + MARK + out.slice(t);
fs.writeFileSync(OUT, out);
console.log('ok   C1 coplanar decor faces resolved (1.5 cm) · C2 near plane follows the camera  -> ' + path.basename(OUT));
