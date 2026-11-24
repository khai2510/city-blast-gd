// O25 "Glass Point" (old-polish batch 2, replaces old L25 "Glass Point", F06 pointed glass tower; the glass card level). Lesson kept:
// glass holds nothing, hit the frame. The old level's dark frame (rc) is now grey concrete (D-blast-L50: dark launches at 60):
// a TNT on a pane only breaks glass; two concrete legs side by side and it falls onto the baggage hall. Kit g7oGlassPt / g7oBag /
// g7oWing. Earliest slot 20 (glass).
import { scene, E, T } from '../old2-kit.mjs';
const TZ = E('TZ', -8), CX = E('CX', 10.2), SZ = E('SZ', 0.4);
scene({ name: 'Glass Point', bp: 'O25', replaces: 'o25', tnt: 14, launch: { el: ['wood', 'brick', 'concrete', 'glass'], slot: 20, before: ['brick', 'concrete', 'glass', 'dark'] },
  pattern: 'glass holds nothing: the panes break, the concrete frame carries it; two legs side by side drop it onto the hall',
  ftip: 'Glass holds nothing. Hit the frame.',
  parts: [
    { id: 'A', kind: 'g7oGlassPt', x: 0, z: TZ, hx: 3.0, gh: 4.2, sh: 3.2, ns: E('NS', 4) },
    { id: 'S', kind: 'g7oBag', x: 0, z: SZ, hx: E('SHX', 4.4), hz: 2.0, h: 2.6, nx: 4 },
    { id: 'B', kind: 'g7oWing', x: -CX, z: TZ + 0.6, hx: 3.4, hz: 2.8, side: -1, nb: 3 },
    { id: 'C', kind: 'g7oWing', x: CX, z: TZ + 0.6, hx: 3.4, hz: 2.8, side: 1, nb: 3 } ] });
