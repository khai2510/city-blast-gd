// O12 "Drive-in" (old-polish, play slot 12, replaces old L21 "The Stepper"; the Wrecking Ball's first use, its card + forced tap
// stay on this slot). Lesson: the screen stands on a row of concrete footings; two side by side and the whole wall falls. See
// 1-GD-SPEC.md. Kit g7oScreen / g7oBooth / g7oTicket (pipeline7/engine.js, g7 OLD POLISH). Wood + concrete + steel. One axis (x):
// the big screen in the middle, the projection booth and snack bar in front of it on the axis (the landing), a timber diner each
// side (same size, same gap, fronts in line). A Ball swing through the screen panels is the other way in (no hint).
import { writeFileSync } from 'node:fs';
const E = (k, d) => process.env[k] != null ? +process.env[k] : d;
const TZ = E('TZ', -8), CX = E('CX', 10.4), SZ = E('SZ', -3.2);
const T = (sel, f, i) => ['tnt', sel, f || 0, i || 0];
const lvl = {
  name: 'Drive-in', bp: 'O12', slot: 12, replaces: 'o21', tier: process.env.TIER || 'N', f: 12, kind: 'scene', hero: 'A', heroId: 'G7-O12', teaches: 'wreck',
  target: 0.85, yaw: 0, d: 1,
  base: { A: { preset: 'stiff-tip', shove: E('SHOVE', 2.5) }, '*': 'weak' },
  sf: [], pattern: 'a wide screen on a row of concrete footings: two side by side drop it forward across the booth; the diners take their own pier',
  parts: [
    { id: 'A', kind: 'g7oScreen', x: 0, z: TZ, hx: E('HX', 5.4), hz: 1.6, fh: 2.2, sh: E('SH', 4.4), nx: 4 },
    { id: 'S', kind: 'g7oBooth', x: 0, z: SZ, hx: E('SHX', 4.6), hz: 2.2, h: 3.0 },
    { id: 'B', kind: 'g7oTicket', x: -CX, z: TZ + 1.0, hx: 2.6, hz: 2.8, nb: 2 },
    { id: 'C', kind: 'g7oTicket', x: CX, z: TZ + 1.0, hx: 2.6, hz: 2.8, nb: 2 }
  ],
  charges: { tnt: 40 },
  hint: 'A:z+', tip: '', dud: 'Not yet. Two legs side by side!',
  ftip: 'A wall stands on its feet. Two side by side.',
  lesson: { check: [[]] }
};
lvl.sol = [T('A:z+', 0, 1), T('A:z+', 0, 2), T('B:z+', 0, 0), T('C:z+', 0, 0)];
lvl.bot = { hints: [['A', 'A:z+', 1], ['A', 'A:z+', 1], ['A', 'B:z+', 1], ['A', 'C:z+', 1]] };
lvl.hero = lvl.parts.map(p => p.id).join(',');   // the opening frames every building (main/frame.js heroIds), not only the main one
lvl.tntStart = E('TNT', 9);
writeFileSync(new URL('./level.json', import.meta.url), JSON.stringify([lvl], null, 1));
console.log('ok O12');
