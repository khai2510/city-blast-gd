// E04 "Market Hall" (easy pack, Normal, TEACH). Lesson: wood falls easily, brick is a shield. See 1-GD-SPEC.md.
// Kit g7mhall / g7arcade / g7kiosk (pipeline7/engine.js). One axis (x): the covered timber market (three sections on timber
// posts) in the middle, a small brick weigh house at each end (same size, same gap). A two-storey brick arcade stands in
// front of the market, as long as it: it hides the timber posts from the street. A TNT on brick takes one pier; a TNT on the
// timber takes every post within ~3 m and a whole section folds. The arcade stands far enough out (4 m from its face to the
// posts) that a bomb on it never reaches the timber.
import { writeFileSync } from 'node:fs';
const ns = 3, hx = +(process.env.HX || 3.0), hz = 6, W = ns*2*hx + (ns - 1)*0.1, AG = +(process.env.AG || 2.8), AD = 1.2, az = hz + AG + AD/2;
const KX = 2.4, KG = +(process.env.KG || 2.5), kx = W/2 + KG + KX;
const lvl = {
  name: 'Market Hall', bp: 'E04', tier: 'N', f: 7, kind: 'scene', hero: 'A', heroId: 'G7-E04', teaches: 'materials',
  target: 0.85, yaw: +(process.env.YAW || 0.12), d: 1, fillMax: 0.73,
  hard7: true,
  drop7: { keys: ['mdB'], fall: 1.5, armor: 0.97 },
  sf: [], pattern: 'materials: a timber market (one TNT folds a section) behind a brick arcade (one TNT chips one pier); brick weigh houses at the ends',
  parts: [
    { id: 'A', kind: 'g7mhall', x: 0, z: 0, n: ns, hx, hz, ph: 5.4, ch: 2.6, rh: 1.6, bg0: 91 },
    { id: 'B', kind: 'g7arcade', x: 0, z: az, n: 6, len: W, d: AD, pw: 0.95, h1: 5.0, h2: 3.6, bg: 95 },
    { id: 'C', kind: 'g7kiosk', x: -kx, z: 0, hx: KX, bg: 96 },
    { id: 'D', kind: 'g7kiosk', x: kx, z: 0, hx: KX, bg: 97 }
  ],
  tanks: [],
  charges: { tnt: 40 },
  tip: '',
  ftip: 'Wood falls easy. Brick chips. Roofs still count.',
  sol: []
};
lvl.tntStart = +(process.env.TNT || 19);
writeFileSync(new URL('./level.json', import.meta.url), JSON.stringify([lvl], null, 1));
console.log('ok', 'W', W.toFixed(1), 'arcade z', az.toFixed(2), 'kiosks ±' + kx.toFixed(2));
