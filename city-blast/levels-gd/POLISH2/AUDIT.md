# POLISH2 audit (28/11/2026, D-blast-POLISH2), before any change

Build: `origin/main` 17e38e1. Tool: `POLISH2/tools/audit.js` (393 × 852, opening view + the 45° view the game turns to, `frame.padOut()` = D-blast-PAD check, building inventory). Data: `audit/audit-before.json`.

Pad check: **0 buildings outside on non-H levels**; H2 (slot 14) and H4 (slot 39) have members outside (Mac, SYNC).

Finding in one line: the 43 rebuilt levels (E / O packs) are detailed; the **10 old levels that still use the generic `mass` block** (7 11 24 29 35 49 51 52 53 55) carry the dull side buildings Khai saw (first one a player meets: slot 7 Grand Arch, the first Hard).

| Slot | Level | Src | Tier | Hero top | Neighbours (top m) | Outside pad | Plain / low / story | Fix |
|---|---|---|---|---|---|---|---|---|
| 1 | Ranger Lookout | O pack O01 | T | 22.5 | S 2.7 | 0 | out of scope (L1TWIN rebuilds it) | — |
| 2 | Pit Head | O pack O07 | T | 13.2 | S 2.9, B 7.4, C 7.4 | 0 | ok: log cabins, shed, pine; reads as a pit yard | none |
| 3 | Market Hall | E pack E04 | T | 9.6 | B 8.6 | 0 | ok: arcade front + market hall; one mass, no neighbours | none |
| 4 | Hop Kiln | O pack O02 | R | 14.4 | S 2.9, B 7.4, C 7.4 | 0 | ok: kiln, two brick cottages, cart shed, tree | none |
| 5 | Shot Tower | E pack E02 | N | 31.4 | B 9, C 9 | 0 | ok: shot tower between two timber warehouses | none |
| 6 | Gas Works | O pack O15 | N | 14.4 | S 3.8, B 10, C 10 | 0 | ok: gasholder, two brick stores, shed | none |
| 7 | Grand Arch | old  | H | 19.6 | B 20.6, C 9, keep (blue) 11.6 | 0 | DULL (the first Hard a player meets): C = a bare orange brick box 9 m (blank walls, no window, door, roof); B = bare concrete tower hidden behind the arch; 3 small protected blocks stand loose, the middle one under the arch; no pavement, kerb or yard | dress B + C (windows, shopfront, cornice, roof props), forecourts for the protected buildings, kerbs along the street |
| 8 | Airfield Tower | O pack O03 | R | 21.2 | S 2.9, B 9.7, C 9.7 | 0 | ok: tower, two brick shops with awnings and roof units, bus shelter | none |
| 9 | Boiler Stack | E pack E06 | N | 23.1 | B 10.4 | 0 | ok: stack + boiler house | none |
| 10 | Monorail Station | O pack O13 | N | 9.4 | B 6.7, C 6.7 | 0 | thin: the station is piers + deck only, 9.4 m, the two spans end in the air; reads unfinished, no accent | light: lamps, platform edge, stair rail, signal posts (decor); hero shape not changed |
| 11 | Dome Hall | old  | H | 24.8 | B 16, C 16, keep (blue) 7.4 | 0 | DULL: B and C = two bare timber crates 16 m (open frames, no roof); the hospital stands alone in the middle of the yard; nothing ties the three to the hall | dress B + C as timber bell / stair towers (shingle roofs, windows, braces), a forecourt and path for the hospital, a paved court in front of the hall |
| 12 | Drive-in | O pack O12 | R | 11 | S 3.6, B 6.9, C 6.9 | 0 | ok: screen, booth, two barns, striped canopy | none |
| 13 | Pier Pavilion | O pack O10 | N | 12.2 | S 2.4, B 7.4, C 7.4 | 0 | ok: pavilion, beach huts, two brick villas, tree | none |
| 14 | Watch Keep | **H (Mac)** L02 | H | 32.1 | R 13.5, G 17.6, W 4 | 4 members | H2 (Mac): OUT of the pad: W (the brick wall stack at x -29.1, 4 members +3.4 … +4.6 m); W is a bare red pile with no role visible; hall and gate tower are detailed | SYNC: move W into the pad (x ≥ -25.5) or dress it as a ruined curtain wall tied to the keep |
| 15 | Fire Station | O pack O04 | R | 18 | S 3.2, C 7.4, keep (blue) 12.4 | 0 | ok: hose tower, engine shed, cottage, school with a reason (beside the station) | none |
| 16 | Valley Station | O pack O05 | N | 15.3 | S 6.9, B 7.4, C 7.4, keep (blue) 4.7 | 0 | ok: cable station, lodge, cottages; hospital in front | none |
| 17 | Floodlit Stand | O pack O09 | N | 8.8 | B 17, C 17 | 0 | low hero (8.8 m stand) but the two 17 m floodlight masts carry the skyline | none |
| 18 | Roadside Motel | O pack O18 | N | 18.4 | S 3.2, B 7.4, C 7.4 | 0 | ok: sign tower, motel row, two brick houses | none |
| 19 | Grand Stage | **H (Mac)** L03 | H | 22.2 | R 12, F 13.4, D 5.6, keep (blue) 15.1 | 0 | H3 (Mac): inside the pad; theatre, lobby, fly tower detailed; the two protected blocks are plain 4-storey boxes beside a rich facade | SYNC (minor): protected pair reads plainer than the theatre |
| 20 | Needle Court | O pack O04B | R | 20.2 | S 6.9, C 7.4, keep (blue) 10.5 | 0 | ok: glass needle, barn, cottage, hospital | none |
| 21 | Bathhouse | E pack E07 | N | 12.3 | B 5.4, C 5.4, keep (blue) 8.8 | 0 | ok: bathhouse, colonnades, school | none |
| 22 | Doorstop Corner | O pack O05B | N | 16.8 | S 6.9, B 7.4, C 7.4, keep (blue) 8.8 | 0 | ok: tower, barn, cottages, school in front | none |
| 23 | Glass Point | O pack O25 | N | 17 | S 3.1, B 9.7, C 9.7 | 0 | ok: glass tower, two brick shops, canopy | none |
| 24 | Lift Bridge | old boss  | SH | 22.4 | B 22.4, F 16.8, C 10.2, keep (blue) 8.8 | 0 | DULL (boss): F = a bare concrete frame 16.8 m and C = a bare brick box 10 m behind the bridge; 4 small protected blocks ring the towers with nothing round them | dress F + C (office + warehouse), quay edge and forecourts for the protected buildings |
| 25 | Tram Depot | E pack E03 | N | 14.4 | B 12.2, C 12.2 | 0 | ok: depot, two signal cabins, lamps, tracks | none |
| 26 | Rail Terminus | E pack E10 | N | 12.2 | B 7.4, keep (blue) 8.8 | 0 | ok: terminus, shed, school | none |
| 27 | Tock Yard | O pack O34 | N | 17.2 | S 6.6, D 2.7, B 7.4, C 7.4 | 0 | ok: clock tower, cottages, sheds | none |
| 28 | Rivet Depot | O pack O33 | N | 18.4 | S 3.8, B 10, C 10 | 0 | ok: lattice tower, two brick stores, shed | none |
| 29 | Dome Works | old  | H | 24.8 | B 16.8, C 16.2, keep (blue) 8.8 | 0 | DULL: B and C = two bare concrete frames on open legs 16–17 m; school alone in the yard (same plan as L11) | dress B + C as office towers (ribbon windows, parapet, roof units), forecourt for the school, a court in front of the works |
| 30 | Car Park | O pack O17 | R | 11.6 | B 9.7, C 9.7 | 0 | ok: car park, two shops | none |
| 31 | Library | O pack O19 | N | 14.6 | S 7.1, C 7.4, keep (blue) 12.4 | 0 | ok: library tower, reading room with a porch, cottage, school | none |
| 32 | Old Tock Row | O pack O29 | N | 17.2 | S 6.6, B 7.4, C 7.4 | 0 | ok: clock tower, terrace row, cottages | none |
| 33 | The Bullet | O pack O26 | N | 17 | S 6.9, B 7.4, C 7.4 | 0 | ok: dome tower, barn, cottages | none |
| 34 | Glass Spine | **H (Mac)** L05 | SH | 41.6 | L 10.8, R 10.8 | 0 | H5 (Mac): inside the pad; the two side greenhouses are plain glass boxes 10.8 m beside a 41.6 m tower: low and plain | SYNC: glasshouses need a base course, ridge and door; 10.8 m reads small beside the spine |
| 35 | Shell Hall | old  | R | 11 | S 6.4, keep (blue) 8.8 | 0 | DULL: S = a bare timber crate shed across the front (2 storeys, 6.4 m); school + hospital at the ends with nothing round them | dress S as a market shed (pitched roof, stalls, awning), forecourts |
| 36 | Star Dome | E pack E05 | N | 11.2 | B 7.9, C 7.9 | 0 | ok: dome, two studies | none |
| 37 | Ice Rink | E pack E11 | N | 8.4 | B 8.8 | 0 | minor: the plant room on the right is blank grey panels | light: louvres / service door / pipes on the blank panels (decor) |
| 38 | Telephone Exchange | E pack E12 | N | 16 | B 8.2, keep (blue) 8.8 | 0 | ok: exchange, kiosk, school | none |
| 39 | Canal Row | **H (Mac)** L04 | SH | 29.2 / 22.6 | C 16, B 19.3, D 16, E 19.3, F 22.6, keep (blue) 15.1 | 133 members | H4 (Mac): OUT of the pad: F (east end house, up to +0.92 m), A touches the edge (+0.01); the two protected blocks at the ends stand on the grass in the shot; the camera is far, houses read small | SYNC: pull the row in ~1 m a side or ask Agents-Game for a wider hard pad; protected blocks onto the sand |
| 40 | Harbour Crane | O pack O06 | R | 12.8 | S 2, B 10, C 10 | 0 | ok: crane, barge, two warehouses | none |
| 41 | The Pencil | O pack O22 | N | 20.4 | S 6.9, B 7.4, C 7.4, keep (blue) 8.8 | 0 | ok: pencil tower, barn, cottages, school | none |
| 42 | Tube Bundle | O pack O23 | N | 19 | S 2.4, B 7.4, C 7.4 | 0 | ok: tube towers, beach huts, cottages | none |
| 43 | The Splinter | O pack O27 | N | 20 | S 2.4, B 9.7, C 9.7 | 0 | ok: splinter, shops, huts | none |
| 44 | Five Eaves | **H (Mac)** L01v4 | SH | 29.2 | S 5.6, B 6, T 3.4 | 0 | H1 (Mac): inside the pad; pagoda very detailed; gate / bell / tea house 3–6 m are small beside 29 m but detailed | SYNC (note only): side pavilions low |
| 45 | Stack Tower | O pack O31 | R | 21 | S 3.8, B 10, C 10 | 0 | ok: stack tower, stores, shed | none |
| 46 | Radio Mast | E pack E13 | N | 18.2 | B 9, C 8.2, D 8.2 | 0 | ok: mast, timber hall, two brick lodges | none |
| 47 | Palm House | E pack E14 | N | 7.4 | B 8.2, C 8.2 | 0 | low hero (7.4 m, lower than its 8.2 m lodges): flagged, hero shape not touched | none (proposal: Khai) |
| 48 | Parachute Tower | E pack E15 | N | 17.6 | B 6.2, keep (blue) 8.8 | 0 | ok: tower, engine house, school | none |
| 49 | Big Bow | old boss  | SH | 18 | Q 18, S 9, keep (blue) 8.8 | 0 | DULL setting (boss): the two pylons are the hero pair; 3 small protected blocks stand loose under the bow with nothing round them; bare sand | forecourts, quay / road line under the bow (decor) |
| 50 | Long Legs | E pack E01 | N | 25 | B 10.4, C 10.4 | 0 | ok: slab on legs, two pavilions | none |
| 51 | Sky Steps | old boss  | SH | 33.6 | Q 24, C 16, keep (blue) 8.8 | 0 | DULL (boss): C = a bare timber crate 16 m; Q = a bare steel-leg frame 24 m with a mast; school beside the tower | dress C + Q, forecourt for the school |
| 52 | Deco Needle | old  | H | 36 | B 16, C 16, G 12, keep (blue) 8.8 | 0 | DULL: B, C, G = three bare timber crates 12–16 m; hospital + school flank the needle | dress B / C / G as timber houses, forecourts |
| 53 | Sky Saucer | old  | N | 81.8 | B 20.8, C 20.2, E 28.8 | 0 | DULL neighbours: B, C, E = bare concrete frames on legs 20–29 m (the L32 benchmark's own neighbours) | dress B / C / E as office blocks |
| 54 | Grain Elevator | E pack E08 | N | 25.4 | B 12.6, C 7.5 | 0 | ok: elevator, silos, weigh house | none |
| 55 | Sister Spires | old  | H | 35.2 | Q 35.2, R 39.6, S 22.6, V 22.6, U 22, F 6.8, keep (blue) 8.8 | 0 | DULL: F = a bare timber crate 6.8 m in front; school + hospital beside the towers | dress F as a timber kiosk row, forecourts |
| 56 | High Cistern | E pack E09 | N | 17 | B 5.5, C 5.5 | 0 | ok: cistern, two pump houses | none |
