// ---- uiclean v14 (uiclean/patch.js; uiclean/COMPARE-BEFORE.md): UI only, no gameplay / economy change
try{ (function(){
  "use strict";
  var root = document.documentElement, $u = function(id){ return document.getElementById(id); };
  // M4: --uic-48 = 48 CSS px in Home plate px (the plate is scaled by --ups); the Home buttons use it as their floor
  var hitK = "";
  function uicHit(){
    var s = parseFloat(getComputedStyle(root).getPropertyValue("--ups")) || 0; if(!(s > 0)) return;
    var v = (48/s).toFixed(1) + "px"; if(v === hitK) return; hitK = v; root.style.setProperty("--uic-48", v);
  }
  new MutationObserver(uicHit).observe(root, { attributes:true, attributeFilter:["style"] });
  uicHit();
  // E3 / E4: body classes for the tray during the collapse and for the result card
  function uicBusy(){
    var busy = screen === "game" && (phase === "boom" || phase === "settle" || phase === "done");
    document.body.classList.toggle("uicBusy", busy);
    document.body.classList.toggle("uicCoins", busy || screen === "result" || screen === "shop");   // H4
  }
  if(QS.get("uictags") === "0") document.body.classList.add("uicNoTags");   // H3 reverted (Owner N11): tags on unless ?uictags=0
  var _show = show; show = function(id){ var r = _show.apply(this, arguments); document.body.classList.toggle("uicRes", id === "result" && !(lastResult && lastResult.ok));
    document.body.classList.toggle("uicWin", id === "result" && !!lastResult && !!lastResult.ok); uicBusy(); return r; };
  // K1: the one TNT chip shown as a counter badge (CSS); here: the body classes, a bump when the count changes, a11y label
  var bombN = null;
  function uicBomb(){
    var cs = $u("chips") ? $u("chips").children : [], one = cs.length === 1, inLv = screen === "game";
    document.body.classList.toggle("uicOneBomb", one);
    document.body.classList.toggle("uicBoss", inLv && !!(L && L.boss));
    document.body.classList.toggle("uicNoTip", inLv && levelIdx > 1);
    document.body.classList.toggle("uicKeepTag", inLv && !!(L && L.keep) && !(L && L.street));
    if(!one){ bombN = null; return; }
    var c = cs[0], k = c.dataset.k, n = stock[k] | 0;
    c.dataset.z = n > 0 ? "0" : "1"; c.tabIndex = -1; c.setAttribute("aria-label", (CHARGES[k] ? CHARGES[k].name : "TNT") + " left: " + n);
    if(bombN !== null && n !== bombN && c.animate && !REDUCED) c.animate([{ transform:"scale(1)" }, { transform:"scale(1.18)" }, { transform:"scale(1)" }], { duration:220, easing:"ease-out" });
    bombN = n;
  }
  var _sync = syncHUD; syncHUD = function(){ var r = _sync.apply(this, arguments); uicBusy(); uicBomb(); return r; };
  var _bc = buildChips; buildChips = function(){ var r = _bc.apply(this, arguments); bombN = null; uicBomb(); return r; };
  // S3: in-play words. Toasts in a level: only the empty-tap nudge; the pop words (COMBO / TIMBER! / CLEARED! ...) not at all
  // (their sounds, flashes and coins stay). Menus (Home, map, shop, settings) keep their toasts.
  var NUDGE = { "Tap a building":1, "Tap the building":1, "Protected! Hands off.":1 };   // 18/11 (UX-30 / GD-28): a tap on a blue building says why nothing was placed
  var _toast = toast; toast = function(msg){ if(screen === "game" && !NUDGE[msg]) return; return _toast.apply(this, arguments); };
  var _pop = popText; popText = function(){ if(screen === "game") return; return _pop.apply(this, arguments); };
  // S1: a won level has no card (Smash Fest): coins fly from the rubble to the pill, "+N" once, then Home by itself
  window.uicFlySrc = function(){
    if(!document.body.classList.contains("uicWin")) return null;
    var p = toScreen({ x:focus.x, y:Math.max(0.5, focusY*0.5), z:focus.z }); return { left:p.x - 30, right:p.x + 30, top:p.y - 10, bottom:p.y + 10, width:60, height:20 };
  };
  var plus = document.createElement("div"); plus.id = "uicPlus"; plus.setAttribute("aria-live", "polite"); document.body.appendChild(plus);
  function uicWinFx(r){
    var n = (r.debrisCoins || 0) + (r.bonus || 0), c = $u("coinPill").getBoundingClientRect();
    try{ screenFlash(0.12); }catch(e){}
    if(!r.bonus){ try{ bumpPill(); }catch(e){} }
    plus.textContent = "+" + n; plus.style.left = (c.left - 10) + "px"; plus.style.top = (c.top + c.height/2) + "px";   // left of the coin pill, same row
    if(plus.animate && !REDUCED) plus.animate([{ opacity:0, transform:"translate(-100%,-50%) scale(.6)" }, { opacity:1, transform:"translate(-100%,-50%) scale(1.15)", offset:0.25 },
      { opacity:1, transform:"translate(-100%,-60%) scale(1)", offset:0.75 }, { opacity:0, transform:"translate(-100%,-75%) scale(1)" }], { duration:1500, easing:"ease-out" });
    else { plus.style.opacity = 1; setTimeout(function(){ plus.style.opacity = 0; }, 1400); }
    // H1: an open unlock card (#bNew, boosters2: the boss win grants a booster) holds the return to Home until it is closed
    var home = function(){ if(lastResult !== r || screen !== "result") return; var nc = $u("bNew"); if(nc && !nc.classList.contains("hidden")){ setTimeout(home, 300); return; } goHome(); };
    setTimeout(home, UIC_HOME_MS);
  }
  var UIC_HOME_MS = Math.max(800, +(QS.get("uichome") || 2000));   // ?uichome=<ms>: hold the win moment longer (review captures)
  var _sr = showResult; showResult = function(){
    var r = lastResult, res = _sr.apply(this, arguments);
    if(r && r.ok && screen === "result") uicWinFx(r);
    return res;
  };
  // ---- labels (TYPE-BUTTONS.md: buttons and level labels in Title case; BLAST!, NEW!, ribbons, HARD / BOSS tags stay UPPER)
  // Owner N4: the Home button says "Play" (the level number stays on the crane sign); its colour carries Hard (purple) / Boss (orange)
  var LBL = { "TRY AGAIN":"Try Again", "Try again":"Try Again", "Skip for now":"Skip for Now", "GOT IT":"Got It", "TRY IT":"Try It", "DONE":"Done", "PLAY":"Play", "CONTINUE":"Continue" };
  function lbl(el, fn){ if(!el) return; var busy = false, run = function(){ if(busy) return; busy = true; try{ fn(el); }catch(e){} busy = false; };
    new MutationObserver(run).observe(el, { childList:true, characterData:true, subtree:true }); run(); }
  function fixText(el){ var t = el.textContent; if(LBL[t] && el.children.length === 0) el.textContent = LBL[t]; }
  ["rNext", "rAgain", "bnOk", "setClose", "bpPlay", "resetYes", "resetNo"].forEach(function(id){ lbl($u(id), fixText); });
  function bossAt(i){ var d = levelDef(i % LEVELS.length) || {}; return !!d.boss; }
  lbl($u("play"), function(el){ if(el.textContent !== "Play") el.textContent = "Play"; el.classList.toggle("ulLong", false); el.classList.toggle("uicBossT", bossAt(save.level));
    el.setAttribute("aria-label", "Play level " + (save.level + 1)); });
  lbl($u("cmPlay"), function(el){ var m = /^PLAY LV (\d+)$/.exec(el.textContent); if(m) el.textContent = "Level " + m[1]; el.classList.toggle("uicBossT", bossAt(save.level)); });
  lbl($u("shopPlay"), function(el){ var m = /^PLAY LV (\d+)$/.exec(el.textContent); if(m){ el.textContent = "Level " + m[1]; el.classList.toggle("uicBossT", bossAt(+m[1] - 1)); } });
  lbl($u("lvTxt"), function(el){ var n = el.firstChild; if(n && n.nodeType === 3 && /^LEVEL /.test(n.textContent)) n.textContent = n.textContent.replace(/^LEVEL /, "Level "); });
  // ---- in-play district themes stay ON (Owner approved 7 districts with their own palettes; N8 = the City Map only, which is
  // already one plate / one look). ?districts=0 locks every level to the first district's sky / light / ground / slab colours
  if(QS.get("districts") === "0"){
    var _theme = applyTheme; applyTheme = function(){ return _theme.call(this, 0); };
    levelPalette = function(Lv, i){ i = Math.max(0, i | 0); return PALETTES_D[0][i % 3]; };   // theme 0, same 3-colour cycle
    try{ applyTheme(0); }catch(e){}
  }
  // E6: Settings has no "Booster confirmation" row while every booster is hidden (v31: until L13 / L16 are rebuilt)
  function uicSet(){
    var t = $u("bconfTog"); if(!t || typeof BOOST === "undefined") return;
    var any = (typeof BOOST_ORDER !== "undefined" ? BOOST_ORDER : Object.keys(BOOST)).some(function(k){ return BOOST[k] && !BOOST[k].hidden && (typeof bstUnlocked !== "function" || bstUnlocked(k)); });
    t.classList.toggle("hidden", !any);
  }
  uicSet(); var g = $u("gearBtn"); if(g) g.addEventListener("click", uicSet);
  window.__blast.uiclean = { bomb:function(){ var c = document.querySelector("#chips .chip"); return { one:document.body.classList.contains("uicOneBomb"), n:bombN, label:c ? c.getAttribute("aria-label") : null }; }, busy:function(){ return document.body.classList.contains("uicBusy"); }, hit:function(){ return hitK; },
    bconf:function(){ var t = $u("bconfTog"); return !!t && !t.classList.contains("hidden"); } };
})(); }catch(e){ console.error("uiclean", e); }
// ---- end uiclean v14
