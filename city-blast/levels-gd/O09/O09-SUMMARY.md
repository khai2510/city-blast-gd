# O09 "Floodlit Stand": result (slot 9, replaces o13, 11 TNT): PASS

| Step | Result | File |
|---|---|---|
| 1. GD spec | lesson, shape, roles, wow, realization | `1-GD-SPEC.md` |
| 2. Figma | skipped (as the easy pack; the Lead handles Figma) | — |
| 3. Builder | g7oFlood, g7oStand in `pipeline7/engine.js` (block g7 OLD POLISH) | `make-level.mjs` → `level.json` |
| 4. Tester | `pipeline7/oldrun.mjs` at the level's budget, `oldlook.mjs` (rest, shots) | `results.json`, `results-look.json` |

## Numbers

| Test | Bar | Result |
|---|---|---|
| oneBomb (best of 18) | < 70 % | 29 % (concrete@A:f0) |
| lazy (4 at the main foot) | — | 29 % |
| expert plan (`sol`, one blast) | wins | WIN 90 % with 5 TNT |
| fair, 3 seeds | 3/3 | WIN · WIN · WIN |
| spare TNT | ≥ 2 | 2 / 2 / 3 |
| blasts | reported | 2 / 2 / 2 |
| estimated time | reported before slot 14 | 23 / 23 / 23 s |
| allFoot / footOnly | reported before slot 17 (OLD-POLISH.md) | 79 % / 96 % |
| oneWave | reported | 96 % |
| curve (n at the main foot: %) | reported | 1: 13 · 2: 17 · 3: 25 · 4: 26 · 6: 26 · 8: 26 · 12: 26 (max jump +8) |
| at rest (8 s) | nothing moves, 0 bonds broken | 0 dead, 0 moved, bonds 280 → 280 |
| members | — | 81 (A 41, B 20, C 20); keys concrete 28, mdC 14, cpan 4, steel 27, mdS 8 |

## Camera record (Lead 22/11: for a per-level preset later)
Front-on opening (yaw 0); the opening frames `L.hero` = A,B,C. Main building (A, g7oStand) at x 0, z 0; building centres span x -9.6…9.6, z -2.4…0 (lot ≈ 26 × 9 m).

## Screenshots
- `shot-open.jpg`: the opening in the main build (393×852, real LV picker).
- `shot-blast1-mid.jpg`, `shot-blast1.jpg`: the expert plan in one blast, 2.5 s in and settled (test build).
- `shot-before.jpg`: the old level on this slot (main today) beside the new one.

