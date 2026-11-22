// O02 "Hop Kiln" (old-polish, play slot 2, replaces old L2 "Stripey Point"; tutorial). Lesson: two legs side by side, then BLAST.
// See 1-GD-SPEC.md. Kit g7oOast / g7oLodge / g7oCott (pipeline7/engine.js, g7 OLD POLISH). Wood + brick (slot 2 introduces brick
// and the BLAST button). One axis (x): the brick kiln in the middle on its arcade of 8 brick piers, a brick cottage each side
// (same size, same gap, fronts in line), the timber cart lodge in front of the kiln on the axis. Two front piers side by side gone
// (base stiff-tip) and the kiln falls forward across the lodge (the chain); one pier alone only cracks it. The L2 hand (main/tap2.js
// H2) taps the two front piers of sol[0]'s face, then BLAST; the brick card's spotlight puts one TNT on a brick member of the plan.
import { writeFileSync } from 'node:fs';
const E = (k, d) => process.env[k] != null ? +process.env[k] : d;
const TZ = E('TZ', -8), CX = E('CX', 8.8), SZ = E('SZ', 2.4);
const T = (sel, f, i) => ['tnt', sel, f || 0, i || 0];
const lvl = {
  name: 'Hop Kiln', bp: 'O02', slot: 2, replaces: 'o2', tier: process.env.TIER || 'T', f: 11, kind: 'scene', hero: 'A', heroId: 'G7-O02', teaches: 'brick',
  target: 0.85, yaw: 0, d: 1,
  base: { A: { preset: 'stiff-tip', shove: E('SHOVE', 2.5) }, '*': 'weak' },
  sf: [], pattern: 'tutorial: two brick piers side by side drop the kiln forward across the cart lodge; one pier alone only cracks it; each cottage takes its own pier',
  parts: [
    { id: 'A', kind: 'g7oOast', x: 0, z: TZ, hx: E('HX', 3.0), ah: E('AH', 5.6), kh: E('KH', 8.0) },
    { id: 'S', kind: 'g7oLodge', x: E('SX', 3.8), z: SZ, hx: E('SHX', 3.2), hz: 2.0, h: E('SHH', 2.4), nx: 3 },
    { id: 'B', kind: 'g7oCott', x: -CX, z: TZ + 0.8, hx: 3.2, hz: 2.8, side: -1, nb: E('NB', 2) },
    { id: 'C', kind: 'g7oCott', x: CX, z: TZ + 0.8, hx: 3.2, hz: 2.8, side: 1, nb: E('NB', 2) }
  ],
  charges: { tnt: 40 },
  hint: 'A:z+', tip: '', dud: 'Not yet. Two legs side by side!',
  ftip: 'Two piers side by side bring it down.',
  lesson: { check: [[T('A:z+', 0, 0), T('B:z+', 0, 0), T('C:z+', 0, 0)]] }
};
lvl.sol = [T('A:z+', 0, 0), T('A:z+', 0, 1), T('B:z+', 0, 0), T('C:z+', 0, 0)];
lvl.bot = { hints: [['A', 'A:z+', 1], ['A', 'A:z+', 1], ['A', 'B:z+', 1], ['A', 'C:z+', 1]] };
if (!E('SIDES', 1)) { lvl.parts = lvl.parts.filter(p => p.id === 'A' || p.id === 'S'); lvl.sol = lvl.sol.filter(e => /^[AS]:/.test(e[1])); lvl.bot.hints = lvl.bot.hints.filter(h => /^[AS]:/.test(h[1])); lvl.sol.push(T('S:z+', 0, 0)); lvl.bot.hints.push(['A', 'S:z+', 1]); if (lvl.lesson.check[0].length) lvl.lesson.check = [lvl.lesson.check[0].filter(e => /^[AS]:/.test(e[1]))]; }
lvl.hero = lvl.parts.map(p => p.id).join(',');   // the opening frames every building (main/frame.js heroIds), not only the main one
lvl.tntStart = E('TNT', 6);
writeFileSync(new URL('./level.json', import.meta.url), JSON.stringify([lvl], null, 1));
console.log('ok O02', 'kiln z', TZ, 'cottages ±' + CX, 'lodge z', SZ);
