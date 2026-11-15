# City Blast! tutorial / onboarding audit (15/11/2026): status. Not committed, not published.

Owner's report on TestFlight build 3: on L1 he did not see the double tap being taught, and nothing introduced the BLAST button.
I played every teaching moment as a first-time player would: iPhone 15 viewport 393 × 852, `?sa=59,0,34,0`, real touch taps, normal
flags (no `?intro=0`, no `?dev`). I ran both the web main build and the native bundle (`native/www`, with a fake Capacitor runtime so the boot gate and splash path run).
Tool: `tools/tut-film.js [web|native] [moments]`. It writes `checkpoints/main-shots/tut-*.png` filmstrips (captioned frames), a matching `.mp4` and `tut-film*.json` with the state at each frame.

## Root causes (build 3)
1. **L1 teach too weak to read as "double tap".** The only cue was the small base hand with a two-press animation on a post: no ripple
   (the Figma frame 116:1071 has two tap ripples; the code never drew them), no dim, no highlight, no words. Next to the windmill, a
   white hand on sand is easy to miss, and a single tap already "works" (it places a TNT), so nothing tells the player to tap twice.
2. **The teach was keyed to `save.level`, not to the lesson.** TestFlight keeps localStorage across updates. Any build-2 save that had
   beaten L1 never got the L1 hand again, and the City Map plays the current level only, so L1 could not even be replayed. The L2
   "New: BLAST" card was stored as seen (`intro.blast`), so an updated tester never saw it again either.
3. **The BLAST button had no first-show emphasis.** It appeared grey under the L2 card with no pop and no glow.
4. **The boot gate and safe areas were not the cause.** Native: the gate lifts on the title screen (2.4 s, `why: stable`) before Play
   can be tapped, and the L1 hand shows on the native bundle exactly as on the web build (`tut-L1-native.png`). With `?sa=59,0,34,0`
   the hand, spotlight and label sit clear of the island and of the home-indicator band.

## Moments
| Moment | Seen before (build 3) | Problem | Fix | Evidence |
|---|---|---|---|---|
| L1 double tap | yes on a fresh save (weak); **never** for a build-2 save past L1 | no ripple / dim / highlight; keyed to save.level; a slow double tap (> 300 ms) did nothing, and a tap on the TNT is ignored (NOSTACK), so the player could get stuck | dim + gold spotlight on the post (then on the placed TNT), 2 "tap-tap" ripples on the hand's presses, label **"Double-tap!"**; before the first TNT only the spotlight takes taps (others swallowed, ring shakes); during the lesson a double tap is ≤ 600 ms / 40 px, and 2 taps on the TNT at any pace = BLAST; the lesson ends and is saved at the first blast | `tut-L1.png/.mp4`, `tut-L1-native.png/.mp4`; checks T1, T15–T18 |
| L2 BLAST intro | card yes (fresh save); never again for a build-2 save | button appeared with no emphasis | BLAST **pops in** (.4 → 1.15 → 1) with 3 gold glow pulses after Got It; glows again when the hand moves to it (both TNT placed); hand A → B → BLAST kept; lesson saved at the first BLAST | `tut-L2.png`, `tut-L2-native.png`; T7–T10, T19 |
| Old build-2 save | n/a | see root cause 2 | **tutorial version** `save.tutv = 2`: an older save loses the L1 / L2 lesson marks and the `blast` card mark once (in memory, written with the next save), so L1 / L2 teach again. A save already **past L2** (it cannot replay L1) gets a one-time **refresher**: after 4 s idle with a TNT placed, the hand double-taps that TNT + "Double-tap!" (no dim, nothing blocked) | `tut-L2-oldsave.png`, `tut-oldsave-refresher.png`; T20, T23 |
| L3 Brick | yes | none | none | `tut-L3.png` (card → dim + hand → wrong tap blocked → tap releases) |
| L5 Blue Building | yes | the forced tap made the player **tap the building they must keep safe** (mixed message) | `look:1`: spotlight + hand for 2.2 s, released by itself or by any tap; nothing to tap on it | `tut-L5.png`; T21 |
| L5/L6 rotate | **never** (schedule row `how:"tip"` that no code shows) | no rotate lesson anywhere | moved to **L6** (MATERIAL-CURVE "Rotate (blast the back)", one new thing per level), shown as a swipe: hand slides ↔ over arrows + "Swipe to turn". Taps and drags pass through, it ends and is saved at the first turn, it hides after 12 s or when the plan phase ends, and it shows again up to L9 | `tut-L6.png`; T22 |
| L8 Steel | yes | none | none | `tut-L8.png` |
| L11 Wrecking Ball unlock + forced use | yes | none (card, Claim ×2, dim on the tray chip, wrong tap blocked, tap = aim view "Tap to swing") | none | `tut-L11.png` |
| First Hard pre-level offer (L16, ball owned) | yes | none (hand on the Ball tile, pick = check, Play) | none | `tut-Hard-offer.png` |
| L11 "Blast in steps" | no (row `how:"tip"`, no presenter) | same gap as rotate; between blasts nothing told the player he may go on (the "Hit what still stands." tip is hidden) | row → `how:"wave"` (L11–15): the **first time a blast is not enough** (multi-wave rule: planning again with TNT left, after a TNT blast, not the ball alone) the pill **"Blast again!"** shows above the tray with a gold pulse on the TNT count; once a TNT is placed the pulse moves to BLAST (3 pulses). No hand, no spot, no dim, taps pass through. Ends and is saved (`intro.steps`) at the next BLAST or after 10 s; leaving the level hides it unsaved | `tap2-L11-steps.png`; T24–T26 |
| L35 "Trap barrels" | no (row `how:"tip"`, no presenter) | same gap; the level tip "Some barrels are a trap" was never explained | row → `how:"look"`: at the start of planning (after the Hard pre-level sheet and any card) a look-only panel under the HUD: **"Every barrel blasts"** + a 3-beat pictogram (TNT burst → a barrel goes off → the pier next to it breaks; = `failMember` → `cookOff`, 3 m blast). It names no barrel and no spot. 3.6 s, or the first tap after 0.6 s (that tap still places its TNT); saved (`intro.trap`) | `tap2-L35-trap.png`; T27–T28 |

## Files
- `main/tap2.js`: the TUTORIAL v2 block (K1 lesson keys `intro.t2l1` / `t2l2`, K2 `tutv`, K3 refresher `intro.t2ref`, L1 dim / ripple /
  label / blocked taps / lenient + slow double tap, L2 pop + glow). Test API `__blast.tap2.tut()`.
- `main/intro.js`: Blue Building `look:1`; rotate row → L6 `how:"swipe"`; the swipe presenter (`#inSwipe`); `intro.state().swipe`.
  Moment lessons (`#inMom`, CSS `#inMomCss`): L11 `how:"wave"` (`inStep`, hooked on `waveEnd`) and L35 `how:"look"` (`inLook`, from `startLevel`);
  they are NOT in the intro queue (the test helper `intro()` never waits on them); `intro.state().moment`.
- `main/check-main.js`: T15–T23 (tap2 section); I1 now allows the "Double-tap!" label (≤ 3 words, was 0 words); the `intro()` helper
  does not wait on the rotate swipe.
- `tools/tut-film.js` (new): the filmstrip / mp4 recorder. `native/tools/smoke-offline.js`: on L1 it taps the hand's post first (as a
  player would), and `SMOKE_WAIT_MS` sets the result wait.
- Figma `<figma-file>`, page "Intro cards premium (14/11)": 128:1100 L1 teach v2, 128:1121 L2 BLAST pop + hand,
  135:1052 L6 swipe lesson, note 135:1073 (L5 look only), 147:308 L11 "Blast again!" (TNT count pulse, then BLAST), 147:323 L35
  "Every barrel blasts" panel + pictogram, note 147:349.

## Checks
Build: `node tools/build-main.js` (27 steps, sources 0f025f2a0d72, run against a copy of that build), 390 × 844:
- `check-main` **tap2 24/0** (T1–T23 + Z1), **intro 14/0**, **pre 13/0**, **flow 24/0**, **home 24/0**, **nohint 7/0**, **ui2 6/0**. 0 console errors.
- `tools/loadcheck.js`: ok, title, 0 errors.
- L11 / L35 lessons (15/11, later the same day): build to a scratch copy (27 steps, sources f495edf1193d): `check-main` **tap2 29/0**
  (T1–T28 + Z1; new T24–T28), **intro 14/0**, **flow 24/0**, `loadcheck` ok, 0 console errors. T24 fresh progress at L11: nothing at the
  start, the label after the first blast that is not enough; T25 pulse moves to BLAST, ends at the next BLAST, saved; T26 a second
  not-enough blast on a replay shows nothing; T27 L35 panel after the Hard sheet, a tap passes through; T28 not again on a replay.
  Harness note: a page reload 1–3 s after a save write sometimes lost that LAST localStorage write in this Chromium harness (T26 and
  T28 were flaky that way), so T26 / T28 replay the level in-page; the save mark itself is read back from localStorage in T25 / T27.
- Native: `BLAST_SRC=checkpoints/index-main.html npm run cap:sync`, then `SMOKE_WAIT_MS=180000 node tools/smoke-offline.js` gives
  **SMOKE PASS** (L1 played to the result, 98 haptics bridged). With the default 40 s wait, L1 timed out in "settle" in this
  software-GL harness: the wait was too short; nothing failed.
- A real double tap (two taps ≤ 300 ms apart) cannot be produced with Playwright touch here (each tap takes about 0.6–1.6 s), so the
  filmstrips show the slow beginner double tap (T18 path). The fast path is checked by T5 with in-page pointer events.

## Open / proposals (not built, D-blast-NONEW)
1. Built 15/11 (see Moments). Note: L11 also has the Wrecking Ball card + forced use at the level start; the steps lesson only shows
   later, after a blast that is not enough, so the two never show together. MATERIAL-CURVE.md plans the ball on L12 and the trap on
   L34 (N, L35 combines); the code schedule (L11 / L35) was kept, moving them is the Lead's call. The tutorial version (`tutv`) stays 2:
   the two new marks (`intro.steps`, `intro.trap`) never existed before, so no old save needs them cleared.
2. L2: leg A and leg B are about 15 px apart on screen, so the hand barely moves between the two taps. That is level framing, a
   question for the opening camera agent.
3. D-blast-SCHED says boosters L12 / 22 / 33 and RC L31; the code (and this audit) uses L11 / 21 / 31 and RC "Dark Pier" L17. The schedule was not touched.
4. Hard offer: 1.5 s after Play the ball's aim view was not open yet (the opening camera was still running). The prelevel check P9 covers it; not re-tested here.
