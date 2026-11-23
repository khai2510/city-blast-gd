// E04 "Market Hall" (easy pack, Normal, TEACH). Lesson: wood falls easily, brick is a shield. See 1-GD-SPEC.md.
// Kit g7mhall / g7arcade / g7kiosk (pipeline7/engine.js). One axis (x): the covered timber market (three sections on timber
// posts) in the middle, a small brick weigh house at each end (same size, same gap). A two-storey brick arcade stands in
// front of the market, as long as it: it hides the timber posts from the street. A TNT on brick takes one pier; a TNT on the
// timber takes every post within ~3 m and a whole section folds. The arcade stands far enough out (4 m from its face to the
// posts) that a bomb on it never reaches the timber.
import { writeFileSync } from 'node:fs';
const ns = 3, hx = +(process.env.HX || 3.0), hz = 6, W = ns*2*hx + (ns - 1)*0.1, AG = +(process.env.AG || 2.8), AD = 1.2, az = hz + AG + AD/2;
const KX = 2.4, KG = +(process.env.KG || 2.5), kx = W/2 + KG + KX;
// SLOTS-50 (D-blast-L50, 23/11): play slot 3, tutorial, wood only (wood launches at 1, brick at 4). The brick arcade is a timber stall
// row, the brick weigh houses are timber, the clerestory is boarded (no glass before 20), the tiled roof is plain (no heavy piece
// before 50), no drop7, one blast, tutorial TNT (D-blast-K2: 4-6). SLOT50=0 = the 22/11 level.
const S50 = process.env.SLOT50 !== '0';
const T = (sel, f, i) => ['tnt', sel, f || 0, i || 0];
const lvl = {
  name: 'Market Hall', bp: 'E04', tier: S50 ? 'T' : 'N', slot: S50 ? 3 : undefined, f: 7, kind: 'scene', hero: 'A', heroId: 'G7-E04', teaches: 'materials',
  target: 0.85, yaw: +(process.env.YAW || 0.12), d: 1, fillMax: 0.73,
  hard7: true,
  drop7: S50 ? undefined : { keys: ['mdB'], fall: 1.5, armor: 0.97 },
  sf: [], pattern: 'materials: a timber market (one TNT folds a section) behind a brick arcade (one TNT chips one pier); brick weigh houses at the ends',
  parts: [
    Object.assign({ id: 'A', kind: 'g7mhall', x: 0, z: 0, n: ns, hx, hz, ph: 5.4, ch: 2.6, rh: 1.6, bg0: 91 }, S50 ? { clere: 1, roofKey: 'g7tile' } : {}),
    Object.assign({ id: 'B', kind: 'g7arcade', x: 0, z: az, n: 6, len: W, d: AD, pw: 0.95, h1: 5.0, h2: 3.6, bg: 95 }, S50 ? { mat: 'wood', pw: 0.7 } : {}),
    Object.assign({ id: 'C', kind: 'g7kiosk', x: -kx, z: 0, hx: KX, bg: 96 }, S50 ? { mat: 'wood' } : {}),
    Object.assign({ id: 'D', kind: 'g7kiosk', x: kx, z: 0, hx: KX, bg: 97 }, S50 ? { mat: 'wood' } : {})
  ],
  tanks: [],
  charges: { tnt: 40 },
  tip: '',
  ftip: S50 ? 'One TNT on timber folds a whole section.' : 'Wood falls easy. Brick chips. Roofs still count.',
  sol: S50 ? [T('A:z+', 0, 1), T('A:z+', 0, 4), T('A:z+', 0, 7), T('B:z+', 0, 1), T('B:z+', 0, 5)] : []
};
lvl.tntStart = +(process.env.TNT || (S50 ? 6 : 19));
if (S50) lvl.parts = lvl.parts.filter(p => p.id === 'A' || p.id === 'B');   // slot 3: the hall and its stall row only (the tutorial budget pays for two buildings, and the lot fits the pad)
// D-blast-PAD (Khai 23/11): every building stands inside the sand pad, the lot centred on the pad centre (0, 0): OX / OZ move the whole lot
const padShift = (l, ox, oz) => { const r = (v) => +(+v).toFixed(2); l.parts.forEach(p => { p.x = r(p.x + ox); p.z = r(p.z + oz); }); (l.keeps || []).forEach(k => { k.x = r(k.x + ox); k.z = r(k.z + oz); }); l.tanks = (l.tanks || []).map(([x, z]) => [r(x + ox), r(z + oz)]); };
if (process.env.SLOT50 !== '0') padShift(lvl, +(process.env.OX ?? 0), +(process.env.OZ ?? -2));
writeFileSync(new URL('./level.json', import.meta.url), JSON.stringify([lvl], null, 1));
console.log('ok', 'W', W.toFixed(1), 'arcade z', az.toFixed(2), 'kiosks ±' + kx.toFixed(2));
