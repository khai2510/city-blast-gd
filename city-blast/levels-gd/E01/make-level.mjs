// E01 "Long Legs" (easy pack, Normal). Lesson: hit the legs. See 1-GD-SPEC.md. Hero kit g7slab / g7stilt (pipeline7/engine.js).
// One axis (x): the slab in the middle (three sections on pilotis), a timber clubhouse on stilts at each end, the same size,
// the same gap, front edges in line. Red drums under both slab ends: a section that lands on them sets them off (hit7.drums)
// and the blast takes the clubhouse's legs: the chain.
import { writeFileSync } from 'node:fs';
const hx = 3.5, gap = 0.1, W = 3*2*hx + 2*gap, PG = +(process.env.PG || 1.6), PH = 2.6;
const px = W/2 + PG + PH;                       // clubhouse centre
const dx = W/2 - 0.5;                           // drums: under the slab end, between its two end legs
const lvl = {
  name: 'Long Legs', bp: 'E01', tier: 'N', tntStart: +(process.env.TNT || 19), f: 7, kind: 'scene', hero: 'A', heroId: 'G7-E01', teaches: 'legs',
  target: 0.85, yaw: +(process.env.YAW || 0.12), d: 1, fillMax: 0.73,
  hard7: true, hit7: { keys: [], drums: true },
  // the floors (plain mdC) shrug off TNT while the slab stands (a bomb on the facade only breaks glass), and crack with one TNT
  // once they lie in the heap (drop7 as plumbing: the same rule as L01's roof slabs, here on every floor)
  drop7: process.env.SOFTD === '0' ? undefined : { keys: ['mdC'], fall: 1.5, armor: 0.97 },
  sf: [], pattern: 'legs: a raised slab on pilotis, three sections; bombs on the legs drop a section, the heavy roof pieces land whole and need one more',
  parts: [
    { id: 'A', kind: 'g7slab', x: 0, z: 0, hx, hz: 4.5, secs: 3, legH: +(process.env.LEGH || 6.0), floors: +(process.env.FL || 5), bg0: 81, softDeck: +(process.env.SOFTD || 1) },
    { id: 'B', kind: 'g7stilt', x: -px, z: 0, hx: PH, hz: 3.0, legH: 4.0, side: -1, bg: 84 },
    { id: 'C', kind: 'g7stilt', x: px, z: 0, hx: PH, hz: 3.0, legH: 4.0, side: 1, bg: 85 }
  ],
  tanks: [[-dx, -0.55], [-dx, 0.55], [-dx + 0.9, 0], [dx, -0.55], [dx, 0.55], [dx - 0.9, 0]],
  charges: { tnt: 40 },
  tip: '',
  ftip: 'Hit the legs. Heavy pieces still count.',
  sol: []
};
writeFileSync(new URL('./level.json', import.meta.url), JSON.stringify([lvl], null, 1));
console.log('ok', 'clubhouses at x = ±' + px.toFixed(2), 'drums at ±' + dx.toFixed(2));
