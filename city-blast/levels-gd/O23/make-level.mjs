// O23 "Tube Bundle" (old-polish batch 2, replaces old L23 "Tube Bundle", F34 tube bundle). Lesson kept: tip it down the row: two
// legs side by side and the bundle lies down along the row of bathing huts in front. Concrete tubes (no steel: D-blast-L50), timber
// huts, brick villas. Kit g7oTubes / g7oHuts / g7oCott (pipeline7/engine.js, g7 OLD POLISH 2). Earliest slot 8 (concrete).
import { scene, E, T } from '../old2-kit.mjs';
const TZ = E('TZ', -8), CX = E('CX', 10.2), SZ = E('SZ', -0.6);
scene({ name: 'Tube Bundle', bp: 'O23', replaces: 'o23', tnt: 12, launch: { el: ['wood', 'brick', 'concrete'], slot: 8, before: ['wood', 'brick', 'concrete', 'steel'] },
  pattern: 'tip it down the row: two legs side by side and the tube bundle lies down along the hut row in front',
  ftip: 'Two legs side by side. It falls that way.',
  parts: [
    { id: 'A', kind: 'g7oTubes', x: 0, z: TZ, hx: 3.4, gh: 4.0, sh: 3.0, n1: E('N1', 4), n2: E('N2', 3), n3: E('N3', 5), n4: E('N4', 2) },
    { id: 'S', kind: 'g7oHuts', x: 0, z: SZ, n: E('NH', 5), w: 1.8, hz: 1.4, h: 2.4 },
    { id: 'B', kind: 'g7oCott', x: -CX, z: TZ + 0.6, hx: 3.2, hz: 2.8, side: -1 },
    { id: 'C', kind: 'g7oCott', x: CX, z: TZ + 0.6, hx: 3.2, hz: 2.8, side: 1 } ] });
