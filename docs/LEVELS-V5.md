# City Blast!: level book V5 (08/11/2026)

**Written** 2026-11-08 by the `game-designer` subagent, applying `.claude/skills/game-designer/SKILL.md`.
**Status: PROTOTYPE, built and bot-validated in a copy.** `games/blast/index.html` was not edited (the style pass owns it). The copy is `scratchpad/levels5/index.html`; data is `scratchpad/levels5/src/levels-v5.js` (+ `levels-v5.json` for the bots); the merge recipe is `scratchpad/levels5/PORT.md` (one script, 13 anchored hooks).
**Companion:** `LANDMARKS-V2.md` (the long list, the shortlist, the risk tiers, Owner's 08/11 HIGH-risk decision).

**Owner's brief (via the Lead):** (1) more lookalike landmarks; (2) replace the monotone single-tower levels, but not every level becomes multi-building; (3) early levels introduce each obstacle and charge one by one. Levels are endless; themes A/B/C rotate by level (1–10 A, 11–20 B, 21–30 C, then again); no district names.

---

## 1. What changed, in one screen

- **36 levels** (was 18). **L1–L20 = onboarding**: 13 elements, each with a NEW! card, a trivially safe first use, and a later level that uses it again. Every boss in onboarding (L10, L15, L20) only combines taught elements.
- **After L20:** a boss every 5th level (L25, L30, L35, all landmarks), a labelled Hard right after each relief (L22, L27, L32; never right before a boss), a relief level after every boss (L21, L26, L31, L36), and a landmark on roughly every 2nd–3rd level.
- **Round 2 (§11):** the Lead's six fixes and Owner's three additions: 13 plain frames dressed (awnings, balconies, roof tanks, signs), a near-loss metric (`NEAR-MISS.md`), Hard/boss tuning toward it.
- **21 landmarks** in 36 levels: the 6 existing ones re-slotted + **15 new** (12 built here; see LANDMARKS-V2 §2).
- **Multi-structure scenes on 6 of 36 levels** (L3, L11, L18, L22, L27, L35), plus 2 multi-part bridges (L25, L33). Most levels stay single-building, as Owner asked.
- **The Cluster is finally used** (taught L14, reused L18). It now pops in a deterministic **row along the wall** (`CHARGES.clus.row`), so it has one readable job: "one charge, a whole row of thin posts". It is too weak for stone, steel or piers.
- **Retired:** Panel Block, Steel Frame, Parking Garage (monotone single towers; their lessons live on in other levels). Twin Flats became Long Flats (the waves teach).

## 2. Feature schedule (game-designer §2)

Order follows the brief, with two justified swaps: **fuel before steel** (fuel is a TNT-only relief after the L10 boss, so the Cutter does not land on a relief), and **Cluster before the steel core** (the Cluster needs only TNT-weak columns; the core needs the Cutter to be second nature first).

| # | Element | What it does (1 line) | Telegraph | Teach (NEW! card) | Reused / twist | Combine (boss/Hard) |
|---|---|---|---|---|---|---|
| 1 | TNT basics | tap a member, BLAST | red chip, hand pointer | **L1** (no card: toy first, ONBOARDING-PLAN D-O1) | L2 | everywhere |
| 2 | Aim low | ground floor drops the most | hand on floor 0 | **L2** | L3–4 | — |
| 3 | 2 charges | both fire together | two sheds, one charge each | **L3** (multi-structure) | L4 | — |
| 4 | Waves | leftover charges blast again | "Wave 1/2" pill | **L4** | L6, L9 (3 waves) | L10 |
| 5 | Glass | shatters, holds nothing up | blue panes, yellow posts | **L5** | L12, L17, L20, L28 | L20 |
| 6 | Protected neighbour | > 10 % damage fails | blue roof + gold shield | **L6** | L7, L8 | L10, L15 |
| 7 | Street | > limit of rubble on it fails | yellow kerb, live street meter | **L7** | L8, L9 | L10, L15 |
| 8 | Stone / shear wall | TNT only cracks it | stone colour, crack decal | **L9** | L24 (walls steer), L26 (thick piers) | L24 |
| 9 | Fuel barrel chain | one barrel sets off the line | red barrels in a line | **L11** (relief) | — (candidate L22+ fuel twist, §8) | — |
| 10 | Steel + Cutter | Cutter slices steel, TNT can't | gunmetal members, Cutter chip | **L12** | L13 (back legs), L23 | L15 |
| 11 | Cluster | a row of small pops along the wall | violet/teal chip, capsule ghost | **L14** | L18 (row houses) | — (L22+ candidate) |
| 12 | Steel core | core stands until it is cut | grey core column | **L17** | — | L20 |
| 13 | Transfer floor / outrigger (piers) | top floors sit on big piers; the truss band shrugs TNT | thick piers, deep truss band | **L19** | L29 (Hard) | L20 (belt floor) |

Cadence: 13 elements in 19 levels (one per level or every 2 levels, as the brief asks; the skill's "every 2–4" is tighter in L1–L9 on purpose: the first five are tiny verbs). No element is new on a Hard or boss. Every teach level is T, R or an early N.

## 3. The curve (L1–36), round 2 (after the Lead's fixes and Owner's three additions, 08/11)

> **Superseded in places by round 3 (§12):** L26 is now Annex & Bridge (R), L27 The Long Drink (H), L28 Shop House (N); several budgets/PASS values changed (§12.1). The current per-level human-model and tier numbers are in §12.2; bot totals in §12.3.

Tier: T tutorial · N normal · H labelled Hard · SH boss · R relief. **Look**: "dressed frame" = a frame building with light decor (awning, balconies, roof tank, sign, cornice; §11 A); "landmark"; "LM scene" / "multi scene" = several structures. Bot columns: `src/nearmiss.js` (= `tools/bots.js` + metrics), 4 seeds per bot; near-loss as defined in `NEAR-MISS.md` (a fail within 10 points of its limit).

| L | Name | Tier | Look | New / idea | Budget · waves · PASS | Expert (min %) | Sensible pass | Sensible near-loss (of fails) | Naive pass |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Garden Shed | T | dressed frame |  | 1 TNT · 1 · 80 % | 4/4 (98) | 4/4 | – | 4/4 |
| 2 | Narrow House | T | dressed frame | **NEW: AIM LOW** | 1 TNT · 1 · 80 % | 4/4 (96) | 4/4 | – | 4/4 |
| 3 | Twin Sheds | T | multi scene | **NEW: 2 CHARGES** | 2 TNT · 1 · 80 % | 4/4 (83) | 4/4 | – | 4/4 |
| 4 | Long Flats | T | dressed frame | **NEW: WAVES** | 3 TNT · 2 · 80 % | 4/4 (89) | 4/4 | – | 4/4 |
| 5 | The Jelly Mould | T | landmark | **NEW: GLASS** | 3 TNT · 2 · 80 % | 4/4 (85) | 4/4 | – | 4/4 |
| 6 | Corner Shop | N | dressed frame | **NEW: PROTECTED** | 3 TNT · 2 · 80 % | 4/4 (92) | 4/4 | – | 4/4 |
| 7 | Tube House | N | dressed frame | **NEW: STREET** | 2 TNT · 2 · 80 % | 4/4 (97) | 4/4 | – | 1/4 |
| 8 | The Slouch | N | landmark |  | 3 TNT · 2 · 80 % | 4/4 (88) | 4/4 | – | 0/4 |
| 9 | Stone Facade | N | dressed frame | **NEW: STONE WALL** | 4 TNT · 3 · 80 % | 4/4 (87) | 4/4 | – | 2/4 |
| 10 | Grandpa Gong | SH | landmark |  | 3 TNT · 2 · 80 % | 4/4 (86) | 4/4 | – | 0/4 |
| 11 | Fuel Yard | R | multi scene | **NEW: FUEL** | 1 TNT · 1 · 80 % | 4/4 (84) | 4/4 | – | 4/4 |
| 12 | Bus Depot | N | dressed frame | **NEW: CUTTER** | 2 Cut + 1 TNT · 2 · 80 % | 4/4 (88) | 4/4 | – | 0/4 |
| 13 | Thirsty Bertha | N | landmark |  | 2 Cut + 1 TNT · 2 · 80 % | 4/4 (96) | 4/4 | – | 0/4 |
| 14 | The Old Exchange | N | landmark | **NEW: CLUSTER** | 1 Clus + 1 TNT · 1 · 80 % | 4/4 (100) | 4/4 | – | 4/4 |
| 15 | Old Rivets | SH | landmark |  | 2 Cut + 2 TNT · 2 · 80 % | 4/4 (96) | 4/4 | – | 0/4 |
| 16 | Five Hats | R | landmark |  | 3 TNT · 2 · 80 % | 4/4 (95) | 4/4 | – | 4/4 |
| 17 | Steel Spine | N | dressed frame | **NEW: STEEL CORE** | 1 Cut + 2 TNT · 1 · 80 % | 4/4 (89) | 4/4 | – | 2/4 |
| 18 | The Tipsy Row | N | LM scene |  | 1 Clus + 2 TNT · 2 · 80 % | 4/4 (90) | 4/4 | – | 0/4 |
| 19 | Market Hall | N | dressed frame | **NEW: PIERS** | 3 TNT · 2 · 80 % | 4/4 (91) | 4/4 | – | 4/4 |
| 20 | The Corkscrew | SH | landmark |  | 1 Cut + 3 TNT · 2 · 92 % | 4/4 (100) | 4/4 | – | 0/4 |
| 21 | Old Whirly | R | landmark |  | 3 TNT · 2 · 80 % | 4/4 (99) | 4/4 | – | 4/4 |
| 22 | Brutalist Tower | H | dressed frame |  | 1 Cut + 3 TNT · 3 · 80 % | 4/4 (95) | 3/4 | 0/1 | 0/4 |
| 23 | Lantern Lane | N | multi scene |  | 3 TNT · 2 · 80 % | 4/4 (97) | 4/4 | – | 0/4 |
| 24 | The Lollipop | N | landmark |  | 2 Cut + 2 TNT · 2 · 80 % | 4/4 (98) | 4/4 | – | 0/4 |
| 25 | The Drawbridge | SH | landmark |  | 4 TNT · 2 · 84 % | 4/4 (89) | 0/4 | 4/4 | 0/4 |
| 26 | The Long Drink | R | landmark |  | 3 TNT · 2 · 80 % | 4/4 (94) | 4/4 | – | 0/4 |
| 27 | Shop House | H | dressed frame |  | 2 TNT · 2 · 72 % | 4/4 (75) | 3/4 | 1/1 | 0/4 |
| 28 | Annex & Bridge | N | multi scene |  | 4 TNT · 2 · 80 % | 4/4 (94) | 4/4 | – | 0/4 |
| 29 | Stripey | N | landmark |  | 3 TNT · 2 · 80 % | 4/4 (88) | 4/4 | – | 0/4 |
| 30 | The Stepper | SH | landmark |  | 4 TNT · 2 · 80 % | 4/4 (94) | 4/4 | – | 0/4 |
| 31 | Laundry Block | R | dressed frame |  | 3 TNT · 3 · 80 % | 4/4 (94) | 4/4 | – | 4/4 |
| 32 | The Doorstop | H | landmark |  | 2 TNT · 2 · 80 % | 4/4 (97) | 4/4 | – | 0/4 |
| 33 | Lazy Wheel | N | landmark |  | 3 TNT · 2 · 80 % | 4/4 (99) | 4/4 | – | 4/4 |
| 34 | The Hammock | N | landmark |  | 4 TNT · 2 · 80 % | 4/4 (86) | 4/4 | – | 0/4 |
| 35 | The Surfboard | SH | LM scene |  | 5 TNT · 2 · 80 % | 4/4 (98) | 4/4 | – | 0/4 |
| 36 | The Seashells | R | LM scene |  | 5 TNT · 2 · 80 % | 4/4 (97) | 4/4 | – | 0/4 |

**Sawtooth (round 2):** … SH(20) → R(21) → **H(22)** → N → N → SH(25) → R(26) → **H(27)** → N → N → SH(30) → R(31) → **H(32)** → N → N → SH(35) → R(36). No H directly before a boss any more (LV5-2 applied: each Hard moved to the 2nd level of its 5-block, right after the relief).

**Threshold exceptions:** L27 Shop House 72 % (see §11 #6). L20 The Corkscrew **92 %** and L25 The Drawbridge **84 %** (near-miss tuning, `NEAR-MISS.md` §5). L13 Thirsty Bertha is back at 80 %.

## 4. NEW! cards (REPORT §4 + ONBOARDING-PLAN K1)

Full-screen card at level start, once per element ever (`save.nu[id]`), before the plan phase; the board is dimmed, taps on the board are ignored until it closes; tap anywhere after 0.6 s or the button. Then the **hand pointer** loops on the `hand` target for the first placement (the existing `stepHand`, now enabled on every intro level the first time). Never on a Hard or boss, never two before one level (bosses keep their own tag card). **Built** in the prototype (`v5Unlock()`); art is an emoji placeholder for `design`.

| L | id | Title | Line (≤ 8 words) | Mags (3–8 words) | Button | Hand target | First use is trivially safe because… |
|---|---|---|---|---|---|---|---|
| 1 | — | (none: toy first) | — | — | — | front column, then BLAST (existing) | 1 tap anywhere passes |
| 2 | aimlow | AIM LOW | Ground-floor charges drop the most. | Low hits, big drops. | GOT IT | floor-0 front | the hand is on floor 0 |
| 3 | two | 2 CHARGES | Tap twice. Both go off together. | Two sheds, two pops. | GOT IT | shed A front | one per shed passes 4/4 |
| 4 | waves | WAVES | Not down yet? Blast again. | Two shots. Don't waste one. | GOT IT | left end column | 3 TNT for a 2-TNT job; wave 2 finishes any miss |
| 5 | glass | GLASS | Glass shatters. Posts hold it up. | Pretty. Loud. Hit the posts. | GOT IT | front middle post | 3 TNT, 3 front posts |
| 6 | protected | PROTECTED | Blue roof, gold shield: keep it standing. | Hands off the bakery, Rookie! | GOT IT | left front column | bakery 4 m away (was 3 m: sensible bot 3/4 → 4/4) |
| 7 | street | STREET | Rubble past the yellow kerb fails. | Street's for buses, not bricks. | GOT IT | a back column | camera starts on the back |
| 9 | stone | STONE WALL | TNT only cracks stone. Hit the ends. | Stone's stubborn. Go round it. | GOT IT | right end column | the tip names all 3 charges |
| 11 | fuel | FUEL | Pop one barrel, the whole line goes. | Free bang. Mind where it goes. | GOT IT | the far barrel | the barrel is in the open; relief, no hazards |
| 12 | cutter | CUTTER | Slices steel that TNT can't touch. | Steel laughs at TNT. Not this. | TRY IT | Cutter chip → right column | any 2 Cutters pass |
| 14 | cluster | CLUSTER | One charge, a row of little pops. | Lots of little pops. Lovely. | TRY IT | middle column | Cluster pre-selected; the row covers all 7 |
| 17 | core | STEEL CORE | The core stands until you Cutter it. | That core's tough. Cutter's tougher. | GOT IT | the core | tip names both charges |
| 19 | piers | PIERS | Top floors sit on piers. Hit piers. | Big legs, big job. Find them. | GOT IT | front pier | 3 TNT for a 2-pier job, no hazards |

Reminder tips (K4) are the level tips of the reinforcing levels (L8, L13, L18, L20, L29); no card.

## 5. Validation (measured in the copy, 08/11, round 2)

- **Bots** (`tools/bots.js` logic via `src/nearmiss.js`, `BLAST_LEVELS_JSON` = `levels-v5.json`, N = 4): **expert 144/144; sensible 96 %; naive fails 62 % of L2+ runs. ALL BOT TARGETS MET.** Per level: §3 table; full metrics: `NEAR-MISS.md`.
- **Expert margins:** ≥ 3 points on every level and every bar (thinnest: L3 Twin Sheds and L27 Shop House 3 points on one seed; L5 Jelly Mould and L25 Drawbridge 5; the Doorstop's 2-point street margin was fixed).
- **Body budget** (`src/check5.js`, expert, 4 seeds): members ≤ 130 on all 36 (largest L20 111+15, L27 74+50, L22 103+20, L35 118); **peak awake ≤ 162** (L27 Shop House 162, L30 158, L18 157, L35 156, L28 153, L22 143): within the existing build's 163. Decor added 8–27 light members to the dressed levels; L4 Long Flats now peaks at 129 (was 109).
- **Intact 5 s:** 0 bonds broken, creep ≤ 0.9 cm on all 36.

## 6. Physics check and screenshots

`physics-check.js` (RUNS = 6, all 36 levels, round 2, log `scratchpad/levels5/physics2.log`): **(a)–(k) all pass**: free fall 0.781 s; (e) intact 10 s: worst creep 0.88 cm, **0 bonds broken**; (b)/(k) 2207 resting bodies after collapses, **0 unsupported (no hover)**; **(j) penetration ≤ 5 cm on every level, expert + naive, every wave**; (f) 33 m/s; (i) charge counts exact. **(l) passes on 16 of 17 protected levels; L23 Lantern Lane is a test-geometry artifact**: the tea house stands between two targets, so the tool's thrown block spawns inside target B. Checked by hand: dropping both houses onto the tea house damages it 60–90 % ("HIT THE TEA HOUSE!"), penetration 0.5 cm. Tool lever: throw from −z when a keep has targets on both sides.

**Screenshots** (430 × 932, round 2, all 36 levels): `scratchpad/levels5/shots/NN-Name-rest.png` and `NN-Name-mid.png`, plus `card-cluster-L14.png` / `card-cluster-L14-closed.png`. Contact sheets: `sheet-dressed.png`, `sheet-dressed2.png` (the 13 dressed levels), `sheet-fix.png` (Lollipop, Seashells, Corkscrew, Lazy Wheel, Doorstop, Bertha), `sheet-rest-*.png` / `sheet-mid.png` (round 1). My look-check, round 2:

| L | Reads as "inspired by"? | Clearly not a replica? | Note |
|---|---|---|---|
| 1–4, 6, 7, 9, 12, 17, 19, 22, 27, 31 (dressed) | — | — | no longer plain boxes: striped awnings, balcony rails, timber roof tanks, blank signs, cornices. Still frame buildings in silhouette (the lesson needs the clean column grid) |
| 24 The Lollipop | yes, strongly | yes | legs are now 4 clean straight struts (footing → waist → disc) with a waist ring: the jagged steps are gone |
| 36 The Seashells | **yes now** (pairs of forward-leaning shells with coral crest ribs) | yes (5 small shells, cream/coral, park lot, no harbour) | still stepped (boxes), reads as "shells" rather than ziggurats |
| 25 The Drawbridge | yes (2 towers + high walkway) | yes | |
| 32 The Doorstop | weakly from the back camera | yes | unchanged (start yaw shows the back) |
| others | as round 1 (LANDMARKS-V2 §3) | | |

## 7. Red flags (game-designer §7) and open items, round 2

1. **Sensible pass on bosses is per-level binary** (0/4 or 4/4: the landmark physics barely varies with the seed and the bot is a deterministic tip reader). SH tier 83 %, H tier 83 % (bands: SH 10–40 %, H 30–60 %). A 40–70 % band per level needs a human test or a population of readings, not this bot (§11 #1).
2. **Rescue covers 20 % of near-loss fails** (5/25): most near-losses are street fails, where "+1 TNT" is not offered and would not help. Owner decision (NEAR-MISS §3).
3. **"Thin pass" by the 0.5 m rule fires on most N/H passes** (debris touches without damage); 0 by the rule's own units. Recommendation in NEAR-MISS §3.
4. **Naive passes on N:** L6 Corner Shop 4/4 (teach), L19 Market Hall 4/4 (teach), L33 Lazy Wheel 4/4 (see §11 #2), L14 Old Exchange (teach).
5. **Real taps not run** (`playtest.js`, `devices.js`, `audio-check.js`): after the merge.

## 8. Mapping: old level → new slot

| Old (live 18) | Name | New slot | Status |
|---|---|---|---|
| 1 | Garden Shed | L1 | kept |
| 2 | Narrow House | L2 | kept (+ AIM LOW card) |
| 3 | Twin Flats | L4 "Long Flats" | moved + reworked (3 TNT, waves teach) |
| 4 | Tube House | L7 | moved (street teach) |
| 5 | The Slouch | L8 | moved; no longer a boss (the reinforcing level for protected + street) |
| 6 | Panel Block | — | **retired** (monotone single block; panels taught nothing new) |
| 7 | Stone Facade | L9 | moved (stone teach) |
| 8 | Shop House | L27 | moved (Hard, transfer combine) |
| 9 | Laundry Block | L31 | moved (relief) |
| 10 | Grandpa Gong | L10 | kept |
| 11 | Bus Depot | L12 | moved (Cutter teach) |
| 12 | Steel Frame | — | **retired** (monotone; its lesson "Cutter the side away from the neighbour" lives in L13/L23) |
| 13 | Steel Spine | L17 | moved (core teach) |
| 14 | Parking Garage | — | **retired** (monotone; "the whole back row" lives in L30 The Stepper) |
| 15 | Old Rivets | L15 | kept |
| 16 | Five Hats | L16 | kept |
| 17 | The Hammock | L34 | moved |
| 18 | The Corkscrew | L20 | moved (onboarding finale boss) |
| v3 | Corner Shop | L6 | back (protected teach) |
| v3 | Brutalist Tower | L22 | back (Hard) |
| new | Twin Sheds, The Jelly Mould, Fuel Yard, Thirsty Bertha, The Old Exchange, The Tipsy Row, Market Hall, Old Whirly, Lantern Lane, The Lollipop, The Drawbridge, The Long Drink, Annex & Bridge, Stripey, The Stepper, Lazy Wheel, The Doorstop, The Surfboard, The Seashells | L3, 5, 11, 13, 14, 18, 19, 21, 23, 24, 25, 26, 28, 29, 30, 32, 33, 35, 36 | new |

Save compatibility: a player on old L5–L18 lands on a different building at the same number. Proposal: keep `save.level` as is (endless numbering; nothing is lost) and show the NEW! cards for any element whose teach level is below the player's level once, on their next level start (not built).

## 9. Owner choices

| ID | Question | Options | Recommendation |
|---|---|---|---|
| LV5-1 | Cluster behaviour | A row along the wall (built, deterministic) · B the old 4 random-angle pops | **A** (readable, same plan wins every seed) |
| LV5-2 | H right before every boss | **applied (Lead 08/11):** H moved to L22, L27, L32 | done |
| LV5-3 | Thirsty Bertha threshold | **done:** back at 80 % (drum plate removed, 96 %) | done |
| LV5-4 | The Seashells | **done:** redesigned (pairs of leaning shells) | done |
| LV5-6 | Rescue on street / protected near-losses | A "Retry: plan kept" free · B a paid street/shield booster · C keep as is | **A + B** (NEAR-MISS §3) |
| LV5-5 | HIGH-risk four (Lollipop, Stepper, Surfboard, Seashells) + Corkscrew | per Owner 08/11: in game, out of all marketing until the recognisability test + lawyer | — (decided) |

## 10. Copy (Warm Crew, for `content`)

Intro (Mags) / win lines live in the data (`intro`, `win`): Jelly Mould "A wobbly glass pudding. Lovely." / "Jelly's set! Veggie patch next." · Bertha "Bertha's been thirsty since 1950." / "Bertha's had her drink. Splash pad next!" · Old Exchange "Seven skinny legs, one heavy hat." / "Stock's dropped! Market day next." · Tipsy Row "Three skinny houses, one shared shrug." / "Row's gone! Canal path next." · Old Whirly "Old Whirly's sails are tired." / "Whirly's had a lie-down. Orchard next!" · Lollipop "The Lollipop's licked. Gently now." / "Lollipop, dropped! Picnic lawn next." · Drawbridge "Two towers, one handshake. Break it." / "Bridge out! Rowing lake next." · Long Drink "Long Drink's been dry for ages." / "Bottoms up! Bike path next." · Stripey "Stripey's light went out years ago." / "Lights out, Stripey. Boardwalk next!" · Stepper "The Stepper took the stairs. All of them." / "Stepped down! Rooftop farm next." · Lazy Wheel "Lazy Wheel stopped turning in '98." / "Wheel's off! Bumper cars next." · Doorstop "The Doorstop's propped this corner long enough." / "Door's open! Corner plaza next." · Surfboard "Three towers, one big board. Wipe-out time." / "Wiped out! Skate park next." · Seashells "Three shells, nobody home." / "Shells cracked! Open-air stage next."

## 11. Round 2 (Lead 08/11: six fixes + Owner's three additions)

1. **L20 The Corkscrew, sensible 0/4.** Tip now names the order ("BOSS! Cut the steel spine, / then TNT the BACK row. / Concert hall next door.") and the sensible reading is Cutter + 2 back charges (`bot.hints`). With PASS 92 % that reading scores 91 % in wave 1 (one column short) and finishes in wave 2: **sensible 4/4, expert 100 % (margin 8)**. Why not 40–70 %: every seed gives the same result here (no random weak members in the landmark), so the deterministic bot can only score 0/4 or 4/4. Measured reading mix instead (Cutter + 1 / + 2 / + 3 back charges, one wave): fail (hall) / 91 % / 100 %, i.e. 1 of 3 plausible readings fails in wave 1, and that one is a protected-hit fail (not rescue-able).
2. **L33 Lazy Wheel, naive 4/4.** Street moved in (at 3 → 1.2 m). The naive front charges still pass (the wheel's mass is in the axle and legs, and a front charge drops it straight down). **Re-tier recommended: R** (it sits right after a relief-free N block anyway). Left as N in the data pending the owner, flagged.
3. **Hards moved** to L22 Brutalist Tower, L27 Shop House, L32 The Doorstop (each right after a relief, never right before a boss).
4. **The Seashells redesigned** (HIGH risk, accepted by Owner 08/11, light variation): 2 pairs of tall forward-leaning shells (a big one behind a smaller one) + 1 small one between, each a stack of thin layers that narrow and step forward, coral crest ribs, on a podium in a park. Kept: the leaning shell silhouette on a podium. Changed: 5 small shells, colour bands, proportions, setting. 5 TNT (one per shell, front feet), relief, expert 97 %.
5. **The Lollipop struts:** physics is 4 straight hidden steel struts (`strut` material, mesh hidden, still pickable) on footings 2.5 m out; the look is 8 clean render-only rods (footing → waist → disc) + a waist ring. Expert 98 %, 0 bonds broken intact. New hook P14 (`mesh.visible = !MEMBERS[k].hide`).
6. **80 % on L13 and L29 (now L27).** **L13 Thirsty Bertha: done**, 80 % with 96 % expert (the drum's steel plate made a half-standing pile; removed, the drum now sits on the leg tops). **L27 Shop House: not done, kept at 72 %.** Its correct plan leaves the two front piers standing (2.1 m), which the % counts as half-standing; it scores 75–79 %. Tried: +1 TNT (wave-2 charge on the front): 2/6 at 80 %; any third charge: 2–5/6 and collateral fails; 7 floors: 8/8 but 80–82 % (margin 0–2) and peak awake 165; 8 floors: 81–84 %, peak awake 176 (over budget). 80 % would need a scoring change (count a < 2.5 m stump as down) or a different level.
7. **(A) Richer looks.** Dressed (frame + awning / balconies / roof tank / sign / cornice, all light `ns` decor, < 3 % of the mass, never a column): **L1 Garden Shed, L2 Narrow House, L3 Twin Sheds (both sheds), L4 Long Flats, L6 Corner Shop, L7 Tube House, L9 Stone Facade, L12 Bus Depot, L17 Steel Spine, L19 Market Hall, L22 Brutalist Tower (roof tank only, glass 50 → 30 % to stay under the member cap), L27 Shop House, L31 Laundry Block** (13). Already replaced by landmarks or scenes in round 1: old Panel Block, Steel Frame, Parking Garage, Twin Flats (→ Long Flats, now dressed). Every other level is a landmark or a multi-structure scene. Expert % on dressed levels unchanged within ±5 points (L4 89–100, L9 87–97).
8. **(B) Near-loss metric:** `NEAR-MISS.md` (definitions, targets with sources, per-level table, tier totals).
9. **(C) Hard/boss tuning:** L20 PASS 92 %, L25 PASS 84 % (sensible now fails 3 points short, rescue offered 4/4), L32 expert plan fixed (2-point street margin → 7). **Rescue offered on 5 of 25 near-loss fails (20 %)**: the other 20 are street fails, where the game offers no rescue (owner choice LV5-6).


## 12. Round 3 (independent playtest 08/11 → Lead's fix list)

Validation now uses the playtest's **human-like player model** (`games/blast/levels5/playtest/human.js`). My round-3 copy, with the READ table updated for the new tips, the new L26–28 order and the multi-step hand, is `scratchpad/levels5/playtest-r3/human.js`. It runs 3 personas × 12 players × up to 3 attempts × 36 levels, alongside `bots.js` (via `src/nearmiss.js`) and `physics-check.js`.

### 12.1 What changed
1. **Charge height snap (P15).** Every charge sits at the lower third of its member (−0.3 of the half height, the bots' height) whatever the tap height; the hand points at exactly that spot (P12b). Tap height no longer changes the outcome: bots and humans use the same charge spot.
2. **Onboarding L1–10.** L3: the hand marks shed A, then shed B. Decor never takes a charge (P16: a tap on decor goes to the nearest structural member), and no awning hides a hand target (L1, L3, L4 lost their awnings; balconies, tanks and signs stay). L4 budget 3 → 4 TNT. L5 PASS 80 → **70 %** (the intended plan scores 85 % on every seed; the fallen rings pile up and count as half-standing). L7 unchanged (it was a tap-height victim). L8 The Slouch: street 3 → 5 m and 12 → 15 %, plus a **hand-only reminder** on the first visit (`L.remind`, ONBOARDING-PLAN K4, no card). L9 street 3 → 3.5 m.
3. **The NEW! card selects the new charge** (`v5UnlockClose`: Cutter on L12, Cluster on L14, Cutter on L17). Steel-only fails read **"TNT can’t break grey steel — use the Cutter"** (P18). L13 Thirsty Bertha and L24 The Lollipop now start with the Cutter selected; L13 budget 2 → 3 Cutters.
4. **L20 The Corkscrew.** PASS 92 → **85 %**, concert hall 3 → **4.5 m**, tip "BOSS! Cutter the spine, / TNT the BACK row." Following the tip passes (expert 90 %).
5. **Re-tier L26–28:** L26 **Annex & Bridge (R)**; L27 **The Long Drink (H**, tip "HARD JOB. Stone piers / break only where hit.", budget 3 → 4 TNT); L28 **Shop House (N**, neighbours 0.4 → 1.0 m, glass 60 → 40 %).
   **Easy bosses:** **L15** PASS 85 % (Lead's lever; measured 67 % average first try) → **90 %**. **L30** street 10 % (Lead's lever; left it at 67 %) + PASS 90 % + budget 4 → 3. **L35** budget 4 (Lead's lever; 92 %) → 3 + PASS 95 %. Also L32 The Doorstop PASS 90 %; L22 Brutalist library 1.6 → 2.4 m and PASS 88 %; L18 Tipsy Row +1 TNT (the tip names it); L19 Market Hall +1 TNT.
6. **Tips ≤ 2 lines at 430 × 932 on all 36** (measured in the real DOM with `src/tiplines.js`: the tip box has 187 px of text width). **L11 hand on-screen**: a decor warning post next to the far barrel makes the camera frame the whole barrel line (`src/handcheck.js`: hand at (141, 635); a real tap puts TNT on the far barrel). The fail card can no longer read "12 % / 12 %" (P17 compares the shown whole percent).
7. **Fail-detection grace (P17, NEAR-MISS §7):** street rubble counts once its centre is 0.4 m past the kerb; a protected member counts as hit once moved 0.9 m (was 0.6 m).

### 12.2 Human model, round 3 (12 players per persona; first-try pass and pass within 3 attempts)

| L | Name | Tier | First-try pass c / a / s (%) | Band | Pass ≤ 3 c / a / s (%) | Near-loss share of fails (all personas) | Fail codes |
|---|---|---|---|---|---|---|---|
| 1 | Garden Shed | T | 100 / 100 / 92 | ≥90 | 100 / 100 / 100 | 0 % (0/2) | pct 2 |
| 2 | Narrow House | T | 100 / 100 / 100 | ≥90 | 100 / 100 / 100 | – | – |
| 3 | Twin Sheds | T | 92 / 100 / 100 | ≥90 | 100 / 100 / 100 | 0 % (0/2) | pct 2 |
| 4 | Long Flats | T | 92 / 100 / 92 | ≥90 | 100 / 100 / 100 | 50 % (1/2) | pct 2 |
| 5 | The Jelly Mould | T | 92 / 92 / 92 | ≥90 | 100 / 100 / 100 | 100 % (4/4) | pct 4 |
| 6 | Corner Shop | N | 83 / 92 / 92 | 60–85 | 100 / 100 / 100 | 20 % (1/5) | pct 4, collateral 1 |
| 7 | Tube House | N | 92 / 92 / 100 | 60–85 | 100 / 100 / 100 | 50 % (1/2) | street 2 |
| 8 | The Slouch | N | 58 / 83 / 92 | 60–85 | 100 / 100 / 100 | 18 % (2/11) | street 7, pct 3, collateral 1 |
| 9 | Stone Facade | N | 75 / 75 / 92 | 60–85 | 100 / 100 / 100 | 50 % (4/8) | street 5, pct 2, collateral 1 |
| 10 | Grandpa Gong | SH | 33 / 42 / 83 | 15–30 | 100 / 92 / 100 | 22 % (6/27) | pct 18, collateral 6, street 3 |
| 11 | Fuel Yard | R | 92 / 100 / 100 | ≥90 | 100 / 100 / 100 | 0 % (0/1) | pct 1 |
| 12 | Bus Depot | N | 100 / 92 / 100 | 60–85 | 100 / 100 / 100 | 100 % (1/1) | pct 1 |
| 13 | Thirsty Bertha | N | 42 / 50 / 100 | 60–85 | 92 / 100 / 100 | 20 % (4/20) | pct 12, street 4, collateral 4 |
| 14 | The Old Exchange | N | 100 / 92 / 100 | 60–85 | 100 / 100 / 100 | 0 % (0/1) | pct 1 |
| 15 | Old Rivets | SH | 17 / 42 / 92 | 15–30 | 58 / 92 / 100 | 55 % (21/38) | pct 34, street 2, collateral 2 |
| 16 | Five Hats | R | 92 / 83 / 100 | ≥90 | 100 / 100 / 100 | 100 % (3/3) | pct 3 |
| 17 | Steel Spine | N | 67 / 83 / 92 | 60–85 | 100 / 100 / 100 | 58 % (7/12) | pct 6, core 6 |
| 18 | The Tipsy Row | N | 33 / 92 / 67 | 60–85 | 100 / 100 / 100 | 50 % (8/16) | pct 10, street 6 |
| 19 | Market Hall | N | 58 / 100 / 92 | 60–85 | 100 / 100 / 100 | 86 % (6/7) | pct 7 |
| 20 | The Corkscrew | SH | 67 / 42 / 75 | 15–30 | 92 / 100 / 100 | 10 % (2/20) | core 3, street 8, collateral 8, pct 1 |
| 21 | Old Whirly | R | 83 / 100 / 100 | ≥90 | 100 / 100 / 100 | 0 % (0/2) | pct 2 |
| 22 | Brutalist Tower | H | 50 / 50 / 92 | 30–50 | 83 / 100 / 100 | 26 % (5/19) | pct 1, collateral 10, core 5, street 3 |
| 23 | Lantern Lane | N | 58 / 67 / 100 | 60–85 | 100 / 100 / 100 | 0 % (0/9) | street 2, pct 4, collateral 3 |
| 24 | The Lollipop | N | 58 / 67 / 92 | 60–85 | 75 / 92 / 100 | 16 % (3/19) | pct 7, street 9, collateral 3 |
| 25 | The Drawbridge | SH | 33 / 17 / 50 | 15–30 | 67 / 83 / 92 | 43 % (20/46) | street 16, pct 30 |
| 26 | Annex & Bridge | R | 83 / 75 / 83 | ≥90 | 100 / 100 / 100 | 71 % (5/7) | pct 3, street 4 |
| 27 | The Long Drink | H | 17 / 42 / 67 | 30–50 | 50 / 92 / 100 | 21 % (9/42) | pct 42 |
| 28 | Shop House | N | 17 / 83 / 75 | 60–85 | 92 / 100 / 100 | 30 % (6/20) | pct 16, collateral 2, street 2 |
| 29 | Stripey | N | 67 / 75 / 83 | 60–85 | 100 / 92 / 100 | 50 % (6/12) | pct 1, collateral 4, street 7 |
| 30 | The Stepper | SH | 58 / 67 / 75 | 15–30 | 100 / 100 / 100 | 19 % (3/16) | collateral 9, pct 5, street 2 |
| 31 | Laundry Block | R | 83 / 92 / 100 | ≥90 | 100 / 100 / 100 | 0 % (0/3) | pct 3 |
| 32 | The Doorstop | H | 33 / 67 / 75 | 30–50 | 100 / 100 / 100 | 16 % (3/19) | pct 16, collateral 1, street 2 |
| 33 | Lazy Wheel | N | 83 / 67 / 83 | 60–85 | 100 / 100 / 100 | 100 % (10/10) | pct 9, street 1 |
| 34 | The Hammock | N | 92 / 92 / 92 | 60–85 | 100 / 100 / 100 | 0 % (0/3) | pct 3 |
| 35 | The Surfboard | SH | 17 / 42 / 83 | 15–30 | 67 / 100 / 100 | 33 % (10/30) | pct 29, street 1 |
| 36 | The Seashells | R | 75 / 92 / 83 | ≥90 | 100 / 100 / 100 | 57 % (4/7) | pct 7 |

| Tier | First-try c / a / s | Band | Pass ≤ 3 c / a / s | Near-loss share of fails |
|---|---|---|---|---|
| T | 95 / 98 / 95 | ≥90 | 100 / 100 / 100 | 50 % (5/10) |
| N | 68 / 81 / 91 | 60–85 | 97 / 99 / 100 | 38 % (59/156) |
| R | 85 / 90 / 94 | ≥90 | 100 / 100 / 100 | 52 % (12/23) |
| H | 33 / 53 / 78 | 30–50 | 78 / 97 / 100 | 21 % (17/80) |
| SH | 38 / 42 / 76 | 15–30 | 81 / 94 / 99 | 35 % (62/177) |

L1–10 first-try c/a/s: 82 / 88 / 93 · L1–9 (without the L10 boss): 87 / 93 / 94


**Against the bands:**
- T 95 / 98 / 95 ✔ (≥ 90).
- **Onboarding L1–9 87 / 93 / 94 ✔; L1–10 with the L10 boss 82 / 88 / 93** (the boss at 42 % average pulls it under 90).
- N 68 / 81 / 91 ✔ (60–85; skilled above).
- R 85 / 90 / 94 (average on the line; L26 Annex & Bridge at 75 % average is the weak relief).
- **H 33 / 53 / 78** (band 30–50: average 3 points high).
- **SH 38 / 42 / 76** (band 15–30: still high). L25 17 % is in band; L10, L15, L20, L35 are at 42 %; L30 at 67 %.
- **L20 Corkscrew:** average first try **42 %** (target 15–30 %: high), pass within 3 attempts **100 %** (target ≥ 60 % ✔). It was 8 % / 25 %.

Progression (average persona, first try): playtest 69 % overall and 71 % on L1–10 → round 3a 79 % on L1–10 → **final 88 % on L1–10 (93 % on L1–9)**.

### 12.3 Bots and physics (round 3)
- **Bots** (N = 4): expert **144/144**; sensible **93 %**; naive fails **59 %** of L2+ runs (owner target ≥ 60 %: **1 point short**; the easier onboarding and the fail grace let naive taps pass more teach levels, by design for T/R).
- **physics-check** (RUNS = 6, all 36): (a)–(k) pass: 0 bonds broken intact, 0 unsupported bodies among 2,324 resting after collapses, penetration ≤ 5 cm on every level and plan, max speed 34 m/s. (l) passes on 16 of 17; L23 Lantern Lane is the known test-geometry artifact (§6).
- **Body budget:** members ≤ 130; peak awake ≤ 168 (L28 Shop House with the wider gaps is 5 over the existing 163; lever: glass 40 → 25 %).

### 12.4 Open after round 3
1. **Bosses are still too kind** for the 15–30 % band (average 42 %). Each got one or two levers. The next lever per boss is the tip: bosses name only hazards, so the model's readers infer the plan only 50 % of the time.
2. **Near-loss share on H/SH is still 21 % / 35 %** (target 50–60 %). The fails changed shape: street and protected fails more than 10 points over their limit fell (H 13 of 80 fails, SH 41 of 177), and most non-close fails are now far `pct` misses from a wrong plan (no tip read, TNT on steel). See NEAR-MISS §7.
3. Naive bot 59 % (1 point under the owner target).
4. L13 Thirsty Bertha 50 % average (N band 60–85); L18 and L28 casual 17–33 %.

## 13. Round 4 (Owner: game feel): BONUS structures and domino chains

**Idea (game-designer §0.10 "protect the payoff", §5 density/hierarchy):** around the job, put light structures that tip over easily, where a well-planned fall reaches them. When the target lands it knocks them over in a chain: more TIMBER moments, a continuous domino. They are **bonus**: never part of the %, the street share or any plan; each group that topples pays bonus coins (3 × coinBase, ×1.5 on bosses), adds a combo step and pops "TIMBER!". A gold **"+" coin tag** floats over each group (no shield, no %), so nobody reads them as protected (those get rooftop signs in the merge). Protected buildings now use only **the hospital / the school / the library / the town hall** (Owner 08/11); all tips, unlock lines and fail names in the data were renamed.

**Kit** (`V5_BTYPE`, light `masonry`-bonded members, 350–900 kg/m³): `scaffold` (2–3 levels of ladder frames + planks), `billboard` (2 posts + a top-heavy board), `tank` (stand + timber tank), `containers` (2–3 stacked empty boxes), `chimney` (6 thin brick drums), `crane` (4–5 mast sections + jib + counterweight, lattice rods), `stall` (market stall with a striped canopy). Placement data: `bonus:[{t, side, at, off, n}]` = which face of the target the planned fall goes to, the gap from it, a shift along it.

**Rules applied:**
- Placed on the side the tip's plan drops the target (left legs → left, back row → back); a 1.2–2.5 m gap for the first piece, chains spaced so each piece's height reaches the next.
- **Never toward a protected building or the street on N/T/R levels**: every set is on the free side; bonus rubble is excluded from the street share anyway (P20), so a bonus can never fail a level. On H/SH I also kept chains away from protected buildings (no deliberate tension chain this round: simpler to keep fair; candidate for L25/L35 later).
- They sleep until something hits them (BLAST does not wake them, P23): **peak awake ≤ 161 on every level** (budget 163). Where a set pushed a level over, decoration went first: L35 Surfboard glass 20 → 0 % and its chimney dropped, L18 Tipsy Row glass 60 → 40 % and one stall dropped, L30 Stepper glass 25 → 10 % and the chimney dropped (it also chained into a neighbour on 1 seed).
- **Coverage, varied:** 27 of 32 levels from L4 on have a set. Clean for contrast: L5 Jelly Mould, L11 Fuel Yard (its own chain), L14 Old Exchange, L23 Lantern Lane, L27 Long Drink, L34 Hammock. Small lines of stalls (L4, L16, L19, L21, L31, L33, L36), one big piece (L7, L9, L13, L17, L26, L28, L32), domino lines (L8 three scaffolds, L12 billboard + stalls, L15 crane + 2 scaffolds), and the biggest sets on bosses (L10 chimney + crane + containers, L20 containers + crane + chimney, L25 2 scaffolds + containers, L30 crane + containers, L35 crane + containers + scaffold).

**Measured** (expert combo events = `comboEvent` calls per run, `check5` 3 seeds, before = the same build with the round-3 data; bots `nearmiss.js` N = 4; human model `playtest-r3/human.js` 3 personas × **6 players**, before = the round-3 run's players 0–5, the same seeds):

| L | Name | Tier | Bonus set | Combo events, expert (before → after) | Bonus topples / groups: expert · sensible · naive (mean per run) | Human bonus topples per attempt (c / a / s) | Human first-try pass, before → after (c / a / s, %, 6 players) |
|---|---|---|---|---|---|---|---|
| 1 | Garden Shed | T | — | 11.3 → 11.3 | — | — | 100/100/100 → 100/100/100 |
| 2 | Narrow House | T | — | 21.0 → 21.0 | — | — | 100/100/100 → 100/100/100 |
| 3 | Twin Sheds | T | — | 17.3 → 17.3 | — | — | 83/100/100 → 83/100/100 |
| 4 | Long Flats | T | stall, stall, stall | 29.3 → 33.0 | 2.3 · 1.5 · 1.5 / 3 | 3.0 / 2.7 / 3.0 | 100/100/100 → 83/83/100 |
| 5 | The Jelly Mould | T | — | 6.0 → 6.0 | — | — | 100/83/83 → 100/83/83 |
| 6 | Corner Shop | N | scaffold3, billboard | 23.0 → 26.3 | 2.0 · 2.0 · 0.3 / 2 | 2.0 / 2.0 / 2.0 | 83/100/83 → 100/100/100 |
| 7 | Tube House | N | tank | 26.7 → 27.7 | 1.0 · 1.0 · 1.0 / 1 | 1.0 / 0.9 / 1.0 | 83/83/100 → 83/83/100 |
| 8 | The Slouch | N | scaffold3, scaffold3, scaffold2 | 38.0 → 53.0 | 3.0 · 3.0 · 0.0 / 3 | 2.2 / 2.4 / 2.7 | 50/67/83 → 67/67/83 |
| 9 | Stone Facade | N | containers3 | 18.3 → 20.0 | 1.0 · 1.0 · 1.0 / 1 | 1.0 / 1.0 / 1.0 | 83/50/83 → 83/100/83 |
| 10 | Grandpa Gong | SH | chimney6, crane4, containers2 | 47.0 → 32.0 | 3.0 · 3.0 · 0.0 / 3 | 1.1 / 1.4 / 2.9 | 17/33/83 → 17/33/83 |
| 11 | Fuel Yard | R | — | 19.7 → 19.7 | — | — | 83/100/100 → 83/100/100 |
| 12 | Bus Depot | N | billboard, stall, stall | 18.7 → 26.3 | 3.0 · 1.0 · 1.3 / 3 | 2.7 / 2.1 / 2.2 | 100/83/100 → 100/83/100 |
| 13 | Thirsty Bertha | N | containers3 | 4.0 → 4.0 | 1.0 · 1.0 · 0.0 / 1 | 0.7 / 0.9 / 1.0 | 17/50/100 → 33/67/100 |
| 14 | The Old Exchange | N | — | 0.0 → 0.0 | — | — | 100/100/100 → 100/100/100 |
| 15 | Old Rivets | SH | crane4, scaffold3, scaffold2 | 5.0 → 26.0 | 3.0 · 3.0 · 0.0 / 3 | 1.3 / 1.8 / 2.4 | 17/50/83 → 33/67/50 |
| 16 | Five Hats | R | stall, stall | 24.0 → 25.0 | 2.0 · 2.0 · 2.0 / 2 | 1.9 / 1.8 / 1.7 | 100/83/100 → 83/100/100 |
| 17 | Steel Spine | N | scaffold3 | 20.3 → 21.7 | 1.0 · 1.0 · 0.5 / 1 | 0.8 / 0.7 / 1.0 | 67/83/100 → 67/83/100 |
| 18 | The Tipsy Row | N | stall, stall | 31.7 → 29.3 | 2.0 · 2.0 · 2.0 / 2 | 2.0 / 2.0 / 1.9 | 17/100/67 → 33/50/67 |
| 19 | Market Hall | N | stall, stall, stall | 29.0 → 33.7 | 3.0 · 3.0 · 3.0 / 3 | 3.0 / 2.8 / 3.0 | 67/100/100 → 67/100/100 |
| 20 | The Corkscrew | SH | containers3, crane4, chimney6 | 51.0 → 55.0 | 3.0 · 3.0 · 0.0 / 3 | 1.9 / 1.5 / 2.0 | 83/33/50 → 67/17/67 |
| 21 | Old Whirly | R | stall, stall | 11.0 → 13.0 | 2.0 · 2.0 · 2.0 / 2 | 2.0 / 1.7 / 2.0 | 83/100/100 → 83/100/100 |
| 22 | Brutalist Tower | H | scaffold3, scaffold3 | 34.7 → 43.7 | 2.0 · 2.0 · 0.3 / 2 | 1.9 / 1.9 / 1.7 | 67/83/100 → 50/67/83 |
| 23 | Lantern Lane | N | — | 17.0 → 17.0 | — | — | 67/50/100 → 67/50/100 |
| 24 | The Lollipop | N | billboard, stall | 9.0 → 14.0 | 2.0 · 2.0 · 0.0 / 2 | 1.4 / 1.1 / 2.0 | 50/67/100 → 33/50/83 |
| 25 | The Drawbridge | SH | scaffold3, scaffold3, containers3 | 13.0 → 24.0 | 2.0 · 3.0 · 2.0 / 3 | 2.2 / 2.0 / 2.2 | 67/33/0 → 33/17/0 |
| 26 | Annex & Bridge | R | containers2 | 29.0 → 31.3 | 1.0 · 1.0 · 0.0 / 1 | 0.8 / 0.9 / 0.9 | 83/67/83 → 50/67/83 |
| 27 | The Long Drink | H | — | 0.0 → 0.0 | — | — | 17/50/50 → 33/50/50 |
| 28 | Shop House | N | tank | 30.0 → 33.7 | 1.0 · 1.0 · 0.3 / 1 | 0.8 / 1.0 / 1.0 | 17/83/67 → 17/83/50 |
| 29 | Stripey | N | scaffold2, billboard | 19.0 → 16.0 | 2.0 · 2.0 · 2.0 / 2 | 1.9 / 1.7 / 1.9 | 67/50/67 → 67/50/83 |
| 30 | The Stepper | SH | crane5, containers2 | 32.0 → 32.7 | 2.0 · 1.8 · 0.0 / 2 | 1.3 / 1.5 / 1.7 | 67/83/67 → 83/100/83 |
| 31 | Laundry Block | R | stall, stall, stall | 34.0 → 41.7 | 2.8 · 2.8 · 2.8 / 3 | 2.2 / 2.7 / 2.3 | 83/83/100 → 67/100/100 |
| 32 | The Doorstop | H | scaffold3 | 17.0 → 29.0 | 1.0 · 1.0 · 1.0 / 1 | 0.8 / 1.0 / 0.9 | 17/67/67 → 33/67/67 |
| 33 | Lazy Wheel | N | stall, stall, stall | 1.0 → 9.0 | 3.0 · 3.0 · 1.0 / 3 | 3.0 / 3.0 / 3.0 | 83/83/83 → 50/83/83 |
| 34 | The Hammock | N | — | 0.0 → 0.0 | — | — | 83/100/100 → 83/100/100 |
| 35 | The Surfboard | SH | crane4, containers3, scaffold3 | 37.3 → 50.3 | 3.0 · 3.0 · 0.3 / 3 | 2.4 / 2.9 / 3.0 | 0/33/67 → 0/33/100 |
| 36 | The Seashells | R | stall, stall | 13.0 → 12.0 | 2.0 · 2.0 · 2.0 / 2 | 2.0 / 2.0 / 2.0 | 67/100/83 → 100/100/67 |

| Tier | Human first-try pass before (c / a / s) | after | Mean combo events, expert, before → after |
|---|---|---|---|
| T | 97 / 97 / 97 | 93 / 93 / 97 | 17.0 → 17.7 |
| N | 65 / 78 / 90 | 66 / 78 / 90 | 17.9 → 20.7 |
| R | 83 / 89 / 94 | 78 / 95 / 92 | 21.8 → 23.8 |
| H | 34 / 67 / 72 | 39 / 61 / 67 | 17.2 → 24.2 |
| SH | 42 / 44 / 58 | 39 / 45 / 64 | 30.9 → 36.7 |


**Reading:**
- **Bonus topples happen when the plan is right:** expert and sensible bots topple 1–3 groups on every set (mean 2.1 per run); naive bots usually 0 (their fall goes the other way), which is the intended reward. Human players topple 0.7–3.0 groups per attempt.
- **Combo events up** on most levels (tiers: N 17.9 → 20.7, H 17.2 → 24.2, SH 30.9 → 36.7; L15 Old Rivets 5 → 26, L33 Lazy Wheel 1 → 9, L25 13 → 24). Two levels went down (L10 Grandpa Gong 47 → 32: the bell now lands on the chimney instead of shattering on the ground, so fewer impact combos; L29 19 → 16).
- **PASS rates:** tier first-try pass moved −5…+6 points (T −4/−4/0, N +1/0/0, R −5/+6/−2, H +5/−6/−5, SH −3/+1/+6) against Owner's ±5. With 6 players one player is 17 points per level, so the per-level swings (e.g. L4 100 → 83, L33 casual 83 → 50) are within noise; the tier aggregates are the signal. Bots: expert 144/144, sensible 96 %, naive fails 61 %: **all bot targets met**. Sensible-bot per level is unchanged except noise on L7/L18/L25 (L7 and L18 were already 1/4 in round 3 after the tip rewrite; flagged).
- **Domino frames:** `scratchpad/levels5/shots/domino/LNN-f0…f5.png` and `LNN-strip.png` for L8, L10, L19, L20, L33, L35 (0, 40, 80, 120, 170, 230 steps after BLAST).

**physics-check (round 4, RUNS = 6, all 36):** (e) intact 10 s: 0 bonds broken (every bonus set stands; peak bond use 0.97), creep ≤ 0.88 cm; (b) 2,324 resting bodies after collapses, none unsupported; (j) penetration ≤ 5 cm everywhere; (f) 34 m/s. **Two flags:** (l) L23 is the known test-geometry artifact (§6); **(k) L13 naive plan: one 0.4 m steel-leg fragment sleeps 6 mm above a concrete footing** (bottom at 0.506 m, footing top 0.500 m) after the run: a Rapier sleep gap, not a visible hover, and not a bonus member; it did not occur in round 3 (the extra bodies change the solver order). Lever if it must be zero: `wakeAround` pad for fragments, or a final settle nudge.

**Round 4b:** L10 chimney moved out to 3.5 m (expert 89 %, 3/3 groups topple, combo 33: the drop vs 47 stayed, so the cause is not the chimney gap); the L13 sleep gap is fixed by `v5SleepFix` (wake a sleeping fragment with no contact), physics (k) green on L10/L13 in 6 runs.

**Open:** L10 combo drop (cause still to find); a deliberate tension chain toward a protected building on one boss (L25 or L35) for Owner to judge; the "+" tag needs `design` art (now a CSS coin).
