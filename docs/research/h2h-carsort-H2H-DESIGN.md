# City Blast! v53 vs Car Sort: visual design head-to-head (15/11/2026)

Owner asked: how far is our visual quality from "Car Sort", and what should we change?
This review covers visual craft only (art, light, camera, UI, VFX, motion, polish). It does not judge gameplay.

## Which Car Sort

**Car Sort: Color Puzzle** by **Rollic Games** (Istanbul; Take-Two/Zynga group).
- App Store id 6758138698. Released 26/01/2026. Version 1.4.0 (06/11/2026). Size 488 MB.
- 26,377 ratings, average 4.71 (iTunes lookup API, 15/11/2026).
- It is the only app named "Car Sort" that shows up in the App Store top-grossing estimates. AppCurrents (Aug 2026, modelled) puts it at #91 US games, $190k–1.1M a month. Another chart snapshot (date unclear) puts it at #9.
- Other apps with the same name are much smaller: "Car Sort ·" (LEOGAME, 2.4k ratings), "Car Sort! 3D" (0 ratings), "CarLoop: Block Sort" (UUTEAM, 26.9k ratings, a different name).
- The game is **not** a free 3D parking sim. The camera looks almost straight down on a board of toy cars. You tap cars to send them round a track into garages of the matching colour.

## Sources and limits (please read)

- **Theirs [S]:** the 6 iPhone store screenshots, 6 iPad screenshots, the icon, the description and release notes from the US App Store page and the iTunes lookup API. Saved in `ref/`.
- **Blocked in this session:** YouTube thumbnails (`i.ytimg.com`), Google Play images (`play-lh.googleusercontent.com`), nextbiggames.com and glotier.com. These hosts must be allowed in the network settings before we can get their video frames, win/lose screens or Home.
- So their **Home/meta, win card, lose card, VFX and motion were not seen**. Scores for those are marked **[I]** (my inference from Rollic's usual pattern) and count for less.
- Their store screenshots are near-raw gameplay with a caption band. Rollic may have retouched them a little.
- **Ours [M]:** v53 (`checkpoints/release/index-v53.html`) captured with Playwright at 393×852, DPR 2, touch, SwiftShader. Files are in `ours/`. The L13 run uses the game-time stepper (`research/h2h-design/tools/capture-gametime.js`). Home, Upgrades and the lose card were captured in real time.
- On a win our game shows **no card**, by design (S1, Owner 11/11). The "win" shot is therefore the CLEARED! stamp with confetti, about 0.5 s before the game returns to Home by itself.
- Colour numbers come from a 150-px HSV sample of the play area (no HUD). "High-sat" means S > 0.59 and V > 0.47.

## Verdict in one paragraph

Car Sort is not technically richer than us. They have no physics, no destruction and no hero buildings. They look more **premium** because of discipline:
- **One** art kit.
- A calm, single-hue world (periwinkle/lavender).
- All the colour sits on the objects you touch: 11–12 pure hues, high value contrast.
- A board that fills the screen with even margins.
- A tiny HUD in the same navy-and-lavender as the world.

We have more ingredients, but they fight each other:
- a painted 2D skyline and Home, behind Lambert 3D,
- saturated green grass that is louder than the building,
- beige/grey members with low contrast,
- 35–45 % of the screen empty grass during the collapse,
- 3 locked booster bubbles that clutter the HUD,
- no store screenshots, and an icon that is only a wordmark.

**Average: us 3.0, Car Sort 4.5.** Most of the gap is **A**-type polish: grading, camera, declutter and outline on selected parts. None of it needs new features. Two items need Owner: the icon/brand look, and recolouring the building palette.

## Score table (1 = poor, 5 = best in class)

| # | Dimension | Us | Car Sort | Concrete gap |
|---|---|---|---|---|
| 1 | Colour palette and saturation | 2.5 | 5.0 | Theirs: lavender background, 11–12 pure hues all on the cars, luminance std 52–57. Ours: about the same overall saturation (0.40–0.49 against 0.43–0.47), but it sits on grass and sky. The building is beige/grey, there are 6–7 hues, and luminance std is only 29–37. The subject has the lowest contrast in the frame. |
| 2 | 3D materials (toy look) | 3.0 | 4.5 | Theirs: glossy candy cars with a bright top highlight, rounded bevels and a white rim on the cars you can move. Ours: chamfer, gloss, fresnel rim and warm contact AO are all in the code (`glossMat0`, `chamferMat`). On screen they read as matte beige concrete. L32 glass interiors are good. |
| 3 | Lighting, shadows, AO | 3.5 | 4.0 | Theirs: soft top light, contact AO under every car, no long shadows. Ours: crisp PCF sun shadows (good depth, they ground the building). But the ambient is flat and long shadows criss-cross the sand during the collapse. |
| 4 | Scene composition and camera | 2.5 | 5.0 | Their board fills about 70 % of the screen with even margins and no dead space. Our L13 building covers about 25 %. In the collapse, the bottom 35–45 % is empty grass (`p05`). The painted skyline is busy and competes with the subject. |
| 5 | Readability (0.2 s glance) | 3.0 | 5.0 | Theirs: every object is one colour token, and "?" crates and locks are icons. Ours: thin grey members on beige sand, and TNT placed on red-tinted circles (red on red). |
| 6 | Consistency (one style) | 2.5 | 5.0 | Theirs: one 3D toy kit and one UI colour family. Ours: four styles. Painted raster Home and skyline, Lambert 3D, 2D sticker VFX, and Figma raster tab icons next to flat line icons in Upgrades. |
| 7 | UI kit (buttons, panels, fonts, bevels) | 3.5 | 4.0 | Both use a rounded heavy display font, navy outlines and bevelled pills. Theirs: 4 HUD items, tinted to the world. Ours: a strong green/gold primary and good cards, but 7–9 HUD items in planning. The idle BLAST button is a muddy brown-red, and 3 locked "Lv.31/21/11" bubbles add noise. |
| 8 | VFX and feedback | 3.5 | 3.5 [I] | Ours: sticker burst, swirl rings, toon dust, flying coins, CLEARED! stamp and confetti. This is good cartoon language, but the burst is small next to the screen and the dust is brown-grey. Theirs: only the white selection rim and "check" badges are visible [S]. The rest is unseen. |
| 9 | Motion polish | 3.5 | 4.0 [I] | Ours: build-in drop of the building, slow-mo and an eased camera. Theirs: cars flow along the track (store shot 6). No video could be seen. |
| 10 | Home / meta screens | 4.0 | 3.5 [I] | Ours: a rich painted Home with a glossy tab bar, and a clean Upgrades screen. Theirs: no Home is shown in the store. They boot straight into the board, HUD only [S]. |
| 11 | App icon | 2.5 | 4.5 | Theirs: the hero object (4 rainbow toy cars), no text, maximum chroma on navy, readable at 60 px. Ours: the wordmark only on a pale blue burst. No building and no TNT, and it reads weakly at small size. |
| 12 | Store screenshots | 1.0 | 4.5 | Theirs: 6 portrait shots of real play, each with a 15 % caption band in a different colour and a chunky white outlined caption. Ours: **none yet**. |
| | **Average** | **3.0** | **4.5** | Rows 8–10 for Car Sort are partly [I]. |

Pairs, ours left and theirs right, are in `pairs/`:
- `p01-home` · `p02-level-start` · `p03-planning-tnt` · `p04-blast` · `p05-collapse` · `p06-win` · `p07-lose` · `p08-upgrades` · `p09-icon` · `p10-store-shot` · `p11-materials` · `p12-hud`

## Top 10 gaps, ranked by impact ÷ effort

| Rank | Gap | Impact | Effort | Type |
|---|---|---|---|---|
| 1 | Loud world, quiet subject (grass and skyline louder than the building) | high | S | A |
| 2 | Dead space: bottom 35–45 % empty grass in collapse and win | high | S | A |
| 3 | No store screenshots | high (CVR) | M | A to make, C to upload |
| 4 | HUD clutter: 3 locked booster bubbles and a muddy BLAST button | med | S | A |
| 5 | Selection is not obvious (no white rim like theirs) | med | S | A |
| 6 | Painted skyline does not match the 3D style | med | S (grade) / L (3D) | A / B |
| 7 | Toy materials are under-driven (gloss and AO exist but do not read) | med | S | A |
| 8 | Icon is a wordmark only, with no hero object | high (CVR) | M | B |
| 9 | Building palette is beige/grey, low chroma | high | M | B |
| 10 | Mixed icon styles (flat line icons in Upgrades next to glossy tabs) | low | S | A |

## Fix list (buildable in three.js r128, iPhone 11 budget ≤150 draw calls, ≤100k tris, 60/30 fps)

Measured today: planning draws L13 15 calls / 19k tris and L32 35 / 64k. PERF-STATUS says blast peaks at 44–53 calls. So there is room for about +50 calls and about +30k tris. Every fix below stays inside that.

**F1 · Calm the world (A, 0 calls).**
- Change the grass to a desaturated sage, about HSV S 0.30 (now about 0.65).
- Lower the sand's contrast and texture.
- Add a soft radial vignette on the ground past the lot (one extra CircleGeometry with a gradient alpha, +1 call) or stronger fog at the edges.
- Target: most high-sat pixels on the building, TNT and debris. Today they are mostly grass and sky (by eye, not measured).
- Check play-area luminance std with `tools/hsv.py`: 36 today, target ≥45 (theirs 57).

**F2 · Frame the action (A, 0 calls).**
- Fit the camera to the building plus the debris radius, so the subject fills 45–55 % of the height and its base sits about 8 % above the BLAST row.
- During the collapse, ease the focus down and in with the debris centroid (clamped). The rubble then ends near the middle of the screen, not at 40 % height above empty grass.
- Same rule on the win stamp frame.

**F3 · Store screenshots (A to produce; uploading is C, Owner only).**
- 6 portrait 1290×2796 shots from real captures: hero open, TNT planning, blast, collapse, CLEARED!, map/Home.
- A caption band at the bottom 15 %, a different colour each (our orange, green, blue, purple…), with Fredoka/heavy white outlined captions ("PLAN THE BLAST", "TOPPLE LANDMARKS"…).
- Copy and caption choice: Owner.

**F4 · Declutter the HUD (A).**
- Hide locked booster slots. Show at most one "next unlock Lv.11" chip.
- Make the idle BLAST button a desaturated version of the live orange (same hue, lower S), not brown-red.
- Planning HUD target: ≤5 items.

**F5 · White selection rim like Car Sort (A, +1–3 calls).**
- An inverted-hull outline (back faces, scaled 1.04, unlit white, `depthWrite:false`) on the selected or tappable member and on placed TNT only. Never on the whole building, which would double the tris.
- Also drop the red tint circle under TNT, or make it a white ring, so it is no longer red on red.

**F6 · Grade the painted skyline (A, 0 calls).**
- −30 % saturation, +15 % haze toward the sky colour, slight blur, so it sits behind the 3D like their flat lavender.
- A real low-poly instanced 3D skyline in the same Lambert kit (about +4 calls, +6k tris) is **B**: it is a look change.

**F7 · Drive the toy materials (A, 0 calls).**
- Raise `GLOSS_K` for the structural members toward the `slab` value:
  - concrete/pier: [0.24, 0.48, 0.26] → about [0.36, 0.75, 0.32]
  - brick: [0.24, 0.36] → about [0.34, 0.60]
  - Watch for clipping on the cream frame.
- Raise the warm contact AO strength by about 1.5×.
- Lift `hemi` from 0.62 to about 0.75 and lighten the sky colour, so faces in shade are not grey.
- Lower the sun shadow opacity (`ShadowMaterial`/darkness) to about 0.35 and raise the sun about 10°, so long shadows do not criss-cross.

**F8 · Hero icon (B).**
- Icon = one chunky toy building mid-tilt with a lit TNT and a sticker burst, maximum chroma on a dark navy background, no text or a small "!" only.
- Render it from our own 3D kit (design agent: Blender or three.js) so it matches the game.
- Owner picks from 3 options.

**F9 · Building palette with more chroma (B).**
- Move members from beige/grey to toy pastels by material role: cream and terracotta brick, mint or teal glass, sky-blue steel, butter-yellow wood.
- Keep the role → colour mapping so the material readability rules stay.
- This changes the look set in STYLE-GUIDE / VISUAL-TARGET, so it needs a D-xxx from Owner.

**F10 · One icon style (A).**
- Swap the Upgrades row icons (flat line star, magnet, stopwatch) for glossy 3D raster icons from the same Figma-generated set as the tab bar.

**Not recommended:**
- Adding a win card is B. It reverses S1 (Owner 11/11).
- A full post-process outline pass is too costly at DPR 2–3 on iPhone 11.

## How to re-check after fixes

1. Run the capture again:
   - `research/h2h-design/tools/capture-gametime.js` for L13 (change the viewport to 393×852),
   - `tools/capture-meta.js <game> <out> 13` for Home, Upgrades and a one-TNT run,
   - `tools/capture-result.js <game> <out> 13 lose|win` for the lose card.
   - All of them need `BLAST_LIBS=<scratchpad>/libs NODE_PATH=/opt/node22/lib/node_modules`.
2. Rebuild the pairs.
3. Run `python3 tools/hsv.py <shot> 0 100 600 1050` on the play area. Target luminance std ≥45 (theirs 52–57).

## Files

- `ref/`: Car Sort store shots `cs-store-1..6`, `cs-icon`, `cs-closeup-cars`, `cs-closeup-hud`
- `ours/`: `01-home` … `12-closeup-hud` (v53)
- `pairs/`: `p01` … `p12` (≤180 KB each)
- `tools/`: `capture-meta.js`, `capture-result.js`, `hsv.py`

Sources:
- https://apps.apple.com/us/app/id6758138698
- https://itunes.apple.com/lookup?id=6758138698&country=us
- https://appcurrents.com/charts/us/games (modelled estimate)
- https://www.appbrain.com/stats/appstore-rankings/top_grossing/games/us
- https://nextbiggames.com/2026/04/30/car-sort-by-rollic-color-puzzle-scaling/ (title only, blocked)

## After the look pass (15/11/2026, `main/look.js`, build step `look`, `?look=0` = before)

Group-A fixes F1, F2, F5, F6, F7, F10 are in the main build as one step after `frame`. Render, camera and CSS only: no physics, rule or level number changed (determinism L13 + L2: identical in seq / after / fresh / wait / raf / live). F3 (store shots), F4 (HUD) and the B items (icon, building palette) are not part of this pass.

**What changed**
- F1 + F6 calm world (0 calls): lawn saturation ×0.46 and value ×0.86 (sage) with a haze toward the fog colour from r 22 m to 85 m (the soft edge); sand texture contrast ×0.62 (mixed with its own blurred mip), saturation ×0.86; skyline band saturation ×0.70, +15 % haze (+32 % at its base), slight blur (mip bias 0.9); trees / props sprites saturation ×0.82.
- F2 framing (0 calls): after BLAST the camera keeps the engine's direction and moves along it onto the hero + its debris: subject ~52 % of the play area height (≤ 84 % of the width), base 10 % above the area's bottom (the tray is gone after BLAST), eased in 0.6 s, back out in 0.35 s at the next wave. Standing members are never cut; fragments are trimmed 8–92 %. Planning is not touched; `?frame=0` turns it off with the opening.
- F7 materials (0 calls): `glossMat0` now on the concrete and brick families + slab (concrete [0.36, 0.75, 0.32], brick [0.34, 0.60, 0.30]), contact AO ×1.5 (cap 0.75); hemi 0.70 → 0.80 with a lighter sky colour, key 0.78 → 0.70 and 10° higher, PCF radius 4 → 6.
- F5 rim (+1 call): white inverted hull (~2.5 px) on members holding a placed charge, while planning only; TNT / cutter / cluster sprites draw their own white outline (0 calls); the blast-radius ghost is white, not red.
- F10: Upgrades rows use one glossy set: kit-style burst (Blast Power) and stopwatch (Slow-mo), the Figma TNT render (Starting TNT), the Home's glossy coin (Coin Bonus); Booster Pocket keeps its kit ball.

**Measured** (393×852 or 390×844, DPR 2, scene render incl. shadow pass, peak; expert plan; `?look=0` vs look on, same build)

| Level | Planning calls / tris (off → on) | Blast peak calls / tris (off → on) |
|---|---|---|
| L1 | 27 / 19.4k → 28 / 19.5k | 29 / 37.0k → 29 / 50.2k |
| L12 | 26 / 37.8k → 27 / 37.8k | 27 / 37.9k → 27 / 38.8k |
| L22 | 41 / 39.8k → 42 / 39.9k | 42 / 47.1k → 42 / 59.1k |
| L32 | 52 / 68.3k → 53 / 68.3k | 54 / 78.9k → 54 / 79.3k |

All inside D-blast-PERF (≤ 150 calls, ≤ 100k tris). +1 call in planning = the rim. The blast triangle rise (L1 +13k, L22 +12k) is the existing perf LOD picking the finer bevel because the camera is closer to the subject.

Colour numbers (`tools/hsv.py`, play area 0 100 600 1050, L13):

| Shot | meanS | high-sat px | lum std |
|---|---|---|---|
| v53 planning / blast / collapse | 0.40 / 0.40 / 0.49 | 16 % / 20 % / 37 % | 36 / 36 / 29 |
| look planning / blast / collapse | 0.28 / 0.28 / 0.27 | 3 % / 5 % / 4 % | 36 / 36 / 31 |

The world is calm: the saturated pixels left are TNT, coins, roofs and props. The luminance target (≥ 45) is **not** met: the beige / grey building still has low contrast; that needs F9 (building palette, Owner).

**Re-score** (same 1–5 scale; Car Sort unchanged)

| # | Dimension | v53 | After | Why |
|---|---|---|---|---|
| 1 | Colour palette | 2.5 | 3.0 | Colour moved off the lawn / skyline; the building itself is still beige / grey (F9) |
| 2 | 3D materials | 3.0 | 3.5 | Gloss highlight and contact AO read in close-ups; still not candy toys |
| 3 | Lighting | 3.5 | 3.5 | Softer, shorter shadows and lighter shade faces; still a directional sun look |
| 4 | Composition / camera | 2.5 | 3.5 | Collapse framed on the subject with its base low; settled rubble still leaves ~25–30 % lawn below a wide flat pile |
| 5 | Readability | 3.0 | 3.5 | White rim on TNT and on the charged member, no red-on-red; thin grey members unchanged |
| 6 | Consistency | 2.5 | 3.0 | Skyline graded into the 3D; one glossy icon set in Upgrades; painted Home stays |
| 7–12 | UI kit, VFX, motion, Home, icon, store shots | 3.5 / 3.5 / 3.5 / 4.0 / 2.5 / 1.0 | same | Not in this pass |
| | **Average** | **3.0** (2.92) | **3.2** (3.17) | rows 1–6 alone: 2.83 → 3.33 |

Files: `after/ours/` (shots), `after/pairs/` (ours-after | theirs: p02, p03, p04, p05, p06, p08, p11), `after/before-after-L13.jpg`. The CLEARED! stamp was not caught by this capture run (it shows ~0.5 s); p06 shows the settled rubble at the same moment.
