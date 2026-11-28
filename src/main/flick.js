  // ---- main/flick.js (FLICK-1128, Khai 28/11 "nó bị chớp, asset không rõ ràng", L34 shot). Appended LAST inside main() (after fps).
  // Render only: no body, bond, pose or rule changes (physprof hashes unchanged). Numbers: city-blast/levels-gd/FLICK-1128/FLICK-1128.md.
  // C1 coplanar decor faces. A decor piece (L6_KD box riding on a member) whose face lies in the SAME plane as a member's face or another
  //    decor piece's face (same axis, same outward side, |gap| < 4 mm, overlapping) z-fights: the two colours swap in stripes that crawl as the
  //    camera sways (L34 Glass Spine: the podium's white roof rim vs the orange decks, an exact tie at y = 9.2 m). At level build each such
  //    decor face is moved by E = 1.5 cm so one surface wins every pixel: a decor face that lies INSIDE the other face (a panel, a stripe on it)
  //    is pushed out (it stays visible, as designed); a decor face that is LARGER than / sticks out of the other (a rim, a band round a deck) is
  //    pulled in (the member shows on top, the rim still frames it). Two decor faces: the smaller one comes out. Only axis-aligned boxes
  //    (no tilt), only pieces that are drawn (hidden damage marks keep their sizes). 1.5 cm = 0.2 px at the hard-level distance. ?flickcp=0
  // C2 depth precision. The camera's near plane was a fixed 0.5 m for a camera 8-260 m from the lot (L34: 172 m), so the 24-bit depth
  //    buffer resolved ~3.5 mm there and any two surfaces closer than that fought. The near plane now follows the camera:
  //    near = clamp(4 % of the distance to the focus, 0.5, 6) m, never more than half the camera's height (ground in view). The nearest thing
  //    the camera may see is the clearance pad (>= 3 m to any neighbour) and the ground (>= ~1.6 x its height away): nothing is clipped.
  //    L34: 0.5 -> 6 m, 12x the depth resolution. ?flicknear=0
  // ?flick=0 = both off.
  (function(){
    var Qk = new URLSearchParams(location.search), OFFK = Qk.get("flick") === "0", PFk = window.__blastPerf || (window.__blastPerf = {});
    var FK = PFk.flick = { on:!OFFK, cp:0, cpOut:0, cpIn:0, near:camera.near, ms:0 };
    if(OFFK) return;
    // ---- C1
    if(Qk.get("flickcp") !== "0"){
      var E = 0.015, TOL = 0.004, QT = 1e-3;
      var flat = function(q){ return Math.abs(q.x) < QT && Math.abs(q.y) < QT && Math.abs(q.z) < QT; };
      var boxGeo = function(p){ var m = p.im; return !!(m && m.geometry && m.geometry.type === "BoxGeometry"); };
      var cpFix = function(){
        var t0 = performance.now(), bins = new Map(), faces = [], i, a, s;
        var key = function(ax, sg, c){ return ax*2 + (sg > 0 ? 1 : 0) + "|" + Math.round(c/0.01); };
        // a face: axis ax, side sg, plane c, in-plane rect (u0, u1, v0, v1), owner (member or decor piece)
        var addBox = function(cx, cy, cz, hx, hy, hz, own, kdP){
          var C = [cx, cy, cz], Hh = [hx, hy, hz];
          for(a = 0; a < 3; a++) for(s = -1; s <= 1; s += 2){
            var u = (a + 1) % 3, v = (a + 2) % 3, f = { ax:a, sg:s, c:C[a] + s*Hh[a], u0:C[u] - Hh[u], u1:C[u] + Hh[u], v0:C[v] - Hh[v], v1:C[v] + Hh[v], own:own, kd:kdP };
            f.id = faces.length; faces.push(f); var k = key(a, s, f.c), L0 = bins.get(k); if(L0) L0.push(f); else bins.set(k, [f]); } };
        for(i = 0; i < blocks.length; i++){ var b = blocks[i]; if(!b.half || b.key === "tank" || (b.dead && !b.rubble)) continue;
          if(b.Q && !flat(b.Q)) continue;
          addBox(b.spawn.x, b.spawn.y, b.spawn.z, b.half[0], b.half[1], b.half[2], b, null);
          if(b.kd) for(var j = 0; j < b.kd.length; j++){ var p = b.kd[j]; if(!p.im || p.m14 || !boxGeo(p) || !flat(p.q) || !(p.s.x > 0 && p.s.y > 0 && p.s.z > 0)) continue;
            addBox(b.spawn.x + p.o.x, b.spawn.y + p.o.y, b.spawn.z + p.o.z, p.s.x/2, p.s.y/2, p.s.z/2, b, p); } }
        var moves = new Map();   // decor piece -> list of [axis, side, delta]
        var mv = function(p, ax, sg, d){ var l = moves.get(p); if(!l) moves.set(p, l = []); for(var q = 0; q < l.length; q++) if(l[q][0] === ax && l[q][1] === sg) return; l.push([ax, sg, d]); };
        faces.forEach(function(f){
          if(!f.kd) return;
          for(var dc = -1; dc <= 1; dc++){ var L1 = bins.get(f.ax*2 + (f.sg > 0 ? 1 : 0) + "|" + (Math.round(f.c/0.01) + dc)); if(!L1) continue;
            for(var n = 0; n < L1.length; n++){ var g = L1[n]; if(g === f || g.kd === f.kd || Math.abs(g.c - f.c) > TOL) continue;
              if(g.kd && g.kd.c === f.kd.c && g.kd.im === f.kd.im) continue;   // same colour, same mesh: no visible fight
              var ou = Math.min(f.u1, g.u1) - Math.max(f.u0, g.u0), ov = Math.min(f.v1, g.v1) - Math.max(f.v0, g.v0);
              if(ou <= 0.005 || ov <= 0.005) continue;
              var inside = f.u0 >= g.u0 - TOL && f.u1 <= g.u1 + TOL && f.v0 >= g.v0 - TOL && f.v1 <= g.v1 + TOL;
              if(g.kd){   // decor vs decor: the smaller face comes out (ties: the later piece)
                var af = (f.u1 - f.u0)*(f.v1 - f.v0), ag = (g.u1 - g.u0)*(g.v1 - g.v0);
                if(af < ag - 1e-6 || (Math.abs(af - ag) <= 1e-6 && f.id > g.id)) mv(f.kd, f.ax, f.sg, E);
              } else mv(f.kd, f.ax, f.sg, inside ? E : -E);
            } } });
        moves.forEach(function(l, p){
          l.forEach(function(m){ var ax = m[0], sg = m[1], d = m[2], comp = ax === 0 ? "x" : ax === 1 ? "y" : "z";
            if(d < 0 && p.s[comp] + d < p.s[comp]*0.5) return;   // never thin a piece by more than half
            p.s[comp] += d; p.o[comp] += sg*d/2; FK.cp++; if(d > 0) FK.cpOut++; else FK.cpIn++; }); });
        if(moves.size) blocks.forEach(function(b){ if(b.kd) l6KdWrite(b, b.P, b.Q); });
        FK.ms = +(performance.now() - t0).toFixed(1);
      };
      var kbK = l6KdBuild;
      l6KdBuild = function(){ var r = kbK.apply(this, arguments); try{ FK.cp = FK.cpOut = FK.cpIn = 0; cpFix(); }catch(e){ FK.err = e.message; } return r; };
    }
    // ---- C2
    if(Qk.get("flicknear") !== "0"){
      var _fp = new THREE.Vector3(), N0 = camera.near;
      var ucK = updateCamera;
      updateCamera = function(){
        var r = ucK.apply(this, arguments);
        _fp.set(focus.x, camFocusY, focus.z);
        var d = camera.position.distanceTo(_fp), nr = Math.max(N0, Math.min(6, d*0.04, Math.max(N0, camera.position.y*0.5)));
        if(Math.abs(nr - camera.near) > 0.01*camera.near){ camera.near = nr; camera.updateProjectionMatrix(); }
        FK.near = camera.near; return r;
      };
    }
  })();
  // ---- end main/flick.js
