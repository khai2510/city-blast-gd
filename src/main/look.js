  // ---- main/look.js (visual-design polish, 15/11/2026, from the Car Sort head-to-head research/h2h-carsort/H2H-DESIGN.md, group A fixes;
  // Lead approved as polish: no new feature, the building palette / style guide untouched). Appended inside main() after "frame", so it
  // wraps the final updateCamera / fdChargeModel / laBackdrop and sees every material the earlier steps made.
  // Render / camera / CSS only: no body, joint, damage rule, level number or physics step is touched (R-11 unaffected).
  //
  // K1 CALM WORLD (F1 + F6, 0 draw calls). Grade the world so the colour sits on the building, the TNT and the debris:
  //    lawn -> desaturated sage (x0.46 saturation) that melts into the haze past the lot (distance haze = the soft edge vignette);
  //    sand lot -> lower texture contrast (mixed with its own blurred mip) and a little less saturation;
  //    painted skyline band -> -30 % saturation, +15 % haze toward the horizon (more toward its base), a slight blur (mip bias);
  //    trees / bushes / props sprites -> -18 % saturation. All in the fragment shader of the existing materials.
  // K2 FRAME THE ACTION (F2, 0 calls). During boom / settle / done the camera keeps the engine's orientation (yaw sway, Q3 turn, roll,
  //    shake) but is moved along its own view axis onto the hero + its debris: the subject box (hero members still alive + their
  //    fragments within the hero footprint + 12 m; members still standing count whole, fragments trimmed 8-92 %; ground up) fills FILL of the playable height (or MAXW of the width), its base 10 % above the bottom of
  //    the collapse area (the tray is gone after BLAST) or its centre on the area's centre, whichever is lower, eased in 0.6 s after BLAST and eased with the debris as it comes down; back out (0.35 s) when the next wave's planning
  //    starts. A standing neighbour between the camera and the subject drops the move (engine pose). Planning: untouched (frame.js
  //    owns the opening; nothing here runs before BLAST).
  // K2b KEEP THE WRECK (tester round 16/11, UX-17 / GD-16): the subject box reaches the hero's own height out, fragments are trimmed by
  //    volume and the camera is shifted so the PROJECTED wreck is centred, zoom-out up to 1.8 x (out fast, in slow), a flat wreck no lower than 12 % under the area's centre. ?collcam=0 = plain K2.
  // K3 TOY MATERIALS (F7, 0 calls). The gloss pass (glossMat0: softbox sheen, tight key highlight, sky / ground fresnel rim), already in
  //    the engine but on the charges only, now also on the concrete and brick families (+ slab, RC hero keys), at
  //    concrete [0.36, 0.75, 0.32] / brick [0.34, 0.60, 0.30] (the report's values); their warm contact AO x1.5 (cap 0.75).
  //    Light: hemisphere 0.70 -> 0.80 with a lighter sky colour (shade faces not grey), key 0.78 -> 0.70 and 10 deg higher (shorter
  //    shadows), PCF radius 4 -> 6 (softer edge). Net: a shadowed face keeps ~53 % of a lit one's light instead of ~47 %.
  // K4 SELECTION RIM (F5, +1 call). A white inverted hull (back faces, unlit, depth tested, no depth write, ~2.5 px at any zoom) on the
  //    member(s) that hold a placed charge, while planning / counting: one InstancedMesh, hidden when nothing is placed. The Figma
  //    TNT / cutter / cluster sprites draw their own white outline in their fragment shader (alpha dilation in a 14 % wider quad, the
  //    picture itself unchanged in size): 0 calls. The blast-radius ghost under a charge turns white (was the charge's red: red TNT on
  //    a red disc).
  // K5 ONE ICON STYLE (F10). Upgrades rows: Blast Power and Slow-mo get glossy kit-style icons (gradient, navy outline, white
  //    highlight), Starting TNT the Figma TNT render, Coin Bonus the Home's glossy coin; Booster Pocket keeps its kit wrecking ball.
  // D-blast-TF6 (Owner 18/11/2026, TestFlight 6): K4 (A9 "viền trắng chỗ đặt TNT": member rim, TNT sprite outline, white ghost) and K2 / K2b
  // (A10 collapse camera) are DROPPED = off by default, code kept: ?lookrim=1 = K4 back; ?collcam=1 = K2 + K2b, ?collcam=k2 = plain K2.
  // Default camera after BLAST = the engine's (main/frame.js opening, then the v53 camera), as in TestFlight 5. K1 / K3 / K5 stay on (A8).
  // ?lookskip=world,mat,cam turns single parts off (probe only). ?collcam=0 = K2 without K2b. ?frame=0 also turns K2 off (the old camera all the way). ?look=0 = the old look (none of the above; the stats / measure API stays for before / after numbers). Test API: window.__blast.look.
  (function(){
    var Qk = new URLSearchParams(location.search), OFF = Qk.get("look") === "0";
    var SKIP = (Qk.get("lookskip") || "").split(","), sk = function(k){ return SKIP.indexOf(k) >= 0; };
    var CCQ = Qk.get("collcam") || "", RIM_ON = Qk.get("lookrim") === "1", COLL_ON = CCQ === "1" || CCQ === "k2";   // D-blast-TF6 A9 / A10 opt-ins
    var LK = { on:!OFF, tf6:{ rim:RIM_ON, coll:COLL_ON, q:CCQ }, hooks:[], rim:{ hosts:0, shown:false }, cam:{ W:0, fill:null, fillW:null, blocked:false, D:0, Dg:0 }, st:null };
    // ---- stats: draw calls / triangles of each scene render (incl. the shadow pass), peak per phase class since the last reset
    var ST = LK.st = { plan:{ calls:0, tris:0, n:0 }, blast:{ calls:0, tris:0, n:0 }, last:{ calls:0, tris:0 } };
    var rr0 = renderer.render;
    renderer.render = function(s, c){ var r = rr0.apply(this, arguments);
      if(s === scene && screen === "game"){ var i = renderer.info.render, k = (phase === "boom" || phase === "settle") ? ST.blast : (phase === "plan" || phase === "count") ? ST.plan : null;
        ST.last.calls = i.calls; ST.last.tris = i.triangles;
        if(k){ k.n++; if(i.calls > k.calls) k.calls = i.calls; if(i.triangles > k.tris) k.tris = i.triangles; } }
      return r; };
    var API = window.__blast.look = { on:function(){ return LK.on; },
      stats:function(){ return JSON.parse(JSON.stringify({ plan:ST.plan, blast:ST.blast, last:ST.last, pr:pixRatio })); },
      reset:function(){ ST.plan = { calls:0, tris:0, n:0 }; ST.blast = { calls:0, tris:0, n:0 }; },
      // what the look changed (for "flag off = identical"): light, theme, program keys of the graded materials
      sig:function(){ var mk = function(m){ return m && m.customProgramCacheKey ? m.customProgramCacheKey() : null; };
        return { hemi:[hemi.intensity, hemi.color.getHexString(), hemi.groundColor.getHexString()], sun:[+sun.intensity.toFixed(4), sun.color.getHexString(), +sun.shadow.radius], key:DSTYLE.map(function(S){ return S.key.join(); }),
          dhemi:DSTYLE.map(function(S){ return S.hemi.join(); }), grass:mk(grass.material), lot:mk(lot.material), sky:mk(laSkyMat), spr:mk(laSprMat),
          mats:["concrete", "pier", "brick", "slab"].map(function(k){ return MATS[k] ? mk(MATS[k]) : null; }), tnt:FD_CHG_MAT.tnt ? mk(FD_CHG_MAT.tnt) : null,
          ghost:CMATS.tnt ? CMATS.tnt.gmat.color.getHexString() : null, upg:UPG.map(function(u){ return u.ic.slice(0, 40); }) }; },
      rim:function(){ return { hosts:LK.rim.hosts, shown:LK.rim.shown, list:LK.rim.list ? LK.rim.list.slice() : [] }; },
      cam:function(){ return Object.assign({}, LK.cam); }, hooks:function(){ return LK.hooks.slice(); } };
    if(OFF) return;
    var hooked = function(m, tag){ LK.hooks.push(tag); m.needsUpdate = true; };
    var wrapKey = function(m, suf){ var pk = m.customProgramCacheKey; m.customProgramCacheKey = function(){ return (pk && pk !== THREE.Material.prototype.customProgramCacheKey ? pk.call(this) : "") + suf; }; };
    var wrapCompile = function(m, fn){ var pb = m.onBeforeCompile; m.onBeforeCompile = function(sh, r){ if(pb && pb !== THREE.Material.prototype.onBeforeCompile) pb.call(this, sh, r); fn.call(this, sh, r); }; };
    // ================= K1 calm world
    if(!sk("world")){
    var G = { grassSat:0.46, grassVal:0.86, grassHaze:0.30, sandCon:0.62, sandSat:0.86, skySat:0.70, skyHaze:0.15, skyHazeBase:0.32, skyBias:0.9, sprSat:0.82 };
    LK.grade = G;
    var uHaze = { value:new THREE.Color(scene.fog.color.getHex()) };   // raw sRGB, like the fog (the grade runs after the encoding, before the fog)
    var GRADE_FN = "\nvec3 lkSat(vec3 c, float s){ return mix(vec3(dot(c, vec3(0.299, 0.587, 0.114))), c, s); }\n";
    var addFn = function(sh, extra){ sh.fragmentShader = sh.fragmentShader.replace("#include <common>", "#include <common>" + GRADE_FN + (extra || "")); };
    var atFog = function(sh, code){ if(sh.fragmentShader.indexOf("#include <fog_fragment>") < 0) return false; sh.fragmentShader = sh.fragmentShader.replace("#include <fog_fragment>", code + "\n#include <fog_fragment>"); return true; };
    // lawn: sage + distance haze (vGw = world xz, from the v1 lawn shader). OFF by default (Owner 16/11: keep the old green lawn); ?lkgrass=1 = sage
    if(Qk.get("lkgrass") === "1"){
    wrapCompile(grass.material, function(sh){ if(sh.fragmentShader.indexOf("varying vec2 vGw;") < 0) return; sh.uniforms.uLkHaze = uHaze;
      addFn(sh, "uniform vec3 uLkHaze;\n");
      atFog(sh, "{ float lkD = length(vGw); gl_FragColor.rgb = lkSat(gl_FragColor.rgb, " + G.grassSat.toFixed(3) + ")*vec3(0.98, 1.0, 0.97)*" + G.grassVal.toFixed(3) + ";\n" +
        "  gl_FragColor.rgb = mix(gl_FragColor.rgb, uLkHaze, " + G.grassHaze.toFixed(3) + "*smoothstep(22.0, 85.0, lkD)); }"); });
    wrapKey(grass.material, "-lk1"); hooked(grass.material, "grass");
    }
    // sand lot: its own blurred mip pulls the tyre tracks / grain toward the mean (texture contrast), then a little less saturation
    if(lot.material && lot.material.map){
      wrapCompile(lot.material, function(sh){ var f = sh.fragmentShader, a = "vec4 texelColor = texture2D(map, vLaW/vec2(7.0, 10.5));"; if(f.indexOf(a) < 0) return;
        addFn(sh); sh.fragmentShader = sh.fragmentShader.replace(a, a + " texelColor.rgb = mix(texture2D(map, vLaW/vec2(7.0, 10.5), 6.0).rgb, texelColor.rgb, " + G.sandCon.toFixed(3) + ");");
        atFog(sh, "gl_FragColor.rgb = lkSat(gl_FragColor.rgb, " + G.sandSat.toFixed(3) + ");"); });
      wrapKey(lot.material, "-lk1"); hooked(lot.material, "lot"); }
    // skyline band + the tree / prop sprites: made per district, the first time a backdrop is built
    var hookSky = function(m){ if(!m || m._lk) return; m._lk = 1;
      wrapCompile(m, function(sh){ sh.uniforms.uLkHaze = uHaze; addFn(sh, "uniform vec3 uLkHaze;\n");
        sh.fragmentShader = sh.fragmentShader.replace("#include <map_fragment>", "vec4 texelColor = texture2D(map, vUv, " + G.skyBias.toFixed(2) + "); texelColor = mapTexelToLinear(texelColor); diffuseColor *= texelColor;");
        // the band's image runs from y0 (under the lawn) up: more haze toward its base, as aerial perspective
        sh.fragmentShader = sh.fragmentShader.replace("#include <dithering_fragment>", "gl_FragColor.rgb = mix(lkSat(gl_FragColor.rgb, " + G.skySat.toFixed(3) + "), uLkHaze, " + G.skyHaze.toFixed(3) + " + " + (G.skyHazeBase - G.skyHaze).toFixed(3) + "*(1.0 - smoothstep(0.05, 0.55, vUv.y)));\n#include <dithering_fragment>"); });
      wrapKey(m, "-lk1"); hooked(m, "sky"); };
    var hookSpr = function(m){ if(!m || m._lk) return; m._lk = 1;
      wrapCompile(m, function(sh){ addFn(sh); if(!atFog(sh, "gl_FragColor.rgb = lkSat(gl_FragColor.rgb, " + G.sprSat.toFixed(3) + ");")) sh.fragmentShader = sh.fragmentShader.replace("#include <dithering_fragment>", "gl_FragColor.rgb = lkSat(gl_FragColor.rgb, " + G.sprSat.toFixed(3) + ");\n#include <dithering_fragment>"); });
      wrapKey(m, "-lk1"); hooked(m, "sprite"); };
    hookSky(laSkyMat); hookSpr(laSprMat);
    var lb0 = laBackdrop; laBackdrop = function(){ var r = lb0.apply(this, arguments); try{ hookSky(laSkyMat); hookSpr(laSprMat); }catch(e){ console.error("main/look.js sky", e); } return r; };
    // the haze colour follows the district's fog
    var at0 = applyTheme; applyTheme = function(d){ var r = at0.apply(this, arguments); uHaze.value.setHex(scene.fog.color.getHex()); return r; };
    }
    // ================= K3 light and toy materials
    if(!sk("mat")){
    DSTYLE.forEach(function(S){
      S.hemi = [new THREE.Color(S.hemi[0]).lerp(new THREE.Color(0xFFFFFF), 0.35).getHex(), S.hemi[1], +(S.hemi[2] + 0.10).toFixed(3)];
      S.key = [S.key[0], +(S.key[1] - 0.08).toFixed(3), S.key[2], Math.min(72, S.key[3] + 10)]; });
    sun.shadow.radius = 6;
    if(curD >= 0){ var d0 = curD; curD = -1; applyTheme(d0); }
    var GLK = { concrete:[0.36, 0.75, 0.32], brick:[0.34, 0.60, 0.30] };
    var FAM = { concrete:"concrete", pier:"concrete", wall:"concrete", panel:"concrete", core:"concrete", pylon:"concrete", plinth:"concrete", hrc:"concrete", mdeck:"concrete", slab:null,
      brick:"brick", gate:"brick", bbrick:"brick" };
    var AO0 = "float ao = clamp(0.42*under + 0.26*foot + 0.24*head + 0.34*gnd, 0.0, 0.6);", AO1 = "float ao = clamp(1.5*(0.42*under + 0.26*foot + 0.24*head + 0.34*gnd), 0.0, 0.75);";
    Object.keys(FAM).forEach(function(k){ var m = MATS[k]; if(!m || m._lk) return; m._lk = 1;
      if(FAM[k]) GLOSS_K[k] = GLK[FAM[k]].slice();
      glossMat0(m, k);   // chains on the existing chamfer / v1look / figmadirect hooks (it calls them first)
      wrapCompile(m, function(sh){ sh.fragmentShader = sh.fragmentShader.replace(AO0, AO1); });
      wrapKey(m, "-lk1"); hooked(m, "mat:" + k); });
    }
    // ================= K4 selection rim
    // members: one instanced inverted hull over every member that holds a placed (not fired) charge
    var RIM_MAX = 24, rimGeo = new THREE.BoxGeometry(1, 1, 1);
    var rimMat = new THREE.MeshBasicMaterial({ color:0xFFFFFF, side:THREE.BackSide, depthWrite:false, fog:false, toneMapped:false });
    var rim = new THREE.InstancedMesh(rimGeo, rimMat, RIM_MAX); rim.count = 0; rim.visible = false; rim.frustumCulled = false; rim.renderOrder = 2;
    rim.castShadow = rim.receiveShadow = false; rim.instanceMatrix.setUsage(THREE.DynamicDrawUsage); if(RIM_ON) scene.add(rim);
    var _m = new THREE.Matrix4(), _s = new THREE.Vector3(), _p = new THREE.Vector3();
    var RIM_PX = 2.5;
    var stepRim = function(){
      if(!RIM_ON){ rim.visible = false; return; }   // D-blast-TF6 A9: off by default (?lookrim=1)
      var on = screen === "game" && (phase === "plan" || phase === "count"), hosts = [];
      if(on) charges.forEach(function(c){ var b = c.host; if(!c.fired && b && !b.dead && hosts.indexOf(b) < 0 && hosts.length < RIM_MAX) hosts.push(b); });
      if(on && typeof selC !== "undefined" && selC && selC.host && hosts.indexOf(selC.host) < 0 && hosts.length < RIM_MAX) hosts.push(selC.host);
      var k = Math.tan(camera.fov*Math.PI/360)*2/Math.max(1, VH);   // metres per CSS px per metre of distance
      for(var i=0;i<hosts.length;i++){ var b = hosts[i], h = b.half, dd = Math.max(1, camera.position.distanceTo(b.P)), m = Math.max(0.03, RIM_PX*k*dd);
        _s.set(2*h[0] + 2*m, 2*h[1] + 2*m, 2*h[2] + 2*m); _m.compose(_p.copy(b.P), b.Q, _s); rim.setMatrixAt(i, _m); }
      rim.count = hosts.length; rim.visible = hosts.length > 0; if(hosts.length) rim.instanceMatrix.needsUpdate = true;
      LK.rim.hosts = hosts.length; LK.rim.shown = rim.visible; LK.rim.list = hosts.map(function(b){ return blocks.indexOf(b); });
    };
    // charges: the Figma sprites outline themselves (alpha dilation in a wider quad); the per-charge clones of main/occlude.js inherit it
    var RIM_S = 1.14, RIM_R = 0.034;
    var rimFrag = function(sh){ if(sh.fragmentShader.indexOf("lkRim") >= 0 || sh.fragmentShader.indexOf("#include <map_fragment>") < 0) return;
      var taps = [], n = 12; for(var i=0;i<n;i++){ var a = i/n*Math.PI*2; taps.push("lkA = max(lkA, lkT(lkU + vec2(" + Math.cos(a).toFixed(4) + ", " + Math.sin(a).toFixed(4) + ")*" + RIM_R.toFixed(4) + "));"); }
      sh.fragmentShader = sh.fragmentShader.replace("void main()", "// lkRim\nfloat lkT(vec2 q){ return all(greaterThanEqual(q, vec2(0.0))) && all(lessThanEqual(q, vec2(1.0))) ? texture2D(map, q).a : 0.0; }\nvoid main()")
        .replace("#include <map_fragment>", "vec2 lkU = (vUv - 0.5)*" + RIM_S.toFixed(3) + " + 0.5; vec4 texelColor = mapTexelToLinear(texture2D(map, clamp(lkU, 0.0, 1.0)));\n" +
          "texelColor.a *= lkT(lkU) > 0.0 ? 1.0 : 0.0; float lkA = 0.0;\n" + taps.join("\n") + "\nfloat lkO = smoothstep(0.2, 0.6, lkA);\n" +
          "diffuseColor *= vec4(mix(vec3(1.0), texelColor.rgb, smoothstep(0.0, 0.6, texelColor.a)), max(texelColor.a, lkO));");
    };
    var rimSprite = function(m){ if(!m || m._lkRim) return; m._lkRim = 1;
      wrapCompile(m, rimFrag); wrapKey(m, "-lkrim");
      if(m._occlHook){ var p0 = m._occlHook[0], k0 = m._occlHook[1];   // the hook main/occlude.js re-applies to each placed charge's own copy
        m._occlHook[0] = function(sh, r){ if(p0 && p0 !== THREE.Material.prototype.onBeforeCompile) p0.call(this, sh, r); rimFrag(sh); };
        m._occlHook[1] = function(){ return (k0 && k0 !== THREE.Material.prototype.customProgramCacheKey ? k0.call(this) : "") + "-lkrim"; }; }
      hooked(m, "rim:" + (m.map && m.map.userData ? Math.round(m.map.userData.asp*100) : "?")); };
    if(RIM_ON){   // D-blast-TF6 A9: sprite outline + white ghost only with ?lookrim=1
    Object.keys(FD_CHG_MAT).forEach(function(k){ rimSprite(FD_CHG_MAT[k]); });
    var fcm0 = fdChargeModel; fdChargeModel = function(k){ var g = fcm0.apply(this, arguments);
      if(g){ g.traverse(function(o){ if(o.isSprite){ rimSprite(o.material); o.scale.x *= RIM_S; o.scale.y *= RIM_S; } }); g.userData.ext = (g.userData.ext || 0.9)*RIM_S; }
      return g; };
    // the blast-radius ghost: white instead of the charge's colour
    var whiteGhost = function(r){ if(r && r.gmat && !r.gmat._lk){ r.gmat._lk = 1; r.gmat.color.copy(lin(0xFFF6E6)); } return r; };
    Object.keys(CMATS).forEach(function(k){ whiteGhost(CMATS[k]); });
    var cms0 = chargeMats; chargeMats = function(k){ return whiteGhost(cms0.apply(this, arguments)); };
    }
    // ================= K2 frame the action (collapse / win)
    var CF = { fill:+(Qk.get("lookfill") || 0.52), maxW:0.84, minK:0.5, maxK:1.15, bot:0.11, tIn:0.6, tOut:0.35, tT:0.45, tD:0.55, scan:0.1, trim:0.08, rPad:12, base:0.10 };
    LK.camCfg = CF;
    // K2b KEEP THE WRECK (UX-17 / GD-16, tester round 16/11: L1 wreck on the bottom edge, L2 lighthouse rolled out of frame, L4 rubble
    //    left at the bottom left; L5 / L6 fine). The K2 subject box missed big pieces: whole members lying beyond footprint + 12 m (a
    //    tall hero falls its own height away) were dropped, fragments were trimmed by COUNT (many chips in the middle outvote the big
    //    roof panels at the side), the zoom-out was capped at 1.15 x the engine distance, and a flat wreck was pushed to the bottom
    //    with the lawn above it. Now (?collcam=0 = the K2 box / clamps above, unchanged):
    //    reach = footprint + max(12 m, 1.1 x the hero's height); members that moved > 1.5 m from their spawn and fragments are debris,
    //    trimmed by VOLUME (10-90 %: chips and a stray beam go, the main heap stays; ?cctrim= to tune); standing members still count whole;
    //    a KEEP box (2-98 % by volume) may only pull back (<= 1.3 x), until it fits 90 % of the half width / 88 % of the area's half height;
    //    no push-in while the blast is live (boom: a falling tower's core box shrinks as it tips, the camera would close in on it);
    //    zoom-out cap 1.8 x (in 0.6 x), out fast (0.4 s) / in slow (1.2 s) so the frame never pumps; a flat wreck sits at most 12 % of
    //    the area below its centre; the camera is shifted so the projected box (not its 3D centre) is centred. Test API: look.wreck() = the share of the hero's volume inside the collapse area.
    var CC = { on:CCQ === "1", reach:1.1, vtrim:+(Qk.get("cctrim") || 0.10), ktrim:0.02, keepW:0.90, keepH:0.88, keepMax:1.3, still:1.5, minK:0.6, maxK:1.8, tDout:0.4, tDin:1.2, baseMax:0.12 };
    LK.collCfg = CC; LK.cam.cc = CC.on;
    // weighted quantile of [value, weight] pairs
    var wq = function(a, q){ if(!a.length) return 0; a.sort(function(x, y){ return x[0] - y[0]; }); var tot = 0, s = 0, i; for(i=0;i<a.length;i++) tot += a[i][1]; var t = q*tot; for(i=0;i<a.length;i++){ s += a[i][1]; if(s >= t) return a[i][0]; } return a[a.length - 1][0]; };
    var CS = { W:0, Wsp:{v:0}, T:new THREE.Vector3(), Tsp:[{v:0}, {v:0}, {v:0}], D:0, Dsp:{v:0}, init:false, box:null, tScan:-1, act:false, blocked:false };
    var _pc = new THREE.PerspectiveCamera(GAME_FOV, 1, 0.1, 4000), _v = new THREE.Vector3(), _dir = new THREE.Vector3(), _P0 = new THREE.Vector3(), _my = new THREE.Vector3(), _T = new THREE.Vector3(), _up = new THREE.Vector3();
    var _rm = new THREE.Matrix4();
    var heroIds = function(){ return String((L && L.hero) || "A").split(","); };
    var pct = function(a, q){ if(!a.length) return 0; a.sort(function(x, y){ return x - y; }); return a[Math.max(0, Math.min(a.length - 1, Math.round(q*(a.length - 1))))]; };
    // the subject box: hero members still alive + the hero's fragments (centres +- their size), trimmed, ground up
    var subjectBox = function(pieces){ var ids = heroIds(), X0 = [], X1 = [], Z0 = [], Z1 = [], Y1 = [], cx = 0, cz = 0, n = 0, pts = [], hH = 0;
      var all = blocks.filter(function(b){ return !b.anchor && !b.prop && !b.keep && !b.bonus && ids.indexOf(b.bid) >= 0; }), r0 = 0;
      all.forEach(function(b){ var q = b.spawn || b.P; cx += q.x; cz += q.z; });
      if(!all.length) return null; cx /= all.length; cz /= all.length;
      all.forEach(function(b){ var q = b.spawn || b.P; r0 = Math.max(r0, Math.hypot(q.x - cx, q.z - cz) + Math.max(b.half[0], b.half[2])); hH = Math.max(hH, q.y + b.half[1]); if(!b.dead){ pts.push(b); n++; } });
      var rCC = r0 + Math.max(CF.rPad, CC.reach*hH), rMax = CC.on ? rCC : r0 + CF.rPad;   // the hero's footprint + a pad (K2b: + its own height): pieces flung farther are not framed
      // members still alive count whole (min / max: a standing part is never cut off); flying / fallen fragments are trimmed 8-92 %
      var M = { x0:1e9, x1:-1e9, z0:1e9, z1:-1e9, y1:0 };
      frags.forEach(function(f){ if(f.src && !f.src.keep && ids.indexOf(f.src.bid) >= 0) pts.push(f); });
      pts.forEach(function(b){ var p = b.P, h = b.half, vol = 8*h[0]*h[1]*h[2], r = Math.hypot(p.x - cx, p.z - cz); if(r > rCC || p.y < -2) return;
        _rm.makeRotationFromQuaternion(b.Q); var e = _rm.elements;   // the member's world AABB half extents (oriented box)
        var ex = Math.abs(e[0])*h[0] + Math.abs(e[4])*h[1] + Math.abs(e[8])*h[2], ey = Math.abs(e[1])*h[0] + Math.abs(e[5])*h[1] + Math.abs(e[9])*h[2], ez = Math.abs(e[2])*h[0] + Math.abs(e[6])*h[1] + Math.abs(e[10])*h[2];
        if(pieces) pieces.push([p.x, p.y, p.z, vol, ex, ey, ez]);
        if(r > rMax) return;
        var whole = !b.frag && (!CC.on || !b.spawn || Math.hypot(p.x - b.spawn.x, p.y - b.spawn.y, p.z - b.spawn.z) < CC.still);   // K2b: a member that has moved is debris (weighted), only a standing one counts whole
        if(whole){ M.x0 = Math.min(M.x0, p.x - ex); M.x1 = Math.max(M.x1, p.x + ex); M.z0 = Math.min(M.z0, p.z - ez); M.z1 = Math.max(M.z1, p.z + ez); M.y1 = Math.max(M.y1, p.y + ey); return; }
        if(CC.on){ X0.push([p.x - ex, vol]); X1.push([p.x + ex, vol]); Z0.push([p.z - ez, vol]); Z1.push([p.z + ez, vol]); Y1.push([p.y + ey, vol]); return; }
        X0.push(p.x - ex); X1.push(p.x + ex); Z0.push(p.z - ez); Z1.push(p.z + ez); Y1.push(p.y + ey); });
      if(!X0.length && M.x0 > M.x1) return null;
      var qf = CC.on ? wq : pct, tr = CC.on ? CC.vtrim : CF.trim;
      var F = X0.length ? { x0:qf(X0, tr), x1:qf(X1, 1 - tr), z0:qf(Z0, tr), z1:qf(Z1, 1 - tr), y1:qf(Y1, 1 - tr) } : { x0:1e9, x1:-1e9, z0:1e9, z1:-1e9, y1:0 };
      var out = { x0:Math.min(M.x0, F.x0), x1:Math.max(M.x1, F.x1), z0:Math.min(M.z0, F.z0), z1:Math.max(M.z1, F.z1), y0:0, y1:Math.max(2, M.y1, F.y1), n:pts.length };
      // K2b: the KEEP box (2-98 % by volume + the standing members) must stay on screen: it can only pull the camera back
      if(CC.on && X0.length){ var K = { x0:wq(X0, CC.ktrim), x1:wq(X1, 1 - CC.ktrim), z0:wq(Z0, CC.ktrim), z1:wq(Z1, 1 - CC.ktrim), y1:wq(Y1, 1 - CC.ktrim) };
        out.keep = { x0:Math.min(M.x0, K.x0, out.x0), x1:Math.max(M.x1, K.x1, out.x1), z0:Math.min(M.z0, K.z0, out.z0), z1:Math.max(M.z1, K.z1, out.z1), y0:0, y1:Math.max(out.y1, K.y1) }; }
      return out; };
    // the collapse area: the tray (BLAST row) is gone after BLAST, so the play area runs from the top HUD down to BOT x the screen height
    var area = function(){ var t = topH(), b = Math.max(CF.bot*VH, 24), h = Math.max(60, VH - t - b); return { t:t, b:b, h:h }; };
    // NDC bounds of the box from a probe camera with the live camera's rotation, at distance D behind T
    var ndc = function(bx, T, D){ _pc.fov = camera.fov; _pc.aspect = VW/VH; _pc.near = camera.near; _pc.far = camera.far; _pc.clearViewOffset(); _pc.updateProjectionMatrix();
      _pc.quaternion.copy(camera.quaternion); _pc.position.copy(T).addScaledVector(_dir, -D); _pc.updateMatrixWorld();
      var x0 = 9, x1 = -9, y0 = 9, y1 = -9; for(var i=0;i<8;i++){ _v.set(i&1 ? bx.x1 : bx.x0, i&2 ? bx.y1 : bx.y0, i&4 ? bx.z1 : bx.z0).project(_pc);
        if(_v.x < x0) x0 = _v.x; if(_v.x > x1) x1 = _v.x; if(_v.y < y0) y0 = _v.y; if(_v.y > y1) y1 = _v.y; }
      return { x0:x0, x1:x1, y0:y0, y1:y1 }; };
    // K2b: the distance at which the keep box, measured from the subject box's projected centre, fits KEEPW of the half width and
    // KEEPH of the collapse area's half height (only ever farther than D, at most KEEPMAX x D)
    var solveKeep = function(bx, kb, T, D){ var A = area(), D0 = D, b, c, k; for(var it=0; it<6; it++){ b = ndc(kb, T, D); c = ndc(bx, T, D);
        var xc = (c.x0 + c.x1)/2, yc = (c.y0 + c.y1)/2;
        k = Math.max(Math.max(xc - b.x0, b.x1 - xc)/CC.keepW, Math.max(yc - b.y0, b.y1 - yc)*VH/A.h/CC.keepH); if(!isFinite(k) || k <= 1.005) break; D = D*k; }
      return Math.max(D0, Math.min(D0*CC.keepMax, D)); };
    var solveD = function(bx, T, D){ var A = area(), b, k; for(var it=0; it<8; it++){ b = ndc(bx, T, D); k = Math.max((b.y1 - b.y0)/2*VH/A.h/CF.fill, (b.x1 - b.x0)/2/CF.maxW); if(!isFinite(k) || k <= 0) break; D = Math.max(8, D*k); if(Math.abs(k - 1) < 0.01) break; } return D; };
    // a standing non-hero building between the camera and the subject: segment vs its members' boxes (rotation ignored, padded)
    var segBlocked = function(a, t){ var ids = heroIds(), dx = t.x - a.x, dy = t.y - a.y, dz = t.z - a.z;
      for(var i=0;i<blocks.length;i++){ var b = blocks[i]; if(b.dead || b.anchor || b.prop || ids.indexOf(b.bid) >= 0) continue;
        var p = b.P, h = b.half, r = Math.hypot(h[0], h[2]) + 0.3, lo = 0, hi = 1, ok = true;
        var mn = [p.x - r, p.y - h[1] - 0.3, p.z - r], mx = [p.x + r, p.y + h[1] + 0.3, p.z + r], o = [a.x, a.y, a.z], d = [dx, dy, dz];
        for(var ax=0; ax<3 && ok; ax++){ if(Math.abs(d[ax]) < 1e-6){ if(o[ax] < mn[ax] || o[ax] > mx[ax]) ok = false; } else { var t1 = (mn[ax] - o[ax])/d[ax], t2 = (mx[ax] - o[ax])/d[ax]; if(t1 > t2){ var q = t1; t1 = t2; t2 = q; } lo = Math.max(lo, t1); hi = Math.min(hi, t2); if(lo > hi) ok = false; } }
        if(ok) return true; }
      return false; };
    // the collapse framing extends main/frame.js (opening on the hero -> collapse on hero + debris): ?frame=0 (and ?hints=1, which keeps the old opening) = the old camera all the way
    var CAM_ON = COLL_ON && !sk("cam") && !!(window.__blast.frame && window.__blast.frame.on());   // D-blast-TF6 A10: off by default
    LK.cam.on = CAM_ON;
    var gameT0 = 0;
    var uc0 = updateCamera;
    updateCamera = function(rdt){
      uc0(rdt);
      try{ stepRim(); }catch(e){ rim.visible = false; }
      var game = (screen === "game" || screen === "result") && phase !== "title" && !manual && L && blocks.length;   // result = the CLEARED! stamp / lose card over the same scene
      if(!game){ CS.W = 0; CS.Wsp.v = 0; CS.init = false; CS.box = null; LK.cam.W = 0; return; }
      var act = CAM_ON && (phase === "boom" || phase === "settle" || phase === "done");
      if(!act && CS.W === 0){ CS.init = false; CS.box = null; LK.cam.W = 0; return; }
      camera.getWorldDirection(_dir); _P0.copy(camera.position);
      gameT0 += rdt;
      if(act && (CS.tScan < 0 || gameT0 >= CS.tScan)){ CS.tScan = gameT0 + CF.scan; var bx = subjectBox(); if(bx) CS.box = bx; }
      var wt = act && CS.box ? 1 : 0;
      if(CS.box){ var bx2 = CS.box, Dg = camDist*zoomK;
        _T.set((bx2.x0 + bx2.x1)/2, (bx2.y0 + bx2.y1)/2, (bx2.z0 + bx2.z1)/2);
        var D = CC.on ? Math.max(Dg*CC.minK, Math.min(Dg*CC.maxK, bx2.keep ? solveKeep(bx2, bx2.keep, _T, solveD(bx2, _T, Dg)) : solveD(bx2, _T, Dg))) : Math.max(Dg*CF.minK, Math.min(Dg*CF.maxK, solveD(bx2, _T, Dg)));
        if(CC.on && CS.init && phase === "boom") D = Math.max(D, Math.min(CS.D, Dg*CC.maxK));   // K2b: pull back only while it falls
        if(!CS.init){ CS.T.copy(_T); CS.D = D; CS.init = true; CS.fresh = true; CS.Tsp.forEach(function(s){ s.v = 0; }); CS.Dsp.v = 0; }
        else { CS.T.x = damp(CS.T.x, _T.x, CS.Tsp[0], CF.tT, rdt); CS.T.y = damp(CS.T.y, _T.y, CS.Tsp[1], CF.tT, rdt); CS.T.z = damp(CS.T.z, _T.z, CS.Tsp[2], CF.tT, rdt);
          CS.D = damp(CS.D, D, CS.Dsp, CC.on ? (D > CS.D ? CC.tDout : CC.tDin) : CF.tD, rdt); }   // K2b: pull back fast, push in slowly
        // the engine's view offset puts the camera axis on the planning area's centre; the collapse area's centre is lower: aim higher by that many px
        // the subject's base sits BASE x the area height above the area's bottom (rubble lands low, not mid-air over empty lawn); a tall subject stays centred
        var A2 = area(), bN = ndc(bx2, CS.T, CS.D), hPx = (bN.y1 - bN.y0)/2*VH, cy = Math.max(A2.t + A2.h/2, A2.t + A2.h*(1 - CF.base) - hPx/2);
        if(CC.on) cy = Math.min(cy, A2.t + A2.h*(0.5 + CC.baseMax));   // K2b: a flat wreck no longer sinks to the bottom edge under empty lawn
        // K2b: perspective makes the near side of the box project bigger, so its 3D centre is not its screen centre: shift the camera
        // sideways / up by the projected box's own offset (eased like the target) so the wreck is centred, not cut on one side
        if(CC.on){ var xm = Math.max(-0.5, Math.min(0.5, (bN.x0 + bN.x1)/2)), ym = Math.max(-0.5, Math.min(0.5, (bN.y0 + bN.y1)/2));
          if(CS.fresh){ CS.ox = xm; CS.oy = ym; CS.oSp = [{v:0}, {v:0}]; CS.fresh = false; }
          else { CS.ox = damp(CS.ox, xm, CS.oSp[0], CF.tT, rdt); CS.oy = damp(CS.oy, ym, CS.oSp[1], CF.tT, rdt); } }
        var ox = CC.on ? CS.ox : 0, oy = CC.on ? CS.oy : 0;
        var dyPx = cy - (topH() + (VH - topH() - botH())/2) + oy*VH/2, wpp = 2*CS.D*Math.tan(camera.fov*Math.PI/360)/VH;
        _up.set(0, 1, 0).applyQuaternion(camera.quaternion);
        _my.copy(CS.T).addScaledVector(_up, dyPx*wpp).addScaledVector(_dir, -CS.D);
        if(ox){ _up.set(1, 0, 0).applyQuaternion(camera.quaternion); _my.addScaledVector(_up, ox*VW/2*wpp); }
        if(wt && (CS.tChk == null || gameT0 >= CS.tChk)){ CS.tChk = gameT0 + 0.2; CS.blocked = segBlocked(_my, CS.T); }
        if(CS.blocked) wt = 0;
        LK.cam.Dg = +Dg.toFixed(2); LK.cam.D = +CS.D.toFixed(2); }
      CS.W = wt >= CS.W ? damp(CS.W, wt, CS.Wsp, CF.tIn*0.5, rdt) : damp(CS.W, wt, CS.Wsp, CF.tOut*0.5, rdt);
      if(wt === 1 && CS.W > 0.995) CS.W = 1; if(wt === 0 && CS.W < 0.003){ CS.W = 0; CS.Wsp.v = 0; }
      CS.W = Math.max(0, Math.min(1, CS.W));
      LK.cam.W = +CS.W.toFixed(3); LK.cam.blocked = CS.blocked; LK.cam.act = act;
      if(CS.W > 0 && CS.init){ camera.position.lerpVectors(_P0, _my, CS.W); camera.updateMatrixWorld(); }
    };
    // test API (K2b): the share of the hero's volume (members + fragments within reach) whose centres are inside the collapse area now
    API.wreck = function(){ var pc = []; if(!subjectBox(pc) || !pc.length) return null; camera.updateMatrixWorld(); var A = area(), tot = 0, inV = 0, cV = 0, x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
      pc.forEach(function(q){ var a0 = 1e9, a1 = -1e9, b0 = 1e9, b1 = -1e9, behind = false; tot += q[3];
        for(var i=0;i<8;i++){ _v.set(q[0] + (i&1 ? q[4] : -q[4]), q[1] + (i&2 ? q[5] : -q[5]), q[2] + (i&4 ? q[6] : -q[6])).project(camera); if(_v.z >= 1) behind = true;
          var sx = (_v.x + 1)/2*VW, sy = (1 - _v.y)/2*VH; a0 = Math.min(a0, sx); a1 = Math.max(a1, sx); b0 = Math.min(b0, sy); b1 = Math.max(b1, sy); }
        _v.set(q[0], q[1], q[2]).project(camera); var cx = (_v.x + 1)/2*VW, cy = (1 - _v.y)/2*VH;
        if(!behind && cx >= 0 && cx <= VW && cy >= A.t && cy <= VH - A.b) cV += q[3];
        if(!behind && a0 >= 0 && a1 <= VW && b0 >= A.t && b1 <= VH - A.b){ inV += q[3]; x0 = Math.min(x0, a0); x1 = Math.max(x1, a1); y0 = Math.min(y0, b0); y1 = Math.max(y1, b1); } });
      // inVol: share of the volume whose whole box is inside the collapse area; cVol: whose centre is
      return { cc:CC.on, n:pc.length, inVol:+(inV/Math.max(1e-9, tot)).toFixed(3), cVol:+(cV/Math.max(1e-9, tot)).toFixed(3), x0:Math.round(x0), x1:Math.round(x1), y0:Math.round(y0), y1:Math.round(y1), D:LK.cam.D, Dg:LK.cam.Dg }; };
    // test API: the subject box on screen now, as a fraction of the playable area
    API.measure = function(){ var bx = subjectBox(); if(!bx) return null; camera.updateMatrixWorld(); var A = area(), x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
      for(var i=0;i<8;i++){ _v.set(i&1 ? bx.x1 : bx.x0, i&2 ? bx.y1 : bx.y0, i&4 ? bx.z1 : bx.z0).project(camera); var sx = (_v.x + 1)/2*VW, sy = (1 - _v.y)/2*VH;
        if(sx < x0) x0 = sx; if(sx > x1) x1 = sx; if(sy < y0) y0 = sy; if(sy > y1) y1 = sy; }
      return { phase:phase, W:LK.cam.W, dy:+(((y0 + y1)/2 - (A.t + A.h/2))/A.h).toFixed(3), A:[Math.round(A.t), Math.round(A.b)], fillH:+((y1 - y0)/A.h).toFixed(3), fillW:+((x1 - x0)/VW).toFixed(3), baseAboveTray:+((VH - A.b - y1)/A.h).toFixed(3), top:Math.round(y0), bot:Math.round(y1), n:bx.n }; };
    // ================= K5 one icon style in Upgrades
    var svgUri = function(s){ return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(s); };
    var IC = {
      power:svgUri('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><defs><radialGradient id="a" cx=".42" cy=".38" r=".7"><stop offset="0" stop-color="#FFF1B8"/><stop offset=".45" stop-color="#FFB53D"/><stop offset="1" stop-color="#EE5A1E"/></radialGradient></defs>' +
        '<path d="M48 5L57 29L81 16L71 41L93 50L69 60L79 86L54 73L44 93L37 68L11 77L24 54L3 41L28 34L19 9L41 22Z" fill="url(#a)" stroke="#2B2140" stroke-width="5" stroke-linejoin="round"/>' +
        '<circle cx="48" cy="50" r="11" fill="#FFF6D2"/><path d="M27 30Q36 21 47 24" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".9"/></svg>'),
      slowmo:svgUri('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><defs><linearGradient id="a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8FD6FF"/><stop offset="1" stop-color="#2F74DC"/></linearGradient>' +
        '<radialGradient id="b" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#E2EAF6"/></radialGradient><linearGradient id="c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE27A"/><stop offset="1" stop-color="#F2A81C"/></linearGradient></defs>' +
        '<rect x="39" y="5" width="18" height="13" rx="4" fill="url(#c)" stroke="#2B2140" stroke-width="4"/><rect x="68" y="17" width="13" height="11" rx="3" transform="rotate(40 74 22)" fill="url(#c)" stroke="#2B2140" stroke-width="4"/>' +
        '<circle cx="48" cy="55" r="35" fill="url(#a)" stroke="#2B2140" stroke-width="5"/><circle cx="48" cy="55" r="24" fill="url(#b)" stroke="#2B2140" stroke-width="3.5"/>' +
        '<path d="M48 55V39M48 55L59 62" stroke="#2B2140" stroke-width="5" stroke-linecap="round"/><circle cx="48" cy="55" r="4.5" fill="#F2462E" stroke="#2B2140" stroke-width="2"/>' +
        '<path d="M23 40Q29 27 43 24" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".85"/></svg>'),
      charge:FD_IMG.tnt ? FD_IMG.tnt.src : null,
      magnet:"__LK_COIN__"
    };
    var icHtml = function(src){ return '<img class="lkIc" alt="" draggable="false" src="' + src + '">'; };
    UPG.forEach(function(u){ if(IC[u.id]) u.ic = icHtml(IC[u.id]); });
    var css = document.createElement("style"); css.id = "lkCss";
    css.textContent = ".lkIc{width:48px;height:48px;object-fit:contain;display:block;filter:drop-shadow(0 2px 0 rgba(43,33,64,.25))}";
    document.head.appendChild(css);
  })();
  // ---- end main/look.js
