#!/usr/bin/env node
/* POLISH2 audit (D-blast-POLISH2, 28/11): per slot the opening (front) shot, the 45-degree shot, the pad check (frame.js padOut) and the
 * building inventory (per building id: footprint box, top height, members, protected / hero).
 *   env SCALE=2 (device scale), Q='&polish2=0' (extra query: the build without the POLISH2 dress)
 *   NODE_PATH=/opt/node22/lib/node_modules BLAST_LIBS=<libs> flock /dev/shm/chrome.lock node audit.js <game.html> <slots csv|all> <outdir> [tag] */
'use strict';
const path = require('path'), fs = require('fs');
const { chromium } = require('playwright');
const [FILEa, SLOTSa, OUTD, TAG] = process.argv.slice(2);
const FILE = path.resolve(FILEa), LIBS = process.env.BLAST_LIBS;
const THREE = path.join(LIBS, 'three.min.js'), RAPIER = path.join(LIBS, 'rapier3d-compat-0.19.3/rapier.mjs');
const K = 'blastRush.save.v2', tag = TAG || 'a';
const html = fs.readFileSync(FILE, 'utf8');
const SIG = (() => { const m = html.match(/SLOTS = (\[[-0-9,]+\])/); return m ? 's:' + m[1].slice(1, -1) : null; })();
const ALL = ['tnt', 'timber', 'dbltap', 't2l1', 't2l2', 'blast', 'brick', 'concrete', 'keep', 'rotate', 'steel', 'wreck', 'steps', 'rc', 'net', 'glass', 'sky', 'barrels', 'trap'];
const done = () => { const o = {}; ALL.forEach(k => { o[k] = { c: 1, f: 1 }; }); return o; };
const seed = (lv) => `(()=>{try{if(!sessionStorage.getItem('cmSeed')){sessionStorage.setItem('cmSeed','1');${SIG ? `localStorage.setItem('${K}.lv7o','${SIG}');` : ''}localStorage.setItem('${K}',${JSON.stringify(JSON.stringify({ cv: 6, level: lv, coins: 0, upg: { power: 0, charge: 0, magnet: 0, slowmo: 0 }, best: {}, mute: true, music: false, tutv: 2, intro: done(), zh: 1, bseen: { wreck: 2, net: 2, sky: 2 }, hseen: 1 }))});}}catch(e){}})()`;
const rect = (p, sel) => p.evaluate((s) => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(), cs = getComputedStyle(e); return r.width > 0 && cs.display !== 'none' && cs.visibility !== 'hidden' ? { x: r.left, y: r.top, w: r.width, h: r.height } : null; }, sel);
const tap = async (p, sel) => { const b = await rect(p, sel); if (!b) throw new Error('nothing to tap: ' + sel); await p.touchscreen.tap(b.x + b.w / 2, b.y + b.h / 2); await p.waitForTimeout(400); };
(async () => {
  fs.mkdirSync(OUTD, { recursive: true });
  const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
  const NS = 56;
  const slots = SLOTSa === 'all' ? Array.from({ length: NS }, (_, i) => i + 1) : SLOTSa.split(',').map(Number);
  const res = [], errs = [];
  for (const s of slots) {
    const ctx = await browser.newContext({ viewport: { width: 393, height: 852 }, hasTouch: true, isMobile: true, deviceScaleFactor: +(process.env.SCALE || 1) });
    const p = await ctx.newPage();
    p.on('pageerror', e => errs.push('L' + s + ' pageerror: ' + e.message.slice(0, 200)));
    await p.route(/fonts\.(googleapis|gstatic)\.com/, r => r.fulfill({ status: 200, body: '', contentType: 'text/css' }));
    await p.route(/cdnjs\.cloudflare\.com/, r => r.fulfill({ body: fs.readFileSync(THREE), contentType: 'application/javascript' }));
    await p.route(/rapier\.mjs/, r => r.fulfill({ body: fs.readFileSync(RAPIER), contentType: 'application/javascript', headers: { 'Access-Control-Allow-Origin': '*' } }));
    await p.addInitScript(seed(s - 1));
    try {
      await p.goto('file://' + FILE + '?x=1&sa=59,0,34,0' + (process.env.Q || ''));
      await p.waitForFunction(() => window.__blast && window.__blast.state, null, { timeout: 120000 }); await p.waitForTimeout(800);
      await p.waitForFunction(() => !document.getElementById('hmStudio'), null, { timeout: 15000 }).catch(() => {});
      await tap(p, '#play'); await p.waitForTimeout(1200);
      for (let k = 0; k < 8; k++) { const st = await p.evaluate(() => window.__blast.state()); if (st.screen === 'game') break; if (await rect(p, '#bpPlay')) { await tap(p, '#bpPlay'); continue; } await p.waitForTimeout(800); }
      await p.waitForFunction(() => window.__blast.state().screen === 'game', null, { timeout: 60000 });
      // front shot: when the opening zoom is over (the 45-degree turn starts after it)
      await p.waitForFunction(() => { const S = window.__blast.frame.state(); return S && !S.easing; }, null, { timeout: 60000, polling: 50 }).catch(() => {});
      await p.screenshot({ path: path.join(OUTD, 'L' + String(s).padStart(2, '0') + '-' + tag + '-front.jpg'), type: 'jpeg', quality: 80 });
      // 45-degree shot: the yaw has stopped moving
      let last = null, same = 0;
      for (let k = 0; k < 60 && same < 4; k++) { await p.waitForTimeout(500); const y = await p.evaluate(() => { const S = window.__blast.frame.state(); return S ? S.yawD : 0; }); if (last != null && Math.abs(y - last) < 0.002) same++; else same = 0; last = y; }
      await p.waitForTimeout(600);
      await p.screenshot({ path: path.join(OUTD, 'L' + String(s).padStart(2, '0') + '-' + tag + '-45.jpg'), type: 'jpeg', quality: 80 });
      const r = await p.evaluate(() => { const B = window.__blast, F = B.frame, st = B.state(), S = F.state(), O = window.LV7O, i = st.level - 1, T = B.test.level();
        const info = B.lv7.info(), by = {};
        info.forEach(b => { if (b.an) return; const id = b.bid || (b.kp ? 'keep' : '?'); const e = by[id] = by[id] || { id, n: 0, x0: 1e9, x1: -1e9, z0: 1e9, z1: -1e9, top: 0, keep: 0, keys: {}, mass: 0 };
          e.n++; e.x0 = Math.min(e.x0, b.sx - b.hx); e.x1 = Math.max(e.x1, b.sx + b.hx); e.z0 = Math.min(e.z0, b.sz - b.hz); e.z1 = Math.max(e.z1, b.sz + b.hz); e.top = Math.max(e.top, b.sy + b.h); if (b.kp) e.keep++; e.keys[b.key] = (e.keys[b.key] || 0) + 1; e.mass += b.m; });
        const bl = Object.values(by).map(e => ({ id: e.id, n: e.n, box: [+e.x0.toFixed(1), +e.x1.toFixed(1), +e.z0.toFixed(1), +e.z1.toFixed(1)], top: +e.top.toFixed(1), keep: e.keep > 0, keys: e.keys, mass: Math.round(e.mass) }));
        return { slot: st.level, name: st.name, kind: O && O.isH(i) ? 'H' : O && O.isE(i) ? 'E' : O && O.isO(i) ? 'O' : S && S.boss ? 'boss' : 'old', tier: T.tier || null, bp: T.bp || null, tnt: st.total, lvYaw: +(st.yaw * 180 / Math.PI).toFixed(1),
          parts: (T.parts || []).map(q => ({ part: q.part || q.t || q.type, id: q.id, x: q.x, z: q.z, rot: q.rot || q.ry || 0, keep: q.keep })), pad: F.pad(), out: F.padOut(), bodies: info.filter(b => !b.an).length, buildings: bl, calls: B.style().calls, tris: B.style().tris, p2: B.polish2 || null, kd: (window.__blastPerf && window.__blastPerf.flick) ? window.__blastPerf.flick.cp : null }; });
      res.push(r);
      console.log((r.out.n ? 'OUT ' : 'ok  ') + 'L' + r.slot + ' ' + r.name + ' [' + r.kind + ' ' + r.tier + ' ' + r.bp + '] tnt ' + r.tnt + ' bodies ' + r.bodies + (r.p2 ? ' p2 ' + r.p2.pieces + ' pcs rmax ' + r.p2.rmax + (r.p2.err ? ' ERR ' + r.p2.err : '') : '') + ' pad r ' + r.pad.rMin + '-' + r.pad.rMax + ' | ' + r.buildings.map(b => b.id + (b.keep ? '(blue)' : '') + ' ' + b.top + 'm x' + b.box[0] + '..' + b.box[1] + ' z' + b.box[2] + '..' + b.box[3] + ' n' + b.n).join(' ; ') + (r.out.n ? ' | OUT ' + r.out.out.map(o => (o.bid || o.i) + ' +' + o.over).join(',') : ''));
    } catch (e) { console.log('ERR L' + s + ' ' + e.message.slice(0, 160)); res.push({ slot: s, err: e.message.slice(0, 160) }); }
    await ctx.close();
  }
  await browser.close();
  console.log('page errors ' + errs.length + (errs.length ? ' ' + errs.slice(0, 3).join(' | ') : ''));
  fs.writeFileSync(path.join(OUTD, 'audit-' + tag + '.json'), JSON.stringify({ file: FILE, res, errs }, null, 1));
})();
