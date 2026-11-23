// O15 "Gas Works" (old-polish, play slot 15, replaces old L19 "Cube Grove"). Lesson: the steel frame stands on brick: two pedestals
// side by side lean it over. See 1-GD-SPEC.md. Kit g7oGas / g7oRetort / g7oWhse (pipeline7/engine.js, g7 OLD POLISH). Brick +
// concrete + steel. One axis (x): the gasholder in the middle (eight brick pedestals, a two-tier steel guide frame round the bell),
// the retort house in front of it on the axis (the landing), a brick meter house each side (same size, same gap, fronts in line).
import { writeFileSync } from 'node:fs';
import { centre } from '../pad-centre.mjs';
// batch 2 (23/11, D-blast-LAUNCH / D-blast-L50: steel launches at 40, levels 1-39 have only wood / brick / concrete / blue / glass /
// barrels / steps; SLOTS-50 slot 6 = wood + brick): NOSTEEL=1 (default) builds the steel guide frame in timber; NOSTEEL=0 = the 22/11 steel build.
const E = (k, d) => process.env[k] != null ? +process.env[k] : d;
const TZ = E('TZ', -8), CX = E('CX', 9.9), SZ = E('SZ', E('NOSTEEL', 1) ? 1.0 : 4.6);
const T = (sel, f, i) => ['tnt', sel, f || 0, i || 0];
const lvl = {
  name: 'Gas Works', bp: 'O15', slot: 15, replaces: 'o19', tier: process.env.TIER || 'N', f: 12, kind: 'scene', hero: 'A', heroId: 'G7-O15', teaches: E('NOSTEEL', 1) ? 'brick' : 'steel',
  target: 0.85, yaw: 0, d: 1,
  base: { A: { preset: 'stiff-tip', shove: E('SHOVE', 2.5) }, '*': 'weak' },
  sf: [], pattern: 'steel on brick: two brick pedestals side by side lean the steel guide frame over onto the retort house',
  parts: [
    { id: 'A', kind: 'g7oGas', noSteel: E('NOSTEEL', 1) ? 'wood' : 0, x: 0, z: TZ, r: E('R', 4.2), ph: E('PH', 2.4), sh: E('SH', 6.0) },
    { id: 'S', kind: 'g7oRetort', x: 0, z: SZ, hx: E('SHX', 5.6), hz: 2.2, h: 3.4 },
    { id: 'B', kind: 'g7oWhse', x: -CX, z: TZ, hx: 3.2, hz: 3.0, nb: 3 },
    { id: 'C', kind: 'g7oWhse', x: CX, z: TZ, hx: 3.2, hz: 3.0, nb: 3 }
  ],
  charges: { tnt: 40 },
  hint: 'A:z+', tip: '', dud: 'Not yet. Two legs side by side!',
  ftip: E('NOSTEEL', 1) ? 'It stands on brick. Break two side by side.' : 'Steel stands on brick. Break two side by side.',
  lesson: { check: [[]] }
};
lvl.sol = [T('A:z+', 0, 0), T('A:z+', 0, 1), T('B:z+', 0, 0), T('C:z+', 0, 0)];
lvl.bot = { hints: [['A', 'A:z+', 1], ['A', 'A:z+', 1], ['A', 'B:z+', 1], ['A', 'C:z+', 1]] };
lvl.hero = lvl.parts.map(p => p.id).join(',');   // the opening frames every building (main/frame.js heroIds), not only the main one
lvl.tntStart = E('TNT', 17);
if (E('NOSTEEL', 1)) { lvl.sol.push(T('S:z+', 0, 0)); lvl.bot.hints.push(['A', 'S:z+', 1]);   // the timber frame drops in place, so the retort takes its own TNT (one blast)
  lvl.batch = 2; lvl.launch = { el: ['wood', 'brick'], slot: 6, before: ['brick', 'concrete', 'steel'] }; }
if (!E('NOPAD', 0)) centre(lvl);   // D-blast-PAD (Khai 23/11): the scene centred on the sand pad (a rigid shift)
writeFileSync(new URL('./level.json', import.meta.url), JSON.stringify([lvl], null, 1));
console.log('ok O15');
