  // ---- main/sflay.js (build step "sflay", main/sflay-patch.js; Khai 22/11/2026: the "SF-style corners" in-level layout of the 18/11 demo
  // (floormen games/blast/main/sflay.js, feedback/2026-11-18/sflay/) into the MAIN build, ON by default). Our own art, no third-party art.
  // Appended inside main() after g7-hard (the play order is final), before the Mac's rs-look (the last step). ?sflay=0 = the old layout.
  //   S1 TNT card top-left (our TNT chip, x1.5; x1.38 under 380 px wide), fixed to the screen.
  //   S2 Pause / Settings round button top-right with the gear icon (Pause already holds the Settings rows). The LV picker button
  //      (on by default, ?dev=0 = off) hangs under the TNT card instead of under the old Pause slot.
  //   S3 Level label small, top-centre. The demolition meter (thin, 85% tick) only once BLAST is pressed.
  //   S4 Boosters = round buttons in the two bottom corners: Ball (low) + Net (high) on the left, Sky Strike on the right. 3 buttons, not the
  //      demo's 4: the demo's 4th slot was a "more soon" padlock that never opens (main has 3 boosters, +1 TNT is hidden, L6.tntOnly);
  //      a padlock that no level ever opens reads as a broken promise. Locked = the round button with a padlock only (no Lv.N text);
  //      a tap on it = padlock wiggle + tick (no words). A transparent catcher sits on each locked button (a disabled button gets no taps).
  //   S5 BLAST bottom-centre between the two columns, sized to fit between them (>= 10 px clear of each column).
  //   S6 Planning camera: hero front-on (old L4 / L5 keep their tuned yaw: A1 lessons), pitch lower, ~90% of the width (or 92% of the play
  //      height), centred between the top row and the booster columns. Only main/frame.js's opening config (CF) is changed, per level.
  //      Hard levels (L.hard7, frame.js F4 "whole lot") and boss levels (frame.js F5 guard) keep main's CF untouched.
  // #bottom stays a real bottom band (only its height and children move): every layer that reads #bottom's top (intro spotlight field
  // targets, R20 probe, the camera's play area through botH) keeps working; the TNT card leaves the band with position:fixed.
  // Test API window.__blast.sflay: on(), geo(), rects(), cam, frameDefault, fit(), wig.
  (function(){
    var Qs = new URLSearchParams(location.search);
    if(Qs.get("sflay") === "0"){ window.__blast.sflay = { on:function(){ return false; } }; return; }
    var H = document.documentElement; H.classList.add("sfl");
    var KEEP_YAW = { 4:1, 5:1 };   // old level numbers (LV7O.orig1) whose opening yaw teaches the lesson (A1 L4, L5)
    var CAM = { pitch:+(Qs.get("sfpitch") || 0.12), fillW:+(Qs.get("sffw") || 0.90), fillH:+(Qs.get("sffh") || 0.92), on:Qs.get("sfcam") !== "0" };
    var KS = ["wreck", "net", "sky"];
    // opt-in flags of polish kept meaning the same here: ?lockchips=0 = locked boosters hidden until their unlock (no padlock);
    // ?polear=0 = Pause (the gear) centred on the level label's row, below the top inset, instead of in the ear
    var NOLK = Qs.get("lockchips") === "0", NOEAR = Qs.get("polear") === "0";
    var st = document.createElement("style"); st.id = "sflayCss";
    var P = "html.sfl body", B = P + " #bottom#bottom";
    st.textContent = [
      // the band: #bottom keeps its place at the bottom edge, full width, height = the two booster rows; only its buttons catch touches
      B + "{top:auto!important;bottom:0!important;left:0!important;right:0!important;max-width:none!important;margin:0!important;height:var(--sfBand)!important;padding:0!important;pointer-events:none;background:none!important}",
      B + ":not(.hidden){display:block!important}",
      B + " #row, " + B + " #chips, " + B + " #bbar{display:contents!important}",
      B + " .chip, " + B + " .bst, " + B + " #blast, " + B + " #undo, " + B + " .sfLk{pointer-events:auto}",
      // S1 TNT card top-left, out of the band
      B + " #chips .chip{position:fixed!important;left:var(--sfSide)!important;top:var(--sfCT)!important;right:auto!important;bottom:auto!important;margin:0!important;scale:var(--sfCardK);transform-origin:0 0;z-index:21}",
      B + " #chips .chip ~ .chip{display:none!important}",
      // S2 Pause / Settings top-right
      P + " #top#top{pointer-events:none}",
      P + " #top#top > *{pointer-events:auto}",
      P + " #top#top #pauseBtn#pauseBtn{left:auto!important;right:var(--sfSide)!important;top:var(--sfGT)!important;scale:1.12;transform-origin:100% 0}",
      P + " #lvBtn#lvBtn{left:var(--sfSide);top:var(--sfDevT)}",
      // S3 level label top-centre, meter under it after BLAST only
      P + " #top#top #lvPill#lvPill{left:50%!important;right:auto!important;top:var(--sfRT)!important;translate:-50% 0!important;margin:0!important;border-radius:999px!important;padding:0 14px!important;min-width:0!important;z-index:2}",
      P + " #top#top #lvPill#lvPill::before, " + P + " #top#top #lvPill#lvPill::after{display:none!important}",
      P + " #top#top #meter#meter{left:50%!important;right:auto!important;top:calc(var(--sfRT) + var(--sfPillH) + 8px)!important;translate:-50% 0!important;width:var(--sfMW)!important;margin:0!important;transition:opacity .25s;z-index:1}",
      "html.sfl:not(.sfBl) body #top#top #meter#meter{opacity:0!important;visibility:hidden!important}",
      "html.sfl.sfBl body:not(.uicWin):not(.uicRes) #top#top #meter#meter #mPass#mPass::after{opacity:1!important}",
      P + " #top#top #coinPill#coinPill{left:auto!important;right:var(--sfSide)!important;top:calc(var(--sfGT) + 66px)!important}",
      // the fail card: polish R20 (UX-54) puts Home in the Pause slot (here top-right) and the coin pill on that row: the pill sits left of Home
      "html.sfl body.uicRes #top#top #coinPill#coinPill{right:calc(var(--sfSide) + var(--sfGW) + 10px)!important}",
      // the tip bubble: under the top row, between the TNT card and the gear
      P + " #tip#tip{top:var(--sfTipT)!important}",
      // S4 boosters: round buttons in the bottom corners (shown locked from L1)
      B + " #bbar .bst{position:absolute!important;width:var(--sfBs)!important;height:var(--sfBs)!important;margin:0!important;left:auto;right:auto;top:auto!important;z-index:3}",
      NOLK ? "" : B + " #bbar .bst.hidden, " + B + " #bbar .bst.polHide{display:grid!important}",
      B + " #bbar .bst[data-k=wreck], " + B + " .sfLk[data-k=wreck]{left:var(--sfSide)!important;bottom:var(--sfB)!important}",
      B + " #bbar .bst[data-k=net], " + B + " .sfLk[data-k=net]{left:var(--sfSide)!important;bottom:var(--sfB2)!important}",
      B + " #bbar .bst[data-k=sky], " + B + " .sfLk[data-k=sky]{right:var(--sfSide)!important;left:auto!important;bottom:var(--sfB)!important}",
      B + " #bbar .bst:not([data-k=wreck]):not([data-k=net]):not([data-k=sky]){display:none!important}",
      // locked look: the round button, a padlock in the middle, nothing else
      B + " #bbar .bst.lock{background:linear-gradient(#E9E4D8,#D6CFBF)!important;opacity:1!important;filter:none!important;border-radius:50%!important}",
      B + " #bbar .bst.lock::before, " + B + " #bbar .bst.lock::after{opacity:0!important}",
      B + " #bbar .bst.lock > :not(.sfPad){display:none!important}",
      B + " .sfPad{display:none}",
      B + " .bst.lock .sfPad{display:grid!important;position:absolute;inset:0;place-items:center;color:#1E2F6B;pointer-events:none;z-index:5}",
      B + " .sfPad, " + B + " .sfPad svg{opacity:1!important;filter:none!important;visibility:visible!important}",
      B + " .sfPad svg{width:44%;height:44%;display:block;color:#1E2F6B!important}",
      // the tap catcher over a locked button (transparent; the button under it draws the padlock)
      B + " .sfLk{position:absolute;width:var(--sfBs);height:var(--sfBs);margin:0;padding:0;border:0;border-radius:50%;background:transparent;z-index:6;cursor:pointer;-webkit-tap-highlight-color:transparent;display:none}",
      B + " .sfLk.on{display:block}",
      // S5 BLAST between the two columns
      B + " #blast#blast{position:absolute!important;left:0!important;right:0!important;top:auto!important;bottom:var(--sfB)!important;margin:0 auto!important;width:var(--sfBlW)!important;height:var(--sfBlH)!important;max-width:none!important;min-width:0!important;flex:none!important}",
      B + " #undo{position:absolute!important;left:calc(var(--sfSide) + var(--sfBs) + 10px)!important;bottom:calc(var(--sfB) + var(--sfBlH) + 8px)!important;top:auto!important;right:auto!important}",
      // the R21 "Skip ahead" pill: centred above BLAST, between the columns
      "html.sfl body #ff#ff{left:50%!important;right:auto!important;translate:-50% 0!important;bottom:calc(var(--sfB) + var(--sfBlH) + 12px)!important}",
      // polish R22 (BUG-1): the 48 px cancel x of an armed Ball / Sky Strike sits on the chip's OUTER upper corner (its top-left corner
      // would cover the Net above the Ball or the end of BLAST beside Sky Strike)
      "html.sfl body #r22X#r22X{top:auto!important;bottom:calc(var(--sfB) + var(--sfBs) - 42px)!important;left:calc(var(--sfSide) - 10px)!important;right:auto!important}",
      "html.sfl.sfXsky body #r22X#r22X{left:auto!important;right:calc(var(--sfSide) - 10px)!important}",
      // the collateral line (fixed, under the top row)
      B + " #collat#collat{top:var(--sfTipT)!important}"
    ].join("\n");
    document.head.appendChild(st);

    var $s = function(id){ return document.getElementById(id); };
    var PAD = '<span class="sfPad"><svg viewBox="0 0 32 32" aria-hidden="true"><use href="#i-lock"/></svg></span>';
    var WIG = { n:0, last:null };
    var wig = function(k){ var b = $s("bbar") && $s("bbar").querySelector('.bst[data-k="' + k + '"]'); WIG.n++; WIG.last = k;
      try{ snd("ui_tap"); }catch(e){} var pd = b && b.querySelector(".sfPad");
      if(pd && pd.animate && !REDUCED) pd.animate([{ transform:"translateX(0)" }, { transform:"translateX(-5px) rotate(-8deg)" }, { transform:"translateX(5px) rotate(8deg)" }, { transform:"translateX(-3px)" }, { transform:"translateX(0)" }], { duration:320, easing:"ease-out" }); };
    var bot = $s("bottom"), LK = {};
    KS.forEach(function(k){ var c = document.createElement("button"); c.type = "button"; c.className = "sfLk"; c.dataset.k = k; c.setAttribute("aria-label", "Locked booster");
      c.addEventListener("click", function(e){ e.stopPropagation(); wig(k); }); LK[k] = c; if(bot) bot.appendChild(c); });
    // every booster button gets a padlock child (shown only while locked); its catcher is on while it is locked
    var padAll = function(){ var bar = $s("bbar"); if(!bar) return;
      [].forEach.call(bar.children, function(b){ if(!b.querySelector(".sfPad")) b.insertAdjacentHTML("beforeend", PAD); });
      KS.forEach(function(k){ var b = bar.querySelector('.bst[data-k="' + k + '"]'), on = !!(b && b.classList.contains("lock") && (!NOLK || b.getBoundingClientRect().width > 0)); if(LK[k].classList.contains("on") !== on) LK[k].classList.toggle("on", on); }); };
    // S2: the gear icon on the Pause button (Pause = Settings rows)
    var gear = function(){ var u = document.querySelector("#pauseBtn use"); if(u && u.getAttribute("href") !== "#i-gear"){ u.setAttribute("href", "#i-gear"); u.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#i-gear"); } var b = $s("pauseBtn"); if(b) b.setAttribute("aria-label", "Pause and settings"); };

    // geometry: safe areas (the --sa-* probe ui2 uses), the cutout (window.__blast.safe), booster / BLAST sizes
    var probe = document.createElement("div"); probe.style.cssText = "position:fixed;left:0;top:0;width:0;height:0;visibility:hidden;pointer-events:none;padding:var(--sa-t,0px) var(--sa-r,0px) var(--sa-b,0px) var(--sa-l,0px)"; document.body.appendChild(probe);
    var G = {};
    var fit = function(){
      var cs = getComputedStyle(probe), t = parseFloat(cs.paddingTop) || 0, b = parseFloat(cs.paddingBottom) || 0, l = parseFloat(cs.paddingLeft) || 0, r = parseFloat(cs.paddingRight) || 0;
      var W = Math.min(innerWidth, VW || innerWidth), cut = window.__blast.safe && window.__blast.safe.cut ? window.__blast.safe.cut() : null;
      var side = 14 + Math.max(l, r), bs = Math.round(Math.max(52, Math.min(64, W*0.158))), gap = 12, bm = Math.max(12, b + 6);
      var cardK = W < 380 ? 1.38 : 1.5, cardT = cut ? 16 : t + 10, rowT = cut ? cut.y + cut.h + 6 : t + 12, gearT = cut ? 22 : t + 14;
      if(NOEAR){ var pq0 = $s("pauseBtn") ? $s("pauseBtn").getBoundingClientRect() : null, gh = pq0 && pq0.height ? pq0.height : 54, ph = $s("lvPill") && $s("lvPill").getBoundingClientRect().height || 33;
        rowT = Math.max(rowT, t + Math.ceil((gh - ph)/2) + 2); gearT = Math.round(rowT + ph/2 - gh/2); }
      var blW = Math.round(W - 2*(side + bs + 10)), blH = Math.round(Math.min(80, Math.max(64, bs*1.22)));
      var mw = Math.round(Math.max(120, Math.min(200, W - 2*(side + 58*cardK + 12))));
      var band = bm + 2*bs + gap;
      var c = document.querySelector("#chips .chip"), cq = c ? c.getBoundingClientRect() : null, cardB = cq && cq.height ? cq.bottom : cardT + 66*cardK;
      G = { side:side, bs:bs, gap:gap, bm:bm, band:band, cardK:cardK, cardT:cardT, rowT:rowT, gearT:gearT, blW:blW, blH:blH, mw:mw, t:t, b:b, cardB:Math.round(cardB) };
      var set = function(k, v){ H.style.setProperty(k, v); };
      set("--sfSide", side + "px"); set("--sfBs", bs + "px"); set("--sfB", bm + "px"); set("--sfB2", (bm + bs + gap) + "px"); set("--sfBand", band + "px");
      set("--sfCardK", String(cardK)); set("--sfCT", cardT + "px"); set("--sfRT", rowT + "px"); set("--sfGT", gearT + "px");
      set("--sfBlW", blW + "px"); set("--sfBlH", blH + "px"); set("--sfMW", mw + "px");
      set("--sfDevT", Math.round(cardB + 10) + "px"); set("--sfTipT", Math.round(cardB + 8) + "px");
      var pb = $s("pauseBtn"), pq = pb ? pb.getBoundingClientRect() : null; set("--sfGW", (pq && pq.width ? Math.round(pq.width) : 54) + "px");
      var lp = $s("lvPill"); set("--sfPillH", (lp && lp.getBoundingClientRect().height ? Math.round(lp.getBoundingClientRect().height) : 32) + "px");
      try{ topDirty = true; botDirty = true; coinTgtOk = false; }catch(e){}
    };
    // the play area for the camera: from under the top row (card / gear / level label / meter, the tip bubble when shown); the bottom is
    // the engine's own botH (the band's top = above the upper booster pair)
    var rect = function(e){ if(typeof e === "string") e = $s(e); if(!e || e.classList.contains("hidden")) return null; var q = e.getBoundingClientRect(); return q.width && q.height ? q : null; };
    topH = function(){
      if(topDirty){
        var y = 0, q;
        [document.querySelector("#chips .chip"), $s("pauseBtn"), $s("lvPill")].forEach(function(e){ if(e && (q = rect(e))) y = Math.max(y, q.bottom); });
        if(H.classList.contains("sfBl") && (q = rect("meter"))) y = Math.max(y, q.bottom + 12);   // "85%" under the tick
        var tp = $s("tip"); if(tp && !tp.classList.contains("hidden") && tp.textContent && (q = rect(tp))) y = Math.max(y, q.bottom);
        var cl = $s("collat"); if(cl && (q = rect(cl))) y = Math.max(y, q.bottom);
        topCache = Math.max(60, y - VY + 8); topDirty = false;
      }
      return topCache;
    };
    // S6 the planning camera: main/frame.js's opening config, per level (its CF object is read at every level start)
    var FCF = window.__blast.frame && window.__blast.frame.cfg ? window.__blast.frame.cfg() : null, F0 = FCF ? Object.assign({}, FCF) : null;
    var CAMLOG = { n:0, kept:0, last:null };
    var sl0 = startLevel;
    startLevel = function(i){
      try{ fit(); }catch(e){}
      try{ if(FCF){ var p = typeof i === "number" ? i : levelIdx, Lv = LEVELS[p] || null, o1 = typeof LV7O !== "undefined" && LV7O.orig1 ? LV7O.orig1(p) : p + 1;
        var keep = !CAM.on || !Lv || !!Lv.hard7 || !!Lv.boss;
        Object.assign(FCF, F0);
        if(!keep){ FCF.pitch = CAM.pitch; FCF.fillW = CAM.fillW; FCF.fillH = CAM.fillH;
          if(KEEP_YAW[o1]){ FCF.yawMin = 0; FCF.yawMax = 9; } else { FCF.yawMin = 0; FCF.yawMax = 0; } }
        CAMLOG.n++; if(keep) CAMLOG.kept++; CAMLOG.last = { slot:p + 1, orig:o1, kept:keep, hard7:!!(Lv && Lv.hard7), boss:!!(Lv && Lv.boss) }; } }catch(e){ console.error("main/sflay.js cam", e); }
      topDirty = botDirty = true;
      var r = sl0.apply(this, arguments);
      try{ padAll(); gear(); fit(); }catch(e){}
      return r;
    };
    // the meter shows once BLAST is pressed (fuse count, collapse, result)
    var lastBl = null;
    setInterval(function(){
      var bl = screen === "game" && (phase === "count" || phase === "boom" || phase === "settle" || phase === "done");
      if(bl !== lastBl){ lastBl = bl; H.classList.toggle("sfBl", bl); topDirty = true; }
      if(screen === "game"){ padAll(); gear(); xSide(); }
    }, 120);
    // polish R20 UX-51 pushes the level cap >= 8 px right of Pause with inline !important left / width (Pause was on its left in the old
    // row); here Pause is top-right and the cap is centred, so those inline values are taken off as soon as they are written
    var UX51 = { n:0 };
    var unPush = function(){ ["lvPill", "meter"].forEach(function(id){ var e = $s(id); if(e && (e.style.getPropertyValue("left") || e.style.getPropertyValue("width"))){ e.style.removeProperty("left"); e.style.removeProperty("width"); UX51.n++; } }); };
    if(window.MutationObserver) ["lvPill", "meter"].forEach(function(id){ var e = $s(id); if(e) new MutationObserver(unPush).observe(e, { attributes:true, attributeFilter:["style"] }); });
    var xSide = function(){ var sk = false; try{ sk = !!(skyArmed && !skyLive) && !(ballAim && !ballLive); }catch(e){} if(H.classList.contains("sfXsky") !== sk) H.classList.toggle("sfXsky", sk); };
    var bs0 = bstSync; bstSync = function(){ try{ xSide(); }catch(e){} var r = bs0.apply(this, arguments); try{ padAll(); xSide(); }catch(e){} return r; };
    fit(); setTimeout(fit, 350); gear();
    window.addEventListener("resize", function(){ setTimeout(fit, 300); });
    // test API: on-screen boxes of the moved controls (null = not shown)
    var R = function(e){ if(typeof e === "string") e = document.querySelector(e); if(!e) return null; var q = e.getBoundingClientRect(), s = getComputedStyle(e);
      return q.width > 0 && q.height > 0 && s.display !== "none" && s.visibility !== "hidden" ? { x:Math.round(q.left), y:Math.round(q.top), w:Math.round(q.width), h:Math.round(q.height), r:Math.round(q.right), b:Math.round(q.bottom) } : null; };
    window.__blast.sflay = { on:function(){ return true; }, geo:function(){ return Object.assign({ top:topH(), bot:botH() }, G); }, cam:CAM, camLog:function(){ return JSON.parse(JSON.stringify(CAMLOG)); },
      frameDefault:F0, fit:fit, ux51:function(){ return UX51.n; }, wig:function(){ return { n:WIG.n, last:WIG.last }; },
      rects:function(){ var o = { tnt:R("#chips .chip"), gear:R("#pauseBtn"), level:R("#lvPill"), meter:R("#meter"), blast:R("#blast"), dev:R("#lvBtn"), ff:R("#ff"), tip:R("#tip"), bottom:R("#bottom") };
        KS.forEach(function(k){ o[k] = R('#bbar .bst[data-k="' + k + '"]'); o[k + "Lk"] = R(LK[k]); var b = $s("bbar") && $s("bbar").querySelector('.bst[data-k="' + k + '"]'); if(o[k]) o[k].lock = !!(b && b.classList.contains("lock")); });
        return o; } };
  })();
  // ---- end main/sflay.js
