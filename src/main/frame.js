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
    // F5 (22/11/2026, tester round UX-72 / UX-71, polish R22; ?r22=0 = off): (a) BOSS openings keep the hero framing (3/4 yaw, fill) but
    // the projected bounding-box corners of the whole lot (target + protected blue buildings + their dress) must sit 16 px inside both
    // screen sides and inside the play rect: the camera backs off (up to zMax) and the view offset slides until they do (L11 cut its
    // right-hand block at x 387). Hard levels already fit the lot (F4); on both, once the ease is over, the box is read off the live camera
    // for a few frames and the offset / zoom nudged until it holds (the engine's yaw sway turns the view 1-3 degrees off the solved yaw). (b) API.refit(): when planning resumes after a blast that left
    // TNT (or after the "+1 TNT" rescue) the camera eases in 500 ms (cut with Reduce motion) onto what still counts (live target
    // members at their current pose; + the protected buildings on hard / boss levels) with the hard-opening margins (16 px sides,
    // FILL_HH of the play height), keeping the player's current yaw and pitch. Pinch-out / BLAST hand back exactly as F3.
    var R22 = Qf.get("r22") !== "0";
    var isGuard = function(){ return R22 && HARD && !!(L && L.boss) && !isHard(); };
    // F6 CAM-HARD (23/11/2026, Khai: "the hard levels the Mac made have the right camera angle; copy that camera"; L46 opened off-centre
    // from its building, L45 zoomed in and out by itself when turned). On the easy pack (LV7O.isE) and the rebuilt old levels (LV7O.isO),
    // never on a Mac hard level (LV7O.isH) or a boss, the opening is the hard one (F4: the level's own yaw, pitch CF.pitch, the WHOLE lot
    // that counts inside 16 px of each side and FILL_HH of the play height) with two changes: (a) the camera looks at and turns round
    // the MAIN building (the first id of L.hero), which sits in the middle of the screen; the lot is fitted on both sides of it; (b) ONE
    // distance for the four faces: the largest distance any face (with the +-0.06 rad idle sway) needs to hold the lot, so a turn never
    // zooms: the engine's refit() on a turn (dist = fitDist of the new face) keeps the opening dist and zoom while this framing holds.
    // The distance is never below the lot fit, so the camera stays outside every building. ?camhard=0 = as before (F4 on L.hard7).
    var CAMHARD = Qf.get("camhard") !== "0";
    // F7 CAM-ALL (23/11/2026, Khai D-blast-CAMALL: "every current level's camera like the hard levels": front-on first). Measured on the
    //    hard levels (levels-gd/CAM-ALL/CAM-ALL.md): the opening stands at the level's own near-frontal yaw for the whole intro (no
    //    automatic turn; only the +-0.06 rad idle sway), pitch CF.pitch, the whole lot, a CF.dur s ease-out cubic zoom-in from CF.wide x,
    //    input live as soon as the drop-in ends (phase "plan"). F6 now covers EVERY level that is not a Mac hard level: the easy pack and
    //    the rebuilt old levels as before (their own yaw), and the untouched old levels and the bosses too. Those have no near-frontal
    //    level yaw (engine defaults 0.55 / HINT_YAW / L.yaw 0.65-1.15): the camera stands on the NEAREST FACE (baseYaw and defYaw set
    //    to it, so BLAST, the collapse drift, resetFraming and the R22 re-frame all stay on that face, as on a hard level). The OVR /
    //    sflay S6 per-level yaws (L3 GD-38 0.85, L25 GD-33 4.0) give way: the whole lot is in view from the front (CAM-ALL.md).
    //    ?camall=0 = F6 on E / O only, as CAM-HARD 23/11 (and ?camhard=0 = as before both). By default (Lead 23/11, D-blast-PAD; ?cam45=0 = off, as the hard levels measure):
    //    after the zoom-in the view turns from the front to 45 degrees (CF.turnDur s ease-in-out; the one distance covers both).
    var CAMALL = CAMHARD && Qf.get("camall") !== "0", CAM45 = CAMALL && Qf.get("cam45") !== "0";
    // F8 PAD (23/11/2026, Khai D-blast-PAD, CAM-ALL.md §2): on every non-hard level (not a Mac hard level, not a boss: their content
    //    stays) the yellow sand pad is widened by PADK (?padk=, default 1.2; ?pad=0 = off): the lot shader's world-space edge radius
    //    (LA_LOT.r 25 m) is scaled through a uniform, the lawn ring round it (bushes, lamps, Figma trees) and the back road / row
    //    (fence, lamps, trees) are pushed out by the same margin. The camera's look-at / turn pivot is the pad's CENTRE (world 0, 0),
    //    on bosses too when their lot is centred on the pad (<= PIV_TOL m); the one distance holds the whole pad and the lot on all 4
    //    faces and through the 45-degree turn. API.padOut() lists building members standing outside the pad (check-pad.js).
    var PADON = CAMALL && Qf.get("pad") !== "0", PADK = PADON ? Math.max(1, +(Qf.get("padk") || 1.2)) : 1, PIV_TOL = 1.5;
    // F9 CAM-ZOOM (23/11/2026, Khai D-blast-PAD asked only: pivot = pad centre, buildings inside the pad, pad a bit wider; holding the
    //    WHOLE pad on screen put the camera ~2x farther, buildings tiny): the one distance now fits the BUILDINGS (every member that counts,
    //    blue ones included), seen from the pad-centre pivot (held at the middle of the screen across), on all 4 faces + sway + the
    //    45-degree turn. The pad edge may run off the screen. Pivot, pad x1.2, front-on start, zoom-in, turn: as F7 / F8.
    //    ?camfit=pad = the F8 whole-pad framing (49c23ba).
    var FITPAD = Qf.get("camfit") === "pad";
    CF.turnDur = +(Qf.get("turndur") || 1.2);
    var isCH = function(p){ if(!CAMHARD || !HARD) return false; if(p == null) p = levelIdx; var O = window.LV7O, Lv = typeof LEVELS !== "undefined" ? LEVELS[p] : null;
      if(!O || !O.on || !Lv || (O.isH && O.isH(p))) return false; if(CAMALL) return true;
      if(Lv.boss) return false; return !!((O.isE && O.isE(p)) || (O.isO && O.isO(p))); };
    var ownYaw = function(p){ var O = window.LV7O; if(p == null) p = levelIdx; return !!(O && ((O.isE && O.isE(p)) || (O.isO && O.isO(p)))); };   // E / O: the level's own near-frontal yaw
    var FR = { on:!OFF, cf:CF, S:null, W:0, n:0 };
    var API = window.__blast.frame = { on:function(){ return FR.on; }, camFit:function(){ return FITPAD ? "pad" : "lot"; }, camHard:function(p){ return !OFF && isCH(p); }, camAll:function(){ return CAMALL; }, cam45:function(){ return CAM45; }, cfg:function(){ return CF; }, state:function(){ var S = FR.S; return S ? { lv:S.lv, live:S.live, W:+FR.W.toFixed(3), zOpen:+S.zOpen.toFixed(4), zFrom:+S.zFrom.toFixed(4), t:+S.t.toFixed(2), easing:S.t < S.dur, hard:!!S.hard, ch:!!S.ch, all:!!S.all, boss:!!(L && L.boss), piv:!!S.piv, padK:S.padK || 1, turn:+(S.turn || 0).toFixed(3), D:+S.D.toFixed(2), D0:S.D0 ? +S.D0.toFixed(2) : null, frz:FR.frz || 0, yawOpen:+S.yawOpen.toFixed(3), yawD:+S.yawD.toFixed(3), sx:Math.round(S.sx), sy:Math.round(S.sy), fitW:S.fitW, fitH:S.fitH, bind:S.bind, guard:!!S.guard, guardN:S.guardN || 0, refit:!!S.refit, sxT:Math.round(S.sxT), syT:Math.round(S.syT), fixN:S.fixN || 0, settled:!(S.t < S.dur) && Math.abs(S.sx - S.sxT) < 1 && Math.abs(S.sy - S.syT) < 1 && (!(R22 && (S.refit || S.hard || S.gpts)) || (S.fixN || 0) >= 40) } : null; }, measure:null };
    // F10 FIX-1124 (24/11/2026, tester round UX-88 / UX-91 / U-1 / U-12): API.opening() = the level's opening shot is still moving: the
    //    F2 zoom-in, the F7 front -> 45-degree turn, or the engine's yaw still more than 1 degree behind it (it lags the turn). False once
    //    a touch stopped it (pointerdown below), after a blast / refit, off the game screen, and 8 s after the level start at the latest
    //    (never holds a lesson back for good). main/intro.js holds its cards / spotlights / swipe lesson and main/tap2.js the L1 / L2 hand
    //    until it is false. API.holdSway(on): the +-0.06 rad idle sway stops where it is while on (the L1 "Double-tap!" target stays still).
    FR.t0 = 0; FR.hold = null;
    API.opening = function(){ var S = FR.S; if(OFF || !S || !S.live || S.refit || screen !== "game") return false;
      if(performance.now() - FR.t0 > 8000) return false;
      if(S.t < S.dur || (S.turn && !S.turnDone)) return true;
      if(S.ch && FR.W > 0.5){ var sw = 0; try{ sw = ballAim ? 0 : 0.06*Math.sin(swayT*0.35); }catch(e){} if(Math.abs(yaw - (baseYaw + S.yawD*FR.W + sw)) > Math.PI/180) return true; }
      return false; };
    API.holdSway = function(on){ var h = null; try{ h = on ? (FR.hold != null ? FR.hold : swayT) : null; }catch(e){} FR.hold = h; return FR.hold != null; };
    var TILT = CF.tilt;   // v14-monument.js updateCamera: the view levels out by TILT x close when zoomed in (pitch - TILT x tiltK)
    var _pc = new THREE.PerspectiveCamera(GAME_FOV, 1, 0.1, 4000), _v = new THREE.Vector3(), _q = new THREE.Quaternion(), _h = new THREE.Vector3();
    var heroIds = function(){ return String((L && L.hero) || "A").split(","); };
    // the hero's world corners (members at rest + their drawn crowns / dress boxes) and its axis (members' x/z box centre, as v14 GEO)
    var heroPts = function(lot, only){ var ids = only || heroIds(), P = [], x0 = 1e9, x1 = -1e9, z0 = 1e9, z1 = -1e9, c, k;   // lot: every member that counts (F4), not only the hero
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
      if(S.gpts){   // F5 (a): the lot's corners inside the 16 px sides and the play rect (back off first, then slide the offset)
        var g, gw, gh, gk;
        for(it=0; it<12; it++){ g = ndc(S.gpts, yw, S.pitch, d, S.hx, focusY, S.hz); gw = (g.x1 - g.x0)/2*VW; gh = (g.y1 - g.y0)/2*VH;
          gk = Math.max(gw/(VW - 2*SIDE_PX), gh/(FILL_HH*A.h)); if(gk <= 1.001 || !fit) break; d = d*gk; S.D = d; }
        if(it){ b = ndc(S.pts, yw, S.pitch, d, S.hx, focusY, S.hz); S.sxT = (1 + (b.x0 + b.x1)/2)/2*VW - VW/2; S.syT = (1 - (b.y0 + b.y1)/2)/2*VH - A.cy; }
        g = ndc(S.gpts, yw, S.pitch, d, S.hx, focusY, S.hz);
        var lx0 = (1 + g.x0)/2*VW, lx1 = (1 + g.x1)/2*VW, ly0 = (1 - g.y1)/2*VH, ly1 = (1 - g.y0)/2*VH;
        S.sxT = Math.max(lx1 - VW + SIDE_PX, Math.min(lx0 - SIDE_PX, S.sxT)); S.syT = Math.max(ly1 - (VH - A.b), Math.min(ly0 - A.t, S.syT)); S.guardN = it; }
      S.key = [VW, VH, A.t, A.b, yw.toFixed(3), focusY.toFixed(2)].join(); };
    // F6: one distance for the 4 faces (and the sway): the lot (S.lpts) fitted on both sides of the main building's projected centre
    var fitCH = function(S){ var A = area(), y0 = baseYaw + (S.turn ? S.yaw0D || 0 : S.yawD), D = 6, q, s, it, d, g, h, c, k, tn = S.turn ? 4 : 1;   // F7 ?cam45=1: the turn's yaws too
      for(q=0;q<4;q++) for(var u=0;u<tn;u++) for(s=-1;s<=1;s++){ var yw = y0 + q*Math.PI/2 + (S.turn || 0)*u/3 + s*0.06; d = Math.max(6, S.D || dist);
        for(it=0; it<16; it++){ g = ndc(S.lpts, yw, S.pitch, d, S.hx, focusY, S.hz); h = ndc(S.cpts, yw, S.pitch, d, S.hx, focusY, S.hz); c = (h.x0 + h.x1)/2;
          k = Math.max(Math.max(c - g.x0, g.x1 - c)*VW/2/(VW/2 - SIDE_PX), (g.y1 - g.y0)/2*VH/(FILL_HH*A.h)); d = Math.max(6, d*k); if(Math.abs(k - 1) < 0.002) break; }
        if(!q && !s && !u) S.D0 = d; D = Math.max(D, d); }
      S.D = D; };
    // F6: the view offset for the current yaw at the fixed distance: the main building centred across, the lot centred in the play height
    var placeCH = function(S){ var A = area(), yw = baseYaw + S.yawD, d = S.D, g = ndc(S.lpts, yw, S.pitch, d, S.hx, focusY, S.hz), h = ndc(S.cpts, yw, S.pitch, d, S.hx, focusY, S.hz);
      S.sxT = (1 + (h.x0 + h.x1)/2)/2*VW - VW/2; S.syT = (1 - (g.y0 + g.y1)/2)/2*VH - A.cy;
      var lx0 = (1 + g.x0)/2*VW, lx1 = (1 + g.x1)/2*VW; S.sxT = Math.max(lx1 - VW + SIDE_PX, Math.min(lx0 - SIDE_PX, S.sxT));   // the lot stays inside the sides
      S.fitH = +((g.y1 - g.y0)/2*VH/A.h).toFixed(3); S.fitW = +((g.x1 - g.x0)/2).toFixed(3); S.bind = "lot4";
      S.key = [VW, VH, A.t, A.b, yw.toFixed(3), focusY.toFixed(2)].join(); S.kfit = [VW, VH, A.t, A.b, focusY.toFixed(2)].join(); };
    // ---- F8 PAD: the sand pad (base levelart: the lot mesh, world-space edge at LA_LOT.r with a +-1.45 m wobble; fallback: the r 16
    // canvas pad scaled by L.lotK)
    var padLA = (function(){ try{ return !!(LA && LA.ground); }catch(e){ return false; } })(), padR0 = padLA ? LA_LOT.r : 16, padK = 1, padU = { value:1 };
    var road0 = (function(){ try{ return LA_ROAD.z; }catch(e){ return -31; } })();
    var padWob = function(a){ return 0.75*Math.sin(a*5.0 + 1.3) + 0.45*Math.sin(a*11.0 + 0.4) + 0.25*Math.sin(a*23.0 + 2.1); };
    var padEdge = function(a, k){ return padLA ? k*(padR0 + 0.35 - padWob(a)) : 16*k*((L && L.lotK) || 1); };   // the visible edge, world metres from 0, 0 (a = atan2(z, x))
    var padIn = function(x, z, k){ var a = Math.atan2(z, x); return padLA ? Math.hypot(x, z)/k + padWob(a) <= padR0 - 0.28 : Math.hypot(x, z) <= 15.55*k*((L && L.lotK) || 1); };   // on the sand (fade midpoint)
    if(padLA && lot && lot.material && lot.material.onBeforeCompile){ var pob = lot.material.onBeforeCompile;
      lot.material.onBeforeCompile = function(sh){ pob(sh); sh.uniforms.uPadK = padU;
        sh.fragmentShader = sh.fragmentShader.replace("#include <common>", "#include <common>\nuniform float uPadK;").replace("laR = length(vLaW)", "laR = length(vLaW)/uPadK"); };
      lot.material.customProgramCacheKey = function(){ return "la-lot1-padk"; }; lot.material.needsUpdate = true; }
    var padFor = function(p){ var O = window.LV7O, Lv = typeof LEVELS !== "undefined" ? LEVELS[p] : null; if(!PADON || OFF || !O || !O.on || !Lv || Lv.boss || (O.isH && O.isH(p))) return 1; return PADK; };
    var padApply = function(){ padK = padFor(levelIdx); padU.value = padK;
      try{ var lk = (L && L.lotK) || 1; lot.scale.setScalar(padLA ? Math.max(lk, padK) : lk*padK); }catch(e){}
      try{ LA_ROAD.z = road0 - padR0*(padK - 1); if(laRoad && laRoad.children[0]) laRoad.children[0].position.z = LA_ROAD.z; }catch(e){} };
    // the lawn ring (bushes, lamps, benches, hydrants), the Figma trees and the back row move out with the edge (base laKeepOut, then this)
    try{ if(typeof laKeepOut === "function"){ var lko0 = laKeepOut;
      laKeepOut = function(set){ var r = lko0.apply(this, arguments);
        try{ var m = set && set.prop && set.prop.userData.rows ? set.prop : null; if(!m) return r; var dM = padR0*(padK - 1), arr = m.instanceMatrix.array, m0 = m.userData.m0, cy = Math.cos(laYaw), sy = Math.sin(laYaw), ch = false;
          m.userData.rows.forEach(function(e, i){ var x, z;
            if(e[4] === 0 || e[4] === 2){ var rr = Math.hypot(e[0], e[1]); if(rr < padR0 - 3) return; var f = (rr + dM)/rr; x = e[0]*f; z = e[1]*f; }
            else if(e[4] === 3){ x = e[9]*cy - (e[10] + dM)*sy; z = -e[9]*sy - (e[10] + dM)*cy; }
            else return;
            if(m0[i*16 + 12] !== x || m0[i*16 + 14] !== z){ m0[i*16 + 12] = x; m0[i*16 + 14] = z; ch = true; }
            if(arr[i*16] !== 0 || arr[i*16 + 5] !== 0){ if(arr[i*16 + 12] !== x || arr[i*16 + 14] !== z){ arr[i*16 + 12] = x; arr[i*16 + 14] = z; ch = true; } } });
          if(ch) m.instanceMatrix.needsUpdate = true; FR.ring = (FR.ring || 0) + 1; }catch(e){ console.error("main/frame.js F8 ring", e); }
        return r; }; } }catch(e){}
    var padPts = function(k){ var P = [], n = 72; for(var i=0;i<n;i++){ var a = i/n*Math.PI*2, R = padEdge(a, k); P.push(Math.cos(a)*R, 0, Math.sin(a)*R); } return new Float32Array(P); };
    // the pivot: the pad centre, when the lot is centred on the pad (always on the widened levels; a boss only within PIV_TOL m)
    var pivotPad = function(G){ if(!PADON || OFF || !G) return null; var wide = padK > 1;
      if(!wide && Math.hypot(G.hx, G.hz) > PIV_TOL) return null; var pp = padPts(padK), all = new Float32Array(G.pts.length + pp.length); all.set(G.pts); all.set(pp, G.pts.length); return { pad:pp, all:all }; };
    var openCH = function(){ var G = heroPts(true), C = heroPts(false, [heroIds()[0]]) || heroPts(false); if(!G || !C) return false;
      var y00 = baseYaw, face = Math.round(baseYaw/(Math.PI/2))*(Math.PI/2), own = ownYaw();
      if(!own) C = G;   // F7: an old level / boss: the LOT is centred (its main building is not on the lot's axis: centring it cost 1.7x the distance on L3)
      var PV = pivotPad(G);   // F8: the pad's centre is the pivot (look-at + turn), the whole pad in the fit
      if(PV){ if(FITPAD){ C = { pts:PV.pad, hx:0, hz:0 }; G = { pts:PV.all, hx:G.hx, hz:G.hz }; } else C = { pts:new Float32Array([0, 0, 0]), hx:0, hz:0 }; }   // F9: the buildings only, centred on the pivot
      if(!own && Math.abs(baseYaw - face) > 1e-4){ baseYaw = defYaw = face; rfz0(); }   // F7: an old level / boss stands on its nearest face (as a hard level on its own yaw)
      var S = { lv:levelIdx + 1, hard:false, ch:true, all:!own, piv:!!PV, padK:padK, yaw00:y00, pts:C.pts, cpts:C.pts, lpts:G.pts, hx:C.hx, hz:C.hz, yawD:0, yawOpen:baseYaw, pitch:CF.pitch, fillH:FILL_HH, fillW:Math.max(0.5, (VW - 2*SIDE_PX)/VW),
        live:true, t:0, dur:REDUCED ? 0 : CF.dur, D:dist, sx:0, sy:0, sxSp:{v:0}, sySp:{v:0} };
      if(CAM45){ S.turn = (own ? (baseYaw - face < 0 ? -1 : 1) : (y00 - face < 0 ? -1 : 1))*Math.PI/4 - (own ? baseYaw - face : 0); S.yaw0D = 0; S.tt = 0; if(REDUCED) S.yawD = S.turn; }   // F7 ?cam45=1: front -> 45 degrees
      fitCH(S); placeCH(S);
      S.zOpen = S.D/dist; S.zFrom = REDUCED ? S.zOpen : S.zOpen*CF.wide; S.zEnd = Math.max(1, S.zFrom + 0.25); zMax = Math.max(zMax, S.zEnd);
      S.closeO = window.__blast.m14 && window.__blast.m14.flags().cam ? Math.max(0, Math.min(1, (1 - S.zOpen)/0.45)) : 0;
      S.sx = S.sxT; S.sy = S.syT; FR.S = S; FR.W = 1; FR.n++;
      zoomT = zoomK = S.zFrom; zoomSp.v = 0; camDist = dist; distSp.v = 0; yaw = baseYaw + S.yawD; yawSp.v = 0; return true; };
    var openLevel = function(){ FR.S = null; FR.W = 0;
      if(manual || screen !== "game" || !L || !blocks.length) return;
      if(isCH() && openCH()) return;   // F6
      var hard = isHard(), H = heroPts(hard); if(!H) return;
      var o = hard ? { yaw:baseYaw, fillH:FILL_HH, fillW:Math.max(0.5, (VW - 2*SIDE_PX)/VW) } : OVR[levelIdx + 1] || {}, f = Math.round(baseYaw/(Math.PI/2))*(Math.PI/2), off = baseYaw - f, sg = off < 0 ? -1 : 1;
      var yawOpen = o.yaw != null ? o.yaw : f + sg*Math.max(o.yawMin || CF.yawMin, Math.min(o.yawMax || CF.yawMax, Math.abs(off)));
      var S = { lv:levelIdx + 1, hard:hard, pts:H.pts, hx:H.hx, hz:H.hz, yawD:yawOpen - baseYaw, yawOpen:yawOpen, pitch:o.pitch || CF.pitch, fillH:o.fillH || CF.fillH, fillW:o.fillW || CF.fillW,
        live:true, t:0, dur:REDUCED ? 0 : (o.dur || CF.dur), D:dist, sx:0, sy:0, sxSp:{v:0}, sySp:{v:0} };
      if(isGuard()){ var G = heroPts(true); if(G) S.gpts = G.pts; S.guard = true; }   // F5 (a)
      solve(S, true);
      S.zOpen = Math.min(hard || S.guard ? Math.max(1, zMax) : 1, S.D/dist); S.zFrom = REDUCED ? S.zOpen : hard ? Math.max(S.zOpen, Math.min(zMax, S.zOpen*CF.wide)) : S.zOpen*CF.wide; S.zEnd = Math.max(1, S.zFrom + 0.25);
      S.closeO = window.__blast.m14 && window.__blast.m14.flags().cam ? Math.max(0, Math.min(1, (1 - S.zOpen)/0.45)) : 0;
      S.sx = S.sxT; S.sy = S.syT;
      FR.S = S; FR.W = 1; FR.n++;
      zoomT = zoomK = S.zFrom; zoomSp.v = 0; camDist = dist; distSp.v = 0; yaw = yawOpen; yawSp.v = 0; };
    if(!OFF){   // ?frame=0: nothing below runs (the measure API stays, for before / after shots)
    var sl0 = startLevel;
    startLevel = function(){ FR.t0 = performance.now(); FR.hold = null; var r = sl0.apply(this, arguments); try{ padApply(); }catch(e){ console.error("main/frame.js F8", e); } try{ openLevel(); }catch(e){ FR.S = null; console.error("main/frame.js", e); } return r; };
    var stop = function(){ if(FR.S) FR.S.live = false; };
    var da0 = detonateAll; detonateAll = function(){ stop(); return da0.apply(this, arguments); };   // BLAST: back to the whole-lot framing (v14 resets zoom / pan)
    var rf0 = resetFraming; resetFraming = function(){ stop(); return rf0.apply(this, arguments); };
    // F6: a turn (the engine's refit() for the new face) keeps the one distance of a CAM-HARD framing: dist, zoom and its far limit stay
    var rfz0 = refit; refit = function(){ var S = FR.S, b = false; try{ b = !!ballAim; }catch(e){}
      if(!(S && S.ch && S.live && FR.W > 0 && !b && screen === "game" && (phase === "plan" || phase === "build"))) return rfz0.apply(this, arguments);
      var d0 = dist, zt = zoomT, zk = zoomK, zx = zMax, r = rfz0.apply(this, arguments);
      dist = d0; zoomLimits(frameBox()); zMax = Math.max(zMax, zx); zoomT = zt; zoomK = zk; FR.frz = (FR.frz || 0) + 1; return r; };
    // F11 FIX-1125 (25/11/2026, tester round UX-98: one tap 1.3 s into L7 left the view front-on for the whole level, on L15 it stopped
    //    mid-turn): a touch no longer stops the opening between poses. It ends the zoom-in at its END zoom (S.zOpen, not where it was)
    //    and plays the rest of the front -> 45-degree turn in FF_S seconds (same ease curve, faster), so the view always reaches the
    //    pose a no-touch run ends on. The tap that does this (its pointerdown came while the zoom-in or the turn was still running, in
    //    planning) is not used (API.eatTap, called by main/polish.js FX25 at the top of onTap): it was aimed at a view that is about to
    //    turn (the F9 double-tap miss). Later taps, also during the short yaw lag, place as usual. ?ff=0 = the F9 stop.
    var FF_ON = Qf.get("ff") !== "0", FF_S = 0.2;
    API.eatTap = function(){ var t = FR.downOpen; FR.downOpen = null; if(!FF_ON || t == null || phase !== "plan") return false; if(performance.now() - t > 2500) return false; FR.eaten = (FR.eaten || 0) + 1; return true; };
    API.ffState = function(){ var S = FR.S; return { on:FF_ON, ff:!!(S && S.ffK), ffK:S && S.ffK ? +S.ffK.toFixed(2) : 0, eaten:FR.eaten || 0, touches:FR.touches || 0 }; };
    renderer.domElement.addEventListener("pointerdown", function(){ var S = FR.S;
      FR.downOpen = null; try{ if(phase === "plan" && S && S.live && (S.t < S.dur || (S.turn && !S.turnDone))){ FR.downOpen = performance.now(); FR.touches = (FR.touches || 0) + 1; } }catch(e){}   // only the touch that moves the camera on (not the yaw lag after it)
      if(FF_ON){
        if(S && S.live && S.t < S.dur){ S.t = S.dur; zoomT = clampZoom(S.zOpen); }   // the zoom eases on to its end pose
        if(S && S.live && S.turn && !S.turnDone && !S.ffK) S.ffK = Math.max(1, (CF.turnDur - (S.tt || 0))/FF_S);   // the turn finishes in FF_S s
        return; }
      if(S && S.t < S.dur){ S.t = S.dur; zoomT = clampZoom(zoomK); } if(S && S.turn && !S.turnDone){ S.turnDone = true;
        // F9: stop the view where it IS (the engine's yaw lags the turn by up to ~15 deg; left alone it kept turning after the touch, twice as far on screen now the camera is close: the L1 double-tap missed its TNT)
        if(S.live && FR.W > 0.98){ var sw = 0; try{ sw = ballAim ? 0 : 0.06*Math.sin(swayT*0.35); }catch(e){} S.yawD = (yaw - sw - baseYaw)/FR.W; yawSp.v = 0; } } }, { capture:true, passive:true });   // F7: a touch also stops the ?cam45 turn where it is   // a touch ends the ease where it is
    var myX = null, myY = null, inX = 0, inY = 0, wSp = { v:0 };
    var uc0 = updateCamera;
    updateCamera = function(rdt){
      var S = FR.S, game = screen === "game" && phase !== "title";
      if(FR.hold != null){ if(game && phase === "plan") swayT = FR.hold - (rdt || 0); else FR.hold = null; }   // F10: the idle sway held (the inner camera adds rdt back)
      if(S && S.ch && S.live && game && zMax < S.zEnd) zMax = S.zEnd;   // F6: a later zoomLimits() must not pull the one distance in
      if(!S || !game){ if(myX !== null && camera.view){ camera.setViewOffset(VW, VH, inX, inY, VW, VH); } myX = myY = null; FR.W = 0; return uc0(rdt); }
      // F5 (b): once the ease is over, read the box off the camera as the last frame drew it (sway, clearance, pan and every later
      // wrapper applied) for a few frames and nudge the offset (and, if it is too big, the zoom) until it sits 16 px inside the sides
      // and inside the play rect, + 3 px for the sway. The same correction holds a hard / boss opening's lot (F4 / F5 a): the engine's
      // yaw sway turns the view 1-3 degrees off the solved yaw.
      var fixP = S.ch ? null : S.refit || S.hard ? S.pts : S.gpts;   // F6 holds its own fit (sway included)
      if(R22 && fixP && S.live && FR.W > 0.98 && S.t >= S.dur && (S.fixN || 0) < 40 && ((S.fixF = (S.fixF || 0) + 1) % 3 === 0)){
        camera.updateMatrixWorld(); camera.updateProjectionMatrix(); var A2 = area(), P2 = fixP, x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
        for(var i2=0;i2<P2.length;i2+=3){ _v.set(P2[i2], P2[i2+1], P2[i2+2]).project(camera); var px = (_v.x + 1)/2*VW, py = (1 - _v.y)/2*VH; if(px < x0) x0 = px; if(px > x1) x1 = px; if(py < y0) y0 = py; if(py > y1) y1 = py; }
        var L0 = SIDE_PX + 3, R0 = VW - SIDE_PX - 3, T0 = A2.t + 3, B0 = VH - A2.b - 3, ddx = 0, ddy = 0, kz = Math.max((x1 - x0)/(R0 - L0), (y1 - y0)/(B0 - T0));
        if(kz > 1.01){ zoomT = clampZoom(zoomK*kz); S.zOpen = zoomT; S.zEnd = Math.max(S.zEnd, zoomT + 0.25); if(!S.refit) S.zFrom = Math.max(S.zFrom, zoomT); }
        else { if(x0 < L0) ddx = x0 - L0; else if(x1 > R0) ddx = x1 - R0; if(y0 < T0) ddy = y0 - T0; else if(y1 > B0) ddy = y1 - B0; }
        if(ddx || ddy){ S.sxT += ddx; S.syT += ddy; S.sx += ddx; S.sy += ddy; }
        S.fixN = (S.fixN || 0) + 1; if(!ddx && !ddy && kz <= 1.01) S.fixN = 40; }
      // F2: the ease (game time of the render loop, capped like the rest of the camera)
      if(S.live && S.t < S.dur){ S.t = Math.min(S.dur, S.t + rdt); var e = 1 - Math.pow(1 - S.t/S.dur, 3); zoomT = zoomK = S.zFrom + (S.zOpen - S.zFrom)*e; zoomSp.v = 0; }
      // F7 ?cam45=1: once the zoom-in is over, the view turns from the front to 45 degrees (ease-in-out), stopped by any touch
      if(S.turn && S.live && !S.turnDone && S.t >= S.dur){ S.tt = Math.min(CF.turnDur, S.tt + rdt*(S.ffK || 1)); var et = S.tt/CF.turnDur; et = et < 0.5 ? 4*et*et*et : 1 - Math.pow(-2*et + 2, 3)/2; S.yawD = S.yaw0D + S.turn*et; if(S.tt >= CF.turnDur) S.turnDone = true; }
      // F3: the weight (state x zoom: the whole-lot zoom 1 = no framing)
      var wz = Math.max(0, Math.min(1, (S.zEnd - zoomK)/(S.zEnd - Math.max(S.zFrom, S.zOpen + 0.05)))), wt = S.live && (phase === "build" || phase === "plan" || phase === "count") ? wz : 0;
      if(S.refit && S.dur > 0) wt = Math.min(wt, 1 - Math.pow(1 - Math.min(1, S.t/S.dur), 3));   // F5 (b): the look-at / offset ease in with the zoom
      FR.W = wt >= FR.W || REDUCED ? wt : damp(FR.W, wt, wSp, 0.3, rdt); if(FR.W < 1e-3 && wt === 0) FR.W = 0;
      var W = FR.W;
      if(W > 0 && S.key !== [VW, VH, topH(), botH(), (baseYaw + S.yawD).toFixed(3), focusY.toFixed(2)].join()){   // resize / HUD / turn: re-centre (same distance once the ease is over)
        if(S.ch){ if(S.live && S.t < S.dur && !S.refit && S.kfit !== [VW, VH, topH(), botH(), focusY.toFixed(2)].join()){ fitCH(S); S.zOpen = S.D/dist; zMax = Math.max(zMax, S.zOpen*CF.wide + 0.25); } placeCH(S); }   // F6: a turn moves the offset only
        else if(S.live && S.t < S.dur && !S.refit){ solve(S, true); S.zOpen = Math.min(S.hard || S.guard ? Math.max(1, zMax) : 1, S.D/dist); S.closeO = window.__blast.m14 && window.__blast.m14.flags().cam ? Math.max(0, Math.min(1, (1 - S.zOpen)/0.45)) : 0; } else solve(S, false); }
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
    // F5 (b) the re-frame on what still counts (called by main/polish.js R22 when planning resumes with TNT left)
    var remPts = function(withKeep){ var P = [], x0 = 1e9, x1 = -1e9, z0 = 1e9, z1 = -1e9, c;
      blocks.forEach(function(b){ if(b.anchor || b.prop || b.bonus || b.dead || (!withKeep && b.keep)) return; var p = b.P || b.spawn, q = b.Q, h = b.half; if(!p) return;
        for(c=0;c<8;c++){ _v.set(c&1 ? h[0] : -h[0], c&2 ? h[1] : -h[1], c&4 ? h[2] : -h[2]); if(q) _v.applyQuaternion(q); _v.add(p); if(_v.y < 0) _v.y = 0; P.push(_v.x, _v.y, _v.z);
          if(!b.keep){ x0 = Math.min(x0, _v.x); x1 = Math.max(x1, _v.x); z0 = Math.min(z0, _v.z); z1 = Math.max(z1, _v.z); } } });
      return P.length && x1 > x0 ? { pts:new Float32Array(P), hx:(x0 + x1)/2, hz:(z0 + z1)/2 } : null; };
    API.refit = function(){
      if(OFF || !R22 || manual || screen !== "game" || phase !== "plan" || !L || !blocks.length) return null;
      var ch = isCH(), lotLv = isHard() || !!L.boss || ch, H = remPts(lotLv); if(!H) return null;
      var S = { lv:levelIdx + 1, hard:lotLv, refit:true, pts:H.pts, hx:H.hx, hz:H.hz, yawD:0, yawOpen:baseYaw, pitch:pitch, fillH:FILL_HH, fillW:Math.max(0.5, (VW - 2*SIDE_PX)/VW),
        live:true, t:0, dur:REDUCED ? 0 : 0.5, D:dist, sx:0, sy:0, sxSp:{v:0}, sySp:{v:0}, closeO:0 };
      if(ch){ S.ch = true; var P0 = FR.S; if(P0 && P0.ch && P0.turn){ S.turn = P0.turn; S.yaw0D = P0.yaw0D; S.yawD = P0.yawD; S.turnDone = true; }   // F7: the ?cam45 view is kept
        // F8: the R22 re-frame keeps zooming onto what still counts (UX-71), not onto the pad
        S.cpts = S.lpts = H.pts; fitCH(S); placeCH(S); zMax = Math.max(zMax, S.D/dist + 0.25); } else solve(S, true);   // F6: what still counts, one distance for the 4 faces
      S.zOpen = clampZoom(S.D/dist); S.zFrom = REDUCED ? S.zOpen : zoomK; S.zEnd = Math.max(1, S.zFrom, S.zOpen) + 0.25;
      S.sx = S.sxT; S.sy = S.syT; FR.S = S; FR.W = 0; FR.n++; FR.refits = (FR.refits || 0) + 1;
      if(REDUCED){ zoomT = zoomK = S.zOpen; zoomSp.v = 0; }
      return { zOpen:+S.zOpen.toFixed(3), zFrom:+S.zFrom.toFixed(3), fitW:S.fitW, fitH:S.fitH, bind:S.bind };
    };
    // F8 test API: the pad now (centre, k, edge radii) and the building members whose footprint leaves it (at rest, spawn pose)
    API.pad = function(){ var e = []; for(var i=0;i<8;i++) e.push(+padEdge(i*Math.PI/4, padK).toFixed(2)); return { on:PADON, la:padLA, k:padK, kNext:PADK, R0:padR0, centre:[+lot.position.x.toFixed(2), +lot.position.z.toFixed(2)], scale:+lot.scale.x.toFixed(3), edge:e, rMin:+(padLA ? padK*(padR0 + 0.35 - 1.45) : 0).toFixed(2), rMax:+(padLA ? padK*(padR0 + 0.35 + 1.45) : 0).toFixed(2), road:(function(){ try{ return LA_ROAD.z; }catch(x){ return null; } })(), ring:FR.ring || 0 }; };
    API.padOut = function(k){ k = k || padK; var out = [], G = heroPts(true), ids = heroIds(), c = G ? [+G.hx.toFixed(2), +G.hz.toFixed(2)] : null;
      blocks.forEach(function(b, bi){ if(b.anchor || b.prop || b.bonus) return; var p = b.spawn || b.P, h = b.half, q = b.Q, worst = -1e9, wx = 0, wz = 0;
        for(var cI=0;cI<4;cI++){ _v.set(cI&1 ? h[0] : -h[0], 0, cI&2 ? h[2] : -h[2]); if(q) _v.applyQuaternion(q); var x = p.x + _v.x, z = p.z + _v.z, a = Math.atan2(z, x);
          var over = padLA ? Math.hypot(x, z) - k*(padR0 - 0.28 - padWob(a)) : Math.hypot(x, z) - 15.55*k*((L && L.lotK) || 1); if(over > worst){ worst = over; wx = x; wz = z; } }
        if(worst > 0) out.push({ i:bi, bid:b.bid || null, keep:!!b.keep, hero:ids.indexOf(b.bid) >= 0, over:+worst.toFixed(2), at:[+wx.toFixed(1), +wz.toFixed(1)] }); });
      return { lv:levelIdx + 1, k:k, lotCentre:c, n:out.length, out:out }; };
    // the screen box of what still counts now (refit check)
    API.measureRem = function(withKeep){ var H = remPts(withKeep == null ? (isHard() || !!(L && L.boss)) : !!withKeep); if(!H) return null; camera.updateMatrixWorld(); var A = area(), x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9, P = H.pts;
      for(var i=0;i<P.length;i+=3){ _v.set(P[i], P[i+1], P[i+2]).project(camera); var sx = (_v.x + 1)/2*VW, sy = (1 - _v.y)/2*VH; if(sx < x0) x0 = sx; if(sx > x1) x1 = sx; if(sy < y0) y0 = sy; if(sy > y1) y1 = sy; }
      return { VW:VW, VH:VH, top:Math.round(A.t), bot:Math.round(VH - A.b), box:[Math.round(x0), Math.round(y0), Math.round(x1), Math.round(y1)], fillH:+((y1 - y0)/A.h).toFixed(3), fillW:+((x1 - x0)/VW).toFixed(3), W:+FR.W.toFixed(3), refit:!!(FR.S && FR.S.refit), refits:FR.refits || 0, zoomK:+zoomK.toFixed(3) }; };
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
