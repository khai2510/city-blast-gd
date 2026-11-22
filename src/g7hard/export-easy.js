#!/usr/bin/env node
/* Easy pack -> release data (Agents-Game 22/11/2026; Khai 22/11 "tạm thời duyệt, đưa lên main, có nút chọn level").
 *   node src/g7hard/export-easy.js        -> city-blast/release/g7-easy-levels.json (read by the g7-hard step, src/g7hard/patch.js)
 * Reads the finished easy levels from city-blast/levels-gd/<E>/level.json (written by each level's make-level.mjs, never changed
 * here) and sets the in-game budget charges.tnt = tntStart: the budget the levels-gd tester proved (<E>-SUMMARY.md: "N TNT";
 * the 40 in level.json is the tester's open probe). Same input = same bytes. E05 is not built yet (EASY-PACK.md). */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', '..'), GD = path.join(ROOT, 'city-blast', 'levels-gd');
const OUT = path.join(ROOT, 'city-blast', 'release', 'g7-easy-levels.json');
const EASY = ['E01', 'E02', 'E03', 'E04', 'E06'];   // the finished easy levels, in play order (slots 42-46, PLACE in patch.js)
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
