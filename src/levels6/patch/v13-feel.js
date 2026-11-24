// ---- levels6 v13 FEEL (H2H-DESIGN.md §5.1 quick wins Q1-Q8, Owner 12/11 "Q1-Q9 thu het"; applied LAST by tools/src-feel.js,
// right before the end of main(); nothing in v10 / v11 / v12 is edited). Camera, taps, particles, coins shown, result timing, HUD only:
// no physics step, no score, no rule (PASS 85%, protected 5%, street 10%) and no level datum is touched; nothing here calls the game's
// seeded rnd() or adds a game-time timer. Every item has a flag: window.__blast.feel = {q1..q8}, URL ?feel=off | ?feel=-q3,-q5 |
// ?feel=q1,q2 (only those). __blast.feelApi = measurements for the lab (tools/feel-lab.js).
try{ (function(){
  "use strict";
  var KEYS = ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8"], FEEL = {};
  (function(){
    var dflt = (typeof FEEL_DEFAULT === "undefined" ? "on" : FEEL_DEFAULT) !== "off", v = QS.get("feel");
    KEYS.forEach(function(k){ FEEL[k] = dflt; });
    if(v == null || v === "") return;
    var tok = v.toLowerCase().split(/[,\s]+/).filter(Boolean);
    if(tok[0] === "off" || tok[0] === "0"){ KEYS.forEach(function(k){ FEEL[k] = false; }); tok.shift(); }
    else if(tok[0] === "on" || tok[0] === "1"){ KEYS.forEach(function(k){ FEEL[k] = true; }); tok.shift(); }
    else if(tok.some(function(t){ return t[0] !== "-"; })) KEYS.forEach(function(k){ FEEL[k] = false; });   // a plain list = only those
    tok.forEach(function(t){ var off = t[0] === "-", k = t.replace(/^[-+]/, ""); if(KEYS.indexOf(k) >= 0) FEEL[k] = !off; });
  })();
  var ST = { snaps:0, missToasts:0, ghosts:0, coinsShown:0, coinsHeld:0, streams:0, streamCoins:0, stamps:0, scorch:0, puffs:0, marks:[] };
  function mark(ev){ ST.marks.push({ ev:ev, t:Math.round(performance.now()), step:typeof stepCount === "undefined" ? 0 : stepCount }); if(ST.marks.length > 80) ST.marks.shift(); }
  var D2R = Math.PI/180;
  function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }

  // ---- styles (one <style>, all rules behind body classes this block sets)
  (function(){
    var css = [
      "#feelLay{position:fixed;inset:0;z-index:58;pointer-events:none;overflow:hidden}",
      "#feelLay .coin{position:absolute;left:0;top:0;margin:-12px 0 0 -12px;will-change:transform}",
      "#feelLay .cf{position:absolute;left:0;top:0;width:9px;height:14px;border-radius:2px;will-change:transform}",
      // Q7: the stamp. 56 px cream, 3 px navy outline (a 6 px stroke painted under the fill), a navy drop edge
      "#feelStamp{position:fixed;left:var(--px,0px);width:var(--pw,100vw);top:31%;text-align:center;z-index:59;pointer-events:none;opacity:0;",
      "  font:400 56px/1 var(--fd);letter-spacing:.5px;color:#FFF4DC;-webkit-text-stroke:6px #11205C;paint-order:stroke fill;text-shadow:0 5px 0 #11205C;transform:rotate(-5deg) scale(0)}",
      "@media (max-width:359px){#feelStamp{font-size:48px}}",
      // Q8: PASS tag 13 px on every level; on Hard / boss levels the Safe / street sentence becomes two icons at the meter
      "html body.fq8 #mTag{font-size:13px;width:auto;min-width:46px;padding-left:5px;padding-right:5px}",
      "html body.fq8h #bottom #collat#collat{display:none!important}",
      "#feelRules{position:fixed;z-index:19;display:none;gap:5px;pointer-events:none}",
      "body.fq8h #feelRules{display:flex}",
      "#feelRules span{display:none;align-items:center;justify-content:center;gap:1px;height:26px;min-width:26px;padding:0 4px;box-sizing:border-box;border-radius:13px;",
      "  background:linear-gradient(#FFFDF4,#FEF5E1);color:#0E2466;box-shadow:0 0 0 2.5px #7A2BC4,0 3px 0 2px rgba(42,11,77,.28);font:900 12px/1 var(--fn)}",
      "#feelRules span.on{display:inline-flex}",
      "body.fq8boss #feelRules span{box-shadow:0 0 0 2.5px #FD702A,0 3px 0 2px rgba(120,50,10,.28)}",
      "#feelRules span.bad{background:linear-gradient(#FFE1DA,#FFC9BE);color:#A8161B;box-shadow:0 0 0 2.5px #A8161B,0 3px 0 2px rgba(168,22,27,.3)}",
      "#feelRules svg{width:17px;height:17px;flex:none;color:inherit}",
      "#feelRules b{font-weight:900}",
      "#feelRules b:empty{display:none}"
    ].join("\n");
    var s = document.createElement("style"); s.id = "feelCss"; s.textContent = css; document.head.appendChild(s);
    var lay = document.createElement("div"); lay.id = "feelLay"; document.body.appendChild(lay);
    var st = document.createElement("div"); st.id = "feelStamp"; st.setAttribute("aria-hidden", "true"); st.textContent = "CLEARED!"; document.body.appendChild(st);
    var fr = document.createElement("div"); fr.id = "feelRules"; fr.setAttribute("aria-hidden", "true");
    fr.innerHTML = '<span class="k"><svg class="i"><use href="#i-shield"/></svg><b></b></span><span class="s"><svg class="i"><use href="#i-street"/></svg><b></b></span>';
    document.body.appendChild(fr);
  })();
  var LAY = $("feelLay");

  // =====================================================================================================================
  // Q1 LONGER LENS, BIGGER TARGET. FOV 46 -> 34 (pitch 0.30 -> 0.22 so the skyline keeps its place: VISUAL-TARGET §4.2).
  // Fit on the real corners of the members (the base fits the axis-aligned box of the whole lot at 88 % of the width, which
  // is mostly air on a three-quarter view): zoom in until the HERO (L.hero parts + their crowns) fills 78 % of the width or
  // 62 % of the screen height (never more than the play area between the HUD bands), or until any target or protected
  // building would leave the screen (3 % margin), whichever comes first; checked over the idle sway. The building's base
  // sits at 62 % of the screen height when there is room above it, else as low as the top needs.
  var FOV0 = GAME_FOV, PITCH0 = pitch, Q1 = { fov:34, pitch:0.22, w:0.78, h:0.62, base:0.62, edge:0.97 };
  var q1Home = false, q1Lot = false, q1S = null, q1Info = null, q1P = null, ZB = { x0:-1, x1:1, y0:0, y1:1, z0:-1, z1:1 };
  function q1On(){ return FEEL.q1 && !q1Home; }
  function q1Sync(){ GAME_FOV = q1On() ? Q1.fov : FOV0; pitch = q1On() ? Q1.pitch : PITCH0; }
  // corner points: hero = the L.hero parts; tgt = every target member; all = targets + protected buildings (props and bonus crates are not framed)
  function q1Points(){
    var ids = String((L && L.hero) || "A").split(","), H = [], T = [], A = [];
    for(var i=0;i<blocks.length;i++){
      var b = blocks[i]; if(b.anchor || b.prop || b.bonus) continue;
      var p = b.spawn || b.P, hx = b.half[0], hy = b.half[1], hz = b.half[2], hero = !b.keep && ids.indexOf(b.bid) >= 0;
      for(var c=0;c<8;c++){ var x = p.x + (c&1 ? hx : -hx), y = Math.max(0, p.y + (c&2 ? hy : -hy)), z = p.z + (c&4 ? hz : -hz); A.push(x, y, z); if(!b.keep) T.push(x, y, z); if(hero) H.push(x, y, z); }
      var kd = b.kd; if(kd) for(var k=0;k<kd.length;k++){ var q = kd[k]; if(!q || !q.o || !q.s) continue;   // crowns / dress riding on the member: their top
        var tx = p.x + q.o.x, ty = p.y + q.o.y + q.s.y/2, tz = p.z + q.o.z; if(!isFinite(tx + ty + tz)) continue; A.push(tx, ty, tz); if(!b.keep) T.push(tx, ty, tz); if(hero) H.push(tx, ty, tz); }
    }
    if(!T.length) return null;
    return { hero:new Float32Array(H.length ? H : T), tgt:new Float32Array(T), all:new Float32Array(A) };
  }
  // NDC bounds of a point set from the camera pose (yaw, d, focus y): boxExtent() sets the probe camera
  function ndcPts(P, yw, d, fy){
    boxExtent(ZB, yw, d, fy);
    var x0 = 9, x1 = -9, y0 = 9, y1 = -9;
    for(var i=0;i<P.length;i+=3){ _fv.set(P[i], P[i+1], P[i+2]).project(_fc); if(_fv.x < x0) x0 = _fv.x; if(_fv.x > x1) x1 = _fv.x; if(_fv.y < y0) y0 = _fv.y; if(_fv.y > y1) y1 = _fv.y; }
    return { x0:x0, x1:x1, y0:y0, y1:y1 };
  }
  var fitDist0 = fitDist;
  fitDist = function(bx, yw){
    if(!q1On() || q1Lot || !q1P) return fitDist0(bx, yw);
    var usable = Math.max(0.3, 1 - (topH() + botH())/VH), hCap = Math.min(Q1.h, usable*0.97), d = 60, SW = [0, 0.06, -0.06];
    for(var it=0; it<7; it++){
      var k = 0;
      for(var s=0; s<3; s++){
        var a = ndcPts(q1P.hero, yw + SW[s], d, focusY); k = Math.max(k, (a.x1 - a.x0)/2/Q1.w);
        if(!s) k = Math.max(k, (a.y1 - a.y0)/2/hCap);
        var f = ndcPts(q1P.all, yw + SW[s], d, focusY); k = Math.max(k, Math.max(-f.x0, f.x1)/Q1.edge);     // nothing that matters leaves the screen
        if(!s) k = Math.max(k, (f.y1 - f.y0)/2/(usable*0.97));
      }
      d = Math.max(6, d*k);
    }
    return d;
  };
  // where the picture sits: the view offset (px, + = picture up) that puts the building's base at 62 % of the screen height
  function q1Place(){
    q1S = null; q1Info = null;
    if(!q1On() || !q1P) return;
    var a = ndcPts(q1P.tgt, baseYaw, dist, focusY), h = ndcPts(q1P.hero, baseYaw, dist, focusY), f = ndcPts(q1P.all, baseYaw, dist, focusY);
    var yb = (1 - a.y0)/2*VH, yt = (1 - f.y1)/2*VH, ybF = (1 - f.y0)/2*VH;
    var s = yb - Q1.base*VH;
    s = Math.min(s, yt - (topH() + 8));               // the top stays under the HUD
    s = Math.max(s, ybF - (VH - botH() - 6));         // the bottom stays above the tray
    q1S = s; q1Info = { basePct:+((yb - s)/VH*100).toFixed(1), topPx:Math.round(yt - s), heroWPct:+((h.x1 - h.x0)/2*100).toFixed(1), heroHPct:+((h.y1 - h.y0)/2*100).toFixed(1),
      allWPct:+(Math.max(-f.x0, f.x1)*100).toFixed(1) };
  }
  var zoomLimits0 = zoomLimits;
  zoomLimits = function(bx){
    q1Lot = true; try{ zoomLimits0(bx); } finally { q1Lot = false; }
    if(!q1On()) return;
    // the far limit was "under the fog start (70 m)" at 46 degrees: the same picture is 1.39x farther through the long lens
    var K = Math.tan(FOV0*D2R/2)/Math.tan(GAME_FOV*D2R/2);
    var lot = { x0:Math.min(bx.x0, -16), x1:Math.max(bx.x1, 16), y0:0, y1:bx.y1, z0:Math.min(bx.z0, -16), z1:Math.max(bx.z1, 16) };
    zMax = Math.max(dist*1.2, Math.min(70*K, Math.max(dist*1.6, fitDist0(lot, baseYaw)*1.1)))/dist;
    zoomT = clampZoom(zoomT); zoomK = clampZoom(zoomK);
  };
  var fc = { t0:-1, back:-1, yo:0, yo0:0, dk:1, dk0:1, dkT:1, scan:0, fuse:1, sh:0, shInit:false, dkSp:{v:0}, fuseSp:{v:0}, shSp:{v:0} };
  var frameLevel0 = frameLevel;
  frameLevel = function(home){ q1Home = !!home; q1Sync(); q1P = q1On() && blocks.length ? q1Points() : null; frameLevel0(home); q1Place(); fc.shInit = false; fc.t0 = -1; fc.yo = 0; fc.dk = 1; fc.fuse = 1; };
  var refit0 = refit;
  refit = function(){ q1Sync(); if(q1On() && !q1P && blocks.length) q1P = q1Points(); if(!q1On()) q1P = null; refit0(); q1Place(); };
  // the haze: the camera stands farther back through the long lens, the fog planes move back by the same distance
  var fogB = { n:scene.fog.near, f:scene.fog.far, wn:scene.fog.near, wf:scene.fog.far };
  function fogSet(extra){
    if(scene.fog.near !== fogB.wn || scene.fog.far !== fogB.wf){ fogB.n = scene.fog.near; fogB.f = scene.fog.far; }   // the game set new planes (district)
    fogB.wn = scene.fog.near = fogB.n + extra; fogB.wf = scene.fog.far = fogB.f + extra;
  }

  // =====================================================================================================================
  // Q3 COLLAPSE CAMERA (VISUAL-TARGET §4.2). From the tip-over (the TIMBER trigger): yaw drifts +0.12 rad over 1.2 s, the
  // camera dollies so the falling mass fills 70 % of the width, 1.5 degrees of roll (the base's slow-mo roll); when the
  // wave is over it eases back to the planning pose in 0.6 s. During the fuse it pushes in 3 %.
  var Q3 = { yaw:0.12, yawT:1.2, fill:0.70, back:0.6, fuse:0.97, kMin:0.82, kMax:1.15 };
  function q3Dolly(){
    var bx = { x0:1e9, x1:-1e9, y0:0, y1:1, z0:1e9, z1:-1e9 }, n = 0, i, o, r, fb = frameBox(), M = 14;
    var add = function(p, r){ var x = clamp(p.x, fb.x0 - M, fb.x1 + M), z = clamp(p.z, fb.z0 - M, fb.z1 + M);   // a far flyer never drags the camera out
      bx.x0 = Math.min(bx.x0, x - r); bx.x1 = Math.max(bx.x1, x + r); bx.z0 = Math.min(bx.z0, z - r); bx.z1 = Math.max(bx.z1, z + r); bx.y1 = Math.max(bx.y1, Math.min(p.y + r, fb.y1 + 4)); n++; };
    for(i=0;i<blocks.length;i++){ o = blocks[i]; if(o.anchor || o.keep || o.prop || o.bonus || !o.rb || (o.dead && !o.rubble)) continue; add(o.P, Math.max(o.half[0], o.half[2])); }
    for(i=0;i<frags.length;i++){ o = frags[i]; if(o.keep || (o.src && (o.src.prop || o.src.bonus))) continue; add(o.P, 0.5); }
    if(!n) return 1;
    var usable = Math.max(0.3, 1 - (topH() + botH())/VH), e = boxExtent(bx, baseYaw + fc.yo, dist, camFocusY);
    return clamp(Math.max(e.w/Q3.fill, e.h/(usable*0.95)), Q3.kMin, Q3.kMax);
  }
  var updateCamera0 = updateCamera;
  updateCamera = function(rdt){
    if(phase === "title" || (!FEEL.q1 && !FEEL.q3)){ fogSet(0); fc.t0 = -1; fc.shInit = false; return updateCamera0(rdt); }
    if(camera.fov !== GAME_FOV){ camera.fov = GAME_FOV; camera.updateProjectionMatrix(); viewShift = -1e9; }
    swayT += rdt;
    var active = phase === "boom" || phase === "settle" || phase === "done", falling = phase === "boom" || phase === "settle";
    var idle = ballAim ? 0 : 0.06*Math.sin(swayT*0.35), targetYaw, dTarget, tY = 0.5, tD = slowLeft > 0 ? 0.33 : 0.67;
    if(FEEL.q3){
      var now = performance.now()/1000;
      if(falling && slowUsed && fc.t0 < 0){ fc.t0 = now; fc.back = -1; fc.dkT = fc.dk; fc.scan = 0; mark("tip"); }
      if(fc.t0 >= 0 && fc.back < 0 && !falling){ fc.back = now; fc.yo0 = fc.yo; fc.dk0 = fc.dk; }
      if(fc.t0 >= 0){
        if(fc.back < 0){
          fc.yo = REDUCED ? 0 : Q3.yaw*EASE.inOutCubic(Math.min(1, (now - fc.t0)/Q3.yawT));
          if(now >= fc.scan){ fc.scan = now + 0.1; fc.dkT = q3Dolly(); }
          fc.dk = damp(fc.dk, fc.dkT, fc.dkSp, 0.3, rdt);
        } else {
          var kb = Math.min(1, (now - fc.back)/Q3.back), e = 1 - EASE.inOutCubic(kb);
          fc.yo = fc.yo0*e; fc.dk = 1 + (fc.dk0 - 1)*e;
          if(kb >= 1){ fc.t0 = -1; fc.yo = 0; fc.dk = 1; fc.dkSp.v = 0; }
        }
      }
      fc.fuse = damp(fc.fuse, phase === "count" && !REDUCED ? Q3.fuse : 1, fc.fuseSp, 0.2, rdt);
      targetYaw = baseYaw + (active || fc.t0 >= 0 ? fc.yo : idle);
      dTarget = dist*fc.dk*fc.fuse;
      if(fc.t0 >= 0){ tY = 0.12; tD = 0.12; } else if(phase === "count") tD = 0.15;
    } else {
      targetYaw = baseYaw + (active ? Math.min(0.35, (swayT - (swayT0||0))*0.05) : idle);
      dTarget = dist*(active ? 1.08 : 1)*(slowLeft > 0 && !REDUCED ? 0.92 : 1);
    }
    yaw = damp(yaw, targetYaw, yawSp, tY, rdt);
    camDist = damp(camDist, dTarget, distSp, tD, rdt);
    zoomK = damp(zoomK, zoomT, zoomSp, 0.14, rdt);
    var D = camDist*zoomK;
    var fy = active ? Math.max(buildingH*0.3, standingHeight()*0.5, 3) : focusY;
    camFocusY = damp(camFocusY, fy, fySp, 0.83, rdt);
    var cp = Math.cos(pitch);
    camera.position.set(focus.x + D*cp*Math.sin(yaw), camFocusY + D*Math.sin(pitch), focus.z + D*cp*Math.cos(yaw));
    camera.lookAt(focus.x, camFocusY, focus.z);
    var targetRoll = active && slowLeft > 0 && !REDUCED ? THREE.MathUtils.degToRad(1.5) : 0;
    roll = damp(roll, targetRoll, rollSp, 0.25, rdt);
    camera.rotateZ(roll);
    fogSet(q1On() ? D*(1 - Math.tan(GAME_FOV*D2R/2)/Math.tan(FOV0*D2R/2)) : 0);
    var shx = 0, shy = 0;
    if(trauma > 0.001){
      shakeT += rdt;
      var amp = (REDUCED ? 0 : 1)*trauma*trauma*0.3*VH/(2*D*Math.tan(camera.fov*Math.PI/360));
      shx = amp*(0.6*Math.sin(shakeT*41.0) + 0.4*Math.sin(shakeT*67.0 + 1.3));
      shy = amp*(0.6*Math.sin(shakeT*47.0 + 0.7) + 0.4*Math.sin(shakeT*71.0 + 2.1));
      trauma = Math.max(0, trauma - rdt*2.5);
    }
    if(kickT > 0){
      kickT = Math.max(0, kickT - rdt); shakeT += rdt;
      var ka = kickPx*(kickT/KICK_DUR)*(REDUCED ? 0 : 1);
      shx += ka*Math.sin(shakeT*53.0 + 0.4); shy += ka*Math.cos(shakeT*61.0 + 1.1);
    }
    var shift = (botH() - topH())/2;
    if(q1On() && q1S != null){ fc.sh = fc.shInit ? damp(fc.sh, q1S, fc.shSp, 0.2, rdt) : q1S; if(!fc.shInit){ fc.shInit = true; fc.shSp.v = 0; } shift = fc.sh; }
    if(shx || shy || shaking || Math.abs(shift - viewShift) > 0.5 || !camera.view){
      shaking = !!(shx || shy); viewShift = shift;
      camera.setViewOffset(VW, VH, shx, viewShift + shy, VW, VH);
    }
  };

  // =====================================================================================================================
  // Q2 FORGIVING TAPS. A tap that hits a member (or a protected building: its own message) is never moved. A tap that
  // misses takes the NEAREST tappable part within 22 pt: the game's own pick() is run on rings of 7.5 / 15 / 22 pt round
  // the finger, the first ring that finds a part wins and the point is walked back toward the finger. So every charge
  // sits exactly where a direct tap at most 22 pt away would have put it (thin columns get a 22 pt halo this way).
  // Touch-down shows a ghost charge where the release will place it; a held finger (> 300 ms, not moved) still places.
  var Q2 = { r:22, rings:[7.5, 15, 22] }, pick0 = pick, q2Snap = false, q2Hit = null;
  function q2Ok(h){ return !!(h && h.block && !h.block.keep && !h.block.anchor); }
  function q2Near(x, y){   // cheap reject: the finger is nowhere near the framed box
    var bx = frameBox(), x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    for(var i=0;i<8;i++){ var s = toScreen({ x:i&1 ? bx.x1 : bx.x0, y:i&2 ? bx.y1 : bx.y0, z:i&4 ? bx.z1 : bx.z0 }); x0 = Math.min(x0, s.x); x1 = Math.max(x1, s.x); y0 = Math.min(y0, s.y); y1 = Math.max(y1, s.y); }
    return x > x0 - 30 && x < x1 + 30 && y > y0 - 30 && y < y1 + 30;
  }
  function q2Pick(x, y){
    var h = pick0(x, y); q2Hit = { x:x, y:y, snap:false };
    if(h || !FEEL.q2 || !q2Near(x, y)) return h;
    var best = null, bd = 1e9;
    for(var r=0; r<Q2.rings.length && !best; r++){
      var R = Q2.rings[r], n = r ? 12 : 8;
      for(var a=0; a<n; a++){
        var an = a/n*6.2832 + r*0.26, px = x + Math.cos(an)*R, py = y + Math.sin(an)*R, q = pick0(px, py);
        if(!q2Ok(q)) continue;
        var lo = 0, hi = 1, bq = q, qx = px, qy = py;
        for(var s=0; s<3; s++){ var m = (lo + hi)/2, mx = x + (px - x)*m, my = y + (py - y)*m, t = pick0(mx, my); if(q2Ok(t)){ hi = m; bq = t; qx = mx; qy = my; } else lo = m; }
        var d = Math.hypot(qx - x, qy - y); if(d < bd){ bd = d; best = bq; q2Hit = { x:qx, y:qy, snap:true, d:d }; }
      }
    }
    return best;
  }
  pick = function(x, y){ return q2Snap ? q2Pick(x, y) : pick0(x, y); };
  var gh = { m:null, key:null, on:false, ptr:null, use:null };
  function ghostHide(){ if(gh.on){ gh.on = false; if(gh.m) gh.m.visible = false; } gh.use = null; }
  function ghostShow(h){
    if(gh.key !== selected || !gh.m){
      if(gh.m) scene.remove(gh.m);
      gh.m = chargeModel(selected); gh.key = selected;
      gh.m.traverse(function(o){ if(o.material){ o.material = o.material.clone(); o.material.transparent = true; o.material.opacity = 0.6; o.material.depthTest = false; } });
      gh.m.renderOrder = 7; scene.add(gh.m);
    }
    var pt = v5Snap(h.block, h.point);
    gh.m.position.copy(pt).addScaledVector(h.normal, 0.18); gh.m.visible = true; gh.on = true; ST.ghosts++;
  }
  var onTap0 = onTap;
  onTap = function(x, y){
    if(!FEEL.q2) return onTap0(x, y);
    if(gh.use){ x = gh.use.x; y = gh.use.y; }   // the charge goes where the ghost stood
    q2Snap = true; q2Hit = null;
    try{ return onTap0(x, y); } finally { q2Snap = false; if(q2Hit && q2Hit.snap) ST.snaps++; }
  };
  el.addEventListener("pointerdown", function(e){
    ghostHide(); gh.ptr = null;
    if(!FEEL.q2 || nTouch !== 1 || multi || screen !== "game" || phase !== "plan" || manual) return;
    gh.ptr = { id:e.pointerId, sx:e.clientX, sy:e.clientY, t:e.timeStamp, max:0 };
    if(!CHARGES[selected] || !stock[selected] || selC || ballAim || chargeAt(e.clientX, e.clientY)) return;
    if(typeof v5UnlockOpen === "function" && v5UnlockOpen()) return;
    var h = q2Pick(e.clientX, e.clientY); if(!q2Ok(h)) return;
    ghostShow(h); gh.use = { x:e.clientX, y:e.clientY };
  });
  el.addEventListener("pointermove", function(e){
    if(!gh.ptr || gh.ptr.id !== e.pointerId) return;
    gh.ptr.max = Math.max(gh.ptr.max, Math.hypot(e.clientX - gh.ptr.sx, e.clientY - gh.ptr.sy));
    if(gh.ptr.max > TAP_PX || multi) ghostHide();
  });
  function ghostEnd(e){
    var p = gh.ptr, was = gh.on; if(!p || p.id !== e.pointerId){ if(multi) ghostHide(); return; }
    gh.ptr = null;
    // the base places on a release within 300 ms; with the ghost up, a longer hold that did not move places too
    if(FEEL.q2 && was && e.type === "pointerup" && !multi && p.max <= TAP_PX && e.timeStamp - p.t >= TAP_MS && phase === "plan") onTap(e.clientX, e.clientY);
    ghostHide();
  }
  el.addEventListener("pointerup", ghostEnd);
  el.addEventListener("pointercancel", ghostEnd);
  var toast0 = toast;
  toast = function(msg){ if(msg === "Tap a building") ST.missToasts++; return toast0.apply(this, arguments); };

  // =====================================================================================================================
  // Q4 BIGGER BOOM (visual only). Fireball x2. Dust: 3x the puffs (14 more on top of the base's 7), 2.0 s life, warm
  // #E8CFA6 -> #C9A27A. One smoke column for 2 s after a collapse. A scorch mark on the ground under each charge.
  // Own layer (the base particle pool is capped at 60 during the collapse): one more instanced draw with the base's
  // particle material + atlas, and one instanced decal mesh. Own Math.random(); never the game's rnd().
  var Q4 = { cap:150, puffs:14, life:2.0, c0:0xE8CFA6, c1:0xC9A27A, scorch:24 };
  var fx2 = null, q4In = false, col = null;
  function fx2Init(){
    if(fx2 || !PX || !PX.mesh) return fx2;
    var geo = new THREE.InstancedBufferGeometry();
    geo.setIndex([0, 1, 2, 0, 2, 3]);
    geo.setAttribute("position", new THREE.Float32BufferAttribute([-0.5,-0.5,0, 0.5,-0.5,0, 0.5,0.5,0, -0.5,0.5,0], 3));
    geo.setAttribute("uv", new THREE.Float32BufferAttribute([0,0, 1,0, 1,1, 0,1], 2));
    var ia = function(n){ var a = new THREE.InstancedBufferAttribute(new Float32Array(Q4.cap*n), n); a.setUsage(THREE.DynamicDrawUsage); return a; };
    var aP = ia(4), aS = ia(4), aU = ia(4), aC = ia(3), aV = ia(3);
    geo.setAttribute("iP", aP); geo.setAttribute("iS", aS); geo.setAttribute("iU", aU); geo.setAttribute("iC", aC); geo.setAttribute("iV", aV);
    geo.instanceCount = 0;
    var mesh = new THREE.Mesh(geo, PX.mesh.material);
    mesh.frustumCulled = false; mesh.renderOrder = 4; mesh.raycast = function(){}; mesh.visible = false; scene.add(mesh);
    var P = []; for(var i=0;i<Q4.cap;i++) P.push({ on:false });
    var F = PX.FR[PX.FI.smoke], c = new THREE.Color();
    fx2 = { geo:geo, mesh:mesh, P:P, A:[aP, aS, aU, aC, aV], F:F, next:0, live:0,
      add:function(){
        for(var k=0;k<Q4.cap;k++){ var j = (this.next + k) % Q4.cap; if(!P[j].on){ this.next = (j + 1) % Q4.cap; var p = P[j]; p.on = true; p.t = 0; p.vx = p.vy = p.vz = 0; p.drag = 1; p.fin = 0.08; p.fout = 0.45; p.spin = 0; p.rot = Math.random()*6.28; return p; } }
        return null; },
      tint:function(p, c0, c1){ c.setHex(c0); p.r0 = c.r; p.g0 = c.g; p.b0 = c.b; c.setHex(c1); p.r1 = c.r; p.g1 = c.g; p.b1 = c.b; } };
    return fx2;
  }
  function fx2Step(dt){
    if(!fx2) return;
    var P = fx2.P, n = 0, PA = fx2.A[0].array, SA = fx2.A[1].array, UA = fx2.A[2].array, CA = fx2.A[3].array, VA = fx2.A[4].array, F = fx2.F;
    for(var i=0;i<P.length;i++){
      var p = P[i]; if(!p.on) continue;
      p.t += dt; var k = p.t/p.life; if(k >= 1){ p.on = false; continue; }
      var dm = Math.exp(-p.drag*dt); p.vx *= dm; p.vy *= dm; p.vz *= dm;
      p.x += p.vx*dt; p.y += p.vy*dt; p.z += p.vz*dt; p.rot += p.spin*dt;
      var e = 1 - (1 - k)*(1 - k), s = p.s0 + (p.s1 - p.s0)*e, a = p.a0*(k < p.fin ? k/p.fin : 1)*(k > p.fout ? 1 - (k - p.fout)/(1 - p.fout) : 1);
      var o4 = n*4, o3 = n*3;
      PA[o4] = p.x; PA[o4+1] = p.y; PA[o4+2] = p.z; PA[o4+3] = p.rot;
      SA[o4] = s; SA[o4+1] = s*F[4]; SA[o4+2] = a; SA[o4+3] = 0;
      UA[o4] = F[0]; UA[o4+1] = F[1]; UA[o4+2] = F[2]; UA[o4+3] = F[3];
      CA[o3] = p.r0 + (p.r1 - p.r0)*k; CA[o3+1] = p.g0 + (p.g1 - p.g0)*k; CA[o3+2] = p.b0 + (p.b1 - p.b0)*k;
      VA[o3] = 0; VA[o3+1] = 0; VA[o3+2] = 0;
      n++;
    }
    fx2.live = n; fx2.geo.instanceCount = n; fx2.mesh.visible = n > 0;
    if(n) for(var t=0;t<5;t++){ var at = fx2.A[t]; at.updateRange.offset = 0; at.updateRange.count = n*at.itemSize; at.needsUpdate = true; }
  }
  function fx2Clear(){ if(!fx2) return; for(var i=0;i<fx2.P.length;i++) fx2.P[i].on = false; fx2.geo.instanceCount = 0; fx2.mesh.visible = false; col = null; }
  function q4Dust(o, R){
    if(!fx2Init()) return;
    var n = Math.round(Q4.puffs*(REDUCED ? 0.5 : 1)*Math.min(1, 2.2/Math.sqrt(Math.max(1, waveN))));   // a 12-charge volley shares the layer
    for(var i=0;i<n;i++){
      var p = fx2.add(); if(!p) return;
      var a = Math.random()*6.283, r = R*(0.15 + 0.5*Math.random()), sp = 1.2 + 2.2*Math.random();
      p.x = o.x + Math.cos(a)*r; p.z = o.z + Math.sin(a)*r; p.y = Math.max(0.4, o.y + (Math.random() - 0.4)*R*0.5);
      p.vx = Math.cos(a)*sp; p.vz = Math.sin(a)*sp; p.vy = 0.5 + 1.1*Math.random(); p.drag = 1.3;
      p.life = Q4.life*(0.8 + 0.2*Math.random()); p.s0 = R*0.35; p.s1 = R*(0.75 + 0.45*Math.random()); p.a0 = 0.62; p.fin = 0.05; p.fout = 0.35; p.spin = (Math.random() - 0.5)*0.6;
      fx2.tint(p, Q4.c0, Q4.c1); ST.puffs++;
    }
  }
  // the smoke column: 2 s of puffs rising from where the rubble landed
  function q4Column(){
    var x = 0, z = 0, m = 0, i, o;
    for(i=0;i<blocks.length;i++){ o = blocks[i]; if(o.anchor || o.keep || o.prop || o.bonus || !o.rb || !o.spawn) continue; if(o.spawn.y - o.P.y > 1.3 || o.P.distanceTo(o.spawn) > 2){ x += o.P.x*o.mass; z += o.P.z*o.mass; m += o.mass; } }
    if(!m || !fx2Init()) return;
    col = { x:x/m, z:z/m, t:2.0, next:0 };
  }
  function q4ColStep(dt){
    if(!col) return;
    col.t -= dt; col.next -= dt; if(col.t <= 0){ col = null; return; }
    if(col.next > 0) return; col.next = REDUCED ? 0.2 : 0.09;
    var p = fx2.add(); if(!p) return;
    p.x = col.x + (Math.random() - 0.5)*2.4; p.z = col.z + (Math.random() - 0.5)*2.4; p.y = 0.8 + Math.random();
    p.vx = (Math.random() - 0.5)*0.5 + 0.35; p.vz = (Math.random() - 0.5)*0.5; p.vy = 3.4 + 1.6*Math.random(); p.drag = 0.35;
    p.life = 1.9 + 0.5*Math.random(); p.s0 = 2.0; p.s1 = 5.2 + 1.6*Math.random(); p.a0 = 0.5; p.fin = 0.12; p.fout = 0.4; p.spin = (Math.random() - 0.5)*0.4;
    fx2.tint(p, Q4.c1, 0x9C8B78);
  }
  // scorch marks: one instanced decal mesh on the ground (a soft dark blot, drawn here; a painted sprite is a design job)
  var sc = null;
  function scInit(){
    if(sc) return sc;
    var cv = document.createElement("canvas"); cv.width = cv.height = 128; var g = cv.getContext("2d");
    for(var k=0;k<7;k++){   // a ragged blot: one core + six lobes
      var a = k/6*6.283 + 0.4, r = k ? 26 + (k*37 % 13) : 44, cx = 64 + (k ? Math.cos(a)*(18 + k*5 % 9) : 0), cy = 64 + (k ? Math.sin(a)*(18 + k*7 % 9) : 0);
      var gr = g.createRadialGradient(cx, cy, 0, cx, cy, r); gr.addColorStop(0, "rgba(34,24,18," + (k ? 0.5 : 0.85) + ")"); gr.addColorStop(0.55, "rgba(48,34,24,0.38)"); gr.addColorStop(1, "rgba(60,44,30,0)");
      g.fillStyle = gr; g.beginPath(); g.arc(cx, cy, r, 0, 6.283); g.fill();
    }
    var tex = new THREE.CanvasTexture(cv); tex.encoding = renderer.outputEncoding;
    var geo = new THREE.PlaneGeometry(1, 1); geo.rotateX(-Math.PI/2);
    var mat = new THREE.MeshBasicMaterial({ map:tex, transparent:true, depthWrite:false, polygonOffset:true, polygonOffsetFactor:-3, polygonOffsetUnits:-3, toneMapped:false });
    var mesh = new THREE.InstancedMesh(geo, mat, Q4.scorch); mesh.count = 0; mesh.frustumCulled = false; mesh.renderOrder = 1; mesh.raycast = function(){}; scene.add(mesh);
    sc = { mesh:mesh, n:0, m:new THREE.Matrix4(), q:new THREE.Quaternion(), p:new THREE.Vector3(), s:new THREE.Vector3(), up:new THREE.Vector3(0, 1, 0) };
    return sc;
  }
  function scAdd(o, R){
    scInit(); var i = sc.n % Q4.scorch, d = R*(1.0 + 0.3*Math.random())*clamp(1.15 - o.y/14, 0.5, 1.15);
    sc.q.setFromAxisAngle(sc.up, Math.random()*6.283); sc.p.set(o.x, 0.06 + 0.002*i, o.z); sc.s.set(d, 1, d);
    sc.m.compose(sc.p, sc.q, sc.s); sc.mesh.setMatrixAt(i, sc.m); sc.n++; sc.mesh.count = Math.min(sc.n, Q4.scorch); sc.mesh.instanceMatrix.needsUpdate = true; ST.scorch++;
  }
  function scClear(){ if(sc){ sc.n = 0; sc.mesh.count = 0; } }
  var fxFlash0 = fxFlash;
  fxFlash = function(o, r, c0, c1, dur){ if(q4In){ r *= 2; dur = (dur || 0.32)*1.35; } return fxFlash0(o, r, c0, c1, dur); };
  var blastF0 = blast;
  blast = function(origin, def, aim, scale, opt){
    var prim = !(opt && (opt.cause === "fuel" || opt.cause === "cluster")), on = FEEL.q4 && prim && !manual && !pbBusy;
    q4In = on;
    var r; try{ r = blastF0.apply(this, arguments); } finally { q4In = false; }
    if(on){ try{ var R = def.radius*((opt && opt.noUpg) ? 1 : powerMul().r); q4Dust(origin, R); scAdd(origin, R); }catch(e){} }
    return r;
  };

  // =====================================================================================================================
  // Q5 NO COINS OVER THE BUILDING. While the attempt runs at most 12 coins fly, one per landed piece (at most one every
  // 0.25 s); the other coins are paid at once exactly as before (same totals), only the counter shows them later: after
  // the rubble rests, 24 coins leave along the right screen edge to the pill, 40 ms apart, and the counter counts up.
  var Q5 = { max:12, gap:250, stream:24, step:40 }, q5 = { shown:0, last:-1e9, hold:0, held:0 };
  function q5Reset(){ q5.shown = 0; q5.last = -1e9; q5.hold = 0; q5.held = 0; LAY.innerHTML = ""; }
  var spawnCoins0 = spawnCoins;
  spawnCoins = function(pos3, n, each){
    if(!FEEL.q5 || manual || screen !== "game") return spawnCoins0(pos3, n, each);
    var now = performance.now(), one = 0;
    // FIX-1124 (UX-92, tester round 24/11): on the wave that decides the attempt (no TNT left, or the last wave) no coin flies while the
    // meter is under PASS: a failed blast showed a coin stream and then paid nothing. The coins are held as the others (same totals) and
    // stream to the pill after the rest if the blast wins.
    var q5Short = (phase === "boom" || phase === "settle") && (stockLeft() === 0 || wave >= maxWaves) && !!L && pct < (L.target || 0.85);
    if(q5Short) ST.coinsMuted = (ST.coinsMuted || 0) + 1;
    if(!q5Short && q5.shown < Q5.max && now - q5.last >= Q5.gap){ one = 1; q5.shown++; q5.last = now; ST.coinsShown++; spawnCoins0(pos3, 1, each); }
    var rest = n - one; if(rest <= 0) return;
    addCoins(each*rest, false); q5.hold += each*rest; q5.held += rest; ST.coinsHeld += rest;
  };
  var hudFlush0 = hudFlush;
  hudFlush = function(){
    if(!FEEL.q5 || q5.hold <= 0) return hudFlush0();
    if(!hudDirty) return; hudDirty = false;
    var v = Math.max(0, save.coins - Math.round(q5.hold));
    if(v !== hudCoins){ hudCoins = v; $("coinTxt").textContent = v; }
  };
  function q5Stream(n, count){
    if(n <= 0){ q5.hold = 0; hudDirty = true; return; }
    var tgt = coinTarget(), c = { y:VY + VH*0.55 }, hold0 = count ? q5.hold : 0, done = 0;
    try{ var b = frameBox(), s = toScreen({ x:(b.x0 + b.x1)/2, y:1, z:(b.z0 + b.z1)/2 }); if(isFinite(s.y)) c.y = s.y; }catch(e){}
    if(!count){ q5.hold = 0; hudDirty = true; }
    ST.streams++; mark("stream");
    var arrive = function(e){
      if(e && e.parentNode) e.parentNode.removeChild(e);
      done++; ST.streamCoins++;
      if(count){ q5.hold = done >= n ? 0 : Math.max(0, hold0*(1 - done/n)); if(screen === "game") hudDirty = true; }
      bumpPill(); if(done % 2 === 1 || done === n){ try{ snd("coin", { index:Math.floor(done/3) }); }catch(er){} }
    };
    if(REDUCED || !LAY.animate){ q5.hold = 0; hudDirty = true; return; }
    var yLo = VY + topH() + 70, yHi = VY + VH - botH() - 16, xe = VX + VW - 20;
    for(var i=0;i<n;i++) (function(i){
      var e = document.createElement("span"); e.className = "coin"; LAY.appendChild(e);
      var x0 = xe - Math.random()*16, y0 = clamp(c.y + (Math.random() - 0.5)*110, yLo, yHi), x1 = tgt.x + 12, y1 = tgt.y + 12, ym = y1 + (y0 - y1)*0.45;
      var an = e.animate([
        { transform:"translate(" + x0.toFixed(1) + "px," + (y0 + 14).toFixed(1) + "px) scale(0)" },
        { transform:"translate(" + x0.toFixed(1) + "px," + y0.toFixed(1) + "px) scale(1.15)", offset:0.22 },
        { transform:"translate(" + (xe - 2).toFixed(1) + "px," + ym.toFixed(1) + "px) scale(1)", offset:0.62 },
        { transform:"translate(" + x1.toFixed(1) + "px," + y1.toFixed(1) + "px) scale(.85)" }
      ], { duration:540, delay:i*Q5.step, easing:"cubic-bezier(.45,.05,.75,.6)", fill:"both" });
      an.onfinish = function(){ arrive(e); };
      an.oncancel = function(){ arrive(e); };
    })(i);
  }

  // =====================================================================================================================
  // Q6 CUT THE DEAD AIR. The result is counted where it always was (the wave end, at rest: same step, same %); what goes
  // is the wait behind it: the base held the card up to 600 ms for coins still in the air (they are banked at once now).
  // On a win the celebration (Q7) starts once the meter has stayed over PASS for 0.5 s; the rest falls behind it.
  // Q7 A WIN THAT FEELS LIKE A WIN. "CLEARED!" stamp, 56 px cream with a 3 px navy outline, scale 0 -> 1.2 -> 1.0 in
  // 300 ms; confetti 1.2 s in construction colours; the coin pill bumps 1.15x. Sting: the existing "star" stinger
  // (a new <= 1.2 s win sting is an ElevenLabs job).
  var Q7 = { col:["#FFB400", "#FF6A1A", "#FFF4DC"], hold:0.5 }, CONF0 = CONF_COL.slice(), win = { t:0, at:0, done:false, inMeter:false };
  function stampGo(){
    if(win.done) return; win.done = true; win.at = performance.now(); ST.stamps++; mark("stamp");
    var el = $("feelStamp"), r = "rotate(-5deg) ";
    if(el.animate){
      if(REDUCED) el.animate([{ opacity:0, transform:r + "scale(1)" }, { opacity:1, transform:r + "scale(1)", offset:0.15 }, { opacity:1, transform:r + "scale(1)", offset:0.85 }, { opacity:0, transform:r + "scale(1)" }], { duration:1500, fill:"both" });
      else el.animate([
        { opacity:1, transform:r + "scale(0)", easing:"cubic-bezier(.2,.9,.3,1)" },
        { opacity:1, transform:r + "scale(1.2)", offset:0.12, easing:"ease-in-out" },
        { opacity:1, transform:r + "scale(1)", offset:0.2 },
        { opacity:1, transform:r + "scale(1)", offset:0.86 },
        { opacity:0, transform:r + "scale(1.06)" }], { duration:1500, fill:"both" });   // 0 -> 1.2 -> 1.0 in the first 300 ms
    }
    try{ snd("star", { index:2 }); }catch(e){}
    try{ feel.haptic("win", [0, 18, 40, 30]); }catch(e){}
    bumpPill();
    if(REDUCED || !LAY.animate) return;
    var b = el.getBoundingClientRect(), cx = b.left + b.width/2, cy = b.top + b.height*0.5;
    for(var i=0;i<42;i++){
      var e = document.createElement("i"); e.className = "cf"; e.style.background = Q7.col[i % 3]; if(i % 3 === 2) e.style.boxShadow = "inset 0 0 0 1px rgba(17,32,92,.25)"; LAY.appendChild(e);
      var a = -Math.PI/2 + (Math.random() - 0.5)*Math.PI*1.5, v = 90 + Math.random()*180, dx = Math.cos(a)*v, dy = Math.sin(a)*v, rot = (Math.random() - 0.5)*900;
      (function(e){ var an = e.animate([
        { transform:"translate(" + cx + "px," + cy + "px) rotate(0deg) scale(.5)", opacity:1 },
        { transform:"translate(" + (cx + dx) + "px," + (cy + dy) + "px) rotate(" + rot*0.4 + "deg) scale(1)", opacity:1, offset:0.3 },
        { transform:"translate(" + (cx + dx*1.25) + "px," + (cy + dy + 330) + "px) rotate(" + rot + "deg) scale(1)", opacity:0 }
      ], { duration:1200, easing:"cubic-bezier(.25,.6,.45,1)", fill:"forwards" }); an.onfinish = an.oncancel = function(){ if(e.parentNode) e.parentNode.removeChild(e); }; })(e);
    }
  }
  function stampOff(){ var el = $("feelStamp"); if(el.getAnimations) el.getAnimations().forEach(function(a){ a.cancel(); }); }
  var setMeter0 = setMeter;
  setMeter = function(p){ win.inMeter = true; try{ return setMeter0(p); } finally { win.inMeter = false; } };
  var popText0 = popText;
  popText = function(t, cls){ if(FEEL.q7 && cls === "clr" && win.inMeter) return; return popText0.apply(this, arguments); };   // the stamp replaces the small tag
  var snd0 = snd;
  snd = function(name){ if(FEEL.q7 && win.inMeter && name === "star") return; return snd0.apply(this, arguments); };            // its stinger plays with the stamp
  function winStep(rdt){
    // Q6: once the win is announced the rest of the fall runs at the base's fast-forward rate (3x: the same fixed steps, the same result)
    if(FEEL.q6 && win.done && !manual && (phase === "boom" || phase === "settle") && !ffwd && slowLeft <= 0 && performance.now() - win.at > 500){ ffwd = true; mark("ff"); }
    if(!FEEL.q7 || win.done || manual || screen !== "game") return;
    if((phase === "boom" || phase === "settle") && meterOn === true){ win.t += rdt; if(win.t >= (FEEL.q6 ? Q7.hold : 1e9)) stampGo(); }
    else if(phase === "boom" || phase === "settle") win.t = 0;
  }
  var finishF0 = finish;
  finish = function(){
    if(FEEL.q6 && !manual && flying.length){   // bank the coins still in the air now (the base does the same after its wait)
      flying.forEach(function(f){ addCoins(f.v, false); f.el.style.display = "none"; coinPool.push(f); }); flying.length = 0;
    }
    var r = finishF0.apply(this, arguments);
    mark("finish");
    if(!manual && lastResult){
      if(lastResult.ok && FEEL.q7) stampGo();                                   // a win the 0.5 s rule has not announced yet
      if(FEEL.q5){ if(lastResult.ok) q5Stream(Math.min(Q5.stream, q5.held), true); else q5Stream(0, false); q5.held = 0; }   // FIX-1124 (UX-92): a fail streams no coins (it pays none)
    }
    return r;
  };
  var waveEndF0 = waveEnd;
  waveEnd = function(){
    var ph = phase, r = waveEndF0.apply(this, arguments);
    if(manual || phase === ph) return r;
    mark("rest");
    if(FEEL.q4 && slowUsed) q4Column();
    if(phase === "plan" && FEEL.q5 && q5.held > 0){ q5Stream(Math.min(Q5.stream, q5.held), true); q5.held = 0; q5.shown = 0; }   // next wave: its own 12
    return r;
  };
  var showResultF0 = showResult;
  showResult = function(){
    mark("result");
    for(var i=0;i<CONF_COL.length;i++) CONF_COL[i] = FEEL.q7 ? Q7.col[i % 3] : CONF0[i];
    q5.hold = 0;   // the card's own bonus count-up owns the counter from here
    return showResultF0.apply(this, arguments);
  };
  var detonateF0 = detonateAll;
  detonateAll = function(){ if(!manual){ mark("blast"); win.t = 0; } return detonateF0.apply(this, arguments); };

  // =====================================================================================================================
  // Q8 HUD DIET ON HARD LEVELS. Hard / boss levels: the tip fades 3 s after the first TNT; the "Safe . street 0%/10%"
  // sentence becomes two icons at the meter (a number only once something is damaged; red at the same threshold as the
  // old pill). Every level: the PASS tag is 13 px.
  var q8 = { tipT:0, first:false, txt:null, lay:"" };
  function q8Hard(){ return FEEL.q8 && !!L && (isHard(L) || !!L.boss) && !!(L.keep || L.street); }
  function q8Classes(){
    var inGame = screen === "game" || screen === "result", h = inGame && q8Hard();
    document.body.classList.toggle("fq8", FEEL.q8);
    if(document.body.classList.contains("fq8h") !== h){ document.body.classList.toggle("fq8h", h); topDirty = true; }
    document.body.classList.toggle("fq8boss", h && !!L.boss);
    if(h) q8Lay();
  }
  function q8Lay(){
    var m = $("meter").getBoundingClientRect(), fr = $("feelRules"); if(!m.width) return;
    var w = Math.max(26, fr.offsetWidth || 0), room = VX + VW - m.right - 8, side = room >= w + 5;   // beside the meter while it fits, else hung under its right end
    var x = side ? m.right + 8 : m.right - w - 4, y = side ? m.top + (m.height - 26)/2 : m.bottom + 7, k = Math.round(x) + "," + Math.round(y);
    if(k !== q8.lay){ q8.lay = k; fr.style.left = Math.round(x) + "px"; fr.style.top = Math.round(y) + "px"; }
  }
  function q8Rules(){
    if(!document.body.classList.contains("fq8h") || collatTxt === q8.txt) return;
    q8.txt = collatTxt;
    var fr = $("feelRules"), ks = fr.querySelector(".k"), ss = fr.querySelector(".s"), t = String(collatTxt || "");
    var km = Math.round((L.keepMax || KEEP_MAX)*100), sm = L.street ? Math.round(L.street.max*100) : 0;
    var a = /i-shield[^·]*?(\d+)%\//.exec(t), b = /i-street.*?(\d+)%\//.exec(t), kv = a ? +a[1] : 0, sv = b ? +b[1] : 0;
    ks.classList.toggle("on", !!L.keep); ss.classList.toggle("on", !!L.street);
    ks.querySelector("b").textContent = kv > 0 ? kv + "%" : ""; ss.querySelector("b").textContent = sv > 0 ? sv + "%" : "";
    ks.classList.toggle("bad", kv > km*0.5); ss.classList.toggle("bad", sv > sm*0.6);
    q8Lay();
  }
  var syncTopF0 = syncTop;
  syncTop = function(){ var r = syncTopF0.apply(this, arguments); q8.first = false; q8.tipT = 0; q8.txt = null; q8Classes(); win.done = false; win.t = 0; stampOff(); return r; };
  var showF0 = show;
  show = function(id){ var r = showF0.apply(this, arguments); q8Classes(); if(id !== null && id !== "result"){ ghostHide(); stampOff(); } return r; };
  var placeChargeF0 = placeCharge;
  placeCharge = function(){
    var r = placeChargeF0.apply(this, arguments);
    if(r === "ok" && !q8.first && !manual){ q8.first = true; if(q8Hard()) q8.tipT = performance.now() + 3000; }
    return r;
  };
  var teardownF0 = teardown;
  teardown = function(){ q1P = null; fx2Clear(); scClear(); q5Reset(); ghostHide(); fc.t0 = -1; fc.yo = 0; fc.dk = 1; return teardownF0.apply(this, arguments); };

  // ---- one hook a frame (the base's jStep runs every rendered frame, after the physics)
  var jStepF0 = jStep;
  jStep = function(rdt, rawDt){
    var r = jStepF0.apply(this, arguments);
    try{
      if(FEEL.q4 || fx2){ q4ColStep(rdt); fx2Step(rdt); }
      winStep(rdt);
      if(gh.on && gh.m){ if(phase !== "plan"){ ghostHide(); } else { gh.m.scale.setScalar(1.12); chargeFace(gh.m, performance.now()); } }
      if(q8.tipT && performance.now() >= q8.tipT){ q8.tipT = 0; if(phase === "plan" || phase === "count"){ $("tip").classList.add("fade"); } }
      if(frameNo % 6 === 0) q8Rules();
    }catch(e){ if(!jStep.err){ jStep.err = true; console.error("FEEL frame", e); } }
    return r;
  };
  addEventListener("resize", function(){ q8.lay = ""; setTimeout(function(){ if(document.body.classList.contains("fq8h")) q8Lay(); }, 60); });

  // ---- API. __blast.feel = the live flags (set one and call __blast.feelApi.apply() to reframe); feelApi = lab numbers
  window.__blast.feel = FEEL;
  window.__blast.feelApi = {
    keys:KEYS.slice(), stats:ST,
    apply:function(){ q8Classes(); if(phase !== "title" && blocks.length){ q1Sync(); var y = baseYaw; refit(); baseYaw = y; } return Object.assign({}, FEEL); },
    // the opening pose at once (no ease-in, no idle sway): for measurements and screenshots
    snap:function(){ camDist = dist; camFocusY = focusY; yaw = baseYaw; swayT = 0; zoomK = zoomT; yawSp.v = distSp.v = fySp.v = 0; fc.shInit = false; updateCamera(0); camera.updateMatrixWorld(); return true; },
    cam:function(){ return { fov:camera.fov, pitch:pitch, dist:dist, d:camDist*zoomK, shift:viewShift, q1:q1Info, yo:fc.yo, dk:fc.dk, fuse:fc.fuse, fogNear:scene.fog.near }; },
    // the target box (members + crowns) and the hero part(s) on screen with the live camera, and the play area
    target:function(){
      var scr = function(bx){ var x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; for(var i=0;i<8;i++){ var s = toScreen({ x:i&1 ? bx.x1 : bx.x0, y:i&2 ? bx.y1 : bx.y0, z:i&4 ? bx.z1 : bx.z0 }); x0 = Math.min(x0, s.x); x1 = Math.max(x1, s.x); y0 = Math.min(y0, s.y); y1 = Math.max(y1, s.y); }
        return { x0:+x0.toFixed(1), x1:+x1.toFixed(1), y0:+y0.toFixed(1), y1:+y1.toFixed(1) }; };
      var P = q1Points(), pts = function(A){ var x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; for(var i=0;i<A.length;i+=3){ var s = toScreen({ x:A[i], y:A[i+1], z:A[i+2] }); x0 = Math.min(x0, s.x); x1 = Math.max(x1, s.x); y0 = Math.min(y0, s.y); y1 = Math.max(y1, s.y); }
        return { x0:+x0.toFixed(1), x1:+x1.toFixed(1), y0:+y0.toFixed(1), y1:+y1.toFixed(1) }; };
      var minCol = 1e9;
      blocks.forEach(function(b){ if(b.anchor || b.prop || b.keep || b.dead || b.floor !== 0 || b.half[1] < 0.8 || b.half[0] > 0.8 || b.half[2] > 0.8) return;
        var a = toScreen({ x:b.spawn.x - b.half[0], y:b.spawn.y, z:b.spawn.z }), c = toScreen({ x:b.spawn.x + b.half[0], y:b.spawn.y, z:b.spawn.z }), w = Math.hypot(a.x - c.x, a.y - c.y); if(w < minCol) minCol = w; });
      return { target:P ? pts(P.tgt) : null, hero:P ? pts(P.hero) : null, all:P ? pts(P.all) : null, frame:scr(frameBox()), minColPx:minCol < 1e9 ? +minCol.toFixed(1) : null,
        play:{ x0:VX, x1:VX + VW, y0:VY + topH(), y1:VY + VH - botH() }, VW:VW, VH:VH };
    },
    pickAt:function(x, y){ var h = q2Pick(x, y); return h ? { i:blocks.indexOf(h.block), keep:!!h.block.keep, snap:!!(q2Hit && q2Hit.snap), d:q2Hit && q2Hit.d || 0 } : null; },
    pick0:function(x, y){ var h = pick0(x, y); return h ? { i:blocks.indexOf(h.block), keep:!!h.block.keep } : null; },
    coins:function(){ var out = []; [].forEach.call(document.querySelectorAll("#coins .coin, #feelLay .coin"), function(e){ if(e.style.display === "none") return; var r = e.getBoundingClientRect(); if(r.width && r.right > 0 && r.bottom > 0) out.push([Math.round(r.left), Math.round(r.top), Math.round(r.width)]); }); return out; },
    fx:function(){ return { live:fx2 ? fx2.live : 0, scorch:sc ? sc.mesh.count : 0, column:!!col, hold:q5.hold, held:q5.held, shown:q5.shown }; },
    stamp:function(){ win.done = false; stampGo(); return true; },   // lab / demo: play the win stamp now
    moving:function(){ return moving; }
  };
  q8Classes();
})(); }catch(e){ console.error("FEEL", e); }
// ---- end levels6 v13 FEEL
