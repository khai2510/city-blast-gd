#!/usr/bin/env node
/* City Blast! MAIN build step "frame" (right after perf): appends main/frame.js inside main() so it wraps the final startLevel /
 * updateCamera / detonateAll / resetFraming (perf's camera wrapper included). Same rules as main/perf-patch.js: one text anchor, found
 * exactly once, else exit 1 and nothing written.
 *   node main/frame-patch.js <in.html> <out.html>
 * Never writes games/blast/index.html. What it does and the numbers: games/blast/FRAME-STATUS.md. */
'use strict';
const fs = require('fs'), path = require('path');
const [IN, OUT] = process.argv.slice(2);
if (!IN || !OUT) { console.error('usage: node main/frame-patch.js <in.html> <out.html>'); process.exit(2); }
if (path.resolve(OUT) === path.resolve(__dirname, '..', 'index.html')) { console.error('refusing to write games/blast/index.html'); process.exit(2); }
const src = fs.readFileSync(IN, 'utf8'), MARK = '<!-- main/frame.js -->', A = '\n} // main\n';
if (src.includes(MARK)) { console.error('already patched (frame): ' + IN); process.exit(1); }
if (!src.includes('<!-- main/perf.js -->')) { console.error('MISSING step perf (frame goes after it)'); process.exit(1); }
const n = src.split(A).length - 1;
if (n !== 1) { console.error((n ? 'DUPLICATE (' + n + ')' : 'MISSING') + ' anchor "} // main"'); process.exit(1); }
for (const need of ['function startLevel(', 'function resetFraming(', 'function topH(', 'function botH(', 'function clampZoom(', 'zoomT = 1, zoomK = 1, zoomSp = {v:0}']) if (!src.includes(need)) { console.error('MISSING engine text: ' + need); process.exit(1); }
const t = src.indexOf('<title>'); if (t < 0) { console.error('no <title>'); process.exit(1); }
let out = src.replace(A, '\n' + fs.readFileSync(path.join(__dirname, 'frame.js'), 'utf8').replace(/\s+$/, '') + A);
out = out.slice(0, t) + MARK + out.slice(t);
fs.writeFileSync(OUT, out);
console.log('ok   F1 hero opening pose (fill 72% playable height / 68% width, centred, 3/4 yaw, pitch 0.26) · F2 ease-in 1 s ease-out cubic · F3 hand-over to pinch / pan / BLAST  -> ' + path.basename(OUT));
