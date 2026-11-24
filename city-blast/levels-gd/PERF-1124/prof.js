#!/usr/bin/env node
/* PERF-1124 headless profiler: per-frame cost of one level in three phases (planning idle, camera turn, collapse) on a phone
 * viewport (393x852 CSS px at DPR 3), read from the game's own probe (main/fps.js, window.__blastPerf.meter).
 *   BLAST_LIBS=<dir with three.min.js + rapier3d-compat-0.19.3/rapier.mjs> NODE_PATH=/opt/node22/lib/node_modules \
 *     flock /dev/shm/chrome.lock node city-blast/levels-gd/PERF-1124/prof.js <game.html> <slots csv> [extra query] [out.json]
 *   extra query: e.g. "perf2=0" (the PERF-1124 fixes off), "fps=2" is always set (gl.finish after each render, so R = CPU + GPU).
 * Swiftshader numbers are NOT phone numbers: compare builds / flags with each other only (ratios).
 * rest = after test.run() to the end of the wave (settled lot: next-wave planning or the result card).
 * The collapse is scripted with the test API (same members, same charges every run): TNT on the lowest upright members. */
'use strict';
const path = require('path'), fs = require('fs');
const { chromium } = require('playwright');
const LIB = process.env.BLAST_LIBS;
const [FILE, SLOTS, EXTRA, OUTF] = process.argv.slice(2);
if (!FILE || !SLOTS) { console.error('usage: prof.js <game.html> <slots csv> [extra query] [out.json]'); process.exit(2); }
const W = 393, H = 852, DSF = +(process.env.DSF || 3), SEC = +(process.env.SEC || 4);
const sleep = ms => new Promise(r => setTimeout(r, ms));
function agg(fr) {
  const n = fr.length; if (!n) return null;
  const m = k => fr.reduce((a, f) => a + f[k], 0) / n, mx = k => Math.max(...fr.map(f => f[k]));
  const iv = fr.map(f => f.iv).sort((a, b) => a - b), p95 = iv[Math.floor(n * 0.95)];
  const pos = fr.filter(f => f.heap > 0), gcs = fr.filter(f => f.heap < -200000).length;
  const aw = fr.filter(f => f.awake >= 0);
  return { frames: n, fps: +(1000 / m('iv')).toFixed(1), ivP95: +p95.toFixed(1), ivMax: +mx('iv').toFixed(1), js: +m('js').toFixed(2), jsMax: +mx('js').toFixed(1), pb: +m('pb').toFixed(2), pbMax: +mx('pb').toFixed(1), pbFrames: fr.filter(f => f.pb > 0.5).length, skipped: fr.filter(f => f.skip > 0).length, phys: +m('phys').toFixed(2), solver: +m('solver').toFixed(2), physMax: +mx('phys').toFixed(1),
    steps: +m('steps').toFixed(2), rend: +m('rend').toFixed(2), rendMax: +mx('rend').toFixed(1), sh: +m('sh').toFixed(2), shFrames: fr.filter(f => f.shC > 0).length,
    shCalls: +(fr.filter(f => f.shC > 0).reduce((a, f) => a + f.shC, 0) / Math.max(1, fr.filter(f => f.shC > 0).length)).toFixed(0),
    shTris: +(fr.filter(f => f.shC > 0).reduce((a, f) => a + f.shT, 0) / Math.max(1, fr.filter(f => f.shC > 0).length)).toFixed(0),
    calls: +m('calls').toFixed(0), tris: +m('tris').toFixed(0), drawn: fr.filter(f => f.calls > 0).length,
    allocKB: +(pos.reduce((a, f) => a + f.heap, 0) / n / 1024).toFixed(1), gcs,
    awake: aw.length ? Math.round(aw.reduce((a, f) => a + f.awake, 0) / aw.length) : null, awakeMax: aw.length ? Math.max(...aw.map(f => f.awake)) : null,
    frags: mx('frags'), px: fr[n - 1].w * fr[n - 1].h, pr: fr[n - 1].pr };
}
(async () => {
  const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--enable-precise-memory-info', '--js-flags=--expose-gc'] });
  const out = {};
  for (const slot of SLOTS.split(',').map(Number)) {
    const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: DSF, isMobile: true, hasTouch: true });
    const p = await ctx.newPage(); const errs = [];
    p.on('pageerror', e => errs.push(e.message));
    await p.route(/fonts\.(googleapis|gstatic)\.com/, r => r.fulfill({ status: 200, body: '', contentType: 'text/css' }));
    await p.route(/cdnjs\.cloudflare\.com/, r => r.fulfill({ body: fs.readFileSync(path.join(LIB, 'three.min.js')), contentType: 'application/javascript' }));
    await p.route(/rapier\.mjs/, r => r.fulfill({ body: fs.readFileSync(path.join(LIB, 'rapier3d-compat-0.19.3/rapier.mjs')), contentType: 'application/javascript', headers: { 'Access-Control-Allow-Origin': '*' } }));
    await p.goto('file://' + path.resolve(FILE) + '?lv=' + slot + '&fps=2&studio=0&intro=0' + (EXTRA ? '&' + EXTRA : ''));
    await p.waitForFunction(() => window.__blast && window.__blast.state && window.__blast.state().screen === 'game' && window.__blast.state().phase === 'plan', null, { timeout: 90000 });
    // the opening shot, cards, hands: wait, then close anything modal by the test API only (no taps that could place a charge)
    await sleep(3500);
    await p.evaluate(() => { document.querySelectorAll('.card.on, .modal.on').forEach(e => e.classList.remove('on')); });
    const info = await p.evaluate(() => { const c = document.querySelector('#stage canvas') || document.querySelector('canvas'); return { name: window.__blast.state().name, bodies: window.__blast.state().bodies, pr: window.__blastPerf.pr, cw: c.width, ch: c.height }; });
    const res = { slot, info };
    const phaseRec = async (name, fn) => {
      await p.evaluate(() => { window.__blastPerf.meter.rec(100000); });
      await fn();
      const fr = await p.evaluate(() => window.__blastPerf.meter.frames()); res[name] = agg(fr);
      if (process.env.DUMP) res[name].raw = fr.slice(0, +process.env.DUMP).map(f => [f.iv, f.js, f.phys, f.solver, f.steps, f.rend, f.sh, f.pb, f.calls, f.skip].map(x => +(+x).toFixed(1)).join(' '));
    };
    await phaseRec('plan', () => sleep(SEC * 1000));
    await phaseRec('turn', async () => {
      // one horizontal swipe (a quarter turn), then the ease to the next face
      const y = H * 0.55; await p.mouse.move(W * 0.75, y); await p.mouse.down();
      for (let k = 1; k <= 20; k++) { await p.mouse.move(W * 0.75 - k * 11, y); await sleep(30); }
      await p.mouse.up(); await sleep(1800);
    });
    // collapse: TNT on the lowest upright members (by the test API: identical every run), then BLAST
    const plan = await p.evaluate(() => {
      const B = window.__blast, T = B.test, st = B.state(), n = Math.max(1, (st.stock && st.stock.tnt) || 3);
      const ms = B.members().filter(m => !m.keep && !m.prop && m.key !== 'glass' && m.key !== 'slab');
      const y0 = Math.min(...ms.map(m => m.y)); const low = ms.filter(m => m.y < y0 + 1.5).sort((a, b) => a.x - b.x || a.z - b.z);
      const pick = []; for (let k = 0; k < Math.min(n, low.length); k++) pick.push(low[Math.floor((k + 0.5) * low.length / Math.min(n, low.length))]);
      pick.forEach(m => T.charge('tnt', m.i, 0, 1, 0));
      return { n: pick.length, idx: pick.map(m => m.i) };
    });
    res.plan = res.plan; res.charges = plan;
    await phaseRec('collapse', async () => { await p.evaluate(() => window.__blast.test.fire()); await sleep(SEC * 1500); });
    // rest: run the collapse to its end by the engine's own fixed steps (test.run), then record the settled scene
    // (next-wave planning or the result card over the rubble)
    res.afterRun = await p.evaluate(() => { const r = window.__blast.test.run(30); return { phase: r.phase, pct: +(+r.pct).toFixed(2) }; });
    await sleep(2500);
    await phaseRec('rest', () => sleep(SEC * 1000));
    res.end = await p.evaluate(() => { const s = window.__blast.state(); return { phase: s.phase, pct: +s.pct.toFixed(2), bodies: s.bodies, debris: s.debris }; });
    res.errors = errs.slice(0, 3);
    out[slot] = res;
    console.log(JSON.stringify(res));
    await ctx.close();
  }
  await browser.close();
  if (OUTF) fs.writeFileSync(OUTF, JSON.stringify(out, null, 1));
})().catch(e => { console.error(e); process.exit(1); });
