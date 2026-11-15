# City Blast! vs Smash Fest: UI design head-to-head (12/11/2026)

Question from Owner: what should we optimise in our UI design against Smash Fest (SF)? That means what to remove, which fonts to change, and every other UI element.

This review builds on two earlier ones and does not repeat them:
- `H2H-DESIGN.md`: the whole game. It scored us 3.0 and SF 4.3.
- `uiclean/H2H-SMASHFEST.md` + `uiclean/TYPE-BUTTONS.md`: the UI pass of 11/11.

**Short answer.** On UI alone we score **2.8 / 5**. SF scores **4.2 / 5**.

The newest UI (`v32j` demo) is close to SF in buttons and type. The gap is elsewhere:
1. **Our gameplay build (`v10h`, L32) still runs the old UI.** That means Fredoka, Luckiest Guy cards, "LEVEL 1" in capitals, the coin pill in play, a cream tip bubble, an off-centre BLAST label and a visible `LV` debug button. So whatever a tester plays next does not have the 11/11 work in it.
2. **Too much HUD.** In play, SF shows 2 items and 1 word. We show 7 items on the newest L1 and 10–20 on the gameplay build.
3. **Small, faint signal text.** Our smallest text is the PASS tag (10.5–13 px). The win signal is a 12.8 px "CLEARED" tag at 1.9:1 contrast. SF's smallest text in play is about 20 pt.
4. **Mixed type system.** One build embeds four font families. Luckiest Guy turns Title-case text into "SAFeTY NeT" and "SeTTinGS".

Contact sheet: `ui-h2h/ui-h2h-overview.jpg`.

## How this was done

**Builds.** Both at 390×844, deviceScaleFactor 2, Playwright headless with the CDN scripts routed to local libs. No game file was edited.

| Build | File | Used for |
|---|---|---|
| **v32j** (latest UI) | `checkpoints/index-v32j-feel-demo.html` | Older levels, new UI, feel Q1–Q9 on |
| **v10h** (gameplay prototype) | `checkpoints/index-v10h-l32-monument.html` | L1–36, L32 Sky Saucer, old UI |

**Journey walked on each build:**
1. Home.
2. Settings.
3. Play, then level start.
4. Plan.
5. Real touch taps to place TNT.
6. BLAST.
7. Boom (+0.3 s) and collapse (+1.6 s).
8. Result.
9. Pause.
10. L32 (v10h), a Hard level (L24, v10h) and L8 (v32j).

**Measurements.**
- A DOM census at every step: position, size, font family, rendered px size, weight, stroke and shadow. The data is in the scratchpad (see "Files").
- Contrast is the WCAG ratio, from CSS colours or from sampled pixels.

**Limits. Please read.**
- The machine was very slow (load 25–35), and the physics runs in real time. Two results could not be reached through play:
  - The v10h L1 run reached 88 % at 180 s and was still settling.
  - L8 on v32j stayed in "settle" for 180 s.
- The **lose cards** were therefore forced with the game's own test harness (`__blast.test`: play, place 1 TNT, fire, run). The card UI is real. The scene behind it is not a real collapse.
- The **v10h win card was not captured.** The win shown is v32j L1, a real win at 98 %.
- The Q7 "CLEARED!" stamp did not appear in our frames. We sampled at about 250 ms and saw the game go from `done` to Home within 350 ms. It may have played between frames. Verify on a phone.

**Smash Fest evidence. It is thin.**
- **[QS]** One screenshot only: Owner's 3x in-play shot of a Hard level, `research/visual-gap-2026-11-09/smashfest-gameplay.png` (1320×2868 = 440×956 pt). The same image at low resolution is `art-brief/img/ref-smashfest.jpg`. Everything SF-measured below comes from that one frame, ±3 pt.
- **[S]** Written notes from our own 08/11 play session: `research/iphone-mirroring-2026-11-08/` (CAPTIONS, REPORT, DESIGN-COMPARE). The Home, pre-level, lose, Shop and Settings captions there were written by us but are **not in the repo as images**. Also `playbook/games/smash-fest.md` and `research/smashfest-brief/`.
- **[I]** My inference as a UX/UI designer.
- Not seen at all: SF's FTUE, pause card, the font's real name, motion timings and the win in motion.

## 1. Scorecard (1 = poor, 5 = best in class)

Rows 1, 5, 6a and 6b use the same dimensions as `H2H-DESIGN.md`. The rest are UI-only.

| # | Dimension | Us | SF | Evidence in one line |
|---|---|---|---|---|
| 1 | First impression (Home) | **3.5** | 4.0 | v32j Home is the Figma plate plus Q9 motion, one "Play", 3 tabs [QS]. v10h still says "Level 1" and shows a Lv 13 lock bubble and the `LV` debug button. SF: avatar, coins, hearts, gear, "Level 316" ~50 % wide, 3 tabs [S] |
| 5 | HUD and controls | **2.5** | 5.0 | v32j L1: 7 items, 4 text rows in the top 125 pt. v10h L1: 10. v10h L24 Hard: 14 HUD + 3 boosters + card. SF: 2 items, 1 word [QS] |
| 6a | Result screens | **3.0** | 3.5 | v32j lose card is clean: 4 items, 5-word tip. Win = a 12.8 px tag at 1.9:1, then Home within 0.35 s. v10h lose: 2 meters on screen, 26 words, "Try again" in lower case. SF: no win card, "+20" and coins fly to the pill [S] |
| 6b | Monetisation surfaces | **2.0** | 4.0 | Not retested. Daily, No Ads, coin "+" and Shop are still placeholders (Owner keeps them: N1/N2) |
| 7 | Typography | **2.5** | 4.5 | 4 families embedded (Luckiest 17 KB, Nunito 16 KB, Fredoka 10 KB, Lilita 10 KB). Visible outlines run 0–8 px. In-play text 10.5–43 px. Luckiest glyph mix. SF: one heavy rounded sans, thin dark outline + soft shadow, label ~20 pt, number ~36 pt [QS] |
| 8 | Colour semantics | **3.0** | 4.5 | The roles hold on v32j (green go, orange BLAST, purple Hard). But: idle BLAST is a muddy terracotta (#B5644B → #C78F78); the lose meter fill is **green** at 0–8 %; Restart sits in red in the Settings list. SF: purple = Hard across the badge and gear [QS] |
| 9 | Buttons and components | **3.5** | 4.0 | v32j: pill + gold rim + navy base (TYPE-BUTTONS), consistent. v10h: flat booster chips with 11–13 px text, a "TNT ×5" chip, white pause |
| 10 | Iconography | **3.0** | 4.0 [I] | Burst icon inside BLAST (v10h). The "+1 TNT" icon is a red box with a green plus (does not read as dynamite). Two toggle styles in Pause. SF gear and badge share one recipe [QS] |
| 11 | Hierarchy and spacing | **2.5** | 4.5 | Our top 160 pt holds up to 5 stacked rows (pill, meter + PASS, tip, Safe pill). The bottom 25 % holds BLAST + badge + undo + boosters + debug. SF: one corner badge, one corner gear; the scene owns 90 % [QS] |
| 12 | Feedback text / microcopy | **3.0** | 4.0 | Good: tips ≤ 6 words on L1. Weak: "HARD. Only one way is open." + HARD tag + purple pill (Hard said three times); "8% down, PASS is 85%. A new plan will do it." (11 words). SF hint only after a missed tap, 6 words [S] |
| 13 | Modals (pause, settings, unlock) | **3.0** | 3.5 [I] | Pause opens on top of the NEW! card (two modals). Settings (v10h): stray ✓ marks next to toggles, a 2-line centred label, DONE in Luckiest. SF pause was not seen |
| 14 | Consistency across screens and builds | **2.0** | 4.5 | Two live UI systems (v32j vs v10h). Title-case rule broken ("LEVEL 1", "DONE", "GOT IT", "Try again"). The Play label differs per build |
| | **Average** | **2.8** | **4.2** | |

If v10h had the v32j UI, rows 5, 7, 13 and 14 would each gain about 0.5–1.0. That would put our average near 3.2 **with no new design work**.

## 2. Measurements (390 pt wide)

| Measure | v32j (latest UI) | v10h (gameplay build) | SF [QS] |
|---|---|---|---|
| HUD items in play, idle | 7 (pause, level pill, meter, PASS, tip, TNT badge, BLAST) + hand | 10 (+ coin pill, undo, LV); L32: 12 (+ 3 booster chips); L24 Hard: 14 + 3 | 2 (Balls badge, gear) |
| Words in play | 7 ("Level", "PASS", "Tap a post. Then BLAST!", "TNT", "BLAST!") | 8–12 | 1 ("Balls") |
| Primary counter | TNT badge 58×58 (15 % of width), number 35 px, bottom right | "TNT ×5" chip 72×46, 2 lines of 13 px | Balls badge 98×85 pt (22 % of width), label ~20 pt, number ~36 pt, top left at 42 pt |
| Settings / pause button | Pause, top left, 48 hit / 41 visual | Pause, white, top left, 48 | Gear, top right, 60 pt |
| Level display | Pill 24.8 px, Title case | Pill 24.8 px, "LEVEL 1" in capitals | None |
| PASS tag | 13.1 px | **10.5 px** | None |
| Tip | Lilita 19.6 px, white, 3.5 px stroke, no box | Nunito 16.2 px in a cream bubble | None by default; "Tap on the items on the table" after a missed tap [S] |
| BLAST | 246×80, label 43.5 px; idle face #C78F78 (white 2.8:1) | Same + burst icon; label sits right of centre | No button: the tap is the shot |
| HUD during the collapse | 5 (tray hidden) | 9 (BLAST, "TNT ×0", undo and LV stay) | 2 |
| Coins over the HUD | At rest only (Q5) | The stream covers the meter and PASS at +0.3 to +1.6 s | n/a |
| Win signal | "CLEARED" tag 12.8 px, white on #49D526 = **1.9:1**, then Home within 0.35 s | Not captured | "+20" + coin arc into the pill, ~3 s [S] |
| Lose card | 4 items, 5 words of tip, "Try Again"; fill green at 0 % | 7 items, 26 words, "Try again"; HUD meter still visible behind the card | ~6 items, ~12 words [S] |
| Display families | Lilita One (ULClean) + Nunito 900 (+ Fredoka and Luckiest embedded) | Fredoka + Luckiest Guy + Nunito + system-ui (LV) | 1 [QS] |
| Home "Play" | "Play", Lilita 52 px, 10 px stroke | "Level 1", Fredoka 51 px, **16 px stroke** | "Level 316" ~50 % wide [S] |
| Card body text | Nunito 900, 16–18 px | Nunito 18 px #6E6380 on cream (5.1:1) | not seen |

## 3. Findings

Priority: P0 = before the next tester build. P1 = this sprint. P2 = later.
Effort: S ≤ ½ day, M 1–3 days, L ≥ 1 week.
**Owner** = needs his decision: it changes something he chose earlier or it changes the flow.

**UX-1 · All screens (v10h) · Two UI systems.**
- *Wrong:* the gameplay build has none of the 11/11 UI pass. That means Fredoka, "LEVEL 1" in capitals, the coin pill in play, the cream tip bubble, the "TNT ×5" chip instead of the badge, the off-centre BLAST label, the white pause button, Luckiest Guy cards ("GOT IT", "DONE") and "Level 1" on Home. Both builds were captured today, side by side (`ui-h2h-overview.jpg`).
- *SF:* one system everywhere [QS/S].
- *Fix:* port `uiclean` + `boosters2` + the TYPE-BUTTONS CSS, and the H1–H6 changes, onto the v10h stack. Then retire the v32j-only UI. This is B9 of H2H-DESIGN, UI half.
- **P0 · M**

**UX-2 · All screens (v10h) · Debug button in the shipping UI.**
- *Wrong:* a yellow `LV` button, 48×48 at (8, 788). It sits on the Shop tab on Home and next to BLAST in play. It is set in system-ui 16/800.
- *SF:* none.
- *Fix:* show it only with `?dev=1`.
- **P0 · S**

**UX-3 · Type, all screens · Luckiest Guy breaks Title case.**
- *Wrong:* "Safety Net" renders as "SAFeTY NeT" and "Settings" as "SeTTinGS". The font's lowercase glyphs are small caps with an odd "e". It is used for the NEW! card title (32 px), "GOT IT" (28 px) and "DONE" (28 px) on v10h.
- *SF:* one family, clean in both cases [QS].
- *Fix:* remove Luckiest Guy from the runtime UI (it stays only inside the logo image). Use Lilita One, Title case.
- **P0 · S**

**UX-4 · In play · HUD diet.**
- *Wrong:* 7 (v32j) to 20 (v10h Hard) census items against SF's 2.
- *SF:* a counter badge + a gear, nothing else [QS].
- *Fix:* target **≤ 5 items** on normal levels:
  - goal meter (with the level number inside it, at the left, "Lv 32");
  - TNT badge;
  - BLAST;
  - pause.
  - Undo shows only once a charge is placed.
  
  The level pill becomes part of the meter. That is the N10 option "B-lite": the number stays, but the pill goes.
- **P0 · M · Owner (N10)**

**UX-5 · In play, top of screen · Five rows of text over the sky.**
- *Wrong:* pill at y16, meter at y67, PASS tag at y50, tip at y96, and on Hard levels "Safe · 0%/10%" at y131. That is 160 pt of UI stacked over the skyline. The bottom of the screen meanwhile holds BLAST, the badge, undo, 3 boosters and LV.
- *SF:* top 42–127 pt holds one badge at left and one gear at right; nothing in the middle [QS].
- *Fix:*
  - one top row: pause (left) · meter with the level number (middle) · gear or nothing (right);
  - the tip moves down, just above BLAST, near the thumb, and fades 3 s after the first TNT on every level (today only on Hard, Q8);
  - "Safe" becomes an icon on the meter (Q8 already does this on Hard).
- **P1 · S**

**UX-6 · In play · PASS tag too small.**
- *Wrong:* 10.5 px (v10h) or 13.1 px (v32j), navy on white, in a tag 27–62 px wide. It is the smallest text in the game and it carries the goal.
- *SF:* smallest text in play ~20 pt [QS].
- *Fix:* replace the word with a flag icon plus "85%" at ≥ 16 px, sitting on the meter's PASS notch. Keep the tick mark.
- **P1 · S**

**UX-7 · In play · Idle BLAST reads as broken.**
- *Wrong:* before any TNT is placed, BLAST is a desaturated terracotta, face #B5644B → #C78F78. White text on it is 2.8:1 at the light part. It looks neither "off" nor "go". STYLE-GUIDE §8 says disabled = grey #C9C2B8.
- *SF:* no button at all [QS].
- *Fix:* idle = STYLE-GUIDE disabled grey with a navy outline. On the first TNT: orange #FF6A1A plus the 1.08× double bounce (spec §9).
- **P1 · S**

**UX-8 · In play · The counter is undersized and badly placed.**
- *Wrong:* TNT badge 58×58 (15 % of width), number 35 px, bottom right, beside BLAST. On v10h it is the "TNT ×5" chip, 2 lines of 13 px.
- *SF:* the shot counter is **the** HUD element: 98×85 pt, top left, number ~36 pt, label tab on top [QS].
- *Fix:* badge 84×76 at top left (16 pt margin, 44 pt from the top). The pause button moves to top right as SF's gear (UX-9). BLAST stays alone at the bottom.
- **P1 · M · Owner** (TYPE-BUTTONS put the badge at the thumb on purpose)

**UX-9 · In play · Pause button.**
- *Wrong:* top left, 48 hit / 41 visual. On v10h it is a white circle with a navy glyph, which reads as a system button.
- *SF:* gear top right, 60 pt, gold rim [QS].
- *Fix:* top right, 52 pt visual / 60 pt hit, the blue + gold recipe from v32j everywhere.
- **P2 · S**

**UX-10 · In play (v10h) · Booster chips.**
- *Wrong:* 3 chips, each about 52×46: "+1 ×2", "Net ×2", "TNT ×12". Icon about 20 px, text 11–13 px on 2 lines. "TNT ×12" repeats the TNT count. They are visible from L1, greyed when locked.
- *SF:* no boosters in play; picked before the level [S].
- *Fix:* use the boosters2 recipe: icon-only 58 pt circles with a count badge. Hide each one until it is unlocked **and** owned (N9 option C).
- **P1 · S · Owner (N9-C)**

**UX-11 · Blast and collapse (v10h) · Dead controls stay on screen.**
- *Wrong:* BLAST, a greyed "TNT ×0" chip, undo and LV stay through the collapse: 9 items. The coin stream flies over the meter and the PASS tag from +0.3 to +1.6 s.
- *SF:* HUD unchanged at 2, camera on the tower [QS].
- *Fix:* port uiclean S3 + Q5. The tray fades out in 150 ms at BLAST; coins wait until rest.
- **P0 (part of UX-1) · S**

**UX-12 · Win · No readable win moment.**
- *Wrong:* the only win signal in our frames is the meter tag "CLEARED": 12.8 px, white on #49D526 = **1.9:1**, no outline, 62×17 px. 0.35 s after `done` we are already on Home. The coin stream then crosses the logo and the tower. The Q7 stamp was not caught in our frames (see Limits).
- *SF:* "+20" in big type, coins arc into the pill, ~3 s [S].
- *Fix:*
  1. Verify that Q7 is on in v32j (56 px "CLEARED!" stamp + confetti).
  2. Hold the stamp for 1.0–1.2 s before the iris to Home.
  3. On Home, show "+N" at 32 px next to the coin pill, then fly the coins along the screen edge, not over the logo.
  4. The tag itself: 15 px with a 2 px #14460F outline, or drop it on a win.
- **P1 · S**

**UX-13 · Lose (both builds) · Green fill on a failed meter.**
- *Wrong:* the card meter fill is green at 0 % (v32j) and 8 % (v10h). Green is "go / passed" in our own colour roles (STYLE-GUIDE §0).
- *SF:* no meter [S].
- *Fix:* the fill is orange (BLAST) below PASS and gold at or above it, the same as the in-play meter.
- **P1 · S**

**UX-14 · Lose (v10h) · Wordy and doubled.**
- *Wrong:* the HUD meter + PASS stay visible above the card, so there are **2 meters**. Then "NOT YET!" + meter + "8% down, PASS is 85%. A new plan will do it." (11 words) + "Tip: Aim LOW: the ground floor." + "Debris coins +3" + "Try again". That is 7 items and 26 words.
- *SF:* ~6 items, ~12 words [S].
- *Fix:* the v32j card (4 items, 5 words), with the HUD hidden behind the scrim, and "Try Again" in Title case. Keep the +1 TNT rescue row when it applies.
- **P0 (part of UX-1) · S**

**UX-15 · Level start (v10h) · The unlock card covers the hero.**
- *Wrong:* on L32 and L24 a NEW! card ("NEW! / Safety Net / icon / 2-line body / 2 FREE / GOT IT", 6 items) opens while the building assembles. The player first sees a card, not the landmark. The body is Nunito 18 px grey #6E6380.
- *SF:* pre-level popup before loading, not over the level [S].
- *Fix:*
  - show the card after the hero has assembled (+0.8 s), or as a 1-line toast above the booster;
  - port H6 (no "2 FREE");
  - body ≤ 5 words in --ink.
- **P1 · S**

**UX-16 · Pause (both builds) · Two modals and two toggle styles.**
- *Wrong (stacking):* pause opens on top of an open NEW! card, so there are two scrims.
- *Wrong (card):* the card mixes two toggle styles: Sound and Music as 74 px icon buttons, Reduce motion and Vibration as row switches. 7 controls in all.
- *SF:* not seen. Food Hunt [S]: sound / music / vibration as one row of icons, then Replay, Home, "Tap to continue".
- *Fix:*
  - one row of 3 icon toggles (sound, music, vibration);
  - Reduce motion moves to Settings only;
  - Restart and Home as secondary, Resume as primary;
  - block pause while a card is open, or let the card's own button resume.
- **P2 · S**

**UX-17 · Settings (v10h) · Broken row layout.**
- *Wrong:*
  - ✓ glyphs sit in front of "Booster confirmation" and "Reduce motion", and the rows also have toggles;
  - "Booster confirmation" wraps to 2 centred lines while the other rows are left-aligned, one line;
  - the title is "SeTTinGS" in Luckiest and the button "DONE" in Luckiest.
- *SF:* not detailed [S].
- *Fix:* the v32j Settings card. Drop the ✓ marks. Rename to "Confirm boosters" so it fits one line.
- **P1 (part of UX-1) · S**

**UX-18 · Settings (both builds) · A destructive action styled like a toggle.**
- *Wrong:* "Restart from Level 1" is a full-width row in red #C2361C (5.0:1) between the toggles and Done, the same shape as the toggle rows.
- *SF:* no reset in Settings [S].
- *Fix:* move it to the bottom as a small text link, "Reset progress…", with a confirm dialog (red primary "Reset", grey "Cancel").
- **P1 · S**

**UX-19 · Hard level (v10h L24) · "Hard" said three times, plus a sentence pill.**
- *Wrong:* purple "LEVEL 24" pill + "HARD" tag + tip "HARD. Only one way is open." + "Safe · 0%/10%" pill at 14.8 px. That is 4 text rows and 16 items before the card.
- *SF:* colour change only (purple badge and gear) + "⚠ Hard! ⚠" in the pre-level popup [QS/S].
- *Fix:*
  - purple pill/badge only, with no HARD word in play;
  - a 1.2 s Hard banner at level start (spec §9 already has it);
  - tip without "HARD.";
  - Safe as an icon (Q8).
- **P1 · S**

**UX-20 · In play · Tip shown by default on every level.**
- *Wrong:* a tip line sits under the meter from the first frame on every level we opened (L1, L8, L24, L32).
- *SF:* no default hint. A 6-word hint appears only after a missed tap [S].
- *Fix:*
  - L1–L2 keep the hand + ≤ 6 words (Owner: keep);
  - from L3, show the tip only on a NEW! level, after a missed tap, or after 8 s idle;
  - auto-fade 3 s after the first TNT.
- **P1 · S**

**UX-21 · Type, all screens · Outline sizes all over the place.**
- *Wrong:* stroke widths in CSS px (visible ≈ half):
  - Play: 16 (v10h) / 10 (v32j);
  - DONE / GOT IT: 6;
  - Resume: 7 / 4;
  - BLAST: 4;
  - tip: 3.5;
  - TNT number: 2.7;
  - level pill, PASS, coins: 0 (a shadow only).
- *SF:* every white label has the same thin dark outline (~2 pt visible) + soft shadow [QS].
- *Fix:* one token. Visible outline = clamp(1.5, 0.07 × font size, 3) pt in the surface's own dark colour; shadow `0 2px 0` at 45 % of that colour. Ink text on cream: none.
- **P1 · S**

**UX-22 · Type, runtime · Four families shipped.**
- *Wrong:* v32j embeds Luckiest 17 KB, Nunito 16 KB, Fredoka 10 KB and Lilita 10 KB. Fredoka is only a fallback; Luckiest only feeds the cards.
- *SF:* one [QS].
- *Fix:* Lilita One (display) + Nunito 900 (body). That is −27 KB and one look. See §5.
- **P1 · S**

**UX-23 · Home (v10h) · Old Home elements.**
- *Wrong:* the "Level 1" label instead of "Play" (N4), the Lv 13 lock bubble (H5 removed it in v32j), and the milestone bar "Old Quarter 0/10 → Boss Lv 10" in Nunito 17.7 navy. That bar also contradicts Owner's 08/11 rule "no district names".
- *SF:* Home = one button with the level on it [S].
- *Fix:* port the v32j Home.
- **P0 (part of UX-1) · S**

**UX-24 · Home · Placeholders.**
- *Wrong:* Daily, No Ads, coin "+" and the Shop tab do nothing ("coming soon"). That is 4 dead taps on the first screen. In v32j the Upgrades tab also gets a red dot after the first win.
- *SF:* every Home control works [S].
- *Fix:* hide them until they work (Q10 of H2H-DESIGN). Keep the red dot only when an upgrade is affordable.
- **P2 · S · Owner (N1/N2)**

**UX-25 · In play (v10h) · BLAST label off centre.**
- *Wrong:* a burst icon in the left slot pushes "BLAST!" about 40 px right of the button's centre (E1 fixed this in v32j only).
- *SF:* n/a.
- *Fix:* remove the icon; centre the label (E1).
- **P0 (part of UX-1) · S**

**UX-26 · Iconography · "+1 TNT" icon does not read.**
- *Wrong:* a red rounded box with a green "+", used on the booster chip and the NEW! card. The v22 playtest said it does not read as dynamite.
- *SF:* one recipe for all HUD icons (gold rim, white glyph) [QS].
- *Fix:* the TNT bundle from the badge, with a small green "+1" badge. All booster icons as white glyphs on the blue + gold circle.
- **P2 · S (design)**

**UX-27 · Win → Home · Coin stream over the logo.**
- *Wrong:* about 12 coins fly from the top right down across "CITY BLAST!" and the crane sign to the pill (v32j, +0.35 s).
- *SF:* coins arc from the "+20" to the pill along open sky [S].
- *Fix:* spawn the coins near the pill (y < 120) with a short arc; the pill bumps 1.15×.
- **P2 · S**

**UX-28 · In play · Level pill and meter compete.**
- *Wrong:* a navy pill (24.8 px) above a white meter (17.4 px "0%"). The level number is louder than the goal. The meter is 240×20 with a 13 px tag hanging on it.
- *SF:* no level, no meter [QS]. Ours is a deliberate advantage (H2H-DESIGN §6.2) and we keep it.
- *Fix:* one 300×36 meter:
  - "Lv 32" at the left in 16 px;
  - "0%" at 22 px in the middle;
  - the flag + "85%" notch (UX-6).
- **P1 · S · Owner (N10)**

## 4. Remove

Every element to drop, **if it ships today**. "Port" means it is already gone in v32j, so porting UX-1 removes it.

| # | Element | Where | Why | Status |
|---|---|---|---|---|
| R1 | `LV` debug button | v10h, every screen | Debug in the shipping UI; sits on Shop and beside BLAST | Remove now |
| R2 | Luckiest Guy as UI text (NEW! titles, GOT IT, DONE, SETTINGS) | v10h cards | Mixed-case glyph bug, a third family | Remove (logo image keeps it) |
| R3 | Fredoka font file | Both builds | Fallback only, 10 KB, a second display face | Remove |
| R4 | Coin pill in play while planning | v10h | Not a decision input; H4 | Port |
| R5 | Separate level pill | Both | Fold "Lv N" into the meter | Owner N10 |
| R6 | The word "PASS" in the tag | Both | 10.5–13 px; a flag icon + % says it | Replace |
| R7 | Default tip line from L3 | Both | Shown only after a missed tap, on idle or on NEW! levels | Change |
| R8 | "HARD." in the Hard tip and the HARD tag in play | v10h Hard | Purple already says Hard; banner at start | Remove |
| R9 | "Safe · 0%/10%" sentence pill | v10h Hard | Icon on the meter (Q8) | Port Q8 |
| R10 | "TNT ×12" booster chip | v10h | Repeats the TNT count | Remove |
| R11 | Locked or unowned booster chips | v10h from L1 | Visible but useless | Hide (N9-C) |
| R12 | Undo before the first TNT | v10h | Nothing to undo | Show after the 1st TNT |
| R13 | Burst icon inside BLAST | v10h | Pushes the label off centre | Port E1 |
| R14 | BLAST, "TNT ×0", undo during the collapse | v10h | Dead controls over the payoff | Port S3 |
| R15 | Second meter (HUD) behind the lose card | v10h | Two meters, two PASS tags | Hide under the scrim |
| R16 | The lose sentence "N% down, PASS is X%. A new plan will do it." | v10h | 11 words; the meter already says it | Port v32j card |
| R17 | "Debris coins +N" row on the lose card | v10h | Reward noise on a fail | Remove (coins still count) |
| R18 | "2 FREE" pill on the unlock card | v10h | H6 | Port |
| R19 | "CLEARED" meter tag on a win | v32j | 12.8 px, 1.9:1; the stamp replaces it | Replace with stamp |
| R20 | ✓ glyphs in the Settings rows | v10h | Double state indicator | Remove |
| R21 | "Restart from Level 1" as a list row | Both, Settings | Destructive, looks like a toggle | Move to a link + confirm |
| R22 | Reduce motion and Vibration rows in Pause | Both | Settings items; 2 toggle styles in one card | Move to Settings |
| R23 | Lock bubble "Lv 13" on Home | v10h | H5 | Port |
| R24 | Milestone bar "Old Quarter 0/10 → Boss Lv 10" | v10h Home | District name (Owner 08/11: no district names) | Port v32j Home |
| R25 | Daily, No Ads, coin "+", Shop tab while they do nothing | Both Home | 4 dead taps | Owner N1/N2 (asked again) |

## 5. Typography

**What we ship today [QS, census]**

| Role | v32j | v10h | SF [QS] |
|---|---|---|---|
| Display family | Lilita One 400 (as "ULClean") | Fredoka 700 + Luckiest Guy 400 | 1 heavy, slightly rounded sans (face unknown; closest by eye: Lilita One, then Rubik 900) [I] |
| Body family | Nunito 900 | Nunito 900 + system-ui (LV) | not seen |
| Home Play | 52 px, 10 px stroke (5 visible), shadow 0 5 3 | 51 px, 16 px stroke (8 visible), hard 6 px shadow | ~34 pt in a ~50 %-wide button [S] |
| BLAST | 43.5 px, 4 px stroke | same + icon | n/a |
| Counter number | 35.2 px, 2.7 px stroke | 13 px in a chip | ~36 pt, ~2 pt visible outline + soft shadow |
| Counter label | "TNT" ~11 px tab | "TNT" 13 px | "Balls" ~20 pt tab |
| Level pill | 24.8 px Title case, shadow only | 24.8 px UPPER | none |
| Meter % | 17.4 px navy | 17.4 px | none |
| PASS tag | 13.1 px | **10.5 px** | none |
| Tip | 19.6 px white, 3.5 px stroke | Nunito 16.2 px navy in a cream bubble | hint ~18–20 pt, white, black outline, no box [S] |
| Card title | 33 px Lilita, 4 px stroke | 32 px Luckiest (glyph bug) | n/a |
| Card body | Nunito 900 16–18 | Nunito 900 18, #6E6380 | n/a |
| Buttons in cards | Lilita 21–28, 3–4 px stroke | Fredoka 21–30 with 5–7 px, or Luckiest 28 with 6 px | ~28 pt [S] |

**Recommendation**
1. **One display face: Lilita One**, everywhere text sits on colour or on the scene.
   - It matches SF's dense, heavy, regular letterforms best of the five we rendered (`ui-h2h/ui-h2h-typography.png`).
   - Rubik 900 runs ~12 % wider ("SO CLOSE!" overflows small chips).
   - Baloo 2 has a tall line box.
   - Fredoka is softer and wider.
   - Luckiest has the lowercase bug and reads "cartoon".
   - Keep Luckiest Guy **only** as the baked logo image. Drop the Fredoka file.
2. **One body face: Nunito 900** for card body, settings rows and prices, in --ink #2B2140 (not #6E6380), ≥ 16 px.
3. **Weights.** Display 400 (Lilita has one weight); body 900. No regular weight anywhere.
4. **Size scale** (pt at 390 wide). Nothing in play under 16:

| Role | Size |
|---|---|
| Hero | 48–52: Play, BLAST, win stamp 56 |
| Title | 32: ribbons |
| Button | 28 primary / 22 secondary |
| Counter number | 36; counter label 18–20 |
| Meter % | 22; meter "Lv N" and PASS notch 16 |
| Tip / hint | 20 |
| Card body | 17–18 |
| Floor | 16 (in play and on cards) |

5. **Outline + shadow** (one token, UX-21):
   - visible outline = clamp(1.5, 0.07 × size, 3) pt, in the dark of the surface (`--go-ol`, `--blast-ol`, `--hard-ol`, navy on the scene);
   - with `paint-order: stroke fill` the CSS stroke is 2× that;
   - shadow `0 2px 0` at 45 % of the same colour;
   - no outline on ink-on-cream text.
   
   Examples: BLAST 48 → 3 pt; Play 52 → 3 pt; tip 20 → 1.5 pt; counter 36 → 2.5 pt.
6. **Case.** Title case for buttons and labels ("Try Again", "Got It", "Done", "Level 32"). UPPER only for one-word shouts: BLAST!, NEW!, SO CLOSE!, NOT YET!, CLEARED!. That is the TYPE-BUTTONS rule; v10h breaks it in 6 places.
7. **Numbers.** `font-variant-numeric: tabular-nums` on the counter, coins and % (Lilita has tabular digits).
8. **Contrast floor.** White on any fill needs ≥ 3:1 for the fill alone, or the outline token. "CLEARED" (1.9:1) and the idle BLAST (2.8:1) fail today.

## 6. Top 10 actions

| # | Action | Findings | Priority | Effort | Who |
|---|---|---|---|---|---|
| 1 | **Put the v32j UI on the gameplay build** (uiclean + boosters2 + TYPE-BUTTONS + H1–H6 on v10h) and keep one UI from now on | UX-1, 11, 14, 17, 23, 25 | P0 | M | app-dev |
| 2 | **Remove the `LV` debug button** (dev flag only) | UX-2 | P0 | S | app-dev |
| 3 | **One type system**: Lilita One + Nunito 900; drop Luckiest (UI) and Fredoka; size floor 16; outline token | UX-3, 21, 22 | P0 | S | app-dev |
| 4 | **HUD to ≤ 5 items**: meter carries "Lv N"; tip fades at the first TNT and only shows on NEW!/miss/idle; Safe and Hard as colour or icon | UX-4, 5, 19, 20, 28 | P0 | M | app-dev, **Owner N10** |
| 5 | **Counter like SF's**: 84×76 TNT badge top left, number 36; pause to top right as a 60 pt gear | UX-8, 9 | P1 | M | app-dev, **Owner** |
| 6 | **PASS notch**: flag + "85%" at 16 px on the meter; fill orange below PASS and gold above, everywhere including the lose card | UX-6, 13 | P1 | S | app-dev |
| 7 | **A win you can see**: verify the Q7 stamp, hold 1.0–1.2 s, "+N" 32 px by the pill, coins along the edge | UX-12, 27 | P1 | S | app-dev |
| 8 | **BLAST states**: grey idle → orange with a double bounce on the first TNT; no icon | UX-7, 25 | P1 | S | app-dev |
| 9 | **Modals**: unlock card after the hero assembles, 1 line; pause = 3 icon toggles + Restart/Home/Resume; Reset progress as a link + confirm | UX-15, 16, 18 | P1 | S | app-dev, content (copy) |
| 10 | **Boosters**: icon-only circles, shown only when unlocked and owned; new "+1 TNT" icon | UX-10, 26 | P1 | S | app-dev, design, **Owner N9-C** |

Expected result after 1–4, measured with the same census:
- normal levels: ≤ 5 HUD items and ≤ 3 words;
- smallest in-play text ≥ 16 px;
- 2 font families;
- one UI in every build.

## 7. Keep (we do this better or on purpose)

- **The goal meter.** SF shows no progress at all. Keep it, but merge it with the level number (UX-28).
- **v32j lose card.** 4 items, a 5-word cause tip, kind wording ("NOT YET!"). Clearer than SF's Continue + Fail Offer.
- **v32j button system.** Pill + gold rim + navy base, colour per tier (green go, orange BLAST, purple Hard, orange Boss). It matches SF's recipe [QS].
- **No loading screen**, iris into the level, the building assembling.
- **L1–L2 tutorial hand** + ≤ 6-word line.

## 8. Files

| File | Shows |
|---|---|
| `ui-h2h/ui-h2h-overview.jpg` | Journey contact sheet: the SF shot, then the v32j and v10h rows (Home → result → pause → settings) |
| `ui-h2h/ui-h2h-hud.jpg` | SF in play vs v32j L1 vs v10h L1 vs v10h L24 Hard, every UI item boxed and numbered, measurements |
| `ui-h2h/ui-h2h-home.jpg` | Home, both builds |
| `ui-h2h/ui-h2h-blast.jpg` | Boom and collapse frames, both builds (HUD that stays, coins over the HUD) |
| `ui-h2h/ui-h2h-result.jpg` | Win (v32j, then Home 0.35 s later), lose v32j, lose v10h |
| `ui-h2h/ui-h2h-L32.jpg` | L32: NEW! card first, hero plan with 12 UI items, pause |
| `ui-h2h/ui-h2h-pause-settings.jpg` | Settings and pause, both builds |
| `ui-h2h/ui-h2h-typography.png` | SF HUD crop + the same strings in Luckiest, Fredoka, Lilita, Rubik 900, Baloo 2 800 |

- Capture scripts, raw 2x shots and the census JSON are in the session scratchpad (`uih2h/`: `journey2.js`, `journey3.js`, `res.js`, `ann.py`, `sheets.py`, `shots2–4/*-data.json`). They are not in the repo.
- The SF image inside the sheets is Owner's own screenshot, shown for comparison only.

## 9. Not checked

- SF Home, pre-level, lose, Shop and Settings as images. Only our written notes exist; the images are on Owner's Mac. Adding 5–6 of them to the repo would turn most [S] rows into [QS].
- SF's font name, motion timings and win in motion.
- The v10h win card. The Q7 stamp on v32j (see Limits).
- Real phones: safe areas, notch, the 375×667 layout. Sound and haptics.
- Upgrades, Map and Shop screens (not part of this journey).
