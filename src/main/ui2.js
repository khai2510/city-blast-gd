// ---- main/ui2.js (build step "ui2", main/ui2-patch.js; Lead 14/11/2026, Owner "our cleanliness and simple UX/UI are still not as good as
// Smash Fest. Optimise further"). One block appended at the end of main(); it only restyles and wraps UI functions, never physics
// or level data. ?ui2=0 = the old UI (nothing here runs). What and why: games/blast/UI2-STATUS.md.
// D-blast-NONEW (Owner 14/11): nothing new is added to the game here; every change removes, merges, resizes or restyles an
// existing element (proposals for new things are in UI2-STATUS.md).
//  H1 HUD in play <= 5 items: pause · meter (the existing level pill merged onto its left end as a tier-coloured cap, PASS = the
//     existing marker restyled as a notch, no 13 px tag, no HARD / BOSS word: the colour says it) · booster tray · TNT badge · BLAST.
//     Gone: the dev "Level" button
//     (only with ?dev=1), the undo button (D-blast-TAP2 makes placed TNT permanent; the tap-select ✕ still removes one), the Q8
//     shield / street icons, the protected buildings' "0%" tags (a tag shows, >= 16 px, only once that building is hit), the
//     coin pill (it shows on the win, as before). The level tip fades after the first TNT or 6 s.
//  H2 Locked tray slots ("Lv.N", D-blast-INTRO-BTF) stay but are quiet: flat, translucent, no drop shadow.
//  T  One type system: Lilita One (ULClean) titles, Nunito body; the old --fd / --f-display (Luckiest Guy) point at ULClean.
//     No text under 16 px in the screens this pass touches (pre-level tile labels, protected tags, the win "+N" is 32 px).
//  C  Colour slips: no green "CLEARED" fill on the meter tag / notch (gold), boss = orange / Hard = purple on the meter cap,
//     the pre-level card and the BLAST row; prices never red.
//  W  The win gets the VFX budget (Smash Fest spends it on the win, not the hit): the existing feel Q7 confetti is strengthened:
//     the same pieces (#feelLay .cf, the same three colours) also rain over the whole width for 1.8 s, bigger, when the meter
//     passes (with the CLEARED! stamp) or at the latest on the win result; the existing "+N" is 32 px. Reduce motion: none (as Q7).
//  S  Upgrades gets its own backdrop (the title no longer floats over the building). The Shop tab stays "coming soon".
//  P  Pre-level popup: the Home Play under it is hidden (one primary button per screen), Play 72 px tall, tile labels 16 px.
//  E  Settings: "Restart from Level 1" is a quiet text link (no red row among the toggles).
//  G  Tab bar (Shop · Home · Upgrades): glossy 3D raster icons (Figma-generated set), the active tab raised on a gold plate, labels >= 16 px outlined.
//     G2 Home from separate elements: clean background (E1), hero building layer (E2); F: Play at the road line.
//  L  Lose card: the small "PASS 85%" tag -> the same notch as in play; the tip box loses its pale-blue third surface.
// Leaves room for D-blast-TAP2 (L1 without BLAST): the tray and the TNT badge sit on their own row above BLAST and do not
// depend on it. Test hook: window.__blast.ui2 = { on, hud(), fx() }.
try{ (function(){
if(QS.get("ui2") === "0") return;
var H = document.documentElement, BODY = document.body;
H.classList.add("ui2");
if(QS.get("dev") === "0") H.classList.add("dev0");            // the LV picker button: on by default again (Owner 21/11 "cho t phần chọn được level"; hidden since 14/11 = ?dev=1 only); ?dev=0 hides it
var U = "var(--us)";
var css = [
  // ---- H1 top row: pause | [cap + meter]
  "html.ui2 body #top #meter{left:calc(var(--ux) + 318 * " + U + ");top:calc(var(--ut) + 43 * " + U + ");width:calc(400 * " + U + ");height:calc(50 * " + U + ");border-radius:calc(25 * " + U + ")}",
  "html.ui2 body #mFill{border-radius:calc(19 * " + U + ")}",
  // the level pill = the meter's cap: same row as pause, overlapping the meter's left end, no HARD / BOSS word (colour only)
  "html.ui2 body #top #lvPill{left:calc(var(--ux) + 132 * " + U + ")!important;top:calc(var(--ut) + 32 * " + U + ")!important;transform:none!important;translate:none!important;z-index:2;" +
    "height:calc(72 * " + U + ")!important;min-width:0!important;padding:0 calc(22 * " + U + ")!important;font-size:max(20px, calc(40 * " + U + "))!important;--lk:1!important}",
  "html.ui2 body #lvPill .boss{display:none!important}",
  // PASS = a notch through the bar (no tag text); gold when reached (never green)
  "html.ui2 body #mPass{top:calc(-9 * " + U + ")!important;bottom:auto!important;width:calc(9 * " + U + ")!important;height:calc(68 * " + U + ")!important;margin:0 0 0 calc(-4.5 * " + U + ")!important;" +
    "border-radius:calc(5 * " + U + ")!important;background:var(--ul-ink)!important;box-shadow:0 0 0 calc(3 * " + U + ") #FFF8E1!important;z-index:1}",
  "html.ui2 body #mPass.near{background:#FFB400!important}",
  "html.ui2 body #mPass.on{background:#FFC93A!important;box-shadow:0 0 0 calc(3 * " + U + ") #FFF8E1,0 0 calc(18 * " + U + ") #FFD84A!important}",
  "html.ui2 body #mTag{position:absolute!important;width:1px!important;height:1px!important;min-width:0!important;padding:0!important;overflow:hidden!important;clip-path:inset(50%)!important;border:0!important}",
  "html.ui2 body #mTag::after{display:none!important}",
  "html.ui2 body #mPct{z-index:1}",
  // gone from the HUD
  "html.ui2 body #feelRules{display:none!important}",
  "html.ui2 body #undo{display:none!important}",
  "html.ui2 .shield:not(.hit){display:none!important}",
  "html.ui2 .shield b{font:900 16px var(--fn)!important;padding:2px 8px!important;background:#FD702A!important;color:#fff!important;border-radius:10px!important}",
  "html.ui2 body #tip{transition:opacity .45s ease}",
  "html.ui2 body.u2TipOff #tip{opacity:0!important;pointer-events:none}",
  // ---- H2 quiet locked tray slots (still >= 48 px, label 16 px)
  "html.ui2 body #bbar .bst.inLock{background:rgba(255,255,255,.5)!important;border-color:rgba(43,33,64,.28)!important;box-shadow:none!important}",
  "html.ui2 body #bbar .bst.inLock .inLv{color:rgba(43,33,64,.62)!important;-webkit-text-stroke:0!important}",
  "html.ui2 body #bbar .bst.inLock svg{opacity:.6}",
  // ---- T one type system
  "html.ui2{--fd:\"ULClean\",\"Nunito\",system-ui,sans-serif;--f-display:\"ULClean\",\"Nunito\",system-ui,sans-serif}",
  "html.ui2 body{--fd:\"ULClean\",\"Nunito\",system-ui,sans-serif;--f-display:\"ULClean\",\"Nunito\",system-ui,sans-serif}",
  "html.ui2 body #toast{font-family:\"Nunito\",system-ui,sans-serif;font-weight:900;font-size:16px}",
  // ---- C colour slips
  "html.ui2 body #mFill.go{background:linear-gradient(#FFE27A,#FFB400)!important}",
  "html.ui2 body .price,html.ui2 body #bbBuy small{color:inherit}",
  // ---- P pre-level popup: no second Play under it, a taller Play, tile labels 16 px
  "html.ui2 body.u2Pick #title .foot,html.ui2 body.u2Pick #title .foot *,html.ui2 body.u2Pick #ulTabs{opacity:0!important;pointer-events:none!important}",
  "html.ui2 body #bpPlay{min-height:72px;font-size:30px}",
  "html.ui2 body .bpt .bpn{font-size:16px!important}",
  // ---- W win: "+N" 32 px by the pill; the strengthened Q7 confetti pieces
  "html.ui2 body #uicPlus{font-size:32px!important}",
  "html.ui2 body #top #coinPill{top:calc(var(--ut) + 122 * " + U + ")!important}",   // the meter row is taken: the coin pill (blast / win only) hangs under it
  "html.ui2 #feelLay .cf.u2{width:12px;height:18px}",
  // ---- S Upgrades backdrop
  "html.ui2 body #shop{background:linear-gradient(180deg,#5AA8F8 0%,#2E74E6 55%,#1C4DB6 100%)!important}",
  // ---- L lose card: the PASS tag (small text) becomes the same notch as in play; the tip loses its third surface colour
  "html.ui2 body #result #rmPass::before,html.ui2 body #result #rmPass::after{display:none!important}",
  "html.ui2 body #result #rmPass{top:-6px!important;bottom:-6px!important;width:5px!important;margin-left:-2.5px!important;border:0!important;border-radius:3px!important;background:var(--ul-ink)!important;box-shadow:0 0 0 2px #FFF8E1!important}",
  "html.ui2 body #result #rTip{background:none!important;border:0!important;padding:4px 6px!important}",
  // ---- E settings: restart = a quiet text link
  "html.ui2 body #setReset{background:none!important;border:0!important;box-shadow:none!important;color:var(--ul-ink)!important;opacity:.75;font-size:16px!important;min-height:44px;text-decoration:underline;text-underline-offset:3px}",
  "html.ui2 body #setReset svg{display:none}",
  // ---- F Home: Play button raised to the road line (Owner 14/11: "hơi thụt xuống dưới", then "up to the road") — the whole .foot moves
  "html.ui2 body #ulHome .foot{transform:translateY(-140px)}",   // Owner 14/11: Play top at the road line (~577 px at 390x844; was -28 px on #play)
  // ---- G tab bar (Owner 14/11: "our Home / Shop / Upgrades tab buttons don't have icons like Smash Fest's"): the same 3 tabs, restyled.
  // Glossy 3D SVG icons (cart / house / up-arrow), the active tab raised on a gold plate (STYLE-GUIDE: gold = selected tab),
  // inactive tabs smaller and calmer, Lilita labels >= 16 px with an ink outline, a bevelled blue bar; safe-area inset kept.
  "html.ui2 body #ulTabs{overflow:visible;border-top:3px solid var(--ul-ink);background:linear-gradient(180deg,#4A84EC 0,#2F64D6 18%,#1D449E 62%,#152867 100%);" +
    "box-shadow:inset 0 3px 0 rgba(255,255,255,.38),inset 0 -2px 0 rgba(0,0,0,.25),0 -6px 14px rgba(14,36,102,.35)}",
  "html.ui2 body #ulTabs .ulTab{justify-content:center;gap:2px;padding:4px 0 6px;font:400 16px/1 \"ULClean\",\"Nunito\",system-ui,sans-serif;color:#FFF8E1;" +
    "-webkit-text-stroke:4px var(--ul-ink);paint-order:stroke fill;text-shadow:0 2px 0 var(--ul-ink);transition:transform .12s ease}",
  "html.ui2 body #ulTabs .ulTab:active{transform:scale(.92)}",
  "html.ui2 body #ulTabs .ulTab + .ulTab::before{background:rgba(9,24,72,.45);box-shadow:2px 0 0 rgba(255,255,255,.12)}",
  "html.ui2 body #ulTabs .ulTab.u2t .ic{display:none}",
  "html.ui2 body #ulTabs .u2ic{display:block;width:50px;height:50px;flex:none;position:relative;z-index:1;background:center/contain no-repeat;filter:drop-shadow(0 3px 2px rgba(9,24,72,.5)) saturate(.7) brightness(.94)}",
  "html.ui2 body #toStore .u2ic{background-image:url(UI2:shop)}","html.ui2 body #toHome .u2ic{background-image:url(UI2:home)}","html.ui2 body #toShop .u2ic{background-image:url(UI2:upgr)}",
    "html.ui2 body #ulTabs .ulTab > span:not(.u2ic){position:relative;z-index:1}",
  "html.ui2 body #ulTabs .ulTab:not(.on){opacity:.94}",
  // the active tab: a raised gold plate, bigger icon popping over its top edge, bigger label
  "html.ui2 body #ulTabs .ulTab.on,html.ui2 body.ulMapOn #ulTabs .ulTab.on{align-self:end;height:calc(100% - 2px);margin:0 8px 6px;max-height:none;padding:0 0 9px;justify-content:flex-end;border:3px solid var(--ul-ink);border-radius:22px;" +
    "background:linear-gradient(180deg,#FFF3A6 0%,#FFE04A 26%,#FFC633 62%,#F2A812 100%);font-size:20px;opacity:1;" +
    "box-shadow:inset 0 -6px 0 #E59A00,inset 0 3px 0 rgba(255,255,255,.7),0 5px 0 var(--ul-ink),0 9px 14px rgba(0,0,0,.32)}",
  "html.ui2 body #ulTabs .ulTab.on::before{display:block;content:\"\";position:absolute;left:10px;right:10px;top:4px;height:34%;width:auto;bottom:auto;border-radius:16px;" +
    "background:linear-gradient(rgba(255,255,255,.6),rgba(255,255,255,0));box-shadow:none;pointer-events:none}",
  "html.ui2 body #ulTabs .ulTab.on + .ulTab::before{display:none}",
  "html.ui2 body #ulTabs .ulTab.on .u2ic{position:absolute;left:50%;top:-30px;width:78px;height:78px;margin:0;transform:translateX(-50%);filter:drop-shadow(0 5px 3px rgba(9,24,72,.55))}",
  // the settings gear: the same glossy 3D treatment (the flat line glyph is hidden, the button disc stays)
  "html.ui2 body #ulTop #gearBtn{background:url(UI2:gear) 50% 50%/72% 72% no-repeat,radial-gradient(circle at 50% 38%,#FFFFFF,#FCF4D5 66%)}",
  "html.ui2 body #ulTop #gearBtn .i{visibility:hidden}",
  "html.ui2 body #ulTabs #toMap.on .ic{margin-top:-14px}",
  "html.ui2 body #ulTabs #upDot{top:2px;left:calc(50% + 10px);width:20px;height:20px;border-width:3px;box-shadow:0 0 0 2px var(--ul-ink)}",
  // G2 Home rebuilt from separate elements (Owner 14/11, design/home-elements/BRIEF.md, Figma "Home elements (14/11)"):
  // E1 a clean background with no UI baked in (the old plate had a "Level 8" button and a tab bar painted in), E2 the hero
  // building + crane as its own layer (blank sign board: the live #ulSign hangs on it), the taxi drives the new road.
  "html.ui2{--ul-hp:url(UI2:e1)}",
  // Home fix (Owner 15/11: "the building stands outside the sand plot", "the logo covers the crane and the LEVEL sign"; Figma
  // "Home elements (14/11)" > Preview · Home): every position below is in E1's own plate px (864 x 1536), so the hero scales and
  // crops together with the background at any aspect ratio. E2 at scale 0.48: its slab's four corners and the crane base fall on
  // the E1 sand plot (sand mask eroded 10 px; was 0.56, slab in front of the fence); the jib top is then at plate y ~ 388.
  "html.ui2 body #ulPlate #u2Hero{left:358px;top:348px;width:391px;height:588px;background:url(UI2:e2) 0 0/100% 100% no-repeat;pointer-events:none}",
  // its grounding shadow (behind the slab, on the sand)
  "html.ui2 body #ulPlate #u2Hero::before{content:\"\";position:absolute;left:1%;width:78%;top:83%;height:19%;z-index:-1;border-radius:50%;background:radial-gradient(closest-side,rgba(62,40,10,.42),rgba(62,40,10,.18) 60%,rgba(62,40,10,0))}",
  // the logo above the jib (was 213,143 444x283: over the jib and the sign); top 140 keeps it under the top row on every phone
  "html.ui2 body #title .ulLogo{left:246px;top:140px;width:373px;height:238px}",
  // the live LEVEL sign hangs on E2's two ropes (centred on the blank board, level), grows with the text (LEVEL 1 .. LEVEL 999)
  "html.ui2 body #ulPlate #ulSign{left:437px;top:452px;width:auto;min-width:190px;padding:0 18px;box-sizing:border-box;translate:-50% 0;transform:none}",
  "html.ui2 body.fq9 #ulSign{transform-origin:50% -24px;animation-name:u2Sign}",
  "@keyframes u2Sign{0%,100%{transform:rotate(-2deg)}50%{transform:rotate(2deg)}}",
  "html.ui2 body .fq9t{animation-name:u2Taxi}",
  "html.ui2 body.ulMenu #toast{bottom:calc(var(--sa-b) + var(--ul-tabh) + 18px)}",   // "coming soon" toasts sit between the raised Play and the tab bar
  "@keyframes u2Taxi{0%{transform:translate(-195px,704px) rotate(36deg)}40%{transform:translate(805px,1634px) rotate(36deg)}100%{transform:translate(805px,1634px) rotate(36deg)}}",
  // reduce motion: no extra confetti (as Q7)
].join("\n");
var st = document.createElement("style"); st.id = "ui2Css"; st.textContent = css; document.head.appendChild(st);

// ---- G tab bar: the flat tab icons -> glossy 3D raster icons (Owner 14/11 v49 feedback "not 3D enough"; Figma "Home elements (14/11)",
// one generated set, cut out: design/home-elements/e6v2-*.png). The old .ic stays in the DOM, hidden; ?ui2=0 never gets here.
["toStore", "toHome", "toShop"].forEach(function(id){
  var b = document.getElementById(id); if(!b || b.querySelector(".u2ic")) return;
  var w = document.createElement("span"); w.className = "u2ic"; w.setAttribute("aria-hidden", "true");
  var ic = b.querySelector(".ic"); b.insertBefore(w, ic ? ic.nextSibling : b.firstChild); b.classList.add("u2t");
});
// G2 the hero building + crane layer (decor, no input): behind the logo, bubbles, sign, taxi and Play; in front of the drifting clouds
(function(){ var pl = document.getElementById("ulPlate"); if(!pl || document.getElementById("u2Hero")) return;
  var h = document.createElement("i"); h.id = "u2Hero"; h.setAttribute("aria-hidden", "true");
  var at = pl.firstChild; while(at && at.classList && at.classList.contains("fq9c")) at = at.nextSibling; pl.insertBefore(h, at || null); })();

// ---- H1 the level tip fades after the first TNT or 6 s (it comes back on every level start / retry)
var tipT = 0;
function tipOn(){ BODY.classList.remove("u2TipOff"); clearTimeout(tipT); tipT = setTimeout(function(){ BODY.classList.add("u2TipOff"); }, 6000); }
var syncTop2 = syncTop; syncTop = function(){ var r = syncTop2.apply(this, arguments); try{ tipOn(); fxLevel(); }catch(e){} return r; };
var place2 = placeCharge; placeCharge = function(){ var r = place2.apply(this, arguments); if(screen === "game") BODY.classList.add("u2TipOff"); return r; };

// ---- P the pre-level popup hides the Home Play / tabs under it
var pick = document.getElementById("bPick");
if(pick) new MutationObserver(function(){ BODY.classList.toggle("u2Pick", !pick.classList.contains("hidden")); }).observe(pick, { attributes:true, attributeFilter:["class"] });

// ---- W the existing Q7 confetti, strengthened: the same .cf pieces in the same #feelLay layer and colours, a full-width rain
var FX = { fired:false, n:0, pieces:0 };
var Q7C = ["#FFB400", "#FF6A1A", "#FFF4DC"];
function fxLevel(){ FX.fired = false; }
function fxWin(){
  if(FX.fired) return; FX.fired = true; FX.n++;
  var lay = document.getElementById("feelLay"); if(!lay || !lay.animate || REDUCED || H.classList.contains("rm")) return;
  var W = innerWidth, Hh = innerHeight;
  for(var i=0;i<96;i++){
    var e = document.createElement("i"); e.className = "cf u2"; e.style.background = Q7C[i % 3]; if(i % 3 === 2) e.style.boxShadow = "inset 0 0 0 1px rgba(17,32,92,.25)"; lay.appendChild(e);
    var x = Math.random()*W, y = -30 - Math.random()*Hh*0.25, dx = (Math.random() - 0.5)*120, fall = Hh*(0.55 + Math.random()*0.5), rot = (Math.random() - 0.5)*1080, d = 1500 + Math.random()*600, dl = Math.random()*350;
    (function(e){ var an = e.animate([
      { transform:"translate(" + x + "px," + y + "px) rotate(0deg)", opacity:1 },
      { transform:"translate(" + (x + dx*0.5) + "px," + (y + fall*0.5) + "px) rotate(" + rot*0.5 + "deg)", opacity:1, offset:0.5 },
      { transform:"translate(" + (x + dx) + "px," + (y + fall) + "px) rotate(" + rot + "deg)", opacity:0 }
    ], { duration:d, delay:dl, easing:"cubic-bezier(.3,.5,.6,1)", fill:"both" }); an.onfinish = an.oncancel = function(){ if(e.parentNode) e.parentNode.removeChild(e); }; })(e);
  }
  FX.pieces += 96;
}
// the moment: the meter passes (feel Q7 bumps the coin pill with the stamp) ... or at the latest the win result
var bump2 = bumpPill; bumpPill = function(){ var r = bump2.apply(this, arguments); try{ if(screen === "game" && (phase === "boom" || phase === "settle") && meterOn === true) fxWin(); }catch(e){} return r; };
var sr2 = showResult; showResult = function(){ var r = sr2.apply(this, arguments); try{ if(lastResult && lastResult.ok && !manual) fxWin(); }catch(e){} return r; };

// ---- test hook: the HUD census (visible items in play, grouped) and the fx state
function vis(el){ if(!el) return false; var r = el.getBoundingClientRect(), s = getComputedStyle(el); if(!(r.width > 1 && r.height > 1 && s.visibility !== "hidden" && s.display !== "none")) return false;
  for(var x = el; x && x.nodeType === 1; x = x.parentElement) if(+getComputedStyle(x).opacity < 0.05) return false; return r.bottom > 0 && r.top < innerHeight; }
window.__blast.ui2 = {
  on:true,
  hud:function(){
    var g = { pause:"#pauseBtn", level:"#lvPill", meter:"#meter", coins:"#coinPill", tip:"#tip", tray:"#bbar", tnt:"#chips .chip", blast:"#blast", undo:"#undo", dev:"#lvBtn", rules:"#feelRules" }, o = {};
    Object.keys(g).forEach(function(k){ var e = document.querySelector(g[k]); if(k === "tray") o[k] = !!e && [].some.call(e.children, vis); else o[k] = vis(e); });
    o.shields = [].filter.call(document.querySelectorAll(".shield"), vis).length;
    o.items = Object.keys(o).filter(function(k){ return o[k] === true && !(k === "level" && o.meter); }).length + o.shields;   // the level pill is the meter's cap: one item
    return o;
  },
  fx:function(){ return { fired:FX.fired, n:FX.n, pieces:FX.pieces, live:document.querySelectorAll("#feelLay .cf.u2").length }; }
};
})(); }catch(e){ console.error("main/ui2.js", e); }

// ---- H safe areas (Owner 14/11: "the in-game layout is not optimised for iPhone": notch / Dynamic Island + home indicator).
// Own block after the ui2 block (sections F / G are another agent's). What and why: games/blast/SAFEAREA-STATUS.md.
//  H0 test-only inset emulation: ?sa=T,R,B,L (pt) sets --sa-t/-r/-b/-l on <html> in place of env(safe-area-inset-*) (Playwright has no
//     real insets). Runs even with ?ui2=0 / ?safe=0 so the old layout can be shot under the same insets. No ?sa = nothing changes.
//  SA1-SA3 below run with ui2 on, unless ?safe=0 (= the layout before this section, for before / after shots). Audit (14/11, 4 iPhones):
//     the top row already sits under the inset (uiclean --ut, pause >= inset + 2) and nothing is under the island / notch; the bottom
//     controls were 4-6 pt from the home-indicator zone. Figma: page "Safe areas (14/11)" in ZrGEsdJfokXjKgZrZroJ6y.
//  SA1 play: the bottom stack (tray, TNT badge, BLAST) rises so BLAST clears the home-indicator zone by >= 8 pt (only when there is one:
//      min(6px, inset) = 0 on iPhone SE / Android without an inset).
//  SA2 Home / Map tab bar: the bar still bleeds to the bottom edge; its tabs (and the gold plate) sit >= 8 pt above the indicator zone.
//  SA3 the 3D camera framing needs nothing new: topH() / botH() read #top / #bottom, which move with SA1 / SA4 (dirty flags set here).
//  SA4 (rev 2, Owner 14/11: "full screen, lay the HUD AROUND the island, like Smash Fest"): the scene / plate / dims already bleed to every
//      edge; now only the cutout itself is kept free. Cutout model (env() cannot tell it): inset top >= 54 -> Dynamic Island 126x37 at
//      top 11; 40-53 -> notch 210x32 at top 0; less -> none (SE, status bar hidden: unchanged layout). ?sa=T,R,B,L,CW,CH,CY sets it
//      (CW 0 = none). The "ears" left / right of it take small items, centred on the cutout line + 4 pt, 24 pt from the side:
//      play: Pause in the left ear, the win coin pill in the right ear when the ear is wide enough (island phones; its "+N" then shows
//      right-aligned under the meter row's right end, never under the island), the level cap +
//      meter row right under the cutout (bottom + 6) starting right of Pause, the tip / #top height follow it.
//      Home (rev 3, 15/11): avatar, coin pill (beside it) and Settings on one row just under the cutout (shifted with an
//      inline translate measured against the plate scale, so the plate's own --ul-e shift is kept). Figma: page "Safe areas (14/11)" rev 2.
try{ (function(){
var H = document.documentElement, sa = QS.get("sa");
if(sa && /^[\d.,]+$/.test(sa)){
  var v = sa.split(",").map(Number), k = ["t", "r", "b", "l"];
  k.forEach(function(n, i){ H.style.setProperty("--sa-" + n, (v[i] || 0) + "px"); });
  H.style.setProperty("--sa-env-t", (v[0] || 0) + "px"); H.style.setProperty("--sa-env-b", (v[2] || 0) + "px");
  H.classList.add("saEmu");
  setTimeout(function(){ try{ window.dispatchEvent(new Event("resize")); }catch(e){} }, 0);
}
if(QS.get("ui2") === "0" || QS.get("safe") === "0") return;
H.classList.add("safe2");
var lift = "min(6px, var(--sa-b))";
var st = document.createElement("style"); st.id = "safe2Css"; st.textContent = [
  // SA1 (was: --ub:max(0px, calc(var(--sa-b) + 4px - 58 * var(--us))))
  "html.safe2{--ub:max(0px, calc(var(--sa-b) + " + lift + " + 4px - 58 * var(--us)))}",
  // SA2 (was: height tabh + inset, padding-bottom inset)
  "html.safe2 body #ulTabs{height:calc(var(--ul-tabh) + var(--sa-b) + min(8px, var(--sa-b)));padding-bottom:calc(var(--sa-b) + min(8px, var(--sa-b)))}"
].join("\n");
document.head.appendChild(st);
try{ if(window.ulFit) window.ulFit(); }catch(e){}

// ---- SA4 the HUD around the cutout
var U2 = "var(--us)", M = 24, CUT = null, LAST = "";
st.textContent += "\n" + [
  "html.ui2.saCut body #top{height:calc(var(--saRT) + 164 * " + U2 + ")!important}",
  "html.ui2.saCut body #top #pauseBtn{left:var(--saPL)!important;top:var(--saPT)!important}",
  "html.ui2.saCut body #top #lvPill{left:var(--saCL)!important;top:var(--saRT)!important}",
  "html.ui2.saCut body #top #meter{left:calc(var(--saCL) + 186 * " + U2 + ")!important;top:calc(var(--saRT) + 11 * " + U2 + ")!important}",
  "html.ui2.saCut body #tip{top:calc(var(--saRT) + 180 * " + U2 + ")!important}",
  "html.ui2.saCut.saEar body #top #coinPill{left:auto!important;right:var(--saCR)!important;top:var(--saCT)!important}",
  // the win "+N" (uiclean anchors it left of the pill, which would put it under the island): right-aligned under the pill instead
  "html.ui2.saCut.saEar body #uicPlus{translate:calc(var(--saCPW) + 10px) var(--saPY)}"
].join("\n");
var probe = document.createElement("div"); probe.style.cssText = "position:fixed;left:0;top:0;width:0;visibility:hidden;pointer-events:none;padding-top:var(--sa-t)"; document.body.appendChild(probe);
function cutout(t){
  var v = sa && /^[\d.,]+$/.test(sa) ? sa.split(",").map(Number) : [];
  if(v.length > 4) return v[4] > 0 ? { w:v[4], h:v[5] || 37, y:v[6] || 0 } : null;
  return t >= 54 ? { w:126, h:37, y:11 } : t >= 40 ? { w:210, h:32, y:0 } : null;
}
function earTop(h){ return Math.max(6, CUT.y + CUT.h/2 - h/2 + 4); }
function px(n){ return n.toFixed(1) + "px"; }
function home(){
  var lay = window.__ul && window.__ul.lay && window.__ul.lay(), W = innerWidth;
  var els = { av:document.querySelector("#ulTop .ulAv"), coin:document.getElementById("hCoins"), gear:document.getElementById("gearBtn") };
  Object.keys(els).forEach(function(k){ if(els[k]) els[k].style.translate = ""; });
  if(!CUT || !lay || !lay.s) return;
  var t = document.getElementById("title"); if(!t || t.classList.contains("hidden")) return;
  // Home fix (Owner 15/11: "Settings and the avatar sit too high in the ears; move the coin pill off the centre"): one row just under
  // the cutout (+4 pt), the coin pill beside the avatar (the player group: avatar + wallet; the gear stays alone on the right, as on
  // iPhone SE where the pill already sat next to the avatar). The pill (~140 pt) cannot share an ear with the avatar (ear 90-138 pt).
  var R = {}; Object.keys(els).forEach(function(k){ R[k] = els[k] ? els[k].getBoundingClientRect() : null; });
  var ch = R.coin && R.coin.height ? R.coin.height : 44, rowC = CUT.y + CUT.h + 4 + Math.max(ch, 44)/2;
  Object.keys(els).forEach(function(k){
    var e = els[k]; if(!e) return; var r = R[k]; if(!r || !r.width) return;
    var tx = k === "av" ? M : k === "gear" ? W - M - r.width : M + (R.av && R.av.width ? R.av.width : 52) + 8, ty = rowC - r.height/2;
    if(k === "coin"){ var pl = document.getElementById("hPlus"), pr = pl && pl.getBoundingClientRect(); if(pr && pr.width) ty += Math.max(0, r.top - pr.top); }   // its "+" (hidden today) hangs above the pill
    var cur = (getComputedStyle(e).translate || "none").split(" ").map(parseFloat), cx = isNaN(cur[0]) ? 0 : cur[0], cy = isNaN(cur[1]) ? 0 : cur[1];
    e.style.translate = (cx + (tx - r.left)/lay.s).toFixed(2) + "px " + (cy + (ty - r.top)/lay.s).toFixed(2) + "px";
  });
  // a measure taken while the plate scale is still settling (first second after boot) can land off: check and redo (bounded)
  var a2 = els.av && els.av.getBoundingClientRect();
  if(a2 && a2.width && (Math.abs(a2.left - M) > 1.5 || Math.abs(a2.top + a2.height/2 - rowC) > 1.5)){ if((HOMEN = (HOMEN || 0) + 1) < 6) setTimeout(home, 150); } else HOMEN = 0;
}
var HOMEN = 0;
function fit(){
  var t = parseFloat(getComputedStyle(probe).paddingTop) || 0, W = innerWidth;
  CUT = cutout(t); H.classList.toggle("saCut", !!CUT);
  if(CUT){
    var rowT = CUT.y + CUT.h + 6, ear = (W - CUT.w)/2, cp = document.getElementById("coinPill"), cr = cp ? cp.getBoundingClientRect() : null;
    H.style.setProperty("--saPL", px(M)); H.style.setProperty("--saPT", px(earTop(48)));
    H.style.setProperty("--saRT", px(rowT)); H.style.setProperty("--saCL", px(M + 48 + 6));
    var pw = cr && cr.width ? cr.width : 85, ph = cr && cr.height ? cr.height : 34, onEar = ear >= pw + M + 6;
    H.classList.toggle("saEar", onEar); H.style.setProperty("--saCR", px(M)); H.style.setProperty("--saCT", px(earTop(ph))); H.style.setProperty("--saCPW", px(pw)); H.style.setProperty("--saCPH", px(ph));
    var U = Math.min(W/864, 0.52, innerHeight/1536);              // = --us
    H.style.setProperty("--saPY", px(rowT + 61*U + 4 + 18 - (earTop(ph) + ph/2)));   // "+N" top just under the meter row, right side
  } else H.classList.remove("saEar");
  home();
  try{ topDirty = true; botDirty = true; coinTgtOk = false; }catch(e){}
  try{ if(window.ulCollat) window.ulCollat(); }catch(e){}
  LAST = CUT ? CUT.w + "x" + CUT.h + "@" + CUT.y : "none";
}
fit(); setTimeout(fit, 300);
window.addEventListener("resize", function(){ setTimeout(fit, 260); });
var ti = document.getElementById("title"); if(ti) new MutationObserver(function(){ setTimeout(home, 30); }).observe(ti, { attributes:true, attributeFilter:["class"] });
var plate = document.getElementById("ulPlate"); if(plate) new MutationObserver(function(){ setTimeout(home, 30); }).observe(plate, { attributes:true, attributeFilter:["style"] });
window.__blast.safe = { cut:function(){ return CUT; }, fit:fit };
})(); }catch(e){ console.error("main/ui2.js H", e); }
