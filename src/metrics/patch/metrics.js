// ---- metrics v13 (metrics/patch.js, 11/11/2026): local play-time metrics for human playtests (no network, no personal data) ----
// Stores attempt / session events in ONE localStorage key (BLAST_MET_KEY), a ring of the last MET_CAP events.
// Hooks: the engine functions are wrapped by name (startLevel, placeCharge, removeCharge, fireNow, detonateAll, showResult,
// rescue, goHome); every wrapper calls the original first-or-last and never changes its arguments or return value, and
// every metrics line runs inside try/catch so a metrics bug can never stop the game. Nothing is written during play:
// storage writes happen on the result card, on leaving a level, and when the page is hidden / closed.
// Times are on an "active" clock (performance.now() minus time the tab was hidden), in ms from the level start (the tap
// that starts the level; readyMs = when the building has dropped in and planning is possible).
// Attempt event fields: t="attempt", sid (session), aid, ts (start, epoch ms), lvl, n (attempt # of that level on this device),
//   end ("result" | "home" | "restart" | "switch" = another level started | "close" = tab closed / app killed | "open" = still
//   playing, export only), res ("win" | "lose" | "abandon"), pct (% down shown), pass (PASS %), code (verdict code, fail reason),
//   rescue, readyMs, firstTntMs, blastMs (first BLAST / auto-blast), auto (first blast was the auto fuse), blasts, lastBlastMs,
//   resultMs, watchMs (last blast -> result card), totalMs, placed / removed / moved (TNT), hiddenMs (tab hidden, excluded).
// Session event: t="session", sid, ts, end ("close" | "recovered" | "open"), lenMs (visible time), wallMs, levels [], attempts.
// Panel: ?metrics=1, or 5 taps on the logo (Home) within 3 s. API: window.__blast.metrics.dump() / .summary() / .clear().
var BLAST_MET_KEY = "blastRush.metrics.v1", MET_CAP = 2000;
var MET = (function(){
  var hiddenAt = document.hidden ? performance.now() : -1, hiddenTot = 0;
  function now(){ return (hiddenAt >= 0 ? hiddenAt : performance.now()) - hiddenTot; }
  function rid(){
    var a = new Uint8Array(6);
    try{ crypto.getRandomValues(a); }catch(e){ for(var i=0;i<a.length;i++) a[i] = Math.floor(Math.random()*256); }
    return Array.prototype.map.call(a, function(x){ return (x + 256).toString(16).slice(1); }).join("");
  }
  var st = { v:1, events:[], cnt:{}, open:null };
  try{ var raw = localStorage.getItem(BLAST_MET_KEY); if(raw){ var o = JSON.parse(raw); if(o && o.events instanceof Array){ st = o; st.cnt = st.cnt || {}; } } }catch(e){}
  var sess = { sid:rid(), ts:Date.now(), t0:now(), levels:{}, attempts:0 };
  var cur = null, moveNext = false, autoNext = false, readyTimer = 0, gone = false;   // gone: pagehide ended this page life
  function push(ev){
    for(var i=st.events.length-1;i>=0 && i>=st.events.length-60;i--) if(ev.aid && st.events[i].aid === ev.aid){ st.events[i] = ev; return; }   // upsert (rescue)
    st.events.push(ev);
    if(st.events.length > MET_CAP) st.events.splice(0, st.events.length - MET_CAP);
  }
  function snapshot(){ return { sess:sessEv("open"), att:cur && cur.status === "play" ? attEv(cur, "close") : null }; }
  function write(keepOpen){
    if(gone) return false;   // the unload sequence fires visibilitychange AFTER pagehide: do not re-open the closed session
    st.open = keepOpen ? snapshot() : null;
    for(var k=0;k<3;k++){
      try{ localStorage.setItem(BLAST_MET_KEY, JSON.stringify(st)); return true; }
      catch(e){ if(st.events.length < 10) return false; st.events.splice(0, Math.ceil(st.events.length/2)); }   // quota: drop the oldest half
    }
    return false;
  }
  function r0(x){ return x == null ? null : Math.round(x); }
  function attEv(a, end){
    var t = now(), hid = hiddenTot + (hiddenAt >= 0 ? performance.now() - hiddenAt : 0) - a.hid0;
    var ev = { t:"attempt", sid:sess.sid, aid:a.aid, ts:a.ts, lvl:a.lvl, n:a.n, end:end,
      res:a.res || null, pct:a.pct == null ? null : a.pct, pass:a.pass, code:a.code || null, rescue:a.rescue,
      readyMs:r0(a.ready), firstTntMs:r0(a.first), blastMs:r0(a.blast), auto:a.auto, blasts:a.blasts,
      lastBlastMs:r0(a.lastBlast), resultMs:r0(a.result), watchMs:a.result != null && a.lastBlast != null ? r0(a.result) - r0(a.lastBlast) : null,
      totalMs:r0((a.result != null && end === "result" ? a.result : t - a.t0)),
      placed:a.placed, removed:a.removed, moved:a.moved, hiddenMs:r0(Math.max(0, hid)) };
    if(end !== "result"){ ev.res = "abandon"; ev.pct = a.pct == null ? null : a.pct; }
    return ev;
  }
  function sessEv(end){
    var lv = Object.keys(sess.levels).map(Number).sort(function(x,y){ return x-y; });
    return { t:"session", sid:sess.sid, ts:sess.ts, end:end, lenMs:r0(now() - sess.t0), wallMs:Date.now() - sess.ts, levels:lv, attempts:sess.attempts };
  }
  // the previous page life ended without pagehide (killed in the background): its open attempt is an abandon
  if(st.open){
    try{ if(st.open.att) push(st.open.att); if(st.open.sess){ st.open.sess.end = "recovered"; push(st.open.sess); } }catch(e){}
    st.open = null; write(false);
  }
  function close(end){
    if(!cur) return;
    var c = cur; cur = null; clearInterval(readyTimer);
    if(c.status === "play"){ push(attEv(c, end)); write(true); }
  }
  function begin(i){
    var lvl = (Math.max(0, i|0)) + 1;
    var prev = cur;
    if(prev) close(prev.status === "play" ? (prev.lvl === lvl ? "restart" : "switch") : "result");
    st.cnt[lvl] = (st.cnt[lvl] || 0) + 1;
    sess.levels[lvl] = 1; sess.attempts++;
    cur = { aid:sess.sid + "-" + sess.attempts, ts:Date.now(), t0:now(), hid0:hiddenTot + (hiddenAt >= 0 ? performance.now() - hiddenAt : 0),
      lvl:lvl, n:st.cnt[lvl], status:"play", pass:null, ready:null, first:null, blast:null, lastBlast:null, auto:null, blasts:0,
      result:null, placed:0, removed:0, moved:0, rescue:false, res:null, pct:null, code:null };
    clearInterval(readyTimer);   // L is the new level's only once startLevel has run: PASS is read when planning opens
    readyTimer = setInterval(function(){ if(!cur || cur.ready != null){ clearInterval(readyTimer); return; }
      if(screen === "game" && phase === "plan") { cur.ready = now() - cur.t0; passNow(); clearInterval(readyTimer); } }, 200);
  }
  function rel(){ return now() - cur.t0; }
  function passNow(){ try{ if(cur && levelIdx + 1 === cur.lvl) cur.pass = Math.round(L.target*100); }catch(e){} }
  var H = {
    start:function(i){ if(manual) return; begin(i); },
    placed:function(r){ if(!cur || cur.status !== "play") return;
      if(r !== "ok"){ if(moveNext){ moveNext = false; cur.removed++; } return; }   // a move whose new spot was refused = a removal
      if(cur.ready == null){ cur.ready = rel(); passNow(); }
      if(moveNext){ moveNext = false; cur.moved++; } else { cur.placed++; if(cur.first == null) cur.first = rel(); } },
    removed:function(silent){ if(!cur || cur.status !== "play") return; if(silent) moveNext = true; else { moveNext = false; cur.removed++; } },
    fire:function(auto){ autoNext = !!auto; },
    blast:function(){ if(!cur || cur.status !== "play") return; var t = rel();
      if(cur.blast == null){ cur.blast = t; cur.auto = autoNext; } cur.lastBlast = t; cur.blasts++; autoNext = false; moveNext = false; },
    result:function(){ if(!cur || cur.status !== "play") return; var r = lastResult; if(!r) return;
      cur.result = rel(); cur.res = r.ok ? "win" : "lose"; cur.code = r.code || null;
      try{ cur.pct = v5Pct(r.pct); }catch(e){ cur.pct = Math.round((r.pct || 0)*100); }
      passNow();
      cur.status = "result"; push(attEv(cur, "result")); write(true); },
    rescue:function(){ if(!cur || cur.status !== "result" || !rescueUsed || phase !== "plan") return; cur.rescue = true; cur.status = "play"; cur.result = null; cur.res = null; },
    home:function(){ close("home"); }
  };
  function wrap(name, get, set, pre, post){
    var f = get(); if(typeof f !== "function") return false;
    set(function(){ try{ if(pre) pre.apply(null, arguments); }catch(e){}
      var r = f.apply(this, arguments);
      try{ if(post) post.apply(null, [r].concat([].slice.call(arguments))); }catch(e){}
      return r; });
    return true;
  }
  var wired = [
    wrap("startLevel", function(){ return startLevel; }, function(g){ startLevel = g; }, function(i){ H.start(i); }),
    wrap("placeCharge", function(){ return placeCharge; }, function(g){ placeCharge = g; }, null, function(r){ H.placed(r); }),
    wrap("removeCharge", function(){ return removeCharge; }, function(g){ removeCharge = g; }, function(c, silent){ if(c && !c.fired && charges.indexOf(c) >= 0) H.removed(!!silent); }),
    wrap("fireNow", function(){ return fireNow; }, function(g){ fireNow = g; }, function(){ if(phase === "count") H.fire(autoCount); }),
    wrap("detonateAll", function(){ return detonateAll; }, function(g){ detonateAll = g; }, function(){ H.blast(); }),
    wrap("showResult", function(){ return showResult; }, function(g){ showResult = g; }, null, function(){ H.result(); }),
    wrap("rescue", function(){ return rescue; }, function(g){ rescue = g; }, null, function(){ H.rescue(); }),
    wrap("goHome", function(){ return goHome; }, function(g){ goHome = g; }, function(){ H.home(); })
  ];
  // a level already running when this block runs (should not happen: the game opens on Home)
  if(screen === "game" && !manual) begin(levelIdx);
  // ---- page life: hidden = snapshot (and pause the clock); pagehide (not bfcache) = the session ends here
  document.addEventListener("visibilitychange", function(){
    try{
      if(document.hidden){ if(hiddenAt < 0) hiddenAt = performance.now(); write(true); }
      else if(hiddenAt >= 0){ hiddenTot += performance.now() - hiddenAt; hiddenAt = -1; }
    }catch(e){}
  });
  addEventListener("pagehide", function(e){
    try{
      if(e && e.persisted){ write(true); return; }
      if(cur && cur.status === "play") push(attEv(cur, "close"));
      cur = null; push(sessEv("close")); write(false); gone = true;
    }catch(er){}
  });
  addEventListener("pageshow", function(e){ try{ if(e && e.persisted) gone = false; if(e && e.persisted && hiddenAt >= 0){ hiddenTot += performance.now() - hiddenAt; hiddenAt = -1; } }catch(er){} });
  // ---- summary / export
  function med(a){ a = a.filter(function(x){ return x != null && isFinite(x); }).sort(function(x,y){ return x-y; }); if(!a.length) return null;
    var m = a.length >> 1; return a.length % 2 ? a[m] : (a[m-1] + a[m])/2; }
  function events(){
    var ev = st.events.slice();
    if(cur && cur.status === "play"){ var o = attEv(cur, "open"); o.res = "open"; ev.push(o); }
    ev.push(sessEv("open"));
    return ev;
  }
  function summary(){
    var by = {}, ev = events();
    ev.forEach(function(e){
      if(e.t !== "attempt" || e.end === "open") return;
      var s = by[e.lvl] || (by[e.lvl] = { lvl:e.lvl, attempts:0, results:0, wins:0, abandons:0, plan:[], first:[], total:[], watch:[] });
      s.attempts++;
      if(e.end === "result"){ s.results++; if(e.res === "win") s.wins++; s.total.push(e.totalMs); s.watch.push(e.watchMs); }
      else s.abandons++;
      if(e.blastMs != null) s.plan.push(e.blastMs);
      if(e.firstTntMs != null) s.first.push(e.firstTntMs);
    });
    var lv = Object.keys(by).map(Number).sort(function(x,y){ return x-y; }).map(function(k){ var s = by[k];
      function sec(a){ var m = med(a); return m == null ? null : Math.round(m/100)/10; }
      return { lvl:s.lvl, attempts:s.attempts, results:s.results, wins:s.wins, abandons:s.abandons,
        winRate:s.results ? Math.round(100*s.wins/s.results) : null, medFirstTntS:sec(s.first), medPlanS:sec(s.plan), medTotalS:sec(s.total), medWatchS:sec(s.watch) }; });
    var sessions = {}; ev.forEach(function(e){ if(e.t === "session") sessions[e.sid] = e; });
    var sl = Object.keys(sessions).map(function(k){ return sessions[k]; });
    return { levels:lv, sessions:sl.length, medSessionS:sl.length ? Math.round(med(sl.map(function(s){ return s.lenMs; }))/1000) : null,
      events:st.events.length, cap:MET_CAP, current:sessEv("open"), wired:wired.every(Boolean) };
  }
  var CSV_COLS = ["t","sid","aid","ts","iso","lvl","n","end","res","pct","pass","code","rescue","readyMs","firstTntMs","blastMs","auto","blasts","lastBlastMs","resultMs","watchMs","totalMs","placed","removed","moved","hiddenMs","lenMs","wallMs","levels","attempts"];
  function csv(){
    var rows = [CSV_COLS.join(",")];
    events().forEach(function(e){ rows.push(CSV_COLS.map(function(c){
      var v = c === "iso" ? new Date(e.ts).toISOString() : c === "levels" && e.levels ? e.levels.join(" ") : e[c];
      if(v == null) return ""; v = String(v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }).join(",")); });
    return rows.join("\n") + "\n";
  }
  function json(){ return JSON.stringify({ app:"City Blast!", kind:"blast-metrics", v:1, exported:Date.now(), events:events() }, null, 1); }
  function stamp(){ var d = new Date(), p = function(x){ return (x < 10 ? "0" : "") + x; }; return d.getFullYear() + p(d.getMonth()+1) + p(d.getDate()) + "-" + p(d.getHours()) + p(d.getMinutes()); }
  function download(name, text, type){
    var b = new Blob([text], { type:type }), u = URL.createObjectURL(b), a = document.createElement("a");
    a.href = u; a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function(){ URL.revokeObjectURL(u); }, 4000);
  }
  function copy(text, done){
    function fb(){ var ta = document.createElement("textarea"); ta.value = text; ta.setAttribute("readonly", ""); ta.style.cssText = "position:fixed;left:-9999px;top:0";
      document.body.appendChild(ta); ta.select(); var ok = false; try{ ok = document.execCommand("copy"); }catch(e){} ta.remove(); done(ok); }
    try{ if(navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(text).then(function(){ done(true); }, fb); return; } }catch(e){}
    fb();
  }
  function clear(){ st = { v:1, events:[], cnt:{}, open:null }; if(cur && cur.status === "play"){ st.cnt[cur.lvl] = 1; cur.n = 1; } write(true); }
  // ---- the debug panel: built only when opened, plain DOM over everything, removed on close
  var pan = null;
  function fmt(x){ return x == null ? "–" : String(x); }
  function render(){
    if(!pan) return;
    var s = summary(), h = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px"><b>Play-time metrics</b>' +
      '<button data-a="x" style="min-width:44px;min-height:44px;font:inherit;font-size:20px">×</button></div>' +
      '<div style="margin-bottom:6px">Events ' + s.events + '/' + s.cap + ' · sessions ' + s.sessions + ' · median session ' + fmt(s.medSessionS) + ' s · this session ' +
      Math.round(s.current.lenMs/1000) + ' s, ' + s.current.attempts + ' tries</div>' +
      '<table style="border-collapse:collapse;width:100%;font-size:12px"><tr style="text-align:right"><th style="text-align:left">Lv</th><th>Tries</th><th>1st TNT s</th><th>Plan s</th><th>Total s</th><th>Win %</th><th>Quit</th></tr>';
    s.levels.forEach(function(l){ h += '<tr style="text-align:right;border-top:1px solid #555"><td style="text-align:left">' + l.lvl + '</td><td>' + l.attempts + '</td><td>' + fmt(l.medFirstTntS) +
      '</td><td>' + fmt(l.medPlanS) + '</td><td>' + fmt(l.medTotalS) + '</td><td>' + fmt(l.winRate) + '</td><td>' + l.abandons + '</td></tr>'; });
    if(!s.levels.length) h += '<tr><td colspan="7" style="padding:8px 0">No attempts yet.</td></tr>';
    h += '</table><div style="font-size:11px;opacity:.7;margin:4px 0 8px">Medians. Plan = level start → BLAST. Total = level start → result card. Quit = left without a result.</div>' +
      '<div style="display:flex;flex-wrap:wrap;gap:6px">' + [["copy","Copy JSON"],["json","Download JSON"],["csv","Download CSV"],["clear","Clear"]].map(function(b){
        return '<button data-a="' + b[0] + '" style="min-height:44px;padding:0 10px;font:inherit;border-radius:8px;border:1px solid #888;background:#fff;color:#111">' + b[1] + '</button>'; }).join("") +
      '</div><div data-a="msg" style="min-height:18px;margin-top:6px"></div>';
    pan.innerHTML = h;
  }
  function msg(t){ var m = pan && pan.querySelector('[data-a="msg"]'); if(m) m.textContent = t; }
  function openPanel(on){
    if(on === false || (on == null && pan)){ if(pan){ pan.remove(); pan = null; } return false; }
    if(pan){ render(); return true; }
    pan = document.createElement("div"); pan.id = "metPanel";
    pan.style.cssText = "position:fixed;left:8px;right:8px;top:8px;max-height:calc(100% - 16px);overflow:auto;z-index:2147483000;background:rgba(20,20,24,.94);color:#eee;" +
      "font:13px/1.35 -apple-system,system-ui,sans-serif;padding:10px 12px;border-radius:10px;box-shadow:0 4px 18px rgba(0,0,0,.5);-webkit-user-select:text;user-select:text;touch-action:pan-y";
    ["pointerdown","pointerup","touchstart","touchend","mousedown","mouseup","click","wheel"].forEach(function(t){ pan.addEventListener(t, function(e){ e.stopPropagation(); }, { passive:true }); });
    pan.addEventListener("click", function(e){
      var b = e.target.closest && e.target.closest("[data-a]"); if(!b) return; var a = b.getAttribute("data-a");
      if(a === "x") openPanel(false);
      else if(a === "copy") copy(json(), function(ok){ msg(ok ? "Copied." : "Copy failed: use Download JSON."); });
      else if(a === "json"){ download("blast-metrics-" + stamp() + ".json", json(), "application/json"); msg("Downloaded."); }
      else if(a === "csv"){ download("blast-metrics-" + stamp() + ".csv", csv(), "text/csv"); msg("Downloaded."); }
      else if(a === "clear"){ if(b.getAttribute("data-sure")){ clear(); render(); msg("Cleared."); } else { b.setAttribute("data-sure", "1"); b.textContent = "Tap again to clear"; } }
    });
    document.body.appendChild(pan); render(); return true;
  }
  // 5 taps on the Home logo within 3 s (capture listener: it only counts, it never stops or changes the tap)
  var taps = [];
  addEventListener("pointerdown", function(e){
    try{
      if(screen !== "title" || pan) return;
      var lg = document.querySelector("#title .logo"); if(!lg) return;
      var r = lg.getBoundingClientRect(); if(!r.width || e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) { taps = []; return; }
      var t = performance.now(); taps = taps.filter(function(x){ return t - x < 3000; }); taps.push(t);
      if(taps.length >= 5){ taps = []; openPanel(true); }
    }catch(er){}
  }, true);
  if(QS.get("metrics") === "1") setTimeout(function(){ try{ openPanel(true); }catch(e){} }, 0);
  return { dump:function(){ return JSON.parse(json()); }, summary:summary, clear:function(){ clear(); render(); return true; }, csv:csv,
    panel:function(on){ return openPanel(on); }, key:BLAST_MET_KEY, cap:MET_CAP, wired:function(){ return wired.slice(); } };
})();
if(window.__blast) window.__blast.metrics = MET;
// ---- end metrics v13
