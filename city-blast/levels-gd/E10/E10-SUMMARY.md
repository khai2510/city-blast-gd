# E10 "Rail Terminus": result (Normal, COMBINE, finale, 14 TNT): PASS on the easy-pack bars

| Step | Result | File |
|---|---|---|
| 1. GD spec | lesson, shape, roles, wow, realization | `1-GD-SPEC.md` |
| 2. Figma | Figma-style sheet from the game (opening + the aim probe, 393 × 852) | `E10-sheet.jpg` |
| 3. Builder | `g7term` (head building: an arcade of 8 RC-in-brick legs under the tip rule with a 2 s hinge, corbelled arch heads, a booking hall under it, two brick storeys of `g7bk` posts and `g7bkw` walls, a great arched window, a stepped gable and a lantern turret: the two gables and the turret are heavy `hard7v` pieces that land whole) and `g7shed` (train shed, 2 bays, own bond group each: brick piers, a brick back wall with arched windows, iron decks, a heavy tiled iron-and-glass roof body `g7tile` with a glazed barrel as decor; platforms, track and a train inside as decor) in `pipeline7/engine.js` | `make-level.mjs` → `level.json` |
| 4. Tester | runs r4 and r5 (base: main's `31-polish.html`): PASS every bar, `run.mjs` PASS (oneWave 75–77 %) | `results.json` (run r5) |

Hero position (for a later camera preset): part A (head building) at x −5.75, z 0, 7.2 × 7.2 m, ≈ 15 m to the turret; the shed at x 4.7; the school (keep6) at x 6.2, z −10.15. Lot ≈ 22 × 21 m.

Mechanics (3, all taught before): tip rule, red drums (`tanks` + `hit7.drums`), keep6; plus `hard7` scoring and `drop7` on `mdB` as plumbing. `hit7` (armor 0.001) on the shed's `bk`, `bkw`, `mdW`, `g7tile`: the head building landing on it breaks it, TNT works as usual.

## Numbers (run r5, `tntStart` 14)

| Test | Bar | Result |
|---|---|---|
| oneBomb (best of 18) | < 70 % | 18 % |
| lazy (4 at the head-building foot) | — | 44 % |
| allFoot | < 80 % | 76 % (blue 0) |
| footOnly | < 80 % | 79 % (blue 0) |
| oneWave | reported only | 77 % |
| fair, 3 seeds | 3/3 | WIN × 3 |
| spare TNT | ≥ 2 | 4 / 4 / 4 |
| blasts | ≥ 2 | 3 / 3 / 3 |
| estimated time | 20–75 s | 37 s |
| fair, open probe (40 TNT) | — | 10 used, 3 waves, 91 % |

- **Curve** (n bombs on the head-building foot, one blast; % / collapse): 1: 2/2 · 2: 41/61 · 3: 40/61 · 4: 40/61 · 6: 39/61 · 8: 46/63 · 12: 46/63. Biggest jump **+39** (1 → 2: two legs side by side tip it, the lesson of E02 again; under the 40 bar).
- **Aim probe** (two legs on one face, one blast):
  - towards the shed: **71 %**, the shed flattened (2 of 14 members standing), the drums gone, the blue untouched;
  - away (left): 34 %, the shed untouched;
  - back: 52 %; front: 48 %. The blue is not reached by any single tip at this distance (the plan's "safe distance"); in run r3, 1.5 m closer, a back tip hit it (19 %) and lost.
- **Look checks:** 65 members, nothing moves or breaks at rest in 8 s, 0 bonds cracked; roofs and gables are members, decor inside their outlines; camera sweep 48 poses, **0 inside a building**. Hard pieces (gables, turret) 14 % of the mass.

## Screenshots
- `shot-open.jpg`: opening frame at 393 × 852.
- `shot-blast1-mid.jpg`: two legs on the shed side: the head building leans into the shed.
- `shot-blast1.jpg`: after that blast: the shed under the head building, the gables and turret whole in the heap.
- `E10-sheet.jpg`: opening, lean, landing, and the same two bombs tipped back instead.

## Fixes made on the way
1. Run r1: allFoot 100 %, one wave won: the head building took everything. Fix: heavy gables and turret (`hard7v`, land whole, need their own bombs).
2. Run r2: heavy train coaches inside the shed (`hard7v`) were tapped directly in the first wave (still one-wave wins). Fix: coaches back to decor; the heavy pieces are up high, out of the first wave's reach.
3. Run r3/r4: curve 1 → 2 was +49/+52 (the head building was 76 % of the mass). Fix: a heavier shed (brick back wall, wider piers, tiled roof body): +39.
4. Lot compacted from 35 m to ≈ 22 m (Lead 22/11); the school moved behind the shed's right end so it shows at the opening.

## Open points for Khai
- Budget 14 TNT, machine spare 4.
- The blue is at a safe distance: it teaches "what stays" only through a careless blast or a back tip very close to it. Moving it 1.5 m closer makes the back tip lose (r3); say if E10 should press harder.
- The fail line "Read it first: which legs, which side, what stays." is the only text.
