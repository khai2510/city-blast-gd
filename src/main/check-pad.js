#!/usr/bin/env node
/* City Blast! pad check (frame.js F8, Khai D-blast-PAD 23/11): "every building (target, neighbours, blue protected) stands inside the
 * yellow sand pad". Per slot: the pad (centre, widening k, edge radius), the lot centre (pivot rule) and every building member whose
 * footprint (spawn pose, 4 corners) leaves the sand (edge = the lot shader's fade midpoint, with its wobble). Reports only: the level
 * agents move their buildings. Exit 0 always; prints "violations: N levels".
 *   NODE_PATH=/opt/node22/lib/node_modules BLAST_LIBS=/dev/shm/cb-rel-libs flock /dev/shm/chrome.lock node src/main/check-pad.js <game.html> <slots csv|all> <out.json> ["&padk=1.2"] */
'use strict';
const path = require('path'), fs = require('fs');
const { chromium } = require('playwright');
const [FILEa, SLOTSa, OUT, Q] = process.argv.slice(2);
const FILE = path.resolve(FILEa), LIBS = process.env.BLAST_LIBS || '/dev/shm/cb-rel-libs';
const THREE = path.join(LIBS, 'three.min.js'), RAPIER = path.join(LIBS, 'rapier3d-compat-0.19.3/rapier.mjs');
const K = 'blastRush.save.v2';
const SIG = (() => { const m = fs.readFileSync(FILE, 'utf8').match(/SLOTS = (\[[-0-9,]+\])/); return m ? 's:' + m[1].slice(1, -1) : null; })();
const ALL = ['tnt', 'timber', 'dbltap', 't2l1', 't2l2', 'blast', 'brick', 'concrete', 'keep', 'rotate', 'steel', 'wreck', 'steps', 'rc', 'net', 'glass', 'sky', 'barrels', 'trap'];
const done = () => { const o = {}; ALL.forEach(k => { o[k] = { c: 1, f: 1 }; }); return o; };
const seed = (lv) => `(()=>{try{if(!sessionStorage.getItem('cmSeed')){sessionStorage.setItem('cmSeed','1');${SIG ? `localStorage.setItem('${K}.lv7o','${SIG}');` : ''}localStorage.setItem('${K}',${JSON.stringify(JSON.stringify({ cv: 6, level: lv, coins: 0, upg: { power: 0, charge: 0, magnet: 0, slowmo: 0 }, best: {}, mute: true, music: false, tutv: 2, intro: done(), zh: 1, bseen: { wreck: 2, net: 2, sky: 2 }, hseen: 1 }))});}}catch(e){}})()`;
const rect = (p, sel) => p.evaluate((s) => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(), cs = getComputedStyle(e); return r.width > 0 && cs.display !== 'none' && cs.visibility !== 'hidden' ? { x: r.left, y: r.top, w: r.width, h: r.height } : null; }, sel);
const tap = async (p, sel) => { const b = await rect(p, sel); if (!b) throw new Error('nothing to tap: ' + sel); await p.touchscreen.tap(b.x + b.w / 2, b.y + b.h / 2); await p.waitForTimeout(400); };
(async () => {
  const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
  const slots = SLOTSa === 'all' ? Array.from({ length: 51 }, (_, i) => i + 1) : SLOTSa.split(',').map(Number);
  const res = [], errs = [];
  for (const s of slots) {
    const ctx = await browser.newContext({ viewport: { width: 393, height: 852 }, hasTouch: true, isMobile: true, deviceScaleFactor: 1 });
    const p = await ctx.newPage();
    p.on('pageerror', e => errs.push('L' + s + ' pageerror: ' + e.message.slice(0, 200)));
    await p.route(/fonts\.(googleapis|gstatic)\.com/, r => r.fulfill({ status: 200, body: '', contentType: 'text/css' }));
    await p.route(/cdnjs\.cloudflare\.com/, r => r.fulfill({ body: fs.readFileSync(THREE), contentType: 'application/javascript' }));
    await p.route(/rapier\.mjs/, r => r.fulfill({ body: fs.readFileSync(RAPIER), contentType: 'application/javascript', headers: { 'Access-Control-Allow-Origin': '*' } }));
    await p.addInitScript(seed(s - 1));
    try {
      await p.goto('file://' + FILE + '?x=1&sa=59,0,34,0' + (Q || ''));
      await p.waitForFunction(() => window.__blast && window.__blast.state, null, { timeout: 120000 }); await p.waitForTimeout(800);
      await p.waitForFunction(() => !document.getElementById('hmStudio'), null, { timeout: 15000 }).catch(() => {});
      await tap(p, '#play'); await p.waitForTimeout(1200);
      for (let k = 0; k < 8; k++) { const st = await p.evaluate(() => window.__blast.state()); if (st.screen === 'game') break; if (await rect(p, '#bpPlay')) { await tap(p, '#bpPlay'); continue; } await p.waitForTimeout(800); }
      await p.waitForFunction(() => window.__blast.state().screen === 'game', null, { timeout: 60000 });
      const r = await p.evaluate(() => { const B = window.__blast, F = B.frame, st = B.state(), S = F.state(), O = window.LV7O, i = st.level - 1;
        return { slot: st.level, name: st.name, kind: O && O.isH(i) ? 'H' : O && O.isE(i) ? 'E' : O && O.isO(i) ? 'O' : S && S.boss ? 'boss' : 'old', pad: F.pad(), piv: !!(S && S.piv), out: F.padOut() }; });
      res.push(r);
      console.log((r.out.n ? 'OUT ' : 'ok  ') + 'L' + r.slot + ' ' + r.name + ' [' + r.kind + '] pad k ' + r.pad.k + ' r ' + r.pad.rMin + '-' + r.pad.rMax + ' m, lot centre ' + JSON.stringify(r.out.lotCentre) + ', pivot ' + (r.piv ? 'pad 0,0' : 'own') + (r.out.n ? ' | ' + r.out.n + ' members out: ' + r.out.out.map(o => (o.bid || o.i) + (o.keep ? '(blue)' : '') + ' +' + o.over + 'm').join(', ') : ''));
    } catch (e) { console.log('ERR L' + s + ' ' + e.message.slice(0, 160)); res.push({ slot: s, err: e.message.slice(0, 160) }); }
    await ctx.close();
  }
  await browser.close();
  const bad = res.filter(r => r.out && r.out.n);
  console.log('violations: ' + bad.length + ' levels (' + bad.map(r => 'L' + r.slot).join(' ') + '); page errors ' + errs.length + (errs.length ? ' ' + errs.slice(0, 3).join(' | ') : ''));
  fs.writeFileSync(OUT, JSON.stringify({ file: FILE, q: Q || '', res, errs }, null, 1));
})();
