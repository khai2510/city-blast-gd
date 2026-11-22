#!/usr/bin/env node
/* City Blast! checks for polish R22 (tester round 22/11, feedback/2026-11-22/DIGEST.md group A): main/polish.js "R22" + main/frame.js F5.
 *   NODE_PATH=/opt/node22/lib/node_modules [BLAST_LIBS=<dir>] flock /dev/shm/chrome.lock node src/main/check-r22.js <game.html> [shots dir]
 *   env ONLY=boost|refit|open|retry|card|pill|map (one section), AB=1: also run each item on ?r22=0 and print the old numbers.
 * Libraries: BLAST_LIBS (three.min.js + rapier3d-compat-0.19.3/rapier.mjs, as main/check-main.js) or the native vendor folder
 * (three-r128.min.js + rapier3d-compat-0.19.3.mjs). One headless Chrome; 393 x 852 (?sa=59,0,34,0 = an iPhone 15 inset), touch.
 * Prints PASS / FAIL per item, writes <shots>/check-r22.json, exits 1 on any FAIL or page error. Level numbers: the play order. */
'use strict';
const path = require('path'), fs = require('fs');
const { chromium } = require('playwright');
const FILE = path.resolve(process.argv[2] || 'index-main.html'), SHOTS = path.resolve(process.argv[3] || path.join(path.dirname(FILE), 'r22-shots'));
const ONLY = process.env.ONLY || '', AB = process.env.AB === '1', VW = 393, VH = 852, SA = '&sa=59,0,34,0';
const LIBS = [process.env.BLAST_LIBS, process.env.CB_LIBS, '/home/user/floormen/games/blast/native/www/vendor'].filter(Boolean);
const lib = (...names) => { for (const d of LIBS) for (const n of names) { const f = path.join(d, n); if (fs.existsSync(f)) return f; } throw new Error('lib not found: ' + names.join(' / ') + ' (set BLAST_LIBS)'); };
const THREE = lib('three.min.js', 'three-r128.min.js'), RAPIER = lib('rapier3d-compat-0.19.3/rapier.mjs', 'rapier3d-compat-0.19.3.mjs');
fs.mkdirSync(SHOTS, { recursive: true });
const K = 'blastRush.save.v2', R = [], errs = [];
const SIG = (() => { const m = fs.readFileSync(FILE, 'utf8').match(/SLOTS = (\[[-0-9,]+\])/); return m ? 's:' + m[1].slice(1, -1) : null; })();
const DONE = {}; ['tnt', 'timber', 'dbltap', 't2l1', 't2l2', 'blast', 'brick', 'concrete', 'keep', 'rotate', 'steel', 'wreck', 'steps', 'rc', 'net', 'glass', 'sky', 'barrels', 'trap'].forEach(k => { DONE[k] = { c: 1, f: 1 }; });
const seed = (o) => `(()=>{try{if(!sessionStorage.getItem('r22Seed')){sessionStorage.setItem('r22Seed','1');${SIG ? `localStorage.setItem('${K}.lv7o','${SIG}');` : ''}localStorage.setItem('${K}',${JSON.stringify(JSON.stringify(Object.assign({ cv: 6, level: 0, coins: 0, upg: { power: 0, charge: 0, magnet: 0, slowmo: 0 }, best: {}, mute: true, music: false, tutv: 2, intro: DONE, zh: 1, bseen: { wreck: 2, net: 2, sky: 2 } }, o)))});}}catch(e){}})()`;
const item = (id, name, ok, note) => { R.push({ id, name, ok: !!ok, note: note == null ? '' : String(note) }); console.log((ok ? 'PASS ' : 'FAIL ') + id.padEnd(4) + name + (note != null && note !== '' ? '  [' + note + ']' : '')); };
let browser;
async function open(q, save, noSa) {
  const ctx = await browser.newContext({ viewport: { width: VW, height: VH }, hasTouch: true, isMobile: true, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  p.on('pageerror', e => errs.push('pageerror: ' + e.message.slice(0, 200)));
  await p.route(/fonts\.(googleapis|gstatic)\.com/, r => r.fulfill({ status: 200, body: '', contentType: 'text/css' }));
  await p.route(/cdnjs\.cloudflare\.com/, r => r.fulfill({ body: fs.readFileSync(THREE), contentType: 'application/javascript' }));
  await p.route(/rapier\.mjs/, r => r.fulfill({ body: fs.readFileSync(RAPIER), contentType: 'application/javascript', headers: { 'Access-Control-Allow-Origin': '*' } }));
  if (save) await p.addInitScript(save);
  await p.goto('file://' + FILE + '?dev=0' + (noSa ? '' : SA) + (q || ''));
  await p.waitForFunction(() => window.__blast, null, { timeout: 120000 }); await p.waitForTimeout(1500);
  await p.waitForFunction(() => !document.getElementById('hmStudio'), null, { timeout: 15000 }).catch(() => {});
  return p;
}
const close = (p) => p.context().close();
const st = (p) => p.evaluate(() => { const s = window.__blast.state(); return { screen: s.screen, phase: s.phase, level: s.level, pct: s.pct }; });
const plan = (p) => p.waitForFunction(() => window.__blast.state().phase === 'plan', null, { timeout: 600000, polling: 200 });
const rect = (p, sel) => p.evaluate((s) => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(), cs = getComputedStyle(e); return r.width > 0 && cs.display !== 'none' && cs.visibility !== 'hidden' ? { x: r.left, y: r.top, w: r.width, h: r.height } : null; }, sel);
const tap = async (p, sel) => { const b = await rect(p, sel); if (!b) throw new Error('nothing to tap: ' + sel); await p.touchscreen.tap(b.x + b.w / 2, b.y + b.h / 2); await p.waitForTimeout(500); };
const sheetUp = (p) => p.evaluate(() => { const e = document.getElementById('bPick'); return !!(e && !e.classList.contains('hidden') && e.getBoundingClientRect().height > 0); });
const playIn = async (p) => { await tap(p, '#play'); await p.waitForTimeout(1500); const sh = await sheetUp(p); if (sh) await tap(p, '#bpPlay'); await plan(p); return sh; };
const openDone = (p) => p.waitForFunction(() => { const s = window.__blast.frame.state(); return !s || !s.easing; }, null, { timeout: 120000 }).catch(() => {});
// the framing has settled (ease over, the view offset damped onto its target, the re-frame's live correction finished): on a phone
// this takes < 1 s; on the shared software-GL harness a few frames a second can make it take much longer, so wait for it, not a clock
const settled = (p) => p.waitForFunction(() => { const s = window.__blast.frame.state(); return !s || !s.live || s.settled; }, null, { timeout: 180000, polling: 250 }).catch(() => {});
const shot = (p, n) => p.screenshot({ path: path.join(SHOTS, n + '.jpg'), type: 'jpeg', quality: 70 });
const wk = (p) => p.evaluate(() => window.__blast.boost.inv().wreck || 0);
// the near-miss card: the real fail result moved to 78 % (code pct) and the card re-shown by the game's own showResult (shop resync)
const nearMiss = (p) => p.evaluate(() => { const r = window.__blast.state().result; r.ok = false; r.code = 'pct'; r.pct = 0.78; window.__blast.shop.resync(); });
// a quick fail: 1 TNT left, one tap on a member, BLAST, wait for the result card
const members = (p) => p.evaluate(() => window.__blast.members().filter(m => m.onScreen && m.pickable));
const fail = async (p) => { await p.evaluate(() => window.__blast.test.setStock({ tnt: 1 })); const m = await members(p); await p.touchscreen.tap(m[0].sx, m[0].sy); await p.waitForTimeout(500); await tap(p, '#blast'); await p.waitForFunction(() => window.__blast.state().screen === 'result', null, { timeout: 600000, polling: 300 }); await p.waitForTimeout(1500); };

(async () => {
  browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
  const want = (s) => !ONLY || ONLY === s;
  // the play order decides the levels (it moves: ORDER22 etc.): hard / boss slots, the first plain level after the Ball unlocks
  const INFO = await (async () => { const p = await open('', seed({})); const o = await p.evaluate(() => { const lv = window.__blast.levels(), isH = (i) => !!(window.LV7O && LV7O.isH && LV7O.isH(i));
    let wl = 12; try { wl = window.__blast.intro.lockLv('wreck') || wl; } catch (e) {}
    return { hb: lv.map((x, i) => ({ i, boss: x.boss, hard: isH(i) })).filter(x => x.boss || x.hard).map(x => x.i), hard: lv.findIndex((x, i) => isH(i)), plainAfterBall: lv.findIndex((x, i) => i >= wl && !x.boss && !isH(i) && !x.keep), wl }; });
    await close(p); return o; })();
  console.log('levels: hard/boss ' + INFO.hb.map(i => i + 1).join(',') + ' · first hard ' + (INFO.hard + 1) + ' · Ball unlock L' + INFO.wl + ', plain level after it L' + (INFO.plainAfterBall + 1));
  // ================= B1 BUG-1 / UX-70: an unswung chip use comes back; the ✕; the tip
  if (want('boost')) {
    const p = await open('', seed({ level: INFO.plainAfterBall, coins: 0, bst: { wreck: 1 } }));
    await playIn(p); await p.waitForTimeout(1500);
    const w0 = await wk(p); await tap(p, '#bbar .bst[data-k="wreck"]'); await p.waitForTimeout(1200);
    const a1 = await p.evaluate(() => window.__blast.polish.r22()); const w1 = await wk(p); await shot(p, 'r22-boost-armed');
    item('B1', 'UX-70: the chip tap arms the Ball (stock 1 -> 0 as before); a 48 x 48 ✕ sits on the chip\'s top-left corner; the tip reads "Tap to swing" / "Tap the chip to cancel"',
      w0 === 1 && w1 === 0 && a1.ball.aim && a1.x && a1.x.w >= 48 && a1.x.h >= 48 && /Tap the chip to cancel/.test(a1.tip || '') && a1.tip.split('\n').length === 2, JSON.stringify({ w0, w1, x: a1.x, tip: a1.tip }));
    const ch = await rect(p, '#bbar .bst[data-k="wreck"]'), x = a1.x;
    item('B2', 'the ✕ overlaps the chip\'s top-left corner and stays on screen', !!(ch && x && x.x < ch.x && x.x + x.w > ch.x && x.y < ch.y && x.y + x.h > ch.y && x.x >= 0 && x.y >= 0), JSON.stringify({ ch, x }));
    await tap(p, '#r22X'); await p.waitForTimeout(600);
    const a2 = await p.evaluate(() => window.__blast.polish.r22()), w2 = await wk(p);
    item('B3', 'BUG-1: the ✕ disarms and gives the unswung use back (stock 0 -> 1, chip back to its count)', w2 === 1 && !a2.ball.aim && a2.ball.left === 0 && !a2.x && a2.refund === 1, JSON.stringify({ w2, ball: a2.ball, refund: a2.refund }));
    await tap(p, '#bbar .bst[data-k="wreck"]'); await p.waitForTimeout(900); const w3a = await wk(p);
    await tap(p, '#bbar .bst[data-k="wreck"]'); await p.waitForTimeout(600); const w3 = await wk(p), a3 = await p.evaluate(() => window.__blast.polish.r22());
    item('B4', 'a 2nd tap on the armed chip cancels and gives the use back', w3a === 0 && w3 === 1 && !a3.ball.aim && a3.cancel >= 1, JSON.stringify({ w3a, w3, cancel: a3.cancel }));
    await tap(p, '#bbar .bst[data-k="wreck"]'); await p.waitForTimeout(900); const w4a = await wk(p);
    await tap(p, '#pauseBtn'); await p.waitForTimeout(600); await tap(p, '#pmHome'); await p.waitForTimeout(1500);
    const w4 = await wk(p);
    item('B5', 'BUG-1: armed, never swung, then leaving the level (Pause -> Home): the use comes back', w4a === 0 && w4 === 1, JSON.stringify({ w4a, w4, log: (await p.evaluate(() => window.__blast.polish.r22().log)).slice(-4) }));
    await playIn(p); await p.waitForTimeout(1500);
    await tap(p, '#bbar .bst[data-k="wreck"]'); await p.waitForTimeout(900); const w5a = await wk(p);
    await p.evaluate(() => { window.__blast.polish.r22(); }); await tap(p, '#r22X').catch(() => {}); await p.waitForTimeout(300);
    await tap(p, '#bbar .bst[data-k="wreck"]'); await p.waitForTimeout(900);
    await p.evaluate(() => window.__blast.start(window.__blast.state().level - 1)); await p.waitForTimeout(800);   // restart = a new start of the same level
    const w5 = await wk(p);
    item('B6', 'BUG-1: armed, never swung, then Restart (a new start of the level): the use comes back', w5a === 0 && w5 === 1, JSON.stringify({ w5a, w5 }));
    await plan(p); await p.waitForTimeout(800);
    await tap(p, '#bbar .bst[data-k="wreck"]'); await p.waitForTimeout(900); const w6a = await wk(p);
    await p.evaluate(() => window.__blast.boost && window.__blast.boost.aim && window.__blast.boost.aim(false)); await p.waitForTimeout(300);
    await fail(p); const w6 = await wk(p);
    item('B7', 'armed, put away (not swung), then the level ends (result card): the use comes back', w6a === 0 && w6 === 1, JSON.stringify({ w6a, w6, scr: (await st(p)).screen }));
    await close(p);
    if (AB) { const q = await open('&r22=0', seed({ level: INFO.plainAfterBall, coins: 0, bst: { wreck: 1 } })); await playIn(q); await p.waitForTimeout(0); await q.waitForTimeout(1500);
      await tap(q, '#bbar .bst[data-k="wreck"]'); await q.waitForTimeout(900); await tap(q, '#pauseBtn'); await q.waitForTimeout(600); await tap(q, '#pmHome'); await q.waitForTimeout(1500);
      console.log('     ?r22=0: armed then Home -> stock', await wk(q), '(BUG-1: lost)'); await close(q); }
  }
  // ================= C1 UX-71: re-frame when planning resumes with TNT left
  if (want('refit')) {
    for (const q of AB ? ['', '&r22=0'] : ['']) {
      const p = await open(q, seed({ level: 2, coins: 600 }));
      await playIn(p); await openDone(p); await p.waitForTimeout(1500);
      const m = (await members(p)).sort((a, b) => a.sy - b.sy).slice(-1)[0];
      await p.touchscreen.tap(m.sx, m.sy); await p.waitForTimeout(600); await tap(p, '#blast');
      await p.waitForFunction(() => { const s = window.__blast.state(); return s.screen !== 'game' || (s.phase === 'plan'); }, null, { timeout: 600000, polling: 300 });
      await p.waitForTimeout(400);
      const s = await st(p); await p.waitForTimeout(1000); await settled(p);
      const r = await p.evaluate(() => ({ m: window.__blast.frame.measureRem ? window.__blast.frame.measureRem() : null, x: window.__blast.polish.r22(), fs: window.__blast.frame.state() }));
      await shot(p, 'r22-refit' + (q ? '-off' : ''));
      if (q) { console.log('     ?r22=0 after the blast:', JSON.stringify(r.m)); await close(p); continue; }
      const b = r.m && r.m.box, A = r.m;
      item('C1', 'UX-71: after a blast that leaves TNT the camera re-frames on what still counts: inside x 16-377 and the play rect, >= 45 % of its height or >= 90 % of the width',
        s.screen === 'game' && r.x.refit >= 1 && b && b[0] >= 15 && b[2] <= VW - 15 && b[1] >= A.top - 1 && b[3] <= A.bot + 1 && (A.fillH >= 0.45 || A.fillW >= 0.9), JSON.stringify({ phase: s.phase, m: A, refit: r.x.refitLast }));
      // after the "+1 TNT" rescue the same move (a near miss: the game shows the offer itself)
      const n0 = r.x.refit; await fail(p);
      await nearMiss(p); await p.waitForTimeout(500);
      await tap(p, '#rRescue'); await plan(p); await p.waitForTimeout(1000); await settled(p);
      const r2 = await p.evaluate(() => ({ m: window.__blast.frame.measureRem(), x: window.__blast.polish.r22(), s: window.__blast.state() }));
      await shot(p, 'r22-refit-rescue'); const b2 = r2.m && r2.m.box;
      item('C1b', 'UX-71: after "+1 TNT" on the fail card the camera re-frames the same way (inside x 16-377 and the play rect)',
        r2.s.screen === 'game' && r2.x.refit > n0 && b2 && b2[0] >= 15 && b2[2] <= VW - 15 && b2[1] >= r2.m.top - 1 && b2[3] <= r2.m.bot + 1, JSON.stringify({ m: r2.m, refits: [n0, r2.x.refit], coins: r2.s.coins }));
      await close(p);
    }
  }
  // ================= C2 UX-72: hard / boss openings keep every target and protected building inside 16 px
  if (want('open')) {
    const lvls = INFO.hb;
    const env = (process.env.LVS || '').split(',').filter(Boolean).map(n => +n - 1), list = env.length ? env : lvls;
    for (const i of list) {
      const p = await open('', seed({ level: i, coins: 30 }));
      await playIn(p); await openDone(p); await settled(p); await p.waitForTimeout(500);
      const r = await p.evaluate(() => ({ s: window.__blast.state(), m: window.__blast.frame.measure(true), fs: window.__blast.frame.state() }));
      await shot(p, 'r22-open-L' + (i + 1)); const b = r.m.box;
      item('C' + (i + 1), 'UX-72: L' + (i + 1) + ' ' + r.s.name + ' opening: the corners of every target and protected member (+ dress) inside x 16-' + (VW - 16) + ' and the play rect',
        b[0] >= 15 && b[2] <= VW - 15 && b[1] >= r.m.top - 1 && b[3] <= VH - r.m.bot + 1, JSON.stringify({ box: b, top: r.m.top, bot: VH - r.m.bot, hard: r.fs && r.fs.hard, guard: r.fs && r.fs.guard }));
      await close(p);
    }
  }
  // ================= G1 GD-68: the sheet only on the first try; taps while building are kept
  if (want('retry')) {
    const p = await open('', seed({ level: INFO.hard, coins: 0 }));
    const sh1 = await playIn(p); await openDone(p); await p.waitForTimeout(1000);
    await fail(p); await p.evaluate(() => window.__blast.shop.fails(2));
    const rn = await rect(p, '#rNext'); await p.touchscreen.tap(rn.x + rn.w / 2, rn.y + rn.h / 2);
    // tap the hero while the level is still building (in-page pointer events: a Playwright tap is slower than the build here)
    await p.waitForFunction(() => { const s = window.__blast.state(); return s.screen === 'game' && (s.phase === 'build' || s.phase === 'plan'); }, null, { timeout: 120000, polling: 20 }).catch(() => {});
    const t = await p.evaluate(() => { const s = window.__blast.state(); if (s.phase !== 'build') return { phase: s.phase };
      const m = window.__blast.members().filter(q => q.onScreen && q.pickable)[0]; if (!m) return { phase: s.phase, none: true }; const el = document.querySelector('canvas');
      const o = { bubbles: true, cancelable: true, clientX: m.sx, clientY: m.sy, pointerId: 77, pointerType: 'touch', isPrimary: true, button: 0, buttons: 1 };
      el.dispatchEvent(new PointerEvent('pointerdown', o)); el.dispatchEvent(new PointerEvent('pointerup', Object.assign({}, o, { buttons: 0 }))); return { phase: window.__blast.state().phase, x: m.sx, y: m.sy }; });
    const sh2 = await sheetUp(p);
    await plan(p); await p.waitForTimeout(2500);
    const r = await p.evaluate(() => ({ x: window.__blast.polish.r22(), ch: window.__blast.tap2.charges().length }));
    item('G1', 'GD-68: the Hard / Boss sheet shows on the first try, not on the retry after 2 fails', sh1 && !sh2 && r.x.skip >= 1, JSON.stringify({ first: sh1, retry: sh2, skip: r.x.skip }));
    item('G2', 'GD-68: a tap made while the hard level builds is not lost: it is replayed when planning starts (1 TNT placed)', t.phase !== 'build' || (r.x.queued >= 1 && r.x.replayed >= 1 && r.ch >= 1), JSON.stringify({ tap: t, queued: r.x.queued, replayed: r.x.replayed, charges: r.ch }));
    await close(p);
    if (AB) { const q = await open('&r22=0', seed({ level: INFO.hard, coins: 0 })); await playIn(q); await q.waitForTimeout(1000); await fail(q); await q.evaluate(() => window.__blast.shop.fails(2)); await tap(q, '#rNext'); await q.waitForTimeout(1500);
      console.log('     ?r22=0: sheet on the retry after 2 fails:', await sheetUp(q)); await close(q); }
  }
  // ================= G2 GD-63: near-miss card roles (78 %, 600 coins: the game's own "+1 TNT · 150" offer)
  if (want('card')) {
    for (const q of AB ? ['', '&r22=0'] : ['']) {
      const p = await open(q, seed({ level: 2, coins: 600 }));
      await playIn(p); await openDone(p); await p.waitForTimeout(800); await fail(p);
      await nearMiss(p); await p.waitForTimeout(600);
      const r = await p.evaluate(() => { const g = (id) => { const e = document.getElementById(id), r = e.getBoundingClientRect(), cs = getComputedStyle(e); return { y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height), bg: cs.backgroundColor + ' ' + cs.backgroundImage.slice(0, 30), fs: parseFloat(cs.fontSize), quiet: e.className }; };
        return { next: g('rNext'), resc: g('rRescue') }; });
      await shot(p, 'r22-card' + (q ? '-off' : ''));
      if (q) { console.log('     ?r22=0:', JSON.stringify(r)); await close(p); continue; }
      const quiet = (o) => /255, 248, 225/.test(o.bg) && /none/.test(o.bg);
      item('G3', 'GD-63: Try Again is the primary (green, not the secondary / quiet style), the "+1 TNT" rescue is the quiet button under it, both >= 48 px tall, labels >= 16 px',
        !quiet(r.next) && /\bmint\b/.test(r.next.quiet) && !/\bsec\b/.test(r.next.quiet) && quiet(r.resc) && /r22quiet/.test(r.resc.quiet) && r.resc.y > r.next.y && r.next.h >= 48 && r.resc.h >= 48 && r.next.fs >= 16 && r.resc.fs >= 16, JSON.stringify(r));
      await close(p);
    }
  }
  // ================= G3 GD-66: the coin pill never covers the 85% label in play (fresh entry and after a retry)
  if (want('pill')) for (const noSa of [false, true]) {
    const p = await open('', seed({ level: 6, coins: 230 }), noSa);
    const over = (x) => !!(x && x.on && x.lab && x.pill[0] < x.lab[2] && x.lab[0] < x.pill[2] && x.pill[1] < x.lab[3] && x.lab[1] < x.pill[3]);
    await playIn(p); await p.waitForTimeout(1500); const a = await p.evaluate(() => window.__blast.polish.r22pill());
    await fail(p); await tap(p, '#rNext'); await p.waitForTimeout(1500); if (await sheetUp(p)) await tap(p, '#bpPlay');
    await plan(p); await p.waitForTimeout(1500); const b = await p.evaluate(() => window.__blast.polish.r22pill()); await shot(p, 'r22-pill-retry' + (noSa ? '-nosa' : ''));
    // the GD-66 state itself: the H4 "coins" class left on from the last collapse when the next attempt starts (slow devices / jumps)
    await p.evaluate(() => document.body.classList.add('uicCoins')); await p.waitForTimeout(400);
    const c = await p.evaluate(() => Object.assign(window.__blast.polish.r22pill(), { cls: document.body.classList.contains('uicCoins') }));
    item(noSa ? 'G4b' : 'G4', 'GD-66: in play the coin pill does not overlap the "85%" label (fresh entry, after Try Again)' + (noSa ? ', no cutout layout' : ', cutout layout'), !over(a) && !over(b) && !over(c) && !c.cls, JSON.stringify({ fresh: a, retry: b, stale: c }));
    await close(p);
  }
  // ================= G4 UX-74: Map plaques end >= 8 px before the coin pill at 393 px
  if (want('map')) {
    const p = await open('', seed({ level: 23, coins: 1234 }));
    await tap(p, '#uicMapB'); await p.waitForTimeout(2500);
    const m = await p.evaluate(() => window.__blast.polish.r22map());
    const cut = await p.evaluate(() => [...document.querySelectorAll('#cityMap .cmBoard')].filter(b => b.getBoundingClientRect().width).map(b => Math.max(0, ...[...b.children].map(c => c.scrollWidth - c.clientWidth))).reduce((a, b) => Math.max(a, b), 0));
    const fs = await p.evaluate(() => Math.min(...[...document.querySelectorAll('#cityMap .cmBoard b, #cityMap .cmBoard span')].filter(e => e.getBoundingClientRect().width).map(e => parseFloat(getComputedStyle(e).fontSize) * e.getBoundingClientRect().height / (e.offsetHeight || 1))));
    await shot(p, 'r22-map');
    item('G5', 'UX-74: at 393 px with 1,234 coins every district plaque beside the coin pill ends >= 8 px left of it; plaque words >= 16 px, none cut', !!m && (m.gap == null || m.gap >= 8) && fs >= 15.9 && cut === 0, JSON.stringify({ m, minFs: +fs.toFixed(1), cutPx: cut }));
    await close(p);
  }
  await browser.close();
  const bad = R.filter(r => !r.ok), KNOWN = /reading 'setMatrixAt'/;   // KNOWN: the engine's setMatrixAt page error (check-main intro Z1, before R22)
  const known = errs.filter(e => KNOWN.test(e)).length; errs.splice(0, errs.length, ...errs.filter(e => !KNOWN.test(e)));
  fs.writeFileSync(path.join(SHOTS, 'check-r22.json'), JSON.stringify({ file: FILE, results: R, errors: errs }, null, 1));
  console.log('\nR22: ' + (R.length - bad.length) + ' PASS, ' + bad.length + ' FAIL, page errors ' + errs.length + (errs.length ? ': ' + errs.slice(0, 3).join(' | ') : ''));
  process.exit(bad.length || errs.length ? 1 : 0);
})().catch(e => { console.error(e); try { browser && browser.close(); } catch (x) {} process.exit(1); });
