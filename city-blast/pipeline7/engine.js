
// ---- main/levels7.js (19/11/2026, Khai: "10 level theo huong Smash Fest + toa side voi toa chinh") -------------------
// Smash Fest L121-187 (research/smashfest-ytscan/PHYSICS-120-200.md): a base hit there never wins alone, because
// (1) an item only counts when it leaves the TABLE, (2) items are loose, (3) hard items sit where they split the job.
// City Blast gets the same three levers here, as DATA on the existing builders (no engine rule is changed):
//  - plinth7: an anchored stone podium under a part. Rubble that stays on it is NOT "brought down" (score() wants
//    y < 1.5 m), so a foot blast leaves a heap that a second blast must clear: the Smash Fest table.
//  - mass parts get P.y (stand on a plinth) and the existing steel / rc / tdeck tiers act as the stone shelves and spines.
//  - side buildings are separate parts (no shared members, a gap), so each one is its own small job.
// Levels are appended after the last level (L37-L46). ?lv7=0 = off.
try{ (function(){
  if(/[?&]lv7=0(&|$)/.test(location.search)) return;
  var LV7 = window.__blast.lv7 = { log:[] };

  // ---- builders ---------------------------------------------------------------------------------------------------
  function shiftY(n0, dy){
    for(var i=n0;i<blocks.length;i++){
      var b = blocks[i];
      b.spawn.y += dy; b.P.y += dy; b.P0.copy(b.P);
      if(b.rb) b.rb.setTranslation({x:b.P.x, y:b.P.y, z:b.P.z}, false);
      if(!b.keep && !b.anchor && !b.prop) buildingH = Math.max(buildingH, b.P.y + b.half[1]);
    }
  }
  // a stone podium: one anchored block (never damaged, never counted), top at h. {kind:"plinth7", h, w, d}
  V5_PARTS.plinth7 = function(P){
    var h = P.h || 3, w = P.w || 16, d = P.d || 12;
    addBlock(0, h/2 - 0.25, 0, w, h + 0.5, d, "plinth7", {anchor:true});
    // a kerb on the top edge so the eye reads it as a stage, not as part of the building
    return {w:w, d:d};
  };
  MEMBERS.plinth7 = Object.assign({}, MEMBERS.base, { color:0xC9B48F });
  MATS.plinth7 = MATS.base || MATS.concrete;
  // mass parts may stand on a plinth: P.y = height of the plinth top
  var mass0 = V5_PARTS.mass;
  // P.bg (pipeline7 v5, 20/11): every member of this part gets its own bond group: it touches its neighbours (contacts, it can
  // push them, it rests on them) but is never glued to another part. Separate blocks fall one by one: a stepped response, not a cliff.
  V5_PARTS.mass = function(P){ var n0 = blocks.length, r = mass0(P); if(P.y) shiftY(n0, P.y); if(P.bg) for(var q = n0; q < blocks.length; q++) if(!blocks[q].anchor) blocks[q].bg = P.bg; return r; };
  var deck0 = V5_PARTS.deck6;   // a bridge between two staged towers: P.dy lifts it by the stage height
  if(deck0) V5_PARTS.deck6 = function(P){ var n0 = blocks.length, r = deck0(P); if(P.dy) shiftY(n0, P.dy); return r; };
  var kit0 = V5_PARTS.kit6;
  if(kit0) V5_PARTS.kit6 = function(P){ var n0 = blocks.length, r = kit0(P); if(P.y) shiftY(n0, P.y); return r; };

  // stage levels (L.stage7 = {tough}): a member that falls onto the stage lands as RUBBLE instead of shattering (Smash Fest
  // items never break when they fall, they stay on the table). Only the fall is softened: a TNT hit is unchanged, so
  // the second blast on the heap still breaks it. tough = factor on the impact speed a member shrugs off (default 2.5).
  var ih0 = impactHit;
  impactHit = function(b, dv){ if(L && L.stage7 && !b.keep) dv = dv/(L.stage7.tough || 2.5); return ih0(b, dv); };

  // ...and the Smash Fest win rule: rubble still lying on the stage counts as NOT cleared (75% of its mass, tester 19/11:
  // 100% left 4/10 levels unwinnable for a fair tap player; the base game counts a fallen member at half). What fell off the stage, or broke, is cleared. The height term is unchanged.
  // pipeline7 20/11: the hard pieces (piers, core, steel, deep floors) that land on the stage are the job; soft rubble is half
  var LV7_HARD = { rc:1, rcs:1, core:1, steel:1, sdeck:1, tdeck:1, truss:1 };
  var sc0 = score;
  score = function(){
    if(L && L.hard7){
      var rem7 = 0, tot7 = 0;
      for(var q7=0;q7<blocks.length;q7++){ var o7 = blocks[q7]; if(o7.anchor || o7.keep || o7.prop || o7.bonus) continue;
        tot7 += o7.mass; if(o7.dead) continue;
        if(LV7.isHard7(o7)){ rem7 += o7.mass; continue; }                                   // hard: only broken counts
        if(o7.spawn.y - o7.P.y > 1.2 && o7.P.y < 1.5) continue;                             // soft: down on the ground
        rem7 += standing(o7) ? o7.mass : o7.mass*0.5; }
      return Math.max(0, Math.min(1, 1 - rem7/Math.max(0.01, tot7)));
    }
    if(L && L.rack7){   // rack levels: Smash Fest counting. An element is cleared when broken or on the ground; nothing else counts
      var rem = 0, tot = 0;
      for(var q=0;q<blocks.length;q++){ var o = blocks[q]; if(o.anchor || o.keep || o.prop || o.bonus || o.rack) continue; tot += 1; if(o.dead) continue; if(o.P.y < 1.5 && o.spawn.y - o.P.y > 0.3) continue; if(o.spawn.y < 1.5 && o.P.distanceTo(o.spawn) > 2.5 && o.P.y < 1.5) continue; rem += 1; }   // Smash Fest counts ITEMS: a drum weighs as much as a block
      return Math.max(0, Math.min(1, 1 - rem/Math.max(0.01, tot)));
    }
    if(!L || !L.stage7) return sc0();
    var top = L.stage7.h || 3, k = L.stage7.rubble == null ? 0.6 : L.stage7.rubble, kh = L.stage7.hard == null ? 1 : L.stage7.hard, remain = 0;
    for(var i=0;i<blocks.length;i++){
      var b = blocks[i];
      if(b.dead||b.anchor||b.keep||b.prop||b.bonus) continue;
      if(standing(b)){ remain += b.mass; continue; }
      if(b.P.y > top - 0.2) remain += b.mass*(LV7_HARD[b.key] || b.def.armor >= 0.5 ? kh : k);   // a heap on the stage: hard pieces in full, soft at half
    }
    var massFrac = Math.max(0, Math.min(1, 1 - remain/Math.max(0.01, structuralMass)));
    // Smash Fest rule (pipeline7 20/11): on a stage the % is ONLY what left the stage. The base game's height term (40% for
    // "nothing stands tall") paid a full collapse at the foot even with the whole heap still on the stage. L.stage7.hw = old weight.
    var hw = L.stage7.hw || 0;
    if(!hw) return Math.max(0, Math.min(1, massFrac));
    var hFrac = Math.max(0, Math.min(1, 1 - standingHeight()/Math.max(0.01, buildingH)));
    return Math.max(0, Math.min(1, massFrac*(1 - hw) + hFrac*hw));
  };
  LV7.info = function(){ return blocks.map(function(b, i){ return { i:i, bid:b.bid || null, key:b.key, st:!b.dead && standing(b), dead:b.dead, an:b.anchor, kp:b.keep, y:+b.P.y.toFixed(2), x:+b.P.x.toFixed(2), z:+b.P.z.toFixed(2), sy:+b.spawn.y.toFixed(2), sx:+b.spawn.x.toFixed(2), sz:+b.spawn.z.toFixed(2), f:b.floor, h:b.half[1], hx:b.half[0], hz:b.half[2], loose7:!!b.loose, m:Math.round(b.mass), ar:b.def.armor, hp:b.def.hp }; }); };
  LV7.onStage = function(){ var top = L.stage7 ? L.stage7.h || 3 : 0, n = 0; blocks.forEach(function(b){ if(!b.dead && !b.anchor && !b.keep && !b.prop && !standing(b) && b.P.y > top - 0.2) n++; }); return n; };

  // the heap hint: a wave on a stage level that ends short of the target with a heap still on the stage says so, in the
  // fix4 pill (same place, same look), and the live % pill reads the heap. Shown at most twice per level.
  var heapSaid = 0, we7 = waveEnd;
  waveEnd = function(){
    var r = we7.apply(this, arguments);
    try{
      if(L && L.stage7 && phase === "plan" && screen === "game" && pct < L.target && stockLeft() > 0 && LV7.onStage() >= 6 && heapSaid < 2){
        var el = document.getElementById("fx4Tip");
        if(el){ el.textContent = heapSaid ? "Blast the heap off the stage!" : "The heap on the stage still counts!"; el.classList.remove("off");
          setTimeout(function(){ el.classList.add("off"); }, 3200); }
        heapSaid++; LV7.log.push("heap:L" + (levelIdx + 1) + ":" + Math.round(pct*100));
      }
    }catch(e){}
    return r;
  };
  var sl7 = startLevel;
  startLevel = function(){ heapSaid = 0; return sl7.apply(this, arguments); };

  // a charge is never planted ON the stone stage (an anchor: it never breaks). Tester 19/11: "base can't be broken, can't
  // pass" = TNT went onto the stage. Every placement path (tap, tap assist, ghost) ends in placeCharge: a charge aimed at the
  // stage goes to the nearest live member (heap or building) within 3.5 m of that point, on its face toward the point;
  // with nothing near, nothing is placed and the toast says why.
  var pc7 = placeCharge, _v7 = new THREE.Vector3();
  function stageRedirect(point){
    var best = null, bd = 3.5;
    for(var i=0;i<blocks.length;i++){
      var b = blocks[i]; if(b.dead || b.anchor || b.keep || b.prop || !b.rb) continue;
      var d = nearestPoint(b, point, _v7).distanceTo(point); if(d < bd){ bd = d; best = b; }
    }
    return best;
  }
  placeCharge = function(block, point, normal){
    if(block && (block.key === "plinth7" || block.rack)){
      var best = stageRedirect(point);
      if(!best){ toast(block.rack ? "Steel frame: tap what sits on it!" : "The stage can't break. Tap the rubble!"); LV7.log.push("stageTap->none"); return "stage"; }
      var pt = nearestPoint(best, point, new THREE.Vector3()), n = pt.clone().sub(best.P);
      if(n.lengthSq() < 1e-6) n.set(0, 1, 0);
      var ax = Math.abs(n.x)/best.half[0], ay = Math.abs(n.y)/best.half[1], az = Math.abs(n.z)/best.half[2];   // the face the point sits on
      n.set(ax >= ay && ax >= az ? Math.sign(n.x) : 0, ay > ax && ay >= az ? Math.sign(n.y) : 0, az > ax && az > ay ? Math.sign(n.z) : 0);
      LV7.log.push("stageTap->" + best.key);
      return pc7(best, pt, n);
    }
    return pc7(block, point, normal);
  };
  LV7.stageRedirect = stageRedirect;
  // test hook: write every member's draw matrix now (a hidden tab draws ~1 fps, so taps would ray-cast stale poses)
  LV7.syncDraw = function(){
    for(var i=0;i<blocks.length;i++){ var b = blocks[i]; if(b.anchor) continue; if(b.dead && !b.rubble){ if(!b.gone){ b.gone = true; writeMatrix(b, 0); } continue; } b.P0.copy(b.P); b.Q0.copy(b.Q); writeMatrix(b, 0); }   // draw at the CURRENT pose (no interpolation lag)
    for(var j=0;j<blocks.length;j++){ var im = blocks[j].im; if(im){ im.boundingSphere = null; im.boundingBox = null; } }
    return true;
  };


  // ---- rack7 (pipeline7 v3, Khai 20/11: no stage; the building's own elements carry different hardness, as Smash Fest
  // sets jars, drums, stone and steel on shelves). A part = a STEEL SKELETON (columns + decks, fixed: TNT cannot break it,
  // it is not a target and not counted, like Smash Fest's shelves/table) and LOOSE ELEMENTS on each floor (no bonds:
  // they topple, slide and fly like Smash Fest items). An element is cleared when it is broken or lands on the ground.
  //   {kind:"rack7", bx, bz, floors, fh, bay, items:[[floor, i, j, key, sx, sy, sz, dx, dz], ...]}
  //   (i, j) = bay cell; dx/dz = offset in the cell; sy stacks are separate items
  V5_PARTS.rack7 = function(P){
    var bay = P.bay || 2.7, fh = P.fh || 2.7, bx = P.bx, bz = P.bz, n = P.floors, dt = 0.24, cw = 0.34;
    var X0 = -bx*bay/2, Z0 = -bz*bay/2, i, j, f;
    addBlock(0, -0.25, 0, bx*bay + 1.4, 0.5, bz*bay + 1.4, "base", {anchor:true});
    for(i=0;i<=bx;i++) for(j=0;j<=bz;j++){ var c = addBlock(X0 + i*bay, n*fh/2, Z0 + j*bay, cw, n*fh, cw, "rack7c", {anchor:true}); c.rack = true; }
    for(f=1;f<=n;f++) for(i=0;i<bx;i++) for(j=0;j<bz;j++){ var d = addBlock(X0 + (i + 0.5)*bay, f*fh - dt/2, Z0 + (j + 0.5)*bay, bay - cw, dt, bay - cw, "rack7d", {anchor:true, floor:f}); d.rack = true; }
    (P.items || []).forEach(function(q){
      var f0 = q[0], y = (f0 ? f0*fh : 0) + q[5]/2 + (q[9] || 0);
      var b = addBlock(X0 + (q[1] + 0.5)*bay + (q[7] || 0), y, Z0 + (q[2] + 0.5)*bay + (q[8] || 0), q[4], q[5], q[6], q[3], {floor:f0});
      b.loose = true;
    });
    return {w:bx*bay + 1.4, d:bz*bay + 1.4};
  };
  MEMBERS.drum7 = Object.assign({}, MEMBERS.sdeck, { density:500, color:0x8796AB, ns:false }); MATS.drum7 = MATS.steel;   // hollow steel drum: TNT cannot break it, a blast throws it
  MEMBERS.rack7c = Object.assign({}, MEMBERS.steel, { color:0x5E6B7D }); MEMBERS.rack7d = Object.assign({}, MEMBERS.sdeck, { color:0x6F7C8E });
  MATS.rack7c = MATS.steel; MATS.rack7d = MATS.steel;
  // loose elements carry no bonds (to the rack or to each other): they stand on contact only
  var la0 = linkAll;
  linkAll = function(){
    la0.apply(this, arguments);
    for(var k = links.length - 1; k >= 0; k--){ var l = links[k];
      if(!(l.a.loose || l.b.loose)) continue;
      try{ world.removeImpulseJoint(l.j, true); }catch(e){}
      l.alive = false; links.splice(k, 1);
      [l.a, l.b].forEach(function(o){ var q = o.links.indexOf(l); if(q >= 0) o.links.splice(q, 1); });
    }
  };


  // ---- hard7 (pipeline7 v4, Khai 20/11: "the building must still fall"). Ordinary bonded buildings that collapse, with
  // HARD members built into the structure (columns, beams, slabs) where a Smash Fest pattern puts its stone/steel.
  // A hard member: dark, survives falls (shatter 40), breaks only with a TNT right on it (rc strength, almost no armor).
  // Score on L.hard7 levels: a hard member counts until it is BROKEN (falling is not enough); everything else by the
  // base rule (cleared when brought down to the ground). No height term: % = what is cleared, as Smash Fest counts items.
  // dense reinforced members (pipeline7 v4 run 2): fewer hard pieces carry more of the %, so the hunt stays short
  MEMBERS.hard7 = Object.assign({}, MEMBERS.rc, { shatter:40, density:3600, color:0x4A4F5C });
  MEMBERS.hard7s = Object.assign({}, MEMBERS.slab, { hp:220, armor:0.05, shatter:40, bond:"core", density:4500, color:0x4A4F5C });
  MATS.hard7 = MATS.rc || MATS.concrete; MATS.hard7s = MATS.slab || MATS.concrete;
  // a vault: one big dense reinforced block sitting on a floor (a water tank, a machine room, a safe): few pieces, much of the %
  MEMBERS.hard7v = Object.assign({}, MEMBERS.rc, { shatter:40, density:3600, color:0x3E4350 }); MATS.hard7v = MATS.rc || MATS.concrete;
  V5_PARTS.vault7 = function(P){ var b = addBlock(0, P.y, 0, P.w || 2.0, P.h || 1.6, P.d || 2.0, "hard7v", {floor:P.fl || 0}); return {w:P.w || 2, d:P.d || 2}; };
  LV7.isHard7 = function(b){ return b.key === "hard7" || b.key === "hard7s" || b.key === "hard7v"; };

  // ---- sequencing (20/11, Khai: "đặt rất nhiều bom cùng một lúc rồi bấm blast... phải nổ từng phần thì mới đổ hết được") ----
  // drop7  = {keys, fall, armor}: a member of these keys shrugs off TNT while it is still where it was built; once it has
  //          FALLEN (dropped > fall m) it cracks normally. Bring the building down first, then crack what came down.
  // layer7 = {keys, n}: a member loses at most 1/n of its hp per BLAST, however many TNT hit it; damage stays between blasts.
  // cap7   = n: at most n charges per BLAST (the detonator has n slots).
  var dmg7 = damage;
  damage = function(b, amount, pierce, cause){
    if(L && b && !b.dead && amount > 0){
      var D = L.drop7, Y = L.layer7;
      if(D && D.keys.indexOf(b.key) >= 0 && !b.d7down){ amount *= 1 - (D.armor || 0.97); b.d7hit = 1; }
      if(Y && Y.keys.indexOf(b.key) >= 0){
        if(b.l7max == null) b.l7max = b.hp0 != null ? b.hp0 : b.hp;
        if(b.l7w !== wave){ b.l7w = wave; b.l7d = 0; }
        var eff = (b.def.armor > 0 && !pierce) ? amount*(1 - b.def.armor) : amount;
        eff = Math.min(eff, Math.max(0, b.l7max/(Y.n || 3) - b.l7d)); b.l7d += eff;
        dmg7(b, eff, true, cause); if(!b.dead) b.hp0 = b.hp;   // the damage stays for the next blast
        return;
      }
    }
    return dmg7(b, amount, pierce, cause);
  };
  var fm7 = failMember;   // debug trail: how a hard piece died (cause, height, how far it had fallen)
  failMember = function(b, cause){ if(b && !b.dead && LV7.isHard7(b)) LV7.log.push("fail " + b.key + " " + cause + " y" + b.P.y.toFixed(1) + " fell" + (b.spawn.y - b.P.y).toFixed(1)); return fm7(b, cause); };
  // drop7 reads the state at the moment BLAST is pressed: the charges of one volley go off one after another, so a safe
  // that starts falling during the volley is still "up high" for every charge of that volley (one BLAST can't drop AND crack it)
  var det7 = detonateAll;
  detonateAll = function(){ if(L && L.drop7) for(var i=0;i<blocks.length;i++){ var b = blocks[i]; if(!b.dead && (b.spawn.y - b.P.y) >= (L.drop7.fall || 1.5)) b.d7down = 1; } return det7.apply(this, arguments); };
  var pc8 = placeCharge, toast7 = {};
  placeCharge = function(block, point, normal){
    if(L && L.cap7 && charges.filter(function(c){ return !c.fired; }).length >= L.cap7){ toast("Max " + L.cap7 + " per blast. Tap BLAST!"); return null; }
    if(L && L.drop7 && block && L.drop7.keys.indexOf(block.key) >= 0 && (block.spawn.y - block.P.y) < (L.drop7.fall || 1.5) && !toast7[L.name]){
      toast7[L.name] = 1; }   // no hint (Khai 20/11: the player works it out)
    return pc8(block, point, normal);
  };

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
        var hx = TI[i][0], hh = TI[i][1], nS = blocks.length, hall = i === 0, MT = hall ? api.mat("rc") : api.mat(P.upMat || "wood");
        var st = H.boxSt({ y0:y, h:hh, hx:hx, hz:hx, nx:hall ? 4 : 3, nz:hall ? 4 : 3, pw:hall ? 1.25 : 0.75, mw:hall ? 1.05 : 0.65, fl:i, MT:MT,
          deck:hall ? MT.deck : DECK, skin:hall ? { "z+":"wall", def:"wall" } : "wall", mat:"wood", wall:"wwall", split:hall ? [3, 3] : [2, 2], dk:hall ? 0.6 : 0.4,
          tp:K.red, td:K.woodD, tw:i % 2 ? K.cream : 0xEADBB8 });
        sts.push(st);
        st.piers.forEach(function(p){ p.tint = K.red;
          var corner = hall && Math.abs(p.a1x) > hx - 1 && Math.abs(p.a1z) > hx - 1;
          if(hall && !corner && !P.allRC){ p.key = "rc"; p.def = MEMBERS.rc; p.hp = p.hp0 = MEMBERS.rc.hp; }   // middle posts: ordinary RC (1 TNT); the 4 corners stay massive RC (3 cracks)
          if(hall && P.ring) tag(p, 0, Math.sign(Math.round(p.a1x*10)) , Math.sign(Math.round(p.a1z*10)));
          if(hall && corner){
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
        var ov = hall ? 2.6 : 2.0, t = hall ? 0.42 : 0.3, ek = hall ? "hard7e" : "g7eave", ein = 0.75, eaves = [];
        [[0, 1], [0, -1]].forEach(function(q){ eaves.push(mem(ek, 0, y + t/2, q[1]*(hx - ein + (ein + ov)/2), 2*(hx + ov), t, ein + ov, i, null, null, K.roof)); });
        [[1, 0], [-1, 0]].forEach(function(q){ eaves.push(mem(ek, q[0]*(hx - ein + (ein + ov)/2), y + t/2, 0, ein + ov, t, 2*(hx - ein), i, null, null, K.roof)); });
        roof(eaves, 0, 0, y + t, hx, hx, ov, hall ? 1.9 : 1.5, i % 2 ? K.roofD : K.roof, K.tile);
        // the balcony rail of the next tier (decor on the eaves) + hanging lanterns at the four tips
        if(i < TI.length - 1){ var hn = TI[i + 1][0] + 0.35; [[0, 1], [0, -1], [1, 0], [-1, 0]].forEach(function(q, k){ var X = !!q[0], h = eaves[k];
          kd(h, "box", K.redD, q[0]*hn, y + t + 0.55, q[1]*hn, X ? 0.12 : 2*hn, 0.1, X ? 2*hn : 0.12);
          for(var s = -3; s <= 3; s++) kd(h, "ibox", K.red, q[0]*hn + (X ? 0 : s*hn/3.2), y + t + 0.3, q[1]*hn + (X ? s*hn/3.2 : 0), 0.1, 0.5, 0.1); }); }
        [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(function(q){ lantern(H.near(eaves, q[0]*(hx + ov), q[1]*(hx + ov)), q[0]*(hx + ov*0.85), y - 0.55, q[1]*(hx + ov*0.85), 0.9); });
        bgSet(nS, bg0 + i);
      }
      // the bronze finial: one heavy member on the top tier, gold rings and a lotus bud (decor)
      var nF = blocks.length, fin = mem("hard7v", 0, y + 1.3, 0, 1.2, 2.6, 1.2, TI.length, null, null, K.bronze); fin.tint = K.bronze;
      for(i = 0; i < 4; i++) kd(fin, "icyl", K.gold, 0, y + 0.4 + i*0.6, 0, 1.6 - i*0.12, 0.16, 1.6 - i*0.12);
      kd(fin, "ibush", K.gold, 0, y + 3.0, 0, 0.9, 1.3, 0.9); kd(fin, "box", K.gold, 0, y + 4.1, 0, 0.12, 1.2, 0.12);
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
    MEMBERS.hard7i = Object.assign({}, MEMBERS.hard7v, { hp:260, density:2600, color:K.ash });
    // hit by a falling body: when a member of ANOTHER part lands hard (impactHit dv > 4) within 0.6 m of a hit7 block, that
    // block takes (dv - 3) x tonnes x F. A 10 t chunk of tower at 15 m/s breaks it; flying gravel does not.
    var ih9 = impactHit;
    impactHit = function(b, dv){
      if(L && L.hit7 && dv > 4 && b && !b.dead && L.hit7.keys.indexOf(b.key) < 0 && b.mass){
        for(var q = 0; q < blocks.length; q++){ var h = blocks[q]; if(h.dead || h === b || (h.bid === b.bid && !L.hit7.self) || L.hit7.keys.indexOf(h.key) < 0) continue;
          var gx = Math.abs(h.P.x - b.P.x) - h.half[0] - Math.max(b.half[0], b.half[2]), gy = Math.abs(h.P.y - b.P.y) - h.half[1] - b.half[1], gz = Math.abs(h.P.z - b.P.z) - h.half[2] - Math.max(b.half[0], b.half[2]);
          if(Math.max(gx, gy, gz) < (L.hit7.reach || 0.6)){ h.h9 = (h.h9 || 0) + 1; dmg7(h, (dv - 3)*b.mass/1000*(L.hit7.f || 3), true, "impact"); } }
        // a red drum crushed by a heavy landing body goes off (L.hit7.drums)
        if(L.hit7.drums && b.mass > 2000 && b.key !== "tank") for(var q2 = 0; q2 < blocks.length; q2++){ var t2 = blocks[q2]; if(t2.dead || t2.key !== "tank") continue;
          var ex = Math.abs(t2.P.x - b.P.x) - t2.half[0] - Math.max(b.half[0], b.half[2]), ey = Math.abs(t2.P.y - b.P.y) - t2.half[1] - b.half[1], ez = Math.abs(t2.P.z - b.P.z) - t2.half[2] - Math.max(b.half[0], b.half[2]);
          if(Math.max(ex, ey, ez) < 0.4){ LV7.log.push("drum crushed by " + b.key); failMember(t2, "impact"); } }
      }
      return ih9(b, dv);
    }; MATS.hard7i = MATS.hard7v || MATS.concrete;
    var isH0 = LV7.isHard7; LV7.isHard7 = function(b){ return isH0(b) || b.key === "hard7i"; };
    var dmg8 = damage;
    damage = function(b, amount, pierce, cause){ if(L && L.hit7 && b && L.hit7.keys.indexOf(b.key) >= 0 && cause === "blast" && !LV7.fuel7) amount *= 1 - (L.hit7.armor || 0.97); if(L && L.hit7 && b && LV7.fuel7 && L.hit7.keys.indexOf(b.key) >= 0) amount *= (L.hit7.fuel || 1); if(L && L.hit7 && b && L.hit7.keys.indexOf(b.key) >= 0){ var D9 = LV7.d9 = LV7.d9 || {}; var k9 = cause + (LV7.fuel7 ? "+fuel" : ""); D9[k9] = D9[k9] || [0, 0]; D9[k9][0]++; D9[k9][1] += Math.round(amount); } return dmg8(b, amount, pierce, cause); };
    // a powder store / red drum going off is far bigger than a TNT: it DOES break hit7 stone (the chain's payoff)
    var ck9 = cookOff; cookOff = function(){ LV7.fuel7 = 1; try{ return ck9.apply(this, arguments); } finally{ LV7.fuel7 = 0; } };
    var pc9 = placeCharge, t9 = {};
    placeCharge = function(block, point, normal){  return pc9(block, point, normal); };
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

  // ---- charges ride their host (Khai 20/11: "bom treo lơ lửng khi toà đã sập"): the charges of one volley go off FUSE_STEP
  // apart, so a building that starts to fall left the later charges hanging in the air where they were placed. After every
  // physics step an unfired charge follows its member (pose x local offset); if the member broke, the charge drops to the
  // ground under gravity. Its blast then goes off where it really is. The red blast-radius sphere is no longer shown.
  var fs7 = fixedStep, _cq = new THREE.Vector3();
  fixedStep = function(){
    var r = fs7.apply(this, arguments), dt = (typeof DT === "number" ? DT : 1/60);
    for(var i=0;i<charges.length;i++){ var c = charges[i]; if(c.fired || !c.host || !c.localPos) continue;
      var h = c.host;
      if(!h.dead && h.rb){ _cq.copy(c.localPos).applyQuaternion(h.Q).add(h.P); c.mesh.position.copy(_cq); c.vy7 = 0; }
      else { c.vy7 = (c.vy7 || 0) - 9.8*dt; c.mesh.position.y = Math.max(0.25, c.mesh.position.y + c.vy7*dt); if(c.mesh.position.y <= 0.25) c.vy7 = 0; }
      if(c.ghost) c.ghost.position.copy(c.mesh.position);
    }
    return r;
  };
  var pc10 = placeCharge;
  placeCharge = function(){ var n0 = charges.length, r = pc10.apply(this, arguments);
    for(var i = n0; i < charges.length; i++) if(charges[i].ghost) charges[i].ghost.visible = false;   // just the bomb, no red zone
    return r; };


  // ---- g7 L02 v2: the Great Hall (massive target: TNT-proof stone posts on the ground storey, a powder store hidden in its far
  // end) and the gate tower (the end of the chain). Decor: arched windows, buttresses, torches, a steep tiled gable roof.
  (function(){
    if(typeof A1 === "undefined" || !A1.h || typeof M14 === "undefined") return;
    var H = A1.h, kd = l6KdAdd, api = M14.api, mem = H.mem, kq = H.kq;
    var K = { stone:0xC9C2B4, stoneL:0xDDD6C8, stoneD:0x8E8676, ash:0x6E6A60, tile:0x8C4A3A, tileD:0x6E3A2E, wood:0x8A5A33, iron:0x3A3D45, lit:0xFFD98A, warm:0xFFF1C4, gold:0xE8B23A, cloth:0x2F5D8C };
    var FN = { "z+":[0, 1], "z-":[0, -1], "x+":[1, 0], "x-":[-1, 0] };
    function onF(b, g, c, u, v, w, h, t){ var n = FN[b.a1face]; if(!n) return; var X = !!n[0]; t = t || 0.06; var d = (X ? b.half[0] : b.half[2]) + t/2;
      kd(b, g, c, b.spawn.x + (X ? n[0]*d : u), b.spawn.y + v, b.spawn.z + (X ? u : n[1]*d), X ? t : w, h, X ? w : t); }
    function arch(w, c, hh, ww){ onF(w, "box", c, 0, -hh*0.08, ww, hh*0.6, 0.1); var n = FN[w.a1face], X = !!n[0], d = (X ? w.half[0] : w.half[2]) + 0.05;
      kd(w, "cyl", c, w.spawn.x + (X ? n[0]*d : 0), w.spawn.y + hh*0.22, w.spawn.z + (X ? 0 : n[1]*d), ww, 0.1, ww, X ? 0 : Math.PI/2, 0, X ? Math.PI/2 : 0); }
    var bgSet = function(n0, g){ for(var q = n0; q < blocks.length; q++) if(!blocks[q].anchor) blocks[q].bg = g; };
    var DECK = MEMBERS.a1lite ? "a1lite" : "mdC";
    V5_PARTS.g7hall = function(P){
      var n0 = blocks.length, hx = P.hx || 9, hz = P.hz || 5.5, Hs = 4.5, y = 0, s, i, sts = [];
      var base = addBlock(0, -0.25, 0, 2*hx + 3, 0.5, 2*hz + 3, "base", {anchor:true}); kd(base, "box", K.stoneD, 0, 0.1, 0, 2*hx + 2, 0.2, 2*hz + 2);
      for(s = 0; s < 3; s++){
        var MT = s === 0 ? { pier:"hard7i", deck:"mdC" } : api.mat("concrete"), xs = [];
        var inner = []; for(i = 1; i < 5; i++) inner.push([-hx + 0.5 + i*(2*hx - 1)/5, 0, s === 0 ? 1.0 : 0.8]);
        var st = H.boxSt({ y0:y, h:Hs, hx:hx, hz:hz, nx:6, nz:3, pw:s === 0 ? 1.2 : 0.9, mw:s === 0 ? 1.0 : 0.8, fl:s, MT:MT, deck:s === 0 ? "mdC" : DECK, skin:"wall", wall:"cpan", split:[3, 2], dk:0.45, inner:inner,
          tp:s === 0 ? K.ash : K.stoneD, td:K.stoneD, tw:s % 2 ? K.stoneL : K.stone });
        sts.push(st);
        st.walls.forEach(function(w, k){ var long = w.a1face === "z+" || w.a1face === "z-";
          onF(w, "box", K.stoneD, 0, -Hs*0.42, 2*Math.max(w.half[0], w.half[2]), 0.35, 0.1);
          if(s === 0 && w.a1face === "z+" && k % 2 === 0){ arch(w, K.wood, Hs, 1.6); for(var q = 0; q < 3; q++) onF(w, "ibox", K.iron, (q - 1)*0.45, -Hs*0.1, 0.06, Hs*0.5, 0.16); }
          else { arch(w, K.iron, Hs, 1.0); onF(w, "box", K.stoneL, 0, Hs*0.26, 1.4, 0.18, 0.14); if((k + s) % 3 === 0) onF(w, "lit", K.lit, 0, -0.1, 0.6, 1.0, 0.12); } });
        if(s === 0) st.piers.forEach(function(p){ if(p.gi == null || p.gi >= 20) return; kd(p, "box", K.stoneD, p.spawn.x, 0.5, p.spawn.z, 2*p.half[0] + 0.4, 1.0, 2*p.half[2] + 0.4); kd(p, "box", K.stoneD, p.spawn.x, Hs - 0.9, p.spawn.z, 2*p.half[0] + 0.25, 0.3, 2*p.half[2] + 0.25); });
        st.decks.forEach(function(d){ kd(d, "box", K.stoneD, d.spawn.x, y + Hs - 0.1, d.spawn.z, 2*d.half[0] + 0.2, 0.25, 2*d.half[2] + 0.2); });
        // inside: long tables, benches and hanging lamps on every floor (seen through the windows and once the walls go)
        var dm = st.decks[1]; for(i = -2; i <= 2; i++){ kd(dm, "ibox", K.wood, i*3.2, y + 0.75, 0, 2.4, 0.12, 1.0); kd(dm, "ibox", K.wood, i*3.2, y + 0.4, 0.8, 2.2, 0.1, 0.35); kd(dm, "ibox", K.wood, i*3.2, y + 0.4, -0.8, 2.2, 0.1, 0.35); kd(dm, "lit", K.lit, i*3.2, y + Hs - 1.0, 0, 0.35, 0.35, 0.35); }
        y += Hs;
      }
      // steep tiled gable roof along x: two tiled slopes (decor on the top cassettes), gable ends, a ridge, dormers, chimneys
      var tops = sts[2].decks, rh = 4.2, sl = Math.atan2(rh, hz + 0.8);
      [-1, 1].forEach(function(sg){ tops.forEach(function(d){ if(Math.sign(d.spawn.z) !== sg) return;
        kq(d, "box", K.tile, d.spawn.x, y + rh/2, sg*(hz + 0.8)/2, 2*d.half[0] + 0.02, 0.35, Math.hypot(rh, hz + 0.8) + 0.3, 0, sg*sl, 0);
        for(var r = 0; r < 5; r++) kq(d, "ibox", K.tileD, d.spawn.x, y + 0.5 + r*rh/5.4, sg*(hz + 0.6 - r*(hz + 0.6)/5.4), 2*d.half[0], 0.08, 0.2, 0, sg*sl, 0); }); });
      [-1, 1].forEach(function(sx){ var d = H.near(tops, sx*hx, 0); kd(d, "prism", K.stone, sx*(hx - 0.15), y + rh/2, 0, 0.3, rh, 2*hz + 0.2); kd(d, "lit", K.lit, sx*(hx + 0.02), y + 1.2, 0, 0.2, 1.2, 0.8); });
      tops.forEach(function(d){ kd(d, "box", K.tileD, d.spawn.x, y + rh + 0.1, 0, 2*d.half[0], 0.3, 0.4); });
      [-4, 4].forEach(function(x){ var d = H.near(tops, x, 0); kd(d, "box", K.stoneD, x, y + rh + 0.9, -1.2, 1.0, 2.2, 1.0); });
      [-6, 0, 6].forEach(function(x){ var d = H.near(tops, x, hz); kd(d, "box", K.stone, x, y + 1.4, hz - 0.6, 1.6, 1.6, 1.2); kd(d, "prism", K.tile, x, y + 2.6, hz - 0.6, 1.9, 0.9, 1.5); kd(d, "lit", K.lit, x, y + 1.3, hz + 0.02, 0.8, 0.8, 0.06); });
      // torches on the ground posts of the front, the hidden powder store's crates by the far end (decor on the end wall)
      sts[0].piers.forEach(function(p){ if(p.gi == null || p.gi >= 20 || Math.abs(p.a1z - hz) > 1) return; kd(p, "ibox", K.iron, p.spawn.x, 2.6, p.spawn.z + p.half[2] + 0.15, 0.12, 0.6, 0.12); kd(p, "lit", 0xFFB347, p.spawn.x, 3.05, p.spawn.z + p.half[2] + 0.15, 0.25, 0.35, 0.25); });
      // the powder store: red drums standing on the first floor (hidden behind the walls). When that floor drops they land hard and go off.
      var nT = blocks.length; (P.store || []).forEach(function(t){ addBlock(t[0], (P.storeL || 1)*Hs + 0.6, t[1], 0.9, 1.2, 0.9, "tank", {floor:P.storeL || 1}); });
      if(P.bg) bgSet(n0, P.bg); for(var q7 = nT; q7 < blocks.length; q7++) blocks[q7].bg = 0;
      LV7.g7info = Object.assign(LV7.g7info || {}, { hall:{ members:blocks.length - n0, top:y + rh } });
      return { w:2*hx + 3, d:2*hz + 3 };
    };
    V5_PARTS.g7gtow = function(P){
      var n0 = blocks.length, hx = P.hx || 3.0, y = 0, s;
      for(s = 0; s < 4; s++){ var h = s === 0 ? 5 : 4.2;
        var st = H.boxSt({ y0:y, h:h, hx:hx, hz:hx, nx:3, nz:3, pw:0.95, mw:0.8, fl:s, MT:api.mat("concrete"), deck:DECK, skin:"wall", wall:"cpan", dk:0.4, tp:K.stoneD, td:K.stoneD, tw:s % 2 ? K.stoneL : K.stone });
        st.walls.forEach(function(w){ if(s === 0 && w.a1face === "x+"){ arch(w, K.wood, h, 1.6); } else { onF(w, "ibox", K.iron, 0, 0.2, 0.22, 1.4, 0.1); onF(w, "box", K.stoneD, 0, 0.2, 0.6, 1.8, 0.06); } });
        kd(st.decks[0], "box", K.stoneD, 0, y + h - 0.15, 0, 2*hx + 0.4, 0.3, 2*hx + 0.4); y += h; }
      var d = st.decks[0]; for(var i = -1; i <= 1; i++) [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function(q){ kd(d, "box", K.stoneL, q[0] ? q[0]*(hx + 0.1) : i*2.0, y + 0.5, q[1] ? q[1]*(hx + 0.1) : i*2.0, q[0] ? 0.5 : 1.1, 1.0, q[0] ? 1.1 : 0.5); });
      kd(d, "box", K.iron, 0, y + 1.6, 0, 0.12, 3.0, 0.12); kd(d, "box", K.cloth, 0.75, y + 2.6, 0, 1.4, 0.9, 0.05);   // a plain pennant (no emblem)
      if(P.bg) bgSet(n0, P.bg); return { w:2*hx + 2, d:2*hx + 2 };
    };
  })();


  // ---- g7 L03 "Grand Stage" (keep the blue buildings whole: open the hall first, then tip the stage tower AWAY).
  // g7fly: the stage (fly) tower, 22 m, L32 tip rule on its 8 ground posts. Its two safe faces (front, right) are hidden behind
  // the lobby and the auditorium: they can only be reached once those are down. g7aud: the auditorium (a big hall: curtain,
  // chandelier, balconies, seats). g7lobby: the front block (colonnade, arched windows, mansard roof, a dome). Inspired by a
  // French-colonial opera house (LANDMARKS #10): proportions and details are our own.
  (function(){
    if(typeof A1 === "undefined" || !A1.h || typeof M14 === "undefined") return;
    var H = A1.h, kd = l6KdAdd, api = M14.api, mem = H.mem, kq = H.kq;
    var K = { cream:0xF1E2C0, creamD:0xD9C69E, white:0xFFF8EA, slate:0x5E6B7A, slateD:0x47515E, gold:0xE8B23A, red:0xB8323A, redD:0x7E1F28, wood:0x8A5A33, iron:0x3A3D45, lit:0xFFD98A, glass:0x9FC3D6, green:0x6E9C83 };
    var FN = { "z+":[0, 1], "z-":[0, -1], "x+":[1, 0], "x-":[-1, 0] };
    function onF(b, g, c, u, v, w, h, t){ var n = FN[b.a1face]; if(!n) return; var X = !!n[0]; t = t || 0.06; var d = (X ? b.half[0] : b.half[2]) + t/2;
      kd(b, g, c, b.spawn.x + (X ? n[0]*d : u), b.spawn.y + v, b.spawn.z + (X ? u : n[1]*d), X ? t : w, h, X ? w : t); }
    function arch(w, c, hh, ww, v){ v = v || 0; onF(w, "box", c, 0, v - hh*0.08, ww, hh*0.6, 0.1); var n = FN[w.a1face], X = !!n[0], d = (X ? w.half[0] : w.half[2]) + 0.05;
      kd(w, "cyl", c, w.spawn.x + (X ? n[0]*d : 0), w.spawn.y + v + hh*0.22, w.spawn.z + (X ? 0 : n[1]*d), ww, 0.1, ww, X ? 0 : Math.PI/2, 0, X ? Math.PI/2 : 0); }
    var bgSet = function(n0, g){ for(var q = n0; q < blocks.length; q++) if(!blocks[q].anchor) blocks[q].bg = g; };
    var DECK = MEMBERS.a1lite ? "a1lite" : "mdC";
    V5_PARTS.g7fly = function(P){
      var n0 = blocks.length, hx = P.hx || 4.5, hz = P.hz || 4, y = 0, s;
      var base = addBlock(0, -0.25, 0, 2*hx + 2, 0.5, 2*hz + 2, "base", {anchor:true}); kd(base, "box", K.creamD, 0, 0.1, 0, 2*hx + 1.4, 0.2, 2*hz + 1.4);
      var g = H.boxSt({ y0:0, h:5.0, hx:hx, hz:hz, nx:3, nz:3, pw:1.2, mw:1.05, fl:0, MT:api.mat("rc"), deck:"mdeck", skin:"wall", wall:"cpan", dk:0.55, tp:K.creamD, td:K.creamD, tw:K.cream });
      g.piers.forEach(function(p){ p.key = "rc"; p.def = MEMBERS.rc; p.hp = p.hp0 = MEMBERS.rc.hp; p.tint = K.creamD;
        kd(p, "box", K.white, p.spawn.x, 0.3, p.spawn.z, 2*p.half[0] + 0.3, 0.6, 2*p.half[2] + 0.3); kd(p, "box", K.white, p.spawn.x, 4.2, p.spawn.z, 2*p.half[0] + 0.2, 0.25, 2*p.half[2] + 0.2); });
      LV7.g7tip = api.tip({ piers:g.piers, skin:g.walls, decks:g.decks, hinge:P.hold != null ? P.hold : 2.0, xz:function(p){ return p.a1x == null ? null : [p.a1x, p.a1z]; } });
      g.walls.forEach(function(w){ onF(w, "box", K.creamD, 0, -2.0, 2*Math.max(w.half[0], w.half[2]), 0.5, 0.1); if(w.a1face === "x-" || w.a1face === "z-"){ onF(w, "box", K.wood, 0, -0.8, 1.2, 2.6, 0.1); onF(w, "box", K.white, 0, 0.7, 1.6, 0.25, 0.14); } });
      y = 5.0;
      for(s = 0; s < (P.n || 4); s++){ var st = H.boxSt({ y0:y, h:4.3, hx:hx, hz:hz, nx:3, nz:3, pw:1.0, mw:0.85, fl:s + 1, MT:api.mat("concrete"), deck:DECK, skin:"wall", wall:"cpan", dk:0.4, tp:K.creamD, td:K.creamD, tw:s % 2 ? K.cream : 0xEAD9B3 });
        st.walls.forEach(function(w, k){ onF(w, "box", K.white, 0, 0.1, 0.7, 2.6, 0.08); onF(w, "box", K.glass, 0, 0.1, 0.5, 2.3, 0.1); if((k + s) % 3 === 0) onF(w, "lit", K.lit, 0, 0.1, 0.45, 2.1, 0.12); onF(w, "box", K.white, 0, 1.55, 1.0, 0.2, 0.14); });
        st.piers.forEach(function(p){ if(p.gi == null) return; var cn = Math.abs(p.a1x) > hx - 0.9 && Math.abs(p.a1z) > hz - 0.9; if(cn) kd(p, "box", K.white, p.spawn.x, y + 2.0, p.spawn.z, 2*p.half[0] + 0.12, 3.8, 2*p.half[2] + 0.12); });
        kd(st.decks[0], "box", K.white, 0, y + 4.3 - 0.15, 0, 2*hx + 0.4, 0.3, 2*hz + 0.4); y += 4.3; }
      // the roof: a low slate gable along z, a cornice, a gilded lyre on the gable end (our own ornament), a flag pole
      var d = st.decks[0]; kd(d, "box", K.white, 0, y + 0.25, 0, 2*hx + 0.7, 0.5, 2*hz + 0.7);
      [-1, 1].forEach(function(sg){ kq(d, "box", K.slate, sg*hx/2, y + 1.5, 0, hx + 0.6, 0.3, 2*hz + 0.6, 0, 0, sg*-0.5); });
      kd(d, "box", K.slateD, 0, y + 2.65, 0, 0.4, 0.3, 2*hz + 0.6);
      kd(d, "prism", K.cream, 0, y + 1.3, hz + 0.1, 2*hx, 2.4, 0.3); kd(d, "prism", K.cream, 0, y + 1.3, -hz - 0.1, 2*hx, 2.4, 0.3);
      kd(d, "cyl", K.gold, 0, y + 1.3, hz + 0.3, 1.1, 0.1, 1.1, Math.PI/2); kd(d, "box", K.gold, -0.25, y + 1.3, hz + 0.36, 0.08, 0.9, 0.04); kd(d, "box", K.gold, 0.25, y + 1.3, hz + 0.36, 0.08, 0.9, 0.04);
      kd(d, "box", K.iron, hx - 0.8, y + 3.6, 0, 0.1, 3.0, 0.1); kd(d, "box", K.red, hx - 0.15, y + 4.6, 0, 1.2, 0.8, 0.04);
      if(P.bg) bgSet(n0, P.bg); LV7.g7info = Object.assign(LV7.g7info || {}, { fly:{ top:y + 3, members:blocks.length - n0 } });
      return { w:2*hx + 2, d:2*hz + 2 };
    };
    V5_PARTS.g7aud = function(P){
      var n0 = blocks.length, hx = P.hx || 6.5, hz = P.hz || 5, Hs = 6.0, y = 0, s, i, sts = [];
      var base = addBlock(0, -0.25, 0, 2*hx + 1, 0.5, 2*hz + 1, "base", {anchor:true}); kd(base, "box", K.creamD, 0, 0.1, 0, 2*hx + 0.6, 0.2, 2*hz + 0.6);
      for(s = 0; s < 2; s++){
        var inner = []; for(i = 1; i < 3; i++) inner.push([-hx + i*2*hx/3, 0, 0.9]);
        var st = H.boxSt({ y0:y, h:Hs, hx:hx, hz:hz, nx:5, nz:3, pw:1.05, mw:0.85, fl:s, MT:api.mat("concrete"), deck:s ? DECK : "mdC", skin:"wall", wall:"cpan", split:[3, 2], dk:0.5, inner:inner, tp:K.creamD, td:K.creamD, tw:s ? K.cream : 0xEAD9B3 });
        sts.push(st);
        st.walls.forEach(function(w, k){ onF(w, "box", K.creamD, 0, -Hs*0.45, 2*Math.max(w.half[0], w.half[2]), 0.4, 0.1);
          if(w.a1face === (P.stage || "z-")) return;   // the stage wall: inside it hangs the curtain
          arch(w, K.glass, Hs, 1.4, 0.3); onF(w, "box", K.white, 0, Hs*0.3, 1.9, 0.25, 0.14); if((k + s) % 2 === 0) onF(w, "lit", K.lit, 0, -0.2, 0.8, 1.6, 0.12); });
        y += Hs;
      }
      // inside (the stage at the back, z-): red curtain on the stage wall, gold pelmet, rows of red seats facing it, two side
      // balconies, a chandelier
      var d0 = sts[0].decks, dk = H.near(d0, 0, -hz), z0 = -hz + 0.6;
      kd(dk, "box", K.redD, 0, 0.6, -hz + 1.2, 2*hx - 1.5, 1.2, 2.4);   // the stage floor
      for(i = -4; i <= 4; i++) kd(dk, "box", i % 2 ? K.red : K.redD, i*1.15, 6.0*0.55, z0 + 0.25, 1.1, 6.0*0.9, 0.12);
      kd(dk, "box", K.gold, 0, 6.0 - 0.9, z0 + 0.3, 2*hx - 1.2, 0.6, 0.2);
      for(var r = 0; r < 4; r++) for(var c2 = -2; c2 <= 2; c2++){ var hd = H.near(d0, c2*2.2, -hz + 4 + r*1.6); kd(hd, "ibox", K.red, c2*2.2, 0.45 + r*0.12, -hz + 4 + r*1.6, 1.6, 0.6, 0.6); }
      [-1, 1].forEach(function(sg){ var hb = H.near(d0, sg*(hx - 1.4), 1); kd(hb, "box", K.white, sg*(hx - 1.4), 3.4, 1, 1.6, 0.3, 2*hz - 4); kd(hb, "box", K.gold, sg*(hx - 2.2), 3.75, 1, 0.08, 0.4, 2*hz - 4); });
      var top = sts[1].decks, hc = H.near(top, 0, 0); kd(hc, "box", K.gold, 0, y - 1.6, 0, 0.06, 2.4, 0.06); kd(hc, "dome", K.gold, 0, y - 3.2, 0, 1.6, 0.9, 1.6); kd(hc, "lit", K.lit, 0, y - 3.4, 0, 1.2, 0.6, 1.2);
      // the roof: a shallow barrel vault in slate (decor on the top cassettes), a white cornice
      top.forEach(function(dd){ kd(dd, "box", K.white, dd.spawn.x, y + 0.2, dd.spawn.z, 2*dd.half[0] + 0.3, 0.4, 2*dd.half[2] + 0.3);
        [-1, 1].forEach(function(sg){ if(Math.sign(dd.spawn.x) !== sg) return; kq(dd, "box", K.slate, sg*hx/2, y + 1.3, dd.spawn.z, hx + 0.5, 0.3, 2*dd.half[2] + 0.1, 0, 0, -sg*0.42); });
        kd(dd, "box", K.slateD, 0, y + 2.35, dd.spawn.z, 0.5, 0.3, 2*dd.half[2] + 0.1); });
      [-1, 1].forEach(function(sz){ var dd = H.near(top, 0, sz*hz); kd(dd, "prism", K.cream, 0, y + 1.2, sz*(hz + 0.05), 2*hx, 2.2, 0.3); kd(dd, "cyl", K.glass, 0, y + 1.0, sz*(hz + 0.22), 1.3, 0.1, 1.3, Math.PI/2); });
      if(P.bg) bgSet(n0, P.bg); return { w:2*hx + 1, d:2*hz + 1 };
    };
    // the scenery dock behind the stage tower: one tall storey, big timber doors, stacked flats; it hides the tower's back legs
    V5_PARTS.g7dock = function(P){
      var n0 = blocks.length, hx = P.hx || 4.5, hz = P.hz || 1.6, h = 5.6;
      var base = addBlock(0, -0.25, 0, 2*hx + 1, 0.5, 2*hz + 1, "base", {anchor:true}); kd(base, "box", K.creamD, 0, 0.1, 0, 2*hx + 0.6, 0.2, 2*hz + 0.6);
      var st = H.boxSt({ y0:0, h:h, hx:hx, hz:hz, nx:4, nz:2, pw:0.9, mw:0.8, fl:0, MT:api.mat("concrete"), deck:"mdC", skin:"wall", wall:"cpan", split:[2, 1], dk:0.45, tp:K.creamD, td:K.creamD, tw:0xEAD9B3 });
      st.walls.forEach(function(w){ onF(w, "box", K.creamD, 0, -h*0.44, 2*Math.max(w.half[0], w.half[2]), 0.35, 0.1);
        if(w.a1face === "z-"){ onF(w, "box", K.wood, 0, -0.6, 2.0, 3.8, 0.1); for(var q = 0; q < 4; q++) onF(w, "ibox", K.iron, (q - 1.5)*0.5, -0.6, 0.06, 3.6, 0.14); }
        else onF(w, "box", K.glass, 0, 1.2, 1.0, 0.8, 0.08); });
      st.decks.forEach(function(dd){ kq(dd, "box", K.slate, dd.spawn.x, h + 0.45, dd.spawn.z, 2*dd.half[0] + 0.3, 0.3, 2*hz + 0.8, 0, -0.25, 0); });
      var d0 = st.decks[0]; for(var i = 0; i < 4; i++) kd(d0, "ibox", [K.green, K.red, K.creamD, K.slate][i], -hx + 1.5 + i*0.25, 2.0, 0, 0.12, 3.6, 2*hz - 0.8);
      if(P.bg) bgSet(n0, P.bg); return { w:2*hx + 1, d:2*hz + 1 };
    };
    V5_PARTS.g7lobby = function(P){
      var n0 = blocks.length, hx = P.hx || 11, hz = P.hz || 3, y = 0, s, i, hs = [5.0, 4.4, 4.0], sts = [];
      var base = addBlock(0, -0.25, 0, 2*hx + 2, 0.5, 2*hz + 4, "base", {anchor:true}); kd(base, "box", K.white, 0, 0.12, 1, 2*hx + 1.6, 0.24, 2*hz + 3.6);
      for(i = 0; i < 4; i++) kd(base, "box", K.white, 0, 0.12 + i*0.0, hz + 1.2 + i*0.35, 9 - i*0.6, 0.24 + 0.1*(3 - i), 0.4);   // the front steps
      for(s = 0; s < 3; s++){ var h = hs[s];
        var st = H.boxSt({ y0:y, h:h, hx:hx, hz:hz, nx:8, nz:2, pw:1.0, mw:0.8, fl:s, MT:api.mat("concrete"), deck:s ? DECK : "mdC", skin:"wall", wall:"cpan", split:[4, 1], dk:0.45, tp:K.creamD, td:K.creamD, tw:s === 1 ? K.cream : 0xEAD9B3 });
        sts.push(st);
        st.walls.forEach(function(w){ onF(w, "box", K.creamD, 0, -h*0.44, 2*Math.max(w.half[0], w.half[2]), 0.35, 0.1);
          if(w.a1face === "z+"){ if(s === 0){ arch(w, K.wood, h, 1.5, -0.2); onF(w, "box", K.lit, 0, -0.6, 0.9, 1.8, 0.12); } else if(s === 1){ arch(w, K.glass, h, 1.3, 0.2); onF(w, "box", K.white, 0, -h*0.36, 1.8, 0.3, 0.4); } else { onF(w, "cyl", K.glass, 0, 0.1, 1.2, 1.2, 0.1); } }
          else if(w.a1face === "z-"){ onF(w, "box", K.glass, 0, 0.2, 0.9, 1.6, 0.08); }
          else { arch(w, K.glass, h, 1.2, 0.2); } });
        // the colonnade: paired white columns on the front of the two lower storeys, a balustrade on the first floor
        if(s < 2) st.piers.forEach(function(p){ if(p.a1z < hz - 1) return; for(var q = -1; q <= 1; q += 2){ kd(p, "cyl", K.white, p.spawn.x + q*0.32, y + (h - 0.45)/2, hz + 0.45, 0.42, h - 0.6, 0.42); }
          kd(p, "box", K.white, p.spawn.x, y + h - 0.6, hz + 0.45, 1.3, 0.3, 0.6); kd(p, "box", K.white, p.spawn.x, y + 0.15, hz + 0.45, 1.2, 0.3, 0.6); });
        if(s === 1) st.decks.forEach(function(dd){ kd(dd, "box", K.white, dd.spawn.x, y - 0.1, hz + 0.6, 2*dd.half[0], 0.2, 1.1); for(var b = -2; b <= 2; b++) kd(dd, "box", K.white, dd.spawn.x + b*1.0, y + 0.45, hz + 1.05, 0.14, 0.9, 0.14); kd(dd, "box", K.white, dd.spawn.x, y + 0.95, hz + 1.05, 2*dd.half[0], 0.14, 0.2); });
        st.decks.forEach(function(dd){ kd(dd, "box", K.white, dd.spawn.x, y + h - 0.12, dd.spawn.z, 2*dd.half[0] + 0.3, 0.3, 2*dd.half[2] + 0.5); });
        y += h; }
      // mansard roof: slate slopes front and back, a cream central pavilion with a ribbed dome and a lantern, two corner domes,
      // gilded urns along the parapet
      var top = sts[2].decks;
      top.forEach(function(dd){ kq(dd, "box", K.slate, dd.spawn.x, y + 0.9, hz - 0.6, 2*dd.half[0], 0.3, 2.2, 0, 0.75, 0); kq(dd, "box", K.slate, dd.spawn.x, y + 0.9, -hz + 0.6, 2*dd.half[0], 0.3, 2.2, 0, -0.75, 0);
        kd(dd, "box", K.slateD, dd.spawn.x, y + 1.7, 0, 2*dd.half[0], 0.2, 2*hz - 2.4);
        for(var u = -1; u <= 1; u += 2) kd(dd, "ibush", K.gold, dd.spawn.x + u*1.2, y + 0.35, hz + 0.1, 0.35, 0.5, 0.35); });
      var dc = H.near(top, 0, 0);
      kd(dc, "box", K.cream, 0, y + 1.4, 0, 5.2, 2.8, 2*hz - 0.4); kd(dc, "box", K.white, 0, y + 2.9, 0, 5.6, 0.3, 2*hz);
      kd(dc, "cyl", K.cream, 0, y + 3.5, 0, 4.2, 1.0, 4.2); kd(dc, "dome", K.green, 0, y + 4.0, 0, 4.4, 2.6, 4.4);
      for(i = 0; i < 8; i++) kd(dc, "box", K.white, Math.sin(i*Math.PI/4)*1.9, y + 4.5, Math.cos(i*Math.PI/4)*1.9, 0.14, 1.4, 0.14, 0, i*Math.PI/4, 0);
      kd(dc, "cyl", K.white, 0, y + 6.4, 0, 0.9, 0.9, 0.9); kd(dc, "dome", K.gold, 0, y + 6.9, 0, 0.9, 0.6, 0.9); kd(dc, "box", K.gold, 0, y + 7.6, 0, 0.08, 0.8, 0.08);
      kd(dc, "prism", K.cream, 0, y + 0.9, hz + 0.05, 5.2, 1.8, 0.3); kd(dc, "cyl", K.gold, 0, y + 0.9, hz + 0.25, 0.9, 0.1, 0.9, Math.PI/2);
      [-1, 1].forEach(function(sx){ var dd = H.near(top, sx*(hx - 1.5), 0); kd(dd, "box", K.cream, sx*(hx - 1.5), y + 1.0, 0, 2.6, 2.0, 2.6); kd(dd, "dome", K.slate, sx*(hx - 1.5), y + 2.0, 0, 2.6, 1.6, 2.6); kd(dd, "box", K.gold, sx*(hx - 1.5), y + 3.1, 0, 0.08, 0.7, 0.08); });
      // lamps on the forecourt (decor on the base)
      [-1, 1].forEach(function(sx){ kd(base, "box", K.iron, sx*5.5, 1.5, hz + 2.6, 0.14, 3.0, 0.14); kd(base, "lit", K.lit, sx*5.5, 3.1, hz + 2.6, 0.45, 0.6, 0.45); });
      if(P.bg) bgSet(n0, P.bg); return { w:2*hx + 2, d:2*hz + 4 };
    };
  })();

  // ==================================================================================================================
  // g7 L04 "Canal Row" (domino: pick the end that sends the chain AWAY from the blue). A row of tall narrow brick townhouses,
  // rising in height, the last one a merchant tower, then a big brick warehouse. The middle houses stand on TNT-proof stone
  // legs (hit7): only a neighbour falling on them brings them down. dom7: a house hit hard from the side by a falling
  // neighbour gives way on the far side and falls the same way (its legs on that face fail): a readable domino.
  // ==================================================================================================================
  (function(){
    if(typeof A1 === "undefined" || !A1.h || typeof M14 === "undefined") return;
    var H = A1.h, kd = l6KdAdd, api = M14.api, kq = H.kq;
    var K = { white:0xFFF8EA, stone:0xC9C2B4, stoneD:0x8E8676, ash:0x6E6A60, slate:0x4F5866, wood:0x7A4E2D, iron:0x3A3D45, lit:0xFFD98A, glass:0x9FC3D6, gold:0xE8B23A, copper:0x6E9C83,
      brick:[0xB5523B, 0xD9A441, 0x4E8F8C, 0xC97B7B, 0x8A6A9E, 0xA8452F, 0xB8683E] };
    var FN = { "z+":[0, 1], "z-":[0, -1], "x+":[1, 0], "x-":[-1, 0] };
    function onF(b, g, c, u, v, w, h, t){ var n = FN[b.a1face]; if(!n) return; var X = !!n[0]; t = t || 0.06; var d = (X ? b.half[0] : b.half[2]) + t/2;
      kd(b, g, c, b.spawn.x + (X ? n[0]*d : u), b.spawn.y + v, b.spawn.z + (X ? u : n[1]*d), X ? t : w, h, X ? w : t); }
    var bgSet = function(n0, g){ for(var q = n0; q < blocks.length; q++) if(!blocks[q].anchor) blocks[q].bg = g; };
    var DECK = MEMBERS.a1lite ? "a1lite" : "mdC";
    // dom7: the domino rule
    var ih10 = impactHit;
    impactHit = function(b, dv){
      var D = L && L.dom7;
      if(D && D.impact && b && !b.dead && b.bid && dv > (D.dv || 3) && b.mass > (D.m || 500)){
        for(var q = 0; q < blocks.length; q++){ var h = blocks[q]; if(h.dead || !h.bid || h.bid === b.bid || !h.rb || (h.floor || 0) < 1 || D.parts.indexOf(h.bid) < 0) continue;
          var gx = Math.abs(h.P.x - b.P.x) - h.half[0] - b.half[0] - b.half[2], gy = Math.abs(h.P.y - b.P.y) - h.half[1] - b.half[1] - b.half[2], gz = Math.abs(h.P.z - b.P.z) - h.half[2] - b.half[2] - b.half[0];
          if(Math.max(gx, gy, gz) > (D.reach || 0.4)) continue;
          var legs = blocks.filter(function(m){ return m.dom7leg && m.bid === h.bid && !m.dead; }); if(!legs.length) continue;
          var cx = legs.reduce(function(a, m){ return a + m.spawn.x; }, 0)/legs.length, dir = Math.sign(cx - b.P.x) || 1;
          var face = legs.filter(function(m){ return Math.sign(m.spawn.x - cx) === dir && Math.abs(m.spawn.x - cx) > 0.5; });
          if(!face.length) continue;
          LV7.log.push("dom7 " + b.bid + " -> " + h.bid + " dir " + dir);
          face.forEach(function(m){ failMember(m, "impact"); });
        }
      }
      return ih10(b, dv);
    };
    // dom7 lean push: a falling neighbour that LEANS on a house (no hard hit) pushes it over too. Every 6 physics steps: a member
    // of another part, already 0.8 m off its spot and above 3 m, touching a member (floor >= 1) of a dom7 house -> that house goes.
    function domFail(h, x){ var legs = blocks.filter(function(m){ return m.dom7leg && m.bid === h.bid && !m.dead; }); if(!legs.length) return;
      var cx = legs.reduce(function(a, m){ return a + m.spawn.x; }, 0)/legs.length, dir = Math.sign(cx - x) || 1;
      var face = legs.filter(function(m){ return Math.sign(m.spawn.x - cx) === dir && Math.abs(m.spawn.x - cx) > 0.5; });
      if(!face.length) return; LV7.log.push("dom7 lean -> " + h.bid + " dir " + dir); face.forEach(function(m){ failMember(m, "impact"); }); }
    var fs11 = fixedStep, dstep = 0;
    // a house is TOPPLING when its top member (still whole) has moved more than 1.5 m sideways. If that top is now over the
    // near half of the next house in that direction (or touching it), the next house goes the same way. Loose wall panels and
    // flying debris never count: only the whole house leaning over does.
    fixedStep = function(){ var r = fs11.apply(this, arguments); var D = L && L.dom7; if(!D || (++dstep % 6)) return r;
      var info = {}; blocks.forEach(function(m){ if(!m.bid || D.parts.indexOf(m.bid) < 0 || m.anchor) return; var e = info[m.bid] = info[m.bid] || { top:null, x0:1e9, x1:-1e9, legs:0, done:0 };
        e.x0 = Math.min(e.x0, m.spawn.x - m.half[0]); e.x1 = Math.max(e.x1, m.spawn.x + m.half[0]); if(m.dom7leg && !m.dead) e.legs++; if(m.dom7done) e.done = 1;
        if(!m.dead && m.rb && m.half[1] < 1 && (!e.top || m.spawn.y > e.top.spawn.y)) e.top = m; });
      Object.keys(info).forEach(function(id){ var e = info[id], t = e.top; if(!t) return; var dx = t.P.x - t.spawn.x, dz = t.P.z - t.spawn.z; if(Math.abs(dx) < 1.5 || Math.abs(dx) < Math.abs(dz) || t.P.y < 2 || t.P.y < 0.35*t.spawn.y || Math.abs(dx) > 0.9*t.spawn.y) return;   // leaning SIDEWAYS (along the row), not falling forward
        var dir = Math.sign(dx), best = null;
        Object.keys(info).forEach(function(j){ if(j === id) return; var f = info[j]; if(f.done || !f.legs) return; var c = (f.x0 + f.x1)/2;
          if(Math.sign(c - (e.x0 + e.x1)/2) !== dir) return; if(!best || Math.abs(c - t.spawn.x) < Math.abs((best.x0 + best.x1)/2 - t.spawn.x)) best = Object.assign({ id:j }, f); });
        if(!best) return; var near = dir > 0 ? best.x0 : best.x1, reach = t.P.x + dir*(t.half[0] + 0.3);
        if(dir*(reach - near) < 0) return;   // not over it yet
        blocks.forEach(function(m){ if(m.bid === best.id) m.dom7done = 1; });
        var tops = blocks.filter(function(m){ return m.bid === best.id && !m.dead; }); if(tops.length) domFail(tops[0], t.P.x);
      });
      return r; };
    // one townhouse: w (x) x d (z), n storeys of 3.3 m on a 4.2 m shop storey; legs: "rc" (blastable) or "hard7i" (TNT-proof);
    // a stepped or bell gable on the street front (z+), a hoist beam, white sash windows, a shop front with an awning
    V5_PARTS.g7house = function(P){
      var n0 = blocks.length, hx = (P.w || 4.4)/2, hz = (P.d || 8)/2, n = P.n || 4, col = K.brick[(P.c || 0) % K.brick.length], y = 0, s, sts = [];
      var base = addBlock(0, -0.25, 0, 2*hx + 0.6, 0.5, 2*hz + 2.4, "base", {anchor:true}); kd(base, "box", K.stone, 0, 0.1, 1.0, 2*hx + 0.4, 0.2, 2*hz + 2.2);
      var legKey = P.legs || "hard7i", MT0 = legKey === "hard7i" ? { pier:"hard7i", deck:"mdC" } : legKey === "hrc" ? api.mat("rc") : api.mat("rc");
      for(s = 0; s <= n; s++){ var h = s === 0 ? 4.2 : 3.3;
        var st = H.boxSt({ y0:y, h:h, hx:hx, hz:hz, nx:3, nz:3, pw:s ? 0.7 : 0.85, mw:s ? 0.6 : 0.75, fl:s, MT:s ? api.mat("concrete") : MT0, deck:s ? DECK : "mdC", skin:"wall", wall:"cpan", dk:0.35, tp:s ? col : K.ash, td:K.stoneD, tw:col });
        sts.push(st);
        if(s === 0){ st.piers.forEach(function(p){ p.dom7leg = 1; if(legKey === "rc"){ p.key = "rc"; p.def = MEMBERS.rc; p.hp = p.hp0 = MEMBERS.rc.hp; } else if(legKey === "hrc"){ p.key = "hrc"; p.def = MEMBERS.hrc; p.hp = p.hp0 = MEMBERS.hrc.hp; } p.tint = K.ash;
            kd(p, "box", K.stoneD, p.spawn.x, 0.3, p.spawn.z, 2*p.half[0] + 0.2, 0.6, 2*p.half[2] + 0.2); });
          api.tip({ piers:st.piers, skin:st.walls, decks:st.decks, hinge:P.hold != null ? P.hold : 1.5, xz:function(p){ return p.a1x == null ? null : [p.a1x, p.a1z]; } }); }
        st.walls.forEach(function(w){ var f = w.a1face;
          if(s === 0){ if(f === "z+"){ onF(w, "box", K.glass, 0, 0.1, 1.2, 2.2, 0.08); onF(w, "lit", K.lit, 0, 0.1, 0.9, 1.6, 0.1); } else onF(w, "box", K.stoneD, 0, -1.6, 2*Math.max(w.half[0], w.half[2]), 0.5, 0.1); return; }
          onF(w, "box", K.white, 0, 0.15, 1.0, 1.8, 0.08); onF(w, "box", K.glass, 0, 0.15, 0.8, 1.6, 0.1); onF(w, "box", K.white, 0, 0.15, 0.08, 1.6, 0.12); onF(w, "box", K.white, 0, 0.15, 0.8, 0.08, 0.12);
          if((s + (P.c || 0)) % 3 === 0) onF(w, "lit", K.lit, 0, 0.15, 0.7, 1.4, 0.12);
          if(f === "z+" && s === 1) onF(w, "box", 0x5E8C3A, 0, -0.95, 1.1, 0.3, 0.35); });
        // cornice band at each floor on the street front
        kd(st.decks[0], "box", K.white, 0, y + h - 0.12, hz + 0.08, 2*hx + 0.1, 0.18, 0.18);
        y += h; }
      // shop front: a striped awning and a sign board
      var g0 = sts[0].decks[0]; for(var i = 0; i < 4; i++) kq(g0, "box", i % 2 ? K.white : col, -hx + 0.55 + i*(2*hx - 1.1)/3, 3.25, hz + 0.6, (2*hx - 0.4)/4, 0.08, 1.2, 0, 0.35, 0);
      kd(g0, "box", K.wood, 0, 3.8, hz + 0.08, 2*hx - 0.6, 0.45, 0.08);
      // the roof is a REAL body (Khai 20/11: roofs floated after the fall when they were decor on the top floor): an attic block
      // as wide and deep as the house; the gable (stepped for even c, bell for odd c), the hoist beam and the roof slopes are
      // decor flush on THAT block, inside its outline, so they fall, tumble and land with it.
      var gh = P.gable || 3.2, ah = gh*0.6, at = addBlock(0, y + ah/2, 0, 2*hx - 0.1, ah, 2*hz - 0.1, "wwall", {floor:n + 1}); at.tint = col;
      var ay = y + ah;   // top of the attic block
      if((P.c || 0) % 2 === 0){ for(var k = 0; k < 3; k++){ var ww = 2*hx - 0.4 - k*(2*hx/4.4), sh = (gh - ah)/3; kd(at, "box", col, 0, ay + k*sh + sh/2, hz - 0.2, ww, sh, 0.3); kd(at, "box", K.white, 0, ay + (k + 1)*sh - 0.04, hz - 0.2, ww + 0.08, 0.08, 0.34); } }
      else { kd(at, "prism", col, 0, ay + (gh - ah)/2, hz - 0.2, 2*hx - 0.3, gh - ah, 0.3); kd(at, "dome", col, 0, ay + (gh - ah) - 0.05, hz - 0.2, 1.0, 0.6, 0.3); }
      kd(at, "box", K.white, 0, y + 0.05, hz - 0.03, 2*hx, 0.12, 0.08); kd(at, "box", K.white, 0, ay - 0.05, hz - 0.03, 2*hx - 0.1, 0.1, 0.08);
      kd(at, "box", K.glass, 0, y + ah*0.5, hz - 0.03, 0.7, 0.8, 0.06); kd(at, "box", K.white, 0, y + ah*0.5, hz - 0.04, 0.85, 0.95, 0.05);
      kd(at, "box", K.wood, 0, y + ah*0.8, hz - 0.03, 0.16, 0.16, 0.12);
      // slopes: two slate planes from the eaves (sides of the block) up to a ridge just above it (flush, never overhanging)
      var rise = gh - ah, run = hx - 0.1, sl = Math.atan2(rise, run);
      [-1, 1].forEach(function(sg){ kq(at, "box", K.slate, sg*run/2, ay + rise/2, -0.2, Math.hypot(run, rise), 0.18, 2*hz - 0.7, 0, 0, -sg*sl); });
      kd(at, "box", K.slate, 0, ay + rise - 0.05, -0.2, 0.3, 0.18, 2*hz - 0.7);
      if(P.spire){ kd(at, "box", col, 0, ay + rise + 0.9, -0.4, 1.8, 1.8, 1.8); kd(at, "cone", K.copper, 0, ay + rise + 3.0, -0.4, 2.1, 2.6, 2.1); kd(at, "box", K.gold, 0, ay + rise + 4.6, -0.4, 0.1, 0.8, 0.1); }
      if(P.bg) bgSet(n0, P.bg); return { w:2*hx + 0.6, d:2*hz + 2.4 };
    };
    // the warehouse at the end of the row: a long brick hall, 3 storeys, arched loading doors, a crane gable, a sawtooth roof
    V5_PARTS.g7ware = function(P){
      var n0 = blocks.length, hx = P.hx || 6, hz = P.hz || 5, y = 0, s, sts = [], col = 0x9E4A35;
      var base = addBlock(0, -0.25, 0, 2*hx + 1, 0.5, 2*hz + 1, "base", {anchor:true}); kd(base, "box", K.stone, 0, 0.1, 0, 2*hx + 0.6, 0.2, 2*hz + 0.6);
      for(s = 0; s < 3; s++){ var h = s ? 4.0 : 5.0;
        var st = H.boxSt({ y0:y, h:h, hx:hx, hz:hz, nx:5, nz:3, pw:0.9, mw:0.75, fl:s, MT:api.mat("brick"), deck:s ? DECK : "mdC", skin:"wall", wall:"bkw", split:[2, 2], dk:0.4, tp:col, td:K.stoneD, tw:s % 2 ? col : 0xAE5A42 });
        sts.push(st);
        // the ground storey stands on massive RC posts (layer7: one layer per blast): the row's fall shakes it, never drops it
        if(s === 0 && P.hrc) st.piers.forEach(function(p){ p.key = "hrc"; p.def = MEMBERS.hrc; p.hp = p.hp0 = MEMBERS.hrc.hp; p.tint = K.ash; api.rcDecor(p, Math.sign(p.a1x) || 1, 0, p.spawn.x + (Math.sign(p.a1x) || 1)*(p.half[0] + 0.02), p.spawn.z, 1.0); });
        st.walls.forEach(function(w){ var c = FN[w.a1face], hh = h; onF(w, "box", K.white, 0, hh*0.32, 1.3, 0.16, 0.12);
          if(s === 0 && w.a1face === "z+"){ onF(w, "box", K.wood, 0, -0.6, 1.6, 3.0, 0.1); onF(w, "cyl", K.wood, 0, 0.9, 1.6, 1.6, 0.1); }
          else { onF(w, "box", K.glass, 0, 0.2, 0.9, 1.6, 0.08); onF(w, "box", K.white, 0, 0.2, 0.06, 1.6, 0.12); } });
        y += h; }
      var top = sts[2].decks;
      top.forEach(function(dd){ for(var k = 0; k < 2; k++){ var zz = dd.spawn.z + (k - 0.5)*dd.half[2]; kq(dd, "box", K.slate, dd.spawn.x, y + 0.9, zz - 0.2, 2*dd.half[0], 0.2, dd.half[2]*1.15, 0, 0.9, 0); kd(dd, "box", K.glass, dd.spawn.x, y + 0.9, zz + dd.half[2]*0.45, 2*dd.half[0], 1.6, 0.1); } });
      var dc = H.near(top, 0, hz); kd(dc, "prism", col, 0, y + 1.6, hz - 0.15, 4.4, 3.2, 0.3); kd(dc, "box", K.wood, 0, y + 2.2, hz + 0.5, 0.2, 0.2, 1.2); kd(dc, "box", K.white, -2.8, y - 0.4, hz + 0.1, 3, 0.6, 0.1);
      if(P.bg) bgSet(n0, P.bg); return { w:2*hx + 1, d:2*hz + 1 };
    };
  })();

  // ==================================================================================================================
  // g7 L05 "Glass Spine" (peel the shell, find the core). A glass office tower on a stone podium; the floors hang on a
  // concrete core of 4 piers in the middle. The facade posts are slender (they carry almost nothing). The core's ground
  // piers are massive RC (layer7: one layer per blast) and sit deep inside the podium, behind shop fronts and walls.
  // Two identical glass pavilions flank it on the axis. Inspired by a modern glass tower with a concrete core (LANDMARKS #8).
  // ==================================================================================================================
  (function(){
    if(typeof A1 === "undefined" || !A1.h || typeof M14 === "undefined") return;
    var H = A1.h, kd = l6KdAdd, api = M14.api, kq = H.kq;
    var K = { stone:0xD8D2C4, stoneD:0x9A9384, core:0x8E9196, glass:0x86B7D6, glassD:0x5E8FB3, frame:0x3E4A5A, white:0xF4F6F8, lit:0xFFE7A8, green:0x6FA86A, wood:0x8A5A33, gold:0xE8B23A };
    var FN = { "z+":[0, 1], "z-":[0, -1], "x+":[1, 0], "x-":[-1, 0] };
    function onF(b, g, c, u, v, w, h, t){ var n = FN[b.a1face]; if(!n) return; var X = !!n[0]; t = t || 0.06; var d = (X ? b.half[0] : b.half[2]) + t/2;
      kd(b, g, c, b.spawn.x + (X ? n[0]*d : u), b.spawn.y + v, b.spawn.z + (X ? u : n[1]*d), X ? t : w, h, X ? w : t); }
    var bgSet = function(n0, g){ for(var q = n0; q < blocks.length; q++) if(!blocks[q].anchor) blocks[q].bg = g; };
    var DECK = MEMBERS.a1lite ? "a1lite" : "mdC";
    // the core above the ground: concrete that peels one layer per blast (L.layer7 lists it) but counts as down once it falls
    MEMBERS.core7 = Object.assign({}, MEMBERS.concrete, { hp:200, color:K.core }); MATS.core7 = MATS.concrete;
    V5_PARTS.g7spine = function(P){
      var n0 = blocks.length, ph = P.ph || 9, th = P.th || 6, cw = P.cw || 1.5, cx = P.cr || 1.7, n = P.n || 9, pod = P.pod == null ? 2 : P.pod, y = 0, s, sts = [];
      var core = [[-cx, -cx], [cx, -cx], [-cx, cx], [cx, cx]];
      var base = addBlock(0, -0.25, 0, 2*Math.max(ph, th) + 2, 0.5, 2*Math.max(ph, th) + 2, "base", {anchor:true}); kd(base, "box", K.stoneD, 0, 0.1, 0, 2*Math.max(ph, th) + 1.6, 0.2, 2*Math.max(ph, th) + 1.6);
      for(s = 0; s < pod + n; s++){ var isPod = s < pod, hh = isPod ? 4.6 : 3.6, hx = isPod ? ph : th;
        var inner = P.noCore ? [] : core.map(function(q){ return [q[0], q[1], cw]; });
        var st = H.boxSt({ y0:y, h:hh, hx:hx, hz:hx, nx:isPod ? 5 : (P.noCore ? 3 : 4), nz:isPod ? 5 : (P.noCore ? 3 : 4), pw:isPod ? 0.9 : 0.55, mw:isPod ? 0.8 : 0.45, fl:s, MT:api.mat("concrete"), deck:DECK, skin:isPod ? "wall" : "glass", wall:"cpan", split:isPod ? [3, 3] : [2, 2], dk:0.4, inner:inner,
          tp:isPod ? K.stoneD : K.frame, td:K.stoneD, tw:K.stone });
        sts.push(st);
        st.piers.forEach(function(p){ if(p.gi >= 20){ p.core7 = 1; p.tint = K.core; if(s === 0 && P.hrc !== false){ p.key = "hrc"; p.def = MEMBERS.hrc; p.hp = p.hp0 = MEMBERS.hrc.hp; } else if(P.hrc !== false){ p.key = "core7"; p.def = MEMBERS.core7; p.hp = p.hp0 = MEMBERS.core7.hp; } } });   // upper core: core7 (layered, soft)
        if(isPod){ st.walls.forEach(function(w, k){ onF(w, "box", K.stoneD, 0, -hh*0.44, 2*Math.max(w.half[0], w.half[2]), 0.35, 0.1);
            if(s === 0){ onF(w, "box", K.glassD, 0, 0.1, 2.2, 2.8, 0.08); onF(w, "lit", K.lit, 0, -0.2, 1.8, 1.8, 0.1); onF(w, "box", [0xC8463E, 0x3F7FBF, 0x5FA35F, 0xE0A23A][k % 4], 0, 1.75, 2.4, 0.5, 0.12); }
            else { for(var q = -1; q <= 1; q += 2) onF(w, "box", K.glass, q*0.7, 0.2, 0.9, 2.2, 0.08); } });
          kd(st.decks[0], "box", K.white, 0, y + hh - 0.15, 0, 2*hx + 0.4, 0.3, 2*hx + 0.4); }
        else { st.panes.forEach(function(g){ H.paneDress(g, y, hh, s); });
          if(s === pod) st.decks.forEach(function(d){ kd(d, "ibush", K.green, d.spawn.x*1.35, y + 0.5, d.spawn.z*1.35, 1.2, 0.9, 1.2); });   // podium roof garden
          kd(st.decks[0], "box", K.frame, 0, y + hh - 0.12, 0, 2*hx + 0.15, 0.22, 2*hx + 0.15); }
        // the core inside: dark concrete walls (decor on the core piers) with a lift door, so a broken facade shows it
        var cp = st.piers.filter(function(p){ return p.core7; }); if(P.noCore && s === 0) st.panes.forEach(function(g){ kd(g, "lit", K.lit, g.spawn.x, y + 1.2, g.spawn.z, 0.6, 0.6, 0.6); });
        cp.forEach(function(p, k){ var sx = Math.sign(p.spawn.x), sz = Math.sign(p.spawn.z); kd(p, "box", K.core, p.spawn.x - sx*cx/2, y + (hh - 0.4)/2, p.spawn.z, cx, hh - 0.5, 0.25); });
        y += hh;
      }
      // crown: a set-back glass lantern, a mast with a light
      var d = sts[sts.length - 1].decks[0]; kd(d, "box", K.glassD, 0, y + 1.3, 0, 2*th - 3, 2.6, 2*th - 3); kd(d, "box", K.frame, 0, y + 2.7, 0, 2*th - 2.6, 0.25, 2*th - 2.6);
      kd(d, "box", K.frame, 0, y + 5.0, 0, 0.18, 4.6, 0.18); kd(d, "lit", 0xFF5A4A, 0, y + 7.4, 0, 0.35, 0.35, 0.35);
      // podium entrance: a canopy and steps on the front, planters
      var g0 = sts[0]; kd(g0.decks[0], "box", K.frame, 0, 3.6, ph + 1.2, 6, 0.2, 2.4); for(var i = 0; i < 3; i++) kd(base, "box", K.stone, 0, 0.1 + i*0.12, ph + 0.5 + i*0.35, 7 - i*0.6, 0.2, 0.4);
      [-1, 1].forEach(function(sx){ kd(base, "box", K.stoneD, sx*4.6, 0.4, ph + 1.0, 1.4, 0.8, 1.4); kd(base, "ibush", K.green, sx*4.6, 1.1, ph + 1.0, 1.3, 0.9, 1.3); });
      if(P.bg) bgSet(n0, P.bg); LV7.g7info = Object.assign(LV7.g7info || {}, { spine:{ top:y, members:blocks.length - n0 } });
      return { w:2*Math.max(ph, th) + 2, d:2*Math.max(ph, th) + 2 };
    };
  })();

  LV7.kdGap = function(){ return typeof l6KdGap === 'function' ? l6KdGap() : null; };
  LV7.closeUp = function(x, y, z, d, yw, pt){ focus.set(x, y, z); focusY = y; camFocusY = y; dist = d; camDist = d; zoomK = zoomT = 1; if(yw != null){ baseYaw = yaw = yw; } if(pt != null) pitch = pt; for(var i = 0; i < 30; i++) updateCamera(0.1); camera.updateMatrixWorld(true); return [camera.position.x, camera.position.y, camera.position.z]; };
  // test hook: turn the view a quarter at a time, like the player's swipe (k = 0..3), and settle the camera at once
  LV7.view = function(k){ var y0 = (L && L.yaw != null) ? L.yaw : 0.55; baseYaw = y0 + (k || 0)*QUARTER; yaw = baseYaw; for(var i = 0; i < 40; i++) updateCamera(0.1); yaw = baseYaw; updateCamera(0.001); camera.updateMatrixWorld(true); return baseYaw; };

  // ==================================================================================================================
  // g7 E01 "Long Legs" (easy pack, lesson: hit the legs). A long housing slab lifted on sculpted pilotis (inspired by the
  // modernist "city in the sky" slabs: raised body, colourful loggias, a roof terrace with a funnel stack and a gym; our own
  // proportions and colours, never a replica). The slab is THREE sections side by side (own bond group each: they rest
  // against each other, they are never glued), each on 4 legs: bombs on the facade only break glass, bombs on the legs drop a
  // section. The roof pieces are heavy (hard7v: they land whole and still count until a bomb cracks them).
  // g7stilt: a timber clubhouse raised on 4 legs (easy), one at each end; red drums sit under the slab ends (L.hit7.drums:
  // a section landing on them sets them off, and the blast knocks the clubhouse's legs out: the chain).
  // ==================================================================================================================
  (function(){
    if(typeof A1 === "undefined" || !A1.h || typeof M14 === "undefined") return;
    var H = A1.h, kd = l6KdAdd, api = M14.api, kq = H.kq, bar = H.bar, mem = H.mem;
    var K = { conc:0xD9D3C6, concD:0xB4AC9C, concL:0xEEE9DF, white:0xF7F4EC, ink:0x3A3D45, glass:0x9FC3D6, lit:0xFFD98A, warm:0xFFF1C4,
      lawn:0x7FB069, lawnD:0x5E8F4E, path:0xD8CDB4, leaf:0x4F8F46, trunk:0x7A5236, wood:0xC58B55, woodD:0x8A5A33, roof:0x3F6E78, roofD:0x2F5660,
      cols:[0xD8442E, 0xF2C230, 0x2E6FB8, 0x5BA35A, 0xE8803A] };
    var bgSet = function(n0, g){ for(var q = n0; q < blocks.length; q++) if(!blocks[q].anchor) blocks[q].bg = g; };
    var FN = { "z+":[0, 1], "z-":[0, -1], "x+":[1, 0], "x-":[-1, 0] };
    function onF(b, g, c, u, v, w, h, t){ var n = FN[b.a1face]; if(!n) return; var X = !!n[0]; t = t || 0.06; var d = (X ? b.half[0] : b.half[2]) + t/2;
      kd(b, g, c, b.spawn.x + (X ? n[0]*d : u), b.spawn.y + v, b.spawn.z + (X ? u : n[1]*d), X ? t : w, h, X ? w : t); }
    function tree(host, x, z, s){ kd(host, "icyl", K.trunk, x, 1.1*s, z, 0.35*s, 2.2*s, 0.35*s); kd(host, "ibush", K.leaf, x, 2.9*s, z, 2.4*s, 2.2*s, 2.4*s); kd(host, "ibush", K.lawnD, x + 0.4*s, 3.5*s, z - 0.3*s, 1.5*s, 1.4*s, 1.5*s); }
    V5_PARTS.g7slab = function(P){
      var n0 = blocks.length, hx = P.hx || 3.5, hz = P.hz || 4.5, ns = P.secs || 3, gap = 0.1, PH = P.legH || 5.0, FH = 3.0, NF = P.floors || 6, rr = H.rng(4401);
      var W = ns*2*hx + (ns - 1)*gap, x0 = -W/2 + hx, i, s, k;
      // the park: an anchored lawn (never counted) with paths, benches and trees
      var base = addBlock(0, -0.25, 0, W + 4, 0.5, 2*hz + 8, "base", {anchor:true});
      kd(base, "box", K.lawn, 0, 0.03, 0, W + 3.6, 0.06, 2*hz + 7.6); kd(base, "box", K.path, 0, 0.07, 0, W - 1, 0.04, 2*hz - 1.2);
      kd(base, "box", K.path, 0, 0.07, hz + 2.2, 2.4, 0.04, 4.4);
      [-1, 1].forEach(function(sx){ tree(base, sx*(W/2 - 2.0), -hz - 2.6, 0.9); tree(base, sx*(W/2 - 7.5), -hz - 2.8, 0.8); tree(base, sx*1.6, -hz - 2.4, 0.7);
        kd(base, "ibox", K.woodD, sx*(W/2 - 4.5), 0.45, hz + 2.6, 1.8, 0.12, 0.5); kd(base, "ibox", K.ink, sx*(W/2 - 4.5), 0.2, hz + 2.6, 1.6, 0.4, 0.1); });
      var secs = [];
      for(k = 0; k < ns; k++){
        var cx = x0 + k*(2*hx + gap), nS = blocks.length, y = 0, first = k === 0, last = k === ns - 1, decks = [], tops;
        // the legs: 4 sculpted pilotis (ordinary RC, 1 TNT), open below, a deep cassette above ("the artificial ground")
        var g = H.boxSt({ y0:0, h:PH, hx:hx, hz:hz, cx:cx, nx:2, nz:2, pw:P.legW || 1.05, mw:1.0, fl:0, MT:api.mat("concrete"), deck:"mdC", skin:"open", split:[2, 1], dk:0.7, tp:K.conc, td:K.concD });
        g.piers.forEach(function(p){ p.key = "rc"; p.def = MEMBERS.rc; p.hp = p.hp0 = MEMBERS.rc.hp; p.tint = K.conc;
          for(var f2 = 0; f2 < 4; f2++) kd(p, "box", f2 % 2 ? K.conc : K.concL, p.spawn.x, PH - 1.0 - f2*0.55, p.spawn.z, 2*p.half[0] + 0.8 - f2*0.22, 0.55, 2*p.half[2] + 0.8 - f2*0.22);   // the flared head (a sculpted V)
          kd(p, "box", K.concD, p.spawn.x, 0.2, p.spawn.z, 2*p.half[0] + 0.12, 0.4, 2*p.half[2] + 0.12);
          for(var q = 0; q < 3; q++) kd(p, "ibox", K.concD, p.spawn.x + (p.a1z > 0 ? 0 : 0), 1.0 + q*1.0, p.spawn.z + Math.sign(p.a1z)*(p.half[2] + 0.02), 2*p.half[0] - 0.2, 0.05, 0.04); });   // board marks
        if(P.softDeck !== 0) g.decks.forEach(function(d){ d.key = "mdC"; d.def = MEMBERS.mdC; d.hp = d.hp0 = MEMBERS.mdC.hp; });
        g.decks.forEach(function(d){ kd(d, "box", K.concL, d.spawn.x, PH - 0.35, d.spawn.z, 2*d.half[0] + 0.05, 0.75, 2*d.half[2] + 0.2); });
        // under the belly: lamps on the soffit, and a glazed porch on the middle section (decor on its deck)
        g.decks.forEach(function(d){ kd(d, "lit", K.warm, d.spawn.x, PH - 0.75, d.spawn.z, 1.2, 0.06, 1.2); });
        if(!first && !last){ var dm = g.decks[0]; kd(dm, "box", K.glass, cx, PH - 2.2, 0, 3.2, 2.6, 2.4); kd(dm, "box", K.white, cx, PH - 0.85, 0, 3.6, 0.2, 2.8); kd(dm, "lit", K.lit, cx, PH - 2.3, 1.22, 1.4, 1.8, 0.04); }
        decks.push(g.decks); y = PH;
        // the body: NF storeys, glass on the long faces (loggias), a blank end wall on the two outer ends
        for(s = 0; s < NF; s++){
          var skin = { "z+":"glass", "z-":"glass", def:"open" }; if(first) skin["x-"] = "wall"; if(last) skin["x+"] = "wall";
          var st = H.boxSt({ y0:y, h:FH, hx:hx, hz:hz, cx:cx, nx:3, nz:2, pw:0.75, mw:0.65, fl:s + 1, MT:api.mat("concrete"), deck:"mdC", skin:skin, wall:"cpan", split:[2, 1], dk:0.4, tp:K.conc, td:K.concD, tw:K.concL });
          // ordinary concrete floors (mdC, 1 TNT), not the blast-proof hero floors: a floor lying in the heap must be clearable
          if(P.softDeck !== 0) st.decks.forEach(function(d){ d.key = "mdC"; d.def = MEMBERS.mdC; d.hp = d.hp0 = MEMBERS.mdC.hp; });
          st.panes.forEach(function(g2, j){ H.paneDress(g2, y, FH, s + j);
            // the loggia: two painted side walls and a white parapet in front of the glass (decor on the floor below)
            var hd = H.near(decks[decks.length - 1], g2.spawn.x, g2.spawn.z), zf = g2.spawn.z + Math.sign(g2.spawn.z)*0.55, lw = 2*g2.half[0], c = K.cols[(s*3 + j + k*2) % K.cols.length];
            [-1, 1].forEach(function(e){ kd(hd, "box", c, g2.spawn.x + e*(lw/2 - 0.08), y + FH*0.48, zf, 0.14, FH - 0.5, 0.9); });
            kd(hd, "box", K.white, g2.spawn.x, y + 0.5, zf + Math.sign(g2.spawn.z)*0.42, lw, 1.0, 0.12);
            kd(hd, "box", c, g2.spawn.x, y + 1.6, g2.spawn.z - Math.sign(g2.spawn.z)*0.3, lw*0.42, 1.9, 0.06); });
          st.walls.forEach(function(w){ onF(w, "box", K.concD, 0, FH*0.42 - 1.4, 2*Math.max(w.half[0], w.half[2]), 0.12, 0.08);
            for(var q = -2; q <= 2; q++) onF(w, "ibox", K.concD, q*1.5, 0, 0.05, FH - 0.6, 0.06); });   // board-marked end wall
          // the brise-soleil grid: a floor band on both long faces, a fin on every post
          st.decks.forEach(function(d){ [-1, 1].forEach(function(sz){ kd(d, "box", K.white, d.spawn.x, y + FH - 0.2, sz*(hz + 0.62), 2*d.half[0] + 0.06, 0.26, 0.5); }); });
          st.piers.forEach(function(p){ if(Math.abs(p.a1z) < hz - 1) return; kd(p, "box", K.white, p.spawn.x, y + FH/2 - 0.2, p.spawn.z + Math.sign(p.a1z)*0.6, 0.22, FH - 0.4, 1.0); });
          // the flats inside: lit, a different layout every floor (seen through the loggias)
          var fh = H.near(decks[decks.length - 1], cx, 0); api.floorIn(fh, y + 0.02, { hw:3.0, x:cx, z:0, rr:rr, fi:s + k, plateHw:0 });
          decks.push(st.decks); y += FH;
        }
        // the roof terrace: parapet, a running track, and one heavy roof piece per section (hard7v: lands whole, still counts)
        tops = decks[decks.length - 1];
        tops.forEach(function(d){ kd(d, "box", K.white, d.spawn.x, y + 0.45, d.spawn.z + hz - 0.15, 2*d.half[0], 0.9, 0.2); kd(d, "box", K.white, d.spawn.x, y + 0.45, d.spawn.z - hz + 0.15, 2*d.half[0], 0.9, 0.2);
          kd(d, "box", 0xA0473C, d.spawn.x, y + 0.03, d.spawn.z + hz - 1.0, 2*d.half[0], 0.06, 0.9); kd(d, "box", 0xA0473C, d.spawn.x, y + 0.03, d.spawn.z - hz + 1.0, 2*d.half[0], 0.06, 0.9); });
        if(first || last) tops.forEach(function(d){ var ex = first ? -1 : 1; if(Math.sign(d.spawn.x - cx) !== ex) return; kd(d, "box", K.white, cx + ex*(hx - 0.15), y + 0.45, 0, 0.2, 0.9, 2*hz); });
        var nV = blocks.length, RW = P.roofW || 1;
        if(!first && !last){
          // the funnel stack: a heavy tapering ventilation tower (hard7v) with a flared top, painted bands
          var fv = mem("hard7v", cx, y + 2.0*RW, -0.6, 2.6*RW, 4.0*RW, 2.6*RW, NF + 1, null, null, 0x8C8A84); fv.tint = 0x8C8A84;
          kd(fv, "cone", K.concL, cx, y + 4.0*RW + 0.9, -0.6, 3.8*RW, 1.8, 3.8*RW, Math.PI, 0, 0); kd(fv, "box", K.cols[0], cx, y + 1.2, -0.6, 2.7*RW, 0.4, 2.7*RW); kd(fv, "box", K.cols[1], cx, y + 2.0, -0.6, 2.7*RW, 0.3, 2.7*RW);
          kd(fv, "box", K.ink, cx, y + 4.0*RW + 1.7, -0.6, 2.0*RW, 0.12, 2.0*RW);
        } else {
          // the roof gym: a heavy vaulted pavilion (hard7v) on the end section, a shallow pool beside it (decor)
          var ex2 = first ? -1 : 1, gx = cx + ex2*0.6;
          var gy = mem("hard7v", gx, y + 1.3*RW, -0.8, 4.2*RW, 2.6*RW, 3.4*RW, NF + 1, null, null, 0x8C8A84); gy.tint = 0x8C8A84;
          kd(gy, "cyl", K.concL, gx, y + 2.5*RW, -0.8, 2.4*RW, 4.3*RW, 3.4*RW, 0, 0, Math.PI/2);
          kd(gy, "box", K.glass, gx, y + 1.2, -0.8 + 1.72*RW, 3.2*RW, 1.6, 0.08); kd(gy, "lit", K.lit, gx, y + 1.2, -0.8 + 1.68*RW, 2.8*RW, 1.2, 0.04);
          var pd = H.near(tops, cx - ex2*1.6, 2.4); kd(pd, "box", 0x6FC3DF, cx - ex2*1.6, y + 0.08, 2.4, 3.0, 0.12, 1.8); kd(pd, "box", K.white, cx - ex2*1.6, y + 0.05, 2.4, 3.4, 0.08, 2.2);
        }
        secs.push({ cx:cx, top:y }); bgSet(nS, (P.bg0 || 81) + k);
      }
      LV7.g7info = Object.assign(LV7.g7info || {}, { slab:{ top:secs[0].top + 5, members:blocks.length - n0, secs:secs } });
      return { w:W + 4, d:2*hz + 8 };
    };
    // ---- the timber clubhouse on stilts (easy, an echo of the lesson): 4 timber legs, two timber storeys, a gabled roof,
    // a balcony rail round the first floor and a stair up to it (decor). One or two bombs on the legs bring it down.
    V5_PARTS.g7stilt = function(P){
      var n0 = blocks.length, hx = P.hx || 2.6, hz = P.hz || 3.0, LH = P.legH || 4.0, y = 0, s, sts = [], MT = api.mat("wood"), side = P.side || 1;
      var base = addBlock(0, -0.25, 0, 2*hx + 3, 0.5, 2*hz + 3, "base", {anchor:true}); kd(base, "box", K.lawn, 0, 0.03, 0, 2*hx + 2.6, 0.06, 2*hz + 2.6);
      var g = H.boxSt({ y0:0, h:LH, hx:hx, hz:hz, nx:2, nz:2, pw:0.55, mw:0.5, fl:0, MT:MT, deck:"mdW", skin:"open", dk:0.35, tp:K.woodD, td:K.woodD });
      g.piers.forEach(function(p){ kd(p, "box", K.concD, p.spawn.x, 0.25, p.spawn.z, 0.8, 0.5, 0.8); });
      // cross braces between the legs (decor on the legs: they go when a leg goes)
      [[-1, 1], [1, 1], [-1, -1], [1, -1]].forEach(function(q, k){ var p = H.near(g.piers, q[0]*hx, q[1]*hz); if(k % 2) return;
        bar(p, K.woodD, q[0]*(hx - 0.3), 0.6, q[1]*(hz - 0.3), q[0]*(hx - 0.3), LH - 0.9, -q[1]*(hz - 0.3), 0.14); });
      var d0 = g.decks[0]; y = LH;
      for(var r = -1; r <= 1; r += 2) kd(d0, "box", K.woodD, 0, y + 0.55, r*(hz + 0.55), 2*hx + 1.2, 0.1, 0.1);   // the balcony rail
      kd(d0, "box", K.wood, 0, y - 0.2, 0, 2*hx + 1.2, 0.12, 2*hz + 1.2);
      for(var b2 = 0; b2 < 6; b2++) kd(d0, "ibox", K.woodD, -side*(hx + 0.75) + 0, 0.35 + b2*(LH - 0.4)/6, hz - 0.6 - b2*0.55, 1.0, 0.12, 0.5);   // the stair
      for(s = 0; s < 2; s++){ var h = 3.2;
        var st = H.boxSt({ y0:y, h:h, hx:hx, hz:hz, nx:3, nz:2, pw:0.45, mw:0.4, fl:s + 1, MT:MT, deck:"mdW", skin:{ "z+":"glass", def:"wall" }, mat:"wood", wall:"wwall", dk:0.3, tp:K.woodD, td:K.woodD, tw:0xEFD9B0 });
        sts.push(st);
        st.panes.forEach(function(g2, j){ H.paneDress(g2, y, h, j); });
        st.walls.forEach(function(w, j){ onF(w, "box", K.woodD, 0, -h*0.42, 2*Math.max(w.half[0], w.half[2]), 0.18, 0.06);
          for(var q = -2; q <= 2; q++) onF(w, "ibox", 0xD8B888, q*0.55, 0, 0.05, h - 0.5, 0.05);
          if((j + s) % 2 === 0) onF(w, "box", K.glass, 0, 0.25, 0.9, 0.9, 0.08); });
        var hd = H.near(sts.length > 1 ? sts[s - 1].decks : g.decks, 0, 0);
        kd(hd, "ibox", K.wood, 0, y + 0.4, -hz*0.4, 2.2, 0.8, 0.8); kd(hd, "lit", K.lit, 0, y + h - 0.6, 0, 0.5, 0.4, 0.5);
        y += h; }
      // the gabled roof (decor on the top cassettes), a gable board and a little lantern
      var top = sts[1].decks, sl = 0.6;
      [-1, 1].forEach(function(sz){ top.forEach(function(d){ kq(d, "box", sz > 0 ? K.roof : K.roofD, d.spawn.x, y + 1.1, sz*(hz/2 + 0.2), 2*d.half[0] + 1.0, 0.22, hz + 1.3, 0, -sz*sl, 0); }); });
      top.forEach(function(d){ kd(d, "box", K.roofD, d.spawn.x, y + 2.1, 0, 2*d.half[0] + 1.0, 0.25, 0.3); }); [-1, 1].forEach(function(sx){ kd(H.near(top, sx*hx, 0), "prism", 0xEFD9B0, sx*(hx - 0.1), y + 0.95, 0, 0.2, 1.9, 2*hz - 0.1); });
      kd(top[0], "box", K.woodD, 0, y + 2.7, 0, 0.6, 1.0, 0.6); kd(top[0], "lit", K.lit, 0, y + 2.7, 0, 0.4, 0.6, 0.4); kd(top[0], "cone", K.roofD, 0, y + 3.5, 0, 1.0, 0.7, 1.0);
      if(P.bg) bgSet(n0, P.bg); return { w:2*hx + 3, d:2*hz + 3 };
    };
  })();

  // ==================================================================================================================
  // g7 EASY PACK E02-E06 (Agents-Game, 20/11: Chapter 1 easy levels). One shared kit, own builders per level:
  //   E03 "Tram Depot" (FEEL, red drums blast for free): g7depot (four brick tram sheds, arched doors, a heavy roof piece each)
  //       and g7cabin (a brick-and-timber signal cabin). The drum row along the depot front is level data (L.tanks).
  //   E02 "Shot Tower" (TEACH, two legs side by side tip it that way): g7shot (a tall brick shot tower on 8 legs) and
  //       g7gshed (a long timber goods shed, one each side: whichever side the tower is tipped to, it lies down on a shed).
  //   E06 "Boiler Stack" (COMBINE, legs + direction): g7stack (a square brick chimney on a legged base, one at each end)
  //       and g7boil (the boiler house between them: a chimney tipped inward lies along its roof).
  //   E04 "Market Hall" (TEACH, wood falls easy, brick shields): g7mhall (three timber market halls on posts), g7arcade
  //       (a two-storey brick arcade in front: the shield) and g7kiosk (a small brick weigh house at each end).
  // Inspired by building types only (no real building, no real proportions). Every box that carries load is a member;
  // every detail (arches, slopes, rails, lamps, trams, louvres) is decor riding on a member, inside its outline.
  // Floors are the plain ladder floors (mdB / mdC), not the blast-proof hero floors: a floor lying in the heap must be
  // clearable (E01 lesson); levels that need "floors ignore TNT while they stand" list them in L.drop7 (plumbing only).
  // ==================================================================================================================
  (function(){
    if(typeof A1 === "undefined" || !A1.h || typeof M14 === "undefined") return;
    var H = A1.h, kd = l6KdAdd, api = M14.api, kq = H.kq, bar = H.bar, mem = H.mem;
    var K = { brick:0xB5543A, brickD:0x8C3E2B, brickL:0xC9714E, stone:0xD9CFBD, stoneD:0xA89E8C, slate:0x4F5A68, slateD:0x3B4450, iron:0x3B4048,
      green:0x3F6F55, greenD:0x2E5541, cream:0xF1E6CC, white:0xF6F2EA, glass:0x9FC3D6, lit:0xFFD98A, warm:0xFFF1C4, wood:0xC58B55, woodD:0x8A5A33,
      woodL:0xE2B77E, red:0xC8362B, soot:0x2E2A2A, cobble:0x9C978E, cobbleD:0x7F7A72, lawn:0x7FB069, leaf:0x4F8F46, trunk:0x7A5236, copper:0x5FA08A,
      tile:0xB0503A, tileD:0x8E3E2D, awnA:0xD8442E, awnB:0xF4EDE0, gold:0xE8B23A, ink:0x2B2F36 };
    var bgSet = function(n0, g){ for(var q = n0; q < blocks.length; q++) if(!blocks[q].anchor) blocks[q].bg = g; };
    var FN = { "z+":[0, 1], "z-":[0, -1], "x+":[1, 0], "x-":[-1, 0] };
    function onF(b, g, c, u, v, w, h, t){ var n = FN[b.a1face]; if(!n) return; var X = !!n[0]; t = t || 0.06; var d = (X ? b.half[0] : b.half[2]) + t/2;
      kd(b, g, c, b.spawn.x + (X ? n[0]*d : u), b.spawn.y + v, b.spawn.z + (X ? u : n[1]*d), X ? t : w, h, X ? w : t); }
    // a disc on the face of b (arch heads, round windows): D across, t proud of the face
    function onD(b, c, u, v, D, t){ var n = FN[b.a1face]; if(!n) return; var X = !!n[0], d = (X ? b.half[0] : b.half[2]) + t/2;
      kd(b, "cyl", c, b.spawn.x + (X ? n[0]*d : u), b.spawn.y + v, b.spawn.z + (X ? u : n[1]*d), D, t, D, X ? 0 : Math.PI/2, 0, X ? Math.PI/2 : 0); }
    // a corbelled arch head under a lintel (no cut-outs: two steps of brick in each top corner of the opening + a keystone).
    // X: the opening faces x (along z) or z (along x); f = the face coordinate; u = centre along the face; yt = soffit; w = width
    function corb(h, X, f, u, yt, w, col, t){ t = t || 0.3; var sgn = Math.sign(f) || 1, fc = f - sgn*t/2;
      [-1, 1].forEach(function(e){ [[0.5, 0.18, 0], [0.32, 0.08, 0.5]].forEach(function(q){ var a = u + e*(w/2 - w*q[1]/2), yy = yt - q[2] - q[0]/2;
        kd(h, "box", col, X ? fc : a, yy, X ? a : fc, X ? t : w*q[1], q[0], X ? w*q[1] : t); }); });
      kd(h, "box", K.cream, X ? f + sgn*0.03 : u, yt - 0.2, X ? u : f + sgn*0.03, X ? 0.08 : 0.36, 0.42, X ? 0.36 : 0.08); }
    // an arched window on a wall panel: glass with a round head and a cream sill (lit on some)
    function archWin(w, u, v, ww, hh, lit){ onF(w, "box", K.cream, u, v - hh/2 - 0.08, ww + 0.3, 0.14, 0.1); onF(w, "box", K.glass, u, v, ww, hh, 0.07); onD(w, K.glass, u, v + hh/2, ww, 0.07);
      onD(w, K.cream, u, v + hh/2 + 0.02, ww + 0.28, 0.05); if(lit) onF(w, "lit", K.lit, u, v - 0.1, ww*0.7, hh*0.7, 0.08); onF(w, "box", K.white, u, v, 0.06, hh, 0.09); }
    function plainDeck(list, key){ list.forEach(function(d){ d.key = key; d.def = MEMBERS[key]; d.hp = d.hp0 = MEMBERS[key].hp; }); }
    function setKey(p, key, tint){ p.key = key; p.def = MEMBERS[key]; p.hp = p.hp0 = MEMBERS[key].hp; if(tint != null) p.tint = tint; }
    var tipOf = function(g, hold){ return api.tip({ piers:g.piers, skin:g.walls.concat(g.panes), decks:g.decks, hinge:hold, xz:function(p){ return p.a1x == null ? null : [p.a1x, p.a1z]; } }); };
    function tree(host, x, z, s){ kd(host, "icyl", K.trunk, x, 1.1*s, z, 0.35*s, 2.2*s, 0.35*s); kd(host, "ibush", K.leaf, x, 2.9*s, z, 2.4*s, 2.2*s, 2.4*s); kd(host, "ibush", 0x5E8F4E, x + 0.4*s, 3.5*s, z - 0.3*s, 1.5*s, 1.4*s, 1.5*s); }
    // a light timber roof body (an attic block under the slopes): breaks on landing, one TNT, light enough not to crush its posts
    MEMBERS.g7roofL = Object.assign({}, MEMBERS.wwall, { density:+(window.__g7roofD || 260), color:K.slate }); MATS.g7roofL = MATS.wwall || MATS.concrete;
    // the market's timber posts (E04): old dry timber, a little weaker than wpost, so one TNT reliably takes the posts beside it
    MEMBERS.g7post = Object.assign({}, MEMBERS.wpost, { hp:20 }); MATS.g7post = MATS.wpost;
    // the depot roof (E03): the same light timber body, but it breaks up when it lands (a whole roof slab lying in the yard hid
    // the heavy roof pieces from the player's finger: tester run D, 20/11)
    MEMBERS.g7roofD = Object.assign({}, MEMBERS.g7roofL, { shatter:+(window.__g7roofS || 3.5) }); MATS.g7roofD = MATS.g7roofL;
    // a tiled market roof (timber frame + clay tiles): heavier, so the timber hall carries its share of the score
    MEMBERS.g7tile = Object.assign({}, MEMBERS.wwall, { density:+(window.__g7tileD || 900), color:K.tile }); MATS.g7tile = MATS.wwall || MATS.concrete;
    // chimney brick (E06): the same brick, its own keys, so a hit7 list on the boiler house's brick never covers the chimney
    MEMBERS.g7bk = Object.assign({}, MEMBERS.rc, { color:K.brickD }); MATS.g7bk = MATS.bk;   // the chimney's posts: RC clad in brick (a bomb on the shaft takes a wall, never the storey)
    MEMBERS.g7bkw = Object.assign({}, MEMBERS.bkw); MATS.g7bkw = MATS.bkw;
    function stackKeys(st){ st.piers.forEach(function(p){ setKey(p, "g7bk"); }); st.walls.forEach(function(w){ setKey(w, "g7bkw"); }); plainDeck(st.decks, "mdC"); }
    // a heavy tiled roof (E04): the timber frame folds easily, the roof lands whole and still counts until a bomb cracks it
    MEMBERS.hard7t = Object.assign({}, MEMBERS.hard7v, { density:+(window.__g7tileT || 1200), color:K.tile }); MATS.hard7t = MATS.hard7v || MATS.concrete;
    var isH7 = LV7.isHard7; LV7.isHard7 = function(b){ return isH7(b) || b.key === "hard7t"; };
    // pitched roof decor over an attic block `at` (top at y), ridge along x (ax = 1) or z (ax = 0), rise r, flush with the block
    function slopes(at, cx, cz, y, hx, hz, r, col, colD, ax){
      if(ax){ var sl = Math.atan2(r, hz); [-1, 1].forEach(function(s){ kq(at, "box", s > 0 ? col : colD, cx, y + r/2, cz + s*hz/2, 2*hx, 0.2, Math.hypot(hz, r), 0, s*sl, 0); }); kd(at, "box", colD, cx, y + r, cz, 2*hx, 0.22, 0.3); }
      else { var sl2 = Math.atan2(r, hx); [-1, 1].forEach(function(s){ kq(at, "box", s > 0 ? col : colD, cx + s*hx/2, y + r/2, cz, Math.hypot(hx, r), 0.2, 2*hz, 0, 0, -s*sl2); }); kd(at, "box", colD, cx, y + r, cz, 0.3, 0.22, 2*hz); }
    }

    // ---- E03 g7depot: P.n brick tram sheds side by side (own bond group each: they lean on each other, never glued). A shed:
    // 8 brick piers (tip rule: two side by side gone = it falls that way), an open front of two arched tram doors, brick side
    // and back walls with arched windows, a light timber roof body with slate slopes and a glazed clerestory, and ONE heavy
    // roof piece (hard7v: a riveted water tank on the outer sheds, a cast-iron vent lantern on the inner ones) that lands whole.
    V5_PARTS.g7depot = function(P){
      var n0 = blocks.length, ns = P.n || 4, hx = P.hx || 4.2, hz = P.hz || 7, PH = P.ph || 7.0, RH = P.rh || 2.2, gap = 0.1, W = ns*2*hx + (ns - 1)*gap, x0 = -W/2 + hx, k;
      var base = addBlock(0, -0.25, 1.5, W + 6, 0.5, 2*hz + 11, "base", {anchor:true});
      kd(base, "box", K.cobble, 0, 0.03, 1.5, W + 5.6, 0.06, 2*hz + 10.6); kd(base, "box", K.cobbleD, 0, 0.07, hz + 3.2, W + 2, 0.04, 2.6);
      var info = [];
      for(k = 0; k < ns; k++){
        var cx = x0 + k*(2*hx + gap), nS = blocks.length, first = k === 0, last = k === ns - 1, outer = first || last;
        var skin = { "z+":"open", "z-":"wall", "x-":first ? "wall" : "open", "x+":last ? "wall" : "open" };
        var g = H.boxSt({ y0:0, h:PH, hx:hx, hz:hz, cx:cx, nx:3, nz:3, pw:1.0, mw:0.9, fl:0, MT:api.mat("brick"), deck:"mdB", skin:skin, wall:"bkw", split:[2, 2], dk:0.5, tp:K.brick, td:K.brickD, tw:K.brickL });
        plainDeck(g.decks, "mdB"); tipOf(g, P.hold != null ? P.hold : 1.2);
        g.piers.forEach(function(p){ kd(p, "box", K.stoneD, p.spawn.x, 0.35, p.spawn.z, 2*p.half[0] + 0.16, 0.7, 2*p.half[2] + 0.16); kd(p, "box", K.stone, p.spawn.x, PH - 0.95, p.spawn.z, 2*p.half[0] + 0.12, 0.3, 2*p.half[2] + 0.12);
          if(p.a1z > hz - 1) for(var q = 0; q < 5; q++) kd(p, "ibox", K.brickD, p.spawn.x, 1.2 + q*1.0, p.spawn.z + p.half[2] + 0.01, 2*p.half[0] - 0.1, 0.06, 0.03); });
        // the front: a brick spandrel over the two tram doors, dark arch heads, a cream keystone and fanlight bars, a green name board
        var fd = H.near(g.decks, cx, hz), bw = hx - 0.95;
        kd(fd, "box", K.brick, cx, PH - 0.75, hz - 0.2, 2*hx - 0.1, 1.5, 0.4); kd(fd, "box", K.stone, cx, PH - 0.06, hz - 0.15, 2*hx, 0.14, 0.5);
        [-1, 1].forEach(function(s){ var bx = cx + s*hx/2;
          // a stepped (corbelled) arch head under the spandrel, a fanlight behind it, a cream keystone
          [[0.6, 0.2], [0.45, 0.1]].forEach(function(q, r){ [-1, 1].forEach(function(e){ kd(fd, "box", K.brick, bx + e*(bw/2 - bw*q[1]/2), PH - 1.5 - (r ? 0.6 + q[0]/2 : q[0]/2), hz - 0.2, bw*q[1], q[0], 0.4);
            kd(fd, "box", K.cream, bx + e*(bw/2 - bw*q[1]), PH - 1.5 - (r ? 0.6 + q[0]/2 : q[0]/2), hz + 0.02, 0.12, q[0], 0.06); }); });
          kd(fd, "box", K.cream, bx, PH - 1.52, hz + 0.02, bw*0.6, 0.12, 0.06); kd(fd, "box", K.cream, bx, PH - 1.25, hz + 0.05, 0.45, 0.6, 0.1);
          kd(fd, "box", K.glass, bx, PH - 2.0, hz - 0.45, bw, 1.05, 0.06); for(var r = -2; r <= 2; r++) kd(fd, "ibox", K.white, bx + r*bw/5, PH - 2.0, hz - 0.4, 0.05, 1.0, 0.05);
          kd(base, "box", K.iron, bx - 0.72, 0.1, 1.5, 0.12, 0.05, 2*hz + 9); kd(base, "box", K.iron, bx + 0.72, 0.1, 1.5, 0.12, 0.05, 2*hz + 9);   // the rails
          // a tram parked inside (decor on the yard: it stays when the shed comes down)
          if(P.trams !== 0){ var tc = (k + (s > 0 ? 1 : 0)) % 2 ? K.green : K.red, tz = -1.2;
            kd(base, "ibox", tc, bx, 1.55, tz, 2.2, 2.0, 8.0); kd(base, "ibox", K.cream, bx, 2.85, tz, 2.2, 0.6, 8.0); kd(base, "ibox", K.cream, bx, 3.35, tz, 1.9, 0.4, 7.6);
            kd(base, "lit", K.lit, bx, 2.85, tz + 4.02, 1.5, 0.45, 0.05); kd(base, "ibox", K.ink, bx, 0.45, tz, 1.8, 0.3, 7.0); kd(base, "ibox", K.iron, bx, 4.2, tz, 0.08, 1.3, 0.08); } });
        g.walls.forEach(function(w, j){ var L2 = 2*Math.max(w.half[0], w.half[2]); onF(w, "box", K.stoneD, 0, -PH*0.42, L2, 0.5, 0.08); onF(w, "box", K.brickD, 0, PH*0.18, L2, 0.18, 0.08);
          archWin(w, 0, 0.2, Math.min(1.8, L2*0.45), 2.4, (j + k) % 2 === 0); });
        g.decks.forEach(function(d){ kd(d, "lit", K.warm, d.spawn.x, PH - 0.62, d.spawn.z, 1.0, 0.08, 1.0); });
        // the roof body and its decor: slate slopes along z (ridge front to back), a glazed clerestory, a brick front gable
        var at = mem("g7roofD", cx, PH + RH/2, 0, 2*hx - 0.1, RH, 2*hz - 0.1, 1, null, null, K.slate), yt = PH + RH;
        kd(at, "box", K.brick, cx, PH + RH/2, hz - 0.09, 2*hx - 0.1, RH, 0.12); kd(at, "box", K.stone, cx, PH + RH - 0.05, hz - 0.08, 2*hx, 0.12, 0.16);
        slopes(at, cx, 0, yt, hx - 0.05, hz - 0.05, 1.7, K.slate, K.slateD, 0);
        kd(at, "prism", K.brick, cx, yt + 0.85, hz - 0.16, 0.12, 1.7, 2*hx - 0.1, 0, Math.PI/2, 0);
        kd(at, "cyl", K.cream, cx, yt + 0.6, hz - 0.08, 1.3, 0.08, 1.3, Math.PI/2, 0, 0); kd(at, "cyl", K.glass, cx, yt + 0.6, hz - 0.03, 1.0, 0.06, 1.0, Math.PI/2, 0, 0);
        kd(at, "box", K.greenD, cx, PH + 0.5, hz + 0.0, 2*hx - 1.6, 0.7, 0.08); kd(at, "box", K.cream, cx, PH + 0.5, hz + 0.03, 2*hx - 2.2, 0.12, 0.06);
        kd(at, "box", K.glass, cx, yt + 1.95, -0.4, 1.4, 0.6, 2*hz - 3.4); kd(at, "box", K.slateD, cx, yt + 2.3, -0.4, 1.7, 0.12, 2*hz - 3.2);
        // the heavy roof piece (hard7v): lands whole, still counts until a bomb cracks it
        var HW = P.hw || 1;
        if(outer){ var wt = mem("hard7v", cx, yt + 1.25*HW, -hz*0.45, 2.6*HW, 2.5*HW, 2.6*HW, 2, null, null, 0x5B6470); wt.tint = 0x5B6470;
          kd(wt, "cyl", 0x66707C, cx, yt + 1.25*HW, -hz*0.45, 2.9*HW, 2.3*HW, 2.9*HW); for(var bb = 0; bb < 3; bb++) kd(wt, "cyl", K.iron, cx, yt + 0.4*HW + bb*0.8*HW, -hz*0.45, 2.98*HW, 0.08, 2.98*HW);
          kd(wt, "cone", K.iron, cx, yt + 2.75*HW, -hz*0.45, 2.9*HW, 0.6, 2.9*HW); kd(wt, "box", K.cream, cx, yt + 1.4*HW, -hz*0.45 + 1.47*HW, 1.4*HW, 0.5, 0.06); }
        else { var vl = mem("hard7v", cx, yt + 0.95*HW, -hz*0.45, 2.4*HW, 1.9*HW, 3.6*HW, 2, null, null, 0x4E5560); vl.tint = 0x4E5560;
          for(var lv = 0; lv < 4; lv++) [-1, 1].forEach(function(s){ kq(vl, "box", K.iron, cx + s*1.22*HW, yt + 0.4*HW + lv*0.38*HW, -hz*0.45, 0.06, 0.08, 3.4*HW, 0, 0, s*0.5); });
          kd(vl, "prism", K.iron, cx, yt + 2.15*HW, -hz*0.45, 2.8*HW, 0.6, 3.8*HW, 0, Math.PI/2, 0); kd(vl, "ibush", K.gold, cx, yt + 2.6*HW, -hz*0.45, 0.35, 0.35, 0.35); }
        info.push({ cx:cx, top:yt + 2.5 }); bgSet(nS, (P.bg0 || 61) + k);
      }
      // the yard in front: a lamp post at each end, a buffer stop on each track pair (decor on the yard)
      [-1, 1].forEach(function(s){ var lx = s*(W/2 + 1.2); kd(base, "icyl", K.iron, lx, 2.2, hz + 3.0, 0.16, 4.4, 0.16); kd(base, "lit", K.lit, lx, 4.5, hz + 3.0, 0.5, 0.5, 0.5); kd(base, "icyl", K.iron, lx, 4.85, hz + 3.0, 0.6, 0.1, 0.6); });
      LV7.g7info = Object.assign(LV7.g7info || {}, { depot:{ members:blocks.length - n0, sheds:info, W:W } });
      return { w:W + 6, d:2*hz + 11 };
    };
    // ---- E03 g7cabin: a signal cabin (easy end job): a brick locking-room storey on 4 piers, a glazed timber operating room,
    // a hipped slate roof body with a chimney, a signal mast on the yard beside it.
    V5_PARTS.g7cabin = function(P){
      var n0 = blocks.length, hx = P.hx || 2.6, hz = P.hz || 3.2, y = 0, side = P.side || 1;
      var base = addBlock(0, -0.25, 0, 2*hx + 4, 0.5, 2*hz + 4, "base", {anchor:true}); kd(base, "box", K.cobble, 0, 0.03, 0, 2*hx + 3.6, 0.06, 2*hz + 3.6);
      var g, nb = P.nb || 1;
      for(var sb = 0; sb < nb; sb++){ var hb = sb ? 3.4 : 4.2;
        g = H.boxSt({ y0:y, h:hb, hx:hx, hz:hz, nx:2, nz:2, pw:0.7, mw:0.6, fl:sb, MT:api.mat("brick"), deck:"mdW", skin:"wall", wall:"bkw", dk:0.35, tp:K.brick, td:K.woodD, tw:sb % 2 ? K.brick : K.brickL });
        g.walls.forEach(function(w, j){ onF(w, "box", K.stoneD, 0, -hb/2 + 0.3, 2*Math.max(w.half[0], w.half[2]), 0.4, 0.08); if(w.a1face === "z+" && sb === 0) { onF(w, "box", K.greenD, 0, -0.7, 1.0, 2.2, 0.08); onD(w, K.greenD, 0, 0.4, 1.0, 0.08); }
          else archWin(w, 0, 0.3, 0.9, 1.6, (j + sb) % 2 === 0); });
        y += hb; }
      var st = H.boxSt({ y0:y, h:3.4, hx:hx + 0.2, hz:hz + 0.2, nx:3, nz:3, pw:0.4, mw:0.34, fl:nb, MT:api.mat("wood"), deck:"mdW", skin:{ "z+":"glass", "x+":"glass", "x-":"glass", def:"wall" }, mat:"wood", wall:"wwall", dk:0.3, tp:K.green, td:K.woodD, tw:K.cream });
      st.panes.forEach(function(p, j){ H.paneDress(p, y, 3.4, j); onF(p, "box", K.green, 0, -1.2, 2*Math.max(p.half[0], p.half[2]), 0.8, 0.08); });
      st.walls.forEach(function(w){ for(var q = -2; q <= 2; q++) onF(w, "ibox", K.woodL, q*0.6, 0, 0.05, 2.8, 0.05); });
      kd(st.decks[0], "lit", K.lit, 0, y + 1.3, 0, 1.4, 0.5, 0.6); kd(st.decks[0], "ibox", K.red, -0.6, y + 0.7, -0.6, 2.6, 0.8, 0.4);   // the lever frame
      kd(g.decks[0], "box", K.woodD, 0, y + 0.1, hz + 0.75, 2*hx + 0.6, 0.12, 1.0); kd(g.decks[0], "box", K.white, 0, y + 0.7, hz + 1.2, 2*hx + 0.6, 0.08, 0.08);   // the walkway
      y += 3.4;
      var at = mem("g7roofL", 0, y + 0.6, 0, 2*hx + 0.3, 1.2, 2*hz + 0.3, 2, null, null, K.slate);
      slopes(at, 0, 0, y + 1.2, hx + 0.15, hz + 0.15, 1.3, K.slate, K.slateD, 1); kd(at, "box", K.white, 0, y + 0.1, hz + 0.25, 2*hx + 0.4, 0.2, 0.08);
      kd(at, "box", K.brick, hx*0.5, y + 2.1, -hz*0.3, 0.6, 1.6, 0.6); kd(at, "box", K.brickD, hx*0.5, y + 2.95, -hz*0.3, 0.75, 0.15, 0.75);
      // the signal mast and arms (decor on the yard), a ladder
      var mx = side*(hx + 1.3); kd(base, "icyl", K.white, mx, 4.5, hz + 0.6, 0.22, 9.0, 0.22); kd(base, "ibox", K.red, mx + side*0.6, 8.0, hz + 0.6, 1.3, 0.28, 0.08); kd(base, "ibox", K.white, mx + side*0.9, 8.0, hz + 0.64, 0.18, 0.28, 0.06);
      kd(base, "lit", 0xFF5A4A, mx, 7.4, hz + 0.75, 0.25, 0.25, 0.1); kd(base, "ibox", K.iron, mx, 9.1, hz + 0.6, 0.5, 0.12, 0.5);
      if(P.bg) bgSet(n0, P.bg); return { w:2*hx + 4, d:2*hz + 4 };
    };

    // ---- E02 g7shot: a tall brick shot tower. Ground storey = an open arcade of 8 legs (RC piers clad in brick: one TNT each,
    // a bomb never takes the neighbour; tip rule with a hinge: two legs side by side and it lies down that way). A tapering
    // square shaft of brick posts and walls with tall slit windows and string courses, a corbelled gallery, an octagonal
    // lantern with a copper cap and a weather vane (decor on the top floor).
    V5_PARTS.g7shot = function(P){
      var n0 = blocks.length, hx = P.hx || 3.4, LH = P.legH || 5.0, SH = 3.4, n = P.n || 7, y = 0, s, i, sts = [];
      var base = addBlock(0, -0.25, 0, 2*hx + 7, 0.5, 2*hx + 7, "base", {anchor:true}); kd(base, "box", K.stone, 0, 0.03, 0, 2*hx + 6.6, 0.06, 2*hx + 6.6); kd(base, "box", K.cobble, 0, 0.07, 0, 2*hx + 1.6, 0.04, 2*hx + 1.6);
      var g = H.boxSt({ y0:0, h:LH, hx:hx, hz:hx, nx:3, nz:3, pw:1.15, mw:1.05, fl:0, MT:{ pier:"rc", deck:"mdB" }, deck:"mdB", skin:"open", dk:0.55, tp:K.brick, td:K.brickD });
      plainDeck(g.decks, "mdB");
      g.piers.forEach(function(p){ setKey(p, "rc", K.brick); kd(p, "box", K.stoneD, p.spawn.x, 0.35, p.spawn.z, 2*p.half[0] + 0.2, 0.7, 2*p.half[2] + 0.2); kd(p, "box", K.stone, p.spawn.x, LH - 0.85, p.spawn.z, 2*p.half[0] + 0.16, 0.3, 2*p.half[2] + 0.16);
        for(var q = 0; q < 4; q++) [-1, 1].forEach(function(e){ kd(p, "ibox", K.brickD, p.spawn.x, 1.1 + q*0.9, p.spawn.z + e*(p.half[2] + 0.01), 2*p.half[0] - 0.1, 0.05, 0.03); }); });
      LV7.g7tip = tipOf(g, P.hold != null ? P.hold : 2.0);
      // arch heads between the legs (decor on the deck above each bay), a stone band, a lit shot-room through the arches
      g.decks.forEach(function(d){ kd(d, "box", K.stone, d.spawn.x, LH - 0.2, d.spawn.z, 2*d.half[0] + 0.2, 0.3, 2*d.half[2] + 0.2); });
      [[0, 1], [0, -1], [1, 0], [-1, 0]].forEach(function(q){ for(var e = -1; e <= 1; e += 2){ var u = e*hx/2, X = !!q[0];
        var d = H.near(g.decks, X ? q[0]*hx : u, X ? u : q[1]*hx);
        kd(d, "box", K.brick, X ? q[0]*(hx - 0.1) : u, LH - 0.75, X ? u : q[1]*(hx - 0.1), X ? 0.2 : hx - 1.1, 0.6, X ? hx - 1.1 : 0.2); corb(d, X, (X ? q[0] : q[1])*hx, u, LH - 1.05, hx - 1.1, K.brick, 0.2); } });
      kd(g.decks[0], "ibox", K.woodD, 0, 0.6, 0, 2.2, 1.2, 1.2); kd(g.decks[0], "lit", K.lit, 0, LH - 1.4, 0, 1.0, 0.2, 1.0); kd(g.decks[0], "ibox", K.iron, 0, 2.2, 0, 1.4, 0.1, 1.4);   // shot pans, the drop
      y = LH;
      for(s = 0; s < n; s++){ var hs = Math.max(2.4, hx - 0.12*s);
        var st = H.boxSt({ y0:y, h:SH, hx:hs, hz:hs, nx:3, nz:3, pw:0.85, mw:0.7, fl:s + 1, MT:api.mat("brick"), deck:"mdB", skin:"wall", wall:"bkw", dk:0.4, tp:K.brick, td:K.brickD, tw:s % 2 ? K.brick : K.brickL });
        plainDeck(st.decks, "mdB"); sts.push(st);
        if(P.rcPosts !== 0) st.piers.forEach(function(p){ setKey(p, "rc", K.brick); });   // a bomb on the shaft takes a wall panel, never the storey
        // the lead-shot hoppers: heavy cast-iron bins inside (hard7v: land whole in the heap, still count until cracked)
        if(P.hop && P.hop.indexOf(s) >= 0){ var hw2 = P.hopW || 2.6, hp = mem("hard7v", 0, y + 1.0*(P.hopH || 2.0)/2 + 0.02, 0, hw2, P.hopH || 2.0, hw2, s + 1, null, null, 0x4A4F58); hp.tint = 0x4A4F58;
          kd(hp, "cone", 0x5A606A, 0, y + (P.hopH || 2.0) + 0.3, 0, hw2*1.1, 0.6, hw2*1.1, Math.PI, 0, 0); kd(hp, "lit", K.lit, 0, y + (P.hopH || 2.0) + 0.9, 0, 0.6, 0.2, 0.6); }
        st.walls.forEach(function(w, j){ var L2 = 2*Math.max(w.half[0], w.half[2]);
          onF(w, "box", K.cream, 0, 0.35, 0.55, 1.7, 0.08); onF(w, "box", K.glass, 0, 0.35, 0.4, 1.5, 0.1); onD(w, K.cream, 0, 1.2, 0.55, 0.08);
          if((j + s) % 3 === 0) onF(w, "lit", K.lit, 0, 0.3, 0.3, 1.1, 0.11);
          for(var q = 0; q < 3; q++) onF(w, "ibox", K.brickD, 0, -1.2 + q*0.55, L2, 0.04, 0.07); });
        st.piers.forEach(function(p){ if(Math.abs(p.a1x) > hs - 1 && Math.abs(p.a1z) > hs - 1) kd(p, "box", K.brickD, p.spawn.x, y + SH/2 - 0.2, p.spawn.z, 2*p.half[0] + 0.12, SH - 0.4, 2*p.half[2] + 0.12); });   // corner quoins
        if(s % 2 === 1) kd(st.decks[0], "box", K.stone, 0, y + SH - 0.2, 0, 2*hs + 0.35, 0.28, 2*hs + 0.35);   // string course
        y += SH; }
      // the gallery: corbels, a white rail round the top floor, the octagonal lantern, a copper cap and a vane
      var top = sts[sts.length - 1].decks[0], ht = Math.max(2.4, hx - 0.12*(n - 1));
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function(q){ for(var e = -2; e <= 2; e++) kd(top, "box", K.stone, q[0] ? q[0]*(ht + 0.2) : e*ht*0.42, y - 0.3, q[1] ? q[1]*(ht + 0.2) : e*ht*0.42, 0.45, 0.45, 0.45); });   // corbels
      kd(top, "box", K.stone, 0, y + 0.05, 0, 2*ht + 1.2, 0.2, 2*ht + 1.2);
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function(q){ kd(top, "box", K.white, q[0]*(ht + 0.55), y + 0.65, q[1]*(ht + 0.55), q[0] ? 0.1 : 2*ht + 1.2, 0.1, q[0] ? 2*ht + 1.2 : 0.1);
        for(var e = -3; e <= 3; e++) kd(top, "box", K.white, q[0] ? q[0]*(ht + 0.55) : e*(ht + 0.5)/3, y + 0.35, q[1] ? q[1]*(ht + 0.55) : e*(ht + 0.5)/3, 0.07, 0.6, 0.07); });
      if(P.cis){ var cw2 = P.cis, ci = mem("hard7v", 0, y + 1.3, 0, cw2, 2.6, cw2, n + 1, null, null, 0x4A4F58); ci.tint = 0x4A4F58; }   // the shot cistern (hard7v) inside the lantern
      H.oct(top, K.cream, y + 0.15, 2.6, ht - 0.7); H.oct(top, K.glass, y + 0.55, 1.7, ht - 0.62); kd(top, "lit", K.lit, 0, y + 1.3, 0, 1.6, 1.2, 1.6);
      for(i = 0; i < 8; i++){ var a2 = i*Math.PI/4 + Math.PI/8; kd(top, "box", K.cream, Math.cos(a2)*(ht - 0.65), y + 1.4, Math.sin(a2)*(ht - 0.65), 0.22, 2.4, 0.22); }
      kd(top, "cone", K.copper, 0, y + 3.9, 0, 2*ht - 0.6, 2.6, 2*ht - 0.6); kd(top, "icyl", K.iron, 0, y + 5.7, 0, 0.08, 1.2, 0.08); kd(top, "ibox", K.gold, 0.25, y + 6.0, 0, 0.6, 0.18, 0.04); kd(top, "ibush", K.gold, 0, y + 6.4, 0, 0.26, 0.26, 0.26);
      if(P.bg) bgSet(n0, P.bg); LV7.g7info = Object.assign(LV7.g7info || {}, { shot:{ top:y + 6.4, members:blocks.length - n0 } });
      return { w:2*hx + 7, d:2*hx + 7 };
    };
    // ---- E02 g7gshed: a long timber goods shed (the target). Timber posts (one TNT takes every post within ~3 m), board walls,
    // loading doors on the long front, a timber upper floor with a glazed hoist bay, a slate roof body (ridge along x).
    V5_PARTS.g7gshed = function(P){
      var n0 = blocks.length, hx = P.hx || 9, hz = P.hz || 4, y = 0, side = P.side || 1, nx = P.nx || 6;
      var base = addBlock(0, -0.25, 0, 2*hx + 2, 0.5, 2*hz + 4, "base", {anchor:true}); kd(base, "box", K.cobble, 0, 0.03, 0.5, 2*hx + 1.6, 0.06, 2*hz + 3.6);
      kd(base, "box", K.stone, 0, 0.45, hz + 1.0, 2*hx, 0.9, 1.6);   // the loading platform
      var g = H.boxSt({ y0:0, h:4.6, hx:hx, hz:hz, nx:nx, nz:3, pw:0.5, mw:0.42, fl:0, MT:api.mat("wood"), deck:"mdW", skin:"wall", mat:"wood", wall:"wwall", split:[3, 1], dk:0.35, tp:K.woodD, td:K.woodD, tw:K.woodL });
      g.walls.forEach(function(w, j){ var L2 = 2*Math.max(w.half[0], w.half[2]); for(var q = -3; q <= 3; q++) onF(w, "ibox", K.wood, q*L2/7, 0, 0.05, 4.0, 0.05);
        onF(w, "box", K.woodD, 0, -1.9, L2, 0.25, 0.07); if(w.a1face === "z+" && j % 2 === 0){ onF(w, "box", K.green, 0, -0.4, L2*0.62, 3.0, 0.08); onF(w, "box", K.cream, 0, -0.4, 0.06, 3.0, 0.1); bar(w, K.cream, w.spawn.x - L2*0.3, 0.9, hz + 0.1, w.spawn.x + L2*0.3, 3.0, hz + 0.1, 0.06); } });
      y = 4.6;
      var st = H.boxSt({ y0:y, h:3.3, hx:hx, hz:hz, nx:nx, nz:3, pw:0.44, mw:0.38, fl:1, MT:api.mat("wood"), deck:"mdW", skin:"wall", mat:"wood", wall:"wwall", split:[3, 1], dk:0.3, tp:K.woodD, td:K.woodD, tw:K.cream });
      st.walls.forEach(function(w, j){ var L2 = 2*Math.max(w.half[0], w.half[2]); onF(w, "box", K.white, 0, 0.2, Math.min(1.1, L2*0.5), 1.2, 0.07); onF(w, "box", K.glass, 0, 0.2, Math.min(0.9, L2*0.42), 1.0, 0.09);
        if(j % 3 === 1) onF(w, "lit", K.lit, 0, 0.2, 0.6, 0.7, 0.1); for(var q = -3; q <= 3; q++) onF(w, "ibox", K.woodL, q*L2/7, 0, 0.04, 3.0, 0.04); });
      y += 3.3;
      var at = mem("g7roofL", 0, y + 0.55, 0, 2*hx - 0.1, 1.1, 2*hz - 0.1, 2, null, null, K.slate);
      slopes(at, 0, 0, y + 1.1, hx + 0.1, hz + 0.1, 1.6, K.slate, K.slateD, 1);
      // the hoist bay on the front (glazed dormer + a beam) and a painted board, decor on the roof body
      kd(at, "box", K.woodL, side*hx*0.45, y + 1.3, hz - 0.6, 2.2, 2.0, 1.2); kd(at, "box", K.glass, side*hx*0.45, y + 1.3, hz + 0.02, 1.4, 1.4, 0.06); kd(at, "prism", K.slateD, side*hx*0.45, y + 2.55, hz - 0.6, 2.4, 0.7, 1.4);
      kd(at, "box", K.woodD, side*hx*0.45, y + 2.0, hz + 0.6, 0.18, 0.18, 1.4); kd(at, "box", K.greenD, 0, y + 0.45, hz - 0.03, hx, 0.6, 0.06); kd(at, "box", K.cream, 0, y + 0.45, hz, hx - 0.6, 0.1, 0.05);
      // crates and sacks on the platform (decor on the yard)
      for(var c = -2; c <= 2; c++) kd(base, "box", c % 2 ? K.woodL : K.wood, c*hx/3 + 0.6, 1.3, hz + 1.1, 0.9, 0.8, 0.9);
      if(P.bg) bgSet(n0, P.bg); return { w:2*hx + 2, d:2*hz + 4 };
    };

    // ---- E06 g7stack: a square brick factory chimney. A wide base on 8 legs (RC clad in brick, one TNT each, tip rule with a
    // hinge), a brick pedestal storey with a soot door, then a tapering square shaft of brick posts and walls with iron bands,
    // a corbelled crown and a sooty lip (decor on the top floor).
    V5_PARTS.g7stack = function(P){
      var n0 = blocks.length, bx = P.bx || 2.9, LH = P.legH || 4.6, n = P.n || 6, SH = P.sh || 3.1, y = 0, s, sts = [];
      var base = addBlock(0, -0.25, 0, 2*bx + 5, 0.5, 2*bx + 5, "base", {anchor:true}); kd(base, "box", K.cobble, 0, 0.03, 0, 2*bx + 4.6, 0.06, 2*bx + 4.6);
      var g = H.boxSt({ y0:0, h:LH, hx:bx, hz:bx, nx:3, nz:3, pw:1.05, mw:0.95, fl:0, MT:{ pier:"rc", deck:"mdB" }, deck:"mdB", skin:"open", dk:0.5, tp:K.brickD, td:K.brickD });
      plainDeck(g.decks, "mdC");
      g.piers.forEach(function(p){ setKey(p, "rc", K.brickD); kd(p, "box", K.stoneD, p.spawn.x, 0.3, p.spawn.z, 2*p.half[0] + 0.2, 0.6, 2*p.half[2] + 0.2); kd(p, "box", K.stone, p.spawn.x, LH - 0.8, p.spawn.z, 2*p.half[0] + 0.14, 0.26, 2*p.half[2] + 0.14); });
      LV7.g7tip = tipOf(g, P.hold != null ? P.hold : 2.0);
      g.decks.forEach(function(d){ kd(d, "box", K.stone, d.spawn.x, LH - 0.18, d.spawn.z, 2*d.half[0] + 0.2, 0.28, 2*d.half[2] + 0.2); });
      [[0, 1], [0, -1], [1, 0], [-1, 0]].forEach(function(q){ for(var e = -1; e <= 1; e += 2){ var u = e*bx/2, X = !!q[0], d = H.near(g.decks, X ? q[0]*bx : u, X ? u : q[1]*bx);
        kd(d, "box", K.brickD, X ? q[0]*(bx - 0.1) : u, LH - 0.72, X ? u : q[1]*(bx - 0.1), X ? 0.2 : bx - 1.0, 0.56, X ? bx - 1.0 : 0.2); corb(d, X, (X ? q[0] : q[1])*bx, u, LH - 1.0, bx - 1.0, K.brickD, 0.2); } });
      kd(g.decks[0], "ibox", K.iron, 0, 1.0, 0, 1.6, 2.0, 1.6); kd(g.decks[0], "lit", 0xFF8A3A, 0, 0.9, 0.82, 0.8, 0.6, 0.04);   // the flue and its fire door
      y = LH;
      var ped = H.boxSt({ y0:y, h:3.0, hx:bx - 0.3, hz:bx - 0.3, nx:3, nz:3, pw:0.9, mw:0.75, fl:1, MT:api.mat("brick"), deck:"mdB", skin:"wall", wall:"bkw", dk:0.4, tp:K.brickD, td:K.brickD, tw:K.brick });
      stackKeys(ped); ped.walls.forEach(function(w){ onF(w, "box", K.stone, 0, 1.2, 2*Math.max(w.half[0], w.half[2]), 0.2, 0.1); onF(w, "box", K.brickD, 0, -0.2, 0.7, 1.4, 0.08); });
      kd(ped.decks[0], "box", K.stone, 0, y + 2.85, 0, 2*bx + 0.1, 0.3, 2*bx + 0.1); y += 3.0;
      for(s = 0; s < n; s++){ var hs = Math.max(1.25, (P.sx || 2.0) - 0.1*s);
        var st = H.boxSt({ y0:y, h:SH, hx:hs, hz:hs, nx:2, nz:2, pw:0.7, mw:0.6, fl:s + 2, MT:api.mat("brick"), deck:"mdB", skin:"wall", wall:"bkw", dk:0.35, tp:K.brickD, td:K.brickD, tw:s % 2 ? K.brick : K.brickL });
        stackKeys(st); sts.push(st);
        st.walls.forEach(function(w){ var L2 = 2*Math.max(w.half[0], w.half[2]); for(var q = 0; q < 4; q++) onF(w, "ibox", K.brickD, 0, -1.2 + q*0.7, L2, 0.04, 0.07); });
        kd(st.decks[0], "box", K.iron, 0, y + SH - 0.35, 0, 2*hs + 0.12, 0.14, 2*hs + 0.12);   // iron band
        y += SH; }
      var top = sts[sts.length - 1].decks[0], ht = Math.max(1.25, (P.sx || 2.0) - 0.1*(n - 1));
      kd(top, "box", K.brickD, 0, y - 0.1, 0, 2*ht + 0.5, 0.35, 2*ht + 0.5); kd(top, "box", K.brick, 0, y + 0.35, 0, 2*ht + 0.75, 0.55, 2*ht + 0.75); kd(top, "box", K.soot, 0, y + 0.7, 0, 2*ht + 0.6, 0.2, 2*ht + 0.6);
      kd(top, "ibox", 0x161414, 0, y + 0.72, 0, 2*ht - 0.3, 0.22, 2*ht - 0.3); kd(top, "ibush", 0xBFB9B2, 0.4, y + 2.0, 0.2, 1.6, 1.2, 1.6); kd(top, "ibush", 0xD8D3CC, 0.9, y + 3.0, -0.1, 1.2, 0.9, 1.2);   // a puff of smoke
      if(P.bg) bgSet(n0, P.bg); LV7.g7info = Object.assign(LV7.g7info || {}, { stack:{ top:y + 0.8, members:blocks.length - n0 } });
      return { w:2*bx + 5, d:2*bx + 5 };
    };
    // ---- E06 g7boil: the boiler house. Three brick bays side by side (own bond group each), brick piers and walls with tall
    // arched windows, a slate roof body per bay with a glazed louvre lantern; inside, the boilers glow (decor on the floor).
    V5_PARTS.g7boil = function(P){
      var n0 = blocks.length, nb = P.n || 3, bw = P.bw || 3.6, hz = P.hz || 6, PH = P.ph || 7.0, gap = 0.1, W = nb*2*bw + (nb - 1)*gap, x0 = -W/2 + bw, k;
      var base = addBlock(0, -0.25, 0, W + 2, 0.5, 2*hz + 4, "base", {anchor:true}); kd(base, "box", K.cobble, 0, 0.03, 0, W + 1.6, 0.06, 2*hz + 3.6);
      for(k = 0; k < nb; k++){ var cx = x0 + k*(2*bw + gap), nS = blocks.length, first = k === 0, last = k === nb - 1;
        var g = H.boxSt({ y0:0, h:PH, hx:bw, hz:hz, cx:cx, nx:3, nz:3, pw:0.85, mw:0.75, fl:0, MT:api.mat("brick"), deck:"mdB", skin:{ "z+":"wall", "z-":"wall", "x-":first ? "wall" : "open", "x+":last ? "wall" : "open" }, wall:"bkw", split:[1, 2], dk:0.45, tp:K.brick, td:K.brickD, tw:K.brickL });
        plainDeck(g.decks, "mdB");
        g.piers.forEach(function(p){ kd(p, "box", K.stoneD, p.spawn.x, 0.3, p.spawn.z, 2*p.half[0] + 0.14, 0.6, 2*p.half[2] + 0.14); kd(p, "box", K.brickD, p.spawn.x, PH/2, p.spawn.z, 2*p.half[0] + 0.1, PH - 1.2, 2*p.half[2] + 0.1); });
        g.walls.forEach(function(w, j){ var L2 = 2*Math.max(w.half[0], w.half[2]); onF(w, "box", K.stoneD, 0, -PH*0.43, L2, 0.45, 0.08); onF(w, "box", K.stone, 0, PH*0.36, L2, 0.18, 0.08);
          archWin(w, 0, 0.0, Math.min(1.6, L2*0.5), 3.0, (j + k) % 2 === 1); });
        g.decks.forEach(function(d){ kd(d, "lit", K.warm, d.spawn.x, PH - 0.6, d.spawn.z, 0.8, 0.08, 0.8); });
        // a boiler (decor on the front deck): a long drum with a glowing fire door
        var bd = H.near(g.decks, cx, 1), BL = P.boilL || 5.6, BD = P.boilD || 2.4;
        kd(bd, "cyl", 0x6A5A4E, cx, BD/2 + 0.1, 0.4, BD + 0.2, BL + 0.2, BD + 0.2, Math.PI/2, 0, 0); kd(bd, "lit", 0xFF8A3A, cx, BD*0.45, 0.4 + BL/2 + 0.13, 0.7, 0.5, 0.05); kd(bd, "icyl", K.iron, cx, BD + 0.8, -1.0, 0.5, 1.6, 0.5);
        kd(bd, "box", K.brickD, cx, 0.3, 0.4, BD + 0.4, 0.6, BL - 0.4);
        var at = mem("g7roofL", cx, PH + 0.6, 0, 2*bw - 0.1, 1.2, 2*hz - 0.1, 1, null, null, K.slate), yt = PH + 1.2;
        slopes(at, cx, 0, yt, bw - 0.05, hz - 0.05, 1.8, K.slate, K.slateD, 1);
        kd(at, "box", K.stone, cx, PH + 0.1, hz - 0.03, 2*bw, 0.2, 0.08); kd(at, "box", K.stone, cx, PH + 0.1, -hz + 0.03, 2*bw, 0.2, 0.08);
        kd(at, "box", K.glass, cx, yt + 2.05, 0, 2*bw - 1.6, 0.7, 1.4); kd(at, "box", K.slateD, cx, yt + 2.5, 0, 2*bw - 1.2, 0.14, 1.9);
        for(var lv = -2; lv <= 2; lv++) kd(at, "ibox", K.white, cx + lv*(bw - 1)/2.5, yt + 2.05, 0.72, 0.06, 0.6, 0.04);
        // the feed-water tank on the roof (hard7v): heavy riveted iron, lands whole, still counts until a bomb cracks it
        if(P.heavy){ var TW = P.tankW || 2.4, tk = mem("hard7v", cx, yt + TW*0.45, -hz*0.4, TW, TW*0.9, TW*1.3, 2, null, null, 0x5B6470); tk.tint = 0x5B6470;
          for(var bb = 0; bb < 3; bb++) kd(tk, "box", K.iron, cx, yt + 0.3 + bb*TW*0.3, -hz*0.4, TW + 0.06, 0.08, TW*1.3 + 0.06); kd(tk, "box", K.cream, cx, yt + TW*0.5, -hz*0.4 + TW*0.65 + 0.02, TW*0.6, 0.4, 0.04); }
        if(first || last){ var ex = first ? -1 : 1; kd(at, "prism", K.brick, cx + ex*(bw - 0.08), yt + 0.9, 0, 0.14, 1.8, 2*hz - 0.1); kd(at, "cyl", K.cream, cx + ex*(bw - 0.02), yt + 0.6, 0, 1.1, 0.06, 1.1, 0, 0, Math.PI/2); }
        bgSet(nS, (P.bg0 || 71) + k); }
      // coal heaps and a barrow on the yard behind (decor)
      [-1, 1].forEach(function(s){ kd(base, "ibush", K.soot, s*W/4, 0.5, -hz - 1.2, 2.6, 1.0, 1.4); });
      LV7.g7info = Object.assign(LV7.g7info || {}, { boil:{ members:blocks.length - n0, W:W } });
      return { w:W + 2, d:2*hz + 4 };
    };

    // ---- E04 g7mhall: the covered timber market (main). P.n sections side by side (own bond group each), each on timber posts
    // (one TNT takes every post within ~3 m: "wood falls easy"), an open market floor with stalls and lamps, a glazed timber
    // clerestory storey, and a heavy tiled roof body (g7tile) with a ridge vent; a lantern cupola on the middle section.
    V5_PARTS.g7mhall = function(P){
      var n0 = blocks.length, ns = P.n || 3, hx = P.hx || 3.6, hz = P.hz || 6, PH = P.ph || 5.4, CH = P.ch || 2.6, RH = P.rh || 1.6, gap = 0.1, W = ns*2*hx + (ns - 1)*gap, x0 = -W/2 + hx, k;
      var base = addBlock(0, -0.25, 0, W + 4, 0.5, 2*hz + 4, "base", {anchor:true}); kd(base, "box", K.cobble, 0, 0.03, 0, W + 3.6, 0.06, 2*hz + 3.6); kd(base, "box", K.stone, 0, 0.07, 0, W - 0.4, 0.04, 2*hz - 0.4);
      for(k = 0; k < ns; k++){ var cx = x0 + k*(2*hx + gap), nS = blocks.length, mid = k === (ns - 1)/2;
        var g = H.boxSt({ y0:0, h:PH, hx:hx, hz:hz, cx:cx, nx:3, nz:3, pw:0.5, mw:0.45, fl:0, MT:api.mat("wood"), deck:"mdW", skin:"open", split:[2, 2], dk:0.35, tp:K.woodD, td:K.woodD,
          inner:P.inner ? [[0, -hz/2 + 0.3, 0.42], [0, hz/2 - 0.3, 0.42]] : [] });
        g.piers.forEach(function(p){ setKey(p, "g7post"); });
        tipOf(g, P.hold != null ? P.hold : 1.0);   // two posts side by side gone: the section folds that way
        g.piers.forEach(function(p){ kd(p, "box", K.stone, p.spawn.x, 0.3, p.spawn.z, 0.8, 0.6, 0.8);
          if(p.a1x != null) [-1, 1].forEach(function(e){ bar(p, K.woodD, p.spawn.x, PH - 1.6, p.spawn.z, p.spawn.x + (Math.abs(p.a1z) > hz - 1 ? e*1.2 : 0), PH - 0.5, p.spawn.z + (Math.abs(p.a1z) > hz - 1 ? 0 : e*1.2), 0.14); }); });   // knee braces
        // the market floor: two rows of stalls with striped awnings, crates of produce, hanging lamps (decor on the decks)
        g.decks.forEach(function(d, j){ var sx = d.spawn.x, sz = d.spawn.z;
          kd(d, "ibox", K.wood, sx, 0.5, sz, 2.4, 1.0, 1.4); kd(d, "ibox", [0xD8442E, 0xF2C230, 0x5BA35A, 0xE8803A][(j + k) % 4], sx, 1.05, sz, 2.2, 0.16, 1.2);
          for(var q = 0; q < 4; q++) kq(d, "box", q % 2 ? K.awnB : K.awnA, sx - 0.9 + q*0.6, 2.35, sz + Math.sign(sz)*0.4, 0.6, 0.06, 1.8, 0, Math.sign(sz)*0.35, 0);
          kd(d, "icyl", K.iron, sx, PH - 1.2, sz, 0.04, 1.6, 0.04); kd(d, "lit", K.lit, sx, PH - 2.1, sz, 0.45, 0.35, 0.45); });
        var y = PH, st = H.boxSt({ y0:y, h:CH, hx:hx, hz:hz, cx:cx, nx:3, nz:3, pw:0.42, mw:0.36, fl:1, MT:api.mat("wood"), deck:"mdW", skin:{ "z+":"glass", "z-":"glass", def:"open" }, split:[2, 1], dk:0.3, tp:K.woodD, td:K.woodD });
        st.panes.forEach(function(p, j){ H.paneDress(p, y, CH, j); onF(p, "box", K.woodD, 0, -CH*0.4, 2*Math.max(p.half[0], p.half[2]), 0.2, 0.08); onF(p, "box", K.woodD, 0, 0, 0.08, CH - 0.4, 0.09); });
        g.decks.forEach(function(d){ kd(d, "box", K.woodD, d.spawn.x, PH - 0.05, d.spawn.z + Math.sign(d.spawn.z)*0.6, 2*d.half[0], 0.3, 2*d.half[2] - 1.0); });
        y += CH;
        var at = mem(P.roofKey || "hard7t", cx, y + RH/2, 0, 2*hx - 0.1, RH, 2*hz - 0.1, 2, null, null, K.tile), yt = y + RH;
        slopes(at, cx, 0, yt, hx - 0.05, hz - 0.05, 2.0, K.tile, K.tileD, 1);
        kd(at, "box", K.woodD, cx, y + 0.1, hz - 0.03, 2*hx, 0.2, 0.1); kd(at, "box", K.woodD, cx, y + 0.1, -hz + 0.03, 2*hx, 0.2, 0.1);
        for(var t = -2; t <= 2; t++) [-1, 1].forEach(function(s){ kq(at, "ibox", K.tileD, cx + t*hx/2.6, yt + 1.0, s*hz/2, 0.08, 0.05, Math.hypot(hz, 2.0), 0, s*Math.atan2(2.0, hz), 0); });   // tile ribs
        kd(at, "box", K.woodL, cx, yt + 2.2, 0, 2*hx - 0.8, 0.4, 0.8); kd(at, "box", K.slateD, cx, yt + 2.45, 0, 2*hx - 0.6, 0.1, 1.1);   // the ridge vent
        if(mid){ H.oct(at, K.cream, yt + 1.6, 1.8, 1.0, cx, 0); kd(at, "lit", K.lit, cx, yt + 2.4, 0, 1.3, 0.9, 1.3); kd(at, "cone", K.copper, cx, yt + 4.1, 0, 2.4, 1.6, 2.4); kd(at, "ibush", K.gold, cx, yt + 5.1, 0, 0.3, 0.3, 0.3); }
        bgSet(nS, (P.bg0 || 91) + k); }
      LV7.g7info = Object.assign(LV7.g7info || {}, { hall:{ members:blocks.length - n0, W:W } });
      return { w:W + 4, d:2*hz + 4 };
    };
    // ---- E04 g7arcade: the brick arcade in front of the hall (the shield): P.n arches on brick piers, two storeys, a brick
    // parapet, cream arch heads and keystones. One TNT takes one pier (and the arch over it): it chips, it does not fold.
    V5_PARTS.g7arcade = function(P){
      var n0 = blocks.length, na = P.n || 7, L2 = P.len || 22.0, dz = P.d || 1.2, h1 = P.h1 || 5.0, h2 = P.h2 || 3.6, pw = P.pw || 1.1, i, s;
      var base = addBlock(0, -0.25, 0, L2 + 2, 0.5, dz + 3, "base", {anchor:true}); kd(base, "box", K.stone, 0, 0.03, 0, L2 + 1.6, 0.06, dz + 2.6);
      var sp = (L2 - pw)/na, xs = []; for(i = 0; i <= na; i++) xs.push(-L2/2 + pw/2 + i*sp);
      var y = 0;
      [h1, h2].forEach(function(hh, s2){ var piers = [];
        xs.forEach(function(x, i2){ var p = mem("bk", x, y + (hh - 0.6)/2, 0, pw, hh - 0.6, dz, s2*2, i2, 0, K.brick); piers.push(p);
          kd(p, "box", s2 ? K.brickL : K.stoneD, x, y + 0.3, 0, pw + 0.12, 0.6, dz + 0.12); kd(p, "box", K.stone, x, y + hh - 0.85, 0, pw + 0.14, 0.24, dz + 0.14); });
        for(i = 0; i < na; i++){ var lx = (xs[i] + xs[i + 1])/2, ll = sp - 0.04, lt = mem(s2 ? "bkw" : "bk", lx, y + hh - 0.3, 0, ll, 0.6, dz, s2*2 + 1, i, 1, K.brick);
          corb(lt, false, dz/2, lx, y + hh - 0.6, sp - pw, K.brick, 0.3); kd(lt, "box", K.stone, lx, y + hh - 0.02, 0, ll + 0.04, 0.12, dz + 0.16);
          if(s2 === 1){ kd(lt, "ibox", K.white, lx, y + 0.9, dz/2 - 0.1, ll - pw, 0.08, 0.08); for(var b = -2; b <= 2; b++) kd(lt, "ibox", K.white, lx + b*(ll - pw)/5, y + 0.5, dz/2 - 0.1, 0.07, 0.8, 0.07); } }
        y += hh; });
      // the parapet: a brick band with a cream coping and a sign board over the middle arch (decor on the top lintels)
      var tops = blocks.slice(n0).filter(function(b){ return b.floor === 3; });
      tops.forEach(function(t){ kd(t, "box", K.brickL, t.spawn.x, y + 0.35, 0, 2*t.half[0], 0.7, dz - 0.1); kd(t, "box", K.cream, t.spawn.x, y + 0.75, 0, 2*t.half[0] + 0.02, 0.1, dz + 0.04); });
      var mt = H.near(tops, 0, 0); kd(mt, "box", K.greenD, 0, y + 1.1, dz/2 - 0.1, 4.0, 0.9, 0.1); kd(mt, "box", K.cream, 0, y + 1.1, dz/2 - 0.04, 3.4, 0.14, 0.06); kd(mt, "prism", K.brickL, 0, y + 1.75, 0, 4.4, 0.5, dz - 0.2);
      if(P.bg) bgSet(n0, P.bg); return { w:L2 + 2, d:dz + 3 };
    };
    // ---- E04 g7kiosk: a small brick weigh house (hard, small): 4 brick piers, brick walls, an upper storey, a pyramid slate roof
    // body with a vane. Brick takes one TNT per pier: four bombs for a small gain.
    V5_PARTS.g7kiosk = function(P){
      var n0 = blocks.length, hx = P.hx || 2.4, y = 0, s;
      var base = addBlock(0, -0.25, 0, 2*hx + 2.4, 0.5, 2*hx + 2.4, "base", {anchor:true}); kd(base, "box", K.stone, 0, 0.03, 0, 2*hx + 2, 0.06, 2*hx + 2);
      for(s = 0; s < 2; s++){ var hh = s ? 3.2 : 4.0;
        var st = H.boxSt({ y0:y, h:hh, hx:hx, hz:hx, nx:2, nz:2, pw:0.85, mw:0.8, fl:s, MT:api.mat("brick"), deck:"mdB", skin:"wall", wall:"bkw", dk:0.35, tp:K.brickD, td:K.brickD, tw:s ? K.brickL : K.brick });
        plainDeck(st.decks, "mdB");
        st.walls.forEach(function(w){ if(s === 0 && w.a1face === "z+"){ onF(w, "box", K.greenD, 0, -0.6, 1.1, 2.2, 0.08); onD(w, K.greenD, 0, 0.5, 1.1, 0.08); onF(w, "box", K.cream, 0, 1.25, 1.6, 0.14, 0.1); }
          else archWin(w, 0, 0.2, 0.9, s ? 1.3 : 1.7, s === 1); onF(w, "box", K.stone, 0, hh*0.42 - 0.1, 2*Math.max(w.half[0], w.half[2]), 0.16, 0.08); });
        y += hh; }
      var at = mem(P.roofKey || "g7roofL", 0, y + 0.5, 0, 2*hx - 0.1, 1.0, 2*hx - 0.1, 2, null, null, K.slate); at.tint = K.slate;   // E04: roofKey hard7v = a heavy slate cap that lands whole
      kd(at, "cone", K.slate, 0, y + 1.0 + 1.1, 0, 2*hx*1.12, 2.2, 2*hx*1.12); kd(at, "box", K.cream, 0, y + 0.05, 0, 2*hx + 0.3, 0.2, 2*hx + 0.3);
      kd(at, "icyl", K.iron, 0, y + 3.9, 0, 0.07, 1.0, 0.07); kd(at, "ibox", K.gold, 0.2, y + 4.2, 0, 0.5, 0.14, 0.04);
      kd(base, "ibox", K.iron, hx + 0.7, 0.45, hx*0.4, 0.9, 0.9, 1.3); kd(base, "ibox", K.stone, hx + 0.7, 0.92, hx*0.4, 1.0, 0.06, 1.4);   // the weighing scale
      if(P.bg) bgSet(n0, P.bg); return { w:2*hx + 2.4, d:2*hx + 2.4 };
    };
  })();


  // ==================================================================================================================
  // g7 EASY PACK E05, E07-E10 (Agents-Game, 22/11: the rest of the easy pack, EASY-PACK.md). Own builders per level, the
  // same rules as E01-E06: every load-bearing box is a member, every detail is decor riding on a member inside its outline,
  // plain ladder floors (mdB / mdC / mdW) so a floor lying in the heap can be cleared. Only existing mechanics (hard7, drop7,
  // hit7, tip rule, keep6, drums); the keys below are aliases of existing members (as g7roofL / g7bk in the E02-E06 kit).
  //   E05 "Star Dome" (order of work: break the shell before the core): g7obs (an eight-sided brick drum on 16 posts, a
  //       stepped metal dome with an observing slit, an RC telescope pier inside = hard7v, counted until cracked, out of reach
  //       while the drum stands) and g7study (a timber-framed study wing, one each side).
  // ==================================================================================================================
  (function(){
    if(typeof A1 === "undefined" || !A1.h || typeof M14 === "undefined") return;
    var H = A1.h, kd = l6KdAdd, api = M14.api, kq = H.kq, bar = H.bar, mem = H.mem;
    var K = { brick:0xB5543A, brickD:0x8C3E2B, brickL:0xC9714E, stone:0xD9CFBD, stoneD:0xA89E8C, slate:0x4F5A68, slateD:0x3B4450, iron:0x3B4048,
      green:0x3F6F55, greenD:0x2E5541, cream:0xF1E6CC, white:0xF6F2EA, glass:0x9FC3D6, lit:0xFFD98A, warm:0xFFF1C4, wood:0xC58B55, woodD:0x8A5A33,
      woodL:0xE2B77E, red:0xC8362B, soot:0x2E2A2A, cobble:0x9C978E, cobbleD:0x7F7A72, lawn:0x7FB069, lawnD:0x5E8F4E, leaf:0x4F8F46, trunk:0x7A5236,
      copper:0x5FA08A, dome:0xDCE2E6, domeD:0xAEB7BE, gold:0xE8B23A, ink:0x2B2F36, path:0xD8CDB4, conc:0xD9D3C6, concD:0xB4AC9C, concL:0xEEE9DF,
      tile:0xB0503A, tileD:0x8E3E2D, aqua:0x6FC3DF, marble:0xEDE6DA, marbleD:0xC9C0B0 };
    // a silo drum (E08): concrete, but hollow: a fifth of the weight, so the silo row is a target, not most of the level
    MEMBERS.g7silo = Object.assign({}, MEMBERS.concrete, { density:+(window.__g7siloD || 600) }); MATS.g7silo = MATS.concrete;
    // the telescope pier (E05): the hard7v heavy piece in a slimmer, denser section (iron-cored concrete), so it stands clear of the
    // blast reach (3.8 m) of a TNT on the drum's posts: the shell's bombs never crack the core for free
    MEMBERS.hard7p = Object.assign({}, MEMBERS.hard7v, { density:+(window.__g7pierD || 7800) }); MATS.hard7p = MATS.hard7v || MATS.concrete;
    var isH8 = LV7.isHard7; LV7.isHard7 = function(b){ return isH8(b) || b.key === "hard7p"; };
    var bgSet = function(n0, g){ for(var q = n0; q < blocks.length; q++) if(!blocks[q].anchor) blocks[q].bg = g; };
    var FN = { "z+":[0, 1], "z-":[0, -1], "x+":[1, 0], "x-":[-1, 0] };
    function onF(b, g, c, u, v, w, h, t){ var n = FN[b.a1face]; if(!n) return; var X = !!n[0]; t = t || 0.06; var d = (X ? b.half[0] : b.half[2]) + t/2;
      kd(b, g, c, b.spawn.x + (X ? n[0]*d : u), b.spawn.y + v, b.spawn.z + (X ? u : n[1]*d), X ? t : w, h, X ? w : t); }
    function onD(b, c, u, v, D, t){ var n = FN[b.a1face]; if(!n) return; var X = !!n[0], d = (X ? b.half[0] : b.half[2]) + t/2;
      kd(b, "cyl", c, b.spawn.x + (X ? n[0]*d : u), b.spawn.y + v, b.spawn.z + (X ? u : n[1]*d), D, t, D, X ? 0 : Math.PI/2, 0, X ? Math.PI/2 : 0); }
    function archWin(w, u, v, ww, hh, lit, fr){ onF(w, "box", K.cream, u, v - hh/2 - 0.08, ww + 0.3, 0.14, 0.1); onF(w, "box", K.glass, u, v, ww, hh, 0.07); onD(w, K.glass, u, v + hh/2, ww, 0.07);
      onD(w, fr || K.cream, u, v + hh/2 + 0.02, ww + 0.28, 0.05); if(lit) onF(w, "lit", K.lit, u, v - 0.1, ww*0.7, hh*0.7, 0.08); onF(w, "box", K.white, u, v, 0.06, hh, 0.09); }
    function plainDeck(list, key){ list.forEach(function(d){ d.key = key; d.def = MEMBERS[key]; d.hp = d.hp0 = MEMBERS[key].hp; }); }
    function setKey(p, key, tint){ p.key = key; p.def = MEMBERS[key]; p.hp = p.hp0 = MEMBERS[key].hp; if(tint != null) p.tint = tint; }
    var tipOf = function(g, hold){ return api.tip({ piers:g.piers, skin:g.walls.concat(g.panes), decks:g.decks, hinge:hold, xz:function(p){ return p.a1x == null ? null : [p.a1x, p.a1z]; } }); };
    function tree(host, x, z, s){ kd(host, "icyl", K.trunk, x, 1.1*s, z, 0.35*s, 2.2*s, 0.35*s); kd(host, "ibush", K.leaf, x, 2.9*s, z, 2.4*s, 2.2*s, 2.4*s); kd(host, "ibush", K.lawnD, x + 0.4*s, 3.5*s, z - 0.3*s, 1.5*s, 1.4*s, 1.5*s); }
    function slopes(at, cx, cz, y, hx, hz, r, col, colD, ax){
      if(ax){ var sl = Math.atan2(r, hz); [-1, 1].forEach(function(s){ kq(at, "box", s > 0 ? col : colD, cx, y + r/2, cz + s*hz/2, 2*hx, 0.2, Math.hypot(hz, r), 0, s*sl, 0); }); kd(at, "box", colD, cx, y + r, cz, 2*hx, 0.22, 0.3); }
      else { var sl2 = Math.atan2(r, hx); [-1, 1].forEach(function(s){ kq(at, "box", s > 0 ? col : colD, cx + s*hx/2, y + r/2, cz, Math.hypot(hx, r), 0.2, 2*hz, 0, 0, -s*sl2); }); kd(at, "box", colD, cx, y + r, cz, 0.3, 0.22, 2*hz); }
    }
    // a stepped round dome (decor): n rings of a sphere of radius R from y0, each ring sector riding the member of `hosts` under it
    function dome(hosts, cx, cz, y0, R, n, col, colD, rq, i0, i1, ky){ ky = ky || 1; for(var i = i0 || 0; i < (i1 == null ? n : i1); i++){ var a0 = i/n*Math.PI/2, a1 = (i + 1)/n*Math.PI/2, D = 2*R*Math.cos((a0 + a1)/2), h = ky*R*(Math.sin(a1) - Math.sin(a0));
      H.ring(hosts, "cyl", i % 2 ? colD : col, y0 + ky*R*Math.sin(a0), h + 0.02, D, cx, cz, rq || 0.6); } }
    // ---- an EIGHT-SIDED storey with 16 posts (8 on the axis faces as octSt, 8 more on the diagonal faces), brick walls on the
    // four axis faces, the diagonal faces infilled (decor riding the diagonal post), and a RING of floor cassettes round a square
    // hole of half size c (the core passes through it untouched). o = { y0, h, r, cw, dw, c, fl, post, wall, deck, dk, tp, td, tw }
    function drumSt(o){ var r = o.r, cw = o.cw, dk = o.dk || 0.4, ch = o.h - dk, px = r - cw/2, a = r*0.4142, pa = Math.max(cw/2 + 0.02, a - cw/2), c = o.c, IN = 0.06, R = r - IN, out = { posts:[], diag:[], decks:[], walls:[], o:o }, y0 = o.y0;
      [[px, pa], [px, -pa], [-px, pa], [-px, -pa], [pa, px], [-pa, px], [pa, -px], [-pa, -px]].forEach(function(q, k){ var p = mem(o.post, q[0], y0 + ch/2, q[1], cw, ch, cw, o.fl, k, 0, o.tp); p.a1x = q[0]; p.a1z = q[1]; out.posts.push(p); });
      var dd = (r - (o.dw || cw)/2)*0.7071 - 0.1;
      [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(function(q, k){ var p = mem(o.post, q[0]*dd, y0 + ch/2, q[1]*dd, o.dw || cw, ch, o.dw || cw, o.fl, 8 + k, 0, o.tp); p.a1x = q[0]*dd; p.a1z = q[1]*dd; out.posts.push(p); out.diag.push(p);
        // the infill of the diagonal face: two brick panels, from the diagonal post to the axis posts on each side (decor on the post)
        [[px, q[1]*pa], [q[0]*pa, q[1]*px]].forEach(function(e){ var ex = q[0]*Math.abs(e[0]), ez = e[1], mx = (ex + p.spawn.x)/2, mz = (ez + p.spawn.z)/2, len = Math.hypot(ex - p.spawn.x, ez - p.spawn.z);
          kq(p, "box", o.tw, mx, y0 + ch/2, mz, len, ch - 0.05, 0.28, Math.atan2(-(ez - p.spawn.z), ex - p.spawn.x), 0, 0); }); });
      var len = 2*pa - cw - 0.04, th = 0.3;
      if(o.wall) [[1, 0, "x+"], [-1, 0, "x-"], [0, 1, "z+"], [0, -1, "z-"]].forEach(function(q){ var wl = mem(o.wall, q[0]*(r - th/2 - 0.1), y0 + (ch - 0.05)/2, q[1]*(r - th/2 - 0.1), q[0] ? th : len, ch - 0.05, q[0] ? len : th, o.fl, null, null, o.tw); wl.a1face = q[2]; out.walls.push(wl); });
      var yd = y0 + ch + dk/2, cr = r*0.7;   // the deck ring: 4 axis strips + 4 corner pieces
      [[-c, c, c, R], [-c, c, -R, -c], [c, R, -c, c], [-R, -c, -c, c], [c, cr, c, cr], [-cr, -c, c, cr], [c, cr, -cr, -c], [-cr, -c, -cr, -c]].forEach(function(q){
        var d = mem(o.deck, (q[0] + q[1])/2, yd, (q[2] + q[3])/2, q[1] - q[0], dk, q[3] - q[2], o.fl); d.tint = o.td; out.decks.push(d); });
      return out; }

    // ---- E05 g7obs: the observatory. A low stone terrace (anchor), an eight-sided brick drum of two storeys (16 brick posts,
    // walls with a door, arched and round windows, a stone cornice), a stepped metal dome in two members (a ring of four quarter
    // pieces and a cap) with a dark observing slit and the telescope looking out of it, and inside, the RC telescope pier: two
    // heavy pieces (hard7v) standing free in the floor holes, counted until cracked, out of reach while the drum stands.
    V5_PARTS.g7obs = function(P){
      var n0 = blocks.length, r = P.r || 5.0, h0 = P.h0 || 4.4, h1 = P.h1 || 3.6, c = P.c || 1.35, CW = P.core || 2.0, y = 0, rr = H.rng(505);
      var base = addBlock(0, -0.25, 0, 2*r + 5, 0.5, 2*r + 7, "base", {anchor:true});
      kd(base, "box", K.lawn, 0, 0.03, 0, 2*r + 4.6, 0.06, 2*r + 6.6); H.ring([base], "cyl", K.stoneD, 0, 0.12, 2*r + 1.6, 0, 0); H.ring([base], "cyl", K.path, 0.02, 0.12, 2*r + 0.8, 0, 0);
      for(var s2 = 0; s2 < 3; s2++) kd(base, "box", K.stone, 0, 0.08 + s2*0.0, r + 0.9 + s2*0.5, 3.0 - s2*0.3, 0.14 + 0.0, 0.5);   // the front steps
      // the RC telescope pier (the core): two heavy pieces in the floor holes, a stone collar per storey (decor)
      var PL = P.plinth || 0; if(PL){ var pl = addBlock(0, PL/2 - 0.25, 0, CW + 0.5, PL + 0.5, CW + 0.5, "base", {anchor:true}); kd(pl, "box", K.stone, 0, PL/2, 0, CW + 0.52, PL, CW + 0.52); kd(pl, "box", K.stoneD, 0, PL - 0.06, 0, CW + 0.7, 0.12, CW + 0.7); }
      var c0 = mem(P.coreKey || "hard7v", 0, PL + (h0 - PL - 0.02)/2, 0, CW, h0 - PL - 0.02, CW, 0, null, null, 0x6E6A66); c0.tint = 0x6E6A66;
      var CG = P.coreGap || 0, c1 = mem(P.coreKey || "hard7v", 0, h0 + (h1 - 0.04 - CG)/2, 0, CW - 0.3, h1 - 0.04 - CG, CW - 0.3, 1, null, null, 0x6E6A66); c1.tint = 0x6E6A66;   // coreGap: the pier stops short of the dome, so the dome drops in when the drum goes
      [c0, c1].forEach(function(p, k){ var hy = p.spawn.y, hh = p.half[1]; kd(p, "box", K.stone, 0, hy - hh + 0.25, 0, 2*p.half[0] + 0.3, 0.5, 2*p.half[2] + 0.3); kd(p, "box", K.stone, 0, hy + hh - 0.2, 0, 2*p.half[0] + 0.2, 0.3, 2*p.half[2] + 0.2);
        for(var q = 0; q < 3; q++) kd(p, "ibox", 0x5A5652, 0, hy - hh + 1.0 + q*1.0, p.half[2] + 0.01, 2*p.half[0] - 0.2, 0.05, 0.03);
        if(!k) kd(p, "lit", K.lit, 0, PL + 1.0, p.half[2] + 0.04, 0.5, 0.35, 0.04); });
      // the telescope on the pier (decor on the upper piece): a mount, a counterweight, a long white tube aimed out of the slit
      var tz = h0 + h1 - CG, ta = P.tilt || 0.62;
      kd(c1, "box", K.iron, 0, tz + 0.3, 0, 0.9, 0.6, 0.9); kd(c1, "icyl", K.iron, 0, tz + 0.9, 0, 0.35, 0.8, 0.35); kd(c1, "ibox", K.ink, -0.4, tz + 1.1, -0.6, 0.5, 0.5, 0.5);
      kq(c1, "cyl", K.white, 0, tz + 1.9, 0.9, 0.7, 3.8, 0.7, 0, ta, 0); kq(c1, "cyl", K.ink, 0, tz + 3.3, 2.0, 0.78, 0.25, 0.78, 0, ta, 0); kq(c1, "cyl", K.gold, 0, tz + 1.4, 0.5, 0.74, 0.12, 0.74, 0, ta, 0);
      // ground storey: door on the front, tall arched windows round
      var g = drumSt({ y0:0, h:h0, r:r, cw:P.cw || 0.95, dw:P.dw || 0.85, c:c, fl:0, post:"bk", wall:"bkw", deck:"mdB", dk:0.45, tp:K.brick, td:K.brickD, tw:K.brickL });
      g.posts.forEach(function(p){ kd(p, "box", K.stoneD, p.spawn.x, 0.3, p.spawn.z, 2*p.half[0] + 0.14, 0.6, 2*p.half[2] + 0.14); });
      g.walls.forEach(function(w, j){ var L2 = 2*Math.max(w.half[0], w.half[2]); onF(w, "box", K.stoneD, 0, -h0*0.42, L2, 0.5, 0.08);
        if(w.a1face === "z+"){ onF(w, "box", K.greenD, 0, -0.55, 1.3, 2.6, 0.08); onD(w, K.greenD, 0, 0.75, 1.3, 0.08); onD(w, K.cream, 0, 0.78, 1.6, 0.05); onF(w, "box", K.gold, 0.4, -0.5, 0.08, 0.08, 0.12); onF(w, "lit", K.lit, 0, 1.25, 0.6, 0.3, 0.1); }
        else archWin(w, 0, 0.1, 1.0, 2.0, j % 2 === 0); });
      g.diag.forEach(function(p, k){ var sx = Math.sign(p.spawn.x), sz = Math.sign(p.spawn.z), dx = sx*(r - 0.25)*0.7071, dz = sz*(r - 0.25)*0.7071;
        kd(p, "box", K.cream, dx, 2.2, dz, 0.5, 1.8, 0.5); kd(p, "box", K.glass, dx + sx*0.06, 2.2, dz + sz*0.06, 0.4, 1.6, 0.4); if(k % 2) kd(p, "lit", K.lit, dx + sx*0.1, 2.1, dz + sz*0.1, 0.3, 1.0, 0.3); });
      g.decks.forEach(function(d){ kd(d, "lit", K.warm, d.spawn.x, h0 - 0.55, d.spawn.z, 0.6, 0.06, 0.6); });
      api.floorIn(H.near(g.decks, 0, 3.2), 0.02, { hw:1.2, x:0, z:3.2, rr:rr, fi:1, plateHw:0 });
      H.ring(g.decks, "cyl", K.stone, h0 - 0.35, 0.4, 2*r + 0.5, 0, 0, 0.8);   // string course
      y = h0;
      var u = drumSt({ y0:y, h:h1, r:r - 0.2, cw:0.8, dw:0.75, c:c, fl:1, post:"bk", wall:"bkw", deck:"mdB", dk:0.4, tp:K.brick, td:K.brickD, tw:K.brick });
      u.walls.forEach(function(w, j){ onF(w, "box", K.cream, 0, 0.2, 1.25, 1.25, 0.06); onD(w, K.glass, 0, 0.2, 1.0, 0.08); onD(w, K.cream, 0, 0.2, 1.25, 0.05); if(j % 2) onD(w, K.lit, 0, 0.2, 0.6, 0.1);
        for(var q = 0; q < 3; q++) onF(w, "ibox", K.brickD, 0, -1.2 + q*0.5, 2*Math.max(w.half[0], w.half[2]), 0.04, 0.07); });
      u.decks.forEach(function(d){ kd(d, "lit", K.warm, d.spawn.x, y + h1 - 0.5, d.spawn.z, 0.5, 0.06, 0.5); });
      y += h1;
      // the cornice and the observing gallery: a stone ring, a white rail (decor on the top deck)
      H.ring(u.decks, "cyl", K.stone, y - 0.05, 0.35, 2*r + 0.7, 0, 0, 0.8); H.ring(u.decks, "cyl", K.cream, y + 0.3, 0.08, 2*r + 0.6, 0, 0, 0.8);
      for(var i = 0; i < 24; i++){ var an = i*Math.PI/12; kd(H.near(u.decks, Math.sin(an)*(r - 0.3), Math.cos(an)*(r - 0.3)), "ibox", K.white, Math.sin(an)*(r + 0.2), y + 0.15 + 0.3, Math.cos(an)*(r + 0.2), 0.06, 0.6, 0.06); }
      // the dome: a ring of four quarter pieces on the gallery floor, a cap on them (both light metal-on-timber members)
      var RD = r - 0.9, hq = P.dq || 2.1, qs = [], dk2 = P.domeKey || "g7tile", qb = RD*0.68;
      var cw2 = P.capW || 3.4, hc = 1.1, cap;
      if(P.oneDome){ cap = mem(dk2, 0, y + (hq + hc)/2, 0, 2*qb, hq + hc, 2*qb, 2, null, null, K.dome); cap.tint = K.dome; qs.push(cap); }   // one heavy dome: lands on top of the heap, in sight
      else { [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(function(q){ var b = mem(dk2, q[0]*qb*0.5, y + hq/2, q[1]*qb*0.5, qb - 0.04, hq, qb - 0.04, 2, null, null, K.dome); b.tint = K.dome; qs.push(b); });
        cap = mem(dk2, 0, y + hq + hc/2, 0, cw2, hc, cw2, 3, null, null, K.dome); cap.tint = K.dome; }
      dome(qs, 0, 0, y, RD, 7, K.dome, K.domeD, 0.75, 0, 4); dome([cap], 0, 0, y, RD, 7, K.dome, K.domeD, 0.75, 4, 7);
      // the observing slit (dark), its shutter rails, the telescope tube end showing in it
      kq(qs[0], "box", K.ink, 0, y + RD*0.55, RD*0.62, 1.1, RD*0.95, 0.2, 0, -0.85, 0); kq(cap, "box", K.ink, 0, y + RD*0.93, RD*0.2, 1.1, 0.2, RD*0.45, 0, 0, 0);
      [-1, 1].forEach(function(e){ kq(qs[0], "box", K.iron, e*0.65, y + RD*0.55, RD*0.64, 0.12, RD*0.98, 0.24, 0, -0.85, 0); });
      kd(cap, "icyl", K.iron, 0, y + RD + 0.25, 0, 0.12, 0.5, 0.12); kd(cap, "ibush", K.gold, 0, y + RD + 0.55, 0, 0.3, 0.3, 0.3);
      if(P.bg0) bgSet(n0, P.bg0);
      LV7.g7info = Object.assign(LV7.g7info || {}, { obs:{ top:y + RD, members:blocks.length - n0, core:[c0, c1].map(function(b){ return blocks.indexOf(b); }) } });
      return { w:2*r + 5, d:2*r + 7 };
    };
    // ---- E05 g7study: a study wing (easy): two timber storeys on timber posts, a glazed front with a bay, board side walls, a
    // pitched slate roof body with a little transit hut and a weather mast; books, desks and lamps inside (floorIn).
    V5_PARTS.g7study = function(P){
      var n0 = blocks.length, hx = P.hx || 3.0, hz = P.hz || 3.6, y = 0, s, side = P.side || 1, rr = H.rng(506 + (side > 0 ? 1 : 0)), MT = api.mat("wood"), sts = [];
      var base = addBlock(0, -0.25, 0, 2*hx + 3, 0.5, 2*hz + 4, "base", {anchor:true}); kd(base, "box", K.lawn, 0, 0.03, 0, 2*hx + 2.6, 0.06, 2*hz + 3.6); kd(base, "box", K.path, 0, 0.07, hz + 1.2, 1.6, 0.04, 2.0);
      for(s = 0; s < 2; s++){ var h = s ? 3.2 : 3.6;
        var st = H.boxSt({ y0:y, h:h, hx:hx, hz:hz, nx:3, nz:3, pw:0.45, mw:0.4, fl:s, MT:MT, deck:"mdW", skin:{ "z+":"glass", def:"wall" }, mat:"wood", wall:"wwall", dk:0.3, tp:K.woodD, td:K.woodD, tw:s ? K.cream : 0xEFD9B0 });
        sts.push(st);
        st.panes.forEach(function(g2, j){ H.paneDress(g2, y, h, j + s); onF(g2, "box", K.woodD, 0, -h*0.42, 2*Math.max(g2.half[0], g2.half[2]), 0.25, 0.08); onF(g2, "box", K.woodD, 0, 0, 0.08, h - 0.4, 0.1); });
        st.walls.forEach(function(w, j){ for(var q = -2; q <= 2; q++) onF(w, "ibox", K.woodL, q*0.62, 0, 0.05, h - 0.5, 0.05); onF(w, "box", K.woodD, 0, -h*0.44, 2*Math.max(w.half[0], w.half[2]), 0.2, 0.06);
          if((j + s) % 2 === 0) archWin(w, 0, 0.2, 0.8, 1.2, s === 1, K.woodD); });
        st.piers.forEach(function(p){ if(!s) kd(p, "box", K.stoneD, p.spawn.x, 0.25, p.spawn.z, 2*p.half[0] + 0.2, 0.5, 2*p.half[2] + 0.2); });
        var hd = H.near(s ? sts[0].decks : st.decks, 0, 0);
        api.floorIn(s ? sts[0].decks[0] : base, y + 0.02, { hw:Math.min(hx, hz) - 0.6, x:0, z:-0.3, rr:rr, fi:s + (side > 0 ? 2 : 0), plateHw:0 });
        y += h; }
      // a bay window on the front of the ground floor (decor on the first floor deck), a sundial on the lawn
      var d0 = sts[0].decks[0]; kd(d0, "box", K.woodD, 0, 3.4, hz + 0.05, 2.6, 0.2, 0.5); kd(d0, "box", K.slate, 0, 3.55, hz + 0.1, 2.8, 0.12, 0.6);
      kd(base, "icyl", K.stone, side*(hx - 0.6), 0.5, hz + 1.6, 0.5, 1.0, 0.5); kd(base, "icyl", K.gold, side*(hx - 0.6), 1.05, hz + 1.6, 0.8, 0.08, 0.8); kd(base, "ibox", K.gold, side*(hx - 0.6), 1.3, hz + 1.6, 0.06, 0.5, 0.4);
      tree(base, -side*(hx + 0.4), -hz - 0.6, 0.75);
      var at = mem("g7roofL", 0, y + 0.55, 0, 2*hx - 0.1, 1.1, 2*hz - 0.1, 2, null, null, K.slate); at.tint = K.slate;
      slopes(at, 0, 0, y + 1.1, hx, hz, 1.6, K.slate, K.slateD, 0); kd(at, "box", K.white, 0, y + 0.08, hz - 0.02, 2*hx + 0.2, 0.16, 0.1);
      [-1, 1].forEach(function(sz){ kd(at, "prism", K.cream, 0, y + 1.1 + 0.8, sz*(hz - 0.1), 0.16, 1.6, 2*hx - 0.1, 0, Math.PI/2, 0); });
      // the transit hut on the ridge (a small box with a split roof) and the weather mast
      kd(at, "box", K.cream, -side*hx*0.35, y + 2.6, 0, 1.2, 1.0, 1.2); kd(at, "box", K.slateD, -side*hx*0.35, y + 3.2, 0, 1.4, 0.15, 1.4); kd(at, "box", K.ink, -side*hx*0.35, y + 2.7, 0.62, 0.3, 0.7, 0.04);
      kd(at, "icyl", K.iron, side*hx*0.5, y + 3.2, 0, 0.07, 2.0, 0.07); kd(at, "ibox", K.gold, side*hx*0.5 + 0.2, y + 4.0, 0, 0.5, 0.1, 0.04); for(var cu = 0; cu < 3; cu++) kd(at, "ibush", K.white, side*hx*0.5 + Math.cos(cu*2.1)*0.35, y + 3.9, Math.sin(cu*2.1)*0.35, 0.18, 0.18, 0.18);
      if(P.bg) bgSet(n0, P.bg); return { w:2*hx + 3, d:2*hz + 4 };
    };

    // ---- E07 g7bath: the public bathhouse (main). A stucco hall on 8 piers (brick, one TNT each, tip rule with a hinge: two
    // piers side by side and the hall leans that way), tall thermal windows front and back, a pool, columns and benches inside;
    // an attic storey with pediments; a shallow copper dome in two members (four quarter pieces + a cap with a lantern).
    V5_PARTS.g7bath = function(P){
      var n0 = blocks.length, hx = P.hx || 6.5, hz = P.hz || 5.5, PH = P.ph || 6.5, AH = P.ah || 3.2, y = 0, rr = H.rng(707);
      var base = addBlock(0, -0.25, 0, 2*hx + 5, 0.5, 2*hz + 8, "base", {anchor:true});
      kd(base, "box", K.marble, 0, 0.03, 1.0, 2*hx + 4.6, 0.06, 2*hz + 7.6); kd(base, "box", K.marbleD, 0, 0.07, hz + 2.4, 2*hx + 2, 0.04, 2.6);
      kd(base, "box", K.aqua, 0, 0.09, hz + 2.4, 2*hx - 1, 0.04, 1.6); kd(base, "box", K.white, 0, 0.12, hz + 2.4, 2*hx - 0.6, 0.02, 2.0);   // the outdoor plunge pool in front
      // inside, on the floor of the hall (decor on the terrace: it stays when the hall comes down): the big pool, benches, steam
      kd(base, "box", K.marbleD, 0, 0.1, -0.3, 2*hx - 4.4, 0.1, 2*hz - 4.4); kd(base, "box", K.aqua, 0, 0.17, -0.3, 2*hx - 5, 0.05, 2*hz - 5);
      [-1, 1].forEach(function(s){ kd(base, "ibox", K.woodD, s*(hx - 1.6), 0.45, -0.3, 0.6, 0.12, 2*hz - 5); kd(base, "ibush", 0xF4F4F4, s*1.4, 1.2, -0.8, 1.6, 0.8, 1.2); });
      var g = H.boxSt({ y0:0, h:PH, hx:hx, hz:hz, nx:3, nz:3, pw:P.pw || 1.15, mw:P.mw || 1.0, fl:0, MT:api.mat("brick"), deck:"mdB", skin:P.allGlass ? "glass" : { "z+":"glass", "z-":"glass", def:"wall" }, wall:"bkw", split:[2, 2], dk:0.5, tp:K.marble, td:K.marbleD, tw:K.cream });
      plainDeck(g.decks, "mdB"); LV7.g7tip = tipOf(g, P.hold != null ? P.hold : 1.6);
      g.piers.forEach(function(p){ kd(p, "box", K.marbleD, p.spawn.x, 0.35, p.spawn.z, 2*p.half[0] + 0.2, 0.7, 2*p.half[2] + 0.2); kd(p, "box", K.marble, p.spawn.x, PH - 1.05, p.spawn.z, 2*p.half[0] + 0.18, 0.3, 2*p.half[2] + 0.18);
        for(var q = 0; q < 4; q++) kd(p, "ibox", K.marbleD, p.spawn.x, 1.3 + q*1.1, p.spawn.z + Math.sign(p.a1z || 1)*(p.half[2] + 0.01), 2*p.half[0] - 0.12, 0.05, 0.03); });   // rustication
      // the thermal windows: a big half-round lunette over two tall lights per bay, with mullions (decor on each pane)
      g.panes.forEach(function(w, j){ var L2 = 2*Math.max(w.half[0], w.half[2]), hh = 2*w.half[1]; H.paneDress(w, 0, PH, j);
        onF(w, "box", K.white, 0, -hh*0.47, L2, 0.18, 0.1); for(var m = -1; m <= 1; m++) onF(w, "box", K.white, m*L2/3, -hh*0.05, 0.1, hh*0.8, 0.1);
        onD(w, K.white, 0, hh*0.26, L2*0.86, 0.06); onD(w, K.glass, 0, hh*0.26, L2*0.78, 0.08); for(var m2 = -2; m2 <= 2; m2++) onF(w, "box", K.white, m2*L2*0.17, hh*0.36, 0.06, hh*0.22, 0.1);
        if(j % 2 === 0) onF(w, "lit", K.lit, 0, -hh*0.1, L2*0.5, hh*0.4, 0.1); });
      g.walls.forEach(function(w, j){ var L2 = 2*Math.max(w.half[0], w.half[2]); onF(w, "box", K.marbleD, 0, -PH*0.43, L2, 0.5, 0.08); archWin(w, 0, 0.4, Math.min(1.4, L2*0.4), 2.6, j % 2 === 0); });
      g.decks.forEach(function(d){ kd(d, "lit", K.warm, d.spawn.x, PH - 0.7, d.spawn.z, 0.9, 0.08, 0.9); kd(d, "box", K.marble, d.spawn.x, PH - 0.25, d.spawn.z, 2*d.half[0] + 0.12, 0.35, 2*d.half[2] + 0.12); });
      y = PH;
      // the attic: a plain stucco storey with a pediment on the front and back and a cornice (decor on its walls and deck)
      var at = H.boxSt({ y0:y, h:AH, hx:hx - 0.3, hz:hz - 0.3, nx:3, nz:3, pw:0.9, mw:0.8, fl:1, MT:api.mat("brick"), deck:"mdB", skin:"wall", wall:"bkw", split:[2, 2], dk:0.4, tp:K.marble, td:K.marbleD, tw:K.cream });
      plainDeck(at.decks, P.atticKey || "mdB");   // E07: atticKey hard7t = a heavy attic floor: it lands whole and still counts
      at.walls.forEach(function(w, j){ var L2 = 2*Math.max(w.half[0], w.half[2]); onF(w, "box", K.marble, 0, AH*0.36, L2, 0.25, 0.08); onF(w, "box", K.white, 0, -0.1, L2*0.6, 0.7, 0.06); if(j % 2) onF(w, "lit", K.lit, 0, -0.1, L2*0.4, 0.4, 0.08); });
      [-1, 1].forEach(function(sz){ var d = H.near(at.decks, 0, sz*hz); kd(d, "prism", K.marble, 0, y + AH + 0.55, sz*(hz - 0.45), 0.5, 1.1, 2*hx - 1.2, 0, Math.PI/2, 0); kd(d, "prism", K.marbleD, 0, y + AH + 0.5, sz*(hz - 0.33), 0.2, 0.7, 2*hx - 2.6, 0, Math.PI/2, 0); });
      at.decks.forEach(function(d){ kd(d, "box", K.marble, d.spawn.x, y + AH - 0.15, d.spawn.z, 2*d.half[0] + 0.3, 0.3, 2*d.half[2] + 0.3); });
      y += AH;
      // the shallow copper dome: four quarter pieces and a cap with a glazed lantern (light members: they drop into the hall)
      var R = P.dr || 5.0, ky = P.ky || 0.62, qb = R*0.66, hq = P.dq || 1.5, qs = [], dk2 = P.domeKey || "g7tile";
      var hc = 1.0, cap;
      if(P.oneDome){ cap = mem(dk2, 0, y + hq/2, 0, 2*qb, hq, 2*qb, 2, null, null, K.copper); cap.tint = K.copper; qs.push(cap); }   // one heavy dome: it lands on top of the heap, in sight
      else { [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(function(q){ var b = mem(dk2, q[0]*qb*0.5, y + hq/2, q[1]*qb*0.5, qb - 0.04, hq, qb - 0.04, 2, null, null, K.copper); b.tint = K.copper; qs.push(b); });
        cap = mem(dk2, 0, y + hq + hc/2, 0, 2.8, hc, 2.8, 3, null, null, K.copper); cap.tint = K.copper; }
      H.ring(qs, "cyl", K.marbleD, y, 0.45, 2*R + 0.6, 0, 0, 0.75);   // the drum ring under the dome
      dome(qs, 0, 0, y + 0.4, R, 6, K.copper, 0x4E8A76, 0.75, 0, 4, ky); dome([cap], 0, 0, y + 0.4, R, 6, K.copper, 0x4E8A76, 0.75, 4, 6, ky);
      for(var i = 0; i < 8; i++){ var an = i*Math.PI/4 + Math.PI/8, h2 = H.near(qs, Math.sin(an)*R*0.5, Math.cos(an)*R*0.5); bar(h2, K.white, Math.sin(an)*R*0.98, y + 0.5, Math.cos(an)*R*0.98, Math.sin(an)*R*0.42, y + 0.4 + R*ky*0.9, Math.cos(an)*R*0.42, 0.14); }   // ribs
      H.oct(cap, K.white, y + 0.4 + R*ky - 0.1, 1.1, 0.95); H.oct(cap, K.glass, y + 0.4 + R*ky + 0.05, 0.8, 0.85); kd(cap, "lit", K.lit, 0, y + 0.4 + R*ky + 0.45, 0, 1.2, 0.6, 1.2);
      kd(cap, "cone", K.copper, 0, y + 0.4 + R*ky + 1.4, 0, 2.2, 0.9, 2.2); kd(cap, "ibush", K.gold, 0, y + 0.4 + R*ky + 2.0, 0, 0.3, 0.3, 0.3);
      if(P.bg) bgSet(n0, P.bg);
      LV7.g7info = Object.assign(LV7.g7info || {}, { bath:{ top:y + R*ky + 2, members:blocks.length - n0 } });
      return { w:2*hx + 5, d:2*hz + 8 };
    };
    // ---- E07 g7colo: a colonnade wing (easy): a row of timber columns (marble-clad decor) front and back, a back screen wall,
    // a light roof body with a low tiled hip roof; changing booths and a fountain inside.
    V5_PARTS.g7colo = function(P){
      var n0 = blocks.length, hx = P.hx || 2.4, hz = P.hz || 5.0, CH = P.ch || 4.6, side = P.side || 1;
      var base = addBlock(0, -0.25, 0, 2*hx + 2, 0.5, 2*hz + 3, "base", {anchor:true}); kd(base, "box", K.marble, 0, 0.03, 0.5, 2*hx + 1.6, 0.06, 2*hz + 2.6);
      var g = H.boxSt({ y0:0, h:CH, hx:hx, hz:hz, nx:2, nz:4, pw:P.pw || 0.5, mw:P.pw || 0.45, fl:0, MT:api.mat(P.mat || "wood"), deck:"mdW", skin:{ def:"open" }, split:[1, 2], dk:0.35, tp:K.marble, td:K.marbleD });
      g.piers.forEach(function(p){ kd(p, "icyl", K.marble, p.spawn.x, CH/2 - 0.2, p.spawn.z, 0.62, CH - 0.8, 0.62); kd(p, "box", K.marbleD, p.spawn.x, 0.2, p.spawn.z, 0.8, 0.4, 0.8); kd(p, "box", K.marble, p.spawn.x, CH - 0.55, p.spawn.z, 0.8, 0.3, 0.8);
        for(var f = 0; f < 3; f++) kd(p, "ibox", K.marbleD, p.spawn.x + Math.cos(f*2.1)*0.3, CH/2 - 0.2, p.spawn.z + Math.sin(f*2.1)*0.3, 0.04, CH - 1.0, 0.04); });
      // the back screen wall (side away from the hall: decor on the far posts) and the booths, a fountain
      var far = g.piers.filter(function(p){ return Math.sign(p.a1x) === side; });
      far.forEach(function(p){ kd(p, "box", K.cream, side*(hx - 0.25), CH/2 - 0.2, p.spawn.z, 0.2, CH - 0.8, Math.min(2*hz/3, 3.2)); });
      for(var b = -1; b <= 1; b++){ var p2 = H.near(g.piers, side*hx, b*hz*0.6); kd(p2, "ibox", [K.awn || 0xD8442E, K.aqua, K.gold][b + 1], side*(hx - 0.9), 1.0, b*hz*0.6, 1.0, 2.0, 1.4); }
      kd(base, "icyl", K.marbleD, -side*0.3, 0.35, 0, 1.6, 0.5, 1.6); kd(base, "icyl", K.aqua, -side*0.3, 0.62, 0, 1.3, 0.06, 1.3); kd(base, "icyl", K.marble, -side*0.3, 1.1, 0, 0.25, 1.0, 0.25);
      g.decks.forEach(function(d){ kd(d, "box", K.marble, d.spawn.x, CH - 0.15, d.spawn.z, 2*d.half[0] + 0.4, 0.35, 2*d.half[2] + 0.2); kd(d, "lit", K.warm, d.spawn.x, CH - 0.6, d.spawn.z, 0.5, 0.08, 0.5); });
      var at = mem(P.roofKey || "g7roofL", 0, CH + 0.4, 0, 2*hx - 0.1, 0.8, 2*hz - 0.1, 1, null, null, K.tile); at.tint = K.tile;   // E07: roofKey hard7t = a heavy tiled roof that lands whole
      slopes(at, 0, 0, CH + 0.8, hx, hz, 1.0, K.tile, K.tileD, 0);
      [-1, 1].forEach(function(sz){ kd(at, "prism", K.tileD, 0, CH + 1.3, sz*(hz - 0.3), 0.5, 1.0, 2*hx - 0.2, 0, Math.PI/2, 0); });
      for(var t = -3; t <= 3; t++) kd(at, "ibox", K.tileD, 0, CH + 1.4, t*hz/3.6, 2*hx*0.2, 0.06, 0.08);
      if(P.bg) bgSet(n0, P.bg); return { w:2*hx + 2, d:2*hz + 3 };
    };

    // ---- E08 g7elev: the concrete head house of a grain elevator (main). Ground storey = a truck drive-through on 8 piers:
    // the 4 CORNERS are massive RC (hrc, L32 tier: one TNT cracks, two show rebar, three break it; the damage stays between
    // blasts), the 4 middles ordinary RC; tip rule with a hinge (two piers side by side: it falls that way). Above, 5 concrete
    // storeys (RC posts, panel walls with small windows, pilasters), a gabled cupola with a slate roof body, a spout to the silos.
    V5_PARTS.g7elev = function(P){
      var n0 = blocks.length, hx = P.hx || 3.6, hz = P.hz || 3.6, LH = P.legH || 5.4, SH = 3.2, n = P.n || 5, y = 0, s, sts = [], rr = H.rng(808), side = P.side || 1;
      var base = addBlock(0, -0.25, 0, 2*hx + 6, 0.5, 2*hz + 7, "base", {anchor:true}); kd(base, "box", K.cobble, 0, 0.03, 0.5, 2*hx + 5.6, 0.06, 2*hz + 6.6); kd(base, "box", K.concD, 0, 0.07, 0, 2*hx - 1.0, 0.04, 2*hz + 6);
      var g = H.boxSt({ y0:0, h:LH, hx:hx, hz:hz, nx:3, nz:3, pw:1.15, mw:0.95, fl:0, MT:{ pier:"hrc", deck:"mdC" }, deck:"mdC", skin:P.gwall === 0 ? "open" : { "z-":"wall", def:"open" }, wall:"cpan", dk:0.55, tp:K.conc, td:K.concD, tw:K.concL });
      plainDeck(g.decks, "mdC");
      g.piers.forEach(function(p){ var corner = Math.abs(p.a1x) > hx - 1 && Math.abs(p.a1z) > hz - 1;
        if(!corner) setKey(p, "rc", K.conc);
        else { p.tint = 0xC9C3B6; api.rcDecor(p, Math.sign(p.a1x), 0, p.spawn.x + Math.sign(p.a1x)*(p.half[0] + 0.02), p.spawn.z, 2*p.half[2]); api.rcDecor(p, 0, Math.sign(p.a1z), p.spawn.x, p.spawn.z + Math.sign(p.a1z)*(p.half[2] + 0.02), 2*p.half[0]); }
        kd(p, "box", K.concD, p.spawn.x, 0.3, p.spawn.z, 2*p.half[0] + 0.2, 0.6, 2*p.half[2] + 0.2);
        for(var q = 0; q < 4; q++) kd(p, "ibox", K.concD, p.spawn.x, 1.2 + q*1.0, p.spawn.z + Math.sign(p.a1z || 1)*(p.half[2] + 0.01), 2*p.half[0] - 0.12, 0.04, 0.03); });   // board marks
      LV7.g7tip = tipOf(g, P.hold != null ? P.hold : 2.0);
      g.walls.forEach(function(w){ var L2 = 2*Math.max(w.half[0], w.half[2]); onF(w, "box", K.concD, 0, -LH*0.42, L2, 0.4, 0.08); onF(w, "box", K.ink, 0, -0.4, L2*0.6, 2.6, 0.06); });
      g.decks.forEach(function(d){ kd(d, "box", K.concL, d.spawn.x, LH - 0.25, d.spawn.z, 2*d.half[0] + 0.2, 0.4, 2*d.half[2] + 0.2); kd(d, "lit", K.warm, d.spawn.x, LH - 0.7, d.spawn.z, 1.0, 0.08, 1.0); });
      // the drive-through: a grain truck parked under it, the receiving pit grating (decor on the yard: it stays)
      kd(base, "ibox", K.red, 0, 1.1, 0.6, 2.0, 1.6, 2.4); kd(base, "ibox", K.cream, 0, 1.0, -1.4, 2.0, 1.2, 2.0); kd(base, "lit", K.lit, 0, 1.2, 1.82, 1.4, 0.3, 0.04); kd(base, "ibox", K.ink, 0, 0.35, -0.2, 1.8, 0.4, 4.0);
      kd(base, "box", K.iron, 0, 0.09, -0.4, 2.6, 0.04, 2.6); for(var gr = -3; gr <= 3; gr++) kd(base, "ibox", K.ink, gr*0.35, 0.11, -0.4, 0.06, 0.02, 2.5);
      y = LH;
      for(s = 0; s < n; s++){
        var st = H.boxSt({ y0:y, h:SH, hx:hx, hz:hz, nx:3, nz:3, pw:0.85, mw:0.7, fl:s + 1, MT:{ pier:"rc", deck:"mdC" }, deck:"mdC", skin:"wall", wall:"cpan", dk:0.4, tp:K.conc, td:K.concD, tw:s % 2 ? K.conc : K.concL });
        plainDeck(st.decks, "mdC"); sts.push(st);
        st.walls.forEach(function(w, j){ var L2 = 2*Math.max(w.half[0], w.half[2]); onF(w, "box", K.concD, 0, 0.2, 0.9, 1.0, 0.06); onF(w, "box", K.glass, 0, 0.2, 0.7, 0.8, 0.08); onF(w, "ibox", K.white, 0, 0.2, 0.05, 0.8, 0.1);
          if((j + s) % 3 === 0) onF(w, "lit", K.lit, 0, 0.15, 0.5, 0.6, 0.1); onF(w, "ibox", K.concD, 0, SH*0.45 - 0.2, L2, 0.05, 0.07); });
        st.piers.forEach(function(p){ if(Math.abs(p.a1x) > hx - 1 && Math.abs(p.a1z) > hz - 1) kd(p, "box", K.concL, p.spawn.x, y + SH/2 - 0.2, p.spawn.z, 2*p.half[0] + 0.14, SH - 0.4, 2*p.half[2] + 0.14); });   // pilasters
        kd(st.decks[0], "lit", K.warm, 0, y + SH - 0.6, 0, 0.8, 0.08, 0.8);
        y += SH; }
      // the cupola (head house proper): a narrower concrete storey with a band of windows, a light gabled roof body, a spout
      var cu = H.boxSt({ y0:y, h:3.0, hx:hx - 0.9, hz:hz - 0.4, nx:3, nz:3, pw:0.6, mw:0.5, fl:n + 1, MT:{ pier:"rc", deck:"mdC" }, deck:"mdC", skin:"wall", wall:"cpan", dk:0.35, tp:K.conc, td:K.concD, tw:K.concL });
      plainDeck(cu.decks, "mdC");
      cu.walls.forEach(function(w, j){ var L2 = 2*Math.max(w.half[0], w.half[2]); onF(w, "box", K.glass, 0, 0.2, L2*0.7, 0.8, 0.07); for(var m = -2; m <= 2; m++) onF(w, "ibox", K.white, m*L2*0.15, 0.2, 0.05, 0.8, 0.09); if(j % 2) onF(w, "lit", K.lit, 0, 0.2, L2*0.4, 0.5, 0.1); });
      kd(sts[n - 1].decks[0], "box", K.concL, 0, y + 0.1, 0, 2*hx + 0.3, 0.25, 2*hz + 0.3);   // the cornice under the cupola
      // the garner bin: a heavy iron-bound bin filling the cupola (hard7v: lands whole in the heap, counts until a bomb cracks it)
      if(P.bin2){ var sw2 = P.bin2, sh2 = SH - 0.4 - 0.9, b2 = mem("hard7v", 0, y - SH + sh2/2 + 0.02, 0, sw2, sh2, sw2, n, null, null, 0x6A645C); b2.tint = 0x6A645C;   // a second bin in the top storey of the shaft
        for(var b3 = 0; b3 < 2; b3++) kd(b2, "box", K.iron, 0, y - SH + 0.5 + b3*1.0, 0, sw2 + 0.05, 0.1, sw2 + 0.05); }
      if(P.bin){ var bw2 = 2*(hx - 0.9) - 1.5, bd2 = 2*(hz - 0.4) - 1.5, bh = 3.0 - 0.35 - 0.3, bn = mem("hard7v", 0, y + bh/2 + 0.02, 0, bw2, bh, bd2, n + 1, null, null, 0x6A645C); bn.tint = 0x6A645C;
        for(var bb = 0; bb < 3; bb++) kd(bn, "box", K.iron, 0, y + 0.4 + bb*0.8, 0, bw2 + 0.05, 0.1, bd2 + 0.05); kd(bn, "cone", K.iron, 0, y + bh + 0.15, 0, bw2*0.6, 0.3, bd2*0.6); }
      y += 3.0;
      var at = mem(P.roofKey || "g7roofL", 0, y + (P.rh || 1.0)/2, 0, 2*(hx - 0.9) - 0.1, P.rh || 1.0, 2*(hz - 0.4) - 0.1, n + 2, null, null, K.slate); at.tint = K.slate;
      var RH = P.rh || 1.0; y += RH - 1.0;   // a deeper roof body (E08 heavy: the cast concrete machinery floor under the slates)
      slopes(at, 0, 0, y + 1.0, hx - 0.85, hz - 0.35, 1.5, K.slate, K.slateD, 0);
      [-1, 1].forEach(function(sz){ kd(at, "prism", K.concL, 0, y + 1.0 + 0.75, sz*(hz - 0.5), 0.16, 1.5, 2*(hx - 0.9) - 0.1, 0, Math.PI/2, 0); });
      kd(at, "icyl", K.iron, -side*(hx - 1.6), y + 2.4, 0, 0.6, 1.6, 0.6); kd(at, "cone", K.iron, -side*(hx - 1.6), y + 3.4, 0, 0.9, 0.5, 0.9);   // the dust vent
      // the spout: an iron chute from the cupola down towards the silos (decor on the cupola's deck, inside its reach)
      kd(cu.decks[0], "ibox", K.iron, side*(hx - 0.95), y - 1.4, 0, 0.5, 0.5, 0.5); bar(cu.decks[0], K.iron, side*(hx - 0.7), y - 1.5, 0, side*(hx + 0.4), y - 3.6, 0, 0.32);
      if(P.bg) bgSet(n0, P.bg); LV7.g7info = Object.assign(LV7.g7info || {}, { elev:{ top:y + 2.5, members:blocks.length - n0 } });
      return { w:2*hx + 6, d:2*hz + 7 };
    };
    // ---- E08 g7silo: a row of concrete silos (soft; the target). Each silo is a stack of drums (one member each, own bond group
    // per silo): one TNT takes a drum, the silo above comes down and the drums tumble. A covered conveyor gallery runs on top.
    V5_PARTS.g7silo = function(P){
      var n0 = blocks.length, ns = P.n || 4, nr = P.rows || 1, D = P.D || 3.3, gap = P.gap || 0.25, k = P.k || 3, dh = P.dh || 4.2, W = ns*D + (ns - 1)*gap, Dz = nr*D + (nr - 1)*gap, x0 = -W/2 + D/2, z0 = -Dz/2 + D/2, i, j, r, tops = [];
      var base = addBlock(0, -0.25, 0, W + 3, 0.5, Dz + 5, "base", {anchor:true}); kd(base, "box", K.cobble, 0, 0.03, 0.4, W + 2.6, 0.06, Dz + 4.6);
      for(r = 0; r < nr; r++) for(i = 0; i < ns; i++){ var cx = x0 + i*(D + gap), cz = z0 + r*(D + gap), nS = blocks.length, y = 0, top = null;
        for(j = 0; j < k; j++){ var b = mem(P.key || "g7silo", cx, y + dh/2, cz, D - 0.4, dh - 0.02, D - 0.4, j, i, j, K.concL); b.tint = K.concL;
          kd(b, "cyl", j % 2 ? K.conc : K.concL, cx, y + dh/2, cz, D, dh - 0.04, D); kd(b, "cyl", K.concD, cx, y + dh - 0.12, cz, D + 0.08, 0.16, D + 0.08);
          if(j === 0 && r === nr - 1) kd(b, "box", K.ink, cx, 1.0, cz + D/2 - 0.05, 0.9, 1.6, 0.12);
          for(var q = 0; q < 2; q++) kd(b, "ibox", K.concD, cx, y + 1.2 + q*1.6, cz + D/2 + 0.01, D*0.12, 0.05, 0.04);
          top = b; y += dh; }
        kd(top, "cone", K.conc, cx, y + 0.35, cz, D - 0.1, 0.7, D - 0.1); kd(top, "ibox", K.concD, cx, y + 0.8, cz, 0.6, 0.35, 0.6); tops.push(top);
        bgSet(nS, (P.bg0 || 121) + r*ns + i); }
      // the conveyor gallery along the tops (decor in pieces, one per silo: it falls with its silo) and a ladder cage on the end
      var yt = k*dh;
      tops.forEach(function(t, q){ var tz = t.spawn.z; kd(t, "box", K.iron, t.spawn.x, yt + 1.15, tz, D + gap, 0.15, 1.4); kd(t, "box", K.slateD, t.spawn.x, yt + 1.9, tz, D + gap, 0.12, 1.6); kd(t, "box", K.glass, t.spawn.x, yt + 1.5, tz + 0.66, D + gap - 0.3, 0.5, 0.05);
        if(q % 2) kd(t, "lit", K.lit, t.spawn.x, yt + 1.5, tz + 0.7, 0.8, 0.3, 0.04); });
      var e = blocks.slice(n0).filter(function(b){ return b.gi === ns - 1; }); e.forEach(function(b){ kd(b, "ibox", K.iron, x0 + (ns - 1)*(D + gap) + D/2 + 0.15, b.spawn.y, b.spawn.z, 0.1, 2*b.half[1], 0.6); });
      LV7.g7info = Object.assign(LV7.g7info || {}, { silo:{ members:blocks.length - n0, W:W } });
      return { w:W + 3, d:Dz + 5 };
    };
    // ---- E08 g7weigh: the weigh house (easy): a brick ground storey with a timber office on top, a light slate roof body, the
    // weighbridge plate and its beam on the yard in front.
    V5_PARTS.g7weigh = function(P){
      var n0 = blocks.length, hx = P.hx || 2.6, hz = P.hz || 3.0, y = 0, side = P.side || -1;
      var base = addBlock(0, -0.25, 0, 2*hx + 3, 0.5, 2*hz + 5, "base", {anchor:true}); kd(base, "box", K.cobble, 0, 0.03, 1.0, 2*hx + 2.6, 0.06, 2*hz + 4.6);
      kd(base, "box", K.iron, 0, 0.08, hz + 2.0, 2*hx, 0.06, 2.4); for(var q = -3; q <= 3; q++) kd(base, "ibox", K.ink, q*hx/3.5, 0.12, hz + 2.0, 0.05, 0.02, 2.3);
      var g = H.boxSt({ y0:0, h:3.6, hx:hx, hz:hz, nx:2, nz:2, pw:0.7, mw:0.6, fl:0, MT:api.mat("brick"), deck:"mdW", skin:"wall", wall:"bkw", dk:0.3, tp:K.brick, td:K.woodD, tw:K.brickL });
      g.walls.forEach(function(w, j){ onF(w, "box", K.stoneD, 0, -1.5, 2*Math.max(w.half[0], w.half[2]), 0.4, 0.08);
        if(w.a1face === "z+"){ onF(w, "box", K.greenD, -0.7, -0.4, 1.0, 2.2, 0.08); archWin(w, 1.0, 0.3, 0.8, 1.2, true); } else archWin(w, 0, 0.3, 0.9, 1.4, j % 2 === 0); });
      y = 3.6;
      var st = H.boxSt({ y0:y, h:3.0, hx:hx, hz:hz, nx:3, nz:2, pw:0.4, mw:0.35, fl:1, MT:api.mat("wood"), deck:"mdW", skin:{ "z+":"glass", def:"wall" }, mat:"wood", wall:"wwall", dk:0.3, tp:K.green, td:K.woodD, tw:K.cream });
      st.panes.forEach(function(p, j){ H.paneDress(p, y, 3.0, j); onF(p, "box", K.green, 0, -1.05, 2*Math.max(p.half[0], p.half[2]), 0.7, 0.08); });
      st.walls.forEach(function(w){ for(var q2 = -2; q2 <= 2; q2++) onF(w, "ibox", K.woodL, q2*0.6, 0, 0.05, 2.5, 0.05); });
      kd(g.decks[0], "ibox", K.woodD, 0, y + 0.5, -1.0, 2.2, 1.0, 0.8); kd(g.decks[0], "lit", K.lit, 0, y + 2.1, 0, 0.6, 0.4, 0.6); kd(g.decks[0], "ibox", K.gold, 0.8, y + 1.3, -1.2, 0.6, 0.6, 0.3);   // the desk, the lamp, the scale dial
      y += 3.0;
      var at = mem("g7roofL", 0, y + 0.45, 0, 2*hx - 0.1, 0.9, 2*hz - 0.1, 2, null, null, K.slate); at.tint = K.slate;
      slopes(at, 0, 0, y + 0.9, hx + 0.1, hz + 0.1, 1.3, K.slate, K.slateD, 1); kd(at, "box", K.brick, side*hx*0.5, y + 1.8, -hz*0.3, 0.55, 1.4, 0.55);
      if(P.bg) bgSet(n0, P.bg); return { w:2*hx + 3, d:2*hz + 5 };
    };

    // ---- E09 g7cis: the high cistern (main). A square brick water tower: three brick storeys (brick posts and walls, one TNT
    // each, plain floors), an arched door, round-headed windows and pilaster strips, a corbelled iron gallery on top, and on it
    // the riveted iron cistern (hard7v: a heavy piece counted until a bomb cracks it; under L.drop7 it shrugs off TNT while it
    // is up high, so it must come DOWN first). Its conical roof, ladder, float gauge and overflow pipe are decor on the cistern.
    V5_PARTS.g7cis = function(P){
      var n0 = blocks.length, hx = P.hx || 3.0, SH = P.sh || 4.0, n = P.n || 3, y = 0, s, sts = [], side = P.side || 1;
      var base = addBlock(0, -0.25, 0, 2*hx + 6, 0.5, 2*hx + 7, "base", {anchor:true}); kd(base, "box", K.lawn, 0, 0.03, 0.5, 2*hx + 5.6, 0.06, 2*hx + 6.6); kd(base, "box", K.path, 0, 0.07, hx + 2.0, 1.8, 0.04, 3.4);
      for(s = 0; s < n; s++){ var hs = hx - 0.15*s;
        var st = H.boxSt({ y0:y, h:SH, hx:hs, hz:hs, nx:3, nz:3, pw:s ? 0.85 : 1.0, mw:s ? 0.75 : 0.9, fl:s, MT:api.mat("brick"), deck:"mdB", skin:"wall", wall:"bkw", dk:0.4, tp:K.brick, td:K.brickD, tw:s % 2 ? K.brick : K.brickL });
        plainDeck(st.decks, "mdB"); sts.push(st);
        // upper storeys: RC posts clad in brick (g7bk) and their own wall key, so a TNT on the cistern does not wreck the storey under it
        if(s > 0 && P.rcUp !== 0){ st.piers.forEach(function(p){ setKey(p, "g7bk", K.brick); }); st.walls.forEach(function(w){ setKey(w, "g7bkw"); }); }
        st.walls.forEach(function(w, j){ var L2 = 2*Math.max(w.half[0], w.half[2]);
          if(s === 0) onF(w, "box", K.stoneD, 0, -SH*0.42, L2, 0.45, 0.08);
          if(s === 0 && w.a1face === "z+" && Math.abs(w.spawn.x) < 0.1 + hs){ if(j % 2 === 0){ onF(w, "box", K.greenD, 0, -0.5, 1.0, 2.3, 0.08); onD(w, K.greenD, 0, 0.65, 1.0, 0.08); onD(w, K.cream, 0, 0.68, 1.3, 0.05); } else archWin(w, 0, 0.2, 0.8, 1.6, true); }
          else archWin(w, 0, 0.25, 0.7, 1.5, (j + s) % 3 === 0);
          for(var q = 0; q < 3; q++) onF(w, "ibox", K.brickD, 0, -1.3 + q*0.6, L2, 0.04, 0.07); });
        st.piers.forEach(function(p){ if(Math.abs(p.a1x) > hs - 1 && Math.abs(p.a1z) > hs - 1) kd(p, "box", K.brickD, p.spawn.x, y + SH/2 - 0.2, p.spawn.z, 2*p.half[0] + 0.12, SH - 0.4, 2*p.half[2] + 0.12); });   // corner pilasters
        kd(st.decks[0], "box", K.stone, 0, y + SH - 0.15, 0, 2*hs + 0.3, 0.25, 2*hs + 0.3);   // string course
        kd(st.decks[0], "lit", K.warm, 0, y + SH - 0.6, 0, 0.8, 0.08, 0.8);
        y += SH; }
      // the corbelled iron gallery (decor on the top deck) and the cistern on it
      var top = sts[n - 1].decks[0], ht = hx - 0.15*(n - 1);
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function(q){ for(var e = -2; e <= 2; e++) kd(top, "box", K.brickD, q[0] ? q[0]*(ht + 0.15) : e*ht*0.42, y - 0.35, q[1] ? q[1]*(ht + 0.15) : e*ht*0.42, 0.4, 0.4, 0.4); });
      kd(top, "box", K.iron, 0, y + 0.05, 0, 2*ht + 0.8, 0.12, 2*ht + 0.8);
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function(q){ kd(top, "box", K.iron, q[0]*(ht + 0.35), y + 0.75, q[1]*(ht + 0.35), q[0] ? 0.06 : 2*ht + 0.75, 0.06, q[0] ? 2*ht + 0.75 : 0.06);
        for(var e = -3; e <= 3; e++) kd(top, "ibox", K.iron, q[0] ? q[0]*(ht + 0.35) : e*(ht + 0.3)/3, y + 0.42, q[1] ? q[1]*(ht + 0.35) : e*(ht + 0.3)/3, 0.05, 0.7, 0.05); });
      var ST = P.stand || 0; if(ST){ [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(function(q){ var lg = mem("steel", q[0]*1.3, y + ST/2, q[1]*1.3, 0.36, ST - 0.02, 0.36, n, null, null, K.iron); lg.tint = K.iron;
        bar(lg, K.iron, q[0]*1.3, y + 0.2, q[1]*1.3, -q[0]*0.2, y + ST - 0.2, q[1]*1.3, 0.1); bar(lg, K.iron, q[0]*1.3, y + 0.2, q[1]*1.3, q[0]*1.3, y + ST - 0.2, -q[1]*0.2, 0.1); }); y += ST; }
      var CW = P.cw || 3.3, CH = P.ch || 3.4, CD = P.cd || 4.6, ci = mem(P.cisKey || "hard7v", 0, y + CH/2 + 0.02, 0, CW, CH, CW, n, null, null, 0x56606C); ci.tint = 0x56606C;
      kd(ci, "cyl", 0x66727E, 0, y + CH/2 + 0.02, 0, CD, CH - 0.05, CD); for(var bb = 0; bb < 4; bb++) kd(ci, "cyl", K.iron, 0, y + 0.3 + bb*(CH - 0.5)/3, 0, CD + 0.07, 0.09, CD + 0.07);
      for(var rv = 0; rv < 16; rv++){ var an = rv*Math.PI/8; kd(ci, "ibox", K.iron, Math.sin(an)*(CD/2 + 0.02), y + CH/2, Math.cos(an)*(CD/2 + 0.02), 0.05, CH - 0.4, 0.05); }   // riveted seams
      kd(ci, "cone", K.iron, 0, y + CH + 0.45, 0, CD + 0.2, 0.9, CD + 0.2); kd(ci, "icyl", K.iron, 0, y + CH + 1.1, 0, 0.5, 0.4, 0.5); kd(ci, "ibush", K.gold, 0, y + CH + 1.45, 0, 0.3, 0.3, 0.3);
      kd(ci, "box", K.cream, 0, y + CH*0.55, CD/2 + 0.02, 1.8, 0.7, 0.05); kd(ci, "box", K.red, 0, y + CH*0.55, CD/2 + 0.05, 1.5, 0.12, 0.04);   // a painted band
      for(var l = 0; l < 6; l++) kd(ci, "ibox", K.iron, side*(CD/2 + 0.1), y + 0.3 + l*0.42, 0.9, 0.05, 0.05, 0.6);   // the ladder rungs
      kd(ci, "ibox", K.iron, side*(CD/2 + 0.1), y + CH/2, 0.6, 0.05, CH, 0.05); kd(ci, "ibox", K.iron, side*(CD/2 + 0.1), y + CH/2, 1.2, 0.05, CH, 0.05);
      kd(ci, "icyl", K.white, -side*(CD/2 + 0.12), y + CH*0.5, 0.0, 0.3, CH*0.7, 0.3); kd(ci, "ibox", K.ink, -side*(CD/2 + 0.3), y + CH*0.6, 0.0, 0.04, 0.2, 0.16);   // the float gauge
      if(P.bg) bgSet(n0, P.bg); LV7.g7info = Object.assign(LV7.g7info || {}, { cis:{ top:y + CH + 1.5, members:blocks.length - n0, cis:blocks.indexOf(ci) } });
      return { w:2*hx + 6, d:2*hx + 7 };
    };
    // ---- E09 g7pump: a pump house (easy): a brick engine room with tall arched windows on brick posts, a light slate roof body
    // with a louvred ridge vent, a slender iron stack and a flywheel inside (decor), a pipe towards the tower.
    V5_PARTS.g7pump = function(P){
      var n0 = blocks.length, hx = P.hx || 2.8, hz = P.hz || 3.6, PH = P.ph || 4.6, side = P.side || 1;
      var base = addBlock(0, -0.25, 0, 2*hx + 3, 0.5, 2*hz + 4, "base", {anchor:true}); kd(base, "box", K.lawn, 0, 0.03, 0.5, 2*hx + 2.6, 0.06, 2*hz + 3.6);
      var g = H.boxSt({ y0:0, h:PH, hx:hx, hz:hz, nx:2, nz:3, pw:0.75, mw:0.65, fl:0, MT:api.mat("brick"), deck:"mdW", skin:"wall", wall:"bkw", dk:0.3, tp:K.brick, td:K.woodD, tw:K.brickL });
      g.walls.forEach(function(w, j){ var L2 = 2*Math.max(w.half[0], w.half[2]); onF(w, "box", K.stoneD, 0, -PH*0.42, L2, 0.4, 0.08);
        if(w.a1face === "z+"){ onF(w, "box", K.greenD, 0, -0.6, 1.2, 2.4, 0.08); onD(w, K.greenD, 0, 0.6, 1.2, 0.08); } else archWin(w, 0, 0.3, Math.min(1.0, L2*0.45), 2.0, j % 2 === 0); });
      var fd = g.decks[0]; kd(fd, "cyl", K.iron, 0, 1.6, -0.4, 2.4, 0.3, 2.4, Math.PI/2, 0, 0); kd(fd, "ibox", K.green, 0, 0.6, -0.4, 1.6, 1.2, 2.0); kd(fd, "lit", K.lit, 0, PH - 0.7, 0, 0.6, 0.3, 0.6);
      var at = mem("g7roofL", 0, PH + 0.45, 0, 2*hx - 0.1, 0.9, 2*hz - 0.1, 1, null, null, K.slate); at.tint = K.slate;
      slopes(at, 0, 0, PH + 0.9, hx + 0.1, hz + 0.1, 1.4, K.slate, K.slateD, 0);
      [-1, 1].forEach(function(sz){ kd(at, "prism", K.brick, 0, PH + 0.9 + 0.7, sz*(hz - 0.1), 0.16, 1.4, 2*hx - 0.1, 0, Math.PI/2, 0); });
      kd(at, "box", K.slateD, 0, PH + 2.45, 0, 0.9, 0.5, 2*hz - 2.0); kd(at, "box", K.slate, 0, PH + 2.75, 0, 1.2, 0.1, 2*hz - 1.8);
      kd(at, "icyl", K.iron, -side*hx*0.45, PH + 2.4, -hz*0.5, 0.45, 3.2, 0.45); kd(at, "icyl", K.iron, -side*hx*0.45, PH + 4.05, -hz*0.5, 0.6, 0.15, 0.6);
      // the main pipe from the pump house towards the tower (decor on the near wall)
      kd(H.near(g.walls, -side*hx, 0), "icyl", K.iron, -side*(hx + 0.5), 0.8, 1.2, 0.35, 1.6, 0.35); kd(base, "box", K.iron, -side*(hx + 1.2), 0.25, 1.2, 1.4, 0.3, 0.3);
      if(P.bg) bgSet(n0, P.bg); return { w:2*hx + 3, d:2*hz + 4 };
    };

    // ---- E10 g7term: the terminus head building (main). Ground storey = a booking-hall arcade on 8 legs (RC clad in brick, one
    // TNT each, tip rule with a hinge: two legs side by side and it falls that way), two brick storeys above (RC-in-brick posts
    // g7bk, brick walls g7bkw: a bomb on the upper face takes a wall, never the storey), a great arched window on the front,
    // a stepped gable parapet and a small lantern turret (no clock). Floors are plain (L.drop7 as plumbing).
    V5_PARTS.g7term = function(P){
      var n0 = blocks.length, hx = P.hx || 4.2, hz = P.hz || 4.0, LH = P.legH || 5.0, SH = 3.6, n = P.n || 2, y = 0, s, sts = [], side = P.side || 1;
      var base = addBlock(0, -0.25, 0, 2*hx + 5, 0.5, 2*hz + 7, "base", {anchor:true}); kd(base, "box", K.stone, 0, 0.03, 0.8, 2*hx + 4.6, 0.06, 2*hz + 6.6); kd(base, "box", K.cobble, 0, 0.07, 0, 2*hx + 0.6, 0.04, 2*hz + 0.6);
      var g = H.boxSt({ y0:0, h:LH, hx:hx, hz:hz, nx:3, nz:3, pw:1.1, mw:1.0, fl:0, MT:{ pier:"rc", deck:"mdB" }, deck:"mdB", skin:"open", dk:0.5, tp:K.brick, td:K.brickD });
      plainDeck(g.decks, "mdB");
      g.piers.forEach(function(p){ setKey(p, "rc", K.brick); kd(p, "box", K.stoneD, p.spawn.x, 0.35, p.spawn.z, 2*p.half[0] + 0.2, 0.7, 2*p.half[2] + 0.2); kd(p, "box", K.stone, p.spawn.x, LH - 0.85, p.spawn.z, 2*p.half[0] + 0.16, 0.3, 2*p.half[2] + 0.16);
        for(var q = 0; q < 4; q++) [-1, 1].forEach(function(e){ kd(p, "ibox", K.brickD, p.spawn.x, 1.1 + q*0.9, p.spawn.z + e*(p.half[2] + 0.01), 2*p.half[0] - 0.1, 0.05, 0.03); }); });
      LV7.g7tip = tipOf(g, P.hold != null ? P.hold : 2.0);
      g.decks.forEach(function(d){ kd(d, "box", K.stone, d.spawn.x, LH - 0.2, d.spawn.z, 2*d.half[0] + 0.2, 0.3, 2*d.half[2] + 0.2); kd(d, "lit", K.warm, d.spawn.x, LH - 0.7, d.spawn.z, 1.0, 0.08, 1.0); });
      // the booking hall under the arcade: ticket windows, benches, a departure board (decor on the yard: it stays)
      kd(base, "ibox", K.woodD, 0, 1.2, -hz + 1.2, 2*hx - 3, 2.4, 0.5); for(var t = -1; t <= 1; t++) kd(base, "lit", K.lit, t*1.6, 1.5, -hz + 1.47, 0.8, 0.7, 0.04);
      kd(base, "ibox", K.ink, 0, 3.4, -hz + 1.2, 2.6, 0.8, 0.1); kd(base, "ibox", K.gold, 0, 3.4, -hz + 1.27, 2.3, 0.5, 0.04);
      [-1, 1].forEach(function(e){ kd(base, "ibox", K.wood, e*1.8, 0.45, 0.6, 2.0, 0.15, 0.5); });
      [[0, 1], [0, -1], [1, 0], [-1, 0]].forEach(function(q){ for(var e = -1; e <= 1; e += 2){ var u = e*hx/2*(q[0] ? hz/hx : 1), X = !!q[0], d = H.near(g.decks, X ? q[0]*hx : u, X ? u : q[1]*hz), sp = (X ? hz : hx) - 1.05;
        kd(d, "box", K.brick, X ? q[0]*(hx - 0.1) : u, LH - 0.75, X ? u : q[1]*(hz - 0.1), X ? 0.2 : sp, 0.6, X ? sp : 0.2); arch(d, X, X ? q[0]*hx : q[1]*hz, u, LH - 1.05, sp); } });
      // a corbelled arch head (two brick steps in each top corner of the opening and a cream keystone, no cut-outs)
      function arch(h, X, f, u, yt, w){ var sg = Math.sign(f) || 1, fc = f - sg*0.1;
        [-1, 1].forEach(function(e){ [[0.5, 0.18, 0], [0.32, 0.08, 0.5]].forEach(function(q){ var a = u + e*(w/2 - w*q[1]/2), yy = yt - q[2] - q[0]/2; kd(h, "box", K.brick, X ? fc : a, yy, X ? a : fc, X ? 0.2 : w*q[1], q[0], X ? w*q[1] : 0.2); }); });
        kd(h, "box", K.cream, X ? f + sg*0.03 : u, yt - 0.2, X ? u : f + sg*0.03, X ? 0.08 : 0.36, 0.42, X ? 0.36 : 0.08); }
      y = LH;
      for(s = 0; s < n; s++){
        var st = H.boxSt({ y0:y, h:SH, hx:hx, hz:hz, nx:3, nz:3, pw:0.85, mw:0.7, fl:s + 1, MT:api.mat("brick"), deck:"mdB", skin:"wall", wall:"bkw", dk:0.4, tp:K.brick, td:K.brickD, tw:s % 2 ? K.brick : K.brickL });
        st.piers.forEach(function(p){ setKey(p, "g7bk", K.brick); }); st.walls.forEach(function(w){ setKey(w, "g7bkw"); }); plainDeck(st.decks, "mdB"); sts.push(st);
        st.walls.forEach(function(w, j){ var L2 = 2*Math.max(w.half[0], w.half[2]);
          if(w.a1face === "z+") { onF(w, "box", K.cream, 0, -0.1, L2*0.62, SH - 0.7, 0.06); onF(w, "box", K.glass, 0, -0.1, L2*0.52, SH - 0.9, 0.08); for(var m = -2; m <= 2; m++) onF(w, "ibox", K.white, m*L2*0.1, -0.1, 0.05, SH - 0.9, 0.1);
            onF(w, "ibox", K.white, 0, 0.3, L2*0.52, 0.05, 0.1); if((j + s) % 2) onF(w, "lit", K.lit, 0, -0.3, L2*0.35, 1.2, 0.1); }
          else archWin(w, 0, 0.2, Math.min(0.9, L2*0.4), 1.7, (j + s) % 3 === 0);
          onF(w, "box", K.stone, 0, SH*0.42 - 0.1, L2, 0.18, 0.08); });
        st.piers.forEach(function(p){ if(Math.abs(p.a1x) > hx - 1 && Math.abs(p.a1z) > hz - 1) kd(p, "box", K.stone, p.spawn.x, y + SH/2 - 0.2, p.spawn.z, 2*p.half[0] + 0.12, SH - 0.4, 2*p.half[2] + 0.12); });   // stone quoins
        kd(st.decks[0], "lit", K.warm, 0, y + SH - 0.6, 0, 0.8, 0.08, 0.8);
        y += SH; }
      // the great arch over the front (decor across the upper storeys' front walls), the stepped gable parapet, the turret
      var fw = sts[n - 1].walls.filter(function(w){ return w.a1face === "z+"; }), fh = fw.length ? fw[0] : sts[n - 1].decks[0];
      kd(fh, "cyl", K.cream, 0, y - 1.2, hz + 0.08, 2*hx - 1.6, 0.12, 2*hx - 1.6, Math.PI/2, 0, 0); kd(fh, "cyl", K.glass, 0, y - 1.2, hz + 0.12, 2*hx - 2.2, 0.08, 2*hx - 2.2, Math.PI/2, 0, 0);
      for(var r2 = -3; r2 <= 3; r2++) kd(fh, "ibox", K.white, r2*(hx - 1.1)/3.5, y - 1.2, hz + 0.17, 0.06, 2*hx - 2.4 - Math.abs(r2)*0.6, 0.05);
      var td = sts[n - 1].decks; kd(H.near(td, 0, 0), "box", K.stone, 0, y + 0.1, 0, 2*hx + 0.4, 0.25, 2*hz + 0.4);
      var gab = [-1, 1].map(function(sz){ if(!P.heavy) return H.near(td, 0, sz*hz); var gb = mem("hard7v", 0, y + 1.1, sz*(hz - 0.35), 2*hx - 0.6, 2.2, 0.6, n + 1, null, null, K.brickL); gb.tint = K.brickL; return gb; });
      [-1, 1].forEach(function(sz, gi){ for(var k = 0; k < 4; k++){ var w2 = 2*hx - k*1.8; kd(gab[gi], "box", K.brickL, 0, y + 0.5 + k*0.55, sz*(hz - 0.2), w2, 0.55, 0.3); kd(gab[gi], "box", K.stone, 0, y + 0.8 + k*0.55, sz*(hz - 0.2), w2 + 0.1, 0.08, 0.36); } });
      var tdk = H.near(td, side*hx*0.5, 0); if(P.heavy){ tdk = mem("hard7v", side*hx*0.5, y + 0.9, -0.8, 1.6, 1.8, 1.6, n + 1, null, null, K.cream); tdk.tint = K.cream; } H.oct(tdk, K.cream, y + 0.25, 1.6, 0.9, side*hx*0.5, -0.8); H.oct(tdk, K.glass, y + 0.6, 1.0, 0.82, side*hx*0.5, -0.8); kd(tdk, "lit", K.lit, side*hx*0.5, y + 1.1, -0.8, 1.0, 0.7, 1.0);
      kd(tdk, "cone", K.copper, side*hx*0.5, y + 2.4, -0.8, 2.1, 1.2, 2.1); kd(tdk, "icyl", K.iron, side*hx*0.5, y + 3.3, -0.8, 0.07, 0.8, 0.07); kd(tdk, "ibox", K.gold, side*hx*0.5 + 0.2, y + 3.5, -0.8, 0.5, 0.14, 0.04);
      if(P.bg) bgSet(n0, P.bg); LV7.g7info = Object.assign(LV7.g7info || {}, { term:{ top:y + 3.5, members:blocks.length - n0 } });
      return { w:2*hx + 5, d:2*hz + 7 };
    };
    // ---- E10 g7shed: the iron-and-glass train shed (the target). P.n bays along x, each its own bond group: four brick piers,
    // a light glazed roof body (g7roofD: breaks up when it lands) with an arched iron-and-glass roof as decor, a brick end screen
    // with a fan window on the outer bay, platforms and a waiting train inside (decor on the yard).
    V5_PARTS.g7shed = function(P){
      var n0 = blocks.length, nb = P.n || 4, bw = P.bw || 2.3, hz = P.hz || 5.5, PH = P.ph || 6.0, gap = 0.1, W = nb*2*bw + (nb - 1)*gap, x0 = -W/2 + bw, k, side = P.side || 1;
      var base = addBlock(0, -0.25, 0, W + 3, 0.5, 2*hz + 5, "base", {anchor:true}); kd(base, "box", K.cobble, 0, 0.03, 0.5, W + 2.6, 0.06, 2*hz + 4.6);
      [-1, 1].forEach(function(e){ kd(base, "box", K.stone, 0, 0.35, e*2.6, W + 1, 0.7, 1.6); kd(base, "box", K.white, 0, 0.71, e*2.6 + e*0.75, W + 1, 0.02, 0.1); });   // two platforms
      kd(base, "box", K.iron, 0, 0.1, -0.5, W + 2.6, 0.05, 0.1); kd(base, "box", K.iron, 0, 0.1, 0.5, W + 2.6, 0.05, 0.1);   // the track
      // the train standing in the shed (decor on the yard: it stays)
      // the train standing in the shed: with P.train the coaches are heavy members (hard7v: they ride out the fall and count until a
      // bomb cracks them, the E01-E06 heavy pieces); otherwise decor on the yard
      var NC = Math.min(P.cars || 3, nb), CL = Math.min(4.6, (W - 1)/NC - 0.4);
      for(var c = 0; c < NC; c++){ var tx = -W/2 + 0.5 + (c + 0.5)*(W - 1)/NC, th = P.train ? mem(P.train, tx, 1.14, 0, CL, 2.2, 2.0, 0, null, null, c ? K.green : K.red) : base;
        if(P.train) th.tint = c ? K.green : K.red;
        kd(th, "ibox", c ? K.green : K.red, tx, 1.14, 0, CL + 0.1, 2.2, 2.2); kd(th, "ibox", K.cream, tx, 1.94, 0, CL + 0.1, 0.5, 2.24); kd(th, "ibox", K.cream, tx, 2.38, 0, CL - 0.3, 0.36, 1.9);
        kd(th, "ibox", K.ink, tx, 0.22, 0, CL - 0.4, 0.4, 1.8); for(var wv = -1; wv <= 1; wv++) kd(th, "lit", K.lit, tx + wv*CL*0.3, 1.64, 1.13, CL*0.2, 0.5, 0.04); }
      for(k = 0; k < nb; k++){ var cx = x0 + k*(2*bw + gap), nS = blocks.length, outer = side > 0 ? k === nb - 1 : k === 0;
        var g = H.boxSt({ y0:0, h:PH, hx:bw, hz:hz, cx:cx, nx:2, nz:2, pw:P.pw || 0.8, mw:P.pw || 0.7, fl:0, MT:api.mat("brick"), deck:"mdW", skin:P.back ? { "z-":"wall", def:"open" } : { def:"open" }, wall:"bkw", dk:0.3, tp:K.brick, td:K.iron, tw:K.brickL });
        g.walls.forEach(function(w){ var L2 = 2*Math.max(w.half[0], w.half[2]); onF(w, "box", K.stoneD, 0, -PH*0.42, L2, 0.45, 0.08); archWin(w, 0, 0.6, Math.min(1.6, L2*0.5), 2.6, (k % 2) === 0); });
        plainDeck(g.decks, "mdW");
        g.piers.forEach(function(p){ kd(p, "box", K.stoneD, p.spawn.x, 0.3, p.spawn.z, 1.0, 0.6, 1.0); kd(p, "box", K.stone, p.spawn.x, PH - 0.6, p.spawn.z, 1.0, 0.25, 1.0);
          kd(p, "ibox", K.iron, p.spawn.x, PH - 0.95, p.spawn.z - Math.sign(p.a1z)*0.7, 0.14, 0.14, 1.2); });   // the iron bracket
        g.decks.forEach(function(d){ kd(d, "lit", K.warm, d.spawn.x, PH - 0.6, 0, 0.6, 0.3, 0.6); kd(d, "icyl", K.iron, d.spawn.x, PH - 1.0, 0, 0.04, 0.8, 0.04); });
        // the roof body and the arched glass roof on it (decor inside its outline: a barrel of 5 glazed strips and iron ribs)
        var RH = 1.4, at = mem(P.roofKey || "g7roofD", cx, PH + RH/2, 0, 2*bw - 0.1, RH, 2*hz - 0.1, 1, null, null, K.iron); at.tint = K.iron;
        for(var a = 0; a < 6; a++){ var t0 = -Math.PI/2 + (a + 0.5)*Math.PI/6, zz = Math.sin(t0)*(hz - 0.2), yy = PH + 0.2 + Math.cos(t0)*(RH + 0.4), seg = (hz - 0.2)*Math.PI/6 + 0.05;
          kq(at, "box", a % 2 ? K.glass : 0xB7D3E2, cx, yy, zz, 2*bw - 0.12, 0.08, seg, 0, t0, 0); }
        kd(at, "box", K.iron, cx, PH + RH + 0.45, 0, 2*bw - 0.05, 0.14, 0.3); [-1, 1].forEach(function(e){ kd(at, "box", K.iron, cx + e*(bw - 0.1), PH + RH*0.55, 0, 0.12, RH*0.9, 2*hz - 0.3); });
        if(outer){ var ex = side*(bw - 0.06); kd(at, "box", K.brickL, cx + ex, PH + 0.2, 0, 0.16, 0.6, 2*hz - 0.1); kd(at, "cyl", K.cream, cx + ex + side*0.06, PH + 0.3, 0, 2*hz - 2.4, 0.08, 2*hz - 2.4, 0, 0, Math.PI/2); kd(at, "cyl", K.glass, cx + ex + side*0.09, PH + 0.3, 0, 2*hz - 3.0, 0.06, 2*hz - 3.0, 0, 0, Math.PI/2); }
        bgSet(nS, (P.bg0 || 141) + k); }
      LV7.g7info = Object.assign(LV7.g7info || {}, { shed:{ members:blocks.length - n0, W:W } });
      return { w:W + 3, d:2*hz + 5 };
    };
  })();

  // ==================================================================================================================
  // g7 OLD POLISH (Agents-Game, 22/11, Khai: "the old levels 1 to ten-something to the easy-pack quality"). The early play slots
  // (ORDER22 1-19, not the Hard / boss) rebuilt with their own heroes; each keeps its slot, lesson and intro role
  // (city-blast/levels-gd/OLD-POLISH.md). Only the materials introduced by that slot are used (no glass member, no dark pier,
  // no drums before their cards); windows are decor. Every load-bearing box is a member; every detail is decor on a member.
  //   O01 "Ranger Lookout" (slot 1, wood): g7oLook (a timber fire-lookout tower on four legs, a cab and a catwalk on top),
  //       g7oShed (an open woodshed with log stacks: the tower falls across it), g7oCabin (a two-storey log cabin).
  // ==================================================================================================================
  (function(){
    if(typeof A1 === "undefined" || !A1.h || typeof M14 === "undefined") return;
    var H = A1.h, kd = l6KdAdd, api = M14.api, kq = H.kq, bar = H.bar, mem = H.mem;
    var K = { wood:0xC58B55, woodD:0x8A5A33, woodL:0xE2B77E, log:0xA8703F, logD:0x7A4E2A, logE:0xD9A86C, bark:0x6B4528, green:0x3F6F55, greenD:0x2E5541,
      red:0xB8432F, redD:0x8E3324, cream:0xF1E6CC, white:0xF6F2EA, glass:0x9FC3D6, glassD:0x6E97AD, lit:0xFFD98A, warm:0xFFF1C4, roof:0x5B4A3E, roofD:0x45372D,
      shingle:0x7C5A3C, shingleD:0x5E4330, stone:0xB9B2A6, stoneD:0x8E877C, iron:0x3B4048, gravel:0xB8AE9B, gravelD:0x9C927F, lawn:0x7FB069, leaf:0x4F8F46, leafD:0x3C7438,
      trunk:0x7A5236, gold:0xE8B23A, ink:0x2B2F36, flag:0xD8442E,
      brick:0xB5543A, brickD:0x8C3E2B, brickL:0xC9714E, tile:0xB0503A, tileD:0x8E3E2D,
      conc:0xD6D3CC, concD:0x9EA2A8, concL:0xE6E3DC, apron:0xA9ADB3, navy:0x2F4A6E, orange:0xE0863F,
      creamD:0xD8CBAE, hose:0xB8432F, slate:0x4F5A68, slateD:0x3B4450, yellow:0xE8B23A, cranePaint:0x4E8FB0, cranePaintD:0x376C86,
      water:0x4C8DB0, waterD:0x3A7596, hull:0x7C4A2E, hullD:0x5A3420, coal:0x6E6A66, coalCart:0x5A5F66, headPaint:0x9B3B2E, headPaintD:0x742C22,
      sand:0xE3D3A8, seaGreen:0x5FA89A, monoRoof:0x3F93A8, gasPaint:0x5E7F6A, gasPaintD:0x45604F, gasBell:0x8A9A90, screenW:0xF4F1E8, rcDark:0x6B6E74, rcDarkD:0x4F535A };
    var bgSet = function(n0, g){ for(var q = n0; q < blocks.length; q++) if(!blocks[q].anchor) blocks[q].bg = g; };
    var FN = { "z+":[0, 1], "z-":[0, -1], "x+":[1, 0], "x-":[-1, 0] };
    function onF(b, g, c, u, v, w, h, t){ var n = FN[b.a1face]; if(!n) return; var X = !!n[0]; t = t || 0.06; var d = (X ? b.half[0] : b.half[2]) + t/2;
      kd(b, g, c, b.spawn.x + (X ? n[0]*d : u), b.spawn.y + v, b.spawn.z + (X ? u : n[1]*d), X ? t : w, h, X ? w : t); }
    function setKey(p, key, tint){ p.key = key; p.def = MEMBERS[key]; p.hp = p.hp0 = MEMBERS[key].hp; if(tint != null) p.tint = tint; }
    function tree(host, x, z, s){ kd(host, "icyl", K.trunk, x, 1.1*s, z, 0.35*s, 2.2*s, 0.35*s); kd(host, "ibush", K.leaf, x, 2.9*s, z, 2.4*s, 2.2*s, 2.4*s); kd(host, "ibush", K.leafD, x + 0.4*s, 3.6*s, z - 0.3*s, 1.5*s, 1.4*s, 1.5*s); }
    function pine(host, x, z, s){ kd(host, "icyl", K.trunk, x, 0.9*s, z, 0.3*s, 1.8*s, 0.3*s); for(var q = 0; q < 3; q++) kd(host, "cone", q % 2 ? K.leafD : K.leaf, x, (2.0 + q*1.25)*s, z, (2.6 - q*0.7)*s, 1.9*s, (2.6 - q*0.7)*s); }
    // a window on a wall panel (decor glass: no glass member before the glass card): a frame, panes, a sill, two shutters
    function win(w, u, v, ww, hh, lit, shut){ onF(w, "box", K.white, u, v, ww + 0.22, hh + 0.22, 0.07); onF(w, "box", lit ? K.lit : K.glassD, u, v, ww, hh, 0.09);
      onF(w, "ibox", K.white, u, v, 0.06, hh, 0.11); onF(w, "ibox", K.white, u, v, ww, 0.06, 0.11); onF(w, "box", K.woodD, u, v - hh/2 - 0.12, ww + 0.4, 0.1, 0.16);
      if(shut) [-1, 1].forEach(function(s){ onF(w, "box", shut, u + s*(ww/2 + 0.28), v, 0.42, hh + 0.1, 0.08); }); }
    // horizontal log courses on a wall panel: the log-cabin look (darker joints, round log ends at the corners are on the posts)
    function logs(w, n, c, cD){ var L2 = 2*Math.max(w.half[0], w.half[2]), hh = 2*w.half[1]; for(var q = 0; q < n; q++){ var v = -hh/2 + (q + 0.5)*hh/n; onF(w, "ibox", q % 2 ? c : cD, 0, v, L2, hh/n*0.82, 0.05); } }
    // a light timber roof body (member, breaks on landing, one TNT) under pitched decor slopes; ridge along x (ax 1) or z
    function roofBody(cx, cz, y, hx, hz, h, fl, r, col, colD, ax, tint){
      var at = mem("g7roofL", cx, y + h/2, cz, 2*hx, h, 2*hz, fl, null, null, tint || col); at.tint = tint || col;
      var yt = y + h;
      if(ax){ var sl = Math.atan2(r, hz); [-1, 1].forEach(function(s){ kq(at, "box", s > 0 ? col : colD, cx, yt + r/2, cz + s*hz/2, 2*hx + 0.5, 0.22, Math.hypot(hz, r) + 0.3, 0, s*sl, 0); });
        kd(at, "box", colD, cx, yt + r + 0.02, cz, 2*hx + 0.6, 0.26, 0.34); [-1, 1].forEach(function(s){ kd(at, "prism", tint || col, cx + s*(hx - 0.06), yt + r/2, cz, 0.12, r, 2*hz, 0, 0, 0); }); }
      else { var sl2 = Math.atan2(r, hx); [-1, 1].forEach(function(s){ kq(at, "box", s > 0 ? col : colD, cx + s*hx/2, yt + r/2, cz, Math.hypot(hx, r) + 0.3, 0.22, 2*hz + 0.5, 0, 0, -s*sl2); });
        kd(at, "box", colD, cx, yt + r + 0.02, cz, 0.34, 0.26, 2*hz + 0.6); [-1, 1].forEach(function(s){ kd(at, "prism", tint || col, cx, yt + r/2, cz + s*(hz - 0.06), 0.12, r, 2*hx, 0, Math.PI/2, 0); }); }
      return at; }

    // ---- O01 g7oLook: a timber fire-lookout tower. Four splayed-looking legs (wpost) on a gravel pad; three open trestle storeys
    // with X-braces and a zig-zag stair (decor); a timber cab (wwall) with a window band all round, a catwalk and rail, a pyramid
    // shingle roof body (g7roofL) with a lightning rod, a flag and the fire-finder table inside. P.lh = leg storey height.
    V5_PARTS.g7oLook = function(P){
      var n0 = blocks.length, MT = api.mat("wood"), hx0 = P.hx || 2.8, LH = P.lh || 5.2, SH = P.sh || 3.4, nS = P.ns || 3, y = 0, s, sts = [];
      var base = addBlock(0, -0.25, 0, 2*hx0 + 5, 0.5, 2*hx0 + 5, "base", {anchor:true});
      kd(base, "box", K.gravel, 0, 0.03, 0, 2*hx0 + 4.6, 0.06, 2*hx0 + 4.6); kd(base, "box", K.gravelD, 0, 0.05, 0, 2*hx0 + 1.2, 0.04, 2*hx0 + 1.2);
      var hxs = [hx0]; for(s = 1; s <= nS; s++) hxs.push(Math.max(1.9, hx0 - s*0.2));
      for(s = 0; s <= nS; s++){ var hx = hxs[s], h = s ? SH : LH;
        var st = H.boxSt({ y0:y, h:h, hx:hx, hz:hx, nx:2, nz:2, pw:s ? 0.46 : (P.lw || 0.6), mw:0.46, fl:s, MT:MT, deck:"mdW", skin:"open", dk:0.3, tp:K.woodD, td:K.wood });
        sts.push(st);
        st.piers.forEach(function(p){ if(!s) kd(p, "box", K.stone, p.spawn.x, 0.3, p.spawn.z, 1.0, 0.6, 1.0);   // the stone footings
          kd(p, "ibox", K.wood, p.spawn.x, p.spawn.y, p.spawn.z, 2*p.half[0] + 0.04, 2*p.half[1] - 0.2, 0.08); });
        // X-braces on the four faces (decor on the two posts of that face: they go when a post goes)
        [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function(f){ var a = hx - 0.25, p1 = H.near(st.piers, f[0] ? f[0]*hx : -hx, f[1] ? f[1]*hx : -hx), p2 = H.near(st.piers, f[0] ? f[0]*hx : hx, f[1] ? f[1]*hx : hx);
          var X0 = f[0] ? f[0]*a : -a, Z0 = f[1] ? f[1]*a : -a, X1 = f[0] ? f[0]*a : a, Z1 = f[1] ? f[1]*a : a;
          bar(p1, K.woodD, X0, y + 0.45, Z0, X1, y + h - 0.6, Z1, 0.14); bar(p2, K.woodD, X1, y + 0.45, Z1, X0, y + h - 0.6, Z0, 0.14);
          kd(p1, "box", K.woodD, (X0 + X1)/2, y + h*0.5, (Z0 + Z1)/2, f[0] ? 0.12 : 2*a, 0.14, f[0] ? 2*a : 0.12); });
        // the zig-zag stair inside the trestle (decor on the deck above)
        var dk = st.decks[0]; if(s < nS){ for(var q = 0; q < 6; q++){ var t = q/5, sx = (s % 2 ? 1 : -1)*(hx*0.55 - t*hx*1.1); kd(dk, "ibox", K.woodL, sx, y + 0.4 + t*(h - 0.9), hx*0.3, 0.9, 0.1, 0.7); }
          kd(dk, "box", K.wood, 0, y + h - 0.15, 0, 2*hx + 0.25, 0.12, 2*hx + 0.25); }
        y += h; }
      // the cab: four corner posts and a wall panel per face (wwall), the window band (decor), a catwalk round it
      var hc = P.cab || 3.0, hxc = hxs[nS], cab = H.boxSt({ y0:y, h:hc, hx:hxc, hz:hxc, nx:2, nz:2, pw:0.4, mw:0.4, fl:nS + 1, MT:MT, deck:"mdW", skin:"wall", mat:"wood", wall:"wwall", dk:0.28, tp:K.woodD, td:K.woodD, tw:K.green });
      cab.walls.forEach(function(w, j){ var L2 = 2*Math.max(w.half[0], w.half[2]); onF(w, "box", K.greenD, 0, -hc*0.32, L2, 0.9, 0.06); onF(w, "box", K.cream, 0, -hc*0.12, L2, 0.1, 0.08);
        for(var q = -1; q <= 1; q++) win(w, q*L2/3.2, hc*0.15, L2/3.6, 1.05, j === 0 && q === 0, 0); });
      var c0 = cab.decks[0], cw = hxc + 0.85, dk0 = sts[nS].decks[0];
      kd(dk0, "box", K.woodL, 0, y - 0.08, 0, 2*cw, 0.16, 2*cw);   // the catwalk floor
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function(f){ var X = !!f[0]; kd(dk0, "box", K.white, f[0]*cw, y + 0.95, f[1]*cw, X ? 0.08 : 2*cw, 0.1, X ? 2*cw : 0.08); kd(dk0, "box", K.white, f[0]*cw, y + 0.5, f[1]*cw, X ? 0.06 : 2*cw, 0.06, X ? 2*cw : 0.06);
        for(var q = -2; q <= 2; q++) kd(dk0, "ibox", K.white, X ? f[0]*cw : q*cw/2.2, y + 0.48, X ? q*cw/2.2 : f[1]*cw, 0.07, 0.96, 0.07); });
      kd(c0, "ibox", K.woodL, 0, y + 0.55, 0, 1.0, 0.9, 1.0); kd(c0, "icyl", K.cream, 0, y + 1.05, 0, 0.9, 0.06, 0.9); kd(c0, "lit", K.lit, 0, y + hc - 0.5, 0, 0.5, 0.35, 0.5);   // the fire-finder table + lamp
      y += hc;
      // the pyramid shingle roof body (member) and its decor: eaves, the lightning rod, a wind vane, a flag on the catwalk
      var at = mem("g7roofL", 0, y + 0.35, 0, 2*hxc - 0.1, 0.7, 2*hxc - 0.1, nS + 2, null, null, K.shingle); at.tint = K.shingle;
      kd(at, "box", K.woodD, 0, y + 0.72, 0, 2*hxc + 1.7, 0.14, 2*hxc + 1.7); kd(at, "cone", K.shingle, 0, y + 1.75, 0, 2*hxc + 1.5, 2.0, 2*hxc + 1.5); kd(at, "cone", K.shingleD, 0, y + 2.6, 0, 1.1, 0.6, 1.1);
      kd(at, "icyl", K.iron, 0, y + 3.5, 0, 0.06, 1.6, 0.06); kd(at, "ibox", K.gold, 0.25, y + 3.9, 0, 0.6, 0.18, 0.04);
      kd(dk0, "icyl", K.white, cw, y + 0.8, cw, 0.08, 3.2, 0.08); kd(dk0, "ibox", K.flag, cw + 0.45, y + 1.95, cw, 0.9, 0.55, 0.03);
      LV7.g7info = Object.assign(LV7.g7info || {}, { look:{ members:blocks.length - n0, top:y + 3.5 } });
      if(P.bg) bgSet(n0, P.bg); return { w:2*hx0 + 5, d:2*hx0 + 5 };
    };
    // ---- O01 g7oShed: an open woodshed (the tower's landing): P.nx posts a side (wpost), a plank roof deck, a light gabled roof
    // body, stacked logs under it (decor on the deck: they go when it goes), a saw-horse and an axe block on the pad.
    V5_PARTS.g7oShed = function(P){
      var n0 = blocks.length, MT = api.mat("wood"), hx = P.hx || 5.0, hz = P.hz || 2.2, h = P.h || 3.2;
      var base = addBlock(0, -0.25, 0, 2*hx + 2.5, 0.5, 2*hz + 2.5, "base", {anchor:true}); kd(base, "box", K.gravel, 0, 0.03, 0, 2*hx + 2.1, 0.06, 2*hz + 2.1);
      var st = H.boxSt({ y0:0, h:h, hx:hx, hz:hz, nx:P.nx || 4, nz:2, pw:0.42, mw:0.38, fl:0, MT:MT, deck:"mdW", skin:{ "z-":"wall", def:"open" }, mat:"wood", wall:"wwall", dk:0.25, tp:K.woodD, td:K.woodD, tw:K.log, split:[2, 1] });
      st.walls.forEach(function(w){ logs(w, 6, K.log, K.logD); });
      st.decks.forEach(function(d, j){ for(var r = 0; r < 3; r++) for(var q = 0; q < 5 - r; q++){ var lx = d.spawn.x + (q - (4 - r)/2)*0.62, ly = 0.3 + r*0.52;
        kd(d, "icyl", K.log, lx, ly, -0.2, 0.55, 2*hz - 1.0, 0.55, Math.PI/2, 0, 0); kd(d, "icyl", K.logE, lx, ly, hz - 0.68, 0.5, 0.04, 0.5, Math.PI/2, 0, 0); } });
      roofBody(0, 0, h, hx - 0.05, hz - 0.05, 0.5, 1, 1.3, K.shingle, K.shingleD, 1, K.woodD);
      kd(base, "ibox", K.woodD, hx*0.6, 0.45, hz + 0.9, 1.2, 0.12, 0.3); [-1, 1].forEach(function(s){ kd(base, "ibox", K.woodD, hx*0.6 + s*0.5, 0.25, hz + 0.9, 0.08, 0.5, 0.4); });   // the saw-horse
      kd(base, "icyl", K.log, -hx*0.6, 0.35, hz + 0.9, 0.7, 0.7, 0.7); kd(base, "ibox", K.iron, -hx*0.6, 0.85, hz + 0.9, 0.06, 0.5, 0.06);
      if(P.bg) bgSet(n0, P.bg); return { w:2*hx + 2.5, d:2*hz + 2.5 };
    };
    // ---- O01 g7oCabin: a two-storey log cabin (a ranger's house): log walls (wwall with log courses), corner posts with log ends,
    // windows with shutters, a door under a porch roof, an upper storey and a gabled shingle roof body, a stone chimney (decor
    // on the side wall), a pine beside it. P.side = which side the chimney / pine go (mirror pair).
    V5_PARTS.g7oCabin = function(P){
      var n0 = blocks.length, MT = api.mat("wood"), hx = P.hx || 3.2, hz = P.hz || 2.8, side = P.side || 1, y = 0, nb = P.nb || 2, sts = [], s;
      var base = addBlock(0, -0.25, 0, 2*hx + 4, 0.5, 2*hz + 4, "base", {anchor:true}); kd(base, "box", K.gravel, 0, 0.03, 0, 2*hx + 3.6, 0.06, 2*hz + 3.6);
      kd(base, "box", K.stone, 0, 0.12, 0, 2*hx + 0.3, 0.24, 2*hz + 0.3);
      for(s = 0; s < nb; s++){ var h = s ? 3.2 : 3.6;
        var st = H.boxSt({ y0:y, h:h, hx:hx, hz:hz, nx:3, nz:2, pw:0.5, mw:0.44, fl:s, MT:MT, deck:"mdW", skin:"wall", mat:"wood", wall:"wwall", dk:0.3, tp:K.logD, td:K.woodD, tw:K.log });
        sts.push(st);
        st.piers.forEach(function(p){ for(var q = 0; q < 5; q++) kd(p, "icyl", K.logE, p.spawn.x, y + 0.35 + q*(h - 0.6)/5, p.spawn.z, 0.62, 0.62, 0.62, 0, 0, Math.PI/2); });
        st.walls.forEach(function(w, j){ var L2 = 2*Math.max(w.half[0], w.half[2]); logs(w, 7, K.log, K.logD);
          if(s === 0 && w.a1face === "z+" && Math.abs(w.spawn.x) < 0.6*hx + 0.01 && j % 2 === 0){ onF(w, "box", K.redD, 0, -0.45, 1.0, 2.2, 0.08); onF(w, "box", K.white, 0, 0.7, 1.2, 0.12, 0.1); }
          else if(L2 > 1.2) win(w, 0, 0.15, Math.min(1.1, L2*0.4), 1.1, (j + s) % 3 === 0, K.green); });
        kd(st.decks[0], "lit", K.lit, 0, y + h - 0.65, 0, 0.6, 0.3, 0.6);
        y += h; }
      // the porch on the front (decor on the ground storey's front walls / posts): a floor, two posts, a lean-to shingle roof
      var fw = sts[0].walls.filter(function(w){ return w.a1face === "z+"; }), fp = H.near(sts[0].piers, 0, hz);
      kd(fp, "box", K.woodL, 0, 0.22, hz + 0.75, 2*hx - 0.4, 0.16, 1.4); [-1, 1].forEach(function(e){ kd(H.near(sts[0].piers, e*hx, hz), "icyl", K.woodD, e*(hx - 0.6), 1.5, hz + 1.3, 0.2, 2.6, 0.2); });
      fw.forEach(function(w){ kq(w, "box", K.shingle, w.spawn.x, 2.95, hz + 0.75, 2*w.half[0] + 0.3, 0.14, 1.7, 0, 0.32, 0); });
      // the gabled roof body (ridge along x), the stone chimney on the side wall (decor on the side wall panels)
      var at = roofBody(0, 0, y, hx - 0.02, hz - 0.02, 0.6, nb, 2.2, K.shingle, K.shingleD, 1, K.log);
      var sw = H.near(sts[nb - 1].walls.filter(function(w){ return w.a1face === (side > 0 ? "x+" : "x-"); }).concat(sts[nb - 1].piers), side*hx, 0);
      kd(sw, "box", K.stone, side*(hx + 0.4), y/2 + 0.7, 0, 0.8, y + 1.0, 1.2); kd(sw, "box", K.stoneD, side*(hx + 0.4), y + 1.25, 0, 0.95, 0.2, 1.35);
      for(var q = 0; q < 6; q++) kd(sw, "ibox", K.stoneD, side*(hx + 0.81), 0.6 + q*y/6, (q % 2 ? 0.3 : -0.3), 0.03, 0.08, 0.5);
      pine(base, side*(hx + 1.0), -hz - 0.2, 1.1); kd(base, "ibox", K.woodD, -side*(hx + 0.5), 0.4, hz + 0.6, 0.9, 0.8, 0.6);
      if(P.bg) bgSet(n0, P.bg); return { w:2*hx + 4, d:2*hz + 4 };
    };
    // ---- O02 g7oOast: a square brick hop kiln (oast). An open brick arcade on 8 piers (bk; the cart way, arch heads and spandrels
    // are decor on the deck), the kiln storey of brick walls (bkw) with string courses and a loading door + hoist beam, a light
    // roof body (g7roofL) under a tall tiled pyramid and the white timber cowl with its vane (decor).
    V5_PARTS.g7oOast = function(P){
      var n0 = blocks.length, MT = api.mat("brick"), hx = P.hx || 3.0, AH = P.ah || 5.0, KH = P.kh || 5.0, y = 0;
      var base = addBlock(0, -0.25, 0, 2*hx + 4, 0.5, 2*hx + 4, "base", {anchor:true}); kd(base, "box", K.gravel, 0, 0.03, 0, 2*hx + 3.6, 0.06, 2*hx + 3.6);
      var g = H.boxSt({ y0:0, h:AH, hx:hx, hz:hx, nx:3, nz:3, pw:0.95, mw:0.85, fl:0, MT:MT, deck:"mdB", skin:"open", dk:0.4, tp:K.brick, td:K.brickD });
      g.piers.forEach(function(p){ kd(p, "box", K.stoneD, p.spawn.x, 0.3, p.spawn.z, 2*p.half[0] + 0.14, 0.6, 2*p.half[2] + 0.14); kd(p, "box", K.cream, p.spawn.x, AH - 0.65, p.spawn.z, 2*p.half[0] + 0.12, 0.22, 2*p.half[2] + 0.12);
        for(var q = 0; q < 6; q++) kd(p, "ibox", K.brickD, p.spawn.x, 0.9 + q*0.62, p.spawn.z, 2*p.half[0] + 0.02, 0.05, 2*p.half[2] + 0.02); });
      // the arch heads over the eight openings (decor on the deck: brick steps under a cream keystone)
      g.decks.forEach(function(d){ [[0, 1], [0, -1], [1, 0], [-1, 0]].forEach(function(f){ var X = !!f[0];
        [-1, 1].forEach(function(s){ var u = s*hx/2, fx = X ? f[0]*(hx - 0.2) : u, fz = X ? u : f[1]*(hx - 0.2);
          kd(d, "box", K.brick, fx, AH - 0.9, fz, X ? 0.4 : hx - 0.9, 0.5, X ? hx - 0.9 : 0.4);
          [-1, 1].forEach(function(e){ kd(d, "box", K.brick, X ? fx : u + e*(hx/2 - 0.75), AH - 1.45, X ? u + e*(hx/2 - 0.75) : fz, X ? 0.4 : 0.35, 0.6, X ? 0.35 : 0.4); });
          kd(d, "box", K.cream, X ? fx + f[0]*0.2 : u, AH - 1.0, X ? u : fz + f[1]*0.2, X ? 0.06 : 0.32, 0.5, X ? 0.32 : 0.06); }); }); });
      y = AH;
      var k = H.boxSt({ y0:y, h:KH, hx:hx, hz:hx, nx:3, nz:3, pw:0.8, mw:0.7, fl:1, MT:MT, deck:"mdB", skin:"wall", wall:"bkw", dk:0.35, tp:K.brickD, td:K.brickD, tw:K.brickL });
      k.walls.forEach(function(w, j){ var L2 = 2*Math.max(w.half[0], w.half[2]); onF(w, "box", K.cream, 0, KH*0.36, L2, 0.16, 0.08); onF(w, "box", K.brickD, 0, -KH*0.44, L2, 0.3, 0.06);
        for(var q = 0; q < 7; q++) onF(w, "ibox", K.brickD, 0, -KH*0.35 + q*KH*0.11, L2, 0.04, 0.04);
        if(w.a1face === "z+" && j % 2 === 0) { onF(w, "box", K.woodD, 0, 0.0, 1.3, 2.0, 0.1); onF(w, "box", K.wood, 0, 0.0, 1.1, 1.8, 0.14); onF(w, "box", K.cream, 0, 1.15, 1.6, 0.14, 0.12); }
        else if(L2 > 1.0) win(w, 0, 0.5, 0.7, 1.0, (j % 3) === 1, 0); });
      var kd0 = H.near(k.decks, 0, hx); kd(kd0, "box", K.woodD, -hx*0.25, y + KH - 0.2, hx + 0.7, 0.25, 0.25, 1.6); kd(kd0, "icyl", K.iron, -hx*0.25, y + KH - 0.9, hx + 1.4, 0.05, 1.2, 0.05);   // the hoist beam + rope
      kd(kd0, "lit", K.lit, 0, y + KH - 0.7, 0, 0.6, 0.3, 0.6);
      y += KH;
      // the roof body (member) + the tall tiled pyramid, a white sill band, the cowl (white timber hood on a post) and a vane
      var at = mem("g7roofL", 0, y + 0.4, 0, 2*hx - 0.1, 0.8, 2*hx - 0.1, 2, null, null, K.tile); at.tint = K.tile;
      kd(at, "box", K.white, 0, y + 0.82, 0, 2*hx + 0.5, 0.16, 2*hx + 0.5); var RH = P.rh || 5.4;
      kd(at, "cone", K.tile, 0, y + 0.9 + RH/2, 0, 2*hx + 0.4, RH, 2*hx + 0.4); for(var q = 1; q < 5; q++){ var s = 1 - q/5.2; kd(at, "cone", q % 2 ? K.tileD : K.tile, 0, y + 0.9 + RH*q/5 + 0.06, 0, (2*hx + 0.4)*s + 0.04, 0.12, (2*hx + 0.4)*s + 0.04); }
      var cy = y + 0.9 + RH; kd(at, "icyl", K.white, 0, cy - 0.2, 0, 0.9, 0.8, 0.9); kd(at, "box", K.white, 0, cy + 0.75, -0.15, 1.3, 1.3, 1.1); kd(at, "prism", K.white, 0, cy + 1.6, -0.15, 1.3, 0.8, 1.2, 0, Math.PI/2, 0);
      kd(at, "box", K.white, 0, cy + 1.0, 0.75, 1.1, 0.3, 0.8, 0.4, 0, 0); kd(at, "icyl", K.iron, 0, cy + 2.4, -0.15, 0.05, 1.0, 0.05); kd(at, "ibox", K.ink, 0.25, cy + 2.7, -0.15, 0.6, 0.16, 0.04);
      LV7.g7info = Object.assign(LV7.g7info || {}, { oast:{ members:blocks.length - n0, top:cy + 2.9 } });
      if(P.bg) bgSet(n0, P.bg); return { w:2*hx + 4, d:2*hx + 4 };
    };
    // ---- O02 g7oLodge: an open-fronted cart lodge (the kiln's landing): timber posts in front, a brick back wall on brick piers,
    // a plank deck and a light tiled lean-to roof body; a hay cart and hop pockets (sacks) inside, decor on the deck.
    V5_PARTS.g7oLodge = function(P){
      var n0 = blocks.length, hx = P.hx || 5.0, hz = P.hz || 2.2, h = P.h || 3.0;
      var base = addBlock(0, -0.25, 0, 2*hx + 2.5, 0.5, 2*hz + 2.5, "base", {anchor:true}); kd(base, "box", K.gravel, 0, 0.03, 0, 2*hx + 2.1, 0.06, 2*hz + 2.1);
      var st = H.boxSt({ y0:0, h:h, hx:hx, hz:hz, nx:P.nx || 4, nz:2, pw:0.5, mw:0.42, fl:0, MT:api.mat("wood"), deck:"mdW", skin:{ "z-":"wall", "x-":"wall", "x+":"wall", def:"open" }, mat:"brick", wall:"bkw", dk:0.25, tp:K.woodD, td:K.woodD, tw:K.brickL, split:[2, 1] });
      st.piers.forEach(function(p){ if(p.a1z < 0) setKey(p, "bk", K.brick); });
      st.walls.forEach(function(w){ var L2 = 2*Math.max(w.half[0], w.half[2]); for(var q = 0; q < 5; q++) onF(w, "ibox", K.brickD, 0, -h*0.4 + q*h*0.2, L2, 0.04, 0.04); });
      st.decks.forEach(function(d, j){ var dx = d.spawn.x; if(j === 0){ kd(d, "ibox", K.wood, dx, 0.9, -0.2, 2.4, 0.5, 1.5); [-1, 1].forEach(function(s){ kd(d, "icyl", K.woodD, dx + s*1.0, 0.55, 0.65, 1.0, 0.12, 1.0, Math.PI/2, 0, 0); }); kd(d, "ibox", K.woodD, dx + 2.0, 0.6, -0.2, 1.8, 0.1, 0.12); }
        else for(var q = 0; q < 4; q++) kd(d, "icyl", K.cream, dx - 1.2 + q*0.8, 0.75, -hz*0.4, 0.6, 1.5, 0.6); });
      var at = mem("g7roofL", 0, h + 0.25, 0, 2*hx - 0.1, 0.5, 2*hz - 0.1, 1, null, null, K.tile); at.tint = K.tile;
      kq(at, "box", K.tile, 0, h + 0.9, 0.1, 2*hx + 0.5, 0.2, 2*hz + 1.0, 0, 0.32, 0); kd(at, "box", K.woodD, 0, h + 0.5, hz + 0.3, 2*hx + 0.4, 0.2, 0.12);
      if(P.bg) bgSet(n0, P.bg); return { w:2*hx + 2.5, d:2*hz + 2.5 };
    };
    // ---- O02 g7oCott: a two-storey brick cottage (a hop-picker's house): brick piers (bk) and walls (bkw) with a dark brick plinth,
    // cream sills, shuttered windows, a timber door hood, a tiled gabled roof body, a brick chimney stack and pots; P.side mirrors.
    V5_PARTS.g7oCott = function(P){
      var n0 = blocks.length, MT = api.mat("brick"), hx = P.hx || 3.2, hz = P.hz || 2.8, side = P.side || 1, y = 0, s, sts = [];
      var base = addBlock(0, -0.25, 0, 2*hx + 4, 0.5, 2*hz + 4, "base", {anchor:true}); kd(base, "box", K.lawn, 0, 0.03, 0, 2*hx + 3.6, 0.06, 2*hz + 3.6);
      for(s = 0; s < (P.nb || 2); s++){ var h = s ? 3.2 : 3.6;
        var st = H.boxSt({ y0:y, h:h, hx:hx, hz:hz, nx:3, nz:2, pw:0.6, mw:0.55, fl:s, MT:MT, deck:"mdB", skin:"wall", wall:"bkw", dk:0.3, tp:K.brickD, td:K.brickD, tw:s ? K.brickL : K.brick });
        sts.push(st);
        st.walls.forEach(function(w, j){ var L2 = 2*Math.max(w.half[0], w.half[2]); if(!s) onF(w, "box", K.brickD, 0, -h/2 + 0.35, L2, 0.5, 0.07);
          for(var q = 0; q < 6; q++) onF(w, "ibox", K.brickD, 0, -h*0.35 + q*h*0.13, L2, 0.035, 0.04);
          if(!s && w.a1face === "z+" && j % 2 === 0){ onF(w, "box", K.green, 0, -0.45, 0.95, 2.1, 0.08); onF(w, "box", K.white, 0, 0.75, 1.5, 0.12, 0.5); }
          else if(L2 > 1.2) win(w, 0, 0.2, Math.min(1.0, L2*0.38), 1.15, (j + s) % 3 === 0, K.green); });
        kd(st.decks[0], "lit", K.lit, 0, y + h - 0.65, 0, 0.6, 0.3, 0.6);
        y += h; }
      var at = roofBody(0, 0, y, hx - 0.02, hz - 0.02, 0.6, (P.nb || 2), 2.3, K.tile, K.tileD, 1, K.brickL);
      kd(at, "box", K.brickD, side*hx*0.55, y + 2.3, -0.3, 0.8, 2.4, 0.9); kd(at, "box", K.brick, side*hx*0.55, y + 3.55, -0.3, 0.95, 0.16, 1.05); [-1, 1].forEach(function(e){ kd(at, "icyl", K.tile, side*hx*0.55 + e*0.2, y + 3.8, -0.3, 0.2, 0.35, 0.2); });
      tree(base, side*(hx + 1.2), -hz - 0.3, 0.9);
      if(P.bg) bgSet(n0, P.bg); return { w:2*hx + 4, d:2*hz + 4 };
    };
    // ---- O03 g7oTwr: an airfield control tower. An open ground storey of 8 grey concrete columns (concrete; a column takes one TNT),
    // two shaft storeys of concrete posts and panels (cpan) with window strips, the cab with a sloped window band all round and a
    // gallery (decor), a flat roof deck with a parapet, a beacon and an aerial mast (decor).
    V5_PARTS.g7oTwr = function(P){
      var n0 = blocks.length, MT = api.mat("concrete"), hx = P.hx || 3.0, GH = P.gh || 5.0, SH = P.sh || 3.3, y = 0, s;
      var base = addBlock(0, -0.25, 0, 2*hx + 5, 0.5, 2*hx + 5, "base", {anchor:true}); kd(base, "box", K.apron, 0, 0.03, 0, 2*hx + 4.6, 0.06, 2*hx + 4.6);
      kd(base, "box", K.cream, 0, 0.065, hx + 1.6, 2*hx + 4.6, 0.02, 0.18);
      var g = H.boxSt({ y0:0, h:GH, hx:hx, hz:hx, nx:3, nz:3, pw:0.9, mw:0.8, fl:0, MT:MT, deck:"mdC", skin:"open", dk:0.45, tp:K.conc, td:K.concD });
      g.piers.forEach(function(p){ kd(p, "box", K.concD, p.spawn.x, 0.25, p.spawn.z, 2*p.half[0] + 0.16, 0.5, 2*p.half[2] + 0.16); kd(p, "box", K.white, p.spawn.x, GH - 0.75, p.spawn.z, 2*p.half[0] + 0.1, 0.2, 2*p.half[2] + 0.1);
        for(var q = 0; q < 3; q++) kd(p, "ibox", K.concD, p.spawn.x, 1.2 + q*1.2, p.spawn.z, 2*p.half[0] + 0.02, 0.04, 2*p.half[2] + 0.02); });
      var g0 = g.decks[0]; kd(g0, "box", K.white, 0, GH - 0.2, 0, 2*hx + 0.3, 0.12, 2*hx + 0.3); kd(g0, "ibox", K.concD, 0, GH/2, 0, 1.4, GH - 0.6, 1.4);   // the stair core (decor)
      kd(g0, "box", K.navy, 0, 2.0, 0.71, 0.9, 2.0, 0.04); kd(g0, "lit", K.lit, 0, 3.4, 0.72, 0.5, 0.2, 0.04);
      y = GH; var hs = hx - 0.3;
      for(s = 0; s < (P.ns || 2); s++){
        var st = H.boxSt({ y0:y, h:SH, hx:hs, hz:hs, nx:3, nz:3, pw:0.6, mw:0.55, fl:s + 1, MT:MT, deck:"mdC", skin:"wall", wall:"cpan", dk:0.35, tp:K.conc, td:K.concD, tw:K.concL });
        st.walls.forEach(function(w, j){ var L2 = 2*Math.max(w.half[0], w.half[2]); onF(w, "box", K.white, 0, SH*0.42, L2, 0.12, 0.08); onF(w, "box", K.glassD, 0, 0.1, L2*0.7, 0.8, 0.08); onF(w, "ibox", K.white, 0, 0.1, 0.06, 0.8, 0.1);
          if((j + s) % 3 === 0) onF(w, "lit", K.lit, -L2*0.15, 0.1, L2*0.25, 0.5, 0.09); });
        y += SH; }
      // the cab: corner posts, low concrete sill walls; the window band (decor) leans out, the gallery and its white rail
      var hc = P.cab || 3.0, cab = H.boxSt({ y0:y, h:hc, hx:hs, hz:hs, nx:2, nz:2, pw:0.4, mw:0.4, fl:(P.ns || 2) + 1, MT:MT, deck:"mdC", skin:"open", dk:0.35, tp:K.navy, td:K.concD });
      var c0 = cab.decks[0], cw = hs + 0.9, dkT = H.near(cab.decks, 0, 0);
      kd(c0, "box", K.concL, 0, y + 0.55, 0, 2*hs - 0.2, 1.1, 2*hs - 0.2);
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function(f){ var X = !!f[0], L2 = 2*hs + 0.5;
        kq(c0, "box", K.glass, f[0]*(hs + 0.15), y + 1.95, f[1]*(hs + 0.15), X ? 0.08 : L2, 1.7, X ? L2 : 0.08, 0, X ? 0 : -f[1]*0.14, X ? f[0]*0.14 : 0);
        for(var q = -2; q <= 2; q++) kd(c0, "ibox", K.navy, X ? f[0]*(hs + 0.16) : q*L2/5, y + 1.95, X ? q*L2/5 : f[1]*(hs + 0.16), X ? 0.1 : 0.08, 1.7, X ? 0.08 : 0.1);
        kd(c0, "box", K.white, f[0]*cw, y + 0.95, f[1]*cw, X ? 0.08 : 2*cw, 0.1, X ? 2*cw : 0.08); kd(c0, "box", K.concL, f[0]*(cw - 0.45), y - 0.1, f[1]*(cw - 0.45), X ? 0.9 : 2*cw, 0.2, X ? 2*cw : 0.9); });
      kd(c0, "lit", K.lit, 0, y + 1.5, 0, 1.6, 0.4, 1.6); kd(c0, "ibox", K.navy, 0, y + 1.0, -hs*0.4, 2.4, 0.5, 0.6);   // the consoles
      y += hc;
      kd(dkT, "box", K.white, 0, y + 0.15, 0, 2*hs + 0.8, 0.3, 2*hs + 0.8); kd(dkT, "icyl", K.white, 0, y + 0.6, 0, 1.0, 0.6, 1.0); kd(dkT, "lit", 0x7FE08A, 0, y + 1.1, 0, 0.6, 0.45, 0.6);   // the beacon
      kd(dkT, "icyl", K.iron, hs*0.6, y + 2.1, -hs*0.6, 0.08, 3.6, 0.08); kd(dkT, "ibox", K.iron, hs*0.6, y + 3.2, -hs*0.6, 1.2, 0.06, 0.06); kd(dkT, "lit", 0xFF5A4A, hs*0.6, y + 3.95, -hs*0.6, 0.2, 0.2, 0.2);
      // the wind sock on a pole beside the tower (decor on the pad)
      kd(base, "icyl", K.white, -hx - 1.6, 2.5, hx + 1.0, 0.1, 5.0, 0.1); kd(base, "icyl", K.orange, -hx - 0.95, 4.8, hx + 1.0, 0.55, 1.3, 0.55, 0, 0, Math.PI/2 - 0.2);
      LV7.g7info = Object.assign(LV7.g7info || {}, { twr:{ members:blocks.length - n0, top:y + 4 } });
      if(P.bg) bgSet(n0, P.bg); return { w:2*hx + 5, d:2*hx + 5 };
    };
    // ---- O03 g7oBag: the baggage hall in front of the tower (its landing): brick piers (bk), a brick back wall, a timber plank deck
    // and a light roof body with a striped canopy over the front; baggage carts and cases inside (decor on the deck).
    V5_PARTS.g7oBag = function(P){
      var n0 = blocks.length, hx = P.hx || 5.0, hz = P.hz || 2.2, h = P.h || 3.0;
      var base = addBlock(0, -0.25, 0, 2*hx + 2.5, 0.5, 2*hz + 2.5, "base", {anchor:true}); kd(base, "box", K.apron, 0, 0.03, 0, 2*hx + 2.1, 0.06, 2*hz + 2.1);
      var st = H.boxSt({ y0:0, h:h, hx:hx, hz:hz, nx:P.nx || 4, nz:2, pw:0.55, mw:0.5, fl:0, MT:api.mat("brick"), deck:"mdW", skin:{ "z-":"wall", "x-":"wall", "x+":"wall", def:"open" }, wall:"bkw", dk:0.25, tp:K.brick, td:K.woodD, tw:K.brickL, split:[2, 1] });
      st.walls.forEach(function(w){ var L2 = 2*Math.max(w.half[0], w.half[2]); onF(w, "box", K.white, 0, h*0.3, L2, 0.12, 0.07); for(var q = 0; q < 5; q++) onF(w, "ibox", K.brickD, 0, -h*0.4 + q*h*0.15, L2, 0.04, 0.04); });
      st.decks.forEach(function(d){ var dx = d.spawn.x; for(var q = 0; q < 2; q++){ var cx = dx - 1.0 + q*2.0; kd(d, "ibox", K.navy, cx, 0.6, -0.1, 1.5, 0.12, 0.9); [-1, 1].forEach(function(e){ kd(d, "icyl", K.ink, cx + e*0.55, 0.25, 0.35, 0.3, 0.08, 0.3, Math.PI/2, 0, 0); });
        kd(d, "ibox", q ? K.orange : K.green, cx - 0.3, 0.95, -0.1, 0.6, 0.55, 0.45); kd(d, "ibox", K.brickD, cx + 0.35, 0.9, -0.1, 0.5, 0.45, 0.4); } });
      var at = mem("g7roofL", 0, h + 0.25, 0, 2*hx - 0.1, 0.5, 2*hz - 0.1, 1, null, null, K.white); at.tint = K.white;
      kd(at, "box", K.white, 0, h + 0.55, 0, 2*hx + 0.3, 0.12, 2*hz + 0.3);
      for(var q = 0; q < 8; q++) kq(at, "box", q % 2 ? K.white : K.orange, -hx + (q + 0.5)*2*hx/8, h - 0.1, hz + 0.6, 2*hx/8, 0.08, 1.3, 0, 0.35, 0);
      if(P.bg) bgSet(n0, P.bg); return { w:2*hx + 2.5, d:2*hz + 2.5 };
    };
    // ---- O03 g7oWing: a terminal wing (a side building): grey concrete columns (concrete) and brick infill walls (bkw), three storeys,
    // a flat roof deck with a white parapet, window bands and a canopy over the door (decor); a radar dish (P.side > 0) or a weather
    // mast (P.side < 0) on the roof, so the pair mirrors.
    V5_PARTS.g7oWing = function(P){
      var n0 = blocks.length, MT = api.mat("concrete"), hx = P.hx || 3.4, hz = P.hz || 2.8, side = P.side || 1, y = 0, s, sts = [], nb = P.nb || 3;
      var base = addBlock(0, -0.25, 0, 2*hx + 4, 0.5, 2*hz + 4, "base", {anchor:true}); kd(base, "box", K.apron, 0, 0.03, 0, 2*hx + 3.6, 0.06, 2*hz + 3.6);
      for(s = 0; s < nb; s++){ var h = s ? 3.1 : 3.5;
        var st = H.boxSt({ y0:y, h:h, hx:hx, hz:hz, nx:3, nz:2, pw:0.6, mw:0.55, fl:s, MT:MT, deck:"mdC", skin:"wall", wall:"bkw", dk:0.32, tp:K.conc, td:K.concD, tw:K.brickL });
        sts.push(st);
        st.walls.forEach(function(w, j){ var L2 = 2*Math.max(w.half[0], w.half[2]); onF(w, "box", K.conc, 0, h*0.44, L2, 0.18, 0.08);
          if(!s && w.a1face === "z+" && j % 2 === 0){ onF(w, "box", K.navy, 0, -0.5, 1.2, 2.2, 0.08); onF(w, "box", K.white, 0, 0.85, 1.9, 0.14, 0.9); }
          else if(L2 > 1.2) { onF(w, "box", K.white, 0, 0.15, L2*0.7 + 0.16, 1.16, 0.06); onF(w, "box", (j + s) % 3 === 0 ? K.lit : K.glassD, 0, 0.15, L2*0.7, 1.0, 0.08); for(var q = -1; q <= 1; q++) onF(w, "ibox", K.white, q*L2*0.23, 0.15, 0.06, 1.0, 0.1); } });
        y += h; }
      var top = H.near(sts[nb - 1].decks, 0, 0);
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function(f){ var X = !!f[0]; kd(top, "box", K.white, f[0]*(hx - 0.1), y + 0.35, f[1]*(hz - 0.1), X ? 0.2 : 2*hx, 0.7, X ? 2*hz : 0.2); });
      if(side > 0){ kd(top, "icyl", K.iron, 0.3, y + 0.9, -0.4, 0.3, 1.2, 0.3); kq(top, "box", K.white, 0.3, y + 1.9, -0.4, 2.2, 0.12, 1.2, 0.5, 0.4, 0); kd(top, "ibox", K.iron, 0.3, y + 1.5, -0.4, 0.2, 0.8, 0.2); }
      else { kd(top, "icyl", K.iron, -0.4, y + 1.8, -0.4, 0.08, 3.0, 0.08); [-1, 1].forEach(function(e){ kd(top, "icyl", K.white, -0.4 + e*0.4, y + 3.2, -0.4, 0.3, 0.25, 0.3); }); kd(top, "ibox", K.orange, -0.4, y + 2.8, -0.4, 0.9, 0.05, 0.05); }
      kd(top, "ibox", K.concD, -side*hx*0.45, y + 0.6, 0, 1.4, 1.0, 1.2);   // the plant room (decor)
      if(P.bg) bgSet(n0, P.bg); return { w:2*hx + 4, d:2*hz + 4 };
    };
    // ---- O04 g7oHose: a fire station's hose-drying tower. A brick arcade on 8 piers (bk) with the appliance way through it, then
    // P.ns timber storeys (wpost posts, louvred wwall slat walls: the hoses dry inside), a bell loft with a pyramid roof body,
    // a bell and a flag (decor). Two front piers side by side gone and it falls that way (base stiff-tip).
    V5_PARTS.g7oHose = function(P){
      var n0 = blocks.length, hx = P.hx || 2.8, AH = P.ah || 4.6, SH = P.sh || 3.4, y = 0, s;
      var base = addBlock(0, -0.25, 0, 2*hx + 4, 0.5, 2*hx + 4, "base", {anchor:true}); kd(base, "box", K.apron, 0, 0.03, 0, 2*hx + 3.6, 0.06, 2*hx + 3.6);
      var g = H.boxSt({ y0:0, h:AH, hx:hx, hz:hx, nx:3, nz:3, pw:0.9, mw:0.8, fl:0, MT:api.mat("brick"), deck:"mdB", skin:"open", dk:0.4, tp:K.brick, td:K.brickD });
      g.piers.forEach(function(p){ kd(p, "box", K.stoneD, p.spawn.x, 0.3, p.spawn.z, 2*p.half[0] + 0.14, 0.6, 2*p.half[2] + 0.14); kd(p, "box", K.cream, p.spawn.x, AH - 0.7, p.spawn.z, 2*p.half[0] + 0.1, 0.2, 2*p.half[2] + 0.1);
        for(var q = 0; q < 5; q++) kd(p, "ibox", K.brickD, p.spawn.x, 0.9 + q*0.65, p.spawn.z, 2*p.half[0] + 0.02, 0.05, 2*p.half[2] + 0.02); });
      var gd = g.decks[0]; kd(gd, "box", K.brick, 0, AH - 0.75, hx - 0.2, 2*hx - 0.1, 0.7, 0.4); kd(gd, "box", K.cream, 0, AH - 0.75, hx + 0.02, 2*hx - 1.6, 0.3, 0.06);
      kd(gd, "ibox", K.red, 0, AH - 0.75, hx + 0.06, 2*hx - 2.0, 0.18, 0.04);
      y = AH; var hs = hx - 0.2;
      for(s = 0; s < (P.ns || 3); s++){
        var st = H.boxSt({ y0:y, h:SH, hx:hs, hz:hs, nx:2, nz:2, pw:0.5, mw:0.45, fl:s + 1, MT:api.mat("wood"), deck:"mdW", skin:"wall", mat:"wood", wall:"wwall", dk:0.3, tp:K.red, td:K.woodD, tw:K.cream });
        st.walls.forEach(function(w, j){ var L2 = 2*Math.max(w.half[0], w.half[2]); for(var q = 0; q < 8; q++) onF(w, "ibox", K.creamD, 0, -SH*0.4 + q*SH*0.1, L2 - 0.2, 0.05, 0.06);
          onF(w, "box", K.red, 0, SH*0.45, L2, 0.18, 0.08); if((s + j) % 3 === 0) onF(w, "box", K.glassD, 0, 0.3, 0.6, 0.9, 0.08); });
        kd(st.decks[0], "icyl", K.hose, 0, y + SH*0.45, 0, 0.3, SH*0.85, 0.3); kd(st.decks[0], "icyl", K.hose, 0.5, y + SH*0.45, 0.4, 0.3, SH*0.85, 0.3);   // the hoses hanging inside
        y += SH; }
      // the bell loft: corner posts (wpost), open; the bell on a beam (decor); the pyramid roof body, a flag pole
      var bl = H.boxSt({ y0:y, h:2.6, hx:hs, hz:hs, nx:2, nz:2, pw:0.45, mw:0.45, fl:(P.ns || 3) + 1, MT:api.mat("wood"), deck:"mdW", skin:"open", dk:0.28, tp:K.red, td:K.woodD });
      var b0 = bl.decks[0]; kd(b0, "box", K.woodD, 0, y + 2.05, 0, 2*hs - 0.4, 0.2, 0.2); kd(b0, "icyl", K.gold, 0, y + 1.5, 0, 1.0, 0.9, 1.0); kd(b0, "icyl", K.gold, 0, y + 1.0, 0, 1.25, 0.18, 1.25);
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function(f){ var X = !!f[0]; kd(b0, "box", K.white, f[0]*(hs - 0.05), y + 0.6, f[1]*(hs - 0.05), X ? 0.08 : 2*hs, 0.1, X ? 2*hs : 0.08); });
      y += 2.6;
      var at = mem("g7roofL", 0, y + 0.3, 0, 2*hs - 0.1, 0.6, 2*hs - 0.1, (P.ns || 3) + 2, null, null, K.slate); at.tint = K.slate;
      kd(at, "box", K.white, 0, y + 0.62, 0, 2*hs + 0.7, 0.14, 2*hs + 0.7); kd(at, "cone", K.slate, 0, y + 2.0, 0, 2*hs + 0.6, 2.7, 2*hs + 0.6);
      kd(at, "icyl", K.iron, 0, y + 4.2, 0, 0.07, 1.8, 0.07); kd(at, "ibox", K.red, 0.42, y + 4.8, 0, 0.8, 0.5, 0.03);
      if(P.bg) bgSet(n0, P.bg); return { w:2*hx + 4, d:2*hx + 4 };
    };
    // ---- O04 g7oEng: the engine house in front of the tower (its landing): brick piers (bk) and a brick back wall, two big red
    // appliance doors folded open, a fire engine in each bay (decor on the deck), a light roof body with a white cornice and a name board.
    V5_PARTS.g7oEng = function(P){
      var n0 = blocks.length, hx = P.hx || 5.0, hz = P.hz || 2.4, h = P.h || 3.2;
      var base = addBlock(0, -0.25, 0, 2*hx + 2.5, 0.5, 2*hz + 3.5, "base", {anchor:true}); kd(base, "box", K.apron, 0, 0.03, 0.5, 2*hx + 2.1, 0.06, 2*hz + 3.1);
      var st = H.boxSt({ y0:0, h:h, hx:hx, hz:hz, nx:P.nx || 3, nz:2, pw:0.7, mw:0.65, fl:0, MT:api.mat("brick"), deck:"mdW", skin:{ "z-":"wall", "x-":"wall", "x+":"wall", def:"open" }, wall:"bkw", dk:0.25, tp:K.brick, td:K.woodD, tw:K.brickL, split:[P.bays || 2, 1] });
      st.walls.forEach(function(w){ var L2 = 2*Math.max(w.half[0], w.half[2]); onF(w, "box", K.cream, 0, h*0.3, L2, 0.12, 0.07); for(var q = 0; q < 5; q++) onF(w, "ibox", K.brickD, 0, -h*0.4 + q*h*0.15, L2, 0.04, 0.04); });
      st.decks.forEach(function(d){ var dx = d.spawn.x; kd(d, "ibox", K.red, dx, 0.95, -0.1, 1.9, 1.4, 3.6); kd(d, "ibox", K.white, dx, 1.7, -0.1, 1.9, 0.12, 3.6); kd(d, "ibox", K.iron, dx, 1.9, -0.6, 1.4, 0.12, 2.4);
        kd(d, "lit", K.lit, dx - 0.6, 0.95, 1.72, 0.3, 0.3, 0.05); kd(d, "lit", K.lit, dx + 0.6, 0.95, 1.72, 0.3, 0.3, 0.05); [-1, 1].forEach(function(e){ kd(d, "icyl", K.ink, dx + e*0.95, 0.4, 0.9, 0.8, 0.3, 0.8, 0, 0, Math.PI/2); kd(d, "icyl", K.ink, dx + e*0.95, 0.4, -1.1, 0.8, 0.3, 0.8, 0, 0, Math.PI/2); });
        [-1, 1].forEach(function(e){ kq(d, "box", K.red, dx + e*1.7, h*0.42, hz + 0.6, 1.1, h*0.8, 0.08, e*1.1, 0, 0); }); });
      var at = mem("g7roofL", 0, h + 0.3, 0, 2*hx - 0.1, 0.6, 2*hz - 0.1, 1, null, null, K.slate); at.tint = K.slate;
      kd(at, "box", K.white, 0, h + 0.65, 0, 2*hx + 0.3, 0.14, 2*hz + 0.3); kd(at, "box", K.brick, 0, h + 0.3, hz - 0.02, 2*hx - 0.1, 0.6, 0.1); kd(at, "box", K.navy, 0, h + 0.3, hz + 0.05, 3.2, 0.4, 0.06);
      if(P.bg) bgSet(n0, P.bg); return { w:2*hx + 2.5, d:2*hz + 3.5 };
    };
    // ---- O05 g7oCable: a cable-car valley station. An open ground storey of 8 grey concrete columns (concrete), two concrete
    // storeys (concrete posts, cpan panels, a window band), the timber machine house on top (wpost + wwall boards) with the big
    // bullwheel and a parked gondola on its front (decor), a gabled roof body with a name board. Falls toward the legs broken.
    V5_PARTS.g7oCable = function(P){
      var n0 = blocks.length, MT = api.mat("concrete"), hx = P.hx || 3.2, GH = P.gh || 4.8, SH = P.sh || 3.3, y = 0, s;
      var base = addBlock(0, -0.25, 0, 2*hx + 4, 0.5, 2*hx + 4, "base", {anchor:true}); kd(base, "box", K.apron, 0, 0.03, 0, 2*hx + 3.6, 0.06, 2*hx + 3.6);
      var g = H.boxSt({ y0:0, h:GH, hx:hx, hz:hx, nx:3, nz:3, pw:0.9, mw:0.8, fl:0, MT:MT, deck:"mdC", skin:"open", dk:0.45, tp:K.conc, td:K.concD });
      g.piers.forEach(function(p){ kd(p, "box", K.concD, p.spawn.x, 0.25, p.spawn.z, 2*p.half[0] + 0.16, 0.5, 2*p.half[2] + 0.16); kd(p, "box", K.white, p.spawn.x, GH - 0.7, p.spawn.z, 2*p.half[0] + 0.1, 0.18, 2*p.half[2] + 0.1); });
      kd(g.decks[0], "ibox", K.concD, 0, GH/2, 0, 1.6, GH - 0.6, 1.6); kd(g.decks[0], "box", K.red, 0, 1.4, 0.82, 1.0, 2.2, 0.04);   // the stair core and its door
      y = GH;
      for(s = 0; s < (P.ns || 2); s++){
        var st = H.boxSt({ y0:y, h:SH, hx:hx, hz:hx, nx:3, nz:3, pw:0.6, mw:0.55, fl:s + 1, MT:MT, deck:"mdC", skin:"wall", wall:"cpan", dk:0.35, tp:K.conc, td:K.concD, tw:K.concL });
        st.walls.forEach(function(w, j){ var L2 = 2*Math.max(w.half[0], w.half[2]); onF(w, "box", K.red, 0, SH*0.42, L2, 0.14, 0.08);
          onF(w, "box", K.white, 0, 0.1, L2*0.72 + 0.14, 1.1, 0.06); onF(w, "box", (j + s) % 3 === 1 ? K.lit : K.glassD, 0, 0.1, L2*0.72, 0.96, 0.08); onF(w, "ibox", K.white, 0, 0.1, 0.06, 0.96, 0.1); });
        y += SH; }
      var mh = H.boxSt({ y0:y, h:3.4, hx:hx, hz:hx, nx:3, nz:2, pw:0.45, mw:0.42, fl:(P.ns || 2) + 1, MT:api.mat("wood"), deck:"mdW", skin:"wall", mat:"wood", wall:"wwall", dk:0.3, tp:K.woodD, td:K.woodD, tw:K.wood });
      mh.walls.forEach(function(w){ var L2 = 2*Math.max(w.half[0], w.half[2]); for(var q = -3; q <= 3; q++) onF(w, "ibox", K.woodD, q*L2/7, 0, 0.05, 3.0, 0.05); });
      var fm = H.near(mh.walls.filter(function(w){ return w.a1face === "z+"; }), 0, hx);
      kd(fm, "cyl", K.iron, 0, y + 1.7, hx + 0.35, 2.8, 0.25, 2.8, Math.PI/2, 0, 0); kd(fm, "cyl", K.red, 0, y + 1.7, hx + 0.42, 0.7, 0.2, 0.7, Math.PI/2, 0, 0);   // the bullwheel
      kd(fm, "ibox", K.iron, 0.9, y + 0.6, hx + 0.6, 0.08, 1.8, 0.08); kd(fm, "ibox", K.red, 0.9, y - 0.4, hx + 0.6, 1.3, 1.0, 1.0); kd(fm, "ibox", K.glass, 0.9, y - 0.25, hx + 1.11, 1.0, 0.45, 0.04);   // a gondola
      kd(H.near(mh.decks, 0, 0), "lit", K.lit, 0, y + 2.6, 0, 0.8, 0.3, 0.8);
      y += 3.4;
      var at = roofBody(0, 0, y, hx - 0.02, hx - 0.02, 0.5, (P.ns || 2) + 2, 2.2, K.slate, K.slateD, 1, K.wood);
      kd(at, "box", K.white, 0, y + 0.25, hx + 0.05, 3.0, 0.45, 0.06); kd(at, "box", K.red, 0, y + 0.25, hx + 0.09, 2.6, 0.25, 0.04);
      if(P.bg) bgSet(n0, P.bg); return { w:2*hx + 4, d:2*hx + 4 };
    };
    // ---- O05 g7oTicket: the timber ticket hall behind the station (its landing when tipped away from the blue): two timber storeys
    // (wpost, board walls wwall), a ticket window and a clock board on the front, a long gabled roof body.
    V5_PARTS.g7oTicket = function(P){
      var n0 = blocks.length, MT = api.mat("wood"), hx = P.hx || 5.0, hz = P.hz || 3.0, y = 0, s;
      var base = addBlock(0, -0.25, 0, 2*hx + 3, 0.5, 2*hz + 3, "base", {anchor:true}); kd(base, "box", K.gravel, 0, 0.03, 0, 2*hx + 2.6, 0.06, 2*hz + 2.6);
      for(s = 0; s < (P.nb || 2); s++){ var h = s ? 3.0 : 3.4;
        var st = H.boxSt({ y0:y, h:h, hx:hx, hz:hz, nx:4, nz:2, pw:0.45, mw:0.42, fl:s, MT:MT, deck:"mdW", skin:"wall", mat:"wood", wall:"wwall", dk:0.3, tp:K.woodD, td:K.woodD, tw:s ? K.woodL : K.wood });
        st.walls.forEach(function(w, j){ var L2 = 2*Math.max(w.half[0], w.half[2]); for(var q = -2; q <= 2; q++) onF(w, "ibox", K.woodD, q*L2/5, 0, 0.05, h - 0.3, 0.05);
          if(L2 > 1.2) win(w, 0, 0.2, Math.min(1.0, L2*0.4), 1.0, (j + s) % 3 === 0, K.red); });
        kd(st.decks[0], "lit", K.lit, 0, y + h - 0.6, 0, 0.8, 0.3, 0.8); y += h; }
      roofBody(0, 0, y, hx - 0.02, hz - 0.02, 0.5, (P.nb || 2), 2.0, K.slate, K.slateD, 1, K.wood);
      if(P.bg) bgSet(n0, P.bg); return { w:2*hx + 3, d:2*hz + 3 };
    };
    // ---- O06 g7oCrane: a harbour portal crane. Four grey concrete pedestals (concrete, the rail bogies on them are decor), four steel
    // portal legs (steel: TNT barely marks them), a steel girder deck (mdS), the timber machine house (wpost + wwall) with its jib and
    // hook (decor). Steel holds; the concrete under it does not: two pedestals side by side gone and it falls that way.
    V5_PARTS.g7oCrane = function(P){
      var n0 = blocks.length, hx = P.hx || 3.2, hz = P.hz || 2.6, PH = P.ph || 2.6, LH = P.lh || 7.0, y = 0;
      var base = addBlock(0, -0.25, 0, 2*hx + 4, 0.5, 2*hz + 4, "base", {anchor:true}); kd(base, "box", K.apron, 0, 0.03, 0, 2*hx + 3.6, 0.06, 2*hz + 3.6);
      [-1, 1].forEach(function(e){ kd(base, "box", K.iron, e*hx*0.82, 0.08, 0, 0.18, 0.1, 2*hz + 3.6); });   // the crane rails
      var g = H.boxSt({ y0:0, h:PH, hx:hx, hz:hz, nx:2, nz:2, pw:1.5, mw:1.5, fl:0, MT:api.mat("concrete"), deck:"mdC", skin:"open", dk:0.4, tp:K.conc, td:K.concD, split:[2, 1] });
      g.piers.forEach(function(p){ kd(p, "box", K.yellow, p.spawn.x, 0.35, p.spawn.z, 2*p.half[0] + 0.1, 0.12, 2*p.half[2] + 0.1); kd(p, "box", K.ink, p.spawn.x, 0.35, p.spawn.z, 2*p.half[0] + 0.12, 0.05, 2*p.half[2] + 0.12); });
      y = PH;
      var l = H.boxSt({ y0:y, h:LH, hx:hx, hz:hz, nx:2, nz:2, pw:0.8, mw:0.8, fl:1, MT:api.mat("steel"), deck:"mdS", skin:"open", dk:0.6, tp:K.cranePaint, td:K.cranePaintD, split:[2, 1] });
      // portal braces (decor on the legs: X between each pair, a knee brace under the girder)
      [[0, 1], [0, -1], [1, 0], [-1, 0]].forEach(function(f){ var X = !!f[0], a = (X ? hz : hx) - 0.4, p1 = H.near(l.piers, X ? f[0]*hx : -hx, X ? -hz : f[1]*hz), p2 = H.near(l.piers, X ? f[0]*hx : hx, X ? hz : f[1]*hz);
        var c = X ? f[0]*(hx - 0.4) : f[1]*(hz - 0.4);
        bar(p1, K.cranePaintD, X ? c : -a, y + 1.0, X ? -a : c, X ? c : a, y + LH - 1.4, X ? a : c, 0.22); bar(p2, K.cranePaintD, X ? c : a, y + 1.0, X ? a : c, X ? c : -a, y + LH - 1.4, X ? -a : c, 0.22); });
      l.piers.forEach(function(p){ for(var q = 0; q < 4; q++) kd(p, "ibox", K.cranePaintD, p.spawn.x, y + 1 + q*1.5, p.spawn.z, 2*p.half[0] + 0.04, 0.08, 2*p.half[2] + 0.04); });
      y += LH;
      // the machine house on the girder deck: timber, a boarded house with windows, a cab in front, the jib (decor) rising out front
      var mh = H.boxSt({ y0:y, h:3.2, hx:hx - 0.6, hz:hz - 0.4, nx:2, nz:2, pw:0.4, mw:0.4, fl:2, MT:api.mat("wood"), deck:"mdW", skin:"wall", mat:"wood", wall:"wwall", dk:0.28, tp:K.woodD, td:K.woodD, tw:K.cranePaint });
      mh.walls.forEach(function(w, j){ var L2 = 2*Math.max(w.half[0], w.half[2]); onF(w, "box", K.cranePaintD, 0, -1.3, L2, 0.4, 0.06); if(L2 > 1.4) win(w, 0, 0.3, Math.min(1.2, L2*0.35), 0.9, j % 3 === 0, 0); });
      var fw = H.near(mh.walls.filter(function(w){ return w.a1face === "z+"; }), 0, hz), top = H.near(mh.decks, 0, 0);
      kd(fw, "ibox", K.cranePaint, -0.9, y + 1.2, hz + 0.2, 1.4, 1.6, 1.0); kd(fw, "ibox", K.glass, -0.9, y + 1.5, hz + 0.72, 1.2, 0.8, 0.04);   // the driver's cab
      bar(top, K.cranePaint, 0.6, y + 3.2, hz - 0.8, 0.6, y + 7.8, hz + 1.6, 0.4); bar(top, K.cranePaint, 0.6, y + 7.8, hz + 1.6, 0.6, y + 3.4, -hz + 0.6, 0.18);   // the jib and its tie
      kd(top, "icyl", K.iron, 0.6, y + 6.6, hz + 1.6, 0.05, 2.4, 0.05); kd(top, "ibox", K.yellow, 0.6, y + 5.3, hz + 1.6, 0.4, 0.4, 0.4);   // the rope and the hook block
      kd(top, "box", K.cranePaintD, 0, y + 3.35, 0, 2*hx - 0.9, 0.3, 2*hz - 0.5); kd(top, "lit", 0xFF5A4A, 0.6, y + 8.0, hz + 1.6, 0.25, 0.25, 0.25);
      if(P.bg) bgSet(n0, P.bg); return { w:2*hx + 4, d:2*hz + 4 };
    };
    // ---- O06 g7oShip: a small timber cargo coaster moored at the quay in front of the crane (its landing): a timber hull of planked
    // members (wwall sides, mdW deck), a wheelhouse aft, cargo crates on the deck (decor), the harbour water round it (decor on the quay).
    V5_PARTS.g7oShip = function(P){
      var n0 = blocks.length, hx = P.hx || 5.4, hz = P.hz || 1.8, h = P.h || 2.0, MT = api.mat("wood");
      var base = addBlock(0, -0.25, 0, 2*hx + 6, 0.5, 2*hz + 4, "base", {anchor:true});
      kd(base, "box", K.water, 0, 0.02, 0, 2*hx + 5.6, 0.05, 2*hz + 3.6); kd(base, "box", K.waterD, 0, 0.04, 0, 2*hx + 1.0, 0.03, 2*hz + 0.8);
      var st = H.boxSt({ y0:0, h:h, hx:hx, hz:hz, nx:4, nz:2, pw:0.4, mw:0.36, fl:0, MT:MT, deck:"mdW", skin:"wall", mat:"wood", wall:"wwall", dk:0.25, tp:K.hull, td:K.woodL, tw:K.hull, split:[3, 1] });
      st.walls.forEach(function(w){ var L2 = 2*Math.max(w.half[0], w.half[2]); onF(w, "box", K.hullD, 0, -h*0.3, L2, 0.5, 0.06); onF(w, "box", K.white, 0, h*0.38, L2, 0.14, 0.07); });
      [-1, 1].forEach(function(e){ var p = H.near(st.piers, e*hx, 0); kq(p, "box", K.hull, e*(hx + 0.6), h*0.55, 0, 1.6, h*0.9, 2*hz - 0.2, 0, 0, e*0.35); });   // bow and stern
      st.decks.forEach(function(d, j){ var dx = d.spawn.x; if(j === 2){ kd(d, "ibox", K.white, dx + 0.3, h + 0.9, 0, 1.6, 1.5, 2*hz - 0.8); kd(d, "ibox", K.glass, dx + 0.3, h + 1.25, hz - 0.38, 1.3, 0.5, 0.04); kd(d, "icyl", K.ink, dx + 0.6, h + 2.0, 0, 0.3, 0.8, 0.3); }
        else for(var q = 0; q < 2; q++) kd(d, "ibox", [K.red, K.green, K.navy, K.yellow][(j*2 + q) % 4], dx - 0.6 + q*1.2, h + 0.55, 0, 1.0, 0.9, 2*hz - 0.9); });
      if(P.bg) bgSet(n0, P.bg); return { w:2*hx + 6, d:2*hz + 4 };
    };
    // ---- O06 g7oWhse: a brick harbour warehouse (a side building): brick piers and walls, three storeys of loading doors one over the
    // other with a timber hoist beam at the top, a gabled roof body with a cat-head, a painted name band (decor).
    V5_PARTS.g7oWhse = function(P){
      var n0 = blocks.length, MT = api.mat("brick"), hx = P.hx || 3.2, hz = P.hz || 3.0, y = 0, s, nb = P.nb || 3, sts = [];
      var base = addBlock(0, -0.25, 0, 2*hx + 4, 0.5, 2*hz + 4, "base", {anchor:true}); kd(base, "box", K.apron, 0, 0.03, 0, 2*hx + 3.6, 0.06, 2*hz + 3.6);
      for(s = 0; s < nb; s++){ var h = s ? 3.0 : 3.4;
        var st = H.boxSt({ y0:y, h:h, hx:hx, hz:hz, nx:3, nz:2, pw:0.6, mw:0.55, fl:s, MT:MT, deck:"mdB", skin:"wall", wall:"bkw", dk:0.3, tp:K.brickD, td:K.brickD, tw:s % 2 ? K.brickL : K.brick });
        sts.push(st);
        st.walls.forEach(function(w, j){ var L2 = 2*Math.max(w.half[0], w.half[2]); onF(w, "box", K.cream, 0, h*0.44, L2, 0.12, 0.07); for(var q = 0; q < 5; q++) onF(w, "ibox", K.brickD, 0, -h*0.35 + q*h*0.15, L2, 0.035, 0.04);
          if(w.a1face === "z+" && j % 2 === 0){ onF(w, "box", K.green, 0, -0.2, 1.3, 2.3, 0.08); onF(w, "box", K.cream, 0, 1.05, 1.6, 0.14, 0.12); }
          else if(L2 > 1.2) win(w, 0, 0.25, Math.min(0.9, L2*0.32), 1.0, (j + s) % 3 === 0, 0); });
        y += h; }
      var at = roofBody(0, 0, y, hx - 0.02, hz - 0.02, 0.6, nb, 2.0, K.slate, K.slateD, 0, K.brick);
      kd(at, "box", K.woodD, 0, y + 0.8, hz + 0.5, 0.25, 0.25, 1.2); kd(at, "icyl", K.iron, 0, y - 0.3, hz + 1.0, 0.05, 2.0, 0.05);
      kd(H.near(sts[nb - 1].walls, 0, hz), "box", K.navy, 0, y - 0.55, hz + 0.05, 2*hx - 0.6, 0.5, 0.06);
      if(P.bg) bgSet(n0, P.bg); return { w:2*hx + 4, d:2*hz + 4 };
    };
    // ---- O07 g7oHead: a colliery headframe. Six grey concrete footings (concrete), two storeys of steel legs (steel) with X-braces,
    // a steel head deck (mdS) carrying the two big sheave wheels, a ladder and a platform rail, the back-stays toward the winding
    // house (decor). Falls toward the footings broken (base stiff-tip): its proper fall is back, onto the winding house.
    V5_PARTS.g7oHead = function(P){
      var n0 = blocks.length, hx = P.hx || 2.6, hz = P.hz || 2.4, PH = P.ph || 2.2, LH = P.lh || 5.6, y = 0, s;
      var base = addBlock(0, -0.25, 0, 2*hx + 4, 0.5, 2*hz + 5, "base", {anchor:true}); kd(base, "box", K.coal, 0, 0.03, 0, 2*hx + 3.6, 0.06, 2*hz + 4.6);
      kd(base, "box", K.ink, 0, 0.06, 0, 1.8, 0.04, 1.8);   // the shaft mouth
      var g = H.boxSt({ y0:0, h:PH, hx:hx, hz:hz, nx:2, nz:3, pw:1.2, mw:1.1, fl:0, MT:api.mat("concrete"), deck:"mdC", skin:"open", dk:0.4, tp:K.conc, td:K.concD });
      y = PH;
      for(s = 0; s < 2; s++){
        var l = H.boxSt({ y0:y, h:LH, hx:hx - 0.1, hz:hz - 0.1, nx:2, nz:2, pw:0.6, mw:0.6, fl:s + 1, MT:api.mat("steel"), deck:"mdS", skin:"open", dk:0.4, tp:K.headPaint, td:K.headPaintD });
        [[0, 1], [0, -1], [1, 0], [-1, 0]].forEach(function(f){ var X = !!f[0], a = (X ? hz : hx) - 0.4, c = X ? f[0]*(hx - 0.4) : f[1]*(hz - 0.4);
          var p1 = H.near(l.piers, X ? f[0]*hx : -hx, X ? -hz : f[1]*hz), p2 = H.near(l.piers, X ? f[0]*hx : hx, X ? hz : f[1]*hz);
          bar(p1, K.headPaintD, X ? c : -a, y + 0.4, X ? -a : c, X ? c : a, y + LH - 0.8, X ? a : c, 0.16); bar(p2, K.headPaintD, X ? c : a, y + 0.4, X ? a : c, X ? c : -a, y + LH - 0.8, X ? -a : c, 0.16);
          kd(p1, "box", K.headPaintD, X ? c : 0, y + LH*0.5, X ? 0 : c, X ? 0.14 : 2*a, 0.16, X ? 2*a : 0.14); });
        if(s === 0){ var d0 = l.decks[0]; for(var q = 0; q < 10; q++) kd(d0, "ibox", K.iron, hx - 0.15, PH + 0.3 + q*(2*LH - 0.6)/10, hz - 0.5, 0.5, 0.05, 0.05); kd(d0, "icyl", K.iron, hx - 0.15, PH + LH, hz - 0.3, 0.05, 2*LH, 0.05); }
        y += LH; }
      // the head: two sheave wheels side by side (decor), their pulley house, the platform rail, the back-stays
      var top = H.near(l.decks, 0, 0);
      [-1, 1].forEach(function(e){ var wx = e*0.75; kd(top, "cyl", K.headPaintD, wx, y + 2.0, 0, 3.4, 0.22, 3.4, 0, 0, Math.PI/2); kd(top, "cyl", K.iron, wx, y + 2.0, 0, 0.6, 0.4, 0.6, 0, 0, Math.PI/2);
        for(var q = 0; q < 4; q++) kq(top, "box", K.headPaintD, wx, y + 2.0, 0, 0.08, 3.2, 0.1, 0, 0, 0); kd(top, "ibox", K.headPaintD, wx, y + 1.0, 0, 0.12, 2.0, 0.3); });
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function(f){ var X = !!f[0]; kd(top, "box", K.white, f[0]*(hx - 0.15), y + 0.9, f[1]*(hz - 0.15), X ? 0.06 : 2*hx - 0.3, 0.08, X ? 2*hz - 0.3 : 0.06); });
      bar(top, K.headPaintD, -hx + 0.3, y - 0.2, -hz + 0.3, -hx + 0.3, PH + 1.2, -hz - 1.6, 0.3); bar(top, K.headPaintD, hx - 0.3, y - 0.2, -hz + 0.3, hx - 0.3, PH + 1.2, -hz - 1.6, 0.3);   // back-stays
      kd(top, "lit", 0xFF5A4A, 0, y + 3.9, 0, 0.25, 0.25, 0.25);
      kd(base, "box", K.iron, 0, 0.1, hz + 1.8, 2.4, 0.06, 0.2); kd(base, "ibox", K.coalCart, 0, 0.75, hz + 1.8, 1.3, 1.0, 2.0); kd(base, "ibox", K.coal, 0, 1.3, hz + 1.8, 1.2, 0.2, 1.8);   // a tub on the rails
      if(P.bg) bgSet(n0, P.bg); return { w:2*hx + 4, d:2*hz + 5 };
    };
    // ---- O07 g7oWind: the winding-engine house behind the headframe (the landing of the proper fall): a tall brick hall on brick
    // piers (bk) and walls (bkw) with tall arched windows, a timber louvre on the ridge, the drum and engine inside (decor).
    V5_PARTS.g7oWind = function(P){
      var n0 = blocks.length, hx = P.hx || 5.0, hz = P.hz || 3.2, h = P.h || 5.4, MT = api.mat("brick");
      var base = addBlock(0, -0.25, 0, 2*hx + 3, 0.5, 2*hz + 3, "base", {anchor:true}); kd(base, "box", K.coal, 0, 0.03, 0, 2*hx + 2.6, 0.06, 2*hz + 2.6);
      var st = H.boxSt({ y0:0, h:h, hx:hx, hz:hz, nx:4, nz:2, pw:0.7, mw:0.65, fl:0, MT:MT, deck:"mdB", skin:"wall", wall:"bkw", dk:0.35, tp:K.brickD, td:K.brickD, tw:K.brick, split:[2, 1] });
      st.walls.forEach(function(w, j){ var L2 = 2*Math.max(w.half[0], w.half[2]); onF(w, "box", K.stoneD, 0, -h/2 + 0.35, L2, 0.5, 0.07); onF(w, "box", K.cream, 0, h*0.44, L2, 0.14, 0.07);
        if(L2 > 1.2){ onF(w, "box", K.cream, 0, -h*0.15, Math.min(1.2, L2*0.45) + 0.24, 0.12, 0.1); onF(w, "box", (j % 2) ? K.lit : K.glassD, 0, h*0.05, Math.min(1.2, L2*0.45), h*0.4, 0.08); onF(w, "ibox", K.white, 0, h*0.05, 0.06, h*0.4, 0.1); } });
      st.decks.forEach(function(d){ kd(d, "icyl", K.iron, d.spawn.x, 1.8, 0, 2.6, 1.4, 2.6, Math.PI/2, 0, 0); kd(d, "icyl", K.red, d.spawn.x, 1.8, 0, 1.0, 1.6, 1.0, Math.PI/2, 0, 0); });
      var at = roofBody(0, 0, h, hx - 0.02, hz - 0.02, 0.6, 1, 2.2, K.slate, K.slateD, 1, K.brick);
      kd(at, "box", K.wood, 0, h + 3.1, 0, 2*hx*0.5, 0.8, 0.9); kd(at, "box", K.slateD, 0, h + 3.6, 0, 2*hx*0.5 + 0.3, 0.14, 1.2);
      if(P.bg) bgSet(n0, P.bg); return { w:2*hx + 3, d:2*hz + 3 };
    };
    // ---- O07 g7oLamp: a lamp-room / pithead baths block (a side building): two brick storeys and a timber attic storey with a dormer
    // band, a clock board on the front, a gabled slate roof body; P.side mirrors the pair.
    V5_PARTS.g7oLamp = function(P){
      var n0 = blocks.length, hx = P.hx || 3.2, hz = P.hz || 2.8, side = P.side || 1, y = 0, s, sts = [];
      var base = addBlock(0, -0.25, 0, 2*hx + 4, 0.5, 2*hz + 4, "base", {anchor:true}); kd(base, "box", K.coal, 0, 0.03, 0, 2*hx + 3.6, 0.06, 2*hz + 3.6);
      for(s = 0; s < 3; s++){ var h = s === 2 ? 2.8 : s ? 3.1 : 3.5, wd = s === 2;
        var st = H.boxSt({ y0:y, h:h, hx:hx, hz:hz, nx:3, nz:2, pw:wd ? 0.45 : 0.6, mw:wd ? 0.42 : 0.55, fl:s, MT:api.mat(wd ? "wood" : "brick"), deck:wd ? "mdW" : "mdB", skin:"wall", mat:wd ? "wood" : "brick", wall:wd ? "wwall" : "bkw", dk:0.3, tp:wd ? K.woodD : K.brickD, td:K.brickD, tw:wd ? K.cream : K.brick });
        sts.push(st);
        st.walls.forEach(function(w, j){ var L2 = 2*Math.max(w.half[0], w.half[2]); if(!wd) for(var q = 0; q < 5; q++) onF(w, "ibox", K.brickD, 0, -h*0.35 + q*h*0.15, L2, 0.035, 0.04);
          if(!s && w.a1face === "z+" && j % 2 === 0){ onF(w, "box", K.navy, 0, -0.45, 1.0, 2.2, 0.08); onF(w, "box", K.cream, 0, 0.8, 1.5, 0.14, 0.12); }
          else if(L2 > 1.2) win(w, 0, 0.2, Math.min(1.0, L2*0.36), wd ? 0.8 : 1.15, (j + s) % 3 === 0, wd ? 0 : K.navy); });
        y += h; }
      var at = roofBody(0, 0, y, hx - 0.02, hz - 0.02, 0.5, 3, 2.0, K.slate, K.slateD, 1, K.cream);
      kd(at, "cyl", K.white, 0, y - 1.4, hz + 0.08, 1.0, 0.08, 1.0, Math.PI/2, 0, 0); kd(at, "ibox", K.ink, 0, y - 1.25, hz + 0.14, 0.06, 0.35, 0.03);
      kd(at, "box", K.brickD, -side*hx*0.5, y + 1.9, -0.3, 0.7, 1.8, 0.8);
      if(P.bg) bgSet(n0, P.bg); return { w:2*hx + 4, d:2*hz + 4 };
    };
    // ---- O09 g7oStand: a football grandstand. Three stepped tiers of seats (grey concrete posts + concrete decks mdC; the seat rows,
    // aisles and the pitch wall are decor), a back row of tall grey columns with concrete panels (cpan) and a steel-framed roof on
    // slim steel front posts (steel, mdS roof deck) with its fascia; dugouts and a tunnel mouth in front (decor on the pad).
    V5_PARTS.g7oStand = function(P){
      var n0 = blocks.length, hx = P.hx || 7.6, nx = P.nx || 5, TH = 1.5, D = 2.2, MT = api.mat("concrete"), xs = [], i, k;
      var base = addBlock(0, -0.25, 0, 2*hx + 3, 0.5, 3*D + 6, "base", {anchor:true}); kd(base, "box", K.apron, 0, 0.03, 0, 2*hx + 2.6, 0.06, 3*D + 5.6);
      kd(base, "box", K.lawn, 0, 0.05, 3*D/2 + 2.2, 2*hx + 2.6, 0.04, 2.0); kd(base, "box", K.white, 0, 0.08, 3*D/2 + 1.3, 2*hx + 2.6, 0.03, 0.12);
      for(i = 0; i < nx; i++) xs.push(-hx + 0.4 + i*(2*hx - 0.8)/(nx - 1));
      var z0 = 3*D/2, decks = [];
      // the tiers: tier k is a deck at TH*(k+1) over a band D deep, on a row of posts under its front edge (the back edge rests on
      // the next tier's posts); seats decor on each deck
      for(k = 0; k < 3; k++){ var zc = z0 - D/2 - k*D, yk = TH*(k + 1);
        xs.forEach(function(x, j){ mem("concrete", x, (yk - 0.3)/2, zc + D/2 - 0.3, 0.5, yk - 0.3, 0.5, 0, j, k, K.conc); });   // every post stands on the ground: floor 0 (the base rule reads the whole foot)
        for(i = 0; i < nx - 1; i++){ var d = mem("mdC", (xs[i] + xs[i + 1])/2, yk - 0.15, zc, xs[i + 1] - xs[i] + 0.02, 0.3, D, k, null, null, K.concL); decks.push(d);
          for(var r = 0; r < 2; r++) kd(d, "box", [K.red, K.white][(i + r + k) % 2], d.spawn.x, yk + 0.2, zc + 0.5 - r*0.9, d.half[0]*2 - 0.1, 0.35, 0.45);
          kd(d, "ibox", K.concD, xs[i] + 0.05, yk + 0.1, zc, 0.5, 0.15, D - 0.2); } }
      // the back: tall grey columns and concrete panels up to the roof; the steel roof on slim front posts
      var zb = z0 - 3*D - 0.3, RH = P.rh || 8.4, cols = [];
      xs.forEach(function(x, j){ cols.push(mem("concrete", x, RH/2, zb, 0.7, RH, 0.7, 0, j, 3, K.conc)); });
      for(i = 0; i < nx - 1; i++){ var w = mem("cpan", (xs[i] + xs[i + 1])/2, (RH - 0.4)/2, zb - 0.05, xs[i + 1] - xs[i] - 0.72, RH - 0.4, 0.24, 3, null, null, K.concL); w.a1face = "z-";
        kd(w, "box", K.navy, w.spawn.x, RH - 1.2, zb + 0.14, w.half[0]*2 - 0.2, 0.5, 0.04); }
      var zf = z0 - D + 0.2, fps = [];
      [0, nx - 1].concat(nx > 4 ? [Math.floor(nx/2)] : []).forEach(function(j){ fps.push(mem("steel", xs[j], (RH + TH*1)/2, zf, 0.4, RH - TH*1, 0.4, 3, j, 4, K.cranePaint)); });
      var rz = (zf + zb)/2, rd = zf - zb + 1.2;
      for(i = 0; i < 2; i++){ var rx = -hx/2 + i*hx, rf = mem("mdS", rx, RH + 0.2, rz, hx + 0.02, 0.4, rd, 4, null, null, K.cranePaint);
        kd(rf, "box", K.white, rx, RH + 0.2, zf + 0.62, hx, 0.7, 0.1); kd(rf, "box", K.navy, rx, RH + 0.45, zf + 0.68, hx - 0.4, 0.3, 0.04);
        for(var q = 0; q < 4; q++) kd(rf, "ibox", K.cranePaintD, rx - hx/2 + (q + 0.5)*hx/4, RH - 0.1, rz, 0.12, 0.25, rd - 0.2); }
      [-1, 1].forEach(function(e){ kd(base, "ibox", K.navy, e*3.5, 0.6, z0 + 0.9, 2.4, 1.2, 0.9); kd(base, "ibox", K.glass, e*3.5, 0.8, z0 + 1.36, 2.2, 0.5, 0.04); });   // the dugouts
      kd(base, "ibox", K.concD, 0, 0.7, z0 + 0.5, 1.6, 1.4, 0.4);
      if(P.bg) bgSet(n0, P.bg); return { w:2*hx + 3, d:3*D + 6 };
    };
    // ---- O09 g7oFlood: a floodlight tower. Four grey concrete pedestals (concrete), three storeys of steel legs (steel) with
    // X-braces and a ladder, the lamp head (a steel deck mdS with the lamp bank as decor, tilted toward the pitch, P.side).
    V5_PARTS.g7oFlood = function(P){
      var n0 = blocks.length, hx = P.hx || 1.7, PH = P.ph || 2.0, LH = P.lh || 5.0, side = P.side || 1, y = 0, s, l;
      var base = addBlock(0, -0.25, 0, 2*hx + 3, 0.5, 2*hx + 3, "base", {anchor:true}); kd(base, "box", K.apron, 0, 0.03, 0, 2*hx + 2.6, 0.06, 2*hx + 2.6);
      H.boxSt({ y0:0, h:PH, hx:hx, hz:hx, nx:2, nz:2, pw:0.9, mw:0.9, fl:0, MT:api.mat("concrete"), deck:"mdC", skin:"open", dk:0.35, tp:K.conc, td:K.concD });
      y = PH;
      for(s = 0; s < (P.ns || 3); s++){ var hs = hx - 0.1 - s*0.15;
        l = H.boxSt({ y0:y, h:LH, hx:hs, hz:hs, nx:2, nz:2, pw:0.4, mw:0.4, fl:s + 1, MT:api.mat("steel"), deck:"mdS", skin:"open", dk:0.3, tp:K.white, td:K.concD });
        [[0, 1], [0, -1], [1, 0], [-1, 0]].forEach(function(f){ var X = !!f[0], a = hs - 0.25, c = (X ? f[0] : f[1])*(hs - 0.25);
          var p1 = H.near(l.piers, X ? f[0]*hs : -hs, X ? -hs : f[1]*hs), p2 = H.near(l.piers, X ? f[0]*hs : hs, X ? hs : f[1]*hs);
          bar(p1, K.concD, X ? c : -a, y + 0.3, X ? -a : c, X ? c : a, y + LH - 0.6, X ? a : c, 0.1); bar(p2, K.concD, X ? c : a, y + 0.3, X ? a : c, X ? c : -a, y + LH - 0.6, X ? -a : c, 0.1); });
        y += LH; }
      var top = l.decks[0];
      kq(top, "box", K.navy, 0, y + 1.3, 0, 3.6, 2.2, 0.3, 0, -side*0.0 + 0.3, 0);
      for(var r = 0; r < 3; r++) for(var c = 0; c < 4; c++) kq(top, "lit", K.warm, -1.3 + c*0.86, y + 0.6 + r*0.7, 0.2, 0.6, 0.5, 0.1, 0, 0.3, 0);
      kd(top, "box", K.white, 0, y + 0.15, 0, 2*hx, 0.1, 2*hx);
      if(P.bg) bgSet(n0, P.bg); return { w:2*hx + 3, d:2*hx + 3 };
    };
    // ---- O10 g7oPav: a seaside pier pavilion on its pier head. Grey concrete pile caps (concrete) carry steel trestle legs (steel) and
    // a timber pier deck (mdW); on the deck the pavilion: a brick ground storey (bk + bkw, arched windows), a timber upper storey with
    // a balcony and white rails (wpost + wwall), a tiled pyramid roof body with a flag turret; the sea round the piles (decor).
    V5_PARTS.g7oPav = function(P){
      var n0 = blocks.length, hx = P.hx || 4.0, hz = P.hz || 3.4, PH = P.ph || 1.9, LH = P.lh || 2.6, y = 0;
      var base = addBlock(0, -0.25, 0, 2*hx + 6, 0.5, 2*hz + 6, "base", {anchor:true}); kd(base, "box", K.water, 0, 0.02, 0, 2*hx + 5.6, 0.05, 2*hz + 5.6); kd(base, "box", K.sand, 0, 0.04, -hz - 2.2, 2*hx + 5.6, 0.04, 1.4);
      H.boxSt({ y0:0, h:PH, hx:hx, hz:hz, nx:3, nz:3, pw:1.0, mw:0.95, fl:0, MT:api.mat("concrete"), deck:"mdC", skin:"open", dk:0.35, tp:K.conc, td:K.concD });
      y = PH;
      var l = H.boxSt({ y0:y, h:LH, hx:hx, hz:hz, nx:3, nz:3, pw:0.45, mw:0.45, fl:1, MT:api.mat("steel"), deck:"mdW", skin:"open", dk:0.35, tp:K.cranePaint, td:K.woodL, split:[2, 2] });
      l.piers.forEach(function(p){ kd(p, "box", K.cranePaintD, p.spawn.x, y + LH*0.5, p.spawn.z, 0.1, LH - 0.6, 2*p.half[2] + 0.5); });
      l.decks.forEach(function(d){ for(var q = 0; q < 5; q++) kd(d, "ibox", K.woodD, d.spawn.x, y + LH + 0.02, d.spawn.z - d.half[2] + (q + 0.5)*d.half[2]*0.4, 2*d.half[0] - 0.1, 0.03, 0.05); });
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function(f){ var X = !!f[0], dk = H.near(l.decks, f[0]*hx, f[1]*hz); kd(dk, "box", K.white, f[0]*(hx - 0.1), y + LH + 0.95, f[1]*(hz - 0.1), X ? 0.08 : 2*hx, 0.1, X ? 2*hz : 0.08);
        for(var q = -3; q <= 3; q++) kd(dk, "ibox", K.white, X ? f[0]*(hx - 0.1) : q*hx/3.3, y + LH + 0.5, X ? q*hz/3.3 : f[1]*(hz - 0.1), 0.06, 0.9, 0.06); });
      y += LH;
      var ph = hx - 1.0, pz = hz - 1.0;
      var g = H.boxSt({ y0:y, h:3.4, hx:ph, hz:pz, nx:3, nz:3, pw:0.6, mw:0.55, fl:2, MT:api.mat("brick"), deck:"mdB", skin:"wall", wall:"bkw", dk:0.3, tp:K.brickD, td:K.brickD, tw:K.brickL });
      g.walls.forEach(function(w, j){ var L2 = 2*Math.max(w.half[0], w.half[2]); onF(w, "box", K.cream, 0, 1.45, L2, 0.14, 0.07);
        if(w.a1face === "z+" && j % 2 === 0){ onF(w, "box", K.green, 0, -0.45, 1.1, 2.3, 0.08); onF(w, "box", K.cream, 0, 0.85, 1.6, 0.14, 0.12); } else if(L2 > 1.0) win(w, 0, 0.2, Math.min(1.0, L2*0.45), 1.3, (j % 3) === 0, 0); });
      y += 3.4;
      var u = H.boxSt({ y0:y, h:3.0, hx:ph, hz:pz, nx:3, nz:3, pw:0.42, mw:0.4, fl:3, MT:api.mat("wood"), deck:"mdW", skin:"wall", mat:"wood", wall:"wwall", dk:0.28, tp:K.white, td:K.woodD, tw:K.seaGreen });
      u.walls.forEach(function(w, j){ var L2 = 2*Math.max(w.half[0], w.half[2]); onF(w, "box", K.white, 0, 1.3, L2, 0.12, 0.07); if(L2 > 1.0) win(w, 0, 0.15, Math.min(1.1, L2*0.5), 1.2, (j % 3) === 1, 0); });
      var gd = H.near(g.decks, 0, 0); [[0, 1]].forEach(function(f){ kd(gd, "box", K.woodL, 0, y - 0.05, pz + 0.55, 2*ph, 0.12, 1.1); kd(gd, "box", K.white, 0, y + 0.9, pz + 1.05, 2*ph, 0.1, 0.08); });   // the balcony
      y += 3.0;
      var at = mem("g7roofL", 0, y + 0.3, 0, 2*ph - 0.1, 0.6, 2*pz - 0.1, 4, null, null, K.tile); at.tint = K.tile;
      kd(at, "box", K.white, 0, y + 0.62, 0, 2*ph + 0.6, 0.14, 2*pz + 0.6); kd(at, "cone", K.seaGreen, 0, y + 1.9, 0, 2*ph + 0.5, 2.6, 2*pz + 0.5);
      kd(at, "box", K.white, 0, y + 3.5, 0, 1.0, 1.0, 1.0); kd(at, "cone", K.red, 0, y + 4.5, 0, 1.3, 1.0, 1.3); kd(at, "icyl", K.iron, 0, y + 5.5, 0, 0.05, 1.2, 0.05); kd(at, "ibox", K.red, 0.35, y + 5.8, 0, 0.6, 0.4, 0.03);
      if(P.bg) bgSet(n0, P.bg); return { w:2*hx + 6, d:2*hz + 6 };
    };
    // ---- O10 g7oHuts: a row of timber bathing huts on a low boardwalk (the pavilion's landing): P.n huts, each its own bond group
    // (they lean on each other), striped plank walls (wwall) on corner posts (wpost), a little gabled roof (decor on the deck), steps.
    V5_PARTS.g7oHuts = function(P){
      var n0 = blocks.length, n = P.n || 5, w = P.w || 1.8, hz = P.hz || 1.4, h = P.h || 2.4, gap = 0.25, W = n*w + (n - 1)*gap, MT = api.mat("wood"), cols = [K.red, K.seaGreen, K.yellow, K.navy, K.orange];
      var base = addBlock(0, -0.25, 0, W + 2, 0.5, 2*hz + 2.4, "base", {anchor:true}); kd(base, "box", K.sand, 0, 0.03, 0, W + 1.6, 0.06, 2*hz + 2.0); kd(base, "box", K.woodL, 0, 0.1, hz + 0.6, W + 0.4, 0.12, 0.8);
      for(var k = 0; k < n; k++){ var cx = -W/2 + w/2 + k*(w + gap), nS = blocks.length, c = cols[k % cols.length];
        var st = H.boxSt({ y0:0, h:h, hx:w/2, hz:hz, cx:cx, nx:2, nz:2, pw:0.28, mw:0.28, fl:0, MT:MT, deck:"mdW", skin:"wall", mat:"wood", wall:"wwall", dk:0.2, tp:K.white, td:K.woodD, tw:K.white });
        st.walls.forEach(function(wl){ var L2 = 2*Math.max(wl.half[0], wl.half[2]); for(var q = -2; q <= 2; q += 2) onF(wl, "ibox", c, q*L2/6, 0, L2/6, h - 0.3, 0.04); if(wl.a1face === "z+") onF(wl, "box", c, 0, -0.2, 0.7, 1.6, 0.07); });
        var d = st.decks[0]; [-1, 1].forEach(function(s){ kq(d, "box", c, cx, h + 0.35, s*hz/2, w + 0.3, 0.12, hz + 0.25, 0, s*0.55, 0); }); kd(d, "prism", K.white, cx, h + 0.35, hz - 0.02, 0.1, 0.7, w, 0, Math.PI/2, 0);
        bgSet(nS, (P.bg0 || 81) + k); }
      return { w:W + 2, d:2*hz + 2.4 };
    };
    // ---- O13 g7oMono: a monorail station. An open ground storey of grey concrete columns (concrete) under a concrete platform deck,
    // the platform level of slim steel posts (steel) with a steel canopy deck (mdS), the guideway beam and a parked train (decor),
    // a stair and a ticket kiosk (decor). The viaduct spans (g7oSpan) rest on its platform edges: when it goes, they go.
    V5_PARTS.g7oMono = function(P){
      var n0 = blocks.length, hx = P.hx || 4.2, hz = P.hz || 2.6, GH = P.gh || 6.0, y = 0;
      var base = addBlock(0, -0.25, 0, 2*hx + 4, 0.5, 2*hz + 5, "base", {anchor:true}); kd(base, "box", K.apron, 0, 0.03, 0, 2*hx + 3.6, 0.06, 2*hz + 4.6);
      var g = H.boxSt({ y0:0, h:GH, hx:hx, hz:hz, nx:3, nz:2, pw:0.95, mw:0.9, fl:0, MT:api.mat("concrete"), deck:"mdC", skin:"open", dk:0.6, tp:K.conc, td:K.concL, split:[2, 1] });
      g.piers.forEach(function(p){ kd(p, "box", K.concD, p.spawn.x, 0.3, p.spawn.z, 2*p.half[0] + 0.14, 0.6, 2*p.half[2] + 0.14); kd(p, "box", K.concL, p.spawn.x, GH - 0.9, p.spawn.z, 2*p.half[0] + 0.5, 0.4, 2*p.half[2] + 0.3); });
      var g0 = H.near(g.decks, -hx, 0); for(var q = 0; q < 9; q++) kd(g0, "ibox", K.concD, -hx + 1.0 + q*0.35, 0.3 + q*(GH - 0.6)/9, hz + 0.9, 0.5, 0.12, 1.2);   // the stair
      kd(H.near(g.decks, hx, 0), "ibox", K.orange, hx - 1.6, 1.3, 0, 1.6, 2.6, 1.6); kd(H.near(g.decks, hx, 0), "ibox", K.glass, hx - 1.6, 1.6, 0.81, 1.2, 0.8, 0.04);   // the ticket kiosk
      y = GH;
      var pl = H.boxSt({ y0:y, h:3.4, hx:hx, hz:hz, nx:3, nz:2, pw:0.35, mw:0.35, fl:1, MT:api.mat("steel"), deck:"mdS", skin:"open", dk:0.3, tp:K.white, td:K.monoRoof, split:[2, 1] });
      g.decks.forEach(function(d){ kd(d, "box", K.yellow, d.spawn.x, y + 0.02, hz - 0.5, 2*d.half[0], 0.03, 0.2); kd(d, "box", K.concD, d.spawn.x, y + 0.35, -0.6, 2*d.half[0], 0.7, 1.0);
        kd(d, "ibox", K.white, d.spawn.x, y + 1.45, -0.6, 2*d.half[0] - 0.2, 1.4, 1.4); kd(d, "ibox", K.monoRoof, d.spawn.x, y + 2.25, -0.6, 2*d.half[0] - 0.4, 0.3, 1.2); kd(d, "lit", K.lit, d.spawn.x, y + 1.6, 0.13, 2*d.half[0] - 0.8, 0.5, 0.04); });
      pl.decks.forEach(function(d){ kd(d, "box", K.white, d.spawn.x, y + 3.55, hz + 0.05, 2*d.half[0], 0.3, 0.1); kd(d, "lit", K.warm, d.spawn.x, y + 3.0, 0.5, 1.4, 0.1, 0.4); });
      kd(H.near(pl.decks, 0, 0), "box", K.navy, 0, y + 3.95, hz + 0.1, 3.6, 0.6, 0.08);
      LV7.g7info = Object.assign(LV7.g7info || {}, { mono:{ members:blocks.length - n0, deckY:GH } });
      if(P.bg) bgSet(n0, P.bg); return { w:2*hx + 4, d:2*hz + 5 };
    };
    // ---- O13 g7oSpan: one viaduct span beside the station. A pair of grey concrete columns (concrete) at its outer end, a concrete
    // cross-head, the steel guideway beam (mdS) reaching in to REST on the station's platform edge (own bond group: never glued to
    // it), a train car on it (decor). P.side = -1 left, 1 right; P.len = the beam length; P.y = the station deck top.
    V5_PARTS.g7oSpan = function(P){
      var n0 = blocks.length, side = P.side || 1, len = P.len || 7.0, Y = P.y || 6.0, hz = P.hz || 2.0, ox = side*(len/2 - 0.8);
      var base = addBlock(ox, -0.25, 0, 3.4, 0.5, 2*hz + 2, "base", {anchor:true}); kd(base, "box", K.apron, ox, 0.03, 0, 3.0, 0.06, 2*hz + 1.6);
      var cols = [-1, 1].map(function(e){ return mem("concrete", ox, (Y - 0.6)/2, e*(hz - 0.5), 0.9, Y - 0.6, 0.9, 0, 0, e > 0 ? 1 : 0, K.conc); });
      var ch = mem("mdC", ox, Y - 0.3, 0, 1.4, 0.6, 2*hz, 0, null, null, K.concL);
      var bm = mem("mdS", 0, Y + 0.35, -0.6, len, 0.7, 1.2, 1, null, null, K.concD); bm.tint = K.concD;
      kd(bm, "ibox", K.white, side*0.4, Y + 1.45, -0.6, len*0.55, 1.4, 1.4); kd(bm, "ibox", K.monoRoof, side*0.4, Y + 2.25, -0.6, len*0.5, 0.3, 1.2); kd(bm, "lit", K.lit, side*0.4, Y + 1.6, 0.13, len*0.4, 0.5, 0.04);
      cols.forEach(function(c){ kd(c, "box", K.concD, c.spawn.x, 0.3, c.spawn.z, 1.04, 0.6, 1.04); });
      if(P.bg) bgSet(n0, P.bg); return { w:len, d:2*hz + 2 };
    };
    // ---- O15 g7oGas: a gasholder. Eight brick pedestals (bk) in a ring carry eight steel standards (steel) in two tiers, tied by
    // steel girder decks (mdS) at each tier; the holder bell inside (a brick tank wall of bkw panels with a domed crown, decor on the
    // panels), a ladder up a standard, the gas-works name band. Two pedestals side by side gone and the frame leans that way.
    V5_PARTS.g7oGas = function(P){
      var n0 = blocks.length, r = P.r || 4.2, PH = P.ph || 2.4, SH = P.sh || 5.4, y = 0, s;
      var base = addBlock(0, -0.25, 0, 2*r + 5, 0.5, 2*r + 5, "base", {anchor:true}); kd(base, "box", K.coal, 0, 0.03, 0, 2*r + 4.6, 0.06, 2*r + 4.6);
      kd(base, "icyl", K.brickD, 0, 0.3, 0, 2*r - 0.6, 0.6, 2*r - 0.6);   // the tank rim
      var ped = H.octSt({ y0:0, h:PH, r:r, cw:1.0, fl:0, MT:api.mat("brick"), wall:null, dk:0.4, tp:K.brick, td:K.brickD });
      ped.posts.forEach(function(p){ kd(p, "box", K.cream, p.spawn.x, PH - 0.55, p.spawn.z, 1.14, 0.18, 1.14); });
      y = PH;
      for(s = 0; s < 2; s++){
        var st = H.octSt({ y0:y, h:SH, r:r - 0.1, cw:0.5, fl:s + 1, MT:api.mat("steel"), wall:s === 0 ? "bkw" : null, dk:0.35, tp:K.gasPaint, td:K.gasPaintD, tw:K.brick });
        st.posts.forEach(function(p, k){ var q = st.posts[(k + 1) % 8]; if(!q) return; });
        st.walls.forEach(function(w){ var L2 = 2*Math.max(w.half[0], w.half[2]); onF(w, "box", K.brickD, 0, SH*0.38, L2, 0.2, 0.06); for(var q = 0; q < 6; q++) onF(w, "ibox", K.brickD, 0, -SH*0.4 + q*SH*0.13, L2, 0.04, 0.04); });
        st.decks.forEach(function(d){ kd(d, "box", K.gasPaint, d.spawn.x, y + SH - 0.05, d.spawn.z, 2*d.half[0] + 0.1, 0.12, 2*d.half[2] + 0.1); });
        // lattice girders between the standards (decor on the deck nearest each bay)
        for(var k = 0; k < 8; k++){ var a0 = (k + 0.5)*Math.PI/4, a1 = (k + 1.5)*Math.PI/4, R = r - 0.35, x0 = Math.cos(a0)*R, z0 = Math.sin(a0)*R, x1 = Math.cos(a1)*R, z1 = Math.sin(a1)*R, hd = H.near(st.decks, (x0 + x1)/2, (z0 + z1)/2);
          bar(hd, K.gasPaint, x0, y + SH - 0.4, z0, x1, y + SH - 0.4, z1, 0.18); bar(hd, K.gasPaintD, x0, y + SH - 1.1, z0, x1, y + SH - 0.4, z1, 0.08); bar(hd, K.gasPaintD, x0, y + SH - 0.4, z0, x1, y + SH - 1.1, z1, 0.08); }
        if(s === 0){ var c0 = H.near(st.decks, 0, 0); kd(c0, "icyl", K.gasBell, 0, y + SH*0.55, 0, 2*r - 2.0, SH*0.9, 2*r - 2.0); kd(c0, "dome", K.gasBell, 0, y + SH + 0.5, 0, 2*r - 2.0, 1.4, 2*r - 2.0); kd(c0, "icyl", K.gasPaintD, 0, y + SH*0.2, 0, 2*r - 1.9, 0.15, 2*r - 1.9); }
        y += SH; }
      var t0 = H.near(st.decks, r, 0); for(var q = 0; q < 16; q++) kd(t0, "ibox", K.iron, r + 0.15, PH + 0.4 + q*(2*SH)/16, 0.3, 0.05, 0.05, 0.6); kd(t0, "icyl", K.iron, r + 0.15, PH + SH, 0.0, 0.05, 2*SH, 0.05);
      kd(H.near(st.decks, 0, r), "lit", 0xFF5A4A, 0, y + 0.3, r - 0.4, 0.25, 0.25, 0.25);
      if(P.bg) bgSet(n0, P.bg); return { w:2*r + 5, d:2*r + 5 };
    };
    // ---- O15 g7oRetort: the retort house in front of the holder (its landing): a long brick hall on brick piers (bk), arched bays
    // (decor), a timber louvre on the ridge, a tiled roof body; coke barrows and a weigh-bridge in front (decor on the pad).
    V5_PARTS.g7oRetort = function(P){
      var n0 = blocks.length, hx = P.hx || 5.6, hz = P.hz || 2.2, h = P.h || 3.4;
      var base = addBlock(0, -0.25, 0, 2*hx + 2.5, 0.5, 2*hz + 3, "base", {anchor:true}); kd(base, "box", K.coal, 0, 0.03, 0, 2*hx + 2.1, 0.06, 2*hz + 2.6);
      var st = H.boxSt({ y0:0, h:h, hx:hx, hz:hz, nx:5, nz:2, pw:0.6, mw:0.55, fl:0, MT:api.mat("brick"), deck:"mdB", skin:{ "z-":"wall", "x-":"wall", "x+":"wall", def:"open" }, wall:"bkw", dk:0.3, tp:K.brick, td:K.brickD, tw:K.brickL, split:[2, 1] });
      st.walls.forEach(function(w){ var L2 = 2*Math.max(w.half[0], w.half[2]); for(var q = 0; q < 5; q++) onF(w, "ibox", K.brickD, 0, -h*0.4 + q*h*0.18, L2, 0.04, 0.04); });
      st.decks.forEach(function(d){ for(var q = -1; q <= 1; q++) kd(d, "ibox", K.ink, d.spawn.x + q*1.6, 1.0, -hz + 0.6, 1.0, 1.0, 0.3); kd(d, "lit", 0xFF8A4A, d.spawn.x, 1.0, -hz + 0.78, 2.8, 0.4, 0.04); });
      var at = roofBody(0, 0, h, hx - 0.02, hz - 0.02, 0.4, 1, 1.6, K.slate, K.slateD, 1, K.brick);
      kd(at, "box", K.wood, 0, h + 2.1, 0, 2*hx*0.6, 0.6, 0.9); kd(at, "box", K.slateD, 0, h + 2.45, 0, 2*hx*0.6 + 0.3, 0.12, 1.2);
      [-1, 1].forEach(function(e){ kd(base, "ibox", K.iron, e*hx*0.5, 0.45, hz + 1.2, 0.9, 0.5, 0.6); kd(base, "ibox", K.coal, e*hx*0.5, 0.75, hz + 1.2, 0.8, 0.2, 0.5); });
      if(P.bg) bgSet(n0, P.bg); return { w:2*hx + 2.5, d:2*hz + 3 };
    };
    // ---- O12 g7oScreen: a drive-in cinema screen. Grey concrete footings (concrete) in a row, two storeys of steel posts (steel) with
    // steel girder decks (mdS), the screen itself = white timber panels (wwall) across the front of both storeys with a dark border and
    // a painted frame (decor), back bracing and a catwalk (decor), a sign board on top with bulbs (decor on the top deck).
    V5_PARTS.g7oScreen = function(P){
      var n0 = blocks.length, hx = P.hx || 7.0, hz = P.hz || 1.6, FH = P.fh || 2.2, SH = P.sh || 4.4, nx = P.nx || 4, y = 0, s, st;
      var base = addBlock(0, -0.25, 0, 2*hx + 3, 0.5, 2*hz + 4, "base", {anchor:true}); kd(base, "box", K.apron, 0, 0.03, 0, 2*hx + 2.6, 0.06, 2*hz + 3.6);
      H.boxSt({ y0:0, h:FH, hx:hx, hz:hz, nx:nx, nz:2, pw:1.0, mw:0.95, fl:0, MT:api.mat("concrete"), deck:"mdC", skin:"open", dk:0.35, tp:K.conc, td:K.concD, split:[3, 1] });
      y = FH;
      for(s = 0; s < 2; s++){
        st = H.boxSt({ y0:y, h:SH, hx:hx, hz:hz, nx:nx, nz:2, pw:0.45, mw:0.42, fl:s + 1, MT:api.mat("steel"), deck:"mdS", skin:{ "z+":"wall", def:"open" }, mat:"wood", wall:"wwall", dk:0.3, tp:K.iron, td:K.iron, tw:K.white, split:[3, 1] });
        st.walls.forEach(function(w){ var L2 = 2*w.half[0]; onF(w, "box", K.screenW, 0, 0, L2 + 0.04, SH - 0.2, 0.05); if(s === 0) onF(w, "box", K.ink, 0, -SH/2 + 0.25, L2 + 0.04, 0.5, 0.07); else onF(w, "box", K.ink, 0, SH/2 - 0.3, L2 + 0.04, 0.5, 0.07); });
        st.piers.forEach(function(p){ if(p.a1z < 0) bar(p, K.iron, p.spawn.x, y + 0.2, p.spawn.z, p.spawn.x, y + SH - 0.4, p.spawn.z + 1.4, 0.12); });
        y += SH; }
      var top = st.decks;
      top.forEach(function(d, j){ kd(d, "box", K.red, d.spawn.x, y + 0.75, hz - 0.3, 2*d.half[0] - 0.1, 1.3, 0.2); for(var q = 0; q < 5; q++) kd(d, "lit", K.lit, d.spawn.x - d.half[0] + (q + 0.5)*d.half[0]*0.4, y + 1.48, hz - 0.18, 0.18, 0.18, 0.1);
        kd(d, "box", K.yellow, d.spawn.x, y + 0.75, hz - 0.18, 2*d.half[0] - 0.6, 0.5, 0.05); });
      if(P.bg) bgSet(n0, P.bg); return { w:2*hx + 3, d:2*hz + 4 };
    };
    // ---- O12 g7oBooth: the projection booth + snack bar in front of the screen (its landing): grey concrete posts (concrete) and
    // panels (cpan) round a projector room, a timber snack counter wing with a striped awning (wpost + wwall), parked cars and
    // speaker posts round it (decor on the pad).
    V5_PARTS.g7oBooth = function(P){
      var n0 = blocks.length, hx = P.hx || 4.6, hz = P.hz || 2.2, h = P.h || 3.0;
      var base = addBlock(0, -0.25, 0, 2*hx + 6, 0.5, 2*hz + 5, "base", {anchor:true}); kd(base, "box", K.apron, 0, 0.03, 0, 2*hx + 5.6, 0.06, 2*hz + 4.6);
      var st = H.boxSt({ y0:0, h:h, hx:hx, hz:hz, nx:4, nz:2, pw:0.45, mw:0.42, fl:0, MT:api.mat("concrete"), deck:"mdC", skin:{ "z-":"wall", "x-":"wall", "x+":"wall", def:"open" }, wall:"cpan", dk:0.3, tp:K.conc, td:K.concD, tw:K.concL, split:[2, 1] });
      st.decks.forEach(function(d, j){ var dx = d.spawn.x; kd(d, "ibox", K.wood, dx, 0.55, 0.6, 2*d.half[0] - 0.6, 1.1, 0.6); kd(d, "ibox", K.white, dx, 1.12, 0.6, 2*d.half[0] - 0.5, 0.06, 0.7);
        for(var q = 0; q < 4; q++) kq(d, "box", q % 2 ? K.white : K.red, dx - d.half[0] + (q + 0.5)*d.half[0]/2, h - 0.2, hz + 0.6, d.half[0]/2, 0.07, 1.3, 0, 0.35, 0);
        kd(d, "lit", K.lit, dx, h - 0.5, -0.4, 1.2, 0.2, 0.6); });
      var at = mem("g7roofL", 0, h + 0.3, 0, 2*hx - 0.1, 0.6, 2*hz - 0.1, 1, null, null, K.concL); at.tint = K.concL;
      kd(at, "ibox", K.ink, 0, h + 1.2, -0.4, 1.8, 1.2, 1.4); kd(at, "ibox", K.glass, 0, h + 1.25, 0.31, 1.2, 0.4, 0.04); kd(at, "lit", K.warm, 0, h + 1.25, -1.15, 0.4, 0.3, 0.05);   // the projector room
      [[-1, 0], [1, 1]].forEach(function(q, k){ var cx = q[0]*(hx + 2.0); kd(base, "ibox", [K.seaGreen, K.red][k], cx, 0.7, 0.3, 1.8, 0.8, 3.6); kd(base, "ibox", K.white, cx, 1.35, 0.1, 1.6, 0.6, 2.0); kd(base, "ibox", K.glass, cx, 1.4, 1.13, 1.4, 0.4, 0.04);
        kd(base, "icyl", K.iron, cx + 1.2, 0.6, 1.8, 0.08, 1.2, 0.08); });
      if(P.bg) bgSet(n0, P.bg); return { w:2*hx + 6, d:2*hz + 5 };
    };
    // ---- O17 g7oPark: a multi-storey car park. Dark reinforced corner piers (rc: "takes more TNT"), grey concrete columns between
    // (concrete), P.ns split decks (mdC) one over the other with low parapet bands and parked cars (decor), a stair-and-lift tower on
    // one side and a level sign (decor on the decks). Two piers side by side at the foot tip it; the decks come down one on the next.
    V5_PARTS.g7oPark = function(P){
      var n0 = blocks.length, hx = P.hx || 6.0, hz = P.hz || 4.0, h = P.h || 2.9, ns = P.ns || 4, y = 0, s, cols = [K.red, K.navy, K.seaGreen, K.yellow, K.white, K.orange];
      var base = addBlock(0, -0.25, 0, 2*hx + 4, 0.5, 2*hz + 4, "base", {anchor:true}); kd(base, "box", K.apron, 0, 0.03, 0, 2*hx + 3.6, 0.06, 2*hz + 3.6);
      for(s = 0; s < ns; s++){
        var st = H.boxSt({ y0:y, h:h, hx:hx, hz:hz, nx:4, nz:3, pw:0.8, mw:0.6, fl:s, MT:api.mat("concrete"), deck:"mdC", skin:"open", dk:0.35, tp:K.conc, td:K.concL, split:[2, 2] });
        st.piers.forEach(function(p){ var corner = (p.gi === 0 || p.gi === 3) && (p.gj === 0 || p.gj === 2); var dark = s === 0 ? true : corner && s < (P.rcUp || 2); if(dark) setKey(p, "rc", K.rcDark);
          kd(p, "box", dark ? K.rcDarkD : K.concD, p.spawn.x, y + 0.2, p.spawn.z, 2*p.half[0] + 0.06, 0.4, 2*p.half[2] + 0.06); });
        st.decks.forEach(function(d, j){ var dx = d.spawn.x, dz = d.spawn.z;
          kd(d, "box", K.concL, dx, y + h - 0.35 + 0.55, dz + Math.sign(dz)*(d.half[2] - 0.1), 2*d.half[0], 0.7, 0.16); kd(d, "box", K.yellow, dx, y + h + 0.02, dz, 2*d.half[0] - 0.4, 0.02, 0.08);
          if(s < ns - 1 || true) for(var q = 0; q < 2; q++){ var c = cols[(s*4 + j*2 + q) % cols.length], cx = dx - d.half[0]*0.5 + q*d.half[0];
            kd(d, "ibox", c, cx, y + h + 0.45, dz - Math.sign(dz)*0.4, 1.6, 0.7, 3.2); kd(d, "ibox", K.glass, cx, y + h + 0.95, dz - Math.sign(dz)*0.4, 1.4, 0.45, 2.0); } });
        y += h; }
      // P.heavy (slot 17 on: the dark element is introduced): the lift motor room and the water tank on the roof deck are heavy
      // reinforced pieces (hard7v): they land whole and count until a TNT cracks them (L.hard7 scoring), as the easy pack's roof pieces
      if(P.heavy){ [[-hx*0.45, 2.6, 2.2, 2.6, K.rcDark], [hx*0.45, 2.2, 1.9, 2.2, 0x5B6470]].forEach(function(q, k){ var hv = mem("hard7v", q[0], y + q[2]/2, -hz*0.3, q[1]*P.heavy, q[2]*P.heavy, q[3]*P.heavy, ns, null, null, q[4]); hv.tint = q[4];
        if(k){ kd(hv, "cyl", 0x66707C, q[0], y + q[2]/2, -hz*0.3, q[1]*P.heavy + 0.3, q[2]*P.heavy - 0.2, q[1]*P.heavy + 0.3); kd(hv, "cone", K.iron, q[0], y + q[2]*P.heavy + 0.25, -hz*0.3, q[1]*P.heavy + 0.3, 0.5, q[1]*P.heavy + 0.3); }
        else { kd(hv, "box", K.white, q[0], y + q[2]*P.heavy - 0.1, -hz*0.3, q[1]*P.heavy + 0.2, 0.2, q[3]*P.heavy + 0.2); kd(hv, "box", K.navy, q[0], y + q[2]*P.heavy*0.5, -hz*0.3 + q[3]*P.heavy/2 + 0.02, 1.0, 1.6, 0.04); } }); }
      // the stair-and-lift tower (decor on the deck nearest the left end) and a level sign on the front
      var tl = H.near(st.decks, -hx, 0); kd(tl, "ibox", K.concD, -hx - 1.2, y/2, 0, 2.2, y + 1.0, 2.6); kd(tl, "ibox", K.glassD, -hx - 1.2, y/2, 1.31, 1.4, y - 0.5, 0.04); kd(tl, "box", K.navy, -hx - 1.2, y + 0.9, 1.32, 1.6, 0.9, 0.06);
      kd(H.near(st.decks, hx, hz), "box", K.navy, hx - 1.5, y + 0.9, hz + 0.05, 2.4, 0.9, 0.08); kd(H.near(st.decks, hx, hz), "box", K.white, hx - 1.5, y + 0.9, hz + 0.1, 0.5, 0.6, 0.04);
      if(P.bg) bgSet(n0, P.bg); return { w:2*hx + 4, d:2*hz + 4 };
    };
    // the hotel's upper-block frame (O14): plain concrete strength, but it shrugs off the landing (shatter 40, as the hard7 pieces): it lands nearly whole
    MEMBERS.g7oConcT = Object.assign({}, MEMBERS.concrete, { shatter:40 }); MATS.g7oConcT = MATS.concrete; MEMBERS.g7oCpanT = Object.assign({}, MEMBERS.cpan, { shatter:40 }); MATS.g7oCpanT = MATS.cpan || MATS.concrete;
    // ---- O14 g7oHotel: a seaside hotel in two blocks. The lower block (P.nl storeys of grey concrete columns, cpan panels, balconies)
    // and the upper block (P.nu storeys, pastel panels, a roof terrace and the hotel sign, decor) are separate bond groups (P.bg0,
    // P.bg0 + 1): the upper block only rests on the lower one, so a blast at the foot drops it nearly whole onto the heap. A second blast.
    V5_PARTS.g7oHotel = function(P){
      var n0 = blocks.length, hx = P.hx || 5.0, hz = P.hz || 3.0, h = P.h || 3.0, nl = P.nl || 3, nu = P.nu || 3, y = 0, s, st, g0 = P.bg0 || 95;
      var base = addBlock(0, -0.25, 0, 2*hx + 4, 0.5, 2*hz + 4, "base", {anchor:true}); kd(base, "box", K.sand, 0, 0.03, 0, 2*hx + 3.6, 0.06, 2*hz + 3.6);
      var block = function(s0, n, tw, band){ for(s = s0; s < s0 + n; s++){
        st = H.boxSt({ y0:y, h:h, hx:hx, hz:hz, nx:4, nz:2, pw:0.6, mw:0.55, fl:s, MT:api.mat("concrete"), deck:"mdC", skin:"wall", wall:"cpan", dk:0.32, tp:K.conc, td:K.concD, tw:tw, split:[2, 1] });
        st.walls.forEach(function(w, j){ var L2 = 2*Math.max(w.half[0], w.half[2]); onF(w, "box", band, 0, h*0.42, L2, 0.16, 0.07);
          if(!s && w.a1face === "z+" && j % 3 === 1){ onF(w, "box", K.navy, 0, -0.4, 1.4, 2.2, 0.08); onF(w, "box", K.white, 0, 0.9, 2.2, 0.14, 1.0); }
          else if(L2 > 1.0){ win(w, 0, 0.15, Math.min(1.1, L2*0.5), 1.2, (j + s) % 4 === 0, 0); if(w.a1face === "z+" && s){ onF(w, "box", K.white, 0, -0.75, L2 - 0.1, 0.12, 0.8); onF(w, "ibox", K.white, 0, -0.35, L2 - 0.1, 0.06, 0.82); } } });
        y += h; } };
      block(0, nl, K.concL, K.seaGreen); bgSet(n0, g0); var n1 = blocks.length;
      block(nl, nu, K.cream, K.red);
      if(P.tough) for(var q = n1; q < blocks.length; q++){ var bq = blocks[q]; if(bq.key === "concrete") setKey(bq, "g7oConcT"); else if(bq.key === "cpan") setKey(bq, "g7oCpanT"); }   // the upper block's frame rides the fall (lands nearly whole: the second blast)
      var top = H.near(st.decks, 0, 0);
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function(f){ var X = !!f[0]; kd(top, "box", K.white, f[0]*(hx - 0.1), y + 0.45, f[1]*(hz - 0.1), X ? 0.12 : 2*hx, 0.9, X ? 2*hz : 0.12); });
      kd(top, "box", K.navy, 0, y + 1.9, 0, 2*hx - 1.6, 1.6, 0.3); kd(top, "lit", K.lit, 0, y + 1.9, 0.18, 2*hx - 2.2, 0.8, 0.05); kd(top, "icyl", K.iron, -hx*0.5, y + 1.0, 0, 0.1, 1.2, 0.1); kd(top, "icyl", K.iron, hx*0.5, y + 1.0, 0, 0.1, 1.2, 0.1);
      [-1, 1].forEach(function(e){ kd(top, "icyl", K.red, e*hx*0.55, y + 1.1, -hz*0.5, 1.6, 0.06, 1.6); kd(top, "icyl", K.white, e*hx*0.55, y + 0.6, -hz*0.5, 0.06, 1.0, 0.06); });   // terrace parasols
      bgSet(n1, g0 + 1); return { w:2*hx + 4, d:2*hz + 4 };
    };
    // ---- O18 g7oSign: a roadside motel sign pylon. Four legs: dark reinforced piers (rc) on the BACK pair, grey concrete (concrete) in
    // front, P.ns storeys of concrete posts (concrete) with plain decks, and the sign itself near the top (decor: a big board, a star,
    // a ring of bulbs, an arrow). Two legs side by side tip it that way; the back pair needs more TNT (dark).
    V5_PARTS.g7oSign = function(P){
      var n0 = blocks.length, hx = P.hx || 1.8, GH = P.gh || 4.0, SH = P.sh || 3.6, ns = P.ns || 4, y = 0, s, st;
      var base = addBlock(0, -0.25, 0, 2*hx + 4, 0.5, 2*hx + 4, "base", {anchor:true}); kd(base, "box", K.apron, 0, 0.03, 0, 2*hx + 3.6, 0.06, 2*hx + 3.6);
      var g = H.boxSt({ y0:0, h:GH, hx:hx, hz:hx, nx:2, nz:2, pw:0.8, mw:0.8, fl:0, MT:api.mat("concrete"), deck:"mdC", skin:"open", dk:0.35, tp:K.conc, td:K.concD });
      g.piers.forEach(function(p){ if(p.a1z < 0) setKey(p, P.backKey || "rc", K.rcDark); kd(p, "box", p.a1z < 0 ? K.rcDarkD : K.concD, p.spawn.x, 0.25, p.spawn.z, 1.0, 0.5, 1.0); });
      y = GH;
      for(s = 0; s < ns; s++){ st = H.boxSt({ y0:y, h:SH, hx:hx - 0.1, hz:hx - 0.1, nx:2, nz:2, pw:0.55, mw:0.55, fl:s + 1, MT:api.mat("concrete"), deck:"mdC", skin:"open", dk:0.3, tp:K.conc, td:K.concD });
        st.piers.forEach(function(p){ kd(p, "box", K.white, p.spawn.x, y + SH - 0.3, p.spawn.z, 2*p.half[0] + 0.06, 0.12, 2*p.half[2] + 0.06); }); y += SH; }
      if(P.heavy){ var cab = mem("hard7v", 0, y + 1.0, 0, 2*hx - 0.4, 2.0*P.heavy, 2*hx - 0.4, ns + 1, null, null, K.rcDark); cab.tint = K.rcDark;   // the sign's transformer cabinet on top: heavy, lands whole (slot 18: dark is introduced)
        kd(cab, "box", K.yellow, 0, y + 1.0, hx - 0.18, 2*hx - 0.8, 0.3, 0.04); }
      // the sign (decor on the top two storeys' decks, inside their outline): a board, a star, bulbs and the arrow
      var top = st.decks[0], y0 = y - 2*SH;
      kd(top, "box", K.seaGreen, 0, y0 + SH, hx + 0.1, 2*hx + 2.0, 2*SH - 1.2, 0.3); kd(top, "box", K.white, 0, y0 + SH, hx + 0.27, 2*hx + 1.6, 2*SH - 1.6, 0.06);
      kd(top, "box", K.red, 0, y0 + SH + 0.9, hx + 0.32, 2*hx + 0.8, 1.3, 0.06); kd(top, "box", K.navy, 0, y0 + SH - 1.0, hx + 0.32, 2*hx + 0.4, 0.9, 0.06);
      for(var q = 0; q < 9; q++){ var a = q/8*Math.PI*2; kd(top, "lit", K.lit, Math.cos(a)*(hx + 0.6), y0 + SH + Math.sin(a)*(SH - 0.9), hx + 0.32, 0.25, 0.25, 0.08); }
      kd(top, "cone", K.yellow, 0, y + 0.9, 0, 1.6, 1.8, 0.3); kd(top, "lit", K.lit, 0, y + 0.9, 0.18, 0.6, 0.6, 0.06);
      kq(top, "box", K.red, hx + 1.1, y0 + 1.0, hx + 0.2, 2.4, 0.6, 0.2, 0, 0, -0.35); kd(top, "cone", K.red, hx + 2.35, y0 + 0.6, hx + 0.2, 0.9, 0.9, 0.2, 0, 0, -Math.PI/2 - 0.35);
      if(P.bg) bgSet(n0, P.bg); return { w:2*hx + 4, d:2*hx + 4 };
    };
    // ---- O18 g7oMotel: a row of motel rooms (P.n units side by side, each its own bond group: they lean on each other): brick piers
    // and party walls (bk + bkw), timber fronts with a door and a window (wwall + decor), a timber walkway roof (decor), a flat roof
    // deck with a white fascia; cars parked in front (decor on the pad).
    V5_PARTS.g7oMotel = function(P){
      var n0 = blocks.length, n = P.n || 4, w = P.w || 3.0, hz = P.hz || 2.6, h = P.h || 3.2, gap = 0.1, W = n*w + (n - 1)*gap, cols = [K.red, K.seaGreen, K.yellow, K.navy, K.orange];
      var base = addBlock(0, -0.25, 0, W + 2, 0.5, 2*hz + 4, "base", {anchor:true}); kd(base, "box", K.apron, 0, 0.03, 0.8, W + 1.6, 0.06, 2*hz + 3.6);
      for(var k = 0; k < n; k++){ var cx = -W/2 + w/2 + k*(w + gap), nS = blocks.length;
        var st = H.boxSt({ y0:0, h:h, hx:w/2, hz:hz, cx:cx, nx:2, nz:2, pw:0.5, mw:0.5, fl:0, MT:api.mat("brick"), deck:"mdB", skin:{ "z+":"wall", def:"wall" }, wall:"bkw", dk:0.3, tp:K.brickD, td:K.concD, tw:K.brickL });
        st.walls.forEach(function(wl){ if(wl.a1face === "z+"){ setKey(wl, "wwall", K.cream); onF(wl, "box", cols[k % cols.length], -0.55, -0.35, 0.8, 2.1, 0.08); win(wl, 0.6, 0.3, 0.8, 0.9, k % 2 === 0, 0); } });
        var d = st.decks[0]; kd(d, "box", K.white, cx, h + 0.15, hz - 0.05, w, 0.5, 0.12); kq(d, "box", K.woodD, cx, h - 0.25, hz + 0.75, w, 0.1, 1.5, 0, 0.2, 0); kd(d, "icyl", K.white, cx - w/2 + 0.15, (h - 0.5)/2, hz + 1.4, 0.12, h - 0.5, 0.12);
        kd(base, "ibox", cols[(k + 2) % cols.length], cx, 0.6, hz + 3.0, 1.8, 0.8, 3.4); kd(base, "ibox", K.glass, cx, 1.1, hz + 2.6, 1.6, 0.45, 1.6);
        bgSet(nS, (P.bg0 || 101) + k); }
      return { w:W + 2, d:2*hz + 4 };
    };
    // ---- O19 g7oLib: a library book-stack tower. Ground storey: grey concrete columns in front, dark reinforced piers (rc) at the
    // back; P.ns brick storeys above (bk posts, bkw walls with tall slit windows and stone bands), a stone cornice and a clock-less
    // lantern on the roof deck (decor); shelves of books inside (decor). Its proper fall is forward, onto the reading hall.
    V5_PARTS.g7oLib = function(P){
      var n0 = blocks.length, hx = P.hx || 3.4, GH = P.gh || 4.4, SH = P.sh || 3.4, ns = P.ns || 4, y = 0, s, st;
      var base = addBlock(0, -0.25, 0, 2*hx + 4, 0.5, 2*hx + 4, "base", {anchor:true}); kd(base, "box", K.stone, 0, 0.03, 0, 2*hx + 3.6, 0.06, 2*hx + 3.6);
      var g = H.boxSt({ y0:0, h:GH, hx:hx, hz:hx, nx:3, nz:3, pw:0.9, mw:0.8, fl:0, MT:api.mat("concrete"), deck:"mdC", skin:"open", dk:0.4, tp:K.conc, td:K.concD });
      g.piers.forEach(function(p){ if(p.a1z < -0.5) setKey(p, "rc", K.rcDark); kd(p, "box", p.a1z < -0.5 ? K.rcDarkD : K.stoneD, p.spawn.x, 0.3, p.spawn.z, 2*p.half[0] + 0.12, 0.6, 2*p.half[2] + 0.12); });
      y = GH;
      for(s = 0; s < ns; s++){ st = H.boxSt({ y0:y, h:SH, hx:hx, hz:hx, nx:3, nz:3, pw:0.6, mw:0.55, fl:s + 1, MT:api.mat("brick"), deck:"mdB", skin:"wall", wall:"bkw", dk:0.3, tp:K.brickD, td:K.brickD, tw:s % 2 ? K.brick : K.brickL });
        st.walls.forEach(function(w, j){ var L2 = 2*Math.max(w.half[0], w.half[2]); onF(w, "box", K.stone, 0, SH*0.44, L2, 0.16, 0.07); if(L2 > 1.0){ onF(w, "box", K.stone, 0, 0, 0.7, SH*0.7, 0.07); onF(w, "box", (j + s) % 3 === 0 ? K.lit : K.glassD, 0, 0, 0.45, SH*0.62, 0.09); } });
        st.decks.forEach(function(d){ for(var q = 0; q < 3; q++) kd(d, "ibox", [K.red, K.navy, K.seaGreen][q], d.spawn.x - 0.8 + q*0.8, y + 0.8, d.spawn.z, 0.6, 1.4, 0.3); });
        y += SH; }
      var top = H.near(st.decks, 0, 0);
      kd(top, "box", K.stone, 0, y + 0.2, 0, 2*hx + 0.5, 0.4, 2*hx + 0.5);
      if(P.heavy){ var ln = mem("hard7v", 0, y + 0.4 + 1.1*P.heavy, 0, 2.6*P.heavy, 2.2*P.heavy, 2.6*P.heavy, ns + 1, null, null, K.stoneD); ln.tint = K.stoneD;   // the book-lift lantern: heavy, lands whole (slot 19)
        kd(ln, "cone", K.slate, 0, y + 0.4 + 2.2*P.heavy + 0.7, 0, 2.6*P.heavy + 0.4, 1.4, 2.6*P.heavy + 0.4); kd(ln, "lit", K.lit, 0, y + 0.4 + 1.1*P.heavy, 1.3*P.heavy + 0.02, 1.0, 0.8, 0.04); }
      else { kd(top, "box", K.stoneD, 0, y + 1.0, 0, 2.2, 1.6, 2.2); kd(top, "cone", K.slate, 0, y + 2.4, 0, 2.6, 1.4, 2.6); kd(top, "lit", K.lit, 0, y + 1.0, 1.12, 1.0, 0.8, 0.04); }
      if(P.bg) bgSet(n0, P.bg); return { w:2*hx + 4, d:2*hx + 4 };
    };
    // ---- O19 g7oRead: the reading hall in front of the stack tower (its landing): two brick storeys on brick piers (bk + bkw), tall
    // arched windows, a stone porch with columns and steps on the front, a slate roof body.
    V5_PARTS.g7oRead = function(P){
      var n0 = blocks.length, hx = P.hx || 5.4, hz = P.hz || 2.6, y = 0, s, st;
      var base = addBlock(0, -0.25, 0, 2*hx + 3, 0.5, 2*hz + 4, "base", {anchor:true}); kd(base, "box", K.stone, 0, 0.03, 0.5, 2*hx + 2.6, 0.06, 2*hz + 3.6);
      for(s = 0; s < 2; s++){ var h = s ? 3.0 : 3.6;
        st = H.boxSt({ y0:y, h:h, hx:hx, hz:hz, nx:4, nz:2, pw:0.6, mw:0.55, fl:s, MT:api.mat("brick"), deck:"mdB", skin:"wall", wall:"bkw", dk:0.3, tp:K.brickD, td:K.brickD, tw:K.brick });
        st.walls.forEach(function(w, j){ var L2 = 2*Math.max(w.half[0], w.half[2]); onF(w, "box", K.stone, 0, h*0.44, L2, 0.14, 0.07); if(L2 > 1.0) win(w, 0, 0.2, Math.min(1.0, L2*0.4), h*0.5, (j + s) % 3 === 0, 0); });
        y += h; }
      var f0 = H.near(st.decks, 0, hz); [-1, 1].forEach(function(e){ kd(f0, "icyl", K.stone, e*1.2, 1.8, hz + 1.1, 0.4, 3.6, 0.4); }); kd(f0, "box", K.stone, 0, 3.75, hz + 1.1, 3.4, 0.3, 1.4); kd(f0, "prism", K.stone, 0, 4.25, hz + 1.1, 3.4, 0.7, 1.4, 0, Math.PI/2, 0);
      for(var q = 0; q < 3; q++) kd(base, "box", K.stoneD, 0, 0.1 + q*0.12, hz + 2.1 - q*0.3, 3.6, 0.12, 0.4);
      roofBody(0, 0, y, hx - 0.02, hz - 0.02, 0.5, 2, 1.8, K.slate, K.slateD, 1, K.brick);
      if(P.bg) bgSet(n0, P.bg); return { w:2*hx + 3, d:2*hz + 4 };
    };
    // every g7o builder: the decks boxSt / octSt hand out as blast-proof hero floors (A1's HD: mdC -> a1mdC, mdB -> a1mdB) go back to
    // the plain ladder floors (E01 lesson, LEARNINGS 5: a hero floor lying in the heap cannot be cleared)
    var PLAIN = { a1mdC:"mdC", a1mdB:"mdB", a1slab:"mdC" };
    Object.keys(V5_PARTS).filter(function(k){ return /^g7o[A-Z]/.test(k); }).forEach(function(k){ var f = V5_PARTS[k];
      V5_PARTS[k] = function(P){ var n0 = blocks.length, r = f(P); for(var q = n0; q < blocks.length; q++){ var b = blocks[q], pk = PLAIN[b.key]; if(pk && MEMBERS[pk]) setKey(b, pk); } return r; }; });
  })();


  // ---- levels -----------------------------------------------------------------------------------------------------
  var DEF = LV7.levels = [];
  LV7.add = function(l){ DEF.push(l); };
  LV7.install = function(){ DEF.forEach(function(l){ LEVELS.push(l); }); LV7.from = LEVELS.length - DEF.length; };
  LV7.base = window.__lv7base != null ? window.__lv7base : LEVELS.length;
  LV7.put = function(k, l){ LEVELS[LV7.base + k] = l; return LV7.base + k; };   // test hook: set level k of the pack (0-9) at run time
  LV7.L = function(){ return LEVELS; };
})(); }catch(e){ console.error("main/levels7.js", e); }
