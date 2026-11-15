#!/usr/bin/env node
/* City Blast! MAIN build step "perf" (after audio-el, the very last step): appends main/perf.js inside main() so it wraps the final
 * pbTick / updateCamera / clampZoom. Same rules as main/glue.js: one text anchor, found exactly once, else exit 1 and nothing written.
 *   node main/perf-patch.js <in.html> <out.html>
 * Never writes games/blast/index.html. What it does and the numbers: games/blast/PERF-STATUS.md. */
'use strict';
const fs = require('fs'), path = require('path');
const [IN, OUT] = process.argv.slice(2);
if (!IN || !OUT) { console.error('usage: node main/perf-patch.js <in.html> <out.html>'); process.exit(2); }
if (path.resolve(OUT) === path.resolve(__dirname, '..', 'index.html')) { console.error('refusing to write games/blast/index.html'); process.exit(2); }
const src = fs.readFileSync(IN, 'utf8'), MARK = '<!-- main/perf.js -->', A = '\n} // main\n';
if (src.includes(MARK)) { console.error('already patched (perf): ' + IN); process.exit(1); }
const n = src.split(A).length - 1;
if (n !== 1) { console.error((n ? 'DUPLICATE (' + n + ')' : 'MISSING') + ' anchor "} // main"'); process.exit(1); }
for (const need of ['function pbTick(){', 'var PR_MAX = ', 'function setPR(pr){', 'function clampZoom(']) if (!src.includes(need)) { console.error('MISSING engine text: ' + need); process.exit(1); }
const t = src.indexOf('<title>'); if (t < 0) { console.error('no <title>'); process.exit(1); }
let out = src.replace(A, '\n' + fs.readFileSync(path.join(__dirname, 'perf.js'), 'utf8').replace(/\s+$/, '') + A);
out = out.slice(0, t) + MARK + out.slice(t);
fs.writeFileSync(OUT, out);
console.log('ok   P1 prebuild while idle · P2 pixel ratio cap 2 + shadow 1024 · P3 camera clearance ease · P4 shadow pass on the chamfer box · P5 shadow every 2nd frame in a collapse · P6 member LOD when far  -> ' + path.basename(OUT));
