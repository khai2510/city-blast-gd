# Easy pack E01–E10 (plan, 20/11)

Khai asked for **10 easy levels**. This is the plan. E01 is built and tested (`E01/`); E02–E10 wait until Khai has played E01 ("xong màn nào gửi Khai màn đó").

## Assumptions (Lead's, for Khai to correct)

- **Tier N (Normal).** Pass bars from LEVEL-PROCESS §2: oneBomb < 70%; allFoot / footOnly < 80%; fair player wins 3/3; machine spare TNT ≥ 2; ≥ 2 blasts; 20–75 s.
- **oneWave < 80% is relaxed** for easy levels. It is reported, but an easy level does not fail on it alone. No other hard-level rule is relaxed.
- **Rising reaction curve:** no jump of more than 40 points between two consecutive bomb counts.
- **One simple lesson per level**, building the basics in order. Only mechanics that already exist in `engine.js`.
- **Every LEARNINGS rule still holds:**
  - no hints in the game; the fail line is ≤ 9 words and states a principle;
  - ordered, symmetric layout;
  - side buildings 10–25 m, each with a role;
  - one chain-reaction wow and one realization moment;
  - L32-grade look with its own g7 builder;
  - landmark inspiration only, never a copy;
  - no duplicates of the F-landmarks (clock tower, leaning tower, windmill, lighthouse, saucer, twin spires, Art Deco needle, flatiron, dome hall…) or of L01–L04 (pagoda, fortress keep, opera house, canal houses);
  - nothing from Smash Fest.
- **Shown before taught.** A thing may first appear as spectacle (E01 drums go off by themselves) and be taught as a tool later (E03).

## The pack

TNT for E02–E10 is a first guess. The tester sets the real number for each level.

| # | Name | Lesson (one line) | Inspiration (never a copy) | Main + side buildings (role) | Mechanics | TNT | Wow | Realization |
|---|---|---|---|---|---|---|---|---|
| E01 ✅ | **Long Legs** | **Hit the legs.** | modernist housing slab raised on sculpted pilotis, colourful loggias, roof terrace | slab: 3 sections × 4 legs, 5 storeys, funnel stack and roof gyms (heavy) · 2 timber clubhouses on stilts (easy, chain end) · red drums under both slab ends (gift) | separate blocks (bg), hard7 count, hit7.drums, drop7 on floors as plumbing (floors ignore TNT until they fall) | 19 | 2 bombs on the end legs: the end block swings down, the drums go off, the clubhouse beside it falls | a bomb on the facade only breaks glass (2%); a bomb on a leg drops a whole block. The heavy roof piece lands whole: one more bomb |
| E02 | **Shot Tower** | **Two legs side by side tip it.** | 19th-century brick shot tower | tall brick tower on 8 legs (tip rule nx 3 × nz 3) · long goods shed on one side (target, soft) · garden wall on the other (easy) | tip rule, bg | 14 | the tower lies down along the shed and flattens it end to end | one leg: nothing. Two neighbours: it leans that way |
| E03 | **Tram Depot** | **Red drums blast for free.** | brick tram depot with arched sheds | depot: stout brick piers; drum stacks against the front piers (gift) · 2 signal cabins (easy) | drums, bg | 14 | one bomb on a drum stack sets off the whole row along the facade | a bomb by the drums does twice the work |
| E04 | **Market Hall** | **Wood falls easy; brick shields.** | covered timber market hall behind a brick arcade | timber hall (easy) · brick arcade in front (shield) · 2 brick kiosks (hard, small) | materials ladder, shield | 16 | through the arcade, one bomb and the whole timber roof folds in | bombs on the brick only chip it; the timber behind is where the gain is |
| E05 | **Star Dome** | **Break the shell before the core.** | public observatory: brick drum, dome, telescope pier | brick drum and dome (shell) around an RC telescope pier (core, hard7) · 2 study wings (easy) | shell + core, hard7 | 18 | the dome caves in and drags the drum with it | the core is not tappable until the shell is open |
| E06 | **Boiler Stack** | **Topple direction.** | brick factory chimney and its boiler house | tall chimney (tip rule) · boiler house (target) · empty yard on the far side | tip rule, aim test | 16 | the chimney falls the length of the boiler house: a chain of roof bays | the side you open is the side it falls to |
| E07 | **Bathhouse** | **A blue building to keep clear (gentle).** | domed public bathhouse | domed bath hall (main) · school (keep6, generous gap, one side) · 2 colonnade wings (easy) | keep6, tip | 18 | the main dome drops straight into the hall, the school untouched | a big blast throws debris towards the blue; small blasts drop it in place |
| E08 | **Grain Elevator** | **Reinforced corners need repeated hits.** | concrete grain elevator: silo row and head house | head house on hrc corners (3 cracks, damage stays) · silo row (soft cylinders) · weigh house (easy) | hrc (no layer7) | 20 | the head house drops onto the silo row and the silos roll | the corner cracks but stands: hit it again |
| E09 | **High Cistern** | **A light drop-first.** | riveted water tower on a brick base | brick tower with a heavy cistern on top (drop7, fall 1.5 m) · 2 pump houses (easy) | drop7 (light), bg | 20 | the cistern crashes through the tower and breaks open on the ground | bombs on the cistern up high do nothing; down on the ground one cracks it |
| E10 | **Rail Terminus** (finale) | **Put it together.** | iron-and-glass train shed with a brick head building | head building on legs (tip) · train shed (target) · drums at the shed piers · school at a safe distance | tip, drums, keep6 (≤ 3, all taught) | 24 | the head building tips into the shed, the drums go off, the glass roof comes down bay by bay | read before blasting: which legs, which side, what to keep |

Order of the basics: legs (E01) → direction (E02) → free blasts (E03) → materials (E04) → order of work (E05) → aiming (E06) → restraint (E07) → patience (E08) → order with height (E09) → all together (E10).

## SLOTS-50 (23/11, Khai D-blast-LAUNCH / D-blast-L50 / D-blast-PAD): the pack on the launch schedule

Launch: wood 1 · brick 4 · concrete 8 · Ball 12 · blue 15 · glass 20 · red drums 25 · Net 30 · steps 35 · steel 40 · Sky 45 · heavy 50 ·
dark RC 60 · drop 70. Every E-level placed in 1-50 now uses only what is launched by its slot (`SLOTS-50.md` §1), and the five NEW levels
(§5) are built. E08 (dark RC teach, ~60) and E09 (drop teach, ~70) are not in 1-50 and are unchanged. Every lot is centred on the pad
centre (0, 0) and inside the sand pad (D-blast-PAD; farthest member corner ≤ 17.7 m from the centre, pad radius 25 m, 30 m widened).

**Bars** (as OLD-POLISH for the early slots): slot 3 tutorial (expert plan in one blast keeps ≥ 1, oneBomb < 70 %); before 35 the expert
plan (`sol`) wins in ONE blast, fair 3/3, spare ≥ 2, oneBomb < 70 %; from 35 (steps) fair 3/3 in ≥ 2 blasts, spare ≥ 2, 20-75 s. With no heavy
piece before 50, allFoot / footOnly are reported (as OLD-POLISH before its dark slot); the curve jump ≤ 40 is reported on the tip lessons.
Gate: `pipeline7/gate50.mjs` (one session per level: rest 8 s + pad, budget calibration, fair 3 seeds, sol, oneBomb, lazy, allFoot,
footOnly, oneWave, curve, shots), test build on main's `31-polish.html`. Engine: gated easy-only options (`legKey`, `postKey`, `deck0Key`,
`heavyKey`, `mat: 'wood'`, `clere`; default = the 22/11 level) and the block `g7 EASY 3` (E11-E15 builders). `SLOT50=0 node make-level.mjs`
rebuilds a converted level as it was on 22/11.

| Code | Name | Slot | Elements before → after | TNT | Expert, one blast | fair 3/3: spare · blasts · s | oneBomb / lazy | allFoot / footOnly | curve jump | at rest | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| E04 | Market Hall | 3 | wood, brick, glass, heavy roof, steps, drop7 → **wood** | 6 | WIN 89 % (5 TNT) | 3/3: 0/0/0 · 1/1/1 · 13/13/13 | 62 / 100 % | 25 / 25 % | +21 | 0 dead, 0 moved, bonds 421→421 | **PASS** |
| E02 | Shot Tower | 5 | wood, brick, dark RC legs, heavy, steps, drop7 → **wood, brick** | 11 | WIN 90 % (4 TNT) | 3/3: 2/2/2 · 1/1/1 · 18/18/18 | 10 / 72 % | 85 / 90 % | +75 | 0 dead, 0 moved, bonds 1084→1084 | **PASS** |
| E06 | Boiler Stack | 9 | brick, concrete, dark RC legs, heavy tank, steps, drop7 → **brick, concrete** | 11 | WIN 93 % (4 TNT) | 3/3: 2/2/2 · 2/2/2 · 27/27/27 | 66 / 55 % | 63 / 73 % | +5 | 0 dead, 0 moved, bonds 441→441 | **PASS** |
| E07 | Bathhouse | 21 | wood, brick, glass, heavy dome/attic/roofs, blue, steps, drop7 → **wood, brick, glass, blue** | 14 | WIN 89 % (11 TNT) | 3/3: 3/3/3 · 2/3/2 · 26/33/26 | 22 / 70 % | 88 / 92 % | +60 | 0 dead, 0 moved, bonds 345→345 | **PASS** |
| E03 | Tram Depot | 25 | wood, brick, glass, heavy, drums, steps → **wood, brick, glass, drums** | 11 | WIN 90 % (5 TNT) | 3/3: 5/3/2 · 2/3/3 · 24/33/33 | 33 / 72 % | 73 / 96 % | +31 | 0 dead, 0 moved, bonds 503→503 | **PASS** |
| E10 | Rail Terminus | 26 | wood, brick, dark RC legs, heavy gables/turret, drums, blue, steps, drop7 → **wood, brick, drums, blue** | 8 | WIN 86 % (8 TNT) | 3/3: 2/2/2 · 1/1/1 · 14/13/13 | 60 / 62 % | 82 / 89 % | +46 | 0 dead, 0 moved, bonds 312→312 | **PASS** |
| E05 | Star Dome | 36 | wood, brick, glass, heavy core + dome, steps, drop7 → **wood, brick, concrete, glass, steps** | 19 | — | 3/3: 3/4/3 · 5/4/4 · 61/51/52 | 14 / 11 % | 79 / 80 % | +48 | 0 dead, 0 moved, bonds 485→485 | **PASS** |
| E11 | Ice Rink | 37 | NEW → **brick, concrete, glass, drums, steps** | 9 | plan 30 % (3 TNT) | 3/3: 2/2/2 · 2/2/2 · 23/23/23 | 23 / 92 % | 41 / 68 % | +31 | 0 dead, 0 moved, bonds 394→394 | **PASS** |
| E12 | Telephone Exchange | 38 | NEW → **wood, concrete, blue, steps** | 10 | plan 71 % (3 TNT) | 3/3: 2/2/2 · 2/2/2 · 25/24/23 | 58 / 84 % | 88 / 94 % | +68 | 0 dead, 0 moved, bonds 605→605 | **PASS** |
| E13 | Radio Mast | 46 | NEW → **wood, concrete, steel, steps** | 15 | plan 40 % (2 TNT) | 3/3: 3/4/5 · 2/2/2 · 29/29/28 | 54 / 68 % | 96 / 90 % | +23 | 0 dead, 0 moved, bonds 454→454 | **PASS** |
| E14 | Palm House | 47 | NEW → **wood, concrete, glass, steel, drums, steps** | 12 | — | 3/3: 2/2/2 · 2/2/2 · 28/28/28 | 44 / 37 % | 92 / 96 % | +21 | 0 dead, 0 moved, bonds 303→303 | **PASS** |
| E15 | Parachute Tower | 48 | NEW → **brick, concrete, steel, blue, steps** | 11 | plan 50 % (2 TNT) | 3/3: 2/2/2 · 2/2/2 · 24/24/24 | 13 / 49 % | 88 / 86 % | +33 | 0 dead, 0 moved, bonds 301→301 | **PASS** |
| E01 | Long Legs | 50 | wood, concrete, glass, dark RC legs, heavy, drums, steps, drop7 → **wood, concrete, glass, heavy, drums, steps** | 18 | — | 3/3: 8/2/3 · 3/4/4 · 33/47/47 | 27 / 66 % | 68 / 64 % | +25 | 0 dead, 0 moved, bonds 1252→1252 | **PASS** |

On the steps levels (E05, E11-E15, E01) the expert column is blast 1 of the plan only ("plan n %"), or — where the fair player is the proof.
Changes per level: each `<E>-SUMMARY.md`, section "SLOTS-50". New levels: `E11`-`E15/1-GD-SPEC.md`.

Open points (not hidden):
- **Curve jump > 40** on the tip / aim / blocks lessons: E02 +75, E12 +68, E07 +60, E05 +48, E10 +46 (E02 was already Khai's call, LEARNINGS 5).
- **allFoot / footOnly ≥ 80 %** on most levels: no heavy piece before 50 (reported, as OLD-POLISH before its dark slot). E01 (heavy kept) is < 80.
- **E02 legs, posts and leg deck use `g7bk`**, the kit's brick-clad member (brick look, one TNT per leg): plain `bk` legs let one TNT
  take two neighbours (oneBomb 84 %). The order audit counts it as brick (as on the E06 / E10 shafts). If Khai reads it as dark RC, the
  other lever is wider leg gaps (the hero changes).
- **E04** at slot 3: the fair bot spends 3 TNT a building, so it keeps 0 of 6 (reported, O01 precedent); the expert plan keeps 1.
  The two brick weigh houses are gone (tutorial budget, two buildings).
- **E10** expert plan needs all 8 TNT (86 %); **E11** "lazy" (4 TNT at the hall foot, after a turn) gives 92 %; **E15** the blind fair
  player never hits the school (keep 0): the aim lesson is gentle. **E13**: the hall in front hides the plinths from the street (a turn shows them).
  **E14** has no `sol` (the base row read 0 % in one blast); the fair player proves it.
- **Not in the game yet:** E11-E15 wait for PLACE (order agent): `export-easy.js` exports each one as soon as PLACE lists it.
- `src/g7hard/order-audit.json` still has the 22/11 element rows for E01-E10: re-audit for `check-order.js` (order agent).
