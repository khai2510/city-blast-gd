# E03 "Tram Depot": result (Normal, FEEL, 19 TNT): PASS on the easy-pack bars

| Step | Result | File |
|---|---|---|
| 1. GD spec | lesson, shape, roles, wow, realization | `1-GD-SPEC.md` |
| 2. Figma | **skipped in this run** (the Lead handles Figma separately) | — |
| 3. Builder | `g7depot` (three brick tram sheds: 8 brick piers each under the tip rule, arched tram doors with stepped arch heads and fanlights, arched side windows, a light timber roof body `g7roofD` that breaks when it lands, slate slopes, a glazed clerestory, a brick front gable; one heavy `hard7v` roof piece per shed; parked trams and rails as decor) and `g7cabin` (signal cabin: two brick storeys, a glazed timber operating room, a slate roof, a walkway, a signal mast) in `pipeline7/engine.js` | `make-level.mjs` → `level.json` |
| 4. Tester | runs H and I PASS on every easy-pack bar (`run.mjs` prints FAIL only for oneWave, which is reported only on easy levels) | `results.json` (run I) |

## Numbers (runs H and I, `tntStart` 19)

| Test | Bar | Run H | Run I |
|---|---|---|---|
| oneBomb (best of 18) | < 70 % | 51 % (one TNT on a front pier: the drum chain) | 51 % |
| lazy (4 at the depot foot) | — | 55 % | 55 % |
| allFoot | < 80 % | 72 % | 72 % |
| footOnly | < 80 % | 59 % | 59 % |
| oneWave | reported only | 100 % | 100 % |
| fair, 3 seeds | 3/3 | WIN ×3 | WIN ×3 |
| spare TNT | ≥ 2 | 5 / 11 / 8 | 7 / 9 / 8 |
| blasts | ≥ 2 | 4 / 2 / 3 | 3 / 4 / 4 |
| estimated time | 20–75 s | 46 / 23 / 33 s | 36 / 40 / 42 s |
| fair, open probe (40 TNT) | — | 11 used, 3 waves, 98 % | same |

- **Curve** (n bombs on the depot foot, one blast; % / collapse): 1: 3/3 · 2: 22/36 · 3: 53/93 · 4: 50/93 · 6: 52/92 · 8: 53/92 · 12: 51/93. Biggest jump +31 (2 → 3). The curve has a ceiling at ~52 %: the heavy roof pieces never break from a foot blast.
- **The chain** (one TNT on the middle front pier): all 11 drums go off in a running row, every front pier goes, and all three sheds tip forward (52/52 depot members down, 36 broken). The heavy tanks land whole. One bomb gives 45–51 %; the cabins stand.
- **Budget history:** runs A–G tuned it (14 → 21 → 15 → 16 → 17 → 18). Runs H and I confirmed 19 with no bump. The machine keeps 5–11, which is generous; that suits a FEEL level, and a person keeps more.
- **Build:** 137 counted members (depot 53, each cabin 36 + 11 drums). Nothing moves or breaks at rest after 8 s. Hard pieces are 37 % of the mass.

## Screenshots
- `shot-open.jpg`: opening frame (drum row along the depot front, trams in the sheds, cabins at both ends).
- `shot-blast1-mid.jpg`: 2.5 s after one TNT on the middle front pier: the drum row is going off and the sheds lean forward.
- `shot-blast1.jpg`: after that blast: three sheds down in the yard, the two water tanks and the vent lantern lying whole in the rubble, both cabins standing.

## Fixes made on the way (also in LEARNINGS §5)
1. Run A: allFoot 83 %. The heavy pieces were too light (15 % of the mass), and late charges in a long volley cracked the tanks as they fell to the foot. Fix: bigger roof pieces (37 % of the mass) and a tight budget.
2. Run D: the fair player was stuck with 11 TNT left. A whole roof slab lay on top of a tank, so no tap could reach it. Fix: the depot roof body `g7roofD` breaks when it lands.

## Open points for Khai
- Budget 19 TNT. The machine keeps 5–11, the top of the Normal band. A FEEL level may be generous; it could go to 16–17 after Khai plays it.
- The fail line "Red drums blast for free. Heavy pieces still count." is the only text.
- "Heavy pieces still count" is the same second read as E01. It keeps one TNT from winning, and that is all it is here.
