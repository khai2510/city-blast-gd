// ---- levels6 v12 (L13-36 physical hero rebuild, 12/11/2026; applied AFTER patch/v11.js by tools/src-l13-36.js; nothing in v10 / v11 is edited)
// Owner on hero-compare-L13-36.png: "khong giong, toi uu lai". v11 only dressed slender 1-2 bay shafts. Here the heroes get their real
// masses: wide halls, drums, twin / triple towers, pylons, piers, splayed legs, as MEMBERS (anything that looks structural takes a TNT).
// 1) kind:"kit6" = a part built from an explicit member list (the generator computes it): {id, kind:"kit6", x, z, base:[w, d], fh,
//    m:[[key, x, y, z, sx, sy, sz, floor, gi, gj], ...], dress:{t:"G..", ...}}. Members are ordinary blocks (axis-aligned boxes, bonded
//    by contact in linkAll like every other member); the dress is visual decor riding on members, as in v11.
V5_PARTS.kit6 = function(P){
  var n0 = blocks.length, B = P.base || [6, 6];
  addBlock(0, -0.25, 0, B[0], 0.5, B[1], "base", {anchor:true});
  (P.m || []).forEach(function(q){ var b = addBlock(q[1], q[2], q[3], q[4], q[5], q[6], q[0], {floor:q[7] || 0}); if(q[8] != null){ b.gi = q[8]; b.gj = q[9]; } });
  if(P.dress) l11Dress(P, n0);
  return {w:B[0], d:B[1]};
};
// 2) the hero may be several parts (a bridge = pylons + deck + piers; a palace = wings + pyramid): L.hero = "A,Q,S". The fill is measured
//    on the box round all of them.
var l12Fill0 = L11_API.fill;
L11_API.fill = function(){
  var ids = String(L.hero || "A").split(","); if(ids.length < 2) return l12Fill0();
  var keep = L.hero, tall = ids[0], th = -1; ids.forEach(function(id){ var q = l11Box(function(b){ return b.bid === id; }); if(q.y1 > th){ th = q.y1; tall = id; } });
  var hb = l11Box(function(b){ return ids.indexOf(b.bid) >= 0; }), hs = l11Scr(hb), top = VY + topH(), bot = VY + VH - botH();
  L.hero = tall; var r = l12Fill0(); L.hero = keep;
  r.heroPx = Math.round(hs.y1 - hs.y0); r.screenFillPct = Math.round((Math.min(hs.y1, bot) - Math.max(hs.y0, top))/(bot - top)*100);
  r.heroW = +(hb.x1 - hb.x0).toFixed(1); r.heroWPct = Math.round((Math.min(hs.x1, VX + VW) - Math.max(hs.x0, VX))/VW*100);
  var sec = 0; r.secs = r.secs.filter(function(s){ return ids.indexOf(s.id) < 0; }); r.secs.forEach(function(s){ sec = Math.max(sec, s.h); }); r.secondaryRatio = +(sec/Math.max(1, hb.y1)).toFixed(2);
  return r;
};
// 3) dress helpers shared by the G-dresses below (same rules as v11 §7: visual only, riding on one member)
var L12 = {};
L12.tiers = function(S){ var P = S.P, T = P.tiers, BAY = P.bay || 2.7, FH = P.fh || 2.7, COL = 0.62*(P.colk || (P.bay ? Math.max(1, P.bay/2.7*0.85) : 1));
  var X0 = -(T[0].cx - 1)*BAY/2, Z0 = -(T[0].cz - 1)*BAY/2, out = [];
  T.forEach(function(t, ti){ var pi = ti === 0 ? -1 : (t.on != null ? t.on : ti - 1), y0 = pi < 0 ? 0 : out[pi].y1, f0 = pi < 0 ? 0 : out[pi].f1;
    var x0 = X0 + (t.ox || 0)*BAY - COL/2, x1 = X0 + ((t.ox || 0) + t.cx - 1)*BAY + COL/2, z0 = Z0 + (t.oz || 0)*BAY - COL/2, z1 = Z0 + ((t.oz || 0) + t.cz - 1)*BAY + COL/2;
    out.push({ x0:x0, x1:x1, z0:z0, z1:z1, y0:y0, y1:y0 + t.f*FH, f0:f0, f1:f0 + t.f, w:x1 - x0, d:z1 - z0, cx:(x0 + x1)/2, cz:(z0 + z1)/2, t:t }); });
  return out; };
L12.inT = function(q, m){ return m.floor >= q.f0 && m.floor < q.f1 && m.spawn.x > q.x0 - 0.3 && m.spawn.x < q.x1 + 0.3 && m.spawn.z > q.z0 - 0.3 && m.spawn.z < q.z1 + 0.3; };
var L12_DRESS = L11_DRESS;
// 4) G-dresses: the dress of a REBUILT hero (the masses are members; the dress adds roofs, trims, colours, cables, sails)
// G06 Glass Point: the stepped glass pyramid (kit ZIG): grey frame, a glass cap on the top deck, planters on the step corners
L12_DRESS.G06 = function(S){ var C = L11C, fr = 0x8D9AA3, k, n = S.nf, b;
  S.tintKeys({tdeck:fr, concrete:0x9AA4AC});
  S.strips(function(p){ return p.key === "glass"; }, function(p){ S.strip(p, fr, 0, -0.47, 1.0, 0.05); });
  for(k=0;k<n;k++){ b = S.B(k, k); var y = (k + 1)*S.FH; S.hy = y - 0.2;
    S.box(fr, 0, y, 0, b.w + 0.5, 0.18, b.d + 0.5);
    if(k < n - 1) [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(function(q){ S.box(C.green, q[0]*(b.w/2 - 0.7), y + 0.18, q[1]*(b.d/2 - 0.7), 0.9, 0.55, 0.9); }); }
  b = S.B(n - 1, n - 1); var top = n*S.FH + 0.18; S.hy = top - 0.4;
  S.box(C.glass, 0, top, 0, b.w*0.62, 2.0, b.d*0.62); S.box(fr, 0, top + 2.0, 0, b.w*0.62 + 0.3, 0.18, b.d*0.62 + 0.3);
  S.box(C.glass, 0, top + 2.18, 0, b.w*0.3, 1.5, b.d*0.3); S.box(fr, 0, top + 3.68, 0, b.w*0.3 + 0.24, 0.16, b.d*0.3 + 0.24); S.hy = null; };
// G06w: a palace wing behind the pyramid: red brick, cream bands and cornice, a slate mansard roof with dormers
L12_DRESS.G06w = function(S){ var C = L11C, b = S.B(0), top = b.y1, cr = 0xF0E3C4, f, k;
  S.tint(function(q){ return q.key === "slab" ? ((q.floor === 0 || q.floor === S.nf - 1) ? cr : 0xC66A48) : null; });
  S.band(cr, 0, 0.25, 0.4); S.band(cr, S.nf - 1, 0.45, 0.55);
  S.strips(function(p){ return p.key === "bkw" && 2*p.half[1] > 2; }, function(p){ S.strip(p, 0x3E5566, 0, 0.02, 0.3, 0.5); S.strip(p, cr, 0, 0.3, 0.4, 0.06); });
  S.hy = top; S.box(C.slate, 0, top, 0, b.w - 0.3, 1.5, b.d - 0.3); S.box(0x6F7480, 0, top + 1.5, 0, b.w - 1.3, 1.2, b.d - 1.3); S.box(C.slate, 0, top + 2.7, 0, b.w - 2.3, 0.3, b.d - 2.3);
  var nd = Math.max(2, Math.round(b.w/3)); for(k=0;k<nd;k++){ var x = b.x0 + b.w*(k + 0.5)/nd; [-1, 1].forEach(function(s){ S.box(cr, x, top + 0.2, s*(b.d/2 - 0.2), 0.9, 1.3, 0.5); S.box(0x3E5566, x, top + 0.45, s*(b.d/2 + 0.06), 0.5, 0.7, 0.06); }); }
  [-1, 1].forEach(function(s){ S.box(0xB7553A, s*(b.w/2 - 1.0), top + 1.5, 0, 0.7, 2.6, 0.7); }); S.hy = null; };
// G14 Dome Hall: a wide low hall (tier 0) with a drum (tier 1): cream stone, cornices, a stepped pediment, the big dome on the drum,
// a small dome on each wing
L12_DRESS.G14 = function(S){ var C = L11C, D = S.D, T = L12.tiers(S), h = T[0], dr = T[1], dc = D.c || 0x6B7280, top = h.y1, k, st = 0xDCD2BC;
  S.tintKeys({cpan:C.cream, slab:st, tdeck:st, concrete:0xEFE6D0});
  S.strips(function(p){ return p.key === "cpan" && 2*p.half[1] > 2; }, function(p){ S.strip(p, 0x4F6676, 0, 0, 0.2, 0.62); });
  S.strips(function(p){ return p.key === "cpan" && 2*p.half[1] <= 2; }, function(p){ S.strip(p, st, 0, 0.3, 0.9, 0.2); });
  S.band(st, 0, 0.3, 0.45); S.hy = top;
  S.box(C.cream, h.cx, top, h.cz, h.w + 1.1, 0.55, h.d + 1.1); S.box(st, h.cx, top + 0.55, h.cz, h.w + 0.5, 0.5, h.d + 0.5);
  var pw = Math.min(h.w*0.42, 7.5), py = top + 0.55;   // stepped pediment over the middle of the long front
  [[1, 0.7], [0.72, 0.6], [0.44, 0.55], [0.18, 0.45]].forEach(function(q){ S.box(C.cream, h.cx, py, h.z1 + 0.25, pw*q[0], q[1], 0.9); py += q[1]; });
  [-1, 1].forEach(function(s){ var x = h.cx + s*(h.w/2 - 2.3); S.cyl(C.cream, x, top + 1.05, h.cz, 3.0, 1.0, 3.0); S.dome(dc, x, top + 2.05, h.cz, 3.1, 1.9, 3.1); S.sph(C.gold, x, top + 3.8, h.cz, 0.4, 0.4, 0.4); });
  if(!dr){ S.hy = null; return; }
  S.tint(function(m){ return L12.inT(dr, m) && (m.key === "cpan" || m.key === "concrete") ? 0xE6DCC6 : null; });
  var y = dr.y1, Dd = Math.max(dr.w, dr.d)*1.34; S.hy = dr.y0; S.cyl(C.cream, dr.cx, dr.y0 + 1.05, dr.cz, Dd + 1.0, 0.5, Dd + 1.0);
  for(k=0;k<12;k++){ var a = k*Math.PI/6 + 0.26; S.cyl(C.white, dr.cx + Math.cos(a)*(Dd/2 + 0.1), dr.y0 + 1.55, dr.cz + Math.sin(a)*(Dd/2 + 0.1), 0.42, y - dr.y0 - 1.55, 0.42); }
  S.hy = y; S.cyl(C.cream, dr.cx, y, dr.cz, Dd + 1.2, 0.5, Dd + 1.2); y += 0.5; S.dome(dc, dr.cx, y, dr.cz, Dd + 0.5, Dd*0.62, Dd + 0.5); y += Dd*0.62;
  S.cyl(C.cream, dr.cx, y - 0.3, dr.cz, 1.5, 1.5, 1.5); y += 1.2; S.dome(dc, dr.cx, y, dr.cz, 1.8, 1.0, 1.8); y += 1.0; S.box(C.gold, dr.cx, y - 0.1, dr.cz, 0.18, 1.2, 0.18); S.hy = null; };
// G19 Stack Tower: five flared glass segments parted by dark plates, on dark stilts, a flat dark top
L12_DRESS.G19 = function(S){ var C = L11C, T = L12.tiers(S), dk = 0x4E525C, fr = 0x6F8C99;
  S.tint(function(q){ return (q.key === "crT" || q.key === "slab" || q.key === "tdeck") ? dk : q.key === "concrete" ? fr : null; });
  T.forEach(function(q, k){ var y = q.y1; S.hy = y - 0.2;
    S.box(C.tealD, q.cx, y - 2.2, q.cz, q.w + 0.5, 0.5, q.d + 0.5); S.box(C.tealD, q.cx, y - 1.6, q.cz, q.w + 0.9, 0.5, q.d + 0.9); S.box(C.teal, q.cx, y - 1.05, q.cz, q.w + 1.3, 0.55, q.d + 1.3);
    S.box(dk, q.cx, y - 0.5, q.cz, q.w + 1.9, 0.55, q.d + 1.9); });
  var t = T[T.length - 1]; S.hy = t.y1; S.box(dk, t.cx, t.y1 + 0.05, t.cz, t.w + 1.0, 0.8, t.d + 1.0); S.box(0x3A3D45, t.cx, t.y1 + 0.85, t.cz, t.w*0.5, 0.6, t.d*0.5); S.hy = null; };
// G30 The Sail: TWO sail towers (tiers 1 and 2) on one podium (tier 0): teal bodies with white floor lines, a bowed white sail on the
// outer side of each, masts, a high link bridge, palms on the podium (no water rim)
L12_DRESS.G30 = function(S){ var C = L11C, D = S.D, T = L12.tiers(S), pod = T[0], n = 12, tw = T.slice(1), cr = 0xEFE7D2;
  S.tint(function(m){ if(L12.inT(pod, m)) return m.key === "cpan" || m.key === "concrete" ? cr : (m.key === "slab" || m.key === "tdeck" || m.key === "sdeck") ? C.white : null;
    return m.key === "cpan" ? C.teal : (m.key === "slab" || m.key === "concrete") ? C.white : null; });
  S.strips(function(p){ return p.key === "cpan" && !L12.inT(pod, p); }, function(p){ S.strip(p, C.white, 0, 0, 1.0, 0.06); S.strip(p, C.tealD, 0, 0.25, 0.9, 0.3); S.strip(p, C.tealD, 0, -0.25, 0.9, 0.3); });
  tw.forEach(function(q){ var sd = q.cx < pod.cx ? -1 : 1, yb = q.y0, H = q.y1 - q.y0, bul = D.bulge || 0.2*H, xe = sd < 0 ? q.x0 : q.x1, pts = [], k;
    for(k=0;k<=n;k++){ var t = k/n; pts.push([xe + sd*(0.3 + bul*Math.pow(Math.sin(Math.PI*Math.min(1, t*0.95)), 0.8)), yb + H*1.16*t]); }
    S.hy = null;
    for(k=0;k<n;k++){ var p = pts[k], r = pts[k + 1];
      [-1, 1].forEach(function(s){ S.bar(C.white, p[0], p[1], q.cz + s*(q.d/2 - 0.1), r[0], r[1], q.cz + s*(q.d/2 - 0.1), 0.6, 0.6); });
      S.bar(0xECEBE4, p[0], p[1], q.cz, r[0], r[1], q.cz, 0.16, q.d - 0.5);
      if(k % 2 === 1 && p[1] < q.y1) [-1, 1].forEach(function(s){ S.bar(C.white, xe, p[1], q.cz + s*(q.d/2 - 0.1), p[0], p[1], q.cz + s*(q.d/2 - 0.1), 0.24, 0.24); }); }
    S.hy = q.y1; var tp = pts[n], xi = sd < 0 ? q.x1 : q.x0;
    S.box(C.white, q.cx, q.y1, q.cz, q.w + 0.3, 0.5, q.d + 0.3); S.bar(C.white, tp[0], tp[1] - 0.2, q.cz, xi, q.y1 + 0.5, q.cz, 0.5, 0.5);
    S.box(C.white, tp[0], tp[1] - 0.3, q.cz, 0.3, 6.5, 0.3); });
  if(tw.length > 1){ var a = tw[0], b = tw[1], yl = a.y0 + (a.y1 - a.y0)*0.72; S.hy = yl; S.box(C.white, (a.x1 + b.x0)/2, yl, pod.cz, b.x0 - a.x1 + 0.2, 1.4, a.d*0.5); S.box(C.tealD, (a.x1 + b.x0)/2, yl + 0.35, pod.cz, b.x0 - a.x1 - 0.6, 0.7, a.d*0.5 + 0.06); }
  S.hy = pod.y1; var x0 = tw[0].x1, x1 = tw.length > 1 ? tw[1].x0 : pod.x1, kk, np = Math.max(2, Math.round((x1 - x0)/1.6));
  for(kk=0;kk<np;kk++){ var px = x0 + (x1 - x0)*(kk + 0.5)/np; S.box(0x8A5A30, px, pod.y1, pod.z1 - 0.8, 0.2, 1.3, 0.2); S.sph(C.green, px, pod.y1 + 1.1, pod.z1 - 0.8, 1.2, 0.9, 1.2); }
  S.hy = null; };
// G17 Harp Span: the two A-frame pylons (kit PYL): fan cables from each head down to the deck on both sides, a cap on the head
L12_DRESS.G17 = function(S){ var C = L11C, P = S.P, D = S.D, xs = P.xs || [0], dy = P.deckY || 9, k, L = D.len || 6.5, wz = D.wz || 2.2;
  S.tintKeys({concrete:C.grey, tdeck:0xB9B8B4});
  xs.forEach(function(px){ var hb = null; S.slabs.forEach(function(m){ if(Math.abs(m.spawn.x - px) < 0.5 && (!hb || m.spawn.y > hb.spawn.y)) hb = m; }); if(!hb) return;
    var top = hb.spawn.y + hb.half[1], y0 = hb.spawn.y - hb.half[1]; S.hy = hb.spawn.y;
    S.box(C.greyD, px, top, 0, 2*hb.half[0] + 0.5, 0.5, 2*hb.half[2] + 0.5);
    for(k=1;k<=5;k++){ var ya = y0 + 0.6 + (k - 1)*((top - y0 - 1.0)/4), dx = L*k/5; [-1, 1].forEach(function(sx){ [-1, 1].forEach(function(sz){ S.bar(C.cable, px + sx*0.5, ya, sz*0.6, px + sx*dx, dy + 0.3, sz*wz, 0.2, 0.2); }); }); } });
  S.hy = null; };
// G17d: the road on a bridge deck (kit DECK): asphalt, kerbs, a centre line
L12_DRESS.G17d = function(S){ var C = L11C; S.tintKeys({sdeck:0x8E9299});
  S.slabs.forEach(function(m){ var w = 2*m.half[0], d = 2*m.half[2], y = m.spawn.y + m.half[1];
    l6KdAdd(m, "box", C.road, m.spawn.x, y + 0.06, m.spawn.z, w, 0.12, d - 0.9); l6KdAdd(m, "box", 0xE9E4D6, m.spawn.x, y + 0.14, m.spawn.z, w*0.5, 0.04, 0.16);
    [-1, 1].forEach(function(s){ l6KdAdd(m, "box", C.grey, m.spawn.x, y + 0.3, m.spawn.z + s*(d/2 - 0.2), w, 0.6, 0.3); }); }); };
// G17p: a bridge end pier (kit PIERS): a darker cap
L12_DRESS.G17p = function(S){ S.tintKeys({concrete:L11C.grey}); };
// G32 Big Bow pylon pair: a sandstone base (tier 0) carrying two squat towers (tiers 1, 2) with stepped tops, the road passes between them
L12_DRESS.G32 = function(S){ var C = L11C, T = L12.tiers(S), b = T[0];
  S.tintKeys({cpan:C.sand, slab:C.sandD, tdeck:C.sandD, concrete:0xE8C375});
  S.strips(function(p){ return p.key === "cpan" && 2*p.half[1] > 2 && p.floor >= 1; }, function(p){ S.strip(p, 0x8A6A32, 0, 0.05, 0.2, 0.5); });
  S.hy = b.y1; S.box(C.sandD, b.cx, b.y1 - 0.5, b.cz, b.w + 0.7, 0.5, b.d + 0.7);
  T.slice(1).forEach(function(q){ S.hy = q.y1; S.steps(q.cx, q.y1, q.cz, q.w, q.d, [[1.08, 0.5, C.sandD], [0.86, 1.6, C.sand], [0.62, 1.4, C.sand], [0.4, 1.2, C.sand], [0.2, 0.9, C.sandD]], C.sandD); });
  S.hy = null; };
// G25 The Bullet: a fat glass barrel with a flat top: round bands that swell towards the middle, a diagonal grid on every pane, a low round cap
L12_DRESS.G25 = function(S){ var C = L11C, b = S.B(0), top = b.y1, f, n = S.nf, R0 = Math.max(b.w, b.d)*1.3;
  var rad = function(t){ return R0*(0.86 + 0.2*Math.sin(Math.PI*Math.min(1, Math.max(0, t)))); };
  S.tintKeys({slab:C.greyD, concrete:0x8D9AA3});
  for(f=0; f<n; f++){ var r = rad((f + 1)/n); S.cyl(C.greyD, 0, (f + 1)*S.FH - 0.4, 0, r, 0.42, r); }
  S.strips(function(p){ return p.key === "glass"; }, function(p){ var W = 2*Math.max(p.half[0], p.half[2]), H = 2*p.half[1], k;
    for(k=-1;k<=1;k+=2){ var a = Math.atan2(H, W/2), L = Math.sqrt(W*W/4 + H*H)/W*0.98, xn = p.half[0] < p.half[2];
      [-0.25, 0.25].forEach(function(u){ S.strip(p, C.greyD, u, 0, L, 0.26/H, (xn ? -1 : 1)*k*a*(u < 0 ? 1 : -1)); }); } });
  S.hy = top; var rt = rad(1); S.cyl(C.greyD, 0, top, 0, rt + 0.3, 0.5, rt + 0.3); S.cyl(C.glass, 0, top + 0.5, 0, rt*0.92, 1.6, rt*0.92); S.dome(C.glass, 0, top + 2.1, 0, rt*0.92, 1.6, rt*0.92);
  S.cyl(C.slate, 0, top + 3.3, 0, rt*0.5, 0.5, rt*0.5); S.hy = null; };
// G03 Rivet Tower (kit TRI): dark iron, lattice bracing on the three legs and the shaft, a gallery round the deck, a cabin roof and an antenna
L12_DRESS.G03 = function(S){ var C = L11C, P = S.P, G = P.legs, ir = 0x4B4C57, k, li, n = G.ang.length;
  S.tintKeys({steel:ir, tdeck:0x5B5D69});
  var pos = function(li, y){ var a = G.ang[li % n]*Math.PI/180, r = G.R0 - G.dr*(y/G.sh - 0.5); return [Math.cos(a)*r, Math.sin(a)*r]; };
  for(k=0;k<G.nL;k++){ var y0 = k*G.sh + 0.3, y1 = (k + 1)*G.sh - 0.2; S.hy = k*G.sh + 1;
    for(li=0;li<n;li++){ var a0 = pos(li, y0), b0 = pos(li + 1, y0), a1 = pos(li, y1), b1 = pos(li + 1, y1), hs = null;
      S.all.forEach(function(m){ if(m.key === "steel" && m.floor === k && Math.abs(m.spawn.x - a0[0]) < 1.2 && Math.abs(m.spawn.z - a0[1]) < 1.2) hs = m; }); if(!hs) continue;
      l11Bar(hs, ir, a0[0], y1, a0[1], b0[0], y1, b0[1], 0.22, 0.22); l11Bar(hs, ir, a0[0], y0, a0[1], b1[0], y1, b1[1], 0.16, 0.16); l11Bar(hs, ir, a1[0], y1, a1[1], b0[0], y0, b0[1], 0.16, 0.16); } }
  var slabs = S.slabs.slice().sort(function(a, b){ return a.spawn.y - b.spawn.y; }), dk = slabs[0], dy = dk.spawn.y + dk.half[1], dw = 2*dk.half[0];
  l6KdAdd(dk, "cyl", 0x5B5D69, 0, dy - 0.5, 0, dw*1.25, 0.5, dw*1.25); l6KdAdd(dk, "cyl", C.teal, 0, dy + 0.45, 0, dw*1.12, 0.9, dw*1.12); l6KdAdd(dk, "cyl", ir, 0, dy + 1.0, 0, dw*1.2, 0.2, dw*1.2);
  for(k=1;k<slabs.length;k++){ var lo = slabs[k - 1], hi = slabs[k], ya = lo.spawn.y + lo.half[1], yb = hi.spawn.y - hi.half[1], hw = hi.half[0] - 0.6, last = k === slabs.length - 1; if(last) break;
    [[1, 1, -1, 1], [-1, 1, -1, -1], [-1, -1, 1, -1], [1, -1, 1, 1]].forEach(function(q){ l11Bar(hi, ir, q[0]*hw, ya, q[1]*hw, q[2]*hw, yb, q[3]*hw, 0.14, 0.14); l11Bar(hi, ir, q[2]*hw, ya, q[3]*hw, q[0]*hw, yb, q[1]*hw, 0.14, 0.14); }); }
  var tp = slabs[slabs.length - 1], ty = tp.spawn.y + tp.half[1]; l6KdAdd(tp, "cone", ir, 0, ty + 1.0, 0, 2*tp.half[0]*0.8, 2.0, 2*tp.half[2]*0.8); l6KdAdd(tp, "box", ir, 0, ty + 5.0, 0, 0.2, 6.0, 0.2); l6KdAdd(tp, "sph", C.red, 0, ty + 8.1, 0, 0.5, 0.5, 0.5);
  S.hy = null; };
// G26 The Pencil: a cream needle tower (tier 1) with a long pyramid point; ONE wing = the lower block beside it (tier 0) with a stepped top
L12_DRESS.G26 = function(S){ var C = L11C, T = L12.tiers(S), lo = T[0], t = T[1], cr = 0xF0E6D0, st = 0xDCCFB2, top = t.y1;
  S.tintKeys({cpan:cr, slab:st, tdeck:st, concrete:cr});
  S.strips(function(p){ return p.key === "cpan" && 2*p.half[1] > 2; }, function(p){ S.strip(p, C.teal, 0, 0, 0.26, 0.86); });
  S.strips(function(p){ return p.key === "cpan" && 2*p.half[1] <= 2; }, function(p){ S.strip(p, st, 0, 0.3, 0.9, 0.2); });
  S.band(st, 0, 0.3, 0.45);
  S.hy = top; S.box(cr, t.cx, top, t.cz, t.w + 0.5, 0.6, t.d + 0.5); S.cone(cr, t.cx, top + 0.6, t.cz, t.w + 0.2, 14, t.d + 0.2);
  [-1, 1].forEach(function(s){ S.cone(C.teal, t.cx, top + 0.6, t.cz + s*t.d*0.36, t.w*0.3, 9.5, 0.5); S.cone(C.teal, t.cx + s*t.w*0.36, top + 0.6, t.cz, 0.5, 9.5, t.d*0.3); });
  S.box(C.gold, t.cx, top + 14.4, t.cz, 0.2, 2.2, 0.2);
  var x0 = t.x1, x1 = lo.x1, wf = x1 - x0; if(wf > 1){ S.hy = lo.y1; var y = lo.y1;
    [[0.9, 2.6], [0.62, 2.4], [0.34, 2.2]].forEach(function(q){ S.box(cr, x0 + wf*q[0]/2, y, lo.cz, wf*q[0], q[1], lo.d*(0.5 + q[0]*0.4)); S.box(C.teal, x0 + wf*q[0]/2, y + 0.5, lo.cz, wf*q[0]*0.7, q[1] - 1.0, lo.d*(0.5 + q[0]*0.4) + 0.06); y += q[1]; S.box(st, x0 + wf*q[0]/2, y - 0.25, lo.cz, wf*q[0] + 0.25, 0.25, lo.d*(0.5 + q[0]*0.4) + 0.25); }); }
  S.hy = null; };
// G34 Tube Bundle: square tubes of different heights bundled together (nested tiers = REAL heights): smoky glass, dark posts and rims,
// a rim on every tube top; D.caps = [[i, j, h], ...] extra tube heads (a mechanical floor) so that five tubes have five heights
L12_DRESS.G34 = function(S){ var C = L11C, P = S.P, T = L12.tiers(S), sm = 0x4F6C7E, dk = 0x2F3A44, BAY = P.bay || 2.7, t0 = T[0], nx = t0.t.cx - 1, nz = t0.t.cz - 1, i, j;
  S.tintKeys({cpan:sm, slab:dk, tdeck:dk, concrete:dk});
  S.strips(function(p){ return p.key === "cpan" && 2*p.half[1] > 2; }, function(p){ [-0.25, 0.25].forEach(function(u){ S.strip(p, 0x86A9B8, u, 0.22, 0.3, 0.3); S.strip(p, 0x86A9B8, u, -0.22, 0.3, 0.3); }); });
  var X0 = -(nx)*BAY/2, Z0 = -(nz)*BAY/2;
  for(i=0;i<nx;i++) for(j=0;j<nz;j++){ var top = 0; T.forEach(function(q){ var ox = q.t.ox || 0, oz = q.t.oz || 0; if(i >= ox && i < ox + q.t.cx - 1 && j >= oz && j < oz + q.t.cz - 1) top = Math.max(top, q.y1); });
    var x = X0 + (i + 0.5)*BAY, z = Z0 + (j + 0.5)*BAY, cap = 0; (S.D.caps || []).forEach(function(c){ if(c[0] === i && c[1] === j) cap = c[2]; });
    S.hy = top; if(cap){ S.box(sm, x, top, z, BAY - 0.5, cap, BAY - 0.5); S.box(dk, x, top + cap*0.5 - 0.15, z, BAY - 0.4, 0.3, BAY - 0.4); }
    S.box(dk, x, top + cap, z, BAY + 0.1, 0.45, BAY + 0.1); S.box(0x2B333A, x, top + cap + 0.45, z, BAY - 1.0, 0.14, BAY - 1.0); }
  S.hy = null; };
// G07d: the glazed walkway on a sky-bridge plate (kit)
L12_DRESS.G07d = function(S){ var C = L11C; S.tintKeys({sdeck:0x8D9AA3});
  S.slabs.forEach(function(m){ var w = 2*m.half[0], d = 2*m.half[2], y = m.spawn.y + m.half[1]; l6KdAdd(m, "box", C.glass, m.spawn.x, y + 1.1, m.spawn.z, w - 0.3, 2.2, d - 0.3); l6KdAdd(m, "box", 0x8D9AA3, m.spawn.x, y + 2.3, m.spawn.z, w, 0.2, d); }); };
// G28 Stripey Light: a FAT banded lighthouse: red / white bands on a real 5 m shaft, round rings, a gallery, a glass lantern, a dark dome, rock paving
L12_DRESS.G28 = function(S){ var C = L11C, b = S.B(0), top = b.y1, f, k, a, RD = 0xD9553A, W = Math.max(b.w, b.d), R = W*1.36;
  S.tint(function(q){ var br = Math.floor(q.floor/2) % 2 === 0; if(q.key === "slab") return br ? RD : C.white; if(q.key === "cpan" || q.key === "concrete") return C.white; if(q.key === "bkw") return RD; return null; });
  for(f=0; f<S.nf-1; f++) S.cyl(Math.floor(f/2) % 2 === 0 ? RD : C.white, 0, (f + 1)*S.FH - 0.4, 0, R, 0.42, R);
  S.ground("cyl", C.greyD, 0, 0, 0, R*1.9, 0.25, R*1.9); S.ground("cyl", 0x9FA3AA, 0, 0.25, 0, R*1.5, 0.3, R*1.5);
  S.hy = top; var y = top, G = R*1.3; S.cyl(C.iron, 0, y, 0, G, 0.5, G); y += 0.5;
  for(k=0;k<12;k++){ a = k*Math.PI/6; var a2 = (k + 1)*Math.PI/6, r = G/2 - 0.2; S.box(C.iron, Math.cos(a)*r, y, Math.sin(a)*r, 0.18, 1.1, 0.18);
    S.bar(C.iron, Math.cos(a)*r, y + 1.1, Math.sin(a)*r, Math.cos(a2)*r, y + 1.1, Math.sin(a2)*r, 0.16, 0.16); }
  S.cyl(C.white, 0, y, 0, W*0.95, 1.3, W*0.95); y += 1.3; S.cyl(C.teal, 0, y, 0, W*0.8, 3.4, W*0.8);
  for(k=0;k<6;k++){ a = k*Math.PI/3; S.box(C.iron, Math.cos(a)*W*0.4, y, Math.sin(a)*W*0.4, 0.2, 3.4, 0.2); } y += 3.4;
  S.cyl(C.iron, 0, y, 0, W*1.02, 0.35, W*1.02); y += 0.35; S.dome(C.slate, 0, y, 0, W*0.98, W*0.55, W*0.98); y += W*0.55; S.sph(C.iron, 0, y - 0.2, 0, 0.9, 0.9, 0.9); S.box(C.iron, 0, y + 0.5, 0, 0.16, 1.3, 0.16); S.hy = null; };
// G21 The Pedestal: a broad sandstone plinth with pilasters and a heavy flat top (no statue), a low star wall round it (scaled to the plinth)
L12_DRESS.G21 = function(S){ var C = L11C, b = S.B(0), top = b.y1, k, f0 = 0;
  while(f0 < S.nf && !S.pan.some(function(p){ return p.floor === f0; })) f0++;
  S.tintKeys({cpan:C.sand, slab:C.sandD, tdeck:C.sandD, concrete:0xE8C375});
  S.strips(function(p){ return p.key === "cpan"; }, function(p){ S.strip(p, C.sandD, -0.3, 0, 0.1, 0.94); S.strip(p, C.sandD, 0.3, 0, 0.1, 0.94); });
  if(f0 > 0){ S.band(C.sandD, f0 - 1, 0.5, 0.6); S.band(C.sand, f0 - 1, 0.28, 0.3, 0.3); }
  S.hy = top; S.steps(0, top, 0, 1, 1, [[b.w + 0.7, 0.7, C.sandD, b.d + 0.7], [b.w + 1.9, 1.0, C.sand, b.d + 1.9], [b.w + 2.7, 0.8, C.sandD, b.d + 2.7], [b.w + 1.3, 1.7, C.sand, b.d + 1.3], [b.w + 2.0, 0.6, C.sandD, b.d + 2.0]]); S.hy = null;
  var r = Math.max(b.w, b.d)*0.5 + 3.2, L = 2*r;
  S.ground("box", C.green, 0, 0, 0, L, 0.1, L); S.ground("box", C.green, 0, 0, 0, L, 0.1, L, 0, Math.PI/4, 0);
  for(k=0;k<8;k++){ var a = k*Math.PI/4; S.ground("box", k % 2 ? C.sand : C.sandD, Math.cos(a)*r, 0, Math.sin(a)*r, 0.6, 0.75, L + 0.6, 0, -a, 0); } };
// G22 The Stepper: a sand setback tower: the setbacks are REAL tiers; pilasters, a band at each setback, a stepped top with a teal lantern and a gold cap
L12_DRESS.G22 = function(S){ var C = L11C, T = L12.tiers(S), up = T[T.length - 1], top = up.y1;
  S.tintKeys({cpan:C.sand, slab:C.sandD, tdeck:C.sandD, concrete:0xE8C375});
  S.strips(function(p){ return p.key === "cpan" && 2*p.half[1] > 2; }, function(p){ S.strip(p, C.sandD, 0, 0, 0.12, 0.94); });
  S.strips(function(p){ return p.key === "cpan" && 2*p.half[1] <= 2; }, function(p){ S.strip(p, 0x4F6676, 0, 0.9, 0.3, 0.7); });
  T.forEach(function(q){ S.hy = q.y1; S.box(C.sandD, q.cx, q.y1 - 0.45, q.cz, q.w + 0.6, 0.45, q.d + 0.6); S.box(C.sand, q.cx, q.y1, q.cz, q.w + 0.3, 0.35, q.d + 0.3); });
  S.hy = top; var y = S.steps(up.cx, top + 0.35, up.cz, up.w, up.d, [[0.84, 2.6, C.sand], [0.64, 2.4, C.sand]], C.sandD);
  S.box(C.teal, up.cx, y, up.cz, up.w*0.46, 2.8, up.d*0.46); [-1, 1].forEach(function(a){ [-1, 1].forEach(function(c){ S.box(C.sand, up.cx + a*up.w*0.23, y, up.cz + c*up.d*0.23, 0.34, 2.8, 0.34); }); }); y += 2.8;
  S.steps(up.cx, y, up.cz, up.w, up.d, [[0.56, 0.5, C.sandD], [0.36, 1.3, C.sand], [0.2, 1.0, C.gold]]); S.hy = null; };
// G31 The Splinter: a glass shard that really tapers (tier 1 narrower than tier 0), a long split point: two shards and a low third
L12_DRESS.G31 = function(S){ var C = L11C, T = L12.tiers(S), lo = T[0], b = T[T.length - 1], top = b.y1, f, fr = 0x8D9AA3;
  S.tintKeys({slab:fr, tdeck:fr, concrete:0x9AA4AC}); for(f=1; f<S.nf-1; f+=2) S.band(fr, f, 0.12, 0.25);
  if(T.length > 1){ S.hy = lo.y1; [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(function(q){ var wx = (lo.w - b.w)/2 + 0.3, wz = (lo.d - b.d)/2 + 0.3;
      S.cone(C.glass, lo.cx + q[0]*(lo.w/2 - wx/2), lo.y1, lo.cz + q[1]*(lo.d/2 - wz/2), wx, 6.5, wz); });
    [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function(q){ S.box(0x57AEC2, lo.cx + q[0]*(lo.w/2 - 0.5), lo.y1, lo.cz + q[1]*(lo.d/2 - 0.5), q[0] ? 0.9 : b.w*0.8, 2.2, q[0] ? b.d*0.8 : 0.9); }); }
  S.hy = top; S.box(fr, b.cx, top, b.cz, b.w + 0.3, 0.4, b.d + 0.3);
  S.cone(C.glass, b.cx - b.w*0.12, top + 0.4, b.cz + b.d*0.1, b.w*0.8, 13, b.d*0.8); S.cone(0x4A9DB4, b.cx + b.w*0.24, top + 0.4, b.cz - b.d*0.2, b.w*0.52, 16, b.d*0.52);
  S.cone(0x57AEC2, b.cx - b.w*0.3, top + 0.4, b.cz - b.d*0.3, b.w*0.36, 8, b.d*0.36); S.hy = null; };
// G35 Cube Grove (kit CUBEK): a big yellow cube house on one dark pole: pointed slate roof, a yellow point under the cube, teal windows
L12_DRESS.G35 = function(S){ var C = L11C, sl = S.slabs.slice().sort(function(a, b){ return a.spawn.y - b.spawn.y; }), lo = sl[0], hi = sl[sl.length - 1], w = 2*lo.half[0], d = 2*lo.half[2], top = hi.spawn.y + hi.half[1], y0 = lo.spawn.y - lo.half[1];
  S.tintKeys({bkw:C.yellow, slab:0xDDAE1E});
  S.strips(function(p){ return p.key === "bkw"; }, function(p){ S.strip(p, C.tealD, -0.24, 0.05, 0.22, 0.36); S.strip(p, C.tealD, 0.24, 0.05, 0.22, 0.36); });
  l6KdAdd(hi, "box", 0x8F939B, 0, top + 0.14, 0, w + 0.4, 0.28, d + 0.4); l6KdAdd(hi, "cone", 0x9A9EA7, 0, top + 0.28 + 2.3, 0, w + 0.2, 4.6, d + 0.2);
  l6KdAdd(lo, "cone", 0xDDAE1E, 0, y0 - 1.7, 0, w - 0.6, 3.4, d - 0.6, Math.PI, 0, 0); };
// G16 Deco Needle: a grey stone tower on a REAL wider base (tier 0), dark window strips, small steps on the base shoulders, a long
// stepped crown of square terraces and a needle on the shaft (last tier)
L12_DRESS.G16 = function(S){ var C = L11C, T = L12.tiers(S), lo = T[0], b = T[T.length - 1], top = b.y1, f, st = 0xB3B1AC;
  S.tintKeys({cpan:C.grey, slab:st, tdeck:st});
  S.strips(function(p){ return p.key === "cpan" && 2*p.half[1] > 2; }, function(p){ S.strip(p, 0x5E6A75, -0.2, 0, 0.14, 0.86); S.strip(p, 0x5E6A75, 0.2, 0, 0.14, 0.86); });
  S.strips(function(p){ return p.key === "cpan" && 2*p.half[1] <= 2; }, function(p){ S.strip(p, C.greyD, 0, 0, 0.12, 0.9); });
  for(f=2; f<S.nf-1; f+=3) S.band(st, f, 0.22, 0.35);
  if(T.length > 1){ S.hy = lo.y1; [-1, 1].forEach(function(s){ var x0 = s < 0 ? lo.x0 : b.x1, x1 = s < 0 ? b.x0 : lo.x1, wf = x1 - x0, xi = s < 0 ? x1 : x0; if(wf < 0.8) return;
      S.box(C.grey, xi + s*wf*0.8/2, lo.y1, lo.cz, wf*0.8, 2.8, lo.d - 0.6); S.box(st, xi + s*wf*0.8/2, lo.y1 + 2.8, lo.cz, wf*0.8 + 0.2, 0.25, lo.d - 0.4);
      S.box(C.grey, xi + s*wf*0.42/2, lo.y1 + 3.05, lo.cz, wf*0.42, 2.4, lo.d - 1.6); S.box(st, xi + s*wf*0.42/2, lo.y1 + 5.45, lo.cz, wf*0.42 + 0.2, 0.25, lo.d - 1.4); }); }
  S.hy = top; var y = S.steps(b.cx, top, b.cz, b.w, b.d, [[1.1, 0.5, st], [0.88, 2.4, C.grey], [0.74, 2.2, C.grey], [0.6, 2.0, C.grey], [0.46, 2.0, C.grey], [0.33, 1.8, C.grey], [0.21, 1.8, C.grey], [0.12, 1.5, C.greyD]], st);
  [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function(q){ S.box(0x5E6A75, b.cx + q[0]*b.w*0.44, top + 0.9, b.cz + q[1]*b.d*0.44, q[0] ? 0.06 : b.w*0.3, 1.8, q[0] ? b.d*0.3 : 0.06); });
  S.box(C.greyD, b.cx, y, b.cz, 0.26, 5.5, 0.26); S.hy = null; };
// G12 Sky Steps: a super-tall glass tower whose setbacks are REAL tiers; glass sub-steps on both shoulders of every setback, a long
// stepped glass top and a needle
L12_DRESS.G12 = function(S){ var C = L11C, T = L12.tiers(S), b = T[T.length - 1], top = b.y1, fr = 0x8D9AA3, f, i;
  S.tintKeys({slab:fr, tdeck:fr, concrete:0x9AA4AC});
  for(f=0; f<S.nf; f++) S.band(fr, f, 0.14, 0.3);
  for(i=1;i<T.length;i++){ var lo = T[i - 1], up = T[i]; if(lo.w - up.w < 1) continue; S.hy = lo.y1;
    [-1, 1].forEach(function(s){ var x0 = s < 0 ? lo.x0 : up.x1, x1 = s < 0 ? up.x0 : lo.x1, wf = x1 - x0, xi = s < 0 ? x1 : x0; if(wf < 0.8) return;
      S.box(C.glass, xi + s*wf*0.82/2, lo.y1, lo.cz, wf*0.82, 4.4, lo.d - 0.5); S.box(fr, xi + s*wf*0.82/2, lo.y1 + 4.4, lo.cz, wf*0.82 + 0.24, 0.24, lo.d - 0.26);
      S.box(C.glass, xi + s*wf*0.44/2, lo.y1 + 4.64, lo.cz, wf*0.44, 3.8, lo.d - 1.3); S.box(fr, xi + s*wf*0.44/2, lo.y1 + 8.44, lo.cz, wf*0.44 + 0.24, 0.24, lo.d - 1.06); }); }
  S.hy = top; var y = S.steps(b.cx, top, b.cz, b.w, b.d, [[0.82, 4.2, C.glass], [0.62, 4.2, C.glass], [0.44, 3.6, C.glass], [0.28, 3.2, C.glass], [0.14, 2.6, C.glass]], fr);
  S.box(fr, b.cx, y, b.cz, 0.26, 7.5, 0.26); S.hy = null; };
// 5) P.loose on a part: its members STAND on the ground slab instead of being fixed into it (no bond to the anchor base; every bond
//    between members is as before). A cut building then takes its last ground columns with it instead of leaving 4 m stubs standing,
//    and a leg of a tripod or an A-frame comes down with the rest. Members, strengths and the TNT ladder are untouched.
//    P.spire = [w, h, key]: a real core member standing on the middle of the highest roof (the lantern core of a dome).
//    P.loose = 1: every member; P.loose = "x-" | "x+" | "z-" | "z+": only the members on that half of the part. A steel-legged tower is
//    loose on the side AWAY from the legs the plan stacks on: fully loose, four single TNT (one per leg) shoved it over although no
//    leg broke (measured on L33's tank tower), which would break the rule "steel: stack two". Fixed on the stack side it stands.
function l12Loose(P, n0){ var s = P.loose; if(!s) return; var ax = typeof s === "string" ? s[0] : null, sg = ax ? (s[1] === "+" ? 1 : -1) : 0;
  for(var i=n0;i<blocks.length;i++){ var b = blocks[i]; if(b.anchor) continue; if(!ax || (ax === "x" ? b.spawn.x : b.spawn.z)*sg > 0.05) b.loose = 1; } }
var l12MassIn = V5_PARTS.mass;
function l12Mass(P){
  var n0 = blocks.length, D = P.dress, r, i;
  if(P.spire){ var Q = Object.assign({}, P); delete Q.dress; r = l12MassIn(Q);
    var top = null; for(i=n0;i<blocks.length;i++){ var b = blocks[i]; if(b.anchor || !L11_SLAB[b.key]) continue; if(!top || b.spawn.y > top.spawn.y + 0.01) top = b; }
    var x0 = 1e9, x1 = -1e9, z0 = 1e9, z1 = -1e9; for(i=n0;i<blocks.length;i++){ b = blocks[i]; if(b.anchor || !L11_SLAB[b.key] || Math.abs(b.spawn.y - top.spawn.y) > 0.05) continue;
      x0 = Math.min(x0, b.spawn.x - b.half[0]); x1 = Math.max(x1, b.spawn.x + b.half[0]); z0 = Math.min(z0, b.spawn.z - b.half[2]); z1 = Math.max(z1, b.spawn.z + b.half[2]); }
    addBlock((x0 + x1)/2, top.spawn.y + top.half[1] + P.spire[1]/2, (z0 + z1)/2, P.spire[0], P.spire[1], P.spire[0], P.spire[2] || "tdeck", {floor:top.floor + 1});
    if(D) l11Dress(P, n0); }
  else r = l12MassIn(P);
  l12Loose(P, n0);
  return r;
}
LANDMARK_BUILD.mass = l12Mass; V5_PARTS.mass = l12Mass;
var l12Kit0 = V5_PARTS.kit6; V5_PARTS.kit6 = function(P){ var n0 = blocks.length, r = l12Kit0(P); l12Loose(P, n0); return r; };
var l12Link0 = linkAll;
linkAll = function(){ l12Link0();
  for(var i=links.length-1;i>=0;i--){ var l = links[i]; if(!((l.a.anchor && l.b.loose) || (l.b.anchor && l.a.loose))) continue;
    try{ world.removeImpulseJoint(l.j, true); }catch(e){}
    links.splice(i, 1); var ia = l.a.links.indexOf(l); if(ia >= 0) l.a.links.splice(ia, 1); var ib = l.b.links.indexOf(l); if(ib >= 0) l.b.links.splice(ib, 1); } };
// 6) test API: triangles and draw calls of the last rendered frame (the level gate's "aim <= 60k triangles")
L11_API.tri = function(){ return { tri:renderer.info.render.triangles, calls:renderer.info.render.calls, kd:L6_KD.list.length }; };
// 7) scale rule (LEVEL-BRIEF-100 §5.2: the hero fills 60-75% of the play area's height at the opening camera; "the camera pulls back for
//    the whole lot"): L.fillMax = the largest share of the play-area height the hero's box (with its drawn crown) may take. The camera
//    distance fitted to the lot is lengthened until the hero is under it. Camera only: no member, bond or rule is touched.
var l12Fit0 = fitDist;
fitDist = function(bx, yw){
  var d = l12Fit0(bx, yw), fm = L && L.fillMax; if(!fm || !blocks.length) return d;
  var ids = String(L.hero || "A").split(","), hb = l11Box(function(b){ return ids.indexOf(b.bid) >= 0; }); if(!hb.n) return d;
  var usable = Math.max(0.3, 1 - (topH() + botH())/VH);
  for(var it=0; it<4; it++){ var f = boxExtent(hb, yw, d, focusY).h/usable; if(f <= fm) break; d *= f/fm; }
  return d;
};
// G24 The Doorstop (kit WEDGE): a REAL wedge block: red brick, cream stone nose (flat cut) and bands, teal windows, a stepped slate roof
L12_DRESS.G24 = function(S){ var C = L11C, W = S.P.wedge, X = W.X, D = W.D, st = 0xEFE3C8, top = W.F*S.FH, i;
  S.tint(function(q){ if(q.spawn.x < X[1] - 0.5 && q.key !== "slab") return st; if(q.key === "slab") return (q.floor % 3 === 2 || q.floor === 0) ? st : 0xC66A48; return null; });
  S.strips(function(p){ return p.key === "bkw" && 2*p.half[1] > 2 && p.half[0] > p.half[2]; }, function(p){ S.strip(p, C.tealD, -0.22, 0.03, 0.2, 0.5); S.strip(p, C.tealD, 0.22, 0.03, 0.2, 0.5); });
  S.strips(function(p){ return p.key === "bkw" && 2*p.half[1] > 2 && p.half[0] < p.half[2]; }, function(p){ S.strip(p, C.tealD, 0, 0.03, 0.5, 0.5); });
  S.slabs.forEach(function(m){ if(m.floor !== W.F - 1) return; var w = 2*m.half[0], d = 2*m.half[2];
    l6KdAdd(m, "box", st, m.spawn.x, top + 0.25, m.spawn.z, w + 0.5, 0.5, d + 0.7); l6KdAdd(m, "box", C.slate, m.spawn.x, top + 1.1, m.spawn.z, w, 1.2, d*0.82); l6KdAdd(m, "box", 0x6F7480, m.spawn.x, top + 1.95, m.spawn.z, w*0.9, 0.5, d*0.6); }); };
