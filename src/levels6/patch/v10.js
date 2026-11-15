// ---- levels6 v10 builders (Owner 10/11: massive targets, staged materials, real protected neighbours). Additive block: levels6/patch/v10.js
// kind:"mass" = a stack of TIERS on one bay grid (block, podium + tower, setbacks, twin towers on one podium).
//   tiers:[{f, cx, cz, ox, oz, on, mat, skin, faces:{face:skin}, g:skin, cols:{"i,j":"pier"|"steel"|"core"}, colsF:n, core:{i:[a,b], j:[c,d], up:n}}]
//     ox/oz = offset in whole bays from tier 0's first column line; faces = "x-","x+","z-","z+"; on = the tier it stands on
//     mat  = "wood" | "brick" | "conc" (default) | "steel": the frame of the tier (staged launch, PLAN.md §2)
//     skin = the infill of every perimeter bay, in the tier's material (no random panes: the same plan gives the same
//            result on every seed): "sp" low wall under a window opening (default) · "full" blank wall · "alt" checker of
//            both · "open" nothing · "glass" curtain wall (staged: later levels). g = skin of the tier's first storey.
//     cols = special columns by tier node (first colsF floors, default all): pier = reinforced, only a charge right on it
//     core = a reinforced-concrete skeleton INSIDE the tier: fat dark piers on the nodes i:[a,b] x j:[c,d], its own floor
//            plates, `up` storeys taller than the tier (it shows above the roofline: the hint). It is bonded only to
//            itself (bond group), so it stands when the shell round it falls: the reveal. Then: one TNT right on a pier.
//   roof:{cap, tank, ac:n, sign:1|2}   (no cornice overhang, no balconies, no porch canopy: Owner 10/11)
// Members tile like buildFrame (same BAY / FH / COL / ST), so bonds, crushing and the selectors are unchanged. The outer
// slab edges stop 6 cm inside the facade line: no slab edge sticks out between the storeys.
var L6_MAT = {
  wood:  { col:"wpost",    cw:0.5,      slab:"wfloor", wall:"wwall", th:0.2 },
  brick: { col:"bk",       cw:COL*1.3,  slab:"slab",   wall:"bkw",   th:0.3 },
  conc:  { col:"concrete", cw:COL,      slab:"slab",   wall:"cpan",  th:0.24 },
  steel: { col:"steel",    cw:0.42,     slab:"sdeck",  wall:"cpan",  th:0.24 }   // round 3: a steel storey has a steel deck (a concrete slab there broke under a foot TNT and dropped the storey above: "steel holds" must hold)
};
var L6_IN = 0.06, L6_SP = 0.95;
function l6Mass(P){
  // round 4 (Owner 11/11: "big and massive, not just tall"): a part may use bigger modules to get mass without more bodies:
  // P.bay = bay size (m, default 2.7), P.fh = storey height (m, default 2.7), P.colk = column size factor (default 1;
  // bay/2.7 when bay is set). Local names shadow the global grid constants inside this builder only.
  var BAY = P.bay || 2.7, FH = P.fh || 2.7, COL = 0.62*(P.colk || (P.bay ? Math.max(1, P.bay/2.7*0.85) : 1)), CK = COL/0.62;
  var T = P.tiers, t0 = T[0], X0 = -(t0.cx - 1)*BAY/2, Z0 = -(t0.cz - 1)*BAY/2;
  var w = (t0.cx - 1)*BAY + COL + 1.3, d = (t0.cz - 1)*BAY + COL + 1.3;
  addBlock(0, -0.25, 0, w, 0.5, d, "base", {anchor:true});
  var last = null, topY = 0, topFl = 0, Y1 = [], F1 = [];
  T.forEach(function(t, ti){
    var pi = ti === 0 ? -1 : (t.on != null ? t.on : ti - 1), prev = pi < 0 ? null : T[pi], y0 = prev ? Y1[pi] : 0, fl = prev ? F1[pi] : 0;
    var ox = t.ox || 0, oz = t.oz || 0, cx = t.cx, cz = t.cz, xs = [], zs = [], i, j, M = L6_MAT[t.mat || "conc"], C = t.core;
    for(i=0;i<cx;i++) xs.push(X0 + (ox + i)*BAY);
    for(j=0;j<cz;j++) zs.push(Z0 + (oz + j)*BAY);
    var inCore = function(a, b){ return !!C && a >= C.i[0] && a <= C.i[1] && b >= C.j[0] && b <= C.j[1]; };
    // the roof of a tier that carries a smaller / shifted tier is a deep transfer deck (key "tdeck"): the edge columns of
    // the upper tier load its slabs off-centre, and a plain slab's bonds would crack at rest
    var kids = T.filter(function(u, ui){ return ui > ti && (u.on != null ? u.on : ui - 1) === ti && (u.cx !== cx || u.cz !== cz || (u.ox||0) !== ox || (u.oz||0) !== oz); }), deck = kids.length > 0 && !t.nodeck;   // round 3: nodeck = plain slabs (a tower on interior columns does not need the deep deck)
    var nF = t.f + (C ? (C.up || 0) : 0);
    for(var f=0; f<nF; f++, fl++){
      var st = t.st || P.st || ST, colH = FH - st, hw = {}, over = f >= t.f;   // round 5: a tier may set its own slab thickness (a light steel deck)   // over = the core's storeys above the tier's roof
      for(i=0;i<cx;i++) for(j=0;j<cz;j++){
        var gi = ox + i, gj = oz + j, ic = inCore(i, j);
        if(over && !ic) continue;
        if(f === 0 && prev && (gi < (prev.ox||0) || gi > (prev.ox||0) + prev.cx - 1 || gj < (prev.oz||0) || gj > (prev.oz||0) + prev.cz - 1)) continue;
        if(t.hole && i > t.hole.i[0] && i < t.hole.i[1] && j > t.hole.j[0] && j < t.hole.j[1]) continue;   // round 5: an open well through the tier (a separate building stands in it)
        var sp = t.cols && f < (t.colsF || 99) ? t.cols[i + "," + j] : null;
        if(sp === "none") continue;   // round 3: no column on this node (a hall under a deck)
        var key = ic ? "rc" : sp === "pier" ? "rc" : sp || M.col;
        var under = kids.some(function(u){ return gi >= (u.ox||0) && gi <= (u.ox||0) + u.cx - 1 && gj >= (u.oz||0) && gj <= (u.oz||0) + u.cz - 1; });
        var cw = key === "core" ? COL*1.5 : key === "rc" ? COL*1.4 : under && key === M.col && t.mat !== "steel" ? Math.max(M.cw*CK, COL)*1.35 : M.cw*CK;
        hw[i + "," + j] = cw/2;
        var b = addBlock(xs[i], y0 + colH/2, zs[j], cw, colH, cw, key, {floor:fl});
        b.gi = gi; b.gj = gj; if(ic) b.bg = 1;
      }
      var slabY = y0 + colH + st/2;
      for(i=0;i<cx-1;i++) for(j=0;j<cz-1;j++){
        var cs = !!C && i >= C.i[0] && i < C.i[1] && j >= C.j[0] && j < C.j[1];
        if(t.hole && i >= t.hole.i[0] && i < t.hole.i[1] && j >= t.hole.j[0] && j < t.hole.j[1]) continue;
        if(over && !cs) continue;
        var x0 = xs[i] - (i === 0 ? COL/2 - L6_IN : 0), x1 = xs[i+1] + (i === cx-2 ? COL/2 - L6_IN : 0);
        var z0 = zs[j] - (j === 0 ? COL/2 - L6_IN : 0), z1 = zs[j+1] + (j === cz-2 ? COL/2 - L6_IN : 0);
        var sb = addBlock((x0 + x1)/2, slabY, (z0 + z1)/2, x1 - x0, st, z1 - z0, cs ? "rcs" : deck && f === t.f - 1 ? "tdeck" : (t.slab || M.slab), {floor:fl});
        if(cs) sb.bg = 1;
      }
      if(!over){
        var skinOf = function(face, bay){
          var s = (f === 0 && t.g) || (t.faces && t.faces[face]) || t.skin || "sp";
          if(s === "alt") s = (bay + fl) % 2 ? "full" : "sp";
          return s === "open" ? null : s;
        };
        var panel = function(s, px, pz, lx, lz, alongX){
          var gl = s === "glass", th = gl ? WT : M.th, h = s === "sp" ? L6_SP : gl ? colH*0.96 : colH - 0.05, yy = gl ? y0 + colH/2 : y0 + h/2;   // walls stand on the floor (a pane keeps its play)
          addBlock(px, yy, pz, alongX ? lx : th, h, alongX ? th : lz, gl ? "glass" : M.wall, {floor:fl});
        };
        for(var s=0; s<2; s++){
          var jE = s === 0 ? 0 : cz - 1, zE = zs[jE], sz = s === 0 ? -1 : 1;
          for(i=0;i<cx-1;i++){
            var kz = skinOf(s === 0 ? "z-" : "z+", i), ha = hw[i + "," + jE], hb = hw[(i+1) + "," + jE]; if(!kz || !ha || !hb) continue;
            var thz = kz === "glass" ? WT : M.th, gx0 = xs[i] + ha, gx1 = xs[i+1] - hb;
            panel(kz, (gx0 + gx1)/2, zE + sz*(COL/2 - thz/2), gx1 - gx0 - GLASS_GAP, 0, true);
          }
          var iE = s === 0 ? 0 : cx - 1, xE = xs[iE], sx = s === 0 ? -1 : 1;
          for(j=0;j<cz-1;j++){
            var kx = skinOf(s === 0 ? "x-" : "x+", j), hc = hw[iE + "," + j], hd = hw[iE + "," + (j+1)]; if(!kx || !hc || !hd) continue;
            var thx = kx === "glass" ? WT : M.th, gz0 = zs[j] + hc, gz1 = zs[j+1] - hd;
            panel(kx, xE + sx*(COL/2 - thx/2), (gz0 + gz1)/2, 0, gz1 - gz0 - GLASS_GAP, false);
          }
        }
      }
      if(t.eave && f === t.f - 1) l6Eave(xs, zs, y0 + FH - ST/2, fl);   // round 3: a tier with eaves (tiered-roof silhouette)
      if(t.crown && f === t.f - 1){ var ci0 = t.crown.i || [0, cx - 1], cj0 = t.crown.j || [0, cz - 1];   // round 3: a crown on this tier's roof, over nodes i x j (clear of any tier above)
        l6Crown(t.crown, (xs[ci0[0]] + xs[ci0[1]])/2, (zs[cj0[0]] + zs[cj0[1]])/2, xs[ci0[1]] - xs[ci0[0]] + COL, zs[cj0[1]] - zs[cj0[0]] + COL, y0 + FH, fl + 1); }
      y0 += FH;
      if(f === t.f - 1){ Y1[ti] = y0; F1[ti] = fl + 1; if(y0 >= topY){ topY = y0; topFl = fl + 1; last = {xs:xs, zs:zs}; } }
    }
  });
  // dressing (decor members: light, never a column, never take a charge), on the highest tier's roof
  var R = P.roof || {}, tx0 = last.xs[0], tx1 = last.xs[last.xs.length - 1], tz0 = last.zs[0], tz1 = last.zs[last.zs.length - 1], ry = topY, fl = topFl;
  if(R.cap){ v5Box((tx0 + tx1)/2, ry + 0.11, (tz0 + tz1)/2, tx1 - tx0 + COL - 0.3, 0.22, tz1 - tz0 + COL - 0.3, "ledge", fl); ry += 0.22; }
  if(R.tank){ var kx0 = tx0 + 0.9, kz0 = tz0 + 0.7;
    [-0.4, 0.4].forEach(function(o){ v5Box(kx0 + o, ry + 0.35, kz0, 0.16, 0.7, 1.0, "rail", fl); });
    v5Box(kx0, ry + 0.7 + 0.55, kz0, 1.1, 1.1, 1.1, "rtank", fl); v5Box(kx0, ry + 1.8 + 0.12, kz0, 1.3, 0.24, 1.3, "terra", fl); }
  for(var a=0; a<(R.ac || 0); a++) v5Box(tx1 - 0.8 - a*1.5, ry + 0.3, tz0 + 0.8, 1.1, 0.6, 0.9, "ledge", fl);
  if(R.sign){ var big = R.sign > 1, sw = Math.min(tx1 - tx0 + (big ? 0.4 : 0), big ? 6.4 : 3.2), bh = big ? 1.9 : 0.8, lh = big ? 1.0 : 0.9, lw = big ? 0.3 : 0.16, sgz = tz1 + COL/2 - 0.5, sgx = (tx0 + tx1)/2;
    (big ? [-1, 0, 1] : [-1, 1]).forEach(function(q){ v5Box(sgx + q*(sw/2 - 0.4), ry + lh/2, sgz, lw, lh, lw, "rail", fl); });   // a billboard on the roof: solid legs, blank face (no text, no logo)
    v5Box(sgx, ry + lh + bh/2, sgz, sw, bh, 0.14, "awn2", fl); v5Box(sgx, ry + lh + bh/2, sgz - 0.1, sw + 0.16, bh + 0.16, 0.06, "awn", fl); }
  if(R.crown) l6Crown(R.crown, (tx0 + tx1)/2, (tz0 + tz1)/2, tx1 - tx0 + COL, tz1 - tz0 + COL, ry, fl);
  return {w:w, d:d};
}
// ---- round 3 (Owner 11/11): hero silhouettes "in the style of a famous place" (ORIGINAL shapes, LEGAL-LANDMARKS.md):
// a crown of light decor members on the hero's roof (never a column, never takes a charge: a tap goes to the structure)
// and eaves on a tier. Decor keys cr* (light, ns, decor) reuse the decor shader; their colours are new, none blue
// (protected only) or purple (Hard only), no red cross, no text, no logo.
Object.assign(MEMBERS, {
  crT: { hp:30, density:450, fric:0.7, rest:0.06, dmg:1.2, armor:0, shatter:6, bond:"concrete", color:0xD9714A, ns:true, decor:true },   // terracotta roof / cap
  crC: { hp:30, density:450, fric:0.7, rest:0.06, dmg:1.2, armor:0, shatter:6, bond:"concrete", color:0xF6EBD6, ns:true, decor:true },   // cream stone / clock face
  crG: { hp:30, density:450, fric:0.7, rest:0.06, dmg:1.2, armor:0, shatter:6, bond:"concrete", color:0xE9A13B, ns:true, decor:true },   // ochre-gold dome / finial
  crS: { hp:30, density:450, fric:0.7, rest:0.06, dmg:1.2, armor:0, shatter:6, bond:"concrete", color:0x5B5560, ns:true, decor:true },   // slate roof
  crV: { hp:30, density:450, fric:0.7, rest:0.06, dmg:1.2, armor:0, shatter:6, bond:"concrete", color:0x6FB59A, ns:true, decor:true },   // verdigris (aged copper) dome
  crN: { hp:30, density:450, fric:0.7, rest:0.06, dmg:1.2, armor:0, shatter:6, bond:"concrete", color:0x3A3550, ns:true, decor:true }    // dark iron: clock hands, gallery rail, mast
});
["crT", "crC", "crG", "crS", "crV", "crN"].forEach(function(k){ MATS[k] = MATS.ledge; });
// round 5: protected roof members (school belfry / hospital helipad): plain-concrete strength (ladder "conc", hp 130), keep group
Object.assign(MEMBERS, {
  kroofN: { hp:130, density:2000, fric:0.7, rest:0.06, dmg:1.0, armor:0, shatter:8, bond:"concrete", color:0x2F56C4, ns:true },   // navy roof (PROTECTED-SPEC keep.roof)
  kroofW: { hp:130, density:2000, fric:0.7, rest:0.06, dmg:1.0, armor:0, shatter:8, bond:"concrete", color:0xFFFFFF, ns:true },   // white trim: posts, helipad slab
  kroofI: { hp:130, density:2000, fric:0.7, rest:0.06, dmg:1.0, armor:0, shatter:8, bond:"concrete", color:0xD9E8FF, ns:true }    // ice wall: belfry base, stair hut
});
// crown types: clock (belfry + 4 faces + slate pyramid) · spire (stepped spire) · dome (drum + stepped dome + lantern) ·
// bulb (bulb dome on a neck) · disc (observation deck: wide disc + cabin + mast) · lantern (gallery + lamp room + cap) ·
// steps (stepped top of a terraced tower). w, d = roof size; ry = roof top; c = colour key of the dome / cap
function l6Crown(C, cx, cz, w, d, ry, fl){
  // round 5: the crown is VISUAL decor riding on the roof member under it (no physics body): light crown members used to
  // fly off in a collapse and hit protected roofs; now they ride the roof and hide with it (same look, same colours)
  var host = null; for(var hi = blocks.length - 1; hi >= 0 && hi >= blocks.length - 400; hi--){ var hb = blocks[hi];
    if(!hb.anchor && !hb.keep && !(MEMBERS[hb.key] || {}).decor && Math.abs(hb.spawn.x - cx) <= w/2 + 0.6 && Math.abs(hb.spawn.z - cz) <= d/2 + 0.6 && hb.spawn.y + hb.half[1] <= ry + 0.6 && (!host || hb.spawn.y + hb.half[1] > host.spawn.y + host.half[1] + 0.01)) host = hb; }
  var t = C.t || C, m = Math.min(w, d), y = ry, k = C.c, box = function(sx, sy, sz, key, dx, dz){
    if(host){ l6KdAdd(host, "box", (MEMBERS[key] || {}).color || 0xffffff, cx + (dx || 0), y + sy/2, cz + (dz || 0), sx, sy, sz); return null; }
    return v5Box(cx + (dx || 0), y + sy/2, cz + (dz || 0), sx, sy, sz, key, fl); };
  var abox = function(x, yy, z, sx, sy, sz, key){ if(host){ l6KdAdd(host, "box", (MEMBERS[key] || {}).color || 0xffffff, x, yy, z, sx, sy, sz); return null; } return v5Box(x, yy, z, sx, sy, sz, key, fl); };
  var stack = function(ws, h, key){ ws.forEach(function(q){ box(m*q, h, m*q, key); y += h; }); };
  var mast = function(h){ box(0.14, h, 0.14, "crN"); y += h; };
  if(t === "clock"){
    var bw = Math.min(m*0.62, 2.6), bh = Math.min(2.4, bw*1.0);
    box(bw, bh, bw, "crC");
    [[0, 1], [0, -1], [1, 0], [-1, 0]].forEach(function(q){ var ax = q[0] !== 0;
      abox(cx + q[0]*(bw/2 + 0.04), y + bh*0.55, cz + q[1]*(bw/2 + 0.04), ax ? 0.08 : bw*0.8, bw*0.8, ax ? bw*0.8 : 0.08, k || "crG");   // the clock face (round 5: bigger, it is the silhouette) (no numerals, no brand)
      abox(cx + q[0]*(bw/2 + 0.1), y + bh*0.55 + bw*0.12, cz + q[1]*(bw/2 + 0.1), ax ? 0.04 : 0.09, bw*0.32, ax ? 0.09 : 0.04, "crN"); });   // one hand
    y += bh; stack([0.7, 0.5, 0.3], 0.55, "crS"); mast(1.0);
  } else if(t === "spire"){ stack([0.8, 0.6, 0.42, 0.26], 0.7, k || "crT"); mast(1.6);
  } else if(t === "dome"){ box(m*0.82, 0.7, m*0.82, "crC"); y += 0.7; stack([0.78, 0.66, 0.5, 0.32], 0.5, k || "crV"); box(0.5, 0.6, 0.5, "crC"); y += 0.6; mast(0.7);
  } else if(t === "bulb"){ box(m*0.42, 0.5, m*0.42, "crC"); y += 0.5; stack([0.56, 0.7, 0.62, 0.44, 0.24], 0.45, k || "crG"); mast(0.9);
  } else if(t === "disc"){ box(m*0.4, 1.4, m*0.4, "crC"); y += 1.4; box(w + 2.2, 0.45, d + 2.2, k || "crT"); y += 0.45; box(w + 1.0, 1.0, d + 1.0, "crC"); y += 1.0; box(w + 1.6, 0.3, d + 1.6, k || "crT"); y += 0.3; mast(2.4);
  } else if(t === "lantern"){ box(w + 0.5, 0.2, d + 0.5, "crN"); y += 0.2; box(m*0.55, 1.5, m*0.55, "crV"); y += 1.5; stack([0.7, 0.4], 0.5, k || "crT"); mast(0.6);
  } else if(t === "pod"){   // round 5: TV-tower type: shaft on, a ball-shaped pod (stacked rings), a small ring, a long antenna (no saucer, no legs, no halo)
    box(m*0.4, 2.2, m*0.4, "crC"); y += 2.2; [0.7, 1.05, 1.25, 1.05, 0.7].forEach(function(q){ box(m*q, 0.55, m*q, k || "crT"); y += 0.55; });
    box(m*0.3, 1.4, m*0.3, "crC"); y += 1.4; box(m*0.55, 0.3, m*0.55, k || "crT"); y += 0.3; mast(4.5);
  } else if(t === "lattice"){   // round 5: lattice-tower type: three stages of dark-iron corner posts closing in, a platform between stages, a cap and a mast
    [[0.46, 3.2], [0.32, 3.0], [0.18, 2.8]].forEach(function(q){ var o = q[0], h = q[1];
      [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(function(c){ box(0.26, h, 0.26, "crN", c[0]*w*o, c[1]*d*o); });
      y += h; box(w*o*2.25, 0.22, d*o*2.25, k || "crS"); y += 0.22; });
    box(0.7, 0.9, 0.7, "crN"); y += 0.9; mast(2.6);
  } else if(t === "tank"){   // round 5: water-tower type: a fat drum (stacked rings), a low cone lid, a short vent (no town name)
    box(m*0.5, 0.8, m*0.5, "crN"); y += 0.8; [1.05, 1.2, 1.25, 1.25, 1.2].forEach(function(q){ box(m*q, 0.6, m*q, k || "crC"); y += 0.6; });
    stack([1.0, 0.7, 0.4], 0.35, "crT"); mast(0.8);
  } else if(t === "bullet"){   // round 5: rounded-top office tower (egg / bullet type): the crown closes in like a nose cone (no diagrid, no glass)
    [[0.96, 0.8], [0.88, 0.8], [0.76, 0.75], [0.6, 0.7], [0.42, 0.6], [0.24, 0.5]].forEach(function(q){ box(w*q[0], q[1], d*q[0], q[0] < 0.5 ? (k || "crC") : "crC"); y += q[1]; }); mast(1.2);
  } else if(t === "steps"){ stack([0.84, 0.62, 0.4], 0.75, k || "crC"); box(0.5, 0.9, 0.5, "crG"); y += 0.9; }
}
// eaves round a tier's top slab: four thin plates 0.55 m out, touching the corner columns (bonded like any member)
function l6Eave(xs, zs, y, fl){
  var x0 = xs[0] - COL/2, x1 = xs[xs.length - 1] + COL/2, z0 = zs[0] - COL/2, z1 = zs[zs.length - 1] + COL/2, o = 0.55, t = 0.2;
  v5Box((x0 + x1)/2, y, z1 + o/2, x1 - x0 + 2*o, t, o, "crT", fl); v5Box((x0 + x1)/2, y, z0 - o/2, x1 - x0 + 2*o, t, o, "crT", fl);
  v5Box(x1 + o/2, y, (z0 + z1)/2, o, t, z1 - z0, "crT", fl); v5Box(x0 - o/2, y, (z0 + z1)/2, o, t, z1 - z0, "crT", fl);
}
// ---- round 4 (Owner 11/11): ONE material ladder for TNT, strongest effect to weakest: wood > brick > plain concrete >
// reinforced concrete > steel. Replaces round 3's "no TNT shove on bonded steel". The ladder sets, per material family,
// the member strength the TNT damage meets (hp, armor; damage = 260 x (1 - d/3.8)^1.1 x dmg x (1 - armor), d = distance
// from the charge to the member) and how hard the blast shakes a member that is still bonded (push). Charges fired in
// the SAME volley add up on a member (the game's hp is not reset between the 0.2 s fuse steps); a new volley starts from
// full strength (hp reset at BLAST), so charges in different volleys never stack. Deterministic: no random term.
//   family  keys                          hp    armor dmg  push  one TNT breaks it ...          two TNT stacked (same volley)
//   wood    wpost (wfloor 60, wwall 15)    30    0     1.1  1     within 3.3 m                    within 3.8 m
//   brick   bk (bkw wall 40)               70    0.1   1    1     within 2.5 m                    within 3.3 m
//   conc    concrete (cpan wall 60)       130    0     1    1     within 1.8 m: its own column    within 2.6 m
//   RC      rc pier                       220    0.05  1    0.6   on contact only (<= 0.38 m)      within 2.0 m
//   steel   steel                         300    0.25  1    0.3   never                            on the member (<= 0.7 m)
//   band    sdeck (steel deck / belt)     450    0.25  1    0.3   never                            never: THREE stacked (<= 0.4 m)
// Round 4 change of order (Owner): brick now breaks MORE easily than plain concrete (was the other way round in rounds
// 2-3). Slabs (150) and wall panels keep their numbers. Keys not listed keep their own (V5 iron, gun, truss, core).
var L6_LADDER = {
  wood:  { keys:["wpost"], hp:30, armor:0, dmg:1.1, push:1 },
  brick: { keys:["bk"], hp:70, armor:0.1, dmg:1, push:1, also:{ bkw:40 } },
  conc:  { keys:["concrete"], hp:130, armor:0, dmg:1, push:1 },
  rc:    { keys:["rc", "pier"], hp:220, armor:0.05, dmg:1, push:0.6 },
  steel: { keys:["steel"], hp:300, armor:0.25, dmg:1, push:0.3 },
  band:  { keys:["sdeck"], hp:450, armor:0.25, dmg:1, push:0.3 }
};
var L6_PUSH = {};
Object.keys(L6_LADDER).forEach(function(k){ var L = L6_LADDER[k]; L.keys.forEach(function(key){ var m = MEMBERS[key]; if(!m) return;
  if(L.hp != null){ m.hp = L.hp; m.armor = L.armor; m.dmg = L.dmg; } L6_PUSH[key] = L.push; });
  Object.keys(L.also || {}).forEach(function(key){ if(MEMBERS[key]) MEMBERS[key].hp = L.also[key]; }); });
// shake: a bonded member of a strong family is pushed less (steel shudders, does not fly); a free one as before
var l6Push0 = pushBody;
pushBody = function(o, origin, I0, R, def, aim){
  var k = L6_PUSH[o.key];
  if(k != null && k < 1 && o.links && aliveLinks(o) > 0) I0 *= k;
  return l6Push0(o, origin, I0, R, def, aim);
};
// a new volley starts from full strength: record each member's starting hp, restore it on every BLAST
var l6Add0 = addBlock;
addBlock = function(){ var b = l6Add0.apply(this, arguments); b.hp0 = b.hp; return b; };
var l6Det0 = detonateAll;
detonateAll = function(){
  // determinism (see "DETERMINISM" at the end of this block): a blast always starts from the canonical rest state
  if(!noFinish){ l6Quiesce(); if(structureLive && l6HardBroken()){ finish(); return; } }
  l6Mark("blast"); l6Frozen = false; l6TimberT = -1; l6Unhold();
  for(var i=0;i<blocks.length;i++){ var b = blocks[i]; if(!b.dead && b.hp0 != null) b.hp = b.hp0; }
  // stacked charges: two or more charges of this volley within 1.5 m read as ONE bigger blast (one combined flash)
  var wv = charges.filter(function(c){ return !c.fired; });
  wv.forEach(function(c, i){ for(var j=i+1;j<wv.length;j++){ if(c.mesh.position.distanceTo(wv[j].mesh.position) < 1.5){ c.stack = wv[j].stack = true; } } });
  return l6Det0.apply(this, arguments);
};
var l6Fire0 = fireCharge;
fireCharge = function(c){ var st = c.stack && !c.fired, o = st ? c.mesh.position.clone() : null; l6Fire0(c);
  if(st){ fxFlash(o, c.def.radius*1.6); fxRing(o, c.def.radius*1.5); trauma = Math.min(1.2, trauma + 0.25); } };
// TNT power as ONE constant with a URL override (?tntp=<x>, damage and radius both x). Default 1.0 (round 2-4 TNT).
var L6_TNTP = Math.max(0.5, Math.min(2, +(QS.get("tntp") || 1)));
if(L6_TNTP !== 1){ CHARGES.tnt.dmg *= L6_TNTP; CHARGES.tnt.radius *= L6_TNTP; }
LANDMARK_BUILD.mass = l6Mass; V5_PARTS.mass = l6Mass;
// a bridge deck between two parts of a scene (steel: TNT cannot break it, so it pulls what it is fixed to):
//   {kind:"deck6", x, z, y: storey it hangs under (deck top = y*FH), len, wd, n: number of deck plates}
// Its ends touch the slab edges of the buildings on both sides, so the ordinary contact bonds carry it.
V5_PARTS.deck6 = function(P){
  var n = P.n || 2, len = P.len, wd = P.wd || BAY, y = (P.y || 1)*FH - ST/2, seg = len/n;
  for(var k=0;k<n;k++) v5Box(-len/2 + seg*(k + 0.5), y, 0, seg, ST, wd, "sdeck", (P.y || 1) - 1);
  [-1, 1].forEach(function(s){ v5Box(0, y + ST/2 + 0.3, s*(wd/2 - 0.07), len, 0.6, 0.14, "rail", (P.y || 1) - 1); });
  return {w:len, d:wd};
};
// a free-standing reinforced-concrete core (lift shaft): two fat dark piers one bay apart and a floor plate per storey.
// TNT only breaks the pier it sits on, and one pier gone brings the whole core down. {kind:"core6", x, z, floors}
V5_PARTS.core6 = function(P){
  var n = P.floors || 4, cw = COL*1.4, colH = FH - ST, d = P.d || 1.7;
  addBlock(0, -0.25, 0, BAY + cw + 0.8, 0.5, d + 0.5, "base", {anchor:true});
  for(var f=0; f<n; f++){
    [-1, 1].forEach(function(s){ v5Box(s*BAY/2, f*FH + colH/2, 0, cw, colH, cw, "rc", f); });
    v5Box(0, f*FH + colH + ST/2, 0, BAY + cw, ST, d, "rcs", f);
  }
  return {w:BAY + cw + 0.8, d:d + 0.5};
};
// selector "g:i:j" = the column on bay node (i, j) of tier 0's grid, on the asked floor (plans and bot hints for deep footprints)
function l6Select(sel, floor){
  var fm = /^@(\d+):(.+)$/.exec(sel); if(fm) return selectMembers(fm[2], +fm[1]);   // round 3: "@n:<sel>" = <sel> on floor n (upper-storey charges in plans and bot hints)
  if(sel.slice(0, 2) !== "g:") return null;
  var q = sel.split(":"), gi = +q[1], gj = +q[2];
  return blocks.filter(function(b){ return b.gi === gi && b.gj === gj && b.floor === floor && !b.dead && b.rb && !b.keep; })
    .map(function(b){ return {b:b, n:new THREE.Vector3(q[3] === "x-" ? -1 : q[3] === "x+" ? 1 : 0, 0, q[3] === "z-" ? -1 : q[3] && q[3][0] === "x" ? 0 : 1)}; });
}
// A protected neighbour is a whole building (PROTECTED-SPEC colours: ice-blue walls, navy cap, warm-lit windows):
// four full-width walls and one floor plate per storey, a window ribbon on every face, a door, and ONE solid navy CAP
// block on the top storey (Owner 10/11): chunky (0.6 m), 10 cm lip all round, seated on the top plate, nothing on top
// of it but the Figma sign (the sign stands on the highest member = the cap). The floor plates stop 5 cm inside the
// walls, so no slab edge sticks out. 9 bodies per storey whatever the footprint. K = L.keep {floors, cx, cz}; ox = centre x.
function l6KeepW(K){ return ((K.cx || 2) - 1)*BAY + COL + 1.3; }
function l6Keep(K, ox){
  var W = ((K.cx || 2) - 1)*BAY + COL, D = ((K.cz || 2) - 1)*BAY + COL, n = K.floors || 2, t = 0.3, colH = FH - ST;
  var kFront = null;
  addBlock(ox, -0.25, 0, W + 1.3, 0.5, D + 1.3, "kbase", {anchor:true, keep:true});
  for(var f=0; f<n; f++){
    var y = f*FH + colH/2, wy = f*FH + colH*0.56, wh = colH*0.44;
    [-1, 1].forEach(function(s){
      var kw0 = addBlock(ox, y, s*(D/2 - t/2), W, colH, t, "kwall", {keep:true, floor:f}); if(f === 0 && s === 1) kFront = kw0;
      addBlock(ox + s*(W/2 - t/2), y, 0, t, colH, D - 2*t, "kwall", {keep:true, floor:f});
      if(!(f === 0 && s === 1)) addBlock(ox, wy, s*(D/2 + 0.03), W - 1.0, wh, 0.06, "kwin", {keep:true, floor:f});
      addBlock(ox + s*(W/2 + 0.03), wy, 0, 0.06, wh, D - 1.0, "kwin", {keep:true, floor:f});
    });
    if(f === 0){   // front: a door between two windows
      addBlock(ox, colH*0.43, D/2 + 0.04, 1.2, colH*0.86, 0.08, "kroof", {keep:true, floor:0});
      [-1, 1].forEach(function(s){ var ww = (W - 1.0 - 1.9)/2; if(ww > 0.5) addBlock(ox + s*(0.95 + ww/2), wy, D/2 + 0.03, ww, wh, 0.06, "kwin", {keep:true, floor:0}); });
    }
    addBlock(ox, f*FH + colH + ST/2, 0, W - 0.1, ST, D - 0.1, "kplate", {keep:true, floor:f});
  }
  var kCap = addBlock(ox, n*FH + 0.3, 0, W + 0.2, 0.6, D + 0.2, "kcap", {keep:true, floor:n});
  l6KdType(K, ox, W, D, n, kCap, kFront);   // round 5: the roof / front that says WHAT the building is (PROTECTED-SPEC §2.4)
}
V5_PARTS.keep6 = function(K){ l6Keep(K, 0); return {w:l6KeepW(K), d:((K.cz || 2) - 1)*BAY + COL + 1.3}; };   // a full protected building inside a scene: keeps:[{kind:"keep6", x, floors, cx, cz, name, role}]
(function(){ var st = document.createElement("style"); st.textContent = "#tip:empty{display:none!important}#blastN{display:none!important}.shield i{display:none!important}.shield b{margin-top:0!important}";   /* r5: the type roof says what the building is: only the % damage tag stays over it */ document.head.appendChild(st); })();   // a level without a tip shows no tip pill; round 3: no wave count under BLAST! (Owner text rule, as v31/TEXT-CUT.md #1)
// looks: the new members share the shader of their family (rounded bevel, Figma texture), with their own colour
MATS.kwall = MATS.keep; MATS.kplate = MATS.keep; MATS.kroofN = MATS.keep; MATS.kroofW = MATS.keep; MATS.kroofI = MATS.keep;
["wpost", "wfloor", "wwall"].forEach(function(k){ MATS[k] = MATS.timber; });
["bk", "bkw"].forEach(function(k){ MATS[k] = MATS.brick; });
["cpan", "rc", "rcs", "tdeck"].forEach(function(k){ MATS[k] = MATS.concrete; }); MATS.sdeck = MATS.steel;
// reward by difficulty (economy proposal, flag `reward`, default OFF): normal : Hard : boss / Super Hard = 1 : 2.5 : 5 on every coin of the level
function l6Rew(old){ return L6.reward ? (L.boss || L.tier === "SH" ? 5 : isHard(L) ? 2.5 : 1) : (L.boss ? old : 1); }
// ---- round 5 (Owner 11/11, PROTECTED-SPEC.md §2.4): a protected building shows WHAT it is by its silhouette. Visual decor
// only (no physics body, no collider): five instanced meshes for the whole level (box, cylinder, prism, half-dome, 4-sided
// cone). Each piece is attached to ONE keep member (roof pieces -> the navy roof cap, ground-floor pieces -> the front
// ground-floor wall): its world matrix = member pose x local offset, written with the member (writeMatrix), so it rides
// with it and hides when the member dies. Every piece sits on its member or on a piece below it (L6_KD gap check <= 2 cm).
// Colours: navy roof #2F56C4, ice wall #D9E8FF, white trim, gold #FFC633, ink #1E2F6B. No text, no logo, no cross /
// crescent / Star of Life, no spire, no flag (LEGAL-LANDMARKS §3.4). Round 5 update: types school | hospital only.
var L6_KDC = { roof:0x2F56C4, wall:0xD9E8FF, trim:0xFFFFFF, gold:0xFFC633, ink:0x1E2F6B, green:0x3A8F5C, bulb:0xFFF2B3 };
var L6_KD = { geo:null, mesh:{}, list:[] }, _kdM = new THREE.Matrix4(), _kdL = new THREE.Matrix4(), _kdQ = new THREE.Quaternion(), _kdE = new THREE.Euler();
function l6KdGeos(){
  if(L6_KD.geo) return L6_KD.geo;
  var pr = new THREE.BufferGeometry(), v = [], A = [-0.5, -0.5], B = [-0.5, 0.5], C = [0.5, 0];   // prism: triangle (y, z) apex up, extruded along x
  var P = function(x, t){ return [x, t[0], t[1]]; }, tri = function(a, b, c){ v.push.apply(v, a.concat(b, c)); };
  tri(P(-0.5, A), P(-0.5, C), P(-0.5, B)); tri(P(0.5, A), P(0.5, B), P(0.5, C));
  [[A, B], [B, C], [C, A]].forEach(function(e){ var a0 = P(-0.5, e[0]), a1 = P(0.5, e[0]), b0 = P(-0.5, e[1]), b1 = P(0.5, e[1]); tri(a0, b0, b1); tri(a0, b1, a1); });
  pr.setAttribute("position", new THREE.Float32BufferAttribute(v, 3)); pr.computeVertexNormals();
  var cone = new THREE.ConeGeometry(0.5, 1, 4, 1); cone.rotateY(Math.PI/4); cone.scale(1.414, 1, 1.414);
  var dome = new THREE.SphereGeometry(0.5, 14, 7, 0, Math.PI*2, 0, Math.PI/2); dome.translate(0, -0.25, 0); dome.scale(1, 2, 1);
  return (L6_KD.geo = { box:new THREE.BoxGeometry(1, 1, 1), cyl:new THREE.CylinderGeometry(0.5, 0.5, 1, 14), prism:pr, dome:dome, cone:cone });
}
// piece: g shape, c colour key, (x, y, z) world centre at spawn, (sx, sy, sz) size, (rx, ry, rz) rotation, host member
function l6KdAdd(host, g, c, x, y, z, sx, sy, sz, rx, ry, rz){
  (host.kd = host.kd || []).push({ g:g, c:L6_KDC[c] != null ? L6_KDC[c] : c, o:new THREE.Vector3(x - host.spawn.x, y - host.spawn.y, z - host.spawn.z),
    q:new THREE.Quaternion().setFromEuler(_kdE.set(rx || 0, ry || 0, rz || 0)), s:new THREE.Vector3(sx, sy, sz) });
}
// Round 5 update (Owner 11/11): only TWO protected types, SCHOOL and HOSPITAL, and the roof is a REAL member set: plain-
// concrete-strength keep members (hp 130, ladder "conc"), bonded to the navy cap by the ordinary contact bonds, so the roof
// counts as protected damage and falls with the building as debris. Small markings (clock face and hands, bell, helipad
// disc and H) are visual decor riding on a roof member (no body). Type per building: K.type, else picked by l6Rules
// (seeded by the level name and the building's index: deterministic, both types appear).
//   school   : 6 members: navy belfry base, 4 white posts, navy top slab; decor: clock disc + hands, white band, gold bell, navy 4-sided cap
//   hospital : 1 member: the navy stair hut; decor: white parapet, white ring + H on the navy cap, the hut's white lid and door (no cross / crescent / Star of Life)
function l6KdType(K, ox, W, D, n, cap, front){
  var ty = String(K.type || "").toLowerCase(), R = cap.spawn.y + cap.half[1], k = Math.max(1, Math.min(1.4, Math.min(W, D)/4.6)), o = {keep:true, floor:n + 1};
  var mem = function(key, x, y, z, sx, sy, sz){ return addBlock(x, y, z, sx, sy, sz, key, o); };
  var CW = cap.half[0]*2, CD = cap.half[2]*2, cy = cap.spawn.y;
  if(ty !== "school" && ty !== "hospital") return;
  cap.l6type = ty;
  // the cap's white edge band (art-brief/figma-ui/roofs-school-hospital.png): a thin decor trim round the navy roof slab
  l6KdAdd(cap, "box", "trim", ox, cy - 0.12, CD/2 + 0.04, CW + 0.16, 0.36, 0.08); l6KdAdd(cap, "box", "trim", ox, cy - 0.12, -CD/2 - 0.04, CW + 0.16, 0.36, 0.08);
  l6KdAdd(cap, "box", "trim", ox + CW/2 + 0.04, cy - 0.12, 0, 0.08, 0.36, CD); l6KdAdd(cap, "box", "trim", ox - CW/2 - 0.04, cy - 0.12, 0, 0.08, 0.36, CD);
  if(ty === "school"){   // navy belfry base + white clock disc, 4 white posts, gold bell, navy top slab (white edge) + navy 4-sided cap
    var b = 1.8*k, h = 1.4*k, ph = 1.15*k, po = b/2 - 0.17*k, y = R;
    var base = mem("kroofN", ox, y + h/2, 0, b, h, b); y += h;
    l6KdAdd(base, "cyl", "trim", ox, R + h*0.45, b/2 + 0.035, 0.95*k, 0.07, 0.95*k, Math.PI/2); l6KdAdd(base, "cyl", "roof", ox, R + h*0.45, b/2 + 0.075, 0.8*k, 0.02, 0.8*k, Math.PI/2);
    l6KdAdd(base, "cyl", "trim", ox, R + h*0.45, b/2 + 0.09, 0.72*k, 0.02, 0.72*k, Math.PI/2);
    l6KdAdd(base, "box", "ink", ox, R + h*0.45 + 0.15*k, b/2 + 0.105, 0.07, 0.3*k, 0.02); l6KdAdd(base, "box", "ink", ox + 0.1*k, R + h*0.45 - 0.08*k, b/2 + 0.105, 0.24*k, 0.07, 0.02, 0, 0, -0.6);
    l6KdAdd(base, "box", "trim", ox, y - 0.1*k, 0, b + 0.1, 0.2*k, b + 0.1);   // the white band on top of the base (decor, flush)
    [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(function(q){ mem("kroofW", ox + q[0]*po, y + ph/2, q[1]*po, 0.3*k, ph, 0.3*k); });
    l6KdAdd(base, "dome", "gold", ox, y + ph*0.45, 0, 0.66*k, 0.5*k, 0.66*k); l6KdAdd(base, "cyl", "gold", ox, y + ph*0.45 - 0.31*k, 0, 0.74*k, 0.12*k, 0.74*k); var rl = ph*0.55 - 0.25*k; l6KdAdd(base, "cyl", "gold", ox, y + ph*0.45 + 0.25*k + rl/2, 0, 0.1, rl, 0.1);   // the bell hangs from the top slab
    y += ph;
    var top = mem("kroofN", ox, y + 0.15*k, 0, b + 0.3, 0.3*k, b + 0.3);
    l6KdAdd(top, "box", "trim", ox, y + 0.06*k, 0, b + 0.36, 0.12*k, b + 0.36); y += 0.3*k;
    l6KdAdd(top, "cone", "roof", ox, y + 0.6*k, 0, b + 0.16, 1.2*k, b + 0.16);
  } else {   // navy roof slab with a white parapet (decor, flush on the cap), white ring + H decal, navy stair hut with a white lid (1 member)
    var pt = 0.26, ph2 = 0.3, py = R + ph2/2;
    l6KdAdd(cap, "box", "trim", ox, py, CD/2 - pt/2, CW, ph2, pt); l6KdAdd(cap, "box", "trim", ox, py, -CD/2 + pt/2, CW, ph2, pt);
    l6KdAdd(cap, "box", "trim", ox + CW/2 - pt/2, py, 0, pt, ph2, CD - 2*pt); l6KdAdd(cap, "box", "trim", ox - CW/2 + pt/2, py, 0, pt, ph2, CD - 2*pt);
    var hs = 1.15*k, hx = ox - CW/2 + pt + hs/2 + 0.05, hz = CD/2 - pt - hs/2 - 0.05;   // the hut in the FRONT-LEFT corner (away from the usual target side; a hit hut = protected damage)
    var hut = mem("kroofN", hx, R + 0.7*k, hz, hs, 1.4*k, hs); l6KdAdd(hut, "box", "trim", hx, R + 1.4*k + 0.09, hz, hs + 0.2, 0.18, hs + 0.2);
    l6KdAdd(hut, "box", "trim", hx - 0.1, R + 0.5*k, hz + hs/2 + 0.02, 0.5*k, 0.95*k, 0.04); l6KdAdd(hut, "box", "gold", hx + hs*0.3, R + 0.95*k, hz + hs/2 + 0.025, 0.26*k, 0.28*k, 0.03);
    // the pad: a thick white ring and a bold white H, flush on the navy slab, as large as the roof allows beside the hut
    var rr = Math.min(CW - 2*pt - 0.3, CD - 2*pt - 0.3)/2, px = ox + (CW > CD + 1 ? hs*0.4 : 0), pz = CW > CD + 1 ? 0 : -0.2, sw = Math.max(0.32, rr*0.2);
    l6KdAdd(cap, "cyl", "trim", px, R + 0.02, pz, rr*2, 0.04, rr*2); l6KdAdd(cap, "cyl", "roof", px, R + 0.045, pz, rr*2 - 2*sw*0.9, 0.04, rr*2 - 2*sw*0.9);
    var hh = rr*1.0, hw = rr*0.72;
    l6KdAdd(cap, "box", "trim", px - hw/2 + sw/2, R + 0.08, pz, sw, 0.04, hh); l6KdAdd(cap, "box", "trim", px + hw/2 - sw/2, R + 0.08, pz, sw, 0.04, hh); l6KdAdd(cap, "box", "trim", px, R + 0.08, pz, hw - sw, 0.04, sw);
  }
}
function l6KdBuild(){
  var G = l6KdGeos(), by = {}, list = [];
  Object.keys(L6_KD.mesh).forEach(function(g){ scene.remove(L6_KD.mesh[g]); L6_KD.mesh[g].dispose(); }); L6_KD.mesh = {};
  blocks.forEach(function(b){ if(b.kd) b.kd.forEach(function(p){ p.host = b; (by[p.g] = by[p.g] || []).push(p); list.push(p); }); });
  Object.keys(by).forEach(function(g){
    var mesh = new THREE.InstancedMesh(G[g], new THREE.MeshLambertMaterial({ color:0xffffff }), by[g].length);
    mesh.castShadow = true; mesh.receiveShadow = true; mesh.frustumCulled = false;
    by[g].forEach(function(p, i){ p.im = mesh; p.ii = i; linSet(_c, p.c); mesh.setColorAt(i, _c); });
    if(mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    scene.add(mesh); L6_KD.mesh[g] = mesh;
  });
  L6_KD.list = list;
  blocks.forEach(function(b){ if(b.kd) l6KdWrite(b, b.P, b.Q); });
}
function l6KdWrite(b, P, Q){
  for(var i=0;i<b.kd.length;i++){ var p = b.kd[i]; if(!p.im) continue;
    if(b.dead && !b.rubble) _kdM.makeScale(0, 0, 0);
    else { _kdM.compose(P, Q, _s.set(1, 1, 1)); _kdL.compose(p.o, p.q, p.s); _kdM.multiply(_kdL); }
    p.im.setMatrixAt(p.ii, _kdM); p.im.instanceMatrix.needsUpdate = true; }
}
// the frame (opening camera) also holds the visual crowns / roofs, which are not bodies any more
var l6FB0 = frameBox; frameBox = function(){ var bx = l6FB0.apply(this, arguments);
  blocks.forEach(function(b){ if(!b.kd || b.anchor) return; b.kd.forEach(function(p){ var t = b.spawn.y + p.o.y + p.s.y/2; if(t > bx.y1) bx.y1 = t; }); }); return bx; };
var l6BI0 = buildInstances; buildInstances = function(){ var r = l6BI0.apply(this, arguments); l6KdBuild(); return r; };
var l6WM0 = writeMatrix; writeMatrix = function(b, yOff){ l6WM0(b, yOff); if(b.kd && b.im) l6KdWrite(b, _p, _q); };
// float check (qa-float style): the largest gap between a decor piece and its member or another piece of the same member (m)
function l6KdGap(){
  var box = function(c, h){ return { x0:c.x - h.x, x1:c.x + h.x, y0:c.y - h.y, y1:c.y + h.y, z0:c.z - h.z, z1:c.z + h.z }; };
  var gap = function(a, b){ var dx = Math.max(0, a.x0 - b.x1, b.x0 - a.x1), dy = Math.max(0, a.y0 - b.y1, b.y0 - a.y1), dz = Math.max(0, a.z0 - b.z1, b.z0 - a.z1); return Math.sqrt(dx*dx + dy*dy + dz*dz); };
  var worst = 0, out = [];
  blocks.forEach(function(b){ if(!b.kd) return; var hb = box(b.spawn, new THREE.Vector3(b.half[0], b.half[1], b.half[2]));
    var bx = b.kd.map(function(p){ var h = new THREE.Vector3(), m = new THREE.Matrix4().compose(new THREE.Vector3(), p.q, p.s), e = m.elements;
      h.set(Math.abs(e[0]) + Math.abs(e[4]) + Math.abs(e[8]), Math.abs(e[1]) + Math.abs(e[5]) + Math.abs(e[9]), Math.abs(e[2]) + Math.abs(e[6]) + Math.abs(e[10])).multiplyScalar(0.5);
      return box(p.o.clone().add(b.spawn), h); });
    bx.forEach(function(a, i){ var g = gap(a, hb); bx.forEach(function(c, j){ if(j !== i) g = Math.min(g, gap(a, c)); }); if(g > worst) worst = g; if(g > 0.02) out.push(b.kd[i].g + "@" + i + ":" + g.toFixed(3)); }); });
  return { worst:+worst.toFixed(3), floating:out, pieces:L6_KD.list.length, meshes:Object.keys(L6_KD.mesh).length };
}
// the rooftop sign (badge) shows the type's pictogram: new roles + glyphs (white/cream on the blue tile, no cross anywhere:
// a protected "hospital" is drawn as the clinic's heart-and-pulse)
function keepRole(spec){
  var r = ((spec && (spec.type || spec.role)) || "") + " " + ((spec && spec.name) || ""); r = r.toLowerCase();
  if(/hospital|clinic/.test(r)) return "hospital";
  if(/school/.test(r)) return "school";
  if(/librar/.test(r)) return "library";
  return "townhall";
}
// Owner 11/11: the type roof is the protected building's only identity: no rooftop sign / billboard on ANY protected
// building (L1-12 and the stubs, canvas and figmadirect images alike); the live % damage tag stays (it sits on the building).
var l6SA0 = signAttach; signAttach = function(sh){ l6SA0(sh); if(sh.sign){ signClear(sh); } };   // the "signed" look stays: only the % tag shows (no shield badge over the roof)
// an old single protected frame (buildFrame keep, the stubs) gets the same navy roof cap + type roof on top
function l6KeepRoofOld(K, kx){ var f = K.floors || 2, W = BAY + COL, D = BAY + COL;
  var cap = addBlock(kx, f*FH + 0.3, 0, W + 0.2, 0.6, D + 0.2, "kcap", {keep:true, floor:f}); l6KdType(K, kx, W, D, f, cap, null); }
// the hospital badge: a heart with a pulse line (the base glyph was a cross: Geneva-emblem risk, PROTECTED-SPEC §2.4)
SIGN_GLYPH.hospital = function(g){ g.beginPath(); g.moveTo(128, 182); g.bezierCurveTo(60, 136, 56, 88, 92, 76); g.bezierCurveTo(112, 70, 124, 84, 128, 96); g.bezierCurveTo(132, 84, 144, 70, 164, 76); g.bezierCurveTo(200, 88, 196, 136, 128, 182); g.closePath(); signPaint(g, SIGN_CREAM, 9);
  g.beginPath(); g.moveTo(74, 126); g.lineTo(106, 126); g.lineTo(118, 102); g.lineTo(134, 152); g.lineTo(146, 124); g.lineTo(182, 124); g.lineWidth = 9; g.strokeStyle = "#E85A4F"; g.lineJoin = "round"; g.stroke(); };
// ---- round 5 (Owner 11/11): MULTI-WAVE RULE, game-wide (the anchors are in levels6/patch.js, "multi-wave rule 1-5").
// BLAST fires only the charges placed so far. When the collapse settles: PASS reached -> result (win); a hard rule broken
// (protected / street) -> result (fail); no TNT left -> result; otherwise the player keeps planning with the TNT left and
// may BLAST again, as many times as he likes (L.waves is ignored; ?wavecap=1 brings the old per-level limit back). Every
// BLAST restores member strength (round 4: charges stack only within one blast). Auto-blast still fires ~1 s after the
// LAST TNT is placed. No wave counter or wave text anywhere (v31/TEXT-CUT.md).
// ---- round 6 (11/11): DETERMINISM. Same level + same plan = same result, whatever ran before in the page and however
// long the player took between taps. Measured before the fix (L9, same plan, same seed): 81-91% with 0-20 s of planning
// before a blast in the test harness, 73 / 84 / 93% in three runs of the real game loop. Three causes, all "the state at
// BLAST depends on wall time":
//   1) plan phase: the world kept stepping with bodies awake (solver jitter before Rapier sleeps them; after a blast:
//      whatever was still moving), so the state a blast hit depended on how many steps the player waited;
//   2) the wave end was decided per rendered FRAME (stableT in real seconds, the TIMBER time set by the frame loop), so
//      freezeWorld() ran at a different step from run to run, and the test harness used a different rule (no TIMBER);
//   3) game-time thresholds on whole steps (1.0 s = 60 steps) were compared on an accumulated float (59 or 60 steps).
// The rule now: every decision that touches physics is taken per FIXED STEP, on whole step counts, and a blast always
// starts from a canonical REST state: every body sleeps and the world is NOT stepped at all until the BLAST (l6Frozen).
// (Stepping a sleeping Rapier world still changes it: the broad-phase tree is re-optimised a little every step, which
// reorders the contact pairs and so the solver. Measured: same bodies, same poses, 30 idle steps more -> another result.)
//   - level start: when the presettle ends, every body is put to sleep (settleRef); frozen from the first plan frame;
//   - wave end: decided inside fixedStep (l6 hook below; the frame loop and test.run no longer decide it), then the
//     REST procedure: up to L6_REST_CAP more steps; every L6_REST_EVERY steps bodies at rest and supported are put to
//     sleep; when all sleep, or at the cap (then everything is put to sleep, a piece still moving is held and released
//     by the next BLAST), the world is at rest and frozen. The game runs these steps in its normal loop (the rubble visibly
//     settles while the player plans); a BLAST that comes before the rest is reached runs the steps left first
//     (detonateAll), and the test harness (manual) runs them at once at the wave end. Same steps, same state.
//   - a hard rule (protected / street) broken while the rubble came to rest ends the attempt when the rest is reached
//     (it was checked per frame in updateLiveHUD), or at the BLAST if that comes first.
//   - the paid "+1 TNT" rescue continues from the same rest state (finish starts the rest procedure when a rescue is on offer).
// Two more leaks closed: the step counter (v5SleepFix runs every 30th step) ran on across levels and differed between
// a prebuilt and a cold start (now 0 for every new world); and whether a broken member became fragments or dust
// depended on free RENDER slots, which come back from the 0.25 s fade in the frame loop (never in a headless bot run,
// so the bots measured a different game than the player's): room() now counts live fragments only.
// Not covered: the Wrecking Ball / Aftershock boosters (per-frame parts in bstFrame); none is in the bot gates.
// Check: node levels6/tools/determinism-check.js <game.html> [levels] [repeats].
var L6_REST_CAP = 150, L6_REST_EVERY = 10, l6Rest = 0, l6Run = false, l6TimberT = -1, l6Frozen = false;
// determinism log (test API: __blast.test.l6()): one entry per event that must repeat exactly: "start" (plan opens),
// "blast" (the state a BLAST hits), "rest" (rubble at rest after a wave), "done" (the result). h = hash of every body's pose.
var l6Log = [], _l6f = new Float32Array(1), _l6u = new Uint32Array(_l6f.buffer);
function l6PoseHash(){
  var h = 2166136261 >>> 0, k, i, o, list, mix = function(x){ _l6f[0] = x; h = Math.imul(h ^ _l6u[0], 16777619) >>> 0; };
  for(k=0;k<2;k++){ list = k ? frags : blocks;
    for(i=0;i<list.length;i++){ o = list[i]; if(o.anchor) continue; mix(o.dead ? 1 : 0); if(o.dead && !o.rubble) continue;
      mix(o.P.x); mix(o.P.y); mix(o.P.z); mix(o.Q.x); mix(o.Q.y); mix(o.Q.z); mix(o.Q.w); } }
  return ("0000000" + h.toString(16)).slice(-8);
}
function l6Mark(ev){ if(pbBusy) return; l6Log.push({ ev:ev, step:stepCount, pct:+(score()*100).toFixed(3), h:l6PoseHash(), frags:frags.length }); }
function l6Report(){ return { log:l6Log.slice(), frozen:l6Frozen, rest:l6Rest, step:stepCount, phase:phase, result:lastResult ? { ok:lastResult.ok, code:lastResult.code, pct:lastResult.pct } : null }; }
function l6Since(t){ return Math.round((gameT - t)/DT); }   // whole fixed steps since game time t
function l6HardBroken(){ var c = verdict().code; return c === "collateral" || c === "street"; }
function l6Unhold(){
  var i, o;
  for(i=0;i<blocks.length;i++){ o = blocks[i]; if(o.l6Held){ o.l6Held = false; if(o.rb){ o.rb.wakeUp(); o.sleeping = false; } } }
  for(i=0;i<frags.length;i++){ o = frags[i]; if(o.l6Held){ o.l6Held = false; if(o.rb){ o.rb.wakeUp(); o.sleeping = false; } } }
}
function l6RestStart(){ l6Rest = L6_REST_CAP; l6Frozen = false; }
// one sweep: sleep what is at rest and held up (force: everything). Returns how many bodies are still awake.
function l6RestSweep(force){
  var anc = anchoredSet(), awake = 0, k, i, o, list;
  for(k=0;k<2;k++){ list = k ? frags : blocks;
    for(i=0;i<list.length;i++){
      o = list[i]; if(!o.rb || o.anchor) continue;
      if(o.rb.isSleeping()){ o.sleeping = true; o.V.set(0,0,0); continue; }
      var slow = o.V.lengthSq() < 0.0225;
      if(force || (slow && ((!k && anc.has(o)) || supportedAtRest(o)))){ if(!slow) o.l6Held = true; o.rb.sleep(); o.sleeping = true; o.V.set(0,0,0); }
      else awake++;
    } }
  return awake;
}
function l6RestStep(){
  l6Rest--;
  var k = L6_REST_CAP - l6Rest;
  if(l6Rest === 0) l6RestSweep(true);
  else if(k % L6_REST_EVERY === 0 && l6RestSweep(false) === 0) l6Rest = 0;
  if(l6Rest === 0){ l6Frozen = true; shadowDirty = true; l6Mark("rest"); if(phase === "plan" && structureLive && l6HardBroken()) finish(); }
}
// run what is left of the rest procedure right now (a BLAST before the rubble is at rest; the test harness at a wave end)
// (pending game-time timers, e.g. a cook-off, are run out too: a blast they set off restarts the rest procedure)
function l6Quiesce(){ var g = 0; while((l6Rest > 0 || timers.length) && g++ < 900) fixedStep(); if(l6Rest > 0){ l6Rest = 0; l6RestSweep(true); l6Mark("rest"); } l6Frozen = true; }
var l6SR0 = settleRef;
settleRef = function(){
  l6SR0();
  if(noFinish) return;   // test.load (physics checks: creep, bonds at rest) keeps the awake frame
  for(var i=0;i<blocks.length;i++){ var o = blocks[i]; if(o.rb && !o.anchor){ o.rb.sleep(); o.sleeping = true; o.V.set(0,0,0); } }
};
// the wave-end rule of the base (waveDone), on whole steps; TIMBER = the step the main collapse starts (same test as the
// frame loop's slow-mo trigger, which stays visual only)
waveDone = function(){
  var n = l6Since(lastBlastT);
  if(!dudChecked && n > 60 && movingCount() < 3){ dudChecked = true; if(!budged()){ dudWave = true; return true; } }
  if(stableT > 0.5 && n > 60) return true;
  if(l6TimberT >= 0 && !(typeof quakeDone !== "undefined" && quakeDone) && l6Since(l6TimberT) > 150 && movingCount() < 3) return true;
  return (n > Math.round(SETTLE_CAP/DT) && movingCount() < 3) || n > Math.round(SETTLE_HARD/DT);
};
function l6TimberStep(){
  if(l6TimberT >= 0 || l6Since(firstBlastT) <= 7) return;
  var fast = 0;
  for(var i=0;i<blocks.length;i++){ var b = blocks[i]; if(b.dead || b.anchor || !b.rb || b.keep || b.prop) continue; if(b.V.lengthSq() > 9) fast++; }
  if(fast >= Math.max(6, targetCount*0.18) || standingHeight() < buildingH*0.8) l6TimberT = gameT;
}
// a new world counts its steps from 0 (the prebuilt one already did)
var l6NW0 = newWorld; newWorld = function(){ l6NW0(); stepCount = 0; };
var l6TD0 = teardown; teardown = function(){ l6Frozen = false; l6Rest = 0; l6TimberT = -1; l6Log = []; return l6TD0.apply(this, arguments); };
var l6SB0 = stepBuild; stepBuild = function(rdt){ var ph = phase; l6SB0(rdt); if(ph === "build" && phase === "plan"){ l6Frozen = !noFinish; l6Mark("start"); } };
// a blast outside a volley (a cook-off timer in the plan phase): the world moves again, so it has to come to rest again
var l6Blast0 = blast; blast = function(){ var r = l6Blast0.apply(this, arguments); if(phase === "plan" || phase === "count" || phase === "done") l6RestStart(); return r; };
// fragments: the physics budget is MAX_FRAG live pieces; render slots still fading out are taken back when the pool runs short
room = function(){ return MAX_FRAG - frags.length; };
var l6FFS0 = freeFragSlots;
freeFragSlots = function(need){
  var r = l6FFS0(need), n = 0;
  while(fragFree.length < need && fading.length){ var x = fading.shift(); _m4.makeScale(0, 0, 0); fragMesh.setMatrixAt(x.f.slot, _m4); fragFree.push(x.f.slot); n++; }
  if(n) fragMesh.instanceMatrix.needsUpdate = true;
  return r;
};
var l6FS0 = fixedStep;
fixedStep = function(){
  var rest = phase === "plan" || phase === "count" || phase === "done" || phase === "build";
  if(!pbBusy){
    if(typeof ballLive !== "undefined" && ballLive) l6Frozen = false;   // a Wrecking Ball in flight: the world runs
    if(l6Frozen && !rest) l6Frozen = false;
    if(l6Frozen && !timers.length) return;   // at rest: nothing moves, nothing is stepped, the state at BLAST is the same after 1 s or 1 min
  }
  l6FS0();
  if(pbBusy || (noFinish && !l6Run)) return;   // not in the next level's prebuild; test.load + test.step never end a wave (test.run does)
  if(phase === "boom" || phase === "settle") l6TimberStep();
  if(phase === "settle"){
    stableT = settled() ? stableT + DT : 0;
    if(waveDone()){ if(!manual) jSettle(); waveEnd(); }
  } else if(l6Rest > 0 && (phase === "plan" || phase === "count" || phase === "done")) l6RestStep();
};
var l6WE0 = waveEnd;
waveEnd = function(){ l6WE0(); if(phase === "plan" && !noFinish){ l6RestStart(); if(manual) l6Quiesce(); } };   // test.load keeps the free-running world
var l6Fin0 = finish;
finish = function(){ var r = l6Fin0.apply(this, arguments); l6Mark("done"); l6Rest = (!noFinish && canRescue(lastResult)) ? L6_REST_CAP : 0; return r; };
var l6Res0 = rescue;
rescue = function(){
  if(phase === "done" && canRescue(lastResult) && save.coins >= RESCUE_COST) l6Quiesce();
  l6Res0(); if(phase === "plan") l6RestStart();
};
// ---- end levels6 v10 builders
