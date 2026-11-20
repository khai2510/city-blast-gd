// ---- main/shop.js (build step "shop", main/shop-patch.js; D-blast-SHOP, Owner 15/11/2026 "Tất cả các thiết kế đều ok rồi, để lên đi").
// Shop · Upgrades · No Ads, as designed in games/blast/design/shop/SPEC.md (Figma ZrGEsdJfokXjKgZrZroJ6y page 131:2).
// Appended at the end of main() after every other step, so it wraps the final showResult / goHome / bstPlay / renderShop.
//  S1 Shop screen (left tab): Starter Pack (from L10, 48 h after first view, once), No Ads, 5 coin packs, 3 booster bundles,
//     Restore Purchases, footnote. One price button per card; Pending / Owned / offline states; success card; error toast.
//  S2 Upgrades: one row per upgrade, "now -> next", the ~3,400-coin curve (Power / Slow-mo 40 x 1.4^l, Starting TNT 250 / 600,
//     Coin Bonus 50 / 70 / 100 / 140 / 195) + the new Booster Pocket (150 / 250 / 400: 1-3 free booster uses on each Hard / Boss
//     level, granted into the existing booster stock when the level is opened, so the existing pre-level offer spends them).
//     Coin Bonus (was "Coin Magnet") multiplies the D-blast-COIN win reward 10 / 20 / 30: +10 % a level, rounded up (max 15/30/45).
//  S3 No Ads: Home button from L15 (E8 slot; supersedes D-blast-ADOPT's hide for L15+), pop-up, Shop card; removes interstitials only.
//  S4 Ads (interface + stub): rewarded "+1 TNT Free" on the lose card (from L5, within 10 points of PASS, once per attempt, a free
//     rescue = the existing rescue() mechanics), rewarded "x2 coins" on the win (from L5; holds the auto return to Home), interstitial
//     after a WIN only, from L15, >= 2 levels and >= 90 s apart, never after a rewarded video / a purchase, never in the first
//     session, never before a Boss level, never for No Ads owners; auto No Ads pop-up after the 3rd interstitial of a day (once a day).
//  S5 Fail Offer $4.99 (+1 TNT now + 1,000 coins) on a Hard / Boss lose card: only when the rewarded button is not offered (used
//     or no ad), from the 2nd fail of that level, when one more TNT can still fix it (canRescue), max 3 shows a day.
//  S6 Restore Purchases in the Shop footer and in Settings.
// PURCHASES (group C: no account, no product, no key here). IAP_READY = false (build constant, main/shop-patch.js SHOP_IAP_READY=1
// flips it once Owner has the App Store Connect products + RevenueCat): every real-money element is HIDDEN (Shop tab = "coming
// soon" toast, no No Ads button / pop-up, no Fail Offer, no Restore), because App Review 2.1 rejects buttons that cannot complete a
// purchase and 3.1.1 wants prices from StoreKit only. Coin-priced Upgrades work fully. ?iapdev=1 = a simulated store (prices from
// the SPEC §3 US table, "Apple ID" = localStorage) for tests and reviews.
// ADS: no ad SDK is installed. ADS_READY = false: no provider in production, so the rewarded buttons are hidden and interstitials
// are a no-op (the rules still run and log). ?adsdev=1 = a stub provider that "plays" instantly.
// ?shop2=0 = the old screens (nothing here runs; tap2's payout hook stays unset = flat 10 / 20 / 30).
// Test hook: window.__blast.shop. Status: games/blast/design/shop/SPEC.md "Implemented".
try{ (function(){
if(QS.get("shop2") === "0") return;
var IAP_READY = false;    // SHOP_IAP_READY (main/shop-patch.js)
var ADS_READY = false;    // SHOP_ADS_READY (main/shop-patch.js)
var H = document.documentElement, IAPDEV = QS.get("iapdev") === "1", ADSDEV = QS.get("adsdev") === "1";
H.classList.add("sh2");
var A = { "pile-s":"SHOP:pile-s", "pile-m":"SHOP:pile-m", "pile-l":"SHOP:pile-l", "pile-xl":"SHOP:pile-xl", coin:"SHOP:coin", check:"SHOP:check", clock:"SHOP:clock" };
var PLAY_SVG = '<svg class="sh2Play" viewBox="0 0 32 24" aria-hidden="true"><rect x="1.5" y="1.5" width="29" height="21" rx="5" fill="#FFF8E1" stroke="#1E3A12" stroke-width="3"/><path d="M13 7.5v9l7.5-4.5z" fill="#1E3A12"/></svg>';
var LOG = [];
function lg(s){ LOG.push(s); if(LOG.length > 80) LOG.shift(); }
function fmt(n){ return String(Math.max(0, n|0)).replace(/\B(?=(\d{3})+(?!\d))/g, ","); }
function today(){ var d = new Date(); return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); }

// ---- save: save.shop (entitlements + counters) and save.upg.pocket; the base loader drops unknown fields: read them back here
(function(){ var s = null; try{ s = JSON.parse(localStorage.getItem(SAVE_KEY) || "null"); }catch(e){}
  if(s && s.shop && typeof s.shop === "object") save.shop = s.shop;
  if(s && s.upg && typeof s.upg.pocket === "number") save.upg.pocket = s.upg.pocket|0; })();
function sh(){ var o = save.shop; if(!o || typeof o !== "object") o = save.shop = {};
  ["txn", "pk", "ads", "fo"].forEach(function(k){ if(!o[k] || typeof o[k] !== "object") o[k] = {}; }); return o; }
if(typeof save.upg.pocket !== "number") save.upg.pocket = 0;
sh().sess = (sh().sess | 0) + 1;
var FIRST_SESSION = sh().sess <= 1;
writeSave();
// "Restart from Level 1" wipes progress, never purchases: entitlements survive clearSave()
var clr0 = clearSave;
clearSave = function(){ var o = sh(), keep = { noAds:o.noAds, starter:o.starter, starterT:o.starterT, txn:o.txn, sess:o.sess }; var r = clr0.apply(this, arguments); save.shop = keep; sh(); save.upg.pocket = 0; writeSave(); return r; };

// ---- S2 Upgrades: the new cost curve, Coin Bonus, Booster Pocket
var cur = function(b, l){ return Math.round(b*Math.pow(1.4, l)/5)*5; };
var UP = {}; UPG.forEach(function(u){ UP[u.id] = u; });
var POCKET_IC = typeof bstIcon === "function" ? bstIcon("wreck") : "";
if(UP.power){ UP.power.name = "Blast Power"; UP.power.max = 8; UP.power.price = function(l){ return cur(40, l); }; UP.power.nx = function(l){ return "+" + (l*8) + "%"; }; }
if(UP.charge){ UP.charge.name = "Starting TNT"; UP.charge.max = 2; UP.charge.price = function(l){ return [250, 600][l] || 0; }; UP.charge.nx = function(l){ return "+" + l; }; UP.charge.unit = " TNT"; }
if(UP.magnet){ UP.magnet.name = "Coin Bonus"; UP.magnet.max = 5; UP.magnet.price = function(l){ return [50, 70, 100, 140, 195][l] || 0; }; UP.magnet.nx = function(l){ return "+" + (l*10) + "%"; };
  UP.magnet.eff = function(l){ return "+" + (l*10) + "% coins"; }; }
if(UP.slowmo){ UP.slowmo.max = 6; UP.slowmo.price = function(l){ return cur(40, l); }; UP.slowmo.nx = function(l){ return (0.8 + l*0.1).toFixed(1) + " s"; }; }
var POCKET = { id:"pocket", ic:'<span class="sh2Bi">' + POCKET_IC + '</span>', name:"Booster Pocket", max:3, price:function(l){ return [150, 250, 400][l] || 0; },
  nx:function(l){ return l + " free"; }, eff:function(l){ return l + " free booster" + (l === 1 ? "" : "s") + " on Hard / Boss"; } };
if(!UP.pocket){ var si = UPG.indexOf(UP.slowmo); UPG.splice(si < 0 ? UPG.length : si, 0, POCKET); UP.pocket = POCKET; }
save.upg.magnet = Math.min(5, save.upg.magnet | 0); save.upg.pocket = Math.min(3, save.upg.pocket | 0);
// Coin Bonus: +10 % per level (was +12 % on debris coins only, which tap2's flat reward made a no-op)
coinMul = function(){ return 1 + 0.1*Math.min(5, save.upg.magnet | 0); };
function payout(base){ var l = Math.min(5, save.upg.magnet | 0); return Math.ceil(base*(10 + l)/10); }
if(window.__blast.tap2) window.__blast.tap2.payout = function(base){ return payout(base); };
// Booster Pocket: needs a booster to give (locked until the first one is unlocked)
function anyBooster(){ return BOOST_ORDER.some(function(k){ return BOOST[k] && !BOOST[k].hidden && bstUnlocked(k); }); }
function firstLockLv(){ var n = null; try{ n = window.__blast.intro && window.__blast.intro.lockLv(BOOST_ORDER[0]); }catch(e){} return n || 11; }
function upLocked(u){ return u.id === "pocket" && !anyBooster(); }
affordable = function(){ return UPG.some(function(u){ var l = save.upg[u.id] | 0; return !upLocked(u) && l < u.max && save.coins >= u.price(l); }); };
var COIN_IMG = '<img class="sh2Coin" alt="" draggable="false" src="' + A.coin + '">';
var CHECK_IMG = '<img class="sh2Chk" alt="" draggable="false" src="' + A.check + '">';
renderShop = function(){
  $("shopCoinTxt").textContent = fmt(save.coins);
  $("shopPlay").textContent = "PLAY LV " + (shopNext + 1);
  $("shopPlay").className = "big " + (isHard(LEVELS[shopNext % LEVELS.length]) ? "hard" : "mint");
  var sub = $("sh2UpSub"); if(!sub){ sub = document.createElement("p"); sub.id = "sh2UpSub"; sub.textContent = "Permanent. Paid with coins only."; $("ups").parentNode.insertBefore(sub, $("ups")); }
  var wrap = $("ups"); wrap.innerHTML = ""; wrap.classList.add("sh2Ups");
  UPG.forEach(function(u){
    var l = save.upg[u.id] | 0, maxed = l >= u.max, lock = upLocked(u), price = maxed ? 0 : u.price(l), can = !maxed && !lock && save.coins >= price;
    var d = document.createElement("div"); d.className = "up2" + (maxed ? " max" : can ? " can" : " poor"); d.dataset.id = u.id;
    var pips = ""; for(var i=0;i<u.max;i++) pips += '<i class="' + (i < l ? "on" : "") + '"></i>';
    var un = u.unit || "", ef = lock ? "Unlocks with your first booster" : maxed ? (u.nx ? u.nx(l) + un : u.eff(l)) : (u.nx ? u.nx(l) + " → " + u.nx(l + 1) + un : u.eff(l + 1));
    var btn = lock ? '<button type="button" class="pb2 lock" disabled aria-label="' + u.name + ' unlocks at level ' + firstLockLv() + '">Lv.' + firstLockLv() + '</button>'
      : maxed ? '<button type="button" class="pb2 maxd" disabled aria-label="' + u.name + ' maxed">' + CHECK_IMG + 'MAX</button>'
      : '<button type="button" class="pb2' + (can ? "" : " cant") + '"' + (can ? "" : " disabled") + ' aria-label="Upgrade ' + u.name + ' for ' + price + ' coins' + (can ? "" : " (not enough coins)") + '">' + COIN_IMG + '<span class="price">' + fmt(price) + '</span></button>';
    d.innerHTML = '<div class="ic2">' + u.ic + '</div><div class="nm2' + (u.name.length > 12 ? " long" : "") + '">' + u.name + '</div><div class="ef2">' + ef + '</div><div class="pip2">' + pips + '</div>' + btn;
    var b = d.querySelector("button"); if(can) b.addEventListener("click", function(){ buy(u.id); });
    wrap.appendChild(d);
  });
};
// ---- Booster Pocket grant: when a Hard / Boss level is opened (Home Play / map / next / try again all go through bstPlay), once per level
var POCKET_LOG = [];
function pocketGrant(i){
  var n = save.upg.pocket | 0, Lv = LEVELS[i]; if(!n || !Lv || !(Lv.boss || isHard(Lv)) || sh().pk[i]) return null;
  var ks = BOOST_ORDER.filter(function(k){ return BOOST[k] && !BOOST[k].hidden && bstUnlocked(k); }); if(!ks.length) return null;
  var s = bstSave(), got = [];
  for(var j=0;j<n;j++){ ks.sort(function(a, b){ return (s[a] || 0) - (s[b] || 0) || BOOST_ORDER.indexOf(a) - BOOST_ORDER.indexOf(b); }); s[ks[0]] = (s[ks[0]] || 0) + 1; got.push(ks[0]); }
  sh().pk[i] = 1; writeSave();
  var e = { level:i + 1, got:got }; POCKET_LOG.push(e); lg("pocket:" + (i + 1) + ":" + got.join("+"));
  var names = {}; got.forEach(function(k){ names[k] = (names[k] || 0) + 1; });
  setTimeout(function(){ toast("Booster Pocket: " + Object.keys(names).map(function(k){ return "+" + names[k] + " " + BOOST[k].name; }).join(", ")); }, 450);
  try{ bstSync(); }catch(x){}
  return e;
}
var bp0 = bstPlay;
bstPlay = function(i){ try{ pocketGrant(i); }catch(e){ console.error("shop pocket", e); } return bp0.apply(this, arguments); };

// ---- purchases: one interface, three providers (dev simulation, native RevenueCat when IAP_READY, none)
var CAT = [
  { id:"cb.starter", nc:1, coins:1200, b:2, name:"Starter Pack", usd:2.99 },
  { id:"cb.noads", nc:1, name:"No Ads", usd:6.99 },
  { id:"cb.coins.600", coins:600, pile:"s", usd:1.99, pack:1 },
  { id:"cb.coins.1700", coins:1700, pile:"m", usd:4.99, pack:1 },
  { id:"cb.coins.3800", coins:3800, pile:"l", usd:9.99, pack:1, badge:"POPULAR" },
  { id:"cb.coins.8500", coins:8500, pile:"l", usd:19.99, pack:1 },
  { id:"cb.coins.24000", coins:24000, pile:"xl", usd:49.99, pack:1 },
  { id:"cb.bundle.small", coins:1000, b:2, pile:"m", name:"Small Bundle", usd:4.99, bundle:1 },
  { id:"cb.bundle.builder", coins:2500, b:4, pile:"l", name:"Builder Bundle", usd:9.99, bundle:1, badge:"POPULAR" },
  { id:"cb.bundle.mega", coins:6000, b:10, pile:"xl", name:"Mega Bundle", usd:19.99, bundle:1 },
  { id:"cb.failoffer", coins:1000, tnt:1, name:"Fail Offer", usd:4.99 }
];
var PROD = {}; CAT.forEach(function(p){ PROD[p.id] = p; });
var DEV_KEY = "cityblast.iapdev.owned";   // the simulated "Apple ID" (non-consumables survive a save wipe, as on a real device)
var devProv = {
  name:"dev", next:null,
  products:function(){ return Promise.resolve(CAT.map(function(p){ return { id:p.id, price:"$" + p.usd.toFixed(2), amount:p.usd }; })); },
  buy:function(id){ var mode = devProv.next; devProv.next = null;
    return new Promise(function(res){ setTimeout(function(){
      if(mode === "cancel") return res({ cancelled:true });
      if(mode === "error") return res({ error:"dev" });
      if(PROD[id] && PROD[id].nc){ try{ var o = JSON.parse(localStorage.getItem(DEV_KEY) || "{}"); o[id] = 1; localStorage.setItem(DEV_KEY, JSON.stringify(o)); }catch(e){} }
      res({ ok:true, txn:"dev-" + id + "-" + Date.now() + "-" + Math.floor(Math.random()*1e6) }); }, mode === "slow" ? 2500 : 450); }); },
  restore:function(){ var o = {}; try{ o = JSON.parse(localStorage.getItem(DEV_KEY) || "{}"); }catch(e){} return new Promise(function(res){ setTimeout(function(){ res({ ok:true, ids:Object.keys(o) }); }, 350); }); }
};
// RevenueCat Capacitor plugin (@revenuecat/purchases-capacitor), only when IAP_READY and the plugin is in the native build.
// Configured natively (AppDelegate / capacitor.config) by the release task: no API key lives in this file.
var rc = function(){ var C = window.Capacitor; return C && C.isNativePlatform && C.isNativePlatform() && C.Plugins && C.Plugins.Purchases; };
var nativeProv = {
  name:"native", pk:{},
  products:function(){ var P = rc(); if(!P) return Promise.reject("no plugin");
    return P.getOfferings().then(function(o){ var cur = o && (o.current || (o.all && o.all["default"])), out = [];
      (cur && cur.availablePackages || []).forEach(function(k){ var pr = k.product || {}; nativeProv.pk[pr.identifier] = k; out.push({ id:pr.identifier, price:pr.priceString, amount:pr.price }); });
      return out; }); },
  buy:function(id){ var P = rc(), k = nativeProv.pk[id]; if(!P || !k) return Promise.resolve({ error:"unavailable" });
    return P.purchasePackage({ aPackage:k }).then(function(r){ var t = r && r.transaction; return { ok:true, txn:(t && (t.transactionIdentifier || t.revenueCatId)) || ("rc-" + id + "-" + Date.now()) }; },
      function(e){ return e && (e.userCancelled || e.code === "1" || /cancel/i.test(e.message || "")) ? { cancelled:true } : { error:String(e && e.message || e) }; }); },
  restore:function(){ var P = rc(); if(!P) return Promise.resolve({ ok:false });
    return P.restorePurchases().then(function(r){ var a = (r && r.customerInfo && r.customerInfo.entitlements && r.customerInfo.entitlements.active) || {}, ids = [];
      if(a.no_ads) ids.push("cb.noads"); if(a.starter) ids.push("cb.starter"); return { ok:true, ids:ids }; }, function(){ return { ok:false }; }); }
};
var IAP = IAPDEV ? devProv : (IAP_READY && rc()) ? nativeProv : null;
var SHOP_ON = !!IAP;                                // real-money UI shown at all
var PRICES = {}, PRICES_OK = false, BUSY = null;
function loadPrices(){ if(!IAP) return; IAP.products().then(function(list){ (list || []).forEach(function(x){ PRICES[x.id] = x; }); PRICES_OK = true; if(shopOpen()) render(); }, function(){ PRICES_OK = false; }); }
loadPrices();
function online(){ return navigator.onLine !== false; }
function priceOf(id){ return PRICES[id] ? PRICES[id].price : null; }
function canBuy(id){ return SHOP_ON && online() && !!priceOf(id) && !BUSY; }
function grant(id, txn){
  var o = sh(), p = PROD[id]; if(!p) return false;
  if(txn){ if(o.txn[txn]) return false; o.txn[txn] = 1; var ks = Object.keys(o.txn); if(ks.length > 60) delete o.txn[ks[0]]; }
  if(p.coins) save.coins += p.coins;
  if(p.b){ var s = bstSave(); BOOST_ORDER.forEach(function(k){ if(BOOST[k] && !BOOST[k].hidden) s[k] = (s[k] || 0) + p.b; }); }
  if(id === "cb.noads"){ o.noAds = 1; o.noAdsNew = 1; }
  if(id === "cb.starter"){ o.starter = 1; o.starterNew = 1; }
  writeSave(); syncCoins(); lg("grant:" + id); return true;
}
function syncCoins(){ ["hCoinTxt", "coinTxt", "shopCoinTxt", "cmCoinTxt"].forEach(function(id){ var e = $(id); if(e) e.textContent = id === "shopCoinTxt" ? fmt(save.coins) : save.coins; });
  hudCoins = save.coins; var e2 = $("sh2CoinTxt"); if(e2) e2.textContent = fmt(save.coins); }
var AFTER_IAP = false;      // no interstitial right after a purchase (cleared at the next level start)
function purchase(id, done){
  if(!canBuy(id)) return;
  BUSY = id; lg("iap_start:" + id); render(); syncLose();
  IAP.buy(id).then(function(r){
    BUSY = null;
    if(r && r.ok){ grant(id, r.txn); AFTER_IAP = true; lg("iap_success:" + id); try{ snd("upgrade"); }catch(e){} if(done) done(true); else thanks(id); }
    else if(r && r.cancelled){ lg("iap_cancel:" + id); if(done) done(false); }
    else { lg("iap_error:" + id); toast("Purchase didn't go through. You weren't charged."); if(done) done(false); }
    render(); syncHome(); syncLose();
  });
}
function restore(){
  if(!IAP || BUSY) return; BUSY = "restore"; render();
  IAP.restore().then(function(r){
    BUSY = null; var got = [];
    (r && r.ids || []).forEach(function(id){ if(id === "cb.noads" && !sh().noAds){ sh().noAds = 1; got.push("No Ads"); } else if(id === "cb.noads") got.push("No Ads");
      if(id === "cb.starter"){ sh().starter = 1; got.push("Starter Pack"); } });
    writeSave(); lg("restore:" + got.join("+"));
    toast(got.length ? "Restored: " + got.join(", ") : r && r.ok ? "Nothing to restore on this Apple ID" : "Restore didn't go through. Try again later.");
    render(); syncHome();
  });
}

// ---- style (Figma page 131:2 components; Lilita One = --ul-fr / ULClean, Nunito body >= 16 px, badges 14 px caps)
var css = document.createElement("style"); css.id = "sh2Css"; css.textContent = [
  "#sh2Shop{position:fixed;top:0;bottom:0;left:var(--px,0px);width:var(--pw,100vw);z-index:5;display:flex;flex-direction:column;background:linear-gradient(180deg,#5AA8F8 0%,#2E74E6 38%,#1C4DB6 100%)}",
  "#sh2Shop.hidden,#sh2Pop.hidden,#sh2Win.hidden{display:none!important}",
  ".sh2Head{flex:none;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:calc(var(--sa-t,0px) + 12px) 16px 6px;min-height:72px;box-sizing:border-box}",
  ".sh2Head h2{margin:0;font:400 38px/1.1 var(--ul-fr,\"ULClean\"),system-ui,sans-serif;color:#FFF8E1;-webkit-text-stroke:7px #2B2140;paint-order:stroke fill;text-shadow:0 3px 0 #2B2140}",
  ".sh2Pill{display:flex;align-items:center;gap:8px;height:48px;padding:0 18px 0 6px;border-radius:24px;background:linear-gradient(#FFFDF6,#FFF1D2);border:3px solid #2B2140;box-shadow:0 3px 0 rgba(43,33,64,.45);font:400 26px/1 var(--ul-fr,\"ULClean\"),system-ui,sans-serif;color:#2B2140}",
  ".sh2Pill .sh2Coin{width:38px;height:38px}",
  "#sh2List{flex:1;min-height:0;overflow-y:auto;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;padding:18px 16px calc(var(--sa-b,0px) + var(--ul-tabh,124px) + 28px);box-sizing:border-box;display:flex;flex-direction:column;align-items:center;gap:16px}",
  "#sh2List > *{flex:none;width:345px;max-width:100%;box-sizing:border-box}",
  "#sh2Off{padding:10px 14px;border-radius:16px;background:#2B2140;color:#FFF8E1;font:900 16px/1.25 Nunito,system-ui,sans-serif;text-align:center}",
  // price button (Shop / Price Button 131:211): 124 x 52, green = real money and "Free (ad)", label = StoreKit price
  ".pb{flex:none;display:inline-flex;align-items:center;justify-content:center;gap:6px;width:124px;height:52px;padding:0 6px 3px;box-sizing:border-box;border-radius:26px;border:3px solid #1E3A12;background:linear-gradient(#8EE04E,#4DBA2F);box-shadow:0 4px 0 #2E8A1C,inset 0 3px 0 rgba(255,255,255,.4);" +
    "font:400 22px/1.1 var(--ul-fr,\"ULClean\"),system-ui,sans-serif;color:#FFF8E1;-webkit-text-stroke:4px #1E3A12;paint-order:stroke fill;cursor:pointer;-webkit-tap-highlight-color:transparent}",
  ".pb:active{transform:translateY(3px);box-shadow:0 1px 0 #2E8A1C}",
  ".pb[disabled]{cursor:default}.pb.pend{letter-spacing:.1em}.pb.na{opacity:.55}",
  ".pb.own{border-color:#6F675E;background:linear-gradient(#F4EFE7,#C9C2B8);box-shadow:0 4px 0 #9E968B;color:#6E6380;-webkit-text-stroke:0}",
  ".pb.own .sh2Chk{width:20px;height:20px}",
  // badge (Shop / Badge 131:225)
  ".sh2Bdg{position:absolute;top:-18px;right:20px;display:inline-flex;align-items:center;gap:4px;padding:4px 12px;border-radius:14px;border:2px solid #5A1A05;background:#FF6A1A;font:900 14px/1.1 Nunito,system-ui,sans-serif;color:#FFF8E1;white-space:nowrap;z-index:1}",
  ".sh2Bdg.pop{background:#8A3BD6;border-color:#2A0B4D}.sh2Bdg.one{background:#2F64D6;border-color:#0F2A66}",
  ".sh2Bdg.tmr{position:absolute;top:auto;right:auto;left:10px;bottom:12px;background:#2B2140;border-color:#FFF8E1}.sh2Bdg.tmr img{width:14px;height:14px}",
  // coin pack row (133:239)
  ".sh2Row{position:relative;height:84px;border-radius:20px;border:3px solid #F1DDBC;background:linear-gradient(#FFFAF0,#FFF4DC);box-shadow:0 4px 0 #D9C19A;display:flex;align-items:center;gap:8px;padding:0 10px 0 2px}",
  ".sh2Row.best{border:4px solid #E59A00;background:linear-gradient(#FFFAF0,#FFE9B8);box-shadow:0 5px 0 #E59A00}",
  ".sh2Row .sh2Pile{width:81px;height:64px;flex:none;object-fit:contain}",
  ".sh2Amt{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}",
  ".sh2Amt b{font:400 30px/1.1 var(--ul-fr,\"ULClean\"),system-ui,sans-serif;color:#2B2140}",
  ".sh2Amt span{font:800 16px/1.1 Nunito,system-ui,sans-serif;color:#6E6380}",
  // section header ribbon (131:226)
  ".sh2Sec{position:relative;height:52px;margin:8px 0 2px;display:grid;place-items:center;font:400 28px/1 var(--ul-fr,\"ULClean\"),system-ui,sans-serif;color:#FFF8E1;-webkit-text-stroke:6px #0F2A66;paint-order:stroke fill}",
  ".sh2Sec::before{content:'';position:absolute;left:24px;right:24px;top:0;bottom:0;border-radius:12px;border:3px solid #0F2A66;background:linear-gradient(#5A92F2,#2F64D6 60%,#1D449E);box-shadow:inset 0 3px 0 rgba(255,255,255,.35),0 4px 0 #0F2A66;z-index:-1}",
  ".sh2Sec::after{content:'';position:absolute;left:0;right:0;top:12px;bottom:-6px;background:linear-gradient(90deg,#1D449E 0 30px,transparent 30px calc(100% - 30px),#1D449E calc(100% - 30px));clip-path:polygon(0 0,30px 0,30px 100%,0 100%,10px 50%,100% 0,100% 0,calc(100% - 30px) 0,calc(100% - 30px) 100%,100% 100%,calc(100% - 10px) 50%,100% 0);z-index:-2}",
  ".sh2Sec{isolation:isolate}",
  // booster tile (131:265)
  ".sh2Tile{position:relative;width:64px;height:64px;flex:none;box-sizing:border-box;border-radius:14px;border:2px solid #F1DDBC;background:#FFEBC8}",
  ".sh2Tile .bi,.sh2Tile img{position:absolute;left:6px;top:2px;width:48px;height:48px}",
  ".sh2Tile b{position:absolute;right:4px;bottom:2px;font:400 20px/1 var(--ul-fr,\"ULClean\"),system-ui,sans-serif;color:#FFF8E1;-webkit-text-stroke:4px #2B2140;paint-order:stroke fill}",
  ".sh2Pk{position:relative;width:84px;height:72px;flex:none}.sh2Pk img{position:absolute;left:0;top:-6px;width:84px;height:66px;object-fit:contain}",
  ".sh2Pk b{position:absolute;left:0;right:0;bottom:0;text-align:center;font:400 20px/1 var(--ul-fr,\"ULClean\"),system-ui,sans-serif;color:#FFF8E1;-webkit-text-stroke:4px #7A4A00;paint-order:stroke fill}",
  // bundle card (133:496)
  ".sh2Bun{position:relative;border-radius:22px;border:3px solid #F1DDBC;background:#FFF4DC;box-shadow:0 4px 0 #D9C19A;overflow:visible}",
  ".sh2Bun.best{border:4px solid #E59A00;box-shadow:0 5px 0 #E59A00}",
  ".sh2Bun .top{display:flex;align-items:center;gap:8px;padding:16px 10px 8px;border-radius:20px 20px 0 0;background:linear-gradient(#FFFDF6,#FFF1D2)}",
  ".sh2Bun .band{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:8px 10px 10px 16px;border-radius:0 0 18px 18px;background:linear-gradient(#5A92F2,#2F64D6 55%,#1D449E)}",
  ".sh2Bun .band b{font:400 26px/1.1 var(--ul-fr,\"ULClean\"),system-ui,sans-serif;color:#FFF8E1;-webkit-text-stroke:5px #0F2A66;paint-order:stroke fill;white-space:nowrap}",
  // starter (133:696): purple Hard palette + gold frame
  ".sh2Sta{position:relative;height:206px;border-radius:22px;border:4px solid #FFC633;background:linear-gradient(#A86BF0,#7A2BC4 60%,#4E1784);box-shadow:0 5px 0 #2A0B4D}",
  ".sh2Sta.own{background:#C9C2B8;border-color:#9E968B;box-shadow:0 5px 0 #9E968B}",
  ".sh2Sta h3{margin:0;padding-top:6px;text-align:center;font:400 30px/1.1 var(--ul-fr,\"ULClean\"),system-ui,sans-serif;color:#FFF8E1;-webkit-text-stroke:6px #2A0B4D;paint-order:stroke fill}",
  ".sh2Sta.own h3{-webkit-text-stroke-color:#6F675E}",
  ".sh2Sta .in{position:absolute;left:8px;right:8px;top:50px;height:96px;box-sizing:border-box;border-radius:16px;border:2px solid #F1DDBC;background:#FFF4DC;display:flex;align-items:center;gap:8px;padding:0 8px;overflow:hidden}",
  ".sh2Sta .pb{position:absolute;right:10px;bottom:-2px}",
  // No Ads card (133:511)
  ".sh2NoA{position:relative;min-height:148px;border-radius:22px;border:4px solid #E59A00;background:linear-gradient(#FFFDF6,#FFF1D2);box-shadow:0 5px 0 #E59A00;display:grid;grid-template-columns:96px 1fr;column-gap:8px;padding:14px 12px 12px 6px;align-items:start}",
  ".sh2NoA.own{border-color:#9E968B;box-shadow:0 5px 0 #9E968B}",
  ".sh2NoA .ico{display:block;grid-row:1 / span 3;width:96px;height:96px;align-self:center;background:center/contain no-repeat}",
  ".sh2NoA h3{margin:0;font:400 30px/1.1 var(--ul-fr,\"ULClean\"),system-ui,sans-serif;color:#2B2140}",
  ".sh2NoA p{margin:2px 0 8px;font:700 16px/1.25 Nunito,system-ui,sans-serif;color:#6E6380}",
  ".sh2NoA .pb{justify-self:end}",
  // footer
  "#sh2Rest{display:block;width:210px!important;height:52px;margin:6px auto 0;border-radius:26px;border:3px solid #0F2A66;background:#2F64D6;box-shadow:0 4px 0 #0F2A66,inset 0 3px 0 rgba(255,255,255,.3);font:900 18px/1 Nunito,system-ui,sans-serif;color:#FFF8E1;cursor:pointer}",
  "#sh2Rest:active,#sh2SetRest:active{transform:translateY(3px);box-shadow:0 1px 0 #0F2A66}",
  ".sh2Foot{margin:0;text-align:center;font:700 16px/1.3 Nunito,system-ui,sans-serif;color:#FFF8E1;opacity:.9}",
  // Settings: Restore Purchases (frame 4c), a blue secondary pill above "Restart from Level 1"
  "#sh2SetRest{display:block;width:100%;min-height:52px;margin:10px 0 2px;border-radius:26px;border:3px solid #0F2A66;background:linear-gradient(#5A92F2,#2F64D6);box-shadow:0 4px 0 #0F2A66,inset 0 3px 0 rgba(255,255,255,.3);font:400 22px/1 var(--ul-fr,\"ULClean\"),system-ui,sans-serif;color:#FFF8E1;-webkit-text-stroke:4px #0F2A66;paint-order:stroke fill;cursor:pointer}",
  // Upgrades rows (Upgrades / Upgrade Card 133:788)
  "html.sh2 body #shop #ups.sh2Ups{display:flex;flex-direction:column;gap:12px;width:345px;max-width:calc(100vw - 32px);flex:0 1 auto;min-height:0;overflow-y:auto;overscroll-behavior:contain;padding:4px 0 8px;grid-template-columns:none}",
  "html.sh2 body #shop #sh2UpSub{margin:6px 0 10px;font:900 16px/1.2 Nunito,system-ui,sans-serif;color:#FFF8E1;text-align:center}",
  ".up2{position:relative;flex:none;height:104px;box-sizing:border-box;border-radius:20px;border:3px solid #F1DDBC;background:linear-gradient(#FFFAF0,#FFF4DC);box-shadow:0 4px 0 #D9C19A}",
  ".up2 .ic2{position:absolute;left:9px;top:13px;width:72px;height:72px;box-sizing:border-box;border-radius:36px;border:2px solid #F1DDBC;background:#FFEBC8;display:grid;place-items:center;overflow:hidden}",
  ".up2 .ic2 svg.i,.up2 .ic2 .bi,.up2 .ic2 img{width:48px!important;height:48px!important}",
  ".up2 .nm2{position:absolute;left:93px;top:9px;right:104px;font:400 24px/1.1 var(--ul-fr,\"ULClean\"),system-ui,sans-serif;color:#2B2140;white-space:nowrap}",
  ".up2 .nm2.long{font-size:21px}",
  ".up2 .ef2{position:absolute;left:93px;top:41px;right:100px;font:800 16px/1.1 Nunito,system-ui,sans-serif;color:#6E6380;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
  ".up2 .pip2{position:absolute;left:93px;top:69px;display:flex;gap:4px}.up2 .pip2 i{width:12px;height:10px;border-radius:5px;background:#F1DDBC}.up2 .pip2 i.on{background:#4DBA2F}",
  ".up2 .pb2{position:absolute;right:12px;top:28px;width:92px;height:44px;display:flex;align-items:center;justify-content:center;gap:4px;box-sizing:border-box;border-radius:22px;border:2px solid #7A4A00;background:linear-gradient(#FFE27A,#FFC633);box-shadow:0 3px 0 #E59A00;" +
    "font:400 18px/1 var(--ul-fr,\"ULClean\"),system-ui,sans-serif;color:#2B2140;padding:0 6px;cursor:pointer;min-width:0;min-height:0}",
  ".up2 .pb2 .sh2Coin{width:20px;height:20px}.up2 .pb2 .sh2Chk{width:16px;height:16px}",
  ".up2 .pb2:active{transform:translateY(2px);box-shadow:0 1px 0 #E59A00}",
  ".up2 .pb2.cant{opacity:.55}",   // too few coins: 55 %, ink, never red
  ".up2 .pb2.maxd,.up2 .pb2.lock{border-color:#6F675E;background:linear-gradient(#F4EFE7,#C9C2B8);box-shadow:0 3px 0 #9E968B;color:#6E6380}",
  ".sh2Bi{display:grid;place-items:center}",
  // pop-up card (No Ads 2a, Thank you 4b, x2 win 5b): cream bevel card + blue header ribbon (Card / Frame 97:111, Header Ribbon 97:98)
  "#sh2Pop,#sh2Win{position:fixed;inset:0;z-index:40;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:calc(var(--sa-t,0px) + 16px) 16px calc(var(--sa-b,0px) + 16px);box-sizing:border-box;background:radial-gradient(ellipse at 50% 45%,rgba(43,33,64,.35),rgba(27,20,48,.78));animation:sh2Fade .2s ease-out both}",
  "#sh2Win{background:rgba(27,20,48,.35)}",
  ".sh2Card{position:relative;width:330px;max-width:calc(100vw - 32px);box-sizing:border-box;padding:0 22px 22px;border:4px solid #2B2140;border-radius:32px;text-align:center;" +
    "background:radial-gradient(ellipse at 50% 30%,rgba(255,255,255,.95),rgba(255,255,255,0) 60%),linear-gradient(#FFFDF6,#FFF1D2 50%,#FFE3AE);box-shadow:inset 0 6px 0 #fff,inset 0 -8px 0 rgba(233,184,122,.55),0 8px 0 #2B2140,0 18px 28px rgba(0,0,0,.35);animation:sh2PopIn .32s cubic-bezier(.2,1.4,.4,1) both}",
  ".sh2Rib{margin:0 -22px 14px;min-height:68px;padding:10px 56px 12px;box-sizing:border-box;border-radius:28px 28px 0 0;border-bottom:4px solid #2B2140;background:linear-gradient(#5A92F2,#2F64D6 55%,#1D449E);box-shadow:inset 0 4px 0 rgba(255,255,255,.35);" +
    "display:flex;align-items:center;justify-content:center;font:400 36px/1 var(--ul-fr,\"ULClean\"),system-ui,sans-serif;color:#FFD84A;-webkit-text-stroke:7px #2B2140;paint-order:stroke fill;text-shadow:0 4px 0 #2B2140;white-space:nowrap}",
  ".sh2X{position:absolute;right:10px;top:10px;width:48px;height:48px;border-radius:50%;border:3px solid #2B2140;background:#E5322D;box-shadow:0 3px 0 rgba(43,33,64,.45);display:grid;place-items:center;cursor:pointer;z-index:2}",
  ".sh2X svg{width:20px;height:20px}",
  ".sh2Card .ico{display:block;width:120px;height:120px;margin:4px auto 8px;background:center/contain no-repeat}",
  ".sh2Card h4{margin:0 0 6px;font:900 18px/1.3 Nunito,system-ui,sans-serif;color:#2B2140}",
  ".sh2Card p{margin:0 0 4px;font:700 16px/1.35 Nunito,system-ui,sans-serif;color:#6E6380}",
  ".sh2Card .pile{display:block;width:150px;height:118px;margin:2px auto 0;object-fit:contain}",
  ".sh2Card .amt{margin:-6px 0 6px;font:400 48px/1 var(--ul-fr,\"ULClean\"),system-ui,sans-serif;color:#FFF8E1;-webkit-text-stroke:8px #7A4A00;paint-order:stroke fill;text-shadow:0 4px 0 #7A4A00}",
  ".sh2Big{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;height:76px;margin:16px 0 0;border-radius:26px;border:3px solid #1E3A12;background:linear-gradient(#8EE04E,#4DBA2F 55%,#3A9A22);box-shadow:inset 0 -7px 0 #2E8A1C,inset 0 3px 0 rgba(255,255,255,.55),0 7px 0 #1E3A12;" +
    "font:400 36px/1 var(--ul-fr,\"ULClean\"),system-ui,sans-serif;color:#FFF8E1;-webkit-text-stroke:7px #1E3A12;paint-order:stroke fill;cursor:pointer;padding:0 12px 4px}",
  ".sh2Big:active{transform:translateY(3px);box-shadow:inset 0 -7px 0 #2E8A1C,0 3px 0 #1E3A12}",
  ".sh2Big[disabled]{opacity:.6}",
  ".sh2Play{width:40px;height:30px;flex:none}",
  ".sh2Link{display:block;min-height:48px;margin:6px auto 0;padding:0 18px;border:0;background:none;font:900 18px/48px Nunito,system-ui,sans-serif;color:#6E6380;cursor:pointer}",
  ".sh2Not{min-height:48px;margin-top:14px;padding:0 22px;border:0;background:none;font:900 18px/48px Nunito,system-ui,sans-serif;color:#FFF8E1;cursor:pointer}",
  // lose card: rewarded "+1 TNT Free" (5a) makes Try Again a quiet link; the Fail Offer row
  "html.sh2 body #result #sh2Rv{display:flex;align-items:center;justify-content:center;gap:8px}",
  "html.sh2 body #result #sh2Rv.hidden,#sh2Fo.hidden{display:none!important}",
  "html.sh2 body #result #rNext.sh2Sec2{background:none!important;border:0!important;box-shadow:none!important;color:#6E6380!important;-webkit-text-stroke:0!important;text-shadow:none!important;font:900 18px/1 Nunito,system-ui,sans-serif!important;min-height:48px!important;height:48px!important}",
  "html.sh2 body #result #rNext.sh2Sec2::before,html.sh2 body #result #rNext.sh2Sec2::after{display:none!important}",
  "#sh2Fo{display:flex;align-items:center;gap:10px;margin:12px 0 0;padding:10px 10px 10px 14px;border-radius:18px;border:3px solid #FFC633;background:linear-gradient(#A86BF0,#7A2BC4);box-shadow:0 4px 0 #2A0B4D;text-align:left}",
  "#sh2Fo.boss{background:linear-gradient(#FF9A4A,#FF6A1A);box-shadow:0 4px 0 #5A1A05}",
  "#sh2Fo div{flex:1;min-width:0;font:900 16px/1.25 Nunito,system-ui,sans-serif;color:#FFF8E1}#sh2Fo div b{display:block;font:400 22px/1.1 var(--ul-fr,\"ULClean\"),system-ui,sans-serif;-webkit-text-stroke:4px #2A0B4D;paint-order:stroke fill}",
  // Home No Ads button (Home / No Ads Button 135:564) in the E8 slot: shown from L15 (D-blast-SHOP over ADOPT 3)
  "html.sh2na body #ulPlate #ulNoAds{display:block!important}",
  "body.sh2PopOn #title .foot,body.sh2PopOn #title .foot *{opacity:0!important;pointer-events:none!important}",   // one primary button: the Home Play hides under a pop-up
  "@keyframes sh2Fade{from{opacity:0}to{opacity:1}}",
  "@keyframes sh2PopIn{0%{transform:scale(.6);opacity:0}60%{transform:scale(1.04);opacity:1}100%{transform:scale(1);opacity:1}}",
  "html.rm #sh2Pop,html.rm #sh2Win,html.rm .sh2Card{animation:none!important}",
  "@media (prefers-reduced-motion:reduce){#sh2Pop,#sh2Win,.sh2Card{animation:none!important}}",
  "@media (max-height:700px){.sh2Card .ico{width:96px;height:96px}.sh2Big{height:68px;font-size:32px}.sh2Rib{min-height:60px;font-size:32px}html.sh2 body #shop #sh2UpSub{margin:2px 0 6px}}"
].join("\n");
document.head.appendChild(css);

// ---- S1 the Shop screen (a layer over Home, under the tab bar; the Shop tab is the active one)
var NOADS_BG = "";
function noAdsBg(){ if(NOADS_BG) return NOADS_BG; var i = document.querySelector("#ulNoAds i"); NOADS_BG = i ? getComputedStyle(i).backgroundImage : "none"; return NOADS_BG; }
var shopEl = document.createElement("div"); shopEl.id = "sh2Shop"; shopEl.className = "hidden"; shopEl.setAttribute("role", "region"); shopEl.setAttribute("aria-label", "Shop");
shopEl.innerHTML = '<div class="sh2Head"><h2>Shop</h2><div class="sh2Pill" aria-label="Coins">' + '<img class="sh2Coin" alt="" src="' + A.coin + '"><span id="sh2CoinTxt">0</span></div></div><div id="sh2List"></div>';
var tabs = $("ulTabs"); if(tabs && tabs.parentNode) tabs.parentNode.insertBefore(shopEl, tabs); else document.body.appendChild(shopEl);
function shopOpen(){ return !shopEl.classList.contains("hidden"); }
function ptxt(id){ return BUSY === id ? "···" : !online() ? "—" : priceOf(id) || "—"; }
function pbtn(id, cls){ var dis = !canBuy(id), nm = (PROD[id] && (PROD[id].name || fmt(PROD[id].coins) + " coins")) || id;
  return '<button type="button" class="pb' + (BUSY === id ? " pend" : "") + (cls ? " " + cls : "") + '" data-buy="' + id + '"' + (dis ? " disabled" : "") + ' aria-label="Buy ' + nm + (priceOf(id) ? " for " + priceOf(id) : "") + '">' + ptxt(id) + '</button>'; }
function ownBtn(){ return '<button type="button" class="pb own" disabled aria-label="Owned">' + '<img class="sh2Chk" alt="" src="' + A.check + '">Owned</button>'; }
function tile(k, n){ return '<span class="sh2Tile" aria-label="' + BOOST[k].name + ' ×' + n + '">' + bstIcon(k) + '<b>×' + n + '</b></span>'; }
function tiles(n){ return BOOST_ORDER.filter(function(k){ return BOOST[k] && !BOOST[k].hidden; }).map(function(k){ return tile(k, n); }).join(""); }
var STARTER_MS = 48*3600*1000;
function starterState(){ var o = sh();
  if(o.starter) return o.starterNew ? "own" : null;                       // bought: shown as Owned this session only
  if((save.level | 0) < 9) return null;                                    // shown from L10
  if(o.starterT && Date.now() - o.starterT > STARTER_MS) return null;      // 48 h after the first view, gone
  return "on"; }
function timeLeft(){ var ms = Math.max(0, (sh().starterT || Date.now()) + STARTER_MS - Date.now()), s = Math.floor(ms/1000);
  var h = Math.floor(s/3600), m = Math.floor(s%3600/60), x = s%60; return h + ":" + (m < 10 ? "0" : "") + m + ":" + (x < 10 ? "0" : "") + x; }
function bonusOf(p){ var b = PRICES["cb.coins.600"], q = PRICES[p.id]; if(!b || !q || !b.amount || !q.amount) return 0; return Math.floor((p.coins/q.amount)/(600/b.amount)*100 - 100 + 1e-9); }
function bestId(){ var best = null, v = 0; CAT.forEach(function(p){ var q = PRICES[p.id]; if(p.pack && q && q.amount && p.coins/q.amount > v){ v = p.coins/q.amount; best = p.id; } }); return best; }
function render(){
  syncCoins();
  if(!shopOpen()) return;
  var o = sh(), L = $("sh2List"), h = [], st = starterState(), best = bestId();
  if(!online()) h.push('<div id="sh2Off" role="status">Connect to the internet to shop</div>');
  if(st){ if(st === "on" && !o.starterT){ o.starterT = Date.now(); writeSave(); }
    h.push('<div class="sh2Sta' + (st === "own" ? " own" : "") + '" data-card="cb.starter"><span class="sh2Bdg one">ONE-TIME</span><h3>Starter Pack</h3><div class="in"><span class="sh2Pk"><img alt="" src="' + A["pile-m"] + '"><b>1,200</b></span>' + tiles(2) + '</div>' +
      (st === "own" ? "" : '<span class="sh2Bdg tmr" id="sh2Tmr"><img alt="" src="' + A.clock + '"><span>' + timeLeft() + '</span></span>') + (st === "own" ? ownBtn() : pbtn("cb.starter")) + '</div>'); }
  var noAds = '<div class="sh2NoA' + (o.noAds ? " own" : "") + '" data-card="cb.noads"><i class="ico" style="background-image:' + noAdsBg().replace(/"/g, "'") + '"></i><h3>No Ads</h3><p>' +
    (o.noAds ? "Thanks! Ads between levels are off on this Apple ID." : "No more ads between levels. Bonus videos stay: you choose.") + '</p>' + (o.noAds ? ownBtn() : pbtn("cb.noads")) + '</div>';
  if(!o.noAds) h.push(noAds);
  h.push('<div class="sh2Sec" role="heading" aria-level="3">Coin Packs</div>');
  CAT.filter(function(p){ return p.pack; }).forEach(function(p){ var bn = bonusOf(p), isBest = p.id === best;
    h.push('<div class="sh2Row' + (isBest ? " best" : "") + '" data-card="' + p.id + '">' + (isBest ? '<span class="sh2Bdg">BEST VALUE</span>' : p.badge ? '<span class="sh2Bdg pop">' + p.badge + '</span>' : "") +
      '<img class="sh2Pile" alt="" src="' + A["pile-" + p.pile] + '"><div class="sh2Amt"><b>' + fmt(p.coins) + '</b><span>' + (bn > 0 ? "+" + bn + "% bonus" : "coins") + '</span></div>' + pbtn(p.id) + '</div>'); });
  h.push('<div class="sh2Sec" role="heading" aria-level="3">Booster Bundles</div>');
  CAT.filter(function(p){ return p.bundle; }).forEach(function(p){
    h.push('<div class="sh2Bun' + (p.badge ? " best" : "") + '" data-card="' + p.id + '">' + (p.badge ? '<span class="sh2Bdg pop">' + p.badge + '</span>' : "") +
      '<div class="top"><span class="sh2Pk"><img alt="" src="' + A["pile-" + p.pile] + '"><b>' + fmt(p.coins) + '</b></span>' + tiles(p.b) + '</div><div class="band"><b>' + p.name + '</b>' + pbtn(p.id) + '</div></div>'); });
  if(o.noAds) h.push(noAds);
  h.push('<button type="button" id="sh2Rest"' + (BUSY ? " disabled" : "") + '>Restore Purchases</button>');
  h.push('<p class="sh2Foot">Prices come from the App Store in your currency. Coins and boosters are consumable; No Ads is permanent.</p>');
  L.innerHTML = h.join("");
}
shopEl.addEventListener("click", function(e){
  var b = e.target.closest && e.target.closest("button"); if(!b || b.disabled) return;
  audioInit(); snd("ui_tap");
  if(b.id === "sh2Rest"){ restore(); return; }
  if(b.dataset.buy){ var id = b.dataset.buy; lg("iap_view_tap:" + id); purchase(id); }
});
setInterval(function(){ var t = $("sh2Tmr"); if(t && shopOpen()){ var s = t.querySelector("span"); if(s) s.textContent = timeLeft(); } }, 1000);
window.addEventListener("online", function(){ loadPrices(); render(); }); window.addEventListener("offline", render);
function setTab(on){ var s = $("toStore"), hm = $("toHome"); if(s){ s.classList.toggle("on", on); s.setAttribute("aria-current", on ? "page" : "false"); }
  if(hm){ hm.classList.toggle("on", !on); hm.setAttribute("aria-current", on ? "false" : "page"); } }
function openShopScr(){
  if(screen !== "title") return;
  var cm = $("cityMap"); if(cm && !cm.classList.contains("hidden") && $("cmBack")) $("cmBack").click();
  shopEl.classList.remove("hidden"); setTab(true); render(); $("sh2List").scrollTop = 0; lg("iap_view");
}
function closeShopScr(){ if(!shopOpen()) return; shopEl.classList.add("hidden"); setTab(false); }
if($("toStore")){ $("toStore").setAttribute("aria-label", "Shop"); }
// tabs: Shop opens the Shop (only with a store; else the old "coming soon" answer stays), Home closes it, Upgrades leaves it
window.addEventListener("click", function(e){
  var t = e.target && e.target.closest ? e.target : null; if(!t) return;
  if(t.closest("#toStore")){ if(!SHOP_ON) return; e.stopPropagation(); e.preventDefault(); audioInit(); snd("ui_tap"); openShopScr(); return; }
  if(t.closest("#toHome") || t.closest("#toShop") || t.closest("#play")){ closeShopScr(); return; }
  if(t.closest("#ulNoAds")){ e.stopPropagation(); e.preventDefault(); if(noAdsBtnOn()){ audioInit(); snd("ui_tap"); popNoAds("home"); } return; }
}, true);
var show0 = show;
show = function(id){ if(id !== "title") closeShopScr(); return show0.apply(this, arguments); };

// ---- pop-up (No Ads 2a, Thank you 4b)
var popEl = document.createElement("div"); popEl.id = "sh2Pop"; popEl.className = "hidden"; popEl.setAttribute("role", "dialog"); popEl.setAttribute("aria-modal", "true");
document.body.appendChild(popEl);
var X_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="#FFF8E1" stroke-width="4" stroke-linecap="round"/></svg>';
var POP = { kind:null, n:0 };
function popClose(){ popEl.classList.add("hidden"); POP.kind = null; document.body.classList.remove("sh2PopOn"); }
function popNoAds(from){
  if(!SHOP_ON || sh().noAds) return false;
  POP.kind = "noads"; POP.n++; lg("noads_popup:" + from);
  popEl.setAttribute("aria-label", "No Ads");
  popEl.innerHTML = '<div class="sh2Card"><div class="sh2Rib">No Ads</div><button type="button" class="sh2X" data-a="x" aria-label="Close">' + X_SVG + '</button>' +
    '<i class="ico" style="background-image:' + noAdsBg().replace(/"/g, "'") + '"></i><h4>Play with no ads between levels.</h4><p>Bonus videos (free TNT, double coins) stay, only when you tap them. One purchase, forever, on all your devices.</p>' +
    '<button type="button" class="sh2Big" data-a="buy"' + (canBuy("cb.noads") ? "" : " disabled") + ' aria-label="Buy No Ads for ' + (priceOf("cb.noads") || "") + '">' + ptxt("cb.noads") + '</button></div>' +
    '<button type="button" class="sh2Not" data-a="x">Not now</button>';
  popEl.classList.remove("hidden"); document.body.classList.add("sh2PopOn"); return true;
}
function thanks(id){
  var p = PROD[id] || {};
  POP.kind = "thanks"; popEl.setAttribute("aria-label", "Thank you");
  popEl.innerHTML = '<div class="sh2Card"><div class="sh2Rib">Thank you!</div>' +
    (p.coins ? '<img class="pile" alt="" src="' + A[p.coins >= 6000 ? "pile-xl" : p.coins >= 2500 ? "pile-l" : "pile-m"] + '"><div class="amt">+' + fmt(p.coins) + '</div>' : '<i class="ico" style="background-image:' + noAdsBg().replace(/"/g, "'") + '"></i>') +
    (p.b ? '<p>+' + p.b + ' of each booster</p>' : id === "cb.noads" ? '<h4>Ads between levels are off.</h4>' : '') +
    '<button type="button" class="sh2Big" data-a="x">Great!</button></div>';
  popEl.classList.remove("hidden"); document.body.classList.add("sh2PopOn");
}
popEl.addEventListener("click", function(e){
  var b = e.target.closest && e.target.closest("button"); if(!b || b.disabled) return; audioInit(); snd("ui_tap");
  if(b.dataset.a === "x"){ popClose(); return; }
  if(b.dataset.a === "buy" && POP.kind === "noads"){ b.disabled = true; b.textContent = "···"; purchase("cb.noads", function(ok){ if(ok){ popClose(); thanks("cb.noads"); } else popNoAds("retry"); }); }
});

// ---- S3 the Home No Ads button (from L15, not owned, store available)
function noAdsBtnOn(){ return SHOP_ON && !sh().noAds && (save.level | 0) >= 14; }
function syncHome(){ var on = noAdsBtnOn(); H.classList.toggle("sh2na", on); var b = $("ulNoAds"); if(b) b.setAttribute("aria-label", "No Ads"); }
var hl0 = homeLabels; homeLabels = function(){ var r = hl0.apply(this, arguments); syncHome(); return r; };
syncHome();

// ---- S6 Restore in Settings (frame 4c)
(function(){ var c = $("settings") && $("settings").querySelector(".card"), r = $("setReset"); if(!c || !r || $("sh2SetRest")) return;
  var b = document.createElement("button"); b.type = "button"; b.id = "sh2SetRest"; b.textContent = "Restore Purchases"; c.insertBefore(b, r);
  b.addEventListener("click", function(){ audioInit(); snd("ui_tap"); restore(); });
  b.classList.toggle("hidden", !SHOP_ON); })();

// ---- S4 ads: one facade, a stub provider for dev / tests, none in production (no SDK)
var adsNative = function(){ return null; };   // the AdMob / MAX plugin bridge goes here once the SDK + Owner's accounts exist
var ADS = {
  provider: ADSDEV ? "dev" : (ADS_READY && adsNative()) ? "native" : "none",
  log:[],
  rewardedReady:function(){ return ADS.provider !== "none"; },
  showRewarded:function(pl){ ADS.log.push({ t:"rv", pl:pl, lv:levelIdx + 1 }); lg("rv_watch:" + pl);
    if(ADS.provider === "dev") return new Promise(function(res){ setTimeout(function(){ lg("rv_reward:" + pl); res(true); }, 0); });
    var n = adsNative(); return n ? n.showRewarded(pl) : Promise.resolve(false); },
  showInterstitial:function(pl, lv){ ADS.log.push({ t:"int", pl:pl, lv:lv || levelIdx + 1 }); lg("int_show:" + pl);
    if(ADS.provider === "dev") return Promise.resolve(true);
    var n = adsNative(); return n ? n.showInterstitial(pl) : Promise.resolve(false); }
};
var INT_FROM = Math.max(1, +QS.get("intfrom") || 15) - 1;   // interstitials from L15 (index 14); ?intfrom=N is a test knob only (lets a short level run the real path)
var RV_USED = false;          // a rewarded video was watched since the last level start (no interstitial after it)
var DEC = [];
// the interstitial rules of SPEC §5.3, for a result r on level index i
function decide(r, i, now){
  var o = sh(), a = o.ads, why = null; now = now || Date.now();
  if(!r || !r.ok) why = "loss";
  else if(o.noAds) why = "noAds";
  else if(i < INT_FROM) why = "beforeL15";
  else if(FIRST_SESSION) why = "firstSession";
  else if(RV_USED) why = "afterRewarded";
  else if(AFTER_IAP) why = "afterPurchase";
  else if(LEVELS[i + 1] && LEVELS[i + 1].boss) why = "bossIntro";
  else if(a.lastLv != null && i - a.lastLv < 2) why = "gapLevels";
  else if(a.lastT && now - a.lastT < 90000) why = "gap90s";
  var d = { show:!why, why:why || "ok", level:i + 1 }; DEC.push(d); if(DEC.length > 40) DEC.shift(); return d;
}
function maybeInterstitial(r, i){
  var d = decide(r, i); lg("int_decide:" + (i + 1) + ":" + d.why); if(!d.show) return d;
  var o = sh(), a = o.ads, td = today();
  a.lastLv = i; a.lastT = Date.now(); if(a.day !== td){ a.day = td; a.nDay = 0; } a.nDay = (a.nDay | 0) + 1; writeSave();
  ADS.showInterstitial("between_levels", i + 1).then(function(){
    // the auto No Ads pop-up: after the 3rd interstitial of a day, once a day (never after a loss: this path is wins only)
    if(a.nDay >= 3 && a.autoDay !== td && SHOP_ON && !o.noAds && !FIRST_SESSION){ a.autoDay = td; writeSave(); setTimeout(function(){ if(screen === "title") popNoAds("auto"); }, 600); }
  });
  return d;
}
var sl0 = startLevel;
startLevel = function(){ RV_USED = false; AFTER_IAP = false; LOSE.rvUsed = false; LOSE.foShown = false; return sl0.apply(this, arguments); };

// ---- win: rewarded x2 card (5b) from L5 when an ad is ready; it holds the auto return to Home; the interstitial on the way Home
var winEl = document.createElement("div"); winEl.id = "sh2Win"; winEl.className = "hidden"; winEl.setAttribute("role", "dialog"); winEl.setAttribute("aria-label", "Cleared");
document.body.appendChild(winEl);
var WIN = { r:null, n:0, home:false, shown:0, x2:0 };
function winOpen(){ return !winEl.classList.contains("hidden"); }
function winShow(r){
  var n = r.coins | 0; if(n <= 0) return;
  WIN.r = r; WIN.n = n; WIN.home = false; WIN.shown++;
  winEl.innerHTML = '<div class="sh2Card"><div class="sh2Rib">Cleared!</div><img class="pile" alt="" src="' + A["pile-m"] + '"><div class="amt">+' + n + '</div>' +
    '<button type="button" class="sh2Big" data-a="x2" aria-label="Watch a video: double to ' + (n*2) + ' coins">' + PLAY_SVG + '×2 → ' + (n*2) + '</button>' +
    '<button type="button" class="sh2Link" data-a="collect">Collect ' + n + '</button></div>';
  winEl.classList.remove("hidden"); lg("rv_offer:win_x2");
}
function winClose(){ winEl.classList.add("hidden"); var r = WIN.r; WIN.r = null; if(r && lastResult === r && screen === "result") goHome(); }
winEl.addEventListener("click", function(e){
  var b = e.target.closest && e.target.closest("button"); if(!b || b.disabled) return; audioInit(); snd("ui_tap");
  if(b.dataset.a === "collect"){ winClose(); return; }
  if(b.dataset.a === "x2"){ b.disabled = true; var r = WIN.r, n = WIN.n;
    ADS.showRewarded("win_x2").then(function(ok){ RV_USED = true; if(ok && r){ save.coins += n; r.coins = n*2; WIN.x2++; writeSave(); syncCoins(); try{ snd("upgrade"); bumpPill(); }catch(x){} } winClose(); }); }
});
var gh0 = goHome;
goHome = function(){
  if(winOpen()) return;                                          // the x2 card holds the return to Home until it is answered
  var r = lastResult, i = levelIdx, fromRes = screen === "result" && r && !manual;
  if(!winOpen() && popEl.classList.contains("hidden") === false && POP.kind === "noads") popClose();
  var res = gh0.apply(this, arguments);
  if(fromRes) maybeInterstitial(r, i);
  syncHome();
  return res;
};

// ---- lose card: rewarded "+1 TNT Free" (5a) and the Fail Offer (S5)
var LOSE = { rvUsed:false, foShown:false, offers:0 };
var card = $("result") && $("result").querySelector(".card");
var rvBtn = document.createElement("button"); rvBtn.type = "button"; rvBtn.id = "sh2Rv"; rvBtn.className = "big mint hidden"; rvBtn.innerHTML = PLAY_SVG + "+1 TNT Free"; rvBtn.setAttribute("aria-label", "Watch a video: one more TNT, free");
var foEl = document.createElement("div"); foEl.id = "sh2Fo"; foEl.className = "hidden";
if(card && $("rNext")){ card.insertBefore(rvBtn, $("rNext")); card.appendChild(foEl); }
function rvLoseOk(r){ return !!r && !r.ok && !manual && ADS.rewardedReady() && levelIdx >= 4 && !LOSE.rvUsed && canRescue(r) && rescueGap(r) <= 10; }
function foOk(r, rvOn){
  var Lv = LEVELS[levelIdx] || {}, o = sh(), td = today();
  if(!SHOP_ON || !r || r.ok || manual || rvOn || LOSE.foShown) return false;
  if(!(Lv.boss || isHard(Lv))) return false;
  if((bstFailN[levelIdx] || 0) < 2) return false;
  if(!canRescue(r)) return false;
  if(o.fo.day === td && (o.fo.n | 0) >= 3) return false;
  return true;
}
function freeRescue(){ save.coins += RESCUE_COST; rescue(); }   // the existing rescue(): same attempt, rubble stays, +1 TNT, one more wave
function syncLose(){
  var r = lastResult; if(!card || !r || r.ok || screen !== "result") return;
  var rvOn = rvLoseOk(r), next = $("rNext"), resc = $("rRescue");
  rvBtn.classList.toggle("hidden", !rvOn); rvBtn.disabled = !!BUSY;
  if(rvOn){ if(resc) resc.classList.add("hidden"); next.classList.add("sh2Sec2"); lg("rv_offer:lose_tnt"); LOSE.offers++; }
  else next.classList.remove("sh2Sec2");
  var fo = foOk(r, rvOn) || (LOSE.foOn && !rvOn);
  foEl.classList.toggle("hidden", !fo);
  if(fo){ var Lv = LEVELS[levelIdx] || {}; foEl.classList.toggle("boss", !!Lv.boss);
    if(!LOSE.foOn){ LOSE.foOn = true; var o = sh(), td = today(); if(o.fo.day !== td){ o.fo.day = td; o.fo.n = 0; } o.fo.n = (o.fo.n | 0) + 1; writeSave(); lg("fo_offer:" + (levelIdx + 1)); }
    foEl.innerHTML = '<div><b>One more go?</b>+1 TNT now + 1,000 coins</div>' + pbtn("cb.failoffer"); }
}
foEl.addEventListener("click", function(e){
  var b = e.target.closest && e.target.closest("button"); if(!b || b.disabled) return; audioInit(); snd("ui_tap");
  purchase("cb.failoffer", function(ok){ if(!ok) return; LOSE.foShown = true; LOSE.foOn = false; foEl.classList.add("hidden"); freeRescue(); toast("+1,000 coins · +1 TNT"); });
});
rvBtn.addEventListener("click", function(){
  var r = lastResult; if(!rvLoseOk(r)) return; rvBtn.disabled = true; audioInit(); snd("ui_tap");
  ADS.showRewarded("lose_tnt").then(function(ok){ RV_USED = true; LOSE.rvUsed = true; rvBtn.disabled = false; rvBtn.classList.add("hidden"); $("rNext").classList.remove("sh2Sec2");
    if(ok && lastResult === r && phase === "done"){ lg("rv_reward:lose_tnt"); freeRescue(); } else syncLose(); });
});
var sr0 = showResult;
showResult = function(){
  var r = lastResult; LOSE.foOn = false;
  var res = sr0.apply(this, arguments);
  try{
    if(r && !r.ok){ if(LOSE.foShown) LOSE.foShown = false; syncLose(); }
    else { rvBtn.classList.add("hidden"); foEl.classList.add("hidden"); $("rNext").classList.remove("sh2Sec2");
      if(r && r.ok && !manual && levelIdx >= 4 && ADS.rewardedReady() && screen === "result") winShow(r); }
  }catch(e){ console.error("shop result", e); }
  return res;
};
// a rescue (paid or free) leaves the card: its buttons reset with it
var rs0 = rescue; rescue = function(){ var x = rs0.apply(this, arguments); rvBtn.classList.add("hidden"); foEl.classList.add("hidden"); return x; };

window.__blast.shop = {
  on:true,
  flags:function(){ return { iapReady:IAP_READY, adsReady:ADS_READY, iapdev:IAPDEV, adsdev:ADSDEV, shopOn:SHOP_ON, provider:IAP ? IAP.name : "none", ads:ADS.provider, firstSession:FIRST_SESSION }; },
  open:function(){ openShopScr(); return shopOpen(); }, close:closeShopScr, isOpen:shopOpen,
  state:function(){ var cards = [].map.call(document.querySelectorAll("#sh2List [data-card]"), function(c){ var b = c.querySelector(".pb"); return { id:c.dataset.card, label:b ? b.textContent : null, disabled:b ? b.disabled : null, own:!!c.querySelector(".pb.own") }; });
    return { open:shopOpen(), cards:cards, restore:!!$("sh2Rest"), busy:BUSY, prices:Object.keys(PRICES).length, coins:save.coins }; },
  upg:function(){ return UPG.map(function(u){ var c = []; for(var l=0;l<u.max;l++) c.push(u.price(l)); return { id:u.id, name:u.name, max:u.max, costs:c, total:c.reduce(function(a, b){ return a + b; }, 0), level:save.upg[u.id] | 0, locked:upLocked(u) }; }); },
  payout:function(base){ return payout(base); },
  pocket:function(){ return POCKET_LOG.slice(); }, pocketGrant:function(i){ return pocketGrant(i); },
  ent:function(){ var o = sh(); return { noAds:!!o.noAds, starter:!!o.starter, sess:o.sess }; },
  noAdsBtn:function(){ return noAdsBtnOn(); },
  pop:function(){ return { open:!popEl.classList.contains("hidden"), kind:POP.kind, n:POP.n }; }, popNoAds:popNoAds, popClose:popClose,
  win:function(){ return { open:winOpen(), n:WIN.n, shown:WIN.shown, x2:WIN.x2 }; },
  lose:function(){ return { rv:!rvBtn.classList.contains("hidden"), fo:!foEl.classList.contains("hidden"), rvUsed:LOSE.rvUsed, offers:LOSE.offers }; },
  ads:{ provider:function(){ return ADS.provider; }, log:function(){ return ADS.log.slice(); }, decide:function(r, i, now){ return decide(r, i, now); }, decisions:function(){ return DEC.slice(); },
    force:function(pv){ ADS.provider = pv; }, setRv:function(v){ RV_USED = !!v; }, setIap:function(v){ AFTER_IAP = !!v; }, reset:function(){ var a = sh().ads; delete a.lastLv; delete a.lastT; a.nDay = 0; RV_USED = false; AFTER_IAP = false; } },
  fails:function(n){ if(n != null) bstFailN[levelIdx] = n; return bstFailN[levelIdx] || 0; }, resync:function(){ showResult(); return { rv:!rvBtn.classList.contains("hidden"), fo:!foEl.classList.contains("hidden") }; },
  rvLoseOk:function(r){ return rvLoseOk(r); }, foOk:function(r, rvOn){ return foOk(r, rvOn); },
  iap:{ next:function(m){ if(IAP === devProv) devProv.next = m; }, buy:function(id){ return new Promise(function(res){ purchase(id, res); }); }, restore:restore, prices:function(){ return Object.assign({}, PRICES); } },
  log:function(){ return LOG.slice(); }
};
})(); }catch(e){ console.error("main/shop.js", e); }
