  // ---- main/fps.js (PERF-1124, Khai 24/11 "TestFlight build 9 giật, không mượt"): the hidden fps meter + the per-frame probe.
  // Appended LAST inside main() (after rs-look), so it wraps the final animate / physicsFrame / renderer.render.
  // OFF by default: nothing is drawn and no wrapper does any work until it is turned on.
  //   ?fps=1            meter on (top centre: fps over 1 s, worst frame, ms of render and physics a frame)
  //   5 quick taps on the Level pill (within 3 s) toggles it; the choice is kept on this device (localStorage "cbFps")
  //   ?fps=2            as 1, and gl.finish() after each render, so "R" includes the GPU time (slows the frame: measuring only)
  // window.__blastPerf.meter: on() / off() / rec(n) (keep the last n frames) / frames() / sum() for the headless profiler.
  (function(){
    var Qf = new URLSearchParams(location.search), PFm = window.__blastPerf || (window.__blastPerf = {});
    var LS = function(v){ try{ if(v === undefined) return localStorage.getItem("cbFps"); if(v) localStorage.setItem("cbFps", "1"); else localStorage.removeItem("cbFps"); }catch(e){ return null; } };
    var ON = false, FIN = Qf.get("fps") === "2", REC = 0, rec = [], el = null;
    var cur = { js:0, phys:0, steps:0, rend:0, sh:0, shC:0, shT:0, calls:0, tris:0, pb:0, skip:0, solver:0 };
    var hist = new Float64Array(240), hN = 0, hI = 0, physAcc = 0, rendAcc = 0, accN = 0, lastT = 0, showT = 0;
    var mem = performance.memory || null;
    // ---- wrappers: one branch each while the meter is off
    var an0 = animate;
    animate = function(){
      if(!ON) return an0.apply(this, arguments);
      var t0 = performance.now(), h0 = mem ? mem.usedJSHeapSize : 0;
      cur.phys = 0; cur.pb = 0; cur.steps = 0; cur.rend = 0; cur.sh = 0; cur.shC = 0; cur.shT = 0; cur.calls = 0; cur.tris = 0; cur.skip = 0; cur.solver = 0;
      try{ return an0.apply(this, arguments); } finally { frameDone(t0, h0); }
    };
    var pf0 = physicsFrame;
    physicsFrame = function(){
      if(!ON) return pf0.apply(this, arguments);
      var t0 = performance.now(), s0 = stepCount;
      try{ return pf0.apply(this, arguments); } finally { cur.phys += performance.now() - t0; cur.steps += stepCount - s0; }
    };
    // the Rapier solver alone (world.step), to split "physics" into the solver and the game's per-step JS (pose reads, bonds, fx)
    var ws0 = RAPIER.World.prototype.step;
    RAPIER.World.prototype.step = function(){
      if(!ON) return ws0.apply(this, arguments);
      var t0 = performance.now();
      try{ return ws0.apply(this, arguments); } finally { cur.solver += performance.now() - t0; }
    };
    var pb0 = pbTick;
    pbTick = function(){
      if(!ON) return pb0.apply(this, arguments);
      var t0 = performance.now();
      try{ return pb0.apply(this, arguments); } finally { cur.pb += performance.now() - t0; }
    };
    var rr0 = renderer.render;
    renderer.render = function(){
      if(!ON) return rr0.apply(this, arguments);
      if(FIN) _gl.finish();
      var t0 = performance.now();
      try{ return rr0.apply(this, arguments); } finally {
        if(FIN) _gl.finish();
        cur.rend += performance.now() - t0;
        if(PFm.p2 && PFm.p2.skipped) cur.skip++; else { cur.calls += renderer.info.render.calls; cur.tris += renderer.info.render.triangles; } }
    };
    var smr = renderer.shadowMap.render;
    renderer.shadowMap.render = function(){
      if(!ON) return smr.apply(this, arguments);
      var c0 = renderer.info.render.calls, t0 = renderer.info.render.triangles, w0 = performance.now(), will = renderer.shadowMap.needsUpdate;
      if(FIN && will) _gl.finish();
      try{ return smr.apply(this, arguments); } finally {
        if(FIN && will) _gl.finish();
        if(will){ cur.sh += performance.now() - w0; cur.shC += renderer.info.render.calls - c0; cur.shT += renderer.info.render.triangles - t0; } }
    };
    function awake(){ var a = 0, i; for(i=0;i<blocks.length;i++){ var b = blocks[i]; if(b.rb && !b.anchor && !b.dead && !b.sleeping) a++; } for(i=0;i<frags.length;i++) if(!frags[i].sleeping) a++; return a; }
    function frameDone(t0, h0){
      var now = performance.now(), iv = lastT ? t0 - lastT : 16.7; lastT = t0;
      var js = now - t0;
      hist[hI] = iv; hI = (hI + 1) % hist.length; if(hN < hist.length) hN++;
      physAcc += cur.phys; rendAcc += cur.rend; accN++;
      if(REC){
        rec.push({ t:t0, iv:iv, js:js, phys:cur.phys, solver:cur.solver, pb:cur.pb, steps:cur.steps, rend:cur.rend, sh:cur.sh, shC:cur.shC, shT:cur.shT, calls:cur.calls, tris:cur.tris, skip:cur.skip,
          heap:mem ? mem.usedJSHeapSize - h0 : 0, heapAbs:mem ? mem.usedJSHeapSize : 0, awake:REC > 0 && (frameNo % 5 === 0) ? awake() : -1,
          frags:frags.length, phase:phase, screen:screen, pr:pixRatio, w:renderer.domElement.width, h:renderer.domElement.height });
        if(rec.length > REC) rec.shift();
      }
      if(el && now - showT > 500){ showT = now; draw(now); }
    }
    function draw(now){
      // the last 1 s of frame intervals
      var n = 0, s = 0, worst = 0;
      for(var k=0;k<hN;k++){ var j = (hI - 1 - k + hist.length) % hist.length, v = hist[j]; if(s + v > 1000 && n) break; s += v; n++; if(v > worst) worst = v; }
      var fps = n ? 1000*n/s : 0, pm = accN ? physAcc/accN : 0, rm = accN ? rendAcc/accN : 0; physAcc = rendAcc = 0; accN = 0;
      el.textContent = fps.toFixed(0) + " fps  worst " + worst.toFixed(0) + " ms  R " + rm.toFixed(1) + "  P " + pm.toFixed(1);
      el.style.color = fps >= 55 ? "#7CFF9B" : fps >= 40 ? "#FFE066" : "#FF8A7A";
    }
    function show(on){
      ON = !!on;
      if(ON && !el){
        el = document.createElement("div"); el.id = "fpsMeter";
        el.style.cssText = "position:fixed;left:50%;transform:translateX(-50%);top:calc(2px + env(safe-area-inset-top));z-index:2147483647;pointer-events:none;" +
          "font:600 10px/14px ui-monospace,Menlo,monospace;padding:0 6px;border-radius:7px;background:rgba(0,0,0,.55);color:#7CFF9B;white-space:nowrap";
        el.textContent = "fps …"; document.body.appendChild(el);
      }
      if(el) el.style.display = ON ? "" : "none";
      lastT = 0; hN = 0; hI = 0;
    }
    // 5 quick taps on the Level pill (capture, passive: the pill's own behaviour is untouched)
    var taps = [];
    window.addEventListener("pointerdown", function(e){
      // by position: the pill's label (#lvTxt) is drawn over it as a separate element
      var p = document.getElementById("lvPill"); if(!p) return;
      var q = p.getBoundingClientRect(); if(!q.width || e.clientX < q.left || e.clientX > q.right || e.clientY < q.top || e.clientY > q.bottom) return;
      var t = performance.now(); taps.push(t); while(taps.length && t - taps[0] > 3000) taps.shift();
      if(taps.length >= 5){ taps.length = 0; show(!ON); LS(ON); }
    }, { capture:true, passive:true });
    PFm.meter = {
      on:function(){ show(true); }, off:function(){ show(false); }, isOn:function(){ return ON; },
      rec:function(n){ REC = n || 0; rec = []; }, frames:function(){ return rec.slice(); }, clear:function(){ rec = []; },
      finish:function(v){ FIN = !!v; },
      awake:function(){ var a = 0, f = 0, i; for(i=0;i<blocks.length;i++){ var b = blocks[i]; if(b.rb && !b.anchor && !b.dead && !b.rb.isSleeping()) a++; } for(i=0;i<frags.length;i++) if(!frags[i].rb.isSleeping()) f++; return { blocks:a, frags:f, nFrags:frags.length, nBlocks:blocks.length, bodies:world.bodies.len() }; },
      dev:function(){ return { renderer:renderer, scene:scene, camera:camera, sun:sun, fragMesh:fragMesh, inst:inst }; }
    };
    if(Qf.get("fps") === "1" || Qf.get("fps") === "2" || (Qf.get("fps") !== "0" && LS() === "1")) show(true);
  })();
  // ---- end main/fps.js
