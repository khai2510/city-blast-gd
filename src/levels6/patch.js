#!/usr/bin/env node
/* City Blast! levels6 v10 (Owner 10/11/2026): massive buildings, real protected neighbours, TNT only, no "what is this
 * building" notes, minimal tutorial, levels-v6, reward-by-difficulty flag.
 *   node levels6/patch.js <in.html> [out.html]     (no out = patch in place)
 *   node levels6/patch.js --check <in.html>         (report anchors only, write nothing)
 * Base: checkpoints/index-v9-v30.html. Output: checkpoints/index-v10d-levels6r5.html (round 5). Never games/blast/index.html.
 * Rules (as qa-float/patch.js): text anchors only, each found exactly once, no overlapping edits, the file must not
 * already carry the marker; otherwise exit 1 and nothing is written. Block: patch/v10.js. Levels: levels-v6.json
 * (LEVELS6_JSON=<path> to embed a work copy).
 * Flags (query string, read once at load):  ?tntonly=0  Cutter / Cluster / Wrecking Ball back (code kept)
 *   ?notes=1  landmark cards, NEW! cards, LANDMARK pop, "All set!" toast back      ?hand1=0  tutorial hand on unlock levels again
 *   ?reward=1 coins by difficulty 1 : 2.5 : 5 (economy proposal, default OFF)      ?balc=1  balconies + porch canopies of the V5 "dressed" buildings back
 *   ?fuse=<s> auto-blast delay after the last TNT is placed (default 1.0)
 *   ?wavecap=1 the old per-level wave limit (round 5 default: no limit, see patch/v10.js "MULTI-WAVE RULE")
 * Round 5 (11/11): multi-wave rule (5 anchors), fixed PASS 85 / protected 5% / street 10% at 3.0 m (l6Rules), school |
 * hospital type roofs on every protected building (and no rooftop sign on them), a wider opening frame (FRAME_W/H).
 */
'use strict';
const fs = require('fs'), path = require('path');
const DIR = __dirname, MARK = '// ---- levels6 v10';
const args = process.argv.slice(2), CHECK = args[0] === '--check'; if (CHECK) args.shift();
const IN = args[0], OUT = args[1] || args[0];
if (!IN) { console.error('usage: node patch.js [--check] <in.html> [out.html]'); process.exit(2); }
if (path.resolve(OUT) === path.resolve(DIR, '..', 'index.html')) { console.error('refusing to write games/blast/index.html'); process.exit(2); }
const src = fs.readFileSync(IN, 'utf8');
const block = fs.readFileSync(path.join(DIR, 'patch', 'v10.js'), 'utf8').replace(/\s+$/, '');
const LV = JSON.parse(fs.readFileSync(process.env.LEVELS6_JSON || path.join(DIR, 'levels-v6.json'), 'utf8')).levels;
const levelsJs = 'var LEVELS = [\n' + LV.map(l => '  ' + JSON.stringify(l)).join(',\n') + '];';
const FLAGS = MARK + ' flags (levels6/patch.js)\n' +
  'var L6 = (function(){ var q = function(k, d){ var v = QS.get(k); return v == null ? d : v !== "0"; };\n' +
  '  return { tntOnly:q("tntonly", true), notes:q("notes", false), hand1:q("hand1", true), reward:q("reward", false), balc:q("balc", false),\n' +
  '    fuse:Math.max(0.6, Math.min(3, +(QS.get("fuse") || 1.0))), wavecap:q("wavecap", false) }; })();\n' +
  'var L6_MAXW = 99;   // r5 multi-wave rule: no wave limit; an attempt ends on PASS, a broken hard rule, or no TNT left (?wavecap=1 = the old per-level limit)\n' +
  '// r5 (Owner 11/11): fixed thresholds on EVERY level: PASS 85%, protected damage max 5%, street rubble max 10% at 3.0 m (level data values are ignored)\n' +
  'var L6_PASS = 0.85, L6_KEEPMAX = 0.05, L6_STREET = {at:3.0, max:0.10};\n' +
  'function l6Rules(Ld){ Ld.target = L6_PASS; Ld.keepMax = L6_KEEPMAX; if(Ld.street) Ld.street = {at:L6_STREET.at, max:L6_STREET.max}; l6KeepTypes(Ld); return Ld; }\n' +
  '// r5 (Owner 11/11): two protected types only, school | hospital, picked per building from the level name + its index (deterministic)\n' +
  'function l6KeepTypes(Ld){ var h = 7, s = String(Ld.name || ""), i; for(i=0;i<s.length;i++) h = (h*31 + s.charCodeAt(i)) >>> 0;\n' +
  '  var pick = function(k){ var x = (h ^ Math.imul(k + 1, 2654435761)) >>> 0; x = (Math.imul(x, 1103515245) + 12345) >>> 0; return (x >>> 16) & 1 ? "hospital" : "school"; };\n' +
  '  var nm = function(t){ return t === "school" ? "the school" : "the hospital"; };\n' +
  '  (Ld.keeps || []).forEach(function(K, k){ K.type = K.role = K.fixType || pick(k); K.name = nm(K.type); });\n' +
  '  if(Ld.keep){ var t = Ld.keeps && Ld.keeps.length ? Ld.keeps[0].type : pick(0); Ld.keep.type = Ld.keep.role = t; Ld.keep.name = nm(t); } }\n' +
  'function l6Charges(c){ if(!L6.tntOnly) return c; var n = 0; for(var k in c) n += c[k]; return {tnt:n}; }   // TNT only: every charge of a level becomes TNT\n';
const EDITS = [
  { name: 'flags + protected-building materials (before the V5 materials, so MATS picks them up)',
    find: '// ==== LEVELS-V5 materials (additive;',
    replace: FLAGS + 'Object.assign(MEMBERS, {\n' +
      // staged materials (PLAN.md §2). One TNT (260 dmg, 3.8 m) at zero upgrades reaches: wood 3.2 m · plain concrete 2.8 m (the existing rule) ·
      // brick 2.0 m (the pier it sits on and the wall round it) · reinforced concrete: only the pier it sits on · steel: never
      '  wpost:  { hp:30,  density:700,  fric:0.7,  rest:0.05, dmg:1.1, armor:0,    shatter:8,  bond:"concrete", color:0xD99A4E },   // timber post\n' +
      '  wfloor: { hp:60,  density:600,  fric:0.7,  rest:0.05, dmg:1.1, armor:0,    shatter:8,  bond:"concrete", color:0xB9783E, ns:true },   // plank floor\n' +
      '  wwall:  { hp:15,  density:500,  fric:0.7,  rest:0.05, dmg:1.2, armor:0,    shatter:6,  bond:"concrete", color:0xEDC58C, ns:true },   // board wall\n' +
      '  bk:     { hp:105, density:1900, fric:0.75, rest:0.05, dmg:1.0, armor:0.1,  shatter:8,  bond:"concrete", color:0xC9583A },   // brick pier\n' +
      '  bkw:    { hp:60,  density:1800, fric:0.75, rest:0.05, dmg:1.0, armor:0.1,  shatter:8,  bond:"concrete", color:0xD9714A, ns:true },   // brick wall panel\n' +
      '  cpan:   { hp:60,  density:2200, fric:0.7,  rest:0.06, dmg:1.0, armor:0,    shatter:9,  bond:"concrete", color:0xE4E0D8, ns:true },   // plain concrete wall panel\n' +
      '  tdeck:  { hp:400, density:2600, fric:0.6,  rest:0.08, dmg:0.8, armor:0.7,  shatter:16, bond:"core",     color:0xB9B5AD, ns:true },   // deep transfer deck under a tower (plain concrete look)\n' +
      '  sdeck:  { hp:400, density:1100, fric:0.5,  rest:0.08, dmg:0.5, armor:0.88, shatter:99, bond:"steel",    color:0x7E8DA2, snd:"steel", ns:true },   // open-web steel bridge deck: TNT cannot break it\n' +
      '  rc:     { hp:220, density:2400, fric:0.7,  rest:0.06, dmg:1.0, armor:0.05, shatter:12, bond:"core",     color:0x7F7B76 },   // reinforced pier (fat, dark): only a charge right on it breaks it\n' +
      '  rcs:    { hp:400, density:2400, fric:0.7,  rest:0.06, dmg:1.0, armor:0.6,  shatter:14, bond:"core",     color:0x8F8B86, ns:true },   // reinforced floor plate of a core\n' +
      '  kwall:  { hp:130, density:2400, fric:0.7, rest:0.06, dmg:1.0, armor:0, shatter:10, bond:"concrete", color:0xD9E8FF, ns:true },   // protected: ice-blue wall\n' +
      '  kwin:   { hp:220, density:1200, fric:0.6, rest:0.06, dmg:1.0, armor:0, shatter:16, bond:"concrete", color:0xFFD866, ns:true },   // protected: warm-lit window ribbon\n' +
      '  kplate: { hp:130, density:2400, fric:0.7, rest:0.06, dmg:1.0, armor:0, shatter:10, bond:"concrete", color:0xFFFFFF, ns:true },   // protected: floor plate = the white floor band (r5: white, art-brief roofs-school-hospital.png)\n' +
      '  kroof:  { hp:130, density:1800, fric:0.7, rest:0.06, dmg:1.0, armor:0, shatter:10, bond:"concrete", color:0x2F56C4, ns:true },   // protected: door\n' +
      '  kcap:   { hp:130, density:1800, fric:0.7, rest:0.06, dmg:1.0, armor:0, shatter:10, bond:"concrete", color:0x2F56C4, ns:true }    // protected: the one solid navy roof CAP (Owner 10/11)\n' +
      '});\n// ==== LEVELS-V5 materials (additive;' },
  { name: 'levels: the embedded V5 list -> levels-v6.json', range: ['var LEVELS = [{"name":"Garden Shed"', '}];\n// Hard = the labelled spikes'],
    replace: levelsJs + '\n// Hard = the labelled spikes' },
  { name: 'UNLOCKS: no Cutter / Cluster unlock strip when TNT only',
    find: 'LEVELS.forEach(function(Lv, i){ Object.keys(Lv.charges || {}).forEach(function(k){ if(!seen[k]){',
    replace: 'LEVELS.forEach(function(Lv, i){ Object.keys(Lv.charges || {}).forEach(function(k){ if(L6.tntOnly && k !== "tnt") return; if(!seen[k]){' },
  { name: 'save migration: the V6 list resets best % (new buildings on every index)',
    find: '(function(){ if(save.cv === 5) return; save.level = Math.min(Math.max(0, save.level|0), LEVELS.length - 1); save.best = {}; save.cv = 5; })();',
    replace: '(function(){ if(save.cv === 6) return; save.level = Math.min(Math.max(0, save.level|0), LEVELS.length - 1); save.best = {}; save.bp = {}; save.cv = 6; })();' },
  { name: 'body cap 130 -> 320 target members before glass is dropped (measured: levels6/PLAN.md §7)',
    find: 'SETTLE_HARD = 10.0, BODY_CAP = 130;', replace: 'SETTLE_HARD = 10.0, BODY_CAP = 320;' },
  { name: 'r5 (Owner 11/11, buildings must look bigger): the opening frame uses more of the play area (was 75% width / 80% height)',
    find: 'var FRAME_W = 0.75, FRAME_H = 0.80, _fc = null', replace: 'var FRAME_W = 0.88, FRAME_H = 0.92, _fc = null' },
  { name: 'r5: protected damage max 5% by default (KEEP_MAX)', find: 'var KEEP_MAX = 0.1, collatTxt = "";', replace: 'var KEEP_MAX = 0.05, collatTxt = "";' },
  { name: 'block: mass builder, protected building, selector, reward helper (before the landmark card)',
    find: 'function lmCard(on){\n  var el = $("lmCard");',
    replace: block + '\nfunction lmCard(on){\n  if(!L6.notes) return;   // levels6: no "what is this building" card\n  var el = $("lmCard");' },
  { name: 'protected neighbours: a full building when keep.full',
    find: '    var kw = BAY+COL+1.3, kx = sd*(fp.w/2 + (P.keep.gap != null ? P.keep.gap : 1.6) + kw/2);\n    keepXs.push(kx);\n    buildFrame({f:P.keep.floors, cx:2, cz:2, glass:0}, kx, true);',
    replace: '    var K6 = P.keep.full ? Object.assign({}, P.keep, (P.keep.by || {})[sd]) : null;\n    var kw = K6 ? l6KeepW(K6) : BAY+COL+1.3, kx = sd*(fp.w/2 + (P.keep.gap != null ? P.keep.gap : 1.6) + kw/2);\n    keepXs.push(kx);\n    if(K6) l6Keep(K6, kx); else { buildFrame({f:P.keep.floors, cx:2, cz:2, glass:0}, kx, true); l6KeepRoofOld(P.keep, kx); }' },
  { name: 'NEW! unlock cards off',
    find: '  var u = L.unlock; if(!u || manual) return;', replace: '  var u = L.unlock; if(!u || manual || !L6.notes) return;' },
  { name: 'tutorial hand: level 1 only (1/2)',
    find: 'function v5HandLevel(){ return !!((L.unlock && L.unlock.hand !== false) || L.remind); }',
    replace: 'function v5HandLevel(){ return !L6.hand1 && !!((L.unlock && L.unlock.hand !== false) || L.remind); }' },
  { name: 'tutorial hand: level 1 only (2/2)',
    find: '  if(manual || screen !== "game" || (levelIdx > 1 && !v5HandLevel())', replace: '  if(manual || screen !== "game" || (levelIdx > (L6.hand1 ? 0 : 1) && !v5HandLevel())' },
  { name: 'TNT only: live start', find: '    L = Object.assign({target:0.6, charges:{tnt:9}, par:9, waves:3}, defOverride || levelDef(levelIdx));',
    replace: '    L = Object.assign({target:0.6, charges:{tnt:9}, par:9, waves:3}, defOverride || levelDef(levelIdx)); L.charges = l6Charges(L.charges); l6Rules(L);' },
  { name: 'TNT only: prebuilt start', find: '  var Ld = Object.assign({target:0.6, charges:{tnt:9}, par:9, waves:3}, levelDef(i));',
    replace: '  var Ld = Object.assign({target:0.6, charges:{tnt:9}, par:9, waves:3}, levelDef(i)); Ld.charges = l6Charges(Ld.charges); l6Rules(Ld);' },
  { name: 'TNT only: plans written for another charge place TNT',
    find: '    out.push(m ? placeOn(e[0], m.b, m.n) : "nomember");', replace: '    out.push(m ? placeOn(L6.tntOnly ? "tnt" : e[0], m.b, m.n) : "nomember");' },
  { name: 'TNT only: no Wrecking Ball in the booster bar / unlocks',
    find: 'var BOOST_ORDER = ["wreck", "net", "tnt1"];', replace: 'var BOOST_ORDER = L6.tntOnly ? ["net", "tnt1"] : ["wreck", "net", "tnt1"];' },
  { name: 'no LANDMARK pop',
    find: '  else if(L.boss){ popText("LANDMARK BOSS"); } else if(L.lm) popText("LANDMARK");',
    replace: '  else if(!L6.notes){} else if(L.boss){ popText("LANDMARK BOSS"); } else if(L.lm) popText("LANDMARK");' },
  { name: 'selector g:i:j', find: '  var v5s = v5Select(sel, floor); if(v5s) return v5s;',
    replace: '  var v5s = v5Select(sel, floor) || l6Select(sel, floor); if(v5s) return v5s;' },
  { name: 'reward flag: debris coins', find: '  coinCarry += w*coinBase*coinMul()*comboMul()*(L.boss?1.5:1);', replace: '  coinCarry += w*coinBase*coinMul()*comboMul()*l6Rew(1.5);' },
  { name: 'reward flag: win bonus', find: '  var bonus = Math.round((overBonus + spareBonus)*coinMul()*(L.boss?2:1));', replace: '  var bonus = Math.round((overBonus + spareBonus)*coinMul()*l6Rew(2));' },
  { name: 'TNT only: core fail text', find: 'why:"TNT can\'t break the core. A Cutter right on it can."};',
    replace: 'why:L6.tntOnly ? "TNT can\'t break the core. Bring it down around it." : "TNT can\'t break the core. A Cutter right on it can."};' },
  { name: 'auto-blast about 1 s after the last TNT is placed (1/2: the fuse)',
    find: 'var AUTO_FUSE = 1.35,', replace: 'var AUTO_FUSE = L6.fuse,' },
  { name: 'auto-blast (2/2: the three beeps fit inside the fuse)',
    find: '}, 350 + i*330);', replace: '}, AUTO_FUSE*(0.2 + i*0.25)*1000);' },
  { name: 'no "All set!" toast (minimal text): the fuse bar and the 3-2-1 say it',
    find: 'toast("All set! Tap a charge to stop the fuse"); startCountdown(true); }', replace: 'if(L6.notes) toast("All set! Tap a charge to stop the fuse"); startCountdown(true); }' },
  { name: 'bond groups: a hidden reinforced core is bonded only to itself (b.bg), so it stands when the shell falls',
    find: '    if(a.keep !== b.keep) continue;', replace: '    if(a.keep !== b.keep) continue;\n    if((a.bg || 0) !== (b.bg || 0) && !a.anchor && !b.anchor) continue;' },
  { name: 'no balconies on the V5 dressed buildings (Owner 10/11: removed, see PLAN.md §9)',
    find: '  (D.balc || []).forEach(function(f){', replace: '  (L6.balc ? D.balc || [] : []).forEach(function(f){' },
  { name: 'no porch canopy on the V5 dressed buildings',
    find: '  if(D.awning){', replace: '  if(D.awning && L6.balc){' },
  // ---- round 5 (Owner 11/11): the multi-wave rule, game-wide. BLAST fires only the charges placed so far; after the
  // collapse settles the player keeps planning with the TNT left, as many times as he likes. The result comes when a
  // blast settles with PASS reached, with a hard rule broken (protected / street), or with no TNT left. No wave text.
  { name: 'multi-wave rule (1/5): no wave limit (L.waves ignored)',
    find: '  maxWaves = L.waves || 3; wave = 1;', replace: '  maxWaves = L6.wavecap ? (L.waves || 3) : L6_MAXW; wave = 1;' },
  { name: 'multi-wave rule (2/5): no "Wave n/m" toast between blasts (v31/TEXT-CUT.md #2, #3)',
    find: '  toast(dudWave ? "Didn\'t budge \u2014 try another spot" : "Wave " + wave + "/" + maxWaves + " \u00b7 " + stockLeft() + " left");',
    replace: '  if(dudWave) toast("Didn\'t budge. Try another spot.");' },
  { name: 'multi-wave rule (3/5): the tip between blasts names no wave (v31/TEXT-CUT.md #4-6)',
    find: '  var w = "Wave " + wave + ": ";\n  if(v.code === "core") return w + "Cutter the blue core.";\n  if(v.code === "height") return w + "still " + standingHeight().toFixed(0) + " m up. Hit the base.";\n  return w + v5Pct(score()) + "% down, need " + Math.round(L.target*100) + "%.\\nHit what still stands.";',
    replace: '  if(v.code === "core") return L6.tntOnly ? "TNT right on the core." : "Cutter the blue core.";\n  if(v.code === "height") return "Still standing. Hit the base.";\n  return "Hit what still stands.";' },
  { name: 'multi-wave rule (4/5): no "Waves a / b" row on the result card (v31/TEXT-CUT.md #8)',
    find: "              '<div><span>Waves</span><b>' + r.waves + ' / ' + maxWaves + '</b></div>';", replace: "              '';" },
  { name: 'multi-wave rule (5/5): lose tip no longer says "first wave" (blasting in steps is allowed)',
    find: 'return "Use more charges in the first wave.";', replace: 'return "Use more TNT.";' },
  // ---- round 6 (11/11): determinism (patch/v10.js "DETERMINISM"): the wave end and the hard-rule check after it are
  // decided per fixed step in the l6 fixedStep hook, no longer per rendered frame / per test.run iteration.
  { name: 'determinism (1/3): the frame loop no longer decides the wave end (real-time stableT)',
    find: '        stableT = settled() ? stableT + rdt*(manual ? 0 : 1) : 0;\n        if(waveDone()){ jSettle(); waveEnd(); }',
    replace: '        /* levels6: wave end = l6 fixedStep hook (per fixed step) */' },
  { name: 'determinism (2/3): test.run steps the same hook as the game',
    find: '        fixedStep(); t += dt;\n        if(phase === "settle"){\n          stableT = settled() ? stableT + dt : 0;\n          if(waveDone()) waveEnd();\n        }',
    replace: '        l6Run = true; try{ fixedStep(); } finally { l6Run = false; } t += dt;   // levels6: wave end = l6 fixedStep hook' },
  { name: 'determinism (3/3): a hard rule broken after the wave ended is judged when the rubble is at rest (l6RestStep), not per frame',
    find: '    if(phase === "plan" && structureLive && ((L.keep && cl > km) || (L.street && sh > L.street.max))) finish();',
    replace: '    /* levels6: judged at rest in l6RestStep / detonateAll */' },
  { name: 'determinism: test API __blast.test.l6() = the determinism log (tools/determinism-check.js)',
    find: '  test: {\n    load: function(i, seed, def){', replace: '  test: {\n    l6: function(){ return l6Report(); },\n    load: function(i, seed, def){' },
  { name: 'lose card: a designed near-miss level names its move at the first fail (L.ftip, <= 6 words)',
    find: 'function failTip(r){\n', replace: 'function failTip(r){\n  if(L.ftip && (r.code === "pct" || r.code === "height" || r.code === "core")) return L.ftip;\n' },
];
let bad = 0; const spans = [];
if (src.includes(MARK)) { console.error('already patched'); process.exit(1); }
const once = (s, what, name) => { const i = src.indexOf(s), j = i < 0 ? -1 : src.indexOf(s, i + 1);
  if (i < 0 || j >= 0) { console.error(`FAIL ${name}: ${what} ${i < 0 ? 'missing' : 'found twice'}`); bad++; return -1; } return i; };
for (const e of EDITS) {
  if (e.range) {
    const i = once(e.range[0], 'start anchor', e.name), j = once(e.range[1], 'end anchor', e.name);
    if (i < 0 || j < 0) continue;
    if (j <= i) { console.error(`FAIL ${e.name}: end anchor before start`); bad++; continue; }
    spans.push([i, j + e.range[1].length, e]);
  } else { const i = once(e.find, 'anchor', e.name); if (i < 0) continue; spans.push([i, i + e.find.length, e]); }
  console.log(`ok   ${e.name}`);
}
spans.sort((a, b) => a[0] - b[0]);
for (let k = 1; k < spans.length; k++) if (spans[k][0] < spans[k - 1][1]) { console.error('FAIL overlap'); bad++; }
if (bad) { console.error(bad + ' problem(s), nothing written'); process.exit(1); }
if (CHECK) { console.log('check ok'); process.exit(0); }
let out = src; for (const [i, j, e] of spans.reverse()) out = out.slice(0, i) + e.replace + out.slice(j);
fs.writeFileSync(OUT, out); console.log(`wrote ${OUT} (${LV.length} levels, ${((out.length - src.length) / 1024).toFixed(1)} KB vs base)`);
