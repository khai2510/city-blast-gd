# City Blast! MAIN build (D-blast-ONELINK, 12/11/2026)

One build for every line. All future updates go here: `checkpoints/index-main.html`.
The Lead publishes it to the main link (artifact `<main-link>`). The build tool never writes `games/blast/index.html`.

```bash
cd games/blast
node tools/build-main.js                 # -> checkpoints/index-main.html (about 5 s)
node tools/build-main.js --list          # the steps
FEEL_DEFAULT=off node tools/build-main.js /tmp/main-feel-off.html   # A/B twin for the bots
KEEP=/tmp/main-steps node tools/build-main.js                       # keep every intermediate file
```

- Re-run it after ANY patch or level source changes. The whole chain is rebuilt from the sources.
- If a step's anchors no longer match, the build stops (exit 1) and the old `index-main.html` stays.
- The same sources give the same bytes. The file starts with a comment that lists every source file and its hash; `window.__blastBuild` = `{ id:"main", sources:"<hash>" }`.

## 1. Pipeline (order matters)

Root base: `checkpoints/index-v9-v30.html` (read only). It is the last file both lines share.

| # | Step | Script (one process per step) | Sources it reads | Adds |
|---|---|---|---|---|
| 1 | levels-json | `levels6/tools/build-levels.js` | `levels6/tools/src-l1-12.js` | L1–12 level data, to a temp JSON (the repo's `levels-v6.json` is not touched) |
| 2 | levels6-v10 | `levels6/patch.js` | `levels6/patch/v10.js` | Massive buildings, TNT only, multi-wave rule (no wave limit), PASS 85 / protected 5 % / street 10 %, school and hospital roofs, names follow roofs, determinism |
| 3 | materials-fx | `materials-fx/patch.js` | `patch/matfx.js` | Each material breaks its own way (see conflict C1) |
| 4 | v31 | `v31/patch.js` | `patch/v31.js` | "BLAST!" label only, text cut, steel throw constant |
| 5 | uiclean | `uiclean/patch.js` | `patch/uiclean.css`, `patch/uiclean.js` | New HUD and Home rules, Lilita One type system, Reduce motion row, district themes in play, win goes back to Home |
| 6 | boosters2 | `boosters2/patch.js` | `patch/boosters2.js`, `sky.js`, `boosters2.css` | Wrecking Ball, Safety Net, Sky Strike; unlocked by the L10 / L20 / L30 boss wins |
| 7 | metrics | `metrics/patch.js` | `patch/metrics.js` | Play-time metrics panel |
| 8 | voice | `voice/patch.js` | `voice/timber-call.mp3` | Recorded "TIMBER!" call |
| 9 | haptics2 | `haptics2/patch.js` | `haptics2.js`, `glue.js` | Haptics v2, Vibration switch in Settings and Pause |
| 10 | combo | `combo/patch.js` | `patch/combo.js`, `patch/engine.js`, assets | Combo praise (in the file, off by default) |
| 11 | glue-ui | `main/glue.js ui` | — | C1 and C4 below |
| 12 | home-nomile | `uiclean/home-nomile.js` | `uiclean/assets/home-plate-nomile.png` | Home without the district line, Map bubble, the crane sign opens the map |
| 13 | levels6-l13-36 | `levels6/tools/src-l13-36.js` | `levels6/patch/v11.js`, `v12.js` | L13–36 level data, hero kits and dresses, BODY_CAP 1e9 |
| 14 | feel | `levels6/tools/src-feel.js` | `levels6/patch/v13-feel.js`, `ui-feel/q9.js` | Feel Q1–Q8 (on by default) and the Q9 living Home |
| 15 | l32-monument | `levels6/tools/src-l32.js` (`M14_OPEN=0`) | `levels6/patch/v14-monument.js`, `tools/lvpick-overlay.html` | L32 monument (RC hero), vertical pan / zoom camera, the LV picker, `?lv=N` |
| 15b | a1-levels | `levels6/tools/src-a1.js` (`A1_OPEN=0`) | `levels6/patch/v15-a1.js` | Batch A1 (D-blast-ROLLOUT, 13/11/2026): L1–L5 remade on the L32 standard (monumental ladder-material heroes `a1mill / a1light / a1tock / a1needle / a1wedge`, the tip rule, aids by tier, short fail texts). Appended after v14 (it calls `M14.api`), before `glue-final`; replaces the data of LEVELS[0..4] at load, L6–36 untouched. `?a1=0` = the old L1–L5. Details: `levels6/A1-STATUS.md`. It is step 16 in `--list`; the rows below are one number later there. |
| 15c | base | `levels6/tools/src-base.js` | `levels6/patch/v15-base.js` | Per-building **base type** (D-blast-MATCURVE, Owner "đế trụ khó đổ", 14/11/2026): how a building's ground storey answers a lost pier, read from level data `L.base`. Appended after the last v15 block, before `glue-final`. `?base=0` = off. See §12 and `levels6/BASE-STATUS.md`. It is step 17 in `--list`. |
| 16 | glue-final | `main/glue.js final` | — | C3 and C5 below |
| 17 | glue-ui-fixes | `main/glue.js fixes` | — | F1-F3 colour rules (13/11/2026, review screens 13 / 11 / 03): boss = orange everywhere (intro banner "⚠ Boss! ⚠", PASS tag, meter rim, tip ring, vignette, pre-level card header); Hard stays purple. Meter fill orange below PASS, gold at / above PASS, also on the lose card. Unaffordable Upgrades price in ink, not red. Checks E1-E3 in `check-main.js` |
| 18 | glue-intro | `main/glue.js intro` | `main/intro.js` | Booster / obstacle introduction (D-blast-INTRO-BTF, Bus Fever pattern): tray with locked "Lv.N" slots from L1, "<Name> Unlocked!" card + "Claim ×2" (a free gift) = 2 uses on the unlock level; its tray chip opens as the card shows, forced first use (dim, cut-out, hand, input locked), "New: <thing>" card + forced tap for new materials / obstacles, L1 hand only (0 words). See §9. Checks I1-I13 |
| 19 | audio-el | `main/glue.js audio` | `main/audio-el.js`, `audio/el/*.mp3` (13 files) | ElevenLabs audio (D-blast-AUDIO-EL, 13/11/2026): menu / play music loops, city ambience, random one-shots, unlock / new / hard / win / lose stings. See §10 |

Why this order:
- **2 before 3–10.** The UI patches anchor on text that the levels6 engine patch rewrites (v31 needs the levels6 and materials-fx markers).
- **3–10** is the order the v32 demo was built in. Rebuilding it on the round-4 base gives `index-v32-demo.html` byte for byte, except the combo block (newer source).
- **12 after 10.** It anchors on uiclean's Home markup.
- **13–15 last.** v11–v14 and feel are appended blocks that wrap engine functions. They must wrap the final versions. Feel goes before the monument: v14 wraps feel's camera functions and calls them.
- **Step 13 has a side effect:** `src-l13-36.js` rewrites `levels6/levels-v6-l13-36.json` (same content when the source did not change).
- `v14-monument.js` is consumed as it is. A re-run picks up the L32 agent's latest version.

Not steps (their content is already in levels6 round 5): `roofs-demo/graft.js`, `roofs-demo/names.js`, the v32c PASS cap, the v32i "no wave limit" edit.

## 2. URL flags

| Flag | Effect |
|---|---|
| `?lv=N` | Opens level N (kept) |
| `?dev=0` | no LV button at all (the default is the bright yellow "Level" button; `?dev=1` is no longer needed) |
| `?feel=off`, `?feel=-q3,-q5`, `?feel=q1,q2` | Feel items off / all but / only (Q9 too) |
| `?mfxphys=1` | materials-fx debris physics on (see C1). `?mfx=0` = no materials-fx at all |
| `?combo=1` | Combo praise on |
| `?boosters=1` | All three boosters unlocked |
| `?metrics=1` | Metrics panel open |
| `?mon=0`, `?mcam=0`, `?massist=0` | Old L32, old camera, no tap assist |
| `?uichome=<ms>` | Hold the win moment before Home (captures) |
| `?bgm=0`, `?bgm=2`, `?bgmvol=0.5` | Old procedural music (no ElevenLabs layer) / the other music take (needs `../audio/el/*-alt.mp3` next to the file, else the embedded take) / music level x0.5 |
| `?a1=0` | The old L1–L5 (before batch A1) |
| `?intro=0` | No intro layer (old boosters2 boss-win card, no locked slots, L1 tip back) |
| `?hints=1` | The STD-v2 placement aids back, for comparison only (D-blast-NOHINT): cue / damage dots, the dots' tip line, the push-in on the foot / solution, the old fail lines and tips that name a spot, the opening yaw from `L.hint` |
| `?tap2=0` | The old controls and rules (§13): tap assist, tap-to-select / x / undo, stacking on an open leg, double tap = camera reset, BLAST on L1, street rule, Target Lot, old coins, Daily / No Ads / "+" shown. Finer: `?street=1`, `?lot=1`, `?coin=0`, `?soon=1` |
| `?base=0` | The per-building base setting is ignored (§12): every building answers a lost pier as before 14/11 (frames hold a lost corner, heroes need two neighbouring legs). `?base=<preset>` = one preset on every ladder target (probe only) |
| `?studio=0` | No HitMaker Studio card (step `studio`, `main/studio.js`, 15/11/2026). Default: the card shows first on a cold start, leaves at max(1.2 s on screen, game ready + 0.3 s), 20 s cap; a tap only skips once the game is ready; same picture as the iOS launch screen. Checks ST1-ST9 (`ONLY=studio`), spec `design/studio/SPEC.md` |
| `?frame=0` | The old opening (whole lot). Default since 15/11: step `frame` (after `perf`, `main/frame.js`) opens every level on the hero, centred in the playable area, 3/4 view, 1 s ease-in; numbers in `FRAME-STATUS.md`. `?hints=1` also keeps the old opening |
| `?look=0` | The old look (step `look`, after `frame`, `main/look.js`, 15/11/2026, from `research/h2h-carsort/H2H-DESIGN.md` F1/F2/F5/F6/F7/F10). Default: sage lawn with distance haze, calmer sand, skyline −30 % saturation + haze; after BLAST the camera frames the hero + its debris (~52 % of the play area, base low; off with `?frame=0` too); gloss + contact AO ×1.5 on concrete / brick, hemi 0.80, sun −0.08 and +10° (PCF 6); white rim on members holding a placed charge (+1 call) and on the TNT sprites (0 calls), white blast-radius ghost; glossy Upgrades icons. Render / camera / CSS only (no physics). Checks `ONLY=look` (LK1–LK9); test API `window.__blast.look` (`stats`, `measure`, `rim`, `cam`, `sig`) |
| `?shop2=0`, `?iapdev=1`, `?adsdev=1`, `?intfrom=N` | Step `shop` (last, `main/shop.js`, D-blast-SHOP 15/11/2026): Shop / Upgrades (~3,400 curve, Coin Bonus on the win reward, Booster Pocket) / No Ads / ads facade / Fail Offer. `?shop2=0` = the old screens. Real money is hidden while the build constant `IAP_READY` is false (`SHOP_IAP_READY=1` at build time flips it, only once the App Store Connect products + RevenueCat exist); `?iapdev=1` = simulated store, `?adsdev=1` = stub ads, `?intfrom=N` = test knob for the L15 interstitial gate. Details: `design/shop/SPEC.md` §9; checks `ONLY=shop` (SH1-SH16) |
| `?polish=0`, `?lockchips=1`, `?polear=1` | Step `polish` (last, `main/polish.js`, 15/11/2026): group-A fixes from the Smash Fest UX/UI head to head (research/h2h-sf-uxui/H2H-UXUI.md) + Car Sort F4 + tester digest 15/11: in-level coin pill = bank (BUG-1), Pause off icons (BUG-2) and the Settings rows in Pause, win payoff ("+N" 40 px under the CLEARED! stamp 600 ms then to the pill, camera centres the rubble, Home pill counts up as coins land), "New:" cards close on a tap anywhere after 400 ms, 2nd empty tap re-shows the hand, two-line Play buttons, lose "N% · need 85%", pre-level copy when all locked, L1 label + 400 ms window, 48 pt targets, map labels >= 15 px, locked chips hidden, muted idle BLAST, Pause in the safe-area HUD row, "85%" at the tick, unaffordable rescue hidden, Map title clear of the coin pill. `?polish=0` = none; `?lockchips=1` = locked chips shown (D-blast-INTRO-BTF 1); `?polear=1` = Pause back in the left ear. Checks `ONLY=polish` (PL1-PL15) |

## 3. Feature checklist of v32i (from its patches) in the merged build

Checked by `main/check-main.js` (item id in brackets) unless noted. The same script passes on `index-v32i-demo.html` with `REF=1` for the items both builds have.

**Screens**
- ✓ Home: Play, crane LEVEL sign, Daily, No Ads, Map bubble, coin pill with "+", Settings gear, tabs Shop / Home / Upgrades [A1–A3]
- ✓ Home without the district line (home-nomile) [A4]
- ✓ "Coming soon" buttons kept: Shop tab, No Ads, Daily, coins "+" (D-blast-UI-1) [A13]
- ✓ City Map: opens from the Map bubble and from the crane sign, 36 nodes, closes [A10, A11]
- ✓ Settings: Sound, Music, Vibration, Reduce motion, Restart from Level 1, Done [A7–A9]
- ✓ Upgrades screen with 4 cards [A12]
- ✓ Pause: Sound, Music, Reduce motion, Vibration, Restart, Home, Resume [B6]

**In play**
- ✓ HUD (uiclean + v31): "BLAST!" label only, no wave count, pause, level pill, % meter, PASS tag, TNT badge [B3]
- ✓ Type: every text element is Lilita One (ULClean) or Nunito, on Home, Settings, play, Hard level, Pause and the win. No Fredoka, no Luckiest Guy (see §6)
- ✓ District themes in play (uiclean): unchanged code, seen on L13+ and L20 captures
- ✓ PASS 85 % on every level, no wave limit [B2]
- ✓ "TIMBER!" caption [B10] and the recorded TIMBER call [A19]
- ✓ Haptics v2: 119 hits logged on one L1 attempt (place, boom, material, timber) [B12]
- ✓ materials-fx look and sound [B15]. Debris physics off by default: conflict C1
- ✓ v31 steel throw constant present [A18] (only acts with `?mfxphys=1`, see C1)
- ✓ Combo praise in the file, off by default, `?combo=1` turns it on [B11, D2]
- ✓ Boosters2: schedule L10 / L20 / L30 [A17]; tray with all three under `?boosters=1` [D1]; Sky Strike used through the real UI drops and breaks members [D5, I13]
- ✓ Metrics: 5 taps on the logo, `?metrics=1`, the attempt is recorded [A14, A23, B13]

**Flow**
- ✓ Home → Play → L1 → BLAST → win (95.6 %) → Home by itself → Play → L2 [B1, B7–B9, B16, B17]
- ✓ Lose card stays: "Not yet!", %, a 5-word tip, Try Again, Home; Try Again restarts with a full tray [B18, B19]
- ✓ Pause → Home [B20]

**Added by the levels6 line**
- ✓ L1–36 levels6 set, L32 = Sky Saucer monument (RC), BODY_CAP 1e9 [A21, C4]
- ✓ Feel Q1–Q8 on by default, Q9 living Home [A5, A20, B5, B14]
- ✓ LV picker opens L1, L20, L32; `?lv=4` works [C1–C4, C9]

## 4. Conflicts and resolutions

**C1 · materials-fx (UI line) vs the level gates (levels6 line). The big one.**
- materials-fx changes how debris moves: its own piece plan per material, throw, contact, kick, glass that leaves no rigid piece, crumbling masonry, glass broken by flying debris, a wake-up when a resting piece is evicted.
- Every levels6 level was gated on the engine without it. With it on, the expert plan loses L4 (92 % → 67 %) and L32 (90 % → 84 %), and other levels move by up to 9 points.
- Resolution (`main/glue.js ui`, 4 edits): the look and sound stay on (crumbs, dust, chips, glints, sparks, smoke tint, steel kink, per-material sounds). The rigid pieces and their physics are the ones the levels were gated on.
- Proof: the expert plan on all 36 levels gives the same determinism log and pose hash as the levels6-only build (36/36).
- `?mfxphys=1` puts the materials-fx debris physics back. If Owner wants it on by default, all 36 levels must be re-gated with it.
- What the player loses by default: brick in 6 small chunks, timber in planks, steel cut in two flung halves, masonry pieces crumbling on landing. Fragments are the plain 4-piece tiling again.

**C2 · v31 text cut vs levels6 round 5 (both rewrite the same four strings).**
- The between-wave toast, the between-wave tip, the "Waves a / b" result row and one lose tip. This is why the UI chain failed on the round-5 base on 11/11.
- Resolution: `v31/patch.js` now accepts a base that already carries the result (`done`), or the round-5 wording (`alt`). It still applies unchanged on the old bases.
- Kept from levels6: "Use more TNT." (v31 said "Use more TNT at once."; with unlimited waves a second blast is fine).

**C3 · Zoom hint: uiclean hides it, the monument needs it.**
- uiclean removes the zoom hint in play (S3). v14 uses the same pill to teach the new camera on L32.
- Resolution (`glue final`): no hint on ordinary levels. On a monument level (`L.mon`) the pill shows, in uiclean's bubble style, cut to "Drag up / down. Pinch to zoom." Nothing in `v14-monument.js` is anchored on.
- Known: v14 shows the hint 1.6 s after the level starts only if the build-up is over by then. On a slow device it can be skipped. That is v14's timer (L32 agent).

**C4 · Hand edits of the v32 demos that had no script.**
- v32b: combo off unless `?combo=1`, and the "TIMBER!" caption let through uiclean's pop-text block. Now two asserted edits in `glue ui`.
- v32c (PASS cap 85, protected 5 %), v32f / v32h (new roofs, names follow roofs), v32i (no wave limit): all native in levels6 round 5, so nothing to carry.

**C5 · LV picker vs the new UI.**
- The overlay put a yellow 48 px button bottom-left, on the Shop tab and next to BLAST.
- Resolution (`glue final`): a bright yellow (#FFB400) "Level" button (58×36) top-left under the avatar / pause button, visible by default on Home and in play (the owner opens a claude.ai artifact link and cannot add `?dev=1`). `?dev=0` = hidden (screenshots, store captures). `tools/lvpick-overlay.html` is not edited (the level builds share it).
- Main opens on Home, not on L32 (`M14_OPEN=0`).

**C6 · Feel (v13) and the monument (v14) wrap the same camera functions.**
- Both wrap `zoomLimits`, `updateCamera`, `pick`, `blast`, `detonateAll`. `index-v10h` was never built with feel.
- Resolution: order only. Feel first, then v14, which calls feel's versions. L32 frames correctly through the Q1 lens (capture `21-lv-L32.png`). Gesture test result: see §5.

**C7 · Functions wrapped by both lines (no edit needed, order is enough).**
- `show`, `toast`, `popText`, `showResult`: uiclean, then feel.
- `startLevel`, `placeCharge`, `detonateAll`, `showResult`, `goHome`: metrics, then feel, then v14.
- `failMember`, `blast`, `waveEnd`: combo and haptics2 (text edits in the engine), then v14 wraps.
- Win: feel's stamp and coin stream run, then uiclean returns to Home after 2 s.

## 5. Checks (12/11/2026, machine load 20–30)

```bash
export NODE_PATH=/opt/node22/lib/node_modules BLAST_LIBS=<scratchpad>/libs
node tools/loadcheck.js checkpoints/index-main.html
MAXL=36 LIVE=0 node levels6/tools/determinism-check.js checkpoints/index-main.html multi 2
N=1 node levels6/tools/gate-bot.js checkpoints/index-main.html 1,4,8,13,22,32,36
node main/check-main.js            # checklist + flow + LV picker, shots -> checkpoints/main-shots/
```

| Check | Result |
|---|---|
| Build | 4,094,953 bytes (3.90 MB), 16 steps. A second run gives the same bytes |
| Loadcheck | ok=true, screen=title, 0 errors |
| Physics vs the levels6-only build (v10d → v10f → feel → v14, built from the same sources) | Expert plan on all 36 levels: same determinism log and pose hash, 36/36. 36/36 expert wins |
| Determinism (R-11), `MAXL=36`, `multi`, 2 repeats, LIVE=0 | DETERMINISTIC. 5 multi-blast levels (L8, L11, L12, L15, L18): seq / after / fresh / wait / raf all 2/2. Same hashes as the levels6 build (L8 89.348 % 92ffc4d7, L18 91.84 % 4debe9ca) |
| Real game loop | Not run through `determinism-check.js` (LIVE=0: machine too slow). The flow test plays L1 in the real loop and gets 95.6 %, the same as the stepped run |
| Expert gate, L1, L4, L8, L13, L22, L32, L36, N=1 | Expert 7/7: 96, 92, 89, 95, 96, 90, 95 % (margins +4 to +11). Output identical line by line to the levels6-only build |
| Gate tool exit code | 1 ("MISSED"), from the sensible bot on L13 (55 %) and L22 (49 %). Same on the levels6-only build: level tuning, known since the feel check |
| `main/check-main.js` (checklist, flow, LV picker, flags, 390×844) | 53 PASS, 0 FAIL, 0 console errors. Shots and `check.json` in `checkpoints/main-shots/` |
| L32 gesture test (`tools/gesture-test.js`, 72-pose sweep skipped) | 11 of 13 pass: vertical / two-finger pan, turn, pinch, wheel to the 14 m clamp, tap beside a pier, drag places nothing. 2 fail on timing: the script waits a fixed 3–5 s for the camera, which is not enough at 1 frame a second. Measured with a settled camera: the foot piers stay in the play area at every zoom (zoom 1 / 0.5 / 0.22 / 0.1: pier at y 429 / 480 / 512 / 433 of 96–657). Re-run on a quiet machine |
| L32 vs `checkpoints/index-v10h-l32-monument.html` (final v14 of the easing round: 9 TNT, barrels at the tower, storey rule) | Same expert result and pose hash: 89.793 %, 66db88f8, 1 TNT left. v14 hash in the build stamp: 56f78e1d60 |
| With materials-fx debris physics (before C1) | Expert 5/7: L4 67 %, L32 84 % |

Not checked: fps on a phone; sound by ear; the native wrapper (`native/tools/build-www.js` still takes `index.html`).

`tools/loadcheck.js` now reads `BLAST_LIBS` (it only looked in `tools/libs/`, which does not exist in the repo).

## 6. UI audit (input from `research/h2h-design/UI-H2H-SF-2026-11-12.md`)

**No old-UI HUD or fonts in main.**
- Computed font of every text element, hidden ones too (Home, Settings, play with boosters, Hard level, Pause, win): 59 × Lilita One (ULClean), 27 × Nunito, 3 × system-ui. The 3 are the LV picker (dev tool, on purpose).
- Fredoka and Luckiest Guy are still embedded as font files (same as v32j), but no element resolves to them. Removing the files is one of the doc's R items: not done.
- Visible text in play is the same list as on v32i, element for element. PASS tag: 13 px (v32i 10.4 px, old UI 10.5 px).
- Old-UI items that are gone, as on v32j: coin pill while planning, cream tip bubble after L2, "TNT ×5" chip, off-centre BLAST label, white pause button, "LEVEL 1" on Play, win card.

**HUD elements from the levels6 line that now duplicate something in the new UI** (listed only; none removed, R1–R25 wait for Owner):

| # | From levels6 line | Duplicates (new UI) | Where |
|---|---|---|---|
| 1 | Feel Q7 "CLEARED!" stamp, 56 px | uiclean's green "CLEARED" tag on the meter | Win: the word shows twice |
| 2 | Feel Q8 shield / street icons beside the meter | The "0 %" damage tags on each protected building | Hard and boss levels |
| 3 | Feel Q5 coin stream up the right edge | uiclean's win coin count-up in the coin pill | Win |
| 4 | Feel Q9 moving taxi and clouds | The parked taxi and clouds painted in the Home plate | Home: two taxis |
| 5 | Monument camera hint pill (C3) | uiclean's tip bubble uses the same slot (hidden while the hint shows) | L32 start |
| 6 | LV chip | — (dev tool, not game UI) | Every screen |

## 7. How to add a new patch

1. Write it like the others: its own folder, `patch.js <in.html> <out.html>`, text anchors found exactly once, a marker so it cannot apply twice, exit 1 and nothing written on any problem. Or an appended block like `v13-feel.js`.
2. Add one entry to `STEPS` in `tools/build-main.js`: `id`, `what`, `run`, `src` (every file it reads, for the build stamp), `marks` (text the output must carry).
3. Place it by what it anchors on:
   - engine or UI text edits: between `levels6-v10` and `glue-ui`;
   - blocks that wrap engine functions: after `levels6-l13-36`, before `glue-final`;
   - level data: change `src-l1-12.js` / `src-l13-36.js`, no new step.
4. Run `node tools/build-main.js`. If another step now fails, two patches edit the same text. Fix it in the patch (as `v31/patch.js` `done` / `alt`), or add an asserted edit to `main/glue.js` with the reason. Never edit `index-main.html` by hand.
5. Run the four checks of §5. A patch that changes physics must keep the pose hashes, or the levels must be re-gated.
6. Add the feature to §3 and a check to `main/check-main.js`.

## 8. Files

| File | What |
|---|---|
| `tools/build-main.js` | The pipeline |
| `main/glue.js` | Conflict edits (C1, C3, C4, C5), each asserted |
| `main/check-main.js` | Checklist, flow, LV picker, URL flags (Playwright, 390×844) |
| `checkpoints/index-main.html` | The build |
| `checkpoints/main-shots/` | Captures and `check.json` |
| `v31/patch.js` | Edited: `done` / `alt` anchors (C2) |
| `tools/loadcheck.js` | Edited: reads `BLAST_LIBS` |

## 9. Booster / obstacle introduction (D-blast-INTRO-BTF, 13/11/2026)

Step 18 `glue-intro` appends `main/intro.js` at the end of `main()` (anchor `} // main`, nothing in v14 / v15 / src-a1 is touched; level data is read at runtime). Off in the test harness (`manual`), with `?boosters=1` / `?boost`, and with `?intro=0`.

**Schedule** = `INTRO_SCHED` in `main/intro.js` (one table, `__blast.intro.sched()`), from the built curriculum (`levels6/LEVEL-NEEDS.md` "new" column) and the boosters2 boss-reward schedule:

| L | What | How |
|---|---|---|
| 1 | TNT (the only charge on L1-36: levels6 tntOnly), wood, tap + BLAST | hand only, 0 words (tip hidden on L1) |
| 2 | Brick | New card + forced tap |
| 3 | Concrete | New card + forced tap |
| 4 | Protected (blue) building; turn the view (tip) | New card + forced tap |
| 8 | Steel | New card + forced tap |
| 11 | **Wrecking Ball** (won on L10); blast in steps (tip) | Unlocked card, Claim ×2 (free), forced use |
| 13 | Stack two TNT | level tip (no card) |
| 17 | RC "Dark Pier" | New card + forced tap |
| 21 | **Safety Net** (won on L20), then the Road (street rule) | Unlocked card + forced use, then New card + forced tap |
| 25 | Glass | New card + forced tap |
| 31 | **Sky Strike** (won on L30) | Unlocked card + forced use |
| 32 | Barrels | New card + forced tap |
| 35 | Trap barrels | level tip (same object) |
| 36 | Target lot | New card + forced tap |

**Runtime rules**
- Tray: the existing booster tiles of the bomb row (no new row, so HUD N10 is not affected). From L1 every booster slot shows; locked ones are grey, disabled, lock + "Lv.N" (16 px). Same footprint as L11+ with three boosters.
- Booster: the card's one button reads "Claim ×2" (a gift, not a price), and the chip in the tray opens behind the card as it shows. The card appears when the player has reached the unlock level (`save.level >= lv - 1`; an old save past it gets it on its next level). boosters2's boss-win grant is replaced (`b2Grant` returns nothing while the layer is on), so the Ball now comes with 2 free uses, not 3. A save that already got a booster from boosters2 sees nothing new.
- New material / obstacle: card on that exact level, the first time.
- Forced step: starts 0.6 s into the plan phase. A full-screen layer swallows every pointer / touch / mouse / wheel event. Only a tap inside the cut-out counts. On a booster, the tap is its use (the button's own click: aim / arm), then input is released. On a piece, the tap only marks it (no TNT, no rule change), then input is released. If nothing can be pointed at within 4 s, the step is skipped, so the player is never trapped.
- Save: `save.intro[id] = {c, f}` (card done, forced done), `save.bst` / `save.bseen` for the uses. Leaving the level before finishing shows it again next time.
- Visuals: a placeholder look, all in one style block (`#introCss`, tokens `--in-*`). It is waiting for the Figma spec (`design/booster-intro/SPEC.md`, file <figma-file>). Fonts are Lilita (ULClean) and Nunito, the hand is the game's own, and `html.rm` stops every intro animation.
- `check-main.js`: `cards()` also finishes the intro steps, so the flow test passes through L2's Brick card. Section I (`ONLY=intro`) = I1-I12, with shots `checkpoints/main-shots/intro-*.png` at 390×844 @2x.

**Curriculum mismatches (reported, not changed)**
- Boosters land on the R breather after each boss (L11 / L21 / L31, brief §2.1). D-blast-INTRO-BTF item 5 wants them where difficulty rises. The brief's first purposeful push is L13 / L23 / L34.
- L21 introduces two things (Net + Road). The decision says one at a time, so the layer shows them one after the other.
- The things appear in level data before their card: concrete on L2 (37 members, card L3), steel on L3 (2 members, card L8), RC on L12 / L18 (card L17, LEVEL-NEEDS K1).
- Built order vs the brief: street L21 (brief L16), glass L25 (L22), barrels L32 (L26), lot L36 (L32), RC L17 (L13). This is L13-36-STATUS's curriculum shift.
- Free uses: the Ball went from 3 to 2 (decision: 2). Cutter / Cluster are never introduced on L1-36 (tntOnly).
- First wood (L1) gets no New card: L1 is hand only with 0 words (D-blast-INTRO-BTF item 4). Brick, concrete, steel, RC, glass, the protected building, the road, the barrels and the lot each get one.
- The material card keeps one "Got It" button (1 primary button per screen) instead of Smash Fest's "Tap to Continue" screen. The look waits for the Figma spec.

## 10. ElevenLabs audio (D-blast-AUDIO-EL, 13/11/2026)

Owner: the old background music is not good. Step 19 `audio-el` appends `main/audio-el.js` at the end of `main()` (anchor `} // main`, after the intro layer). It wraps the `window.SFX` facade; the engine, the game code and the haptics are not edited.

**Files** (`audio/el-raw/` = ElevenLabs originals, never touched; `audio/el/` = game files from `python3 -I tools/prep-audio-el.py`, rerunnable). Mono MP3, 1.20 MB for the 13 embedded files (1.6 MB as base64); the HTML went 3.90 MB to 5.48 MB.

| Role | Embedded | Take and loop | Level |
|---|---|---|---|
| Gameplay music | `play.mp3` 57.1 s, 457 KB, 64k | `play1` 6.58 s to 63.68 s (25 bars, 105.1 BPM) | -20 LUFS |
| Menu music | `menu.mp3` 64.0 s, 512 KB, 64k | `menu2` 22.03 s to 85.99 s (24 bars, 90.1 BPM) | -20 LUFS |
| Ambience bed | `amb.mp3` 25 s, 151 KB, 48k | `amb_a` (already a seamless loop) | -30 LUFS |
| One-shots | `horn` `beep` `birds` `crane` `pigeon` (0.4 to 1.9 s) | horn1, beep2, birds1, crane1, pigeon1 | -16 LUFS (crane: peak -3 dBFS, too short to measure) |
| Stings | `unlock` `new` `win` `hard` `lose` (0.5 to 1.2 s) | unlock2, new2, win2, hard1, lose2 | -16 LUFS (lose -21) |
| Alternates, files only | `play-alt` (play2 9.46 to 66.55 s), `menu-alt` (menu1 8.66 to 67.27 s), `amb-alt` (amb_b) | `?bgm=2` fetches `../audio/el/{play,menu}-alt.mp3` | same |

Why these takes (numbers only, nobody listened): tempo from onset autocorrelation, 105.1 and 90.1 BPM as prompted. play1 beat strength 0.86 (play2 0.81) and the lowest share of energy in the 300-3400 Hz voice band (0.28 vs 0.48). menu2 has the smoothest mid-band movement (0.29 vs 0.43 for menu1) and by far the best loop seam (spectral distance 0.37 vs 0.58), but a weaker beat grid (0.77 vs 0.84). **This is not a vocal detector**: nobody has listened. Owner must check play1 and menu2 for a voice; if one has it, switch to the alternate (`?bgm=2` to audition both).
Loops: cut on the detected bar grid; the 2 s after the end point is cross-faded (equal power) over the head, so the last sample flows into the first. Music is a plain looping buffer (LAME writes the gapless Xing header).

**Behaviour**
- Nothing exists before the first tap: the layer is created inside `SFX.unlock()` (the game's own first-gesture unlock). Decoding runs through the same `AudioContext`, menu first.
- `SFX.music()` keeps the procedural groove off underneath; the Music switch (Settings, Pause) drives the new tracks. Menu / map / shop = menu loop; plan / count / blast = gameplay loop; the result card keeps what plays. 0.8 s crossfade. Each track remembers its position.
- Kept hooks: duck under the BLAST and every explosion (`musicState("blast")`, `musicDuck`, about -12 dB, at most 3 s); slow-mo = low-pass + a slight pitch-down (`setSlowmo`); `setMusicVolume`.
- Ambience under everything, gain 1 on a -30 LUFS file; low-pass 1.4 kHz in the menus, 7 kHz in a level. Behind the Sound switch (`SFX.mute`).
- One-shots: every 6-18 s (random), gain -28 to -20 dB, pan -0.6..0.6, rate 0.92-1.08, never two at once, never during the count, the collapse or slow-mo, never when muted / hidden / suspended.
- Stings (also behind Sound): `SFX.play("unlock")` = unlock jingle, or the "New:" ding when the intro card shows "New: ..." (the procedural unlock is replaced); Hard / Boss banner = taiko; `musicSting(true)` = win, `musicSting(false)` = lose, with a 2.2 s duck. The procedural "win" and "fail" sounds are replaced while the new set is ready.
- Reduce motion: no change. iOS silent switch: WebAudio as before. `?bgm=0` = nothing of this is installed.
- Test hook: `window.__blast.elAudio` = `state()`, `fire()`, `sting(name)`, `quiet()`. Checks K1-K12 in `main/check-main.js` (`ONLY=audio`).

## 11. No placement hints (D-blast-NOHINT, STD-v3, 14/11/2026)

Default on the main link: nothing on screen says WHERE to put TNT, on any level or tier. `?hints=1` = the STD-v2 aids back (comparison only).

| Removed | Where | How |
|---|---|---|
| Pulsing cue dots from the first second, damage dots / remaining slots on hit members, cleanup dots ("what is left") | `levels6/patch/v14-monument.js` (L32 + every level that tracks members: L1–L5 of `v15-a1.js` via `M14.api.track`) | `M14.api.AIDS` = `NOHINT` for every tier (`open:"whole", cue:false, tip:false, cleanup:"no", dots:"none", fail:"rule"`); `aids()` forces it over any `L.aid` (L3/L5 `a1cue2` second-attempt dots included). The old table is `M14.api.AIDS_HINTS`. `dots:"none"` draws no pip at all; the hidden slot state still drives round 6's tap rule (a tap on a TNT of a leg that still needs more places the next one) |
| The dots' tip line ("Fill the dots to crack the leg", `L.dotTip` / `L.dotTip2`) | v14 `pipTip` | `tip:false`, `cleanup:"no"` |
| The camera push-in on the foot / solution at level open and after a blast | v14 `startLevel` / `updateCamera` | `open:"whole"` |
| Fail lines that name a spot or the dots | v14 `failText` + `failTip` / `levelTip` / `toast` wrappers, v15-a1 protected-hit line | `failText` style `rule` (a principle, ≤ 9 words, `w.rule` or a default). Older level texts go through `M14.api.nohint(s)`: an exact-text map `M14.api.NOHINT_TEXT` (L1–L36 fail lines, the spot-naming level tips of L6–36, the "Not yet …" toasts, "Hit the BACK first."). A batch that writes its own STD-v3 words is not touched. `L.tip2` (the "names the move after 2 fails" tip) is not used |

Kept: the L1 tutorial hand and the first-use hand of a new booster / material (`main/intro.js`, controls), cracks / smoke on hit members, the camera / zoom hint pill. Every level of the build has its own `L.yaw`, so the base game's "open facing `L.hint`" path is not reached (nothing to remove there).
Physics unchanged: determinism hashes L1 96.963% `1ba2f774`, L2 94.614% `cbd8dfb8`, L3 91.42% `5df229ac`, L4 92.225% `974ea912`, L5 91.521% `6cc30e68`, L32 88.257% `eae75bb9`.
Checks `ONLY=nohint node main/check-main.js`: N1 no dots (also with a TNT on a plan member), N2 no dots' tip, N3 no push-in, N4 fail line of L1–36 spot-free and ≤ 9 words, N6 level tip of L1–36 spot-free, N5 `?hints=1` brings the old aids back. Shots: `checkpoints/main-shots/nohint-L2.png`, `nohint-L32.png`, `nohint-L2-hints1.png`. Test hooks: `__blast.m14.tip()`, `failLine(code)`, `slots()`, `hints()`.

**Scripted newcomer, blind vs with hints (same build, 14/11, `levels6/shots/a1/tools/newcomer-main.js`, max 2 attempts; JSON `levels6/shots/a1/newcomer-nohint-{before,after}.json`).** Not retuned, only measured.

| Level | `?hints=1` (dots, push-in) | Default (no hints: taps the hero legs it sees) |
|---|---|---|
| L1 | win, attempt 1, 92.8% | win, attempt 1, 90.3% |
| L2 | win, attempt 1, 94.6% | win, attempt 1, 96.3% |
| L3 | win, attempt 1, 89.9% | lost both, 68.9% / 77.7% |
| L4 | win, attempt 1, 86.8% | lost both, 82.7% (hit the hospital) / 79.3% |
| L5 | win, attempt 1, 90.2% | lost both, 42.4% / 77.0% |
| L32 | win, attempt 2, 89.7% | lost both, 6% / 6% |
| Won within 2 | 6 / 6 | 2 / 6 |

STD-v3 says the T / R tiers need retuning if the blind newcomer falls below target: that is a level task for the batches (not done here).

## 12. Base types (D-blast-MATCURVE, 14/11/2026)

Owner: "đế trụ của tất cả các toà nhà ở các round đầu đều khó, cứng, khó đổ". Measured (`levels6/BASE-STATUS.md` §1): one TNT breaks any
wood / brick / concrete ground pier, but the building did not react: 3×2 timber houses lost 8–13 % to one post, 2×2 concrete blocks
2–8 %, and the heroes' tip rule only counted NEIGHBOURS (4 alternate legs of 8 gone: L2 10 %, L4 4 %).

Step `base` (`levels6/patch/v15-base.js`) adds a per-building setting in level data: `L.base = { "<part id>": preset | spec, "*": … }`;
a building with none behaves as before. Presets: `weak` (one ground pier lost → that side gives way, it drops leaning that way),
`weak-tip` (same, far side a 2.5 s hinge: tips like a tree), `stiff` / `stiff-tip` (two piers on one side, a pier between them allowed;
the first one already breaks the panels next to it), `crush` (two → straight drop), `keep` (the builder's own rule), `none`. Knobs:
`rule`, `n`, `reach`, `hold`, `sag`, `pierTnt`, `shove`, `own`, `force` (file header). Heroes that carry the v14 tip keep their hinge
and their own follow-up (L5 wedge): the setting only decides when it fires. Only ladder ground storeys (wpost / bk / concrete) take a
rule: steel, lattice, ladder `rc` and the RC tier are untouched. Deterministic (game-time timers only).

Data now (MATERIAL-CURVE mapping): L1 hero `weak-tip` (1 TNT drops it), L2–5 heroes `stiff-tip` (one leg never drops them; two on one
side do), every ladder neighbour of L1–12 `weak` (falls from one pier, like the 4-post sheds), L6–12 heroes `keep`. L1–5 in
`patch/v15-a1.js` (`set(…, { base:… })`), L6–12 in `tools/src-l1-12.js`. Test API `__blast.base.info()`.

Checks on the rebuilt main (sources `d535b948a218`, 14/11; the UI2 agent rebuilt it afterwards as `4b76c3939275` with step 22 `ui2` on top, base step kept, base checks not re-run on that file): loadcheck ok, 0 errors · `main/check-main.js` **86 PASS, 0 FAIL** ·
determinism (seq / after / fresh / wait / raf 2/2, live cold 1/1): L1 93.988% `bb9d05a4`, L2 95.578% `a48ee166`, L3 91.599% `746a1ac3`,
L4 93.389% `d115c0ab`, L5 91.353% `8d5be760` (new: the base rule moves L1–5), **L32 88.257% `eae75bb9` (unchanged)** · gate-bot L1–5:
expert 94 / 96 / 92 / 93 / 91 (+9 / +11 / +7 / +8 / +6), sensible 5/5, naive fails L3+, lesson-less fails L3–5 (L2 passes 86 %: T = n/a in
§4b). Earlier hashes in §11 are the `?base=0` state.

Blind newcomer (`newcomer-main.js`, `?dev=0`, 2 attempts; before = same build `?base=0`; logs `levels6/shots/base/logs/newcomer-*`):
L1 win a1 90.8 % (2 blasts) → **win a1 89 % with ONE tap** · L2 win a2 93.8 % → **win a1 94.5 %** · L3 lost 66 / 67 → lost 66 / 76 ·
L4 lost 87 / 87 (hit the hospital) → lost 84, **win a2 85.5 %** · L5 lost 75 / 44 → lost 74 / 75. Won within 2: **2/5 → 3/5**.

## 13. Controls TAP2 + rule cleanups (14/11/2026)

Step 25 `tap2` (`main/tap2-patch.js` appends `main/tap2.js` inside `main()`, after ui2). Decisions: D-blast-TAP2 (+ amendment 04:25),
TAPEXACT, NOSTACK, THRESH-2, NOLOT, COIN, ADOPT (3), SCHED (cards only). Status, numbers and open points: `TAP2-STATUS.md`.

- One tap = one TNT exactly where tapped (exact ray pick: member / glass pane / dress piece on its member; feel Q2 off; no lower-third
  snap for player taps; bots and the test API place as before, so the determinism hashes are unchanged).
- Placed TNT is permanent; a tap on / near one does nothing (same member <= 24 px, any <= 10 px). Double tap (<= 300 ms, <= 24 px,
  pointer timestamps) = one TNT there (never twice) + BLAST of all. Double tap no longer resets the camera.
- L1: no BLAST button, the hand double-taps a post and comes back onto a single-tapped TNT. L2: "New: BLAST" card (one line), then the
  hand taps leg A, leg B, BLAST. `main/intro.js`: Brick L3, Concrete L4, Blue building L5; Road / Lot / Stack rows gone.
- No street rule (the road stays as scenery), no lot6 paint on L36, win coins 10 / 20 / 30, loss 0; Daily / No Ads / coin "+" hidden.
- Checks: `ONLY=tap2` T1-T14; A2, A13, A20, I3, I11, I12 changed (cite the D-xxx); B21 / B22 coins; `blastBtn` = double tap on L1.

## 14. Gemini art TEST, step `gem-art` (Agents-Game, 22/11/2026)

Khai wants to compare the Gemini (Nano Banana) art with the current look. Step `gem-art` (`src/gemart/patch.js`) runs right before the Mac's `rs-look` (which stays last). **Off by default**: the normal build only carries the inert code; `?art=1` turns it on, `?art=0` off. `GEM_ART_DEFAULT=on node src/tools/build-main.js <out>` bakes it on for a test-link file only. View only: no rule, level, order, flow, save key or text changes.

- Assets: `python3 -I src/gemart/prep.py <dir with the 22 PNGs> src/gemart/assets` (magenta key with un-mix + de-spill, navy drop shadows kept, auto-crop, two-up sheets split, the A01g bar split into an empty track + the orange fill, textures flattened and seam cross-faded, C01 cut at the grass line). Prompts: floormen `games/blast/art/gemini-prompts-2026-11-22.md`. The 18 MB originals are not in the repo; 25 WebP, ~300 KB.
- UI (`gemart.css`, all under `html.gem`): green primary `.big.mint/.go`, `#inCard .inB`, result primary (9-slice `border-image`, caps from the element height `--gh` set by `gemart.js`; pressed / disabled images), blue `.big.sec`, cream `.pillbtn` / `.pmRow` rows, toggles `.tog .sw`, round `#pauseBtn` / `.round` / `.pmRound`, meter `#meter` / `#rMeter` + fills (`.go` gold and `r18prot` red by filter), panels `#settings .card` / `#result .card` / `.bcard` / `#inCard`, ribbon `#rTitle` / `.bhead` / `#settings .chead`.
- Icons: `--ul-ic-tnt` / `--ul-ic-ball` tokens, Net / Sky Strike tray tiles, the lock on locked slots, `.coin`, a TNT bundle on the TNT chip.
- 3D (`gemart-engine.js`, `gemart-engine2.js`): swaps the figmadirect `FD_MAT` inputs (glass / brick / concrete / steel / stone tiles in metres), a dark-pier branch inside the concrete hook (member colour / family colour < 0.74 = B06), and the C01 image as the far band (`LA_SKY.rep` 20, `main/look.js` band grade skipped on it).
