# City Blast!: near-loss / near-win metric (08/11/2026)

**Written** 2026-11-08 by the `game-designer` subagent for Owner's request (via the Lead). Measured on the V5 prototype `scratchpad/levels5/index.html` (`games/blast/index.html` untouched). Tools: `scratchpad/levels5/src/nearmiss.js` (= `tools/bots.js` + per-run metrics; same bots, same seeds 800 + 37000k + L) and `src/nm-report.js`; raw data `scratchpad/levels5/nearmiss/nearmiss.json`.

## 1. Definitions (Owner, 08/11)

Per run, for every bot (expert, sensible, naive; 4 seeds each, 432 runs):
- **Margin to PASS** = final demolition % − PASS, in points.
- **Street approach** = the smallest gap (m) between the street line and the front-most target member or fragment, sampled every 1/6 s through every wave (negative = rubble crossed the kerb; the rule still allows up to `street.max` of the mass there).
- **Neighbour clearance** = the smallest gap (m) between any target member/fragment and any protected member (axis-aligned box distance), sampled the same way (0 = touched).
- **Near-loss** = a **fail within 10 points of its limit** (pct/core: PASS − %; street: street share − max; protected: damage − 10 %), **or a pass whose street gap or neighbour clearance went under 0.5 m**.
- **Near-win** = a **pass within 5 points of PASS**.
- **Rescue offered** = the lose card's "+1 TNT · 150 coins" (`canRescue`): offered on `pct`, `core` and `height` fails only (not on street or protected fails), once per level.

## 2. Targets and where they come from

| Metric | Tier | Target | Source |
|---|---|---|---|
| Share of sensible-bot fails that are near-losses | H, SH | **50–60 %** (Lead/Owner starting point) | `playbook/GAME-DESIGN.md` §2.5 "a good plan on a Hard should fail by a small margin (1–3 % over a limit, one column short), not by 100 %" [S, PROCESS §3.3; PLAYBOOK H5]; game-designer skill §0.8 "near-miss, not slap: a good-but-imperfect plan on a Hard fails by 1–3 %" and §7 red flag "a fail at 98 % with a big red title" |
| Sensible-bot pass rate | H 30–60 %, SH 10–40 % | skill §3 table | Royal Match / Royal Kingdom Hard-level analyses quoted in PROCESS.md L8 ("tuned to near-misses: fail with 1–2 moves left") [S] |
| Near-win share of passes | N, T, R | **≤ 25 %** ("most passes are not razor-thin") | skill §3: N first-try win 60–85 %, R/T ≥ 90 %: these are comfortable wins; a razor-thin pass on a Normal is a coin-flip in disguise (skill §0.5 "chaos is for the spectacle, not for pass/fail") [I] |
| Rescue offered on near-loss fails | H, SH | **most (≥ 70 %)** | PLAYBOOK.md: "Hard levels are where monetisation happens (fail offer, revive). Make them fair: a near-miss fail, a rescue that is proven to work" [I]; "the fail offer is the #1 SKU: Color Block Jam's fail offer is > 20 % of IAP revenue" [S, AppMagic]; Colony Flow / Food Hunt "Play On" offers on the out-of-moves fail (research/iphone-mirroring REPORT §7) [QS] |
| Expert | all | 100 %, margin ≥ 3 pts | skill §1 tolerance |

Benchmarks we have are qualitative (Royal Match's "1–2 moves left" tuning, Color Block Jam's fail-offer revenue share). No public number for "share of fails that are near-misses" was found in the playbook; the 50–60 % is Owner's working target and should be re-set from live `level_fail` data (fail-reason mix + % at fail) per PROCESS.md weekly loop.

## 3. Results per tier (sensible bot unless stated)

| Tier | Sensible pass | Sensible near-loss share of fails | Sensible thin passes | Sensible near-win share of passes | All-bot near-loss fails | Rescue offered on near-loss fails |
|---|---|---|---|---|---|---|
| T | 100% | – (0/0) | 0 | 25% | 0/0 | – (0/0) |
| N | 100% | – (0/0) | 36 | 8% | 8/43 | 0% (0/8) |
| R | 100% | – (0/0) | 0 | 8% | 0/8 | – (0/0) |
| H | 83% | 50% (1/2) | 10 | 10% | 5/14 | 20% (1/5) |
| SH | 83% | 100% (4/4) | 9 | 20% | 12/28 | 33% (4/12) |

**Reading the table.**
- **H/SH near-loss share:** H 50 % (1 of 2 sensible fails), SH 100 % (4 of 4). On target for H, above it on SH (every boss fail is close; the non-close fails come from the naive bot, which fails bosses on the street by 4–54 points).
- **Sensible pass on H/SH:** H 83 % (10/12), SH 83 % (20/24): above the skill bands (H 30–60 %, SH 10–40 %). The sensible bot is a **deterministic tip-reader**: on most landmark bosses the physics barely varies with the seed (same % on all 4 seeds), so per level it is 0/4 or 4/4. A 40–70 % band per level is not reachable with this bot; it is reachable across a tier (5 of 6 bosses pass, 1 fails close). A human test is the real measure.
- **"Thin passes" by the 0.5 m geometric rule are very common on N/H** (36 of 64 sensible N passes, all 10 H passes) because debris routinely **touches** a neighbour or rolls over the kerb without failing: the street rule allows 10–15 % of the mass on the street, and a touch below 0.6 m displacement is 0 % damage. Measured in the rule's own units instead (street share within 3 points of its max, or damage within 3 points of 10 %), **thin passes are 0 on every tier**. Recommendation: use the units-based rule for "thin pass" (what the player sees on the meters) and keep the 0.5 m numbers as a diagnostic.
- **Near-win on N/T/R:** 8 % / 25 % / 8 % of passes. On target. The T near-wins are L5 Jelly Mould (85 % on an 80 % PASS) and one Twin Sheds seed (83 %), both teach levels where the naive plan also passes.
- **Rescue coverage is the gap: offered on 5 of 25 near-loss fails (20 %).** 20 of the 25 near-loss fails are **street** fails (1–10 points over the limit), and the rescue is not offered on street or protected fails (`canRescue` codes `pct`/`core`/`height`). +1 TNT cannot un-block a street, so the fix is a different offer, not a wider `canRescue`: **"Retry: plan kept" (free) + a paid "Street sweeper: ignore 5 % of street rubble once" or "Shield +10 %"**. That is a product decision (Owner). With pct-type near-losses alone, rescue coverage is 5/5 (100 %).

## 4. Per-level table (4 seeds per bot)

| L | Name | Tier | Expert % (margin) | Sensible pass | Sensible final % (code) | Sensible near-loss | Naive pass | Naive near-loss | Street gap min (m) | Neighbour clearance min (m) |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Garden Shed | T | 98–100 vs 80 | 4/4 | 100, 99, 99, 98 | – | 4/4 | – | – | – |
| 2 | Narrow House | T | 96–99 vs 80 | 4/4 | 99, 96, 96, 99 | – | 4/4 | – | – | – |
| 3 | Twin Sheds | T | 83–99 vs 80 | 4/4 | 99, 98, 98, 83 | – | 4/4 | – | – | – |
| 4 | Long Flats | T | 89–100 vs 80 | 4/4 | 98, 88, 98, 91 | – | 4/4 | – | – | – |
| 5 | The Jelly Mould | T | 85–85 vs 80 | 4/4 | 84, 84, 84, 84 | – | 4/4 | – | – | – |
| 6 | Corner Shop | N | 92–98 vs 80 | 4/4 | 99, 99, 95, 98 | – · 4 thin passes | 4/4 | – | – | 0.0 |
| 7 | Tube House | N | 97–99 vs 80 | 4/4 | 97, 99, 99, 99 | – · 4 thin passes | 1/4 | 3/3 | -0.6 | 0.1 |
| 8 | The Slouch | N | 88–88 vs 80 | 4/4 | 83, 83, 83, 83 | – · 4 thin passes | 0/4 | 0/4 | 0.8 | 0.1 |
| 9 | Stone Facade | N | 87–97 vs 80 | 4/4 | 97, 96, 87, 96 | – · 4 thin passes | 2/4 | 1/2 | -5.6 | 0.0 |
| 10 | Grandpa Gong | SH | 86–86 vs 80 | 4/4 | 86, 86, 86, 86 | – | 0/4 | 0/4 | 10.0 | 5.8 |
| 11 | Fuel Yard | R | 84–99 vs 80 | 4/4 | 84, 99, 99, 84 | – | 4/4 | – | – | – |
| 12 | Bus Depot | N | 88–98 vs 80 | 4/4 | 83, 87, 87, 98 | – | 0/4 | 0/4 | – | – |
| 13 | Thirsty Bertha | N | 96–96 vs 80 | 4/4 | 96, 96, 96, 96 | – · 4 thin passes | 0/4 | 0/4 | -0.3 | 1.3 |
| 14 | The Old Exchange | N | 100–100 vs 80 | 4/4 | 100, 100, 100, 100 | – | 4/4 | – | – | – |
| 15 | Old Rivets | SH | 96–96 vs 80 | 4/4 | 96, 96, 96, 96 | – · 4 thin passes | 0/4 | 4/4 | -1.9 | 2.2 |
| 16 | Five Hats | R | 95–95 vs 80 | 4/4 | 99, 99, 99, 99 | – | 4/4 | – | – | – |
| 17 | Steel Spine | N | 89–91 vs 80 | 4/4 | 90, 91, 89, 90 | – | 2/4 | 0/2 | – | – |
| 18 | The Tipsy Row | N | 90–91 vs 80 | 4/4 | 93, 99, 93, 98 | – · 4 thin passes | 0/4 | 0/4 | -8.3 | 0.6 |
| 19 | Market Hall | N | 91–99 vs 80 | 4/4 | 86, 92, 99, 97 | – | 4/4 | – | – | – |
| 20 | The Corkscrew | SH | 100–100 vs 92 | 4/4 | 96, 96, 96, 96 | – · 4 thin passes | 0/4 | 0/4 | -15.5 | 0.4 |
| 21 | Old Whirly | R | 99–99 vs 80 | 4/4 | 100, 100, 100, 100 | – | 4/4 | – | – | – |
| 22 | Brutalist Tower | H | 95–96 vs 80 | 3/4 | 92 collateral, 92, 90, 95 | 0/1 fails · 3 thin passes | 0/4 | 0/4 | -9.0 | 0.0 |
| 23 | Lantern Lane | N | 97–99 vs 80 | 4/4 | 88, 99, 99, 98 | – · 4 thin passes | 0/4 | 0/4 | -4.9 | 0.2 |
| 24 | The Lollipop | N | 98–98 vs 80 | 4/4 | 98, 98, 98, 98 | – | 0/4 | 0/4 | 1.8 | 3.7 |
| 25 | The Drawbridge | SH | 89–89 vs 84 | 0/4 | 81 pct, 81 pct, 81 pct, 81 pct | 4/4 fails | 0/4 | 0/4 | -1.2 | – |
| 26 | The Long Drink | R | 94–94 vs 80 | 4/4 | 94, 94, 94, 94 | – | 0/4 | 0/4 | – | – |
| 27 | Shop House | H | 75–79 vs 72 | 3/4 | 79, 70 pct, 79, 77 | 1/1 fails · 3 thin passes | 0/4 | 0/4 | 0.0 | 0.0 |
| 28 | Annex & Bridge | N | 94–99 vs 80 | 4/4 | 92, 92, 92, 99 | – · 4 thin passes | 0/4 | 0/4 | -2.7 | – |
| 29 | Stripey | N | 88–88 vs 80 | 4/4 | 88, 88, 88, 88 | – | 0/4 | 0/4 | 2.8 | 2.1 |
| 30 | The Stepper | SH | 94–100 vs 80 | 4/4 | 100, 99, 100, 99 | – · 1 thin passes | 0/4 | 0/4 | -4.8 | 1.6 |
| 31 | Laundry Block | R | 94–99 vs 80 | 4/4 | 98, 98, 91, 99 | – | 4/4 | – | – | – |
| 32 | The Doorstop | H | 97–97 vs 80 | 4/4 | 97, 97, 97, 97 | – · 4 thin passes | 0/4 | 4/4 | -17.5 | 0.0 |
| 33 | Lazy Wheel | N | 99–99 vs 80 | 4/4 | 100, 100, 100, 100 | – · 4 thin passes | 4/4 | – | -0.3 | 0.1 |
| 34 | The Hammock | N | 86–86 vs 80 | 4/4 | 86, 86, 86, 86 | – | 0/4 | 4/4 | 0.9 | – |
| 35 | The Surfboard | SH | 98–100 vs 80 | 4/4 | 99, 100, 98, 99 | – | 0/4 | 4/4 | 0.9 | – |
| 36 | The Seashells | R | 97–97 vs 80 | 4/4 | 97, 97, 97, 97 | – | 0/4 | 0/4 | – | – |


## 5. Tuning done for (C) (Hard and boss levels)

| L | Level | Lever | Before → after | Why |
|---|---|---|---|---|
| 20 | The Corkscrew | PASS 80 → **92 %**; tip names the order ("Cut the steel spine, / then TNT the BACK row.") | sensible 0/4 (hall) → 4/4: its cautious wave 1 (Cutter + 2 back) scores **91 %, 1 point short**, and wave 2 finishes it. Expert 100 % (margin 8) | the near-miss now lives inside the level: "one column short" → wave 2, exactly GAME-DESIGN §2.5 |
| 25 | The Drawbridge | PASS 80 → **84 %** | sensible 4/4 at 81 % → **0/4, all near-losses 3 points short, rescue offered 4/4**. Expert 89 % (margin 5) | the cautious "one back leg per tower" reading now fails close, with the +1 TNT rescue as the fix |
| 32 | The Doorstop | expert plan = both back corners (was one middle charge) | expert street share 10 % of 12 % (a 2-point margin: a fairness bug) → 5 %, 97 % | expert margin ≥ 3 pts on every bar |
| 27 | Shop House | kept at PASS 72 % | sensible 3/4, its fail is 2 points short with rescue offered | already a near-miss Hard (see LEVELS-V5 §11 #6 for why not 80 %) |

Not tuned: L10, L15, L30, L35 (sensible passes with margin; making them bite needs a human tip test, the lever from LANDMARKS.md), L22 Brutalist (sensible 3/4; its one fail is a far protected hit, 25 points over).

## 6. Next
1. Run the same harness after the merge on the style-pass build (`node src/nearmiss.js` with `BLAST_FILE`).
2. Add `% at fail`, `fail code`, `street share`, `damage` to the `level_fail` analytics event so the live near-loss share replaces the bot proxy (PROCESS.md weekly table).
3. Owner: the street/protected rescue offer (§3).


## 7. Round 3 (playtest 08/11): fair input, fairer fails, measured with the human model

**Detection changes (P17 + P15) and why they are fair:**

| Rule | Before | Now | Why |
|---|---|---|---|
| Street rubble | a member counts when its centre (minus ¼ depth) is past the kerb line; a fragment when its centre is | both must be **0.4 m past** the kerb (`V5_KERB`) | a brick lying on the kerb line is not "on the street"; removes the 1–2-brick street fails at 98–100 % demolished |
| Protected hit | a member moved > 0.6 m, or destroyed | moved > **0.9 m** (`V5_KEEP_MOVE`), or destroyed; the gold shield % uses the same rule | a protected wall nudged by a rolling brick is not "damaged"; a real hit still moves members by metres |
| Limit compare | raw share > limit | the **shown whole percent** > the shown limit (`v5Over`) | the card can never read "12 % / 12 %" on a fail |
| Charge height | the tap height on the member (the hand pointed at the centre; the bots at −0.3) | always −0.3 of the half height (P15) | removes a hidden rule that changed outcomes by up to 25 points |

**Human-model results** (3 personas × 12 players × up to 3 attempts; near-loss = a fail within 10 points of the limit that failed):

| Tier | Near-loss share of fails | Rescue offered on near-loss fails | Street/protected fails > 10 pts (slaps) | Far `pct` fails | Playtest baseline near-loss |
|---|---|---|---|---|---|
| T | 50 % (5/10) | 100 % (5/5) | 0 | 5 | — |
| N | 38 % (59/156) | 58 % (34/59) | 39 | 53 | — |
| R | 52 % (12/23) | 67 % (8/12) | 0 | 11 | — |
| **H** | **21 % (17/80)** | **82 % (14/17)** | 13 | 46 | 27 % |
| **SH** | **35 % (62/177)** | **74 % (46/62)** | 41 | 71 | 34 % |

**Reading:**
- **Fewer slaps.** Slaps are now 16 % of H fails and 23 % of SH fails.
- **The rescue now covers most H/SH near-losses** (82 % / 74 %, up from 20 % for the bots in round 2), because more of the close fails are `pct` fails, where the rescue is offered.
- **The near-loss share did not reach 50–60 %.** The large remaining block is **far `pct` fails from a wrong plan**: no tip read, TNT on a steel leg, charges on the wrong side, one pier off on the Long Drink. These are not near-misses by construction.

**Next levers, in order:**
1. Boss tips that name the side, which turns wrong-plan fails into near-plans.
2. The street/protected rescue offer (LV5-6).
3. "One pier off" tolerance on the Long Drink: a 4th TNT was added; a Cluster-able pier course would be the next step.

**Bots, round 3** (`src/nearmiss.js`, N = 4): expert 144/144; sensible 93 %; naive fails 59 %. Bot near-loss share of sensible fails: N 83 % (5/6), SH 100 % (4/4). Rescue offered on bot near-loss fails: SH 50 % (4/8).
