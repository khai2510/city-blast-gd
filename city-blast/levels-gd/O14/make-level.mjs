// O14 "Seaside Hotel" (old-polish, play slot 14, replaces old L11 "Shell Hall"; the "Blast again!" moment, blast in steps, starts
// here). Lesson: one blast is not always enough: the hotel's legs stand inside a ring of low wings, out of reach from every side, so
// the first blast opens a wing and the second drops the hotel. See 1-GD-SPEC.md. Kit g7oHotel / g7oTicket (pipeline7/engine.js,
// g7 OLD POLISH). Wood + concrete. One axis (z): the hotel slab in the middle of a courtyard, a timber wing on each of its four sides
// (front and back the same, left and right the same, the same gap all round). The hotel falls across the wing that was opened.
import { writeFileSync } from 'node:fs';
const E = (k, d) => process.env[k] != null ? +process.env[k] : d;
const TZ = E('TZ', -4), HX = E('HX', 4.2), HZ = 3.0, G = E('G', 0.8), WD = E('WD', 2.4), WX = HX + G + WD + 0.2, WZ = HZ + G + WD + 0.2;
const T = (sel, f, i) => ['tnt', sel, f || 0, i || 0];
const lvl = {
  name: 'Seaside Hotel', bp: 'O14', slot: 14, replaces: 'o11', tier: process.env.TIER || 'N', f: 12, kind: 'scene', hero: 'A', heroId: 'G7-O14', teaches: 'steps',
  target: 0.85, yaw: 0, d: 1,
  base: { A: { preset: 'stiff-tip', shove: E('SHOVE', 2.5) }, '*': 'weak' },
  sf: [], pattern: 'blast in steps: the hotel legs are inside a ring of wings: open a wing first, then drop the hotel across it',
  parts: [
    { id: 'A', kind: 'g7oHotel', x: 0, z: TZ, hx: HX, hz: HZ, h: 3.0, nl: E('NL', 3), nu: E('NU', 3), bg0: 95 },
    { id: 'S', kind: 'g7oTicket', x: 0, z: TZ + WZ, hx: WX + WD, hz: WD, nb: E('NB', 2) },
    { id: 'D', kind: 'g7oTicket', x: 0, z: TZ - WZ, hx: WX + WD, hz: WD, nb: E('NB', 2) },
    { id: 'B', kind: 'g7oTicket', x: -WX, z: TZ, hx: WD, hz: WZ - WD - 0.2, nb: E('NB', 2) },
    { id: 'C', kind: 'g7oTicket', x: WX, z: TZ, hx: WD, hz: WZ - WD - 0.2, nb: E('NB', 2) }
  ],
  charges: { tnt: 40 },
  hint: 'S:z+', tip: '', dud: 'Not yet. Two legs side by side!',
  ftip: 'One blast is not always enough. Blast again.',
  lesson: { check: [[]] }, dbl: 1
};
lvl.sol = [T('S:z+', 0, 1), T('S:z+', 0, 2), T('A:z+', 0, 1), T('A:z+', 0, 2), T('B:z+', 0, 0), T('C:z+', 0, 0), T('D:z+', 0, 1)];
lvl.bot = { hints: [['A', 'S:z+', 1], ['A', 'S:z+', 1], ['A', 'A:z+', 1], ['A', 'A:z+', 1]] };
lvl.hero = lvl.parts.map(p => p.id).join(',');
lvl.tntStart = E('TNT', 20);
writeFileSync(new URL('./level.json', import.meta.url), JSON.stringify([lvl], null, 1));
console.log('ok O14 wings at x ±' + WX.toFixed(1) + ' z ' + (TZ + WZ).toFixed(1) + ' / ' + (TZ - WZ).toFixed(1));
