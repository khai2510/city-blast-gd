# E06 "Boiler Stack": result (Normal, COMBINE, 17 TNT): PASS on the easy-pack bars

| Step | Result | File |
|---|---|---|
| 1. GD spec | lesson, shape, roles, wow, realization | `1-GD-SPEC.md` |
| 2. Figma | **skipped in this run** (the Lead handles Figma separately) | — |
| 3. Builder | `g7stack` (square brick chimney: 8 RC legs clad in brick under the tip rule with a 2 s hinge, corbelled arch heads, a brick pedestal with a soot door, a tapering shaft of RC-in-brick posts (`g7bk`) and brick walls (`g7bkw`) with iron bands, a corbelled crown, a sooty lip and a puff of smoke) and `g7boil` (boiler house: brick bays with tall arched windows, slate roof bodies with glazed louvre lanterns, glowing boilers inside as decor, a riveted feed-water tank on each roof (`hard7v`)) in `pipeline7/engine.js` | `make-level.mjs` → `level.json` |
| 4. Tester | run B (the tester picked 17) and run C (`tntStart` 17) pass every easy-pack bar; `run.mjs` prints FAIL only for oneWave (85 %), which is reported only on easy levels | `results.json` (run C) |

## Numbers

| Test | Bar | Run B | Run C (17 fixed) |
|---|---|---|---|
| oneBomb (best of 18) | < 70 % | 12 % | 12 % |
| lazy (4 at the chimney foot) | — | 39 % | 39 % |
| allFoot | < 80 % | 64 % | 64 % |
| footOnly | < 80 % | 78 % | 78 % |
| oneWave | reported only | 85 % | 85 % |
| fair, 3 seeds | 3/3 | WIN ×3 | WIN ×3 |
| spare TNT | ≥ 2 | 2 / 2 / 2 | 2 / 4 / 4 |
| blasts | ≥ 2 | 4 / 4 / 4 | 4 / 4 / 4 |
| estimated time | 20–75 s | 46 s | 46 / 43 / 43 s |
| fair, open probe (40 TNT) | — | 13 used, 4 waves, 100 % | same |

- **Curve** (n bombs on the chimney foot, one blast; % / collapse): 1: 1/1 · 2: 33/36 · 3: 34/36 · 4: 32/36 · 6: 35/38 · 8: 38/41 · 12: 38/41. Biggest jump +32 (1 → 2). The tester's first two foot charges open the yard side, so the chimney falls away from the house; the ceiling is the chimney alone.
- **Aim probe** (two legs on one face, one blast, then 14 s):
  - towards the boiler house: **48 %**, the chimney top lands 25 m along x, boiler house 55 % down;
  - away, onto the yard: 33 %, boiler house untouched;
  - front: 33 %, boiler house untouched.
  Aiming is worth +15 points and both bays from the same two bombs: one fall, two buildings. It is rewarded, not required: the blind fair player still wins with 2–4 left.
- **Build:** 107 counted members (chimney 71, boiler house 36). Nothing moves or breaks at rest after 8 s. Hard pieces (two roof tanks) are 16 % of the mass.

## Screenshots
- `shot-open.jpg`: opening frame (the chimney on its legs at the left, the boiler house beside it).
- `shot-blast1-mid.jpg`: 2.5 s after two TNT on the legs facing the house: the chimney leans over the roof.
- `shot-blast1.jpg`: after that blast: the chimney lies across the boiler house, both bays broken; the roof tanks lie in the rubble.

## Fixes made on the way (also in LEARNINGS §5)
1. Twin chimneys, 42 m wide: the legs were small on screen, so a placed charge sprite covered the neighbouring legs and the fair player could not place a second charge. Fix: one chimney and two bays (26 m).
2. Heavy boilers inside the house: the fair player kept bombing walls in front of them and stalled at 47–50 %. Fix: the heavy pieces are roof tanks, in sight.
3. The boiler house was TNT-proof (`hit7.armor: 0` reads as 0.97) and not crushed (the falling chimney was made of the same keys as the `hit7` list). Fix: armor 0.001 and chimney keys of its own (`g7bk`, `g7bkw`).
4. A bomb on the pedestal wall dropped the chimney (49–59 %). Fix: RC-in-brick posts and floors under `drop7` (plumbing).

## Open points for Khai
- Budget 17 TNT, spare 2–4 (the bottom of the Normal band; a person who aims needs fewer).
- The plan's "aim test" is reported, not a pass/fail gate: on an easy level the wrong way costs more TNT but does not lose. Make it a hard gate later if Khai wants.
- The fail line "Open the side it should fall. Tanks still count." is the only text.

## SLOTS-50 (23/11, D-blast-L50 / D-blast-LAUNCH / D-blast-PAD): play slot 9

Converted: RC legs → brick (bk), feed-water tank hard7v → plain, no drop7, lot centred (was lopsided), one blast.

| | |
|---|---|
| Elements before | brick, concrete, dark RC legs, heavy tank, steps, drop7 |
| Elements after (read from the built level) | brick, concrete |
| Bar | Normal before 35: oneBomb < 70 %, fair 3/3, spare >= 2, the expert plan (sol) wins in ONE blast; blasts, time, curve, allFoot / footOnly reported (no heavy piece before 50) |
| TNT | **11** |
| Expert plan (`sol`, one blast) | WIN 93 % (4 TNT) |
| fair, 3 seeds | 3/3 · spare 2/2/2 · blasts 2/2/2 · 27/27/27 s |
| oneBomb / lazy | 66 % / 55 % |
| allFoot / footOnly / oneWave | 63 % / 73 % / 70 % |
| curve (n TNT at the main foot: %) | 1:36 2:41 3:46 4:47 6:41 8:43 12:43 (max jump +5) |
| at rest (8 s) | 0 dead, 0 moved, bonds 441→441 |
| pad (D-blast-PAD) | lot centred on (0, 0), farthest corner 12.7 m (pad 15.55 m today, ~18.7 m widened) |
| verdict | **PASS** · reported: — |

Gate: `gate.mjs` (one Chrome session, test build on main's 31-polish base, `results-slots50.json`, 2026-11-23T20:18 UTC). Shots: `shot-open.jpg`, `shot-blast1-mid.jpg`, `shot-blast1.jpg` (the expert plan / first blast) (393 × 852, test build).
