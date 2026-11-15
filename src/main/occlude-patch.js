#!/usr/bin/env node
/* City Blast! MAIN build step "occlude" (after audio-el, before perf): appends main/occlude.js inside main() so it wraps the final
 * chargeMatOf / chargeMats / fdChargeModel (placed charges obey view occlusion; ?occl=0 = the old always-on-top look). Same rules as main/glue.js: one text anchor, found exactly once, else exit 1 and nothing written.
 *   node main/occlude-patch.js <in.html> <out.html>
 * Never writes games/blast/index.html. What it does: the header of main/occlude.js. */
'use strict';
const fs = require('fs'), path = require('path');
const [IN, OUT] = process.argv.slice(2);
if (!IN || !OUT) { console.error('usage: node main/occlude-patch.js <in.html> <out.html>'); process.exit(2); }
if (path.resolve(OUT) === path.resolve(__dirname, '..', 'index.html')) { console.error('refusing to write games/blast/index.html'); process.exit(2); }
const src = fs.readFileSync(IN, 'utf8'), MARK = '<!-- main/occlude.js -->', A = '\n} // main\n';
if (src.includes(MARK)) { console.error('already patched (occlude): ' + IN); process.exit(1); }
const n = src.split(A).length - 1;
if (n !== 1) { console.error((n ? 'DUPLICATE (' + n + ')' : 'MISSING') + ' anchor "} // main"'); process.exit(1); }
for (const need of ['function chargeMatOf(k){', 'function chargeMats(k){', 'function fdChargeModel(k){', 'CHARGE_MAT = {};', 'FD_CHG_MAT = {};', 'var CMATS = {};', 'function placeCharge(block, point, normal){', 'function clearCharges(){', 'function removeCharge(c, silent){', 'if(MB.mesh.visible) meshes.push(MB.mesh);']) if (!src.includes(need)) { console.error('MISSING engine text: ' + need); process.exit(1); }
const t = src.indexOf('<title>'); if (t < 0) { console.error('no <title>'); process.exit(1); }
let out = src.replace(A, '\n' + fs.readFileSync(path.join(__dirname, 'occlude.js'), 'utf8').replace(/\s+$/, '') + A);
out = out.slice(0, t) + MARK + out.slice(t);
fs.writeFileSync(OUT, out);
console.log('ok   placed charges obey view occlusion (depth tested, drawn on the shell the tap saw, depth pulled by their size); ?occl=0 = old look  -> ' + path.basename(OUT));
