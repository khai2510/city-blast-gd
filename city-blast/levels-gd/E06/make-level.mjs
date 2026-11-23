// E06 "Boiler Stack" (easy pack, Normal, COMBINE: legs + direction). See 1-GD-SPEC.md. Kit g7stack / g7boil (pipeline7/engine.js).
// One axis (x): a brick chimney on legs at the left, the boiler house (two brick bays) beside it, an empty yard on the far side.
// The chimney stands on 8 legs (E01: hit the legs; E02: two side by side tip it that way). Opened on the side facing the boiler
// house it lies down along the roof: one fall wrecks two buildings. Opened the other way it lands on the empty yard.
import { writeFileSync } from 'node:fs';
const nb = +(process.env.NB || 2), bw = 3.6, W = nb*2*bw + (nb - 1)*0.1, BX = 2.9, G = +(process.env.G || 2.0), cx = W/2 + G + BX;
// SLOTS-50 (D-blast-L50, 23/11): play slot 9 (N, wood + brick + concrete: the RC legs are brick, the feed-water tank plain (no heavy piece before 50), no drop7, one blast). SLOT50=0 = the 22/11 level.
const S50 = process.env.SLOT50 !== '0';
const T = (sel, f, i) => ['tnt', sel, f || 0, i || 0];
const lvl = {
  name: 'Boiler Stack', bp: 'E06', tier: 'N', slot: S50 ? 9 : undefined, f: 7, kind: 'scene', hero: 'A', heroId: 'G7-E06', teaches: 'aim',
  target: 0.85, yaw: +(process.env.YAW || 0.12), d: 1, fillMax: 0.73,
  hard7: true,
  // floors (mdB, mdC) shrug off TNT while they stand (a bomb on the chimney shaft takes a wall, never a floor), and crack
  // with one TNT once they lie in the heap (drop7 as plumbing, as E01/E02)
  drop7: S50 ? undefined : { keys: ['mdB', 'mdC'], fall: 1.5, armor: 0.97 },
  // a falling tower crushes what it lands on (hit7 with armor 0.001, never 0: 0 falls back to 0.97 in engine.js; TNT works as usual on these members; a heavy body of
  // another part landing hard within reach breaks them)
  hit7: { keys: ['bk', 'bkw', 'mdB', 'g7roofL'], armor: 0.001, f: +(process.env.HF || 3), reach: 1.0 },
  sf: [], pattern: 'aim: a chimney on legs at the end of a boiler house; tipped towards it the chimney lies along the boiler-house roof (one fall, two buildings); tipped away it hits the empty yard',
  parts: [
    { id: 'A', kind: 'g7stack', x: -cx, z: 0, bx: BX, legH: 4.6, n: +(process.env.NS || 5), sh: 3.1, hold: 2.0, bg: 51, ...(S50 ? { legKey: 'bk' } : {}) },
    { id: 'B', kind: 'g7boil', x: 0, z: 0, n: nb, bw, hz: 6, ph: 7.0, bg0: 52, heavy: 1, ...(S50 ? { heavyKey: 'g7roofL' } : {}) }
  ],
  tanks: [],
  charges: { tnt: 40 },
  tip: '',
  ftip: S50 ? 'Open the side it should fall.' : 'Open the side it should fall. Tanks still count.',
  sol: S50 ? [T('A:x+', 0, 0), T('A:x+', 0, 1), T('B:z+', 0, 0), T('B:z+', 0, 2)] : []
};
lvl.tntStart = +(process.env.TNT || (S50 ? 11 : 17));   // SLOTS-50 gate 23/11: fair 3/3 at 11, spare 2
// D-blast-PAD (Khai 23/11): every building stands inside the sand pad, the lot centred on the pad centre (0, 0): OX / OZ move the whole lot
const padShift = (l, ox, oz) => { const r = (v) => +(+v).toFixed(2); l.parts.forEach(p => { p.x = r(p.x + ox); p.z = r(p.z + oz); }); (l.keeps || []).forEach(k => { k.x = r(k.x + ox); k.z = r(k.z + oz); }); l.tanks = (l.tanks || []).map(([x, z]) => [r(x + ox), r(z + oz)]); };
if (process.env.SLOT50 !== '0') padShift(lvl, +(process.env.OX ?? 3.9), +(process.env.OZ ?? 0));
writeFileSync(new URL('./level.json', import.meta.url), JSON.stringify([lvl], null, 1));
console.log('ok', 'W', W.toFixed(1), 'stacks at ±' + cx.toFixed(2));
