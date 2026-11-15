#!/usr/bin/env node
/* City Blast! MAIN build step "shop" (last step, after prelevel): appends main/shop.js at the end of main() so it wraps the final
 * showResult / goHome / bstPlay / startLevel / rescue / renderShop / homeLabels / clearSave / show (tap2 + prelevel + ui2 versions).
 * Same rules as main/prelevel-patch.js: one text anchor, found exactly once, else exit 1 and nothing written; a marker so it cannot
 * apply twice. The Figma assets (design/shop/assets/*.svg: coin piles S/M/L/XL, coin, check, clock) go in as data URIs.
 *   node main/shop-patch.js <in.html> <out.html>
 *   env SHOP_IAP_READY=1   real-money UI on (ONLY once Owner has the App Store Connect products + RevenueCat in the native build)
 *   env SHOP_ADS_READY=1   ad provider on (ONLY once an ad SDK + accounts exist)
 * Never writes games/blast/index.html. What it does and why: games/blast/design/shop/SPEC.md "Implemented". ?shop2=0 = old screens. */
'use strict';
const fs = require('fs'), path = require('path');
const [IN, OUT] = process.argv.slice(2);
if (!IN || !OUT) { console.error('usage: node main/shop-patch.js <in.html> <out.html>'); process.exit(2); }
if (path.resolve(OUT) === path.resolve(__dirname, '..', 'index.html')) { console.error('refusing to write games/blast/index.html'); process.exit(2); }
const src = fs.readFileSync(IN, 'utf8'), MARK = '<!-- main/shop.js -->', A = '\n} // main\n';
if (src.includes(MARK)) { console.error('already patched (shop): ' + IN); process.exit(1); }
const n = src.split(A).length - 1;
if (n !== 1) { console.error((n ? 'DUPLICATE (' + n + ')' : 'MISSING') + ' anchor "} // main"'); process.exit(1); }
for (const need of ['function renderShop(){', 'function buy(id){', 'var UPG = [', 'function coinMul(){', 'function showResult(){', 'function goHome(){', 'function rescue(){', 'function canRescue(r){', 'function rescueGap(r){',
  'var RESCUE_COST = 150', 'function bstPlay(i){', 'function bstIcon(k, v){', 'function homeLabels(){', 'function clearSave(){', 'function affordable(){', 'bstFailN = {}', 'id="toStore"', 'id="ulNoAds"', 'id="setReset"', 'id="rNext"',
  'window.__blast.tap2 = {', 'var want = r.ok ? (api.payout ? api.payout(', 'window.__blast.pre = {'])
  if (!src.includes(need)) { console.error('MISSING engine / UI text: ' + need); process.exit(1); }
const t = src.indexOf('<title>'); if (t < 0) { console.error('no <title>'); process.exit(1); }
const AS = path.join(__dirname, '..', 'design', 'shop', 'assets');
const uri = (k) => 'data:image/svg+xml;base64,' + fs.readFileSync(path.join(AS, k + '.svg')).toString('base64');
let body = fs.readFileSync(path.join(__dirname, 'shop.js'), 'utf8').replace(/\s+$/, '').replace(/"SHOP:([a-z-]+)"/g, (m, k) => '"' + uri(k) + '"');
if (/SHOP:[a-z]/.test(body)) { console.error('asset token left'); process.exit(1); }
const flip = (name, env) => { const a = 'var ' + name + ' = false;'; if (!body.includes(a)) { console.error('MISSING ' + a); process.exit(1); } if (process.env[env] === '1') body = body.replace(a, 'var ' + name + ' = true; '); };
flip('IAP_READY', 'SHOP_IAP_READY'); flip('ADS_READY', 'SHOP_ADS_READY');
let out = src.replace(A, () => '\n' + body + A);
out = out.slice(0, t) + MARK + out.slice(t);
fs.writeFileSync(OUT, out);
console.log('ok   S1 Shop · S2 Upgrades curve + Coin Bonus + Booster Pocket · S3 No Ads · S4 ads facade · S5 Fail Offer · S6 Restore' +
  (process.env.SHOP_IAP_READY === '1' ? ' [IAP_READY]' : ' [IAP hidden]') + (process.env.SHOP_ADS_READY === '1' ? ' [ADS_READY]' : '') + '  -> ' + path.basename(OUT));
