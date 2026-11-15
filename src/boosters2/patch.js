#!/usr/bin/env node
/* City Blast! boosters2 v15 (Owner 11/11/2026), stacked on v31:
 *   node boosters2/patch.js <in.html> [out.html]     (no out = patch in place)
 *   node boosters2/patch.js --check <in.html>         (report anchors only, write nothing)
 * Base: checkpoints/index-v12-v31.html. Output: checkpoints/index-v15-boosters2.html.
 * Never writes games/blast/index.html. Rules (as v31/patch.js): text anchors only, each found exactly once, no
 * overlapping edits, the file must carry the v31 marker and not this one; otherwise exit 1 and nothing is written.
 * Block: patch/boosters2.js (schedule + Wrecking Ball power hit), CSS: patch/boosters2.css (booster buttons, card).
 * 1. unlock schedule: the booster is the reward for the L10 / L20 / L30 boss win (Ball / Net / third = not built),
 *    first usable on L11 / L21 / L31; old saves past a boss get it; ?boosters=1 = all unlocked (replaces v31's hide)
 * 2. Wrecking Ball power hit: a path through the building, material ladder, steel bent + shoved, shockwave
 * 3. booster buttons: icon + count only; unlock card copy <= 6 words
 */
'use strict';
const fs = require('fs'), path = require('path');
const DIR = __dirname, MARK = '// ---- boosters2 v15 (boosters2/patch.js';
const NEED = ['// ---- v31 (v31/patch.js', '// ---- BALL v3 BEGIN'];
const args = process.argv.slice(2), CHECK = args[0] === '--check'; if (CHECK) args.shift();
const IN = args[0], OUT = args[1] || args[0];
if (!IN) { console.error('usage: node boosters2/patch.js [--check] <in.html> [out.html]'); process.exit(2); }
if (path.resolve(OUT) === path.resolve(DIR, '..', 'index.html')) { console.error('refusing to write games/blast/index.html'); process.exit(2); }
const src = fs.readFileSync(IN, 'utf8');
const block = fs.readFileSync(path.join(DIR, 'patch', 'boosters2.js'), 'utf8').replace(/\s+$/, '') + '\n' +
  fs.readFileSync(path.join(DIR, 'patch', 'sky.js'), 'utf8').replace(/\s+$/, '');
const css = fs.readFileSync(path.join(DIR, 'patch', 'boosters2.css'), 'utf8').replace(/\s+$/, '') + '\n';
const EDITS = [
  // ---- schedule
  { name: 'bar order: Ball + Net in TNT-only (+1 TNT = lose-card rescue only)',
    find: 'var BOOST_ORDER = L6.tntOnly ? ["net", "tnt1"] : ["wreck", "net", "tnt1"];',
    replace: 'var BOOST_ORDER = L6.tntOnly ? ["wreck", "net", "sky"] : ["wreck", "net", "tnt1", "sky"];   // boosters2: Ball (L10 win), Net (L20 win), Sky Strike (L30 win, Owner: option B)' },
  { name: 'v31 "boosters hidden" flag -> boosters2 schedule + power block',
    find: 'if(L6.tntOnly && !V31.boosters) ["net", "tnt1"].forEach(function(k){ if(BOOST[k]){ BOOST[k].hidden = true; BOOST[k].unlock = 999; } });',
    replace: '// v31 hid every booster here; boosters2 replaces it with the L10 / L20 / L30 schedule (?boosters=1 = all unlocked)\n' + block },
  { name: 'bstUnlocked: ?boosters=1 unlocks every built booster',
    find: 'function bstUnlocked(k){ return BST_ALL || !(BOOST[k] && BOOST[k].hidden) && !!(save.bseen && save.bseen[k]); }',
    replace: 'function bstUnlocked(k){ return BST_ALL || !(BOOST[k] && BOOST[k].hidden) && (B2.all || !!(save.bseen && save.bseen[k])); }' },
  { name: 'level start: grant what is due (old saves, ?boosters=1) instead of "level >= unlock"',
    find: '  if(!manual) BOOST_ORDER.forEach(function(k){ var sv = bstSave(); if(!save.bseen[k] && levelIdx + 1 >= BOOST[k].unlock){ save.bseen[k] = 1; sv[k] = (sv[k]||0) + BOOST[k].free; writeSave(); setTimeout(function(){ bstNew(k); }, 900); } });',
    replace: '  if(!manual){ b2Grant("start"); if(B2.cardQ.length) setTimeout(b2Card, 900); }   // boosters2: unlocked by the boss WIN (bstResult); old saves here' },
  { name: 'win screen: the boss win unlocks its booster (card over the win)',
    find: 'function bstResult(r){ if(r && !r.ok) bstFailN[levelIdx] = (bstFailN[levelIdx] || 0) + 1; else if(r) bstFailN[levelIdx] = 0; }',
    replace: 'function bstResult(r){ if(r && !r.ok) bstFailN[levelIdx] = (bstFailN[levelIdx] || 0) + 1; else if(r) bstFailN[levelIdx] = 0;\n' +
      '  if(r && r.ok && !manual && b2Grant("win").length) setTimeout(b2Card, 1100); }   // boosters2: L10 / L20 / L30 win = the unlock' },
  { name: 'GOT IT: the unlock card points at the button now (game) or on the next level (win screen)',
    find: 'function bstNewClose(){\n  $("bNew").classList.add("hidden"); if(bstNewQ.length){ setTimeout(bstNewNext, 250); return; }',
    replace: 'function bstNewClose(){\n  $("bNew").classList.add("hidden"); if(b2CardClosed()) return; if(bstNewQ.length){ setTimeout(bstNewNext, 250); return; }' },
  { name: 'next-level pointer: any booster (was Ball only)',
    find: '  if(ballOn() || !bstHave("wreck")) return;',
    replace: '  var hk = B2.handK || "wreck"; B2.handK = null; if((hk === "wreck" && ballOn()) || !bstHave(hk)) return;' },
  { name: 'next-level pointer: the button of that booster',
    find: "setTimeout(function(){ var b = $(\"bbar\") && $(\"bbar\").querySelector('[data-k=\"wreck\"]'); if(!b || ballOn()",
    replace: "setTimeout(function(){ var b = $(\"bbar\") && $(\"bbar\").querySelector('[data-k=\"' + hk + '\"]'); if(!b || (hk === \"wreck\" && ballOn())" },
  { name: 'locked toast: first usable level is the one after the boss',
    find: 'if(!bstUnlocked(k)) { toast("Unlocks at level " + BOOST[k].unlock); return; }',
    replace: 'if(!bstUnlocked(k)) { toast("Beat level " + BOOST[k].unlock); return; }' },
  // ---- Wrecking Ball power
  { name: 'BALL: power-hit timing (hit-stop, slow beat, contact, settle) from BPOW.ball',
    find: '  aimZoom:0.94, stop:0.09, slow:0.28, hitPad:0.02 };',
    replace: '  aimZoom:0.94, stop:0.09, slow:0.28, hitPad:0.02 };\nObject.assign(BALL, BPOW.ball);   // boosters2' },
  { name: 'ball prompt: never on steel (by material family, so a softer steel ladder keeps the rule)',
    find: '    if((b.def.armor || 0) >= 0.5){ steel++; return; }   // FIX2: steel shrugs the Ball off, never prompt it',
    replace: '    if(b2Steel(b)){ steel++; return; }   // FIX2: steel shrugs the Ball off, never prompt it (boosters2: by family)' },
  { name: 'ball impact: fix2 "knock out 1 member" -> ballPower (path, ladder, steel shove, shockwave, feel)',
    from: '  trauma = Math.min(1.2, trauma + 0.7); kickPx = Math.max(kickPx, 12); kickT = KICK_DUR; hitStop = Math.max(hitStop, BALL.stop);\n',
    to: '  // the short dynamic contact: a real 2.5 t Rapier ball',
    replace: '  ballPower(w, p, dir, best);   // boosters2 (boosters2/patch/boosters2.js)\n' },
  { name: 'aim tap: a tap on the "Tap to swing" ring swings at the prompt spot itself (snap, 30 px)',
    find: '  if(ballLive) return true;\n  var h = pick(x, y);',
    replace: '  if(ballLive) return true;\n  var h = b2Snap(x, y) || pick(x, y);   // boosters2' },
  { name: 'ball swoosh: skip a missing trail point (pre-existing v3 page error in the real-time loop after a swing)',
    find: '    for(var j=0;j<BR.NS;j++){ var hp2 = H[Math.min(n - 1, j)], hn = H[Math.min(n - 1, j + 1)], hq = H[Math.max(0, j - 1)];\n',
    replace: '    for(var j=0;j<BR.NS;j++){ var hp2 = H[Math.min(n - 1, j)], hn = H[Math.min(n - 1, j + 1)], hq = H[Math.max(0, j - 1)];\n      if(!hp2 || !hn || !hq){ probe.b2Trail = (probe.b2Trail || 0) + 1; st.visible = false; break; }   // boosters2\n' },
  // ---- Sky Strike hooks
  { name: 'sky: taps go to the strike while it is armed / live', find: 'function bstTap(x, y){',
    replace: 'function bstTap(x, y){\n  if(skyArmed || skyLive) return skyTap(x, y);   // boosters2 Sky Strike' },
  { name: 'sky: no BLAST / undo / other booster while a strike is live', find: 'function ballBusyNow(){ return !!ballLive; }',
    replace: 'function ballBusyNow(){ return !!ballLive || !!skyLive; }   // boosters2: + Sky Strike' },
  { name: 'sky: a live strike holds the wave end', find: 'function ballHold(){ return !!ballLive; }',
    replace: 'function ballHold(){ return !!ballLive || !!skyLive; }' },
  { name: 'sky: bar button', find: '  if(k === "wreck"){ ballBtn(); return; }',
    replace: '  if(k !== "sky") skyDisarm();\n  if(k === "sky"){ skyBtn(); return; }   // boosters2\n  if(k === "wreck"){ ballBtn(); return; }' },
  { name: 'sky: armed ring on its button', find: 'var on = (k === "wreck" && ballOn())',
    replace: 'var on = (k === "sky" && (skyArmed || !!skyLive)) || (k === "wreck" && ballOn())' },
  { name: 'sky: icon', find: 'function bstIcon(k, v){',
    replace: 'function bstIcon(k, v){\n  if(k === "sky") return \'<svg class="bi" viewBox="0 0 48 48" aria-hidden="true">\' + SKY_SVG + \'</svg>\';' },
  { name: 'sky: fixed step', find: 'if(quakeT >= 0) quakeStep();', replace: 'if(quakeT >= 0) quakeStep(); skyStep();' },
  { name: 'sky: frame', find: 'function bstFrame(rdt){ ballFrame(rdt); aimFadeFrame(rdt); }', replace: 'function bstFrame(rdt){ ballFrame(rdt); aimFadeFrame(rdt); skyFrame(rdt); }' },
  { name: 'sky: reset', find: '  aimFadeClear(); ballReset();', replace: '  aimFadeClear(); ballReset(); skyReset();' },
  // ---- css + harness
  { name: 'css: booster buttons (icon + count), unlock card',
    find: '/* ==== end v31 ==== */\n', replace: '/* ==== end v31 ==== */\n' + css },
  { name: 'harness: window.__blast.b2',
    find: 'window.__blast.matfx = MFX_API;\n', replace: 'window.__blast.matfx = MFX_API;\nwindow.__blast.b2 = B2_API;\nwindow.__blast.sky = SKY_API;\n' },
];
let bad = 0; const spans = [];
if (src.includes(MARK)) { console.error('already patched (marker found): ' + IN); process.exit(1); }
for (const m of NEED) if (!src.includes(m)) { console.error('base is missing ' + m); bad++; }
for (const e of EDITS) {
  if (e.from) {
    const n = src.split(e.from).length - 1, m2 = src.split(e.to).length - 1;
    if (n !== 1 || m2 !== 1) { console.error('anchor count from=' + n + ' to=' + m2 + ': ' + e.name); bad++; continue; }
    const a = src.indexOf(e.from), b = src.indexOf(e.to);
    if (b < a) { console.error('to before from: ' + e.name); bad++; continue; }
    spans.push([a, b, e]); continue;
  }
  const n = src.split(e.find).length - 1;
  if (n !== 1) { console.error((n ? 'DUPLICATE (' + n + ')' : 'MISSING') + ' anchor: ' + e.name); bad++; continue; }
  const at = src.indexOf(e.find); spans.push([at, at + e.find.length, e]);
}
spans.sort((a, b) => a[0] - b[0]);
for (let i = 1; i < spans.length; i++) if (spans[i][0] < spans[i - 1][1]) { console.error('OVERLAP: ' + spans[i - 1][2].name + ' / ' + spans[i][2].name); bad++; }
if (bad) { console.error(bad + ' problem(s); nothing written'); process.exit(1); }
console.log(EDITS.length + ' anchors ok on ' + path.basename(IN));
if (CHECK) process.exit(0);
let out = '', pos = 0;
for (const [a, b, e] of spans) { out += src.slice(pos, a) + e.replace; pos = b; }
out += src.slice(pos);
fs.writeFileSync(OUT, out);
console.log('wrote ' + OUT + ' (' + ((out.length - src.length) / 1024).toFixed(1) + ' KB vs base)');
