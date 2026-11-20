// L02 "Watch Keep" (aim the fall). See 1-GD-SPEC.md. Hero kit g7keep / g7arm / g7cwall (pipeline7/engine.js).
import { writeFileSync } from 'node:fs';
const lvl = {
  name: 'Watch Keep', bp: 'L02', tier: 'H', tntStart: 24, f: 7, kind: 'scene', hero: 'A', heroId: 'G7-02', teaches: 'aim', target: 0.85, yaw: 0.35, d: 1, fillMax: 0.73,
  hard7: true, hit7: { keys: ['hard7i'], armor: 0.97, self: true, f: 6, fuel: 4, reach: 1.5, drums: true }, layer7: { keys: ['hrc'], n: 3 },
  sf: [], pattern: 'aim the fall -> chain: hall progressive collapse -> hidden powder store -> gate tower',
  parts: [
    { id: 'A', kind: 'g7keep', x: -17, z: 0, bg: 31, hold: 2.5 },
    { id: 'R', kind: 'g7hall', x: 2.5, z: 0, bg: 32, hx: 9, hz: 5.5, storeL: 2, store: [[-0.6, -2.6], [0.6, -2.0], [2.8, 2.2], [4.0, 2.6], [1.6, 0.9]] },
    { id: 'G', kind: 'g7gtow', x: 17, z: 0, bg: 34, hx: 3.0 },
    { id: 'W', kind: 'g7cwall', x: -28.5, z: 0, bg: 33, len: 7 }
  ],
  tanks: [],
  aimFace: [1, 0],
  charges: { tnt: 40 },
  tip: '',
  ftip: 'Two legs side by side: it falls that way.',
  sol: []
};
writeFileSync(new URL('./level.json', import.meta.url), JSON.stringify([lvl], null, 1));
console.log('ok');
