  // ---- main/frame.js (hero opening framing, 15/11/2026, Owner on TestFlight: "the camera angle is currently too far. When you enter a
  // level, the camera should automatically zoom so the MAIN (hero) building is in the centre, so the player sees it at its best.")
  // Appended inside main() after perf (build step "frame"), so it wraps the final startLevel / updateCamera / detonateAll / resetFraming.
  // Camera only: no member, bond, rule or level number is touched (R-11 unaffected; the test harness / bots (manual) never run it).
  //
  // F1 OPENING POSE. At level start the hero (L.hero parts, members' world corners + their drawn crowns) is framed in the PLAYABLE area
  //    (between topH() = the top HUD row and botH() = the bottom tray / BLAST; both already follow the safe areas of main/ui2.js §H):
  //    it fills FILL_H of that area's height or FILL_W of the screen width, whichever binds first (tall towers by height, wide halls by
  //    width); its projected centre sits on the playable area's centre (a view offset, like Q1's). 3/4 view: the level's own face, turned
  //    YAW_MIN-YAW_MAX off it (same side the level opens on), elevation PITCH so roof and ground floor both read. NOHINT: the WHOLE hero is
  //    framed, the look-at is its centre, never a leg / foot / solution; pan stays 0.
  // F2 EASE-IN. From a slightly wider shot (x WIDE) to the final framing in DUR s, ease-out cubic; skipped with Reduce motion; any touch
  //    ends it where it is. It replaces the engine's 1.25x drop-in pull-back on these levels (camDist starts at dist).
  // F3 HAND-OVER. The framing is expressed as offsets on the existing camera (look-at x/z, yaw, pitch, view offset) with a weight W:
  //    W = 1 from the wide start of the ease inward, falls to 0 as the player pinches out to max(whole-lot zoom 1, start + 0.25), and BLAST / camera reset /
  //    level end drop it to 0 (eased): the collapse is framed exactly as before. Zoom and clearance are the existing ones: the opening zoom
  //    goes through zoomT, so v14's clearance clamp (camera never inside a building) and perf P3's clearance ease still apply.
  //    Pinch, vertical pan and turn work as before on top of it.
  // ?frame=0 = the old opening (whole lot); ?hints=1 too. Numbers per level: games/blast/FRAME-STATUS.md. Test API: window.__blast.frame.
  (function(){
    var Qf = new URLSearchParams(location.search), OFF = Qf.get("frame") === "0" || Qf.get("hints") === "1";   // ?hints=1 (old STD-v2 aids, comparison only) keeps the old opening too
    var CF = { fillH:+(Qf.get("framefh") || 0.72), fillW:+(Qf.get("framefw") || 0.68), pitch:0.26, yawMin:0.35, yawMax:0.50, dur:1.0, wide:1.22, tilt:0.17 };
    // per-level overrides (level number -> fields of CF), only where the generic rule looks bad (FRAME-STATUS.md §3)
    // 25: GD-33 (19/11/2026, tester round): the opening faces three of the four dark corners and both brick towers' bases; that yaw (4.0,
    // level data L.yaw) is off the 3/4-view band of the generic rule (it would clamp to 4.21, which hides two corners)
    // 3: GD-38 (20/11/2026): the brick lesson needs a brick stack of the row; at the generic framing the row's bricks (D, E) were off the
    // left edge. Hero at 50% of the height and the view turned 0.3 rad toward the row: B, C and the brick stack D are in sight
    var OVR = { 3:{ fillH:0.5, yaw:0.85 }, 25:{ yaw:4.0 } };
    // F4 HARD OPENING (21/11/2026, tester round UX-65 / GD-54: the hard levels H1-H5 (L.hard7) opened on a close-up of the hero, with
    // the hall / the blue buildings / the end houses off screen). On a hard level the WHOLE lot that counts (every member but the ground
    // slab and props: hero, side buildings, blue buildings) is fitted into the play rect: 16 px from each side, FILL_HH of the height
    // between the HUD and the tray, at the level's own yaw (the near-frontal yaw its designer set so the axis and the face to hit read),
    // zoomed out past the whole-lot zoom 1 if it has to be (up to zMax). ?framehard=0 = the hero framing as before.
    var HARD = Qf.get("framehard") !== "0", FILL_HH = 0.9, SIDE_PX = 16;
    var isHard = function(){ return HARD && !!(L && L.hard7); };
    var FR = { on:!OFF, cf:CF, S:null, W:0, n:0 };
    var API = window.__blast.frame = { on:function(){ return FR.on; }, cfg:function(){ return CF; }, state:function(){ var S = FR.S; return S ? { lv:S.lv, live:S.live, W:+FR.W.toFixed(3), zOpen:+S.zOpen.toFixed(4), zFrom:+S.zFrom.toFixed(4), t:+S.t.toFixed(2), easing:S.t < S.dur, hard:!!S.hard, yawOpen:+S.yawOpen.toFixed(3), yawD:+S.yawD.toFixed(3), sx:Math.round(S.sx), sy:Math.round(S.sy), fitW:S.fitW, fitH:S.fitH, bind:S.bind } : null; }, measure:null };
    var TILT = CF.tilt;   // v14-monument.js updateCamera: the view levels out by TILT x close when zoomed in (pitch - TILT x tiltK)
    var _pc = new THREE.PerspectiveCamera(GAME_FOV, 1, 0.1, 4000), _v = new THREE.Vector3(), _q = new THREE.Quaternion(), _h = new THREE.Vector3();
    var heroIds = function(){ return String((L && L.hero) || "A").split(","); };
    // the hero's world corners (members at rest + their drawn crowns / dress boxes) and its axis (members' x/z box centre, as v14 GEO)
    var heroPts = function(lot){ var ids = heroIds(), P = [], x0 = 1e9, x1 = -1e9, z0 = 1e9, z1 = -1e9, c, k;   // lot: every member that counts (F4), not only the hero
      blocks.forEach(function(b){ if(b.anchor || b.prop || b.bonus || (!lot && (b.keep || ids.indexOf(b.bid) < 0))) return; var p = b.P || b.spawn, q = b.Q, h = b.half;
        for(c=0;c<8;c++){ _v.set(c&1 ? h[0] : -h[0], c&2 ? h[1] : -h[1], c&4 ? h[2] : -h[2]); if(q) _v.applyQuaternion(q); _v.add(p); if(_v.y < 0) _v.y = 0; P.push(_v.x, _v.y, _v.z); }
        var s = b.spawn || p; x0 = Math.min(x0, s.x - h[0]); x1 = Math.max(x1, s.x + h[0]); z0 = Math.min(z0, s.z - h[2]); z1 = Math.max(z1, s.z + h[2]);
        (b.kd || []).forEach(function(d){ if(!d || !d.o || !d.s || d.hide || d.mark) return; for(k=0;k<8;k++){ var x = p.x + d.o.x + (k&1 ? 0.5 : -0.5)*d.s.x, y = p.y + d.o.y + (k&2 ? 0.5 : -0.5)*d.s.y, z = p.z + d.o.z + (k&4 ? 0.5 : -0.5)*d.s.z;
          if(isFinite(x + y + z)) P.push(x, Math.max(0, y), z); } }); });
      return P.length ? { pts:new Float32Array(P), hx:(x0 + x1)/2, hz:(z0 + z1)/2 } : null; };
    // NDC bounds of the points from a probe camera at (yaw, pitch, distance d) looking at (cx, fy, cz)
    var ndc = function(P, yw, pt, d, cx, fy, cz){ _pc.fov = GAME_FOV; _pc.aspect = VW/VH; _pc.near = camera.near; _pc.far = camera.far; _pc.clearViewOffset(); _pc.updateProjectionMatrix();
      var cp = Math.cos(pt); _pc.position.set(cx + d*cp*Math.sin(yw), fy + d*Math.sin(pt), cz + d*cp*Math.cos(yw)); _pc.lookAt(cx, fy, cz); _pc.updateMatrixWorld();
      var x0 = 9, x1 = -9, y0 = 9, y1 = -9;
      for(var i=0;i<P.length;i+=3){ _v.set(P[i], P[i+1], P[i+2]).project(_pc); if(_v.x < x0) x0 = _v.x; if(_v.x > x1) x1 = _v.x; if(_v.y < y0) y0 = _v.y; if(_v.y > y1) y1 = _v.y; }
      return { x0:x0, x1:x1, y0:y0, y1:y1 }; };
    var area = function(){ var t = topH(), b = botH(); return { t:t, b:b, h:Math.max(60, VH - t - b), cy:t + Math.max(60, VH - t - b)/2 }; };
    // F1: the distance that frames the hero (fill bound first) and the view offset that centres it, for the current yaw
    var solve = function(S, fit){ var A = area(), yw = baseYaw + S.yawD, d = fit ? dist : S.D, b, k, it;
      if(fit){ for(it=0; it<12; it++){ b = ndc(S.pts, yw, S.pitch, d, S.hx, focusY, S.hz);
          var fh = (b.y1 - b.y0)/2*VH/A.h, fw = (b.x1 - b.x0)/2; k = Math.max(fh/S.fillH, fw/S.fillW); d = Math.max(6, d*k); if(Math.abs(k - 1) < 0.002) break; }
        S.D = d; }
      b = ndc(S.pts, yw, S.pitch, d, S.hx, focusY, S.hz);
      S.fitH = +((b.y1 - b.y0)/2*VH/A.h).toFixed(3); S.fitW = +((b.x1 - b.x0)/2).toFixed(3); S.bind = S.fitH/S.fillH >= S.fitW/S.fillW ? "height" : "width";
      S.sxT = (1 + (b.x0 + b.x1)/2)/2*VW - VW/2; S.syT = (1 - (b.y0 + b.y1)/2)/2*VH - A.cy;
      S.key = [VW, VH, A.t, A.b, yw.toFixed(3), focusY.toFixed(2)].join(); };
    var openLevel = function(){ FR.S = null; FR.W = 0;
      if(manual || screen !== "game" || !L || !blocks.length) return;
      var hard = isHard(), H = heroPts(hard); if(!H) return;
      var o = hard ? { yaw:baseYaw, fillH:FILL_HH, fillW:Math.max(0.5, (VW - 2*SIDE_PX)/VW) } : OVR[levelIdx + 1] || {}, f = Math.round(baseYaw/(Math.PI/2))*(Math.PI/2), off = baseYaw - f, sg = off < 0 ? -1 : 1;
      var yawOpen = o.yaw != null ? o.yaw : f + sg*Math.max(o.yawMin || CF.yawMin, Math.min(o.yawMax || CF.yawMax, Math.abs(off)));
      var S = { lv:levelIdx + 1, hard:hard, pts:H.pts, hx:H.hx, hz:H.hz, yawD:yawOpen - baseYaw, yawOpen:yawOpen, pitch:o.pitch || CF.pitch, fillH:o.fillH || CF.fillH, fillW:o.fillW || CF.fillW,
        live:true, t:0, dur:REDUCED ? 0 : (o.dur || CF.dur), D:dist, sx:0, sy:0, sxSp:{v:0}, sySp:{v:0} };
      solve(S, true);
      S.zOpen = Math.min(hard ? Math.max(1, zMax) : 1, S.D/dist); S.zFrom = REDUCED ? S.zOpen : hard ? Math.max(S.zOpen, Math.min(zMax, S.zOpen*CF.wide)) : S.zOpen*CF.wide; S.zEnd = Math.max(1, S.zFrom + 0.25);
      S.closeO = window.__blast.m14 && window.__blast.m14.flags().cam ? Math.max(0, Math.min(1, (1 - S.zOpen)/0.45)) : 0;
      S.sx = S.sxT; S.sy = S.syT;
      FR.S = S; FR.W = 1; FR.n++;
      zoomT = zoomK = S.zFrom; zoomSp.v = 0; camDist = dist; distSp.v = 0; yaw = yawOpen; yawSp.v = 0; };
    if(!OFF){   // ?frame=0: nothing below runs (the measure API stays, for before / after shots)
    var sl0 = startLevel;
    startLevel = function(){ var r = sl0.apply(this, arguments); try{ openLevel(); }catch(e){ FR.S = null; console.error("main/frame.js", e); } return r; };
    var stop = function(){ if(FR.S) FR.S.live = false; };
    var da0 = detonateAll; detonateAll = function(){ stop(); return da0.apply(this, arguments); };   // BLAST: back to the whole-lot framing (v14 resets zoom / pan)
    var rf0 = resetFraming; resetFraming = function(){ stop(); return rf0.apply(this, arguments); };
    renderer.domElement.addEventListener("pointerdown", function(){ var S = FR.S; if(S && S.t < S.dur){ S.t = S.dur; zoomT = clampZoom(zoomK); } }, { capture:true, passive:true });   // a touch ends the ease where it is
    var myX = null, myY = null, inX = 0, inY = 0, wSp = { v:0 };
    var uc0 = updateCamera;
    updateCamera = function(rdt){
      var S = FR.S, game = screen === "game" && phase !== "title";
      if(!S || !game){ if(myX !== null && camera.view){ camera.setViewOffset(VW, VH, inX, inY, VW, VH); } myX = myY = null; FR.W = 0; return uc0(rdt); }
      // F2: the ease (game time of the render loop, capped like the rest of the camera)
      if(S.live && S.t < S.dur){ S.t = Math.min(S.dur, S.t + rdt); var e = 1 - Math.pow(1 - S.t/S.dur, 3); zoomT = zoomK = S.zFrom + (S.zOpen - S.zFrom)*e; zoomSp.v = 0; }
      // F3: the weight (state x zoom: the whole-lot zoom 1 = no framing)
      var wz = Math.max(0, Math.min(1, (S.zEnd - zoomK)/(S.zEnd - Math.max(S.zFrom, S.zOpen + 0.05)))), wt = S.live && (phase === "build" || phase === "plan" || phase === "count") ? wz : 0;
      FR.W = wt >= FR.W || REDUCED ? wt : damp(FR.W, wt, wSp, 0.3, rdt); if(FR.W < 1e-3 && wt === 0) FR.W = 0;
      var W = FR.W;
      if(W > 0 && S.key !== [VW, VH, topH(), botH(), (baseYaw + S.yawD).toFixed(3), focusY.toFixed(2)].join()){   // resize / HUD / turn: re-centre (same distance once the ease is over)
        if(S.live && S.t < S.dur){ solve(S, true); S.zOpen = Math.min(S.hard ? Math.max(1, zMax) : 1, S.D/dist); S.closeO = window.__blast.m14 && window.__blast.m14.flags().cam ? Math.max(0, Math.min(1, (1 - S.zOpen)/0.45)) : 0; } else solve(S, false); }
      S.sx = damp(S.sx, S.sxT, S.sxSp, 0.25, rdt); S.sy = damp(S.sy, S.syT, S.sySp, 0.25, rdt);
      var fx = focus.x, fz = focus.z, by = baseYaw, pt = pitch;
      if(W > 0){ var close = Math.max(0, Math.min(1, (1 - zoomK)/0.45));
        focus.x = fx + (S.hx - fx)*W; focus.z = fz + (S.hz - fz)*W; baseYaw = by + S.yawD*W;
        pitch = pt + (S.pitch + TILT*Math.min(close, S.closeO) - pt)*W; }
      try{ uc0(rdt); } finally { focus.x = fx; focus.z = fz; baseYaw = by; pitch = pt; }
      // view offset: the inner camera sets its own (Q1 shift + shake) only when it changes; ours is added on top of it
      var v = camera.view; if(!v) return;
      if(myX === null || v.offsetX !== myX || v.offsetY !== myY){ inX = v.offsetX; inY = v.offsetY; }
      if(W > 0){ myX = inX + W*S.sx; myY = inY + W*(S.sy - viewShift); camera.setViewOffset(VW, VH, myX, myY, VW, VH); }
      else if(myX !== null){ camera.setViewOffset(VW, VH, inX, inY, VW, VH); myX = myY = null; }
    };
    }
    // test API: the hero on screen now (fractions of the playable area), the camera's clearance state
    API.measure = function(lot){ var H = heroPts(lot == null ? isHard() : !!lot); if(!H) return null; camera.updateMatrixWorld(); var A = area(), x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9, P = H.pts;
      for(var i=0;i<P.length;i+=3){ _v.set(P[i], P[i+1], P[i+2]).project(camera); var sx = (_v.x + 1)/2*VW, sy = (1 - _v.y)/2*VH; if(sx < x0) x0 = sx; if(sx > x1) x1 = sx; if(sy < y0) y0 = sy; if(sy > y1) y1 = sy; }
      var m = window.__blast.m14, cam = m && m.cam ? m.cam() : {}, dir = camera.getWorldDirection(_h);
      return { lv:levelIdx + 1, VW:VW, VH:VH, top:Math.round(A.t), bot:Math.round(A.b), playH:Math.round(A.h), box:[Math.round(x0), Math.round(y0), Math.round(x1), Math.round(y1)],
        fillH:+((y1 - y0)/A.h).toFixed(3), fillW:+((x1 - x0)/VW).toFixed(3), dx:+(((x0 + x1)/2 - VW/2)/VW).toFixed(3), dy:+(((y0 + y1)/2 - A.cy)/A.h).toFixed(3),
        inPlay:x0 >= -1 && x1 <= VW + 1 && y0 >= A.t - 1 && y1 <= VH - A.b + 1, inside:m && m.inside ? m.inside() : null, zoomT:+zoomT.toFixed(4), zoomK:+zoomK.toFixed(4), pan:cam.panT,
        pitchDeg:+(Math.asin(-dir.y)*180/Math.PI).toFixed(1), yawDeg:+(yaw*180/Math.PI).toFixed(1), W:+FR.W.toFixed(3), D:+(camDist*zoomK).toFixed(1) }; };
  })();
  // ---- end main/frame.js
