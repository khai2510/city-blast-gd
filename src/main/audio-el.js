// ---- main/audio-el.js (D-blast-AUDIO-EL, 13/11/2026): ElevenLabs music, city ambience, random one-shots, accent stings.
// Appended at the end of main() by `main/glue.js audio` (build-main.js step "audio-el"); /*@@EL_AUDIO@@*/ is replaced by the base64 set (audio/el/*.mp3).
// It WRAPS the window.SFX facade and does not edit the engine: music / musicState / musicDuck / musicSting / setSlowmo / setMusicVolume / mute / play / unlock.
//   - the procedural groove is switched off (SFX.music(false) underneath); the Music switch (save.music via SFX.music) drives the new tracks
//   - menu / map / shop = the "menu" loop, plan / count / blast = the "play" loop, 0.8 s crossfade; result keeps what plays; ducks and slow-mo filter follow
//   - ambience bed (looping, low-pass in menus), random city one-shot every 6-18 s (never during the BLAST count / blast / slow-mo), all behind the Sound switch (save.mute)
//   - stings: unlock card, "New:" card, Hard / Boss banner, win, lose. Nothing starts before the first gesture (it is created inside SFX.unlock()).
//   - ?bgm=0 = the old procedural music (this block does nothing), ?bgm=2 = the other take (fetched from ../audio/el/*-alt.mp3, falls back to the embedded one),
//     ?bgmvol=0.5 = music level x0.5 (tuning).   Test hook: window.__blast.elAudio
try{ (function(){
  var Q = new URLSearchParams(location.search), BG = Q.get("bgm");
  if(BG === "0" || !window.SFX) return;
  var DATA = /*@@EL_AUDIO@@*/null;
  if(!DATA) return;
  var SF = window.SFX, ctx = null, g = {};
  var MVOL = Math.max(0, Math.min(2, parseFloat(Q.get("bgmvol")) || 1));
  var A = { ready:false, musicReady:false, st:"menu", cur:null, musicReq:save.music !== false, muted:!!save.mute, buf:{}, T:{ menu:{ pos:0 }, play:{ pos:0 } },
    skip:{}, shots:[], stings:[], until:0, last:null, nextDelay:0, timer:0, duck:1, errors:[], take:BG === "2" ? 2 : 1, musicTarget:0, sndTarget:0, amb:false, slow:1 };
  function ab(s){ var b = atob(s), u = new Uint8Array(b.length); for(var i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); return u.buffer; }
  function dec(c, buf){ return new Promise(function(ok, no){ try{ var p = c.decodeAudioData(buf, ok, no); if(p && p.then) p.then(ok, no); }catch(e){ no(e); } }); }
  function now(){ return ctx.currentTime; }
  function dbg(m){ A.errors.push(String(m)); if(A.errors.length > 20) A.errors.shift(); try{ console.warn("main/audio-el", m); }catch(e){} }

  function build(c){
    g.master = c.createGain(); g.master.connect(c.destination);
    g.musLP = c.createBiquadFilter(); g.musLP.type = "lowpass"; g.musLP.frequency.value = 20000; g.musLP.connect(g.master);
    g.mus = c.createGain(); g.mus.gain.value = 0; g.mus.connect(g.musLP);                    // Music switch x level
    g.duck = c.createGain(); g.duck.connect(g.mus);                                            // explosions / slow-mo duck
    g.tk = { menu:c.createGain(), play:c.createGain() };
    g.tk.menu.gain.value = 0; g.tk.play.gain.value = 0; g.tk.menu.connect(g.duck); g.tk.play.connect(g.duck);
    g.snd = c.createGain(); g.snd.gain.value = 0; g.snd.connect(g.master);                     // Sound switch (SFX.mute): ambience, one-shots, stings
    g.ambLP = c.createBiquadFilter(); g.ambLP.type = "lowpass"; g.ambLP.frequency.value = 1800; g.ambLP.connect(g.snd);
    g.amb = c.createGain(); g.amb.gain.value = 1; g.amb.connect(g.ambLP);
    g.sfx = c.createGain(); g.sfx.connect(g.snd);
  }
  function gates(){
    if(!ctx) return; var t = now();
    A.musicTarget = A.musicReq ? MVOL : 0; A.sndTarget = A.muted ? 0 : 1;
    g.mus.gain.setTargetAtTime(A.musicTarget, t, 0.08); g.snd.gain.setTargetAtTime(A.sndTarget, t, 0.05);
    g.ambLP.frequency.setTargetAtTime(inMenu() ? 1400 : 7000, t, 0.5);
  }
  function inMenu(){ return A.st === "menu"; }
  // ---- music tracks
  function startTrack(k){
    var t = A.T[k], b = A.buf[k]; if(!b || t.src || !ctx) return;
    var s = ctx.createBufferSource(); s.buffer = b; s.loop = true; s.playbackRate.value = rate(); s.connect(g.tk[k]);
    try{ s.start(0, t.pos % b.duration); }catch(e){ dbg("start " + k + ": " + e); return; }
    t.src = s; t.t0 = now() - t.pos;
  }
  function stopTrack(k){ var t = A.T[k], b = A.buf[k]; if(!t.src) return; try{ t.pos = b ? (now() - t.t0) % b.duration : 0; t.src.stop(); }catch(e){} t.src = null; }
  function rate(){ return A.slow >= 1 ? 1 : 0.9 + 0.1 * Math.max(0, A.slow); }
  function trackFor(st){ return st === "menu" ? "menu" : (st === "plan" || st === "count" || st === "blast") ? "play" : null; }
  function route(){
    if(!ctx || !A.musicReady) return; var k = trackFor(A.st); if(!k) return;
    var o = k === "menu" ? "play" : "menu", t = now();
    if(A.cur !== k){ A.cur = k; startTrack(k); g.tk[k].gain.setTargetAtTime(1, t, 0.25); g.tk[o].gain.setTargetAtTime(0, t, 0.25);
      clearTimeout(A.T[o].kill); A.T[o].kill = setTimeout(function(){ if(A.cur !== o) stopTrack(o); }, 1600); }
    else if(!A.T[k].src){ startTrack(k); g.tk[k].gain.setTargetAtTime(1, t, 0.25); }
    gates();
  }
  function duck(sec){
    if(!ctx) return; var t = now(); g.duck.gain.cancelScheduledValues(t); g.duck.gain.setTargetAtTime(0.25, t, 0.05);
    clearTimeout(A.duckT); A.duckT = setTimeout(function(){ if(ctx) g.duck.gain.setTargetAtTime(1, now(), 0.4); }, Math.min(3, sec || 1.5) * 1000);
  }
  function slowmo(k){
    A.slow = k; if(!ctx) return; var t = now();
    g.musLP.frequency.setTargetAtTime(k >= 0.999 ? 20000 : 500 + 6000 * k * k, t, 0.15);
    ["menu", "play"].forEach(function(n){ if(A.T[n].src) A.T[n].src.playbackRate.setTargetAtTime(rate(), t, 0.15); });
  }
  // ---- stings and random one-shots
  function playBuf(name, vol, pan, rt){
    var b = A.buf[name]; if(!b || !ctx) return 0;
    var s = ctx.createBufferSource(); s.buffer = b; if(rt) s.playbackRate.value = rt;
    var gn = ctx.createGain(); gn.gain.value = vol; s.connect(gn);
    if(pan && ctx.createStereoPanner){ var p = ctx.createStereoPanner(); p.pan.value = pan; gn.connect(p); p.connect(g.sfx); } else gn.connect(g.sfx);
    s.start(0); return b.duration / (rt || 1);
  }
  function ok(){ return A.ready && ctx && ctx.state === "running"; }
  function sting(name, vol){
    if(!ok() || A.muted) return false; var d = playBuf(name, vol == null ? 0.8 : vol); if(!d) return false;
    A.stings.push({ n:name, at:performance.now() | 0, st:A.st }); if(A.stings.length > 30) A.stings.shift(); return true;
  }
  function quiet(){ return screen === "game" && (phase === "count" || phase === "boom" || timeScale < 0.999 || A.slow < 0.999); }
  function fire(){
    var why = !A.ready ? "notready" : !ctx || ctx.state !== "running" ? "suspended" : A.muted ? "muted" : document.hidden ? "hidden" : quiet() ? "quiet" : now() < A.until ? "busy" : null;
    if(why){ A.skip[why] = (A.skip[why] || 0) + 1; return why; }
    var L = ["horn", "beep", "birds", "crane", "pigeon"], n; do{ n = L[(Math.random() * L.length) | 0]; }while(n === A.last && L.length > 1);
    var gdb = -28 + Math.random() * 8, pan = -0.6 + Math.random() * 1.2, rt = 0.92 + Math.random() * 0.16;
    var d = playBuf(n, Math.pow(10, gdb / 20), pan, rt); if(!d) return "nobuf";
    A.last = n; A.until = now() + d + 0.25; A.shots.push({ n:n, db:+gdb.toFixed(1), pan:+pan.toFixed(2), rate:+rt.toFixed(3), st:A.st }); if(A.shots.length > 30) A.shots.shift();
    return "played:" + n;
  }
  function sched(){
    clearTimeout(A.timer); A.nextDelay = 6000 + Math.random() * 12000;
    A.timer = setTimeout(function(){ try{ fire(); }catch(e){ dbg(e); } sched(); }, A.nextDelay);
  }
  // ---- load: decode the embedded set (menu first so Home has its music at once), then the rest
  function load(c){
    var order = ["menu", "amb", "play"].concat(Object.keys(DATA).filter(function(k){ return ["menu", "amb", "play"].indexOf(k) < 0; }));
    var chain = Promise.resolve();
    order.forEach(function(k){
      chain = chain.then(function(){
        var p = null;
        if(A.take === 2 && (k === "menu" || k === "play") && window.fetch)
          p = fetch("../audio/el/" + k + "-alt.mp3").then(function(r){ if(!r.ok) throw new Error(r.status); return r.arrayBuffer(); }).then(function(x){ return dec(c, x); }).then(function(b){ A.alt = (A.alt || []).concat(k); return b; }, function(e){ dbg("alt " + k + ": " + e + " (embedded take used)"); return null; });
        return Promise.resolve(p).then(function(b){ return b || dec(c, ab(DATA[k])); }).then(function(b){
          A.buf[k] = b;
          if(k === "menu" || k === "play"){ A.musicReady = true; route(); }
          if(k === "amb") startAmb();
        }, function(e){ dbg("decode " + k + ": " + e); });
      });
    });
    chain.then(function(){ A.ready = true; sched(); });
  }
  // Owner 20/11: the ambience bed is a constant hum and annoys; off by default (?amb=1 brings it back)
  var AMB_ON = /[?&]amb=1(&|$)/.test(location.search);
  function startAmb(){
    if(!AMB_ON) return;
    if(A.amb || !A.buf.amb || !ctx) return; var s = ctx.createBufferSource(); s.buffer = A.buf.amb; s.loop = true; s.connect(g.amb); s.start(0); A.amb = true;
  }
  function init(){
    var c = SF.ctx; if(!c || ctx === c) return; ctx = c;
    try{ build(c); gates(); load(c); }catch(e){ dbg("init " + e); }
  }
  // ---- wrap the facade (the game keeps calling SFX.* as before)
  var o = {}; ["unlock", "music", "musicState", "musicDuck", "musicSting", "setSlowmo", "setMusicVolume", "mute", "play"].forEach(function(k){ o[k] = SF[k]; });
  SF.unlock = function(){ var r = o.unlock.apply(SF, arguments); if(r) init(); return r; };
  SF.music = function(b){ A.musicReq = !!b; o.music.call(SF, false); gates(); };      // the procedural groove stays off under the new music
  SF.musicState = function(st){ A.st = st; o.musicState.apply(SF, arguments); if(st === "blast") duck(2.0); route(); };
  SF.musicDuck = function(sec){ o.musicDuck.apply(SF, arguments); duck(sec); };
  SF.musicSting = function(okk){ if(A.ready && ctx){ if(!sting(okk ? "win" : "lose", 0.85)) return; duck(2.2); } else o.musicSting.apply(SF, arguments); };
  SF.setSlowmo = function(k){ o.setSlowmo.apply(SF, arguments); slowmo(k); };
  SF.setMusicVolume = function(x){ MVOL = Math.max(0, Math.min(2, +x || 0)); o.setMusicVolume.apply(SF, arguments); gates(); };
  SF.mute = function(b){ A.muted = !!b; o.mute.apply(SF, arguments); gates(); };
  function newCard(){ var t = $("inT"); return !!(t && t.offsetParent !== null && /^New:/.test(t.textContent)); }
  SF.play = function(name, p){
    if(A.ready && ctx){
      if(name === "unlock"){ sting(newCard() ? "new" : "unlock", 0.7); return null; }        // booster Unlocked card, "New:" card, map unlock
      if(name === "win" || name === "fail") return null;                                       // replaced by the stings from musicSting()
    }
    return o.play.apply(SF, arguments);
  };
  // Hard / Boss banner: the taiko hit
  try{ var hb = $("hardBan"), hbT = 0;
    if(hb) new MutationObserver(function(){ if(hb.classList.contains("on") && performance.now() - hbT > 400){ hbT = performance.now(); sting("hard", 0.9); } }).observe(hb, { attributes:true, attributeFilter:["class"] });
  }catch(e){ dbg("hardBan " + e); }
  window.__blast.elAudio = {
    state:function(){ var b = {}; Object.keys(A.buf).forEach(function(k){ b[k] = +A.buf[k].duration.toFixed(2); });
      return { ready:A.ready, musicReady:A.musicReady, ctx:ctx ? ctx.state : null, st:A.st, track:A.cur, playing:{ menu:!!A.T.menu.src, play:!!A.T.play.src }, buf:b, take:A.take, alt:A.alt || [],
        musicOn:A.musicReq, musicTarget:A.musicTarget, muted:A.muted, sndTarget:A.sndTarget, amb:A.amb, slow:A.slow, nextDelay:A.nextDelay, shots:A.shots.slice(), stings:A.stings.slice(), skip:A.skip, errors:A.errors.slice() }; },
    fire:fire, sting:sting, quiet:quiet, sched:sched, stop:function(){ clearTimeout(A.timer); }
  };
})(); }catch(e){ console.error("main/audio-el.js", e); }
