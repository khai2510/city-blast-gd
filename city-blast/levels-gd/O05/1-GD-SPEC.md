# O05 "Valley Station": step 1, GD spec (old polish, play slot 5)

**Replaces:** old L6 "Dome Square" (F14 dome hall), slot 5 of ORDER22.
**Intro role (kept):** the **rotate** lesson (swipe hand "Swipe to turn"). Nothing introduced before its card (`check-order.js`).
**Lesson (one line): turn the view: the station falls toward the legs you break, and the front legs drop it on the blue house.**

**Inspiration:** a cable-car valley station: grey concrete columns, a window band, the timber machine house with the bullwheel and a gondola. Inspiration only (no real place, no lettering); not an F-landmark, L01–L05 or E01–E10.

## Shape (x: left → right; z+: towards the camera)

| Building | Position | Size | Structure | Role |
|---|---|---|---|---|
| **Station** (A) | x 0, z −3 | 6.4 × 6.4 m, ≈ 18 m | an open storey of 8 grey columns, concrete storeys (`cpan`) with window bands, the timber machine house (bullwheel, gondola decor), a gabled slate roof body | main: base `stiff-tip` |
| **Guest house** (blue, `keep6`) | x 0, z +6.5, in front | 4 × 2 bays, 1 floor | the game's blue building, low so the station's legs show over it | in the fall line of the front legs |
| **Ticket hall** (S) | x 0, z −15.5, behind | 10 × 6 m, ≈ 9 m | two timber storeys, board walls, windows, a long gabled roof body | the landing of the proper (backward) fall |
| **Log lodges** (B, C) | x ±11 | 6.4 × 5.6 m, ≈ 10 m | log cabins (g7oCabin) | each its own small job |

## Realization (no text)
the front legs are the ones in view: blasting them drops the station on the blue house (lose). Turned round, the back legs drop it onto the ticket hall.

## Wow (chain)
turned to the back, two legs: the station falls back across the ticket hall, the gondola swinging.

## Tester targets (Normal; OLD-POLISH.md bars)
oneBomb < 70 %; fair 3/3 (or the right face wins and the wrong faces do not, on an aim / rotate level), spare ≥ 2, 20–75 s; the expert plan wins in the main build; at rest nothing moves, 0 bonds broken; allFoot / footOnly / oneWave / curve reported.

Fail line (≤ 9 words): **"It falls toward the legs you break. Turn around."** No opening tip.
