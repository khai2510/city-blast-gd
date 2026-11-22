#!/usr/bin/env node
/* City Blast! MAIN build step "gem-art" (Agents-Game, 22/11/2026, Khai: a TEST of the Gemini (Nano Banana) art next to the
 * current look). OFF by default: ?art=1 turns it on (?art=0 off); env GEM_ART_DEFAULT=on bakes it on for a test-link build only.
 * View only: no rule, level, order, flow, save key or text changes. It goes right before the Mac's rs-look (which stays LAST).
 *   node src/gemart/patch.js <in.html> <out.html>
 * Sources: src/gemart/assets/*.webp (made by src/gemart/prep.py from the 22 Gemini PNGs; prompts in floormen
 * games/blast/art/gemini-prompts-2026-11-22.md), gemart.css (UI kit skin, html.gem), gemart.js (--gh sizing),
 * gemart-engine.js / gemart-engine2.js (material textures, dark pier, backdrop band). Anchors found exactly once, else exit 1. */
'use strict';
const fs = require('fs'), path = require('path');
const [IN, OUT] = process.argv.slice(2);
if (!IN || !OUT) { console.error('usage: node src/gemart/patch.js <in.html> <out.html>'); process.exit(2); }
if (path.basename(OUT) === 'index.html') { console.error('refusing to write an index.html'); process.exit(2); }
const D = __dirname, rd = (f) => fs.readFileSync(path.join(D, f), 'utf8');
let src = fs.readFileSync(IN, 'utf8');
const MARK = '<!-- gemart -->';
if (src.includes(MARK)) { console.error('already patched (gem-art): ' + IN); process.exit(1); }
if (src.includes('<!-- rs-look -->')) { console.error('gem-art must run BEFORE rs-look'); process.exit(1); }
const once = (a, what) => { const n = src.split(a).length - 1; if (n !== 1) { console.error((n ? 'DUPLICATE (' + n + ')' : 'MISSING') + ' anchor ' + (what || JSON.stringify(a.slice(0, 80)))); process.exit(1); } };
const A_HEAD = '</head>', A_BODY = '</body>';
const A_E1 = '// ---- end levelart part 1\nif(FD.mats) Object.keys(FD_MAT).forEach(function(n){';
const A_E2 = '  F.keys.forEach(function(k){ if(MATS[k] && MEMBERS[k]) fdMatHook(MATS[k], k, F); }); });\n';
const A_SKY = 'var LA_SKY = { r:200, rep:6, y0:-1.2 };';
[A_HEAD, A_BODY, A_E1, A_E2, A_SKY].forEach(a => once(a));
for (const need of ['var FD_IMG = {', 'var FD_MAT = {', 'function fdTex(key, opt){', 'function fdWhen(t, f){', 'function laBackdrop(', 'var laSprMat = null, laSkyMat = null', 'var LA_IMG = {', 'id="meter"', 'id="rMeter"', 'id="pauseBtn"', 'id="gearBtn"', 'class="bhead"'])
  if (!src.includes(need)) { console.error('MISSING text: ' + need); process.exit(1); }
// assets -> data URIs
const meta = JSON.parse(rd('assets/assets.json'));
const uri = (n) => { if (!meta[n]) { console.error('missing asset ' + n + ' (run src/gemart/prep.py)'); process.exit(1); } return 'data:image/webp;base64,' + fs.readFileSync(path.join(D, 'assets', n + '.webp')).toString('base64'); };
let css = rd('gemart.css').replace(/@IMG\(([a-z0-9-]+)\)/g, (_, n) => 'url("' + uri(n) + '")');
const TEX = {};
for (const [k, n] of [['glass', 'tx-glass'], ['brick', 'tx-brick'], ['concrete', 'tx-concrete'], ['steel', 'tx-steel'], ['stone', 'tx-stone'], ['pier', 'tx-pier'], ['sky', 'sky']])
  TEX[k] = { w: meta[n].w, h: meta[n].h, src: uri(n) };
const e1 = rd('gemart-engine.js').replace('/*GEM_TEX*/{}', JSON.stringify(TEX)).replace(/\s+$/, '');
const e2 = rd('gemart-engine2.js').replace(/\s+$/, '');
const DEF = process.env.GEM_ART_DEFAULT === 'on';
const flag = '<script id="gemFlag">/* gemart: ?art=1 on, ?art=0 off' + (DEF ? ', default ON (GEM_ART_DEFAULT=on test build)' : ', default off') + ' */' +
  '(function(){ var q = null; try{ q = new URLSearchParams(location.search).get("art"); }catch(e){} var on = q === "1" || (q !== "0" && ' + (DEF ? 'true' : 'false') + ');' +
  ' window.GEM_ART = on; if(on) document.documentElement.classList.add("gem"); })();</script>';
src = src.replace(A_HEAD, () => MARK + '\n' + flag + '\n<style id="gemCss">\n' + css.trim() + '\n</style>\n' + A_HEAD);
src = src.replace(A_E1, () => e1 + '\n' + A_E1);
src = src.replace(A_E2, () => A_E2 + e2 + '\n');
src = src.replace(A_SKY, () => A_SKY + ' if(window.GEM_ART) LA_SKY.rep = 20;   // gemart: C01 small enough that its edge trees and towers read as far away');
src = src.replace(A_BODY, () => '<script id="gemJs">\n' + rd('gemart.js').trim() + '\n</script>\n' + A_BODY);
fs.writeFileSync(OUT, src);
const kb = Object.values(meta).reduce((s, m) => s + m.bytes, 0) / 1024;
console.log('ok   gem-art (Gemini art test, ' + Object.keys(meta).length + ' assets ' + kb.toFixed(0) + ' KB, ' + (DEF ? 'DEFAULT ON' : '?art=1') + ') -> ' + path.basename(OUT));
