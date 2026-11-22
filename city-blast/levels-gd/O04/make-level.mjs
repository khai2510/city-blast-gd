// O04 "Fire Station" (old-polish, play slot 4, replaces old L36 "Sail Lot"). Lesson: keep the blue building safe (its card: a look
// spotlight, no tap on it). See 1-GD-SPEC.md. Kit g7oHose / g7oEng / g7oCott (pipeline7/engine.js, g7 OLD POLISH); the school is the
// game's own keep6. Wood + brick (+ blue). One axis (x): the hose tower in the middle, the engine house in front of it on the axis,
// the school (blue) on the left, the crew house on the right (same size, same gap, fronts in line). Two front piers side by side
// and the tower pitches forward onto the engine house, clear of the school; a blast that throws the tower or the crew house about
// hits the blue.
import { writeFileSync } from 'node:fs';
const E = (k, d) => process.env[k] != null ? +process.env[k] : d;
const TZ = E('TZ', -8), CX = E('CX', 8.6), SZ = E('SZ', 4.6);
const T = (sel, f, i) => ['tnt', sel, f || 0, i || 0];
const lvl = {
  name: 'Fire Station', bp: 'O04', slot: 4, replaces: 'o36', tier: process.env.TIER || 'N', f: 12, kind: 'scene', hero: 'A', heroId: 'G7-O04', teaches: 'keep',
  target: 0.85, yaw: 0, d: 1,
  base: { A: { preset: 'stiff-tip', shove: E('SHOVE', 2.5) }, '*': 'weak' },
  sf: [], pattern: 'blue intro: two brick piers tip the hose tower forward onto the engine house, away from the school; the crew house takes its own pier',
  parts: [
    { id: 'A', kind: 'g7oHose', x: 0, z: TZ, hx: E('HX', 2.8), ah: E('AH', 4.6), sh: E('SH', 3.4), ns: E('NS', 3) },
    { id: 'S', kind: 'g7oEng', x: 0, z: SZ, hx: E('SHX', 10.0), hz: 2.2, h: E('SHH', 3.0), nx: E('SNX', 5), bays: E('SBAYS', 4) },
    { id: 'C', kind: 'g7oCott', x: CX, z: TZ + 0.8, hx: 3.2, hz: 2.8, side: 1 }
  ],
  keeps: [{ kind: 'keep6', x: -CX, z: TZ + 0.8, floors: E('KF', 3), cx: E('KCX', 3), cz: E('KCZ', 3), name: 'the school', role: 'school', fixType: 'school' }],
  keep: { name: 'the school', sides: [], type: 'school', role: 'school', full: 1 },
  charges: { tnt: 40 },
  hint: 'A:z+', tip: '', dud: 'Not yet. Two legs side by side!',
  ftip: 'Bring it down in front. Keep the blue safe.',
  lesson: { check: [[T('A:z+', 0, 0), T('A:z+', 0, 1), T('C:x-', 0, 0)]] }
};
lvl.sol = [T('A:z+', 0, 0), T('A:z+', 0, 1), T('S:z+', 0, 0), T('C:z+', 0, 0)];
lvl.bot = { hints: [['A', 'A:z+', 1], ['A', 'A:z+', 1], ['A', 'C:z+', 1]] };
lvl.hero = lvl.parts.map(p => p.id).join(',');   // the opening frames every building (main/frame.js heroIds), not only the main one
lvl.tntStart = E('TNT', 11);
writeFileSync(new URL('./level.json', import.meta.url), JSON.stringify([lvl], null, 1));
console.log('ok O04', 'tower z', TZ, 'school/crew ±' + CX, 'engine house z', SZ);
