// ---- levels6 v15 BASE (14/11/2026; Owner "đế trụ khó đổ", D-blast-MATCURVE): a per-building BASE TYPE setting read from level data.
// Main build step `base` (levels6/tools/src-base.js): appended inside main() after the last v15 batch block, before glue-final.
// Level data: L1-5 in patch/v15-a1.js (set(...) base:), L6-12 in tools/src-l1-12.js (base:). Report: levels6/BASE-STATUS.md. Calls nothing new in the engine:
// wraps startLevel + failMember, uses later() (game time: deterministic, R-11).
//
// WHY (BASE-STATUS.md §1): a ground pier dies from ONE TNT on wood / brick / concrete (the ladder works), but the BUILDING does not
// react: the frame's bonds carry a lost corner as a cantilever, and the scripted rules (A1/v14 tip, v14 storey ring, B1 hall) say
// "one lost pier never drops it". So the player breaks a pier and sees nothing move.
//
// THE SETTING. Level data (any batch, or the material-curve plan) sets per building id:
//   L.base = { "<bid>": spec, "*": spec }            (missing = the builder's own behaviour, unchanged)
//   spec   = { rule:"tip"|"ring"|"keep"|"none", n:1|2, hold:<s>, pierTnt:<k>, sag:0|1, shove:<m/s> }  or a preset name (BASE.PRESET)
//     rule  tip  : n ground piers lost (n = 2: two NEIGHBOURS) -> the near half of the ground storey on that side gives way in order,
//                  the middle line 0.4 s later, the far line is a hinge for `hold` s (not crushable): it falls TOWARDS the lost side.
//           ring : n lost -> every ground pier crushes (straight drop, STD-v1 storey rule, any footprint).
//           keep : the builder's own rule (A1 tip, v14 ring, B1 hall, A2 feet) untouched.     none: physics only (old rules removed).
//     n       1 = "one pier gone and it goes that way" (weak base) · 2 = two on one side (stiff base)
//     reach   n = 2: how far apart (in pier gaps) the two lost piers may be (1.6 = neighbours only, 2.6 = one pier between them)
//     pierTnt TNT that one ground pier takes in one blast (sets its hp from M14.api.perTnt); omitted = its ladder material.
//     sag     with n = 2: the FIRST lost pier already shows it (the skin panels next to it fail, dust): "it moved, hit more there".
//     shove   one-off push of the floors over the ground storey towards the lost side (m/s, 0.45 s) for a low wide frame.
//   BASE.PRESET: "weak" = tip n1 · "stiff" = tip n2 + sag · "crush" = ring n2 · "rc" = keep (the RC tier's own storey rule).
//   ?base=0 = the setting is ignored (old behaviour) · ?base=<preset> = that preset on every non-RC target building (probe).
//   Only ground storeys of the ladder (wpost / bk / concrete) take a rule; steel, lattice, ladder "rc" and RC (hrc) bases are left
//   alone unless spec.force.
// Test API: window.__blast.base = { info(), spec(bid) }.
var BASE = { on:true, R:[] };
(function(){
  var QB = new URLSearchParams(location.search), Q = QB.get("base");
  BASE.on = Q !== "0";
  BASE.PRESET = { weak:{ rule:"tip", n:1, hold:0 }, "weak-tip":{ rule:"tip", n:1, hold:2.5 }, stiff:{ rule:"tip", n:2, reach:2.6, hold:0, sag:1 }, "stiff-tip":{ rule:"tip", n:2, reach:2.6, hold:2.5, sag:1 }, crush:{ rule:"ring", n:2 }, rc:{ rule:"keep" }, keep:{ rule:"keep" }, none:{ rule:"none" } };
  var spec = function(s){ if(!s) return null; if(typeof s === "string") return BASE.PRESET[s] ? Object.assign({}, BASE.PRESET[s]) : null; if(s.preset) return Object.assign({}, BASE.PRESET[s.preset], s); return s; };
  var LADDER = { wpost:1, bk:1, concrete:1 };   // the ladder keys a base rule acts on (wood, brick, plain concrete)
  var WALLK = /glass|pan|wall|bkw|wwall|cpan|door|sign|tank|roof/;
  var upright = function(b){ return !b.anchor && !b.prop && !b.keep && b.rb && b.half[1] > 0.8 && b.half[1] > 1.4*Math.max(b.half[0], b.half[2]) && !WALLK.test(b.key); };
  var dust1 = function(q){ if(!manual) dust(q.P, 2, 1.4, 0xBDB8AE); };
  // one building's ground storey -> the ring record G
  var setup = function(bid, sp){
    var mine = blocks.filter(function(b){ return b.bid === bid && !b.anchor && !b.prop && !b.keep && b.rb; }); if(!mine.length) return null;
    var up = mine.filter(upright); if(!up.length) return null;
    var f0 = Math.min.apply(null, up.map(function(b){ return b.floor; })), P = up.filter(function(b){ return b.floor === f0; });
    if(P.some(function(b){ return b.key === "hrc" || b.key === "mdeck"; }) && sp.rule !== "none" && !sp.force) return null;   // the RC tier keeps its own rule
    if(!sp.force && sp.rule !== "keep" && P.filter(function(b){ return LADDER[b.key]; }).length*2 < P.length) return null;   // steel / lattice / ladder "rc" bases keep their own physics (MATERIAL-CURVE: stack on steel)
    var cx = 0, cz = 0; P.forEach(function(b){ cx += b.spawn.x; cz += b.spawn.z; }); cx /= P.length; cz /= P.length;
    var hx = 0.01, hz = 0.01; P.forEach(function(b){ hx = Math.max(hx, Math.abs(b.spawn.x - cx)); hz = Math.max(hz, Math.abs(b.spawn.z - cz)); });
    var sp0 = 1e9; P.forEach(function(a){ P.forEach(function(b){ if(a !== b) sp0 = Math.min(sp0, Math.hypot(a.spawn.x - b.spawn.x, a.spawn.z - b.spawn.z)); }); });
    var G = { bid:bid, sp:sp, piers:P, f0:f0, c:[cx, cz], h:[hx, hz], gap:sp0, done:false, firstT:-1,
      skin:mine.filter(function(b){ return b.floor === f0 && !upright(b) && b.half[1] > 0.8; }),
      decks:mine.filter(function(b){ return b.floor === f0 && b.half[1] < 0.6 && b.spawn.y > P[0].spawn.y; }) };
    // a hero that already carries the v14 tip rule (A1 / A2 towers: its hinge and its own onTip follow-up) keeps it: this setting then only
    // decides WHEN it fires (n, reach) by breaking the pier that completes the pair ("via" mode)
    var tagged = P.filter(function(b){ return b.m14tip; })[0]; if(sp.rule === "tip" && tagged && !sp.own) G.via = tagged.m14tip;
    else if(sp.rule !== "keep") P.forEach(function(b){ delete b.m14tip; delete b.m14ring; delete b.b1h; delete b.a2foot; });
    P.forEach(function(b){ b.baseG = G; });
    if(sp.pierTnt){ P.forEach(function(b){ var per = M14.api.perTnt(b); b.hp = b.hp0 = Math.max(1, per*(sp.pierTnt - 1) + per*0.6); }); }
    return G; };
  var touches = function(w, q){ return Math.abs(w.spawn.x - q.spawn.x) < w.half[0] + q.half[0] + 0.3 && Math.abs(w.spawn.z - q.spawn.z) < w.half[2] + q.half[2] + 0.3 && Math.abs(w.spawn.y - q.spawn.y) < w.half[1] + q.half[1]; };
  var fm0 = failMember;
  // which way a lost pier pushes: the side its TNT sat on (nearest fired charge within 2.5 m), else away from the centre
  var sideOf = function(b, G){ var best = null, bd = 2.5; charges.forEach(function(c){ if(!c.fired || !c.mesh) return; var d = c.mesh.position.distanceTo(b.P); if(d < bd){ bd = d; best = c; } });
    var ox = b.spawn.x - G.c[0], oz = b.spawn.z - G.c[1]; if(best){ var dx = best.mesh.position.x - b.P.x, dz = best.mesh.position.z - b.P.z; if(Math.hypot(dx, dz) > 0.05){ ox = dx; oz = dz; } } return [ox, oz]; };
  var viaGo = function(G, b, other){ G.done = true; G.t = gameT; var R = G.via, t = b.m14tk, at = function(k){ return R.list.filter(function(q){ return q.m14tk === (k + 8) % 8 && !q.dead; })[0]; }, q = null;
    if(other){ var d = ((other.m14tk - t) + 8) % 8; q = at(d === 2 ? t + 1 : t - 1); }
    else { var o = sideOf(b, G), ang = Math.atan2(o[1], o[0]), dif = function(k){ var a = k*Math.PI/4 - ang; return Math.abs(Math.atan2(Math.sin(a), Math.cos(a))); };
      if(t % 2 === 0) q = dif(t + 1) <= dif(t - 1) ? (at(t + 1) || at(t - 1)) : (at(t - 1) || at(t + 1));
      else { var m = dif(t + 1) <= dif(t - 1) ? t + 1 : t - 1; q = at(m) || at(2*t - m); } }
    if(q){ dust1(q); failMember(q, "crush"); } };
  var go = function(G, lost){
    G.done = true; var sp = G.sp, mx = 0, mz = 0;
    lost.forEach(function(b){ mx += (b.spawn.x - G.c[0])/G.h[0]; mz += (b.spawn.z - G.c[1])/G.h[1]; });
    if(lost.length === 1 && Math.abs(Math.abs(mx) - Math.abs(mz)) < 0.25){ var o = sideOf(lost[0], G); mx = o[0]/G.h[0]; mz = o[1]/G.h[1]; }   // a corner: the side its TNT was on
    var X = Math.abs(mx) >= Math.abs(mz), sg = Math.sign(X ? mx : mz) || 1, u = function(b){ return sg*(X ? (b.spawn.x - G.c[0])/G.h[0] : (b.spawn.z - G.c[1])/G.h[1]); };
    G.dir = [X ? sg : 0, X ? 0 : sg]; G.t = gameT;
    if(sp.rule === "ring"){ G.piers.slice().sort(function(a, b){ return u(b) - u(a); }).forEach(function(q, k){ later(0.1 + 0.08*k, function(){ if(!q.dead){ dust1(q); fm0(q, "crush"); } }); }); return; }
    var near = G.piers.filter(function(b){ return u(b) > 0.35; }).sort(function(a, b){ return u(b) - u(a); }),
        mid = G.piers.filter(function(b){ var v = u(b); return v <= 0.35 && v >= -0.35; }), far = G.piers.filter(function(b){ return u(b) < -0.35; });
    G.far = far; G.hold = sp.hold || 0;
    near.forEach(function(q, k){ later(0.15 + 0.06*k, function(){ if(q.dead) return; dust1(q); fm0(q, "crush"); G.skin.forEach(function(w){ if(!w.dead && touches(w, q)) fm0(w, "crush"); }); }); });
    later(0.4, function(){ mid.forEach(function(q){ if(!q.dead){ dust1(q); fm0(q, "crush"); } }); });
    if(!G.hold) later(0.7, function(){ far.forEach(function(q){ if(!q.dead) fm0(q, "crush"); }); });
    later(Math.max(G.hold, 0.7) + 2.5, function(){ if(G.decks.some(function(d){ return !d.dead && standing(d); })) return; G.piers.concat(G.skin).forEach(function(q){ if(!q.dead) fm0(q, "crush"); }); });   // no stubs: what stands with no floor over it goes
    if(sp.shove) later(0.2, function(){ G.decks.forEach(function(d){ if(d.dead || !d.rb) return; var v = d.rb.linvel(); d.rb.setLinvel({ x:v.x + G.dir[0]*sp.shove, y:v.y, z:v.z + G.dir[1]*sp.shove }, true); }); });
  };
  failMember = function(b, cause){ var G = b.baseG;
    if(G && G.done && G.hold && !b.dead && (cause === "crush" || cause === "impact") && gameT < G.t + G.hold && G.far && G.far.indexOf(b) >= 0) return;   // the hinge holds
    var was = b.dead, r = fm0.apply(this, arguments); if(was || !G || G.done || !b.dead) return r;
    var sp = G.sp; if(sp.rule === "keep" || sp.rule === "none") return r;
    var lost = G.piers.filter(function(q){ return q.dead; }), n = sp.n || 2;
    if(G.via && b.m14tip !== G.via) return r;
    if(n <= 1){ if(G.via) viaGo(G, b); else go(G, [b]); return r; }
    var pair = lost.filter(function(q){ return q !== b && Math.hypot(q.spawn.x - b.spawn.x, q.spawn.z - b.spawn.z) <= (sp.reach || 1.6)*G.gap; });
    if(pair.length){ if(G.via){ var d = ((pair[0].m14tk - b.m14tk) + 8) % 8; if(d === 1 || d === 7){ G.done = true; return r; } viaGo(G, b, pair[0]); } else go(G, [b, pair[0]]); return r; }
    if(sp.sag && G.firstT < 0){ G.firstT = gameT; G.skin.forEach(function(w){ if(!w.dead && touches(w, b)){ dust1(w); fm0(w, "crush"); } }); }
    return r; };
  var sl0 = startLevel;
  startLevel = function(){ var r = sl0.apply(this, arguments); BASE.R = [];
    if(!BASE.on) return r;
    var map = L.base || null, all = BASE.PRESET[Q] ? Q : null; if(!map && !all) return r;
    var ids = {}; blocks.forEach(function(b){ if(b.bid != null && !b.keep && !b.anchor) ids[b.bid] = 1; });
    Object.keys(ids).sort().forEach(function(id){ var sp = spec(all || (map && (map[id] || map["*"]))); if(!sp) return; var G = setup(id, sp); if(G) BASE.R.push(G); });
    return r; };
  window.__blast = window.__blast || {};
  window.__blast.base = { info:function(){ return BASE.R.map(function(G){ return { bid:G.bid, rule:G.sp.rule, n:G.sp.n, piers:G.piers.length, f0:G.f0, gap:+G.gap.toFixed(2), done:G.done, dir:G.dir || null }; }); },
    spec:function(bid){ var G = BASE.R.filter(function(q){ return q.bid === bid; })[0]; return G ? G.sp : null; } };
})();
// ---- end levels6 v15 BASE
