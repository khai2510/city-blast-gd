# FLICK-1128: "nó bị chớp, asset không rõ ràng" (Agents-Game, 28/11)

Khai 28/11, L34 shot (`floormen games/blast/feedback/2026-11-28/khai/L34-jank.jpg`): first "the more complex the building, the more
the 3D stutters", then the precise words: **it is not a frame drop, it flickers, the assets are not crisp**. This pass is about the
flicker. Base `11e694d`. New build step `flick` (`src/main/flick.js`, LAST, after `fps`), **`?flick=0` = off** (`?flickcp=0` /
`?flicknear=0` = one part off). Render only: no body, bond, pose or rule changes. Mac files (hard data, `g7…` blocks, `release/`) untouched;
the H5 source fix is a request in `SYNC.md`.

## 1. How it was measured (`flickprobe.js`, this folder)

Headless Chrome + SwiftShader, 393 × 852 at DPR 3 (an iPhone 15: the game draws a 786 × 1704 canvas, pixel ratio capped at 2 since
14/11 P2), 4× MSAA. `REAL=1`: the game's own loop runs (idle sway, camera eases, shadow updates, everything time-based) and every frame
it draws is read right after its render. A pixel **flips** when its brightness goes up then down (or down then up) by more than 48 / 255
over three frames in a row: smooth motion is one-way, z-fighting, shadow acne and sub-pixel crawl go back and forth. Rate = flips per
million pixels per frame, over 14 frames. Heat maps: red = pixels that flipped. Low absolute numbers on a CPU rasteriser: compare
before / after on the same level and phase.

## 2. What flickers (before = `?flick=0`, the 11e694d picture)

| Level (slot) | Camera distance | Planning: flips / Mpx / frame | After the first blast (wave 2) | Where (heat map) |
|---|---|---|---|---|
| 34 H5 Glass Spine | 172 m | 118 (105 on a 2nd run) | 135 | **podium roof: white rim vs orange decks (stripes)**, skyline windows |
| 32 o29 Old Tock Row | 124 m | 148 | 848 | skyline windows / outline while the camera eases back after the blast |
| 3 E04 Market Hall (simple) | 100 m | 51 | – | skyline, fence |
| 53 o32 Sky Saucer | 258 m | 1 | – | – |
| 39 H4 Canal Row | 266 m | 13 | – | facade panels |
| 44 H1 Five Eaves | 150 m | 2 | – | – |

Causes, ranked by what a player sees on the building:
1. **Exact coplanar faces (z-fighting).** A decor piece (the visual dress riding on a member, `L6_KD`) whose face lies in the same
   plane as a member's face or another decor face: the two colours swap in stripes that crawl as the camera sways. L34: the podium's white
   rim (`g7spine`, top at `y + hh`) and the 9 podium decks (top at `y0 + h`) tie exactly at 9.2 m: the stripes on the podium roof in the
   shot `1-L34-podium-roof-before-after.jpg`. The build counts such ties on every level: **339 faces on L34, 408 on L32, 2 109 on L39,
   313 on L53, 113 on L44, 85 on L3**. Most are flush panels on walls whose colour wins only on some pixels.
2. **Depth precision.** The camera's near plane was a fixed 0.5 m while hard levels frame from 125–266 m: the 24-bit depth buffer then
   resolves ~3.5 mm at 172 m, so faces a few mm apart fight too (sync probe on L34, `near 0.5 → 2`: 54 → 12 flips).
3. **Sub-pixel detail at 2× on a 3× phone** ("không rõ ràng"): mullions 0.18 m, transoms 0.06 m, sheen streaks 0.02 m are 0.5–2 canvas
   px at 172 m, and the 786 px canvas is stretched 1.5× to the 1179 px screen. Thin lines blink as they cross pixels and look soft.
   Not changed here (proposal P1).
4. **Backdrop skyline texture**: its window rows crawl when the camera moves fast (the ease back after a BLAST): `4-L32-skyline-shimmer-left.jpg`.
   It is the painted backdrop, not a building. Not changed (proposal P2).
5. Not a cause: shadow acne (shadows off changes nothing: L34 0, L32 +5, L3 −6), glass sorting (glass / glare have fixed render orders 2 / 3;
   hiding every transparent mesh: L34 0), pixel-ratio flips (2 = 2 on a 3× phone, the governor never switches).

## 3. What changed (`src/main/flick.js`)

| | Change | Proof |
|---|---|---|
| C1 | **Coplanar decor faces resolved at level build.** For every drawn, axis-aligned decor box, each face that lies within 4 mm of a member face or another decor face on the same side and overlaps it is moved 1.5 cm: a face INSIDE the other face (a panel, a stripe on a wall) comes out 1.5 cm, a face that is LARGER than / sticks out of the other (a rim round a deck) goes in 1.5 cm; decor vs decor: the smaller face comes out. Hidden damage marks (`m14`), tilted pieces and non-box shapes are left alone; same colour on the same mesh is no fight and is skipped. 1.5 cm is 0.2 px at the hard-level distance. 3–16 ms once per level build. `?flickcp=0` | L34 podium roof: stripes gone, 0 red pixels there (`1-…jpg`); L34 planning 118 → **80** flips / Mpx / frame, after the blast 135 → **78**; L32 148 → 119 (the rest is the skyline); L3 51 → 49; L39 13 → 5 |
| C2 | **Near plane follows the camera**: `near = clamp(4 % of the distance to the focus, 0.5 m, 6 m)`, never above half the camera height. L34: 0.5 → 6 m (12× the depth resolution), L32 5 m, L3 4 m, a close zoom (8 m) stays 0.5 m. Nothing the camera can see is that close (clearance pad ≥ 3 m to any neighbour, the ground ≥ 1.6× the camera height away). `?flicknear=0` | included in the C1 column (both on); the sync probe alone: 54 → 12 on L34 |

Same physics: `PERF-1124/physprof.js` on the final build: `dc33769f@180 0.005 %`, `b5324c18@550 93.343 %`, `e19a1652@720 16.577 %` (unchanged).

## 4. Proposals (look or cost changes: Khai decides)

- **P1. Native pixel ratio 3 on 3× iPhones** (`?pr=3` exists: test it on the phone now). `3-L34-pr2-vs-pr3-proposal.jpg`: mullions,
  floor edges and transoms get crisp; this is most of "asset không rõ ràng". Cost: 2.25× the pixels (PERF-1124 measured 2.0× slower GPU
  in planning on the VM). Middle way: 3 while planning / at rest, 2 during the collapse (the engine's governor already steps between
  tiers outside the collapse).
- **P2. Skyline backdrop**: a slightly blurred (pre-filtered) skyline image, or sharper mip filtering, stops its window rows crawling
  during the camera's ease after a BLAST.
- **P3. Mac (SYNC.md)**: lower H5's podium rim 1 cm in the source; the same tie report (`window.__blastPerf.flick.cp`) can be used on new hard levels.

## 5. Checks (final build)

- loadcheck: `ok=true`, 0 errors.
- `src/main/check-sflay.js`: 16 PASS / 0 FAIL, 0 page errors.
- `src/g7hard/check-order.js`: PASS.
- `src/main/check-r22.js`: 23 PASS / 0 FAIL, 0 page errors (run section by section: boost 7, refit 2, open 8, retry 2, card 1, pill 2, map 1).
- physprof hashes unchanged (above).

## 6. Not done here

- Frame-rate work (the first brief of PERF-1128): dropped on Khai's correction; PERF-1124's numbers and options still stand.
- The circled spot in Khai's shot (furniture and slabs hanging by the core after the podium broke): decor rides on the member it was
  built on, so it stays wherever that member still stands; whether those hosts are the right ones on H5 was not checked in this pass (Mac's builder).
