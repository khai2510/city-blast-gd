#!/usr/bin/env node
/* PERF-1124: physics cost of a scripted collapse in step space (manual stepping, independent of the frame rate) + the
 * determinism fingerprint (the levels6 log hash + final %) for identical scripted charges.
 *   BLAST_LIBS=... NODE_PATH=/opt/node22/lib/node_modules flock /dev/shm/chrome.lock node physprof.js <game.html> <slots csv> [extra query]
 * Per slot: TNT on the lowest upright members (same rule as prof.js), BLAST, 720 steps (12 s game time) in chunks of 30 steps:
 * ms per step, awake members / debris, debris count. Prints one JSON line per slot. */
'use strict';
const path = require('path'), fs = require('fs');
const { chromium } = require('playwright');
const LIB = process.env.BLAST_LIBS;
const [FILE, SLOTS, EXTRA] = process.argv.slice(2);
(async () => {
  const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
  const ctx = await browser.newContext({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 1 });
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.route(/fonts\.(googleapis|gstatic)\.com/, r => r.fulfill({ status: 200, body: '', contentType: 'text/css' }));
  await p.route(/cdnjs\.cloudflare\.com/, r => r.fulfill({ body: fs.readFileSync(path.join(LIB, 'three.min.js')), contentType: 'application/javascript' }));
  await p.route(/rapier\.mjs/, r => r.fulfill({ body: fs.readFileSync(path.join(LIB, 'rapier3d-compat-0.19.3/rapier.mjs')), contentType: 'application/javascript', headers: { 'Access-Control-Allow-Origin': '*' } }));
  await p.goto('file://' + path.resolve(FILE) + '?studio=0' + (EXTRA ? '&' + EXTRA : ''));
  await p.waitForFunction(() => window.__blast && window.__blast.test && window.__blastPerf && window.__blastPerf.meter, null, { timeout: 90000 });
  for (const slot of SLOTS.split(',').map(Number)) {
    const r = await p.evaluate((li) => {
      const B = window.__blast, T = B.test, M = window.__blastPerf.meter; M.on(); M.rec(1e6);
      T.play(li, 1); const st = B.state(), n = Math.max(1, (st.stock && st.stock.tnt) || 3);
      // let the level rest as the player would see it (presettle is done by play); then plan
      const ms = B.members().filter(m => !m.keep && !m.prop && m.key !== 'glass' && m.key !== 'slab');
      const y0 = Math.min(...ms.map(m => m.y)); const low = ms.filter(m => m.y < y0 + 1.5).sort((a, b) => a.x - b.x || a.z - b.z);
      const k = Math.min(n, low.length), pick = []; for (let j = 0; j < k; j++) pick.push(low[Math.floor((j + 0.5) * low.length / k)]);
      // plan-phase idle steps (the world at rest)
      let t0 = performance.now(); T.step(60); const planMs = (performance.now() - t0) / 60, aw0 = M.awake();
      pick.forEach(m => T.charge('tnt', m.i, 0, 1, 0));
      T.fire();
      const tl = []; let worst = 0;
      for (let c = 0; c < 24; c++) {
        t0 = performance.now(); let w = 0;
        M.clear(); let sol = 0;
        for (let s = 0; s < 30; s++) { const a = performance.now(); T.step(1); const d = performance.now() - a; if (d > w) w = d; }
        const dt = (performance.now() - t0) / 30; if (w > worst) worst = w;
        const a = M.awake(); tl.push({ t: +((c + 1) * 0.5).toFixed(1), ms: +dt.toFixed(2), max: +w.toFixed(1), awB: a.blocks, awF: a.frags, frags: a.nFrags, bodies: a.bodies });
      }
      const log = T.l6 ? T.l6().log : null, h = log && log.length ? log[log.length - 1] : null;
      return { slot: li + 1, name: st.name, members: st.bodies, charges: pick.map(m => m.i), planMsPerStep: +planMs.toFixed(3), awakeAtRest: aw0, peak: Math.max(...tl.map(x => x.ms)), worstStep: +worst.toFixed(1),
        mean: +(tl.reduce((a, x) => a + x.ms, 0) / tl.length).toFixed(2), tl, pct: +B.state().pct.toFixed(3), hash: h ? (h.h + ' ' + h.step + ' ' + h.pct) : null, logN: log ? log.length : 0 };
    }, slot - 1);
    console.log(JSON.stringify(r));
  }
  if (errs.length) console.log('errors', errs.slice(0, 3));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
