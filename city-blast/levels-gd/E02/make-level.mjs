// E02 "Shot Tower" (easy pack, Normal, TEACH). Lesson: break two legs side by side and it tips that way. See 1-GD-SPEC.md.
// Kit g7shot / g7gshed (pipeline7/engine.js). One axis (x): the tower in the middle on 8 legs, a long timber goods shed on
// each side, the same size, the same gap, fronts in line. Whichever side the player opens, the tower lies down along that
// shed (one fall, two buildings). Opened at the front it falls on the empty yard: the shed still stands (a cheap, visible fail).
import { writeFileSync } from 'node:fs';
const TX = 3.4, SG = +(process.env.SG || (process.env.SLOT50 !== '0' ? 2.0 : 2.5)), SX = +(process.env.SX || (process.env.SLOT50 !== '0' ? 4.8 : 7.0)), sx = TX + SG + SX;
// SLOTS-50 (D-blast-L50, 23/11): play slot 5 (N, wood + brick: the RC-in-brick legs are brick, the shaft posts the brick-clad kit posts (g7bk, as E06), the hoppers and cistern plain (no heavy piece before 50), no drop7, one blast). SLOT50=0 = the 22/11 level.
const S50 = process.env.SLOT50 !== '0';
const T = (sel, f, i) => ['tnt', sel, f || 0, i || 0];
const lvl = {
  name: 'Shot Tower', bp: 'E02', tier: 'N', slot: S50 ? 5 : undefined, f: 7, kind: 'scene', hero: 'A', heroId: 'G7-E02', teaches: 'tip',
  target: 0.85, yaw: +(process.env.YAW || 0.12), d: 1, fillMax: 0.73,
  hard7: true,
  // a falling tower crushes what it lands on (hit7 with armor 0.001, never 0: 0 falls back to 0.97 in engine.js; TNT works as usual on these members; a heavy body of
  // another part landing hard within reach breaks them)
  hit7: { keys: ['wpost', 'wwall', 'mdW', 'g7roofL'], armor: 0.001, f: +(process.env.HF || 3), reach: 1.0 },
  // the shaft floors (plain mdB) shrug off TNT while the tower stands (a bomb on the shaft only breaks a wall), and crack with
  // one TNT once they lie in the heap (drop7 as plumbing, as E01): only the legs bring the tower down
  drop7: S50 ? undefined : { keys: ['mdB'], fall: 1.5, armor: 0.97 },
  sf: [], pattern: 'tip: a tall tower on 8 legs; two legs side by side gone = it lies down that way; a long goods shed on each side is the target',
  parts: [
    { id: 'A', kind: 'g7shot', x: 0, z: 0, hx: TX, legH: 5.0, n: +(process.env.NF || 7), hold: 2.0, bg: 41, hop: [0, 2, 4, 6], hopW: 2.6, hopH: 2.2, cis: 2.8, ...(S50 ? { legKey: 'g7bk', postKey: 'g7bk', deck0Key: 'g7bk', heavyKey: 'g7roofL' } : {}) },
    { id: 'B', kind: 'g7gshed', x: -sx, z: 0, hx: SX, hz: 4.0, nx: 5, side: -1, bg: 42 },
    { id: 'C', kind: 'g7gshed', x: sx, z: 0, hx: SX, hz: 4.0, nx: 5, side: 1, bg: 43 }
  ],
  tanks: [],
  charges: { tnt: 40 },
  tip: '',
  ftip: S50 ? 'Two legs side by side tip it.' : 'Neighbouring legs tip it. Heavy pieces still count.',
  sol: S50 ? [T('A:x+', 0, 0), T('A:x+', 0, 1), T('B:z+', 0, 1), T('B:z+', 0, 3)] : []
};
lvl.tntStart = +(process.env.TNT || (S50 ? 11 : 23));   // SLOTS-50 gate 23/11: fair 3/3 at 11, spare 2
// D-blast-PAD (Khai 23/11): every building stands inside the sand pad, the lot centred on the pad centre (0, 0): OX / OZ move the whole lot
const padShift = (l, ox, oz) => { const r = (v) => +(+v).toFixed(2); l.parts.forEach(p => { p.x = r(p.x + ox); p.z = r(p.z + oz); }); (l.keeps || []).forEach(k => { k.x = r(k.x + ox); k.z = r(k.z + oz); }); l.tanks = (l.tanks || []).map(([x, z]) => [r(x + ox), r(z + oz)]); };
if (process.env.SLOT50 !== '0') padShift(lvl, +(process.env.OX || 0), +(process.env.OZ || 0));
writeFileSync(new URL('./level.json', import.meta.url), JSON.stringify([lvl], null, 1));
console.log('ok', 'sheds at ±' + sx.toFixed(2));
