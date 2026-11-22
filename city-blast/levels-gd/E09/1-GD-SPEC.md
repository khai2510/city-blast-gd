# E09 "High Cistern": step 1, GD spec (easy pack, Normal, TEACH)

**Slot 9 in the plan. Role: TEACH** (order with height).
**Lesson (one line): a light drop-first.** The heavy cistern on top shrugs off TNT while it is up high; brought down, one TNT cracks it. The light version of H1's "drop first, break after": one heavy piece, one fall, 1.5 m.

**Inspiration:** a town water tower: a square brick tower with pilasters and round-headed windows, a corbelled iron gallery, a riveted iron cistern with a conical roof, ladder and float gauge; two brick pump houses with slender iron stacks. Inspiration only: our own plan, sizes and colours, no real works. No duplicate of an F-landmark, H1–H5 or E01–E08 (E03 has small roof tanks that only need one more bomb; here the cistern is the whole lesson and cannot be cracked up high).

## Shape (x: left → right; z+: towards the camera)

| Building | Position | Size | Structure | Role |
|---|---|---|---|---|
| **Water tower** (A) | x 0 | 6 m square, 3 brick storeys × 4 m, slightly tapering, + cistern ≈ 17 m | brick posts (`bk`) and walls (`bkw`) with a door, round-headed windows, pilasters and string courses; floors `mdB`; an iron gallery (decor) | main |
| **Cistern** (A) | on the tower | 4.2 × 2.8 m member, Ø 4.5 m drawn, + cone | **one `hard7v` piece** under `drop7` (fall 1.5 m, armor 0.97): up high a bomb on it does nothing; once it has fallen, one TNT cracks it; counted until cracked | the heavy piece |
| **Pump houses** (B, C) | x ±8.4, 2.6 m gap | 5.6 × 7.2 m, 4.6 m + slate roof | brick posts and walls, tall arched windows, a light slate roof body (`g7roofL`) with a louvred ridge, an iron stack, a flywheel inside (decor) | **easy** |

Ordered layout: one axis, a matched pair of pump houses, fronts in line.

## Mechanics (all existing)
`drop7 {keys: hard7v, mdB; fall 1.5}`, `hard7` scoring, separate bond groups (`bg`).

## Realization moment (no text, no arrows)
1. Bombs on the cistern up high: smoke, nothing else; the bar does not move.
2. Bombs on the tower's feet: the tower folds and the cistern crashes down through it and lands in the heap, whole. One bomb on it now and it bursts. "Bring it down first, then crack it."

## Wow (chain)
The tower gives way storey by storey under the falling cistern; it lands with a boom and rolls against a pump house.

## Tester targets (Normal, easy pack)
| Test | Bar |
|---|---|
| oneBomb | < 70 % |
| allFoot / footOnly | < 80 % |
| oneWave | reported only (all TNT in one blast cannot crack the cistern: drop7 reads the state at BLAST) |
| fair | 3/3 wins, spare ≥ 2, ≥ 2 blasts, 20–75 s |
| lesson probe | 3 TNT on the cistern up high: % before / after; tower down, then 1 TNT on the fallen cistern |
| curve | no jump > 40 points between consecutive bomb counts |
| at rest | nothing moves or dies in 8 s; 0 bonds cracked |

Fail line (≤ 9 words, a principle): **"Bring the heavy piece down first. Then crack it."** No opening tip.

## As built (after tuning)
Positions, sizes and keys above are the first design. Tuning (Lead 22/11: lots ≤ ≈ 24 m; bar fixes) moved the layout and added heavy pieces; the built values, hero position and the reasons are in `E09-SUMMARY.md` ("Fixes made on the way").
