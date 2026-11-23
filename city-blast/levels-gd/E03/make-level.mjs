// E03 "Tram Depot" (easy pack, Normal, FEEL). Lesson: red drums blast for free. See 1-GD-SPEC.md. Kit g7depot / g7cabin (pipeline7/engine.js).
// One axis (x): the depot in the middle (three brick tram sheds side by side), a signal cabin at each end, the same size,
// the same gap, fronts in line. A row of red drums runs along the depot front, one drum every 2.1 m: one TNT next to any
// drum sets the whole row off, the row takes the front piers, and the sheds tip forward one after another (the chain).
// The heavy roof pieces (water tanks, vent lantern) land whole and still count: the second, easy wave.
import { writeFileSync } from 'node:fs';
const N = +(process.env.NS || 3), hx = +(process.env.HX || (process.env.SLOT50 !== '0' ? 3.4 : 3.8)), hz = 7, gap = 0.1, W = N*2*hx + (N - 1)*gap;
const CG = +(process.env.CG || (process.env.SLOT50 !== '0' ? 1.2 : 2.0)), CH = 2.3, cx = W/2 + CG + CH;              // cabin centre
const DS = +(process.env.DS || 2.1), nd = Math.floor((W - 1) / DS) + 1, d0 = -(nd - 1)*DS/2, dz = hz + 0.55;
const tanks0 = [...Array(nd)].map((_, i) => [+(d0 + i*DS).toFixed(2), dz]);
// SLOTS-50: no heavy roof pieces any more, so one TNT by a full-length drum row won the level (oneBomb 82 %): the drums stand only in front of
// the two outer sheds (one TNT sets off one group: one shed and a half), the middle shed takes its own TNT
const tanks = process.env.SLOT50 !== '0' ? tanks0.filter(([x]) => Math.abs(x) > hx + 0.2) : tanks0;
// SLOTS-50 (D-blast-L50, 23/11): play slot 25 (R teach of the red drums: the heavy roof tanks / vent lanterns are plain (no heavy piece before 50), one blast). SLOT50=0 = the 22/11 level.
const S50 = process.env.SLOT50 !== '0';
const T = (sel, f, i) => ['tnt', sel, f || 0, i || 0];
const lvl = {
  name: 'Tram Depot', bp: 'E03', tier: 'N', slot: S50 ? 25 : undefined, f: 7, kind: 'scene', hero: 'A', heroId: 'G7-E03', teaches: 'drums',
  target: 0.85, yaw: +(process.env.YAW || 0.12), d: 1, fillMax: 0.73,
  hard7: true, hit7: { keys: [], drums: true },
  sf: [], pattern: 'drums: a row of red drums along the depot front; one TNT sets the row off and the sheds tip forward one by one; the heavy roof pieces land whole and need one more',
  parts: [
    { id: 'A', kind: 'g7depot', x: 0, z: 0, n: N, hx, hz, ph: +(process.env.PH || 8.5), hold: 1.2, bg0: 61, hw: +(process.env.HW || 1.5), ...(S50 ? { heavyKey: 'g7roofL' } : {}) },
    { id: 'B', kind: 'g7cabin', x: -cx, z: 1.0, hx: CH, hz: 3.0, nb: 2, side: -1, bg: 66 },
    { id: 'C', kind: 'g7cabin', x: cx, z: 1.0, hx: CH, hz: 3.0, nb: 2, side: 1, bg: 67 }
  ],
  tanks,
  charges: { tnt: 40 },
  tip: '',
  ftip: S50 ? 'Red drums blast for free.' : 'Red drums blast for free. Heavy pieces still count.',
  sol: S50 ? [T('A:z+', 0, 0), T('A:z+', 0, 4), T('A:z+', 0, 8), T('B:z+', 0, 0), T('C:z+', 0, 0)] : []
};
lvl.tntStart = +(process.env.TNT || (S50 ? 11 : 19));   // SLOTS-50 gate 23/11: fair 3/3 at 11 (at 10 one seed kept 0)
// D-blast-PAD (Khai 23/11): every building stands inside the sand pad, the lot centred on the pad centre (0, 0): OX / OZ move the whole lot
const padShift = (l, ox, oz) => { const r = (v) => +(+v).toFixed(2); l.parts.forEach(p => { p.x = r(p.x + ox); p.z = r(p.z + oz); }); (l.keeps || []).forEach(k => { k.x = r(k.x + ox); k.z = r(k.z + oz); }); l.tanks = (l.tanks || []).map(([x, z]) => [r(x + ox), r(z + oz)]); };
if (process.env.SLOT50 !== '0') padShift(lvl, +(process.env.OX ?? 0), +(process.env.OZ ?? -0.5));
writeFileSync(new URL('./level.json', import.meta.url), JSON.stringify([lvl], null, 1));
console.log('ok', 'W', W.toFixed(1), 'cabins at ±' + cx.toFixed(2), nd + ' drums from ' + d0.toFixed(2));
