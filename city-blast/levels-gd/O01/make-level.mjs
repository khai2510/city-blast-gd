// O01 "Ranger Lookout" (old-polish, play slot 1, replaces old L1 "Old Whirly"; tutorial). Lesson: a post holds it up: tap a post.
// See 1-GD-SPEC.md. Kit g7oLook / g7oShed / g7oCabin (pipeline7/engine.js, g7 OLD POLISH). Wood only (slot 1 introduces wood).
// One axis (x): the lookout tower in the middle, a log cabin each side (same size, same gap, fronts in line); the woodshed in
// front of the tower on the axis. One post of the tower gone and it falls forward across the woodshed (the chain); each cabin
// takes its own post. The first-visit hand (main/tap2.js H1) double-taps sol[0], a front leg of the tower.
import { writeFileSync } from 'node:fs';
const E = (k, d) => process.env[k] != null ? +process.env[k] : d;
const TZ = E('TZ', -8), CX = E('CX', 8.6), SZ = E('SZ', 2.4);
const T = (sel, f, i) => ['tnt', sel, f || 0, i || 0];
const lvl = {
  name: 'Ranger Lookout', bp: 'O01', slot: 1, replaces: 'o1', tier: process.env.TIER || 'T', f: 9, kind: 'scene', hero: 'A', heroId: 'G7-O01', teaches: 'wood',
  target: 0.85, yaw: 0, d: 1,
  base: { A: { preset: 'weak-tip', shove: E('SHOVE', 2.5) }, '*': 'weak' },
  sf: [], pattern: 'tutorial: one post holds the lookout up; one double tap and it falls across the woodshed; each cabin takes its own post',
  parts: [
    { id: 'A', kind: 'g7oLook', x: 0, z: TZ, hx: E('HX', 2.8), lh: E('LH', 5.2), sh: E('SH', 3.4), ns: E('NS', 4) },
    { id: 'S', kind: 'g7oShed', x: E('SX', 3.6), z: SZ, hx: E('SHX', 3.0), hz: 2.0, h: E('SHH', 2.2), nx: 3 },
    { id: 'B', kind: 'g7oCabin', x: -CX, z: TZ + 1.0, hx: 3.2, hz: 2.8, side: -1 },
    { id: 'C', kind: 'g7oCabin', x: CX, z: TZ + 1.0, hx: 3.2, hz: 2.8, side: 1 }
  ],
  charges: { tnt: 40 },
  hint: 'A:z+', tip: '', noWords: 1, aid: { tip: false }, dbl: 1,
  ftip: 'A post holds a building up. Hit the posts.',
  lesson: { check: [[]] }
};
lvl.sol = [T('A:z+', 0, 0), T('B:z+', 0, 0), T('C:z+', 0, 0)];
lvl.bot = { hints: [['A', 'A:z+', 1], ['A', 'B:z+', 1], ['A', 'C:z+', 1]] };
if (!E('SIDES', 1)) { lvl.parts = lvl.parts.filter(p => p.id === 'A' || p.id === 'S'); lvl.sol = lvl.sol.filter(e => /^[AS]:/.test(e[1])); lvl.bot.hints = lvl.bot.hints.filter(h => /^[AS]:/.test(h[1])); lvl.sol.push(T('S:z+', 0, 0)); lvl.bot.hints.push(['A', 'S:z+', 1]); if (lvl.lesson.check[0].length) lvl.lesson.check = [lvl.lesson.check[0].filter(e => /^[AS]:/.test(e[1]))]; }
lvl.hero = lvl.parts.map(p => p.id).join(',');   // the opening frames every building (main/frame.js heroIds), not only the main one
lvl.tntStart = E('TNT', 6);
writeFileSync(new URL('./level.json', import.meta.url), JSON.stringify([lvl], null, 1));
console.log('ok O01', 'tower z', TZ, 'cabins ±' + CX, 'shed z', SZ);
