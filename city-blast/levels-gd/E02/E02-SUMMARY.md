# E02 "Shot Tower": result (Normal, TEACH, 23 TNT): PASS on the easy-pack bars except the curve (Khai to decide)

| Step | Result | File |
|---|---|---|
| 1. GD spec | lesson, shape, roles, wow, realization | `1-GD-SPEC.md` |
| 2. Figma | **skipped in this run** (the Lead handles Figma separately) | — |
| 3. Builder | `g7shot` (shot tower: 8 RC legs clad in brick under the tip rule with a 2 s hinge, corbelled arch heads between the legs; a tapering square shaft of RC posts and brick walls with slit windows, quoins and string courses; four cast-iron shot hoppers inside and a shot cistern in the lantern (`hard7v`); a gallery with a white rail, a glazed octagonal lantern, a copper cap and a vane) and `g7gshed` (timber goods shed: posts, board walls, loading doors, a glazed hoist dormer, a slate roof body, a loading platform with crates) in `pipeline7/engine.js` | `make-level.mjs` → `level.json` |
| 4. Tester | `run.mjs` PASS twice: run A3 (the tester picked 23) and run B (`tntStart` 23) | `results.json` (run B) |

## Numbers

| Test | Bar | Run A3 | Run B (23 fixed) |
|---|---|---|---|
| oneBomb (best of 18) | < 70 % | 9 % | 9 % |
| lazy (4 at the tower foot) | — | 54 % | 54 % |
| allFoot | < 80 % | 67 % | 67 % |
| footOnly | < 80 % | 71 % | 71 % |
| oneWave | reported only | 65 % | 65 % |
| fair, 3 seeds | 3/3 | WIN ×3 | WIN ×3 |
| spare TNT | ≥ 2 | 4 / 5 / 5 | 5 / 4 / 6 |
| blasts | ≥ 2 | 4 / 3 / 3 | 3 / 4 / 3 |
| estimated time | 20–75 s | 55 / 45 / 45 s | 45 / 55 / 44 s |
| fair, open probe (40 TNT) | — | 20 used, 4 waves, 88 % | |

- **Curve** (n bombs on the tower foot, one blast; % / collapse): 1: 2/2 · 2: 56/88 · 3: 65/90 · 4: 60/87 · 6: 64/90 · 8: 56/88 · 12: 56/88. **The jump 1 → 2 is +54, over the 40-point bar.** The tester's first two foot charges are two legs side by side, so the tower lies down: that topple is the lesson itself. Keeping it under 40 would take heavy pieces worth about 45 % of the mass (roughly +8 TNT of clean-up). Khai decides (see LEARNINGS §5).
- **Direction probe** (two legs on one face, one blast, then 14 s; % / where the top went / what is down):
  - towards shed C: 56 %, top +33.6 m in x, tower 100 % and shed C 100 % down;
  - towards shed B: 63 %, top −29.7 m, tower 100 % and shed B 100 % down;
  - front (the habit): 56 %, top +34 m towards the camera, both sheds still standing (5 % and 1 %).
  The tower always falls towards the face that was opened. The score after that one blast is about the same either way: a tower lying on shed rubble counts half until it is cleared. The difference shows in the next waves: a front fall leaves two whole sheds to clear, a side fall leaves one.
- **Build:** 243 counted members (tower 133, sheds 55 each). Nothing moves or breaks at rest after 8 s. Hard pieces (hoppers and cistern) are 26 % of the mass.

## Screenshots
- `shot-open.jpg`: opening frame (the tower between the two goods sheds).
- `shot-blast1-mid.jpg`: 2.5 s after two TNT on the right-hand legs (middle and front corner): the tower leans over shed C.
- `shot-blast1.jpg`: after that blast: the tower lies along shed C, which is flat; the hoppers lie in the rubble; shed B stands.

## Fixes made on the way (also in LEARNINGS §5)
1. Run A: one TNT on a shaft wall dropped the tower (62 %), and allFoot, footOnly and oneWave were all over 80 %. Fix: RC posts in the shaft (a wall bomb takes a panel only) and heavy hoppers plus a cistern (26 % of the mass).
2. Direction probe: the sheds were not crushed. `hit7` makes a falling body break what it lands on, and the first try set `armor: 0`. The engine reads that as 0.97, which made the sheds TNT-proof, so run A2 passed with sheds no bomb could break. Fix: `armor: 0.001`. Runs A3 and B were done after the fix.

## Open points for Khai
- **Curve 1 → 2 = +54** (see above): accept it for the levels that teach tipping, or add heavy pieces.
- Budget 23 TNT, spare 4–6. E01 has 19; 23 is high for slot 6, because the blind player opens the front, the cheap fail, and then has two sheds to clear. A person who aims needs fewer.
- The fail line "Neighbouring legs tip it. Heavy pieces still count." is the only text.
