# City Blast! v53 (TestFlight build 5) vs Smash Fest: UX/UI head to head, v2 (15/11/2026)

Reviewer: tester-uxui. Nothing in the game was edited, nothing committed or published.
v2 redoes the Smash Fest side from Owner's own recordings. What changed against v1 is in §8.

- Pairs: `pairs/01-launch.jpg` … `pairs/18-busfever-patterns.jpg` (ours left, other game right; red numbered boxes are referenced in the text).
- Phone page: scratchpad `h2h-sf/index.html`.

## 0. Sources and how each claim is marked

| Tag | Source | Use |
|---|---|---|
| **[R]** | Frames from Owner's Smash Fest screen recordings: `research/smashfest-scan/shots/` (53 files; all 52 game frames viewed, one is an iOS screen). | Primary SF evidence. |
| **[R08]** | The 07–08/11 recording analysis: `research/iphone-mirroring-2026-11-08/` (REPORT, CAPTIONS, DESIGN-COMPARE, APPLY-PLAN). | The only source of SF durations (±1 s, timed between captures). |
| **[N]** | Owner's insight notes of 10/11 (`305f6013-smash_fest_insight_cho_city_blast.md`): App Store / Google Play text, reviews, YouTube. Many lines there are themselves marked inferred. | Economy and review context only. Where it disagrees with [R], [R] wins (see §7). |
| **[W]** | Store / web facts already collected in `research/monetization/SF-SHOP-UPGRADES-NOADS.md`. | IAP list and prices. |
| **[BF]** | Bus Traffic Fever scan, `research/busfever-scan/` (fresh install, levels 1–3). | Secondary: the same publisher-style patterns. |
| **[O]** | Ours: `checkpoints/release/index-v53.html`, Playwright Chromium 393×852, DPR 2, touch, `?sa=59,0,34,0`, fresh save, real taps. Seeded saves only for L7 / L11 / L20 and the L2 lose. | All City Blast claims. Sizes are CSS points from a DOM census. |
| **[C]** | Read from the v53 code (animation keyframes). | Our millisecond timings. |

**Limits that matter**
- **No SF millisecond timings exist.** The recordings reached this repo as still frames without timestamps (`smashfest-scan/video/` is empty). SF durations are the ±1 s figures of [R08]. I did not invent finer numbers.
- The SF account in [R] was at L1–L6, L20–L27 and L316–L317. Nothing between.
- Sound and haptics are not assessed on either side (stills for SF, headless for ours).
- This VM renders slowly, so our times are game time or taken from code, never wall clock.
- Decided things are not argued with: double tap on L1 / BLAST on L2 (D-blast-TAP2), exact tap, no undo of a placed TNT, no stacking, pause in the left ear, popup only before Hard / Boss, coins 10 / 20 / 30. A fix that touches one is tagged **B**.

## 1. Verdict

**Smash Fest leads 4.1 to 3.8.** The recordings make the picture sharper in both directions.

- **Where SF is really ahead:** every single tap pays off at once (one tap, one shot, one hit) [R]; the HUD is two items [R]; a missed tap is answered with a hint and costs nothing [R]; the win is spent on the centre of the screen (logo, fireworks, coins and "+20" popping where the player is looking) [R]; the Home screen starts almost empty and grows with the player (No Ads badge only at L27, avatar and leaderboard later) [R].
- **Where we are really ahead:** 1 tap and 0.7 s into play [O] against 2 taps and a 4–5 s loading screen [R08]; a fail costs one tap [O] against Continue offer → playable ad of 15–20 s → a lost heart with a 30-minute timer → a second popup [R][R08]; our booster unlock (card, forced first use, aim view) is as complete as SF's [O][R].
- **Corrected from v1:** our win stamp is not "too brief". It is a 1.5 s animation [C]; my first capture missed it because of the slow VM. The win gap is about *where* the reward appears and the coin readout bug, not about a missing stamp.

Most fixes are polish inside decided features (A). These need Owner (B): UX-2, UX-6, UX-13, UX-14, UX-15, and the B halves of UX-3, UX-7 and UX-11.

## 2. Score table (1–5)

| # | Journey / axis | Us | SF | v1 (us / SF) | Evidence and reason |
|---|---|---|---|---|---|
| 1 | Launch: splash → Home | 4.5 | 4.0 | same | SF splash ≈ 9 s from icon to Home [R08]. Ours lands composed [O]. |
| 2 | Home | 4.0 | 4.5 | same | SF early Home is coins, hearts, one level button, 3 tabs [R `ui-home-L023`]; the button itself says "Level 20 / Hard Level". Ours: Play is clear, level is on a separate sign, Hard is colour only [O]. |
| 3 | Taps from launch to playing | 5.0 | 3.0 | same | Ours 1 tap, 0.7 s [O]. SF 2 taps + loading 4–5 s, about 15 s from icon [R08]. |
| 4 | Onboarding L1 / L2 | 3.5 | 4.5 | same | See §3. SF: one bubble of 5 words, then no text until L6 [R]. Ours: two input models and 2 cards in the same span [O]. |
| 5 | In-level HUD | 3.0 | 5.0 | same | 8 items vs 2 [O][R]. |
| 6 | Controls | 3.5 | 4.5 | same | SF has one control and answers a miss [R]. Ours is exact and richer, but a miss is silent [O]. |
| 7 | Feedback on screen | 3.5 | 4.0 | same | Our meter is a real plus. SF gives a muzzle flash and a hit for every tap [R]. |
| 8 | Win | 3.5 | 4.5 | 3.0 / 4.5 | Stamp confirmed, 1.5 s [C]. Reward still lands in a corner and the pill misreads (BUG-1) [O]. |
| 9 | Lose / retry | 4.5 | 2.5 | 4.5 / 3.0 | The full SF chain is now on record [R][R08]: see §5. |
| 10 | Pre-level offer | 3.5 | 4.0 | same | SF also shows a popup with only a locked tile (L20, "Level 23") [R], so ours is the same pattern; ours shows three, up to 24 levels early. |
| 11 | Booster unlock teach | 4.0 | 4.5 | new row | See §6. |
| 12 | Upgrades / Shop | 2.5 | 4.0 | same | SF Shop = 3 bundles + 6 coin packs [R], no Upgrades. Ours: Upgrades good, Shop is a toast [O]. |
| 13 | Settings / Pause | 3.5 | 4.0 | same | |
| 14 | Tap targets, type, safe areas | 4.0 | 4.0 | same | |
| 15 | Motion / transitions | 4.0 | 3.5 | same | SF win cuts straight to Home, loading blocks every level [R08]. |
| 16 | Clutter / words per screen | 3.5 | 4.5 | same | See §3 and §6 word counts. |
| | **Average** | **3.8** | **4.1** | 3.7 / 4.1 | |

## 3. FTUE, beat by beat: the first 20 taps

**Smash Fest [R]** (frames `L001-01`, `L001-02`, `L001-04`, `L002-fall`, `L003-win-fireworks`, `L004-open-two-platforms`, `new-box-L006-card`)

| Beat | Frame | On screen | Words |
|---|---|---|---|
| L1 opens | Balls 20 | Scene dimmed, spotlight on the 3×3 cans, hand on the cans, bubble "Tap to shoot a ball!". HUD = Balls badge + gear. | 5 |
| Taps 1–3 | Balls 17 | Bubble gone. Each tap fired a ball: cannon flash, cans knocked off. About half of the 9 cans are already down. | 0 |
| Taps 4–n | — | Same loop until the table is clear. 20 balls for 9 cans, so the level cannot realistically be lost. | 0 |
| L1 win | pill 1000 | HUD removed. Game logo drops in. The coin pill appears for the first time, showing a 1,000 start grant. | 0 |
| L2 | Balls 17 | A taller stack. No text, no hand. | 0 |
| L3 win | pill 1040 | Two fireworks, confetti, coins pop off the table, "+20". | 0 |
| L4 | Balls 13 | Two tables. No text; the layout is the lesson. | 0 |
| L6 | — | First full-screen card: "New Item! / Box / Hit the box to knock it down! / Tap to Continue". Tap anywhere. | 12 |

So across the first 20 taps a Smash Fest player reads **5 words**, learns **one gesture**, and gets **about 20 hits**. The first popup of any kind arrives at L6. The 1,000-coin grant covers exactly one 900-coin Continue, the same trick as Bus Fever (900 start, 900 revive) [BF].

**City Blast v53 [O]** (frames in `pairs/13-ftue-beats.jpg`, `pairs/03-onboarding.jpg`)

| Tap | What happens | Words new on screen |
|---|---|---|
| 1 | Home → Play. L1 plan phase 0.7 s later. Scene dimmed, spotlight (r 40) on one post, hand, "Double-tap!". HUD already shows pause, Level 1, 0 % meter, 3 locked chips, TNT 5. | Double-tap! · Level 1 · Lv.31 · Lv.21 · Lv.11 · TNT |
| 2–3 | Double tap (two taps within 300 ms [C]). TNT appears and blasts. If the two taps are slower, a TNT is placed, the counter goes 5 → 4 and the label does not change. | 0 |
| — | **No input for about 10 s of game time:** 6.2 s until the meter crosses 85 %, "CLEARED!" for 1.5 s [C], "+10", Home at 3.6–3.8 s after the line. | CLEARED! · +10 |
| 4 | Home → Play (now "LEVEL 2"). | |
| 5 | Full-screen card "New: BLAST / Tap to place. BLAST to blow them all." Dismiss only with **Got It**. | 11 |
| 6–10 | Place up to 5 TNT (a hand shows one spot). BLAST button turns red at the first one. | 0 |
| 11 | BLAST. Collapse. If the line is not reached the game returns to planning with the TNT that is left. | 0 |
| 12 | Home → Play. | |
| 13–14 | L3: a "New:" card for Brick, Got It, then a forced tap (per INTRO_SCHED; not captured in this run). | ≈ 10 (estimate) |
| 15–20 | Place and BLAST on L3. | 0 |

So across the first 20 taps our player reads **about 30 words** (the L3 share is an estimate), learns **two input models** (double tap on L1, tap + BLAST from L2), dismisses **2 cards with a button**, visits Home **3 times**, and gets **3 payoffs** (one per blast).

**What this means**
- SF's unit of fun is the tap. Ours is the blast. That is the nature of the two games and not a defect; a demolition is a bigger payoff than a can.
- The real costs on our side are the ones around the blast: 3 locked chips on the very first screen, a label that does not acknowledge the first tap, a miss that gets no answer, and cards that need a button where SF takes a tap anywhere.
- Bus Fever L1 teaches with a hand and **0 words** and keeps 3 locked tray slots "Lv.2 / Lv.3 / Lv.4" visible from the first screen [BF `L001-01`]. So locked teasers are a normal pattern of this publisher style **when the unlock is 1–3 levels away**. Ours are 10, 20 and 30 levels away.

## 4. Win sequence, frame by frame

**Smash Fest [R] + [R08]** (`prev-05g`, `L001-04`, `L003-win-fireworks`, `prev-06a…06d`, `ui-home-L020`, `ui-home-L027`)

| Step | What the frame shows |
|---|---|
| 1 | Last block falls (Balls 0 in the L316 run). HUD still up. |
| 2 | In the level: HUD removed, coin pill moves in at top left. L1: logo drop. L3: two fireworks + confetti across the upper half, 6–8 coins popping off the table, "+20" on the table itself. |
| 3 | About 3 s after the last block [R08] the game cuts to Home. No result card, no Next button. |
| 4 | Home: "+20" and a cluster of coins sit **in the middle of the screen** (≈ 53 % height), right above the next level button. The pill still reads 620. |
| 5 | Coins rise in a line with a light trail to the pill. |
| 6 | First coin lands: pill reads 622 and glows. The number counts up as coins arrive, it does not jump. |
| 7 | The next button is already live: "Level 317 / Hard Level", purple. |

**City Blast v53 [O] + [C]** (`pairs/14-win-sequence.jpg`, `pairs/07-win.jpg`)

| Game time after BLAST (L1) | What happens |
|---|---|
| 0 | Dust puff at the charge, HUD tray and BLAST hide, coin pill appears top right. |
| 0 → 6.2 s | Collapse. Meter fills orange. Pill counts 1 → 3 → 12 (BUG-1). |
| 6.2 s | Meter crosses 85 %, turns gold. "CLEARED!" stamp: 56 pt cream, navy outline, −5°, top at 31 %; scale 0 → 1.2 → 1.0 in 300 ms, hold, fade; **1.5 s total** [C]. Code also asks for 1.2 s of confetti and a 1.15× pill bump [C]; I did not see confetti in the two frames I froze. |
| 6.2 → 9.8 s | Camera holds. Rubble sits in the upper-middle; the lower 55 % of the screen is empty lawn. |
| 9.8 s | `done`: pill reads 57–58 for one sample, then 0; "+10" at 32 pt beside the pill (x 316–373, y 84–119). |
| ≈ 10 s | Home. The counter already reads 10 while a string of coins is still flying into it. |

**Differences that matter**
1. **Where the reward is.** SF puts "+20" and the coins where the eye already is (the table, then mid-screen on Home). Ours puts "+10" in the top-right corner for a moment.
2. **Count-up.** SF's number changes when a coin lands (620 → 622 …). Ours shows the final 10 before the coins arrive, so the flight explains nothing.
3. **The pill lies** (BUG-1): 12, then 57–58, then 0, then 10.
4. **Scale.** SF covers the upper half with fireworks and confetti. Ours is one stamp over a wide lawn.
5. **Speed is on par.** Line → Home is 3.6–3.8 s for us, about 3 s for SF [R08]. Do not lengthen it.

## 5. Fail → continue → offer chain

**Smash Fest [R] + [R08] + [W]** (`prev-08b`, `L020-lose-continue-900-no-offer`, `prev-09`, `prev-10`, `prev-11`, `prev-16a/b`)

| Step | Frame | Detail |
|---|---|---|
| 1 | Balls 0, tower standing | No "you lost" text. |
| 2 | "Continue?" panel | "+5" very large, "Add 5 balls to continue!", one green button "Play On ◎ 900", red ✕. 9 words. At **L20** this is the whole panel [R]. At **L317** a second card is attached below: **Fail Offer**, 2,500 coins + 5 balls + 3 rockets, VND 149,000 ($4.99 US [W]). |
| 3 | Wallet | In the L317 frame the wallet shows **640** against a price of 900. The button is still green; the only working path is the IAP or ✕. |
| 4 | After ✕ | A playable interstitial ("Bubble Pop"). Its close button appears after 15–20 s [R08]. |
| 5 | Home | Hearts 5 → 4 with a refill timer, 28:34 in the frame (30 min per heart). So the frame was taken ≤ 86 s after the heart was lost. |
| 6 | Next fail | A purple "Level 317 / Hard! / Select Booster / Try Again" popup; the booster tile now shows a green "+" (buy more). |

Minimum cost of one SF fail: 2 dismissals, 15–20 s of ad, one heart, then tap level → Play → loading 4–5 s to try again. Roughly **30 s and 4 taps** before the next shot (my sum of the [R08] figures, not a stopwatch).

Bus Fever runs the same chain with one softer step: "Out of Slot" offers **FREE** (rewarded ad, once per level, greyed the second time) next to "900", plus a Fail Offer card (2,700 coins + 3 boosters, VND 199,000), a "Restart" link and "Hold to see the board" [BF].

**City Blast v53 [O]** (`pairs/15-fail-chain.jpg`)

| Step | Detail |
|---|---|
| 1 | Last TNT used, line not reached. |
| 2 | Card: "NOT YET!" (33 pt), meter with the % reached (25 pt), one tip at 16 pt ("It falls toward the legs you break."), one green **Try Again** 292×66, Home icon 52×52 top left. 11 words. |
| 3 | Try Again → planning again. **1 tap, no loading, no heart, no ad.** |

This is our clearest UX win. It is also the place where SF and Bus Fever earn their money, and Owner's notes [N] argue for a softer, cheaper continue. That is a business decision, listed as UX-14 (B), not a UX defect.

## 6. Booster unlock teach, and text per screen

**Smash Fest [R]** (`ui-prelevel-hard-L020-booster-locked-L23`, `booster-rocket-unlock-L023-tutorial`, `-selected`, `-launch`, `-impact`)

| Step | Detail |
|---|---|
| L20 (3 levels early) | The Hard pre-level popup shows one grey tile with a lock and "Level 23". Nothing to pick; Play is the only action. |
| L23, popup | Everything dims except the tile. Bubble "You can select a booster to start the level with it!" (11 words). Tile carries a "Free" tag. A yellow arrow bounces up at it. Play is dimmed until the tile is tapped. |
| L23, picked | Tile turns green with a check. Play lights up. |
| L23, level start | Three rockets sit at the base of the table and fire by themselves. The impact frame still shows Balls 20: the booster paid off **before the first shot**, with no extra control to learn. |
| Later | The tile shows a count ("2") and, when empty, a green "+". |

**City Blast v53 [O]** (`pairs/16-booster-unlock.jpg`)

| Step | Detail |
|---|---|
| L1–L10 | Chip "Lv.11" locked in the play tray (with Lv.21 and Lv.31). |
| L11 opens | Full-screen card "Unlocked! / Wrecking Ball / Smash a whole chunk. / Claim ×2" (8 words). Button 265×84. |
| Plan phase | Scene dims, hand above the new chip, gold ring: forced tap. Chip badge "2". |
| After the tap | Aim view: crosshair on the building, "Tap to swing" (3 words), badge 2 (two throws). |

Same shape as Bus Fever's "X UNLOCKED! + FREE, then forced first use with a hand" [BF]. Ours asks for one more skill (aiming) where SF asks for none; the card and the forced tap are clear. **Keep it.** Score 4.0 against 4.5.

**Words on screen** (counted from frames; numbers and logos excluded)

| Screen | Us [O] | SF [R] |
|---|---|---|
| Home, first session | 6 (Level 1, Map, Play, Shop, Home, Upgrades) | 3 at L23 (Level 23, FULL, Home) |
| First play screen | 6 labels + "Double-tap!" | "Balls" + 5-word bubble |
| Plan / play, later | Level N, TNT, BLAST!, up to 3 "Lv.N" | Balls |
| New-thing card | 11 (New: BLAST) | 12 (New Item! Box) |
| Booster unlock | 8 on the card + 3 in the aim view | 11 in the bubble + "Free" |
| Pre-level | 6 (Hard Level 7, Pick Your Boosters, Play) | 5 (Level 317, Hard!, Select Booster:, Play) |
| Win | 2 (CLEARED!, +10) | 1 (+20) |
| Lose | 11 | 9 at L20; 12 with the Fail Offer card |
| Missed tap | 0 | 6 ("Tap on the items on the table") |
| Settings | 11 | 10 |

Text load is close on every card. The gap is in the **always-on HUD** and in how early the cards arrive (ours at L2 and L3, SF's first at L6).

## 7. Where the sources disagree

| Topic | Notes / web [N] | Recordings [R] | Used here |
|---|---|---|---|
| Win screen | "Level Cleared" text → fireworks → coins → **Next Level button** | No card and no button; cut to Home | [R] |
| Camera | Fixed, no zoom-in | Camera closes in as the tower shrinks (`prev-05d`) | [R] |
| Rocket unlock | Around L10–15 (inferred) | L23, teased at L20 | [R] |
| Tutorial style | Forced use of a flashing in-level icon (inferred) | Chosen in the pre-level popup; fires by itself | [R] |
| Interstitials | Every 5 levels | One seen right after a fail at L317; cadence not visible in frames | [N] for cadence, unverified |
| Reward | 20 / 50 / 100 | +20 on normal wins (1000 → 1040 over L1–L2; 620 → 640) ; Hard / Super Hard not seen | consistent |
| Continue | 900 coins for 5 balls; reviews call it too expensive | 900 at L20 and L317 | consistent |
| Lives | 30-min timer, resets if the app is opened early (reviews) | Timer 28:34 after one fail | consistent; the reset bug is [N] only |

## 8. What changed from v1

1. **UX-1 corrected.** v1 said the "CLEARED!" stamp was too brief to see. Wrong: it is a 1.5 s animation [C]; the slow VM hid it. The proposal is now about reward position, count-up and BUG-1. Win score 3.0 → 3.5.
2. **UX-2 softened** (P1 → P2, recommendation changed). Bus Fever keeps locked slots on screen from L1 and SF teases a locked tile 3 levels early. The issue is distance (10–30 levels), not the pattern.
3. **UX-8 changed from B to A.** SF itself shows a pre-level popup with only a locked tile. Skipping our popup is no longer proposed; only the wording.
4. **SF lose score 3.0 → 2.5** with the full chain on record.
5. **New row and section:** booster unlock teach (4.0 vs 4.5).
6. **New sections:** 20-tap FTUE table (§3), frame-by-frame win (§4), fail chain (§5), words per screen (§6), source conflicts (§7).
7. **New proposals:** UX-13 (Home grows with the player) and UX-14 (continue offer, business decision).
8. **New pairs 13–18** built from the recording frames; pair 07 rebuilt with the stamp visible.
9. Average 3.7 → **3.8** for us; SF stays 4.1.

## 9. Keep exactly as is

1. **One tap from Home to planning in 0.7 s** on normal levels. SF needs 2 taps and 4–5 s [R08].
2. **The lose card and the 1-tap retry** (§5).
3. **BLAST button states:** dull with nothing placed, red at the first TNT.
4. **The booster unlock sequence** at L11 (§6).

## 10. Bugs

- **BUG-1 · In-level coin pill shows numbers the player does not get.** Fresh save, L1, double tap a post, win. The pill counts 1 → 3 → 12 during the collapse, reads 57–58 for one sample at `phase: done`, drops to 0, shows "+10", and Home lands on 10 (`pairs/07-win.jpg` boxes 1–2; seen in two separate runs). On L2 the pill starts at 10, climbs to 12–17 across blasts, and the lose card shows 10. The reward rule is 10 / 20 / 30, lose 0 (D-blast-COIN), so the pill should never show more than bank + reward. I did not check whether the pickups are meant to be banked.
- **BUG-2 · Pause: Sound and Music buttons are blank when off.** With `mute: true, music: false`, both round buttons show only a slash on a grey disc (`pairs/11-settings-pause.jpg` box 1).

## 11. Proposals, ranked

Tags: **A** = polish / bug inside decided features. **B** = new element, feature or rule change, needs Owner (D-blast-NONEW).

### UX-1 · The win reward lands in a corner and the counter does not add up   [P1 · A]
- **Screen:** L1 win → Home (`pairs/14-win-sequence.jpg`, `pairs/07-win.jpg`).
- **SF [R]:** "+20" and the coins appear on the table, then mid-screen on Home; the pill counts up as each coin lands (620 → 622 …); fireworks and confetti fill the upper half.
- **Us [O][C]:** stamp 1.5 s at 31 % height (good). "+10" at 32 pt in the top-right corner; Home counter reads 10 before the coins arrive; pill misreads (BUG-1); rubble framed high with 55 % empty lawn.
- **Fix:** (1) BUG-1. (2) Show "+10" at 40 pt directly under the stamp (centre, ≈ 42 % height) for 600 ms, then let it travel to the pill in 400 ms. (3) On Home, start the counter at the old value and add as coins land (10 coins, 60 ms apart). (4) During the stamp, ease the camera 400 ms so the rubble centre sits at 50 % height. (5) Keep line → Home at ≤ 3.8 s. All existing elements.

### UX-2 · Locked booster chips are 10–30 levels away but sit in the first screen   [P2 · B]
- **Screen:** L1–L10 play tray (`pairs/13-ftue-beats.jpg`, `pairs/18-busfever-patterns.jpg`).
- **SF [R]:** HUD never shows a locked item; the tease is one tile in the pre-level popup, 3 levels early. **Bus Fever [BF]:** three locked slots from L1, unlocking at L2, L3, L4.
- **Us [O]:** "Lv.31 / Lv.21 / Lv.11" at 58×58 under the tutorial hand on L1.
- **Fix:** A) show only the next locked chip (Lv.11 during L1–L10, then Lv.21, then Lv.31), 44 pt, 50 % opacity. B) hide all until 3 levels before each unlock (SF's distance). Recommend A. Changes an element added on purpose, so B.

### UX-3 · A tap on nothing gives no response   [P1 · A part, B part]
- **Screen:** plan phase (`pairs/04-hud.jpg`, third frame).
- **SF [R]:** "Tap on the items on the table", white with a dark outline at ≈ 78 % height, seen at L23 and L317; the ball count does not drop (17 before and after), so a miss is free and explained.
- **Us [O]:** nothing changes on screen. With exact tap a near miss on a thin post looks like a dead game.
- **Fix:** on the 2nd empty tap within 4 s: (A) re-show the existing hint hand on the nearest valid spot for 1.5 s. (B) add one hint line in the existing `#tip` pill, ≤ 4 words ("Tap the building"), same position rule as SF: below the building, above the tray.

### UX-4 · Pause icons blank when off; Pause and Settings use two patterns   [P1 · A]
- **Screen:** `pairs/11-settings-pause.jpg`.
- **SF [R]:** one Settings sheet, three labelled icon buttons, reached from Home and from play alike.
- **Us [O]:** Settings = four labelled toggle rows (278×48). Pause = two unlabelled 74 pt icon buttons plus two toggle rows. BUG-2 on top.
- **Fix:** fix BUG-2 (keep the glyph at 45 % opacity under the slash). Give Pause the same four toggle rows (292×48, 8 pt gap) above Restart / Home / Resume. The card grows about 60 pt and still fits 375×667.

### UX-5 · The main button does not say what it starts; Hard is colour only   [P1 · A]
- **Screen:** Home, Upgrades, City Map (`pairs/02-home.jpg`, `pairs/17-home-evolution.jpg`, `pairs/10-upgrades-shop.jpg`).
- **SF [R]:** one button: "Level 23"; on Hard, purple with a second line "Hard Level" (L20, L27, L317), and the popup repeats "⚠ Hard! ⚠".
- **Us [O]:** Home: "Play", level on a 95×46 sign 300 pt above; before Hard L7 both turn purple with no word. Upgrades and Map: the green button reads only "Level 6".
- **Fix:** one rule on all three screens: line 1 "Play", line 2 "Level 6" at 16 pt; on Hard / Boss line 2 is "Hard · Level 7" / "Boss · Level 10".

### UX-6 · Shop tab is a dead end   [P1 · B]
- **Screen:** `pairs/10-upgrades-shop.jpg` box 2.
- **SF [R][W]:** 3 bundles + 6 coin packs.
- **Us [O]:** a third of the tab bar opens a 2-second toast "Shop: coming soon".
- **Fix:** A) hide the tab until the Shop ships; two tabs of 196 pt. B) keep it greyed with a "Soon" tag. Recommend A for a store build.

### UX-7 · The win target is never stated   [P2 · A + B]
- **Us [O]:** tick at 85 % without a number; lose card shows only the % reached. SF needs no number (clear the table) [R].
- **Fix:** (A) lose card: "3 % · need 85 %". (B) on L1–L3, a 12 pt "85 %" flag above the tick that fades after the first blast.

### UX-8 · "Pick Your Boosters" over three locked tiles   [P2 · A]
- **Screen:** first Hard level, L7 (`pairs/09-prelevel.jpg`, `pairs/16-booster-unlock.jpg`).
- **SF [R]:** does the same at L20, but with one tile and no instruction to pick: the popup just says "Hard!" and Play.
- **Us [O]:** the sub-line tells the player to pick, and nothing can be picked.
- **Fix:** while all three are locked, replace "Pick Your Boosters" with "Boosters unlock at Lv.11". Copy only.

### UX-9 · L1: the instruction ignores the first tap   [P2 · A]
- **Screen:** `pairs/13-ftue-beats.jpg`, second frame.
- **SF [R]:** the first tap already fires; the bubble is gone by the third ball.
- **Us [O][C]:** two taps slower than 300 ms place a TNT and leave "Double-tap!" unchanged.
- **Fix:** after a single tap change the label to "Double-tap the TNT!" and pulse the TNT at 1.2 Hz; widen the window to 400 ms on L1 only.

### UX-10 · "New:" cards need a button; SF's take a tap anywhere   [P2 · A]
- **Screen:** L2 "New: BLAST", L3 Brick (`pairs/03-onboarding.jpg`).
- **SF [R]:** "Tap to Continue", whole screen is the target; first card at L6.
- **Us [O]:** only "Got It" (275×87) dismisses; two cards inside the first three levels.
- **Fix:** let a tap anywhere on the card or scrim dismiss it after 400 ms (guard against an accidental tap); keep the button as the visible affordance.

### UX-11 · Camera: tray covers the building when zoomed; no way back   [P2 · A + B]
- **Us [O]:** `pairs/05-camera.jpg` box 1. SF's camera is automatic [R].
- **Fix:** (A) fade tray + BLAST to 35 % in 120 ms during a drag or pinch, restore 300 ms after. (B) a reset control: already open in TAP2-STATUS item 1.

### UX-12 · Targets at 44 and small map labels   [P2 · A]
- **Us [O]:** Upgrades price buttons 92×44; "Restart from Level 1" 278×44 as a text link right above Done (confirm step not tested); map "HARD" ≈ 13 pt and "Unlock at Lv 11" ≈ 14 pt high.
- **Fix:** 96×48; reset row 48 high with a 16 pt gap; map labels at font 16.

### UX-13 · Home shows everything on day one; SF's Home grows   [P2 · B]
- **Screen:** `pairs/17-home-evolution.jpg`.
- **SF [R]:** L23: coins, hearts, level button, 3 tabs. L27: No Ads badge appears. L316: avatar, gear in the top bar, Leaderboard tab.
- **Us [O]:** at L1 with 0 coins: Map, level sign, gear, Shop (toast), Upgrades (cheapest item 40 coins = 4 wins).
- **Fix:** A) reveal Upgrades with a one-time pulse when the first upgrade becomes affordable, and Map after L3; before that the bar shows Home only. B) leave as is. Navigation change, so B. It also removes most of UX-6 for new players.

### UX-14 · No continue offer on a fail   [P2 · B, business]
- **SF [R]:** +5 balls for 900 coins, later with a Fail Offer IAP. **Bus Fever [BF]:** FREE by rewarded ad once per level, or 900. **Notes [N]:** reviewers call 900 too expensive; Owner's note proposes a softer price.
- **Us [O]:** Try Again only.
- **If Owner wants it:** one extra row on the existing lose card, under the tip and above Try Again: "+2 TNT · ◎ 30" (three wins' worth, not forty-five), 292×56, never an ad before the retry. Not proposed as a UX fix; listed because the recordings show it is the genre's money moment.

### UX-15 · Navigation differs across the three tabs; no Privacy / Terms / Support   [P2 · B]
- **Us [O]:** Upgrades opens a full page with ✕ and no tab bar; Map renames the centre tab; Settings has no legal or support links. SF: persistent bar; Settings has Save, Support, Terms, Privacy [R].
- **Fix:** keep the bar on Upgrades; keep the centre tab as Home on the Map screen; add "Privacy · Terms" as two 48 pt text links in Settings.

## 12. Evidence index

| Pair | Shows | SF source |
|---|---|---|
| 01-launch | Splash and first Home | [R] |
| 02-home | Home normal / Hard | [R] |
| 03-onboarding | L1 teach, L2 card vs SF FTUE and New Item card | [R] |
| 04-hud | HUD, armed BLAST, empty tap vs SF HUD and hint | [R] |
| 05-camera | Orbit and pinch | [R] |
| 06-feedback | Blast → collapse → meter | [R] |
| 07-win | Stamp, "+10", Home vs logo, fireworks, "+20" | [R] |
| 08-lose | Lose cards | [R] |
| 09-prelevel | Pre-level offer | [R] |
| 10-upgrades-shop | Upgrades, Shop | [R] |
| 11-settings-pause | Settings, Pause on / off | [R] |
| 12-map | City Map vs Leaderboard / Profile | [R] |
| **13-ftue-beats** | First taps of L1 on both sides, SF L2 and L4 | [R] |
| **14-win-sequence** | Win in order, both sides | [R] |
| **15-fail-chain** | Fail → retry (ours) vs fail → Continue → ad → heart → Try Again | [R] |
| **16-booster-unlock** | L11 unlock (ours) vs L20 tease and L23 unlock | [R] |
| **17-home-evolution** | Home at L1 / L7 (ours) vs L23, L27, L316 | [R] |
| **18-busfever-patterns** | Locked tray, unlock card, forced use, lose, win card | [BF] |
