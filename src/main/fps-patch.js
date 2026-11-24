#!/usr/bin/env node
/* City Blast! MAIN build step "fps" (PERF-1124, the very last step): appends main/fps.js inside main() so it wraps the final
 * animate / physicsFrame / renderer.render (hidden fps meter, ?fps=1 or 5 taps on the Level pill; off by default). Same rules as main/glue.js: one text anchor, found exactly once, else exit 1 and nothing written.
 *   node main/fps-patch.js <in.html> <out.html>
 * Never writes games/blast/index.html. What it does and the numbers: city-blast/levels-gd/PERF-1124/PERF-1124.md. */
'use strict';
const fs = require('fs'), path = require('path');
const [IN, OUT] = process.argv.slice(2);
if (!IN || !OUT) { console.error('usage: node main/fps-patch.js <in.html> <out.html>'); process.exit(2); }
if (path.resolve(OUT) === path.resolve(__dirname, '..', 'index.html')) { console.error('refusing to write games/blast/index.html'); process.exit(2); }
const src = fs.readFileSync(IN, 'utf8'), MARK = '<!-- main/fps.js -->', A = '\n} // main\n';
if (src.includes(MARK)) { console.error('already patched (fps): ' + IN); process.exit(1); }
const n = src.split(A).length - 1;
if (n !== 1) { console.error((n ? 'DUPLICATE (' + n + ')' : 'MISSING') + ' anchor "} // main"'); process.exit(1); }
for (const need of ['function animate(){', 'function physicsFrame(rdt){', 'stepCount = 0;', '<!-- main/perf.js -->']) if (!src.includes(need)) { console.error('MISSING engine text: ' + need); process.exit(1); }
const t = src.indexOf('<title>'); if (t < 0) { console.error('no <title>'); process.exit(1); }
let out = src.replace(A, '\n' + fs.readFileSync(path.join(__dirname, 'fps.js'), 'utf8').replace(/\s+$/, '') + A);
out = out.slice(0, t) + MARK + out.slice(t);
fs.writeFileSync(OUT, out);
console.log('ok   hidden fps meter (?fps=1 / 5 taps on the Level pill) + per-frame probe  -> ' + path.basename(OUT));
