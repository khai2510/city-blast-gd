// O07 "Pit Head" (old-polish, play slot 7, replaces old L9 "Twin Saucer"). Lesson: aim the fall (steel practice + turn the view):
// the steel headframe stands on concrete footings; it falls toward the footings broken. See 1-GD-SPEC.md. Kit g7oHead / g7oWind /
// g7oLamp (pipeline7/engine.js, g7 OLD POLISH). Wood + brick + concrete + steel. One axis (z): the headframe in the middle, the
// winding-engine house behind it on the axis (the landing of the proper fall), the empty yard and a tub on the rails in front; a lamp
// room each side (same size, same gap, fronts in line). Turned to the back, two footings drop it across the winding house.
// batch 2 (23/11, SLOTS-50 slot 2, D-blast-L50: wood only): WOOD=1 (default) = a timber headframe on timber feet that falls FORWARD
// (the L2 hand: two front feet side by side, then BLAST) across a timber woodshed in front; log cabins each side; tutorial bars, 10 TNT
// (as D-blast-O23 for O02 / O03; Khai to confirm for this slot). WOOD=0 = the 22/11 steel-on-concrete aim build (slot 7).
import { writeFileSync } from 'node:fs';
import { centre } from '../pad-centre.mjs';
const E = (k, d) => process.env[k] != null ? +process.env[k] : d;
const TZ = E('TZ', 0), CX = E('CX', 9.0), HZ = E('HZ', -6.8);
const T = (sel, f, i) => ['tnt', sel, f || 0, i || 0];
const WOODV = E('WOOD', 1);
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
  // (22/11 run: a wrong-way fall still clears the lot with a clean-up blast, so this is a practice level with the fair bars, not an aim test)
  charges: { tnt: 40 },
  hint: 'A:z-', tip: '', dud: 'Not yet. Two legs side by side!',
  ftip: 'It falls where the legs go. Aim it.',
  lesson: { check: [[T('A:z+', 0, 0), T('A:z+', 0, 1), T('B:z+', 0, 0), T('C:z+', 0, 0)]] }
};
lvl.sol = [T('A:z-', 0, 0), T('A:z-', 0, 1), T('S:z+', 0, 0), T('B:z+', 0, 0), T('C:z+', 0, 0)];
lvl.bot = { hints: [['A', 'A:z-', 1], ['A', 'A:z-', 1], ['A', 'B:z+', 1], ['A', 'C:z+', 1]] };
lvl.hero = lvl.parts.map(p => p.id).join(',');   // the opening frames every building (main/frame.js heroIds), not only the main one
lvl.tntStart = E('TNT', 8);
if (WOODV) {
  const TZ2 = E('TZ', -8), SZ = E('SZ', 1.6), CX2 = E('CX', 9.0);
  Object.assign(lvl, { slot: 2, tier: process.env.TIER || 'T', teaches: 'wood', base: { A: { preset: 'weak-tip', shove: E('SHOVE', 2.5) }, '*': 'weak' },
    pattern: 'timber headframe: two front feet side by side and it falls forward across the woodshed', hint: 'A:z+', ftip: 'Two feet side by side. Then BLAST.' });
  lvl.parts = [
    { id: 'A', kind: 'g7oHead', wood: 1, x: 0, z: TZ2, hx: E('HX', 2.6), hz: E('HZ2', 2.4), ph: E('PH', 3.2), lh: E('LH', 5.0) },
    { id: 'S', kind: 'g7oShed', x: 0, z: SZ, hx: E('SHX', 3.6), hz: 2.0, h: E('SHH', 2.4), nx: 3 } ];
  if (E('SIDES', 1)) lvl.parts.push({ id: 'B', kind: 'g7oCabin', x: -CX2, z: TZ2 + 0.6, hx: 2.8, hz: 2.4, side: -1 }, { id: 'C', kind: 'g7oCabin', x: CX2, z: TZ2 + 0.6, hx: 2.8, hz: 2.4, side: 1 });
  lvl.lesson = { check: [[]] };
  lvl.sol = [T('A:z+', 0, 0), T('A:z+', 0, 1)].concat(lvl.parts.filter(p => p.id !== 'A' && (p.id !== 'S' || !E('SIDES', 1) || E('TNT', 10) >= 10)).map(p => T(p.id + ':z+', 0, 0)));
  lvl.bot = { hints: lvl.sol.map(e => ['A', e[1], 1]) };
  lvl.hero = lvl.parts.map(p => p.id).join(',');
  lvl.tntStart = E('TNT', 10);   // 23/11 runs: 5 TNT (D-blast-K2) = fair bot 0/3 with the cabins, oneBomb 78 % without them; 10 TNT as D-blast-O23 (Khai to confirm for slot 2)
  lvl.batch = 2; lvl.launch = { el: ['wood'], slot: 2, before: ['wood', 'brick', 'concrete', 'steel'] };
}
if (!E('NOPAD', 0)) centre(lvl);   // D-blast-PAD (Khai 23/11): the scene centred on the sand pad (a rigid shift)
writeFileSync(new URL('./level.json', import.meta.url), JSON.stringify([lvl], null, 1));
console.log('ok O07', 'head z', TZ, 'lamp rooms ±' + CX, 'winding house z', HZ);
