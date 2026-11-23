# HOVER-1123: buildings that hover after their legs are gone (L47 Star Dome E05, L49 Grain Elevator E08)

Tester U-4 (feedback 23/11, shots-user 11 and 14). Group A level bug, easy pack only. Slot map (`release/g7-easy-levels.json`, order in
`src/g7hard/export-easy.js`): 46 = E06, **47 = E05 Star Dome**, 48 = E07, **49 = E08 Grain Elevator**, 50 = E09. U-4's "L49" is E08, not E09.

## Cause

| Level | What the player saw | Why |
|---|---|---|
| E05 Star Dome (L47) | every ground-storey post gone, the upper drum and dome stay up (38 %) | the telescope pier (`hard7p`, hidden inside) ran up to the dome's underside (`coreGap` 0). With the ground storey gone the dome rests on the pier, and the upper drum hangs from the dome by its bonds. The player cannot see the pier, so the dome floats. |
| E08 Grain Elevator (L49) | five TNT on the legs, the head house stays up on "one thin post" (16 %); a silo loses its bottom drum and stays up | the 4 middle piers were plain `rc` (one TNT), the corners `hrc` (three). One blast on the legs killed the middles and left the corners cracked, the TNT next to a middle pushing them to stage 2 (rebar cage shown). The house then stands on cages, which read as "legs gone". Silo: the drums above a broken bottom drum dropped ~1.7 m and stayed leaning on the next silo (concrete `shatter` 9 m/s: they never broke). |

## What changed (surroundings / supports only; the hero looks the same at rest: see the `*-open-*` shots)

| Level | Change | File |
|---|---|---|
| E05 | `coreGap` 0 → **1.2 m**: the pier stops short of the dome, so the dome and upper drum come down with the ground storey; the lower pier stays standing in the open (the core, still counted, now in sight). TNT 22 → **23**. | `E05/make-level.mjs` → `level.json` |
| E08 | middle piers `rc` → **`hrc`** (same tint, no stage decor): one blast never leaves the house on cracked corners with its middles gone; two blasts on a face drop it that way. Silo drums `shatter` 9 → **2.5 m/s** (per member): a drum that drops breaks, no silo left leaning. TNT 20 → **26**. | `E08/make-level.mjs` → `level.json`; builder options `midKey` (g7elev) and `shatter` (g7silo) in `pipeline7/engine.js`, default off, used by E08 only |

Release data: `node src/g7hard/export-easy.js` (only the E05 and E08 rows changed).

## The hover, before and after (one blast, pipeline7 test build on main's `31-polish.html`)

| Probe | Before | After |
|---|---|---|
| E05: one TNT on each of the 12 ground posts | 31 %, part A top 11.1 m of 11.2 (dome up on the hidden pier) | **49 %**, top 4.4 m: dome and drum down, the lower pier stands in the open |
| E08: five TNT on legs 3 5 8 7 6 (U-4) | 5 %, middles dead, corners at stage 2 (cages), house up | 7 %, no pier dies (middles carry), corners chipped; the silo hit loses all three drums (no leaning silo) |
| E08: the same front row again, second blast | — | **54 %**, the head house falls forward |

## Easy-pack gate (`run.mjs`, LEVEL_JSON = E05 + E08, same base and session for both columns; curve = `curveprobe.mjs`)

| Metric (bar) | E05 before | E05 after | E08 before | E08 after |
|---|---|---|---|---|
| oneBomb (< 70 %) | 14 % | 14 % | 6 % | 6 % |
| lazy, 4 at the foot | 10 % | 10 % | 3 % | 1 % |
| allFoot (< 80 %) | 54 % | 59 % | 76 % | **30 %** |
| footOnly (< 80 %) | 67 % | 68 % | 78 % | 76 % |
| oneWave (reported only) | 98 % | 93 % | 76 % | 77 % |
| budget the fair player needs (tntStart was 22 / 20) | 25 | **23** | 20 | **26** |
| fair 3 seeds (3/3) | WIN 3/3, spare 7/8/6 | WIN 3/3, spare 5/4/3 | WIN 3/3, spare 5/7/2 | WIN 3/3, spare 3/4/3 |
| blasts (≥ 2) | 5 / 6 / 3 | 3 / 7 / 4 | 4 / 3 / 5 | 5 / 5 / 5 |
| est. time (20–75 s) | 63 / 71 / 46 s | 45 / **82** / 56 s | 45 / 37 / 57 s | 62 / 63 / 62 s |
| curve, n TNT at the main foot, one blast (jump ≤ 40) | 6 11 17 21 26 31 31 (max +6) | 6 11 17 22 **49** 48 49 (max +27, at 6) | 0 3 4 5 6 15 15 | 0 2 3 3 3 13 13 |
| verdict | FAIL on oneWave only (easy: reported) | same | PASS | PASS |

The pack's bots are what the brief calls expert / sensible / naive: `fair` (screen taps only, 3 seeds) is the sensible player, `oneBomb` /
`lazy` / `allFoot` / `footOnly` / `oneWave` are the naive plans.

## Checks

- At rest (main build `w-hover.html?debug=1`, slots 47 and 49): 0 members move or die in 8 s, **0 bonds cracked** (`__blast.m14.breaks()` = []); openings unchanged (shots).
- Main build `w-hover.html`: loadcheck ok=true, 0 errors.
- Hard levels untouched: the two engine edits are options of the E08 builders `g7elev` / `g7silo` (default = old behaviour) and no other
  level uses those builders. Main build before / after, L20 Grand Stage (H3) and L30 Watch Keep (H2): member signature identical, and the
  deterministic charge plans identical (L20 allFoot 50 / lazy 30 / footOnly 35; L30 28 / 3 / 68); openings match (`L20-hard-unchanged.jpg`).

## Open points (not changed here)

- E08 now wants 26 TNT (was 20) and five blasts from the fair player: the head house falls on the second blast on a face, not the first.
  If that is too slow for an easy slot, the lever is the budget, not the tier.
- E05 seed 2 took 7 blasts / 82 s (bar 75 s); seeds 1 and 3 45 / 56 s. A fresh-session probe once left the fair player stuck behind the
  fallen dome at 79 % with `coreGap` 0.6; 1.2 won 3/3 fresh and in the gate.
- GD-78 (E06 at 46 before its teach E05 at 47): the order is `EASY` in `src/g7hard/export-easy.js` with PLACE in `g7hard/patch.js`; a swap
  moves save entries and the order audit, so it is a Lead placement call, not done here.
- GD-79 (E10 finale is the easiest of the pack, 14 TNT, naive 91.5 %): noted for the re-placement of the E levels; not changed.

Shots: `E05-open-before-after.jpg`, `E05-ground-posts-before-after.jpg`, `E08-open-before-after.jpg`, `E08-five-legs-before-after.jpg`,
`E08-front-row-second-blast-after.jpg`, `L20-hard-unchanged.jpg` (430 × 932 headless, left = before).
