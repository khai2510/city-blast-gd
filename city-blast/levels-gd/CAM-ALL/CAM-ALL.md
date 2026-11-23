# CAM-ALL: the hard levels' opening camera on every level (Agents-Game, 23/11, D-blast-CAMALL)

Khai 23/11: "Sửa lại view camera cho tất cả các level hiện tại theo góc camera của level khó, nghĩa là đi từ góc chính diện trước rồi mới xoay qua góc 45."

## 1. What the hard levels actually do (measured, per frame)

Recorder: a `requestAnimationFrame` hook from the first game frame, reading `__blast.frame.measure()` (the engine's `yaw`, the pitch of the camera's view direction, D = camera distance) and `__blast.m14.cam()` (camera position), 393 × 852 touch. Builds: the main build before this change (`origin/main` 236a3ce), the Mac release `release/index-hard5-release.html` and the Mac test link CDNLd5gsjLaTaPGT7W4pes (a main build of 21/11: same `frame.js` F4).

| | main build L20 Grand Stage (H3) | main build L46 Boiler Stack (E06, CAM-HARD) | Mac release L37 Five Eaves (H1) / L39 Grand Stage |
|---|---|---|---|
| first frame | yaw 4.6°, pitch 5.8°, D 135.6 (zoom 1.20) | yaw 6.9°, pitch 5.8°, D 193.1 | yaw 0.0°, pitch 5.8°, D 110.8 / 94.5 |
| second frame on | pitch 14.9° (0.26 rad), held | pitch 14.9° | pitch 12 → 14.3° (ease), then 6.9° in planning |
| zoom-in | 1.0 s, ease-out cubic, from 1.22× to 1.0 of the opening distance (D 135.6 → 117.2) | same (D 193 → 158.3) | same (D 110.8 → 90.8) |
| yaw over the intro | **no turn**: 4.6 → 8.0° over 11 s = the engine's idle sway (±0.06 rad = ±3.4°, period 18 s) | no turn: 6.9 → 10.3° (sway) | no turn: 0 → 3.4 → -3.4° (sway) for 33 s |
| input live | from the first frame (a touch ends the zoom-in where it is); taps place TNT once the drop-in is over (phase `plan`, L20 at 6.9 s, L46 at 2.0 s) | same | same |
| swipe | 90° steps (yaw 4.6 → 94.6 → 184.6), base engine `QUARTER` | 90° | 90° |

**No hard level turns to 45° on its own**, in any of the three builds: the hard opening is front-on (the level's own yaw, 0–23°) and stays there; 45° is only passed through while a swipe turns the view by 90°. Nothing in `engine.js` (g7 blocks), `rs-look`, `frame.js` or the base engine animates the yaw at level start. The only automatic yaw motion is the idle sway and, after BLAST, the collapse drift (+0.05 rad/s up to +0.35 rad = 20°, base engine `updateCamera`), on every level.

Two readings of the order: (a) open front-on like the hard levels, 45° only when the player turns; (b) open front-on, then the camera turns to 45° by itself. The Lead confirmed (b) with D-blast-PAD ("keep the opening front-on → 45° turn"), so (b) is the default and (a) is `?cam45=0`. Before this change the untouched old levels and the bosses did neither: Old Tock opened at 48.7° (OVR GD-38), the bosses at 22.9–28.6° (F5 3/4 hero framing), the other old levels front-on with the sflay S6 hero close-up (pitch 6.9°, distance re-fitted per face: jump up to 1.54×).

Slot numbers below are the play order of ORDER1123 (e8191ca, pushed during this work): hard = slots 14 19 34 39 44, bosses = 24 49 51.

## 2. What changed (`src/main/frame.js` F7 + F8; flags below)

**F7 CAM-ALL** (every level that is not a Mac hard level `LV7O.isH`): the hard opening, i.e. pitch 14.9°, the whole lot (blue buildings included) inside 16 px of each side and 90% of the play height, a 1.0 s ease-out-cubic zoom-in from 1.22×, a touch ends it, and the CAM-HARD one-distance rule (the largest distance any of the 4 faces and the turn need, so a turn never zooms).
- Easy pack and rebuilt old levels start on their own near-frontal yaw (3–10°). Untouched old levels and bosses have no near-frontal yaw (engine default 0.55 rad, HINT_YAW, L.yaw 0.65–1.15), so they start on the **nearest face**. `baseYaw` and `defYaw` are set to that face, so BLAST, the collapse drift, `resetFraming` and the R22 re-frame stay on that face.
- Then the view **turns to 45°** off the face: 1.2 s ease-in-out after the zoom-in (`?turndur=`), toward the side the level's own yaw leans. A touch stops it where it is. Swipes still step 90° from there.
- These overrides no longer apply: `OVR` for Old Tock (GD-38: yaw 0.85 and the hero at 50% height, meant to show the brick row) and Sky Saucer (GD-33: yaw 4.0), and sflay S6 (`main/sflay.js`). The whole lot, brick row included, is in view.

**F8 PAD** (D-blast-PAD):
- **Pad.** The yellow sand pad is the base `lot` mesh. Its centre is world (0, 0) on every level (`lot.position` is never moved). With the Figma ground (`LA.ground`), the edge is drawn in world space at `LA_LOT.r` = 25 m ± 1.45 m wobble. `L.lotK` only scales the mesh, so it never changed the visible pad.
- **Widening.** On every non-hard, non-boss level the edge radius is ×1.2 (25 → 30 m; visible edge 23.9–26.8 → 28.7–32.2 m). This goes through a shader uniform. The lawn ring (bushes, lamps, benches, Figma trees) and the back road and row (road z −31 → −36, fence, lamps, trees) move out by the same 5 m, so nothing ends up standing on the sand.
- **Pivot.** The look-at and turn pivot is the **pad centre (0, 0)** on all non-hard levels. On a boss it is the pad centre only when its lot centre is within 1.5 m of it: Big Bow (slot 49) qualifies; Lift Bridge (24, 4.8 m off) and Sky Steps (51, 5.0 m off) keep the lot centre. The one distance holds the whole pad and everything that counts on all 4 faces and through the turn.
- **Hard levels** (14 19 34 39 44) are untouched: F4 as before, pad ×1.0, no pivot change. Their lots: Grand Stage (19) (0, −3), Glass Spine (34) (0, 0), Canal Row (39) (0, 0), Five Eaves (44) (0.4, 3.7), Watch Keep (14) (−4.55, 0).

**Kept as before:** the R22 re-frame after a blast that leaves TNT still zooms onto what remains (UX-71), not onto the pad. With the pad in that fit, check-r22 C1 failed (the remains filled 29% of the height and 77% of the width).

**check-r22 C1 fails, also on the before build (e8191ca without this change, fill width 0.887).** Since ORDER1123, its test level (slot 3) is the easy level Market Hall, which already used CAM-HARD's one distance for the 4 faces, and the remains never reach 90% of the width. On this build the fill width is 0.766, because the re-frame keeps the 45° view. The UX-71 threshold and the one-distance rule conflict; this is for the Lead to decide.

**Flags.** `?cam45=0` = no turn. `?pad=0` = no F8 at all (no widening, pivot as F7). `?padk=1.0` / `?padk=1.1` = another widening. `?camall=0` = CAM-HARD as this morning (E / O only). `?camhard=0` = as before both.

**Cost (to decide).** Holding the whole widened pad (about 64 m across) on a 393 px wide screen puts the camera about twice as far as before: D after ÷ before median **2.04×**, range 0.93–2.83×. The buildings read much smaller (`L46-strip.jpg`, `L20-strip.jpg`). Pinch still zooms in. Cheaper options are `?padk=1.0` (the pad as it is, still whole on screen) or a rule that holds only the lot and lets the pad edge run off the screen sides.

## 3. All 51 slots (`check-camhard.js all`; before = e8191ca, after = this build)

Start = the first game frame. End = after the zoom-in and the turn (the camera yaw read after settling). Rule: a non-hard level starts within 4.5° of its front, does not turn during the zoom-in, ends 45° ± 4.5° off the face, has jump ≤ 1.01 and never puts the camera inside a building. A hard level keeps the same opening (yaw ±1.5°, D ±1.5 m) and faces (±2 m). **After: 51 PASS.** The run's own printout says 46 FAIL only because the first version of the check read the end yaw while the engine's yaw damping was still catching up (27–33° at the end of the turn; 45° ± sway 2.5 s later). The table uses the settled yaw, and the check now waits 2.5 s.

| slot | level | kind | before: start / end yaw, pitch, D open | before: D 4 faces | jump | after: start / after-turn yaw, pitch, D open | after: D 4 faces | jump | pivot | pad k | inside | verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Ranger Lookout | O | 0.1° / 0.7°, 14.9°, 103.4 | 103.4 103.4 103.4 103.4 | 1 | 0.1° / 48.3°, 14.9°, 243.2 | 243.2 243.2 243.2 243.2 | 1 | pad 0, 0 | 1.2 | no | PASS |
| 2 | Pit Head | O | 0.1° / 0.7°, 14.9°, 101.7 | 101.7 101.7 101.7 101.7 | 1 | 0.1° / 48.3°, 14.9°, 244.2 | 244.2 244.2 244.2 244.2 | 1 | pad 0, 0 | 1.2 | no | PASS |
| 3 | Market Hall | E | 6.9° / 7.6°, 14.9°, 134.6 | 134.6 134.6 134.6 134.6 | 1 | 6.9° / 48.3°, 14.9°, 244.7 | 244.7 244.7 244.7 244.7 | 1 | pad 0, 0 | 1.2 | no | PASS |
| 4 | Stripey Point | old | 90° / 90.7°, 6.9°, 204.8 | 213.3 205.9 215 204.8 | 1.05 | 90° / 45.1°, 14.9°, 262.8 | 262.8 262.8 262.8 262.8 | 1 | pad 0, 0 | 1.2 | no | PASS |
| 5 | Shot Tower | E | 6.9° / 7.7°, 14.9°, 156.8 | 156.8 156.8 156.8 156.8 | 1 | 6.9° / 48.4°, 14.9°, 242.1 | 242.1 242.1 242.1 242.1 | 1 | pad 0, 0 | 1.2 | no | PASS |
| 6 | Gas Works | O | 0.1° / 0.7°, 14.9°, 123.4 | 123.4 123.4 123.4 123.4 | 1 | 0.1° / 48°, 14.9°, 244.7 | 244.7 244.7 244.7 244.7 | 1 | pad 0, 0 | 1.2 | no | PASS |
| 7 | Grand Arch | old | 360° / 360.7°, 6.9°, 121.2 | 108.9 124.3 90 120.8 | 1.38 | 360° / 318.4°, 14.9°, 243.8 | 243.8 243.8 243.8 243.8 | 1 | pad 0, 0 | 1.2 | no | PASS |
| 8 | Old Tock | old | 48.7° / 49.5°, 6.9°, 314.5 | 216.7 314.1 238.1 314.3 | 1.45 | 90° / 45.1°, 14.9°, 330.9 | 330.9 330.9 330.9 330.9 | 1 | pad 0, 0 | 1.2 | no | PASS |
| 9 | Boiler Stack | E | 6.9° / 7.6°, 14.9°, 158.3 | 158.3 158.3 158.3 158.3 | 1 | 6.9° / 48°, 14.9°, 243.2 | 243.2 243.2 243.2 243.2 | 1 | pad 0, 0 | 1.2 | no | PASS |
| 10 | Monorail Station | O | 0.1° / 0.7°, 14.9°, 90.4 | 90.4 90.4 90.4 90.4 | 1 | 0.1° / 48.3°, 14.9°, 245.3 | 245.3 245.3 245.3 245.3 | 1 | pad 0, 0 | 1.2 | no | PASS |
| 11 | Dome Hall | old | 0.1° / 0.7°, 6.9°, 90.1 | 81.1 86.2 70.4 90 | 1.28 | 0.1° / 47.9°, 14.9°, 243.4 | 243.4 243.4 243.4 243.4 | 1 | pad 0, 0 | 1.2 | no | PASS |
| 12 | Drive-in | O | 0.1° / 0.7°, 14.9°, 108.2 | 108.2 108.2 108.2 108.2 | 1 | 0.1° / 48.3°, 14.9°, 245 | 245 245 245 245 | 1 | pad 0, 0 | 1.2 | no | PASS |
| 13 | Pier Pavilion | O | 0.1° / 0.7°, 14.9°, 106.1 | 106.1 106.1 106.1 106.1 | 1 | 0.1° / 47.7°, 14.9°, 244.3 | 244.3 244.3 244.3 244.3 | 1 | pad 0, 0 | 1.2 | no | PASS |
| 14 | Watch Keep | H | 20.1° / 20.8°, 14.9°, 188.2 | 135.7 185.3 131.8 187.7 | 1.43 | 20.1° / 20.8°, 14.9°, 188.2 | 136 185.4 131.8 187.5 | 1.43 | F4 (own) | 1 | no | PASS |
| 15 | Fire Station | O | 0.1° / 0.7°, 14.9°, 147.6 | 147.6 147.6 147.6 147.6 | 1 | 0.1° / 48.1°, 14.9°, 243.7 | 243.7 243.7 243.7 243.7 | 1 | pad 0, 0 | 1.2 | no | PASS |
| 16 | Valley Station | O | 0.1° / 0.8°, 14.9°, 132.9 | 132.9 132.9 132.9 132.9 | 1 | 0.1° / 48.2°, 14.9°, 244.3 | 244.3 244.3 244.3 244.3 | 1 | pad 0, 0 | 1.2 | no | PASS |
| 17 | Floodlit Stand | O | 0.1° / 0.7°, 14.9°, 105.2 | 105.2 105.2 105.2 105.2 | 1 | 0.1° / 48.3°, 14.9°, 244.1 | 244.1 244.1 244.1 244.1 | 1 | pad 0, 0 | 1.2 | no | PASS |
| 18 | Roadside Motel | O | 0.1° / 0.7°, 14.9°, 106.1 | 106.1 106.1 106.1 106.1 | 1 | 0.1° / 48°, 14.9°, 243.9 | 243.9 243.9 243.9 243.9 | 1 | pad 0, 0 | 1.2 | no | PASS |
| 19 | Grand Stage | H | 4.6° / 5.3°, 14.9°, 117.2 | 132.2 130.5 127.3 117.7 | 1.13 | 4.6° / 5.3°, 14.9°, 117.2 | 132.5 130.5 127.2 117.5 | 1.13 | F4 (own) | 1 | no | PASS |
| 20 | Needle Court | old | 194.2° / 195°, 6.9°, 246.3 | 218.3 259.1 209.8 244.8 | 1.23 | 180° / 225.1°, 14.9°, 397.2 | 397.2 397.2 397.2 397.2 | 1 | pad 0, 0 | 1.2 | no | PASS |
| 21 | Bathhouse | E | 5.7° / 6.5°, 14.9°, 95.7 | 95.7 95.7 95.7 95.7 | 1 | 5.7° / 48.2°, 14.9°, 244.7 | 244.7 244.7 244.7 244.7 | 1 | pad 0, 0 | 1.2 | no | PASS |
| 22 | Doorstop Corner | old | 339.8° / 340.5°, 6.9°, 172.3 | 241.9 152.3 218.7 173.5 | 1.59 | 360° / 315.1°, 14.9°, 336.3 | 336.3 336.3 336.3 336.3 | 1 | pad 0, 0 | 1.2 | no | PASS |
| 23 | Glass Point | old | 229.2° / 229.9°, 6.9°, 134.5 | 135.7 137 133.8 134.5 | 1.02 | 270° / 228.2°, 14.9°, 243.5 | 243.5 243.5 243.5 243.5 | 1 | pad 0, 0 | 1.2 | no | PASS |
| 24 | Lift Bridge | boss | 28.6° / 29.4°, 14.9°, 149.7 | 149.4 162.2 145.9 149.7 | 1.11 | 0.1° / 48.4°, 14.9°, 169.1 | 169.1 169.1 169.1 169.1 | 1 | lot centre | 1 | no | PASS |
| 25 | Tram Depot | E | 6.9° / 7.6°, 14.9°, 147.7 | 147.7 147.7 147.7 147.7 | 1 | 6.9° / 48.4°, 14.9°, 244.7 | 244.7 244.7 244.7 244.7 | 1 | pad 0, 0 | 1.2 | no | PASS |
| 26 | Rail Terminus | E | 5.7° / 6.5°, 14.9°, 144.8 | 144.8 144.8 144.8 144.8 | 1 | 5.7° / 48.2°, 14.9°, 244.6 | 244.6 244.6 244.6 244.6 | 1 | pad 0, 0 | 1.2 | no | PASS |
| 27 | Tock Yard | old | 0.1° / 0.7°, 6.9°, 101.9 | 102.5 100.9 105.4 101.9 | 1.04 | 0.1° / 48°, 14.9°, 241.9 | 241.9 241.9 241.9 241.9 | 1 | pad 0, 0 | 1.2 | no | PASS |
| 28 | Rivet Depot | old | 0.1° / 0.7°, 6.9°, 114.5 | 101.6 109.6 101.6 114.5 | 1.13 | 0.1° / 48°, 14.9°, 241.5 | 241.5 241.5 241.5 241.5 | 1 | pad 0, 0 | 1.2 | no | PASS |
| 29 | Dome Works | old | 0.1° / 0.7°, 6.9°, 90.1 | 81.1 86.2 69.6 90 | 1.29 | 0.1° / 47.8°, 14.9°, 243.4 | 243.4 243.4 243.4 243.4 | 1 | pad 0, 0 | 1.2 | no | PASS |
| 30 | Car Park | O | 0.1° / 0.7°, 14.9°, 119.9 | 119.9 119.9 119.9 119.9 | 1 | 0.1° / 47.9°, 14.9°, 244.7 | 244.7 244.7 244.7 244.7 | 1 | pad 0, 0 | 1.2 | no | PASS |
| 31 | The Doorstop | old | 0.1° / 0.7°, 6.9°, 101 | 102.6 103.1 105.9 101.1 | 1.05 | 0.1° / 48°, 14.9°, 242 | 242 242 242 242 | 1 | pad 0, 0 | 1.2 | no | PASS |
| 32 | Old Tock Row | old | 0.1° / 0.7°, 6.9°, 101.9 | 82.4 95.4 83 101.8 | 1.24 | 0.1° / 47.6°, 14.9°, 241.9 | 241.9 241.9 241.9 241.9 | 1 | pad 0, 0 | 1.2 | no | PASS |
| 33 | The Bullet | old | 0.1° / 0.7°, 6.9°, 105.9 | 98.3 101.7 100.9 105.9 | 1.08 | 0.1° / 47.6°, 14.9°, 241.8 | 241.8 241.8 241.8 241.8 | 1 | pad 0, 0 | 1.2 | no | PASS |
| 34 | Glass Spine | H | 6.9° / 7.6°, 14.9°, 172.4 | 160.1 172.1 160.2 172.1 | 1.08 | 6.9° / 7.7°, 14.9°, 172.4 | 160.3 172 160.1 172.2 | 1.08 | F4 (own) | 1 | no | PASS |
| 35 | Shell Hall | old | 0.1° / 0.7°, 6.9°, 96.7 | 90.4 96.6 89.1 96.7 | 1.09 | 0.1° / 48.1°, 14.9°, 244.2 | 244.2 244.2 244.2 244.2 | 1 | pad 0, 0 | 1.2 | no | PASS |
| 36 | Star Dome | E | 5.7° / 6.5°, 14.9°, 90.9 | 90.9 90.9 90.9 90.9 | 1 | 5.7° / 47.3°, 14.9°, 245 | 245 245 245 245 | 1 | pad 0, 0 | 1.2 | no | PASS |
| 37 | Deco Needle | old | 0.1° / 0.7°, 6.9°, 152.8 | 162.7 150.8 162.8 152.8 | 1.08 | 0.1° / 48.4°, 14.9°, 239.4 | 239.4 239.4 239.4 239.4 | 1 | pad 0, 0 | 1.2 | no | PASS |
| 38 | Sky Saucer | old | 0.1° / 0.8°, 6.9°, 239.1 | 246.7 241.8 250.6 239.5 | 1.05 | 0.1° / 45.1°, 14.9°, 274.4 | 274.4 274.4 274.4 274.4 | 1 | pad 0, 0 | 1.2 | no | PASS |
| 39 | Canal Row | H | 5.7° / 6.5°, 14.9°, 266 | 143.7 262.2 143.7 262.2 | 1.85 | 5.7° / 6.5°, 14.9°, 266 | 145.1 261.2 145.1 261.2 | 1.83 | F4 (own) | 1 | no | PASS |
| 40 | Harbour Crane | O | 0.1° / 0.7°, 14.9°, 101.8 | 101.8 101.8 101.8 101.8 | 1 | 0.1° / 48°, 14.9°, 244.3 | 244.3 244.3 244.3 244.3 | 1 | pad 0, 0 | 1.2 | no | PASS |
| 41 | The Pencil | old | 0.1° / 0.8°, 6.9°, 146.1 | 139.7 134.8 140.9 135.8 | 1.08 | 0.1° / 47.7°, 14.9°, 239.8 | 239.8 239.8 239.8 239.8 | 1 | pad 0, 0 | 1.2 | no | PASS |
| 42 | Tube Bundle | old | 0.1° / 0.7°, 6.9°, 103.4 | 94.7 99.7 94.9 103.3 | 1.09 | 0.1° / 47.6°, 14.9°, 241.9 | 241.9 241.9 241.9 241.9 | 1 | pad 0, 0 | 1.2 | no | PASS |
| 43 | The Splinter | old | 0.1° / 0.7°, 6.9°, 118.6 | 122 116.1 124 118.6 | 1.07 | 0.1° / 47.9°, 14.9°, 241.2 | 241.2 241.2 241.2 241.2 | 1 | pad 0, 0 | 1.2 | no | PASS |
| 44 | Five Eaves | H | 20.1° / 20.8°, 14.9°, 149.6 | 133.2 147.2 132 149.3 | 1.13 | 20.1° / 20.8°, 14.9°, 149.6 | 133.1 147.2 132 149.3 | 1.13 | F4 (own) | 1 | no | PASS |
| 45 | Stack Tower | old | 0.1° / 0.7°, 6.9°, 105.5 | 97.7 102.2 100.6 105.5 | 1.08 | 0.1° / 48.3°, 14.9°, 241.8 | 241.8 241.8 241.8 241.8 | 1 | pad 0, 0 | 1.2 | no | PASS |
| 46 | Grain Elevator | E | 5.7° / 6.5°, 14.9°, 93.6 | 93.6 93.6 93.6 93.6 | 1 | 5.7° / 48.4°, 14.9°, 243 | 243 243 243 243 | 1 | pad 0, 0 | 1.2 | no | PASS |
| 47 | Sister Spires | old | 0.1° / 0.7°, 6.9°, 150.9 | 150.9 152.4 152.5 150.9 | 1.01 | 0.1° / 48.3°, 14.9°, 239.6 | 239.6 239.6 239.6 239.6 | 1 | pad 0, 0 | 1.2 | no | PASS |
| 48 | High Cistern | E | 5.7° / 6.5°, 14.9°, 86.2 | 86.2 86.2 86.2 86.2 | 1 | 5.7° / 48.2°, 14.9°, 244.2 | 244.2 244.2 244.2 244.2 | 1 | pad 0, 0 | 1.2 | no | PASS |
| 49 | Big Bow | boss | 22.9° / 23.7°, 14.9°, 171 | 133.9 170.8 153.6 171 | 1.28 | 0.1° / 48.4°, 14.9°, 202.2 | 202.2 202.2 202.2 202.2 | 1 | pad 0, 0 | 1 | no | PASS |
| 50 | Long Legs | E | 6.9° / 7.6°, 14.9°, 155.2 | 155.2 155.2 155.2 155.2 | 1 | 6.9° / 47.1°, 14.9°, 243.2 | 243.2 243.2 243.2 243.2 | 1 | pad 0, 0 | 1.2 | no | PASS |
| 51 | Sky Steps | boss | 22.9° / 23.6°, 14.9°, 193.2 | 200.2 187.7 198.3 193.2 | 1.07 | 0.1° / 48.4°, 14.9°, 179.6 | 179.6 179.6 179.6 179.6 | 1 | lot centre | 1 | no | PASS |

- Hard slots 14 19 34 39 44: opening and faces as before, within 2 m.
- **Re-checked on origin/main 3d4a0ac** (old polish batch 2 rebuilt more slots during this work):
  - Hard 14 19 34 39 44: the same opening yaw and D as before, faces within 2 m (Watch Keep 188.3 / 135.5 185.4 131.8 187.9, Canal Row 266.0 / 143.7 263.1 143.7 263.7).
  - Rebuilt Pit Head (2), Gas Works (6) and Needle Court (20): 0.1° → 48° after the turn, one distance (D 244), jump 1.00.
  - Lift Bridge (24, boss): 0.1° → 48.4°, D 169.1, jump 1.00.
- `?camall=0` on the new build gives the old numbers: Old Tock 48.7° / jump 1.45, Lift Bridge 28.6° / 1.11, Market Hall and Grand Stage unchanged.
- Stack Tower (slot 45) throws `setMatrixAt` page errors on both builds. It is not caused by the camera and was there before.

## 4. Pad check (`src/main/check-pad.js all` on origin/main 3d4a0ac + this change; report only, the level agents move their buildings)

A building member (every member that is not anchor, prop or bonus; blue ones included) violates the rule when a footprint corner at spawn lies beyond the pad's fade midpoint, wobble included. Below: per level, the pad, the lot centre, the pivot, and the members out (by part: count, worst overshoot in metres) at k = 1.0 and after ×1.2.

| slot | level | kind | pad k | pad edge r (m) | lot centre (x, z) | pivot | out at k 1.0 (part: members, max m) | out after ×1.2 (part: members, max m) |
|---|---|---|---|---|---|---|---|---|
| 1 | Ranger Lookout | O | 1.2 | 28.68–32.16 | 1.9, -3.2 | pad 0, 0 | - | - |
| 2 | Pit Head | O | 1.2 | 28.68–32.16 | 0, 0 | pad 0, 0 | - | - |
| 3 | Market Hall | E | 1.2 | 28.68–32.16 | 0, 2 | pad 0, 0 | - | - |
| 4 | Hop Kiln | O | 1.2 | 28.68–32.16 | 0, 0 | pad 0, 0 | - | - |
| 5 | Shot Tower | E | 1.2 | 28.68–32.16 | 0, 0 | pad 0, 0 | - | - |
| 6 | Gas Works | O | 1.2 | 28.68–32.16 | 0, 0 | pad 0, 0 | - | - |
| 7 | Grand Arch | old | 1.2 | 28.68–32.16 | 0, 3.75 | pad 0, 0 | - | - |
| 8 | Airfield Tower | O | 1.2 | 28.68–32.16 | 0, 0 | pad 0, 0 | - | - |
| 9 | Boiler Stack | E | 1.2 | 28.68–32.16 | -3.9, 0 | pad 0, 0 | - | - |
| 10 | Monorail Station | O | 1.2 | 28.68–32.16 | 0, 0 | pad 0, 0 | - | - |
| 11 | Dome Hall | old | 1.2 | 28.68–32.16 | 0, -6.07 | pad 0, 0 | - | - |
| 12 | Drive-in | O | 1.2 | 28.68–32.16 | 0, 0 | pad 0, 0 | - | - |
| 13 | Pier Pavilion | O | 1.2 | 28.68–32.16 | 0, 0.4 | pad 0, 0 | - | - |
| 14 | Watch Keep | H | 1 | 23.9–26.8 | -4.55, 0 | own (hard, F4) | W: 4, +4.6 | W: 4, +4.6 |
| 15 | Fire Station | O | 1.2 | 28.68–32.16 | 0.04, -0.8 | pad 0, 0 | - | - |
| 16 | Valley Station | O | 1.2 | 28.68–32.16 | 0, -5.12 | pad 0, 0 | - | - |
| 17 | Floodlit Stand | O | 1.2 | 28.68–32.16 | 0, -0.45 | pad 0, 0 | - | - |
| 18 | Roadside Motel | O | 1.2 | 28.68–32.16 | 0, 0 | pad 0, 0 | - | - |
| 19 | Grand Stage | H | 1 | 23.9–26.8 | 0, -3 | own (hard, F4) | - | - |
| 20 | Needle Court | O | 1.2 | 28.68–32.16 | 0.6, 0.15 | pad 0, 0 | - | - |
| 21 | Bathhouse | E | 1.2 | 28.68–32.16 | 0, -2.33 | pad 0, 0 | - | - |
| 22 | Doorstop Corner | old | 1.2 | 28.68–32.16 | -1.43, 0.76 | pad 0, 0 | B: 27, +10.8; C: 66, +11.8; D: 18, +18.8; blue: 18, +16.2 | B: 27, +5.9; C: 66, +6.8; D: 18, +13.8; blue: 18, +11.4 |
| 23 | Glass Point | old | 1.2 | 28.68–32.16 | 0, -1.96 | pad 0, 0 | - | - |
| 24 | Lift Bridge | boss | 1 | 23.9–26.8 | 0, -4.85 | lot centre (4.8 m off the pad) | - | - |
| 25 | Tram Depot | E | 1.2 | 28.68–32.16 | 0, 0.21 | pad 0, 0 | - | - |
| 26 | Rail Terminus | E | 1.2 | 28.68–32.16 | 0.4, -3.44 | pad 0, 0 | - | - |
| 27 | Tock Yard | old | 1.2 | 28.68–32.16 | -2.68, -4.73 | pad 0, 0 | - | - |
| 28 | Rivet Depot | O | 1.2 | 28.68–32.16 | 0, 0 | pad 0, 0 | - | - |
| 29 | Dome Works | old | 1.2 | 28.68–32.16 | 0, -5.97 | pad 0, 0 | - | - |
| 30 | Car Park | O | 1.2 | 28.68–32.16 | 0, 0 | pad 0, 0 | - | - |
| 31 | Library | O | 1.2 | 28.68–32.16 | 0.6, 0.15 | pad 0, 0 | - | - |
| 32 | Old Tock Row | old | 1.2 | 28.68–32.16 | -1.48, -6.23 | pad 0, 0 | - | - |
| 33 | The Bullet | old | 1.2 | 28.68–32.16 | 0.18, -5.5 | pad 0, 0 | - | - |
| 34 | Glass Spine | H | 1 | 23.9–26.8 | 0, 0 | own (hard, F4) | - | - |
| 35 | Shell Hall | old | 1.2 | 28.68–32.16 | 0, 2.88 | pad 0, 0 | - | - |
| 36 | Star Dome | E | 1.2 | 28.68–32.16 | 0, 0 | pad 0, 0 | - | - |
| 37 | Deco Needle | old | 1.2 | 28.68–32.16 | -0.89, -8.58 | pad 0, 0 | - | - |
| 38 | Sky Saucer | old | 1.2 | 28.68–32.16 | 0, -6.86 | pad 0, 0 | B: 34, +3.6; C: 28, +2.2; E: 38, +2.3 | - |
| 39 | Canal Row | H | 1 | 23.9–26.8 | 0, 0 | own (hard, F4) | A: 6, +0.0; F: 42, +0.9; blue: 85, +10.2 | A: 6, +0.0; F: 42, +0.9; blue: 85, +10.2 |
| 40 | Harbour Crane | O | 1.2 | 28.68–32.16 | 0, -1.3 | pad 0, 0 | - | - |
| 41 | The Pencil | O | 1.2 | 28.68–32.16 | 0, -0.47 | pad 0, 0 | - | - |
| 42 | Tube Bundle | O | 1.2 | 28.68–32.16 | 0, 0.4 | pad 0, 0 | - | - |
| 43 | The Splinter | O | 1.2 | 28.68–32.16 | 0, 0.4 | pad 0, 0 | - | - |
| 44 | Five Eaves | H | 1 | 23.9–26.8 | 0.4, 3.7 | own (hard, F4) | - | - |
| 45 | Stack Tower | O | 1.2 | 28.68–32.16 | 0, -0.1 | pad 0, 0 | - | - |
| 46 | Grain Elevator | E | 1.2 | 28.68–32.16 | -0.1, 0 | pad 0, 0 | - | - |
| 47 | Sister Spires | old | 1.2 | 28.68–32.16 | 2.88, 1.15 | pad 0, 0 | - | - |
| 48 | High Cistern | E | 1.2 | 28.68–32.16 | 0, 0 | pad 0, 0 | - | - |
| 49 | Big Bow | boss | 1 | 23.9–26.8 | -0.09, 0 | pad 0, 0 | - | - |
| 50 | Long Legs | E | 1.2 | 28.68–32.16 | 0, 0 | pad 0, 0 | - | - |
| 51 | Sky Steps | boss | 1 | 23.9–26.8 | -1.05, -4.87 | lot centre (5.0 m off the pad) | - | - |

**Levels breaking the rule after the widening (3):**
- **Doorstop Corner (22, old):** parts B, C and D plus 18 blue members, up to 13.8 m out.
- **Watch Keep (14, hard, the Mac's):** part W, 4.6 m out.
- **Canal Row (39, hard, the Mac's):** part F 0.9 m and 85 blue members up to 10.2 m out.

Sky Saucer (38) is out at k 1.0 (B up to 3.6 m) and inside after the widening. The first run on e8191ca also flagged Stripey Point (4), Old Tock (8) and Needle Court (20); they have been rebuilt since (old polish batch 2) and now pass.

## 5. Real taps (393 × 852, CDP touch): swipe, one TNT, BLAST

| slot | level | swipe (yaw) | TNT (left) | BLAST | console errors |
|---|---|---|---|---|---|
| 1 | Ranger Lookout | 0° → 90° ok | dbltap | harness: page.waitForFunction: Timeout 30000ms exceeded. | 0 |
| 3 | Market Hall | 6.9° → 96.9° ok | 19 → 18 | ok (game/plan) | 0 |
| 13 | Pier Pavilion | 0° → 90° ok | 14 → 13 | ok (game/plan) | 0 |
| 17 | Floodlit Stand | 0° → 90° ok | 11 → 10 | ok (game/plan) | 0 |
| 45 | Stack Tower | 0° → 90° ok | 10 → 9 | ok (game/plan) | 0 |
| 46 | Grain Elevator | 5.7° → 95.7° ok | 26 → 25 | ok (game/plan) | 0 |
| 49 | Big Bow | 0° → 90° ok | 6 → 5 | ok (game/plan) | 0 |
| 19 | Grand Stage | 4.6° → 94.6° ok | 24 → 23 | ok (game/plan) | 0 |

Slot 1 (Ranger Lookout) has no BLAST button: L1 teaches the double tap. The quick double tap of this script missed the post, so the level was played by the real lesson in check-sflay SF4 (tap, then double tap on the spotlit post: L1 won, 86.8%).


## 6. Shots

For each sample, `L<slot>-first-before/after.jpg` (first game frame), `L<slot>-end-before/after.jpg` (zoom-in and turn over, planning) and `L<slot>-strip.jpg` (all four side by side):
- Market Hall (3), E
- Old Tock (8), old, OVR, outside the pad
- Pier Pavilion (13), O
- Needle Court (20), old, outside the pad
- Lift Bridge (24), boss, lot-centre pivot
- Grain Elevator (46), E
- Big Bow (49), boss, pad pivot
- Grand Stage (19), hard H3, identical
