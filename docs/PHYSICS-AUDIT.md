# Blast Rush: physics audit (07/11/2026)

The owner's verdict was "no physics that feels right at all". This file lists every non-physical
behaviour found in the cannon.js build (commit `a4213f3`), each as **cause → effect**, then what the
Rapier rebuild does instead and how it is checked.

Evidence was recorded on the old build with a virtual 30 fps clock (the page's `performance.now` and
`requestAnimationFrame` driven by hand, so each frame is exactly 100 ms of game time):

- Frames: `before-00.png` … `before-30.png` (level 1, one TNT in the middle of the bottom floor, every 100 ms for 3 s),
  contact sheet `before-sheet.png`. All in the session scratchpad, folder `blast-physics/`.
- Probe: a 1 m box dropped from 3 m (bottom height) at the moment of the blast.

## 1. What was measured on the old build

| Measurement | Expected (real world) | Old build |
|---|---|---|
| 3 m free fall, wall-clock time the player sees | 0.78 s | **1.40 s** (79% too slow) |
| Roof slab of level 1, drop in the first second after its floor went | about 4.9 m | **0.3 m** (frames 2–9: the roof hangs above an empty floor) |
| Density concrete / glass / steel (kg/m³) | 2400 / 2500 / 7800 | 26 / 8 / 40 per m³ of box |
| Glass : concrete mass ratio | 1.04 | 0.31 |
| Steel : concrete mass ratio | 3.25 | 1.54 |
| Simulation step | constant | from 0.0003 s (hit-stop) to 1/60 s, and at most 2 substeps a frame |

## 2. Root causes (cause → effect)

### Time
1. **Slow-mo scaled `world.step(dt)`** (`simDt = min(rdt, 1/30) × timeScale`, timeScale 0.35 for ≥0.8 s).
   → For about a second every collapse ran at a third of real speed, without interpolation. The player sees
   bodies "float": 3 m took 1.40 s instead of 0.78 s. Gravity looked like the Moon's.
2. **Hit-stop set the step to 2% (`ts = 0.02`) for 60 ms after every blast.**
   → 0.33 ms steps; contact and joint stiffness in cannon depend on dt, so for those frames contacts are
   much softer/stiffer than normal: bodies snap or sink, then pop back when dt returns.
3. **Variable step, capped at 2 substeps** (`n = min(2, ceil(simDt/(1/60)))`, frame time capped at 1/30 s).
   → Below 30 fps the world simply runs slower than real time (time is lost every frame), so on a slow phone
   everything falls slower still. The result also differs between devices and runs (not reproducible).

### Scale and mass
4. **Units are metres and g = 9.82, so the length scale itself was right**, but the masses were not:
   densities of 8–40 per m³ (1–3% of real), set by hand per material.
   → Mass *ratios* were wrong (glass three times too light against concrete, steel half as heavy as it should
   be against concrete), so glass panes fly like paper and the steel core hardly outweighs the concrete.
5. **Debris cubes were 0.5 kg each regardless of what broke**, spawned with random velocities (±4 m/s sideways,
   2–7 m/s up) and random spin (±5 rad/s), then deleted after 4 s.
   → Confetti: chunks of a concrete column fly like popcorn and vanish in mid-roll.

### Structure
6. **Members were STATIC until a blast or an impact "activated" them.**
   → A member that nothing touched stayed nailed in place even with nothing below it, until the next
   support pass. Props and the protected house were static too, so a falling tower could not push them
   until a collision "woke" them, and then they jumped.
7. **Unsupported members were found by a BFS support pass (`integrityPass`), at most every 100 ms, and only
   then made dynamic.**
   → Hover: in `before-02…09` the roof slab and the top columns hang above the destroyed floor. The roof is
   still on 5 joints at t = 0.5 s and has fallen 0.3 m.
8. **`LockConstraint` joints with `maxForce` set to 1.5 × the weight share above them.**
   cannon clamps a constraint's force at maxForce instead of breaking it.
   → A joint at its limit yields slowly: members sag, stretch and creep like rubber instead of either holding
   or snapping. Strength was tuned to the load per joint, i.e. per level.
9. **Joints broke on a drift heuristic** (relative offset > 0.14–0.34 m in member A's frame), not on force.
   → Joints stretched up to a third of a metre before letting go. Members visibly hang off each other, then
   snap apart.
10. **`toppleAssist()` added a scripted rigid spin** (ω = 4.2·a/H about the far base edge) to every live member
    after the last charge.
    → Towers "tip toward the hole" because they are told to, not because of their centre of mass. A tower
    with one side gone also could not tip by itself, because of causes 6–9.
11. **Quiet unjointed members were force-frozen** (static after 1.5 s below 0.5 m/s).
    → Slow slides and leans stop dead in mid-motion; anything that later lands on a frozen member hits an
    immovable object.
12. **Sleeping was disabled for the first 2.2 s, then switched on for everything at once.**
    → Before that, piles jitter; at 2.2 s everything that is slow enough goes to sleep at once, including
    bodies still settling.
13. **Solver 8 iterations** with chains of 3–10 storeys of joints.
    → The chain never converges: sag and jitter in tall towers even before the blast.

### Explosion
14. **The blast added velocity directly** (`v += dir × impulse/m × 6`, plus a fixed upward bias of 0.45–0.8),
    and **added random angular velocity** (±3 rad/s per axis, scaled by falloff).
    → Mass barely matters (the ×6 and the 0.4 kg floor flatten it), everything near a charge jumps upward,
    and spin is random rather than coming from where the blast hit the body.

### Contacts
15. **One contact material for everything** (friction 0.6, restitution 0.02).
    → Glass, steel, concrete and wooden crates all slide and bounce the same.
16. **The protected house could only be damaged by "impact" events, and only after it was activated.**
    → Toppling toward it often did nothing (DESIGN.md §2 "the protected-building puzzle is soft").

## 3. What the rebuild does (engine choice: Rapier)

**Choice: Rapier** (`@dimforge/rapier3d-compat@0.19.3`, WASM, from cdn.jsdelivr.net), three.js r128 kept
for rendering. Reasons:
- Its TGS-soft solver stacks heavy bodies stably and converges far better than cannon's Gauss-Seidel at the
  same cost.
- It has CCD, contact-force events and joint motors with a force-based spring model, which made
  measurable breakable joints possible (below).
- cannon.js would have needed the same dt-dependent stiffness hacks that caused causes 2, 8 and 13.

| Old cause | Rebuild |
|---|---|
| 1–3 time | Fixed step 1/60 s with an accumulator. Slow-mo and hit-stop change only how much real time feeds the accumulator (×0.35, ×0). Rendering interpolates between the last two steps. If a device can't keep up, time is dropped (max 4 steps a frame); dt never changes. Detonation timers run on the simulation clock, so a collapse is deterministic. |
| 4–5 mass | 1 unit = 1 m, g = 9.81. Densities: concrete 2400, glass 2500, steel 7800, fuel tank 900 (filled), wooden crate 450. Real friction/restitution per material. |
| 5 debris | A failed member is replaced by real bodies on a tiling of its box (≤ 4 pieces), same material, inheriting v + ω×r. A charge pulverises a member (pieces keep 0.6 of the tile size per axis, the rest is dust); an impact-shattered one keeps 0.85. Cap: 60 fragments. To make room, the oldest *resting* fragments shrink out first, then old shards; if there is still no room, a pulverised member turns entirely to dust. |
| 6–7 static/BFS | Everything is dynamic from the start (and sleeps when genuinely at rest). Nothing decides what is "unsupported": gravity does. The support pass is gone. |
| 8–9 joints | Each touching pair gets one 6-DOF joint whose six axes are stiff, critically damped **force-based springs** (Rapier motors, solved implicitly). Because it is a spring, its load is measurable: F = k·x, M = k·θ. Every step the tension, shear, bending moment and compression of every bond are read from the relative pose of its anchors and compared with fixed material capacities (concrete 350 kN tension, 450 kN shear, 200 kN·m moment, 3 MN crush per 0.384 m² of contact, scaled by contact area; glass and steel have their own). Stiffness also scales with contact area (k ∝ E·A). |
| 10 topple assist | Deleted. A tower with one side blown tips because its centre of mass is outside what is left; the remaining base bonds fail in bending. |
| 11–12 freeze/sleep | Deleted. Rapier's own sleeping only (bodies below its energy threshold). The game just stops stepping when the result shows. |
| 13 solver | 12 substeps × 4 PGS passes. With 12×1 the static loads in tall towers were 2–5× off (non-converged) and bonds broke on their own; at 12×4 the worst bond in any intact level is at 68% of capacity. |
| 14 blast | The only scripted input. A radial impulse J = imp × (1 − d/R)² × exposed area, along (nearest point − charge), applied **at the nearest point** of each body in range, so off-centre hits produce torque. No set velocities, no random spin, no lift bias. The Cutter is a shaped charge: ×2.2 inside its 70° cone, ×0.3 outside. |
| 16 neighbour | The protected house is dynamic and bonded like the target; a falling tower really hits it. Charges still do not *damage* it (game rule), but their impulse pushes it like anything else. |

**Crushing.** A bond that fails in compression means the column itself failed. Contact forces on columns
are also measured (Rapier contact-force events), with the same 3 MN capacity. Either way the column is
pulverised. This makes a dropped tower pancake floor by floor instead of landing as a rigid box.

**Pre-settle.** At level start the world runs 1 s (60 steps) before it is shown, so the frame finds its
elastic equilibrium (under 1 mm of sag). It is ordinary simulation, just not shown.

**Pane play.** Glass panes have 2 cm of play on each side. Without it, a pane whose fixings broke could drop
into the identical bay below and stay pinched by numerical contact preload.

## 4. Checks (`tools/physics-check.js`) — results 07/11/2026

These run headless in Chromium with the same fixed step and 10 seeded runs per randomised check. The seed
changes the glass layout, the weak columns and the charge height.

| Check | Result |
|---|---|
| (a) 3 m free fall | **0.781 s** (expected 0.782) |
| (b) resting bodies after collapses | **3622 checked, 0 unsupported.** 2 friction wedges: rubble held from both sides, counted as supported and reported separately |
| (c) left base columns blown | Slim Jim (7 floors): COM moved left > 0.3 m in **10/10** (−0.6 to −3.7 m). Neighbours (5 floors): **10/10** (−3.6 to −5.9 m). Starter Shack: 10/10 left but small (−0.04 to −0.9 m), because its 2.7 m bay is inside the TNT kill radius and the right columns die too |
| (d) even base, Tall Tony (9 floors) | horizontal COM shift vs drop: 0.55/11.8, 1.14/11.7, 1.07/11.8, 2.29/12.0, 4.29/12.0 m (4/5 under 30%). It pancakes storey by storey; the last intact top section sometimes falls over at the end |
| (e) all 15 levels intact, 10 s | worst creep **0.54 cm**, **0** bonds broken, peak bond load 68% of capacity |
| (f) top speed after 0.2 s | **37.1 m/s** (glass shards next to a charge) |
| (g) steel core | survives TNT (1/1 ground core members alive); Cutter cuts it (0/1) |
| (h) Neighbours | toppled toward the house: hit **10/10** (53–100% damage). Toppled away: safe **10/10** (0%) |
| physics step during collapses | avg 1.06 ms, p95 1.8 ms, max 28 ms (headless Chromium, x86 CPU, run alongside two playtest sweeps; alone: avg 0.94, p95 1.5) |

New frame sequences (100 ms of game time apart, via the test API) are in the same `blast-physics/` folder, each with a `-sheet.png` contact sheet:
- `after-l1-*.png`: level 1, one TNT in the middle of the bottom floor.
- `after-left-*.png`: Slim Jim, TNT on the left base columns.
- `after-neighbour-away-*.png` and `after-neighbour-toward-*.png`: Neighbours.

## 5. Known limits

- **Bond capacities are game-scale constants, not a structural code.** They are the same for every level
  and every load, and were chosen so an intact frame holds (≤ 68%) and a frame missing a side fails.
- **"Pulverised" members lose mass to dust.** A charge keeps about a fifth of a member's volume as chunks.
  This is deliberate (a crushed column must stop carrying load), but it is not mass-conserving.
- **Fragment budget.** Past 60 fragments, old resting rubble shrinks out (0.25 s), and a pulverised member may
  become dust only.
- **No air drag.** Light glass shards right next to a charge leave at up to ~37 m/s and keep that speed until
  they hit something.
- **Rapier's float32.** Bond loads below about 1 kN cannot be resolved; irrelevant at these capacities.
- **Slender towers kick their foot back** as they tip, like a falling chimney. It is real dynamics, but it meant
  moving the protected house to 4 m on Slim Jim and Glass Spire.
- **The -compat build is 2.2 MB of JS** (the wasm is inlined). It loads once and is cached, but it is the
  biggest download of the page.

## 6. v3 addendum (07/11/2026): "why do some blasts explode several times?"

### Diagnosis

Every `blast()` call is now logged with its cause: `primary`, `fuel` or `cluster`, plus the charge id and the game time.

**Reproduction.** I played the v2 levels 1, 2, 3, 5, 8 and 13 with real taps (`blast-v3/mx.js`):
- **No primary charge ever fired twice.** There were 0 re-fires, every charge id appeared exactly once, and the fuse ran once.
- **The "several explosions" were secondary blasts drawn exactly like primary ones.**
  - **Fuel cells.** In level 3, one TNT set off all 3 fuel cells. They cooked off in the **same frame**, 0.1 s after the TNT (`p1.733 f1.833 f1.833 f1.833`). Each one had the full primary treatment: white screen flash, 60 ms hit-stop, big fireball, shock ring, camera trauma and the big boom. Each was also **bigger** than the TNT (radius 4.4 against 3.8). The player saw TNT, a freeze, then a second, bigger "explosion" ×3.
  - **Cluster.** Each sub-blast also got the full primary treatment: four more booms within 0.3 s.
- **Bond breaks never triggered any FX.**

### Fix

- **Fuel cook-off.** It is now its own smaller pop:
  - a red-orange fireball at 0.55× the size, with black smoke;
  - a soft "fwoomp" sound (swept band-passed noise plus a 70 Hz thump);
  - no screen flash and no hit-stop;
  - radius 3.0, below TNT.
  - Several cook-offs are chained 0.11 s apart instead of firing in the same frame.
- **Cluster bomblet.** A small violet pop with a light crack; no flash and no hit-stop.
- **Primary charges.** These alone keep the flash, freeze and boom.
- **New check (i)** in `tools/physics-check.js`: placing N charges gives exactly N primary detonations, one per charge id, with no re-fire. Result: `1→1, 2→2, 3→3, 5→5`. On the fuel-yard fixture, fuel and cluster pops are counted separately.
- **Screenshots:** `blast-v3/secondary-*.png`.

### Other physics changes in v3

- **Crushing by contact ignores the ground.** Ground-floor columns are bonded to their foundation *and* touch the ground. The solver could spike that ground contact (4–10 MN) when a neighbouring island woke up, and that "crushed" an untouched neighbour's columns. Member-on-member contacts still crush.
- **Pre-settle scales with height:** 60 + 10 × floors steps. A 12-floor tower with outrigger floors needed about 2 s to find its elastic sag; it showed as 4 cm of "creep" in check (e).
- **New materials**, all with real densities (see BUILDINGS.md §3):
  - `wall` (shear wall / stone facade, armour 0.35);
  - `panel` (precast, weak `panel` joints);
  - `core` (concrete core, hp 450);
  - `pier` (hp 220: a direct TNT hit only);
  - `truss` (transfer or outrigger floor);
  - `brick` (masonry bonds: strong in compression, weak in tension).
- **The physics-check fixtures no longer depend on the level list.** Checks (a)–(h) run on fixed copies of the v2 test buildings (`FIX` in physics-check.js), so they keep measuring the same physics now that the levels are new. (e) still runs on every current level.
