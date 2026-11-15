    // ---- combo v18 (combo/patch.js): praise lines (ElevenLabs "Jesse") + rising chime, on v6's voice bus (the TIMBER
    // call's bus: HP 140 Hz + presence, skips the slow-mo low-pass, muted with the SFX toggle). Decoded once here from
    // root.CMB_AUDIO (base64 MP3, set by the game script). Music dips about -3 dB under a line.
    var CP = { bufs: {}, state: "idle", plays: 0, chimes: 0, last: null, until: 0, err: null };
    (function cpDecode() {
      var A = root.CMB_AUDIO, dec = typeof atob === "function" ? atob : root.atob;
      if (!A || !ctx.decodeAudioData || typeof dec !== "function") { CP.state = "none"; return; }
      var keys = Object.keys(A), left = keys.length; CP.state = "decoding";
      keys.forEach(function (k) {
        var done = false, fin = function () { if (--left === 0) CP.state = Object.keys(CP.bufs).length ? "ready" : "failed"; };
        var ok = function (b) { if (done) return; done = true; CP.bufs[k] = b; fin(); };
        var bad = function (e) { if (done) return; done = true; CP.err = (CP.err ? CP.err + "; " : "") + k + ": " + (e && e.message || e || "decode failed"); fin(); };
        try {
          var bin = dec(A[k]), u8 = new Uint8Array(bin.length);
          for (var i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
          var pr = ctx.decodeAudioData(u8.buffer, ok, bad);   // callback form for old Safari, promise form elsewhere
          if (pr && pr.then) pr.then(ok, bad);
        } catch (e) { bad(e); }
      });
    })();
    E.comboBusy = function () {                        // seconds until the voice bus is free (TIMBER call or the last praise line)
      var u = CP.until;
      if (E.timberVoice) { var tv = E.timberVoice(); if (tv && tv.last) u = Math.max(u, tv.last.t + (tv.last.duration || tv.duration || 0)); }
      return Math.max(0, u - now());
    };
    E.comboPraise = function (tier, p) {
      p = p || {}; tier = Math.max(1, Math.min(5, tier | 0));
      var t = now() + 0.01, bus = mk("v6").nodes.voxG, out = { t: t, tier: tier, voice: 0, chime: 0 };
      var ch = CP.bufs.chime;
      if (ch) {
        var cs = ctx.createBufferSource(), cg = G(CMB_CHIME_GAIN), rate = Math.pow(2, CMB_SEMI[tier] / 12);
        cs.buffer = ch; cs.playbackRate.value = rate; cs.connect(cg); cg.connect(bus); cs.start(t);
        cs.onended = function () { try { cg.disconnect(); } catch (e) {} };
        out.chime = ch.duration / rate; CP.chimes++;
      }
      var vb = p.voice === false ? null : CP.bufs["w" + tier];
      if (vb) {
        var tv = t + 0.03, vs = ctx.createBufferSource(), vg = G(CMB_VGAIN[tier]);
        vs.buffer = vb; vs.connect(vg); vg.connect(bus); vs.start(tv);
        vs.onended = function () { try { vg.disconnect(); } catch (e) {} };
        CP.until = tv + vb.duration; out.voice = vb.duration; CP.plays++;
        bg.gain.cancelScheduledValues(t); bg.gain.setTargetAtTime(0.7, t, 0.03); bg.gain.setTargetAtTime(1, tv + vb.duration, 0.12);
      }
      CP.last = out;
      return out;
    };
    E.comboVoice = function () {
      return { state: CP.state, keys: Object.keys(CP.bufs).sort(), plays: CP.plays, chimes: CP.chimes, last: CP.last, err: CP.err, busy: E.comboBusy(),
               durations: Object.keys(CP.bufs).sort().map(function (k) { return k + ":" + CP.bufs[k].duration.toFixed(2); }) };
    };
    // ---- end combo v18 (engine)
