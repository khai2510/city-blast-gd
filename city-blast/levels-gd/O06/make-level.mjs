// O06 "Harbour Crane" (old-polish, play slot 6, replaces old L8 "Rivet Tower"). Lesson: steel holds; break what it stands on (the
// steel card: its spotlight puts a TNT on a concrete pedestal of the plan). See 1-GD-SPEC.md. Kit g7oCrane / g7oShip / g7oWhse
// (pipeline7/engine.js, g7 OLD POLISH). Wood + brick + concrete + steel. One axis (x): the portal crane on the quay in the middle,
// the coaster moored in front of it on the axis (the landing), a brick warehouse each side (same size, same gap, fronts in line).
// Two concrete pedestals side by side gone (base stiff-tip) and the steel crane topples forward onto the ship (the chain).
import { writeFileSync } from 'node:fs';
const E = (k, d) => process.env[k] != null ? +process.env[k] : d;
const TZ = E('TZ', -6), CX = E('CX', 9.0), SZ = E('SZ', 4.6);
const T = (sel, f, i) => ['tnt', sel, f || 0, i || 0];
const lvl = {
  name: 'Harbour Crane', bp: 'O06', slot: 6, replaces: 'o8', tier: process.env.TIER || 'N', f: 12, kind: 'scene', hero: 'A', heroId: 'G7-O06', teaches: 'steel',
  target: 0.85, yaw: 0, d: 1,
  base: { A: { preset: 'stiff-tip', shove: E('SHOVE', 2.5) }, '*': 'weak' },
  sf: [], pattern: 'steel intro: TNT on the steel legs does little; two concrete pedestals side by side drop the crane forward onto the ship; each warehouse takes its own pier',
  parts: [
    { id: 'A', kind: 'g7oCrane', x: 0, z: TZ, hx: E('HX', 3.2), hz: E('HZ', 2.6), ph: E('PH', 2.6), lh: E('LH', 7.0) },
    { id: 'S', kind: 'g7oShip', x: 0, z: SZ, hx: E('SHX', 5.4), hz: 1.8, h: 2.0 },
    { id: 'B', kind: 'g7oWhse', x: -CX, z: TZ, hx: 3.2, hz: 3.0, nb: E('NB', 3) },
    { id: 'C', kind: 'g7oWhse', x: CX, z: TZ, hx: 3.2, hz: 3.0, nb: E('NB', 3) }
  ],
  charges: { tnt: 40 },
  hint: 'A:z+', tip: '', dud: 'Not yet. Two legs side by side!',
  ftip: 'Steel holds. Break what it stands on.',
  lesson: { check: [[]] }
};
lvl.sol = [T('A:z+', 0, 0), T('A:z+', 0, 1), T('B:z+', 0, 0), T('C:z+', 0, 0)];
lvl.bot = { hints: [['A', 'A:z+', 1], ['A', 'A:z+', 1], ['A', 'B:z+', 1], ['A', 'C:z+', 1]] };
lvl.hero = lvl.parts.map(p => p.id).join(',');   // the opening frames every building (main/frame.js heroIds), not only the main one
lvl.tntStart = E('TNT', 8);
writeFileSync(new URL('./level.json', import.meta.url), JSON.stringify([lvl], null, 1));
console.log('ok O06', 'crane z', TZ, 'warehouses ±' + CX, 'ship z', SZ);
