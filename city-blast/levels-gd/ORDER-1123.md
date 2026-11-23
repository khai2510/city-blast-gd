# ORDER-1123: the play order of the 51 levels (23/11)

Khai 23/11: "sắp xếp lại level xong rồi gửi lên TestFlight". Then **D-blast-LAUNCH** (launch schedule), the Hard exemption (Khai 23/11: Hard / boss
levels are placed as-is, even with later elements) and **D-blast-L50**: slots 1–50 follow the blueprint **`SLOTS-50.md`** exactly (044f48d).
This file is the order as wired in `src/g7hard/patch.js` (`PLACE`, `INTRO_AT`), with a reason per slot. Content of every level is unchanged:
levels that SLOTS-50 converts sit in their slot **in their current form** until their conversion lands (status "pending conversion").

Checked by `node src/g7hard/check-order.js` (PASS; pending / placeholder / Hard exceptions are listed, not failed).

## 1. Launch slots and cards (`INTRO_AT`)

| Launch | Slot | Level carrying the card | Card |
|---|---|---|---|
| wood | 1 | o1 Ranger Lookout (O01) | L1 hand (as before) |
| BLAST (tap + BLAST) | 2 | o9 Pit Head (O07) | "Tap to place. BLAST…" moved from old L2 to slot 2, where the slot-keyed L2 hand is |
| brick | 4 | o2 (O02 once wired) | Brick |
| concrete | 8 | o3 (O03 once wired) | Concrete |
| Wrecking Ball | 12 | o21 Drive-in (O12), after Hard 11 | Ball Unlocked (unlock = win of 11) |
| blue | 15 | o36 Fire Station (O04), after Hard 14 | Blue Building |
| rotate (control) | 16 | o6 Valley Station (O05) | Swipe to turn |
| glass | 20 | o4 Needle Court, after Hard 19 | Glass (was old L25) |
| red barrels | 25 | E03 Tram Depot, after boss 24 | Barrels. **New:** an easy-pack level may carry a card when `INTRO_AT` puts one there (the patch site that kept all g7 levels card-free now keeps only Hards card-free) |
| Net | 30 | o17 Car Park (O17), after Hard 29 | Net Unlocked |
| steps | 35 | o11 Shell Hall (O14 when finished), after SH 34 | "Blast again!" (window 35–38) |
| steel | 40 | o8 Harbour Crane (O06), after SH 39 | Steel |
| Sky Strike | 45 | o31 Stack Tower, after SH 44 | Sky Unlocked |
| heavy | 50 | E01 Long Legs | **no card exists** (D-blast-NONEW proposal, Khai) |
| dark RC (60), trap (80) | — | — | **off** (`INTRO_AT: 'off'`): the old dark card (was L17/L24) and the trap look (was L33) no longer show |

Booster unlock levels move: Ball 12 (was 12), **Net 30** (was 24), **Sky 45** (was 35). `LV7O.boost` now sets `BOOST.unlock` from the card level.

## 2. The curve (tier per slot; `#` = the level's tier, `|` = below it)

```
SH/B |                       #         #    #    #    # #
H    |      #   #  #    #    |    #    |  # |    |  # | |
N    | ## ##|###| #| # #|### |####| ###| #|#| ###| #|#|#|
R/T  |#||#|||||||#||#|#|||||#||||||#||||#||||#||||#||||||
     +---------1---------2---------3---------4---------5-
```

- Hard / boss: 7 · 11 · 14 · 19 · **24 B** · 29 · 34 SH · 39 SH · 44 SH · **49 B** (blueprint), plus the placeholder Hards 37 (o24) and 47 (o28) and the leftover boss o30 at 51.
- Every launch slot is the relief right after a Hard / boss (8, 12, 15, 20, 25, 30, 35, 40, 45, 50). No two Hard / boss in a row.
- The 17–19 wall (GD-70) is gone: 17 Floodlit Stand (98% win), 18 Roadside Motel, 19 H3.
- The easy pack is spread over 3–50 (no block of 10); the last level is not E10 (GD-79). **E05 / E06:** SLOTS-50 puts E06 at 9 (converted to the aim lesson, its
  shell-and-core is not the point) and E05 at 36 (steps practice), so the GD-78 "E05 before E06" order is replaced by the blueprint's lessons.

## 3. Slot by slot (before = slot in the 22/11 order on main, 236a3ce)

| # | Before | Level | Tier | Launch element (teach) | Latest element in it today | Status | Reason |
|---|---|---|---|---|---|---|---|
| 1 | 1 | o1 Ranger Lookout | T | wood | wood (launch 1) | ready | wood launch: TNT + double tap (L1 hand), no change |
| 2 | 7 | o9 Pit Head | N |  | steel (launch 40) | pending conversion | slot 2 = the L2 hand (slot-keyed): BLAST card moved here (INTRO_AT blast); O07 to be converted to timber |
| 3 | 45 | E04 Market Hall | N |  | drop (launch 70) | pending conversion | one TNT on timber folds a section; easy-pack level to be cut to a 1-blast timber tutorial |
| 4 | 2 | o2 Stripey Point | T | brick | brick (launch 4) | pending conversion | brick launch (card); O02 Hop Kiln takes the slot once wired at 10 TNT (D-blast-O23) |
| 5 | 43 | E02 Shot Tower | N |  | drop (launch 70) | pending conversion | tip rule on two brick legs; first use of brick after its card |
| 6 | 15 | o19 Gas Works | N |  | steel (launch 40) | pending conversion | frame on brick piers: brick practice before the first Hard |
| 7 | 8 | o7 Grand Arch | H |  | blue (launch 15) | as-is (Hard exempt) | first labelled Hard, as-is (blue + concrete before launch: accepted exception); plays soft (GD-75) |
| 8 | 3 | o3 Old Tock | N | concrete | concrete (launch 8) | pending conversion | concrete launch (card) as the relief after Hard 7; O03 Airfield Tower takes it once wired |
| 9 | 46 | E06 Boiler Stack | N |  | drop (launch 70) | pending conversion | aim the fall: practice right after concrete (E05 now follows at 36: blueprint order, see note) |
| 10 | 13 | o15 Monorail Station | N |  | steel (launch 40) | pending conversion | one span leans on the next (O13 proven 100% win) before Hard 11 |
| 11 | 16 | o16 Dome Hall | H |  | blue (launch 15) | as-is (Hard exempt) | Hard 2, as-is (blue before launch: exception) |
| 12 | 12 | o21 Drive-in | R | Ball | steel (launch 40) | pending conversion | Ball card on the rest level after Hard 11 (Drive-in was built for the Ball) |
| 13 | 10 | o14 Pier Pavilion | N |  | steel (launch 40) | pending conversion | easy pier pavilion (99.6% win) before Hard 14 |
| 14 | 30 | H2 Watch Keep | H |  | perblast (launch 100) | as-is (Hard exempt) | Mac Hard, as-is; was slot 30 (exception: dark, barrels, steps, stone, per-blast) |
| 15 | 4 | o36 Fire Station | R | blue | blue (launch 15) | ready | blue launch (card) as the relief after Hard 14 |
| 16 | 5 | o6 Valley Station | N | rotate (control) | blue (launch 15) | ready | rotate card (swipe) on the first turn level with a blue; GD-74 tune pending |
| 17 | 9 | o13 Floodlit Stand | R |  | steel (launch 40) | pending conversion | easy concrete stand (98% win) after the double teach 15-16 |
| 18 | 18 | o12 Roadside Motel | N |  | dark (launch 60 (heavy 50)) | pending conversion | far-side piers + turn, rises into Hard 19 |
| 19 | 20 | H3 Grand Stage | H |  | dark (launch 60 (heavy 50)) | as-is (Hard exempt) | Mac Hard, as-is; was slot 20 (exception: dark, steps) |
| 20 | 22 | o4 Needle Court | N | glass | glass (launch 20) | pending conversion | glass launch (card) as the relief after Hard 19 (98% win) |
| 21 | 48 | E07 Bathhouse | N |  | drop (launch 70) | pending conversion | blast small away from the blue: glass + blue practice |
| 22 | 27 | o5 Doorstop Corner | N |  | glass (launch 20) | pending conversion | glass + blue + turn (fails first-timers on blue: the rise before the boss) |
| 23 | 21 | o25 Glass Point | R |  | dark (launch 60 (heavy 50)) | pending conversion | glass front, concrete core: relief-weight level before the boss |
| 24 | 11 | o10 Lift Bridge | B |  | steel (launch 40) | as-is (Hard exempt) | boss 1, as-is; was slot 11 (steel before launch: exception) |
| 25 | 44 | E03 Tram Depot | N | barrels | dark (launch 60 (heavy 50)) | pending conversion | barrels launch (card on an easy-pack level, newly allowed) as the relief after the boss |
| 26 | 51 | E10 Rail Terminus | N |  | drop (launch 70) | pending conversion | tip + drums + blue together: no longer the last level (GD-79) |
| 27 | 33 | o34 Tock Yard | N |  | steel (launch 40) | pending conversion | drums at the yard piers; its trap look card is OFF (trap = 80) |
| 28 | 29 | o33 Rivet Depot | N |  | steel (launch 40) | pending conversion | drums behind a shield, rises into Hard 29 |
| 29 | 36 | o35 Dome Works | H |  | trap (launch 80) | as-is (Hard exempt) | Hard, as-is; was slot 36 (exception: barrels, blue, trap) |
| 30 | 17 | o17 Car Park | R | Net | dark (launch 60 (heavy 50)) | pending conversion | Net card on the rest level after Hard 29; the dark card is OFF (dark = 60), conversion removes rc + heavy (GD-70) |
| 31 | 19 | o18 The Doorstop | N |  | dark (launch 60 (heavy 50)) | pending conversion | stepped floors, school safe (O19 to finish) |
| 32 | 41 | o29 Old Tock Row | N |  | steel (launch 40) | pending conversion | read the row, one tower at a time |
| 33 | 31 | o26 The Bullet | N |  | steel (launch 40) | pending conversion | slim glass tower, rises into SH 34 |
| 34 | 32 | H5 Glass Spine | SH |  | perblast (launch 100) | as-is (Hard exempt) | Mac Super Hard, as-is; was slot 48 (exception: dark, steps, per-blast) |
| 35 | 14 | o11 Shell Hall | R | steps | steps (launch 35) | pending conversion | steps launch ("Blast again!") as the relief after SH 34 (O14 to finish) |
| 36 | 47 | E05 Star Dome | N |  | drop (launch 70) | pending conversion | shell before core: steps practice |
| 37 | 26 | o24 Deco Needle | H |  | blue (launch 15) | PLACEHOLDER (NEW-1) | PLACEHOLDER for NEW-1 (Hard Deco Needle; no non-hard leftover fits without breaking the relief rule) |
| 38 | 25 | o32 Sky Saucer | N |  | dark (launch 60 (heavy 50)) | PLACEHOLDER (NEW-2) | PLACEHOLDER for NEW-2 (Sky Saucer; doubles as the relief between 37 and SH 39) |
| 39 | 38 | H4 Canal Row | SH |  | perblast (launch 100) | as-is (Hard exempt) | Mac Super Hard, as-is; was slot 38 (exception: dark, stone, per-blast) |
| 40 | 6 | o8 Harbour Crane | R | steel | steel (launch 40) | ready | steel launch (card) as the relief after SH 39 |
| 41 | 37 | o22 The Pencil | N |  | steel (launch 40) | pending conversion | steel needle on concrete feet + turn |
| 42 | 39 | o23 Tube Bundle | N |  | steel (launch 40) | pending conversion | cut the concrete under the steel |
| 43 | 35 | o27 The Splinter | N |  | steel (launch 40) | pending conversion | glass + steel splinter, rises into SH 44 |
| 44 | 40 | H1 Five Eaves | SH |  | drop (launch 70) | as-is (Hard exempt) | Mac Super Hard, as-is; was slot 40 (exception: dark, barrels, steps, drop) |
| 45 | 24 | o31 Stack Tower | R | Sky | dark (launch 60 (heavy 50)) | pending conversion | Sky card on the rest level after SH 44 |
| 46 | 49 | E08 Grain Elevator | N |  | drop (launch 70) | PLACEHOLDER (NEW-3) | PLACEHOLDER for NEW-3 (hrc patience: its natural slot is 60) |
| 47 | 28 | o28 Sister Spires | H |  | steel (launch 40) | PLACEHOLDER (NEW-4) | PLACEHOLDER for NEW-4 (Hard Sister Spires; natural slot ~59) |
| 48 | 50 | E09 High Cistern | N |  | drop (launch 70) | PLACEHOLDER (NEW-5) | PLACEHOLDER for NEW-5 (drop-first: natural slot 70) |
| 49 | 23 | o20 Big Bow | B |  | steel (launch 40) | as-is (Hard exempt) | boss 2, as-is; was slot 23 |
| 50 | 42 | E01 Long Legs | N | heavy (no card yet) | drop (launch 70) | pending conversion | heavy launch (no heavy card yet: Khai proposal); drop7 plumbing to come off |
| 51 | 34 | o30 Sky Steps | B |  | steel (launch 40) | as-is (Hard exempt) | leftover after 50 (boss, natural ~74); was slot 34 |

## 4. Accepted exceptions and what is still pending

- **Hard / boss as-is (Khai 23/11):** elements before their launch on 7 (concrete, blue), 11 (blue), 14 H2 (dark, barrels, steps, stone, per-blast),
  19 H3 (dark, steps), 24 (steel), 29 (trap), 34 H5 (dark, steps), 39 H4 (dark), 44 H1 (dark), plus the placeholders 37 / 47.
- **Pending conversion (SLOTS-50 "convert" / "rebuild"):** 29 non-hard levels still show later elements today (see "Latest element" above), e.g.
  steel on 2, 6, 10, 12, 13, 17, 27, 28, 32, 33; dark / heavy on 5, 9, 18, 21, 23, 25, 26, 30, 31, 36, 45, 50; drop plumbing on 3, 5, 9, 21, 26, 36, 50;
  two blasts before 35 on 3, 5, 9, 21, 25, 26. O02 / O03 (slots 4 / 8) are decided (D-blast-O23, 10 TNT) but not wired in `release/g7-old-levels.json`:
  the old Stripey Point / Old Tock stand in.
- **Placeholders in the NEW slots** (SLOTS-50 §5, until NEW-1…5 are built): 37 o24 Deco Needle (H) · 38 o32 Sky Saucer · 46 E08 · 47 o28 Sister Spires (H) · 48 E09.
  With 3 Hard and 3 non-hard leftovers, two Hards must sit in NEW slots; this is the only fit with a relief between 37 and SH 39 (38). It leaves
  47 H → 48 E09 → 49 boss without a relief (reported PLACEHOLDER by the checker). The sixth leftover, boss o30, is slot 51.
- **Forced by content:** heavy pieces have no card; dark RC / trap cards off until their launch.

## 5. Saves

The save mark is `"s:" + slots` (order-early.js). From any earlier order a save now lands on **the same level it stood on** (Lead 23/11: "a save at old
slot 20 lands on the same level"): old slot 20 (H3 Grand Stage) → slot 19 Grand Stage. Levels the new order puts before it stay open in the
picker. best / bp follow their level (by appended index). A save at or past the end of a shorter order (41 / 46 levels) still goes to the first
level it never had. `src/g7hard/export-easy.js` keeps its EASY list (the data order: save marks and seeds key on it); the play order is `PLACE` only.

## 6. Checks (build `w-order.html`, sources a216805e265c; the camera agent's uncommitted `src/main` edits were in the working tree)

| Check | Result |
|---|---|
| `node src/g7hard/check-order.js` | PASS (cards on 1 4 8 12 15 20 25 30 35 40 45, dark / trap off; 44 EXCEPTION / PENDING / PLACEHOLDER / KNOWN listed) |
| loadcheck | ok=true, 0 errors |
| order + schedule in the game | 51 levels in PLACE order; INTRO_SCHED: blast 2, brick 4, concrete 8, wreck 12, keep 15, rotate 16, glass 20, barrels 25, net 30, steps 35, steel 40, sky 45, rc / trap 9999; booster lock levels 12 / 30 / 45 |
| cards fire (save on the level, real Play tap) | Ball L12 Drive-in, glass L20 Needle Court, barrels L25 Tram Depot (easy-pack level), Net L30 Car Park, steel L40 Harbour Crane, Sky L45 Stack Tower; no trap look on L29, no dark card on L30 |
| old save (22/11 order mark, level = old slot 20) | lands on L19 Grand Stage; best {old 20: 81, old 42: 77, old 1: 99} → {19: 81 (Grand Stage), 50: 77 (Long Legs), 1: 99}; save rewritten with the new mark |
| real taps (393 × 852, touch) | L3 Market Hall, L25 Tram Depot, L40 Harbour Crane: 3 TNT placed by taps on the building, BLAST, settle |
| check-sflay | 16 PASS, 0 FAIL, 0 page errors |
| check-camhard (3, 14, 19, 25, 39, 44, 50) | 7 PASS, 0 FAIL, 0 errors |
| page errors | 0 in the final run; the first run (before error tagging) logged 11 × "Cannot read properties of undefined (reading 'setMatrixAt')", not reproduced since |
