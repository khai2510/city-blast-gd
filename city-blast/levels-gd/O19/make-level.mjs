// O19 "Library" (old-polish, play slot 19, replaces old L18 "The Doorstop"). Lesson: aim it, and dark legs take more TNT (rotate +
// dark practice): the book-stack tower must fall forward onto the reading hall; its front legs hide behind the hall: turn the view.
// See 1-GD-SPEC.md. Kit g7oLib / g7oRead / g7oCott (pipeline7/engine.js, g7 OLD POLISH); the blue school is the game's keep6.
// One axis (z): the reading hall in front, the stack tower behind it on the axis, the blue school on the left and a brick house on
// the right (same size, same gap, fronts in line). Tipped back or sideways it misses the hall (or hits the blue).
import { writeFileSync } from 'node:fs';
const E = (k, d) => process.env[k] != null ? +process.env[k] : d;
const TZ = E('TZ', -9), CX = E('CX', 9.8), HZ = E('HZ', -1.6);
const T = (sel, f, i) => ['tnt', sel, f || 0, i || 0];
const lvl = {
  name: 'Library', bp: 'O19', slot: 19, replaces: 'o18', tier: process.env.TIER || 'N', f: 12, kind: 'scene', hero: 'A', heroId: 'G7-O19', teaches: 'rotate',
  target: 0.85, yaw: 0, d: 1, hard7: E('HARD7', 1) ? true : undefined,   // slot 17 on: heavy pieces count until cracked (the dark element is introduced)
  base: { A: { preset: 'stiff-tip', shove: E('SHOVE', 2.5) }, '*': 'weak' },
  sf: [], pattern: 'rotate + dark: the stack tower must fall forward onto the reading hall; its front legs are only reached from the side',
  parts: [
    { id: 'A', kind: 'g7oLib', x: 0, z: TZ, hx: 3.4, gh: 4.4, sh: 3.4, ns: E('NS', 4), heavy: E('HEAVY', 1) },
    { id: 'S', kind: 'g7oRead', x: 0, z: HZ, hx: E('SHX', 5.4), hz: 2.6 },
    { id: 'C', kind: 'g7oCott', x: CX, z: TZ + 0.6, hx: 3.2, hz: 2.8, side: 1 }
  ],
  keeps: [{ kind: 'keep6', x: -CX, z: TZ + 0.6, floors: 3, cx: 3, cz: 3, name: 'the school', role: 'school', fixType: 'school' }],
  keep: { name: 'the school', sides: [], type: 'school', role: 'school', full: 1 },
  // (22/11 run: a wrong-way fall still clears the lot with a clean-up blast, so this is a practice level with the fair bars, not an aim test)
  charges: { tnt: 40 },
  hint: 'A:z+', tip: '', dud: 'Not yet. Two legs side by side!',
  ftip: 'Aim it at the hall. Turn the view.',
  lesson: { check: [[]] }
};
lvl.sol = [T('A:z+', 0, 0), T('A:z+', 0, 1), T('S:z+', 0, 0), T('C:z+', 0, 0)];
lvl.bot = { hints: [['A', 'A:z+', 1], ['A', 'A:z+', 1], ['A', 'S:z+', 1], ['A', 'C:z+', 1]] };
lvl.hero = 'A,S,C';
lvl.tntStart = E('TNT', 15);
writeFileSync(new URL('./level.json', import.meta.url), JSON.stringify([lvl], null, 1));
console.log('ok O19');
