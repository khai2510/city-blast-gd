// O13 "Monorail Station" (old-polish, play slot 13, replaces old L15 "The Sail"). Lesson: what rests on it goes with it: the viaduct
// spans lean on the station's platform. See 1-GD-SPEC.md. Kit g7oMono / g7oSpan (pipeline7/engine.js, g7 OLD POLISH). Wood + concrete
// + steel. One axis (x): the station in the middle on its concrete columns, a viaduct span each side (same length, mirrored) whose
// steel beam rests on the station's platform edge. Two columns side by side drop the station; both spans lose their inner support
// and swing down (the chain, twice); their outer columns are the clean-up.
import { writeFileSync } from 'node:fs';
import { centre } from '../pad-centre.mjs';
const E = (k, d) => process.env[k] != null ? +process.env[k] : d;
const TZ = E('TZ', -5), HX = E('HX', 4.2), LEN = E('LEN', 8.0), GH = E('GH', 6.0), SX = HX - 0.8 + LEN/2;
const T = (sel, f, i) => ['tnt', sel, f || 0, i || 0];
const lvl = {
  name: 'Monorail Station', bp: 'O13', slot: 13, replaces: 'o15', tier: process.env.TIER || 'N', f: 12, kind: 'scene', hero: 'A', heroId: 'G7-O13', teaches: 'support',
  target: 0.85, yaw: 0, d: 1,
  base: { A: 'stiff-tip', '*': 'weak' },
  sf: [], pattern: 'support chain: the viaduct spans rest on the station platform; drop the station and both spans swing down',
  parts: [
    { id: 'A', kind: 'g7oMono', x: 0, z: TZ, hx: HX, hz: 2.6, gh: GH, bg: 91 },
    { id: 'B', kind: 'g7oSpan', x: -SX, z: TZ, side: -1, len: LEN, y: GH, hz: 2.0, bg: 92 },
    { id: 'C', kind: 'g7oSpan', x: SX, z: TZ, side: 1, len: LEN, y: GH, hz: 2.0, bg: 93 }
  ],
  charges: { tnt: 40 },
  hint: 'A:z+', tip: '', dud: 'Not yet. Two legs side by side!',
  ftip: 'What rests on it falls with it.',
  lesson: { check: [[]] }
};
lvl.sol = [T('A:z+', 0, 0), T('A:z+', 0, 1), T('B:z+', 0, 0), T('C:z+', 0, 0)];
lvl.bot = { hints: [['A', 'A:z+', 1], ['A', 'A:z+', 1], ['A', 'B:z+', 1], ['A', 'C:z+', 1]] };
lvl.hero = lvl.parts.map(p => p.id).join(',');   // the opening frames every building (main/frame.js heroIds), not only the main one
lvl.tntStart = E('TNT', 7);
// batch 2 (23/11, SLOTS-50 slot 10, D-blast-L50): CONV=1 (default) = members launched later than slot 10 become earlier ones
// (P.conv in pipeline7/engine.js re-keys and re-tints them). CONV=0 = the 22/11 build.
if (E('CONV', 1)) {
  lvl.parts.forEach(p => { p.conv = { steel: 'concrete', mdS: 'mdC' }; });
  lvl.batch = 2; lvl.launch = { el: ['concrete'], slot: 10, before: ['concrete', 'steel'] };
}
if (!E('NOPAD', 0)) centre(lvl);   // D-blast-PAD (Khai 23/11): the scene centred on the sand pad (a rigid shift)
writeFileSync(new URL('./level.json', import.meta.url), JSON.stringify([lvl], null, 1));
console.log('ok O13', 'spans at ±' + SX);
