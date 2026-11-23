// E05 "Star Dome" (easy pack, Normal, TEACH: order of work). See 1-GD-SPEC.md. Kit g7obs / g7study (pipeline7/engine.js).
// One axis (x): the observatory in the middle (an eight-sided brick drum with a metal dome), a timber study wing on each side,
// the same size, the same gap, fronts in line. Inside the drum stands the RC telescope pier (hard7v: counted until a bomb
// cracks it) on a stone plinth. While the drum stands no finger reaches the pier: open the shell first, then crack the core.
// The metal dome is heavy (hard7t, as the E04 tiled roofs): it lands whole and needs its own bomb.
import { writeFileSync } from 'node:fs';
const r = +(process.env.R || 5.0), G = +(process.env.G || 1.8), WX = 2.0, wx = r + G + WX;   // compact lot (Lead 22/11: ≈ 24 m wide at most)
// SLOTS-50 (D-blast-L50, 23/11): play slot 36 (N after the steps teach: the telescope pier is plain concrete, the dome brick (no heavy piece before 50), no drop7; it keeps >= 2 blasts). SLOT50=0 = the 22/11 level.
const S50 = process.env.SLOT50 !== '0';
const T = (sel, f, i) => ['tnt', sel, f || 0, i || 0];
const lvl = {
  name: 'Star Dome', bp: 'E05', tier: 'N', slot: S50 ? 36 : undefined, f: 7, kind: 'scene', hero: 'A', heroId: 'G7-E05', teaches: 'core',
  target: 0.85, yaw: +(process.env.YAW || 0.1), d: 1, fillMax: 0.73,
  hard7: true,
  // floors (mdB) shrug off TNT while they stand and crack with one TNT once they lie in the heap (drop7 as plumbing, as E01)
  drop7: S50 ? undefined : { keys: ['mdB'], fall: 1.5, armor: 0.97 },
  sf: [], pattern: 'shell + core: an RC telescope pier (hard7v, counted until cracked) stands free inside a brick drum under a dome; the drum hides it from every view, so the shell comes first, the core after',
  parts: [
    { id: 'A', kind: 'g7obs', x: 0, z: 0, r, h0: +(process.env.H0 || 4.4), h1: +(process.env.H1 || 3.6), core: +(process.env.CW || 1.3), coreKey: process.env.CK || (S50 ? 'concrete' : 'hard7p'), plinth: +(process.env.PL || 1.2), domeKey: process.env.DK || (S50 ? 'bk' : 'hard7t'), oneDome: 1, coreGap: +(process.env.CG ?? 1.2), bg0: 101 },   // HOVER-1123: the pier stops 1.2 m short of the dome, so the dome and upper drum come down with the ground storey (0 = the dome rests on the hidden pier: U-4)
    { id: 'B', kind: 'g7study', x: -wx, z: 0, hx: WX, hz: 3.2, side: -1, bg: 105 },
    { id: 'C', kind: 'g7study', x: wx, z: 0, hx: WX, hz: 3.2, side: 1, bg: 106 }
  ],
  tanks: [],
  charges: { tnt: 40 },
  tip: '',
  ftip: 'Open the shell first. The core still counts.',
  sol: []
};
lvl.tntStart = +(process.env.TNT || (S50 ? 19 : 23));   // SLOTS-50 gate 23/11: 19 (fair 3/3, spare 3-4). HOVER-1123: 23 (the gate on main 31-polish: fair 3/3, spare 3-5)
// D-blast-PAD (Khai 23/11): every building stands inside the sand pad, the lot centred on the pad centre (0, 0): OX / OZ move the whole lot
const padShift = (l, ox, oz) => { const r = (v) => +(+v).toFixed(2); l.parts.forEach(p => { p.x = r(p.x + ox); p.z = r(p.z + oz); }); (l.keeps || []).forEach(k => { k.x = r(k.x + ox); k.z = r(k.z + oz); }); l.tanks = (l.tanks || []).map(([x, z]) => [r(x + ox), r(z + oz)]); };
if (process.env.SLOT50 !== '0') padShift(lvl, +(process.env.OX || 0), +(process.env.OZ || 0));
writeFileSync(new URL('./level.json', import.meta.url), JSON.stringify([lvl], null, 1));
console.log('ok', 'wings at ±' + wx.toFixed(2));
