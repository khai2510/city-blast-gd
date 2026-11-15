# Batch A1: L1–L5 remade on the L32 standard (13/11/2026, round 2) · built against **STD-v1**

D-blast-ROLLOUT batch A1 (LEVEL-NEEDS §4.2). Built and gated against **STD-v1** (skill `blast-level-standard` §10: no newer STD on 13/11).
Decisions applied: D-blast-K1 (L1–16 heroes monumental but on their ladder material), K2 (T levels 4–6 TNT), K3 (≤ 3-TNT rule is RC only),
D-blast-HERO-PROC (tile first, difficulty by surroundings), D-blast-TNTTIGHT (expert ends with 0–1 TNT).
Not committed by the agent. v10–v14 are untouched. Round 2 (Lead, 13/11): the levels are now ALSO in the main build: step
`a1-levels` in `tools/build-main.js` (§0b).

## 0. Round 2: what changed since the first hand-in

| Lead's point | Done | Result |
|---|---|---|
| (1) L4 brute force to target | The cause was in all four box-frame heroes, not in L4's surroundings: **one TNT on an upper floor slab, or on a pier / pane next to it, brought the whole tower down** (76–88 % from a single TNT on the needle, lighthouse, clock tower, wedge). Two causes, both fixed in the hero's STRENGTH, not its shape: the ladder slab (hp 150) died from one TNT → hero floors are blast-proof (`a1slab / a1mdC / a1lite`: hp 600, armor 0.7, shoved a fifth as hard; they still shatter on landing); piers under heavy slabs stood close to their crushing load and one blast set off a chain → the needle, lighthouse and wedge floors weigh a third (`a1lite`). Then for L4: two low timber sheds far behind (they thin out a blind foot plan). | L4 search **0/24** (was 8), leg-foot **0/16** (was 3). One TNT anywhere on storeys 2–8 of L2 / L3 / L4: 0–4 %. L3 search 0/24 (was 3), L5 1/24. |
| (2) L3, L4 margins into +3…+8 | Surroundings only: L3 a one-floor brick house off the row that the 7 TNT do not reach; L4 the two sheds. | L3 **+6**, L4 **+7** (L5 +7, L2 +10, L1 +12). |
| (3) Time-bot | Not padded. | L3 77 s, L5 94 s, L4 105 s; T levels 69 / 71 s. See §7.3: I agree the early levels should sit lower than the N band. |
| (4) L3 cue dots | Removed (§4b N practice). Dots come from the second attempt (`a1cue2`, as L5). | The aid follower still won L3 on the first try, but only just: 85.4 %, 3 blasts, with the legs it sees (the opening view faces the row side). |
| (5) L5 under the body guides | Not cheap: reported. 342 hero bodies = 20 legs × 9 storeys + slabs + walls; with 4 legs a box (first build) the wall bonds sheared at rest. Fewer storeys would change the tile's proportions. | open (§7) |
| Main build | `tools/build-main.js` step 16 `a1-levels` (`levels6/tools/src-a1.js` with `A1_OPEN=0`, after `l32-monument`, before `glue-final`); `MAIN-BUILD.md` row 15b + `?a1=0`. | `checkpoints/index-main.html` sources `42f973154f93`: loadcheck ok · `main/check-main.js` **80 PASS, 0 FAIL** · A1 gate N = 4 on index-main: met, the same % as the A1 checkpoint. |

Two things the main build's own checks forced (both are its rules, not STD's): **L1 has no opening push-in** (check B5 / feel Q1: the first
hero must be whole inside the play area; the mill, the barn, the hand and the four dots are all on screen in the whole-lot view), and
**every fail text is ≤ 9 words** (check B18, the v31 "short tip" rule; `M14.api.failText` gives 15–25 words, so the texts are written
out in v15-a1).

## 0b. In the main build

`node tools/build-main.js` → 20 steps. `src-a1.js` is the same tool as for the A1 checkpoint; `A1_OPEN=0` only skips "open L1 by
default". The intro layer (`main/intro.js`, step 19) reads the level data at run time and is appended after v15-a1. With materials-fx
physics off (the main default) the A1 gate numbers are the checkpoint's. Not re-run on index-main: time / search / foot / determinism /
newcomer (they ran on the A1 checkpoint, same engine and level blocks).

| File (owned by A1) | What |
|---|---|
| `levels6/patch/v15-a1.js` | Part kinds `a1mill` (F27), `a1light` (F28), `a1tock` (F01), `a1needle` (F16), `a1wedge` (F24), the tip rule, the data of L1–L5, three small run-time hooks (dots of the plan, the dots' tip in the level's words, "Didn't budge" / protected-fail texts). Calls `M14.api.*` only. |
| `levels6/tools/src-a1.js` | Build: `checkpoints/index-v10h-l32-monument.html` (read only) + v15-a1 appended last in `main()` → `checkpoints/index-v10i-a1.html`; opens L1; LV picker kept. |
| `checkpoints/index-v10i-a1.html` | The build (3.51 MB, md5 `41b98523…`). `?lv=N`, `?a1=0` = the old L1–L5, test API `window.__blast.a1`. L32 and L6–36 are the base's. |
| `levels6/shots/a1/` | Per level: `L<n>-1-opening`, `-2-plan-aids`, `-2b-placed`, `-3-after-blast`, `-4-win` (from the scripted newcomer's real run; L5's after-blast is the expert plan) + `tile-vs-game.png`, `newcomer-run.json`. `tools/` = the extra scripts of §6. |

```bash
cd games/blast && node levels6/tools/src-a1.js      # build
export BLAST_LIBS=<scratchpad>/libs NODE_PATH=/opt/node22/lib/node_modules G=checkpoints/index-v10i-a1.html
node tools/loadcheck.js $G                                             # ok=true screen=title errors=0
LIVE=2 node levels6/tools/determinism-check.js $G 1,2,3,4,5 3          # R-11
N=4 node levels6/tools/gate-bot.js $G 1,2,3,4,5 ; K=8 node levels6/tools/time-bot.js $G 1,2,3,4,5 ; K=24 node levels6/tools/search-bot.js $G 1,2,3,4,5
N=16 MODE=random,face node levels6/tools/foot-bot.js $G '' 1,2,3,4,5
node levels6/shots/a1/tools/newcomer.js $G 1,2,3,4,5 2                 # scripted newcomer (real taps, real loop)
node levels6/shots/a1/tools/legfoot.js $G ; K=8 node levels6/shots/a1/tools/jitter.js $G ; LV=1 node levels6/shots/a1/tools/gesture-a1.js $G
```

## 1. What was built

| L | Hero (tile) · twist | Material (ladder) | Size | Real members | Seen inside / drawn (decor, no body) | Tile score (own, 1–5) |
|---|---|---|---|---|---|---|
| 1 | F27 timber smock mill · **six** sails | wood: 8 posts a storey (`wpost`), plank cassettes `mdW`, board walls | 43 m eaves, 49 m cap, sails to 65 m (old: 23 m) | 116 | open ring of posts: millstones, sacks, stair, lantern; sloped boarded skin, lit windows, gallery rail, dome cap, hub, 6 lattice sails | 4 |
| 2 | F28 lighthouse on a rock · lit portholes on the red bands | brick: 8 piers a storey (`bk`), slabs, brick walls | 59 m gallery, 71 m vane (old: 34 m) | 146 | round red / white skin (16 sectors a storey), white pilasters on the foot's legs, door, gallery + rail, glass lantern with the lamp, dome | 4.5 |
| 3 | F01 clock tower · studs for numerals, both hands up | stone arcade = concrete piers, shaft = brick | 50 m cornice, 67 m ball (old: 26 m) | 128 | lit lobby through the arcade (`floorIn`), tall arched windows, cream corners and bands, four 10 m clock faces, slate pyramid, gold ball | 4.5 |
| 4 | F16 stepped stone tower · the crown is a lit glass lantern | concrete piers, cassettes `mdC`, transfer decks under each setback | 67 m last setback, 85 m needle (old: 38 m) | 171 | **glass faces** (`mglass`) with two office floors a storey seen through them (`floorIn`), glass lobby, stone mullions and bands, corner blocks, crown, needle | 4 |
| 5 | F24 wedge block · the nose is cut flat | brick piers, slabs, brick walls | 54 m cornice, 57 m attic (old: 31 m) | 342 | shop fronts of real glass with the shops inside, slanted brick skin with lit windows, cream nose / bands / cornice, attic | 3.5 |

All five stand with **0 bonds cracked at rest** (360 steps, `?debug=1`, `__blast.m14.breaks()`), 0 members moved.
Neighbours are 6–24 m, so the city reads small. Camera, tap assist, haze, gesture hint: v14's (`mon:1`, `lotK` 1.8–2.6).

**How the heroes come down (the part to review first).**
- **L1 mill: STD-v1's storey rule unchanged** (`M14.api.ring()` on every storey): two posts next to each other gone = the storey crushes, a
  straight pancake. Checked: 0 of 8 single posts drop it, exactly the 8 neighbour pairs of 28 do.
- **L2–L5: the tip rule (new, in v15-a1, scripted like the storey rule).** The lessons of L2–L5 are fall DIRECTIONS; a full-storey crush
  has none. The 8 legs of the ground storey are tagged round it (corner, middle, corner on each face). When two neighbours are gone,
  the third leg of that FACE gives way 0.15 s later (game time) with the wall panels touching those three legs: "two legs side by
  side and it falls that way". One leg, or two that are not neighbours, never drop it. 8 s later the stump comes down if its floor
  is gone.
  - **Hinge (L2 lighthouse, L3 clock tower, L4 needle):** the two side legs next to the lost face give way 0.4 s after it, and the three
    legs of the far face are not crushed by the weight for 2.5 s: the tower turns over on them like a tree (40–60 m reach). Without
    it the heavy clock tower sat straight down in 4 of 8 runs of the same correct plan (it depended on which side of a leg the TNT
    sat), and a wrong-side blast on L4 spared the hospital in 5 of 8.
  - **L5 wedge:** the rule sits on the wide end, no hinge; when it tips sideways the same side of the middle and the nose gives way
    0.25 / 0.45 s later so the whole block goes one way.
- **Floors (round 2).** Piers and walls are the ladder's own members (wood / brick / concrete: one TNT a leg). The floors are not
  the ladder slab any more: `a1slab` (clock tower), `a1lite` (lighthouse, wedge, the needle's transfer decks: a third of the weight)
  and `a1mdC` (the needle's cassettes) take a blast (hp 600, armor 0.7, a fifth of the shove) and shatter on landing as before; the
  ones under a tower that must tip keep concrete-type joints. The mill keeps the API's `mdW`. Reason: §0 (1).
- The lighthouse's rock is drawn (decor): on a real 3 m rock, rubble resting on it never counted as "down" (−3…5 points on every run).

## 2. Levels (surroundings, TNT, aids)

| L | Tier · lesson | Scene | TNT (LEVEL-NEEDS) | Expert plan | Aids (§4b via `M14.api.aids`) | Tip · fail text |
|---|---|---|---|---|---|---|
| 1 | T teach · tap a post, then BLAST (**no words**, D-blast-INTRO-BTF) | mill + a low timber barn | 5 (5) | 2 front posts side by side + 2 end posts of the barn, 1 blast, 1 left | T: whole-lot opening (no push-in: main build check B5), the pointing hand, cue dots on all 4, cleanup dots. No tip pill, no dots' tip line, no toast | none on screen while playing · result card on a fail: "Two front posts, side by side. Then the barn." |
| 2 | T experience · "Tip the lighthouse onto the row." | lighthouse at the right end of a row of 3 timber boathouses | 5 (5) | 3 legs facing the row + 1 TNT on each of the two far boathouses (the fall takes the near one), 1 blast, 0 left | T: push-in, hand, cue dots, tip line "Tap the dots. Then BLAST!", cleanup | "Not yet. Two legs side by side!" instead of "Didn't budge" · fail: "Three legs facing the row. Then the far huts." |
| 3 | N practice · "Start the row from the right." | clock tower at the right end of a row that steps down (brick, timber, brick, brick; the new grey material is the tower's own stone legs) + a one-floor brick house off the row, out of reach | 7 (7) | 3 stone legs facing the row + 2 on each of the last two houses, 1 blast, 0 left | N practice (§4b): no cue; cue dots + tip line from the second attempt (`a1cue2`) | fail: "Fill the dots on the legs facing the row." |
| 4 | N teach · "Turn around. Blast the back." | tower, hospital in front, a school far out on each side (x ±40), two timber blocks behind, two low sheds far behind (out of reach) | 7 (7) | 3 back legs + 2 + 2 on the timber blocks, 1 blast, 0 left | N teach (= L32): push-in on the foot, cue dots, tip line, cleanup | fail: "Turn around. Fill the dots on the back legs." · protected fail names the building really hit: "It fell on the hospital. Blast the BACK legs." |
| 5 | N practice · "Tip it away from the blue." | wedge (nose to the camera), hospital along its right side, school ahead, shed, concrete block, a brick house out of reach | 8 (8) | 3 left legs of the wide end + 2 shed + 3 block, 1 blast, 0 left | N practice: no cue; **cue dots + tip line from the second attempt** (`a1cue2`) | fail: "Fill the dots on the three left legs." · protected fail: "It fell on the hospital. Blast the far side." |

World note: on L2 and L3 the row runs along +z and the camera opens from the side (yaw 1.1 / 1.15), so the tower is at the right of
the screen as the tips say, and the solution face is the engine's "front" (see §7.5).

### 2b. For the intro system (D-blast-INTRO-BTF): what each level introduces, where the forced-use hand points

The card / forced-use system is built in the main build by another agent; nothing of it is in A1. Selectors are the game's own
(`selectMembers(sel, floor)[index]`, floor 0); they are also the first entries of each level's `sol`.

| L | New thing | Kind | Hand points at (first use) | Then |
|---|---|---|---|---|
| 1 | TNT + the BLAST button (wood: one TNT a post) | charge / core loop | `A:z+` [0]: the left front post of the mill; then `A:z+` [1], the post next to it | the BLAST button (already done by the base hand: it walks `sol`, then BLAST). 0 words. |
| 2 | Brick (same count: one TNT a leg) · a fall has a direction | material | `A:z+` [1]: the middle leg of the lighthouse on the row's side | `A:z+` [0] or [2] (a neighbour leg) |
| 3 | Concrete: the grey stone legs (one TNT a leg) | material | `A:z+` [0]: a stone leg of the clock tower on the row's side | — |
| 4 | Turning the view · protected (blue) buildings: first level that has them | control + obstacle | the turn gesture / button first (drag sideways), then `A:z-` [1]: the middle back leg | card for the blue buildings: "Blue stays up." (≤ 8 words, suggestion) |
| 5 | nothing new | — | no forced use | — |

No booster opens on L1–L5 (LEVEL-NEEDS K6 puts the first free booster on L12).

## 3. Targets vs measured (round 2, A1 checkpoint `41b98523`; bots: zero upgrades, not player data)

Gate N = 4 (the seeds change nothing physical on these levels: 4 equal runs), time-bot K = 8, search K = 24.

| Metric (tier target) | L1 · T | L2 · T | L3 · N | L4 · N teach | L5 · N |
|---|---|---|---|---|---|
| TNT given (LEVEL-NEEDS) | 5 (5) ✓ | 5 (5) ✓ | 7 (7) ✓ | 7 (7) ✓ | 8 (8) ✓ |
| Expert 4/4 · margin (T ≥ +8 · N +3…+8) | 4/4 · 97% **+12** ✓ | 4/4 · 95% **+10** ✓ | 4/4 · 91% **+6** ✓ | 4/4 · 92% **+7** ✓ | 4/4 · 92% **+7** ✓ |
| Expert blasts (T 1 · N 1–2) · TNT left (0–1) | 1 · 1 ✓ | 1 · 0 ✓ | 1 · 0 ✓ | 1 · 0 ✓ | 1 · 0 ✓ |
| Sensible (T 4/4 in 1 blast · N 4/4 ≤ 2) | 4/4 · 97% · 1 ✓ | 4/4 · 96% · 1 ✓ | 4/4 · 89% · 1 ✓ | 4/4 · 94% · 1 ✓ | 4/4 · 90% · 1 ✓ |
| Sensible variants /8 (T 8 · N 6–8) | 8/8 ✓ | 8/8 ✓ (94–97%) | 8/8 ✓ | 6/8 ✓ | 7/8 ✓ |
| Naive (T may win · N 0–1/4) | **4/4 wins** ✓ | 0/4 (ok) | 0/4 ✓ | 0/4 ✓ | 0/4 ✓ |
| Lesson-less must fail | n/a | 0/4 · 81% ✓ | 0/4 · 81% ✓ | 0/4 · protected ✓ | 0/4 · protected ✓ |
| Time-bot (T 60–75 s · N 95–140 s) | 69 s ✓ | 71 s ✓ | **77 s** ✗ | 105 s ✓ | **94 s** ✗ (−1) |
| Search random /24 (T – · N ≤ 2) | 18/24 (not gated) | 1/24 | 0/24 ✓ | **0/24** ✓ | 1/24 ✓ |
| Foot-bot random /16 · face (N ≤ 1/16); legs not candidates, §6 | 0/16 · 0/12 | 0/16 · 0/36 | 0/16 · 0/40 ✓ | 0/16 · 0/36 ✓ | 0/16 · 0/28 ✓ |
| Leg-foot random /16 (supplement: hero legs included; ≤ 1) | 8/16 (not gated) | 2/16 (not gated) | 0/16 ✓ | **0/16** ✓ | **2/16** ✗ |
| Hero lock (one leg never; one TNT on an upper storey never) | 1 leg 0/8 ✓ | 1 leg 0/8 ✓ · upper storeys ≤ 4% ✓ | 1 leg 0/8 ✓ · upper ≤ 1% ✓ | 1 leg 0/8 ✓ · upper ≤ 1% ✓ | 1 leg 0/20 ✓ · **a TNT on a nose wall, storeys 2–5: 67–78%** ✗ (not a pass) |
| Scripted newcomer (L1–3 first try · L4–5 within 2) | **attempt 1** ✓ 92.8%, 1 blast, 4 taps on the 4 dots, 1 left (no words, no push-in) | **attempt 1** ✓ 94.6%, 3 taps, 2 left | **attempt 1** ✓ 85.4% (no dots: the legs it sees, 3 blasts, 3 left) | **attempt 1** ✓ 86.4% (6 dots, then 1 cleanup dot) | **attempt 2** ✓ 91% (1st: the legs it sees, the hospital hit; 2nd: second-attempt dots) |
| First break after BLAST, game time (L1 ≤ 5 s) | **0.10 s** ✓ | 0.08 s | 0.05 s | 0.10 s | 0.07 s |
| The plan with a person's variation, K = 8 (§6) | 8/8 · min 90.9 | 8/8 · min 93.6 | 8/8 · min 86.1 | 8/8 · min 86.2 | 8/8 · min 90.7 |
| The lesson-less plan with that variation (should fail) | n/a | 3/8 pass (85%) | 0/8 ✓ | 2/8 pass | 1/8 passes |
| Determinism (seq, after, fresh, wait, raf 3/3 · live cold + warm) | identical ✓ `1ba2f774` | identical ✓ `cbd8dfb8` | identical ✓ `5df229ac` | identical ✓ `974ea912` | identical ✓ `6cc30e68` |
| Bonds cracked at rest (0) | 0 ✓ | 0 ✓ | 0 ✓ | 0 ✓ | 0 ✓ |
| Gestures (13; script written for L32) | 13/13 ✓ (final file; 12/13 on the run before) | **12/13** ✗ | **12/13** ✗ (13/13 in round 1) | 13/13 ✓ | **11/13** ✗ |
| Load check | ok, 0 errors (A1 checkpoint and index-main) | | | | |

The full bot set ran on the build with all five levels' physics final (`2f54810e`). The last file (`41b98523`) differs from it in L1's
opening (no push-in), the fail texts and comment lines only: on it the gate was re-run (N = 1, the same %) and the expert logs
re-read (the same five hashes); L1's newcomer and gestures were re-run on it.

## 4. Budgets (skill §5: guides)

| | L1 | L2 | L3 | L4 | L5 | Guide |
|---|---|---|---|---|---|---|
| Hero bodies | 116 | 146 | 128 | 171 | **342** | ≤ 270 |
| Level bodies (non-anchor) | 144 | 329 | 313 | 363 | **500** | ≤ 450 |
| Decor pieces | 427 | 433 | 317 | 1,986 | 616 | ≤ 2,000 |

L5 is over both body guides (three box frames, 20 legs a storey, 9 storeys). Triangles, draw calls, ms/step and fps were **not measured**:
the machine ran other bot jobs all session (load average 7–31; skill §5: only on a quiet machine, then a phone).

## 5. Checks

- Load check: `ok=true screen=title errors=0` on the A1 checkpoint and on `index-main.html`. `?a1=0`: the old L1–L5 load as before.
- Rest: 0 bonds cracked, 0 members dead or moved on all five (360 steps).
- Determinism (R-11), repeats 3 (not 5: the machine was busy), LIVE = 2: every run identical in seq / after / fresh / wait / raf and
  live cold + warm on all five, exit 0. Live never timed out.
- `main/check-main.js` on the main build: 80 PASS, 0 FAIL, exit 0 (run on a scratch copy that is byte-identical to `index-main.html`;
  its shots and `check.json` were copied to `checkpoints/main-shots/`).
- Gestures (`gesture-a1.js` = `tools/gesture-test.js` with a level number; its taps were written for L32): L1 13/13 and L4 13/13. The misses are two checks: "camera never inside a building, 72 poses" fails by 1 pose on L2 (every run: nearest 11 m; the drawn rock round the foot is decor on the ground slab, which the camera's clearance does not measure) and on L5, and came and went on L1 (1 pose in one run of two); "a tap 7 px beside a pier goes to it" went to the neighbouring leg on L5 (its box frames stand leg to leg) and once on L3. Nothing else failed.

## 6. Extra scripts (in `shots/a1/tools/`; nothing in `levels6/tools/` or `tools/` was edited)

| Script | Why | Result |
|---|---|---|
| `newcomer.js` | The scripted newcomer of the brief: real touch taps in the real loop. Taps every pulsing dot on screen, else the hero's legs nearest the middle of the screen (up to 3), BLAST, repeats while TNT is left; TRY AGAIN on a fail. Never reads level data or tip text. | Round 2: L1, L2, L3, L4 won on **attempt 1**, L5 on **attempt 2** (`newcomer-run.json`). L1: first break 0.10 s after BLAST. |
| `legfoot.js` | `foot-bot.js` only takes ground members whose centre is below 2.0 m: the 5–8 m legs of a monumental hero are never candidates, so its 0/16 says nothing about the hero (true for L32 too). This one includes the legs and checks single legs and pairs. | §3 rows "Leg-foot", "Hero lock" |
| `jitter.js` | The bots put every TNT on the same spot of a member. A person varies the order, the side of the leg and the height: K runs of the level's plan (or the lesson-less plan) with those varied. | §3: the taught plans pass 8/8 on all five |
| `gesture-a1.js` | `tools/gesture-test.js` is fixed to `?lv=32`. | §5 |

## 7. Problems still open (honest list)

1. **L5 is over the body guides** (342 hero, 500 level) and its nose is still weak: a TNT on a nose wall of storeys 2–5 kills both
   nose piers (brick: 2.5 m) and the block comes down to 67–78 % (not a pass). Leg-foot 2/16 on L5 (≤ 1). A cheaper, sturdier wedge
   needs a different frame (fewer, wider-spaced legs), i.e. a rebuild of this hero.
2. **The aid follower's wins on L3 and L4 are thin**: 85.4 % and 86.4 % (bots: 91–92 %). On L3 there are no dots on the first try
   any more (§4b); it won with the legs the opening view shows. One run each; a person will lose some of these first tries.
3. **Time-bot under the N band**: L3 77 s, L5 94 s (band 95–140; L4 105 s). The estimate is
   `(40 s × (1 + 0.1 P) + collapse) × attempts`: with 7–8 TNT and variants ≥ 7/8 it cannot reach 95 s, and padding it means more
   TNT or more failed attempts. My view: T and early N (L1–L5) should have their own band, about 60–100 s by this formula; B1's
   30–45 s is play time of a person who knows the level, which this estimate (40 s of planning before the first tap) cannot show.
   Nothing was padded.
4. **The lesson is weak under a person's variation** on L2 (the wrong-way fall still passes 3 of 8 at 85 %; T tier has no
   lesson-less target) and L4 (2 of 8: the front fall misses the hospital). The bot's own lesson-less runs fail on all four.
5. **Results still move with how the TNT is placed** (±4 points on a pass). Lowest varied run: L3 86.1 %, L4 86.2 %.
6. **Two scripted rules live in v15-a1, not in the shared helpers**: the tip rule + hinge (accepted by the Lead, §1) and the
   blast-proof / light hero floors (§0). Every batch with a ladder-material hero needs both (the single-TNT collapse is not special
   to A1): proposal = move `btag` and the `a1slab / a1lite` keys to `M14.api` (helper owner). L32's `mdW / mdB / mdC` cassettes
   (hp 60–150) have the same weakness if a batch uses them as they are.
7. **Helper API gaps met (v14 not edited; worked around in v15-a1):** (a) `floorIn`'s floor plate grows with `hw` squared (wider than
   4.54 pokes out of the building): called with `hw ≤ 4.54`, the plate drawn here; (b) the dots' tip text is fixed ("Fill the dots
   to crack the leg"): swapped per level by a hook; (c) `L.track` takes whole selectors only: single members tracked from `L.sol` by
   a hook; (d) no "cue dots from the second attempt"; (e) no directional rule; (f) a batch that replaces LEVELS[0] must rebuild
   the title world: the first PLAY adopted the world prebuilt from the old L1 (one `goHome()` at load here); (g) "Didn't budge" shows
   although a leg broke, and the protected-fail tip names `L.keep.name`, not the building that was hit (both hooked for A1 levels);
   (h) the dots' tip sits under the "Safe" pill on levels with protected buildings (moved 36 px down for A1 levels); (i) the
   camera's clearance does not see decor on the ground slab (L2 rock); (j) `failText` is longer than the main build's 9-word rule.
8. **STD vs the main build's checks**: the STD opening push-in (aid 1) cannot be used on L1 (check B5), and STD's fail-text helper
   breaks check B18. L32's own fail text (20 words) would fail B18 too if that check played L32. One of the two rules should give.
9. **Likeness and scale**: L5 is the weakest (three stepped box frames under a slanted drawn skin; own score 3.5). The lighthouse is
   a square frame inside a round drawn skin, the mill a stepped octagon under a sloped drawn skin: taps go to the members inside.
   L1 / L3 / L5 are 43–54 m to the eaves (1.9–2× the old heroes), below the "70–90 m tower" line of skill §2. The needle's ground
   storey has 8 legs and a glass lobby (tile: an arcade of many piers) so that the tip rule has one ring of 8.
10. **Not seen by a person, not on a phone**: no blind tester; fps, ms/step, tap sizes (legs 1.0–1.2 m: the tap assist and the dots
    carry it) and the 2-minute feel are unknown. Tile scores are my own.
11. `foot-bot` and `gesture-test` as shipped cannot test a monumental non-L32 level (§6). `check-main` got no new item for A1 (its
    C2 already opens L1 through the LV picker and reads the new body count).
12. L1 has no words while playing (D-blast-INTRO-BTF); a first blast that only breaks one post gives no text, the dot on the next
    post keeps pulsing. The result card of a fail still has its (short) text.
13. Layout probes (`XQ()`: `?bx=`, `?kz=` …), `?solo=1`, `?hd=`, `?hard=0` are left in v15-a1 for the next tuning round; they do
    nothing without a query string.
14. The RC lines of the DoD (every pier `hrc`, `rcDecor`, ≤ 3 TNT, damage-stage shots) do not apply (K1: ladder material).
    `L5-3-after-blast.png` is the expert plan on an earlier build (the same hero and scene).
