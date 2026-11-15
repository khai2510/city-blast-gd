#!/usr/bin/env node
/* City Blast! UI clean-up v14 (Owner 11/11/2026: "compare with Colony Flow, clean up, remove superfluous notes, the Blast
 * button is text with no icon"). UI only: no gameplay, physics, level data, economy or price change.
 *   node uiclean/patch.js <in.html> [out.html]     (no out = patch in place)
 *   node uiclean/patch.js --check <in.html>         (report anchors only, write nothing)
 * Base: checkpoints/index-v12-v31.html. Output: checkpoints/index-v14-uiclean.html.
 *   node uiclean/patch.js checkpoints/index-v12-v31.html checkpoints/index-v14-uiclean.html
 * Stacks with metrics/patch.js (either order) and on a levels round 3 build carried through materials-fx + v31: it anchors
 * only on UI code (the end of the main <style>, the end of the UILAYOUT script, the result card tip, the Upgrades card,
 * the Settings Reduce motion row), never on level data or the engine.
 * Rules (as v31/patch.js): text anchors only, each found exactly once, no overlapping edits, the file must not carry this
 * marker already; otherwise exit 1 and nothing is written. Never writes games/blast/index.html.
 * Blocks: patch/uiclean.css (layout / visibility), patch/uiclean.js (body classes, 48-px floor, Settings row).
 * What and why: uiclean/COMPARE-BEFORE.md (E = excess, M = missing / broken), result: uiclean/COMPARE-AFTER.md;
 * head-to-head with Smash Fest (H1-H6): uiclean/H2H-SMASHFEST.md. Full stack: v31 -> uiclean -> boosters2 -> metrics = checkpoints/index-v16b-ui-h2h.html.
 */
'use strict';
const fs = require('fs'), path = require('path');
const DIR = __dirname, MARK = '// ---- uiclean v14 (uiclean/patch.js';
const args = process.argv.slice(2), CHECK = args[0] === '--check'; if (CHECK) args.shift();
const IN = args[0], OUT = args[1] || args[0];
if (!IN) { console.error('usage: node uiclean/patch.js [--check] <in.html> [out.html]'); process.exit(2); }
if (path.resolve(OUT) === path.resolve(DIR, '..', 'index.html')) { console.error('refusing to write games/blast/index.html'); process.exit(2); }
const src = fs.readFileSync(IN, 'utf8');
const css = fs.readFileSync(path.join(DIR, 'patch', 'uiclean.css'), 'utf8').replace(/\s+$/, '') + '\n';
const js = fs.readFileSync(path.join(DIR, 'patch', 'uiclean.js'), 'utf8').replace(/\s+$/, '') + '\n';
const RUNNER = '<svg class="i s24" viewBox="0 0 24 24" aria-hidden="true"><circle cx="15.5" cy="4.2" r="2.4" fill="currentColor"/><path d="M4.5 9.5l4.2-2.2 4.3 1.2 2.6 4 3.9 1M13 8.5l-2.4 6 3.4 3 .6 4.5M10.6 14.5l-1.8 3.2-5.3 1" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const EDITS = [
  { name: 'CSS block: end of the main <style> (after UILAYOUT, juice and v31 rules, so it wins at equal specificity)',
    find: '</style>\n<script>(function(){function u(){', replace: css + '</style>\n<script>(function(){function u(){' },
  { name: 'JS block: end of the UILAYOUT script (show / syncHUD are already wrapped there; metrics anchors on "} // main" after it)',
    find: '}catch(e){ console.error("UILAYOUT", e); }\n', replace: '}catch(e){ console.error("UILAYOUT", e); }\n' + js },
  { name: 'E8 lose card: the tip without a "Tip:" label (cards.png shows the line alone)',
    find: 'tipEl.innerHTML = "<b>Tip:</b> " + failTip(r);', replace: 'tipEl.textContent = failTip(r);' },
  { name: 'S1 win without a card: the bonus coins fly from the rubble (uicFlySrc) instead of from the hidden "Bonus" row',
    find: 'src = (row || $("rLines")).getBoundingClientRect(), tgt = $("coinPill")', replace: 'src = (window.uicFlySrc && window.uicFlySrc()) || (row || $("rLines")).getBoundingClientRect(), tgt = $("coinPill")' },
  { name: 'E7 Upgrades: no "—" line under a level-0 upgrade',
    find: '<div class="ef">\'+(l ? u.eff(l) : "—")+\'</div>', replace: '<div class="ef">\'+(l ? u.eff(l) : "")+\'</div>' },
  { name: 'M5 Upgrades: coins with a thousands comma like every other coin pill ("1,250", was "1250")',
    find: '$("shopCoinTxt").textContent = save.coins;', replace: '$("shopCoinTxt").textContent = String(Math.max(0, save.coins|0)).replace(/\\B(?=(\\d{3})+(?!\\d))/g, ",");' },
  { name: 'E9 Settings: Reduce motion row gets the pause card\'s runner icon (a check mark read as "already on")',
    find: 'b.innerHTML = \'<svg class="i s24"><use href="#i-check"/></svg> Reduce motion<span class="sw">\'',
    replace: 'b.innerHTML = \'' + RUNNER + ' Reduce motion<span class="sw">\'' },
];
let bad = 0; const spans = [];
if (src.includes(MARK)) { console.error('already patched (marker found): ' + IN); process.exit(1); }
if (!js.startsWith(MARK)) { console.error('patch/uiclean.js must start with the marker'); process.exit(1); }
for (const e of EDITS) {
  const n = src.split(e.find).length - 1;
  if (n !== 1) { console.error((n ? 'DUPLICATE (' + n + ')' : 'MISSING') + ' anchor: ' + e.name); bad++; continue; }
  const at = src.indexOf(e.find); spans.push([at, at + e.find.length, e]);
}
// names the JS block uses (engine UI state); a rename upstream must fail here, not at run time
for (const r of ['function show(', 'function syncHUD(', 'function showResult(', 'function toast(msg){', 'function popText(t, cls){', 'function applyTheme(d){', 'function levelPalette(Lv, i){', 'var PALETTES_D = ', 'id="lvTxt"', 'id="cmPlay"', 'id="shopPlay"', 'function goHome(', 'function bumpPill(', 'function screenFlash(', 'var focus = new THREE.Vector3(), focusY', 'var _show = show; show = function(id){', 'var _syncTop = syncTop;', 'window.__blast = {',
  'id="bconfTog"', 'id="undo"', 'id="meter"', 'id="ulTabs"', 'id="hMile"', 'class="ulDot"', 'id="blast"', '<b class="ulBl">BLAST!</b>'])
  if (!src.includes(r)) { console.error('MISSING UI name: ' + r); bad++; }
spans.sort((a, b) => a[0] - b[0]);
for (let i = 1; i < spans.length; i++) if (spans[i][0] < spans[i - 1][1]) { console.error('OVERLAP: ' + spans[i - 1][2].name + ' / ' + spans[i][2].name); bad++; }
if (bad) { console.error(bad + ' problem(s); nothing written'); process.exit(1); }
const stack = ['// ---- v31 (v31/patch.js', '// ---- metrics v13 (metrics/patch.js', '// ---- levels6 v10'].filter(m => src.includes(m)).map(m => m.split(' ')[2]);
console.log(EDITS.length + ' anchors ok on ' + path.basename(IN) + ' (base carries: ' + (stack.join(', ') || 'none') + ')');
if (CHECK) process.exit(0);
let out = '', pos = 0;
for (const [a, b, e] of spans) { out += src.slice(pos, a) + e.replace; pos = b; }
out += src.slice(pos);
fs.writeFileSync(OUT, out);
console.log('wrote ' + OUT + ' (' + ((out.length - src.length) / 1024).toFixed(1) + ' KB vs base)');
