#!/usr/bin/env node
/* City Blast! MAIN build step "ui2" (very last, after audio-el / perf): appends main/ui2.js at the end of main() so it wraps the final
 * syncTop / placeCharge / bumpPill / showResult and restyles the HUD, Shop, pre-level card, settings. Same rules as main/glue.js:
 * one text anchor, found exactly once, else exit 1 and nothing written; a marker so it cannot apply twice.
 *   node main/ui2-patch.js <in.html> <out.html>
 * Never writes games/blast/index.html. What it does and why: games/blast/UI2-STATUS.md. ?ui2=0 at runtime = the old UI. */
'use strict';
const fs = require('fs'), path = require('path');
const [IN, OUT] = process.argv.slice(2);
if (!IN || !OUT) { console.error('usage: node main/ui2-patch.js <in.html> <out.html>'); process.exit(2); }
if (path.resolve(OUT) === path.resolve(__dirname, '..', 'index.html')) { console.error('refusing to write games/blast/index.html'); process.exit(2); }
const src = fs.readFileSync(IN, 'utf8'), MARK = '<!-- main/ui2.js -->', A = '\n} // main\n';
if (src.includes(MARK)) { console.error('already patched (ui2): ' + IN); process.exit(1); }
const n = src.split(A).length - 1;
if (n !== 1) { console.error((n ? 'DUPLICATE (' + n + ')' : 'MISSING') + ' anchor "} // main"'); process.exit(1); }
// engine / UI names the block wraps or reads: stop if any is gone (a renamed function would silently do nothing)
for (const need of ['function syncTop(){', 'function placeCharge(', 'function bumpPill(){', 'function showResult(){', 'function isHard(Lv){', 'meterOn = null', 'lastResult=null',
  'id="meter"', 'id="mPass"', 'id="mTag"', 'id="lvPill"', 'id="undo"', 'id="bPick"', 'id="setReset"', 'id="bbar"', 'id="lvBtn"', 'window.__blast.intro = {'])
  if (!src.includes(need)) { console.error('MISSING engine / UI text: ' + need); process.exit(1); }
const t = src.indexOf('<title>'); if (t < 0) { console.error('no <title>'); process.exit(1); }
// G2 Home elements (design/home-elements/): UI2:e1 = clean background plate (864x1536), UI2:e2 = hero building + crane (alpha),
// both WebP q82 data URIs (encoded with python3/PIL, as uiclean/home-nomile.js does)
const cp = require('child_process'), HE = path.join(__dirname, '..', 'design', 'home-elements');
const webp = (f) => 'data:image/webp;base64,' + cp.execFileSync('python3', ['-c',
  'import io,sys,base64;from PIL import Image;b=io.BytesIO();Image.open(sys.argv[1]).save(b,"WEBP",quality=82,method=6);sys.stdout.write(base64.b64encode(b.getvalue()).decode())',
  f], { maxBuffer: 1 << 26 }).toString();
const ASSET = { e1: webp(path.join(HE, 'e1-plate-864x1536.png')), e2: webp(path.join(HE, 'e2-hero.png')),
  shop: webp(path.join(HE, 'e6v2-shop.png')), home: webp(path.join(HE, 'e6v2-home.png')), upgr: webp(path.join(HE, 'e6v2-upgrades.png')), gear: webp(path.join(HE, 'e7v2-gear.png')) };
const body = fs.readFileSync(path.join(__dirname, 'ui2.js'), 'utf8').replace(/\s+$/, '').replace(/UI2:(e1|e2|shop|home|upgr|gear)/g, (m, k) => '\\"' + ASSET[k] + '\\"');
let out = src.replace(A, () => '\n' + body + A);
out = out.slice(0, t) + MARK + out.slice(t);
fs.writeFileSync(OUT, out);
console.log('ok   U1 HUD <= 5 items · U2 one type system · U3 colour slips · U4 win fx · U5 Upgrades backdrop · U6 pre-level / settings  -> ' + path.basename(OUT));
