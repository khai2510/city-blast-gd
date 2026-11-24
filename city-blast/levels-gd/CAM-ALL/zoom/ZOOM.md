# CAM-ZOOM: fit the buildings, not the whole pad (Agents-Game, 23–24/11, frame.js F9)

**Problem.** 49c23ba (CAM-ALL + PAD, F7/F8) sized the one distance so the WHOLE ×1.2 sand pad (≈ 64 m across) stayed on screen on every face and through the 45° turn: camera ≈ 2× farther (median 2.04×), buildings small and hard to tap. Khai's rule D-blast-PAD only asked: pivot = pad centre; buildings stand inside the pad; pad a bit wider.

**Change (`src/main/frame.js`, F9).** On a level whose pivot is the pad centre (every non-hard non-boss level, and Big Bow), the one distance now fits the **buildings**: every member that counts (target, neighbours, protected blue ones, their dress), seen from the pad-centre pivot held at the middle of the screen across, over all 4 faces × the idle sway × the front → 45° turn, inside 16 px of each side and 90% of the play height (between the HUD row and the tray). The pad edge may run off the screen. Unchanged: pad-centre pivot, pad ×1.2, front-on start, 1 s zoom-in from 1.22×, then the 45° turn, one distance for the 4 faces, hard levels H1–H5 (F4), Lift Bridge / Sky Steps (lot-centre pivot), the R22 re-frame, every flag (`?cam45=0`, `?pad=0`, `?padk=`, `?camall=0`, `?camhard=0`). **New flag `?camfit=pad`** = the 49c23ba whole-pad framing.

Also: a touch during the 45° turn now stops the view where it **is** (the engine damps `yaw` and lags the turn by up to ~15°; before, the view kept turning after the touch, twice as far on screen with the closer camera). Found by check-sflay SF4 (L1 double-tap lesson).

## Distance, all 51 slots (`check-camhard.js all`, 393 × 852)

pre = this build with `?camall=0` (the camera before CAM-ALL, on today's levels); whole-pad = the 49c23ba numbers in `../CAM-ALL.md` §3.

- vs camall0 (pre CAM-ALL) non-hard: median 1.05 range 0.75-1.94 n=46
- vs whole-pad (CAM-ALL.md) non-hard: median 0.50 range 0.31-1.00 n=46
- Within 0.75–1.15× of pre: 36 of 46 non-hard slots. Above 1.15×: the untouched old levels (Grand Arch 7, Dome Hall 11, Doorstop Corner 22, Glass Point 23, Tock Yard 27, Dome Works 29, Old Tock Row 32, Shell Hall 35, Deco Needle 37) and Harbour Crane 40. Before CAM-ALL these opened on a hero close-up (sflay S6, pitch 6.9°, part of the lot off screen, distance re-fitted per face) and their lots sit 3–9 m off the pad centre, so holding every building round the pad-centre pivot on 4 faces costs more. Doorstop Corner (1.94×) also has buildings up to 13.8 m outside the pad (check-pad). Below 1.0×: Boiler Stack 9 (0.75), Rail Terminus 26, Fire Station 15, Big Bow 49: F6 used to centre the main building, which cost width.
- Hard 14 19 34 39 44: opening yaw / D identical to pre (188.2, 117.2, 172.4, 266.0, 149.6). The run marks 14, 39, 44 FAIL on face distances (Canal Row faces 2/4 226.4 → 240.3, the others ≤ 3 m): the hard code path is not touched by F9; these are face reads 3 s after a swipe while the engine's per-face distance is still damping on the loaded software-GL harness (the same check reads other values again on each run, see `../CAM-ALL.md` §3).
- Every non-hard slot: PASS (jump 1.00, start front-on, no turn in the zoom-in, ends 45° ± 4.5°), camera never inside, lot inside the play rect (topmost building pixel y 141 > HUD bottom 111; lowest 632 < tray top 660).

## Other checks (this build, 393 × 852, software GL)

- `?camfit=pad` (slots 3, 20, 46): D 244.7 / 243.0 / 243.0 = the 49c23ba whole-pad numbers; 3 PASS.
- loadcheck ok=true, 0 errors. check-order PASS. check-pad: same 3 violations as before (L14 L22 L39), 0 page errors.
- check-r22: every item PASS except C1 (already failing on origin/main): the re-frame after a blast fills 0.294 of the height / 0.737 of the width (needs ≥ 0.45 / ≥ 0.90). F9 does not touch the R22 re-frame (it fits what remains on 4 faces, as before), so C1 is unchanged (origin/main 0.766 W).
- check-sflay: 15 PASS, SF4 (L1 double-tap lesson by script taps) flaky at 5–6 fps: full run FAIL, `ONLY=l1` runs on the final build 1 PASS (L1 won) / 2 FAIL, origin/main PASS. The closer camera draws more pixels (fewer frames) and moves the spotlight farther per degree while the opening still settles; the scripted tap (read the hand, wait 700 ms, tap) then lands off it. Partly fixed (a touch now stops the turn where the view is); left: the harness timing.
- Real taps (CDP touch), slots 3, 13, 46, 49: swipe 90° (≈ 48° → 134°), one TNT placed (19→18, 14→13, 26→25, 6→5), BLAST: plan → count → boom → settle → plan, % destroyed 9 / 18 / 4 / 1, 0 console errors.
- Strips (`L<slot>-strip.jpg`: first frame before / after, end of the turn before / after; before = origin/main fe31fe6): L46, L20, L8, L3, L24 (L24 Lift Bridge keeps its lot-centre pivot: unchanged).

| slot | level | kind | D pre-CAM-ALL (`?camall=0`) | D now | now ÷ pre | now ÷ whole-pad (49c23ba) | jump | check-camhard | inside | lot in play rect | lot box on screen (x0 y0 x1 y1) |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Ranger Lookout | O | 103.4 | 89.6 | 0.87 | 0.37 | 1 | PASS | no | yes | [146, 160, 348, 612] |
| 2 | Pit Head | O | 100.1 | 107.9 | 1.08 | 0.44 | 1 | PASS | no | yes | [93, 257, 374, 517] |
| 3 | Market Hall | E | 134.6 | 132.3 | 0.98 | 0.54 | 1 | PASS | no | yes | [53, 286, 347, 487] |
| 4 | Hop Kiln | O | 103.7 | 109.7 | 1.06 | 0.42 | 1 | PASS | no | yes | [107, 218, 374, 554] |
| 5 | Shot Tower | E | 156.8 | 157.1 | 1.0 | 0.65 | 1 | PASS | no | yes | [62, 205, 352, 569] |
| 6 | Gas Works | O | 109 | 118.4 | 1.09 | 0.48 | 1 | PASS | no | yes | [79, 278, 371, 494] |
| 7 | Grand Arch | old | 121.2 | 157.3 | 1.3 | 0.65 | 1 | PASS | no | yes | [22, 262, 342, 512] |
| 8 | Airfield Tower | O | 110.9 | 109.7 | 0.99 | 0.33 | 1 | PASS | no | yes | [112, 203, 373, 569] |
| 9 | Boiler Stack | E | 158.3 | 118.2 | 0.75 | 0.49 | 1 | PASS | no | yes | [64, 205, 307, 566] |
| 10 | Monorail Station | O | 90.4 | 89.6 | 0.99 | 0.37 | 1 | PASS | no | yes | [66, 283, 349, 490] |
| 11 | Dome Hall | old | 90.1 | 148.5 | 1.65 | 0.61 | 1 | PASS | no | yes | [94, 246, 372, 527] |
| 12 | Drive-in | O | 108.2 | 110.1 | 1.02 | 0.45 | 1 | PASS | no | yes | [78, 282, 364, 492] |
| 13 | Pier Pavilion | O | 106.1 | 108.5 | 1.02 | 0.44 | 1 | PASS | no | yes | [72, 251, 363, 523] |
| 14 | Watch Keep | H | 188.2 | 188.2 | 1.0 | 1.0 | 1.35 | FAIL | no | yes | [21, 225, 373, 548] |
| 15 | Fire Station | O | 147.6 | 123.8 | 0.84 | 0.51 | 1 | PASS | no | yes | [45, 230, 377, 542] |
| 16 | Valley Station | O | 132.9 | 152.4 | 1.15 | 0.62 | 1 | PASS | no | yes | [112, 289, 349, 484] |
| 17 | Floodlit Stand | O | 105.2 | 104.7 | 1.0 | 0.43 | 1 | PASS | no | yes | [109, 232, 349, 541] |
| 18 | Roadside Motel | O | 106.9 | 106.8 | 1.0 | 0.44 | 1 | PASS | no | yes | [39, 229, 321, 544] |
| 19 | Grand Stage | H | 117.2 | 117.2 | 1.0 | 1.0 | 1.12 | PASS | no | yes | [21, 184, 375, 588] |
| 20 | Needle Court | O | 110.8 | 124.1 | 1.12 | 0.31 | 1 | PASS | no | yes | [91, 210, 370, 565] |
| 21 | Bathhouse | E | 95.7 | 109.2 | 1.14 | 0.45 | 1 | PASS | no | yes | [65, 272, 377, 501] |
| 22 | Doorstop Corner | old | 172.3 | 333.9 | 1.94 | 0.99 | 1 | PASS | no | yes | [74, 238, 352, 533] |
| 23 | Glass Point | old | 134.5 | 158.1 | 1.18 | 0.65 | 1 | PASS | no | yes | [17, 251, 321, 518] |
| 24 | Lift Bridge | boss | 149.7 | 169.1 | 1.13 | 1.0 | 1 | PASS | no | yes | [40, 242, 355, 531] |
| 25 | Tram Depot | E | 147.7 | 149 | 1.01 | 0.61 | 1 | PASS | no | yes | [55, 283, 338, 490] |
| 26 | Rail Terminus | E | 144.8 | 117.9 | 0.81 | 0.48 | 1 | PASS | no | yes | [73, 269, 374, 503] |
| 27 | Tock Yard | old | 101.9 | 137.5 | 1.35 | 0.57 | 1 | PASS | no | yes | [58, 191, 285, 581] |
| 28 | Rivet Depot | O | 112.8 | 126.5 | 1.12 | 0.52 | 1 | PASS | no | yes | [81, 238, 374, 534] |
| 29 | Dome Works | old | 90.1 | 148.5 | 1.65 | 0.61 | 1 | PASS | no | yes | [90, 246, 372, 528] |
| 30 | Car Park | O | 120.2 | 112.1 | 0.93 | 0.46 | 1 | PASS | no | yes | [64, 271, 351, 501] |
| 31 | Library | O | 105.9 | 116.6 | 1.1 | 0.48 | 1 | PASS | no | yes | [91, 259, 368, 515] |
| 32 | Old Tock Row | old | 101.9 | 161.3 | 1.58 | 0.67 | 1 | PASS | no | yes | [62, 210, 308, 562] |
| 33 | The Bullet | old | 105.9 | 121.5 | 1.15 | 0.5 | 1 | PASS | no | yes | [80, 149, 356, 625] |
| 34 | Glass Spine | H | 172.4 | 172.4 | 1.0 | 1.0 | 1.06 | PASS | no | yes | [19, 177, 375, 593] |
| 35 | Shell Hall | old | 96.7 | 126.3 | 1.31 | 0.52 | 1 | PASS | no | yes | [25, 251, 351, 519] |
| 36 | Star Dome | E | 90.9 | 90.3 | 0.99 | 0.37 | 1 | PASS | no | yes | [51, 263, 359, 511] |
| 37 | Deco Needle | old | 152.8 | 177.7 | 1.16 | 0.74 | 1 | PASS | no | yes | [135, 160, 355, 615] |
| 38 | Sky Saucer | old | 239.1 | 268.5 | 1.12 | 0.98 | 1 | PASS | no | yes | [73, 146, 320, 625] |
| 39 | Canal Row | H | 266 | 266 | 1.0 | 1.0 | 1.62 | FAIL | no | yes | [20, 290, 374, 484] |
| 40 | Harbour Crane | O | 101.8 | 122.2 | 1.2 | 0.5 | 1 | PASS | no | yes | [94, 270, 376, 501] |
| 41 | The Pencil | O | 108.6 | 108.1 | 1.0 | 0.45 | 1 | PASS | no | yes | [40, 201, 349, 578] |
| 42 | Tube Bundle | O | 109.1 | 112.7 | 1.03 | 0.47 | 1 | PASS | no | yes | [78, 242, 366, 531] |
| 43 | The Splinter | O | 109.1 | 113 | 1.04 | 0.47 | 1 | PASS | no | yes | [87, 204, 364, 570] |
| 44 | Five Eaves | H | 149.6 | 149.6 | 1.0 | 1.0 | 1.12 | FAIL | no | yes | [20, 215, 374, 556] |
| 45 | Stack Tower | O | 112.1 | 125.2 | 1.12 | 0.52 | 1 | PASS | no | yes | [83, 246, 373, 525] |
| 46 | Grain Elevator | E | 93.6 | 90.9 | 0.97 | 0.37 | 1 | PASS | no | yes | [59, 144, 351, 630] |
| 47 | Sister Spires | old | 150.9 | 166.8 | 1.11 | 0.7 | 1 | PASS | no | yes | [102, 141, 280, 632] |
| 48 | High Cistern | E | 86.2 | 86.6 | 1.0 | 0.35 | 1 | PASS | no | yes | [46, 210, 362, 563] |
| 49 | Big Bow | boss | 171 | 147.7 | 0.86 | 0.73 | 1 | PASS | no | yes | [29, 243, 340, 530] |
| 50 | Long Legs | E | 155.2 | 153.2 | 0.99 | 0.63 | 1 | PASS | no | yes | [70, 241, 341, 532] |
| 51 | Sky Steps | boss | 193.2 | 179.6 | 0.93 | 1.0 | 1 | PASS | no | yes | [87, 146, 307, 626] |
