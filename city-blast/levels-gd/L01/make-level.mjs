// L01 step 3: the Figma elevation (frame "L01 · Clock Tower · design") mapped back to game members, on the L32 standard.
//   Figma "Dark corner posts"   -> column key hrc (L32 massive RC: 3 TNT, cracks stay between blasts), all 7 storeys
//   Figma "Brick body + bands"  -> mat brick, slabs; front face "sp" = a low wall under each window (the windows read)
//   Figma "Glass windows"       -> the window openings of the front face
//   Figma "Belfry (heavy top)"  -> a 7th storey, full concrete skin, a dark hard floor (hard7s) + 2 vaults (hard7v)
//   Figma "Clock mechanism floor" (run 2) -> storey 4 has a dark hard floor (hard7s)
//   Figma "Wooden annex"        -> mass wood 2 x 2, 3 storeys + 1 vault on its roof
//   L32 red drums               -> 3 tanks at the front-left foot (they blast for free: the first lesson of the pack)
import { writeFileSync } from 'node:fs';
const corners = (cx, cz) => { const o = {}; [[0, 0], [cx - 1, 0], [0, cz - 1], [cx - 1, cz - 1]].forEach(([i, j]) => o[i + ',' + j] = 'hrc'); return o; };
const tiers = [];
// storey 4 is the clock-mechanism floor: a dark hard slab (hard7s: counts until broken, Smash Fest stone shelf)
for(let f = 0; f < 6; f++){ const t = { f: 1, cx: 3, cz: 3, mat: 'brick', skin: 'alt', faces: { 'z+': 'sp' }, cols: corners(3, 3) }; if(f === 3) t.slab = 'hard7s'; tiers.push(t); }
tiers.push({ f: 1, cx: 3, cz: 3, mat: 'conc', skin: 'full', cols: corners(3, 3), slab: 'hard7s' });   // belfry: heavy dark floor + 2 vaults
const X0 = -2.7, Z0 = -2.7, vy = (fl) => fl * 2.7 + 0.81;
const vault = (id, x, z, fl) => ({ id, kind: 'vault7', x, z, y: vy(fl), fl, w: 1.9, h: 1.6, d: 1.9 });
const lvl = {
  name: 'Clock Tower', bp: 'L01', tier: 'N', f: 7, kind: 'scene', hero: 'A', heroId: 'F04', teaches: null, target: 0.85, yaw: 0.35, d: 1, fillMax: 0.73, hard7: true,
  sf: [131, 152, 165, 121, 134], pattern: 'corners + heavy cap', story: 'Gothic clock tower (inspired): dark corner posts, brick body, heavy belfry with two vaults; a wooden annex.',
  parts: [
    { id: 'A', kind: 'mass', x: 0, z: 0, tiers, fh: 2.7 },
    { id: 'B', kind: 'mass', x: -8.8, z: 0.6, tiers: [{ f: 3, cx: 2, cz: 2, mat: 'wood', skin: 'alt' }], fh: 2.7 },
    vault('Av0', X0 + 1.35, Z0 + 4.05, 6), vault('Av1', X0 + 4.05, Z0 + 4.05, 6),
    vault('Bv0', -8.8, 0.6, 3)
  ],
  tanks: [[-4.3, 2.4], [-4.3, 3.5], [-3.3, 4.3]],
  charges: { tnt: 40 },
  tip: 'Dark posts crack slowly.\nRed drums help.',
  ftip: 'Break the dark blocks too.',
  sol: [['tnt', 'A:z+', 0, 0], ['tnt', 'A:z+', 0, 1], ['tnt', 'A:z+', 0, 2]]
};
writeFileSync(new URL('./level.json', import.meta.url), JSON.stringify([lvl], null, 1));
console.log('ok', lvl.parts.length, 'parts');
