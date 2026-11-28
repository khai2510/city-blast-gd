#!/usr/bin/env node
/* FLICK-1128 flicker probe: pixels that flip back and forth between frames while the camera sways (z-fighting, shadow acne, crawl).
 *   BLAST_LIBS=... NODE_PATH=/opt/node22/lib/node_modules flock /dev/shm/chrome.lock node flickprobe.js <game.html> <slots csv> [extra query] [outdir]
 * REAL=1 (used for FLICK-1128.md): read every frame the game's own loop draws, right after its render; rate = reversals per Mpx per frame
 *   (a pixel whose luma goes up then down, or down then up, by > T); writes <tag>-heat.jpg (red = flipped) and <tag>-clean.jpg. TAG=name.
 * Sync mode (no REAL): renders N frames itself, the camera turned DY rad each; AFTER=1 (measure after a scripted first blast), ATTR=1 (per-mesh attribution: hide each mesh, count the flips it owns),
 *      ABL=1 (ablations: shadows off, near 2 m, glass hidden), DSF (3), N (frames, 14), DY (yaw step rad, 3.5e-4 = the idle sway a frame), T (luma threshold, 48)
 * Frames are rendered synchronously in one task with the game's own renderer / scene / camera; between frames only the camera
 * turns by DY about the focus (the idle sway moves ~3.5e-4 rad a frame), so a pixel whose colour jumps by > T is unstable. */
'use strict';
const path = require('path'), fs = require('fs');
const { chromium } = require('playwright');
const LIB = process.env.BLAST_LIBS;
const [FILE, SLOTS, EXTRA, OUTD] = process.argv.slice(2);
const DSF = +(process.env.DSF || 3), N = +(process.env.N || 14), DY = +(process.env.DY || 3.5e-4), T = +(process.env.T || 48);
const sleep = ms => new Promise(r => setTimeout(r, ms));
if (OUTD) fs.mkdirSync(OUTD, { recursive: true });
(async () => {
  const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
  for (const slot of SLOTS.split(',').map(Number)) {
    const ctx = await browser.newContext({ viewport: { width: 393, height: 852 }, deviceScaleFactor: DSF, isMobile: true, hasTouch: true });
    const p = await ctx.newPage(); const errs = [];
    p.on('pageerror', e => errs.push(e.message));
    await p.route(/fonts\.(googleapis|gstatic)\.com/, r => r.fulfill({ status: 200, body: '', contentType: 'text/css' }));
    await p.route(/cdnjs\.cloudflare\.com/, r => r.fulfill({ body: fs.readFileSync(path.join(LIB, 'three.min.js')), contentType: 'application/javascript' }));
    await p.route(/rapier\.mjs/, r => r.fulfill({ body: fs.readFileSync(path.join(LIB, 'rapier3d-compat-0.19.3/rapier.mjs')), contentType: 'application/javascript', headers: { 'Access-Control-Allow-Origin': '*' } }));
    await p.goto('file://' + path.resolve(FILE) + '?lv=' + slot + '&studio=0&intro=0' + (EXTRA ? '&' + EXTRA : ''));
    await p.waitForFunction(() => window.__blast && window.__blast.state && window.__blast.state().screen === 'game' && window.__blast.state().phase === 'plan', null, { timeout: 120000 });
    await sleep(4000);
    await p.evaluate(() => { document.querySelectorAll('.card.on, .modal.on').forEach(e => e.classList.remove('on')); });
    if (process.env.AFTER) {
      await p.evaluate(() => {
        const B = window.__blast, T = B.test, st = B.state(), tnt = (st.stock && st.stock.tnt) || 3, n = Math.max(1, Math.min(6, Math.ceil(tnt / 4)));
        const ms = B.members().filter(m => !m.keep && !m.prop && m.key !== 'glass' && m.key !== 'slab');
        const y0 = Math.min(...ms.map(m => m.y)); const low = ms.filter(m => m.y < y0 + 1.5).sort((a, b) => a.x - b.x || a.z - b.z);
        const k = Math.min(n, low.length); for (let j = 0; j < k; j++) T.charge('tnt', low[Math.floor((j + 0.5) * low.length / k)].i, 0, 1, 0);
        T.fire(); T.run(30);
      });
      await sleep(6000);
    }
    if (process.env.REAL) {
      // real frames: read every DRAWN frame of the game's own loop right after its render (same task, before compositing)
      const rr = await p.evaluate(async ({ K, T }) => {
        const D = window.__blastPerf.meter.dev(), R = D.renderer, gl = R.getContext(), PF = window.__blastPerf;
        const lum = (b, i) => 0.299 * b[i] + 0.587 * b[i + 1] + 0.114 * b[i + 2];
        let n = 0, osc = 0, bufs = null, acc = null, w = 0, h = 0, skipped = 0, sh = 0; const t0 = performance.now();
        const r0 = R.render;
        await new Promise(res => {
          R.render = function (s, c) { const shw = R.shadowMap.needsUpdate; const out = r0.apply(this, arguments);
            if (s !== D.scene || (PF.p2 && PF.p2.skipped)) { if (PF.p2 && PF.p2.skipped) skipped++; return out; }
            if (shw) sh++;
            if (!bufs) { w = R.domElement.width; h = R.domElement.height; bufs = [0, 1, 2].map(() => new Uint8Array(w * h * 4)); acc = new Uint8Array(w * h); }
            const b = bufs[n % 3]; gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, b);
            if (n >= 2) { const a = bufs[(n - 2) % 3], m = bufs[(n - 1) % 3];
              for (let i = 0, j = 0; i < b.length; i += 4, j++) { const d1 = lum(m, i) - lum(a, i), d2 = lum(b, i) - lum(m, i);
                if ((d1 > T && d2 < -T) || (d1 < -T && d2 > T)) { osc++; acc[j]++; } } }
            n++; if (n >= K) { R.render = r0; res(); } return out; };
        });
        let px = 0; for (let j = 0; j < acc.length; j++) if (acc[j]) px++;
        const c2 = document.createElement('canvas'); c2.width = w; c2.height = h; const g = c2.getContext('2d'), im = g.createImageData(w, h), b0 = bufs[(n - 1) % 3];
        for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const s = ((h - 1 - y) * w + x), i = s * 4, o = (y * w + x) * 4;
          if (acc[s]) { im.data[o] = 255; im.data[o + 1] = 30; im.data[o + 2] = 30; } else { im.data[o] = b0[i] * 0.55; im.data[o + 1] = b0[i + 1] * 0.55; im.data[o + 2] = b0[i + 2] * 0.55; } im.data[o + 3] = 255; }
        g.putImageData(im, 0, 0); const heat = c2.toDataURL('image/jpeg', 0.8);
        for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const s = ((h - 1 - y) * w + x) * 4, o = (y * w + x) * 4; im.data[o] = b0[s]; im.data[o + 1] = b0[s + 1]; im.data[o + 2] = b0[s + 2]; im.data[o + 3] = 255; }
        g.putImageData(im, 0, 0); const clean = c2.toDataURL('image/jpeg', 0.92);
        return { frames: n, ms: Math.round(performance.now() - t0), skipped, shadowRedraws: sh, rate: +(1e6 * osc / (w * h) / Math.max(1, n - 2)).toFixed(0), px, heat, clean, st: window.__blast.state().phase + '/' + window.__blast.state().wave, camD: +window.__blast.zoom().camD.toFixed(1), fk: window.__blastPerf.flick || null, near: D.camera.near };
      }, { K: +(process.env.K || 14), T });
      const tag = 'L' + slot + (process.env.AFTER ? 'a' : '') + '-real' + (process.env.TAG ? '-' + process.env.TAG : '');
      if (OUTD) { fs.writeFileSync(path.join(OUTD, tag + '-heat.jpg'), Buffer.from(rr.heat.split(',')[1], 'base64')); fs.writeFileSync(path.join(OUTD, tag + '-clean.jpg'), Buffer.from(rr.clean.split(',')[1], 'base64')); }
      delete rr.heat; delete rr.clean; rr.slot = slot; rr.errors = errs.slice(0, 3); console.log(JSON.stringify(rr)); await ctx.close(); continue;
    }
    const r = await p.evaluate(async ({ N, DY, T, ATTR, ABL, SHOT }) => {
      const D = window.__blastPerf.meter.dev(), R = D.renderer, S = D.scene, C = D.camera, gl = R.getContext();
      const cv = R.domElement, W = cv.width, H = cv.height;
      // stop the game loop from touching anything while we render (one sync task: rAF cannot run in between anyway)
      C.updateMatrixWorld(); const P0 = C.position.clone(), Q0 = C.quaternion.clone();
      const st = window.__blast.state(), fr = window.__blast.zoom();
      // turn about a pivot in front of the camera at the focus distance
      const fwd = new THREE.Vector3(0, 0, -1).applyQuaternion(Q0), piv = P0.clone().addScaledVector(fwd, fr.camD || 40);
      const up = new THREE.Vector3(0, 1, 0), qd = new THREE.Quaternion();
      const render = k => { qd.setFromAxisAngle(up, k * DY); C.position.copy(P0).sub(piv).applyQuaternion(qd).add(piv); C.quaternion.copy(qd).multiply(Q0); C.updateMatrixWorld(); R.render(S, C); };
      const lum = (b, i) => 0.299 * b[i] + 0.587 * b[i + 1] + 0.114 * b[i + 2];
      // a sequence of n frames; per pixel count "reversals": the colour goes up then down (or down then up) by > T both ways.
      // Smooth motion is monotonic (0 reversals); z-fighting, shadow acne and sub-pixel crawl blink (>= 1).
      let bufs = null;
      const sweep = (n, acc) => { const w = R.domElement.width, h = R.domElement.height, L = w * h;
        if (!bufs || bufs[0].length !== L * 4) bufs = [0, 1, 2].map(() => new Uint8Array(L * 4));
        render(-2); render(-1);   // warm-up (pending uploads / shadow update)
        let osc = 0;
        for (let k = 0; k < n; k++) { const b = bufs[k % 3]; render(k); gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, b);
          if (k < 2) continue; const a = bufs[(k - 2) % 3], m = bufs[(k - 1) % 3];
          for (let i = 0, j = 0; i < b.length; i += 4, j++) { const d1 = lum(m, i) - lum(a, i), d2 = lum(b, i) - lum(m, i);
            if ((d1 > T && d2 < -T) || (d1 < -T && d2 > T)) { osc++; if (acc) acc[j]++; } } }
        return +(1e6 * osc / L / (n - 2)).toFixed(0); };   // reversals per million pixels per frame
      const W0 = R.domElement.width, H0 = R.domElement.height, acc = new Uint8Array(W0 * H0);
      const res = { name: st.name, W: W0, H: H0, camD: +(fr.camD || 0).toFixed(1), near: C.near, far: C.far, dy: DY };
      res.base = sweep(N, acc); let px1 = 0; for (let j = 0; j < acc.length; j++) if (acc[j]) px1++; res.px = px1;
      const buf = [bufs[(N - 1) % 3]];
      const n2 = 7, base3 = sweep(n2);
      const mats = []; S.traverse(o => { if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => mats.push(m)); });
      if (ABL) {
        res.abl = {};
        const sh = R.shadowMap.enabled; R.shadowMap.enabled = false; mats.forEach(m => m.needsUpdate = true); res.abl.noShadow = sweep(n2) - base3; R.shadowMap.enabled = sh; mats.forEach(m => m.needsUpdate = true); R.shadowMap.needsUpdate = true;
        const pr0 = R.getPixelRatio(); R.setPixelRatio(3); R.setSize(window.innerWidth, window.innerHeight, false); res.abl.pr3 = sweep(n2) - base3; R.setPixelRatio(pr0); R.setSize(window.innerWidth, window.innerHeight, false);
        const nr = C.near; C.near = 2; C.updateProjectionMatrix(); res.abl.near2 = sweep(n2) - base3; C.near = nr; C.updateProjectionMatrix();
        const tr = []; S.traverseVisible(o => { if (o.isMesh && o.material && o.material.transparent) tr.push(o); }); tr.forEach(o => o.visible = false); res.abl.noTransp = sweep(n2) - base3; tr.forEach(o => o.visible = true);
        res.abl.base3 = base3;
      }
      if (ATTR) {
        const ms = []; S.traverseVisible(o => { if (o.isMesh) ms.push(o); });
        const out = [];
        for (const o of ms) { o.visible = false; const f = sweep(n2); o.visible = true; const g = o.geometry, m = o.material;
          out.push([base3 - f, (o.name || '') + '#' + o.id + ' ' + (g.type || '') + '/' + (m.type || '') + (o.isInstancedMesh ? ' x' + o.count : '') + (m.color ? ' c' + m.color.getHexString() : '') + (m.transparent ? ' T' : '') + (o.castShadow ? ' S' : '') + (o.receiveShadow ? ' R' : '') + (m.polygonOffset ? ' PO' : '')]); }
        res.attr = out.sort((a, b) => b[0] - a[0]).slice(0, 18);
        res.base3 = base3;
      }
      C.position.copy(P0); C.quaternion.copy(Q0); C.updateMatrixWorld();
      return res;
    }, { N, DY, T, ATTR: !!process.env.ATTR, ABL: !!process.env.ABL, SHOT: !!OUTD });
    if (OUTD && r.heat) { const tag = 'L' + slot + (process.env.AFTER ? 'a' : '') + (process.env.TAG ? '-' + process.env.TAG : '');
      fs.writeFileSync(path.join(OUTD, tag + '-heat.jpg'), Buffer.from(r.heat.split(',')[1], 'base64'));
      fs.writeFileSync(path.join(OUTD, tag + '-clean.jpg'), Buffer.from(r.clean.split(',')[1], 'base64')); delete r.heat; delete r.clean; }
    r.slot = slot; r.errors = errs.slice(0, 3);
    console.log(JSON.stringify(r));
    await ctx.close();
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
