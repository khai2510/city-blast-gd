  // ---- levels6 v15 EDITOR hook (games/blast/editor/). NEW, additive: nothing here runs unless the level editor calls it or a level
  // def carries `props`. Appended LAST inside main() by editor/build.js (after v14). It changes no existing level and no rule.
  //   window.__blast.editor.defs()            deep copy of the 36 live level defs (LEVELS after every patch)
  //   window.__blast.editor.play(i, def)      put `def` in slot i of this page's LEVELS and start it like a tap on the map (retry keeps it)
  //   window.__blast.editor.load(i, def)      same def through the test harness (manual stepping, settled at once)
  //   window.__blast.editor.measure()         footprint of every part / protected building of the level on screen (metres, lot coords)
  //   window.__blast.editor.sig()             a number string that identifies the built level (member keys + spawn boxes)
  //   postMessage {cb:"editor", cmd:"defs"|"play"|"state"|"measure", id, i, def}  ->  parent gets {cb:"editor-reply", id, ok, data}
  // New optional level field (scenes only):  props:[{k:"crate"|"tree"|"car", x, z, r}]   r = quarter turns (car only)
  // v2 (building editor). New optional fields on a part (parts[] of a scene), read here and nowhere else:
  //   mats:{col, floor, deck, wall, glass}  material of a member group, a name of the ladder below (absent = what the kit builds)
  //   rc:{k, keep}                          RC-family members of the part: hp x k; keep true = damage stays between blasts, false = reset
  //   sc                                    uniform scale of the whole part (members and decor), about its own origin
  // They work by wrapping addBlock / l6KdAdd while that part is being built: no kit, patch or level is edited.
  //   window.__blast.editor.info()          live tables: MEMBERS, groups, ladder, TNT, RC tier (v14 M14_RC), measured contact factor
  //   window.__blast.editor.members(id)     members of part id (key, group, hp, hp0, floor, dead)
  //   window.__blast.editor.blastTest(id,n) n TNT on the nearest ground column of part id, fired at once -> the member it sits on
  //   window.__blast.editor.blastResult()   that member now: hp, damage share, dead
  //   play(i, def, {preview:true, focus:id}) = the 3D preview: HUD hidden, no sound, no result card, camera framed on part id
  // v3 (15/11, on the main build v51: tap2 controls, base types, intro, prelevel, ui2, perf):
  //   the base type of a building is the game's own level field L.base (levels6/patch/v15-base.js, D-blast-MATCURVE); nothing new is
  //   read here for it. info().base = the presets; measure().base = what v15-base applied at the last start; members() marks base piers.
  //   play() marks every intro card / forced tap as seen (the editor tests a level, not the first-time teaching) and never opens the
  //   pre-level popup (it starts the level directly, as before). screen(i) = where member i is on screen (tests drive the real taps).
  (function(){
    var clone = function(o){ return JSON.parse(JSON.stringify(o)); };
    var PR = MEMBERS.crate;
    Object.assign(MEMBERS, {
      etrunk: Object.assign({}, PR, { hp:40, density:700, color:0x8A5A34 }),
      eleaf:  Object.assign({}, PR, { hp:20, density:300, color:0x5DBB63 }),
      ecar:   Object.assign({}, PR, { hp:60, density:500, color:0xFF5A3C }),
      ecab:   Object.assign({}, PR, { hp:20, density:300, color:0x34405E })
    });
    var PROPS = {
      crate: function(x, z){ for(var h=0;h<3;h++) addBlock(x + (h===2?0.25:0), 0.44 + h*0.88, z + (h===1?0.15:0), 0.88, 0.88, 0.88, "crate", {floor:h}); },
      tree:  function(x, z){ addBlock(x, 1.2, z, 0.5, 2.4, 0.5, "etrunk", {floor:0}); addBlock(x, 3.5, z, 2.4, 2.2, 2.4, "eleaf", {floor:1}); },
      car:   function(x, z, r){ var a = r % 2 ? [1.8, 4.2] : [4.2, 1.8], c = r % 2 ? [1.6, 2.2] : [2.2, 1.6];
        addBlock(x, 0.55, z, a[0], 0.9, a[1], "ecar", {floor:0}); addBlock(x, 1.35, z, c[0], 0.7, c[1], "ecab", {floor:1}); }
    };
    var scene0 = LANDMARK_BUILD.scene;
    LANDMARK_BUILD.scene = function(P){
      var fp = scene0.apply(this, arguments);
      (P.props || []).forEach(function(p){ if(p && PROPS[p.k]) PROPS[p.k](+p.x || 0, +p.z || 0, (p.r|0) & 3); });
      return fp;
    };
    // ---- v2: member groups, the material ladder per group, per-part overrides
    var GROUP = {}, setG = function(g, keys){ keys.forEach(function(k){ if(MEMBERS[k]) GROUP[k] = g; }); };
    Object.keys(L11_COL).forEach(function(k){ GROUP[k] = "col"; }); Object.keys(L11_SLAB).forEach(function(k){ GROUP[k] = "floor"; }); Object.keys(L11_WALL).forEach(function(k){ GROUP[k] = "wall"; });
    setG("col", ["concrete", "bk", "wpost", "steel", "rc", "core", "pier", "hrc", "mcol", "mpost", "iron", "timber", "pylon", "brick", "stone", "gate"]);
    setG("floor", ["slab", "wfloor", "sdeck", "rcs", "mdeck", "plate"]); setG("deck", ["tdeck", "deck", "truss", "road"]);
    setG("wall", ["cpan", "bkw", "wwall", "wall", "panel", "screen"]); setG("glass", ["glass", "mglass", "aqua"]);
    var LADDER = { col:{ wood:"wpost", brick:"bk", conc:"concrete", rc:"rc", rcm:"hrc", steel:"steel" },
      floor:{ wood:"wfloor", conc:"slab", rc:"rcs", rcm:"mdeck", steel:"sdeck" }, deck:{ conc:"tdeck", rc:"rcs", steel:"sdeck" },
      wall:{ wood:"wwall", brick:"bkw", conc:"cpan", rc:"wall", glass:"glass" }, glass:{ glass:"glass", clear:"mglass", conc:"cpan", brick:"bkw", wood:"wwall" } };
    Object.keys(LADDER).forEach(function(g){ Object.keys(LADDER[g]).forEach(function(m){ if(!MEMBERS[LADDER[g][m]]) delete LADDER[g][m]; }); });
    var RCFAM = {}; ["rc", "rcs", "hrc", "mdeck", "core", "pier"].forEach(function(k){ if(MEMBERS[k]) RCFAM[k] = 1; });
    var cur = null, PREVIEW = false, FOCUS = null, lastT = null;
    var has = function(P){ return P && (P.mats || P.rc || P.sc); };
    var wrapB = function(fn){ return function(P){ var o = cur; if(has(P)) cur = P; try{ return fn.apply(this, arguments); } finally { cur = o; } }; };
    Object.keys(V5_PARTS).forEach(function(k){ V5_PARTS[k] = wrapB(V5_PARTS[k]); });
    Object.keys(LANDMARK_BUILD).forEach(function(k){ if(k !== "scene") LANDMARK_BUILD[k] = wrapB(LANDMARK_BUILD[k]); });
    buildFrame = wrapB(buildFrame);
    var add0 = addBlock;
    addBlock = function(x, y, z, sx, sy, sz, key, opt){
      var P = cur; if(!P || (opt && (opt.anchor || opt.keep) && !P.sc)) return add0.apply(this, arguments);
      var k = +P.sc > 0 ? +P.sc : 1, g = GROUP[key], m = P.mats && g && !(opt && (opt.anchor || opt.keep)) ? P.mats[g] : null, nk = m && LADDER[g][m] ? LADDER[g][m] : key;
      var b = add0.call(this, x*k, y*k, z*k, sx*k, sy*k, sz*k, nk, opt);
      if(nk !== key) b.key0 = key;
      if(P.rc && RCFAM[nk]){ var hk = +P.rc.k > 0 ? +P.rc.k : 1; b.hp *= hk; b.hp0 = b.hp; if(P.rc.keep != null) b.edKeep = !!P.rc.keep; }
      return b; };
    var kd0 = l6KdAdd;
    l6KdAdd = function(host, g, c, x, y, z, sx, sy, sz, rx, ry, rz){ var k = cur && +cur.sc > 0 ? +cur.sc : 1; return k === 1 ? kd0.apply(this, arguments) : kd0.call(this, host, g, c, x*k, y*k, z*k, sx*k, sy*k, sz*k, rx, ry, rz); };
    var det0 = detonateAll;   // rc.keep: true = this part's RC damage stays (as v14 does for its own tier), false = restored at every BLAST
    detonateAll = function(){ var hold = [], reset = [];
      blocks.forEach(function(b){ if(b.dead || b.edKeep == null || b.hp0 == null) return; if(b.edKeep){ if(b.hp < b.hp0) hold.push([b, b.hp]); } else reset.push(b); });
      var r = det0.apply(this, arguments); hold.forEach(function(q){ if(!q[0].dead) q[0].hp = q[1]; }); reset.forEach(function(b){ if(!b.dead) b.hp = b.hp0; }); return r; };
    // ---- v2: 3D preview (the same game, HUD hidden, quiet, never ends) + camera on one part
    var st = document.createElement("style"); st.textContent = "body.edprev #inCard,body.edprev #inDim,body.edprev #bbar,body.edprev #zhint,body.edprev #feelLay,body.edprev #bottom,body.edprev #lvBtn,body.edprev #hand,body.edprev #tip,body.edprev #collat,body.edprev #hardBan,body.edprev #lvPill,body.edprev #coinPill,body.edprev #coins,body.edprev #pauseBtn,body.edprev #meter,body.edprev #count,body.edprev #tapRing,body.edprev #pop,body.edprev #toast,body.edprev #result,body.edprev #hardTag,body.edprev #lvPanel{visibility:hidden!important;pointer-events:none!important}"; document.head.appendChild(st);
    var snd0 = snd; snd = function(){ return PREVIEW ? null : snd0.apply(this, arguments); };
    var ws0 = writeSave; writeSave = function(){ if(PREVIEW) return; return ws0.apply(this, arguments); };   // the preview frame never touches the player's save
    // the hidden HUD reserves no room in the preview, and a view of one part is fitted to that part (not to the hero's fillMax share)
    var th0 = topH, bh0 = botH; topH = function(){ return PREVIEW ? 0 : th0.apply(this, arguments); }; botH = function(){ return PREVIEW ? 0 : bh0.apply(this, arguments); };
    var fd0 = fitDist; fitDist = function(){ if(!PREVIEW || FOCUS == null) return fd0.apply(this, arguments); var fm = L.fillMax; L.fillMax = 0; try{ return fd0.apply(this, arguments); } finally { L.fillMax = fm; } };
    var fb0 = frameBox;
    frameBox = function(){ if(!PREVIEW || FOCUS == null) return fb0.apply(this, arguments);
      var bx = { x0:1e9, x1:-1e9, y0:0, y1:1, z0:1e9, z1:-1e9 };
      blocks.forEach(function(b){ if(b.anchor || b.prop || (b.keep ? "k" + b.kid : b.bid) !== FOCUS) return; var p = b.spawn;
        bx.x0 = Math.min(bx.x0, p.x - b.half[0]); bx.x1 = Math.max(bx.x1, p.x + b.half[0]); bx.z0 = Math.min(bx.z0, p.z - b.half[2]); bx.z1 = Math.max(bx.z1, p.z + b.half[2]); bx.y1 = Math.max(bx.y1, p.y + b.half[1]); });
      return bx.x0 > bx.x1 ? fb0.apply(this, arguments) : bx; };
    var partBlocks = function(id){ return blocks.filter(function(b){ return !b.anchor && !b.prop && (b.keep ? "k" + b.kid : b.bid) === id; }); };
    var mInfo = function(b){ return { i:blocks.indexOf(b), key:b.key, group:GROUP[b.key] || null, hp:Math.round(b.hp*10)/10, hp0:Math.round((b.hp0 == null ? b.hp : b.hp0)*10)/10, floor:b.floor, dead:!!b.dead, keep:b.edKeep == null ? null : b.edKeep,
      base:b.baseG ? b.baseG.sp.rule : null, py:b.P ? Math.round(b.P.y*100)/100 : null, color:b.def && b.def.color != null ? b.def.color : null, w:Math.round(2*Math.min(b.half[0], b.half[2])*100)/100, h:Math.round(2*b.half[1]*100)/100, y:Math.round(b.spawn.y*100)/100 }; };
    var blastTest = function(id, n){
      var list = partBlocks(id).filter(function(b){ return !b.dead && !b.keep && GROUP[b.key] === "col"; }); if(!list.length) list = partBlocks(id).filter(function(b){ return !b.dead && !b.keep; });
      if(!list.length) return null;
      var y0 = Math.min.apply(null, list.map(function(b){ return b.spawn.y - b.half[1]; })), cp = camera.position;
      list = list.filter(function(b){ return b.spawn.y - b.half[1] < y0 + 0.6; }).sort(function(a, b){ return a.P.distanceTo(cp) - b.P.distanceTo(cp); });
      var t = list[0], dx = cp.x - t.P.x, dz = cp.z - t.P.z, nx = Math.abs(dx) > Math.abs(dz) ? Math.sign(dx) : 0, nz = nx ? 0 : (Math.sign(dz) || 1), before = mInfo(t);
      for(var k=0;k<Math.max(1, Math.min(4, n|0));k++) window.__blast.test.charge("tnt", blocks.indexOf(t), nx, nz, -0.2 + 0.25*k);
      lastT = { b:t, before:before, n:Math.max(1, Math.min(4, n|0)) }; window.__blast.test.detonate(); return before; };
    var blastResult = function(){ if(!lastT) return null; var a = mInfo(lastT.b), b0 = lastT.before; return { n:lastT.n, before:b0, after:a, share:a.dead ? 1 : Math.max(0, Math.round((1 - a.hp/b0.hp0)*1000)/1000), phase:phase }; };
    // contact factor: what share of CHARGES.tnt.dmg one TNT placed on a member really does to it (distance fall-off), measured on the level on screen
    var contactK = null;
    var probeContact = function(){ var tk = blocks.filter(function(b){ return b.key === "tank"; }), far = function(b){ var d = 1e9; tk.forEach(function(t){ d = Math.min(d, Math.hypot(t.spawn.x - b.spawn.x, t.spawn.z - b.spawn.z)); }); return d; };
      var c = blocks.filter(function(b){ return !b.anchor && !b.prop && !b.keep && !b.dead && GROUP[b.key] === "col" && b.hp*1 > CHARGES.tnt.dmg*(1 - (b.def.armor || 0)) && b.floor === 0 && far(b) > 8; }).sort(function(a, b){ return far(b) - far(a); })[0]; if(!c) return null;
      var h0 = c.hp; window.__blast.test.charge("tnt", blocks.indexOf(c), 1, 0, 0); window.__blast.test.detonate(); window.__blast.test.step(150);
      var k = (h0 - c.hp)/(CHARGES.tnt.dmg*c.def.dmg*(1 - (c.def.armor || 0))); if(k > 0.3 && k <= 1.01) contactK = Math.round(k*1000)/1000; return contactK; };
    var info = function(){ var M = {}; Object.keys(MEMBERS).forEach(function(k){ var m = MEMBERS[k]; if(m.prop || m.bond === "anchor") return; M[k] = { hp:m.hp, armor:m.armor || 0, dmg:m.dmg, density:m.density, bond:m.bond, color:m.color, group:GROUP[k] || null, rc:RCFAM[k] ? 1 : 0 }; });
      return { members:M, ladder:LADDER, mat:L6_MAT, tnt:{ dmg:CHARGES.tnt.dmg, radius:CHARGES.tnt.radius }, contactK:contactK,
        rc:(typeof M14 !== "undefined" && M14.RC) ? { hp:M14.RC.hp, armor:M14.RC.armor, s1:M14.RC.s1, s2:M14.RC.s2 } : null,
        mon14:!!V5_PARTS.mon14, base:typeof BASE !== "undefined" && BASE.PRESET ? { on:BASE.on, presets:clone(BASE.PRESET) } : null }; };
    // intro (main/intro.js): mark every scheduled card and forced tap as seen, in memory (the editor frame's save is its own)
    var introOff = function(){ try{ var I = window.__blast.intro; if(!I || !I.sched) return; save.intro = save.intro || {};
      I.sched().forEach(function(e){ var s = save.intro[e.id] = save.intro[e.id] || {}; s.c = 1; s.f = 1; }); }catch(e){} };
    var put = function(i, def){ i = Math.max(0, Math.min(LEVELS.length - 1, i|0)); if(def){ LEVELS[i] = clone(def); pbDrop(); } return i; };
    var measure = function(){
      var out = { parts:{}, keeps:{}, lot:{ pad:LOT_PAD, disc:LOT_DISC, k:L.lotK || 1 }, street:streetZ, level:levelIdx + 1 };
      var px = {}; (L.parts || []).forEach(function(p){ px[p.id || "A"] = [p.x || 0, p.z || 0]; });
      blocks.forEach(function(b){
        if(b.anchor || b.prop) return;
        var id = b.keep ? b.kid : b.bid, g = b.keep ? out.keeps : out.parts; if(id == null) return;
        var o = b.keep ? [((L.keeps || [])[id] || {}).x || 0, ((L.keeps || [])[id] || {}).z || 0] : (px[id] || [0, 0]);
        var e = g[id] = g[id] || { x0:1e9, x1:-1e9, z0:1e9, z1:-1e9, h:0, r:0, n:0 };
        var box = function(cx, cy, cz, hx, hy, hz){ var dx = cx - o[0], dz = cz - o[1];
          e.x0 = Math.min(e.x0, dx - hx); e.x1 = Math.max(e.x1, dx + hx); e.z0 = Math.min(e.z0, dz - hz); e.z1 = Math.max(e.z1, dz + hz);
          e.h = Math.max(e.h, cy + hy); e.r = Math.max(e.r, Math.hypot(Math.abs(dx) + hx, Math.abs(dz) + hz)); };
        box(b.spawn.x, b.spawn.y, b.spawn.z, b.half[0], b.half[1], b.half[2]); e.n++;
        var k0 = b.key0 || b.key; (e.keys = e.keys || {})[k0] = (e.keys[k0] || 0) + 1;
        (b.kd || []).forEach(function(q){ if(!q.o || !q.s || q.m14) return; box(b.spawn.x + q.o.x, b.spawn.y + q.o.y, b.spawn.z + q.o.z, Math.abs(q.s.x)/2, Math.abs(q.s.y)/2, Math.abs(q.s.z)/2); });
      });
      var rd = function(g){ Object.keys(g).forEach(function(k){ var e = g[k]; ["x0","x1","z0","z1","h","r"].forEach(function(f){ e[f] = Math.round(e[f]*100)/100; }); }); };
      rd(out.parts); rd(out.keeps);
      if(typeof M14 !== "undefined" && L.mon && M14.info) out.m14 = JSON.parse(JSON.stringify(M14.info));
      if(window.__blast.base && window.__blast.base.info) out.base = window.__blast.base.info();
      if(typeof M14 !== "undefined" && L.mon && M14.info && out.parts.A){ out.parts.A.r = Math.round(M14.info.r*100)/100; out.parts.A.round = 1; }
      return out;
    };
    var sig = function(){ var h = 2166136261, n = 0;
      blocks.forEach(function(b){ var s = b.key + "|" + [b.spawn.x, b.spawn.y, b.spawn.z, b.half[0], b.half[1], b.half[2]].map(function(v){ return Math.round(v*1000); }).join(",") + "|" + (b.anchor ? 1 : 0) + (b.keep ? 1 : 0) + (b.bid || "");
        for(var i=0;i<s.length;i++){ h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } n++; });
      return n + ":" + h + ":" + links.length; };
    var api = window.__blast.editor = {
      defs: function(){ return clone(LEVELS); },
      play: function(i, def, o){ o = o || {}; i = put(i, def); PREVIEW = !!o.preview; FOCUS = PREVIEW && o.focus != null ? o.focus : null; document.body.classList.toggle("edprev", PREVIEW);
        if(PREVIEW){ save.mute = true; save.music = false; try{ if(window.SFX && SFX.ctx){ SFX.mute(true); SFX.music(false); } }catch(e){} }
        introOff(); manual = false; noFinish = PREVIEW; startLevel(i); return i + 1; },
      screen: function(i){ var b = blocks[i]; if(!b) return null; var s = toScreen(b.P); return { x:s.x, y:s.y, on:s.on }; },
      info: info, members: function(id){ return partBlocks(id).map(mInfo); }, blastTest: blastTest, blastResult: blastResult, probeContact: probeContact,
      load: function(i, def, seed){ i = put(i, def); return window.__blast.test.load(i, seed); },
      measure: measure, sig: sig,
      props: function(){ return Object.keys(PROPS); }
    };
    window.addEventListener("message", function(ev){
      var m = ev.data; if(!m || m.cb !== "editor") return;
      var re = { cb:"editor-reply", id:m.id, ok:true, data:null };
      try{
        if(m.cmd === "defs") re.data = api.defs();
        else if(m.cmd === "play"){ re.data = api.play(m.i, m.def, m.opts); }
        else if(m.cmd === "info") re.data = info();
        else if(m.cmd === "members") re.data = api.members(m.part);
        else if(m.cmd === "blast") re.data = blastTest(m.part, m.n);
        else if(m.cmd === "blastResult") re.data = blastResult();
        else if(m.cmd === "state"){ var s = window.__blast.state(); re.data = { screen:s.screen, phase:s.phase, level:s.level, name:s.name, pct:s.pct, total:s.total, yaw:s.yaw }; }
        else if(m.cmd === "measure") re.data = measure();
        else if(m.cmd === "base") re.data = window.__blast.base ? window.__blast.base.info() : null;
        else re.ok = false;
      }catch(e){ re.ok = false; re.data = String(e && e.message || e); }
      try{ (ev.source || window.parent).postMessage(re, "*"); }catch(e){}
    });
    // inside the editor's frame there is no sfx/ folder next to the page: keep the built-in procedural sounds, fetch nothing
    try{ if(window.parent && window.parent !== window && window.SFX && SFX.loadSamples) SFX.loadSamples = function(){}; }catch(e){}
    try{ if(window.parent && window.parent !== window) window.parent.postMessage({ cb:"editor-reply", id:"ready", ok:true, data:{ levels:LEVELS.length } }, "*"); }catch(e){}
  })();
  // ---- end levels6 v15 EDITOR hook
