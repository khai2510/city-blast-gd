// three progressive-difficulty prototypes for the research (20/11): row of separate blocks, shell + inner tower, RC stilts + podium
import { writeFileSync } from 'node:fs';
const corners = (cx, cz, k) => { const o = {}; [[0, 0], [cx - 1, 0], [0, cz - 1], [cx - 1, cz - 1]].forEach(([i, j]) => o[i + ',' + j] = k || 'hrc'); return o; };
const vault = (id, x, z, fl) => ({ id, kind: 'vault7', x, z, y: fl * 2.7 + 0.81, fl, w: 1.9, h: 1.6, d: 1.9 });
const base = (name, parts, extra) => Object.assign({ name, bp: name, tier: 'N', f: 7, kind: 'scene', hero: 'A', heroId: 'F04', teaches: null, target: 0.85, yaw: 0.35, d: 1, fillMax: 0.73, hard7: true,
  parts, charges: { tnt: 40 }, tip: 'proto', sol: [['tnt', 'A:z+', 0, 0]] }, extra || {});
// P3 ROW: three separate blocks, low in front, tall at the back (front shields the back's foot)
const row = base('P3 row', [
  { id: 'A', kind: 'mass', x: 0, z: 3.5, bg: 1, tiers: [{ f: 3, cx: 3, cz: 2, mat: 'brick', skin: 'alt' }], fh: 2.7 },
  { id: 'B', kind: 'mass', x: 0, z: 0, bg: 2, tiers: [{ f: 5, cx: 3, cz: 2, mat: 'conc', skin: 'alt' }], fh: 2.7 },
  { id: 'C', kind: 'mass', x: 0, z: -3.5, bg: 3, tiers: [{ f: 7, cx: 3, cz: 2, mat: 'conc', skin: 'alt', cols: corners(3, 2) }], fh: 2.7 },
  vault('Cv0', -1.35, -3.5, 7), vault('Cv1', 1.35, -3.5, 7), vault('Bv0', 0, 0, 5)]);
// P4 SHELL: a one-bay ring of panels round a separate inner tower (must break the shell to see / reach the core)
const ring = []; for(let f = 0; f < 6; f++) ring.push({ f: 1, cx: 4, cz: 4, mat: 'conc', skin: 'full', hole: { i: [0, 3], j: [0, 3] } });
const shell = base('P4 shell', [
  { id: 'A', kind: 'mass', x: 0, z: 0, bg: 1, tiers: ring, fh: 2.7 },
  { id: 'B', kind: 'mass', x: 0, z: 0, bg: 2, tiers: [{ f: 7, cx: 2, cz: 2, mat: 'brick', skin: 'alt', cols: corners(2, 2) }], fh: 2.7 },
  vault('Bv0', 0, 0, 7)]);
// P1 STILTS: RC legs (ring of hrc) carry a hard transfer deck and a tower; a separate soft podium of shops stands between the legs
const ringCols = (cx, cz) => { const o = {}; for(let i = 0; i < cx; i++) for(let j = 0; j < cz; j++) o[i + ',' + j] = (i === 0 || i === cx - 1 || j === 0 || j === cz - 1) ? 'hrc' : 'none'; return o; };
const stilts = base('P1 stilts', [
  { id: 'A', kind: 'mass', x: 0, z: 0, bg: 1, tiers: [{ f: 2, cx: 3, cz: 3, mat: 'conc', skin: 'open', cols: ringCols(3, 3), slab: 'hard7s' }, { f: 4, cx: 3, cz: 3, mat: 'brick', skin: 'alt', cols: corners(3, 3) }], fh: 2.7 },
  { id: 'B', kind: 'mass', x: 0, z: 0, bg: 2, tiers: [{ f: 2, cx: 2, cz: 2, mat: 'brick', skin: 'alt' }], fh: 2.6, bay: 2.0 },
  vault('Av0', -1.35, 1.35, 6), vault('Av1', 1.35, -1.35, 6)]);
writeFileSync(new URL('./protos.json', import.meta.url), JSON.stringify([row, shell, stilts], null, 1));
console.log('ok');
