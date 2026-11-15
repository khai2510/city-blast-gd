#!/usr/bin/env node
/* City Blast! MAIN build step "look" (right after frame): appends main/look.js inside main() so it wraps the final updateCamera /
 * fdChargeModel / laBackdrop / applyTheme and sees every member material. Same rules as main/frame-patch.js: one text anchor, found
 * exactly once, else exit 1 and nothing written. Embeds design/home-elements/e7e8-coin.png (Upgrades: Coin Bonus icon).
 *   node main/look-patch.js <in.html> <out.html>
 * Never writes games/blast/index.html. What it does: the header of main/look.js; why: research/h2h-carsort/H2H-DESIGN.md (F1, F2, F5, F6, F7, F10). */
'use strict';
const fs = require('fs'), path = require('path');
const [IN, OUT] = process.argv.slice(2);
if (!IN || !OUT) { console.error('usage: node main/look-patch.js <in.html> <out.html>'); process.exit(2); }
if (path.resolve(OUT) === path.resolve(__dirname, '..', 'index.html')) { console.error('refusing to write games/blast/index.html'); process.exit(2); }
const src = fs.readFileSync(IN, 'utf8'), MARK = '<!-- main/look.js -->', A = '\n} // main\n';
if (src.includes(MARK)) { console.error('already patched (look): ' + IN); process.exit(1); }
if (!src.includes('<!-- main/frame.js -->')) { console.error('MISSING step frame (look goes after it)'); process.exit(1); }
const n = src.split(A).length - 1;
if (n !== 1) { console.error((n ? 'DUPLICATE (' + n + ')' : 'MISSING') + ' anchor "} // main"'); process.exit(1); }
for (const need of ['var GLOSS_K = {', 'function glossMat0(m, key){', 'float ao = clamp(0.42*under + 0.26*foot + 0.24*head + 0.34*gnd, 0.0, 0.6);', 'function laBackdrop(', 'var laSprMat = null, laSkyMat = null',
  'function applyTheme(d){', 'function fdChargeModel(k){', 'function chargeMats(k){', 'var UPG = [', 'vec4 texelColor = texture2D(map, vLaW/vec2(7.0, 10.5));', 'varying vec2 vGw;', 'var hemi = new THREE.HemisphereLight('])
  if (!src.includes(need)) { console.error('MISSING engine text: ' + need); process.exit(1); }
const t = src.indexOf('<title>'); if (t < 0) { console.error('no <title>'); process.exit(1); }
const coin = 'data:image/png;base64,' + fs.readFileSync(path.join(__dirname, '..', 'design', 'home-elements', 'e7e8-coin.png')).toString('base64');
const js = fs.readFileSync(path.join(__dirname, 'look.js'), 'utf8').replace(/\s+$/, '').replace('"__LK_COIN__"', JSON.stringify(coin));
if (js.includes('__LK_COIN__')) { console.error('coin placeholder not replaced'); process.exit(1); }
let out = src.replace(A, '\n' + js + A);
out = out.slice(0, t) + MARK + out.slice(t);
fs.writeFileSync(OUT, out);
console.log('ok   K1 calm world (sage lawn + distance haze, sand contrast, skyline -30% sat / +haze) · K2 collapse framing (hero + debris ~50% of the play area) · K3 gloss + AO x1.5 on concrete / brick, softer higher sun · K4 white rim on charged members + TNT · K5 Upgrades icons  -> ' + path.basename(OUT));
