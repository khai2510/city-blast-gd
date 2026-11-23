// old-polish batch 2 (Agents-Game 23/11): one scene shape for the rebuilt old levels (OLD-POLISH.md "Batch 2"). The main building A on
// the axis (front-on camera, it falls TOWARDS the camera when two legs side by side go), its landing S in front of it, a side building
// each side (B, C: same size, same gap, fronts in line). Each level's make-level.mjs calls scene() with its own parts and numbers.
import { writeFileSync } from 'node:fs';
import { centre } from './pad-centre.mjs';
export const E = (k, d) => process.env[k] != null ? +process.env[k] : d;
export const T = (sel, f, i) => ['tnt', sel, f || 0, i || 0];
export function scene(o){
  const lvl = {
    name: o.name, bp: o.bp, slot: o.slot || 0, replaces: o.replaces, tier: process.env.TIER || o.tier || 'N', f: 12, kind: 'scene', hero: 'A', heroId: 'G7-' + o.bp,
    teaches: o.teaches || null, target: 0.85, yaw: 0, d: 1,
    base: { A: { preset: o.preset || 'stiff-tip', shove: E('SHOVE', o.shove != null ? o.shove : 2.5) }, '*': 'weak' },
    sf: [], pattern: o.pattern, parts: o.parts, charges: { tnt: 40 },
    hint: 'A:z+', tip: '', dud: 'Not yet. Two legs side by side!', ftip: o.ftip, lesson: { check: [[]] }
  };
  if (o.tanks) lvl.tanks = o.tanks;
  if (o.keeps) { lvl.keeps = o.keeps; lvl.keep = { name: 'the school', sides: [], type: 'school', role: 'school', full: 1 }; }
  if (o.faces) lvl.faces = o.faces;
  if (o.dbl) lvl.dbl = 1;
  lvl.sol = o.sol || [T('A:z+', 0, 0), T('A:z+', 0, 1)].concat(o.parts.filter(p => p.id !== 'A').map(p => T(p.id + ':z+', 0, 0)));
  lvl.bot = { hints: lvl.sol.map(e => ['A', e[1], 1]) };
  lvl.hero = o.parts.map(p => p.id).join(',');
  lvl.tntStart = E('TNT', o.tnt);
  if (!E('NOPAD', 0)) centre(lvl);   // D-blast-PAD: the scene centred on the sand pad
  lvl.batch = 2; lvl.launch = o.launch;   // batch 2: elements used and the earliest launch slot (D-blast-LAUNCH), for OLD-POLISH.md
  writeFileSync(new URL('./' + o.bp + '/level.json', import.meta.url), JSON.stringify([lvl], null, 1));
  console.log('ok ' + o.bp + ' ' + o.name + ' -> ' + o.replaces + ', ' + lvl.tntStart + ' TNT, parts ' + lvl.hero + (lvl.pad ? ', pad shift ' + lvl.pad.dx + ',' + lvl.pad.dz + ' r ' + lvl.pad.r : ''));
  return lvl;
}
