#!/usr/bin/env node
/* City Blast! v31 (Lead 11/11/2026), stacked on levels6 + materials-fx:
 *   node v31/patch.js <in.html> [out.html]     (no out = patch in place)
 *   node v31/patch.js --check <in.html>         (report anchors only, write nothing)
 * Base: checkpoints/index-v10-levels6.html + materials-fx/patch.js. Output: checkpoints/index-v12-v31.html.
 *   node materials-fx/patch.js checkpoints/index-v10-levels6.html /tmp/x.html && node v31/patch.js /tmp/x.html checkpoints/index-v12-v31.html
 * Never writes games/blast/index.html. Rules (as levels6/patch.js, materials-fx/patch.js): text anchors only, each found
 * exactly once, no overlapping edits, the file must carry both earlier markers and not this one; otherwise exit 1 and
 * nothing is written. Block: patch/v31.js (flags ?steelk=, ?boosters=1).
 * 1. steel throw x2 (one constant STEEL_THROW, ?steelk=4 = the materials-fx value)
 * 2. BLAST button: "BLAST!" only, no "WAVE a/b"; no wave count anywhere in the HUD / result card
 * 3. text cut, Smash Fest style (every string: v31/TEXT-CUT.md)
 * 4. Safety Net / +1 TNT unlock + NEW! cards hidden until L13 / L16 are rebuilt (?boosters=1 = back)
 */
'use strict';
const fs = require('fs'), path = require('path');
const DIR = __dirname, MARK = '// ---- v31 (v31/patch.js';
const NEED = ['// ---- levels6 v10', '// ---- materials-fx v11'];
const args = process.argv.slice(2), CHECK = args[0] === '--check'; if (CHECK) args.shift();
const IN = args[0], OUT = args[1] || args[0];
if (!IN) { console.error('usage: node v31/patch.js [--check] <in.html> [out.html]'); process.exit(2); }
if (path.resolve(OUT) === path.resolve(DIR, '..', 'index.html')) { console.error('refusing to write games/blast/index.html'); process.exit(2); }
const src = fs.readFileSync(IN, 'utf8');
const block = fs.readFileSync(path.join(DIR, 'patch', 'v31.js'), 'utf8').replace(/\s+$/, '');
const CSS = '/* ==== v31: BLAST button label only (no WAVE a/b) ==== */\n' +
  'html body #blast#blast#blast small,#blastN{display:none!important}\n' +
  'html body #blast#blast#blast{grid-template-rows:auto}\n' +
  'html body #blast#blast#blast::before{grid-row:1}\n' +
  '/* ==== end v31 ==== */\n';
const EDITS = [
  // ---- block + flags (after the booster table: BOOST, LEVELS, MATFX, L6, QS all exist here)
  { name: 'block: flags, steel throw, boosters hidden, stub tips',
    find: 'var BOOST_ORDER = L6.tntOnly ? ["net", "tnt1"] : ["wreck", "net", "tnt1"];',
    replace: 'var BOOST_ORDER = L6.tntOnly ? ["net", "tnt1"] : ["wreck", "net", "tnt1"];\n' + block },
  { name: 'boosters: a hidden booster is not usable even if an old save has seen it',
    find: 'function bstUnlocked(k){ return BST_ALL || !!(save.bseen && save.bseen[k]); }',
    replace: 'function bstUnlocked(k){ return BST_ALL || !(BOOST[k] && BOOST[k].hidden) && !!(save.bseen && save.bseen[k]); }' },
  // ---- BLAST button: label only
  { name: 'BLAST button: no wave sub-label (markup)',
    find: '<small id="blastN">0/1</small>', replace: '<small id="blastN" hidden></small>' },
  { name: 'BLAST button: no wave sub-label (HUD sync)',
    find: '  $("blastN").textContent = "wave " + wave + "/" + maxWaves;', replace: '  // v31: the BLAST button says "BLAST!" only (no wave count)' },
  { name: 'BLAST button: CSS (one row, label centred)',
    find: '/* ==== end juice Batch 1 ==== */\n', replace: '/* ==== end juice Batch 1 ==== */\n' + CSS },
  // ---- wave counts out of the HUD and the result card
  { name: 'between waves: no "Wave a/b · n left" toast',
    find: 'toast(dudWave ? "Didn\'t budge — try another spot" : "Wave " + wave + "/" + maxWaves + " · " + stockLeft() + " left");',
    replace: 'if(dudWave) toast("Didn\'t budge. Try another spot.");',
    done: '  if(dudWave) toast("Didn\'t budge. Try another spot.");' },   // levels round 5+ (levels6/patch.js multi-wave rule 2/5) already has it
  { name: 'between waves: the tip does not name the wave',
    find: '  var w = "Wave " + wave + ": ";\n  if(v.code === "core") return w + "Cutter the blue core.";\n  if(v.code === "height") return w + "still " + standingHeight().toFixed(0) + " m up. Hit the base.";\n  return w + v5Pct(score()) + "% down, need " + Math.round(L.target*100) + "%.\\nHit what still stands.";',
    replace: '  if(v.code === "core") return L6.tntOnly ? "TNT right on the core." : "Cutter the blue core.";\n  if(v.code === "height") return "Still standing. Hit the base.";\n  return "Hit what still stands.";',
    done: '  if(v.code === "core") return L6.tntOnly ? "TNT right on the core." : "Cutter the blue core.";\n  if(v.code === "height") return "Still standing. Hit the base.";\n  return "Hit what still stands.";' },   // round 5+ (3/5)
  { name: 'rescue: the tip does not name the wave',
    find: '$("tip").textContent = "Wave " + wave + ": one more " + CHARGES[k].name + ".\\nHit what still stands.";',
    replace: '$("tip").textContent = "Hit what still stands.";' },
  { name: 'result card: no "Waves a / b" line',
    find: "              '<div><span>Waves</span><b>' + r.waves + ' / ' + maxWaves + '</b></div>';",
    replace: "              '';   // v31: no wave count",
    done: " : '') +\n              '';\n  if(L.keep) lines += '<div><span>Damage to " },   // round 5+ (4/5)
  { name: 'result card: "Bonus" without the breakdown',
    find: "'<div id=\"rBonus\"><span>Bonus (' + r.overPts + '% over PASS' + (r.combo>=3 ? ' · combo ×' + r.combo : '') + ')</span>",
    replace: "'<div id=\"rBonus\"><span>Bonus</span>" },
  // ---- text cut (TEXT-CUT.md)
  { name: 'lose card: no pep line after the %',
    find: '"% down, PASS is " + Math.round(L.target*100) + "%. A new plan will do it.")',
    replace: '"% down. PASS " + Math.round(L.target*100) + "%.")' },
  { name: 'core fail: short why',
    find: 'why:L6.tntOnly ? "TNT can\'t break the core. Bring it down around it."',
    replace: 'why:L6.tntOnly ? "The core still stands."' },
  { name: 'lose tips <= 6 words',
    find: '  if(r.code === "collateral") return "Topple it AWAY from " + keepName + ": hit the far side first.";\n  if(r.code === "street") return "Hit the BACK first, so it falls away from the street.";\n  if(r.code === "core") return "Put a Cutter right on the grey core.";',
    replace: '  if(r.code === "collateral") return "Hit the side away from it.";\n  if(r.code === "street") return "Hit the BACK first.";\n  if(r.code === "core") return L6.tntOnly ? "TNT right on the core." : "Put a Cutter right on the grey core.";' },
  { name: 'lose tips <= 6 words (2)',
    find: '  if(r.dud) return "That spot didn\'t budge: hit a column.";',
    replace: '  if(r.dud) return "Didn\'t budge. Hit a column.";' },
  { name: 'lose tips <= 6 words (3)',
    find: 'return "Too close together: spread them along one side.";\n  if(sh.length === 1 && totalCharges > 1) return "Use more charges in the first wave.";',
    replace: 'return "Too close. Spread them out.";\n  if(sh.length === 1 && totalCharges > 1) return "Use more TNT at once.";',
    // round 5+ (5/5) says "Use more TNT." (no "at once": with the multi-wave rule a second blast is fine); only the first line is cut
    alt: { find: 'return "Too close together: spread them along one side.";\n  if(sh.length === 1 && totalCharges > 1) return "Use more TNT.";',
           replace: 'return "Too close. Spread them out.";\n  if(sh.length === 1 && totalCharges > 1) return "Use more TNT.";' } },
  { name: 'toast: tap a placed charge',
    find: 'toast("Tap × to remove · tap the building to move it");', replace: 'toast("Tap × to remove");' },
  { name: 'toast: removed',
    find: 'toast("Removed · " + name + " back in the tray");', replace: 'toast("Removed");' },
  { name: 'toast: protected building',
    find: 'toast("Protected! Blue roof + sign: hands off the " + keepRoleName(h.block) + ".");', replace: 'toast("Protected! Hands off.");' },
  { name: 'toast: all charges placed',
    find: 'toast("All charges placed · tap BLAST, or a charge to move it");', replace: 'toast("Tap BLAST!");' },
  { name: 'toast: fuse stopped',
    find: 'toast("Fuse stopped · move it, remove it or tap BLAST");', replace: 'toast("Fuse stopped. Tap BLAST!");' },
  { name: 'zoom hint: short',
    find: 'h.textContent = matchMedia("(pointer:coarse)").matches ? "Pinch to zoom · double-tap to reset" : "Scroll to zoom · double-tap to reset";',
    replace: 'h.textContent = matchMedia("(pointer:coarse)").matches ? "Pinch to zoom" : "Scroll to zoom";' },
  { name: 'map: end of the city, no marketing subtitle',
    find: '"<b>MORE SOON</b><span>New districts</span>"', replace: '"<b>MORE SOON</b>"' },
  { name: 'harness: window.__blast.v31',
    find: 'window.__blast.matfx = MFX_API;',
    replace: 'window.__blast.matfx = MFX_API;\nwindow.__blast.v31 = { flags:function(){ return Object.assign({ steelThrow:MATFX.steel.throw, steelDefault:STEEL_THROW }, V31); },\n' +
      '  boosters:function(){ var o = {}; Object.keys(BOOST).forEach(function(k){ o[k] = { hidden:!!BOOST[k].hidden, unlock:BOOST[k].unlock, usable:bstUnlocked(k) }; }); return o; },\n' +
      '  tips:function(){ return LEVELS.map(function(l){ return { tip:l.tip, tip2:l.tip2 || null, intro:l.intro || null, win:l.win || null }; }); } };' },
];
let bad = 0; const spans = [];
if (src.includes(MARK)) { console.error('already patched (marker found): ' + IN); process.exit(1); }
for (const m of NEED) if (!src.includes(m)) { console.error('base is missing ' + m + ' (apply levels6 and materials-fx first)'); bad++; }
for (const e of EDITS) {
  let n = src.split(e.find).length - 1;
  // stacking on levels round 5+ (12/11/2026, tools/build-main.js): levels6/patch.js made some of these text cuts itself. `done` = the
  // result is already in the base (found exactly once: the edit is skipped); `alt` = the same edit on the round-5 wording.
  if (n === 0 && e.done && src.split(e.done).length - 1 === 1) { console.log('ok   already in the base: ' + e.name); continue; }
  if (n === 0 && e.alt && src.split(e.alt.find).length - 1 === 1) { e.find = e.alt.find; e.replace = e.alt.replace; n = 1; console.log('ok   round-5 wording: ' + e.name); }
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
