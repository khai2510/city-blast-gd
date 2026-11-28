#!/usr/bin/env node
/* L1TWIN bots (manual stepping through the game's own test API: same rules, no frame loop).
 *   BLAST_LIBS=<libs> NODE_PATH=/opt/node22/lib/node_modules flock /dev/shm/chrome.lock node bots.js <game.html> [out.json]
 *   env ONLY=rest|det|naive|sens  REP=5
 * rest : slot 1 at rest for 8 s: bonds before / after, dead members, members that moved.
 * det  : the lesson plan REP times in one page + once after a reload: TNT on the hand's leg of mill A, blast, then TNT on the same
 *        leg of mill B, blast. The levels6 log hash, the % after each blast and mill B's bonds after mill A fell must be identical.
 * naive: after mill A fell, ONE TNT on each member of mill B in turn (the two faces the opening view shows): which ones win.
 * sens : after mill A fell, one TNT on each leg of mill B, each of its four faces: all must win. */
'use strict';
const path = require('path'), fs = require('fs');
const { chromium } = require('playwright');
const LIB = process.env.BLAST_LIBS, FILE = path.resolve(process.argv[2]), OUT = process.argv[3], ONLY = process.env.ONLY || '', REP = +(process.env.REP || 5);
const want = (k) => !ONLY || ONLY.split(',').includes(k);
(async () => {
  const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
  const open = async () => { const ctx = await browser.newContext({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 1 }); const p = await ctx.newPage(); p.errs = [];
    p.on('pageerror', e => p.errs.push(e.message));
    await p.route(/fonts\.(googleapis|gstatic)\.com/, r => r.fulfill({ status: 200, body: '', contentType: 'text/css' }));
    await p.route(/cdnjs\.cloudflare\.com/, r => r.fulfill({ body: fs.readFileSync(path.join(LIB, 'three.min.js')), contentType: 'application/javascript' }));
    await p.route(/rapier\.mjs/, r => r.fulfill({ body: fs.readFileSync(path.join(LIB, 'rapier3d-compat-0.19.3/rapier.mjs')), contentType: 'application/javascript', headers: { 'Access-Control-Allow-Origin': '*' } }));
    await p.goto('file://' + FILE + '?studio=0');
    await p.waitForFunction(() => window.__blast && window.__blast.test, null, { timeout: 90000 });
    await p.evaluate(() => {
      const B = window.__blast, T = B.test;
      const bonds = (f) => T.bodies().filter(b => !b.frag && f(b)).reduce((a, b) => a + b.bonds, 0);
      window.LT = {
        isA: (b) => b.x < b.z, isB: (b) => b.x > b.z,       // mill A sits at (-d, +d), mill B at (+d, -d)
        bonds,
        leg: (sel) => T.select(sel, 0)[0].i,
        hash: () => { const l = T.l6 ? T.l6().log : null, h = l && l.length ? l[l.length - 1] : null; return h ? h.h + ' ' + h.step + ' ' + h.pct : null; },
        blast: (i, nx, nz, dy) => { T.charge('tnt', i, nx, nz, dy || 0); T.fire(); const r = T.run(30); return { phase: r.phase, wave: r.wave, pct: +(r.pct * 100).toFixed(3), ok: r.verdict.ok, res: r.result ? !!r.result.ok : null }; },
        lessonA: () => { T.play(0, 1); return window.LT.blast(window.LT.leg('A:z+'), 0, 1); }
      };
    });
    return p; };
  const R = { file: FILE };
  let p = await open();
  if (want('rest')) {
    R.rest = await p.evaluate(() => { const T = window.__blast.test; T.play(0, 1); const b0 = LT.bonds(() => true), m0 = T.bodies().filter(b => !b.frag);
      T.step(480); const m1 = T.bodies().filter(b => !b.frag), b1 = LT.bonds(() => true);
      let moved = 0; m1.forEach((b, k) => { const a = m0[k]; if (a && Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z) > 0.05) moved++; });
      return { members: m0.length, membersAfter: m1.length, bonds0: b0, bonds1: b1, moved, pct: +(window.__blast.state().pct * 100).toFixed(2), blocksDead: T.blocks().filter(b => b.dead).length }; });
    console.log('rest', JSON.stringify(R.rest));
  }
  if (want('det')) {
    const one = () => p.evaluate(() => { const T = window.__blast.test; T.play(0, 1); const bB0 = LT.bonds(LT.isB), a = LT.blast(LT.leg('A:z+'), 0, 1), bB1 = LT.bonds(LT.isB), hA = LT.hash();
      const stock = window.__blast.state().stock; const b = LT.blast(LT.leg('B:z+'), 0, 1); return { a, bondsB: [bB0, bB1], hA, b, hB: LT.hash(), stockAfterA: stock }; });
    R.det = []; for (let k = 0; k < REP; k++) R.det.push(await one());
    await p.context().close(); p = await open(); R.det.push(await one());
    const sig = (r) => JSON.stringify(r); R.detSame = R.det.every(r => sig(r) === sig(R.det[0]));
    console.log('det', R.detSame ? 'IDENTICAL x' + R.det.length : 'DIFFERENT', JSON.stringify(R.det[0])); if (!R.detSame) R.det.forEach(r => console.log('   ', JSON.stringify(r)));
  }
  const afterA = async (list) => { const out = [];
    for (const c of list) out.push(Object.assign({}, c, await p.evaluate((c) => { LT.lessonA(); return LT.blast(c.i, c.nx, c.nz, c.dy); }, c)));
    return out; };
  const membersB = await p.evaluate(() => { window.__blast.test.play(0, 1); return window.__blast.test.blocks().map((b, i) => Object.assign({ i }, b)).filter(b => !b.dead && b.key !== 'base' && b.y > 0 && LT.isB(b)).map(b => ({ i: b.i, key: b.key, floor: b.floor, y: +b.y.toFixed(1) })); });
  if (want('sens')) {
    const legs = membersB.filter(m => m.key === 'wpost' && m.floor === 0), list = [];
    legs.forEach(m => [[0, 1], [0, -1], [1, 0], [-1, 0]].forEach(f => list.push({ i: m.i, nx: f[0], nz: f[1], dy: 0 })));
    R.sens = await afterA(list); R.sensWin = R.sens.filter(r => r.res === true || r.ok).length;
    console.log('sens', R.sensWin + '/' + R.sens.length, 'pct', Math.min(...R.sens.map(r => r.pct)), '..', Math.max(...R.sens.map(r => r.pct)));
  }
  if (want('naive')) {
    const list = []; membersB.forEach(m => [[0, 1], [1, 0]].forEach(f => list.push({ i: m.i, key: m.key, floor: m.floor, nx: f[0], nz: f[1], dy: 0 })));
    R.naive = await afterA(list);
    const win = R.naive.filter(r => r.ok), legW = win.filter(r => r.key === 'wpost' && r.floor === 0).length, legN = R.naive.filter(r => r.key === 'wpost' && r.floor === 0).length;
    R.naiveWin = win.length; R.naiveUpWin = win.length - legW; R.naiveUpN = R.naive.length - legN;
    console.log('naive (1 TNT on each member of mill B, 2 faces): wins ' + win.length + '/' + R.naive.length + '; legs ' + legW + '/' + legN + '; above the legs ' + R.naiveUpWin + '/' + R.naiveUpN);
    const by = {}; R.naive.forEach(r => { const k = r.key + ' f' + r.floor; (by[k] = by[k] || []).push(Math.round(r.pct)); }); console.log(JSON.stringify(by));
  }
  R.errs = p.errs; console.log('page errors', p.errs.length, p.errs.slice(0, 3));
  if (OUT) fs.writeFileSync(OUT, JSON.stringify(R, null, 1));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
