# O04 "Fire Station": result (slot 4, replaces o36, 11 TNT): PASS

| Step | Result | File |
|---|---|---|
| 1. GD spec | lesson, shape, roles, wow, realization | `1-GD-SPEC.md` |
| 2. Figma | skipped (as the easy pack; the Lead handles Figma) | — |
| 3. Builder | g7oCott, g7oEng, g7oHose in `pipeline7/engine.js` (block g7 OLD POLISH) | `make-level.mjs` → `level.json` |
| 4. Tester | `pipeline7/oldrun.mjs` at the level's budget, `oldlook.mjs` (rest, shots) | `results.json`, `results-look.json` |

## Numbers

| Test | Bar | Result |
|---|---|---|
| oneBomb (best of 18) | < 70 % | 50 % (wpost@A:f1) |
| lazy (4 at the main foot) | — | 47 % |
| expert plan (`sol`, one blast) | wins | WIN 99 % with 4 TNT |
| fair, 3 seeds | 3/3 | WIN · WIN · WIN |
| spare TNT | ≥ 2 | 2 / 2 / 2 |
| blasts | reported | 1 / 1 / 1 |
| estimated time | reported before slot 14 | 18 / 17 / 17 s |
| allFoot / footOnly | reported before slot 17 (OLD-POLISH.md) | 94 % / 86 % |
| oneWave | reported | 100 % |
| curve (n at the main foot: %) | reported | 1: 46 · 2: 43 · 3: 45 · 4: 44 · 6: 50 · 8: 65 · 12: 65 (max jump +15) |
| at rest (8 s) | nothing moves, 0 bonds broken | 0 dead, 0 moved, bonds 475 → 475 |
| members | — | 90 (A 42, S 21, C 27); keys bk 30, mdB 3, wpost 16, mdW 8, wwall 12, g7roofL 3, bkw 18, keep:kwall 12, keep:kwin 13, keep:kroof 1, keep:kplate 3, keep:kcap 1, keep:kroofN 2, keep:kroofW 4 |

## Camera record (Lead 22/11: for a per-level preset later)
Front-on opening (yaw 0); the opening frames `L.hero` = A,S,C. Main building (A, g7oHose) at x 0, z -8; building centres span x -8.6…8.6, z -8…7 (lot ≈ 24 × 22 m).

## Screenshots
- `shot-open.jpg`: the opening in the main build (393×852, real LV picker).
- `shot-blast1-mid.jpg`, `shot-blast1.jpg`: the expert plan in one blast, 2.5 s in and settled (test build).
- `shot-before.jpg`: the old level on this slot (main today) beside the new one.

