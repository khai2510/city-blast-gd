// ---- combo v18 (combo/patch.js): praise words per BLAST, one at a time (combo/COMBO.md). Measures run in fixedStep
// (deterministic), the pop itself (sprite + particles + voice + chime + haptic) in real time and cosmetic only: the word
// sits beside the blast / collapse that raised the tier. Data (sprites, audio) are set below.
var CMB_PTS = [0, 2, 4, 7, 11, 16];            // tier n from this many chain points (COMBO.md §2)
var CMB_W = [0, 140, 170, 215, 235, 280];     // sprite width (CSS px at 390 w)
var CMB_GATHER = 0.2, CMB_GATHER2 = 0.6, CMB_GATHER3 = 1.2, CMB_GAP = 1.0, CMB_WAIT = 1.6, CMB_OKHOLD = 0.8;
var CMB_HAP = [null, [[0, "L"]], [[0, "M"]], [[0, "M"], [90, "L"]], [[0, "H"], [90, "M"]], [[0, "H"], [80, "M"], [170, "H"]]];
var CMB = { L:null, groups:[], targets:0, vid:0, live:false, final:false, pts:0, tier:0, shown:0, pops:0, raiseT:-9, popT:-9,
  down:0, domino:0, pile:0, downT:-9, steel:0, big:0, hist:[], held:false, okT:-1, log:[], shows:[], at:null, tierAt:null, core:null, side:0 }, cmbOpt = null;
function cmbBuild(){
  CMB.L = L; CMB.groups = []; var map = {}, tot = 0;
  blocks.forEach(function(b){
    if(b.anchor || b.keep || b.prop) return;
    var k = b.bonus ? "b" + b.bgid : "t" + (b.bid != null ? b.bid : "A"), g = map[k];
    if(!g){ g = map[k] = { k:k, bonus:!!b.bonus, list:[], mass:0, down:false, hitV:-1, downV:-1 }; CMB.groups.push(g); }
    g.list.push(b); g.mass += b.mass; b._cg = g; if(!b.bonus) tot += b.mass;
  });
  // a target "building" lighter than 4 % of the target mass is a decor bit, not a building
  CMB.groups = CMB.groups.filter(function(g){ var ok = g.bonus || g.mass >= tot*0.04; if(!ok) g.list.forEach(function(b){ b._cg = null; }); return ok; });
  CMB.targets = CMB.groups.filter(function(g){ return !g.bonus; }).length;
  CMB.core = cmbCentroid(CMB.groups.filter(function(g){ return !g.bonus; }).reduce(function(a, g){ return a.concat(g.list); }, []), true);   // words go outward from it
}
// cosmetic: a mass-weighted centre of members (spawn = where they were built), only to place the word
function cmbCentroid(list, spawn){ var m = 0, x = 0, y = 0, z = 0; list.forEach(function(b){ var p = spawn ? b.spawn : b.P; m += b.mass; x += b.mass*p.x; y += b.mass*p.y; z += b.mass*p.z; });
  return m ? { x:x/m, y:y/m, z:z/m } : null; }
function cmbVolley(){
  if(CMB.L !== L || !CMB.groups.length) cmbBuild();
  CMB.vid++; CMB.live = true; CMB.final = stockLeft() === 0 || wave >= maxWaves;
  CMB.pts = CMB.tier = CMB.shown = CMB.pops = CMB.down = CMB.domino = CMB.pile = CMB.steel = CMB.big = CMB.whole = 0; CMB.downT = -9;
  CMB.raiseT = CMB.popT = -9; CMB.hist = []; CMB.held = false; CMB.okT = -1;
  var cx = 0, cy = 0, cz = 0, cn = 0;
  charges.forEach(function(c){ if(c.fired) return; if(c.host && c.host._cg) c.host._cg.hitV = CMB.vid;   // charged = direct
    var p = c.mesh.position; cx += p.x; cy += p.y; cz += p.z; cn++; });
  CMB.at = cn ? { x:cx/cn, y:cy/cn, z:cz/cn } : CMB.core; CMB.tierAt = null; CMB.side = 0;   // cosmetic: where the word goes
  CMB.log.push({ ev:"volley", vid:CMB.vid, level:levelIdx + 1, wave:wave, final:CMB.final, t:+gameT.toFixed(2) });
}
function cmbHit(b){ if(CMB.live && b._cg && !(cmbOpt && cmbOpt.cause === "fuel")) b._cg.hitV = CMB.vid; }
function cmbFail(b, cause){
  if(!CMB.live || b.keep || !b._cg || cause !== "blast" || (cmbOpt && cmbOpt.cause === "fuel")) return;
  b._cg.hitV = CMB.vid;                                   // Ball / Sky Strike kills are direct hits too
  if(!b.bonus && isMetal(b)){ CMB.steel++; CMB.at = { x:b.P.x, y:b.P.y, z:b.P.z }; }   // one TNT never breaks steel: a break means stacked TNT
}
function cmbDownTest(g){
  var dm = 0;
  for(var i=0;i<g.list.length;i++){
    var b = g.list[i];
    if(g.bonus ? (b.dead || !b.rb || tiltOf(b) > 0.61 || b.spawn.y - b.P.y > 0.8) : (b.dead || !b.rb || b.spawn.y - b.P.y > 1.2 || tiltOf(b) > TILT_MAX)) dm += b.mass;
  }
  return dm*2 >= g.mass;
}
function cmbMeasure(){
  CMB.groups.forEach(function(g){
    if(g.down || !cmbDownTest(g)) return;
    g.down = true; g.downV = CMB.vid; CMB.down++;
    var dom = g.hitV !== CMB.vid; if(dom) CMB.domino++;
    if(gameT - CMB.downT <= 1.0) CMB.pile++;               // pile-up: down within 1 s of the last one (the old combo window)
    CMB.downT = gameT; CMB.at = cmbCentroid(g.list, false) || CMB.at;
    CMB.log.push({ ev:"down", vid:CMB.vid, g:g.k, domino:dom, t:+gameT.toFixed(2) });
  });
  var s = score(), h = CMB.hist, mn = s; h.push([gameT, s]);
  while(h.length && h[0][0] < gameT - 1.0) h.shift();
  for(var i=0;i<h.length;i++) mn = Math.min(mn, h[i][1]);
  CMB.big = Math.max(CMB.big, s - mn >= 0.7 ? 3 : s - mn >= 0.5 ? 2 : s - mn >= 0.3 ? 1 : 0);
  CMB.whole = CMB.targets > 0 && CMB.groups.every(function(g){ return g.bonus || g.downV === CMB.vid; }) ? 1 : 0;   // the whole job down in this BLAST
  var allNow = CMB.targets >= 6 && wave === 1 && CMB.whole;
  CMB.pts = CMB.down + CMB.pile + 2*CMB.domino + Math.min(3, CMB.steel) + CMB.big + CMB.whole;
  var t = 0; for(var n=1;n<CMB_PTS.length;n++) if(CMB.pts >= CMB_PTS[n]) t = n;
  if(CMB.domino >= 4 || allNow) t = 5;
  if(t > CMB.tier){ CMB.tier = t; CMB.raiseT = gameT; CMB.tierAt = CMB.at; CMB.log.push({ ev:"tier", vid:CMB.vid, tier:t, pts:CMB.pts, t:+gameT.toFixed(2) }); }
}
function cmbStep(){
  cmbOpt = null;
  if(!CMB.live || (phase !== "boom" && phase !== "settle")) return;
  cmbMeasure();
  if(CMB.final && CMB.pops < 2){ var ok = verdict().ok; CMB.okT = ok ? (CMB.okT < 0 ? gameT : CMB.okT) : -1; }   // how long the pass has held
  cmbRelease(false);
}
function cmbRelease(atSettle){
  if(CMB.pops >= 2 || CMB.tier < 1 || CMB.tier <= CMB.shown) return;
  if(!atSettle && (gameT - CMB.raiseT < (!CMB.pops ? CMB_GATHER : CMB.tier >= CMB.shown + 2 ? CMB_GATHER2 : CMB_GATHER3) || (CMB.pops && gameT - CMB.popT < CMB_GAP))) return;
  if(CMB.final){                                          // fail-bound: only once the live verdict has been a pass for
    var v = verdict();                                    // 0.8 s with the wreck mostly still (or at settle)
    if(!v.ok || (!atSettle && (CMB.okT < 0 || gameT - CMB.okT < CMB_OKHOLD || movingCount() >= 8))){
      if(atSettle) CMB.log.push({ ev:"suppressed", vid:CMB.vid, tier:CMB.tier, code:v.code, pct:Math.round(score()*100), t:+gameT.toFixed(2) });
      else if(!CMB.held){ CMB.held = true; CMB.log.push({ ev:"held", vid:CMB.vid, tier:CMB.tier, t:+gameT.toFixed(2) }); }
      return;
    }
  }
  CMB.pops++; CMB.shown = CMB.tier; CMB.popT = gameT;
  CMB.log.push({ ev:"pop", vid:CMB.vid, tier:CMB.tier, n:CMB.pops, pts:CMB.pts, phase:phase, pct:Math.round(score()*100), t:+gameT.toFixed(2) });
  cmbShow(CMB.tier, CMB.tierAt || CMB.at, CMB.pops - 1);
}
function cmbSettle(){
  if(!CMB.live) return;
  cmbMeasure(); cmbRelease(true); CMB.live = false;
  CMB.log.push({ ev:"settle", vid:CMB.vid, tier:CMB.tier, pops:CMB.pops, pts:CMB.pts, down:CMB.down, pile:CMB.pile, domino:CMB.domino, steel:CMB.steel, big:CMB.big, whole:CMB.whole,
    final:CMB.final, ok:verdict().ok, code:verdict().code, pct:Math.round(score()*100), t:+gameT.toFixed(2) });
}
// ---- the pop (real time, cosmetic). The word stands BESIDE the blast / collapse that raised the tier: that point projected
// to the screen, pushed up and outward (away from the job's centre) so the building core stays visible; the 2nd pop of a
// blast takes the other side. Clamped to the band between the top HUD (level pill, % bar, pause, coins, warnings) and
// the bottom tray (BLAST, TNT badge, boosters). Particles: one 2D canvas overlay (0 WebGL draw calls), alive < 1.5 s.
var CMB_AR = [1, 140/189, 174/232, 199/293, 300/312, 380/409];   // sprite height / width
var cmbEls = [null, null], cmbImgs = [], cmbCssOn = false;
var CFX = { cv:null, cx:null, list:[], raf:0, last:0, frozen:false, dpr:1 };
var CFX_PAL = ["#1B2A5C", "#F28C28", "#FFC933", "#FFF4DC"];   // the word art: navy outline, construction orange, safety yellow, cream
function cmbEngine(){ try{ return window.SFX && SFX.ctx ? SFX.init() : null; }catch(e){ return null; } }
function cmbDom(slot){
  if(!cmbCssOn){
    cmbCssOn = true; var st = document.createElement("style"); st.id = "cmbst";
    st.textContent = ".cmbW{position:fixed;left:0;top:0;z-index:24;pointer-events:none;opacity:0;will-change:transform,opacity}.cmbW img{display:block;width:100%;height:auto}" +
      "#cmbFx{position:fixed;left:0;top:0;width:100vw;height:100vh;z-index:24;pointer-events:none;display:none}";
    document.head.appendChild(st);
  }
  if(cmbEls[slot]) return cmbEls[slot];
  var el = document.createElement("div"); el.className = "cmbW"; el.id = "cmbW" + slot; el.setAttribute("aria-hidden", "true");
  el.appendChild(document.createElement("img")); document.body.appendChild(el);
  return (cmbEls[slot] = el);
}
function cmbBox(id){ var e = document.getElementById(id); if(!e || e.classList.contains("hidden") || !e.offsetParent) return null; var r = e.getBoundingClientRect(); return r.width && r.height ? r : null; }
function cmbBand(){
  var top = 60, bot = innerHeight - 120;
  ["top", "lvPill", "meter", "pauseBtn", "coinPill", "collat"].forEach(function(id){ var r = cmbBox(id); if(r && r.top < innerHeight*0.4) top = Math.max(top, r.bottom); });
  var b0 = innerHeight;
  ["bottom", "bbar", "blast", "chips", "row"].forEach(function(id){ var r = cmbBox(id); if(r && r.bottom > innerHeight*0.55) b0 = Math.min(b0, r.top); });
  if(b0 < innerHeight) bot = b0;
  return { top:top + 6, bot:bot - 6 };
}
function cmbPlace(at, slot, w, h){
  var vw = innerWidth, s = at ? toScreen(at) : null, c = CMB.core ? toScreen(CMB.core) : { x:vw/2 };
  var sx = s ? s.x : vw/2, sy = s ? s.y : innerHeight*0.4, side;
  if(slot === 1 && CMB.side) side = -CMB.side;                       // the 2nd word of a blast: the other side
  else side = Math.abs(sx - c.x) > 12 ? (sx > c.x ? 1 : -1) : (sx < vw/2 ? 1 : -1);
  if(slot === 0) CMB.side = side;
  var x = sx + side*(w*0.5 + 22), y = sy - h*0.5 - 26, B = cmbBand(), g = 12;
  x = Math.max(g + w/2, Math.min(vw - g - w/2, x));
  var lo = B.top + h/2, hi = B.bot - h/2;
  y = hi < lo ? (B.top + B.bot)/2 : Math.max(lo, Math.min(hi, y));
  var oe = cmbEls[1 - slot], o = oe && oe._box, oa = oe && oe._a;   // the other word still on screen: never on top of it
  var live = o && (oa ? oa.playState !== "finished" && oa.playState !== "idle" : performance.now() - o.t < 1100);
  if(live && Math.abs(x - o.x) < (w + o.w)/2 + 6 && Math.abs(y - o.y) < (h + o.h)/2 + 6){
    var xs = o.x + (x < o.x || (x === o.x && side < 0) ? -1 : 1)*((w + o.w)/2 + 8);
    if(xs - w/2 >= g && xs + w/2 <= vw - g) x = xs;            // beside it
    else { var yb = o.y + (o.h + h)/2 + 8, ya = o.y - (o.h + h)/2 - 8; y = yb <= hi ? yb : ya >= lo ? ya : y; }   // else below / above it
  }
  return { x:x, y:y, side:side, sx:sx, sy:sy };
}
function cmbWord(tier, at, slot){
  slot = slot ? 1 : 0;
  var el = cmbDom(slot), im = el.firstChild, w = Math.min(CMB_W[tier], innerWidth*0.62), h = w*CMB_AR[tier];
  var P = cmbPlace(at, slot, w, h);
  im.src = CMB_IMG[tier]; im.alt = ""; el.style.width = w.toFixed(1) + "px"; el._box = { x:P.x, y:P.y, w:w, h:h, t:performance.now() };
  if(el._a) el._a.cancel();
  if(el._tr) clearTimeout(el._tr);
  var x0 = (P.x - w/2).toFixed(1), y0 = (P.y - h/2).toFixed(1), T = function(dy, k){ return "translate(" + x0 + "px," + (+y0 + dy).toFixed(1) + "px) scale(" + k + ")"; };
  el.style.transformOrigin = (P.side > 0 ? "20%" : "80%") + " 60%";   // grows out of the blast side
  var K = REDUCED ?
    [{ opacity:0, transform:T(0, 1), offset:0 }, { opacity:1, transform:T(0, 1), offset:0.1 }, { opacity:1, transform:T(0, 1), offset:0.81 }, { opacity:0, transform:T(0, 1), offset:1 }] :
    [{ opacity:0, transform:T(0, 0), offset:0, easing:"cubic-bezier(.2,.8,.3,1)" }, { opacity:1, transform:T(0, 1.15), offset:0.14, easing:"ease-in-out" },
     { opacity:1, transform:T(0, 1), offset:0.24 }, { opacity:1, transform:T(0, 1), offset:0.81, easing:"ease-in" }, { opacity:0, transform:T(-14, 0.96), offset:1 }];
  if(el.animate) el._a = el.animate(K, { duration:1050, fill:"forwards" });
  else { el.style.transform = T(0, 1); el.style.opacity = 1; setTimeout(function(){ el.style.opacity = 0; }, 1000); }
  if(!REDUCED){
    cfxBurst(P.x - P.side*w*0.28, P.y + h*0.12, w, h, tier, P.side);
    el._tr = setTimeout(function(){ if(!CFX.frozen) cfxTrail(P.x, P.y - 14, w, h, tier); }, 850);
  }
  return { x:Math.round(P.x), y:Math.round(P.y), w:Math.round(w), h:Math.round(h), side:P.side, at:{ x:Math.round(P.sx), y:Math.round(P.sy) } };
}
// ---- word particles: dust puff + chips (+ sparks from Excellent up) on appear, cream motes drifting up on fade-out
function cfxCanvas(){
  if(!CFX.cv){ cmbDom(0); CFX.cv = document.createElement("canvas"); CFX.cv.id = "cmbFx"; CFX.cv.setAttribute("aria-hidden", "true"); document.body.appendChild(CFX.cv); CFX.cx = CFX.cv.getContext("2d"); }
  var d = Math.min(2, window.devicePixelRatio || 1), W = Math.round(innerWidth*d), H = Math.round(innerHeight*d);
  if(CFX.cv.width !== W || CFX.cv.height !== H){ CFX.cv.width = W; CFX.cv.height = H; }
  CFX.dpr = d; CFX.cv.style.display = "block";
  return CFX.cx;
}
function cfxAdd(p){ if(CFX.list.length < 80) CFX.list.push(p); }
function cfxBurst(x, y, w, h, tier, side){
  if(!cfxCanvas()) return;
  var R = Math.random, i, n = 5 + tier + (tier >= 3 ? 2 : 0);   // chips: 6 .. 12
  for(i = 0; i < 2 + (tier >> 1); i++) cfxAdd({ k:0, x:x + (R() - 0.5)*w*0.35, y:y + (R() - 0.3)*h*0.25, vx:-side*(10 + R()*20), vy:-12 - R()*16,
    r0:10 + 3*tier, r1:28 + 7*tier, t:0, life:0.5 + R()*0.2, c:"255,244,220" });
  for(i = 0; i < n; i++){
    var a = -Math.PI/2 + (R() - 0.5)*2.6, v = 120 + 30*tier + R()*120;
    cfxAdd({ k:1, x:x, y:y, vx:Math.cos(a)*v - side*30, vy:Math.sin(a)*v, g:700, s:2.5 + tier*0.7 + R()*2, rot:R()*6, vr:(R() - 0.5)*14, t:0, life:0.6 + R()*0.3, c:CFX_PAL[i % 4] });
  }
  if(tier >= 3) for(i = 0; i < 2 + tier; i++){
    var b = -Math.PI/2 + (R() - 0.5)*3.0, u = 300 + R()*160;
    cfxAdd({ k:2, x:x, y:y, vx:Math.cos(b)*u, vy:Math.sin(b)*u, g:300, t:0, life:0.28 + R()*0.1, c:i % 2 ? "#FFC933" : "#FFF4DC" });
  }
  cfxRun();
}
function cfxTrail(x, y, w, h, tier){
  if(REDUCED || !cfxCanvas()) return;
  for(var i = 0; i < 4 + tier; i++) cfxAdd({ k:3, x:x + (Math.random() - 0.5)*w*0.8, y:y + h*(0.15 + Math.random()*0.25), vx:(Math.random() - 0.5)*16, vy:-30 - Math.random()*30,
    r:2 + Math.random()*2.5, t:0, life:0.55 + Math.random()*0.25, c:i % 3 ? "255,244,220" : "255,201,51" });
  cfxRun();
}
function cfxRun(){ if(!CFX.raf){ CFX.last = performance.now(); CFX.raf = requestAnimationFrame(cfxLoop); } }
function cfxLoop(now){
  var dt = Math.max(0, Math.min(0.1, ((now || 0) - CFX.last)/1000)), c = CFX.cx, d = CFX.dpr; CFX.last = Math.max(CFX.last, now || 0);   // rAF time can be older than performance.now(): never a negative step
  if(CFX.frozen) dt = 0;
  c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, CFX.cv.width, CFX.cv.height); c.setTransform(d, 0, 0, d, 0, 0);
  for(var i = CFX.list.length - 1; i >= 0; i--){
    var p = CFX.list[i]; p.t += dt;
    var k = p.t/p.life; if(!(k < 1)){ CFX.list[i] = CFX.list[CFX.list.length - 1]; CFX.list.pop(); continue; }
    if(k < 0) k = 0;
    p.vy += (p.g || 0)*dt; p.x += p.vx*dt; p.y += p.vy*dt;
    if(p.k === 0){ c.globalAlpha = 0.55*(1 - k)*(1 - k); c.fillStyle = "rgb(" + p.c + ")"; c.beginPath(); c.arc(p.x, p.y, Math.max(0, p.r0 + (p.r1 - p.r0)*(1 - (1 - k)*(1 - k))), 0, 6.283); c.fill(); }
    else if(p.k === 1){ p.rot += p.vr*dt; c.globalAlpha = k < 0.7 ? 1 : (1 - k)/0.3; c.save(); c.translate(p.x, p.y); c.rotate(p.rot); c.fillStyle = p.c; c.fillRect(-p.s/2, -p.s/2, p.s, p.s*0.8);
      if(p.c !== CFX_PAL[0]){ c.lineWidth = 1; c.strokeStyle = CFX_PAL[0]; c.strokeRect(-p.s/2, -p.s/2, p.s, p.s*0.8); } c.restore(); }
    else if(p.k === 2){ c.globalAlpha = 1 - k; c.strokeStyle = p.c; c.lineWidth = 2; c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(p.x - p.vx*0.035, p.y - p.vy*0.035); c.stroke(); }
    else { c.globalAlpha = 0.8*(1 - k); c.fillStyle = "rgb(" + p.c + ")"; c.beginPath(); c.arc(p.x, p.y, Math.max(0, p.r), 0, 6.283); c.fill(); }
  }
  c.globalAlpha = 1;
  if(CFX.list.length || CFX.frozen) CFX.raf = requestAnimationFrame(cfxLoop);
  else { CFX.raf = 0; CFX.cv.style.display = "none"; }
}
function cmbHaptic(tier){
  var H = window.Haptics;
  if(H && H.EVENTS){ if(!H.EVENTS.combo_tier) H.EVENTS.combo_tier = { pri:2, cd:700, hits:[[0, "M"]] }; try{ H.play("combo_tier", { hits:CMB_HAP[tier] }); }catch(e){} return "haptics2"; }
  if(!save.mute && navigator.vibrate) try{ navigator.vibrate([8 + 6*tier]); return "vibrate"; }catch(e){}
  return null;
}
function cmbShow(tier, at, slot){
  var vid = CMB.vid, e = cmbEngine(), wait = e && e.comboBusy ? e.comboBusy() : 0, voice = save.voice !== false;
  if(wait > CMB_WAIT){ wait = 0; voice = false; }          // TIMBER call still long: the word goes now, without its line
  var rec = { tier:tier, vid:vid, slot:slot ? 1 : 0, wait:+wait.toFixed(2), at:performance.now() };
  CMB.shows.push(rec);
  var go = function(){
    if(CMB.vid !== vid || screen !== "game" || (wait > 0.02 && (phase === "plan" || phase === "count"))){ rec.dropped = true; return; }   // a late pop never lands in planning
    rec.place = cmbWord(tier, at, slot); rec.word = true; rec.hap = cmbHaptic(tier);
    var en = cmbEngine();
    if(en && en.comboPraise){ var r = en.comboPraise(tier, { voice:voice }); rec.voice = !!(r && r.voice); rec.chime = !!(r && r.chime); }
    rec.shownAt = performance.now();
  };
  if(wait > 0.02) setTimeout(go, wait*1000 + 60); else go();
}
(function(){ for(var i=1;i<6;i++){ var im = new Image(); im.src = CMB_IMG[i]; cmbImgs.push(im); } })();   // decode the sprites at load
window.__combo = {
  state: function(){ return { vid:CMB.vid, live:CMB.live, final:CMB.final, tier:CMB.tier, shown:CMB.shown, pops:CMB.pops, pts:CMB.pts, down:CMB.down, pile:CMB.pile,
    domino:CMB.domino, steel:CMB.steel, big:CMB.big, targets:CMB.targets, groups:CMB.groups.map(function(g){ return { k:g.k, bonus:g.bonus, n:g.list.length, down:g.down }; }) }; },
  log: function(){ return CMB.log.slice(); }, shows: function(){ return CMB.shows.slice(); },
  clear: function(){ CMB.log = []; CMB.shows = []; },
  show: function(tier, at, slot){ cmbWord(tier, at, slot || 0); var en = cmbEngine(); return en && en.comboPraise ? en.comboPraise(tier, { voice:save.voice !== false }) : null; },
  word: function(tier, rm, at, slot){ var r = REDUCED; if(rm != null) REDUCED = !!rm; try{ return cmbWord(tier, at, slot || 0); } finally { REDUCED = r; } },   // shots
  freeze: function(on){ CFX.frozen = !!on; cmbEls.forEach(function(e){ if(e && e._a){ if(on) e._a.pause(); else e._a.play(); } }); if(!on) cfxRun(); },   // shots: hold words + particles
  fx: function(clear){ if(clear) CFX.list.length = 0; return { live:CFX.list.length, canvas:!!CFX.cv }; },
  where: function(){ return { at:CMB.at, tierAt:CMB.tierAt, core:CMB.core }; },
  pop: function(tier, at){ cmbShow(tier, at || CMB.at, 0); return CMB.shows[CMB.shows.length - 1]; },   // the full pop path (TIMBER wait, voice, haptic)
  audio: function(){ var en = cmbEngine(); return en && en.comboVoice ? en.comboVoice() : null; },
  PTS: CMB_PTS, SET: CMB_SET
};
// ---- end combo v18 (game)
