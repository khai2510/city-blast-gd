// ---- levels6 v11 (L13-36 add-ons, applied AFTER patch/v10.js by tools/src-l13-36.js; nothing in v10 is edited)
// 1) measuring API for the level gate (brief §6.4 scale check): window.__blast.l11.fill() / .rest()
// The hero part is L.hero (a part id, default "A"); its box includes the visual crown pieces riding on its members.
function l11Box(test){
  var bx = {x0:1e9, x1:-1e9, y0:0, y1:0, z0:1e9, z1:-1e9, n:0};
  blocks.forEach(function(b){ if(b.anchor || b.prop || b.keep || !test(b)) return; var p = b.spawn; bx.n++;
    bx.x0 = Math.min(bx.x0, p.x - b.half[0]); bx.x1 = Math.max(bx.x1, p.x + b.half[0]); bx.z0 = Math.min(bx.z0, p.z - b.half[2]); bx.z1 = Math.max(bx.z1, p.z + b.half[2]);
    bx.y1 = Math.max(bx.y1, p.y + b.half[1]);
    (b.kd || []).forEach(function(q){ bx.y1 = Math.max(bx.y1, p.y + q.o.y + q.s.y/2); }); });
  return bx;
}
function l11Scr(bx){ var y0 = 1e9, y1 = -1e9, x0 = 1e9, x1 = -1e9;
  for(var i=0;i<8;i++){ var s = toScreen({x:i&1 ? bx.x1 : bx.x0, y:i&2 ? bx.y1 : bx.y0, z:i&4 ? bx.z1 : bx.z0}); y0 = Math.min(y0, s.y); y1 = Math.max(y1, s.y); x0 = Math.min(x0, s.x); x1 = Math.max(x1, s.x); }
  return {x0:x0, x1:x1, y0:y0, y1:y1}; }
var L11_API = {
  // screenFillPct = the hero's projected height / the play area's height (between the top HUD and the bottom tray), opening camera
  fill: function(){
    var hid = L.hero || "A", hb = l11Box(function(b){ return b.bid === hid; }), hs = l11Scr(hb), top = VY + topH(), bot = VY + VH - botH(), ids = {}, sec = 0, keepH = 0, minCol = 1e9;
    blocks.forEach(function(b){ if(!b.anchor && !b.prop && !b.keep && b.bid && b.bid !== hid) ids[b.bid] = 1; if(b.keep && !b.anchor) keepH = Math.max(keepH, b.spawn.y + b.half[1]); });
    var secs = Object.keys(ids).map(function(id){ var q = l11Box(function(b){ return b.bid === id; }); sec = Math.max(sec, q.y1); return {id:id, h:+q.y1.toFixed(1), w:+Math.max(q.x1 - q.x0, q.z1 - q.z0).toFixed(1)}; });
    blocks.forEach(function(b){ if(b.anchor || b.prop || b.keep || b.dead || b.floor !== 0 || b.half[1] < 0.8 || b.half[0] > 0.8 || b.half[2] > 0.8) return;
      var a = toScreen({x:b.spawn.x - b.half[0], y:b.spawn.y, z:b.spawn.z}), c = toScreen({x:b.spawn.x + b.half[0], y:b.spawn.y, z:b.spawn.z}), w = Math.hypot(a.x - c.x, a.y - c.y); if(w < minCol) minCol = w; });
    var fr = l11Scr(frameBox());
    return { heroH:+hb.y1.toFixed(1), heroPx:Math.round(hs.y1 - hs.y0), playPx:Math.round(bot - top), screenFillPct:Math.round((Math.min(hs.y1, bot) - Math.max(hs.y0, top))/(bot - top)*100),
      inFrame:fr.x0 >= VX - 2 && fr.x1 <= VX + VW + 2 && fr.y0 >= top - 2 && fr.y1 <= bot + 2, secondaryRatio:+(sec/Math.max(1, hb.y1)).toFixed(2), secs:secs, keepH:+keepH.toFixed(1), minColPx:+minCol.toFixed(1) };
  },
  // bodies and bonds: call right after the level is built, then again after stepping 3 s (cracked = bonds lost at rest)
  rest: function(){ var alive = 0; for(var i=0;i<links.length;i++) if(links[i].alive) alive++;
    var by = {}; blocks.forEach(function(b){ if(b.anchor || b.keep || b.prop || b.bonus || !b.bid) return; var e = by[b.bid] = by[b.bid] || {m:0, up:0, h:0}; e.m += b.mass;
      if(!b.dead && standing(b)){ e.up += b.mass; e.h = Math.max(e.h, b.P.y + b.half[1]); } });
    var parts = Object.keys(by).map(function(k){ return k + ":" + Math.round(by[k].up/Math.max(1, by[k].m)*100) + "%/" + by[k].h.toFixed(0) + "m"; }).join(" ");
    var deadL = {}; for(i=0;i<links.length;i++) if(!links[i].alive){ var la = links[i].a, lb = links[i].b, k = (la.keep ? "keep" : la.bid) + ":" + la.key + "/" + lb.key + "@f" + la.floor; deadL[k] = (deadL[k] || 0) + 1; }
    return { deadLinks:deadL, parts:parts, bodies:blocks.filter(function(b){ return b.rb && !b.anchor; }).length, targets:blocks.filter(function(b){ return b.rb && !b.anchor && !b.keep && !b.prop; }).length, bonds:alive, kd:L6_KD.list.length, pct:Math.round(score()*100), street:Math.round(streetShare()*100), coll:Math.round(collateral()*100) }; }
};
// 2) hero silhouettes for the F-library block versions: crown type "stack" = any stepped top from data (visual decor riding on
//    the roof member, as the v10 crowns): {t:"stack", s:[[wq, h, colourKey, dq, dx, dz, stay, dy], ...], mast:h}  (wq, dq = share of the
//    roof's width / depth, dq defaults to wq; dx, dz = offset in metres). No text, no logo, no flag, no blue, no purple.
Object.assign(MEMBERS, {
  crW: { hp:30, density:450, fric:0.7, rest:0.06, dmg:1.2, armor:0, shatter:6, bond:"concrete", color:0xF4F1EA, ns:true, decor:true },   // white sail / shell
  crY: { hp:30, density:450, fric:0.7, rest:0.06, dmg:1.2, armor:0, shatter:6, bond:"concrete", color:0xF2C230, ns:true, decor:true },   // cube-house yellow
  crR: { hp:30, density:450, fric:0.7, rest:0.06, dmg:1.2, armor:0, shatter:6, bond:"concrete", color:0xD8412F, ns:true, decor:true },   // lighthouse / bridge red
  crK: { hp:30, density:450, fric:0.7, rest:0.06, dmg:1.2, armor:0, shatter:6, bond:"concrete", color:0x7FCBE0, ns:true, decor:true },   // glass tint (lighter than protected blue)
  lotpad: { hp:999, density:1000, fric:0.8, rest:0.02, dmg:0, armor:1, shatter:99, bond:"none", color:0xF2C230, ns:true, decor:true }   // the marked lot (ground paint)
});
["crW", "crY", "crR", "crK", "lotpad"].forEach(function(k){ MATS[k] = MATS.ledge; });
var l11Crown0 = l6Crown;
l6Crown = function(C, cx, cz, w, d, ry, fl){
  if(!C || C.t !== "stack") return l11Crown0(C, cx, cz, w, d, ry, fl);
  var host = null; for(var hi = blocks.length - 1; hi >= 0 && hi >= blocks.length - 400; hi--){ var hb = blocks[hi];
    if(!hb.anchor && !hb.keep && !(MEMBERS[hb.key] || {}).decor && Math.abs(hb.spawn.x - cx) <= w/2 + 0.6 && Math.abs(hb.spawn.z - cz) <= d/2 + 0.6 && hb.spawn.y + hb.half[1] <= ry + 0.6 && (!host || hb.spawn.y + hb.half[1] > host.spawn.y + host.half[1] + 0.01)) host = hb; }
  if(!host) return;
  var y = ry;
  (C.s || []).forEach(function(q){ var col = (MEMBERS[q[2] || "crC"] || {}).color || 0xffffff;
    l6KdAdd(host, "box", col, cx + (q[4] || 0), y + (q[7] || 0) + q[1]/2, cz + (q[5] || 0), w*q[0], q[1], d*(q[3] || q[0])); if(!q[6]) y += q[1]; });
  if(C.mast) l6KdAdd(host, "box", MEMBERS.crN.color, cx, y + C.mast/2, cz, 0.16, C.mast, 0.16);
};
// 3) a LEANING part (F02 "The Tilt"): P.lean = [kx, kz] metres of sideways shift per metre of height (0.08 = about 4.5 degrees).
//    Every member is moved by its centre height, so the stack is sheared storey by storey; bonds are made afterwards (linkAll) at
//    the sheared positions. A leaning tower falls towards its lean unless it is cut on the other side.
// 4) the marked LOT (lesson "Drop it in the lot"): ground paint only, {kind:"lot6", x, z, w, d}. The rule itself is the
//    street rule + the protected buildings round the lot (brief §6.6: no new metric).
var l11Mass0 = l6Mass;
function l11Mass(P){
  var n0 = blocks.length, R0 = P.roof, c0 = P.dress && L11_DRESS[P.dress.t] && R0 && R0.crown;   // a dressed part: the dress replaces the old visual crown (builds without v11 still show the crown)
  if(c0) R0.crown = null;
  var r = l11Mass0(P), k = P.lean;
  if(c0) R0.crown = c0;
  if(k) for(var i=n0;i<blocks.length;i++){ var b = blocks[i]; if(b.anchor) continue; var dx = (k[0] || 0)*b.spawn.y, dz = (k[1] || 0)*b.spawn.y;
    b.spawn.x += dx; b.spawn.z += dz; b.P.x += dx; b.P.z += dz; b.P0.copy(b.P); if(b.rb) b.rb.setTranslation({x:b.P.x, y:b.P.y, z:b.P.z}, false); }
  if(P.dress) l11Dress(P, n0);
  return r;
}
LANDMARK_BUILD.mass = l11Mass; V5_PARTS.mass = l11Mass;
V5_PARTS.lot6 = function(P){ var w = P.w || 8, d = P.d || 8, t = 0.5;
  addBlock(0, 0.02, 0, w, 0.04, d, "lotpad", {anchor:true});
  return {w:w, d:d}; };
// 5) a steel ARCH span between two pylons (F32 "Big Bow"): deck plates as deck6 (steel band: TNT cannot break it, it falls with the
//    pylons it is fixed to) + a VISUAL arch truss riding on the middle plate: two chords, posts, diagonals and hangers on each side,
//    cross ties over the top, and the road carried on past the pylons to the feet of the arch. The arch may be wider than the
//    physical span (span > len): it then passes in front of and behind the pylons (az = half the distance between the two trusses).
//    {kind:"arch6", x, z, y, len, wd, n, rise, span, az, depth}
V5_PARTS.arch6 = function(P){
  var n = P.n || 3, len = P.len, wd = P.wd || BAY, y = (P.y || 1)*FH - ST/2, seg = len/n, pl = [], k, rise = P.rise || 9, col = 0x4B4C57, dp = P.depth || 2.6;
  var sp = P.span || len, az = P.az || (wd/2 + 0.25), m = Math.max(10, 2*Math.round(sp/2.4)), yt = y + ST/2;
  for(k=0;k<n;k++) pl.push(v5Box(-len/2 + seg*(k + 0.5), y, 0, seg, ST, wd, "sdeck", (P.y || 1) - 1));
  var host = pl[Math.floor((n - 1)/2)], bar = function(x0, y0, z0, x1, y1, z1, th, tw){ l11Bar(host, col, x0, y0, z0, x1, y1, z1, th, tw); };
  var lo = function(x){ var u = 2*x/sp; return yt + rise*(1 - u*u); }, up = function(x){ var u = 2*x/sp; return yt + rise*(1 - u*u) + dp*(0.45 + 0.55*u*u) ; };
  [-1, 1].forEach(function(s){ var z = s*az;
    for(k=0;k<m;k++){ var x0 = -sp/2 + sp*k/m, x1 = -sp/2 + sp*(k + 1)/m;
      bar(x0, up(x0), z, x1, up(x1), z, 0.55, 0.4); bar(x0, lo(x0), z, x1, lo(x1), z, 0.5, 0.4);
      bar(x1, lo(x1), z, x1, up(x1), z, 0.2, 0.2); bar(x0, k % 2 ? up(x0) : lo(x0), z, x1, k % 2 ? lo(x1) : up(x1), z, 0.18, 0.18);
      if(k > 0 && lo(x0) - yt > 1) bar(x0, yt, s*(wd/2 - 0.1), x0, lo(x0), z, 0.14, 0.14); }
    bar(-sp/2, yt - 0.3, z, -sp/2, up(-sp/2), z, 0.5, 0.5); bar(sp/2, yt - 0.3, z, sp/2, up(sp/2), z, 0.5, 0.5);
    bar(-sp/2, yt + 0.5, s*(wd/2 - 0.1), sp/2, yt + 0.5, s*(wd/2 - 0.1), 0.16, 0.12); });
  for(k=1;k<m;k+=2){ var xc = -sp/2 + sp*k/m; if(up(xc) - yt > 6) bar(xc, up(xc), -az, xc, up(xc), az, 0.22, 0.22); }
  l6KdAdd(host, "box", 0x4F4B55, 0, yt + 0.06, 0, sp, 0.12, wd - 0.3); l6KdAdd(host, "box", 0x6A6C76, 0, yt - 0.3, 0, sp, 0.5, wd);
  [-1, 1].forEach(function(s){ l6KdAdd(host, "box", 0x6A6C76, s*sp/2, yt - 0.6, 0, 0.9, 1.4, 2*az + 0.6); });
  return {w:len, d:wd};
};
// 7) HERO DRESS (art pass 11/11, Figma sheets F1b-F6): P.dress = {t:"F17", ...} on a mass part (or a deck6 / arch6).
//    VISUAL ONLY: every piece is decor riding on ONE physical member of the part (a floor plate, a wall panel, or the part's
//    ground anchor for paving), exactly as the v10 crowns: no body, no collider, no bond, no rnd() call. The members, their
//    order and their strength are untouched, so a plan gives the same pose hash with and without the dress.
//    Rules kept so play stays honest: nothing that looks like a column at ground level, no shell over a wall face (a TNT
//    put on a face stays in sight): only roofs / crowns, thin bands at slab level, flush strips on panels, attachments
//    that stand clear of the faces (decks, cables, fins), low paving (<= 0.6 m) and member TINTS (b.tint).
var L11C = { sand:0xE3B963, sandD:0xC99A45, cream:0xF4ECD8, white:0xF7F4EC, grey:0xC9C7C2, greyD:0x8E9299, iron:0x4B4C57, slate:0x5F6470,
  teal:0x3F93A8, tealD:0x2F7A8E, glass:0x86CCDD, red:0xD8412F, brick:0xC9583A, terra:0xD9714A, gold:0xE9A13B, green:0x62A544, yellow:0xF2C230, road:0x4F4B55, cable:0xAEB4BE };
(function(){ var g = l6KdGeos(); g.rcone = new THREE.ConeGeometry(0.5, 1, 16, 1); g.sph = new THREE.SphereGeometry(0.5, 14, 10); })();
var L11_SLAB = { slab:1, tdeck:1, sdeck:1, wfloor:1, rcs:1 }, L11_WALL = { cpan:1, bkw:1, wwall:1, glass:1 }, L11_COL = { concrete:1, bk:1, wpost:1, steel:1, rc:1, core:1 };
function l11Bar(host, c, x0, y0, z0, x1, y1, z1, th, tw){
  var dx = x1 - x0, dy = y1 - y0, dz = z1 - z0, len = Math.sqrt(dx*dx + dy*dy + dz*dz) || 0.01;
  (host.kd = host.kd || []).push({ g:"box", c:c, o:new THREE.Vector3((x0 + x1)/2 - host.spawn.x, (y0 + y1)/2 - host.spawn.y, (z0 + z1)/2 - host.spawn.z),
    q:new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(1, 0, 0), new THREE.Vector3(dx/len, dy/len, dz/len)), s:new THREE.Vector3(len, th, tw || th) });
}
function l11Dress(P, n0){
  var D = P.dress, fn = L11_DRESS[D.t]; if(!fn) return;
  var all = [], mem = [], slabs = [], pan = [], i, b, nf = 0;
  for(i=n0;i<blocks.length;i++){ b = blocks[i]; if(b.anchor || b.keep) continue; all.push(b);
    if(L11_SLAB[b.key]){ slabs.push(b); mem.push(b); } else if(L11_WALL[b.key]){ pan.push(b); mem.push(b); } else if(L11_COL[b.key]){ mem.push(b); nf = Math.max(nf, b.floor + 1); } }
  if(!slabs.length) return;
  var S = { P:P, D:D, FH:P.fh || 2.7, all:all, mem:mem, slabs:slabs, pan:pan, base:blocks[n0], nf:nf, hy:null };
  S.B = function(f0, f1){ var q = {x0:1e9, x1:-1e9, y0:1e9, y1:-1e9, z0:1e9, z1:-1e9}; if(f1 == null) f1 = 99;
    mem.forEach(function(m){ if(m.floor < f0 || m.floor > f1) return; var p = m.spawn, h = m.half;
      q.x0 = Math.min(q.x0, p.x - h[0]); q.x1 = Math.max(q.x1, p.x + h[0]); q.y0 = Math.min(q.y0, p.y - h[1]); q.y1 = Math.max(q.y1, p.y + h[1]); q.z0 = Math.min(q.z0, p.z - h[2]); q.z1 = Math.max(q.z1, p.z + h[2]); });
    q.w = q.x1 - q.x0; q.d = q.z1 - q.z0; q.cx = (q.x0 + q.x1)/2; q.cz = (q.z0 + q.z1)/2; return q; };
  S.host = function(x, y, z){ var best = null, bc = 1e9; slabs.forEach(function(m){ var p = m.spawn, h = m.half;
      var c = Math.abs(y - p.y) + 0.5*(Math.max(0, Math.abs(x - p.x) - h[0]) + Math.max(0, Math.abs(z - p.z) - h[2])); if(c < bc){ bc = c; best = m; } }); return best; };
  S.add = function(g, c, x, y0, z, sx, h, sz, rx, ry, rz){ l6KdAdd(S.host(x, S.hy != null ? S.hy : y0, z), g, c, x, y0 + h/2, z, sx, h, sz, rx, ry, rz); };
  ["box", "cyl", "dome", "cone", "rcone", "sph", "prism"].forEach(function(g){ S[g] = function(c, x, y0, z, sx, h, sz, rx, ry, rz){ S.add(g, c, x, y0, z, sx, h, sz, rx, ry, rz); }; });
  S.bar = function(c, x0, y0, z0, x1, y1, z1, th, tw){ l11Bar(S.host((x0 + x1)/2, S.hy != null ? S.hy : Math.min(y0, y1), (z0 + z1)/2), c, x0, y0, z0, x1, y1, z1, th, tw); };
  S.ground = function(g, c, x, y0, z, sx, h, sz, rx, ry, rz){ l6KdAdd(S.base, g, c, x, y0 + h/2, z, sx, h, sz, rx, ry, rz); };
  // a tint; the floor plates carry the level's own band texture, so a "tinted" plate gets a flush cover over its edges instead
  S.tint = function(f){ all.forEach(function(m){ var c = f(m); if(c == null) return;
    if(m.key === "slab") l6KdAdd(m, "box", c, m.spawn.x, m.spawn.y, m.spawn.z, 2*m.half[0] + 0.13, 2*m.half[1] + 0.02, 2*m.half[2] + 0.13); else m.tint = c; }); };
  S.tintKeys = function(map, f0, f1){ S.tint(function(m){ return (f0 != null && (m.floor < f0 || m.floor > f1)) ? null : map[m.key]; }); };
  // a flush strip on a wall panel: (u, v) centre and (su, sv) size as shares of the panel's width / height, rot in the face plane
  S.strip = function(p, c, u, v, su, sv, rot){ var xn = p.half[0] < p.half[2], q = S.B(p.floor, p.floor), W = 2*(xn ? p.half[2] : p.half[0]), H = 2*p.half[1];
    var sg = xn ? (p.spawn.x > q.cx ? 1 : -1) : (p.spawn.z > q.cz ? 1 : -1), o = (xn ? p.half[0] : p.half[2]) + 0.03;
    if(xn) l6KdAdd(p, "box", c, p.spawn.x + sg*o, p.spawn.y + v*H, p.spawn.z + u*W, 0.07, sv*H, su*W, rot || 0, 0, 0);
    else l6KdAdd(p, "box", c, p.spawn.x + u*W, p.spawn.y + v*H, p.spawn.z + sg*o, su*W, sv*H, 0.07, 0, 0, rot || 0); };
  S.strips = function(test, f){ pan.forEach(function(p){ if(test(p)) f(p); }); };
  // a band round storey f at its slab level (grow = metres out on every side)
  S.band = function(c, f, grow, h, dy, g){ var q = S.B(f, f); S.add(g || "box", c, q.cx, (f + 1)*S.FH - h + (dy || 0), q.cz, q.w + 2*grow, h, q.d + 2*grow); };
  // a stepped stack on a roof: list of [wq, h, colour, dq] shares of (w, d); rim = a thin darker lip on each step. Returns the top y.
  S.steps = function(x, y, z, w, d, list, rim){ list.forEach(function(q){ S.box(q[2], x, y, z, w*q[0], q[1], d*(q[3] || q[0])); y += q[1];
      if(rim){ S.box(rim, x, y - 0.22, z, w*q[0] + 0.24, 0.22, d*(q[3] || q[0]) + 0.24); } }); return y; };
  fn(S);
}
var L11_DRESS = {};
// F17 Harp Span: grey pylon, a high road deck through it, harp cables to both sides
L11_DRESS.F17 = function(S){ var C = L11C, D = S.D, b = S.B(0), top = b.y1, dy = D.deck || 24, L = D.len || 16, wz = D.wz || 5.4, k;
  S.tintKeys({cpan:C.grey, slab:0xA9ABAF});
  S.hy = dy;
  S.box(C.road, 0, dy - 0.7, 0, 2*L, 0.7, wz);
  [-1, 1].forEach(function(s){ S.box(C.grey, 0, dy - 1.0, s*(wz/2), 2*L, 1.5, 0.4);
    for(k=1;k<=6;k++){ var x = L*(k/6) - 0.5, ya = top + 3.6 - (6 - k)*2.5; [-1, 1].forEach(function(sx){ S.bar(C.cable, sx*0.6, ya, s*1.0, sx*x, dy + 0.4, s*(wz/2 - 0.2), 0.24, 0.24); }); } });
  [-1, 1].forEach(function(sx){ S.box(C.greyD, sx*(L - 0.4), dy - 1.6, 0, 0.8, 0.9, wz + 0.4); });
  S.hy = top;
  S.box(C.grey, 0, top, 0, b.w*0.8, 2.8, b.d + 1.6); S.box(C.grey, 0, top + 2.8, 0, b.w*0.6, 1.6, b.d + 1.0); S.box(C.greyD, 0, top + 4.4, 0, b.w*0.95, 0.5, b.d + 1.8);
  S.hy = null; S.band(C.greyD, 1, 0.5, 0.5); };
// F28 Stripey Light: red / white bands, round gallery, glass lantern, dark dome, rock paving
L11_DRESS.F28 = function(S){ var C = L11C, b = S.B(0), top = b.y1, f, k, a, RD = 0xD9553A;
  S.tint(function(q){ var br = Math.floor(q.floor/2) % 2 === 0; if(q.key === "slab") return br ? RD : C.white; if(q.key === "cpan" || q.key === "concrete") return C.white; if(q.key === "bkw") return RD; return null; });
  for(f=0; f<S.nf-1; f++) S.cyl(Math.floor(f/2) % 2 === 0 ? RD : C.white, 0, (f + 1)*S.FH - 0.34, 0, 5.3, 0.36, 5.3);
  S.ground("cyl", C.greyD, 0, 0, 0, 10, 0.2, 10); S.ground("cyl", 0x9FA3AA, 0, 0.2, 0, 8, 0.28, 8);
  S.hy = top; var y = top; S.cyl(C.iron, 0, y, 0, 7.0, 0.45, 7.0); y += 0.45;
  for(k=0;k<12;k++){ a = k*Math.PI/6; var a2 = (k + 1)*Math.PI/6; S.box(C.iron, Math.cos(a)*3.3, y, Math.sin(a)*3.3, 0.16, 1.0, 0.16);
    S.bar(C.iron, Math.cos(a)*3.3, y + 1.0, Math.sin(a)*3.3, Math.cos(a2)*3.3, y + 1.0, Math.sin(a2)*3.3, 0.14, 0.14); }
  S.cyl(C.white, 0, y, 0, 3.8, 1.1, 3.8); y += 1.1; S.cyl(C.teal, 0, y, 0, 3.2, 2.8, 3.2);
  for(k=0;k<6;k++){ a = k*Math.PI/3; S.box(C.iron, Math.cos(a)*1.6, y, Math.sin(a)*1.6, 0.18, 2.8, 0.18); } y += 2.8;
  S.cyl(C.iron, 0, y, 0, 4.1, 0.3, 4.1); y += 0.3; S.dome(C.slate, 0, y, 0, 3.9, 2.2, 3.9); y += 2.2; S.sph(C.iron, 0, y - 0.2, 0, 0.8, 0.8, 0.8); S.box(C.iron, 0, y + 0.4, 0, 0.14, 1.1, 0.14); S.hy = null; };
// F30 The Sail: teal body with white floor lines, one white sail (two bowed ribs + a sheet) on one side, a mast
L11_DRESS.F30 = function(S){ var C = L11C, D = S.D, sd = D.side || -1, f0 = 0, k, n = 12;
  while(f0 < S.nf && !S.pan.some(function(p){ return p.floor === f0; })) f0++;
  var b = S.B(f0), yb = Math.max(f0*S.FH, S.FH), top = b.y1, H = top - yb, bul = D.bulge || 0.17*H, xe = sd < 0 ? b.x0 : b.x1, pts = [];
  S.tintKeys({cpan:C.teal, slab:C.white, concrete:C.white});
  for(k=0;k<=n;k++){ var t = k/n; pts.push([xe + sd*(0.35 + bul*Math.pow(Math.sin(Math.PI*Math.min(1, t*0.97)), 0.75)), yb + H*1.14*t]); }
  for(k=0;k<n;k++){ var p = pts[k], q = pts[k + 1];
    [-1, 1].forEach(function(s){ S.bar(C.white, p[0], p[1], s*(b.d/2 - 0.1), q[0], q[1], s*(b.d/2 - 0.1), 0.55, 0.55); });
    S.bar(0xECEBE4, p[0], p[1], 0, q[0], q[1], 0, 0.16, b.d - 0.5);
    if(k % 2 === 1 && p[1] < top) [-1, 1].forEach(function(s){ S.bar(C.white, xe, p[1], s*(b.d/2 - 0.1), p[0], p[1], s*(b.d/2 - 0.1), 0.22, 0.22); }); }
  S.hy = top; var tp = pts[n];
  S.box(C.white, b.cx, top, b.cz, b.w + 0.3, 0.5, b.d + 0.3); S.bar(C.white, xe + sd*0.3, tp[1] - 0.2, 0, b.cx, top + 0.4, 0, 0.5, 0.5);
  S.box(C.white, tp[0], tp[1] - 0.3, 0, 0.3, 7, 0.3); S.cyl(C.white, sd < 0 ? b.x1 + 1.2 : b.x0 - 1.2, top - 3.2, 0, 3.6, 0.35, 3.6); S.hy = null; };
// F14 Dome Hall: cream stone, cornices, a colonnaded drum and a big slate dome, small domes at the ends of a long roof
L11_DRESS.F14 = function(S){ var C = L11C, D = S.D, b = S.B(0), top = b.y1, m = Math.min(b.w, b.d), k, dc = D.c || 0x6B7280, f;
  S.tintKeys({cpan:C.cream, slab:0xDCD2BC});
  for(f=1; f<S.nf-1; f+=3) S.band(C.cream, f, 0.3, 0.4);
  S.hy = top; var y = top, Dd = D.dd || Math.max(Math.min(b.w, b.d*1.75), m*1.3, 4.8);
  S.box(C.cream, 0, y, 0, b.w + 1.0, 0.55, b.d + 1.0); y += 0.55;
  S.prism(C.cream, 0, y, b.z1 + 0.2, 0.7, 1.5, Math.min(b.w, 5.2), 0, Math.PI/2, 0);
  if(b.w > b.d*1.4) [-1, 1].forEach(function(s){ S.cyl(C.cream, s*(b.w/2 - 0.9), y, 0, 1.7, 0.9, 1.7); S.dome(dc, s*(b.w/2 - 0.9), y + 0.9, 0, 1.8, 1.2, 1.8); });
  S.cyl(C.cream, 0, y, 0, Dd + 0.9, 0.5, Dd + 0.9); y += 0.5; S.cyl(0xE6DCC6, 0, y, 0, Dd - 0.5, 2.8, Dd - 0.5);
  for(k=0;k<12;k++){ var a = k*Math.PI/6 + 0.26; S.cyl(C.white, Math.cos(a)*(Dd/2 + 0.05), y, Math.sin(a)*(Dd/2 + 0.05), 0.4, 2.8, 0.4); } y += 2.8;
  S.cyl(C.cream, 0, y, 0, Dd + 1.0, 0.45, Dd + 1.0); y += 0.45; S.dome(dc, 0, y, 0, Dd + 0.3, Dd*0.6, Dd + 0.3); y += Dd*0.6;
  S.cyl(C.cream, 0, y - 0.25, 0, 1.2, 1.3, 1.2); y += 1.05; S.dome(dc, 0, y, 0, 1.5, 0.9, 1.5); y += 0.9; S.box(C.gold, 0, y - 0.1, 0, 0.16, 1.0, 0.16); S.hy = null; };
// F21 The Pedestal: a blank sandstone plinth with pilasters and a heavy flat top (no statue), a low star wall round it
L11_DRESS.F21 = function(S){ var C = L11C, b = S.B(0), top = b.y1, k;
  S.tintKeys({cpan:C.sand, slab:C.sandD});
  S.strips(function(p){ return p.key === "cpan"; }, function(p){ S.strip(p, C.sandD, -0.3, 0, 0.1, 0.94); S.strip(p, C.sandD, 0.3, 0, 0.1, 0.94); });
  S.band(C.sandD, 1, 0.45, 0.55); S.band(C.sand, 1, 0.25, 0.3, 0.3);
  S.hy = top; S.steps(0, top, 0, 1, 1, [[(b.w + 0.7)/1, 0.6, C.sandD, (b.d + 0.7)/1], [b.w + 1.7, 0.9, C.sand, b.d + 1.7], [b.w + 2.4, 0.7, C.sandD, b.d + 2.4], [b.w + 1.2, 1.5, C.sand, b.d + 1.2], [b.w + 1.8, 0.5, C.sandD, b.d + 1.8]]); S.hy = null;
  S.ground("box", C.green, 0, 0, 0, 9.4, 0.1, 9.4); S.ground("box", C.green, 0, 0, 0, 9.4, 0.1, 9.4, 0, Math.PI/4, 0);
  for(k=0;k<8;k++){ var a = k*Math.PI/4, r = 4.7; S.ground("box", k % 2 ? C.sand : C.sandD, Math.cos(a)*r, 0, Math.sin(a)*r, 0.5, 0.75, 9.4 + 0.5, 0, -a, 0); } };
// F24 The Doorstop: brick wedge block: cream bands and cornice, a cream stone prow with a flat-cut nose on one end, a slate roof
L11_DRESS.F24 = function(S){ var C = L11C, D = S.D, sd = D.side || -1, b = S.B(0, 8), top = b.y1, f, st = 0xEFE3C8, PR = [[1.3, 0.86], [1.3, 0.66], [1.3, 0.46], [1.2, 0.3]], pl = 5.1;
  S.tint(function(q){ if(q.key === "slab") return (q.floor % 3 === 0 || q.floor >= 8) ? st : 0xC66A48; if(q.floor === 9 && q.key === "bkw") return C.slate; return null; });
  [0, 3, 6].forEach(function(f){ S.band(st, f, 0.3, 0.4); }); S.band(st, 8, 0.6, 0.6); S.band(st, 8, 0.35, 0.35, -0.6);
  var xe = sd < 0 ? b.x0 : b.x1;
  for(f=1; f<=8; f++){ var y0 = f*S.FH, hh = S.FH, xo = 0; S.hy = y0 + hh;
    PR.forEach(function(q, i){ var lo = (f === 1) ? i*1.0 : 0, last = i === PR.length - 1, wy = y0 + Math.max(lo, 0.9), wh = Math.min(2.2, hh - Math.max(lo, 0.9) - 0.4);
      S.box(st, xe + sd*(xo + q[0]/2), y0 + lo, 0, q[0] + 0.02, hh - lo, b.d*q[1]);
      if(last) S.box(C.tealD, xe + sd*(xo + q[0] + 0.02), wy, 0, 0.08, wh, b.d*q[1]*0.5);
      else [-1, 1].forEach(function(s){ S.box(C.tealD, xe + sd*(xo + q[0]/2), wy, s*(b.d*q[1]/2 + 0.02), 0.6, wh, 0.06); });
      xo += q[0]; });
    if(f % 3 === 0 || f === 8) S.box(st, xe + sd*pl/2, y0 + hh - 0.35, 0, pl + 0.3, 0.35, b.d*0.92); }
  S.hy = top; var xq = 0; PR.forEach(function(q, i){ S.box(C.slate, xe + sd*(xq + q[0]/2), top, 0, q[0], 1.2 - i*0.2, b.d*q[1]*0.88); xq += q[0]; });
  var t = S.B(9, 9), free = sd < 0 ? [t.x1, b.x1] : [b.x0, t.x0]; if(free[1] - free[0] > 1) S.box(C.slate, (free[0] + free[1])/2, top + 0.25, 0, free[1] - free[0] - 0.5, 1.0, b.d - 0.9);
  S.hy = null; };
// F35 Cube Grove: a yellow cube standing on its point on one grey pier: pointed slate roof, a yellow point under it, teal windows
L11_DRESS.F35 = function(S){ var C = L11C, b = S.B(1), top = b.y1, lo = S.B(0, 0).y1;
  S.tintKeys({bkw:C.yellow, bk:0xE8B523, slab:0xDDAE1E});
  S.strips(function(p){ return p.key === "bkw" && 2*p.half[1] > 2; }, function(p){ S.strip(p, C.tealD, 0, 0.05, 0.42, 0.42); });
  S.hy = top; S.box(0x8F939B, 0, top, 0, b.w + 0.3, 0.25, b.d + 0.3); S.cone(0x9A9EA7, 0, top + 0.25, 0, b.w + 0.1, 3.6, b.d + 0.1);
  S.hy = lo; S.cone(0xDDAE1E, 0, lo - 0.36 - 2.7, 0, b.w - 0.5, 2.7, b.d - 0.5, Math.PI, 0, 0); S.hy = null; };
// F32 Big Bow: a sandstone bridge pylon with a stepped top (the steel arch is the arch6 part)
L11_DRESS.F32 = function(S){ var C = L11C, b = S.B(0), top = b.y1;
  S.tintKeys({cpan:C.sand, slab:C.sandD});
  S.strips(function(p){ return p.key === "cpan" && p.floor >= 3; }, function(p){ if(p.floor % 3 === 0) S.strip(p, 0x8A6A32, 0, 0, 0.22, 0.6); });
  S.band(C.sandD, 1, 0.4, 0.5); S.band(C.sandD, S.nf - 1, 0.45, 0.5);
  S.hy = top; S.steps(0, top, 0, b.w, b.d, [[0.86, 2.2, C.sand], [0.62, 2.0, C.sand], [0.4, 1.6, C.sand], [0.22, 1.2, C.sandD]], C.sandD); S.hy = null; };
// F22 The Stepper: tan setback tower: steps down both sides, pilasters, a teal lantern and a small gold cap
L11_DRESS.F22 = function(S){ var C = L11C, lo = S.B(0, 3), up = S.B(4), top = up.y1, y = lo.y1;
  S.tintKeys({cpan:C.sand, slab:C.sandD});
  S.strips(function(p){ return p.key === "cpan" && 2*p.half[1] > 2; }, function(p){ S.strip(p, C.sandD, 0, 0, 0.12, 0.94); });
  S.band(C.sandD, 3, 0.3, 0.45);
  [-1, 1].forEach(function(s){ var x0 = s < 0 ? lo.x0 : up.x1, x1 = s < 0 ? up.x0 : lo.x1, wf = x1 - x0, xi = s < 0 ? x1 : x0; if(wf < 1) return; S.hy = y;
    S.box(C.sand, xi + s*(wf*0.86)/2, y, 0, wf*0.86, 5.0, lo.d - 0.5); S.box(C.sandD, xi + s*(wf*0.86)/2, y + 5.0, 0, wf*0.86 + 0.2, 0.25, lo.d - 0.3);
    S.box(C.sand, xi + s*(wf*0.5)/2, y + 5.25, 0, wf*0.5, 4.2, lo.d - 1.3); S.box(C.sandD, xi + s*(wf*0.5)/2, y + 9.45, 0, wf*0.5 + 0.2, 0.25, lo.d - 1.1);
    S.box(C.sand, xi + s*(wf*0.2)/2, y + 9.7, 0, wf*0.2, 3.4, lo.d - 2.0); });
  S.hy = top; y = S.steps(up.cx, top, 0, up.w, up.d, [[0.84, 2.8, C.sand], [0.64, 2.6, C.sand]], C.sandD);
  S.box(C.teal, up.cx, y, 0, up.w*0.46, 2.6, up.d*0.46); [-1, 1].forEach(function(a){ [-1, 1].forEach(function(c){ S.box(C.sand, up.cx + a*up.w*0.23, y, c*up.d*0.23, 0.3, 2.6, 0.3); }); }); y += 2.6;
  y = S.steps(up.cx, y, 0, up.w, up.d, [[0.56, 0.5, C.sandD], [0.36, 1.2, C.sand], [0.2, 0.9, C.gold]]); S.hy = null; };
// F26 The Pencil: a cream needle tower with a long pyramid point and ONE wing (a stepped fin high on one side)
L11_DRESS.F26 = function(S){ var C = L11C, D = S.D, sd = D.side || 1, t = S.B(4), top = t.y1, cr = 0xF0E6D0, k;
  S.tint(function(q){ if(q.floor < 4) return null; return q.key === "cpan" ? cr : q.key === "slab" ? 0xDCCFB2 : q.key === "concrete" ? cr : null; });
  S.strips(function(p){ return p.key === "cpan" && p.floor >= 4; }, function(p){ S.strip(p, C.teal, 0, 0, 0.26, 0.9); });
  S.hy = top; S.box(cr, t.cx, top, t.cz, t.w + 0.4, 0.5, t.d + 0.4); S.cone(cr, t.cx, top + 0.5, t.cz, t.w + 0.1, 13, t.d + 0.1);
  S.cone(C.teal, t.cx, top + 0.5, t.cz + t.d*0.36, t.w*0.3, 9, 0.5); S.cone(C.teal, t.cx, top + 0.5, t.cz - t.d*0.36, t.w*0.3, 9, 0.5);
  var xe = sd > 0 ? t.x1 : t.x0, y0 = top - 15;
  [[4.6, 3.4], [3.5, 3.4], [2.4, 3.4], [1.4, 3.2], [0.6, 2.6]].forEach(function(q, i){ S.hy = y0; S.box(cr, xe + sd*q[0]/2, y0, t.cz, q[0], q[1], 1.5);
    S.box(C.teal, xe + sd*q[0]/2, y0 + 0.5, t.cz, q[0]*0.7, q[1] - 1.0, 1.56); S.box(0xDCCFB2, xe + sd*q[0]/2, y0 + q[1] - 0.25, t.cz, q[0] + 0.25, 0.25, 1.75); y0 += q[1]; });
  S.hy = null; };
// F34 Tube Bundle: FIVE square tubes of five heights (smoky glass, dark rims)
L11_DRESS.F34 = function(S){ var C = L11C, sm = 0x5F8090, dk = 0x3A444D, b = S.B(0, 3), t1 = S.B(4, 6), t2 = S.B(7), bw = (b.w)/2, y16 = b.y1, zf = b.z1 - bw/2, xl = b.x0 + bw/2, xr = b.x1 - bw/2;
  S.tintKeys({cpan:sm, slab:dk});
  var tube = function(x, z, y, w, d, h){ S.hy = y; if(h > 0){ S.box(sm, x, y, z, w - 0.1, h, d - 0.1); var k; for(k=4; k<h - 0.5; k+=4) S.box(dk, x, y + k - 0.3, z, w, 0.3, d); } S.box(dk, x, y + h, z, w + 0.2, 0.45, d + 0.2); S.box(0x2B333A, x, y + h + 0.45, z, w - 0.7, 0.12, d - 0.7); };
  tube(t2.cx, t2.cz, t2.y1, t2.w, t2.d, 0);
  tube(xl, t1.cz, t1.y1, bw, t1.d, 4);
  tube(xr, zf, y16, bw, bw, 8);
  tube(xl - bw/4, zf, y16, bw/2, bw, 2); tube(xl + bw/4, zf, y16, bw/2, bw, 5);
  S.strips(function(p){ return p.key === "cpan" && 2*p.half[1] > 2; }, function(p){ S.strip(p, 0x7FA0AE, 0, 0, 0.5, 0.7); });
  S.hy = null; };
// F16 Deco Needle: grey stone tower, dark window strips, a long stepped crown and a needle
L11_DRESS.F16 = function(S){ var C = L11C, b = S.B(0), top = b.y1, f;
  S.tintKeys({cpan:C.grey, slab:0xB3B1AC});
  S.strips(function(p){ return p.key === "cpan" && 2*p.half[1] > 2; }, function(p){ S.strip(p, 0x5E6A75, -0.2, 0, 0.14, 0.86); S.strip(p, 0x5E6A75, 0.2, 0, 0.14, 0.86); });
  S.strips(function(p){ return p.key === "cpan" && 2*p.half[1] <= 2; }, function(p){ S.strip(p, C.greyD, 0, 0, 0.12, 0.9); });
  for(f=2; f<S.nf-1; f+=3) S.band(0xB3B1AC, f, 0.22, 0.35);
  S.hy = top; var y = S.steps(0, top, 0, b.w, b.d, [[1.1, 0.5, 0xB3B1AC], [0.88, 2.8, C.grey], [0.74, 2.6, C.grey], [0.6, 2.6, C.grey], [0.46, 2.4, C.grey], [0.33, 2.4, C.grey], [0.21, 2.2, C.grey], [0.12, 1.8, C.greyD]], 0xB3B1AC);
  [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function(q){ S.box(0x5E6A75, q[0]*b.w*0.44, top + 0.9, q[1]*b.d*0.44, q[0] ? 0.06 : b.w*0.3, 1.8, q[0] ? b.d*0.3 : 0.06); });
  S.box(C.greyD, 0, y, 0, 0.24, 6.5, 0.24); S.hy = null; };
// F06 Glass Point: a stepped glass pyramid: teal steps with grey frames up the setback and the top, small planters
L11_DRESS.F06 = function(S){ var C = L11C, D = S.D, lo = S.B(0, 4), up = S.B(5), top = up.y1, y = lo.y1, fr = 0x8D9AA3, f, hs = D.hs || [3.6, 3.2], ht = D.ht || [[0.8, 2.4], [0.58, 2.4], [0.36, 2.2], [0.18, 1.6]];
  S.tintKeys({slab:fr});
  for(f=0; f<S.nf; f++) S.band(fr, f, 0.14, 0.3);
  var x0 = up.x1, wf = lo.x1 - up.x1;
  if(wf > 1){ S.hy = y; S.box(C.glass, x0 + wf*0.86/2, y, 0, wf*0.86, hs[0], lo.d - 0.5); S.box(fr, x0 + wf*0.86/2, y + hs[0], 0, wf*0.86 + 0.24, 0.24, lo.d - 0.26);
    S.box(C.glass, x0 + wf*0.48/2, y + hs[0] + 0.24, 0, wf*0.48, hs[1], lo.d - 1.3); S.box(fr, x0 + wf*0.48/2, y + hs[0] + 0.24 + hs[1], 0, wf*0.48 + 0.24, 0.24, lo.d - 1.06);
    if(D.planters !== 0) [-1, 1].forEach(function(s){ S.box(C.green, x0 + wf*0.86 - 0.35, y + hs[0] + 0.24, s*(lo.d/2 - 0.7), 0.55, 0.5, 0.55); }); }
  S.hy = top; y = S.steps(up.cx, top, up.cz, up.w, up.d, ht.map(function(q){ return [q[0], q[1], C.glass]; }), fr);
  if(D.planters !== 0) [-1, 1].forEach(function(s){ S.box(C.green, up.cx + s*(up.w*0.44), top, 0, 0.5, 0.5, 0.5); });
  if(D.needle) S.box(fr, up.cx, y, up.cz, 0.24, D.needle, 0.24); else S.box(fr, up.cx, y, up.cz, up.w*0.2, 0.3, up.d*0.2); S.hy = null; };
// F12 Sky Steps: the F06 steps, taller, with a needle (a super-tall setback glass tower)
L11_DRESS.F12 = function(S){ S.D = Object.assign({ hs:[6.5, 5.5], ht:[[0.82, 4.2], [0.62, 4.2], [0.44, 3.6], [0.28, 3.2], [0.14, 2.6]], needle:7, planters:0 }, S.D); L11_DRESS.F06(S); };
// F25 The Bullet: round bands on a glass body, a grey diagonal grid on the panes, a tall rounded glass nose
L11_DRESS.F25 = function(S){ var C = L11C, b = S.B(0), top = b.y1, f, R = Math.max(b.w, b.d)*1.6;
  for(f=0; f<S.nf-1; f++) S.cyl(C.greyD, 0, (f + 1)*S.FH - 0.3, 0, R, 0.3, R);
  S.strips(function(p){ return p.key === "glass"; }, function(p){ var W = 2*Math.max(p.half[0], p.half[2]), H = 2*p.half[1], a = Math.atan2(H, W), L = Math.sqrt(W*W + H*H)/W*0.96, xn = p.half[0] < p.half[2];
    S.strip(p, C.greyD, 0, 0, L, 0.2/H, xn ? -a : a); S.strip(p, C.greyD, 0, 0, L, 0.2/H, xn ? a : -a); });
  S.hy = top; S.cyl(C.greyD, 0, top, 0, R + 0.2, 0.5, R + 0.2); S.dome(C.glass, 0, top + 0.5, 0, R, 6.8, R);
  var k; for(k=0;k<8;k++){ var a = k*Math.PI/4, r = R/2; S.bar(C.greyD, Math.cos(a)*r, top + 0.5, Math.sin(a)*r, Math.cos(a + 0.5)*r*0.72, top + 4.2, Math.sin(a + 0.5)*r*0.72, 0.16, 0.16); S.bar(C.greyD, Math.cos(a)*r, top + 0.5, Math.sin(a)*r, Math.cos(a - 0.5)*r*0.72, top + 4.2, Math.sin(a - 0.5)*r*0.72, 0.16, 0.16); }
  S.dome(C.greyD, 0, top + 6.9, 0, 1.3, 0.7, 1.3); S.hy = null; };
// F31 The Splinter: a glass shard: one very long pointed top with a second, split tip beside it
L11_DRESS.F31 = function(S){ var C = L11C, b = S.B(0), top = b.y1, f, fr = 0x8D9AA3;
  S.tintKeys({slab:fr}); for(f=1; f<S.nf-1; f+=2) S.band(fr, f, 0.12, 0.25);
  S.hy = top; S.box(fr, 0, top, 0, b.w + 0.3, 0.4, b.d + 0.3);
  S.cone(C.glass, -b.w*0.12, top + 0.4, b.d*0.1, b.w*0.8, 15, b.d*0.8); S.cone(0x4A9DB4, b.w*0.24, top + 0.4, -b.d*0.2, b.w*0.52, 18.5, b.d*0.52);
  S.cone(0x57AEC2, -b.w*0.3, top + 0.4, -b.d*0.3, b.w*0.36, 8, b.d*0.36); S.hy = null; };
// F07 Sister Spires: glass tower with a stepped deco crown and a mast
L11_DRESS.F07 = function(S){ var C = L11C, b = S.B(0), top = b.y1, f, fr = 0x8D9AA3;
  S.tintKeys({slab:fr}); for(f=2; f<S.nf-1; f+=3) S.band(fr, f, 0.14, 0.3); S.band(C.grey, 0, 0.3, 0.45);
  S.hy = top; var y = S.steps(0, top, 0, b.w, b.d, [[1.06, 0.4, fr], [0.84, 2.6, C.glass], [0.64, 2.6, C.glass], [0.44, 2.4, C.glass], [0.26, 2.2, C.glass]], fr);
  [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(function(q){ S.box(fr, q[0]*b.w*0.4, top + 0.4, q[1]*b.d*0.4, 0.4, 3.4, 0.4); });
  S.box(C.greyD, 0, y, 0, 0.22, 4.5, 0.22); S.hy = null; };
// F01 Old Tock: brick clock tower: cream bands, a big clock stage with four white faces, a slate pyramid roof, a gold ball
L11_DRESS.F01 = function(S){ var C = L11C, b = S.B(0), top = b.y1, cr = 0xF0E3C4, f, w = b.w + 0.7, d = b.d + 0.7;
  S.tint(function(q){ return q.key === "slab" ? ((q.floor % 4 === 2 || q.floor === 0) ? cr : C.brick) : null; });
  for(f=2; f<S.nf-1; f+=4) S.band(cr, f, 0.28, 0.42); S.band(cr, 0, 0.3, 0.45);
  S.hy = top; var y = top; S.box(cr, 0, y, 0, b.w + 1.1, 0.55, b.d + 1.1); y += 0.55;
  var h = 5.0; S.box(C.brick, 0, y, 0, w - 0.3, h, d - 0.3); [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(function(q){ S.box(cr, q[0]*(w/2 - 0.3), y, q[1]*(d/2 - 0.3), 0.7, h, 0.7); });
  var r = Math.min(w, d) - 1.25;
  [[0, 1], [0, -1], [1, 0], [-1, 0]].forEach(function(q){ var ax = q[0] !== 0, px = q[0]*(w/2 - 0.12), pz = q[1]*(d/2 - 0.12), yc = y + h/2;
    S.cyl(C.gold, px, yc - 0.05, pz, r + 0.34, 0.1, r + 0.34, ax ? 0 : Math.PI/2, 0, ax ? Math.PI/2 : 0);
    S.cyl(C.white, px + q[0]*0.06, yc - 0.05, pz + q[1]*0.06, r, 0.1, r, ax ? 0 : Math.PI/2, 0, ax ? Math.PI/2 : 0);
    S.box(C.iron, px + q[0]*0.13, yc, pz + q[1]*0.13, ax ? 0.05 : 0.14, r*0.42, ax ? 0.14 : 0.05);
    S.box(C.iron, px + q[0]*0.13 + (ax ? 0 : r*0.15), yc - 0.07, pz + q[1]*0.13 + (ax ? r*0.15 : 0), ax ? 0.05 : r*0.3, 0.14, ax ? r*0.3 : 0.05); });
  y += h; S.box(cr, 0, y, 0, b.w + 1.3, 0.55, b.d + 1.3); y += 0.55; S.cone(C.slate, 0, y, 0, b.w + 1.0, 6.5, b.d + 1.0); y += 6.5;
  S.sph(C.gold, 0, y - 0.5, 0, 0.9, 0.9, 0.9); S.box(C.gold, 0, y + 0.3, 0, 0.14, 1.3, 0.14); S.hy = null; };
// F19 Stack Tower: five flared segments parted by dark bands, a flat dark top (no temple roofs)
L11_DRESS.F19 = function(S){ var C = L11C, b = S.B(0), top = b.y1, k, dk = 0x4E525C;
  S.tint(function(q){ return (q.key === "crT" || q.key === "slab") ? dk : null; });
  for(k=0;k<5;k++){ var y = (2*k + 2)*S.FH; S.hy = y; S.box(C.tealD, 0, y - 1.5, 0, b.w + 0.7, 1.05, b.d + 0.7); S.box(C.teal, 0, y - 2.6, 0, b.w + 0.3, 1.1, b.d + 0.3);
    S.box(dk, 0, y - 0.45, 0, b.w + 1.5, 0.5, b.d + 1.5); S.hy = null; if(k > 0) S.strips(function(p){ return p.floor === 2*k && 2*p.half[1] > 2; }, function(p){ S.strip(p, C.teal, 0, -0.05, 0.6, 0.5); }); }
  S.hy = top; S.box(dk, 0, top, 0, b.w + 0.9, 0.7, b.d + 0.9); S.box(0x3A3D45, 0, top + 0.7, 0, b.w*0.5, 0.5, b.d*0.5); S.hy = null; };
// F04 Sky Saucer: grey shaft, a wide glass disc, a stem, a smaller roofed disc, an antenna
L11_DRESS.F04 = function(S){ var C = L11C, b = S.B(0), top = b.y1, y = top;
  S.tintKeys({cpan:C.grey, slab:C.greyD});
  S.ground("cyl", C.grey, 0, 0, 0, 8.4, 0.3, 8.4);
  S.hy = top; S.cyl(C.grey, 0, y, 0, 4.4, 0.9, 4.4); y += 0.9; S.cyl(C.grey, 0, y, 0, 8.0, 0.8, 8.0); y += 0.8; S.cyl(C.greyD, 0, y, 0, 12.4, 0.5, 12.4); y += 0.5;
  S.cyl(C.teal, 0, y, 0, 11.6, 2.5, 11.6); var k; for(k=0;k<16;k++){ var a = k*Math.PI/8; S.box(C.greyD, Math.cos(a)*5.82, y, Math.sin(a)*5.82, 0.18, 2.5, 0.18, 0, -a, 0); } y += 2.5;
  S.cyl(C.grey, 0, y, 0, 12.8, 0.5, 12.8); y += 0.5; S.cyl(0xE0863F, 0, y, 0, 11.6, 0.08, 11.6);
  for(k=0;k<16;k++){ a = k*Math.PI/8; S.box(C.greyD, Math.cos(a)*6.2, y, Math.sin(a)*6.2, 0.14, 0.8, 0.14); }
  S.cyl(C.grey, 0, y, 0, 2.8, 3.4, 2.8); y += 3.4; S.cyl(C.grey, 0, y, 0, 6.0, 0.6, 6.0); y += 0.6; S.cyl(C.greyD, 0, y, 0, 9.0, 0.4, 9.0); y += 0.4;
  S.cyl(C.teal, 0, y, 0, 7.6, 1.5, 7.6); y += 1.5; S.cyl(C.greyD, 0, y, 0, 9.6, 0.3, 9.6); y += 0.3; S.rcone(0x7B8089, 0, y, 0, 9.2, 1.7, 9.2); y += 1.5;
  S.cyl(C.greyD, 0, y, 0, 0.5, 1.2, 0.5); S.box(C.iron, 0, y + 1.2, 0, 0.16, 4.2, 0.16); S.hy = null; };
// F03 Rivet Tower: dark iron lattice: cross bracing between the steel legs, a ring deck, a closing lattice top, a glass cabin
L11_DRESS.F03 = function(S){ var C = L11C, b = S.B(0), top = b.y1, f, lt = 0x70757F, dkk = 0x565862, k;
  var nl = 0; while(nl < S.nf && !S.pan.some(function(p){ return p.floor === nl; })) nl++;
  S.tintKeys({cpan:dkk, slab:0x44464F});
  for(f=0; f<nl; f++){ var y0 = f*S.FH + 0.1, y1 = (f + 1)*S.FH - 0.5; S.hy = y1 + 0.4;
    [-1, 1].forEach(function(s){ var z = s*(b.d/2 - 0.25), x = s*(b.w/2 - 0.25);
      S.bar(lt, b.x0 + 0.4, y0, z, b.x1 - 0.4, y1, z, 0.17, 0.17); S.bar(lt, b.x1 - 0.4, y0, z, b.x0 + 0.4, y1, z, 0.17, 0.17);
      S.bar(lt, x, y0, b.z0 + 0.4, x, y1, b.z1 - 0.4, 0.17, 0.17); S.bar(lt, x, y0, b.z1 - 0.4, x, y1, b.z0 + 0.4, 0.17, 0.17); }); }
  S.strips(function(p){ return p.key === "cpan"; }, function(p){ var W = 2*Math.max(p.half[0], p.half[2]), H = 2*p.half[1], a = Math.atan2(H, W), L = Math.sqrt(W*W + H*H)/W*0.96, xn = p.half[0] < p.half[2];
    S.strip(p, 0x8A8F9A, 0, 0, L, 0.2/H, xn ? -a : a); S.strip(p, 0x8A8F9A, 0, 0, L, 0.2/H, xn ? a : -a); });
  var yd = nl*S.FH; S.hy = yd; S.cyl(C.iron, 0, yd - 1.05, 0, 9.2, 0.35, 9.2); S.cyl(C.teal, 0, yd - 0.7, 0, 8.4, 1.15, 8.4); S.cyl(C.iron, 0, yd + 0.45, 0, 9.4, 0.3, 9.4);
  for(k=0;k<12;k++){ var a = k*Math.PI/6; S.box(C.iron, Math.cos(a)*4.55, yd + 0.75, Math.sin(a)*4.55, 0.14, 0.8, 0.14); }
  [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(function(q){ S.bar(lt, q[0]*(b.w/2 - 0.2), yd - 4.6, q[1]*(b.d/2 - 0.2), q[0]*3.0, yd - 1.05, q[1]*3.0, 0.22, 0.22); });
  S.hy = top; var y = top; S.box(C.iron, 0, y, 0, b.w + 0.5, 0.35, b.d + 0.5); y += 0.35;
  var st = [[b.w/2 - 0.2, 0.95, 4.2], [0.95, 0.5, 3.6]];
  st.forEach(function(q){ [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(function(c){ S.bar(C.iron, c[0]*q[0], y, c[1]*q[0], c[0]*q[1], y + q[2], c[1]*q[1], 0.28, 0.28); });
    [-1, 1].forEach(function(s){ S.bar(lt, -q[0], y, s*q[0], q[1], y + q[2], s*q[1], 0.14, 0.14); S.bar(lt, q[0], y, s*q[0], -q[1], y + q[2], s*q[1], 0.14, 0.14);
      S.bar(lt, s*q[0], y, -q[0], s*q[1], y + q[2], q[1], 0.14, 0.14); S.bar(lt, s*q[0], y, q[0], s*q[1], y + q[2], -q[1], 0.14, 0.14); });
    y += q[2]; S.box(C.iron, 0, y, 0, q[1]*2 + 0.9, 0.25, q[1]*2 + 0.9); y += 0.25; });
  S.cyl(C.iron, 0, y, 0, 3.0, 0.3, 3.0); y += 0.3; S.cyl(C.teal, 0, y, 0, 2.5, 2.2, 2.5); y += 2.2; S.cyl(C.iron, 0, y, 0, 3.0, 0.3, 3.0); y += 0.3; S.rcone(C.iron, 0, y, 0, 2.4, 1.0, 2.4); y += 0.9; S.box(C.iron, 0, y, 0, 0.16, 4.2, 0.16); S.hy = null; };
// ---- 8) L1-12 heroes (12/11/2026, decision D-blast-HERO-PROC: the hero is built to LOOK LIKE its Figma tile first; difficulty is tuned
//    with what stands round it, never with the hero). Two things:
//    a) KIT heroes: a mass part with P.kit = { base:[w, d], m:[[key, x, y, z, sx, sy, sz, floor, gi, gj], ...], rock:[[x, y, z, sx, sy, sz], ...] }
//       is built from that explicit member list (tools/src-l1-12.js makes it: box / octagon storeys with their own size, so a shaft can
//       taper and step). Every member is an ordinary block (axis-aligned, bonded by contact in linkAll); `rock` = fixed ground (anchor)
//       the hero stands on. P.tiers stays as the plain fallback for a build without v11.
//    b) K-dresses: roofs, sails, domes, bands, the diagonal faces of an octagon, window strips, tints. Visual decor riding on members,
//       as §7 (no body, no bond, no rnd() call). P.tab = the storey table of the kit [{y0, y1, fl, w, d, r, x, z, mat, tag}].
var l12kMass0 = V5_PARTS.mass;
function l12kMass(P){ var K = P.kit; if(!K) return l12kMass0(P);
  var n0 = blocks.length, B = K.base || [6, 6];
  addBlock(0, -0.25, 0, B[0], 0.5, B[1], "base", {anchor:true});
  (K.rock || []).forEach(function(q){ addBlock(q[0], q[1], q[2], q[3], q[4], q[5], "base", {anchor:true}); });
  (K.m || []).forEach(function(q){ var b = addBlock(q[1], q[2], q[3], q[4], q[5], q[6], q[0], {floor:q[7] || 0}); if(q[8] != null){ b.gi = q[8]; b.gj = q[9]; } });
  if(P.dress) l11Dress(P, n0);
  return {w:B[0], d:B[1]}; }
LANDMARK_BUILD.mass = l12kMass; V5_PARTS.mass = l12kMass;
function l12Win(S, c, test, su, sv, v, u){ S.strips(function(p){ return 2*p.half[1] > 1.6 && (!test || test(p)); }, function(p){ S.strip(p, c, u || 0, v == null ? 0.04 : v, su || 0.3, sv || 0.5); }); }
// a solid eight-sided prism (four boxes), centre to flat = r; and the four diagonal wall faces of an octagon storey t (the axis faces are members)
function l12Oct(S, c, x, y0, z, r, h, g){ var a = r*0.4142, k; for(k=0;k<4;k++){ if(g) S.ground("box", c, x, y0, z, 2*r, h, 2*a, 0, k*Math.PI/4, 0); else S.box(c, x, y0, z, 2*r, h, 2*a, 0, k*Math.PI/4, 0); } }
function l12Diag(S, t, c, th, y0, y1, grow){ var r = t.r + (grow || 0), a = r*0.4142, len = (r - a)*1.4142 + 0.05, m = (r + a)/2 - (th || 0.22)*0.354;
  [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(function(q){ S.box(c, t.x + q[0]*m, y0 == null ? t.y0 : y0, t.z + q[1]*m, len, (y1 == null ? t.y1 - 0.36 : y1) - (y0 == null ? t.y0 : y0), th || 0.22, 0, q[0]*q[1] > 0 ? Math.PI/4 : -Math.PI/4, 0); }); }
// a ring of posts and a top rail (a gallery railing) at radius r
function l12Rail(S, c, x, y, z, r, n, h){ for(var k=0;k<n;k++){ var a = k*2*Math.PI/n, b = (k + 1)*2*Math.PI/n; S.box(c, x + Math.cos(a)*r, y, z + Math.sin(a)*r, 0.14, h, 0.14);
    S.bar(c, x + Math.cos(a)*r, y + h, z + Math.sin(a)*r, x + Math.cos(b)*r, y + h, z + Math.sin(b)*r, 0.13, 0.13); } }
// K01 Old Tock (F01): brick clock tower on an open arcade of cream stone piers: cream corner piers and bands, tall dark windows in the
// lower stage, a big clock face on each side of the top stage, a cornice, a slate pyramid roof with a gold ball
L11_DRESS.K01 = function(S){ var C = L11C, T = S.P.tab, b0 = T[0], t1 = T[1], n = T.length, top = T[n - 1], cr = 0xF0E3C4, w = t1.w, y, f;
  S.tint(function(m){ if(m.floor === 0) return m.key === "concrete" ? cr : (m.key === "tdeck" || m.key === "slab") ? 0xE3D4B0 : null;
    if(m.key === "bk") return (Math.abs(m.spawn.x) > w/2 - 1 && Math.abs(m.spawn.z) > w/2 - 1) ? cr : C.brick;
    if(m.key === "slab") return (m.floor === 3 || m.floor === n - 1) ? cr : C.brick; return null; });
  S.hy = b0.y1 - 0.2; S.box(cr, 0, b0.y1 - 0.55, 0, b0.w + 0.5, 0.55, b0.d + 0.5); S.box(cr, 0, b0.y1, 0, w + 0.5, 0.35, w + 0.5);
  S.hy = T[3].y1 - 0.2; S.box(cr, 0, T[3].y1 - 0.45, 0, w + 0.7, 0.45, w + 0.7);
  S.strips(function(p){ return p.key === "bkw" && p.floor >= 1 && p.floor <= 3; }, function(p){ S.strip(p, 0x3E4654, 0, p.floor === 3 ? -0.14 : 0, 0.3, p.floor === 3 ? 0.66 : 0.94); S.strip(p, cr, -0.2, p.floor === 3 ? -0.14 : 0, 0.05, p.floor === 3 ? 0.66 : 0.94); S.strip(p, cr, 0.2, p.floor === 3 ? -0.14 : 0, 0.05, p.floor === 3 ? 0.66 : 0.94);
    if(p.floor === 3) S.strip(p, cr, 0, 0.22, 0.45, 0.07); if(p.floor === 1) S.strip(p, cr, 0, -0.44, 0.5, 0.08); });
  var yc = T[5].y0 + (T[5].y1 - T[5].y0)/2, r = Math.min(w - 2.0, 5.6); S.hy = T[5].y1 - 0.2;
  [[0, 1], [0, -1], [1, 0], [-1, 0]].forEach(function(q){ var ax = q[0] !== 0, px = q[0]*(w/2 + 0.02), pz = q[1]*(w/2 + 0.02);
    S.cyl(C.gold, px, yc - 0.05, pz, r + 0.4, 0.1, r + 0.4, ax ? 0 : Math.PI/2, 0, ax ? Math.PI/2 : 0);
    S.cyl(C.white, px + q[0]*0.06, yc - 0.05, pz + q[1]*0.06, r, 0.1, r, ax ? 0 : Math.PI/2, 0, ax ? Math.PI/2 : 0);
    S.box(C.iron, px + q[0]*0.13, yc, pz + q[1]*0.13, ax ? 0.05 : 0.16, r*0.42, ax ? 0.16 : 0.05);
    S.box(C.iron, px + q[0]*0.13 + (ax ? 0 : r*0.15), yc - 0.08, pz + q[1]*0.13 + (ax ? r*0.15 : 0), ax ? 0.05 : r*0.3, 0.16, ax ? r*0.3 : 0.05);
    for(f=0;f<12;f++){ var a = f*Math.PI/6, u = Math.cos(a)*r*0.42, v = Math.sin(a)*r*0.42; S.box(C.iron, px + q[0]*0.13 + (ax ? 0 : u), yc + v + r*0.02 - 0.09, pz + q[1]*0.13 + (ax ? u : 0), ax ? 0.05 : 0.18, 0.18, ax ? 0.18 : 0.05); } });
  y = top.y1; S.hy = y - 0.2; S.box(cr, 0, y - 0.2, 0, w + 0.9, 0.5, w + 0.9); y += 0.3; S.box(cr, 0, y, 0, w + 1.4, 0.4, w + 1.4); y += 0.4;
  S.cone(C.slate, 0, y, 0, w + 1.0, 7.4, w + 1.0); y += 7.4; S.sph(C.gold, 0, y - 0.55, 0, 1.0, 1.0, 1.0); S.box(C.gold, 0, y + 0.3, 0, 0.16, 1.5, 0.16); S.hy = null; };
// K03 Rivet Tower (F03): steel lattice tower on three splayed legs with grey concrete feet: lattice round every leg segment and every
// shaft storey, tie bars between the legs, a ring deck with a glass ring (teal) and a rail, a glass cabin, a dark cap, a mast
L11_DRESS.K03 = function(S){ var C = L11C, P = S.P, G = P.legs, ir = 0x4B4C57, lt = 0x6A6E78, k, e = G.lw/2 + 0.12, y;
  S.tintKeys({steel:ir, tdeck:0x5A5C66, concrete:0xB9B8B4});
  S.mem.forEach(function(m){ if(m.key !== "steel" || m.floor < 1) return; var x = m.spawn.x, z = m.spawn.z, y0 = m.spawn.y - m.half[1], y1 = m.spawn.y + m.half[1], h = m.half[0] + 0.12, i;
    var c4 = [[-h, -h], [h, -h], [h, h], [-h, h]];
    for(i=0;i<4;i++){ var a = c4[i], b = c4[(i + 1) % 4]; l11Bar(m, ir, x + a[0], y0, z + a[1], x + a[0], y1, z + a[1], 0.2, 0.2);
      l11Bar(m, lt, x + a[0], y0, z + a[1], x + b[0], y1, z + b[1], 0.13, 0.13); l11Bar(m, lt, x + b[0], y0, z + b[1], x + a[0], y1, z + a[1], 0.13, 0.13);
      l11Bar(m, ir, x + a[0], y1 - 0.08, z + a[1], x + b[0], y1 - 0.08, z + b[1], 0.16, 0.16); } });
  S.mem.forEach(function(m){ if(m.key === "concrete") l6KdAdd(m, "box", 0xA3A29E, m.spawn.x, m.spawn.y + m.half[1] - 0.2, m.spawn.z, 2*m.half[0] + 0.3, 0.4, 2*m.half[2] + 0.3); });
  var pt = function(li, yy){ var a = G.ang[li]*Math.PI/180, r = G.R0 - G.dr*Math.max(0, Math.min(G.nL - 1, Math.floor((yy - G.fy)/G.sh))); return [Math.cos(a)*r, Math.sin(a)*r]; };
  [G.fy + 2.5*G.sh, G.fy + 4.5*G.sh].forEach(function(yy){ S.hy = P.deckY; for(k=0;k<3;k++){ var p = pt(k, yy), q = pt((k + 1) % 3, yy); S.bar(lt, p[0], yy, p[1], q[0], yy, q[1], 0.22, 0.22); } });
  y = P.deckY; S.hy = y - 0.3; var Dk = P.deckW + 3.2;
  S.rcone(ir, 0, y - 2.6, 0, Dk*0.94, 2.0, Dk*0.94, Math.PI, 0, 0); S.cyl(0x5A5C66, 0, y - 0.6, 0, Dk, 0.4, Dk); S.cyl(C.teal, 0, y - 0.2, 0, Dk - 0.5, 1.9, Dk - 0.5);
  for(k=0;k<16;k++){ var a2 = k*Math.PI/8; S.box(ir, Math.cos(a2)*(Dk/2 - 0.22), y - 0.2, Math.sin(a2)*(Dk/2 - 0.22), 0.16, 1.9, 0.16); }
  S.cyl(0x5A5C66, 0, y + 1.7, 0, Dk + 0.3, 0.3, Dk + 0.3); l12Rail(S, ir, 0, y + 2.0, 0, Dk/2 - 0.1, 18, 1.0);
  var cw = P.cab[0], ch = P.cab[1]; y = P.cabY; S.hy = y + ch - 0.2;
  S.box(C.teal, 0, y + 0.1, 0, 2*cw - 0.2, ch - 0.6, 2*cw - 0.2); S.box(0x9FE0EA, 0, y + 0.6, 0, 2*cw - 0.9, ch - 1.6, 2*cw - 0.9);
  l12Oct(S, ir, 0, y + ch, 0, cw + 1.1, 0.45); S.box(ir, 0, y + ch + 0.45, 0, 1.6, 0.6, 1.6); S.box(ir, 0, y + ch + 1.05, 0, 0.22, 5.2, 0.22); S.hy = null; };
// K04 Twin Saucer (F04): a grey eight-sided concrete shaft on a flared foot, a wide glass saucer (teal) with a terrace two thirds up,
// a small roofed saucer on top, an antenna
L11_DRESS.K04 = function(S){ var C = L11C, T = S.P.tab, ft = T[0], top = T[T.length - 1], gy = 0xC4C2BD, gd = 0x9A9894, k, y, a;
  S.tintKeys({cpan:gy, slab:0xB3B1AC, tdeck:0xB3B1AC, concrete:0xBDBBB6});
  T.forEach(function(t, i){ if(!i) return; S.hy = t.y1 - 0.2; l12Diag(S, t, gy, 0.22, t.y0, t.y1); });
  var fr = ft.w/2; S.ground("box", 0xA9A8A4, 0, 0, 0, ft.w + 2.0, 0.3, ft.d + 2.0); S.hy = ft.y1 - 0.2; S.box(0xB3B1AC, 0, ft.y1 - 0.5, 0, ft.w + 0.5, 0.5, ft.d + 0.5);
  S.hy = T[1].y1 - 0.2; [[1, 1], [-1, 1], [1, -1], [-1, -1]].forEach(function(q){ S.bar(gd, q[0]*(fr - 0.6), ft.y1, q[1]*(fr - 0.6), q[0]*T[1].r*0.6, ft.y1 + 3.2, q[1]*T[1].r*0.6, 0.9, 1.2); });
  var R1 = 8.6, lo = T[6]; y = lo.y0 + 0.3; S.hy = lo.y1 - 0.2;
  S.rcone(gd, 0, y - 2.6, 0, 2*R1*0.94, 2.6, 2*R1*0.94, Math.PI, 0, 0); S.cyl(0x8E9299, 0, y, 0, 2*R1, 0.4, 2*R1); S.cyl(C.teal, 0, y + 0.4, 0, 2*R1 - 0.6, 2.3, 2*R1 - 0.6);
  for(k=0;k<20;k++){ a = k*Math.PI/10; S.box(0x6D7D88, Math.cos(a)*(R1 - 0.28), y + 0.4, Math.sin(a)*(R1 - 0.28), 0.16, 2.3, 0.16); }
  S.cyl(0x8E9299, 0, y + 2.7, 0, 2*R1 + 0.2, 0.3, 2*R1 + 0.2); S.cyl(0xE0913A, 0, y + 3.0, 0, 2*R1 - 0.9, 0.1, 2*R1 - 0.9); l12Rail(S, C.iron, 0, y + 3.0, 0, R1 - 0.2, 22, 1.0);
  var R2 = 5.6; y = top.y1; S.hy = y - 0.2;
  S.rcone(gd, 0, y - 1.4, 0, 2*R2*0.9, 1.5, 2*R2*0.9, Math.PI, 0, 0); S.cyl(0x8E9299, 0, y, 0, 2*R2, 0.35, 2*R2); S.cyl(0xE0913A, 0, y + 0.35, 0, 2*R2 - 0.6, 0.1, 2*R2 - 0.6); l12Rail(S, C.iron, 0, y + 0.35, 0, R2 - 0.2, 16, 0.9);
  for(k=0;k<6;k++){ a = k*Math.PI/3 + 0.4; S.box(C.green, Math.cos(a)*(R2 - 1.2), y + 0.45, Math.sin(a)*(R2 - 1.2), 0.9, 0.7, 0.9); S.box(0x6D7D88, Math.cos(a + 0.5)*(R2 - 0.7), y + 0.45, Math.sin(a + 0.5)*(R2 - 0.7), 0.2, 2.4, 0.2); }
  S.cyl(gy, 0, y + 0.35, 0, 3.4, 2.5, 3.4); S.cyl(gd, 0, y + 2.85, 0, 2*R2 + 1.0, 0.45, 2*R2 + 1.0); S.rcone(0x8E9299, 0, y + 3.3, 0, 2*R2 + 0.6, 0.9, 2*R2 + 0.6); S.box(gd, 0, y + 4.1, 0, 0.9, 0.9, 0.9); S.box(C.iron, 0, y + 5.0, 0, 0.2, 5.5, 0.2); S.hy = null; };
// K05 Shell Hall (F05): a sandstone podium with pilasters and steps, a hall of grey piers with tall windows (teal), and four fan-fold
// roof shells (the twist: folded fans, not shells) that lean one way, each riding on a roof plate
L11_DRESS.K05 = function(S){ var C = L11C, T = S.P.tab, pod = T[0], h = T[1], sd = 0xE8C98A, sdD = 0xCFAE6C, sh = 0xD4D0C7, shD = 0xB2AEA5, k;
  S.tint(function(m){ if(m.floor === 0) return m.key === "cpan" ? sd : (m.key === "tdeck" || m.key === "slab") ? sdD : m.key === "concrete" ? 0xEDD49A : null;
    return m.key === "concrete" ? 0xD9D5CB : m.key === "cpan" ? 0xCFCBC2 : (m.key === "tdeck" || m.key === "slab") ? shD : null; });
  S.strips(function(p){ return p.key === "cpan" && p.floor === 0; }, function(p){ S.strip(p, sdD, -0.36, 0, 0.08, 0.96); S.strip(p, sdD, 0.36, 0, 0.08, 0.96); S.strip(p, 0xDDBB78, 0, 0, 0.56, 0.7); });
  S.strips(function(p){ return p.key === "cpan" && p.floor === 1; }, function(p){ S.strip(p, C.teal, 0, 0, 0.88, 0.84); S.strip(p, C.tealD, 0, 0, 0.05, 0.84); S.strip(p, C.tealD, 0, 0.1, 0.88, 0.04); });
  S.hy = pod.y1 - 0.2; S.box(sdD, 0, pod.y1 - 0.5, 0, pod.w + 0.6, 0.5, pod.d + 0.6); S.box(sd, 0, pod.y1, 0, pod.w - 0.4, 0.5, pod.d - 0.4, 0, 0, 0);
  [0, 1, 2, 3, 4].forEach(function(i){ S.ground("box", i % 2 ? sdD : sd, -pod.w/2 + 5.5, 0, pod.d/2 + 0.45 + (4 - i)*0.55, 8.4, 0.3 + i*0.42, 1.0); });
  [[1, 1], [-1, 1]].forEach(function(q){ S.ground("box", sd, q[0]*(pod.w/2 + 0.2), 0, q[1]*(pod.d/2 + 1.3), 2.6, 0.6, 2.2); S.ground("sph", C.green, q[0]*(pod.w/2 + 0.2), 0.5, q[1]*(pod.d/2 + 1.3), 2.2, 1.5, 1.9); });
  var y = h.y1, ox = h.x + h.w/2 - 0.6, oy = y + 0.2;
  S.box(shD, 0, y, 0, h.w + 0.8, 0.4, h.d + 0.8);
  for(k=0;k<4;k++){ var th = 0.2 + 0.19*k, L = 17.5 - 1.2*k, H = 3.6 - 0.25*k, cx = ox - Math.cos(th)*L/2, cy = oy + Math.sin(th)*L/2;
    l6KdAdd(S.host(Math.max(h.x - h.w/2 + 1, cx), y - 0.2, 0), "prism", k % 2 ? sh : 0xDDD9D0, cx, cy + H/2 - 0.3, h.z, L, H, h.d + 1.8 - k*1.3, 0, 0, -th); }
  S.hy = null; };
// K09 Lift Bridge (F09): one stone bridge tower: a broad pier, pale stone bands and narrow windows, a stepped terracotta roof; the high
// walkway (steel plates of this part) gets blue-grey trusses; a raised bascule leaf points at the other tower
L11_DRESS.K09 = function(S){ var C = L11C, D = S.D, T = S.P.tab, pr = T[0], top = T[T.length - 1], sd = 0xE6D3A3, sdD = 0xCDB57E, tr = 0x7FA3B5, trD = 0x55788A, y, k, sg = D.side < 0 ? 1 : -1;
  S.tintKeys({cpan:sd, slab:sdD, tdeck:sdD, concrete:0xEAD9AE, sdeck:trD});
  S.ground("box", sdD, 0, 0, 0, pr.w + 1.0, 0.5, pr.d + 1.0); S.hy = pr.y1 - 0.2; S.box(sdD, 0, pr.y1 - 0.55, 0, pr.w + 0.5, 0.55, pr.d + 0.5);
  S.strips(function(p){ return p.key === "cpan" && p.floor >= 1; }, function(p){ S.strip(p, 0x4A5560, 0, 0.02, 0.15, 0.5); S.strip(p, 0xF4ECD8, 0, -0.27, 0.26, 0.05); S.strip(p, 0xF4ECD8, 0, 0.3, 0.26, 0.05); });
  S.strips(function(p){ return p.key === "cpan" && p.floor === 0; }, function(p){ S.strip(p, sdD, 0, -0.2, 1.0, 0.06); S.strip(p, sdD, 0, 0.2, 1.0, 0.06); });
  T.slice(1).forEach(function(t){ S.hy = t.y1 - 0.2; S.box(sdD, 0, t.y1 - 0.3, 0, t.w + 0.3, 0.3, t.d + 0.3); });
  y = top.y1; S.hy = y - 0.2; S.box(sd, 0, y - 0.1, 0, top.w + 1.0, 0.7, top.d + 1.0); y += 0.6; y = S.steps(0, y, 0, top.w, top.d, [[0.94, 1.4, C.terra], [0.7, 1.3, C.terra], [0.44, 1.2, 0xC9603C], [0.2, 0.9, 0xC9603C]], 0xB7553A);
  S.slabs.forEach(function(m){ if(m.key !== "sdeck") return; var w = 2*m.half[0], yy = m.spawn.y + m.half[1], x0 = m.spawn.x - m.half[0], x1 = m.spawn.x + m.half[0];
    [-1, 1].forEach(function(s){ var z = m.spawn.z + s*(m.half[2] - 0.1); l11Bar(m, tr, x0, yy + 2.0, z, x1, yy + 2.0, z, 0.22, 0.22); l11Bar(m, tr, x0, yy + 0.1, z, x1, yy + 0.1, z, 0.22, 0.22);
      l11Bar(m, tr, x0, yy, z, x0 + w/2, yy + 2.0, z, 0.14, 0.14); l11Bar(m, tr, x0 + w/2, yy + 2.0, z, x1, yy, z, 0.14, 0.14); l11Bar(m, tr, x0, yy, z, x0, yy + 2.0, z, 0.16, 0.16); l11Bar(m, tr, x1, yy, z, x1, yy + 2.0, z, 0.16, 0.16); });
    l6KdAdd(m, "box", trD, m.spawn.x, yy + 2.15, m.spawn.z, w, 0.14, 2*m.half[2] + 0.1); });
  var hx = sg*(pr.w/2 - 0.2), hy = pr.y1 + 0.3, L = 7.2, ang = 0.72, ex = hx + sg*Math.cos(ang)*L, ey = hy + Math.sin(ang)*L; S.hy = pr.y1 - 0.2;
  S.bar(C.road, hx, hy, 0, ex, ey, 0, 0.4, 4.6); [-1, 1].forEach(function(s){ S.bar(trD, hx, hy - 0.45, s*2.1, ex, ey - 0.45, s*2.1, 0.7, 0.3); S.bar(tr, hx, hy + 0.5, s*2.3, ex, ey + 0.5, s*2.3, 0.14, 0.14); });
  for(k=1;k<4;k++){ var f = k/4; S.bar(0xE9E4D6, hx + (ex - hx)*(f - 0.07), hy + (ey - hy)*(f - 0.07) + 0.23, 0, hx + (ex - hx)*(f + 0.07), hy + (ey - hy)*(f + 0.07) + 0.23, 0, 0.05, 0.18); }
  S.hy = null; };
// K10 Grand Arch (F10): a sandstone gate: the big arch in the middle and a small arch through each side (the twist: three arches), arch
// rings, bands, a panelled attic with a cornice and a stepped top; the road runs through it
L11_DRESS.K10 = function(S){ var C = L11C, T = S.P.tab, sd = 0xE6D3A3, sdD = 0xCDB57E, at = T.filter(function(t){ return t.tag === "attic"; })[0], d = at.d, k;
  S.tintKeys({cpan:sd, slab:sdD, tdeck:sdD, concrete:0xEAD9AE});
  S.ground("box", C.road, 0, 0, 0, 9.2, 0.1, 36); for(k=-4;k<=4;k++) S.ground("box", 0xE9E4D6, 0, 0.1, k*4, 0.22, 0.03, 1.8);
  var arch = function(xc, hw, yt, R, n){ var j; S.hy = yt + 0.2;
    for(j=0;j<n;j++){ var u0 = R*j/n, u1 = R*(j + 1)/n, o = Math.sqrt(Math.max(0, R*R - u1*u1))*hw/R, wd = hw - o; if(wd < 0.05) continue;
      [-1, 1].forEach(function(s){ S.box(sd, xc + s*(o + wd/2), yt - R + u0, 0, wd, R/n + 0.01, d - 0.12); }); }
    for(j=0;j<12;j++){ var a0 = Math.PI*j/12, a1 = Math.PI*(j + 1)/12; [-1, 1].forEach(function(s){ S.bar(sdD, xc + Math.cos(a0)*hw, yt - R + Math.sin(a0)*R, s*(d/2 + 0.03), xc + Math.cos(a1)*hw, yt - R + Math.sin(a1)*R, s*(d/2 + 0.03), 0.6, 0.2); }); }
    [-1, 1].forEach(function(s){ S.box(sdD, xc, yt - 0.75, s*(d/2 + 0.06), 0.9, 1.3, 0.3); }); };
  arch(0, 5.0, 14.0, 5.0, 8); arch(-9.6, 1.6, 7.4, 1.6, 5); arch(9.6, 1.6, 7.4, 1.6, 5);
  [-1, 1].forEach(function(s){ S.hy = 7.3; S.box(sdD, s*9.6, 7.15, 0, 9.5, 0.4, d + 0.3); S.hy = 13.9; S.box(sdD, s*9.6, 9.0, 0, 9.5, 0.4, d + 0.3); });
  S.hy = at.y1 - 0.3; S.box(sdD, 0, at.y0 - 0.25, 0, at.w + 0.7, 0.5, d + 0.7);
  S.strips(function(p){ return p.key === "cpan" && p.floor === at.fl; }, function(p){ S.strip(p, 0xD9C48F, 0, 0, 0.84, 0.66); });
  var y = at.y1; S.box(sd, 0, y - 0.15, 0, at.w + 1.0, 0.6, d + 1.0); y += 0.45; S.box(sdD, 0, y, 0, at.w + 0.3, 0.35, d + 0.3); y += 0.35; S.box(sd, 0, y, 0, at.w - 1.0, 1.0, d - 0.8); y += 1.0; S.box(sdD, 0, y, 0, at.w - 0.6, 0.25, d - 0.4); S.hy = null; };
// K14 Dome Hall (F14): a wide cream stone hall: wings with an arcade and a small end dome each, a taller centre block with a columned
// porch and a pediment, an eight-sided drum ringed with columns, the big slate dome with a lantern
L11_DRESS.K14 = function(S){ var C = L11C, T = S.P.tab, st = 0xDCD2BC, dc = S.D.c || 0x66758C, k, tg = function(n){ return T.filter(function(t){ return t.tag === n; }); };
  S.tintKeys({cpan:C.cream, slab:st, tdeck:st, concrete:0xEFE6D0});
  S.strips(function(p){ return p.key === "cpan" && 2*p.half[1] > 2; }, function(p){ var W = 2*Math.max(p.half[0], p.half[2]), n = Math.max(1, Math.round(W/1.8)), j; for(j=0;j<n;j++){ S.strip(p, 0x4F6676, (j + 0.5)/n - 0.5, 0.02, 0.36/n, 0.6); S.strip(p, st, (j + 0.5)/n - 0.5, -0.32, 0.5/n, 0.05); } });
  ["wingL", "wingR"].forEach(function(nm){ var q = tg(nm), t = q[q.length - 1], sg = t.x < 0 ? -1 : 1, b = q[0]; S.hy = b.y1 - 0.2; S.box(st, t.x, b.y1 - 0.3, t.z, t.w + 0.3, 0.3, t.d + 0.3);
    S.hy = t.y1 - 0.2; S.box(C.cream, t.x, t.y1 - 0.1, t.z, t.w + 0.7, 0.5, t.d + 0.7); S.box(st, t.x, t.y1 + 0.4, t.z, t.w + 0.1, 0.5, t.d + 0.1); S.box(0x8A93A0, t.x, t.y1 + 0.9, t.z, t.w - 0.9, 0.12, t.d - 0.9);
    var x = t.x + sg*(t.w/2 - 2.1); S.cyl(C.cream, x, t.y1 + 0.9, t.z, 3.3, 1.3, 3.3); S.cyl(st, x, t.y1 + 2.2, t.z, 3.6, 0.25, 3.6); S.dome(dc, x, t.y1 + 2.45, t.z, 3.4, 2.1, 3.4); S.sph(C.gold, x, t.y1 + 4.4, t.z, 0.45, 0.45, 0.45); });
  var md = tg("mid"), m = md[md.length - 1]; S.hy = m.y1 - 0.2; S.box(C.cream, m.x, m.y1 - 0.1, m.z, m.w + 0.8, 0.55, m.d + 0.8); S.box(st, m.x, m.y1 + 0.45, m.z, m.w + 0.2, 0.5, m.d + 0.2);
  var at = tg("attic")[0], dr = tg("drum"), d0 = dr[0], d1 = dr[dr.length - 1], r = d0.r, y;
  [at].concat(dr).forEach(function(t){ S.hy = t.y1 - 0.2; l12Diag(S, t, t === at ? C.cream : 0xE6DCC6, 0.24, t.y0, t.y1); });
  S.hy = at.y1 - 0.2; l12Oct(S, C.cream, 0, at.y1 - 0.3, 0, at.r + 0.5, 0.45);
  for(k=0;k<12;k++){ var a = k*Math.PI/6 + 0.26; S.hy = d0.y1; S.cyl(C.white, Math.cos(a)*(r*1.09 + 0.25), d0.y0 + 0.15, Math.sin(a)*(r*1.09 + 0.25), 0.46, d1.y1 - d0.y0 - 0.15, 0.46); }
  y = d1.y1; S.hy = y - 0.2; S.cyl(C.cream, 0, y - 0.1, 0, 2*r*1.09 + 1.5, 0.55, 2*r*1.09 + 1.5); y += 0.45; S.cyl(st, 0, y, 0, 2*r + 0.5, 0.6, 2*r + 0.5); y += 0.6;
  S.dome(dc, 0, y, 0, 2*r + 0.5, r*1.45, 2*r + 0.5); for(k=0;k<8;k++){ var b2 = k*Math.PI/4; S.bar(0x55637A, Math.cos(b2)*(r + 0.2), y + 0.2, Math.sin(b2)*(r + 0.2), Math.cos(b2)*r*0.55, y + r*1.2, Math.sin(b2)*r*0.55, 0.16, 0.16); } y += r*1.45;
  S.cyl(C.cream, 0, y - 0.35, 0, 1.7, 1.7, 1.7); y += 1.35; S.cyl(st, 0, y, 0, 2.0, 0.2, 2.0); S.dome(dc, 0, y + 0.2, 0, 1.9, 1.1, 1.9); y += 1.3; S.box(C.gold, 0, y - 0.1, 0, 0.18, 1.3, 0.18);
  var p = tg("porch")[0]; S.hy = p.y1 - 0.2; S.box(C.cream, p.x, p.y1 - 0.5, p.z, p.w + 0.5, 0.6, p.d + 0.5); S.prism(C.cream, p.x, p.y1 + 0.1, p.z + 0.1, p.d + 0.5, 2.3, p.w + 0.9, 0, Math.PI/2, 0);
  S.prism(st, p.x, p.y1 + 0.35, p.z + p.d/2 + 0.32, 0.12, 1.5, p.w - 1.6, 0, Math.PI/2, 0);
  [0, 1, 2, 3].forEach(function(i){ S.ground("box", i % 2 ? st : C.cream, p.x, 0, p.z + p.d/2 + 0.5 + (3 - i)*0.45, p.w + 0.6, 0.2 + i*0.18, 0.9); });
  S.hy = null; };
// K16 Deco Needle (F16): grey stone tower that steps in: dark window strips between stone piers, a ledge and corner blocks on every
// setback, a stepped crown and a needle
L11_DRESS.K16 = function(S){ var C = L11C, T = S.P.tab, st = 0xB9B7B2, dk = 0x5E6A75, top = T[T.length - 1], y;
  S.tintKeys({cpan:C.grey, slab:st, tdeck:st, concrete:0xBDBBB6});
  S.strips(function(p){ return p.key === "cpan"; }, function(p){ var W = 2*Math.max(p.half[0], p.half[2]), n = Math.max(1, Math.round(W/1.45)), k; for(k=0;k<n;k++) S.strip(p, dk, (k + 0.5)/n - 0.5, 0, 0.44/n, 0.82); });
  T.forEach(function(t, i){ var u = T[i + 1]; if(u && u.w > t.w - 0.5) return; S.hy = t.y1 - 0.2; S.box(st, 0, t.y1 - 0.32, 0, t.w + 0.36, 0.32, t.d + 0.36); if(!u) return;
    var g = (t.w - u.w)/2, s = g*0.92, e = t.w/2 - s/2 - 0.05;
    [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(function(q){ S.box(C.grey, q[0]*e, t.y1, q[1]*e, s, 1.5, s); S.box(st, q[0]*e, t.y1 + 1.5, q[1]*e, s + 0.16, 0.2, s + 0.16); });
    [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function(q){ S.box(C.grey, q[0]*(u.w/2 + g*0.3), t.y1, q[1]*(u.w/2 + g*0.3), q[0] ? g*0.6 : u.w*0.42, 2.1, q[0] ? u.w*0.42 : g*0.6); }); });
  y = top.y1; S.hy = y - 0.2; y = S.steps(0, y, 0, top.w, top.d, [[0.82, 1.5, C.grey], [0.62, 1.5, C.grey], [0.44, 1.4, C.grey], [0.28, 1.3, C.grey], [0.15, 1.2, C.greyD]], st);
  S.box(C.greyD, 0, y, 0, 0.24, 6.0, 0.24); S.hy = null; };
// K21 The Pedestal (F21): a blank sandstone plinth (no statue): a stepped base with a door, tall recessed panels between pilasters, a
// heavy stepped flat top; round it a lawn and a low eight-point star rampart (ground decor: terrain, it does not fall)
L11_DRESS.K21 = function(S){ var C = L11C, T = S.P.tab, b0 = T[0], t1 = T[1], top = T[T.length - 1], sd = 0xE8C277, sdD = 0xCFA657, k, y, a = S.D.a || 10.2;
  S.tintKeys({cpan:sd, slab:sdD, tdeck:sdD, concrete:0xEDCB85});
  S.strips(function(p){ return p.key === "cpan" && p.floor >= 1; }, function(p){ S.strip(p, 0xDDB868, 0, 0, 0.7, 0.9); S.strip(p, sdD, -0.42, 0, 0.07, 0.98); S.strip(p, sdD, 0.42, 0, 0.07, 0.98); });
  S.strips(function(p){ return p.key === "cpan" && p.floor === 0 && p.spawn.z > 1; }, function(p){ if(p.spawn.x < 0) return; S.strip(p, 0x6B4F2A, -0.3, -0.12, 0.32, 0.72); });
  S.hy = b0.y1 - 0.2; S.box(sdD, 0, b0.y1 - 0.5, 0, b0.w + 0.5, 0.5, b0.d + 0.5); S.box(sd, 0, b0.y1, 0, t1.w + 0.9, 0.55, t1.d + 0.9); S.box(sdD, 0, b0.y1 + 0.55, 0, t1.w + 0.5, 0.3, t1.d + 0.5);
  y = top.y1; S.hy = y - 0.2; var w = top.w; S.box(sdD, 0, y - 0.3, 0, w + 0.5, 0.5, w + 0.5); y += 0.2; S.box(sd, 0, y, 0, w + 1.4, 0.9, w + 1.4); y += 0.9; S.box(sdD, 0, y, 0, w + 2.2, 0.7, w + 2.2); y += 0.7; S.box(sd, 0, y, 0, w + 1.0, 1.3, w + 1.0); y += 1.3; S.box(sdD, 0, y, 0, w + 1.6, 0.45, w + 1.6); S.hy = null;
  S.ground("box", C.green, 0, 0, 0, 2*a - 1.4, 0.12, 2*a - 1.4); S.ground("box", C.green, 0, 0, 0, 2*a - 1.4, 0.12, 2*a - 1.4, 0, Math.PI/4, 0);
  S.ground("box", 0xCFC6AE, 0, 0.12, b0.d/2 + 2.4, 2.4, 0.03, 4.8);
  [0, 1, 2].forEach(function(i){ S.ground("box", i % 2 ? sdD : sd, 0.3*b0.w/2 - 0.3, 0, b0.d/2 + 0.4 + (2 - i)*0.5, 3.2, 0.25 + i*0.3, 0.9); });
  var Ro = a*1.4142, Ri = a*1.0824, pts = [];
  for(k=0;k<16;k++){ var r = k % 2 ? Ri : Ro, an = k*Math.PI/8 + Math.PI/4; pts.push([Math.cos(an)*r, Math.sin(an)*r]); }
  for(k=0;k<16;k++){ var p = pts[k], q = pts[(k + 1) % 16]; l11Bar(S.base, sd, p[0], 1.0, p[1], q[0], 1.0, q[1], 2.0, 1.3); l11Bar(S.base, 0xB9B4A6, p[0]*0.985, 2.08, p[1]*0.985, q[0]*0.985, 2.08, q[1]*0.985, 0.16, 1.0); l11Bar(S.base, sdD, p[0]*1.02, 2.2, p[1]*1.02, q[0]*1.02, 2.2, q[1]*1.02, 0.5, 0.4);
    if(k % 2 === 0) S.ground("box", sdD, p[0], 0, p[1], 1.9, 2.5, 1.9, 0, -(k*Math.PI/8 + Math.PI/4), 0); } };
// K24 The Doorstop (F24): brick wedge block, nose to the front: a cream stone ground storey with shop windows, a cream flat-cut nose,
// window rows with sills, cream bands, a deep cornice that follows the wedge, a grey roof with a small penthouse
L11_DRESS.K24 = function(S){ var C = L11C, W = S.P.wedge, Z = W.Z, D = W.D, T = S.P.tab, n = T.length, cr = 0xEFE3C8, top = T[n - 1].y1, i, dk = 0x3E4654, nz = Z.length;
  S.tint(function(m){ var nose = m.spawn.z > Z[0] - 0.6; if(m.floor === 0) return (m.key === "bk" || m.key === "bkw") ? cr : m.key === "slab" ? 0xE0D2B2 : null;
    if(nose && (m.key === "bk" || m.key === "bkw")) return cr; if(m.key === "slab") return (m.floor === n - 1 || m.floor === n - 3) ? cr : 0xC66A48; return null; });
  S.strips(function(p){ return p.key === "bkw"; }, function(p){ var Wd = 2*Math.max(p.half[0], p.half[2]), k, nn = Math.max(1, Math.round(Wd/1.6));
    if(p.floor === 0){ S.strip(p, C.teal, 0, 0.0, 0.84, 0.66); S.strip(p, C.tealD, 0, -0.38, 0.84, 0.1); return; }
    for(k=0;k<nn;k++){ var u = (k + 0.5)/nn - 0.5; S.strip(p, dk, u, 0.03, 0.42/nn, 0.5); S.strip(p, cr, u, -0.26, 0.56/nn, 0.06); if(p.floor === n - 1) S.strip(p, cr, u, 0.32, 0.56/nn, 0.06); } });
  var ring = function(y, h, g, c){ for(i=0;i<nz-1;i++){ var z1 = Z[i] + (i === 0 ? W.cw/2 + g : 0), z0 = Z[i + 1] - (i === nz - 2 ? W.cw/2 + g : 0); S.box(c, 0, y, (z0 + z1)/2, D[i + 1] + 2*g, h, z1 - z0); } };
  S.hy = T[0].y1 - 0.2; ring(T[0].y1 - 0.5, 0.5, 0.3, cr);
  S.hy = T[n - 3].y1 - 0.2; ring(T[n - 3].y1 - 0.34, 0.34, 0.2, cr);
  S.hy = top - 0.2; ring(top - 0.3, 0.45, 0.35, cr); ring(top + 0.15, 0.45, 0.6, cr); ring(top + 0.6, 0.5, 0.25, 0xDCCFB2);
  for(i=1;i<nz-1;i++){ S.box(0x8E9299, 0, top + 1.1, (Z[i] + Z[i + 1])/2, D[i + 1] - 1.6, 0.3, Z[i] - Z[i + 1] - 0.8); }
  S.box(0xB3B1AC, 0, top + 1.1, Z[nz - 1] + 2.4, 3.6, 2.2, 3.2); S.box(0x8E9299, 0, top + 3.3, Z[nz - 1] + 2.4, 3.9, 0.25, 3.5); S.hy = null; };
// K27 Old Whirly (F27): timber smock mill: pale ring of posts, an eight-sided boarded body that tapers, a ledge, a dark round cap and SIX
// lattice sails on a hub at the front (the twist: six, not four)
L11_DRESS.K27 = function(S){ var C = L11C, T = S.P.tab, b0 = T[0], top = T[T.length - 1], k, j, dk = 0x4F535E, sail = 0xE8B64C, spar = 0x8A5A2B, bd = 0xE39A40, bd2 = 0xD88C34, y;
  S.tint(function(m){ return m.floor === 0 ? (m.key === "wpost" ? 0xEAD9B0 : m.key === "wfloor" ? 0xD9C596 : null) : m.key === "wwall" ? (m.floor % 2 ? bd : bd2) : m.key === "wpost" ? 0xC57F2E : m.key === "wfloor" ? 0xB9793A : null; });
  l12Oct(S, 0xCDBE9A, 0, 0, 0, b0.r + 0.9, 0.25, 1);
  S.hy = b0.y1 - 0.2; l12Oct(S, 0xEAD9B0, 0, b0.y1 - 0.5, 0, b0.r + 0.35, 0.5); S.hy = null;
  T.forEach(function(t, i){ if(!i) return; S.hy = t.y1 - 0.2; l12Diag(S, t, i % 2 ? bd : bd2, 0.2); l12Diag(S, t, 0xB9793A, 0.24, t.y1 - 0.36, t.y1, 0.02); });
  S.hy = null;
  l12Win(S, 0x4A3B2E, function(p){ return p.key === "wwall" && (p.floor === 2 || p.floor === 4); }, 0.3, 0.4);
  S.strips(function(p){ return p.key === "wwall" && (p.floor === 2 || p.floor === 4); }, function(p){ S.strip(p, C.white, 0, -0.2, 0.42, 0.06); });
  y = top.y1; S.hy = y - 0.2; var r = top.r;
  l12Oct(S, dk, 0, y, 0, r + 0.45, 0.45); S.dome(dk, 0, y + 0.45, 0, 2*r + 0.7, r*1.25, 2*r + 0.7); S.sph(0x3A3D45, 0, y + 0.45 + r*1.25 - 0.35, 0, 0.9, 0.9, 0.9);
  var hx = 0, hy = y + 1.3, hz = r + 1.7, R = S.D.r || 11.5, w = S.D.sw || 2.3;
  S.bar(dk, hx, hy, 0, hx, hy, hz + 0.3, 0.8, 0.8); S.sph(dk, hx, hy - 0.9, hz, 1.8, 1.8, 1.8);
  for(k=0;k<6;k++){ var a = k*Math.PI/3 + 0.3, dx = Math.cos(a), dy = Math.sin(a), nx = -dy, ny = dx;
    S.bar(spar, hx, hy, hz, hx + dx*R, hy + dy*R, hz, 0.36, 0.3);
    S.bar(sail, hx + dx*2.6 + nx*w, hy + dy*2.6 + ny*w, hz, hx + dx*R + nx*w, hy + dy*R + ny*w, hz, 0.22, 0.2);
    S.bar(sail, hx + dx*2.6 + nx*w*0.5, hy + dy*2.6 + ny*w*0.5, hz, hx + dx*R + nx*w*0.5, hy + dy*R + ny*w*0.5, hz, 0.13, 0.13);
    for(j=0;j<=8;j++){ var q = 2.6 + (R - 2.6)*j/8; S.bar(sail, hx + dx*q, hy + dy*q, hz, hx + dx*q + nx*w, hy + dy*q + ny*w, hz, 0.18, 0.18); } }
  S.hy = null; };
// K28 Stripey Point (F28): brick lighthouse on a grey rock: red / white bands of two storeys on an eight-sided tapering shaft, a dark
// gallery with a rail, a glass lantern (teal, never the protected blue), a slate cap with a ball
L11_DRESS.K28 = function(S){ var C = L11C, T = S.P.tab, RK = S.P.rock || 0, top = T[T.length - 1], RD = 0xD9553A, WH = 0xF3EEE2, k, a, y, r = top.r;
  var red = function(f){ return Math.floor(f/2) % 2 === 1; };
  S.tint(function(q){ return (q.key === "bkw" || q.key === "bk") ? (red(q.floor) ? RD : WH) : q.key === "slab" ? (red(q.floor) ? 0xC94B32 : 0xE4DDCB) : null; });
  T.forEach(function(t){ S.hy = t.y1 - 0.2; l12Diag(S, t, red(t.fl) ? RD : WH, 0.26, t.y0, t.y1); }); S.hy = null;
  l12Oct(S, 0x8E9299, 0, 0, 0, 6.4, RK*0.45, 1); l12Oct(S, 0xA3A7AE, 0, RK*0.45, 0, 5.4, RK*0.3, 1); l12Oct(S, 0xB4B7BC, 0, RK*0.75, 0, 4.75, RK*0.25 + 0.02, 1);
  [0, 1, 2].forEach(function(i){ S.ground("box", 0x9A9EA6, 0, i*RK/3 - 0.01, 6.3 - i*0.75, 2.2, RK/3, 1.5); });
  S.strips(function(p){ return p.key === "bkw" && p.floor === 0 && p.spawn.z > 1; }, function(p){ S.strip(p, 0x4A5B6C, 0, -0.08, 0.5, 0.78); });
  l12Win(S, 0x3E4654, function(p){ return p.key === "bkw" && p.spawn.z > 1 && (p.floor === 3 || p.floor === 6 || p.floor === 9); }, 0.3, 0.5);
  y = top.y1; S.hy = y - 0.2; var gr = r + 1.25;
  l12Oct(S, C.iron, 0, y - 0.15, 0, gr, 0.5); y += 0.35; l12Rail(S, C.iron, 0, y, 0, gr - 0.15, 16, 1.15);
  S.cyl(WH, 0, y, 0, 2*r*0.78, 1.2, 2*r*0.78); y += 1.2; S.cyl(C.teal, 0, y, 0, 2*r*0.66, 3.3, 2*r*0.66); S.cyl(0x9FE0EA, 0, y + 0.9, 0, 2*r*0.3, 1.5, 2*r*0.3);
  for(k=0;k<8;k++){ a = k*Math.PI/4; S.box(C.iron, Math.cos(a)*r*0.66, y, Math.sin(a)*r*0.66, 0.2, 3.3, 0.2); } y += 3.3;
  S.cyl(C.iron, 0, y, 0, 2*r*0.84, 0.35, 2*r*0.84); y += 0.35; S.dome(C.slate, 0, y, 0, 2*r*0.78, r*0.75, 2*r*0.78); y += r*0.75; S.sph(C.iron, 0, y - 0.25, 0, 0.9, 0.9, 0.9); S.box(C.iron, 0, y + 0.45, 0, 0.16, 1.3, 0.16); S.hy = null; };
var l11BI0 = buildInstances; buildInstances = function(){ var r = l11BI0.apply(this, arguments), i, b;
  for(i=0;i<blocks.length;i++){ b = blocks[i]; if(b.tint == null || !b.im) continue; linSet(_c, b.tint); if(!b.anchor) _c.multiplyScalar(Math.min(1, 0.9 + 0.035*(b.floor || 0)));
    b.im.setColorAt(b.ii, _c); if(b.im.instanceColor) b.im.instanceColor.needsUpdate = true; }
  return r; };
// a deck6 with a dress: a glazed walkway on the steel deck (F07's sky bridge)
var l11Deck0 = V5_PARTS.deck6; V5_PARTS.deck6 = function(P){ var n0 = blocks.length, r = l11Deck0(P), i;
  if(P.dress) for(i=n0;i<blocks.length;i++){ var b = blocks[i]; if(b.key !== "sdeck") continue;
    l6KdAdd(b, "box", L11C.glass, b.spawn.x, b.spawn.y + b.half[1] + 1.15, b.spawn.z, b.half[0]*2, 2.3, b.half[2]*2 - 0.5);
    l6KdAdd(b, "box", 0x8D9AA3, b.spawn.x, b.spawn.y + b.half[1] + 2.45, b.spawn.z, b.half[0]*2, 0.3, b.half[2]*2 - 0.1);
    l6KdAdd(b, "box", 0x8D9AA3, b.spawn.x, b.spawn.y - b.half[1] - 0.2, b.spawn.z, b.half[0]*2, 0.4, b.half[2]*2 - 0.3); }
  return r; };
// 6) glass levels (L25+) with massive secondaries run 330-400 members: the base drops every second pane above BODY_CAP - 12.
//    Raised 320 -> 400 (brief Q4 asks Owner for this ceiling; perf numbers in L13-36-STATUS.md). L1-12 have no glass: unchanged.
BODY_CAP = 1e9;   // D-blast-NOCAP, Owner 12/11: no body limit (was 400: the base no longer drops glass panes or anything else, L1-36)
// ---- end levels6 v11
