# E03 "Tram Depot": step 1, GD spec (easy pack, Normal, FEEL)

**Slot 4 in the plan. Role: FEEL** (a big collapse and a chain wow, little thinking).
**Lesson (one line): red drums blast for free.** E01 showed the drums going off by themselves; here the player sets them off on purpose. One TNT next to the drums does the work of a dozen.

**Inspiration:** the brick tram depots of the early electric-tram era: a row of gabled sheds with tall arched doors, rails running in, a signal cabin at the yard throat. Inspiration only: our own three-shed plan, our own sizes and colours, no real depot. It does not duplicate any F-landmark, L01–L05/H1–H5 or E01 (no tower, no slab, no townhouse row).

## Shape (x: left → right; z+: towards the camera)

| Building | Position | Size | Structure | Role |
|---|---|---|---|---|
| **Depot** (A) | x 0 | 23 × 14 m, piers 8.5 m + roof ≈ 14 m; 3 sheds | **3 brick sheds** side by side, each its own block (bg 61–63: they lean on each other, never glued). A shed stands on **8 brick piers** (`bk`, 1 TNT) under the tip rule; open front with two arched tram doors (stepped arch heads, fanlights, cream keystones), brick side and back walls with arched windows, a light timber roof body (`g7roofD`: it breaks when it lands) with slate slopes, a brick front gable with a round window and a glazed clerestory | main, the chain |
| Heavy roof pieces | one per shed | outer sheds: riveted water tank 3.9 × 3.75 × 3.9 m; middle shed: cast-iron vent lantern 3.6 × 2.85 × 5.4 m (about 37 % of the mass) | `hard7v`: land whole, count until a bomb cracks them | the second (easy) wave |
| Trams | one per track, inside the sheds | 2.2 × 3.6 × 8 m | decor on the yard (no body, no score) | the scene: what a depot is for |
| **Red drums** | a row along the depot front, 11 drums, one every 2.1 m, 0.55 m in front of the front piers | | `tanks`; each drum's blast reaches the next drum (≤ 3 m) and the brick pier behind it | **the gift / the chain** |
| **Signal cabins** (B, C) | x ±15.8, same size, same 2 m gap, fronts in line | 4.6 × 6 m; 2 brick storeys + glazed timber operating room + slate roof ≈ 13 m | brick piers and walls, timber posts and glass, a walkway, a signal mast (decor) | easy end job, out of the drums' reach (a second read) |

## Realization moment (no text, no arrows)
1. A bomb on a cabin or a side wall breaks a pier or two: a small step.
2. A bomb next to a drum: the drum goes off, then the next, and the next, all the way along the front. Every front pier is gone and the sheds tip forward one after another. "The red barrels did that, not my bomb."

## Wow (chain)
One TNT on any front pier (or any drum): 11 drums go off in a running row and three sheds fold forward over the yard. One bomb, fourteen events.

## Why it is still a level (not a one-tap win)
- The heavy roof pieces land whole and still count (as E01): one more bomb each, in the rubble.
- The two signal cabins stand outside the drum row: a separate small job.
- So one bomb gives a big collapse but stays under 70 %; the second wave finishes it.

## Tester targets (Normal, easy pack)
| Test | Bar |
|---|---|
| oneBomb | < 70 % (FEEL may be generous, but never a one-bomb win) |
| allFoot / footOnly | < 80 % |
| oneWave | reported only |
| fair | 3/3 wins, spare ≥ 2, ≥ 2 blasts, 20–75 s |
| curve | no jump > 40 points between consecutive bomb counts |
| at rest | nothing moves or dies in 8 s |

Fail line (≤ 9 words, a principle): **"Red drums blast for free. Heavy pieces still count."** No opening tip.
