// O05 "Valley Station" (old-polish, play slot 5, replaces old L6 "Dome Square"). Lesson: turn the view (the swipe hand of the rotate
// card): the station falls toward the legs you break, and the legs you see first drop it on the blue house. See 1-GD-SPEC.md.
// Kit g7oCable / g7oTicket / g7oCabin (pipeline7/engine.js, g7 OLD POLISH); the blue is the game's keep6. Wood + concrete (+ blue).
// One axis (z): the blue guest house in front (low, the opening view's fall line), the cable-car station in the middle, the timber
// ticket hall behind it on the axis (the landing); a log lodge each side (same size, same gap, fronts in line).
import { writeFileSync } from 'node:fs';
const E = (k, d) => process.env[k] != null ? +process.env[k] : d;
const TZ = E('TZ', -3), CX = E('CX', 9.0), HZ = E('HZ', -15.5), KZ = E('KZ', 6.5);
const T = (sel, f, i) => ['tnt', sel, f || 0, i || 0];
const lvl = {
  name: 'Valley Station', bp: 'O05', slot: 5, replaces: 'o6', tier: process.env.TIER || 'N', f: 12, kind: 'scene', hero: 'A', heroId: 'G7-O05', teaches: 'rotate',
  target: 0.85, yaw: 0, d: 1,
  base: { A: 'stiff-tip', '*': 'weak' },
  sf: [], pattern: 'rotate: the front legs drop the station on the blue house; turned to the back, two legs drop it onto the ticket hall',
  parts: [
    { id: 'A', kind: 'g7oCable', x: 0, z: TZ, hx: E('HX', 3.2), gh: E('GH', 4.8), sh: E('SH', 3.3), ns: E('NS', 2) },
    { id: 'S', kind: 'g7oTicket', x: 0, z: HZ, hx: E('SHX', 5.0), hz: 3.0, nb: 2 },
    { id: 'B', kind: 'g7oCabin', x: -CX, z: TZ, hx: 3.2, hz: 2.8, side: -1 },
    { id: 'C', kind: 'g7oCabin', x: CX, z: TZ, hx: 3.2, hz: 2.8, side: 1 }
  ],
  keeps: [{ kind: 'keep6', x: 0, z: KZ, floors: E('KF', 1), cx: E('KCX', 4), cz: E('KCZ', 2), name: 'the guest house', role: 'hospital', fixType: 'hospital' }],
  keep: { name: 'the guest house', sides: [], type: 'hospital', role: 'hospital', full: 1 },
  faces: { right: ['z-', 'x+', 'x-'], wrong: ['z+'] },
  charges: { tnt: 40 },
  hint: 'A:z-', tip: '', dud: 'Not yet. Two legs side by side!',
  ftip: 'It falls toward the legs you break. Turn around.',
  lesson: { check: [[T('A:z+', 0, 0), T('A:z+', 0, 1), T('B:z+', 0, 0), T('C:z+', 0, 0)]] }
};
lvl.sol = [T('A:z-', 0, 0), T('A:z-', 0, 1), T('B:z+', 0, 0), T('C:z+', 0, 0)];
lvl.bot = { hints: [['A', 'A:z-', 1], ['A', 'A:z-', 1], ['A', 'B:z+', 1], ['A', 'C:z+', 1]] };
lvl.hero = lvl.parts.map(p => p.id).join(',');   // the opening frames every building (main/frame.js heroIds), not only the main one
lvl.tntStart = E('TNT', 13);
writeFileSync(new URL('./level.json', import.meta.url), JSON.stringify([lvl], null, 1));
console.log('ok O05', 'station z', TZ, 'lodges ±' + CX, 'hall z', HZ, 'blue z', KZ);
