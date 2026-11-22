# Old polish: the early play slots rebuilt to the easy-pack bar (plan, 22/11)

Khai 22/11: the new easy levels E01–E06 are good; bring the old levels "from 1 to ten-something" to the same quality.
Scope (Lead, 22/11, second message): every **non-Hard, non-boss** slot of ORDER22 from 1 to 19: slots 1–7, 9, 10, 12–15, 17–19
(16 levels). Slot 8 (old L7, Hard), 11 (old L10, boss) and 16 (old L16, Hard) stay as they are.

## Rules every rebuild keeps

- **Same slot, same save, same intro role.** A rebuild *replaces* its old level in place (same appended index in `LEVELS`):
  the save entry, the best score, the seed, the intro card and its forced tap, the L1 / L2 hand all stay on that slot.
  Wiring: `src/g7hard/export-old.js` → `city-blast/release/g7-old-levels.json` → `g7hard/patch.js` (`LV7O.isO`, `order-end.js`
  puts each one in its old level's place before the reorder). **`?oldlv=1` = the old level**, for comparison.
- **Nothing before its card** (ORDER22, `check-order.js` must stay PASS): a slot uses only the elements introduced at or before it.
  Element keys (o22 audit): wood `wpost wwall wfloor`, brick `bk bkw`, concrete `concrete cpan crT`, glass `glass mglass`,
  steel `steel sdeck mcol mpost`, dark `rc rcs hrc hard7v`, stone `hard7i`, barrels `tank`; blue = a `keep6` building; rotate,
  blast in steps, trap = the level needs it. So before slot 21 there is **no glass member** (windows are decor), before 17
  **no dark pier and no heavy `hard7v` piece**, before 25 **no drums**, before 14 **the expert plan wins in one blast**.
- **Tutorial behaviour stays:** L1 hand (double tap `sol[0]`, no BLAST button), L2 hand (two legs of `sol[0]`'s face, then
  BLAST), the material cards with their forced tap (it lands on a member of `sol` of that family), the L5 → slot 5 rotate swipe.
  Every rebuild carries a `sol` (the expert plan) that the hand, the spotlight and the bots read.
- **Quality bar = the easy pack:** own g7 builder per building (block `g7 OLD POLISH` in `pipeline7/engine.js`), ordered and
  symmetric layout on one axis, side buildings ~10 m with a role, one chain wow and one realization, landmark *type* inspiration
  only, no hint, a fail line ≤ 9 words that states a principle.
- **Camera:** every normal level opens **front-on** in main (`main/sflay.js` S6: the yaw snaps to the nearest quarter), so a
  player can only reach the front row of legs until the rotate lesson (slot 5). The early rebuilds are built for that: the main
  building falls **towards the camera**, so its chain target stands in front of it on the axis, low enough that the legs show.
  A rebuilt level has no per-old-level opening override (`LV7O.orig1` = 0: `frame.js` OVR[3] was tuned for Old Tock).
- **Bars:** slots 1–3 tutorial tier (easier, fewer TNT: 5; oneBomb < 70 %; fair bot 3/3, spare ≥ 1; the expert plan wins in the
  main build; allFoot / footOnly / oneWave reported). From slot 4: LEVEL-PROCESS Normal bars: oneBomb < 70 %, fair 3/3 (or, on an
  aim / rotate level, the right face wins and the wrong faces do not), spare ≥ 2, 20–75 s, the expert plan wins in main; oneWave
  reported only (as the easy pack); "≥ 2 blasts" and the 20–75 s time do not apply before slot 14 (the steps lesson: before it a level is one blast, and one blast is quick), they are reported. Slot 1 keeps the L1 contract (one double tap wins), so its oneBomb is reported. On a level with heavy pieces (17 on) the expert plan's one blast drops the building and the heavy pieces need a second (as the easy pack); the fair bot proves the win.
- **allFoot / footOnly < 80 % — a decision for Khai (reported, not enforced, before slot 17).** The easy pack keeps "all TNT at the
  foot" under 80 % with heavy pieces that count until broken (`hard7v`, a *dark* element) and drums. ORDER22 forbids both before
  their cards (dark 17, barrels 25), and before slot 14 the lesson of every early level *is* "hit the foot" (wood, brick, concrete,
  steel-on-concrete: "break what it stands on"). So slots 1–16 report allFoot / footOnly; from slot 17 (dark piers) they are
  enforced again. Options for Khai: (A) keep this; (B) allow the heavy roof piece (`hard7v`) earlier, which moves the dark card or
  adds a "heavy piece" card (a new element: D-blast-NONEW, not built).
- **Curve:** a tip rule level jumps from 1 TNT (a cracked pier) to 2 (the building tips): that jump *is* the lesson (E02, waiting
  for Khai). Reported.

## The slots

Before shots: `OLD-POLISH-shots/before-NN.jpg` (current main, 393×852, the real LV picker, intro cards closed). After shots in each
level folder (`O<slot>/shot-*.jpg`).

| Slot | Old level (look today) | Lesson / intro it keeps | New hero (inspiration, never a copy) | Main + side buildings (role) | Wow | Realization | TNT, tier |
|---|---|---|---|---|---|---|---|
| 1 | L1 "Old Whirly": F27 windmill on 8 posts + a timber barn | wood, TNT, double tap (hand only, no words) | timber **fire-lookout tower** | lookout on 4 legs (main) · woodshed on the axis in front (the landing) · 2 log cabins (one post each) | one double tap: the 22 m tower falls across the woodshed | "one post held all that up" | 5, T |
| 2 | L2 "Stripey Point": F28 lighthouse + a row of timber boathouses | BLAST (hand: leg, leg, BLAST) + brick card | square brick **hop kiln (oast)** with a white cowl | kiln on 8 brick piers · timber cart lodge in front (landing) · 2 brick cottages | two piers side by side: the kiln pitches forward onto the lodge | one pier only cracks it; its neighbour drops it | 5, T |
| 3 | L3 "Old Tock": F01 clock tower + a stepped row (loses its expert plan under g7: 79.7 %) | concrete card ("grey columns, one TNT each") | concrete **airfield control tower** | tower on 8 grey columns · brick baggage hall in front (landing) · 2 terminal wings (concrete + brick) | the tower falls across the baggage hall, carts and cases fly | brick and concrete both take one TNT a pier: read the pair | 5, N (tutorial bars) |
| 4 | L36 "Sail Lot": F30 twin sails + blue | blue card (look spotlight: keep it safe) | brick **fire station** with a timber hose-drying tower | station + tower (main) · a school (blue) beside it · engine shed in front | the hose tower drops onto the engine shed, the school untouched | debris thrown sideways hits the blue: blast small, in front | ~7, R |
| 5 | L6 "Dome Square": F14 dome hall | rotate (swipe hand) | concrete-and-timber **cable-car station** | station on legs (main) · a blue hotel in the opening view's fall line · timber ticket hall | turned to the back, the station falls away onto the ticket hall | the front legs drop it onto the blue: turn the view | ~8, N |
| 6 | L8 "Rivet Tower": F03 lattice tower | steel card (spotlight on the concrete foot under the steel) | steel **harbour gantry crane** on concrete pedestals | crane (main) · timber warehouse it falls onto · a harbour office | the crane topples across the warehouse roof | TNT on steel does nothing; the concrete under it goes | ~8, R |
| 7 | L9 "Twin Saucer": F04 saucer | steel practice | steel **pit-head headframe** over a timber winding house | headframe (main) · winding house · 2 miners' cottages | the headframe falls along the winding house | the A-frame stands on two concrete feet | ~9, N |
| 9 | L13 "Harp Span": F17 cable bridge | concrete + steel practice | concrete **ski-jump tower** with a steel in-run | jump tower (main) · judges' tower · timber lodge | the in-run slides down across the lodge | the steel ramp follows its concrete legs | ~9, R |
| 10 | L14 "Stripey Light": F28 lighthouse (reuse) | wood + brick + concrete + steel | seaside **pier pavilion** on steel legs | pavilion on the pier (main) · brick entrance kiosks · timber bathing huts | the pier deck folds bay by bay | concrete piles carry the steel | ~10, N |
| 12 | L21 "The Stepper": F22 stepped tower | Wrecking Ball card (first use) | timber-and-steel **drive-in cinema screen** | screen on a steel frame (main) · concrete projection booth · snack bar | the Ball swings through the screen, it falls on the snack bar | the Ball reaches what TNT cannot | ~9, R |
| 13 | L15 "The Sail": F30 twin sails | wood + concrete + steel practice | concrete **monorail station** on a steel-and-concrete viaduct | station (main) · viaduct spans · kiosks | the station drops and pulls the viaduct span after it | one span leans on the next | ~10, N |
| 14 | L11 "Shell Hall": F05 shell hall | "Blast again!" (blast in steps), blue | **seaside hotel** with a roof sign | hotel (main, lower block + upper block) · blue house · beach cabins | the lower block folds, the upper block lands whole: the second blast | one blast is not always enough | ~9, R |
| 15 | L19 "Cube Grove": F35 cube houses | brick + concrete + steel practice | brick-and-steel **gasholder** with its guide frame | guide frame + brick drum (main) · valve house · retort house | the steel frame folds onto the retort house | the steel stands on brick piers | ~10, N |
| 17 | L17 "The Pedestal": F21 pedestal | dark pier card ("reinforced concrete takes more TNT") | multi-storey **car park** with dark piers | car park (main, rc corner piers) · ramp tower · booth | the decks pancake one on the next | a dark pier needs more than one TNT | ~10, R |
| 18 | L12 "Star Pedestal": F21 | wood + concrete + dark + rotate | motorway **bridge restaurant** over a road | restaurant span (main) · two service halls (one each side) | turned to the back, the span drops onto the far hall | the dark piers are on the far side | ~10, N |
| 19 | L18 "The Doorstop": F24 wedge | wood + brick + concrete + dark + rotate | brick-and-concrete **public library** (stepped reading rooms) | library (main) · reading garden pavilions · blue school | the stepped floors slide off one by one | the back piers carry the steps | ~11, N |

TNT and tier are first guesses; the tester sets the real numbers. Heroes avoid the F-landmarks (windmill, lighthouse, clock tower,
leaning tower, lattice, saucer, twin spires, Art Deco needle, flatiron, dome hall, shell hall, cable bridge, pedestal, stepped
tower, twin sails, cube houses…), L01–L05 (pagoda, fortress keep, opera, canal houses, glass spine) and E01–E10 (slab on pilotis,
shot tower, tram depot, market hall, observatory, chimney + boiler house, bathhouse, grain elevator, water tower, rail terminus).

## Status (22/11 night)

Before shots: `OLD-POLISH-shots/before-NN.jpg` (current main, 393×852, real LV picker). After: each level folder: `shot-open.jpg` (main build, 393×852, real LV picker), `shot-before.jpg` (old | new side by side), `shot-blast1*.jpg` (the expert plan in one blast, test build). Numbers: each `O<slot>-SUMMARY.md`.

| Slot | Code | Replaces | State | TNT | Numbers |
|---|---|---|---|---|---|
| 1 | O01 Ranger Lookout | L1 | **PASS, wired** | 5 | oneBomb 87 %, fair 3/3 spare 0, allFoot 100 % |
| 2 | O02 Hop Kiln | L2 | built, **not wired: Khai** | 5–6 | fair bot 0/3 at 5 and 6 TNT (D-blast-K2 says 4–6), 3/3 at 10; oneBomb 48 %. See "Decision for Khai" |
| 3 | O03 Airfield Tower | L3 | built, **not wired: Khai** | 5–6 | same; its expert plan wins in one blast (90–98 %): the old L3 problem is gone with it |
| 4 | O04 Fire Station | L36 | **PASS, wired** | 11 | oneBomb 50 %, fair 3/3 spare 2, allFoot 94 % |
| 5 | O05 Valley Station | L6 | **PASS, wired** | 13 | oneBomb 58 %, fair 3/3 spare 2, allFoot 100 % |
| 6 | O06 Harbour Crane | L8 | **PASS, wired** | 13 | oneBomb 24 %, fair 3/3 spare 2, allFoot 92 % |
| 7 | O07 Pit Head | L9 | **PASS, wired** | 8 | oneBomb 57 %, fair 3/3 spare 2, allFoot 96 % |
| 9 | O09 Floodlit Stand | L13 | **PASS, wired** | 11 | oneBomb 29 %, fair 3/3 spare 2, allFoot 79 % |
| 10 | O10 Pier Pavilion | L14 | **PASS, wired** | 14 | oneBomb 39 %, fair 3/3 spare 2, allFoot 88 % |
| 12 | O12 Drive-in | L21 | **PASS, wired** | 16 | oneBomb 53 %, fair 3/3 spare 3, allFoot 88 % |
| 13 | O13 Monorail Station | L15 | **PASS, wired** | 7 | oneBomb 13 %, fair 3/3 spare 2, allFoot 91 % |
| 14 | O14 Seaside Hotel | L11 | **miss, not wired** | 20 | courtyard version: fair 3/3 in 2–4 blasts (the steps lesson works), but oneBomb 76 % (a TNT on the slab's 1st-floor panel drops it) and allFoot 99 % |
| 15 | O15 Gas Works | L19 | **PASS, wired** | 17 | oneBomb 46 %, fair 3/3 spare 2, allFoot 95 % |
| 17 | O17 Car Park | L17 | **PASS, wired** | 14 | oneBomb 21 %, fair 3/3 spare 2, allFoot 63 % |
| 18 | O18 Roadside Motel | L12 | **PASS, wired** | 15 | oneBomb 39 %, fair 3/3 spare 2, allFoot 79 % |
| 19 | O19 Library | L18 | **miss, not wired** | 15 | oneBomb 76 % (a TNT on a 1st-floor wall drops the stack tower), est 18 s |

Changed from the plan above: slot 1 is two buildings (the L1 contract: one double tap wins, check-main PL1–PL3); slots 7, 9, 18, 19 were built as aim levels but a wrong-way fall plus a clean-up still wins, so they ship as practice levels (fair bars); slot 14 became a courtyard (the hotel's legs inside a ring of wings); slots 17–18 use heavy roof pieces (`hard7v`, dark: introduced on 17) with `hard7` scoring, so they open with the whole-lot framing.

## Decision for Khai (slots 2–3)

The tutorial budget is 5 TNT (D-blast-K2: tutorial levels 4–6, old L1–L3 had 5). The fair bot places up to 3 TNT on every building in
one blast, so a scene of a main building, its landing and two side buildings needs ~10 TNT for the bot; with 2 buildings it wins at 5
but one bomb then wins too (oneBomb 88–100 %: the base score's height term). Slot 1 passes because its tall tower knocks the others.
- **A:** keep 5 TNT (K2). The player's plan (the hand's legs + one TNT a side building) wins with 1 spare; the fair bot loses. Wire.
- **B:** 10 TNT on slots 2–3 (changes K2). The fair bot wins 3/3.
- **C:** keep the old L2 / L3 on slots 2–3.

## Main-build checks (22/11 night, build with the 12 wired rebuilds, sources b81fae813599)

| Check | Result | Baseline (origin/main 0fa9452, same checks) |
|---|---|---|
| loadcheck | ok, 0 console errors | ok |
| `src/g7hard/check-order.js` | PASS (46 slots; 2 KNOWN: stone / drop / perblast have no card) | PASS |
| real taps, LV picker, 393×852 (16 slots 1–19: opens, plans, one tap places a TNT) | 16/16, 0 errors; camera 73–114 m from the lot (never inside a building) | 15/15 |
| expert plan (`sol`) in main, one blast | WIN on slots 1, 4, 5, 6, 7, 9, 10, 12, 13, 15 (slot 1 also one TNT a blast); 17 / 18: 44 % / 79 % after the first blast (heavy pieces need the second, as designed) | — |
| `?oldlv=1` | the old L1–L36 come back on their slots (Old Whirly, Sail Lot … ; plan check on 1, 4) | — |
| check-main flow | 22 / 2 fail (B3, B18) | same |
| check-main intro | 1 / 6 fail (I2–I7; the run stops at I7) | same |
| check-main lv | 4 / 2 fail (C1, C4) | same |
| check-main tap2 | 19 / 10 fail (T9, T12, T13, T19, T22, T24–T28) | same |
| check-main polish | 17 / 3 fail (PL5, PL8, PL15) | same |
