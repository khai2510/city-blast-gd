// ---- levels6 v14 MONUMENT (D-blast-HERO-MONUMENT, Owner 12/11/2026; prototype on ONE level: L32 "Sky Saucer", Figma tile F04)
// Appended LAST inside main() by tools/src-l32.js (base: checkpoints/index-v10f-l13-36.html, read only). Nothing in v10-v13 is edited.
//   1) part kind "mon14": the F04 tower rebuilt as a giant landmark: buttressed base, a glazed shaft of 9 structural storeys (18 floors
//      seen through the glass), flared capital, the lower saucer (restaurant + lounge behind a glass band, a terrace with a rail on its
//      roof), a glazed stem, the upper observation deck under a low cone roof, a mast. Every structural box is an ordinary member
//      (piers, floor cassettes, glass panes); everything seen INSIDE (floor plates, lift core, columns, stairs, desks, tables, lamps) and
//      every round piece is visual decor riding on a member (L6_KD instancing: it moves and dies with its member, it has no body).
//   2) real glass: member key "mglass" + decor shapes "gsec" share one transparent, reflecting material; "lit*" shapes are unlit (lamps).
//   3) camera: one-finger vertical drag (or two-finger drag) pans the view up / down the tower, pinch / wheel zooms much closer (the
//      camera stays outside every building), a slight tilt towards level when close; BLAST and double-tap put the framing back.
//   4) the L32 level data is replaced at runtime (hero + surroundings); BODY_CAP is lifted (Owner: no body limit, report the count).
// Flags (URL): ?mon=0 the old L32 hero and scene · ?mcam=0 the old camera (no vertical drag, old zoom limits). window.__blast.m14 = API.
var M14 = { hero:true, cam:true, lv:31, pan:0, panT:0, info:null, ringSeq:0 };
BODY_CAP = 1e9;   // Owner 12/11: no body-count limit
(function(){
  var QS14 = new URLSearchParams(location.search);
  M14.hero = QS14.get("mon") !== "0"; M14.cam = QS14.get("mcam") !== "0";
  M14.hints = QS14.get("hints") === "1";   // STD-v3 (D-blast-NOHINT, Owner 14/11): no placement hints by default; ?hints=1 = the STD-v2 aids back (comparison only)
  // ------------------------------------------------------------------ members
  Object.assign(MEMBERS, {
    mdeck:  { hp:150, density:800,  fric:0.7,  rest:0.06, dmg:1.0, armor:0, shatter:10,  bond:"steel",    color:0xC9C7C2, ns:true },   // light steel-framed floor cassette: welded to its neighbours (a cantilevered saucer needs joints that bend), breaks like a slab
    mcol:   { hp:60,  density:1200, fric:0.6,  rest:0.08, dmg:1.0, armor:0, shatter:9,   bond:"steel",    color:0xF7F4EC },              // slim steel column inside the saucers (one TNT breaks it)
    mglass: { hp:14,  density:700,  fric:0.45, rest:0.1,  dmg:2.2, armor:0, shatter:3.5, bond:"glass",    color:0x46B4D2, glass:true, ns:true },   // curtain-wall pane, really transparent
    mpost:  { hp:60,  density:1500, fric:0.6,  rest:0.08, dmg:1.0, armor:0, shatter:9,   bond:"steel", color:0x6E737C, ns:true }    // mast
  });
  MATS.mdeck = MATS.concrete; MATS.mpost = MATS.concrete; MATS.mcol = MATS.concrete;
  // ---- MASSIVE REINFORCED CONCRETE (Owner 12/11, second round: "two bombs on a spot before it even reacts"). One reusable tier for the
  // structural piers of every monument hero: M14_RC. TNT does 260 x (1 - d/3.8)^1.1 x (1 - armor) = 247 on contact, so
  //   1 TNT on the pier = 41% : chips and hairline cracks (stage 1), nothing structural
  //   2 TNT             = 82% : the cover spalls, the rebar cage shows (stage 2), the pier still carries
  //   3 TNT             = it fails (stage 3): its storey sags, the tower goes when enough piers of one side are gone
  // and the damage STAYS between blasts (cracked concrete does not heal; every other family is reset at BLAST by v10), so 1 + 1 + 1 over
  // three blasts equals 3 at once. Ladder (v10 L6_LADDER, per TNT: wood > brick > concrete > RC > steel) is kept: this is the RC family
  // (armor 0.05, below steel's 0.25) with the hp of a massive section (>= 0.8 m2; the ladder's rc pier is 0.75 m2 at hp 220).
  // Bond type stays "concrete", so once a pier is gone the collapse is the one measured before. Deterministic: no random term.
  var M14_RC = { hp:600, armor:0.05, dmg:1, push:0.45, s1:0.08, s2:0.6 };
  MEMBERS.hrc = { hp:M14_RC.hp, density:2400, fric:0.7, rest:0.06, dmg:M14_RC.dmg, armor:M14_RC.armor, shatter:12, bond:"concrete", color:0xD3D1CC };
  MATS.hrc = MATS.concrete; L11_COL.hrc = 1; L6_PUSH.hrc = M14_RC.push; M14.RC = M14_RC;
  // the floor cassettes are RC of the same tier (a 150 hp slab died from two TNT on a pier 1.9 m above it, and the storeys above came down:
  // 4 TNT on an upper storey dropped the tower), the slim saucer columns are steel-ladder members (two TNT stacked)
  MEMBERS.mdeck.hp = M14_RC.hp; MEMBERS.mdeck.armor = M14_RC.armor; L6_PUSH.mdeck = M14_RC.push;
  MEMBERS.mcol.hp = 300; MEMBERS.mcol.armor = 0.25; L6_PUSH.mcol = 0.3;
  var RC_KEEP = { hrc:1, mdeck:1 };   // keys whose damage stays between blasts

  L11_SLAB.mdeck = 1; L11_WALL.mglass = 1;
  // sky reflection: a tiny gradient cube (no texture file): pale zenith, bright horizon, warm ground
  function face(top, mid, bot){ var c = document.createElement("canvas"); c.width = c.height = 32; var g = c.getContext("2d"), gr = g.createLinearGradient(0, 0, 0, 32);
    gr.addColorStop(0, top); gr.addColorStop(0.5, mid); gr.addColorStop(1, bot); g.fillStyle = gr; g.fillRect(0, 0, 32, 32); return c; }
  var side = face("#8fd0ff", "#fff6e0", "#c9b48a"), env = new THREE.CubeTexture([side, side, face("#7cc4ff", "#7cc4ff", "#7cc4ff"), face("#b9a47c", "#b9a47c", "#b9a47c"), side, side]);
  env.encoding = THREE.sRGBEncoding; env.needsUpdate = true;
  M14.glassMat = new THREE.MeshPhongMaterial({ color:0xffffff, transparent:true, opacity:0.44, depthWrite:false, envMap:env, reflectivity:0.5, combine:THREE.AddOperation,
    specular:0xffffff, shininess:120 });
  M14.litMat = new THREE.MeshBasicMaterial({ color:0xffffff, toneMapped:false, fog:false });
  M14.glareMat = new THREE.MeshBasicMaterial({ color:0xffffff, transparent:true, opacity:0.2, depthWrite:false });
  MATS.mglass = M14.glassMat;
  // ------------------------------------------------------------------ decor shapes (sectors of a round piece: 16 make the ring, each rides its own member)
  var NS = 16, DA = Math.PI*2/NS, G = l6KdGeos();
  G.sec  = new THREE.CylinderGeometry(0.5, 0.5, 1, 2, 1, false, 0, DA);        // slice of a disc
  G.fsec = new THREE.CylinderGeometry(0.5, 0.25, 1, 2, 1, false, 0, DA);       // slice of a flare (wide end up)
  G.csec = new THREE.CylinderGeometry(0.04, 0.5, 1, 2, 1, false, 0, DA);       // slice of a low cone roof
  G.gsec = new THREE.CylinderGeometry(0.5, 0.5, 1, 2, 1, true, 0, DA);         // slice of a glass band (open ends)
  // interior / small pieces: their own instanced meshes that cast no shadow (the shell casts it), with low-poly round shapes
  G.ibox = new THREE.BoxGeometry(1, 1, 1); G.icyl = new THREE.CylinderGeometry(0.5, 0.5, 1, 8); G.ibush = new THREE.SphereGeometry(0.5, 6, 4);
  G.glare = new THREE.BoxGeometry(1, 1, 1);                                   // a white sheen streak on a pane (cartoon glass)
  G.lit  = new THREE.BoxGeometry(1, 1, 1);                                     // lamp / lit panel
  G.lsec = new THREE.CylinderGeometry(0.5, 0.5, 1, 2, 1, true, 0, DA);         // slice of a lit ring
  var kb0 = l6KdBuild;
  l6KdBuild = function(){ kb0();
    var m = L6_KD.mesh.gsec; if(m){ m.material.dispose(); m.material = M14.glassMat; m.castShadow = false; m.receiveShadow = false; m.renderOrder = 2; }
    m = L6_KD.mesh.glare; if(m){ m.material.dispose(); m.material = M14.glareMat; m.castShadow = false; m.receiveShadow = false; m.renderOrder = 3; }
    ["ibox", "icyl", "ibush"].forEach(function(g){ var q = L6_KD.mesh[g]; if(q) q.castShadow = false; });
    ["lit", "lsec"].forEach(function(g){ var q = L6_KD.mesh[g]; if(q){ q.material.dispose(); q.material = M14.litMat; q.castShadow = false; q.receiveShadow = false; } }); };
  var bi0 = buildInstances;
  buildInstances = function(){ var r = bi0.apply(this, arguments); if(inst.mglass){ inst.mglass.mesh.castShadow = false; inst.mglass.mesh.renderOrder = 2; } return r; };
  // ------------------------------------------------------------------ the tower
  var C = { conc:0xD6D3CC, concD:0x9EA2A8, rib:0xB9BDC2, dark:0x5C626C, core:0x4A4F5A, floor:0xEFE6D2, wood:0xC58B55, teal:0x3F93A8, orange:0xE0863F, green:0x62A544,
    white:0xF7F4EC, warm:0xFFD98A, warm2:0xFFF1C4, amber:0xFFB347, red:0xFF5A3C, sofa:0xD9714A, sofa2:0x5FA8B8, slate:0x6B7280, frame:0x4E6672 };
  // ================================================================== H0: HELPER API for the L1-36 batches (D-blast-ROLLOUT, 13/11/2026)
  // A batch patch (levels6/patch/v15-<batch>.js, appended after this file inside main()) calls M14.api.* and never edits v14.
  // Documented in levels6/L32-MONUMENT.md "Helper API". L32 itself goes through the same helpers with its round-6 values.
  M14.api = {};
  // (1) MATERIALS of a monumental hero: the v10 ladder (wood > brick > concrete > RC > steel, per TNT) or the massive RC tier.
  //     pier = structural columns, deck = floor cassettes (light, steel-type joints so a cantilever stands), col = slim columns,
  //     rc = the damage stays between blasts + rcDecor marks, tint = [pier, deck] colours (rc keeps the L32 greys).
  ["W", "B", "C", "S"].forEach(function(k, i){ var q = [{ hp:60, armor:0, shatter:8, color:0xB9783E }, { hp:150, armor:0.1, shatter:9, color:0xC66A48 }, { hp:150, armor:0, shatter:10, color:0xC9C7C2 }, { hp:450, armor:0.25, shatter:16, color:0x7E8DA2 }][i];
    MEMBERS["md" + k] = Object.assign({}, MEMBERS.mdeck, q); MATS["md" + k] = MATS.concrete; L11_SLAB["md" + k] = 1; L6_PUSH["md" + k] = i === 3 ? 0.3 : 1; });
  M14.api.MAT = {
    rc:       { pier:"hrc",      deck:"mdeck", col:"mcol",     rc:true },
    wood:     { pier:"wpost",    deck:"mdW",   col:"wpost",    tint:[0xD99A4E, 0xB9783E] },
    brick:    { pier:"bk",       deck:"mdB",   col:"bk",       tint:[0xC9583A, 0xB7553A] },
    concrete: { pier:"concrete", deck:"mdC",   col:"concrete", tint:[0xD6D3CC, 0x9EA2A8] },
    steel:    { pier:"steel",    deck:"mdS",   col:"steel",    tint:[0x7E8DA2, 0x5E6B7D] }
  };
  M14.api.mat = function(name){ return M14.api.MAT[name || "rc"] || M14.api.MAT.rc; };
  // TNT one hit does to a member (on contact, measured factor 0.947 for the charge's stand-off) and how many it needs in one blast
  M14.api.perTnt = function(b){ return CHARGES.tnt.dmg*0.947*b.def.dmg*(1 - b.def.armor); };
  M14.api.need = function(b){ return Math.max(1, Math.ceil(b.hp0/M14.api.perTnt(b) - 0.02)); };
  // (hero part helpers) ring(): a tagger for the piers of one storey: tag(pier, storey, qx, qz); two neighbours gone = that storey crushes
  M14.api.ring = function(){ var id = ++M14.ringSeq; return function(p, st, qx, qz){ p.m14ring = { id:id + ":" + st, k:(Math.round(Math.atan2(qz, qx)/(Math.PI/4)) + 8) % 8 }; }; };
  // floorIn(host, y, {hw, lobby, fi, rr, x, z}): one floor of interior decor on `host` (a cassette): plate, core doors, lamps, columns, furniture.
  //   hw = half width of the floor (default 4.54 = L32), (x, z) = the floor's centre in the part, rr = a seeded 0..1 generator, fi = floor index
  M14.api.floorIn = function(host, y, o){ o = o || {}; var hw = o.hw || 4.54, lobby = o.lobby, fi = o.fi || 0, rr = o.rr || Math.random, ox = o.x || 0, oz = o.z || 0, s1 = hw/4.54, i;
    var K = function(g, c, x, yy, z, sx, sy, sz, rx, ry, rz){ l6KdAdd(host, g, c, ox + x*s1, yy, oz + z*s1, sx*s1, sy, sz*s1, rx, ry, rz); };
      // the floor plate: o.plateHw = its real half width (no scaling; 0 = no plate: the part draws its own). Without it the old rule holds
    // (2*hw scaled by hw/4.54: right at 4.54, too wide above it: STD-v2 gap (a))
    if(o.plateHw != null){ if(o.plateHw > 0 && !lobby) l6KdAdd(host, "ibox", C.floor, ox, y - 0.13, oz, 2*o.plateHw, 0.26, 2*o.plateHw); }
    else if(!lobby) K("ibox", C.floor, 0, y - 0.13, 0, 2*hw, 0.26, 2*hw);
      // lift doors (lit) on the four core faces, a lit floor indicator
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function(q, qi){ var cx = q[0]*1.76, cz = q[1]*1.76;
        K("lit", (fi + qi) % 3 === 0 ? C.warm2 : C.warm, cx, y + 1.15, cz, q[0] ? 0.06 : 1.5, 2.1, q[0] ? 1.5 : 0.06);
        K("ibox", C.dark, cx*1.01, y + 1.15, cz*1.01, q[0] ? 0.05 : 0.08, 2.1, q[0] ? 0.08 : 0.05); });
      // ceiling lamp strips (lit), two per side
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function(q){ K("lit", C.warm2, q[0]*3.3, y + 2.62, q[1]*3.3, q[0] ? 0.3 : 5.6, 0.07, q[0] ? 5.6 : 0.3); });
      // slim round columns
      [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(function(q){ K("icyl", C.white, q[0]*2.9, y + 1.36, q[1]*2.9, 0.34, 2.72, 0.34); });
      if(lobby){   // reception desk, a lit wall, benches
        K("ibox", C.wood, 0, y + 0.55, 3.3, 3.2, 1.1, 0.7); K("lit", C.amber, 0, y + 0.95, 2.93, 3.0, 0.14, 0.05);
        K("ibox", C.sofa, -3.2, y + 0.3, 0, 0.8, 0.6, 2.4); K("ibox", C.sofa2, 3.2, y + 0.3, 0, 0.8, 0.6, 2.4); return; }
      // desks with a lit screen, sofas, plants: a different layout on every floor (seeded, the same every run)
      for(i=0;i<4;i++){ var sx = i & 1 ? 1 : -1, sz = i & 2 ? 1 : -1, v = rr();
        if(v < 0.55){ var along = rr() < 0.5; K("ibox", C.wood, sx*3.55, y + 0.4, sz*(1.0 + rr()*1.6), along ? 0.8 : 1.5, 0.8, along ? 1.6 : 0.8); K("lit", 0xBFEFFF, sx*3.55, y + 1.0, sz*1.4, 0.5, 0.32, 0.05); }
        else if(v < 0.8) K("ibox", (fi + i) % 2 ? C.sofa : C.sofa2, sx*(1.2 + rr()*1.5), y + 0.3, sz*3.6, 2.0, 0.6, 0.8);
        else K("ibox", C.wood, sx*2.0, y + 0.5, sz*3.7, 2.6, 1.0, 0.5);
        if(rr() < 0.7){ K("icyl", C.white, sx*4.0, y + 0.25, sz*4.0, 0.5, 0.5, 0.5); K("ibush", C.green, sx*4.0, y + 0.95, sz*4.0, 0.8, 1.0, 0.8); } }
  };
  // rcDecor(pier, nx, nz, fx, fz, w): the hidden damage marks of an RC pier on the face with normal (nx, nz) at (fx, fz), width w.
  // Stage 1: chips + hairline cracks; stage 2: the cover gone over 1.7 m (dark core), the rebar cage (rust bars + ties), a long crack.
    // damage decor of an RC pier, hidden until it is hit: on the face with normal (nx, nz) at (fx, fz), width w. Stage 1: chips + hairline
    // cracks; stage 2: the cover gone over 1.7 m (dark core), the rebar cage (rust bars + ties), a long crack. Shown at the blast's height.
  M14.api.rcDecor = function(p, nx, nz, fx, fz, w){ var kd = l6KdAdd; var X = !!nx, sg = X ? nx : nz, add = function(st, c, u, v, su, sv, th, rot){
        kd(p, "ibox", c, fx + (X ? sg*th/2 : u), p.spawn.y, fz + (X ? u : sg*th/2), X ? th : su, sv, X ? su : th, X ? sg*(rot || 0) : 0, 0, X ? 0 : -sg*(rot || 0));
        var e = p.kd[p.kd.length - 1]; e.m14 = { st:st, s:e.s.clone(), v:v }; e.s.set(0, 0, 0); };
      var CR = 0x3A3D44, CH = 0x8C8F95, CO = 0x5E5148, RB = 0xB5532A;
      add(1, CR, -0.12*w, 0.25, 0.05, 1.5, 0.05, 0.7); add(1, CR, 0.2*w, -0.35, 0.05, 1.0, 0.05, -0.5); add(1, CH, 0.18*w, 0.3, 0.3*w, 0.28, 0.04); add(1, CH, -0.24*w, -0.3, 0.22*w, 0.2, 0.04);
      add(2, CO, 0, 0, 0.84*w, 1.7, 0.06); [-0.3, 0, 0.3].forEach(function(u){ add(2, RB, u*w, 0, 0.07, 1.7, 0.1); }); [-0.5, 0.5].forEach(function(v){ add(2, RB, 0, v, 0.8*w, 0.06, 0.12); });
      add(2, CR, 0.1*w, 1.9, 0.06, 2.2, 0.05, 0.12); add(2, CR, -0.15*w, -1.6, 0.06, 1.4, 0.05, -0.2); p.m14s = 0; };
  // (2) DOTS on any member: track(member | [members] | selector, {cue}) = show its slots (need() of its material, minus barrels at its
  //     foot) once it is hit or has a TNT on it; cue:true = from the first second, pulsing (only where the level's aids allow cue dots).
  M14.api.track = function(what, o){ var list = typeof what === "string" ? selectMembers(what, (o && o.floor) || 0).map(function(m){ return m.b; }) : Array.isArray(what) ? what : [what];
    list.forEach(function(b){ if(b && !b.anchor) b.m14dot = { cue:!!(o && o.cue) }; }); return list; };
  // (1b) STD-v2: BLAST-PROOF FLOORS for a ladder-material hero. A ladder slab / cassette (hp 60-150) dies from ONE TNT on it or next to
  //     it, and the storeys above come down through the tower (A1: 76-88 % from a single TNT high up). floors(key, o) registers a copy of
  //     member `key` and returns its key: blastProof (default true) = hp 600, armor 0.7, shoved a fifth as hard when bonded (o.push); it
  //     still shatters on landing and is reset at every BLAST like any ladder member. density = kg/m3 (or mass = a factor on the copy's
  //     density) for a lighter floor: piers under heavy slabs stand close to their crushing load. name = the new key (default key_bp).
  M14.api.floors = function(key, o){ o = o || {}; var bp = o.blastProof !== false, n = o.name || (key + (bp ? "_bp" : "") + (o.density || o.mass ? "_l" : "")), q = {};
    if(bp){ q.hp = 600; q.armor = 0.7; } if(o.density) q.density = o.density; else if(o.mass) q.density = MEMBERS[key].density*o.mass;
    MEMBERS[n] = Object.assign({}, MEMBERS[key], q); MATS[n] = MATS[key] || MATS.concrete; L11_SLAB[n] = 1; L6_PUSH[n] = ("push" in o) ? o.push : bp ? 0.2 : L6_PUSH[key]; return n; };
  // (1c) STD-v2: TIP RULE for a ladder tower whose lesson is a fall DIRECTION. tip({piers, skin, decks, hinge, xz}) tags the 8 perimeter
  //     piers of one (ground) storey in order round it (a corner, a middle pier, a corner on every face; xz(p) = [x, z] of the pier from
  //     the storey's centre, or null for an inner pier). Two piers next to each other gone -> the third pier of that FACE gives way
  //     0.15 s later (game time: deterministic) with the skin panels that touch those three; the other five stand, so the tower tips
  //     TOWARDS that face by the ordinary physics. One lost pier, or two that are not neighbours, never drop it. hinge (seconds, STD-v2:
  //     2.5): the two side legs next to the lost face go 0.4 s later and the three legs of the far face cannot be crushed for that long,
  //     so a heavy tower turns over on them instead of sitting down. 8 s later whatever of the storey stands with no floor over it comes
  //     down. Returns the ring R; R.onTip = function(m, fail) is a hero's own follow-up (m = position 0..7 of the face's middle pier).
  //     (ring() = the STD-v1 storey rule: the whole storey crushes, a straight drop with no direction.)
  M14.api.tip = function(o){ var xz = o.xz || function(p){ return p.m14xz || null; };
    var R = { tipped:false, hold:o.hinge || 0, skin:o.skin || [], decks:o.decks || [], list:(o.piers || []).filter(function(p){ var q = xz(p); return q && (Math.abs(q[0]) > 0.05 || Math.abs(q[1]) > 0.05); }) };
    R.list.forEach(function(p){ var q = xz(p); p.m14tip = R; p.m14tk = (Math.round(Math.atan2(Math.sign(Math.round(q[1]*10)), Math.sign(Math.round(q[0]*10)))/(Math.PI/4)) + 8) % 8; }); return R; };
  // (4) AIDS by tier (skill 4b). L.aid = {open, cue, tip, cleanup, fail, dots} overrides any field.
  //     open: "solution" | "foot" | "whole" (push-in or not) · cue: pulsing dots from the first second · tip: the one-line tip
  //     cleanup: "yes" | "second" (from the second attempt) | "no" · dots: "all" | "rc" (damage dots on RC members only) · fail: text style
  // STD-v3 (D-blast-NOHINT, 14/11): NO placement hint on any tier. Every tier: open "whole" (no push-in on the foot / the solution), no
  // cue dots, no tip line, no cleanup dots, dots "none" (no damage dots / slots either), fail "rule" (a principle, never a spot).
  // The level's own L.aid cannot switch a hint back on (a1cue2 / b1cue2 included). ?hints=1: AIDS = AIDS_HINTS (the STD-v2 table).
  M14.api.AIDS_HINTS = {
    T:  { open:"solution", cue:true,  tip:true,  cleanup:"yes",    dots:"all", fail:"count" },
    R:  { open:"foot",     cue:true,  tip:true,  cleanup:"yes",    dots:"all", fail:"place" },
    N1: { open:"foot",     cue:true,  tip:true,  cleanup:"yes",    dots:"all", fail:"place" },   // N teach (L.teaches set) = L32
    N:  { open:"foot",     cue:false, tip:false, cleanup:"yes",    dots:"all", fail:"place" },   // N practice
    H:  { open:"foot",     cue:false, tip:false, cleanup:"second", dots:"all", fail:"trick" },
    SH: { open:"whole",    cue:false, tip:false, cleanup:"no",     dots:"rc",  fail:"line" },
    B:  { open:"whole",    cue:false, tip:false, cleanup:"no",     dots:"rc",  fail:"line" }
  };
  M14.api.NOHINT = { open:"whole", cue:false, tip:false, cleanup:"no", dots:"none", fail:"rule" };
  M14.api.AIDS = M14.hints ? M14.api.AIDS_HINTS : (function(){ var o = {}; Object.keys(M14.api.AIDS_HINTS).forEach(function(k){ o[k] = Object.assign({}, M14.api.NOHINT); }); return o; })();
  M14.api.aids = function(Lv){ Lv = Lv || L; var t = String(Lv.tier || "N"), k = Lv.boss ? "B" : t === "N" ? (Lv.teaches ? "N1" : "N") : M14.api.AIDS[t] ? t : "N";
    var a = Object.assign({}, M14.api.AIDS[k], Lv.aid || {}); return M14.hints ? a : Object.assign(a, M14.api.NOHINT); };
  // fail text in on-screen words, by the tier's style, never more than 9 words (STD-v2; the main build's short-tip rule, check B18):
  //   w = {legs:"the front legs", n:2, then:"the red drums", trick:"Tip it away from the blue", rule:"Two legs side by side tip it over."}
  //   STD-v3 (default): rule: w.rule, else a general principle (n >= 2: thick legs take more than one TNT). Never a spot, never dots.
  //   ?hints=1 (STD-v2 styles):
  //   count: "<n> TNT on each of <legs>. Then <then>."   place: "Dots on <legs>. Then <then>."
  //   trick: "<trick>. Then <then>."                      line:  "<trick>."
  //   Over 9 words the "Then" part is dropped; still over, the text is cut at 9 and a console warning names it. failText.words(s) counts.
  M14.api.failText = function(tierOrLevel, w){ w = w || {}; var st = typeof tierOrLevel === "string" ? (M14.api.AIDS[tierOrLevel] || M14.api.AIDS.N).fail : M14.api.aids(tierOrLevel).fail, nw = M14.api.failText.words;
    var cut = function(s){ if(nw(s) <= 9) return s; console.warn("M14.api.failText: over 9 words, cut: " + s); return s.split(/\s+/).slice(0, 9).join(" ").replace(/[.,;:]?$/, "."); };
    if(st === "rule") return cut(w.rule || ((w.n || 1) >= 2 ? "Thick legs need more TNT. Two side by side." : "Two legs side by side tip it over."));
    var trick = w.trick || ("Break " + w.legs), head = st === "count" ? (w.n || 1) + " TNT on each of " + w.legs + "." : st === "place" ? "Dots on " + w.legs + "." : trick + ".";
    var full = head + (w.then && st !== "line" ? " Then " + w.then + "." : "");
    if(nw(full) <= 9) return full; return cut(head); };
  M14.api.failText.words = function(s){ return String(s || "").trim().split(/\s+/).filter(Boolean).length; };
  // words that name a spot (or the dots): no on-screen text of STD-v3 may carry one (check-main N-checks)
  M14.api.failText.spot = /\b(dots?|front|backs?|left|right|rear|behind|corner|feet|next to|on each of)\b/i;
  // STD-v3: older level texts (fail line, tip, "not yet" toast, protected-hit line) that name a spot -> a principle (<= 9 words).
  // Exact-text map, so a batch that writes its own STD-v3 words is left alone. ?hints=1: the old words. M14.api.nohint(s) maps one.
  M14.api.NOHINT_TEXT = {
    // L1-L5 (batch A1, v15-a1)
    "Two front posts, side by side. Then the barn.":"Two posts side by side tip it over.",
    "Three legs facing the row. Then the far huts.":"It falls toward the legs you break.",
    "Fill the dots on the legs facing the row.":"A falling tower can knock down the row.",
    "Turn around. Fill the dots on the back legs.":"Turn the view. It can only fall one way.",
    "Fill the dots on the three left legs.":"Tip it away from the blue.",
    "Start the row\nfrom the right.":"Topple the row\nlike dominoes.",
    "Turn around.\nBlast the back.":"Turn the view.\nFind the open way.",
    "Not yet. Two legs side by side, facing the row!":"Not yet. Two legs side by side!",
    "Not yet. Two back legs side by side!":"Not yet. Two legs side by side!",
    "Not yet. Three legs in a row on one side!":"Not yet. Three legs in a row!",
    "It fell on {hit}. Blast the BACK legs.":"It fell on {hit}. Try another way.",
    "It fell on {hit}. Blast the far side.":"It fell on {hit}. Tip it away.",
    // L1-L12 (levels6 src-l1-12: L6-L12, and the old L1-L5 of ?a1=0)
    "Tip the right tower left.":"A tower falls toward its broken legs.",
    "Spin the view. Hit the back.":"It falls toward the side you break.",
    "Blast the back rows.":"It falls toward the side you break.",
    "Back row first, then the arcades.":"Break one whole row and it tips.",
    "Arch forward, tower back.":"Each part falls its own way.",
    "TNT on the concrete feet.":"Steel holds. Break what it stands on.",
    "Steel holds: grey feet first.":"Steel holds. Break what it stands on.",
    "Inner sides: they fall together.":"Two towers can fall as one.",
    "Shed first. Then the piers.":"Clear what is in the way first.",
    "Save one TNT for the core.":"Save TNT for what still stands.",
    // L13-L36 (levels6 levels-v6-l13-36.json)
    "Two TNT on one steel leg.":"Steel needs two TNT stacked.",
    "Two TNT per steel leg.":"Steel needs two TNT stacked.",
    "Hall first. Then the steel legs.":"Clear the cover first. Steel needs two.",
    "Outer side of each. The hall: its whole back.":"Everything must fall away from the blue.",
    "One TNT on every dark pier.":"Every pier that carries it must break.",
    "Keep two TNT for the core.":"Save TNT for what still stands.",
    "TNT right on each pole.":"A pole breaks only from a direct hit.",
    "Both fall outward: the whole outer row.":"Each falls toward the row you break.",
    "Blast the back. Fall into the yard.":"It falls toward the side you break.",
    "Turn the view. Blast the backs.":"It falls toward the side you break.",
    "Blast its back. The row follows.":"One falling tower can push the row.",
    "Blast the whole back row.":"Only one way down is open.",
    "TNT on the four dark piers.":"Glass holds nothing. The frame carries it.",
    "Two TNT on each steel leg.":"Steel needs two TNT stacked.",
    "Hit its frame on the row side.":"It falls toward the side you break.",
    "Left spire left. The others back.":"Each spire has one safe way down.",
    "Tip the clock tower right.":"One push can topple the whole row.",
    "Tower back. Mast back: stack.":"Steel needs two stacked. Fall away from the road.",
    "One TNT on each dark pier.":"Every pier that carries it must break.",
    "One TNT next to the barrels.":"Barrels blast for free.",
    "TNT by the barrels. Then the rest.":"Barrels blast for free.",
    "Tip the clock tower at the barrels.":"Barrels can start the fall.",
    "Outer sides only. Mind the barrels.":"Some barrels hurt the blue. Fall away from it.",
    "Blast the back: land on the yellow lot.":"Drop it in the yellow lot.",
    // the level tips (the pill under the HUD) of L6-36 that name a spot (L6-12 src-l1-12, L13-36 json, v31 tips)
    "Knock out the back.\nMind the school.":"Mind the school.\nIt falls toward the break.",
    "Steel holds.\nHit the grey feet.":"Steel holds.\nBreak what it stands on.",
    "Tip it down the row.\nSteel? Hit its feet.":"Tip it down the row.\nSteel holds.",
    "Look behind it.":"Turn the view\nbefore you blast.",
    "Dark piers:\nTNT on each one.":"Find what\ncarries the weight.",
    "Look behind it.\nDark piers: TNT on each.":"Turn the view.\nFind what carries it.",
    "Road in front.\nBlast every back.":"Keep the road clear.",
    "Glass holds nothing.\nHit the dark frame.":"Glass holds nothing.\nFind the frame.",
    "Dark piers: one each.\nSteel: stack.":"Find what carries it.\nSteel: stack.",
    "Row, then barrels.":"Barrels can\nstart the fall.",
    "Steel behind glass:\nstack on it.":"Glass hides steel.\nStack on it.",
    // the base game's general fail line (street)
    "Hit the BACK first.":"Keep the debris off the road."
  };
  M14.api.nohint = function(s){ if(M14.hints || s == null) return s; var k = String(s), m = M14.api.NOHINT_TEXT; return Object.prototype.hasOwnProperty.call(m, k) ? m[k] : s; };
  // (3) OPENING of a level: yaw (radians, the face the camera opens on), push-in {zoom, y} on the foot after the whole-tower moment, wider pad.
  //     opening(Lv, {yaw, zoom, y, lotK, mon}) sets Lv.yaw / Lv.monIn / Lv.lotK / Lv.mon; the aids decide at run time whether the push-in plays.
  M14.api.opening = function(Lv, o){ o = o || {}; if(o.mon !== 0) Lv.mon = 1; if(o.yaw != null) Lv.yaw = o.yaw; if(o.lotK) Lv.lotK = o.lotK;
    if(o.zoom !== 0) Lv.monIn = { zoom:o.zoom || 0.4, y:o.y == null ? 12 : o.y }; else delete Lv.monIn; return Lv; };
  // attempts at the current level in a row (1 = first), for cleanup:"second"
  M14.tries = 1;
  V5_PARTS.mon14 = function(P){
    var H = P.h || 6, NST = P.n || 9, PW = 1.18, MW = 0.9, PX = 4.2, DK = 0.5, E = PX + PW/2, n0 = blocks.length, s, k, a;
    var MT = M14.api.mat(P.mat), KP = MT.pier, KD = MT.deck, KC = MT.col, TP = MT.tint ? MT.tint[0] : null, TD = MT.tint ? MT.tint[1] : null;   // H0: P.mat = "rc" (default) | "wood" | "brick" | "concrete" | "steel"
    var mem = function(key, x, y, z, sx, sy, sz, fl, gi, gj){ var b = addBlock(x, y, z, sx, sy, sz, key, {floor:fl}); if(gi != null){ b.gi = gi; b.gj = gj; } return b; };
    var kd = l6KdAdd, lcg = 12345, rr = function(){ lcg = (lcg*1103515245 + 12345) & 0x7fffffff; return lcg/0x7fffffff; };
    var near = function(list, x, z){ var best = list[0], bd = 1e9; list.forEach(function(m){ var d = Math.max(0, Math.abs(x - m.spawn.x) - m.half[0]) + Math.max(0, Math.abs(z - m.spawn.z) - m.half[2]) + 0.001*Math.hypot(x - m.spawn.x, z - m.spawn.z); if(d < bd){ bd = d; best = m; } }); return best; };
    // 16 sectors of a round piece at height y0..y0+h, diameter D; each sector rides the member of `hosts` under its middle
    var ring = function(hosts, g, c, y0, h, D, rq){ for(var i=0;i<NS;i++){ var am = (i + 0.5)*DA, r = D/2*(rq || 0.6); kd(near(hosts, Math.sin(am)*r, Math.cos(am)*r), g, c, 0, y0 + h/2, 0, D, h, D, 0, i*DA, 0); } };
    // n small boxes round a circle of radius r (posts, mullions, lamps)
    var round = function(hosts, g, c, n, r, y0, h, w, d, a0){ for(var i=0;i<n;i++){ var an = (a0 || 0) + i*Math.PI*2/n, x = Math.sin(an)*r, z = Math.cos(an)*r; kd(near(hosts, x, z), g, c, x, y0 + h/2, z, w, h, d, 0, an, 0); } };
    var rcDecor = M14.api.rcDecor;
    var ringTag = M14.api.ring();   // the 8 piers of a storey, in order round the shaft
    var base = addBlock(0, -0.25, 0, 24, 0.5, 24, "base", {anchor:true});
    // --- plinth and steps (decor on the ground slab)
    kd(base, "box", C.concD, 0, 0.2, 0, 23, 0.4, 23); kd(base, "box", C.conc, 0, 0.5, 0, 12.4, 0.2, 12.4);
    [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function(q){ kd(base, "box", C.conc, q[0]*8.2, 0.48, q[1]*8.2, q[0] ? 4.2 : 5, 0.16, q[0] ? 5 : 4.2); kd(base, "box", C.green, q[0]*10.2 + q[1]*7.5, 0.75, q[1]*10.2 + q[0]*7.5, 1.6, 0.7, 1.6); kd(base, "box", C.green, q[0]*10.2 - q[1]*7.5, 0.75, q[1]*10.2 - q[0]*7.5, 1.6, 0.7, 1.6); });
    // --- round 4: a fuel yard at the foot of the front (z+) face (decor): a yellow pad with dark hazard stripes under the barrels that stand
    // at the two barrel piers, so they read as "at the TOWER", from far away too
    if(P.yard !== 0){ kd(base, "box", 0xF2C230, 0.4, 0.6, 7.0, 7.6, 0.1, 4.2); for(k=0;k<7;k++) kd(base, "box", 0x2B2140, -2.6 + k*1.0, 0.62, 7.0, 0.32, 0.1, 4.2, 0, 0.5, 0);
      kd(base, "box", 0xF2C230, 7.2, 0.6, 3.2, 4.2, 0.1, 2.4); kd(base, "box", 0x2B2140, 7.2, 0.62, 3.2, 4.2, 0.1, 0.32, 0, 0.5, 0); }
    // --- a square office / lift-lobby floor seen through the glass: plate, core faces, columns, furniture, lamps (all decor on `host`)
    var floorIn = function(host, y, lobby, fi){ M14.api.floorIn(host, y, { hw:E - 0.25, lobby:lobby, fi:fi, rr:rr }); };
    // --- the shaft: 9 structural storeys of 6 m (two floors each); 4 piers, a floor cassette, 8 panes per storey
    var decks = [], y0, top;
    for(s=0;s<NST;s++){ y0 = s*H;
      [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(function(q){ var p = mem(KP, q[0]*PX, y0 + (H - DK)/2, q[1]*PX, PW, H - DK, PW, s, q[0] > 0 ? 1 : 0, q[1] > 0 ? 1 : 0); p.tint = TP || C.conc;
        kd(p, "ibox", C.rib, q[0]*(PX + 0.1), y0 + (H - DK)/2, q[1]*(PX + 0.1), PW + 0.14, H - DK - 0.3, PW + 0.14);
        if(MT.rc){ rcDecor(p, q[0], 0, q[0]*(PX + 0.79), q[1]*(PX + 0.1), PW + 0.14); rcDecor(p, 0, q[1], q[0]*(PX + 0.1), q[1]*(PX + 0.79), PW + 0.14); } ringTag(p, s, q[0], q[1]); });   // pier cladding (5 cm proud: the pier itself still takes the tap)
      // a slimmer pier in the middle of every face (gi 2 = mid): the shaft stands on 8 legs, so one lost pier never drops it
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function(q){ var p = mem(KP, q[0]*(E - MW/2), y0 + (H - DK)/2, q[1]*(E - MW/2), MW, H - DK, MW, s, q[0] ? (q[0] > 0 ? 1 : 0) : 2, q[1] ? (q[1] > 0 ? 1 : 0) : 2); p.tint = TP || C.rib;
        if(MT.rc) rcDecor(p, q[0], q[1], q[0]*(E + 0.012), q[1]*(E + 0.012), MW); ringTag(p, s, q[0], q[1]); });
      var dk = mem(KD, 0, y0 + H - DK/2, 0, 2*E, DK, 2*E, s); dk.tint = TD || C.concD; decks.push(dk);
      kd(dk, "box", C.concD, 0, y0 + H - DK/2 - 0.1, 0, 2*E + 0.36, DK + 0.5, 2*E + 0.36);   // spandrel band round the slab
      // core: lift shaft (dark) through both floors, the lift car lit on one of them
      kd(dk, "ibox", C.core, 0, y0 + (H - DK)/2 + 0.02, 0, 3.4, H - DK - 0.04, 3.4);
      floorIn(dk, y0 + 0.04, s === 0, 2*s); if(s > 0) floorIn(dk, y0 + H/2, false, 2*s + 1);
      if(s === 0){ kd(dk, "ibox", C.floor, 0, y0 + H/2 - 0.13, -2.9, 2*E - 0.6, 0.26, 3.4); kd(dk, "lit", C.warm, 0, y0 + H/2 + 0.6, -1.25, 6, 0.08, 0.06); }   // lobby: a mezzanine at the back
      else kd(dk, "ibox", C.white, 3.3, y0 + H/4 + 0.1, -0.6 + (s % 2 ? 0.8 : -0.8), 0.9, 0.22, 4.4, (s % 2 ? 1 : -1)*0.6, 0, 0);   // a stair flight between the two floors
      // glass: two panes per face, outside the slab edge, hung on the slab (glass carries nothing); a transom at the mid floor, frames
      var len = 2*PX - PW - 0.08, seg = len/2, ph = H - 0.1, py = y0 + 0.05 + ph/2, e = E + 0.06;
      for(k=0;k<2;k++){ var u = -len/2 + seg*(k + 0.5);
        [[u, e, 1, 0], [u, -e, 1, 0], [e, u, 0, 1], [-e, u, 0, 1]].forEach(function(q){ var xn = !q[2], g = mem("mglass", q[0], py, q[1], xn ? 0.1 : seg - 0.02, ph, xn ? seg - 0.02 : 0.1, s);
          var ox = xn ? Math.sign(q[0])*0.07 : 0, oz = xn ? 0 : Math.sign(q[1])*0.07;
          kd(g, "ibox", C.frame, q[0] + ox, y0 + H/2 - 0.1, q[1] + oz, xn ? 0.06 : seg, 0.22, xn ? seg : 0.06);
          kd(g, "ibox", C.frame, q[0] + ox + (xn ? 0 : (k ? -1 : 1)*seg/2), py, q[1] + oz + (xn ? (k ? -1 : 1)*seg/2 : 0), xn ? 0.06 : 0.12, ph, xn ? 0.12 : 0.06);
          var gs = Math.sign(xn ? q[0] : q[1]), gx = q[0] + (xn ? gs*0.075 : 0), gz = q[1] + (xn ? 0 : gs*0.075), gl = k ? 0.1 : -0.2, gy = py + ((s + k) % 2 ? 0.7 : -0.6);
          [[gl - 0.3, 0.6], [gl + 0.35, 0.18]].forEach(function(w){ kd(g, "glare", 0xffffff, gx + (xn ? 0 : w[0]), gy, gz + (xn ? w[0] : 0), xn ? 0.02 : w[1], ph*0.55, xn ? w[1] : 0.02, xn ? gs*0.45 : 0, 0, xn ? 0 : -gs*0.45); });
          if(s === 0 && !xn && q[1] > 0) kd(g, "lit", C.amber, q[0], 3.05, q[1] + 0.1, seg - 0.3, 0.3, 0.06); }); }   // the entrance canopy light
    }
    // --- buttress fins at the foot of every pier (real members, plain concrete panels: one TNT breaks one)
    [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(function(q){
      [[4.4, 3.0, 0], [2.4, 2.4, 3.0]].forEach(function(st, si){
        var fx = mem("cpan", q[0]*(E + st[0]/2), st[2] + st[1]/2, q[1]*PX, st[0], st[1], 1.0, 0), fz = mem("cpan", q[0]*PX, st[2] + st[1]/2, q[1]*(E + st[0]/2), 1.0, st[1], st[0], 0);
        fx.tint = fz.tint = si ? C.conc : C.rib;
        kd(fx, "box", C.concD, q[0]*(E + st[0]/2), st[2] + st[1] + 0.08, q[1]*PX, st[0] + 0.2, 0.16, 1.2); kd(fz, "box", C.concD, q[0]*PX, st[2] + st[1] + 0.08, q[1]*(E + st[0]/2), 1.2, 0.16, st[0] + 0.2); }); });
    top = NST*H;
    // --- the LOWER SAUCER: floor cassettes (3 x 3 of 6 m + 12 edge plates), 20 columns, roof cassettes = the terrace
    var plates = function(y, fl, cell, edge, key){ var out = [], i, j, c = cell;
      for(i=-1;i<=1;i++) for(j=-1;j<=1;j++) out.push(mem(key || KD, i*c, y + DK/2, j*c, c, DK, c, fl));
      if(edge) for(i=-1;i<=1;i++){ var o = 1.5*c + edge/2; out.push(mem(KD, o, y + DK/2, i*c, edge, DK, c, fl), mem(KD, -o, y + DK/2, i*c, edge, DK, c, fl), mem(KD, i*c, y + DK/2, o, c, DK, edge, fl), mem(KD, i*c, y + DK/2, -o, c, DK, edge, fl)); }
      out.forEach(function(m){ m.tint = TD || C.concD; }); return out; };
    var F1 = NST, yA = top, HS = 6, R1 = 16;
    var fl1 = plates(yA, F1, 6, 4), cols1 = [];
    [[3, 3], [3, -3], [-3, 3], [-3, -3], [6, 6], [6, -6], [-6, 6], [-6, -6], [11.5, 0], [-11.5, 0], [0, 11.5], [0, -11.5], [11.5, 6], [11.5, -6], [-11.5, 6], [-11.5, -6], [6, 11.5], [-6, 11.5], [6, -11.5], [-6, -11.5]]
      .forEach(function(q){ var c = mem(KC, q[0], yA + DK + (HS - 2*DK)/2, q[1], 0.7, HS - 2*DK, 0.7, F1 + 1); c.tint = C.white; cols1.push(c); });
    var rf1 = plates(yA + HS - DK, F1 + 1, 6, 4), yT = yA + HS;
    // flared capital under the saucer, the bowl, floor disc, lounge ring, glass band, roof slab
    ring(fl1, "fsec", C.conc, top - 6.2, 5.2, 24.5, 0.5); ring(fl1, "fsec", C.rib, top - 1.0, 1.5, 2*R1 + 0.6, 0.7);
    ring(fl1, "sec", C.floor, yA + 0.1, DK, 2*R1 - 0.6);
    ring(fl1, "lsec", C.amber, yA + 0.5, 0.16, 2*R1 + 0.5);                                                    // a lit line round the rim
    ring(cols1, "sec", C.floor, yA + 3.0, 0.24, 2*R1 - 2.2, 0.7);                                             // the lounge level
    ring(rf1, "gsec", 0x2E9DBD, yA + DK + 0.1, HS - DK - 0.4, 2*R1 - 0.2); ring(rf1, "gsec", 0x2A8FB0, yA + DK + 0.1, HS - DK - 0.4, 2*R1 - 0.5);   // two skins: the band reads teal from far
    round(rf1, "ibox", C.frame, 32, R1 - 0.08, yA + DK, HS - DK - 0.4, 0.16, 0.2); ring(rf1, "lsec", C.frame, yA + 3.0, 0.3, 2*R1 - 0.12);
    ring(rf1, "sec", C.conc, yT - 0.45, 0.75, 2*R1 + 1.0); ring(rf1, "sec", C.orange, yT + 0.3, 0.1, 2*R1 - 0.2);
    // inside: the round core with lit lift doors, a lit bar, tables with lamps on both levels, pendant lamps
    [0, 3.12].forEach(function(dy, lv){ var y = yA + DK + 0.1 + dy;
      kd(lv ? cols1[0] : fl1[4], "icyl", C.core, 0, y + 1.4, 0, 7, 2.8, 7);
      round(lv ? cols1 : fl1, "lit", C.warm, 8, 3.52, y + 0.1, 2.1, 1.3, 0.06, lv*0.39);
      if(!lv) round(fl1, "lit", C.amber, 16, 5.4, y + 0.9, 0.16, 2.0, 0.5);                                    // the bar counter's lit edge
      if(!lv) round(fl1, "ibox", C.wood, 16, 5.4, y, 0.9, 2.05, 0.6);
      for(k=0;k<(lv ? 12 : 20);k++){ a = k*Math.PI*2/(lv ? 12 : 20) + lv*0.2; var r = lv ? 12.6 : (k % 2 ? 13.3 : 9.6), x = Math.sin(a)*r, z = Math.cos(a)*r, h = near(lv ? cols1 : fl1, x, z);
        kd(h, "icyl", C.white, x, y + 0.72, z, 1.3, 0.1, 1.3); kd(h, "icyl", C.dark, x, y + 0.34, z, 0.16, 0.68, 0.16); kd(h, "lit", C.warm2, x, y + 0.9, z, 0.2, 0.26, 0.2);
        kd(h, "ibox", k % 3 ? C.sofa : C.sofa2, x + Math.cos(a)*0.95, y + 0.3, z - Math.sin(a)*0.95, 0.55, 0.6, 0.55, 0, a, 0); kd(h, "ibox", k % 3 ? C.sofa : C.sofa2, x - Math.cos(a)*0.95, y + 0.3, z + Math.sin(a)*0.95, 0.55, 0.6, 0.55, 0, a, 0); }
      round(lv ? rf1 : cols1, "lit", C.warm2, 24, lv ? 11 : 11.6, y + 2.5, 0.12, 2.2, 0.3, lv*0.13); });
    // the terrace on the roof: rail posts + glass balustrade, planters, parasol tables
    round(rf1, "ibox", C.dark, 32, R1 - 0.3, yT + 0.35, 1.15, 0.14, 0.14); ring(rf1, "gsec", 0xBFF0F8, yT + 0.4, 0.95, 2*R1 - 0.6); ring(rf1, "lsec", C.dark, yT + 1.4, 0.1, 2*R1 - 0.56);
    for(k=0;k<8;k++){ a = k*Math.PI/4 + 0.39; var px = Math.sin(a)*13.4, pz = Math.cos(a)*13.4, hp = near(rf1, px, pz);
      kd(hp, "ibox", C.white, px, yT + 0.65, pz, 1.9, 0.6, 1.0, 0, a, 0); kd(hp, "ibush", C.green, px, yT + 1.35, pz, 1.7, 1.2, 0.95, 0, a, 0);
      a += Math.PI/8; px = Math.sin(a)*10.6; pz = Math.cos(a)*10.6; hp = near(rf1, px, pz);
      kd(hp, "icyl", C.white, px, yT + 1.05, pz, 1.2, 0.1, 1.2); kd(hp, "icyl", C.dark, px, yT + 1.3, pz, 0.1, 1.9, 0.1); kd(hp, "rcone", k % 2 ? C.orange : C.white, px, yT + 2.45, pz, 2.6, 0.6, 2.6); }
    // --- the STEM: one tall storey (two floors), 4 piers, 4 panes, a slab
    var F2 = F1 + 2, HT = 8, SX = 2.9, SW = 0.9, SE = SX + SW/2;
    [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(function(q){ var p = mem(KP, q[0]*SX, yT + (HT - DK)/2, q[1]*SX, SW, HT - DK, SW, F2, q[0] > 0 ? 1 : 0, q[1] > 0 ? 1 : 0); p.tint = TP || C.conc; });
    var sd = mem(KD, 0, yT + HT - DK/2, 0, 2*SE, DK, 2*SE, F2); sd.tint = TD || C.concD;
    var sl = 2*SX - SW - 0.08, sph = HT - 0.1, se = SE + 0.06;
    [[0, se, 1], [0, -se, 1], [se, 0, 0], [-se, 0, 0]].forEach(function(q){ var xn = !q[2], g = mem("mglass", q[0], yT + 0.05 + sph/2, q[1], xn ? 0.1 : sl, sph, xn ? sl : 0.1, F2);
      [0.25, 0.5, 0.75].forEach(function(t){ kd(g, "ibox", C.frame, q[0] + (xn ? Math.sign(q[0])*0.07 : 0), yT + HT*t, q[1] + (xn ? 0 : Math.sign(q[1])*0.07), xn ? 0.06 : sl, 0.14, xn ? sl : 0.06); }); });
    kd(sd, "icyl", C.core, 0, yT + (HT - DK)/2, 0, 2.6, HT - DK, 2.6); kd(sd, "ibox", C.floor, 0, yT + HT/2 - 0.12, 0, 2*SE - 0.3, 0.24, 2*SE - 0.3);
    [0.15, HT/2 + 0.1].forEach(function(dy, i){ round([sd], "lit", i ? C.warm2 : C.warm, 4, 1.33, yT + dy, 2.0, 1.1, 0.06, 0); round([sd], "lit", C.warm2, 4, 2.6, yT + dy + 2.9, 0.08, 3.6, 0.25, 0);
      kd(sd, "ibox", C.white, 2.2, yT + dy + 1.6, -2.2 + i*4.4, 0.8, 0.2, 3.4, (i ? 1 : -1)*0.75, 0, 0); });
    // --- the UPPER DECK: open observation deck (3 x 3 cassettes), 8 posts, the roof cassettes, a low cone roof, the mast
    var F3 = F2 + 1, yU = yT + HT, HU = 4.6, R2 = 11.2, fl2 = plates(yU, F3, 5.4, 0), posts = [];
    [[7.6, 0], [-7.6, 0], [0, 7.6], [0, -7.6], [5.6, 5.6], [5.6, -5.6], [-5.6, 5.6], [-5.6, -5.6]].forEach(function(q){ var c = mem(KC, q[0], yU + DK + (HU - 2*DK)/2, q[1], 0.55, HU - 2*DK, 0.55, F3 + 1); c.tint = C.white; posts.push(c); });
    var rf2 = plates(yU + HU - DK, F3 + 1, 5.4, 0), yR = yU + HU;
    ring(fl2, "fsec", C.conc, yU - 3.0, 3.2, 2*R2 - 0.4, 0.5); ring(fl2, "sec", C.orange, yU + 0.12, DK, 2*R2); ring(fl2, "lsec", C.amber, yU + 0.5, 0.14, 2*R2 + 0.3);
    round(fl2, "ibox", C.dark, 24, R2 - 0.25, yU + DK + 0.1, 1.15, 0.12, 0.12); ring(fl2, "gsec", 0xBFF0F8, yU + DK + 0.15, 0.95, 2*R2 - 0.5); ring(fl2, "lsec", C.dark, yU + DK + 1.2, 0.1, 2*R2 - 0.46);
    kd(fl2[4], "icyl", C.core, 0, yU + DK + (HU - 2*DK)/2, 0, 3.2, HU - 2*DK, 3.2); round(fl2, "lit", C.warm, 4, 1.63, yU + DK + 0.1, 2.0, 1.1, 0.06, 0.78);
    for(k=0;k<8;k++){ a = k*Math.PI/4 + 0.39; var tx = Math.sin(a)*9.2, tz = Math.cos(a)*9.2, th = near(fl2, tx, tz);
      if(k % 2){ kd(th, "icyl", C.white, tx, yU + DK + 0.4, tz, 1.0, 0.6, 1.0); kd(th, "ibush", C.green, tx, yU + DK + 1.6, tz, 1.8, 2.0, 1.8); }
      else { kd(th, "ibox", C.dark, tx, yU + DK + 0.75, tz, 0.3, 1.3, 0.3, 0, a, 0); kd(th, "ibox", C.white, tx, yU + DK + 1.5, tz, 0.5, 0.3, 0.7, 0, a, 0); } }   // a viewing scope
    round(rf2, "lit", C.warm2, 16, 6.5, yR - DK - 0.12, 0.1, 1.6, 0.3, 0);
    ring(rf2, "sec", C.dark, yR - 0.5, 0.6, 2*R2 + 1.4); ring(rf2, "csec", C.slate, yR + 0.1, 2.5, 2*R2 + 0.8); ring(rf2, "lsec", C.amber, yR - 0.56, 0.12, 2*R2 + 1.5);
    var mast = mem("mpost", 0, yR + 0.02 + 4.6, 0, 0.6, 9.2, 0.6, F3 + 2);
    kd(mast, "cyl", C.slate, 0, yR + 1.6, 0, 3.0, 3.2, 3.0); kd(mast, "cyl", C.dark, 0, yR + 3.6, 0, 1.6, 0.8, 1.6); kd(mast, "cyl", C.white, 0, yR + 6.2, 0, 2.0, 0.16, 2.0); kd(mast, "cyl", C.white, 0, yR + 7.6, 0, 1.4, 0.14, 1.4);
    kd(mast, "box", C.dark, 0, yR + 11.2, 0, 0.2, 4.2, 0.2); kd(mast, "lit", C.red, 0, yR + 13.45, 0, 0.45, 0.45, 0.45);
    M14.info = { top:yR + 13.7, roof:yR, saucer:[yA, yT], upper:[yU, yR], shaftTop:top, r:R1 + 0.6, members:blocks.length - n0, floors:2*NST - 1 + 2 + 2 + 1 };
    return { w:24, d:24 };
  };
  // ------------------------------------------------------------------ RC damage: stages shown on the pier, damage kept between blasts
  var rcStage = function(b, y){ var f = 1 - b.hp/b.hp0, st = f >= M14_RC.s2 ? 2 : f >= M14_RC.s1 ? 1 : 0; if(st <= b.m14s) return;
    if(b.m14y == null) b.m14y = Math.max(-b.half[1] + 1.2, Math.min(b.half[1] - 1.2, (y == null ? b.P.y - 0.3*b.half[1] : y) - b.P.y));
    b.kd.forEach(function(e){ if(!e.m14 || e.m14.st > st) return; e.o.y = b.m14y + e.m14.v; e.s.copy(e.m14.s); });
    b.m14s = st; if(b.im) l6KdWrite(b, b.P, b.Q);
    if(!manual){ _p.set(b.P.x, b.P.y + b.m14y, b.P.z); dust(_p, st === 2 ? 5 : 2, st === 2 ? 1.6 : 1.0, 0xBDB8AE); } };
  var dm0 = damage, blast0 = blast, blastO = null;
  damage = function(b, amount, pierce, cause){ var r = dm0.apply(this, arguments); if(b.m14s != null && !b.dead && b.hp0) rcStage(b, cause === "blast" && blastO ? blastO.y : null); return r; };
  blast = function(origin){ blastO = origin; try{ return blast0.apply(this, arguments); } finally { blastO = null; } };
  // STOREY RULE (round 3, Owner: "break two neighbouring piers and it falls" must ALWAYS work, in one blast or over several): when two
  // piers that stand next to each other round a storey are both gone, the other six of that storey are overloaded and crush one after
  // the other, nearest to the gap first (0.12 s apart, game time: deterministic). One lost pier never does it. Before this rule the
  // frame sometimes held on six piers (92% standing) when the two were lost in different blasts.
  var fm0 = failMember;
  failMember = function(b, cause){ var was = b.dead, r = fm0.apply(this, arguments), g = b.m14ring; if(was || !g || g.done) return r;
    var ring = blocks.filter(function(q){ return q.m14ring && q.m14ring.id === g.id; }), dead = {};
    ring.forEach(function(q){ if(q.dead) dead[q.m14ring.k] = 1; });
    if(!dead[(g.k + 1) % 8] && !dead[(g.k + 7) % 8]) return r;
    var mid = dead[(g.k + 1) % 8] ? g.k + 0.5 : g.k - 0.5;
    ring.forEach(function(q){ q.m14ring.done = 1; if(q.dead) return; var d = Math.abs(((q.m14ring.k - mid) % 8 + 12) % 8 - 4); d = 4 - d;
      later(0.1 + 0.12*d, function(){ if(!q.dead){ if(!manual) dust(q.P, 2, 1.4, 0xBDB8AE); fm0(q, "crush"); } }); });
    return r; };
  // STD-v2 tip rule (M14.api.tip), moved here from A1's v15-a1.js unchanged
  var fmTip = failMember;
  failMember = function(b, cause){ var R = b.m14tip;
    // the hinge holds (optional, R.hold seconds)
    if(R && R.tipped && R.hold && !b.dead && (cause === "crush" || cause === "impact") && gameT < R.tipT + R.hold && R.far[b.m14tk]) return;
    var was = b.dead, r = fmTip.apply(this, arguments); if(was || !R || R.tipped) return r;
    var dead = {}; R.list.forEach(function(q){ if(q.dead) dead[q.m14tk] = 1; });
    if(!dead[(b.m14tk + 1) % 8] && !dead[(b.m14tk + 7) % 8]) return r;
    R.tipped = true; R.tipT = gameT;
    var m = b.m14tk % 2 === 0 ? b.m14tk : (dead[(b.m14tk + 1) % 8] ? (b.m14tk + 1) % 8 : (b.m14tk + 7) % 8);   // the middle pier of the face that goes
    R.face = {}; R.face[m] = R.face[(m + 1) % 8] = R.face[(m + 7) % 8] = 1; R.far = {}; R.far[(m + 3) % 8] = R.far[(m + 4) % 8] = R.far[(m + 5) % 8] = 1;
    if(R.hold) later(0.4, function(){ R.list.forEach(function(q){ if(!q.dead && (q.m14tk === (m + 2) % 8 || q.m14tk === (m + 6) % 8)){ if(!manual) dust(q.P, 2, 1.4, 0xBDB8AE); fmTip(q, "crush"); } }); });
    later(0.15, function(){ var face = R.list.filter(function(q){ return q.m14tk === m || q.m14tk === (m + 1) % 8 || q.m14tk === (m + 7) % 8; });
      face.forEach(function(q){ if(q.dead) return; if(!manual) dust(q.P, 2, 1.4, 0xBDB8AE); fmTip(q, "crush"); });
      if(R.onTip) R.onTip(m, fmTip);
      R.skin.forEach(function(w){ if(w.dead) return; if(face.some(function(q){ return Math.abs(w.spawn.x - q.spawn.x) < w.half[0] + q.half[0] + 0.3 && Math.abs(w.spawn.z - q.spawn.z) < w.half[2] + q.half[2] + 0.3; })) fmTip(w, "crush"); }); });
    later(8, function(){ if(R.decks.some(function(d){ return !d.dead && standing(d); })) return; R.list.concat(R.skin).forEach(function(q){ if(!q.dead) fmTip(q, "crush"); }); });
    return r; };
  var daRc = detonateAll;   // v10 restores every member's hp at BLAST: the massive RC piers keep their damage
  detonateAll = function(){ var keep = []; blocks.forEach(function(b){ if(RC_KEEP[b.key] && !b.dead && b.hp < b.hp0) keep.push([b, b.hp]); });
    var r = daRc.apply(this, arguments); keep.forEach(function(q){ if(!q[0].dead) q[0].hp = q[1]; }); return r; };
  // ------------------------------------------------------------------ the level: hero swapped, the surroundings moved out from under the saucer
  // (D-blast-HERO-PROC: difficulty is set by these surroundings + TNT + start camera only; the hero is never tuned for it)
  var M14_SCENE = function(old){
    var blk = function(id, x, z, f, roof){ return { id:id, kind:"mass", x:x, z:z, tiers:[{ f:f, cx:2, cz:2, mat:"conc", skin:"alt", g:"open" }], bay:3.6, colk:1.4, st:0.35, fh:4, roof:roof }; };
    // the lesson's tank tower: two storeys of open steel legs under a concrete block (the L14 crane type: 0 bonds cracked at rest; the
    // all-steel-column tower of the base L32 cracked 8-12 slab bonds at rest), loose on the side away from the barrels
    var E = { id:"E", kind:"mass", x:0, z:-25, tiers:[{ f:2, cx:2, cz:2, mat:"steel", skin:"open" }, { f:5, cx:2, cz:2, mat:"conc", skin:"alt" }], fh:4, colk:1.2, loose:"z+", roof:{ cap:1, ac:1 } };
    return { parts:[{ id:"A", kind:"mon14", x:0, z:0 }, blk("B", 25, 0, 5, { cap:1, ac:1 }), blk("C", -25, 0, 5, { cap:1 }), E],
      tanks:[[3.2, 5.7], [5.8, 3.2], [0, 5.6], [-2.4, 5.5], [-1.35, -27.15], [1.35, -27.15], [-2.2, -26.35], [2.2, -26.35], [27.7, -1.8], [27.7, 1.8], [27.7, 0], [-27.7, 0], [-27.7, -1.8], [-27.7, 1.8], [-1.35, -22.85], [1.35, -22.85]], tnt:9 }; };   // round 5: C gets B's three barrels, the tank tower two more at its front legs (a TNT on the 'wrong' face still works)
  if(M14.hero && LEVELS[M14.lv] && LEVELS[M14.lv].heroId === "F04"){
    var Lv = LEVELS[M14.lv], SC = M14_SCENE(Lv.parts);
    Lv.f = 14; M14.api.opening(Lv, { yaw:0.3, zoom:0.4, y:12, lotK:2.0 });   // round 4 (readability): the opening view faces the barrel side, then pushes in on the tower's foot
    Lv.parts = SC.parts; Lv.tanks = SC.tanks; Lv.charges = { tnt:SC.tnt };
    var T = function(sel, i){ return ["tnt", sel, 0, i || 0]; }, P1 = "A:g:1:1:z+", P2 = "A:g:2:1:z+", T2 = function(sel){ return [T(sel), T(sel)]; };
    // round 3 (Owner: the RC tower was too hard). The lesson now also opens the tower: four barrels stand at the corner pier and the
    // middle pier of its front (z+) side. They do about 40% / 32% to those two piers for free (round 3: 49% / 44%; lowered in round 4 so that one TNT on each pier + a third
    // on the pane between them can never finish both: no 3-TNT plan drops the tower), so two TNT on each (instead of three) break them, and two
    // neighbouring piers gone = the tower falls (storey rule). Every other side still takes three TNT per pier.
    // expert, one blast, 8 of 9 (Owner: a skilled player ends with 0 or 1 TNT left): two TNT on each barrel pier, one TNT by the barrels of each block, one on each barrel leg of the tank tower
    Lv.sol = T2(P1).concat(T2(P2), [T("B:x+", 0), T("C:x-", 0), T("E:z-", 0), T("E:z-", 1)]); delete Lv.solW;
    // the 9 TNT without the lesson (never next to a barrel): three per pier on the far side, two on one block, one on the other, none left for the steel legs
    Lv.lesson = { check:[[0, 0, 0, 1, 1, 1].map(function(i){ return T("A:x-", i); }).concat([T("B:x-", 0), T("B:x-", 1), T("C:x+", 0)])] };
    // a player who reads the tip: one TNT on each barrel pier and by every barrel, then the two cracked piers again
    Lv.bot = { hints:[["A", P1, 1], ["A", P2, 1], ["A", "B:x+", 1], ["A", "C:x-", 1], ["A", "E:z-", 1], ["A", "E:z-", 1], ["A", P1, 2], ["A", P2, 2]] };
    Lv.tip = "Red drums blast\nfor free."; Lv.ftip = M14.api.failText(Lv, { legs:"the front legs", n:2, then:"the red drums", rule:"Break two legs side by side: it falls." });   // STD-v2: 9 words (round 6 text: "Fill the dots on the two front legs: the tower falls. Then one TNT by the red drums of each small tower.")
  }
  // ------------------------------------------------------------------ camera: vertical drag = pan up / down the hero, closer zoom, level tilt when close
  var heroTop = function(){ var t = 0; blocks.forEach(function(b){ if(b.anchor || b.prop || b.keep || b.dead) return; t = Math.max(t, b.spawn.y + b.half[1]); (b.kd || []).forEach(function(q){ t = Math.max(t, b.spawn.y + q.o.y + q.s.y/2); }); }); return Math.max(4, t); };
  var topC = 0, visH = function(){ return 2*camDist*zoomK*Math.tan(GAME_FOV*Math.PI/360); };
  var planning = function(){ return screen === "game" && (phase === "plan" || phase === "count"); };
  // the pan target stays on the hero: between 15% and 90% of its height at any zoom (the whole tower slides on screen), and as far as a
  // quarter screen from its foot / top when the zoom is close
  var panRange = function(){ var v = 2*dist*zoomT*Math.tan(GAME_FOV*Math.PI/360), lo = Math.max(2, Math.min(focusY, 0.15*topC, 0.25*v)), hi = Math.min(topC, Math.max(focusY, 0.9*topC, topC - 0.25*v)); return [lo - focusY, hi - focusY]; };
  M14.setPan = function(p){ var r = panRange(); M14.panT = Math.max(r[0], Math.min(r[1], p)); };
  // what the camera must stay out of: every neighbour's box + 3 m, and the hero's own radius per 4 m of height (decor included) + 6 m
  var GEO = null, BAND = 4, PAD = 3, PADH = 6;
  var measure = function(){ var ids = String(L.hero || "A").split(","), hb = l11Box(function(b){ return ids.indexOf(b.bid) >= 0; }), g = { hx:hb.n ? (hb.x0 + hb.x1)/2 : focus.x, hz:hb.n ? (hb.z0 + hb.z1)/2 : focus.z, bands:[], parts:{}, top:0 };
    var band = function(y0, y1, r){ for(var k=Math.max(0, Math.floor(y0/BAND)); k<=Math.floor(y1/BAND); k++) g.bands[k] = Math.max(g.bands[k] || 0, r); g.top = Math.max(g.top, y1); };
    blocks.forEach(function(b){ if(b.anchor || b.prop || b.dead) return; var p = b.spawn, h = b.half;
      if(!b.keep && ids.indexOf(b.bid) >= 0){ band(p.y - h[1], p.y + h[1], Math.hypot(Math.abs(p.x - g.hx) + h[0], Math.abs(p.z - g.hz) + h[2]));
        (b.kd || []).forEach(function(q){ band(p.y + q.o.y - q.s.y/2, p.y + q.o.y + q.s.y/2, Math.hypot(p.x + q.o.x - g.hx, p.z + q.o.z - g.hz) + Math.max(q.s.x, q.s.z)/2); }); return; }
      var k = b.keep ? "k" + b.kid : (b.bid || "?"), e = g.parts[k] = g.parts[k] || { x0:1e9, x1:-1e9, z0:1e9, z1:-1e9, y1:0 };
      e.x0 = Math.min(e.x0, p.x - h[0]); e.x1 = Math.max(e.x1, p.x + h[0]); e.z0 = Math.min(e.z0, p.z - h[2]); e.z1 = Math.max(e.z1, p.z + h[2]); e.y1 = Math.max(e.y1, p.y + h[1]);
      (b.kd || []).forEach(function(q){ e.y1 = Math.max(e.y1, p.y + q.o.y + q.s.y/2); }); });
    g.parts = Object.keys(g.parts).map(function(k){ return g.parts[k]; }); return g; };
  var blocked = function(x, y, z){ var g = GEO, i, e;
    for(i=0;i<g.parts.length;i++){ e = g.parts[i]; if(y < e.y1 + PAD && x > e.x0 - PAD && x < e.x1 + PAD && z > e.z0 - PAD && z < e.z1 + PAD) return true; }
    if(y < g.top + PADH){ var r = Math.hypot(x - g.hx, z - g.hz), k = Math.floor(y/BAND); for(i=k-1;i<=k+1;i++) if(g.bands[i] && r < g.bands[i] + PADH) return true; }
    return false; };
  // the nearest camera distance for this yaw / target height / pitch: one metre past the last blocked point on the view ray
  var clearD = function(yw, ty, pt){ if(!GEO) return 8; var cp = Math.cos(pt), sp = Math.sin(pt), sx = cp*Math.sin(yw), sz = cp*Math.cos(yw), last = 7, D;
    for(D=6; D<=110; D+=1) if(blocked(GEO.hx + D*sx, ty + D*sp, GEO.hz + D*sz)) last = D; return last + 1; };
  var zl0 = zoomLimits, zMin0 = 0.5;
  zoomLimits = function(bx){ zl0(bx); zMin0 = zMin; if(!M14.cam) return; topC = heroTop(); GEO = measure(); M14.setPan(M14.panT); };
  var uc0 = updateCamera, panSp = {v:0}, tiltK = 0, tiltSp = {v:0}, TILT = 0.17;
  updateCamera = function(rdt){
    if(!M14.cam || phase === "title"){ uc0(rdt); return; }
    var pl = planning();
    if(!pl){ M14.panT = 0; if(phase === "build"){ M14.pan = 0; panSp.v = 0; } zMin = zMin0; }
    else { M14.setPan(M14.panT);
      zMin = Math.min(zMin0, clearD(yaw, focusY + M14.panT, pitch - TILT)/dist); zoomT = clampZoom(zoomT); zoomK = clampZoom(zoomK); }
    M14.pan = M14.drag ? M14.panT : damp(M14.pan, M14.panT, panSp, 0.25, rdt);
    // close = how far the zoom is in: the view levels out and its target slides from the middle of the lot onto the hero's axis
    var close = pl ? Math.max(0, Math.min(1, (1 - zoomK)/0.45)) : 0;
    tiltK = damp(tiltK, close, tiltSp, 0.3, rdt);
    var f0 = focusY, p0 = pitch, fx = focus.x, fz = focus.z;
    if(pl){ focusY = f0 + M14.pan; camFocusY += focusY - (M14.lastF == null ? focusY : M14.lastF); M14.lastF = focusY; } else M14.lastF = null;
    pitch = p0 - TILT*tiltK;
    if(GEO && tiltK > 0.001){ focus.x = fx + (GEO.hx - fx)*tiltK; focus.z = fz + (GEO.hz - fz)*tiltK; }
    uc0(rdt);
    focusY = f0; pitch = p0; focus.x = fx; focus.z = fz;
    // a giant needs a far camera (2-3x the usual distance): the haze moves out with it, so the lot is never whited out
    if(L.mon && M14.fog0){ var fk = Math.max(1, camera.position.distanceTo(focus)/105); scene.fog.near = M14.fog0[0]*fk; scene.fog.far = M14.fog0[1]*fk; }
  };
  var da0 = detonateAll;
  detonateAll = function(){ if(M14.cam && (M14.panT || zoomT < 0.98)){ M14.panT = 0; zoomT = clampZoom(1); } return da0.apply(this, arguments); };   // BLAST: back to the whole-lot framing
  var rf0 = resetFraming; resetFraming = function(){ M14.panT = 0; return rf0.apply(this, arguments); };
  // drag: decided once past the tap threshold: mostly vertical = pan (the grabbed point follows the finger), else the old turn
  el.addEventListener("pointerdown", function(){ M14.drag = false; });
  el.addEventListener("pointermove", function(e){
    if(!M14.cam || !planning()) return;
    var mpp = visH()/VH;
    if(pinch){ var a = touches[pinch.a], b = touches[pinch.b]; if(!a || !b) return; var my = (a.y + b.y)/2;
      if(pinch.m14y == null){ pinch.m14y = my; pinch.m14p = M14.panT; } M14.drag = true; M14.setPan(pinch.m14p + (my - pinch.m14y)*mpp); return; }
    if(!ptr || ptr.id !== e.pointerId || multi) return;
    var dx = e.clientX - ptr.sx, dy = e.clientY - ptr.sy;
    if(!ptr.m14){ if(ptr.max <= TAP_PX) return; ptr.m14 = Math.abs(dy) > Math.abs(dx)*1.15 ? "v" : "h"; ptr.m14p = M14.panT; }
    if(ptr.m14 === "v"){ baseYaw = ptr.yaw0; ptr.turning = false; M14.drag = true; M14.setPan(ptr.m14p + dy*mpp);
      if(!M14.used){ M14.used = true; } }
  });
  var endDrag = function(){ M14.drag = false; };
  el.addEventListener("pointerup", endDrag); el.addEventListener("pointercancel", endDrag);
  // tap assist on a giant's level: at the whole-lot view a column is 3-6 px wide, so a tap that lands on glass / a wall / nothing within
  // ASSIST px of a column that is THINNER than ASSIST px on screen goes to that column (never through a nearer wall, never to a
  // protected building). Zoomed in (columns wider than that) nothing changes. ?massist=0 = off.
  var ASSIST = QS14.get("massist") === "0" ? 0 : 16, pk0 = pick, _a = new THREE.Vector3(), _b = new THREE.Vector3();
  pick = function(cx, cy){
    // round 5: a tap on a pier's pips is a tap on that pier (the first-time tester tapped them like buttons)
    if(L.mon && M14.pipHit && planning()){ var ph = M14.pipHit(cx, cy); if(ph){ var pdx = camera.position.x - ph.P.x, pdz = camera.position.z - ph.P.z, pn = Math.abs(pdx) > Math.abs(pdz) ? new THREE.Vector3(Math.sign(pdx), 0, 0) : new THREE.Vector3(0, 0, Math.sign(pdz));
      return { block:ph, point:new THREE.Vector3(ph.P.x + pn.x*ph.half[0], ph.P.y - 0.3*ph.half[1], ph.P.z + pn.z*ph.half[2]), normal:pn, assist:true }; } }
    var h = pk0(cx, cy); if(!ASSIST || !M14.cam || !L.mon || !planning()) return h;
    if(h && (isUpright(h.block) || h.block.keep || h.block.prop)) return h;
    if(h && h.block.key === "mglass"){   // a tap on a curtain pane goes to the pier right behind it (as the base does for its "aqua" curtain glass): reach 1.5 m along the ray
      var o = ray.ray.origin, dr = ray.ray.direction, d0 = h.point.distanceTo(o), hit = null, ht = d0 + 1.5;
      blocks.forEach(function(b){ if(!isUpright(b)) return; var t0 = 0, t1 = 1e9, i, c = [b.P.x, b.P.y, b.P.z], oo = [o.x, o.y, o.z], dd = [dr.x, dr.y, dr.z];
        for(i=0;i<3;i++){ if(Math.abs(dd[i]) < 1e-9){ if(Math.abs(oo[i] - c[i]) > b.half[i]) return; continue; } var ta = (c[i] - b.half[i] - oo[i])/dd[i], tb = (c[i] + b.half[i] - oo[i])/dd[i]; t0 = Math.max(t0, Math.min(ta, tb)); t1 = Math.min(t1, Math.max(ta, tb)); if(t0 > t1) return; }
        if(t0 >= d0 - 0.3 && t0 < ht){ ht = t0; hit = b; } });
      if(hit){ var pt = o.clone().addScaledVector(dr, ht), ex = Math.abs(Math.abs(pt.x - hit.P.x) - hit.half[0]), ez = Math.abs(Math.abs(pt.z - hit.P.z) - hit.half[2]);
        return { block:hit, point:pt, normal:ex < ez ? new THREE.Vector3(Math.sign(pt.x - hit.P.x), 0, 0) : new THREE.Vector3(0, 0, Math.sign(pt.z - hit.P.z)), assist:true }; } }
    var hd = h ? h.point.distanceTo(camera.position) : 1e9, best = null, bd = ASSIST;
    blocks.forEach(function(b){ if(!isUpright(b)) return; var a = toScreen(_a.set(b.P.x, b.P.y - b.half[1], b.P.z)), t = toScreen(_b.set(b.P.x, b.P.y + b.half[1], b.P.z)); if(!a.on && !t.on) return;
      var w = toScreen(_a.set(b.P.x + camera.matrixWorld.elements[0]*b.half[0], b.P.y, b.P.z + camera.matrixWorld.elements[2]*b.half[0])), c = toScreen(b.P); if(2*Math.hypot(w.x - c.x, w.y - c.y) > ASSIST) return;
      var vx = t.x - a.x, vy = t.y - a.y, u = Math.max(0.1, Math.min(0.9, ((cx - a.x)*vx + (cy - a.y)*vy)/Math.max(1e-6, vx*vx + vy*vy))), d = Math.hypot(a.x + vx*u - cx, a.y + vy*u - cy);
      if(d >= bd || b.P.distanceTo(camera.position) > hd + 2.5) return; bd = d; best = { b:b, u:u }; });
    if(!best) return h;
    var b = best.b, dx = camera.position.x - b.P.x, dz = camera.position.z - b.P.z, n = Math.abs(dx) > Math.abs(dz) ? new THREE.Vector3(Math.sign(dx), 0, 0) : new THREE.Vector3(0, 0, Math.sign(dz));
    return { block:b, point:new THREE.Vector3(b.P.x + n.x*b.half[0], b.P.y + (2*best.u - 1)*b.half[1], b.P.z + n.z*b.half[2]), normal:n, assist:true }; };
  var zh0 = zHint;
  zHint = function(on){ zh0(on); if(on && M14.cam) $("zhint").textContent = matchMedia("(pointer:coarse)").matches ? "Drag up / down to look · pinch to zoom · double-tap to reset" : "Drag up / down to look · scroll to zoom · double-tap to reset"; };
  var sl0 = startLevel;
  startLevel = function(i){ M14.pan = M14.panT = 0; M14.lastF = null; var r = sl0.apply(this, arguments);
    M14.fog0 = L.mon ? [scene.fog.near, scene.fog.far] : null;
    lot.scale.setScalar(L.lotK || 1);   // a wider sand pad under a giant and its neighbours
    if(M14.cam && L.mon && !manual) setTimeout(function(){ if(screen === "game" && L.mon && planning()) zHint(true); }, 1600);
    return r; };
  // ------------------------------------------------------------------ round 4 READABILITY (first-time player test 12/11: 0 wins in 3, "nothing
  // tells me I am on the right track"). No rule or number changes here.
  // 1) PIPS over a pier, constant size on screen (readable from the whole-lot view): one slot per TNT the pier still needs. Red = damage
  //    done, yellow = TNT placed on it (not fired yet), hollow = still missing. Barrels standing at a pier count as done in advance, so
  //    the two barrel piers show TWO slots from the start and pulse until the player has put TNT on them: that is the cue.
  //    Any other pier shows its slots once it is damaged or has a TNT on it. The last missing slot pulses.
  var pipBox = document.createElement("div"), pipEls = [];
  pipBox.id = "m14Pips"; pipBox.style.cssText = "position:fixed;left:0;top:0;width:0;height:0;pointer-events:none;z-index:6";
  var pst = document.createElement("style");
  pst.textContent = "#m14Pips .p{position:absolute;display:flex;gap:2px;padding:2px 3px;border-radius:8px;background:rgba(29,42,74,.82);transform:translate(-50%,-50%);box-shadow:0 1px 0 rgba(0,0,0,.35)}" +
    "#m14Pips .p i{display:block;width:12px;height:12px;border-radius:50%;border:2px solid #fff6e0;box-sizing:border-box}" +
    "#m14Pips .p i.d{background:#FF4D2E;border-color:#FF4D2E}#m14Pips .p i.t{background:#FFC21A;border-color:#FFC21A}" +
    "#m14Pips .p.cue{animation:m14cue .9s ease-in-out infinite}#m14Pips .p i.n{animation:m14n .7s ease-in-out infinite}" +
    "@keyframes m14cue{0%,100%{transform:translate(-50%,-50%) scale(1)}50%{transform:translate(-50%,-50%) scale(1.45)}}@keyframes m14n{0%,100%{opacity:1}50%{opacity:.25}}" +
    "@media (prefers-reduced-motion:reduce){#m14Pips .p.cue,#m14Pips .p i.n{animation:none}}";
  document.head.appendChild(pst); document.body.appendChild(pipBox);
  var boxDist = function(b, x, y, z){ var dx = Math.max(0, Math.abs(x - b.P.x) - b.half[0]), dy = Math.max(0, Math.abs(y - b.P.y) - b.half[1]), dz = Math.max(0, Math.abs(z - b.P.z) - b.half[2]); return Math.sqrt(dx*dx + dy*dy + dz*dz); };
  var pipState = function(force){ var out = [], heroUp = false, tanks = blocks.filter(function(t){ return t.key === "tank" && !t.dead && t.rb; });
    var AID = M14.api.aids(L), heroIds = String(L.hero || "A").split(","), anyRing = false;
    blocks.forEach(function(b){ if(!(b.m14ring || b.m14dot) || b.dead || !b.rb) return; anyRing = anyRing || !!b.m14ring;
      var PER = M14.api.perTnt(b), free = 0; tanks.forEach(function(t){ var d = boxDist(b, t.P.x, t.P.y, t.P.z); if(d < 3) free += 200*Math.pow(1 - d/3, 1.1)*(1 - b.def.armor); });   // what the barrels at its foot will do (cookOff: 200, r 3)
      var plan = 0; charges.forEach(function(c){ if(c.host === b && !c.fired) plan++; });
      var done = b.hp0 - b.hp + free, total = Math.max(1, Math.ceil((b.hp0 - free)/PER - 0.02)), left = Math.max(0, Math.ceil((b.hp0 - done)/PER - 0.02));
      var cue = AID.cue && (free > 0.2*b.hp0 || (b.m14dot && b.m14dot.cue)) && !plan && b.hp >= b.hp0;
      // round 6: the number of slots a pier shows never changes (the tester saw 2 become 3 once the barrels were gone): it is fixed the
      // first time the pier is looked at (2 at the barrel piers, 3 elsewhere); red = slots no longer needed
      if(b.m14tot == null) b.m14tot = total; total = Math.max(b.m14tot, left); heroUp = heroUp || (!!b.m14ring && b.floor === 0 && standing(b));
      if(AID.dots === "none" && !force) return;   // STD-v3: no dots at all (force: the hidden state the tap rule below reads)
      if(AID.dots === "rc" && !RC_KEEP[b.key] && !force) return;   // SH / boss: damage dots on RC members only
      if(!(cue || plan || b.hp < b.hp0*0.8)) return;   // a graze under 20% shows no pips (noise)
      out.push({ b:b, total:total, left:left, plan:Math.min(plan, left), cue:cue }); });
    // round 6, WHAT IS LEFT: once the tower is down, one pulsing slot on every member of the level's own plan that still stands on a
    // neighbour (the leg by the red drums of each small tower); it goes when that member is gone. Lost runs ended at 81-85% with
    // "nothing points at the brick towers".
    // a hero without tagged storeys (not built by ring()): it is 'up' while a ground-storey column of its parts stands
    if(!anyRing) heroUp = blocks.some(function(b){ return heroIds.indexOf(b.bid) >= 0 && b.floor === 0 && !b.dead && isUpright(b) && standing(b); });
    var clean = AID.cleanup === "yes" || (AID.cleanup === "second" && M14.tries >= 2);
    M14.left = clean && !heroUp && wave > 1;
    if(!heroUp && clean) (L.sol || []).forEach(function(e){ var m = selectMembers(e[1], e[2])[e[3]], b = m && m.b; if(!b || b.m14ring || (anyRing ? false : heroIds.indexOf(b.bid) >= 0) || b.dead || !b.rb || b.floor !== 0 || !standing(b) || out.some(function(q){ return q.b === b; })) return;
      var plan = 0; charges.forEach(function(c){ if(c.host === b && !c.fired) plan++; });
      out.push({ b:b, total:1, left:1, plan:Math.min(plan, 1), cue:!plan, mark:true }); });
    return out; };
  var pipNow = [], pipAll = [];   // pipAll: every pier's slots, shown or not (STD-v3 keeps the tap rule of round 6 without the dots)
  M14.pipHit = function(x, y){ var best = null, bd = 1e9; pipNow.forEach(function(q){ if(!q.on) return; var w = 9 + 8*q.total, dx = Math.max(0, Math.abs(x - q.sx) - w), dy = Math.max(0, Math.abs(y - q.sy) - 13), d = dx + dy; if(d < 1 && Math.abs(x - q.sx) < bd){ bd = Math.abs(x - q.sx); best = q.b; } }); return best; };
  // one line, the first two times a monument level is opened (saved), until the first TNT goes on a pier: what the dots mean
  var tipEl = document.createElement("div"), tipN = 0, tipOn = false; tipEl.id = "m14Tip";
  tipEl.style.cssText = "position:fixed;left:50%;top:calc(env(safe-area-inset-top) + 118px);transform:translateX(-50%);z-index:7;pointer-events:none;display:none;white-space:nowrap;padding:7px 12px;border-radius:14px;background:#FFF8EA;border:3px solid #1d2a4a;box-shadow:0 3px 0 #1d2a4a;color:#1d2a4a;font:800 15px Nunito,system-ui,sans-serif";
  tipEl.innerHTML = "<span style=\"display:inline-flex;gap:2px;vertical-align:-2px;margin-right:7px\"><i style=\"width:11px;height:11px;border-radius:50%;background:#FFC21A;display:block\"></i><i style=\"width:11px;height:11px;border-radius:50%;border:2px solid #1d2a4a;box-sizing:border-box;display:block\"></i></span>Fill the dots to crack the leg";
  document.body.appendChild(tipEl); try{ tipN = +(localStorage.getItem("m14tip") || 0); }catch(e){}
  var TIP_DOTS = tipEl.innerHTML.slice(0, tipEl.innerHTML.indexOf("</span>") + 7), tipTxt = "";
  // round 6: the tip stays until the first BLAST (it used to go at the first tap); once the tower is down a second line points at what is left
  var pipTip = function(list){ var first = tipN < 2 && wave === 1 && M14.api.aids(L).tip && list.some(function(q){ return !q.mark; }), rest = M14.left && list.some(function(q){ return q.mark; });
    var txt = first ? (L.dotTip || "Fill the dots to crack the leg") : rest ? (L.dotTip2 || "Now the dots on what is left") : "";   // STD-v2: the level's own words
    var tp = (L.keeps && L.keeps.length) ? "calc(env(safe-area-inset-top) + 154px)" : "calc(env(safe-area-inset-top) + 118px)"; if(tipEl._top !== tp){ tipEl._top = tp; tipEl.style.top = tp; }   // a level with protected buildings shows its "Safe" pill where the tip sits: one row down
    if(txt !== tipTxt){ tipTxt = txt; tipEl.style.display = txt ? "block" : "none"; if(txt) tipEl.innerHTML = TIP_DOTS + txt; } };
  var daTip = detonateAll; detonateAll = function(){ if(L.mon && !manual && wave === 1 && tipN < 2){ tipN++; try{ localStorage.setItem("m14tip", tipN); }catch(e){} } return daTip.apply(this, arguments); };
  // round 6: a tap that lands on a TNT already placed on a leg that still has hollow dots places the next TNT instead of selecting that one
  var ca0 = chargeAt;
  chargeAt = function(x, y){ var c = ca0(x, y); if(!L.mon || manual || !planning()) return c;
    var open = function(b){ return pipAll.some(function(q){ return q.b === b && q.left - q.plan > 0; }); }, ph = M14.pipHit(x, y);
    if(ph && open(ph)) return null; if(c && c.host && open(c.host)) return null; return c; };
  var pipDraw = function(){ var live = L.mon && !manual && screen === "game" && (phase === "plan" || phase === "count"), list = live ? pipState() : [], i;
    pipAll = !live ? [] : M14.api.aids(L).dots === "none" ? pipState(true) : list;
    for(i=0;i<list.length;i++){ var q = list[i], el = pipEls[i]; if(!el){ el = pipEls[i] = document.createElement("div"); pipBox.appendChild(el); }
      var s2 = toScreen(_p.set(q.b.P.x, q.b.P.y - q.b.half[1] + 3.4, q.b.P.z)), key = q.total + ":" + q.left + ":" + q.plan + ":" + (q.cue ? 1 : 0);
      if(el._k !== key){ el._k = key; var h = "", d = q.total - q.left, k; for(k=0;k<q.total;k++) h += "<i class=\"" + (k < d ? "d" : k < d + q.plan ? "t" : (k === d + q.plan ? "n" : "")) + "\"></i>"; el.innerHTML = h; el.className = "p" + (q.cue ? " cue" : ""); }
      el.style.display = s2.on ? "" : "none"; el.style.left = s2.x.toFixed(1) + "px"; el.style.top = s2.y.toFixed(1) + "px"; q.sx = s2.x; q.sy = s2.y; q.on = s2.on; }
    // two pip groups that would overlap on screen: the later one moves up a row
    for(i=0;i<list.length;i++){ var a2 = list[i]; if(!a2.on) continue; for(var j2=0;j2<i;j2++){ var b2 = list[j2]; if(b2.on && Math.abs(a2.sx - b2.sx) < 9 + 8*(a2.total + b2.total) && Math.abs(a2.sy - b2.sy) < 20){ a2.sy = b2.sy - 22; pipEls[i].style.top = a2.sy.toFixed(1) + "px"; } } }
    pipNow = list; pipTip(list);
    for(;i<pipEls.length;i++) if(pipEls[i].style.display !== "none"){ pipEls[i].style.display = "none"; pipEls[i]._k = null; } };
  // 2) OPENING MOVE on a monument level: the whole tower for a moment, then the camera pushes in on its foot (L.monIn = {zoom, y}), where
  //    the piers, the barrels and the pips are. Any touch cancels it; BLAST and double-tap still give the whole lot.
  var introT = -1, ucPip = updateCamera, wasPlan = false;
  updateCamera = function(rdt){ if(L.mon && !manual && planning()) swayT = 0;   // round 6: no idle sway while planning on a monument level (at 3 fps the dots drifted under the finger)
    ucPip(rdt);
    // round 5: back from a blast with the tower still up: push in on its foot again (the pips are the feedback); a fallen tower keeps the whole lot
    var nowPlan = planning(); if(nowPlan && !wasPlan && wave > 1 && L.monIn && !manual && M14.api.aids(L).open !== "whole" && blocks.some(function(b){ return b.m14ring && !b.dead && b.floor === 0 && standing(b); })) introT = 0.5; wasPlan = nowPlan;
    if(introT >= 0 && L.monIn && M14.cam && !manual && planning()){ introT += rdt; if(introT > 0.3){ introT = -1; zoomT = clampZoom(L.monIn.zoom); M14.setPan(L.monIn.y - focusY); } }
    pipDraw(); };
  el.addEventListener("pointerdown", function(){ introT = -1; });
  var lastLv = -1;
  var slPip = startLevel; startLevel = function(i){ var same = (i | 0) === lastLv; lastLv = i | 0; var r = slPip.apply(this, arguments);
    if(!manual) M14.tries = same ? M14.tries + 1 : 1;
    // L.track = [[selector, floor, {cue}] ...]: members whose dots the level wants (H0 API: the same as M14.api.track after the build)
    (L.track || []).forEach(function(t){ M14.api.track(t[0], Object.assign({ floor:t[1] || 0 }, t[2] || {})); });
    introT = (L.monIn && !manual && M14.api.aids(L).open !== "whole") ? 0 : -1; return r; };
  if(DEBUG){ var bl0 = breakLink; M14.breaks = [];   // ?debug=1: the first bonds that break, in order (the at-rest check of a new tower)
    breakLink = function(l, why){ if(l.alive && M14.breaks.length < 60) M14.breaks.push([stepCount, (l.a.bid || "") + ":" + l.a.key + "/" + l.b.key + "@" + l.a.floor + "/" + l.b.floor, why || "", Math.round(l.ten/1e3), Math.round(l.sh/1e3), Math.round(l.mo/1e3), Math.round(l.cap.t/1e3), Math.round(l.cap.s/1e3), Math.round(l.cap.m/1e3), Math.round(l.cap.c/1e3)].join(" ")); return bl0(l, why); }; }
  // STD-v3 (D-blast-NOHINT): the old level texts that name a spot go through M14.api.nohint (exact-text map above); the tip that "names
  // the move after 2 fails" (L.tip2) is not used. ?hints=1: all as before.
  var ftNH = failTip; failTip = function(r){ if(M14.hints || !L) return ftNH(r); var t2 = L.tip2; L.tip2 = null; try{ return M14.api.nohint(ftNH(r)); } finally { L.tip2 = t2; } };
  var ltNH = levelTip; levelTip = function(){ return M14.hints || !L ? ltNH() : M14.api.nohint(L.tip); };
  var toNH = toast; toast = function(msg){ var a = [].slice.call(arguments); a[0] = M14.api.nohint(msg); return toNH.apply(this, a); };
  // ------------------------------------------------------------------ test API
  window.__blast.m14 = { breaks:function(){ return M14.breaks; }, info:function(){ return M14.info; }, flags:function(){ return { hero:M14.hero, cam:M14.cam }; },
    cam:function(){ return { pan:M14.pan, panT:M14.panT, range:panRange(), zoomK:zoomK, zoomT:zoomT, zMin:zMin, zMax:zMax, dist:dist, D:camDist*zoomK, focusY:focusY, camFocusY:camFocusY, pitch:pitch, tilt:tiltK, top:topC, clear:GEO ? clearD(yaw, focusY + M14.panT, pitch - TILT) : null,
      pos:[camera.position.x, camera.position.y, camera.position.z] }; },
    rc:function(){ return blocks.filter(function(b){ return b.key === "hrc"; }).map(function(b){ return { i:blocks.indexOf(b), floor:b.floor, gi:b.gi, gj:b.gj, dead:b.dead, dmg:b.dead ? 1 : +(1 - b.hp/b.hp0).toFixed(3), stage:b.dead ? 3 : b.m14s }; }); },
    pips:function(){ return pipState().map(function(q){ var s2 = toScreen(q.b.P); return { i:blocks.indexOf(q.b), gi:q.b.gi, gj:q.b.gj, floor:q.b.floor, total:q.total, left:q.left, plan:q.plan, cue:q.cue, sx:Math.round(s2.x), sy:Math.round(s2.y) }; }); },
    inside:function(){ return GEO ? blocked(camera.position.x, camera.position.y, camera.position.z) : null; },
    set:function(o){ if(o.zoom != null) zoomT = clampZoom(o.zoom); if(o.pan != null) M14.setPan(o.pan); if(o.yaw != null) baseYaw = o.yaw; },
    api:function(){ return Object.keys(M14.api); }, need:function(i){ return M14.api.need(blocks[i]); }, aids:function(){ return M14.api.aids(L); }, ftip:function(){ return M14.api.nohint(L.ftip); }, hints:function(){ return M14.hints; },
    tip:function(){ return levelTip(); }, failLine:function(code){ return failTip({ code:code || "pct", shots:[] }); },   // STD-v3 checks: the on-screen tip / fail line of the current level
    slots:function(){ return pipState(true).map(function(q){ return { i:blocks.indexOf(q.b), total:q.total, left:q.left, plan:q.plan }; }); },
    stats:function(){ var by = {}, n = 0; blocks.forEach(function(b){ if(b.anchor || !b.rb) return; n++; by[b.bid || (b.keep ? "keep" : b.key)] = (by[b.bid || (b.keep ? "keep" : b.key)] || 0) + 1; });
      return { bodies:n, by:by, kd:L6_KD.list.length, tri:renderer.info.render.triangles, calls:renderer.info.render.calls }; } };
})();
// ---- end levels6 v14 MONUMENT
