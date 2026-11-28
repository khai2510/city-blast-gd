// L1TWIN "Twin Mills" (play slot 1, replaces old L1; tutorial; Khai D-blast-L1TWIN 28/11: "two windmills exactly alike: the game
// shows where one TNT goes on the first, the player takes the second alone with the TNT that is left").
// Kit g7oMill (pipeline7/engine.js, block g7 OLD POLISH). Wood only (slot 1 introduces wood). Two identical mills side by side
// on screen (on the diagonal across the 45-degree opening view), sails turned to face that view. One leg gone and a mill falls forward (BASE weak-tip + the existing shove, as O01's lookout).
// The first-visit hand (main/tap2.js H1) double-taps sol[0], the left front leg of mill A (the left one). After that blast the
// lesson is over (no hand): mill B is the player's, with tntStart - 1 TNT. One TNT on a leg drops it; one on the body does not.
import { writeFileSync } from 'node:fs';
import { centre } from '../pad-centre.mjs';
const E = (k, d) => process.env[k] != null ? +process.env[k] : d;
const DX = E('DX', 4.8);   // the opening camera stands at 45 degrees (frame.js, D-blast-PAD): the mills sit on the other diagonal, so they are side by side on screen
const T = (sel, f, i) => ['tnt', sel, f || 0, i || 0];
const mill = (id, x) => ({ id, kind: 'g7oMill', x, z: -x, hx: E('HX', 2.3), lh: E('LH', 4.8), sh: E('SH', 3.3), ns: E('NS', 4), lw: E('LW', 1.0), tp: E('TP', 0.2), sail: E('SAIL', 5.4), syaw: +E('SYAW', Math.PI / 4).toFixed(4) });
const B1 = { preset: 'weak-tip', shove: E('SHOVE', 2.5) };
const lvl = {
  name: 'Twin Mills', bp: 'L1TWIN', slot: 1, replaces: 'o1', tier: 'T', f: 9, kind: 'scene', hero: 'A,B', heroId: 'G7-L1TWIN', teaches: 'wood',
  target: 0.85, yaw: 0, d: 1,
  base: { A: B1, B: B1, '*': 'weak' },
  sf: [], pattern: 'tutorial: two mills exactly alike; one leg gone and a mill falls forward; the hand shows the first, the second is the player\'s',
  parts: [mill('A', -DX), mill('B', DX)],
  charges: { tnt: 40 },
  hint: 'A:z+', tip: '', noWords: 1, aid: { tip: false }, dbl: 1,
  ftip: 'A post holds a building up. Hit the posts.',
  lesson: { check: [[]] },
  sol: [T('A:z+', 0, 0), T('B:z+', 0, 0)],
  bot: { hints: [['A', 'A:z+', 1], ['A', 'B:z+', 1]] }
};
lvl.tntStart = E('TNT', 4);
centre(lvl);
writeFileSync(new URL('./level.json', import.meta.url), JSON.stringify([lvl], null, 1));
console.log('ok L1TWIN', 'mills ±' + DX, 'pad', JSON.stringify(lvl.pad));
