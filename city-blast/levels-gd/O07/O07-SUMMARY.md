# O07 "Pit Head": result (slot 7, replaces o9, 8 TNT): PASS

| Step | Result | File |
|---|---|---|
| 1. GD spec | lesson, shape, roles, wow, realization | `1-GD-SPEC.md` |
| 2. Figma | skipped (as the easy pack; the Lead handles Figma) | — |
| 3. Builder | g7oHead, g7oLamp, g7oWind in `pipeline7/engine.js` (block g7 OLD POLISH) | `make-level.mjs` → `level.json` |
| 4. Tester | `pipeline7/oldrun.mjs` at the level's budget, `oldlook.mjs` (rest, shots) | `results.json`, `results-look.json` |

## Numbers

| Test | Bar | Result |
|---|---|---|
| oneBomb (best of 18) | < 70 % | 57 % (concrete@A:f0) |
| lazy (4 at the main foot) | — | 34 % |
| expert plan (`sol`, one blast) | wins | WIN 98 % with 5 TNT |
| fair, 3 seeds | 3/3 | WIN · WIN · WIN |
| spare TNT | ≥ 2 | 2 / 3 / 3 |
| blasts | reported | 2 / 2 / 2 |
| estimated time | reported before slot 14 | 22 / 22 / 21 s |
| allFoot / footOnly | reported before slot 17 (OLD-POLISH.md) | 96 % / 96 % |
| oneWave | reported | 98 % |
| curve (n at the main foot: %) | reported | 1: 57 · 2: 51 · 3: 50 · 4: 48 · 6: 58 · 8: 58 · 12: 58 (max jump +10) |
| at rest (8 s) | nothing moves, 0 bonds broken | 0 dead, 0 moved, bonds 481 → 481 |
| members | — | 116 (A 17, S 19, B 40, C 40); keys concrete 6, mdC 1, steel 8, mdS 2, bk 32, mdB 6, bkw 32, g7roofL 3, wpost 12, mdW 2, wwall 12 |

## Camera record (Lead 22/11: for a per-level preset later)
Front-on opening (yaw 0); the opening frames `L.hero` = A,S,B,C. Main building (A, g7oHead) at x 0, z 0; building centres span x -9…9, z -6.8…0 (lot ≈ 25 × 14 m).

## Screenshots
- `shot-open.jpg`: the opening in the main build (393×852, real LV picker).
- `shot-blast1-mid.jpg`, `shot-blast1.jpg`: the expert plan in one blast, 2.5 s in and settled (test build).
- `shot-before.jpg`: the old level on this slot (main today) beside the new one.

