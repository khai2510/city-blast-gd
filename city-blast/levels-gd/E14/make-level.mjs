// E14 "Palm House" (easy pack 3, Normal; SLOTS-50 NEW-4, play slot 47). Lesson: drums can't cut steel either.
// Kit g7xPalm (pipeline7/engine.js, g7 EASY 3) + g7kiosk (E04 kit, timber). One axis (x): the glass palm house on a ring of short
// grey concrete bases, steel columns and glass walls above; a timber potting shed each side. Red drums (the boiler's fuel) stand
// against the front bases: set off, they break the concrete bases, never the steel. The house drops onto its bases and the
// steel frame needs a second blast. Elements (all launched by 47): wood, concrete, glass, red drums, steel, steps.
import { writeFileSync } from 'node:fs';
const E = (k, d) => process.env[k] != null ? +process.env[k] : d;
const T = (sel, f, i) => ['tnt', sel, f || 0, i || 0];
const HX = E('HX', 5.0), HZ = E('HZ', 3.6), KX = 1.8, kx = HX + E('KG', 2.2) + KX;
const tanks = [[-HX + 0.6, HZ + 0.6], [0, HZ + 0.6], [HX - 0.6, HZ + 0.6]];
const lvl = {
  name: 'Palm House', bp: 'E14', tier: 'N', slot: 47, f: 7, kind: 'scene', hero: 'A', heroId: 'G7-E14', teaches: 'steel-drums',
  target: 0.85, yaw: E('YAW', 0.1), d: 1, fillMax: 0.73,
  hard7: true, hit7: { keys: [], drums: true },
  sf: [], pattern: 'steel + drums: red drums by the front bases of a steel-and-glass palm house; the drums break the concrete bases, never the steel; the frame takes a second blast',
  parts: [
    { id: 'A', kind: 'g7xPalm', x: 0, z: 0, hx: HX, hz: HZ, bh: E('BH', 1.4), sh: E('SH', 4.4), hold: E('HOLD', 1.2), bg: 181 },
    { id: 'B', kind: 'g7kiosk', x: -kx, z: 0, hx: KX, mat: 'wood', bg: 182 },
    { id: 'C', kind: 'g7kiosk', x: kx, z: 0, hx: KX, mat: 'wood', bg: 183 }
  ],
  tanks,
  charges: { tnt: 40 },
  tip: '',
  ftip: 'Drums cannot cut steel either. Hit the bases.',
  sol: []   // the base row read as 0 % in one blast (the drums need a TNT beside them): the fair player proves the level
};
lvl.tntStart = E('TNT', 12);   // gate 23/11: fair 3/3, spare 2, 2 blasts
// D-blast-PAD (Khai 23/11): every building stands inside the sand pad, the lot centred on the pad centre (0, 0): OX / OZ move the whole lot
const padShift = (l, ox, oz) => { const r = (v) => +(+v).toFixed(2); l.parts.forEach(p => { p.x = r(p.x + ox); p.z = r(p.z + oz); }); (l.keeps || []).forEach(k => { k.x = r(k.x + ox); k.z = r(k.z + oz); }); l.tanks = (l.tanks || []).map(([x, z]) => [r(x + ox), r(z + oz)]); };
if (process.env.SLOT50 !== '0') padShift(lvl, +(process.env.OX ?? 0), +(process.env.OZ ?? -0.5));
writeFileSync(new URL('./level.json', import.meta.url), JSON.stringify([lvl], null, 1));
console.log('ok E14');
