  // ---- main/perf.js (perf pass 14/11/2026, Owner: "từ màn 1 hình 3D bị lag, giật lung tung"). Appended inside main() after audio-el,
  // so it wraps the final pbTick / camera. Measurements and before / after numbers: games/blast/PERF-STATUS.md.
  // P1 prebuild only while the player is idle. pbTick() prebuilds the NEXT level while this one is being planned: newWorld + buildBodies
  //    (one slice), linkAll (one slice), then 60 + 10*L.f presettle steps of a world whose bodies are ALL awake (170-200 steps for
  //    L2-L5), at least one step per frame. That is most of the main-thread time while planning L1-L5 and it lands under the finger
  //    during a drag / pinch (single steps up to 400-600 ms unthrottled on the test VM: L2, L5, L21, L23, L25, L28...).
  //    Now, in a level, a slice runs only in planning after 2.5 s without input and with the camera at rest; never in the countdown
  //    or the "done" phase (coins and debris still moving). Home and the result card prebuild as before (Home is a 2D plate: no 3D
  //    frame to spoil). A level started before its prebuild finished presettles the rest under the drop-in, as a cold start does.
  //    The prebuilt world is the same step for step (the slices only move in time), so results are unchanged (R-11).
  // P2 pixel ratio cap 2 (was native up to 3: an iPhone 12 drew 1170x2532 with MSAA, 2.25x the pixels of 2x, every frame). 2 is already
  //    the governor's floor on a >= 2x screen, so the picture is the one a busy phone got anyway, and the 3 <-> 2 flip (a canvas
  //    re-allocation mid-level) is gone. ?pr=3 = the old cap.
  // P3 camera clearance without pops: the near-zoom limit (v14 clearD, 1 m steps) is applied to the zoom as a fast ease instead of a
  //    jump, so a vertical pan along a hero whose width changes no longer snaps the camera back by a metre at a time. Off: ?perfcam=0.
  // P2b / P4 / P5 / P6 (14/11, Owner D-blast-PERF budget): see the blocks below.
  // ?perf=0 = everything here off.
  (function(){
    var Qp = new URLSearchParams(location.search), OFF = Qp.get("perf") === "0";
    var PF = window.__blastPerf = { on:!OFF, pbSkip:0, pbRun:0, pr:null, cam:false };
    if(OFF) return;
    // ---- P1
    var lastIn = -1e9, down = 0, camP = new THREE.Vector3(1e9, 0, 0), camQ = new THREE.Quaternion(), still = 0;
    var mark = function(){ lastIn = performance.now(); };
    ["pointerdown", "touchstart"].forEach(function(t){ window.addEventListener(t, function(){ down++; mark(); }, { capture:true, passive:true }); });
    ["pointerup", "pointercancel", "touchend", "touchcancel"].forEach(function(t){ window.addEventListener(t, function(){ down = Math.max(0, down - 1); mark(); }, { capture:true, passive:true }); });
    ["pointermove", "touchmove", "wheel", "keydown"].forEach(function(t){ window.addEventListener(t, function(e){ if(t !== "pointermove" || down || e.buttons) mark(); }, { capture:true, passive:true }); });
    var IDLE_MS = +(Qp.get("pbidle") || 2500);
    var pbT0 = pbTick;
    pbTick = function(){
      // camera at rest = under 5 cm / ~0.5 deg since the last frame (updateCamera has already run this frame); the slow idle sway of
      // non-monument levels (about 1 cm a frame) counts as at rest, a drag, pinch, reset or push-in does not
      var moved = camP.distanceToSquared(camera.position) > 0.0025 || Math.abs(camQ.dot(camera.quaternion)) < 0.99999;
      camP.copy(camera.position); camQ.copy(camera.quaternion); still = moved ? 0 : still + 1;
      if(screen === "game" && (phase === "count" || phase === "done" || phase === "plan" && (down > 0 || performance.now() - lastIn < IDLE_MS || still < 10))){ PF.pbSkip++; return; }
      PF.pbRun++; return pbT0.apply(this, arguments);
    };
    // ---- P2
    var cap = parseFloat(Qp.get("pr")) || 2;
    if(PR_MAX > cap){ PR_MAX = cap; PR_MIN = Math.min(PR_MIN, PR_MAX); setPR(PR_MAX); }
    // the 2048 sun shadow map was the "PR 3 + MSAA" tier: with the cap the phone is on the 2x tier, 1024 (4x fewer depth pixels per update)
    if(PR_MAX < 3 && sun.shadow.mapSize.x > 1024){ sun.shadow.mapSize.set(1024, 1024); if(sun.shadow.map){ sun.shadow.map.dispose(); sun.shadow.map = null; } shadowDirty = true; }
    PF.pr = { max:PR_MAX, min:PR_MIN, cur:pixRatio, dpr:DPR, shadow:sun.shadow.mapSize.x };
    // ---- P4 shadow pass on the 44-triangle chamfer box. Members (156 tris, ROUND_SEG 3) and debris (92 tris) cast through ROUND_DEPTH,
    // which insets the chamfer in the vertex shader; chamfGeo carries the same "chamf" attribute, so the depth silhouette is the same box
    // with a straight 9 cm chamfer instead of a 3-segment round (sub-texel in a 1024 map over the lot). The colour pass is untouched.
    // ---- P6 colour-pass LOD by the on-screen width of the 9 cm round at the camera target (device px): members keep the 156-tri
    // 3-segment round from 4 px up, 92 tris (2-segment round = the debris geometry) from 1.5 to 4 px, the 44-tri chamfer box (chamfGeo,
    // the engine's own low tier) under 1.5 px; debris 92 -> 44 under 1.5 px. ?perflod=0 = off, ?perflodd=<px> / ?perflodd2=<px> move the steps.
    var LOD = Qp.get("perflod") !== "0" && typeof chamfGeo !== "undefined" && chamfGeo && !!chamfGeo.attributes.chamf, LOD_D = +(Qp.get("perflodd") || 4), LOD_D2 = +(Qp.get("perflodd2") || 1.5), lodFar = false;
    var sw = [];
    var smr0 = renderer.shadowMap.render;
    if(typeof chamfGeo !== "undefined" && chamfGeo && chamfGeo.attributes.chamf){
      renderer.shadowMap.render = function(){
        sw.length = 0;
        scene.traverseVisible(function(o){ if(o.isMesh && o.castShadow && o.customDepthMaterial === ROUND_DEPTH && o.geometry !== chamfGeo && o.geometry.attributes.chamf){ sw.push(o, o.geometry); o.geometry = chamfGeo; } });
        try{ return smr0.apply(this, arguments); } finally { for(var i=0;i<sw.length;i+=2) sw[i].geometry = sw[i + 1]; PF.shSwap = sw.length/2; sw.length = 0; }
      };
    }
    // ---- P5 during the blast / collapse the shadow map is redrawn every other frame (it was every frame anything moved): the
    // shadow trails the body by one frame at most; plan / Home are unchanged (static map, redrawn only when something moves).
    var r0 = renderer.render, shN = 0, CAD = Qp.get("perfsh") === "0" ? 1 : 2;
    renderer.render = function(s, c){
      if(s === scene){
        if(LOD){ var cd = camera.position.distanceTo(focus), bpx = CHAMFER*VH*pixRatio/(2*cd*Math.tan(camera.fov*Math.PI/360));   // the round's width in device px at the target
          lodFar = bpx < LOD_D; PF.lodFar = lodFar; PF.camD = cd; PF.bevelPx = bpx;
          // members: 3-segment round near, 2-segment round (debris geometry) past LOD_D, the 44-tri chamfer box (the old low tier) past LOD_D2;
          // debris (fragMesh) drops to the chamfer box past LOD_D2 as well. Only meshes built on boxGeo / fragMesh are touched.
          var want = bpx < LOD_D2 ? chamfGeo : lodFar ? fragGeo : boxGeo;
          scene.traverse(function(o){ if(!o.isMesh) return; if(o.geometry === boxGeo && !o.userData.pfM) o.userData.pfM = 1; if(o.userData.pfM && o.geometry !== want) o.geometry = want; });
          var fw = bpx < LOD_D2 ? chamfGeo : fragGeo; if(fragMesh.geometry !== fw) fragMesh.geometry = fw; }
        if(CAD > 1 && renderer.shadowMap.needsUpdate && (phase === "boom" || phase === "settle") && (shN++ % CAD)){ renderer.shadowMap.needsUpdate = false; shadowDirty = true; PF.shSkip = (PF.shSkip || 0) + 1; }
      }
      return r0.apply(this, arguments);
    };
    // ---- P3: v14 sets zMin from clearD() each planning frame and clamps zoomT / zoomK to it at once. Ease zoomK up to a raised limit
    // (time constant 0.12 s) instead: the clearance pad is 3-6 m, so the camera never reaches a wall while it eases.
    if(Qp.get("perfcam") !== "0" && typeof clampZoom === "function"){
      PF.cam = true;
      var cz0 = clampZoom, ucP = updateCamera, easing = false, kPrev = null;
      clampZoom = function(k){ if(easing && kPrev != null && k === zoomK){ var lim = cz0(k); return lim > kPrev ? Math.min(lim, kPrev + (lim - kPrev)*Math.min(1, ucRdt/0.12)) : lim; } return cz0(k); };
      var ucRdt = 0;
      updateCamera = function(rdt){ ucRdt = rdt; kPrev = zoomK; easing = screen === "game" && (phase === "plan" || phase === "count"); try{ return ucP.apply(this, arguments); } finally { easing = false; } };
    }
  })();
  // ---- end main/perf.js
