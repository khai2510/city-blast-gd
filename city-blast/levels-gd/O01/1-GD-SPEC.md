# O01 "Ranger Lookout": step 1, GD spec (old polish, play slot 1, tutorial)

**Replaces:** old L1 "Old Whirly" (F27 windmill and a timber barn), slot 1 of ORDER22. Same slot, same save entry, same seed.
**Intro role (kept):** the first level of the game. It introduces **wood**, **TNT** and the **double tap** with the L1 hand only
(main/tap2.js H1: the hand double-taps `sol[0]`; no words, no BLAST button on L1). Nothing else is new: wood only.
**Lesson (one line): a post holds a building up.** Hit a post and what stands on it comes down.

**Inspiration:** the timber fire-lookout towers of forest parks: a braced timber trestle on four legs, a cab with a window band and
a catwalk on top, a ranger's log cabin at its foot, a woodshed. Inspiration only: our own sizes, colours and details, no real
tower. It does not repeat an F-landmark (no windmill, lighthouse, clock tower…), L01–L05, E01–E10 (no tower on legs of brick,
no slab on stilts).

## Shape (x: left → right; z+: towards the camera; front-on opening, as every normal level in main)

| Building | Position | Size | Structure | Role |
|---|---|---|---|---|
| **Lookout** (A) | x 0, z −8 | legs 5.6 × 5.6 m, 22 m to the rod | 4 timber legs (`wpost` 1.0 m thick, 5.2 m) on stone footings, 4 open trestle storeys (4 posts, plank deck `mdW`) tapering 2.8 → 2.2 m half width, X-braces and a zig-zag stair (decor); a timber cab (`wwall`, window band, fire-finder table, lamp), a catwalk and white rail (decor), a pyramid shingle roof body (`g7roofL`) with a lightning rod and vane, a flag | main: one post and it falls forward (base `weak-tip`) |
| **Woodshed** (S) | x +3.6, z +2.4, in front, to the right of the left leg the hand points at | 6 × 4 m, ≈ 4 m | 4 × 2 posts, a log back wall, a plank deck, a light gabled roof body; log stacks under it, a saw-horse, a chopping block | the landing: the tower falls across it (the chain) |
| (Log cabins `g7oCabin`) | built, used on slot 5 | | | not on slot 1: see below |

Lot ≈ 12 × 18 m: the tower on the axis, the shed in front of it, offset right.

## Realization (no text, no arrows)
The hand double-taps a front leg: the leg goes and the whole 22 m tower leans and falls. "One post held all that up." It lands across the woodshed.

## Wow (chain)
The tower comes down forward across the woodshed: the shed roof folds, the log stacks spill, the cab bursts on the gravel.
One double tap, the level.

## Why two buildings (tutorial contract)
The main build's checks (check-main polish PL1–PL3) play slot 1 as the old L1 played: ONE double tap on the hand's post wins (the win payoff, the coin pill). So the tower's fall must reach 85 % by itself: two buildings, the tower and its woodshed (old L1: the mill and a barn). With two log cabins beside it (built first, 4 buildings) one double tap gave ~50 %, the L1 flow never reached the win card and the check timed out. oneBomb is therefore high here (87 %), as on the old L1; the bar is kept from slot 4 on.

## Tester targets (tutorial tier: easier, fewer TNT)
| Test | Bar |
|---|---|
| oneBomb | reported (slot 1 is won by one double tap: the tutorial contract) |
| fair | 3/3 wins, spare ≥ 1 |
| expert plan (`sol`, one TNT a building) | wins in the g7 main build |
| TNT | 5 (old L1: 5) |
| at rest | nothing moves or dies in 8 s, 0 bonds broken |
| allFoot / footOnly / oneWave | reported only (the lesson *is* "hit the foot") |

Fail line (≤ 9 words, a principle): **"A post holds a building up. Hit the posts."** No opening tip (L1 teaches with the hand only).
