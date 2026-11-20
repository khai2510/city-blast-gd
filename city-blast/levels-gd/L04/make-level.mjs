// L04 "Canal Row" v2 (domino, symmetric): a square with a merchant tower in the middle, two rows of three townhouses rising
// towards it, a protected building at each end. Take the tower out first (front, into the square), then send both rows IN.
// See 1-GD-SPEC.md. Hero kit g7house + dom7 (pipeline7/engine.js).
import { writeFileSync } from 'node:fs';
const W = 4.2, G = +(process.env.GAP || 2.6), TW = 5.4, D = 6, PG = +(process.env.PG || 4);
// one axis (x = 0). Same width, same gap, street fronts in one line; the rows step DOWN towards the square (5, 4, 3 storeys)
// so the last house of a row falling in cannot reach across the square.
const xs = [TW/2 + PG + W/2, TW/2 + PG + W/2 + (W + G), TW/2 + PG + W/2 + 2*(W + G)];   // C, B, A (from the tower out): an open square of PG m round the tower
const H = (id, x, n, legs, c, o) => Object.assign({ id, kind: 'g7house', x, z: 0, w: W, d: D, n, c, legs, hold: 1.5 }, o || {});
const edge = xs[2] + W/2 + G + 3.65;
const lvl = {
  name: 'Canal Row', bp: 'L04', tier: 'SH', tntStart: +(process.env.TNT || 23), f: 7, kind: 'scene', hero: 'T', heroId: 'G7-04', teaches: 'domino', target: 0.85, yaw: +(process.env.YAW || 0.1), d: 1, fillMax: 0.73,
  hard7: true, sf: [], pattern: 'domino x2 inward: take the middle tower out to the front first (3 blasts), then tip both end houses inwards',
  hit7: { keys: ['hard7i'], armor: 0.97, f: 0, reach: 0 }, layer7: { keys: ['hrc'], n: 3 },
  dom7: { parts: ['A', 'B', 'C', 'T', 'F', 'E', 'D'], dv: 3, m: 500, reach: 0.4 },
  parts: [
    H('T', 0, 7, 'hrc', 6, { w: TW, spire: 1, bg: 60 }),
    H('C', -xs[0], 3, 'hard7i', 4, { bg: 61 }), H('B', -xs[1], 4, 'hard7i', 2, { bg: 62 }), H('A', -xs[2], 5, 'hrc', 0, { bg: 63 }),
    H('D', xs[0], 3, 'hard7i', 3, { bg: 64 }), H('E', xs[1], 4, 'hard7i', 1, { bg: 65 }), H('F', xs[2], 5, 'hrc', 5, { bg: 66 })
  ],
  keeps: [
    { kind: 'keep6', x: -edge, z: 0, floors: 4, cx: 3, cz: 3, name: 'the school', role: 'school', fixType: 'school' },
    { kind: 'keep6', x: edge, z: 0, floors: 4, cx: 3, cz: 3, name: 'the hospital', role: 'hospital', fixType: 'hospital' }
  ],
  keep: { name: 'the school', sides: [], type: 'school', role: 'school', full: 1 },
  seqRoutes: {
    right: [[{ part: 'T', f: [0, 1] }, { part: 'A', f: [1, 0] }, { part: 'F', f: [-1, 0] }]],
    wrong: [[{ part: 'A', f: [1, 0] }, { part: 'F', f: [-1, 0] }], [{ part: 'T', f: [0, 1] }, { part: 'A', f: [-1, 0] }, { part: 'F', f: [1, 0] }]]
  },
  tanks: [], charges: { tnt: 40 }, tip: '', ftip: 'Clear the middle first. Then push them in.', sol: []
};
writeFileSync(new URL('./level.json', import.meta.url), JSON.stringify([lvl], null, 1));
console.log('ok', edge.toFixed(1));
