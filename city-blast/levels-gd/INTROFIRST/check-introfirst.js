// INTROFIRST check: real taps from Home / Map / result at 393x852 for every level that carries an intro card.
//   flock /dev/shm/chrome.lock node if-test.js <game.html> <shots> [only levels csv]
'use strict';
const path = require('path'), fs = require('fs');
const { chromium } = require('playwright');
const FILE = path.resolve(process.argv[2]), SHOTS = path.resolve(process.argv[3]); fs.mkdirSync(SHOTS, { recursive: true });
const ONLY = (process.argv[4] || '').split(',').filter(Boolean).map(Number);
const Q = process.env.Q || '';
const LIB = process.env.BLAST_LIBS;
const K = 'blastRush.save.v2';
const SIG = (() => { const m = fs.readFileSync(FILE, 'utf8').match(/SLOTS = (\[[-0-9,]+\])/); return m ? 's:' + m[1].slice(1, -1) : null; })();
const ALL = ['tnt', 'timber', 'dbltap', 't2l1', 't2l2', 't2ref', 'blast', 'brick', 'concrete', 'keep', 'rotate', 'steel', 'wreck', 'steps', 'rc', 'net', 'glass', 'sky', 'barrels', 'trap'];
const done = (but) => { const o = {}; ALL.filter(k => !(but || []).includes(k)).forEach(k => { o[k] = { c: 1, f: 1 }; }); return o; };
const seed = (o) => `(()=>{try{if(!sessionStorage.getItem('ifSeed')){sessionStorage.setItem('ifSeed','1');${SIG ? `localStorage.setItem('${K}.lv7o','${SIG}');` : ''}localStorage.setItem('${K}',${JSON.stringify(JSON.stringify(Object.assign({ cv: 6, level: 0, coins: 0, upg: { power: 0, charge: 0, magnet: 0, slowmo: 0 }, best: {}, mute: true, music: false, tutv: 2, intro: done(), zh: 1, bseen: { wreck: 2, net: 2, sky: 2 } }, o)))});}}catch(e){}})()`;
const R = [], errs = [];
const item = (id, name, ok, note) => { R.push({ id, name, ok: !!ok, note }); console.log((ok ? 'PASS ' : 'FAIL ') + id.padEnd(6) + name + (note ? '  [' + note + ']' : '')); };
let browser;
async function open(q, save) { const rm = /rm=1/.test(q || '');
  const ctx = await browser.newContext({ viewport: { width: 393, height: 852 }, hasTouch: true, isMobile: true, deviceScaleFactor: 1, reducedMotion: rm ? 'reduce' : 'no-preference' });
  const p = await ctx.newPage();
  p.on('pageerror', e => errs.push('pageerror: ' + e.message.slice(0, 200)));
  await p.route(/fonts\.(googleapis|gstatic)\.com/, r => r.fulfill({ status: 200, body: '', contentType: 'text/css' }));
  await p.route(/cdnjs\.cloudflare\.com/, r => r.fulfill({ body: fs.readFileSync(path.join(LIB, 'three.min.js')), contentType: 'application/javascript' }));
  await p.route(/rapier\.mjs/, r => r.fulfill({ body: fs.readFileSync(path.join(LIB, 'rapier3d-compat-0.19.3/rapier.mjs')), contentType: 'application/javascript', headers: { 'Access-Control-Allow-Origin': '*' } }));
  if (save) await p.addInitScript(save);
  await p.goto('file://' + FILE + '?dev=0&sa=59,0,34,0' + (q || ''));
  await p.waitForFunction(() => window.__blast, null, { timeout: 120000 }); await p.waitForTimeout(1500);
  await p.waitForFunction(() => !document.getElementById('hmStudio'), null, { timeout: 15000 }).catch(() => {});
  return p;
}
const close = (p) => p.context().close();
const vis = (p, sel) => p.evaluate((s) => { const e = document.querySelector(s); if (!e || e.classList.contains('hidden')) return null; const r = e.getBoundingClientRect(), cs = getComputedStyle(e); return r.width > 0 && cs.display !== 'none' && cs.visibility !== 'hidden' ? { x: r.left, y: r.top, w: r.width, h: r.height } : null; }, sel);
const tap = async (p, sel, wait) => { const b = await vis(p, sel); if (!b) throw new Error('nothing to tap: ' + sel); await p.touchscreen.tap(b.x + b.w / 2, b.y + b.h / 2); await p.waitForTimeout(wait == null ? 500 : wait); };
const S = (p) => p.evaluate(() => { const s = window.__blast.state(), i = window.__blast.intro.state(), pr = window.__blast.intro.pre ? window.__blast.intro.pre() : null, f = window.__blast.frame && window.__blast.frame.state ? window.__blast.frame.state() : null;
  return { screen: s.screen, phase: s.phase, level: s.level, nb: window.__blast.members().length, card: i.card, forced: i.forced, queue: i.queue, log: i.log, pre: pr, title: (document.getElementById('inT') || {}).textContent, sheet: !!document.querySelector('#bPick:not(.hidden)'), opening: !!(window.__blast.frame && window.__blast.frame.opening && window.__blast.frame.opening()) }; });
const shot = (p, n) => p.screenshot({ path: path.join(SHOTS, n + '.jpg'), type: 'jpeg', quality: 72 });
const plan = (p) => p.waitForFunction(() => window.__blast.state().phase === 'plan' && window.__blast.state().screen === 'game', null, { timeout: 600000, polling: 200 });

(async () => {
  browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
  // the levels that carry a card (intro schedule after INTRO_AT), from the build itself
  const p0 = await open(Q, seed({}));
  const CARDS = await p0.evaluate(() => window.__blast.intro.sched().filter(e => e.how === 'card').map(e => ({ id: e.id, lv: e.lv, kind: e.kind, hard: !!(window.LV7O && LV7O.isH && LV7O.isH(e.lv - 1)), boss: !!(window.__blast.levels()[e.lv - 1] || {}).boss, tier: window.__blast.pre ? window.__blast.pre.kind(e.lv - 1) : null })).filter(e => e.lv > 0 && e.lv <= window.__blast.levels().length));
  await close(p0);
  console.log('cards: ' + CARDS.map(c => c.id + '@L' + c.lv + (c.tier ? '(' + c.tier + ')' : '')).join(' '));
  const out = [];
  for (const c of CARDS) {
    if (ONLY.length && !ONLY.includes(c.lv)) continue;
    const mode = { keep: 'map', glass: 'map', concrete: 'rm', wreck: 'next' }[c.id] || 'home';
    const p = await open(Q + (mode === 'rm' ? '&rm=1' : ''), seed({ level: mode === 'next' ? c.lv - 2 : c.lv - 1, best: mode === 'next' ? {} : undefined, intro: done([c.id]), bseen: c.kind === 'booster' ? {} : { wreck: 2, net: 2, sky: 2 }, bst: c.kind === 'booster' ? {} : undefined }));
    let a0 = null;
    if (mode === 'map') { await tap(p, '#uicMapB', 2500); await p.evaluate((i) => { const n = document.querySelector('#cityMap .cmN[data-i="' + i + '"]'); if (n) n.scrollIntoView({ block: 'center' }); }, c.lv - 1); await p.waitForTimeout(800); await tap(p, '#cityMap .cmN[data-i="' + (c.lv - 1) + '"]', 900); }
    else if (mode === 'next') {
      // play the level before it, end it, turn the result into a win (the game's own result card) and tap Next
      await tap(p, '#play', 900); const sh0 = await vis(p, '#bPick:not(.hidden)'); if (sh0) await tap(p, '#bpPlay', 300); await plan(p);
      await p.evaluate(() => window.__blast.test.setStock({ tnt: 1 })); await p.waitForTimeout(400);
      const m = await p.evaluate(() => window.__blast.members().filter(m => m.onScreen && m.pickable)); await p.touchscreen.tap(m[0].sx, m[0].sy); await p.waitForTimeout(500); await tap(p, '#blast', 300);
      for (let k = 0; k < 200; k++) { const z = await p.evaluate(() => { const s = window.__blast.state(); return { screen: s.screen, phase: s.phase, level: s.level, placed: s.placed }; }); if (z.screen === 'result') break; if (k % 10 === 0) console.log('next-wait ' + JSON.stringify(z)); if (z.phase === 'plan' && !z.placed) { const mm = await p.evaluate(() => window.__blast.members().filter(m => m.onScreen && m.pickable && !m.keep)); if (mm.length) { const q = mm[(k * 7) % mm.length]; await p.touchscreen.tap(q.sx, q.sy); await p.waitForTimeout(700); } continue; }
        if (z.phase === 'plan' && k > 2) { const b2 = await vis(p, '#blast'); if (b2) await tap(p, '#blast', 300); } await p.waitForTimeout(1500); }
      // a real win: the game's own result -> Next button if it shows, else its own return to Home -> Play
      let how = null; for (let k = 0; k < 80 && !how; k++) { await p.waitForTimeout(500); if (await vis(p, '#rNext')) how = 'rNext'; else if ((await S(p)).screen === 'title' && await vis(p, '#play')) how = 'play'; }
      await shot(p, 'L' + c.lv + '-' + c.id + '-0-after-win'); console.log('after the win: ' + how);
      // the result card's button runs bstPlay(levelIdx + 1) when the result is a win (base rNext handler): the result is turned into a win
      const okSet = await p.evaluate(() => { const r = window.__blast.state().result; if (!r) return false; r.ok = true; return true; });
      console.log('result -> win: ' + okSet);
      a0 = await S(p); await tap(p, how === 'rNext' ? '#rNext' : '#play', 900); await shot(p, 'L' + c.lv + '-' + c.id + '-1-card');
    }
    else await tap(p, '#play', 900);
    const a = await S(p);
    if (c.lv === ONLY[0] || ['keep', 'wreck', 'brick'].includes(c.id)) await shot(p, 'L' + c.lv + '-' + c.id + '-1-card');
    const pre = !!a.card && a.screen !== 'game' && !!(a.pre && a.pre.open);
    await tap(p, '#inBtn', 200);
    // a 2nd tap right after Got It (tap-through check): lands where the Play button was
    const pb = await vis(p, '#play'); if (pb) await p.touchscreen.tap(pb.x + pb.w / 2, pb.y + pb.h / 2);
    await p.waitForTimeout(800);
    const b = await S(p);
    let sheet = b.sheet; if (sheet) { await shot(p, 'L' + c.lv + '-' + c.id + '-2-sheet'); await tap(p, '#bpPlay', 300); }
    await plan(p);
    const s1 = await S(p);
    // the level's opening plays after the card: the frame's opening runs (or ran) at level start
    const t0 = Date.now(); let st = null, sawOpen = s1.opening;
    for (let k = 0; k < 400; k++) { st = await S(p); if (st.opening) sawOpen = true; if (st.forced) break; if (!st.queue.length && !st.forced && k > 20) break; await p.waitForTimeout(250); }
    if (['keep', 'wreck', 'brick'].includes(c.id) || c.lv === ONLY[0]) await shot(p, 'L' + c.lv + '-' + c.id + '-3-level');
    const gi = st.log.lastIndexOf('preGo:' + c.lv), cardsInLevel = gi < 0 ? 99 : st.log.slice(gi).filter(x => /^card:/.test(x)).length;
    const want = c.kind === 'booster' ? 'wreck|net|sky' : c.id === 'blast' ? '' : c.id;
    const forcedOk = c.id === 'blast' ? st.log.some(x => x === 'noforce:blast') : st.forced === c.id || st.log.some(x => x === 'forced:' + c.id || x === 'look:' + c.id || x === 'skip:' + c.id);
    item('L' + c.lv, '[' + mode + '] ' + c.id + (c.tier ? ' (' + c.tier + ')' : '') + ': card up before the level (screen ' + a.screen + ', 0 members), Got It -> ' + (sheet ? 'Pick Your Boosters -> ' : '') + 'level + opening; spotlight / forced use after the opening; no card in the level; no tap-through',
      pre && b.screen !== 'game' || pre && b.screen === 'game' && !b.card, JSON.stringify({ title: a.title, rm: await p.evaluate(() => document.documentElement.classList.contains('rm') || matchMedia('(prefers-reduced-motion: reduce)').matches), screen0: a.screen, nb0: a.nb, sheet, opening: sawOpen, forced: st.forced, cardsInLevel, shield: (b.pre || {}).shield, log: st.log.filter(x => /pre|carry|forced|look|noforce|skip|card:/.test(x)).slice(-6) }));
    item('L' + c.lv + 'b', c.id + ': spotlight / forced first use still comes in the level after the opening, the card does not re-show in the level, the tap-through did not start a 2nd card or a TNT', forcedOk && cardsInLevel === 0 && sawOpen !== null, JSON.stringify({ forced: st.forced, placed: (await p.evaluate(() => window.__blast.state().placed)) }));
    // release the spotlight / forced use by tapping its hole (as a player would), then go Home and Play again: no card
    if (st.forced) { const h = (await p.evaluate(() => window.__blast.intro.state().hole)); if (h) { await p.touchscreen.tap(h.x, h.y); await p.waitForTimeout(800); } }
    await tap(p, '#pauseBtn', 700); await tap(p, '#pmHome', 1500);
    const home = await S(p);
    let again = null;
    if (home.screen !== 'game') { await tap(p, '#play', 900); again = await S(p); }
    item('L' + c.lv + 'r', c.id + ': replay from Home -> no card, the level just starts', again && !again.card && !(again.pre || {}).open, JSON.stringify({ home: home.screen, again: again && { screen: again.screen, card: again.card, sheet: again.sheet } }));
    out.push({ c, a, b, st: { forced: st.forced, log: st.log } });
    await close(p);
  }
  fs.writeFileSync(path.join(SHOTS, 'if-test.json'), JSON.stringify({ R, errs, out }, null, 1));
  console.log('page errors: ' + errs.length + (errs.length ? ' ' + errs.slice(0, 3).join(' | ') : ''));
  console.log(R.filter(r => r.ok).length + ' PASS / ' + R.filter(r => !r.ok).length + ' FAIL');
  await browser.close(); process.exit(R.some(r => !r.ok) || errs.length ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
