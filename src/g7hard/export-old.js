#!/usr/bin/env node
/* Old-polish levels -> release data (Agents-Game 22/11/2026; Khai 22/11: "the old levels 1 to ten-something to the easy-pack quality").
 *   node src/g7hard/export-old.js        -> city-blast/release/g7-old-levels.json (read by the g7-hard step, src/g7hard/patch.js)
 * Reads the finished rebuilds from city-blast/levels-gd/O<slot>/level.json (written by each level's make-level.mjs, never changed here).
 * Each one REPLACES an old level in place (L.replaces = "oN": same appended index, so the same slot, save, seed, intro cards and
 * tutorial hand); ?oldlv=1 in the game = the old level (for comparison). The in-game budget charges.tnt = tntStart (the tester's
 * proven budget; the 40 in level.json is the open probe). Tier = the old level's tier (TIER below), so picker labels and the
 * tier aids stay as they were. Only levels listed in DONE are exported (a level that misses its bars is not wired in).
 * Same input = same bytes. */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', '..'), GD = path.join(ROOT, 'city-blast', 'levels-gd');
const OUT = path.join(ROOT, 'city-blast', 'release', 'g7-old-levels.json');
// batch 2 (23/11, D-blast-L50 / SLOTS-50): listed in SLOTS-50 slot order; O04B / O05B = o4 / o5 (O04 / O05 were taken). Tiers = the
// SLOTS-50 tier of the slot each one fills (the old level's tier for those it does not move).
const DONE = ['L1TWIN', 'O07', 'O02', 'O15', 'O03', 'O13', 'O12', 'O10', 'O04', 'O05', 'O09', 'O18', 'O04B', 'O05B', 'O25', 'O34', 'O33', 'O17', 'O19', 'O29', 'O26', 'O06', 'O22', 'O23', 'O27', 'O31'];   // the rebuilds that pass their bars (OLD-POLISH.md)
const TIER = { o1:'T', o9:'T', o2:'R', o19:'N', o3:'R', o15:'N', o21:'R', o14:'N', o36:'R', o6:'N', o13:'N', o12:'N', o4:'R', o5:'N', o25:'N', o34:'N', o33:'N',
  o17:'R', o18:'N', o29:'N', o26:'N', o11:'R', o8:'R', o22:'N', o23:'N', o27:'N', o31:'R' };
const fail = (m) => { console.error('export-old: ' + m); process.exit(1); };
const seen = new Set();
const out = DONE.map(e => {
  const a = JSON.parse(fs.readFileSync(path.join(GD, e, 'level.json'), 'utf8'));
  if (!Array.isArray(a) || a.length !== 1) fail(e + '/level.json: want one level');
  const l = a[0];
  if (l.bp !== e) fail(e + ': bp ' + l.bp);
  if (!/^o\d+$/.test(l.replaces || '') || seen.has(l.replaces)) fail(e + ': replaces ' + l.replaces);
  seen.add(l.replaces);
  if (!TIER[l.replaces]) fail(e + ': no tier for ' + l.replaces);
  if (!(l.tntStart > 0)) fail(e + ': no tntStart');
  if (l.tip !== '') fail(e + ': tip must be "" (no hints)');
  if (!l.ftip || l.ftip.split(/\s+/).length > 9) fail(e + ': ftip missing or > 9 words');
  if (!Array.isArray(l.sol) || !l.sol.length) fail(e + ': no sol (the tutorial hand / intro spotlight / expert plan read it)');
  l.charges = { tnt: l.tntStart }; l.tier = TIER[l.replaces];
  return l;
});
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log('ok   ' + out.map(l => l.bp + ' ' + l.name + ' -> ' + l.replaces + ' ' + l.charges.tnt + ' TNT').join(' · ') + ' -> ' + path.relative(ROOT, OUT));
