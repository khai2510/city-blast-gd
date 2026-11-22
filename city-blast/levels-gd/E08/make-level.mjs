// E08 "Grain Elevator" (easy pack, Normal, TEACH: patience). See 1-GD-SPEC.md. Kit g7elev / g7silo / g7weigh (pipeline7/engine.js).
// One axis (x): the weigh house at the left, the concrete head house, a row of four silos at the right. The head house stands
// on 8 piers; the 4 corners are massive RC (hrc: three TNT break one, the cracks stay from blast to blast). Two piers side by
// side tip it that way; tipped right it lies down along the silo row and the silos tumble (hit7: crushed by what lands).
import { writeFileSync } from 'node:fs';
const HX = 3.2, G = +(process.env.G || 2.0), NS = 2, NR = 2, D = 3.2, SG = 0.2, SW = NS*D + (NS - 1)*SG, WG = +(process.env.WG || 2.0), WX = 2.0;   // compact lot (Lead 22/11): silos in a 2 x 2 block
const sx = HX + G + SW/2, wx = -(HX + WG + WX), mid = ((sx + SW/2) + (wx - WX))/2;
const lvl = {
  name: 'Grain Elevator', bp: 'E08', tier: 'N', f: 7, kind: 'scene', hero: 'A', heroId: 'G7-E08', teaches: 'hrc',
  target: 0.85, yaw: +(process.env.YAW || 0.1), d: 1, fillMax: 0.73,
  hard7: true,
  drop7: { keys: ['mdC'], fall: 1.5, armor: 0.97 },
  hit7: { keys: ['g7silo'], armor: 0.001, f: +(process.env.HF || 3), reach: 1.0 },
  sf: [], pattern: 'patience: a concrete head house on 8 piers, the corners massive RC (3 TNT, damage stays); two piers side by side tip it; tipped onto the silo row it lays the silos down',
  parts: [
    { id: 'A', kind: 'g7elev', x: -mid, z: 0, hx: HX, hz: 3.2, legH: 5.4, n: +(process.env.NF || 5), hold: 2.0, side: 1, roofKey: process.env.RK || 'g7roofL', rh: +(process.env.RH || 1.0), bin: +(process.env.BIN ?? 1), bin2: +(process.env.BIN2 || 3.4), gwall: 0, bg: 120 },
    { id: 'B', kind: 'g7silo', x: +(sx - mid).toFixed(2), z: 0, n: NS, rows: NR, D, gap: SG, k: +(process.env.K || 3), dh: 4.2, bg0: 121 },
    { id: 'C', kind: 'g7weigh', x: +(wx - mid).toFixed(2), z: 0.6, hx: WX, hz: 2.6, side: -1, bg: 126 }
  ],
  tanks: [],
  charges: { tnt: 40 },
  tip: '',
  ftip: 'Cracked concrete stays cracked. Hit it again.',
  sol: []
};
lvl.tntStart = +(process.env.TNT || 20);
writeFileSync(new URL('./level.json', import.meta.url), JSON.stringify([lvl], null, 1));
console.log('ok', 'head', -mid.toFixed(2), 'silos', (sx - mid).toFixed(2), 'weigh', (wx - mid).toFixed(2));
