  // ---- main/polish2.js (POLISH2, Khai D-blast-POLISH2 28/11: "các tòa nhà phụ nhìn rất chán, không chỉn chu ... chưa đủ cao để tạo điểm
  // nhấn ... sắp layout như một câu chuyện"). Appended LAST inside main() (after flick). DECOR ONLY: every piece is an L6_KD decor piece
  // riding on a member that was already there (l6KdAdd): no body, no bond, no pose, no rule, no member added, moved or re-keyed, so the
  // physics of every level is bit-identical (physprof hashes unchanged) and the difficulty cannot drift. Only existing decor kinds
  // (box / ibox / icyl / ibush / lit / prism / cone / cyl). ?polish2=0 = off (before / after shots).
  //   P.p2 on a generic `mass` part (the old levels' side buildings): { style:"brick" | "office" | "timber", roof:"flat" | "gable" | "pyr",
  //     rh (roof height m), shop:1 (shopfront + awning on the front ground storey), sign:1 (blank roof board), tank:1, ac:n, hut:1, mast:1,
  //     chim:n, c:{...colour overrides}, site:[...] }   site = ground pieces in the part's own coordinates, on its base slab (below)
  //   K.p2 on a protected building (keep6): { site:[...] }
  //   site pieces: ["pave", x, z, w, d, col] · ["path", x0, z0, x1, z1, w, col] · ["fence", x0, z0, x1, z1, col] · ["hedge", x0, z0, x1, z1]
  //     · ["tree", x, z, s] · ["lamp", x, z] · ["bench", x, z, alongX] · ["plant", x, z] · ["kerb", x0, z0, x1, z1] · ["post", x, z]
  //     · ["isle", x, z, w, d, col] (a raised kerbed island) · ["bay", x, z, w, d, alongX] (painted parking / ambulance bay lines) · ["flag", x, z]
  (function(){
    var Q2 = new URLSearchParams(location.search), OFF2 = Q2.get("polish2") === "0";
    var P2 = window.__blast.polish2 = { on:!OFF2, pieces:0, parts:0, sites:0, rmax:0, err:null };
    if(OFF2 || typeof A1 === "undefined" || !A1.h || !V5_PARTS.mass) return;
    var H = A1.h, kq = H.kq, bar = H.bar, near = H.near;
    var kd = function(){ P2.pieces++; return l6KdAdd.apply(null, arguments); };
    var C0 = { white:0xF6F2EA, cream:0xF1E6CC, stone:0xD9D2C2, stoneD:0xB4AC9C, glass:0x9FC3D6, glassD:0x5F8AA3, glassN:0x3E5F78, lit:0xFFD98A, warm:0xFFF1C4,
      wood:0xC58B55, woodD:0x8A5A33, woodL:0xE2B77E, plank:0xD9A45E, shingle:0x7C5A3C, shingleD:0x5E4330, slate:0x4F5A68, slateD:0x3B4450, tile:0xB0503A, tileD:0x8E3E2D,
      brick:0xB5543A, brickD:0x8C3E2B, conc:0xD6D3CC, concD:0x9EA2A8, concL:0xE8E5DE, iron:0x3B4048, steel:0x6E7C8C, green:0x3F6F55, greenD:0x2E5541, red:0xB8432F,
      teal:0x3F93A8, navy:0x2F4A6E, gold:0xE8B23A, leaf:0x4F8F46, leafD:0x3C7438, trunk:0x7A5236, pave:0xCFC8B8, paveD:0xB3AC9C, lawn:0x7FB069, kerb:0xE9E4D8,
      path:0xD8CFB8, line:0xF4F1E8, door:0x6B3F2A, awnA:0x3F93A8, awnB:0xF4F1E8 };
    var COLK = { wpost:1, bk:1, concrete:1, steel:1, rc:1, core:1 }, SLABK = { wfloor:1, slab:1, sdeck:1, tdeck:1, rcs:1 }, WALLK = { wwall:1, bkw:1, cpan:1 };
    // ---- ground pieces (site): all on the part's anchored base slab; y stacks 3 / 5 / 7 cm so no two flat pieces share a plane
    function site(base, list, ox, oz){
      if(!base || !list) return; P2.sites++;
      var R = function(x, z){ var r = Math.hypot(x + ox, z + oz); if(r > P2.rmax) P2.rmax = +r.toFixed(2); };
      list.forEach(function(q, qi){ var t = q[0], i, n, x, z, dx, dz, len, c;
        if(t === "pave"){ kd(base, "box", q[5] != null ? q[5] : C0.pave, q[1], 0.03 + 0.002*(qi % 5), q[2], q[3], 0.06, q[4]); R(q[1] + q[3]/2, q[2] + q[4]/2); R(q[1] - q[3]/2, q[2] - q[4]/2); R(q[1] + q[3]/2, q[2] - q[4]/2); R(q[1] - q[3]/2, q[2] + q[4]/2); }
        else if(t === "path" || t === "kerb" || t === "fence" || t === "hedge"){
          dx = q[3] - q[1]; dz = q[4] - q[2]; len = Math.hypot(dx, dz); var X = Math.abs(dx) >= Math.abs(dz), mx = (q[1] + q[3])/2, mz = (q[2] + q[4])/2; R(q[1], q[2]); R(q[3], q[4]);
          if(t === "path"){ var w = q[5] || 1.6; kd(base, "box", q[6] != null ? q[6] : C0.path, mx, 0.05 + 0.002*(qi % 5), mz, X ? len : w, 0.06, X ? w : len); }
          else if(t === "kerb"){ kd(base, "box", C0.kerb, mx, 0.09, mz, X ? len : 0.28, 0.18, X ? 0.28 : len); }
          else if(t === "fence"){ c = q[5] != null ? q[5] : C0.white; n = Math.max(1, Math.round(len/1.6));
            for(i = 0; i <= n; i++) kd(base, "ibox", c, q[1] + dx*i/n, 0.55, q[2] + dz*i/n, 0.12, 1.1, 0.12);
            [0.42, 0.86].forEach(function(y){ kd(base, "ibox", c, mx, y, mz, X ? len : 0.06, 0.09, X ? 0.06 : len); }); }
          else { n = Math.max(1, Math.round(len/1.1)); for(i = 0; i <= n; i++) kd(base, "ibush", i % 2 ? C0.leafD : C0.leaf, q[1] + dx*i/n, 0.5, q[2] + dz*i/n, 1.2, 1.0, 1.2); } }
        else if(t === "isle"){ kd(base, "box", C0.kerb, q[1], 0.11, q[2], q[3] + 0.4, 0.22, q[4] + 0.4); kd(base, "box", q[5] != null ? q[5] : C0.pave, q[1], 0.236, q[2], q[3], 0.03, q[4]); R(q[1] + q[3]/2, q[2] + q[4]/2); R(q[1] - q[3]/2, q[2] - q[4]/2); }
        else if(t === "tree"){ var s = q[3] || 1; x = q[1]; z = q[2]; R(x, z); kd(base, "icyl", C0.trunk, x, 1.1*s, z, 0.35*s, 2.2*s, 0.35*s); kd(base, "ibush", C0.leaf, x, 2.9*s, z, 2.4*s, 2.2*s, 2.4*s); kd(base, "ibush", C0.leafD, x + 0.4*s, 3.6*s, z - 0.3*s, 1.5*s, 1.4*s, 1.5*s); }
        else if(t === "lamp"){ x = q[1]; z = q[2]; R(x, z); kd(base, "icyl", C0.iron, x, 1.7, z, 0.12, 3.4, 0.12); kd(base, "ibox", C0.iron, x, 3.45, z, 0.5, 0.1, 0.5); kd(base, "lit", C0.lit, x, 3.2, z, 0.34, 0.4, 0.34); kd(base, "icyl", C0.stoneD, x, 0.12, z, 0.4, 0.24, 0.4); }
        else if(t === "bench"){ x = q[1]; z = q[2]; R(x, z); var bx = q[3] ? 1.6 : 0.5, bz = q[3] ? 0.5 : 1.6; kd(base, "ibox", C0.woodD, x, 0.45, z, bx, 0.1, bz); kd(base, "ibox", C0.iron, x - (q[3] ? 0.6 : 0), 0.22, z - (q[3] ? 0 : 0.6), 0.1, 0.44, 0.1); kd(base, "ibox", C0.iron, x + (q[3] ? 0.6 : 0), 0.22, z + (q[3] ? 0 : 0.6), 0.1, 0.44, 0.1); }
        else if(t === "plant"){ x = q[1]; z = q[2]; R(x, z); kd(base, "ibox", C0.stone, x, 0.3, z, 0.9, 0.6, 0.9); kd(base, "ibush", C0.leaf, x, 0.95, z, 1.0, 0.9, 1.0); }
        else if(t === "post"){ x = q[1]; z = q[2]; R(x, z); kd(base, "icyl", C0.stoneD, x, 0.4, z, 0.26, 0.8, 0.26); kd(base, "icyl", C0.gold, x, 0.84, z, 0.3, 0.08, 0.3); }
        else if(t === "flag"){ x = q[1]; z = q[2]; R(x, z); kd(base, "icyl", C0.white, x, 3.0, z, 0.1, 6.0, 0.1); kd(base, "ibox", q[3] != null ? q[3] : C0.teal, x + 0.62, 5.5, z, 1.2, 0.7, 0.04); kd(base, "icyl", C0.gold, x, 6.05, z, 0.2, 0.12, 0.2); }
        else if(t === "bay"){ x = q[1]; z = q[2]; var bw = q[3], bd = q[4], aX = !!q[5]; R(x + bw/2, z + bd/2); R(x - bw/2, z - bd/2); n = Math.max(1, Math.round((aX ? bw : bd)/2.6));
          for(i = 0; i <= n; i++) kd(base, "ibox", C0.line, aX ? x - bw/2 + bw*i/n : x, 0.1, aX ? z : z - bd/2 + bd*i/n, aX ? 0.12 : bw, 0.03, aX ? bd : 0.12); }
      });
    }
    // ---- the dress of one generic mass part (local coordinates: the part is built round 0, 0 and shifted afterwards)
    function dress(P, n0){
      var O = P.p2, S = O.style, bl = [], i; for(i = n0; i < blocks.length; i++) bl.push(blocks[i]);
      var base = bl.filter(function(b){ return b.anchor; })[0];
      if(O.site) site(base, O.site, P.x || 0, P.z || 0);
      if(!S) return; P2.parts++;
      var C = Object.assign({}, C0, O.c || {});
      var cols = bl.filter(function(b){ return !b.anchor && COLK[b.key]; }), slabs = bl.filter(function(b){ return !b.anchor && SLABK[b.key]; }), walls = bl.filter(function(b){ return !b.anchor && WALLK[b.key] && Math.min(b.half[0], b.half[2]) < 0.2; });
      if(!cols.length || !slabs.length) return;
      var x0 = 1e9, x1 = -1e9, z0 = 1e9, z1 = -1e9; cols.forEach(function(b){ x0 = Math.min(x0, b.spawn.x - b.half[0]); x1 = Math.max(x1, b.spawn.x + b.half[0]); z0 = Math.min(z0, b.spawn.z - b.half[2]); z1 = Math.max(z1, b.spawn.z + b.half[2]); });
      var cx = (x0 + x1)/2, cz = (z0 + z1)/2, W = x1 - x0, D = z1 - z0;
      var topY = 0; slabs.forEach(function(s){ topY = Math.max(topY, s.spawn.y + s.half[1]); });
      var tops = slabs.filter(function(s){ return s.spawn.y + s.half[1] > topY - 0.05; });
      var cap = bl.filter(function(b){ return b.key === "ledge" && b.half[0]*2 > W*0.7 && b.half[2]*2 > D*0.7; })[0];
      var wallC = S === "brick" ? C.brick : S === "timber" ? C.plank : C.conc, trim = S === "brick" ? C.stone : S === "timber" ? C.woodD : C.concD;
      var faceOf = function(w){ var X = w.half[0] < w.half[2]; return { X:X, sg:X ? (w.spawn.x >= cx ? 1 : -1) : (w.spawn.z >= cz ? 1 : -1), L:2*(X ? w.half[2] : w.half[0]), hh:2*w.half[1], d:X ? w.half[0] : w.half[2] }; };
      var onW = function(w, F, g, c, u, v, ww, hh, t, off){ t = t || 0.06; var d = F.d + (off || 0) + t/2;
        kd(w, g, c, w.spawn.x + (F.X ? F.sg*d : u), w.spawn.y + v, w.spawn.z + (F.X ? u : F.sg*d), F.X ? t : ww, hh, F.X ? ww : t); };
      // a window on a full wall panel: frame, pane (lit by a fixed pattern), mullions, sill, head
      var win = function(w, F, u, v, ww, wh, lit, shut, head){
        onW(w, F, "box", S === "office" ? C.concL : C.white, u, v, ww + 0.2, wh + 0.2, 0.07); onW(w, F, "box", lit ? C.lit : (S === "office" ? C.glassN : C.glassD), u, v, ww, wh, 0.09);
        onW(w, F, "ibox", C.white, u, v, 0.06, wh, 0.11); if(S !== "office") onW(w, F, "ibox", C.white, u, v + wh*0.12, ww, 0.06, 0.11);
        onW(w, F, "box", S === "timber" ? C.woodD : C.stone, u, v - wh/2 - 0.13, ww + 0.36, 0.12, 0.16);
        if(head) onW(w, F, "box", C.stone, u, v + wh/2 + 0.16, ww + 0.3, 0.16, 0.12);
        if(shut) [-1, 1].forEach(function(s){ onW(w, F, "box", shut, u + s*(ww/2 + 0.27), v, 0.4, wh + 0.08, 0.08); }); };
      var groundY = 1e9; walls.forEach(function(w){ groundY = Math.min(groundY, w.floor); }); cols.forEach(function(c2){ groundY = Math.min(groundY, c2.floor); });
      walls.forEach(function(w, wi){ var F = faceOf(w), L2 = F.L, hh = F.hh, full = hh > 1.5, front = !F.X && F.sg > 0, g0 = w.floor === groundY, k = (wi*7 + w.floor*3) % 5;
        if(full){
          if(S === "brick"){
            if(g0 && front && O.shop){   // a shopfront: a wide display window, a door in every second bay, a striped awning (tilted boards)
              var mid = Math.abs(w.spawn.x - cx) < 0.5*L2 + 0.01 || wi % 2 === 0;
              onW(w, F, "box", C.white, 0, -0.05, L2*0.86, hh*0.74, 0.07); onW(w, F, "box", C.glassN, mid ? L2*0.17 : 0, -0.05, mid ? L2*0.46 : L2*0.78, hh*0.66, 0.09);
              if(mid){ onW(w, F, "box", C.door, -L2*0.24, -hh*0.1, L2*0.26, hh*0.76, 0.1); onW(w, F, "ibox", C.gold, -L2*0.15, -hh*0.12, 0.08, 0.08, 0.14); }
              onW(w, F, "lit", C.lit, mid ? L2*0.17 : 0, hh*0.2, L2*0.3, 0.12, 0.11);
              for(var a = 0; a < 6; a++) kq(w, "box", a % 2 ? C.awnB : C.awnA, w.spawn.x - L2*0.45 + (a + 0.5)*L2*0.9/6, w.spawn.y + hh*0.36, w.spawn.z + F.d + 0.52, L2*0.9/6, 0.07, 1.15, 0, 0.42, 0);
              onW(w, F, "box", C.stoneD, 0, -hh/2 + 0.14, L2, 0.28, 0.1);
            } else {
              var nw = L2 > 3.0 ? 2 : 1, ww = Math.min(1.05, L2/nw*0.42), wh = Math.min(1.5, hh*0.52);
              for(var q = 0; q < nw; q++) win(w, F, nw === 1 ? 0 : (q ? 1 : -1)*L2*0.24, hh*0.04, ww, wh, (k + q) % 3 === 0, (O.shut && !F.X) ? C.greenD : 0, 1);
              if(g0) onW(w, F, "box", C.stoneD, 0, -hh/2 + 0.14, L2, 0.28, 0.1);
            }
          } else if(S === "office"){
            onW(w, F, "box", C.concL, 0, hh*0.06, L2*0.9, hh*0.5, 0.06); onW(w, F, "box", k % 4 === 0 ? C.lit : C.glassN, 0, hh*0.06, L2*0.84, hh*0.42, 0.08);
            for(var m2 = -1; m2 <= 1; m2++) onW(w, F, "ibox", C.concL, m2*L2*0.21, hh*0.06, 0.07, hh*0.42, 0.1);
            onW(w, F, "ibox", C.concD, 0, -hh*0.32, L2*0.9, 0.06, 0.08); onW(w, F, "ibox", C.concD, 0, hh*0.4, L2*0.9, 0.06, 0.08);
            if(g0 && front){ onW(w, F, "box", C.navy, 0, -hh*0.08, Math.min(1.5, L2*0.5), hh*0.78, 0.12); onW(w, F, "lit", C.lit, 0, hh*0.36, Math.min(1.9, L2*0.6), 0.14, 0.14); }
          } else {   // timber: board joints, a shuttered window (a door on the front ground storey), a dark skirting board
            for(var pl = 1; pl < 4; pl++) onW(w, F, "ibox", C.woodD, -L2/2 + pl*L2/4, 0, 0.05, hh - 0.1, 0.05);
            onW(w, F, "box", C.woodD, 0, -hh/2 + 0.12, L2, 0.24, 0.07); onW(w, F, "box", C.woodD, 0, hh/2 - 0.1, L2, 0.2, 0.07);
            if(g0 && front){ onW(w, F, "box", C.door, 0, -hh*0.06, Math.min(1.2, L2*0.4), hh*0.8, 0.09); onW(w, F, "box", C.cream, 0, hh*0.38, Math.min(1.5, L2*0.5), 0.14, 0.11); onW(w, F, "ibox", C.gold, Math.min(0.42, L2*0.14), -hh*0.08, 0.08, 0.08, 0.13); }
            else win(w, F, 0, hh*0.04, Math.min(1.0, L2*0.36), Math.min(1.25, hh*0.46), k % 3 === 0, k % 2 ? C.green : C.red, 0);
          }
        } else {   // a low wall under an opening: the opening stays open (a tap still reaches what the player sees); it gets a sill, a head and a frame
          var top = hh/2, oh = (P.fh || 2.7) - (P.st || 0.3) - hh - 0.05;   // opening height above the low wall
          if(S === "brick"){ onW(w, F, "box", C.stone, 0, top + 0.06, L2 + 0.1, 0.14, 0.14, -0.04); onW(w, F, "box", C.stone, 0, top + oh - 0.14, L2, 0.3, 0.1);
            [-1, 1].forEach(function(s){ onW(w, F, "ibox", C.white, s*(L2/2 - 0.08), top + oh/2, 0.12, oh, 0.08); }); onW(w, F, "ibox", C.white, 0, top + oh/2, 0.08, oh - 0.3, 0.06); }
          else if(S === "office"){ onW(w, F, "box", C.concL, 0, top + 0.05, L2 + 0.06, 0.1, 0.12, -0.03); onW(w, F, "box", C.concD, 0, top + oh - 0.2, L2, 0.42, 0.09);
            onW(w, F, "ibox", C.steel, 0, top + 0.42, L2, 0.06, 0.05); [-1, 0, 1].forEach(function(s){ onW(w, F, "ibox", C.steel, s*(L2/2 - 0.1), top + 0.22, 0.05, 0.42, 0.05); });
            if(k % 2 === 0) for(var b2 = -1; b2 <= 1; b2++) onW(w, F, "ibush", b2 ? C.leafD : C.leaf, b2*L2*0.26, top + 0.3, 0.7, 0.5, 0.36, -0.28); }
          else { onW(w, F, "box", C.woodD, 0, top + 0.05, L2 + 0.08, 0.1, 0.14, -0.04); onW(w, F, "box", C.woodD, 0, top + oh - 0.13, L2, 0.26, 0.09);
            for(var pl2 = 1; pl2 < 4; pl2++) onW(w, F, "ibox", C.woodD, -L2/2 + pl2*L2/4, 0, 0.05, hh - 0.08, 0.05);
            [-1, 1].forEach(function(s){ var ux = s*(L2/2 - 0.08), d = F.d + 0.06;   // knee braces at the head of the opening (timber frame)
              var ax = w.spawn.x + (F.X ? F.sg*d : ux), az = w.spawn.z + (F.X ? ux : F.sg*d), bx2 = w.spawn.x + (F.X ? F.sg*d : ux - s*0.7), bz2 = w.spawn.z + (F.X ? ux - s*0.7 : F.sg*d);
              bar(w, C.woodD, ax, w.spawn.y + top + oh - 0.95, az, bx2, w.spawn.y + top + oh - 0.25, bz2, 0.1); }); }
        }
      });
      // floor bands: a string course on every slab edge that lies on the facade (the top one is the cornice)
      slabs.forEach(function(s){ var isTop = s.spawn.y + s.half[1] > topY - 0.05, bh = isTop ? 0.34 : 2*s.half[1] + 0.1, pr = isTop ? 0.2 : 0.1, col = isTop ? (S === "brick" ? C.stone : S === "timber" ? C.woodD : C.concL) : trim;
        var y = s.spawn.y + (isTop ? s.half[1] - 0.17 - 0.012 : 0);
        if(Math.abs(s.spawn.z + s.half[2] - z1) < 0.25) kd(s, "box", col, s.spawn.x, y, z1 + pr/2 - 0.02, 2*s.half[0] + 0.14, bh, pr);
        if(Math.abs(s.spawn.z - s.half[2] - z0) < 0.25) kd(s, "box", col, s.spawn.x, y, z0 - pr/2 + 0.02, 2*s.half[0] + 0.14, bh, pr);
        if(Math.abs(s.spawn.x + s.half[0] - x1) < 0.25) kd(s, "box", col, x1 + pr/2 - 0.02, y, s.spawn.z, pr, bh, 2*s.half[2] + 0.14);
        if(Math.abs(s.spawn.x - s.half[0] - x0) < 0.25) kd(s, "box", col, x0 - pr/2 + 0.02, y, s.spawn.z, pr, bh, 2*s.half[2] + 0.14); });
      // ground-storey columns: a plinth; open ground storeys (legs) of an office: an entrance canopy under the first slab
      cols.forEach(function(c2){ if(c2.floor !== groundY) return; kd(c2, "ibox", S === "timber" ? C.stoneD : C.stone, c2.spawn.x, 0.26, c2.spawn.z, 2*c2.half[0] + 0.2, 0.52, 2*c2.half[2] + 0.2); });
      if(S === "office" && O.canopy){ var s1 = slabs.filter(function(s){ return s.floor === groundY && Math.abs(s.spawn.z + s.half[2] - z1) < 0.25; });
        s1.forEach(function(s){ var yb = s.spawn.y - s.half[1]; kd(s, "box", C.navy, s.spawn.x, yb - 0.5, z1 + 0.7, 2*s.half[0]*0.8, 0.16, 1.5); kd(s, "lit", C.lit, s.spawn.x, yb - 0.62, z1 + 0.7, 2*s.half[0]*0.6, 0.06, 0.9);
          kd(s, "ibox", C.glassN, s.spawn.x, yb/2 - 0.3, z1 - 1.1, 2*s.half[0]*0.7, yb - 0.7, 0.08); kd(s, "ibox", C.concL, s.spawn.x, yb/2 - 0.3, z1 - 1.06, 0.1, yb - 0.7, 0.1); kd(s, "ibox", C.woodL, s.spawn.x + 0.9, 0.5, z1 - 2.0, 1.6, 1.0, 0.6); }); }
      // ---- the roof: on the cap if the part has one, else on the top slabs (each piece rides the slab under it)
      var ry = cap ? cap.spawn.y + cap.half[1] : topY, host = function(x, z){ return cap || near(tops, x, z); }, roof = O.roof || "flat", rh = O.rh || 2.2;
      if(roof === "gable"){ var rc = O.rc != null ? O.rc : (S === "timber" ? C.shingle : S === "brick" ? C.slate : C.slate), rcD = O.rcD != null ? O.rcD : (S === "timber" ? C.shingleD : C.slateD), alongX = W >= D, hs = (alongX ? D : W)/2, sl = Math.atan2(rh, hs);
        var segs = cap ? [cap] : tops;
        segs.forEach(function(s){ var ex = alongX ? (cap ? W/2 : s.half[0]) : hs, ez = alongX ? hs : (cap ? D/2 : s.half[2]), px = alongX ? (cap ? cx : s.spawn.x) : cx, pz = alongX ? cz : (cap ? cz : s.spawn.z);
          [-1, 1].forEach(function(sg){
            if(alongX) kq(s, "box", sg > 0 ? rc : rcD, px, ry + rh/2, pz + sg*hs/2, 2*ex + 0.08, 0.2, Math.hypot(hs, rh) + 0.34, 0, sg*sl, 0);
            else kq(s, "box", sg > 0 ? rc : rcD, px + sg*hs/2, ry + rh/2, pz, Math.hypot(hs, rh) + 0.34, 0.2, 2*ez + 0.08, 0, 0, -sg*sl); });
          if(alongX){ kd(s, "box", rcD, px, ry + rh + 0.03, pz, 2*ex + 0.1, 0.24, 0.32);
            if(cap || Math.abs(s.spawn.x - s.half[0] - x0) < 0.3) kd(s, "prism", wallC, x0 + 0.1, ry + rh/2, pz, 0.14, rh, 2*hs - 0.1); if(cap || Math.abs(s.spawn.x + s.half[0] - x1) < 0.3) kd(s, "prism", wallC, x1 - 0.1, ry + rh/2, pz, 0.14, rh, 2*hs - 0.1); }
          else { kd(s, "box", rcD, px, ry + rh + 0.03, pz, 0.32, 0.24, 2*ez + 0.1);
            if(cap || Math.abs(s.spawn.z - s.half[2] - z0) < 0.3) kd(s, "prism", wallC, px, ry + rh/2, z0 + 0.1, 0.14, rh, 2*hs - 0.1, 0, Math.PI/2, 0); if(cap || Math.abs(s.spawn.z + s.half[2] - z1) < 0.3) kd(s, "prism", wallC, px, ry + rh/2, z1 - 0.1, 0.14, rh, 2*hs - 0.1, 0, Math.PI/2, 0); } });
        for(var ch = 0; ch < (O.chim || 0); ch++){ var hx2 = x0 + W*(ch ? 0.72 : 0.28), hz2 = cz - D*0.2, hh2 = host(hx2, hz2); kd(hh2, "box", S === "timber" ? C.stoneD : C.brickD, hx2, ry + rh*0.5 + 0.5, hz2, 0.7, rh + 1.0, 0.7); kd(hh2, "box", C.stone, hx2, ry + rh + 1.06, hz2, 0.86, 0.14, 0.86); }
      } else if(roof === "pyr"){ var rp = O.rc != null ? O.rc : (S === "timber" ? C.shingle : C.slate), hp = host(cx, cz);
        kd(hp, "box", S === "timber" ? C.woodD : C.stone, cx, ry + 0.1, cz, W + 0.5, 0.2, D + 0.5); kd(hp, "cone", rp, cx, ry + 0.2 + rh/2, cz, W + 0.3, rh, D + 0.3);
        kd(hp, "icyl", C.iron, cx, ry + rh + 0.9, cz, 0.07, 1.4, 0.07); kd(hp, "ibush", C.gold, cx, ry + rh + 0.3, cz, 0.34, 0.34, 0.34);
        if(O.vane) kd(hp, "ibox", C.gold, cx + 0.3, ry + rh + 1.3, cz, 0.7, 0.16, 0.04);
      } else {   // flat: a parapet with a coping on every roof edge, then the roof furniture
        var ph = O.ph || 0.75, pc = S === "brick" ? C.brick : S === "timber" ? C.woodD : C.conc;
        (cap ? [cap] : tops).forEach(function(s){ var hx3 = s.half[0], hz3 = s.half[2], sx3 = s.spawn.x, sz3 = s.spawn.z;
          var edge = function(on, x, z, lx, lz){ if(!on) return; kd(s, "box", pc, x, ry + ph/2, z, lx, ph, lz); kd(s, "box", C.stone, x, ry + ph + 0.05, z, lx + (lx > lz ? 0 : 0.1), 0.1, lz + (lx > lz ? 0.1 : 0)); };
          edge(cap || Math.abs(sz3 + hz3 - z1) < 0.25, sx3, (cap ? z1 - 0.2 : sz3 + hz3) - 0.13, 2*hx3, 0.22); edge(cap || Math.abs(sz3 - hz3 - z0) < 0.25, sx3, (cap ? z0 + 0.2 : sz3 - hz3) + 0.13, 2*hx3, 0.22);
          edge(cap || Math.abs(sx3 + hx3 - x1) < 0.25, (cap ? x1 - 0.2 : sx3 + hx3) - 0.13, sz3, 0.22, 2*hz3 - 0.5); edge(cap || Math.abs(sx3 - hx3 - x0) < 0.25, (cap ? x0 + 0.2 : sx3 - hx3) + 0.13, sz3, 0.22, 2*hz3 - 0.5); });
        if(O.hut){ var ux = cx - W*0.2, uz = cz - D*0.15, uh = host(ux, uz); kd(uh, "box", pc, ux, ry + 1.05, uz, 2.0, 2.1, 1.8); kd(uh, "box", C.stone, ux, ry + 2.16, uz, 2.3, 0.14, 2.1); kd(uh, "box", C.door, ux, ry + 0.9, uz + 0.92, 0.8, 1.7, 0.06); }
        if(O.tank){ var tx = cx + W*0.22, tz = cz - D*0.12, th = host(tx, tz); [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function(e){ kd(th, "ibox", C.iron, tx + e[0]*0.5, ry + 0.6, tz + e[1]*0.5, 0.1, 1.2, 0.1); });
          kd(th, "cyl", C.woodL, tx, ry + 2.0, tz, 1.7, 1.7, 1.7); kd(th, "ibox", C.iron, tx, ry + 1.6, tz, 1.76, 0.08, 1.76); kd(th, "ibox", C.iron, tx, ry + 2.4, tz, 1.76, 0.08, 1.76); kd(th, "cone", C.slate, tx, ry + 3.2, tz, 1.5, 0.7, 1.5); }
        for(var ac = 0; ac < (O.ac || 0); ac++){ var ax2 = x1 - 1.2 - ac*1.7, az2 = z0 + 1.1, ah = host(ax2, az2); kd(ah, "ibox", C.concL, ax2, ry + 0.45, az2, 1.2, 0.9, 0.9); kd(ah, "ibox", C.iron, ax2, ry + 0.5, az2 + 0.46, 0.9, 0.5, 0.04); kd(ah, "icyl", C.iron, ax2, ry + 0.92, az2, 0.6, 0.06, 0.6); }
        if(O.mast){ var mx2 = cx - W*0.25, mz2 = cz + D*0.1, mh = host(mx2, mz2); kd(mh, "icyl", C.iron, mx2, ry + 2.4, mz2, 0.1, 4.8, 0.1); kd(mh, "ibox", C.iron, mx2, ry + 3.6, mz2, 1.0, 0.06, 0.06); kd(mh, "ibox", C.iron, mx2, ry + 4.1, mz2, 0.7, 0.06, 0.06); kd(mh, "lit", 0xFF5A4A, mx2, ry + 4.9, mz2, 0.2, 0.2, 0.2); }
        if(O.sign){ var gx = cx, gz = z1 - 0.55, gh = host(gx, gz), sw = Math.min(W*0.8, 5.2);   // a blank roof board: two coloured bars, no text, no logo
          [-1, 1].forEach(function(e){ kd(gh, "ibox", C.iron, gx + e*(sw/2 - 0.3), ry + 0.9, gz, 0.12, 1.8, 0.12); }); kd(gh, "box", C.white, gx, ry + 2.3, gz, sw, 1.5, 0.14);
          kd(gh, "box", O.signC != null ? O.signC : C.teal, gx, ry + 2.55, gz + 0.08, sw*0.8, 0.36, 0.05); kd(gh, "box", C.gold, gx, ry + 2.0, gz + 0.08, sw*0.55, 0.22, 0.05); }
        for(var c3 = 0; c3 < (O.chim || 0); c3++){ var qx = x0 + 0.9 + c3*(W - 1.8), qz = z0 + 0.8, qh = host(qx, qz); kd(qh, "box", C.brickD, qx, ry + 1.0, qz, 0.8, 2.0, 0.8); kd(qh, "box", C.stone, qx, ry + 2.06, qz, 0.96, 0.14, 0.96); [-0.2, 0.2].forEach(function(e){ kd(qh, "icyl", C.tile, qx + e, ry + 2.3, qz, 0.24, 0.36, 0.24); }); }
      }
      // a lit lamp under every slab that has an open bay beside it: the storeys read as rooms
      slabs.forEach(function(s, si){ if(s.spawn.y + s.half[1] > topY - 0.05 && roof !== "flat") return; if(si % 2) return; kd(s, "lit", C.warm, s.spawn.x, s.spawn.y - s.half[1] - 0.1, s.spawn.z, 0.7, 0.14, 0.7); });
    }
    var mass0 = V5_PARTS.mass;
    V5_PARTS.mass = function(P){ var n0 = blocks.length, r = mass0.apply(this, arguments); if(P && P.p2){ try{ dress(P, n0); }catch(e){ P2.err = String(e && e.stack || e).slice(0, 300); } } return r; };
    if(V5_PARTS.keep6){ var keep0 = V5_PARTS.keep6;
      V5_PARTS.keep6 = function(K){ var n0 = blocks.length, r = keep0.apply(this, arguments);
        if(K && K.p2 && K.p2.site){ try{ var kb = null; for(var i = n0; i < blocks.length; i++) if(blocks[i].anchor){ kb = blocks[i]; break; } site(kb, K.p2.site, K.x || 0, K.z || 0); }catch(e){ P2.err = String(e && e.stack || e).slice(0, 300); } } return r; }; }
  })();
  // ---- end main/polish2.js
