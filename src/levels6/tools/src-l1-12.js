// levels-v6 L1-12 source, ROUND 5 (Owner 11/11/2026, after round 4): famous-silhouette heroes, a curriculum with few
// lessons spread out (lesson -> 2-3 levels to experience it, domino payoffs), massive secondary buildings, and the
// game-wide MULTI-WAVE rule (patch/v10.js: BLAST fires what is placed; PASS after a settle = win; TNT left = keep going).
// Round 4 source: git history / PLAN.md §13. `node tools/build-levels.js <base.html>` writes ../levels-v6.json = these 12
// + the carried-over L13-36 (stub: true).
// Faces: z+ front, z- back, x- left, x+ right. "@n:<sel>" = <sel> on floor n. "A:z+" = part A's front line.
// Per level (round 5 fields; the game ignores what it does not read):
//   sol    = the expert's FIRST blast (T.solve() / tools that fire one volley)
//   solW   = the expert plan, one list per blast (1-3 blasts); bots fire them in order, each after the last one settled
//   lesson = { teaches, check: [blasts] }: the plan WITHOUT the lesson (bots: must fail on a lesson level)
//   bot.hints = [kind, selector, blast#] the tip's reading for the sensible bot (blast# = which BLAST it goes in)
//   waves  = removed (ignored by the engine since round 5)
//   base   = per-building base type (patch/v15-base.js, MATERIAL-CURVE.md): hero 'keep', every ladder neighbour 'weak' (falls from one pier)
// Heroes: ORIGINAL silhouettes in the style of a TYPE of famous place (LEGAL-LANDMARKS.md §4.1: invented name, the
// signature top replaced, proportions changed, no logo, no lighting show, no real context). PLAN.md §14.2 lists per hero
// what makes it read and what was changed. Crowns are light decor (`roof.crown`), never a charge target.
// Secondary buildings (round 5, Owner): massive blocks on bigger modules (bay 3.4-4.5 m, fat columns, thick slabs: same
// body count, 1.5-2.5x the footprint; measured 0 bonds cracked at rest).
'use strict';
const T = (sel, f, i) => ['tnt', sel, f || 0, i || 0];
const M = (id, x, tiers, o) => Object.assign({ id, kind: 'mass', x, tiers }, o || {});
const K = (x, z, floors, cx, cz, name, role) => ({ kind: 'keep6', x, z: z || 0, floors, cx, cz, name: name || 'the school', role: role || 'school' });
// the protected building's type used to be picked from the level name (l6KeepTypes); the names changed with the famous heroes, so the types are pinned
const KT = (types, keeps) => keeps.map((k, i) => Object.assign(k, { fixType: types[i] }));
const KEEP = (name, type) => ({ name, sides: [], type: type || 'school', role: type || 'school', full: 1 });
const all = (cx, cz, k) => { const o = {}; for (let i = 0; i < cx; i++) for (let j = 0; j < cz; j++) o[i + ',' + j] = k; return o; };
const HUG = (cz) => (cz - 1) * 1.35 + 0.31 + 0.6 + 1.66;   // z of a 2-row protected building standing 0.6 m from a hero of cz column rows (2.7 m bays)
// big modules for secondary buildings (measured at rest: 0 bonds cracked)
const BIG = { bay: 3.6, colk: 1.4, st: 0.35 }, HUGE = { bay: 4.5, colk: 1.8, st: 0.45, fh: 3.4 };
const big = (o) => Object.assign({}, BIG, o || {}), huge = (o) => Object.assign({}, HUGE, o || {});

// ---- HERO KITS (12/11/2026, decision D-blast-HERO-PROC: the hero is built to LOOK LIKE its Figma tile first; difficulty is tuned with
// what stands round it). A hero is a mass part with `kit` = an explicit member list made by the generators below (every box is a real
// member: axis-aligned, bonded by contact like any other); patch/v11.js §8 builds it and dresses it (`dress`, visual decor riding on
// members). A build without v11 (index-v10d) shows the part's plain fallback `tiers` instead.
// member = [key, x, y, z, sx, sy, sz, floor, gi, gj]; kit = { base:[w, d], m:[...], rock:[[x, y, z, sx, sy, sz], ...] (fixed ground) }
const r3 = (v) => Math.round(v * 1000) / 1000;
const MK = { wood: { col: 'wpost', cw: 0.5, slab: 'wfloor', wall: 'wwall', th: 0.2 }, brick: { col: 'bk', cw: 0.8, slab: 'slab', wall: 'bkw', th: 0.3 },
  conc: { col: 'concrete', cw: 0.7, slab: 'slab', wall: 'cpan', th: 0.24 }, steel: { col: 'steel', cw: 0.45, slab: 'sdeck', wall: 'cpan', th: 0.24 } };
const IN = 0.06;
// one storey of a BOX frame: s = { w, d, h, x, z (centre), nx, nz (column lines), mat, cw, st, skin ('full' | 'sp' | 'open' | 'alt' or per face
// { 'z+': .. }), inner:false (no inside columns), none:['i,j'], col, slab, wall (key overrides), deck:1 (deep transfer deck), noslab:['i,j'] }
function boxStorey(m, s, y0, fl) {
  const K = MK[s.mat || 'conc'], cw = s.cw || K.cw, st = s.st || 0.34, ch = s.h - st, nx = s.xs ? s.xs.length : s.nx || 2, nz = s.zs ? s.zs.length : s.nz || 2, cx = s.x || 0, cz = s.z || 0, th = K.th;
  const xs = [], zs = []; for (let i = 0; i < nx; i++) xs.push(s.xs ? cx + s.xs[i] : cx - s.w / 2 + cw / 2 + i * (s.w - cw) / (nx - 1)); for (let j = 0; j < nz; j++) zs.push(s.zs ? cz + s.zs[j] : cz - s.d / 2 + cw / 2 + j * (s.d - cw) / (nz - 1));
  const has = (i, j) => !((s.none || []).includes(i + ',' + j)) && (s.inner !== false || i === 0 || j === 0 || i === nx - 1 || j === nz - 1);
  for (let i = 0; i < nx; i++) for (let j = 0; j < nz; j++) if (has(i, j)) m.push([s.col || K.col, xs[i], y0 + ch / 2, zs[j], cw, ch, cw, fl, i + (s.gi0 || 0), j + (s.gj0 || 0)]);
  for (let i = 0; i < nx - 1; i++) for (let j = 0; j < nz - 1; j++) { if ((s.noslab || []).includes(i + ',' + j)) continue;
    const x0 = i === 0 ? cx - s.w / 2 + IN : xs[i], x1 = i === nx - 2 ? cx + s.w / 2 - IN : xs[i + 1], z0 = j === 0 ? cz - s.d / 2 + IN : zs[j], z1 = j === nz - 2 ? cz + s.d / 2 - IN : zs[j + 1];
    m.push([s.slab || (s.deck ? 'tdeck' : K.slab), (x0 + x1) / 2, y0 + ch + st / 2, (z0 + z1) / 2, x1 - x0, st, z1 - z0, fl]); }
  const skin = (face, bay) => { let k = typeof s.skin === 'string' ? s.skin : ((s.skin || {})[face] || (s.skin || {}).def || 'full'); if (k === 'alt') k = (bay + fl) % 2 ? 'full' : 'sp'; return k === 'open' ? null : k; };
  const pan = (k, x, z, lx, lz) => { const hh = k === 'sp' ? 0.95 : ch - 0.05; m.push([s.wall || K.wall, x, y0 + hh / 2, z, lx, hh, lz, fl]); };
  [-1, 1].forEach(sg => {
    for (let i = 0; i < nx - 1; i++) { const j = sg < 0 ? 0 : nz - 1, k = skin(sg < 0 ? 'z-' : 'z+', i), len = xs[i + 1] - xs[i] - cw - 0.04; if (k && len > 0.3 && has(i, j) && has(i + 1, j)) pan(k, (xs[i] + xs[i + 1]) / 2, cz + sg * (s.d / 2 - th / 2), len, th); }
    for (let j = 0; j < nz - 1; j++) { const i = sg < 0 ? 0 : nx - 1, k = skin(sg < 0 ? 'x-' : 'x+', j), len = zs[j + 1] - zs[j] - cw - 0.04; if (k && len > 0.3 && has(i, j) && has(i, j + 1)) pan(k, cx + sg * (s.w / 2 - th / 2), (zs[j] + zs[j + 1]) / 2, th, len); } });
}
// one storey of an OCTAGON frame (a round tower in blocks): s = { r (centre to flat), h, mat, cw, st, skin, x, z }: 8 posts just inside the
// corners, a wall panel on each of the four axis faces, three floor plates (a cross; `noalt`: the long plate always along x). The four
// diagonal faces are drawn by the dress.
function octStorey(m, s, y0, fl) {
  const K = MK[s.mat || 'conc'], cw = s.cw || K.cw, st = s.st || 0.34, ch = s.h - st, r = s.r, a = r * 0.4142, px = r - cw / 2, pa = Math.max(cw / 2 + 0.02, a - cw / 2), cx = s.x || 0, cz = s.z || 0, th = K.th;
  [[px, pa, 1, 1], [px, -pa, 1, 0], [-px, pa, 0, 1], [-px, -pa, 0, 0], [pa, px, 1, 2], [-pa, px, 0, 2], [pa, -px, 1, -1], [-pa, -px, 0, -1]].forEach(q => m.push([s.col || K.col, cx + q[0], y0 + ch / 2, cz + q[1], cw, ch, cw, fl, q[2], q[3]]));
  const y = y0 + ch + st / 2, k = s.slab || (s.deck ? 'tdeck' : K.slab), a2 = Math.max(a, pa + cw / 2);
  // the long plate runs along x on even storeys and along z on odd ones: a face that loses its posts drops a full-width plate within two storeys, whichever face it is
  if (fl % 2 === 0 || s.noalt) m.push([k, cx, y, cz, 2 * (r - IN), st, 2 * a2, fl], [k, cx, y, cz + (a2 + r - IN) / 2, 2 * a2, st, r - IN - a2, fl], [k, cx, y, cz - (a2 + r - IN) / 2, 2 * a2, st, r - IN - a2, fl]);
  else m.push([k, cx, y, cz, 2 * a2, st, 2 * (r - IN), fl], [k, cx + (a2 + r - IN) / 2, y, cz, r - IN - a2, st, 2 * a2, fl], [k, cx - (a2 + r - IN) / 2, y, cz, r - IN - a2, st, 2 * a2, fl]);
  const sk = s.skin || 'full', len = 2 * pa - cw - 0.04; if (sk !== 'open' && len > 0.3) { const hh = sk === 'sp' ? 0.95 : ch - 0.05;
    [-1, 1].forEach(sg => { m.push([s.wall || K.wall, cx + sg * (r - th / 2), y0 + hh / 2, cz, th, hh, len, fl], [s.wall || K.wall, cx, y0 + hh / 2, cz + sg * (r - th / 2), len, hh, th, fl]); }); }
}
// a stack: list of storeys (box, or octagon when `r` is set); `n` repeats a storey, `dw` / `dd` / `dr` taper it per repeat. Returns the
// storey table [{y0, y1, fl, w, d, r, x, z, mat, ...}] for the dress.
function stack(m, list, y0, f0, tab) { let y = y0 || 0, fl = f0 || 0; tab = tab || [];
  list.forEach(s => { for (let k = 0; k < (s.n || 1); k++) { const q = Object.assign({}, s, s.r ? { r: s.r - (s.dr || 0) * k } : { w: s.w - (s.dw || 0) * k, d: s.d - (s.dd == null ? (s.dw || 0) : s.dd) * k });
    (q.r ? octStorey : boxStorey)(m, q, y, fl); tab.push({ y0: r3(y), y1: r3(y + q.h), fl, w: r3(q.r ? 2 * q.r : q.w), d: r3(q.r ? 2 * q.r : q.d), r: q.r ? r3(q.r) : 0, x: q.x || 0, z: q.z || 0, mat: q.mat || 'conc', tag: q.tag || '', open: q.skin === 'open' ? 1 : 0 }); y += q.h; fl++; } });
  return tab; }
const KITP = (id, x, z, m, o, fallback) => Object.assign(M(id, x, fallback || [{ f: 6, cx: 2, cz: 2, mat: 'conc', skin: 'full' }], { z: z || 0 }), o, { kit: Object.assign({ m: m.map(q => q.map(v => typeof v === 'number' ? r3(v) : v)) }, o.kit || {}) });
// F27 "Old Whirly": timber smock mill: an open ring of posts, a tapering eight-sided boarded body, (drawn) cap and six sails
const WHIRLY = (id, x, z) => { const m = [], tab = stack(m, [{ r: 4.9, h: 3.6, mat: 'wood', cw: 0.9, skin: 'open', tag: 'base' }, { r: 4.6, h: 3.3, n: 6, dr: 0.4, mat: 'wood', cw: 0.5 }]);
  return KITP(id, x, z, m, { fh: 3.3, kit: { base: [10.6, 10.6] }, tab, dress: { t: 'K27' } }, [{ f: 7, cx: 3, cz: 3, mat: 'wood', skin: 'full', g: 'open' }]); };
// F28 "Stripey Point": brick lighthouse on a rock: a tapering eight-sided shaft in red / white bands of two storeys, (drawn) gallery, lantern, cap
const STRIPEY = (id, x, z) => { const m = [], RK = 1.8, tab = stack(m, [{ r: 4.0, h: 2.7, n: 12, dr: 0.11, mat: 'brick', cw: 0.7 }], RK);
  return KITP(id, x, z, m, { fh: 2.7, kit: { base: [13, 13], rock: [[0, RK / 2, 0, 9.4, RK, 9.4]] }, tab, rock: RK, dress: { t: 'K28' } }, [{ f: 12, cx: 3, cz: 3, mat: 'brick', skin: 'full' }]); };
// F01 "Old Tock": brick clock tower on an open arcade of stone piers; the clock stage is the top two storeys; (drawn) pyramid roof
const TOCK = (id, x, z) => { const m = [], tab = stack(m, [{ w: 8.6, d: 8.6, h: 4.6, nx: 3, nz: 3, mat: 'conc', cw: 1.05, skin: 'open', deck: 1, tag: 'base' }, { w: 7.8, d: 7.8, h: 3.5, n: 6, nx: 3, nz: 3, inner: false, mat: 'brick' }]);
  return KITP(id, x, z, m, { fh: 3.5, kit: { base: [10, 10] }, tab, dress: { t: 'K01' } }, [{ f: 8, cx: 3, cz: 3, mat: 'brick', skin: 'full', g: 'open' }]); };
// F16 "Deco Needle": grey stone skyscraper that steps in four times: an arcade of piers, five tiers, (drawn) stepped crown and needle
const NEEDLE = (id, x, z) => { const m = [], tab = stack(m, [{ w: 13, d: 13, h: 3.8, nx: 3, nz: 3, cw: 1.1, skin: 'open', tag: 'base' }, { w: 13, d: 13, h: 3.1, nx: 3, nz: 3, cw: 0.9 }, { w: 13, d: 13, h: 3.1, nx: 3, nz: 3, cw: 0.9, deck: 1 },
    { w: 10.4, d: 10.4, h: 3.1, nx: 3, nz: 3, cw: 0.8 }, { w: 10.4, d: 10.4, h: 3.1, nx: 3, nz: 3, cw: 0.8, deck: 1 }, { w: 7.8, d: 7.8, h: 3.1 }, { w: 7.8, d: 7.8, h: 3.1, deck: 1 }, { w: 5.4, d: 5.4, h: 3.1 }, { w: 5.4, d: 5.4, h: 3.1, deck: 1 }, { w: 3.4, d: 3.4, h: 3.1, n: 3, cw: 0.6 }]);
  return KITP(id, x, z, m, { fh: 3.1, kit: { base: [14.4, 14.4] }, tab, dress: { t: 'K16' } }, [{ f: 6, cx: 3, cz: 3, mat: 'conc', skin: 'full', g: 'open' }, { f: 4, cx: 2, cz: 2, ox: 0.5, oz: 0.5, mat: 'conc', skin: 'full' }]); };
// F24 "The Doorstop": brick wedge block, the narrow flat-cut nose to the FRONT (z+): column lines whose width grows from the nose to the back
// (z-); one floor plate per bay. gi = 0 left / 1 right, gj = line (0 = nose)
const DOORSTOP = (id, x, z) => { const Z = [6.6, 2.2, -2.2, -6.6], D = [3.0, 3.0, 5.8, 8.6], F = 9, fh = 3.4, st = 0.34, ch = fh - st, cw = 0.8, m = [], tab = [], n = Z.length;
  for (let f = 0; f < F; f++) { const y0 = f * fh;
    Z.forEach((zi, i) => [1, -1].forEach(sg => m.push(['bk', sg * (D[i] / 2 - cw / 2), y0 + ch / 2, zi, cw, ch, cw, f, sg > 0 ? 1 : 0, i])));
    for (let i = 0; i < n - 1; i++) { const z1 = Z[i] + (i === 0 ? cw / 2 : 0), z0 = Z[i + 1] - (i === n - 2 ? cw / 2 : 0), d = D[i + 1];
      m.push(['slab', 0, y0 + ch + st / 2, (z0 + z1) / 2, d - 2 * IN, st, z1 - z0, f]);
      [1, -1].forEach(sg => m.push(['bkw', sg * (d / 2 - 0.15), y0 + (ch - 0.05) / 2, (Z[i] + Z[i + 1]) / 2, 0.3, ch - 0.05, Z[i] - Z[i + 1] - cw - 0.04, f])); }
    [0, n - 1].forEach(i => m.push(['bkw', 0, y0 + (ch - 0.05) / 2, Z[i] + (i ? -1 : 1) * (cw / 2 - 0.15), D[i] - 2 * cw - 0.04, ch - 0.05, 0.3, f]));
    tab.push({ y0: r3(y0), y1: r3(y0 + fh), fl: f }); }
  return KITP(id, x, z, m, { fh, kit: { base: [9.6, 15] }, tab, wedge: { Z, D, cw }, dress: { t: 'K24' } }, [{ f: 9, cx: 2, cz: 4, mat: 'brick', skin: 'full' }]); };
// F14 "Dome Hall": a wide stone hall: two wings with an arcade, a taller centre block with a columned porch, an eight-sided drum on the
// centre; (drawn) the big dome, two small end domes, the pediment
const DOMEHALL = (id, x, z) => { const m = [], H = 4.0, tab = [];
  [-1, 1].forEach(sg => stack(m, [{ x: sg * 8.3, z: -0.5, w: 7.5, d: 8, h: H, nx: 3, nz: 2, cw: 0.8, skin: 'open', tag: sg < 0 ? 'wingL' : 'wingR', gi0: sg < 0 ? 0 : 6 }, { x: sg * 8.3, z: -0.5, w: 7.5, d: 8, h: H, nx: 3, nz: 2, cw: 0.8, tag: sg < 0 ? 'wingL' : 'wingR', gi0: sg < 0 ? 0 : 6 }], 0, 0, tab));
  stack(m, [{ w: 9.0, d: 10, h: H, cw: 1.0, tag: 'mid', gi0: 3 }, { w: 9.0, d: 10, h: H, cw: 1.0, deck: 1, tag: 'mid', gi0: 3 }, { r: 3.7, h: 2.4, tag: 'attic' }, { r: 3.5, h: 3.2, n: 2, tag: 'drum' }], 0, 0, tab);
  stack(m, [{ z: 6.55, w: 7.6, d: 3.0, h: 7.4, nx: 4, nz: 2, cw: 0.8, skin: 'open', none: ['0,0', '1,0', '2,0', '3,0'], st: 0.5, tag: 'porch', gj0: 4 }], 0, 0, tab);
  return KITP(id, x, z, m, { fh: H, kit: { base: [25, 12] }, tab, dress: { t: 'K14' } }, [{ f: 2, cx: 7, cz: 3, mat: 'conc', skin: 'full' }, { f: 2, cx: 2, cz: 2, ox: 2.5, oz: 0.5, mat: 'conc', skin: 'full' }]); };
// F10 "Grand Arch": a stone gate across the road: four piers, a small arch through each side, the big arch in the middle, a closed attic
// over everything. gi = column line (0..7 from the left), gj = 0 back / 1 front
const ARCH = (id, x, z) => { const m = [], tab = [], d = 7.6, P = [[-12.7, 3.0], [-6.5, 3.0], [6.5, 3.0], [12.7, 3.0]];   // pier centre, width
  P.forEach((q, k) => stack(m, [{ x: q[0], w: q[1], d, h: 3.7, n: 2, cw: 0.9, tag: 'pier' + k, gi0: 2 * k }], 0, 0, tab));
  [-1, 1].forEach(sg => stack(m, [{ x: sg * 9.6, w: 9.2, d, h: 6.6, xs: [-4.15, -2.05, 2.05, 4.15], cw: 0.9, deck: 1, tag: 'side', gi0: sg < 0 ? 0 : 4 }], 7.4, 2, tab));
  stack(m, [{ w: 28.4, d, h: 5.6, xs: [-13.75, -11.65, -7.55, -5.45, 5.45, 7.55, 11.65, 13.75], cw: 0.9, st: 0.5, deck: 1, tag: 'attic' }], 14.0, 3, tab);
  return KITP(id, x, z, m, { fh: 3.7, kit: { base: [30, 9] }, tab, dress: { t: 'K10' } }, [{ f: 5, cx: 8, cz: 2, mat: 'conc', skin: 'full' }]); };
// F03 "Rivet Tower": a steel lattice tower on THREE splayed legs (the twist), every leg on a grey concrete foot; a ring deck, a tapering
// steel shaft, a cabin. Legs, feet, decks and posts are members; the lattice, the glass ring and the cabin glass are drawn.
const RIVET = (id, x, z) => { const m = [], ang = [90, 210, 330], nL = 5, sh = 3.6, R0 = 8.6, dr = 0.85, lw = 1.7, fy = 2.4;
  ang.forEach((a, li) => { const c = Math.cos(a * Math.PI / 180), sn = Math.sin(a * Math.PI / 180); m.push(['concrete', c * R0, fy / 2, sn * R0, 2.8, fy, 2.8, 0, li, 0]);
    for (let k = 0; k < nL; k++) m.push(['steel', c * (R0 - dr * k), fy + k * sh + sh / 2, sn * (R0 - dr * k), lw, sh, lw, k + 1, li, 0]); });
  let y = fy + nL * sh; const dw = 2 * (R0 - dr * (nL - 1)) + 2.0; m.push(['tdeck', 0, y + 0.3, 0, dw, 0.6, dw, nL + 1]); const deckY = y + 0.6; y = deckY;
  const shaft = [[2.5, 4.2], [2.0, 4.2], [1.5, 4.2]];
  shaft.forEach((q, k) => { const hw = q[0], h = q[1], fl = nL + 2 + k; [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(c => m.push(['steel', c[0] * hw, y + (h - 0.4) / 2, c[1] * hw, 0.6, h - 0.4, 0.6, fl]));
    m.push(['tdeck', 0, y + h - 0.2, 0, 2 * hw + 1.2, 0.4, 2 * hw + 1.2, fl]); y += h; });
  const cabY = y, cw = 1.8, ch = 3.4, fl = nL + 5; [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(c => m.push(['steel', c[0] * cw, y + (ch - 0.4) / 2, c[1] * cw, 0.5, ch - 0.4, 0.5, fl]));
  m.push(['tdeck', 0, y + ch - 0.2, 0, 2 * cw + 1.6, 0.4, 2 * cw + 1.6, fl]);
  return KITP(id, x, z, m, { fh: sh, kit: { base: [2 * R0 + 3, 2 * R0 + 3] }, legs: { ang, nL, sh, R0, dr, lw, fy }, deckY, deckW: dw, shaft, cabY, cab: [cw, ch], dress: { t: 'K03' } }, [{ f: 2, cx: 3, cz: 3, mat: 'steel', skin: 'open' }, { f: 6, cx: 2, cz: 2, ox: 0.5, oz: 0.5, mat: 'steel', skin: 'open' }]); };
// F04 "Twin Saucer": a grey concrete shaft (eight-sided) on a flared foot; (drawn) a wide glass saucer two thirds up, a small roofed
// saucer on top, an antenna
const SAUCER = (id, x, z) => { const m = [], tab = stack(m, [{ w: 6.4, d: 6.4, h: 3.4, nx: 3, nz: 3, inner: false, cw: 1.1, skin: 'open', deck: 1, tag: 'foot' }, { r: 2.1, h: 3.3, n: 9, cw: 0.62, noalt: 1 }]);
  return KITP(id, x, z, m, { fh: 3.3, kit: { base: [8.4, 8.4] }, tab, dress: { t: 'K04' } }, [{ f: 10, cx: 2, cz: 2, mat: 'conc', skin: 'full', g: 'open' }]); };
// F09 "Lift Bridge": one of the two stone bridge towers: a broad pier, a square shaft; `deck` = the high steel walkway to the other tower
// (members of this part), (drawn) stepped terracotta roof, the raised bascule leaf
const BTOWER = (id, x, z, side, span) => { const m = [], tab = stack(m, [{ w: 8.6, d: 9.4, h: 4.4, cw: 1.0, deck: 1, tag: 'pier' }, { w: 6.2, d: 6.2, h: 3.6, n: 5, cw: 0.8 }]);
  const wy = 4.4 + 4 * 3.6 - 0.25, x0 = 3.1 + 0.01, n = 3, seg = (span - 0.02) / n; if (span) for (let k = 0; k < n; k++) m.push(['sdeck', x0 + seg * (k + 0.5), wy, 0, seg, 0.5, 3.2, 4]);
  return KITP(id, x, z, m, { fh: 3.6, kit: { base: [10, 10.8] }, tab, dress: { t: 'K09', side, span: span || 0, wy } }, [{ f: 6, cx: 3, cz: 3, mat: 'conc', skin: 'full' }]); };
// F05 "Shell Hall": a sandstone podium, a columned hall on it, four roof plates that carry the (drawn) fan-fold shells
const SHELL = (id, x, z) => { const m = [], tab = stack(m, [{ w: 22, d: 16, h: 4.8, nx: 4, nz: 3, cw: 0.9, skin: 'open', inner: false, deck: 1, tag: 'podium' }, { w: 17.6, d: 12, h: 6.2, nx: 5, nz: 3, cw: 0.7, inner: false, tag: 'hall' }]);
  return KITP(id, x, z, m, { fh: 4.8, kit: { base: [23.4, 17.4] }, tab, dress: { t: 'K05' } }, [{ f: 1, cx: 6, cz: 4, mat: 'conc', skin: 'full' }, { f: 2, cx: 5, cz: 3, ox: 0.5, oz: 0.5, mat: 'conc', skin: 'full' }]); };
// F21 "The Pedestal": a blank sandstone plinth (no statue): a stepped base, a slightly tapering shaft, (drawn) a heavy flat top and the
// low star rampart round it (ground decor)
const PEDESTAL = (id, x, z) => { const m = [], tab = stack(m, [{ w: 10.6, d: 10.6, h: 3.8, nx: 3, nz: 3, cw: 1.0, inner: false, deck: 1, tag: 'base' }, { w: 8.8, d: 8.8, h: 3.6, n: 6, dw: 0.14, nx: 3, nz: 3, cw: 0.8, inner: false }]);
  return KITP(id, x, z, m, { fh: 3.6, kit: { base: [12, 12] }, tab, dress: { t: 'K21', a: 9.0 } }, [{ f: 1, cx: 4, cz: 4, mat: 'conc', skin: 'full' }, { f: 7, cx: 3, cz: 3, ox: 0.5, oz: 0.5, mat: 'conc', skin: 'full' }]); };
const G = (i, j, face, f) => T('g:' + i + ':' + j + (face ? ':' + face : ''), f || 0, 0);   // the column on node (i, j) of the hero's own grid, TNT on its `face` side (default z+)
const rep = (h, n) => Array.from({ length: n }, () => h.slice());
const LEVELS = [
  // 1 T · LESSON 1: tap + BLAST (wood). "Old Whirly" (F27): a timber windmill on a ring of posts, a long timber market hall behind it.
  // Three posts next to each other bring the mill down; it leans towards the gap.
  { name: 'Old Whirly', hero: 'A', heroId: 'F27', f: 8, tier: 'T', kind: 'scene', arch: 'pair', teaches: 'Tap a post, then BLAST',
    parts: [WHIRLY('A', 0.5, 0),
      M('B', 10.5, [{ f: 4, cx: 4, cz: 2, mat: 'wood', skin: 'alt' }], { bay: 3.4, fh: 3.0, z: -8.0, roof: { ac: 2 } })],
    charges: { tnt: 5 }, target: 0.85, yaw: 0.3, fillMax: 0.66, hint: 'A:x+', tip: 'Tap a post.\nThen BLAST!',
    sol: [T('A:x+', 0, 0), T('A:x+', 0, 1), G(1, -1, 'z-'), T('B:z+', 0, 0), T('B:z+', 0, 2)],
    lesson: { check: [[]] },
    bot: { hints: [['A', 'A:x+', 1], ['A', 'A:x+', 1], ['A', 'g:1:-1:z-', 1], ['A', 'B:z+', 1], ['A', 'B:z+', 1]] }, d: 0 },
  // 2 T · practise: the first DOMINO payoff. "Stripey Point" (F28): a brick lighthouse on a rock tips right into a row of three timber
  // boathouses. Brick: one TNT per pier.
  { name: 'Stripey Point', hero: 'A', heroId: 'F28', f: 9, tier: 'T', kind: 'scene', arch: 'row', teaches: null,
    parts: [STRIPEY('A', -7.0, 0),
      M('B', -0.6, [{ f: 5, cx: 2, cz: 2, mat: 'wood', skin: 'alt' }], { fh: 3.0 }), M('C', 3.8, [{ f: 4, cx: 2, cz: 2, mat: 'wood', skin: 'alt' }], { fh: 3.0, roof: { ac: 1 } }),
      M('E', 8.2, [{ f: 4, cx: 2, cz: 2, mat: 'wood', skin: 'alt' }], { fh: 3.0 })],
    charges: { tnt: 5 }, target: 0.85, yaw: 0.3, hint: 'A:x+', tip: 'Tip the lighthouse\nonto the row.',
    sol: [T('A:x+', 0, 0), T('A:x+', 0, 1), T('E:x+', 0, 0)],
    bot: { hints: [['A', 'A:x+', 1], ['A', 'A:x+', 1], ['A', 'E:x+', 1]] }, d: 0 },
  // 3 N · practise: a longer DOMINO. "Old Tock" (F01): a brick clock tower on stone piers at the right end of a row that steps down to
  // its left; the chain thins out at the far end: the last two get their own TNT.
  { name: 'Old Tock', hero: 'A', heroId: 'F01', f: 11, tier: 'N', kind: 'scene', arch: 'row-right', teaches: null,
    parts: [TOCK('A', 8, 0),
      M('B', 1.6, [{ f: 8, cx: 2, cz: 2, mat: 'conc' }], { fh: 3.0, roof: { tank: 1 } }), M('C', -3.2, [{ f: 6, cx: 2, cz: 2, mat: 'wood', skin: 'alt' }], { fh: 3.0, roof: { ac: 1 } }),
      M('D', -9.0, [{ f: 4, cx: 2, cz: 2, mat: 'brick', skin: 'alt' }], { fh: 3.0 }), M('E', -13.6, [{ f: 4, cx: 2, cz: 2, mat: 'brick', skin: 'alt' }], { fh: 3.0 })],
    charges: { tnt: 8 }, target: 0.85, yaw: -0.3, hint: 'A:x-', tip: 'Start the row\nfrom the right.', ftip: 'Tip the right tower left.',
    sol: [T('A:x-', 0, 0), T('A:x-', 0, 1), T('A:x-', 0, 2), T('D:z+', 0, 0), T('D:z+', 0, 1), T('E:z+', 0, 0), T('E:z+', 0, 1)],
    bot: { hints: [['A', 'A:x-', 1], ['A', 'A:x-', 1], ['A', 'A:x-', 1], ['A', 'D:z+', 1], ['A', 'E:z+', 1], ['A', 'D:z+', 1], ['A', 'E:z+', 1], ['A', 'C:z+', 1]] }, d: 0 },
  // 4 N · LESSON 2: ROTATE. "Needle Court" (F16): the stepped stone tower in a courtyard: a blue hospital in front of it, a school on
  // each side, so its foot can only be blasted from the BACK. Turn the view, blast the back row of piers: it goes down backwards onto
  // the office block behind it. A second block has its open side at the back too.
  { name: 'Needle Court', hero: 'A', heroId: 'F16', f: 10, tier: 'N', kind: 'scene', arch: 'courtyard', teaches: 'Turn the view: blast the open back',
    parts: [NEEDLE('A', 0, 0),
      M('B', -5.0, [{ f: 5, cx: 3, cz: 2, mat: 'conc', skin: 'alt' }], big({ fh: 3.2, z: -14.0, roof: { cap: 1, ac: 2 } })),
      M('C', 14.5, [{ f: 5, cx: 3, cz: 2, mat: 'brick', skin: 'alt' }], big({ fh: 3.2, z: -8.5, roof: { cap: 1 } }))],
    keeps: KT(['hospital', 'school', 'school'], [K(0, 6.5 + 5.5 + 1.66, 1, 3, 2), K(-(6.5 + 3.5 + 1.66), 5.5, 2, 2, 2), K(6.5 + 3.5 + 1.66, 5.5, 2, 2, 2)]),
    keep: KEEP('the school'),
    charges: { tnt: 8 }, target: 0.85, yaw: 0.25, hint: 'A:z-', tip: 'Turn around.\nBlast the open side.', ftip: 'Spin the view. Hit the back.',
    sol: [T('A:z-', 0, 0), T('A:z-', 0, 1), T('A:z-', 0, 2), T('C:z-', 0, 0), T('C:z-', 0, 1), T('C:z-', 0, 2), T('B:z-', 0, 1)],
    lesson: { check: [[T('A:z+', 0, 0), T('A:z+', 0, 1), T('A:z+', 0, 2), T('C:z+', 0, 0), T('C:z+', 0, 1), T('C:z+', 0, 2), T('B:z+', 0, 1)]] },
    bot: { hints: [['A', 'A:z-', 1], ['A', 'C:z-', 1], ['A', 'A:z-', 1], ['A', 'C:z-', 1], ['A', 'A:z-', 1], ['A', 'C:z-', 1], ['A', 'B:z-', 1], ['A', 'B:z-', 1]] }, d: 0 },
  // 5 N · practise rotate + domino. "Doorstop Corner" (F24): the brick wedge block, its nose to the front between a school and a
  // hospital. Blast the back rows: it goes down backwards onto the office block behind it; a timber shed stands apart.
  { name: 'Doorstop Corner', hero: 'A', heroId: 'F24', f: 12, tier: 'N', kind: 'scene', arch: 'tall-low', teaches: null,
    parts: [DOORSTOP('A', 0, 0), M('B', 12, [{ f: 3, cx: 2, cz: 2, mat: 'wood', skin: 'alt' }], { fh: 3.0, z: -3 }),
      M('C', -1.0, [{ f: 5, cx: 3, cz: 2, mat: 'conc', g: 'open' }], big({ fh: 3.2, z: -18.0, roof: { cap: 1, ac: 1 } }))],
    keeps: KT(['school', 'hospital'], [K(0, 12.5, 1, 3, 2), K(9.5, 9.5, 1, 2, 2)]), keep: KEEP('the school'),
    charges: { tnt: 9 }, target: 0.85, yaw: 0.3, hint: 'A:z-', tip: 'Tip it back,\naway from the blue.', ftip: 'Blast the back rows.',
    sol: [T('A:z-', 0, 0), T('A:z-', 0, 1), G(0, 2, 'x-'), G(1, 2, 'x+'), G(0, 1, 'x-'), G(1, 1, 'x+'), T('B:z+', 0, 0), T('B:z+', 0, 1), T('C:z-', 0, 1)],
    bot: { hints: [['A', 'A:z-', 1], ['A', 'A:z-', 1], ['A', 'g:0:2:x-', 1], ['A', 'g:1:2:x+', 1], ['A', 'g:0:1:x-', 1], ['A', 'g:1:1:x+', 1], ['A', 'B:z+', 1], ['A', 'B:z+', 1], ['A', 'C:z-', 1]] }, d: 0 },
  // 6 N · practise rotate + direction, a notch harder. "Dome Square" (F14): the wide domed hall, a school in front of its porch.
  // Turn the view and knock the back row out from under the wings and the middle (and the middle pier of each arcade): the whole hall
  // goes down backwards, away from the school, onto the timber hall behind it.
  { name: 'Dome Square', base: { A: 'keep', '*': 'weak' }, hero: 'A', heroId: 'F14', f: 10, tier: 'N', kind: 'scene', arch: 'complex4', teaches: null,
    parts: [DOMEHALL('A', 0, -2),
      M('G', 0, [{ f: 3, cx: 3, cz: 2, mat: 'wood', skin: 'alt' }], big({ fh: 3.2, z: -16.0 }))],
    keeps: KT(['school'], [K(0, 15.5, 2, 2, 2, 'the school')]), keep: KEEP('the school'),
    charges: { tnt: 11 }, target: 0.85, yaw: 0.3, hint: 'g:3:0:z-', tip: 'Knock out the back.\nMind the school.', ftip: 'Back row first, then the arcades.',
    sol: [G(0, 0, 'z-'), G(2, 0, 'z-'), G(3, 0, 'z-'), G(4, 0, 'z-'), G(6, 0, 'z-'), G(8, 0, 'z-'), G(1, 1), G(7, 1), T('G:z-', 0, 0), T('G:z-', 0, 2)],
    bot: { hints: [['A', 'g:0:0:z-', 1], ['A', 'g:2:0:z-', 1], ['A', 'g:3:0:z-', 1], ['A', 'g:4:0:z-', 1], ['A', 'g:6:0:z-', 1], ['A', 'g:8:0:z-', 1], ['A', 'g:1:1', 1], ['A', 'g:7:1', 1], ['A', 'G:z-', 1], ['A', 'G:z-', 1]] }, d: 0 },
  // 7 H · first Hard (combine rotate + direction + protected; nothing new) · STREET CANYON. "Grand Arch" (F10) stands across the street,
  // a blue tram stop right behind it, a tower further back, blue buildings on both sides. The arch must fall FORWARD along the street,
  // the tower BACKWARD: each away from the tram stop.
  { name: 'Grand Arch', base: { A: 'keep', '*': 'weak' }, hero: 'A', heroId: 'F10', f: 9, tier: 'H', hard: true, kind: 'scene', arch: 'canyon', teaches: null,
    parts: [ARCH('A', 0, 4.0),
      M('B', 0, [{ f: 6, cx: 3, cz: 2, mat: 'conc', skin: 'full', g: 'alt' }], { z: -9.6, fh: 3.4, roof: { cap: 1 } }),
      M('C', 0, [{ f: 3, cx: 3, cz: 2, mat: 'brick', skin: 'full' }], { z: 17, fh: 3.0 })],
    keeps: KT(['hospital', 'school', 'hospital'], [K(-17.2, -2.5, 3, 2, 4), K(17.2, -2.5, 3, 2, 4), K(0, -5.0, 1, 2, 2)]), keep: KEEP('the library'),
    // U-2 (19/11): opening yaw 0.7 (opened at 0.5) -> 5.93: the left hospital and the school behind the arch are in sight at the opening
    // GD-22 / U-5 (20/11): TNT 12 -> 10, the expert's full plan (all 8 arch legs, one on the tower's back, one on the brick block): 96%.
    // With 10 there is no TNT for a second try at the same blast: any arch leg left out fails (7 legs 66%, 6 legs + 2 on the tower 66%
    // or blue 9-45%); the 19/11 live first-try plan (7 + 4) no longer fits
    charges: { tnt: 10 }, target: 0.85, yaw: 5.93, hint: 'A:z+', tip: 'HARD. Fall along\nthe street.', ftip: 'Arch forward, tower back.',
    sol: [T('A:z+', 0, 0), T('A:z+', 0, 1), T('A:z+', 0, 2), T('A:z+', 0, 3), T('A:z+', 0, 4), T('A:z+', 0, 5), T('A:z+', 0, 6), T('A:z+', 0, 7), T('B:z-', 0, 1), T('C:z+', 0, 1)],
    bot: { hints: [['A', 'A:z+', 1], ['A', 'B:z+', 1], ['A', 'C:z+', 1], ['A', 'A:z+', 1], ['A', 'B:z+', 1], ['A', 'A:z+', 1], ['A', 'A:z+', 1], ['A', 'B:z+', 1], ['A', 'A:z+', 1], ['A', 'A:z+', 1]] }, d: 0 },
  // 8 R · LESSON 3 (relief): STEEL HOLDS. "Rivet Tower" (F03): a steel lattice tower on three splayed legs, each on a grey concrete
  // foot; a steel water tower on concrete feet; a timber hall behind. One TNT never breaks steel: hit the grey feet. The two back feet
  // first: the tower lands on the hall.
  { name: 'Rivet Tower', base: { A: 'keep', '*': 'weak' }, hero: 'A', heroId: 'F03', f: 11, tier: 'R', kind: 'scene', arch: 'legs', teaches: 'Steel holds: blast the concrete feet',
    parts: [RIVET('A', 0, 0),
      M('W', -16, [{ f: 1, cx: 2, cz: 2, mat: 'conc', skin: 'open' }, { f: 3, cx: 2, cz: 2, mat: 'steel', skin: 'open' }], { roof: { cap: 1, tank: 1 } }),
      M('C', 0, [{ f: 4, cx: 3, cz: 2, mat: 'wood', skin: 'alt' }], big({ fh: 3.2, z: -17.0 }))],
    // GD-9 / U-5 (20/11): TNT 10 -> 8 (relief band 7-9): blast 1 the two back feet + the water tower's four feet, blast 2 the last foot + one
    // TNT on the hall: 89%, 0 spare. With 7 the gate's sensible second blast has only the foot (73%)
    charges: { tnt: 8 }, target: 0.85, yaw: 0.3, hint: 'A:z+', tip: 'Steel holds.\nHit the grey feet.', ftip: 'TNT on the concrete feet.',
    sol: [T('A:z-', 0, 0), T('A:z-', 0, 1), T('W:z-', 0, 0), T('W:z-', 0, 1), T('W:z+', 0, 0), T('W:z+', 0, 1)],
    solW: [[T('A:z-', 0, 0), T('A:z-', 0, 1), T('W:z-', 0, 0), T('W:z-', 0, 1), T('W:z+', 0, 0), T('W:z+', 0, 1)], [T('A:z+', 0, 0), T('C:z+', 0, 1)]],
    lesson: { check: [[T('A:z+', 3, 0), T('A:z-', 3, 0), T('A:z-', 3, 1), T('W:z-', 1, 0), T('W:z-', 1, 1), T('W:z+', 1, 0), T('W:z+', 1, 1), T('C:z+', 0, 0), T('C:z+', 0, 2), T('C:z+', 0, 1)]] },
    bot: { hints: [['A', 'A:z-', 1], ['A', 'A:z-', 1], ['A', 'W:z-', 1], ['A', 'W:z-', 1], ['A', 'W:z+', 1], ['A', 'W:z+', 1], ['A', 'A:z+', 2], ['A', 'C:z+', 2]] }, d: 0 },
  // 9 N · practise steel + domino. "Twin Saucer" (F04): the concrete saucer tower at the end of a row: it takes the row down. A steel
  // water tower on grey concrete feet stands apart (the L8 lesson again, on a side building); a massive block behind.
  { name: 'Twin Saucer', base: { A: 'keep', '*': 'weak' }, hero: 'A', heroId: 'F04', f: 11, tier: 'N', kind: 'scene', arch: 'legs-row', teaches: null,
    parts: [SAUCER('A', -8.5, 0),
      M('B', -2.8, [{ f: 6, cx: 2, cz: 2, mat: 'conc' }], { fh: 3.0, roof: { tank: 1 } }), M('C', 1.8, [{ f: 5, cx: 2, cz: 2, mat: 'wood', skin: 'alt' }], { fh: 3.0 }),
      M('E', 6.2, [{ f: 4, cx: 2, cz: 2, mat: 'wood' }], { fh: 3.0 }),
      M('F', -4.0, [{ f: 5, cx: 3, cz: 2, mat: 'conc', skin: 'alt' }], big({ fh: 3.2, z: -12.0, roof: { cap: 1 } })),
      M('W', 12.5, [{ f: 1, cx: 2, cz: 2, mat: 'conc', skin: 'open' }, { f: 3, cx: 2, cz: 2, mat: 'steel', skin: 'open' }], { z: -7, roof: { cap: 1, tank: 1 } })],
    charges: { tnt: 10 }, target: 0.85, yaw: 0.3, hint: 'A:x+', tip: 'Tip it down the row.\nSteel? Hit its feet.', ftip: 'Steel holds: grey feet first.',
    sol: [T('A:x+', 0, 0), T('A:x+', 0, 2), T('A:x+', 0, 1), T('F:z-', 0, 0), T('F:z-', 0, 2), T('F:z-', 0, 1), T('W:z-', 0, 0), T('W:z-', 0, 1), T('E:z+', 0, 0), T('B:z+', 0, 0)],
    bot: { hints: [['A', 'A:x+', 1], ['A', 'A:x+', 1], ['A', 'A:x+', 1], ['A', 'F:z-', 1], ['A', 'F:z-', 1], ['A', 'F:z-', 1], ['A', 'W:z-', 1], ['A', 'W:z-', 1], ['A', 'E:z+', 1], ['A', 'B:z+', 1]] }, d: 1 },
  // 10 SH · BOSS (combine rotate + direction + domino + protected; nothing new). "Lift Bridge" (F09): two stone bridge towers joined by
  // a high steel walkway, a blue building in front of each, a school at the left end, a hospital at the right end: the towers can only fall
  // TOWARDS EACH OTHER. Two blocks behind fall back.
  { name: 'Lift Bridge', base: { A: 'keep', B: 'keep', '*': 'weak' }, hero: 'A,B', heroId: 'F09', f: 12, tier: 'SH', boss: true, kind: 'scene', arch: 'complex', teaches: null,
    parts: [BTOWER('A', -9, 0, -1, 11.8), BTOWER('B', 9, 0, 1, 0),
      M('F', 8.0, [{ f: 5, cx: 3, cz: 2, mat: 'conc', skin: 'alt' }], big({ fh: 3.2, z: -18.0, roof: { cap: 1, ac: 1 } })),
      M('C', -8.0, [{ f: 3, cx: 3, cz: 2, mat: 'brick', skin: 'alt' }], big({ fh: 3.4, z: -18.0 }))],
    keeps: KT(['hospital', 'hospital', 'school', 'hospital'], [K(-9, 8.9, 1, 2, 2), K(9, 8.9, 1, 2, 2), K(-19.5, 0, 2, 2, 2), K(19.5, 0, 2, 2, 2)]),
    keep: KEEP('the school'),
    // GD-44 / U-5 (20/11): TNT 11 -> 6. The sensible fronts-first plan won the boss with 11 (96%); with 6 it lands on a blue building
    // (87%, blue 9%). Expert: one TNT on the back of each block, then the four inner legs: 91%, 0 spare
    charges: { tnt: 6 }, target: 0.85, yaw: 0.65, hint: 'A:x+', tip: 'BOSS! Find where\nit can fall.', ftip: 'Inner sides: they fall together.',
    // GD-17 (19/11): all in one blast the towers' fall nicked a blue building (9.1%, fail). Two blasts: the blocks behind first, then the
    // inner sides of the towers (blue 0%)
    sol: [T('F:z-', 0, 1), T('C:z-', 0, 1)],
    solW: [[T('F:z-', 0, 1), T('C:z-', 0, 1)], [T('A:x+', 0, 0), T('A:x+', 0, 1), T('B:x-', 0, 0), T('B:x-', 0, 1)]],
    bot: { hints: [['A', 'A:z+', 1], ['A', 'B:z+', 1], ['A', 'F:z+', 1], ['A', 'C:z+', 1], ['A', 'A:z+', 1], ['A', 'B:z+', 1], ['A', 'F:z+', 1], ['A', 'C:z+', 1], ['A', 'F:z+', 1], ['A', 'C:z+', 1], ['A', 'A:x-', 1]] }, d: 1 },
  // 11 R · LESSON 4 (relief): SEQUENCE, blast in steps. "Shell Hall" (F05): the hall on its podium of piers, a timber market shed across
  // its front, a school and a hospital at its ends. Blast 1: the shed. Blast 2: the front piers of the podium, now in sight: the hall
  // slides off forward. All at once, only the hall on top can be hit: the podium stands.
  { name: 'Shell Hall', base: { A: 'keep', '*': 'weak' }, hero: 'A', heroId: 'F05', f: 10, tier: 'R', kind: 'scene', arch: 'inner', teaches: 'Blast in steps: clear what hides it, then the piers',
    parts: [SHELL('A', 0, 0),
      M('S', 0, [{ f: 2, cx: 5, cz: 2, mat: 'wood', skin: 'alt' }], { bay: 3.6, fh: 3.2, z: 11.6 })],
    keeps: KT(['school', 'hospital'], [K(-14.2, 0, 2, 2, 3), K(14.2, 0, 2, 2, 3)]), keep: KEEP('the school'),
    // U-5 (20/11): TNT 7 -> 6 (expert 6, 0 spare)
    charges: { tnt: 6 }, target: 0.85, yaw: 0.55, hint: 'S:z+', tip: 'Clear the shed,\nthen the hall.', ftip: 'Shed first. Then the piers.',
    sol: [T('S:z+', 0, 0), T('S:z+', 0, 4)],
    solW: [[T('S:z+', 0, 0), T('S:z+', 0, 4)], [T('A:z+', 0, 0), T('A:z+', 0, 1), T('A:z+', 0, 2), T('A:z+', 0, 3)]],
    lesson: { check: [[T('S:z+', 0, 0), T('S:z+', 0, 4), T('A:z+', 1, 0), T('A:z+', 1, 1), T('A:z+', 1, 2), T('A:z+', 1, 3), T('A:z+', 1, 4)]] },
    bot: { hints: [['A', 'S:z+', 1], ['A', 'S:z+', 1], ['A', 'A:z+', 2], ['A', 'A:z+', 2], ['A', 'A:z+', 2], ['A', 'A:z+', 2]] }, d: 1 },
  // 12 N · practise SEQUENCE (twist: the thing to reach is BEHIND). "Star Pedestal" (F21): the stone plinth in its star rampart, a
  // kiosk in front, a massive block behind-left, and a reinforced core alone behind its right corner.
  { name: 'Star Pedestal', base: { A: 'keep', '*': 'weak' }, hero: 'A', heroId: 'F21', f: 10, tier: 'N', kind: 'scene', arch: 'hidden', teaches: null,
    parts: [PEDESTAL('A', 0, 0),
      { id: 'R', kind: 'core6', x: 12, z: -11, floors: 6 }, M('C', -13, [{ f: 3, cx: 2, cz: 2, mat: 'wood', skin: 'alt' }], { z: 12, fh: 3.0 }),
      M('D', -6.0, [{ f: 5, cx: 3, cz: 2, mat: 'conc', skin: 'alt' }], huge({ z: -21.0, roof: { cap: 1 } }))],
    charges: { tnt: 9 }, target: 0.85, yaw: 0.55, hint: 'A:z+', tip: 'Look behind it.', ftip: 'Save one TNT for the core.',
    sol: [T('A:z+', 0, 0), T('A:z+', 0, 2), T('A:z+', 0, 1)],
    solW: [[T('A:z+', 0, 0), T('A:z+', 0, 2), T('A:z+', 0, 1)], [T('R:z+', 0, 0), T('R:z+', 0, 1), T('D:z+', 0, 0), T('D:z+', 0, 2), T('D:z+', 0, 1), T('C:z+', 0, 0)]],
    bot: { hints: [['A', 'A:z+', 1], ['A', 'A:z+', 1], ['A', 'A:z+', 1], ['A', 'R:z+', 2], ['A', 'R:z+', 2], ['A', 'D:z+', 2], ['A', 'D:z+', 2], ['A', 'D:z+', 2], ['A', 'C:z+', 2]] }, d: 1 },
];
LEVELS.forEach(l => { if (l.fillMax == null) l.fillMax = 0.73; });   // scale rule (LEVEL-BRIEF-100 §5.2; patch/v12.js): the camera pulls back until the hero is <= 73% of the play-area height
// dev hook (as LAB in src-l13-36.js): L12LAB=<file.js> may change the levels before a private test build (never set for the checkpoints)
if (process.env.L12LAB) require(require('path').resolve(process.env.L12LAB))(LEVELS, { T, G, M, K, KT, KEEP, all, big, huge, HUG, stack, KITP, WHIRLY, STRIPEY, TOCK, NEEDLE, DOORSTOP, DOMEHALL, ARCH, RIVET, SAUCER, BTOWER, SHELL, PEDESTAL });
module.exports = LEVELS;
