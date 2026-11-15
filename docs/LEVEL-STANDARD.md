<!-- Copied from the team's internal level-build standard (agent skill 'blast-level-standard'), 15/11/2026. Paths refer to the original project layout: levels6/... = src/levels6/... in this repo. -->

# City Blast level standard (benchmark: L32 "Sky Saucer")

> **Standard version: STD-v3** (14/11, §10 — no placement hints, D-blast-NOHINT). STD-v1 = L32 as of round 6 (commit `b3d77b3f`, 12/11/2026; `L32-MONUMENT.md` §3e). L32 keeps being tuned:
> every change bumps the version (§10). Tier scaling: §4b. Per-level needs and batches: `games/blast/levels6/LEVEL-NEEDS.md` (+ `.json`).

Owner: "L32's direction is right ... use L32 as our common standard; once L32 is fixed, apply it to the other levels."
This skill is the **build standard and process**. General design method (one idea per level, sawtooth, near-miss, review rubric) lives in
`.claude/skills/game-designer/SKILL.md`: load both; do not repeat it here.

**Sources (read when you need depth):**

| What | Where |
|---|---|
| The prototype, its numbers and issues | `games/blast/levels6/L32-MONUMENT.md` (§3 RC, §4 numbers, §5 rules, §6 helper API, §7 issues) |
| Helpers (`mon14`, `M14_RC`, `rcDecor`, `floorIn`, `rcStage`, `M14_SCENE`) | `games/blast/levels6/patch/v14-monument.js` |
| Decisions | `02_decisions.md`: D-blast-THRESH, -HERO-PROC, -HERO-MONUMENT, -RC, -NOCAP, -MODEL, -ART-1/-ART-2, -BRIEF-100 |
| Determinism procedure | `RUNBOOK.md` R-11 |
| Other levels today | `games/blast/levels6/L13-36-STATUS.md` (§2, §9), `games/blast/levels6/L1-12-DRESS.md` |
| Figma tiles | `games/blast/art-brief/heroes/SHEETS.md` + PNGs (F1b–F6) |

## 0. Never add without Owner (D-blast-NONEW, 14/11/2026)

No agent, the Lead included, adds a NEW element to the game on its own: no new rule, material, obstacle, mechanic, button, screen,
meaningful decor (e.g. a painted target zone) or lesson. Write it as a proposal in your report; it is built only after Owner approves
(a D-xxx). Tuning, fixing or removing what already exists under a decision is fine. Example of what went wrong: the yellow
"Target Lot" (L36) and the street lesson were added by the curriculum without Owner and later removed (D-blast-NOLOT, D-blast-THRESH-2).

## 1. The standard in one screen

A finished level:
- **Hero = the Figma tile, built big.** Instantly recognisable, one mild twist (D-blast-ART-2), no logo/text/real name.
- **Monumental.** 70–90 m tower, many storeys, glass faces with lit interiors seen through them. Never a "toy cylinder".
- **Swipe up/down + pinch-zoom** to explore it; the camera never enters a building.
- **Reinforced concrete hero (tier `M14_RC`).** 1 TNT chips it, 2 show rebar, 3 break a member. Damage accumulates across blasts. ≤ 4 TNT never drops it.
- **Difficulty from surroundings only:** neighbours, protected buildings, barrels/props, TNT count, opening yaw. The hero's shape is never touched for difficulty.
- **Fixed thresholds:** PASS 85%, protected ≤ 5%, street ≤ 10%, unlimited waves, about 2 minutes (D-blast-THRESH, D-blast-RC).
- **Deterministic:** same plan, same result, in every determinism mode (R-11).
- **Proven:** bot gate green, tile-vs-game shot, damage-stage shots, honest report.

## 2. Hero building

| Rule | Standard (from L32) |
|---|---|
| Faithful to the tile | Copy the Figma tile part for part: masses, proportions, signature details. Tile first, no compromise for difficulty (D-blast-HERO-PROC). Exactly one clear twist. |
| Monumental scale | 1.5–2× the old hero: towers 70–90 m with mast (L32: 72.6 m roof, 86.3 m mast). Neighbours stay 20–30 m so the city reads small. Opening camera `fillMax` 0.73. |
| Storeys | 1 structural storey = 6 m = 2 visible floors. Real members per storey: corner piers ≤ 1.18 m, a second line of slimmer piers (≈ 0.9 m), 1 floor cassette. |
| Glass + interiors | Faces are `mglass` panes hung on the slab edge (carry nothing, no shadow). Interior = **decor only** on that storey's cassette: floor plate, core with lit doors, columns, stairs, furniture, lamps, a different seeded layout per floor (`floorIn`; shapes `ibox / icyl / ibush / lit`). Nothing inside is a body. |
| Round / overhanging parts | Cassettes `mdeck` with **steel-type joints** (concrete joints crack the cantilever at rest). Round pieces cut in **16 sectors**, each riding the member under it. |
| Camera | Generic, already on for every level: vertical drag pans (axis lock after 10 px), pinch/wheel zoom to 14 m, clearance 6 m from the hero, 3 m from neighbours, reset on BLAST / double-tap. A hero level sets `mon:1` (haze, tap assist, gesture hint) and `lotK` (wider pad). |
| Tap assist | `mon:1`: a tap within 16 px of a column thinner than 16 px goes to it; a tap on a pane goes to the pier behind it. |
| Reuse | Write a part function per hero with the v14 helpers (member keys, glass/lamp materials, sector shapes, `floorIn`, camera code); point the level at it. Do not fork the camera or the RC tier. |

## 3. Materials

**Ladder (v10, per TNT):** wood < brick < concrete < RC < steel. The ladder's own `rc` pier (0.75 m², hp 220) is untouched. The hero uses the
massive-section RC tier below: it takes more TNT because of its section, not because it is a new family.

**RC tier `M14_RC`** (`patch/v14-monument.js`), the same for every hero (D-blast-RC: material strength may change, the shape may not):

| Key | Used for | hp | armor | shove (bonded) | Damage between blasts |
|---|---|---|---|---|---|
| `hrc` | every structural pier (shaft, stem) | 600 | 0.05 | 0.45 | **stays** (all other families reset at BLAST) |
| `mdeck` | every floor cassette | 600 | 0.05 | 0.45 | stays |
| `mcol` | slim columns (saucer ring) | 300 | 0.25 | 0.30 | steel-ladder member |

TNT on contact does ≈ 247 to a pier (39% each). No random term (determinism unchanged).
*hp/armor/shove: from L32 tuning; update when L32 is final.*

**Damage stages players see** (`rcDecor` on each pier's outward faces, `rcStage`):

| TNT on one pier | Damage | Stage shown | Structure |
|---|---|---|---|
| 1 | ≈ 39% | chips, hairline cracks | nothing |
| 2 | ≈ 78% | cover gone over ~1.7 m, dark core, rusty rebar cage, long cracks | still carries |
| 3 | fails | pier breaks up | storey loses a leg; tower stands on the others |

Cracked concrete does not heal: 1 + 1 + 1 over three blasts = 3 at once.

## 4. Difficulty

**Tune with surroundings only**, in this order of preference:
1. neighbours: position, height, legs, material (keep them **outside the hero's widest part + 8 m**);
2. protected buildings (distance, side);
3. barrels / props (free blasts);
4. TNT count, 7–12;
5. opening yaw / camera framing.

Never change the hero's look for difficulty. Its material is the fixed RC tier. The fail tip must name the trick (L32: "The tower is
reinforced: three TNT on one pier, two piers side by side.").

### Numeric targets: the one table to update

> **STD-v1 = L32 round 6 (12/11, commit b3d77b3f; round 3 eased the RC build, rounds 4–6 readability).** Source: `levels6/L32-MONUMENT.md` §3b–§3e. Lead updates this table only; nothing else in this file restates these numbers. ⚠ = waits on a Owner decision. Every change here = a new STD version in §10.

| Metric | Target | L32 STD-v1 (round 6) | Status | Tool |
|---|---|---|---|---|
| PASS | 85% every level | 85% | fixed (D-blast-THRESH) | — |
| Protected damage | ≤ 5% | none on L32 | fixed | gate-bot |
| Street debris | ≤ 10% | none on L32 | fixed | gate-bot |
| Waves | unlimited | unlimited | fixed (D-blast-RC) | — |
| Time per level | ≈ 2 min (H/boss may run longer, see game-designer §3) | 100 s | fixed target | time-bot |
| TNT given | 7–12 | 9 | ✓ | level data |
| Expert | 4/4 seeds, margin ≥ +3 (≥ 88%) | 4/4, 88%, +3, one blast | ✓ (at the floor) | gate-bot |
| Expert spare TNT | 0–1 (D-blast-TNTTIGHT) | 1 | ✓ | gate-bot `tntLeft` |
| Sensible (hint follower) | normal: wins in ≤ 2 blasts; Hard/boss ≤ 50% | 4/4, 90%, 2 blasts | ✓ | gate-bot |
| Sensible variants (8) | N 6–8/8, H 3–5/8, boss 1–3/8 | 7/8 | ✓ | time-bot |
| Naive (all TNT front-middle) | fails ≥ 70% of runs after L2 | 0/4 | ✓ | gate-bot |
| Lesson-less plan | fails on every lesson level | 0/4 (74%) | ✓ | gate-bot |
| Foot plans (random 16, face 36) | 0 from L3 (relief ≤ 30%); ≤ 1/16 accepted | 0/16, 0/36 | ✓ | foot-bot |
| ≤ 3 TNT drops hero | never | 0 of 128 plans | ✓ | structured + random |
| 4 TNT drops hero | rarely, only on the taught spot | random 0/60; structured 0/36; only the solution itself (2 + 2 at the barrel legs) | ⚠ D-blast-RC said "≤4 never" | structured + random |
| Hero minimum TNT to drop | ≈ 4 on the taught spot, 6 elsewhere | 4 at the barrel piers, 6 elsewhere | ⚠ | structured + search |
| Two adjacent piers gone | always falls, any blast split (storey rule) | 15/15 splits fall | ✓ | structured |
| Random full-TNT search | low pass rate | 0/24 | ✓ | search-bot |
| Teaching aid | surroundings make the solution findable (e.g. barrels at the key piers) | 4 barrels on a painted yard at the two front legs (40% / 32% to those piers) | ✓ | — |
| Readability aids (rounds 4–6) | a first-timer finds the trick by attempt 2 | opening push-in on the foot (`monIn`, 0.3 s) · dots with fixed slots, tap on dots places TNT, tip line until the first BLAST · cleanup dots on what is left after the tower falls · fail text in on-screen words | ✓ scripted; person not re-tested on round 6 | scripted newcomer + blind tester |

### 4b. Tier scaling (STD-v1 → every tier)

L32 is a **Normal teach** level. A level of another tier takes the §4 targets through this table; the fixed rows of §4 (PASS, protected,
street, waves, D-blast-TNTTIGHT) hold on every tier. Columns follow LEVEL-BRIEF-100 §3.1 (T tutorial, R relief/teach, N normal, H Hard, SH
Super Hard, B boss). When §4 moves (new STD), move the N column by the same step and the other columns with it, then log it in §10.

| Metric | T | R | **N (= L32)** | H | SH | B |
|---|---|---|---|---|---|---|
| TNT given | 4–6 (below 7–12: Owner) | 7–9 | 8–11 (L32: 9) | 10–12 | 11–12 | 12 |
| Expert spare TNT | 0–1 | 0–1 | 0–1 | 0–1 | 0–1 | 0–1 |
| Expert margin (4/4 seeds) | ≥ +8 | ≥ +6 | +3 … +8 | +3 … +6 | +3 … +5 | +3 … +5 |
| Expert blasts | 1 | 1–2 | 1–2 | 1–2 | 2 | 2–3 |
| Sensible (gate hint follower) | 4/4 in 1 blast | 4/4, ≤ 2 blasts | 4/4, ≤ 2 blasts | carries the misreading: 0–2/4 | 0–1/4 | 0–1/4 |
| Sensible variants (time-bot, 8) | 8/8 | 7–8/8 | 6–8/8 | 3–5/8 | 2–3/8 | 1–3/8 |
| Naive must fail | may win | ≤ 2/4 | 0–1/4 | 0/4 | 0/4 | 0/4 |
| Lesson-less must fail | n/a | 0/4 on a teach level | 0/4 | 0/4 per combined lesson | 0/4 | 0/4 |
| Foot random 16 / search 24 | not gated | ≤ 5/16 · ≤ 6/24 | ≤ 1/16 · ≤ 2/24 | 0/16 · 0/24 | 0/16 · 0/24 | 0/16 · 0/24 |
| Hero lock, RC hero | n/a | ≤ 3 never; min 6 (3 + 3) | ≤ 3 never; 4 only on the taught shortcut | ≤ 4 never anywhere | ≤ 5 never | ≤ 5 never |
| Hero lock, ladder-material hero | none | ≤ min − 2 never | ≤ min − 2 never | ≤ min − 1 never | ≤ min − 1 never | ≤ min − 1 never |
| Time-bot | 60–75 s | 80–100 s | 95–140 s (L32: 100) | 180–270 s | 240–290 s | 270–340 s |
| Mechanics combined | 1 | ≤ 2 | ≤ 2 | ≤ 3 | ≤ 3 | ≤ 4 |

**Readability aids, in the L32 order** (fewer on H/SH/B, more on T/N; feedback is never removed, only cues):

| Aid | T | R / N teach (= L32) | N practice | H | SH / B |
|---|---|---|---|---|---|
| 1 Camera opening | push-in on the solution side + finger pointer | push-in on the foot, yaw faces the solution | push-in on the foot, neutral yaw | push-in on the foot, yaw not facing the solution | whole-lot opening |
| 2 Barrels / drums at key legs | painted yard (barrels not taught before L32) | at the key legs (from L32) | elsewhere on the plan | never at the solution legs | no gift barrels |
| 3 Dots / pips | cue dots from the first second + tip line | cue dots from the first second + tip line | damage dots only (on a hit member) | damage dots only | damage dots on RC members only |
| 4 Cleanup dots | yes | yes | yes | from the second attempt | no |
| 5 Fail text | count + place, on-screen words | trick + place, on-screen words | trick + place | trick, no counts | trick in one line |

## 5. Budgets (guides, not caps)

No body cap (D-blast-NOCAP, `BODY_CAP = 1e9`): never cut glass panes or detail for body count. Re-measure on a phone before raising these.

| Budget | Guide (from L32) | L32 measured |
|---|---|---|
| Hero bodies | ≤ 270 | 267 |
| Level bodies (non-anchor) | ≤ 450 | 419 |
| Decor pieces (instanced) | ≤ 2,000 visible (+ hidden damage marks) | 1,655 + 1,296 marks |
| Triangles per frame incl. shadow pass | ≤ 105k (L32 is 114k after marks: watch) | 114k |
| Draw calls while planning | ~35 | 35 |
| Physics ms/step, headless, quiet machine | ≤ 8 | 6.8 |
| Bonds cracked at rest | **0** (hard rule) | 0 |

Measure ms/step only on a quiet machine (other bot jobs inflate it up to 7×). fps from headless swiftshader is a ratio, not a phone number.

## 6. Process, step by step

1. **Tile.** Open the hero's tile (`art-brief/heroes/`, SHEETS.md). Fill the game-designer level template. Write the twist in one line.
2. **Build the hero** with the v14 helpers, RC tier, glass + `floorIn`, `mon:1`, `lotK`. Load check: 0 errors, 0 bonds cracked at rest.
3. **Determinism first** (R-11). A gate result means nothing until this passes.
4. **Bots:** gate → foot → time → search, plus the structured hero check (≤ 4 TNT plans, minimum TNT).
5. **Read the metrics** against §4's table. Write them down before changing anything.
6. **Tune the surroundings only** (§4 order). Rebuild, re-run 3–5. Two tuning rounds max before asking the Lead.
7. **Checks + shots + report** (§7).

**Commands** (shell Linux, from `games/blast`; no macOS needed):

```bash
export BLAST_LIBS=<scratchpad>/libs            # three.js etc.; fallback games/blast/tools/vendor
export NODE_PATH=/opt/node22/lib/node_modules  # playwright
G=checkpoints/index-v10h-l32-monument.html     # the build under test (yours: a new checkpoint name)

node levels6/tools/src-l32.js                                  # build (base index-v10f-l13-36.html is read only)
MAXL=36 LIVE=2 node levels6/tools/determinism-check.js $G 32 5 # R-11; MAXL=36 needed for levels > 12
N=4 node levels6/tools/gate-bot.js $G 32                       # expert / sensible / naive / lesson
N=16 MODE=random,face node levels6/tools/foot-bot.js $G '' 32  # foot plans
K=8 node levels6/tools/time-bot.js $G 32                       # time estimate + sensible variants
K=24 node levels6/tools/search-bot.js $G 32                    # blind random search
```
In the page: `?lv=N`, `?debug=1`; test API `window.__blast.m14` (`info`, `cam`, `set`, `stats`, `inside`, `breaks`). The load check and
gesture test scripts lived in a scratchpad (L32-MONUMENT.md): use games/blast/tools/loadcheck.js and games/blast/tools/gesture-test.js (may need path edits); ask the Lead; target `ok=true`, 0 errors, gestures 13/13.
Never edit v10–v13 patches or another level's source to make yours pass; never rebuild from a checkpoint you did not name as base.

**Which model does what (D-blast-MODEL):**

| Work | Model |
|---|---|
| Build/rebuild a hero, rebuild a level, tune difficulty | **Fable** |
| Run bots, measure, checks, shots, reports, small fixes, review | Sonnet / Opus |

## 7. Definition of Done (one level)

- [ ] Hero matches its tile; one twist; no logo/text/real name. Own score "reads like the tile at phone size" ≥ 4/5.
- [ ] Monumental: height and storeys per §2; glass + lit interiors visible at the 14 m zoom.
- [ ] Every structural pier `hrc`, every cassette `mdeck` (tier `M14_RC`), `rcDecor` on pier faces.
- [ ] `mon:1`, `lotK` set; camera never inside a building (72-pose sweep); gestures 13/13.
- [ ] Load check ok, 0 errors; 0 bonds cracked at rest (`__blast.m14.breaks()`).
- [ ] Determinism identical in all modes (seq, after, fresh, wait, raf, live).
- [ ] Every row of §4's table met, scaled by §4b for the level's tier, or listed as a miss with numbers.
- [ ] Report names the STD version the level was built against, and the gate was re-run against the **newest** STD (§10) before hand-in.
- [ ] ≤ 4 TNT never drops the hero (structured + 160 random); minimum TNT reported.
- [ ] Budgets in §5 met or flagged.
- [ ] Hero shape unchanged since the tile pass (diff shows only surroundings / TNT / yaw changed during tuning).
- [ ] Shots in `levels6/shots/<level>/`: opening · swipe-up · zoom through glass · **tile vs game** · mid-collapse · **damage stages 1, 2, 3**.
- [ ] Report (in the level's status doc + 1 line in `06_status.md` via the Lead):
  bot table (expert/sensible/naive/lesson/foot/time/search/min TNT), budgets, what was tuned and why, honest issues list, files touched.
- [ ] Not committed / deployed by the subagent unless the task says so.

## 8. Roll-out across agents

Order: **L32 final first** (the easing pass), then batches. Group by hero type (L32-MONUMENT.md §5), so one recipe serves a batch:

| Batch | Hero type | Tiles | Levels (mapping re-checked 13/11 against `levels-v6*.json` `heroId`) | Interior idea |
|---|---|---|---|---|
| A | Towers / slabs (the L32 recipe) | F01, F03, F04, F06, F12, F16, F19, F21, F22, F24, F25, F26, F27, F28, F30, F31, F34 | 1, 2, 3, 4, 5, 8, 9, 12 · 14, 15, 17, 18, 21, 22, 23, 24, 25, 26, 27, 29, 30, 31, 33, 34, 36 | offices / floors (as L32) |
| B | Halls / wide low masses | F05, F10, F14, F35 | 6, 7, 11 · 16, 19, 35 | hall seen through a glass front |
| C | Bridges / linked towers | F07, F09, F17, F32 | 10 · 13, 20, 28 | deck with traffic, towers as batch A |

Split into batches of 4–6 levels in curve order (early first): **A1** 1–5 · **B1** 6, 7, 11, 16, 19, 35 · **A2** 8, 9, 12, 14, 15 ·
**C1** 10, 13, 20, 28 · **A3** 17, 18, 21, 22, 23 · **A4** 24, 25, 26, 27, 29 · **A5** 30, 31, 33, 34, 36; recipes, risks, lanes and the
helper pre-step H0 in `levels6/LEVEL-NEEDS.md` §4. (L1-12-DRESS §1 is stale for L7–L11; the level data is the source.)

**STD version per batch:** each batch writes in its status doc the STD version it was built against (e.g. "built on STD-v1"). Before
handing in, it checks §10: if a newer STD exists, it re-runs the full gate (§6 bot set) against the newest §4 / §4b numbers and reports
both results; a level that met the old STD but misses the new one is reported as a miss, not handed in as done.

**File ownership (no two agents on one file):**

| Owner | Files |
|---|---|
| Shared helpers (one agent at a time, Lead assigns) | `levels6/patch/v14-monument.js` (RC tier, camera, `floorIn`, sectors) |
| Each batch agent | its own patch file `levels6/patch/v15-<batch>.js` (part functions), its own build tool `levels6/tools/src-<batch>.js`, its own checkpoint `checkpoints/index-v10i-<batch>.html`, its own shots dir and status doc |
| Read only for everyone | v10–v13 patches, `index-v10f-l13-36.html` and other existing checkpoints, `src-l1-12.js` / `src-l13-36.js` (level data changes go through the batch's build tool as overrides, like `M14_SCENE`) |
| Lead only | `02_decisions.md`, `06_status.md`, `RUNBOOK.md`, this skill's §4 table |

A helper change needed by a batch → ask the Lead; the helper owner makes it, then every batch re-runs determinism + gate.

**One checkpoint per batch:** the batch agent builds one checkpoint, runs the full §6 bot set on all its levels, delivers shots + report;
`qa` reviews; Owner approves the batch in the Planner before the next batch starts. Merge into one game build only after approval.

## 9. Red flags and anti-patterns (learned on L32 and L1–36)

| Anti-pattern | What happens | Do instead |
|---|---|---|
| Neighbours too close | The hero's fall crushes them for free (at ±16 m the saucer took both blocks with 2 TNT) | Hero's widest part + 8 m (L32: blocks at ±25 m) |
| Hardening only the piers | Two TNT on a pier killed the 150 hp cassette below; 4 TNT on an upper storey dropped the tower (106/160 plans) | Piers **and** cassettes on the RC tier |
| Wide piers (> 1.18 m) | They never crush, the tower never pancakes | Corner piers ≤ 1.18 m + a slimmer second line |
| "Toy cylinder" / slim shaft with drawn crown | Does not read as the monument; Owner rejected it | Full tile at 70–90 m, storeys, glass, interiors |
| Changing the hero to tune difficulty | Breaks D-blast-HERO-PROC | Surroundings, TNT, yaw only |
| Concrete joints on cantilevers | Cracked at rest; first L32 build fell before frame 1 | Steel-type joints (`mdeck`) |
| Interior as bodies | Body count and physics cost explode, debris noise | Interior is decor on the cassette |
| Softer joints to fix an edge case | 4 TNT then dropped the tower in 4–6 of 64 plans | Keep the tier; tune surroundings |
| Damage split over blasts behaves differently from one blast | Player cannot predict (L32 issue 1) | Test both splits; target same outcome |
| Steel-leg / dark-pier hero bases left from older passes | Reads as a trick, not a building (L15, 17, 19, 20, 26, 28, 30, 32 flagged) | Move the material lesson to a neighbour |
| Gate run before determinism | Results not reproducible | R-11 first, every rebuild |
| ms/step measured with other bots running | Off by up to 7× | Quiet machine, then phone |
| Tiny targets at opening view (2.5–8 px) | Players miss | `mon:1` tap assist; zoom is the intended way to place |

## 10. Standard changes (STD-vN changelog)

Rule: any change to L32 that moves a number in §3, §4, §4b or §5, or adds/removes a readability aid, is a new STD version. The Lead
adds one line here (newest last), bumps the version line at the top, and tells every running batch (§8: they re-gate before hand-in).
A change that moves no number (art, wording only) is not a new version.

| STD | Date · commit | L32 state | Numbers that moved (old → new) | Who must re-gate |
|---|---|---|---|---|
| v1 | 12/11/2026 · `b3d77b3f` | round 6 (`L32-MONUMENT.md` §3e): RC tier, storey rule, TNT 9, 2 + 2 at the barrel legs, readability aids | baseline. Against the round-3 table this skill first held: expert 90% +5 → **88% +3**; sensible 88% → 90%; variants 6/8 → **7/8**; lesson-less 68% → 74%; time 117 s → **100 s**; ≤ 3 TNT plans 0/104 → 0/128; 4 TNT structured 3/37 → 0/36 (+ the solution); barrels 49 / 44% → **40 / 32%** per pier; aids added: `monIn`, fixed-slot dots, tip line, cleanup dots, fail text in on-screen words. §4b tier scaling added. | — (no batch built yet) |
| v2 | 13/11/2026 · A1 hand-in | L32 unchanged; rules learned on A1 (L1–5) and Owner K1–K3 | **Fail text ≤ 9 words** (was 15–25 from the STD helper; check-main B18 wins). **Ladder heroes: floors/slabs blast-proof**, so 1 TNT high up never drops a tower (A1 found 76–88% single-TNT drops). **Tip rule** for ladder towers: two neighbouring legs gone → the third leg of that face gives way, 2.5 s hinge on the far legs (A1 v15-a1). **T/N-early (L1–5) time band 60–110 s** (was 95–140; B1 wants short early levels). RC from L17 only (K1); T 4–6 TNT (K2); RC: ≤3 never, 4 only on the taught spot (K3). | A2, B1 and later build on v2. A1 already meets it. |
| v3 | 14/11/2026 · Owner D-blast-NOHINT | L32 numbers unchanged; aids table | **No placement hints on any tier**: no cue dots, no damage dots, no tip line, no push-in to the solution/foot (open on the whole building), fail text names a principle, never a spot. Kept: L1 tutorial hand, first-use hand for a new booster/material. Gate + newcomer bot run with no dots; re-tune T/R levels that fall below §4/§4b. `?hints=1` restores the old aids for comparison only. | A1 re-gated; A2, B1 and later build on v3. |
