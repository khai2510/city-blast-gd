# E01 "Long Legs": result (Normal, 19 TNT): PASS

| Step | Result | File |
|---|---|---|
| 1. GD spec | lesson, shape, roles, wow, realization | `1-GD-SPEC.md` |
| 2. Figma | **skipped in this run**: the Lead handles Figma separately | — |
| 3. Builder | `g7slab` (slab on pilotis, 3 sections, loggias, lit flats, roof terrace with funnel stack and gyms), `g7stilt` (timber clubhouse on stilts) in `pipeline7/engine.js` | `make-level.mjs` → `level.json` |
| 4. Tester | PASS on runs C, D and E (Linux VM, `CB_LIBS`, see LEARNINGS §5) | `results.json` (run E) |

## Numbers

Runs C and D let the tester pick the budget (19 both times). Run E then confirmed it with `tntStart: 19`.

| Test | Bar | Run C | Run D | Run E (19 fixed) |
|---|---|---|---|---|
| oneBomb (best of 18) | < 70% | 4% | 4% | 4% |
| lazy (4 at the main foot) | — | 22% | 22% | 22% |
| allFoot | < 80% | 64% | 64% | 64% |
| footOnly | < 80% | 65% | 65% | 65% |
| oneWave (reported only) | (< 80%) | 73% | 73% | 73% |
| fair, 3 seeds | 3/3 | WIN ×3 | WIN ×3 | WIN ×3 |
| spare TNT | ≥ 2 | 5 / 5 / 6 | 5 / 5 / 5 | 5 / 6 / 6 |
| blasts | ≥ 2 | 3 | 3 | 3 |
| estimated time | 20–75 s | 37–38 s | 38 s | 37–38 s |
| fair, open probe (40 TNT) | — | 16 used, 3 waves, 96% | same | same |

- **Curve** (n bombs on the slab's legs, one blast; % / collapse): 1: 21/34 · 2: 22/35 · 3: 37/62 · 4: 23/37 · 6: 38/62 · 8: 64/100 · 12: 63/100.
  - Biggest jump: +26 (6 → 8). No step reaches 40.
  - The 3 → 4 dip is physics noise: a block falls either onto its neighbour or clear of it.
  - One bomb on a leg drops one block (about 21%): one bomb, one step.
- **Facade check:** one bomb on a facade post of storeys 1–5 gives 0–2%. One bomb on a leg gives about 21%. That gap is the lesson.
- **Chain check:** after the end block falls, the left drums go off and the left clubhouse falls (1 of 32 members still standing) in all 3 ways tried:
  - outer pair of legs: the TNT sets the drums off directly;
  - front pair of legs: the drums are crushed and go off;
  - inner pair of legs: the drums are crushed and go off.
- **Build:** 281 members (slab 212). Nothing moves or breaks at rest after 8 s. Hard pieces are 25% of the mass.

## Screenshots
- `shot-open.jpg`: opening frame.
- `shot-blast1-mid.jpg`: 2 s after the first blast (two front legs of the left block): the block folds onto the clubhouse.
- `shot-blast1.jpg`: after the first blast (the two outer legs): the left block and clubhouse are down, and the vaulted roof gym lies whole in the heap.

## Fixes made on the way (also in LEARNINGS §5)
1. Run A: the blast-proof hero floors (`a1mdC`) cannot be cleared from the heap, so the fair player stalled at 82–84% with 40 TNT. Fix: plain `mdC` floors plus `drop7` on `mdC`. In place they ignore TNT; in the heap one TNT cracks them.
2. Run B: legs left standing under the rubble cannot be tapped from the opening view, yet they count at full weight. Fix: slimmer legs (1.05 m), so a leftover leg weighs less and one bomb on a leg drops its block.

## Open points for Khai
- Budget 19 TNT. The machine keeps 5–6, which is the top of the Normal band (2–5); a person may keep more. It could go to 17 after Khai plays it.
- The fail line "Hit the legs. Heavy pieces still count." is the only text.
- `drop7` is used here only as plumbing (floors ignore TNT up high). It is not taught; E09 teaches drop-first.

## SLOTS-50 (23/11, D-blast-L50 / D-blast-LAUNCH / D-blast-PAD): play slot 50

Converted: RC legs → concrete, drop7 plumbing off (plain floors); heavy roof pieces, drums, glass, steps kept (the heavy teach).

| | |
|---|---|
| Elements before | wood, concrete, glass, dark RC legs, heavy, drums, steps, drop7 |
| Elements after (read from the built level) | wood, concrete, glass, heavy, drums, steps |
| Bar | Normal from 35 (steps launched): oneBomb < 70 %, fair 3/3, spare >= 2, >= 2 blasts, 20-75 s; curve, allFoot / footOnly reported (no heavy piece before 50) |
| TNT | **18** |
| Expert plan (`sol`, one blast) | — |
| fair, 3 seeds | 3/3 · spare 8/2/3 · blasts 3/4/4 · 33/47/47 s |
| oneBomb / lazy | 27 % / 66 % |
| allFoot / footOnly / oneWave | 68 % / 64 % / 72 % |
| curve (n TNT at the main foot: %) | 1:22 2:22 3:25 4:37 6:38 8:63 12:65 (max jump +25) |
| at rest (8 s) | 0 dead, 0 moved, bonds 1252→1252 |
| pad (D-blast-PAD) | lot centred on (0, 0), farthest corner 17.7 m (pad 15.55 m today, ~18.7 m widened) |
| verdict | **PASS** · reported: — |

Gate: `gate.mjs` (one Chrome session, test build on main's 31-polish base, `results-slots50.json`, 2026-11-23T19:30 UTC). Shots: `shot-open.jpg` (393 × 852, test build).
