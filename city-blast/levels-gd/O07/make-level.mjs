// O07 "Pit Head" (old-polish, play slot 7, replaces old L9 "Twin Saucer"). Lesson: aim the fall (steel practice + turn the view):
// the steel headframe stands on concrete footings; it falls toward the footings broken. See 1-GD-SPEC.md. Kit g7oHead / g7oWind /
// g7oLamp (pipeline7/engine.js, g7 OLD POLISH). Wood + brick + concrete + steel. One axis (z): the headframe in the middle, the
// winding-engine house behind it on the axis (the landing of the proper fall), the empty yard and a tub on the rails in front; a lamp
// room each side (same size, same gap, fronts in line). Turned to the back, two footings drop it across the winding house.
import { writeFileSync } from 'node:fs';
const E = (k, d) => process.env[k] != null ? +process.env[k] : d;
const TZ = E('TZ', 0), CX = E('CX', 9.0), HZ = E('HZ', -6.8);
const T = (sel, f, i) => ['tnt', sel, f || 0, i || 0];
const lvl = {
  name: 'Pit Head', bp: 'O07', slot: 7, replaces: 'o9', tier: process.env.TIER || 'N', f: 12, kind: 'scene', hero: 'A', heroId: 'G7-O07', teaches: 'aim',
  target: 0.85, yaw: 0, d: 1,
  base: { A: 'stiff-tip', '*': 'weak' },
  sf: [], pattern: 'steel on concrete + aim: two footings at the back drop the headframe across the winding house; a front fall lands in the empty yard',
  parts: [
    { id: 'A', kind: 'g7oHead', x: 0, z: TZ, hx: E('HX', 2.6), hz: E('HZ2', 2.4), ph: E('PH', 3.2), lh: E('LH', 5.6) },
    { id: 'S', kind: 'g7oWind', x: 0, z: HZ, hx: E('SHX', 5.0), hz: 3.2, h: E('SHH', 5.4) },
    { id: 'B', kind: 'g7oLamp', x: -CX, z: TZ, hx: 3.2, hz: 2.8, side: -1 },
    { id: 'C', kind: 'g7oLamp', x: CX, z: TZ, hx: 3.2, hz: 2.8, side: 1 }
  ],
  faces: { right: ['z-'], wrong: ['z+', 'x+', 'x-'] },
  charges: { tnt: 40 },
  hint: 'A:z-', tip: '', dud: 'Not yet. Two legs side by side!',
  ftip: 'It falls where the legs go. Aim it.',
  lesson: { check: [[T('A:z+', 0, 0), T('A:z+', 0, 1), T('B:z+', 0, 0), T('C:z+', 0, 0)]] }
};
lvl.sol = [T('A:z-', 0, 0), T('A:z-', 0, 1), T('B:z+', 0, 0), T('C:z+', 0, 0)];
lvl.bot = { hints: [['A', 'A:z-', 1], ['A', 'A:z-', 1], ['A', 'B:z+', 1], ['A', 'C:z+', 1]] };
lvl.hero = lvl.parts.map(p => p.id).join(',');   // the opening frames every building (main/frame.js heroIds), not only the main one
lvl.tntStart = E('TNT', 8);
writeFileSync(new URL('./level.json', import.meta.url), JSON.stringify([lvl], null, 1));
console.log('ok O07', 'head z', TZ, 'lamp rooms ±' + CX, 'winding house z', HZ);
