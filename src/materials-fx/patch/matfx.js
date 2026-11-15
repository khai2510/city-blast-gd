// ---- materials-fx v11 (Owner 10/11): every material answers TNT its own way (materials-fx/PORT.md)
// ONE TABLE: one object per material. Level designers: this is what a member of that material does when it is hit.
// hp / armor / density / shatter / bond stay per member key in MEMBERS (the blast-damage layer); everything about HOW a
// material breaks, flies, bounces, looks and sounds is here. ?mfx=0 = the old behaviour (A/B).
// CONCRETE IS THE REFERENCE: its rigid pieces, throw and contact numbers are exactly the pre-v11 ones, so a concrete
// frame collapses as it did; every other material is tuned against it (masonry shorter and crumbling, timber and
// steel further and bouncing).
//   keys     member keys of this material. A key that is not listed takes the material whose LOOK it shares (the same
//            MATS shader object as brick / stone / timber / steel / glass), then glass by def.glass, steel by snd/bond,
//            else concrete. So a new member key reacts the way it looks; list it here to be explicit
//   rest/fric  contact restitution / friction of the material's DEBRIS (rigid pieces, and members with no bond left);
//              bounce:true = its restitution wins over the other body's (Rapier combine rule Max): it visibly bounces.
//              Members still bonded into a frame keep the MEMBERS numbers
//   throw    blast impulse multiplier on FREE bodies of the material (fragments, members with no bond left).
//            Bonded members always take x1, so what a charge does to a standing frame is unchanged.
//            throwRef (kg/m3): the full multiplier is for bodies of at least this density, lighter ones get less
//            (1 + (throw - 1) x density / throwRef): solid steel is flung, a hollow container is not
//   split    how a failed member is replaced: "none" (no rigid pieces, all particles) | "chunks" (box tiling) |
//            "planks" (snapped across the grain, split along it) | "halves" (cut in two; a section is lost at the cut)
//   pieces   max rigid pieces;  tile = target piece size (m);  keep = share of the tile a piece keeps [charge, impact]
//   jitter   size variation between pieces (0..1), seeded;  pop / spin = seeded separation speed (m/s) / tumble (rad/s)
//   drag / angDrag  air drag on the rigid pieces (Rapier linear / angular damping, 1/s): light planks slow down in the air
//   crumble  impact dv (m/s) at which a rigid piece of this material turns to crumbs + dust (0 = never)
//   shock    glass: panes within shock x the charge radius shatter. 1.0 = off (only the damage radius, as before):
//            1.3 was tried and made an evenly blown tower drop less straight (PORT.md §6), so it ships off
//   debris   glass: speed (m/s) of a flying fragment that shatters a pane it touches
//   bend     steel: visual kink per full-strength hit (rad), bendMax = the most it shows
//   crumbs   visual 3D debris (pooled, no physics): [n on a charge, n on an impact], size (m), fly speed, bounce, life
//   dust     [puffs, size m, colour from, colour to, alpha]   chips = [atlas sprite, n]   sparks / glints = n
//   smoke    colour of the charge's own smoke when this material is what it mostly hit
//   snd      break sound; hit = the debris-impact sound family
var MFX_ON = QS.get("mfx") !== "0";
var MFX_OFF = (function(){ var o = {}; (QS.get("mfxoff") || "").split(",").forEach(function(k){ if(k) o[k] = 1; }); return o; })();   // debug: switch one mechanism off (split,throw,glass,shock,debris,contact,crumble,kick)
var MATFX = {
  glass: { keys:["glass", "aqua"], rest:0.10, fric:0.45, throw:1.0,
    split:"none", pieces:0, shock:1.0, debris:6,
    crumbs:{ n:[11, 8], size:[0.42, 0.42, 0.05], fly:[7, 13], up:[0.5, 4], rest:0.3, life:[0.7, 1.1], lighten:0.5, spin:16 },
    dust:[1, 0.9, 0xF4FCFF, 0xBFE9FA, 0.55], smoke:0xE6F5FB, glints:3, snd:"glass_shatter", hit:"glass" },
  brick: { keys:["brick", "gate", "bbrick", "terra", "bk", "bkw"], rest:0.02, fric:0.8, throw:0.4,
    split:"chunks", pieces:6, tile:0.55, keep:[0.62, 0.8], jitter:0.3, pop:0.7, spin:1.5, drag:0, angDrag:0.3, crumble:5.5,
    crumbs:{ n:[9, 6], size:[0.3, 0.2, 0.22], fly:[2.5, 5], up:[1, 4], rest:0.15, life:[1.0, 1.5], spin:9 },
    dust:[3, 1.9, 0xF2B79C, 0xC8775A, 0.85], smoke:0xE3A88C, chips:["chip_brick", 3], snd:"grit", hit:"concrete" },
  stone: { keys:["stone", "entab", "ashlar", "sand", "lime", "colm", "plinth", "slate"], rest:0.03, fric:0.75, throw:0.4,
    split:"chunks", pieces:6, tile:0.6, keep:[0.62, 0.8], jitter:0.25, pop:0.5, spin:1, drag:0, angDrag:0.3, crumble:6.5,
    crumbs:{ n:[8, 5], size:[0.32, 0.26, 0.26], fly:[2, 4.5], up:[1, 3.5], rest:0.12, life:[1.0, 1.5], spin:7 },
    dust:[3, 1.9, 0xFFF1CF, 0xE0C79A, 0.85], smoke:0xF1DDB0, chips:["chip_stone", 3], snd:"grit", hit:"concrete" },
  concrete: { keys:["concrete", "slab", "wall", "panel", "pier", "keep", "pylon", "road", "plate", "cpan", "tdeck"], rest:0.06, fric:0.7, throw:1.0,
    split:"chunks", pieces:4, tile:1.0, keep:[0.6, 0.85], jitter:0, pop:0, spin:0, drag:0, angDrag:0, crumble:0,
    crumbs:{ n:[4, 3], size:[0.3, 0.14, 0.3], fly:[1.5, 3.5], up:[0.5, 2.5], rest:0.1, life:[0.9, 1.3], spin:5 },
    dust:[2, 1.7, 0xECEAE6, 0xB9B5AE, 0.8], smoke:0xD4D0C9, chips:["chip_concrete", 2], snd:"thud", hit:"concrete" },
  timber: { keys:["timber", "post", "crate", "bwood", "bboard", "rtank", "screen", "hedge", "wpost", "wfloor", "wwall"], rest:0.45, bounce:true, fric:0.5, throw:0.8,
    split:"planks", pieces:4, keep:[0.9, 0.95], jitter:0.15, pop:1.6, spin:7, drag:0.9, angDrag:0.05, crumble:0,
    crumbs:{ n:[7, 5], size:[0.75, 0.09, 0.11], fly:[5, 10], up:[2, 6], rest:0.45, life:[0.9, 1.4], spin:14 },
    dust:[1, 1.0, 0xFFF3DC, 0xE9CFA0, 0.5], smoke:0xF2E0BC, chips:["chip_timber", 3], snd:"wood", hit:"crate" },
  steel: { keys:["steel", "truss", "iron", "gun", "strut", "bronze", "deck", "disc", "drum", "bpipe", "rail", "bcont", "bcont2", "sdeck"], rest:0.3, bounce:true, fric:0.4, throw:4, throwRef:7800,
    split:"halves", pieces:2, keep:[0.62, 0.88], jitter:0, pop:0.8, spin:3, drag:0, angDrag:0.1, crumble:0, bend:0.3, bendMax:0.42,
    crumbs:null, dust:null, smoke:0xB9C1CC, sparks:7, snd:"metal", hit:"steel" },
  rc: { keys:["core", "rc", "rcs"], rest:0.06, fric:0.7, throw:0.8,
    split:"chunks", pieces:2, tile:1.6, keep:[0.7, 0.9], jitter:0, pop:0, spin:0, drag:0, angDrag:0, crumble:0,
    crumbs:{ n:[3, 2], size:[0.34, 0.22, 0.34], fly:[1.5, 3], up:[0.5, 2], rest:0.1, life:[0.9, 1.3], spin:4 },
    dust:[2, 1.5, 0xE4E1DC, 0xA9A49C, 0.8], smoke:0xC6C2BB, chips:["chip_concrete", 2], snd:"thud", hit:"concrete" }
};
var MFX = { seed:1, cls:{}, st:{ glass:0, brick:0, stone:0, concrete:0, timber:0, steel:0, rc:0, crumbs:0, crumbled:0, shock:0, debrisGlass:0, bent:0, peakCrumbs:0 },
  bl:null, winT:0, winN:0, pxT:0, pxN:0, sparkT:0, q:[], glass:null, glassN:-1 };
(function(){
  for(var n in MATFX){ MATFX[n].name = n; MATFX[n].keys.forEach(function(k){ MFX.cls[k] = n; }); }
})();
function mfxClassOf(key){
  if(key === "tank" || key === "base" || key === "kbase") return null;
  if(MFX.cls[key]) return MFX.cls[key];
  var d = MEMBERS[key]; if(!d) return "concrete";
  var m = MATS[key], fam = ["brick", "stone", "timber", "steel", "glass"];
  for(var i=0;i<fam.length;i++) if(m && fam[i] !== key && m === MATS[fam[i]]) return MFX.cls[key] = fam[i];
  return MFX.cls[key] = d.glass ? "glass" : (d.snd === "steel" || d.bond === "steel") ? "steel" : "concrete";
}
function mfxOf(o){ return o.mc || (o.mc = MATFX[mfxClassOf(o.key) || "concrete"]); }
// the material's contact numbers go on a collider when the body is debris: a rigid piece, or a member with no bond left.
// A member that is still part of the frame keeps the MEMBERS numbers, so standing structures behave as before.
// Bodies over MFX_BIG m3 (a whole timber floor, a container) do not bounce like a plank: half the restitution, no Max rule, no air drag.
var MFX_BIG = 0.6;
function mfxContact(col, C, vol){
  if(MFX_OFF.contact) return;
  var big = vol > MFX_BIG;
  col.setRestitution(big ? C.rest*0.5 : C.rest); col.setFriction(C.fric);
  if(C.bounce && !big) col.setRestitutionCombineRule(RAPIER.CoefficientCombineRule.Max);
}
// Deterministic 0..1 from the level seed, the member's spawn position, a piece index and a salt. Fragment physics uses
// ONLY this (never rnd(), whose call count is part of the level's outcome, and never Math.random).
function mfxHash(b, i, s){
  var sp = b.spawn || b.P;
  var h = (MFX.seed | 0) ^ Math.imul((sp.x*100) | 0, 73856093) ^ Math.imul((sp.y*100) | 0, 19349663) ^ Math.imul((sp.z*100) | 0, 83492791);
  h ^= Math.imul(i + 1, 0x9E3779B1) ^ Math.imul(s + 1, 0x85EBCA6B);
  h = Math.imul(h ^ (h >>> 16), 0x7FEB352D); h = Math.imul(h ^ (h >>> 15), 0x846CA68B); h ^= h >>> 16;
  return (h >>> 0)/4294967296;
}
function mfxThrow(o){
  if(!MFX_ON || MFX_OFF.throw) return 1;
  var C = mfxOf(o);
  var k = C.throwRef ? 1 + (C.throw - 1)*Math.min(1, o.def.density/C.throwRef) : C.throw;
  if(o.frag) return k;
  if(o.anchor || !o.links) return 1;
  for(var i=0;i<o.links.length;i++) if(o.links[i].alive) return 1;
  if(!o.mfree && o.col && !o.keep && !o.prop){ o.mfree = true; mfxContact(o.col, C, 8*o.half[0]*o.half[1]*o.half[2]); }   // freed by this or an earlier blast: it is debris now
  return k;
}

// ---- crumbs: pooled visual 3D debris (one instanced draw, the fragment material, no physics bodies, no shadows).
// Ballistic on the CPU with a ground bounce; follows the game's slow-mo and hit-stop. Visual only: Math.random is fine.
var MC = (function(){
  var N = 220, mesh = new THREE.InstancedMesh(fragGeo, fragMesh.material, N), P = [], next = 0, seq = 0, live = 0;
  mesh.frustumCulled = false; mesh.castShadow = false; mesh.receiveShadow = false; mesh.raycast = function(){};
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  var m4 = new THREE.Matrix4(), c = new THREE.Color();
  m4.makeScale(0, 0, 0);
  for(var i=0;i<N;i++){ mesh.setMatrixAt(i, m4); mesh.setColorAt(i, c.setHex(0xffffff));
    P.push({ on:false, born:0, x:0, y:0, z:0, vx:0, vy:0, vz:0, ax:0, ay:1, az:0, ang:0, sp:0, sx:1, sy:1, sz:1, t:0, life:1, rest:0.2, gy:0.1, hit:0 }); }
  mesh.count = 0; mesh.visible = false; scene.add(mesh);
  function add(){
    var p = null, k, j;
    for(k=0;k<N;k++){ j = (next + k) % N; if(!P[j].on){ p = P[j]; p.i = j; next = (j + 1) % N; break; } }
    if(!p){ var o = null; for(k=0;k<N;k++){ if(!o || P[k].born < o.born){ o = P[k]; o.i = k; } } if(o.t > o.life*0.5) p = o; else return null; }
    p.on = true; p.born = ++seq; p.t = 0; p.hit = 0; p.ang = Math.random()*6.28;
    return p;
  }
  var q = new THREE.Quaternion(), ax = new THREE.Vector3(), pos = new THREE.Vector3(), sc = new THREE.Vector3();
  function step(dt){
    var n = 0, hi = -1;
    for(var i=0;i<N;i++){
      var p = P[i]; if(!p.on) continue;
      p.t += dt;
      if(p.t >= p.life){ p.on = false; m4.makeScale(0, 0, 0); mesh.setMatrixAt(i, m4); continue; }
      p.vy -= 9.81*1.5*dt;
      p.x += p.vx*dt; p.y += p.vy*dt; p.z += p.vz*dt; p.ang += p.sp*dt;
      if(p.y < p.gy && p.vy < 0){
        p.y = p.gy; p.hit++;
        if(p.hit <= 2 && -p.vy > 1.2){ p.vy = -p.vy*p.rest; p.vx *= 0.6; p.vz *= 0.6; p.sp *= 0.6; }
        else { p.vy = 0; p.vx *= 0.8; p.vz *= 0.8; p.sp *= 0.7; }
      }
      var k = p.t/p.life, s = k > 0.7 ? 1 - (k - 0.7)/0.3 : 1;
      q.setFromAxisAngle(ax.set(p.ax, p.ay, p.az), p.ang); pos.set(p.x, p.y, p.z); sc.set(p.sx*s, p.sy*s, p.sz*s);
      m4.compose(pos, q, sc); mesh.setMatrixAt(i, m4); n++; hi = i;
    }
    live = n; if(n > MFX.st.peakCrumbs) MFX.st.peakCrumbs = n;
    mesh.count = hi + 1; mesh.visible = n > 0; mesh.instanceMatrix.needsUpdate = true;
  }
  function clear(){ m4.makeScale(0, 0, 0); for(var i=0;i<N;i++){ P[i].on = false; mesh.setMatrixAt(i, m4); } mesh.count = 0; mesh.visible = false; mesh.instanceMatrix.needsUpdate = true; live = 0; }
  function tint(p, hex, lighten){
    linSet(c, hex); if(lighten) c.lerp(_mfxW, lighten);
    var v = 0.82 + Math.random()*0.26; c.r *= v; c.g *= v; c.b *= v;
    mesh.setColorAt(p.i, c); mesh.instanceColor.needsUpdate = true;
  }
  return { add:add, step:step, clear:clear, tint:tint, mesh:mesh, live:function(){ return live; }, N:N };
})();
var _mfxW = new THREE.Color(1, 1, 1), _mv = new THREE.Vector3(), _md = new THREE.Vector3(), _mq = new THREE.Quaternion(), _ml = new THREE.Vector3(), _ma = new THREE.Vector3(), _mp = new THREE.Vector3(), _mq2 = new THREE.Quaternion(), _ms = new THREE.Vector3();
// particle budget: the juice budget (frame time over 20 ms = half, reduced motion = half) and a burst limiter
// (many members failing in the same 120 ms share the pool)
function mfxBudget(n){
  var now = performance.now();
  if(now - MFX.winT > 120){ MFX.winT = now; MFX.winN = 0; }
  var k = MFX.winN > 150 ? 0.25 : MFX.winN > 70 ? 0.5 : 1;
  n = PX.cnt(n*k); MFX.winN += n; return n;
}
// sprite accents (dust, chips, glints, sparks) share the juice pool (60 live in a collapse) with the charge's own
// starburst, ring and smoke, which are spawned after the members break: at most 24 accent sprites per 120 ms, so the
// boom always finds room
function mfxPx(n){
  var now = performance.now();
  if(now - MFX.pxT > 120){ MFX.pxT = now; MFX.pxN = 0; }
  n = Math.min(PX.cnt(n), Math.max(0, 24 - MFX.pxN)); MFX.pxN += n; return n;
}
function mfxCol(b){ return b.key === "slab" ? L.palette : MEMBERS[b.key].color; }
// crumbs thrown from a failing body o (member or fragment). dir = unit vector away from the charge, or null (impact).
function mfxCrumbs(o, C, n, dir, vel){
  var K = C.crumbs; if(!K || n <= 0) return;
  n = mfxBudget(n);
  var col = mfxCol(o), hx = o.half[0], hy = o.half[1], hz = o.half[2];
  for(var i=0;i<n;i++){
    var p = MC.add(); if(!p) return;
    _mv.set((Math.random()*2 - 1)*hx, (Math.random()*2 - 1)*hy, (Math.random()*2 - 1)*hz).applyQuaternion(o.Q).add(o.P);
    p.x = _mv.x; p.y = Math.max(0.15, _mv.y); p.z = _mv.z;
    var sp = jr(K.fly[0], K.fly[1]), a = Math.random()*6.283, side = dir ? 0.45 : 1;
    p.vx = (dir ? dir.x*sp : 0) + Math.cos(a)*sp*side*0.6 + vel.x*0.6;
    p.vz = (dir ? dir.z*sp : 0) + Math.sin(a)*sp*side*0.6 + vel.z*0.6;
    p.vy = (dir ? Math.max(0, dir.y)*sp*0.5 : 0) + jr(K.up[0], K.up[1]) + vel.y*0.5;
    var s = jr(0.65, 1.25);
    p.sx = K.size[0]*s*jr(0.7, 1.1); p.sy = K.size[1]*s*jr(0.7, 1.1); p.sz = K.size[2]*s;
    _mv.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize(); p.ax = _mv.x; p.ay = _mv.y; p.az = _mv.z;
    p.sp = jr(-K.spin, K.spin); p.rest = K.rest; p.life = jr(K.life[0], K.life[1]); p.gy = 0.06 + Math.min(p.sx, p.sy, p.sz)*0.5;
    MC.tint(p, col, K.lighten || 0);
    MFX.st.crumbs++;
  }
}
function mfxDust(o, D, scale){
  if(!D) return;
  var n = mfxPx(D[0]*scale);
  for(var i=0;i<n;i++){
    var q = PX.add(); if(!q) return;
    var size = D[1];
    q.x = o.x + jr(-0.5, 0.5)*size; q.y = Math.max(0.3, o.y + jr(-0.25, 0.25)*size); q.z = o.z + jr(-0.5, 0.5)*size;
    q.vy = jr(0.25, 0.6); q.drag = 1.2; q.life = jr(0.75, 1.0); q.s0 = size*0.45; q.s1 = size*jr(0.9, 1.2); q.ease = 1;
    q.a0 = D[4]; q.fout = 0.45; q.rot = Math.random()*6.28; q.spin = jr(-0.5, 0.5); PX.frame(q, "smoke"); PX.tint(q, D[2], D[3]);
  }
}
function mfxGlints(o, half, n){
  n = mfxPx(n);
  for(var i=0;i<n;i++){
    var t = PX.add(); if(!t) return;
    t.x = o.x + jr(-1, 1)*(half[0] + 0.5); t.y = Math.max(0.3, o.y + jr(-1, 1)*(half[1] + 0.3)); t.z = o.z + jr(-1, 1)*(half[2] + 0.5);
    t.vy = -1.2; t.life = jr(0.22, 0.5); t.s0 = 0.35; t.s1 = jr(0.7, 1.0); t.a0 = 1; t.fin = jr(0.1, 0.5); t.fout = 0.7; t.rot = Math.random()*1.57;
    PX.frame(t, i % 2 ? "tw2" : "tw1");
  }
}
function mfxSparks(o, n, sp){
  var now = performance.now(); if(now - MFX.sparkT < 70) return; MFX.sparkT = now;
  jSparks(o, mfxPx(n), sp);
}
// the break of one member: crumbs + dust + sprite accents, by material
function mfxBreakFx(b, C, cause, vel){
  var imp = cause === "impact" || cause === "crush", dir = null, B = MFX.bl;
  if(!imp && B && gameT - B.t < 0.02){ dir = _md.copy(b.P).sub(B.o); dir.y *= 0.5; if(dir.lengthSq() < 1e-6) dir.set(0, 1, 0); dir.normalize(); }
  if(C.crumbs) mfxCrumbs(b, C, C.crumbs.n[imp ? 1 : 0], dir, vel);
  mfxDust(b.P, C.dust, imp ? 0.6 : 1);
  if(C.chips) jChips(b.P, C.chips[0].slice(5), mfxPx(imp ? 1 : C.chips[1]));
  if(C.glints) mfxGlints(b.P, b.half, C.glints);
  if(C.sparks) mfxSparks(b.P, C.sparks, 9);
}

// ---- rigid pieces. Returns [{o:offset in the member frame, h:half sizes}]
function mfxPlan(b, C, imp){
  var ext = [b.half[0]*2, b.half[1]*2, b.half[2]*2], keep = C.keep[imp ? 1 : 0], out = [], i, a;
  var Lx = ext[0] >= ext[1] && ext[0] >= ext[2] ? 0 : ext[1] >= ext[2] ? 1 : 2, o1 = (Lx + 1) % 3, o2 = (Lx + 2) % 3;
  if(C.split === "halves" || C.split === "planks"){
    // cut across the long axis at an uneven point (seeded); planks are also split along the grain
    var wide = ext[o1] >= ext[o2] ? o1 : o2, thin = wide === o1 ? o2 : o1;
    var segs = (C.split === "halves" || ext[Lx] >= 1.0) ? 2 : 1, cut = segs === 2 ? 0.38 + 0.24*mfxHash(b, 0, 7) : 1;
    var nW = C.split === "planks" ? Math.max(ext[wide] >= 0.2 ? 2 : 1, Math.min(3, Math.round(ext[wide]/0.3))) : 1;
    nW = Math.max(1, Math.min(nW, Math.floor(C.pieces/segs)));
    for(var s=0;s<segs;s++){
      var len = ext[Lx]*(s ? 1 - cut : cut), c0 = -ext[Lx]/2 + (s ? ext[Lx]*cut : 0) + len/2;
      for(var w=0;w<nW;w++){
        var h = [0, 0, 0], o = new THREE.Vector3(), ww = ext[wide]/nW, j = 1 - C.jitter*mfxHash(b, s*3 + w, 11);
        h[Lx] = len/2*(C.split === "planks" ? 0.94*j : keep);          // halves: a section is lost at the cut, so a cut column no longer carries
        h[wide] = C.split === "halves" ? ww/2 : ww/2*(nW > 1 ? keep*0.9 : keep);
        h[thin] = ext[thin]/2*(ext[thin] < 0.25 || C.split === "halves" ? 1 : 0.7);
        o.setComponent(Lx, c0); o.setComponent(wide, -ext[wide]/2 + ww*(w + 0.5)); o.setComponent(thin, 0);
        out.push({ o:o, h:h });
      }
    }
    return out;
  }
  var n = [1, 1, 1];
  for(i=0;i<3;i++) n[i] = Math.max(1, Math.min(3, Math.round(ext[i]/C.tile)));
  while(n[0]*n[1]*n[2] > C.pieces){ var k = n[0] >= n[1] && n[0] >= n[2] ? 0 : n[1] >= n[2] ? 1 : 2; n[k]--; }
  if(n[0]*n[1]*n[2] === 1) n[Lx] = 2;
  var hh = [ext[0]/n[0]/2, ext[1]/n[1]/2, ext[2]/n[2]/2], pi = 0;
  for(var x=0;x<n[0];x++) for(var y=0;y<n[1];y++) for(var z=0;z<n[2];z++){
    var hs = [], jj = 1 - C.jitter*mfxHash(b, pi, 13);
    for(a=0;a<3;a++) hs[a] = ext[a] < 0.25 ? hh[a] : hh[a]*keep*jj;     // thin members keep their thickness
    out.push({ o:new THREE.Vector3(-b.half[0] + hh[0]*(2*x + 1), -b.half[1] + hh[1]*(2*y + 1), -b.half[2] + hh[2]*(2*z + 1)), h:hs });
    pi++;
  }
  return out;
}
// replaces fragment(): the member becomes pieces of its own material, by the MATFX row
var MFX_OFFC = { name:"concrete", split:"chunks", pieces:4, tile:1.0, keep:[0.6, 0.85], jitter:0, pop:0, spin:0, rest:0.06, fric:0.7, throw:1, crumble:0, crumbs:MATFX.concrete.crumbs, dust:MATFX.concrete.dust };
function mfxFragment(b, cause){
  var C = mfxOf(b), imp = cause === "impact";
  var lv = b.rb.linvel(), av = b.rb.angvel();
  var v = _fv.set(lv.x, lv.y, lv.z), w = _fw.set(av.x, av.y, av.z);
  if(b.key === "tank"){ removeBlockBody(b); writeMatrix(b); return; }     // a fuel cell bursts
  MFX.st[C.name]++;
  if(MFX_OFF.split && C.split !== "none") C = MFX_OFFC;
  if(C.split === "none" && !MFX_OFF.glass){                                                   // glass: nothing rigid survives
    mfxBreakFx(b, C, cause, v); removeBlockBody(b); writeMatrix(b); return;
  }
  if(C.split === "none") C = MFX_OFFC;
  var plan = mfxPlan(b, C, imp);
  if(freeFragSlots(plan.length) < plan.length){
    // over the fragment budget (as before): a pulverised member turns to dust, an impact-shattered one stays one body
    if(!imp){ dust(b.P, 2, 1.4); mfxBreakFx(b, C, cause, v); removeBlockBody(b); writeMatrix(b); return; }
    b.rubble = true; return;
  }
  mfxBreakFx(b, C, cause, v);
  var key = b.key, col = mfxCol(b);
  removeBlockBody(b); writeMatrix(b);
  for(var i=0;i<plan.length;i++){
    var pc = plan[i], r = _fr.copy(pc.o).applyQuaternion(b.Q), pos = _fpos.copy(r).add(b.P);
    var bb = makeBody(key, pos.x, pos.y, pos.z, pc.h[0]*2, pc.h[1]*2, pc.h[2]*2, false, b.Q);
    var pv = _fpv.copy(w).cross(r).add(v), wx = w.x, wy = w.y, wz = w.z;
    if(C.pop && !MFX_OFF.kick){ var rl = r.length(); if(rl > 1e-4) pv.addScaledVector(r, C.pop*(0.5 + mfxHash(b, i, 1))/rl); }
    if(C.spin && !MFX_OFF.kick){ var sg = C.split === "halves" ? (i ? -1 : 1) : 1;
      wx += sg*C.spin*(mfxHash(b, i, 2)*2 - 1); wy += sg*C.spin*(mfxHash(b, i, 3)*2 - 1); wz += sg*C.spin*(mfxHash(b, i, 4)*2 - 1); }
    bb.rb.setLinvel({x:pv.x, y:pv.y, z:pv.z}, true); bb.rb.setAngvel({x:wx, y:wy, z:wz}, true);
    var vol = 8*pc.h[0]*pc.h[1]*pc.h[2];
    mfxContact(bb.col, C, vol); if(!MFX_OFF.contact){ if(C.drag && vol <= MFX_BIG) bb.rb.setLinearDamping(C.drag); if(C.angDrag) bb.rb.setAngularDamping(C.angDrag); }
    var slot = fragFree.pop();
    var f = rec({ rb:bb.rb, col:bb.col, key:key, def:b.def, half:pc.h.slice(), slot:slot, born:gameT, frag:true, mc:C,
      mass:b.def.density*8*pc.h[0]*pc.h[1]*pc.h[2], keep:b.keep, src:b, spawn:b.spawn, fi:i }, pos.x, pos.y, pos.z);
    f.Q.copy(b.Q); f.Q0.copy(b.Q); f.P0.copy(pos); f.V.copy(pv);
    linSet(_c, col).multiplyScalar(0.85*(1 - 0.16*C.jitter*(mfxHash(b, i, 5) - 0.5)*2)); fragMesh.setColorAt(slot, _c);   // rubble AO
    frags.push(f); probe.frags++;
  }
  fragMesh.instanceColor.needsUpdate = true;
}

// ---- blast hooks
// the charge's smoke takes the colour of the material it mostly hit (members within 0.75 R, the ones it just broke included)
function mfxBoomTint(o, R){
  if(!MFX_ON) return undefined;
  var cnt = {}, best = null, reach = R*0.75;
  for(var i=0;i<blocks.length;i++){
    var b = blocks[i]; if(b.anchor || b.keep || b.prop) continue;
    if(_mv.copy(b.P).sub(o).length() - Math.max(b.half[0], b.half[1], b.half[2]) > reach) continue;
    var n = mfxClassOf(b.key); if(!n) continue;
    cnt[n] = (cnt[n] || 0) + (n === "glass" ? 0.5 : 1);
    if(!best || cnt[n] > cnt[best]) best = n;
  }
  return best ? MATFX[best].smoke : undefined;
}
function mfxBlastAt(origin){ MFX.bl = { o:origin.clone(), t:gameT, spall:0 }; }
// glass beyond the charge's damage radius but inside its shock radius still shatters (std and cluster charges)
function mfxShock(b, dist, R, def){
  if(!MFX_ON || MFX_OFF.shock || !b.def.glass || def.kind === "shaped") return false;
  var C = mfxOf(b); if(!C.shock || dist > R*C.shock) return false;
  MFX.st.shock++; return true;
}
// steel that takes a charge and survives: kinks away from it, throws sparks
function mfxBlastHit(b, origin, k){
  if(!MFX_ON || b.dead) return;
  var C = mfxOf(b);
  if(!C.bend){   // any other material that survives a close hit: a spall of chips and dust where it was hit
    if(k > 0.35 && C.chips && MFX.bl && MFX.bl.spall < 2){ MFX.bl.spall++; nearestPoint(b, origin, _mp); jChips(_mp, C.chips[0].slice(5), mfxPx(2)); mfxDust(_mp, C.dust, 0.34); }
    return;
  }
  nearestPoint(b, origin, _mp);
  _mv.copy(_mp).sub(origin); if(_mv.lengthSq() < 1e-6) _mv.copy(b.P).sub(origin);
  mfxBend(b, _mv, C.bend*Math.min(1, 0.25 + k));
  mfxSparks(_mp, C.sparks, 10);
}
function mfxImpact(b, dv){
  if(!MFX_ON) return;
  var C = mfxOf(b); if(!C.bend) return;
  if(dv > 5){ _mv.copy(b.V).sub(b.Vp); mfxBend(b, _mv, C.bend*Math.min(1, (dv - 4)/14)); mfxSparks(b.P, 4, 6); }
}
// a rigid fragment took a hard hit (dv^2 = d2): masonry crumbles, steel sparks. Removal is queued (we are inside the loop).
function mfxFragHit(f, d2){
  var C = f.mc; if(!C) return;
  if(C.crumble && !MFX_OFF.crumble && d2 > C.crumble*C.crumble && gameT - f.born > 0.25 && !f.mq){ f.mq = true; MFX.q.push(f); return; }
  if(C.sparks && d2 > 25) mfxSparks(f.P, 3, 6);
}
var _mz = new THREE.Vector3();
function mfxFixed(){
  if(!MFX_ON) return;
  var i, f;
  // 1) masonry pieces that landed hard: gone, as crumbs and a puff
  if(MFX.q.length){
    for(i=0;i<MFX.q.length;i++){
      f = MFX.q[i]; if(frags.indexOf(f) < 0) continue;
      mfxCrumbs(f, f.mc, 3, null, _mz.set(0, 0, 0)); mfxDust(f.P, f.mc.dust, 0.34);
      wakeAround(f, 0.3); removeFrag(f, false); MFX.st.crumbled++;   // whatever rests on it must fall (Rapier does not wake a body whose support is removed)
    }
    MFX.q.length = 0;
  }
  // 2) glass shatters when a fast fragment touches it
  if(!frags.length || MFX_OFF.debris) return;
  if(MFX.glassN !== blocks.length || !MFX.glass){ MFX.glassN = blocks.length; MFX.glass = blocks.filter(function(b){ return b.def.glass && !b.anchor && !b.keep; }); }   // the protected building keeps the plain impact rule
  var G = MFX.glass; if(!G.length) return;
  for(i=0;i<frags.length;i++){
    f = frags[i]; if(f.sleeping || f.def.glass) continue;
    var v2 = f.V.lengthSq(), lim = 6;
    if(v2 < lim*lim) continue;
    var rad = Math.max(f.half[0], f.half[1], f.half[2]) + 0.12;
    for(var g=0;g<G.length;g++){
      var gb = G[g]; if(gb.dead || !gb.rb) continue;
      var dx = gb.P.x - f.P.x, dz = gb.P.z - f.P.z, dy = gb.P.y - f.P.y, reach = rad + Math.max(gb.half[0], gb.half[1], gb.half[2]);
      if(dx > reach || dx < -reach || dz > reach || dz < -reach || dy > reach || dy < -reach) continue;
      if(nearestPoint(gb, f.P, _mp).distanceTo(f.P) > rad) continue;
      MFX.st.debrisGlass++; failMember(gb, "impact");
    }
  }
}

// ---- steel kink (visual): a bent member is drawn as two half boxes that meet at a pushed-out middle. The body and its
// collider stay the straight box. 24 members at most; the straight instance is hidden while the kink shows.
var MB = (function(){
  var N = 24, mesh = new THREE.InstancedMesh(boxGeo, MATS.steel, N*2), free = [], used = 0, m4 = new THREE.Matrix4();
  mesh.frustumCulled = false; mesh.castShadow = true; mesh.receiveShadow = true; mesh.customDepthMaterial = ROUND_DEPTH;
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); mesh.setColorAt(0, new THREE.Color(0xffffff));
  mesh.userData.list = [];
  function clear(){ m4.makeScale(0, 0, 0); free.length = 0; for(var i=N-1;i>=0;i--){ free.push(i); mesh.setMatrixAt(i*2, m4); mesh.setMatrixAt(i*2 + 1, m4); mesh.userData.list[i*2] = mesh.userData.list[i*2 + 1] = null; }
    used = 0; mesh.visible = false; mesh.instanceMatrix.needsUpdate = true; }
  clear(); scene.add(mesh);
  return { mesh:mesh, free:free, clear:clear, take:function(){ if(!free.length) return -1; used++; mesh.visible = true; return free.pop(); },
    give:function(s){ m4.makeScale(0, 0, 0); mesh.setMatrixAt(s*2, m4); mesh.setMatrixAt(s*2 + 1, m4); mesh.userData.list[s*2] = mesh.userData.list[s*2 + 1] = null;
      free.push(s); used--; mesh.visible = used > 0; mesh.instanceMatrix.needsUpdate = true; } };
})();
function mfxBend(b, dw, ang){
  var C = mfxOf(b); if(!C.bend || b.dead || b.anchor || b.keep || !b.im || ang <= 0.01) return;
  var li = b.half[0] >= b.half[1] && b.half[0] >= b.half[2] ? 0 : b.half[1] >= b.half[2] ? 1 : 2;
  if(b.half[li] < 0.6) return;                                   // stubs stay straight
  _mq.copy(b.Q).invert(); _md.copy(dw).applyQuaternion(_mq); _md.setComponent(li, 0);
  if(_md.lengthSq() < 1e-6) _md.setComponent((li + 1) % 3, 1);
  _md.normalize();
  if(!b.bent){
    var s = MB.take(); if(s < 0) return;
    b.bent = { s:s, d:_md.clone(), th:0, li:li }; MFX.st.bent++;
    b.im.getColorAt(b.ii, _c); MB.mesh.setColorAt(s*2, _c); MB.mesh.setColorAt(s*2 + 1, _c); MB.mesh.instanceColor.needsUpdate = true;
    MB.mesh.userData.list[s*2] = MB.mesh.userData.list[s*2 + 1] = b;
    _m4.makeScale(0, 0, 0); b.im.setMatrixAt(b.ii, _m4); b.im.instanceMatrix.needsUpdate = true;
  }
  b.bent.th = Math.min(C.bendMax, b.bent.th + ang);
  mfxWriteBent(b); shadowDirty = true;
}
// draws the kinked member; returns false when the kink is over (the member died) so writeMatrix writes as usual
function mfxWriteBent(b){
  var B = b.bent, s = B.s*2;
  if(b.dead && !b.rubble){ MB.give(B.s); b.bent = null; return false; }
  _mp.copy(b.P0).lerp(b.P, alpha); _mq2.copy(b.Q0).slerp(b.Q, alpha);
  var h = b.half[B.li], c = Math.cos(B.th), sn = Math.sin(B.th);
  _ml.set(0, 0, 0).setComponent(B.li, 1); _ma.copy(_ml).cross(B.d);
  for(var k=0;k<2;k++){
    var sg = k ? 1 : -1;
    _mv.copy(_ml).multiplyScalar(sg*h*(1 - c/2)).addScaledVector(B.d, sn*h/2).applyQuaternion(_mq2).add(_mp);
    _mq.setFromAxisAngle(_ma, k ? -B.th : B.th); _mq.premultiply(_mq2);
    _ms.set(b.half[0]*2, b.half[1]*2, b.half[2]*2).setComponent(B.li, h/c + 0.03);
    _m4.compose(_mv, _mq, _ms); MB.mesh.setMatrixAt(s + k, _m4);
  }
  MB.mesh.instanceMatrix.needsUpdate = true;
  return true;
}

// ---- sound: each material has its own break sound (existing events, no new samples) and impact family
function mfxBreakSnd(b){
  var C = MFX_ON ? mfxOf(b) : null, s = C ? C.snd : null;
  if(s === "wood") matSnd("beam_snap", b);
  else if(s === "metal") matSnd("steel_clang", b, { mass:Math.min(3, b.mass/2000) });
  else if(s === "grit"){ matSnd("concrete_crack", b); if(window.SFX && SFX.ctx && take("gravel")) snd("gravel", { intensity:0.5, pan:sndPan(b.P) }); }
  else if(s === "thud" && isBeam(b)){ if(window.SFX && SFX.ctx && take("concrete") && take("all")) snd("debris", { material:"concrete", mass:Math.max(1.5, Math.min(3, b.mass/1500)), intensity:1.3, pan:sndPan(b.P) }); }
  else matSnd(!C && isBeam(b) ? "beam_snap" : "concrete_crack", b);
}
function mfxSndMat(key){ if(!MFX_ON) return null; var n = mfxClassOf(key); return n ? MATFX[n].hit : null; }

function mfxFrame(rdt){
  if(gamePaused) return;
  MC.step(rdt*(hitStop > 0 ? 0 : timeScale));
}
function mfxReset(){ MC.clear(); MB.clear(); MFX.q.length = 0; MFX.glass = null; MFX.glassN = -1; MFX.bl = null; }

// ---- test scene (materials-fx/tools/capture.js): kind "matfx" = one small tower per material, side by side.
// P.only = one material name; P.mats = the list. Each tower: 3 storeys of 4 corner posts + a front and a back wall
// member + a cap, all of that material (steel: steel posts and walls under concrete caps, the way levels use it).
var MFX_SCENE = { glass:["glass", "glass", "glass"], brick:["brick", "brick", "brick"], stone:["stone", "stone", "stone"], concrete:["concrete", "concrete", "concrete"],
  timber:["timber", "timber", "timber"], steel:["steel", "steel", "slab"], rc:["core", "core", "core"] };
LANDMARK_BUILD.matfx = function(P){
  var list = P.only ? [P.only] : (P.mats || ["glass", "brick", "stone", "concrete", "timber", "steel"]), pitch = P.pitch || 4.5, W = 2.8, FHm = 2.5, floors = P.f || 3;
  list.forEach(function(name, ti){
    var k = MFX_SCENE[name] || MFX_SCENE.concrete, x0 = (ti - (list.length - 1)/2)*pitch, thin = name === "glass";
    addBlock(x0, -0.25, 0, W + 0.8, 0.5, W + 0.8, "base", {anchor:true});
    var y = 0, pw = thin ? 0.2 : 0.45, hh = W/2 - pw/2, hm = P.hp || 0.4;   // hp x0.4: one TNT breaks the ground storey of every breakable material
    if(name === "steel"){ addBlock(x0, 0.15, 0, W + 0.1, 0.3, W + 0.1, "slab", {floor:0, hpMul:hm}); y = 0.3; }   // steel stands on concrete, as in the levels: the slab dies, the steel is freed
    for(var f=0; f<floors; f++){
      lmCorners(function(sx, sz){ addBlock(x0 + sx*hh, y + FHm/2, sz*hh, pw, FHm, pw, thin ? "concrete" : k[0], {floor:f, hpMul:hm}); });
      [-1, 1].forEach(function(s){ addBlock(x0, y + FHm/2, s*(hh + (thin ? 0.02 : 0)), thin ? W - 2*pw - 0.04 : 1.1, FHm - (thin ? 0.04 : 0), thin ? 0.12 : 0.3, k[1], {floor:f, hpMul:hm}); });
      if(thin) [-1, 1].forEach(function(s){ addBlock(x0 + s*hh, y + FHm/2, 0, 0.12, FHm - 0.04, W - 2*pw - 0.04, k[1], {floor:f, hpMul:hm}); });
      y += FHm;
      addBlock(x0, y + 0.175, 0, W + 0.1, 0.35, W + 0.1, thin ? "slab" : k[2], {floor:f, hpMul:hm});
      y += 0.35;
    }
  });
  return { w:list.length*pitch, d:W + 0.8 };
};
var MFX_API = {
  on:MFX_ON, table:function(){ return JSON.parse(JSON.stringify(MATFX)); },
  classOf:function(key){ return mfxClassOf(key); },
  classes:function(){ var o = {}; Object.keys(MEMBERS).forEach(function(k){ o[k] = mfxClassOf(k); }); return o; },
  stats:function(){ return Object.assign({ live:MC.live(), frags:frags.length }, MFX.st); },
  reset:function(){ for(var k in MFX.st) MFX.st[k] = 0; },
  // fragments as data, for the physics measurements (throw distance, bounce)
  frags:function(){ return frags.map(function(f){ return { key:f.key, cls:f.mc ? f.mc.name : mfxClassOf(f.key), x:f.P.x, y:f.P.y, z:f.P.z, v:f.V.length(), sx:f.spawn ? f.spawn.x : 0, sleep:!!f.sleeping, vol:8*f.half[0]*f.half[1]*f.half[2] }; }); },
  zoom:function(k){ zoomT = zoomK = k; },   // test scene only: camera distance factor
  bent:function(){ return blocks.filter(function(b){ return b.bent; }).map(function(b){ return { i:blocks.indexOf(b), key:b.key, th:b.bent.th }; }); }
};
