# O10 "Pier Pavilion": step 1, GD spec (old polish, play slot 10)

**Replaces:** old L14 "Stripey Light" (F28 lighthouse, reused), slot 10 of ORDER22.
**Intro role (kept):** practice of everything so far: wood, brick, concrete, steel (no card). Nothing introduced before its card (`check-order.js`).
**Lesson (one line): hit what holds the steel: concrete pile caps carry steel legs that carry the pavilion.**

**Inspiration:** a seaside pier head: a brick-and-timber pavilion with a balcony and a flag turret on steel trestles and concrete pile caps, bathing huts on the beach. Inspiration only (no real place, no lettering); not an F-landmark, L01–L05 or E01–E10.

## Shape (x: left → right; z+: towards the camera)

| Building | Position | Size | Structure | Role |
|---|---|---|---|---|
| **Pavilion on its pier head** (A) | x 0, z −7 | 8 × 6.8 m, ≈ 19 m to the flag | grey concrete pile caps (`concrete`), steel trestle legs (`steel`), a timber deck with white rails, a brick ground storey (`bk`, `bkw`), a timber upper storey (`wwall`), a pyramid roof body with a turret | main: base `stiff-tip` on the caps |
| **Bathing huts** (S) | x 0, in front on the axis | 5 huts × 1.8 m | striped timber huts, each its own bond group (they lean on each other) | the landing: they go down like books on a shelf |
| **Villas** (B, C) | x ±11.6 | 6.4 × 5.6 m, ≈ 10.5 m | two brick storeys (g7oCott) | each its own small job |

## Realization (no text)
TNT on the steel trestle barely marks it; the concrete pile caps under it go.

## Wow (chain)
two caps: the pavilion pitches forward off the pier onto the hut row.

## Tester targets (Normal; OLD-POLISH.md bars)
oneBomb < 70 %; fair 3/3 (or the right face wins and the wrong faces do not, on an aim / rotate level), spare ≥ 2, 20–75 s; the expert plan wins in the main build; at rest nothing moves, 0 bonds broken; allFoot / footOnly / oneWave / curve reported (enforced from slot 17).

Fail line (≤ 9 words): **"Hit what holds the steel. Two side by side."** No opening tip.
