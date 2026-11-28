#!/usr/bin/env node
/* City Blast! MAIN build step "polish2" (POLISH2, D-blast-POLISH2 28/11, LAST, after flick): appends main/polish2.js inside main():
 * the decor-only dress of the old levels' generic side buildings (P.p2 on a `mass` part) and the ground pieces round protected buildings
 * (K.p2.site). No body, bond or rule is touched; ?polish2=0 = off. One text anchor, found exactly once, else exit 1 and nothing written.
 *   node main/polish2-patch.js <in.html> <out.html>
 * Never writes games/blast/index.html. What it does: city-blast/levels-gd/POLISH2/POLISH2.md. */
'use strict';
const fs = require('fs'), path = require('path');
const [IN, OUT] = process.argv.slice(2);
if (!IN || !OUT) { console.error('usage: node main/polish2-patch.js <in.html> <out.html>'); process.exit(2); }
if (path.resolve(OUT) === path.resolve(__dirname, '..', 'index.html')) { console.error('refusing to write games/blast/index.html'); process.exit(2); }
const src = fs.readFileSync(IN, 'utf8'), MARK = '<!-- main/polish2.js -->', A = '\n} // main\n';
if (src.includes(MARK)) { console.error('already patched (polish2): ' + IN); process.exit(1); }
const n = src.split(A).length - 1;
if (n !== 1) { console.error((n ? 'DUPLICATE (' + n + ')' : 'MISSING') + ' anchor "} // main"'); process.exit(1); }
for (const need of ['function l6KdAdd(host, g, c, x, y, z, sx, sy, sz, rx, ry, rz){', 'V5_PARTS.keep6 = function(K){', 'A1.h = {', '<!-- main/flick.js -->']) if (!src.includes(need)) { console.error('MISSING engine text: ' + need); process.exit(1); }
const t = src.indexOf('<title>'); if (t < 0) { console.error('no <title>'); process.exit(1); }
let out = src.replace(A, '\n' + fs.readFileSync(path.join(__dirname, 'polish2.js'), 'utf8').replace(/\s+$/, '') + A);
out = out.slice(0, t) + MARK + out.slice(t);
fs.writeFileSync(OUT, out);
console.log('ok   decor-only dress of generic side buildings (P.p2) + ground pieces (site)  -> ' + path.basename(OUT));
