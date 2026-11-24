// E15 "Parachute Tower" (easy pack 3, Normal rise; SLOTS-50 NEW-5, play slot 48). Lesson: aim the steel fall, two blasts.
// Kit g7xChute (pipeline7/engine.js, g7 EASY 3) + g7gshed (E02 kit, timber). One axis (x): the steel parachute tower on four grey
// concrete feet in the middle, the brick fun-fair hall on the left (the target, two bays), a school (blue) on the right. Two feet
// side by side on the hall's side drop the tower along the hall; the steel that lands takes a second blast. Opened on the
// school's side it lands on the school. Elements (all launched by 48): brick, concrete, steel, blue, steps.
import { writeFileSync } from 'node:fs';
const E = (k, d) => process.env[k] != null ? +process.env[k] : d;
const T = (sel, f, i) => ['tnt', sel, f || 0, i || 0];
const TX = E('TX', 3.0), SG = E('SG', 2.4), BW = E('BW', 2.4), SX = 2*BW + 0.05, sx = TX + SG + SX;   // the fun-fair hall: two brick bays (E06 kit g7boil): the steel lands on it and breaks the roofs, the brick takes a second blast
const lvl = {
  name: 'Parachute Tower', bp: 'E15', tier: 'N', slot: 48, f: 7, kind: 'scene', hero: 'A', heroId: 'G7-E15', teaches: 'steel-aim',
  target: 0.85, yaw: E('YAW', 0.1), d: 1, fillMax: 0.73,
  hard7: true,
  // no hit7: the tower lands on the hall and breaks its roof, the hall's posts stay for the second blast (the steps)
  sf: [], pattern: 'aim + steel: a steel tower on concrete feet between a timber hall (target) and a school (blue); two feet side by side on the hall side lay it along the hall; the steel takes a second blast',
  parts: [
    { id: 'A', kind: 'g7xChute', x: 0, z: 0, hx: TX, fh: 2.4, n: E('NS', 4), sh: E('SH', 3.8), hold: E('HOLD', 2.0), bg: 191 },
    { id: 'B', kind: 'g7boil', x: -sx, z: 0, n: 2, bw: BW, hz: 3.2, ph: E('BPH', 5.0), bg0: 192 }
  ],
  keeps: [ { kind: 'keep6', x: +(TX + E('KG', 3.2) + 3).toFixed(2), z: 0, floors: 2, cx: 3, cz: 2, name: 'the school', role: 'school', fixType: 'school' } ],
  keep: { name: 'the school', sides: [], type: 'school', role: 'school', full: 1 },
  tanks: [],
  charges: { tnt: 40 },
  tip: '',
  ftip: 'Steel falls where you open it. Keep blue clear.',
  sol: [T('A:x-', 0, 0), T('A:x-', 0, 1)]
};
lvl.tntStart = E('TNT', 11);   // gate 23/11: fair 3/3, spare 2, 2 blasts
// D-blast-PAD (Khai 23/11): every building stands inside the sand pad, the lot centred on the pad centre (0, 0): OX / OZ move the whole lot
const padShift = (l, ox, oz) => { const r = (v) => +(+v).toFixed(2); l.parts.forEach(p => { p.x = r(p.x + ox); p.z = r(p.z + oz); }); (l.keeps || []).forEach(k => { k.x = r(k.x + ox); k.z = r(k.z + oz); }); l.tanks = (l.tanks || []).map(([x, z]) => [r(x + ox), r(z + oz)]); };
if (process.env.SLOT50 !== '0') padShift(lvl, +(process.env.OX ?? 1.6), +(process.env.OZ ?? 0));
writeFileSync(new URL('./level.json', import.meta.url), JSON.stringify([lvl], null, 1));
console.log('ok E15');
