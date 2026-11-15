  // ---- main/tap2.js (14/11/2026, Owner: D-blast-TAP2 + its 04:25 amendment, D-blast-TAPEXACT, D-blast-NOSTACK, D-blast-ADOPT,
  // D-blast-THRESH-2, D-blast-NOLOT, D-blast-COIN). Appended inside main() by main/tap2-patch.js after every other step, so it
  // replaces / wraps the final onTap, pick, stepHand, startLevel, showResult. Status and numbers: games/blast/TAP2-STATUS.md.
  // CONTROLS
  //   T1 one tap on a building = one TNT EXACTLY where the finger is (first surface the ray meets: a member, a glass pane, a decor
  //      piece's member; no snap to thin columns, no jump from a pane to the pier behind, no forgiving rings (feel Q2 off), no
  //      lower-third height snap). Bots / the test API keep their own placement (determinism unchanged).
  //   T2 placed TNT is permanent: no tap-to-select, no x button, no undo, no move.
  //   T3 a tap on / within 24 px of a placed TNT does nothing (no stacking).
  //   T4 double tap (2 taps <= 300 ms, <= 24 px apart) = a TNT there (once: the first tap already placed it) + BLAST every placed TNT
  //      (the same call as the BLAST button). Double tap no longer resets the camera; BLAST still does.
  //   T5 L1 has no BLAST button (the tutorial teaches the double tap); BLAST shows from L2. Boosters keep their own flows.
  // TEACHING (hand, 0 words; the L2 card is in main/intro.js INTRO_SCHED)
  //   H1 L1 first visit: the hand double-taps a post; after a single tap the hand moves to that TNT (blinking) and shows the second tap.
  //   H2 L2 first visit: the hand taps leg A, then leg B, then BLAST.
  // RULES
  //   R1 no street rule (THRESH-2): L.street is moved aside after the level is built (the road stays as scenery): no STREET BLOCKED,
  //      no street meter / badge / pill, road and stacking words dropped from tips and fail lines.        ?street=1 = old
  //   R2 no yellow Target Lot (NOLOT): the lot6 ground paint is not built (L36).                        ?lot=1 = old
  //   R3 coins (COIN): a win pays 10 / 20 / 30 (normal / Hard / Boss), a loss 0. Debris coins still fly as a show.   ?coin=0 = old
  //   R4 the "coming soon" Home buttons Daily, No Ads and the coin "+" are hidden (ADOPT 3).              ?soon=1 = shown
  // ?tap2=0 = all of the above off (the old controls and rules).
  (function(){
    var Qt = new URLSearchParams(location.search), OFF = Qt.get("tap2") === "0";
    var T2 = { on:!OFF, exact:false, dbl:0, single:0, ignored:0, blasts:0, log:[], last:null,
      street:!OFF && Qt.get("street") !== "1", lot:!OFF && Qt.get("lot") !== "1", coin:!OFF && Qt.get("coin") !== "0", soon:!OFF && Qt.get("soon") !== "1" };
    var DBL_MS = 300, DBL_PX = 24, NEAR_PX = 24;
    var dblMs = function(){ return DBL_MS; };   // main/polish.js X9 (UX-9): L1 outside the lesson = 400 ms, via api.setDblMs
    var t2Pick = function(){ return null; }, t2NoBlast = function(){ return false; }, syncNB = function(){}, tutL1 = function(){ return false; }, tutDone = function(){ return true; }, tutStep = function(){}, tutPop = function(){}, tutRef = function(){ return false; };
    var TUT_DBL = { ms:600, px:40 };   // L1 teach only: a beginner's slower / looser double tap still counts (TUTORIAL-STATUS.md)
    var api = window.__blast.tap2 = {
      on:function(){ return T2.on; },
      flags:function(){ return { on:T2.on, street:T2.street, lot:T2.lot, coin:T2.coin, soon:T2.soon, dblMs:DBL_MS, dblPx:DBL_PX, nearPx:NEAR_PX }; },
      stats:function(){ return { dbl:T2.dbl, single:T2.single, ignored:T2.ignored, blasts:T2.blasts, log:T2.log.slice(-20) }; },
      // screen position of every unfired placed TNT (tools: double tap a placed TNT = BLAST without placing)
      charges:function(){ return charges.filter(function(c){ return !c.fired; }).map(function(c){ var s = toScreen(c.mesh.position); return { x:s.x, y:s.y, on:s.on, p:c.mesh.position.toArray(), host:blocks.indexOf(c.host) }; }); },
      noBlast:function(){ return t2NoBlast(); },
      setDblMs:function(f){ if(typeof f === "function") dblMs = f; },
      dblWindow:function(){ return dblMs(); },
      reward:function(Lv){ return t2Reward(Lv || L); },
      streetRule:function(){ return !!(L && L.street); },
      table:function(){ return LEVELS.map(function(l, i){ return { L:i + 1, tier:l.tier || '', hard:isHard(l), boss:!!l.boss, street:!!l.street, rew:t2Reward(l) }; }); },
      pickExact:function(x, y){ var h = t2Pick(x, y); return h ? { i:blocks.indexOf(h.block), key:h.block.key, keep:!!h.block.keep, p:h.point.toArray(), kd:!!h.kd } : null; }
    };
    var st = document.createElement("style"); st.id = "tap2Css";
    st.textContent = [
      "html.t2 body #undo,html.t2 body #chX{display:none!important}",
      // T5: no BLAST button on L1 (layout kept, so the TNT badge does not move)
      "html.t2 body.t2NoBlast #blast{visibility:hidden!important;pointer-events:none!important}",
      // H1: the hand's double tap (two presses in 0.5 s, then a rest), on the base #hand (same art, same size)
      "#hand.t2d svg{animation:t2Dbl 1.6s ease-in-out infinite}",
      "@keyframes t2Dbl{0%{transform:translate(6px,14px) scale(1)}12%{transform:translate(0,0) scale(.86)}19%{transform:translate(2px,5px) scale(.95)}26%{transform:translate(0,0) scale(.86)}36%,100%{transform:translate(6px,14px) scale(1)}}",
      "html.rm #hand.t2d svg{animation:none!important}",
      // R4
      "html.t2soon body #ulDaily,html.t2soon body #ulNoAds,html.t2soon body #hPlus{display:none!important}"
    ].join("\n");
    document.head.appendChild(st);
    if(T2.soon) document.documentElement.classList.add("t2soon");
    if(!OFF){
      document.documentElement.classList.add("t2");
      // ---- T1 exact pick: the first thing the ray meets. Members (glass panes and decor members included) take the TNT on
      // their own surface; a hero-kit dress piece (visual only, no body) takes it on its surface too, carried by its member.
      var _kdIdx = null, _kdN = -1;
      var kdHost = function(mesh, ii){
        if(!L6_KD || !L6_KD.list) return null;
        if(_kdIdx === null || _kdN !== L6_KD.list.length || !_kdIdx.has(mesh)){ _kdIdx = new Map(); _kdN = L6_KD.list.length;
          L6_KD.list.forEach(function(q){ if(!q.im) return; var a = _kdIdx.get(q.im); if(!a){ a = []; _kdIdx.set(q.im, a); } a[q.ii] = q; }); }
        var a = _kdIdx.get(mesh); return a && a[ii] ? a[ii].host : null;
      };
      t2Pick = function(cx, cy){
        ndc.x = ((cx - VX)/VW)*2 - 1; ndc.y = -((cy - VY)/VH)*2 + 1;
        ray.setFromCamera(ndc, camera);
        var meshes = [], kd = new Set();
        Object.keys(inst).forEach(function(k){ if(k !== "base" && k !== "kbase" && k !== "crate" && inst[k] && inst[k].mesh && inst[k].mesh.visible) meshes.push(inst[k].mesh); });
        if(MB.mesh && MB.mesh.visible) meshes.push(MB.mesh);
        if(typeof L6_KD !== "undefined" && L6_KD.mesh) Object.keys(L6_KD.mesh).forEach(function(g){ var q = L6_KD.mesh[g]; if(q && q.visible){ kd.add(q); meshes.push(q); } });
        var hits = ray.intersectObjects(meshes, false);
        for(var i=0;i<hits.length;i++){
          var h = hits[i], b, n;
          if(kd.has(h.object)){ b = kdHost(h.object, h.instanceId); if(!b || b.dead) continue; if(b.anchor) return null;   // dress on the ground slab: not a building
            n = ray.ray.direction.clone().negate(); return { block:b, point:h.point.clone(), normal:n, kd:true }; }
          b = h.object.userData && h.object.userData.list ? h.object.userData.list[h.instanceId] : null;
          if(!b || b.dead) continue;
          n = h.face ? h.face.normal.clone().applyQuaternion(b.Q).normalize() : ray.ray.direction.clone().negate();
          if(n.dot(ray.ray.direction) > 0) n.negate();   // always the face toward the finger
          return { block:b, point:h.point.clone(), normal:n };
        }
        return null;
      };
      pick = t2Pick;
      if(window.__blast.feel) window.__blast.feel.q2 = false;   // feel Q2 forgiving taps / ghost snap (TAPEXACT)
      var snap0 = v5Snap; v5Snap = function(b, p){ return T2.exact ? p : snap0.apply(this, arguments); };
      // T2: undo / x never remove (hidden by CSS; their clicks are swallowed too)
      ["undo", "chX"].forEach(function(id){ var e = $(id); if(e) e.addEventListener("click", function(x){ x.stopImmediatePropagation(); x.preventDefault(); }, true); });
      // input time of the release that becomes a tap (pointer timestamps: a slow frame between two taps is not a slow double tap)
      var evT = null;
      window.addEventListener("pointerup", function(e){ evT = e.timeStamp; }, true);
      // "on / near a placed TNT": within NEAR_PX of it on the SAME member the finger is on, or within NEAR_ANY px whatever is under the
      // finger (two legs side by side are ~16 px apart in an opening view: a tap on the next leg must still place)
      var NEAR_ANY = 10;
      var nearCharge = function(x, y){ var h = null, hd = false;
        for(var q=0;q<charges.length;q++){ var c = charges[q]; if(c.fired || (c.def && c.def.kind === "wreck")) continue;
          var s = toScreen(c.mesh.position); if(!s.on) continue; var d = Math.hypot(s.x - x, s.y - y);
          if(d <= NEAR_ANY) return c;
          if(d <= NEAR_PX){ if(!hd){ hd = true; h = t2Pick(x, y); } if(!h || h.block === c.host) return c; } }
        return null; };
      var logT = function(s){ T2.log.push(s); if(T2.log.length > 60) T2.log.shift(); };
      var placeAt = function(x, y){
        var h = t2Pick(x, y);
        if(!h){ tapRing(x, y); snd("ui_tap", { gain:0.4 }); if(levelIdx !== 0) toast("Tap a building"); return "miss"; }
        if(h.block.keep){ toast("Protected! Hands off."); snd("protected_hit"); pulseShields(h.block.P, 0.5); return "keep"; }
        T2.exact = true; var r; try{ r = placeCharge(h.block, h.point, h.normal); } finally { T2.exact = false; }
        if(r === "empty"){ tapRing(x, y); if(!t2NoBlast()) toast("Tap BLAST!"); }
        return r;
      };
      var bl0 = function(){ audioInit(); startCountdown(); };   // = the BLAST button's own click
      onTap = function(x, y){
        if(typeof v5UnlockOpen === "function" && v5UnlockOpen()) return;
        var t = evT != null ? evT : performance.now(); evT = null;
        if(phase !== "plan"){ T2.last = null; return; }        // the fuse is not stopped by a tap (nothing to move or remove); BLAST fires it now
        if(selC) selectCharge(null);
        if(bstTap(x, y)){ T2.last = null; return; }            // boosters: their own aim / throw flows
        var L0 = T2.last, tw = tutL1() ? TUT_DBL : null, dbl = !!(L0 && t - L0.t <= (tw ? tw.ms : dblMs()) && t >= L0.t && Math.hypot(x - L0.x, y - L0.y) <= (tw ? tw.px : DBL_PX));
        if(dbl){
          T2.last = null; T2.dbl++;
          var r2 = "first";
          if(!L0.placed && !nearCharge(x, y)) r2 = placeAt(x, y);   // the first tap placed nothing here: the double tap places now
          logT("dbl:" + r2 + ":" + placedCount());
          if(placedCount() > 0){ T2.blasts++; bl0(); }
          return;
        }
        var cur = T2.last = { t:t, x:x, y:y, placed:false };
        if(nearCharge(x, y)){ T2.ignored++; logT("near" + (L0 ? ":" + Math.round(t - L0.t) : "")); return; }   // NOSTACK
        T2.single++;
        var r = placeAt(x, y); cur.placed = r === "ok"; logT("tap:" + r);
      };
      // T5 + the HUD class per level
      t2NoBlast = function(){ return screen === "game" && levelIdx === 0 && !manual; };
      syncNB = function(){ document.body.classList.toggle("t2NoBlast", t2NoBlast()); };
      var shw0 = show; show = function(){ var r = shw0.apply(this, arguments); syncNB(); return r; };
      // ---- H1 / H2 the hand (L1 / L2, first visit only, as the base hand: save.level <= level, first wave)
      var handEl2 = $("hand"), handMode = "";
      var setMode = function(m){ if(m !== handMode){ handMode = m; handEl2.classList.toggle("t2d", m === "dbl"); } };
      var solM = function(k){ var e = L.sol && L.sol[k]; if(!e) return null; var m = selectMembers(e[1], e[2])[e[3]]; return m && m.b && !m.b.dead ? m.b : null; };
      var lastLive = function(){ for(var q=charges.length-1;q>=0;q--){ var c = charges[q]; if(!c.fired && c.def && c.def.kind !== "wreck") return c; } return null; };
      var blastPt = function(){ var bb = $("blast").getBoundingClientRect(); return bb.width ? { x:bb.left + bb.width*0.62, y:bb.top + bb.height*0.45 } : null; };
      var sh0 = stepHand, inCardEl = $("inCard");
      stepHand = function(){
        if(tutRef()) return;
        if(manual || screen !== "game" || levelIdx > 1 || tutDone(levelIdx) || wave > 1 ){ setMode(""); tutStep(null); return levelIdx > 1 || !tutDone(levelIdx) ? sh0.apply(this, arguments) : hand(null); }
        if(inCardEl && !inCardEl.classList.contains("hidden")){ setMode(""); hand(null); tutStep(null); return; }   // under an intro card: no hand
        var n = placedCount(), pt = null, m;
        if(levelIdx === 0){
          if(phase === "plan"){ if(n === 0){ m = solM(0); if(m){ var s0 = toScreen(v5HandPoint(m)); pt = s0.on ? s0 : null; } }
            else { var c = lastLive(); if(c){ var s1 = toScreen(c.mesh.position); pt = s1.on ? s1 : null; } } }
          setMode(pt ? "dbl" : ""); hand(pt); tutStep(phase === "plan" ? pt : null, n); return;
        }
        if(phase === "plan" && n < 2){ m = solM(n); if(m){ var s2 = toScreen(v5HandPoint(m)); pt = s2.on ? s2 : null; } }
        else if(phase === "plan" || (phase === "count" && autoCount)) pt = blastPt();
        setMode(pt ? "tap" : ""); hand(pt); tutStep(null); tutPop();
      };
      api.hand = function(){ var r = handEl2.getBoundingClientRect(); return { on:!handEl2.classList.contains("hidden"), mode:handMode, x:r.left + 18, y:r.top + 4 }; };
      // ---- TUTORIAL v2 (15/11/2026, Owner on TestFlight build 3: "L1 did not teach the double tap, nothing introduced BLAST").
      // Figma <figma-file> page "Intro cards premium (14/11)": 128:1100 (L1 v2), 128:1121 (L2 BLAST pop). Status: TUTORIAL-STATUS.md.
      //   K1 the L1 / L2 teach is keyed by its own "done" mark (save.intro.t2l1 / t2l2), no longer by save.level: replaying L1 / L2 with an
      //      old save teaches until the lesson is DONE (the first blast on L1, the first BLAST on L2), not merely seen.
      //   K2 tutorial version (save.tutv = TUT_V): a save from an older build (no / lower tutv) gets the changed lessons once more:
      //      the L1 / L2 marks and the L2 "New: BLAST" card mark are cleared (in memory; written with the next save).
      //   L1 dim + gold spotlight on the post (then on the placed TNT), two "tap-tap" ripples on the hand's two presses, label "Double-tap!";
      //      before the first TNT only the spotlight takes taps (others swallowed, the ring flashes); after it any tap works; a slower
      //      double tap (<= 600 ms, <= 40 px) still counts; the lesson ends (and is marked) at the first blast.
      //   L2 the BLAST button pops in with a gold glow (3 pulses) the first time it shows, after the "New: BLAST" card; the hand: A, B, BLAST.
      var TUT_V = 2;
      (function(){ var o = null; try{ o = JSON.parse(localStorage.getItem(SAVE_KEY) || "null"); }catch(e){}
        var v = o && typeof o.tutv === "number" ? o.tutv : 0;
        if(v < TUT_V){ if(!save.intro) save.intro = {}; ["t2l1", "t2l2", "blast"].forEach(function(k){ delete save.intro[k]; }); T2.tutOld = !!o; T2.tutPast = !!o && (o.level|0) >= 2; }
        save.tutv = TUT_V; })();
      var tutKey = function(i){ return i === 0 ? "t2l1" : i === 1 ? "t2l2" : null; };
      tutDone = function(i){ var k = tutKey(i); return !k || !!(save.intro && save.intro[k] && save.intro[k].f); };
      var tutMark = function(i){ var k = tutKey(i); if(!k || tutDone(i)) return; if(!save.intro) save.intro = {}; save.intro[k] = { f:1 }; writeSave(); T2.log.push("tutDone:" + k); };
      tutL1 = function(){ return !manual && screen === "game" && levelIdx === 0 && !tutDone(0) && phase === "plan" && wave <= 1; };
      var tcss = document.createElement("style"); tcss.id = "t2TutCss";
      tcss.textContent = [
        "#t2Dim{position:fixed;inset:0;z-index:22;pointer-events:none;animation:t2Fade .25s ease-out both}",
        "#t2Dim.hidden,#t2Lbl.hidden{display:none}",
        "#t2Hole{position:absolute;border-radius:50%;box-sizing:border-box;border:4px solid #FFC633;box-shadow:0 0 0 200vmax rgba(27,20,48,.6),0 0 18px 6px rgba(255,198,51,.55),inset 0 0 14px 2px rgba(255,198,51,.45);animation:t2Pulse 1.6s ease-in-out infinite}",
        "#t2Hole.no{animation:t2No .35s ease-in-out}",
        // two ripples on the hand's two presses (t2Dbl: presses at 12 % and 26 % of 1.6 s)
        ".t2Rip{position:absolute;width:56px;height:56px;margin:-28px 0 0 -28px;border-radius:50%;border:5px solid #FFF8E1;box-sizing:border-box;opacity:0}",
        "#t2Rip1{animation:t2Rip1 1.6s ease-out infinite}#t2Rip2{animation:t2Rip2 1.6s ease-out infinite}",
        "@keyframes t2Rip1{0%,11%{transform:scale(.3);opacity:0}12%{transform:scale(.3);opacity:.95}40%{transform:scale(1.5);opacity:0}100%{opacity:0}}",
        "@keyframes t2Rip2{0%,25%{transform:scale(.3);opacity:0}26%{transform:scale(.3);opacity:.95}56%{transform:scale(2);opacity:0}100%{opacity:0}}",
        "@keyframes t2Pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}",
        "@keyframes t2No{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}",
        "@keyframes t2Fade{from{opacity:0}to{opacity:1}}",
        // label: cream pill, ink outline + lip (Figma "Label · 'Double-tap!'"), Lilita (--ul-fr) 26 px
        "#t2Lbl{position:fixed;z-index:24;left:0;top:0;padding:6px 16px 8px;border-radius:22px;background:#FFF4DC;border:4px solid #2B2140;box-shadow:0 4px 0 #2B2140;font:400 26px/1 var(--ul-fr,'Lilita One'),system-ui,sans-serif;color:#2B2140;white-space:nowrap;pointer-events:none;will-change:transform;animation:t2Fade .25s ease-out both}",
        // L2: BLAST pops in the first time (scale .4 -> 1.15 -> 1, 450 ms) + 3 gold glow pulses
        "html.t2 body #blast.t2Pop{animation:t2Pop .45s cubic-bezier(.2,.9,.3,1.25) both,t2Glow .8s ease-in-out .45s 3}",
        "html.t2 body #blast.t2Glow2{animation:t2Glow .8s ease-in-out 3}",
        "@keyframes t2Pop{0%{scale:.4;opacity:0}60%{scale:1.15;opacity:1}100%{scale:1;opacity:1}}",
        "@keyframes t2Glow{0%,100%{filter:drop-shadow(0 0 0 rgba(255,198,51,0))}50%{filter:drop-shadow(0 0 14px rgba(255,198,51,1)) drop-shadow(0 0 4px #FFF8E1)}}",
        "body.paused #t2Dim,body.paused #t2Lbl{display:none!important}",
        "html.rm #t2Hole,html.rm .t2Rip,html.rm #t2Dim,html.rm #t2Lbl,html.rm body #blast.t2Pop,html.rm body #blast.t2Glow2{animation:none!important}html.rm #t2Rip1{opacity:.8;transform:scale(1)}",
        "@media (prefers-reduced-motion:reduce){#t2Hole,.t2Rip,#t2Dim,#t2Lbl,html.t2 body #blast.t2Pop,html.t2 body #blast.t2Glow2{animation:none!important}#t2Rip1{opacity:.8;transform:scale(1)}}"
      ].join("\n");
      document.head.appendChild(tcss);
      var tDim = document.createElement("div"); tDim.id = "t2Dim"; tDim.className = "hidden"; tDim.setAttribute("aria-hidden", "true");
      tDim.innerHTML = '<div id="t2Hole"></div><div class="t2Rip" id="t2Rip1"></div><div class="t2Rip" id="t2Rip2"></div>';
      document.body.appendChild(tDim);
      var tLbl = document.createElement("div"); tLbl.id = "t2Lbl"; tLbl.className = "hidden"; tLbl.textContent = "Double-tap!"; tLbl.setAttribute("role", "status");
      document.body.appendChild(tLbl);
      var TUT = { pt:null, r:40, n:0, on:false, blocked:0, popped:-1, sawPlan:false, nearT:0 };
      tutStep = function(pt, n){
        var on = !!pt && tutL1();
        if(levelIdx === 0 && TUT.sawPlan && phase !== "plan" && phase !== "count" && !tutDone(0) && screen === "game" && !manual) tutMark(0);   // the first blast ends the lesson
        if(levelIdx === 0 && phase === "plan") TUT.sawPlan = true;
        if(on !== TUT.on){ TUT.on = on; tDim.classList.toggle("hidden", !on); tLbl.classList.toggle("hidden", !on); if(on) T2.log.push("tut:l1"); }
        if(!on){ TUT.pt = null; return; }
        TUT.pt = pt; TUT.n = n | 0;
        var h = $("t2Hole"), d = TUT.r*2;
        h.style.width = h.style.height = d + "px"; h.style.left = Math.round(pt.x - TUT.r) + "px"; h.style.top = Math.round(pt.y - TUT.r) + "px";
        ["t2Rip1", "t2Rip2"].forEach(function(id){ var e = $(id); e.style.left = Math.round(pt.x) + "px"; e.style.top = Math.round(pt.y) + "px"; });
        var lw = tLbl.offsetWidth || 150, lx = Math.max(12, Math.min(innerWidth - lw - 12, pt.x - lw/2)), ly = pt.y - TUT.r - 62;
        if(ly < 120) ly = pt.y + TUT.r + 64;   // no room above: under the hand
        tLbl.style.transform = "translate3d(" + Math.round(lx) + "px," + Math.round(ly) + "px,0)";
      };
      // L2: the BLAST pop, once per level start, when the button shows with no card over it
      tutPop = function(){
        if(levelIdx !== 1 || tutDone(1) || manual || screen !== "game") return;
        var b = $("blast"); if(!b || !b.getBoundingClientRect().width || getComputedStyle(b).visibility === "hidden") return;
        // second beat: both TNT placed, the hand moves to BLAST: the gold glow pulses again (once)
        if(TUT.popped === lvStart && TUT.glowed !== lvStart && phase === "plan" && placedCount() >= 2){ TUT.glowed = lvStart; b.classList.remove("t2Glow2"); void b.offsetWidth; b.classList.add("t2Glow2"); T2.log.push("tut:blastGlow");
          setTimeout(function(){ b.classList.remove("t2Glow2"); }, 2600); return; }
        if(TUT.popped === lvStart) return;
        TUT.popped = lvStart; b.classList.remove("t2Pop"); void b.offsetWidth; b.classList.add("t2Pop"); T2.log.push("tut:blastPop");
        setTimeout(function(){ b.classList.remove("t2Pop"); }, 3000);
      };
      // K3 refresher for a save from an older build that is already past L2 (it can not replay L1: the map plays the current level only):
      // once, on a level >= 3 with >= 1 TNT placed and 4 s without a tap in planning, the hand double-taps the last TNT + "Double-tap!"
      // (no dim, nothing blocked); ends at that level's first blast (saved as intro.t2ref).
      TUT.lastTap = 0; TUT.refLv = -1;
      tutRef = function(){
        var on = !!T2.tutPast && !(save.intro && save.intro.t2ref) && !manual && screen === "game" && levelIdx >= 2 && wave <= 1 && !selC;
        if(on && TUT.refLv === lvStart && phase !== "plan" && phase !== "count"){ save.intro.t2ref = { f:1 }; writeSave(); T2.log.push("tutDone:t2ref"); on = false; }
        var dimOn = $("inDim") && !$("inDim").classList.contains("hidden"), cardOn = inCardEl && !inCardEl.classList.contains("hidden");
        if(!on || phase !== "plan" || dimOn || cardOn || placedCount() < 1 || performance.now() - TUT.lastTap < 4000){ if(TUT.refOn){ TUT.refOn = false; tLbl.classList.add("hidden"); setMode(""); hand(null); } return false; }
        var c = lastLive(), sp = c ? toScreen(c.mesh.position) : null; if(!sp || !sp.on) return false;
        if(!TUT.refOn){ TUT.refOn = true; TUT.refLv = lvStart; tLbl.classList.remove("hidden"); T2.log.push("tut:ref"); }
        setMode("dbl"); hand(sp);
        var lw = tLbl.offsetWidth || 150; tLbl.style.transform = "translate3d(" + Math.round(Math.max(12, Math.min(innerWidth - lw - 12, sp.x - lw/2))) + "px," + Math.round(sp.y < 190 ? sp.y + 100 : sp.y - 102) + "px,0)";
        return true;
      };
      // block wrong taps on L1 before the first TNT: only the spotlight takes a tap
      var ot2 = onTap;
      onTap = function(x, y){
        TUT.lastTap = performance.now();
        if(TUT.on && TUT.pt && TUT.n === 0 && phase === "plan" && Math.hypot(x - TUT.pt.x, y - TUT.pt.y) > TUT.r + 14 && !(typeof v5UnlockOpen === "function" && v5UnlockOpen())){
          TUT.blocked++; T2.last = null; evT = null; T2.log.push("tutBlocked");
          var h = $("t2Hole"); h.classList.remove("no"); void h.offsetWidth; h.classList.add("no"); return;
        }
        // a beginner's SLOW double tap on the placed TNT (two taps on it, any pace) still blasts during the L1 lesson: a tap on a TNT
        // does nothing else (NOSTACK), so a second one can only mean "blast"; never a dead end
        if(TUT.on && TUT.n > 0 && phase === "plan" && nearCharge(x, y)){ var tq = evT != null ? evT : performance.now();
          if(TUT.nearT && tq - TUT.nearT > (TUT_DBL.ms)){ evT = null; T2.last = null; TUT.nearT = 0; T2.log.push("tutSlowDbl"); T2.blasts++; bl0(); return; }
          TUT.nearT = tq; } else if(TUT.on) TUT.nearT = 0;
        var ph0 = phase, r = ot2.apply(this, arguments);
        if(levelIdx === 1 && ph0 === "plan" && phase !== "plan" && !manual) tutMark(1);
        return r;
      };
      // the BLAST button on L2 marks the lesson too (bl0 is the button's own call)
      var bbtn = $("blast"); if(bbtn) bbtn.addEventListener("click", function(){ setTimeout(function(){ if(levelIdx === 1 && phase !== "plan" && !manual) tutMark(1); }, 0); });
      var lvStart = 0; var slT = startLevel; startLevel = function(){ lvStart++; TUT.lastTap = performance.now(); TUT.sawPlan = false; TUT.blocked = 0; TUT.nearT = 0; tutStep(null); return slT.apply(this, arguments); };
      api.tut = function(){ var hb = $("t2Hole").getBoundingClientRect();
        return { v:TUT_V, old:!!T2.tutOld, l1:TUT.on, n:TUT.n, hole:TUT.on ? { x:hb.left + hb.width/2, y:hb.top + hb.height/2, r:hb.width/2 } : null, label:TUT.on ? tLbl.textContent : null,
          blocked:TUT.blocked, done:{ l1:tutDone(0), l2:tutDone(1), ref:!!(save.intro && save.intro.t2ref) }, past:!!T2.tutPast, ref:!!TUT.refOn, pop:$("blast").classList.contains("t2Pop"), popped:TUT.popped === lvStart }; };
    }
    // ---- R1 street rule off (after the build: the road stays as scenery, streetZ is the build's own)
    var stS = function(){ if(!T2.street || !L || !L.street) return; L._t2st = L.street; L.street = null;
      var ce = $("collat"); if(ce){ ce.innerHTML = collatTxt = L.keep ? '<svg class="i s24 w"><use href="#i-shield"/></svg>' + " Safe" : ""; ce.classList.remove("bad"); ce.classList.toggle("hidden", screen !== "game" || !L.keep); } };
    var bb0 = buildBodies; buildBodies = function(){ var had = T2.street && L && L._t2st && !L.street; if(had) L.street = L._t2st; try{ return bb0.apply(this, arguments); } finally { if(had){ L.street = null; } } };
    // road / lot / stacking words are dropped from tips and fail lines (whole sentences); nothing left = a general principle
    var DROP = /\b(road|street|lot|stack|stacked|stacking)\b/i;
    var clean = function(s){ if(s == null || !T2.street) return s; var t = String(s), lines = t.split("\n").map(function(l){ return (l.match(/[^.!?:]+[.!?:]*\s*/g) || []).filter(function(x){ return !DROP.test(x); }).join("").trim(); }).filter(Boolean);
      return lines.length ? lines.join("\n") : (t.trim() ? "Find what carries the weight." : t); };
    if(typeof M14 !== "undefined" && M14.api && M14.api.nohint){ var nh0 = M14.api.nohint; M14.api.nohint = function(s){ return clean(nh0.apply(this, arguments)); }; }
    var lt0 = levelTip; levelTip = function(){ return clean(lt0.apply(this, arguments)); };
    var ft0 = failTip; failTip = function(r){ return clean(ft0.apply(this, arguments)); };
    api.clean = clean;
    // ---- R2 no Target Lot
    if(T2.lot && V5_PARTS.lot6){ V5_PARTS.lot6 = function(P){ return { w:P.w || 8, d:P.d || 8 }; }; }
    // ---- R3 coins
    var t2Reward = function(Lv){ return !Lv ? 0 : Lv.boss ? 30 : isHard(Lv) ? 20 : 10; };
    var cn = { cuts:0, adj:0 };
    var sl0 = startLevel; startLevel = function(){ cn.cuts = 0; cn.adj = 0; T2.last = null; var r = sl0.apply(this, arguments); stS(); if(T2.on) syncNB(); return r; };
    var sr0 = showResult; showResult = function(){
      var r = lastResult;
      if(T2.coin && r && !r._t2c && !manual){ r._t2c = 1;
        cn.cuts += r.cut || 0;
        var want = r.ok ? (api.payout ? api.payout(t2Reward(L), L) : t2Reward(L)) : 0, net = levelCoins - cn.cuts + cn.adj, d = want - net;   // api.payout: Coin Bonus (main/shop.js, D-blast-SHOP)
        save.coins = Math.max(0, save.coins + d); cn.adj += d;
        r.debrisCoins = 0; r.bonus = r.ok ? want : 0; r.coins = want; r.t2Reward = want; r.cut = 0;
        writeSave(); $("coinTxt").textContent = save.coins; hudCoins = save.coins; if($("hCoinTxt")) $("hCoinTxt").textContent = save.coins;
      }
      return sr0.apply(this, arguments);
    };
  })();
