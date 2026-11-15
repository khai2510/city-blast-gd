# Blast Rush: design notes

`index.html` is a single file that loads three.js r128 from cdnjs and the Rapier physics engine (`@dimforge/rapier3d-compat@0.19.3`, WASM) from jsdelivr. Physics was rebuilt on 07/11/2026 after the owner said nothing felt physical; the diagnosis and the checks are in `PHYSICS-AUDIT.md`. It is a fast hybrid-casual remake of the owner's prototype, `ref/blast-console-v1.html`. The research behind it is `games/research/asmr-sort/mesmerize-rd.md` §6.

## 1. Core loop (v3, 07/11/2026: hard from level 2, multi-wave)

Each level is a real demolition job with one trick (see `BUILDINGS.md` for the archetypes). A level takes about 15–40 s.

1. **Build (0.4–0.9 s).** The tower drops in. The tip line names the job's catch, e.g. "Street out front… blow the BACK panels".
2. **Place.** Tap a member and the selected charge lands there.
   - There is **one charge budget for the whole level** (TNT, Cutter), shared by up to 3 **waves**.
   - Tap a charge to lift it; ↶ undoes; a horizontal swipe turns the camera, so you can reach the back or the sides.
   - Placing your last charge starts the fuse by itself. **BLAST** fires what you have placed so far.
3. **Fuse.** Three beeps, then the charges fire **in the order you placed them, 0.2 s apart**. This is sequenced demolition: the first ones decide where the building starts to go.
4. **Collapse** (the v2 juice is unchanged: hit-stop, flash, fireball, ring, dust, shake, boom, slow-mo "TIMBER!", coins, combo).
   - **Secondary blasts no longer look like primary ones.**
     - **Fuel cell cook-off:** a smaller red-orange ball with black smoke and a soft "fwoomp". No flash and no hit-stop. Successive cook-offs are chained 0.11 s apart, so they never fire in the same frame.
     - **Cluster bomblet:** a small violet pop with a light crack.
     - Only primary charges get the white flash, the freeze and the big boom.
5. **Wave end** (after the rubble settles). The rules are checked in this order:
   1. **Collateral.** More than 10% of a protected building ("the school", "the bank"…) displaced or destroyed is an immediate fail.
   2. **Street.** If more than the allowed share of the building's mass lands past the yellow kerb, it is an immediate fail: "Rubble blocked the street".
   3. **Core.** A core column still standing while the job isn't done means "Core still standing".
   4. **Height.** The standing height must end below `maxH`.
   5. **Share.** The demolished share must reach `target` (70–90%).
   - **If the job is done**, the level ends: **pass**.
   - **If not, and waves and charges are left**, the next wave starts on the real rubble (the physics keeps running). The tip line switches to the reason it isn't done yet.
   - **Otherwise** it is a **fail**, and the card shows the specific reason ("HIT THE SCHOOL!", "STREET BLOCKED!", "CORE STILL STANDING", "STILL STANDING — 5.1 m, must be below 5 m", "NOT ENOUGH").

**Stars.**
- 1★ for doing the job.
- +1★ for doing it in **one wave**.
- +1★ for using **≤ par** charges, where par is the expert plan's count; the budget is par + 1.
- Repeated blasting is allowed and fun, but it costs stars. A perfectly sequenced single wave is the 3★ play.

**Why multiple waves stay hard.** Smash Fest's lever is limited shots per level (`games/playbook/games/smash-fest.md`); here the lever is the shared budget.
- The budget is only par + 1. A cautious first wave spends charges you may need later.
- The rubble from wave 1 is real. A half-done blast can drop a tower the wrong way, onto the neighbour or into the street, and those fail at once.

**District map** (title ▸ City map): three districts of five levels, each ending in a landmark boss.
- **Old Quarter:** tube house, panel block, stone facade, shop house; boss: mill chimney.
- **Downtown:** steel frame, parking garage, brutalist tower, setback tower; boss: Deco spire.
- **Skyline:** mixed block, walled block, core tower, transfer tower; boss: supertall.
- Nodes show your best stars; locked nodes are dimmed.

**Meta.** Coins and 4 upgrades, as before. "+1 Charge" adds TNT to the budget, which makes levels easier. The save lives in `localStorage["blastRush.save.v1"]`.

## 2. Levels (v3: three districts, a landmark boss each)

Every level has one trick a naive player misses. The table gives the trick, then bot results with real taps at 390×844 and zero upgrades, 07/11/2026:
- **Expert** (`EXPERT=1`): the scripted plan.
- **Naive** (`NAIVE=1`): every wave, charges at the middle of the front.
- **Sensible** (default bot): reads the tip's side and swipes the camera there. In wave 1 it cuts the core (if any) or places half the budget, at least both ends of that side; wave 2 gets the rest. Two runs are shown.

W*n* = win with *n* stars, F = fail with its reason, * = a lucky pass.

| # | Level | District | Building | Trick | Par/budget | Expert | Naive | Sensible (2 runs) |
|---|---|---|---|---|---|---|---|---|
| 1 | Tube House | Old Quarter | 5F 2×2 house, neighbours left and right | one charge in the middle of the front | 1/1 | W3 | W3 | W3 |
| 2 | Panel Block | Old Quarter | 5F precast panels, school on the right, street in front | blow the BACK panels (swipe) | 2/3 | W3 | F street | F street / F street |
| 3 | Stone Facade | Old Quarter | 6F stone front and back, mansard, café on the left, street | right end: columns and pane | 3/4 | W3 | W3* | F street / W3 |
| 4 | Shop House | Old Quarter | 6F on 4 lobby piers, tight neighbours, street | charges ON the back piers | 2/3 | W3 | F street | W3 / W3 |
| 5 | **Mill Chimney** (boss) | Old Quarter | brick stack on 4 legs, sheds right, street | notch: the 2 LEFT legs | 2/3 | W3 | F street | W3 / F street |
| 6 | Steel Frame | Downtown | 7F all-steel frame, bank on the left | Cutters on the RIGHT columns (TNT does nothing) | 2/4 | W3 | W3* | W3 / W3 |
| 7 | Parking Garage | Downtown | 4F 4×3 heavy decks, neighbours both sides, street | the whole BACK row | 4/5 | W3 | F street | W1 / W1 |
| 8 | Brutalist Tower | Downtown | 9F concrete core and end walls, library right, street | Cutter the core, then the LEFT columns | 3/4 | W3 | F street | W1 / F street |
| 9 | Setback Tower | Downtown | 10F steel spine, two setbacks, neighbours both sides | cut the core, hinge the front corners | 3/4 | W3 | W3 | W2 / W2 |
| 10 | **Deco Spire** (boss) | Downtown | 12F spine, outrigger floor, theatre both sides | cut the spine and hinge the front | 3/4 | W3 | F collateral | W2 / W2 |
| 11 | Mixed Block | Skyline | 8F on a 2-storey lobby, tight neighbours, street | the BACK piers | 2/3 | W3 | F collateral | W3 / W3 |
| 12 | Walled Block | Skyline | 9F dense, 35% weak columns, neighbours tight, street | the back corners | 2/3 | W3 | F street | W3 / W3 |
| 13 | Core Tower | Skyline | 10F concrete core and outrigger, hospital right, street | Cutter the core, tip it LEFT | 3/4 | W3 | F collateral | W1 / W1 |
| 14 | Transfer Tower | Skyline | 10F on a transfer girder, steel spine, school left | cut the spine, then the RIGHT piers | 3/4 | W3 | W3 | W1 / W1 |
| 15 | **Supertall** (boss) | Skyline | 12F spine and 2 outriggers, towers both sides | cut the spine, hinge the front corners | 3/4 | W3 | F collateral | W2 / W2 |

**Totals for L2–L15 (14 levels)**

| Bot | Real taps | Deterministic harness (`tune3.js`, 2 seeds) |
|---|---|---|
| Expert | **14/14 wins, all 3★** | 14/14, all 3★ |
| Naive | **4/14 wins (fails 71%)**; two earlier full runs: 3/14 and 4/14 | 6/28 wins (fails 79%) |
| Sensible | **12/14 and 11/14 wins (86% and 79%)** | 28/28 wins: 26 at 1–2★, 2 at 3★ |

- **Sensible stars** over the two real-tap runs: of 23 wins, 10 were 3★ and 13 were 1–2★.
- **Naive fail reasons:** "Rubble blocked the street" (6 levels), "Hit <neighbour>" (4), "Core still standing" (harness).

**Rules per level**
- `target` 75–90% demolished.
- `maxH`: standing height must end below 3–8 m.
- Neighbours (named) on one or both sides, 10% damage limit.
- A street with a 10–12% rubble limit on 10 levels.
- A budget of par + 1, over up to 3 waves.

**Bodies.** At most 130 members (`BODY_CAP`; glass is thinned above it) plus at most 60 fragments.

**After L15** the levels loop with +1 floor.

## 3. Upgrades

The between-level screen shows 4 cards. Prices rise about 1.45× per level.

| Upgrade | Effect per level | Max | Price |
|---|---|---|---|
| 💥 Power | +8% damage, +6% push, +3% radius | 8 | 100 × 1.45^L (100, 145, 210, …) |
| 🧨 +1 Charge | +1 TNT every level | 2 | 320, 850 |
| 🧲 Coin Magnet | +12% coins | 10 | 80 × 1.45^L |
| ⏱ Slow-mo | +0.1 s of slow-mo (from 0.8 s) | 6 | 90 × 1.45^L |

**Economy.** Levels pay about 20–60 coins early (≈0.5–1.5 per member, a star bonus of 10/20/35 and +10 per spare charge). Bosses pay 150–250. In the playtest the first purchase came after level 2, and then roughly one per 1–2 levels.

## 4. What was kept from the reference, and what changed

**Engine (rebuilt 07/11/2026; full diagnosis in `PHYSICS-AUDIT.md`)**
- **Rapier, real units.** 1 unit = 1 m, g = 9.81, densities in kg/m³:

  | Material | Density |
  |---|---|
  | concrete | 2400 |
  | glass | 2500 |
  | steel | 7800 |
  | fuel cell | 900 |
  | crate | 450 |

  Each material has its own friction and restitution.
- **Fixed step 1/60 s** with an accumulator, 12 substeps × 4 PGS passes, at most 4 steps a frame (time is dropped beyond that).
  - Slow-mo and hit-stop scale the real time fed in.
  - Rendering interpolates between steps.
  - Game timers (fuse sequence, cluster subs, cook-offs) run on the simulation clock, so a collapse is deterministic for a given placement.
- **Everything is dynamic from the start.** Rapier's sleeping is the only "freeze". The level runs 60 hidden steps before it is shown, so the frame settles elastically (< 1 mm).
- **Breakable bonds with measured force.**
  - Each touching pair is joined at the centre of its contact patch by a 6-DOF joint. Its axes are stiff, critically damped force-based springs (Rapier motors), so F = k·x and M = k·θ.
  - Every step each bond's tension, shear, bending and compression are compared with fixed material capacities (`BONDS`, scaled by contact area). Stiffness also scales with area.
  - Nothing is tuned per level or per load. In every intact level the worst bond sits at 68% of capacity.
- **Crushing.** A bond that fails in compression, or a contact force on a column above 3 MN, pulverises the column. A dropped tower therefore pancakes floor by floor.
- **Impact damage** comes from the measured velocity change of a member in one step (its impulse ÷ mass). Above the material's shatter limit, the member breaks into fragments.
- **Explosion** is the only scripted input: a radial impulse J = imp × (1 − d/R)² × exposed area, applied at the body's nearest point, so torque emerges. The Cutter multiplies it inside its cone.
- **Fragments** are real bodies on a tiling of the failed member's box, and they inherit its motion. A charge pulverises: pieces at 0.6 size, the rest is dust. Cap: 60. The oldest resting pieces shrink out first.
- **Removed:**
  - static-until-hit members;
  - the BFS support pass;
  - drift-breaking lock constraints;
  - load-tuned joint strength;
  - the topple assist;
  - force-freeze;
  - the sleep toggle;
  - velocity-set blasts with random spin;
  - 0.5 kg random debris.
- **Kept from the reference:** blast hp damage (charges destroy members), fuel cell cook-off, the shaped Cutter cone with pierce through steel armour, Cluster sub-blasts, the score formula (0.6 × mass + 0.4 × height) and the collateral measure.
  - "Standing" now means dropped < 1.2 m and tilted < 25°.

**Changed (game)**
- Desktop console panels became a portrait HUD.
- "Arm" and double-tap are gone: the last placement (or BLAST) starts a 0.5 s fuse.
- Orbit and pinch became a fixed 3/4 camera with a gentle ±3° sway. During the collapse it makes a slow capped orbit (≤20°) with a dolly-back. A swipe still rotates it (optional).
- 5 charge types became 3 (TNT, Cutter, Cluster). Seismic and Cable were cut: Cable needs a drag gesture, and Seismic overlapped TNT once TNT is aimed low. The Cutter now auto-aims horizontally at the building axis, where the core is.
- 4–9 charges per level became 1–3.
- The 12 s settle became a 6 s cap. When the result shows, the simulation stops stepping (nothing is frozen).
- The dark site palette became a warm sunny one: sky gradient, grass, a sand lot, low-poly trees, cream columns, a coloured slab palette per level, cyan glass, a blue steel core, red fuel cylinders, a green protected house and wooden bonus crates.

## 5. Where the brief and the research disagreed

The coordinator asked me to follow the research where the two differ.

| Brief | Built (following the research) |
|---|---|
| Upgrades: power, count, radius, coin value | Power (folds in +3% radius per level), +1 Charge (max 2), Coin Magnet, **Slow-mo** |
| Slowly orbiting cinematic camera | Fixed 3/4 view with a slight sway while placing, and an orbit only during the collapse. Placing on a moving target hurt accuracy |
| pixelRatio ≤ 2 | **≤ 1.5**, and antialiasing only when DPR < 1.5 |
| Shadows cheap or baked | **One** 1024 px PCF (not soft) shadow map. The building casts; glass, debris and the ground do not cast |
| Fewer members | ≤120 members, ≤60 physics fragments, Rapier at 12×4 iterations, `InstancedMesh` per material (about 10 draw calls for the building) |
| (no lives, per brief) | **Kept no lives.** The research's Smash Fest lives/fail-offer meta is the obvious next step, but the brief said prototype without lives |
| 12+ levels | 15 handmade levels. The research recommends a seeded generator with a headless solver, which is not done |

## 6. Performance

**Budget**
- ≤120 members.
- ≤60 physics fragments: the oldest resting ones shrink out; past the cap, a pulverised member turns to dust.
- 40 pooled dust sprites.
- ≤36 flying DOM coins; the rest is credited directly.
- Rapier at 12 substeps × 4 PGS passes, at most 4 fixed steps a frame.
- About 130–290 bonds; contacts between bonded pairs are off until the bond breaks.
- Sleeping is Rapier's own.
- Instanced meshes: about 10 draw calls for the building and 1 for fragments, plus one per visible dust sprite or flash.

**Measured** in headless Chromium with SwiftShader (CPU-rendered WebGL), with `playtest.js` on levels 1–6 at both viewports (v3). These numbers say nothing reliable about a phone.

| Measure | Value |
|---|---|
| Frame time during collapses, average | **33.6 ms** |
| Frame time during collapses, p95 | **41.2 ms** |
| Rapier step, average | **2.0 ms** (v3 buildings are bigger) |
| Physics step in `physics-check.js` | avg 1.3 ms, p95 2.0 ms, max 7 ms |

- The FPS readout is under `?debug`.
- The Rapier -compat file is 2.2 MB of JS with the WASM inlined.

## 7. Testing

```bash
node games/blast/tools/physics-check.js       # physics believability checks (a)-(i), see PHYSICS-AUDIT.md
node games/blast/tools/audio-check.js         # audio: every event heard, one boom per charge, peak <= -1 dBFS, music plays + ducks (see §9)
node games/blast/tools/playtest.js            # full: 390×844 + 375×667, levels 1–6 (sensible bot, retry with the expert plan), upgrade buy, save reload
node games/blast/tools/playtest.js --sweep    # every level once at zero upgrades, sensible bot (real taps, camera swipes)
NAIVE=1 node games/blast/tools/playtest.js --sweep    # naive bot: every wave, charges at the middle of the front of the bottom floor
EXPERT=1 node games/blast/tools/playtest.js --sweep   # the levels' scripted expert plans (sol), then a real BLAST tap
UPG='{"power":3}' LEVELS=5 node games/blast/tools/playtest.js --sweep   # with upgrades, selected levels
```

**Deterministic harness.** The tuning harness is `blast-v3/tune3.js` in the session scratchpad. It plays the same three strategies through `window.__blast.test` on the fixed step, so the results don't depend on frame timing.

**physics-check.js** loads the real page and drives the game's own fixed step through `window.__blast.test`, with no real-time loop. Its results therefore do not depend on the machine's frame rate.
- It checks free fall, support after collapse, left topple (10 seeds), even-base drop, every level intact for 10 s, top speed, the steel core, and neighbour hit/safe (10 seeds each).
- It tries `chromium.launch()` first, then SwiftShader.

**playtest.js: what it does**
- Taps are real touchscreen taps (`hasTouch`). Tap points come from `window.__blast.members()`: members projected to screen, each with a raycast check that the point really picks that member.
- The sensible bot:
  - hits floor 0, preferring the glass bays between columns;
  - puts the Cutter low, on the column or pane nearest the core;
  - on protected levels, uses the ground-floor members furthest from the house;
  - spreads charges apart.
- Level 2 deliberately uses the BLAST button early.

**What it checks**
- Every level reaches the result and passes (up to 3 tries).
- No HUD overlap; every visible button is ≥44 px.
- An upgrade buy is applied and written to `localStorage`.
- The save survives a reload (level, coins, upgrades, and the title shows "PLAY LV 7").
- 0 console errors.
- Last run (07/11/2026): all checks passed at both viewports, 0 errors.

**Network**
- cdnjs (three.js) and jsdelivr (Rapier) are blocked in this sandbox. Both tests route those URLs to local copies of the same versions: `BLAST_LIBS` dir, then `tools/vendor/`, then the session scratchpad `libs/` (Rapier as `rapier3d-compat-0.19.3/rapier.mjs`, from `npm install @dimforge/rapier3d-compat@0.19.3`). Otherwise they fall through to the real CDN.
- Rapier is loaded with a dynamic `import()`, so the local route adds `Access-Control-Allow-Origin: *`.
- Google Fonts is routed to empty; the HUD falls back to Arial Rounded / Arial Black.

**Screenshots**
- In the session scratchpad `blast/`: `title`, `level-start`, `mid-collapse-slowmo`, `coin-burst`, `result`, `upgrade-screen`, `protected-level`, `boss-tower`.
- Physics frame sequences (100 ms of game time apart) are in `blast-physics/`: `before-*`, `after-l1-*`, `after-left-*` and `after-neighbour-{away,toward}-*`.

## 8. Known weaknesses

- **Chaos.** The same plan can win in one run and fail in the next by a few percent of street rubble. The real-time game also steps physics during the 0.5 s fuse, so its outcome can differ from the harness. L2 and L3 sit closest to the line: sensible play puts 13–14% on the street against a 12% limit.
- **Some answers need a camera swipe** (back panels, back piers). Players have to discover the swipe; the tip says "swipe to look" only on L2.
- **The tips say which side.** A player who reads them is close to the "sensible" bot, and the stars are where the skill shows. Tips that are less explicit would make the game harder still.
- **Slender towers kick their foot back** when they tip (real dynamics), so some neighbours sit far away (the sheds are 9 m from the chimney).
- **Not built:** dome/stadium, cooling tower and bridge archetypes (they need curved shells or long spans). The boss levels have no moving or time-limited elements yet.
- **Upgrades make it easier.** Power +8%/level enlarges the blast, so a few plans that fail at zero upgrades pass later.
- **Not tested on a real phone.** WASM physics cost, the 2.2 MB Rapier download and haptics are untested.

## 9. Audio (07/11/2026: new SFX set + procedural music)

**Where it lives.** Every sound and the music are procedural WebAudio, no files. The engine is `games/blast-sfx/sfx.js` (source of truth, 35 events + music); `node games/blast/tools/inline-sfx.js` copies it into this file between `/*@@SFX-BEGIN*/` and `/*@@SFX-END*/`. The game's "audio" block is only glue: game moment → `SFX.play(...)`, density control, music states. The old in-file synth (`sfxBoom`, `sfxGlass`, the crumble-grain bed, `masterLP` slow-mo sweep, `vib()`) is gone; haptics now come from the SFX event table.

**Unlock and settings.** `audioInit()` runs from every tap handler and from a capture-phase `touchend`/`click` listener on the document, so the first tap anywhere creates and resumes the AudioContext (iOS Safari). Music starts only then. The title screen has **🔊 Sound** and **🎵 Music** toggles (v3 had no mute button); both persist in the save (`save.mute`, `save.music`). Sound mutes the SFX bus only; music has its own bus, volume and on/off.

**Event map** (all listed moments fire in `tools/audio-check.js`)
| Moment | Sound |
|---|---|
| chip / menu / map / result / restart buttons | `ui_tap` |
| place a charge / lift it or ↶ | `place_tnt` · `place_cutter` · `place_cluster` (pentatonic step = charge count, panned to the charge) / `remove` |
| countdown starts (button or last charge placed) | `blast_press` + `fuse`; each beep `countdown` 0..2; boss level start `horn` |
| primary detonation (`blast`, cause primary) | one `boom_tnt` / `boom_cutter` / `boom_cluster` per charge, wave step = firing order, in sync with the flash. Cluster bomblets are inside `boom_cluster` (no extra boom) |
| fuel cell cook-off | `fuel_cookoff` (soft "fwoomp", no crack, 5 dB under a boom: never mistaken for a primary) |
| TNT on steel that survives / Cutter cuts steel or a core | `steel_clang` (once per blast) / `steel_shear` |
| member fails | glass `glass_shatter`, slabs/girders/steel `beam_snap`, columns/walls `concrete_crack`; crushed columns (pancake) `pancake` with the floor index |
| the frame starts to give (≥3 fast members or the top drops 7 %) | `metal_groan`, once per wave, before TIMBER |
| TIMBER | `timber` + `SFX.setSlowmo(timeScale)` every frame the game's timeScale changes (pitch, stretch, muffle follow the real slow-mo and its 0.25 s ease-out) |
| physics impacts | `debris` by material (see density) + `SFX.setRumble(√moving·0.08)` |
| wave settles / level ends / building lands | `dust_tail` / `dust_tail` + `gravel` / `gravel` |
| coins | `coin_burst` (≤ 1 per 0.5 s) when a member pays, `coin` per arrival (35 ms throttle, rising) |
| combo ≥3 (when the COMBO pop shows) | `combo` (≤ 1 per 0.3 s) |
| stars, win, fail | `star` 0..2; `win`; `fail` with `reason: collateral` (neighbour or street) or `short` (height, %, core) |
| upgrade bought / boss beaten and a new district opens | `upgrade` / `unlock` (1.3 s after the card) |
| tap on the protected building | `protected_hit` |

**Density (the "wall of sound").** The old bed fired up to 4 noise grains per frame from moving bodies and contacts. Now a physics impact makes a sound only when Δv ≥ 4.5 m/s **and** the impulse m·Δv is over a per-material floor (concrete 2500, glass 250, steel 3000, crate 300 kg·m/s). Each material, each material event and all impact sounds together have token buckets in real time (debris concrete 4/s, glass 3/s, steel 2/s; cracks 3/s, snaps 2/s, shatters 3/s, clangs 2/s, pancakes 5/s; all impact sounds 8/s, burst 3). The rest is carried by the rumble bed and the engine's voice cap (24) + overflow noise bed.
Measured (07/11/2026, each level's scripted plan, wave 1, real-time loop in headless Chromium, old and new page run side by side under the same load; "impact sounds" = old crumble grains + glass, new debris/crack/snap/shatter/clang/shear/pancake/gravel calls; peak = most in any 1 s window):

| Level | before: impact sounds | before: peak /s | after: impact sounds | after: peak /s |
|---|---:|---:|---:|---:|
| L1 | 112 | 34 | 25 | 10 |
| L2 | 138 | 30 | 25 | 11 |
| L3 | 175 | 32 | 31 | 10 |
| L4 | 146 | 34 | 32 | 11 |
| L5 | 84 | 22 | 22 | 8 |
| L6 | 143 | 35 | 32 | 9 |
| L7 | 144 | 30 | 28 | 10 |
| L8 | 177 | 35 | 42 | 14 |
| L9 | 198 | 37 | 45 | 13 |
| L10 | 200 | 35 | 45 | 11 |
| L11 | 146 | 37 | 35 | 10 |
| L12 | 180 | 35 | 42 | 13 |
| L13 | 204 | 38 | 45 | 12 |
| L14 | 201 | 36 | 43 | 11 |
| L15 | 226 | 39 | 35 | 14 |

Biggest collapse (most impact sounds before): L15: 226 → 35 sounds, peak 39/s → 14/s. Max peak over all levels: 39/s → 14/s.

The scratchpad harness is `blast-audio/density.js` (old page = `HEAD` with counters injected).

**The inhale.** The 90 ms "vacuum" before each boom would have made the sound lag the flash by 95 ms (the flash cannot be delayed without changing the visuals). It is now 25 ms (`SFX.INHALE`), only on the first boom of a wave; that boom is scheduled 30 ms after the flash, the others 5 ms.

**Loudness.** The SFX master was limiter-driven: every event, even a coin, went 2–7 dB into the limiter, a single boom 7 dB, a 6-charge wave 10 dB, and everything came out at −1.4 dBFS. New gain staging in `sfx.js`: pre 0.42, glue −12 dB 2:1, limiter −4.5 dB, makeup 1.0, booms and fuel −5 dB, concrete_crack/pancake/debris trimmed. Offline render (48 kHz, limiter input vs threshold): single boom 1.3 dB max gain reduction (0 ms over 3 dB), 3-TNT wave 3.1 dB (10 ms over 3 dB), Cutter+TNT+TNT+Cluster 2.3 dB, 6 TNT + 40 debris/s 5.9 dB. The clipper ceiling keeps the master ≤ −1.1 dBFS. Whole-session sample peak in the audio check: −1.48 dBFS.

**Music.** Procedural, inline, lookahead-scheduled (a 25 ms `setTimeout` wakes a scheduler that books every note 120 ms ahead on the AudioContext clock; after a hidden tab it skips forward instead of bursting).
- Sound: toy kick + clap + hats + woodblock fills, triangle "pluck" bass, two-partial marimba (1 : 3.93) melody, soft triangle pad. C major pentatonic, like the SFX, so booms, coins and stars sit in key.
- Districts: Old Quarter 100 BPM with swing, Downtown 106 BPM light swing, Skyline 112 BPM straight; 3 chord progressions each (pentatonic roots: C, D, E, G, A). Drum/bass grids are seeded per variation.
- Against repetition: an 8-bar section plays A A′ B A. A is the variation's motif, A′ mutates its last half-bar, B is a new phrase seeded by the section counter. The variation order is reshuffled every 3 sections, so no 8-bar section repeats exactly; the A motif keeps the identity.
- States: **menu** (title/map/shop: pad, sparse marimba an octave down, shaker + woodblock, no kick); **plan** (full groove); **count** (kick on the beat, 16th hats, the music low-pass dips to 1.2 kHz and opens to 9 kHz over 0.5 s with a noise + saw riser); **blast** (the first boom ducks the music −12 dB, held 2 s, released over ~1 s; later booms and TIMBER extend it, never past 3 s after the first boom; the booms' own duck stacks on top); **result** (a one-bar marimba sting, rising on a win, falling on a fail, then back to the groove). Slow-mo: the music low-pass drops to 1.4 kHz and new notes are detuned up to −90 cents with `SFX.setSlowmo`, besides the shared slow-mo filter.
- Mix: layers → music bus → low-pass → state duck → music volume (0.85, on/off) → boom duck → slow-mo filter → master. Planning groove ≈ −30 dBFS RMS at the master, peaks ≈ −8 dBFS, under the SFX.
- CPU: about 15 notes/s (2–3 short-lived nodes each, freed on `ended`); the scheduler costs ≈ 0.036 ms per wake-up every 25 ms, ≈ 0.15 % of the main thread (88 ms over a 2 444-wake session, audio check). Audio-thread cost on a phone is not measured.

**Test.** `node games/blast/tools/audio-check.js [outDir]` (see its header). Last run (07/11/2026): ALL AUDIO CHECKS PASSED, 0 console errors; master sample peak −1.48 dBFS. physics-check: all passed; playtest: all passed at 390×844 and 375×667, 0 console errors. All 34 listed sound events fired; primary detonation sounds = charges fired in every level (L1 1/1, L2 2/2, L3 3/3, L4 2/2, L5 2/2, coverage 3/3 with 4 cluster bomblets and 2 cook-offs, fails 1/1); music planning −28.5 dBFS RMS, blast −39.3 (duck 10.8 dB), back to −28.3; toggles persist over a reload. L1–L5 hold only TNT and no steel or fuel cells, so Cutter/Cluster/fuel/steel are covered on L6 with 2 fuel cells added through the test override. The per-level event-count table is written to `event-counts.md` / `.csv` in the out dir.

**Needs a human ear.** Booms at the new level on a phone speaker (they are 4–5 dB quieter than before, by design); whether 8 impact sounds/s still feels "crunchy" enough; the 25 ms inhale (is it still audible?); steel shear's 0.55 s screech starts at the cut, so its snap lands after the visual failure; the music balance and whether the groove gets tiring after 10+ minutes; the sting against the SFX win jingle.
