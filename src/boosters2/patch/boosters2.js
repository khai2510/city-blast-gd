// ---- boosters2 v15 (boosters2/patch.js, Owner 11/11/2026): unlock schedule L10/L20/L30 + Wrecking Ball power hit ----
// Schedule. A booster is the REWARD for beating a boss: the unlock card shows after the L10 / L20 / L30 win and the
// booster is first usable from L11 / L21 / L31 (nothing new is introduced ON a boss). Order: L10 Wrecking Ball,
// L20 Safety Net, L30 the third booster (not built: boosters2/THIRD-BOOSTER.md, Owner picks). +1 TNT stays the lose-card
// rescue only (not in the bar). Old saves already past a boss get its booster (and its free stock) on load; the card
// shows at the next level start. ?boosters=1 = every built booster unlocked (testing), with its free stock once.
// unlock = the boss level whose WIN unlocks it (save.level >= unlock means that boss is beaten).
var B2 = { all:V31.boosters, sched:{ wreck:10, net:20, scan:30 }, cardQ:[], handK:null, granted:[] };
BOOST.wreck.unlock = 10; BOOST.wreck.free = 3; BOOST.wreck.line = "Smash a whole chunk.";
BOOST.net.unlock = 20;   BOOST.net.free = 2;   BOOST.net.line = "Catches flying rubble.";
BOOST.scan.unlock = 30;  BOOST.scan.hidden = true;   // slot 3 = Owner's pick (THIRD-BOOSTER.md); hidden until built
if(L6.tntOnly){ BOOST.tnt1.hidden = true; BOOST.tnt1.unlock = 999; }   // +1 TNT: lose-card rescue only
// is booster k due (its boss beaten) for this save?
function b2Due(k){ var B = BOOST[k]; return !!B && !B.hidden && (save.level|0) >= B.unlock; }
// grant every due booster once: free stock + seen; the NEW! card is queued (on the win screen, or at the next level start)
function b2Grant(when){
  var sv = bstSave(), got = [];
  BOOST_ORDER.forEach(function(k){
    if(save.bseen[k] || BOOST[k].hidden) return;
    if(!(b2Due(k) || B2.all)) return;
    save.bseen[k] = 1; sv[k] = (sv[k]||0) + BOOST[k].free; got.push(k); B2.granted.push(k + "@" + when);
  });
  if(got.length){ writeSave(); got.forEach(function(k){ if(B2.cardQ.indexOf(k) < 0) B2.cardQ.push(k); }); bstSync(); }
  return got;
}
// the unlock card: same NEW! card family, but it may show on the win screen too (bstNew is game-screen only)
function b2Card(){
  if(manual || !B2.cardQ.length) return;
  if(!$("bNew").classList.contains("hidden") || (typeof v5UnlockOpen === "function" && v5UnlockOpen())){ setTimeout(b2Card, 400); return; }
  var k = B2.cardQ.shift(), B = BOOST[k];
  $("bnIcon").innerHTML = bstIcon(k, "bare"); $("bnName").textContent = B.name; $("bnLine").textContent = B.line; $("bnFree").textContent = B.free + " FREE";
  $("bNew").dataset.k = k; $("bNew").dataset.on = screen; $("bNew").classList.remove("hidden"); snd("unlock");
  if(window.SFX && SFX.haptic) SFX.haptic("upgrade", 1);
}
// after GOT IT: on a game screen point at the booster's button now; on the win screen point at it on the next level
function b2CardClosed(){
  var k = $("bNew").dataset.k; if(!k) return false;
  $("bNew").dataset.k = "";
  if(B2.cardQ.length){ setTimeout(b2Card, 250); return true; }
  if(screen !== "game"){ B2.handK = k; bstHandNext = levelIdx + 1; return true; }
  var b = $("bbar") && $("bbar").querySelector('[data-k="' + k + '"]');
  if(b && !(k === "wreck" && ballOn())){ var r = b.getBoundingClientRect(); if(r.width) bstHandAt(r.left + r.width/2, r.top + r.height*0.6); }
  return true;
}
// old saves: anything already due is granted at the next level start (bstLevelStart), with its card

// ---- Wrecking Ball power hit (replaces fix2's "knock out 1 member"). Deterministic: no random term, fixed order.
// The ball drives a PATH into the building: a capsule from the hit point `depth` m along the swing. Every member within
// R of that path (vertical distance counted /Ry, so the hole is a few storeys tall) takes
//   dmg x f(d) x fam[material] x member.dmg   (armour applies as for TNT),  f = 1 inside Rc, then (1 - (d-Rc)/(R-Rc))^fall
// so the material ladder of the level decides what goes: wood and brick readily, plain concrete most of the zone, RC
// piers only on the path itself (inside Rc), steel never breaks: it is bent and shoved hard instead. A shockwave out to
// shockR loosens what it reaches (bond capacity x loosen near the hit, back to 1 at shockR; never below `floor`) and
// shakes it (small radial impulse), so the floors above the hole come down by themselves. The protected building is
// never damaged, pushed or loosened by the ball (its rubble can still reach it, as with TNT).
// Size: the swing is worth about a third of the level's TNT. The hole (depth, Rc, R) and the push scale with
// s = clamp(level TNT / full, smin, 1): full size (about 3-4 TNT clustered) from `full` TNT up (round 4: 7-12 TNT per
// level); on a small 2-4 TNT level the hole shrinks with the budget, so 2 swings never stand in for the whole plan.
// Per level, fixed (the level's own TNT count, not upgrades or +1 TNT): same tap = same result.
var BPOW = {
  full:8, smin:0.4,
  depth:4.0, Rc:1.3, R:3.5, Ry:1.3, dmg:360, fall:0.9,
  fam:{ timber:1.5, glass:2.0, brick:1.15, stone:1.0, concrete:1.0, rc:1.0, steel:0 },
  rcOut:false,                  // RC family outside Rc: no damage (direct hit only)
  clangK:0.45,                  // the ball hits steel first: the path damage beyond it is scaled (the steel took the blow)
  imp:9000, impR:4.4, back:1.6, // directional push: radial from a point `back` m behind the hit, so it drives along the path
  shockR:7.5, shockImp:1600, loosen:0.55, floor:0.4,
  steelShove:14000, steelR:2.4, steelBend:0.34,
  maxKill:60,                   // safety cap per hit (deterministic order: nearest first)
  ball:{ postV:4.0, contact:0.3, stop:0.12, slow:0.32, settleMax:6 },
  fx:{ shake:0.95, kick:16, flash:0.22, dust:14, ring:2.8 }
};
var B2S = { hits:[] };          // per-hit stats for the harness
var BG = { s:1, depth:4, Rc:1.3, R:3.5, shockR:7.5 };   // this hit's geometry (BPOW x size)
function b2Size(){ var n = 0, c = (L && L.charges) || {}; for(var k in c) n += c[k] || 0; return Math.max(BPOW.smin, Math.min(1, (n || BPOW.full)/BPOW.full)); }
function b2Fam(b){ var c = (typeof mfxClassOf === "function" ? mfxClassOf(b.key) : null) || "concrete"; return c; }
function b2Steel(b){ return b2Fam(b) === "steel" || (b.def.armor || 0) >= 0.5 && b2Fam(b) !== "rc"; }
var _b2a = new THREE.Vector3(), _b2s = new THREE.Vector3();
// scaled distance from member b to the path p + u*t, t in [0, depth] (u horizontal)
function b2PathDist(b, p, u){
  var best = 1e9, n = Math.max(2, Math.ceil(BG.depth/0.5));
  for(var i=0;i<=n;i++){
    _b2s.copy(p).addScaledVector(u, BG.depth*i/n);
    nearestPoint(b, _b2s, _b2a);
    var dx = _b2a.x - _b2s.x, dy = (_b2a.y - _b2s.y)/BPOW.Ry, dz = _b2a.z - _b2s.z, d = Math.sqrt(dx*dx + dy*dy + dz*dz);
    if(d < best) best = d;
  }
  return best;
}
function b2Fall(d){ if(d <= BG.Rc) return 1; if(d >= BG.R) return 0; return Math.pow(1 - (d - BG.Rc)/(BG.R - BG.Rc), BPOW.fall); }
// the hit itself. w = the live swing, p = contact point on the face, dir = ball velocity direction, best = member touched
function ballPower(w, p, dir, best){
  var u = new THREE.Vector3(dir.x, 0, dir.z); if(u.lengthSq() < 1e-6) u.copy(w.rig.n).negate(); u.normalize();
  var tB = performance.now(), clang = b2Steel(best), i, b, st = { t:+gameT.toFixed(3), key:best.key, clang:clang, kill:0, fam:{}, steel:0, loosened:0, cand:0 };
  var kmul = clang ? BPOW.clangK : 1, s = b2Size();
  BG.s = s; BG.depth = BPOW.depth*s; BG.Rc = BPOW.Rc*s; BG.R = BPOW.R*s; BG.shockR = BPOW.shockR*Math.max(0.6, s); st.s = +s.toFixed(3);
  mfxBlastAt(p);   // crumbs and dust of the members that break fly away from the hit
  // 1) damage along the path (nearest first)
  var hit = [];
  for(i=0;i<blocks.length;i++){ b = blocks[i];
    if(b.dead || b.anchor || b.keep || b.prop || b.bonus || !b.rb || b.key === "plinth") continue;
    if(Math.abs(b.P.x - p.x) > BG.depth + BG.R + 3 || Math.abs(b.P.z - p.z) > BG.depth + BG.R + 3 || Math.abs(b.P.y - p.y) > BG.R*BPOW.Ry + 4) continue;
    var d = b2PathDist(b, p, u); if(d >= BG.R) continue;
    hit.push({ b:b, d:d });
  }
  hit.sort(function(x, y){ return x.d - y.d || blocks.indexOf(x.b) - blocks.indexOf(y.b); });
  st.cand = hit.length;
  var steelL = [];
  for(i=0;i<hit.length;i++){ b = hit[i].b; var fam = b2Fam(b), f = b2Fall(hit[i].d);
    if(fam === "steel" || b2Steel(b)){ if(hit[i].d < BPOW.steelR*s) steelL.push(hit[i]); continue; }
    if(fam === "rc" && hit[i].d > BG.Rc && !BPOW.rcOut) continue;
    if(st.kill >= BPOW.maxKill) break;
    var m = BPOW.fam[fam] != null ? BPOW.fam[fam] : 1;
    var was = b.dead; damage(b, BPOW.dmg*f*m*(b.def.dmg || 1)*kmul, false, "blast");
    if(!was && b.dead){ st.kill++; st.fam[fam] = (st.fam[fam] || 0) + 1; w.broke++; }
    else if(!b.dead && typeof mfxBlastHit === "function") mfxBlastHit(b, p, f);   // a spall where it survived
  }
  // 2) steel near the path: bent and shoved along the swing (never broken by the ball)
  for(i=0;i<steelL.length;i++){ b = steelL[i].b; if(b.dead || !b.rb) continue; st.steel++;
    var k = 1 - steelL[i].d/(BPOW.steelR*s), J = BPOW.steelShove*s*k*Math.min(1, b.mass/1500);
    nearestPoint(b, p, _b2a);
    b.rb.applyImpulseAtPoint({ x:u.x*J, y:0.15*J, z:u.z*J }, { x:_b2a.x, y:_b2a.y, z:_b2a.z }, true);
    if(typeof mfxBend === "function") mfxBend(b, u, BPOW.steelBend*(0.4 + 0.6*k));
    if(typeof mfxSparks === "function") mfxSparks(_b2a, 6, 10);
  }
  // 3) shockwave: loosen the bonds it reaches, wake everything
  for(i=0;i<links.length;i++){ var l = links[i]; if(!l.alive || l.a.keep || l.b.keep) continue;
    var da = l.a.anchor ? 1e9 : l.a.P.distanceTo(p), db = l.b.anchor ? 1e9 : l.b.P.distanceTo(p), dd = Math.min(da, db);
    if(dd >= BG.shockR) continue;
    var kk = Math.max(BPOW.floor, BPOW.loosen + (1 - BPOW.loosen)*dd/BG.shockR);
    if(!l.cap0) l.cap0 = l.cap;
    var cur = l.capK || 1; if(kk >= cur) continue;
    l.capK = kk; l.cap = { t:l.cap0.t*kk, c:l.cap0.c*kk, s:l.cap0.s*kk, m:l.cap0.m*kk }; st.loosened++;
  }
  wakeAll();
  // 4) impulses: a directional drive along the path + a small radial shake out to shockR (members, rubble, fragments)
  var o = p.clone().addScaledVector(u, -BPOW.back*s), def = { kind:"std" }, Ri = (BPOW.impR + BPOW.back)*s, Ii = BPOW.imp*(0.5 + 0.5*s);
  for(i=0;i<blocks.length;i++){ b = blocks[i]; if(b.anchor || b.keep || (b.dead && !b.rubble) || b2Steel(b) && !b.dead) continue;
    pushBody(b, o, Ii, Ri, def, null); pushBody(b, p, BPOW.shockImp, BG.shockR, def, null); }
  for(i=0;i<frags.length;i++){ if(frags[i].keep) continue; pushBody(frags[i], o, Ii, Ri, def, null); }
  // 5) feel (juice / matfx pools; feel.* respects Reduce motion)
  var F = BPOW.fx;
  feel.shake(F.shake); feel.kick(F.kick); feel.hitstop(BPOW.ball.stop*1000); screenFlash(F.flash);
  if(!manual && !REDUCED) passSlow = Math.max(passSlow, BPOW.ball.slow);
  if(clang){ fxRing(p, 1.6, 0xBFD3FF); popText("CLANG!"); snd("steel_clang", { mass:3, pan:sndPan(p) }); if(window.SFX && SFX.haptic) SFX.haptic("beam_snap", 1); }
  // visual only, own random (jPuffs / jChips never call the game's rnd): dust burst, a puff through the hole, a ground ring
  var pn = typeof PX === "object" ? PX.cnt(F.dust) : F.dust;
  jPuffs(p, pn, 2.4); jPuffs(p.clone().addScaledVector(u, 2).setY(Math.max(0.4, p.y - 1.2)), Math.ceil(pn/2), 2.0);
  for(i=0;i<8;i++){ var a = i*Math.PI/4; jPuffs(new THREE.Vector3(p.x + Math.cos(a)*3.6, 0.4, p.z + Math.sin(a)*3.6), 1, 2.2); }
  fxRing(p, F.ring, 0xF4E9D2); fxRing(new THREE.Vector3(p.x, Math.max(0.6, p.y*0.5), p.z), BG.shockR*0.55, 0xE8D8B8);
  if(typeof mfxPx === "function") jChips(p, jMatOf(best), mfxPx(10));
  snd("steel_clang", { mass:4.5, intensity:0.8, pan:sndPan(p) }); snd("concrete_crack", { intensity:1, pan:sndPan(p) });
  snd("debris", { mass:3, intensity:1.2, pan:sndPan(p) }); snd("pancake", { index:0, intensity:1 });
  if(st.kill >= 6) snd("boom_tnt", { intensity:0.55, pan:sndPan(p) });
  if(window.SFX && SFX.haptic) SFX.haptic("boom_cutter", 1);
  if(!clang || st.kill) comboEvent("SMASH!");
  w.clang = clang; w.kill = st.kill; st.ms = +(performance.now() - tB).toFixed(2);   // cost of the hit step itself (visuals included)
  B2S.hits.push(st); if(B2S.hits.length > 40) B2S.hits.shift();
  return st;
}
// a tap on the prompt ring = a swing at the prompt spot exactly (the ring is 72 px; a finger is not a pixel, and the arc
// check is strict near the face, so a tap 4 px off the spot could be refused as "Can't reach" on a deep facade)
function b2Snap(x, y){
  if(!ballAim || !ballSug) return null;
  var s = toScreen(ballSug); if(Math.hypot(s.x - x, s.y - y) > 30) return null;
  var best = null, bd = 9; blocks.forEach(function(b){ if(b.dead || !b.rb || b.keep || b.anchor) return; var d = nearestPoint(b, ballSug, _cp).distanceTo(ballSug); if(d < bd){ bd = d; best = b; } });
  return best ? { block:best, point:ballSug.clone(), normal:new THREE.Vector3(Math.sin(ballYaw), 0, Math.cos(ballYaw)) } : null;
}
var B2_API = {
  sched:function(){ var o = {}; BOOST_ORDER.concat(["scan", "tnt1"]).forEach(function(k){ if(BOOST[k]) o[k] = { unlock:BOOST[k].unlock, hidden:!!BOOST[k].hidden, usable:bstUnlocked(k), seen:save.bseen ? save.bseen[k] || 0 : 0, stock:(save.bst || {})[k] || 0 }; }); return o; },
  grant:function(w){ return b2Grant(w || "api"); }, card:function(){ b2Card(); return !$("bNew").classList.contains("hidden"); },
  queue:function(){ return B2.cardQ.slice(); }, granted:function(){ return B2.granted.slice(); },
  pow:function(o){ if(o){ Object.keys(o).forEach(function(k){ if(typeof o[k] === "object" && BPOW[k] && typeof BPOW[k] === "object") Object.assign(BPOW[k], o[k]); else BPOW[k] = o[k]; }); } return JSON.parse(JSON.stringify(BPOW)); },
  hits:function(){ return B2S.hits.slice(); }, clearHits:function(){ B2S.hits.length = 0; },
  hand:function(){ bstHandLater(); return bstHandNext; }   // shots: the next-level pointer after a manual (harness) level start
};
// ---- end boosters2 block
