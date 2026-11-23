// O14 "Seaside Hotel" (old-polish, play slot 14, replaces old L11 "Shell Hall"; the "Blast again!" moment, blast in steps, starts
// here). Lesson: one blast is not always enough: the hotel's legs stand inside a ring of low wings, out of reach from every side, so
// the first blast opens a wing and the second drops the hotel. See 1-GD-SPEC.md. Kit g7oHotel / g7oTicket (pipeline7/engine.js,
// g7 OLD POLISH). Wood + concrete. One axis (z): the hotel slab in the middle of a courtyard, a timber wing on each of its four sides
// (front and back the same, left and right the same, the same gap all round). The hotel falls across the wing that was opened.
import { writeFileSync } from 'node:fs';
import { centre } from '../pad-centre.mjs';
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
// batch 2 (23/11, SLOTS-50 slot 35: "Blast again: the upper block lands whole"; D-blast-L50: wood / brick / concrete / blue / glass /
// barrels / steps). V3=1 (default): the two-block hotel tips FORWARD onto a two-storey timber beach hall right in front; the upper
// block (tough frame, its own bond group) lands whole ON the hall's roof and stays up there (a fallen piece high up still counts),
// so the first blast ends short; the second blast drops the hall and the block with it. A blue beach house left, a villa right.
// V3=0 = the 22/11 courtyard build (oneBomb 76 %).
if (E('V3', 1)) {
  const TZ3 = E('TZ', -8), HX3 = E('HX', 4.0), HZ3 = 3.0, LZ = TZ3 + HZ3 + E('LG', 0.8) + 3.0, CX3 = E('CX', 10.8);
  lvl.parts = [
    { id: 'A', kind: 'g7oHotel', x: 0, z: TZ3, hx: HX3, hz: HZ3, h: 3.0, nl: E('NL', 2), nu: E('NU', 4), bg0: 95, tough: E('TOUGH', 1) },
    { id: 'S', kind: 'g7oTicket', x: 0, z: LZ, hx: E('SHX', 5.4), hz: 3.0, nb: E('NB', 3) },
    { id: 'C', kind: 'g7oCott', x: CX3, z: TZ3 + 0.6, hx: 3.2, hz: 2.8, side: 1 } ];
  lvl.keeps = [{ kind: 'keep6', x: -CX3, z: TZ3 + 0.6, floors: 2, cx: 3, cz: 3, name: 'the school', role: 'school', fixType: 'school' }];
  lvl.keep = { name: 'the school', sides: [], type: 'school', role: 'school', full: 1 };
  lvl.base = { A: { preset: 'stiff-tip', shove: E('SHOVE', 2.5) }, '*': 'weak' };
  lvl.pattern = 'blast in steps: the hotel tips onto the beach hall; its upper block lands whole on the hall roof; blast again';
  lvl.sol = [T('A:z+', 0, 0), T('A:z+', 0, 1), T('C:z+', 0, 0)];
  lvl.solW = [[T('S:z+', 0, 0), T('S:z+', 0, 1)]];
  lvl.bot = { hints: [['A', 'A:z+', 1], ['A', 'A:z+', 1], ['A', 'C:z+', 1], ['A', 'S:z+', 2]] };
  lvl.hero = 'A,S,C';
  lvl.tntStart = E('TNT', 14);
  lvl.batch = 2; lvl.launch = { el: ['wood', 'brick', 'concrete', 'blue', 'steps'], slot: 35, before: ['wood', 'concrete', 'steps'] };
}
if (!E('NOPAD', 0)) centre(lvl);   // D-blast-PAD (Khai 23/11): the scene centred on the sand pad (a rigid shift)
writeFileSync(new URL('./level.json', import.meta.url), JSON.stringify([lvl], null, 1));
console.log('ok O14 wings at x ±' + WX.toFixed(1) + ' z ' + (TZ + WZ).toFixed(1) + ' / ' + (TZ - WZ).toFixed(1));
