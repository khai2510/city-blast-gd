# E08 "Grain Elevator": result (Normal, TEACH, 20 TNT): PASS on the easy-pack bars

| Step | Result | File |
|---|---|---|
| 1. GD spec | lesson, shape, roles, wow, realization | `1-GD-SPEC.md` |
| 2. Figma | Figma-style sheet from the game (opening + the lesson in four frames, 393 × 852) | `E08-sheet.jpg` |
| 3. Builder | `g7elev` (concrete head house: an open drive-through on 8 piers, **corners `hrc`** (L32 RC tier, `rcDecor` crack stages, damage stays), middles `rc`, tip rule with a 2 s hinge; 5 storeys of RC posts and panel walls with small windows and pilasters; a cupola with a window band and a light slate roof; a spout; two heavy garner bins inside (`hard7v`, in the top storey and the cupola)), `g7silo` (2 × 2 silos, each a stack of 3 hollow concrete drums `g7silo`, own bond group, conveyor gallery as decor) and `g7weigh` (brick weigh house with a timber office, weighbridge) in `pipeline7/engine.js` | `make-level.mjs` → `level.json` |
| 4. Tester | run r6 (base: main's `31-polish.html`): PASS every bar, `run.mjs` PASS (oneWave 76 %) | `results.json` (run r6) |

Hero position (for a later camera preset): part A (head house) at x −1.3, z 0, 6.4 × 6.4 m, ≈ 27 m to the cupola ridge; silos at x 7.2, weigh house at x −8.5. Lot ≈ 22 × 13 m.

## Numbers (run r6, `tntStart` 20)

| Test | Bar | Result |
|---|---|---|
| oneBomb (best of 18) | < 70 % | 6 % |
| lazy (4 at the head-house foot) | — | 3 % |
| allFoot | < 80 % | 76 % |
| footOnly | < 80 % | 78 % |
| oneWave | reported only | 76 % |
| fair, 3 seeds | 3/3 | WIN × 3 |
| spare TNT | ≥ 2 | 3 / 3 / 3 |
| blasts | ≥ 2 | 3 / 4 / 4 |
| estimated time | 20–75 s | 42 / 49 / 50 s |
| fair, open probe (40 TNT) | — | 17 used, 4 waves, 87 % |

- **Curve** (n bombs on the head-house foot, one blast; % / collapse): 1: 0/0 · 2: 3/3 · 3: 4/5 · 4: 5/6 · 6: 6/7 · 8: 15/20 · 12: 15/20. Biggest jump +9. One bomb per pier never drops it: the corners need repeated hits. (A low, even curve: the reward comes from blast to blast, see the probe.)
- **Lesson probe** (same corner, blast after blast):
  1. right-front corner (`hrc`) + right middle (`rc`), one TNT each: **5 %**, the head house stands on the cracked corner;
  2. the same corner again: **5 %**, rebar shows, it still stands;
  3. the same corner a third time: it breaks, the head house leans onto the silo row and lays it down: **61 %**.
  One TNT on all 8 ground piers in one blast: 11 %, it stands. "Cracked concrete stays cracked. Hit it again."
- **Look checks:** 149 members, nothing moves or breaks at rest in 8 s, 0 bonds cracked; roofs are members; camera sweep 48 poses, **0 inside a building**. Hard pieces (two bins) 19 % of the mass.

## Screenshots
- `shot-open.jpg`: opening frame at 393 × 852 (the base camera frames the lot a little tight on the right; see the Lead's camera note).
- `shot-blast1-mid.jpg`: the third hit on the corner: the head house leans onto the silos.
- `shot-blast1.jpg`: after that blast: silos and head house down, the bins whole in the heap.
- `E08-sheet.jpg`: the five-frame sheet.

## Fixes made on the way
1. Run r1: the silos were 61 % of the mass (solid concrete). Fix: hollow drums (`g7silo`, density 600).
2. Run r1/r2: footOnly 88–95 %: the corner lesson won by foot play alone. Fix: heavy bins that land whole (19 %).
3. Run r3: curve 8 → 12 bombs +42 (TNT on the back wall's panels cracked the back corners from the side). Fix: open drive-through (no ground-storey wall).
4. Run r4/r5: a heavy roof piece broke on landing (fell 24 m): allFoot 87 %. Fix: light roof, a second bin in the top storey instead.
5. Lot compacted to ≈ 22 m (silos in a 2 × 2 block).

## Open points for Khai
- Budget 20 TNT, machine spare 3.
- The curve is low and flat (max 15 % at 12 bombs in one blast): by design one blast cannot break an `hrc` corner pair; the gain comes over blasts.
- The fail line "Cracked concrete stays cracked. Hit it again." is the only text.
- **23/11 HOVER-1123 (U-4):** middle piers `rc` → `hrc` (one blast on the legs no longer leaves the house on cracked corners with its middles gone; two blasts on a face drop it), silo drums `shatter` 2.5 (no leaning silo). Budget 20 → 26. The lesson probe above (3 hits on one corner) is now 2 blasts on a face. Numbers: `../HOVER-1123/HOVER.md`.
