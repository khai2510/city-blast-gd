# Feel quick wins Q1–Q9: what was built (12/11/2026)

Spec: `H2H-DESIGN.md` §5.1. Owner: "Q1–Q9 thử hết". Not committed; the Lead commits.

## Builds

| File | What | How to rebuild |
|---|---|---|
| `checkpoints/index-v10g-feel.html` | Levels build (L1–36) + Q1–Q8 | `node levels6/tools/src-feel.js` |
| `checkpoints/index-v32j-feel-demo.html` | UI demo v32i + Q1–Q8 + Q9 | `node ui-feel/build.js` |

- Code: `levels6/patch/v13-feel.js` (Q1–Q8), `ui-feel/q9.js` (Q9). Both are added last, before the end of `main()`.
- No other file was edited. `index-v10f-l13-36.html` and `index-v32i-demo.html` are read only.
- `index-v10f-l13-36.html` changed several times while I worked (other agents). The Q1 / Q5 / Q6 numbers below were measured on the base of about 06:50. Re-run `src-feel.js` after their last build.

## Flags (A/B)

- In the page: `window.__blast.feel = {q1..q8}` (and `q9` in the demo). Change one, then `__blast.feelApi.apply()`.
- URL: `?feel=off` (all off) · `?feel=-q3,-q5` (all but these) · `?feel=q1,q2` (only these).
- Build with all off by default: `FEEL_DEFAULT=off node levels6/tools/src-feel.js <base> <out>`.

## Safety checks

| Check | Result |
|---|---|
| Load check, both builds | ok=true, 0 errors |
| Expert plan, all 36 levels, manual steps: feel on vs feel off vs base v10f | 36/36 identical logs, results and coins, on vs off and on vs base (run twice: on the base of 06:50 and on a frozen copy of the latest base). The latest base itself has 35/36 expert wins, with and without feel: that is the level work in progress, not feel |
| Real frame loop (virtual 60 fps clock), L1, L4, L8, L13, L22, L24, L36: feel on vs off | 7/7 same determinism log (same step, same %, same pose hash), same result, same coins |
| `determinism-check.js`, MAXL=36, multi-blast levels, 2 repeats, 5 modes | feel on: DETERMINISTIC, 10 levels (L6, 8, 9, 11, 12, 15, 18, 20, 30 …), seq / after / fresh / wait / raf all 2/2. LIVE=0 (see below) |
| Heroes in frame, 390×844, all 36 levels | 36/36 (base: 35/36, L11 was cut) |

- `determinism-check.js` LIVE mode timed out on this machine (load 20+, about 1 frame a second). The virtual-clock run above replaces it: it runs the same frame loop with every feel hook on.
- The v32 demo runs the older engine (before the determinism fix). Its result changes from run to run with feel off too (L4: 89.4 % and 89.9 % in two off runs). So "same result" cannot be shown there.
- PASS 85 %, protected 5 %, street 10 %, scores and coin totals are untouched. Coins: same total per level on and off.

## Per item

| # | Status | Flag | Measured | Known issues |
|---|---|---|---|---|
| Q1 lens + fit | **Done** | `q1` | Hero pixels: +50 % average, +55 % median over 36 levels; 19 of 36 reach +40 %. Smallest column 2.5–8.5 px → 3.3–9.4 px. Base at 62–78 % of the height. | See "Q1 notes". L19 is 5 % smaller. Target of 5–10 px columns not met on thin heroes. |
| Q2 forgiving taps | **Done** | `q2` | Near-miss taps (12 per level, L4/L13/L24): "Tap a building" toasts 10–11 → 0; charges placed 0–1 → 8–11. Grid scan: 98.8 % of misses within 22 pt now land; 0 land beyond 22 pt. | Thin-part rule: see "Q2 notes". Placement time −30 % needs human testers. |
| Q3 collapse camera | **Done** | `q3` | Yaw +0.12 rad in 1.2 s from TIMBER; dolly 0.82–1.15× to hold the mass near 70 % width; back in 0.6 s; 3 % push-in on the fuse. | Pull-back capped at 1.15× (1.3× made the rubble look small). "Looks bigger" needs a tester vote. |
| Q4 bigger boom | **Partial** | `q4` | Fireball ×2. Dust 7 → 21 puffs, 2.0 s, #E8CFA6 → #C9A27A. 2 s smoke column. Scorch mark per charge. Flash on L13 at +0.3 s: about 14 % of width (core), 23 % with the ring. | Under the 20 % goal on wide scenes. Scorch and column are drawn in code; 2 painted sprites are a `design` job. |
| Q5 coins | **Done** | `q5` | Coins over the target box, worst frame: 17–37 % → 1.1–1.4 %. Coins in the air during the collapse: 36 → 3–4. Stream: 24 coins, 40 ms apart, up the right edge. | Counter shows held coins when the stream lands. Totals unchanged. |
| Q6 dead air | **Partial** | `q6` | BLAST → result: L13 9.8 → 7.55 s, L1 6.7 → 5.3 s, L36 10.2 → 9.6 s. No gain on L4, L22, L24. Wave end → card: 150–750 ms → 150 ms. | See "Q6 notes". |
| Q7 win stamp | **Done** | `q7` | "CLEARED!" 56 px, cream, 3 px navy outline, 0 → 1.2 → 1.0 in 300 ms. 42 confetti, 1.2 s, #FFB400 / #FF6A1A / cream. Pill bump 1.15×. | Sound: the existing `star` stinger. A new win sting (≤ 1.2 s) is an ElevenLabs job. |
| Q8 Hard HUD | **Partial** | `q8` | L24: words 12 → 5 (3 s after the first TNT). PASS tag 10.4 → 13 px. Items 16 → 16. | Goal of ≤ 7 items, ≤ 4 words not met. See "Q8 notes". |
| Q9 living Home | **Partial** | `q9` | Pixels changing over 5 s: 2.9 % → 5.4 % (goal ≥ 3 %). | The plate is one image. See "Q9 notes". |

## Final verification (12/11/2026, rebuilt on the base `index-v10f-l13-36.html` of 07:59)

| Check | Result |
|---|---|
| Rebuild | `index-v10g-feel.html` and `index-v32j-feel-demo.html` rebuilt after the base changed at 07:59. Feel-off twin built with `FEEL_DEFAULT=off` (scratchpad, not in the repo) |
| `determinism-check.js`, MAXL=36, `multi`, LIVE=0, feel ON vs feel OFF | DETERMINISTIC both. 5 multi-blast levels (L8, L11, L12, L15, L18): result % and pose hash identical on vs off (e.g. L8 89.348 % 92ffc4d7, L18 91.84 % 4debe9ca). Modes seq / after / fresh / wait / raf all pass. 2 repeats on the first base, 1 repeat after the rebuild: same hashes. Live loop not run here (too slow); the virtual-clock run in the table above covers it |
| `gate-bot.js`, L1, L4, L8, L13, L22, L36, N=1, feel ON vs OFF | Output identical line by line (expert 6/6 at 96, 92, 89, 95, 96, 95 %; sensible and naive the same). Gate prints MISSED for L13 / L22 sensible (55 %, 49 %): same with feel off, so it is level tuning, not feel |
| Loadcheck | `index-v10g-feel.html` ok=true, 0 errors. `index-v32j-feel-demo.html` ok=true, 0 errors |
| Physics | No Q changes physics. No flag was disabled |

Gate and first determinism runs used the base of 07:40; the rebuild only re-ran loadcheck and one determinism repeat (hashes unchanged).

## Notes

**Q1.**
- FOV 46° → 34°. Pitch 0.30 → 0.22 rad, so the skyline stays where it was (`VISUAL-TARGET.md` §4.2).
- The spec says "78 % of the width". The base already framed the whole lot at 88 % of the width, so a plain 78 % made L13 smaller. I fit the **hero** (`L.hero` parts) to 78 % width or 62 % of the screen height, and stop earlier if any target or protected building would leave the screen (3 % margin).
- Tall heroes fill the play area, so their base sits at 71–78 %, not 62 %. Only wide, low scenes reach 62 %.
- Fog planes and the zoom-out limit move back with the camera, so the haze looks the same.

**Q2.**
- A tap that hits a part stays where it is. A miss takes the nearest part within 22 pt, found with the game's own pick. So no charge can land where a direct tap 22 pt away could not put it.
- "Part under 24 pt wide": not a separate rule. Thin parts get the 22 pt halo through the miss rule.
- Ghost TNT shows on touch-down. With the ghost up, a hold longer than 300 ms now places on release (before: nothing).

**Q6.**
- The result still locks at the same physics step. Only waiting was cut: the 600 ms coin wait is gone.
- After the stamp, the rest of the fall runs at the game's own 3× fast-forward (same steps, same result).
- The stamp starts when the meter has held PASS for 0.5 s. On street or protected levels the meter only turns green at rest, so there is no gain there.
- The spec's "L13 ≤ 9 s" is met (7.55 s). More needs B3 (physics, Owner).

**Q8.**
- Hard and boss levels: the tip fades 3 s after the first TNT. The "Safe · 0%/10%" pill becomes two icons next to the meter. A number shows only after damage; red at the old threshold. Purple ring = Hard, orange = boss.
- The census still counts 16 items: 4 buttons, level, HARD tag, coins, meter, %, PASS tag, 2 icons, and 2 protected tags (2 items each).

**Q9.**
- The level sign sways ±2° every 4 s (the crane arm is baked into the plate).
- A drawn taxi crosses on the near lane every 8 s. Two drawn clouds drift at 6 px/s behind the logo.
- Play breathes 1.00 ↔ 1.04 every 1.6 s (v32i already did this).
- Off with reduced motion.

## For Owner to decide

1. **Q1 fit rule.** Keep "hero to 78 %, everything stays on screen", or follow the spec literally (smaller on wide scenes)?
2. **Q8.** To get near 7 items: hide the "0%" tags on protected buildings until they are hit, and drop the HARD tag (the purple pill already says it). Both remove information. Yes or no?
3. **Q9.** Order the 3 plate layers from `design` (crane arm, taxi, clouds), or keep the drawn stand-ins?
4. **Q4.** Order 2 sprites (scorch, smoke) from `design` and a win sting from ElevenLabs?
5. **Q2.** Is "hold, then release places" fine, or should a long hold cancel?

## Files

- Shots: `research/h2h-design/feel/` — `feel-overview.png`, `q1-all36-before.png` / `-after.png`, pairs `q1-L*`, `q3-q5-L13-*`, `q4-L13-*`, `q5-L24-*`, `q6-L13-result-*`, `q8-L24-*`, `q9-home-*`, `q2-ghost-L13.png`, `q7-stamp-L13.png`.
- Lab scripts: `research/h2h-design/feel/tools/` (they write to `shots/` in the folder they run from; env `BLAST_LIBS`, `NODE_PATH` as the other tools).
- All times are bot runs on a virtual 60 fps clock, zero upgrades. Not player data.
