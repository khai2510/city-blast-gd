# O06 "Harbour Crane": step 1, GD spec (old polish, play slot 6)

**Replaces:** old L8 "Rivet Tower" (F03 lattice tower), slot 6 of ORDER22.
**Intro role (kept):** the **Steel** card ("Steel holds. Break what it stands on.", its spotlight puts a TNT on a concrete foot of the plan). Nothing introduced before its card (`check-order.js`).
**Lesson (one line): steel holds; break the concrete it stands on.**

**Inspiration:** a harbour portal crane on rail bogies, a small timber coaster at the quay, brick warehouses. Inspiration only (no real place, no lettering); not an F-landmark, L01–L05 or E01–E10.

## Shape (x: left → right; z+: towards the camera)

| Building | Position | Size | Structure | Role |
|---|---|---|---|---|
| **Portal crane** (A) | x 0, z −6 | 6.4 × 5.2 m, ≈ 18 m to the jib | four grey concrete pedestals (`concrete`), four steel portal legs (`steel`) with X-braces, a steel girder deck (`mdS`), a timber machine house with cab, jib, rope and hook (decor) | main: base `stiff-tip` on the pedestals |
| **Coaster** (S) | x 0, in front on the axis | 10.8 × 3.6 m, ≈ 3.5 m | a timber hull (`wwall` sides, `mdW` deck), bow and stern, wheelhouse and cargo crates (decor), the harbour water | the landing |
| **Warehouses** (B, C) | x ±10.6 | 6.4 × 6 m, ≈ 13 m | three brick storeys, loading doors one over another, hoist beam, gabled roof body | each its own small job |

## Realization (no text)
a TNT on a steel leg barely marks it; the same TNT on the concrete pedestal under it breaks it.

## Wow (chain)
two pedestals: the steel crane topples forward across the coaster, crates flying.

## Tester targets (Normal; OLD-POLISH.md bars)
oneBomb < 70 %; fair 3/3 (or the right face wins and the wrong faces do not, on an aim / rotate level), spare ≥ 2, 20–75 s; the expert plan wins in the main build; at rest nothing moves, 0 bonds broken; allFoot / footOnly / oneWave / curve reported.

Fail line (≤ 9 words): **"Steel holds. Break what it stands on."** No opening tip.
