# Royal Smash (Cypher Games) vs City Blast: visual and UI study, 22/11

This summarises the Mac session's second report, made at Khai's request: visual design only, no game design (GD). It replaces the GD notes of the first report.

Royal Smash (RS) was played on Khai's phone. The Mac kept 12 RS shots and 3 City Blast shots (home, L1, L40). They are not stored in this public repo.

This is reference, not a task. Khai decides what to apply (D-blast-NONEW). Take principles only: do not reuse RS's cannon, crown, royal palette, table-and-pole or name.

## 1. What makes Royal Smash look polished

- **Shapes:** every play object is one rounded cube on a 1-unit grid. Each has a bevel, a lit top edge, a darker bottom edge, and an inset panel with a debossed icon. The look is toy-like and very readable.
- **Materials:** three, far apart in value and saturation:
  - pale translucent cyan ice with sparkles;
  - matte dark navy;
  - glossy saturated orange.

  They stay distinct even in a greyscale thumbnail.
- **Colour:** small palette. The background is warm (sand) and the board is cool, so the board pops without outlines.
- **Background:** bright and sparse, with props only at the edges.
- **Camera:** fixed front view with the whole structure centred and margins around it. The cannon sits in the foreground, cropped by the bottom edge, which gives depth and a sense of "my tool".
- **HUD:** six elements, all in the corners; the centre stays clear.
  - Top-left: a white Balls card with a dark label tab, gold trim and a huge number.
  - A navy gear with a gold ring.
  - Purple booster circles with gold rings; the icons spill out of the circle.
  - Badges: a red count, a green "+", and a blue "▶+1" pill.
- **Typography:** one rounded heavy font with white fill, dark stroke and drop shadow. Numbers are 2–3× the size of labels.
- **Popup kit:** every popup reuses the same pieces:
  - a navy header with a gold frame;
  - a cream panel;
  - a green CTA;
  - a red round X;
  - a faint background pattern;
  - a "⚠ Super Hard! ⚠" banner.
- **Settings:** a vertical dropdown of 4 round buttons over a dimmed screen, not a separate panel.
- **VFX:**
  - muzzle flash;
  - a light beam showing the trajectory through the ice;
  - sparkles along the trail;
  - blocks that tumble in 3D on impact, and a stack that sways;
  - idle sparkles on the ice.

## 2. City Blast now, compared

| Area | Now | Suggestion |
|---|---|---|
| Materials | Realistic textures but low value contrast. The windmill is brown on brown dirt; in L40 the red and green houses have similar value. | Give each material one value and colour code used everywhere: light-cyan glass, warm-orange brick, dark cool-grey reinforced concrete. Add a light rim light or outline so the building separates from the ground. |
| Background | Grass, trees, fences and road weigh as much as the building. | Thin out props near the building, add distance fog or desaturation and a light vignette. Make the building the warmest and most saturated thing on screen. |
| Camera | At L40 the buildings fill the screen and cover each other. | Default framing shows the whole structure with 10–15% margin. |
| HUD (L1) | Three grey locked booster slots float mid-scene beside the building. Frame styles are mixed: navy pill, grey circles, blue card with gold border. | Move boosters to a bottom bar or the corners, and shrink or hide locked slots until they unlock. Use one frame style. |
| Home | The Mac checked again: the double CTA and double sign were in the old `base-main.html` only, not in the current main build. | Nothing to fix. |
| Typography | Already close to RS. | Standardise three text tokens (title, label, number) with one stroke and one shadow. |
| Foreground | No "tool" is visible. | Consider our own detonator or plunger, cropped at the bottom edge and animated on BLAST. |
| VFX | — | Flash on each TNT placement; short shake plus a dust ring on BLAST; chunky debris; idle animation (flag, crane, smoke); crack states before collapse. |

## 3. Wider comparison (general knowledge)

- **Royal Match-style premium casual:** gold frames and chunky icons. RS borrows this kit, which is why it looks expensive. City Blast should build its own kit with the same structure in its own colours, for example construction yellow, navy and concrete white.
- **Classic physics destruction (wood, stone, glass):** materials are told apart by colour, and cracks show before a break. This is what City Blast lacks most.
- **Hypercasual tower smash:** very readable but not premium. RS sits between this and Royal Match, and City Blast should aim for the same spot.

## 4. Polish priorities (no game-design changes)

1. Material colour code plus rim light.
2. HUD cleanup: boosters to a bottom bar, handle the locked slots, one frame style.
3. ~~Home screen double CTA~~: not in the current main build.
4. Background fog and fewer props near the building.
5. Popup kit plus a difficulty banner.
6. Juice: TNT flash, BLAST shake and dust, damage states, idle animation.
7. Optional: a foreground detonator.

## Done by the Mac (22/11)

- The `rs-look` build step is the last step of `src/tools/build-main.js` (source in `city-blast/rs-look/`, commits 5d4e173 and cefc0d4; `?rs=0` turns it off). It adds:
  - a site plinth under the tray;
  - navy and gold locked booster slots;
  - gloss and a sweep on the BLAST button;
  - a bounce on the TNT card;
  - a darker lot.
- Still open on our side: the material colour code, crack states, and the TNT-place flash.
