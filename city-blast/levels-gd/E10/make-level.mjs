// E10 "Rail Terminus" (easy pack finale, Normal, COMBINE: put it together). See 1-GD-SPEC.md. Kit g7term / g7shed.
// One axis (x): the brick head building on 8 legs at the left, the iron-and-glass train shed (4 bays) beside it, red drums at
// the shed's front piers, the school (blue) behind the shed at a safe distance (only a big careless blast reaches it). Two legs on the shed side tip the head
// building into the shed: it crushes the first bays (hit7), the drums go off, the glass roof comes down bay by bay.
import { writeFileSync } from 'node:fs';
const HX = 3.6, HZ = 3.6, G = +(process.env.G || 2.2), NB = +(process.env.NB || 2), BW = 2.3, SW = NB*2*BW + (NB - 1)*0.1, SHZ = 4.5;   // compact lot (Lead 22/11: ≈ 24 m wide at most)
const hxp = -(SW/2 + G + HX), mid = (hxp - HX + SW/2)/2;
const px = [], x0 = -SW/2 + BW; for(let k = 0; k <= NB; k++) px.push(k === 0 ? -SW/2 + 0.4 : k === NB ? SW/2 - 0.4 : x0 + (k - 0.5)*(2*BW + 0.1));
const tanks = px.map(x => [+(x - mid).toFixed(2), SHZ + 0.65]);
const SG = +(process.env.SG || 4.0), SX = +(process.env.SX ?? -mid + 1.5), SZ = +(process.env.SZ || -(SHZ + SG + 1.65));   // school 6 x 3.3 m, square behind the train shed
// SLOTS-50 (D-blast-L50, 23/11): play slot 26 (N, up to the drums: the RC legs are brick, the heavy gables / turret plain (no heavy piece before 50), no drop7, one blast). SLOT50=0 = the 22/11 level.
const S50 = process.env.SLOT50 !== '0';
const T = (sel, f, i) => ['tnt', sel, f || 0, i || 0];
const lvl = {
  name: 'Rail Terminus', bp: 'E10', tier: 'N', slot: S50 ? 26 : undefined, f: 7, kind: 'scene', hero: 'A', heroId: 'G7-E10', teaches: 'combine',
  target: 0.85, yaw: +(process.env.YAW || 0.1), d: 1, fillMax: 0.73,
  hard7: true,
  drop7: S50 ? undefined : { keys: ['mdB'], fall: 1.5, armor: 0.97 },
  // the shed's brick piers, iron decks and glass roofs break when something heavy lands on them (TNT works on them as usual);
  // drums crushed by a falling building go off
  hit7: { keys: ['bk', 'bkw', 'mdW', 'g7tile'], armor: 0.001, f: +(process.env.HF || 3), reach: 1.0, drums: true },
  sf: [], pattern: 'combine: legs + direction + drums + keep: tip the head building into the train shed (drums at its piers go off, the roof comes down bay by bay); the school behind the head building stays clear',
  parts: [
    { id: 'A', kind: 'g7term', x: +(hxp - mid).toFixed(2), z: 0, hx: HX, hz: HZ, legH: 5.0, n: 2, hold: 2.0, side: 1, heavy: +(process.env.HV ?? (S50 ? 0 : 1)), bg: 140, ...(S50 ? { legKey: 'bk' } : {}) },
    { id: 'B', kind: 'g7shed', x: +(-mid).toFixed(2), z: 0, n: NB, bw: BW, hz: SHZ, ph: 6.0, side: 1, train: process.env.TR || null, cars: NB, back: 1, pw: 1.0, roofKey: 'g7tile', bg0: 141 }
  ],
  keeps: [ { kind: 'keep6', x: +SX.toFixed(2), z: SZ, floors: 2, cx: 3, cz: 2, name: 'the school', role: 'school', fixType: 'school' } ],
  keep: { name: 'the school', sides: [], type: 'school', role: 'school', full: 1 },
  tanks,
  charges: { tnt: 40 },
  tip: '',
  ftip: 'Read it first: which legs, which side, what stays.',
  sol: S50 ? [T('A:z+', 0, 0), T('A:z+', 0, 1), T('A:z+', 0, 2), T('A:x+', 0, 0), T('A:x+', 0, 1), T('B:z+', 0, 0), T('B:z+', 0, 1), T('B:z+', 0, 3)] : []   // SLOTS-50 gate: one blast, 86 % with all 8
};
lvl.tntStart = +(process.env.TNT || (S50 ? 8 : 14));   // SLOTS-50 gate 23/11: fair 3/3 at 8, spare 2
// D-blast-PAD (Khai 23/11): every building stands inside the sand pad, the lot centred on the pad centre (0, 0): OX / OZ move the whole lot
const padShift = (l, ox, oz) => { const r = (v) => +(+v).toFixed(2); l.parts.forEach(p => { p.x = r(p.x + ox); p.z = r(p.z + oz); }); (l.keeps || []).forEach(k => { k.x = r(k.x + ox); k.z = r(k.z + oz); }); l.tanks = (l.tanks || []).map(([x, z]) => [r(x + ox), r(z + oz)]); };
if (process.env.SLOT50 !== '0') padShift(lvl, +(process.env.OX ?? -0.4), +(process.env.OZ ?? 3.2));
writeFileSync(new URL('./level.json', import.meta.url), JSON.stringify([lvl], null, 1));
console.log('ok', 'head', (hxp - mid).toFixed(2), 'shed', (-mid).toFixed(2), 'tanks', tanks.map(t => t[0]).join(','), 'school', SX.toFixed(2), SZ);
