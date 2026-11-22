# E08 "Grain Elevator": step 1, GD spec (easy pack, Normal, TEACH)

**Slot 8 in the plan. Role: TEACH** (patience).
**Lesson (one line): reinforced corners need repeated hits.** The first easy level with the L32 reinforced-concrete tier (`hrc`): one TNT chips a corner pier, two show the rebar, three break it, and the cracks stay from blast to blast.

**Inspiration:** a concrete country grain elevator: a tall board-marked head house over a truck drive-through, a cupola with a band of windows, a row of round silos joined by a covered conveyor gallery, a little weigh house with its weighbridge. Inspiration only: our own plan, sizes and colours, no real works. No duplicate of an F-landmark, H1–H5 or E01–E07.

## Shape (x: left → right; z+: towards the camera)

| Building | Position | Size | Structure | Role |
|---|---|---|---|---|
| **Head house** (A) | x −4.3 | 7.2 × 7.2 m, drive-through 5.4 m + 5 storeys × 3.2 m + cupola 3 m ≈ 27 m with the roof | ground storey on **8 piers: 4 corners `hrc`** (RC tier, damage stays, `rcDecor` crack stages), **4 middles `rc`** (one TNT); tip rule with a 2 s hinge; a back wall (`cpan`); a grain truck under it (decor). Shaft: RC posts (`rc`), panel walls (`cpan`) with small windows and pilasters; floors `mdC` (`drop7` plumbing). Cupola with a light slate roof body (`g7roofL`), a dust vent and a spout towards the silos | main: two piers side by side tip it, and every pair holds a corner |
| **Silo row** (B) | x 8.8, 2.5 m gap | 4 silos Ø 3.3 m, 3 drums × 4.2 m = 12.6 m + cones + gallery | each silo a stack of 3 soft concrete drums (`concrete`, one TNT), own bond group per silo; `hit7` (armor 0.001): a heavy body landing on them breaks them, TNT still works | **target**: the head house laid along them |
| **Weigh house** (C) | x −13.1, 2.6 m gap | 5.2 × 6 m, brick + timber office ≈ 8 m | brick piers and walls, a glazed timber office, a light slate roof body, the weighbridge plate (decor) | **easy** |

Ordered layout: one axis, the drive-through facing the camera, the silo row's gallery level with the head house's fourth storey.

## Mechanics (all existing)
`hrc` (L32 RC tier: hp 600, damage stays), `rc`, tip rule, `hit7` on the silos, `hard7` scoring, `drop7` on `mdC` (plumbing only). No `layer7`.

## Realization moment (no text, no arrows)
1. A bomb on a corner pier: chips and a hairline crack, nothing falls. A bomb on the middle pier beside it: the middle goes, the tower still stands on the cracked corner.
2. Next blast, one more on the same corner: rebar shows; one more: it breaks, and the head house leans that way. "The corner cracks but stands: hit it again."

## Wow (chain)
Opened on the silo side, 27 m of concrete lies down along the silo row: the gallery snaps, the drums burst and tumble one after another.

## Tester targets (Normal, easy pack)
| Test | Bar |
|---|---|
| oneBomb | < 70 % |
| allFoot / footOnly | < 80 % |
| oneWave | reported only |
| fair | 3/3 wins, spare ≥ 2, ≥ 2 blasts, 20–75 s |
| lesson probe | one corner + its middle in one blast (2 TNT): the head house stands; the same corner hit again over the next blasts: it falls |
| curve | no jump > 40 points between consecutive bomb counts |
| at rest | nothing moves or dies in 8 s; 0 bonds cracked |

Fail line (≤ 9 words, a principle): **"Cracked concrete stays cracked. Hit it again."** No opening tip.

## As built (after tuning)
Positions, sizes and keys above are the first design. Tuning (Lead 22/11: lots ≤ ≈ 24 m; bar fixes) moved the layout and added heavy pieces; the built values, hero position and the reasons are in `E08-SUMMARY.md` ("Fixes made on the way").
