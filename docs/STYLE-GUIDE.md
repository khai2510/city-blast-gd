# City Blast! — colour and style system v1

Written 2026-11-08 by the art director. Every number here can be put into code as written. Where this guide disagrees with `VISUAL-TARGET.md`, `DESIGN-POLISH.md` or the 2D kit in `games/blast-assets/`, **this guide wins**. `PROTECTED-SPEC.md` is the exception: it stays the source for the protected building, and this guide only repeats its tokens.

- **Why.** In `research/iphone-mirroring-2026-11-08/DESIGN-COMPARE.md` we score 2/5 for world, 2.5/5 for colour, 2.5/5 for type, 2/5 for motion and 2/5 for colour semantics. Smash Fest!, Colony Flow! and Food Hunt score 4–5 on all of them. This guide closes the gap without adding anything to the collapse frames, which already take 30–41 ms on a 4× CPU throttle.
- **Proof.** The reference mockups were rendered in three.js r128, the same build the game uses, with exactly the values below. The 3D in them is real geometry: the backdrop, the lights, the tone mapping and the fog are all live. Screens are 430×932, in `games/blast/ref/style-v1/`:
  - `home-old.png`: Home, Old Quarter;
  - `home-hard.png`: Home on a Hard level;
  - `hud-old.png`: gameplay HUD with a protected neighbour;
  - `home-downtown.png`, `home-skyline.png`, `hud-skyline.png`: the other districts;
  - `palette-sheet.png`: tokens and components.
  
  `palette.js` and `tokens.css` sit next to them and hold the same values in machine-readable form.
- **Figma.** The file is `<figma-file>`, page **"Blast Polish v2"** (`39:2`).
  - Variables collection **"CityBlast"** (`VariableCollectionId:39:3`): 46 colour variables, `ui/*` (§1) and `district/*/sky-top|sky-mid|sky-bottom|fog` (§3).
  - Components:
    - Button (`39:65`): Type = Go / Blast / Hard / Disabled / CantAfford, with text properties Label and Sub;
    - Card / Header (`39:66`);
    - Pill / Coin (`39:71`);
    - Toggle (`39:80`): On / Off;
    - TabBar (`39:81`).
  - Screens (430×932): Home · Old Quarter `39:89`, Home · Hard `39:91`, Gameplay HUD `39:93`.
  - The 3D area in these screens is still a placeholder, because uploading images to Figma was blocked from this session. Drag the renders from `ref/style-v1/` into the locked "3D scene" layer.
- **Owner rules this guide enforces:**
  - warm, uplifting, chunky toy New York;
  - gameplay stays readable;
  - protected buildings stay distinct (cool blue + gold shield);
  - colour roles: **green = go, orange = in-level BLAST, purple = Hard**;
  - no real logos or landmarks. The skyline is generic boxes: no Empire State, no Chrysler spire, no real brand on the cabs.

---

## 0. Colour-role contract (read this first)

| Role | Colour | Used for | Never used for |
|---|---|---|---|
| **Go** | green `#4DBA2F` | PLAY, CONTINUE, NEXT, "can afford", toggles on, the progress fill on Home | in-level actions, warnings |
| **Blast** | orange `#FF6A1A` | BLAST, the in-level goal meter fill, the charge count badge, the X spray on target facades | Home or menu CTAs |
| **Hard** | purple `#7A2BC4` | Hard PLAY button, Hard crane banner, Hard LV pill, Hard map node, the Hard ribbon and vignette | districts, charges, anything that is not Hard |
| **Reward** | gold `#FFC633` | coins, prices, selected tab, PASS bonus fill, the shield badge | CTAs |
| **Info** | header blue `#2F64D6` | card headers, the LV pill on normal levels, secondary buttons | 3D targets (blue in the 3D scene means *protected*) |
| **Danger** | red `#E5322D` | destructive confirms (reset progress), "not enough coins" price text, notification dots | BLAST, fail cards (fail = warm coral or cream, never threatening red) |
| **Protected (3D)** | ice `#D9E8FF` + navy roof `#2F56C4` + gold shield | protected buildings only | targets, backdrop props near the lot |
| **Target (3D)** | warm district slab colour + cream frame + hazard tape + orange X | the building you demolish | protected buildings |

**What this changes in the current code:**
- The cluster charge is purple `#8E5BFF`. Move it to **teal `#13B5B0`**, because purple now means Hard.
- The Skyline district accent is violet `#8E5BFF`. Move it to **sunset pink `#F2557A`**.
- The Downtown accent is blue `#5B8DEF`. Move it to **cab yellow `#FFB400`**, because blue means protected.
- The target palette `PALETTES` has blue, purple and teal entries. Move it to **warm only**.
- Steel members (`#4B6BC6`) read as "protected blue". Move them to **gunmetal `#5E6B7D`**; the hazard stripes carry the "steel" read. This is a proposal for the owner, because it changes how the material reads (§10, item P-1).

---

## 1. UI palette tokens (CSS)

Every coloured surface uses four shades:
- **top**: the gradient start, at the top of the face;
- **face**: the main colour;
- **rim**: the inner bottom lip, 6 px;
- **outline (ol)**: the 3 px border, the text stroke and the drop lip.

Text on a coloured surface is stroked in **that surface's outline colour**, not in a global ink. This is what Smash Fest! and Colony Flow! do, and it is why their labels read richer than ours.

```css
:root{
  /* role colours: top / face / rim / outline */
  --go-top:#8EE04E;    --go:#4DBA2F;    --go-rim:#2E8A1C;    --go-ol:#1E3A12;     /* CTA green */
  --blast-top:#FFA53A; --blast:#FF6A1A; --blast-rim:#C8410A; --blast-ol:#5A1A05;  /* in-level BLAST orange */
  --hard-top:#A86BF0;  --hard:#7A2BC4;  --hard-rim:#4E1784;  --hard-ol:#2A0B4D;   /* Hard purple */
  --gold-top:#FFE27A;  --gold:#FFC633;  --gold-rim:#E59A00;  --gold-ol:#7A4A00;   /* coin gold */
  --blue-top:#5A8EF2;  --blue:#2F64D6;  --blue-rim:#1D449E;  --blue-ol:#0F2A66;   /* card header blue */
  --danger:#E5322D;    --danger-rim:#A8161B;
  /* neutrals */
  --cream:#FFF4DC; --cream-top:#FFFAF0; --cream-bot:#FFEBC8; --cream-line:#F1DDBC;  /* cream card */
  --ink:#2B2140;   /* text dark AND outline dark (= the 2D asset kit's stroke, so SVG icons match) */
  --ink-2:#6E6380; /* secondary text */ --ink-3:#A79FB5; /* disabled icon */
  --off:#C9C2B8; --off-rim:#9E968B; --off-ol:#6F675E; --off-text:#F4EFE7;            /* disabled */
  --text-light:#FFF8E1;   /* label fill on coloured buttons: warm cream, never #FFF */
  --scrim:rgba(43,33,64,.50);
  --f-display:"Luckiest Guy","Nunito",system-ui,sans-serif;
  --f-body:"Nunito",system-ui,sans-serif;
}
```

Contrast checks (WCAG, normal text):
- `--ink` on `--cream`: 14.6:1.
- `--ink-2` on `--cream`: 5.2:1.
- `--text-light` on `--go`: 2.4:1 for the fill alone. This passes as "large text with an outline", because the 3 px `--go-ol` stroke gives about 15:1 against the face. **Never ship a light label without its stroke.**

---

## 2. Text styles

Fonts are already inlined in `index.html`: Luckiest Guy for display, Nunito 900 for body and numbers. Strokes use `-webkit-text-stroke` with `paint-order:stroke fill`, so the **visible** outline is half the stroke value. `--ol` is the outline of the surface the text sits on; on the 3D scene or the sky it is `--ink`.

| Style | Font, size / line height | Fill | Stroke (visible) | Shadow | Used for |
|---|---|---|---|---|---|
| `t-logo` | Luckiest Guy 76/0.9 ("BLAST!"), 40 ("CITY"), rotate −3° | `#FF8A1F` / `--text-light` | 10 px (5) `--ink` | `0 6px 0 --ink` | Logo |
| `t-xl` | Luckiest Guy 40/1 | `--text-light` | 8 px (4) `--ol` | `0 4px 0 --ol` | PLAY, BLAST!, TIMBER!, CLEARED! |
| `t-l` | Luckiest Guy 32/1 | `--text-light` or `--gold-top` for rewards | 6 px (3) `--ol` | `0 3px 0 --ol` | Card titles, popups, `+20` |
| `t-m` | Luckiest Guy 24/1 | `--text-light` | 6 px (3) `--ol` | `0 2px 0 --ol` | Card header, secondary button, Home tab label |
| `t-s` | Luckiest Guy 18/1 | `--text-light` | 4 px (2) `--ol` | `0 2px 0 --ol` | Button sub-label ("LEVEL 7"), LV pill, badges |
| `t-num` | Nunito 900 20/1, `tabular-nums` | `--ink` | none | none | Coin count, prices, % |
| `t-body` | Nunito 800 16/1.3 | `--ink` | none | none | Coach marks, card body (≥16 px) |
| `t-label` | Nunito 900 13/1, `letter-spacing:.06em`, uppercase | `--ink-2` | none | none | District labels, "PASS 80%" |

**Rules:**
- No display text without a stroke.
- No pure `#FFFFFF` fill: use `--text-light`.
- Popups (TIMBER!, COMBO) keep the existing gold gradient fill from `INTEGRATION.md`, with a 12 px stroke in `--ink`.
- Body copy never uses a stroke.

---

## 3. Per-district 3D palettes

**How to use these values:**
- All hex values are sRGB.
- With `outputEncoding = sRGBEncoding` (§4), every **material and instance colour** must be converted: `new THREE.Color(hex).convertSRGBToLinear()`, or `_c.setHex(x).convertSRGBToLinear()`.
- **Fog is the exception.** In r128, `fog_fragment` runs *after* `tonemapping_fragment` and `encodings_fragment`, so the fog colour is mixed in display space. Pass the **raw sRGB hex** to `THREE.Fog` and do not convert it. Converting it makes the far layer darker than the CSS horizon, and you can see the seam. This was verified in the r128 shader chunk order.
- The sky stays a CSS gradient behind the transparent canvas. `alpha:true` is kept, and the sky costs 0 draw calls. The gradient stops are **top 0%, mid 42%, bottom 62%**. The fog colour equals the gradient bottom, so the far skyline melts into the horizon.

| Token | Old Quarter (brownstone morning) | Downtown (Midtown midday) | Skyline (golden hour) |
|---|---|---|---|
| `sky.top` | `#3FA9F5` | `#2E9BF0` | `#3E7FE0` |
| `sky.mid` | `#9FD6FF` | `#8CCBFF` | `#F6A9A0` |
| `sky.bottom` = `fog` | `#FFE2B0` | `#FFF0CC` | `#FFC98A` |
| fog near / far (m) | 60 / 190 | 65 / 210 | 70 / 240 |
| plaza / ground (paver tile) | `#E6C79A` | `#DCCDB4` | `#E8C2A0` |
| sidewalk | `#EBD6B3` | `#E3D7C2` | `#EDCFB2` |
| street asphalt | `#4A4F5C` | `#454A57` | `#4A4658` |
| lane marks | `#F4E9D2` | `#F4E9D2` | `#F4E9D2` |
| curb (gameplay "street" edge) | `#FFC633` | `#FFC633` | `#FFC633` |
| demolition lot | `#E9B877` centre → `#D9A15C` edge | same | same |
| backdrop facades (pick per building) | `#C8573A` brick, `#A0563B` brownstone, `#E58A4E` terracotta, `#F2B544` mustard, `#F3DDB3` cream, `#8FB07A` sage | `#EAD7B5` limestone, `#D9A86C` sandstone, `#C9643E` brick, `#F5E6C8` deco cream, `#6E9C9A` patina, `#9A8F86` granite | `#F59A6B` sunset glass, `#E8737A` rose, `#FFD08A` amber, `#5F7FB8` shade blue, `#F6E3C6` cream, `#8C7FA6` dusk grey |
| roof / cornice | `#6B3A2A` / `#F3E6CC` | `#5B5560` / `#FFF4E0` | `#4A4060` / `#FFE9CF` |
| backdrop window glass / lit (18 %) | `#34405E` / `#FFD27A` | `#3B4A66` / `#FFE3A3` | `#4A5A86` / `#FFCF7A` |
| far silhouettes (3 value steps) | `#E9B48E` `#F0C7A0` `#F7D8B4` | `#B9C9D8` `#CBD8E2` `#DDE6EA` | `#9FB0D0` `#B7C2DB` `#CDD3E3` |
| **target slab** (replaces `PALETTES`, cycle per level) | `#F0702A` `#E8553A` `#F59E2E` | `#FF8A1F` `#F2683A` `#FFB02E` | `#F2557A` `#FF7A3D` `#FF9E5A` |
| target frame (columns) | `#F2D3A6` | `#F2D3A6` | `#F2D3A6` |
| target glass (opaque, dusty) | `#6F9DB5` | `#6F9DB5` | `#6F9DB5` |
| debris dust tint | `#E8CFA6` | `#E6D3B5` | `#F0CDB0` |
| district accent (map card, UI) | `#E8703A` | `#FFB400` | `#F2557A` |

**Protected building** (`PROTECTED-SPEC.md`, unchanged in every district):

| Element | Value |
|---|---|
| walls | `#D9E8FF` |
| roof and slab edges | `#2F56C4` |
| trim | `#FFFFFF` (the only pure white in the scene) |
| lit windows | `#FFD866`, emissive `#FFB938` ×0.55 |
| base | `#B9D3F5` |
| ground halo | `#5FB8FF` ring at 40 % |
| floating badge | gold shield `#FFC633`, rim `#1E2F6B` |

Backdrop rules that protect readability:
1. **No blue or purple** in the near backdrop. Shade blue `#5F7FB8` is allowed only in Skyline's near row, where it sits at least 18 m from the lot and is fogged 20–40 %.
2. **The target is the most saturated object on screen.** Backdrop facades are at saturation ≤ 0.65; target slabs are at 0.75–0.85. Fog takes the backdrop down another 20–50 %.
3. **No prop between the camera and the play lot.** Lamps, trees and hydrants skip `|x| < 8 m` on the near sidewalk. Cabs may drive in the street (`z` ≥ the street line), but they pause when the phase is `boom` or `settle`.
4. **Height caps.** The near row, behind the lot, is ≤ 1.0× the target's height in Old Quarter and ≤ 0.9× in the other districts. The sky must stay visible behind the logo on Home (§6). In metres: near / mid / far heights are 6–10 / 8–15 / 14–30 for Old Quarter, 7–11 / 9–17 / 22–48 for Downtown, and 7–12 / 11–21 / 30–62 for Skyline.

---

## 4. Renderer and lighting rig

### 4.1 Renderer (r128 support checked)

```js
renderer.outputEncoding = THREE.sRGBEncoding;            // r128: yes (THREE.sRGBEncoding = 3001)
renderer.toneMapping = THREE.ACESFilmicToneMapping;      // r128: yes (enum 4). r128 has NO AgX / Neutral.
renderer.toneMappingExposure = 1.25;                     // ACES darkens mid-tones ~20 %; 1.25 returns the hexes above to their authored value
renderer.physicallyCorrectLights = false;                // keep (r128 default); intensities below assume it
renderer.shadowMap.type = THREE.PCFShadowMap;            // keep: in r128 shadow.radius works with PCF only; PCFSoftShadowMap IGNORES radius
renderer.shadowMap.autoUpdate = false;                   // keep (already event-driven via shadowDirty)
// every CanvasTexture / data-URI texture that carries colour: tex.encoding = THREE.sRGBEncoding
```

- **"PCFSoft radius".** r128 has no adjustable PCFSoft radius. PCFSoft is a fixed 5×5 kernel and `shadow.radius` is ignored with it. Keep `PCFShadowMap` with `radius = 3`, which is the soft look we want and is already in the code.
- **Hand-tuned colour paths.** The `MeshBasicMaterial` colours (curb, dashes, fx flash, rings, dust sprites) also need `convertSRGBToLinear()`. Without it they come out about 25 % too light.

### 4.2 Light rig per district

Every district uses three lights: one hemisphere light, one shadow-casting key and one non-shadow fill. Convert every light colour with `convertSRGBToLinear()`. The key position is `40 × (sin az · cos el, sin el, cos az · cos el)`, with `az` = 0 at the camera's side and negative values to the left.

| | Old Quarter | Downtown | Skyline |
|---|---|---|---|
| Hemisphere sky / ground / intensity | `#FFF1D6` / `#C98F5A` / 0.62 | `#FFF6E6` / `#B8926A` / 0.60 | `#FFE0C8` / `#A8736A` / 0.60 |
| Key colour / intensity | `#FFE2B0` / 1.05 | `#FFEFD2` / 1.10 | `#FFC58A` / 1.15 |
| Key azimuth / elevation | −35° / 48° | −30° / 55° | −55° / 28° (long sunset shadows) |
| Key position (x, y, z) | (−15.4, 29.7, 21.9) | (−11.5, 32.8, 19.9) | (−28.9, 18.8, 20.3) |
| Fill (no shadow) colour / intensity / position | `#9FCBFF` / 0.28 / (25, 12, −20) | `#A8D4FF` / 0.30 / same | `#8FB4FF` / 0.35 / same |
| Shadow | 1024 (2048 on the high tier, as now), radius 3, bias −0.0005, normalBias 0.02 | same | same, and widen the frustum by +6 m on the shadow side, because the low sun throws long shadows |

- **Key direction.** The key moves from the current front-right `(14, 34, 22)` to **front-left**. This matches the 2D kit rule "light from the top-left": every icon, coin and button highlight is top-left, so the 3D world and the UI finally agree. Shadows fall back-right, beside the building, where they show the footprint.
- **Fill light.** It is the cool rim from the back-right that separates the warm building from the warm backdrop.
- **Measured targets.** These were read off the mockups:
  - lit target slab V 0.88–0.94;
  - shaded face V 0.60–0.70;
  - lot in shadow about `#B98552`;
  - nothing above V 0.97 except the protected building's trim.

**Hard levels** change no lights, no fog and no 3D colours. Readability is the same as on normal levels; Hard is carried by the UI (§7).

---

## 5. Materials

| Rule | Value | Cost |
|---|---|---|
| **Everything stays `MeshLambertMaterial`.** In r128, Lambert is lit **per vertex** (Gouraud). Our geometry is flat boxes with the chamfer, so it looks the same as per-pixel lighting at the lowest cost. | — | baseline |
| Do **not** move to `MeshStandardMaterial` | It lights per fragment with PBR, at roughly 2–3× Lambert's fragment cost, and the collapse frames are already over budget | — |
| Do **not** use `MeshToonMaterial` | It lights per fragment (Phong path) at about 1.5–2× Lambert's cost, and hard bands fight the soft hand-painted look we want | — |
| Target glass: opaque | `MATS.glass`: `transparent:false, opacity:1, depthWrite:true`, colour `#6F9DB5`. Removes transparent sorting and the "bird cage" look | **saves** a sort and the overdraw |
| Per-floor AO, baked into the instance colour | Multiply the instance colour by `min(1, 0.82 + 0.06·floor)` in `buildInstances` (floor 0 = 0.82, floor 3 and up = 1.0). Rubble at rest ×0.85 | 0 (build time only) |
| Existing ±5 % value jitter (`0.92 + rnd·0.1`) | Keep | 0 |
| Fake AO contact blob | One `InstancedMesh` of a `PlaneGeometry(1,1)` with a 128 px radial texture: `rgba(90,58,30,.55)` at the centre, `.30` at 55 %, 0 at the edge. Instance per building, scaled to footprint ×1.3, `y = 0.05`, `depthWrite:false`, `polygonOffset −2/−2`. The opacity follows the standing share of mass, set on collapse; for 1 instance per building, set `material.opacity` | **+1 draw call**, about 20k px of fill, ~0 CPU |
| Protected rim (fresnel) | `onBeforeCompile` on the keep material only: `gl_FragColor.rgb += keepRim * pow(1.0 - abs(dot(normal, viewDir)), 2.0) * k`, with k = 0.35 at rest and 0.9 when the building pulses | +1 shader variant (compile once at boot with `renderer.compile`), about 6 ALU per fragment on keep pixels only. Negligible |
| Outlines on 3D | **None**, the same as the references | 0 |
| Optional inverted-hull outline | Only if the owner asks: the boss target only, `BackSide`, ×1.03, `--ink`. Costs +1 draw per member family and +100 % of its vertices. Not recommended |
| Hazard tape and X spray | Tape: a 256×32 canvas texture, yellow `#FFB400` and ink `#2B2140` stripes at 45°, one plane on the ground floor of the street face. X spray: a 128 px canvas with an orange `#FF6A1A` 18 px stroke, one plane with `polygonOffset` | +2 draw calls, built once per level |
| Ground | Plaza: a 64 px paver tile (1 px darker joint at 10 %, 1 px light bevel), `RepeatWrapping`, repeat 110 on the r 150 disc. Lot: a 256 px radial-vignette texture with speckle | 2 textures, 0 extra draws (they replace the colours on existing meshes) |

---

## 6. District backdrop (New York, low-poly, 3 parallax depths)

**Approach.** Generate the backdrop with a seeded RNG (`mulberry(districtIndex)`), so it is the same every time a district is played.
- **Build it once per district**, the first time a level of that district starts, then keep it and toggle `visible`. A new level only moves the street.
- Every mesh uses `frustumCulled = false`. This is needed: r128's `InstancedMesh` culls by the base geometry's bounding sphere, not by its instances, so the whole set disappears at screen edges.
- Every mesh uses `matrixAutoUpdate = false`, `castShadow = receiveShadow = false`, and `fog: true`.

| Depth | z (m from the lot centre) | Content | Geometry | Draws |
|---|---|---|---|---|
| **Near row** | −16 to −18, x −46 to +46, plus 2 flank blocks at x ±24, z −4 | Row houses. Each is a body box, a cornice box (+0.35 m wider, 0.5 m tall, cornice colour) and a window grid of thin boxes (0.08 m deep; a row every 2.4 m from 2.2 m up; 18 % lit). **Fire escapes** on 55 % of facades wider than 3 m, Old Quarter and Downtown only: per storey, a platform (w × 0.42, 0.08 × 1.0 m), a rail (0.06 m) and a zig-zag ladder (0.12 × 2.4 m), colour `#2E2A36`. **Water towers** on 35 % / 50 % / 25 % of roofs (by district): a barrel (Cylinder r 0.75, h 2.2, 10 segments, `#9A5B32`), a cone roof (`#5A3B2A`) and 4 legs | One shared unit `BoxGeometry(1,1,1)` `InstancedMesh` (Lambert, instance colour) for **all** boxes in the near and mid rows, plus 1 cylinder and 1 cone `InstancedMesh` | **3** |
| **Mid row** | −42 to −48, x −70 to +70 | The same generator with larger widths and the mid height range; fog hides the detail | (in the shared box mesh) | 0 |
| **Far silhouettes** | −110 to −125, x −120 to +120, gaps 2–10 m | Plain towers in the 3 far colours, unlit `MeshBasicMaterial` with `fog:true`. They give the "skyline" read | 1 `InstancedMesh` of unit boxes, about 15 instances | **1** |
| Street life | the street line | **Yellow cabs**: 4 per district. Each is a body (3.6 × 0.9 × 1.7, `#FFC21A`), a cabin (1.9 × 0.6 × 1.5), a dark window band (`#2B2140`) and a roof sign (`#FFF4D6`, no text or logo), in their own 16-instance mesh, so the per-frame upload is 1 KB. **Street lamps**: post 0.18 × 4.4, arm, head `#FFE7A8`, every 10 m, skipping \|x\| < 8. **Street trees** (Old Quarter): trunk box plus an `IcosahedronGeometry(0.6, 0)` crown in `#5DBB4A` | cabs 1; lamps in the shared box mesh; crowns 1 | **2** |
| **Crane** | mast at (7.6, 0, −3.5), height = target height + 5.4 m | A lattice mast (4 corner posts plus a rung every 1.6 m), an 18 m jib pointing −x over the lot, a counter-jib, a cab and a counter-weight, all `#FFB400` with an `#2B2140` counter-weight. Its own `Group`, so the jib can sway. In gameplay the crane is **hidden** or parked out of frame, so it never crosses the HUD or the target | 2 `InstancedMesh` (mast, jib) | **2** |
| **Level banner** (Home only) | hangs from the jib tip on 2 cables, 2.9 m drop | A 6.2 × 2.6 m plane with a 620×260 `CanvasTexture`, drawn after `document.fonts.load("120px 'Luckiest Guy'")`. Style: §7 Button "Go", or "Hard" plus a "⚠ HARD ⚠" line | plane plus a 2-instance cable mesh | **2** |

**Budget (measured on the mockup scenes, whole frame: ground, target, protected neighbour, backdrop and street):**

| | Measured | Budget |
|---|---|---|
| Draw calls, whole scene | 18–20 | Backdrop ≤ 8 calls; whole scene ≤ 80 (VISUAL-TARGET §8) |
| Triangles, whole scene | 11.6k (Old Quarter) – 14.3k (Downtown) | Backdrop ≤ 12k; whole scene ≤ 60k |
| Instances in the shared box mesh | 730–918 | ≤ 1,200 |
| Shadow-pass draws added by the backdrop | 0 | 0 |
| Per-frame CPU for the backdrop | 0 static. Animated: cabs 16 matrices + crane jib + banner ≈ 0.02 ms | ≤ 0.1 ms |
| Build time per district (first visit) | ≈ 2–4 ms on desktop, ≈ 8–15 ms at 4× CPU (one-time, at district entry, not in `startLevel`) | ≤ 20 ms, once |

---

## 7. Home scene composition (430×932 reference; scale with `--ui`)

The Home layout runs top to bottom: logo, then the level on the crane banner in the 3D scene, then the target building, then the district progress, then PLAY, then the tabs. This follows Colony Flow ("LEVEL 22" on a sign) and Food Hunt ("Level 22 Hard" cube), and the logo never overlaps the building.

| Element | Box (x, y, w × h) | Notes |
|---|---|---|
| Coin pill | 14, 14, auto × 44 | Pill §8, with a green `+` |
| Settings | right 14, 10, 52 × 52 | Round, gear icon |
| Logo | centred, y 62–160 | "CITY" 40 px over "BLAST!" 76 px, rotated −3°. Nothing in 3D may be taller than y = 165 except the crane jib, which may pass *behind* the logo's lower half |
| Crane banner (3D) | centred on the target, y ≈ 175–235 | "LEVEL 7". On Hard: purple, "⚠ HARD ⚠" + "LEVEL 8" |
| Target building (3D) | y ≈ 255–580 (top at 27 %, base at 62 %) | Title camera: fov 34, position (8, 11, 64), lookAt (−0.4, 4.4, 0) for a 13 m building; scale the distance with the building height |
| District progress card | centred, 300 × 34, y 598 | "OLD QUARTER 6/10", a 10 px green bar, "→ DOWNTOWN" |
| Hard tag (Hard only) | centred, y 646, over the PLAY top edge | Gold pill, "⚠ HARD LEVEL" in purple, 3 px `--hard-ol` border |
| PLAY | x 43–387 (80 %), y 680, h 74 | Button "Go" (or "Hard"): "PLAY" in `t-xl` plus the sub-label "LEVEL 7" in `t-s` |
| Tab bar | bottom 6, 3 tabs, h 60 (active 72) | Upgrades · **Home** · Map, with a red dot on Upgrades when an upgrade is affordable |
| Hard vignette | full screen, under the UI | `radial-gradient(ellipse 75% 60% at 50% 45%, rgba(122,43,196,0) 60%, rgba(122,43,196,.28) 100%)` |

**Idle animations on Home** (all are paused when Home is hidden):

| Motion | Value |
|---|---|
| Crane jib sway | `rotation.y = sin(t·2π/8)·4°` |
| Banner swing (pivot at the jib tip) | `rotation.z = sin(t·2π/3.2)·3°` |
| Cabs | Drive along x at 6 m/s and wrap at ±40 m; one cab is parked |
| PLAY breathe | 1.00 → 1.04 → 1.00 over 1.6 s, plus a sheen sweep every 3 s (already in the code) |
| Optional extras | Pigeons (2 grey quads circling a roof, period 6 s); one rooftop steam puff from the dust pool every 4 s at opacity .35 |

---

## 8. UI components

| Component | Spec |
|---|---|
| **Button**: base | `min-height:56px` (PLAY and BLAST 74–76), `border-radius:22px`, `border:3px solid var(--ol)`, `background:linear-gradient(180deg,var(--top) 0%,var(--face) 62%)`, `box-shadow: inset 0 3px 0 rgba(255,255,255,.38), inset 0 -6px 0 var(--rim), 0 4px 0 var(--ol), 0 8px 10px rgba(43,33,64,.18)`. Label: `t-xl` or `t-m` with stroke `var(--ol)`. Variants set `--top/--face/--rim/--ol` from the role (go, blast, hard, gold, blue) |
| Pressed (`:active`) | `transform:translateY(4px)`; shadow becomes `inset 0 3px 0 rgba(255,255,255,.25), inset 0 -2px 0 var(--rim)` with no drop lip. Press 90 ms `--ease-out`, release 140 ms `--ease-back` |
| Disabled | top `#D9D2C8`, face `--off`, rim `--off-rim`, outline `--off-ol`, label `--off-text`. No breathe, no sheen. BLAST before a charge is placed uses this grey, **not** pale red (REPORT §3) |
| Can't afford | Shape and lip unchanged, face `--cream` (top `#FFFFFF`), rim `#E3CFA6`, outline `--ink`, label `--ink` with no stroke, price in `--danger` Nunito 900 18 with a coin icon. Tapping it shakes the button: x ±6 px, 3 cycles, 240 ms. It does not look disabled, but it clearly says "need more" |
| Can afford (Upgrades) | Gold button, plus a 3 px inset `--go` ring on the card, plus a red dot on the Upgrades tab |
| **Card with header** | Body: `border:3px solid var(--ink)`, `border-radius:24px`, `linear-gradient(var(--cream-top),var(--cream-bot))`, `box-shadow:0 6px 0 rgba(43,33,64,.28)`. Header: `linear-gradient(var(--blue-top),var(--blue))`, `border-bottom:3px solid var(--ink)`, padding 10/14/9, title `t-m` stroked `--blue-ol`. Headers can be Win `--go`, Fail `--blast` (warm, not red) or Hard `--hard` |
| **Pill** | `height:44px`, `border-radius:22px`, `border:3px solid var(--ink)`, `linear-gradient(#FFF,var(--cream))`, lip `0 4px 0 rgba(43,33,64,.28)`, `t-num` text. The LV pill uses blue (`--blue-top → --blue`, stroke `--blue-ol`), or purple on Hard. The `+` button inside is 26 px with a go gradient |
| **Tab bar** | 3 tabs, gap 8, side padding 12. Tab: h 60, radius 18, cream with a 3 px ink border. Active tab: h 72, gold gradient, inner rim `--gold-rim`, label `t-s` in ink. Notification dot: 20 px `--danger` with a 3 px white border and a 2 px ink ring |
| **Toggle** | 64 × 34, radius 17, 3 px ink border. On: `--go` with an inner rim `--go-rim`, knob on the right. Off: `--off` with rim `--off-rim`, knob on the left. Knob: 24 px white with a `0 2px 0` ink shadow at 35 %. Knob slide 160 ms `--ease-back` |
| **Goal meter** (in-level) | h 30, 3 px ink border, track `#3A2F52`, fill `linear-gradient(--blast-top,--blast)`, switching to gold `#FFE27A → #FFB400` at ≥ PASS. PASS marker: a 10 × 38 cream bar with a 3 px ink border. Label `t-s` |

---

## 9. Motion tokens

```css
:root{
  --ease-out:cubic-bezier(.22,1,.36,1);   --ease-back:cubic-bezier(.34,1.56,.64,1);
  --ease-inout:cubic-bezier(.65,0,.35,1); --ease-in:cubic-bezier(.55,0,1,.45);
}
```

| Motion | Duration | Easing | Values |
|---|---|---|---|
| Button press / release | 90 / 140 ms | out / back | translateY 0 → 4 px → 0 |
| CTA breathe (PLAY, CONTINUE) | 1600 ms loop | inout | scale 1.00 → 1.04 → 1.00 |
| CTA sheen | 600 ms sweep every 3000 ms | out | a 30 %-wide skewed white band at 55 % |
| BLAST becomes ready | 2 × 200 ms, then breathe | back | scale 1 → 1.08 → 1 → 1.08 → 1 |
| Popup in (TIMBER!, COMBO) | 300 ms in, hold, 200 ms out | back | scale 0 → 1.2 → 1.0; out: y −14 px, opacity 0 |
| Card in (win, fail) | 300 ms | back | scale .85 → 1.05 → 1.0, opacity 0 → 1 |
| Ribbon drop | 250 ms | back | y −46 px → 0 |
| Reward rows | 150 ms stagger | out | x −14 px → 0, opacity |
| CONTINUE appears | delay 800 ms, 200 ms | out | y 8 px → 0, then breathe 1.03 |
| Coin fly | 600 ms, 40 ms stagger, ≤ 15 coins | `cubic-bezier(.5,0,.75,1)` for x, out for y (arc) | then the coin pill bumps 1 → 1.15 → 1 in 120 ms |
| Counter tick | per frame, at most 1 write per frame | linear | — |
| Hard warning banner | 1200 ms total | back in, fade out | scale 0 → 1.15 → 1; hold to 80 %; then opacity 0 |
| Iris Home → level | 350 ms | inout | circle clip 150 % → 0 → 150 % |
| Camera build-in | 600 ms | out (critically damped) | from pitch +0.1 rad down to the plan pose |
| Screen shake (detonation) | 250 ms | exp decay | 8 px at 430 w; smooth noise, not random jumps |
| Slow-mo at PASS | 500 ms | — | timeScale 0.4, then back over 200 ms |
| Tab switch | 160 ms | back | active tab height 60 → 72, icon scale 1 → 1.1 |
| Toggle | 160 ms | back | knob x |
| Can't-afford shake | 240 ms | linear | x ±6 px, 3 cycles |
| Idle crane sway / banner / cabs | 8 s / 3.2 s / continuous | sine | ±4° / ±3° / 6 m/s |

Animate only `transform` and `opacity`. Never animate `-webkit-text-stroke`, width or box-shadow: stroked text then re-rasterises every frame on iOS.

---

## 10. Mapping table: current code → new value

Line numbers are for `games/blast/index.html` as of 2026-11-08. The file is being edited in parallel, so numbers drift by a few lines; the **search text** is the reliable key. **(3D)** marks colours that also need `.convertSRGBToLinear()` after §4.1 is applied.

### 10.1 CSS tokens and rules

| Line | Search text | Now | New |
|---|---|---|---|
| 11 | `--sky1:#4FB4FF; --sky2:#BDE6FF; --sky3:#FFE7B3;` | one sky | per district: `--sky1/2/3` = `sky.top/mid/bottom` from §3, set on `#stage` when the district changes (`stage.style.setProperty`) |
| 42 | `linear-gradient(180deg,var(--sky1) 0%,var(--sky2) 48%,var(--sky3) 70%)` | stops 0/48/70 | stops **0 / 42 / 62** |
| 39–41 | 3 white `radial-gradient` clouds | `.85/.75/.7` | keep, at opacity `.7/.6/.55` (less milky over the skyline) |
| 12 | `--ink:#3B2617` | brown ink | `#2B2140` (one ink everywhere) |
| 12 | `--ink2:#7A5A3E` | | `#6E6380` |
| 12 | `--card:#FFF8EA` | | `#FFF4DC` (`--cream`) |
| 13 | `--coral:#FF5A3C; --coral-d:#D63A1E` | BLAST and danger mixed | BLAST: `--blast:#FF6A1A`, `--blast-rim:#C8410A`. Danger uses: `--danger:#E5322D` |
| 14 | `--mint:#2FC17E; --mint-d:#1C9A5F` | | alias to `--go:#4DBA2F`, `--go-rim:#2E8A1C` |
| 14 | `--grape:#8E5BFF` | | remove; Hard uses `--hard`, cluster uses `#13B5B0` |
| 283 | `--go1:#8BE38F; --go:#3FB35D; --go-d:#25813F` | | `--go-top:#8EE04E; --go:#4DBA2F; --go-rim:#2E8A1C; --go-ol:#1E3A12` |
| 283 | `--hard:#7A2BC4; --hard-d:#4E1784` | | keep, and add `--hard-top:#A86BF0; --hard-ol:#2A0B4D` |
| 285–286 | `-webkit-text-stroke:6px var(--txc)` on all display text | ink stroke everywhere | stroke `var(--ol, var(--txc))`. Set `--ol` per surface: `.big.go{--ol:var(--go-ol)}`, `.big.hard{--ol:var(--hard-ol)}`, `#blast{--ol:var(--blast-ol)}` |
| 290 | `.big.mint,.big.go{…}` | flat gradient + lip | the §8 Button recipe with go tokens |
| 291, 302 | `#A963F2,var(--hard)` | | `var(--hard-top), var(--hard)`, plus inner rim `--hard-rim`, border `--hard-ol` |
| 292–293 | `.big.sec … #9AA4C4,#6E7AA3` | grey-blue | blue role: `--blue-top`, `--blue`, rim `--blue-rim`, ol `--blue-ol` |
| 294 | `.big:disabled{background:#D9D1C5 … #B3A998 … #F4EFE7}` | | `#D9D2C8 → #C9C2B8`, rim `#9E968B`, border `#6F675E`, label `#F4EFE7` |
| 109 | `#blast … -webkit-text-stroke:2px #8F2A12` | | `6px #5A1A05` (`--blast-ol`) |
| 113–118 | `#blast` border-image SVGs: `%23D63A1E` rim; disabled `%23D9928A` | coral | rim `%23C8410A`, face `%23FF6A1A`, top `%23FFA53A`; disabled face `%23C9C2B8`, rim `%239E968B` |
| 55–56 | `#mFill … #FF8A6E,#FF5A3C` | coral | `#FFA53A, #FF6A1A` |
| 74 | `#meter … background:rgba(43,33,64,.82)` | | `#3A2F52`, 3 px `--ink` border |
| 67, 206 | `#FFE27A,#FFB400` (PASS reached) | | keep |
| 156 | `.card … linear-gradient(#FFFAF0,#FFECCC)` | | `--cream-top → --cream-bot`, plus a header element (§8) |
| 159–161 | `.big … #45D892,var(--mint)` / `.big.red … #FF7A55,var(--coral)` | | `.big` = go recipe. Use `.big.red` only for destructive confirms → `--danger` / `--danger-rim` |
| 165–166 | `#title .logo … text-shadow:0 6px 0 var(--coral-d)` | "BLAST RUSH" over the tower | §2 `t-logo`: "CITY / BLAST!", fill `#FF8A1F`, stroke 10 px ink, shadow `0 6px 0 var(--ink)`. Position y 62–160 (§7) |
| 172 | `.big.mint{… #8BE38F,#3FB35D … #25813F}` | | go tokens |
| 223–226 | `.up button … #FFD866,var(--sun)`; `:disabled{#EADBC2 … #CDB894 … #A08868}` | beige "looks off" | affordable: the gold recipe. Can't afford: §8 "Can't afford" (cream, ink label, red price) |
| 239, 352 | `.node.boss` | coral then gold | gold recipe (keep 352) |
| 312 | `.rdot{background:#FF3B30` | | `--danger #E5322D` |
| 319 | `.pillbtn.tog.off .sw{background:#A89E92}` | | `--off #C9C2B8`, inner rim `--off-rim`. On state: `--go` |
| 320–321, 325 | `#resetAsk … #C2361C`, `#B22A12`; `.pillbtn.danger{background:#E0362A}` | | `--danger-rim #A8161B`; `--danger #E5322D` |
| 155, 315 | `.dim{rgba(59,38,23,.35)}`, `.screen.scrim{rgba(20,12,8,.45)}` | brown scrim | `--scrim: rgba(43,33,64,.50)` |
| 344 | `#top #lvPill.hard{background:var(--hard) …}` | | keep; the normal LV pill becomes blue (§8 Pill) |
| 347 | `#hardBan … rgba(122,43,196,.92)` | | keep, and the text fill becomes `#FFE27A` with stroke `--hard-ol` |
| 99 | `.chip .n{… background:#FF6A3D` | | `--blast #FF6A1A` |

### 10.2 three.js

| Line | Search text | Now | New |
|---|---|---|---|
| 2474–2477 | `renderer.setClearColor(0x000000, 0); … shadowMap.type = THREE.PCFShadowMap` | no encoding or tone mapping (linear output, `NoToneMapping`) | add `renderer.outputEncoding = THREE.sRGBEncoding; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.25;`. Keep PCF and `autoUpdate=false` |
| 2515 | `new THREE.Fog(0xFFE7B3, 70, 170)` | | per district, **raw hex, not converted**: `0xFFE2B0, 60, 190` / `0xFFF0CC, 65, 210` / `0xFFC98A, 70, 240` |
| 2516 | `PerspectiveCamera(46, …)` | | keep for gameplay (fit-based framing). The Home preset uses fov 34 (§7) |
| 2517 | `HemisphereLight(0xFFF6E0, 0xB08A60, 0.78)` | | §4.2 per district, e.g. Old Quarter `(0xFFF1D6, 0xC98F5A, 0.62)` (3D) |
| 2518–2519 | `DirectionalLight(0xFFFFFF, 0.62)`, `sun.position.set(14, 34, 22)` | | Old Quarter `(0xFFE2B0, 1.05)` at `(−15.4, 29.7, 21.9)`; Downtown `(0xFFEFD2, 1.10)` at `(−11.5, 32.8, 19.9)`; Skyline `(0xFFC58A, 1.15)` at `(−28.9, 18.8, 20.3)` (3D). Keep `sun.target` at the lot centre |
| new | — | | fill `DirectionalLight` per district (§4.2), `castShadow=false`, position `(25, 12, −20)` |
| 2525 | `CircleGeometry(150, 96) … color:0x8FD460` (grass) | green field | plaza paver texture in the district plaza colour (§5). Keep the mesh, swap the material |
| 2527 | `CircleGeometry(16, 96) … color:0xF3D296` (lot) | | lot texture `#E9B877 → #D9A15C` with speckle. Keep the mesh |
| 2529–2541 | `trees()` cone trees, `0x9A6B3F` / `0x4DBF5A` | 18 cones round the lot | remove. Street trees come from the backdrop (Old Quarter only; trunk `#8A5A30`, icosahedron crown `#5DBB4A`) |
| 2395 | `PALETTES = [0xFF8F5E, 0xFFB443, 0xF06AA5, 0x5BB8FF, 0xA77BFF, 0xFF7070, 0x3CCFB4]` | includes blue, purple and teal | per district: `PALETTES_D = [[0xF0702A,0xE8553A,0xF59E2E],[0xFF8A1F,0xF2683A,0xFFB02E],[0xF2557A,0xFF7A3D,0xFF9E5A]]`; `L.palette = PALETTES_D[L.d][levelIdx % 3]` (lines 4463, 4546, 4881, 5299) (3D) |
| 2337 | `concrete … color:0xFFF0D2` | near white (clips) | `0xF2D3A6` (3D) |
| 2339 | `glass … color:0x8FE4FF, glass:true` | | `0x6F9DB5` (3D) |
| 2601 | `transparent:!!m.glass, opacity:m.glass?0.62:1, depthWrite:!m.glass` | see-through glass | opaque: `transparent:false, opacity:1, depthWrite:true` (VISUAL-TARGET §4.3). Glass may then cast shadows |
| 2340, 2350 | `steel … 0x4B6BC6`, `truss … 0x6E7FA8` | blue | **proposal P-1:** `0x5E6B7D` / `0x7A7F8C` (gunmetal; blue stays protected-only) |
| 2353 | `keep … 0xD9E8FF` | | keep |
| 2356 | `kbase … 0xB9D3F5` | | keep |
| 2721 | `0x2F56C4 : 0x6F8FDA` (keep roof / slab edge) | | keep `0x2F56C4`; `0x6F8FDA` → `0x2F56C4` (PROTECTED-SPEC: every roof element is navy) (3D) |
| 2724 | `_c.setHex(base);` | | `_c.setHex(base).convertSRGBToLinear();`, then the per-floor AO multiply (§5) |
| 3215 | `PlaneGeometry(80, 7) … color:0x6B6F7A` (road) | | district asphalt `0x4A4F5C` / `0x454A57` / `0x4A4658` (3D) |
| 3217 | `curb … MeshBasicMaterial({color:0xFFD23F})` | | `0xFFC633` (3D). Also add the 2.2 m sidewalks (§3), 1 extra instanced draw |
| 3219 | `dashes … color:0xFFFFFF` | | `0xF4E9D2` (3D) |
| 3848, 3855 | `SpriteMaterial({… color:0xE8CFA6`; `col \|\| 0xE8CFA6` | | district `debris` tint (3D) |
| 2404 | `clus: { … css:"#8E5BFF", color:0x8E5BFF` | purple | `"#13B5B0"`, `0x13B5B0`. Also line 3535 `fxFlash(…0xE9D8FF, 0x8E5BFF…)` → `0xC8FFF9, 0x13B5B0`; `fxRing … 0xB794FF` → `0x5FE0D8` |
| 2421–2423 | `DISTRICTS … color:"#E58A5C" / "#5B8DEF" / "#8E5BFF"` | | `"#E8703A"` / `"#FFB400"` / `"#F2557A"` |
| 3529, 3878–3893 | fx flash `0xFFF3C4 → 0xFF9A3C`, `0xFFB347/0xD1260F` | | keep the hues; only add `convertSRGBToLinear` |
| new | — | | backdrop builder (§6), contact blobs (§5), crane and banner (§6/§7), Hard vignette (§7) |

---

## 11. Performance cost per change

The baseline: collapse frames are 30–41 ms at 4× CPU, and the cost is CPU and physics, not GPU. So the rule is **no per-frame CPU work** during `boom` and `settle`, and only cheap GPU work. "GPU" below is an estimate for a mid phone at DPR 2.

| # | Change | CPU per frame | GPU | One-time | Risk |
|---|---|---|---|---|---|
| 1 | sRGB output + ACES (exposure 1.25) + linear-converted colours | 0 | ~1 % (a few ALU per fragment) | — | **Every** colour path must be converted, or the scene looks washed out. Grep `setHex(`, `color:0x`, `.setRGB`. Fog stays raw |
| 2 | New light rig (+1 fill light, no shadow) | 0 | Lambert per vertex: +1 light ≈ +3 % vertex work on ~12k triangles. Negligible | — | Shadow direction flips to back-right. Re-check that the shadow frustum (`frameLevel`) still covers the fall radius |
| 3 | District palettes (target, ground, street, fog, sky vars) | 0 | 0 | — | Low |
| 4 | Backdrop (§6), built once per district | 0 static; ~0.02 ms with cabs and crane animated (cabs paused in boom/settle) | +6 draws, +6–10k triangles, no shadow pass, fogged far layer. ≈ 0.3–0.6 ms | 8–15 ms at 4× CPU, at district entry | Low, if it is not rebuilt in `startLevel` |
| 5 | Ground textures (pavers, lot vignette) + sidewalk strip | 0 | 2 texture samples on the ground; +1 draw | ~1 ms texture upload | Low |
| 6 | Contact blobs | 0 (opacity set only when mass changes) | +1 draw, a small transparent quad | — | Low |
| 7 | Per-floor AO + opaque glass | 0 | Opaque glass **saves** sorting and overdraw | 0 | Glass now casts shadows: +1 shadow-pass draw when `shadowDirty` |
| 8 | Protected fresnel rim | 0 | +6 ALU per fragment on keep pixels | +1 program (compile at boot) | Low |
| 9 | Crane banner + idle animation (Home only) | ≈ 0.01 ms | +4 draws on Home only | 2 ms canvas draw | Wait for the font before drawing |
| 10 | UI tokens, text strokes, button and card recipes | 0 in 3D; static text strokes rasterise once | compositor only | — | Do not animate stroked text other than with transform |
| 11 | Motion tokens (breathe, sheen, coin fly) | coin fly already exists (cap 15 coins, 1 DOM write per frame) | compositor | — | Keep to transform and opacity |
| ✗ | MeshStandard, Toon, 3D outlines, SSAO, post bloom | — | 1.5–3× fragment cost, or extra full-screen passes | — | **Rejected** for mobile |

### Top 5 by visual impact per cost

1. **Colour pipeline + light rig + warm target palettes** (items 1–3). Zero runtime cost. It fixes the clipped, pastel look (DESIGN-COMPARE "colour" 2.5 → ~4) and the role clash where target slabs were blue or purple. The biggest win per ms.
2. **District backdrop** (item 4). About 0.5 ms GPU, 0 CPU per frame. This is the largest gap in DESIGN-COMPARE: "world" 2 → ~4. The pastoral grass disc becomes a New York block.
3. **UI role tokens + per-role text outlines + button and card recipes** (item 10). CSS only. Fixes "type" 2.5 and "colour semantics" 2. Green = go, orange = BLAST, purple = Hard, everywhere.
4. **Ground swap + contact blob + per-floor AO** (items 5–7). +2 draws. Grounds the building, so it looks heavy and toy-like rather than pasted on, and removes the lime-green field.
5. **Home composition: level on the crane banner + idle sway + logo above** (item 9). Home only, so it costs nothing in levels. It delivers lessons 1–3 and 8 of DESIGN-COMPARE: level in the scene, living Home, logo not over the building.

---

## 12. Open items for the owner

- **P-1.** Steel and truss members move from blue to gunmetal, so blue stays protected-only.
- **P-2.** The cluster charge moves from purple to teal, so purple stays Hard-only.
- **P-3.** Hard levels keep the 3D world unchanged, with purple only in the UI, the banner and a 28 % edge vignette. The alternative is also tinting the sky top to `#6C63E6` on Hard; I recommend against it, because it fights the warm New York vibe and blurs the readability rules.

## Quyết định của Owner (08/11/2026)
- P-1: khung thép xanh dương → xám thép (gunmetal). Xanh dương chỉ dùng cho nhà được bảo vệ. **Chốt.**
- P-2: bom chùm tím → xanh ngọc #13B5B0. Tím chỉ dùng cho màn khó. **Chốt.**
- P-3: màn khó KHÔNG đổi màu trời, chỉ đổi UI (nút, biển tím, viền mờ tím). **Chốt.**
- (08/11) Owner: **bỏ khu phố, level endless.** Không hiện tên khu phố ở đâu cả. 3 bộ màu/ánh sáng/phông thành theme A/B/C, đổi theo level (1–10 A, 11–20 B, 21–30 C, lặp lại). Bỏ màn Map và tab Map. Home có thanh "mở khoá tiếp theo" (vd "Lv 11 · NEW: Cutter").

---
## Direction reset (Owner, 09/11/2026)
"The first version (06/11) already got ~80% of the shapes and feel; it only needs a few lines and colouring. Later versions went overboard — dry, no longer fun, lost the hybrid-casual vibe."
- Base look = v1 (a4213f3): bright cyan sky, green lawn, sunny light, chunky cream/wood columns, orange/pink slabs, blue glass, clean simple shading.
- Add only light touches: thin edge lines, simple brick/glass/slab hints, colour tuning. No grime, no heavy textures, no heavy site dressing.
- Material lab (matlab/) and environment lab (envlab/) batches are paused as reference only.
- Exception (Owner 09/11, after approving the 19 Figma targets in art-brief/review): timber keeps soft grain, brick keeps raised coursing with soft mortar, concrete keeps subtle surface variation — matching the Figma swatches. Still clean (no grime), world-size constant, fading to colour at far cameras.

### Cập nhật 10/11/2026 (Owner chốt, thay P-2)
- **P-2b.** Bom chùm (Cluster) giữ **màu tím như ảnh Figma**. Tím giờ có hai nghĩa: màn Hard và bom chùm. Luật P-2 cũ (đổi sang xanh ngọc #13B5B0) bỏ.
- Hạt hiệu ứng đợt 2–3 (sao, pháo giấy, tia sáng, xu xoay, khiên, mây, chim, cờ) để đợt sau, không vào v29.
