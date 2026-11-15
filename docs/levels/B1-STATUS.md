# Batch B1: L6, L7, L11, L16, L19, L35 (halls / wide low masses) · built on STD-v2, gated on **STD-v3**

D-blast-ROLLOUT batch B1 (LEVEL-NEEDS §4 row B1). Built against **STD-v2** (blast-proof floors, fail text ≤ 9 words, K1 ladder
materials to L16), then the whole §6 bot set re-run on **STD-v3** (D-blast-NOHINT, 14/11: no cue / damage dots, no tip line, no push-in,
fail text names a principle). Every number below is STD-v3 (no `?hints=1`). Not committed by the agent; main build untouched; v10–v14,
v15-a1 and the other batches' files untouched.

## 0. Files

| File (B1 owns) | What |
|---|---|
| `levels6/patch/v15-b1.js` | Part kinds `b1dome` (F14: L6, L16, L35), `b1arch` (F10: L7), `b1shell` (F05: L11), `b1cubes` (F35: L19), `b1blk` (frame-block neighbour with the hall rule); **the hall rule** `B1.hall()`; the data of the six levels; small run-time hooks (dud text, collateral tip with the card's building name, no dots on B1 levels). Calls `M14.api.*` only. `?b1=0` = the old six levels; test API `window.__blast.b1`. |
| `levels6/tools/src-b1.js` | Build → `checkpoints/index-v10i-b1.html` (opens L6, LV picker). **Base:** the A1 checkpoint on disk predates NOHINT, so without an argument the base is rebuilt in the temp dir from the read-only `index-v10f-l13-36.html` with the **current** v14 (`src-l32.js`) + v15-a1 (`src-a1.js`); nothing else on disk is written. `B1_BASE=disk` = use `index-v10i-a1.html` as is. |
| `checkpoints/index-v10i-b1.html` | The build (3.58 MB). |
| `levels6/shots/b1/` | Shots (§5), `tile-vs-game.png`, `newcomer-run*.json`, `logs/` (every bot output), `tools/` (below). |
| `levels6/shots/b1/tools/` | `rest.js` (at-rest check) · `b1bots.js` (structured hero checks: single pier, upper member, rule rows, N random few-TNT plans, lesson alt) · `vardiag.js` (time-bot's sensible variants with what each placed) · `legfoot.js`, `jitter.js`, `newcomer.js`, `gesture-b1.js` (from A1, adapted: blind newcomer, booster cards closed) · `winshot.js` (expert plan in the real loop + zoom / mid-collapse / win shots) · `shot.js` · `tilevs.py`. |

```bash
cd games/blast && node levels6/tools/src-b1.js
export BLAST_LIBS=<scratchpad>/libs NODE_PATH=/opt/node22/lib/node_modules G=checkpoints/index-v10i-b1.html V=6,7,11,16,19,35 T=levels6/shots/b1/tools
node tools/loadcheck.js $G ; node $T/rest.js $G
MAXL=36 LIVE=2 node levels6/tools/determinism-check.js $G $V 3
N=4 node levels6/tools/gate-bot.js $G $V ; K=8 node levels6/tools/time-bot.js $G $V ; K=24 node levels6/tools/search-bot.js $G $V
N=16 MODE=random,face node levels6/tools/foot-bot.js $G '' $V
N=12 node $T/b1bots.js $G ; N=16 MODE=random node $T/legfoot.js $G ; K=12 node $T/jitter.js $G
SHOTS=levels6/shots/b1 node $T/newcomer.js $G $V 2 ; node $T/winshot.js $G $V levels6/shots/b1 ; LV=6 node $T/gesture-b1.js $G
```

## 1. What was built

| L | Tier · lesson | Hero (tile) · twist | Material | Size | Members | Seen through the glass |
|---|---|---|---|---|---|---|
| 6 | N · back row out, mind the school | F14 dome hall: portico + pediment + steps, drum with a ring of columns, slate dome + lantern, two wings with an arcade and tall windows, small dome at each wing end · twist: the ground storey is glazed, the domed hall seen behind the portico | ladder concrete (K1): `concrete` piers, `b1dk` cassettes (blast-proof, steel-type joints) | 62 m wide, 13 m roof, 21 m drum, 36 m finial (old 25 × 17 m) | 139 bodies | domed hall: round bench, statue, hanging lamps; wings: `floorIn` floors (desks, lamps, plants) |
| 7 | H · fall along the street | F10 triumphal arch: big arch, two side arches, courses, cornice, stepped attic · twist: the upper attic is a lit glass gallery | ladder concrete | 46 × 12 m, 37 m (old 28 × 20) | 210 | gallery: sofas, plants, lamps; lit stair slots in the two big legs |
| 11 | R teach · blast in steps (sheds first) | F05 shell hall: podium with columns + steps, glass hall, four folded shells fanning up to the front, planters · twist: a blue glass gable under the top shell | ladder concrete | podium 40 × 26 m (6 m), hall 32 × 18 m, shells to 32 m (old 22 × 11) | 58 | lobby (`floorIn`) through the podium glass; stage + rows of seats through the hall's glass front |
| 16 | H · all fall away from the hospital | F14 (reuse) · terracotta dome | ladder concrete | as L6 | 139 | as L6 |
| 19 | N (surprise) · one pole, one TNT | F35 cube grove: seven yellow cubes on a corner, grey roof faces, windows, each on one grey pole, in an arc | poles ladder concrete (LEVEL-NEEDS exception, K1) | poles 13 m, cubes to 27 m (old 5 cubes, 14 m) | 56 | windows lit on the drawn cube (the house box is inside it) |
| 35 | H · outer sides only (trap drums) | F14 (reuse) · green dome | **RC** (`hrc` piers, `mdeck` cassettes, `rcDecor`; tier `M14_RC`, K1 from L17), one monolithic frame | as L6 | 139 | as L6 |

Own tile score at phone size (1–5): L6 4 · L7 4 · L11 3.5 (from the opening the shell fan reads as a pale peaked roof; the zoom reads) · L16 4 · L19 4 · L35 4. `tile-vs-game.png` = tile | opening | zoom.

All six: `mon:1`, `lotK` 2.4–2.8, opening **whole** (v3), 0 bonds cracked at rest (360 steps, `?debug=1`), 0 members moved, loadcheck
ok / 0 errors. Bodies per level 88–352 (L7 352: arch 210 + concrete tower 72 + keeps; under the 450 guide). Decor pieces 331–1,209.

### 1a. The HALL RULE (B1's own collapse logic: API candidate)

A tower has one ring of legs and tips (`M14.api.tip`). A hall is a long roof on ROWS of piers. `B1.hall({ lines:{face:[piers in order]},
skin, decks, all, hinge, mid, link, shove, onFall })`:
- two piers **next to each other in one row** blasted (TNT or a drum; rubble does not count) → the rest of that row gives way from the
  gap outwards (0.1 s a pier, game time), with the skin panels that touch it; the short-side piers (`mid`) 0.3 s later;
- the opposite row is a **hinge** for `hinge` s: cut loose from the ground slab (not crushable) so the frame turns over towards the
  lost row; the roof cassettes get a one-off shove that way (4 m/s, 0.45 s) because a 6 m frame only turns through its own height;
- one lost pier, or two that are not neighbours, never drop it (cassettes blast-proof);
- `link`: the same row of another hall follows 0.3 s later (L35: the RC hall is one frame);
- **no stubs**: 0.8 s after the last roof cassette is down, every member of `all` still standing goes (40 % of the score is the
  tallest member standing: a low wide hall lost 5–15 points to two piers left on a corner).
The F14 centre carries the dome and uses `M14.api.tip` (it tips like a tower); the portico is one piece (a column lost drops it whole,
forwards). Deterministic (game-time `later()` only).

## 2. Levels: surroundings, texts, intro

| L | Surroundings (difficulty) | TNT | Expert plan | Lesson-less plan (must fail) | Level tip · fail principle (≤ 9 words) |
|---|---|---|---|---|---|
| 6 | school in front of the steps; timber shed (wood `b1blk`) behind; brick kiosk out of the way | 10 | back pier pairs of both wings and the centre (7) + shed back pair (2) → 9, spare 1 | the same on the front row → falls on the school | "Fall away from the school." · "A hall falls toward the side it loses." |
| 7 | tram stop behind the arch, concrete tower (6 storeys) behind the stop with a school and a hospital at its sides | 11 | front piers of the four legs (8) + tower back pair (2) → 10, spare 1 | arch backwards (check) · tower forwards (alt): both collateral | "HARD. Fall along the street." · "Every part falls toward the piers it loses." |
| 11 | two timber sheds in front of the podium's front row; school right behind; hospital at the side | 8 | blast 1: the sheds' front pairs (4); blast 2: three front piers (3) → 7, spare 1 | one blast: sheds + the reachable back row → falls on the school | "Sheds first, then the hall." · "Clear what blocks first. Blast in steps." |
| 16 | hospital in front of the steps; a 5-storey brick block on each side of it | 12 | hall back row (7) + each block's two outer legs (4) → 11, spare 1 | hall forwards (check) · blocks inwards (alt) | "HARD. All fall away from the hospital." · "Each building falls toward the side it loses." |
| 19 | water tank on four concrete legs behind the grove; brick kiosk out of reach; no protected building | 10 | one TNT on each of seven poles + two tank legs → 9, spare 1 | two TNT a pole → runs out before the last houses (35 %) | "One pole, one TNT." · "Each house stands on one pole. Count your TNT." |
| 35 | school in front; a 4-storey block on steel legs at each side of it; red drums at all three **outer** legs (help: a drum = the second TNT on a steel leg) and two at the **inner** legs (the trap: they push it towards the school) | 11 | 3 + 3 TNT on two back piers side by side (RC) + one TNT on each of the blocks' two outer legs → 10, spare 1 | hall forwards (check) · blocks inwards (alt, with the trap drums) | "HARD. Drums blast for free. Mind blue." · "Drums blast for free, even next to blue." |

Collateral fails read "It fell on <the building the card names>. Steer the fall away." Dud text: "Not yet. Two piers side by side!"
(L19: "TNT right on a pole!", L35: "Reinforced piers need more TNT."). All texts name a principle, never a spot (v3).

**INTRO_SCHED** (`main/intro.js`): L11 = Wrecking Ball unlock card + forced first use, and the "Blast in steps" lesson tip; L35 =
"Trap barrels" tip. L11 is a breather (R, expert +10, sensible 4/4) and the ball's natural first target is a **shed** (they stand in
front of the podium on the side the opening camera faces; the ball comes from the camera's quarter): target selector **`S:z+`** (or
`R:z+`). Not verified in the main build (the intro layer is not in this checkpoint): check with `main/check-main.js` when merged.
L35's drums sit at the outer legs (help) and inner legs (trap) as the schedule wants. Steel (L35 block legs) is after L8, RC after L17,
brick after L2: no first appearance in B1.

## 3. Targets vs measured (STD-v3, §4 / §4b by tier)

Gate N = 4, foot N = 16, search K = 24, time K = 8. L35 after round 2 (§4); the others round 1.

| Metric | L6 N | L7 H | L11 R | L16 H | L19 N | L35 H |
|---|---|---|---|---|---|---|
| TNT given (tier band) | 10 ✓ (8–11) | 11 ✓ (10–12) | 8 ✓ (7–9) | 12 ✓ | 10 ✓ | 11 ✓ |
| Expert 4/4, margin | 93 % **+8** ✓ (+3…+8) | 90 % **+5** ✓ (+3…+6) | 95 % **+10** ✓ (≥ +6) | 91 % **+6** ✓ | 93 % **+8** ✓ | 91 % **+6** ✓ |
| Expert blasts · spare TNT | 1 · 1 ✓ | 1 · 1 ✓ | 2 · 1 ✓ | 1 · 1 ✓ | 1 · 1 ✓ | 1 · 1 ✓ |
| Expert in the real loop | 92.6 ✓ | 90.5 ✓ | 95.5 ✓ | 91.4 ✓ | 93.3 ✓ | 91.5 ✓ |
| Sensible (gate) | 4/4 ✓ | 0/4 (61) ✓ (0–2) | 4/4 ✓ | 0/4 (69) ✓ | 4/4 ✓ | 0/4 (71) ✓ |
| Sensible variants (time-bot 8) | 8/8 ✓ (6–8) | 4/8 ✓ (3–5) | 8/8 ✓ (7–8) | 4/8 ✓ | 8/8 ✓ | 4/8 ✓ (was 2/8) |
| Naive | 0/4 ✓ | 0/4 ✓ | 0/4 ✓ | 0/4 ✓ | 0/4 ✓ | 0/4 ✓ |
| Lesson-less (check · alt) | 0/4 ✓ | 0/4 · fails ✓ | 0/4 ✓ | 0/4 · fails ✓ | 0/4 ✓ | 0/4 · fails ✓ |
| Foot random 16 / face (foot-bot) | 0 / 0 ✓ | 0 / 0 ✓ | 0 / – ✓ | 0 / 0 ✓ | 0 / 0 ✓ | 0 / 0 ✓ |
| Leg-foot random 16 (hero legs too) | 1 ✓ (≤ 1) | **2 ✗** (H 0) | 1 ✓ (≤ 5) | 0 ✓ | 1 ✓ | 0 ✓ |
| Search 24 | 0 ✓ (≤ 2) | 0 ✓ | 1 ✓ (≤ 6) | 0 ✓ | 0 ✓ | 0 ✓ |
| Jitter (person's variation of the plan, 12) | 12/12, min 86.5 | 12/12, 91.1 | 12/12, 92.2 | 12/12, 89.6 | 12/12, 91.8 | 12/12, 85.4 |
| Time-bot EST (band) | **88 s ✗** (95–140) | 184 s ✓ (180–270) | **102 s ~** (80–100) | 193 s ✓ | **89 s ✗** | 184 s ✓ (was 277) |
| Mechanics (≤ tier max) | 2 ✓ | 3 ✓ | 2 ✓ | 3 ✓ (was 4) | 2 ✓ | 3 ✓ |
| Determinism seq/after/fresh/wait/raf (3 each) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Determinism live (cold + warm, final build) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Hero lock (§4b) | single pier ≤ 6 %, upper TNT ≤ 2 %; min to drop > 50 %: **3** (52 %, level 50 %: no win) → ≤ 1 never ✓ | 3 TNT on one leg 1 %; min **3** (73 % sideways, level 42 %: no win) → ≤ 2 never ✓ | min **2** (two neighbouring podium piers = whole hall, the rule) → R ≤ 0 ✓ | 4 random 0/12 (max 33 %) ✓ | one pole = 14 %; min **4** (57 %) → ≤ 2 never ✓ | RC: **4 TNT never** (0/12, max 3 %), 2 + 2 on neighbours 0 %, 3 + 3 = whole hall ✓ |
| Blind newcomer (2 attempts) | not won (50.5 coll / 66.1) | not won (56.6 / 85.3 coll) | not won (70.8 coll / 74.2 coll) | not won (40.7 coll / 47.6) | not won (49 / 49.1) | not won (4.9 / 1.2) |
| Gestures (gesture-b1.js, 13 checks) | **12/13**: 1 of 72 max-zoom poses inside a building (nearest 16 m; v14 camera clearance, as A1 L2) | – | **12/13**: the "tap a pier behind glass, zoomed in" check aimed at a pier that is off screen at its fixed pan (x = −197): a test-aim miss, not a game miss; 72 poses 0 inside | – | – | – |

Time-bot is the estimate formula (40 s × (1 + 0.1 P) + collapse) × attempts; L6 / L19 sit below the N band because the sensible
variants pass 8/8 (attempts = 1). Not padded (as A1): STD-v2 itself moved early levels down; Lead to decide whether 88–89 s on an early
N is a miss.

## 4. Tuning (surroundings only; hero shapes unchanged since the tile pass)

| Round | Level | Change | Why | Result |
|---|---|---|---|---|
| 2 | L35 | red drums also at the **third outer leg** of each side block (`t35f`, z = +3.2 / +4.3) | variants 2/8 (H 3–5): only two of the three outer legs had drums, so "two outer legs side by side" worked on one of the two pairs | variants **4/8**, margin +3 → **+6**, EST 277 → **184 s**, gate sensible still 0/4 (it blasts the two ends: not neighbours), foot / search 0, 4 TNT still never drops the hall |
| probe | L7 | TNT 11 → 10 (`?t7=10`) | leg-foot 2/16 | still 2/16, variants 4/8: no gain, kept 11 |
| fix | all | collateral tip takes the building name the card header shows | L7 card "HIT THE SCHOOL", tip "It fell on the hospital" | consistent |

## 5. Shots (`levels6/shots/b1/`)

Per level: `L<n>-1-opening` · `-2-plan-aids` (v3: no aids, the plain planning view) · `-2b-placed` · `-3-after-blast` (newcomer
run) · `-4-fail-attempt<k>` (newcomer) · `-5-zoom` (14 m zoom on the foot, glass + interior) · `-6-mid-collapse` · `-7-win`
(expert plan, real loop) · `tile-vs-game.png` (tile | opening | zoom for all six). No separate RC damage-stage shots of L35 (§6).

## 6. Open problems (honest list)

1. **Blind newcomer wins none of the six in 2 attempts** (STD-v3, no dots). Its rule (tap the hero legs nearest the middle of the screen,
   up to 3 a wave, BLAST, repeat) is not a lesson-reader: on the halls the middle of the screen is glass, the v14 tap assist sends a
   tap on a pane to the pier BEHIND it, so it blasts back-row piers seen through the glass, and the hall falls back onto the protected
   building behind (L6, L11, L16: collateral). L11 is the one that matters (R teach, LEVEL-NEEDS wants 50 % by attempt 2): the school
   behind the hall is hidden in the opening view. Not fixed: options are an opening yaw that shows the school, the school beside the
   hall (then the backward fall is safe and the lesson-less plan passes), or a tap-assist rule "a pane goes to the NEAREST pier"
   (v14, not mine). Needs a person test or a Lead call.
2. **L7 leg-foot 2/16** (H wants 0; the official foot-bot is 0/16). Random 11 TNT spread over 26 legs sometimes drops the arch forward
   and the tower back. TNT 10 did not help. Next lever: the tower's legs or a third target (§4 order 1).
3. **Wide-hall framing.** v3 opens on the whole lot; the 46–62 m heroes take about 50–63 % of the screen width at 390 px (estimated from
   the shots; frameBox includes the keeps and the far neighbours). A "frame by width" fit (hero + protected only) is an API candidate.
4. **Time-bot** L6 88 s, L19 89 s (N band 95–140), L11 102 s (R 80–100).
5. **Newcomer harness**: after 6 waves on a level with unlimited waves it reads a stale "DEMOLISHED 0 %" card and its TRY AGAIN tap
   continues the same level; attempt-2 numbers of L7 / L19 are continuations (same tool as A1).
6. The Wrecking Ball first use on L11 is reasoned, not run (intro layer only in the main build).
7. No damage-stage shots (RC chips / rebar / break) for L35; the RC tier and `rcDecor` are v14's, unchanged.
8. Budgets: triangles / ms-per-step not measured on a quiet machine (A2 ran its bots the whole time).

## 7. API candidates (for the v14 owner)

- **`M14.api.hall(o)`** = `B1.hall` (§1a): row rule + hinge + shove + `link` + no-stub sweep. L6, L7, L11, L16, L35 and every `b1blk`
  neighbour use it; C1 (bridge decks on towers) and any low wide hero would too.
- **`blasted` flag**: a member that had a charge of this volley counts as blasted even if the load crushed it a moment before its own
  charge (`b1arm`), so "two piers side by side" holds with real timing.
- **No-stub sweep** (`all` + `decks`): useful for every hero, not only halls (A1 also lost points to stubs).
- **Frame by width**: an opening fit on the hero + protected buildings by width, for heroes wider than tall.
- **Tap assist through glass → nearest pier** (problem 1).

## 8. Progress log (newest last)

Progress log (newest last; a restart resumes from here):
- 14/11 00:30 resumed after container restart. Partial code on disk (v15-b1.js 444 lines: parts b1dome/b1arch/b1shell/b1cubes/b1blk, hall rule, six levels; src-b1.js; tools in shots/b1/tools). Kept as is.
- src-b1.js: base is now rebuilt in the temp dir (current v14 with NOHINT + v15-a1) because checkpoints/index-v10i-a1.html predates NOHINT. `B1_BASE=disk` = old behaviour.
- checkpoint built: checkpoints/index-v10i-b1.html (3.58 MB).
- loadcheck ok=true errors=0; at rest (360 steps, ?debug=1): 0 breaks, 0 moved on all six (shots/b1/tools/rest.js).
- gate N=4 (no hints, v3 base): all six met (logs/gate1.txt). Next: determinism, foot, time, search, b1bots, newcomer, shots.
- determinism LIVE=0 x3 all six identical; foot 0/16 all six; search L6 0, L7 0, L11 1, L16 0, L19 0 /24; time-bot: L35 variants 2/8 (H wants 3-5).
- TUNE L35 (round 2): drums also at the third outer leg of each side block (`t35f`, z = bz+3.2/+4.3): any two outer legs side by side now work, the ends still do not -> variants 4/8 (shots/b1/tools/vardiag.js). Rebuilt. Re-run L35 gate/foot/search/det.
- L35 r2 re-gate: expert 91 (+6) 4/4, sensible 0/4, foot 0/16, search 0/24, variants 4/8, EST 184 s, det ok. b1bots (logs/b1bots.txt): L35 4 TNT 0/12 (max 3%), 3+3 neighbours = whole hall, 2+2 0%.
- min-TNT drops (>50% hero mass): L6 3 (52%, level 50%: no win), L7 3 (73% sideways physics, level 42%: no win), L11 2 (hall rule), L16 >4, L19 4 (57%), L35 6 (3+3).
- legfoot random 16 (hero legs included): L6 1, L7 2 (H wants 0: MISS), L11 1, L16 0, L19 1, L35 0. jitter 12/12 on all six (min 85.4 L35, 86.5 L6).
- L7 probe TNT 10 (`?t7=10`): legfoot still 2/16, variants 4/8 -> no gain, kept 11.
- newcomer (blind, 2 attempts) part 1 (killed by the 30-min limit after L11): L6 fail 50.5 coll / 66.1; L7 fail 56.6 / coll 85.3; L11 coll 70.8 / coll 74.2. Rerunning L16, L19, L35.
- fix: collateral tip names the building the card header names (L7 showed header "school", tip "hospital"). Rebuilt.
- newcomer part 2: L16 coll 40.7 / 47.6; L19 49 / 49.1 (pct); L35 4.9 / 1.2. Blind newcomer wins none of the six (see §6).
- BUG found + fixed: my collateral-tip edit lost its braces (every fail showed "It fell on ..."; L19 has no ctip -> page error at the card). Braces back, fail lines checked on all six (pct = principle line, collateral = "It fell on <card's building>"). newcomer part 2 ran with the bug (play unaffected, card text was wrong).
- expert plan in the REAL loop (winshot.js): all six won (92.6 / 90.5 / 95.5 / 91.4 / 93.3 / 91.5).
- shots: winshot2 (zoom on the foot, mid-collapse at score > 25 %, win) all six; tile-vs-game.png built. gestures L6 12/13, L11 12/13 (§3).
- live determinism (LIVE=2, cold + warm) running alone at the end; L6 ok.
- live determinism LIVE=2 on the final build: all six identical (logs/det-live.txt). Hand-in.
