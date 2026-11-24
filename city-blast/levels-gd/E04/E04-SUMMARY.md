# E04 "Market Hall": result (Normal, TEACH, 19 TNT): PASS on the easy-pack bars

| Step | Result | File |
|---|---|---|
| 1. GD spec | lesson, shape, roles, wow, realization | `1-GD-SPEC.md` |
| 2. Figma | **skipped in this run** (the Lead handles Figma separately) | — |
| 3. Builder | `g7mhall` (three timber market sections: 8 timber posts each (`g7post`) with knee braces, under the tip rule; stalls with striped awnings, crates and hanging lamps; a glazed timber clerestory; a heavy tiled roof body (`hard7t`) with tile ribs and a ridge vent; a lantern cupola on the middle section), `g7arcade` (two-storey brick arcade: brick piers and lintels, corbelled arch heads with keystones, a gallery rail, a parapet with a name board) and `g7kiosk` (brick weigh house: two brick storeys, a green door, arched windows, a conical slate roof, a weighing scale) in `pipeline7/engine.js` | `make-level.mjs` → `level.json` |
| 4. Tester | run I (the tester picked 19) and run J (`tntStart` 19) pass every easy-pack bar; `run.mjs` prints FAIL only for oneWave (96 %), which is reported only on easy levels | `results.json` (run J) |

## Numbers

| Test | Bar | Run I | Run J (19 fixed) |
|---|---|---|---|
| oneBomb (best of 20) | < 70 % | 15 % | 15 % |
| lazy (4 at the hall foot) | — | 19 % | 19 % |
| allFoot | < 80 % | 63 % | 63 % |
| footOnly | < 80 % | 65 % | 65 % |
| oneWave | reported only | 96 % | 96 % |
| fair, 3 seeds | 3/3 | WIN ×3 | WIN ×3 |
| spare TNT | ≥ 2 | 2 / 5 / 2 | 5 / 5 / 4 |
| blasts | ≥ 2 | 4 / 3 / 4 | 3 / 3 / 4 |
| estimated time | 20–75 s | 48 / 36 / 49 s | 37 / 37 / 46 s |
| fair, open probe (40 TNT) | — | 13 used, 3 waves, 100 % | |

- **Curve** (n bombs on the hall foot, one blast; % / collapse): 1: 5/21 · 2: 6/21 · 3: 6/21 · 4: 6/21 · 6: 9/42 · 8: 16/63 · 12: 42/75. Biggest jump +26 (8 → 12). The % stays low while the frames fold (the collapse column climbs) because the heavy tiled roofs count until they are cracked.
- **Materials probe** (one TNT, one blast; % and what is down):
  - an arcade pier: 3 % (one pier and its lintels; arcade 18 % down);
  - a weigh-house pier: 3 % (weigh house 26 % down, still standing);
  - a timber post at a section joint: 24 % in one run, 9–11 % in another. Two or three sections fold (hall 67–100 % down), and the tiled roofs land whole.
  One TNT on timber folds a whole section; one TNT on brick takes one pier.
- **Build:** 145 counted members in the tester (hall 81, arcade 26, weigh houses 19 each). Nothing moves or breaks at rest after 8 s. The heavy tiled roofs are 46 % of the mass.

## Screenshots
- `shot-open.jpg`: opening frame (the tiled market roofs behind the brick arcade, a weigh house at each end).
- `shot-blast1-mid.jpg`: 2.5 s after one TNT on a timber post at the joint of the left and middle sections.
- `shot-blast1.jpg`: after that blast: two sections have folded and their tiled roofs lie whole behind the arcade; the arcade and the weigh houses stand.

## Fixes made on the way (also in LEARNINGS §5)
1. Run A: the fair player won in one wave (17 s), because nothing heavy was left over. Fix: the tiled roofs are heavy pieces that count until cracked (`hard7t`).
2. Materials probe: a TNT on a timber post did nothing (1 %), because 10 posts held each section up. Fix: the tip rule on the sections, 8 posts each, narrower sections (6 m), and a slightly weaker timber (`g7post`, hp 20).
3. Heavy slate caps on the weigh houses: they fell outward off the screen, so the fair player stalled at 83–84 % with 26 TNT left. Fix: plain light roofs on the weigh houses, and a heavier tiled roof on the hall.

## Open points for Khai
- Budget 19 TNT, spare 2–5.
- The arcade hides the timber posts at the foot, but the upper posts and the clerestory show above it. A player can bomb the timber over the arcade; the shield slows a player down, it does not lock anything.
- "Roofs still count" is the third use of "heavy pieces still count" in Chapter 1 (E01, E03, E04; E02 and E06 also have heavy pieces). It is what keeps one blast from winning on these easy levels. Khai may want a different second read later in the pack.
- The fail line "Wood falls easy. Brick chips. Roofs still count." is the only text.

## SLOTS-50 (23/11, D-blast-L50 / D-blast-LAUNCH / D-blast-PAD): play slot 3

Converted: brick arcade → timber stall row (g7arcade mat wood), weigh houses dropped (tutorial budget, pad), glass clerestory → boarded timber (clere), tiled roof hard7t → plain g7tile, no drop7, one blast, 6 TNT (K2).

| | |
|---|---|
| Elements before | wood, brick, glass, heavy roof, steps, drop7 |
| Elements after (read from the built level) | wood |
| Bar | tutorial (slot 1-3): oneBomb < 70 %, the expert plan wins in one blast with >= 1 spare, fair 3/3; bot spare, allFoot, footOnly, time reported |
| TNT | **6** |
| Expert plan (`sol`, one blast) | WIN 89 % (5 TNT) |
| fair, 3 seeds | 3/3 · spare 0/0/0 · blasts 1/1/1 · 13/13/13 s |
| oneBomb / lazy | 62 % / 100 % |
| allFoot / footOnly / oneWave | 25 % / 25 % / 90 % |
| curve (n TNT at the main foot: %) | 1:35 2:19 3:30 4:30 6:51 8:55 12:65 (max jump +21) |
| at rest (8 s) | 0 dead, 0 moved, bonds 421→421 |
| pad (D-blast-PAD) | lot centred on (0, 0), farthest corner 12.1 m (pad 15.55 m today, ~18.7 m widened) |
| verdict | **PASS** · reported: est 13/13/13 s; fair bot spare 0 (the bot spends 3 a building a blast: tutorial bar = the expert plan keeps 1 of 6, OLD-POLISH O01 precedent) |

Gate: `gate.mjs` (one Chrome session, test build on main's 31-polish base, `results-slots50.json`, 2026-11-23T16:37 UTC). Shots: `shot-open.jpg`, `shot-blast1-mid.jpg`, `shot-blast1.jpg` (the expert plan / first blast) (393 × 852, test build).
