# Hero opening framing (City Blast!, 15/11/2026)

Task: Owner (TestFlight on iPhone): "the camera angle is currently too far. When you enter a level, the camera should automatically zoom so
the MAIN (hero) building is in the centre, so the player sees it at its best."
Code: `main/frame.js` (build step `frame`, right after `perf`; patch `main/frame-patch.js`). `?frame=0` = the old opening (whole lot);
`?hints=1` also keeps the old opening. Figma first (D-blast-FIGMAFIRST): file `<figma-file>`, page **"Camera framing (15/11)"**
(3 reference frames: tall tower L22, wide hall L11, boss L20; playable area + measured hero box drawn on the game shots).
Contact sheet: `checkpoints/main-shots/frame-sheet.jpg` (before | after per level, green = playable area, red = hero box).

## 1. Rule
- **Hero** = `L.hero` parts (default "A"): world corners of every member at rest + their drawn crowns / dress boxes (kd). Axis (look-at x/z) =
  the members' x/z box centre (the same centre v14's camera clearance measures from). Computed from the built level, not per level.
- **Playable area** = `topH()` .. `VH - botH()`: under the top HUD row (and the tip pill when shown), above the tray / BLAST. Both read the
  DOM, which follows the safe areas of `main/ui2.js` §H.
- **Fill**: the distance where the hero reaches 72% of the playable height or 68% of the screen width, whichever comes first (tall towers by
  height, wide halls by width). **Never farther than the old opening** (zoom <= 1): Owner said "too far", so a hero that already filled more
  is not pushed back; it is only centred.
- **Centre**: the projected centre of the hero sits on the playable area's centre (view offset, as Q1 places its picture).
- **View**: the level's own face (its `baseYaw`), turned 20-29 deg off it (0.35-0.50 rad, same side the level opened on); elevation 15 deg
  (pitch 0.26, v14's close-zoom levelling compensated at the opening zoom only, so a further pinch still levels out as before).
- **Ease-in**: 1.0 s, ease-out cubic, from a 1.22x wider shot (replaces the engine's 1.25x drop-in pull-back on these levels); none with
  Reduce motion; any touch ends it where it is.
- **NOHINT**: look-at = the hero's centre, pan stays 0, the whole hero inside the playable area; never a leg / foot / solution push-in.
- **Hand-over**: the framing is a weighted offset on the existing camera (look-at x/z, yaw, pitch, view offset). Weight 1 at and inside the
  opening zoom, 0 when the player pinches out to max(1, start + 0.25); BLAST / camera reset / any non-planning phase drop it to 0 (eased
  0.3 s), so the collapse camera (Q3) and BLAST reset (v14: zoom 1, pan 0) work as before. The zoom goes through `zoomT`, so v14's
  clearance clamp and perf P3's clearance ease still apply; vertical pan, pinch and turn are unchanged.
- **Overrides**: table `OVR` in `main/frame.js` (level -> fillH / fillW / yaw / pitch / dur). Empty: the generic rule looked right on all 36.
- Not touched: members, bonds, rules, level data, bots (`manual` mode never runs it). Determinism (R-11) L2 + L12, seq / after / fresh /
  wait / raf / live: identical.

## 2. Measured (393x852, iPhone 15 safe areas `?sa=59,0,34,0`, final frame after the ease, `__blast.frame.measure()`)
Fill = hero box height / playable height and width / screen width. Centre = offset of the hero box centre from the playable area's
centre (fraction of the playable height / screen width). Target: centre within +-8%, fill in the band (72% height or >= 65% width).
"above" = the old opening already framed the hero larger than the band (tall towers 82-96% of the playable height); kept, only centred.

| L | Hero | Tier | Before fill H / W | Before centre dx / dy | After fill H / W | After centre dx / dy | Binds | Zoom | Fill check | Centre check | In play | Cam inside |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Old Whirly | T | 89% / 68% | -17.2% / -4.0% | 89% / 68% | -0.7% / +0.0% | height | 1 | above (not zoomed out) | ok | True | False |
| 2 | Stripey Point | T | 90% / 32% | +23.4% / -3.2% | 92% / 31% | +0.1% / -0.2% | height | 1 | above (not zoomed out) | ok | True | False |
| 3 | Old Tock | N | 74% / 39% | +34.1% / -11.6% | 73% / 39% | +0.0% / +0.0% | height | 1 | band | ok | True | False |
| 4 | Needle Court | N | 76% / 33% | -2.6% / -10.7% | 74% / 33% | +0.0% / +0.0% | height | 1 | band | ok | True | False |
| 5 | Doorstop Corner | N | 64% / 37% | +4.9% / -5.0% | 72% / 42% | +0.0% / +0.0% | height | 0.8909 | band | ok | True | False |
| 6 | Dome Square | N | 70% / 81% | +2.3% / -8.2% | 70% / 81% | +1.0% / +0.4% | width | 1 | band | ok | True | False |
| 7 | Grand Arch | H | 45% / 62% | +0.9% / +3.6% | 45% / 68% | +0.1% / +0.1% | width | 0.9896 | band | ok | True | False |
| 8 | Rivet Tower | R | 97% / 58% | +7.5% / +0.1% | 91% / 56% | +0.4% / +0.2% | height | 1 | above (not zoomed out) | ok | True | False |
| 9 | Twin Saucer | N | 84% / 57% | -28.4% / -6.3% | 83% / 55% | -0.2% / -0.1% | height | 1 | above (not zoomed out) | ok | True | False |
| 10 | Lift Bridge | BSH | 60% / 66% | -6.4% / -3.3% | 59% / 68% | +0.1% / +0.1% | width | 0.9879 | band | ok | True | False |
| 11 | Shell Hall | R | 49% / 78% | +4.4% / +0.2% | 52% / 79% | +0.1% / +0.7% | width | 1 | band | ok | True | False |
| 12 | Star Pedestal | N | 52% / 33% | -5.3% / +0.7% | 72% / 44% | +0.0% / +0.0% | height | 0.7111 | band | ok | True | False |
| 13 | Harp Span | R | 92% / 92% | -5.3% / -2.9% | 92% / 65% | +1.7% / +1.6% | height | 1 | above (not zoomed out) | ok | True | False |
| 14 | Stripey Light | N | 90% / 38% | -35.2% / -3.4% | 88% / 37% | -0.1% / -0.2% | height | 1 | above (not zoomed out) | ok | True | False |
| 15 | The Sail | N | 82% / 66% | -17.7% / -7.6% | 82% / 66% | +0.2% / -0.1% | height | 1 | above (not zoomed out) | ok | True | False |
| 16 | Dome Hall | H | 56% / 62% | +7.3% / -10.6% | 61% / 68% | +0.2% / +0.2% | width | 0.9663 | band | ok | True | False |
| 17 | The Pedestal | R | 70% / 41% | -4.0% / -11.2% | 72% / 42% | +0.1% / +0.1% | height | 0.9727 | band | ok | True | False |
| 18 | The Doorstop | N | 94% / 48% | -21.7% / -1.7% | 90% / 47% | +0.3% / +0.2% | height | 1 | above (not zoomed out) | ok | True | False |
| 19 | Cube Grove | N | 34% / 78% | +0.4% / +9.7% | 36% / 76% | +0.8% / +0.2% | width | 1 | band | ok | True | False |
| 20 | Big Bow | BSH | 54% / 80% | +0.4% / +0.2% | 55% / 80% | +0.2% / +0.6% | width | 1 | band | ok | True | False |
| 21 | The Stepper | R | 95% / 33% | -2.7% / -0.9% | 94% / 32% | +0.0% / -0.2% | height | 1 | above (not zoomed out) | ok | True | False |
| 22 | The Pencil | N | 96% / 24% | -6.6% / -0.4% | 93% / 23% | +0.0% / -0.4% | height | 1 | above (not zoomed out) | ok | True | False |
| 23 | Tube Bundle | N | 90% / 40% | -28.3% / -3.8% | 86% / 39% | +0.0% / +0.1% | height | 1 | above (not zoomed out) | ok | True | False |
| 24 | Deco Needle | H | 96% / 19% | -1.9% / -0.7% | 92% / 19% | +0.0% / -0.4% | height | 1 | above (not zoomed out) | ok | True | False |
| 25 | Glass Point | R | 64% / 81% | +2.9% / -4.8% | 66% / 83% | +0.3% / +0.9% | width | 1 | band | ok | True | False |
| 26 | The Bullet | N | 93% / 43% | -7.2% / -2.3% | 90% / 42% | -0.1% / +0.1% | height | 1 | above (not zoomed out) | ok | True | False |
| 27 | The Splinter | N | 93% / 28% | -30.4% / -2.0% | 92% / 27% | -0.1% / -0.1% | height | 1 | above (not zoomed out) | ok | True | False |
| 28 | Sister Spires | H | 93% / 41% | -6.4% / -1.8% | 96% / 43% | -1.3% / +0.4% | height | 1 | above (not zoomed out) | ok | True | False |
| 29 | Old Tock Row | N | 76% / 40% | -36.4% / -10.7% | 74% / 39% | +0.0% / +0.0% | height | 1 | band | ok | True | False |
| 30 | Sky Steps | BSH | 96% / 19% | -2.5% / -0.6% | 92% / 19% | +0.0% / -0.4% | height | 1 | above (not zoomed out) | ok | True | False |
| 31 | Stack Tower | R | 92% / 30% | -5.9% / -2.8% | 88% / 29% | -0.1% / -0.1% | height | 1 | above (not zoomed out) | ok | True | False |
| 32 | Sky Saucer | N | 97% / 60% | -4.2% / +0.1% | 94% / 60% | -0.5% / -0.1% | height | 1 | above (not zoomed out) | ok | True | False |
| 33 | Rivet Tower | N | 83% / 47% | -30.1% / -7.1% | 82% / 46% | -0.3% / -0.2% | height | 1 | above (not zoomed out) | ok | True | False |
| 34 | Tock Yard | N | 94% / 49% | -30.0% / -1.8% | 92% / 48% | +0.0% / -0.1% | height | 1 | above (not zoomed out) | ok | True | False |
| 35 | Dome Works | H | 55% / 61% | +7.3% / -10.2% | 61% / 68% | +0.2% / +0.2% | width | 0.9494 | band | ok | True | False |
| 36 | Sail Lot | R | 93% / 74% | -2.3% / -2.0% | 91% / 73% | +0.5% / -0.1% | height | 1 | above (not zoomed out) | ok | True | False |



**Summary.** Centre within +-8%: **36/36** after (max 1.7%; before 18/36 off by more than 8%, worst 36%). Fill in the band: **15/36**
(every width-bound hall / boss, and the short towers L3-5, L12, L17, L29); **21/36 above the band** (tall towers already 82-96% of the
playable height in the old opening; not zoomed out, Owner's "too far"); 0 below. Zoom-ins: L5 0.89, L12 0.71, L7 / L10 / L16 / L17 /
L35 0.95-0.99. Whole hero in the playable area 36/36; camera inside a building 0/36 (v14 `inside()`); pitch 15 deg; yaw 20-29 deg off
the face.

## 3. Finding for the Lead / Owner
On a 393x852 screen the old opening already showed the towers at 82-97% of the playable height (B1's "45-63% of the width" was the halls,
which now reach 67-83% of the width). What made it look far is (a) the hero off-centre (up to 36% of the width, L14 / L23 / L27 / L29 /
L33 / L34, the lot centred instead of the hero), (b) the flat 12.6 deg view and (c) the slow 1.25x pull-in at the start. All three are
fixed. If Owner still finds it far on the phone, the next lever is the band itself (e.g. let towers crop the HUD row, or allow the hero to
fill more than the playable area) - that needs his call.

## 4. Checks (15/11, machine shared with other agents)
check-main ONLY=nohint 7/7 (N3 updated: whole hero framed + centred, still no foot / solution push-in, zoom / pan stable 4 s), home 24/24,
flow 24/24, intro 14/14, tap2 24/24, ui2 6/6; loadcheck ok=true, 0 errors; determinism L2 / L12 identical in every mode.
Not committed, not published.
