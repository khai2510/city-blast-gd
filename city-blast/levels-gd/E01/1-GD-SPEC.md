# E01 "Long Legs": step 1, GD spec (easy pack, Normal)

**Lesson (one line): hit the legs.** The building is held up only by its legs. Bombs on the big colourful facade break glass and nothing else. A bomb on a leg brings a whole block down.

**Inspiration:** the modernist "city in the sky" housing slab, lifted on sculpted pilotis, with colourful loggias and a roof terrace (a funnel-shaped ventilation stack, a gym). Inspiration only: our own three-section plan, five storeys, our own colours. No real name, no real proportions. It does not duplicate any F-landmark or L01–L04.

## Shape (x: left → right; z+: towards the camera)

| Building | Position | Size | Structure | Role |
|---|---|---|---|---|
| **Slab** (A) | x 0 | 21.2 × 9 m; legs 6 m + 5 storeys × 3 m + roof ≈ 26 m; 212 members | **3 sections** side by side, each its own block (bg 81–83: they touch, never glued). Each section stands on **4 pilotis** (RC, 1 TNT, flared V heads). Body: concrete posts, glass on both long faces (loggias with painted side walls, white parapets, a floor band and fins), blank board-marked end walls, lit flats inside (`floorIn`) | main |
| Roof pieces | on each section | middle: funnel stack 2.6 × 4 × 2.6 m; ends: vaulted gym 4.2 × 2.6 × 3.4 m | `hard7v`: land whole, count until a bomb cracks them | the second read |
| **Clubhouses** (B, C) | x ±14.8, same size, same 1.6 m gap, fronts in line | 5.2 × 6 m, 4 m stilts + 2 timber storeys + gable roof ≈ 13 m | timber legs (1 TNT), board walls, glass front, balcony rail, stair | easy, an echo of the lesson; the end of the chain |
| **Red drums** | 3 under each slab end, between its end legs | | `tanks`; `hit7.drums`: a heavy body landing on them sets them off | gift / chain |

Floors: plain concrete cassettes (`mdC`) under `drop7`. They shrug off TNT while the slab stands, so a facade bomb cannot drop a storey. Once they lie in the heap, one TNT cracks them. Without this, the blast-proof hero floors left a heap that no bomb could clear: the fair player stalled at 82–84%.

## Realization moment (no text, no arrows)
1. Bomb on the facade: glass shatters, the slab stands (2%).
2. Bomb on a leg: a whole block drops (21% from one bomb).
3. The funnel stack or gym lands whole and still counts: one more bomb.

## Wow (chain)
Two bombs on the end legs. The end block swings down, the drums under it go off, and the clubhouse beside it collapses. Four events from two bombs.

## Tester targets (Normal)
| Test | Bar |
|---|---|
| oneBomb | < 70% |
| allFoot / footOnly | < 80% |
| oneWave | reported only (relaxed for easy levels) |
| fair | 3/3 wins, spare ≥ 2, ≥ 2 blasts, 20–75 s |
| curve | no jump > 40 points |

Fail line (≤ 9 words, a principle): **"Hit the legs. Heavy pieces still count."** No opening tip.
