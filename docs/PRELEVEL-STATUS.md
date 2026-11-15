# City Blast! pre-level booster offer: status (D-blast-ADOPT item 2, 14/11/2026)

Owner approved: before a Hard (purple) or Boss (orange) level, a popup "Hard Level N" / "Boss Level N", "Pick Your Boosters", the 3 booster tiles, one Play and a ✕. Picked boosters spend 1 use when the level starts and are armed for the level. First popup after an unlock teaches the booster with the hand. Normal levels: no popup.

## Figma first (D-blast-FIGMAFIRST)

File `<figma-file>`, page "Booster Intro (13/11)":
- Component set `Pre-Level Offer` (85:237), both variants: close ✕ (44 px, header right end, nothing spent), header and body gradients (premium card family), a green check on the picked slot (Smash Fest's picked sign; the gold ring stays).
- New frames: **6c** Teach (113:736): hand from below on the new booster's tile + gold ring, 0 words. **6d** Hard before any unlock (113:784): three Locked slots Lv.11 / Lv.21 / Lv.31.
- PNGs re-exported to `design/booster-intro/6a…6d-*.png`; `design/booster-intro/SPEC.md` §3 rows 6a–6d and §5 updated.

## Code

| File | What |
|---|---|
| `main/prelevel.js` | The block (appended inside `main()`, after ui2 / tap2). Extends boosters2's existing `#bPick` card (no second popup, D-blast-NONEW). |
| `main/prelevel-patch.js` | Build step `prelevel` (pattern of `main/perf-patch.js`): one anchor `} // main`, a marker, checks the engine names it wraps; embeds `design/intro-premium/art-{wreck,net,sky}.webp` as data URIs. |
| `tools/build-main.js` | One line: step 26 `prelevel` after `tap2`. |
| `main/check-main.js` | Section **P** (`ONLY=pre`), items P1–P12. |

Behaviour:
- **O1 when.** All level entries that offer a card go through `bstPlay` (Home Play, map node, result Next, Upgrades Play, crane card). `bstWants` is wrapped: Hard / Boss → popup also before any booster is unlocked; the boosters2 retry rhythm is kept (not on the attempt right after the first fail of that level, again from the 2nd fail). Normal levels → unchanged (no popup). Try Again on the lose card starts the level directly, as before.
- **O2 tiles.** Always the 3 tray boosters (Wrecking Ball, Safety Net, Sky Strike) as 76 px round tiles with the premium 3D art: count badge (orange) / "+" (green, opens the existing buy sheet) / locked = grey disc, lock + "Lv.N" (the intro schedule level: 11 / 21 / 31; a tap shows the existing "Unlocks at level N" toast). Picked = gold ring + green check.
- **O3 cost.** At level start (`bstLevelStart` wrapped): Wrecking Ball = the boosters2 pick path (1 use = 2 throws, aim view opens, exactly the tray's path); Safety Net = 1 use now + `netArmed` (fences on BLAST); Sky Strike = 1 use now + `skyBtn()` once the plan phase is up (not auto-armed when the ball's aim view is open; its chip keeps the paid use). The use paid at the start is a credit: the booster's own later `bstUse()` takes the credit instead of a second use (`bstUse` / `bstHave` wrapped). A paid, unused pick shows the gold "on" ring on its tray chip. A new attempt clears the credit (an unused pick is spent, as in Smash Fest). ✕ spends nothing.
- **O4 teach.** First popup that holds a booster unlocked and owned and not yet taught: the intro hand (same SVG as `main/intro.js`) points up at its tile, the tile ring pulses; gone on any tap in the card, Play or ✕; `save.pre.t[k] = 1` (one booster per popup).
- Style: premium intro family (cream bevel card, ink 4 px, tier gradient header with light Lilita title, crown on Boss, glossy purple / orange Play 240 × 76), card centred inside the safe areas (`--sa-t` / `--sa-b` from ui2 §H), all tap targets ≥ 48 px, no text < 16 px, reduce motion = no pop / pulse / hand loop. `?pre=0` = the old boosters2 picker.

## Checks (14/11, build sources 9862eed7a61d, 390 × 844)

- `ONLY=pre` **13 PASS / 0 FAIL** (P1–P12 + Z1 no console errors): P1 Hard L7 popup (title, sub, 3 locked tiles Lv.11/21/31, purple Play, taps ≥ 48, no text < 16, on screen) · P2 locked tile not pickable · P3 ✕ = Home, nothing spent · P4 Boss L10 (crown, orange Play) · P5 Boss L20 with the Ball owned (count 2) · P6 Normal L1: no popup · P7 teach hand on the Ball tile · P8 pick = gold ring + check, taught saved · P9 Play: Ball 2→1 + aim view (2 throws), Net 1→0 + armed · P10 next popup teaches the Net; nothing picked = nothing spent · P11 Sky Strike picked: 2→1 at start, armed, building tap strikes (24 members) with no second use · P12 reduce motion + `?pre=0`.
- Other sections on the same build: home 23/1 (A20 = feel Q2 off, set by the parallel `tap2` step, TAPEXACT), lv 6/0, flags 6/0, nohint 7/0, fixes 3/0, intro 14/0, audio 13/0, ui2 6/0. **flow** stops after B7 (BLAST on L1 times out): same on the build without this step (`25-tap2.html`), i.e. tap2's "no BLAST on L1"; not this step.
- `tools/loadcheck.js checkpoints/index-main.html`: ok, title, 0 errors.
- Sheet: `checkpoints/main-shots/prelevel-sheet.jpg` (ours | Figma | SF; rows Hard locked, Hard owned + picked, Boss locked, Boss owned, Teach), made by `tools/prelevel-sheet.py` from the `pre-*.png` shots.

## Open / for the Lead
- MAIN-BUILD.md table and flags list do not have the `prelevel` row / `?pre=0` yet (not my file).
- Not committed, not published.
