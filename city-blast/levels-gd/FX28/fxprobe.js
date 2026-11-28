#!/usr/bin/env node
/* FX28 probe: a REAL win (the level's own solution, then BLAST), then the win fireworks census + frame timing.
 *   BLAST_LIBS=... NODE_PATH=/opt/node22/lib/node_modules flock /dev/shm/chrome.lock node fxprobe.js <game.html> <slots csv> [extra query] [shots dir]
 * Per slot: plays the level with its own solution (L.sol), waits for the fireworks (__blast.ui2.fx().fired), then records
 *   - the burst list, the piece count, the peak number of live firework pieces (#feelLay .cf.u2 + Q7 .cf + #confetti i),
 *   - the fxWin() call cost (ms, JS) and the frame intervals over the show from the ?fps=1 probe (window.__blastPerf.meter),
 *   - the same show again with the 3D canvas hidden (DOM / compositor cost alone: SwiftShader fill hidden, LEARNINGS PERF-1124).
 * With a shots dir: the fireworks of slot 1 are held and stepped (WAAPI currentTime) for a frame strip (0.3 … 2.3 s). */
'use strict';
const path = require('path'), fs = require('fs');
const { chromium } = require('playwright');
const LIB = process.env.BLAST_LIBS;
const [FILE, SLOTS, EXTRA, SHOTS] = process.argv.slice(2);
(async () => {
  const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
  const out = [];
  for (const slot of SLOTS.split(',').map(Number)) {
    const ctx = await browser.newContext({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true });
    const p = await ctx.newPage(); const errs = [];
    p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    await p.route(/fonts\.(googleapis|gstatic)\.com/, r => r.fulfill({ status: 200, body: '', contentType: 'text/css' }));
    await p.route(/cdnjs\.cloudflare\.com/, r => r.fulfill({ body: fs.readFileSync(path.join(LIB, 'three.min.js')), contentType: 'application/javascript' }));
    await p.route(/rapier\.mjs/, r => r.fulfill({ body: fs.readFileSync(path.join(LIB, 'rapier3d-compat-0.19.3/rapier.mjs')), contentType: 'application/javascript', headers: { 'Access-Control-Allow-Origin': '*' } }));
    await p.goto('file://' + path.resolve(FILE) + '?studio=0&fps=1&sa=47,0,34,0&uichome=60000' + (EXTRA ? '&' + EXTRA : ''));
    await p.waitForFunction(() => window.__blast && window.__blast.test && window.__blastPerf && window.__blastPerf.meter, null, { timeout: 120000 });
    await p.waitForTimeout(1500);
    // census of live firework pieces, sampled every 50 ms (page side) + fxWin cost (wrapped by timing the first fired frame)
    const info = await p.evaluate((li) => {
      const B = window.__blast, T = B.test; B.start(li); return { name: B.state().name, boss: B.state().boss, hard: !!(window.LV7O && LV7O.isH && LV7O.isH(li)), sol: !!(T.level().sol || []).length };
    }, slot - 1);
    await p.waitForFunction(() => window.__blast.state().phase === 'plan', null, { timeout: 300000, polling: 300 });
    await p.waitForTimeout(800);
    const placed = await p.evaluate(() => { const T = window.__blast.test; T.setStock({ tnt: 99 }); return T.solve().filter(x => x && x !== 'nomember').length; });
    await p.evaluate(() => {
      const M = window.__blastPerf.meter; M.on(); M.rec(100000);
      window.__fx28 = { peak: 0, samples: [], t0: 0 };
      const S = window.__fx28;
      const tick = () => { const on = (e) => e.style.display !== 'none', a = [...document.querySelectorAll('#feelLay .cf.u2')].filter(on).length, q = document.querySelectorAll('#feelLay .cf:not(.u2)').length, c = document.querySelectorAll('#confetti i').length;
        if (window.__blast.ui2.fx().fired && !S.t0) S.t0 = performance.now();
        if (S.t0) S.samples.push({ t: Math.round(performance.now() - S.t0), u2: a, q7: q, conf: c });
        if (!S.t0 || performance.now() - S.t0 < 4500) setTimeout(tick, 100); };
      tick();
      window.__blast.test.fire();
    });
    await p.waitForFunction(() => window.__fx28.t0 > 0, null, { timeout: 600000, polling: 200 }).catch(() => {});
    await p.waitForTimeout(4600);
    const r = await p.evaluate(() => {
      const fx = window.__blast.ui2.fx(), S = window.__fx28, fr = window.__blastPerf.meter.frames().filter(f => f.t >= S.t0 && f.t <= S.t0 + 3000);
      const iv = fr.map(f => f.iv).sort((a, b) => a - b), js = fr.map(f => f.js);
      const q = (a, k) => a.length ? +a[Math.min(a.length - 1, Math.floor(k * a.length))].toFixed(1) : null;
      return { fired: fx.fired, n: fx.n, pieces: fx.pieces, bursts: fx.bursts.length, per: fx.per, cost: fx.cost, slice: fx.slice, cols: [...new Set(fx.bursts.flatMap(b => b.cols))], 
        maxU2: Math.max(0, ...S.samples.map(s => s.u2)), maxQ7: Math.max(0, ...S.samples.map(s => s.q7)), maxConf: Math.max(0, ...S.samples.map(s => s.conf)), lastPieceGoneAt: (S.samples.filter(s => s.u2 + s.q7 > 0).pop() || {}).t,
        frames: fr.length, ivMed: q(iv, 0.5), ivP90: q(iv, 0.9), ivMax: iv.length ? +iv[iv.length - 1].toFixed(1) : null, jsMean: js.length ? +(js.reduce((a, b) => a + b, 0) / js.length).toFixed(2) : null,
        screen: window.__blast.state().screen, ok: !!(window.__blast.state().result || {}).ok };
    });
    // the same show again, canvas hidden: DOM / compositor cost alone (rAF intervals over 3 s)
    const dom = await p.evaluate(() => new Promise(res => {
      const cv = document.querySelector('canvas'); if (cv) cv.style.visibility = 'hidden';
      const iv = []; let last = 0, t0 = 0;
      const base = () => new Promise(r2 => { const a = []; let l = 0; const f = (t) => { if (l) a.push(t - l); l = t; if (a.length < 90) requestAnimationFrame(f); else r2(a); }; requestAnimationFrame(f); });
      base().then(b0 => {
        const fx = window.__blast.ui2.replay ? window.__blast.ui2.replay() : null;
        const f = (t) => { if (!t0) t0 = t; if (last) iv.push(t - last); last = t; if (t - t0 < 3000) requestAnimationFrame(f); else {
          const s = iv.slice().sort((a, b) => a - b), sb = b0.slice().sort((a, b) => a - b), q = (a, k) => +a[Math.min(a.length - 1, Math.floor(k * a.length))].toFixed(1);
          res({ replayCost: fx && fx.cost, replaySlice: window.__blast.ui2.fx().slice, idleMed: q(sb, 0.5), idleP90: q(sb, 0.9), showMed: q(s, 0.5), showP90: q(s, 0.9), showMax: +s[s.length - 1].toFixed(1), showFrames: s.length }); } };
        requestAnimationFrame(f);
      });
    }));
    // census replay (separate, so its getComputedStyle reads do not load the timed passes): peak of pieces actually on screen (opacity > 0.05)
    const census = await p.evaluate(() => new Promise(res => { window.__blast.ui2.replay(); const t0 = performance.now(); let peak = 0, at = 0, lastOn = 0;
      const f = () => { const t = performance.now() - t0; const v = [...document.querySelectorAll('#feelLay .cf, #confetti i')].filter(e => e.style.display !== 'none' && +getComputedStyle(e).opacity > 0.05).length;
        if (v > peak) { peak = v; at = Math.round(t); } if (v) lastOn = Math.round(t); if (t < 3600) setTimeout(f, 40); else res({ peakOnScreen: peak, peakAt: at, lastOnScreen: lastOn }); }; f(); }));
    r.census = census;
    if (SHOTS && slot === +SLOTS.split(',')[0]) {
      fs.mkdirSync(SHOTS, { recursive: true });
      await p.evaluate(() => { const cv = document.querySelector('canvas'); if (cv) cv.style.visibility = ''; });
      await p.waitForTimeout(400);
      await p.evaluate(() => { window.__blast.ui2.replay(true); document.getAnimations().filter(a => a.effect && a.effect.target && a.effect.target.matches && a.effect.target.matches('#feelLay .cf')).forEach(a => a.pause()); });
      for (const t of [0.3, 0.8, 1.3, 1.8, 2.3]) {
        await p.evaluate((ms) => document.getAnimations().filter(a => a.effect && a.effect.target && a.effect.target.matches && a.effect.target.matches('#feelLay .cf')).forEach(a => { a.currentTime = ms; }), t * 1000);
        await p.waitForTimeout(250);
        await p.screenshot({ path: path.join(SHOTS, 'f-' + t.toFixed(1) + 's.png') });
      }
    }
    out.push(Object.assign({ slot, placed }, info, r, { dom }, { errors: errs.slice(0, 3) }));
    console.log(JSON.stringify(out[out.length - 1]));
    await ctx.close();
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
