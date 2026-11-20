// ---- main/prelevel.js (build step "prelevel", main/prelevel-patch.js; D-blast-ADOPT, Owner 14/11/2026 "ok adopt": the pre-level
// booster offer before a Hard / Boss level). Figma: ZrGEsdJfokXjKgZrZroJ6y page "Booster Intro (13/11)", component set
// "Pre-Level Offer" 85:237, frames 6a Hard / 6b Boss / 6c Teach / 6d before any unlock (design/booster-intro/SPEC.md §3).
// D-blast-NONEW: no new popup. This EXTENDS the existing boosters2 "Select Booster" card (#bPick, bstPlay / bstPickRender) and
// restyles it in the premium intro-card style (main/intro.js #introCss): cream bevel card, tier-coloured header, 3D art tiles.
//  O1 When: every level start from Home Play / map / result Next (all go through bstPlay) on a Hard (purple) or Boss (orange)
//     level, also before any booster is unlocked (the locked tiles say what is coming). Retry rhythm kept from boosters2: not on
//     the attempt right after the first fail of a level, again after 2 fails. Normal levels: no popup (bstWants as before).
//  O2 What: "Hard Level N" / "Boss Level N" (+ crown), "Pick Your Boosters", the 3 tray boosters (Wrecking Ball, Safety Net,
//     Sky Strike) as round 3D-art tiles: owned count badge, "+" when 0 (opens the existing buy sheet), locked = lock + "Lv.N"
//     (the intro schedule's unlock level), picked = gold ring. One Play (purple / orange), the existing ✕ (nothing spent).
//  O3 Cost: each picked booster spends 1 use when the level starts (Smash Fest). Then it is armed exactly as from the tray:
//     Wrecking Ball = the boosters2 pick path (1 use = its 2 throws, aim view opens); Safety Net = netArmed (fences on BLAST);
//     Sky Strike = skyBtn() (waits for a building tap; not auto-armed when the ball's aim view takes the tap: its chip keeps the
//     paid use). The use paid at the start is a credit for this attempt: the booster's own bstUse() later takes the credit
//     instead of a second use. A new attempt clears it (an unused pick is spent, as in Smash Fest).
//  O4 Teach: the first popup that holds a booster unlocked and owned (one booster per popup) points the existing intro hand at
//     its tile with a pulsing gold ring, 0 words. Gone on any tap in the card; once per booster (save.pre.t).
// ?pre=0 = the old boosters2 picker (nothing here runs). Test hook: window.__blast.pre. Status: games/blast/PRELEVEL-STATUS.md.
try{ (function(){
if(QS.get("pre") === "0") return;
var H = document.documentElement, PICK = $("bPick"); if(!PICK) return;
H.classList.add("pre2"); PICK.classList.add("pre");
var KEYS = BOOST_ORDER.filter(function(k){ return BOOST[k] && !BOOST[k].hidden; });
var ART = { wreck:"PRE:wreck", net:"PRE:net", sky:"PRE:sky" };
var HAND_SVG = '<svg viewBox="0 0 56 56" aria-hidden="true"><path d="M20 30V9a5 5 0 0 1 10 0v15l3-1a5 5 0 0 1 6 3l1 1a5 5 0 0 1 6 4v7c0 9-6 15-15 15h-3c-6 0-10-3-13-8l-6-10a4.5 4.5 0 0 1 7-5z" fill="#FFF8E1" stroke="#2B2140" stroke-width="3" stroke-linejoin="round"/><path d="M30 24v8M36 26v6M42 31v4" stroke="#2B2140" stroke-width="2.5" stroke-linecap="round"/></svg>';
var LOCK_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10" width="14" height="11" rx="2.5" fill="#6F675E"/><path d="M8 10V7.5a4 4 0 0 1 8 0V10" fill="none" stroke="#6F675E" stroke-width="2.6"/></svg>';
var CROWN_SVG = '<svg class="preCrown" viewBox="0 0 40 40" aria-hidden="true"><path d="M5 30L3 11l10 8 7-12 7 12 10-8-2 19z" fill="#FFC633" stroke="#2B2140" stroke-width="3" stroke-linejoin="round"/><path d="M6 30h28v5H6z" fill="#FF6A1A" stroke="#2B2140" stroke-width="3" stroke-linejoin="round"/><circle cx="20" cy="22" r="3" fill="#FFF8E1" stroke="#2B2140" stroke-width="2"/></svg>';
var CHECK_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#FFF8E1" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
var PRE = { paid:{}, last:null, teach:null, shown:0, log:[] };
// save.pre = { t: { k:1 taught } } (the base loader drops unknown fields: read it back here, as main/intro.js does)
(function(){ try{ var s = JSON.parse(localStorage.getItem(SAVE_KEY) || "null"); if(s && s.pre && typeof s.pre === "object") save.pre = s.pre; }catch(e){} })();
function preS(){ if(!save.pre || typeof save.pre !== "object") save.pre = {}; if(!save.pre.t) save.pre.t = {}; return save.pre; }
function kindOf(i){ var Lv = LEVELS[i] || {}; return Lv.boss ? "boss" : isHard(Lv) ? "hard" : null; }
function lvOf(k){ var n = null; try{ n = window.__blast.intro && window.__blast.intro.lockLv(k); }catch(e){} return n || ((BOOST[k].unlock|0) + 1); }
function rm(){ return H.classList.contains("rm") || (typeof REDUCED !== "undefined" && REDUCED); }

// ---- style (premium intro family: #introCss tokens --in-*; Lilita One = --ul-fr, Nunito 900 body; nothing under 16 px)
var css = document.createElement("style"); css.id = "preCss"; css.textContent = [
  "html.pre2 body #bPick.pre{align-items:center;padding:calc(var(--sa-t,0px) + 16px) 16px calc(var(--sa-b,0px) + 16px);box-sizing:border-box;background:radial-gradient(ellipse at 50% 45%,rgba(43,33,64,.35),rgba(27,20,48,.78));animation:preFade .2s ease-out both}",
  "html.pre2 body #bPick.pre .bcard{width:330px;max-width:calc(100vw - 32px);box-sizing:border-box;padding:0 22px 24px;border:4px solid #2B2140;border-radius:32px;" +
    "background:radial-gradient(ellipse at 50% 0,rgba(255,255,255,.9),rgba(255,255,255,0) 55%),linear-gradient(#FFFDF6,#FFF1D2 50%,#FFE3AE);" +
    "box-shadow:inset 0 6px 0 #fff,inset 0 -8px 0 rgba(233,184,122,.55),0 8px 0 #2B2140,0 18px 28px rgba(0,0,0,.35);animation:prePop .32s cubic-bezier(.2,1.4,.4,1) both}",
  // header band: tier colour, light title with ink outline (Figma Header, Lilita 32)
  "html.pre2 body #bPick.pre .bhead{display:flex;align-items:center;justify-content:center;gap:8px;margin:0 -22px 14px;min-height:68px;padding:10px 60px 12px 16px;box-sizing:border-box;border-radius:28px 28px 0 0;border-bottom:4px solid #2B2140;" +
    "background:linear-gradient(#9B4FE0,#7A2BC4 55%,#5A1C99);box-shadow:inset 0 4px 0 rgba(255,255,255,.35),inset 0 -5px 0 rgba(0,0,0,.18);" +
    "font:400 32px/1 var(--ul-fr,\"ULClean\"),\"Nunito\",system-ui,sans-serif;color:#FFF8E1;-webkit-text-stroke:7px #2A0B4D;paint-order:stroke fill;text-shadow:0 4px 0 #2A0B4D;white-space:nowrap}",
  "html.pre2 body #bPick.pre.boss .bhead{background:linear-gradient(#FF9A4A,#FF6A1A 55%,#D9500A);-webkit-text-stroke-color:#5A1A05;text-shadow:0 4px 0 #5A1A05}",
  "html.pre2 body #bPick.pre.boss .bhead{font-size:30px;gap:6px}",
  "html.pre2 body #bPick.pre .bhead .preCrown{width:40px;height:40px;flex:none;-webkit-text-stroke:0}",
  "html.pre2 body #bPick.pre #bpHard{display:none!important}",
  "html.pre2 body #bPick.pre .bsub{margin:0 0 14px;font:900 18px/24px Nunito,system-ui,sans-serif;color:#2B2140}",
  // tiles: 76 px round discs with the 3D art (design/intro-premium), gap 18
  "html.pre2 body #bPick.pre #bpTiles{gap:18px;flex-wrap:nowrap}",
  "html.pre2 body #bPick.pre .bpt.pre{width:76px;height:76px;min-width:76px;aspect-ratio:auto;padding:0;border-radius:50%;display:grid;place-items:center;filter:none;opacity:1;" +
    "background:radial-gradient(circle at 40% 32%,#FFFFFF,#FFE9BE 72%);border:3px solid #2B2140;box-shadow:0 5px 0 rgba(43,33,64,.45);transition:transform .12s}",
  "html.pre2 body #bPick.pre .bpt.pre:active{transform:translateY(3px);box-shadow:0 2px 0 rgba(43,33,64,.45)}",
  "html.pre2 body #bPick.pre .bpt.pre .preArt{width:62px;height:62px;display:block;pointer-events:none;filter:drop-shadow(0 2px 1px rgba(43,33,64,.35))}",
  "html.pre2 body #bPick.pre .bpt.pre.empty .preArt{opacity:.45}",
  "html.pre2 body #bPick.pre .bpt.pre .bn{right:-8px;top:-8px;min-width:30px;height:30px;border-radius:15px;font:400 18px/1 var(--ul-fr,\"ULClean\"),system-ui,sans-serif;color:#FFF8E1;background:#FF6A1A;border:3px solid #2B2140}",
  "html.pre2 body #bPick.pre .bpt.pre .bn.plus{background:#4DBA2F;font-size:22px}",
  // picked: the Spotlit tray-slot state (gold 4 px ring + glow), lifted; a small green check (Smash Fest's picked sign)
  "html.pre2 body #bPick.pre .bpt.pre.sel{background:radial-gradient(circle at 40% 32%,#FFFFFF,#FFE27A 75%);transform:translateY(-4px);box-shadow:0 0 0 4px #FFC633,0 0 18px 4px rgba(255,198,51,.75),0 7px 0 rgba(43,33,64,.45)}",
  "html.pre2 body #bPick.pre .bpt.pre .preOk{position:absolute;left:-6px;bottom:-6px;width:30px;height:30px;border-radius:50%;background:#4DBA2F;border:3px solid #2B2140;display:grid;place-items:center;box-sizing:border-box}",
  "html.pre2 body #bPick.pre .bpt.pre .preOk svg{width:18px;height:18px}",
  // locked: the Locked tray-slot state (grey disc, lock + Lv.N 16 px)
  "html.pre2 body #bPick.pre .bpt.pre.lock{background:#F4EFE7;border-color:#6F675E;box-shadow:0 4px 0 rgba(43,33,64,.25)}",
  "html.pre2 body #bPick.pre .bpt.pre .preLv{display:flex;flex-direction:column;align-items:center;gap:1px;font:400 16px/1 var(--ul-fr,\"ULClean\"),system-ui,sans-serif;color:#6F675E;pointer-events:none}",
  "html.pre2 body #bPick.pre .bpt.pre .preLv svg{width:22px;height:22px}",
  "html.pre2 body #bPick.pre .bpt .bpn{display:none}",
  // the ONE button: glossy Play, purple on Hard, orange on Boss (Figma Button Type=Hard / Type=Blast)
  "html.pre2 body #bPick.pre #bpPlay{position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;width:240px;max-width:100%;height:76px!important;min-height:76px;margin:22px auto 0;padding:0 24px 4px!important;border-radius:26px!important;" +
    "border:3px solid #2A0B4D!important;background:linear-gradient(#B57AF0,#8A3BD6 52%,#6A22B0)!important;color:#FFF8E1!important;font:400 38px/1 var(--ul-fr,\"ULClean\"),\"Nunito\",system-ui,sans-serif!important;" +
    "-webkit-text-stroke:7px #2A0B4D!important;paint-order:stroke fill;text-shadow:0 3px 0 #2A0B4D!important;" +
    "box-shadow:inset 0 -7px 0 #4E1585,inset 0 3px 0 rgba(255,255,255,.55),0 7px 0 #2A0B4D,0 12px 14px rgba(0,0,0,.28)!important}",
  "html.pre2 body #bPick.pre.boss #bpPlay{border-color:#5A1A05!important;-webkit-text-stroke-color:#5A1A05!important;text-shadow:0 3px 0 #5A1A05!important;background:linear-gradient(#FFB066,#FF7A24 52%,#E2560C)!important;box-shadow:inset 0 -7px 0 #B5420A,inset 0 3px 0 rgba(255,255,255,.55),0 7px 0 #5A1A05,0 12px 14px rgba(0,0,0,.28)!important}",
  "html.pre2 body #bPick.pre #bpPlay::before{content:'';position:absolute;left:14px;right:14px;top:6px;height:26px;border-radius:14px;background:linear-gradient(rgba(255,255,255,.6),rgba(255,255,255,.08));pointer-events:none}",
  "html.pre2 body #bPick.pre #bpPlay:active{transform:translateY(3px);box-shadow:inset 0 -7px 0 #4E1585,0 3px 0 #2A0B4D!important}",
  "html.pre2 body #bPick.pre.boss #bpPlay:active{box-shadow:inset 0 -7px 0 #B5420A,0 3px 0 #5A1A05!important}",
  // close ✕: inside the header's right end (Figma 85:237 Close), 48 px target
  "html.pre2 body #bPick.pre .bx{right:10px;top:10px;width:48px;height:48px;border-radius:50%;background:#FFF4DC;border:3px solid #2B2140;box-shadow:0 3px 0 rgba(43,33,64,.45);z-index:3}",
  "html.pre2 body #bPick.pre .bx .i{width:22px;height:22px}",
  // teach: the intro hand + a pulsing gold ring on the tile (0 words)
  "html.pre2 body #bPick.pre .bpt.pre.teach{box-shadow:0 0 0 4px #FFC633,0 0 20px 6px rgba(255,198,51,.8),0 5px 0 rgba(43,33,64,.45);animation:prePulse 1.2s ease-in-out infinite}",
  "#preHand{position:absolute;z-index:4;width:64px;height:64px;pointer-events:none;filter:drop-shadow(0 3px 2px rgba(0,0,0,.35));animation:preTap 1.2s cubic-bezier(.45,0,.55,1) infinite}",
  "#preHand.hidden{display:none}#preHand svg{width:64px;height:64px;display:block}",
  "@keyframes preFade{from{opacity:0}to{opacity:1}}",
  "@keyframes prePop{0%{transform:scale(.6);opacity:0}60%{transform:scale(1.04);opacity:1}100%{transform:scale(1);opacity:1}}",
  "@keyframes prePulse{0%,100%{scale:1}50%{scale:1.08}}",
  "@keyframes preTap{0%,100%{transform:translate(0,0) scale(1)}45%,55%{transform:translate(0,-10px) scale(.92)}75%{transform:translate(0,0) scale(1)}}",
  // reduce motion: no pop, no pulse, no hand loop
  "html.rm body #bPick.pre,html.rm body #bPick.pre .bcard,html.rm body #bPick.pre .bpt.pre.teach,html.rm #preHand{animation:none!important}",
  "@media (prefers-reduced-motion:reduce){html.pre2 body #bPick.pre,html.pre2 body #bPick.pre .bcard,html.pre2 body #bPick.pre .bpt.pre.teach,#preHand{animation:none!important}}",
  // short phones (375x667): keep the card on screen
  "@media (max-height:700px){html.pre2 body #bPick.pre .bhead{min-height:60px;font-size:28px}html.pre2 body #bPick.pre #bpPlay{min-height:68px;font-size:34px;margin-top:18px}}"
].join("\n");
document.head.appendChild(css);
var handEl = document.createElement("div"); handEl.id = "preHand"; handEl.className = "hidden"; handEl.setAttribute("aria-hidden", "true"); handEl.innerHTML = HAND_SVG;
var cardEl = PICK.querySelector(".bcard"); if(cardEl) cardEl.appendChild(handEl);

// ---- O1 when the card shows (Hard / Boss: always on the first try, also with nothing unlocked; Normal: as before)
var wants0 = bstWants;
bstWants = function(i){
  var k = kindOf(i); if(!k) return wants0.apply(this, arguments);
  var f = bstFailN[i] || 0; return BST_ALL || f === 0 || f >= 2;
};
// ---- O2 the tiles (all three tray boosters; replaces boosters2's "unlocked only" render)
bstPickRender = function(){
  var w = $("bpTiles"), s = bstSave(); if(!w) return; w.innerHTML = "";
  KEYS.forEach(function(k){
    var lock = !bstUnlocked(k), n = s[k] || 0, sel = !lock && !!bstPick[k], b = document.createElement("button");
    if(lock && bstPick[k]) delete bstPick[k];
    b.type = "button"; b.className = "bpt pre" + (sel ? " sel" : "") + (lock ? " lock" : "") + (!lock && !n ? " empty" : ""); b.dataset.k = k;
    b.innerHTML = (lock ? '<span class="preLv">' + LOCK_SVG + 'Lv.' + lvOf(k) + '</span>' : '<img class="preArt" alt="" draggable="false" src="' + ART[k] + '">' +
      '<span class="bn' + (n ? '' : ' plus') + '">' + (n || "+") + '</span>' + (sel ? '<span class="preOk">' + CHECK_SVG + '</span>' : ''));
    b.setAttribute("aria-label", BOOST[k].name + (lock ? ", unlocks at level " + lvOf(k) : n ? ", " + n + " owned" : ", get more"));
    b.setAttribute("aria-pressed", sel ? "true" : "false");
    if(lock) b.setAttribute("aria-disabled", "true");
    b.addEventListener("click", function(){
      audioInit(); snd("ui_tap"); teachOff(true);
      if(lock){ toast("Unlocks at level " + lvOf(k)); return; }
      if(!bstHave(k)){ bstBuyOpen(k, true); return; }
      bstPick[k] = !bstPick[k]; bstPickRender();
    });
    w.appendChild(b);
  });
  teachPlace();
};
// header copy on open: "Hard Level N" / "Boss Level N" (+ crown), "Pick Your Boosters", "Play"
var play0 = bstPlay;
bstPlay = function(i){
  var r = play0.apply(this, arguments);
  if(!PICK.classList.contains("hidden")){
    var k = kindOf(i), hd = $("bpLv");
    PICK.classList.toggle("hard", k === "hard"); PICK.classList.toggle("boss", k === "boss");
    hd.innerHTML = (k === "boss" ? CROWN_SVG : "") + '<span>' + (k === "boss" ? "Boss Level " : k === "hard" ? "Hard Level " : "Level ") + (i + 1) + '</span>';
    var sub = PICK.querySelector(".bsub"); if(sub) sub.textContent = "Pick Your Boosters";
    $("bpPlay").textContent = "Play";
    PRE.shown++; PRE.kind = k; PRE.idx = i; PRE.log.push("open:" + (i + 1) + ":" + (k || "normal"));
    teachOn();
  }
  return r;
};
// ---- O4 teach: the first untaught booster that is unlocked and owned (one per popup)
function teachOn(){
  PRE.teach = null; var t = preS().t, s = bstSave();
  for(var j=0;j<KEYS.length;j++){ var k = KEYS[j]; if(bstUnlocked(k) && (s[k] || 0) > 0 && !t[k]){ PRE.teach = k; break; } }
  if(PRE.teach){ PRE.log.push("teach:" + PRE.teach); requestAnimationFrame(teachPlace); setTimeout(teachPlace, 340); } else teachPlace();
}
function teachPlace(){
  var tiles = PICK.querySelectorAll(".bpt.pre"); [].forEach.call(tiles, function(b){ b.classList.toggle("teach", b.dataset.k === PRE.teach); });
  var b = PRE.teach && PICK.querySelector('.bpt.pre[data-k="' + PRE.teach + '"]');
  if(!b || !cardEl || PICK.classList.contains("hidden")){ handEl.classList.add("hidden"); return; }
  var c = cardEl.getBoundingClientRect(), r = b.getBoundingClientRect(), bl = cardEl.clientLeft, bt = cardEl.clientTop;   // absolute = from the padding edge
  // the hand comes from below, pointing up; its fingertip (svg 25, 4 of 56 = 29, 5 px) on the tile's lower half
  handEl.style.left = Math.round(r.left - c.left - bl + r.width/2 - 29) + "px"; handEl.style.top = Math.round(r.top - c.top - bt + r.height*0.62 - 5) + "px";
  handEl.classList.remove("hidden");
}
function teachOff(mark){
  if(PRE.teach && mark){ preS().t[PRE.teach] = 1; writeSave(); PRE.log.push("taught:" + PRE.teach); }
  if(mark) PRE.teach = null;
  handEl.classList.add("hidden"); [].forEach.call(PICK.querySelectorAll(".bpt.teach"), function(b){ b.classList.remove("teach"); });
}
// Play / ✕ also close the lesson (it was shown: once per booster)
$("bpPlay").addEventListener("click", function(){ teachOff(true); }, true);
$("bpClose").addEventListener("click", function(){ PRE.log.push("close"); teachOff(true); }, true);

// ---- O3 pay at the start, then arm as the tray does
var use0 = bstUse, have0 = bstHave;
bstUse = function(k){ if(PRE.paid[k] > 0){ PRE.paid[k]--; PRE.log.push("credit:" + k); bstSync(); return; } return use0.apply(this, arguments); };
bstHave = function(k){ return PRE.paid[k] > 0 || have0.apply(this, arguments); };
var ls0 = bstLevelStart;
bstLevelStart = function(){
  var pk = Object.assign({}, bstPick || {}); PRE.paid = {};
  var inv0 = Object.assign({}, bstSave());
  var r = ls0.apply(this, arguments);                       // boosters2: Wrecking Ball = 1 use + its 2 throws + the aim view; Safety Net armed
  var spent = [];
  if(pk.wreck && (bstSave().wreck || 0) < (inv0.wreck || 0)) spent.push("wreck");
  if(pk.net && netArmed){ use0("net"); PRE.paid.net = 1; spent.push("net"); }
  if(pk.sky && have0("sky")){ use0("sky"); PRE.paid.sky = 1; spent.push("sky"); if(!pk.wreck) skyArmWait(0); }
  PRE.last = { level:levelIdx + 1, picked:Object.keys(pk).filter(function(k){ return pk[k]; }), spent:spent, before:inv0, after:Object.assign({}, bstSave()) };
  if(spent.length) PRE.log.push("start:" + spent.join("+"));
  bstSync();
  return r;
};
// Sky Strike: the tray's own skyBtn() once the plan phase is up and no card is open (as boosters2's ballPickedOpen waits)
function skyArmWait(n){
  if(screen !== "game" || !(PRE.paid.sky > 0) || skyArmed || skyLive) return;
  var card = !$("bNew").classList.contains("hidden") || (typeof v5UnlockOpen === "function" && v5UnlockOpen()) || !!document.querySelector("#inCard:not(.hidden),#inDim:not(.hidden)");
  if(phase === "plan" && !card && !ballAim){ skyBtn(); return; }
  if(n < 120) setTimeout(function(){ skyArmWait(n + 1); }, 150);
}
// a paid, not yet used pick shows as armed on its tray chip (same gold "on" ring as the tray's own armed state)
var sync0 = bstSync;
bstSync = function(){
  var r = sync0.apply(this, arguments), bar = $("bbar");
  if(bar) [].forEach.call(bar.children, function(b){ if(PRE.paid[b.dataset.k] > 0) b.classList.add("on"); });
  return r;
};

window.__blast.pre = {
  on:true,
  kind:function(i){ return kindOf(i); },
  kinds:function(){ return LEVELS.map(function(l, i){ return kindOf(i); }); },
  state:function(){
    var open = !PICK.classList.contains("hidden");
    return { open:open, kind:open ? PRE.kind : null, idx:open ? PRE.idx : null, title:open ? ($("bpLv").textContent || "").trim() : null, sub:open ? (PICK.querySelector(".bsub") || {}).textContent : null,
      tiles:[].map.call(PICK.querySelectorAll(".bpt.pre"), function(b){ var lv = b.querySelector(".preLv"), bn = b.querySelector(".bn"); return { k:b.dataset.k, lock:b.classList.contains("lock"), lv:lv ? lv.textContent.trim() : null, n:bn ? bn.textContent : null, sel:b.classList.contains("sel"), teach:b.classList.contains("teach") }; }),
      teach:PRE.teach, hand:!handEl.classList.contains("hidden"), paid:Object.assign({}, PRE.paid), last:PRE.last, shown:PRE.shown, taught:Object.assign({}, preS().t), log:PRE.log.slice(-30) };
  },
  pick:function(){ return Object.assign({}, bstPick); },
  art:function(k){ return ART[k] || null; }   // the tile art (data URI): main/polish.js R20 uses the same chain-ball on the HUD chip (UX-55)
};
})(); }catch(e){ console.error("main/prelevel.js", e); }
