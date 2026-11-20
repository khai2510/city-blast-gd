// L01 v3 = v2 + drop7 (safes, belfry floor and tank shrug off TNT until they have fallen). L01 v2 (20/11, Khai: "side buildings are perfunctory; no thick base that never budges; stepped difficulty").
// Side-building system: every side building has a ROLE and a difficulty, and the scene reads easy -> medium -> hard:
//   S  arcade (shield)         MEDIUM  a row of shops IN FRONT of the tower's foot (separate bond group): clear it to reach the foot
//   D  red drums               GIFT    behind the arcade, at the tower's front-left post: reachable once the arcade is gone
//   W  water tower             HARD    4 reinforced legs (rc: one TNT right on a leg) and a heavy tank (vault) on top: 2 legs side by side tip it
//   A  clock tower, lower block (bg 1) + upper block (bg 2, separate): the foot drops the lower block, the upper block comes down
//      in one piece and waits (its dark floors + vaults count until broken): the second job
import { writeFileSync } from 'node:fs';
const corners = (cx, cz, k) => { const o = {}; [[0, 0], [cx - 1, 0], [0, cz - 1], [cx - 1, cz - 1]].forEach(([i, j]) => o[i + ',' + j] = k || 'hrc'); return o; };
const all = (cx, cz, k) => { const o = {}; for(let i = 0; i < cx; i++) for(let j = 0; j < cz; j++) o[i + ',' + j] = k; return o; };
// a vault belongs to its building (same part id = same bid) and sits on floor fl of that building
const vault = (id, x, z, y, s, fl) => ({ id, kind: 'vault7', x, z, y, fl, w: s || 1.9, h: s ? 1.8 : 1.6, d: s || 1.9 });
const lower = [], upper = [];
for(let f = 0; f < 2; f++) lower.push({ f: 1, cx: 3, cz: 3, mat: 'brick', skin: 'alt', faces: { 'z+': 'sp' }, cols: f === 0 ? corners(3, 3) : corners(3, 3, 'rc') });   // RC that cracks in 3 steps only at the foot
for(let f = 0; f < 2; f++) upper.push({ f: 1, cx: 3, cz: 3, mat: 'brick', skin: 'alt', faces: { 'z+': 'sp' }, cols: corners(3, 3, 'rc') });
upper.push({ f: 1, cx: 3, cz: 3, mat: 'conc', skin: 'full', cols: corners(3, 3, 'rc'), slab: 'hard7s' });   // belfry: the only dark hard floor
const FH = 2.7, UP = 2 * FH;
const lvl = {
  name: 'Clock Tower', bp: 'L01v3', tier: 'H', f: 5, kind: 'scene', hero: 'A', heroId: 'F04', teaches: null, target: 0.85, yaw: 0.35, d: 1, fillMax: 0.73, hard7: true, drop7: { keys: ['hard7v', 'hard7s'], fall: 1.5, armor: 0.97 },
  sf: [131, 121, 125, 145, 124], pattern: 'stacked blocks + shield + side roles',
  parts: [
    { id: 'A', kind: 'mass', x: 0, z: 0, bg: 1, tiers: lower, fh: FH },
    { id: 'A2', kind: 'mass', x: 0, z: 0, y: UP, bg: 2, tiers: upper, fh: FH },
    vault('A2', -1.35, 1.35, UP + 2 * FH + 0.91, 2.3, 4), vault('A2', 1.35, -1.35, UP + 2 * FH + 0.91, 2.3, 4),   // bigger bells: more weight, same 2 hunts
    { id: 'S', kind: 'mass', x: 0, z: 5.6, bg: 3, tiers: [{ f: 1, cx: 4, cz: 2, mat: 'brick', skin: 'alt', faces: { 'z+': 'glass' } }], fh: 3.2, roof: { sign: 1 } },
    { id: 'W', kind: 'mass', x: 9, z: -1, bg: 5, tiers: [{ f: 3, cx: 2, cz: 2, mat: 'conc', skin: 'open', cols: all(2, 2, 'rc') }], fh: 2.7 },
    vault('W', 9, -1, 3 * FH + 1.0, 2.4, 3)
  ],
  tanks: [[-2.6, 2.6], [-3.4, 3.0], [-2.6, 3.4]],
  charges: { tnt: 40 },
  tip: 'Drop the tower first.\nThen crack what fell.',
  ftip: 'Break the dark blocks too.',
  sol: [['tnt', 'S:z+', 0, 0], ['tnt', 'S:z+', 0, 2], ['tnt', 'K:z+', 0, 0]]
};
writeFileSync(new URL('./level-v3.json', import.meta.url), JSON.stringify([lvl], null, 1));
console.log('ok');
