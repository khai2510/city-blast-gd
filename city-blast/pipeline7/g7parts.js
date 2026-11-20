  // ==================================================================================================================
  // g7 HERO KIT (pipeline7, 20/11, Khai: "không đạt chất lượng design / độ sophisticated của L32"). Built with the same
  // toolkit as the L1-36 heroes (A1.h boxSt / kq / bar / ring / rng, M14.api mat / floors / ring / rcDecor, l6KdAdd decor):
  // every structural box is a member, every detail (curved roofs, upturned eave tips, rails, lanterns, lattice, altar) is decor
  // riding on a member. Landmark rule: inspired by, never a replica.
  //   g7pag  "Five Eaves": a five-tier pagoda on a stone terrace (main). Each tier is its own bond group (P.bg0 + tier):
  //          the tiers rest on each other and come down one step at a time. Hall posts = massive RC (L32, 3 cracks, ring rule).
  //   g7gate three-arch gate (shield) · g7bell bell pavilion (bronze bell hangs from the roof) · g7tea timber tea house
  // ==================================================================================================================
  (function(){
    if(typeof A1 === "undefined" || !A1.h || typeof M14 === "undefined") return;
    var H = A1.h, kd = l6KdAdd, api = M14.api, mem = H.mem, kq = H.kq, bar = H.bar;
    var K = { red:0xB8322A, redD:0x8E2420, roof:0x2F5D62, roofD:0x244A4E, gold:0xE8B23A, cream:0xF0E3C4, wood:0xC58B55, woodD:0x8A5A33,
      stone:0xB9B7B2, stoneD:0x8E9299, lit:0xFFD98A, warm:0xFFF1C4, bronze:0xB07A3A, brick:0xC9583A, ink:0x2B2140, tile:0x3A6E73 };
    // eave slabs: the heavy roof of a tier (counts until broken; L.drop7 makes it shrug off TNT until it has fallen)
    MEMBERS.hard7e = Object.assign({}, MEMBERS.hard7s, { density:1200, color:K.roof }); MATS.hard7e = MATS.hard7s || MATS.slab || MATS.concrete;
    // a light soft eave for the upper tiers (breaks on landing: the collapse feel)
    MEMBERS.g7eave = Object.assign({}, MEMBERS.mdC || MEMBERS.slab, { density:700, color:K.roof }); MATS.g7eave = MATS.mdC || MATS.slab || MATS.concrete;
    var isH0 = LV7.isHard7; LV7.isHard7 = function(b){ return isH0(b) || b.key === "hard7e"; };
    var DECK = MEMBERS.a1lite ? "a1lite" : "mdW";
    var bgSet = function(n0, g){ for(var q = n0; q < blocks.length; q++) if(!blocks[q].anchor) blocks[q].bg = g; };
    // a curved tiled roof over a box of half sizes hx, hz at height y (decor on `hosts` = the eave members, nearest one carries it)
    function roof(hosts, cx, cz, y, hx, hz, ov, rise, col, tip){
      var near = function(x, z){ return H.near(hosts, x, z); }, R = hx + ov, Rz = hz + ov, sl = Math.atan2(rise, ov + 0.6);
      // four sloped planes (two layers: a steep upper, a flatter lower = the curve) + gold edge trim
      [[0, 1], [0, -1], [1, 0], [-1, 0]].forEach(function(q){ var X = !!q[0], len = 2*(X ? Rz : R), s = X ? q[0] : q[1];
        var h = near(cx + q[0]*(hx + ov*0.5), cz + q[1]*(hz + ov*0.5));
        var px = cx + q[0]*(hx + ov*0.30), pz = cz + q[1]*(hz + ov*0.30), py = y + rise*0.55;
        kq(h, "box", col, px, py, pz, X ? ov*0.75 : len*0.86, 0.22, X ? len*0.86 : ov*0.75, X ? 0 : 0, X ? 0 : -s*sl*1.25, X ? s*sl*1.25 : 0);
        var lx = cx + q[0]*(hx + ov*0.80), lz = cz + q[1]*(hz + ov*0.80), ly = y + rise*0.12;
        kq(h, "box", tip || col, lx, ly, lz, X ? ov*0.5 : len, 0.18, X ? len : ov*0.5, 0, X ? 0 : -s*sl*0.55, X ? s*sl*0.55 : 0);
        kd(h, "box", K.gold, cx + q[0]*(X ? R + 0.05 : 0), y - 0.02, cz + q[1]*(X ? 0 : Rz + 0.05), X ? 0.12 : 2*R, 0.14, X ? 2*Rz : 0.12);
        // tile ribs on the lower plane
        for(var k = -3; k <= 3; k++){ var u = k*(X ? Rz : R)/3.6; kd(h, "ibox", K.roofD, X ? lx + q[0]*0.02 : cx + u, ly + 0.14, X ? cz + u : lz + q[1]*0.02, X ? ov*0.5 : 0.14, 0.08, X ? 0.14 : ov*0.5); }
      });
      // upturned corner tips (the flying eaves) + hip ridges + a gold ornament on each tip
      [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(function(q){ var h = near(cx + q[0]*(R - 0.4), cz + q[1]*(Rz - 0.4)), tx = cx + q[0]*(R + 0.35), tz = cz + q[1]*(Rz + 0.35);
        bar(h, col, cx + q[0]*(R - 1.4), y + 0.15, cz + q[1]*(Rz - 1.4), tx, y + 0.95, tz, 0.32);
        bar(h, K.roofD, cx + q[0]*hx*0.55, y + rise*1.02, cz + q[1]*hz*0.55, cx + q[0]*(R - 0.6), y + 0.3, cz + q[1]*(Rz - 0.6), 0.22);
        kd(h, "ibush", K.gold, tx, y + 1.1, tz, 0.42, 0.42, 0.42); });
    }
    // a lantern hanging at (x, y, z) on host: a red body, gold caps, a lit core
    function lantern(h, x, y, z, s){ s = s || 1; kd(h, "icyl", K.red, x, y, z, 0.5*s, 0.62*s, 0.5*s); kd(h, "lit", K.lit, x, y, z, 0.3*s, 0.42*s, 0.3*s); kd(h, "icyl", K.gold, x, y + 0.36*s, z, 0.32*s, 0.08*s, 0.32*s); kd(h, "icyl", K.gold, x, y - 0.36*s, z, 0.32*s, 0.08*s, 0.32*s); kd(h, "ibox", K.ink, x, y + 0.55*s, z, 0.04, 0.3*s, 0.04); }
    // dress a wall panel (b.a1face): a round lattice window or tall carved doors
    var FN = { "z+":[0, 1], "z-":[0, -1], "x+":[1, 0], "x-":[-1, 0] };
    function onF(b, g, c, u, v, w, h, t, off){ var n = FN[b.a1face]; if(!n) return; var X = !!n[0]; t = t || 0.06; var d = (X ? b.half[0] : b.half[2]) + (off || 0) + t/2;
      kd(b, g, c, b.spawn.x + (X ? n[0]*d : u), b.spawn.y + v, b.spawn.z + (X ? u : n[1]*d), X ? t : w, h, X ? w : t); }
    function onFr(b, c, u, v, D, t){ var n = FN[b.a1face]; if(!n) return; var X = !!n[0], d = (X ? b.half[0] : b.half[2]) + t/2;   // a disc on the face
      kd(b, "cyl", c, b.spawn.x + (X ? n[0]*d : u), b.spawn.y + v, b.spawn.z + (X ? u : n[1]*d), D, t, D, X ? 0 : Math.PI/2, 0, X ? Math.PI/2 : 0); }
    function dressWall(w, k, tall){ var L = 2*Math.max(w.half[0], w.half[2]), hh = 2*w.half[1];
      onF(w, "box", K.redD, 0, -hh*0.47, L, 0.22, 0.08);                         // skirting
      onF(w, "box", K.gold, 0, hh*0.44, L, 0.12, 0.08);                          // frieze
      if(tall){ onF(w, "box", K.woodD, 0, -hh*0.1, Math.min(L*0.6, 2.4), hh*0.72, 0.1); [-1, 1].forEach(function(s){ onF(w, "box", K.red, s*Math.min(L*0.15, 0.6), -hh*0.1, Math.min(L*0.28, 1.1), hh*0.66, 0.14); });
        onF(w, "box", K.gold, 0, -hh*0.1, 0.06, hh*0.66, 0.18); for(var q = 0; q < 4; q++) onF(w, "box", K.gold, 0, -hh*0.38 + q*hh*0.18, Math.min(L*0.56, 2.2), 0.05, 0.16); }
      else { var D = Math.min(L*0.55, hh*0.55, 1.9); onFr(w, K.gold, 0, hh*0.05, D + 0.24, 0.1); onFr(w, K.woodD, 0, hh*0.05, D, 0.14);
        for(var r = -1; r <= 1; r++){ onF(w, "ibox", K.gold, r*D*0.24, hh*0.05, 0.05, D*0.86, 0.17); onF(w, "ibox", K.gold, 0, hh*0.05 + r*D*0.24, D*0.86, 0.05, 0.17); }
        if(k % 3 === 0) onFr(w, K.lit, 0, hh*0.05, D*0.5, 0.15); }
    }
    V5_PARTS.g7pag = function(P){
      var n0 = blocks.length, rr = H.rng(707), bg0 = P.bg0 || 11, TI = P.tiers || [[7.0, 7.0], [6.0, 5.0], [5.2, 5.0], [4.4, 5.0], [3.6, 4.6]], y = 0, sts = [], tag = api.ring(), i;
      // terrace (anchored stone, never counted) + steps, rails and stone lamps on it
      var base = addBlock(0, -0.25, 0, 24, 0.5, 24, "base", {anchor:true});
      kd(base, "box", K.stone, 0, 0.12, 0, 23, 0.24, 23); [[0, 1], [0, -1], [1, 0], [-1, 0]].forEach(function(q){ var X = !!q[0];
        kd(base, "box", K.stoneD, q[0]*10.9, 0.45, q[1]*10.9, X ? 0.5 : 22.3, 0.5, X ? 22.3 : 0.5);   // terrace rail
        for(var k = -5; k <= 5; k++) if(k !== 0 || q[1] !== 1) kd(base, "box", K.stone, q[0]*10.9 + (X ? 0 : k*2), 0.95, q[1]*10.9 + (X ? k*2 : 0), 0.4, 0.5, 0.4); });
      for(i = 0; i < 4; i++) kd(base, "box", K.stoneD, 0, 0.06 + i*0.0, 11.6 + i*0.55, 5 - i*0.0, 0.12, 0.55);
      [[-3.2, 11.2], [3.2, 11.2], [-9.5, -9.5], [9.5, -9.5]].forEach(function(p){ kd(base, "box", K.stoneD, p[0], 0.9, p[1], 0.6, 1.3, 0.6); kd(base, "lit", K.lit, p[0], 1.75, p[1], 0.5, 0.45, 0.5); kd(base, "cone", K.stoneD, p[0], 2.2, p[1], 0.9, 0.5, 0.9); });
      for(i = 0; i < TI.length; i++){
        var hx = TI[i][0], hh = TI[i][1], nS = blocks.length, hall = i === 0, MT = hall ? api.mat("rc") : api.mat("wood");
        var st = H.boxSt({ y0:y, h:hh, hx:hx, hz:hx, nx:hall ? 4 : 3, nz:hall ? 4 : 3, pw:hall ? 1.25 : 0.75, mw:hall ? 1.05 : 0.65, fl:i, MT:MT,
          deck:hall ? MT.deck : DECK, skin:hall ? { "z+":"wall", def:"wall" } : "wall", mat:"wood", wall:"wwall", split:hall ? [3, 3] : [2, 2], dk:hall ? 0.6 : 0.4,
          tp:K.red, td:K.woodD, tw:i % 2 ? K.cream : 0xEADBB8 });
        sts.push(st);
        st.piers.forEach(function(p){ p.tint = K.red;
          if(hall){ tag(p, 0, Math.sign(Math.round(p.a1x*10)) , Math.sign(Math.round(p.a1z*10)));
            // L32 RC: damage marks on the outer faces, a stone plinth and a gold capital (decor)
            if(Math.abs(p.a1x) > hx - 1) api.rcDecor(p, Math.sign(p.a1x), 0, p.spawn.x + Math.sign(p.a1x)*(p.half[0] + 0.02), p.spawn.z, 1.25);
            else if(Math.abs(p.a1z) > hx - 1) api.rcDecor(p, 0, Math.sign(p.a1z), p.spawn.x, p.spawn.z + Math.sign(p.a1z)*(p.half[2] + 0.02), 1.25); }
          kd(p, "box", hall ? K.stone : K.redD, p.spawn.x, y + 0.25, p.spawn.z, 2*p.half[0] + 0.3, 0.5, 2*p.half[2] + 0.3);
          kd(p, "box", K.gold, p.spawn.x, y + hh - (hall ? 0.6 : 0.4) - 0.25, p.spawn.z, 2*p.half[0] + 0.18, 0.3, 2*p.half[2] + 0.18); });
        st.walls.forEach(function(w, k){ dressWall(w, k + i, hall && w.a1face === "z+" && Math.abs(w.spawn.x) < 1.5); });
        // the floor inside: lit lanterns under the deck, an altar table + a bell rack in the hall, rails on the balconies
        var d0 = st.decks[Math.floor(st.decks.length/2)], ch = hh - (hall ? 0.6 : 0.4);
        [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function(q){ lantern(d0, q[0]*hx*0.45, y + ch - 0.7, q[1]*hx*0.45, hall ? 1.3 : 1); });
        kd(d0, "lit", K.warm, 0, y + ch - 0.08, 0, hx*1.1, 0.06, hx*1.1);
        if(hall){ kd(d0, "ibox", K.redD, 0, 0.55, -hx*0.45, 4.2, 1.1, 1.4); kd(d0, "ibox", K.gold, 0, 1.15, -hx*0.45, 4.4, 0.12, 1.6);
          kd(d0, "icyl", K.bronze, -1.2, 1.5, -hx*0.45, 0.5, 0.7, 0.5); kd(d0, "icyl", K.bronze, 1.2, 1.5, -hx*0.45, 0.5, 0.7, 0.5); kd(d0, "lit", K.lit, 0, 1.45, -hx*0.45, 0.3, 0.6, 0.3);
          kd(d0, "ibox", K.redD, 0, 0.02, 1.0, 3.0, 0.04, 9.0); }   // the red runner to the doors
        y += hh;
        // the eave: four slabs resting on the deck edge (members), overhang ov; the hall's are the heavy hard ones
        var ov = hall ? 2.6 : 2.0, t = hall ? 0.42 : 0.3, ek = hall || i === TI.length - 1 ? "hard7e" : "g7eave", ein = 0.75, eaves = [];
        [[0, 1], [0, -1]].forEach(function(q){ eaves.push(mem(ek, 0, y + t/2, q[1]*(hx - ein + (ein + ov)/2), 2*(hx + ov), t, ein + ov, i, null, null, K.roof)); });
        [[1, 0], [-1, 0]].forEach(function(q){ eaves.push(mem(ek, q[0]*(hx - ein + (ein + ov)/2), y + t/2, 0, ein + ov, t, 2*(hx - ein), i, null, null, K.roof)); });
        roof(eaves, 0, 0, y + t, hx, hx, ov, hall ? 1.9 : 1.5, i % 2 ? K.roofD : K.roof, K.tile);
        // the balcony rail of the next tier (decor on the eaves) + hanging lanterns at the four tips
        if(i < TI.length - 1){ var hn = TI[i + 1][0] + 0.35; [[0, 1], [0, -1], [1, 0], [-1, 0]].forEach(function(q, k){ var X = !!q[0], h = eaves[k];
          kd(h, "box", K.redD, q[0]*hn, y + t + 0.55, q[1]*hn, X ? 0.12 : 2*hn, 0.1, X ? 2*hn : 0.12);
          for(var s = -3; s <= 3; s++) kd(h, "ibox", K.red, q[0]*hn + (X ? 0 : s*hn/3.2), y + t + 0.3, q[1]*hn + (X ? s*hn/3.2 : 0), 0.1, 0.5, 0.1); }); }
        [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(function(q){ lantern(H.near(eaves, q[0]*(hx + ov), q[1]*(hx + ov)), q[0]*(hx + ov*0.85), y - 0.55, q[1]*(hx + ov*0.85), 0.9); });
        bgSet(nS, bg0 + i);
        y += t;
      }
      // the bronze finial: one heavy member on the top tier, gold rings and a lotus bud (decor)
      var nF = blocks.length, fin = mem("hard7v", 0, y + 1.6, 0, 1.5, 3.2, 1.5, TI.length, null, null, K.bronze); fin.tint = K.bronze;
      for(i = 0; i < 5; i++) kd(fin, "icyl", K.gold, 0, y + 0.5 + i*0.6, 0, 1.9 - i*0.12, 0.16, 1.9 - i*0.12);
      kd(fin, "ibush", K.gold, 0, y + 3.6, 0, 1.1, 1.5, 1.1); kd(fin, "box", K.gold, 0, y + 4.8, 0, 0.14, 1.4, 0.14);
      bgSet(nF, bg0 + TI.length - 1);
      LV7.g7info = { pag:{ top:y + 5.5, members:blocks.length - n0 } };
      return { w:24, d:24 };
    };
    // ---- three-arch gate (shield): 4 brick piers, a lintel cassette, wall panels with arched red doors, a curved roof
    V5_PARTS.g7gate = function(P){
      var n0 = blocks.length, W = P.w || 7.5, Hh = P.h || 5.6, D = 1.8, xs = [-W + 0.8, -W/3, W/3, W - 0.8], ps = [], ws = [], i;
      xs.forEach(function(x, k){ var pw = k === 0 || k === 3 ? 1.6 : 1.3; ps.push(mem("bk", x, (Hh - 0.6)/2, 0, pw, Hh - 0.6, D, 0, k, 0, K.brick)); });
      var lint = mem("mdB", 0, Hh - 0.3, 0, 2*W, 0.6, D + 0.2, 0, null, null, K.brick);
      for(i = 0; i < 3; i++){ var x0 = xs[i] + (i === 0 ? 0.8 : 0.65), x1 = xs[i + 1] - (i === 2 ? 0.8 : 0.65), mid = i === 1;
        var wl = mem("bkw", (x0 + x1)/2, (Hh - 0.6)/2, 0, x1 - x0 - 0.04, Hh - 0.64, 0.4, 0, null, null, 0xD9714A); wl.a1face = "z+"; ws.push(wl);
        var aw = (x1 - x0)*0.62, ah = (Hh - 0.6)*(mid ? 0.82 : 0.66);
        onF(wl, "box", K.redD, 0, -(Hh - 0.6)/2 + ah/2 - 0.2, aw, ah - aw/2, 0.1, 0.02); onF(wl, "cyl", K.redD, 0, 0, 0, 0, 0.01, 0);
        kd(wl, "cyl", K.redD, wl.spawn.x, -(Hh - 0.6)/2 + ah - aw/2 - 0.2 + wl.spawn.y, wl.spawn.z + 0.26, aw, 0.12, aw, Math.PI/2, 0, 0);   // the arch head
        for(var s = 0; s < 3; s++) kd(wl, "ibush", K.gold, wl.spawn.x + (s - 1)*aw*0.25, wl.spawn.y - 0.2, wl.spawn.z + 0.3, 0.14, 0.14, 0.14);
        onF(wl, "box", K.gold, 0, -(Hh - 0.6)/2 + ah/2 - 0.2, 0.06, ah - aw/2, 0.14, 0.02); }
      ps.forEach(function(p){ kd(p, "box", K.stone, p.spawn.x, 0.3, p.spawn.z, 2*p.half[0] + 0.3, 0.6, 2*p.half[2] + 0.3); kd(p, "box", K.cream, p.spawn.x, Hh - 0.9, p.spawn.z, 2*p.half[0] + 0.2, 0.3, 2*p.half[2] + 0.2); });
      kd(lint, "box", K.cream, 0, Hh - 0.3, 0.02, 2*W + 0.2, 0.36, D + 0.36);
      kd(lint, "box", K.ink, 0, Hh - 0.32, D/2 + 0.2, 3.2, 0.5, 0.06); kd(lint, "box", K.gold, 0, Hh - 0.32, D/2 + 0.22, 3.0, 0.36, 0.06);   // the name board (no text)
      roof([lint], 0, 0, Hh, W, D/2, 1.3, 1.3, K.roof, K.tile);
      kd(lint, "box", K.gold, 0, Hh + 1.45, 0, W*0.9, 0.18, 0.3);
      if(P.bg) bgSet(n0, P.bg); return { w:2*W + 2, d:D + 2 };
    };
    // ---- bell pavilion (hard): 4 RC posts, a roof cassette, the bronze bell hangs from it (counts until broken; drop it first)
    V5_PARTS.g7bell = function(P){
      var n0 = blocks.length, hx = 2.4, Hh = P.h || 6.0, ps = [], i;
      [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(function(q, k){ ps.push(mem("rc", q[0]*(hx - 0.35), (Hh - 0.5)/2, q[1]*(hx - 0.35), 0.7, Hh - 0.5, 0.7, 0, k, 0, K.red)); });
      var top = mem("mdC", 0, Hh - 0.25, 0, 2*hx, 0.5, 2*hx, 0, null, null, K.woodD);
      var bell = mem("hard7v", 0, Hh - 0.5 - 1.0, 0, 1.7, 2.0, 1.7, 0, null, null, K.bronze); bell.tint = K.bronze;
      kd(bell, "icyl", K.bronze, 0, Hh - 1.5, 0, 2.0, 1.6, 2.0); kd(bell, "icyl", K.gold, 0, Hh - 2.4, 0, 2.3, 0.2, 2.3); kd(bell, "icyl", K.gold, 0, Hh - 1.2, 0, 2.1, 0.12, 2.1);
      for(i = 0; i < 4; i++) kd(bell, "ibush", K.gold, Math.sin(i*1.57)*1.0, Hh - 1.7, Math.cos(i*1.57)*1.0, 0.18, 0.18, 0.18);
      bar(top, K.woodD, -hx + 0.3, Hh - 0.9, 0, hx - 0.3, Hh - 0.9, 0, 0.3);   // the beam the bell hangs from
      ps.forEach(function(p){ kd(p, "box", K.stone, p.spawn.x, 0.3, p.spawn.z, 1.1, 0.6, 1.1); kd(p, "box", K.gold, p.spawn.x, Hh - 0.8, p.spawn.z, 0.9, 0.2, 0.9); });
      for(i = -1; i <= 1; i += 2) kd(top, "box", K.redD, 0, 1.0, i*(hx - 0.35), 2*hx - 0.7, 0.12, 0.12);   // the low rail
      roof([top], 0, 0, Hh, hx, hx, 1.4, 1.6, K.roofD, K.tile);
      kd(top, "ibush", K.gold, 0, Hh + 1.8, 0, 0.6, 0.8, 0.6);
      if(P.bg) bgSet(n0, P.bg); return { w:2*hx + 3, d:2*hx + 3 };
    };
    // ---- timber tea house (easy): one timber storey, wall panels with lattice, a curved roof, lanterns, a bench
    V5_PARTS.g7tea = function(P){
      var n0 = blocks.length, hx = P.hx || 2.6, Hh = 3.4;
      var st = H.boxSt({ y0:0, h:Hh, hx:hx, hz:hx*0.8, nx:3, nz:2, pw:0.4, mw:0.35, fl:0, MT:api.mat("wood"), deck:"mdW", skin:{ "z+":"open", def:"wall" }, mat:"wood", wall:"wwall", dk:0.3, tp:K.woodD, td:K.woodD, tw:K.cream });
      st.walls.forEach(function(w, k){ dressWall(w, k, false); });
      var d = st.decks[0]; roof(st.decks, 0, 0, Hh, hx, hx*0.8, 1.1, 1.2, K.roofD, K.tile);
      lantern(d, -hx*0.7, Hh - 0.9, hx*0.8 + 0.2, 0.8); lantern(d, hx*0.7, Hh - 0.9, hx*0.8 + 0.2, 0.8);
      kd(d, "ibox", K.woodD, 0, 0.45, 0, 2.0, 0.1, 0.8); kd(d, "ibox", K.redD, 0, 0.25, 0, 1.8, 0.4, 0.1); kd(d, "icyl", K.cream, 0.4, 0.58, 0, 0.2, 0.16, 0.2);
      if(P.bg) bgSet(n0, P.bg); return { w:2*hx + 2, d:2*hx + 2 };
    };
  })();
