# O01 "Ranger Lookout": result (slot 1, replaces o1, 5 TNT): PASS

| Step | Result | File |
|---|---|---|
| 1. GD spec | lesson, shape, roles, wow, realization | `1-GD-SPEC.md` |
| 2. Figma | skipped (as the easy pack; the Lead handles Figma) | — |
| 3. Builder | g7oCabin, g7oLook, g7oShed in `pipeline7/engine.js` (block g7 OLD POLISH) | `make-level.mjs` → `level.json` |
| 4. Tester | `pipeline7/oldrun.mjs` at the level's budget, `oldlook.mjs` (rest, shots) | `results.json`, `results-look.json` |

## Numbers

| Test | Bar | Result |
|---|---|---|
| oneBomb (best of 18) | < 70 % | 63 % (wwall@C:f1) |
| lazy (4 at the main foot) | — | 79 % |
| expert plan (`sol`, one blast) | wins | WIN 96 % with 3 TNT |
| expert plan, one TNT a blast (double tap) | wins | WIN 87 %, 3 blasts |
| fair, 3 seeds | 3/3 | WIN · WIN · WIN |
| spare TNT (fair bot) | reported (the bot spends 3 a building a blast) | 0 / 0 / 0 |
| spare TNT (the hand's plan) | ≥ 1 | 2 |
| blasts | reported | 1 / 1 / 1 |
| estimated time | reported before slot 14 | 14 / 14 / 14 s |
| allFoot / footOnly | reported before slot 17 (OLD-POLISH.md) | 100 % / 100 % |
| oneWave | reported | 69 % |
| curve (n at the main foot: %) | reported | 1: 48 · 2: 50 · 3: 52 · 4: 53 · 6: 53 · 8: 53 · 12: 53 (max jump +2) |
| at rest (8 s) | nothing moves, 0 bonds broken | 0 dead, 0 moved, bonds 383 → 383 |
| members | — | 103 (A 35, S 14, B 27, C 27); keys wpost 56, mdW 12, wwall 31, g7roofL 4 |

## Camera record (Lead 22/11: for a per-level preset later)
Front-on opening (yaw 0); the opening frames `L.hero` = A,S,B,C. Main building (A, g7oLook) at x 0, z -8; building centres span x -8.6…8.6, z -8…2.4 (lot ≈ 24 × 17 m).

## Screenshots
- `shot-open.jpg`: the opening in the main build (393×852, real LV picker).
- `shot-blast1-mid.jpg`, `shot-blast1.jpg`: the expert plan in one blast, 2.5 s in and settled (test build).
- `shot-before.jpg`: the old level on this slot (main today) beside the new one.

## Notes

- **Camera (Lead 22/11):** a normal level opens front-on (`sflay.js` S6). The opening frames every building (`L.hero` = "A,S,B,C").
  Lot ≈ 24 m wide × 14 m deep. Hero (lookout) at x 0, z −8; woodshed at z +2.4; cabins at x ±8.6, z −7. No hard7 (base score).
- **Budget 5 TNT (D-blast-K2, tutorial 4–6, as old L1).** The hand's plan is one double tap a building: tower (falls across the
  woodshed), left cabin, right cabin = 3 TNT, 2 spare. The fair bot (3 TNT a building a blast) also wins 3/3 at 5 (the falling tower
  takes the shed and knocks the cabins); it spends the whole budget in its one blast, so its "spare" reads 0.
- **Runs:** layout A (woodshed 10 m in front): the timber trestle crumbled before it reached the shed (no chain). B (shed adjacent):
  chain, but the shed hid the legs the L1 hand points at. D (taller tower, 4 trestle storeys, shed 4 m in front): chain, legs in view.
  Base `weak-tip` with a 2.5 m/s shove of the deck over the legs (the existing BASE `shove` option) so the tower falls clear forward.
- One bomb on a cabin's inner post tips the cabin into the tower legs: 63 % (bar 70 %). It is the same chain a player can find.
