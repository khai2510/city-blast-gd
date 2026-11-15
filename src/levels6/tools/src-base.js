#!/usr/bin/env node
/* City Blast! BASE step (D-blast-MATCURVE, 14/11/2026): patch/v15-base.js appended inside main(), after the last v15 batch block
 * (needs the v15 A1 block), before main/glue.js final. The per-building base setting is read from level data (L.base).
 *   node levels6/tools/src-base.js <base.html> <out.html>     (refuses to write games/blast/index.html or onto its base)
 *   in the page: ?base=0 = the setting is ignored (old behaviour) · window.__blast.base.info() */
'use strict';
const fs = require('fs'), path = require('path'), DIR = path.join(__dirname, '..');
const [IN, OUT] = process.argv.slice(2).map(p => p && path.resolve(p));
if (!IN || !OUT) { console.error('usage: src-base.js <base.html> <out.html>'); process.exit(2); }
if (OUT === IN || OUT === path.resolve(DIR, '..', 'index.html')) { console.error('refusing to write ' + OUT); process.exit(2); }
let src = fs.readFileSync(IN, 'utf8'); const END = '\n} // main\n', MARK = '// ---- levels6 v15 BASE', NEED = '// ---- end levels6 v15 A1';
if (!src.includes(NEED)) { console.error('base has no v15 A1 block: ' + IN); process.exit(1); }
if (src.includes(MARK)) { console.error('already patched: ' + IN); process.exit(1); }
const i = src.indexOf(END); if (i < 0 || src.indexOf(END, i + 1) >= 0) { console.error('anchor "} // main" missing or twice'); process.exit(1); }
const block = fs.readFileSync(path.join(DIR, 'patch', 'v15-base.js'), 'utf8').replace(/\s+$/, '');
if (!block.startsWith(MARK)) { console.error('patch/v15-base.js must start with ' + MARK); process.exit(1); }
src = src.slice(0, i) + '\n' + block + END + src.slice(i + END.length);
fs.writeFileSync(OUT, src); console.log('wrote ' + OUT + ' (' + (src.length / 1048576).toFixed(2) + ' MB, base ' + path.basename(IN) + ')');
