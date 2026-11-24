// E13 "Radio Mast" (easy pack 3, Normal; SLOTS-50 NEW-3, play slot 46). Lesson: cut the concrete, the steel falls, then clean up.
// Kit g7xMast (pipeline7/engine.js, g7 EASY 3) + g7gshed (E02 kit, timber) + g7kiosk (E04 kit, timber). One axis (z): the mast on
// four grey concrete plinths, the long timber transmitter hall in front of it (its landing; it hides the plinths from the street: a turn shows them), a timber hut each side. TNT does
// nothing to the steel lattice; two plinths side by side drop the mast across the hall (one fall, two buildings); the steel
// that lands needs one more blast. Elements (all launched by 46): wood, concrete, steel, steps.
import { writeFileSync } from 'node:fs';
const E = (k, d) => process.env[k] != null ? +process.env[k] : d;
const T = (sel, f, i) => ['tnt', sel, f || 0, i || 0];
const MX = E('MX', 2.6), SZ = E('SZ', 7.6), KX = 1.8, kx = E('KX', 7.2);
const lvl = {
  name: 'Radio Mast', bp: 'E13', tier: 'N', slot: 46, f: 7, kind: 'scene', hero: 'A', heroId: 'G7-E13', teaches: 'steel-steps',
  target: 0.85, yaw: E('YAW', 0.1), d: 1, fillMax: 0.73,
  hard7: true,
  hit7: { keys: ['wpost', 'wwall', 'mdW', 'g7roofL'], armor: 0.001, f: E('HF', 3), reach: 1.0 },
  sf: [], pattern: 'steel + steps: a steel mast on grey concrete plinths; cut two plinths side by side and it falls across the timber hall; the steel on the ground takes a second blast',
  parts: [
    { id: 'A', kind: 'g7xMast', x: 0, z: -2, hx: MX, ph: 2.2, n: E('NS', 4), sh: E('SH', 4.0), hold: E('HOLD', 2.0), bg: 171 },
    { id: 'B', kind: 'g7gshed', x: 0, z: SZ, hx: E('SX', 5.0), hz: 2.6, nx: 4, side: 1, bg: 172 },
    { id: 'C', kind: 'g7kiosk', x: -kx, z: -2, hx: KX, mat: 'wood', bg: 173 },
    { id: 'D', kind: 'g7kiosk', x: kx, z: -2, hx: KX, mat: 'wood', bg: 174 }
  ],
  tanks: [],
  charges: { tnt: 40 },
  tip: '',
  ftip: 'TNT cannot cut steel. Cut what holds it.',
  sol: [T('A:z+', 0, 0), T('A:z+', 0, 1)]
};
lvl.tntStart = E('TNT', 15);   // first gate 23/11 (this layout): fair 3/3 at 15, spare 3-5, 2 blasts   // gate 23/11: fair 3/3, spare 3-5
// D-blast-PAD (Khai 23/11): every building stands inside the sand pad, the lot centred on the pad centre (0, 0): OX / OZ move the whole lot
const padShift = (l, ox, oz) => { const r = (v) => +(+v).toFixed(2); l.parts.forEach(p => { p.x = r(p.x + ox); p.z = r(p.z + oz); }); (l.keeps || []).forEach(k => { k.x = r(k.x + ox); k.z = r(k.z + oz); }); l.tanks = (l.tanks || []).map(([x, z]) => [r(x + ox), r(z + oz)]); };
if (process.env.SLOT50 !== '0') padShift(lvl, +(process.env.OX ?? 0), +(process.env.OZ ?? -2.8));
writeFileSync(new URL('./level.json', import.meta.url), JSON.stringify([lvl], null, 1));
console.log('ok E13');
