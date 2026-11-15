// ---- Sky Strike (boosters2 slot 3, Owner picked option B 11/11/2026; THIRD-BOOSTER.md) -----------------------------
// The VERTICAL booster (the Wrecking Ball is horizontal): tap Sky, tap a building. A shadow + target ring grow on the
// roof above that spot for SKY.mark s (whistle), then a heavy charge drops onto it and goes off top-down:
//   * shaft: every member within R of a vertical segment from the roof down `depth` m (2-4 storeys) takes
//     dmg x f(d) x family x member.dmg (armour as for TNT): a stacked heavy charge (~3 TNT at contact), so it can break a
//     steel band / deck or an RC pier it lands on (inside Rc), wood / brick / concrete around it;
//   * blast: a radial TNT-like burst at the impact point (radius blastR), ladder via hp/armour as TNT;
//   * drive: the impulse comes from above (origin over the roof), so the top storeys are crushed DOWN the shaft;
//   * shock: bonds near the shaft are loosened (as the Ball) and everything wakes.
// 1 booster = 1 strike, used in the plan phase (no wave; the rules run when it settles, as a Ball swing). Size by the
// level's TNT like the Ball: s = clamp(level TNT / 8, 0.4, 1). The protected building is never damaged or pushed by it.
// Deterministic: the drop is timed on game time, damage is nearest-first, no random term (visuals use their own random).
BOOST.sky = { name:"Sky Strike", short:"Strike", unlock:30, free:2, price:300, pack:3, pre:false, icon:"sky", line:"Drop it from the sky." };
B2.sched.sky = 30;
var SKY = { mark:0.75, dropFrom:28, fall:0.45,          // s of marker before impact; the charge falls the last `fall` s from dropFrom m up
  depth:7.5, Rc:1.4, R:3.2, dmg:780, falloff:0.9,      // shaft (scaled by s)
  blastR:4.4, blastDmg:300, blastImp:9000,              // radial burst at impact (scaled by s; dmg like 1.15 TNT)
  fam:{ timber:1.5, glass:2.0, brick:1.15, stone:1.0, concrete:1.0, rc:1.0, steel:1.0 },   // rc and steel: inside Rc only
  drive:11000, up:1.6, shockR:7.0, loosen:0.55, floor:0.4, steelShove:9000, steelBend:0.38, maxKill:80,
  settleMax:6, stop:0.13, fx:{ shake:1.1, kick:18, flash:0.3, dust:16 } };
var SKY_SVG = '<path d="M24 4v6M18 6l2 5M30 6l-2 5" stroke="#FFC633" stroke-width="3" stroke-linecap="round"/>' +
  '<path d="M17 14h14l-2 18c-.4 3-2.6 5-5 5s-4.6-2-5-5z" fill="#3B4252" stroke="#2B2140" stroke-width="3" stroke-linejoin="round"/>' +
  '<path d="M17 14l-4-4h22l-4 4" fill="#FF5A3C" stroke="#2B2140" stroke-width="3" stroke-linejoin="round"/>' +
  '<ellipse cx="24" cy="43" rx="13" ry="3" fill="#2B2140" opacity=".35"/><path d="M8 42h4M36 42h4" stroke="#FF5A3C" stroke-width="3" stroke-linecap="round"/>';
var skyArmed = false, skyLive = null, skyLast = null, SKYS = { strikes:0, refused:0, hits:[] }, SKYV = null;
function skyStats(){ return SKYS; }
function skyDisarm(){ if(skyArmed){ skyArmed = false; bstSync(); } }
function skyBtn(){
  if(skyLive) return;
  if(skyArmed){ skyDisarm(); return; }
  if(!bstHave("sky")){ bstBuyOpen("sky"); return; }
  if(ballAim) ballAimOff();
  if(selC) selectCharge(null);
  skyArmed = true; toast("Tap a building"); bstSync();
}
// the top of the building straight above (x, z): the highest live target member whose plan contains the point
function skyTop(x, z){
  var top = -1, tb = null;
  for(var i=0;i<blocks.length;i++){ var b = blocks[i]; if(b.dead || !b.rb || b.anchor || b.keep || b.prop || b.bonus) continue;
    _b2s.set(x, b.P.y, z); nearestPoint(b, _b2s, _b2a); if(Math.hypot(_b2a.x - x, _b2a.z - z) > 0.35) continue;
    var t = b.P.y + b.half[1]; if(t > top){ top = t; tb = b; } }
  return tb ? { y:top, b:tb } : null;
}
// tap while armed (hook at the top of bstTap): true = handled
function skyTap(x, y){
  if(!skyArmed || skyLive) return !!skyLive;
  var h = pick(x, y);
  if(!h || h.block.anchor || h.block.prop || h.block.bonus){ snd("ui_tap", { gain:0.4 }); toast("Tap a building"); return true; }
  skyStrike(h.block, h.point); return true;
}
function skyStrike(b, pt){
  if(phase !== "plan" || skyLive) return "busy";
  if(b.keep){ toast("Protected! Hands off."); snd("protected_hit"); pulseShields(b.P, 0.5); SKYS.refused++; return "protected"; }
  var tp = skyTop(pt.x, pt.z); if(!tp){ SKYS.refused++; return "none"; }
  bstUse("sky"); skyArmed = false; SKYS.strikes++;
  var P = new THREE.Vector3(pt.x, tp.y, pt.z);
  skyLast = skyLive = { t0:gameT, P:P, b:tp.b, hit:false, hitT:-1, stab:0, kill:0, st:null };
  if(!structureLive){ structureLive = true; liveT = 0; firstBlastT = gameT; }
  // levels6 (v10) freezes the world at rest in the plan phase (no fixedStep at all, so no gameT, no skyStep): a live strike
  // must run it, as a Wrecking Ball in flight does. Without this the marker waits forever: no drop, no damage, BLAST locked.
  if(typeof l6Frozen !== "undefined") l6Frozen = false;
  snd("ball_swing", { duration:SKY.mark + 0.1, intensity:0.8, pan:sndPan(P) });   // the whistle of the drop
  if(window.SFX && SFX.haptic) SFX.haptic("booster_arm", 1);
  bstSync(); syncHUD();
  return "ok";
}
function skySize(){ return b2Size(); }
// per fixed step (hook in bstStep): impact on game time, then wait for the building to settle and run the rules
function skyStep(){
  var w = skyLive; if(!w) return;
  if(!w.hit){ if(gameT - w.t0 >= SKY.mark - 1e-6) skyImpact(w); return; }
  w.stab = settled() ? w.stab + DT : 0;
  if(w.stab > 0.4 || gameT - w.hitT > SKY.settleMax) skyResolve(w);
}
function skyDist(b, P, D){   // distance from member b to the vertical shaft P .. P - (0, D, 0)
  var best = 1e9, n = Math.max(2, Math.ceil(D/0.5));
  for(var i=0;i<=n;i++){ _b2s.set(P.x, P.y - D*i/n, P.z); var d = nearestPoint(b, _b2s, _b2a).distanceTo(_b2s); if(d < best) best = d; }
  return best;
}
function skyImpact(w){
  var tB = performance.now(), s = skySize(), P = w.P, D = SKY.depth*s, Rc = SKY.Rc*s, R = SKY.R*s, BR_ = SKY.blastR*s, i, b;
  w.hit = true; w.hitT = gameT;
  var st = { t:+gameT.toFixed(3), s:+s.toFixed(3), kill:0, fam:{}, steel:0, loosened:0, top:+P.y.toFixed(2) };
  mfxBlastAt(P);
  var list = [];
  for(i=0;i<blocks.length;i++){ b = blocks[i]; if(b.dead || b.anchor || b.keep || b.prop || b.bonus || !b.rb) continue;
    if(Math.abs(b.P.x - P.x) > R + BR_ + 3 || Math.abs(b.P.z - P.z) > R + BR_ + 3 || b.P.y > P.y + BR_ + 3 || b.P.y < P.y - D - R - 3) continue;
    var ds = skyDist(b, P, D), db = nearestPoint(b, P, _b2a).distanceTo(P);
    if(ds < R || db < BR_) list.push({ b:b, d:ds, db:db }); }
  list.sort(function(x, y){ return Math.min(x.d, x.db) - Math.min(y.d, y.db) || blocks.indexOf(x.b) - blocks.indexOf(y.b); });
  var steelL = [];
  for(i=0;i<list.length && st.kill < SKY.maxKill;i++){ b = list[i].b; var fam = b2Fam(b), d = list[i].d;
    var f = d <= Rc ? 1 : d >= R ? 0 : Math.pow(1 - (d - Rc)/(R - Rc), SKY.falloff);
    var hard = fam === "steel" || fam === "rc" || b2Steel(b);
    var m = SKY.fam[fam] != null ? SKY.fam[fam] : 1, amt = 0;
    if(!hard || d <= Rc) amt += SKY.dmg*f*m*(b.def.dmg || 1);                                        // shaft
    if(list[i].db < BR_) amt += SKY.blastDmg*Math.pow(1 - list[i].db/BR_, 1.1)*(b.def.dmg || 1);       // radial burst (TNT-like)
    var was = b.dead; if(amt > 0) damage(b, amt, false, "blast");
    if(!was && b.dead){ st.kill++; st.fam[fam] = (st.fam[fam] || 0) + 1; }
    else if(!b.dead){ if((fam === "steel" || b2Steel(b)) && d < R) steelL.push(list[i]); else if(typeof mfxBlastHit === "function") mfxBlastHit(b, P, f); }
  }
  for(i=0;i<steelL.length;i++){ b = steelL[i].b; if(b.dead || !b.rb) continue; st.steel++;
    var k = 1 - steelL[i].d/R, J = SKY.steelShove*s*k*Math.min(1, b.mass/1500);
    nearestPoint(b, P, _b2a); _b2s.copy(_b2a).sub(P).setY(0); if(_b2s.lengthSq() < 1e-6) _b2s.set(1, 0, 0); _b2s.normalize();
    b.rb.applyImpulseAtPoint({ x:_b2s.x*J*0.5, y:-J, z:_b2s.z*J*0.5 }, { x:_b2a.x, y:_b2a.y, z:_b2a.z }, true);
    if(typeof mfxBend === "function") mfxBend(b, new THREE.Vector3(0, -1, 0).add(_b2s), SKY.steelBend*(0.4 + 0.6*k));
  }
  // loosen bonds round the shaft (as the Ball), wake everything
  var mid = P.clone().setY(P.y - D/2), shR = SKY.shockR*Math.max(0.6, s);
  for(i=0;i<links.length;i++){ var l = links[i]; if(!l.alive || l.a.keep || l.b.keep) continue;
    var dd = Math.min(l.a.anchor ? 1e9 : l.a.P.distanceTo(mid), l.b.anchor ? 1e9 : l.b.P.distanceTo(mid)); if(dd >= shR) continue;
    var kk = Math.max(SKY.floor, SKY.loosen + (1 - SKY.loosen)*dd/shR); if(!l.cap0) l.cap0 = l.cap;
    if(kk >= (l.capK || 1)) continue; l.capK = kk; l.cap = { t:l.cap0.t*kk, c:l.cap0.c*kk, s:l.cap0.s*kk, m:l.cap0.m*kk }; st.loosened++; }
  wakeAll();
  // drive from above: radial from a point over the roof = down the shaft, outward at the top; + the burst
  var o = P.clone().setY(P.y + SKY.up*s), def = { kind:"std" }, Rd = D + SKY.up*s;
  for(i=0;i<blocks.length;i++){ b = blocks[i]; if(b.anchor || b.keep || (b.dead && !b.rubble) || (b2Steel(b) && !b.dead)) continue;
    pushBody(b, o, SKY.drive*(0.5 + 0.5*s), Rd, def, null); pushBody(b, P, SKY.blastImp*(0.5 + 0.5*s), BR_, def, null); }
  for(i=0;i<frags.length;i++){ if(frags[i].keep) continue; pushBody(frags[i], o, SKY.drive*(0.5 + 0.5*s), Rd, def, null); }
  // feel (feel.* respects Reduce motion)
  var F = SKY.fx; feel.shake(F.shake); feel.kick(F.kick); feel.hitstop(SKY.stop*1000); screenFlash(F.flash);
  if(!manual && !REDUCED) passSlow = Math.max(passSlow, 0.3);
  fxFlash(P, 2.6*(0.6 + 0.4*s)); fxRing(P, 3.2*s + 1, 0xFFE9B0); fxRing(new THREE.Vector3(P.x, Math.max(0.6, P.y - D*0.5), P.z), shR*0.6, 0xE8D8B8);
  var pn = typeof PX === "object" ? PX.cnt(F.dust) : F.dust;
  jPuffs(P, pn, 2.8); jPuffs(mid, Math.ceil(pn/2), 2.4);
  for(i=0;i<8;i++){ var a = i*Math.PI/4; jPuffs(new THREE.Vector3(P.x + Math.cos(a)*3.2*s, Math.max(0.5, P.y - 0.5), P.z + Math.sin(a)*3.2*s), 1, 2.0); }
  if(typeof mfxPx === "function") jChips(P, jMatOf(w.b), mfxPx(12));
  snd("boom_tnt", { intensity:1, pan:sndPan(P) }); snd("debris", { mass:3, intensity:1.3, pan:sndPan(P) }); snd("pancake", { index:0, intensity:1 }); snd("concrete_crack", { intensity:1, pan:sndPan(P) });
  if(window.SFX && SFX.haptic) SFX.haptic("boom_cutter", 1);
  comboEvent("STRIKE!");
  st.ms = +(performance.now() - tB).toFixed(2); w.kill = st.kill; w.st = st;
  SKYS.hits.push(st); if(SKYS.hits.length > 40) SKYS.hits.shift();
}
function skyResolve(w){
  skyLive = null;
  if(phase === "plan" && !noFinish && typeof l6RestStart === "function") l6RestStart();   // levels6: settle to the canonical rest (as after a wave), then freeze again
  if(phase === "plan" && !manual) updateLiveHUD();
  var v = verdict();
  if(phase === "plan" && (v.ok || v.code === "collateral" || v.code === "street")){ finish(); return; }
  bstSync(); syncHUD();
}
// visuals per rendered frame: a shadow + red target ring grow on the roof, the charge falls the last SKY.fall s
function skyFrame(rdt){
  var w = skyLive && !skyLive.hit ? skyLive : null;
  if(!SKYV){ if(!w) return;
    var blob = ballCanvas(64, 64, function(g, W){ var r = g.createRadialGradient(W/2, W/2, 0, W/2, W/2, W/2); r.addColorStop(0, "rgba(0,0,0,.85)"); r.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = r; g.fillRect(0, 0, W, W); });
    var ring = ballCanvas(128, 128, function(g, W){ g.lineWidth = 9; g.strokeStyle = "rgba(255,90,60,1)"; g.beginPath(); g.arc(W/2, W/2, W*0.4, 0, 6.3); g.stroke();
      g.lineWidth = 6; g.beginPath(); g.moveTo(W/2, W*0.05); g.lineTo(W/2, W*0.3); g.moveTo(W/2, W*0.7); g.lineTo(W/2, W*0.95); g.moveTo(W*0.05, W/2); g.lineTo(W*0.3, W/2); g.moveTo(W*0.7, W/2); g.lineTo(W*0.95, W/2); g.stroke(); });
    function flat(t, op){ var m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map:t, transparent:true, opacity:op, depthWrite:false, depthTest:false })); m.rotation.x = -Math.PI/2; m.renderOrder = 6; m.visible = false; scene.add(m); return m; }
    var bomb = new THREE.Group(), dk = new THREE.MeshLambertMaterial({ color:lin(0x3B4252) }), rd = new THREE.MeshLambertMaterial({ color:lin(0xFF5A3C) });
    var body = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 1.3, 16), dk); bomb.add(body);
    var nose = new THREE.Mesh(new THREE.SphereGeometry(0.42, 16, 10, 0, 6.3, Math.PI/2, Math.PI/2), dk); nose.position.y = -0.65; bomb.add(nose);
    for(var k=0;k<4;k++){ var fin = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.5, 0.5), rd); fin.position.set(0, 0.75, 0); fin.rotation.y = k*Math.PI/4; bomb.add(fin); }
    var band = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.16, 16), rd); band.position.y = 0.3; bomb.add(band);
    bomb.visible = false; scene.add(bomb);
    SKYV = { shadow:flat(blob, 0.6), ring:flat(ring, 0.95), bomb:bomb };
  }
  if(!w){ SKYV.shadow.visible = SKYV.ring.visible = SKYV.bomb.visible = false; return; }
  var t = Math.max(0, Math.min(1, (gameT - w.t0)/SKY.mark)), s = skySize(), P = w.P;
  SKYV.shadow.visible = SKYV.ring.visible = true;
  SKYV.shadow.position.set(P.x, P.y + 0.06, P.z); SKYV.shadow.scale.setScalar((0.6 + 2.6*t)*(0.6 + 0.4*s));
  // the target ring faces the camera (a flat ring on a high roof is edge-on from the low game camera), just over the roof
  SKYV.ring.position.set(P.x, P.y + 1.0, P.z); SKYV.ring.quaternion.copy(camera.quaternion); SKYV.ring.rotateZ(t*1.2); SKYV.ring.scale.setScalar((4.2 - 1.8*t)*(0.6 + 0.4*s));
  SKYV.ring.material.opacity = 0.6 + 0.35*Math.abs(Math.sin(t*14));
  var tf = (gameT - w.t0) - (SKY.mark - SKY.fall);
  SKYV.bomb.visible = tf > 0;
  if(tf > 0){ var k2 = Math.min(1, tf/SKY.fall); SKYV.bomb.position.set(P.x, P.y + 0.65 + SKY.dropFrom*(1 - k2*k2), P.z); SKYV.bomb.scale.setScalar(0.7 + 0.3*s); }
  shadowDirty = true;
}
function skyReset(){ skyArmed = false; skyLive = null; if(SKYV){ SKYV.shadow.visible = SKYV.ring.visible = SKYV.bomb.visible = false; } }
var SKY_API = {
  // strike member i at the column through its centre (x, z): the charge lands on the roof above it
  at:function(i, dx, dz){ var b = blocks[i]; if(!b) return "none"; if(!bstHave("sky")) bstSave().sky = 1; skyArmed = true;
    return skyStrike(b, new THREE.Vector3(b.P.x + (dx || 0), b.P.y, b.P.z + (dz || 0))); },
  atXZ:function(x, z){ var tp = skyTop(x, z); if(!tp) return "none"; if(!bstHave("sky")) bstSave().sky = 1; skyArmed = true; return skyStrike(tp.b, new THREE.Vector3(x, tp.y, z)); },
  top:function(x, z){ var tp = skyTop(x, z); return tp ? { y:tp.y, i:blocks.indexOf(tp.b), key:tp.b.key } : null; },
  settle:function(maxSec){ var t = 0; while(skyLive && t < (maxSec || 10)){ fixedStep(); t += DT; } return { phase:phase, verdict:verdict(), pct:score() }; },
  live:function(){ var w = skyLive || skyLast; return w ? { t0:w.t0, hit:w.hit, hitT:w.hitT, P:w.P.toArray(), kill:w.kill, st:w.st } : null; },
  armed:function(){ return skyArmed; }, stats:function(){ return { strikes:SKYS.strikes, refused:SKYS.refused, hits:SKYS.hits.slice() }; },
  tune:function(o){ if(o) Object.keys(o).forEach(function(k){ if(typeof o[k] === "object" && SKY[k]) Object.assign(SKY[k], o[k]); else SKY[k] = o[k]; }); return JSON.parse(JSON.stringify(SKY)); }
};
// ---- end Sky Strike
