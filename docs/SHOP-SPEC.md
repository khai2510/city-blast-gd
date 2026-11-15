# City Blast!: Shop · Upgrades · No Ads, design spec (PROPOSAL, 15/11/2026)

**Status.** Approved by Owner (D-blast-SHOP, 15/11/2026) and **built** in the main build (step `shop`). What is in, what is behind flags and what Owner must still do: see **§9 Implemented** at the end.
- D-blast-NONEW: every new element needs Owner's D-xxx.
- D-blast-FIGMAFIRST: Figma comes first.

**Research.** `games/blast/research/monetization/SF-SHOP-UPGRADES-NOADS.md`.

**Figma.**
- File `<figma-file>`, page **"Shop · Upgrades · No Ads (15/11)"** = node `131:2`.
- Link: (Figma file, private)

**Exports.**
- PNGs of every assembled frame are in this folder, at 1×: 393 × 852, and 393 × 2056 for the full scroll.
- `shop-sheet.jpg` is the contact sheet.

**Kit reused**
- "Home elements (14/11)":
  - E5 tab bar
  - E6 tab icons `96:2`…`96:63`
  - E7 coin / top bar
  - E8 No Ads icon (image hash `3d1f5ab3…`)
  - Home preview `92:19`
- "Intro cards premium (14/11)":
  - Card / Frame `97:111`
  - Card / Header Ribbon `97:98`
  - Button / Go Glossy `97:108`
  - FX / Glow Rays `97:29`
  - FX / Sparkle Burst `97:51`
- "Booster Intro (13/11)":
  - Icon / Wrecking Ball `83:9`
  - Icon / Safety Net `83:14`
  - BG / L1 gameplay `79:2`
- Colours are bound to the local **CityBlast** variables (`ui/go/*`, `ui/gold/*`, `ui/header-blue/*`, `ui/cream/*`, `ui/hard/*`, `ui/text/*`, `ui/danger/*`, `ui/disabled/*`).
- Type: **Lilita One** (titles, amounts, prices) and **Nunito** Black / ExtraBold / Bold (labels and body, ≥ 16 px; badges are 14 px caps, the only exception).

**Device.** 393 × 852 (iPhone 15/16 Pro).
- Safe area top **59** (status bar + Dynamic Island) and bottom **34**. Each frame has a hidden layer "guides: safe area top 59 / bottom 34".
- Tab bar = 90 + 34 = 124 at y 728.
- All tap targets are ≥ 48 px.

---

## 1. Assembled frames

| # | Frame | Node | What it shows |
|---|---|---|---|
| 1a | Shop · first screen | `137:1493` | Header, Starter Pack, No Ads card, Coin Packs start, scroll fade, tab bar (Shop active) |
| 1b | Shop · full scroll (393 × 2056) | `137:650` | Starter → No Ads → Coin Packs ×5 → Booster Bundles ×3 → Restore Purchases → footnote |
| 2a | No Ads pop-up | `140:2288` | Over Home: scrim, glow rays, ribbon "No Ads", 120 px icon, copy, $6.99, "Not now", ✕, trigger note |
| 2b | Home · No Ads button (from L15) | `140:2187` | Today's Home (Daily / Map still hidden per ADOPT) + the No Ads button in the E8 slot + rule note |
| 3 | Upgrades | `140:1965` | 5 upgrade rows (2 tagged "needs Owner OK"), header, tab bar (Upgrades active) |
| 4a | Purchase · pending | `141:2226` | Our row in Pending + the **system** App Store sheet (placeholder; we do not design it) |
| 4b | Purchase · success | `141:2939` | "Thank you!" card, XL coin pile, "+3,800", "Great!" |
| 4c | Settings · Restore Purchases | `141:3157` | Settings card: Music / Sound / Haptics, **Restore Purchases**, Terms · Privacy · Support, toast "Restored: No Ads" |
| 5a | Lose · rewarded continue | `141:3282` | "So close!" 82 % / PASS 85 %, **"▶ +1 TNT Free"** (rewarded), "Try Again" |
| 5b | Win · double coins | `141:3324` | "Cleared!" +20, **"▶ ×2 → 40"** (rewarded), "Collect 20" |
| 6 | Pricing table + economy check + entry points | `143:3872` | The tables of §3–§5 below |

## 2. Components (page `131:2`)

| Component | Node | Size | Variants / props | Notes |
|---|---|---|---|---|
| Shop / Coin | `131:5` | 40 × 40 | — | Vector gold coin (E7 colours). Children scale. |
| Shop / Coin Pile | `131:189` | 112 × 88 | Size = S `131:9` · M `131:23` · L `131:57` · XL `131:111` | S = $1.99, M = $4.99, L = $9.99–19.99, XL = $49.99 and big bundles. A vector stand-in: swap for a 3D render at the same size later. |
| Shop / Price Button | `131:211` | 124 × 52, r 26 | State = Normal `131:190` · Pressed `131:192` (lip 4 → 1) · Ad `131:194` (▶ icon) · Coins `131:199` (gold, coin icon) · Purchased `131:205` (grey, ✓ "Owned") · Pending `131:209` ("···"); TEXT prop **Label** | Label = StoreKit `displayPrice`, never hardcoded. Green = real money **and** "Free (ad)"; gold = coins. |
| Shop / Badge | `131:225` | hug, h 27 | Type = Best value `131:212` (orange) · Popular `131:214` (purple) · Bonus `131:216` (gold) · Timer `131:218` (ink + clock) · One-time `131:223` (blue); TEXT prop **Label** | Max 1 per card, max 2 per screen. The timer shows real remaining time only. |
| Shop / Section Header | `131:226` | 345 × 52 | TEXT prop **Title** | Blue ribbon with notched tails (SF pattern, our Card / Header Ribbon colours). |
| Shop / Booster Tile | `131:265` | 64 × 64, r 14 | TEXT **Count** ("×3"), INSTANCE_SWAP **Item** (Wrecking Ball `83:9` / Safety Net `83:14` / +1 TNT `131:234`) | Used in bundles and the Starter Pack. |
| Icons | `131:234` +1 TNT · `131:241` Power · `131:245` Coin Bonus (magnet) · `131:249` Slow-mo · `131:256` No Ads (vector) · `131:261` Restore | 48 × 48 | — | The first four come from the game's SVG symbols (`u-plus-charge`, `u-power`, `u-magnet`, `u-slowmo` in `index.html`). |
| Shop / Coin Pack Row | `133:239` | 345 × 84, r 20 | State = Normal `133:140` · Best value `133:159` (gold frame + badge) · Pending `133:220` | Pile · amount (Lilita 30) · one line (Nunito ExtraBold 16: "coins" / "+27% bonus") · price. Consumable: no Purchased state. |
| Shop / Bundle Card | `133:496` | 345 × 176 | State = Normal `133:240` · Best value `133:324` (gold + "POPULAR") · Purchased `133:410` | Cream top (coins + 3 tiles), blue name band, price right. Purchased only for limited bundles. |
| Shop / No Ads Card | `133:511` | 345 × 148 | State = Normal `133:497` · Purchased `133:503` | Copy: "No more ads between levels. Bonus videos stay: you choose." / Owned: "Thanks! Ads between levels are off on this Apple ID." |
| Shop / Special Offer Card | `133:696` | 345 × 206, r 22 | State = Normal `133:512` · Purchased `133:603` | Purple Hard palette + gold frame, "Starter Pack", 1,200 coins + Ball / Net / +1 TNT ×2, Timer badge, ONE-TIME badge, $2.99. |
| Upgrades / Upgrade Card | `133:788` | 345 × 104 | State = Affordable `133:697` · Too few coins `133:721` (price at 55 %, ink not red) · Maxed `133:746` ("✓ MAX") · Proposal `133:765` (red tag "NEW MECHANIC · needs Owner OK") | Icon well 72 · name Lilita 24 · effect "now → next" Nunito ExtraBold 16 · level pips · coin price 92 wide. |
| Home / No Ads Button | `135:564` | 76 × 96 | State = Visible `135:549` · Sale `135:554` (Timer badge) | E8 bubble + E8 icon + "No Ads" tag (16 px). Hidden is a state of the screen, not a variant. |
| Screen Header | `135:565` | 393 × 72 at y 59 | TEXT **Title**, **Coins** | Title left (Lilita 38); coin pill right (no "+" inside the Shop). |
| Tab Bar | `135:748` | 393 × 124 | Active = Shop `135:578` · Home `135:646` · Upgrades `135:689` | E5 bar at 393 wide. The game draws E6 v2 3D rasters; vectors are stand-ins. |

## 3. Pricing proposal (US tiers; localized prices come from StoreKit)

| Product id (suggested) | Type | Price | Contents | Coins / $ | Badge |
|---|---|---|---|---|---|
| `cb.coins.600` | consumable | $1.99 | 600 coins | 302 | — |
| `cb.coins.1700` | consumable | $4.99 | 1,700 (+13 %) | 341 | — |
| `cb.coins.3800` | consumable | $9.99 | 3,800 (+27 %) | 380 | POPULAR |
| `cb.coins.8500` | consumable | $19.99 | 8,500 (+42 %) | 425 | — |
| `cb.coins.24000` | consumable | $49.99 | 24,000 (+60 %) | 480 | BEST VALUE |
| `cb.bundle.small` | consumable | $4.99 | 1,000 + Ball / Net / +1 TNT ×2 | ≈ 340* | — |
| `cb.bundle.builder` | consumable | $9.99 | 2,500 + ×4 each | ≈ 390* | POPULAR |
| `cb.bundle.mega` | consumable | $19.99 | 6,000 + ×10 each | ≈ 475* | — |
| `cb.starter` | non-consumable | $2.99 | 1,200 + ×2 each; shown from L10, 48 h after first view, once | ≈ 635* | ONE-TIME + timer |
| `cb.noads` | non-consumable | $6.99 | removes interstitials; rewarded stays | — | — |
| `cb.failoffer` (optional, Owner) | consumable | $4.99 | +1 TNT now + 1,000 coins, Hard/Boss lose only | — | — |

\* Boosters are valued at shop price per use: Ball 120, Net 100, +1 TNT 130 (index.html `BOOSTERS`: 360 / 300 / 390 per pack of 3).

**Smash Fest US for reference:**

| Smash Fest IAP | Price |
|---|---|
| Coins 1,000 / 5,000 / 10,000 / 25,000 / 50,000 | $1.99 / 7.99 / 14.99 / 29.99 / 54.99 |
| Bundles | $9.99 / 19.99 / 39.99 |
| Fail Offer | $4.99 |
| No Ads | $9.99 |

Smash Fest prices are cheaper per coin because it earns 20 / 50 / 100 per win.

## 4. Economy sanity check (D-blast-COIN 10 / 20 / 30)

**Income.** First-try wins on L1–36 pay about **570 coins**: 21 × 10 + 9 × 20 + 6 × 30 = 570.
- The tiers come from `levels-v5.json`: 6 bosses, and Hard is assumed to be H + SH.
- That averages ≈ 16 per level, or ≈ 1,140 if the player takes ×2 rewarded on every win.

**$1.99 = 600 coins ≈ 60 normal wins ≈ all of L1–36.** Smash Fest's $1.99 = 50 wins. The ratio matches.

**One booster use = 100–130 coins ≈ 7–13 normal wins.** That is a premium, not a wall. Smash Fest's continue costs 45 wins.

**Upgrades today are too slow.**
- `UPG` in `index.html` costs 14,085 coins to max:

  | Upgrade | Cost to max |
  |---|---|
  | Power | 4,120 |
  | Magnet | 7,135 |
  | Slow-mo | 1,660 |
  | +1 Charge | 1,170 |

- That is ≈ 25× the L1–36 income, about 900 levels.
- **Proposal:**
  - Power and Slow-mo cost `40 × 1.4^l` (40, 55, 80, 110, 155, 215, 300, 420).
  - Starting TNT costs 250 / 600.
  - Coin Bonus costs 50 / 70 / 100 / 140 / 195.
  - Total ≈ 3,400 ≈ 6× L1–36 income, about 200 levels.

**Bug-level finding.**
- **Coin Magnet has no effect today.** `main/tap2.js` R3 sets the win reward to a flat 10 / 20 / 30, so `coinMul()` no longer reaches the payout.
- **Fix (needs Owner's OK, rule change):** Coin Bonus +10 % per level, applied to the win reward and rounded up. At max that is 15 / 30 / 45.

## 5. Behaviour

### 5.1 Shop (frames 1a / 1b)
- **Tab.** Shop is the left tab. Until the Shop is approved and built, the tab keeps today's ADOPT behaviour (hidden "coming soon" buttons).
- **Order.** Starter Pack (only if eligible) → No Ads (only if not owned; when owned it shows Purchased once, then moves to the bottom) → Coin Packs → Booster Bundles → Restore Purchases → footnote.

**Purchase tap**
1. The row goes to **Pending** and all price buttons are disabled (no double buy).
2. The **system** App Store sheet opens (frame 4a).
3. On a **verified** transaction:
   - grant the items;
   - save;
   - `finish()`;
   - show success (frame 4b) with coins flying to the pill (existing `coin_burst` sound + haptic `upgrade`).
4. On cancel: back to Normal with no message.
5. On error: toast "Purchase didn't go through. You weren't charged." (Nunito Black 16, ink pill, 2.5 s).

**Other rules**
- **Coins in the header** update after the grant animation lands.
- **Offline.** Price buttons show "—" and are disabled. A banner says "Connect to the internet to shop". Upgrades still work.

### 5.2 No Ads (frames 2a / 2b)
**What it removes:** interstitials only. Rewarded buttons stay, because the player chooses to watch them.

**Home button (Home / No Ads Button)**
- In the E8 slot, top-right under the top bar, at x 300, y 210 on Home.
- **Hidden before L15** and after purchase.
- Visible from L15. The first interstitial also plays at L15, so the button never promises something the player hasn't met.
- The **Sale** state is used only with a real StoreKit promotional price.

**Pop-up (2a) opens from**
- the Home button;
- the Shop No Ads card;
- auto after the **3rd interstitial in a day**, max one auto open per day, never right after a loss, never in a player's first session.

**Pop-up copy**
- Title "No Ads".
- "Play with no ads between levels." / "Bonus videos (free TNT, double coins) stay, only when you tap them. One purchase, forever, on all your devices."
- Buttons: "$6.99" · "Not now" · ✕.

### 5.3 Ads (frames 5a / 5b)

**Interstitial**
- From L15, only after a **win** (between levels).
- At least 2 levels and 90 s since the last ad.
- Never after a rewarded video or an IAP, never during the first session, never for No Ads owners.
- Never on a Boss intro.

**Rewarded "+1 TNT Free" on the lose card (5a)**
- Only when the attempt ended within 10 points of PASS. Max 1 per attempt, from L5.
- Hidden when no ad is loaded, and "Try Again" becomes primary.
- No coin price, no life lost (keeps today's kind lose card).

**Rewarded "×2 coins" on the win card (5b)**
- From L5, when an ad is loaded.
- "Collect N" is always shown.

**ATT**
- Ask through Apple's App Tracking Transparency prompt, with a pre-prompt screen, **before the first ad request**, at the earliest after L5 (not on first launch).
- If the player refuses, use non-personalised ads.

### 5.4 Upgrades (frame 3)
**Layout.** One row per upgrade with the effect as "now → next". That replaces the 4-up grid with 8 dots.
- Too-few-coins rows: price button at 55 % in ink, never red.
- Max rows: "✓ MAX".

**Proposed set.** None needs a new mechanic except #4.
1. **Blast Power.** Exists as `power`: +8 % blast per level, 8 levels.
2. **Starting TNT.** Exists as `charge` (+1 Charge): +1 TNT per level, 2 levels.
3. **Coin Bonus.** Exists as `magnet`. It needs a **rule change**: apply it to the win reward → *needs Owner OK*.
4. **Booster Pocket.** A free booster use on each Hard/Boss level, 3 levels → **new mechanic, needs Owner OK**.
5. **Slow-mo.** Exists as `slowmo`. Keep it, or drop it from the screen if Owner wants 4 rows.

Rejected: "Blast radius" (already inside Power: `r: 1 + 0.03 × l`). "Offline earnings" and "ball count" don't fit and would be new systems.

### 5.5 Restore (frame 4c + Shop footer)
- A "Restore Purchases" button sits in Settings and at the bottom of the Shop.
- It calls `AppStore.sync()` (or RevenueCat `restorePurchases()`).
- Success toast: "Restored: No Ads" (and "Starter Pack" if owned).
- Nothing found: "Nothing to restore on this Apple ID".

## 6. Apple rules that matter (App Review Guidelines / StoreKit)
1. **3.1.1 In-App Purchase.** Coins, boosters, No Ads and the Starter Pack are digital goods, so StoreKit IAP is the only allowed payment. No external links or buttons to other payment.
2. **Restore.** Non-consumables (No Ads, Starter) need a visible **Restore Purchases** control. Ours is in the Shop footer and Settings.
3. **No misleading prices.**
   - Show the price StoreKit returns (`displayPrice`, localized) on every button.
   - Badges must be true: the bonus % is computed from coins / $, and "BEST VALUE" goes on the highest coins / $.
   - Timers must be real.
   - No struck-through "was" prices unless that price really existed.
4. **Consumables must not be lost.** Grant only after a verified transaction, persist, then finish. Recover unfinished transactions on launch (`Transaction.updates`).
5. **Loot-box odds (3.1.1).** Not applicable: we sell no random items. Keep it that way.
6. **Ads.**
   - Ads must not imitate system UI or the game's own buttons.
   - Rewarded buttons must say they play an ad (▶ icon + "Free").
   - Declare ad data in the App Privacy "nutrition label".
   - **ATT** before IDFA (5.1.2).
   - The age rating gets "Contains Ads".
7. **Kids.** We are 4+ but not in the Kids category. Keep it that way, or ads and IAP rules tighten (1.3).
8. **Store listing.** List the IAPs in App Store Connect with review screenshots, and keep the in-app names identical.

## 7. Implementation outline (outline only, not built)
- **IAP.** RevenueCat Capacitor plugin (`@revenuecat/purchases-capacitor`) on top of StoreKit 2.
  - Products in App Store Connect plus a RevenueCat "default" offering. No Ads = entitlement `no_ads`; Starter = entitlement `starter`.
  - Consumables are granted client-side in `save.coins` / `stock` after `purchasePackage()` resolves, keyed by transaction id so nothing is granted twice.
  - Prices come from `offerings.current.availablePackages[].product.priceString`.
  - RevenueCat is free under its revenue threshold. **Account creation and any paid plan are Owner's (§3 / Group C).**
- **Ads.** AdMob (`@capacitor-community/admob`) or AppLovin MAX (via a community Capacitor plugin or a small native bridge).
  - **MAX** gives bidding across networks (better eCPM for hybrid-casual).
  - **AdMob** is simpler to start with.
  - Both need the SKAdNetwork IDs in Info.plist, the ATT `NSUserTrackingUsageDescription`, and a UMP/consent flow for the EU.
  - One `ads.js` facade:
    - `ads.canShowInterstitial(ctx)` holds the rules in §5.3;
    - `ads.showRewarded(placement)` returns a Promise<boolean>.
- **Flags.** Everything behind `?shop=1` / a remote flag until approved. The current "coming soon" buttons stay hidden (ADOPT 3).
- **Analytics** to add with it:
  - `iap_view`, `iap_start`, `iap_success`, `iap_cancel`;
  - `rv_offer`, `rv_watch`, `rv_reward`;
  - `int_show`;
  - `noads_popup`.
- **Tests (when built):**
  - a locked test that the Restore button is visible in Shop and Settings;
  - no interstitial before L15 or after a loss;
  - No Ads owner sees zero interstitials and still sees the rewarded buttons;
  - prices are rendered from the product list, not constants.

## 8. Decisions for Owner (proposal → D-xxx)
1. Build the Shop (frames 1a/1b) with the 11 SKUs of §3, or start with coins + No Ads only?
2. No Ads price **$6.99** (vs Smash Fest's $9.99), with the Home button from L15?
3. Interstitial rules of §5.3 (L15+, after wins only)?
4. Rewarded placements: +1 TNT on the lose card and ×2 coins on the win card?
5. Reprice Upgrades to the ≈ 3,400 curve, and apply Coin Bonus to the win reward (rule change)?
6. Booster Pocket upgrade (new mechanic): yes or no?
7. Optional Fail Offer $4.99 on Hard/Boss lose cards: yes or no?
8. Create the App Store Connect IAP products and the RevenueCat / AdMob / MAX accounts (Owner only).

## 9. Implemented (15/11/2026, build step `shop`, D-blast-SHOP)

**Where.** `games/blast/main/shop.js` (all logic and style) + `main/shop-patch.js` (appends it at the end of `main()`, inlines the Figma SVGs from `design/shop/assets/`). Step 29 in `node games/blast/tools/build-main.js --list`, after `studio`. One line in `main/tap2.js` (R3): the win reward goes through `window.__blast.tap2.payout` when it is set. `?shop2=0` = the old screens (no hook = flat 10 / 20 / 30).

**Flags.**

| Flag | Default | What it does |
|---|---|---|
| `IAP_READY` (build constant; `SHOP_IAP_READY=1 node tools/build-main.js`) | **false** | Real-money UI. While false (and no `?iapdev=1`) every real-money control is **hidden**: Shop tab keeps the "coming soon" toast, no No Ads Home button / pop-up, no Fail Offer, no Restore row. Hidden, not disabled, because App Review 2.1 (completeness) rejects purchase buttons that cannot complete, and 3.1.1 wants every price to come from StoreKit. Coin-priced Upgrades work fully. When true, the store is the RevenueCat Capacitor plugin (`Capacitor.Plugins.Purchases`), only on native; no plugin = still hidden. |
| `ADS_READY` (build constant; `SHOP_ADS_READY=1`) | **false** | Ad provider. While false there is no provider: both rewarded buttons are hidden and interstitials are a no-op (the rules still run and log their decision). |
| `?iapdev=1` | off | Simulated store: prices = §3 US table, purchases succeed after 0.45 s, the "Apple ID" is `localStorage["cityblast.iapdev.owned"]` (survives a save wipe, so Restore can be tested). Tests can force `cancel` / `error` / `slow` with `__blast.shop.iap.next(m)`. |
| `?adsdev=1` | off | Stub ad provider: rewarded and interstitial "play" instantly (logged in `__blast.shop.ads.log()`). |
| `?intfrom=N` | 15 | Test knob only: moves the "interstitials from L15" gate (the check runs the real interstitial path on L5; L15 is two waves, ~15 min in software GL). |
| `?shop2=0` | — | Nothing from this step runs. |

**What is in.**
- **Shop** (Shop tab, a layer over Home under the tab bar, Shop tab active): Starter Pack (from L10, a real 48 h timer from the first view, once; Owned for the rest of that session, then gone) → No Ads (moves to the bottom as Owned when bought) → Coin Packs ×5 → Booster Bundles ×3 → Restore Purchases → footnote. One price button per card (124 × 52), labels from the product list (never constants), Pending "···" with every price button disabled, "Thank you!" card, error toast "Purchase didn't go through. You weren't charged.", offline banner + "—". Grants are keyed by transaction id (never twice) and saved before the card shows.
- **Bonus % and BEST VALUE are computed** from coins / price (App Review: badges must be true). With the US prices that gives **+13 / +26 / +41 / +59 %** (the frames say 13 / 27 / 42 / 60; those were rounded against 300 coins/$). BEST VALUE = highest coins / $ (24,000).
- **Bundles and Starter give Wrecking Ball / Safety Net / Sky Strike.** The frames show "+1 TNT" as the third tile, but this build's tray is `wreck / net / sky` (the +1 TNT booster `tnt1` is not in the TNT-only tray); "do not invent new boosters", so the third item is the game's third booster, Sky Strike, with its own icon. Change if Owner wants otherwise.
- **Upgrades**: one row per upgrade (Figma Upgrade Card), "now → next", pips, gold coin button (≥ 44 px; the Figma 38.6 px was raised), too-few-coins 55 % ink, ✓ MAX. Curve: Blast Power 40 / 55 / 80 / 110 / 155 / 215 / 300 / 420; Starting TNT 250 / 600; Coin Bonus 50 / 70 / 100 / 140 / 195; Slow-mo 40 / 55 / 80 / 110 / 155 / 215 → **3,435** for the four; **Booster Pocket 150 / 250 / 400** (+800, its own row, locked "Lv.11" until the first booster is unlocked). Old saves: Coin Magnet levels above 5 are capped at 5.
- **Coin Bonus** (was Coin Magnet): win reward × (1 + 0.1 × level), rounded up → max 15 / 30 / 45. A loss still pays 0.
- **Booster Pocket**: level *n* gives *n* free booster uses the first time each Hard / Boss level is opened (Home Play, map, next, try again all go through `bstPlay`), put into the existing booster stock (spread over the unlocked boosters, least-owned first), so the existing pre-level offer shows and spends them. Toast "Booster Pocket: +1 Wrecking Ball".
- **No Ads**: Home button in the E8 slot from **L15** (level index ≥ 14), hidden when owned or when there is no store. Pop-up 2a (from the button, the Shop card, and auto after the 3rd interstitial of a day, once a day, never after a loss, never in the first session). Restore in the Shop footer and in **Settings** (blue pill above "Restart from Level 1"). "Restart from Level 1" keeps entitlements.
- **Rewarded** (facade `ADS.showRewarded(placement)`): lose card "▶ +1 TNT Free" (from L5, within 10 points of PASS and `canRescue`, once per attempt) = the existing `rescue()` for free, Try Again becomes a quiet link and the coin rescue is hidden while it shows; win "▶ ×2 → 2N" card (from L5) that holds uiclean's auto return to Home until "×2" or "Collect N" is tapped.
- **Interstitial** (on the way Home after a **win** only): from L15, ≥ 2 levels and ≥ 90 s since the last, never after a rewarded video or a purchase in that level, never in the first session, never before a Boss level, never for No Ads owners.
- **Fail Offer $4.99** (+1 TNT now + 1,000 coins): Hard / Boss lose card, only when the rewarded button is not shown, from the 2nd fail of that level, only when one more TNT can still fix it, max 3 shows a day.
- **Save**: `save.shop = { noAds, starter, starterT, txn{}, pk{}, ads{lastLv,lastT,day,nDay,autoDay}, fo{day,n}, sess }`, `save.upg.pocket`.
- **Not built**: ATT pre-prompt (native, comes with the ad SDK), analytics events (logged locally in `__blast.shop.log()` only), the Sale state of the No Ads button (needs a real StoreKit promo).

**Checks.** `ONLY=shop node games/blast/main/check-main.js` (SH1–SH16) — screenshots `checkpoints/main-shots/shop-*.png`.

**For real purchases and ads (Owner, group C).**
1. App Store Connect: create the 11 IAP products with the ids of §3 (`cb.coins.600` … `cb.noads`, `cb.starter`, `cb.failoffer`), prices, review screenshots; sign the Paid Apps agreement + banking/tax.
2. RevenueCat: project + App Store app (shared secret / In-App Purchase key), entitlements `no_ads` (← `cb.noads`) and `starter` (← `cb.starter`), a "default" offering with every product as a package.
3. Then a release task (not Owner): add `@revenuecat/purchases-capacitor`, configure it natively with the RevenueCat public key, build with `SHOP_IAP_READY=1`.
4. Ads: AdMob or AppLovin MAX account + ad units, then add the SDK (SKAdNetwork ids, `NSUserTrackingUsageDescription`, ATT pre-prompt, UMP consent), wire `adsNative()` in `main/shop.js`, build with `SHOP_ADS_READY=1`, and update the App Privacy label / "Contains Ads".
