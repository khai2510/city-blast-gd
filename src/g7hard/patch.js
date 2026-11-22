#!/usr/bin/env node
/* g7-hard (Agents-Game, 20/11/2026): the hard levels H1-H5 (Mac, city-blast/release/) in the MAIN build, placed by main.
 *   node src/g7hard/patch.js <in.html> <out.html>        (step "g7-hard" of src/tools/build-main.js, always the LAST step)
 * 1. Same injection as city-blast/pipeline7/build.mjs with test=false (release/INTEGRATE.md §3):
 *    - city-blast/pipeline7/engine.js right before the anchor "} // main\n})();" (it wraps the final build's functions);
 *    - the levels7-data block (LV7DEFS = release/g7-hard-levels.json, pushed onto LEVELS, window.__lv7base) right before
 *      "try{\n// ---- UILAYOUT v2". ?lv7=0 = no hard levels, no g7 engine: the old 36-level game.
 *    Every anchor must occur exactly once, else the step stops (exit 1). Mac's files are read, never changed.
 * 2. Placement (Lead: 20/11, 21/11 slots 10/16/20/30/36, 22/11 ORDER22 = every element after its intro level, SYNC.md): PLACE below. The data block appends H1-H5 after L36 as build.mjs does; at the end
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
// the easy pack (Agents-Game 22/11, Khai 22/11 "tạm thời duyệt, đưa lên main, có nút chọn level"): city-blast/levels-gd/E0n exported by
// g7hard/export-easy.js (budget = the tester's tntStart). Appended after H1-H5 in LV7DEFS (appended index 36 + 5 + k); not "hard":
// no Hard tag, normal picker label; like H they are hint-free g7 levels (LV7O.isG). Code in PLACE = its bp (E01 ...).
const EASY7 = path.join(ROOT, 'city-blast', 'release', 'g7-easy-levels.json');
// the old-polish rebuilds (Agents-Game 22/11, Khai: "the old levels 1 to ten-something to the easy-pack quality"): city-blast/levels-gd/O<slot>
// exported by g7hard/export-old.js. Each REPLACES an old level in place (L.replaces = "oN": the same appended index, so the same slot,
// save, seed, intro cards, tutorial hand); not a g7 level for LV7O (isG false: the old level's cards / hands stay). ?oldlv=1 = the old level.
const OLD7 = path.join(ROOT, 'city-blast', 'release', 'g7-old-levels.json');
// hard-level code -> bp in g7-hard-levels.json (release/INTEGRATE.md §1)
const HBP = { H1: 'L01v4', H2: 'L02', H3: 'L03', H4: 'L04', H5: 'L05' };
// new level number = position in this list (1-based); "oN" = old level N, "Hk" = hard level k; every one of the 41 levels is listed once
// (an old level left out would follow in its old order at the end). 22/11 (Khai: "no material / obstacle before it is introduced",
// Lead): ORDER22 below, audit and rules in city-blast/SYNC.md (Agents-Game 22/11). The 21/11 order (H at 10 / 16 / 20 / 30 / 36) is
// in saves as its "s:" mark and migrates like any other order.
// ORDER22 (22/11): 1-3 wood / brick / concrete · 4 blue (old L36) · 5 turn (L6) · 6 steel (L8) · 8 first Hard (L7) · 11 boss (L10) ·
// 14 blast in steps (L11) · 17 dark pier (L17) · 20 H3 · 21 glass (L25) · 23 boss (L20) · 25 barrels (L32) · 30 H2 · 32 H5 · 33 trap
// barrels (L34) · 34 boss (L30) · 38 H4 · 40 H1. Checked by city-blast SYNC 22/11 "no element before its intro level".
// 22/11 easy pack (Lead): E01 E02 E03 E04 E06 appended as 42-46, slots 1-41 unchanged (every element they use is introduced before 42).
const PLACE = [
  'o1', 'o2', 'o3', 'o36', 'o6', 'o8', 'o9', 'o7', 'o13', 'o14',
  'o10', 'o21', 'o15', 'o11', 'o19', 'o16', 'o17', 'o12', 'o18', 'H3',
  'o25', 'o4', 'o20', 'o31', 'o32', 'o24', 'o5', 'o28', 'o33', 'H2',
  'o26', 'H5', 'o34', 'o30', 'o27', 'o35', 'o22', 'H4', 'o23', 'H1',
  'o29', 'E01', 'E02', 'E03', 'E04', 'E06',
];
// intro cards / spotlights that do not sit on their original level: card id (main/intro.js INTRO_SCHED) -> the level (code as in
// PLACE) where that element is introduced in this order. The card fires when that level is played (LV7O.introAt), wherever it stands.
const INTRO_AT = {
  brick:'o2', concrete:'o3',   // the first level where brick / concrete stand (was one level later, D-blast-SCHED's TAP2 shift)
  keep:'o36',                  // blue buildings: old L36 is the first level with blue and nothing else new (old L4 / L5 also show glass)
  steps:'o11',                 // listed so its window (lv .. upto = 4 levels) follows L11 (old L15 now stands before it)
  wreck:'o21', net:'o31', sky:'o27',   // booster cards on the rest level right after each boss (boss + 1, as before; GD-69: not with the steps lesson)
  trap:'o34',                  // trap-barrel look on the N level before Dome Works (L35, Hard): nothing new on a Hard (D-blast-SCHED: L34)
};
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
const engine = fs.readFileSync(ENGINE, 'utf8'), hdefs = JSON.parse(fs.readFileSync(LEVELS7, 'utf8')), edefs = JSON.parse(fs.readFileSync(EASY7, 'utf8'));
const odefs = fs.existsSync(OLD7) ? JSON.parse(fs.readFileSync(OLD7, 'utf8')) : [];
const defs = hdefs.concat(edefs);   // LV7DEFS: H1-H5 (Mac's file order) then the easy pack
const early = fs.readFileSync(path.join(__dirname, 'order-early.js'), 'utf8'), end = fs.readFileSync(path.join(__dirname, 'order-end.js'), 'utf8');
const fail = (m) => { console.error('g7-hard: ' + m); process.exit(1); };
for (const l of edefs) { if (!/^E\d\d$/.test(l.bp) || l.tip !== '' || !l.ftip || l.ftip.split(/\s+/).length > 9 || /\b(road|street|lot|stack|stacked|stacking)\b/i.test(l.ftip)) fail('easy ' + l.bp + ': bad code, a tip, or ftip > 9 words / a dropped word'); if (hdefs.some(h => h.bp === l.bp)) fail('easy ' + l.bp + ' clashes with a hard level'); }
const oldBy = {};
for (const l of odefs) { const m = /^o(\d+)$/.exec(l.replaces || ''); if (!m || +m[1] < 1 || +m[1] > 36 || oldBy[+m[1] - 1]) fail('old-polish ' + l.bp + ': bad or repeated replaces ' + l.replaces);
  if (l.tip !== '' || !l.ftip || l.ftip.split(/\s+/).length > 9 || /\b(road|street|lot|stack|stacked|stacking)\b/i.test(l.ftip)) fail('old-polish ' + l.bp + ': a tip, or ftip > 9 words / a dropped word');
  if (!Array.isArray(l.sol) || !l.sol.length) fail('old-polish ' + l.bp + ': no sol'); oldBy[+m[1] - 1] = l; }
for (const [c, t] of Object.entries(FTIP)) { const l = hdefs.find(x => x.bp === HBP[c]); if (!l) fail('FTIP: no level ' + c); if (t.split(/\s+/).length > 9 || /\b(road|street|lot|stack|stacked|stacking)\b/i.test(t)) fail('FTIP ' + c + ': > 9 words or a dropped word'); l.ftip = t; }
const count = (s) => h.split(s).length - 1;
// slots: >= 0 = old level index, -(k + 1) = hard level k of LV7DEFS
const toSlots = (list, what, part) => {
  const sl = list.map(p => {
    if (/^o\d+$/.test(p)) return +p.slice(1) - 1;
    const bp = /^E\d\d$/.test(p) ? p : HBP[p], k = defs.findIndex(l => l.bp === bp); if (k < 0) fail('no level with bp ' + bp + ' (' + p + ') in ' + LEVELS7 + ' / ' + EASY7); return -(k + 1);
  });
  if (new Set(sl).size !== sl.length) fail(what + ' lists a level twice');
  if (!part && defs.some((l, k) => !sl.includes(-(k + 1)))) fail(what + ' does not place every g7 level (hard + easy)');
  return sl;
};
const slots = toSlots(PLACE, 'PLACE');
if (PLACE.length !== 36 + defs.length) fail('PLACE lists ' + PLACE.length + ' levels, want ' + (36 + defs.length));
const introAt = Object.fromEntries(Object.entries(INTRO_AT).map(([id, c]) => { const sl = toSlots([c], 'INTRO_AT ' + id, true)[0]; return [id, sl >= 0 ? sl : 36 + (-sl - 1)]; }));
const legacy = Object.fromEntries(Object.entries(LEGACY).map(([m, l]) => [m, toSlots(l, 'LEGACY ' + m, true)]));   // part: the 20/11 order had no easy levels

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
    '\n];\nINTRO_SCHED.forEach(function(e){ var a = LV7O.introAt(e.id); if(e.upto) e.upto = a ? a + (e.upto - e.lv) : LV7O.num(e.upto); e.lv = a || LV7O.num(e.lv); });   // g7hard: old level numbers -> new; a card moved by INTRO_AT goes to its intro level\n// charge kinds: TNT only on L1-36', 1],
  ['intro cards / swipe: none on a hard level', 'function inQueue(i){\n  var n = i + 1, q = [];', 'function inQueue(i){\n  if(LV7O.isG(i)) return [];   // g7hard: g7 levels (hard + easy) stay hint-free\n  var n = i + 1, q = [];', 1],
  ['intro "Blast again!" moment: none on a hard level', '  var n = levelIdx + 1, e = inSchedOf("wave")', '  if(LV7O.isG(levelIdx)) return null;\n  var n = levelIdx + 1, e = inSchedOf("wave")', 1],
  ['intro look moment (trap barrels): none on a hard level', '  var n = levelIdx + 1, e = inSchedOf("look")', '  if(LV7O.isG(levelIdx)) return;\n  var n = levelIdx + 1, e = inSchedOf("look")', 1],
  ['booster unlock levels (boss wins L10 / L20 / L30) in new numbers', 'if(L6.tntOnly){ BOOST.tnt1.hidden = true; BOOST.tnt1.unlock = 999; }',
    'if(L6.tntOnly){ BOOST.tnt1.hidden = true; BOOST.tnt1.unlock = 999; }\nLV7O.boost(BOOST);   // g7hard', 1],
  ['Sky Strike unlock (boss win L30, defined later by boosters2 sky.js) in new numbers', 'BOOST.sky = { name:"Sky Strike", short:"Strike", unlock:30, free:2, price:300, pack:3, pre:false, icon:"sky", line:"Drop it from the sky." };',
    'BOOST.sky = { name:"Sky Strike", short:"Strike", unlock:30, free:2, price:300, pack:3, pre:false, icon:"sky", line:"Drop it from the sky." }; LV7O.boost(BOOST);   // g7hard', 1],
  // thresholds ("from level N on") count progress, not one level: LV7O.nth(k) = the slot of the (k+1)-th non-hard level of the order
  // (= LV7O.pos(k) while the old levels kept their old relative order, 20/11 and 21/11)
  ['interstitial ads from the 10th old level', 'if((save.level | 0) < 9) return null;', 'if((save.level | 0) < LV7O.nth(9)) return null;', 1],
  ['No Ads Home button from the 15th old level', '(save.level | 0) >= 14; }', '(save.level | 0) >= LV7O.nth(14); }', 1],
  ['rewarded rescue / win x2 from the 5th old level', 'levelIdx >= 4 &&', 'levelIdx >= LV7O.nth(4) &&', 2],
  ['tap2 K3 double-tap refresher hand: never on a hard level', 'screen === "game" && levelIdx >= 2 && wave <= 1 && !selC;', 'screen === "game" && levelIdx >= 2 && !LV7O.isG(levelIdx) && wave <= 1 && !selC;', 1],
];
for (const [a, n] of [[MARK, 1], [UI, 1], [EARLY, 1]]) if (count(a) !== n) fail('anchor ' + JSON.stringify(a) + ' found ' + count(a) + 'x (want ' + n + ')');
for (const [what, f, , n] of SITES) if (count(f) !== n) fail('site "' + what + '": ' + JSON.stringify(f.slice(0, 60)) + ' found ' + count(f) + 'x (want ' + n + ')');
if (count('// ---- main/levels7.js') || count('// ---- main/levels7-data.js')) fail('the input already carries the g7 engine / data');
for (const [, f, r] of SITES) h = h.split(f).join(r);

// ---- 3. insert: LV7O (early, before levelDef), the level data (UILAYOUT anchor), the engine + the reorder (end of main)
h = h.replace(EARLY, () => '\n' + early.replace('__NH__', String(hdefs.length)).replace('__NE__', String(edefs.length)).replace('__SLOTS__', JSON.stringify(slots)).replace('__LEGACY__', JSON.stringify(legacy)).replace('__INTRO__', JSON.stringify(introAt)).replace('__OLD__', JSON.stringify(oldBy)) + EARLY);
const data = '// ---- main/levels7-data.js (g7hard/patch.js = pipeline7/build.mjs, test=false; data: city-blast/release/g7-hard-levels.json + g7-easy-levels.json ' + require('crypto').createHash('sha256').update(fs.readFileSync(EASY7)).digest('hex').slice(0, 10) + ', do not edit by hand)\n' +
  'if(!/[?&]lv7=0(&|$)/.test(location.search)) try{ (function(){ var LV7DEFS = ' + JSON.stringify(defs) + ';\n' +
  '  LV7DEFS.forEach(function(l){ LEVELS.push(l); }); window.__lv7base = LEVELS.length - LV7DEFS.length;\n' +
  '  if(window.__lv7base !== LV7O.base) console.error("main/levels7-data.js: base " + window.__lv7base + " != LV7O " + LV7O.base);\n' +
  '  var first = Math.min.apply(null, LV7DEFS.slice(0, LV7O.nhd).map(function(l, k){ return LV7O.pos(window.__lv7base + k); }));   // ?pack7=1: start at the first hard level\n' +
  '  if(/[?&]pack7=1(&|$)/.test(location.search) && save.level < first){ save.level = first;\n' +
  '    try{ save.bseen = save.bseen || {}; Object.keys(BOOST).forEach(function(k){ if(!BOOST[k].hidden) save.bseen[k] = 2; }); }catch(e){}\n' +
  '    writeSave(); }\n})(); }catch(e){ console.error("main/levels7-data.js", e); }\n';
h = h.replace(UI, () => data + UI);
h = h.replace(MARK, () => engine + '\n' + end + '\n' + MARK);
if (count('__LEGACY__') || count('__SLOTS__') || count('__NH__') || count('__NE__') || count('__INTRO__') || count('__OLD__')) fail('order-early.js placeholder left in the output');
for (const m of ['// ---- main/levels7.js', '// ---- main/levels7-data.js', '// ---- g7hard/order-early.js', '// ---- g7hard/order-end.js']) if (count(m) !== 1) fail('output carries ' + m + ' ' + count(m) + 'x');
fs.writeFileSync(OUT, h);
const HC = Object.fromEntries(Object.entries(HBP).map(([c, b]) => [b, c])), nm = (s) => s >= 0 ? 'L' + (s + 1) : HC[defs[-s - 1].bp] || defs[-s - 1].bp;
console.log('ok   g7 engine + ' + hdefs.length + ' hard + ' + edefs.length + ' easy levels + ' + odefs.length + ' old rebuilt (' + odefs.map(l => l.replaces + '=' + l.bp).join(' ') + '), ' + SITES.length + ' number-keyed sites; order ' + slots.map(nm).join(' ') + ' then L' + (PLACE.length - defs.length + 1) + '+');
