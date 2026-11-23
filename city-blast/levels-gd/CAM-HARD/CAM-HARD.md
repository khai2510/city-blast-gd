# CAM-HARD: the hard levels' camera on the easy pack and the rebuilt old levels (Agents-Game, 23/11)

Khai 23/11: "Level hard của máy mac làm có góc quay đúng, học theo góc quay đó." Earlier: L46 opened off-centre from its building; on L45 the camera zoomed in and out by itself when the view was turned.

## What was measured (main build, 393 x 852 touch, real swipe + release, `src/main/check-camhard.js`)

- **Which levels got which camera before.** `frame.js` F4 (hard framing: level's own yaw, pitch 0.26 rad = 14.9°, whole lot in 16 px sides and 90% of the play height) ran on every level with `L.hard7`. That is H1-H5, all ten easy levels (E01-E10, slots 42-51) and only two rebuilt old levels (O17, O18). The other ten rebuilt old levels (slots 1, 4-7, 9, 10, 12, 13, 15) have no `hard7`. They got the sflay S6 front-on camera: yaw 0, pitch 0.12 rad = 6.9°, the hero group at 90% of the width.
- **Opening angle.** The hard levels' own data puts the main building on the lot's axis: H3, H4 and H5 are symmetric about it, so "fit the lot, look at its centre" also centres the building (hero dx ≤ 0.007 of the width). Two levels have a lot that is not symmetric about the main building: E06 (L46, the chimney 12 m left of the boiler house) and E10 (L51, the terminus left of the shed). On those, the chimney sat at the left edge (hero dx -0.32) and the terminus at -0.28.
- **Rotation.** On a turn the engine's `refit()` sets `dist = fitDist(frameBox(), new yaw)`, so each face is fitted again and the zoom factor is kept. A lot that is wider than it is deep therefore jumps. **The hard levels jump too** (H4 Canal Row 141 → 263 m, H2 1.43×, H3 1.13×). Their lots are mostly near-square, so it shows less. L45 jumped 132 → 83 m, L13 91 → 34 m (the side face was a close-up of one pier, with the lot cut by the HUD), and L17 113 → 48 m.

## What changed (`src/main/frame.js` F6, `src/main/sflay.js` S6; `?camhard=0` = exactly the old behaviour)

On every easy level (`LV7O.isE`) and every rebuilt old level (`LV7O.isO`), never on a Mac hard level (`LV7O.isH`) or a boss:
1. The opening is the hard one: the level's own yaw (E 0.10–0.12, O 0 = still front-on), pitch 14.9°, and the whole lot (keep buildings included) inside 16 px of each side and 90% of the play height. sflay no longer forces front-on / 6.9° on these levels.
2. The camera looks at and turns round the **main building** (the first id of `L.hero`), which sits in the middle of the screen. The lot is fitted on both sides of it.
3. There is **one distance for all four faces**: the largest that any face needs to hold the lot, with ±0.06 rad of idle sway included. On a turn, `refit()` keeps the opening distance and zoom while this framing holds. BLAST, pinch-out and the post-blast re-frame (R22) behave as before; the re-frame also uses one distance for the four faces.
4. The distance is never shorter than the lot fit, so the camera stays outside every building (`m14.inside()` was false on every face of every level).

Not changed: the Mac's g7 blocks, `levels-gd/H*`, `release/` and every level's data. Other screen layout and the fail card are untouched.

## Numbers (D = camera distance in metres; faces = after each of 4 swipes; jump = max/min over open + 4 faces; hero dx = main building centre offset, fraction of the width)

| slot | level | kind | before: yaw / pitch / D open | before: D 4 faces | jump | hero dx | after: yaw / pitch / D open | after: D 4 faces | jump | hero dx | inside |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 20 | Grand Stage | H | 7.5° / 14.9° / 117.2 | 132.8 130.4 127.2 117.5 | 1.13 | 0.006 | 7.7° / 14.9° / 117.2 | 132.9 130.4 127.2 117.4 | 1.13 | 0.007 | no |
| 30 | Watch Keep | H | 23.3° / 14.9° / 188.2 | 135.2 185.7 131.3 188.1 | 1.43 | -0.233 | 23.4° / 14.9° / 188.3 | 135 185.7 131.3 188.1 | 1.43 | -0.233 | no |
| 32 | Glass Spine | H | 3.7° / 14.9° / 172.4 | 160 172.3 160 172.4 | 1.08 | -0.005 | 3.7° / 14.9° / 172.4 | 159.9 172.3 160 172.3 | 1.08 | -0.005 | no |
| 38 | Canal Row | H | 9° / 14.9° / 266 | 141.1 263.1 140.6 265 | 1.89 | -0.003 | 8.8° / 14.9° / 266 | 142.6 264.3 142.6 264.7 | 1.87 | -0.003 | no |
| 40 | Five Eaves | H | 23.3° / 14.9° / 149.6 | 133 147.5 131.8 149.4 | 1.14 | 0.004 | 23.3° / 14.9° / 149.6 | 133 147.4 131.8 149.4 | 1.14 | 0.004 | no |
| 42 | Long Legs | E | 10° / 14.9° / 145.9 | 100.5 144.8 100.3 145.2 | 1.45 | 0.007 | 9.4° / 14.9° / 155.2 | 155.2 155.2 155.2 155.2 | 1 | 0 | no |
| 43 | Shot Tower | E | 3.8° / 14.9° / 158.1 | 121.1 157.9 120.9 157.9 | 1.31 | 0.004 | 9.6° / 14.9° / 156.8 | 156.8 156.8 156.8 156.8 | 1 | 0 | no |
| 44 | Tram Depot | E | 10.2° / 14.9° / 149.4 | 89 147.2 89.4 149.3 | 1.68 | 0.002 | 9.9° / 14.9° / 147.7 | 147.7 147.7 147.7 147.7 | 1 | 0.001 | no |
| 45 | Market Hall | E | 10.2° / 14.9° / 132.1 | 83.3 135 83.2 132 | 1.62 | -0.008 | 10° / 14.9° / 134.6 | 134.6 134.6 134.6 134.6 | 1 | 0.001 | no |
| 46 | Boiler Stack | E | 4.6° / 14.9° / 91.9 | 89.6 99.2 87.5 91.9 | 1.13 | -0.32 | 10.1° / 14.9° / 158.3 | 158.3 158.3 158.3 158.3 | 1 | 0 | no |
| 47 | Star Dome | E | 4.6° / 14.9° / 90.3 | 54.8 89.3 54.4 89.2 | 1.66 | -0.004 | 8.2° / 14.9° / 90.9 | 90.9 90.9 90.9 90.9 | 1 | 0 | no |
| 48 | Bathhouse | E | 2.6° / 14.9° / 88.1 | 68.9 88 58.4 87.9 | 1.51 | 0.002 | 8.7° / 14.9° / 95.7 | 95.7 95.7 95.7 95.7 | 1 | 0.001 | no |
| 49 | Grain Elevator | E | 4.2° / 14.9° / 85.4 | 89.4 85.6 88.7 85.4 | 1.05 | -0.039 | 8.6° / 14.9° / 93.6 | 93.6 93.6 93.6 93.6 | 1 | -0.003 | no |
| 50 | High Cistern | E | 4.2° / 14.9° / 86.9 | 64.9 86.8 64.9 86.9 | 1.34 | 0.003 | 8.9° / 14.9° / 86.2 | 86.2 86.2 86.2 86.2 | 1 | 0 | no |
| 51 | Rail Terminus | E | 2.3° / 14.9° / 94.1 | 87.5 89.5 69.9 94.1 | 1.35 | -0.275 | 8.9° / 14.9° / 144.8 | 144.8 144.8 144.8 144.8 | 1 | 0 | no |
| 1 | Ranger Lookout | O | 3.2° / 6.9° / 75.9 | 72.4 74.7 72.6 75.9 | 1.05 | -0.004 | 3.3° / 14.9° / 103.4 | 103.4 103.4 103.4 103.4 | 1 | 0.019 | no |
| 4 | Fire Station | O | 3.1° / 6.9° / 90.7 | 86.8 90.6 86.8 90.7 | 1.04 | -0.006 | 3.2° / 14.9° / 147.6 | 147.6 147.6 147.6 147.6 | 1 | -0.002 | no |
| 5 | Valley Station | O | 3° / 6.9° / 109.7 | 94.4 105.7 94.4 109.7 | 1.16 | -0.009 | 3.1° / 14.9° / 132.9 | 132.9 132.9 132.9 132.9 | 1 | 0.001 | no |
| 6 | Harbour Crane | O | 3.1° / 6.9° / 98.2 | 71.9 106.4 72 98.2 | 1.48 | 0.006 | 3.2° / 14.9° / 101.8 | 101.8 101.8 101.8 101.8 | 1 | -0.002 | no |
| 7 | Pit Head | O | 3° / 6.9° / 104.9 | 61.5 98.6 61.4 104.9 | 1.71 | -0.01 | 3.4° / 14.9° / 101.7 | 101.7 101.7 101.7 101.7 | 1 | -0.006 | no |
| 9 | Floodlit Stand | O | 3.2° / 6.9° / 100.8 | 64 104.6 64 100.8 | 1.63 | 0.007 | 3.3° / 14.9° / 105.2 | 105.2 105.2 105.2 105.2 | 1 | 0.007 | no |
| 10 | Pier Pavilion | O | 2.8° / 6.9° / 106 | 54.2 108.5 54.1 105.9 | 2.01 | 0 | 2.8° / 14.9° / 106.1 | 106.1 106.1 106.1 106.1 | 1 | -0.003 | no |
| 12 | Drive-in | O | 3.4° / 6.9° / 106.1 | 47.9 108.8 48 106 | 2.27 | 0 | 3.2° / 14.9° / 108.2 | 108.2 108.2 108.2 108.2 | 1 | -0.004 | no |
| 13 | Monorail Station | O | 3.3° / 6.9° / 91.1 | 34.4 91.3 34.4 91 | 2.65 | -0.001 | 3.3° / 14.9° / 90.4 | 90.4 90.4 90.4 90.4 | 1 | -0.001 | no |
| 15 | Gas Works | O | 3.1° / 6.9° / 104.9 | 82.2 114.1 82.2 104.9 | 1.39 | 0.007 | 3.2° / 14.9° / 123.4 | 123.4 123.4 123.4 123.4 | 1 | -0.003 | no |
| 17 | Car Park | O | 3.2° / 14.9° / 113.4 | 48 113.3 48.4 113.3 | 2.36 | -0.001 | 3.2° / 14.9° / 119.9 | 119.9 119.9 119.9 119.9 | 1 | 0.031 | no |
| 18 | Roadside Motel | O | 1.8° / 14.9° / 102.9 | 60.3 98.3 60.2 102.9 | 1.71 | 0.003 | 3.1° / 14.9° / 106.1 | 106.1 106.1 106.1 106.1 | 1 | -0.031 | no |

L13 camhard=0: D 91.1 faces 34.4 91.3 34.4 91 (before 91.1 / 34.4 91.3 34.4 91)
L20 camhard=0: D 117.2 faces 132.8 130.4 127.2 117.4 (before 117.2 / 132.8 130.4 127.2 117.5)
L46 camhard=0: D 91.9 faces 89.6 99.2 87.5 91.9 (before 91.9 / 89.6 99.2 87.5 91.9)

**Hard levels unchanged:** same opening distance (117.2 / 188.2→188.3 / 172.4 / 266.0 / 149.6) and the same faces within the sway noise (≤ 1.5 m). `?camhard=0` on the new build gives the old numbers (L46 91.9 / 89.6 99.2 87.5 91.9, L13 91.1 / 34.4 91.3 34.4 91).

**Cost:** where the lot is not symmetric about the main building, centring that building means the camera stands farther back: L4 91 → 148 m, L46 92 → 158 m, L51 94 → 145 m. On long lots the side faces now look smaller than the front, because the distance stays the same and is no longer fitted to each face; the player can still pinch to zoom in. If L46 / L51 look too small to Khai, two fixes: centre the lot rather than the building on those two levels, or give the level a new yaw (a level-data change, so a design decision).

## Shots (393 × 852)

`L<slot>-open-before/after.jpg` (opening), `L<slot>-face1-before/after.jpg` (after one swipe): L45, L46, L13, L17 and H3 = L20 (hard, unchanged).
