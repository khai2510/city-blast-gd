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
| oneBomb (best of 18) | < 70 % | 50 % (wwall@A:f1) |
| lazy (4 at the main foot) | — | 51 % |
| expert plan (`sol`, one blast) | wins | WIN 98 % with 4 TNT |
| fair, 3 seeds | 3/3 | WIN · WIN · WIN |
| spare TNT | ≥ 2 | 2 / 2 / 2 |
| blasts | reported | 1 / 1 / 1 |
| estimated time | reported before slot 14 | 17 / 17 / 17 s |
| allFoot / footOnly | reported before slot 17 (OLD-POLISH.md) | 99 % / 97 % |
| oneWave | reported | 99 % |
| curve (n at the main foot: %) | reported | 1: 48 · 2: 48 · 3: 48 · 4: 48 · 6: 51 · 8: 54 · 12: 54 (max jump +3) |
| at rest (8 s) | nothing moves, 0 bonds broken | 0 dead, 0 moved, bonds 437 → 437 |
| members | — | 82 (A 42, S 13, C 27); keys bk 26, mdB 3, wpost 16, mdW 6, wwall 12, g7roofL 3, bkw 16, keep:kwall 12, keep:kwin 13, keep:kroof 1, keep:kplate 3, keep:kcap 1, keep:kroofN 2, keep:kroofW 4 |

## Camera record (Lead 22/11: for a per-level preset later)
Front-on opening (yaw 0); the opening frames `L.hero` = A,S,C. Main building (A, g7oHose) at x 0, z -8; building centres span x -9…9, z -8…4.6 (lot ≈ 25 × 20 m).

## Screenshots
- `shot-open.jpg`: the opening in the main build (393×852, real LV picker).
- `shot-blast1-mid.jpg`, `shot-blast1.jpg`: the expert plan in one blast, 2.5 s in and settled (test build).
- `shot-before.jpg`: the old level on this slot (main today) beside the new one.

