// L05 "Glass Spine" (peel the shell to reach the core; the core peels one layer per blast). See 1-GD-SPEC.md.
// Hero kit g7spine (pipeline7/engine.js).
import { writeFileSync } from 'node:fs';
const GAP = +(process.env.GAP || 5), PH = 9, PW = 4;
const lvl = {
  name: 'Glass Spine', bp: 'L05', tier: 'SH', tntStart: +(process.env.TNT || 26), f: 7, kind: 'scene', hero: 'A', heroId: 'G7-05', teaches: 'core', target: 0.85, yaw: +(process.env.YAW || 0.12), d: 1, fillMax: 0.73,
  hard7: true, layer7: { keys: ['hrc', 'core7'], n: 3 }, sf: [], pattern: 'peel the podium to find the core, chip the 4 core piers over 3 blasts, the tower drops',
  // one axis: the tower on its podium in the middle, two identical pavilions left and right, same gap
  parts: [
    { id: 'A', kind: 'g7spine', x: 0, z: 0, bg: 71, ph: PH, th: 6, n: 9, pod: 2 },
    { id: 'L', kind: 'g7spine', x: -(PH + GAP + PW), z: 0, bg: 72, ph: PW, th: 4, n: +(process.env.PN || 2), pod: 0, noCore: 1, hrc: false },
    { id: 'R', kind: 'g7spine', x: PH + GAP + PW, z: 0, bg: 73, ph: PW, th: 4, n: +(process.env.PN || 2), pod: 0, noCore: 1, hrc: false }
  ],
  coreTest: { part: 'A' },
  tanks: [], charges: { tnt: 40 }, tip: '', ftip: 'Find what really holds it up.', sol: []
};
writeFileSync(new URL('./level.json', import.meta.url), JSON.stringify([lvl], null, 1));
console.log('ok');
