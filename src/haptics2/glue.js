// ---- haptics2 (haptics2/patch.js, HAPTICS-V2.md §4.1): game moments -> window.Haptics (haptics2/haptics2.js) ----
// hg(...) is the only thing the hooks call: never throws, does nothing without the facade. Mute does NOT gate it (H1):
// every hook sits before the SFX checks, and the facade owns navigator.vibrate (the SFX `hap` patterns are inert).
function hg(m){ var H = window.HG2; if(!H || !H[m]) return; try{ return H[m].apply(H, [].slice.call(arguments, 1)); }catch(e){} }
window.HG2 = (function(){
  var Hx = window.Haptics; if(!Hx) return null;
  Hx.setReduced(function(){ return typeof REDUCED !== "undefined" && !!REDUCED; });
  var claimT = -1e9, lvl = { timber:0, pass:0 }, wv = { keep:false, street:false, groups:[], fired:{}, bad:{ keep:false, street:false } };
  function now(){ return performance.now(); }
  // an explicit hook claims the moment: the generic snd() mapping below stays out of it for 25 ms
  function play(id, o){ claimT = now(); return Hx.play(id, o); }
  // generic mapping of game sounds that have no hook of their own (38 ui_tap calls, upgrade, unlock, materials...)
  var SND = { ui_tap:1, remove:"remove", upgrade:"upgrade", unlock:"unlock_card", protected_hit:1, metal_groan:"groan",
    fuel_cookoff:"fuel_cookoff", timber:"timber", steel_clang:"mat_steel", concrete_crack:"mat_brick", beam_snap:"mat_wood",
    glass_shatter:"mat_glass", debris:1 };
  function sndMap(name, p){
    var m = SND[name]; if(!m || now() - claimT < 25) return;
    p = p || {};
    if(/^mat_|^groan$|^fuel/.test(m) && !live()) return;
    if(name === "ui_tap") m = p.gain != null && p.gain < 0.5 ? "invalid" : "ui_tap";              // tap on nothing: "Tap a building"
    else if(name === "protected_hit") m = p.gain != null ? "invalid" : "protected_tap";         // Ball "Can't reach / Blocked" used it (gain .4/.6)
    else if(name === "debris"){ if((p.mass || 1) < 1.5) return; m = "mat_concrete"; }            // heavy landings only
    Hx.play(m);
  }
  var MAT = { beam_snap:"mat_wood", concrete_crack:"mat_brick", glass_shatter:"mat_glass", steel_clang:"mat_steel", debris:"mat_concrete", crumble:"mat_brick" };
  var IMPM = { concrete:"mat_concrete", glass:"mat_glass", steel:"mat_steel", crate:"mat_wood" };
  function live(){ return phase === "boom" || phase === "settle"; }   // collapse textures only while it comes down
  function near(a, b, r){ var dx = a.x - b.x, dy = a.y - b.y, dz = a.z - b.z; return dx*dx + dy*dy + dz*dz < r*r; }
  var api = {
    play:play,
    cancel:function(id){ Hx.cancel(id); },
    snd:sndMap,
    level:function(){ lvl = { timber:0, pass:0 }; Hx.reset(); },
    // place: the 2nd TNT within 1.5 m of an unfired one is a stack (3rd = stack3), as levels6 detonateAll groups them
    place:function(c){
      var n = 0; charges.forEach(function(o){ if(o !== c && !o.fired && o.mesh && near(o.mesh.position, c.mesh.position, 1.5)) n++; });
      play(n >= 2 ? "place_stack3" : n === 1 ? "place_stack" : "place_tnt");
    },
    near:function(){ Hx.play("protected_near", { delay:140 }); },
    // wave start: stack groups (union of charges within 1.5 m) and the once-per-wave warnings
    wave:function(list){
      Hx.newWave(); wv.bad = { keep:false, street:false };
      var g = list.map(function(c, i){ return i; });
      function root(i){ while(g[i] !== i) i = g[i]; return i; }
      for(var i=0;i<list.length;i++) for(var j=i+1;j<list.length;j++) if(near(list[i].mesh.position, list[j].mesh.position, 1.5)) g[root(j)] = root(i);
      wv.groups = list.map(function(c, i){ var r = root(i), n = 0; for(var k=0;k<list.length;k++) if(root(k) === r) n++; return { p:c.mesh.position.clone(), grp:r, stacked:n > 1, done:false }; });
      wv.fired = {};
    },
    // every boom (audBoom): i = index in the wave. 1st = signature (+25 ms, the SFX inhale), stack head, followers
    boom:function(i, origin){
      var e = null, best = 1e9;
      wv.groups.forEach(function(x){ if(x.done) return; var d = x.p.distanceTo(origin); if(d < best){ best = d; e = x; } });
      if(e && best < 0.8) e.done = true; else e = null;
      var stacked = !!(e && e.stacked), head = stacked && !wv.fired[e.grp];
      if(e) wv.fired[e.grp] = true;
      if(i === 0) return play(stacked ? "boom_stack_head" : "boom_first", { delay:(window.SFX && SFX.INHALE ? SFX.INHALE*1000 : 25) });
      if(head) return play("boom_stack");
      play("boom_follow", { lv:i >= 3 ? "L" : "M" });
    },
    timber:function(){ lvl.timber++; play("timber"); },   // every TIMBER: H·H·H 80 ms apart, solo (haptics2.js)
    pancake:function(b){ if(live()) Hx.play("pancake", { lv:(b.floor || 0) <= 1 ? "H" : "M" }); },
    mat:function(name){ var m = MAT[name]; if(m && live()){ claimT = now(); Hx.play(m); } },
    impact:function(o, dv){ if(!live()) return; var m = matOf(o.key), J = (o.mass || 0)*dv; if(J < (IMP_J[m] || 2500)*2) return; claimT = now(); if(IMPM[m]) Hx.play(IMPM[m]); },
    pass:function(){ if(!lvl.pass++) play("pass_cross"); },
    // live HUD: the pill turning red (rising edge), once per wave, only while the building comes down
    live:function(keepBad, streetBad){
      if(phase !== "boom" && phase !== "settle") return;
      if(keepBad && !wv.bad.keep){ wv.bad.keep = true; Hx.play("protected_warn"); }
      if(streetBad && !wv.bad.street){ wv.bad.street = true; Hx.play("street_warn"); }
    },
    result:function(r){ play(r.ok ? "win" : (r.code === "collateral" || r.code === "street") ? "lose_rule" : "lose"); },
    // coins landing in the pill: a selection tick on coins 1, 3, 5... (<= 8), the last one M (the pill bumps)
    coin:function(done, n){ if(done >= n) play("coin_last"); else if(done % 2 === 1 && done < n - 1) Hx.play("coin_tick"); }
  };
  // ---- Settings > Vibration (and the same switch in Pause): independent of Sound, stored by the facade
  (function(){
    var b = $("vibTog"), pv = $("pmVib"), hide = Hx.platform === "none";
    var ICON = '<svg class="i s24" viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="3" width="10" height="18" rx="2.5" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M3.5 8v8M20.5 8v8" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>';
    function sync(){
      var on = Hx.enabled();
      if(b){ b.classList.toggle("hidden", hide); b.innerHTML = ICON + ' Vibration<span class="sw">' + (on ? "ON" : "OFF") + '</span>'; b.classList.toggle("off", !on); b.setAttribute("aria-pressed", String(on)); }
      if(pv){ pv.classList.toggle("hidden", hide); pv.classList.toggle("on", on); pv.setAttribute("aria-checked", on ? "true" : "false"); }
    }
    if(b) b.addEventListener("click", function(){ audioInit(); var on = !Hx.enabled(); Hx.setEnabled(on); sync(); snd("ui_tap"); if(on) play("toggle_on"); });
    if(pv) pv.addEventListener("click", function(){ if(b) b.click(); sync(); });
    var pm = $("pauseM"); if(pm && window.MutationObserver) new MutationObserver(function(){ if(!pm.classList.contains("hidden")) sync(); }).observe(pm, { attributes:true, attributeFilter:["class"] });
    sync();
  })();
  // debug API: window.__blast.haptics (log = every fired hit with time + level)
  api.dbg = { log:Hx.log, drops:Hx.drops, stats:Hx.stats, clear:Hx.clear, settings:Hx.settings,
    enable:function(on){ Hx.setEnabled(on !== false); var b = $("vibTog"); if(b){ b.classList.toggle("off", on === false); } return Hx.enabled(); },
    play:function(id, o){ return Hx.play(id, o); }, events:function(){ return Object.keys(Hx.EVENTS); },
    get platform(){ return Hx.platform; } };
  return api;
})();
// ---- end haptics2
