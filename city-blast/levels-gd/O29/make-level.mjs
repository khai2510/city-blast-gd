// O29 "Old Tock Row" (old-polish batch 2, replaces old L29 "Old Tock Row", F01 clock tower). Lesson kept: one push, the whole row
// goes: two brick legs side by side tip the clock tower forward into a row of narrow timber houses that fall one onto the next. The
// old level's glass / steel are gone (D-blast-L50). Kit g7oClock / g7oRowH / g7oCott. Earliest slot 4 (brick; the houses are wood).
import { scene, E, T } from '../old2-kit.mjs';
const TZ = E('TZ', -9), CX = E('CX', 9.8), RZ = E('RZ', -2.6), RG = E('RG', 1.0), NR = E('NR', 3);
const L = NR * 3.2 + (NR - 1) * RG;
const row = [{ id: 'S', kind: 'g7oRowH', x: 0, z: RZ + L / 2 - 1.6, hx: 2.4, hz: 1.6, nb: 2, mat: 'wood', n: NR, gap: RG, k: 0, bg: 111 }];
scene({ name: 'Old Tock Row', bp: 'O29', replaces: 'o29', tnt: 19, launch: { el: ['wood', 'brick'], slot: 4, before: ['wood', 'brick', 'concrete', 'glass', 'steel'] },
  pattern: 'domino: the clock tower tips forward into the first house, the row of houses falls one onto the next',
  ftip: 'One push. Let it fall into the row.',
  sol: [T('A:z+', 0, 0), T('A:z+', 0, 1), T('B:z+', 0, 0), T('C:z+', 0, 0)],
  parts: [
    { id: 'A', kind: 'g7oClock', x: 0, z: TZ, hx: 2.6, gh: 3.8, sh: 3.2, ns: E('NS', 3) },
    ...row,
    { id: 'B', kind: 'g7oCott', x: -CX, z: TZ + 0.6, hx: 3.2, hz: 2.8, side: -1 },
    { id: 'C', kind: 'g7oCott', x: CX, z: TZ + 0.6, hx: 3.2, hz: 2.8, side: 1 } ] });
