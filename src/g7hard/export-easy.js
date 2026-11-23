#!/usr/bin/env node
/* Easy pack -> release data (Agents-Game 22/11/2026; Khai 22/11 "tạm thời duyệt, đưa lên main, có nút chọn level").
 *   node src/g7hard/export-easy.js        -> city-blast/release/g7-easy-levels.json (read by the g7-hard step, src/g7hard/patch.js)
 * Reads the finished easy levels from city-blast/levels-gd/<E>/level.json (written by each level's make-level.mjs, never changed
 * here) and sets the in-game budget charges.tnt = tntStart: the budget the levels-gd tester proved (<E>-SUMMARY.md: "N TNT";
 * the 40 in level.json is the tester's open probe). Same input = same bytes.
 * 22/11 (second batch): E05 E07 E08 E09 E10 appended as slots 47-51 (Khai: E01-E04, E06 "khá ok", build the rest). */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', '..'), GD = path.join(ROOT, 'city-blast', 'levels-gd');
const OUT = path.join(ROOT, 'city-blast', 'release', 'g7-easy-levels.json');
// ORDER1123 (23/11): this list is the DATA order (LV7DEFS appended index 36 + 5 + k: the save mark "s:" and the level seeds key on it),
// kept as it was. The PLAY order is PLACE in patch.js only (ORDER1123: E04 3 · E02 5 · E06 9 · E07 21 · E03 25 · E10 26 · E05 36 · E08 46 · E09 48 · E01 50).
const EASY = ['E01', 'E02', 'E03', 'E04', 'E06', 'E05', 'E07', 'E08', 'E09', 'E10'];   // the finished easy levels, data order (never reorder: saves / seeds)
const fail = (m) => { console.error('export-easy: ' + m); process.exit(1); };
const out = EASY.map(e => {
  const a = JSON.parse(fs.readFileSync(path.join(GD, e, 'level.json'), 'utf8'));
  if (!Array.isArray(a) || a.length !== 1) fail(e + '/level.json: want one level');
  const l = a[0];
  if (l.bp !== e) fail(e + ': bp ' + l.bp);
  if (!(l.tntStart > 0)) fail(e + ': no tntStart');
  if (l.tip !== '') fail(e + ': tip must be "" (no hints)');
  if (!l.ftip || l.ftip.split(/\s+/).length > 9) fail(e + ': ftip missing or > 9 words');
  l.charges = { tnt: l.tntStart };
  return l;
});
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log('ok   ' + out.map(l => l.bp + ' ' + l.name + ' ' + l.charges.tnt + ' TNT').join(' · ') + ' -> ' + path.relative(ROOT, OUT));
