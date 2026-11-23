// O18 "Roadside Motel" (old-polish, play slot 18, replaces old L12 "Star Pedestal"). Lesson: the dark piers are round the back:
// turn the view and give them more TNT (rotate + dark pier practice). See 1-GD-SPEC.md. Kit g7oSign / g7oMotel / g7oCott
// (pipeline7/engine.js, g7 OLD POLISH). Wood + brick + concrete + dark. One axis (z): the sign pylon in the middle (grey front legs,
// dark back legs), the motel row behind it on the axis (the landing), the car lot in front; a brick office each side.
import { writeFileSync } from 'node:fs';
import { centre } from '../pad-centre.mjs';
const E = (k, d) => process.env[k] != null ? +process.env[k] : d;
const TZ = E('TZ', -2), CX = E('CX', 9.0), MZ = E('MZ', -7.4);
const T = (sel, f, i) => ['tnt', sel, f || 0, i || 0];
const lvl = {
  name: 'Roadside Motel', bp: 'O18', slot: 18, replaces: 'o12', tier: process.env.TIER || 'N', f: 12, kind: 'scene', hero: 'A', heroId: 'G7-O18', teaches: 'rotate',
  target: 0.85, yaw: 0, d: 1, hard7: E('HARD7', 1) ? true : undefined,   // slot 17 on: heavy pieces count until cracked (the dark element is introduced)
  base: { A: { preset: 'stiff-tip', shove: E('SHOVE', 2.5) }, '*': 'weak' },
  sf: [], pattern: 'rotate + dark: the sign pylon stands on dark back legs; turned to the back, two of them (more TNT each) drop it across the motel row',
  parts: [
    { id: 'A', kind: 'g7oSign', x: 0, z: TZ, hx: 1.8, gh: 4.0, sh: E('SH', 3.6), ns: E('NS', 4), heavy: E('HEAVY', 1.35) },
    { id: 'S', kind: 'g7oMotel', x: 0, z: MZ, n: E('NM', 4), w: 3.0, hz: 2.6, h: 3.2 },
    { id: 'B', kind: 'g7oCott', x: -CX, z: TZ, hx: 3.2, hz: 2.8, side: -1 },
    { id: 'C', kind: 'g7oCott', x: CX, z: TZ, hx: 3.2, hz: 2.8, side: 1 }
  ],
  // (22/11 run: a wrong-way fall still clears the lot with a clean-up blast, so this is a practice level with the fair bars, not an aim test)
  charges: { tnt: 40 },
  hint: 'A:z-', tip: '', dud: 'Not yet. Dark piers need more TNT!',
  ftip: 'Dark legs take more TNT. Look round the back.',
  lesson: { check: [[]] }
};
lvl.sol = [T('A:z-', 0, 0), T('A:z-', 0, 0), T('A:z-', 0, 1), T('A:z-', 0, 1), T('B:z+', 0, 0), T('C:z+', 0, 0)];
lvl.bot = { hints: [['A', 'A:z-', 2], ['A', 'A:z-', 2], ['A', 'B:z+', 1], ['A', 'C:z+', 1]] };
lvl.hero = lvl.parts.map(p => p.id).join(',');
lvl.tntStart = E('TNT', 15);
// batch 2 (23/11, SLOTS-50 slot 18, D-blast-L50): CONV=1 (default) = members launched later than slot 18 become earlier ones
// (P.conv in pipeline7/engine.js re-keys and re-tints them); no heavy piece, no hard7 scoring, one blast. CONV=0 = the 22/11 build.
if (E('CONV', 1)) {
  lvl.parts.forEach(p => { p.conv = { rc: 'concrete', rcs: 'concrete' }; });
  lvl.parts.forEach(p => { if (p.heavy) p.heavy = 0; }); delete lvl.hard7;
  lvl.ftip = 'It falls where the legs go. Look round.';
  lvl.batch = 2; lvl.launch = { el: ['wood', 'brick', 'concrete', 'rotate'], slot: 18, before: ['wood', 'brick', 'concrete', 'dark', 'heavy', 'rotate'] };
}
if (!E('NOPAD', 0)) centre(lvl);   // D-blast-PAD (Khai 23/11): the scene centred on the sand pad (a rigid shift)
writeFileSync(new URL('./level.json', import.meta.url), JSON.stringify([lvl], null, 1));
console.log('ok O18');
