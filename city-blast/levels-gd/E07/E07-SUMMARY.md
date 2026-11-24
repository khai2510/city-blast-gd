# E07 "Bathhouse": result (Normal, TEACH, 18 TNT): PASS on the easy-pack bars (curve at the limit: +40)

| Step | Result | File |
|---|---|---|
| 1. GD spec | lesson, shape, roles, wow, realization | `1-GD-SPEC.md` |
| 2. Figma | Figma-style sheet from the game (opening + the lesson, 393 × 852) | `E07-sheet.jpg` |
| 3. Builder | `g7bath` (stucco bath hall on 8 brick piers under the tip rule with a 1.6 s hinge, tall glass thermal windows with lunettes on all four faces, a pool, benches and steam inside; an attic storey with pediments and a heavy floor (`hard7t`); one heavy shallow copper dome (`hard7t`) with ribs and a glazed lantern) and `g7colo` (colonnade wing: brick columns clad as marble, a back screen, booths and a fountain, a heavy tiled roof `hard7t`) in `pipeline7/engine.js` | `make-level.mjs` → `level.json` |
| 4. Tester | run r7 (base: main's `31-polish.html`): PASS every bar; `run.mjs` prints FAIL only for oneWave (100 %), which is reported only on easy levels | `results.json` (run r7) |

Hero position (for a later camera preset): part A (bath hall) at x 0, z 0, 10 × 10 m, ≈ 13 m to the lantern; wings at x ± 8.6; the school (keep6) at x 7.0, z −7.9 (behind the hall's right corner and the right wing, 1.25 m behind the hall's back line). Lot ≈ 21 × 21 m.

## Numbers (run r7, `tntStart` 18)

| Test | Bar | Result |
|---|---|---|
| oneBomb (best of 18) | < 70 % | 10 % |
| lazy (4 at the hall foot) | — | 42 % |
| allFoot | < 80 % (or blue > 5 %) | 76 % (blue 11 %: loses) |
| footOnly | < 80 % (or blue > 5 %) | 51 % (blue 11 %: loses) |
| oneWave | reported only | 100 % |
| fair, 3 seeds (blind) | 3/3, blue ≤ 5 % | WIN × 3, blue 0 |
| spare TNT | ≥ 2 | 2 / 4 / 4 |
| blasts | ≥ 2 | 5 / 4 / 4 |
| estimated time | 20–75 s | 51 / 45 / 45 s |
| fair, open probe (40 TNT) | — | 17 used, 4 waves, 96 % |

- **Curve** (n bombs on the hall foot, one blast; % / collapse): 1: 4/4 · 2: 44/84 · 3: 49/86 · 4: 50/86 · 6: 50/86 · 8: 56/94 · 12: 57/87. Biggest jump **+40** (1 → 2: two piers side by side tip the hall). That is exactly the bar ("no jump of **more than** 40"); it passes at the limit.
- **Lesson probe** (two piers side by side, one blast each, fresh level):
  - front pair (away from the blue): the hall leans forward and the dome drops in place: 48 %, **blue 0 %**;
  - back pair (towards the blue): **blue 26 %: lost** ("HIT A BLUE BUILDING!");
  - right pair: 40 %, blue 4 % (just inside the 5 % limit);
  - all 8 piers at once: 57 %, blue 0 % (it drops straight). The careless plays that lose are the big foot plays: allFoot and footOnly both reach the blue (11 %).
- **Look checks:** 63 members, nothing moves or breaks at rest in 8 s, 0 bonds cracked; roofs and dome are members, decor inside their outlines; camera sweep 48 poses, **0 inside a building**. Hard pieces (dome, attic floor, wing roofs) 36 % of the mass.

## Screenshots
- `shot-open.jpg`: opening frame at 393 × 852 (the school shows behind the right wing).
- `shot-blast1-mid.jpg`: two front piers: the hall leans away from the school.
- `shot-blast1.jpg`: after that blast: the dome lies whole in the hall, the school untouched.
- `E07-sheet.jpg`: opening, lean, landing, the back tip that loses, the big blast.

## Fixes made on the way
1. Run r1: two bombs dropped the whole lot (lazy 76 %, one-wave wins). Fix: heavy dome, then heavy attic floor and wing roofs (land whole, need their own bombs).
2. Runs r1–r3: the school was never reached (too far). Moved in steps to 1.25 m behind the hall's back line: a back tip now loses, a front tip is safe.
3. Run r2: the fair player stalled (dome in 5 pieces buried in the heap). Fix: one dome piece, it lands on top of the heap.
4. Runs r4–r6: curve 1 → 2 +47/+50/+43 (the hall was most of the mass). Fix: glass thermal windows on all four faces (lighter hall), heavier wings: +40.
5. Lot compacted from 38 m to ≈ 21 m (Lead 22/11).

## Open points for Khai
- The curve passes at the limit (+40). One more step down would need a lighter hall or heavier wings again.
- The plan's "a big blast throws debris towards the blue" shows as the big foot plays (allFoot / footOnly) hurting the school; eight bombs on the piers alone drop the hall straight down.
- oneWave 100 % (reported only, as on every easy level).
- Fail line (ours): "Small blasts drop it in place. Keep blue clear." The game's own blue-hit card says "Hit the side away from it." (base game text).

## SLOTS-50 (23/11, D-blast-L50 / D-blast-LAUNCH / D-blast-PAD): play slot 21

Converted: dome hard7t → plain g7roofD (breaks up on landing), attic → mdB, wing roofs → g7roofL, no drop7, lot centred, one blast.

| | |
|---|---|
| Elements before | wood, brick, glass, heavy dome/attic/roofs, blue, steps, drop7 |
| Elements after (read from the built level) | wood, brick, glass, blue |
| Bar | Normal before 35: oneBomb < 70 %, fair 3/3, spare >= 2, the expert plan (sol) wins in ONE blast; blasts, time, curve, allFoot / footOnly reported (no heavy piece before 50) |
| TNT | **14** |
| Expert plan (`sol`, one blast) | WIN 89 % (11 TNT) |
| fair, 3 seeds | 3/3 · spare 3/3/3 · blasts 2/3/2 · 26/33/26 s |
| oneBomb / lazy | 22 % / 70 % |
| allFoot / footOnly / oneWave | 88 % / 92 % / 99 % |
| curve (n TNT at the main foot: %) | 1:5 2:65 3:66 4:67 6:56 8:74 12:84 (max jump +60) |
| at rest (8 s) | 0 dead, 0 moved, bonds 345→345 |
| pad (D-blast-PAD) | lot centred on (0, 0), farthest corner 12.5 m (pad 15.55 m today, ~18.7 m widened) |
| verdict | **PASS** · reported: curve jump +60 |

Gate: `gate.mjs` (one Chrome session, test build on main's 31-polish base, `results-slots50.json`, 2026-11-23T21:44 UTC). Shots: `shot-open.jpg`, `shot-blast1-mid.jpg`, `shot-blast1.jpg` (the expert plan / first blast) (393 × 852, test build).
