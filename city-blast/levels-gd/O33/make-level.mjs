// O33 "Rivet Depot" (old-polish batch 2, replaces old L33 "Rivet Depot", F03 lattice tower). Lesson kept: barrels show the way down:
// the barrels stand along the depot (the landing) in front of the tower; drop the lattice tower onto them and the depot goes with it.
// The lattice is grey concrete (no steel before 40, D-blast-L50), rivets and bracing are decor. Kit g7oLattice / g7oRetort / g7oWhse.
// Earliest slot 25 (barrels).
import { scene, E, T } from '../old2-kit.mjs';
const TZ = E('TZ', -9), CX = E('CX', 10.4), SZ = E('SZ', 2.4), SHX = E('SHX', 5.6);
const tanks = [-SHX * 0.6, -SHX * 0.2, SHX * 0.2, SHX * 0.6].map(x => [+x.toFixed(2), SZ - 2.2 - 0.8]);
scene({ name: 'Rivet Depot', bp: 'O33', replaces: 'o33', tnt: 14, launch: { el: ['brick', 'concrete', 'barrels'], slot: 25, before: ['wood', 'brick', 'concrete', 'glass', 'steel', 'barrels'] },
  pattern: 'barrels: a row of red barrels along the back of the depot; the lattice tower falls on them and the depot goes too',
  ftip: 'Drop it on the barrels. They do the rest.',
  tanks,
  parts: [
    { id: 'A', kind: 'g7oLattice', x: 0, z: TZ, hx: 3.4, gh: 4.0, sh: 3.6, ns: E('NS', 4) },
    { id: 'S', kind: 'g7oRetort', x: 0, z: SZ, hx: SHX, hz: 2.2, h: 3.4 },
    { id: 'B', kind: 'g7oWhse', x: -CX, z: TZ, hx: 3.2, hz: 3.0, nb: 3 },
    { id: 'C', kind: 'g7oWhse', x: CX, z: TZ, hx: 3.2, hz: 3.0, nb: 3 } ] });
