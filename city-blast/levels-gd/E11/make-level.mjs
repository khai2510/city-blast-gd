// E11 "Ice Rink" (easy pack 3, Normal; SLOTS-50 NEW-1, play slot 37). Lesson: break the shield, then the drums.
// Kit g7xRink (pipeline7/engine.js, g7 EASY 3) + g7arcade (E04 kit, brick). One axis (x): the rink hall (three bays on grey
// concrete columns, a glazed clerestory, barrel roofs) with a brick entrance colonnade in front of it, as long as the hall; a
// row of red drums (the ice plant's gas bottles) stands between the colonnade and the hall's front columns. From the street the
// colonnade hides the drums and the columns: blast 1 opens the colonnade, blast 2 sets the drums off and the bays fold forward.
// Elements (all launched by 37): concrete, brick, glass, red drums, steps.
import { writeFileSync } from 'node:fs';
const E = (k, d) => process.env[k] != null ? +process.env[k] : d;
const T = (sel, f, i) => ['tnt', sel, f || 0, i || 0];
const nb = 3, bw = E('BW', 2.9), hz = E('HZ', 4.6), W = nb*2*bw + (nb - 1)*0.1, AG = E('AG', 2.6), AD = 1.1, az = hz + AG + AD/2;
const DZ = hz + E('DZ', 1.0), nd = E('ND', 3), tanks = [...Array(nd)].map((_, i) => [+(-W/2 + 1.6 + i*(W - 3.2)/(nd - 1)).toFixed(2), +DZ.toFixed(2)]);
const lvl = {
  name: 'Ice Rink', bp: 'E11', tier: 'N', slot: 37, f: 7, kind: 'scene', hero: 'A', heroId: 'G7-E11', teaches: 'shield-drums',
  target: 0.85, yaw: E('YAW', 0.1), d: 1, fillMax: 0.73,
  hard7: true, hit7: { keys: [], drums: true },
  sf: [], pattern: 'shield then drums: a brick colonnade hides a row of red drums and the rink hall\'s front columns; open the colonnade, then the drums fold the bays forward',
  parts: [
    { id: 'A', kind: 'g7xRink', x: 0, z: 0, n: nb, bw, hz, ph: E('PH', 5.0), ch: 2.4, hold: E('HOLD', 2.0), upSep: E('UPSEP', 1), bg0: 151 },
    { id: 'B', kind: 'g7arcade', x: 0, z: +az.toFixed(2), n: 6, len: W, d: AD, pw: E('APW', 1.2), h1: E('H1', 5.2), h2: E('H2', 3.6), bg: 155 }
  ],
  tanks,
  charges: { tnt: 40 },
  tip: '',
  ftip: 'Open the shield first. Then let the drums work.',
  sol: [T('B:z+', 0, 1), T('B:z+', 0, 3), T('B:z+', 0, 5)]
};
lvl.tntStart = E('TNT', 9);   // gate 23/11: fair 3/3, spare 2, 2 blasts
// D-blast-PAD (Khai 23/11): every building stands inside the sand pad, the lot centred on the pad centre (0, 0): OX / OZ move the whole lot
const padShift = (l, ox, oz) => { const r = (v) => +(+v).toFixed(2); l.parts.forEach(p => { p.x = r(p.x + ox); p.z = r(p.z + oz); }); (l.keeps || []).forEach(k => { k.x = r(k.x + ox); k.z = r(k.z + oz); }); l.tanks = (l.tanks || []).map(([x, z]) => [r(x + ox), r(z + oz)]); };
if (process.env.SLOT50 !== '0') padShift(lvl, +(process.env.OX ?? 0), +(process.env.OZ ?? -1.8));
writeFileSync(new URL('./level.json', import.meta.url), JSON.stringify([lvl], null, 1));
console.log('ok E11', 'W', W.toFixed(1), 'colonnade z', az.toFixed(2), 'drums', tanks.length);
