# POLISH2: side buildings, heights, pad, layout as a story (Khai D-blast-POLISH2, 28/11/2026)

Khai: "Các tòa nhà cần phải polish hơn nữa. Ví dụ khoảng level H đầu tiên, các tòa nhà phụ nhìn rất là chán, không có sự chỉn chu … Một số tòa nhà chưa đủ cao để tạo ra điểm nhấn … Kiểm tra lại tất cả level: các tòa nhà nằm đúng vị trí trong khung cát chưa … Sắp layout các tòa nhà như một câu chuyện."

Scope: all 56 slots audited (`AUDIT.md`, data `audit/audit-before.json`). Slot 1 is out of scope (L1TWIN). H1–H5 (slots 44 14 19 39 34) belong to the Mac: read and shot only, requests in `city-blast/SYNC.md` (28/11 POLISH2). Built against STD-v3.

## 1. What the audit found

| Group | Slots | Finding |
|---|---|---|
| Old levels still on the generic `mass` block | 7 11 24 29 35 49 51 52 53 55 | **the dull side buildings**: bare timber / concrete frames and blank brick boxes, no roof, no door, protected buildings standing loose on bare sand. Slot 7 Grand Arch is the first Hard a player meets |
| Rebuilt levels (E pack 15, O pack 26) | 2–6 8–10 12 13 15–18 20–23 25–28 30–33 36–38 40–43 45–48 50 54 56 | side buildings have their own builders (roofs, windows, doors, awnings, chimneys, yards): no change needed. Notes only: slot 10 Monorail Station reads thin, slot 37 Ice Rink has a blank plant-room wall, slot 47 Palm House's hero (7.4 m) is lower than its lodges (8.2 m) |
| Hard levels (Mac) | 14 19 34 39 44 | slot 14 H2: wall stack `W` 3.4–4.6 m outside the pad; slot 39 H4: house `F` out by 0.9 m and both protected buildings 4–9 m outside; slot 34 H5: plain 10.8 m glasshouses beside a 41.6 m tower → SYNC |

Pad check (`frame.padOut()`, D-blast-PAD): **0 buildings outside on every non-H level, before and after**; nothing had to be moved. Ground pieces added here stay inside the pad too (`__blast.polish2.rmax` per level, table below; pad edge ≥ 28.7 m, boss / hard pads ≥ 23.9 m).

## 2. What was changed (10 levels, decor only)

One new build step, `polish2` (`src/main/polish2.js` + `polish2-patch.js`, last in `src/tools/build-main.js`; `?polish2=0` = off). It wraps `V5_PARTS.mass` / `keep6` and, for parts that carry `p2` in the level data, adds **decor pieces riding on members that were already there** (`l6KdAdd`, kinds box / ibox / icyl / ibush / lit / prism / cone / cyl only):

- wall panels: windows (frame, pane, mullions, sill, head, shutters), a shopfront with a striped awning and a door, ribbon windows on offices, board joints and doors on timber; open bays stay open (sill, head, frame, rails, planters, knee braces) so a tap still lands on what the player sees;
- every slab edge on the facade: a string course; the top one a cornice;
- ground-storey columns: a plinth; office blocks on legs: an entrance canopy and lobby screen under the first slab;
- roofs: parapet + coping, stair hut, water tank, AC units, mast, a blank sign board (two colour bars, no text / logo), chimneys; or a pitched shingle / slate roof (gable or four-sided, 1.9–3.4 m, inside the outline of the slab it rides);
- ground ("site", on the part's anchored base): paving, paths, kerbed island, fences, hedges, trees, lamps, benches, planters, bollards, flag poles, bay lines.

No member is added, moved, resized or re-keyed; no TNT count, tip, camera or rule changes; hero shapes untouched (D-blast-HERO-PROC). Nothing new in kind (D-blast-NONEW).

| Slot | Level (tier) | Before | After | Silhouette (decor height) | Story | p2 pieces · rmax | Shot |
|---|---|---|---|---|---|---|---|
| 7 | Grand Arch (H) | C a bare brick box 9 m on the street; B a bare concrete tower behind | C = corner shop house (shopfront, awnings, shuttered windows, parapet, 2 chimneys, water tank); B = office tower (ribbon windows, stair hut, AC, mast) | C 9 → 12.9 m (tank), B 20.6 → 25.6 m (mast) | C on a kerbed island in the street (lamp, bench, bollards); hospital forecourt with ambulance bay + hedge, school yard with fence + flag, tram-stop paving | 594 · 21.7 m | `shots/L07-before-after.jpg` |
| 11 | Dome Hall (H) | two bare timber frames 16 m; hospital alone in the yard | two timber gate towers (board walls, shuttered windows, braces, shingle spires with vanes) | 16 → 20.9 m | hospital forecourt on the hall's axis: paving, path to the front, hedges, ambulance bay, trees in a pair | 370 · 15.9 m | `shots/L11-before-after.jpg` |
| 24 | Lift Bridge (boss) | F a bare concrete frame, C a bare brick box behind the bridge | F = harbour office (ribbon windows, balcony rails, hut, mast); C = bonded store (windows, slate gable roof, 2 chimneys) | F 16.8 → 21.8 m, C 10.2 → 13.8 m | quay paving in front of both; forecourts and paths for the four protected buildings | 480 · 22.3 m | `shots/L24-before-after.jpg` |
| 29 | Dome Works (H) | two bare concrete frames on legs | two works offices (ribbon windows, entrance canopies, lobby screens, roof plant, sign board, mast) | 16.8 → 21.8 m | school yard on the axis (fence, flag, bench, path, trees) | 307 · 16.6 m | `shots/L29-before-after.jpg` |
| 35 | Shell Hall (R) | S a bare timber crate shed | the timber market house (board walls, doors, shuttered windows, shingle gable roof, chimney) | 6.4 → 9.3 m | market pavement with lamps, planters, bench; school yard (fence, flag), hospital forecourt (bay, hedge) | 264 · 18.6 m | `shots/L35-before-after.jpg` |
| 49 | Big Bow (boss) | three protected blocks loose on bare sand | (no generic side building) | — | two school yards at the west pylon, hospital forecourt under the bow | 48 · 21.2 m | `shots/L49-before-after.jpg` |
| 51 | Sky Steps (boss) | C a bare timber frame; Q a bare steel-leg block | C = timber watch tower (spire, vane); Q = relay block (ribbon windows, parapet) | C 16 → 20.9 m | school yard (fence, flag, bench, tree) | 374 · 18.8 m | `shots/L51-before-after.jpg` |
| 52 | Deco Needle (H) | B, C, G three bare timber frames | B = lodging house (gable, chimney), C = watch tower (spire), G = meeting hall (gable, 2 chimneys) | B 16 → 19.6 m, C 16 → 20.9 m, G 12 → 15.4 m | hospital forecourt and school yard on the plaza, paths to the road | 626 · 24.0 m | `shots/L52-before-after.jpg` |
| 53 | Sky Saucer (N, the L32 benchmark) | B, C, E bare concrete frames on legs | three office blocks (ribbon windows, canopies, hut, mast / sign) | B / C 20.8 → 25.8 m | — (blocks stand at the pad edge: no ground pieces) | 526 · 0 | `shots/L53-before-after.jpg` |
| 55 | Sister Spires (H) | F a bare timber crate in front | F = timber gatehouse (gable, chimney, doors) | F 6.8 → 10 m | gatehouse paving with lamps; school yard, hospital forecourt | 171 · 17.5 m | `shots/L55-before-after.jpg` |

Heights: the member heights are unchanged (they are tuned Hard / boss scenes: a real storey more changes the mass share and the gate). The accent comes from roofs, spires, tanks and masts (decor, +2.4 … +5 m). A real raise is a proposal (§5).

## 3. Difficulty and determinism

Decor has no body, so the proof is the physics fingerprint (`levels-gd/PERF-1124/physprof.js`: scripted TNT, 720 steps, levels6 log hash + step + %). Same hash = the same collapse step for step, so every bot result (expert / sensible / naive / foot / search) is the same run as before; the tier band cannot move. Members per level: unchanged.

| Slot | Members before = after | Hash before (17e38e1) | Hash after | |
|---|---|---|---|---|
| 7 | 350 | `3a0d8e44 572 92.603` | `3a0d8e44 572 92.603` | same |
| 11 | 189 | `e780b4c9 617 94.481` | `e780b4c9 617 94.481` | same |
| 24 | 292 | `675a2963 561 21.013` | `675a2963 561 21.013` | same |
| 29 | 202 | `c9552fae 636 50.071` | `c9552fae 636 50.071` | same |
| 35 | 141 | `0cc207a0 971 3.643` | `0cc207a0 971 3.643` | same |
| 49 | 285 | `314e7cfc 594 97.28` | `314e7cfc 594 97.28` | same |
| 51 | 203 | `144acf56 710 44.869` | `144acf56 710 44.869` | same |
| 52 | 275 | `b5324c18 550 93.343` | `b5324c18 550 93.343` | same |
| 53 | 427 | `e19a1652 720 16.577` | @H53@ | @S53@ |
| 55 | 305 | `f9f1ba37 995 1.201` | @H55@ | @S55@ |
| 12 (not touched) | 125 | `dc33769f 180 0.005` | `dc33769f 180 0.005` | same |

Global physprof hashes: `dc33769f@180` (12), `b5324c18@550` (52), `e19a1652@720` (53): unchanged although 52 and 53 are dressed.

## 4. Budgets (393 × 852, opening view)

| Slot | Draw calls before → after | Triangles before → after |
|---|---|---|
| 7 | 27 → 31 | 23.9k → 32.4k |
| 11 | 26 → 31 | 17.0k → 22.6k |
| 24 | 28 → 33 | 22.8k → 30.0k |
| 29 | 29 → 33 | 18.0k → 22.3k |
| 35 | 29 → 33 | 13.7k → 17.8k |

All under the guides (≤ 2,000 decor pieces, ≤ 105k triangles, ~35 calls). Most pieces are the instanced kinds; faces sit 5–16 cm proud of their host and flat ground pieces stack at 3 / 5 / 9 / 24 cm, and FLICK-1128 C1 resolves any tie left.

## 5. Not done, and proposals for Khai

1. **Real height (members) on side buildings of the tuned Hard / boss levels** (e.g. slot 7 C from 3 to 5 storeys, slot 55 F from 2 to 4): changes the mass share, needs a gate round per level. Proposal: Khai names the slots, one level per round.
2. **Slot 47 Palm House**: the hero (7.4 m) is lower than its lodges (8.2 m). The hero's shape is fixed (D-blast-HERO-PROC): either the lodges go down a storey or the hero is rebuilt taller: Khai's call.
3. **Slot 10 Monorail Station** reads thin (piers and a deck, 9.4 m) and **slot 37 Ice Rink** has a blank plant-room wall: both are builder-level work on rebuilt levels (not in this pass).
4. **Slot 7**: the shop house C stands in the street by design (it is what the arch lands on); it now sits on a kerbed island. Moving it off the street changes the level's solution.
5. **Slot 53**: the three blocks stand at ±25 m (the L32 standard's "widest part + 8 m"), at the edge of the drawn sand; inside the pad by the check.
6. Hard levels: see SYNC (H2 wall stack and H4 row / protected pair outside the pad, H5 glasshouses plain and low).

## 6. Checks on the final build

@CHECKS@

## 7. Files

`src/main/polish2.js`, `src/main/polish2-patch.js`, `src/tools/build-main.js` (step appended), `src/levels6/tools/src-l1-12.js` (slots 7 24 35), `src/levels6/tools/src-l13-36.js` + generated `levels-v6-l13-36.json` (slots 11 29 49 51 52 55), `src/levels6/patch/v14-monument.js` (slot 53 scene), `city-blast/levels-gd/POLISH2/` (this file, `AUDIT.md`, `audit/`, `shots/`, `tools/audit.js`), `city-blast/SYNC.md`, `city-blast/LEARNINGS.md`.
