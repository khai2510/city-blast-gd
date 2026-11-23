# E05 "Star Dome": result (Normal, TEACH, 22 TNT): PASS on the easy-pack bars

| Step | Result | File |
|---|---|---|
| 1. GD spec | lesson, shape, roles, wow, realization | `1-GD-SPEC.md` |
| 2. Figma | Figma-style sheet from the game (opening + the lesson in four frames, 393 × 852) | `E05-sheet.jpg` |
| 3. Builder | `g7obs` (observatory: an eight-sided brick drum of two storeys on 16 brick posts, a door, arched and round windows, string course, cornice and gallery rail; floors as a ring of cassettes round a hole; one heavy stepped silver dome (`hard7t`) with an observing slit; inside, the telescope pier: two slim dense heavy pieces (`hard7p` = `hard7v` at 7 800 kg/m³) on a stone plinth, standing free in the floor holes, the telescope on top as decor) and `g7study` (timber study wing: two storeys, glazed front, arched windows, desks and books inside, a slate roof with a transit hut and a weather mast) in `pipeline7/engine.js` | `make-level.mjs` → `level.json` |
| 4. Tester | run r5 (base: main's `31-polish.html`, alone): PASS at 20 TNT; the final run of all 10 easy levels in one session (main base 22/11) needed 22: the budget is set to 22. `run.mjs` prints FAIL only for oneWave (91–93 %), reported only on easy levels | `results.json` (run r5) |

Hero position (for a later camera preset): part A (observatory) at x 0, z 0, drum 10 m across, ≈ 12 m to the dome top; wings at x ± 8.8. Lot ≈ 24 × 17 m.

## Numbers (run r5, alone, budget 20; the final 10-level run in brackets, budget 22)

| Test | Bar | Result |
|---|---|---|
| oneBomb (best of 18) | < 70 % | 14 % |
| lazy (4 at the drum foot) | — | 10 % |
| allFoot | < 80 % | 52 % |
| footOnly | < 80 % | 67 % |
| oneWave | reported only | 91 % |
| fair, 3 seeds | 3/3 | WIN × 3 |
| spare TNT | ≥ 2 | 2 / 3 / 2 (final: 5 / 3 / 5 at 22) |
| blasts | ≥ 2 | 3 / 4 / 4 (final: 5 / 5 / 7) |
| estimated time | 20–75 s | 45 / 53 / 54 s (final: 62 / 64 / **80** s: the third seed is 5 s over) |
| fair, open probe (40 TNT) | — | 19 used, 5 waves, 92 % |

- **Curve** (n bombs on the drum foot, one blast; % / collapse): 1: 6/6 · 2: 11/11 · 3: 17/17 · 4: 21/21 · 6: 26/26 · 8: 31/31 · 12: 31/31. Biggest jump +6: a steady climb with a ceiling (the core and the dome still count).
- **Lesson probe:**
  - the pier is **not tappable from any of the 4 views** while the drum stands (`reach4`: 0 of 2 pieces);
  - every drum post of the ground storey (12 TNT): 31 %, the pier untouched (no TNT on the drum reaches it: 3.8 m blast reach);
  - the rest of the shell and the wings: 55 %, the pier still standing with the telescope on it;
  - one TNT per pier piece: **74 %** (+19), then the dome (one bomb) finishes it.
- **Look checks:** 121 members, nothing moves or breaks at rest in 8 s, 0 bonds cracked; roofs and dome are members, decor inside their outlines; camera sweep 48 poses, **0 inside a building**. Hard pieces (pier 14 %, dome 27 %) 41 % of the mass.

## Screenshots
- `shot-open.jpg`: opening frame at 393 × 852.
- `shot-blast1-mid.jpg`: bombs on the drum posts: the ground storey goes, the drum settles.
- `shot-blast1.jpg`: after that blast: the upper drum and the dome rest on the telescope pier.
- `E05-sheet.jpg`: opening, the fold, shell down with the pier untouched, shell + wings gone with the pier standing, the pier cracked.

## Wow, as built
The ground storey of the drum folds and the upper drum and dome settle onto the telescope pier, which holds them up like a column; once the pier is cracked, the dome drops into the heap. (The plan said "the dome caves in and drags the drum with it". A version with the pier 0.6 m short of the dome did that, but the fair player's budget then swung between seeds (26 TNT, 6 waves, 70 s), so the pier that holds the dome was kept.)

## Fixes made on the way
1. Runs r1/r2: the bombs on the drum's posts cracked the core for free (12 TNT within 2–3 m of it). Fix: a slimmer, denser pier (`hard7p`) clear of the 3.8 m TNT reach, on a stone plinth (so the foot tests do not count it as the foot).
2. Run r2: footOnly 84 %: heavy dome (`hard7t`), first in 5 pieces (fair player 1/3: too many pieces in the heap), then as one piece.
3. Lot compacted to ≈ 24 m (Lead 22/11).

## Open points for Khai
- Budget 22 TNT. Alone at 20 the machine keeps 2–3; in the long final session one seed needed more, so 22 (spare 3–5). The fair player's third seed took 7 blasts / 80 s there (bar 75 s; `run.mjs` judges the first seed, 62 s): E05 is the slowest of the batch.
- The wow is "the pier holds up the dome" rather than "the dome drags the drum" (see above).
- The fail line "Open the shell first. The core still counts." is the only text.
- **23/11 HOVER-1123 (U-4):** `coreGap` 0 → 1.2 m: the dome and upper drum no longer rest on the hidden pier, they come down with the ground storey and the lower pier stands in the open. The "wow, as built" above (the pier holds the dome) is gone on purpose. Budget 22 → 23. Numbers: `../HOVER-1123/HOVER.md`.

## SLOTS-50 (23/11, D-blast-L50 / D-blast-LAUNCH / D-blast-PAD): play slot 36

Converted: telescope pier hard7p → concrete, dome hard7t → brick, no drop7; keeps >= 2 blasts.

| | |
|---|---|
| Elements before | wood, brick, glass, heavy core + dome, steps, drop7 |
| Elements after (read from the built level) | wood, brick, concrete, glass, steps |
| Bar | Normal from 35 (steps launched): oneBomb < 70 %, fair 3/3, spare >= 2, >= 2 blasts, 20-75 s; curve, allFoot / footOnly reported (no heavy piece before 50) |
| TNT | **19** |
| Expert plan (`sol`, one blast) | — |
| fair, 3 seeds | 3/3 · spare 3/4/3 · blasts 5/4/4 · 61/51/52 s |
| oneBomb / lazy | 14 % / 11 % |
| allFoot / footOnly / oneWave | 79 % / 80 % / 77 % |
| curve (n TNT at the main foot: %) | 1:6 2:14 3:17 4:21 6:69 8:72 12:74 (max jump +48) |
| at rest (8 s) | 0 dead, 0 moved, bonds 485→485 |
| pad (D-blast-PAD) | lot centred on (0, 0), farthest corner 11.3 m (pad 15.55 m today, ~18.7 m widened) |
| verdict | **PASS** · reported: curve jump +48; footOnly 80% |

Gate: `gate.mjs` (one Chrome session, test build on main's 31-polish base, `results-slots50.json`, 2026-11-23T19:22 UTC). Shots: `shot-open.jpg` (393 × 852, test build).
