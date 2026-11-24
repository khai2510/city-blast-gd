#!/usr/bin/env node
/* PLACE-1124 (24/11): page-error sweep + live element read for the order audit. Per slot: a save on that slot, Play (real taps),
 * the level's live member keys + fields (-> src/g7hard/audit-live.js), 4 swipes (as check-camhard), one TNT by a real tap on the member
 * nearest the screen centre, BLAST (tap; test.fire where the L1 lesson hides the button), settle; every page / console error with its stack.
 *   NODE_PATH=/opt/node22/lib/node_modules BLAST_LIBS=/dev/shm/cb-rel-libs flock /dev/shm/chrome.lock node src/g7hard/sweep-live.js <game.html> <slots csv|all> <out.json>
 *   env SWIPE=0 = no swipes. Profiles: /dev/shm/place-sweep-<pid>-<slot>, removed after each slot. */
'use strict';
const path = require('path'), fs = require('fs');
const { chromium } = require('playwright');
const [FILEa, SLOTSa, OUT] = process.argv.slice(2);
const FILE = path.resolve(FILEa), LIBS = process.env.BLAST_LIBS || '/dev/shm/cb-rel-libs';
const THREE = path.join(LIBS, 'three.min.js'), RAPIER = path.join(LIBS, 'rapier3d-compat-0.19.3/rapier.mjs');
const K = 'blastRush.save.v2';
const SIG = (() => { const m = fs.readFileSync(FILE, 'utf8').match(/SLOTS = (\[[-0-9,]+\])/); return m ? 's:' + m[1].slice(1, -1) : null; })();
const ALL = ['tnt', 'timber', 'dbltap', 't2l1', 't2l2', 'blast', 'brick', 'concrete', 'keep', 'rotate', 'steel', 'wreck', 'steps', 'rc', 'net', 'glass', 'sky', 'barrels', 'trap'];
const done = () => { const o = {}; ALL.forEach(k => { o[k] = { c: 1, f: 1 }; }); return o; };
const seed = (lv) => `(()=>{try{if(!sessionStorage.getItem('swSeed')){sessionStorage.setItem('swSeed','1');${SIG ? `localStorage.setItem('${K}.lv7o','${SIG}');` : ''}localStorage.setItem('${K}',${JSON.stringify(JSON.stringify({ cv: 6, level: lv, coins: 0, upg: { power: 0, charge: 0, magnet: 0, slowmo: 0 }, best: {}, mute: true, music: false, tutv: 2, intro: done(), zh: 1, bseen: { wreck: 2, net: 2, sky: 2 }, hseen: 1 }))});}}catch(e){}})()`;
const PROF = '/dev/shm/place-sweep-' + process.pid;

const rect = (p, sel) => p.evaluate((s) => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(), cs = getComputedStyle(e); return r.width > 0 && cs.display !== 'none' && cs.visibility !== 'hidden' ? { x: r.left, y: r.top, w: r.width, h: r.height } : null; }, sel);
const tap = async (p, sel) => { const b = await rect(p, sel); if (!b) throw new Error('nothing to tap: ' + sel); await p.touchscreen.tap(b.x + b.w / 2, b.y + b.h / 2); await p.waitForTimeout(400); };
(async () => {
  const slots = SLOTSa === 'all' ? Array.from({ length: 56 }, (_, i) => i + 1) : SLOTSa.split(',').map(Number);
  const res = [];
  for (const s of slots) {
    const errs = [];
    const ctx = await chromium.launchPersistentContext(PROF + '-' + s, { args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'], viewport: { width: 393, height: 852 }, hasTouch: true, isMobile: true, deviceScaleFactor: 1 });
    const p = ctx.pages()[0] || await ctx.newPage();
    p.on('pageerror', e => errs.push({ t: 'pageerror', msg: e.message, stack: (e.stack || '').slice(0, 1500) }));
    p.on('console', m => { if (m.type() === 'error') errs.push({ t: 'console', msg: m.text().slice(0, 600) }); });
    await p.route(/fonts\.(googleapis|gstatic)\.com/, r => r.fulfill({ status: 200, body: '', contentType: 'text/css' }));
    await p.route(/cdnjs\.cloudflare\.com/, r => r.fulfill({ body: fs.readFileSync(THREE), contentType: 'application/javascript' }));
    await p.route(/rapier\.mjs/, r => r.fulfill({ body: fs.readFileSync(RAPIER), contentType: 'application/javascript', headers: { 'Access-Control-Allow-Origin': '*' } }));
    await p.addInitScript(seed(s - 1));
    const r = { slot: s };
    try {
      await p.goto('file://' + FILE + '?x=1&sa=59,0,34,0');
      await p.waitForFunction(() => window.__blast && window.__blast.state, null, { timeout: 120000 }); await p.waitForTimeout(1200);
      await p.waitForFunction(() => !document.getElementById('hmStudio'), null, { timeout: 15000 }).catch(() => {});
      r.errLoad = errs.length;
      await tap(p, '#play'); await p.waitForTimeout(1500);
      for (let k = 0; k < 8; k++) { const st = await p.evaluate(() => window.__blast.state()); if (st.screen === 'game' && st.phase === 'plan') break;
        if (await rect(p, '#bpPlay')) { await tap(p, '#bpPlay'); await p.waitForTimeout(800); continue; } await p.waitForTimeout(1000); }
      await p.waitForFunction(() => window.__blast.state().phase === 'plan', null, { timeout: 120000, polling: 200 });
      await p.waitForFunction(() => { const s = window.__blast.frame.state(); return !s || !s.easing; }, null, { timeout: 60000, polling: 250 }).catch(() => {});
      await p.waitForTimeout(1500);
      Object.assign(r, await p.evaluate(() => { const B = window.__blast, st = B.state(), L = B.test.level(), keys = {};
        B.test.blocks().forEach(b => { if (!b.dead) keys[b.key] = (keys[b.key] || 0) + 1; });
        const p0 = st.level - 1;
        return { name: st.name, level: st.level, isH: !!LV7O.isH(p0), isE: !!LV7O.isE(p0), isO: !!LV7O.isO(p0), id: LV7O.id(p0), bp: L.bp || null, replaces: L.replaces || null,
          tier: L.tier || null, boss: !!L.boss, hard: !!L.hard, keeps: (L.keeps || []).length, tanks: (L.tanks || []).length, teaches: L.teaches || null, faces: !!L.faces,
          trap: JSON.stringify(L).match(/trap/gi) ? (JSON.stringify(L).match(/"[^"]*trap[^"]*"/gi) || []).slice(0, 6) : [], drop: !!L.drop, perBlast: L.perBlast || L.pb || null,
          tnt: (L.charges && L.charges.tnt) || null, solW: Array.isArray(L.sol) ? L.sol.length : null, keys }; }));
      const ms = await p.evaluate(() => window.__blast.members().filter(m => m.onScreen && m.pickable));
      r.pickable = ms.length;
      if (ms.length) {
        const near = ms.slice().sort((a, b) => Math.hypot(a.sx - 196, a.sy - 480) - Math.hypot(b.sx - 196, b.sy - 480));
        for (let t = 0; t < Math.min(20, near.length) && !r.placed; t++) {   // the nearest member may be a keep / not placeable: try the next ones
          await p.touchscreen.tap(near[t].sx, near[t].sy); await p.waitForTimeout(700);
          r.placed = await p.evaluate(() => window.__blast.state().placed); r.tries = t + 1; }
        if (!r.placed) { const h = await p.evaluate(() => { try { const a = window.__blast.tap2.hand(); return a && a.on ? a : null; } catch (e) { return null; } });   // L1 / L2 lesson: the hand's spot
          if (h) { r.tapBy = 'hand'; await p.touchscreen.tap(Math.round(h.x), Math.round(h.y)); await p.waitForTimeout(700); r.placed = await p.evaluate(() => window.__blast.state().placed); } }
        r.swipes = 0;
        if (process.env.SWIPE !== '0') { const cdp = await p.context().newCDPSession(p);   // 4 swipes like check-camhard (the camera agent's repro)
          for (const dx of [160, 160, -160, -160]) { const y = 470, x0 = 196 - dx / 2; await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: x0, y, id: 1 }] });
            for (let i = 1; i <= 10; i++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x0 + dx * i / 10, y, id: 1 }] }); await p.waitForTimeout(16); }
            await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await p.waitForTimeout(1800); r.swipes++; } }
        r.errBeforeBlast = errs.length;
        if (await rect(p, '#blast')) await tap(p, '#blast'); else { r.blastBy = 'test.fire'; await p.evaluate(() => window.__blast.test.fire()); }
        const t0 = Date.now();
        await p.waitForFunction(() => { const s = window.__blast.state(); return s.screen === 'result' || (s.phase === 'plan' && s.wave > 1) || s.phase === 'done'; }, null, { timeout: 120000, polling: 300 }).catch(() => { r.blastTimeout = true; });
        r.blastSec = Math.round((Date.now() - t0) / 1000); await p.waitForTimeout(1500);
        r.after = await p.evaluate(() => { const s = window.__blast.state(); return { screen: s.screen, phase: s.phase, wave: s.wave }; });
      }
    } catch (e) { r.fail = String(e.message || e).slice(0, 300); }
    r.errs = errs;
    console.log('L' + s + ' ' + (r.name || '?') + ' bp=' + r.bp + ' keys=' + Object.keys(r.keys || {}).join(',') + ' placed=' + r.placed + ' after=' + JSON.stringify(r.after) + ' errs=' + errs.length + (r.fail ? ' FAIL ' + r.fail : '') + (errs.length ? '\n   ' + errs.map(e => e.t + ': ' + e.msg.slice(0, 160)).join('\n   ') : ''));
    res.push(r);
    fs.writeFileSync(OUT, JSON.stringify(res, null, 1));
    await ctx.close(); fs.rmSync(PROF + '-' + s, { recursive: true, force: true });
  }
  const n = res.reduce((a, r) => a + r.errs.length, 0);
  console.log('TOTAL errors ' + n + ' over ' + res.length + ' slots; fails ' + res.filter(r => r.fail).length);
})();
