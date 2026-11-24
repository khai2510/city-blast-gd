  // ---- main/perf2.js (PERF-1124, Khai 24/11 "TestFlight build 9 giật, không mượt"): safe wins only (same picture, same physics).
  // Appended inside main() after rs-look (before main/fps.js), so it wraps the final renderer.render. Numbers: city-blast/levels-gd/PERF-1124/PERF-1124.md.
  // S1 identical frames are not redrawn. Before each render of the game scene, a signature of everything the GPU would draw is
  //    compared with the last drawn frame (plain values exactly as float32, matrices within 2e-5): canvas size, camera pose + projection (incl. the shake / HUD view offset), fog, clear
  //    colour, lights, and for every visible object its world matrix, geometry + attribute versions, instance count / matrix / colour
  //    versions, material version / colour / opacity / maps and every uniform value the program reads (incl. the onBeforeCompile
  //    ones: renderer.properties). Same signature, no pending shadow update, no FXAA target => the frame is skipped and the canvas
  //    keeps the last picture (the compositor shows it again). A frame is still drawn at least once a second. Wins where the world
  //    and the camera are at rest: a monument hero while planning (no idle sway), the result / pause cards over a settled lot,
  //    Shop / Upgrades over the game. Everything moving is drawn as before. ?perfskip=0 = off.
  // S2 no shader compile on the first TNT, no texture upload on the first BLAST. The engine's warmUp() runs at boot, BEFORE the
  //    later patches (occlude, look) re-key the charge sprite materials, so their program was compiled under the player's first
  //    tap (measured: 1 new program at the first placement). And the particle atlas (1024 x 1024) is still decoding when warmUp
  //    runs, so it was uploaded inside the first BLAST frame (21.5 ms texImage2D on the test VM, plus the image decode on iOS).
  //    Now warmUp() runs once more after every patch, and the atlas + the charge sprite images are uploaded (renderer.initTexture)
  //    as soon as each image is decoded. Same programs, same textures, only earlier. ?perfwarm=0 = off.
  // S3 no second fixed step on a frame that cannot afford it. physicsFrame allows 2 steps a frame while the first took < 9 ms; on a
  //    phone in a hero collapse (4-8 ms a step) that makes 1-step / 2-step frames alternate (16 / 33 ms: judder). Now the second
  //    step also needs (this frame's physics so far + last frame's non-physics work) x 2 steps' worth to fit in 14 ms. Every step is
  //    still exactly DT and nothing else changes, so the same taps give the same collapse (R-11): an overloaded phone only drops
  //    the time it cannot simulate a frame at a time instead of two. ?perfstep=0 = off.
  // S4 a body whose drawn pose cannot have changed is not rewritten. The frame loop rewrites every member / debris piece whose
  //    `sleeping` flag is false; that flag is refreshed only by a physics step, so once the world stops stepping (the result card,
  //    8 s after the end) up to 60 debris pieces and the members still marked awake were re-sent to the GPU every frame with the
  //    same matrix, and the "something moved" flag redrew the shadow map every frame too. Now a piece is rewritten only when the
  //    step count, the interpolation alpha or its pose changed since its last write (bent members, which animate on their own, are
  //    always rewritten). Same matrices, fewer uploads; it also lets S1 skip the settled result card. ?perfpose=0 = off.
  //    (perf2-patch.js puts the pfPoseNew() test into the two write loops of animate().)
  // ?perf2=0 = everything here off.
  // S4 (called from the engine's animate() write loops, see perf2-patch.js): true when o's drawn pose may differ from its last write
  var PF2_POSE = new URLSearchParams(location.search).get("perf2") !== "0" && new URLSearchParams(location.search).get("perfpose") !== "0";
  function pfPoseNew(o){
    if(!PF2_POSE || o.bent) return true;
    var p = o.P, q = o.Q;
    if(o._pfS === stepCount && o._pfA === alpha && o._pfX === p.x && o._pfY === p.y && o._pfZ === p.z && o._pfW === q.w && o._pfQ === q.x && o._pfG === pfGen) return false;
    o._pfS = stepCount; o._pfA = alpha; o._pfX = p.x; o._pfY = p.y; o._pfZ = p.z; o._pfW = q.w; o._pfQ = q.x; o._pfG = pfGen; return true;
  }
  var pfGen = 0;   // bumped on every level start / world swap: every piece is rewritten once
  (function(){
    var Q2 = new URLSearchParams(location.search), OFF2 = Q2.get("perf2") === "0";
    var PF = window.__blastPerf || (window.__blastPerf = {});
    PF.p2 = { on:!OFF2, skip:0, drawn:0, forced:0 };
    if(OFF2) return;
    // ---- S4 (the generation counter; the test itself is pfPoseNew above)
    var sl0 = startLevel; startLevel = function(){ pfGen++; return sl0.apply(this, arguments); };
    var nw0 = newWorld; newWorld = function(){ pfGen++; return nw0.apply(this, arguments); };
    // ---- S2
    if(Q2.get("perfwarm") !== "0"){
      try{ warmUp(); PF.p2.warm = 1; }catch(e){ PF.p2.warm = "err " + e.message; }
      var up = function(t){ try{ if(t && t.image && t.image.width > 1){ renderer.initTexture(t); PF.p2.up = (PF.p2.up || 0) + 1; } }catch(e){} };
      (function poll(){ if(typeof PX !== "undefined" && PX && PX.ready && PX.mesh) up(PX.mesh.material.uniforms.map.value); else requestAnimationFrame(poll); })();
      if(typeof FD_TEX !== "undefined") Object.keys(FD_TEX).forEach(function(k){ fdWhen(FD_TEX[k], up); });
    }
    // ---- S3
    if(Q2.get("perfstep") !== "0"){
      var otherMs = 0, aS = animate;
      animate = function(){ var t0 = performance.now(); PF.p2.physMs = 0; try{ return aS.apply(this, arguments); } finally { otherMs = performance.now() - t0 - PF.p2.physMs; } };
      // the engine's own loop with one more condition on the 2nd step (same order, same DT, same alpha rule)
      physicsFrame = function(rdt){
        var ts = passSlow > 0 ? Math.min(timeScale, 0.4) : timeScale;
        var rate = hitStop > 0 ? 0 : ts*(ffwd ? 3 : 1);
        acc += rdt*rate;
        var n = 0, t0 = performance.now();
        var maxN = ffwd ? MAX_STEPS*3 : MAX_STEPS, bud = ffwd ? PHYS_BUDGET*2 : PHYS_BUDGET;
        while(acc >= DT && n < maxN && (n === 0 || (performance.now() - t0 < bud && (ffwd || otherMs + (performance.now() - t0)*(n + 1)/n < 14)))){ fixedStep(); acc -= DT; n++; }
        physMs = performance.now() - t0; PF.p2.physMs = physMs;
        if(acc > DT) acc = DT;
        alpha = Math.max(0, Math.min(1, acc/DT));
      };
      PF.p2.step = 1;
    }
    // ---- S1
    if(Q2.get("perfskip") !== "0"){
      // C = this frame's signature, A = the signature of the last DRAWN frame (copied only when a frame is drawn), so a slow
      // drift below the tolerance can never add up unseen. Plain values (ids, versions, colours, opacity, uniforms) must match
      // exactly as float32 (the precision the GPU is given). World / camera / shadow matrices may differ by MTOL = 2e-5 (metres or
      // unit rotation terms): at the closest zoom (8 m) that is under 0.01 px on a 1704 px canvas. The camera's exponential eases
      // never stop in float64 (steps of 1e-10 for ever), so without it a settled view was never "the same".
      var MTOL = 2e-5, C = new Float64Array(8192), A = new Float64Array(8192), n = 0, lastN = -1, diff = false, lastDraw = 0, props = renderer.properties, curO = null,
        DBG = Q2.get("perfskipdbg") === "1" ? (PF.p2.why = []) : null;
      var grow = function(){ var c2 = new Float64Array(C.length*2); c2.set(C); C = c2; var a2 = new Float64Array(A.length*2); a2.set(A); A = a2; diff = true; };
      var why = function(v){ DBG.push(n + " " + (curO ? curO.type + ":" + (curO.name || "") + "#" + curO.id + (curO.material && curO.material.type ? "/" + curO.material.type : "") : "head") + " " + A[n] + " -> " + v); };
      var put = function(v){ v = Math.fround(v); if(n >= C.length) grow(); if(!diff && A[n] !== v){ diff = true; if(DBG) why(v); } C[n++] = v; };
      var putM = function(m){ var e = m.elements; if(n + 16 > C.length) grow();
        for(var i=0;i<16;i++){ var v = e[i]; if(!diff && !(Math.abs(A[n] - v) <= MTOL)){ diff = true; if(DBG) why(v); } C[n++] = v; } };
      var putC = function(c){ if(c){ put(c.r); put(c.g); put(c.b); } else put(-1); };
      var putT = function(t){ if(!t){ put(-1); return; } put(t.id); put(t.version); put(t.offset.x); put(t.offset.y); put(t.repeat.x); put(t.repeat.y); put(t.rotation); };
      var putU = function(u){
        if(!u) return;
        for(var k in u){ var v = u[k] && u[k].value;
          if(typeof v === "number") put(v); else if(typeof v === "boolean") put(v ? 1 : 0);
          else if(v && typeof v === "object"){ if(v.isColor) putC(v); else if(v.isVector2){ put(v.x); put(v.y); } else if(v.isVector3){ put(v.x); put(v.y); put(v.z); } else if(v.isVector4 || v.isQuaternion){ put(v.x); put(v.y); put(v.z); put(v.w); }
            else if(v.isMatrix4 || v.isMatrix3){ var e = v.elements; for(var j=0;j<e.length;j++) put(e[j]); } else if(v.isTexture) putT(v); } }
      };
      var putMat = function(m){
        if(!m){ put(-1); return; }
        put(m.id); put(m.version); put(m.opacity); put(m.visible ? 1 : 0); put(m.transparent ? 1 : 0); put(m.side);
        putC(m.color); putC(m.emissive); if(m.emissiveIntensity != null) put(m.emissiveIntensity); if(m.rotation != null) put(m.rotation); if(m.size != null) put(m.size);
        putT(m.map); if(m.alphaMap) putT(m.alphaMap); if(m.emissiveMap) putT(m.emissiveMap);
        var p = props.get(m); putU(m.uniforms); if(p && p.uniforms !== m.uniforms) putU(p.uniforms);
      };
      var visit = function(o){
        curO = o; put(o.id); putM(o.matrixWorld); put(o.renderOrder); put(o.layers.mask); put(o.castShadow ? 1 : 0); put(o.receiveShadow ? 1 : 0); put(o.frustumCulled ? 1 : 0);
        if(o.isLight){ putC(o.color); put(o.intensity); if(o.groundColor) putC(o.groundColor); if(o.target) putM(o.target.matrixWorld); if(o.shadow){ put(o.shadow.mapSize.x); put(o.shadow.radius); put(o.shadow.bias); putM(o.shadow.camera.projectionMatrix); } }
        var g = o.geometry;
        if(g){ put(g.id); put(g.drawRange.start); put(g.drawRange.count); if(g.instanceCount !== undefined) put(g.instanceCount === Infinity ? -2 : g.instanceCount); if(g.index) put(g.index.version); for(var a in g.attributes) put(g.attributes[a].version); }
        if(o.isInstancedMesh){ put(o.count); put(o.instanceMatrix.version); put(o.instanceColor ? o.instanceColor.version : -1); }
        if(o.material){ if(Array.isArray(o.material)) for(var i=0;i<o.material.length;i++) putMat(o.material[i]); else putMat(o.material); }
      };
      var same = function(){
        n = 0; diff = false; curO = null; if(DBG && DBG.length > 400) DBG.splice(0, 200);
        var cv = renderer.domElement; put(cv.width); put(cv.height); put(renderer.getPixelRatio()); put(renderer.getClearAlpha()); put(renderer.toneMappingExposure);
        scene.updateMatrixWorld(); if(!camera.parent) camera.updateMatrixWorld();
        putM(camera.matrixWorld); putM(camera.projectionMatrix); put(camera.layers.mask);
        if(scene.fog){ putC(scene.fog.color); put(scene.fog.near); put(scene.fog.far); }
        scene.traverseVisible(visit);
        if(n !== lastN) diff = true;
        return !diff;
      };
      var rs0 = renderer.render;
      renderer.render = function(s, c){
        if(s === scene && c === camera && !fxaa){
          var now = performance.now(), sm = same();
          if(sm && !renderer.shadowMap.needsUpdate && now - lastDraw < 1000){ PF.p2.skip++; PF.p2.skipped = true; return; }
          if(sm) PF.p2.forced++;
          A.set(C.subarray(0, n)); lastN = n;   // this frame is the reference now
          lastDraw = now; PF.p2.drawn++;
        }
        PF.p2.skipped = false;
        return rs0.apply(this, arguments);
      };
    }
  })();
  // ---- end main/perf2.js
