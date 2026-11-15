# Batch A2: L8, L9, L12, L14, L15 on the L32 standard (14/11/2026) · built on **STD-v2**, gated on **STD-v3**

D-blast-ROLLOUT batch A2 (LEVEL-NEEDS §4). Built against STD-v2 (ladder heroes, blast-proof floors, tip rule, fail text ≤ 9 words),
re-gated against **STD-v3** (D-blast-NOHINT: no cue dots, no damage dots, no tip line, opening on the whole building, fail text = a
principle). Decisions applied: D-blast-K1 (L1–16 heroes monumental on their ladder material), HERO-PROC (tile first, difficulty by
surroundings), TNTTIGHT (expert ends with 0–1 TNT), INTRO-BTF (L8 = first steel). Not committed by the agent. v10–v14, v15-a1, main/
and build-main.js untouched.

## 0. Build

| | |
|---|---|
| Patch | `levels6/patch/v15-a2.js` (parts `a2rivet` F03, `a2saucer` F04, `a2plinth` F21, `a2sail` F30; L14 reuses A1's `a1light` F28) |
| Build tool | `levels6/tools/src-a2.js <base> <out>` (appends v15-a2 after the v15 A1 block) |
| Checkpoint | `checkpoints/index-v10i-a2.html` (LV picker, `?lv=N`, `?a2=0` = old levels, `window.__blast.a2`) |
| Base for STD-v3 | `checkpoints/index-v10i-a1.html` is **stale** (built 13/11 with the STD-v2 v14: cue dots, push-in). The v3 checkpoint is built on a fresh chain from the current patch files: `src-l32.js index-v10f-l13-36.html → base-l32.html` (M14_OPEN=0) → `src-a1.js → base-a1.html` (A1_OPEN=0) → `src-a2.js → index-v10i-a2.html` (intermediates in the scratchpad). The main pipeline (`build-main.js`) does the same chain, so an `a2-levels` step after `a1-levels` gets the same result. |
| Aids | none set by A2: `M14.api.aids()` of the v3 v14 (all tiers `open:"whole", cue:false, tip:false, cleanup:"no", dots:"none", fail:"rule"`). The earlier A2 override (`L.aid` with v3 values for a v2 base) is removed; `?hints=1` gives the STD-v2 table. |
| Texts (all spot-free, ≤ 9 words; none matches check-main's spot regex) | L8 tip "Steel holds. / Break what it stands on." · fail "Steel holds. Break what it stands on." · dud the same · L9 tip "Tip it down the row. / Steel? Break what holds it." · fail "It falls toward the legs you break." · L12 tip "Turn the view. / See what hides." · fail "Something is hidden. Turn the view." · L14 fail "Steel needs two TNT stacked." · L15 fail "Clear the cover first. Steel needs two stacked." · duds L9–15 "Not yet. Two legs side by side!" |

Tuning this round (surroundings only, hero shapes untouched):
- **L12**: hidden concrete block D from 4 to 3 bays wide (`dc12` 4 → 3). With 4 bays its z+ face had one ground member, so the gate's
  sensible player (3 TNT on that face) could place only one: sensible 0/4 (76%). Now 4/4 (91%).
- **L8**: tried removing the two far timber sheds for the blind newcomer (78% → 82%, still not won), but random foot went 1/16 → 7/16
  and leg-foot 2/16 → 8/16 (R cap 5/16): **reverted**.

## 1. Heroes (one line each)

| L | Tier | Hero (tile) | Material (K1) | Height | Twist |
|---|---|---|---|---|---|
| 8 Rivet Tower | R teach | F03 lattice tower on splayed legs, each on a grey concrete foot; observation deck with teal glass band; glass cabin | lattice steel `a2lat` (ladder steel hp/armor, open-web weight) on ladder-concrete feet | 34 m deck, 67 m cabin roof, 81 m antenna | three legs, not four |
| 9 Twin Saucer | N | F04 at concrete tier: the smaller cousin of L32 (closed 8-sided concrete shaft, one 22 m glass saucer, roofed pod) | ladder concrete, blast-proof floors | 42 m saucer roof, 63–67 m antenna | the pod roof is a lit lantern |
| 12 Star Pedestal | N | F21 sandstone plinth in a star rampart; glass belvedere under the cornice | ladder concrete piers, blast-proof floors | 55 m cornice, 59 m cap | lit glass belvedere |
| 14 Stripey Light | N | F28 lighthouse (A1's `a1light`, unchanged) | A1's | as A1 | as A1 |
| 15 The Sail | N | F30 twin sail towers on one podium, white ribs, sky bridge | ladder concrete, blast-proof cassettes, glass faces | 60 m roofs, 75 m masts | sky bridge is a lit glass tube |

Steel intro (INTRO_SCHED L8 "New: Steel"): steel first appears on L8 (none in A2 before it). The forced tap's selector in
`main/intro.js` is `mfxClassOf(B.key) === "steel"` on non-keep, non-prop, non-anchor blocks, nearest the screen middle. The tower's
legs/shaft posts are key `a2lat` with `MATS.a2lat = MATS.steel`, so they class as steel and fill the opening view (opening shot:
`shots/a2/L8-1-opening.png`). The L8 water towers' upper storeys are ladder `steel` too.

## 2. Targets vs measured (STD-v3 gate, checkpoint of 14/11; bots: zero upgrades, not player data)

Tier targets from skill §4b (R = L8, N = the rest). Ladder heroes: hero lock = "≤ min − 2 never".

| Metric (target R / N) | L8 R | L9 N | L12 N | L14 N | L15 N |
|---|---|---|---|---|---|
| TNT (7–9 / 8–11) | 9 ✓ | 9 ✓ | 9 ✓ | 9 ✓ | 10 ✓ |
| Expert 4/4, margin (≥ +6 / +3…+8) | 92% +7 ✓ | 91% +6 ✓ | 92% +7 ✓ | 92% +7 ✓ | 92% +7 ✓ |
| Expert blasts (1–2) · spare (0–1) | 1 · 1 ✓ | 1 · 1 ✓ | 1 · 1 ✓ | 1 · 0 ✓ | 2 · 0 ✓ |
| Sensible 4/4 ≤ 2 blasts | 4/4 90% ✓ | 4/4 92% ✓ | 4/4 91% ✓ | 4/4 92% ✓ | 4/4 92% ✓ |
| Naive (≤ 2/4 / 0–1/4) | 0/4 ✓ | 0/4 ✓ | 0/4 ✓ | 0/4 ✓ | 0/4 ✓ |
| Lesson-less 0/4 | 0/4 (1%) ✓ | 0/4 (72%) ✓ | 0/4 (76%) ✓ | 0/4 (74%) ✓ | 0/4 (76%) ✓ |
| Sensible variants (7–8 / 6–8 of 8) | 8/8 ✓ | 6/8 ✓ | 8/8 ✓ | 8/8 ✓ | 7/8 ✓ |
| Time-bot (80–100 s / 95–140 s) | 84 s ✓ | 117 s ✓ | **87 s** (low) | **88 s** (low) | 126 s ✓ |
| Foot random 16 (≤ 5 / ≤ 1) · face | 1/16 · 0/58 ✓ | 0/16 · 0/52 ✓ | 0/16 · 0/76 ✓ | 0/16 · 0/44 ✓ | 0/16 · 0/32 ✓ |
| Leg-foot random 16 (A2 supplement, hero legs + feet) | 2/16 ✓ | 0/16 ✓ | **2/16** (> 1) | 0/16 ✓ | 0/16 ✓ |
| Search 24 (≤ 6 / ≤ 2) | 0/24 ✓ | 0/24 ✓ | 0/24 ✓ | 2/24 ✓ | 2/24 ✓ |
| One TNT on one hero leg drops it | **3/3** (a concrete foot: the lesson) | 0/8 ✓ | 0/8 ✓ | 0/8 ✓ | 0/16 ✓ |
| Two hero legs drop it (tip rule: neighbours only) | 3/3 | 8/28, all neighbours ✓ | 12/28 neighbours/corners ✓ | 8/28 neighbours ✓ | 13/120 neighbours ✓ |
| Min TNT to drop the hero | 1 (a foot) | 2 | 2 | 2 | 2 |
| Determinism seq/after/fresh/wait/raf 3/3 + live cold/warm | `f78c58cb` ✓ | `b5fdbc7b` ✓ | `4d5304a5` ✓ | `7fcb4ad7` ✓ | `e1256fca` ✓ |
| Bonds cracked at rest (360 steps) | 0 ✓ | 0 ✓ | 0 ✓ | 0 ✓ | 0 ✓ |
| Gestures 13 | 13/13 ✓ | 11/13 | 12/13 | 12/13 | 11/13 |
| Jitter: expert plan, person's order/face/height, 12 runs | 8/12 (min 83.1) | 12/12 | 12/12 | 12/12 | 12/12 |
| **Blind scripted newcomer** (finds it by attempt 2) | **not won** (78% in its first full game; 74% in the next) | **not won** (59 / 60%) | won on **attempt 3** (88%) | **not won** (67 / 75 / 72%) | **not won** (75%) |
| STD-v3 hints on screen | none: no pips, no dots' tip, whole-building opening (shots) | same | same | same | same |

Loadcheck: `ok=true screen=title errors=0`. Budgets: hero bodies 85 / 146 / 153 / 146 / 236 (≤ 270), level non-anchor bodies
243 / 396 / 333 / 410 / 334 (≤ 450). Peak bond use at rest: L8 0.965, L9 0.969 (0 broke; close to 1), L12 0.81, L14 0.43, L15 0.63.

## 3. Notes on the checks

- Newcomer "attempts": the script ends an attempt when it finds nothing to tap with TNT left (the level is still open), so its printed
  attempts 1 + 2 are often one real game. Read the table as "best % per real game".
- Jitter L8 8/12: a person's spread on the three feet / water-tower feet gives 83–85% on 4 runs (the expert spare is 1 TNT).
- Gestures L8 needed `SEL1=A:z- SEL2=A:z- K2=0` (the original picks an `A:x+` pier; the three-legged tower has none).
- Expert win shots: L8 91.8%, L9 91.4%, L12 92.4%, L14 91.8%, L15 91.8% (result screen, `-4-win-expert`).

## 4. Shots (`levels6/shots/a2/`)

Per level from the blind newcomer's real run (real touch taps, real loop): `L<n>-1-opening` (whole building, no hint),
`-2-plan-aids` (= planning with **no** aids under STD-v3), `-2b-placed`, `-3-after-blast` (L8), `-4-fail-attemptN`, L12 `-4-win`.
From the expert plan (`winshot.js`): `L<n>-5-expert-plan`, `L<n>-4-win-expert` (all five). `newcomer-run.json` = the run's data.
`tools/` = gesture-a2.js (env SEL1/SEL2/K2 for L8's three legs), jitter.js, legfoot.js, newcomer.js (STD-v3 blind: hero legs, then
whatever stands, turns the view when nothing is on screen and after a collateral fall; adapted from B1).

## 5. Open problems (honest list)

1. **Blind newcomer misses on 4 of 5** (L12 wins on attempt 3). The script taps 1–3 single TNT on the legs nearest the screen middle
   and never stacks, never reads the tip line; on every level the hero falls (58–78%) and it then spends single TNT on steel or
   on the far side. Tuning for it fights the foot/search gates (L8: easing it to 82% put random foot at 7/16). This is a system
   question for the Lead (STD-v3 says re-tune T/R that fall below; the only R here is L8): either a smarter blind script (stack
   after a member did not break; spend left-over TNT where the most still stands, like the gate's cleanup), or a person test.
2. `main/intro.js` (read-only for A2) L8 card line "Steel holds. Hit the grey feet." names a spot ("feet" is in check-main's spot
   regex). Suggest "Steel holds. Break what it stands on." (the L8 tip/fail line).
3. L8: one TNT on one concrete foot drops the 81 m tower (67–69%): that is the lesson (steel holds, its feet do not), but the
   ladder hero lock "≤ min − 2 never" is empty for L8 (min = 1).
4. L12 leg-foot 2/16 (supplement; the official foot-bot is 0/16) since D went to 3 bays; N wants ≤ 1/16.
5. Time-bot L12 87 s and L14 88 s are under the N band (95–140 s): short, not long.
6. Jitter L8 8/12 (person's variation on the feet: 83–85% on 4 of 12).
7. Gestures: the misses are the generic ones A1 also had — "camera never inside a building, 72 poses" (L9 1 pose, L12 2 poses),
   "tap 7 px beside a pier" goes to the neighbouring pier (L9, L14, L15: legs stand close), L15 "pier behind its pane" picks a pier
   off-screen at that zoom (the test's pose, written for L32).
8. Peak bond use at rest 0.97 on L8 and L9 (0 broke in 360 steps; little headroom if v14 or the engine changes).
9. Not seen by a person / on a phone; no fps or ms/step on a quiet machine (B1 ran at the same time).

API gaps (M14.api, report only): no call to register a column family (A2 registers `a2lat` by hand, the way `floors()` does decks);
`src-a2.js` default base is the stale `index-v10i-a1.html` (pass the fresh base explicitly, §0).

## 6. Run log (newest last)

- Resume #3 after container restart: partial v15-a2 / src-a2 / tools found; earlier gate-v3 had L8, L9 only.
- Fresh chain build, texts made spot-free, L.aid override removed. loadcheck ok. Rest: 0 bonds on all 5.
- Gate v3: all met except L12 sensible 0/4 → D 3 bays → L12 4/4. Determinism all 5 ok (re-run alone after a browser crash under load).
- Time, search, foot, leg-foot, blind newcomer as in §2. L8 shed removal tried and reverted.
