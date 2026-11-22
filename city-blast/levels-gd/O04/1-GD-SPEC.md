# O04 "Fire Station": step 1, GD spec (old polish, play slot 4)

**Replaces:** old L36 "Sail Lot" (F30 twin sails, timber stacks, a blue building), slot 4 of ORDER22.
**Intro role (kept):** the **Blue Building** card ("Keep the blue buildings safe.", a look spotlight and hand, no tap on the blue). Nothing introduced before its card (`check-order.js`).
**Lesson (one line): keep the blue building safe: bring the tower down in front of it, not on it.**

**Inspiration:** a small-town fire station: a brick appliance arcade under a timber hose-drying tower with a bell loft, the engine house, the crew house. Inspiration only (no real place, no lettering); not an F-landmark, L01–L05 or E01–E10.

## Shape (x: left → right; z+: towards the camera)

| Building | Position | Size | Structure | Role |
|---|---|---|---|---|
| **Hose tower** (A) | x 0, z −8 | 5.6 × 5.6 m, ≈ 21 m | a brick arcade of 8 piers (`bk`), three timber storeys (`wpost`, louvred `wwall` slats, hoses hanging inside), an open bell loft with the bell, a slate pyramid roof body and a flag | main: base `stiff-tip` + shove |
| **Engine house** (S) | x 0, in front on the axis | 9.6 × 4.4 m, ≈ 4 m | brick piers and back wall, two bays with red engines and folded doors (decor), a light roof body with a cornice and name board | the landing |
| **School** (blue, `keep6`) | x −10.6 | 3 × 3 bays, 3 floors | the game's blue building | keep safe (> 5 % = lose) |
| **Crew house** (C) | x +10.6 | 6.4 × 5.6 m, ≈ 10.5 m | two brick storeys, tiled roof (g7oCott) | its own small job |

## Realization (no text)
a blast that throws the tower sideways or blasts the crew house about lands rubble on the school: small, aimed blasts in front keep it clean.

## Wow (chain)
two piers and BLAST: the hose tower pitches forward through the engine house roof, the bell crashes down.

## Tester targets (Normal; OLD-POLISH.md bars)
oneBomb < 70 %; fair 3/3 (or the right face wins and the wrong faces do not, on an aim / rotate level), spare ≥ 2, 20–75 s; the expert plan wins in the main build; at rest nothing moves, 0 bonds broken; allFoot / footOnly / oneWave / curve reported.

Fail line (≤ 9 words): **"Bring it down in front. Keep the blue safe."** No opening tip.
