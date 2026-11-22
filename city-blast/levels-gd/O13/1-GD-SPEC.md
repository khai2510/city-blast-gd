# O13 "Monorail Station": step 1, GD spec (old polish, play slot 13)

**Replaces:** old L15 "The Sail" (F30 twin sails), slot 13 of ORDER22.
**Intro role (kept):** wood + concrete + steel practice (no card). Nothing introduced before its card (`check-order.js`).
**Lesson (one line): what rests on it falls with it: the viaduct spans lean on the station.**

**Inspiration:** a monorail station on concrete columns, its steel platform canopy and the viaduct spans either side, a parked train. Inspiration only (no real place, no lettering); not an F-landmark, L01–L05 or E01–E10.

## Shape (x: left → right; z+: towards the camera)

| Building | Position | Size | Structure | Role |
|---|---|---|---|---|
| **Station** (A) | x 0, z −5 | 8.4 × 5.2 m, ≈ 10 m | grey concrete columns (`concrete`) under a concrete platform deck, slim steel posts (`steel`) and a steel canopy deck (`mdS`), a stair, a ticket kiosk and the train (decor) | main: base `stiff-tip` |
| **Viaduct spans** (B, C) | x ±7.4 | 8 m beam each | a pair of grey columns and a cross-head at the outer end; the steel guideway beam rests on the station platform edge (own bond group) | the chain: both swing down when the station goes |

## Realization (no text)
one span blasted alone hangs from its outer columns; the station is what holds both up.

## Wow (chain)
two columns: the station drops and both spans swing down after it.

## Tester targets (Normal; OLD-POLISH.md bars)
oneBomb < 70 %; fair 3/3 (or the right face wins and the wrong faces do not, on an aim / rotate level), spare ≥ 2, 20–75 s; the expert plan wins in the main build; at rest nothing moves, 0 bonds broken; allFoot / footOnly / oneWave / curve reported (enforced from slot 17).

Fail line (≤ 9 words): **"What rests on it falls with it."** No opening tip.
