// L01 v4 "Five Eaves" (20/11, Khai: "chưa đạt chất lượng design / độ sophisticated của L32"; F01 clock tower already in the game).
// Hero kit g7 (engine.js): a five-tier pagoda built like the L1-36 heroes (A1.h / M14.api members + decor), tiers = separate blocks.
// Sequencing (Khai: "không thể nổ hết một lúc"): drop7 = roof slabs / finial / bell shrug off TNT until they have fallen.
import { writeFileSync } from 'node:fs';
const lvl = {
  name: 'Five Eaves', bp: 'L01v4', tier: 'SH', tntStart: 31, f: 6, kind: 'scene', hero: 'A', heroId: 'G7-01', teaches: null, target: 0.85, yaw: 0.35, d: 1, fillMax: 0.73,
  hard7: true, drop7: { keys: ['hard7v', 'hard7e'], fall: 1.5, armor: 0.97 },
  sf: [131, 121, 125, 145, 124], pattern: 'tiered blocks + shield + drop-first',
  parts: [
    { id: 'A', kind: 'g7pag', x: 0, z: 0, bg0: 11 },
    { id: 'S', kind: 'g7gate', x: 0, z: 16, bg: 21 },
    { id: 'B', kind: 'g7bell', x: 15, z: 3, bg: 22 },
    { id: 'T', kind: 'g7tea', x: -14, z: 5, bg: 23 }
  ],
  tanks: [[-5.6, 9.0], [-6.4, 9.6], [-5.4, 10.1]],
  charges: { tnt: 40 },
  tip: '',
  ftip: 'Some pieces only break once they are down.',
  sol: []
};
writeFileSync(new URL('./level-v4.json', import.meta.url), JSON.stringify([lvl], null, 1));
console.log('ok');
