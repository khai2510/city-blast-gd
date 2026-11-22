#!/usr/bin/env node
/* City Blast! MAIN build step "sflay" (Khai 22/11/2026: the "SF-style corners" in-level layout of the 18/11 demo, ON by default; ?sflay=0 = the
 * old layout). Appends main/sflay.js inside main() after g7-hard (play order final) and before rs-look (the Mac's step, which must stay last:
 * it needs "} // main" once, "var lot = new THREE.Mesh(" and the ids #bottom / #bbar / #blast / #chips / #top, all left as they are).
 * One text anchor, found exactly once, else exit 1 and nothing written.
 *   node main/sflay-patch.js <in.html> <out.html>        Checks: main/check-sflay.js (SF1-SF12). */
'use strict';
const fs = require('fs'), path = require('path');
const [IN, OUT] = process.argv.slice(2);
if (!IN || !OUT) { console.error('usage: node main/sflay-patch.js <in.html> <out.html>'); process.exit(2); }
if (path.basename(OUT) === 'index.html') { console.error('refusing to write an index.html'); process.exit(2); }
const src = fs.readFileSync(IN, 'utf8'), MARK = '<!-- main/sflay.js -->', A = '\n} // main\n';
if (src.includes(MARK)) { console.error('already patched (sflay): ' + IN); process.exit(1); }
if (src.includes('<!-- rs-look -->')) { console.error('rs-look is already in: sflay must come before it'); process.exit(1); }
for (const m of ['<!-- main/frame.js -->', '<!-- main/polish.js -->', '// ---- g7hard/order-end.js']) if (!src.includes(m)) { console.error('MISSING step marker ' + m + ' (sflay goes after it)'); process.exit(1); }
const n = src.split(A).length - 1;
if (n !== 1) { console.error((n ? 'DUPLICATE (' + n + ')' : 'MISSING') + ' anchor "} // main"'); process.exit(1); }
for (const need of ['function topH(', 'function botH(', 'function startLevel(', 'function bstSync(', 'window.__blast.frame =', 'window.__blast.safe =', 'id="bbar"', 'id="pauseBtn"', 'id="chips"', 'id="blast"', 'id="lvPill"', 'id="ff"', 'id="i-gear"', 'id="i-lock"'])
  if (!src.includes(need)) { console.error('MISSING engine text: ' + need); process.exit(1); }
const t = src.indexOf('<title>'); if (t < 0) { console.error('no <title>'); process.exit(1); }
let out = src.replace(A, () => '\n' + fs.readFileSync(path.join(__dirname, 'sflay.js'), 'utf8').replace(/\s+$/, '') + A);
if (out.split(A).length - 1 !== 1) { console.error('anchor lost after patching'); process.exit(1); }
const t2 = out.indexOf('<title>');
out = out.slice(0, t2) + MARK + out.slice(t2);
fs.writeFileSync(OUT, out);
console.log('ok   S1 TNT card top-left · S2 gear top-right · S3 level label + post-BLAST meter · S4 3 corner boosters (padlock + wiggle) · S5 BLAST centred · S6 front-on camera (hard / boss keep main) -> ' + path.basename(OUT));
