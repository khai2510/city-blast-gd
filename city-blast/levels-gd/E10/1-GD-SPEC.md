# E10 "Rail Terminus": step 1, GD spec (easy pack finale, Normal, COMBINE)

**Slot 10 in the plan. Role: COMBINE** (put it together).
**Lesson (one line): read before blasting: which legs, which side, what to keep.** Three things already taught, together: legs and tip direction (E01, E02, E06), red drums (E03), a protected building (E07). Nothing new.

**Inspiration:** a city rail terminus: a brick head building over an arcaded booking hall with a great arched window and a stepped gable, and behind it an iron-and-glass train shed with a waiting train. Inspiration only: our own plan, sizes and colours, no real works, no clock (the F-list has a clock tower). No duplicate of H1–H5 or E01–E09.

## Shape (x: left → right; z+: towards the camera)

| Building | Position | Size | Structure | Role |
|---|---|---|---|---|
| **Head building** (A) | x −10.6 | 8.4 × 8 m, arcade 5 m + 2 storeys × 3.6 m + gable ≈ 15 m | **8 legs** (RC clad in brick, one TNT each), tip rule with a 2 s hinge; upper storeys RC-in-brick posts (`g7bk`) and brick walls (`g7bkw`): a bomb on the upper face takes a wall, never the storey; floors `mdB` (`drop7` plumbing); great arched window, stepped gable, lantern turret | main: tip it into the shed |
| **Train shed** (B) | x 5.4, 2.4 m gap | 4 bays × 4.6 m = 18.7 m, 11 m deep, 6 m piers + glass barrel roof | each bay its own bond group: 4 brick piers (`bk`), iron decks (`mdW`), a glazed roof body (`g7roofD`, breaks up when it lands); `hit7` (armor 0.001): crushed by the head building, TNT still works; platforms and a train inside (decor) | **target** |
| **Red drums** | one at each pier line of the shed front (5) | | `tanks`; `hit7.drums`: a drum crushed by a falling building goes off | **gift** |
| **School** (blue, keep6) | behind the head building (z −14) | 2 floors | protected | **keep**: a head building tipped back reaches it |

## Mechanics (all existing, ≤ 3 combined, all taught)
tip rule, drums (`tanks`, `hit7.drums`), `keep6`; `hard7` scoring, `drop7` on `mdB` as plumbing.

## Realization moment (no text, no arrows)
Before the first tap the player reads three things: legs (the arcade), the side (the shed on the right, the school behind), the drums (at the shed's piers). Tipped back, the head building lands on the school; tipped right, it does three jobs at once.

## Wow (chain)
Two bombs on the right legs: the head building leans into the shed, the first bay folds, the drums go off along the front, and the glass roof comes down bay by bay to the far end.

## Tester targets (Normal, easy pack)
| Test | Bar |
|---|---|
| oneBomb | < 70 % |
| allFoot / footOnly | < 80 % (or the blue hit > 5 %) |
| oneWave | reported only |
| fair (blind) | 3/3 wins, spare ≥ 2, ≥ 2 blasts, 20–75 s, blue ≤ 5 % |
| aim probe | two legs on each face (towards the shed, away, back, front): % and blue damage after that blast |
| curve | no jump > 40 points between consecutive bomb counts |
| at rest | nothing moves or dies in 8 s; 0 bonds cracked |

Fail line (≤ 9 words, a principle): **"Read it first: which legs, which side, what stays."** No opening tip.

## As built (after tuning)
Positions, sizes and keys above are the first design. Tuning (Lead 22/11: lots ≤ ≈ 24 m; bar fixes) moved the layout and added heavy pieces; the built values, hero position and the reasons are in `E10-SUMMARY.md` ("Fixes made on the way").
