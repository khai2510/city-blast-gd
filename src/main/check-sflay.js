#!/usr/bin/env node
/* City Blast! checks for the "sflay" step (main/sflay.js, Khai 22/11/2026: the SF-style corners layout ON in main; ?sflay=0 = old layout).
 *   NODE_PATH=/opt/node22/lib/node_modules [BLAST_LIBS=<dir>] flock /dev/shm/chrome.lock node src/main/check-sflay.js <game.html> [shots dir]
 *   env ONLY=layout|lock|l1|l3|unlock|dev|cam|ff|pre|off (one section)
 * Libraries: BLAST_LIBS (three.min.js + rapier3d-compat-0.19.3/rapier.mjs) or the native vendor folder (three-r128.min.js + rapier3d-compat-0.19.3.mjs).
 * One headless Chrome, touch. 393 x 852 with ?sa=59,0,34,0 (an iPhone 15 inset) and 375 x 667 (no inset, iPhone SE).
 * Real taps on the moved buttons (padlock wiggle, forced first use of the Ball at its unlock level, the gear -> Pause, the level picker).
 * Prints PASS / FAIL per item, writes <shots>/check-sflay.json, exits 1 on any FAIL or page error. Level numbers: the play order. */
'use strict';
const path = require('path'), fs = require('fs');
const { chromium } = require('playwright');
const FILE = path.resolve(process.argv[2] || 'index-main.html'), SHOTS = path.resolve(process.argv[3] || path.join(path.dirname(FILE), 'sflay-shots'));
const ONLY = process.env.ONLY || '', SA = '&sa=59,0,34,0';
const LIBS = [process.env.BLAST_LIBS, process.env.CB_LIBS, '/home/user/floormen/games/blast/native/www/vendor'].filter(Boolean);
const lib = (...names) => { for (const d of LIBS) for (const n of names) { const f = path.join(d, n); if (fs.existsSync(f)) return f; } throw new Error('lib not found: ' + names.join(' / ') + ' (set BLAST_LIBS)'); };
const THREE = lib('three.min.js', 'three-r128.min.js'), RAPIER = lib('rapier3d-compat-0.19.3/rapier.mjs', 'rapier3d-compat-0.19.3.mjs');
fs.mkdirSync(SHOTS, { recursive: true });
const K = 'blastRush.save.v2', R = [], errs = [];
const SIG = (() => { const m = fs.readFileSync(FILE, 'utf8').match(/SLOTS = (\[[-0-9,]+\])/); return m ? 's:' + m[1].slice(1, -1) : null; })();
const ALL = ['tnt', 'timber', 'dbltap', 't2l1', 't2l2', 'blast', 'brick', 'concrete', 'keep', 'rotate', 'steel', 'wreck', 'steps', 'rc', 'net', 'glass', 'sky', 'barrels', 'trap'];
const done = (but) => { const o = {}; ALL.filter(k => !(but || []).includes(k)).forEach(k => { o[k] = { c: 1, f: 1 }; }); return o; };
const seed = (o) => `(()=>{try{if(!sessionStorage.getItem('sfSeed')){sessionStorage.setItem('sfSeed','1');${SIG ? `localStorage.setItem('${K}.lv7o','${SIG}');` : ''}localStorage.setItem('${K}',${JSON.stringify(JSON.stringify(Object.assign({ cv: 6, level: 0, coins: 0, upg: { power: 0, charge: 0, magnet: 0, slowmo: 0 }, best: {}, mute: true, music: false, tutv: 2, intro: done(), zh: 1, bseen: { wreck: 2, net: 2, sky: 2 } }, o)))});}}catch(e){}})()`;
const item = (id, name, ok, note) => { R.push({ id, name, ok: !!ok, note: note == null ? '' : String(note) }); console.log((ok ? 'PASS ' : 'FAIL ') + id.padEnd(5) + name + (note != null && note !== '' ? '  [' + note + ']' : '')); };
let browser;
async function open(q, save, vw, vh) {
  const ctx = await browser.newContext({ viewport: { width: vw || 393, height: vh || 852 }, hasTouch: true, isMobile: true, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  p.on('pageerror', e => errs.push('pageerror: ' + e.message.slice(0, 200)));
  p.on('console', m => { if (m.type() === 'error' && /sflay/.test(m.text())) errs.push('console: ' + m.text().slice(0, 200)); });
  await p.route(/fonts\.(googleapis|gstatic)\.com/, r => r.fulfill({ status: 200, body: '', contentType: 'text/css' }));
  await p.route(/cdnjs\.cloudflare\.com/, r => r.fulfill({ body: fs.readFileSync(THREE), contentType: 'application/javascript' }));
  await p.route(/rapier\.mjs/, r => r.fulfill({ body: fs.readFileSync(RAPIER), contentType: 'application/javascript', headers: { 'Access-Control-Allow-Origin': '*' } }));
  if (save) await p.addInitScript(save);
  await p.goto('file://' + FILE + '?x=1' + (q || ''));
  await p.waitForFunction(() => window.__blast, null, { timeout: 120000 }); await p.waitForTimeout(1500);
  await p.waitForFunction(() => !document.getElementById('hmStudio'), null, { timeout: 15000 }).catch(() => {});
  return p;
}
const close = (p) => p.context().close();
const plan = (p) => p.waitForFunction(() => window.__blast.state().phase === 'plan', null, { timeout: 600000, polling: 200 });
const rect = (p, sel) => p.evaluate((s) => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(), cs = getComputedStyle(e); return r.width > 0 && cs.display !== 'none' && cs.visibility !== 'hidden' ? { x: r.left, y: r.top, w: r.width, h: r.height } : null; }, sel);
const tap = async (p, sel) => { const b = await rect(p, sel); if (!b) throw new Error('nothing to tap: ' + sel); await p.touchscreen.tap(b.x + b.w / 2, b.y + b.h / 2); await p.waitForTimeout(500); };
const sheetUp = (p) => p.evaluate(() => { const e = document.getElementById('bPick'); return !!(e && !e.classList.contains('hidden') && e.getBoundingClientRect().height > 0); });
const playIn = async (p, keepSheet) => { await tap(p, '#play'); await p.waitForTimeout(1500); const sh = await sheetUp(p); if (sh && !keepSheet) await tap(p, '#bpPlay'); if (!keepSheet || !sh) await plan(p); return sh; };
const openDone = (p) => p.waitForFunction(() => { const s = window.__blast.frame.state(); return !s || !s.easing; }, null, { timeout: 120000 }).catch(() => {});
const shot = (p, n) => p.screenshot({ path: path.join(SHOTS, n + '.jpg'), type: 'jpeg', quality: 72 });
const IS = (p) => p.evaluate(() => window.__blast.intro.state());
const SF = (p) => p.evaluate(() => window.__blast.sflay.rects());
const ovl = (a, b, m) => !!(a && b) && a.x < b.r + (m || 0) && b.x < a.r + (m || 0) && a.y < b.b + (m || 0) && b.y < a.b + (m || 0);
const inside = (pt, b, pad) => !!(pt && b) && pt.x >= b.x - (pad || 0) && pt.x <= b.r + (pad || 0) && pt.y >= b.y - (pad || 0) && pt.y <= b.b + (pad || 0);
// the layout rules: corners, no overlap between the moved controls, BLAST >= 10 px clear of the columns, targets >= 48 px, text >= 16 px
const layout = async (p, W, H, tag) => {
  const r = await SF(p), fsz = await p.evaluate(() => { const f = (s) => { const e = document.querySelector(s); return e && e.getBoundingClientRect().width ? parseFloat(getComputedStyle(e).fontSize) * (e.getBoundingClientRect().height / (e.offsetHeight || e.getBoundingClientRect().height)) : null; };
    return { level: f('#lvTxt'), blast: f('#blast .ulBl') || f('#blast'), tnt: f('#chips .chip .n b') || f('#chips .chip .n') }; });
  const ks = ['tnt', 'gear', 'level', 'blast', 'wreck', 'net', 'sky', 'dev'], bad = [];
  for (let i = 0; i < ks.length; i++) for (let j = i + 1; j < ks.length; j++) if (ovl(r[ks[i]], r[ks[j]])) bad.push(ks[i] + '/' + ks[j]);
  const clear = r.blast && r.wreck && r.sky ? Math.min(r.blast.x - Math.max(r.wreck.r, r.net ? r.net.r : 0), Math.min(r.sky.x) - r.blast.r) : -1;
  const corners = r.tnt && r.tnt.x < W / 3 && r.tnt.y < H / 5 && r.gear && r.gear.r > W * 2 / 3 && r.gear.y < H / 6 && r.wreck && r.wreck.x < W / 4 && r.wreck.b > H - 90 && r.net && r.net.x < W / 4 && r.net.b <= r.wreck.y && r.sky && r.sky.r > W * 3 / 4 && r.sky.b > H - 90 &&
    r.blast && Math.abs(r.blast.x + r.blast.w / 2 - W / 2) <= 2 && r.blast.b > H - 90 && r.level && Math.abs(r.level.x + r.level.w / 2 - W / 2) <= 2 && r.level.y < H / 6;
  const small = ['gear', 'blast', 'wreck', 'net', 'sky', 'tnt'].filter(k => r[k] && (r[k].w < 48 || r[k].h < 48));
  const onScr = ks.filter(k => r[k] && (r[k].x < 0 || r[k].y < 0 || r[k].r > W || r[k].b > H));
  const fsBad = Object.keys(fsz).filter(k => fsz[k] != null && fsz[k] < 15.9);
  return { ok: corners && !bad.length && clear >= 10 && !small.length && !onScr.length && !fsBad.length, note: tag + ' ' + JSON.stringify({ corners, overlap: bad, clear, small, off: onScr, fs: fsz, r: { tnt: r.tnt, gear: r.gear, level: r.level, blast: r.blast, wreck: r.wreck, net: r.net, sky: r.sky, dev: r.dev } }), r };
};

(async () => {
  browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
  const want = (s) => !ONLY || ONLY === s;
  const INFO = await (async () => { const p = await open('', seed({})); const o = await p.evaluate(() => { const lv = window.__blast.levels(), isH = (i) => !!(window.LV7O && LV7O.isH && LV7O.isH(i));
    let wl = 12; try { wl = window.__blast.intro.lockLv('wreck') || wl; } catch (e) {}
    let bl = 3; try { bl = window.__blast.intro.sched().find(e => e.id === 'brick').lv || bl; } catch (e) {}
    return { bl, n: lv.length, boss: lv.findIndex((x, i) => x.boss && !isH(i)), hard: lv.findIndex((x, i) => isH(i)), plain: lv.findIndex((x, i) => i >= wl && !x.boss && !isH(i) && !x.keep), wl, front: lv.map((x, i) => ({ i, o: window.LV7O ? LV7O.orig1(i) : i + 1, b: !!x.boss, h: isH(i) })).filter(q => !q.b && !q.h && q.o !== 4 && q.o !== 5 && q.i !== 2 && q.i !== 24 && q.i >= 5).slice(0, 3).map(q => q.i) }; });
    await close(p); return o; })();
  console.log('levels: ' + INFO.n + ' · Ball unlock L' + INFO.wl + ' · Brick card L' + INFO.bl + ' · first hard L' + (INFO.hard + 1) + ' · first boss L' + (INFO.boss + 1) + ' · plain after Ball L' + (INFO.plain + 1));

  // ================= SF1 / SF2 the corners at 393 x 852 (iPhone 15 inset) and 375 x 667 (SE), boosters unlocked
  if (want('layout')) {
    for (const [W, H, q, id] of [[393, 852, SA, 'SF1'], [375, 667, '', 'SF2']]) {
      const p = await open(q, seed({ level: INFO.plain, bst: { wreck: 1, net: 1, sky: 1 } }), W, H);
      await playIn(p); await openDone(p); await p.waitForTimeout(800);
      const a = await layout(p, W, H, W + 'x' + H); await shot(p, 'sf-layout-' + W + 'x' + H);
      const g = await p.evaluate(() => { const g = window.__blast.sflay.geo(), b = document.getElementById('bottom').getBoundingClientRect(); return { band: g.band, top: Math.round(b.top), h: innerHeight, bot: Math.round(g.bot) }; });
      item(id, 'Corners at ' + W + 'x' + H + ': TNT card top-left, gear top-right, level label top-centre, Ball + Net left column, Sky Strike right, BLAST centred >= 10 px clear of both columns; no overlap (dev button too), targets >= 48 px, text >= 16 px; #bottom is the bottom band (top = screen - band)', a.ok && Math.abs(g.top - (g.h - g.band)) <= 1, a.note + ' band ' + JSON.stringify(g));
      await close(p);
    }
  }
  // ================= SF3 fresh save, L1: three padlocks; a real tap on one = wiggle, nothing placed, no toast
  if (want('lock')) {
    const p = await open('', seed({ level: INFO.plain, bseen: {}, bst: {} }));
    await playIn(p); await openDone(p); await p.waitForTimeout(800);
    const r = await SF(p), locks = ['wreck', 'net', 'sky'].filter(k => r[k] && r[k].lock && r[k + 'Lk']);
    const w0 = await p.evaluate(() => window.__blast.sflay.wig().n), s0 = await p.evaluate(() => window.__blast.state().placed);
    if (r.sky) await p.touchscreen.tap(r.sky.x + r.sky.w / 2, r.sky.y + r.sky.h / 2); await p.waitForTimeout(500);
    if (r.net) await p.touchscreen.tap(r.net.x + r.net.w / 2, r.net.y + r.net.h / 2); await p.waitForTimeout(500);
    const w1 = await p.evaluate(() => window.__blast.sflay.wig()), s1 = await p.evaluate(() => ({ placed: window.__blast.state().placed, pad: [...document.querySelectorAll('#bbar .bst.lock .sfPad')].filter(e => e.getBoundingClientRect().width > 0).length }));
    await shot(p, 'sf-locked');
    item('SF3', 'Locked boosters (Ball / Net / Sky before their unlock): round buttons with a padlock only; a real tap = padlock wiggle (counted), places nothing', locks.length === 3 && s1.pad === 3 && w1.n - w0 === 2 && s1.placed === s0, 'locked ' + locks.join(',') + ', pads ' + s1.pad + ', wiggles ' + (w1.n - w0) + ' last ' + w1.last + ', placed ' + s0 + '->' + s1.placed);
    await close(p);
  }
  // ================= SF4 L1 from a fresh save: the teach spotlight and hand in the play area (not on a corner button), the lesson won by real taps
  if (want('l1')) {
    const p = await open('', null);
    await playIn(p); await p.waitForTimeout(2500);
    const a = await p.evaluate(() => ({ hand: window.__blast.tap2.hand(), tut: window.__blast.tap2.tut(), nb: window.__blast.tap2.noBlast() })), r = await SF(p), g = await p.evaluate(() => window.__blast.sflay.geo());
    const hole = a.tut && a.tut.hole, bandTop = 852 - g.band, hb = await rect(p, '#t2Lbl');
    const okPos = a.hand.on && hole && hole.y < bandTop && hole.y > g.top && !['wreck', 'net', 'sky', 'tnt', 'gear'].some(k => inside(hole, r[k], 4)) && (!hb || !['tnt', 'gear', 'level', 'wreck', 'net', 'sky'].some(k => ovl({ x: hb.x, y: hb.y, r: hb.x + hb.w, b: hb.y + hb.h }, r[k])));
    await shot(p, 'sf-L1-teach');
    const hx = Math.round(a.hand.x), hy = Math.round(a.hand.y);
    await p.touchscreen.tap(hx, hy); await p.waitForTimeout(700);
    const h2 = await p.evaluate(() => window.__blast.tap2.hand()); const lbl = await p.evaluate(() => { const e = document.getElementById('t2Lbl'); return e && !e.classList.contains('hidden') ? e.textContent : null; });
    const tx = Math.round(h2.on ? h2.x : hx), ty = Math.round(h2.on ? h2.y : hy);
    await p.touchscreen.tap(tx, ty); await p.waitForTimeout(120); await p.touchscreen.tap(tx, ty);
    const won = await p.waitForFunction(() => { const s = window.__blast.state(); return s.screen === 'result' || (s.result && s.result.ok) || s.screen === 'title' ? { screen: s.screen, ok: s.result ? s.result.ok : null, pct: s.result ? s.result.pct : s.pct } : null; }, null, { timeout: 600000, polling: 300 }).then(h => h.jsonValue()).catch(() => null);
    const sv = await p.evaluate(() => { try { return JSON.parse(localStorage.getItem('blastRush.save.v2')).level; } catch (e) { return null; } });
    item('SF4', 'L1 fresh save: the double-tap spotlight + hand + "Double-tap!" label sit in the play area (under the top row, above the booster band, on no corner button); the lesson played by real taps (tap, then double tap) wins L1', okPos && a.nb && !!won && won.ok !== false && sv >= 1,
      JSON.stringify({ hole, hand: a.hand, bandTop, top: g.top, lbl, label2: lbl, won, saveLevel: sv }));
    await shot(p, 'sf-L1-won');
    await close(p);
  }
  // ================= SF5 L3 the Brick card + forced tap on a brick member: the spotlight in the play area, off the corner buttons
  if (want('l3')) {
    const p = await open('', seed({ level: INFO.bl - 1, intro: done(['brick']) }));
    await playIn(p);
    let st = null; for (let k = 0; k < 80; k++) { st = await IS(p); if (st.card) { await tap(p, '#inBtn'); } else if (st.forced && st.hole) break; await p.waitForTimeout(250); }
    const r = await SF(p), g = await p.evaluate(() => window.__blast.sflay.geo()), h = st && st.hole;
    await shot(p, 'sf-L3-spotlight');
    const ok = !!h && st.forced === 'brick' && h.y - h.r > g.top - 10 && h.y < 852 - g.band && !['wreck', 'net', 'sky', 'tnt', 'gear', 'level'].some(k => ovl({ x: h.x - h.r * 0.6, y: h.y - h.r * 0.6, r: h.x + h.r * 0.6, b: h.y + h.r * 0.6 }, r[k]));
    // Pause from the gear while the spotlight is up (polish R21: Pause stays live over a material spotlight), then Resume: the spotlight is back
    const g0 = await rect(p, '#pauseBtn'); let paused = null;
    if (g0) { await p.touchscreen.tap(g0.x + g0.w / 2, g0.y + g0.h / 2); await p.waitForTimeout(700); paused = await p.evaluate(() => { const e = document.getElementById('pauseM'); return { pause: !!(e && !e.classList.contains('hidden') && e.getBoundingClientRect().height), rows: e ? e.querySelectorAll('button, [role=switch]').length : 0 }; }); await shot(p, 'sf-pause-in-spotlight'); }
    const res = await p.evaluate(() => { const b = [...document.querySelectorAll('#pauseM button')].find(x => /resume/i.test((x.textContent || '') + ' ' + (x.getAttribute('aria-label') || ''))); if (!b) return null; const q = b.getBoundingClientRect(); return { x: q.left + q.width / 2, y: q.top + q.height / 2 }; });
    if (res) { await p.touchscreen.tap(res.x, res.y); await p.waitForTimeout(700); }
    const stP = await IS(p);
    item('SF7', 'The gear (top-right) opens Pause (with the Settings rows) during the Brick spotlight; Resume brings the spotlight back', !!paused && paused.pause && paused.rows >= 4 && !!res && stP.forced === 'brick', JSON.stringify({ gear: g0, paused, resume: !!res, forced: stP.forced }));
    let after = null; if (h) { await p.touchscreen.tap(h.x, h.y); await p.waitForTimeout(700); after = await p.evaluate(() => ({ forced: window.__blast.intro.state().forced, placed: window.__blast.state().placed })); }
    item('SF5', 'L' + INFO.bl + ' Brick spotlight: the cut-out is on the field between the top row and the booster band, on no corner button; its real tap releases and places one TNT', ok && after && !after.forced && after.placed === 1, JSON.stringify({ forced: st && st.forced, hole: h, top: g.top, bandTop: 852 - g.band, after }));
    await close(p);
  }
  // ================= SF6 / SF7 the Ball unlock level: card, Claim, the forced first use on the bottom-left button (Pause works under the spotlight)
  if (want('unlock')) {
    const p = await open(SA, seed({ level: INFO.wl - 1, bseen: {}, bst: {}, intro: done(['wreck']) }));
    await playIn(p);
    let st = null, card = false; for (let k = 0; k < 100; k++) { st = await IS(p); if (st.card) { if (!card) { card = true; await p.waitForTimeout(500); await shot(p, 'sf-L' + INFO.wl + '-unlock-card'); } await tap(p, '#inBtn'); } else if (st.forced && st.hole) break; await p.waitForTimeout(250); }
    await p.waitForTimeout(500); st = await IS(p);
    const r = await SF(p), hole = st.hole, onBall = !!hole && inside(hole, r.wreck, 2) && st.forced === 'wreck';
    const handR = await rect(p, '#inHand');
    await shot(p, 'sf-L' + INFO.wl + '-forced-ball');
    item('SF6', 'L' + INFO.wl + ' Ball unlock: "Unlocked!" card, Claim, then the forced first use cuts out the Ball button in its new bottom-left corner (hand next to it, on screen)', card && onBall && !!handR && handR.x >= 0 && handR.y + handR.h <= 852 + 2,
      JSON.stringify({ card, forced: st.forced, hole, ball: r.wreck, hand: handR }));
    const st2 = await IS(p);
    // the forced tap on the Ball arms it
    const h2 = st2.hole || hole; if (h2) { await p.touchscreen.tap(h2.x, h2.y); await p.waitForTimeout(900); }
    const st3 = await p.evaluate(() => ({ forced: window.__blast.intro.state().forced, on: !!document.querySelector('#bbar .bst[data-k="wreck"].on'), inv: window.__blast.boost.inv().wreck || 0 }));
    item('SF8', 'The forced tap on the moved Ball button releases the spotlight and arms the Ball', !st3.forced && st3.on, JSON.stringify(st3));
    await close(p);
  }
  // ================= SF9 the LV picker button (on by default) and the gear: visible, tappable, clear of the TNT card
  if (want('dev')) {
    const p = await open('', seed({ level: INFO.plain }));
    await playIn(p); await openDone(p);
    const r = await SF(p), clear = r.dev && !['tnt', 'gear', 'level'].some(k => ovl(r.dev, r[k], 2));
    let on = false; if (r.dev) { await p.touchscreen.tap(r.dev.x + r.dev.w / 2, r.dev.y + r.dev.h / 2); await p.waitForTimeout(600); on = await p.evaluate(() => { const e = document.getElementById('lvPanel'); return !!(e && e.classList.contains('on')); }); }
    await shot(p, 'sf-dev-panel');
    item('SF9', 'The level picker button shows under the TNT card in play (clear of the card, gear and level label) and opens the picker on a real tap', !!clear && on, JSON.stringify({ dev: r.dev, tnt: r.tnt, on }));
    await close(p);
  }
  // ================= SF10-SF12 the planning camera: front-on on ordinary levels; hard and boss openings keep main's (whole lot)
  if (want('cam')) {
    const cam = async (i, q) => { const p = await open(q || '', seed({ level: i })); await playIn(p); await openDone(p); await p.waitForTimeout(600);
      const o = await p.evaluate(() => ({ log: window.__blast.sflay.camLog ? window.__blast.sflay.camLog().last : null, fr: window.__blast.frame.state(), m: window.__blast.frame.measure ? window.__blast.frame.measure() : null, cf: Object.assign({}, window.__blast.frame.cfg()) }));
      o.p = p; return o; };
    const fr = []; for (const i of INFO.front) { const o = await cam(i); const off = o.fr ? Math.abs(((o.fr.yawOpen % (Math.PI / 2)) + Math.PI / 2) % (Math.PI / 2)) : 9; fr.push({ L: i + 1, off: +Math.min(off, Math.PI / 2 - off).toFixed(3), pitch: o.cf.pitch, kept: o.log && o.log.kept }); if (i === INFO.front[0]) await shot(o.p, 'sf-cam-L' + (i + 1)); await close(o.p); }
    item('SF10', 'Ordinary levels open front-on (yaw on a face, pitch 0.12) through frame.js\'s own opening', fr.every(f => f.off < 0.02 && f.pitch === 0.12 && !f.kept), JSON.stringify(fr));
    for (const [i, id, what] of [[INFO.hard, 'SF11', 'hard'], [INFO.boss, 'SF12', 'boss']]) {
      const o = await cam(i, SA); await shot(o.p, 'sf-cam-' + what + '-L' + (i + 1));
      const lot = await o.p.evaluate(() => { const fs = window.__blast.frame.state(), g = window.__blast.sflay.geo(); return { fs, top: g.top, bot: g.bot }; });
      const d = await o.p.evaluate(() => Object.assign({}, window.__blast.sflay.frameDefault));
      item(id, (what === 'hard' ? 'Hard level' : 'Boss level') + ' L' + (i + 1) + ': opening keeps main\'s frame config (no front-on override' + (what === 'hard' ? '; frame.js F4 whole lot, fit <= 0.9 of the play height and inside 16 px sides)' : ')'),
        o.log && o.log.kept && o.cf.pitch === d.pitch && o.cf.yawMin === d.yawMin && o.cf.fillW === d.fillW && (what !== 'hard' || (o.fr && o.fr.hard && o.fr.fitH <= 0.905 && o.fr.fitW <= 1)), JSON.stringify({ log: o.log, fr: o.fr, cf: o.cf }));
      await close(o.p);
    }
  }
  // ================= SF13 the "Skip ahead" pill in the collapse: centred above BLAST, off the corner buttons, >= 48 px
  if (want('ff')) {
    const p = await open('', seed({ level: INFO.plain }));
    await playIn(p); await openDone(p);
    const m = await p.evaluate(() => window.__blast.members().filter(m => m.onScreen && m.pickable).slice(0, 3));
    for (const q of m) { await p.touchscreen.tap(q.sx, q.sy); await p.waitForTimeout(350); }
    await tap(p, '#blast');
    // the pill shows when the player taps the field during the collapse (engine: a tap in boom / settle = fast forward)
    await p.waitForFunction(() => { const ph = window.__blast.state().phase; return ph === 'boom' || ph === 'settle'; }, null, { timeout: 180000, polling: 100 }).catch(() => {});
    await p.touchscreen.tap(196, 330); await p.waitForTimeout(250);
    const seen = await p.evaluate(() => { const e = document.getElementById('ff'); return !!(e && !e.classList.contains('hidden') && e.getBoundingClientRect().width); });
    const r = await SF(p); await shot(p, 'sf-skip-ahead');
    const bad = ['blast', 'wreck', 'net', 'sky', 'tnt', 'gear'].filter(k => ovl(r.ff, r[k]));
    item('SF13', 'The R21 "Skip ahead" pill shows in the collapse above BLAST, centred, >= 48 px tall, on no corner button', seen && r.ff && r.ff.h >= 48 && !bad.length && Math.abs(r.ff.x + r.ff.w / 2 - 393 / 2) <= 30 && (!r.blast || r.ff.b <= r.blast.y), JSON.stringify({ ff: r.ff, blast: r.blast, bad }));
    await close(p);
  }
  // ================= SF14 the pre-level booster sheet (boss, first try): it shows over the layout; the picked booster is armed on its corner button
  if (want('pre')) {
    const p = await open('', seed({ level: INFO.boss, bst: { wreck: 2 } }));
    const sh = await playIn(p, true); await p.waitForTimeout(600); await shot(p, 'sf-pre-sheet');
    let picked = false, onBtn = null;
    if (sh) { const t = await p.evaluate(() => { const b = [...document.querySelectorAll('#bPick .bpt')].find(x => /wreck|ball/i.test((x.dataset.k || '') + ' ' + (x.textContent || '')) && !x.disabled); if (!b) return null; const q = b.getBoundingClientRect(); return { x: q.left + q.width / 2, y: q.top + q.height / 2 }; });
      if (t) { await p.touchscreen.tap(t.x, t.y); await p.waitForTimeout(500); picked = true; }
      await tap(p, '#bpPlay'); await plan(p); await openDone(p); await p.waitForTimeout(1200);
      onBtn = await p.evaluate(() => { const b = document.querySelector('#bbar .bst[data-k="wreck"]'), q = b ? b.getBoundingClientRect() : null; const hd = ['hand', 'inHand', 'preHand'].map(id => document.getElementById(id)).filter(e => e && !e.classList.contains('hidden') && e.getBoundingClientRect().width).map(e => { const r = e.getBoundingClientRect(); return { id: e.id, x: r.left, y: r.top, w: r.width, h: r.height }; });
        return { btn: q ? { x: q.left, y: q.top, w: q.width, h: q.height } : null, on: !!(b && b.classList.contains('on')), hands: hd }; }); }
    await shot(p, 'sf-pre-after');
    const near = onBtn && onBtn.hands.filter(h => h.id === 'hand').every(h => onBtn.btn && Math.abs(h.x + h.w / 2 - (onBtn.btn.x + onBtn.btn.w / 2)) < 60 && Math.abs(h.y - onBtn.btn.y) < 120);
    item('SF14', 'Boss first try: the pre-level booster sheet shows; the Ball picked there is live on its bottom-left button after Play (any teach hand points at that button)', sh && picked && onBtn && onBtn.btn && onBtn.btn.x < 100 && near, JSON.stringify({ sheet: sh, picked, onBtn }));
    await close(p);
  }
  // ================= SF15 ?sflay=0 = the old layout
  if (want('off')) {
    const p = await open('&sflay=0', seed({ level: INFO.plain }));
    await playIn(p);
    const o = await p.evaluate(() => ({ cls: document.documentElement.classList.contains('sfl'), on: window.__blast.sflay.on(), css: !!document.getElementById('sflayCss'), lk: document.querySelectorAll('.sfLk').length }));
    await shot(p, 'sf-off');
    item('SF15', '?sflay=0: none of the layer runs (no class, no style, no catchers)', !o.cls && !o.on && !o.css && !o.lk, JSON.stringify(o));
    await close(p);
  }
  await browser.close();
  const bad = R.filter(r => !r.ok);
  fs.writeFileSync(path.join(SHOTS, 'check-sflay.json'), JSON.stringify({ file: FILE, results: R, errors: errs }, null, 1));
  console.log('\nSFLAY: ' + (R.length - bad.length) + ' PASS, ' + bad.length + ' FAIL, page errors ' + errs.length + (errs.length ? ': ' + errs.slice(0, 3).join(' | ') : ''));
  process.exit(bad.length || errs.length ? 1 : 0);
})().catch(e => { console.error(e); try { browser && browser.close(); } catch (x) {} process.exit(1); });
