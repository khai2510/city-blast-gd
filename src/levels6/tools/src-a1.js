#!/usr/bin/env node
/* City Blast! batch A1 build (D-blast-ROLLOUT, 13/11/2026; built on STD-v1): L1-L5 remade on the L32 standard.
 * Base = checkpoints/index-v10h-l32-monument.html (read only: L13-36 + v14 monument helpers + the LV picker overlay, L32 as it is)
 * + patch/v15-a1.js appended LAST inside main() (after the v14 block; it only calls M14.api.* and overrides LEVELS[0..4] at runtime).
 * The page opens on L1 instead of L32. Nothing else changes: no v10-v14 patch, no level JSON, no other level.
 *
 *   node levels6/tools/src-a1.js [base.html] [out.html]
 *     base  default checkpoints/index-v10h-l32-monument.html       out  default checkpoints/index-v10i-a1.html
 *     env A1_OPEN=0   do not switch the default level to L1 (used by tools/build-main.js: the main build opens on Home)
 *   in the page: ?lv=N opens level N (?lv=0 = title) · ?a1=0 the old L1-L5 · window.__blast.a1 = test API
 *   Automated browsers (navigator.webdriver: the bots, loadcheck) always start on the title screen, as the tools expect. */
'use strict';
const fs = require('fs'), path = require('path'), DIR = path.join(__dirname, '..');
const IN = process.argv[2] || path.join(DIR, '..', 'checkpoints', 'index-v10h-l32-monument.html');
const OUT = process.argv[3] || path.join(DIR, '..', 'checkpoints', 'index-v10i-a1.html');
if (path.resolve(OUT) === path.resolve(DIR, '..', 'index.html')) { console.error('refusing to write games/blast/index.html'); process.exit(2); }
if (path.resolve(OUT) === path.resolve(IN)) { console.error('refusing to overwrite the base'); process.exit(2); }
if (/index-main\.html$/.test(OUT)) { console.error('refusing to write the main build'); process.exit(2); }
let src = fs.readFileSync(IN, 'utf8');
const NEED = '// ---- end levels6 v14 MONUMENT', MARK = '// ---- levels6 v15 A1', END = '\n} // main\n';
if (!src.includes(NEED)) { console.error('base has no v14 monument block (M14.api): ' + IN); process.exit(1); }
if (src.includes(MARK)) { console.error('already patched: ' + IN); process.exit(1); }
const once = (s) => { const i = src.indexOf(s); if (i < 0 || src.indexOf(s, i + 1) >= 0) { console.error('anchor missing or twice: ' + JSON.stringify(s.slice(0, 40))); process.exit(1); } return i; };
let i = once(END);
const block = fs.readFileSync(path.join(DIR, 'patch', 'v15-a1.js'), 'utf8').replace(/\s+$/, '');
if (!block.startsWith(MARK)) { console.error('patch/v15-a1.js must start with ' + MARK); process.exit(1); }
src = src.slice(0, i) + '\n' + block + END + src.slice(i + END.length);
// open L1 by default instead of L32 (the overlay's own script; never in an automated browser)
// env A1_OPEN=0 (the main build: tools/build-main.js step "a1-levels"): the base has no "open L32" script, nothing to switch
if (process.env.A1_OPEN !== '0') { const OPEN = 'window.__blast.start(31);'; i = once(OPEN);
  src = src.slice(0, i) + 'window.__blast.start(0);' + src.slice(i + OPEN.length);
  src = src.replace('/* L32 monument prototype: open L32 unless ?lv= is given', '/* batch A1: open L1 unless ?lv= is given'); }
if (!src.includes('id="lvBtn"')) { console.error('base has no level picker overlay'); process.exit(1); }
fs.writeFileSync(OUT, src);
console.log('wrote', OUT, '(' + (src.length / 1048576).toFixed(2) + ' MB, base ' + path.basename(IN) + ')');
