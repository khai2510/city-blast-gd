// E06 "Boiler Stack" (easy pack, Normal, COMBINE: legs + direction). See 1-GD-SPEC.md. Kit g7stack / g7boil (pipeline7/engine.js).
// One axis (x): a brick chimney on legs at the left, the boiler house (two brick bays) beside it, an empty yard on the far side.
// The chimney stands on 8 legs (E01: hit the legs; E02: two side by side tip it that way). Opened on the side facing the boiler
// house it lies down along the roof: one fall wrecks two buildings. Opened the other way it lands on the empty yard.
import { writeFileSync } from 'node:fs';
const nb = +(process.env.NB || 2), bw = 3.6, W = nb*2*bw + (nb - 1)*0.1, BX = 2.9, G = +(process.env.G || 2.0), cx = W/2 + G + BX;
const lvl = {
  name: 'Boiler Stack', bp: 'E06', tier: 'N', f: 7, kind: 'scene', hero: 'A', heroId: 'G7-E06', teaches: 'aim',
  target: 0.85, yaw: +(process.env.YAW || 0.12), d: 1, fillMax: 0.73,
  hard7: true,
  // floors (mdB, mdC) shrug off TNT while they stand (a bomb on the chimney shaft takes a wall, never a floor), and crack
  // with one TNT once they lie in the heap (drop7 as plumbing, as E01/E02)
  drop7: { keys: ['mdB', 'mdC'], fall: 1.5, armor: 0.97 },
  // a falling tower crushes what it lands on (hit7 with armor 0.001, never 0: 0 falls back to 0.97 in engine.js; TNT works as usual on these members; a heavy body of
  // another part landing hard within reach breaks them)
  hit7: { keys: ['bk', 'bkw', 'mdB', 'g7roofL'], armor: 0.001, f: +(process.env.HF || 3), reach: 1.0 },
  sf: [], pattern: 'aim: a chimney on legs at the end of a boiler house; tipped towards it the chimney lies along the boiler-house roof (one fall, two buildings); tipped away it hits the empty yard',
  parts: [
    { id: 'A', kind: 'g7stack', x: -cx, z: 0, bx: BX, legH: 4.6, n: +(process.env.NS || 5), sh: 3.1, hold: 2.0, bg: 51 },
    { id: 'B', kind: 'g7boil', x: 0, z: 0, n: nb, bw, hz: 6, ph: 7.0, bg0: 52, heavy: 1 }
  ],
  tanks: [],
  charges: { tnt: 40 },
  tip: '',
  ftip: 'Open the side it should fall. Tanks still count.',
  sol: []
};
lvl.tntStart = +(process.env.TNT || 17);
writeFileSync(new URL('./level.json', import.meta.url), JSON.stringify([lvl], null, 1));
console.log('ok', 'W', W.toFixed(1), 'stacks at ±' + cx.toFixed(2));
