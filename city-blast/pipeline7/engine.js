
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
    MEMBERS.hard7t = Object.assign({}, MEMBERS.hard7v, { density:+(window.__g7tileD || 1050), color:K.tile }); MATS.hard7t = MATS.hard7v || MATS.concrete;
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

  // ---- levels -----------------------------------------------------------------------------------------------------
  var DEF = LV7.levels = [];
  LV7.add = function(l){ DEF.push(l); };
  LV7.install = function(){ DEF.forEach(function(l){ LEVELS.push(l); }); LV7.from = LEVELS.length - DEF.length; };
  LV7.base = window.__lv7base != null ? window.__lv7base : LEVELS.length;
  LV7.put = function(k, l){ LEVELS[LV7.base + k] = l; return LV7.base + k; };   // test hook: set level k of the pack (0-9) at run time
  LV7.L = function(){ return LEVELS; };
})(); }catch(e){ console.error("main/levels7.js", e); }
