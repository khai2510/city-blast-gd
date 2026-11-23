// E12 "Telephone Exchange" (easy pack 3, Normal rise; SLOTS-50 NEW-2, play slot 38). Lesson: lower block first, the upper lands safe.
// Kit g7xExch (pipeline7/engine.js, g7 EASY 3) + g7kiosk (E04 kit, timber). One axis (x): the exchange in the middle (a three-storey
// concrete lower block, a two-storey set-back upper block in its own bond group), a school (blue) on the right at a fair gap, a
// timber cable store on the left. Blast the lower block's columns and the upper block comes down whole onto the heap (it lands
// safe, in place); a second blast clears it. Blast high, or everything at once, and the upper block is thrown towards the school.
// Elements (all launched by 38): concrete, wood, glass decor, blue, steps.
import { writeFileSync } from 'node:fs';
const E = (k, d) => process.env[k] != null ? +process.env[k] : d;
const T = (sel, f, i) => ['tnt', sel, f || 0, i || 0];
const HX = E('HX', 4.2), SG = E('SG', 3.4), KX = 1.9;
const lvl = {
  name: 'Telephone Exchange', bp: 'E12', tier: 'N', slot: 38, f: 7, kind: 'scene', hero: 'A', heroId: 'G7-E12', teaches: 'blocks',
  target: 0.85, yaw: E('YAW', 0.1), d: 1, fillMax: 0.73,
  hard7: true,
  sf: [], pattern: 'separate blocks: the upper block rides down on the lower one and lands whole; lower block first (it lands in place), then the upper; a blast up high throws it at the school',
  parts: [
    { id: 'A', kind: 'g7xExch', x: 0, z: 0, hx: HX, hz: HX, nl: E('NL', 2), nu: E('NU', 3), sh: 3.2, ux: 2.8, uz: 2.8, hold: E('HOLD', -1), bg: 161 },
    { id: 'B', kind: 'g7kiosk', x: -(HX + SG + KX), z: 0, hx: KX, mat: 'wood', bg: 165 }
  ],
  keeps: [ { kind: 'keep6', x: +(HX + SG + 3).toFixed(2), z: 0, floors: 2, cx: 3, cz: 2, name: 'the school', role: 'school', fixType: 'school' } ],
  keep: { name: 'the school', sides: [], type: 'school', role: 'school', full: 1 },
  tanks: [],
  charges: { tnt: 40 },
  tip: '',
  ftip: 'Lower block first. The upper one lands safe.',
  sol: [T('A:z+', 0, 0), T('A:z+', 0, 1), T('A:z+', 0, 2)]
};
lvl.tntStart = E('TNT', 10);   // gate 23/11: fair 3/3, spare 2, 2 blasts
// D-blast-PAD (Khai 23/11): every building stands inside the sand pad, the lot centred on the pad centre (0, 0): OX / OZ move the whole lot
const padShift = (l, ox, oz) => { const r = (v) => +(+v).toFixed(2); l.parts.forEach(p => { p.x = r(p.x + ox); p.z = r(p.z + oz); }); (l.keeps || []).forEach(k => { k.x = r(k.x + ox); k.z = r(k.z + oz); }); l.tanks = (l.tanks || []).map(([x, z]) => [r(x + ox), r(z + oz)]); };
if (process.env.SLOT50 !== '0') padShift(lvl, +(process.env.OX ?? -1.2), +(process.env.OZ ?? 0));
writeFileSync(new URL('./level.json', import.meta.url), JSON.stringify([lvl], null, 1));
console.log('ok E12');
