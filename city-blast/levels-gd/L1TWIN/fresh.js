#!/usr/bin/env node
/* L1TWIN first-timer run (fresh profile, 393 x 852, touch, REAL taps only: the page's own input path decides everything).
 *   BLAST_LIBS=<libs> NODE_PATH=/opt/node22/lib/node_modules flock /dev/shm/chrome.lock node fresh.js <game.html> <out dir> [runs=5]
 * Per run: Home > Play > the Level 1 lesson (tap the spotlight = 1 TNT, double tap it = blast) > mill A falls > the camera settles >
 * mill B alone (no hand, no spotlight): one double tap on its front-left leg (1 TNT + blast) > the win card.
 * Run 1 also: a tap outside the spotlight first (UX-118: swallowed, nothing placed), the screenshots, and a video (VIDEO=1).
 * Double taps are sent through CDP with explicit timestamps (LEARNINGS 24/11: a headless double tap is too slow at low fps). */
'use strict';
const path = require('path'), fs = require('fs');
const { chromium } = require('playwright');
const LIB = process.env.BLAST_LIBS, FILE = path.resolve(process.argv[2]), OUT = path.resolve(process.argv[3]), RUNS = +(process.argv[4] || 5), K = 'blastRush.save.v2';
fs.mkdirSync(OUT, { recursive: true });
const SIG = (() => { const m = fs.readFileSync(FILE, 'utf8').match(/SLOTS = (\[[-0-9,]+\])/); return m ? 's:' + m[1].slice(1, -1) : null; })();
const DONE = {}; ['tnt', 'timber', 'dbltap', 't2l1', 't2l2', 'blast'].forEach(k => { DONE[k] = { c: 1, f: 1 }; });
const seedDone = `(()=>{try{if(!sessionStorage.getItem('l1Seed')){sessionStorage.setItem('l1Seed','1');${SIG ? `localStorage.setItem('${K}.lv7o','${SIG}');` : ''}localStorage.setItem('${K}',${JSON.stringify(JSON.stringify({ cv: 6, level: 0, coins: 0, upg: { power: 0, charge: 0, magnet: 0, slowmo: 0 }, best: {}, mute: true, music: false, tutv: 2, intro: DONE, zh: 1 }))});}}catch(e){}})()`;
(async () => {
  const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
  const open = async (o = {}) => {
    const ctx = await browser.newContext(Object.assign({ viewport: { width: 393, height: 852 }, hasTouch: true, isMobile: true, deviceScaleFactor: 1 }, o.video ? { recordVideo: { dir: o.video, size: { width: 393, height: 852 } } } : {}));
    const p = await ctx.newPage(); p.errs = [];
    p.on('pageerror', e => p.errs.push('pageerror: ' + e.message.slice(0, 200))); p.on('console', m => { if (m.type() === 'error') p.errs.push('console: ' + m.text().slice(0, 200)); });
    await p.route(/fonts\.(googleapis|gstatic)\.com/, r => r.fulfill({ status: 200, body: '', contentType: 'text/css' }));
    await p.route(/cdnjs\.cloudflare\.com/, r => r.fulfill({ body: fs.readFileSync(path.join(LIB, 'three.min.js')), contentType: 'application/javascript' }));
    await p.route(/rapier\.mjs/, r => r.fulfill({ body: fs.readFileSync(path.join(LIB, 'rapier3d-compat-0.19.3/rapier.mjs')), contentType: 'application/javascript', headers: { 'Access-Control-Allow-Origin': '*' } }));
    if (o.init) await p.addInitScript(o.init);
    await p.goto('file://' + FILE + '?sa=59,0,34,0');
    await p.waitForFunction(() => window.__blast && window.__blast.state, null, { timeout: 120000 }); await p.waitForTimeout(1200);
    await p.waitForFunction(() => !document.getElementById('hmStudio'), null, { timeout: 20000 }).catch(() => {});
    p.cdp = await ctx.newCDPSession(p); return p; };
  const shot = (p, n) => p.screenshot({ path: path.join(OUT, n + '.jpg'), type: 'jpeg', quality: 78 });
  const st = (p) => p.evaluate(() => { const s = window.__blast.state(), t = window.__blast.tap2.tut(), h = window.__blast.tap2.hand(); return { screen: s.screen, phase: s.phase, pct: Math.round(s.pct * 1000) / 10, placed: s.placed, tnt: s.stock && s.stock.tnt, wave: s.wave, l1: t.l1, lbl: t.label, hole: t.hole, blocked: t.blocked, done: t.done.l1, hand: h.on ? { x: Math.round(h.x), y: Math.round(h.y), mode: h.mode } : null, res: s.result ? { ok: s.result.ok, pct: s.result.pct } : null }; });
  const play = async (p) => { const b = await p.evaluate(() => { const r = document.querySelector('#play').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }); await p.touchscreen.tap(b.x, b.y); await p.waitForFunction(() => window.__blast.state().screen === 'game', null, { timeout: 60000 }); };
  const dtap = async (p, x, y) => { const t = Date.now() / 1000, pt = [{ x, y, id: 1 }];
    await p.cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: pt, timestamp: t }); await p.cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [], timestamp: t + 0.04 });
    await p.cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: pt, timestamp: t + 0.16 }); await p.cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [], timestamp: t + 0.2 }); };
  // the view is still: a leg of mill B projects to the same pixel twice, 500 ms apart
  const settle = async (p, sel) => { let last = null, same = 0; for (let k = 0; k < 120 && same < 2; k++) { const q = await p.evaluate((s) => { const B = window.__blast, m = B.test.select(s, 0)[0]; const v = m ? B.tap2.visPt(m.i) : null; return v ? { x: Math.round(v.x), y: Math.round(v.y), i: m.i } : null; }, sel);
      same = q && last && Math.abs(q.x - last.x) <= 1 && Math.abs(q.y - last.y) <= 1 ? same + 1 : 0; last = q; await p.waitForTimeout(500); } return last; };
  const R = [];
  // the plain opening (lesson already done): one screenshot
  { const p = await open({ init: seedDone }); await play(p); await p.waitForTimeout(1000); await settle(p, 'B:z+'); await p.waitForTimeout(600); await shot(p, '1-opening'); const s = await st(p);
    console.log('opening (lesson done): hand ' + JSON.stringify(s.hand) + ', dim ' + s.l1 + ', tnt ' + s.tnt + ', errors ' + p.errs.length); await p.context().close(); }
  for (let n = 1; n <= RUNS; n++) {
    const first = n === 1, vid = first && process.env.VIDEO === '1' ? path.join(OUT, 'video') : null, r = { run: n, steps: [] };
    const p = await open({ video: vid }); const log = (k, v) => { r.steps.push([k, v]); };
    try {
      await play(p);
      await p.waitForFunction(() => { const t = window.__blast.tap2.tut(); return t.l1 && t.hole; }, null, { timeout: 60000, polling: 200 }); await p.waitForTimeout(900);
      let s = await st(p); log('lesson', { lbl: s.lbl, hand: s.hand, tnt: s.tnt }); r.lesson = s.l1 && !!s.hand && s.hand.mode === 'dbl';
      if (first) { await shot(p, '2-guided-spotlight');
        await p.touchscreen.tap(300, 330); await p.waitForTimeout(700); const o = await st(p), fx = await p.evaluate(() => { try { return window.__blast.fx29().nudge; } catch (e) { return null; } });
        r.outside = { blocked: o.blocked, placed: o.placed, nudge: fx }; log('tap outside the spotlight', r.outside); await p.waitForTimeout(1200); s = await st(p); }
      await p.touchscreen.tap(s.hand.x, s.hand.y); await p.waitForTimeout(900);
      s = await st(p); log('1 TNT placed', { placed: s.placed, lbl: s.lbl, hand: s.hand }); r.placed1 = s.placed === 1;
      if (first) await shot(p, '3-guided-blast');
      await dtap(p, s.hand ? s.hand.x : 0, s.hand ? s.hand.y : 0);
      await p.waitForFunction(() => window.__blast.state().phase !== 'plan', null, { timeout: 15000, polling: 100 }); log('blast 1', await st(p));
      if (first) { await p.waitForTimeout(1500); await shot(p, '4-mill-A-falling'); }
      await p.waitForFunction(() => { const q = window.__blast.state(); return q.phase === 'plan' || q.screen !== 'game' || (q.result && q.result.ok != null); }, null, { timeout: 240000, polling: 200 });
      await p.waitForTimeout(800); const leg = await settle(p, 'B:z+'); await p.waitForTimeout(400);
      s = await st(p); log('after mill A', s); r.afterA = { phase: s.phase, pct: s.pct, tnt: s.tnt, hand: s.hand, dim: s.l1, lessonDone: s.done, screen: s.screen };
      r.alone = s.screen === 'game' && s.phase === 'plan' && !s.hand && !s.l1 && s.pct < 85;
      if (first) await shot(p, '5-mill-A-down-B-alone');
      if (!leg) throw new Error('no visible point on the front-left leg of mill B');
      await dtap(p, leg.x, leg.y);
      await p.waitForFunction(() => window.__blast.state().phase !== 'plan', null, { timeout: 15000, polling: 100 }); s = await st(p); log('blast 2', s); r.tntUsedB = r.afterA.tnt - (s.tnt == null ? 0 : s.tnt);
      if (first) { await p.waitForTimeout(1500); await shot(p, '6-mill-B-falling'); }
      const won = await p.waitForFunction(() => { const q = window.__blast.state(); return q.screen === 'result' || (q.result && q.result.ok != null) ? { screen: q.screen, ok: q.result ? q.result.ok : null, pct: q.result ? q.result.pct : q.pct } : null; }, null, { timeout: 240000, polling: 200 }).then(h => h.jsonValue());
      r.won = won; if (first) { await p.waitForTimeout(250); await shot(p, '7-win'); await p.waitForTimeout(700); await shot(p, '7b-win'); await p.waitForTimeout(900); await shot(p, '7c-win'); } await p.waitForTimeout(1500);
      r.save = await p.evaluate((k) => { try { return JSON.parse(localStorage.getItem(k)).level; } catch (e) { return null; } }, K);
      r.ok = !!(r.lesson && r.placed1 && r.alone && won && won.ok === true && r.save >= 1 && !p.errs.length);
    } catch (e) { r.err = e.message.slice(0, 300); r.ok = false; try { await shot(p, 'err-run' + n); r.at = await st(p); } catch (e2) {} }
    r.errs = p.errs; R.push(r);
    console.log((r.ok ? 'PASS' : 'FAIL') + ' run ' + n + ': lesson ' + r.lesson + ', 1 TNT ' + r.placed1 + ', after A ' + JSON.stringify(r.afterA) + ', B TNT used ' + r.tntUsedB + ', won ' + JSON.stringify(r.won) + ', save.level ' + r.save + (r.outside ? ', outside tap ' + JSON.stringify(r.outside) : '') + (r.err ? ', ERR ' + r.err + ' at ' + JSON.stringify(r.at) : '') + ', errors ' + p.errs.length);
    const v = vid ? p.video() : null; await p.context().close(); if (v) { const f = await v.path(); fs.renameSync(f, path.join(OUT, 'run1.webm')); }
  }
  fs.writeFileSync(path.join(OUT, 'fresh.json'), JSON.stringify(R, null, 1));
  console.log('first-timer runs: ' + R.filter(r => r.ok).length + '/' + R.length);
  await browser.close(); process.exit(R.every(r => r.ok) ? 0 : 1);
})().catch(e => { console.error(e); process.exit(1); });
