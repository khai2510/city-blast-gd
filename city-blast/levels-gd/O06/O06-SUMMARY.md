# O06 "Harbour Crane": result (slot 6, replaces o8, 13 TNT): PASS

| Step | Result | File |
|---|---|---|
| 1. GD spec | lesson, shape, roles, wow, realization | `1-GD-SPEC.md` |
| 2. Figma | skipped (as the easy pack; the Lead handles Figma) | — |
| 3. Builder | g7oCrane, g7oShip, g7oWhse in `pipeline7/engine.js` (block g7 OLD POLISH) | `make-level.mjs` → `level.json` |
| 4. Tester | `pipeline7/oldrun.mjs` at the level's budget, `oldlook.mjs` (rest, shots) | `results.json`, `results-look.json` |

## Numbers

| Test | Bar | Result |
|---|---|---|
| oneBomb (best of 18) | < 70 % | 24 % (concrete@A:f0) |
| lazy (4 at the main foot) | — | 32 % |
| expert plan (`sol`, one blast) | wins | WIN 85 % with 4 TNT |
| fair, 3 seeds | 3/3 | WIN · WIN · WIN |
| spare TNT | ≥ 2 | 2 / 2 / 2 |
| blasts | reported | 1 / 1 / 1 |
| estimated time | reported before slot 14 | 20 / 20 / 20 s |
| allFoot / footOnly | reported before slot 17 (OLD-POLISH.md) | 92 % / 89 % |
| oneWave | reported | 96 % |
| curve (n at the main foot: %) | reported | 1: 24 · 2: 24 · 3: 34 · 4: 30 · 6: 30 · 8: 30 · 12: 30 (max jump +10) |
| at rest (8 s) | nothing moves, 0 bonds broken | 0 dead, 0 moved, bonds 492 → 492 |
| members | — | 120 (A 21, S 19, B 40, C 40); keys concrete 4, mdC 2, steel 4, mdS 2, wpost 12, mdW 4, wwall 12, bk 36, mdB 6, bkw 36, g7roofL 2 |

## Camera record (Lead 22/11: for a per-level preset later)
Front-on opening (yaw 0); the opening frames `L.hero` = A,S,B,C. Main building (A, g7oCrane) at x 0, z -6; building centres span x -9…9, z -6…4.6 (lot ≈ 25 × 18 m).

## Screenshots
- `shot-open.jpg`: the opening in the main build (393×852, real LV picker).
- `shot-blast1-mid.jpg`, `shot-blast1.jpg`: the expert plan in one blast, 2.5 s in and settled (test build).
- `shot-before.jpg`: the old level on this slot (main today) beside the new one.

