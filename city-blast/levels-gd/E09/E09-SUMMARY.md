# E09 "High Cistern": result (Normal, TEACH, 20 TNT): PASS on the easy-pack bars

| Step | Result | File |
|---|---|---|
| 1. GD spec | lesson, shape, roles, wow, realization | `1-GD-SPEC.md` |
| 2. Figma | Figma-style sheet from the game (opening + the lesson in four frames, 393 × 852) | `E09-sheet.jpg` |
| 3. Builder | `g7cis` (square brick water tower: 3 storeys, brick legs on the ground storey, RC-in-brick posts `g7bk` and walls `g7bkw` above, round-headed windows, pilasters, string courses, an iron gallery; the riveted cistern `hard7v` on a 1.6 m stand of 4 steel legs, with a conical roof, ladder, float gauge and painted band as decor) and `g7pump` (brick pump house, arched windows, slate roof body with a ridge vent, iron stack, flywheel inside) in `pipeline7/engine.js` | `make-level.mjs` → `level.json` |
| 4. Tester | runs r2–r4b (base: main's `31-polish.html`, `CB_LIBS`): PASS every easy-pack bar; `run.mjs` PASS (oneWave 71 % too) | `results.json` (run r4b) |

Hero position (for a later camera preset): part A at x 0, z 0; tower 6 m square, top of the cistern ≈ 19.5 m. Lot ≈ 21.6 × 13 m (pump houses at x ± 7.8).

## Numbers (run r4b, `tntStart` 20)

| Test | Bar | Result |
|---|---|---|
| oneBomb (best of 18) | < 70 % | 14 % |
| lazy (4 at the tower foot) | — | 32 % |
| allFoot | < 80 % | 73 % |
| footOnly | < 80 % | 73 % |
| oneWave | reported only | 71 % |
| fair, 3 seeds | 3/3 | WIN × 3 |
| spare TNT | ≥ 2 | 4 / 3 / 4 |
| blasts | ≥ 2 | 3 / 4 / 3 |
| estimated time | 20–75 s | 39 / 47 / 40 s |
| fair, open probe (40 TNT) | — | 16 used, 4 waves, 95 % |

- **Curve** (n bombs on the tower foot, one blast; % / collapse): 1: 6/6 · 2: 38/73 · 3: 52/88 · 4: 44/79 · 6: 51/86 · 8: 58/87 · 12: 48/81. Biggest jump +32 (1 → 2). The ceiling (≈ 50–58 %) is the cistern: it lands whole and still counts.
- **Lesson probe** (one level load, three blasts):
  1. 3 TNT on the cistern up high: **0 %**, nothing in the tower breaks, the cistern stays at 15.3 m (drop7 armor 0.97, and the steel stand keeps the bombs 1.6 m clear of the top storey).
  2. Tower feet (3 TNT): the tower folds, the cistern crashes down through it and lands whole: 34 %.
  3. **One TNT on the fallen cistern: 61 %** (+27, the cistern alone). The pump houses are the easy finish.
- **Look checks:** 84 members, nothing moves or breaks at rest in 8 s, 0 bonds cracked (`__blast.m14.breaks()`); no floating roof (every roof is a member, decor inside its outline); camera sweep 4 views × 4 zooms × 3 pans = 48 poses, **0 inside a building**. Hard pieces (the cistern) are 27 % of the mass.

## Screenshots
- `shot-open.jpg`: opening frame at 393 × 852.
- `shot-blast1-mid.jpg`: the tower giving way under the cistern.
- `shot-blast1.jpg`: the cistern lying whole in the heap.
- `E09-sheet.jpg`: the five-frame sheet (opening, bombs up high do nothing, the drop, the landing, the crack).

## Fixes made on the way
1. Run r1/r2: three TNT on the cistern up high wrecked the top storey (brick posts within the 3.8 m TNT reach), the cistern dropped 2–3.6 m and became crackable: the lesson broke. Fix: RC-in-brick posts above the ground storey (`g7bk`, as E06's shaft) and a 1.6 m steel stand under the cistern. Now 0 %.
2. The cistern member was square and wider than its drawn drum (it read as a box). Fix: a 3.3 m member inside a 4.6 m riveted drum (decor).
3. Lot compacted to ≈ 22 m wide (Lead 22/11: easy lots ≤ ≈ 24 m, similar width and depth).

## Open points for Khai
- Budget 20 TNT, machine spare 3–4 (middle of the Normal band).
- The fail line "Bring the heavy piece down first. Then crack it." is the only text.
