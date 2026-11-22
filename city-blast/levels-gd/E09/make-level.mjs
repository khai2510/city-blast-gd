// E09 "High Cistern" (easy pack, Normal, TEACH: order with height, a light drop-first). See 1-GD-SPEC.md. Kit g7cis / g7pump.
// One axis (x): a brick water tower in the middle with a riveted iron cistern on top, a pump house each side (same size, same
// gap, fronts in line). The cistern (hard7v) counts until a bomb cracks it, and while it is up high it shrugs off TNT (drop7,
// fall 1.5 m): bring the tower down first, then crack the cistern on the ground.
import { writeFileSync } from 'node:fs';
const hx = 3.0, G = +(process.env.G || 2.2), PX = 2.6, px = hx + G + PX;
const lvl = {
  name: 'High Cistern', bp: 'E09', tier: 'N', f: 7, kind: 'scene', hero: 'A', heroId: 'G7-E09', teaches: 'drop',
  target: 0.85, yaw: +(process.env.YAW || 0.1), d: 1, fillMax: 0.73,
  hard7: true,
  // the cistern (hard7v) and the floors (mdB) shrug off TNT up high; once fallen 1.5 m one TNT cracks them (read at BLAST)
  drop7: { keys: ['hard7v', 'mdB'], fall: 1.5, armor: 0.97 },
  sf: [], pattern: 'drop first (light): a brick water tower with a heavy iron cistern on top; the cistern ignores TNT up high and counts until cracked; drop the tower, then crack the cistern',
  parts: [
    { id: 'A', kind: 'g7cis', x: 0, z: 0, hx, sh: 4.0, n: +(process.env.NF || 3), cw: +(process.env.CW || 3.3), ch: +(process.env.CH || 3.4), stand: +(process.env.ST || 1.6), side: 1, bg: 131 },
    { id: 'B', kind: 'g7pump', x: -px, z: 0, hx: PX, hz: 3.4, side: -1, bg: 135 },
    { id: 'C', kind: 'g7pump', x: px, z: 0, hx: PX, hz: 3.4, side: 1, bg: 136 }
  ],
  tanks: [],
  charges: { tnt: 40 },
  tip: '',
  ftip: 'Bring the heavy piece down first. Then crack it.',
  sol: []
};
lvl.tntStart = +(process.env.TNT || 20);
writeFileSync(new URL('./level.json', import.meta.url), JSON.stringify([lvl], null, 1));
console.log('ok', 'pumps at ±' + px.toFixed(2));
