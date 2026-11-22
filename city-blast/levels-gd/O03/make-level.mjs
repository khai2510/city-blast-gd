// O03 "Airfield Tower" (old-polish, play slot 3, replaces old L3 "Old Tock"). Lesson: grey columns, one TNT each; two side by side tip it.
// See 1-GD-SPEC.md. Kit g7oTwr / g7oBag / g7oWing (pipeline7/engine.js, g7 OLD POLISH). Wood + brick + concrete (slot 3 introduces
// concrete). One axis (x): the control tower in the middle on 8 grey concrete columns, a terminal wing each side (same size, same gap,
// fronts in line), the low baggage hall in front of the tower on the axis. Two front columns side by side gone (base stiff-tip) and
// the tower falls forward across the baggage hall (the chain); each wing takes its own column. The concrete card's spotlight puts its
// TNT on a column of the plan (sol). Fixes the old L3 "expert plan loses under the g7 engine" (SYNC 22/11): the plan is checked in main.
import { writeFileSync } from 'node:fs';
const E = (k, d) => process.env[k] != null ? +process.env[k] : d;
const TZ = E('TZ', -8), CX = E('CX', 9.0), SZ = E('SZ', 2.4);
const T = (sel, f, i) => ['tnt', sel, f || 0, i || 0];
const lvl = {
  name: 'Airfield Tower', bp: 'O03', slot: 3, replaces: 'o3', tier: process.env.TIER || 'N', f: 12, kind: 'scene', hero: 'A', heroId: 'G7-O03', teaches: 'concrete',
  target: 0.85, yaw: 0, d: 1,
  base: { A: { preset: 'stiff-tip', shove: E('SHOVE', 2.5) }, '*': 'weak' },
  sf: [], pattern: 'tutorial: two grey columns side by side drop the tower forward across the baggage hall; one column alone only cracks it; each wing takes its own column',
  parts: [
    { id: 'A', kind: 'g7oTwr', x: 0, z: TZ, hx: E('HX', 3.0), gh: E('GH', 5.0), sh: E('SH', 3.3), ns: E('NS', 4) },
    { id: 'S', kind: 'g7oBag', x: E('SX', 3.8), z: SZ, hx: E('SHX', 3.2), hz: 2.0, h: E('SHH', 2.4), nx: 3 },
    { id: 'B', kind: 'g7oWing', x: -CX, z: TZ + 0.6, hx: 3.4, hz: 2.8, side: -1, nb: E('NB', 3) },
    { id: 'C', kind: 'g7oWing', x: CX, z: TZ + 0.6, hx: 3.4, hz: 2.8, side: 1, nb: E('NB', 3) }
  ],
  charges: { tnt: 40 },
  hint: 'A:z+', tip: '', dud: 'Not yet. Two columns side by side!',
  ftip: 'Grey columns: one TNT each. Two side by side.',
  lesson: { check: [[T('A:z+', 0, 0), T('B:z+', 0, 0), T('C:z+', 0, 0)]] }
};
lvl.sol = [T('A:z+', 0, 0), T('A:z+', 0, 1), T('B:z+', 0, 0), T('C:z+', 0, 0)];
lvl.bot = { hints: [['A', 'A:z+', 1], ['A', 'A:z+', 1], ['A', 'B:z+', 1], ['A', 'C:z+', 1]] };
if (!E('SIDES', 1)) { lvl.parts = lvl.parts.filter(p => p.id === 'A' || p.id === 'S'); lvl.sol = lvl.sol.filter(e => /^[AS]:/.test(e[1])); lvl.bot.hints = lvl.bot.hints.filter(h => /^[AS]:/.test(h[1])); lvl.sol.push(T('S:z+', 0, 0)); lvl.bot.hints.push(['A', 'S:z+', 1]); if (lvl.lesson.check[0].length) lvl.lesson.check = [lvl.lesson.check[0].filter(e => /^[AS]:/.test(e[1]))]; }
lvl.hero = lvl.parts.map(p => p.id).join(',');   // the opening frames every building (main/frame.js heroIds), not only the main one
lvl.tntStart = E('TNT', 6);
writeFileSync(new URL('./level.json', import.meta.url), JSON.stringify([lvl], null, 1));
console.log('ok O03', 'tower z', TZ, 'wings ±' + CX, 'hall z', SZ);
