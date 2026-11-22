# O01 "Ranger Lookout": result (slot 1, replaces o1, 5 TNT): PASS

| Step | Result | File |
|---|---|---|
| 1. GD spec | lesson, shape, roles, wow, realization | `1-GD-SPEC.md` |
| 2. Figma | skipped (as the easy pack; the Lead handles Figma) | — |
| 3. Builder | g7oLook, g7oShed in `pipeline7/engine.js` (block g7 OLD POLISH) | `make-level.mjs` → `level.json` |
| 4. Tester | `pipeline7/oldrun.mjs` at the level's budget, `oldlook.mjs` (rest, shots) | `results.json`, `results-look.json` |

## Numbers

| Test | Bar | Result |
|---|---|---|
| oneBomb (best of 18) | reported (slot 1: one double tap wins) | 87 % (wpost@A:f0) |
| lazy (4 at the main foot) | — | 87 % |
| expert plan (`sol`, one blast) | wins | WIN 100 % with 2 TNT |
| expert plan, one TNT a blast (double tap) | wins | WIN 86 %, 1 blasts |
| fair, 3 seeds | 3/3 | WIN · WIN · WIN |
| spare TNT (fair bot) | reported (the bot spends 3 a building a blast) | 0 / 0 / 0 |
| spare TNT (the hand's plan) | ≥ 1 | 3 |
| blasts | reported | 1 / 1 / 1 |
| estimated time | reported before slot 14 | 13 / 13 / 13 s |
| allFoot / footOnly | reported before slot 17 (OLD-POLISH.md) | 100 % / 100 % |
| oneWave | reported | 100 % |
| curve (n at the main foot: %) | reported | 1: 87 · 2: 86 · 3: 84 · 4: 86 · 6: 86 · 8: 86 · 12: 86 (max jump +2) |
| at rest (8 s) | nothing moves, 0 bonds broken | 0 dead, 0 moved, bonds 156 → 156 |
| members | — | 46 (A 35, S 11); keys wpost 30, mdW 8, wwall 6, g7roofL 2 |

## Camera record (Lead 22/11: for a per-level preset later)
Front-on opening (yaw 0); the opening frames `L.hero` = A,S. Main building (A, g7oLook) at x 0, z -8; building centres span x 0…3.6, z -8…2.4 (lot ≈ 11 × 17 m).

## Screenshots
- `shot-open.jpg`: the opening in the main build (393×852, real LV picker).
- `shot-blast1-mid.jpg`, `shot-blast1.jpg`: the expert plan in one blast, 2.5 s in and settled (test build).
- `shot-before.jpg`: the old level on this slot (main today) beside the new one.

## Notes

- **Camera (Lead 22/11):** a normal level opens front-on (`sflay.js` S6). The opening frames every building (`L.hero` = "A,S,B,C").
  Lot ≈ 24 m wide × 14 m deep. Hero (lookout) at x 0, z −8; woodshed at z +2.4; cabins at x ±8.6, z −7. No hard7 (base score).
- **Budget 5 TNT (D-blast-K2, tutorial 4–6, as old L1).** One double tap on the hand's post wins (the tower falls across the
  woodshed): the L1 contract the main build's checks play (PL1–PL3). 4 TNT spare.
- **Runs:** layout A (woodshed 10 m in front): the timber trestle crumbled before it reached the shed (no chain). B (shed adjacent):
  chain, but the shed hid the legs the L1 hand points at. D (taller tower, 4 trestle storeys, shed 4 m in front): chain, legs in view.
  Base `weak-tip` with a 2.5 m/s shove of the deck over the legs (the existing BASE `shove` option) so the tower falls clear forward.
- Runs E–G: two log cabins beside the tower (4 buildings): one double tap 48–64 %, so the L1 one-tap flow broke (check-main polish crashed waiting for the win card). Cabins removed; the shed moved right so the left front leg (the hand's post) is in clear view, ground legs 1.0 m thick so a second tap beside the TNT stacks on the same leg (check T4).
