// O27 "The Splinter" (old-polish batch 2, replaces old L27 "The Splinter", F31 glass shard). Lesson kept: tip the glass tower down the
// row (hit its frame on the row side): the shard falls forward along a row of timber huts. Concrete + glass + wood (no steel,
// D-blast-L50). Kit g7oSplinter / g7oHuts / g7oWing. Earliest slot 20 (glass).
import { scene, E, T } from '../old2-kit.mjs';
const TZ = E('TZ', -9), CX = E('CX', 10.4), SZ = E('SZ', -1.0);
scene({ name: 'The Splinter', bp: 'O27', replaces: 'o27', tnt: 14, launch: { el: ['wood', 'brick', 'concrete', 'glass'], slot: 20, before: ['wood', 'brick', 'concrete', 'glass', 'steel'] },
  pattern: 'glass shard on concrete legs: two legs side by side and it lies down along the hut row',
  ftip: 'Hit the frame on the side it should fall.',
  parts: [
    { id: 'A', kind: 'g7oSplinter', x: 0, z: TZ, hx: 3.4, gh: 4.0, sh: 3.2, ns: E('NS', 5) },
    { id: 'S', kind: 'g7oHuts', x: 0, z: SZ, n: E('NH', 5), w: 1.8, hz: 1.4, h: 2.4 },
    { id: 'B', kind: 'g7oWing', x: -CX, z: TZ + 0.6, hx: 3.4, hz: 2.8, side: -1, nb: 3 },
    { id: 'C', kind: 'g7oWing', x: CX, z: TZ + 0.6, hx: 3.4, hz: 2.8, side: 1, nb: 3 } ] });
