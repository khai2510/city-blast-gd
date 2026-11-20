// levels-v6 L13-36 source (generator run of 11/11/2026, brief LEVEL-BRIEF-100.md). Same grammar as src-l1-12.js.
//   node levels6/tools/src-l13-36.js [base.html] [out.html]
// writes ../levels-v6-l13-36.json and the checkpoint = base (round-5 checkpoint, read only) + patch/v11.js + patch/v12.js (12/11: the
// heroes' real masses: kit6 parts, G-dresses, loose bases; L13-36-STATUS.md §9) + these 24 levels
// in slots 13-36 (L1-12 of the base are not touched). Defaults: checkpoints/index-v10d-levels6r5.html -> index-v10f-l13-36.html
'use strict';
const T = (sel, f, i) => ['tnt', sel, f || 0, i || 0];
const M = (id, x, tiers, o) => Object.assign({ id, kind: 'mass', x, tiers }, o || {});
const K = (x, z, floors, cx, cz, type) => ({ kind: 'keep6', x, z: z || 0, floors, cx, cz, fixType: type || 'school', name: 'the ' + (type || 'school'), role: type || 'school' });
const KEEP = (type) => ({ name: 'the ' + (type || 'school'), sides: [], type: type || 'school', role: type || 'school', full: 1 });
const all = (cx, cz, k) => { const o = {}; for (let i = 0; i < cx; i++) for (let j = 0; j < cz; j++) o[i + ',' + j] = k; return o; };
const BIGM = { bay: 3.6, colk: 1.4, st: 0.35, fh: 4.0 }, big = (o) => Object.assign({}, BIGM, o || {}), hero = (o) => Object.assign({ fh: 4.0, colk: 1.2 }, o || {});
// v12 hero modules (measured: 0 bonds cracked at rest): HALL = wide low hall, FAT = fat tower shaft, TWIN = twin towers on a podium
const HALL = (o) => Object.assign({ bay: 4.0, fh: 4.2, colk: 1.6, st: 0.42 }, o || {}), WING = (o) => Object.assign({ bay: 3.0, fh: 4.0, colk: 1.3, st: 0.36 }, o || {}), FAT = (o) => Object.assign({ bay: 4.2, fh: 4.2, colk: 1.6, st: 0.42 }, o || {}), TWIN = (o) => Object.assign({ bay: 3.4, fh: 4.2, colk: 1.4, st: 0.38 }, o || {});
const BOW = (o) => Object.assign({ bay: 3.2, fh: 4.4, colk: 1.4, st: 0.38 }, o || {}), BOWC = (k) => ({ '0,0': k, '1,0': k, '0,3': k, '1,3': k, '0,1': 'none', '1,1': 'none', '0,2': 'none', '1,2': 'none' });
const TOCK = (o) => Object.assign({ bay: 5.0, fh: 4.4, colk: 1.9, st: 0.46 }, o || {});
const SPIRE = (o) => Object.assign({ bay: 3.2, fh: 4.4, colk: 1.3, st: 0.38 }, o || {});
const ST = (cx, cz, f) => ({ f, cx, cz, mat: 'steel', skin: 'open' });   // open steel legs / table
const CUBE = (id, x, z) => M(id, x, [{ f: 1, cx: 3, cz: 3, mat: 'conc', skin: 'open', cols: Object.assign(all(3, 3, 'none'), { '1,1': 'pier' }) }, { f: 2, cx: 3, cz: 3, mat: 'brick', skin: 'alt' }],
  { fh: 4.2, bay: 2.3, z: z || 0, dress: { t: 'F35' } });
const STREET = { at: 3, max: 0.1 };   // the engine fixes these on every level (l6Rules): written for readability
// a slender STEEL-FRAMED tower (every column steel): only two stacked TNT on a leg break it, so an all-at-the-foot, one-TNT-per-member plan
// never brings it down (Owner: foot bombs must not win). Measured: stack on the two legs of one side -> it falls that way, 0-4% left.
// ls = the side AWAY from the legs the plan stacks on: only that half stands loose (v12 P.loose), so no 4 m steel stubs stay up after the fall
const SF = (id, x, z, f, skin, roof, ls) => M(id, x, [{ f: f || 8, cx: 2, cz: 2, mat: 'conc', skin: skin || 'full', g: 'open', cols: all(2, 2, 'steel') }], hero({ z: z || 0, loose: ls, roof: roof || { crown: { t: 'tank' } } }));
// D-blast-NOSTACK (19/11/2026, GD-32): a player cannot put two TNT on one member, so the plans no longer stack. ST2 = one TNT on each of the
// two legs of one face at the foot AND one TNT on each of the same two legs one storey up (4 members, 4 TNT). Measured (gate expert, one blast):
// it drops the steel-legged tower like the old 2 + 2 stack did; the foot + the storey above is what breaks the steel leg (a TNT higher up does not).
const ST2 = (id, side) => [T(id + ':' + side, 0, 0), T(id + ':' + side, 0, 1), T(id + ':' + side, 1, 0), T(id + ':' + side, 1, 1)];
// ---- kit generators (v12 "kit6" parts: explicit member lists; every box is a real member)
const r2 = (v) => Math.round(v * 1000) / 1000;
const KIT = (id, x, z, m, o) => Object.assign({ id, kind: 'kit6', x, z: z || 0, m: m.map(q => q.map(v => typeof v === 'number' ? r2(v) : v)) }, o || {});
// stepped glass pyramid: each step = 4 dark corner piers + one deck plate + glass panes between the piers (glass carries nothing)
const ZIG = (id, x, z, o) => { o = o || {}; const S = o.s || [17, 13, 9, 5], H = o.h || 4.2, st = o.st || 0.4, pw = o.pw || 1.0, m = [];
  S.forEach((s, k) => { const y0 = k * H, h = s / 2, c = h - pw / 2, ch = H - st;
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(q => m.push([k < (o.rcF || 1) ? 'rc' : (o.up || 'concrete'), q[0] * c, y0 + ch / 2, q[1] * c, pw, ch, pw, k, q[0] > 0 ? 1 : 0, q[1] > 0 ? 1 : 0]));
    m.push([o.deck || 'tdeck', 0, y0 + ch + st / 2, 0, s, st, s, k]);
    // curtain wall: the panes hang OUTSIDE the deck edge, fixed to the deck only (never under it: glass carries nothing)
    const len = s - 2 * pw - 0.04, n = Math.max(1, Math.ceil(len / (o.pane || 4.4))), seg = len / n, e = h + 0.06, ph = H - 0.1, py = y0 + 0.05 + ph / 2;
    for (let i = 0; i < n; i++) { const u = -len / 2 + seg * (i + 0.5);
      m.push(['glass', u, py, e, seg - 0.02, ph, 0.1, k], ['glass', u, py, -e, seg - 0.02, ph, 0.1, k], ['glass', e, py, u, 0.1, ph, seg - 0.02, k], ['glass', -e, py, u, 0.1, ph, seg - 0.02, k]); } });
  return KIT(id, x, z, m, { base: [S[0] + 1.2, S[0] + 1.2], fh: H, dress: o.dress }); };
// A-frame bridge pylons (F17): two leaning legs of stepped members that meet under a head block, a crossbeam under the deck.
// The legs are steel all the way up (`sf` segments; stack two TNT: a single TNT above the foot does nothing either). Pylons at x = xs; the A stands across the deck (legs at z = +/-).
const PYL = (id, x, z, o) => { o = o || {}; const xs = o.xs || [-7, 7], n = o.n || 7, sh = o.sh || 4.0, s0 = o.s0 || sh, Y = (k) => k ? s0 + (k - 1) * sh : 0, HH = (k) => k ? sh : s0, zb = o.zb || 4.6, dz = o.dz || 0.62, lw = o.lw || 1.0, ld = o.ld || 1.3, sf = o.sf == null ? 99 : o.sf, kb = o.kb || 2, m = [];
  xs.forEach((px, pi) => { [-1, 1].forEach(sg => { for (let k = 0; k < n; k++) { const st = k < sf, w = lw, d = ld;
      m.push([st ? 'steel' : 'concrete', px, Y(k) + HH(k) / 2, sg * (zb - dz * k), w, HH(k), d, k, pi, sg > 0 ? 1 : 0]); } });
    const zi = zb - dz * kb - ld / 2;   // crossbeam between the legs, in segment kb (the deck sits on it)
    m.push(['tdeck', px, Y(kb) + 0.8, 0, lw, 0.8, 2 * zi, kb]);
    const zt = zb - dz * (n - 1) + ld / 2; m.push(['tdeck', px, Y(n) + (o.head || 6) / 2, 0, lw, o.head || 6, 2 * zt, n]); });
  return KIT(id, x, z, m, { base: [xs[xs.length - 1] - xs[0] + 3, 2 * zb + 2.4], fh: sh, dress: o.dress, loose: o.loose, xs, deckY: Y(kb) + 1.2 }); };
// the road deck of a bridge (steel plates: TNT cannot break them) from x0 to x1 with joints at `cuts`, top at y; and its end piers
const DECK = (id, x, z, o) => { const xs = [o.x0].concat(o.cuts || [], [o.x1]), m = [], th = o.th || 0.5;
  for (let i = 0; i < xs.length - 1; i++) m.push(['sdeck', (xs[i] + xs[i + 1]) / 2, o.y - th / 2, 0, xs[i + 1] - xs[i], th, o.wd || 5, o.fl || 2]);
  return KIT(id, x, z, m, { base: [2, 2], fh: 4, dress: o.dress }); };
const PIERS = (id, x, z, o) => KIT(id, x, z, o.xs.map((px, i) => ['concrete', px, o.h / 2, 0, o.w || 1.4, o.h, o.d || 4.6, 0, i, 0]), { base: [o.xs[o.xs.length - 1] - o.xs[0] + 3, (o.d || 4.6) + 1], fh: 4, dress: o.dress });
// lattice tower on THREE splayed legs (F03, F1b): each leg = stepped steel members leaning in, a deck on the leg tops, a tapering
// shaft of small storeys (4 posts + a plate each) and a glass cabin on top. The lattice bracing is drawn (G03).
const TRI = (id, x, z, o) => { o = o || {}; const nL = o.nL || 4, sh = o.sh || 3.6, R0 = o.r || 6.4, dr = o.dr || 0.75, lw = o.lw || 1.1, ang = o.ang || [0, 120, 240], m = [];
  ang.forEach((a, li) => { const c = Math.cos(a * Math.PI / 180), sn = Math.sin(a * Math.PI / 180); for (let k = 0; k < nL; k++) m.push(['steel', c * (R0 - dr * k), k * sh + sh / 2, sn * (R0 - dr * k), lw, sh, lw, k, li, 0]); });
  let y = nL * sh; const dw = o.deck || 2 * (R0 - dr * (nL - 1)) + 2.4; m.push(['tdeck', 0, y + 0.3, 0, dw, 0.6, dw, nL]); y += 0.6;
  (o.shaft || [[2.6, 4.4], [2.0, 4.4], [1.5, 4.4]]).forEach((q, k) => { const hw = q[0], h = q[1], fl = nL + 1 + k;
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(c => m.push(['steel', c[0] * hw, y + (h - 0.4) / 2, c[1] * hw, 0.6, h - 0.4, 0.6, fl]));
    m.push(['tdeck', 0, y + h - 0.2, 0, 2 * hw + 1.2, 0.4, 2 * hw + 1.2, fl]); y += h; });
  const cw = o.cab || 1.9, ch = o.cabH || 3.4, fl = nL + 5;   // the cabin: 4 posts, glass between them, a roof plate
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(c => m.push(['steel', c[0] * cw, y + (ch - 0.4) / 2, c[1] * cw, 0.5, ch - 0.4, 0.5, fl]));
  [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(c => m.push(['glass', c[0] * cw, y + (ch - 0.4) / 2, c[1] * cw, c[0] ? 0.1 : 2 * cw - 0.56, (ch - 0.4) * 0.96, c[0] ? 2 * cw - 0.56 : 0.1, fl]));
  m.push(['tdeck', 0, y + ch - 0.2, 0, 2 * cw + 1.6, 0.4, 2 * cw + 1.6, fl]);
  return KIT(id, x, z, m, { base: [2 * R0 + 2.4, 2 * R0 + 2.4], fh: sh, dress: o.dress, loose: o.loose, legs: { ang, nL, sh, R0, dr, lw }, topY: y + ch }); };
// a cube house on ONE grey concrete pole (F35, as on the tile): the pole, the floor and roof plates and the four walls are real members
const CUBEK = (id, x, z, o) => { o = o || {}; const ph = o.ph || 8.4, pw = o.pw || 1.5, w = o.w || 6.0, h = o.h || 4.6, t = 0.4, y = ph, e = w / 2 - t / 2;
  return KIT(id, x, z, [['concrete', 0, ph / 2, 0, pw, ph, pw, 0, 1, 1], ['slab', 0, y + t / 2, 0, w, t, w, 1],
    ['bkw', 0, y + t + h / 2, e, w, h, t, 1], ['bkw', 0, y + t + h / 2, -e, w, h, t, 1], ['bkw', e, y + t + h / 2, 0, t, h, w - 2 * t, 1], ['bkw', -e, y + t + h / 2, 0, t, h, w - 2 * t, 1],
    ['slab', 0, y + t + h + t / 2, 0, w, t, w, 2]], { base: [w * 0.6, w * 0.6], fh: ph, dress: { t: 'G35' } }); };
// wedge corner block (F24 "The Doorstop"): a REAL wedge plan: five column lines whose depth grows from the flat-cut nose (x-) to the
// back; brick columns front / back on every line (gi = line, gj = 1 front, 0 back), one floor plate per bay, brick panels on both faces.
const WEDGE = (id, x, z, o) => { o = o || {}; const X = o.x || [-6, -3, 0, 3, 6], D = o.d || [2.4, 3.8, 5.2, 6.4, 6.4], F = o.f || 8, fh = o.fh || 4.2, st = 0.36, ch = fh - st, cw = 0.8, m = [];
  for (let f = 0; f < F; f++) { const y0 = f * fh;
    X.forEach((xi, i) => [1, -1].forEach(sg => m.push(['bk', xi, y0 + ch / 2, sg * (D[i] / 2 - cw / 2), cw, ch, cw, f, i, sg > 0 ? 1 : 0])));
    for (let i = 0; i < X.length - 1; i++) { const x0 = X[i] - (i === 0 ? cw / 2 : 0), x1 = X[i + 1] + (i === X.length - 2 ? cw / 2 : 0), d = D[i + 1];
      m.push(['slab', (x0 + x1) / 2, y0 + ch + st / 2, 0, x1 - x0, st, d, f]);
      [1, -1].forEach(sg => { const full = (i + f + (sg > 0 ? 0 : 1)) % 2 === 0, h = full ? ch - 0.05 : 0.95; m.push(['bkw', (X[i] + X[i + 1]) / 2, y0 + h / 2, sg * (d / 2 - 0.15), X[i + 1] - X[i] - cw - 0.04, h, 0.3, f]); }); }
    [0, X.length - 1].forEach(i => { const len = D[i] - 2 * cw - 0.04; if (len > 0.4) m.push(['bkw', X[i] + (i ? 1 : -1) * (cw / 2 - 0.15), y0 + (ch - 0.05) / 2, 0, 0.3, ch - 0.05, len, f]); }); }
  return KIT(id, x, z, m, { base: [X[X.length - 1] - X[0] + 2, D[D.length - 1] + 1.2], fh, dress: o.dress, loose: o.loose, wedge: { X, D, F } }); };
const LEVELS = [
  // ---- HARBOUR (L13-20) ----
  // 13 R · LESSON 5: STACK two TNT on a steel leg. "Harp Span" (F17: cable-stayed bridge, TWO grey concrete A-frame pylons as on the tile;
  // v12 kit: every leg segment, crossbeam, deck plate and end pier is a real member, the fan cables are drawn). The bridge is plain
  // concrete: one TNT on the front leg of each pylon and on each end pier. The LESSON stands beside it (Owner 12/11: tune with the
  // surroundings, never the hero): a tank tower on steel legs behind the bridge: one TNT never breaks steel, two on the same leg do.
  { name: 'Harp Span', f: 10, tier: 'R', kind: 'scene', arch: 'legs', hero: 'A,S,E', heroId: 'F17', teaches: 'Steel is tough: legs on two storeys, one blast',   // 19/11 GD-41: no stacking (D-blast-NOSTACK); 20/11 GD-42: the two-storey rule
    parts: [PYL('A', 0, 0, { s0: 2.4, n: 8, dz: 0.54, kb: 3, sf: 0, lw: 1.3, ld: 1.5, dress: { t: 'G17' } }),
      DECK('S', 0, 0, { x0: -17, x1: 17, cuts: [-12, -7, 0, 7, 12], y: 12.1, wd: 4.4, fl: 3, dress: { t: 'G17d' } }),
      PIERS('E', 0, 0, { xs: [-16.3, 16.3], h: 11.6, dress: { t: 'G17p' } }),
      SF('F', 0, -14, 6, 'full', undefined, 'z+')],
    // GD-42 (20/11 tester round): the old fail line ("Steel is tough. Hit more legs, one TNT each.") sent a player to more legs, spread over
    // blasts (steel resets at every BLAST) or all four feet: both fail (53-55%). What breaks this tower (and every steel-legged tower of
    // L14-34, ST2) is two legs AND the same legs one storey up, in ONE blast. The fail line and the tip now say that; the gate's sensible
    // reading follows it (old hints = the removed "stack two" tip). Relief band: TNT 10 -> 9 (expert 8, 1 spare).
    charges: { tnt: 9 }, target: 0.85, yaw: 0.8, hint: 'F:z-', tip: 'Steel is tough.\nTwo storeys, one blast.', ftip: 'Steel: hit its legs on two storeys, one blast.',
    sol: [T('A:z+', 0, 0), T('A:z+', 0, 1), T('E:x-', 0, 0), T('E:x+', 0, 0), T('F:z-', 0, 0), T('F:z-', 0, 1), T('F:z-', 1, 0), T('F:z-', 1, 1)],
    lesson: { check: [[T('A:z+', 0, 0), T('A:z+', 0, 1), T('E:x-', 0, 0), T('E:x+', 0, 0), T('F:z-', 0, 0), T('F:z-', 0, 1), T('F:z+', 0, 0), T('F:z+', 0, 1)]] },
    bot: { hints: [['A', 'A:z+', 1], ['A', 'A:z+', 1], ['A', 'E:x-', 1], ['A', 'E:x+', 1], ['A', 'F:z-', 1], ['A', 'F:z-', 1], ['A', '@1:F:z-', 1], ['A', '@1:F:z-', 1]] }, d: 1 },
  // 14 N · practise the stack + DOMINO. "Stripey Light" (F28: a FAT banded lighthouse: real 5 m shaft, 4 m bays) at the left end of a
  // boathouse row; it tips down the row. At the far end a gantry crane on steel legs: stack. A brick hall behind (one TNT in the middle of
  // each long side takes its whole ground storey).
  { name: 'Stripey Light', f: 10, tier: 'N', kind: 'scene', arch: 'row', hero: 'A', heroId: 'F28', teaches: null,
    parts: [M('A', -11, [{ f: 2, cx: 2, cz: 2, mat: 'brick', skin: 'full', g: 'alt' }, { f: 2, cx: 2, cz: 2, mat: 'conc', skin: 'full' }, { f: 2, cx: 2, cz: 2, mat: 'brick', skin: 'full' }, { f: 2, cx: 2, cz: 2, mat: 'conc', skin: 'full' }], { bay: 4.0, fh: 3.6, colk: 1.6, st: 0.42, dress: { t: 'G28' } }),
      M('B', -2.6, [{ f: 4, cx: 2, cz: 2, mat: 'wood', skin: 'alt' }], { bay: 3.4, fh: 4.0 }), M('C', 3.6, [{ f: 3, cx: 2, cz: 2, mat: 'wood', skin: 'alt' }], { bay: 3.4, fh: 4.0 }),
      M('D', 10.2, [ST(2, 2, 2), { f: 4, cx: 2, cz: 2, mat: 'conc', skin: 'full' }], hero({ loose: 'x-', roof: { cap: 1, ac: 1 } })),
      M('E', 0, [{ f: 5, cx: 3, cz: 2, mat: 'brick', skin: 'alt' }], WING({ z: -12, roof: { cap: 1 } }))],
    charges: { tnt: 9 }, target: 0.85, yaw: 0.3, hint: 'A:x+', tip: 'Tip it down the row.\nStack on steel.', ftip: 'Two TNT per steel leg.',
    sol: [T('A:x+', 0, 0), T('A:x+', 0, 1), T('D:x+', 0, 0), T('D:x+', 0, 1), T('D:x+', 1, 0), T('D:x+', 1, 1), T('E:z-', 0, 1), T('E:z+', 0, 1)],
    bot: { hints: [['A', 'A:x+', 1], ['A', 'A:x+', 1], ['A', 'D:x+', 1, 2], ['A', 'D:x+', 1, 2], ['A', 'E:z-', 1], ['A', 'E:z-', 1], ['A', 'E:z-', 1]] }, d: 1 },
  // 15 N · practise the stack + BLAST IN STEPS. "The Sail" (F30: TWO sail towers on one solid podium, as on the tile: plain concrete, no
  // special legs). The practice stands beside it (Owner 12/11: surroundings only): a steel-legged tank tower inside a closed timber boat
  // hall. Blast 1: the sail's back row and the hall. Blast 2: stack on the steel legs, now in sight.
  { name: 'The Sail', f: 10, tier: 'N', kind: 'scene', arch: 'inner', hero: 'A', heroId: 'F30', teaches: null,
    parts: [M('A', -6, [{ f: 1, cx: 5, cz: 2, mat: 'conc', skin: 'sp' }, { f: 8, cx: 2, cz: 2, ox: 0, on: 0, mat: 'conc', skin: 'full' }, { f: 8, cx: 2, cz: 2, ox: 3, on: 0, mat: 'conc', skin: 'full' }], TWIN({ dress: { t: 'G30' } })),
      M('S', 12, [{ f: 1, cx: 5, cz: 5, mat: 'wood', skin: 'full', hole: { i: [1, 3], j: [1, 3] } }], { bay: 3.0, fh: 4.4, z: -2 }),
      SF('Q', 12, -2, 6, 'full', undefined, 'z+')],
    charges: { tnt: 12 }, target: 0.85, yaw: 0.3, hint: 'S:z+', tip: 'Open the hall.\nThen stack on steel.', ftip: 'Hall first. Then the steel legs.',
    sol: [T('A:z-', 0, 0), T('A:z-', 0, 1), T('A:z-', 0, 2), T('A:z-', 0, 3), T('A:z-', 0, 4), T('S:z+', 0, 1), T('S:z+', 0, 3)],
    solW: [[T('A:z-', 0, 0), T('A:z-', 0, 1), T('A:z-', 0, 2), T('A:z-', 0, 3), T('A:z-', 0, 4), T('S:z+', 0, 1), T('S:z+', 0, 3)], [T('Q:z-', 0, 0), T('Q:z-', 0, 1), T('Q:z-', 1, 0), T('Q:z-', 1, 1)]],
    bot: { hints: [['A', 'A:z-', 1], ['A', 'A:z-', 1], ['A', 'A:z-', 1], ['A', 'A:z-', 1], ['A', 'A:z-', 1], ['A', 'S:z+', 1], ['A', 'S:z+', 1], ['A', 'Q:z-', 2, 2], ['A', 'Q:z-', 2, 2]] }, d: 1 },
  // 16 H · Hard (rotate + protected; nothing new) · a hall and two blocks round a hospital. "Dome Hall" (F14: a wide low hall of six bays, a drum
  // and a big dome with a real lantern core, a small dome on each wing: REAL masses) stands behind a blue hospital, a timber block on each
  // side: each must fall AWAY from it. The hall needs its whole back row cut. 8 TNT, one blast (Owner: about 2 minutes).
  { name: 'Dome Hall', f: 10, tier: 'H', hard: true, kind: 'scene', arch: 'c4', hero: 'A', heroId: 'F14', teaches: null,
    parts: [M('A', 0, [{ f: 3, cx: 6, cz: 2, mat: 'conc', skin: 'alt' }, { f: 1, cx: 2, cz: 2, ox: 2, mat: 'conc', skin: 'full' }], HALL({ z: -12.5, loose: 1, spire: [1.3, 8], dress: { t: 'G14' } })),
      M('B', 12, [{ f: 4, cx: 2, cz: 2, mat: 'wood', skin: 'alt' }], { bay: 3.4, fh: 4.0, z: 1 }),
      M('C', -12, [{ f: 4, cx: 2, cz: 2, mat: 'wood', skin: 'alt' }], { bay: 3.4, fh: 4.0, z: 1 })],
    keeps: [K(0, 0, 2, 2, 2, 'hospital')], keep: KEEP('hospital'),
    charges: { tnt: 8 }, target: 0.85, yaw: 0.35, hint: 'A:z-', tip: 'HARD. All fall away\nfrom the hospital.', ftip: 'Outer side of each. The hall: its whole back.',
    sol: [T('A:z-', 0, 0), T('A:z-', 0, 1), T('A:z-', 0, 2), T('A:z-', 0, 3), T('A:z-', 0, 4), T('A:z-', 0, 5), T('B:x+', 0, 0), T('C:x-', 0, 0)],
    bot: { hints: [['A', 'A:z+', 1], ['A', 'A:z+', 1], ['A', 'A:z+', 1], ['A', 'A:z+', 1], ['A', 'A:z+', 1], ['A', 'A:z+', 1], ['A', 'B:x+', 1], ['A', 'C:x-', 1]] }, d: 2 },
  // 17 R · LESSON 6: DARK REINFORCED PIERS, TNT right on each. "The Pedestal" (F21: a giant plinth, no statue; REAL 9 m wide body, solid
  // stone to the ground as on the tile: plain TNT). The LESSON stands beside it (Owner 12/11: surroundings only): a silo block on two
  // storeys of fat dark piers: a dark pier only breaks under its own TNT (one TNT on the middle pier: the block stands).
  { name: 'The Pedestal', f: 10, tier: 'R', kind: 'scene', arch: 'tall-low', hero: 'A', heroId: 'F21', teaches: 'Dark piers: one TNT on each',
    parts: [M('A', -2, [{ f: 6, cx: 3, cz: 2, mat: 'conc', skin: 'full' }], { bay: 4.2, fh: 4.4, colk: 1.6, st: 0.42, dress: { t: 'G21' } }),
      M('P', 13, [{ f: 2, cx: 3, cz: 2, mat: 'conc', skin: 'open', cols: all(3, 2, 'pier') }, { f: 3, cx: 3, cz: 2, mat: 'conc', skin: 'full' }], hero({ bay: 3.0, colk: 1.3, roof: { cap: 1, ac: 1 } })),
      M('C', -15.5, [{ f: 4, cx: 2, cz: 2, mat: 'wood', skin: 'alt' }], { bay: 3.6, fh: 4.0, z: 0 })],
    charges: { tnt: 10 }, target: 0.85, yaw: 0.35, hint: 'P:z+', tip: 'Dark piers:\nTNT on each one.', ftip: 'One TNT on every dark pier.',
    sol: [T('A:z+', 0, 0), T('A:z+', 0, 1), T('A:z+', 0, 2), T('P:z+', 0, 0), T('P:z+', 0, 1), T('P:z+', 0, 2), T('C:x-', 0, 0), T('C:x-', 0, 1)],
    lesson: { check: [[T('A:z+', 0, 0), T('A:z+', 0, 1), T('A:z+', 0, 2), T('P:z+', 0, 1), T('C:x-', 0, 0), T('C:x-', 0, 1)]] },
    bot: { hints: [['A', 'A:z+', 1], ['A', 'A:z+', 1], ['A', 'A:z+', 1], ['A', 'P:z+', 1], ['A', 'P:z+', 1], ['A', 'P:z+', 1], ['A', 'C:x-', 1], ['A', 'C:x-', 1]] }, d: 1 },
  // 18 N · practise dark piers + BLAST IN STEPS. "The Doorstop" (F24: wedge corner block; v12 kit: a REAL wedge plan, 2.4 m at the flat-cut
  // nose to 6.4 m at the back, brick columns, plates and panels): a reinforced core stands behind it, out of sight. Blast 1: the block
  // and the hall. Blast 2: TNT right on the core's piers.
  { name: 'The Doorstop', f: 10, tier: 'N', kind: 'scene', arch: 'hidden', hero: 'A', heroId: 'F24', teaches: null,
    parts: [WEDGE('A', 0, 0, { dress: { t: 'G24' } }),
      M('D', 0, [{ f: 3, cx: 5, cz: 3, mat: 'wood', skin: 'full', hole: { i: [1, 3], j: [0, 2] } }], { bay: 3.6, fh: 4.0, z: -14 }),
      { id: 'R', kind: 'core6', x: 0, z: -14, floors: 9 },
      M('C', 13, [{ f: 5, cx: 2, cz: 2, mat: 'conc', skin: 'alt' }], big({ roof: { cap: 1, ac: 1 } }))],
    charges: { tnt: 10 }, target: 0.85, yaw: 0.45, hint: 'A:z+', tip: 'Look behind it.\nDark piers: TNT on each.', ftip: 'Keep two TNT for the core.',
    sol: [T('A:g:0:1', 0, 0), T('A:g:2:1', 0, 0), T('A:g:4:1', 0, 0), T('C:x+', 0, 0), T('C:x+', 0, 1), T('D:z-', 0, 1), T('D:z-', 0, 3)],
    solW: [[T('A:g:0:1', 0, 0), T('A:g:2:1', 0, 0), T('A:g:4:1', 0, 0), T('C:x+', 0, 0), T('C:x+', 0, 1), T('D:z-', 0, 1), T('D:z-', 0, 3)], [T('R:z-', 0, 0), T('R:z-', 0, 1)]],
    bot: { hints: [['A', 'A:g:0:1', 1], ['A', 'A:g:2:1', 1], ['A', 'A:g:4:1', 1], ['A', 'C:x+', 1], ['A', 'C:x+', 1], ['A', 'D:z-', 1], ['A', 'D:z-', 1], ['A', 'R:z-', 2], ['A', 'R:z-', 2]] }, d: 1 },
  // 19 N · surprise: POP, POP, POP. "Cube Grove" (F35: cube houses on single poles; v12 kit: five BIG cubes in an arc, the pole, the
  // floor, the roof and the four walls of each are real members), each on ONE dark pier (one TNT on each), and a steel tank tower (stack).
  { name: 'Cube Grove', f: 6, tier: 'N', kind: 'scene', arch: 'row', hero: 'A,B,C,E,F', heroId: 'F35', teaches: null,
    parts: [CUBEK('A', 0, 3), CUBEK('B', -8, 1.2), CUBEK('C', 8, 1.2), CUBEK('E', -15.5, -3.2), CUBEK('F', 15.5, -3.2),
      SF('D', 0, -11, 4, 'full', undefined, 'z+')],
    charges: { tnt: 10 }, target: 0.85, yaw: 0.25, hint: 'A:g:1:1', tip: 'One pole, one TNT.\nSteel: stack.', ftip: 'TNT right on each pole.',
    sol: [T('A:g:1:1', 0, 0), T('B:g:1:1', 0, 0), T('C:g:1:1', 0, 0), T('E:g:1:1', 0, 0), T('F:g:1:1', 0, 0), T('D:z-', 0, 0), T('D:z-', 0, 1), T('D:z-', 1, 0), T('D:z-', 1, 1)],
    bot: { hints: [['A', 'A:g:1:1', 1], ['A', 'B:g:1:1', 1], ['A', 'C:g:1:1', 1], ['A', 'E:g:1:1', 1], ['A', 'F:g:1:1', 1], ['A', 'D:z-', 1, 2], ['A', 'D:z-', 1, 2]] }, d: 1 },
  // 20 SH · BOSS (protected + rotate; nothing new). "Big Bow" (F32: steel arch bridge, twin arches, between two squat sandstone pylon
  // PAIRS: each end is one solid stone base, as on the tile, carrying two towers; the road passes between them). Left base: a school in
  // front of it and one behind: it can only fall LEFT (outward). Right base: a hospital behind it: outward too. The steel span comes
  // down with them. 8 TNT, one blast (Owner: about 2 minutes; the hall + hidden core of the earlier build is gone).
  { name: 'Big Bow', f: 10, tier: 'SH', boss: true, kind: 'scene', arch: 'setpiece', hero: 'A,Q,S', heroId: 'F32', teaches: null,
    parts: [M('A', -13, [{ f: 3, cx: 2, cz: 4, mat: 'conc', skin: 'full', cols: { '1,1': 'none', '1,2': 'none' }, colsF: 1 }, { f: 3, cx: 2, cz: 2, oz: 0, on: 0, mat: 'conc', skin: 'full' }, { f: 3, cx: 2, cz: 2, oz: 2, on: 0, mat: 'conc', skin: 'full' }], BOW({ fh: 3.0, dress: { t: 'G32' } })),
      M('Q', 13, [{ f: 3, cx: 2, cz: 4, mat: 'conc', skin: 'full', cols: { '0,1': 'none', '0,2': 'none' }, colsF: 1 }, { f: 3, cx: 2, cz: 2, oz: 0, on: 0, mat: 'conc', skin: 'full' }, { f: 3, cx: 2, cz: 2, oz: 2, on: 0, mat: 'conc', skin: 'full' }], BOW({ fh: 3.0, dress: { t: 'G32' } })),
      { id: 'S', kind: 'arch6', x: 0, z: 0, y: 9 / 2.7, len: 22.1, wd: 2.2, n: 3, rise: 15, span: 22, az: 2.5 }],
    keeps: [K(-13, 9.6, 2, 2, 2, 'school'), K(-13.6, -9.6, 2, 2, 2, 'school'), K(-4, -5.5, 2, 2, 2, 'hospital')], keep: KEEP('school'),
    // GD-31 (19/11): the hospital moved from behind the right pylon to between the pylons, behind the arch (in sight at the opening):
    // it now takes the left pylon's inward fall, so the visible faces alone (inner legs + front legs, 4-6 TNT) no longer win
    // GD-44 (20/11): TNT 8 -> 6 (D-blast-TNTTIGHT: the expert's spare 0-1 holds on every tier and beats the boss TNT band of 12, which would
    // be all spare here). Three legs of each outer row win (98%); two per pylon fail on blue (28%), one row alone 29%. The margin stays +13:
    // once both pylons fall outward everything is down (no volume the plan cannot reach); see the 20/11 report.
    charges: { tnt: 6 }, target: 0.85, yaw: 0.4, hint: 'A:x-', tip: 'BOSS! Each pylon\nhas one way down.', ftip: 'Both fall outward: the whole outer row.',
    sol: [T('A:x-', 0, 0), T('A:x-', 0, 1), T('A:x-', 0, 3), T('Q:x+', 0, 0), T('Q:x+', 0, 1), T('Q:x+', 0, 3)],
    bot: { hints: [['A', 'A:z+', 1], ['A', 'A:z+', 1], ['A', 'A:x-', 1], ['A', 'A:x-', 1], ['A', 'Q:z-', 1], ['A', 'Q:z-', 1], ['A', 'Q:x+', 1], ['A', 'Q:x+', 1]] }, d: 2 },
  // ---- DOWNTOWN (L21-30) ----
  // 21 R · LESSON 7: KEEP THE ROAD CLEAR (street rubble max 10%). "The Stepper" (F22: setback tower with a lantern top: the setbacks are
  // REAL tiers, 4 -> 3 -> 2 bays) and two blocks stand on the road; the yard is behind. Blast the BACK of each: it falls into the yard.
  { name: 'The Stepper', f: 10, tier: 'R', kind: 'scene', arch: 'tall-low', hero: 'A', heroId: 'F22', teaches: 'Keep the road clear: fall into the yard',
    parts: [M('A', 0, [{ f: 3, cx: 4, cz: 2, mat: 'conc', skin: 'alt' }, { f: 3, cx: 3, cz: 2, ox: 0.5, mat: 'conc', skin: 'alt' }, { f: 3, cx: 2, cz: 2, ox: 1, mat: 'conc', skin: 'alt' }], { bay: 3.3, fh: 3.8, colk: 1.3, st: 0.38, dress: { t: 'G22' } }),
      SF('B', -11.5, -4, 7, 'alt', { cap: 1, ac: 1 }, 'z+'),
      M('C', 12, [{ f: 4, cx: 2, cz: 2, mat: 'wood', skin: 'alt' }], { bay: 3.4, fh: 4.0 })],
    street: STREET, charges: { tnt: 10 }, target: 0.85, yaw: 0.3, hint: 'A:z-', tip: 'Keep the road clear.', ftip: 'Blast the back. Fall into the yard.',
    sol: [T('A:z-', 0, 0), T('A:z-', 0, 3), T('A:z-', 0, 1), T('C:z-', 0, 0)].concat(ST2('B', 'z-')),
    lesson: { check: [[T('A:z+', 0, 0), T('A:z+', 0, 3), T('A:z+', 0, 1), T('C:z+', 0, 0)].concat(ST2('B', 'z+'))] },
    bot: { hints: [['A', 'A:z-', 1], ['A', 'A:z-', 1], ['A', 'A:z-', 1], ['A', 'B:z-', 1, 2], ['A', 'B:z-', 1, 2], ['A', 'C:z-', 1]] }, d: 1 },
  // 22 N · practise the road + turn the view. "The Pencil" (F26: a cream needle tower with a long pyramid point and ONE wing: the wing is a
  // real lower block beside the shaft): it falls back onto the block behind it; every building's safe side is its back.
  { name: 'The Pencil', f: 10, tier: 'N', kind: 'scene', arch: 'canyon', hero: 'A', heroId: 'F26', teaches: null,
    parts: [M('A', 0, [{ f: 5, cx: 3, cz: 2, mat: 'conc', skin: 'full' }, { f: 4, cx: 2, cz: 2, ox: 0, mat: 'conc', skin: 'full' }], { bay: 3.6, fh: 4.0, colk: 1.4, st: 0.4, dress: { t: 'G26' } }),
      M('B', 1, [{ f: 6, cx: 2, cz: 2, mat: 'conc', skin: 'alt' }], big({ z: -10, loose: 1, roof: { cap: 1, ac: 2 } })),
      M('C', 12.5, [{ f: 4, cx: 2, cz: 2, mat: 'wood', skin: 'alt' }], { bay: 3.4, fh: 4.0, z: -2 }),
      SF('D', -11, -2, 7, 'full', { crown: { t: 'tank' } }, 'z+')],
    street: STREET, charges: { tnt: 11 }, target: 0.85, yaw: 0.35, hint: 'A:z-', tip: 'Road in front.\nBlast every back.', ftip: 'Turn the view. Blast the backs.',
    sol: [T('A:z-', 0, 0), T('A:z-', 0, 1), T('A:z-', 0, 2), T('B:z-', 0, 0), T('B:z-', 0, 1), T('C:z-', 0, 0)].concat(ST2('D', 'z-')),
    bot: { hints: [['A', 'A:z-', 1], ['A', 'A:z-', 1], ['A', 'A:z-', 1], ['A', 'B:z-', 1], ['A', 'B:z-', 1], ['A', 'C:z-', 1], ['A', 'D:z-', 1, 2], ['A', 'D:z-', 1, 2]] }, d: 1 },
  // 23 N · practise the road + DOMINO away from it. "Tube Bundle" (F34: square tubes of different heights bundled together: the tubes are
  // real nested tiers of 4 heights, a drawn head makes the fifth) stands on the road; a row of blocks runs back from it. Blast its back:
  // the whole row goes, away from the road.
  { name: 'Tube Bundle', f: 11, tier: 'N', kind: 'scene', arch: 'row', hero: 'A', heroId: 'F34', teaches: null,
    parts: [M('A', 0, [{ f: 3, cx: 4, cz: 3, mat: 'conc', skin: 'full' }, { f: 2, cx: 3, cz: 3, ox: 0, oz: 0, mat: 'conc', skin: 'full' }, { f: 2, cx: 3, cz: 2, ox: 0, oz: 0, mat: 'conc', skin: 'full' }, { f: 2, cx: 2, cz: 2, ox: 1, oz: 0, mat: 'conc', skin: 'full' }], { bay: 3.4, fh: 4.0, colk: 1.4, st: 0.4, dress: { t: 'G34', caps: [[2, 1, 4.2]] } }),
      M('B', 0, [{ f: 4, cx: 3, cz: 2, mat: 'brick', skin: 'alt' }], big({ z: -12.5, roof: { cap: 1 } })),
      M('C', 0, [{ f: 3, cx: 3, cz: 2, mat: 'wood', skin: 'alt' }], { bay: 3.0, fh: 4.0, z: -21 }),
      SF('D', 12, -6, 7, 'alt', { cap: 1, ac: 1 }, 'z+')],
    street: STREET, charges: { tnt: 11 }, target: 0.85, yaw: 0.75, hint: 'A:z-', tip: 'Tip it down the row,\naway from the road.', ftip: 'Blast its back. The row follows.',
    sol: [T('A:z-', 0, 0), T('A:z-', 0, 1), T('A:z-', 0, 2), T('A:z-', 0, 3), T('C:z-', 0, 1)].concat(ST2('D', 'z-')),
    bot: { hints: [['A', 'A:z-', 1], ['A', 'A:z-', 1], ['A', 'A:z-', 1], ['A', 'A:z-', 1], ['A', 'D:z-', 1, 2], ['A', 'D:z-', 1, 2], ['A', 'C:z-', 1], ['A', 'B:z-', 1]] }, d: 1 },
  // 24 H · Hard (road + protected; nothing new). "Deco Needle" (F16: stepped crown tower on its REAL wide base, 3 x 2 bays under a 2 x 2
  // shaft, plain grey stone): a hospital on its left, a school on its right, the road in front: it can only fall BACK. Tuned by the
  // surroundings only: the protected buildings stand 11 m out, three timber blocks behind the building line. 7 TNT, one blast.
  { name: 'Deco Needle', f: 10, tier: 'H', hard: true, kind: 'scene', arch: 'plaza', hero: 'A', heroId: 'F16', teaches: null,
    parts: [M('A', 0, [{ f: 3, cx: 3, cz: 2, mat: 'conc', skin: 'alt' }, { f: 6, cx: 2, cz: 2, ox: 0.5, mat: 'conc', skin: 'alt' }], { bay: 3.2, fh: 4.0, colk: 1.3, st: 0.38, z: -3.5, dress: { t: 'G16' } }),
      M('B', -17, [{ f: 4, cx: 3, cz: 2, mat: 'wood', skin: 'alt' }], { bay: 3.0, fh: 4.0, z: -8 }),
      M('C', 16.5, [{ f: 4, cx: 2, cz: 2, mat: 'wood', skin: 'alt' }], { bay: 3.4, fh: 4.0, z: -8 }),
      M('G', 0, [{ f: 3, cx: 3, cz: 2, mat: 'wood', skin: 'alt' }], { bay: 3.0, fh: 4.0, z: -14 })],
    keeps: [K(-11, -3.5, 2, 2, 2, 'hospital'), K(11, -3.5, 2, 2, 2, 'school')], keep: KEEP('hospital'),
    street: STREET, charges: { tnt: 7 }, target: 0.85, yaw: 0.3, hint: 'A:z-', tip: 'HARD. Only one way\nis open.', ftip: 'Blast the whole back row.',
    sol: [T('A:z-', 0, 0), T('A:z-', 0, 1), T('A:z-', 0, 2), T('B:z-', 0, 1), T('C:z-', 0, 0), T('G:z-', 0, 1)],
    bot: { hints: [['A', 'A:z+', 1], ['A', 'A:z+', 1], ['A', 'A:z+', 1], ['A', 'B:z-', 1], ['A', 'C:z-', 1], ['A', 'G:z-', 1]] }, d: 2 },
  // 25 R · LESSON 8: GLASS holds nothing. "Glass Point" (F06, F1b tile: a stepped glass pyramid before two palace wings). The pyramid
  // is REAL (v12 kit ZIG): four steps, each a deck on four corner piers with glass hung outside the deck edge. TNT on a pane only breaks
  // glass; the four dark piers of the ground step carry all of it. Two brick palace wings behind (the tile's wings): plain TNT.
  // GD-33 / GD-9 (20/11): the brick wings stood on bare physics: a TNT on an end pier left a stub, so the gate's sensible plan (and the
  // tester, 87.8%) won by +3. Base type 'weak' (D-blast-MATCURVE, as every L6-12 ladder neighbour): one lost pier and a wing goes that
  // way: sensible 97%, the frame (4 dark piers) still needed (3 corners + bricks 79%). TNT 10 -> 8 (relief band 7-9; expert 8, 0 spare).
  { name: 'Glass Point', f: 10, tier: 'R', kind: 'scene', arch: 'inner', hero: 'A,B,C', heroId: 'F06', teaches: 'Glass holds nothing: hit the dark frame', base: { B: 'weak', C: 'weak' },
    parts: [ZIG('A', 0, 2.5, { h: 4.8, dress: { t: 'G06' } }),
      M('B', -8.8, [{ f: 5, cx: 3, cz: 2, mat: 'brick', skin: 'alt' }], WING({ z: -13, dress: { t: 'G06w' } })),
      M('C', 8.8, [{ f: 5, cx: 3, cz: 2, mat: 'brick', skin: 'alt' }], WING({ z: -13, dress: { t: 'G06w' } }))],
    // GD-33 (19/11): opening yaw 0.3 -> 4.0 (main/frame.js OVR[25]): three of the four dark corners (#3, #1, #2) and both brick towers'
    // bases face the camera; the hidden corner (#4) is the one the level is still won without
    charges: { tnt: 8 }, target: 0.85, yaw: 4.0, hint: 'A:x-', tip: 'Glass holds nothing.\nHit the dark frame.', ftip: 'TNT on the four dark piers.',
    sol: [T('A:x-', 0, 0), T('A:x-', 0, 1), T('A:x+', 0, 0), T('A:x+', 0, 1), T('B:z-', 0, 1), T('B:z+', 0, 1), T('C:z-', 0, 1), T('C:z+', 0, 1)],
    lesson: { check: [[T('A:wx-', 0, 0), T('A:wx-', 0, 1), T('A:wz+', 0, 0), T('A:wz+', 0, 1), T('B:z-', 0, 1), T('B:z+', 0, 1), T('C:z-', 0, 1), T('C:z+', 0, 1)]] },
    bot: { hints: [['A', 'A:x-', 1], ['A', 'A:x-', 1], ['A', 'A:x+', 1], ['A', 'A:x+', 1], ['A', 'B:z-', 1], ['A', 'B:z-', 1], ['A', 'C:z-', 1], ['A', 'C:z-', 1]] }, d: 1 },
  // 26 N · practise glass + the stack. "The Bullet" (F25: a FAT round-topped glass barrel with a diagonal grid; real 7.6 m body on four
  // plain concrete legs: one TNT each). The practice is beside it (Owner 12/11: surroundings only): the glass block on the right has a
  // steel frame behind its glass on the two lowest storeys: stack through the glass.
  { name: 'The Bullet', f: 10, tier: 'N', kind: 'scene', arch: 'tall-low', hero: 'A', heroId: 'F25', teaches: null,
    parts: [M('A', 0, [{ f: 7, cx: 2, cz: 2, mat: 'conc', skin: 'glass' }], { bay: 6.4, fh: 4.8, colk: 2.0, st: 0.5, loose: 1, dress: { t: 'G25' } }),
      M('B', 12, [{ f: 5, cx: 2, cz: 2, mat: 'conc', skin: 'glass', cols: all(2, 2, 'steel'), colsF: 2 }], big({ z: -1, loose: 'x-', roof: { cap: 1, ac: 2 } })),
      M('C', -11.5, [{ f: 4, cx: 2, cz: 2, mat: 'brick', skin: 'alt' }], big({ loose: 1, roof: { cap: 1 } })),
      M('D', 0, [{ f: 3, cx: 3, cz: 2, mat: 'wood', skin: 'alt' }], { bay: 3.0, fh: 4.0, z: -13 })],
    charges: { tnt: 10 }, target: 0.85, yaw: 0.3, hint: 'B:x+', tip: 'Steel behind glass:\nstack on it.', ftip: 'Two TNT on each steel leg.',
    sol: [T('A:z-', 0, 0), T('A:z-', 0, 1), T('B:x+', 0, 0), T('B:x+', 0, 1), T('B:x+', 1, 0), T('B:x+', 1, 1), T('C:x-', 0, 0), T('C:x-', 0, 1), T('D:z-', 0, 1)],
    bot: { hints: [['A', 'A:z-', 1], ['A', 'A:z-', 1], ['A', 'B:x+', 1, 2], ['A', 'B:x+', 1, 2], ['A', 'C:x-', 1], ['A', 'C:x-', 1], ['A', 'D:z-', 1]] }, d: 1 },
  // 27 N · practise glass + DOMINO through three materials. "The Splinter" (F31: tall glass shard that really tapers, 3x3 -> 2x2 bays,
  // split point) tips down a row: a glass block, a brick block, a timber hall.
  { name: 'The Splinter', f: 11, tier: 'N', kind: 'scene', arch: 'row', hero: 'A', heroId: 'F31', heroPending: true, teaches: null,
    parts: [M('A', -12, [{ f: 3, cx: 3, cz: 3, mat: 'conc', skin: 'glass' }, { f: 3, cx: 2, cz: 2, ox: 0.5, oz: 0.5, mat: 'conc', skin: 'glass' }], { bay: 3.3, fh: 4.3, colk: 1.3, st: 0.38, dress: { t: 'G31' } }),
      M('B', -3.4, [{ f: 6, cx: 2, cz: 2, mat: 'conc', skin: 'glass' }], hero({ bay: 3.2, roof: { cap: 1 } })),
      M('C', 3.0, [{ f: 5, cx: 2, cz: 2, mat: 'brick', skin: 'alt' }], hero({ bay: 3.2, roof: { cap: 1, ac: 1 } })),
      M('D', 9.6, [{ f: 4, cx: 2, cz: 2, mat: 'wood', skin: 'alt' }], { bay: 3.4, fh: 4.0 }),
      SF('E', 0, -11, 6, 'full', undefined, 'z+')],
    charges: { tnt: 11 }, target: 0.85, yaw: 0.3, hint: 'A:x+', tip: 'Tip the glass tower\ndown the row.', ftip: 'Hit its frame on the row side.',
    sol: [T('A:x+', 0, 0), T('A:x+', 0, 1), T('A:x+', 0, 2), T('B:x+', 0, 0), T('C:x+', 0, 0), T('D:x+', 0, 0)].concat(ST2('E', 'z-')),
    bot: { hints: [['A', 'A:x+', 1], ['A', 'A:x+', 1], ['A', 'A:x+', 1], ['A', 'B:x+', 1], ['A', 'C:x+', 1], ['A', 'D:x+', 1], ['A', 'E:z-', 1, 2], ['A', 'E:z-', 1, 2]] }, d: 1 },
  // 28 H · Hard (glass + road + protected; nothing new). "Sister Spires" (F07, F1b: THREE glass spires joined by sky bridges: all three
  // are real towers of plain concrete frame behind glass, as on the tile; the bridges real steel plates). A shop row stands on the road
  // in front. Left spire, a school behind it: it falls LEFT. Right spire, a hospital on its right: BACK. The third stands behind: BACK.
  // 8 TNT, one blast.
  { name: 'Sister Spires', f: 10, tier: 'H', hard: true, kind: 'scene', arch: 'bridge', hero: 'A,Q,R,S,V,U', heroId: 'F07', teaches: null,
    parts: [M('A', -7, [{ f: 8, cx: 2, cz: 2, mat: 'conc', skin: 'glass' }], SPIRE({ z: 2, dress: { t: 'F07' } })),
      M('Q', 7, [{ f: 8, cx: 2, cz: 2, mat: 'conc', skin: 'glass' }], SPIRE({ z: 2, dress: { t: 'F07' } })),
      M('R', -2.5, [{ f: 9, cx: 2, cz: 2, mat: 'conc', skin: 'glass' }], SPIRE({ z: -8, dress: { t: 'F07' } })),
      { id: 'S', kind: 'deck6', x: -2.56, z: 2, y: 22 / 2.7, len: 5.04, wd: 2.4, n: 1, dress: { t: 'F07' } },
      { id: 'V', kind: 'deck6', x: 2.56, z: 2, y: 22 / 2.7, len: 5.04, wd: 2.4, n: 1, dress: { t: 'F07' } },
      KIT('U', -2.5, 0, [['sdeck', 0, 22 - 0.18, -2.67, 2.4, 0.36, 6.8, 4]], { base: [2, 2], fh: 4.4, dress: { t: 'G07d' } }),
      M('F', 0, [{ f: 2, cx: 3, cz: 2, mat: 'wood', skin: 'alt' }], { bay: 3.0, fh: 3.4, z: 10.5 })],
    keeps: [K(-7, -4.6, 2, 2, 2, 'school'), K(13, 2, 2, 2, 2, 'hospital')], keep: KEEP('school'),
    street: STREET, charges: { tnt: 8 }, target: 0.85, yaw: 0.35, hint: 'A:x-', tip: 'HARD. One way down\nfor each spire.', ftip: 'Left spire left. The others back.',
    sol: [T('A:x-', 0, 0), T('A:x-', 0, 1), T('Q:z-', 0, 0), T('Q:z-', 0, 1), T('R:z-', 0, 0), T('R:z-', 0, 1), T('F:z-', 0, 1)],
    bot: { hints: [['A', 'A:z-', 1], ['A', 'A:z-', 1], ['A', 'Q:z-', 1], ['A', 'Q:z-', 1], ['A', 'R:z-', 1], ['A', 'R:z-', 1], ['A', 'F:z-', 1]] }, d: 2 },
  // 29 N · surprise: the LONGEST domino so far. "Old Tock" (F01: the big clock tower, squat: 6 m wide, 5 m bays) at the left end of
  // five: glass, concrete, brick, timber. One push and the whole street goes.
  { name: 'Old Tock Row', f: 11, tier: 'N', kind: 'scene', arch: 'row', hero: 'A', heroId: 'F01', teaches: null,
    parts: [M('A', -13.6, [{ f: 5, cx: 2, cz: 2, mat: 'brick', skin: 'alt' }], TOCK({ loose: 1, dress: { t: 'F01' } })),
      M('B', -6.6, [{ f: 7, cx: 2, cz: 2, mat: 'conc', skin: 'glass' }], hero({ bay: 3.0, roof: { cap: 1 } })),
      M('C', -0.4, [{ f: 6, cx: 2, cz: 2, mat: 'conc', skin: 'alt' }], hero({ bay: 3.0, roof: { cap: 1, ac: 1 } })),
      M('D', 5.8, [{ f: 5, cx: 2, cz: 2, mat: 'brick', skin: 'alt' }], hero({ bay: 3.0, roof: { cap: 1 } })),
      M('E', 12, [{ f: 4, cx: 2, cz: 2, mat: 'wood', skin: 'alt' }], { bay: 3.2, fh: 4.0 }),
      SF('G', 0, -14, 6, 'full', undefined, 'z+')],
    // GD-9 (20/11): TNT 11 -> 10 (expert 10, 0 spare). Shorter plans (7 TNT) land at 84-86%: the row's last stubs decide, so the
    // expert keeps the full row
    charges: { tnt: 10 }, target: 0.85, yaw: 0.25, hint: 'A:x+', tip: 'One push.\nThe whole row goes.', ftip: 'Tip the clock tower right.',
    // GD-32 (19/11, D-blast-NOSTACK): two blasts, the steel tank tower first (foot + storey above, one TNT per member), then the row
    sol: ST2('G', 'z-'),
    solW: [ST2('G', 'z-'), [T('A:x+', 0, 0), T('A:x+', 0, 1), T('E:x+', 0, 0), T('D:x+', 0, 0), T('C:x+', 0, 0), T('C:x+', 0, 1)]],
    // sensible (20/11): the old hints read the removed "stack two" tip (2 TNT on the tank tower, 47%). A player reads the row tip (blast 1),
    // then applies the L13 steel rule (GD-42: two legs on two storeys, one blast) to the tank tower (blast 2): 86%
    bot: { hints: [['A', 'A:x+', 1], ['A', 'A:x+', 1], ['A', 'E:x+', 1], ['A', 'D:x+', 1], ['A', 'C:x+', 1], ['A', 'C:x+', 1], ['A', 'G:z-', 2], ['A', 'G:z-', 2], ['A', '@1:G:z-', 2], ['A', '@1:G:z-', 2]] }, d: 1 },
  // 30 SH · BOSS (glass + stack + road + protected; nothing new). "Sky Steps" (F12: super-tall setback tower with a needle; the setbacks
  // are REAL tiers, 3 -> 2 bays, symmetric; plain concrete frame behind the glass, as on the tile). Road in front, a school on its right:
  // the tower falls BACK. Left: a steel-legged mast: stack, and it must fall back too (the road). A timber shed behind the school.
  // 8 TNT, one blast.
  { name: 'Sky Steps', f: 12, tier: 'SH', boss: true, kind: 'scene', arch: 'setpiece', hero: 'A', heroId: 'F12', teaches: null,
    parts: [M('A', 0, [{ f: 4, cx: 3, cz: 2, mat: 'conc', skin: 'glass' }, { f: 4, cx: 2, cz: 2, ox: 0.5, mat: 'conc', skin: 'glass' }], { bay: 3.4, fh: 4.2, colk: 1.4, st: 0.38, dress: { t: 'G12' } }),
      SF('Q', -13, -3, 6, 'full', { crown: { t: 'stack', s: [[0.6, 2, 'crC']], mast: 4 } }, 'z+'),
      M('C', 10.6, [{ f: 4, cx: 2, cz: 2, mat: 'wood', skin: 'alt' }], { bay: 3.4, fh: 4.0, z: -10 })],
    keeps: [K(8.6, 0, 2, 2, 2, 'school')], keep: KEEP('school'),
    street: STREET, charges: { tnt: 8 }, target: 0.85, yaw: 0.4, hint: 'A:z-', tip: 'BOSS! Road, school,\nglass, steel.', ftip: 'Tower back. Mast back: stack.',
    sol: [T('A:z-', 0, 0), T('A:z-', 0, 1), T('A:z-', 0, 2), T('C:z-', 0, 0), T('Q:z-', 0, 0), T('Q:z-', 0, 1), T('Q:z-', 1, 0), T('Q:z-', 1, 1)],
    bot: { hints: [['A', 'A:z-', 1], ['A', 'A:z-', 1], ['A', 'A:z-', 1], ['A', 'C:z-', 1], ['A', 'Q:z+', 1, 2], ['A', 'Q:z+', 1, 2]] }, d: 2 },
  // ---- RAIL YARD (L31-36) ----
  // 31 R · relief after the boss (Sky Strike's first level in the boosters2 build: a tall soft top to drop it on; plays without it).
  // "Stack Tower" (F19: five flared glass segments on dark stilts; REAL 5.6 m wide body) on dark piers, two timber sheds, a steel-framed block.
  { name: 'Stack Tower', f: 10, tier: 'R', kind: 'scene', arch: 'tall-low', hero: 'A', heroId: 'F19', teaches: null, boosterPush: 'sky',
    parts: [M('A', 0, [0, 1, 2, 3, 4].map(k => Object.assign({ f: 2, cx: 2, cz: 2, mat: 'conc', skin: 'glass', eave: 1 }, k ? {} : { g: 'open', cols: all(2, 2, 'pier'), colsF: 1 })), FAT({ fh: 3.6, loose: 1, dress: { t: 'G19' } })),
      SF('B', 12.5, 0, 6, 'alt', { cap: 1, ac: 1 }, 'x-'),
      M('C', -12.5, [{ f: 4, cx: 2, cz: 2, mat: 'wood', skin: 'alt' }], { bay: 3.4, fh: 4.0 }),
      M('D', 0, [{ f: 3, cx: 3, cz: 2, mat: 'wood', skin: 'alt' }], { bay: 3.0, fh: 4.0, z: -12 })],
    charges: { tnt: 10 }, target: 0.85, yaw: 0.3, hint: 'A:x-', tip: 'Dark piers: one each.\nSteel: stack.', ftip: 'One TNT on each dark pier.',
    sol: [T('A:x-', 0, 0), T('A:x-', 0, 1), T('C:x-', 0, 0), T('D:z-', 0, 1)].concat(ST2('B', 'x+')),
    bot: { hints: [['A', 'A:x-', 1], ['A', 'A:x-', 1], ['A', 'B:x+', 1, 2], ['A', 'B:x+', 1, 2], ['A', 'C:x-', 1], ['A', 'D:z-', 1]] }, d: 1 },
  // 32 N · LESSON 9: FUEL BARRELS blast for free. "Sky Saucer" (F04: two discs on a shaft) stands on steel legs with red barrels
  // round two of them: ONE TNT by the barrels does what four stacked TNT would. Barrels by the two blocks too.
  { name: 'Sky Saucer', f: 10, tier: 'N', kind: 'scene', arch: 'legs', hero: 'A', heroId: 'F04', teaches: 'One TNT by the barrels: they blast for free',
    parts: [M('A', 0, [ST(2, 2, 2), { f: 8, cx: 2, cz: 2, mat: 'conc', skin: 'full', cols: all(2, 2, 'steel') }], hero({ dress: { t: 'F04' } })),
      M('B', 10, [{ f: 5, cx: 2, cz: 2, mat: 'conc', skin: 'alt', g: 'open' }], big({ roof: { cap: 1, ac: 1 } })),
      M('C', -10, [{ f: 5, cx: 2, cz: 2, mat: 'conc', skin: 'alt', g: 'open' }], big({ roof: { cap: 1 } })),
      SF('E', 0, -10, 7, 'alt', { cap: 1, ac: 1 }, 'z+')],
    tanks: [[2.25, -1.35], [2.25, 1.35], [1.35, 2.25], [1.35, -2.25], [12.7, -1.8], [12.7, 1.8], [12.7, 0], [-12.7, 0]],
    charges: { tnt: 10 }, target: 0.85, yaw: 0.35, hint: 'tank', tip: 'Barrels blast\nfor free.', ftip: 'One TNT next to the barrels.',
    sol: [T('A:x+', 0, 0), T('A:x+', 0, 1), T('B:x+', 0, 0), T('C:x-', 0, 0)].concat(ST2('E', 'z-')),
    lesson: { check: [ST2('A', 'x-').concat(ST2('E', 'z-'), [T('B:x-', 0, 0), T('B:x-', 0, 1)])] },
    bot: { hints: [['A', 'A:x+', 1], ['A', 'A:x+', 1], ['A', 'B:x+', 1], ['A', 'C:x-', 1], ['A', 'E:z-', 1, 2], ['A', 'E:z-', 1, 2]] }, d: 1 },
  // 33 N · practise barrels. "Rivet Tower" (F03, F1b: a lattice tower on THREE splayed steel legs, a glass cabin on top; v12 kit: the
  // legs, decks and posts are real members, the lattice is drawn): barrels stand round ONE leg only: that is the way it falls, down a row
  // of sheds. A block behind has no barrels: plain TNT.
  { name: 'Rivet Depot', f: 10, tier: 'N', kind: 'scene', arch: 'row', hero: 'A', heroId: 'F03', teaches: null,   // 19/11 GD-34: was "Rivet Tower" (= L8)
    parts: [TRI('A', -10, 0, { loose: 'x-', dress: { t: 'G03' } }),
      M('B', 1.5, [{ f: 5, cx: 2, cz: 2, mat: 'brick', skin: 'alt' }], hero({ bay: 3.2, roof: { cap: 1 } })),
      M('C', 8, [{ f: 4, cx: 2, cz: 2, mat: 'wood', skin: 'alt' }], { bay: 3.4, fh: 4.0 }),
      M('D', 14.5, [{ f: 3, cx: 2, cz: 2, mat: 'wood', skin: 'alt' }], { bay: 3.4, fh: 4.0 }),
      SF('E', 3, -12, 7, 'alt', { cap: 1, ac: 1 }, 'z+')],
    tanks: [[-2.5, 0], [-3.6, 1.05], [-3.6, -1.05]],
    charges: { tnt: 9 }, target: 0.85, yaw: 0.3, hint: 'A:x+', tip: 'Barrels show\nthe way down.', ftip: 'TNT by the barrels. Then the rest.',
    sol: [T('A:x+', 0, 0), T('D:x+', 0, 0), T('B:x+', 0, 0), T('C:x+', 0, 0)].concat(ST2('E', 'z-')),
    bot: { hints: [['A', 'A:x+', 1], ['A', 'E:z-', 1, 2], ['A', 'E:z-', 1, 2], ['A', 'D:x+', 1], ['A', 'C:x+', 1], ['A', 'B:x+', 1]] }, d: 1 },
  // 34 N · practise barrels + DOMINO. "Old Tock" (F01, squat 6 m wide) tips down a row; the last block is concrete with a barrel dump
  // at its foot: the falling row sets the barrels off.
  { name: 'Tock Yard', f: 11, tier: 'N', kind: 'scene', arch: 'pair', hero: 'A', heroId: 'F01', teaches: null,
    parts: [M('A', -10.5, [{ f: 5, cx: 2, cz: 2, mat: 'brick', skin: 'alt' }], TOCK({ dress: { t: 'F01' } })),
      M('B', -2.4, [{ f: 6, cx: 2, cz: 2, mat: 'conc', skin: 'alt' }], hero({ bay: 3.0, roof: { cap: 1 } })),
      M('C', 4.4, [{ f: 5, cx: 2, cz: 2, mat: 'conc', skin: 'alt', g: 'open' }], big({ roof: { cap: 1, ac: 1 } })),
      SF('E', -3, -11, 6, 'full', undefined, 'z+')],
    tanks: [[2.0, -1.2], [2.0, 1.2], [7.2, 0]],
    charges: { tnt: 10 }, target: 0.85, yaw: 0.3, hint: 'A:x+', tip: 'Row, then barrels.', ftip: 'Tip the clock tower at the barrels.',
    sol: [T('A:x+', 0, 0), T('A:x+', 0, 1), T('B:x+', 0, 0), T('B:x+', 0, 1), T('C:x+', 0, 0)].concat(ST2('E', 'z-')),
    bot: { hints: [['A', 'A:x+', 1], ['A', 'A:x+', 1], ['A', 'B:x+', 1], ['A', 'B:x+', 1], ['A', 'C:x+', 1], ['A', 'E:z-', 1, 2], ['A', 'E:z-', 1, 2]] }, d: 1 },
  // 35 H · Hard (barrels + protected; nothing new) · a hall and two blocks round a school. "Dome Works" (F14: the wide domed hall, green
  // dome) behind a school: its whole back row, as on L16. Each side block has barrels on BOTH sides: by the outer ones, one TNT takes the
  // block down outward; the inner ones are a trap: set them off and the block falls on the school. 8 TNT, one blast.
  { name: 'Dome Works', f: 10, tier: 'H', hard: true, kind: 'scene', arch: 'c4', hero: 'A', heroId: 'F14', teaches: null,
    parts: [M('A', 0, [{ f: 3, cx: 6, cz: 2, mat: 'conc', skin: 'alt' }, { f: 1, cx: 2, cz: 2, ox: 2, mat: 'conc', skin: 'full' }], HALL({ z: -12.5, loose: 1, spire: [1.3, 8], dress: { t: 'G14', c: 0x6FB59A } })),
      M('B', 12, [{ f: 4, cx: 2, cz: 2, mat: 'conc', skin: 'alt', g: 'open' }], big({ z: 1, roof: { cap: 1, ac: 2 } })),
      M('C', -12, [{ f: 4, cx: 2, cz: 2, mat: 'conc', skin: 'alt', g: 'open' }], big({ z: 1, roof: { cap: 1 } }))],
    tanks: [[14.8, -0.8], [14.8, 1.0], [14.8, 2.8], [-14.8, -0.8], [-14.8, 1.0], [-14.8, 2.8], [9.3, -0.8], [9.3, 2.8], [-9.2, -0.8], [-9.2, 2.8]],
    keeps: [K(0, 0, 2, 2, 2, 'school')], keep: KEEP('school'),
    charges: { tnt: 8 }, target: 0.85, yaw: 0.35, hint: 'A:z-', tip: 'HARD. Some barrels\nare a trap.', ftip: 'Outer sides only. Mind the barrels.',
    sol: [T('A:z-', 0, 0), T('A:z-', 0, 1), T('A:z-', 0, 2), T('A:z-', 0, 3), T('A:z-', 0, 4), T('A:z-', 0, 5), T('B:x+', 0, 0), T('C:x-', 0, 0)],
    bot: { hints: [['A', 'A:z-', 1], ['A', 'A:z-', 1], ['A', 'A:z-', 1], ['A', 'A:z-', 1], ['A', 'A:z-', 1], ['A', 'A:z-', 1], ['A', 'B:x-', 1], ['A', 'C:x+', 1]] }, d: 2 },
  // 36 R · LESSON 10: DROP IT IN THE LOT. "The Sail" (F30: twin sail towers on one podium, REAL masses) between a school and a hospital,
  // the road in front: the marked lot behind it is the only place to land. (The rule is the road + the protected buildings: no new meter.)
  { name: 'Sail Lot', f: 10, tier: 'R', kind: 'scene', arch: 'zone', hero: 'A', heroId: 'F30', teaches: 'Find the gap between the blue buildings',   // 19/11 GD-34: was the removed lot (D-blast-NOLOT)
    parts: [M('A', 0, [{ f: 1, cx: 5, cz: 2, mat: 'conc', skin: 'sp' }, { f: 8, cx: 2, cz: 2, ox: 0, on: 0, mat: 'conc', skin: 'full' }, { f: 8, cx: 2, cz: 2, ox: 3, on: 0, mat: 'conc', skin: 'full' }], TWIN({ dress: { t: 'G30' } })),
      M('B', -13, [{ f: 4, cx: 2, cz: 2, mat: 'brick', skin: 'alt' }], big({ z: -15, roof: { cap: 1 } })),
      M('F', 0, [{ f: 1, cx: 3, cz: 2, mat: 'wood', skin: 'alt' }], { bay: 2.7, fh: 3.4, z: 8.5 }),
      { kind: 'lot6', x: 0, z: -21, w: 18, d: 32 }],
    keeps: [K(-14.6, 1, 2, 2, 2, 'school'), K(14.6, 1, 2, 2, 2, 'hospital')], keep: KEEP('school'),
    street: STREET, charges: { tnt: 10 }, target: 0.85, yaw: 0.35, hint: 'A:z-', tip: 'Drop it in the lot.', ftip: 'Blast the back: land on the yellow lot.',
    sol: [T('A:z-', 0, 0), T('A:z-', 0, 1), T('A:z-', 0, 2), T('A:z-', 0, 3), T('A:z-', 0, 4), T('B:x-', 0, 0), T('B:x-', 0, 1), T('F:z-', 0, 1)],
    lesson: { check: [[T('A:x+', 0, 0), T('A:x+', 0, 1), T('A:x-', 0, 0), T('A:x-', 0, 1), T('B:x-', 0, 0), T('B:x-', 0, 1), T('F:z-', 0, 1)]] },
    bot: { hints: [['A', 'A:z-', 1], ['A', 'A:z-', 1], ['A', 'A:z-', 1], ['A', 'A:z-', 1], ['A', 'A:z-', 1], ['A', 'F:z-', 1], ['A', 'B:x-', 1], ['A', 'B:x-', 1]] }, d: 1 },
];
LEVELS.forEach(l => { if (l.fillMax == null) l.fillMax = 0.73; });   // v12 scale rule: the camera pulls back until the hero is <= 73% of the play-area height
if (process.env.LAB) { const BASE = JSON.parse(JSON.stringify(LEVELS)); LEVELS.length = 0; require(require('path').resolve(process.env.LAB))({ BASE, T, M, K, KEEP, all, big, hero, ST, SF, ST2, KIT, ZIG, PYL, DECK, PIERS, TRI, BOW, BOWC, CUBEK, SPIRE, WEDGE, HALL, FAT, TWIN, WING, STREET, CUBE, G: module.exports.G }).forEach(l => LEVELS.push(l)); }   // lab: a scratch level list in slots 13+
module.exports = LEVELS;
if (require.main === module) {
  const fs = require('fs'), path = require('path'), DIR = path.join(__dirname, '..');
  const IN = process.argv[2] || path.join(DIR, '..', 'checkpoints', 'index-v10d-levels6r5.html');
  const OUT = process.argv[3] || path.join(DIR, '..', 'checkpoints', 'index-v10f-l13-36.html');
  if (path.resolve(OUT) === path.resolve(DIR, '..', 'index.html')) { console.error('refusing to write games/blast/index.html'); process.exit(2); }
  let src = fs.readFileSync(IN, 'utf8');
  const MARK = '// ---- levels6 v11', END10 = '// ---- end levels6 v10 builders\n', HOOK = 'window.__blast.boost = BST_API;';
  const once = (s) => { const i = src.indexOf(s); if (i < 0 || src.indexOf(s, i + 1) >= 0) { console.error('anchor missing or twice: ' + s.slice(0, 50)); process.exit(1); } return i; };
  if (src.includes(MARK)) { console.error('already patched'); process.exit(1); }
  const a = 'var LEVELS = [\n', i = once(a), j = once('];\n// Hard = the labelled spikes');
  const old = JSON.parse('[' + src.slice(i + a.length, j) + ']');
  const lv = old.slice(0, 12).concat(LEVELS.length ? LEVELS : old.slice(12)).concat(old.slice(12 + (LEVELS.length || 99)));
  src = src.slice(0, i + a.length) + lv.map(l => '  ' + JSON.stringify(l)).join(',\n') + src.slice(j);
  let block = fs.readFileSync(path.join(DIR, 'patch', 'v11.js'), 'utf8').replace(/\s+$/, '');
  const v12 = path.join(DIR, 'patch', 'v12.js'); if (fs.existsSync(v12)) block += '\n' + fs.readFileSync(v12, 'utf8').replace(/\s+$/, '');   // v12: physical hero rebuild (kit6 + G-dresses), after v11
  let k = once(END10); src = src.slice(0, k + END10.length) + block + '\n' + src.slice(k + END10.length);
  k = once(HOOK); src = src.slice(0, k + HOOK.length) + '\nwindow.__blast.l11 = L11_API;' + src.slice(k + HOOK.length);
  fs.writeFileSync(OUT, src);
  if (!process.env.LAB) fs.writeFileSync(path.join(DIR, 'levels-v6-l13-36.json'), '{\n "levels": [\n' + LEVELS.map(l => '  ' + JSON.stringify(l)).join(',\n') + '\n ]\n}\n');
  console.log('wrote', OUT, '(' + lv.length + ' levels, ' + LEVELS.length + ' new)');
}
