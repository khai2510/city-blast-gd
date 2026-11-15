# L32 "Sky Saucer" as a MONUMENT (prototype, 12/11/2026; round 2: massive reinforced concrete; round 3: eased; round 4: readability)

Decisions: D-blast-HERO-MONUMENT (giant, many floors, see inside through glass, swipe up/down + zoom), D-blast-HERO-PROC (tile first, then
bots, difficulty by surroundings only). One level only. Not committed by the agent, nothing deployed.

| File | What |
|---|---|
| `levels6/patch/v14-monument.js` | NEW. Part kind `mon14` (the tower), real glass, the camera controls, tap assist, the L32 scene override. Appended last in `main()`. |
| `levels6/tools/src-l32.js` | NEW build tool: `checkpoints/index-v10f-l13-36.html` (read only) + v14 + `tools/lvpick-overlay.html` → `checkpoints/index-v10h-l32-monument.html`. |
| `checkpoints/index-v10h-l32-monument.html` | The build. Opens L32 by default (`?lv=N` other level, `?lv=0` title; automated browsers always start on the title). |
| `levels6/shots/l32-monument/` | 01 default · 02 swipe-up saucer · 03 zoom through the glass · 04 tile vs game · 05 / 05b mid-collapse · 06 lobby · 07 restaurant · `rc-1` … `rc-6` the damage stages and the two-blast collapse (round 3) |

v10.js, v11.js, v12.js, v13-feel.js, `tools/src-*.js` and the level JSON are untouched. Flags: `?mon=0` old L32 hero and scene,
`?mcam=0` old camera, `?massist=0` no tap assist. Test API: `window.__blast.m14` (`info`, `cam`, `set`, `stats`, `inside`, `breaks`).

```bash
cd games/blast && node levels6/tools/src-l32.js          # build
node <scratchpad>/loadcheck.js checkpoints/index-v10h-l32-monument.html     # ok=true screen=title errors=0
```

## 1. What was built

The F04 tile (sheet F1b, top right) copied part for part, 72.6 m to the roof, 86.3 m with the mast (old hero: 40 m of members, 49 m with
its drawn crown). 22 floors can be seen.

| Part | Members (real bodies) | Seen inside / on it (decor riding on those members, no body) |
|---|---|---|
| Base | 16 buttress fins (2 steps at each side of every corner pier), ground slab | plinth, paving, planters |
| Shaft, 9 storeys of 6 m | per storey: 4 corner piers 1.18 m, 4 mid-face piers 0.9 m, 1 floor cassette, 8 glass panes | 2 floors per storey: floor plate, lift core with lit doors, 4 columns, stair flight, desks with screens, sofas, plants, ceiling lamps; lobby with desk and mezzanine; pane frames and sheen |
| Capital | none | flare and bowl, 16 sectors each |
| Lower saucer, Ø 33 m | 21 floor cassettes, 20 slim columns, 21 roof cassettes | restaurant + lounge level behind a glass band (2 skins, 32 mullions), round core, lit bar, 32 tables with lamps and seats, pendant lamps; on the roof the orange terrace, rail, 8 planters, 8 parasol tables |
| Stem, 8 m | 4 piers, 4 panes, 1 slab | 2 floors, round core, lit doors, stairs |
| Upper deck, Ø 23 m | 9 floor cassettes, 8 posts, 9 roof cassettes, mast | open deck with rail, trees, viewing scopes, lamps, low cone roof, beacon |

- Every round piece is cut in 16 sectors and each sector rides the cassette under it, so the saucers break up with their members instead
  of staying one rigid disc or vanishing at once.
- New member keys: `mdeck` (light steel-framed cassette, breaks like a slab), `mcol`, `mpost`, `mglass` (a pane that is really
  transparent: tinted, sky reflection, sheen streaks; casts no shadow). The saucers need steel-type joints: with concrete joints the
  cantilever cracked at rest (first build: the whole tower fell before the first frame).
- No logo, no text, no real building's name.

## 2. Controls (flag `mcam`, on by default, every level)

| Gesture | Does |
|---|---|
| Drag left / right | turn, a quarter per swipe (as before) |
| Drag up / down (one finger), or two fingers up / down | the view slides up / down the tower; the grabbed point follows the finger. Axis is locked once the drag passes 10 px: mostly vertical = pan, else turn |
| Pinch / mouse wheel | zoom, now down to 14 m from the tower's axis (the old limit on this lot: about 73 m). Close in, the view levels out by 10° and its target moves from the middle of the lot onto the tower |
| Tap (≤ 10 px, < 300 ms) | places TNT, unchanged |
| BLAST, double-tap on empty ground | framing back to the whole lot |

Limits: the pan target stays between 15% and 90% of the hero's height (further when zoomed in), so the hero cannot leave the screen. The
nearest distance is recomputed every frame for the current direction: the camera stays 6 m outside the hero's own outline (per 4 m of
height, decor included) and 3 m outside every neighbour's box.

Tap assist (level flag `mon` only): at the whole-lot view a column is 3–6 px wide. A tap within 16 px of a column that is thinner than
16 px on screen goes to that column (never through a nearer wall). A tap on a curtain pane goes to the pier right behind it.

Gesture test (touch events, 390×844): 13/13 pass: vertical drag pans and places nothing, horizontal drag still turns, pinch and wheel
zoom to the clamp, 72 poses at maximum zoom with the camera never inside a building, taps place TNT at both zoom levels, BLAST resets.

## 3. Massive reinforced concrete (round 2, Owner: "two bombs on a spot before it even reacts")

Look unchanged (shape, glass, interiors, camera). Only the strength of the hero's structural members changed, plus damage marks that
appear when a pier is hit. Tier `M14_RC` in `patch/v14-monument.js`, reusable for every hero:

| | Value | Why |
|---|---|---|
| Keys | `hrc` (shaft and stem piers), `mdeck` (every floor cassette) | |
| hp / armor / shove when bonded | 600 / 0.05 / 0.45 | TNT on contact does 247 (measured on a pier: 39% each) |
| Damage between blasts | stays (every other family is reset at BLAST, v10 rule) | cracked concrete does not heal; 1 + 1 + 1 over three blasts = 3 at once |
| Slim saucer columns `mcol` | hp 300, armor 0.25 | steel-ladder member: two stacked |

| TNT on one pier | Damage | Stage shown | Structure |
|---|---|---|---|
| 1 | 39% | 1: chips and hairline cracks | nothing |
| 2 | 78% | 2: cover gone over 1.7 m, dark core, rust rebar cage and ties, long cracks | still carries |
| 3 | fails | 3: the pier breaks up | the storey loses a leg; the tower stands on the other 7 |

Ladder (v10: wood > brick > concrete > RC > steel, per TNT) is kept: this is the RC family (armor 0.05, steel is 0.25) with the hp of a
massive section; the ladder's own `rc` pier (0.75 m², hp 220) is untouched. A massive pier takes more TNT than a slim steel leg because
of its section, not its family. No random term: determinism unchanged.

First attempt and fix: with only the piers hardened, 4 TNT on an **upper** storey still dropped the tower (106 of 160 random 4-TNT
plans): two TNT on a pier also killed the 150 hp floor cassette 1.9 m below it. The cassettes are now the same tier.

What drops the tower (final build):

| Plan | Result |
|---|---|
| Any ≤ 4 TNT: 78 structured (3 on a pier + 1 on every ground member, 4 on one, 2 + 2, upper storeys) + 160 random | 0 of 238 drop it; worst case 93% of the hero still standing |
| 5 TNT: 3 + 2 on neighbours, 3 + 1 + 1, 50 random pier pairs | 0 of 77; worst 93% standing |
| 6 TNT on the expert's spots (corner pier ×3 + the middle pier beside it ×3, one blast) | drops (1–12% standing), ground storey and storeys 1, 4, 8 |
| 6 TNT on two corners (not neighbours) | stands, 92% |
| The same two piers, 1 TNT each per blast, three blasts | 97% → 97% → 92%: both piers fail in blast 3 and the tower holds (issue 1) |
| Three piers of one side, 1 TNT each per blast, three blasts (9 TNT) | 94% → 94% → falls (1%) |
| **Minimum found: 6**, by the expert's spots and by the search alike | none of 315 plans with ≤ 5 TNT dropped it |
| `search-bot.js` (24 random 12-TNT plans, any member) | 0/24 pass, mean 10% (before the cassette fix: 7/24) |

## 3b. Easing (round 3, Owner: "the direction is right, but now it is too hard")

Lead's reading of "too hard", used as the targets: the solution must be easier to FIND and more RELIABLE, not cheaper in TNT.
A skilled player still ends with 0 or 1 TNT left (Owner's second message; the first target "≥ 2 spare" was dropped).

| Target | Round 2 | Round 3 (final) |
|---|---|---|
| TNT given (7–12) | 12 | **9** |
| Expert: 4/4, margin ≥ +3, 0 or 1 TNT left | 91%, +6, 0 left | **90%, +5, 1 left** (8 of 9, one blast) |
| Sensible wins ≥ 3/4 within 2 blasts | 4/4 but 3 blasts | **4/4, 88%, 2 blasts, 1 TNT left** |
| "Two neighbouring piers gone → it falls", in one blast or several | sometimes held (92% standing) | **15 of 15 splits fall** (table below) |
| ≤ 3 TNT never drops the hero | 0 of 238 (≤ 4) | **0 of 104** (54 structured + 50 random) |
| ≤ 4 TNT mostly fails | 0 of 238 | random 0 of 60; structured 3 of 37; the barrel pair 2 + 2 always drops (that is the solution) |
| Minimum TNT to drop the tower | 6 | **4 at the barrel piers** (2 + 2, the lesson), **6 anywhere else** (3 + 3) |
| Naive | 0/4 | 0/4 |
| Lesson-less (9 TNT, never by a barrel) | 0/4, 73% | 0/4, 68% |
| Time estimate (`time-bot`) | 113 s | **117 s**; collapse 11.8 s; sensible variants 6/8 |

What changed (the hero's look and the RC tier's numbers are untouched):

1. **Storey rule** (`failMember` hook in v14). When two piers that stand next to each other round a storey are both gone, the other six
   of that storey crush one after the other, nearest to the gap first, 0.12 s apart in game time. One lost pier never triggers it, two
   piers that are not neighbours never trigger it. This replaces "sometimes the frame holds on six piers". Softer joints were tried in
   round 2 and rejected (one pier + one shove then dropped the tower).
2. **Four barrels at the tower** (surroundings), at the corner pier and the middle pier of its x+ side. They do 49% and 44% to those
   two piers for free, so **two** TNT on each break them instead of three. The level's lesson ("Barrels blast for free") now also opens
   the hero, which is what makes the solution easy to find. Every other pier still takes three.
3. **TNT 12 → 9.** Expert: 2 + 2 on the barrel piers, one TNT by the barrels of each block, one on each barrel leg of the tank tower = 8.
4. Fail tip: "Two TNT on each pier by the barrels. Two neighbouring piers gone: it falls."

RC feel kept: 1 TNT on a pier = 39% (chips), 2 = 78% (rebar shows, still carries), 3 = fails; damage stays between blasts. On the two
barrel piers the barrels are the first hit: barrels alone = chips, + 1 TNT = rebar (83–88%), + 2 TNT = fails.

The neighbour rule, every split tried (hero standing after each blast):

| Plan | Result |
|---|---|
| Barrel pair, one blast 2 + 2 | 6% |
| Barrel pair, 1 + 1 then 1 + 1 | 97% → 4% |
| Barrel pair, corner 2 then middle 2 / middle 2 then corner 2 | 96% → 5% / 97% → 4% |
| Barrel pair, four blasts of 1 | 97 → 97 → 96 → 8% |
| Barrel pair + a 5th TNT on the third pier | 3% |
| Far pair (no barrels), one blast 3 + 3 | 4% |
| Far pair, 1 + 1 three times / 3 then 3 / 2 + 2 then 1 + 1 | 97 → 97 → 6% / 96 → 3% / 97 → 3% |
| Far pair 3 + 3 + a 7th on the third pier (held in round 2) | 2% |
| Corner + front middle pier, 2 then 3 | 96% → 3% |
| Storey 4 pair, 3 then 3 / 1 + 1 three times; storey 8 pair in one blast | 99 → 10% / 100 → 100 → 8% / 1% |
| Two corners, not neighbours, 3 + 3 | stands, 92% |
| Two opposite middle piers, 3 + 3 | stands, 99% |

(Round 3 layout, barrels on the x+ face; round 4 mirrors it to the front face.) The 3 structured 4-TNT plans that drop it are "2 on the barrel corner pier, 1 on the barrel middle pier, 1 on the pane beside that pier":
the fourth TNT finishes the middle pier through the glass. That is the neighbour rule working, with a near miss.

## 3c. Readability (round 4, after the blind first-time test of the main build: 0 wins in 3, best 10.4%)

Report: `research/playtest/L32-firsttime-2026-11-12.md`, "Round 3 (eased, main build)". The bots won, a person did not: the barrels at
the tower were 3 px wide and hidden behind a fin at the opening view, the piers were not in view, damage could not be seen. The
solution is unchanged (TNT 9, RC tier, storey rule, two TNT on each of the two barrel piers); what the player SEES changed, all in v14.
One number moved: the barrels now do about 40% / 32% to the two piers (round 3: 49% / 44%), because the full 3-TNT search found one
plan that dropped the tower (1 TNT on each barrel pier + 1 on the pane between them). With 40 / 32 no 3-TNT plan does (0 of 128).

| Problem in the test | Change |
|---|---|
| Piers not visible at the start; zoom + drag with no cue | **Opening move** (`L.monIn`): the whole tower for 1.1 s, then the camera pushes in on its foot (zoom 0.4, about 96 m). Any touch cancels it; BLAST and double-tap still give the whole lot. |
| "The shaft piers have no barrels near them" | The 4 barrels moved from the x+ face (behind a fin, and block B stood in the sight line) to the **front (z+) face**; opening yaw 0.3 faces them. A yellow **hazard-striped fuel yard** is painted under them (decor). |
| No sign of being on the right track | **Pips** over a pier, constant size on screen (readable from the whole-lot view): one slot per TNT the pier still needs. Red = done, yellow = TNT placed, hollow = missing, the next one blinks. |
| Barrel → pier link only after a fail | The two barrel piers show **two pulsing slots from the first second** (the barrels at their foot are counted in advance). Any other pier shows three slots once it is hit or has a TNT on it. |

Scripted newcomer on `checkpoints/index-main.html` (real touch taps, real loop; shots `r4-1` … `r4-5`):

| Attempt | What it did | What the game showed |
|---|---|---|
| 1, ignores the cue | 8 taps on a 3 × 3 grid over the tower's foot at the opening view (4 landed: front middle pier, a fin, two panes), BLAST | before the blast: "1 of 2 placed" on the middle pier, the corner pier still pulsing. After it (tower stands, 5 TNT left), at the whole-lot view: middle pier **2 red + 1 blinking** ("one more"), corner pier **1 red + 2 hollow** |
| 2, taps the pulsing pips | 2 TNT landed on the middle pier (the script's corner taps hit a fin), BLAST | middle pier gone, tower stands; corner pier shows **1 red + 2 hollow, one blinking** = "two more here" |

In both runs the only marks on screen after the first blast sit on the two piers of the solution. The script's taps are cruder than a
person's (fixed grid, no aiming), so neither attempt is a win; the bots' numbers below are unchanged.

Final checks, round 4: expert 4/4, 89%, +4, 1 TNT left · sensible 4/4, 91%, 2 blasts · naive 0/4 · lesson-less 0/4 (67%) · ≤ 3 TNT:
0 of 128 plans drop the tower · 4 TNT: random 0 of 60, structured 0 of 36 (+ the solution 2 + 2) · neighbour rule 15 of 15 splits ·
foot 0/16, 0/36 · `search-bot` 0/24 · `time-bot` 138 s (collapse 10.3 s, sensible variants 5/8; round 3: 117 s, 6/8) · determinism
identical in every mode incl. live cold / warm, and for the 2-blast plan · 0 bonds cracked at rest · load check ok on both builds ·
gesture test 13/13. Rebuilt: `index-v10h-l32-monument.html`, `index-main.html` (`tools/build-main.js`), the editor (`editor/build.js`).

A person was not re-tested (the agent cannot play blind): the Lead should re-run the first-time test on this build.

## 3d. Round 5 (after the blind retest of round 4: win on attempt 3 at 86.4%, trick understood on attempt 2, difficulty 3/5)

Report: `research/playtest/L32-firsttime-2026-11-12.md`, "Round 4". Its three weak spots, fixed in v14 only (RC tier, storey rule, the
hero's look, TNT 9 and the 2 + 2 solution are unchanged; the ≤ 3-TNT lock is re-measured below):

| Weak spot | Change |
|---|---|
| "I tapped the pips like buttons" | A tap on a pier's pips places the TNT on that pier (`M14.pipHit` in the `pick` wrapper). |
| Pip colours never explained | One line under the HUD, "Fill the dots to crack the leg", with a yellow and a hollow dot, while the cue pips pulse and until the first TNT is on a pier. Shown the first two times only (saved in `localStorage` `m14tip`). |
| After the first blast the camera pulls back, the pips are too small to read | Back from a blast with the tower still standing, the camera pushes in on its foot again after 0.5 s. A fallen tower keeps the whole-lot view (the side towers are what is left). |
| Sensible variants 5/8, 138 s | Surroundings made forgiving: block C gets the same three barrels as block B (it had one), the tank tower gets two more at its front legs, so a TNT on the "wrong" face of a neighbour still sets barrels off. |

Checks, round 5: expert 4/4, 88%, margin +3 (the minimum allowed), 1 TNT left · sensible 4/4, 90%,
2 blasts · naive 0/4 · lesson-less 0/4 (74%) · `time-bot` **100 s**, sensible variants **7/8** · ≤ 3 TNT: **0 of 128** plans drop the tower
· 4 TNT: random 0 of 60, structured 0 of 36 (+ the solution 2 + 2) · neighbour rule 15 of 15 splits · foot 0/16, 0/36 · `search-bot`
0/24 · determinism identical in every mode incl. live cold / warm, and for the 2-blast plan · 0 bonds cracked at rest · load check ok
on both builds · gesture test 13/13. Scripted on `index-main.html` (shots `r5-1` … `r5-3`): the tip shows at the opening and goes when the
first pip is tapped; a tap on each pip puts one TNT on that pier; after the first blast the view is back at the foot (zoom 0.4) and both
piers read "2 of 3 done". A person has not re-tested round 5.

## 3e. Round 6 (fresh blind tester on round 5: legs understood on attempt 2, but 3 losses at 84.9 / 83.9 / 80.9%)

Report: `research/playtest/L32-firsttime-2026-11-12.md`, "Round 5". The tower trick worked; the losses were in the finish: nothing
pointed at the three small towers. v14 only; RC tier, storey rule, look, TNT 9, the 2 + 2 solution and the barrels are unchanged.

| Finding | Change |
|---|---|
| Nothing marks what is left after the tower falls | **What is left:** once the tower is down, one pulsing dot on every member of the level's own plan that still stands on a neighbour (the leg by the red drums of each small tower, two on the tank tower), and the line "Now the dots on what is left". A dot goes when its leg is gone. |
| Dot count jumped from 2 to 3 after the first blast | A pier's number of slots is fixed the first time it is shown (2 at the barrel legs, 3 elsewhere); red = slots no longer needed. |
| "pier" and "barrel" match nothing on screen | Fail text: "Fill the dots on the two front legs: the tower falls. Then one TNT by the red drums of each small tower." (H0b, STD-v2: now "Dots on the front legs. Then the red drums.") |
| A tap near a placed TNT selected it; the view drifted | A tap on a TNT (or on the dots) of a leg that still has hollow dots places the next TNT. No idle camera sway while planning on a monument level; the opening push-in starts 0.3 s into planning (was 1.1 s), so the view is still before the first tap. Two dot groups that would overlap on screen are stacked. |
| The tip went at the first tap | It stays until the first BLAST. |

Scripted newcomer on `index-main.html`, dots only, real touch taps (shots `r6-1` … `r6-4`): fill the hollow dots on the two legs (4 TNT,
second taps land on the TNT already there) → BLAST → tower down, 64.8%, 5 TNT left, four "what is left" dots → one tap on each → BLAST →
**90.7%, win, 1 TNT left**.

Final checks, round 6 (this is the current build; physics identical to round 5): expert 4/4, 88%, margin +3, 1 TNT left · sensible
4/4, 90%, 2 blasts · naive 0/4 · lesson-less 0/4 (74%) · `time-bot` 100 s, sensible variants 7/8 · ≤ 3 TNT: 0 of 128 plans drop the
tower · 4 TNT: random 0 of 60, structured 0 of 36 (+ the solution 2 + 2) · neighbour rule 15 of 15 splits · foot 0/16, 0/36 ·
`search-bot` 0/24 · determinism identical in every mode incl. live, and for the 2-blast plan · 0 bonds cracked at rest · load check ok
on both builds · gesture test 13/13. A person has not re-tested round 6.

## 4. Numbers (bots, zero upgrades; not player data)

| | Old L32 (v10f) | Monument, round 1 | Monument, round 2 (RC) |
|---|---|---|---|
| Bodies (non-anchor) | 238 | 419 | 419 (hero 267, B 43, C 42, E 57, barrels 8, 2 props) |
| Bonds at start / link types cracked at rest | 457 / 7 | 864 / 0 | 864 / 0 |
| Decor pieces (instanced) | 55 | 1,655 | 2,951 (1,296 are hidden damage marks) |
| Triangles per frame, shadow pass included | 51.7k | 98–103k | 114k |
| Draw calls while planning | — | 34 | 35 |
| Physics, ms per step (headless, no throttle) | 3.75 | 7.0 | 6.8 |
| fps during the blast, CPU throttle 4×, median / p5 | 4.0 / 3.3 | 2.4 / 1.9 | not re-measured |
| fps during the blast, no throttle, median / p5 | 6.0 / 5.5 | 3.7 / 3.2 | not re-measured |

The fps figures come from headless Chromium with software WebGL (no GPU) at 390×844, device scale 1, 140 frames from BLAST; other jobs
were running on the machine (load average about 4). Only the ratio means something: a round-1 frame costs about 1.65× the old one.
Real-phone fps was not measured. Round 3 adds 4 barrels (423 bodies), nothing else changed in these rows; 0 bonds cracked at rest.
Body count is not capped (Owner, 12/11: `BODY_CAP = 1e9`).

Gate, final build (`gate-bot.js`, `foot-bot.js`, `time-bot.js`, `search-bot.js`, `determinism-check.js`):

| Check | Round 1 (8 TNT) | Round 2, RC (12 TNT) | Round 3, eased (9 TNT) = final |
|---|---|---|---|
| Expert, 1 blast | 4/4, 89%, +4 | 4/4, 91%, margin +6, all 12 used | 4/4, 90%, margin +5, 1 TNT left |
| Sensible (follows the tip, repeats on the cracked piers: 3 blasts) | 4/4, 91% | 4/4, 87% | 4/4, 88%, 2 blasts, 1 TNT left |
| Naive (all TNT front-middle) | 0/4 | 0/4 | 0/4 |
| Lesson-less (same TNT, never by a barrel) | 0/4, 75% | 0/4, 73% | 0/4, 68% |
| ≤ 4 TNT drops the tower | yes: 2 TNT did | no: 0 of 238 plans | ≤ 3: 0 of 104; 4: only at the barrel piers (§3b) |
| Foot bot | 0/16, 0/36 | random 0/16 (max 19%), face plans 0/36 | random 0/16 (max 16%), face plans 0/36; `search-bot` 0/24 (mean 9%) |
| Time estimate (`time-bot`, K = 8) | not run | 113 s; collapse 10.9 s; sensible variants 7/8 | 117 s; collapse 11.8 s; sensible variants 6/8 |
| Protected / street | none on this level | none on this level | none on this level |
| Determinism (`MAXL=36`, 5 repeats, LIVE=2) | identical | identical: seq 5/5, after 5/5, fresh 5/5, wait 5/5, raf 5/5, live cold 1/1, warm 1/1 (expert plan, 90.59%); the 3-blast sensible run gave the same 87% on all 4 seeds | identical: seq, after, fresh, wait, raf 5/5 each (expert, 89.79%); the 2-blast sensible plan identical in 5 runs with 0–1,500 idle steps between blasts; live mode not completed (see issues) |
| Load check / gesture test | ok / 13 of 13 | ok=true, 0 errors / 13 of 13 | ok=true, 0 errors / 13 of 13 |

Round-2 expert plan (12 of 12), superseded by §3b: corner pier ×3 and the middle pier beside it ×3, two TNT by the barrels of each block, one on each barrel leg of
the tank tower. Surroundings are as in round 1 (blocks at x = ±25, tank tower at z = −25, lot pad 2× wider); only the TNT count went
from 8 to 12 and the fail tip now says "The tower is reinforced: three TNT on one pier, two piers side by side."

Round-1 surroundings, for the record: blocks B and C moved from x = ±11 to ±25 (out from under the 33 m saucer), tank tower E to
z = −25, barrels moved with them. E was changed from the all-steel-column tower (cracked 8–12 bonds at rest, in the base checkpoint
too) to two storeys of steel legs under a concrete block.

## 5. Rules for every hero (proposal, to apply to the other 35 levels once Owner approves L32)

1. **Scale.** The hero is 1.5–2× its current height (70–90 m for a tower, mast included); neighbours keep their size (about 20–30 m), so
   the city reads small. Opening camera: `fillMax` 0.73 as now.
2. **Storeys.** One structural storey = 6 m = two floors seen. Structure is real members: corner piers ≤ 1.18 m (wider ones never
   crush, so the tower would not pancake), a second line of slimmer piers, one floor cassette per storey.
   **Material (round 2):** every structural pier is `hrc` and every floor cassette `mdeck`, both tier `M14_RC` (hp 600, armor 0.05,
   damage stays between blasts): 1 TNT chips, 2 show the rebar, 3 break the member. Each pier gets `rcDecor` on its outward faces.
   **Storey rule (round 3):** tag the piers of each storey with `ringTag`; two neighbouring piers gone = that storey crushes. One lost
   pier, or two that are not neighbours, never drop the hero.
   Check per hero: no plan of ≤ 3 TNT drops it (structured + 50 random); every split of "two neighbouring piers" over 1–4 blasts
   drops it; report the minimum TNT with and without barrels.
3. **Glass and interior.** Faces are `mglass` panes hung on the slab edge (they carry nothing). Everything inside is decor on that
   storey's cassette: floor plate, core, columns, stairs, furniture, lamps, a different seeded layout per floor. Interior decor uses the
   `ibox / icyl / ibush / lit` shapes (no shadow pass, low-poly). Nothing inside is a body.
4. **Round or overhanging parts.** Cassettes with steel-type bonds (`mdeck`), round shapes cut in 16 sectors, each riding the member
   under it.
5. **Readability (round 4).** A hero level sets `monIn` (opening push-in on the foot) and an opening yaw that faces the solution side
   with no neighbour in the sight line; piers carry `ringTag` so the pips work; barrels meant for the hero stand on a painted yard on
   the face the camera opens on. Test with a scripted newcomer (taps on the most visible spots) and then a blind person.
5b. **Camera.** Vertical drag, zoom to 14 m, clearances 6 m (hero) and 3 m (neighbours), reset on BLAST: all generic, already on for
   every level. A hero level sets `mon:1` (far-camera haze, tap assist, gesture hint) and `lotK` (wider pad).
6. **Budget.** No body cap. Guide from this level: hero ≤ 270 bodies, level ≤ 450, decor ≤ 2,000 pieces, ≤ 105k triangles with the
   shadow pass, physics ≤ 8 ms per step headless. Re-measure on a phone before raising it.
7. **Difficulty.** Build the hero from the tile with the RC tier, run the bots, then move only: neighbours (position, height, legs),
   protected buildings, barrels, TNT 7–12, opening yaw. The hero's look is never changed for difficulty; its material is the fixed tier.
   Budget: a tower takes 6 TNT by itself (3 + 3 on two neighbouring piers), or 4 where barrels stand at two neighbouring piers.
   **Standard numbers (L32 final):** TNT 7–12 and the expert ends with 0 or 1 left; expert 4/4 with margin ≥ +3; sensible ≥ 3/4 within
   2 blasts; naive 0–1/4; lesson-less fails; ≤ 3 TNT never drops the hero; time estimate about 2 min (L32: 117 s). Make the level
   easier by making the solution easier to find (the lesson's barrels at the hero), never by giving spare TNT. Keep neighbours outside the hero's widest part + 8 m, or its fall takes them for free (at ±16 m the
   saucer crushed both blocks with 2 TNT).
8. **Checks per level.** Load check, 0 bonds cracked at rest (`?debug=1`, `__blast.m14.breaks()`), gate / foot / determinism, the
   gesture test, a tile-vs-game picture.

Roll-out: `mon14` is written for this tower. The reusable parts are the member keys, the glass and lamp materials, the sector shapes,
the `floorIn` interior and all of the camera code. For each other hero: write its part function with the same helpers, point the level
at it and set `mon:1`. Towers and slabs (F01, F03, F16, F19, F25, F26, F31, F07) are the same recipe; halls and bridges need their own
interior idea (a hall seen through a glass front, a deck with traffic).

## 6. Helper API (H0 + H0b, 13/11/2026; for the L1–36 batch patches, D-blast-ROLLOUT; STD-v2)

`levels6/patch/v14-monument.js` exposes `M14.api` (a `var` in `main()`, so any patch appended after v14 can call it). A batch patch
(`patch/v15-<batch>.js`) never edits v14: it writes its own part functions and level overrides with these helpers. Built on STD-v1.
L32 goes through the same helpers with its round-6 values; H0 changed none of its numbers (check at the end of this section).

**Materials** (`P.mat` on a `mon14` part, or `M14.api.mat(name)` in your own part function)

| `mat` | pier key | cassette key | slim column | TNT one pier needs (`need`) | Notes |
|---|---|---|---|---|---|
| `"rc"` (default) | `hrc` | `mdeck` | `mcol` | 3 | tier `M14_RC`: damage stays between blasts, `rcDecor` marks, L32 greys |
| `"wood"` | `wpost` | `mdW` | `wpost` | 1 | ladder hp 30 |
| `"brick"` | `bk` | `mdB` | `bk` | 1 | ladder hp 70, armor 0.1 |
| `"concrete"` | `concrete` | `mdC` | `concrete` | 1 | ladder hp 130 |
| `"steel"` | `steel` | `mdS` | `steel` | 2 (stacked, same blast) | ladder hp 300, armor 0.25 |

- `M14.api.mat(name)` → `{pier, deck, col, rc, tint:[pier, deck]}`. Pier keys are the v10 ladder's own keys (strength untouched). The
  cassette keys `mdW / mdB / mdC / mdS` are new: light (density 800), steel-type joints like `mdeck` so a cantilever stands, hp 60 / 150 /
  150 / 450. Ladder members are reset at every BLAST (v10 rule); only `rc` keeps damage.
- `M14.api.perTnt(member)` = damage of one TNT on contact; `M14.api.need(member)` = TNT it needs in one blast. The dots use these.
- Smoke test on the L32 tower with each material (240 steps at rest, then 1 / 2 / 3 TNT on one ground pier): all five stand 100%;
  wood, brick, concrete break at 1; steel holds 1 and breaks at 2; rc holds 2 and breaks at 3. **Steel cracked 7 bond types at rest**
  (7,800 kg/m³ piers under the saucer): a steel hero needs its own rest check, probably slimmer or fewer piers.

**Hero part helpers**

| Call | Does |
|---|---|
| `M14.api.ring()` → `tag(pier, storey, qx, qz)` | Tags the piers of one storey in order round the shaft (direction `(qx, qz)` from the axis, 8 positions). Two neighbouring tagged piers gone = that storey crushes (storey rule); also makes a member a dot target. One call per part. |
| `M14.api.floorIn(host, y, {hw, lobby, fi, rr, x, z})` | One floor of interior decor riding on `host`: plate, core doors (lit), lamps, columns, furniture. `hw` half width (default 4.54), `(x, z)` centre in the part, `rr` a seeded 0–1 generator, `fi` floor index. |
| `M14.api.rcDecor(pier, nx, nz, fx, fz, w)` | Hidden damage marks of an RC pier on the face with normal `(nx, nz)` at `(fx, fz)`, width `w`; `rcStage` shows them. RC only. |
| member keys / shapes | `mglass` (pane), `mpost`; decor shapes `sec fsec csec gsec lsec` (16 sectors), `ibox icyl ibush` (interior, no shadow), `lit`, `glare`. |

**Dots** (pips over a member, constant size on screen; tapping them places TNT on that member)

- Any member tagged by `ring()` shows dots once it is hit (≥ 20%) or has a TNT on it. Slots = `need(member)` minus what barrels at its
  foot will do; the count is fixed the first time it is shown.
- `M14.api.track(member | [members] | "selector", {cue, floor})` adds any other member family. From level data: `L.track = [["B:x+", 0,
  {cue:true}], …]` (applied after every build).
- Cue dots (pulsing from the first second) show where barrels stand at a tracked member, or with `cue:true`, and only if the tier's aids
  allow them.
- Cleanup dots: once the hero is down, one dot on every member of `L.sol` that still stands on a neighbour, + the line "Now the dots on
  what is left". "Hero down" = no tagged ground pier stands, or, for a hero without `ring()`, no ground column of the `L.hero` parts.

**Opening and aids**

- `M14.api.opening(Lv, {yaw, zoom, y, lotK, mon})`: opening yaw (radians), push-in on the foot (`zoom` share of the fitted distance,
  default 0.4; `y` target height, default 12 m; `zoom:0` = none), wider pad `lotK`, and `mon:1` (haze, tap assist, hint).
- `M14.api.aids(Lv)` reads the tier (skill §4b) and returns `{open, cue, tip, cleanup, dots, fail}`; `L.aid = {…}` overrides a field.

| Tier | `open` | `cue` | `tip` | `cleanup` | `dots` | `fail` |
|---|---|---|---|---|---|---|
| T | solution | yes | yes | yes | all | count |
| R, N teach (`teaches` set; = L32) | foot | yes | yes | yes | all | place |
| N practice | foot | no | no | yes | all | place |
| H | foot | no | no | second attempt on | all | trick |
| SH, B (`boss`) | whole (no push-in) | no | no | no | rc members only | line |

  `open` only switches the push-in on or off: the yaw a tier asks for (facing the solution or not) is the level's own `yaw`. The T
  tier's finger pointer is the base game's hand and is not part of this API.
- `M14.api.failText(level | tier, {legs, n, then, trick})` → the fail tip in on-screen words, by the tier's style, ≤ 9 words (see the
  STD-v2 table below). Set `Lv.ftip` to it.
- `M14.tries` = attempts at the current level in a row. Test API: `__blast.m14.api()`, `.aids()`, `.ftip()`, `.need(i)`, `.pips()`.

**STD-v2 additions (H0b: two A1 rules moved here from `v15-a1.js`, plus three gaps from `A1-STATUS.md` §7)**

| Call | Does |
|---|---|
| `M14.api.floors(key, {blastProof, density, mass, push, name})` → new member key | **Blast-proof floors for a ladder hero.** A copy of member `key` (`"slab"`, `"mdC"`, `"mdB"` …) with hp 600, armor 0.7, shoved a fifth as hard when bonded (`blastProof`, default true); it still shatters on landing and resets at BLAST like any ladder member. `density` (kg/m³) or `mass` (factor) makes it lighter: piers under heavy slabs stand close to their crushing load. `name` = the key to register (default `key_bp`). Use the returned key for every hero floor so that one TNT high up never drops the tower (A1 measured 76–88% from a single TNT before this). |
| `M14.api.tip({piers, skin, decks, hinge, xz})` → ring `R` | **Tip rule** for a ladder tower whose lesson is a fall direction. Tags the 8 perimeter piers of one (ground) storey round it; `xz(p)` gives a pier's `[x, z]` from the storey centre (`null` = inner pier). Two neighbouring piers gone → the third pier of that face gives way 0.15 s later with the skin panels touching those three; the other five stand, so the tower tips towards that face. `hinge` (seconds; STD-v2: 2.5) = the two side legs go 0.4 s later and the three far legs cannot be crushed for that long. 8 s later what is left of the storey with no floor over it comes down. `R.onTip = function(m, fail)` is a hero's own follow-up. Game time only: deterministic. (`ring()` remains the STD-v1 storey rule: a straight drop, used by L32 and L1.) |
| `floorIn(…, {plateHw})` | `plateHw` = the floor plate's real half width, unscaled (0 = none, the part draws its own). Without it the old scaled plate is drawn (too wide above `hw` 4.54). |
| `L.dotTip`, `L.dotTip2` | The dots' one-line tip and the cleanup line in the level's own words (defaults "Fill the dots to crack the leg" / "Now the dots on what is left"). On a level with protected buildings the tip sits one row lower, under the "Safe" pill. |
| `M14.api.failText(level | tier, {legs, n, then, trick})` | Now **never more than 9 words** (STD-v2, main build check B18): count "`n` TNT on each of `legs`. Then `then`." · place "Dots on `legs`. Then `then`." · trick "`trick`. Then `then`." · line "`trick`." Over 9 words the "Then" part is dropped; still over, it is cut at 9 with a console warning. `failText.words(s)` counts. This replaces the 15–25-word form described above. |

L32's own fail text went through the new helper: "Dots on the front legs. Then the red drums." (9 words; round 6 had 20). Words only: no
number of L32 moved (table at the end of this section).

Still open from `A1-STATUS.md` §7.7 (not asked in H0b): (c) `L.track` for single members of `L.sol`, (d) cue dots from the second
attempt, (f) rebuilding the title world after replacing `LEVELS[0]`, (g) the "Didn't budge" / protected-fail texts, (i) camera
clearance for decor on the ground slab. A1 keeps its own hooks for these.

Minimal batch level:

```js
// in patch/v15-a1.js, after v14
V5_PARTS.myHero = function(P){ var MT = M14.api.mat(P.mat), tag = M14.api.ring(); /* addBlock(... MT.pier ...); tag(p, storey, qx, qz); M14.api.floorIn(deck, y, {...}) */ };
var Lv = LEVELS[0]; Lv.parts[0] = { id:"A", kind:"myHero", mat:"wood" };
M14.api.opening(Lv, { yaw:0.3 }); Lv.track = [["A:z+", 0, { cue:true }]];
Lv.ftip = M14.api.failText(Lv, { legs:"the front posts", n:1, then:"the barn" });
```

**L32 after H0 against STD-v1** (hard rule: its numbers must not move). Structure check: every block (key, position, size, hp, mass,
tint), all 2,961 decor pieces, 864 bonds, the level fields and the opening pips hash identically before and after H0 (`420757720`).

| Check | STD-v1 (round 6) | After H0 |
|---|---|---|
| Expert | 4/4, 88%, +3, 1 TNT left | 4/4, 88%, +3, 1 left |
| Sensible | 4/4, 90%, 2 blasts | 4/4, 90%, 2 blasts |
| Naive / lesson-less | 0/4 / 0/4 (74%) | 0/4 / 0/4 (74%) |
| ≤ 3 TNT drops the tower | 0 of 128 | 0 of 128 |
| Neighbour rule | 15 of 15 splits | 15 of 15 |
| `time-bot` | 100 s, variants 7/8 | 100 s, variants 7/8 |
| Foot / `search-bot` | 0/16, 0/36 / 0/24 | 0/16, 0/36 / 0/24 |
| Determinism | identical, result 88.257% `eae75bb9` | identical in every mode incl. live, 88.257% `eae75bb9` (same hash) |
| Scripted dots-only newcomer (main build) | 64.8% → 90.7%, win, 1 left | 64.8% → 90.7%, win, 1 left |
| Rest / load check / gestures / `main/check-main.js` | 0 cracked / ok / 13 of 13 / — | 0 cracked / ok on both builds / 13 of 13 / 53 PASS, 0 FAIL |

**After H0b (STD-v2), before vs after on the same machine:** the structure hash of L1–L5 and L32 (every block's key, position, size,
hp, armor, mass, tint + every decor piece + bond count), the gate JSON (N = 4: expert / sensible / naive / lesson-less, %, blasts, TNT
left) and the determinism result hashes are identical for all six levels. L32: 88%, +3, 1 left, sensible 90% in 2 blasts, 88.257%
`eae75bb9` (the STD-v1 hash). A1: L1 96.963% `1ba2f774`, L2 94.614% `cbd8dfb8`, L3 91.42% `5df229ac`, L4 92.225% `974ea912`, L5 91.521%
`6cc30e68`, margins +12 / +10 / +6 / +7 / +7 as in `A1-STATUS.md` §0. Load check ok on `index-v10h-l32-monument.html`,
`index-v10i-a1.html`, `index-main.html`; `main/check-main.js` 80 PASS, 0 FAIL. Not re-run for H0b: time / search / foot bots, the ≤ 3-TNT
search, gestures, the scripted newcomers (no physics or input code changed; the only L32 difference is the fail text's words).

Not covered by H0: the base game's finger pointer for the T tier; a rest-safe steel hero; any hero part other than `mon14`.

## 7. Issues

1. **The storey rule is scripted**, not emergent: the six remaining piers are failed by code 0.1–0.6 s after the second neighbour goes.
   It is deterministic and looks like a progressive crush, but it is a rule on top of the physics.
2. **Minimum is 4 TNT at the barrel piers** (the lesson's shortcut), 6 elsewhere. The brief said "about 5"; a sensible bot that may place
   one TNT per pier per blast cannot win in 2 blasts unless a pier fails at 2, so 4 follows from that target. A stage-2 pier (rebar
   showing) is the normal state of the two barrel piers after the first blast.
2b. **Round-3 checks ran on a heavily loaded machine** (load average 23–30, other agents' browsers). The determinism tool's live mode
   timed out twice waiting for the real game loop (it passed in rounds 1 and 2; the manual modes above all pass). The gesture test gave
   11/13 with the normal waits (camera still moving when sampled) and 13/13 with longer waits. fps and ms/step were not re-measured.
3. **Tiny tap targets at the opening view.** The camera is 241 m away, a column is 2.7–6 px wide. The tap assist covers it, and zooming
   in is the intended way to place; a real-device test is needed.
4. **fps is not known on a phone**, and was not re-measured after round 2 (1,296 more hidden decor instances, same bodies).
5. **Damage marks are simple boxes** (cracks, chips, a rebar cage). They sit at the height of the first blast on that pier and do not
   move if a later TNT is placed elsewhere on it. Floor cassettes show no marks.
6. **The glass tint washes the warm lamps** in daylight (lit doors read pale yellow). Not tuned.
7. **Furniture is boxes.** Fine from 30 m, crude at the 14 m limit.
8. A TNT on a pane shatters it and chips the pier behind (about 20%); the assist only redirects taps that land in front of a pier.
9. The saucers' steel-type joints do not tear; they break when a cassette shatters on landing, so the saucer drops as a raft for the
   first seconds (shots 05, rc-4).
10. The time estimate (113 s) is the bots' formula, not player data.
11. `determinism-check.js` needs `MAXL=36` for levels above 12 (it reads only the first 12 plans by default).
