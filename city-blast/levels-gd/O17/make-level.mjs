// O17 "Car Park" (old-polish, play slot 17, replaces old L17 "The Pedestal"; the dark pier card: "Reinforced concrete takes more
// TNT."). Lesson: a dark pier needs more than one TNT. See 1-GD-SPEC.md. Kit g7oPark / g7oWing (pipeline7/engine.js, g7 OLD POLISH).
// One axis (x): the car park in the middle (its ground storey all dark piers, dark corners above), an office wing each side (same
// size, same gap, fronts in line). Two dark piers side by side, each with enough TNT, tip it forward; the decks pancake one on the next.
import { writeFileSync } from 'node:fs';
import { centre } from '../pad-centre.mjs';
const E = (k, d) => process.env[k] != null ? +process.env[k] : d;
const TZ = E('TZ', -6), CX = E('CX', 10.6);
const T = (sel, f, i) => ['tnt', sel, f || 0, i || 0];
const lvl = {
  name: 'Car Park', bp: 'O17', slot: 17, replaces: 'o17', tier: process.env.TIER || 'N', f: 12, kind: 'scene', hero: 'A', heroId: 'G7-O17', teaches: 'rc',
  target: 0.85, yaw: 0, d: 1, hard7: E('HARD7', 1) ? true : undefined,   // slot 17 on: heavy pieces count until cracked (the dark element is introduced)
  base: { A: { preset: 'stiff-tip', shove: E('SHOVE', 2.5) }, '*': 'weak' },
  sf: [], pattern: 'dark piers: the car park stands on reinforced piers that take more than one TNT; two side by side tip it and the decks pancake',
  parts: [
    { id: 'A', kind: 'g7oPark', x: 0, z: TZ, hx: E('HX', 5.0), hz: E('HZ', 4.0), h: 2.9, ns: E('NS', 4), heavy: E('HEAVY', 1.35) },
    { id: 'B', kind: 'g7oWing', x: -CX, z: TZ, hx: 3.4, hz: 2.8, side: -1, nb: 3 },
    { id: 'C', kind: 'g7oWing', x: CX, z: TZ, hx: 3.4, hz: 2.8, side: 1, nb: 3 }
  ],
  charges: { tnt: 40 },
  hint: 'A:z+', tip: '', dud: 'Not yet. Dark piers need more TNT!',
  ftip: 'Dark piers take more TNT than grey ones.',
  lesson: { check: [[]] }
};
lvl.sol = [T('A:z+', 0, 1), T('A:z+', 0, 1), T('A:z+', 0, 1), T('A:z+', 0, 2), T('A:z+', 0, 2), T('A:z+', 0, 2), T('B:z+', 0, 0), T('C:z+', 0, 0)];
lvl.bot = { hints: [['A', 'A:z+', 2], ['A', 'A:z+', 2], ['A', 'B:z+', 1], ['A', 'C:z+', 1]] };
lvl.hero = lvl.parts.map(p => p.id).join(',');   // the opening frames every building (main/frame.js heroIds), not only the main one
lvl.tntStart = E('TNT', 14);
// batch 2 (23/11, SLOTS-50 slot 30, D-blast-L50): CONV=1 (default) = members launched later than slot 30 become earlier ones
// (P.conv in pipeline7/engine.js re-keys and re-tints them); no heavy piece, no hard7 scoring, one blast. CONV=0 = the 22/11 build.
if (E('CONV', 1)) {
  lvl.parts.forEach(p => { p.conv = { rc: 'concrete', rcs: 'concrete' }; });
  lvl.parts.forEach(p => { if (p.heavy) p.heavy = 0; }); delete lvl.hard7;
  lvl.ftip = 'Break the legs. The decks come down together.';
  lvl.batch = 2; lvl.launch = { el: ['brick', 'concrete'], slot: 30, before: ['brick', 'concrete', 'dark', 'heavy'] };
}
if (!E('NOPAD', 0)) centre(lvl);   // D-blast-PAD (Khai 23/11): the scene centred on the sand pad (a rigid shift)
writeFileSync(new URL('./level.json', import.meta.url), JSON.stringify([lvl], null, 1));
console.log('ok O17');
