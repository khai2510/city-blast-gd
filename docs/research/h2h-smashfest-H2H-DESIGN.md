# City Blast! vs Smash Fest: whole-game design head-to-head (12/11/2026)

Question from Owner: how good is our design against Smash Fest, and what should we optimise.
This review covers the whole game. The UI-only comparison already exists in `uiclean/H2H-SMASHFEST.md` and is not repeated here.

**Short answer.** We score **3.0 / 5** on average. Smash Fest scores **4.3 / 5**.
We are ahead on speed into play, goal clarity, fairness and puzzle depth.
We are clearly behind on three things a new player feels in the first minute:
1. how soon and how often something breaks,
2. how big and how easy to tap the target is,
3. how strong the blast looks on a phone.

Overview sheet: `h2h-overview.png`. Detail sheets: `h2h-<topic>.png` (9 files, listed at the end).

## How this was done

**Our builds, both captured at 390×844.**
- Live demo: `games/blast/index.html` (new UI, older levels).
- Newest levels: `checkpoints/index-v10f-l13-36.html` (L1–36 with the Figma heroes, older UI).
- Tool: `tools/capture-gametime.js`. It freezes the browser clock and steps the game 100 ms at a time. So the timings are **game time**, not the slow headless machine's time.
- Runs: live L1 (one win, one miss), newest L13 (win), live Home for 5 s. Logs in `data/`.
- Level numbers come from `levels6/R5-STATUS.md` and `levels6/L13-36-STATUS.md` (bots, not players).

**Smash Fest sources.**
- **[QS]** = seen by us: Owner's in-play screenshot and our own play notes of 08/11 (`research/iphone-mirroring-2026-11-08/`, account at Lv 316).
- **[S]** = a written source: the US App Store page (read today), `playbook/games/smash-fest.md`, `research/smashfest-brief/`.
- **[I]** = my inference as art director. Not measured.

**Limits. Please read.**
- The repo holds **one** Smash Fest screenshot. There is no video. Their game feel in milliseconds is therefore [I].
- Their first five levels and tutorial were never seen (old account).
- No sound or haptics could be judged on either side (headless capture). Section 4 scores the visuals of the feel only.
- Two sites with Smash Fest breakdowns (gamigion.substack.com, friendlygamedev.com) are blocked in this session. They need to be allowed in the network settings if we want them.
- The pixel shares in the framing sheet are estimates from bounding boxes.
- Scores are my judgement. No real player has scored either game for us.

## 1. Scorecard (1 = poor, 5 = best in class)

| # | Dimension | Us | Smash Fest | Evidence in one line |
|---|---|---|---|---|
| 1 | First impression (Home, first 10 s, FTUE) | **3.5** | 4.0 | We are in play after 1 tap and 0.8 s; they need about 15 s and 2 taps [QS]. But their first tap smashes something; ours needs 1–4 taps plus BLAST. Our Home is a static picture (0.4 % of pixels move). |
| 2 | In-level visuals (style, materials, heroes, background) | **3.0** | 5.0 | Their blocks are solid, painted and readable in 0.2 s. Ours are thin see-through frames. Brick is good. Steel, concrete and wood are weak. Heroes lose most of their Figma character. |
| 3 | Camera and framing | **2.5** | 4.5 | Their target is one solid mass at eye level, about 14 % of all pixels. Ours is 7–11 %, split into thin parts, and the bottom 40 % of the screen is empty. Our camera does not move during the collapse; theirs follows and zooms [QS]. |
| 4 | Destruction feel (visual part) | **3.0** | 4.5 | We have a real structural collapse, slow-mo and "TIMBER". But the blast is 4–7 small pops over 1.2–2.4 s, little dust, coins cover the rubble, and about 2 s of dead air before the result. One payoff per level against their 10–27 shots [QS/S]. |
| 5 | HUD and controls | **2.5** | 5.0 | They show 2 HUD items and any tap on a 44 pt block works. We show 6–12 items, and the columns to tap are 3–7 pt wide (our own lab number). |
| 6a | Result screens and progression | **4.0** | 3.5 | Our lose card is kind and clear, with a tip and a cheap rescue. We have a map and districts; they have none. Our live win has almost no celebration. |
| 6b | Monetisation surfaces | **2.0** | 4.0 | Ours are placeholders (No Ads, Daily, Shop, coin "+"). Theirs are simple and proven: lives, continue, one fail offer, packs $1.99–$54.99 [S]. Players do complain about their prices [S]. |
| 7 | Level design (variety, depth, pacing) | **3.5** | 4.0 | Ours is deeper and taught step by step. But a level takes 85–362 s (mean 164 s) against their 30–45 s [S], and a naive player fails almost every level from L3. |
| | **Average** | **3.0** | **4.3** | |

Smash Fest's store rating is 4.7 from 584K ratings [S, App Store US, read 12/11/2026].

## 2. What we measured on our side

| Measure | Live demo L1 | Newest L13 | Note |
|---|---|---|---|
| Tap Play → playable | 0.8 s | 0.9 s | No loading screen. Iris wipe, then the building assembles itself. |
| Taps before anything breaks | 1–4 TNT + BLAST | 7 TNT + BLAST | L13–36 give 9–13 TNT; the expert uses 7–13. |
| BLAST → last charge fires | 1.2 s (4 TNT) | 2.4 s (7 TNT) | About 0.33 s per charge. The tower does not move in this time. |
| Slow-mo | 1.4–2.5 s, 0.35× | 2.9–3.9 s, 0.35× | With a vignette. Good. |
| PASS line crossed | between 2.5 and 4 s | about 7.2 s | |
| Rubble at rest → result shown | about 2 s (miss), about 1 s (win) | about 2 s | Our own budget says ≤ 1 s (`GAME-DESIGN.md` §1.3). |
| BLAST → result | 5.9 s win, 6.8 s miss | 10.5 s | |
| Camera during the collapse | does not move | does not move | Our spec `VISUAL-TARGET.md` §4.2 asks for a dolly and a drift. Not shipped. |
| Explosion flash size | about 10 % of screen width | about 12 % | Hit-stop 60 ms, kick 8 px, flash 0.35 (code). |
| HUD items in play | 6 + tip | 10 (L13), 12 (L24 Hard) | Smash Fest: 2 [QS]. |
| Smallest text in play | "PASS 80%" tag, 10.4 px | same | Below the 11 pt floor. Level pill 24 px, tip 20 px, BLAST 43 px. |
| Smallest column to tap | not measured | 3–7 px | `L13-36-STATUS.md` §4 item 3. The tap is an exact ray hit; no snap to the nearest part was found in `pick()`. |
| Camera lens | 46° FOV | 46° | Our spec says 30°. Smash Fest is about 25–32° [I]. |
| Level time (bot estimate) | L1–12: up to 313 s | 85–362 s, mean 164 s | Smash Fest: 30–45 s [S, external brief, not verified by us]. |

## 3. Dimension by dimension

### 3.1 First impression
- **Ours.** Painted city Home with a crane sign for the level. One big green Play. It looks like a real game. Nothing in the scene moves; only the button shine.
- **Ours, level 1.** A 5-word tip and a pointing hand. Two small orange wooden blocks of buildings. They read as toy crates, not as a city.
- **Theirs.** Slow to start (splash 9 s, pop-up, loading 4–5 s) [QS]. Then the first tap breaks something at once.
- **Verdict.** We win the clock. They win the first emotion. See `h2h-first10s.png`.

### 3.2 In-level visuals
- **Style.** Both are bright and warm. Ours is coherent since the Figma UI and the painted skyline.
- **Materials.** Brick reads well (mortar grid). Steel is thin grey sticks. Concrete is cream frames. Wood is orange boxes with no grain at phone size. Glass and RC were not captured in motion. See `h2h-materials.png`.
- **Silhouettes and scale.** Our buildings are open frames. You see grass through them. Smash Fest stacks solid masses. A frame has less visual weight, so its fall feels lighter.
- **Heroes.** This is an idea they do not have, and it is a good one. But the painted landmark in Figma and the model in the game are far apart. The Harp Span keeps one pylon and loses the cables' shape. The Bullet loses its glass skin. The Sky Saucer and the Deco Needle work. See `h2h-heroes.png`.
- **Protected buildings.** Clear colour language (blue roof, white wall, "0 %" tag). They are small: about 40 px wide.
- **Background.** The painted skyline is good. Below it is a flat green field and a dirt lot. Smash Fest fills the same space with 40+ props [QS, visual bible]. See `h2h-background.png`.

### 3.3 Camera and framing
- Their tower sits in the upper middle, near-frontal, with the cannon in front. The eye has one place to go.
- Our target sits lower, in a 3/4 view, with a wide lens. Wide lenses shrink detail and show more empty ground.
- On Hard levels our hero is about 8 % of the screen width.
- During the collapse our camera stays still. Theirs follows and zooms as the tower shrinks [QS].
- See `h2h-framing.png`.

### 3.4 Destruction feel
- **Anticipation.** We have an auto-fuse with a "3" count. Fine.
- **Boom.** The charges fire one after another. On L13 that is 2.4 s of small pops while the tower stands still. It reads as "nothing happened yet".
- **Collapse.** Our best part. The structure really fails where you cut it. Slow-mo at the tip-over is right.
- **Dust.** Small puffs. A real demolition is known for its rolling dust cloud. We do not have that picture.
- **Coins.** Dozens of coins fly over the building while it falls. They hide the thing the player came to see.
- **End.** About 2 s of still rubble before the result.
- **The clip-worthy moment.** Not there yet. There is no shot that a player would screenshot or that an ad could loop.
- **Theirs.** Tap, flash, hit, cascade for 2–4 s [I], next tap. 25–27 balls on the levels we saw [QS]; 10–15 on early levels per the external brief [S, partly inferred].
- See `h2h-blast-timeline.png` and `h2h-blast-L1.png`.

### 3.5 HUD and controls
- The UI pass of 11/11 already cut our HUD. It is still 6–12 items against 2.
- Hard levels stack three lines over the sky: meter, tip sentence, "Safe · 0%/10%".
- The real gap is the thumb. Their block is about 44 pt wide and any tap counts. Our columns are 3–7 pt and the tap must hit exactly. Players also have to rotate the camera to reach the back.
- Nothing breaks while you place. All the reward comes at the end.
- See `h2h-controls.png`.

### 3.6 Result, progression, monetisation
- **Lose.** "SO CLOSE!", the meter, one tip, "+1 TNT" for 150 coins, Try Again. Kinder and clearer than theirs. Keep it.
- **Win, live build.** A 10 px green "CLEARED" tag and "+15". No word, no confetti, then Home after 2 s. Fast, but flat.
- **Win, newest-levels build.** Still the older card with Continue. The two builds need to be merged before any test.
- **Meta.** Map, districts, upgrades, boosters. More than they have. Good for week-2 retention, not for the first minute.
- **Money.** Their surfaces are few and all work. Ours say "coming soon". A button that does nothing lowers trust.
- See `h2h-result.png`.

### 3.7 Level design
- **Depth.** One lesson at a time, three practice levels after each. Random plans fail (0/16 on most levels). That is real puzzle depth.
- **Pacing.** Mean 164 s per level in L13–36. Hard and boss levels 262–362 s. This is closer to a puzzle game than to hybrid-casual.
- **Entry difficulty.** The naive bot fails about 90 % of runs from L3 and 0/4 on every L13–36 level. Their first levels give far more balls than needed [S, inferred in the external brief].
- **Margins.** Several levels pass by only +3 points (L6, L7, L10, L11, L15).
- **Variety.** 12 archetypes and about 20 different heroes in L13–36. Strong on paper. On screen many levels look alike: one thin tower, two cream frames, one brick block.

## 4. Gaps, ranked by impact on retention and ad click-through

| Rank | Gap | Why it matters | Evidence |
|---|---|---|---|
| 1 | **Too long before something breaks, and it breaks once.** | Day-1 retention and playable ads live on the first smash. We ask for 40–60 s of planning for one payoff. | 7–13 TNT per level; 1 blast on 19 of 24 levels; 85–362 s per level. |
| 2 | **The target is small and hard to tap.** | Missed taps feel like the game is broken. Small targets also make weak ad frames. | Columns 3–7 px; hero 8 % of width on L24; 40 % of the screen empty. |
| 3 | **The blast looks small.** | This is the moment we sell. It must fill the screen. | Flash 10–12 % of width; 1.2–2.4 s of pops with no movement; still camera; little dust; coins on top. |
| 4 | **Dead air and a flat win.** | The feeling drops just before the reward. | About 2 s still rubble; win = a 10 px tag. |
| 5 | **Heroes and materials lose their character in the game.** | Our one unique idea does not reach the player. | `h2h-heroes.png`, `h2h-materials.png`. |
| 6 | **HUD text on Hard levels.** | Reading before playing. | 12 items, 3 lines, 10.4 px tag. |
| 7 | **Static Home and placeholder buttons.** | Lower polish and trust; no reason to return. | 0.4 % of pixels move; 4 "coming soon" entries. |

## 5. Optimisation proposals

Agents: `app-dev` (code), `design` (2D/3D art), Figma (UI and hero paintings), ElevenLabs (sound).
Effort: S = up to half a day, M = 1–3 days, L = a week or more.
Anything that changes blast physics, level data, economy or shows money needs Owner's approval first (group B or C).

### 5.1 Quick wins (each ≤ 1 day, no change to physics or level data)

| # | Change | Spec | Effort | Who | Measure |
|---|---|---|---|---|---|
| Q1 | **Longer lens, bigger target.** | FOV 46° → 34°. Refit so the target box fills 78 % of the width or 62 % of the height, whichever comes first. Put the building's base at 62 % of the screen height (now about 75 %). | S | app-dev | Lab `fill()`: target pixels +40 %; smallest column from 3–7 px to 5–10 px. Screenshot all 36 levels. |
| Q2 | **Forgiving taps.** | If the touch misses, or the part hit is under 24 pt wide, pick the nearest tappable part within a 22 pt radius. Show a ghost TNT on touch-down; place on release. | S–M | app-dev | "Tap a building" toasts per level → near 0. Time to place the plan −30 %. |
| Q3 | **Collapse camera.** | From the tip-over: yaw drift +0.12 rad over 1.2 s, dolly so the falling mass fills 70 % of the width, 1.5° roll. Ease back in 0.6 s. Push in 3 % during the fuse. This is `VISUAL-TARGET.md` §4.2, not yet built. | M (1 day) | app-dev | Side-by-side clip. Tester vote: "looks bigger" yes/no. |
| Q4 | **Bigger boom, visual only.** | Fireball sprite ×2 (to about 25 % of screen width). Dust: 3× the puffs, 2.0 s life, warm #E8CFA6 → #C9A27A. One smoke column for 2 s after the collapse. Scorch mark on the ground under each charge. | S | app-dev, design (2 sprites) | Frame at +0.3 s: flash covers ≥ 20 % of width. |
| Q5 | **No coins over the building.** | During the collapse show at most 12 coins, spawned only where a piece has landed. Send the main stream after the rubble rests, 24 coins, 40 ms apart, along the screen edge to the pill. | S | app-dev | Collapse frames at +3 s to +7 s: coins cover < 2 % of the target box. |
| Q6 | **Cut the dead air.** | Show the result 0.8 s after motion stops (now about 2 s). On a win, start the celebration when the meter has stayed over PASS for 0.5 s; let the rest fall behind it. The final % still locks at rest. | S | app-dev | BLAST → result: L13 10.5 s → ≤ 9 s. Rest → result ≤ 0.8 s. |
| Q7 | **A win that feels like a win.** | "CLEARED!" stamp, 56 px, cream with a 3 px navy outline, scale 0 → 1.2 → 1.0 in 300 ms. Confetti 1.2 s in construction colours (#FFB400, #FF6A1A, cream). Coin pill bumps 1.15×. Still auto-Home after 2 s, 0 taps. | S | app-dev, ElevenLabs (1 win sting, ≤ 1.2 s) | Tester-user: "did you feel you won?" |
| Q8 | **HUD diet on Hard levels.** | Tip fades 3 s after the first TNT. "Safe" and street limit become two icons on the meter, no sentence. "PASS" tag from 10.4 px to 13 px. Goal: ≤ 7 items, ≤ 4 words. | S | app-dev | Census with `uiclean/tools/shots.js`. |
| Q9 | **A living Home.** | Crane arm sways ±2° every 4 s. A taxi crosses every 8 s. Two clouds drift at 6 px/s. Play breathes 1.00 ↔ 1.04 every 1.6 s. Needs the Home plate cut into 3 layers. | S + S | design (layers), app-dev (CSS) | Pixels changing over 5 s: 0.4 % → ≥ 3 %. |
| Q10 | **Hide what is not built.** | Hide No Ads, the coin "+" and the Shop tab until they do something. Keep Daily only if it pays coins. Owner chose "keep" on 11/11 (N1/N2); this asks him to look again. | S | app-dev, **Owner decides** | Dead taps per session → 0. |

### 5.2 Bigger bets

| # | Change | Spec | Effort | Who | Measure |
|---|---|---|---|---|---|
| B1 | **Smash sooner in levels 1–10.** | First destruction ≤ 5 s after the level opens. L1–5: 1–3 TNT, target 30–45 s per level. L1: one tap = the house falls (BLAST fires itself after 0.6 s). Naive first-try win ≥ 90 % on L1–5. | L | level designer, app-dev, **Owner approves** | Time to first destruction. Levels per session. D1 when we have players. |
| B2 | **Fewer, stronger charges everywhere.** | 3–6 TNT per normal level in place of 9–13. Normal levels 60–75 s, relief 45 s, Hard ≤ 150 s. Needs chunkier members so one charge does more. | L | level designer + bots | Est. time mean 164 s → ≤ 80 s. Sensible bot in band. |
| B3 | **One boom, not a string of pops.** | Fire all charges of a wave within 0.5 s (50–80 ms apart). This changes the physics, so every level must pass the bot gate and the determinism check again. | M–L | app-dev + level owner, **Owner approves** | BLAST → first movement ≤ 0.6 s (now 1.2–2.4 s). |
| B4 | **Chunky heroes.** | Hero ≥ 22 % of screen width. Opaque wall and glass panels on the frame. Columns drawn 1.35× wider than their physics. Crown, dome, cables and skin as real decor that breaks with the building. Start with three: Harp Span (L13), The Sail (L15), The Bullet (L26). | L | design (Blender/three), Figma (paint-over targets), app-dev | 5-second test: a tester names the landmark type. Lab `fill()`. |
| B5 | **Material pass.** | Painted detail maps per material as in `research/visual-gap-2026-11-09/VISUAL-BIBLE.md` §2.2. Wood: 3–5 grain strokes per plank. Concrete: board seams every 0.6 m, tie holes. Steel: rivet rows, hazard band at the base. Each must show 2 motifs at 390 px. | M–L | design, app-dev | Blind test: tester names 5 of 6 materials from a level screenshot. |
| B6 | **The money shot.** | After the last piece lands: 0.6 s slow orbit, the dust clears, the rubble shows, the stamp lands. Also the 6 s clip for ads. | M | app-dev, design, ElevenLabs (rumble tail) | Ad creative click-through against the current clip. |
| B7 | **Street life around the lot.** | ≥ 25 readable props in frame: parked cars, hoarding, barrier tape, a digger, street lamps, people watching behind a fence. A detonator box in the foreground (our "cannon"). | M | design, app-dev | Prop count per opening screenshot. |
| B8 | **Real monetisation surfaces.** | Lose card: "+1 TNT" by rewarded video once per level. Interstitial at most every 5 levels, only after a win. No lives at launch. | M | app-dev, **Owner (money, group C)** | Rescue use rate. Ad views per session. |
| B9 | **Merge the two builds.** | New UI + L1–36 + Figma heroes in one file, so every later test sees the same game. | M | app-dev | One checkpoint passes loadcheck, the layout check and the bot gate. |

### 5.3 Suggested order
1. Q1, Q2, Q5, Q6 (one day together; they need no art).
2. Q3, Q4, Q7 (the blast and the win).
3. B9, then B1 (the first ten levels).
4. B4 with three heroes, then decide on B5 and B2.

## 6. What we do better than Smash Fest (keep)

1. **Speed into play.** 1 tap and under 1 s. They take about 15 s and 2 taps [QS]. Never add a loading screen or a pre-level pop-up.
2. **A visible goal.** The % meter with the PASS line. They show no progress at all in play.
3. **Fair physics.** Same plan, same result (determinism fix, round 6). Their reviews mention blocks that "ate" the ball [S].
4. **A kind lose screen.** One tip, a 150-coin rescue against their 900 [QS]. No ad wall, no life lost.
5. **Our own world.** A city, famous-looking landmarks, protected schools and hospitals. They have crates on a beach.
6. **Puzzle depth.** Rotate, steel, stacking, order of blasts, protected buildings. This is what can hold a player past level 100.
7. **Meta.** City map, seven districts, upgrades, in-level boosters.
8. **Brick.** Our best material. Use it as the quality bar for the others.
9. **Tip-over slow-mo and "TIMBER!".** Keep both.
10. **Level opening.** Iris wipe and the building assembling itself in 0.8 s.

## 7. Files in this folder

| File | Shows |
|---|---|
| `h2h-overview.png` | Contact sheet of all nine |
| `h2h-framing.png` | Target size on screen, theirs and three of ours |
| `h2h-controls.png` | Tap target size at the same zoom |
| `h2h-blast-timeline.png` | L13 from BLAST to the result card, with a timeline |
| `h2h-blast-L1.png` | Live demo L1, a miss, from BLAST to the lose card |
| `h2h-materials.png` | Material crops at the same zoom |
| `h2h-heroes.png` | Figma hero vs the hero in the game |
| `h2h-background.png` | Sky, skyline, ground |
| `h2h-first10s.png` | Home and the first seconds of level 1 |
| `h2h-result.png` | Win and lose screens |
| `data/*.json`, `data/probe-live-L1.txt` | Capture logs (phases, times) and the font-size probe |
| `tools/` | The capture script, the probe and the sheet helper |

The Smash Fest picture inside the sheets is Owner's own screenshot (`art-brief/img/ref-smashfest.jpg`), shown small for comparison only.

## 8. Not checked
- Sound and haptics on both sides.
- Smash Fest's tutorial, icon and store screenshots.
- Glass, RC and barrels in motion; boosters; Hard and boss collapses.
- Real phones. One thing to test on a slow phone: the game allows at most 2 physics steps per frame (`MAX_STEPS = 2`), so under 30 fps the collapse would play slower than real time.
