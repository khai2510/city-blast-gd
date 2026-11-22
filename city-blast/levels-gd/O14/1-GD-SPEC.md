# O14 "Seaside Hotel": step 1, GD spec (old polish, play slot 14)

**Replaces:** old L11 "Shell Hall" (F05 shell hall), slot 14 of ORDER22.
**Intro role (kept):** the **"Blast again!"** moment (blast in steps), and the blue building. Nothing introduced before its card (`check-order.js`).
**Lesson (one line): one blast is not always enough: the upper block rides down whole.**

**Inspiration:** a seaside hotel of two blocks: a lower block with balconies and an upper block with a roof terrace and the hotel sign; bathing huts; a blue beach house. Inspiration only (no real place, no lettering); not an F-landmark, L01–L05 or E01–E10.

## Shape (x: left → right; z+: towards the camera)

| Building | Position | Size | Structure | Role |
|---|---|---|---|---|
| **Hotel** (A) | x 0, z −8 | 10 × 6 m, ≈ 19 m | the lower block (3 storeys of grey columns, `cpan`, balconies) and the upper block (3 storeys, pastel, roof terrace, lit sign) are separate bond groups: the upper only rests on the lower | main |
| **Bathing huts** (S) | in front on the axis | 5 huts | g7oHuts | the landing |
| **Beach house** (blue, `keep6`) | x −11.6 | 2 × 2 bays, 3 floors | the game's blue building | keep safe |
| **Villa** (C) | x +11.6 | 6.4 × 5.6 m | g7oCott | its own small job |

## Realization (no text)
the first blast drops the lower block; the upper block lands on the heap nearly whole and still counts.

## Wow (chain)
the second blast on the upper block: the terrace, the sign and the parasols come down.

## Tester targets (Normal; OLD-POLISH.md bars)
oneBomb < 70 %; fair 3/3 (or the right face wins and the wrong faces do not, on an aim / rotate level), spare ≥ 2, 20–75 s; the expert plan wins in the main build; at rest nothing moves, 0 bonds broken; allFoot / footOnly / oneWave / curve reported (enforced from slot 17).

Fail line (≤ 9 words): **"One blast is not always enough. Blast again."** No opening tip.

## 22/11 note: courtyard version (run R)
The two-block version did not need a second blast (the upper block lands low on the heap: 91 % in one). Rebuilt as a courtyard:
the hotel slab stands inside a ring of four timber wings (`make-level.mjs`), so its legs are out of reach until a wing is opened.
The fair bot now needs 2–4 blasts (the steps lesson works), but one TNT on the slab's first-floor panel drops it (oneBomb 76 %) and
allFoot is 99 %: not wired (OLD-POLISH.md).
