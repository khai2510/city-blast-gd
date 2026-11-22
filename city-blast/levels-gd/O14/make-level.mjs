// O14 "Seaside Hotel" (old-polish, play slot 14, replaces old L11 "Shell Hall"; the "Blast again!" moment, blast in steps, starts
// here). Lesson: one blast is not always enough: the upper block rides down whole and needs its own. See 1-GD-SPEC.md. Kit g7oHotel /
// g7oHuts / g7oCott (pipeline7/engine.js, g7 OLD POLISH); the blue beach house is the game's keep6. Wood + concrete (+ blue).
// One axis (x): the hotel in the middle (a lower block and an upper block that only rests on it), the bathing huts in front of it
// on the axis, the blue beach house on the left and a villa on the right (same size, same gap, fronts in line).
import { writeFileSync } from 'node:fs';
const E = (k, d) => process.env[k] != null ? +process.env[k] : d;
const TZ = E('TZ', -8), CX = E('CX', 9.8), SZ = E('SZ', 4.4);
const T = (sel, f, i) => ['tnt', sel, f || 0, i || 0];
const lvl = {
  name: 'Seaside Hotel', bp: 'O14', slot: 14, replaces: 'o11', tier: process.env.TIER || 'N', f: 12, kind: 'scene', hero: 'A', heroId: 'G7-O14', teaches: 'steps',
  target: 0.85, yaw: 0, d: 1,
  base: { A: { preset: 'stiff-tip', shove: E('SHOVE', 2.5) }, '*': 'weak' },
  sf: [], pattern: 'blast in steps: the foot drops the lower block, the upper block rides down nearly whole onto the heap; a second blast clears it',
  parts: [
    { id: 'A', kind: 'g7oHotel', x: 0, z: TZ, hx: E('HX', 4.2), hz: 3.0, h: 3.0, nl: E('NL', 3), nu: E('NU', 3), bg0: 95, tough: E('TOUGH', 1) },
    { id: 'S', kind: 'g7oHuts', x: 0, z: SZ, n: 5, w: 1.8, hz: 1.4, h: 2.4 },
    { id: 'C', kind: 'g7oCott', x: CX, z: TZ + 0.6, hx: 3.2, hz: 2.8, side: 1 }
  ],
  keeps: [{ kind: 'keep6', x: -CX, z: TZ + 0.6, floors: 3, cx: 2, cz: 2, name: 'the beach house', role: 'school', fixType: 'school' }],
  keep: { name: 'the beach house', sides: [], type: 'school', role: 'school', full: 1 },
  charges: { tnt: 40 },
  hint: 'A:z+', tip: '', dud: 'Not yet. Two legs side by side!',
  ftip: 'One blast is not always enough. Blast again.',
  lesson: { check: [[]] }
};
lvl.sol = [T('A:z+', 0, 1), T('A:z+', 0, 2), T('C:z+', 0, 0)];
lvl.solWaves = 2;
lvl.bot = { hints: [['A', 'A:z+', 1], ['A', 'A:z+', 1], ['A', 'C:z+', 1]] };
lvl.hero = 'A,S,C';
lvl.tntStart = E('TNT', 9);
writeFileSync(new URL('./level.json', import.meta.url), JSON.stringify([lvl], null, 1));
console.log('ok O14');
