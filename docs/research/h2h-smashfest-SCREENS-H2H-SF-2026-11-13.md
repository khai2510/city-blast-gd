# City Blast! vs Smash Fest: screen by screen (13/11/2026)

Reviewer: UX/UI pass for Owner. Our build: **main v41** = `checkpoints/index-main.html` (Owner's main link), re-measured today. The earlier review `UI-H2H-SF-2026-11-12.md` (v32j / v10h, before the merge) is the baseline; each screen says whether its items are now done.

**Short answer.** Over the 15 screens we average **3.3 / 5**. On the 12 screens both games have, we score **3.4** and SF **3.9** (12/11, by dimension: us 2.8, SF 4.2). The merge closed most "two UI" problems (UX-1, 3, 10, 11, 14, 17, 23, 25). What is left is (1) HUD weight in play, (2) colour slips (boss shows a purple "Hard!" banner; green fill on a fail; red prices), (3) text under 16 px in ~8 places, (4) placeholder screens (Shop) and the shipped dev button.

Old items on main: **8 done, 10 partly, 10 open** of 28 (table in §3). The two scores are not the same scale: 12/11 scored 14 UI dimensions; this one scores 6 dimensions per screen.

## How

- Served `games/blast/checkpoints` with `python3 -m http.server` on 127.0.0.1; Playwright `chromium.launch()`, 390×844, deviceScaleFactor 2, touch; three.js / Rapier routed from `BLAST_LIBS` (as in `tools/loadcheck.js`). Screens reached as in `main/check-main.js` (Home → Play, `__blast.test.solve` for the expert plan, a 1-TNT lose on L2), saves seeded in localStorage for L7 (Hard), L10 (Boss), L11 (unlock). Placing used a real touch tap.

- A DOM census at each screen (position, size, font, colour). Contrast is WCAG from CSS colours or sampled pixels.

- The win stamp and the Hard banner last 1.2–1.5 s and a 2x screenshot took ~8 s on this VM, so those two frames were taken by pausing the page's Web Animations at the moment (stamp at 450 ms of 1500). Nothing in the game file was edited.

- Physics ran slowly here (settle ~25–40 s). All timings are VM timings, not phone timings.

- Scripts and raw shots: scratchpad only (`scr/cap*.js`, `shots/`, `sfschem/`), not in the repo.


**Smash Fest evidence.**
- **[S]** seen in an SF screenshot we have: Owner's in-play Hard shot (`research/visual-gap-2026-11-09/smashfest-gameplay.png`) and the 5 public App Store screenshots (id6748084174, gameplay with a caption banner, no HUD; fetched today, not saved in the repo).
- **[S·n]** seen on Owner's phone on 08/11, but only a written caption exists (`research/iphone-mirroring-2026-11-08/CAPTIONS.md`). For these screens the right-hand image is a **schematic** labelled "SƠ ĐỒ … KHÔNG phải ảnh chụp".
- **[I]** inferred. SF has no Map, Upgrades or dev picker; pause and unlock were not seen.
- Adding the 08/11 SF images (Home, pre-level, lose, Shop, Settings) to the repo would turn every [S·n] into [S].


## 1. Summary

| # | Screen | Us | SF | Done since 12/11 | Still open |
|---|---|---|---|---|---|
| 01 | Home | **3.8** | 4.0 | UX-23 done; R23/R24 done, R25 open | UX-2 partly; UX-24 open (Owner) |
| 02 | Map / level select | **3.6** | n/a | — | not in the earlier review (new screen) |
| 03 | Upgrades | **3.1** | n/a | — | UX-26 open; upDot shown on the tab only when affordable (UX-24 part) — dot seen at 900 coins |
| 04 | Shop | **1.5** | 3.9 | — | UX-24 / R25 open (Owner N1/N2, D-blast-UI-1) |
| 05 | Settings | **3.8** | 3.4 | UX-17 done; R20 done | UX-18 partly (confirm added); R21 partly |
| 06 | Level intro / NEW card | **3.7** | 3.8 | — | UX-15 partly (see 14); UX-20 partly |
| 07 | In-level planning (HUD) | **3.3** | 4.5 | UX-1 done; UX-10 done; UX-25 done; R4,R10–R13 done; R5,R6 open | UX-4/5 partly; UX-6/8/9/28 open; UX-7 partly |
| 08 | Placing TNT | **3.7** | 4.1 | UX-7 partly (lit state done) | UX-20 partly |
| 09 | During the blast and collapse | **3.8** | 4.5 | UX-11 done; R14 done | UX-27 partly |
| 10 | Win | **3.5** | 4.0 | — | UX-12 partly (stamp verified); R19 open; top-10 #7 partly |
| 11 | Lose / rescue | **3.7** | 3.3 | UX-14 done; R15–R17 done | UX-13 open |
| 12 | Pause | **3.5** | 3.4 | — | UX-16 open; R22 open |
| 13 | Hard / boss variant | **3.2** | 4.4 | R8 partly (tip done, tag stays); R9 done | UX-19 partly |
| 14 | Unlock / new-feature modal | **3.8** | 3.5 | UX-3 done (visual); R18 done | UX-15 partly |
| 15 | Level picker button (dev) | **1.8** | n/a | — | UX-2 / R1 partly (moved off controls, still shown) |
| | **Average** | **3.3** (all 15) / **3.4** (shared 12) | **3.9** | | |

Images: `screens/<nn>-<screen>.jpg` (JPEG 80 %, ours left in navy, SF right in orange).


## 2. Screens

Score columns: Layout & hierarchy · Typography · Colour · Components & icons · Motion & feedback · Clarity & copy. Priority P0 = before the next tester build, P1 = this sprint, P2 = later. Effort S ≤ ½ day, M 1–3 days, L ≥ 1 week.


### 01 · Home

![Home](screens/01-home.jpg)

| | Layout & hierarchy | Typography | Colour | Components & icons | Motion & feedback | Clarity & copy | Avg |
|---|---|---|---|---|---|---|---|
| Us | 4 | 4 | 4 | 4 | 4 | 3 | **3.8** |
| SF | 4 | 4 | 4 | 4 | 3.5 | 4.5 | **4.0** |

SF source: [S·n] schematic from smashfest-01; scores partly [I]

✅ **Achieved**
- One primary CTA: "Play" 284×89 px, green, Title case (N4 done); Hard next level turns it purple (L7 shot), same as SF "Level 317 / Hard Level" [S·n].
- No district milestone line, no lock bubble (UX-23 done). Q9 living Home on (clouds, taxi, sign sway).
- Top bar 3 items (coins 0 + "+", gear 65 px) vs SF 4 (avatar, coins, hearts, gear) [S·n]. Avatar shown on ours too (5 items incl. avatar).
- Tabs 3 (Shop / Home / Upgrades), 130×90 hit, labels 26 px: matches SF 3 tabs [S·n].
- All targets ≥ 59 px except the dev "Level" button (58×36).

❌ **Not yet**
- 4 dead taps on the first screen: Shop tab, Daily, No Ads, coin "+" all answer "coming soon" (UX-24 still open, D-blast-UI-1 keeps them).
- Dev "Level" button 58×36 px, system-ui 14 px, yellow, at (6,98) on Home (UX-2 partly: no longer overlaps, still shipped by default).
- "LEVEL 1" sign in capitals while every button is Title case; the level is said twice (sign + map nav).
- No lives/hearts or daily reward loop (SF has hearts 5 FULL + timer [S·n]): fine for now, Owner decision.

🔧 **Fix**
- Hide the 4 placeholders until they work, or make Shop a real coin/No-Ads screen (see 04) — **P1 · S · Owner decision (N1/N2) → app-dev**
- Dev "Level" button: off by default on the tester link; Owner opens it with ?dev=1 or a long-press on the logo — **P0 · S · Owner decision → app-dev**
- Sign text "Level 1" in Title case, or drop the sign word and keep the number only — **P2 · S · app-dev**

Earlier review: UX-23 done · UX-2 partly · UX-24 open (Owner) · R23/R24 done, R25 open


### 02 · Map / level select

![Map / level select](screens/02-map.jpg)

| | Layout & hierarchy | Typography | Colour | Components & icons | Motion & feedback | Clarity & copy | Avg |
|---|---|---|---|---|---|---|---|
| Us | 4 | 3.5 | 4 | 3.5 | 3 | 3.5 | **3.6** |
| SF | n/a | n/a | n/a | n/a | n/a | n/a | n/a |

SF source: SF has no map [S·n: Home shows only "Level 316"]

✅ **Achieved**
- Illustrated city map, 1 CTA "Level 1" (232×67), back arrow 51 px, coins.
- Nodes 55×55 px; current level 66 px with a big "1" (64 px font, 6 px stroke) + avatar pin; HARD tag and BOSS castle on the path (purple / boss marker).
- District header "OLD QUARTER 0/10" and next district "DOWNTOWN · Unlock at Lv 11".

❌ **Not yet**
- Bottom tab bar swaps "Home" for "Map" (Shop / Map / Upgrades): the user loses the Home tab name and is unsure where they are.
- Locked nodes show only a padlock: no level numbers, so the map does not say how far you are (only "0/10").
- District names come back here (Owner 08/11 removed them from Home) — check this is wanted.
- Small text: "Unlock at Lv 11" 15 px, "HARD" 15 px.
- No motion seen on the map (no path fill, no scroll-to-current).

🔧 **Fix**
- Keep the tab named "Home" with the map as a sub-view, or show a "Map" title only — **P1 · S · app-dev**
- Show level numbers on locked nodes (grey) and scroll/pulse to the current node — **P2 · S · app-dev**
- Raise map labels to ≥ 16 px — **P2 · S · app-dev**
- Confirm district names on the map (they were removed from Home) — **P2 · S · Owner decision**

Earlier review: not in the earlier review (new screen)


### 03 · Upgrades

![Upgrades](screens/03-upgrades.jpg)

| | Layout & hierarchy | Typography | Colour | Components & icons | Motion & feedback | Clarity & copy | Avg |
|---|---|---|---|---|---|---|---|
| Us | 3 | 3.5 | 3 | 3.5 | 2.5 | 3 | **3.1** |
| SF | n/a | n/a | n/a | n/a | n/a | n/a | n/a |

SF source: No SF equivalent seen [I]

✅ **Achieved**
- 2×2 grid, 4 cards 148 px wide, name 18 px, price button 148×46.
- Affordable = gold price button; unaffordable = grey (03 vs 03b).
- One primary at the bottom: "Level 1" 358×62, purple when the next level is Hard.

❌ **Not yet**
- No backdrop of its own: the title "UPGRADES" (30 px) floats over the level scene (windmill), so the card edge and the sky fight.
- No tab bar here, a close ✕ instead: Upgrades is a tab on Home but behaves like a modal.
- Unaffordable price is red #E5322D on grey: red reads as an error (project rule: no threatening red).
- No line saying what each upgrade does or its current value; 8 tiny dots for the level.
- "+1 Charge" icon is the red box + green plus that does not read as TNT (UX-26 open).
- Coin pill 20 px Nunito, smaller than Home (26 px).

🔧 **Fix**
- Give Upgrades its own panel/backdrop and keep the tab bar (tab = page) — **P1 · M · app-dev**
- Price on grey in ink/grey, not red; add a 1-line effect ("Power +10 %") at 16 px — **P1 · S · app-dev + content**
- New "+1 Charge" icon: TNT bundle + green "+1" badge — **P2 · S · design**

Earlier review: UX-26 open · upDot shown on the tab only when affordable (UX-24 part) — dot seen at 900 coins


### 04 · Shop

![Shop](screens/04-shop.jpg)

| | Layout & hierarchy | Typography | Colour | Components & icons | Motion & feedback | Clarity & copy | Avg |
|---|---|---|---|---|---|---|---|
| Us | 1 | 2 | 2 | 1 | 1 | 2 | **1.5** |
| SF | 4 | 4 | 4 | 4 | 3.5 | 4 | **3.9** |

SF source: [S·n] smashfest-12a/12b

✅ **Achieved**
- Tab is placed where SF has it (left tab).
- Tap answers with a toast "Shop: coming soon" (no dead silence).

❌ **Not yet**
- No Shop screen. Toast only, 13–16 px, disappears in ~2 s.
- SF: bundles Small/Medium/Large 299k–1,199k VND + 6 coin packs 59k–2,999k VND, every button works [S·n].

🔧 **Fix**
- Decide: hide the tab until the Shop exists, or build a simple Shop (coin packs + No Ads, no real payments yet) — **P1 · M · Owner decision → app-dev + design**

Earlier review: UX-24 / R25 open (Owner N1/N2, D-blast-UI-1)


### 05 · Settings

![Settings](screens/05-settings.jpg)

| | Layout & hierarchy | Typography | Colour | Components & icons | Motion & feedback | Clarity & copy | Avg |
|---|---|---|---|---|---|---|---|
| Us | 4 | 4 | 3.5 | 4 | 3 | 4 | **3.8** |
| SF | 3.5 | 3.5 | 3.5 | 3.5 | 3 | 3.5 | **3.4** |

SF source: [S·n] smashfest-15 (name only) + [I]

✅ **Achieved**
- One card, 5 rows of 48 px (Sound, Music, Vibration, Reduce motion, Restart) + "Done" 62 px. Body Nunito 900 16.2 px, title "Settings" Title case (UX-17 done: no ✓ marks, no 2-line row, no Luckiest).
- Restart now asks first: "You'll lose all progress" + Cancel / Restart (UX-18 partly done).
- Toggles are one style (green pill switch).

❌ **Not yet**
- "Restart from Level 1" is still a full-width row in red #C2361C, same shape as the toggles (destructive action looks like a setting).
- Confirm dialog body text is ~11 px ("Level, coins and upgrades go back to zero").
- Reduce motion and Vibration are duplicated in Pause (see 12).

🔧 **Fix**
- Move reset to a small text link "Reset progress…" at the bottom; keep the confirm; body ≥ 16 px — **P1 · S · app-dev**

Earlier review: UX-17 done · UX-18 partly (confirm added) · R20 done · R21 partly


### 06 · Level intro / NEW card

![Level intro / NEW card](screens/06-level-intro.jpg)

| | Layout & hierarchy | Typography | Colour | Components & icons | Motion & feedback | Clarity & copy | Avg |
|---|---|---|---|---|---|---|---|
| Us | 3.5 | 3.5 | 4 | 3.5 | 4 | 3.5 | **3.7** |
| SF | 4 | 4 | 4 | 4 | 3 | 4 | **3.8** |

SF source: [S·n] smashfest-02/03

✅ **Achieved**
- No loading screen: iris → the building assembles in place (SF: Loading 4–5 s [S·n]).
- Normal levels: no card, play starts at once; L1 hand + 5-word tip.
- Hard / Boss: a pre-level card in SF's own pattern: purple header "Level 7" 40 px, "⚠ Hard! ⚠" 24 px, "Select Booster", tiles 80×92 with count badge, "Play" 297×62.

❌ **Not yet**
- The tip and hand show before the building has finished assembling (06 frame at +0.3 s).
- L32 rule tip is a cream bubble "Fill the dots to crack the leg" at 15 px, the old style UX-20 removed elsewhere.
- Booster tile label 15 px (Ball / Net) and count badge 18 px.
- The Hard card has a ✕ close plus Play: two exits for one decision.

🔧 **Fix**
- Fade the tip/hand in after the assemble ends (~0.8 s) — **P2 · S · app-dev**
- L32 tip in the standard white-outlined tip style, ≥ 16 px — **P1 · S · app-dev**
- Booster tile label ≥ 16 px; drop ✕ or make it the only "skip" — **P2 · S · app-dev**

Earlier review: UX-15 partly (see 14) · UX-20 partly


### 07 · In-level planning (HUD)

![In-level planning (HUD)](screens/07-planning.jpg)

| | Layout & hierarchy | Typography | Colour | Components & icons | Motion & feedback | Clarity & copy | Avg |
|---|---|---|---|---|---|---|---|
| Us | 3 | 3 | 3.5 | 3.5 | 3.5 | 3.5 | **3.3** |
| SF | 5 | 4.5 | 4.5 | 4.5 | 4 | 4.5 | **4.5** |

SF source: [S] Owner's in-play shot (Hard level)

✅ **Achieved**
- One UI system: Lilita ("ULClean") + Nunito only in view (UX-1 done).
- BLAST label centred, no icon, 246×80, 43 px (UX-25 done). No wave count.
- Boosters hidden until owned; 3 icon-only 58 px circles with count badge when owned (UX-10 done).
- Undo appears only after the first TNT (R12 done). No coin pill while planning (R4 done).
- Tip L1–L2 only, 20 px white with 3.5 px outline, ≤ 6 words ("Tap a post. Then BLAST!").

❌ **Not yet**
- 8 items in view on L1 (pause, level pill, meter, PASS tag, tip, TNT badge, BLAST, dev "Level") vs SF 2 (Balls badge 98×85 pt, gear 60 pt) [S]. Words: ~9 vs SF 1.
- 4 rows of UI in the top 125 px (pill y16, tag y50, meter y67, tip y96) (UX-5 partly).
- PASS tag 13 px in a 46×28 tag: smallest text carrying the goal (UX-6 open).
- Counter 58×58 at bottom right, number 35 px; SF's counter is the hero of the HUD, top left, 98×85 pt (UX-8 open, Owner).
- Idle BLAST is muted terracotta (white text 3.7:1 at the light edge), not the grey disabled state (UX-7 partly).
- Pause top left 48 hit / 41 visual; SF gear top right 60 pt (UX-9 open).

🔧 **Fix**
- Merge level number into the meter ("Lv 7" left, % centre, flag + 85 % notch 16 px); ≤ 5 HUD items — **P1 · M · Owner decision (N10) → app-dev**
- Idle BLAST = grey #C9C2B8 + navy outline; orange on the first TNT (already lights up) — **P1 · S · app-dev**
- TNT badge 84×76 top left, pause → top right 52/60 pt — **P1 · M · Owner decision → app-dev**

Earlier review: UX-1 done · UX-10 done · UX-25 done · UX-4/5 partly · UX-6/8/9/28 open · UX-7 partly · R4,R10–R13 done; R5,R6 open


### 08 · Placing TNT

![Placing TNT](screens/08-placing.jpg)

| | Layout & hierarchy | Typography | Colour | Components & icons | Motion & feedback | Clarity & copy | Avg |
|---|---|---|---|---|---|---|---|
| Us | 3.5 | 3.5 | 4 | 3.5 | 4 | 3.5 | **3.7** |
| SF | 4 | 4 | 4 | 4 | 4.5 | 4 | **4.1** |

SF source: [S] store screenshot (cannon, no HUD) + [S·n] smashfest-08a hint

✅ **Achieved**
- Real touch tap 7 px beside a post places a charge (tolerant hit).
- Feedback in 3 places: TNT 5 → 4, BLAST turns bright orange (BLAST face #FA8459), undo 48 px appears.
- Haptic on place (haptics v2).

❌ **Not yet**
- The tip "Tap a post. Then BLAST!" stays after the first TNT (no auto-fade).
- No "what will fall" preview; SF shows the result right away because the tap is the shot.
- White on the lit BLAST face is ~2.5:1 at the light top (needs the outline, which it has: 4 px).
- Undo is white 48 px circle at bottom left, a system look next to the styled buttons.

🔧 **Fix**
- Fade the tip 1 s after the first TNT on every level — **P1 · S · app-dev**
- Undo in the blue + gold round recipe — **P2 · S · app-dev**

Earlier review: UX-7 partly (lit state done) · UX-20 partly


### 09 · During the blast and collapse

![During the blast and collapse](screens/09-blast.jpg)

| | Layout & hierarchy | Typography | Colour | Components & icons | Motion & feedback | Clarity & copy | Avg |
|---|---|---|---|---|---|---|---|
| Us | 4 | 3.5 | 4 | 3.5 | 4 | 3.5 | **3.8** |
| SF | 5 | 4 | 4.5 | 4 | 5 | 4.5 | **4.5** |

SF source: [S] store screenshot (pre-shot) + [S·n] 05a–05g

✅ **Achieved**
- Tray, BLAST and badge fade out: 5 HUD items during the collapse (UX-11 done).
- Meter climbs live (4 → 12 → 36 %), coins count up in a pill top right.
- Dust puffs, scorch marks, per-material break FX, "TIMBER!" voice; a fast-forward ▶▶ button bottom right.

❌ **Not yet**
- A coin pill appears mid-collapse: a new HUD item at the moment the eye should be on the building.
- The ▶▶ button (≈ 40 px, dark) has no label and sits where nothing else is.
- SF: HUD unchanged at 2, camera zooms to the last piece [S·n]; ours keeps a fixed wide camera on L1.
- The collapse is slow on this machine (settle ~40 s); phone timing not measured.

🔧 **Fix**
- Hold coin counting until rest (Q5 intent) or count inside the meter — **P2 · S · app-dev**
- Fast-forward: show only after 3 s of slow settle, 48 pt, blue + gold — **P2 · S · app-dev**
- Measure settle time on a phone (target ≤ 4 s to verdict) — **P1 · S · app-dev**

Earlier review: UX-11 done · R14 done · UX-27 partly


### 10 · Win

![Win](screens/10-win.jpg)

| | Layout & hierarchy | Typography | Colour | Components & icons | Motion & feedback | Clarity & copy | Avg |
|---|---|---|---|---|---|---|---|
| Us | 3.5 | 3.5 | 3 | 3.5 | 4 | 3.5 | **3.5** |
| SF | 4 | 4 | 4 | 4 | 4 | 4 | **4.0** |

SF source: [S·n] smashfest-06a–06c

✅ **Achieved**
- Q7 stamp works: "CLEARED!" 56 px cream, 6 px navy stroke, −5°, scale 0 → 1.2 → 1, 1.5 s, + 42 confetti (caught at 0.45 s).
- Then "+195" next to the coin pill and back Home in 2 s, Home shows LEVEL 2 and 195 coins: the same no-card flow as SF.

❌ **Not yet**
- The meter tag "CLEARED" is still 13 px white on #41D41D = 1.97:1 (UX-12 / R19 open).
- Timing on this machine: CLEARED at the meter → stamp +3.5 s → "done" +25 s → Home +2 s. If a phone also waits for full settle, the win feels late (verify).
- Stamp lasts 1.5 s; no "+N" in big type at the pill (SF "+20" big) — ours "+195" is pill-sized, smaller than the SF one [I].

🔧 **Fix**
- Drop the CLEARED tag on a win (the stamp says it) or 15 px + 2 px outline — **P1 · S · app-dev**
- Go to the result as soon as PASS is reached + 1.2 s stamp, do not wait for full settle — **P1 · M · app-dev**
- "+N" at 32 px by the pill with a 1.15× pill bump — **P2 · S · app-dev**

Earlier review: UX-12 partly (stamp verified) · R19 open · top-10 #7 partly


### 11 · Lose / rescue

![Lose / rescue](screens/11-lose.jpg)

| | Layout & hierarchy | Typography | Colour | Components & icons | Motion & feedback | Clarity & copy | Avg |
|---|---|---|---|---|---|---|---|
| Us | 4 | 4 | 3 | 4 | 3 | 4 | **3.7** |
| SF | 3 | 3.5 | 3.5 | 3.5 | 3.5 | 3 | **3.3** |

SF source: [S·n] smashfest-09/10/11

✅ **Achieved**
- 5 items: Home 52 px, "NOT YET!" ribbon 33 px, meter with % 25 px + PASS mark, 5-word tip in a 16 px box, "Try Again" 289×66 (UX-14 done).
- HUD hidden behind the scrim (R15 done). Title case "Try Again".
- Kinder than SF: no ad, no life lost, no pay wall.

❌ **Not yet**
- Meter fill is GREEN on a fail (60 % frame): green = passed in our colour roles (UX-13 open).
- At 2 % the fill is a dot: the meter carries no information on big misses.
- No rescue offer (+1 TNT) — the hook exists but is off (Owner: monetisation).
- Tip 16 px on a pale blue box (navy on #D9EAFB, ok) — tip text varies per level, not per failure cause.

🔧 **Fix**
- Fill orange below PASS, gold at/over PASS, in play and on the card — **P1 · S · app-dev**
- Decide on a rescue "+1 TNT" row (coins, no IAP yet) — **P2 · M · Owner decision**
- Tip by cause (missed base / protected hit) ≤ 6 words — **P2 · S · content**

Earlier review: UX-14 done · R15–R17 done · UX-13 open


### 12 · Pause

![Pause](screens/12-pause.jpg)

| | Layout & hierarchy | Typography | Colour | Components & icons | Motion & feedback | Clarity & copy | Avg |
|---|---|---|---|---|---|---|---|
| Us | 3.5 | 4 | 4 | 3 | 3 | 3.5 | **3.5** |
| SF | 3.5 | 3.5 | 3.5 | 3.5 | 3 | 3.5 | **3.4** |

SF source: Not seen [I]; Food Hunt pattern [S·n]

✅ **Achieved**
- Ribbon "Paused" 33 px, Resume primary 289×66, Restart / Home secondary 140×58 (blue + gold).
- Scrim dims the scene; the HUD stays readable behind it.

❌ **Not yet**
- Two toggle styles in one card: Sound/Music as 74 px icon buttons, Reduce motion/Vibration as row switches (UX-16 open).
- Reduce motion does not belong in Pause (R22 open).
- 7 controls; SF-genre pattern is 3 icons + Replay + Home + continue.

🔧 **Fix**
- One row of 3 icon toggles (sound, music, vibration); Reduce motion → Settings only — **P2 · S · app-dev**

Earlier review: UX-16 open · R22 open


### 13 · Hard / boss variant

![Hard / boss variant](screens/13-hard-boss.jpg)

| | Layout & hierarchy | Typography | Colour | Components & icons | Motion & feedback | Clarity & copy | Avg |
|---|---|---|---|---|---|---|---|
| Us | 3 | 3 | 2.5 | 3.5 | 4 | 3 | **3.2** |
| SF | 4.5 | 4 | 5 | 4.5 | 4 | 4.5 | **4.4** |

SF source: [S] Owner's Hard shot + [S·n] 06d/07a/07b

✅ **Achieved**
- Purple runs through Home Play, pre-level card, banner, level pill, PASS tag, TNT badge, meter rim, vignette (SF does the same [S]).
- 1.2 s banner "⚠ Hard! ⚠" 44.6 px yellow on a purple band (5.5:1).
- No "HARD." in the tip; Safe = shield icon on the meter (UX-19 partly, Q8 done).
- Boss: orange level pill + orange TNT badge.

❌ **Not yet**
- BOSS level says "⚠ Hard! ⚠" in a PURPLE banner and keeps a PURPLE PASS tag, while its pill and badge are orange — breaks "orange = boss". The boss pre-level card reads "⚠ Boss! ⚠" under a purple header.
- "Hard" is still said 3 times (card, banner, 12.6 px HARD tag in the pill); BOSS tag also 12.6 px.
- Protected buildings carry "0%" labels at 13 px ×3–4: new small text in the scene.
- 11 HUD items on Hard L7 (+3 boosters) vs SF 2.

🔧 **Fix**
- Boss = orange everywhere: banner "⚠ Boss! ⚠" on orange, PASS tag, card header — **P0 · S · app-dev**
- Drop the HARD/BOSS word tag in the pill (colour + banner say it) — **P1 · S · app-dev**
- Protected "0%" labels → small shield icon, number only when hit, ≥ 16 px — **P1 · S · app-dev + design**

Earlier review: UX-19 partly · R8 partly (tip done, tag stays) · R9 done


### 14 · Unlock / new-feature modal

![Unlock / new-feature modal](screens/14-unlock.jpg)

| | Layout & hierarchy | Typography | Colour | Components & icons | Motion & feedback | Clarity & copy | Avg |
|---|---|---|---|---|---|---|---|
| Us | 3.5 | 4 | 3.5 | 4 | 3.5 | 4 | **3.8** |
| SF | 3.5 | 3.5 | 3.5 | 3.5 | 3.5 | 3.5 | **3.5** |

SF source: Not seen [I]

✅ **Achieved**
- 5 items: NEW! tag, name 32 px Lilita Title case (no Luckiest glyph bug: UX-3 done), icon, 4-word line, "Got It" 297×62.
- "2 FREE" pill gone (H6 / R18 done). The booster then shows in the tray with its count (3).

❌ **Not yet**
- It opens on the game screen over the sky while the building is ready: covers the top half (card y125–340).
- Body "Smash a whole chunk." 18 px in grey #6E6380 (5:1) — lighter than ink.
- No pointer to the new button after "Got It" was seen in our frame (hand is coded; not verified).

🔧 **Fix**
- Show it on the win of the boss level (when it is earned) or as a bottom toast above the booster — **P2 · S · app-dev**
- Body in --ink #2B2140 — **P2 · S · app-dev**

Earlier review: UX-15 partly · UX-3 done (visual) · R18 done


### 15 · Level picker button (dev)

![Level picker button (dev)](screens/15-level-picker.jpg)

| | Layout & hierarchy | Typography | Colour | Components & icons | Motion & feedback | Clarity & copy | Avg |
|---|---|---|---|---|---|---|---|
| Us | 2 | 1.5 | 2 | 2 | 1 | 2 | **1.8** |
| SF | n/a | n/a | n/a | n/a | n/a | n/a | n/a |

SF source: No such control in SF (correct) [I]

✅ **Achieved**
- Does not overlap any control (A6 check passes); opens a 6×6 grid of 36 buttons 53×48, 16 px.
- Useful for Owner: jump to any level on the main link.

❌ **Not yet**
- Visible by default on every screen (Home, play, map, upgrades) at (6,98): 58×36 px — below the 44 pt minimum height.
- System font 14/800, flat yellow: a third type family and a non-game look.
- Panel title in Vietnamese "Chọn màn để test" in an English UI.
- A tester will think it is a feature.

🔧 **Fix**
- Off by default; ?dev=1 or 5 taps on the level pill opens it — **P0 · S · Owner decision → app-dev**
- If kept: 48×48, Lilita, blue + gold, English label — **P2 · S · app-dev**

Earlier review: UX-2 / R1 partly (moved off controls, still shown)


## 3. Earlier items on main

| ID | Item (12/11) | Status on main v41 |
|---|---|---|
| UX-1 | Two UI systems | done |
| UX-2 | LV debug button | partly |
| UX-3 | Luckiest Guy in UI | done (file still embedded) |
| UX-4 | HUD diet ≤ 5 | partly (8 on L1, 11 on Hard) |
| UX-5 | Five rows at the top | partly (4 rows) |
| UX-6 | PASS tag 13 px | open |
| UX-7 | Idle BLAST | partly (lights up on 1st TNT; idle not grey) |
| UX-8 | Counter size/place | open (Owner) |
| UX-9 | Pause → top right | open |
| UX-10 | Booster chips | done |
| UX-11 | Dead controls in collapse | done (coin pill appears) |
| UX-12 | Win moment | partly (stamp works; tag 1.97:1) |
| UX-13 | Green fill on lose | open |
| UX-14 | Wordy lose card | done |
| UX-15 | Unlock card over hero | partly |
| UX-16 | Pause two toggle styles | open |
| UX-17 | Settings row layout | done |
| UX-18 | Reset styled as toggle | partly (confirm added) |
| UX-19 | Hard said 3× | partly; boss banner bug new |
| UX-20 | Tip on every level | partly (L1–L2 only; no fade; L32 bubble) |
| UX-21 | Outline token | open (10/6/4/3.5/2.7 px) |
| UX-22 | Four font files | open (Luckiest 23 KB, Fredoka 14 KB unused) |
| UX-23 | Old Home | done |
| UX-24 | Placeholders | open (Owner: kept) |
| UX-25 | BLAST label off centre | done |
| UX-26 | +1 TNT icon | open |
| UX-27 | Coin stream over logo | partly (+N at the pill in play) |
| UX-28 | Level pill vs meter | open (Owner N10) |

Earlier top-10: #1 port UI → **done**; #2 LV button → **partly**; #3 one type system → **partly** (only 2 families render; 2 dead files; 13 px text remains); #4 HUD ≤ 5 → **partly**; #5 counter like SF → **open**; #6 PASS notch + fill colour → **open**; #7 visible win → **partly**; #8 BLAST states → **partly**; #9 modals → **partly**; #10 boosters → **done** (icon still open).


## 4. Top 10 fixes across screens

| # | Fix | Screens | Priority | Effort | Owner |
|---|---|---|---|---|---|
| 1 | Boss = orange everywhere (banner "⚠ Boss! ⚠", PASS tag, card header); today a boss shows a purple "Hard!" banner | 13 | P0 | S | app-dev |
| 2 | Dev "Level" button off by default (?dev=1 for Owner); it is 58×36, system font, on every screen | 15, 01 | P0 | S | Owner decision → app-dev |
| 3 | Win timing: reach PASS → 1.2 s stamp → result, do not wait for full settle; drop the 1.97:1 CLEARED tag; verify on iPhone | 10, 09 | P1 | M | app-dev |
| 4 | Meter fill orange below PASS, gold at/over PASS (in play and on the lose card) | 11 | P1 | S | app-dev |
| 5 | HUD to ≤ 5: level number inside the meter, PASS as flag + "85%" 16 px, no HARD/BOSS word tag, tip fades after the first TNT | 07, 08, 13 | P1 | M | Owner decision (N10) → app-dev |
| 6 | Shop: hide the 4 "coming soon" taps or build a simple Shop (coin packs + No Ads) | 04, 01 | P1 | M | Owner decision (N1/N2) |
| 7 | Counter like SF: TNT badge 84×76 top left; pause → top right; idle BLAST grey | 07 | P1 | M | Owner decision → app-dev |
| 8 | Upgrades: own backdrop + tab bar kept, no red prices, 1-line effect per card, new "+1" icon | 03 | P1 | M | app-dev + design + content |
| 9 | Text floor 16 px: PASS 13, HARD/BOSS 12.6, "0%" labels 13, L32 tip 15, reset dialog ~11, map labels 15; drop the unused Luckiest (23 KB) and Fredoka (14 KB) files | 07, 13, 06, 05, 02 | P1 | S | app-dev |
| 10 | Modals: Pause = 1 row of 3 icons + Restart/Home/Resume; Reset as a link; NEW! card on the boss win or as a toast | 12, 05, 14 | P2 | S | app-dev |

After 1–5: the boss reads orange, no dev UI for testers, a win lands in ≤ 2 s after PASS, ≤ 5 HUD items, smallest text 16 px. Expected average on shared screens ≈ 3.8 vs SF 3.9 [I]. Note: SF scores for Pause (12) and Unlock (14) are [I] (not seen) and sit inside the shared average.


## 5. Keep
- No loading screen, the building assembling in place (SF loads 4–5 s [S·n]).
- The goal meter (SF shows no progress [S]).
- The kind lose card (no ad, no life lost) — SF shows two paid offers and an interstitial [S·n].
- The SF-pattern Hard pre-level card and purple Play on Home.
- Win without a card: stamp → "+N" → Home, as SF.


## 6. Files
- `screens/01-home.jpg` … `screens/15-level-picker.jpg` (15 images, ~3.2 MB) and `screens/index.html` (the phone page, Vietnamese).
- Rules respected in every fix: no real logos, no red cross, purple = Hard, orange = boss, body ≥ 16 px, targets ≥ 44–48 pt.
