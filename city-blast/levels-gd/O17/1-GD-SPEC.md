# O17 "Car Park": step 1, GD spec (old polish, play slot 17)

**Replaces:** old L17 "The Pedestal" (F21 pedestal), slot 17 of ORDER22.
**Intro role (kept):** the **Dark Pier** card ("Reinforced concrete takes more TNT."). Nothing introduced before its card (`check-order.js`).
**Lesson (one line): a dark pier needs more than one TNT.**

**Inspiration:** a multi-storey car park with a stair-and-lift tower, office wings. Inspiration only (no real place, no lettering); not an F-landmark, L01–L05 or E01–E10.

## Shape (x: left → right; z+: towards the camera)

| Building | Position | Size | Structure | Role |
|---|---|---|---|---|
| **Car park** (A) | x 0, z −6 | 12 × 8 m, ≈ 13 m | four split decks (`mdC`) with parapets and parked cars (decor), the whole ground storey on dark reinforced piers (`rc`), dark corners on the next storey, grey columns above | main: base `stiff-tip` |
| **Office wings** (B, C) | x ±12.6 | 6.8 × 5.6 m, ≈ 11.5 m | grey columns and brick infill (g7oWing) | each its own small job |

## Realization (no text)
one TNT on a dark pier only cracks it; two on the same pier break it.

## Wow (chain)
two dark piers side by side: the decks pancake one onto the next, cars tumbling.

## Tester targets (Normal; OLD-POLISH.md bars)
oneBomb < 70 %; fair 3/3 (or the right face wins and the wrong faces do not, on an aim / rotate level), spare ≥ 2, 20–75 s; the expert plan wins in the main build; at rest nothing moves, 0 bonds broken; allFoot / footOnly / oneWave / curve reported (enforced from slot 17).

Fail line (≤ 9 words): **"Dark piers take more TNT than grey ones."** No opening tip.
