# Blast Rush: protected vs target buildings (visual language spec)

**Written** 2026-11-07 by a `design`/`rd` subagent, from the owner's feedback (translated): *"Buildings that must not be toppled need a distinct design — a different colour or roof that symbolises that building — so players know not to topple it."*
**Status:** implementation-ready spec. `index.html` was **not** edited (another agent owns it). The geometry recipes below were built and rendered in a standalone three.js r128 mock-up: `<scratch>/blast-v4-spec/mock/protected-family.html` (screenshots in the same folder).

**Inputs [V]:** `VISUAL-TARGET.md` §4 (palette, materials, perf budget), `LEGAL-LANDMARKS.md` §3.4 and §4.1, `blast-copy/STORY.md` §4 and §8, `DESIGN-PLAN-V4.md` (multi-building from L16), `games/playbook/GAME-DESIGN.md` and the `game-designer` skill (telegraph rules: same look ⇒ same rule; readable in 3 s).

---

## 0. Summary

| | **Protected** ("DO NOT TOPPLE") | **Target** ("demolish me") |
|---|---|---|
| Colour family | **cool**: ice-blue walls, royal-navy roof, white trim, warm-lit windows | **warm and worn**: cream frame with grime, district-colour slabs, dusty glass |
| Silhouette | a **unique roof per type** (bell cupola, awning, pediment, dome, marquee, helipad…) | flat, chopped tops; a crane hook dangling over the roof |
| Badge | floating **gold shield** with a white type pictogram and a live damage % | an orange spray-painted **X** on the front, hazard tape on the ground floor |
| Edge | soft blue **fresnel rim** + ground **halo ring** | none (the hazard tape carries the edge) |
| Motion | badge bobs; the whole building **pulses** when a charge's radius touches it | still; boards rattle on the countdown |
| Sound | `protected_hit` on tap; new `keep_warn` when damage climbs | — |

One sentence for the tip/tutorial: **"Blue roofs and gold shields stay up. Taped, X-marked buildings come down."**

Why blue, not green:
- The current keep green `#3DCB8A` vs the orange target slab `#F0702A` drops to ΔE 32 (protanopia) and 44 (deuteranopia). Navy roof vs orange stays ≥ 99 for all three colour-vision types (§1.3).
- District 3's slab colour is green `#2EB872` (VISUAL-TARGET §4.4): a green "safe" building would share the target's colour there.
- Cool vs warm is the axis every common colour-vision deficiency keeps (blue–yellow), and the brief bans relying on green vs red.

---

## 1. Colour tokens

All hex values are sRGB. Convert to linear in code (`.convertSRGBToLinear()`), as VISUAL-TARGET §4.1 requires.

### 1.1 Protected (`keep.*`)

| Token | Hex | Use |
|---|---|---|
| `keep.wall` | **#D9E8FF** | facade shell, columns (instance colour of `keep` members + shell boxes) |
| `keep.wall.shade` | #A9C2EE | ground-floor band / plinth (per-floor AO ×0.82 already darkens it) |
| `keep.roof` | **#2F56C4** | every roof element: cupola cap, pediment, dome, awning stripes, marquee, slab edge |
| `keep.trim` | #FFFFFF | window frames, cornice, columns of the bank, helipad ring |
| `keep.window` | **#FFD866**, emissive #FFB938 × 0.55 | lit windows (see §5, owner choice O-2) |
| `keep.rim` | #8FD0FF | fresnel rim colour, strength 0.35 at rest, 0.9 when pulsing |
| `keep.halo` | #5FB8FF @ 35 % alpha | ground ring under the building |
| `keep.badge` | **#FFC633** fill, #1E2F6B rim 3 px, white pictogram | floating shield |
| `keep.base` | #B9D3F5 | the anchor plinth (`kbase`), replaces #B9E8C9 |

`MEMBERS.keep.color` becomes `0xD9E8FF`, `MEMBERS.kbase.color` becomes `0xB9D3F5`. Keep the 20 % desaturation rule from VISUAL-TARGET §4.4 in spirit: protected walls are pale (S ≈ 0.15), so the saturated target owns attention; the navy roof and gold badge carry the identity.

### 1.2 Target (`bld.*` additions)

| Token | Hex | Use |
|---|---|---|
| `bld.frame` | #F2D3A6 (unchanged) | concrete members |
| `bld.grime` | multiply ×0.78 at floor 0 → ×1.0 at floor 3 | per-floor weathering (stacks with the per-floor AO) |
| `bld.glass.dusty` | **#6F9DB5** | target glass: dusty, no warm light (VISUAL-TARGET's #3FA9E8 is too close to the protected blue family) |
| `bld.board` | #B07A47, planks #8A5A30 | boarded window (atlas tile, §3.2) |
| `bld.tape` | #FFB400 / #2B2140 | hazard tape band (= the `hazard` token) |
| `bld.spray` | **#FF6A1A** | the "X" mark |
| `bld.hook` | #FFC633 hook, #2B2140 cable | crane hook |
| slabs | district palette (unchanged) | |

### 1.3 Colour-vision check (computed)

Machado (2009) full-severity simulation, CIE76 ΔE in Lab. Source: `scratchpad/blast-v4-spec/cvd.py`. ΔE > 40 reads as "clearly different"; < 20 is risky.

| Pair | normal | protan | deutan | tritan |
|---|---|---|---|---|
| target frame vs keep wall (#F2D3A6 / #D9E8FF) | 40 | 38 | 41 | 30 |
| target slab orange vs keep roof (#F0702A / #2F56C4) | 124 | 113 | 128 | 99 |
| target slab pink (D2) vs keep roof | 80 | 51 | 81 | 107 |
| target slab green (D3) vs keep roof | 120 | 96 | 90 | 36 |
| target dusty glass vs keep lit window | 82 | 81 | 84 | 52 |
| **old** keep green vs target orange (#3DCB8A / #F0702A) | 105 | **32** | **44** | 116 |
| keep wall vs lit ground | 55 | 53 | 55 | 44 |
| badge gold vs badge rim | 128 | 129 | 130 | 74 |
| warning coral vs badge gold | 63 | 50 | **26** | 58 |
| warning coral vs white | 89 | 62 | 65 | 94 |

- **Wall vs wall is the weakest pair (30–41).** That is fine because walls are never the cue on their own: the roof, badge and halo carry it (redundant coding: colour + shape + icon + motion).
- **Warning flash = coral ↔ white**, never coral ↔ gold (26 for deuteranopes).
- Tritan (rare) is weakest on green D3 slab vs navy roof (36). The roof shape and badge still differ; acceptable.

---

## 2. Protected building kit

### 2.1 Structure (physics unchanged, visuals added)

- **Physics.** Keep the existing `keep` frame (`buildFrame(..., isKeep=true)`: columns + slabs, `MEMBERS.keep`), the 10 % collateral rule and "charges never damage the protected building". Footprints are `cx`×`cz` column lines (default 2×2 = 4.62 × 4.62 m), storeys 2.7 m.
- **Visual shell (new, no colliders).** Every protected building gets non-physics decor: wall panels between its columns, a cornice, windows and a type roof. Each decor instance is **attached to one keep member** (`b.decor = [{inst, ii, localMatrix}]`) and its world matrix is `member.matrixWorld × localMatrix`, written in `writeMatrix` only when that member is awake or moved (protected buildings sleep until touched, so the decor costs nothing while they rest). If the member dies, its decor hides (scale 0); if it is displaced, the decor rides with it, so damage reads naturally.
- **Attachment rule.** Wall panels and windows → the column on their left (seen from outside). Roof pieces → the top slab. Ground-floor pieces (awning, columns, marquee, steps) → the ground-floor slab's nearest column.

### 2.2 Shared decor geometry (instanced, 5 draw calls for all protected buildings in a level)

| Instanced mesh | Geometry | Material | Max instances |
|---|---|---|---|
| `kdBox` | `BoxGeometry(1,1,1)` | `MeshStandardMaterial` roughness 0.6, instance colour, the bevel atlas map (VISUAL-TARGET §4.3) | 400 |
| `kdCyl` | `CylinderGeometry(0.5,0.5,1,10,1)` | same | 60 |
| `kdPrism` | `CylinderGeometry(0.5,0.5,1,3,1)` rotated so a flat face is down (pediments, gable roofs) | same | 30 |
| `kdDome` | `SphereGeometry(0.5,14,7,0,2π,0,π/2)` (half sphere) | same | 6 |
| `kdWin` | `PlaneGeometry(1,1)` | `MeshStandardMaterial` colour #FFD866, emissive #FFB938, emissiveIntensity 0.55 (driven per level, §2.6) | 200 |

Pyramids (school cupola) use `kdPrism`'s sibling: `ConeGeometry(0.5,1,4,1)` rotated 45° — add as `kdCone` only if a level has a school (6th draw call).

### 2.3 Common shell (every protected type)

Units are metres; `W` = footprint width (x), `D` = depth (z), `H` = floors × 2.7.

| Piece | Recipe | Colour |
|---|---|---|
| Wall panels | per bay, per floor, per outside face: `kdBox` (bay − 0.62) × 2.30 × 0.12, inset 0.05 from the column face | `keep.wall` |
| Plinth band | ground floor only: a `kdBox` strip W × 0.35 × 0.14 at y 0.18 around the footprint | `keep.wall.shade` |
| Windows | per bay per floor on the two faces the camera sees (front +z and the side facing the target): `kdWin` 0.9 × 1.1, centred at floor y + 1.25, 0.07 proud of the panel; frame = 4 `kdBox` 0.08-thick white strips (or bake the frame into the window texture: 1 instance) | `keep.window`, frame `keep.trim` |
| Cornice | top of the last floor: `kdBox` (W + 0.3) × 0.22 × (D + 0.3) | `keep.trim` |
| Roof slab edge | the top `keep` slab's instance colour = `keep.roof` | `keep.roof` |
| Door | front, ground floor, centre bay: `kdBox` 1.1 × 2.0 × 0.08 | #1E2F6B |

### 2.4 Roof / silhouette per type

Every type must be identifiable by **silhouette alone** at 390 px wide (the smallest roof feature is ≥ 0.6 m, which is ≥ 18 px at the planning framing, the VISUAL-TARGET chunkiness rule). No text, no real logos, no national flags, no religious or medical emblems.

| Type (`keeps[].type`) | Used for | Signature (recipe) | Pictogram on the badge |
|---|---|---|---|
| `school` | the school | **Bell cupola** centred on the roof: base `kdBox` 1.3 × 1.1 × 1.3 (wall); 4 corner posts `kdBox` 0.18 × 0.9 × 0.18 (trim) on top; cap `kdCone` r 1.0, h 0.9, 4 sides, rotated 45° (roof); bell `kdCyl` r 0.28, h 0.4 (#FFC633) hanging inside; clock disc `kdCyl` r 0.38, h 0.06, rotated to face +z, white with 2 navy hands (`kdBox` 0.05 × 0.3 / 0.22). **No spire, no cross** (a steeple reads as a church: LEGAL §3.4) | bell |
| `cafe` / `bakery` | the café, the bakery | **Striped awning** over the ground floor front: 5 `kdBox` stripes, each (W/5) × 0.08 × 1.3, alternating `keep.roof` / white, pitched 22° down-and-out, top edge at y 2.55; 2 support rods `kdCyl` r 0.04; round **hanging sign** `kdCyl` r 0.45, h 0.08 on a bracket. Roof: low parapet `kdBox` W × 0.4 × 0.15 on all four edges | cup (café) / loaf (bakery) |
| `bank` | the bank | **Columns + pediment**: 4 white `kdCyl` r 0.22, h 2.6 across the front at z = D/2 + 0.4; entablature `kdBox` W × 0.35 × 0.9 on top of them; pediment `kdPrism` W × 1.0 (height) × 0.9 (depth), apex up, navy; 2 steps `kdBox` W × 0.15 × 0.5 and (W − 0.6) × 0.15 × 0.35. Generic classical, no columns-and-dome capitol combo, no currency sign | coin stack |
| `library` | the library | **Low dome**: drum `kdCyl` r 1.55, h 0.45 (white), dome `kdDome` r 1.5 scaled y × 0.65 (navy); front **arched window**: `kdWin` 1.2 × 1.6 + a half `kdCyl` r 0.6 on its top. Shallow dome, **no finial, no lantern, no crescent** (no mosque/church read) | open book |
| `theatre` | the theatre | **Marquee**: cantilevered `kdBox` (W − 0.4) × 0.6 × 1.2 over the door at y 2.9 (navy), its front face lined with 9 bulbs `kdDome` r 0.08 (#FFF2B3 emissive); **blade sign** `kdBox` 0.22 × 2.6 × 0.9 standing on the marquee's left end (white with navy edge). Blank sign, **no text, no real cinema/theatre brand** | **star** |
| `clinic` | replaces "the hospital" | **Rooftop helipad**: white ring `kdCyl` r 1.6, h 0.04 with an inner navy disc r 1.45, and an "H" from 3 white `kdBox` (0.2 × 0.04 × 1.1 ×2, 0.6 × 0.04 × 0.2); a small stair hut `kdBox` 0.9 × 1.0 × 0.9. **No cross in any colour, no red crescent, no crystal, no Star of Life** (Geneva Conventions emblems are legally protected; the Star of Life was a registered US certification mark; a green cross is a regulated pharmacy sign in several EU countries). Copy: "the clinic", never "hospital" with a cross | **heart with a pulse line** |
| `market` | the market hall, mill sheds | **Sawtooth roof**: 3 `kdPrism` teeth, each (W/3) × 1.0 × D, rotated so the vertical face points +x; glazing strips `kdWin` on the vertical faces | basket |
| `house` | generic "neighbours" | **Gable roof**: `kdPrism` (W + 0.3) × 1.4 × (D + 0.3), ridge along x; a chimney stub `kdBox` 0.4 × 0.8 × 0.4 (wall colour) | house |
| `hotel` | the old hotel (L30) | **Canopy + roof garden**: canopy `kdBox` 2.4 × 0.15 × 1.6 on 2 `kdCyl` posts; roof: 3 `kdDome` r 0.5 shrubs (#3A8F5C — the only green on a keep, small) on a planter `kdBox` | key |
| `kiosk` | small protected item (antique, L26 "fragile antique" uses the same badge) | `kdBox` stall with a `cafe`-style mini awning | star |

*Theatre pictogram:* comedy/tragedy masks are generic, but a star is the safer read for ad-network review.

### 2.5 Shield badge (floating)

- **Mesh:** one `THREE.Sprite` per protected building (≤ 3 per level → ≤ 3 draw calls), `SpriteMaterial` with a 128 × 144 px canvas texture: shield path (flat top, pointed bottom, 12 px corner radius), fill `keep.badge`, rim 6 px #1E2F6B, white pictogram 64 px centred; `depthTest:false`, `renderOrder: 10`.
- **Size:** 1.3 m wide in world space at rest (≈ 44 px at the L20 framing, ≥ 36 px at the widest multi-building framing); position: roof top + 1.4 m (above the tallest roof feature), centred on the footprint.
- **Idle motion:** bob y ± 0.08 m, period 2 s (sine, phase offset per building so two badges never bob in sync).
- **Label (first appearance of each type only):** a DOM chip under the badge with the name ("the school"), Fredoka 13 pt, cream on ink, fades after 2.5 s; reappears while the player's finger is down within the pulse radius (§2.7).
- **Damage readout:** a second small DOM chip under the badge shows the live damage of **that** building ("0 %" hidden at rest; "4 %" amber at > 0; coral at ≥ 5 %, the limit is 10 %). Updated at most once per frame, and only when the rounded value changes (VISUAL-TARGET S5).

### 2.6 Rim and halo ("subtle outline/glow")

VISUAL-TARGET §4.3 says no outlines on 3D (the references use none), so the edge is a glow, not an ink line:
- **Fresnel rim** on the `keep` instanced material and the decor materials, via `onBeforeCompile`: `rim = pow(1.0 - saturate(dot(N, V)), 2.5) * uRim`; add `keep.rim × rim` to `totalEmissiveRadiance`. `uRim` = 0.35 at rest, animated to 0.9 during the pulse. 0 extra draw calls; a few ALU ops.
- **Ground halo:** one instanced `PlaneGeometry` ring decal (radial-gradient texture, `keep.halo`, additive off, `depthWrite:false`) under each protected footprint, footprint + 1.2 m. 1 draw call for all.
- **Lit windows** pulse their `emissiveIntensity` 0.55 → 0.9 with the rim pulse.

### 2.7 "Aim near it" pulse (proximity telegraph)

- **When:** in the planning phase, while the finger is down (touch-down preview) or after a charge is placed, if the charge's radius sphere (`CHARGES[k].radius × powerMul().r`) reaches any member of a protected building (distance from the charge point to the member's box < radius).
- **What:**
  1. the rim ramps to 0.9 and the halo opacity to 70 % (0.15 s ease-out), then breathes 0.6 ↔ 0.9 at 2.5 Hz while the condition holds;
  2. the badge scales 1 → 1.18 → 1 (0.25 s, easeOutBack), and its rim turns coral #FF5A3C;
  3. the part of the charge's radius ring that overlaps the protected footprint turns coral (draw the ring twice with a clip, or tint ring segments by angle);
  4. one light haptic (`selection`), and the `keep_warn` sound once per placement at low intensity (0.4).
- **Not a block.** Placing there is allowed (charges never damage a protected building directly; the risk is the fall). The pulse is information, not a veto.
- Tapping the protected building itself keeps today's behaviour (no placement, `protected_hit`) with the toast **"Protected — the school stays up!"** (the current text says "the green building").

### 2.8 Damage feedback during the fall ("hit/damage %, warning flash and sound")

| Collateral of that building | Badge | Building | Sound / haptic | HUD |
|---|---|---|---|---|
| 0 % | gold, bobbing | rim 0.35 | — | "🛡 Safe" pill |
| > 0 – < 5 % | gold, "3 %" amber chip | one rim flash to 0.9 | `keep_warn` intensity 0.5, light haptic | pill turns amber, shows the worst building's % |
| 5 – 10 % | **coral ↔ white** flash at 4 Hz, chip coral | rim coral-tinted (#FF8A6A) pulse at 4 Hz | `keep_warn` intensity 1.0, medium haptic, at most once per 0.6 s | pill coral |
| > 10 % (fail) | badge cracks (swap to a cracked-shield texture), stops bobbing | the whole building's instance colour lerps 30 % toward coral for 0.4 s, then stays tinted | the existing `fail` with `reason:"collateral"` at the result | result card: "HIT THE SCHOOL! 14 % / 10 %" and the scene highlights the hit members |

- **New SFX event `keep_warn`** (for `games/blast-sfx/sfx.js`, which owns sound): a soft two-tone "dee-doo" (E6 → C6, sine + a little square, 0.18 s), pentatonic like the rest, −14 dB under a boom; rate-limited to 1 per 0.6 s per building. It must never sound like a primary boom or the fail sting.
- **Measure:** use per-building collateral (the harness patch has `collByKeep()`; the game's `collateral()` must return the **worst** building and its name — see LEVELS-V4.md §5.2).

### 2.9 People cue

STORY.md §4 says: "Nothing in the game implies people are inside, nearby or hurt." The owner asked for "a people-inside cue such as lit windows". The recommendation is **lit windows only**: warm windows read as "open / in use", which is what tells the player "this one stays", without showing anyone. No silhouettes in windows, no figures, no screams, no "evacuate" copy. → **Owner choice O-2** (§6).

---

## 3. Target building kit ("demolish me")

### 3.1 Palette and weathering
- Frame `#F2D3A6` with per-floor grime (×0.78 at the ground floor rising to ×1.0 at floor 3), on top of the existing per-floor AO and ±5 % random value jitter.
- Glass `bld.glass.dusty` #6F9DB5, never emissive. The protected building is the **only** warm-lit building on screen.

### 3.2 Windows: boarded and cracked
- Add an `aTile` float instance attribute to the glass and facade instanced meshes and pick a tile from the 256 px atlas in the fragment shader (`onBeforeCompile`, `vUv = uv * 0.5 + tileOffset`). Tiles: clean-dusty, **boarded** (3 diagonal planks #B07A47 on dark), **cracked** (white crack lines), **taped X** (2 tape strips).
- Mix per target: 40 % boarded, 20 % cracked, 10 % taped, 30 % dusty (seeded by `rnd`, so a level always looks the same).
- Physics unchanged: a boarded pane is still a `glass` member.

### 3.3 Hazard tape
- One `kdTape` instanced box mesh (shared by all targets, 1 draw call): 4 strips per target at y 1.0 m around the ground-floor footprint, each (side length + 0.2) × 0.16 × 0.02, the `hazard` stripe texture (#FFB400 / #2B2140, 45°).
- Each strip is attached to the nearest ground-floor column (rides and dies with it), like the protected decor.

### 3.4 Spray "X"
- One `kdSpray` instanced plane (1 draw call): a 1.6 × 1.6 m orange #FF6A1A hand-sprayed "X" texture (alpha-tested, soft edge), on the front face of floor 1, centre bay, 0.03 m proud; one per target. Attached to that facade member.
- Optional twist used by levels: a smaller "X" on a specific member marks a **hint** (the ghost hint after 2 fails, DESIGN-PLAN-V4 §4) — same visual language, so no new symbol.

### 3.5 Crane hook
- One per level, over the **first** target (the camera's focus): a cable `kdCyl` r 0.03 from y = roof + 8 m down to roof + 1.2 m (#2B2140), a hook block `kdBox` 0.5 × 0.35 × 0.3 (#FFC633) and a hook `TorusGeometry(0.25, 0.06, 6, 12, 4.4)` (#FFC633). Sways ± 2° at 0.4 Hz. Visual only; it lifts away (tween up 6 m, 0.6 s) when the countdown starts, so it never sits in the collapse. 2 draw calls.

### 3.6 Countdown tell
- During the 3 fuse beeps, boards on target windows rattle (± 0.02 m jitter of the facade instances) — reads "this one is about to go", costs nothing new.

---

## 4. Performance budget (VISUAL-TARGET §8)

| Item | Draw calls | Triangles | Bodies |
|---|---|---|---|
| Protected decor (`kdBox`, `kdCyl`, `kdPrism`, `kdDome`, `kdWin`, + `kdCone` if a school) | 5–6 | ≈ 3.5k (3 buildings) | **0** (no colliders) |
| Badges (sprites, ≤ 3) | ≤ 3 | 6 | 0 |
| Halo decals (instanced) | 1 | 6 | 0 |
| Target tape + spray X | 2 | ≈ 0.5k | 0 |
| Crane hook | 2 | ≈ 0.2k | 0 |
| **Total added** | **≤ 14** | **≈ 4.2k** | **0** |

Against the budget: draw calls ≤ 80 scene (today 31–67) and triangles ≤ 60k (today ≤ 5.6k): both fit.
- **CPU:** decor matrices are written only for awake/moved keep members (they sleep until touched). Target tape/X matrices: ≤ 4 + 1 per target per frame (≈ 15 `setMatrixAt` calls at 3 targets). Fresnel: no extra pass.
- **No allocation per frame:** reuse the scratch `Matrix4`s; the decor list is built once per level.
- **Rapier bodies:** unchanged. Protected buildings keep their current bodies (5 per floor for a 2×2 frame) and sleep until touched. For multi-building levels, LEVELS-V4.md §7 proposes a cheaper protected body (one body per storey).

---

## 5. Implementation order (for `app-dev`)

1. Tokens: `MEMBERS.keep.color` → 0xD9E8FF, `kbase` → 0xB9D3F5, target glass → 0x6F9DB5; the protected-tap toast text.
2. Badge sprites + damage chip + per-building collateral (needs `keep.type` / `keeps[]` data, LEVELS-V4.md §5).
3. Common shell + 3 types used by L1–15 (`house`, `bakery`, `school`, `cafe`, `bank`, `library`, `market`), then the rest with the multi-building work (L16+).
4. Fresnel rim + halo + aim pulse.
5. Target kit (dusty glass, atlas tiles, tape, X, hook).
6. `keep_warn` in `sfx.js` (sound owner), then `tools/audio-check.js` gets the event.
7. Checks: `tools/perf.js` (draw calls, frame p95), a screenshot per type at 390 × 844 and 375 × 667, and a colour-blind pass (Chrome DevTools "Emulate vision deficiencies": protanopia, deuteranopia, tritanopia, achromatopsia) on the protected-level screenshots.

## 6. Choices for the owner

| ID | Question | Options | Recommendation |
|---|---|---|---|
| O-1 | Protected colour family | **A** ice-blue walls + navy roof + gold shield (this spec) · B keep green, add the badge and roofs | **A**: green fails for protan/deutan players against the orange slabs and clashes with District 3's green slabs |
| O-2 | "People inside" cue | **A** lit windows only (no figures) · B lit windows + silhouettes · C none | **A**: B breaks the STORY rule ("nothing implies people inside") and raises the ad-review sensitivity of destruction games |
| O-3 | "Hospital" neighbour | **A** "the clinic" with a heart pictogram and a helipad · B drop the type | **A**; never a cross of any colour |
| O-4 | Aim-near pulse | **A** always · B only in L1–15 and on the first appearance of each type, then only after a fail | **B** if the Hard levels feel too guided; start with A for the retention test |
