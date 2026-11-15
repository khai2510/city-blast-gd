# L13–36 status (generator run, 11/11/2026)

Built in parallel with round 5, then rebuilt on the final round-5 checkpoint (`c3c7b9a`).
Checkpoint: `checkpoints/index-v10f-l13-36.html` = `index-v10d-levels6r5.html` (read only) + `levels6/patch/v11.js` + the 24 levels of
`levels6/tools/src-l13-36.js` in slots 13–36 (L1–12 untouched). Load check: ok=true, 0 errors.

```bash
cd games/blast
node levels6/tools/src-l13-36.js                    # writes levels6/levels-v6-l13-36.json + the checkpoint
N=4 node levels6/sim/gate-l13-36.js  checkpoints/index-v10f-l13-36.html            # gate, a fresh page per run
N=16 MODE=random node levels6/tools/foot-bot.js checkpoints/index-v10f-l13-36.html '' 13,14,...,36
K=8 node levels6/sim/time-l13-36.js checkpoints/index-v10f-l13-36.html 13,...,36
SHOTS=levels6/shots node levels6/sim/lab-l13-36.js checkpoints/index-v10f-l13-36.html 13,...,36 info shot min det perf
```
(env `BLAST_LIBS`, `NODE_PATH` as in the round-5 tools.) All numbers: bots, zero upgrades, no boosters. Not player data.

## 1. Curriculum (reconciled: round-5 lessons + PLAN §14.8 + LEVEL-BRIEF-100)

Round 5 taught L1 tap, L4 rotate, L8 steel band (blast above), L11 blast in steps. Stacking was not taught, so it opens this range
(PLAN §14.8). Every lesson is followed by 3 levels that use it before the next one. The brief's lessons keep their order but move later:

| Lesson (tip) | Brief | Built | Practice | First combined in |
|---|---|---|---|---|
| Stack two TNT on steel | L8 | **L13 R** | L14, L15 | L16 H |
| Dark piers: TNT on each (reinforced concrete) | L13 variant | **L17 R** | L18, L19 | L20 boss |
| Keep the road clear (street 10%) | L16 | **L21 R** | L22, L23 | L24 H |
| Glass holds nothing: hit the dark frame | L22 | **L25 R** | L26, L27 | L28 H, L30 boss |
| Barrels blast for free | L26 | **L32 N** | L33, L34 | L35 H |
| Drop it in the marked lot | L32 | **L36 R** | (L37–39, next run) | — |
| Cantilever (heavy end tips first) | L36 | **not in this range** → L40+ | | |

Tiers: R 13, 17, 21, 25, 31, 36 · N 14, 15, 18, 19, 22, 23, 26, 27, 29, 32, 33, 34 · H 16, 24, 28, 35 · boss 20, 30. No two H/boss in a
row; a relief level after each boss. Districts: Harbour L13–20, Downtown L21–30, Rail Yard L31–36 (palettes: the base rotation; the four
new palettes are a `design` job).

## 2. Results per level

| L | Tier | Level (hero) | Archetype | TNT given / expert / min found | Expert (min %, margin) | Blasts | Street / protected at expert | Sensible (hint follower) | Sensible variants (time-bot, 8) | Naive | Lesson-less | Foot random | Est. time s | screenFillPct | Hero m | Sec. ratio | Bodies | Cracked at rest | ms/step |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 13 | R | Harp Span (F17) | legs | 9 / 7 / <=6 | 4/4 (95%, +10) | 1 | 0% / 0% | 4/4 | 8/8 | 0/4 | 0/4 (22%) | 2/16 | 86 | 86% | 49 | 0.42 | 211 | 0 | 5.33 |
| 14 | N | Stripey Light (F28) | row | 9 / 8 / <=7 | 4/4 (91%, +6) | 1 | 0% / 0% | 4/4 | 5/8 | 0/4 | n/a | 0/16 | 140 | 77% | 43.3 | 0.57 | 272 | 0 | 7.01 |
| 15 | N | The Sail (F30) | inner | 10 / 9 / <=8 | 4/4 (88%, +3) | 2 | 0% / 0% | 4/4 | 5/8 | 0/4 | n/a | 0/16 | 181 | 77% | 53.5 | 0.39 | 198 | 0 | 6.63 |
| 16 | H | Dome Hall (F14) | c4 | 11 / 10 / 10 | 4/4 (90%, +5) | 1 | 0% / 0% | 0/4 | 2/8 | 0/4 | n/a | 1/16 | 280 | 69% | 36 | 0.69 | 347 | 0 | 9.84 |
| 17 | R | The Pedestal (F21) | tall-low | 10 / 8 / <=7 | 4/4 (91%, +6) | 1 | 0% / 0% | 4/4 | 8/8 | 0/4 | 0/4 (25%) | 4/16 | 88 | 81% | 38.7 | 0.74 | 211 | 0 | 6.04 |
| 18 | N | The Doorstop (F24) | hidden | 9 / 9 / <=8 | 4/4 (94%, +9) | 2 | 0% / 0% | 4/4 | 4/8 | 0/4 | n/a | 0/16 | 219 | 76% | 40.2 | 0.6 | 345 | 0 | 5.91 |
| 19 | N | Cube Grove (F35) | row | 10 / 9 / <=8 | 4/4 (95%, +10) | 1 | 0% / 0% | 4/4 | 8/8 | 0/4 | n/a | 0/16 | 90 | 23% | 14.4 | 2.61 | 303 | 0 | 7.06 |
| 20 | B | Big Bow (F32) | setpiece | 11 / 10 / <=9 | 4/4 (93%, +8) | 2 | 0% / 0% | 0/4 | 0/8 | 0/4 | n/a | 0/16 | 352 | 69% | 39.2 | 1 | 339 | 0 | 3.2 |
| 21 | R | The Stepper (F22) | tall-low | 10 / 8 / <=7 | 4/4 (94%, +9) | 1 | 2% / 0% | 4/4 | 5/8 | 0/4 | 0/4 (93%) | 0/16 | 141 | 89% | 43.6 | 0.66 | 218 | 0 | 6.27 |
| 22 | N | The Pencil (F26, heroPending) | canyon | 10 / 9 / <=8 | 4/4 (89%, +4) | 1 | 2% / 0% | 4/4 | 6/8 | 0/4 | n/a | 1/16 | 119 | 78% | 50 | 0.67 | 298 | 0 | 10.15 |
| 23 | N | Tube Bundle (F34, heroPending) | row | 10 / 8 / <=7 | 4/4 (93%, +8) | 1 | 0% / 0% | 4/4 | 6/8 | 0/4 | n/a | 1/16 | 120 | 75% | 44.8 | 0.64 | 324 | 0 | 12.05 |
| 24 | H | Deco Needle (F16) | plaza | 10 / 9 / 9 | 4/4 (98%, +13) | 1 | 3% / 0% | 0/4 | 0/8 | 0/4 | n/a | 0/16 | 262 | 74% | 48.8 | 0.51 | 310 | 0 | 5.4 |
| 25 | R | Glass Point (F06) | inner | 10 / 8 / <=7 | 4/4 (94%, +9) | 1 | 0% / 0% | 4/4 | 7/8 | 0/4 | 0/4 (37%) | 0/16 | 103 | 80% | 46.9 | 0.72 | 245 | 0 | 5.7 |
| 26 | N | The Bullet (F25) | tall-low | 10 / 8 / <=7 | 4/4 (92%, +7) | 1 | 0% / 0% | 4/4 | 6/8 | 0/4 | n/a | 3/16 | 119 | 77% | 45.4 | 0.55 | 265 | 1 | 5.58 |
| 27 | N | The Splinter (F31, heroPending) | row | 11 / 10 / <=9 | 4/4 (97%, +12) | 1 | 0% / 0% | 4/4 | 7/8 | 0/4 | n/a | 0/16 | 106 | 78% | 53 | 0.71 | 305 | 0 | 5.29 |
| 28 | H | Sister Spires (F07) | bridge | 11 / 10 / <=9 | 4/4 (92%, +7) | 1 | 0% / 0% | 0/4 | 7/8 | 0/4 | n/a | 0/16 | 106 | 68% | 43 | 1 | 320 | 10 | 6.61 |
| 29 | N | Old Tock Row (F01) | row | 11 / 10 / <=9 | 4/4 (92%, +7) | 1 | 0% / 0% | 4/4 | 3/8 | 0/4 | n/a | 0/16 | 255 | 85% | 48.8 | 0.77 | 378 | 0 | 6.19 |
| 30 | B | Sky Steps (F12) | setpiece | 13 / 13 / <=12 | 4/4 (93%, +8) | 2 | 1% / 0% | 0/4 | 0/8 | 0/4 | n/a | 0/16 | 362 | 78% | 54.6 | 0.62 | 315 | 0 | 5.76 |
| 31 | R | Stack Tower (F19, heroPending) | tall-low | 10 / 8 / <=7 | 4/4 (94%, +9) | 1 | 0% / 0% | 4/4 | 8/8 | 0/4 | n/a | 2/16 | 89 | 78% | 45 | 0.64 | 245 | 0 | 4.81 |
| 32 | N | Sky Saucer (F04) | legs | 10 / 8 / <=7 | 4/4 (99%, +14) | 1 | 0% / 0% | 4/4 | 6/8 | 0/4 | 0/4 (68%) | 0/16 | 122 | 79% | 49 | 0.59 | 238 | 0 | 4.72 |
| 33 | N | Rivet Tower (F03) | row | 9 / 8 / <=7 | 4/4 (89%, +4) | 1 | 0% / 0% | 4/4 | 8/8 | 0/4 | n/a | 0/16 | 85 | 78% | 41.2 | 0.7 | 227 | 0 | 7.49 |
| 34 | N | Tock Yard (F01) | pair | 10 / 9 / <=8 | 4/4 (98%, +13) | 1 | 0% / 0% | 4/4 | 6/8 | 0/4 | n/a | 0/16 | 117 | 80% | 48.8 | 0.77 | 270 | 0 | 5.46 |
| 35 | H | Dome Works (F14) | c4 | 11 / 10 / <=9 | 4/4 (91%, +6) | 1 | 0% / 0% | 0/4 | 0/8 | 0/4 | n/a | 0/16 | 280 | 70% | 40 | 0.62 | 316 | 13 | 8.99 |
| 36 | R | Sail Lot (F30) | zone | 11 / 10 / <=9 | 4/4 (94%, +9) | 1 | 0% / 0% | 4/4 | 6/8 | 0/4 | 0/4 (92%) | 0/16 | 124 | 73% | 53.5 | 0.54 | 297 | 0 | 3.36 |

Columns: *Sensible (hint follower)* = the gate bot (deterministic: it places exactly the level's `bot.hints`; on H/boss the hints carry one
plausible misreading of the tip, so 0/4 there means "the misreading fails", as in round 5). *Sensible variants* = the time-bot's 8 randomised
players (member picked at random on the hinted face, 1 hint in 4 moved to the front face): this is the number to hold against the brief's
N 6–8/8, H 3–5/8, boss 1–3/8. *Foot random* = 16 random all-at-the-foot plans, one volley. *Est. time* = the Lead's formula
(40 s × (1 + 0.1 × TNT) + collapse) × attempts. *ms/step* = headless swiftshader wall clock (an upper bound, not a phone number).
Full data: `levels6/sim/curve-l13-36.csv`. Opening screenshots: `levels6/shots/l13-36-Lxx.png` (390×844).

## 3. What each level is

| L | Idea (one line) | Tip on screen |
|---|---|---|
| 13 | LESSON: a steel-framed bridge pylon; one TNT never breaks a steel leg, two on the same leg do; above the open legs the frame is steel too, so "blast above" (L8) does not work here | Steel leg? Stack two TNT. |
| 14 | A banded lighthouse tips down a boathouse row; a gantry on steel legs at the far end needs the stack | Tip it down the row. Stack on steel. |
| 15 | The sail tower's steel legs stand inside a closed boat hall: open the hall (blast 1), stack on the legs (blast 2) | Open the hall. Then stack on steel. |
| 16 H | Four blocks round a hospital; all must fall outward; the dome hall is steel-framed (stack on its outer legs) | HARD. All fall away from the hospital. |
| 17 | LESSON: a blank plinth on two storeys of fat dark piers: only a TNT right on a pier breaks it (one TNT in the middle: 25%) | Dark piers: TNT on each one. |
| 18 | A wedge block; behind it a closed hall hides a reinforced core: hall first, then TNT on the core's piers | Look behind it. Dark piers: TNT on each. |
| 19 | Five cube houses, each on ONE dark pier (pop, pop, pop), and a steel water tower (stack) | One dark pier, one TNT. Steel: stack. |
| 20 boss | Steel arch bridge: left pylon on dark piers between two schools (falls outward), right pylon on steel with a hospital behind (stack, falls outward), the span falls with them; a hall hides a core (2 blasts) | BOSS! Each pylon has one way down. |
| 21 | LESSON: the road is in front; blast every BACK and it falls into the yard (front plan: 93% down but the street is blocked) | Keep the road clear. |
| 22 | Road + turn the view: tower with a wing falls back onto the block behind it | Road in front. Blast every back. |
| 23 | Road + domino AWAY from the road: the bundled tower takes a row that runs back from the street | Tip it down the row, away from the road. |
| 24 H | Hospital left, school right, road in front: only back is open, and the back legs are steel | HARD. Only one way is open. |
| 25 | LESSON: a glass pyramid: TNT on a pane only breaks glass (37%); the dark frame behind carries it | Glass holds nothing. Hit the dark frame. |
| 26 | Glass tower whose frame is steel: stack through the glass | Steel behind glass: stack on it. |
| 27 | Glass shard tips down a row of glass, brick and timber; a steel mast behind | Tip the glass tower down the row. |
| 28 H | Twin glass spires + sky bridge behind a shop row on the road: left one on dark piers must fall left (school behind), right one on steel must fall back (hospital beside) | HARD. One way down for each spire. |
| 29 | The longest domino so far: clock tower, glass, concrete, brick, timber; a steel mast behind | One push. The whole row goes. |
| 30 boss | Stepped glass super-tower on dark piers: road in front, school beside → falls back; a closed hall with a steel mast inside (open, then stack); a glass block behind the school. 13 TNT, 2 blasts | BOSS! Road, school, glass, steel. |
| 31 | Relief after the boss (Sky Strike's first level in the boosters2 build): segment tower on dark piers, sheds, a steel-framed block | Dark piers: one each. Steel: stack. |
| 32 | LESSON: red barrels round two steel legs: ONE TNT on each leg + the barrels does what four stacked TNT would (without barrels: 68%) | Barrels blast for free. |
| 33 | Barrels on one side of the lattice tower's legs show the way it falls, down a row of sheds | Barrels show the way down. |
| 34 | Clock tower tips down a row into a barrel dump at the last block | Row, then barrels. |
| 35 H | Complex of four round a school; barrels on the INNER side of two blocks are a trap | HARD. Some barrels are a trap. |
| 36 | LESSON: tower between a school and a hospital, road in front: the yellow lot behind is the only place to land (sideways: hits the hospital) | Drop it in the lot. |

## 4. Engine additions (`levels6/patch/v11.js`, applied after v10; nothing in v10 or `patch.js` edited)

1. `window.__blast.l11` (test API only): `fill()` = screenFillPct, secondaryRatio, smallest column on screen; `rest()` = bodies, bonds, per-part standing share.
2. Crown type `stack`: any stepped top from data (visual decor riding on the roof member, like the v10 crowns) + 4 decor colours (white, yellow, red, glass tint) + `lotpad`.
3. `P.lean` on a mass part (sheared stack for a leaning tower). **Built, measured, NOT used**: at 0.06 m/m it cracked 16 bonds at rest and the tower fell towards its lean whatever was cut. F02 "The Tilt" is therefore not in this range.
4. `lot6` part: the yellow marked lot (ground paint; the rule is the street + protected buildings, no new meter: brief §6.6).
5. `arch6` part: steel deck plates between two pylons with a visual arch + hangers riding on the middle plate (boss L20).
6. `BODY_CAP` 320 → 400 (the base drops every second glass pane above the cap; L25–30 have glass and 240–340 members). L1–12 have no glass: unchanged.
Level data fields added (the game ignores them): `hero` (part id measured), `heroId` (F-code), `heroPending`, `arch`, `boosterPush`.
Data conventions measured here: a bridge deck must sit with its top at a tower slab top (`y: 16 / 2.7` for 4 m storeys), or its bonds crack and it drops at rest.

## 5. What is not met (honest list)

1. **Heroes: see §7 (art pass done 11/11).** Before the art pass they were built from the mass builder (tiers + a decor crown), on 2×2 or 3×2 bay shafts. They read as "tall tower with
   a distinctive top", not as the Figma sheets (F1b/F2/F3/F4). The bridges (F17, F32) are the weakest: pylons + a deck. `heroPending: true` only where
   no sheet shows the hero yet (F19 L31, F26 L22, F31 L27, F34 L23); **all 24 need the `design`/`app-dev` art pass** before Owner judges recognisability.
2. **screenFillPct is 69–86%, above the brief's 60–75% band** (L19 Cube Grove 24%: a wide, low hero by nature). Heroes are 36–55 m (12–18 storey-equivalents
   on 4 m storeys): the ≥15 storeys rule is met by most, the ≥20 rule from L31 is not (L31–36: 36–53 m). Secondary ratio 0.3–1.0.
3. **Smallest column on screen 3–7 px** (brief: ≥12 pt). Same as round 5 (3–6 px). Needs the invisible 44 pt tap targets of the brief §5.2, not a level change.
4. **Foot plans:** N levels 0–1/16 except **L26 3/16**; H **L16 1/16** (target 0); R ≤ 4/16. Reached by putting one steel-framed building (stack only) in almost
   every level: it works, but it is the same trick 13 times. A game-wide rule would do it better (question 2 below).
5. **Hard levels by the 8 variants:** L16 2/8, L24 0/8, L35 0/8, **L28 7/8 (too easy for a Hard)**; bosses L20 0/8, L30 0/8. Target was H 3–5/8, boss 1–3/8: only L16 is close. N levels: 3/8–8/8 (L29 3/8, L18 4/8 below the 6–8/8 target).
6. **Time (estimate):** R 86–141 s (target 80–95), N 85–255 s (target 95–140; L15 181, L18 219, L29 255 overshoot because few variants pass), H 106–280 s (target 220–270), bosses 352–362 s (target 290–340). Mean of the 24: about 160 s.
7. **Min found = expert − 1 on several levels** (see table): one TNT less still passes. TNT given is expert + 1 (N) / + 2 (lesson) / + 0–1 (H, boss).
8. **Sensitivity.** The physics is deterministic per plan (same pose hash on repeat), but small changes (one building moved 1 m, the placing ORDER of the same
   charges) flipped results in L21, L35 and L36 during tuning (street 1% ↔ 11%, protected 0% ↔ 30%). The shipped layouts have ≥ 3 points of margin for the
   expert AND the hint follower in a different placing order, but a real player's order is free. L36 (lot) and L24 are the ones to watch in playtest.
9. **Bodies:** 198–378 per level (cap 400). 0 bonds cracked at rest except L28 (10: the sky-bridge deck ends), L35 (13) and L26 (1): nothing falls or moves (rest score 0%), but the brief's gate says 0. Headless step time 3–12 ms average (L22 10.2, L23 12.1, L16 9.8 are above the 7 ms target; swiftshader, not a phone). Determinism: the expert plan twice on one seed gives the same pose hash on all 24.
10. Not built: Wave text "Wave 1/2" (round 5 removed wave text game-wide), the four new district palettes, cables on the bridges, twist-per-hero table.

## 7. Hero art pass (11/11/2026, level-art agent): the 24 heroes dressed after the Figma tiles

**How.** `patch/v11.js` §7 "HERO DRESS": a mass part (or a `deck6` / `arch6`) takes `dress: { t: 'Fxx', ... }`. Every piece is VISUAL decor
riding on one physical member of the part (a floor plate, a wall panel, or the ground anchor for paving), exactly as the v10 crowns: no body,
no collider, no bond, no `rnd()` call. Plus member tints (`b.tint`, written after `buildInstances`; floor plates get a flush edge cover
because their texture carries the level's band colour). The members, their order and their strength are untouched: **the expert plan gives
the same pose hash as the pre-art build on all 24 levels** (`lab-l13-36.js ... exp`, seed 800 + li), so solutions and difficulty did not move.
No level was retuned. The old hero crowns (`roof.crown`, also visual) are replaced by the dress; `roof.cap` / `ac` (bodies) are kept.

**Honest-play rules kept** (game-designer: same look = same rule; every target easy): nothing that looks like a column at ground level; no
shell over a wall face (a TNT put on a face stays in sight): only crowns above the roof, thin bands at slab level, flush strips on panels,
attachments that stand clear of the faces (decks, cables, fins, the sail), low paving (<= 0.75 m) and tints. Ground storeys are as before.
Consequence: the heroes keep the slender physical shafts (1-2 bays). They now read by crown, colour, bands and attachments, not by a
wide body. Wide/low tiles (F06 pyramid, F14 hall, F35 grove, the bridges) are therefore "the tower version" of the landmark.

Side-by-side images (Figma tile | opening shot, 390x844): `levels6/shots/hero-compare-Lxx.png`, contact sheet `hero-compare-L13-36.png`.
Opening shots `l13-36-Lxx.png` are refreshed.

| L | Hero | What the dress adds | Reads like the tile (1-5, own honest score) | Weak point |
|---|---|---|---|---|
| 13 | F17 Harp Span | grey pylon, high road deck through it (over the brick block), 24 harp cables, pylon head | 4 | one pylon, not two; the deck ends hang (visual) |
| 14 | F28 Stripey Light | red/white bands on walls and plates, round rings, gallery with rail, glass lantern, slate dome, rock paving | 4 | square shaft, not a round taper |
| 15 | F30 The Sail | teal body with white floor lines, one bowed white sail (2 ribs + sheet) on the left, mast, deck disc; no water rim | 3.5 | one sail (tile shows two towers); thin body on 16 m steel legs |
| 16 | F14 Dome Hall | cream stone, cornices, colonnaded drum, big slate dome + lantern, two small end domes, pediment | 3 | a domed TOWER: the tile is a wide low hall |
| 17 | F21 The Pedestal | sandstone tint, pilasters, heavy stepped flat top (no statue), low star wall + lawn (paving) | 4 | — |
| 18 | F24 The Doorstop | cream bands + cornice, a 5 m cream stone prow with a flat-cut nose and windows on the camera-side end (from storey 1 up), slate roof | 3.5 | the wedge is added to a straight block; the ground storey under the prow is open |
| 19 | F35 Cube Grove | all five cubes: yellow walls, pointed grey roof, yellow point under the cube round the pier, teal windows | 3.5 | cubes are not tilted; hero is 16 m (screen fill 27%, as before) |
| 20 | F32 Big Bow | 27 m steel arch truss (two chords, posts, diagonals, hangers, cross ties) through both sandstone pylons, road carried past them, stepped pylon tops | 4 | pylons are taller than the arch (tile: squat pylons at the arch ends); arch ends hang at deck level |
| 21 | F22 The Stepper | sand tint, pilasters, visual setbacks down both sides, stepped top, teal lantern, gold cap | 4 | — |
| 22 | F26 The Pencil | cream needle, teal strips, 13 m pyramid point, ONE stepped wing/fin 4.6 m wide high on the right | 3.5 | the brick podium is not on the tile |
| 23 | F34 Tube Bundle | FIVE tubes of five heights (44 / 32 / 24 / 21 / 18 m: two real, three visual tops), smoky tint, dark rims | 3.5 | visual tube tops are blank boxes over open frames |
| 24 | F16 Deco Needle | grey stone tint, dark window strips, 8-step crown, 6.5 m needle | 3.5 | no wide base setbacks (1-bay shaft) |
| 25 | F06 Glass Point | grey frames at every slab, glass steps up the setback and the top, planters | 2.5 | the tile is a wide low pyramid; this is a stepped glass tower |
| 26 | F25 The Bullet | round bands, grey diagonal grid on every pane, a 7 m rounded glass nose (dome), small cap | 3.5 | body is 1 bay: a slim bullet, not a fat one |
| 27 | F31 The Splinter | split shard top (15 m + 18.5 m points + a low third), grey frames | 3.5 | shaft is straight, only the top tapers |
| 28 | F07 Sister Spires | both towers: stepped glass crown with corner fins + mast; glazed walkway on the sky bridge | 4 | two towers (tile: three) |
| 29 | F01 Old Tock | cream bands, big clock stage with 4 white faces + gold rims + hands, slate pyramid roof, gold ball | 4.5 | — |
| 30 | F12 Sky Steps | glass steps up the setback (6.5 + 5.5 m), 5-step top, 7 m needle | 4 | — |
| 31 | F19 Stack Tower | five segments each flaring to a dark plate (eaves tinted slate), flat dark top | 3 | segments are cream / brick (their real materials), not teal glass |
| 32 | F04 Sky Saucer | grey shaft, 12 m glass disc with terrace + rail, stem, roofed upper disc, antenna | 4.5 | — |
| 33 | F03 Rivet Tower | dark iron tint, cross bracing between the steel legs and on the walls, ring deck with glass band, closing lattice top, glass cabin, antenna | 4 | legs are vertical (splayed legs would be fake columns) |
| 34 | F01 Old Tock | as L29 | 4.5 | — |
| 35 | F14 Dome Hall | as L16, verdigris dome | 3 | as L16 |
| 36 | F30 The Sail | as L15, on a 10-storey body | 4 | one sail |

**Still weak, and why:** L25 Glass Point (2.5), L16/L35 Dome Hall (3), L31 Stack Tower (3). Their tiles are wide, low or all-glass masses; with the
physics frozen (1-2 bay shafts, real materials) the dress can only add a top and trims. A better read needs new physical masses (a wide
stepped podium, a low hall under the dome, glass skins on F19), i.e. a level rebuild + a new gate, not an art pass.

**Lead's notes:** F34 five tubes: done. F30 water rim: not built. F26 wing: one big stepped fin. F25: rounded dome nose (fat body not possible on 1 bay).
F24: prow on the end the opening camera sees. F02: not in this range. Bridges: L13 deck + cables, L20 full arch truss.

**Cost.** Decor pieces per level 30-335 (L20: the truss), all in <= 7 instanced meshes (box, cyl, dome, cone, prism, round cone, sphere): +0.4 to +3k
triangles per level. Bodies unchanged (198-378, cap 400).

**Gate after the art pass (N=4, `gate-l13-36.js`, checkpoint built on the committed round-5 base):** GATE MET on all 24, every number equal to the
table in §2 (expert 96/96, smallest margin +3 on L15; naive 0/4; lesson-less fails; H/boss sensible 0/4). Foot plans, protected, street,
bonds at rest: unchanged by construction (same members, same pose hashes).

## 8. On the determinism fix (round 6, commit 88c82a8): rebuild, determinism, full gate, retunes (11/11)

`checkpoints/index-v10f-l13-36.html` is rebuilt on the round-6 `index-v10d-levels6r5.html`. **The numbers below replace §2** (§2 is the round-5 base).
The art (§7) is neutral on this base too: dressed and pre-art builds give the same pose hashes.

**Determinism** (`MAXL=36 node levels6/tools/determinism-check.js <file> 15,18,20,30`; the tool got a `MAXL` env, default 12, so it can plan L13-36):
the four multi-blast levels L15, L18, L20, L30: **every run identical** (seq, after other levels, fresh pages, waits before each blast, real-time
gaps: 3 repeats each + 1 live game-loop run each on the build before the L24 / L26 retunes; again 2 repeats each, without the live run, on the final file).

**The engine fix moved these levels; retuned in level data only (no rule, no dress change):**

| L | On round 6 before the retune | Change (level data) | After |
|---|---|---|---|
| 15 The Sail | expert 87.22% (margin +2.2) | the brick block behind, B: 3x2 bays x 5 storeys -> 2x2 x 6 (two TNT now take its whole back line; expert plan B:z- 0,1) | 90.95% (+5.95); four neighbouring variants 89.0-90.9 |
| 24 Deco Needle | expert FAILS: protected 8% (the 40 m shaft pancaked and spilled on the hospital / school; 0-60% over small layout changes) | the hero's two FRONT legs are dark reinforced piers on storeys 0-1 (`cols` + `colsF: 2`; the back legs are steel on the same two storeys): it now tips back | 98.10%, street 5, protected 0; 7 perturbed variants (keeps +-0.4 m, blocks +-0.4 m, three placing orders) all pass: protected 0-5, street 1-9; hint follower 0/4 (collateral), variants 1/8, foot 0/16, 0 bonds cracked at rest |
| 28 Sister Spires | Hard, hint follower 4/4 (the old misreading "blast the left spire's front" no longer hurts anything) | `bot.hints` only: the misreading is now "blast the BACK of both" (what L21-23 taught): the left spire falls on the school behind it | hint follower 0/4 (collateral, 90%), variants 1/8 (was 7/8: now inside a Hard's band); expert 89.69% (+4.69), layout unchanged |
| 29 Old Tock Row | expert 59% (the clock tower no longer reached the glass block: B stood) | clock tower A x -13 -> -12.4 (0.6 m closer to the row) | 96.11% (+11.1); A at -12.0 / -12.2 / -12.6: 96.7 / 95.1 / 95.9 |
| 26 The Bullet | foot random 4/16 (was 3/16) | TNT given 10 -> 9 (= expert + 1, the N rule) | foot 3/16 as before; gate and variants (6/8) unchanged |

Moved but left alone: L31 naive 4/4 (relief level, allowed by the gate; was 0/4); expert % shifts of -5..+5 elsewhere (table). Smallest unrounded
margins: L16 +4.65, L28 +4.69, L33 +4.90, L17 +5.34. Not met, as before: foot L16 1/16 (H), L26 3/16, L17 4/16 (R); bonds cracked at rest L28 10,
L35 13, L26 1 (steel-column shafts; limiting the steel to the lower storeys with `colsF` removed them on L24 and may do the same there: not tried, it
changes those levels). L24 remains the most layout-sensitive level (see its row). Opening shots and tile comparisons of L15, L24, L26, L29 are refreshed.

| L | Tier | Level | Expert (unrounded %, margin; round-5 base) | Street / protected % | Hint follower | Variants (8) | Naive | Lesson-less | Foot random | Est. time s |
|---|---|---|---|---|---|---|---|---|---|---|
| 13 | R | Harp Span | 4/4 (95.96%, +10.96; was 95%) | 0 / 0 | 4/4 | 8/8 | 0/4 | 0/4 | 1/16 | 87 |
| 14 | N | Stripey Light | 4/4 (90.76%, +5.76; was 91%) | 0 / 0 | 4/4 | 5/8 | 0/4 | n/a | 0/16 | 140 |
| 15 | N | The Sail | 4/4 (90.95%, +5.95; was 88%) | 0 / 0 | 4/4 | 6/8 | 0/4 | n/a | 0/16 | 148 |
| 16 | H | Dome Hall | 4/4 (89.65%, +4.65; was 90%) | 0 / 0 | 0/4 | 2/8 | 0/4 | n/a | 1/16 | 280 |
| 17 | R | The Pedestal | 4/4 (90.34%, +5.34; was 91%) | 0 / 0 | 4/4 | 8/8 | 0/4 | 0/4 | 4/16 | 88 |
| 18 | N | The Doorstop | 4/4 (93.29%, +8.29; was 94%) | 0 / 0 | 4/4 | 5/8 | 0/4 | n/a | 0/16 | 179 |
| 19 | N | Cube Grove | 4/4 (95.98%, +10.98; was 95%) | 0 / 0 | 4/4 | 8/8 | 0/4 | n/a | 0/16 | 88 |
| 20 | SH | Big Bow | 4/4 (91.98%, +6.98; was 93%) | 0 / 0 | 0/4 | 0/8 | 0/4 | n/a | 0/16 | 359 |
| 21 | R | The Stepper | 4/4 (98.11%, +13.11; was 94%) | 1 / 0 | 4/4 | 5/8 | 0/4 | 0/4 | 0/16 | 140 |
| 22 | N | The Pencil | 4/4 (93.82%, +8.82; was 89%) | 1 / 0 | 4/4 | 6/8 | 0/4 | n/a | 0/16 | 120 |
| 23 | N | Tube Bundle | 4/4 (92.31%, +7.31; was 93%) | 0 / 0 | 4/4 | 6/8 | 0/4 | n/a | 0/16 | 120 |
| 24 | H | Deco Needle | 4/4 (98.1%, +13.10; was 98%) | 5 / 0 | 0/4 | 1/8 | 0/4 | n/a | 0/16 | 265 |
| 25 | R | Glass Point | 4/4 (96.62%, +11.62; was 94%) | 0 / 0 | 4/4 | 7/8 | 0/4 | 0/4 | 0/16 | 102 |
| 26 | N | The Bullet | 4/4 (91.62%, +6.62; was 92%) | 0 / 0 | 4/4 | 6/8 | 0/4 | n/a | 3/16 | 116 |
| 27 | N | The Splinter | 4/4 (97.01%, +12.01; was 97%) | 0 / 0 | 4/4 | 7/8 | 0/4 | n/a | 0/16 | 106 |
| 28 | H | Sister Spires | 4/4 (89.69%, +4.69; was 92%) | 0 / 0 | 0/4 | 1/8 | 0/4 | n/a | 0/16 | 282 |
| 29 | N | Old Tock Row | 4/4 (96.11%, +11.11; was 92%) | 0 / 0 | 4/4 | 5/8 | 0/4 | n/a | 0/16 | 147 |
| 30 | SH | Sky Steps | 4/4 (93.4%, +8.40; was 93%) | 0 / 0 | 0/4 | 0/8 | 0/4 | n/a | 0/16 | 378 |
| 31 | R | Stack Tower | 4/4 (93.83%, +8.83; was 94%) | 0 / 0 | 4/4 | 8/8 | 4/4 | n/a | 1/16 | 90 |
| 32 | N | Sky Saucer | 4/4 (97.65%, +12.65; was 99%) | 0 / 0 | 4/4 | 6/8 | 0/4 | 0/4 | 0/16 | 119 |
| 33 | N | Rivet Tower | 4/4 (89.9%, +4.90; was 89%) | 0 / 0 | 4/4 | 8/8 | 0/4 | n/a | 0/16 | 86 |
| 34 | N | Tock Yard | 4/4 (92.83%, +7.83; was 98%) | 0 / 0 | 4/4 | 5/8 | 0/4 | n/a | 0/16 | 142 |
| 35 | H | Dome Works | 4/4 (90.68%, +5.68; was 91%) | 0 / 0 | 0/4 | 0/8 | 0/4 | n/a | 0/16 | 281 |
| 36 | R | Sail Lot | 4/4 (92.95%, +7.95; was 94%) | 0 / 0 | 4/4 | 4/8 | 0/4 | 0/4 | 0/16 | 183 |

Variants / foot / time: `time-l13-36.js` K=8, `foot-bot.js` N=16 random. `l11.rest()` now also returns `deadLinks` (bonds not alive, by part / member
pair / storey). `sim/curve-l13-36.csv` is still the round-5 run.

## 6. For the Lead / Owner

1. **Curriculum shift (needs Owner's OK):** stacking moved to L13 (round 5 did not teach it), so glass is L25 (brief L22), barrels L32 (L26), the lot L36 (L32),
   and **cantilever leaves this range** (L40+). Measured for later: a 1-bay overhang is stable at rest and falls to the overhang side with 2 TNT (94%); cut on
   the other side it does not fall (4%).
2. **Foot rule (decision):** keep "one stack-only building per level" (current), or make it a game rule (e.g. the ground storey of every hero from L13 is steel or
   dark piers)? The first is repetitive, the second is one more thing to teach.
3. **Boosters:** this checkpoint is on the round-5 base, which has the OLD booster schedule (the Safety Net card pops on L13; no Sky Strike, no Wrecking Ball in
   TNT-only). boosters2 ships Ball L11 / Net L21 / Sky L31. Level rows follow boosters2: L21 is the street lesson (the Net's first level: note that a Net on
   the lesson level can hide the lesson: suggest the free Net pointer on L22 instead), L31 has `boosterPush: "sky"` and plays without it. No level needs a booster.
4. **F02 The Tilt** cannot be built as a real leaning stack in this engine (see §4.3). Either a visual-only lean (art pass) or drop F02 from L16/L37 of the brief.
5. `BODY_CAP` 400 (brief Q4) is switched on by v11: confirm on a real phone before it ships.
6. Merge: `levels-v6-l13-36.json` is slots 13–36 for `levels-v6.json`; v11.js goes after v10.js in `patch.js` + one line `window.__blast.l11 = L11_API;` after
   `window.__blast.boost = BST_API;` (see the bottom of `src-l13-36.js`).

## 9. Physical hero rebuild (12/11/2026, level-build agent): the heroes get their real masses

**Why.** Owner on `shots/hero-compare-L13-36.png`: "không giống, tối ưu lại". The art pass of §7 dressed unchanged 1-2 bay shafts, so wide, low and
multi-part landmarks could not read. Here the hero's PHYSICS is rebuilt after the Figma tile: multi-bay bodies, drums, twin and triple towers,
A-frame pylons, end piers, splayed legs, a stepped pyramid, real setbacks; every level was then retuned in level data and re-gated.
**The numbers of this section replace §2, §7 and §8** for every level except L18 (unchanged: its §8 numbers stand).

```bash
cd games/blast
node levels6/tools/src-l13-36.js      # base (round-6 checkpoint, read only) + patch/v11.js + patch/v12.js + the 24 levels -> checkpoints/index-v10f-l13-36.html
```

### 9.1 Engine additions (`levels6/patch/v12.js`, applied after v11; nothing in v10, v11 or `patch.js` is edited)

1. `kind:"kit6"`: a part built from an explicit member list that the generator computes (`tools/src-l13-36.js`: `ZIG` stepped glass pyramid, `PYL` A-frame
   pylons, `DECK` bridge deck plates, `PIERS` end piers, `TRI` three-legged lattice tower, `CUBEK` cube house on a pole). Every box is an ordinary member
   (same keys, strengths and contact bonds as the mass builder): a TNT put on anything that looks structural does what the material ladder says.
2. `L.hero` may list several parts (`"A,S,E"`): `__blast.l11.fill()` measures the box round all of them (a bridge = pylons + deck + piers).
3. `P.loose` on a part: its members STAND on the ground slab instead of being fixed into it (no bond to the anchor; all other bonds as before). A cut
   building then takes its last ground columns with it instead of leaving 4 m stubs standing. `loose: 1` = every member, `loose: "x-"` (or `x+ z- z+`) =
   only that half of the part. Two measured side effects set the rule for its use: (a) a fully loose building is pushed as a whole by its own blasts, so
   it is NOT used next to a protected building (L16 / L35 block B and L36's steel tower fell on the neighbour when loose); (b) a fully loose steel-legged
   tower was shoved over by four single TNT, one per leg, although no leg broke: that would break "steel: stack two". Steel-legged towers are therefore
   loose only on the side AWAY from the legs the plan stacks on (fixed on the stack side: singles do nothing, a stack fells it, the far legs go with it).
4. `P.spire = [w, h]`: a real core member on the middle of the highest roof (the lantern core inside a dome).
5. `L.fillMax` (0.73 on L13-36): the scale rule of the brief §5.2 as a CAMERA rule: the distance fitted to the lot is lengthened until the hero's box
   (with its drawn crown) takes at most that share of the play-area height. Camera only. Before, a tall hero on a narrow lot always filled 85-90%
   (the fit is 92% of the height); the 71-76% of §2 were read while the opening camera was still moving.
6. `__blast.l11.tri()`: triangles and draw calls of the last frame (test API).
7. G-dresses (`G06 G06w G14 G19 G30 G17 G17d G17p G32 G25 G03 G26 G34 G07d G28 G21 G22 G31 G35 G16 G12`): the same visual-only decor as §7 (roofs, domes,
   cables, sails, bands, window strips, tints), now sitting on the real masses. v11's `F..` dresses are still used by L18, L28, L29, L32, L34.
Why the score needs clean falls on low heroes: 40% of the % is `1 - tallest standing member / tallest target`. A 4 m stub costs 4 points under a 40 m
tower and 8 under a 20 m hall. Hence the taller real lantern core on the Dome Hall, timber side blocks, the brick wings cut in the middle of both long
sides, and `loose`.

### 9.2 Per level: what physically changed, and the honest score (1-5: "reads like the Figma tile at phone size")

| L | Hero (tile) | Old → new | What is physically different now | Still weak |
|---|---|---|---|---|
| 13 | F17 Harp Span | 4 → 4.5 | TWO grey concrete A-frame pylons of stepped leg members meeting under a head block, a crossbeam, a 34 m steel deck in six plates, two concrete end piers (kit); cables drawn. The bridge is plain concrete as on the tile (one TNT per front leg and per end pier); the stack lesson moved to a steel-legged tank tower behind it | legs are stepped boxes, not sloped |
| 14 | F28 Stripey Light | 4 → 4.5 | fat shaft: 4 m bays (5 m wide, was 3.4 m), 32 m; rings, gallery and lantern scaled to it | square shaft under round rings |
| 15 | F30 The Sail | 3.5 → 4 | TWIN sail towers (2 x 8 storeys) on one steel deck, link bridge, two sails; the left tower's legs are plain concrete, the right tower's steel (one TNT each / stack) | podium is a table on legs (it hides in the boat hall), no water rim |
| 16 | F14 Dome Hall | 3 → 4 | a WIDE LOW hall (six bays x 4 m = 21 m, 3 storeys) with a real drum and a real lantern core; big dome, a small dome on each wing, pediment. It stands behind the hospital; the steel stack is on the right-hand block, the two other blocks are timber | side blocks stand in front of it |
| 17 | F21 The Pedestal | 4 → 4.5 | broad plinth: 3 x 2 bays of 4.2 m (9.3 m wide, was 7 m), 26 m, star base scaled | - |
| 18 | F24 The Doorstop | 3.5 → 4 | a REAL wedge plan (kit): five column lines, 2.4 m deep at the flat-cut cream nose to 6.4 m at the back, 8 storeys of brick columns, plates and panels; teal windows, slate roof | from the opening camera the long face hides most of the taper |
| 19 | F35 Cube Grove | 3.5 → 4 | five BIG cubes (6 m, kit: pole, floor, four walls, roof are members) on 8.4 m poles, in an arc | cubes are not tilted (members are axis-aligned boxes); five, not seven |
| 20 | F32 Big Bow | 4 → 4.5 | each end is a squat sandstone base carrying TWO towers (the road passes between them), 22 m span between the pylon pairs, twin arches rise above the pylons | the arch truss itself is still drawn on the real deck plates |
| 21 | F22 The Stepper | 4 → 4.5 | the setbacks are real tiers (4 → 3 → 2 bays, centred) | - |
| 22 | F26 The Pencil | 3.5 → 4 | cream needle on 3.6 m bays; the ONE wing is a real 5-storey block beside the shaft | the tile itself is the weakest of sheet F5 |
| 23 | F34 Tube Bundle | 3.5 → 4 | the tubes are real nested tiers of four heights on a 3 x 2 bay base (a drawn head makes the fifth) | two of the five tube tops are one tier with a drawn head |
| 24 | F16 Deco Needle | 3.5 → 4 | the tile's wide base is real: 3 x 2 bays under a 2 x 2 shaft, plain grey stone (no steel or dark legs in the hero any more), stepped crown and needle | two real setbacks; the crown steps are drawn |
| 25 | F06 Glass Point | 2.5 → 4.5 | a REAL four-step glass pyramid (17 m base, kit: a deck on four corner piers per step, glass hung outside the deck edge) before two brick palace wings with mansard roofs. TNT on glass breaks glass only; the four dark ground piers drop all four steps | wings are two blocks, not one long palace |
| 26 | F25 The Bullet | 3.5 → 4 | fat barrel: one 6.4 m bay (7.6 m wide, was 3.4 m), 7 storeys, swelling round bands, diagonal grid, low round cap | square plan under the round bands |
| 27 | F31 The Splinter | 3.5 → 4 | the shard tapers for real (3 x 3 → 2 x 2 bays), corner shards, split point | taper is one step, not a slope |
| 28 | F07 Sister Spires | 4 → 4 | THREE glass spires (two in front, one behind), three bridge plates (each fixed to one tower only: 0 bonds cracked at rest, was 10) | bridges form a T, not the tile's triangle |
| 29 | F01 Old Tock | 4.5 → 4.5 | squat as the tile: 5 m bays (6 m wide, was 3.4 m), 5 storeys + the clock stage | - |
| 30 | F12 Sky Steps | 4 → 4 | symmetric real setbacks (3 → 2 bays) on 3.4 m bays, glass sub-steps both sides, needle | two real setbacks only |
| 31 | F19 Stack Tower | 3 → 4 | five glass segments on 4.2 m bays (5.6 m wide, was 3.6 m), flared dark plates, dark stilts | flares are drawn bands |
| 32 | F04 Sky Saucer | 4.5 → 4.5 | hero unchanged (the steel side tower is `loose`) | - |
| 33 | F03 Rivet Tower | 4 → 4.5 | THREE splayed steel legs of stepped members, a deck, a tapering shaft of three small storeys, a glass cabin (kit); lattice drawn. Barrels stand round ONE leg: one TNT there and the tower falls that way | - |
| 34 | F01 Old Tock | 4.5 → 4.5 | as L29 | - |
| 35 | F14 Dome Hall | 3 → 4 | as L16 (six bays), green dome; a row of barrels behind the hall takes its whole back row with ONE TNT; trap barrels on the inner side of the two side blocks | as L16 |
| 36 | F30 The Sail | 4 → 4 | twin sail towers on one concrete podium between the school and the hospital; the steel side tower is gone (it fell on the hospital in some placing orders) | - |

### 9.2b Owner's rule of 12/11 (hero first, difficulty only from the surroundings): what was tuned by what

After the heroes were built to the tiles, difficulty and the gate were tuned ONLY with side buildings, protected buildings, street / lot position, barrels,
TNT count and the camera. Where the hero had been bent for the puzzle, it was put back to the tile:

| L | Tuned with (surroundings only) | Lesson / tip that used a hero material, and where it went |
|---|---|---|
| 13 | steel tank tower added behind the bridge (loose on its far side); TNT 9 → 10 | "Steel leg? Stack two TNT." was on the pylon legs (steel pylons do not match the grey concrete tile): now on the tank tower; the bridge is plain concrete. Tip unchanged |
| 14 | brick hall behind became a 3 m bay block (one TNT in the middle of each long side); gantry loose on its far side | - |
| 15 | block behind the hall removed; boat hall enlarged round the twin towers | stack on steel is still on the hero's legs under the deck (hidden in the hall: as before the rebuild). LISTED: hero material carries the practice |
| 16 | hero moved behind the hospital; steel stack moved to side block B; side blocks C, D timber (1 TNT each); hospital 7.5 m in front of the hall; TNT 11 → 12 | steel stack: side block B. Tip unchanged |
| 17 | steel tower 13 m out, timber block 13.5 m out | LISTED: the dark piers of the lesson are the hero's own two lowest storeys (tile: solid plinth to the ground). Putting the lesson on a side building is a new level: not done |
| 18 | hall + hidden core moved 2 m back, side block 1.6 m out; TNT 9 → 10 | - |
| 19 | steel tank tower lowered to 4 storeys (the cubes stay the tallest thing) | LISTED: each cube stands on one dark pier (tile: grey concrete pole): the pole IS the lesson of this level |
| 20 | hall + core 4 m further back; protected buildings follow the pylons | LISTED: left base on dark piers, right base on steel legs (tile: solid stone bases) |
| 21 | steel tower and timber block moved out | - |
| 22 | block behind became 2 x 2 (2 TNT); TNT 10 → 11 | - |
| 23 | brick block and timber hall moved back for the wider hero; TNT 10 → 11 | - |
| 24 | protected buildings 11 m out (were 5.6 m), side blocks 8 m back from the road and further out, steel stack moved to side block C; TNT 10 → 11 | steel back legs / dark front piers were IN the hero: removed. The stack is on side block C; ftip rewritten: "Blast the backs. Steel block: stack." |
| 25 | steel tower removed; two brick palace wings (they are on the tile) | lesson "glass holds nothing" is the pyramid itself (glass on dark piers), as on the tile |
| 26 | side blocks moved out; glass block and brick block loose | LISTED: steel frame behind the glass on the two lowest storeys (the tile's steel diagrid) |
| 27 | row moved for the wider base; steel tower lowered; expert plan one TNT less | - |
| 28 | third spire added; brick block removed; school / hospital moved | LISTED: left spire on dark piers, right spire on steel (tile: glass to the ground) |
| 29 | steel tower lowered and moved 3 m back; glass block one storey lower | - |
| 30 | glass side block 3 x 2 → 2 x 2 (TNT 13 → 12, inside 7-12); school 1.4 m further out | LISTED: dark piers under the glass ground storey |
| 31 | steel tower and sheds moved out | dark stilts are on the tile |
| 32 | (hero unchanged) steel side tower loose on its far side | - |
| 33 | barrels round ONE leg; row moved for the tripod; TNT 9 | steel legs are on the tile |
| 34 | steel tower lowered | - |
| 35 | barrels behind the hall (help) and on the inner side of the side blocks (trap); steel stack on side block B; TNT 11 → 10 | - |
| 36 | steel tower removed (it fell on the hospital in some placing orders); school / hospital 14.6 m out; lot widened; TNT 11 → 10 | - |

"LISTED" = the hero still carries a taught material at its foot (dark piers or steel legs) that the tile does not show. It was there before this run and the
level's lesson or tip rests on it; moving it to a side building changes the level's idea, so it is listed here for a decision instead of done silently.

### 9.3 Gate (bots, zero upgrades, no boosters; a fresh page per run; 4 seeds; the checkpoint of this commit)

| L | Tier | Level | Expert (min unrounded %, margin) | Blasts | Street / protected % | Hint follower | Variants (8) | Naive | Lesson-less | Foot random | Est. time s | screenFillPct | Hero m | Sec. ratio | Bodies | Cracked at rest | Triangles | ms/step (loaded machine) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 13 | R | Harp Span | 4/4 (94.61%, +9.61) | 1 | 0 / 0 | 4/4 | 8/8 | 0/4 | 0/4 (55%) | - | 88 | 72 (w 69) | 36.9 | 0.8 | 94 | 0 | 25576 | 14.13 |
| 14 | N | Stripey Light | 4/4 (93.52%, +8.52) | 1 | 0 / 0 | 4/4 | 6/8 | 0/4 | n/a | 0/16 | 114 | 72 | 39.1 | 0.64 | 254 | 0 | 51410 | 50.21 |
| 15 | N | The Sail | 4/4 (90.89%, +5.89) | 2 | 0 / 0 | 4/4 | 8/8 | 0/4 | n/a | 0/16 | 112 | 73 | 49.4 | 0.09 | 240 | 0 | 51880 | 47.06 |
| 16 | H | Dome Hall | 4/4 (96.59%, +11.59) | 1 | 0 / 0 | 0/4 | 0/8 | 0/4 | n/a | 1/16 | 285 | 42 | 24.8 | 0.84 | 239 | 0 | 50616 | 16.1 |
| 17 | R | The Pedestal | 4/4 (89.33%, +4.33) | 1 | 0 / 0 | 4/4 | 8/8 | 0/4 | 0/4 (22%) | - | 88 | 64 | 31.2 | 0.8 | 160 | 0 | 35728 | 27.61 |
| 18 | N | The Doorstop | 4/4 (91.84%, +6.84) | 2 | 0 / 0 | 4/4 | 6/8 | 0/4 | n/a | 0/16 | 149 | 73 | 35.8 | 0.68 | 356 | 0 | 67024 | 19.35 |
| 19 | N | Cube Grove | 4/4 (98.01%, +13.01) | 1 | 0 / 0 | 4/4 | 8/8 | 0/4 | n/a | 0/16 | 86 | 39 (w 85) | 18.7 | 1.16 | 67 | 0 | 21664 | 4 |
| 20 | SH | Big Bow | 4/4 (89.18%, +4.18) | 2 | 0 / 0 | 0/4 | 0/8 | 0/4 | n/a | 0/16 | 347 | 45 (w 70) | 23.2 | 1.05 | 314 | 0 | 64464 | 31.26 |
| 21 | R | The Stepper | 4/4 (97.84%, +12.84) | 1 | 0 / 0 | 4/4 | 6/8 | 0/4 | 0/4 (92%) | - | 118 | 73 | 45.1 | 0.64 | 223 | 0 | 45662 | 30.23 |
| 22 | N | The Pencil | 4/4 (96.24%, +11.24) | 1 | 6 / 0 | 4/4 | 6/8 | 0/4 | n/a | 0/16 | 122 | 73 | 52.6 | 0.64 | 258 | 0 | 51278 | 28.41 |
| 23 | N | Tube Bundle | 4/4 (95.73%, +10.73) | 1 | 0 / 0 | 4/4 | 6/8 | 0/4 | n/a | 0/16 | 122 | 73 | 36.6 | 0.79 | 332 | 0 | 65378 | 26.59 |
| 24 | H | Deco Needle | 4/4 (98.72%, +13.72) | 1 | 2 / 0 | 0/4 | 0/8 | 0/4 | n/a | 1/16 | 275 | 73 | 55.7 | 0.45 | 312 | 0 | 61084 | 23.67 |
| 25 | R | Glass Point | 4/4 (97.33%, +12.33) | 1 | 0 / 0 | 4/4 | 7/8 | 0/4 | 0/4 (30%) | 0/16 | 102 | 63 (w 88) | 24.1 | 0 | 200 | 0 | 43044 | 21.72 |
| 26 | N | The Bullet | 4/4 (90.83%, +5.83) | 1 | 0 / 0 | 4/4 | 6/8 | 0/4 | n/a | 0/16 | 112 | 73 | 37.4 | 0.56 | 215 | 0 | 45718 | 15.41 |
| 27 | N | The Splinter | 4/4 (95.44%, +10.44) | 1 | 0 / 0 | 4/4 | 6/8 | 0/4 | n/a | 0/16 | 125 | 73 | 42.2 | 0.7 | 278 | 0 | 53952 | 29.22 |
| 28 | H | Sister Spires | 4/4 (91.72%, +6.72) | 1 | 0 / 0 | 0/4 | 1/8 | 0/4 | n/a | 0/16 | 283 | 73 (w 41) | 54.3 | 0.13 | 315 | 0 | 61516 | 19.71 |
| 29 | N | Old Tock Row | 4/4 (92.40%, +7.40) | 1 | 0 / 0 | 4/4 | 7/8 | 0/4 | n/a | 0/16 | 106 | 65 | 36.2 | 0.82 | 297 | 0 | 57760 | 32.64 |
| 30 | SH | Sky Steps | 4/4 (90.01%, +5.01) | 2 | 3 / 0 | 0/4 | 0/8 | 0/4 | n/a | 0/16 | 355 | 73 | 58.9 | 0.58 | 272 | 0 | 53638 | 20.64 |
| 31 | R | Stack Tower | 4/4 (89.33%, +4.33) | 1 | 0 / 0 | 4/4 | 8/8 | 0/4 | n/a | - | 87 | 73 | 37.4 | 0.66 | 236 | 0 | 47160 | 21.71 |
| 32 | N | Sky Saucer | 4/4 (97.47%, +12.47) | 1 | 0 / 0 | 4/4 | 7/8 | 0/4 | 0/4 (65%) | 0/16 | 104 | 73 | 58.3 | 0.49 | 238 | 0 | 47556 | 8.58 |
| 33 | N | Rivet Tower | 4/4 (93.28%, +8.28) | 1 | 0 / 0 | 4/4 | 7/8 | 0/4 | n/a | 0/16 | 96 | 70 | 39.9 | 0.72 | 212 | 0 | 44052 | 17.99 |
| 34 | N | Tock Yard | 4/4 (93.82%, +8.82) | 1 | 0 / 0 | 4/4 | 7/8 | 0/4 | n/a | 1/16 | 99 | 73 | 36.2 | 0.82 | 198 | 0 | 41656 | 25.25 |
| 35 | H | Dome Works | 4/4 (89.77%, +4.77) | 2 | 0 / 0 | 0/4 | 3/8 | 0/4 | n/a | 0/16 | 293 | 42 | 24.8 | 0.84 | 223 | 0 | 46726 | 28.67 |
| 36 | R | Sail Lot | 4/4 (95.09%, +10.09) | 1 | 0 / 0 | 4/4 | 7/8 | 0/4 | 0/4 (92%) | 3/16 | 101 | 73 | 49.4 | 0.33 | 264 | 0 | 57064 | 24.34 |

Columns as §2 and §8. *Expert* = min over 4 seeds, unrounded. *Hint follower* = the gate's sensible bot (on H / boss its hints carry the
misreading, 0/4 wanted). *Variants* and *Est. time* = `sim/time-l13-36.js` K=8. *Foot random* = `tools/foot-bot.js` N=16, MODE=random.
*Bodies / cracked / fill / ms per step* = `sim/lab-l13-36.js info perf` (headless swiftshader: an upper bound, not a phone number).

`determinism-check.js` (MAXL=36; seq, after other levels, fresh pages, waits, real-time gaps, one live game-loop run), the five multi-blast levels:
L15 90.887%, L18 91.840%, L20 89.182%, L30 90.007%, L35 89.773%: **every run identical**. Single-blast levels: same pose hash twice (`lab det`), 24/24.
Runs on scratch copies of the build; the final checkpoint gives the same expert % on all 24 (`lab exp`).

### 9.4 What is not met, and what I would do next (honest list)

1. **Weakest reads: none under 4 by my own score, but three are borderline:** L24 Deco Needle (real base now; the long stepped crown is drawn),
   L18 The Doorstop (real wedge, but the opening camera looks at its long face, so the taper shows little: a start yaw nearer the nose would show it
   and would hide the core behind: not changed), L28 Sister Spires (three spires, bridges form a T, not the tile's triangle: members are axis-aligned boxes).
   No tile had to be swapped.
2. **Screen fill.** Tall heroes are now 72-73% by the camera rule `fillMax` (they were 85-90% once the opening camera had settled). Wide, low heroes
   cannot reach 60% of the HEIGHT: Dome Hall L16 / L35 (about 40%), Cube Grove L19 (39%, 85% of the width), Big Bow L20 (45%, 70% of the width),
   Glass Point L25 (63%, 88% of the width), The Pedestal L17 (64%), Old Tock Row L29 (66%, a long row). The smallest column on screen is 2.5-8 px (brief:
   >= 12 pt): unchanged need for the invisible 44 pt tap targets.
3. **Step time.** The ms/step column was measured while four other bot jobs ran on the same 4-core machine (load average 30-45): the unchanged L18 read
   40.7 ms here against 5.9 ms in §2, a factor of about 7. Divide by 7 for a rough headless figure (1.4-10 ms); it must be measured again on a quiet
   machine and on a phone. Bodies 67-345 (cap 400), 0 bonds cracked at rest on all 24 (§8 had 10 / 13 / 1 on L28 / L35 / L26).
4. **Order sensitivity (Hard levels with protected buildings).** Same charges in three placing orders: measured on the five-bay hall build: L16 98.4 / 81.1 / 90.0%
   (protected 0 in all three: the 81 is the steel block falling short, a near-miss, not a hit), L35 91.2 / 89.4 / 89.6%. L24 (new base): four layouts of the
   surroundings all passed (97.3-98.9%, street 1-2, protected 0-4). L16 is the one to watch in playtest.
5. **TNT.** Given / expert: L13 10/8, L14 9/8, L15 10/9, L16 12/12 (was 11/10: the hall's whole back row of six), L17 10/8, L18 10/9, L19 10/9, L20 11/10, L21 10/8,
   L22 11/10 (was 10/9), L23 11/9, L24 11/10, L25 10/8, L26 9/8, L27 11/10, L28 11/10, L29 11/10, L30 12/12, L31 10/8, L32 10/8, L33 9/8, L34 10/9, L35 10/9,
   L36 10/8 (was 11/10). L23 has one spare TNT more than the N rule (expert + 1).
6. **Twists against the brief's table (§5.4):** F35 has five cubes (brief: seven) and they are not tilted; F07's bridges form a T, not a triangle; F32's twin
   arches are drawn on real deck plates; Everything else follows the tile and its one twist.
7. **Variants and time.** By the 8 randomised hint followers: N levels 6-8/8 (target 6-8), Hard L16 0/8, L24 0/8, L28 1/8, L35 3/8 (target 3-5: only L35 is in the
   band), bosses 0/8 (target 1-3). The estimate (40 s x (1 + 0.1 TNT) + collapse, x attempts, attempts capped at 3) gives R 86-118 s, N 86-149 s, H 275-293 s,
   bosses 347-355 s: Hard and boss sit above "about 2 minutes" because no variant passes them (x 3). They are hard by the misreading built into the tip, as in §8;
   making them softer is a surroundings job (one more TNT, or the protected building a bay further away) for the next pass.
8. **Foot plans (16 random, all TNT at the foot, one blast):** 0/16 on every N / H / boss level except L16 1/16, L24 1/16, L34 1/16 (inside the <= 1/16 limit;
   the tool's own stricter "0 on Hard" flag shows on L16 and L24). R levels are not gated on this (L36 3/16 on the earlier layout with the steel tower).
9. **Triangles** of the opening frame 22k-67k: over the 60k aim on L18 (67k), L23 (65k), L20 (64k), L28 (62k), L24 (61k).
10. **Determinism:** the expert plan twice on one seed gives the same pose hash on all 24 (`lab-l13-36.js det`); `determinism-check.js` (MAXL=36, all modes + one
   live game-loop run): see the line under the table.

### 9.5 For the Lead

1. Merge: `patch/v12.js` goes after `patch/v11.js` (as `tools/src-l13-36.js` does); `levels-v6-l13-36.json` is slots 13-36. New level fields the game
   ignores without v12: `hero` as a list, `fillMax`, part fields `loose`, `spire`, `kind:"kit6"`.
2. `fillMax` works on any level (L1-12 too) if Owner wants the 60-75% rule there; it is not set on L1-12 by this run.
3. The checkpoint is built on the round-6 base as it stood in the working tree (with the L1-12 agent's level data of that moment); L1-12 are theirs.
4. Shots: `shots/l13-36-Lxx.png` (opening, 390x844, camera settled), `shots/hero-compare-Lxx.png` (tile | game), contact sheet `shots/hero-compare-L13-36.png`.

