// E02 "Shot Tower" (easy pack, Normal, TEACH). Lesson: break two legs side by side and it tips that way. See 1-GD-SPEC.md.
// Kit g7shot / g7gshed (pipeline7/engine.js). One axis (x): the tower in the middle on 8 legs, a long timber goods shed on
// each side, the same size, the same gap, fronts in line. Whichever side the player opens, the tower lies down along that
// shed (one fall, two buildings). Opened at the front it falls on the empty yard: the shed still stands (a cheap, visible fail).
import { writeFileSync } from 'node:fs';
const TX = 3.4, SG = +(process.env.SG || 2.5), SX = +(process.env.SX || 7.0), sx = TX + SG + SX;
const lvl = {
  name: 'Shot Tower', bp: 'E02', tier: 'N', f: 7, kind: 'scene', hero: 'A', heroId: 'G7-E02', teaches: 'tip',
  target: 0.85, yaw: +(process.env.YAW || 0.12), d: 1, fillMax: 0.73,
  hard7: true,
  // a falling tower crushes what it lands on (hit7 with armor 0.001, never 0: 0 falls back to 0.97 in engine.js; TNT works as usual on these members; a heavy body of
  // another part landing hard within reach breaks them)
  hit7: { keys: ['wpost', 'wwall', 'mdW', 'g7roofL'], armor: 0.001, f: +(process.env.HF || 3), reach: 1.0 },
  // the shaft floors (plain mdB) shrug off TNT while the tower stands (a bomb on the shaft only breaks a wall), and crack with
  // one TNT once they lie in the heap (drop7 as plumbing, as E01): only the legs bring the tower down
  drop7: { keys: ['mdB'], fall: 1.5, armor: 0.97 },
  sf: [], pattern: 'tip: a tall tower on 8 legs; two legs side by side gone = it lies down that way; a long goods shed on each side is the target',
  parts: [
    { id: 'A', kind: 'g7shot', x: 0, z: 0, hx: TX, legH: 5.0, n: +(process.env.NF || 7), hold: 2.0, bg: 41, hop: [0, 2, 4, 6], hopW: 2.6, hopH: 2.2, cis: 2.8 },
    { id: 'B', kind: 'g7gshed', x: -sx, z: 0, hx: SX, hz: 4.0, nx: 5, side: -1, bg: 42 },
    { id: 'C', kind: 'g7gshed', x: sx, z: 0, hx: SX, hz: 4.0, nx: 5, side: 1, bg: 43 }
  ],
  tanks: [],
  charges: { tnt: 40 },
  tip: '',
  ftip: 'Neighbouring legs tip it. Heavy pieces still count.',
  sol: []
};
lvl.tntStart = +(process.env.TNT || 23);
writeFileSync(new URL('./level.json', import.meta.url), JSON.stringify([lvl], null, 1));
console.log('ok', 'sheds at ±' + sx.toFixed(2));
