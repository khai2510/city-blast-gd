// O09 "Floodlit Stand" (old-polish, play slot 9, replaces old L13 "Harp Span"). Lesson: steel stands on concrete; aim the tall
// ones inward. See 1-GD-SPEC.md. Kit g7oStand / g7oFlood (pipeline7/engine.js, g7 OLD POLISH). Concrete + steel (+ wood).
// One axis (x): the grandstand in the middle (three stepped tiers, a steel roof), a floodlight tower at each end in line with
// its front (same size, same gap). Each tower stands on four concrete pedestals: two on its inner side gone and it falls
// across the stand's roof (the chain, twice); tipped outward or forward it lands on the empty lot.
import { writeFileSync } from 'node:fs';
const E = (k, d) => process.env[k] != null ? +process.env[k] : d;
const CX = E('CX', 9.6), FZ = E('FZ', -2.4);
const T = (sel, f, i) => ['tnt', sel, f || 0, i || 0];
const lvl = {
  name: 'Floodlit Stand', bp: 'O09', slot: 9, replaces: 'o13', tier: process.env.TIER || 'N', f: 12, kind: 'scene', hero: 'A', heroId: 'G7-O09', teaches: 'aim',
  target: 0.85, yaw: 0, d: 1,
  base: { B: 'stiff-tip', C: 'stiff-tip', '*': 'weak' },
  sf: [], pattern: 'steel on concrete + aim: each floodlight tower tipped inward through two pedestals falls across the grandstand roof',
  parts: [
    { id: 'A', kind: 'g7oStand', x: 0, z: 0, hx: E('HX', 6.2), nx: 5, rh: E('RH', 8.4) },
    { id: 'B', kind: 'g7oFlood', x: -CX, z: FZ, hx: 1.7, ph: 2.0, lh: E('LH', 5.0), ns: 3, side: -1 },
    { id: 'C', kind: 'g7oFlood', x: CX, z: FZ, hx: 1.7, ph: 2.0, lh: E('LH', 5.0), ns: 3, side: 1 }
  ],
  faces: { part: 'B', right: ['x+'], wrong: ['x-', 'z+', 'z-'] },
  charges: { tnt: 40 },
  hint: 'B:x+', tip: '', dud: 'Not yet. Two legs side by side!',
  ftip: 'Tall steel falls where its feet go. Aim inward.',
  lesson: { check: [[T('B:z+', 0, 0), T('B:z+', 0, 1), T('C:z+', 0, 0), T('C:z+', 0, 1)]] }
};
lvl.sol = [T('B:x+', 0, 0), T('B:x+', 0, 1), T('C:x-', 0, 0), T('C:x-', 0, 1), T('A:z+', 0, 2)];
lvl.bot = { hints: [['A', 'B:x+', 1], ['A', 'B:x+', 1], ['A', 'C:x-', 1], ['A', 'C:x-', 1], ['A', 'A:z+', 1]] };
lvl.hero = lvl.parts.map(p => p.id).join(',');   // the opening frames every building (main/frame.js heroIds), not only the main one
lvl.tntStart = E('TNT', 9);
writeFileSync(new URL('./level.json', import.meta.url), JSON.stringify([lvl], null, 1));
console.log('ok O09', 'towers ±' + CX);
