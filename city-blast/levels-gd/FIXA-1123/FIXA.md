# FIXA 23/11: three group-A fixes (Agents-Game, src/main only)

From the tester round of 23/11 (floormen `games/blast/feedback/2026-11-23/`: GD-76, UX-81, U-3 / GD-71). No new feature, no layout change, no level data touched.

## 1. GD-76: the Wrecking Ball card on L12, and the forced first use that carried into later levels
- **Cause:** the card waited for `save.level >= 11`, so a jump to L12 (picker) skipped it and the first win put it on L13. Once claimed, an unused Ball was re-queued on every later level (`!s.f`), so the dim layer swallowed TNT taps and BLAST on L14, L15, L17, L19.
- **Fix (`src/main/intro.js`):**
  - the card fires on its intro level, L12 (Drive-in, `INTRO_AT wreck: o21`), on any start of it; after L12 only when the save has reached it (old saves);
  - a claimed booster is never queued again;
  - the forced use ends on use, or when the level ends, retries or is left (`inEndForced`, saved). It never comes back on a later level;
  - Pause is not swallowed during a booster's forced use: a tap on it ends the forced use;
  - from the 2nd swallowed tap the booster button pops (the existing `inGot` animation). This gives feedback on the existing button, with no new element.
- **Headless, real taps:**
  - L12 from L11 beaten: card shown;
  - Claim: forced use, 2 taps swallowed, Pause, Home: `wreck {c:1, f:1}`;
  - L13, L14, L15 with that save: no card, no dim, 2 TNT placed by building taps, BLAST fires each time;
  - a picker jump to L12 from a level-4 save: card shown; Claim, then the spotlight tap arms the Ball.

## 2. UX-81: a tap on a locked booster gives an answer
- **Fix (`src/main/sflay.js`):**
  - the padlock tap now also shows the existing `#toast` with "Unlocks at Level N" for 2 s. N comes from `__blast.intro.lockLv(k)`, the same source as the pre-level sheet: Ball 12, Net 24, Sky 35;
  - the catcher's `aria-label` now carries the same words;
  - not on L1, where the rule is hand only and 0 words.
- **`src/main/polish.js` Q8:**
  - only buttons in the lower half set the toast's floor;
  - with sflay, the fixed TNT card (top-left, still inside `#bottom`) had pushed every in-level toast to y = -28, off screen.
- **Headless:** on L5, a tap on the Ball padlock shows "Unlocks at Level 12" at y 626 (above the corner buttons, 20 px), and a tap on the Sky padlock shows "Unlocks at Level 35". The toast is gone after 2 s. 0 TNT placed.

## 3. U-3 / GD-71: the fail line on a flat site
- **Fix (`src/main/polish.js`, after the K-block `failTip` wrap):** when a "not enough down" fail (`code pct`) ends on a flat site, the line is "Heavy pieces still count. Hit them." It is 6 words and fits on one line at 393 px. A flat site means:
  - the highest member still standing is at most 30 % of the building height, and at most 3 m;
  - (`standingHeight()` against `buildingH`).
- **Cases that keep their own line:**
  - collateral fails;
  - hard levels (Mac's lines);
  - levels whose line already names the heavy pieces;
  - any site that is not flat.
- **Headless, naive spread, all TNT:**
  - L17 Car Park, flat (standing 0 m of 14.2 m), 69 %: the new line;
  - L49 Grain Elevator (12.6 m of 25.4 m still up), 70 %: keeps "Cracked concrete stays cracked. Hit it again.";
  - L3 Old Tock (16.6 m of 50 m up), 73 %: keeps "Brick stacks stand until each pier is hit.".

## Checks (build `w-fixA.html`, 35 steps)
- loadcheck: ok=true, 0 errors
- `src/g7hard/check-order.js`: PASS (Ball unlock L12)
- `src/main/check-sflay.js`: 16 PASS, 0 FAIL
- `src/main/check-r22.js`: 23 PASS, 0 FAIL
- `src/main/check-camhard.js` 12, 13, 17, 42: 0 errors

## Shots
| File | Shows |
|---|---|
| fixa-1-L12-ball-card.jpg | L12 Drive-in: "Wrecking Ball Unlocked! Claim ×2" |
| fixa-2-L12-forced-pulse.jpg | The forced use after Claim; the 2nd swallowed tap pops the Ball |
| fixa-3-L13-tnt-placed.jpg | L13 after a claimed, unused Ball: no dim, TNT placed by taps |
| fixa-4-L15-blast.jpg | L15: BLAST fires |
| fixa-5-L5-locked-toast.jpg | L5: padlock tap shows "Unlocks at Level 12" |
| fixa-6-L17-fail.jpg | L17 flat at 69 %: "Heavy pieces still count. Hit them." |
| fixa-6-L3-fail.jpg | L3 not flat: its own line is kept |
