#!/usr/bin/env node
/* City Blast! play-time metrics (v13), for human playtests: local only, no network, no personal data.
 *   node metrics/patch.js <in.html> [out.html]     (no out = patch in place)
 *   node metrics/patch.js --check <in.html>         (report anchors only, write nothing)
 * Base: checkpoints/index-v12-v31.html (live v31). Output: checkpoints/index-v13-metrics.html.
 *   node metrics/patch.js checkpoints/index-v12-v31.html checkpoints/index-v13-metrics.html
 * Stacks on later builds (levels round 3 ...): it anchors only on engine scaffolding (the end of main() and the engine
 * function declarations it wraps), never on level data. Rules (as v31/patch.js): text anchors only, each found exactly
 * once, the file must not carry this marker already, never writes games/blast/index.html; otherwise exit 1, nothing written.
 * Block: patch/metrics.js (flag ?metrics=1 opens the panel; 5 taps on the Home logo too). Field list: top of patch/metrics.js.
 */
'use strict';
const fs = require('fs'), path = require('path');
const DIR = __dirname, MARK = '// ---- metrics v13 (metrics/patch.js';
const args = process.argv.slice(2), CHECK = args[0] === '--check'; if (CHECK) args.shift();
const IN = args[0], OUT = args[1] || args[0];
if (!IN) { console.error('usage: node metrics/patch.js [--check] <in.html> [out.html]'); process.exit(2); }
if (path.resolve(OUT) === path.resolve(DIR, '..', 'index.html')) { console.error('refusing to write games/blast/index.html'); process.exit(2); }
const src = fs.readFileSync(IN, 'utf8');
const block = fs.readFileSync(path.join(DIR, 'patch', 'metrics.js'), 'utf8').replace(/\s+$/, '');
// the block wraps these by name; each must be declared exactly once (a rename upstream must fail here, not silently)
const WRAPPED = ['startLevel(i, seed, defOverride)', 'placeCharge(block, point, normal)', 'removeCharge(c, silent)', 'fireNow()',
  'detonateAll()', 'showResult()', 'rescue()', 'goHome()'];
// names the block reads (engine state); a declaration check is enough
const READS = ['var phase="title", screen="title";', 'manual = false', 'var RESCUE_COST = 150, rescueUsed = false', 'function v5Pct(s)',
  'var QS = new URLSearchParams(location.search)', 'window.__blast = {'];
const EDITS = [
  { name: 'block: end of main() (after every engine function and window.__blast exist)',
    find: '\n} // main\n', replace: '\n' + block + '\n} // main\n' },
];
let bad = 0; const spans = [];
if (src.includes(MARK)) { console.error('already patched (marker found): ' + IN); process.exit(1); }
for (const f of WRAPPED) {
  const n = src.split('\nfunction ' + f + '{').length - 1;
  if (n !== 1) { console.error((n ? 'DUPLICATE (' + n + ')' : 'MISSING') + ' engine function: ' + f); bad++; }
}
for (const r of READS) if (!src.includes(r)) { console.error('MISSING engine state: ' + r); bad++; }
for (const e of EDITS) {
  const n = src.split(e.find).length - 1;
  if (n !== 1) { console.error((n ? 'DUPLICATE (' + n + ')' : 'MISSING') + ' anchor: ' + e.name); bad++; continue; }
  const at = src.indexOf(e.find); spans.push([at, at + e.find.length, e]);
}
spans.sort((a, b) => a[0] - b[0]);
for (let i = 1; i < spans.length; i++) if (spans[i][0] < spans[i - 1][1]) { console.error('OVERLAP: ' + spans[i - 1][2].name + ' / ' + spans[i][2].name); bad++; }
if (/fetch\(|XMLHttpRequest|sendBeacon|WebSocket|navigator\.userAgent/.test(block)) { console.error('block must not touch the network or fingerprint the device'); bad++; }
if (bad) { console.error(bad + ' problem(s); nothing written'); process.exit(1); }
console.log((EDITS.length + WRAPPED.length + READS.length) + ' anchors ok on ' + path.basename(IN) + (src.includes('// ---- v31 (v31/patch.js') ? '' : ' (note: no v31 marker)'));
if (CHECK) process.exit(0);
let out = '', pos = 0;
for (const [a, b, e] of spans) { out += src.slice(pos, a) + e.replace; pos = b; }
out += src.slice(pos);
fs.writeFileSync(OUT, out);
console.log('wrote ' + OUT + ' (' + ((out.length - src.length) / 1024).toFixed(1) + ' KB vs base)');
