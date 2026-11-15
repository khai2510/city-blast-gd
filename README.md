# City Blast! — game-design review pack

This repo holds the **current playable build** of *City Blast!*, its **real source**, the **level and tuning data**, and the
**design docs**, so a reviewer (Gemini in Google AI Studio) can do a game-design review.

> **Review the game. Do not rewrite it.** Findings, numbers and proposals are welcome; a new engine, a port to another framework or
> a "cleaned-up" version of `index.html` is not. Anything new (a rule, material, obstacle, mechanic, button or screen) is a
> *proposal* for the owner to approve (decision D-blast-NONEW), never something to build in.

Start with **[BRIEF.md](BRIEF.md)** (the review tasks and the opening prompt).

## Run it

It is a static web page: one HTML file plus sound samples. No build step, no install.

```bash
python3 -m http.server 8080        # from the repo root, then open http://localhost:8080/
# or
npm start                          # same thing through npx http-server (package.json)
```

- three.js r128 and Rapier 0.19.3 (WASM physics) load from pinned CDNs (`cdnjs.cloudflare.com`, `cdn.jsdelivr.net`), exactly as the
  shipped game does, so the page needs internet. Fonts, music, images and the level data are embedded in `index.html`.
- `sfx/*.mp3` = recorded sound samples fetched after the first tap (relative path `sfx/`). Without a web server (`file://`) the game
  falls back to procedural sound. The samples are Mixkit sounds used inside the game build only (see `sfx/LICENSE.txt`): do not
  redistribute them on their own.
- Portrait phone layout (390 x 844 is the reference). In a desktop browser use the device toolbar; mouse clicks work as taps.
- Useful URL flags: `?lv=N` opens level N directly · `?dev=1` shows the yellow "Level" picker · `?hints=1` the old placement aids (comparison
  only) · `?boosters=1` all boosters unlocked · `?metrics=1` metrics panel. Full list: `docs/MAIN-BUILD.md` §2.
- Test API in the browser console: `__blast.state()`, `__blast.levels()`, `__blast.members()`.
- AI Studio: "Import from GitHub" and use the app preview on `index.html` at the repo root. `package.json` only adds a `start` / `dev`
  script that serves the folder; there are no dependencies.

Checked 15/11/2026 (headless Chromium, 390 x 844 touch, served with `python3 -m http.server`): title screen with 0 console errors,
0 failed requests; Level 1 played through the real controls (single tap = 1 TNT, double tap = 1 more TNT + BLAST) and won (90.4 % clear, 1 blast, result screen, +10 coins).

## The game in one screen

A casual physics demolition puzzle (hybrid-casual, portrait, one hand). Each level is a small city lot with a landmark-style **hero
building** (and sometimes neighbours); you bring it down with a limited stock of TNT.

| Rule | Value |
|---|---|
| Place TNT | **tap a building member** (post, pier, wall...) = one TNT exactly where you tapped (no snap, no stacking, placed TNT cannot be removed) |
| Blast | **double tap** = one more TNT there + BLAST of every placed TNT. From L2 there is also a BLAST button; L1 has none (the hand teaches the double tap) |
| Win | clear **at least 85 %** of the target (PASS 85, same on every level) |
| Protected buildings | blue school / hospital: **max 5 % damage**, else the attempt fails even at a high clear % |
| Blasts | **unlimited waves** while TNT lasts: blast, look, place more, blast again |
| Hints | **no placement hints** on any level (no dots, no camera push-in to the answer, fail text names a principle, never a spot) |
| Props | trees, cars, crates are decoration: **not counted** in the % |
| Street | the road is scenery: no street-rubble rule in the default build |
| Tiers | Normal; **Hard = purple** badge; **Boss = orange** badge (L10, L20, L30); Relief / teach levels after bosses |
| TNT | the only charge on L1-36; 4-6 on tutorials, 7-12 otherwise |
| Boosters | Wrecking Ball / Safety Net / Sky Strike, won on the L10 / L20 / L30 boss, introduced on L11 / L21 / L31 |
| Coins | win 10 / 20 / 30 (normal / Hard / Boss), loss 0; spent on permanent Upgrades |

Physics: Rapier rigid bodies in real units (1 unit = 1 m, kg, s), fixed 1/60 s step; members joined by breakable 6-DOF spring
joints; **deterministic** (same plan, same result). Difficulty is meant to come from the surroundings (neighbours, protected
buildings, barrels, TNT count, opening angle), never from changing the hero building (D-blast-HERO-PROC).

## Where things are

| Path | What |
|---|---|
| `index.html` | The current playable build (6.6 MB, one file). Its first comment lists every source file and its hash. |
| `sfx/` | Sound samples the build fetches at runtime (+ licence note). |
| `BRIEF.md` | The review brief: the 5 tasks and the opening prompt. |
| `data/levels.json` | **Authoritative** level data: the 36 runtime level definitions read from the running build. |
| `data/levels-summary.csv` | One row per level: tier, hero tile, TNT, parts, protected buildings, barrels, idea. |
| `data/levels-measured.json` | Measured footprint of every building (bounding box, height, member count by material, base rule applied). |
| `data/level-template.json` | The level editor's JSON format: field list, a minimal example, a real level (L6), the hero tile catalogue. Use it for new-level proposals. |
| `data/materials.json` | Every member material (hp, armour, damage multiplier, density, joint family, notes), the material ladder, the RC hero tier, base presets. |
| `data/blast-tuning.json` | TNT / charge constants, damage falloff, joint capacities, fixed thresholds. |
| `data/boosters.json` · `data/economy.json` · `data/tutorial-schedule.json` | Boosters, coins / upgrades / shop / ads rules, what each level introduces. |
| `data/bot-results.json` | Bot gate on this build, all 36 levels (expert / sensible / naive / lesson-less bots): pass %, best / median clear %, near-lose 80-84 % and near-win 85-88 % counts, fail codes. Raw log in `data/bots/`. |
| `data/bots/newcomer/` | Blind "first-time player" bot runs (no hints, 2 attempts), L1-5. |
| `docs/` | Current design docs (list below). |
| `docs/DECISIONS.md` | Every City Blast decision (D-blast-*) in order; mostly Vietnamese. The newest entry wins. |
| `src/` | The **active** source: every file the build script reads, at its original relative path, plus `src/tools/build-main.js`. |

### docs/

| Doc | What it covers |
|---|---|
| `DESIGN.md` | Original game design (core loop, physics model, audio, feel) |
| `LEVEL-STANDARD.md` | The level-build standard (benchmark L32 "Sky Saucer"): difficulty targets per tier, bot gates, hero rules, anti-patterns |
| `GAME-DESIGN-CHECKLIST.md` | The team's game-designer checklist: principles, level template, curve numbers, review rubric, red flags |
| `MATERIAL-CURVE.md` | Material and base-type plan per level along the difficulty curve (current) |
| `LEVEL-BRIEF-100.md` | The L1-100 curriculum brief (tiers, cadence, districts) |
| `LEVELS-V5.md` | The older V5 level book (history of many level ideas; superseded numbers) |
| `levels/` | Level status reports: `L13-36-STATUS.md`, `L32-MONUMENT.md` (the benchmark level), `A1-STATUS.md` (L1-5 remake, in the build), `BASE-STATUS.md`, `LEVEL-NEEDS.md`. `A2-STATUS.md` and `B1-STATUS.md` describe level batches that are **not merged** into this build yet. |
| `BOOSTERS.md` · `PRELEVEL-STATUS.md` | Booster design and the pre-level booster offer |
| `NEAR-MISS.md` | Near-lose / near-win metric definitions and targets (measured on the older V5 set) |
| `PROTECTED-SPEC.md` · `PHYSICS-AUDIT.md` | Protected-building rules / the physics model and its audit |
| `TUTORIAL-STATUS.md` · `TAP2-STATUS.md` · `FRAME-STATUS.md` | Tutorial, tap / double-tap controls, opening camera framing |
| `STYLE-GUIDE.md` · `HAPTICS-V2.md` | Visual style, haptics |
| `SHOP-SPEC.md` | Shop, Upgrades, ads and economy spec |
| `MAIN-BUILD.md` | How the build is assembled (31 steps), URL flags, conflicts, checks |
| `research/` | Head-to-head reports vs Smash Fest and Car Sort (design, UI, feel, visuals, UX) |
| `feedback/DIGEST-2026-11-15.md` | Latest tester digest (player / UX / designer agents) |

Many docs were written by AI agents during development: dates are dd/mm/yyyy, "Owner" is the product owner who takes the decisions,
"Lead" is the coordinating agent. Paths inside the docs point to the original project layout (`games/blast/...`); the matching file is
under `src/` here (e.g. `levels6/patch/v14-monument.js` = `src/levels6/patch/v14-monument.js`).

## Rebuild from source (optional)

```bash
cd src && node tools/build-main.js /tmp/city-blast.html   # about 5 s, Node 18+, no npm packages
cp /tmp/city-blast.html ../index.html                       # the tool refuses to write a file named index.html itself
```

The chain starts from `src/checkpoints/index-v9-v30.html` (the frozen base) and applies 31 patch steps in order
(`node tools/build-main.js --list`). The same sources give the same bytes. `index.html` here was built this way; it equals the
shipped main build except that comments and the source stamp carry no personal names or private links. Where levels come from:
L1-12 `src/levels6/tools/src-l1-12.js`, L13-36 `src/levels6/tools/src-l13-36.js` + `src/levels6/levels-v6-l13-36.json`, L1-5 remake
`src/levels6/patch/v15-a1.js`, L32 `src/levels6/patch/v14-monument.js`. `src/levels6/patch/v15-editor.js` is the level editor's hook
(not part of the game build; it defines the extra editor fields in `data/level-template.json`).
