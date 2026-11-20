#!/usr/bin/env node
/* City Blast! MAIN build step "polish" (last, after shop): appends main/polish.js at the end of main() so it wraps the final
 * startLevel / showResult / goHome / rescue / onTap / stepHand / updateCamera / bstSync / bstPlay / addCoins / homeLabels.
 * Same rules as main/prelevel-patch.js: one text anchor, found exactly once, else exit 1 and nothing written; a marker so it
 * cannot apply twice.   node main/polish-patch.js <in.html> <out.html>
 * Never writes games/blast/index.html. What and why: header of main/polish.js (H2H Smash Fest UX/UI + Car Sort F4, 15/11/2026). ?polish=0 = off. */
'use strict';
const fs = require('fs'), path = require('path');
const [IN, OUT] = process.argv.slice(2);
if (!IN || !OUT) { console.error('usage: node main/polish-patch.js <in.html> <out.html>'); process.exit(2); }
if (path.resolve(OUT) === path.resolve(__dirname, '..', 'index.html')) { console.error('refusing to write games/blast/index.html'); process.exit(2); }
const src = fs.readFileSync(IN, 'utf8'), MARK = '<!-- main/polish.js -->', A = '\n} // main\n';
if (src.includes(MARK)) { console.error('already patched (polish): ' + IN); process.exit(1); }
const n = src.split(A).length - 1;
if (n !== 1) { console.error((n ? 'DUPLICATE (' + n + ')' : 'MISSING') + ' anchor "} // main"'); process.exit(1); }
for (const need of ['function addCoins(v, audible){', 'function showResult(){', 'function goHome(){', 'function stepHand(){', 'function updateCamera(rdt){', 'function bstSync(){', 'function bstPlay(i){',
  'st.id = "feelStamp"', 'plus.id = "uicPlus"', 'id="pauseM"', 'id="pmSfx"', 'id="pmMus"', 'id="shopPlay"', 'id="cmPlay"', 'tLbl.id = "t2Lbl"', 'setDblMs:function(f)', 'window.__blast.pre = {', 'window.__blast.tap2 = {', 'function stepShields(){', 'function buildShields(){', 'function shieldDamage(sh){', 'function verdict(){', 'function l6HardBroken(){', 'function shieldAnchor(', 'function onTap(x, y){'])
  if (!src.includes(need)) { console.error('MISSING engine / UI text: ' + need); process.exit(1); }
const t = src.indexOf('<title>'); if (t < 0) { console.error('no <title>'); process.exit(1); }
const body = fs.readFileSync(path.join(__dirname, 'polish.js'), 'utf8').replace(/\s+$/, '');
let out = src.replace(A, () => '\n' + body + A);
out = out.slice(0, t) + MARK + out.slice(t);
fs.writeFileSync(OUT, out);
console.log('ok   B1 coin pill = bank · B2 pause icons · X1 win payoff · X3 empty-tap hand · X4 pause rows · X5 two-line Play · X7/X8 copy · X9 L1 label + 400 ms · X10 chips · X11 targets · XB idle BLAST · K1-K3 protected (17/11)  -> ' + path.basename(OUT));
