# O18 "Roadside Motel": step 1, GD spec (old polish, play slot 18)

**Replaces:** old L12 "Star Pedestal" (F21), slot 18 of ORDER22.
**Intro role (kept):** rotate + dark pier practice (no card). Nothing introduced before its card (`check-order.js`).
**Lesson (one line): the dark legs are round the back: turn the view and give them more TNT.**

**Inspiration:** a roadside motel: the tall sign pylon with its star and bulbs, the row of rooms, the car lot. Inspiration only (no real place, no lettering); not an F-landmark, L01–L05 or E01–E10.

## Shape (x: left → right; z+: towards the camera)

| Building | Position | Size | Structure | Role |
|---|---|---|---|---|
| **Sign pylon** (A) | x 0, z −2 | 3.6 × 3.6 m, ≈ 20 m | grey concrete front legs, dark reinforced back legs (`rc`), four concrete storeys, the sign board, star, bulbs and arrow (decor) | main: base `stiff-tip` |
| **Motel row** (S) | x 0, z −13, behind | 4 rooms × 3 m | brick party walls, timber fronts, a walkway roof, cars (decor); each room its own bond group | the landing of the proper (backward) fall |
| **Offices** (B, C) | x ±11 | 6.4 × 5.6 m | g7oCott | each its own small job |

## Realization (no text)
the front legs (in view) drop the sign over the empty lot; the back legs are dark and take two TNT each.

## Wow (chain)
turned to the back: the pylon falls across the motel row, the star bouncing down the roofs.

## Tester targets (Normal; OLD-POLISH.md bars)
oneBomb < 70 %; fair 3/3 (or the right face wins and the wrong faces do not, on an aim / rotate level), spare ≥ 2, 20–75 s; the expert plan wins in the main build; at rest nothing moves, 0 bonds broken; allFoot / footOnly / oneWave / curve reported (enforced from slot 17).

Fail line (≤ 9 words): **"Dark legs take more TNT. Look round the back."** No opening tip.
