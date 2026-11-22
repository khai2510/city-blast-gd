# O03 "Airfield Tower": result (slot 3, replaces o3, 6 TNT): MISS

| Step | Result | File |
|---|---|---|
| 1. GD spec | lesson, shape, roles, wow, realization | `1-GD-SPEC.md` |
| 2. Figma | skipped (as the easy pack; the Lead handles Figma) | — |
| 3. Builder | g7oBag, g7oTwr, g7oWing in `pipeline7/engine.js` (block g7 OLD POLISH) | `make-level.mjs` → `level.json` |
| 4. Tester | `pipeline7/oldrun.mjs` at the level's budget, `oldlook.mjs` (rest, shots) | `results.json`, `results-look.json` |

## Numbers

| Test | Bar | Result |
|---|---|---|
| oneBomb (best of 18) | < 70 % | 58 % (concrete@A:f1) |
| lazy (4 at the main foot) | — | 51 % |
| expert plan (`sol`, one blast) | wins | WIN 90 % with 4 TNT |
| fair, 3 seeds | 3/3 | LOSE pct · LOSE pct · LOSE pct |
| spare TNT (fair bot) | reported (the bot spends 3 a building a blast) | 0 / 0 / 0 |
| spare TNT (the hand's plan) | ≥ 1 | 2 |
| blasts | reported | 1 / 1 / 1 |
| estimated time | reported before slot 14 | 15 / 14 / 15 s |
| allFoot / footOnly | reported before slot 17 (OLD-POLISH.md) | 98 % / 98 % |
| oneWave | reported | 65 % |
| curve (n at the main foot: %) | reported | 1: 1 · 2: 46 · 3: 47 · 4: 49 · 6: 63 · 8: 52 · 12: 52 (max jump +45) |
| at rest (8 s) | nothing moves, 0 bonds broken | 0 dead, 0 moved, bonds 744 → 744 |
| members | — | 173 (A 82, S 13, B 39, C 39); keys concrete 80, mdC 12, cpan 32, bk 6, mdW 2, bkw 40, g7roofL 1 |

Misses: fair 0/3

## Camera record (Lead 22/11: for a per-level preset later)
Front-on opening (yaw 0); the opening frames `L.hero` = A,S,B,C. Main building (A, g7oTwr) at x 0, z -8; building centres span x -9…9, z -8…2.4 (lot ≈ 25 × 17 m).

## Screenshots
- `shot-open.jpg`: the opening in the main build (393×852, real LV picker).
- `shot-blast1-mid.jpg`, `shot-blast1.jpg`: the expert plan in one blast, 2.5 s in and settled (test build).
- `shot-before.jpg`: the old level on this slot (main today) beside the new one.

