# City Blast! vs Smash Fest: real screenshots, screen by screen + visual (13/11/2026, afternoon)

This replaces the SF side of two morning reviews, `SCREENS-H2H-SF-2026-11-13.md` (UX, 15 screens) and `VISUAL-H2H-SF-2026-11-13.md` (visual). It is one combined review. **Every SF image here is a real screenshot.** Owner supplied 53 of them in `research/smashfest-scan/shots/`. No diagrams are used.

Phone page (Vietnamese, internal only): `real/index.html`. Images: `real/*.jpg`, with ours on the left and SF ("ẢNH THẬT") on the right.

## 0. Method and evidence

**SF.** There are 53 PNG shots. The file names describe each one, and 52 are usable (`cannot-find-app-library-games.png` is an iOS screen).
- They come at four sizes: 410×911 and 342×759 video frames, 205×455 / 171×380 thumbnails, and 182–319 px wide iPhone-Mirroring captures with the phone bezel (`prev-*`).
- For measurement, each shot was cropped to the screen (the bezel removed on `prev-*`) and rescaled to 390 px wide.
- Point sizes are therefore ±5 %. On the small thumbnails, read them as ±10 %.
- The mouse cursor seen in `prev-*` comes from iPhone Mirroring, not from the game.

**Ours.** These are from the current main build `checkpoints/index-main.html`. It was served from `games/blast/checkpoints` with `python3 -m http.server` on 127.0.0.1. Capture used Playwright `chromium.launch()` at 390×844, DPR 2, with touch. Libs came from `BLAST_LIBS`.
- **The build changed while I worked** (another agent rebuilt it). Two builds appear in the images:
  - **Build A** = commit `6e897884` (file 10:30 UTC: boss orange, meter orange/gold, Level button visible), captured 15:05–15:24. It covers Home, pre-level Hard and Boss, Hard/Boss HUD, Upgrades, Shop toast, Settings and the L1 placing → collapse → lose frames.
  - **Build B** = the WIP rebuild on disk from about 15:25 (`3ec5b6cf` "intro system"; the file was rewritten again at 15:39 and is uncommitted). It covers the L1 win run (`oursL1w`), the L2 lose card and the booster "Unlocked!" card.
  - Build B adds two things not in A: locked booster chips "Lv.31 / Lv.21 / Lv.11" in the tray from L1, and a full-screen "X Unlocked!" card.
- **Moments.** L1 uses the game-time method (`tools/capture-gametime.js` idea). The clock is paused and the game is stepped 100 ms per frame, so the explosion, collapse and win frames are exact game times and do not depend on how slow this VM is.
- **Timings (game time, L1).** Tap Play → plan in 0.7 s. BLAST → verdict in 5.3 s (win, 96 %). Result → Home by itself in 2.2 s.
- **Not caught.** The CSS win stamp (Q7) is not visible in the game-time frames, because CSS animations run on real time. The morning capture did catch it (`screens/10-win.jpg`).
- **Expert plan lost once.** On build A, the L1 expert plan, placed in two steps (half, then all), lost at 53 %. On build B, placed in one step, it won at 96 %. This was noted, not investigated.
- **Booster card not shown from a seeded save.** A save seeded past L10 does not show the booster card at the next level start (stock stays 0) on build A. Build B showed it at L11.
- Nothing in the game was edited.

**Measurements.** All are taken on the whole screen at 390 px wide.
- k-means palette (k = 6, CIELAB), with % share.
- HSV mean saturation S and value V.
- Subject separation: ΔE (CIELAB) between the median of the subject box and the median of a ring 6 % wider around it.
- VFX coverage: the envelope of the effect boxes as a % of the screen. Boxes were set by hand on gridded frames.
- UI counts and sizes come from a DOM census (ours) and pixel boxes (SF).

## 1. Summary

Scores are /5. UX = flow, count, words, button, hierarchy, timing. Vis = palette, light, separation, VFX, outline/bevel, font. "13/11 am" is the shared-screen score from the morning review, where it existed.

| # | Screen | Us UX | Us Vis | **Us** | SF UX | SF Vis | **SF** | 13/11 am (us / SF) |
|---|---|---|---|---|---|---|---|---|
| 1 | Home | 3.5 | 3.5 | **3.5** | 4.5 | 4.5 | **4.5** | 3.8 / 4.0 |
| 2 | Pre-level popup (normal + Hard) | 4.0 | 3.5 | **3.8** | 4.5 | 4.5 | **4.5** | 3.7 / 3.8 (with 06) |
| 3 | Loading | 4.5 | 3.5 | **4.0** | 3.0 | 4.0 | **3.5** | — |
| 4 | Level open / FTUE first tap | 3.5 | 3.0 | **3.3** | 4.5 | 4.5 | **4.5** | — |
| 5 | HUD in play | 3.0 | 3.5 | **3.3** | 5.0 | 4.5 | **4.8** | 3.3 / 4.5 |
| 6 | Shot / placing | 3.5 | 3.5 | **3.5** | 4.5 | 4.0 | **4.3** | 3.7 / 4.1 |
| 7 | Hit and explosion | 4.0 | 3.5 | **3.8** | 4.0 | 3.5 | **3.8** | 3.8 / 4.5 (with 08) |
| 8 | Collapse with camera | 4.0 | 4.0 | **4.0** | 4.0 | 4.0 | **4.0** | (see 7) |
| 9 | Win and coins | 3.5 | 3.0 | **3.3** | 4.5 | 5.0 | **4.8** | 3.5 / 4.0 |
| 10 | Lose / continue (+ SF interstitial) | 4.0 | 3.5 | **3.8** | 3.0 | 4.0 | **3.5** | 3.7 / 3.3 |
| 11 | Shop | 1.5 | 2.5 | **2.0** | 4.0 | 4.0 | **4.0** | 1.5 / 3.9 |
| 12 | Settings / profile | 3.5 | 3.5 | **3.5** | 4.0 | 4.0 | **4.0** | 3.8 / 3.4 |
| 13 | NEW obstacle card | 2.0 | 3.5 | **2.8** | 4.5 | 4.5 | **4.5** | 3.7 / 3.8 |
| 14 | Booster unlock tutorial | 3.0 | 3.5 | **3.3** | 4.5 | 4.5 | **4.5** | 3.8 / 3.5 [I] |
| | **Average** | **3.39** | **3.39** | **3.4** | **4.18** | **4.25** | **4.2** | 3.4 / 3.9 (shared 12) |

**Short answer.** With real SF images, the gap is wider than this morning: **3.4 vs 4.2** (it was 3.4 vs 3.9). The morning review gave SF inferred mid scores (3.3–3.5) on screens it had not seen. Settings, the unlock card, the booster tutorial and the win are all better in reality. We still win on Loading (we have none) and Lose (kinder). We tie on Hit and on Collapse, where our camera move is better than SF's static camera.

**The 5 biggest gaps** (difference in score):
1. **NEW obstacle card** (−1.7). SF introduces each new object with a full-screen card (L6 Box, L21 Stone). We have no material card at all.
2. **Shop** (−2.0). SF has 3 bundles and 6 coin packs. Ours is a "coming soon" toast.
3. **HUD in play** (−1.5). We show 9–10 items on L1 and 15+ on Boss L10. SF shows 2 at every level.
4. **Win and coins** (−1.5).
   - SF: logo drop + fireworks + confetti (VFX envelope 63 % of the screen) + "+20" + coins flying to the pill.
   - Ours: a coin stream, 3.7 % of the screen.
5. **FTUE first tap** (−1.2) and **booster tutorial** (−1.2).
   - SF dims the scene (V 0.54) and spotlights the target with 5 words.
   - SF teaches the booster inside the pre-level popup with a bubble, an arrow and a "Free" tag.

## 2. Measured, side by side

| Moment | Side | S | V | Subject ΔE | VFX % | Top palette (k=6, share) |
|---|---|---|---|---|---|---|
| Home | us L1 | 0.57 | 0.76 | — | — | #65b6ed 24 · #726a65 20 · #e2e4db 18 · #192761 16 · #f2a930 14 · #5bc031 8 |
| | SF L23 | 0.69 | 0.89 | — | — | #efbd50 32 · #51b9fa 31 · #cb7d40 13 · #c2d4c3 9 · #1359d3 9 |
| Pre-level Hard | us L7 | 0.48 | 0.55 | — | — | #3f4d6e 26 · #74634d 23 · #241f44 21 · #fbf2df 18 · #90c839 6 · #782bc3 5 |
| | SF L20 | 0.74 | 0.55 | — | — | #071d39 29 · #891fb6 23 · #f5e6df 16 · #35200f 16 · #cfc51d 9 |
| Loading | us iris | 0.52 | 0.68 | 5.8 | — | #83c143 · #1d1617 · #ebb357 · #d0dfc9 |
| | SF | 0.98 | 0.81 | — | — | #003daf 44 · #0088f6 33 · #0064cf 16 · #f4a216 3 |
| FTUE L1 | us | 0.55 | 0.81 | 6.9 | — | #83c143 31 · #78b6ea 20 · #ebb357 18 · #cddfce 15 · #99683b 12 |
| | SF (dimmed) | 0.59 | 0.54 | 37.5 | spot ≈ 9 | #83673b 59 · #2b6087 20 · #f7e4c6 6 |
| HUD normal | us L1 | 0.54 | 0.81 | 12.2 | — | #84c048 26 · #79b7eb 21 · #edb457 20 · #d3e0d1 15 · #9b6737 13 |
| | SF L4 | 0.55 | 0.94 | 4.3 | — | #f6c270 39 · #f9dc9a 29 · #5bb9f5 18 · #d07e2f 6 · #2e71cb 5 |
| HUD Hard | us L7 | 0.54 | 0.80 | 34.9 | — | #7cb737 · #72b3f7 · #e3bb77 · #917c50 · #433170 |
| | SF L317 | 0.50 | 0.76 | 63.7 | — | #e4b976 36 · #5d6596 23 · #71a6df 15 · #c68f4e 14 · #333657 8 |
| Shot | us placed | 0.54 | 0.82 | 8.9 | 1.3 (TNT glow) | — |
| | SF | 0.51 | 0.88 | 11.8 | 1.7 (muzzle) | — |
| Hit | us +0.3 s | 0.55 | 0.82 | 13.8 | **2.2** | — |
| | SF L316 / L1 | 0.51 / 0.54 | 0.87 / 0.95 | 12.2 / 3.9 | **0.8** | — |
| Collapse | us +1.5 s | 0.59 | 0.75 | **5.2** | 7.2 (dust) | — |
| | SF | 0.50 | 0.86 | 20.1 | 2.9 (debris) | — |
| Win | us +0.8 s | 0.60 | 0.81 | — | **3.7** | — |
| | SF L3 | 0.61 | 0.55 (dark under confetti) | — | **63** (sparse) | — |
| NEW card | SF L6 | 0.34 | 0.25 (scrim) | 79 | 19 (sparkles) | #252220 86 · #e88710 3 · #fabe15 3 |
| Lose | us L2 | 0.46 | 0.61 | — | — | — |
| | SF L317 | 0.50 | 0.70 | — | — | — |
| Shop | us Upgrades | 0.38 | 0.64 | — | — | — |
| | SF bundles | 0.51 | 0.80 | — | — | #3163d9 · #f0e5d3 · #263876 · #d7bd54 |
| Settings | us | 0.41 | 0.64 | — | — | — |
| | SF | 0.70 | 0.61 | — | — | #173983 59 · #366ac0 24 |

**What the numbers say.**
- **Brightness.** In play, SF V is 0.86–0.95. Ours is 0.75–0.82. The gap is +0.08 to +0.13, which is the same story as this morning.
- **Saturation.** In play, SF S is 0.50–0.55. Ours is 0.54–0.59. **In real gameplay SF is not more saturated than us.** The morning figures (SF S 0.51–0.74) came from store art.
- **Separation.**
  - SF on normal levels is low too: ΔE 4 for white cans on sand (L1, L4) and 12 at L316. It reaches 64 only on Hard (navy cans).
  - SF stays readable for a different reason: its objects carry dark navy outlines in their painted texture (can rims, crate frames) and a strong contact shadow.
  - Our worst value is mid-collapse: ΔE 5, beige dust and wood on a beige lot.
- **VFX.**
  - SF's hit VFX is tiny: 0.8 % on a hit, 1.7 % for the muzzle flash. Ours is bigger: a 2.2 % burst and 7 % dust.
  - SF spends its VFX on the **win**: fireworks plus confetti over 63 % of the screen. We spend 3.7 % there.
  - It also spends it on the NEW card, with sparkles over 19 %.
- **Outline / bevel.**
  - **SF 3D.** No ink outlines. Painted bevels and gradients. Cans have a navy band; crates have a light frame and a dark inset.
  - **SF UI.** Every element has a gold rim, a dark-blue outline on text, a soft drop shadow and a gloss top.
  - **Our 3D.** Flat Lambert with speckle. Our toon burst and dust have outlines.
  - **Our UI.** Gold rim with a navy stroke, close to SF.
- **Fonts.**
  - SF uses one rounded heavy display face for everything, in cream or white with a dark-blue outline and a drop shadow. Body text is the same face, smaller (the "Hit the box to knock it down!" line is ≈ 17 pt).
  - We use Lilita One for titles and Nunito 900 for body. Our outline widths vary (UX-21 open). Text under 16 px is still there: PASS tag 13, HARD/BOSS 12.6, booster tile labels 15, the dev "Level" button 14.

## 3. Screens

Owner key: app-dev, design, content, Owner (decision). Priority P0/P1/P2, effort S/M/L.

### 1 · Home — us 3.5 / SF 4.5 (`real/01-home.jpg`)
- **Us** (L1 and L7-next). 14 tappable items: Play, 3 tabs, gear, coins +, avatar, Daily, No Ads, Map, sign, dev "Level". About 12 words.
  - Play is 292×91 pt at y 653–744 (centre 82 %). It turns purple for the next Hard level (L7) and **orange for the next Boss (L10)**, which is new and right.
  - V 0.76. The palette has a dark grey-brown street (#726a65, 20 %).
- **SF, L20–L27.** 7 items: coins pill, hearts "5 FULL", Level button, 3 tabs (Shop / Home / gear tab). From L27 there is also a No Ads badge. About 6 words.
  - Level button 188–199×77–80 pt, centre 78 %. Green = "Level 23"; purple = "Level 20 / Hard Level".
  - V 0.89, warm sand and sky only.
- **SF, L316.** Adds an avatar and a leaderboard tab; the gear moves to the top bar.
- ✅ One primary button, coloured by level type (green / purple / orange boss). Title case. 3 tabs, as in SF.
- ❌ Seven more taps than SF on day 1, four of them dead ("coming soon"). The dev "Level" button is 14 px, top left. The screen is darker (V 0.76 vs 0.89). SF unlocks its meta UI step by step (No Ads at L27; avatar and leaderboard later).
- 🔧 Hide the dev button and the 4 placeholders on the tester link — **P0 · S · Owner → app-dev**.
- 🔧 Reveal Daily / No Ads / Map by level, as SF does — **P2 · S · Owner → app-dev**.
- 🔧 Grade Home brighter (V ≥ 0.85) — **P2 · S · design**.

### 2 · Pre-level popup, normal and Hard — us 3.8 / SF 4.5 (`real/02-prelevel.jpg`)
- **Us.**
  - Hard L7: purple header "Level 7", "⚠ Hard! ⚠", "Select Booster", 2 tiles (Ball ✓, Net), Play 297×62 at centre ≈ 56 %, and a ✕.
  - Boss L10: the same card with an **orange header and "⚠ Boss! ⚠"** (fixed since this morning).
  - Normal levels: no popup, even with boosters owned (L12).
  - About 10 words.
- **SF.**
  - Same layout: header, "⚠ Hard! ⚠" on Hard, "Select Booster:", 1 tile, Play 192×77 at centre 67–68 %, and ✕.
  - Normal levels also get the popup once a booster exists (L23, L316: blue).
  - Before unlock, the tile shows a **lock with "Level 23"** (L20).
  - About 6 words.
- ✅ The same pattern and colours (purple = Hard, orange = boss). The selected tile has a green ✓, as in SF.
- ❌ The tile labels "Ball" / "Net" are 15 px; SF has no label. Our Play is lower in the card hierarchy (62 pt high vs SF 77). The popup background is darker and greyer: S 0.48 vs 0.74.
- 🔧 Tile labels ≥ 16 px or none — **P2 · S · app-dev**.
- 🔧 Play 77 pt high — **P2 · S · app-dev**.
- 🔧 Show a locked tile "Lv 10" on Hard levels before the boosters unlock, so the player learns what is coming — **P2 · S · app-dev**.

### 3 · Loading — us 4.0 / SF 3.5 (`real/03-loading.jpg`)
- **Us.** No loading screen. An iris opens on the building, and play starts 0.7 s after the tap.
- **SF.** A full-screen blue radial (S 0.98) with cannon and barrel art and "Loading…". It is 4–5 s on the phone (the 08/11 note; not timed from stills).
- ✅ Ours is faster and keeps the scene. ❌ None. Keep.

### 4 · Level open / FTUE first tap — us 3.3 / SF 4.5 (`real/04-ftue.jpg`)
- **Us** (L1 +0.6 s). The tip "Tap a post. Then BLAST!" (5 words, 20 px, at the top) and a hand on a post.
  - The full HUD is visible: pause, level pill, dev "Level", meter + PASS tag, TNT badge, BLAST. In build B, 3 locked booster chips are added.
  - The scene is not dimmed (V 0.81). The windmill vs the lot is ΔE 7.
- **SF** (L1).
  - The scene is **dimmed** (V 0.54) with a **warm spotlight** on 9 cans (ΔE 37).
  - A bubble "Tap to shoot a ball!" (5 words, ≈ 20 pt), placed right above the target. A hand on the cans.
  - HUD: Balls 20 + gear.
- ✅ Short text and a hand, as SF has.
- ❌ The eye has 9+ things to read. Nothing points the light at the target. The tip sits at the top, far from the hand.
- 🔧 L1: dim the scene to 55 %, add a radial spotlight on the first post, put the bubble next to the hand, and hide everything except the TNT badge until the first tap — **P1 · S · app-dev**.

### 5 · HUD in play — us 3.3 / SF 4.8 (`real/05-hud.jpg`)
- **Us.**
  - L1: 9–10 items. Pause, level pill, dev "Level", meter, PASS tag, tip, 3 lock chips (build B), TNT badge, BLAST, and a coin pill once coins come.
  - Boss L10: 15+ items. Adds the BOSS tag (12.6 px), shield, four "0%" labels (13 px) and 3 booster chips.
  - BLAST 246×80 bottom centre. TNT badge 58×58 bottom right.
- **SF.** 2 items on every level, Hard included.
  - "Balls N" badge 88×74 pt top left; gear ≈ 53 pt top right.
  - On Hard both turn purple.
  - The cannon is the bottom anchor (≈ 20 % of the height).
- ✅ Hard and Boss colours run through the pill and badge; the boss is orange now.
- ❌ The item count is 5–7× SF's. The lock chips "Lv.31 / Lv.21 / Lv.11" are new in build B: three disabled controls on L1. There are 4 rows of UI in the top 125 px.
- 🔧 HUD ≤ 5 items: level number inside the meter, no HARD/BOSS word, "0%" labels → shield icon, lock chips only in the pre-level popup, dev button off — **P0 · M · Owner (N10) → app-dev**.

### 6 · Shot / placing — us 3.5 / SF 4.3 (`real/06-shot.jpg`)
- **Us.** Plan, then BLAST: two steps. Placing gives feedback in 3 places (TNT 5 → 0, BLAST lights orange, undo appears). The TNT glow covers 1.3 %.
- **SF.** The tap is the shot. Ball count −1, a muzzle flash (1.7 %), and the ball lands in < 1 s. The result is visible at once.
- ✅ Our lit BLAST and tray count are clear.
- ❌ Our first result comes 5 s after the first tap; SF's comes in under 1 s.
- 🔧 Keep our core loop (a decision already made). Shorten the time to the first visible change: tip fade, BLAST pulse, verdict ≤ 2 s after PASS — **P1 · M · app-dev**.

### 7 · Hit and explosion — us 3.8 / SF 3.8 (`real/07-hit.jpg`)
- **Us** (+0.3 s). An outlined toon burst covers 2.2 %, plus scorch, chips and coins starting. Building vs ring ΔE 14.
- **SF.** **There is no explosion.** The ball hits, the cans scatter, and there is a small spark (0.8 %).
- ✅ Our impact reads as an explosion, and it is bigger than SF's.
- ❌ Correction: the morning review assumed SF's impact was stronger. It is not. The burst colour is close to the wood (orange on orange).
- 🔧 A white-hot core frame (60 ms) so the burst separates from wood — **P2 · S · app-dev**.

### 8 · Collapse with camera — us 4.0 / SF 4.0 (`real/08-collapse.jpg`)
- **Us.**
  - +1.5 s: the **camera dollies in** and tilts, with a slow-mo vignette, "TIMBER!", dust over 7 %.
  - +4.0 s: back out over the rubble.
  - The meter climbs live: 4 → 15 → 58 → 88 → 95 %.
- **SF.** **The camera is static.** The table width stays 0.66–0.68 of the screen in `04`, `05d`, `05e` and `05f`. What moves is a **cart** under the table (an L316 mechanic). The HUD stays at 2. Debris covers 2.9 %. Separation is ΔE 20.
- ✅ Our camera work beats SF's here.
- ❌ Mid-collapse separation is ΔE 5: beige dust and wood on a beige lot, darkened by the vignette (V 0.75).
- 🔧 Dust darker than the lot (L\* ≈ 55) and the lot a cooler grey (visual fixes 1–2 from this morning) — **P0 · S · design + app-dev**.

### 9 · Win and coins — us 3.3 / SF 4.8 (`real/09-win.jpg`)
- **Us** (build B).
  - At 0.8 s: the meter turns gold and the "CLEARED" tag goes green.
  - A coin stream rises to the pill (3.7 % of the screen) and the coins go 184 → 195.
  - At 2.2 s: back to Home on LEVEL 2.
  - The Q7 stamp runs on CSS time (see §0).
- **SF.**
  - L1: the "SMASH FEST" logo drops in, and the coin pill appears (1,000).
  - L3: two fireworks plus confetti (63 % envelope), with "+20" and coins popping off the table.
  - Back on Home, "+20" in ≈ 30 pt text, and coins fly to the pill.
- ✅ The same no-card flow (win → Home).
- ❌ Our celebration is about 1/17 of SF's on-screen area, and our "+N" is pill-sized.
- 🔧 Win burst: confetti + 2 firework bursts (≥ 30 % envelope, 1.2 s), "+N" 32 px by the pill, coins fly to the Home pill on arrival. Keep "celebrate ≤ 2 places" (in-level + Home) — **P1 · M · app-dev + design**.

### 10 · Lose / continue (+ SF interstitial) — us 3.8 / SF 3.5 (`real/10-lose.jpg`)
- **Us.** 5 items: Home, "NOT YET!" ribbon, meter (orange below PASS, notch at 85 %), a tip by cause ("Aim LOW: the ground floor.", 5 words), and "Try Again" 289×66 at centre ≈ 64 %.
  - No ad and no life lost.
  - The orange fill is new (UX-13 done).
- **SF.**
  - "Continue?" card: "+5 / Add 5 balls to continue!" and "Play On ⦿900" 208×74 at 59 %, with a ✕.
  - On L317 a **Fail Offer** row is added: 2,500 coins + 5 balls + 3 rockets for VND 149,000.
  - Then a **playable interstitial ad**.
  - Then Home with **hearts 4 and a 28:34 timer**.
  - Then a "Try Again" popup (the pre-level card with Try Again).
  - So 4 screens from a fail to the next try. The L20 continue has no IAP row.
- ✅ Ours is 1 screen and kinder; the orange fill is fixed.
- ❌ The tip text box is pale blue on cream, a third surface colour. There is no rescue offer (the hook exists and is off).
- 🔧 Keep it. Rescue "+1 TNT for coins" stays a Owner decision — **P2 · M · Owner**.

### 11 · Shop — us 2.0 / SF 4.0 (`real/11-shop.jpg`)
- **Us.** The Shop tab gives the toast "Shop: coming soon" (13–16 px, 2 s).
  - Upgrades: 4 cards, prices 100 / 320 / 80 / 90 at 0 coins, grey, no red (fixed). No backdrop of its own: the title floats over the windmill. "Level 1" 358×62. S 0.38.
- **SF.**
  - Bundles: Small 5,000 coins + 3 rockets + 1 h hearts, VND 299,000. Medium, VND 599,000. Large, VND 1,199,000.
  - 6 coin packs: 1,000 for 59,000 up to 100,000 for 2,999,000.
  - Green price buttons, ribbons, and the Shop tab raised.
- ❌ There is no Shop.
- 🔧 Hide the tab, or build a simple coin + No Ads shop (no real payments) — **P1 · M · Owner (N1/N2) → app-dev + design**.

### 12 · Settings / profile — us 3.5 / SF 4.0 (`real/12-settings.jpg`)
- **Us.** One card: 5 rows of 48 px (Sound, Music, Vibration, Reduce motion, "Restart from Level 1" in red text) and "Done" 278×62. About 12 words. No profile.
- **SF Settings.** A title ribbon and ✕. **3 icon toggles** (Music, Sound, Vibration), "Save your progress" (blue), "Support" (green, 241×72), and "Terms" / "Privacy" pills. There is no reset.
- **SF Profile.** Avatar (editable), Player8207, Level 317.
- ✅ Body 16 px. Toggles in one style.
- ❌ Reset sits as a red row among the toggles. "Done" + ✕-less is fine, but SF puts the 3 audio and haptic controls in one row.
- 🔧 3 icon toggles in a row; Reduce motion as a row; reset as a small text link with the confirm (body ≥ 16 px) — **P2 · S · app-dev**.

### 13 · NEW obstacle card — us 2.8 / SF 4.5 (`real/13-newcard.jpg`)
- **Us.** **No material or obstacle card on any level** (`L.unlock` is empty on all 36 levels). New materials appear without a word.
  - The only card in the family is build B's booster card: "Wrecking Ball / Unlocked!", a round icon, "Smash a whole chunk.", and a green "Free" button.
- **SF** (L6 Box, L21 Stone). Full-screen scrim (V 0.25). "New Item!" in gold, the name, a big icon with sparkles (19 %), a 2-line rule ("Hit the box to knock it down!"), and "Tap to Continue". 5 items, about 12 words.
- ✅ Our new card already follows SF's pattern (scrim, gold title, centre icon, 1 line).
- ❌ We have no obstacle card. On the booster card the button says "Free", which reads as a purchase.
- 🔧 Reuse the card for each first material (wood L1, steel L8, RC, glass, protected building): name, icon, 1 rule ≤ 6 words, "Tap to continue" — **P1 · S · app-dev + content**.
- 🔧 Booster card button "Got It" — **P1 · S · app-dev**.

### 14 · Booster unlock tutorial — us 3.3 / SF 4.5 (`real/14-booster.jpg`)
- **Us.**
  - Build A: from L7 Hard the pre-level picker offers Ball and Net. Picking Ball opens the aim view "Tap to swing" with a crosshair (no first-use tutorial seen).
  - Build B: L1 shows **3 locked chips "Lv.31 / Lv.21 / Lv.11"** in the tray. The L11 "Unlocked!" card appears **while the Lv.11 chip behind it is still locked**.
- **SF** (L23).
  - The pre-level popup dims everything except the tile.
  - A bubble: "You can select a booster to start the level with it!" (11 words).
  - A "Free" tag on the tile and a big arrow at Play.
  - After that, the tile shows ✓.
  - In play, 3 rockets launch from the table base with a spark trail (9.7 %) and break the stack.
- ✅ The pick and the ✓ match SF. The aim view tells you what to do.
- ❌ The lock chips add 3 dead HUD items from L1. The card and the chip disagree. There is no pointer to the new tile.
- 🔧 Teach in the pre-level popup the first time (dim + bubble + arrow); unlock the chip when the card shows; lock teasers only in the popup — **P1 · S · app-dev**.

## 4. Top 10 fixes

| # | Fix | Screens | P | Effort | Owner |
|---|---|---|---|---|---|
| 1 | **HUD ≤ 5 items.** Dev "Level" button off by default (also on Home). No lock chips in the tray. No HARD/BOSS word tag (colour says it). "0%" labels → a shield icon. Level number inside the meter. | 5, 4, 1 | P0 | M | Owner (N10) → app-dev |
| 2 | **Separation and grade.** Scene V ≥ 0.86 (now 0.75–0.82). Dust darker than the lot. Cooler lot. Target mid-collapse ΔE ≥ 20 (now 5). | 8, 7, 1 | P0 | S | design + app-dev |
| 3 | **Win payoff.** Confetti + 2 fireworks (≥ 30 % envelope, 1.2 s), "+N" 32 px, coins fly into the Home pill on arrival (SF 63 % vs ours 3.7 %). | 9 | P1 | M | app-dev + design |
| 4 | **NEW obstacle cards.** One per first material or obstacle, on the new "Unlocked!" card: name, icon, 1 rule, "Tap to continue". | 13 | P1 | S | app-dev + content |
| 5 | **L1 FTUE spotlight.** Scene dimmed to 55 %, a spotlight on the first post, the bubble beside the hand, HUD hidden until the first tap. | 4 | P1 | S | app-dev |
| 6 | **Booster tutorial.** In the pre-level popup (bubble + arrow + "Free" tag). The booster card button "Got It", not "Free". Unlock the chip when the card shows. | 14, 2 | P1 | S | app-dev |
| 7 | **Shop.** Hide the tab, or build coin packs + No Ads (no real payments). | 11, 1 | P1 | M | Owner (N1/N2) → app-dev + design |
| 8 | **Text ≥ 16 px.** PASS tag 13, HARD/BOSS 12.6, "0%" 13, tile labels 15, dev button 14. | 5, 2 | P1 | S | app-dev |
| 9 | **Home as SF.** Hide the 4 placeholders; reveal Daily / No Ads / Map by level; Home V ≥ 0.85. | 1 | P2 | S | Owner → app-dev |
| 10 | **Settings as SF.** 3 icon toggles in one row; reset as a link with the confirm. | 12 | P2 | S | app-dev |

**Keep:**
- no loading screen;
- the collapse camera dolly and slow-mo (SF has none);
- the goal meter with orange/gold fill;
- the one-screen lose card;
- the orange boss and purple Hard everywhere.

The rules hold in every fix: no real logos, no red cross, purple = Hard, orange = boss, the material ladder (each new-material card is in ladder order: wood → brick → concrete → RC → steel), body text ≥ 16 px.

## 5. SF level progression (from the shots)

Strips: `real/15-sf-levels-a.jpg` (L1–L6) and `real/15-sf-levels-b.jpg` (L20–L27).

| Level | What it introduces | How |
|---|---|---|
| L1 | Shoot: 9 cans (3×3) on one table, 20 balls | FTUE: dim + spotlight + bubble "Tap to shoot a ball!" + hand. On the win, the logo drops and the coin pill appears for the first time (1,000). |
| L2 | Knock cans **off** the table (a tall stack falls) | No text; 17 balls left in the shot. |
| L3 | The win reward | Fireworks + confetti + "+20" coins off the table. |
| L4 | **Two platforms** (two tables) | No text; the layout teaches it. |
| L6 | **Box** (wooden crate) | Full-screen "New Item! Box. Hit the box to knock it down! Tap to Continue". |
| L20 | **Hard** level | Home button turns purple "Level 20 / Hard Level". The pre-level popup is purple with "⚠ Hard! ⚠" and a **locked booster tile "Level 23"**. On a fail: "Continue? +5 balls, Play On 900" (coins, no IAP). |
| L21 | **Stone** (heavy blocks) | "New Item! Stone. Hit the stones hard to push them off!" |
| L23 | **Rocket booster** | The pre-level popup becomes blue for a normal level. Tutorial bubble + arrow + "Free" tag. Rockets launch from the table base. A hint "Tap on the items on the table" shows when the player taps empty sand. |
| L27 | Hard again + **No Ads** badge on Home | The meta UI grows: No Ads appears only now. |
| L316–317 | Moving cart under the table; Hard wall of navy cans; tower rotated | Avatar and leaderboard tab; hearts with a timer; Fail Offer IAP on the continue. |

**Pattern:**
- one new thing every 2–5 levels early, then about every 20;
- every new object gets a full-screen card;
- every Hard level is announced on Home **and** in the popup;
- the booster is teased as locked 3 levels before it unlocks;
- the meta UI (No Ads, avatar, leaderboard) is revealed late.

## 6. SF monetisation seen (observation only)

Strip: `real/16-sf-money.jpg`.

- **Continue.** "+5 balls" for **900 coins** (L20 and L317). On L317 an IAP **Fail Offer** row is added: 2,500 coins + 5 balls + 3 rockets, **VND 149,000**.
- **Interstitial** after a lose: a playable ad ("Bubble Pop") with a hand pointer.
- **Hearts.** 5 max. A fail costs one: "4 · 28:34" timer on Home. "∞ hearts" 1 h / 6 h / 24 h are inside bundles.
- **Shop.**
  - Bundles Small / Medium / Large: 5,000 / 10,000 / 25,000 coins + 3 / 6 / 12 rockets + ∞ hearts 1 h / 6 h / 24 h, for **VND 299,000 / 599,000 / 1,199,000**.
  - Coin packs 1,000 / 5,000 / 10,000 / 25,000 / 50,000 / 100,000 for **VND 59,000 / 249,000 / 499,000 / 999,000 / 1,799,000 / 2,999,000**.
- **No Ads badge** on Home from L27.
- **Coin income:** "+20" per win early on.

This section is observation only. Nothing here is a proposal: payments and ads are Owner's decision (CLAUDE.md §3).

## 7. What changed vs the 13/11 morning reviews (earlier SF claims)

| Earlier claim | Real shots say |
|---|---|
| SF camera zooms to the last piece (SCREENS §09, from captions) | **Wrong.** The table width is a constant 0.66–0.68 of the screen in `04`, `05d`, `05e` and `05f`. A **moving cart** carries the table. Ours is the game with a camera move. |
| SF HUD badge 98×85 pt, gear 60 pt | Measured **88×74 pt** and **≈ 53 pt** (±5 %). Still 2 items. |
| SF Home top bar = avatar, coins, hearts, gear | True only at L316. At L20–L27: coins + hearts on top, the gear is a bottom tab, no avatar, no leaderboard; No Ads from L27. |
| SF lose = "two paid offers + an interstitial" | At L20, **one coin** continue (900), no IAP. At L317, coin continue + **one** IAP Fail Offer. Then a playable ad, a heart lost (timer), and a Try Again popup. |
| SF Settings 3.4, "[S·n] name only + [I]" | Real: 3 icon toggles + Save progress + Support + Terms/Privacy, no reset. **4.0.** |
| SF Unlock / new-feature modal "not seen [I]", 3.5 | Real: full-screen "New Item!" cards (L6, L21) and a booster tutorial inside the pre-level popup (L23). **4.5.** |
| SF pre-level popup only on Hard | Also on normal levels once a booster exists (L23 blue, L316 blue). Before that, Hard shows a **locked** booster tile. |
| SF Pause: "Food Hunt pattern [I]" | Still not seen: the in-play gear was not opened in any shot. Pause stays out of this review. |
| SF colour: S 0.51–0.74, V 0.88–0.92 (store art) | In-game **S 0.50–0.55** (ours 0.54–0.59: no saturation gap), **V 0.86–0.95** (brightness gap stays). |
| SF separates objects by hue, ΔE 21–98 | In gameplay ΔE is **4–20** on normal levels and 64 on Hard. SF reads through painted dark rims and contact shadow, not hue alone. |
| VFX "SF n/a"; "make our explosion bigger" (visual fix 6) | SF's hit VFX is **0.8–1.7 %**, smaller than ours (2.2 %). SF's VFX budget goes to the **win** (63 %) and the NEW card (19 %). Re-aim fix 6 at the win. |
| SF avatar: no real image | A starfish avatar, at L316 only. |
| SF Loading 4–5 s | The screen is confirmed (blue radial + cannon art). The time is still from the 08/11 note. |
| SF Shop prices | Confirmed exactly. |
| SF win "no card, +20 at the pill" | Confirmed, and there is more: the logo drops on the L1 win, plus fireworks and confetti in the level. |

Our own changes since the morning:
- Fixed:
  - the boss is orange (Home Play, pre-level header, "⚠ Boss! ⚠", level pill, PASS tag, TNT badge);
  - the meter is orange below PASS and gold at or over it, in play and on the lose card;
  - no red prices.
- New in build B:
  - lock chips in the tray (+3 HUD items);
  - the "Unlocked!" booster card.
- Still there: the dev "Level" button.

## 8. Files

- **Page:** `real/index.html` (Vietnamese, "CHỈ DÙNG NỘI BỘ").
- **Images the page references (17 JPEG, q80, ≈ 2.8 MB):**
  - `01-home.jpg`, `02-prelevel.jpg`, `03-loading.jpg`, `04-ftue.jpg`, `05-hud.jpg`, `06-shot.jpg`, `07-hit.jpg`, `08-collapse.jpg`, `09-win.jpg`;
  - `10-lose.jpg`, `11-shop.jpg`, `12-settings.jpg`, `13-newcard.jpg`, `14-booster.jpg`;
  - `15-sf-levels-a.jpg`, `15-sf-levels-b.jpg`, `16-sf-money.jpg`.
- **SF source:** `research/smashfest-scan/shots/` (53 PNG, Owner).
- **Scripts, raw frames and metrics:** scratchpad only (`real/capB.js`, `capU2.js`, `metr.py`, `compose.py`, `sf-metrics.json`, `us-metrics.json`), not in the repo.
