# City Blast!: boosters (research, design, prototype numbers)

Written 08/11/2026 for Owner's request: *"We have no boosters and no good way to use them. Design ~3 boosters beyond the bombs. Research the Wrecking Ball, or whatever makes destruction feel better."*
Layout rule from Lead (08/11): booster bar, Select Booster popup and confirmation match Colony Flow / Food Hunt / Smash Fest at 90–100 % for **positions, sizes and flows**. Art, icons, colours and names stay ours. No pixel copies.

**Tags.** **[O]** observed by us (our iPhone-mirroring session, `research/iphone-mirroring-2026-11-08/`, or our own builds and bots). **[S]** sourced (link at the end). **[I]** inferred (our design judgement). Bot numbers come from `scratchpad/boosters/tools/balance.js`, which uses the same bots and seeds as `tools/bots.js`.

**Prototype.** The prototype lives at `scratchpad/boosters/index.html`. It is built from `checkpoints/index-v4-ux1-sound7.html` by `src/patchB.js`, which applies 22 one-line hooks plus 3 blocks. The port is described in `scratchpad/boosters/PORT.md`. The same patch also applies cleanly to the LEVELS-V5 build and to today's live `index.html`.

---

## 0. The answer in one screen

| Slot | Booster | Role | Pitch | Status |
|---|---|---|---|---|
| 1 | **Wrecking Ball v2** | heavy physical (Owner's lead idea) | Tap Ball: low player's-eye view + reticle. Tap the building: a heavy ball is thrown there at once. Big hit, follow-cam. **1 booster = 2 throws.** Steel clangs it off. | **prototyped and validated** (§4.1). A feel booster: never passes a level alone, never hurts a correct plan |
| 2 | **Safety Net** | insurance / second chance | Low fences on the kerb and in the gap to each protected building. They catch flying rubble, but not a falling building. | **prototyped and validated** |
| 3 | **Blueprint** | insight / precision | A one-shot preview of your current plan: a ghost of the fall, the predicted % and a red flash on anything protected that it would hit. | spec only (§4.4) |
| 4 | +1 TNT | the existing rescue item, now also in the bar | One more charge, now. | prototyped (trivial) |

**Why a Safety Net and not an "Aftershock" quake.** I first built an Aftershock: a ground tremor that tops a short building over. It fired **0 times in 40 casual-bot runs**. In our game, **92 % of fails are constraint fails (street 54 %, neighbour 38 %) and only 8 % are "too short"** [O, 24 fails of the random bot on L5/L8/L10/L14]. A building that is "short" usually stands at 2 %, and a quake cannot finish it. So the insurance has to protect against what actually fails people. §4.3 has the numbers.

**Economy in one line.** Coins only, as Lead ruled. A booster costs about 1.5–2 levels of income per use. Each booster comes with 2–3 free uses when it unlocks. The Select Booster popup appears only on Hard and boss levels, after 2 fails, or right after an unlock. Otherwise PLAY still starts the level in 1 tap.

---

## 1. How the genre does boosters

| Game | What | When it is offered | Free / price | Tag |
|---|---|---|---|---|
| **Smash Fest!** | Rockets in a pre-level **"Select Booster"** popup on the level card (Level 316: rockets ×2). Picked boosters turn **green with a ✓**, and Play is a green button below them. On a **Hard** level the whole popup turns purple and shows "⚠ Hard! ⚠". After a second fail the "Try Again" popup shows the booster with a **"+"** that invites you to buy. | before the level; again on the retry popup | some free uses (rockets ×2 shown); "+" when you have none; the fail offer bundles "rockets ×3" with 2,500 coins and +5 balls for 149,000 VND | [O] captions smashfest-02, 07a/b, 09, 16a/b |
| **Colony Flow!** | **4 round boosters** on a blue bar pinned to the bottom of the level screen (one is a shuffle). You cannot cancel a booster you started by mistake (a 1-star review). | in-level, always visible | bought in bundles of 3 with coins; prices 190–1,900 against 10–40 coins per win | [O] report row 3; [S] reviews in `research/asmr-sort/foodhunt-screwdom.md` |
| **Food Hunt** | The same 4 round boosters, each with a **"1" badge (one free use)**, on a coloured bottom bar. The pause panel has a **"Booster Confirmation"** on/off switch. | in-level | 1 free each, then coins (×3 bundles; "900 → 1,500" price rises reported) | [O] captions foodhunt-03…05; [S] |
| **Royal Match** | Pre-game boosters (Rocket, TNT, Light Ball) are placed on the board at the start. In-game boosters are used during play. **You get 3 of each when they unlock at level 7, and the game shows you how they work.** Butler's Gift (free boosters for a win streak) unlocks at L32. | pre-level picker + in-level | 3 free at unlock; daily rewards; events | [S] twinfinite, oldcynic; `ONBOARDING-RESEARCH.md` |
| **Candy Crush Saga** | Pre-game boosters (colour bomb, striped/wrapped) are activated before the level. In-game ones (Lollipop Hammer, Free Switch) are used mid-level when you are stuck. Daily spin wheel. | both | spin wheel, events, gold bars | [S] King community, fandom (sources disagree on which booster is which) |
| **Angry Birds** | Power-ups: **King Sling** (faster launch), **Sling Scope** (shows the trajectory before you shoot; stays for the level), **Birdquake** (shakes the level so weak structures collapse), and **Mighty Eagle** (a limited-use super bird, bought or earned). | before the shot / once per level | shop, eggs; Eagle limited uses | [S] Angry Birds wiki, Rovio support |
| **Teardown** | A tool ladder: Sledge (wood, glass, weak masonry) → Blowtorch (cuts what the sledge can't) → Pipe Bomb / Bomb → Rocket → Nitroglycerin. Each tool has a **material personality**. | campaign unlocks | progression, not consumables | [S] Teardown wiki |
| **Wrecking-ball / demolition casual** (Boomdozer, Wrecking Yard, Wreck It 3D, Must Smash) | The ball is a **pendulum on a crane boom**: gravity, damping, a radial (cable) constraint. Control is drag-back-and-release or one-tap swing. "Smash the condemned building, but don't hit the neighbours" (Must Smash). | the core verb, not a booster | — | [S] store pages, build briefs |

### What the genre does (patterns)

1. **Two moments: before the level and during the level.** Pre-level boosters come from a popup on the level card (Smash Fest, Royal Match, Candy Crush). In-level boosters sit in a row of round buttons pinned to the bottom (Colony Flow, Food Hunt). The rescue on the lose card ("+5 balls", "+1 slot") is the third moment, and it is the money moment [O][S].
2. **Teach with free stock.** Royal Match gives 3 free at unlock with a forced demo. Food Hunt gives 1 free of each. "A booster you can never afford teaches nothing" (Pixel Flow lesson, `ONBOARDING-RESEARCH.md`) [S][I].
3. **A count badge, then a "+" when you have none.** The "+" opens the shop [O].
4. **Offer on Hard/boss and after fails.** Smash Fest re-skins the popup purple on Hard and shows the "+" again on the 2nd-fail popup [O].
5. **Bundles of 3, coins first.** Real money comes in packs and the fail offer [S].
6. **What players hate** [S, `foodhunt-screwdom.md`, PLAYBOOK H6]:
   - prices 50–100× level income (Pixel Flow ~2,000 coins against ~20 per level);
   - price rises mid-life;
   - Hard levels that are "impossible without power-ups";
   - boosters you can't cancel;
   - hidden supply.
7. **Near-loss pairing.** The offer arrives when the player was close. Our lose card already says "Just 4 % short!" and offers +1 TNT. The genre's fail offer is the #1 SKU (Color Block Jam >20 % of IAP) [S].

### Economy patterns we adopt

| Rule | Value for City Blast | Why |
|---|---|---|
| Pre-level vs in-level vs rescue | Wrecking Ball, Safety Net and +1 TNT can be picked before the level **and** used from the bar. Blueprint is bar-only (it needs a plan to preview). The rescue stays "+1 TNT" on the lose card. | genre's 3 moments; one inventory, so nothing is confusing [I] |
| Free starter stock | Wrecking Ball 3, Safety Net 2, +1 TNT 2, Blueprint 2 at unlock | Royal Match 3; Food Hunt 1 [S] |
| Earn rate vs price | Measured income with zero upgrades (expert plan, `tools/coins.js`): **L1–4 ≈ 17–31 coins, L5–15 ≈ 40–150 (median ≈ 70), boss ≈ 140–390**. One use costs 100–130 coins, or **≈ 1.5–2 levels**. A 3-pack is ≈ 4–6 levels. | Food Hunt lesson: "a booster within ~5 levels"; never 100× [S][O] |
| When to offer | Picker on Hard/boss levels, after 2 fails of the same level, and on the first PLAY after an unlock. The bar is always there. The lose card stays +1 TNT, with the "+" sheet if you have none. | Smash Fest [O]; keeps our 1-tap win → next flow (REPORT §3) |
| Not pay-to-win | Each booster **helps a sound plan and never fixes a wrong one**. Measured: naive-bot pass rate 0/32 → 0/32 with the Safety Net and 0/32 → 1–2/32 with the Wrecking Ball (all on the low-bar Hard L8, see §4.1). A booster on its own never passes a level (ball only: 0/32). Tune the Hard bands at 0 boosters. | PLAYBOOK H6; game-designer §3 "count upgrades" [O] |
| Consumption | A booster is used only when it actually fires: the ball at its swing, the net when it goes up on BLAST. Undo, ✕ or an unused pick refunds it. | fixes Colony Flow's "can't cancel" complaint [S] |
| Confirmation | Settings: "Booster confirmation" (default **off**). It only confirms the boosters that act at once (+1 TNT, Blueprint). The ball and the net are already reversible until BLAST. | Food Hunt toggle [O] |

---

## 2. Long list: 13 ideas, scored

Scores run 1–5 (5 = best). Physics: 5 = native to our model (radial impulse, spring bonds as Rapier impulse joints with capacities, Rapier rigid bodies). Trivialise: 5 = cannot trivialise. Dev cost: 5 = cheapest.

| # | Idea | Feel / juice | Phone clarity | Physics fit | Puzzle fit (helps, not trivial) | Uniqueness | Money fit | Dev cost | Total | Note |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Wrecking Ball** (v1 crane pendulum; v2 thrown ball, §4.1) | 5 | 4 | 4 (CCD ball + predictive impact) | 4 | 4 (the destruction fantasy; Smash Fest has rockets) | 5 | 3 | **29** | Owner's lead; the ad clip writes itself |
| 2 | Excavator punch (a short arm jab at one member) | 3 | 4 | 4 | 3 | 3 | 3 | 3 | 23 | a smaller wrecking ball |
| 3 | Bulldozer push (the base shoves sideways) | 3 | 3 | 3 | 2 (moves the base: trivialises toppling) | 3 | 3 | 3 | 20 | |
| 4 | Aftershock / earthquake (the lot shakes) | 4 | 5 | 5 | 1 (*measured: 0 triggers; it can't topple bonded frames*) | 2 (Birdquake) | 3 | 4 | 24 | built, then rejected, §4.3 |
| 5 | Mega-TNT (×2 radius) | 4 | 5 | 5 | 2 (a bigger bomb is "more bombs"; Owner said beyond bombs) | 1 | 4 | 5 | 26 | |
| 6 | **Blueprint** (preview of the current plan's fall) | 3 | 4 | 3 (snapshot + headless run) | 5 (you still find the plan) | 5 (no competitor previews a collapse) | 4 | 2 | **26** | insight pick |
| 7 | Weak-spot X-ray (marks the best 2 members) | 2 | 5 | 5 | 2 (it is the answer) | 3 | 4 | 5 | 26 | the free "ghost after 3 fails" already covers this (game-designer §3) |
| 8 | Laser cutter line (slices one storey) | 4 | 4 | 4 | 3 | 3 | 3 | 3 | 24 | overlaps the Cutter |
| 9 | Tow cable / magnet (pull the top one way) | 4 | 3 (needs a drag direction) | 3 (a joint + motor) | 4 (steering) | 4 | 3 | 2 | 23 | strong steering idea, harder control |
| 10 | Slow-mo + retarget (pause mid-fall, drop 1 more charge) | 5 | 3 | 4 | 4 | 4 | 4 | 2 | 26 | needs a mid-collapse input mode |
| 11 | Extra wave (+1 wave, keep the rubble) | 2 | 5 | 5 | 3 | 1 (+1 move) | 5 | 5 | 26 | already inside our rescue |
| 12 | Gravity boost (2 s of 1.5 g) | 3 | 2 (invisible) | 5 | 2 | 3 | 3 | 5 | 23 | hard to read |
| 13 | **Safety Net** (low fences on the kerb and keep gaps) | 3 | 5 | 5 (fixed cuboids, collision groups) | 4 (*measured: helps near-misses only*) | 4 | 5 (insurance sells on Hard) | 5 | **31** | insurance pick |
| 14 | Crowbar (unbonds one member, no blast) | 2 | 4 | 5 | 3 | 3 | 3 | 5 | 25 | quiet; weak payoff |

### Why these 3

- **Heavy physical: Wrecking Ball.**
  - It is the destruction fantasy, Owner's idea, and the ad clip. In v2 it is thrown like Smash Fest's cannon ball, not swung on a crane.
  - It is the only tool in the game that hits **from one side**. Every charge pushes radially. So it adds a decision (where to swing from, and how high) instead of "more bang".
  - It obeys the same material rules as TNT (steel clangs), so it cannot bypass the Cutter lesson. Measured: L12 Steel Frame ball-only reaches 0 %.
- **Insurance: Safety Net.**
  - Our fails are 92 % constraint fails, so the insurance must protect the constraint.
  - It catches *rubble* (the near-miss "12 % street limit, landed 14 %") but not a *building* that falls the wrong way. It is only 2.4–3 m tall.
  - It helps exactly the near-loss moments and never rescues a wrong plan. Measured below.
- **Insight: Blueprint.**
  - It answers the game-designer rule "readable cause and effect before the commit" without giving the answer away.
  - It is unique: no competitor previews a collapse.
  - It is the Sling Scope of demolition.
  - It costs the most to build (§4.4), so it ships third.

---

## 3. Layout (Lead rule: 90–100 % genre match). Reference 430×932, % of screen

### 3.1 In-level (gameplay) — measured on the prototype at 430×932

| Element | Position (centre) | Size | Notes |
|---|---|---|---|
| **Booster bar** | x 50 %, y **94.2 %** (bar 89.7–98.7 %) | 100 % of the play column minus the 10 px gutters × **84 px (9.0 % H)**, radius 24 | Pinned to the bottom like Colony Flow (blue bar) and Food Hunt (red bar). Ours is an **ink-violet panel #4A3A78→#35295A** with a 3 px ink border. |
| 4 round buttons | centres at x **12.5 / 37.5 / 62.5 / 87.5 %**, y 94.2 % | **64 px circle (14.9 % W)**, icon 42 px | cream radial fill, 3 px ink ring, 4 px drop. Order: Ball · Net · +1 TNT · Blueprint |
| Count badge | top-right of each button, −6 px | 26 px pill | orange #FF6A3D with white digits = stock. **Green #4DBA2F "+" when 0** (opens the buy sheet). Grey with a lock = not unlocked yet. |
| Armed state | | lift −4 px, scale 1.06, 4 px **sun #FFC633** ring | ball aimed or armed; net armed |
| BLAST row | y **85.2 %** (81.3–89.1 %) | unchanged (72 px) | still the one primary action, orange |
| Charge chips | y **77.7 %** | unchanged (52 px) | |
| 375×667 (`max-height:740px`) | bar 66 px, buttons 52 px (13.9 % W) | | measured: the play area keeps 6–64 % of H. Tight; see open question Q3 |

The HUD conflict is solved by stacking, bottom to top: **bar → BLAST row → chips → collateral pill**. BLAST stays the only orange, primary control. Boosters are secondary round buttons in the genre's place. Every target is ≥ 52 px.

### 3.2 Select Booster (pre-level popup, Smash Fest flow)

| Element | Position | Size |
|---|---|---|
| Scrim | full screen, rgba(20,14,40,.55) | |
| Card | x centred, top **22 % H** | **86 % W (max 380 px)**, ≈ 34 % H tall |
| Header band | top of the card | 40 px display type "Level 10". **Sun-yellow** on Normal, **purple #7A2BC4** on Hard/boss (Smash Fest turns purple) |
| "⚠ Boss! ⚠" / "⚠ Hard! ⚠" line | under the header | 24 px purple |
| "Select Booster" | | 20 px, 900 weight |
| 3 tiles | one row, centred, gap 10 | each **27 % of the card width**, aspect 1:1.1, icon 52 px, name 15 px. **Selected = green gradient + ✓ badge (30 px)**. 0 stock = green "+" (opens the buy sheet). Locked = grey. |
| PLAY | under the tiles, at ≈ 52 % H | card width × 64 px, green (go) |
| ✕ | top-right corner of the card | 48 px | back to Home, nothing spent |

Flow: PLAY → popup → tap tiles (0–3) → PLAY. That is **2 taps** with no boosters, the same as Smash Fest. The popup appears only on Hard/boss, after 2 fails of the same level, or on the first PLAY after an unlock. Every other PLAY starts the level at once, which keeps our "1 tap, ~2 s" lead (REPORT §3).

### 3.3 Buy sheet ("+")

Same card family, top 22 %. Header "Get more". 84 px icon, name, one line. A green button **"×3 ● 360"**, greyed with "Need 360" when short. "You have N" underneath. ✕ in the corner. When you buy from the picker, the tile is selected at once.

### 3.4 Booster confirmation (Food Hunt toggle)

Settings → "Booster confirmation" (off by default). When it is on, +1 TNT and Blueprint show a small pill **above the bar** (bottom +96 px): "Use 1 +1 TNT?" with ✓ / ✕ (48 px round). The ball and the net never ask, because both stay reversible until BLAST.

### 3.5 NEW! card (same family as the V5 unlock card)

| Booster | Title | Line (≤ 8 words) | Hand target |
|---|---|---|---|
| Wrecking Ball | WRECKING BALL | "Aim. Tap. Smash." | the Ball button in the bar, then a ground-floor wall |
| Safety Net | SAFETY NET | "Catches flying rubble. Not buildings." | the Net button |
| +1 TNT | +1 TNT | "One more charge." | the +1 TNT button |
| Blueprint | BLUEPRINT | "See the fall before you blast." | Blueprint button, after the first charge |

The card uses a kerb-yellow "NEW!" tag tilted −4°, the name in display type, an 84 px icon, the line, a green "3 FREE" pill and GOT IT. After GOT IT, the hand taps the bar button (shots `02-bar-first-time`).

---

## 4. The three picks: full specs

### 4.1 Wrecking Ball v2: thrown, Smash Fest style (prototyped; replaces v1)

> **Why v2.** Owner rejected v1, a crane pendulum that swung on BLAST and was filmed from the side. The ball must feel like Smash Fest's cannon:
> - a player's-eye view with a reticle;
> - tap a point and the ball flies there **at once**;
> - a big impact, and the camera follows it.
>
> The v1 spec and numbers are kept in git history (fd95274) and in `scratchpad/boosters/src/boosters-v1.js` / `PORT-v1.md`.

**Pitch.** Aim, throw, smash. A heavy steel ball is thrown from the bottom of the screen at the exact spot you tap. One booster gives **2 throws**.

**Player flow (one thumb).**
1. Tap **Ball** in the bar (1 tap). The booster is used now and gives 2 throws for this attempt.
   - The camera eases down to a **low player's-eye view** of the side you were already looking at: pitch 0.1 rad, 0.9× zoom, framed on the lower third of the building.
   - A **reticle** appears: a white ring with a crosshair, ink outline and a red centre dot, 72 px, pulsing 1.0↔1.08. Its blue badge shows the throws left.
   - The Ball button gets a gold ring and a blue "×2" badge.
2. **Tap a point on the building** (1 tap). The reticle jumps there and the ball launches immediately: no fuse, no BLAST.
   - A swipe still turns 90°, so you choose **which side** to throw from.
3. After the impact, the camera follows the hit for 0.7 s (zoom ×0.85 toward the hit height), then returns to the aim view for the next throw.
4. When the throws run out, or you tap Ball again, the normal camera comes back. Charges and **BLAST** work exactly as before, before or after the throws; BLAST stays the only primary action.
5. While a ball is in the air or settling, BLAST, undo and the bar are disabled.

**The rules on screen.** A refused aim shows a **red reticle that shakes**, a toast and the protected-building sound. A throw is refused when:

| Reason | Toast |
|---|---|
| you tapped a protected building | "Protected! Throw at the target building." |
| the flight path passes within 0.6 m of a protected building | "Blocked: the bakery is in the way" |
| the point is within 1.5 m of a protected building | "Too close to the bakery" |
| another part of the target hides that point from the throw ("what you tap is what you hit") | "Can't reach that spot from here" |
| the launch point is inside something | "No room to throw from this side" |

**Physics (all in `BALL`, sub-block `BALL v2`).**

| Item | Value | How |
|---|---|---|
| Ball | steel sphere, r **0.55 m**, **2.5 t**, friction 0.3, restitution 0.08, **CCD on**, spin −8 rad/s | dynamic `ColliderDesc.ball`; collision groups ignore the Safety Net fences |
| Launch | 8 m out from the target along the aim side, 1.2 m high (the bottom of the view) | ballistic: v = (target − origin)/T + ½gT; **T = 0.55 s**, so it arrives at **14.5–16.7 m/s** (measured) |
| Hit detection | **predictive**: impact when the ball is within one and a half steps (\|v\|·dt·1.6) of any member, else on first contact, else at T + 0.6 s | without it, a 2.5 t ball at 15 m/s sank 6–19 cm into stiff frames in the contact step; with it, ≤ 2.6 cm |
| Impact (breakable) | every target member within **R = 1.3 m** of the hit takes `damage(280 × (1 − d/R)^0.7 × material factor)` (armour applies as for TNT); a radial impulse of **3,500** on bodies and fragments within R; `wakeAll()`; the ball keeps 12 % of its speed | a direct hit breaks concrete (hp 60), glass, and brick (hp 240 after 10 % armour); stone walls crack; piers survive one hit |
| Impact (armour) | if the member hit has armour ≥ 0.5 (steel, core, truss, iron), it **CLANGs**: no damage, blue ring, the ball bounces off | same rule as TNT, so steel still needs the Cutter |
| Cleanup | damping 2.5 from 0.6 s after the hit; the ball body is removed after 0.3 s below 0.4 m/s or 2.2 s after the hit, with `wakeAround` + nearby fragments woken; the mesh shrinks out | no ball is left in the rubble, so nothing hovers |
| Resolve | the throw ends when the world has settled 0.4 s (cap 3.5 s). The rules run as after a wave: a pass ends the level, a broken street/neighbour rule fails it, otherwise you keep planning. **A throw never uses a wave.** | `structureLive` turns on at the first throw, so the meter, coins and hard rules run live |

**VFX / SFX / haptics.**

| Moment | Visual | Sound (existing events) | Haptic (new `HAPTICS-MAP.md` row) |
|---|---|---|---|
| Ball button → aim view | camera eases low (6 /s), reticle fades in | `select_charge` + `ui_tap` | `booster_arm` |
| Launch | muzzle flash (0.9 m, cream → orange, 0.15 s) at the bottom of the view; ball + 5-ghost white trail | `fuse` 0.3 s (whoosh) + `blast_press` ×0.5 | **`ball_launch`**: `T(0,.55,.6)` + `C(0,.35,.3,.12)`↘, pri 2 |
| Impact | flash 1.2 m, sun ring 2 m, dust ×8, screen flash 0.25, trauma +0.6, kick 10 px, **hit-stop 70 ms**, "SMASH!" combo pop, follow-cam | `boom_tnt` (wave 1, no inhale), `debris` 3, `pancake` | **`ball_hit`**: `T(0,1.0,.4)` + `C(0,.85,.18,.22)`↘ + grit `T(.11,.4,.5)` `T(.19,.32,.55)`; pri 1, focus 300 ms |
| CLANG | ice-blue ring 1.3 m, "CLANG!" | `steel_clang` 3 | the existing steel clang row |
| Refused | red reticle + shake 0.3 s | `protected_hit` | `protected_hit` (existing) |

**How many throws per booster? 2.** Measured with the same bots and seeds (N = 8, zero upgrades, L5/L8/L10/L14).
- **Throw sides:**
  - naive: the default front view;
  - sensible: the face its tip names;
  - random: a random side;
  - ball-only: the tip's face, which is the worst case for trivialising.
- **Throw targets:** the face's ground-floor members, middle first, then the ends.
- **What follows the throws:** each bot's normal charge plan.

| Throws per booster | casual (random) | sensible | naive | **ball only** (best face) | Note |
|---|---|---|---|---|---|
| none (baseline) | 8/32 (25 %) | 32/32 | 0/32 | — | |
| 1 | 6/32 | 32/32 | 0/32 | **0/32** (0–1 %) | safe, but one hit hardly changes anything: weak feel |
| **2 (chosen)** | **7/32 (22 %)** | **32/32** | 3/32 (L14 only) | **0/32 (max 42 % on L8)** | never passes alone, never hurts a correct plan |
| 3 (Lead's suggestion) | 3/32 | **24/32** (the Slouch drops 8 → 0) | 5/32\* | **2/32 (L8 Hard, 75–77 % ≥ 72 % bar)** | trivialises the low-bar Hard L8 and breaks the leaning Slouch for a correct plan |
| 5 (L5/L8/L10) | 0/24 | 16/24 (the Slouch 0/8) | 0/24 | 2/24 (L5 66 %, L10 77 %) | ball alone gets to 66–77 % |

\* With an automatic "safe side" camera (the thrower always placed opposite the street/neighbour), 3 throws let naive plans pass **17/32**. The game chose the right side for the player, which removes the level's decision. So v2 throws from the side the player is looking at.

**Reading it.**
- Two throws give a clear spectacle: each one visibly breaks 1–6 members.
- They never decide the level alone and never hurt a player who aims where the tip says.
- On demolished %, the sensible bot's passes move +2.75 % on L8 and +2 % on L5, 0 on L10 and −0.9 on L14 (bot average, 2 throws).
- It is a **feel and steering-help booster, not a pass booster**: casual players who throw at the wrong side do slightly worse (25 % → 22 %), the same "the side you take out is the side it falls to" lesson as TNT.
- Smash Fest's "several shots" feel comes from a short rapid cadence, not from many shots: a throw resolves in ~1.5–3.5 s.
- If Owner wants 3, the data says to cut the damage first: dmg 280 → ~200 so a direct hit still breaks concrete but not brick, then re-measure.

**Economy.** Unlock **L8** (V5). **3 free boosters = 6 throws.** ×3 for **360** coins (120 per booster ≈ 1.7 levels of income). Offered in the bar and the Select Booster popup; when picked there, the aim view opens as the level starts. Not on the lose card.

**NEW! card.** WRECKING BALL / "Aim. Tap. Smash." / the hand on the Ball button, then on a ground-floor wall.

**Validation (final code, `scratchpad/boosters/index.html`).**
- `tools/physics-check.js` against the copy: **ALL PHYSICS CHECKS PASSED**.
  - The last run (`phys-ball3.log`) was on the v2 build from before the side-view/2-throw/path-check edits. Those edits only touch the ball sub-block, which physics-check never runs.
- `tools/ball-check.js` (new; every level) — **ALL BALL CHECKS PASSED**:
  - **every aim at a protected member refused (60/60)**;
  - 18 more refusals (9 path blocked by a neighbour, 7 hidden by another part, 2 no room);
  - **≈ 200 throws fired**, with **0 contacts with a protected building**;
  - ball penetration during the flight and hit ≤ **2.6 cm**; structure overlap ≤ 0.1 cm;
  - **0 hovers** after a throw resolves;
  - **41 CLANGs**, with 0 members broken on armour;
  - every ball removed.
- **Frame cost** (`tools/ballperf2.js`, fixed step, same level and seed):

| Level | 3 throws (avg / p95) | expert plan collapse (avg / p95) |
|---|---|---|
| L8 | 1.65 / 2.9 ms | 1.96 / 3.4 ms |
| L10 | 1.89 / 5.9 ms | 2.82 / 7.0 ms |
| L14 | 2.37 / 4.3 ms | 2.64 / 4.5 ms |
| L18 | 3.09 / 6.0 ms | 3.70 / 13.0 ms |

  The ball's own code costs 0.02–0.19 ms per step. All numbers were taken while other agents' jobs shared the machine.
- **Shots** (430×932) in `scratchpad/boosters/shots/ball2/`:
  - `430x932-L9-*`: front view, a concrete block. Normal camera → aim view + reticle "2" → 7 flight frames → 6 impact/follow frames → back to aim → second throw → normal camera → charges + BLAST → result.
  - `430x932-L10-back-*`: boss, swiped to the side first, with the **red refused reticle on a protected shed**.
  - `430x932-L10-*` (without "back"): the earlier 3-throw run, kept for comparison.

**Known gaps (not done).**
- Occluders: a near tree or a protected shed can cover the target in the low view. The game-designer rule "occluders fade" should apply in the aim view.
- The reticle doesn't follow the finger before the tap (tap = throw). A press-drag-release aim mode would be a 1-day change if the playtest wants it.

### 4.2 Safety Net (prototyped)

**Pitch.** Orange debris fences go up with your BLAST, on the kerb and in the gap to each protected building. They catch rubble that bounces or rolls, but **not a building that falls on them**.

**Player flow.**
- Tap **Net** in the bar: gold ring, toast "Safety Net up on BLAST · catches rubble, not buildings". Or pick it in the popup.
- That is it: 1 tap. Tap again to cancel; nothing is used until BLAST.
- On a level with no street and no neighbour, the toast says "Nothing to protect on this level" and it is not armed. If every gap is narrower than 0.7 m (L8-type 0.4 m gaps), only the kerb fence goes up. If there is nothing at all, "No room for a net here".

**Physics.**
- **Street:** one fixed `cuboid` along the kerb, 0.35 m inside `streetZ`, x ±16 m, **2.4 m tall**, 0.3 m thick.
- **Neighbours:** for each side with protected buildings and a gap ≥ 0.7 m, a fence in the middle of the gap spans the neighbour's depth +0.5 m each end, **3.0 m tall**.
- **Collision groups** let the Wrecking Ball pass through its own net.
- Built in `wreckLead()` (the BLAST hook) and removed with the world at the next level start.
- No effect on bonds, scoring or keeps. `collateral()` and `streetShare()` are unchanged. The fence simply stops mass from getting there.

**VFX / SFX / haptics.**
- Fences pop up with a 120 ms scale-in (TODO; the prototype shows them at once).
- Sound: `place_cutter` (TODO: a dedicated chain-link rattle `net_up`).
- Debris hitting the fence: the existing `debris` impact sounds; haptic: none (it is below the collapse focus window).

**Level types it helps.**
- Street levels where the plan is right but the debris spray lands 1–5 points over the limit.
- Neighbour levels with ≥ 0.7 m gaps where splinters graze the neighbour.

It does nothing for a building that topples the wrong way, because it goes over the fence.

**Balance** (same matrix, N = 8):

| Level | casual none → **net** | sensible none → net | naive none → net |
|---|---|---|---|
| L5 | 1/8 → 1/8 | 8/8 → 8/8 | 0/8 → 0/8 |
| L8 (**H**) | 1/8 → 1/8 | 8/8 → 8/8 | 0/8 → 0/8 |
| L10 (**SH**) | 4/8 → 4/8 | 8/8 → 8/8 | 0/8 → 0/8 |
| L14 | 2/8 → **4/8** | 8/8 → 8/8 | 0/8 → 0/8 |
| **all 4** | **8/32 (25 %) → 10/32 (31 %)** | 32/32 → 32/32 | **0/32 → 0/32** |

With one charge fewer: 16/32 → 16/32.

It never hurts, never rescues a wrong plan, and lifts casual near-misses by about +6 points. **That is the insurance profile we want.** The gain is concentrated on the "rubble" levels (L14: +25 points).

**Economy.**

| | |
|---|---|
| Unlock | **L13** (V5: Thirsty Bertha, N, 72 %, street + houses both sides, no new element). Last unlock before the SH L15. |
| Free | 2 |
| Price | ×3 for **300** (100 per use) |
| Offered | bar; picker (it is the natural "insurance" on purple levels); and **the lose card when the fail was street/collateral and within 5 points of the limit**: "Net it next time · 1 free / ×3 300" as a small secondary chip under TRY AGAIN. Not wired in the prototype. |

**NEW! card.** SAFETY NET / "Catches flying rubble. Not buildings." / the hand on the Net button.

### 4.3 What was rejected after measuring: Aftershock

- **Design.** It is armed for one attempt. If the last wave ends short (pct/height) **within 25 points of PASS**, the lot under the target shakes for 1.6 s, harder in the direction away from the protected side. It is not spent if it doesn't fire.
- **Result.** In 40 casual-bot runs plus 24 sensible runs it **fired 0 times**:
  - our physics is bimodal: a frame either stands at 1–5 % or comes down to 75–98 %;
  - the fails are constraint fails, not short ones.
- The code stays in the block (`QUAKE`, `quakeCheck`), `hidden:true`, so it can return if V5's later levels produce real "72 % of 80 %" fails.

### 4.4 Blueprint (spec only)

**Pitch.** "See the fall before you blast." One use shows, for 2.5 s, a translucent replay of what your current placement does:
- a ghost silhouette of where the building comes to rest;
- a fall arrow;
- the predicted % on the meter;
- the neighbour shield and the street meter flashing red if they would fail.

**Flow.** Place ≥ 1 charge, then tap **Blueprint** (with an optional confirm). A 0.3–0.6 s "scanning" sweep plays over the building, then the ghost appears, then you return to planning with everything as it was. One use = one preview. Nothing is solved for you: you still choose the members.

**Tech.**
- Rapier `world.takeSnapshot()` saves the world.
- Run the same `fixedStep()` loop headless for up to 6 s of game time, at most 6 ms a frame, in the prebuild slicing style (`pbStep`). Record the end poses of the 20 heaviest bodies and `score()` / `collateral()` / `streetShare()`.
- `World.restoreSnapshot()` restores it, along with the game arrays (`blocks[].P/Q/dead/hp`, `links[].alive`, `frags`, `rnd` state).
- It is deterministic (seeded rng, fixed step), so **the preview always matches the real BLAST**. That must be a test: preview % = real % on 18 levels × 4 seeds.
- Cost **L** (5–8 dev-days), because the game state outside Rapier has to be snapshotted too.

**Balance guard.** It is limited to 1 preview per use, so it is not free trial and error.
- Expected effect [I]: casual near-misses convert (≈ +10–15 points on Hard). Naive players learn *why* without being given the answer.
- Measure it with a "preview-then-adjust" bot: preview, and if it predicts a fail, move one charge to the face the tip names.

**Economy.** Unlock **L21** (V5 relief Old Whirly, before SH L25). Free 2. ×3 for **300**. Bar only.
**NEW! card.** BLUEPRINT / "See the fall before you blast." / the hand on Blueprint after the first charge.

### 4.5 +1 TNT in the bar

This is the existing rescue item. Tap it to get one more TNT right away; it asks for confirmation if that option is on. Pre-pick it to start with +1. Unlock **L16** (V5 relief Five Hats). Free 2. ×3 for **390** (130 each, slightly cheaper than the 150 rescue because it is bought in advance). The lose card rescue (+1 TNT · 150) stays as it is.

---

## 5. Economy table

| Booster | Role | Unlock (V5) | Free at unlock | Price | Per use ≈ levels of income | Pre-level picker | In-level bar | Lose card |
|---|---|---|---|---|---|---|---|---|
| Wrecking Ball v2 | heavy physical | L8 | 3 boosters (= 6 throws) | ×3 · 360 | 1.7 | yes (opens the aim view at start) | yes (2 throws per booster, no BLAST needed) | no |
| Safety Net | insurance | L13 | 2 | ×3 · 300 | 1.4 | yes | yes (1 tap) | small chip on near-miss street/collateral fails (spec) |
| +1 TNT | rescue item | L16 | 2 | ×3 · 390 | 1.9 | yes | yes (instant) | **yes**, the existing "+1 TNT · 150" |
| Blueprint | insight | L21 | 2 | ×3 · 300 | 1.4 | no | yes (needs a placed charge) | no |

**Earning boosters without paying** (proposed, not built):
- the first clear of a boss gives 1 booster of the player's choice;
- a daily reward (REPORT top-10 #10) has a booster on day 3 and day 7.
- No ads (Lead rule): rewarded video comes later, at Stage 2 monetisation (TEST-PLAN-V1).

**Guard rails.**
- Bands are tuned at 0 boosters.
- Re-run `balance.js` whenever a level changes. A Hard level may gain at most **+15 points casual pass rate** from one booster; above that, the booster or the level is re-tuned.
- Prices never rise once shipped.

---

## 6. Haptics map additions (for `HAPTICS-MAP.md`)

| Event | Trigger | iOS simple | Core Haptics | Android | Pri |
|---|---|---|---|---|---|
| `ball_launch` | a throw leaves the bottom of the view | `.medium` ×0.6 | `T(0,.55,.6)` + `C(0,.35,.3,.12)`↘ | `CLICK` 0.6 | 2 |
| ~~`wreck_release`~~ (v1) | the ball lets go | `.soft` ×0.5 | `C(0,.30,.15,.40)` with intensity ↗ 0.2→0.6 | `SLOW_RISE` 0.4 | 2 |
| `ball_hit` | the throw lands (SMASH!) | `.heavy` ×1, `.rigid` ×0.5 @110 | `T(0,1.0,.4)` + `C(0,.85,.18,.22)`↘ + `T(.11,.4,.5)` `T(.19,.32,.55)`; focus 300 ms | `THUD` 1.0 + `TICK` ×2 | 1 |
| ~~`wreck_hit`~~ (v1) | the hit (with SMASH!) | `.heavy` ×1, `.rigid` ×0.5 @120 | `T(0,1.0,.35)` + `C(0,.9,.15,.25)`↘ + `T(.12,.4,.5)` `T(.2,.35,.55)` `T(.29,.3,.6)`; focus 350 ms | `THUD` 1.0 + `TICK` ×3 | 1 |
| `net_up` | fences rise on BLAST | `.light` ×0.5 | `T(0,.35,.8)` `T(.05,.3,.85)` | `TICK` ×2 | 3 |
| `booster_arm` | bar button armed | Selection | `T(0,.40,.90)` (= select_charge) | `TICK` 0.6 | 5 |

---

## 7. Prototype: what exists, how it was checked

| Item | Where | Result |
|---|---|---|
| Code block + hooks | `scratchpad/boosters/src/` (`boosters.js` ~420 lines, css, html, `patchB.js`) | 22 anchors. Applies to the v4 checkpoint, the LEVELS-V5 build and today's live `index.html` (21/22 there: the live file has no Map PLAY button; that hook is optional) |
| Physics regression | `tools/physics-check.js` on the copy | **ALL PHYSICS CHECKS PASSED** |
| Wrecking Ball / net physics | `scratchpad/boosters/tools/wreck-check.js` | see §4.1 (0 neighbour contacts, 0 hovers, 9/252 known penetration cases) |
| Balance | `scratchpad/boosters/tools/balance.js`, logs `bal-final*.log` / `.json` | §4.1, §4.2 |
| Frame cost | `scratchpad/boosters/tools/ballperf.js`, `tools/perf.js` (base vs boost) | ball wave step 1.2–2.0 ms (no change from the plan without the ball); perf.js shows no regression (`perf-*.log`) |
| Screenshots | `scratchpad/boosters/shots/430x932-*` and `375x667-*` | NEW! card, bar first time (hand), picker, buy sheet, picker selected, bar armed, aim, charges, countdown, 10 swing frames, result, settings |

## 8. Open questions for Owner

1. **Wrecking Ball v2: 2 throws or 3?** The data says 2.
   - With 2 throws it never passes a level alone (0/32), and correct plans stay 32/32.
   - With 3 it passes the Hard L8 alone (2/8) and breaks the Slouch for correct plans (8 → 0).
   - If you want Smash Fest's 3, we cut the per-throw damage first and re-measure.
   - Also: should the aim view fade trees and protected buildings that stand in front of the target?
2. **Naming.** "Wrecking Ball", "Safety Net", "Blueprint" are working names, and their icons are placeholders for `design`.
3. **375×667.** With the bar, the bottom stack takes about 36 % of the screen. Should we move ↻ restart into a pause menu (REPORT top-10 #3) and merge the chips into the BLAST row on short screens?
4. **The lose card.** Should it keep a single rescue (+1 TNT), or add the small "Net it next time" chip on near-miss street/collateral fails?
5. **Blueprint.** Is it worth the 5–8 dev-days now, or should we ship Ball + Net + +1 TNT first and add Blueprint with V5's second half?

## Sources

- Our research: `research/iphone-mirroring-2026-11-08/REPORT.md` (rows 3, 7, 8; §3 tap-flow; top-10 #9), `CAPTIONS.md` (smashfest-02, 07a/b, 09, 16a/b; colonyflow-04; foodhunt-03…05), `research/asmr-sort/foodhunt-screwdom.md`, `playbook/PLAYBOOK.md` (H4–H6, §10), `playbook/GAME-DESIGN.md`, `ONBOARDING-RESEARCH.md`, `playbook/games/smash-fest.md`, `colony-flow.md`, `pixel-flow.md`.
- Royal Match boosters: https://twinfinite.net/guides/how-to-get-boosters-royal-match/ · https://oldcynic.com/royal-match-tips-and-tricks-cheats-for-new-players · https://dreamgames.helpshift.com/hc/az/3-royal-match/faq/8-using-boosters
- Candy Crush boosters: https://community.king.com/en/candy-crush-saga/kb/articles/394-what-are-boosters-learn-all-about-them-here · https://candycrushsoda.fandom.com/wiki/Booster
- Pre-level vs in-level (Rovio): https://roviosupport.helpshift.com/hc/en/4-angry-birds-dream-blast/faq/3053-pre-level-vs-in-level-boosters
- Angry Birds power-ups: https://angrybirds.fandom.com/wiki/Power-Ups · https://angrybirds.fandom.com/wiki/Sling_Scope · https://roviosupport.helpshift.com/hc/en/12-angry-birds-friends/faq/1539-what-are-power-ups · https://kotaku.com/how-facebook-powers-up-angry-birds-or-enter-the-birdqu-5883727
- Teardown tools: https://teardown.fandom.com/wiki/Tools · https://get-teardown.readthedocs.io/en/latest/gameplay/tools-and-upgrades.html
- Wrecking-ball games: https://app.cinevva.com/arcade/wrecking-yard · https://www.seeles.ai/games/casual/boomdozer-demolition-construction-game · https://apps.apple.com/in/app/wreck-it-3d/id6499518731 · https://apps.apple.com/cv/app/must-smash/id1542781618
- Smash Fest's own booster rules were not found in any web source; everything on Smash Fest is [O] from our session.
