# INTROFIRST: intro cards before the level (Agents-Game, non-Mac code only)

Khai, 28/11/2026 (D-blast-INTROFIRST): "Cái tab hiện thông tin của những cái obstacle, booster nó phải xuất hiện trước khi level
đó chơi … Phải xuất hiện cái tab trước rồi mới tới level đó."

## What changed
- **Every intro card** of a level ("New: <thing>" for a material / obstacle / Blue Building, "<Booster> Unlocked!" + Claim ×2)
  now shows when the player **starts** the level: Home Play, a Map node, the result card's Next, Shop Play (all go through
  `bstPlay`). It opens over the screen the tap came from, **before `startLevel` builds the 3D**. Got It / Claim → the next card
  of that level (if any) → the level loads and plays its normal opening camera. Same card, same text, same art, same sounds.
- On a Hard / Boss level the order is **intro card → "Pick Your Boosters" → level** (the card wrap is the outermost `bstPlay`).
- What needs the 3D stays in the level, after the opening, unchanged: the material spotlight / forced tap (L4 Brick, L8 Concrete,
  L20 Glass, L25 Barrels, L40 Steel), the Blue Building look spotlight (L7), a booster's forced first use (L12 Ball, L30 Net,
  L45 Sky Strike), the swipe / "Blast in steps" / trap lessons, the L1 / L2 hands.
- A replay never re-shows a card (`save.intro[id].c`, set on Got It / Claim). A level started without `bstPlay` (the `?lv=`
  picker, Pause ▸ Restart) falls back to today's in-level card if the card was never seen.
- No tap-through: the card keeps swallowing taps while it fades, and for 450 ms after Got It no tap reaches what is under it
  (Home Play, the Map, the new level's canvas). A 2nd Play tap while a card is up does nothing.
- **Off switch `?introfirst=0`** = today's flow (card after the level has opened).

Code: `src/main/intro.js` (block "INTROFIRST": `inFirst`, `inPreNext`, `inPreCarry`; API `__blast.intro.first / pre / due`),
`src/main/polish.js` block **FX30** (the `bstPlay` wrap). Test helper `src/main/check-sflay.js` `playIn` claims a pre-level card
(see Checks). Check script: `city-blast/levels-gd/INTROFIRST/check-introfirst.js <game.html> <shots> [levels]`.

## Cards moved (from the build's own schedule after INTRO_AT)
| Level | Card | Entry tested | Then in the level |
|---|---|---|---|
| 2 | New: BLAST | Home Play | no spotlight (noForce), L2 hand |
| 4 | New: Brick | Home Play | brick spotlight (forced tap) |
| 7 (Hard) | New: Blue Building | **Map node** | Pick Your Boosters (first try, GD-68) → level → look spotlight |
| 8 | New: Concrete | Home Play, **Reduce Motion** | concrete spotlight |
| 12 | Wrecking Ball Unlocked! | **result card button** (bstPlay(levelIdx + 1)) | forced first use on the Ball chip |
| 20 | New: Glass | **Map node** | glass spotlight |
| 25 | New: Barrels | Home Play | barrel spotlight |
| 30 | Safety Net Unlocked! | Home Play | forced first use on the Net chip |
| 40 | New: Steel | Home Play | steel spotlight |
| 45 | Sky Strike Unlocked! | Home Play | forced first use on the Sky chip |

Per level (393 × 852, `?sa=59,0,34,0`, real Playwright touches, headless Chrome under `flock /dev/shm/chrome.lock`):
card up while `screen` is still title / result and `pre().open`; Got It (+ one more tap at once where Play was: tap-through
probe) → level + opening (`frame.opening()` seen); spotlight / forced use comes after it; **0 cards inside the level**; then
Pause ▸ Home ▸ Play again → **no card**. **30 PASS / 0 FAIL, 0 page errors** (levels 2 4 8 7 40 on the first run, 12 20 25 30 45
on the second, same sources `a56f08f3bd0c`; 7 and 4 re-run for the shots).

## Conflicts
- **GD-68** (Hard / Boss sheet on the first try): kept. The sheet still opens on the first try, now right after the intro card.
  check-r22 G1 / G2 pass. No conflict.
- **FIX-1128 U-9 (P1)** (empty Pick card skipped on a return visit): untouched; it decides inside the wrapped `bstPlay`, after the
  card. No conflict.
- **Hard levels from Mac**: no card shows on a Mac hard level (g7hard `inQueue` returns [] on `LV7O.isH`), so nothing to ask
  the Mac; no SYNC request. L7 Grand Arch (an old level with a Hard tier) keeps its Blue Building card, now before the level.
- The booster card's dismiss "flies into the tray slot" only when the slot is on screen; on Home / Map there is no tray, so the
  card shrinks (the existing material-card exit). The chip pop then happens in the level as the forced use starts.

## Checks (final build)
CHECKS_PLACEHOLDER

## Shots
SHOTS_PLACEHOLDER
