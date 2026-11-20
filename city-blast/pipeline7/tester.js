// pipeline7 tester (runs inside the game page). window.P7.* returns plain JSON.
(function(){
  const T = () => __blast.test, INF = () => __blast.lv7.info(), LV = () => __blast.lv7.L();
  const HARD = new Set(['rc', 'rcs', 'core', 'steel', 'sdeck', 'tdeck', 'truss', 'hard7', 'hard7s', 'hard7v', 'hard7e', 'hard7i', 'drum7']);
  const isHard = b => HARD.has(b.key) || b.ar >= 0.5;
  const tgt = b => !b.an && !b.kp && b.key !== 'plinth7' && !b.rack;
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const fresh = (idx, seed) => { T().play(idx, seed || 1); T().run(6); __blast.lv7.syncDraw(); };
  const massStanding = () => { const B = INF().filter(tgt); const tot = B.reduce((a, b) => a + b.m, 0); const st = B.filter(b => b.st).reduce((a, b) => a + b.m, 0); return { tot, st, collapse: 1 - st / tot }; };

  // ---- structure metrics, measured on the built level (the SF metric table, the same columns) -------------------
  function metrics(idx){
    fresh(idx);
    const B = INF().filter(tgt), A = B.filter(b => b.bid === 'A');
    const hardA = A.filter(isHard), softA = A.filter(b => !isHard(b));
    const y0 = Math.min(...A.map(b => b.sy - b.h)), y1 = Math.max(...A.map(b => b.sy + b.h));
    const x0 = Math.min(...A.map(b => b.sx)), x1 = Math.max(...A.map(b => b.sx)), z0 = Math.min(...A.map(b => b.sz)), z1 = Math.max(...A.map(b => b.sz));
    const pos = { top: 0, mid: 0, bottom: 0, edge: 0, core: 0, front: 0, back: 0 };
    hardA.forEach(b => { const ry = (b.sy - y0) / Math.max(0.1, y1 - y0); pos[ry > 0.66 ? 'top' : ry < 0.34 ? 'bottom' : 'mid']++;
      const ex = b.sx < x0 + 0.8 || b.sx > x1 - 0.8, ez = b.sz < z0 + 0.8 || b.sz > z1 - 0.8; pos[ex || ez ? 'edge' : 'core']++;
      if(b.sz > z1 - 0.8) pos.front++; if(b.sz < z0 + 0.8) pos.back++; });
    const cols = A.filter(b => b.h > 0.8 && !/wall|bkw|cpan|wwall|glass/.test(b.key));
    const rows = [...new Set(cols.map(b => Math.round(b.sz * 2) / 2))].sort((a, b) => b - a);
    const hardFloors = [...new Set(hardA.map(b => b.f))].length;
    const parts = [...new Set(B.map(b => b.bid))];
    const allHard = B.filter(isHard).length;
    return { members: B.length, hard: allHard, soft: B.length - allHard, hardPct: Math.round(100 * allHard / B.length),
      main: { members: A.length, hard: hardA.length, soft: softA.length, hardPct: Math.round(100 * hardA.length / Math.max(1, A.length)), pos,
        core: pos.core > 0 ? 'yes' : 'no', hardLayers: hardFloors, depthRows: rows.length, frontHard: pos.front, backHard: pos.back, floors: [...new Set(A.map(b => b.f))].length },
      stacks: parts.length, parts };
  }

  // ---- the one-bomb exploit: the best single TNT a player could find (on the lower storeys of every part) ---------
  function oneBomb(idx, n){
    fresh(idx);
    const B = INF().filter(b => tgt(b) && (b.h > 0.8 || b.loose7) && b.st), byPart = {};
    B.forEach(b => (byPart[b.bid] = byPart[b.bid] || []).push(b));
    const cands = [];
    Object.values(byPart).forEach(list => {
      const fmin = Math.min(...list.map(b => b.f)), low = list.filter(b => b.f <= fmin + 1).sort((a, b) => (a.f - b.f) || (a.sx - b.sx) || (a.sz - b.sz));
      const k = Math.min(low.length, Math.ceil((n || 18) / Object.keys(byPart).length));
      for(let q = 0; q < k; q++) cands.push(low[Math.floor((q + 0.5) * low.length / k)]);
    });
    let best = { pct: -1 };
    for(const c of cands){
      fresh(idx);
      const all = INF().filter(tgt), cx = all.filter(b => b.bid === c.bid).reduce((a, b) => a + b.sx, 0) / all.filter(b => b.bid === c.bid).length;
      const cz = all.filter(b => b.bid === c.bid).reduce((a, b) => a + b.sz, 0) / all.filter(b => b.bid === c.bid).length;
      const dx = c.sx - cx, dz = c.sz - cz, nx = Math.abs(dx) > Math.abs(dz) ? Math.sign(dx) : 0, nz = nx ? 0 : (Math.sign(dz) || 1);
      T().charge('tnt', c.i, nx, nz, 0); T().fire(); const r = T().run(25); const ms = massStanding();
      if(r.pct > best.pct) best = { pct: r.pct, collapse: ms.collapse, at: c.key + '@' + c.bid + ':f' + c.f };
    }
    return { pct: Math.round(best.pct * 100), collapse: Math.round(best.collapse * 100), at: best.at, tried: cands.length };
  }

  // ---- lazy: 4 TNT at the foot of the main building, one wave --------------------------------------------------------
  function lazy(idx){
    fresh(idx);
    const ms = INF().filter(b => tgt(b) && b.bid === 'A' && b.st && (b.h > 0.8 || b.loose7) && !/wall|cpan|wwall/.test(b.key));
    const y0 = Math.min(...ms.map(b => b.sy));
    ms.filter(b => b.sy < y0 + 0.5).sort((a, b) => (b.sz - a.sz) || (Math.abs(a.sx) - Math.abs(b.sx))).slice(0, 4).forEach(b => T().charge('tnt', b.i, 0, 1, 0));
    T().fire(); const r = T().run(25); const ms2 = massStanding();
    return { pct: Math.round(r.pct * 100), collapse: Math.round(ms2.collapse * 100) };
  }

  // ---- fair player: ONLY screen taps (onTap -> pick -> placeCharge), the real stock, BLAST -----------------------------
  const TAP = (x, y) => { const cv = document.querySelector('canvas');
    for(const t of ['pointerdown', 'pointerup']) cv.dispatchEvent(new PointerEvent(t, { clientX: x, clientY: y, bubbles: true, pointerId: 1, isPrimary: true, pointerType: 'touch' }));
    cv.dispatchEvent(new MouseEvent('click', { clientX: x, clientY: y, bubbles: true })); };
  async function fair(idx, budget, seed){
    const L = LV()[idx], keepT = L.charges.tnt; L.charges = { tnt: budget }; fresh(idx, seed); L.charges = { tnt: keepT };
    const top = L.stage7 ? L.stage7.h - 0.2 : 1.5, waves = []; let stuck = 0;
    for(let w = 0; w < 30; w++){
      const st = __blast.state(); if(st.phase !== 'plan' || st.left <= 0) break;
      __blast.lv7.syncDraw();
      const inf = INF(), MA = __blast.members().filter(m => !m.keep && inf[m.i] && !inf[m.i].an), M = MA.filter(m => m.pickable);
      // a player also taps an element seen between the steel (the tap lands on the frame and goes to the nearest element)
      if(inf.some(b => b.loose7)) MA.forEach(m => { if(!m.pickable && m.onScreen) M.push(m); });
      const stand = M.filter(m => inf[m.i] && inf[m.i].st && inf[m.i].bid && tgt(inf[m.i]));
      const parts = [...new Set(stand.map(m => inf[m.i].bid))];
      const want = []; let left = st.left;
      if(parts.length){
        for(const p of parts){
          const ms = stand.filter(m => inf[m.i].bid === p);
          if(inf.some(b => b.loose7)){   // loose elements: aim where most of them sit (a cluster), hard ones need their own TNT
            ms.forEach(m => { m.d = ms.filter(o => Math.hypot(o.x - m.x, o.y - m.y, o.z - m.z) < 2.6).length; m.hd = isHard(inf[m.i]) ? 1 : 0; });
            ms.sort((a, b) => (b.d + 2 * b.hd) - (a.d + 2 * a.hd));   // a hard block needs its own TNT: a player aims at it
            const n = Math.min(3, left), pick = [];
            const taken = want.concat(pick);
            for(const m of ms){ if(pick.length >= n) break; if(pick.some(u => Math.hypot(u.x - m.x, u.y - m.y, u.z - m.z) < 3.5)) continue;
              if(taken.concat(pick).some(u => Math.hypot(u.sx - m.sx, u.sy - m.sy) < 45)) continue;   // a tap on a planted charge selects it: keep taps apart on screen
              pick.push(m); }
            pick.forEach(m => want.push(m)); left -= pick.length; if(left <= 0) break; continue;
          }
          const y0 = Math.min(...ms.map(m => m.anchorY));
          const g = ms.filter(m => m.anchorY < y0 + 0.6).sort((a, b) => a.sx - b.sx);
          const n = Math.min(3, g.length, left);
          for(let k = 0; k < n; k++) want.push(g[Math.floor((k + 0.5) * g.length / n)]);
          left -= n; if(left <= 0) break;
        }
      } else {
        const hp = M.filter(m => inf[m.i] && !inf[m.i].st && !inf[m.i].dead && tgt(inf[m.i]) && (inf[m.i].y > top || /^hard7/.test(inf[m.i].key)));   // heap on a stage, or unbroken hard pieces in the rubble
        hp.forEach(m => { m.d = hp.filter(o => Math.hypot(o.x - m.x, o.z - m.z) < 3).length; m.hd = isHard(inf[m.i]) ? 1 : 0; }); hp.sort((a, b) => (b.hd - a.hd) || (b.d - a.d));
        for(const m of hp){ if(want.length >= Math.min(3, left)) break; if(want.some(u => Math.hypot(u.x - m.x, u.z - m.z) < 4)) continue; want.push(m); }
      }
      if(!want.length) break;
      const p0 = __blast.state().placed, toasts = [];
      // tap where the element is DRAWN (a bent or tilted block is not drawn at its physics centre): search round the centre
      want.forEach(m => { if(m.i == null) return; if(T().pickAt(m.sx, m.sy) === m.i) return;
        for(let r = 4; r <= 28; r += 4) for(let a = 0; a < 8; a++){ const x = m.sx + r * Math.cos(a * 0.785), y = m.sy + r * Math.sin(a * 0.785);
          if(T().pickAt(x, y) === m.i){ m.sx = x; m.sy = y; return; } } });
      want.forEach(m => { const q0 = __blast.state().placed; TAP(m.sx, m.sy);
        if(__blast.state().placed === q0){ TAP(20, 160); TAP(m.sx, m.sy); }   // a selected charge eats the tap: tap the sky to let go, then tap again
        const te = document.getElementById('toast'); if(__blast.state().placed === q0) toasts.push((te && te.classList.contains('on') ? te.textContent : '?') + '@' + Math.round(m.sx) + ',' + Math.round(m.sy) + (m.pickable ? '' : '(np)')); });
      const placed = __blast.state().placed - p0; window.P7miss = (window.P7miss || []).concat(toasts.slice(0, 3));
      if(!placed){ if(++stuck > 2) break; continue; }
      const g0 = __blast.state().gameT;
      if(__blast.state().phase === 'plan') T().fire(); else { for(let q = 0; q < 10 && __blast.state().phase === 'count'; q++) await sleep(300); }
      const r = T().run(25);
      waves.push({ kind: parts.length ? 'bld' : 'heap', taps: placed, pct: Math.round(r.pct * 100), sim: +(__blast.state().gameT - g0).toFixed(1) });
      if(r.phase === 'done') break;
    }
    const s = __blast.state(), win = !!(s.result && s.result.ok);
    const est = waves.reduce((a, w) => a + 3 + 1.0 * w.taps + Math.min(w.sim, 6), 0);   // read + taps + watch (a player skips the long settle)
    return { win, res: s.result ? (s.result.ok ? 'WIN' : 'LOSE ' + s.result.code) : s.phase, pct: Math.round(s.pct * 100), used: budget - s.left, left: s.left,
      waves: waves.length, firstWave: waves[0] ? waves[0].pct : 0, keep: +(s.collateral || 0).toFixed(2), estSec: Math.round(est), log: waves.map(w => w.kind + w.taps + '=' + w.pct).join(' ') };
  }

  // ---- foot exploits (tester 20/11: "đặt hết bom vào đáy thì vẫn thắng") ------------------------------------------------
  // allFoot: the WHOLE budget on the lowest storey of every part (round robin over parts, columns first), one blast.
  // footOnly: a player who only ever hits the lowest storey of what still stands, wave after wave, until out of TNT.
  function footTargets(n, ground){
    // the FOOT = what stands on the ground (Khai: "all the bombs at the bottom of the foot"): members starting below 3 m only
    const okT = window.P7tap ? reach4() : null;
    const B = INF().filter(b => tgt(b) && b.st && (!okT || okT.has(b.i)) && (b.h > 0.8 || b.loose7) && b.sy - b.h < 3.0 && (!ground || !b.loose7 || b.sy < 2.2)), byPart = {};
    B.forEach(b => (byPart[b.bid] = byPart[b.bid] || []).push(b));
    const lists = Object.values(byPart).map(list => { const y0 = Math.min(...list.map(b => b.sy));
      const low = list.filter(b => b.sy < y0 + (b.loose7 ? 1.2 : 0.6)), cols = low.filter(b => !/wall|bkw|cpan|wwall|glass/.test(b.key)), walls = low.filter(b => /wall|bkw|cpan|wwall|glass/.test(b.key));
      return cols.concat(walls); });
    const out = []; for(let k = 0; out.length < n && k < 99; k++) lists.forEach(l => { if(out.length < n && l[k]) out.push(l[k]); });
    return out;
  }
  function chargeFoot(list){
    const all = INF().filter(tgt);
    list.forEach(c => { const mine = all.filter(b => b.bid === c.bid), cx = mine.reduce((a, b) => a + b.sx, 0) / mine.length, cz = mine.reduce((a, b) => a + b.sz, 0) / mine.length;
      const dx = c.sx - cx, dz = c.sz - cz, nx = Math.abs(dx) > Math.abs(dz) ? Math.sign(dx) : 0, nz = nx ? 0 : (Math.sign(dz) || 1);
      T().charge('tnt', c.i, nx, nz, 0); });
  }
  function allFoot(idx, budget){
    fresh(idx); const list = footTargets(budget); chargeFoot(list); T().fire(); const r = T().run(25);
    return { pct: Math.round(r.pct * 100), used: list.length, collapse: Math.round(massStanding().collapse * 100), keep: Math.round(100 * (T().collateral() || 0)) };
  }
  function footOnly(idx, budget){
    fresh(idx); let left = budget, pct = 0, waves = 0;
    while(left > 0 && waves < 12){
      const list = footTargets(Math.min(left, 6), true); if(!list.length) break;   // ground storey only
      chargeFoot(list); left -= list.length; T().fire(); const r = T().run(25); pct = r.pct; waves++;
      if(r.pct >= LV()[idx].target) break;
    }
    return { pct: Math.round(pct * 100), waves, left, keep: Math.round(100 * (T().collateral() || 0)) };
  }
  // response curve (Khai 20/11: "a few bombs nudge it a little, more bombs nudge it more"): % and collapse after n TNT at the
  // foot of the MAIN building, one blast, for each n. Flat = a base too thick to matter; a cliff at n = 1-2 = one bomb drops all.
  function curve(idx, ns, allParts){
    const out = [];
    for(const n of (ns || [1, 2, 3, 4, 6, 8, 12])){
      fresh(idx);
      const list = (allParts ? footTargets(n) : footTargets(99).filter(b => b.bid === 'A').slice(0, n)); chargeFoot(list); T().fire(); const r = T().run(25);
      out.push({ n, pct: Math.round(r.pct * 100), collapse: Math.round(massStanding().collapse * 100) });
    }
    return out;
  }

  // ---- oneWave (Khai 20/11: "đặt rất nhiều bom cùng một lúc rồi bấm blast"): the WHOLE budget planned in ONE blast by a
  // smart player: break-what-must-break first (hrc/hard7 get 3 TNT, rc 1), feet of every part, then spread over the height.
  // tapOnly: only what a tap can reach on the opening frame (a member hidden behind a shell / in a core is not pickable).
  function oneWave(idx, budget, tapOnly){
    fresh(idx);
    const inf = INF(), mem = __blast.members(), ok = tapOnly ? reach4() : new Set(mem.map(m => m.i));
    const B = inf.filter(b => tgt(b) && b.st && ok.has(b.i) && (b.h > 0.8 || b.loose7 || LV7hard(b)));
    const need = b => /^hard7|^hrc$/.test(b.key) ? 3 : (b.key === 'rc' || b.key === 'rcs') ? 1 : 0;
    const plan = [];   // [member, count]
    // 1. feet of every part (2 per part), 2. every hard member its full need, 3. the rest spread over height, part by part
    const byPart = {}; B.forEach(b => (byPart[b.bid] = byPart[b.bid] || []).push(b));
    Object.values(byPart).forEach(l => { const y0 = Math.min(...l.map(b => b.sy)); l.filter(b => b.sy < y0 + 0.6 && !need(b)).slice(0, 2).forEach(b => plan.push([b, 1])); });
    B.filter(need).sort((a, b) => a.sy - b.sy).forEach(b => plan.push([b, need(b)]));
    const used = new Set(plan.map(p => p[0].i)), rest = B.filter(b => !used.has(b.i)).sort((a, b) => a.sy - b.sy);
    let left = budget - plan.reduce((a, p) => a + p[1], 0);
    // cut the plan down if the hard list alone is over budget
    while(left < 0 && plan.length){ const p = plan.pop(); left += p[1]; }
    for(let k = 0; left > 0 && rest.length && k < budget; k++){ const b = rest[Math.floor((k * 0.618 % 1) * rest.length)]; if(used.has(b.i)) continue; used.add(b.i); plan.push([b, 1]); left--; }
    let n = 0;
    plan.forEach(([b, c]) => { for(let q = 0; q < c; q++){ const dirs = [[0, 1], [1, 0], [-1, 0], [0, -1]][q % 4]; T().charge('tnt', b.i, dirs[0], dirs[1], q === 0 ? 0 : (q === 1 ? 0.5 : -0.5)); n++; } });
    T().fire(); const r = T().run(30);
    return { pct: Math.round(r.pct * 100), used: n, reach: B.length, collapse: Math.round(massStanding().collapse * 100) };
  }

  // what a player can tap from any of the 4 quarter views (swipe to turn)
  // a member is tappable if its centre OR a point near one of its faces is the first thing under the finger
  const reach4 = () => { const S = new Set(), T = __blast.test, BI = T.blocks(); for(let k = 0; k < 4; k++){ __blast.lv7.view(k);
      __blast.members().forEach(m => { if(m.pickable){ S.add(m.i); return; } if(S.has(m.i) || m.keep || m.prop) return; const b = BI[m.i]; if(!b) return;
        const hx = b.hx || 0.4, hz = b.hz || 0.4, hy = b.hy || 0.5; if(hy < 0.8 || b.dead) return;
        for(const [dx, dy, dz] of [[0.8, 0, 0], [-0.8, 0, 0], [0, 0, 0.8], [0, 0, -0.8], [0, 0.6, 0], [0, -0.6, 0]]){ const p = __blast.project(m.x + dx*hx, m.y + dy*hy, m.z + dz*hz); if(p.on === false) continue; if(T.pickAt(p.x, p.y) === m.i){ S.add(m.i); break; } } }); }
    __blast.lv7.view(0); return S; };
  const LV7hard = b => /^hard7|^hrc$|^rc/.test(b.key);

  // ---- aim (L02 lesson "aim the fall"): tip the main tower towards face [fx, fz] (a corner post with its need + the middle
  // post of that face, one blast), then clean up like a player for up to 6 waves (6 TNT a wave on what still stands or lies
  // high, never on hit7 members: TNT does nothing there). Right face must win, the 3 others must not.
  function aim(idx, fx, fz, budget){
    fresh(idx); const L = LV()[idx], immune = new Set((L.hit7 && L.hit7.keys) || []);
    const need = b => /^hard7|^hrc$/.test(b.key) ? 3 : 1;
    const A = INF().filter(b => b.bid === 'A' && b.st && (b.key === 'hrc' || b.key === 'rc') && b.f === 0);
    const cx = A.reduce((a, b) => a + b.x, 0) / A.length, cz = A.reduce((a, b) => a + b.z, 0) / A.length;
    const face = A.filter(b => fx ? Math.sign(b.x - cx) === fx && Math.abs(b.x - cx) > 2 : Math.sign(b.z - cz) === fz && Math.abs(b.z - cz) > 2);
    const mid = face.filter(b => b.key === 'rc')[0], cor = face.filter(b => b.key === 'hrc')[0];
    let used = 0; const waves = [];
    // chip the chosen corner (and its middle post) blast after blast until the tower goes (layer7: one layer per blast)
    const topY = () => Math.max(...INF().filter(b => b.bid === 'A' && !b.dead).map(b => b.y));
    const y0 = topY(); let r;
    for(let w = 0; w < 4; w++){
      [mid, cor].forEach(b => { const now = INF()[b.i]; if(!now || now.dead) return; for(let q = 0; q < Math.min(need(b), 2); q++){ T().charge('tnt', b.i, fx, fz, q === 0 ? 0 : 0.5); used++; } });
      T().fire(); r = T().run(30); waves.push(Math.round(r.pct * 100));
      if(topY() < y0 - 8) break;
    }
    for(let w = 0; w < 8 && used < budget && r.phase !== 'done'; w++){
      const left = INF().filter(b => tgt(b) && !b.dead && !immune.has(b.key) && b.bid && (b.st || b.y > 1.5 || LV7hard(b)) && (b.h > 0.5 || LV7hard(b)));
      if(!left.length) break;
      left.sort((a, b) => (LV7hard(b) - LV7hard(a)) || (b.m - a.m));
      const pick = []; for(const b of left){ if(pick.length >= Math.min(6, budget - used)) break; if(pick.some(u => Math.hypot(u.x - b.x, u.y - b.y, u.z - b.z) < 2.5)) continue; pick.push(b); }
      pick.forEach(b => { for(let q = 0; q < Math.min(need(b), budget - used); q++){ T().charge('tnt', b.i, 0, 1, 0); used++; } });
      T().fire(); r = T().run(30); waves.push(Math.round(r.pct * 100));
    }
    const hard = INF().filter(b => immune.has(b.key)), broke = hard.filter(b => b.dead).length;
    const I2 = INF(), tk = I2.filter(b => b.key === 'tank'), gt = I2.filter(b => b.bid === 'G');
    return { face: [fx, fz], pct: Math.round(r.pct * 100), used, waves: waves.join('>'), hit7Broken: broke + '/' + hard.length,
      drums: tk.filter(b => b.dead).length + '/' + tk.length, endTower: gt.length ? Math.round(100 * gt.filter(b => !b.st || b.dead).length / gt.length) + '% down' : '-' };
  }

  // ---- keep (L03 lesson "keep the blue whole"): first peel the parts that hide a face of the tower (blast after blast, up to
  // 6 TNT a wave on their ground posts, far from the blue first), then tip the tower towards face [fx, fz] (corner + middle
  // post of that face, once a tap can reach them), then clean up (6 a wave, far from the blue first). Returns % and the damage
  // to the protected buildings. The safe faces must win with the blue whole; the face towards the blue must lose.
  function keepT(idx, fx, fz, budget, peel, anyTip, stop, part){ try{ return keepT0(idx, fx, fz, budget, peel, anyTip, stop, part); }catch(e){ if(e && e.stop7) return { waves: e.stop7 }; throw e; } }
  function keepT0(idx, fx, fz, budget, peel, anyTip, stop, part){ part = part || 'A';
    fresh(idx); const L = LV()[idx];
    const kp = INF().filter(b => b.kp && !b.an), kx = kp.reduce((a, b) => a + b.x, 0) / Math.max(1, kp.length), kz = kp.reduce((a, b) => a + b.z, 0) / Math.max(1, kp.length);
    const far = (a, b) => Math.hypot(b.x - kx, b.z - kz) - Math.hypot(a.x - kx, a.z - kz);
    const pickable = () => reach4();
    let used = 0, r = { pct: 0 }; const waves = [], notes = [];
    const fire = tag => { T().fire(); r = T().run(30); waves.push(tag + Math.round(r.pct * 100)); if(typeof stop === 'number' && waves.length >= stop) throw { stop7: waves.join('>') }; };
    // dig: when the wanted members cannot be tapped, blast what can be tapped nearest to them (rubble, the wall in front)
    const dig = (want, tag) => { const pk = pickable(), I = INF(); const ws = want.map(b => I[b.i]).filter(b => b && !b.dead);
      if(!ws.length) return false;
      const near = I.filter(b => tgt(b) && !b.dead && pk.has(b.i) && b.bid && b.h > 0.3).map(b => [b, Math.min(...ws.map(w => Math.hypot(w.x - b.x, w.y - b.y, w.z - b.z)))]).filter(q => q[1] < 6).sort((a, c) => a[1] - c[1]);
      if(!near.length) return false;
      const pick = []; for(const [b] of near){ if(pick.length >= Math.min(6, budget - used)) break; if(pick.some(u => Math.hypot(u.x - b.x, u.z - b.z) < 1.5)) continue; pick.push(b); }
      pick.forEach(b => { T().charge('tnt', b.i, 0, 1, 0); used++; }); fire(tag); return true; };
    for(const pid of (peel || [])){
      for(let w = 0; w < 5 && used < budget; w++){
        const pk = pickable(), I = INF();
        const all = I.filter(b => b.bid === pid && !b.dead && b.st && b.f === 0 && b.h > 1.5 && !/wall|cpan|glass/.test(b.key));
        const ps = all.filter(b => pk.has(b.i)).sort(far);
        if(!all.length) break;
        if(!ps.length){ if(!dig(all, pid + 'd')) break; continue; }
        ps.slice(0, Math.min(6, budget - used)).forEach(b => { T().charge('tnt', b.i, 0, 1, 0); used++; });
        fire(pid);
      }
    }
    if(stop === 'peel') return { waves: waves.join('>') };
    const A = INF().filter(b => b.bid === part && !b.dead && b.f === 0 && (b.key === 'rc' || b.key === 'hrc'));
    const cx = A.reduce((a, b) => a + b.x, 0) / A.length, cz = A.reduce((a, b) => a + b.z, 0) / A.length;
    const mxo = Math.max(...A.map(b => fx ? Math.abs(b.x - cx) : Math.abs(b.z - cz)));
    const face = A.filter(b => fx ? Math.sign(b.x - cx) === fx && Math.abs(b.x - cx) > 0.6 * mxo : Math.sign(b.z - cz) === fz && Math.abs(b.z - cz) > 0.6 * mxo);
    const pk = pickable(); notes.push('face ' + face.filter(b => pk.has(b.i)).length + '/' + face.length + ' reachable');
    for(let w = 0; w < 3 && !anyTip && face.filter(b => pk.has(b.i)).length < 2 && used < budget; w++){ if(!dig(face.filter(b => !pk.has(b.i)), 'd')) break; const p2 = pickable(); pk.clear(); p2.forEach(i => pk.add(i)); }
    notes.push('after dig ' + face.filter(b => pk.has(b.i)).length);
    const reach = face.filter(b => anyTip || pk.has(b.i)).sort((a, b) => Math.abs(fx ? a.z - cz : a.x - cx) - Math.abs(fx ? b.z - cz : b.x - cx)).slice(0, 2);
    const topP = () => Math.max(...INF().filter(b => b.bid === part && !b.dead).map(b => b.y)); const y0 = topP();
    for(let w = 0; w < 4 && reach.length && used < budget; w++){ let n = 0; reach.forEach(b => { if(INF()[b.i].dead) return; const k = b.key === 'hrc' ? 2 : 1; for(let q = 0; q < k && used < budget; q++){ T().charge('tnt', b.i, fx, fz, q ? 0.5 : 0); used++; n++; } }); if(!n) break; fire('tip'); if(topP() < y0 - 3) break; }
    notes.push('keepAfterTip ' + Math.round(100 * (T().collateral() || 0)));
    notes.push('top ' + y0.toFixed(0) + '>' + topP().toFixed(0));
    for(let w = 0; w < 8 && used < budget && r.phase !== 'done'; w++){
      const pk2 = pickable();
      const left = INF().filter(b => tgt(b) && !b.dead && b.bid && pk2.has(b.i) && (b.st || b.y > 1.5) && b.h > 0.5).sort(far);
      if(!left.length) break;
      const pick = []; for(const b of left){ if(pick.length >= Math.min(6, budget - used)) break; if(pick.some(u => Math.hypot(u.x - b.x, u.y - b.y, u.z - b.z) < 2.5)) continue; pick.push(b); }
      pick.forEach(b => { T().charge('tnt', b.i, 0, 1, 0); used++; });
      fire('c');
    }
    return { face: [fx, fz], part, peel: (peel || []).join(''), pct: Math.round(r.pct * 100), keep: Math.round(100 * (T().collateral() || 0)), used, waves: waves.join('>'), notes: notes.join('; '), win: r.pct >= L.target && (T().collateral() || 0) <= (L.keepMax || 0.05) };
  }

  // ---- seqT (L04 "domino"): a sequence of tips [{part, f:[fx, fz]}...]: each one chips the face's 2 nearest-to-centre reachable
  // legs blast after blast (hrc: 2 TNT a leg a blast) until that part's top drops 3 m; then clean up (6 a blast, far from the blue).
  function seqT(idx, steps, budget, stop){ try{ return seqT0(idx, steps, budget, stop); }catch(e){ if(e && e.stop7) return { waves: e.stop7, keep: Math.round(100 * (T().collateral() || 0)), log: __blast.lv7.log.filter(x => /dom7/.test(x)).join(',') }; throw e; } }
  function seqT0(idx, steps, budget, stop){
    fresh(idx); __blast.lv7.log.length = 0; const L = LV()[idx];
    const kp = INF().filter(b => b.kp && !b.an); const far = (a, b) => Math.min(...kp.map(k => Math.hypot(b.x - k.x, b.z - k.z))) - Math.min(...kp.map(k => Math.hypot(a.x - k.x, a.z - k.z)));
    let used = 0, r = { pct: 0 }; const waves = [], notes = [];
    const fire = tag => { T().fire(); r = T().run(30); waves.push(tag + Math.round(r.pct * 100)); if(stop && waves.length >= stop) throw { stop7: waves.join('>') }; };
    for(const st of steps){
      const part = st.part, [fx, fz] = st.f;
      const top = () => { const l = INF().filter(b => b.bid === part && !b.dead); return l.length ? Math.max(...l.map(b => b.y)) : 0; }, y0 = top();
      if(y0 < 3){ notes.push(part + ' already down'); continue; }
      for(let w = 0; w < 4 && used < budget; w++){
        const pk = reach4(), A = INF().filter(b => b.bid === part && !b.dead && b.f === 0 && /^(rc|hrc)$/.test(b.key));
        if(!A.length) break;
        const cx = A.reduce((a, b) => a + b.x, 0) / A.length, cz = A.reduce((a, b) => a + b.z, 0) / A.length;
        const mxo = Math.max(...A.map(b => fx ? Math.abs(b.x - cx) : Math.abs(b.z - cz)));
        const face = A.filter(b => pk.has(b.i) && (fx ? Math.sign(b.x - cx) === fx && Math.abs(b.x - cx) > 0.6 * mxo : Math.sign(b.z - cz) === fz && Math.abs(b.z - cz) > 0.6 * mxo))
          .sort((a, b) => Math.abs(fx ? a.z - cz : a.x - cx) - Math.abs(fx ? b.z - cz : b.x - cx)).slice(0, 2);
        if(!face.length){ notes.push(part + ' face not reachable'); break; }
        face.forEach(b => { const k = b.key === 'hrc' ? (window.P7hrc || 1) : 1; for(let q = 0; q < k && used < budget; q++){ T().charge('tnt', b.i, fx, fz, q ? 0.5 : 0); used++; } });
        fire(part); if(top() < y0 - 3) break;
      }
    }
    for(let w = 0; w < 8 && used < budget && r.phase !== 'done'; w++){
      const pk2 = reach4();
      const left = INF().filter(b => tgt(b) && !b.dead && b.bid && pk2.has(b.i) && (b.st || b.y > 1.5) && b.h > 0.5).sort(far);
      if(!left.length) break;
      const pick = []; for(const b of left){ if(pick.length >= Math.min(6, budget - used)) break; if(pick.some(u => Math.hypot(u.x - b.x, u.y - b.y, u.z - b.z) < 2.5)) continue; pick.push(b); }
      pick.forEach(b => { const k = b.key === 'hrc' ? 2 : 1; for(let q = 0; q < k && used < budget; q++){ T().charge('tnt', b.i, 0, 1, 0); used++; } });
      fire('c');
    }
    const keep = Math.round(100 * (T().collateral() || 0));
    return { log: __blast.lv7.log.filter(x => /dom7/.test(x)).join(','), seq: steps.map(s => s.part + (s.f[0] ? (s.f[0] > 0 ? '>' : '<') : (s.f[1] > 0 ? 'v' : '^'))).join(' '), pct: Math.round(r.pct * 100), keep, used, waves: waves.join('>'), notes: notes.join('; '), win: r.pct >= L.target && keep <= Math.round(100 * (L.keepMax || 0.05)) };
  }

  // ---- coreT (L05 "peel the shell, find the core"). mode 'core': blast the podium's ground walls/shop fronts (6 a blast,
  // nearest the core first) until the core's ground piers can be tapped, then 1 TNT on every reachable core pier a blast
  // until the tower's top drops 8 m, then clean up. mode 'shell': every blast, 6 TNT on what a player sees (facade posts,
  // glass, walls, decks) of the tower, NEVER the core: must not win.
  function coreT(idx, part, budget, mode, stop){ try{ return coreT0(idx, part, budget, mode, stop); }catch(e){ if(e && e.stop7) return { waves: e.stop7 }; throw e; } }
  function coreT0(idx, part, budget, mode, stop){
    fresh(idx); const L = LV()[idx]; let used = 0, r = { pct: 0 }; const waves = [], notes = [];
    const fire = tag => { T().fire(); r = T().run(30); waves.push(tag + Math.round(r.pct * 100)); if(stop && waves.length >= stop) throw { stop7: waves.join('>') }; };
    const isCore = b => /^(hrc|rc)$/.test(b.key) && Math.abs(b.sx - cx0) < 3 && Math.abs(b.sz - cz0) < 3;
    const A0 = INF().filter(b => b.bid === part && !b.an); const cx0 = A0.reduce((a, b) => a + b.sx, 0) / A0.length, cz0 = A0.reduce((a, b) => a + b.sz, 0) / A0.length;
    const top = () => Math.max(...INF().filter(b => b.bid === part && !b.dead && !b.an).map(b => b.y)), y0 = top();
    if(mode === 'core'){
      for(let w = 0; w < 4 && used < budget; w++){
        const pk = reach4(), I = INF(); const cl = I.filter(b => b.bid === part && !b.dead && b.f === 0 && isCore(b));
        if(cl.filter(b => pk.has(b.i)).length >= Math.min(2, cl.length)){ notes.push('core reachable after ' + w + ' peel'); break; }
        const near = I.filter(b => tgt(b) && !b.dead && b.bid === part && pk.has(b.i) && b.f === 0 && !isCore(b) && b.h > 0.5).sort((a, b) => Math.hypot(a.x - cx0, a.z - cz0) - Math.hypot(b.x - cx0, b.z - cz0));
        if(!near.length) break; const pick = []; for(const b of near){ if(pick.length >= Math.min(6, budget - used)) break; if(pick.some(u => Math.hypot(u.x - b.x, u.z - b.z) < 1.5)) continue; pick.push(b); }
        pick.forEach(b => { T().charge('tnt', b.i, 0, 1, 0); used++; }); fire('peel');
      }
      for(let w = 0; w < 5 && used < budget; w++){
        const pk = reach4(), cl = INF().filter(b => b.bid === part && !b.dead && b.f === 0 && isCore(b) && pk.has(b.i));
        if(!cl.length){ notes.push('no core pier reachable'); break; }
        cl.forEach(b => { if(used < budget){ T().charge('tnt', b.i, Math.sign(b.x - cx0) || 1, 0, 0); used++; } }); fire('core');
        if(top() < y0 - 8) break;
      }
      notes.push('top ' + y0.toFixed(0) + '>' + top().toFixed(0));
    }
    const PC = {}; INF().filter(b => b.bid && !b.an).forEach(b => { const c = PC[b.bid] = PC[b.bid] || [0, 0, 0]; c[0] += b.sx; c[1] += b.sz; c[2]++; });
    const coreOf = b => { const c = PC[b.bid]; if(!c) return 0; return (Math.abs(b.sx - c[0]/c[2]) < 2.2 && Math.abs(b.sz - c[1]/c[2]) < 2.2 && b.h > 1.2 && b.st) ? 1 : 0; };
    for(let w = 0; w < 10 && used < budget && r.phase !== 'done'; w++){
      const pk2 = reach4();
      const left = INF().filter(b => tgt(b) && !b.dead && b.bid && pk2.has(b.i) && (b.st || b.y > 1.5) && b.h > 0.3 && !(mode === 'shell' && isCore(b))).sort((a, b) => mode === 'shell' ? (b.y - a.y) : ((coreOf(b) - coreOf(a)) || (b.st - a.st) || (LV7hard(b) - LV7hard(a)) || (Math.abs(a.x - cx0) < 3 && Math.abs(a.z - cz0) < 3 ? 0 : 0) || (b.h - a.h) || (b.m - a.m)));
      if(!left.length) break;
      const pick = []; for(const b of left){ if(pick.length >= Math.min(6, budget - used)) break; if(pick.some(u => Math.hypot(u.x - b.x, u.y - b.y, u.z - b.z) < 2.5)) continue; pick.push(b); }
      pick.forEach(b => { const k = b.key === 'hrc' ? 1 : 1; for(let q = 0; q < k && used < budget; q++){ T().charge('tnt', b.i, 0, 1, 0); used++; } });
      fire(mode === 'shell' ? 's' : 'c');
    }
    return { mode, pct: Math.round(r.pct * 100), used, waves: waves.join('>'), notes: notes.join('; '), win: r.pct >= L.target };
  }
  window.P7 = { coreT, seqT, reach4, keepT, aim, oneWave, metrics, oneBomb, lazy, fair, massStanding, allFoot, footOnly, curve };

})();
