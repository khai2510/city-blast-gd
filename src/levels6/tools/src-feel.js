#!/usr/bin/env node
/* City Blast! FEEL build (H2H-DESIGN.md §5.1, quick wins Q1-Q8): the current levels checkpoint + patch/v13-feel.js, applied LAST
 * (right before the end of main(), after every other patch block). Nothing else is changed: no level datum, no physics, no rule.
 *
 *   node levels6/tools/src-feel.js [base.html] [out.html]
 *     base  default checkpoints/index-v10f-l13-36.html (read only)       out  default checkpoints/index-v10g-feel.html
 *     env FEEL_DEFAULT=off   the same file with every Q off by default (for A/B runs of tools that cannot pass a URL query);
 *                            the page's ?feel=... still wins
 *     env FEEL_EXTRA=<file.js>[,<file.js>]   more blocks appended after v13-feel.js (the UI demo: ui-feel/q9.js)
 *   in the page: ?feel=off | ?feel=-q3,-q5 (all but) | ?feel=q1,q2 (only those); window.__blast.feel = {q1..q8} */
'use strict';
const fs = require('fs'), path = require('path'), DIR = path.join(__dirname, '..');
const IN = process.argv[2] || path.join(DIR, '..', 'checkpoints', 'index-v10f-l13-36.html');
const OUT = process.argv[3] || path.join(DIR, '..', 'checkpoints', 'index-v10g-feel.html');
if (path.resolve(OUT) === path.resolve(DIR, '..', 'index.html')) { console.error('refusing to write games/blast/index.html'); process.exit(2); }
if (path.resolve(OUT) === path.resolve(IN)) { console.error('refusing to overwrite the base'); process.exit(2); }
let src = fs.readFileSync(IN, 'utf8');
const MARK = '// ---- levels6 v13 FEEL', END = '\n} // main\n';
if (src.includes(MARK)) { console.error('already patched: ' + IN); process.exit(1); }
const i = src.indexOf(END);
if (i < 0 || src.indexOf(END, i + 1) >= 0) { console.error('anchor "} // main" missing or twice'); process.exit(1); }
const dflt = process.env.FEEL_DEFAULT === 'off' ? 'off' : 'on';
let block = 'var FEEL_DEFAULT = "' + dflt + '";   // levels6/tools/src-feel.js\n' + fs.readFileSync(path.join(DIR, 'patch', 'v13-feel.js'), 'utf8').replace(/\s+$/, '');
(process.env.FEEL_EXTRA || '').split(',').filter(Boolean).forEach(f => { block += '\n' + fs.readFileSync(path.resolve(f), 'utf8').replace(/\s+$/, ''); });
src = src.slice(0, i) + '\n' + block + END + src.slice(i + END.length);
fs.writeFileSync(OUT, src);
console.log('wrote', OUT, '(' + ((src.length) / 1048576).toFixed(2) + ' MB, feel default ' + dflt + ', base ' + path.basename(IN) + ')');
