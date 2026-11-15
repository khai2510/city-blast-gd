# City Blast! vs Smash Fest: visual design, real images (13/11/2026)

Art-direction review for Owner. This review covers only the look: style, rendering, colour, light, materials, buildings, environment, VFX, UI rendering, icon and polish. Layout and HUD count were covered in `SCREENS-H2H-SF-2026-11-13.md` and are not repeated here.

Phone page (Vietnamese, internal only): `visual/index.html`. SF images and sources: `sf-real/` + `sf-real/SOURCES.md`.

## 0. Evidence: what is real and what is missing

**Smash Fest: 7 real in-game frames, but all of them are the same moment** (an idle level before the first shot).
- Owner's own in-play Hard screenshot (`sf-real/owner-ingame-hard.jpg`, with HUD).
- 5 distinct App Store scenes (`as-02/05/06/07/08`). iPad duplicates: `as-01/03/04/09/10`. Each has a marketing caption banner at the top and no HUD.
- 1 real UI frame: the preview-video keyframe with the logo and the Play button (`as-video-keyframe.jpg`).
- The app icon.

Google Play no longer lists the game (404; removed). The App Store preview video, the YouTube thumbnails and the mirror sites are blocked by this session's network (`sf-real/SOURCES.md`).

**No real SF image yet exists for:**
- the moment of impact / explosion VFX;
- collapse and debris;
- the win moment (coins flying to Home);
- the Home screen;
- the pre-level popup;
- the lose / Continue popup;
- the Shop.

All are seen on Owner's phone (08/11 captions), but no image file exists. The VFX dimension is therefore scored for us only. **Owner: please send SF screenshots or a screen recording of (1) the ball hitting, (2) blocks falling, (3) the win and coins, (4) Home, (5) the lose popup.**

**Ours.** Main build `checkpoints/index-main.html` (commit 6e897884, 13/11 10:36).
- Served on 127.0.0.1 with Playwright `chromium.launch()`, 390×844, DPR 2, touch, libs from `BLAST_LIBS`, real web fonts.
- Idle frames: Home, L1, L7 (Hard), L8, L10 (Boss), L13, L20, L32, all opened with `?lv=N`, after physics settled and cards were closed.
- Blast and collapse frames: L1 with `__blast.test.solve`, on a paused fake clock, 1 frame per 100 ms of game time (`tools/capture-gametime.js` method).
- Nothing in the game was edited.

**Measured.** Measurements were made at 780×1688, on the scene band y 18–88 % (this cuts off SF's caption banner and our top HUD and BLAST button). The measurements are:
- k-means palette (k = 7, CIELAB);
- HSV saturation and value;
- building box vs a ring around it (ΔL\*, ΔE Lab, L-histogram overlap);
- Canny edge density and Laplacian variance on the building, rescaled to 300 px wide;
- dark-line ratio (share of edges sitting on a line darker than 0.55 × median), as an outline test;
- cast-shadow pixel share below the building;
- VFX size, from bounding boxes on the captured frames.

Building boxes were set by hand. They are drawn as white frames on every pair image.

## 1. Summary

| Dimension | Us | SF | In one line |
|---|---|---|---|
| Art-style coherence | 3.5 | 4.5 | SF is one "glossy painted toy" look everywhere. Ours mixes a flat painted city card, matte Lambert 3D, toon-outlined VFX and glossy UI. |
| Rendering, light & shadow | 3.0 | 4.5 | We have a real sun and cast shadows. Faces are flat, with no AO, bevel or specular. SF blocks carry painted top-light gradients, rim highlights and contact darkening. |
| Colour | 2.5 | 4.5 | SF scene: S 0.51–0.74, V 0.88–0.92. Ours: S 0.39–0.57, V 0.71–0.79. Our palettes always contain a muddy olive/grey-brown and a washed haze-green. |
| Materials & textures | 3.5 | 4.5 | Our brick (mortar) and steel (X-brace, rivets) are good. Our wood and concrete are speckled flat beige. SF has a 2-tone bevel, an inset panel and 3–5 grain strokes per crate, plus glowing ice veins. |
| Building design & silhouette | 4.0 | 3.5 | **We win on ideas** (windmill, arch, cable bridge, lattice tower, RC tower). We lose on separation: building vs surround ΔE is 11–38 for us and 21–98 for SF on 5 of 6 pairs. |
| Environment & background | 3.0 | 4.5 | SF: themed beach with props at 3 depths (shells and starfish / palms and hut / sea and boats). Ours: a flat city card, a hazy band, and 40 % of the frame is empty green field. |
| VFX (explosion, dust, debris) | 3.0 | n/a | Ours is well styled (outlined toon star-burst, puffy dust, chips) but small: burst ≈ 2 % of the screen, dust ≈ 4 %, beige dust on a beige lot. No real SF frame. |
| UI rendering | 4.0 | 4.5 | Same family: chunky rounded font, gold rim, outline. SF's gradients are deeper (ΔL 52 vs our 31), with a gloss blob, cream text and the whole HUD recoloured on Hard. |
| Character / hero prop | 3.0 | 4.0 | SF keeps a big glossy cannon in the foreground of every frame (the player's "hand"). We show no tool in the scene. Our Home avatar is fine (SF avatar: no real image). |
| App icon | 2.5 | 4.5 | Ours is a wordmark on pale blue. SF shows a real game object (can pyramid on a plinth) on deep blue with sparkles and metallic speculars. |
| **Overall polish** | **3.2** | **4.4** | The gap is not in what we build. It is in how it is lit and coloured. Most fixes are shader, light and palette work (S–M), not new art. |

### Top 10 visual fixes

| # | Fix | Prio | Effort | Owner |
|---|---|---|---|---|
| 1 | **Colour grade.** Brighter, cleaner scene. Target mean V ≥ 0.86 and S ≥ 0.55 in the scene band. Fog `0xFFE2B0`, 60→190 becomes a pale sky tint `0xDCEBFF` at 120→260, so the lot and the near city are not hazed. Hemisphere `0xFFF1D6/0xC98F5A` 0.62 becomes `0xE6F0FF/0xC98F5A` 0.75. Sun 1.05 → 1.15. Re-check all 36 levels. | P0 | S | app-dev |
| 2 | **Hue separation between building and lot.** The beige lot under beige wood and concrete gives ΔE 11. Make the lot a cooler grey-brown gravel pad (≈ `#B9A58A` → `#A7A196`), or make wood more orange (`#E58A2E`) and concrete a light cool grey. Target building vs ring ΔE ≥ 40 (SF median ≈ 45). | P0 | S | design + app-dev |
| 3 | **Painted block shader.** Through `onBeforeCompile` on the existing Lambert materials, add a per-block vertical gradient (top +12 % light, bottom −18 %) and a bevel band (within 6 % of the face edge in UV: outer 2 % +25 % light, next 3 % −20 %). This gives SF's 2-tone bevel and dark seam without new geometry. | P0 | M | app-dev |
| 4 | **Material motif atlas** (one 1024² CanvasTexture or PNG), so each tier reads at 390 px with ≥ 2 motifs. **Wood:** inset panel, 3–5 dark grain strokes, warm orange. **Brick:** keep the mortar lines and add a 2-tone face. **Concrete:** board seams every 0.6 m and tie-holes, light warm grey. **RC:** cool blue-grey with rebar stubs at the cuts. **Steel:** dark slate with rivets and a hazard band. | P1 | M | design |
| 5 | **Fake AO + softer contact shadow.** A radial-gradient multiply decal under each building and at block joints, and the bottom 15 % of each block darkened in the shader. `PCFShadowMap` → `PCFSoftShadowMap`, `shadow.radius` 3, hero-level map 2048. | P1 | S | app-dev |
| 6 | **Bigger, 3-layer explosion.** (1) A white-hot additive core, 60–80 ms, ≥ 8 % of the screen. (2) The current outlined star-burst at 2.5× scale. (3) Grey-brown dust, darker than the lot (L\* ≈ 55 vs a lot at 75), that rolls out to 15–25 % of the screen over 1.5–2.5 s. Add a 10 % white screen flash for 60 ms, and tint the chips by material. | P1 | M | app-dev (design: sprite sheet) |
| 7 | **Foreground hero prop**, our "cannon": a glossy detonator plunger box with a cable to the building, bottom-centre, about 20 % of the screen width, animated on BLAST. It fills the empty lower field and gives SF's sense of the player's hand. | P1 | M | design (model) + app-dev |
| 8 | **Environment depth pass.** Ground texture motifs (gravel, tyre tracks). Props at 3 depths: near (cones, barrier, tool crate), mid (fence, digger, site cabin, people behind tape), far (city card). Lift the city card's contrast and remove the grey haze band. | P1 | M | design + app-dev |
| 9 | **UI gloss pass.** Primary buttons get a vertical gradient from L\* ≈ 90 to 40 (lime `#9BE21C` → `#0E7A06`), a top-left gloss ellipse (white 55 %), cream text `#FFF6DA` with a dark outline and a 2 px drop shadow, and a 4 px darker bottom lip. The disabled BLAST button becomes grey-desaturated, not brown-red. On Hard, recolour **all** HUD chips (pause, coins, level) purple; on boss, orange. | P1 | S | app-dev |
| 10 | **Object app icon.** A building mid-collapse with TNT on a deep-blue radial background with sparkles and specular highlights; wordmark small or absent. No real logos. | P2 | M | design |

The rules hold in every fix: no real logos, no red cross, purple = Hard, orange = boss. The material ladder wood > brick > concrete > RC > steel stays readable: fix 4 pushes each tier further apart in hue and value, and fix 2 must not move wood or brick toward each other.

## 2. Measurements (scene band, 780×1688)

| Pair | Side | Sat mean | Val mean | ΔL\* bldg-ring | ΔE bldg-ring | L-hist overlap | Laplacian var | Dark-line ratio | Cast-shadow px |
|---|---|---|---|---|---|---|---|---|---|
| P1 Hard | us L7 | 0.50 | 0.78 | 3.9 | 18.2 | 0.67 | 801 | 0.25 | 0.118 |
|  | SF Owner Hard | 0.55 | 0.90 | 27.5 | 97.6 | 0.45 | 210 | 0.17 | 0.100 |
| P2 Wood | us L1 | 0.57 | 0.79 | 3.1 | 11.4 | 0.75 | 880 | 0.21 | 0.076 |
|  | SF as-08 | 0.74 | 0.92 | 15.7 | 40.8 | 0.57 | 634 | 0.01 | 0.082 |
| P3 Boss / colour | us L10 | 0.51 | 0.76 | 3.5 | 18.6 | 0.61 | 1564 | 0.27 | 0.045 |
|  | SF as-07 | 0.64 | 0.92 | 14.5 | 50.9 | 0.62 | 1112 | 0.22 | 0.092 |
| P4 Silhouette | us L13 | 0.47 | 0.76 | 11.0 | 38.3 | 0.59 | 941 | 0.10 | 0.085 |
|  | SF as-05 | 0.60 | 0.88 | 3.5 | 10.3 | 0.77 | 959 | 0.39 | 0.180 |
| P5 Many parts | us L8 | 0.44 | 0.71 | 5.1 | 27.3 | 0.70 | 651 | 0.55 | 0.069 |
|  | SF as-02 | 0.61 | 0.89 | 1.6 | 21.4 | 0.69 | 1116 | 0.20 | 0.148 |
| P6 Hero | us L32 | 0.39 | 0.75 | 7.8 | 20.2 | 0.58 | 1001 | 0.20 | 0.034 |
|  | SF as-06 | 0.51 | 0.91 | 2.0 | 45.3 | 0.74 | 1137 | 0.42 | 0.126 |

**How to read it.**
- **Brightness and saturation.** SF is brighter and more saturated in all 6 pairs: V +0.11 to +0.18, S +0.05 to +0.17.
- **Separation.** SF separates the building from the ground by **hue**, not by lightness: its ΔL\* is often tiny (1.6–3.5) but its ΔE is large. Saturated blue, purple or pink blocks stand against warm sand; brown wood stands against cyan ice. We separate by neither: on L1, L7 and L10 our ΔL\* is ≈ 3–4 and our ΔE is 11–19.
- **The exception is P4.** Our L13 bridge (grey on green) separates better than SF's wood giraffe on sand.
- **Laplacian variance.** Ours is often *higher*. That is fine speckle and noise, not motifs. SF's detail is few, large, readable motifs (panel, plank, bevel).
- **Outlines.** No ink outlines on SF's 3D. The dark-line ratio is 0.01 on wood and ice; the 0.2–0.4 values elsewhere are seams *between* cans and blocks, not contour lines. SF is not toon-shaded: it is smooth painted gradients plus speculars. We should not add black inverted-hull outlines to buildings; bevel shading (fix 3) is the SF technique. Our outlined toon VFX and UI are fine and match SF's UI.
- **Shadows.** Both games have cast shadows with similar edge sharpness (edge gradient 155–300 for both). SF's shadows cover more ground (0.08–0.18 vs 0.03–0.12) because the blocks sit high on a plinth and the sun is low and to the side.

**Palettes (k = 7, by share).**
- SF is always 2 sand golds (`#F7BC62`, `#F9D589`) plus 1–2 pure accents (`#06B3F6` cyan, `#F661F3` magenta, `#3064E2` royal blue, `#4453D1`).
- Ours is always grass green (`#84C13E`) plus a pale haze green (`#C0D6B2`) plus a muddy grey-brown (`#776C5B`, `#7B6448`, `#73664D`, `#6A6450`). The haze green and the mud are the two colours to remove (fixes 1, 2).

**UI button.**
- **Play gradient** (column outside the text, L\* top → bottom): ours 85 → 54; SF 92 → 40, with a white specular blob (≈ `#D6F4AA`) near the top-left.
- **Text fill:** SF uses cream; we use pure white.
- **Rim:** SF has a gold rim and a soft dark drop shadow, with no navy outer stroke. We have a gold rim and a dark navy outer stroke.

**VFX** (ours, L1, measured on frames with game time after BLAST):
- **+0.3 s:** the star-burst sprite is about 180×130 px of 780×1688, ≈ 1.8 % of the screen. Orange/yellow with a dark outline and a white swoosh.
- **+1.0 s:** the dust is about 350×150 px, ≈ 4 %. Beige puffs with outlines, value close to the sand lot.
- **+3 s:** the collapse is good: real structural fall, chips, slow-mo.
- **Result:** the rubble pile reads well. There is a small dust plume.

## 3. Pairs

Each pair: ours left, SF right (real image). White frames are the measured building boxes.

### P1 · Hard level, idle: L7 Grand Arch vs Owner's SF Hard screenshot (`visual/p1-hard.jpg`)
- **Us 3.0 / SF 4.5.**
- ✅ Purple = Hard is already right on the level pill and the TNT badge. Our scene has more depth: road, fence, trees, city.
- ✅ Our arch is a real landmark with sandstone panels, and the brick stack shows mortar lines.
- ❌ The arch (`#E9BF75`-ish beige) sits on a beige lot: ΔL\* 3.9, ΔE 18. SF's blue/white cans and orange crates on sand reach ΔE 98.
- ❌ SF repaints the whole HUD purple on Hard. Our pause button stays blue.
- ❌ SF's crates have a light-catching bevel frame, an inset panel and wood grain. Our sandstone faces are flat Lambert with a fine speckle.
- 🔧 Fix 2 (lot colour), fix 3 (bevel shader), fix 9 (purple pause and coin chips on Hard).

### P2 · Wood: L1 Old Whirly vs SF "Challenge yourself" wood + ice (`visual/p2-wood.jpg`)
- **Us 3.0 / SF 4.5.**
- ✅ The windmill silhouette (sails, cap, ladder) is charming and instantly readable.
- ❌ Wood is `#F5BD5D` / `#D48B35` on a lot of the same hue: ΔE 11.4, the lowest of all pairs.
- ❌ The crate is a flat beige box with dark speckles. SF's wood planks each carry a 2-tone bevel (light outer edge, dark inner rim), 2–3 dark grain strokes, and saturated orange `#F58E10`.
- ❌ SF's ice is glossy cyan with white crack veins. We have no comparable "shiny" material; our glass on L32 is closest.
- 🔧 Fix 4 (wood motif: inset panel + grain), fix 3 (bevel), fix 2 (lot).

### P3 · Colour: L10 Lift Bridge (boss) vs SF "Smash" jar stack (`visual/p3-boss.jpg`)
- **Us 2.5 / SF 4.5.**
- ✅ Orange = boss is right on the pill and the badge. The sandstone towers with red pyramid caps make a nice silhouette.
- ❌ The scene is mostly greens and beiges plus a muddy grey-brown `#7B6448`. SF puts 2 pure accents (magenta `#F661F3`, gold) against sand.
- ❌ Our scene V is 0.76 against SF's 0.92. The haze band behind the lot greys out the trees and the city.
- 🔧 Fix 1 (grade and fog). Give each level one saturated accent material: e.g. a painted steel bridge in signal blue, while red stays out of the HUD.

### P4 · Silhouette: L13 Harp Span vs SF giraffes (`visual/p4-silhouette.jpg`)
- **Us 4.0 / SF 3.5.**
- ✅ **We beat SF here.** A cable-stayed bridge with harp cables is a clear landmark. Grey on green gives ΔE 38, against SF's 10 (wood giraffe on sand).
- ❌ The cables are 1–2 px lines at 390 px and almost vanish.
- ❌ The pylons are flat grey with no seams.
- 🔧 Cables drawn ≥ 2 px at 390 (thicker tube, or a lighter colour with a dark core). Fix 4 concrete motif (board seams) on the pylons.

### P5 · Many parts: L8 Rivet Tower (steel) vs SF "Clear the table" (`visual/p5-steel.jpg`)
- **Us 3.5 / SF 4.0.**
- ✅ Steel reads as steel: dark slate, X-bracing, rivets, a teal glass deck. Steel is the clearest tier in our ladder.
- ❌ The dark lattice against a busy city card has low luminance separation in the upper half.
- ❌ The scene is our darkest: V 0.71.
- ❌ SF's columns are glossy cobalt with a top highlight stripe. Our members are matte.
- 🔧 Fix 1, plus a rim light from behind: re-aim `fillLt` (`0x9FCBFF`, 0.28) to come from behind the building at 0.45, so steel edges catch a cool rim against the city.

### P6 · Hero: L32 Sky Saucer vs SF "Knock 'em all" pyramid (`visual/p6-hero.jpg`)
- **Us 3.5 / SF 4.0.**
- ✅ The glass curtain wall with visible floors, the RC frame, the hazard stripe and the dot-pips are richer than anything in SF.
- ❌ It is the least saturated scene: S 0.39.
- ❌ The tower is cut off at the top. Framing is not part of this review, but it hurts the silhouette.
- ❌ RC grey, glass grey-blue and concrete grey all sit close together: the ladder RC vs concrete is weak in colour.
- 🔧 Fix 4: RC in a cool blue-grey (`#8E9DB0`) against concrete in a light warm grey (`#CFC6B5`). Glass gets a sky reflection gradient and a specular streak.

### P7 · Home / UI: Home vs SF title-and-Play keyframe (`visual/p7-home-ui.jpg`, close-ups `ui-*.jpg`)
- **Us 4.0 / SF 4.5.**
- ✅ Our Home is a painted 3D street with a crane sign. It is richer than SF's blurred title card.
- ✅ The logo has an equal level of finish: chunky white/orange with a navy extrusion vs SF's yellow/blue on a red-gold cartouche.
- ✅ The badge (`ui-badge.jpg`) and the round button (`ui-round.jpg`) are close to SF's in build.
- ❌ Play button (`ui-play.jpg`): our gradient is shallower and has no gloss blob; our text is pure white (SF: cream with a soft drop).
- ❌ Our BLAST button when disabled (`ui-cta.jpg`) is a muddy brick-brown that reads as "red / error".
- 🔧 Fix 9.

### Materials close-up (`visual/closeup-materials.jpg`)
Real SF crate, cans and ice next to our wood (L1), brick (L7) and steel (L8).
- SF: big painted motifs and speculars.
- Ours: brick and steel are close to that level. Wood and concrete are behind.

### VFX, ours only (`visual/vfx-ours-L1.jpg`, `visual/vfx-ours-close.jpg`)
- **Us 3.0 / SF n/a** (no real SF frame).
- ✅ The style is right: outlined toon burst, puffy outlined dust, chips, slow-mo at the tip-over.
- ❌ Too small and too short to be a "clip moment": burst ≈ 2 %, dust ≈ 4 % of the screen. The dust is beige on a beige lot.
- 🔧 Fix 6.

### Icon (`visual/icon.jpg`)
- **Us 2.5 / SF 4.5.**
- 🔧 Fix 10.

## 4. Other fixes (beyond the top 10)
- **P2 S, app-dev:** city card contrast +10 % and no haze band; mostly covered by fix 1.
- **P2 S, design:** grass texture with 2 tones of blade clumps instead of uniform speckle, because the lower 40 % of the frame is grass.
- **P2 M, design:** glass material with a sky gradient and a specular streak, used on L32 and other glazed heroes.
- **P2 S, app-dev:** material-tinted debris chips plus 1–2 large chunks per block. Wood chips stay orange; concrete chips stay grey.

## 5. Files
- **Page:** `visual/index.html`.
- **Images it references (16 JPEGs, ≈ 2.1 MB):** p1-hard.jpg, p2-wood.jpg, p3-boss.jpg, p4-silhouette.jpg, p5-steel.jpg, p6-hero.jpg, p7-home-ui.jpg, ui-play.jpg, ui-badge.jpg, ui-round.jpg, ui-cta.jpg, ui-logo.jpg, closeup-materials.jpg, vfx-ours-L1.jpg, vfx-ours-close.jpg, icon.jpg.
- **Real SF images:** `sf-real/` (13 JPEGs + SOURCES.md, ≈ 5.6 MB).
- **Scripts and raw shots:** scratchpad only, not in the repo.
