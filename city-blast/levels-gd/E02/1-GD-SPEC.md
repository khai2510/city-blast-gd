# E02 "Shot Tower": step 1, GD spec (easy pack, Normal, TEACH)

**Slot 6 in the plan. Role: TEACH** (one new idea in a safe scene; failures are cheap and their cause is visible).
**Lesson (one line): break two legs side by side and it tips that way.** E01 taught "hit the legs". Now the player finds out that *which* legs decides *where* it falls: the fall direction is theirs to choose.

**Inspiration:** the 19th-century brick shot towers (a tall brick shaft, a lookout gallery and lantern at the top, an arched ground storey) and the long timber goods sheds of a works yard. Inspiration only: our own square tapering shaft on an open arcade of eight legs, our own sizes and colours. It does not duplicate any F-landmark (no clock, no leaning tower, no lighthouse), H1–H5 (H2's keep is a stone fortress tower with a powder store) or E01.

## Shape (x: left → right; z+: towards the camera)

| Building | Position | Size | Structure | Role |
|---|---|---|---|---|
| **Shot tower** (A) | x 0 | 6.8 m square at the foot; 5 m legs + 7 storeys × 3.4 m + gallery and lantern ≈ 35 m | **8 legs** (RC clad in brick, 1 TNT each, a bomb never takes the neighbour) under the **tip rule with a 2 s hinge**: two legs side by side gone = the face goes and the tower lies down that way. Shaft: RC posts clad in brick (a bomb on the shaft takes a wall panel, never the storey) and brick walls, tapering 0.12 m per storey, slit windows, corner quoins, stone string courses; a corbelled gallery with a white rail, an octagonal glazed lantern, a copper cap and vane. Inside: **4 cast-iron lead-shot hoppers** (storeys 1, 3, 5, 7) and a **shot cistern** in the lantern (`hard7v`, about 26 % of the mass): they land whole and still count until a bomb cracks them | main, the teacher |
| **Goods sheds** (B, C) | x ±12.9, same size, same 2.5 m gap, fronts in line | 14 × 8 m, timber, 2 storeys + slate roof ≈ 10.6 m | timber posts (one TNT takes every post within ~3 m), board walls, green loading doors, a glazed hoist dormer, a loading platform with crates | **targets**: the tower tipped sideways lies along a shed and flattens it (`hit7`, armor 0.001: a heavy body landing on the shed breaks it; TNT works as usual) |

Floors: plain `mdB` under `drop7` (plumbing as E01): a bomb on the shaft breaks a wall but never drops a storey, so only the legs matter. Once in the heap one TNT cracks them.

## Realization moment (no text, no arrows)
1. One leg: it breaks, the tower stands. Nothing.
2. Two legs at the front (what most players try first): the tower falls forward onto the empty yard. Both sheds still stand: "it fell where I opened it".
3. Next time: two legs on the side facing a shed. The tower lies down on the shed. "I choose where it falls."

## Wow (chain)
Two legs on one side: a 35 m tower swings down along a 14 m shed and flattens it end to end. Two bombs, two buildings.

## Tester targets (Normal, easy pack)
| Test | Bar |
|---|---|
| oneBomb | < 70 % |
| allFoot / footOnly | < 80 % |
| oneWave | reported only |
| fair | 3/3 wins, spare ≥ 2, ≥ 2 blasts, 20–75 s (the blind fair player opens the front: the cheap fail still wins, with fewer TNT left) |
| direction probe | two legs on each face: the tower falls towards that face; towards a shed it takes the shed too (reported) |
| curve | no jump > 40 points between consecutive bomb counts (expected to fail at 1 → 2: the topple is the lesson; for Khai) |
| at rest | nothing moves or dies in 8 s |

Fail line (≤ 9 words, a principle): **"Neighbouring legs tip it. Heavy pieces still count."** No opening tip.
