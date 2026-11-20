  // ==================================================================================================================
  // g7 L02 "Watch Keep" (aim the fall): hit7 = members that shrug off TNT and break only from impacts (a tower landing on
  // them). g7keep: a stiff stone watch tower with the L32 tip rule on its 8 ground posts. g7arm: the stone armory (target).
  // g7cwall: a brick curtain wall with merlons (easy).
  // ==================================================================================================================
  (function(){
    if(typeof A1 === "undefined" || !A1.h || typeof M14 === "undefined") return;
    var H = A1.h, kd = l6KdAdd, api = M14.api, mem = H.mem, kq = H.kq, bar = H.bar;
    var K = { stone:0xC9C2B4, stoneL:0xDDD6C8, stoneD:0x8E8676, slate:0x4F5866, wood:0x8A5A33, iron:0x3A3D45, lit:0xFFD98A, warm:0xFFF1C4, brick:0xC9583A, moss:0x7E9A55, gold:0xE8B23A, ash:0x6E6A60 };
    // ashlar block of the armory: impact-only (L.hit7), counts until broken, shatters on a hard landing
    MEMBERS.hard7i = Object.assign({}, MEMBERS.hard7v, { hp:260, shatter:7.5, density:2600, color:K.ash }); MATS.hard7i = MATS.hard7v || MATS.concrete;
    var isH0 = LV7.isHard7; LV7.isHard7 = function(b){ return isH0(b) || b.key === "hard7i"; };
    var dmg8 = damage;
    damage = function(b, amount, pierce, cause){ if(L && L.hit7 && b && L.hit7.keys.indexOf(b.key) >= 0 && cause === "blast") amount *= 1 - (L.hit7.armor || 0.97); return dmg8(b, amount, pierce, cause); };
    var pc9 = placeCharge, t9 = {};
    placeCharge = function(block, point, normal){ if(L && L.hit7 && block && L.hit7.keys.indexOf(block.key) >= 0 && !t9[L.name]){ t9[L.name] = 1; toast("Too tough for TNT. Drop something on it!"); } return pc9(block, point, normal); };
    var bgSet = function(n0, g){ for(var q = n0; q < blocks.length; q++) if(!blocks[q].anchor) blocks[q].bg = g; };
    var FN = { "z+":[0, 1], "z-":[0, -1], "x+":[1, 0], "x-":[-1, 0] };
    function onF(b, g, c, u, v, w, h, t){ var n = FN[b.a1face]; if(!n) return; var X = !!n[0]; t = t || 0.06; var d = (X ? b.half[0] : b.half[2]) + t/2;
      kd(b, g, c, b.spawn.x + (X ? n[0]*d : u), b.spawn.y + v, b.spawn.z + (X ? u : n[1]*d), X ? t : w, h, X ? w : t); }
    var STONE = MEMBERS.a1lite ? "a1lite" : "mdC";
    V5_PARTS.g7keep = function(P){
      var n0 = blocks.length, hx = P.hx || 4.2, y = 0, s, i, rr = H.rng(902);
      var base = addBlock(0, -0.25, 0, 14, 0.5, 14, "base", {anchor:true}); kd(base, "box", K.stoneD, 0, 0.1, 0, 12.5, 0.2, 12.5); kd(base, "box", K.moss, 0, 0.02, 0, 13.6, 0.04, 13.6);
      // ground storey: 8 posts (corners massive RC, middles RC), stone walls, a gate arch on the front
      var g = H.boxSt({ y0:0, h:6.0, hx:hx, hz:hx, nx:3, nz:3, pw:1.35, mw:1.15, fl:0, MT:api.mat("rc"), deck:"mdeck", skin:"wall", wall:"cpan", dk:0.6, tp:K.ash, td:K.stoneD, tw:K.stone });
      g.piers.forEach(function(p){ var corner = Math.abs(p.a1x) > hx - 1 && Math.abs(p.a1z) > hx - 1;
        if(!corner){ p.key = "rc"; p.def = MEMBERS.rc; p.hp = p.hp0 = MEMBERS.rc.hp; p.tint = K.stoneD; }
        else { if(Math.abs(p.a1x) > hx - 1) api.rcDecor(p, Math.sign(p.a1x), 0, p.spawn.x + Math.sign(p.a1x)*(p.half[0] + 0.02), p.spawn.z, 1.35); }
        kd(p, "box", K.stoneD, p.spawn.x, 0.35, p.spawn.z, 2*p.half[0] + 0.3, 0.7, 2*p.half[2] + 0.3); });
      var tipR = api.tip({ piers:g.piers, skin:g.walls, decks:g.decks, hinge:P.hold != null ? P.hold : 2.5, xz:function(p){ return p.a1x == null ? null : [p.a1x, p.a1z]; } });
      g.walls.forEach(function(w){ onF(w, "box", K.stoneD, 0, -2.4, 2*Math.max(w.half[0], w.half[2]), 0.5, 0.1);
        for(var c = 0; c < 6; c++) onF(w, "ibox", c % 2 ? K.stoneL : K.stoneD, (c - 2.5)*0.45, -0.6 + (c % 3)*0.9, 0.42, 0.22, 0.08);   // ashlar joints
        if(w.a1face === "z+"){ onF(w, "box", K.wood, 0, -1.0, 1.4, 3.2, 0.12); onF(w, "box", K.stoneL, 0, 0.7, 1.9, 0.35, 0.16); for(var q = 0; q < 4; q++) onF(w, "ibox", K.iron, (q - 1.5)*0.32, -1.0, 0.06, 3.0, 0.16); } });
      LV7.g7tip = tipR; y = 6.0;
      // shaft: 5 storeys of stone posts (1 TNT each), blast-proof floors, stone walls with arrow slits, string courses
      for(s = 0; s < (P.n || 5); s++){ var st = H.boxSt({ y0:y, h:4.5, hx:hx, hz:hx, nx:3, nz:3, pw:1.1, mw:0.9, fl:s + 1, MT:api.mat("concrete"), deck:STONE, skin:"wall", wall:"cpan", dk:0.45, tp:K.stoneD, td:K.stoneD, tw:s % 2 ? K.stoneL : K.stone });
        st.walls.forEach(function(w, k){ onF(w, "ibox", K.iron, 0, 0.2, 0.22, 1.5, 0.1); onF(w, "box", K.stoneD, 0, 0.2, 0.6, 1.9, 0.06);
          if((k + s) % 4 === 0) onF(w, "lit", K.lit, 0, 0.2, 0.14, 1.1, 0.12); });
        kd(st.decks[0], "box", K.stoneD, 0, y + 4.5 - 0.2, 0, 2*hx + 0.5, 0.35, 2*hx + 0.5);   // string course
        y += 4.5; }
      // lookout: corbelled, a lit room, merlons on the parapet, a slate cone with an iron finial
      var lo = H.boxSt({ y0:y, h:3.6, hx:hx + 0.6, hz:hx + 0.6, nx:3, nz:3, pw:0.9, mw:0.8, fl:9, MT:api.mat("concrete"), deck:STONE, skin:"wall", wall:"cpan", dk:0.4, tp:K.stoneL, td:K.stoneD, tw:K.stoneL });
      for(i = 0; i < 12; i++){ var a = i*Math.PI/6, r = hx + 0.3; kd(lo.decks[0], "box", K.stoneD, Math.round(Math.cos(a))*r*0.95, y - 0.25, Math.round(Math.sin(a))*r*0.95, 0.6, 0.5, 0.6); }
      lo.walls.forEach(function(w){ onF(w, "lit", K.lit, 0, 0.3, 1.4, 1.0, 0.1); onF(w, "box", K.stoneD, 0, 0.3, 1.8, 1.4, 0.06); });
      y += 3.6; var d = lo.decks[0];
      for(i = -2; i <= 2; i++) [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function(q){ var R2 = hx + 0.35; kd(d, "box", K.stoneL, q[0] ? q[0]*R2 : i*1.85, y + 0.5, q[1] ? q[1]*R2 : i*1.85, q[0] ? 0.5 : 1.0, 1.0, q[0] ? 1.0 : 0.5); });
      kd(d, "cone", K.slate, 0, y + 3.2, 0, 2*hx - 0.4, 5.6, 2*hx - 0.4); kd(d, "box", K.iron, 0, y + 6.6, 0, 0.14, 1.6, 0.14); kd(d, "ibush", K.gold, 0, y + 7.4, 0, 0.4, 0.4, 0.4);
      if(P.bg) bgSet(n0, P.bg); LV7.g7info = { keep:{ top:y + 7.5, members:blocks.length - n0 } };
      return { w:14, d:14 };
    };
    // the armory: two courses of ashlar blocks (impact-only), merlons and an iron door (decor), a timber roof (soft)
    V5_PARTS.g7arm = function(P){
      var n0 = blocks.length, B = P.b || 2.3, nx = P.nx || 4, nz = P.nz || 2, out = [], i, j;
      for(i = 0; i < nx; i++) for(j = 0; j < nz; j++) out.push(mem("hard7i", (i - (nx - 1)/2)*B, B/2, (j - (nz - 1)/2)*B, B - 0.04, B, B - 0.04, 0, i, j, K.ash));
      for(i = 0; i < nx - 1; i++) out.push(mem("hard7i", (i - (nx - 2)/2)*B, B*1.5, 0, B - 0.04, B, B*nz*0.5 - 0.04, 1, i, 9, 0x7A756A));
      out.forEach(function(b, k){ kd(b, "ibox", K.stoneD, b.spawn.x, b.spawn.y + b.half[1] - 0.06, b.spawn.z, 2*b.half[0] + 0.04, 0.1, 2*b.half[2] + 0.04);
        if(b.floor === 1) for(var q = -1; q <= 1; q += 2) kd(b, "box", 0x7A756A, b.spawn.x + q*0.55, b.spawn.y + b.half[1] + 0.35, b.spawn.z, 0.6, 0.7, 2*b.half[2] - 0.2); });
      var fr = out[Math.floor(nx/2)*nz + nz - 1]; kd(fr, "box", K.iron, fr.spawn.x - B/2, B*0.45, fr.spawn.z + B/2 + 0.04, 1.1, 1.8, 0.08); kd(fr, "ibush", K.gold, fr.spawn.x - B/2 + 0.3, B*0.45, fr.spawn.z + B/2 + 0.12, 0.12, 0.12, 0.12);
      kd(out[0], "box", K.wood, -B*(nx - 1)/2 - 0.2, 0.5, B*nz/2 + 0.5, 0.9, 1.0, 0.9); kd(out[0], "icyl", K.iron, -B*(nx - 1)/2 - 0.2, 1.15, B*nz/2 + 0.5, 0.5, 0.3, 0.5);   // a powder crate
      if(P.bg) bgSet(n0, P.bg); return { w:nx*B + 2, d:nz*B + 2 };
    };
    V5_PARTS.g7cwall = function(P){
      var n0 = blocks.length, L2 = P.len || 7, Hh = P.h || 4, n = Math.max(2, Math.round(L2/1.8)), i;
      for(i = 0; i < n; i++){ var b = mem("bk", 0, Hh/2, (i - (n - 1)/2)*(L2/n), 1.2, Hh, L2/n - 0.04, 0, 0, i, K.brick); kd(b, "box", 0xB04A30, 0, Hh + 0.35, b.spawn.z, 1.3, 0.7, L2/n*0.55); kd(b, "box", K.stoneD, 0, 0.25, b.spawn.z, 1.4, 0.5, L2/n); }
      if(P.bg) bgSet(n0, P.bg); return { w:3, d:L2 + 1 };
    };
  })();
