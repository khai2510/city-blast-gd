# L1TWIN "Twin Mills": Level 1 as two identical windmills (Khai D-blast-L1TWIN, 28/11/2026)

Khai: "Level 1 cái tòa thì ok rồi, nhưng cái nhà bên cạnh nó bị thừa thãi quá. Nếu mục tiêu là chỉ cho user chơi, thì nên tạo hai
cái cối xay gió giống y chang nhau, rồi hướng dẫn user đặt nổ một quả bom, xong user tự chơi cái còn lại với số lượng bom còn lại."

Play slot 1, replaces O01 "Ranger Lookout" (lookout + woodshed) in place: same slot, save, seed, hand and lesson marks.
`?oldlv=1` still gives the oldest L1. O01's folder stays in the repo, no longer wired.

## Level sheet (game-designer template)

```
L1 Twin Mills          district: 1   tier: T
Idea (≤6 words):       watch one fall, drop the other
New element:           wood (TNT, double tap)   stage: teach
Elements active:       wood
Naive move:            a TNT high on the second mill → only what is above it comes down (40–78 %), visibly not enough
Trick / aha:           the same leg as the one the hand showed; learnable from the screen: yes (the twin just fell that way)
Telegraphing:          the two mills are the same building; the first one is the worked example
Tip:                   none (L1 = hand only, 0 words); fail line = the existing "A post holds a building up. Hit the posts."
Tolerance:             expert 98.1 % (+13 over 85 %)
Payoff moment:         the mill tips forward on its trestle, sails and cap go last
```

## What was built

- **Builder `g7oMill`** (`pipeline7/engine.js`, block "g7 OLD POLISH", Agents-Game's): a timber smock mill on an open trestle.
  Four 1 m legs (wpost) on stone footings with X-braces · a stage with a white rail and a ladder · four boarded storeys that step in
  0.2 m each, dressed with weatherboards that thin out upwards (the taper), white windows, a red door · a dark domed cap · wind
  shaft, hub and **four** lattice sails with cream cloths · tail pole. 42 members a mill (20 wpost, 16 wwall, 5 mdW, 1 g7roofL),
  everything else decor on its member. Wood only. No logo, no text, no real building, no other game's art. `syaw` turns the sails.
- **Level data** `make-level.mjs` → `level.json` → `release/g7-old-levels.json` through `src/g7hard/export-old.js` (its `DONE` list:
  `O01` → `L1TWIN`; only slot 1's entry changed in the release file). Two calls of the same builder with the same numbers, at
  (−4.8, +4.8) and (+4.8, −4.8): the opening camera stands at 45° (frame.js, D-blast-PAD), so the mills are side by side on screen
  at the same depth, 13.6 m apart, sails turned to face the view. Footprint radius 12.9 m, pad edge 28.7–32.2 m: `check-pad` 0 out.
- **Rules:** both mills carry the existing BASE `weak-tip` + `shove 2.5` (as O01's lookout): one leg gone and the mill lies down
  towards that leg. Base score (mass 60 % + standing height 40 %): one mill down = 27 %, both = 98 %. 4 TNT (tier T: 4–6).
- **No new text, rule, button or screen.** The lesson is the existing one (tap2.js H1 / TUTORIAL v2), aimed by `sol[0]` at the
  front-left leg of the left mill.

## Flow, as played by real taps (fresh profile, 393 × 852)

1. Opening: both mills in frame. Dim + gold spotlight + hand on mill A's front-left leg, "Double-tap!". A tap outside the spotlight
   is swallowed and nudges (UX-118: blocked 1, placed 0, nudge 1).
2. Tap = 1 TNT on that leg; the label turns "Double-tap the TNT!"; the double tap blasts. Mill A falls away from mill B.
3. The lesson is marked done at that blast: no dim, no hand, no label. The camera settles on mill B. 27–30 % on the meter.
4. Mill B, alone: a double tap on a leg = 1 TNT + blast. It falls: CLEARED! + fireworks (FX28), then +10 (not over CLEARED!), Home.

TNT: the lesson as labelled spends 2 (the double tap on the TNT stacks one more before it blasts: existing STACKOK behaviour) and
leaves 2 for mill B; a player who double-taps the leg straight away spends 1 and has 3 left. L1 has no BLAST button (D-blast-TAP2),
so "guides to BLAST" is the lesson's second step, the double tap.

## Numbers (build sources `50ff1d1ae36f`)

| Check | Result |
|---|---|
| First-timer run, real taps (`fresh.js`, 5 fresh profiles) | **5/5**: lesson shown, 1 TNT placed, mill A down (28.4–30 %), no hand / dim on B, B down with 1 TNT, win 98.4–100 %, save.level 1, 0 page errors |
| Determinism R-11 (`levels6/tools/determinism-check.js`, slot 1, plan `solW` = A's leg, then B's leg) | **identical**: seq 5/5 · after 5/5 · fresh 5/5 · wait 5/5 · raf 5/5 · live cold 1/1 · live warm 1/1 · 98.144 % `5d82850d` |
| Same plan 5× + after a reload (`bots.js det`) | identical: after A 26.636 % `0c5e1cc3@599`, mill B's bonds 174 → 174; after B 98.144 % `5d82850d@936` |
| At rest 8 s (`bots.js rest`) | 84 members, bonds 348 → 348, 0 dead, 0 moved |
| Sensible on B: 1 TNT on any leg, any face (16 plans) | **16/16** win, 95.5–98.1 % |
| Naive on B: 1 TNT on each member, the two faces in view (84 plans) | 26/84 win: legs 8/8, the trestle deck 2/2, first storey over the stage 16/18, **higher up 0/56** (storey 2: 58–78 %, 3: 47–60 %, 4: 41–53 %, cap 40 %) |
| Pad (`check-pad.js` slot 1) | ok, 0 members out |

A TNT high up brings down what is above it and no more: the lower the hit, the more falls. So the second mill is not automatic,
and a miss costs one TNT of the two or three left.

## Standard checks

See the status block at the end (filled in after the merge with main).

## Files

- `city-blast/pipeline7/engine.js`: + `V5_PARTS.g7oMill` (inside the Agents-Game "g7 OLD POLISH" block; no `g7…` block of the Mac touched)
- `city-blast/levels-gd/L1TWIN/`: `make-level.mjs`, `level.json`, `bots.js`, `fresh.js`, `shots/`, this file
- `city-blast/release/g7-old-levels.json`: regenerated by `export-old.js` (slot 1's entry only)
- `src/g7hard/export-old.js`: `DONE[0]` `O01` → `L1TWIN`
- `src/main/check-sflay.js`: SF4 assert only (below)

## Shots (`shots/`)

`1-opening` (lesson already done: the plain opening) · `2-guided-spotlight` · `3-guided-blast` (1 TNT down, "Double-tap the TNT!") ·
`4-mill-A-falling` · `5-mill-A-down-B-alone` · `6-mill-B-falling` · `7-win` (CLEARED! + fireworks, a frame of the video).
Video of the whole run (outside the repo): `/home/user/wt/l1twin-out/L1TWIN.mp4` (392 × 852, 69 s, headless frame rate).

## For Khai (not built: needs a decision)

- **Level name "Twin Mills"**: data only (the game shows "Level 1"). Say if another name is wanted.
- **Words on the second mill**: none were added. If a line is wanted there, it is a new text (proposal: "Your turn!").
- **TNT 4**: the labelled lesson leaves 2 for mill B. 5 would leave 3 on every path.
