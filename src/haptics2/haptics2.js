/* City Blast!: haptics facade v2, step 1 of HAPTICS-V2.md §4.2 (JS only, no native code).
 * Based on games/blast-haptics/haptics.js (v1 design); event table = HAPTICS-V2.md §2 column (a).
 *
 *   Haptics.play("boom_first", { delay: 25 })        one call per game moment (game side: haptics2/glue.js)
 *
 * Every event is a list of hits [ms, level]. Levels (the 3-level path iOS has today):
 *   L / M / H = impact LIGHT / MEDIUM / HEAVY · S = selection · OK = notification SUCCESS · W = notification WARNING
 * Routes (best first):
 *   "simple" Capacitor native + @capacitor/haptics: impact / selectionChanged / notification, called directly.
 *   "bridge" Capacitor native, no Haptics plugin object but native-bridge.js's navigator.vibrate: each hit becomes one
 *            pulse whose length lands in the bridge's own bands (<=12 ms LIGHT, <=30 ms MEDIUM, longer HEAVY):
 *            L 10 · M 24 · H 45 · S 10 · OK 24 · W 24. The bridge itself is NOT changed.
 *   "web"    Android Chrome / Firefox: navigator.vibrate pulses (L 10 · M 20 · H 40 · S 6 · OK [15,50,25] · W [25,60,25,60,20]).
 *   "none"   iOS Safari, desktop without vibrate: every call is a no-op (Settings hides the Vibration row).
 * The facade OWNS navigator.vibrate: it keeps the real one (or the native bridge's) for itself and replaces the global
 * with a no-op, so the SFX engine's own `hap` patterns (gated by mute, H1), SFX.haptic(...) (H5-H7) and the juice
 * fallback can no longer vibrate twice. If this file fails to load, native-bridge.js keeps working as before.
 *
 * Budget (HAPTICS-V2.md §1.2), on the hit timeline (fired + scheduled):
 *   - any 1 s window <= 10 hits (priority >= 3 only up to 8: two slots stay free for a signature), >= 40 ms apart;
 *   - a clash keeps the higher priority (a scheduled lower one is cancelled; a fired one wins and the new one is
 *     dropped, except priority 1-2 hits, which are nudged later by <= 2 x 40 ms: a boom head is never lost);
 *   - solo (TIMBER): the pattern + `solo` ms belongs to it alone: every other event is dropped, any priority;
 *   - focus windows: after a signature (focus ms from its head) every hit of priority >= 3 is dropped (and scheduled
 *     ones inside the window are cancelled); PASS has a 500 ms hush the same way;
 *   - per event: cd (ms between two calls), cap (calls per s), capGroup (shared cap, e.g. mat_* 4/s), perWave.
 * Reduce motion (game setting or OS): rumble tails cut to <= 300 ms (TIMBER's 3 taps are kept). iOS System Haptics cannot be
 * read from JS; the game's own Vibration switch is the guarantee (HAPTICS-V2.md §4.3).
 * Debug: Haptics.log() = every fired hit {t, ev, lv, pri, at, via}; Haptics.drops(); ?hapdbg=1 prints each one.
 */
(function (root) {
  'use strict';

  // pri 1 = most important. hits: [[ms, level], ...]. focus: ms after the head where pri >= 3 is dropped.
  // rumble: tail trimmed by Reduce motion. stretch: hit times scale with opts.stretch.
  var EV = {
    // 2.1 home, map, UI
    ui_tap:        { pri: 5, cd: 50,   hits: [[0, 'L']] },
    play_tap:      { pri: 4, cd: 300,  hits: [[0, 'M']] },
    toggle:        { pri: 5, cd: 100,  hits: [[0, 'S']] },
    toggle_on:     { pri: 4, cd: 100,  hits: [[0, 'M']] },          // Vibration switched on: one sample hit
    invalid:       { pri: 3, cd: 300,  hits: [[0, 'L']] },
    hard_intro:    { pri: 3, cd: 2000, hits: [[0, 'M'], [180, 'L']] },
    // 2.2 plan
    place_tnt:     { pri: 2, cd: 80,   hits: [[0, 'M'], [70, 'L']] },
    place_stack:   { pri: 2, cd: 80,   hits: [[0, 'H'], [60, 'M']] },
    place_stack3:  { pri: 2, cd: 80,   hits: [[0, 'H'], [60, 'M'], [120, 'M']] },
    remove:        { pri: 3, cd: 80,   hits: [[0, 'L']] },
    protected_tap: { pri: 2, cd: 600,  hits: [[0, 'L'], [120, 'L']] },
    protected_near:{ pri: 2, cd: 600,  hits: [[0, 'L']] },          // the game calls it with delay 140 after the place
    booster_arm:   { pri: 4, cd: 100,  hits: [[0, 'S']] },
    wave_ready:    { pri: 3, cd: 1000, hits: [[0, 'L']] },
    // 2.3 countdown and booms
    blast_press:   { pri: 1, cd: 400,  focus: 500, hits: [[0, 'H'], [150, 'M'], [300, 'H']] },   // then 200 ms "inhale"
    auto_fuse:     { pri: 2, cd: 800,  focus: 1000, stretch: true, hits: [[200, 'L'], [450, 'L'], [700, 'M']] },
    boom_first:    { pri: 1, focus: 350, rumble: true, hits: [[0, 'H'], [60, 'H'], [450, 'M'], [700, 'L']] },
    boom_stack_head:{ pri: 1, focus: 400, rumble: true, hits: [[0, 'H'], [50, 'H'], [110, 'H'], [450, 'M'], [700, 'L']] },
    boom_stack:    { pri: 1, focus: 400, hits: [[0, 'H'], [50, 'M']] },
    boom_follow:   { pri: 1, hits: [[0, 'M']] },                    // 4th+ of a wave: the game passes lv 'L'
    fuel_cookoff:  { pri: 3, cap: 4,   hits: [[0, 'L']] },
    // 2.4 collapse and materials
    groan:         { pri: 3, cd: 3000, hits: [[0, 'L'], [220, 'L']] },
    // TIMBER (Owner 15/11): 3 native HEAVY impacts 80 ms apart ("da-da-dam"), every TIMBER; solo = nothing else for the
    // pattern + 150 ms (every other event, any priority, is dropped / its scheduled hits cancelled). cdKey + cd 400 =
    // several buildings going at once (or timber + timber_short) coalesce into one pattern.
    timber:        { pri: 1, cd: 400, cdKey: 'timber', solo: 150, hits: [[0, 'H'], [80, 'H'], [160, 'H']] },
    timber_short:  { pri: 1, cd: 400, cdKey: 'timber', solo: 150, hits: [[0, 'H'], [80, 'H'], [160, 'H']] },   // alias of timber
    timber_catch:  { pri: 2, cd: 2000, hits: [[0, 'M']] },
    pancake:       { pri: 3, cd: 100,  cap: 5, perWave: 8, hits: [[0, 'M']] },   // floor 0-1: the game passes lv 'H'
    mat_wood:      { pri: 4, cd: 200,  capGroup: 'mat', hits: [[0, 'L'], [45, 'L']] },
    mat_brick:     { pri: 4, cd: 250,  capGroup: 'mat', hits: [[0, 'L']] },
    mat_concrete:  { pri: 4, cd: 200,  capGroup: 'mat', hits: [[0, 'M']] },
    mat_steel:     { pri: 4, cd: 300,  capGroup: 'mat', hits: [[0, 'M'], [60, 'L']] },
    mat_glass:     { pri: 4, cd: 250,  capGroup: 'mat', hits: [[0, 'L']] },
    // 2.5 level rules
    pass_cross:    { pri: 1, cd: 5000, focus: 500, hits: [[0, 'M']] },          // + 500 ms hush
    protected_warn:{ pri: 2, afterFocus: true, hits: [[0, 'W']] },              // once per wave (game side)
    street_warn:   { pri: 3, hits: [[0, 'M'], [100, 'L']] },                    // once per wave (game side)
    // 2.6 boosters
    ball_swing:    { pri: 2, cd: 600,  hits: [[0, 'L']] },
    ball_impact:   { pri: 1, focus: 400, rumble: true, hits: [[0, 'H'], [50, 'H'], [130, 'M'], [400, 'L']] },
    ball_impact_steel: { pri: 1, focus: 400, hits: [[0, 'H'], [60, 'M']] },
    sky_marker:    { pri: 2, cd: 600,  focus: 750, hits: [[0, 'L'], [120, 'L'], [400, 'L'], [500, 'L']] },   // silent 500-750
    sky_impact:    { pri: 1, focus: 450, rumble: true, hits: [[0, 'H'], [45, 'H'], [140, 'M'], [260, 'M'], [500, 'L']] },
    // 2.7 result and meta
    win:           { pri: 1, cd: 1500, hits: [[0, 'OK']] },
    lose:          { pri: 1, cd: 1500, hits: [[0, 'L']] },
    lose_rule:     { pri: 1, cd: 1500, hits: [[0, 'L'], [140, 'L']] },
    rescue:        { pri: 2, cd: 300,  hits: [[0, 'M'], [80, 'L']] },
    coin_tick:     { pri: 3, cap: 8,   hits: [[0, 'S']] },
    coin_last:     { pri: 2, cd: 500,  hits: [[0, 'M']] },
    unlock_card:   { pri: 2, cd: 1500, absorbs: { coin_tick: 1500 }, hits: [[0, 'L'], [120, 'M'], [240, 'H']] },
    upgrade:       { pri: 2, cd: 300,  hits: [[0, 'M'], [80, 'L']] },
    tutorial_ok:   { pri: 3, cd: 500,  hits: [[0, 'L'], [70, 'L']] }
  };
  var GROUP_CAP = { mat: 4 };

  var CFG = { maxPerSec: 10, reserve: 2, minGapMs: 40, nudgeMax: 2, storageKey: 'blastRush.haptics.v1', debug: false, logMax: 4000 };
  var BRIDGE_MS = { L: 10, M: 24, H: 45, S: 10, OK: 24, W: 24 };
  var WEB_MS = { L: 10, M: 20, H: 40, S: 6, OK: [15, 50, 25], W: [25, 60, 25, 60, 20] };
  var STYLE = { L: 'LIGHT', M: 'MEDIUM', H: 'HEAVY' };

  var state = { enabled: true };
  var platform = 'none', simpleH = null, rawVibrate = null, detected = false;
  var fired = [], pending = [], lastAt = {}, perSec = {}, groupSec = {}, waveCount = {}, absorbed = {};
  var focusFrom = 0, focusUntil = 0, focusEv = null, lastFire = -1e9, soloFrom = 0, soloUntil = 0, soloEv = null, soloLast = null;
  var stats = { calls: 0, events: 0, hits: 0, dropped: {}, over: 0, nudged: 0, cancelled: 0, byEvent: {} };
  var log = [], drops = [], reducedFn = null, t0 = now();

  // solo window: [soloFrom, soloUntil), held open while the pattern's last tap is still to come (a late timer)
  function soloLive() { return !!(soloLast && !soloLast.done); }
  function inSolo(at) { return at >= soloFrom && (at < soloUntil || (soloLive() && at <= now() + CFG.minGapMs)); }
  function now() { return (root.performance && root.performance.now) ? root.performance.now() : Date.now(); }
  function rel(t) { return Math.round((t - t0) * 10) / 10; }
  function dropEv(why, name) {
    stats.dropped[why] = (stats.dropped[why] || 0) + 1;
    if (drops.length < CFG.logMax) drops.push({ t: rel(now()), ev: name, why: why });
    if (CFG.debug) try { console.log('[hap] drop ' + name + ' (' + why + ')'); } catch (e) { }
    return false;
  }

  function loadSettings() {
    try { var s = JSON.parse(root.localStorage.getItem(CFG.storageKey) || 'null'); if (s) state.enabled = s.enabled !== false; } catch (e) { }
  }
  function saveSettings() { try { root.localStorage.setItem(CFG.storageKey, JSON.stringify({ enabled: state.enabled })); } catch (e) { } }
  function isIOS() { var n = root.navigator || {}; return /iPad|iPhone|iPod/.test(n.userAgent || '') || (n.platform === 'MacIntel' && n.maxTouchPoints > 1); }

  function detect() {
    var C = root.Capacitor, nav = root.navigator, native = false;
    try { native = !!(C && C.isNativePlatform && C.isNativePlatform()); } catch (e) { }
    if (!rawVibrate && nav && typeof nav.vibrate === 'function' && !nav.vibrate.__hapNoop) {
      var v = nav.vibrate; rawVibrate = function (p) { try { return v.call(nav, p); } catch (e) { return false; } };
    }
    if (native && C.Plugins && C.Plugins.Haptics && typeof C.Plugins.Haptics.impact === 'function') { simpleH = C.Plugins.Haptics; platform = 'simple'; }
    else if (native && rawVibrate) platform = 'bridge';
    else if (!native && rawVibrate && !isIOS()) platform = 'web';
    else platform = 'none';
    // own navigator.vibrate: the SFX engine / juice / native bridge patterns must not vibrate a second time
    if (nav && typeof nav.vibrate === 'function' && !nav.vibrate.__hapNoop) {
      var noop = function () { return false; }; noop.__hapNoop = true;
      try { Object.defineProperty(nav, 'vibrate', { value: noop, configurable: true, writable: true }); } catch (e) { try { nav.vibrate = noop; } catch (e2) { } }
    }
    detected = true;
  }
  function reduced() { try { if (reducedFn) return !!reducedFn(); } catch (e) { } try { return !!(root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches); } catch (e) { return false; } }

  // ---- hit timeline -----------------------------------------------------------------------------------
  function prune(t) {
    fired = fired.filter(function (h) { return t - h.at < 2100; });
    pending = pending.filter(function (h) { return !h.done; });
  }
  function maxWindowCount(list, at) {   // most hits in any 1 s window [s, s+1000) that contains `at`
    var ts = list.map(function (h) { return h.at; }).filter(function (x) { return x > at - 1000 && x < at + 1000; });
    ts.push(at); ts.sort(function (a, b) { return a - b; });
    var best = 0;
    for (var i = 0; i < ts.length; i++) {
      var s = ts[i]; if (s > at || s <= at - 1000) continue;
      var n = 0; for (var j = 0; j < ts.length; j++) if (ts[j] >= s && ts[j] < s + 1000) n++;
      if (n > best) best = n;
    }
    // windows that start before the first hit but still contain `at`
    var n2 = 0; for (var k = 0; k < ts.length; k++) if (ts[k] > at - 1000 && ts[k] <= at) n2++;
    return Math.max(best, n2);
  }
  function cancelHit(h, why) { if (h.done) return; h.done = true; if (h.timer) clearTimeout(h.timer); stats.cancelled++; dropEv(why, h.ev + '#' + h.i); }

  // try to put one hit on the timeline; returns true if scheduled
  function admit(h) {
    var all, i, c, tries = 0;
    if (h.ev !== soloEv && inSolo(h.at)) return dropEv('solo', h.ev + '#' + h.i);
    if (h.pri >= 3 && h.ev !== focusEv && h.at >= focusFrom && h.at < focusUntil) return dropEv('focus', h.ev + '#' + h.i);
    for (;;) {
      all = fired.concat(pending.filter(function (x) { return !x.done; }));
      var clash = null;
      for (i = 0; i < all.length; i++) { c = all[i]; if (Math.abs(c.at - h.at) < CFG.minGapMs) { clash = c; break; } }
      if (!clash) break;
      if (!clash.fired && clash.pri > h.pri && !clash.must) { cancelHit(clash, 'gap-lost'); continue; }
      if ((h.must || h.pri <= 2) && tries < CFG.nudgeMax) { h.at = clash.at + CFG.minGapMs; tries++; stats.nudged++; continue; }
      return dropEv('gap', h.ev + '#' + h.i);
    }
    all = fired.concat(pending.filter(function (x) { return !x.done; }));
    var cap = h.pri >= 3 ? CFG.maxPerSec - CFG.reserve : CFG.maxPerSec;   // the last 2 slots of a second are kept for signatures
    while (maxWindowCount(all, h.at) > cap) {
      var victim = null;
      pending.forEach(function (x) { if (x.done || x.must || x.pri <= h.pri || Math.abs(x.at - h.at) >= 1000) return; if (!victim || x.pri > victim.pri || (x.pri === victim.pri && x.at > victim.at)) victim = x; });
      if (!victim) { if (h.must) { stats.over++; break; } return dropEv('budget', h.ev + '#' + h.i); }
      cancelHit(victim, 'budget-lost');
      all = fired.concat(pending.filter(function (x) { return !x.done; }));
    }
    pending.push(h);
    var d = h.at - now();
    if (d <= 1) fire(h); else h.timer = setTimeout(function () { fire(h); }, d);
    return true;
  }

  function fire(h) {
    if (h.done) return;
    var t = now();
    if (h.ev !== soloEv && t >= soloFrom && (t < soloUntil || soloLive())) { h.done = true; dropEv('solo', h.ev + '#' + h.i); return; }   // a late timer inside a solo window
    if (h.prev && !h.prev.fired && !h.prev.done) { h.timer = setTimeout(function () { fire(h); }, h.gap); return; }   // solo chain: keep the order
    if (h.prev && h.prev.fired && t < h.prev.at + h.gap - 3) { h.timer = setTimeout(function () { fire(h); }, h.prev.at + h.gap - t); return; }
    if (t - lastFire < CFG.minGapMs) {               // timer jitter: keep the real gap >= 40 ms too
      if (h.pri <= 3) { h.at = lastFire + CFG.minGapMs; h.timer = setTimeout(function () { fire(h); }, h.at - t); return; }
      h.done = true; dropEv('jitter', h.ev + '#' + h.i); return;
    }
    if (!state.enabled) { h.done = true; return; }
    h.done = true; h.fired = true; h.at = t; lastFire = t; fired.push(h); stats.hits++;
    var entry = { t: rel(t), ev: h.ev, lv: h.lv, pri: h.pri, i: h.i, sched: rel(h.sched), via: platform };
    if (log.length < CFG.logMax) log.push(entry);
    if (CFG.debug) try { console.log('[hap] ' + entry.t + ' ' + h.ev + ' ' + h.lv); } catch (e) { }
    if (h.tail != null) {                              // solo: spacing counts from this real tap; the window follows a late pattern
      soloUntil = Math.max(soloUntil, t + h.tail);
      if (h.next && !h.next.done) { clearTimeout(h.next.timer); var nx = h.next; nx.timer = setTimeout(function () { fire(nx); }, nx.gap); }
    }
    if (api.onfire) try { api.onfire(entry); } catch (e) { }
    try { out(h.lv); } catch (e) { }
  }

  function out(lv) {
    if (platform === 'simple') {
      var H = simpleH;
      if (STYLE[lv]) H.impact({ style: STYLE[lv] });
      else if (lv === 'S') { if (H.selectionStart) H.selectionStart(); H.selectionChanged(); if (H.selectionEnd) H.selectionEnd(); }
      else if (lv === 'OK') H.notification({ type: 'SUCCESS' });
      else if (lv === 'W') H.notification({ type: 'WARNING' });
    } else if (platform === 'bridge') rawVibrate([BRIDGE_MS[lv] || 24]);
    else if (platform === 'web') { var p = WEB_MS[lv] || 20; rawVibrate(typeof p === 'number' ? [p] : p); }
  }

  // ---- events ---------------------------------------------------------------------------------------
  function play(name, o) {
    o = o || {};
    stats.calls++;
    if (!detected) detect();
    var d = EV[name];
    if (!d) return dropEv('unknown', name);
    if (!state.enabled) return dropEv('off', name);
    if (platform === 'none') return dropEv('none', name);
    var t = now(); prune(t);
    if (absorbed[name] && t < absorbed[name]) return dropEv('absorbed', name);
    var ck = d.cdKey || name;
    if (d.cd && lastAt[ck] != null && t - lastAt[ck] < d.cd) return dropEv('cooldown', name);
    if (d.cap) { perSec[name] = (perSec[name] || []).filter(function (x) { return t - x < 1000; }); if (perSec[name].length >= d.cap) return dropEv('cap', name); }
    if (d.capGroup) { var g = groupSec[d.capGroup] = (groupSec[d.capGroup] || []).filter(function (x) { return t - x < 1000; }); if (g.length >= GROUP_CAP[d.capGroup]) return dropEv('cap-group', name); }
    if (d.perWave && (waveCount[name] || 0) >= d.perWave) return dropEv('wave-cap', name);
    var t0h = t + Math.max(0, +o.delay || 0);
    if (d.afterFocus && t0h < focusUntil) t0h = focusUntil + 5;
    if (!d.solo && inSolo(t0h)) return dropEv('solo', name);
    if (d.pri >= 3 && t0h >= focusFrom && t0h < focusUntil) return dropEv('focus', name);
    var k = d.stretch && o.stretch ? +o.stretch : 1, rm = reduced(), cut = d.rumble === true ? 300 : d.rumble || 0;
    var hits = (o.hits || d.hits).filter(function (s) { return !(rm && cut && s[0] > cut); });
    lastAt[ck] = t;
    if (d.cap) perSec[name].push(t);
    if (d.capGroup) groupSec[d.capGroup].push(t);
    if (d.perWave) waveCount[name] = (waveCount[name] || 0) + 1;
    if (d.absorbs) for (var a in d.absorbs) absorbed[a] = t + d.absorbs[a];
    stats.events++; stats.byEvent[name] = (stats.byEvent[name] || 0) + 1;
    if (d.solo) {                                      // solo: the pattern plays alone, at its exact spacing
      if (t0h - lastFire < CFG.minGapMs) t0h = lastFire + CFG.minGapMs;
      soloFrom = t0h; soloUntil = t0h + hits[hits.length - 1][0] * k + d.solo; soloEv = name;
      pending.forEach(function (x) { if (!x.done && x.ev !== name && x.at > soloFrom - CFG.minGapMs && x.at < soloUntil) cancelHit(x, 'solo-lost'); });
    }
    var headAt = null, n = 0, prevH = null, lastS = hits.length ? hits[hits.length - 1][0] * k : 0;
    hits.forEach(function (s, i) {
      var lv = (i === 0 && o.lv) ? o.lv : s[1];
      var h = { ev: name, i: i, lv: lv, at: t0h + s[0] * k, sched: t0h + s[0] * k, pri: d.pri === 1 && s[0] * k >= 150 && !d.solo ? 2 : d.pri, must: !!d.solo || (i === 0 && d.pri === 1) };
      if (d.solo) { h.tail = lastS - s[0] * k + d.solo; if (prevH) { h.prev = prevH; h.gap = (s[0] - hits[i - 1][0]) * k; prevH.next = h; } prevH = h; if (i === hits.length - 1) soloLast = h; }
      if (admit(h)) { n++; if (i === 0) headAt = h.at; }
      if (i === 0 && headAt != null && d.focus) {      // the signature owns the next `focus` ms
        focusFrom = headAt; focusUntil = Math.max(focusUntil, headAt + d.focus * k); focusEv = name;
        pending.forEach(function (x) { if (!x.done && x.ev !== name && x.pri >= 3 && x.at >= focusFrom && x.at < focusUntil) cancelHit(x, 'focus-lost'); });
      }
    });
    return n > 0;
  }

  function cancel(name) { pending.forEach(function (h) { if (!h.done && (!name || h.ev === name)) cancelHit(h, 'cancel'); }); }

  var api = {
    play: play,
    cancel: cancel,
    stopAll: function () { cancel(); },
    newWave: function () { waveCount = {}; },
    setEnabled: function (b) { state.enabled = !!b; saveSettings(); if (!b) cancel(); },
    enabled: function () { return state.enabled; },
    setReduced: function (fn) { reducedFn = fn; },
    settings: function () { if (!detected) detect(); return { enabled: state.enabled, platform: platform, reduced: reduced() }; },
    stats: function () { return JSON.parse(JSON.stringify(stats)); },
    log: function () { return log.slice(); },
    drops: function () { return drops.slice(); },
    clear: function () { log = []; drops = []; stats = { calls: 0, events: 0, hits: 0, dropped: {}, over: 0, nudged: 0, cancelled: 0, byEvent: {} }; },
    reset: function () { cancel(); fired = []; pending = []; lastAt = {}; perSec = {}; groupSec = {}; waveCount = {}; absorbed = {}; focusFrom = focusUntil = 0; focusEv = null; lastFire = -1e9; soloFrom = soloUntil = 0; soloEv = null; soloLast = null; },
    redetect: function () { rawVibrate = rawVibrate || null; detect(); return platform; },
    config: CFG,
    EVENTS: EV,
    onfire: null
  };
  Object.defineProperty(api, 'platform', { get: function () { if (!detected) detect(); return platform; } });

  loadSettings();
  detect();
  try { if (/[?&]hapdbg=1/.test(root.location.search)) CFG.debug = true; } catch (e) { }
  if (root.document && root.document.addEventListener) root.document.addEventListener('visibilitychange', function () { if (root.document.hidden) cancel(); });

  root.Haptics = api;
  if (typeof module === 'object' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
