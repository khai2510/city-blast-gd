# O03 "Airfield Tower": step 1, GD spec (old polish, play slot 3, tutorial bars)

**Replaces:** old L3 "Old Tock" (F01 clock tower and a stepped row of brick / timber blocks), slot 3 of ORDER22. The old level lost
its stored expert plan under the g7 engine (79.7 %, SYNC 22/11); this rebuild's plan is checked in the main build.
**Intro role (kept):** the **Concrete** card ("Grey columns: one TNT each.") whose spotlight puts its TNT on a grey column of the plan.
Nothing else is new: wood + brick + concrete.
**Lesson (one line): grey columns, one TNT each; two side by side tip it.** Brick practice beside it (one TNT a pier).

**Inspiration:** a small post-war airfield: a concrete control tower on columns with a sloped window band and a gallery, the baggage
hall, two terminal wings. Inspiration only (no real airport, no lettering). Not an F-landmark, L01–L05 or E01–E10.

## Shape

| Building | Position | Size | Structure | Role |
|---|---|---|---|---|
| **Control tower** (A) | x 0, z −8 | 6 × 6 m, ≈ 19 m to the mast | an open ground storey of 8 grey columns (`concrete`, 5 m; footing and capital bands decor), two shaft storeys of concrete posts and panels (`cpan`) with window strips, the cab (posts, sill walls; the sloped window band, gallery, rail and consoles are decor), a beacon and an aerial mast; a wind sock beside it | main: base `stiff-tip` |
| **Baggage hall** (S) | x 0, z +4.4 | 9.6 × 4 m, ≈ 4 m | brick piers and back wall, a timber plank deck, a light roof body with a striped canopy; carts and cases inside | the landing (the chain) |
| **Terminal wings** (B, C) | x ±10.8, z −7.4 | 6.8 × 5.6 m, ≈ 11.5 m | three storeys of grey columns with brick infill (`bkw`), window bands, a door canopy, a parapet; a radar dish (right) / weather mast (left) | each its own small job (base `weak`) |

## Realization
A grey column takes one TNT like brick; one column only cracks the tower, its neighbour drops it.

## Wow
The tower pitches forward across the baggage hall: the cab bursts, carts and cases fly across the apron.

## Tester targets (tutorial bars)
oneBomb < 70 %; fair 3/3 with spare ≥ 1; the expert plan wins **in the main build** (the old L3 failure); TNT 5; at rest nothing
moves; allFoot / footOnly / oneWave reported.

Fail line: **"Grey columns: one TNT each. Two side by side."** (8 words). No opening tip.
