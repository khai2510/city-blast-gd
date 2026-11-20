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
// D-blast-TF6 (Owner 18/11/2026, TestFlight 6 review): these items are DROPPED from the build = off by default, code kept behind an
// opt-in flag (the v53 / TestFlight 5 behaviour is the default):
//  A4  X7 lose card "N% · need 85%" + D3 coin rescue hidden while unaffordable   -> ?pollose=1
//  A6  X3 2nd empty tap re-shows the hand                                        -> ?polhand=1
//  A7  XB muted-orange idle BLAST + X12 "New:" card closes on a tap anywhere     -> ?polcard=1
//  A10 the win camera of this layer (X1 rubble centring, used only when look.js K2 is not running) follows look.js: ?collcam=1 / k2
// Kept ON (TF6 A1 / A2 / A3 / A5 and the rest): B1, B2, X1 "+N" + Home count-up, X4, X5, X8, X9, X10, X11, D1, D2, D4, K1-K3, M1-M4.
// Test hook: window.__blast.polish.
try{ (function(){
if(QS.get("polish") === "0") return;
var H = document.documentElement, BODY = document.body; H.classList.add("pol"); if(QS.get("polear") !== "0") H.classList.add("polEar");
var TF6 = { lose:QS.get("pollose") === "1", hand:QS.get("polhand") === "1", card:QS.get("polcard") === "1", cam:/^(1|k2)$/.test(QS.get("collcam") || "") };   // D-blast-TF6 opt-ins
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
  TF6.card ? "html.pol body #blast#blast#blast#blast:disabled{filter:hue-rotate(14deg) saturate(.5) brightness(1.12)!important}" : "",   // D-blast-TF6 A7: off by default (?polcard=1)
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
  if(!TF6.cam){ P.win.camBy = null; lg("cam:off"); return; }   // D-blast-TF6 A10: no collapse / win camera move by default (the v53 camera); ?collcam=1 / k2
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
    if(r && !r.ok && !manual && TF6.lose){ var pe = $("rPct"); if(pe){ pe.textContent = v5Pct(r.pct) + "% · need " + Math.round(L.target*100) + "%"; P.lose++; } }
    var rc = $("rRescue"); if(rc) rc.classList.toggle("polNo", !!(TF6.lose && r && !r.ok && (rc.disabled || rc.classList.contains("cant"))));   // D-blast-TF6 A4: D3 only with ?pollose=1
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
    if(!TF6.hand){}   // D-blast-TF6 A6: X3 off by default (?polhand=1)
    else if(a && b && (b.single + b.dbl) > (a.single + a.dbl) && /^(tap|dbl):miss/.test(last)){
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
  var cd = $("inCard"), btn = $("inBtn"), t0 = 0; if(!cd || !btn || !TF6.card) return;   // D-blast-TF6 A7: off by default (?polcard=1)
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
    var fl = e.closest(".cmBoard") ? 16 : 15;   // 19/11 (UX-36 / UX-42): the district plaques' words 16 px (was 15.2); node labels keep 15
    if(fs*sc < fl){ e.style.fontSize = ((fl + 0.2)/sc).toFixed(2) + "px"; n++; }
  });
  // 19/11 (UX-36): a plaque grows to its words (it clipped "Unlock at Lv 11" to "Unlock at Lv 1"); never a cut number
  [].forEach.call(w.querySelectorAll(".cmBoard"), function(b){ var need = 0;
    [].forEach.call(b.children, function(c){ need = Math.max(need, c.scrollWidth - c.clientWidth); });
    if(need > 0 && b.style.width){ b.style.width = (parseFloat(b.style.width) + need + 4).toFixed(0) + "px"; n++; } });
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

// ================= Tester round 17/11 (feedback/2026-11-17/DIGEST.md fix 3, UX-25/26/27, GD-24): protected-building clarity. Group A:
// re-words, re-times and re-colours existing elements only (the outline / replay of the hit building is a proposal for Owner, D-blast-NONEW).
//  K1 ONE NAME. The blue buildings are "blue building(s)" everywhere the player reads them, in the "New: Blue Building" card's own words:
//     the fail title "HIT A BLUE BUILDING!" (was "HIT THE HOSPITAL!"), its line "You damaged a blue building (N%) ...", the fail tip
//     ("It fell on a blue building. Tip it away."), the level tips ("Fall away from the blue building(s)"; plural when the level has more
//     than one) and any text on the result card. The rooftop signs (H / school / library / town hall art) stay as they are.
//  K2 THE TAG IS THE RULE. Root cause of the L7 "7%" with no fail: the tag over a protected building showed the LIVE share of its members
//     moved > 0.9 m / broken, refreshed every 6 frames; that share goes up AND down while the rubble rocks and settles (measured on L7:
//     21% -> 17% -> 7% -> 14% inside one settle), but the 5% rule judges the same per-building share only at rest (waveEnd, the end of
//     the rest settle in planning, finish). Same metric (worst building), same rounding (Math.round), same threshold (5): only the moment
//     differed, so a transient 7% could show and then settle back under the limit before the rule looked. Now the tag shows the share the
//     rule last judged (snapshot at waveEnd / l6HardBroken / finish), and its colour is the rule's: navy at 1-5% (within the limit), red
//     when it is over the limit (= the fail). Nothing about the rule or the physics changes (bots / determinism unaffected).
//  K3 SEE THE CAUSE. On a protected-building fail the wreck (and the hit building, its tag now red) stays in view HOLD_MS before the card.
var PROT = { hold:0, snaps:0, HOLD_MS:+(QS.get("prothold") || 1000) };   // ?prothold=<ms>: a longer hold (screenshots only)
var ROLE_RX = /\b(the|a)\s+(?:(?:left|right|near|far|front|back|small|big|other)\s+)?(hospital|school|library|town hall)s?\b/gi;
function kPlural(){ return !!(L && L.keeps && L.keeps.length > 1); }
function kWord(s, tip){ if(s == null) return s; return String(s).replace(ROLE_RX, function(m, art){ var cap = art[0] === art[0].toUpperCase();
  var w = tip ? (kPlural() ? "the blue buildings" : "the blue building") : "a blue building"; return cap ? w[0].toUpperCase() + w.slice(1) : w; }); }
var vd17 = verdict; verdict = function(){ var v = vd17.apply(this, arguments);
  if(v && v.code === "collateral"){ v.reason = "HIT A BLUE BUILDING!"; v.why = kWord(String(v.why || "")).replace(/^You damaged the neighbour\b/, "You damaged a blue building"); }
  return v; };
var ft17 = failTip; failTip = function(r){ var t = ft17.apply(this, arguments); return r && r.code === "collateral" ? kWord(t) : t; };
var lt17 = levelTip; levelTip = function(){ return kWord(lt17.apply(this, arguments), true); };
var kSnap = function(){ if(typeof shields === "undefined" || !shields.length) return; PROT.snaps++; shields.forEach(function(sh){ sh.jd = shieldDamage(sh); }); };
var we17 = waveEnd; waveEnd = function(){ kSnap(); return we17.apply(this, arguments); };
if(typeof l6HardBroken === "function"){ var hb17 = l6HardBroken; l6HardBroken = function(){ kSnap(); return hb17.apply(this, arguments); }; }
var fn17 = finish; finish = function(){ kSnap(); PROT.tDone = performance.now(); return fn17.apply(this, arguments); };
var kLim = function(){ return Math.round(((L && L.keepMax) || KEEP_MAX)*100); };
var ss17 = stepShields; stepShields = function(){ var r = ss17.apply(this, arguments), lim = kLim();
  for(var i=0;i<shields.length;i++){ var sh = shields[i], d = Math.round((sh.jd || 0)*100), t = d + "%";
    var b = sh.b17 || (sh.b17 = sh.el.querySelector("b")); sh.txt = t; if(b && b.textContent !== t) b.textContent = t;   // the base loop writes the live share: put the judged one back (same frame)
    sh.el.classList.toggle("hit", d > 0); sh.el.classList.toggle("over", d > lim); }
  return r; };
var bs17 = buildShields; buildShields = function(){ var r = bs17.apply(this, arguments); shields.forEach(function(sh){ sh.jd = 0; }); return r; };
var kcss = document.createElement("style"); kcss.id = "polProtCss";
kcss.textContent = "html.pol body .shield.hit b{background:#2F64D6!important}html.pol body .shield.hit.over b{background:#E5322D!important}";
document.head.appendChild(kcss);
// K3 + K1 on the card: the hold, then the card; any role name left on the card (e.g. "Damage to the hospital") reads "a blue building"
var sr17 = showResult; showResult = function(){
  var r = lastResult;
  if(r && !r.ok && r.code === "collateral" && !manual && !r._p17h && screen === "game"){ r._p17h = 1; PROT.hold++; lg("protHold"); PROT.t0 = performance.now(); PROT.held = null;
    setTimeout(function(){ if(lastResult === r && phase === "done" && screen === "game") showResult(); }, PROT.HOLD_MS); return; }   // 18/11 (UX-31): a tap in "done" (base: skipToResult) no longer cuts the hold to 0
  if(r && r._p17h === 1){ r._p17h = 2; PROT.held = Math.round(performance.now() - PROT.t0); PROT.sinceDone = PROT.tDone ? Math.round(performance.now() - PROT.tDone) : null; }
  var o = sr17.apply(this, arguments);
  var rs = $("result"); if(rs && r && r.code === "collateral"){ var w = document.createTreeWalker(rs, NodeFilter.SHOW_TEXT), n;
    while((n = w.nextNode())){ var t2 = kWord(n.nodeValue); if(t2 !== n.nodeValue) n.nodeValue = t2; } }
  return o; };
P.prot = function(){ var lim = kLim(); return { holds:PROT.hold, held:PROT.held, sinceDone:PROT.sinceDone, snaps:PROT.snaps, holdMs:PROT.HOLD_MS, lim:lim, coll:L && L.keep ? +(collateral()*100).toFixed(2) : 0,
  tags:(typeof shields === "undefined" ? [] : shields).map(function(sh){ var b = sh.el.querySelector("b"), cs = b ? getComputedStyle(b) : null;
    return { jd:+((sh.jd || 0)*100).toFixed(2), live:+(shieldDamage(sh)*100).toFixed(2), txt:b ? b.textContent : "", hit:sh.el.classList.contains("hit"), over:sh.el.classList.contains("over"), bg:cs ? cs.backgroundColor : "", shown:sh.el.style.display !== "none" && getComputedStyle(sh.el).display !== "none" }; }) }; };
P.kWord = kWord;

// ================= Tester round 18/11 (feedback/2026-11-18/DIGEST.md fixes 2-3, UX-30/31/35, GD-28/29). Group A: existing elements only.
//  M1 (UX-35) a world tap that STARTS within 300 ms after a card closed (New / Unlocked card, booster card, unlock card, Pause, pre-level
//     card) is ignored: the finger that hit "Got It" / "Resume" does not drop a TNT on the building behind it. Only canvas taps (the intro
//     spotlight's own tap comes from its dim layer, after >= 0.95 s, and is never held back).
//  M2 (UX-31 / GD-29) the protected-building fail card shows the bar that failed, in the card's own bar slot: "Blue building 14% · max 5%",
//     the bar filled to the judged share, red, its tick at the limit (the demolition bar "75% · need 85%" was the rule that did not fail).
//  M3 (UX-31) the card docks low and the dim leaves the top of the screen clear: the view eases up (a view offset, as the win camera)
//     so the hit building and its red tag sit in the clear top part while the card is up. (The ~1 s wreck hold itself is K3 above; a tap
//     in "done" no longer cuts it.)
var R18 = { closeT:-1e9, downT:-1e9, guard:0, guards:[], obs:{}, card:0, cam:null, tagShown:0, DEB:300 };
function r18Open(el){ return !!el && !el.classList.contains("hidden") && !el.classList.contains("out") && (el.id !== "nuCard" || el.classList.contains("on")); }
function r18Watch(){ ["inCard", "bNew", "pauseM", "bPick", "nuCard"].forEach(function(id){ var el = $(id); if(!el || R18.obs[id]) return;
  var was = r18Open(el); R18.obs[id] = new MutationObserver(function(){ var o = r18Open(el); if(was && !o){ R18.closeT = performance.now(); lg("cardClose:" + id); } was = o; });
  R18.obs[id].observe(el, { attributes:true, attributeFilter:["class"] }); }); }
r18Watch();
try{ renderer.domElement.addEventListener("pointerdown", function(){ r18Watch(); R18.downT = performance.now(); }, { capture:true, passive:true }); }catch(e){}
var ot18 = onTap; onTap = function(x, y){
  var d0 = R18.downT, d = d0 - R18.closeT; R18.downT = -1e9;   // one canvas press = one check (the intro's own call never sees it)
  if(d >= 0 && d < R18.DEB && performance.now() - d0 < 1500 && screen === "game" && !manual){ R18.guard++; R18.guards.push(Math.round(d)); lg("tapGuard:" + Math.round(d)); return; }
  return ot18.apply(this, arguments); };
var r18css = document.createElement("style"); r18css.id = "polR18Css";
r18css.textContent = [
  "html.pol body #result.r18prot{justify-content:flex-end;background:linear-gradient(rgba(43,33,64,0) 0,rgba(43,33,64,0) 40%,rgba(43,33,64,.55) 52%,rgba(43,33,64,.62) 100%)!important;-webkit-backdrop-filter:none!important;backdrop-filter:none!important}",
  "html.pol body #result.r18prot .card{margin-top:0!important;margin-bottom:calc(env(safe-area-inset-bottom, 0px) + 16px)}",
  "html.pol body #result.r18prot #rmFill,html.pol body #result.r18prot #rmFill.go{background:linear-gradient(#FF6B5E,#E5322D 55%,#C4211C)!important}",
  "html.pol body #result.r18prot #rPct{color:#fff;white-space:nowrap;font-size:20px!important}"
].join("");
document.head.appendChild(r18css);
function r18End(){ var rs = $("result"); if(rs) rs.classList.remove("r18prot"); if(R18.cam){ R18.cam = null; try{ camera.setViewOffset(VW, VH, 0, isFinite(viewShift) && viewShift > -1e8 ? viewShift : 0, VW, VH); }catch(e){} viewShift = -1e9; } }
function r18Hit(){ var best = null; (typeof shields === "undefined" ? [] : shields).forEach(function(sh){ if(!sh.el.classList.contains("over")) return;
  var p = typeof shieldAnchor === "function" ? toScreen(shieldAnchor(sh)) : null; if(p && p.on && (!best || (sh.jd || 0) > best.jd)) best = { sh:sh, jd:sh.jd || 0, y:p.y }; }); return best; }
var sr18 = showResult; showResult = function(){
  var r = lastResult, o = sr18.apply(this, arguments);
  try{ var rs = $("result"), prot = !!(r && !r.ok && r.code === "collateral" && !manual && screen === "result");
    if(rs) rs.classList.toggle("r18prot", prot);
    if(prot){ var lim = kLim(), c = Math.round((r.coll || 0)*100), f = Math.min(1, Math.max(0, r.coll || 0));
      var pe = $("rPct"); if(pe) pe.textContent = "Blue building " + c + "% · max " + lim + "%";
      var mf = $("rmFill"); if(mf){ mf.style.width = "calc(" + (f*100).toFixed(1) + "% - " + (f*6).toFixed(1) + "px)"; mf.classList.remove("go"); }
      var mp = $("rmPass"); if(mp){ mp.style.left = "calc(3px + (100% - 6px)*" + (lim/100) + ")"; mp.dataset.t = lim + "%"; }
      R18.card++; lg("protCard:" + c + "/" + lim);
      var h = r18Hit(), tgt = innerHeight*0.24;   // the tag's anchor (roof of the hit building) eases to ~24 % of the screen
      if(h && h.y > tgt){ R18.cam = { t0:performance.now(), off:Math.min(0.3*VH, h.y - tgt), k:0, y0:Math.round(h.y) }; lg("protCam:" + Math.round(R18.cam.off)); }
    } else if(R18.cam) r18End();
  }catch(e){ console.error("polish r18", e); }
  return o; };
var uc18 = updateCamera; updateCamera = function(){
  var r = uc18.apply(this, arguments), c = R18.cam;
  if(c){ if(screen !== "result"){ r18End(); return r; }
    var u = rmOn() ? 1 : Math.min(1, (performance.now() - c.t0)/400), e = u < 0.5 ? 4*u*u*u : 1 - Math.pow(-2*u + 2, 3)/2; c.k = e;
    try{ camera.setViewOffset(VW, VH, 0, (viewShift > -1e8 ? viewShift : 0) + c.off*e, VW, VH); }catch(x){} }
  return r; };
// the hit building's red tag stays on screen over the card's clear top (the base loop hides every tag off the game screen)
var ss18 = stepShields; stepShields = function(){ var r = ss18.apply(this, arguments);
  var rs = $("result"); if(screen === "result" && rs && rs.classList.contains("r18prot") && typeof shieldAnchor === "function"){ camera.updateMatrixWorld();
    shields.forEach(function(sh){ if(!sh.el.classList.contains("over")) return; var p = toScreen(shieldAnchor(sh)); if(!p.on) return;
      sh.el.style.display = ""; sh.el.style.transform = "translate(" + Math.round(p.x) + "px," + Math.round(p.y) + "px)"; R18.tagShown++; }); }
  return r; };
var sl18 = startLevel; startLevel = function(){ r18End(); return sl18.apply(this, arguments); };
var gh18 = goHome; goHome = function(){ r18End(); return gh18.apply(this, arguments); };
// M4 (18/11, Owner "đáy các toà nhà bị lỗi", feedback/2026-11-18/owner/base-bug.jpg): every building stands on its ground slab (`base`, the
// blue-tint `kbase` under a protected one: an anchor box 0.5 m tall whose top is at y = 0) and the lawn disc is ALSO at y = 0, so the slab's
// top face and the lawn are coplanar and z-fight: grass speckles through the pad, its edges shimmer and change as the camera moves (every
// build since v1look, v52 / v53 included). Render-only fix: the slab draws a hair in front of the lawn (polygon offset); no body, size or
// colour changes. The sand lot disc (y = 0.01) still covers it under the hero as before.
function r18Pads(){ ["base", "kbase"].forEach(function(k){ var m = typeof MATS !== "undefined" && MATS[k]; if(!m || m._r18pad) return; m._r18pad = 1;
  m.polygonOffset = true; m.polygonOffsetFactor = 0; m.polygonOffsetUnits = -4; m.needsUpdate = true; }); }   // units only (about 2 mm at 60 m): wins over the lawn at 0, never over the sand lot at 0.01
try{ r18Pads(); }catch(e){}
var bl18 = startLevel; startLevel = function(){ try{ r18Pads(); }catch(e){} return bl18.apply(this, arguments); };
P.pads = function(){ return ["base", "kbase"].map(function(k){ var m = MATS[k]; return { k:k, on:!!(m && m.polygonOffset), f:m && m.polygonOffsetFactor, u:m && m.polygonOffsetUnits }; }); };
// test hooks (18/11, l32-swap REPORT §2): how far each hero-kit decor piece is drawn from where its member's body puts it right now
// (the pose the last frame drew: P0 -> P at alpha, Q0 -> Q), over every live host; and the hosts with the most decor
P.kdDrift = function(){ if(typeof L6_KD === "undefined") return null;
  var m = new THREE.Matrix4(), e = new THREE.Matrix4(), l = new THREE.Matrix4(), v = new THREE.Vector3(), w = new THREE.Vector3(), pp = new THREE.Vector3(), qq = new THREE.Quaternion(), one = new THREE.Vector3(1, 1, 1);
  var o = { worst:0, wi:-1, wkey:null, hosts:0, bent:0, bentHosts:[], pieces:0 };
  blocks.forEach(function(b, i){ if(!b.kd || !b.im || b.anchor || (b.dead && !b.rubble)) return; o.hosts++; if(b.bent){ o.bent++; o.bentHosts.push(i); }
    pp.copy(b.P0).lerp(b.P, alpha); qq.copy(b.Q0).slerp(b.Q, alpha); e.compose(pp, qq, one);
    b.kd.forEach(function(p){ if(!p.im) return; o.pieces++; p.im.getMatrixAt(p.ii, m); l.compose(p.o, p.q, p.s); v.setFromMatrixPosition(m); w.setFromMatrixPosition(e.clone().multiply(l));
      var d = v.distanceTo(w); if(d > o.worst){ o.worst = d; o.wi = i; o.wkey = b.key; } }); });
  o.worst = +o.worst.toFixed(3); o.bentHosts = o.bentHosts.slice(0, 12); return o; };
P.kdHosts = function(){ var r = []; blocks.forEach(function(b, i){ if(b.kd && b.kd.length && !b.anchor) r.push({ i:i, key:b.key, n:b.kd.length, x:+b.P.x.toFixed(1), y:+b.P.y.toFixed(1), z:+b.P.z.toFixed(1) }); }); return r.sort(function(a, b){ return b.n - a.n; }); };
P.r18 = function(){ var rs = $("result"), c = R18.cam, tag = null;
  (typeof shields === "undefined" ? [] : shields).forEach(function(sh){ if(sh.el.classList.contains("over") && sh.el.style.display !== "none"){ var b = sh.el.getBoundingClientRect(); tag = { x:Math.round(b.x + b.width/2), y:Math.round(b.y + b.height/2) }; } });
  return { guard:R18.guard, guards:R18.guards.slice(-5), closeT:R18.closeT > 0 ? Math.round(performance.now() - R18.closeT) : null, card:R18.card, prot:!!(rs && rs.classList.contains("r18prot")),
    cam:c ? { off:Math.round(c.off), k:+c.k.toFixed(2), y0:c.y0 } : null, tag:tag, tagShown:R18.tagShown, ringOff:(window.__blast.tap2 && window.__blast.tap2.stats ? window.__blast.tap2.stats().ringOff : null) }; };

// ================= Tester round 19/11 (feedback/2026-11-19/DIGEST.md fix 1, uxui UX-36…45, user U-3, designer GD-40). Group A only:
// layout, size, order, colour and timing of EXISTING elements (D-blast-NONEW); nothing decided is changed (D-blast-TF6: the lose card
// keeps "N%" without "· need 85%" and keeps its "+1 TNT" rescue, A4 stays off). ?r19=0 = none of it (A/B shots).
//  Q1 (UX-36 / UX-37) one tab bar on Home and the City Map (ul.css made the Map's 136 plate px against Home's 164: a 14 px jump).
//     The Map's "Play · Level N" cannot move up: it covers the "PLAY LV" button painted into the map plate (cmBg) exactly. So the
//     shared height is the tallest bar whose raised tile clears that button and its 3D base on this phone: min(164, 159 - (inset + 10 px)
//     / scale) plate px (iPhone SE ~57 px = the old Map bar, 393 x 852 ~61 px), and the Map tile's pin stays inside its tile (it poked into the button).
//     The back button >= 44 x 44 at every size (was 39 at 375 x 667: 92 plate px x 0.42). The plaques grow to their words (mapFit above).
//  Q2 (UX-36) tab labels: the side tabs sit on the bar's bottom (label >= 6 px above the screen edge / inset; "Shop" / "Upgrades" were
//     cut at 375 x 667); their icons are <= tab bar - 22 px and may rise a little over the bar's top edge, as the raised tile does.
//  Q3 (UX-38) one booster order everywhere: Lv.11 · Lv.21 · Lv.31 left to right in the HUD tray, as on the pre-level popup.
//  Q4 (UX-39) every fail card docks low like the protected-building card (UX-31): the top of the screen undimmed, the view eased up
//     so what still stands is in the clear top part; the bar's tick carries its goal "85%" (the HUD's own tick label, TF6 A5) — the
//     "N%" line itself stays as decided (TF6 A4 off).
//  Q5 (UX-40) a rescue that cannot be paid ("+1 TNT · 150 · need more") is a quiet secondary line under Try Again, 16 px, 44 px tall
//     (not a 66 px button above it). Shown, not removed (Owner's call); an affordable rescue keeps its own button.
//  Q6 (UX-41) Pause >= 16 px from the screen edge on phones without a cutout (was 6 px at 375); the level cap and the meter move with it.
//  Q7 (UX-42) 16 px floor: the reset warning (in the warning colour); the screen-reader "PASS 85%" tag.
//  Q8 (UX-44) the in-level toast is one line and sits >= 12 px above the chip row.
//  Q9 (UX-45) while "Restart from Level 1?" is open, Done is disabled (0.4, no taps): the question is answered by Restart or Cancel.
//  Q10 (U-3) a protected-building fail: the red % tag shows the card's number (the share the rule judged); no tag shows more than it.
//  Q11 (GD-40) an armed booster (ball aim / Sky Strike) is disarmed when an intro card or spotlight opens over it (card cascades on a
//     jumped save): the spotlight's own tap, or the next tap, then does what it says instead of firing the booster.
(function(){
if(QS.get("r19") === "0") return;
H.classList.add("r19");
var R19 = { back:null, dock:0, cam:null, sec:0, toastY:0, frz:0, disarm:0, log:[] };
function lg19(s){ R19.log.push(s); if(R19.log.length > 40) R19.log.shift(); lg(s); }
var css = [
  // Q1 one tab-bar height on Home and Map: the tallest that clears the Map's Play button (see above)
  "html.r19 body,html.r19 body.ulMapOn{--ul-tabh:min(calc(164 * var(--ups)), calc(159 * var(--ups) - min(8px, var(--sa-b, 0px)) - 10px))!important}",
  "html.r19 body.ulMapOn #ulTabs #toMap.on .ic{margin-top:0!important;height:min(calc(84 * var(--ups)), calc(var(--ul-tabh) - 34px))!important}",
  // (UX-42) the active tab's label 18 px (was 20: 25 % over the side tabs' 16), which also gives the Map pin its room
  "html.r19.ui2 body #ulTabs .ulTab.on{font-size:18px!important}",
  // Q2 the side tabs: label on the bar's bottom, icon <= bar - 22 px
  "html.r19.ui2 body #ulTabs .ulTab:not(.on){justify-content:flex-end!important}",
  "html.r19.ui2 body #ulTabs .ulTab:not(.on) .u2ic{width:min(50px, calc(var(--ul-tabh) - 22px));height:min(50px, calc(var(--ul-tabh) - 22px))}",
  // Q3 the tray: row-reverse from the TNT card, so the higher order sits further left: Lv.11 (wreck) left, Lv.31 (sky) next to TNT
  "html.r19 body #bottom .bst[data-k=sky]{order:3}html.r19 body #bottom .bst[data-k=net]{order:4}html.r19 body #bottom .bst[data-k=wreck]{order:5}",
  // Q4 the dock (the UX-31 layout, without the red bar) + the goal at the tick
  "html.r19 body #result.r19dock{justify-content:flex-end;background:linear-gradient(rgba(43,33,64,0) 0,rgba(43,33,64,0) 40%,rgba(43,33,64,.55) 52%,rgba(43,33,64,.62) 100%)!important;-webkit-backdrop-filter:none!important;backdrop-filter:none!important}",
  "html.r19 body #result.r19dock .card{margin-top:0!important;margin-bottom:calc(env(safe-area-inset-bottom, 0px) + 16px)}",
  "html.r19 body #result.r19dock #rmPass::after{content:attr(data-t)!important;display:block!important;position:absolute!important;left:50%!important;right:auto!important;top:auto!important;bottom:calc(100% + 3px)!important;" +
    "width:auto!important;height:auto!important;transform:translateX(-50%)!important;border:0!important;background:none!important;padding:0!important;margin:0!important;" +
    "font:400 16px/1 var(--ul-fr,'Lilita One'),system-ui,sans-serif!important;color:var(--ul-ink)!important;-webkit-text-stroke:4px #FFF8E1!important;paint-order:stroke fill!important;white-space:nowrap!important;pointer-events:none}",
  // Q5 the unaffordable rescue: a quiet line under Try Again
  "html.r19 body #result #rRescue.r19sec{display:flex!important;align-items:center;justify-content:center;gap:6px;width:auto!important;min-width:0!important;height:44px!important;min-height:44px!important;margin:8px auto 0!important;padding:0 16px!important;" +
    "background:none!important;border:0!important;box-shadow:none!important;filter:none!important;opacity:1!important;font:400 16px/1 var(--ul-fr,'Lilita One'),system-ui,sans-serif!important;color:rgba(43,33,64,.72)!important;-webkit-text-stroke:0!important;text-shadow:none!important}",
  "html.r19 body #result #rRescue.r19sec .coin{width:20px!important;height:20px!important;margin:0!important;opacity:.7}",
  "html.r19 body #result #rRescue.r19sec small{font:400 16px/1 var(--ul-fr,'Lilita One'),system-ui,sans-serif!important;color:rgba(43,33,64,.72)!important}",
  "html.r19 body #result #rRescue.r19sec::before,html.r19 body #result #rRescue.r19sec::after{display:none!important}",
  // Q6 Pause >= 16 px from the edge (no cutout: the uilayout row); the cap and the meter shift by the same amount
  "html.r19:not(.saCut) body #top{--r19dx:max(0px, calc(40px - var(--ux) - 70 * var(--us)))}",
  "html.r19:not(.saCut) body #top #pauseBtn{left:calc(var(--ux) + 70 * var(--us) - 24px + var(--r19dx))!important}",
  "html.r19.ui2:not(.saCut) body #top #lvPill{left:calc(var(--ux) + 132 * var(--us) + var(--r19dx))!important}",
  "html.r19.ui2:not(.saCut) body #top #meter{left:calc(var(--ux) + 318 * var(--us) + var(--r19dx))!important}",
  // Q7 16 px floor
  "html.r19 body #resetAsk .rs{font-size:16px!important;line-height:1.2!important;color:#A8161B!important}",
  "html.r19 body #mTag{font-size:16px!important}",
  // Q8 the in-level toast: one line (its bottom is set in JS, clear of the chip row)
  "html.r19 body:not(.ulMenu) #toast{white-space:nowrap!important;max-width:calc(100vw - 32px)!important}",
  // Q9 Done is not live while the reset question is open
  "html.r19 body #resetAsk:not(.hidden) ~ #setClose{opacity:.4!important;pointer-events:none!important}"
].join("\n");
var st19 = document.createElement("style"); st19.id = "polR19Css"; st19.textContent = css; document.head.appendChild(st19);

// ---- Q1 Map: back button >= 44 (it lives in the scaled plate row .cmTop); measures for the checks
function r19Map(){
  var cm = $("cityMap"), cp = $("cmPlay"), bk = $("cmBack"), tabs = $("ulTabs"); if(!cm || cm.classList.contains("hidden") || !cp || !tabs) return null;
  if(bk && bk.offsetWidth){ var k = bk.getBoundingClientRect().width/bk.offsetWidth; if(k > 0.05){ var w = Math.max(92, Math.ceil(46/k));
    if(bk.style.width !== w + "px"){ bk.style.width = bk.style.height = w + "px"; var ic = bk.querySelector(".i"); if(ic) ic.style.width = ic.style.height = Math.round(52*w/92) + "px"; } } }
  var mt = $("toMap"), top = 1e9; if(mt) [mt].concat([].slice.call(mt.querySelectorAll("*"))).forEach(function(e){ var r = e.getBoundingClientRect(); if(r.width > 0 && r.height > 0) top = Math.min(top, r.top); });
  R19.back = bk ? Math.round(bk.getBoundingClientRect().width) : null;
  return { tileTop:Math.round(top), playBottom:Math.round(cp.getBoundingClientRect().bottom), back:R19.back };
}
var cm19 = $("cityMap");
if(cm19){ var m19T = 0; new MutationObserver(function(){ clearTimeout(m19T); m19T = setTimeout(r19Map, 120); setTimeout(r19Map, 500); }).observe(cm19, { attributes:true, attributeFilter:["class"] });
  window.addEventListener("resize", function(){ setTimeout(r19Map, 400); }); }

// ---- Q4 / Q5 / Q10 the fail card
function standC(){   // what still stands of the targets (not rubble on the ground), else everything that is left
  var x = 0, y = 0, z = 0, n = 0, i, b;
  for(i=0;i<blocks.length;i++){ b = blocks[i]; if(b.dead || b.anchor || b.keep || b.prop || b.bonus || !b.P || b.P.y < 1.2) continue; x += b.P.x; y += b.P.y; z += b.P.z; n++; }
  if(!n) for(i=0;i<blocks.length;i++){ b = blocks[i]; if(b.dead || b.anchor || b.keep || b.prop || b.bonus || !b.P) continue; x += b.P.x; y += b.P.y; z += b.P.z; n++; }
  return n ? new THREE.Vector3(x/n, y/n, z/n) : null;
}
function dockEnd(){ var rs = $("result"); if(rs) rs.classList.remove("r19dock"); if(R19.cam){ R19.cam = null; try{ camera.setViewOffset(VW, VH, 0, isFinite(viewShift) && viewShift > -1e8 ? viewShift : 0, VW, VH); }catch(e){} viewShift = -1e9; } }
var rescHome = null;
function rescPlace(r){
  var rc = $("rRescue"), nx = $("rNext"); if(!rc || !nx) return;
  if(!rescHome) rescHome = { p:rc.parentNode, n:rc.nextSibling };
  var cant = !!(r && !r.ok && (rc.disabled || rc.classList.contains("cant")) && !rc.classList.contains("hidden") && !rc.classList.contains("polNo"));
  rc.classList.toggle("r19sec", cant);
  if(cant){ if(nx.nextSibling !== rc) nx.parentNode.insertBefore(rc, nx.nextSibling); R19.sec++; }
  else if(rc.previousSibling === nx && rescHome.p){ rescHome.p.insertBefore(rc, rescHome.n && rescHome.n.parentNode === rescHome.p ? rescHome.n : nx); }
}
var sr19 = showResult; showResult = function(){
  var r = lastResult, o = sr19.apply(this, arguments);
  try{
    var rs = $("result"), fail = !!(r && !r.ok && !manual && screen === "result");
    rescPlace(r);
    var dock = fail && r.code !== "collateral";   // the collateral card has its own dock (r18prot, UX-31)
    if(rs) rs.classList.toggle("r19dock", dock);
    if(dock){ R19.dock++; var c = standC(), s = c ? toScreen(c) : null, tgt = innerHeight*0.28;
      if(s && isFinite(s.y) && s.y > tgt){ R19.cam = { t0:performance.now(), off:Math.min(0.3*VH, s.y - tgt), k:0, y0:Math.round(s.y) }; lg19("dockCam:" + Math.round(R19.cam.off)); } else lg19("dock"); }
    else if(R19.cam) dockEnd();
    if(r && !r.ok && r.code === "collateral") align(r);
  }catch(e){ console.error("polish r19", e); }
  return o; };
var uc19 = updateCamera; updateCamera = function(){
  var r = uc19.apply(this, arguments), c = R19.cam;
  if(c){ if(screen !== "result"){ dockEnd(); return r; }
    var u = rmOn() ? 1 : Math.min(1, (performance.now() - c.t0)/400), e = u < 0.5 ? 4*u*u*u : 1 - Math.pow(-2*u + 2, 3)/2; c.k = e;
    try{ camera.setViewOffset(VW, VH, 0, (viewShift > -1e8 ? viewShift : 0) + c.off*e, VW, VH); }catch(x){} }
  return r; };
var sl19 = startLevel; startLevel = function(){ dockEnd(); R19.frz = 0; return sl19.apply(this, arguments); };
var gh19 = goHome; goHome = function(){ dockEnd(); return gh19.apply(this, arguments); };
var rs19 = typeof rescue === "function" ? rescue : null; if(rs19) rescue = function(){ dockEnd(); return rs19.apply(this, arguments); };
// Q10 the tags = the card: the most damaged building shows the judged share (r.coll), no tag above it (from the verdict to the card)
function align(r){ if(typeof shields === "undefined" || !shields.length || !r) return; var c = Math.max(0, r.coll || 0), w = null;
  shields.forEach(function(sh){ if(!w || (sh.jd || 0) > (w.jd || 0)) w = sh; });
  shields.forEach(function(sh){ sh.jd = sh === w ? c : Math.min(sh.jd || 0, c); }); R19.frz++; }
var ss19 = stepShields; stepShields = function(){
  try{ var r = lastResult; if(phase === "done" && r && !r.ok && r.code === "collateral" && (screen === "game" || screen === "result")) align(r); }catch(e){}
  return ss19.apply(this, arguments); };

// ---- Q8 the in-level toast clear of the chip row
var to19 = $("toast");
if(to19) new MutationObserver(function(){
  if(screen !== "game"){ if(to19.style.bottom) to19.style.bottom = ""; return; }
  if(!to19.classList.contains("on")) return;
  var row = 1e9; [].forEach.call(document.querySelectorAll("#bottom .chip, #bottom .bst"), function(e){ var q = e.getBoundingClientRect(); if(q.width > 0 && q.height > 0) row = Math.min(row, q.top); });
  if(row >= 1e9) return;
  var tb = to19.getBoundingClientRect(); if(!tb.height) return;
  var cur = parseFloat(getComputedStyle(to19).bottom) || 0, want = cur + Math.max(0, tb.bottom - (row - 12));
  if(want > cur + 0.5){ to19.style.bottom = Math.ceil(want) + "px"; R19.toastY = Math.round(row - 12); }
}).observe(to19, { attributes:true, attributeFilter:["class"], childList:true, characterData:true, subtree:true });

// ---- Q9 Done disabled while the reset question is open
var ra19 = $("resetAsk"), sc19 = $("setClose");
if(ra19 && sc19) new MutationObserver(function(){ var open = !ra19.classList.contains("hidden"); sc19.disabled = open; if(open) sc19.setAttribute("aria-disabled", "true"); else sc19.removeAttribute("aria-disabled"); })
  .observe(ra19, { attributes:true, attributeFilter:["class"] });

// ---- Q11 a card / spotlight over an armed booster disarms it
function armed(){ return { ball:typeof ballAim !== "undefined" && !!ballAim, sky:typeof skyArmed !== "undefined" && !!skyArmed }; }
function disarm(why){
  var a = armed(), live = (typeof ballLive !== "undefined" && ballLive) || (typeof skyLive !== "undefined" && skyLive); if(live || (!a.ball && !a.sky)) return;
  try{ if(a.ball && typeof ballAimOff === "function") ballAimOff(); if(a.sky && typeof skyDisarm === "function") skyDisarm(); }catch(e){}
  R19.disarm++; lg19("disarm:" + why + ":" + (a.ball ? "ball" : "sky")); }
["inCard", "inDim"].forEach(function(id){ var el = $(id); if(!el) return; var was = !el.classList.contains("hidden");
  new MutationObserver(function(){ var o = !el.classList.contains("hidden"); if(o && !was && screen === "game") disarm(id); was = o; }).observe(el, { attributes:true, attributeFilter:["class"] }); });

P.r19 = function(){ var rs = $("result"), rc = $("rRescue"), c = R19.cam;
  return { on:true, back:R19.back, map:r19Map(), dock:!!(rs && rs.classList.contains("r19dock")), docks:R19.dock, cam:c ? { off:Math.round(c.off), k:+c.k.toFixed(2), y0:c.y0 } : null,
    sec:!!(rc && rc.classList.contains("r19sec")), secAfterNext:!!(rc && rc.previousElementSibling && rc.previousElementSibling.id === "rNext"), frz:R19.frz, disarm:R19.disarm, toastY:R19.toastY, armed:armed(), standY:(function(){ var q = standC(); if(!q) return null; camera.updateMatrixWorld(); var v = toScreen(q); return isFinite(v.y) ? Math.round(v.y) : null; })(), log:R19.log.slice() }; };
// test only: the texts the player reads for the current level (name, level tip, fail line) after every runtime mapping (NOHINT, K1)
P.r19copy = function(){ var o = { name:L && L.name }; try{ o.tip = levelTip(); }catch(e){ o.tip = null; } try{ o.ftip = failTip({ ok:false, code:"pct", pct:0.5, coll:0, why:"" }); }catch(e){ o.ftip = null; } return o; };
// test only: simulate a stale tag snapshot (the U-3 case) on the most damaged building
P.r19skew = function(v){ if(typeof shields === "undefined" || !shields.length) return null; var w = null; shields.forEach(function(sh){ if(!w || (sh.jd || 0) > (w.jd || 0)) w = sh; }); w.jd = v; return true; };
P.r19disarm = disarm;
})();

// ================= Tester round 20/11 (feedback/2026-11-20/DIGEST.md fixes 1 + 2, group A, D-blast-NONEW: no new element; the
// "Proposals for Owner" list is not built). ?r20=0 = none of it (A/B shots; the test probe below stays, it changes nothing).
//  T1 (GD-42 / GD-45, enforces D-blast-NOSTACK) one TNT per MEMBER: a member that already holds an unfired TNT rejects another (the
//     same tap ring as before); a different member takes it whatever the pixel distance (the 24 px / 10 px screen rule of tap2 T3
//     rejected neighbouring steel legs 8-20 px apart and let a 2nd TNT onto the same member > 24 px away). Via tap2 api.setNear.
//  T2 (GD-43) a first-use spotlight that places (L3 Brick, L4 Concrete, L8 Steel): a tap OUTSIDE its ring on another valid member
//     (not blue, not a member already holding TNT) places there and dismisses the hand (it was dropped silently). Via intro setPass.
//  T3 (U-2) false "Tap a building": (a) a tap on hero dress that sits on the ground slab (the L3 tower porch, L9 plinths) returned
//     "nothing" at once; the ray now goes on to what is behind it (as NOPICK); (b) a tap in a gap INSIDE a building (window holes of
//     the open-frame stacks on L10, between porch columns) that the exact ray threads: when members are hit on BOTH sides of the tap
//     (left + right or above + below, <= 10 px), the nearer side takes it. A tap that only grazes one building (open ground beside a
//     column) still says "Tap a building" (TAPEXACT: no jump to a nearby column). Via tap2 api.pickOpt.
//  T4 (U-3, L11) Wrecking Ball: after a swing the ball is put away (the booster's 2nd swing stays on the chip as its "x1" badge, the
//     chip drops its armed look, the view eases back); the next tap places TNT; the chip re-arms it. Before, the aim stayed on unseen: column taps were refused silently,
//     then a wall tap threw the 2nd ball.
//  T5 UI (uxui 20/11): UX-50 the tutorial dim / ring / glove hide while the Pause sheet is open (back on Resume); UX-51 the level cap
//     >= 8 px right of Pause when they share a row (375 x 667; the meter gives up the same px); UX-54 the fail card's Home sits in the
//     Pause slot (same size and place) and the coin pill on the Pause row; UX-55 one chain-ball icon (the popup tile's art) on the HUD
//     chip, armed = gold 4 px ring + 1.08 + gold tint, parked / idle = plain; UX-57 the Upgrades sub-line navy on a cream pill; UX-60
//     the last two words of a tip / card line / warning never split (a nowrap span: the text itself is unchanged); UX-42 the HUD
//     booster badge and the Settings row labels >= 16 px.
(function(){
var R20 = { on:QS.get("r20") !== "0", near:0, nearSame:0, nearOther:0, pass:0, gap:0, kdThru:0, park:0, nw:0, ux51:null, ux54:null, log:[] };
function lg20(s){ R20.log.push(s); if(R20.log.length > 40) R20.log.shift(); lg(s); }
// ---- test probe (both modes): taps on member centres + a grid over the play area, through the live pick (what a tap does)
P.r20probe = function(step){
  step = step || 8;
  var tb = $("top") ? $("top").getBoundingClientRect().bottom : 0, bb = $("bottom") ? $("bottom").getBoundingClientRect().top : innerHeight;
  var cen = { n:0, self:0, other:0, miss:0 }, i, b, s, h;
  for(i=0;i<blocks.length;i++){ b = blocks[i]; if(b.anchor || b.dead || b.keep || b.prop || b.bonus) continue; s = toScreen(b.P); if(!s.on || s.y < tb + 4 || s.y > bb - 4 || s.x < 6 || s.x > innerWidth - 6) continue;
    cen.n++; h = pick(s.x, s.y); if(!h) cen.miss++; else if(h.block === b) cen.self++; else cen.other++; }
  var rc = new THREE.Raycaster(), nd = new THREE.Vector2(), kdm = new Set(), mm = new Set();
  if(typeof L6_KD !== "undefined" && L6_KD.mesh) Object.keys(L6_KD.mesh).forEach(function(g){ if(L6_KD.mesh[g]) kdm.add(L6_KD.mesh[g]); });
  Object.keys(inst).forEach(function(k){ if(inst[k] && inst[k].mesh) mm.add(inst[k].mesh); }); if(MB.mesh) mm.add(MB.mesh);
  var memo = {};
  var bld = function(x, y){ var key = Math.round(x) + "," + Math.round(y); if(key in memo) return memo[key];
    nd.x = ((x - VX)/VW)*2 - 1; nd.y = -((y - VY)/VH)*2 + 1; rc.setFromCamera(nd, camera);
    var hs = rc.intersectObjects(scene.children, true), r = false;
    for(var q=0;q<hs.length;q++){ var o = hs[q].object, v = true, p = o; while(p){ if(!p.visible){ v = false; break; } p = p.parent; } if(!v || o.type === "Sprite" || o.type === "Points" || /Line/.test(o.type)) continue;
      if(kdm.has(o)) r = true; else if(mm.has(o)){ var u = o.userData && o.userData.list ? o.userData.list[hs[q].instanceId] : null; r = !!(u ? !u.anchor && !u.dead : o === MB.mesh); }
      break; }
    return (memo[key] = r); };
  var vis = { n:0, miss:0 }, hole = { n:0, miss:0 }, pts = [];
  for(var y = tb + 4; y < bb - 4; y += step) for(var x = 6; x < innerWidth - 6; x += step){
    var isB = bld(x, y), inB = !isB && ((bld(x - 10, y) && bld(x + 10, y)) || (bld(x, y - 10) && bld(x, y + 10)));
    if(!isB && !inB) continue; h = pick(x, y);
    if(isB){ vis.n++; if(!h){ vis.miss++; if(pts.length < 30) pts.push([Math.round(x), Math.round(y), "vis"]); } }
    else { hole.n++; if(!h){ hole.miss++; if(pts.length < 30) pts.push([Math.round(x), Math.round(y), "hole"]); } } }
  return { on:R20.on, centres:cen, visible:vis, holes:hole, pts:pts };
};
P.r20 = function(){ return { on:false }; };
if(!R20.on) return;
H.classList.add("r20");
var T2a = window.__blast.tap2;
// ---- T1 one TNT per member
function liveOn(b){ for(var q=0;q<charges.length;q++){ var c = charges[q]; if(c.fired || (c.def && c.def.kind === "wreck")) continue; if(c.host === b) return c; } return null; }
if(T2a && T2a.setNear) T2a.setNear(function(x, y){ var h = pick(x, y); if(!h) return null; var c = liveOn(h.block); R20.near++; if(c) R20.nearSame++; else R20.nearOther++; return c; });
// ---- T3 the pick: dress on the ground slab lets the ray through; a gap inside a building goes to the nearer side
var GAP = [4, 7, 10];
var DSNAP = 3.0;   // = tap2 DRESS_SNAP (m): dress on a member carries its TNT to that member's nearest point; dress on the ground slab, to the nearest member
function gapPick(x, y, tp, kdA){
  if(kdA){ var bb = null, bd = DSNAP, mp = new THREE.Vector3(), bp = null;
    for(var q=0;q<blocks.length;q++){ var B = blocks[q]; if(B.dead || B.anchor || B.keep || B.prop || B.bonus || !B.rb) continue; nearestPoint(B, kdA, mp); var d = mp.distanceTo(kdA); if(d < bd){ bd = d; bb = B; bp = mp.clone(); } }
    if(bb){ R20.kdThru++; lg20("kdSnap:" + bd.toFixed(2)); var no = bd > 1e-3 ? kdA.clone().sub(bp).normalize() : new THREE.Vector3(0, 0, 1); return { block:bb, point:bp, normal:no, kd:true, snap:bd }; } }
  for(var k=0;k<GAP.length;k++){ var r = GAP[k], l = tp(x - r, y), rt = tp(x + r, y), u, d, w = null;
    if(l && rt && !!l.block.keep === !!rt.block.keep) w = l;
    else { u = tp(x, y - r); d = tp(x, y + r); if(u && d && !!u.block.keep === !!d.block.keep) w = d; }
    if(w){ R20.gap++; lg20("gap:" + r); return w; } }
  return null; }
if(T2a && T2a.pickOpt){ T2a.pickOpt.kdThrough = true; T2a.pickOpt.miss = gapPick; }
// ---- T2 the first-use spotlight lets a tap on another valid member through
var IA = window.__blast.intro;
if(IA && IA.setPass) IA.setPass(function(x, y){ var h = pick(x, y); if(!h || h.block.keep || h.block.anchor || h.block.prop || liveOn(h.block)) return false; R20.pass++; lg20("pass"); return true; });
// ---- T4 the ball is put away after each swing (no toast: in-level words are muted, uiclean NUDGE; the chip shows it: badge x1, not armed; the view eases back)
if(typeof ballResolve === "function"){ var br20 = ballResolve; ballResolve = function(){
  var o = br20.apply(this, arguments);
  try{ if(!manual && screen === "game" && phase === "plan" && ballAim && !ballLive && ballLeft > 0){ ballAimOff(); R20.park++; lg20("park:" + ballLeft); bstSync(); } }catch(e){ console.error("polish r20", e); }
  return o; }; }
// ---- T5 UI
var css = [
  // UX-50 the Pause sheet over the tutorial layer: the dim, ring and glove step aside while it is open
  "html.r20 body.r20pause #inDim{visibility:hidden!important}",
  // UX-55 one chain-ball icon; armed is plain to see; UX-42 badge 16 px
  "html.r20 body.r20art #bottom .bst[data-k=wreck]::before{background-image:var(--r20ball)!important}",
  "html.r20 body #bottom .bst.bst.r20arm{transform:scale(1.08)!important;border-color:#FFC633!important;background:#FFE9A8!important;box-shadow:0 0 0 4px #FFC633,0 calc(6 * var(--us)) 0 rgba(14,36,102,.35)!important}",
  "html.r20 body #bottom .bst.bst .bn{font-size:16px!important}",
  // UX-57 the Upgrades sub-line: navy on a cream pill (as the coin pill above it)
  "html.r20.sh2 body #shop #sh2UpSub{display:table!important;margin-left:auto!important;margin-right:auto!important;padding:4px 14px!important;border-radius:16px!important;background:#FFF8E1!important;color:#0E2466!important}",
  // UX-60 the last two words stay together
  "html.r20 .r20nw{white-space:nowrap}",
  // UX-42 Settings row labels >= 16 px (the card's own scale is taken out in JS: --r20sf)
  "html.r20.r20sf body #settings .card.set .pillbtn.tog{font-size:var(--r20sf)!important}"
].join("\n");
var st20 = document.createElement("style"); st20.id = "polR20Css"; st20.textContent = css; document.head.appendChild(st20);
// UX-50
var pm20 = $("pauseM");
if(pm20){ var syncP = function(){ document.body.classList.toggle("r20pause", !pm20.classList.contains("hidden")); }; new MutationObserver(syncP).observe(pm20, { attributes:true, attributeFilter:["class"] }); syncP(); }
// UX-55 the art + the armed class (the chip's "on" = armed or swinging; a parked ball keeps its "×1" badge, not the armed look)
try{ var art = window.__blast.pre && window.__blast.pre.art ? window.__blast.pre.art("wreck") : null; if(art && /^data:image/.test(art)){ H.style.setProperty("--r20ball", 'url("' + art + '")'); document.body.classList.add("r20art"); } }catch(e){}
var bs20 = bstSync; bstSync = function(){
  var o = bs20.apply(this, arguments);
  try{ var bar = $("bbar"); if(bar) [].forEach.call(bar.children, function(b){ var k = b.dataset.k, arm = (k === "wreck" && (ballAim || !!ballLive)) || (k === "sky" && (skyArmed || !!skyLive));
    if(k === "wreck") b.classList.toggle("on", arm);
    b.classList.toggle("r20arm", !!(arm && (k === "wreck" ? ballAim : skyArmed))); }); }catch(e){}
  return o; };
// UX-51 the level cap >= 8 px right of Pause on the same row (the meter gives up the same px)
function ux51(){
  var pb = $("pauseBtn"), lp = $("lvPill"), mt = $("meter"); if(!pb || !lp || !mt) return null;
  [lp, mt].forEach(function(e){ e.style.removeProperty("left"); e.style.removeProperty("width"); });
  var a = pb.getBoundingClientRect(), b = lp.getBoundingClientRect(); if(!a.width || !b.width) return null;
  var row = a.top < b.bottom && b.top < a.bottom, gap = b.left - a.right, dx = row && gap < 8 ? Math.ceil(8 - gap) : 0;
  if(dx){ var cl = parseFloat(getComputedStyle(lp).left), ml = parseFloat(getComputedStyle(mt).left), mw = mt.getBoundingClientRect().width, k = mw/(mt.offsetWidth || mw);
    lp.style.setProperty("left", (cl + dx) + "px", "important"); mt.style.setProperty("left", (ml + dx) + "px", "important"); mt.style.setProperty("width", ((mw - dx)/k) + "px", "important"); }
  return (R20.ux51 = { row:row, gap0:Math.round(gap), dx:dx });
}
var sl20 = startLevel; startLevel = function(){ var o = sl20.apply(this, arguments); setTimeout(ux51, 60); setTimeout(function(){ ux51(); hudSlot(); }, 700); return o; };
window.addEventListener("resize", function(){ setTimeout(ux51, 300); });
// UX-54 the fail card: Home in the Pause slot, the coin pill on that row (the HUD slot is read while the level runs)
var slot = null;
function hudSlot(){ var pb = $("pauseBtn"); if(screen !== "game" || !pb) return; var r = pb.getBoundingClientRect(); if(r.width > 20) slot = { x:r.left, y:r.top, w:r.width, h:r.height }; }
var sr20 = showResult; showResult = function(){
  hudSlot(); var r = lastResult, o = sr20.apply(this, arguments);
  try{ var hm = $("rHome"), cp = $("coinPill"), fail = !!(r && !r.ok && !manual && screen === "result");
    if(hm){ ["position", "left", "top", "width", "height", "margin", "z-index"].forEach(function(p){ hm.style.removeProperty(p); }); }
    if(cp){ cp.style.removeProperty("top"); cp.classList.remove("r20row"); }
    if(fail && slot && hm){
      hm.style.setProperty("position", "fixed", "important"); hm.style.setProperty("left", Math.round(slot.x) + "px", "important"); hm.style.setProperty("top", Math.round(slot.y) + "px", "important");
      hm.style.setProperty("width", Math.round(slot.w) + "px", "important"); hm.style.setProperty("height", Math.round(slot.h) + "px", "important"); hm.style.setProperty("margin", "0", "important");
      var q0 = hm.getBoundingClientRect(); if(Math.abs(q0.left - slot.x) > 0.5 || Math.abs(q0.top - slot.y) > 0.5){   // a transformed ancestor: correct once by the measured offset
        hm.style.setProperty("left", Math.round(2*slot.x - q0.left) + "px", "important"); hm.style.setProperty("top", Math.round(2*slot.y - q0.top) + "px", "important"); }
      var c = cp ? cp.getBoundingClientRect() : null, want = slot.y + slot.h/2;
      if(c && c.height && Math.abs(c.top + c.height/2 - want) > 2){ var t0 = parseFloat(getComputedStyle(cp).top) || 0; cp.style.setProperty("top", (t0 + want - (c.top + c.height/2)) + "px", "important"); }
      var hr = hm.getBoundingClientRect(), cr = cp ? cp.getBoundingClientRect() : null;
      R20.ux54 = { home:[Math.round(hr.left), Math.round(hr.top), Math.round(hr.width)], slot:[Math.round(slot.x), Math.round(slot.y), Math.round(slot.w)], coinCy:cr && cr.height ? Math.round(cr.top + cr.height/2) : null }; lg20("ux54"); }
  }catch(e){ console.error("polish r20", e); }
  return o; };
var gh20 = goHome; goHome = function(){ pillBack(); return gh20.apply(this, arguments); };
function pillBack(){ var cp = $("coinPill"); if(cp) cp.style.removeProperty("top"); }
var sl20b = startLevel; startLevel = function(){ pillBack(); return sl20b.apply(this, arguments); };
var rs20 = typeof rescue === "function" ? rescue : null; if(rs20) rescue = function(){ pillBack(); return rs20.apply(this, arguments); };
// UX-60 no lone last word: the last two words of these lines sit in a nowrap span (textContent unchanged)
function glue(el){
  if(!el || el.querySelector(".r20nw")) return;
  var tn = null, w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), n; while((n = w.nextNode())) if(/\S/.test(n.nodeValue)) tn = n;
  if(!tn) return; var v = tn.nodeValue, m = /^([\s\S]*\s)(\S+\s+\S+\s*)$/.exec(v); if(!m || !/\S/.test(m[1])) return;
  var sp = document.createElement("span"); sp.className = "r20nw"; sp.textContent = m[2];
  var head = document.createTextNode(m[1]); tn.parentNode.insertBefore(head, tn); tn.parentNode.replaceChild(sp, tn); R20.nw++;
}
["rTip", "rWhy", "inL", "tip"].map($).concat([document.querySelector("#resetAsk .rs"), document.querySelector("#resetAsk .rq")]).forEach(function(el){
  if(!el) return; glue(el); var busy = false;
  new MutationObserver(function(){ if(busy) return; busy = true; try{ glue(el); }finally{ busy = false; } }).observe(el, { childList:true, characterData:true, subtree:true }); });
// UX-42 Settings labels: the effective size (computed x the card's scale) >= 16 px; measured after the card's pop-in (its scale would skew it)
function setFs(){ var t = document.querySelector("#settings .card.set .pillbtn.tog"); if(!t || !t.offsetHeight) return; H.classList.remove("r20sf");
  var k = t.getBoundingClientRect().height/t.offsetHeight, fs = parseFloat(getComputedStyle(t).fontSize); if(k > 0.05 && fs*k < 16){ H.style.setProperty("--r20sf", (16/k).toFixed(2) + "px"); H.classList.add("r20sf"); } }
var sg20 = $("settings"); if(sg20) new MutationObserver(function(){ if(!sg20.classList.contains("hidden")){ setTimeout(setFs, 350); setTimeout(setFs, 800); } }).observe(sg20, { attributes:true, attributeFilter:["class"] });
P.r20 = function(){ var bar = $("bbar"), wk = bar && bar.querySelector('[data-k="wreck"]');
  return { on:true, kdSnap:R20.kdThru, near:R20.near, nearSame:R20.nearSame, nearOther:R20.nearOther, pass:R20.pass, gap:R20.gap, park:R20.park, nw:R20.nw, ux51:R20.ux51, ux54:R20.ux54,
    ball:{ aim:typeof ballAim !== "undefined" && !!ballAim, left:typeof ballLeft !== "undefined" ? ballLeft : null, live:typeof ballLive !== "undefined" && !!ballLive, chipOn:!!(wk && wk.classList.contains("on")), chipArm:!!(wk && wk.classList.contains("r20arm")) },
    pause:document.body.classList.contains("r20pause"), log:R20.log.slice() }; };
P.r20ux51 = ux51;
})();

window.__blast.polish = {
  prot:function(){ return P.prot(); }, r18:function(){ return P.r18(); }, r19:function(){ return P.r19 ? P.r19() : { on:false }; }, r19skew:function(v){ return P.r19skew ? P.r19skew(v) : null; }, r19disarm:function(w){ return P.r19disarm ? P.r19disarm(w) : null; }, r19copy:function(){ return P.r19copy ? P.r19copy() : null; }, r20:function(){ return P.r20 ? P.r20() : { on:false }; }, r20probe:function(st){ return P.r20probe ? P.r20probe(st) : null; }, r20ux51:function(){ return P.r20ux51 ? P.r20ux51() : null; }, kdDrift:function(){ return P.kdDrift(); }, kdHosts:function(){ return P.kdHosts(); }, pads:function(){ return P.pads(); }, kWord:function(s, tip){ return kWord(s, tip); },
  mapTitle:mapTitle, goal:function(){ var mp = $("mPass"); if(!mp) return null; var cs = getComputedStyle(mp, "::after"); return { text:mp.getAttribute("data-pol"), fs:parseFloat(cs.fontSize), display:cs.display, content:cs.content }; },
  on:true, tf6:TF6, log:function(){ return P.log.slice(); },
  pill:function(){ return { lock:P.pill.lock, pend:P.pill.pend, shown:P.pill.shown, text:ct ? ct.textContent : null, bank:save.coins, forced:P.pill.forced }; },
  cardT0:function(){ return P.cardT0 ? P.cardT0() : 0; },
  home:function(){ return { runs:HC.runs, last:HC.last, lock:HC.lock }; }, anyTap:function(){ return P.anyTap || 0; },
  win:function(){ var c = P.win.cam; return { n:P.win.n, stamp:P.win.stamp, plus:P.win.plus, camN:P.win.camN, cam:c ? { off:Math.round(c.off), k:+c.k.toFixed(2), sy0:Math.round(c.sy0) } : null, home:P.win.home, plusAt:P.win.plusAt || null, camBy:P.win.camBy || (P.win.camN ? "polish" : null), lookM:P.win.lookM || null, camDone:P.win.camDone == null ? null : P.win.camDone }; },
  demo:function(){ return { shown:P.demo.shown, on:P.demo.until > performance.now(), miss:P.demo.miss, frames:P.demo.frames || 0, pt:P.demo.pt || null }; },
  camNow:P.camNow, mapFit:mapFit, lockchips:LOCKCHIPS
};
})(); }catch(e){ console.error("main/polish.js", e); }
