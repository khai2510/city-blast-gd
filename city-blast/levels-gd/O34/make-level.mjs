// O34 "Tock Yard" (old-polish batch 2, replaces old L34 "Tock Yard", F01 clock tower). Lesson kept: row, then barrels: the clock tower
// tips into a short row of houses, the last house falls on a stack of red barrels by the coal shed, and the shed goes. Brick + wood +
// barrels (the old level's steel is gone, D-blast-L50). Kit g7oClock / g7oRowH / g7oShed / g7oCott. Earliest slot 25 (barrels).
import { scene, E, T } from '../old2-kit.mjs';
const TZ = E('TZ', -10), CX = E('CX', 9.8), RZ = E('RZ', -3.8), RG = E('RG', 1.0), NR = E('NR', 2);
const row = [{ id: 'S', kind: 'g7oRowH', x: 0, z: RZ + (NR * 3.2 + (NR - 1) * RG) / 2 - 1.6, hx: 2.4, hz: 1.6, nb: 2, mats: ['wood', 'brick'], n: NR, gap: RG, k: 2, bg: 121 }];
const lastZ = RZ + (NR - 1) * (2 * 1.6 + RG), DZ = lastZ + 1.6 + E('DG', 1.0);
const tanks = [[-1.0, DZ], [0, DZ], [1.0, DZ]];
scene({ name: 'Tock Yard', bp: 'O34', replaces: 'o34', tnt: 20, launch: { el: ['wood', 'brick', 'barrels'], slot: 25, before: ['brick', 'concrete', 'steel', 'barrels'] },
  pattern: 'row then barrels: the clock tower tips into the row, the last house lands on the barrels, the coal shed goes',
  ftip: 'Let the row reach the barrels.',
  tanks,
  sol: [T('A:z+', 0, 0), T('A:z+', 0, 1), T('B:z+', 0, 0), T('C:z+', 0, 0)],
  parts: [
    { id: 'A', kind: 'g7oClock', x: 0, z: TZ, hx: 2.6, gh: 3.8, sh: 3.2, ns: E('NS', 3) },
    ...row,
    { id: 'D', kind: 'g7oShed', x: 0, z: DZ + 1.0 + 2.0, hx: 3.0, hz: 2.0, h: 2.2, nx: 3 },
    { id: 'B', kind: 'g7oCott', x: -CX, z: TZ + 0.6, hx: 3.2, hz: 2.8, side: -1 },
    { id: 'C', kind: 'g7oCott', x: CX, z: TZ + 0.6, hx: 3.2, hz: 2.8, side: 1 } ] });
