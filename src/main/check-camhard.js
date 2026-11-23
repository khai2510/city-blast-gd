#!/usr/bin/env node
/* City Blast! CAM-HARD check (frame.js F6, 23/11): per slot, the opening camera (yaw, pitch, distance, look-at, the main building and the lot on screen)
 * and the settled distance after each of 4 real swipes (CDP touch, release = the engine's 90-degree step). jump = max / min distance.
 *   NODE_PATH=/opt/node22/lib/node_modules BLAST_LIBS=/dev/shm/cb-rel-libs flock /dev/shm/chrome.lock node src/main/check-camhard.js <game.html> <slots csv> ["&camhard=0"] <out.json> [shots dir] */
'use strict';
const path = require('path'), fs = require('fs');
const { chromium } = require('playwright');
const [FILEa, SLOTSa, Q, OUT, SHOTS] = process.argv.slice(2);
const FILE = path.resolve(FILEa);
const LIBS = process.env.BLAST_LIBS || '/dev/shm/cb-rel-libs';
const THREE = path.join(LIBS, 'three.min.js'), RAPIER = path.join(LIBS, 'rapier3d-compat-0.19.3/rapier.mjs');
const K = 'blastRush.save.v2';
const SIG = (() => { const m = fs.readFileSync(FILE, 'utf8').match(/SLOTS = (\[[-0-9,]+\])/); return m ? 's:' + m[1].slice(1, -1) : null; })();
const ALL = ['tnt', 'timber', 'dbltap', 't2l1', 't2l2', 'blast', 'brick', 'concrete', 'keep', 'rotate', 'steel', 'wreck', 'steps', 'rc', 'net', 'glass', 'sky', 'barrels', 'trap'];
const done = () => { const o = {}; ALL.forEach(k => { o[k] = { c: 1, f: 1 }; }); return o; };
const seed = (lv) => `(()=>{try{if(!sessionStorage.getItem('cmSeed')){sessionStorage.setItem('cmSeed','1');${SIG ? `localStorage.setItem('${K}.lv7o','${SIG}');` : ''}localStorage.setItem('${K}',${JSON.stringify(JSON.stringify({ cv: 6, level: lv, coins: 0, upg: { power: 0, charge: 0, magnet: 0, slowmo: 0 }, best: {}, mute: true, music: false, tutv: 2, intro: done(), zh: 1, bseen: { wreck: 2, net: 2, sky: 2 }, hseen: 1 }))});}}catch(e){}})()`;
const errs = [];
let browser;
async function open(slot) {
  const ctx = await browser.newContext({ viewport: { width: 393, height: 852 }, hasTouch: true, isMobile: true, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  p.on('pageerror', e => errs.push('L' + slot + ' pageerror: ' + e.message.slice(0, 200)));
  p.on('console', m => { if (m.type() === 'error') errs.push('L' + slot + ' console: ' + m.text().slice(0, 200)); });
  await p.route(/fonts\.(googleapis|gstatic)\.com/, r => r.fulfill({ status: 200, body: '', contentType: 'text/css' }));
  await p.route(/cdnjs\.cloudflare\.com/, r => r.fulfill({ body: fs.readFileSync(THREE), contentType: 'application/javascript' }));
  await p.route(/rapier\.mjs/, r => r.fulfill({ body: fs.readFileSync(RAPIER), contentType: 'application/javascript', headers: { 'Access-Control-Allow-Origin': '*' } }));
  await p.addInitScript(seed(slot - 1));
  await p.goto('file://' + FILE + '?x=1&sa=59,0,34,0' + (Q || ''));
  await p.waitForFunction(() => window.__blast && window.__blast.state, null, { timeout: 120000 }); await p.waitForTimeout(1200);
  await p.waitForFunction(() => !document.getElementById('hmStudio'), null, { timeout: 15000 }).catch(() => {});
  return p;
}
const rect = (p, sel) => p.evaluate((s) => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(), cs = getComputedStyle(e); return r.width > 0 && cs.display !== 'none' && cs.visibility !== 'hidden' ? { x: r.left, y: r.top, w: r.width, h: r.height } : null; }, sel);
const tap = async (p, sel) => { const b = await rect(p, sel); if (!b) throw new Error('nothing to tap: ' + sel); await p.touchscreen.tap(b.x + b.w / 2, b.y + b.h / 2); await p.waitForTimeout(400); };
async function enter(p) {
  await tap(p, '#play'); await p.waitForTimeout(1500);
  for (let k = 0; k < 6; k++) {
    const st = await p.evaluate(() => window.__blast.state());
    if (st.screen === 'game' && st.phase === 'plan') break;
    const sh = await rect(p, '#bpPlay'); if (sh) { await tap(p, '#bpPlay'); await p.waitForTimeout(800); continue; }
    await p.waitForTimeout(1000);
  }
  await p.waitForFunction(() => window.__blast.state().phase === 'plan', null, { timeout: 120000, polling: 200 });
  await p.waitForFunction(() => { const s = window.__blast.frame.state(); return !s || s.settled; }, null, { timeout: 15000 }).catch(() => {});
  await p.waitForTimeout(2500);
}
const snap = (p) => p.evaluate(() => { const B = window.__blast, c = B.m14.cam(), m = B.frame.measure(false), lot = B.frame.measure(true), st = B.state();
  const pt = c.pitch, D = c.D, pos = c.pos, yw = Math.atan2(pos[0], pos[2]);
  const dirY = m.pitchDeg * Math.PI / 180, hy = Math.cos(dirY);
  // look-at from the camera pose: back along the view by D
  const yawR = m.yawDeg * Math.PI / 180;
  const look = [pos[0] - D * hy * Math.sin(yawR), pos[1] - D * Math.sin(dirY), pos[2] - D * hy * Math.cos(yawR)];
  return { slot: st.level, name: st.name, isH: !!(window.LV7O && LV7O.isH(st.level - 1)), isE: !!(window.LV7O && LV7O.isE(st.level - 1)), isO: !!(window.LV7O && LV7O.isO(st.level - 1)),
    hard7: null, yawDeg: m.yawDeg, baseYaw: +st.yaw.toFixed(3), pitchDeg: m.pitchDeg, D: m.D, dist: +c.dist.toFixed(1), zoomK: +c.zoomK.toFixed(3), look: look.map(v => +v.toFixed(1)), pos: pos.map(v => +v.toFixed(1)),
    hero: { box: m.box, dx: m.dx, dy: m.dy, fillW: m.fillW, fillH: m.fillH }, lot: { box: lot.box, dx: lot.dx, dy: lot.dy, fillW: lot.fillW, fillH: lot.fillH, inPlay: lot.inPlay }, inside: m.inside, W: m.W, fr: B.frame.state() && { hard: B.frame.state().hard, camhard: B.frame.state().camhard } }; });
async function swipe(p, cdp, dx) {
  const y = 470, x0 = 196 - dx / 2, n = 10;
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: x0, y, id: 1 }] });
  for (let i = 1; i <= n; i++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x0 + dx * i / n, y, id: 1 }] }); await p.waitForTimeout(16); }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
}
(async () => {
  browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
  let slots;
  if (SLOTSa === 'all') slots = null; else slots = SLOTSa.split(',').map(Number);
  const res = [];
  for (const s of slots) {
    let p;
    try {
      p = await open(s); await enter(p);
      const cdp = await p.context().newCDPSession(p);
      const r = await snap(p); r.hard7 = await p.evaluate(() => { try { return !!(window.__blast && window.__blast.frame && window.__blast.frame.state().hard); } catch (e) { return null; } });
      if (SHOTS) { fs.mkdirSync(SHOTS, { recursive: true }); await p.screenshot({ path: path.join(SHOTS, 'L' + s + '-open.jpg'), type: 'jpeg', quality: 75 }); }
      r.faces = [];
      for (let f = 1; f <= 4; f++) {
        await swipe(p, cdp, -160); await p.waitForTimeout(3000);
        const q = await snap(p); r.faces.push({ yawDeg: q.yawDeg, D: q.D, dist: q.dist, zoomK: q.zoomK, inside: q.inside, lotIn: q.lot.inPlay, lotFill: [q.lot.fillW, q.lot.fillH], lotBox: q.lot.box, heroDx: q.hero.dx });
        if (SHOTS && f === 1) await p.screenshot({ path: path.join(SHOTS, 'L' + s + '-face1.jpg'), type: 'jpeg', quality: 75 });
      }
      const Ds = [r.D].concat(r.faces.map(f => f.D));
      r.Dmin = Math.min(...Ds); r.Dmax = Math.max(...Ds); r.jump = +(r.Dmax / r.Dmin).toFixed(2);
      console.log(JSON.stringify({ s, n: r.name, H: r.isH, E: r.isE, O: r.isO, yaw: r.yawDeg, pitch: r.pitchDeg, D: r.D, faces: r.faces.map(f => f.D), jump: r.jump, heroDx: r.hero.dx, heroDy: r.hero.dy, lotIn: r.lot.inPlay, inside: [r.inside].concat(r.faces.map(f => f.inside)) }));
      res.push(r);
    } catch (e) { console.log('ERR L' + s + ' ' + e.message.slice(0, 200)); res.push({ slot: s, err: e.message.slice(0, 200) }); }
    if (p) await p.context().close();
  }
  await browser.close();
  fs.writeFileSync(OUT, JSON.stringify({ file: FILE, q: Q, res, errs }, null, 1));
  console.log('errors: ' + errs.length + (errs.length ? ' ' + errs.slice(0, 5).join(' | ') : ''));
})();
