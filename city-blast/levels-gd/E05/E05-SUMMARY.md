# E05 "Star Dome": result (Normal, TEACH, 20 TNT): PASS on the easy-pack bars

| Step | Result | File |
|---|---|---|
| 1. GD spec | lesson, shape, roles, wow, realization | `1-GD-SPEC.md` |
| 2. Figma | Figma-style sheet from the game (opening + the lesson in four frames, 393 × 852) | `E05-sheet.jpg` |
| 3. Builder | `g7obs` (observatory: an eight-sided brick drum of two storeys on 16 brick posts, a door, arched and round windows, string course, cornice and gallery rail; floors as a ring of cassettes round a hole; one heavy stepped silver dome (`hard7t`) with an observing slit; inside, the telescope pier: two slim dense heavy pieces (`hard7p` = `hard7v` at 7 800 kg/m³) on a stone plinth, standing free in the floor holes, the telescope on top as decor) and `g7study` (timber study wing: two storeys, glazed front, arched windows, desks and books inside, a slate roof with a transit hut and a weather mast) in `pipeline7/engine.js` | `make-level.mjs` → `level.json` |
| 4. Tester | run r5 (base: main's `31-polish.html`): PASS every bar; `run.mjs` prints FAIL only for oneWave (91 %), which is reported only on easy levels | `results.json` (run r5) |

Hero position (for a later camera preset): part A (observatory) at x 0, z 0, drum 10 m across, ≈ 12 m to the dome top; wings at x ± 8.8. Lot ≈ 24 × 17 m.

## Numbers (run r5, budget 20)

| Test | Bar | Result |
|---|---|---|
| oneBomb (best of 18) | < 70 % | 14 % |
| lazy (4 at the drum foot) | — | 10 % |
| allFoot | < 80 % | 52 % |
| footOnly | < 80 % | 67 % |
| oneWave | reported only | 91 % |
| fair, 3 seeds | 3/3 | WIN × 3 |
| spare TNT | ≥ 2 | 2 / 3 / 2 |
| blasts | ≥ 2 | 3 / 4 / 4 |
| estimated time | 20–75 s | 45 / 53 / 54 s |
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
- Budget 20 TNT, machine spare 2–3 (bottom of the Normal band).
- The wow is "the pier holds up the dome" rather than "the dome drags the drum" (see above).
- The fail line "Open the shell first. The core still counts." is the only text.
