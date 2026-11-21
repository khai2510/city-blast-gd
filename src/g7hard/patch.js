#!/usr/bin/env node
/* g7-hard (Agents-Game, 20/11/2026): the hard levels H1-H5 (Mac, city-blast/release/) in the MAIN build, placed by main.
 *   node src/g7hard/patch.js <in.html> <out.html>        (step "g7-hard" of src/tools/build-main.js, always the LAST step)
 * 1. Same injection as city-blast/pipeline7/build.mjs with test=false (release/INTEGRATE.md §3):
 *    - city-blast/pipeline7/engine.js right before the anchor "} // main\n})();" (it wraps the final build's functions);
 *    - the levels7-data block (LV7DEFS = release/g7-hard-levels.json, pushed onto LEVELS, window.__lv7base) right before
 *      "try{\n// ---- UILAYOUT v2". ?lv7=0 = no hard levels, no g7 engine: the old 36-level game.
 *    Every anchor must occur exactly once, else the step stops (exit 1). Mac's files are read, never changed.
 * 2. Placement (Lead's decision 20/11, moved 21/11 to slots 10/16/20/30/36, SYNC.md): PLACE below. The data block appends H1-H5 after L36 as build.mjs does; at the end
 *    of main() (after every patch and the g7 engine) g7hard/order-end.js reorders LEVELS in place to PLACE. Level-NUMBER keyed
 *    features keep following their ORIGINAL level through one table, LV7O (g7hard/order-early.js), and the site rewrites in SITES.
 *    ?lv7ord=0 = no reorder (Mac's layout: old L1-36 keep 1-36, H1-H5 = 37-41; for Mac's tools and the old-number checks).
 *    ?pack7=1 = start at the first hard level.
 * Never writes games/blast/index.html. */
'use strict';
const fs = require('fs'), path = require('path');
const [IN, OUT] = process.argv.slice(2);
if (!IN || !OUT) { console.error('usage: patch.js <in.html> <out.html>'); process.exit(2); }
const ROOT = path.join(__dirname, '..', '..');
const ENGINE = path.join(ROOT, 'city-blast', 'pipeline7', 'engine.js');
const LEVELS7 = path.join(ROOT, 'city-blast', 'release', 'g7-hard-levels.json');
// hard-level code -> bp in g7-hard-levels.json (release/INTEGRATE.md §1)
const HBP = { H1: 'L01v4', H2: 'L02', H3: 'L03', H4: 'L04', H5: 'L05' };
// new level number = position in this list (1-based); "oN" = old level N; old levels not listed follow in their old order.
// 21/11 (tester round GD-48, Lead): the hard levels go to the curve plan's slots 10 / 16 / 20 / 30 / 36 (same relative order H2, H3,
// H1, H4, H5); old L1-36 fill the other slots in their old order (old L1-9 keep 1-9, old L32-36 = 37-41).
const HAT = { 10: 'H2', 16: 'H3', 20: 'H1', 30: 'H4', 36: 'H5' };
const PLACE = []; for (let n = 1, o = 1; n <= 36; n++) PLACE.push(HAT[n] || 'o' + o++);
// orders earlier builds wrote into saves (the ".lv7o" mark -> that build's PLACE): a save keeps its levels when the order changes.
// "1" = the 20/11 build (H at 4 / 6 / 8 / 10 / 12). Newer builds write their own slot list as the mark ("s:" + slots).
const LEGACY = { '1': ['o1', 'o2', 'o3', 'H2', 'o4', 'H3', 'o5', 'H1', 'o6', 'H4', 'o7', 'H5'] };

// fail lines (L.ftip: the lose card's line when a hard level ends short, levels6 failTip; 21/11 tester round GD-55): each names the real
// cause, the rule of that level the player has not been told (stone that ignores TNT, piers that need more blasts, drop first), as a
// principle, never a spot (<= 9 words, LEARNINGS 1). Copy only: the level data from Mac is not changed on disk, only these strings.
const FTIP = {
  H1: 'Drop it first. It only breaks once it falls.',
  H2: 'Stone ignores TNT. Dark piers need more blasts.',
  H3: 'Bring the tower down, away from the blue.',
  H4: 'Dark piers need more blasts. Stone ignores TNT.',
  H5: 'The core needs more blasts, not more TNT.',
};

let h = fs.readFileSync(IN, 'utf8');
const engine = fs.readFileSync(ENGINE, 'utf8'), defs = JSON.parse(fs.readFileSync(LEVELS7, 'utf8'));
const early = fs.readFileSync(path.join(__dirname, 'order-early.js'), 'utf8'), end = fs.readFileSync(path.join(__dirname, 'order-end.js'), 'utf8');
const fail = (m) => { console.error('g7-hard: ' + m); process.exit(1); };
for (const [c, t] of Object.entries(FTIP)) { const l = defs.find(x => x.bp === HBP[c]); if (!l) fail('FTIP: no level ' + c); if (t.split(/\s+/).length > 9 || /\b(road|street|lot|stack|stacked|stacking)\b/i.test(t)) fail('FTIP ' + c + ': > 9 words or a dropped word'); l.ftip = t; }
const count = (s) => h.split(s).length - 1;
// slots: >= 0 = old level index, -(k + 1) = hard level k of LV7DEFS
const toSlots = (list, what) => {
  const sl = list.map(p => {
    if (/^o\d+$/.test(p)) return +p.slice(1) - 1;
    const k = defs.findIndex(l => l.bp === HBP[p]); if (k < 0) fail('no level with bp ' + HBP[p] + ' (' + p + ') in ' + LEVELS7); return -(k + 1);
  });
  if (new Set(sl).size !== sl.length) fail(what + ' lists a level twice');
  if (defs.some((l, k) => !sl.includes(-(k + 1)))) fail(what + ' does not place every hard level');
  return sl;
};
const slots = toSlots(PLACE, 'PLACE');
const legacy = Object.fromEntries(Object.entries(LEGACY).map(([m, l]) => [m, toSlots(l, 'LEGACY ' + m)]));

// ---- 1. anchors (checked on the input, before anything is inserted)
const MARK = '} // main\n})();', UI = 'try{\n// ---- UILAYOUT v2', EARLY = '\nfunction levelDef(i){\n';
// ---- 2. site rewrites: [what, find, replace, count]. LV7O.id(p) = the level's index in the appended layout (old L1-36 = 0-35, H = 36+k):
// what Mac tested and what old levels had. LV7O.pos(o) = new position of old index o. LV7O.num(n) = new number of old level n.
const SITES = [
  ['zHint (pinch hint) on old L4', 'if(li === 3 && !save.zh && !manual) setTimeout(function(){ if(screen === "game" && levelIdx === 3 && ',
    'if(li === LV7O.pos(3) && !save.zh && !manual) setTimeout(function(){ if(screen === "game" && levelIdx === LV7O.pos(3) && ', 1],
  ['materials-fx seed by the level, not the slot', 'MFX.seed = seed != null ? seed : 1000 + li*7919;', 'MFX.seed = seed != null ? seed : 1000 + LV7O.id(li)*7919;', 1],
  ['level rng seed', 'rnd = mulberry(seed != null ? seed : 1000 + levelIdx*7919);', 'rnd = mulberry(seed != null ? seed : 1000 + LV7O.id(levelIdx)*7919);', 1],
  ['prebuild rng seed', 'rnd:mulberry(1000 + i*7919)', 'rnd:mulberry(1000 + LV7O.id(i)*7919)', 1],
  ['Home preview rng seed (goHome + boot)', 'mulberry(1000 + save.level*7919)', 'mulberry(1000 + LV7O.id(save.level)*7919)', 2],
  ['lot debris art per level', 'LA_DEBRIS[levelIdx + 1]', 'LA_DEBRIS[LV7O.id(levelIdx) + 1]', 1],
  ['frame.js opening-camera overrides (old L3, L25)', 'OVR[levelIdx + 1]', 'OVR[LV7O.orig1(levelIdx)]', 1],
  ['intro schedule (INTRO_SCHED lv / upto) in new numbers', '\n];\n// charge kinds: TNT only on L1-36',
    '\n];\nINTRO_SCHED.forEach(function(e){ e.lv = LV7O.num(e.lv); if(e.upto) e.upto = LV7O.num(e.upto); });   // g7hard: old level numbers -> new\n// charge kinds: TNT only on L1-36', 1],
  ['intro cards / swipe: none on a hard level', 'function inQueue(i){\n  var n = i + 1, q = [];', 'function inQueue(i){\n  if(LV7O.isH(i)) return [];   // g7hard: hard levels stay hint-free\n  var n = i + 1, q = [];', 1],
  ['intro "Blast again!" moment: none on a hard level', '  var n = levelIdx + 1, e = inSchedOf("wave")', '  if(LV7O.isH(levelIdx)) return null;\n  var n = levelIdx + 1, e = inSchedOf("wave")', 1],
  ['intro look moment (trap barrels): none on a hard level', '  var n = levelIdx + 1, e = inSchedOf("look")', '  if(LV7O.isH(levelIdx)) return;\n  var n = levelIdx + 1, e = inSchedOf("look")', 1],
  ['booster unlock levels (boss wins L10 / L20 / L30) in new numbers', 'if(L6.tntOnly){ BOOST.tnt1.hidden = true; BOOST.tnt1.unlock = 999; }',
    'if(L6.tntOnly){ BOOST.tnt1.hidden = true; BOOST.tnt1.unlock = 999; }\nLV7O.boost(BOOST);   // g7hard', 1],
  ['Sky Strike unlock (boss win L30, defined later by boosters2 sky.js) in new numbers', 'BOOST.sky = { name:"Sky Strike", short:"Strike", unlock:30, free:2, price:300, pack:3, pre:false, icon:"sky", line:"Drop it from the sky." };',
    'BOOST.sky = { name:"Sky Strike", short:"Strike", unlock:30, free:2, price:300, pack:3, pre:false, icon:"sky", line:"Drop it from the sky." }; LV7O.boost(BOOST);   // g7hard', 1],
  ['interstitial ads from old L10', 'if((save.level | 0) < 9) return null;', 'if((save.level | 0) < LV7O.pos(9)) return null;', 1],
  ['No Ads Home button from old L15', '(save.level | 0) >= 14; }', '(save.level | 0) >= LV7O.pos(14); }', 1],
  ['rewarded rescue / win x2 from old L5', 'levelIdx >= 4 &&', 'levelIdx >= LV7O.pos(4) &&', 2],
  ['tap2 K3 double-tap refresher hand: never on a hard level', 'screen === "game" && levelIdx >= 2 && wave <= 1 && !selC;', 'screen === "game" && levelIdx >= 2 && !LV7O.isH(levelIdx) && wave <= 1 && !selC;', 1],
];
for (const [a, n] of [[MARK, 1], [UI, 1], [EARLY, 1]]) if (count(a) !== n) fail('anchor ' + JSON.stringify(a) + ' found ' + count(a) + 'x (want ' + n + ')');
for (const [what, f, , n] of SITES) if (count(f) !== n) fail('site "' + what + '": ' + JSON.stringify(f.slice(0, 60)) + ' found ' + count(f) + 'x (want ' + n + ')');
if (count('// ---- main/levels7.js') || count('// ---- main/levels7-data.js')) fail('the input already carries the g7 engine / data');
for (const [, f, r] of SITES) h = h.split(f).join(r);

// ---- 3. insert: LV7O (early, before levelDef), the level data (UILAYOUT anchor), the engine + the reorder (end of main)
h = h.replace(EARLY, () => '\n' + early.replace('__NH__', String(defs.length)).replace('__SLOTS__', JSON.stringify(slots)).replace('__LEGACY__', JSON.stringify(legacy)) + EARLY);
const data = '// ---- main/levels7-data.js (g7hard/patch.js = pipeline7/build.mjs, test=false; data: city-blast/release/g7-hard-levels.json, do not edit by hand)\n' +
  'if(!/[?&]lv7=0(&|$)/.test(location.search)) try{ (function(){ var LV7DEFS = ' + JSON.stringify(defs) + ';\n' +
  '  LV7DEFS.forEach(function(l){ LEVELS.push(l); }); window.__lv7base = LEVELS.length - LV7DEFS.length;\n' +
  '  if(window.__lv7base !== LV7O.base) console.error("main/levels7-data.js: base " + window.__lv7base + " != LV7O " + LV7O.base);\n' +
  '  var first = Math.min.apply(null, LV7DEFS.map(function(l, k){ return LV7O.pos(window.__lv7base + k); }));   // ?pack7=1: start at the first hard level\n' +
  '  if(/[?&]pack7=1(&|$)/.test(location.search) && save.level < first){ save.level = first;\n' +
  '    try{ save.bseen = save.bseen || {}; Object.keys(BOOST).forEach(function(k){ if(!BOOST[k].hidden) save.bseen[k] = 2; }); }catch(e){}\n' +
  '    writeSave(); }\n})(); }catch(e){ console.error("main/levels7-data.js", e); }\n';
h = h.replace(UI, () => data + UI);
h = h.replace(MARK, () => engine + '\n' + end + '\n' + MARK);
if (count('__LEGACY__') || count('__SLOTS__') || count('__NH__')) fail('order-early.js placeholder left in the output');
for (const m of ['// ---- main/levels7.js', '// ---- main/levels7-data.js', '// ---- g7hard/order-early.js', '// ---- g7hard/order-end.js']) if (count(m) !== 1) fail('output carries ' + m + ' ' + count(m) + 'x');
fs.writeFileSync(OUT, h);
const HC = Object.fromEntries(Object.entries(HBP).map(([c, b]) => [b, c])), nm = (s) => s >= 0 ? 'L' + (s + 1) : HC[defs[-s - 1].bp];
console.log('ok   g7 engine + ' + defs.length + ' hard levels, ' + SITES.length + ' number-keyed sites; order ' + slots.map(nm).join(' ') + ' then L' + (PLACE.length - defs.length + 1) + '+');
