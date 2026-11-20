// ---- levels6 v15 A1 (D-blast-ROLLOUT batch A1, 13/11/2026; built on STD-v1): L1-L5 remade on the L32 standard.
// Appended LAST inside main() by tools/src-a1.js (base: checkpoints/index-v10h-l32-monument.html, read only). v10-v14 are not edited:
// this file only calls M14.api.* (v14 helper API, L32-MONUMENT.md §6) and replaces the data of LEVELS[0..4] at load.
//   D-blast-K1: L1-16 heroes are monumental but on their LADDER material (wood / brick / concrete), not the RC tier.
//   D-blast-K2: tutorial levels get 4-6 TNT.   D-blast-HERO-PROC: the hero copies its Figma tile; difficulty = surroundings, TNT, yaw.
// Part kinds (owned by A1, reused read-only by later batches): a1mill (F27), a1light (F28), a1tock (F01), a1needle (F16), a1wedge (F24).
// Flag: ?a1=0 = the old L1-L5. Test API: window.__blast.a1.
var A1 = { on:true, info:{} };
(function(){
  var QS15 = new URLSearchParams(location.search); A1.on = QS15.get("a1") !== "0";
  var api = M14.api, kd = l6KdAdd, NS = 16, DA = Math.PI*2/NS, _e = new THREE.Euler();
  var WALL = { wood:"wwall", brick:"bkw", concrete:"cpan", rc:"cpan", steel:"cpan" };
  var C = { floor:0xEFE6D2, wood:0xC58B55, white:0xF7F4EC, warm:0xFFD98A, warm2:0xFFF1C4, amber:0xFFB347, dark:0x4F535E, iron:0x3A3D45, frame:0x4E6672, teal:0x3F93A8,
    green:0x62A544, slate:0x6B7280, gold:0xE8B23A, cream:0xF0E3C4, brick:0xC9583A, core:0x4A4F5A, sofa:0xD9714A, sofa2:0x5FA8B8, stone:0xB9B7B2, stoneD:0x8E9299 };
  // ------------------------------------------------------------------ floors that one TNT cannot take out (round 2)
  // The ladder slab / cassette (hp 150) died from ONE TNT put on it, or on a pier or a pane next to it, on any upper storey, and the
  // storeys above came down through the tower: 76-88 % from a single TNT on the needle, the lighthouse, the clock tower and the wedge
  // (the L32 lesson: "hardening only the piers"). A hero's floors now take a blast (hp 600, armor 0.7: a TNT on contact does about a
  // sixth of it, and it is reset at every BLAST like any ladder member). They still shatter on landing as before (same `shatter`), the
  // piers and walls keep their ladder strength, and the rule "two legs side by side" is the only way down.
  var HARD = QS15.get("hard") === "0" ? {} : { slab:"a1slab", mdC:"a1mdC", mdB:"a1mdB" };   // not the mill's plank cassettes (mdW): L1 has no such problem to solve and its pancake lost 7 points with them
  Object.keys(HARD).forEach(function(k){ api.floors(k, { name:HARD[k], push:+(QS15.get("hpush") || 0.2) }); });   // STD-v2: M14.api.floors (the rule moved to v14, H0b)   // and a bonded floor is shoved a fifth as hard by a blast (a light cassette thrown up by one TNT shattered and dropped its storey)
  var HD = function(k){ return HARD[k] || k; };
  // a1lite: the same blast-proof floor at a third of the weight (concrete-type joints, so a tower on it can still tip). Under the heavy
  // slabs / transfer decks the piers of the needle, the lighthouse and the wedge stood close to their crushing load: the shock of one
  // TNT anywhere set off a chain of crushed piers (82-85 % from one TNT on a pane of the needle's second storey).
  api.floors("slab", { name:"a1lite", density:+(QS15.get("lited") || 900), push:L6_PUSH.a1slab });
  // ------------------------------------------------------------------ helpers
  var mem = function(key, x, y, z, sx, sy, sz, fl, gi, gj, tint){ var b = addBlock(x, y, z, sx, sy, sz, key, {floor:fl}); if(gi != null){ b.gi = gi; b.gj = gj; } if(tint != null) b.tint = tint; return b; };
  var rng = function(seed){ var s = seed; return function(){ s = (s*1103515245 + 12345) & 0x7fffffff; return s/0x7fffffff; }; };
  var near = function(list, x, z){ var best = list[0], bd = 1e9; list.forEach(function(m){ var d = Math.max(0, Math.abs(x - m.spawn.x) - m.half[0]) + Math.max(0, Math.abs(z - m.spawn.z) - m.half[2]) + 0.001*Math.hypot(x - m.spawn.x, z - m.spawn.z); if(d < bd){ bd = d; best = m; } }); return best; };
  // a decor box with yaw (about y) applied AFTER a tilt about its own long (x) axis / a roll about its own z: sloped faces, sails
  var kq = function(host, g, c, x, y, z, sx, sy, sz, yaw, tilt, roll){ kd(host, g, c, x, y, z, sx, sy, sz); host.kd[host.kd.length - 1].q.setFromEuler(_e.set(tilt || 0, yaw || 0, roll || 0, "YXZ")); };
  // a bar between two points (decor): thickness t
  var bar = function(host, c, x0, y0, z0, x1, y1, z1, t, g){ var dx = x1 - x0, dy = y1 - y0, dz = z1 - z0, len = Math.hypot(dx, dy, dz), yaw = Math.atan2(-dz, dx), roll = Math.asin(Math.max(-1, Math.min(1, dy/len)));
    kq(host, g || "box", c, (x0 + x1)/2, (y0 + y1)/2, (z0 + z1)/2, len, t, t, yaw, 0, roll); };
  // 16 sectors of a round piece (y0..y0+h, diameter D) round (cx, cz); each sector rides the member of `hosts` nearest under it
  var ring = function(hosts, g, c, y0, h, D, cx, cz, rq){ cx = cx || 0; cz = cz || 0; for(var i=0;i<NS;i++){ var am = (i + 0.5)*DA, r = D/2*(rq || 0.6); kd(near(hosts, cx + Math.sin(am)*r, cz + Math.cos(am)*r), g, c, cx, y0 + h/2, cz, D, h, D, 0, i*DA, 0); } };
  var round = function(hosts, g, c, n, r, y0, h, w, d, a0, cx, cz){ cx = cx || 0; cz = cz || 0; for(var i=0;i<n;i++){ var an = (a0 || 0) + i*Math.PI*2/n, x = cx + Math.sin(an)*r, z = cz + Math.cos(an)*r; kd(near(hosts, x, z), g, c, x, y0 + h/2, z, w, h, d, 0, an, 0); } };
  // an eight-sided prism (decor) of flat-to-centre radius r: four rotated boxes
  var oct = function(host, c, y0, h, r, cx, cz, g){ cx = cx || 0; cz = cz || 0; var s = 2*r*0.4142; [0, 1, 2, 3].forEach(function(i){ kd(host, g || "box", c, cx, y0 + h/2, cz, 2*r, h, s, 0, i*Math.PI/4, 0); }); };
  // ---- one storey of an EIGHT-SIDED frame: 8 posts just inside the corners, a cross of three cassettes, a wall panel on the four axis faces.
  //      o = { y0, h, r (centre to flat), cw (post), fl, MT, wall (key | null), dk, tp, td, tw (tints), cx, cz }
  var otag = function(tag, p, st, cx, cz){ var k = Math.floor((Math.atan2(p.spawn.z - (cz || 0), p.spawn.x - (cx || 0)) + 2*Math.PI)/(Math.PI/4)) % 8; tag(p, st, Math.cos(k*Math.PI/4), Math.sin(k*Math.PI/4)); };   // the 8 posts of an eight-sided storey, in order
  var octSt = function(o){ var r = o.r, cw = o.cw, dk = o.dk || 0.4, ch = o.h - dk, px = r - cw/2, a = r*0.4142, pa = Math.max(cw/2 + 0.02, a - cw/2), cx = o.cx || 0, cz = o.cz || 0, IN = 0.06, out = { posts:[], decks:[], walls:[], o:o };
    [[px, pa, 1, 1], [px, -pa, 1, 0], [-px, pa, 0, 1], [-px, -pa, 0, 0], [pa, px, 1, 2], [-pa, px, 0, 2], [pa, -px, 1, -1], [-pa, -px, 0, -1]].forEach(function(q){
      out.posts.push(mem(o.MT.pier, cx + q[0], o.y0 + ch/2, cz + q[1], cw, ch, cw, o.fl, q[2], q[3], o.tp)); });
    var y = o.y0 + ch + dk/2, a2 = Math.max(a, pa + cw/2), k = HD(o.MT.deck), e = (a2 + r - IN)/2, w = r - IN - a2;
    if(o.fl % 2 === 0) out.decks.push(mem(k, cx, y, cz, 2*(r - IN), dk, 2*a2, o.fl), mem(k, cx, y, cz + e, 2*a2, dk, w, o.fl), mem(k, cx, y, cz - e, 2*a2, dk, w, o.fl));
    else out.decks.push(mem(k, cx, y, cz, 2*a2, dk, 2*(r - IN), o.fl), mem(k, cx + e, y, cz, w, dk, 2*a2, o.fl), mem(k, cx - e, y, cz, w, dk, 2*a2, o.fl));
    out.decks.forEach(function(d){ d.tint = o.td; });
    var len = 2*pa - cw - 0.04, th = o.th || 0.24;
    if(o.wall && len > 0.3) [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function(q){ var wl = mem(o.wall, cx + q[0]*(r - th/2), o.y0 + (ch - 0.05)/2, cz + q[1]*(r - th/2), q[0] ? th : len, ch - 0.05, q[0] ? len : th, o.fl, null, null, o.tw); wl.a1f = q; out.walls.push(wl); });
    return out; };
  // ---- one storey of a BOX frame: perimeter piers on the column lines xs x zs (corner piers pw, the others mw), one floor cassette (or a
  //      grid of them), a skin panel per bay and face: "glass" (mglass pane), "wall" (the material's wall panel), "open".
  //      o = { y0, h, hx, hz (half sizes to the outer face), nx, nz (column lines), pw, mw, fl, MT, skin (string | {face:kind}), dk, cx, cz,
  //            tp, td, tw, split:[kx, kz] (cassette grid), inner:[[x, z, w]...] (extra piers inside) }
  var boxSt = function(o){ var dk = o.dk || 0.5, ch = o.h - dk, cx = o.cx || 0, cz = o.cz || 0, nx = o.nx || 2, nz = o.nz || 2, pw = o.pw || 1.1, mw = o.mw || 0.9, i, j, out = { piers:[], decks:[], panes:[], walls:[], o:o }, xs = [], zs = [];
    for(i=0;i<nx;i++) xs.push(o.xs ? o.xs[i] : -o.hx + pw/2 + i*(2*o.hx - pw)/(nx - 1)); for(j=0;j<nz;j++) zs.push(o.zs ? o.zs[j] : -o.hz + pw/2 + j*(2*o.hz - pw)/(nz - 1));
    var wOf = function(i, j){ return ((i === 0 || i === nx - 1) && (j === 0 || j === nz - 1)) ? pw : mw; };
    for(i=0;i<nx;i++) for(j=0;j<nz;j++){ if(i > 0 && i < nx - 1 && j > 0 && j < nz - 1) continue; var w = wOf(i, j), ex = i === 0 ? -o.hx + w/2 : i === nx - 1 ? o.hx - w/2 : xs[i], ez = j === 0 ? -o.hz + w/2 : j === nz - 1 ? o.hz - w/2 : zs[j];
      var p = mem(o.MT.pier, cx + ex, o.y0 + ch/2, cz + ez, w, ch, w, o.fl, i, j, o.tp); p.a1x = ex; p.a1z = ez; out.piers.push(p); }
    (o.inner || []).forEach(function(q, n){ out.piers.push(mem(o.MT.pier, cx + q[0], o.y0 + ch/2, cz + q[1], q[2] || mw, ch, q[2] || mw, o.fl, 20 + n, 20, o.tp)); });
    var sp = o.split || [1, 1], IN = 0.03, wx = (2*o.hx - 2*IN)/sp[0], wz = (2*o.hz - 2*IN)/sp[1];
    for(i=0;i<sp[0];i++) for(j=0;j<sp[1];j++){ var d = mem(HD(o.deck || o.MT.deck), cx - o.hx + IN + wx*(i + 0.5), o.y0 + ch + dk/2, cz - o.hz + IN + wz*(j + 0.5), wx, dk, wz, o.fl); d.tint = o.td; out.decks.push(d); }
    var kind = function(face){ return typeof o.skin === "string" ? o.skin : ((o.skin || {})[face] || (o.skin || {}).def || "open"); };
    var pan = function(face, x, z, lx, lz){ var k = kind(face); if(k === "open" || Math.max(lx, lz) < 0.4) return; var hh = ch - 0.05, b;
      if(k === "glass"){ b = mem("mglass", cx + x, o.y0 + hh/2, cz + z, lx, hh, lz, o.fl); out.panes.push(b); } else { b = mem(o.wall || WALL[o.mat] || "cpan", cx + x, o.y0 + hh/2, cz + z, lx, hh, lz, o.fl, null, null, o.tw); out.walls.push(b); }
      b.a1face = face; };
    var gth = function(face){ return kind(face) === "glass" ? 0.1 : (o.th || 0.26); }, t;
    for(i=0;i<nx-1;i++){ var xa = (i === 0 ? -o.hx + pw : xs[i] + mw/2) + 0.02, xb = (i === nx - 2 ? o.hx - pw : xs[i + 1] - mw/2) - 0.02;
      t = gth("z+"); pan("z+", (xa + xb)/2, o.hz - t/2 - 0.02, xb - xa, t); t = gth("z-"); pan("z-", (xa + xb)/2, -o.hz + t/2 + 0.02, xb - xa, t); }
    for(j=0;j<nz-1;j++){ var za = (j === 0 ? -o.hz + pw : zs[j] + mw/2) + 0.02, zb = (j === nz - 2 ? o.hz - pw : zs[j + 1] - mw/2) - 0.02;
      t = gth("x+"); pan("x+", o.hx - t/2 - 0.02, (za + zb)/2, t, zb - za); t = gth("x-"); pan("x-", -o.hx + t/2 + 0.02, (za + zb)/2, t, zb - za); }
    return out; };
  // glass dress of a pane: a transom + two sheen streaks (as L32)
  var paneDress = function(g, y0, h, s){ var xn = g.half[0] < g.half[2], sg = Math.sign(xn ? g.spawn.x : g.spawn.z) || 1, len = 2*(xn ? g.half[2] : g.half[0]), x = g.spawn.x, z = g.spawn.z, py = g.spawn.y, ph = 2*g.half[1];
    kd(g, "ibox", C.frame, x + (xn ? sg*0.07 : 0), y0 + h/2 - 0.1, z + (xn ? 0 : sg*0.07), xn ? 0.06 : len, 0.2, xn ? len : 0.06);
    [[-0.25*len, Math.min(0.6, 0.2*len)], [0.12*len, 0.16]].forEach(function(w){ kd(g, "glare", 0xffffff, x + (xn ? sg*0.075 : w[0]), py + (s % 2 ? 0.7 : -0.6), z + (xn ? w[0] : sg*0.075), xn ? 0.02 : w[1], ph*0.55, xn ? w[1] : 0.02, xn ? sg*0.45 : 0, 0, xn ? 0 : -sg*0.45); }); };
  // TIP RULE (A1, ladder-material heroes whose lesson is a fall DIRECTION): the 8 perimeter piers of the ground storey are tagged in order
  // round it (a corner, a middle pier, a corner on every face). When two piers next to each other are gone, the third pier of that FACE
  // is overloaded and gives way 0.15 s later (game time: deterministic). The other five keep standing, so the tower tips over TOWARDS
  // that face by the ordinary physics: "two legs side by side, and it falls that way". One lost pier, or two that are not neighbours,
  // never drop it. With `hold` (lighthouse, clock tower, needle) the far face is a hinge for that many seconds: see below.
  // (STD-v1's storey rule, M14.api.ring(), crushes the whole storey: a straight pancake with no direction; it is used unchanged on
  // L1's mill.) btag(storey, hold) -> the ring; ring.onTip(m, fail) = a hero's own follow-up (the wedge).
  // H0b: the rule itself now lives in v14 (M14.api.tip, STD-v2); this is the same call with A1's storey record
  var btag = function(st, hold){ return api.tip({ piers:st.piers, skin:st.walls.concat(st.panes), decks:st.decks, hinge:hold, xz:function(p){ return p.a1x == null ? null : [p.a1x, p.a1z]; } }); };
  var FN = { "z+":[0, 1], "z-":[0, -1], "x+":[1, 0], "x-":[-1, 0] };
  // a decor box on the outer face of a skin panel b (b.a1face): u along the face, v up from its centre, w x h, t thick, `off` proud
  var onFace = function(b, g, c, u, v, w, h, t, off){ var n = FN[b.a1face], X = !!n[0]; t = t || 0.06; var d = (X ? b.half[0] : b.half[2]) + (off || 0) + t/2;
    kd(b, g, c, b.spawn.x + (X ? n[0]*d : u), b.spawn.y + v, b.spawn.z + (X ? u : n[1]*d), X ? t : w, h, X ? w : t); };
  A1.h = { mem:mem, octSt:octSt, boxSt:boxSt, ring:ring, round:round, oct:oct, bar:bar, kq:kq, near:near, rng:rng, paneDress:paneDress, C:C };

  // ================================================================== F27 "Old Whirly": timber smock mill (L1)
  // Tile: a pale ring of posts, an eight-sided boarded body that tapers, small white-framed windows, a dark round cap, lattice sails on a
  // hub. Twist (D-blast-ART-2): SIX sails, not four. 43 m to the eaves, 49 m to the cap, the sails reach 63 m.
  // Members: 8 timber posts per storey (wpost), a cross of three plank cassettes (mdW), four board walls (wwall): ladder wood, one TNT a post.
  V5_PARTS.a1mill = function(P){ var MT = Object.assign({}, api.mat(P.mat || "wood")), n0 = blocks.length, tag = P.rule === 0 ? function(){} : api.ring(), rr = rng(2701), s, k, j;
    if(P.deck) MT.deck = P.deck;
    var H0 = 5.6, HS = 5.4, NB = 7, R0 = 8.6, R1 = 8.1, DR = 0.5, bd = 0xE39A40, bd2 = 0xD88C34, pale = 0xEAD9B0, spar = 0x8A5A2B, sail = 0xE8B64C;
    var base = addBlock(0, -0.25, 0, 26, 0.5, 26, "base", {anchor:true});
    oct(base, 0xCDBE9A, 0, 0.3, R0 + 2.2); oct(base, 0xD9C9A4, 0.3, 0.2, R0 + 1.1);
    // ground storey: the open ring of posts (the lesson: tap a post)
    var g0 = octSt({ y0:0, h:H0, r:R0, cw:1.0, fl:0, MT:MT, wall:null, tp:pale, td:0xD9C596, dk:0.5 });
    g0.posts.forEach(function(p){ var q = [p.spawn.x, p.spawn.z]; otag(tag, p, 0);
      kd(p, "box", 0xD9C596, q[0], 0.35, q[1], 1.5, 0.7, 1.5); kd(p, "box", 0xD9C596, q[0], H0 - 0.5 - 0.3, q[1], 1.4, 0.5, 1.4); });   // foot block + capital
    var d0 = g0.decks[0]; oct(d0, pale, H0 - 0.62, 0.7, R0 + 0.45);
    // seen between the posts: the mill floor (decor on the ground slab): millstones, sacks, a ladder stair, a lit lantern, the door frame
    kd(base, "icyl", 0x9A9388, -2.2, 1.0, -1.0, 3.6, 0.9, 3.6); kd(base, "icyl", 0xB3AC9F, -2.2, 1.75, -1.0, 3.2, 0.6, 3.2); kd(base, "icyl", C.iron, -2.2, 2.2, -1.0, 0.5, 0.5, 0.5);
    for(k=0;k<7;k++){ var sa = k*0.9 + 0.4, sr = 4.6 + (k % 2)*1.3; kd(base, "ibush", k % 3 ? 0xE8DDC0 : 0xD8C9A0, Math.cos(sa)*sr, 1.05, Math.sin(sa)*sr, 1.5, 1.3, 1.2, 0, sa, 0); }
    kd(d0, "ibox", C.wood, 3.4, H0/2 - 0.2, -2.6, 1.1, 0.24, 6.4, 0.72, 0, 0); kd(d0, "lit", C.warm, 0, H0 - 1.3, 0, 0.7, 0.9, 0.7); kd(d0, "ibox", C.iron, 0, H0 - 0.75, 0, 0.1, 0.5, 0.1);
    kd(d0, "ibox", C.core, 0, H0/2, 0, 0.7, H0 - 0.6, 0.7);   // the main shaft
    // the body: seven storeys that step in half a metre each; the boarded skin is drawn sloped (decor on the walls / the cassettes)
    var y = H0, sts = [g0], sl = Math.atan(DR/HS);
    for(s=0;s<NB;s++){ var r = R1 - DR*s, st = octSt({ y0:y, h:HS, r:r, cw:0.8, fl:s + 1, MT:MT, wall:"wwall", tp:0xC57F2E, td:0xB9793A, tw:s % 2 ? bd : bd2, dk:0.4 }); sts.push(st);
      st.posts.forEach(function(p){ otag(tag, p, s + 1); });
      var rm = r - DR/2 + 0.2, sw = 2*rm*0.4142 + 0.12, hh = HS/Math.cos(sl), col = s % 2 ? bd : bd2;
      [0, 1, 2, 3, 4, 5, 6, 7].forEach(function(i){ var an = i*Math.PI/4, ax = i % 2 === 0, q = [Math.round(Math.sin(an)), Math.round(Math.cos(an))], host = ax ? (st.walls.filter(function(w){ return w.a1f[0] === q[0] && w.a1f[1] === q[1]; })[0] || st.decks[0]) : near(st.decks, Math.sin(an)*r*0.8, Math.cos(an)*r*0.8);
        kq(host, "box", col, Math.sin(an)*rm, y + HS/2, Math.cos(an)*rm, sw, hh, 0.22, an, -sl, 0);
        for(j=1;j<4;j++) kq(host, "box", 0xB9793A, Math.sin(an)*(rm + DR*(0.5 - j/4) + 0.03), y + HS*j/4, Math.cos(an)*(rm + DR*(0.5 - j/4) + 0.03), sw - 0.2*j/4, 0.09, 0.22, an, -sl, 0);   // board lines
        // small white-framed windows, lit, on alternate faces and storeys
        if((i + s) % 2 === 0 && s < NB - 1 && s % 2 === 0){ var wr = rm + 0.08; kq(host, "box", C.white, Math.sin(an)*wr, y + HS*0.55, Math.cos(an)*wr, 1.7, 2.3, 0.22, an, -sl, 0); kq(host, "lit", (i + s) % 4 ? C.warm : 0x4A3B2E, Math.sin(an)*(wr + 0.04), y + HS*0.55, Math.cos(an)*(wr + 0.04), 1.2, 1.8, 0.22, an, -sl, 0); } });
      oct(st.decks[0], 0xB9793A, y + HS - 0.5, 0.5, r + 0.34);   // the ledge at every floor
      y += HS; }
    // the door on the front (z+) face of the first body storey, a gallery rail at its foot
    var f1 = sts[1], fw = f1.walls.filter(function(w){ return w.a1f[1] === 1; })[0] || f1.decks[0]; kd(fw, "box", C.white, 0, H0 + 1.7, R1 + 0.2, 2.4, 3.4, 0.3); kd(fw, "box", 0x4A5B6C, 0, H0 + 1.6, R1 + 0.26, 1.8, 3.0, 0.3);
    round(g0.decks, "box", spar, 16, R0 + 0.9, H0, 1.2, 0.16, 0.16); oct(d0, spar, H0 + 1.15, 0.14, R0 + 0.98);
    // the cap: a dark dome on a ring, the wind shaft, the hub and SIX lattice sails (decor on the top cassette)
    var top = sts[NB], td = top.decks[0], rt = R1 - DR*(NB - 1), hy = y + 2.2, hz = rt + 2.6, RS = 19.5, w = 3.6;
    oct(td, C.dark, y, 0.7, rt + 0.7); kd(td, "dome", C.dark, 0, y + 0.7, 0, 2*rt + 1.6, rt*1.15, 2*rt + 1.6); kd(td, "ibush", C.iron, 0, y + 0.7 + rt*1.15, 0, 1.4, 1.4, 1.4);
    bar(td, C.dark, 0, hy, -rt*0.5, 0, hy, hz + 0.5, 1.3); kd(td, "ibush", C.dark, 0, hy, hz, 3.0, 3.0, 3.0); kd(td, "lit", C.amber, 0, hy, hz + 1.5, 0.5, 0.5, 0.1);
    for(k=0;k<6;k++){ var a = k*Math.PI/3 + 0.3, dx = Math.cos(a), dy = Math.sin(a), nx = -dy, ny = dx;
      bar(td, spar, 0, hy, hz, dx*RS, hy + dy*RS, hz, 0.55);
      bar(td, sail, dx*4.2 + nx*w, hy + dy*4.2 + ny*w, hz, dx*RS + nx*w, hy + dy*RS + ny*w, hz, 0.3);
      bar(td, sail, dx*4.2 + nx*w*0.5, hy + dy*4.2 + ny*w*0.5, hz, dx*RS + nx*w*0.5, hy + dy*RS + ny*w*0.5, hz, 0.2);
      for(j=0;j<=9;j++){ var q = 4.2 + (RS - 4.2)*j/9; bar(td, sail, dx*q, hy + dy*q, hz, dx*q + nx*w, hy + dy*q + ny*w, hz, 0.26); } }
    A1.info.F27 = { top:hy + RS, eaves:y, members:blocks.length - n0, storeys:NB + 1 };
    return { w:26, d:26 };
  };

  // ================================================================== F28 "Stripey Point": brick lighthouse on a rock (L2; reused L14)
  // Tile: a grey stepped rock with stairs, a round tapering shaft in red / white bands, a door, small windows, an iron gallery with a rail,
  // a glass lantern (teal, never the protected blue) with the lamp seen inside, a dark dome. Twist: a ring of lit portholes on the red bands.
  // 59 m to the gallery, 71 m to the vane. Members: a square brick frame inside the round skin: 8 brick piers per storey (bk; 4 where
  // the shaft is slim), one slab, brick walls (bkw): ladder brick, one TNT a pier. The round skin is 16 sectors per storey riding the
  // walls / slabs; the foot shows a white pilaster over each leg. The rock is drawn round the foot (decor).
  V5_PARTS.a1light = function(P){ var MT = api.mat("brick"), n0 = blocks.length, s, k, RK = 3, H = 5.6, N = P.n || 10, R0 = 7.6, DR = 0.3, RD = 0xD9553A, WH = 0xF3EEE2, sts = [];
    var base = addBlock(0, -0.25, 0, 30, 0.5, 30, "base", {anchor:true});   // the rock is drawn round the foot (decor on the ground): rubble that came to rest on a real 3 m rock never counted as down
    oct(base, 0x8E9299, 0, RK*0.45, R0 + 5.0); oct(base, 0xA3A7AE, RK*0.45, RK*0.3, R0 + 3.6); oct(base, 0xB4B7BC, RK*0.75, RK*0.25 + 0.04, R0 + 2.3);
    [0, 1, 2, 3].forEach(function(i){ kd(base, "box", 0x9A9EA6, 0, i*RK/4 + RK/8 - 0.01, R0 + 5.6 - i*1.2, 4.4, RK/4, 2.6); });   // the stair up the rock
    // a square brick frame inside the round skin: 8 piers per storey (4 from where the shaft is too slim), a floor slab, brick walls
    for(s=0;s<N;s++){ var R = R0 - DR*s, hx = R*0.7, y0 = s ? RK + s*H : 0, hs = s ? H : RK + H, red = s % 2 === 1, n3 = hx > 3.9, st = boxSt({ y0:y0, h:hs, hx:hx, hz:hx, nx:n3 ? 3 : 2, nz:n3 ? 3 : 2, pw:1.1, mw:0.9, fl:s, MT:MT, deck:P.deck || "a1lite", skin:"wall", mat:"brick",
        tp:s ? (red ? RD : WH) : WH, td:red ? 0xC94B32 : 0xE4DDCB, tw:s ? (red ? RD : WH) : 0xB9483A, dk:0.4, th:0.3 }); sts.push(st);
      if(s === 0 && P.rule !== 0) btag(st, P.hold);
      var hosts = st.walls.concat(st.decks), D = 2*R;
      // legSkin (16/11, tester round GD-12 / UX-15): the foot's round skin rides the nearest LEG, not the wall / slab behind it, so a
      // tap anywhere on the visible base puts the TNT on a leg (main/tap2.js snaps a tap on dress onto its member). Decor only:
      // no body, no physics change.
      var h0 = !s && P.legSkin ? st.piers : hosts;
      ring(h0, "sec", s ? (red ? RD : WH) : 0xB9483A, s ? y0 : RK, H, D); if(!s) y0 = RK;
      if(s === 0){   // the foot: a white pilaster over each pier (it goes with its pier), a stone ring, the door at the front
        st.piers.forEach(function(p){ var a = Math.atan2(p.spawn.x, p.spawn.z), x = Math.sin(a)*(R - 0.1), z = Math.cos(a)*(R - 0.1); kd(p, "box", WH, x, y0 + H/2, z, 1.9, H, 0.7, 0, a, 0); kd(p, "box", 0xC9CCD1, x, y0 + 0.5, z, 2.3, 1.0, 0.9, 0, a, 0); });
        ring(h0, "sec", WH, y0 + H - 0.6, 0.6, D + 0.6);
        var fw = st.walls.filter(function(w){ return w.a1face === "z+"; })[0] || st.decks[0];
        kd(fw, "box", 0x4A5B6C, 1.9, y0 + 1.8, Math.sqrt(R*R - 1.9*1.9) + 0.06, 1.9, 3.6, 0.2, 0, 0.25, 0); kd(fw, "lit", C.amber, 1.9, y0 + 4.1, Math.sqrt(R*R - 1.9*1.9) + 0.1, 0.9, 0.4, 0.1, 0, 0.25, 0); }
      else {   // small windows up the front and the back, lit portholes round the red bands (the twist)
        if(!red && s % 4 === 2) [0, Math.PI].forEach(function(a0){ round(hosts, "box", C.white, 1, D/2 - 0.02, y0 + 1.5, 2.6, 1.7, 0.3, a0); round(hosts, "lit", C.warm, 1, D/2 + 0.02, y0 + 1.7, 2.2, 1.2, 0.3, a0); });
        if(red){ round(hosts, "box", C.white, 8, D/2 - 0.1, y0 + 2.2, 1.5, 1.5, 0.5, Math.PI/8); for(k=0;k<8;k++){ var a = Math.PI/8 + k*Math.PI/4, x = Math.sin(a)*(D/2 + 0.05), z = Math.cos(a)*(D/2 + 0.05); kd(near(hosts, x, z), "lit", k % 3 ? C.warm : C.warm2, x, y0 + 2.95, z, 0.9, 0.9, 0.3, 0, a, 0); } } } }
    // the gallery, the lantern room (glass, the lamp inside), the dome
    var top = sts[N - 1], td = top.decks, rt = R0 - DR*(N - 1), y = RK + N*H, gr = rt + 2.4;
    ring(td, "fsec", C.iron, y - 1.6, 1.6, 2*gr, 0, 0, 0.3); ring(td, "sec", C.iron, y, 0.4, 2*gr + 0.3, 0, 0, 0.3); y += 0.4;
    round(td, "ibox", C.iron, 24, gr - 0.15, y, 1.5, 0.16, 0.16); ring(td, "lsec", C.iron, y + 1.45, 0.14, 2*gr - 0.3, 0, 0, 0.3);
    ring(td, "sec", WH, y, 1.6, 2*rt*0.9, 0, 0, 0.3); y += 1.6;
    var lr = rt*0.8; ring(td, "gsec", 0x2E9DBD, y, 5.6, 2*lr, 0, 0, 0.3); round(td, "ibox", C.iron, 8, lr, y, 5.6, 0.24, 0.24, Math.PI/8);
    kd(td[0], "icyl", C.iron, 0, y + 0.7, 0, 2.2, 1.4, 2.2); kd(td[0], "lit", C.warm2, 0, y + 2.9, 0, 1.9, 3.0, 1.9, 0, Math.PI/4, 0); kd(td[0], "lit", C.amber, 0, y + 2.9, 0, 2.5, 1.2, 2.5); y += 5.6;
    ring(td, "sec", C.iron, y, 0.5, 2*lr + 1.2, 0, 0, 0.3); y += 0.5; kd(td[0], "dome", C.dark, 0, y, 0, 2*lr + 0.8, lr*0.9, 2*lr + 0.8); y += lr*0.9;
    kd(td[0], "ibush", C.iron, 0, y, 0, 1.3, 1.3, 1.3); kd(td[0], "box", C.iron, 0, y + 1.6, 0, 0.2, 3.0, 0.2); kd(td[0], "lit", 0xFF5A3C, 0, y + 3.2, 0, 0.4, 0.4, 0.4);
    A1.info.F28 = { top:y + 3.4, gallery:RK + N*H, members:blocks.length - n0, storeys:N };
    return { w:30, d:30 };
  };

  // ================================================================== F01 "Old Tock": brick clock tower on an open stone arcade (L3; reused L29, L34)
  // Tile: an open arcade of cream stone piers, a red brick shaft with cream corners and bands, tall arched windows, a clock stage with a
  // face on each side, a cornice, a slate pyramid roof with a gold ball. Twist: the clock has studs, no numerals, and both hands point up.
  // 50 m to the cornice, 66 m to the ball. Members: 8 piers per storey (stone arcade = ladder concrete, shaft = brick), a floor slab,
  // 8 brick wall panels. The lobby (lit) is seen through the arcade.
  V5_PARTS.a1tock = function(P){ var MT = api.mat("brick"), n0 = blocks.length, s, f, y = 0, sts = [], HB = 8, HS = 6, N = P.n || 7, hb = 8.2, hs = 7.4, cr = C.cream, dk = 0x3E4654, rr = rng(101);
    var base = addBlock(0, -0.25, 0, 22, 0.5, 22, "base", {anchor:true}); kd(base, "box", 0xD9CDB0, 0, 0.15, 0, 20.5, 0.3, 20.5); kd(base, "box", 0xE3D4B0, 0, 0.4, 0, 18, 0.2, 18);
    var b0 = boxSt({ y0:0, h:HB, hx:hb, hz:hb, nx:3, nz:3, pw:1.15, mw:1.0, fl:0, MT:{ pier:"concrete" }, deck:"tdeck", skin:"open", tp:cr, td:0xE3D4B0, dk:0.6 }); sts.push(b0); y = HB;
    if(P.core){ var cw2 = P.core, chh = HB - 0.6 - 0.05; [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function(q){ var w = mem("cpan", q[0]*(cw2 - 0.15), chh/2, q[1]*(cw2 - 0.15), q[0] ? 0.3 : 2*cw2 - 0.66, chh, q[0] ? 2*cw2 - 0.66 : 0.3, 0, null, null, C.core); b0.walls.push(w); }); }   // the stair core as real wall panels (probe)
    if(P.rule !== 0) btag(b0, P.hold);
    b0.piers.forEach(function(p){ kd(p, "box", 0xE3D4B0, p.spawn.x, 0.9, p.spawn.z, 1.8, 1.0, 1.8); kd(p, "box", 0xE3D4B0, p.spawn.x, HB - 1.1, p.spawn.z, 1.7, 0.7, 1.7); });
    var d0 = b0.decks[0]; kd(d0, "box", cr, 0, HB - 0.5, 0, 2*hb + 0.7, 1.0, 2*hb + 0.7);
    api.floorIn(d0, 0.5, { hw:hb - 1.4, lobby:true, fi:0, rr:rr }); kd(d0, "ibox", C.core, 0, HB/2, 0, 3.6, HB - 0.7, 3.6); kd(d0, "lit", C.amber, 0, HB - 1.6, 0, 9, 0.12, 9);
    for(s=0;s<N;s++){ var st = boxSt({ y0:y, h:HS, hx:hs, hz:hs, nx:3, nz:3, pw:1.1, mw:0.9, fl:s + 1, MT:MT, deck:P.deck || "slab", skin:"wall", mat:"brick", tp:C.brick, td:C.brick, tw:0xD0603F, dk:P.dk || 0.45 }); sts.push(st);
      st.piers.forEach(function(p){ if(p.gi !== 1 && p.gj !== 1){ p.tint = cr; kd(p, "box", cr, p.spawn.x*1.012, p.spawn.y, p.spawn.z*1.012, 1.3, HS - 0.5, 1.3); } });
      if(s < N - 2) st.walls.forEach(function(w, wi){   // tall arched windows: dark glass, a cream surround, a lit pane on some
        onFace(w, "box", cr, 0, 0.1, 2.5, 4.5, 0.08); onFace(w, "box", dk, 0, 0.0, 1.9, 4.0, 0.12); onFace(w, "cyl", cr, 0, 2.2, 2.5, 0.08, 0.08);
        if((wi + s) % 3 === 0) onFace(w, "lit", C.warm, 0, -0.6, 1.5, 1.6, 0.14); onFace(w, "box", cr, 0, 0.6, 1.9, 0.12, 0.16); });
      if(s === 2 || s === N - 3) kd(st.decks[0], "box", cr, 0, y + HS - 0.3, 0, 2*hs + 0.8, 0.7, 2*hs + 0.8);   // cream bands
      y += HS; }
    // the clock stage (top two storeys): a face on each side, centred on the slab between them
    var dc = sts[N - 1].decks[0], yc = HB + (N - 1)*HS, R = 10.4;
    [[0, 1], [0, -1], [1, 0], [-1, 0]].forEach(function(q){ var ax = q[0] !== 0, px = q[0]*(hs + 0.05), pz = q[1]*(hs + 0.05), rx = ax ? 0 : Math.PI/2, rz = ax ? Math.PI/2 : 0;
      kd(dc, "cyl", C.gold, px, yc, pz, R + 0.9, 0.16, R + 0.9, rx, 0, rz); kd(dc, "cyl", C.white, px + q[0]*0.1, yc, pz + q[1]*0.1, R, 0.16, R, rx, 0, rz);
      kd(dc, "box", C.iron, px + q[0]*0.24, yc + R*0.21, pz + q[1]*0.24, ax ? 0.1 : 0.34, R*0.42, ax ? 0.34 : 0.1); kd(dc, "box", C.iron, px + q[0]*0.3, yc + R*0.15, pz + q[1]*0.3, ax ? 0.1 : 0.5, R*0.3, ax ? 0.5 : 0.1);
      kd(dc, "cyl", C.gold, px + q[0]*0.3, yc, pz + q[1]*0.3, 0.9, 0.2, 0.9, rx, 0, rz);
      for(f=0;f<12;f++){ var a = f*Math.PI/6, u = Math.cos(a)*R*0.42, v = Math.sin(a)*R*0.42, big = f % 3 === 0 ? 0.6 : 0.36; kd(dc, "box", C.iron, px + q[0]*0.2 + (ax ? 0 : u), yc + v, pz + q[1]*0.2 + (ax ? u : 0), ax ? 0.1 : big, big, ax ? big : 0.1); } });
    // cornice, the slate pyramid, the gold ball
    var dt = sts[N].decks[0]; kd(dt, "box", cr, 0, y - 0.1, 0, 2*hs + 1.6, 0.9, 2*hs + 1.6); kd(dt, "box", cr, 0, y + 0.6, 0, 2*hs + 0.6, 0.6, 2*hs + 0.6);
    kd(dt, "cone", C.slate, 0, y + 0.9 + 6.5, 0, 2*hs + 0.2, 13, 2*hs + 0.2); kd(dt, "ibush", C.gold, 0, y + 14.4, 0, 1.8, 1.8, 1.8); kd(dt, "box", C.gold, 0, y + 16.2, 0, 0.22, 2.6, 0.22);
    A1.info.F01 = { top:y + 17.5, cornice:y, members:blocks.length - n0, storeys:N + 1 };
    return { w:22, d:22 };
  };

  // ================================================================== F16 "Deco Needle": grey stone skyscraper that steps in (L4; reused L24)
  // Tile: an arcade of stone piers, a body that steps in four times, dark window strips between stone piers, a stepped crown, a needle.
  // Twist: the crown is a lit glass lantern. 67 m to the last setback, 85 m to the needle tip. Members: concrete piers on the perimeter
  // (ladder concrete, one TNT a pier), one floor cassette per storey (a deep transfer deck under every setback), glass panes between the
  // piers (mglass, they carry nothing). Two office floors per storey are seen through the glass (floorIn).
  V5_PARTS.a1needle = function(P){ var MT = Object.assign({}, api.mat("concrete")), n0 = blocks.length, s, y = 0, sts = [], HB = 7, HS = 6, st0 = C.stone, rr = rng(1601), fi = 0;
    var TI = P.tiers || [[12, 2, 4], [9.6, 2, 3], [7.2, 2, 3], [5.0, 2, 2], [3.2, 2, 2]];   // half width, storeys, column lines
    var base = addBlock(0, -0.25, 0, 30, 0.5, 30, "base", {anchor:true}); kd(base, "box", 0xA9A7A2, 0, 0.15, 0, 28, 0.3, 28); kd(base, "box", C.stone, 0, 0.4, 0, 25.4, 0.2, 25.4);
    var b0 = boxSt({ y0:0, h:HB, hx:TI[0][0], hz:TI[0][0], nx:3, nz:3, pw:1.18, mw:1.18, fl:0, MT:MT, deck:"a1lite", skin:P.lobby === 0 ? "open" : "glass", tp:st0, td:0xA9A7A2, dk:0.6 }); sts.push(b0); y = HB;
    if(P.rule !== 0) btag(b0, P.hold); b0.panes.forEach(function(g){ paneDress(g, 0, HB, 0); var len = 2*Math.max(g.half[0], g.half[2]), i; for(i=1;i<4;i++) onFace(g, "ibox", C.frame, -len/2 + len*i/4, 0, 0.14, 2*g.half[1], 0.1); });
    b0.piers.forEach(function(p){ kd(p, "box", 0xA9A7A2, p.spawn.x, 0.8, p.spawn.z, 1.9, 1.0, 1.9); kd(p, "box", 0xC9C7C2, p.spawn.x, HB - 1.0, p.spawn.z, 1.7, 0.6, 1.7); });
    kd(b0.decks[0], "ibox", C.core, 0, HB/2, 0, 5.2, HB - 0.7, 5.2); api.floorIn(b0.decks[0], 0.5, { hw:TI[0][0] - 2.2, lobby:true, fi:0, rr:rr });
    b0.decks.forEach(function(d){ kd(d, "box", st0, d.spawn.x, HB - 0.45, d.spawn.z, 2*d.half[0] + 0.3, 1.1, 2*d.half[2] + 0.3); kd(d, "lit", C.amber, d.spawn.x, HB - 1.15, d.spawn.z, 2*d.half[0] - 2.4, 0.1, 2*d.half[2] - 2.4); });
    TI.forEach(function(t, ti){ for(var k=0;k<t[1];k++){ var hx = t[0], last = k === t[1] - 1, st = boxSt({ y0:y, h:HS, hx:hx, hz:hx, nx:t[2], nz:t[2], pw:Math.min(1.1, 0.34*hx), mw:Math.min(0.95, 0.3*hx), fl:sts.length, MT:MT, deck:last && ti < TI.length - 1 ? "a1lite" : P.deck || MT.deck, skin:"glass", tp:st0, td:0x9EA2A8, dk:0.5 }); sts.push(st);
      var d = st.decks[0], yy = y;
      st.decks.forEach(function(q){ kd(q, "box", st0, q.spawn.x, yy + HS - 0.35, q.spawn.z, 2*q.half[0] + 0.3, 0.9, 2*q.half[2] + 0.3); });   // spandrel band
      st.piers.forEach(function(p){ kd(p, "box", st0, p.spawn.x*1.008, p.spawn.y, p.spawn.z*1.008, 2*p.half[0] + 0.16, HS - 0.5, 2*p.half[0] + 0.16); });
      st.panes.forEach(function(g){ var len = 2*Math.max(g.half[0], g.half[2]), n = Math.max(1, Math.round(len/2.6)), i; paneDress(g, yy, HS, sts.length);
        for(i=1;i<n;i++) onFace(g, "ibox", st0, -len/2 + len*i/n, 0, 0.55, 2*g.half[1], 0.2); });   // stone mullions: the dark window strips of the tile
      kd(d, "ibox", C.core, 0, yy + (HS - 0.5)/2, 0, Math.min(3.4, hx*0.7), HS - 0.54, Math.min(3.4, hx*0.7));
      if(hx > 4){ [yy + 0.04, yy + HS/2].forEach(function(fy){ kd(d, "ibox", C.floor, 0, fy - 0.13, 0, 2*hx - 0.5, 0.24, 2*hx - 0.5); api.floorIn(d, fy, { hw:Math.min(4.54, hx - 0.4), fi:fi++, rr:rr });   // (floorIn's own plate grows with hw squared: kept at <= 4.54, the full plate is drawn here)
          if(hx > 9) [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(function(q){ api.floorIn(d, fy, { hw:3.6, fi:fi++, rr:rr, x:q[0]*(hx - 4.4), z:q[1]*(hx - 4.4) }); }); }); }
      else { kd(d, "ibox", C.floor, 0, yy + HS/2 - 0.12, 0, 2*hx - 0.4, 0.24, 2*hx - 0.4); kd(d, "lit", C.warm, 0, yy + HS - 0.75, 0, 2*hx - 1.2, 0.08, 0.3); kd(d, "lit", C.warm2, 0, yy + HS/2 - 0.35, 0, 0.3, 0.08, 2*hx - 1.2); }
      if(last && ti < TI.length - 1){ var nx2 = TI[ti + 1][0]; [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(function(q){ kd(near(st.decks, q[0]*hx, q[1]*hx), "box", 0xC9C7C2, q[0]*(hx - 0.9), yy + HS + 0.7, q[1]*(hx - 0.9), 1.8, 1.4, 1.8); });   // corner blocks on the setback
        st.decks.forEach(function(q){ kd(q, "box", 0x8E9299, q.spawn.x, yy + HS + 0.06, q.spawn.z, 2*q.half[0] - 0.4, 0.12, 2*q.half[2] - 0.4); }); }
      y += HS; } });
    // the crown: three stone steps, the lit glass lantern (twist), the needle with a red lamp
    var dt = sts[sts.length - 1].decks[0], hx = TI[TI.length - 1][0];
    kd(dt, "box", st0, 0, y + 0.9, 0, 2*hx - 0.6, 1.8, 2*hx - 0.6); kd(dt, "box", 0xC9C7C2, 0, y + 2.6, 0, 2*hx - 1.8, 1.6, 2*hx - 1.8); kd(dt, "lit", C.warm2, 0, y + 4.5, 0, 2*hx - 3.2, 2.2, 2*hx - 3.2);
    [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(function(q){ kd(dt, "ibox", st0, q[0]*(hx - 1.6), y + 4.5, q[1]*(hx - 1.6), 0.3, 2.2, 0.3); });
    kd(dt, "box", st0, 0, y + 5.9, 0, 2*hx - 2.8, 0.6, 2*hx - 2.8); kd(dt, "cone", 0x8E9299, 0, y + 7.7, 0, 2*hx - 3.6, 3.0, 2*hx - 3.6); kd(dt, "box", 0x8E9299, 0, y + 13, 0, 0.36, 10, 0.36); kd(dt, "lit", 0xFF5A3C, 0, y + 18.2, 0, 0.5, 0.5, 0.5);
    A1.info.F16 = { top:y + 18.5, roof:y, members:blocks.length - n0, storeys:sts.length };
    return { w:30, d:30 };
  };

  // ================================================================== F24 "The Doorstop": brick wedge block (L5; reused L18)
  // Tile: a wedge-shaped block, a cream stone ground storey with shop windows, red brick sides with rows of windows, cream bands, a cream
  // rounded nose, a cornice, a low grey attic. Twist: the nose is cut FLAT. The nose points to the front (z+). 54 m to the cornice, 58 m
  // to the attic. Members: three box frames in a row, 6 / 11 / 16 m wide from the nose to the back (brick piers, ladder brick: 6, 6 and
  // 8 legs), one slab each per storey, brick walls; the ground storey's outer walls are glass (shop fronts, the shops seen inside).
  // The slanted brick skin between the steps is decor.
  V5_PARTS.a1wedge = function(P){ var MT = api.mat("brick"), n0 = blocks.length, W = [6, 11, 16], DZ = 9, F = P.n || 9, HS = 6, f, bi, pw = 1.1, cr = 0xEFE3C8, bk = C.brick, dkc = 0x3E4654, rows = [], FL = 2.5;
    var base = addBlock(0, -0.25, 0, 24, 0.5, 32, "base", {anchor:true}); kd(base, "box", 0xB9B5AD, 0, 0.12, 0, 23.5, 0.24, 31);
    for(f=0;f<F;f++){ var y0 = f*HS, row = []; rows.push(row);
      for(bi=0;bi<3;bi++){ var k = f ? "wall" : "glass", zc = DZ - bi*DZ, hx = W[bi]/2, st = boxSt({ y0:y0, h:HS, hx:hx, hz:DZ/2, cz:zc, nx:bi === 2 ? 3 : 2, nz:3, pw:pw, mw:1.0, fl:f, MT:MT, deck:"a1lite", mat:"brick", dk:0.36,
          skin:{ "x+":k, "x-":k, "z+":bi === 0 ? k : "open", "z-":bi === 2 ? "wall" : "open" }, tp:f ? bk : cr, td:f ? 0xB7553A : cr, tw:bk }); row.push(st);
        if(!f && bi === 2 && P.rule !== 0) btag(st).onTip = function(m, fail){ if(m !== 0 && m !== 4) return; var sg = m === 0 ? 1 : -1;   // the wide end tips sideways: the same side of the middle and the nose gives way after it, so the whole block goes one way
          [1, 0].forEach(function(bj, n){ later(0.25 + 0.2*n, function(){ var q = rows[0][bj]; q.piers.forEach(function(p){ if(!p.dead && Math.sign(p.spawn.x - base.spawn.x) === sg) fail(p, "crush"); });
            q.panes.concat(q.walls).forEach(function(w){ if(!w.dead && (w.a1face === (sg > 0 ? "x+" : "x-") || (bj === 0 && w.a1face === "z+"))) fail(w, "crush"); }); }); }); };
        st.piers.forEach(function(p){ p.gj = 3*bi + (2 - p.gj); if(!f){ kd(p, "box", 0xE3D4B0, p.spawn.x, 0.7, p.spawn.z, 1.7, 0.9, 1.7); kd(p, "box", cr, p.spawn.x, HS - 1.0, p.spawn.z, 1.6, 0.6, 1.6); } });
        var d = st.decks[0], zf = zc + DZ/2, zb = zc - DZ/2;
        // the slanted skin (decor on this box's side walls): a brick face with three windows per storey, cream bands; the ground storey is
        // the stone shop front: real glass between the piers, a cream fascia above it
        [1, -1].forEach(function(sg){ var xa = sg*(hx + 0.1), xb = sg*(hx + FL + 0.1), len = Math.hypot(xb - xa, DZ), yaw = Math.atan2(DZ, xb - xa), nx = sg*DZ/len, nz = FL/len, mx = (xa + xb)/2, mz = zc, j;
          var host = (f ? st.walls : st.panes).filter(function(w){ return w.a1face === (sg > 0 ? "x+" : "x-"); })[0] || d;
          if(f){ kq(host, "box", bk, mx, y0 + HS/2, mz, len + 0.1, HS, 0.24, yaw); for(j=0;j<3;j++){ var t = (j + 0.5)/3 - 0.5, wx = mx + (xb - xa)*t + nx*0.1, wz = mz - DZ*t + nz*0.1, lit = (j + f + bi) % 3 === 0;
              kq(host, "box", cr, wx, y0 + 2.9, wz, 1.9, 3.5, 0.24, yaw); kq(host, lit ? "lit" : "box", lit ? C.warm : dkc, wx + nx*0.05, y0 + 2.9, wz + nz*0.05, 1.4, 3.0, 0.24, yaw); }
            if(f === 1 || f === F - 1) kq(host, "box", cr, mx + nx*0.1, y0 + (f === 1 ? 0.3 : HS - 0.3), mz + nz*0.1, len + 0.2, 0.6, 0.3, yaw); }
          else { kq(d, "box", cr, mx + nx*0.05, HS - 0.75, mz + nz*0.05, len + 0.2, 1.5, 0.3, yaw); kq(d, "lit", C.amber, mx + nx*0.22, HS - 1.3, mz + nz*0.22, len - 1.0, 0.16, 0.1, yaw); } });
        if(bi === 0){ var nw = (f ? st.walls : st.panes).filter(function(w){ return w.a1face === "z+"; })[0] || d;   // the flat-cut nose: cream stone, a window strip
          if(f){ kd(nw, "box", cr, 0, y0 + HS/2, zf + 0.1, W[0] + 0.5, HS, 0.24); kd(nw, f % 2 ? "lit" : "box", f % 2 ? C.warm : dkc, 0, y0 + 2.9, zf + 0.16, 2.0, 3.2, 0.24); }
          else { kd(d, "box", cr, 0, HS - 0.75, zf + 0.1, W[0] + 0.6, 1.5, 0.3); kd(d, "lit", C.amber, 0, HS - 1.7, zf + 0.3, 2.6, 0.3, 0.1); } }
        if(bi === 2){ var bw = st.walls.filter(function(w){ return w.a1face === "z-"; })[0] || d, wB = W[2] + 2*FL;   // the back facade, drawn at the full width of the wedge
          kd(bw, "box", f ? bk : cr, 0, y0 + HS/2, zb - 0.1, wB + 0.3, HS, 0.24); for(var q=0;q<5;q++){ var ux = -wB/2 + wB*(q + 0.5)/5, lt = (q + f) % 3 === 0; kd(bw, "box", cr, ux, y0 + 2.9, zb - 0.16, 1.9, 3.5, 0.24); kd(bw, lt ? "lit" : "box", lt ? C.warm : dkc, ux, y0 + 2.9, zb - 0.2, 1.4, 3.0, 0.24); } }
        if(!f){   // the shops seen through the glass: counters, lit shelves, a lit ceiling strip
          st.panes.forEach(function(g){ paneDress(g, 0, HS, bi); });
          kd(d, "lit", C.warm2, 0, HS - 0.55, zc, 0.4, 0.08, DZ - 1.6); kd(d, "ibox", C.floor, 0, 0.3, zc, W[bi] - 0.4, 0.12, DZ - 0.2); kd(d, "ibox", C.wood, 0, 0.9, zc, Math.max(1.2, hx - 1.2), 1.2, 3.2); kd(d, "lit", bi % 2 ? 0xBFEFFF : C.amber, 0, 1.65, zc, Math.max(0.9, hx - 1.6), 0.14, 2.6);
          if(hx > 4) [1, -1].forEach(function(sg){ kd(d, "ibox", sg > 0 ? C.sofa : C.sofa2, sg*(hx - 1.8), 0.75, zc + 1.6*sg, 1.6, 0.9, 1.0); kd(d, "ibush", C.green, sg*(hx - 1.6), 1.5, zc - 2.6*sg, 0.9, 1.3, 0.9); }); }
      } }
    // cornice and the low grey attic (decor on the top slabs)
    var yT = F*HS;
    rows[F - 1].forEach(function(st, bi){ var d = st.decks[0], zc = DZ - bi*DZ; kd(d, "box", cr, 0, yT + 0.2, zc, W[bi] + FL + 1.6, 0.6, DZ + (bi === 1 ? 0.04 : 0.8)); kd(d, "box", 0x8E9299, 0, yT + 1.9, zc, W[bi] - 1.2, 2.8, DZ - (bi === 1 ? 0 : 1.2)); });
    kd(rows[F - 1][2].decks[0], "box", 0x6B7280, 2.5, yT + 4.2, -DZ, 2.6, 1.8, 2.6); kd(rows[F - 1][1].decks[0], "lit", C.warm, 0, yT + 2.2, 0, 1.2, 1.0, DZ + 0.02);
    A1.info.F24 = { top:yT + 3.3, cornice:yT, members:blocks.length - n0, storeys:F };
    return { w:24, d:32 };
  };

  // ================================================================== the levels
  if(!A1.on) return;
  var T = function(sel, f, i){ return ["tnt", sel, f || 0, i || 0]; };
  var M = function(id, x, z, tiers, o){ return Object.assign({ id:id, kind:"mass", x:x, z:z, tiers:tiers }, o || {}); };
  var BIG = { bay:3.6, colk:1.4, st:0.35 };
  var set = function(i, o){ var Lv = LEVELS[i]; ["sol", "solW", "lesson", "bot", "keeps", "keep", "tanks", "track", "aid", "ftip", "tip", "tip2", "fillMax", "hint", "keepNames"].forEach(function(k){ delete Lv[k]; }); Object.assign(Lv, o); return Lv; };
  var XQ = function(k, d){ var v = QS15.get(k); return v == null ? d : +v; };   // layout probes (?key=value), used while tuning only
  var K = function(x, z, floors, cx, cz, name, type){ return { kind:"keep6", x:x, z:z, floors:floors, cx:cx, cz:cz, name:name, role:type, fixType:type }; };
  var KEEP = function(name, type){ return { name:name, sides:[], type:type || "school", role:type || "school", full:1 }; };
  var big = function(o){ return Object.assign({}, BIG, o || {}); };
  var SOLO = QS15.get("solo") === "1", solo = function(parts){ if(QS15.get("hd")) parts[0].deck = QS15.get("hd"); if(QS15.get("hn")) parts[0].n = +QS15.get("hn"); return SOLO ? parts.slice(0, 1) : parts; };
  var fin = function(Lv, o){ Lv.a1 = 1; api.opening(Lv, o); if(SOLO){ delete Lv.keeps; delete Lv.keep; } return Lv; };
  // Fail texts: on-screen words, at most 9 (the main build's rule for the lose card: check-main B18); M14.api.failText gives 15-25 words, so they are written out here.
  // ---- L1 "Old Whirly" (T, teach: tap a post, then BLAST; taught by the base game's hand on the two front posts, no words). The mill stands on a ring of eight posts: any two posts next to each other
  // gone = it comes down (storey rule). A low timber barn beside it. 5 TNT: two posts of the mill, two of the barn, one spare.
  (function(){ var Lv = set(0, { base:{ A:"weak-tip", "*":"weak" }, f:9, parts:solo([{ id:"A", kind:"a1mill", x:0, z:0, mat:"wood" },
      M("B", XQ("bx", 21), XQ("bz", 4), [{ f:2, cx:3, cz:2, mat:"wood", skin:"alt" }], big({ fh:3.2 }))]),
      charges:{ tnt:5 }, hint:"A:z+", tip:"", noWords:1, aid:{ tip:false } });   // D-blast-INTRO-BTF (13/11): L1 teaches with the pointing hand only, 0 words: no tip, no dots' tip line, no toast; the cue dots stay
    fin(Lv, { yaw:XQ("y1", 0.3), zoom:XQ("z1", 0), y:XQ("h1", 10), lotK:1.8 });   // no push-in on L1: the main build checks that the first hero is whole inside the play area (check-main B5, feel Q1); the mill, the barn, the hand and all four dots are on screen in the whole-lot view
    Lv.sol = [T("A:z+", 0, 0), T("A:z+", 0, 1), T("B:z+", 0, 0), T("B:z+", 0, 2)];
    Lv.lesson = { check:[[]] };
    Lv.bot = { hints:[["A", "A:z+", 1], ["A", "A:z+", 1], ["A", "B:z+", 1], ["A", "B:z+", 1]] };
    Lv.ftip = "Two front posts, side by side. Then the barn.";
  })();
  // ---- L2 "Stripey Point" (T, experience: tip it onto the row). The lighthouse falls like a tree towards the face whose legs are gone:
  // two legs side by side on the row's side (the third gives way), and it lands on the row of three boathouses. The two far ones
  // take one TNT each as well (the fall alone left one of them standing in some runs); the near one is the fall's.
  (function(){ var Lv = set(1, { base:{ A:"stiff-tip", "*":"weak" }, f:11, parts:solo([{ id:"A", kind:"a1light", x:0, z:-24, hold:XQ("lhold", 2.5), legSkin:XQ("lskin", 1) },
      M("B", 0, -5 + XQ("rz", 0), [{ f:XQ("bf", 5), cx:XQ("rc", 3), cz:2, mat:"wood", skin:"alt" }], big({ fh:3.2 })), M("C", 0, 5 + XQ("rz", 0), [{ f:XQ("cf", 4), cx:XQ("rc", 3), cz:2, mat:"wood", skin:"alt" }], big({ fh:3.2, roof:{ ac:1 } })),
      M("E", 0, 15 + XQ("rz", 0), [{ f:XQ("ef", 4), cx:XQ("rc", 3), cz:2, mat:"wood", skin:"alt" }], big({ fh:3.2 })), M("G", 20, -14, [{ f:XQ("gf", 3), cx:2, cz:2, mat:"wood", skin:"alt" }], big({ fh:3.2 }))].slice(0, 4)),
      charges:{ tnt:5 }, hint:"A:z+", tip:"Tip the lighthouse\nonto the row.", dotTip:"Tap the dots. Then BLAST!", dud:"Not yet. Two legs side by side!" });
    fin(Lv, { yaw:1.1, zoom:0.6, y:10, lotK:2.2 });
    Lv.sol = [T("A:z+", 0, 0), T("A:z+", 0, 1), T("A:z+", 0, 2), T("C:x+", 0, 0), T("E:x+", 0, 0)];
    Lv.lesson = { check:[[T("A:z-", 0, 0), T("A:z-", 0, 1), T("A:z-", 0, 2), T("C:x+", 0, 0), T("E:x+", 0, 0)]] };
    Lv.bot = { hints:[["A", "A:z+", 1], ["A", "A:z+", 1], ["A", "A:z+", 1], ["A", "mid:C:z+", 1], ["A", "mid:E:z+", 1]] };
    Lv.ftip = "Three legs facing the row. Then the far huts.";
  })();
  // ---- L3 "Old Tock" (N practice: start the row from the right). The clock tower stands at the right end of a row that steps down
  // (seen from the opening view): it must fall onto the row. Two stone legs side by side on the row's side; the far end of the row
  // takes its own TNT. (World: the row runs along +z, the row's side of the tower is its z+ face.)
  (function(){ var Lv = set(2, { base:{ A:"stiff-tip", "*":"weak" }, f:12, parts:solo([{ id:"A", kind:"a1tock", x:0, z:-28, dk:XQ("tdk", 0.45), core:XQ("tcore", 0), hold:XQ("thold", 2.5) },
      M("B", 0, -9, [{ f:XQ("b3f", 6), cx:2, cz:2, mat:["brick", "conc", "wood"][XQ("b3m", 0)], skin:"alt" }], big({ fh:3.4, roof:{ tank:1 } })), M("C", 0, 2, [{ f:XQ("c3f", 5), cx:2, cz:2, mat:"wood", skin:"alt" }], big({ fh:3.2, roof:{ ac:1 } })),
      M("D", 0, 13, [{ f:4, cx:2, cz:2, mat:"brick", skin:"alt" }], big({ fh:3.2 })), M("E", 0, 40, [{ f:5, cx:2, cz:2, mat:"brick", skin:"alt" }], big({ fh:3.2 }))].concat(XQ("l3f", 1) ? [M("F", -26, 4, [{ f:XQ("f3f", 1), cx:2, cz:2, mat:"brick", skin:"alt" }], big({ fh:3.2 }))] : [])),   // F: a brick house off the row that the 7 TNT do not reach (round 2: the expert margin was +9, over the N band)
      charges:{ tnt:5 }, hint:"A:z+", tip:"Start the row\nfrom the right.", dotTip:"Fill the dots. Then BLAST!", dud:"Not yet. Two legs side by side, facing the row!", a1cue2:1 });
    fin(Lv, { yaw:1.15, zoom:0.6, y:10, lotK:2.4 });
    // GD-38 / GD-9 (20/11 tester round): the domino took every stack (3 tower legs alone won 93%, 4 spare): the brick card ("one TNT
    // per pier") was never needed. The far brick stack E moved 23 -> 40 m down the row (past the domino reach) and up one floor (4 -> 5):
    // the tower alone now fails (74%), the tower + the wooden block too (76%); a TNT on the bricks is needed (tower + E 90-91%,
    // tower + D 90%). TNT 7 -> 5 (expert 5, 0 spare: the three legs + the two piers of the brick stack D, in sight at the opening, main/frame.js
    // OVR[3]). Lesson-less = no TNT on brick (the tower + the wooden block).
    Lv.sol = [T("A:z+", 0, 0), T("A:z+", 0, 1), T("A:z+", 0, 2), T("D:z+", 0, 0), T("D:z+", 0, 1)];
    Lv.lesson = { check:[[T("A:z+", 0, 0), T("A:z+", 0, 1), T("A:z+", 0, 2), T("C:z+", 0, 0), T("C:z+", 0, 1)]] };
    Lv.bot = { hints:[["A", "A:z+", 1], ["A", "A:z+", 1], ["A", "A:z+", 1], ["A", "D:z+", 1], ["A", "E:z+", 1]] };
    Lv.ftip = "Brick stacks stand until each pier is hit.";   // 18/11 (GD-26): the old line ("A falling tower can knock down the row.", via NOHINT_TEXT) blamed the row; the fails were the brick stacks left standing (the level's own lesson)
  })();
  // ---- L4 "Needle Court" (N teach: grey columns, one TNT each). Round 3 (16/11, tester round GD-1 / GD-13: L4 needed rotate, taught
  // on L6, and a protected hospital on the forward fall line, taught on L5): it OPENS facing the back (yaw 3.39), so the grey columns
  // the player sees are the back legs and the tower falls back, away from everything kept; the hospital moved off the forward fall
  // line to the far front-left corner (-34, 34); the two far sheds behind are gone and the right-hand timber block is one floor lower,
  // so the naive plan (the three visible grey columns) passes at Blast Power 0 and 1. Two legs side by side (the third gives way) and
  // it turns over that way; a school at each side still shuts the side falls.
  // Round 4 (18/11, tester round GD-27: 3 TNT on the visible grey corners won in one wave at 90.5 % with 4 TNT spare; bots: expert
  // 99 % (+14), naive and lesson-less plans won): the two timber stacks B / C at the sides go from 3 to 6 floors (surroundings only;
  // tower, TNT 7, yaw 3.39 and the opening view unchanged). They stand off the tower's fall line, so the tower alone stays under PASS
  // (harness: 3 corners 79 %, 2 corners 76 %); the plan needs the stacks too (expert 7 TNT, 0 spare).
  (function(){ var Lv = set(3, { base:{ A:"stiff-tip", "*":"weak" }, f:14, parts:solo([{ id:"A", kind:"a1needle", x:0, z:0, hold:XQ("nhold", 2.5) },
      M("B", XQ("b4x", -30), XQ("b4z", -18), [{ f:XQ("b4f", 6), cx:2, cz:2, mat:"wood", skin:"alt" }], big({ fh:3.2 })),
      M("C", XQ("c4x", 30), XQ("c4z", -20), [{ f:XQ("c4f", 6), cx:3, cz:2, mat:XQ("c4b", 0) ? "brick" : "wood", skin:"alt" }], big({ fh:3.4, roof:{ cap:1 } }))].concat(XQ("l4s", 0) > 0 ? [M("D", -36, -38, [{ f:1, cx:2, cz:2, mat:"wood", skin:"alt" }], big({ fh:3.2 }))] : [], XQ("l4s", 0) > 1 ? [M("E", 38, -40, [{ f:1, cx:2, cz:2, mat:"wood", skin:"alt" }], big({ fh:3.2 }))] : [])),   // D, E: two low sheds far behind that the 7 TNT need not reach (round 2: they thin out a blind foot plan and trim the expert margin)
      keeps:[K(XQ("khx", -34), XQ("kz", 34), XQ("kf", 2), 3, 2, "the hospital", "hospital"), K(-XQ("kx", 40), XQ("ksz", 2), XQ("ksf", 3), 2, 3, "the left school", "school"), K(XQ("kx", 40), XQ("ksz", 2), XQ("ksf", 3), 2, 3, "the right school", "school")], keep:KEEP("the hospital", "hospital"),
      charges:{ tnt:7 }, hint:"A:z-", teaches:"Grey columns: one TNT each", tip:"Grey columns:\none TNT each.", dotTip:"Fill the dots. Then BLAST!", dud:"Not yet. Two legs side by side!", ctip:"It fell on {hit}. Tip it the other way." });
    fin(Lv, { yaw:XQ("y4", 3.39), zoom:0.6, y:10, lotK:2.6 });
    Lv.sol = [T("A:z-", 0, 0), T("A:z-", 0, 1), T("A:z-", 0, 2), T("C:z+", 0, 0), T("C:z+", 0, 2), T("B:z+", 0, 0), T("B:z+", 0, 1)];
    Lv.lesson = { check:[[T("A:z+", 0, 0), T("A:z+", 0, 1), T("A:z+", 0, 2), T("C:z+", 0, 0), T("C:z+", 0, 2), T("B:z+", 0, 0), T("B:z+", 0, 1)]] };
    Lv.bot = { hints:[["A", "A:z-", 1], ["A", "C:z+", 1], ["A", "A:z-", 1], ["A", "C:z+", 1], ["A", "A:z-", 1], ["A", "B:z+", 1], ["A", "B:z+", 1]] };
    Lv.ftip = "Two columns side by side: it tips that way.";
  })();
  // ---- L5 "Doorstop Corner" (N practice: fall away from the blue). A hospital on the right, a school in front of the nose: the block
  // may only fall LEFT. The three left legs of its wide end bring all of it down that way.
  (function(){ var Lv = set(4, { base:{ A:"stiff-tip", "*":"weak" }, f:12, parts:solo([{ id:"A", kind:"a1wedge", x:0, z:0 },
      M("B", -30, 12, [{ f:3, cx:2, cz:2, mat:"wood", skin:"alt" }], big({ fh:3.2 })),
      M("C", -4, -34, [{ f:5, cx:3, cz:2, mat:"conc", g:"open" }], big({ fh:3.4, roof:{ cap:1, ac:1 } }))].concat(XQ("l5d", 1) ? [M("D", 27, -30, [{ f:XQ("df", 2), cx:2, cz:2, mat:"brick", skin:"alt" }], big({ fh:3.2 }))] : [])),
      keeps:[K(+(QS15.get("kx") || 17), -4, 3, 2, 4, "the hospital", "hospital"), K(10, 36, 1, 3, 2, "the school", "school")], keep:KEEP("the hospital", "hospital"),
      charges:{ tnt:8 }, hint:"A:x-", tip:"Tip it away\nfrom the blue.", dotTip:"Fill the dots. Then BLAST!", dud:"Not yet. Three legs in a row on one side!", ctip:"It fell on {hit}. Blast the far side.", a1cue2:1 });
    // Round 2 (17/11, tester round GD-19 / DIGEST fix 1, camera only as L4 on 16/11): it opened at yaw 0.3, where the three left legs
    // of the plan (A:x-) are hidden and every visible leg (A:x+) folds the nose onto a blue building (4 live fails: the level needed the
    // rotate taught on L6). It now opens at yaw 5.93 (main/frame.js keeps it: 2 pi - 0.35): the three A:x- legs, the two front legs
    // and both blue buildings are on screen. Naive plans on the visible legs (wave 1 = any 2-5 of them, the rest on the neighbours):
    // 17/26 win (at yaw 0.3: 4/26); every row of 2-3 legs on the left face wins; the hidden right face (lesson.check) still fails.
    fin(Lv, { yaw:XQ("y5", 5.93), zoom:0.6, y:10, lotK:2.6 });
    Lv.sol = [T("A:x-", 0, 0), T("A:x-", 0, 1), T("A:x-", 0, 2), T("B:z+", 0, 0), T("B:z+", 0, 1), T("C:z-", 0, 0), T("C:z-", 0, 1), T("C:z-", 0, 2)];
    Lv.lesson = { check:[[T("A:x+", 0, 0), T("A:x+", 0, 1), T("A:x+", 0, 2), T("B:z+", 0, 0), T("B:z+", 0, 1), T("C:z-", 0, 0), T("C:z-", 0, 1), T("C:z-", 0, 2)]] };
    Lv.bot = { hints:[["A", "A:x-", 1], ["A", "A:x-", 1], ["A", "A:x-", 1], ["A", "B:z+", 1], ["A", "B:z+", 1], ["A", "C:z-", 1], ["A", "C:z-", 1], ["A", "C:z-", 1]] };
    Lv.ftip = "It tips toward the legs you break.";   // 17/11: the old line named dots (gone since D-blast-NOHINT) and a spot
  })();
  // ------------------------------------------------------------------ run time (A1 levels only: L.a1)
  // dots: the members of the level's own plan are dot targets (cue dots where the tier's aids allow them; with a1cue2 from the second attempt)
  var sl15 = startLevel;
  startLevel = function(i){ var r = sl15.apply(this, arguments); if(!L.a1) return r;
    if(L.a1cue2 && !manual && M14.tries >= 2) L.aid = Object.assign({}, L.aid || {}, { cue:true, tip:true });
    var cue = !!api.aids(L).cue; (L.sol || []).forEach(function(e){ var m = selectMembers(e[1], e[2])[e[3]]; if(m && m.b) api.track(m.b, { cue:cue }); });
    return r; };
  // the dots' one-line tip in the level's own words (v14 writes "Fill the dots to crack the leg"), "Didn't budge" replaced by what to do next,
  // and a protected-building fail that names the building that was really hit
  var uc15 = updateCamera;   // H0b: the dots' tip text (L.dotTip) and its row under the "Safe" pill are v14's now
  updateCamera = function(rdt){ uc15(rdt);
    var tb = document.getElementById("tip"), nw = !!(L && L.a1 && L.noWords && screen === "game"); if(tb && tb._a1nw !== nw){ tb._a1nw = nw; tb.style.visibility = nw ? "hidden" : ""; } };   // a level without words (L1): the tip pill is not shown at all (the between-blast tip neither)
  var toast15 = toast; toast = function(msg){ if(L && L.a1 && L.noWords && screen === "game") return; if(L && L.a1 && L.dud && /^Didn.t budge/.test(msg)) msg = L.dud; return toast15(msg); };
  // STD-v3 (D-blast-NOHINT): the protected-hit line names no spot (api.nohint maps the old words; ?hints=1 = the old line)
  var ft15 = failTip; failTip = function(r){ if(L && L.a1 && L.ctip && r.code === "collateral") return (api.nohint ? api.nohint(L.ctip) : L.ctip).replace("{hit}", collName || (L.keep && L.keep.name) || "a blue building"); return ft15(r); };
  // the title screen's backdrop (and the warm world a first tap on PLAY adopts) was built from the old L1-L5 data before this block ran:
  // rebuild it from the new data, as "back to Home" does
  if(phase === "title" && blocks.length && save.level < 5){ phase = "a1"; goHome(); }
  window.__blast.a1 = { info:function(){ return A1.info; } };
})();
// ---- end levels6 v15 A1
