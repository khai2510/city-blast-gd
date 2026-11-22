# E06 "Boiler Stack": step 1, GD spec (easy pack, Normal, COMBINE)

**Slot 7 in the plan. Role: COMBINE** (two learned lessons together).
**Lesson (one line): aim the chimney's fall onto the boiler house.** E01: hit the legs. E02: two legs side by side tip it that way. Here both at once, with a reason to aim: a chimney opened on the side facing the boiler house lies down along its roof, so one fall wrecks two buildings.

**Inspiration:** a small steam power house: a brick boiler house with tall arched windows, roof lanterns and feed-water tanks, and a square brick chimney on an arched base at its end. Inspiration only: our own plan, sizes and colours, no real works. It does not duplicate any F-landmark, H1–H5 or E01. Next to E02 it reverses the layout: E02 has one tower between two targets; E06 has one target beside one tower and an empty yard on the far side.

## Shape (x: left → right; z+: towards the camera)

| Building | Position | Size | Structure | Role |
|---|---|---|---|---|
| **Chimney** (A) | x −12.15 | base 5.8 m square on 4.6 m legs, pedestal storey 3 m, tapering square shaft 5 × 3.1 m, corbelled crown ≈ 24 m | **8 legs** (RC clad in brick, 1 TNT each, tip rule with a 2 s hinge); pedestal and shaft posts are RC clad in brick (`g7bk`), brick walls (`g7bkw`), iron bands, a sooty lip, a puff of smoke (decor). Floors under `drop7` (plumbing): a bomb on the shaft takes a wall, never the chimney | main: the thing you aim |
| **Boiler house** (B) | x 0, 2 m from the chimney base | 14.5 × 12 m, 7 m hall + roof ≈ 12 m | **2 brick bays**, each its own block (bg 52–53); brick piers and walls with tall arched windows, slate roof bodies with glazed louvre lanterns; boilers with glowing fire doors inside (decor); **a riveted feed-water tank on each roof** (`hard7v`: lands whole, still counts) | **target**: the chimney laid along its roof brings both bays down |
| Yard | on the far side of the chimney | open cobbles | | where a chimney tipped the wrong way lands |

`hit7` (armor 0.001) on the boiler house's brick, floors and roofs: a heavy body of the chimney landing on them breaks them. TNT still works on them as usual.

## Realization moment (no text, no arrows)
1. Two front legs (the habit from E02's first try): the chimney falls towards the camera onto the yard; the boiler house is untouched.
2. Two legs on the side facing the boiler house: the chimney swings down across its roof and both bays fold under it. "Aim it at the building, not the yard."

## Wow (chain)
Two bombs on the right legs: 24 m of brick chimney comes down along the roof, the lanterns shatter, the bays fold, and the roof tanks tumble into the street. Two bombs, two buildings.

## Tester targets (Normal, easy pack)
| Test | Bar |
|---|---|
| oneBomb | < 70 % |
| allFoot / footOnly | < 80 % |
| oneWave | reported only |
| fair | 3/3 wins, spare ≥ 2, ≥ 2 blasts, 20–75 s (blind player: no aiming) |
| aim probe | two legs on each face (towards the house, away, front): the % after that one blast is reported |
| curve | no jump > 40 points between consecutive bomb counts |
| at rest | nothing moves or dies in 8 s |

Fail line (≤ 9 words, a principle): **"Open the side it should fall. Tanks still count."** No opening tip.
