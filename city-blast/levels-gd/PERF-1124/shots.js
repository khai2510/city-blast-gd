#!/usr/bin/env node
/* PERF-1124: before / after shots of the look-changing options (planning view, phone viewport 393x852 @3x), JPEG q80.
 *   BLAST_LIBS=... NODE_PATH=/opt/node22/lib/node_modules flock /dev/shm/chrome.lock node shots.js <game.html> <slot> <out dir> (default: next to this file)
 * Variants: now (pr cap 2, MSAA, PCF 1024 shadow) / pr15 (?pr=1.5) / noshadow / shadow512 / noaa (a copy of the file with
 * antialias:false, so the FXAA fallback runs) / perf2off (?perf2=0: must look the same as "now"). */
'use strict';
const path = require('path'), fs = require('fs');
const { chromium } = require('playwright');
const LIB = process.env.BLAST_LIBS, [FILE, SLOT, OUT] = process.argv.slice(2);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const TOG = {
  noshadow: () => { const D = window.__blastPerf.meter.dev(); D.renderer.shadowMap.enabled = false; D.scene.traverse(o => { if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => m.needsUpdate = true); }); },
  shadow512: () => { const D = window.__blastPerf.meter.dev(); D.sun.shadow.mapSize.set(512, 512); if (D.sun.shadow.map) { D.sun.shadow.map.dispose(); D.sun.shadow.map = null; } }
};
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const noaa = path.join(path.dirname(path.resolve(FILE)), path.basename(FILE, '.html') + '-noaa.html');
  fs.writeFileSync(noaa, fs.readFileSync(FILE, 'utf8').replace('antialias:true, alpha:true', 'antialias:false, alpha:true'));
  const V = [['now', FILE, ''], ['perf2off', FILE, 'perf2=0'], ['pr15', FILE, 'pr=1.5'], ['noshadow', FILE, '', 'noshadow'], ['shadow512', FILE, '', 'shadow512'], ['noaa', noaa, '']];
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
  for (const [name, file, q, tog] of V) {
    const ctx = await b.newContext({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true }); const p = await ctx.newPage();
    await p.route(/fonts\.(googleapis|gstatic)\.com/, r => r.fulfill({ status: 200, body: '', contentType: 'text/css' }));
    await p.route(/cdnjs\.cloudflare\.com/, r => r.fulfill({ body: fs.readFileSync(path.join(LIB, 'three.min.js')), contentType: 'application/javascript' }));
    await p.route(/rapier\.mjs/, r => r.fulfill({ body: fs.readFileSync(path.join(LIB, 'rapier3d-compat-0.19.3/rapier.mjs')), contentType: 'application/javascript', headers: { 'Access-Control-Allow-Origin': '*' } }));
    await p.goto('file://' + path.resolve(file) + '?lv=' + SLOT + '&studio=0&intro=0&fps=0' + (q ? '&' + q : ''));
    await p.waitForFunction(() => window.__blast && window.__blast.state && window.__blast.state().screen === 'game' && window.__blast.state().phase === 'plan', null, { timeout: 120000 });
    await sleep(5000);
    if (tog) { await p.evaluate(() => window.__blastPerf.meter.on()); await p.evaluate(TOG[tog]); await p.evaluate(() => window.__blastPerf.meter.off()); await sleep(1500); }
    await p.screenshot({ path: path.join(OUT, 'L' + SLOT + '-' + name + '.jpg'), type: 'jpeg', quality: 80 });
    console.log('shot', name); await ctx.close();
  }
  fs.unlinkSync(noaa); await b.close();
})().catch(e => { console.error(e); process.exit(1); });
