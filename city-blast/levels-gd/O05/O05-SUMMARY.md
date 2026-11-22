# O05 "Valley Station": result (slot 5, replaces o6, 13 TNT): PASS

| Step | Result | File |
|---|---|---|
| 1. GD spec | lesson, shape, roles, wow, realization | `1-GD-SPEC.md` |
| 2. Figma | skipped (as the easy pack; the Lead handles Figma) | — |
| 3. Builder | g7oCabin, g7oCable, g7oTicket in `pipeline7/engine.js` (block g7 OLD POLISH) | `make-level.mjs` → `level.json` |
| 4. Tester | `pipeline7/oldrun.mjs` at the level's budget, `oldlook.mjs` (rest, shots) | `results.json`, `results-look.json` |

## Numbers

| Test | Bar | Result |
|---|---|---|
| oneBomb (best of 18) | < 70 % | 58 % (concrete@A:f1) |
| lazy (4 at the main foot) | — | 57 % |
| expert plan (`sol`, one blast) | wins | WIN 96 % with 4 TNT |
| fair, 3 seeds | 3/3 | WIN · WIN · WIN |
| spare TNT | ≥ 2 | 2 / 2 / 2 |
| blasts | reported | 1 / 1 / 1 |
| estimated time | reported before slot 14 | 19 / 20 / 20 s |
| allFoot / footOnly | reported before slot 17 (OLD-POLISH.md) | 100 % / 97 % |
| oneWave | reported | 100 % |
| curve (n at the main foot: %) | reported | 1: 2 · 2: 54 · 3: 60 · 4: 63 · 6: 69 · 8: 68 · 12: 68 (max jump +52) |
| fall through face z- (right) | wins | WIN 89 % (first blast 54 %, blue 0 %) |
| fall through face x+ (right) | wins | WIN 99 % (first blast 60 %, blue 0 %) |
| fall through face x- (right) | wins | WIN 100 % (first blast 58 %, blue 0 %) |
| fall through face z+ (wrong) | does not win | LOSE collateral 57 % (first blast 53 %, blue 8 %) |
| at rest (8 s) | nothing moves, 0 bonds broken | 0 dead, 0 moved, bonds 649 → 649 |
| members | — | 146 (A 57, S 35, B 27, C 27); keys concrete 24, mdC 3, cpan 16, wpost 46, mdW 7, wwall 46, g7roofL 4, keep:kwall 4, keep:kwin 5, keep:kroof 1, keep:kplate 1, keep:kcap 1, keep:kroofN 1 |

## Camera record (Lead 22/11: for a per-level preset later)
Front-on opening (yaw 0); the opening frames `L.hero` = A,S,B,C. Main building (A, g7oCable) at x 0, z -3; building centres span x -9…9, z -15.5…6.5 (lot ≈ 25 × 29 m).

## Screenshots
- `shot-open.jpg`: the opening in the main build (393×852, real LV picker).
- `shot-blast1-mid.jpg`, `shot-blast1.jpg`: the expert plan in one blast, 2.5 s in and settled (test build).
- `shot-before.jpg`: the old level on this slot (main today) beside the new one.

