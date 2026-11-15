// ---- main/polish.js (build step "polish", main/polish-patch.js; Lead 15/11/2026: group-A fixes from the Smash Fest UX/UI head to head
// (research/h2h-sf-uxui/H2H-UXUI.md) + 2 HUD items from the Car Sort report (research/h2h-carsort/H2H-DESIGN.md F4). Appended at the end
// of main() after "shop", so it wraps the final startLevel / showResult / goHome / stepHand / onTap / updateCamera / bstSync / bstPlay.
// D-blast-NONEW: nothing new; every item restyles, re-times or re-words an existing element. ?polish=0 = none of it.
//  B1  BUG-1 the in-level coin pill shows the real bank: debris coins (a show since D-blast-COIN) never count into it during play; the
//      win reward (tap2 payout, Coin Bonus included) counts up once into it (flyBonus); the lose card shows the same bank.
//  B2  BUG-2 Pause: the off Sound / Music icon stays visible at 45 % under the slash.
//  X1  UX-1 (H2H v2, 15/11): the CLEARED! stamp stays as it is (feel Q7, 1.5 s). The existing "+N" shows at 40 px directly under it
//      (centre, ~42 % height) for 600 ms, then travels to the coin pill in 400 ms; the camera: main/look.js K2 frames hero + debris on
//      the win (centred in the play area); only with that off (?look=0 / ?frame=0) this layer eases 400 ms so the rubble centre sits at 50 %; on Home the coin pill starts at the old value and counts up as each coin lands (<= 10 coins, 60 ms apart, existing
//      .coin sprites in the #feelLay layer); win -> Home <= 3.8 s.
//  X12 UX-10 (H2H v2): a "New:" intro card also closes on a tap anywhere on the card / scrim, 400 ms after it shows (the button stays).
//  X3  UX-3 part A: a 2nd empty tap within 4 s re-shows the existing hand for 1.5 s on the member nearest the finger (any member:
//      a gesture demo by distance only, never a solution spot).
//  X4  UX-4 Pause = the Settings rows: Sound, Music, Vibration, Reduce motion as labelled toggle rows 292 x 48, gap 8.
//  X5  UX-5 the main button says what it starts: "Play" + "Level N" (16 px) on Home, Upgrades and the Map; "Hard · Level 7" / "Boss · Level 10".
//  X7  UX-7 A lose card: "3% · need 85%".
//  X8  UX-8 A pre-level card with every booster locked: "Tougher building. Boosters unlock at Lv.11." (the real first unlock level).
//  X9  UX-9 L1: the label turns "Double-tap the TNT!" once a TNT is down; L1 double tap window 400 ms outside the lesson (tap2 hook).
//  X11 UX-11 Upgrades price buttons 96 x 48; Settings "Restart from Level 1" 48 high, >= 24 px above Done, still a text link; Map labels >= 15 px.
//  X10 Locked booster chips: SHOWN by default (D-blast-INTRO-BTF 1, Owner 15/11 keep visible). ?lockchips=0 = hidden until unlock.
//  XB  Car Sort #4: the idle BLAST (nothing placed) is a muted orange, not brown-red; the armed state is unchanged.
// Tester digest 15/11 (feedback/2026-11-15/DIGEST.md, uxui.md), Lead same day:
//  D1  in-level Pause: default stays in the left ear (SAFEAREA rev 2, Owner-approved). ?polear=0 = HUD row inside the safe area (needs Owner).
//  D2  (UX-3) the goal "85%" reads at the meter tick, 16 px (the #mTag label had been clipped to 1 x 1 px by ui2).
//  D3  (UX-6) lose card: the coin rescue "+1 TNT 150" is hidden while it cannot be paid; Try Again stays the one primary.
//  D4  (UX-8) City Map: the title no longer runs under the coin pill.
// Test hook: window.__blast.polish.
try{ (function(){
if(QS.get("polish") === "0") return;
var H = document.documentElement, BODY = document.body; H.classList.add("pol"); if(QS.get("polear") !== "0") H.classList.add("polEar");
var T2A = window.__blast.tap2 || {};
var P = { log:[], pill:{ lock:false, pend:0, shown:null, writes:0, forced:0 }, win:{ n:0, stamp:0, cam:null, camN:0, plus:0, t0:0, home:0 }, demo:{ miss:0, at:0, shown:0, until:0, b:null }, lose:0 };
function lg(s){ P.log.push(s); if(P.log.length > 60) P.log.shift(); }
function rmOn(){ return H.classList.contains("rm") || (typeof REDUCED !== "undefined" && REDUCED); }
var css = [
  // B2 the round Pause buttons (kept in the DOM, hidden by X4): the glyph stays at 45 % under the slash
  "html.pol #pauseM .pmRound.off .i{opacity:.45!important;color:var(--ul-ink)!important;filter:none!important}",
  // X1 the "+N" at 40 px (its travel is animated in JS); the Home count-up coins
  "html.pol body #uicPlus#uicPlus{font-size:40px!important;translate:none!important}",
  "html.pol #feelLay .coin.polHc{position:fixed;left:0;top:0;width:28px;height:28px;margin:-14px 0 0 -14px;z-index:60;pointer-events:none}",
  // X4 Pause rows = the Settings toggle rows
  "html.pol #pauseM .pmTogs{display:none!important}",
  "html.pol #pauseM .polRows{display:flex;flex-direction:column;align-items:center;gap:8px;margin:4px 0 14px}",
  "html.pol #pauseM .polRows .pmRow{width:292px;max-width:calc(100vw - 32px);flex:none;min-height:48px;height:48px;margin:0;padding:0 8px 0 16px;box-sizing:border-box;gap:8px;border:3px solid var(--ul-ink);border-radius:24px;" +
    "background:linear-gradient(#FFFFFF,#FFF4DC);box-shadow:0 3px 0 rgba(43,33,64,.25);font:900 16px/1 Nunito,system-ui,sans-serif;color:var(--ul-ink)}",
  "html.pol #pauseM .polRows .pmRow svg{width:24px;height:24px}",
  "html.pol #pauseM .polRows .pmRow .sw{width:64px;height:34px}",
  "html.pol #pauseM .polRows .pmRow.on .sw{background:#4DBA2F;box-shadow:inset 0 0 0 3px var(--ul-ink),inset 0 -3px 0 #2E8A1C}",
  "html.pol #pauseM .polRows .pmRow.on .sw::after{transform:translateX(30px)}",
  "html.pol #pauseM .polIc{position:relative;display:grid;place-items:center;width:24px;height:24px;flex:none}",
  "html.pol #pauseM .pmRow.off .polIc svg{opacity:.45}",          // B2: the glyph stays recognisable at 45 % ...
  "html.pol #pauseM .pmRow.off .polIc::after{content:'';position:absolute;left:-2px;right:-2px;top:50%;height:3px;margin-top:-1.5px;border-radius:2px;background:var(--ul-ink);transform:rotate(-45deg)}",   // ... under the slash
  "@media (max-height:700px){html.pol #pauseM .bhead{margin-bottom:0}html.pol #pauseM .polRows{margin:0 0 10px}}",
  // X5 the second line of the main buttons (a flex ::before, so the buttons' own "Play" text observers stay as they are)
  "html.pol body #play#play.home[data-pol2],html.pol body #shopPlay[data-pol2],html.pol body #cmPlay#cmPlay[data-pol2]{display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;line-height:.95!important}",
  "html.pol body #play[data-pol2]::before,html.pol body #shopPlay[data-pol2]::before,html.pol body #cmPlay[data-pol2]::before{order:2;content:attr(data-pol2);display:block;margin-top:calc(var(--polS,16px) * .15);font:400 var(--polS,16px)/1 var(--ul-fr,'Lilita One'),system-ui,sans-serif;opacity:.8;-webkit-text-stroke:calc(var(--polS,16px) * .25) var(--ol,#1A5A10);paint-order:stroke fill;text-shadow:none;letter-spacing:.01em}",
  "html.pol body #shopPlay[data-pol2]{min-height:66px!important}",
  // X8 the longer sub-line wraps inside the card
  "html.pol body #bPick .bsub.polAll{white-space:normal;max-width:280px;margin-left:auto;margin-right:auto;line-height:1.2}",
  // X11 targets
  "html.pol .up2 .pb2{width:96px!important;height:48px!important;top:26px!important;border-radius:24px!important}",
  "html.pol body #setReset{min-height:48px!important;margin:4px 0 12px!important}",
  // X10 locked chips are not in the HUD
  "html.pol body #bbar .bst.polHide{display:none!important}",
  // XB idle BLAST: the live orange, desaturated and lifted (same hue family), not the darkened brown-red
  "html.pol body #blast#blast#blast#blast:disabled{filter:hue-rotate(14deg) saturate(.5) brightness(1.12)!important}",
  // D1 Pause in the HUD row (vertically centred on the level cap), not in the ear
  "html.pol.saCut:not(.polEar) body #top #pauseBtn{top:max(var(--sa-t), calc(var(--saRT) + 36 * var(--us) - 24px))!important}",   // never above the inset; else centred on the level cap
  // D2 the goal at the tick: "85%" under the notch, 16 px, ink with a light outline
  "html.pol body #top #meter{overflow:visible!important}",
  "html.pol body #mPass::after{content:attr(data-pol)!important;display:block!important;position:absolute!important;left:50%!important;top:calc(100% + 2px)!important;right:auto!important;bottom:auto!important;width:auto!important;height:auto!important;" +
    "transform:translateX(-50%)!important;background:none!important;border:0!important;box-shadow:none!important;padding:0!important;margin:0!important;font:400 16px/1 var(--ul-fr,'Lilita One'),system-ui,sans-serif!important;color:var(--ul-ink)!important;" +
    "-webkit-text-stroke:4px #FFF8E1!important;paint-order:stroke fill!important;white-space:nowrap!important;pointer-events:none;opacity:1!important;visibility:visible!important;clip-path:none!important}",
  "html.pol body #mPass.on::after{color:#7A4A00!important}",
  "html.pol body.uicBusy #mPass::after,html.pol body.uicRes #mPass::after,html.pol body.uicWin #mPass::after,html.pol body.uicCoins #mPass::after{opacity:0!important;transition:opacity .2s}",
  // D3 an unaffordable rescue is not shown
  "html.pol body #result #rRescue.polNo{display:none!important}",
  // D4 Map: the scaled-down live ribbon let the plate's painted "CITY MAP" peek out under the coin pill; the ribbon now covers it 1:1
  // and the coin pill moves to the next row, right side (plate px, like the rest of .cmTop)
  "html.pol body #cityMap .cmRib{transform:none!important}",
  "html.pol body #cmCoins{top:124px!important}"
].join("\n");
var st = document.createElement("style"); st.id = "polCss"; st.textContent = css; document.head.appendChild(st);

// ================= B1 the coin pill during a level = the bank (debris coins are a show, D-blast-COIN)
var ct = $("coinTxt");
function pillWant(){
  if(!P.pill.lock) return null;
  if(screen === "game" && phase !== "done") P.pill.shown = Math.max(0, save.coins - P.pill.pend);
  return P.pill.shown;
}
var pBusy = false;
if(ct) new MutationObserver(function(){
  if(pBusy) return; var w = pillWant(); if(w == null) return; P.pill.writes++;
  if(ct.textContent.replace(/\D/g, "") !== String(w)){ pBusy = true; P.pill.forced++; ct.textContent = w; pBusy = false; }
}).observe(ct, { childList:true, characterData:true, subtree:true });
var addC0 = addCoins; addCoins = function(v){ if(P.pill.lock && screen === "game") P.pill.pend += v || 0; return addC0.apply(this, arguments); };
function pillLock(){ P.pill.pend = 0; P.pill.shown = save.coins; P.pill.lock = true; if(ct){ pBusy = true; ct.textContent = save.coins; pBusy = false; } }

// ================= X1 the win payoff
// the "+N": under the stamp (centre, 42 % height) 600 ms, then to the coin pill 400 ms (uiclean set its left / top beside the pill)
var plusEl = $("uicPlus");
if(plusEl && plusEl.animate){ var plAn0 = plusEl.animate; plusEl.animate = function(k, o){
  P.win.plus++;
  var L0 = parseFloat(plusEl.style.left) || 0, T0 = parseFloat(plusEl.style.top) || 0, dx = innerWidth/2 - L0, dy = innerHeight*0.42 - T0;
  P.win.plusAt = { cx:(L0 + dx)/innerWidth, cy:(T0 + dy)/innerHeight, fs:parseFloat(getComputedStyle(plusEl).fontSize), t:plusEl.textContent };
  if(rmOn()) return plAn0.call(this, [{ opacity:1, transform:"translate(" + dx + "px," + dy + "px) translate(-50%,-50%)" }, { opacity:1, transform:"translate(" + dx + "px," + dy + "px) translate(-50%,-50%)", offset:0.9 }, { opacity:0, transform:"translate(" + dx + "px," + dy + "px) translate(-50%,-50%)" }], { duration:1000, fill:"both" });
  return plAn0.call(this, [
    { opacity:0, transform:"translate(" + dx + "px," + dy + "px) translate(-50%,-50%) scale(.6)", easing:"cubic-bezier(.2,.9,.3,1.2)" },
    { opacity:1, transform:"translate(" + dx + "px," + dy + "px) translate(-50%,-50%) scale(1)", offset:0.18 },
    { opacity:1, transform:"translate(" + dx + "px," + dy + "px) translate(-50%,-50%) scale(1)", offset:0.6, easing:"cubic-bezier(.5,0,.75,0)" },
    { opacity:1, transform:"translate(0px,0px) translate(-100%,-50%) scale(.7)", offset:0.97 },
    { opacity:0, transform:"translate(0px,0px) translate(-100%,-50%) scale(.7)" }], { duration:1000, fill:"both" });
}; }
if(plusEl){ var plTo = 0; new MutationObserver(function(){ if(!rmOn()) return; clearTimeout(plTo); plTo = setTimeout(function(){ plusEl.style.opacity = 0; }, 1000); }).observe(plusEl, { childList:true }); }
// Home: the pill starts at the old value; coins land one by one (60 ms apart, 400 ms each) and the counter adds as each lands
var hc = $("hCoinTxt"), HC = { lock:null, runs:0, last:null }, hcBusy = false;
if(hc) new MutationObserver(function(){ if(hcBusy || HC.lock == null) return; if(hc.textContent.replace(/\D/g, "") !== String(HC.lock)){ hcBusy = true; hc.textContent = HC.lock; hcBusy = false; } }).observe(hc, { childList:true, characterData:true, subtree:true });
function homeCount(from, to){
  var lay = $("feelLay"), pill = $("hCoins"), ic = pill && pill.querySelector(".coin"); if(!hc || !lay || !ic || to <= from) return;
  HC.runs++; HC.last = { from:from, to:to, steps:[] };
  var set = function(v){ HC.lock = v; HC.last.steps.push(v); hcBusy = true; hc.textContent = v; hcBusy = false; };
  set(from);
  var tgt = ic.getBoundingClientRect(), n = Math.min(10, to - from), done = 0, x0 = innerWidth/2, y0 = innerHeight*0.45;
  var fin = function(){ done++; set(done >= n ? to : Math.round(from + (to - from)*done/n)); try{ bumpPill(); if(done % 2 === 1 || done === n) snd("coin", { index:done }); }catch(e){}
    if(done >= n){ HC.lock = null; try{ if(typeof syncCoins === "function") syncCoins(); }catch(e){} } };
  if(rmOn() || !document.body.animate){ done = n - 1; fin(); return; }
  for(var i=0;i<n;i++) (function(i){
    var e = document.createElement("span"); e.className = "coin polHc"; lay.appendChild(e);
    var x1 = tgt.left + tgt.width/2, y1 = tgt.top + tgt.height/2, mx = (x0 + x1)/2 + 40, my = Math.min(y0, y1) - 30;
    var an = e.animate([{ transform:"translate(" + x0 + "px," + y0 + "px) scale(.6)" }, { transform:"translate(" + (0.25*x0 + 0.5*mx + 0.25*x1) + "px," + (0.25*y0 + 0.5*my + 0.25*y1) + "px) scale(1.15)", offset:0.5 },
      { transform:"translate(" + x1 + "px," + y1 + "px) scale(.9)" }], { duration:400, delay:120 + i*60, easing:"ease-in", fill:"both" });
    an.onfinish = function(){ if(e.parentNode) e.parentNode.removeChild(e); fin(); };
    an.oncancel = function(){ if(e.parentNode) e.parentNode.removeChild(e); fin(); };
  })(i);
}
// camera: ease 400 ms so the rubble centre sits at 50 % of the screen height (a view offset on top of the final camera; undone at Home / next level)
function rubbleC(){
  var x = 0, y = 0, z = 0, n = 0;
  for(var i=0;i<blocks.length;i++){ var b = blocks[i]; if(b.dead || b.anchor || b.keep || b.prop || b.bonus || !b.P) continue; x += b.P.x; y += b.P.y; z += b.P.z; n++; }
  return n ? { x:x/n, y:y/n, z:z/n, n:n } : null;
}
function lookCam(){ try{ var lk = window.__blast.look; return !!(lk && lk.on() && lk.cam().on); }catch(e){ return false; } }
function camStart(){
  if(lookCam()){ P.win.camBy = "look"; lg("cam:look"); return; }   // main/look.js K2 already frames hero + debris on the win (Lead 15/11): never a second camera on top
  var c = rubbleC(); if(!c) return;
  var s = toScreen(c); if(!isFinite(s.y)) return;
  var off = Math.max(-0.3*VH, Math.min(0.3*VH, s.y - innerHeight*0.5));
  P.win.cam = { t0:performance.now(), off:off, k:0, sy0:s.y }; P.win.camN++; lg("cam:" + Math.round(off));
}
function camEnd(){ if(!P.win.cam) return; P.win.cam = null; try{ camera.setViewOffset(VW, VH, 0, isFinite(viewShift) && viewShift > -1e8 ? viewShift : 0, VW, VH); }catch(e){} viewShift = -1e9; }
var uc0 = updateCamera; updateCamera = function(){
  var r = uc0.apply(this, arguments), c = P.win.cam;
  if(P.win.camBy === "look" && screen === "result" && P.win.r){ try{ var lm = window.__blast.look.measure(); if(lm && (!P.win.lookM || lm.W >= P.win.lookM.W)) P.win.lookM = lm; }catch(x){} }
  if(c && screen === "result"){
    var u = rmOn() ? 1 : Math.min(1, (performance.now() - c.t0)/400), e = u < 0.5 ? 4*u*u*u : 1 - Math.pow(-2*u + 2, 3)/2; c.k = e;
    try{ camera.setViewOffset(VW, VH, 0, (viewShift > -1e8 ? viewShift : 0) + c.off*e, VW, VH); }catch(x){}
    if(e >= 1 && c.done == null){ var rc = rubbleC(); c.done = rc ? +(toScreen(rc).y/innerHeight).toFixed(3) : null; P.win.camDone = c.done; }
  }
  return r;
};
P.camNow = function(){ var c = rubbleC(); return c ? toScreen(c).y : null; };

// ================= showResult / startLevel / goHome
var sr0 = showResult; showResult = function(){
  var r = lastResult; P.pill.lock = false; P.pill.pend = 0;          // tap2 writes the real bank (+ reward on a win) in this call
  var res = sr0.apply(this, arguments);
  try{
    if(r && r.ok && !manual && screen === "result"){ P.win.n++; P.win.t0 = performance.now(); P.win.r = r; P.win.camBy = null; P.win.lookM = null; P.win.from = Math.max(0, save.coins - (r.coins | 0)); camStart(); }
    if(r && !r.ok && !manual){ var pe = $("rPct"); if(pe){ pe.textContent = v5Pct(r.pct) + "% · need " + Math.round(L.target*100) + "%"; P.lose++; } }
    var rc = $("rRescue"); if(rc) rc.classList.toggle("polNo", !!(r && !r.ok && (rc.disabled || rc.classList.contains("cant"))));
  }catch(e){ console.error("polish result", e); }
  return res;
};
function goalLbl(){ var mp = $("mPass"); if(mp && L) mp.setAttribute("data-pol", Math.round(L.target*100) + "%"); }
var sl0 = startLevel; startLevel = function(){ camEnd(); var r = sl0.apply(this, arguments); try{ goalLbl(); }catch(e){} try{ if(!manual) pillLock(); else P.pill.lock = false; }catch(e){} P.demo.miss = 0; P.demo.until = 0; return r; };
var gh0 = goHome; goHome = function(){
  var wr = P.win.r; P.win.r = null; if(wr && !P.win.home) P.win.home = Math.round(performance.now() - P.win.t0); camEnd(); P.pill.lock = false;
  var res = gh0.apply(this, arguments);
  try{ if(wr && wr.ok && screen === "title"){ var from = Math.max(0, save.coins - (wr.coins | 0)); homeCount(Math.min(from, P.win.from != null ? P.win.from : from), save.coins); } }catch(e){ console.error("polish home", e); }
  return res;
};
var rs0 = typeof rescue === "function" ? rescue : null;
if(rs0) rescue = function(){ var r = rs0.apply(this, arguments); try{ if(screen === "game" && !manual) pillLock(); }catch(e){} return r; };

// ================= X3 / X9 the hand: empty-tap demo, L1 label
var handEl = $("hand"), lbl = $("t2Lbl");
function demoPick(x, y){
  var c = [];
  for(var i=0;i<blocks.length;i++){ var b = blocks[i]; if(b.dead || b.anchor || b.keep || b.prop || b.bonus) continue; var s = toScreen(b.P); if(!s.on) continue; c.push({ b:b, s:s, d:Math.hypot(s.x - x, s.y - y) }); }
  c.sort(function(a, b){ return a.d - b.d; });
  for(var j=0;j<Math.min(16, c.length);j++){ var h = T2A.pickExact ? T2A.pickExact(c[j].s.x, c[j].s.y) : { keep:false }; if(h && !h.keep) return c[j].b; }
  return null;
}
function demoOk(){
  if(manual || screen !== "game" || phase !== "plan" || selC) return false;
  var t = T2A.tut ? T2A.tut() : null; if(t && (t.l1 || t.ref || (levelIdx === 1 && !t.done.l2))) return false;   // the L1 / L2 lessons keep their own hand
  var vis = function(id){ var e = $(id); return !!e && !e.classList.contains("hidden"); };
  return !vis("inCard") && !vis("inDim") && !vis("bNew") && !vis("pauseM");
}
var ot0 = onTap; onTap = function(x, y){
  var a = T2A.stats ? T2A.stats() : null, r = ot0.apply(this, arguments);
  try{
    var b = T2A.stats ? T2A.stats() : null, last = b && b.log.length ? b.log[b.log.length - 1] : "";
    if(a && b && (b.single + b.dbl) > (a.single + a.dbl) && /^(tap|dbl):miss/.test(last)){
      var now = performance.now();
      if(P.demo.miss && now - P.demo.at <= 4000 && demoOk()){
        var m = demoPick(x, y); P.demo.miss = 0;
        if(m){ P.demo.b = m; P.demo.until = now + 1500; P.demo.shown++; lg("demo:" + blocks.indexOf(m)); }
      } else { P.demo.miss = 1; P.demo.at = now; }
    } else if(a && b && (b.single + b.dbl) > (a.single + a.dbl)) P.demo.miss = 0;
  }catch(e){}
  return r;
};
var shd0 = stepHand; stepHand = function(){
  if(P.demo.until){
    if(performance.now() < P.demo.until && P.demo.b && !P.demo.b.dead && demoOk()){
      var s = toScreen(P.demo.b.P);
      if(s.on){ handEl.classList.toggle("t2d", levelIdx === 0); hand(s); P.demo.frames = (P.demo.frames || 0) + 1; P.demo.pt = { x:Math.round(s.x), y:Math.round(s.y) }; return; }
    }
    P.demo.until = 0; P.demo.b = null; handEl.classList.remove("t2d"); hand(null);
  }
  var r = shd0.apply(this, arguments);
  if(lbl && !lbl.classList.contains("hidden")){ var w = placedCount() > 0 ? "Double-tap the TNT!" : "Double-tap!"; if(lbl.textContent !== w) lbl.textContent = w; }
  return r;
};
if(T2A.setDblMs) T2A.setDblMs(function(){ return levelIdx === 0 && !manual ? 400 : 300; });   // X9: the lesson itself keeps its 600 ms

// ================= X4 Pause = the Settings rows
(function(){
  var pm = $("pauseM"), sfx = $("pmSfx"), mus = $("pmMus"), vib = $("pmVib"), rmr = $("pmRm"); if(!pm || !sfx || !mus) return;
  var card = pm.querySelector(".bcard"), row2 = pm.querySelector(".pmRow2"); if(!card || !row2) return;
  var SND = '<svg class="i s24"><use href="#i-sound-on"/></svg>', MUS = '<svg class="i s24"><use href="#i-music-on"/></svg>';
  function mk(id, ic, txt, src){ var b = document.createElement("button"); b.type = "button"; b.className = "pmRow"; b.id = id; b.setAttribute("role", "switch");
    b.innerHTML = '<span class="polIc">' + ic + '</span><span>' + txt + '</span><i class="sw"></i>'; b.addEventListener("click", function(){ src.click(); sync(); }); return b; }
  var box = document.createElement("div"); box.className = "polRows";
  var rS = mk("pmSndRow", SND, "Sound", sfx), rM = mk("pmMusRow", MUS, "Music", mus);
  box.appendChild(rS); box.appendChild(rM); if(vib) box.appendChild(vib); if(rmr) box.appendChild(rmr);
  card.insertBefore(box, row2);
  if(vib){ var vs = vib.querySelector("svg"); if(vs && !vs.parentNode.classList.contains("polIc")){ var w = document.createElement("span"); w.className = "polIc"; vib.insertBefore(w, vs); w.appendChild(vs); } }
  if(rmr){ var rs = rmr.querySelector("svg"); if(rs && !rs.parentNode.classList.contains("polIc")){ var w2 = document.createElement("span"); w2.className = "polIc"; rmr.insertBefore(w2, rs); w2.appendChild(rs); } }
  function sync(){
    var son = !save.mute, mon = save.music !== false;
    rS.classList.toggle("on", son); rS.classList.toggle("off", !son); rS.setAttribute("aria-checked", son ? "true" : "false");
    rM.classList.toggle("on", mon); rM.classList.toggle("off", !mon); rM.setAttribute("aria-checked", mon ? "true" : "false");
    if(vib) vib.classList.toggle("off", !vib.classList.contains("on"));
  }
  new MutationObserver(function(){ if(!pm.classList.contains("hidden")) setTimeout(sync, 0); }).observe(pm, { attributes:true, attributeFilter:["class"] });
  if(vib) new MutationObserver(function(){ vib.classList.toggle("off", !vib.classList.contains("on")); }).observe(vib, { attributes:true, attributeFilter:["aria-checked"] });
  sync(); P.pauseSync = sync;
})();

// ================= X5 two-line main buttons
function tierOf(i){ var d = (typeof levelDef === "function" ? levelDef(i % LEVELS.length) : LEVELS[i % LEVELS.length]) || {}; return d.boss ? "Boss · " : isHard(d) ? "Hard · " : ""; }
function two(el, idx){
  if(!el) return; var busy = false;
  var run = function(){ if(busy) return; busy = true;
    try{ var t = el.textContent.trim(), m = /^(?:PLAY LV|Level) (\d+)$/i.exec(t), n = m ? +m[1] - 1 : idx();
      if(m) el.textContent = "Play";
      var hk = el.offsetHeight ? el.getBoundingClientRect().height/el.offsetHeight : 1; if(hk > 0.05) el.style.setProperty("--polS", (16/hk).toFixed(2) + "px");   // 16 px on screen inside a scaled plate
      if(n != null && el.textContent.trim() === "Play"){ var s2 = tierOf(n) + "Level " + (n + 1); if(el.getAttribute("data-pol2") !== s2) el.setAttribute("data-pol2", s2); }
    }catch(e){}
    busy = false; };
  new MutationObserver(run).observe(el, { childList:true, characterData:true, subtree:true }); run();   // never observe class: other layers rewrite className wholesale
}
two($("play"), function(){ return save.level; });
two($("cmPlay"), function(){ return save.level; });
function fixS(){ ["play", "cmPlay", "shopPlay"].forEach(function(id){ var e = $(id); if(e && e.offsetHeight){ var k = e.getBoundingClientRect().height/e.offsetHeight; if(k > 0.05) e.style.setProperty("--polS", (16/k).toFixed(2) + "px"); } }); }
window.addEventListener("resize", function(){ setTimeout(fixS, 300); }); setTimeout(fixS, 600); setTimeout(fixS, 2000);
two($("shopPlay"), function(){ return typeof shopNext === "number" ? shopNext : save.level; });
// the Home label refreshes with the level (Play's own text does not change between levels)
var hl0 = typeof homeLabels === "function" ? homeLabels : null;
if(hl0) homeLabels = function(){ var r = hl0.apply(this, arguments); try{ var p = $("play"); if(p) p.setAttribute("data-pol2", tierOf(save.level) + "Level " + (save.level + 1)); fixS(); setTimeout(fixS, 400); }catch(e){} return r; };

// ================= X8 pre-level card: everything locked
var bp0 = bstPlay; bstPlay = function(i){
  var r = bp0.apply(this, arguments);
  try{ var pk = $("bPick"), sub = pk && pk.querySelector(".bsub"); if(sub) sub.classList.remove("polAll");
    if(pk && !pk.classList.contains("hidden") && pk.classList.contains("pre") && sub){
      var ks = BOOST_ORDER.filter(function(k){ return BOOST[k] && !BOOST[k].hidden; }), lk = ks.filter(function(k){ return !bstUnlocked(k); });
      if(ks.length && lk.length === ks.length){
        var lv = Math.min.apply(null, lk.map(function(k){ var n = null; try{ n = window.__blast.intro && window.__blast.intro.lockLv(k); }catch(e){} return n || ((BOOST[k].unlock | 0) + 1); }));
        sub.textContent = "Tougher building. Boosters unlock at Lv." + lv + "."; sub.classList.add("polAll"); lg("pre:locked:" + lv);
      }
    } }catch(e){ console.error("polish pre", e); }
  return r;
};

// ================= X12 "New:" cards close on a tap anywhere on the card after 400 ms (the button stays the visible affordance)
(function(){
  var cd = $("inCard"), btn = $("inBtn"), t0 = 0; if(!cd || !btn) return;
  new MutationObserver(function(){ if(!cd.classList.contains("hidden") && !cd.classList.contains("out")){ if(!t0) t0 = performance.now(); } else t0 = 0; }).observe(cd, { attributes:true, attributeFilter:["class"] });
  cd.addEventListener("click", function(ev){
    if(cd.classList.contains("hidden") || cd.classList.contains("out") || btn.contains(ev.target)) return;
    if(!/^New:/.test(($("inT") || {}).textContent || "") || !t0 || performance.now() - t0 < 400) return;
    P.anyTap = (P.anyTap || 0) + 1; lg("cardTap"); btn.click();
  });
  P.cardT0 = function(){ return t0; };
})();

// ================= X10 locked chips out of the HUD
var LOCKCHIPS = QS.get("lockchips") !== "0";
var bs0 = bstSync; bstSync = function(){
  var r = bs0.apply(this, arguments);
  try{ var bar = $("bbar"); if(bar) [].forEach.call(bar.children, function(b){ b.classList.toggle("polHide", !LOCKCHIPS && b.classList.contains("inLock") && !b.classList.contains("inOpen")); }); }catch(e){}
  return r;
};
try{ bstSync(); }catch(e){}

// ================= X11 Map labels >= 15 px on screen (the map is a scaled plate)
function mapFit(){
  var w = $("cmWorld"); if(!w) return; var n = 0;
  [].forEach.call(w.querySelectorAll(".cmBoard b, .cmBoard span, .cmIn *"), function(e){
    if(e.closest("svg") || ![].some.call(e.childNodes, function(c){ return c.nodeType === 3 && c.textContent.trim(); })) return;
    var r = e.getBoundingClientRect(); if(!r.width) return;
    var fs = parseFloat(getComputedStyle(e).fontSize), sc = e.offsetHeight ? r.height/e.offsetHeight : 1; if(!(sc > 0)) return;
    if(fs*sc < 15){ e.style.fontSize = (15.2/sc).toFixed(2) + "px"; n++; }
  });
  if(n) lg("map:" + n);
}
var cm = $("cityMap"); if(cm){ var mfT = 0; new MutationObserver(function(){ clearTimeout(mfT); mfT = setTimeout(mapFit, 60); }).observe(cm, { attributes:true, attributeFilter:["class"], childList:true, subtree:true }); }

// ================= D4 the Map title clear of the coin pill (measured: the title shrinks / shifts only when they overlap)
function mapTitle(){   // measure only (CSS below does the fix): the live ribbon sits 1:1 over the plate's painted one, the coin pill drops under it
  var cm2 = $("cityMap"); if(!cm2 || cm2.classList.contains("hidden")) return null; fixS();
  var pill = $("cmCoins"), t = cm2.querySelector(".cmRib"); if(!pill || !t) return null;
  var a3 = t.getBoundingClientRect(), b = pill.getBoundingClientRect();
  return { title:[a3.left, a3.top, a3.width, a3.height], pill:[b.left, b.top, b.width, b.height], overlap:a3.right > b.left && b.right > a3.left && a3.bottom > b.top && b.bottom > a3.top };
}
if(cm){ var mtT = 0; new MutationObserver(function(){ clearTimeout(mtT); mtT = setTimeout(mapTitle, 80); }).observe(cm, { attributes:true, attributeFilter:["class"] }); window.addEventListener("resize", function(){ setTimeout(mapTitle, 300); }); }

window.__blast.polish = {
  mapTitle:mapTitle, goal:function(){ var mp = $("mPass"); if(!mp) return null; var cs = getComputedStyle(mp, "::after"); return { text:mp.getAttribute("data-pol"), fs:parseFloat(cs.fontSize), display:cs.display, content:cs.content }; },
  on:true, log:function(){ return P.log.slice(); },
  pill:function(){ return { lock:P.pill.lock, pend:P.pill.pend, shown:P.pill.shown, text:ct ? ct.textContent : null, bank:save.coins, forced:P.pill.forced }; },
  cardT0:function(){ return P.cardT0 ? P.cardT0() : 0; },
  home:function(){ return { runs:HC.runs, last:HC.last, lock:HC.lock }; }, anyTap:function(){ return P.anyTap || 0; },
  win:function(){ var c = P.win.cam; return { n:P.win.n, stamp:P.win.stamp, plus:P.win.plus, camN:P.win.camN, cam:c ? { off:Math.round(c.off), k:+c.k.toFixed(2), sy0:Math.round(c.sy0) } : null, home:P.win.home, plusAt:P.win.plusAt || null, camBy:P.win.camBy || (P.win.camN ? "polish" : null), lookM:P.win.lookM || null, camDone:P.win.camDone == null ? null : P.win.camDone }; },
  demo:function(){ return { shown:P.demo.shown, on:P.demo.until > performance.now(), miss:P.demo.miss, frames:P.demo.frames || 0, pt:P.demo.pt || null }; },
  camNow:P.camNow, mapFit:mapFit, lockchips:LOCKCHIPS
};
})(); }catch(e){ console.error("main/polish.js", e); }
