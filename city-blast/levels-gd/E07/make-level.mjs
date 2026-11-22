// E07 "Bathhouse" (easy pack, Normal, TEACH: restraint, gentle). See 1-GD-SPEC.md. Kit g7bath / g7colo (pipeline7/engine.js).
// One axis (x): the domed bathhouse in the middle, a colonnade wing each side (same size, same gap, fronts in line). The school
// (blue, keep6) stands behind the right wing, 2 m behind the hall's back line. Small blasts on the hall's piers drop the dome into the hall;
// a big one, or the hall tipped right, throws it towards the school. The copper dome is heavy (hard7t): it lands whole and still counts.
import { writeFileSync } from 'node:fs';
const hx = 5.0, hz = 5.0, G = +(process.env.G || 1.8), CX = 1.8, wx = hx + G + CX;   // compact lot (Lead 22/11: ≈ 24 m wide at most)
const SG = +(process.env.SG || 1.25), SX = +(process.env.SX || 7.0), SZ = +(process.env.SZ || -(hz + SG + 1.65));   // school 6 x 3.3 m, behind the hall's right corner and the right wing, 1.25 m behind the hall's back line
const lvl = {
  name: 'Bathhouse', bp: 'E07', tier: 'N', f: 7, kind: 'scene', hero: 'A', heroId: 'G7-E07', teaches: 'keep',
  target: 0.85, yaw: +(process.env.YAW || 0.1), d: 1, fillMax: 0.73,
  hard7: true,
  drop7: { keys: ['mdB'], fall: 1.5, armor: 0.97 },
  sf: [], pattern: 'restraint: a domed bathhouse on 8 piers between two colonnade wings, a school (blue) behind the right wing at a generous gap; small blasts drop the dome into the hall, a big blast or a tip back-right reaches the school',
  parts: [
    { id: 'A', kind: 'g7bath', x: 0, z: 0, hx, hz, dr: 4.0, ph: +(process.env.PH || 6.5), hold: +(process.env.HOLD || 1.6), domeKey: process.env.DK || 'hard7t', dq: +(process.env.DQ || 2.6), oneDome: 1, atticKey: 'hard7t', allGlass: 1, bg: 111 },
    { id: 'B', kind: 'g7colo', x: -wx, z: 0, hx: CX, hz: 4.2, side: -1, mat: 'brick', pw: 0.7, roofKey: 'hard7t', bg: 115 },
    { id: 'C', kind: 'g7colo', x: wx, z: 0, hx: CX, hz: 4.2, side: 1, mat: 'brick', pw: 0.7, roofKey: 'hard7t', bg: 116 }
  ],
  keeps: [ { kind: 'keep6', x: SX, z: SZ, floors: 2, cx: 3, cz: 2, name: 'the school', role: 'school', fixType: 'school' } ],
  keep: { name: 'the school', sides: [], type: 'school', role: 'school', full: 1 },
  tanks: [],
  charges: { tnt: 40 },
  tip: '',
  ftip: 'Small blasts drop it in place. Keep blue clear.',
  sol: []
};
lvl.tntStart = +(process.env.TNT || 18);
writeFileSync(new URL('./level.json', import.meta.url), JSON.stringify([lvl], null, 1));
console.log('ok', 'wings at ±' + wx.toFixed(2), 'school', SX, SZ);
