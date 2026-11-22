// O10 "Pier Pavilion" (old-polish, play slot 10, replaces old L14 "Stripey Light"). Lesson: concrete carries the steel, the steel
// carries the rest: hit the bottom of the chain (everything introduced so far: wood, brick, concrete, steel). See 1-GD-SPEC.md.
// Kit g7oPav / g7oHuts / g7oCott (pipeline7/engine.js, g7 OLD POLISH). One axis (x): the pavilion on its pier head in the middle,
// the bathing huts on the beach in front of it on the axis (the landing: they go down like a row of books), a brick villa each
// side (same size, same gap, fronts in line). Two pile caps side by side and the whole pier head pitches forward onto the huts.
import { writeFileSync } from 'node:fs';
const E = (k, d) => process.env[k] != null ? +process.env[k] : d;
const TZ = E('TZ', -7), CX = E('CX', 9.8), SZ = E('SZ', -1.2);
const T = (sel, f, i) => ['tnt', sel, f || 0, i || 0];
const lvl = {
  name: 'Pier Pavilion', bp: 'O10', slot: 10, replaces: 'o14', tier: process.env.TIER || 'N', f: 12, kind: 'scene', hero: 'A', heroId: 'G7-O10', teaches: 'steel',
  target: 0.85, yaw: 0, d: 1,
  base: { A: { preset: 'stiff-tip', shove: E('SHOVE', 2.5) }, '*': 'weak' },
  sf: [], pattern: 'materials ladder: concrete pile caps under steel legs under a brick and timber pavilion; two caps side by side pitch it onto the hut row',
  parts: [
    { id: 'A', kind: 'g7oPav', x: 0, z: TZ, hx: E('HX', 3.4), hz: E('HZ', 3.0), ph: E('PH', 3.0), lh: E('LH', 2.2) },
    { id: 'S', kind: 'g7oHuts', x: 0, z: SZ, n: E('NH', 5), w: 1.8, hz: 1.4, h: 2.4 },
    { id: 'B', kind: 'g7oCott', x: -CX, z: TZ + 0.6, hx: 3.2, hz: 2.8, side: -1 },
    { id: 'C', kind: 'g7oCott', x: CX, z: TZ + 0.6, hx: 3.2, hz: 2.8, side: 1 }
  ],
  charges: { tnt: 40 },
  hint: 'A:z+', tip: '', dud: 'Not yet. Two legs side by side!',
  ftip: 'Hit what holds the steel. Two side by side.',
  lesson: { check: [[]] }
};
lvl.sol = [T('A:z+', 0, 0), T('A:z+', 0, 1), T('B:z+', 0, 0), T('C:z+', 0, 0)];
lvl.bot = { hints: [['A', 'A:z+', 1], ['A', 'A:z+', 1], ['A', 'B:z+', 1], ['A', 'C:z+', 1]] };
lvl.hero = lvl.parts.map(p => p.id).join(',');   // the opening frames every building (main/frame.js heroIds), not only the main one
lvl.tntStart = E('TNT', 8);
writeFileSync(new URL('./level.json', import.meta.url), JSON.stringify([lvl], null, 1));
console.log('ok O10', 'pavilion z', TZ, 'villas ±' + CX, 'huts z', SZ);
