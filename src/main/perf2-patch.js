#!/usr/bin/env node
/* City Blast! MAIN build step "perf2" (PERF-1124, after rs-look, before fps): appends main/perf2.js inside main() so it wraps the
 * final renderer.render (S1 identical frames not redrawn; ?perf2=0 = off). Same rules as main/glue.js: one text anchor, found exactly once, else exit 1 and nothing written.
 *   node main/perf2-patch.js <in.html> <out.html>
 * Never writes games/blast/index.html. What it does and the numbers: city-blast/levels-gd/PERF-1124/PERF-1124.md. */
'use strict';
const fs = require('fs'), path = require('path');
const [IN, OUT] = process.argv.slice(2);
if (!IN || !OUT) { console.error('usage: node main/perf2-patch.js <in.html> <out.html>'); process.exit(2); }
if (path.resolve(OUT) === path.resolve(__dirname, '..', 'index.html')) { console.error('refusing to write games/blast/index.html'); process.exit(2); }
const src = fs.readFileSync(IN, 'utf8'), MARK = '<!-- main/perf2.js -->', A = '\n} // main\n';
if (src.includes(MARK)) { console.error('already patched (perf2): ' + IN); process.exit(1); }
const n = src.split(A).length - 1;
if (n !== 1) { console.error((n ? 'DUPLICATE (' + n + ')' : 'MISSING') + ' anchor "} // main"'); process.exit(1); }
for (const need of ['function animate(){', 'renderer.render(scene, camera);', '<!-- main/perf.js -->', '<!-- rs-look -->']) if (!src.includes(need)) { console.error('MISSING engine text: ' + need); process.exit(1); }
const t = src.indexOf('<title>'); if (t < 0) { console.error('no <title>'); process.exit(1); }
// S4: the pose test in the two write loops of animate() (each line found exactly once, else exit 1)
const W1 = '      if(!bw.sleeping){ writeMatrix(bw, 0); wrote++; }', W1b = '      if(!bw.sleeping && pfPoseNew(bw)){ writeMatrix(bw, 0); wrote++; }';
const W2 = '    for(var f0=0; f0<frags.length; f0++){ var fw = frags[f0]; if(!fw.sleeping || !fw.drawn){ fw.drawn = true; writeFrag(fw); wrote++; } }',
  W2b = '    for(var f0=0; f0<frags.length; f0++){ var fw = frags[f0]; if((!fw.sleeping || !fw.drawn) && (!fw.drawn || pfPoseNew(fw))){ fw.drawn = true; writeFrag(fw); wrote++; } }';
let src2 = src;
for (const [a, b] of [[W1, W1b], [W2, W2b]]) { const k = src2.split(a).length - 1; if (k !== 1) { console.error((k ? 'DUPLICATE' : 'MISSING') + ' animate() write loop: ' + a.trim().slice(0, 60)); process.exit(1); } src2 = src2.replace(a, b); }
let out = src2.replace(A, '\n' + fs.readFileSync(path.join(__dirname, 'perf2.js'), 'utf8').replace(/\s+$/, '') + A);
out = out.slice(0, t) + MARK + out.slice(t);
fs.writeFileSync(OUT, out);
console.log('ok   S1 identical frames not redrawn · S2 warm-up after every patch · S3 2nd step only if the frame affords it · S4 unchanged poses not rewritten  -> ' + path.basename(OUT));
