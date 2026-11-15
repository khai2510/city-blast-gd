#!/usr/bin/env node
/* City Blast! L32 MONUMENT prototype build (D-blast-HERO-MONUMENT, Owner 12/11/2026): the L13-36 checkpoint + patch/v14-monument.js,
 * appended LAST inside main() (after every other patch block), + the level-select overlay (games/blast/tools/lvpick-overlay.html: LV
 * button, ?lv=N) + "open L32 by default". Nothing else is changed: no other level, no v10-v13 patch, no level JSON.
 *
 *   node levels6/tools/src-l32.js [base.html] [out.html]
 *     base  default checkpoints/index-v10f-l13-36.html (read only)       out  default checkpoints/index-v10h-l32-monument.html
 *     env M14_OPEN=0   do not open L32 by default (the title screen first)
 *   in the page: ?lv=N opens level N (?lv=0 = title) · ?mon=0 the old L32 · ?mcam=0 the old camera · window.__blast.m14 = test API
 *   Automated browsers (navigator.webdriver: the bots, loadcheck) always start on the title screen, as the tools expect. */
'use strict';
const fs = require('fs'), path = require('path'), DIR = path.join(__dirname, '..');
const IN = process.argv[2] || path.join(DIR, '..', 'checkpoints', 'index-v10f-l13-36.html');
const OUT = process.argv[3] || path.join(DIR, '..', 'checkpoints', 'index-v10h-l32-monument.html');
if (path.resolve(OUT) === path.resolve(DIR, '..', 'index.html')) { console.error('refusing to write games/blast/index.html'); process.exit(2); }
if (path.resolve(OUT) === path.resolve(IN)) { console.error('refusing to overwrite the base'); process.exit(2); }
let src = fs.readFileSync(IN, 'utf8');
const MARK = '// ---- levels6 v14 MONUMENT', END = '\n} // main\n';
if (src.includes(MARK)) { console.error('already patched: ' + IN); process.exit(1); }
const once = (s) => { const i = src.indexOf(s); if (i < 0 || src.indexOf(s, i + 1) >= 0) { console.error('anchor missing or twice: ' + JSON.stringify(s.slice(0, 40))); process.exit(1); } return i; };
let i = once(END);
const block = fs.readFileSync(path.join(DIR, 'patch', 'v14-monument.js'), 'utf8').replace(/\s+$/, '');
src = src.slice(0, i) + '\n' + block + END + src.slice(i + END.length);
// level-select overlay + default level, right before </body>
let ov = fs.readFileSync(path.join(DIR, '..', 'tools', 'lvpick-overlay.html'), 'utf8').replace(/\s+$/, '');
if (!src.includes('id="lvBtn"')) {
  if (process.env.M14_OPEN !== '0') ov += '\n<script>\n/* L32 monument prototype: open L32 unless ?lv= is given (never in an automated browser: the bots start from the title) */\n' +
    '(function(){var q=new URLSearchParams(location.search);if(q.get("lv")!=null||navigator.webdriver)return;' +
    'var t=setInterval(function(){if(window.__blast&&window.__blast.start){clearInterval(t);setTimeout(function(){try{window.__blast.start(31);}catch(e){}},600);}},200);})();\n</script>';
  i = src.lastIndexOf('</body>'); if (i < 0) { console.error('no </body>'); process.exit(1); }
  src = src.slice(0, i) + ov + '\n' + src.slice(i);
}
fs.writeFileSync(OUT, src);
console.log('wrote', OUT, '(' + (src.length / 1048576).toFixed(2) + ' MB, base ' + path.basename(IN) + ')');
