#!/usr/bin/env node
/* City Blast! MAIN build step "tap2" (after ui2, the last step): appends main/tap2.js inside main() so it replaces / wraps the final
 * onTap, pick, stepHand, startLevel, showResult, levelTip, failTip (D-blast-TAP2 / TAPEXACT / NOSTACK / THRESH-2 / NOLOT / COIN / ADOPT). Same rules as main/glue.js: one text anchor, found exactly once, else exit 1 and nothing written.
 *   node main/tap2-patch.js <in.html> <out.html>
 * Never writes games/blast/index.html. What it does and the numbers: games/blast/TAP2-STATUS.md. */
'use strict';
const fs = require('fs'), path = require('path');
const [IN, OUT] = process.argv.slice(2);
if (!IN || !OUT) { console.error('usage: node main/tap2-patch.js <in.html> <out.html>'); process.exit(2); }
if (path.resolve(OUT) === path.resolve(__dirname, '..', 'index.html')) { console.error('refusing to write games/blast/index.html'); process.exit(2); }
const src = fs.readFileSync(IN, 'utf8'), MARK = '<!-- main/tap2.js -->', A = '\n} // main\n';
if (src.includes(MARK)) { console.error('already patched (tap2): ' + IN); process.exit(1); }
const n = src.split(A).length - 1;
if (n !== 1) { console.error((n ? 'DUPLICATE (' + n + ')' : 'MISSING') + ' anchor "} // main"'); process.exit(1); }
for (const need of ['function onTap(x, y){', 'function v5Snap(block, point){', 'function stepHand(){', 'function showResult(){', 'V5_PARTS.lot6 = ', 'function buildBodies(){', 'id="hPlus"', 'id="ulDaily"', 'id="ulNoAds"']) if (!src.includes(need)) { console.error('MISSING engine text: ' + need); process.exit(1); }
const t = src.indexOf('<title>'); if (t < 0) { console.error('no <title>'); process.exit(1); }
let out = src.replace(A, '\n' + fs.readFileSync(path.join(__dirname, 'tap2.js'), 'utf8').replace(/\s+$/, '') + A);
out = out.slice(0, t) + MARK + out.slice(t);
fs.writeFileSync(OUT, out);
console.log('ok   T1 exact tap · T2 no removal · T3 stacking allowed (STACKOK; ?nostack=1 = old) · T4 double tap = TNT + BLAST · T5 no BLAST on L1 · H1/H2 L1/L2 hand · R1 no street rule · R2 no lot · R3 coins 10/20/30 · R4 coming-soon hidden  -> ' + path.basename(OUT));
