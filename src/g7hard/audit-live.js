#!/usr/bin/env node
/* Order audit from the LIVE game (PLACE-1124, 24/11). Reads a sweep file written by src/g7hard/sweep-live.js (every slot loaded in the
 * built game: the member keys of every live body + level fields) and rewrites src/g7hard/order-audit.json for check-order.js, and
 * prints the D-blast-LAUNCH check for slots 1-50 (no element before its launch slot; Hard / boss levels are the launch exception).
 *   node src/g7hard/audit-live.js <sweep.json> [--write]
 * Keys -> elements (the 22/11 audit + audit-old.js table, plus the g7 kit keys):
 *   wood wpost wwall wfloor mdW g7post · brick bk bkw mdB g7bk g7bkw (g7bk = the brick-clad kit member, counted as brick: EASY-PACK
 *   "Open points") · concrete concrete cpan crT mdC slab tdeck a1mdC core7 g7silo · glass glass mglass · steel steel sdeck mcol mpost mdeck ·
 *   dark RC rc rcs hrc · heavy hard7v hard7t hard7p hard7e · stone hard7i · drop drop7 · barrels tank · blue a keep (k* keys / L.keeps).
 *   Roofs g7roofL / g7roofD / g7tile / g7eave (light roof panels), decor (rail, awn2, ledge, a1lite), the generic deck mdeck and base are not elements.
 * Mechanics: steps = the level's own bar says its expert plan needs >= 2 blasts (easy pack: levels-gd/<E>/results-slots50.json
 * "steps"; old-polish: L.teaches "steps"; a level not rebuilt / Hard / boss: the 22/11 audit row). rotate = L.teaches "rotate" or
 * L.faces (a control, not an element). trap / perblast / drop on Hard levels and old levels never rebuilt: the 22/11 row (not readable
 * from keys). In order-audit.json "dark" = RC only (launch 60); heavy pieces are the flag "heavy" (launch 50, no card; check-order.js). */
'use strict';
const fs = require('fs'), path = require('path');
const [SW, W] = process.argv.slice(2);
const ROOT = path.join(__dirname, '..', '..'), GD = path.join(ROOT, 'city-blast', 'levels-gd');
const AF = path.join(__dirname, 'order-audit.json'), aud = JSON.parse(fs.readFileSync(AF, 'utf8'));
const src = fs.readFileSync(path.join(__dirname, 'patch.js'), 'utf8');
const PLACE = Function('return ' + src.match(/const PLACE = (\[[\s\S]*?\]);/)[1])();
const HBP = { L01v4: 'H1', L02: 'H2', L03: 'H3', L04: 'H4', L05: 'H5' };
const KEYS = { wood: ['wpost', 'wwall', 'wfloor', 'mdW', 'g7post'], brick: ['bk', 'bkw', 'mdB', 'g7bk', 'g7bkw'], concrete: ['concrete', 'cpan', 'crT', 'mdC', 'slab', 'tdeck', 'a1mdC', 'core7', 'g7silo'],
  glass: ['glass', 'mglass'], steel: ['steel', 'sdeck', 'mcol', 'mpost', 'mdS'], dark: ['rc', 'rcs', 'hrc'], heavy: ['hard7v', 'hard7t', 'hard7p', 'hard7e'], stone: ['hard7i'], drop: ['drop7'], barrels: ['tank'] };
const NOTEL = new Set(['base', 'g7roofL', 'g7roofD', 'g7tile', 'g7eave', 'rail', 'awn2', 'ledge', 'a1lite', 'mdeck']);
const LAUNCH = { wood: 1, brick: 4, concrete: 8, blue: 15, glass: 20, barrels: 25, steps: 35, steel: 40, heavy: 50, dark: 60, drop: 70, trap: 80, stone: 90, perblast: 100 };
const sw = JSON.parse(fs.readFileSync(SW, 'utf8')), bySlot = {}; sw.forEach(r => { if (r.keys && Object.keys(r.keys).length) bySlot[r.slot] = r; });
const known = new Set([].concat(...Object.values(KEYS)));
const out = {}, viol = [], unk = {}, miss = [];
PLACE.forEach((c, i) => {
  const s = i + 1, r = bySlot[s], a = aud.levels[c] || {};
  if (!r) { miss.push(s + ' ' + c); out[c] = a; return; }
  const keys = r.keys, el = Object.entries(KEYS).filter(([, ks]) => ks.some(k => keys[k])).map(([e]) => e);
  Object.keys(keys).forEach(k => { if (!known.has(k) && !NOTEL.has(k) && !/^k[a-zA-Z]+$/.test(k)) (unk[k] = unk[k] || []).push(s); });
  if (r.keeps > 0 || Object.keys(keys).some(k => /^k(base|wall|win|roof)/.test(k))) el.push('blue');
  if (r.tanks > 0 && !el.includes('barrels')) el.push('barrels');
  let steps;
  if (/^E\d\d$/.test(c)) { const f = path.join(GD, c, 'results-slots50.json'); steps = fs.existsSync(f) ? !!JSON.parse(fs.readFileSync(f, 'utf8')).steps : (a.el || []).includes('steps'); }
  else if (r.isO) steps = r.teaches === 'steps'; else steps = (a.el || []).includes('steps');
  if (steps) el.push('steps');
  for (const m of ['trap', 'perblast']) if ((a.el || []).includes(m)) el.push(m);
  if ((a.el || []).includes('drop') && !r.isO && !/^E/.test(c) && !el.includes('drop')) el.push('drop');   // Hard / not-rebuilt rows: the 22/11 mechanic
  if (r.teaches === 'rotate' || r.faces || (!r.isO && !/^E/.test(c) && (a.el || []).includes('rotate'))) el.push('rotate');
  const el2 = el.filter(e => e !== 'heavy');   // heavy is its own flag (launch 50, no card): check-order.js reads l.heavy; "dark" = RC only (launch 60)
  out[c] = Object.assign({}, a, { name: r.name, tnt: r.tnt || a.tnt, el: el2, heavy: el.includes('heavy') || undefined, live: Object.keys(keys).sort().join(' ') });
  if (s <= 50) { const late = el.filter(e => LAUNCH[e] > s); if (late.length) viol.push({ s, c, name: r.name, hard: !!a.hard, late: late.map(e => e + ' (' + LAUNCH[e] + ')') }); }
});
// E-levels not yet in the old audit (E11-E15): tier N, not hard
for (const c of PLACE) if (!aud.levels[c] && out[c]) Object.assign(out[c], { tier: out[c].tier || 'N', boss: false, hard: false });
console.log('slots read: ' + Object.keys(bySlot).length + '/' + PLACE.length + (miss.length ? ' · MISSING (kept 22/11 row): ' + miss.join(', ') : ''));
if (Object.keys(unk).length) console.log('unknown keys (not counted): ' + Object.entries(unk).map(([k, v]) => k + '@' + v.join('/')).join(' '));
console.log('\nD-blast-LAUNCH, slots 1-50 (element before its launch slot):');
viol.forEach(v => console.log((v.hard ? '  exception (Hard/boss) ' : '  VIOLATION ') + String(v.s).padStart(2) + ' ' + v.c.padEnd(4) + ' ' + v.name.padEnd(20) + ' ' + v.late.join(', ')));
const nv = viol.filter(v => !v.hard).length; console.log(nv ? nv + ' non-hard level(s) break D-blast-LAUNCH' : 'no non-hard level breaks D-blast-LAUNCH');
if (W === '--write') {
  const levels = {}; PLACE.forEach(c => { levels[c] = out[c]; });
  aud._ = aud._ + ' 24/11 PLACE-1124: every row re-read from the live game (src/g7hard/sweep-live.js -> audit-live.js; keys in "live"; "dark" = RC only, "heavy" = hard7v/t/p/e, launch 50).';
  aud.levels = levels;
  fs.writeFileSync(AF, JSON.stringify(aud).replace(/,"(o\d+|H\d|E\d\d)":/g, ',\n"$1":'));
  console.log('wrote ' + path.relative(ROOT, AF));
}
