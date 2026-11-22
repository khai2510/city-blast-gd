# rs-look: H2H Royal Smash visual layer (Mac, 22/11/2026)

Khai (22/11): "chạy design polish cho game, theo royal smash, h2h compared, làm nhiều round, để đạt được chất lượng tiệm cận".

Build step `rs-look` is the **last** step of `src/tools/build-main.js` (Mac's own step; the other steps are untouched).

- **What it changes:** visual only. No rule, level, member, charge, save key, text or camera is changed.
- **Turn it off:** `?rs=0`.
- **API:** `window.__blast.rs`.
- **Royal Smash screenshots:** kept on the Mac only. This repo is public, so no third-party images go in it.

## Rounds

Each round: shoot CB (headless, 430×932 @2x, `?dev=0`), put it next to the RS shots, fix, shoot again.

| Round | What H2H showed | Change |
|---|---|---|
| R1 HUD / foreground | RS: a cannon dais at the bottom, so there is never dead space. Boosters are solid discs with a gold ring.<br>CB: the bottom ~35% was empty lawn, and the locked booster chips were grey see-through bubbles floating on the grass. | `#rsDeck`: a construction-site deck under the tray (cream concrete, curved navy/yellow hazard rim). It is shown only while `#bottom` is visible and has `pointer-events:none`.<br>Locked chips: slate disc, gold ring, white `Lv.N`.<br>BLAST: top gloss. |
| R2 value contrast | RS: the objects contrast clearly with the ground.<br>CB: cream / stone heroes stood on a cream lot (L10, L18). | Lot tint 0.84,0.80,0.74 (a little darker, neutral). A warm tint was tried first and dropped: it sank the orange L1 windmill.<br>`?rslot=r,g,b` to try other tints. |
| R3 juice | RS: the board is always "alive" (idle sparkles, a trail on every shot). | BLAST shine sweep while armed; the TNT card pops when its count changes. Both are off with Reduce motion (OS setting or `save.rm`). |

Checked:
- L1, L10 (H2), L16 (H3), L18, L20 (H1), L30 (H4), L36 (H5): the deck covers no hero.
- Pause: the scrim covers the deck.
- Result screen: the deck is hidden.
- `?rs=0` gives the old look.
- No console errors.

## Not done yet (proposals, not in this layer)

- Material colour language per material (glass / brick / RC): this touches the level look (Agents-Game's `main/look.js`).
- Damage states (cracks before collapse) and TNT placement flash: these need engine work.
- Pre-level / fail popups: already close to RS. Optional: a pattern on the ribbon and a darker scrim on fail.
