// O31 "Stack Tower" (old-polish batch 2, replaces old L31 "Stack Tower", F19 stacked blocks; the Net card follows the boss before it
// in the old order). Lesson re-expressed (D-blast-L50: the old "dark piers one each, steel stack" is gone): blocks stacked off-centre
// ride on one storey of legs: two legs side by side and the whole stack pitches onto the warehouse in front. Concrete + brick.
// Kit g7oStack / g7oRetort / g7oWhse. Earliest slot 8 (concrete).
import { scene, E, T } from '../old2-kit.mjs';
const TZ = E('TZ', -8), CX = E('CX', 10.4), SZ = E('SZ', 2.6);
scene({ name: 'Stack Tower', bp: 'O31', replaces: 'o31', tnt: 14, launch: { el: ['brick', 'concrete'], slot: 8, before: ['wood', 'concrete', 'glass', 'steel', 'dark'] },
  pattern: 'stacked blocks on one storey of legs: two legs side by side and the stack pitches onto the hall',
  ftip: 'Two legs side by side. It falls that way.',
  parts: [
    { id: 'A', kind: 'g7oStack', x: 0, z: TZ, hx: 3.4, gh: 4.0, sh: 3.4, ns: E('NS', 5) },
    { id: 'S', kind: 'g7oRetort', x: 0, z: SZ, hx: E('SHX', 5.6), hz: 2.2, h: 3.4 },
    { id: 'B', kind: 'g7oWhse', x: -CX, z: TZ, hx: 3.2, hz: 3.0, nb: 3 },
    { id: 'C', kind: 'g7oWhse', x: CX, z: TZ, hx: 3.2, hz: 3.0, nb: 3 } ] });
