# FW-1123 — win fireworks: more colours, 3 points, fired in sequence (Khai 23/11)

Code: `src/main/ui2.js`, section **W** (header comment, palette `FWC`, CSS `.cf.u2*`, `fxWin()`). `?ui2=0` = the old game (nothing here runs).

## What changed
- **Before:** one full-width rain of 96 pieces in the 3 Q7 colours (#FFB400 / #FF6A1A / #FFF4DC), all at once.
- **Now:** 6 firework bursts, one after another, **280 ms apart**: bottom-left → bottom-right → top-centre → bottom-left → bottom-right → top-centre.
  - Bottom corners: a white rocket rises from the corner (320 ms, slowing) to a pop point about a third in from the side, 31–36 % down the screen.
  - Top-centre: a shell pops 110 ms after its turn, 20 % down (under the top HUD row, above the card / CLEARED stamp).
  - Each pop: a white flash plus 24 pieces (rectangles and round sparks, 40 % round) fly out in a ring, slow down, fall and fade out in about 0.8–0.95 s.
  - Bursts pop at 0.32, 0.60, 0.67, 1.16, 1.44 and 1.51 s. Everything is gone by about **2.46 s**.
- **Why top-centre and not bottom-centre:** a rocket from the bottom middle would climb through the win card and its buttons. The sky above the card is the one empty area, and two low points plus one high point frame the card as a triangle.
- **Colours (9):** red #FF3B47 · orange #FF8A1F · lemon #FFEA3A · lime #A6F03A · green #16D27A · aqua #22E3D3 · hot pink #FF4FB8 · coral #FF7A59 · white. Each burst uses 3 of them, and each piece has a thin navy edge so it reads on the sky. There is no sky blue, and no purple or gold royal scheme. The 42 Q7 stamp pieces (`v13-feel`, inline colours) take the same palette through CSS `nth-child`.
- **Load:** 154 DOM pieces (6 × 24 pieces + 6 flashes + 4 rockets; was 96). They use the same `#feelLay .cf` layer and are animated with WAAPI transforms and opacity only. Each piece removes itself when it finishes. There are no timers: all pieces are created at once with WAAPI delays.
- **Unchanged:** when it fires (meter passes with CLEARED!, or at the latest on the win result), once per win, reduce motion = no extra pieces, sound and haptics (the Q7 "star" sting and win haptic). No new audio: the game has no pop or firework sound, and `coin_burst` would read as coins and add a haptic. The win card layout and positions are unchanged.

## Shots (real L1 win, 393 × 852, iPhone inset)
`fw-0.3s.jpg` … `fw-2.3s.jpg` are frames at 0.3 / 0.8 / 1.3 / 1.8 / 2.3 s after the bursts start. `fw-film.webm` is 2.6 s at 15 fps.

How they were made: the level's own solution, then BLAST (`__blast.test.fire`). The burst animations are held and stepped to each time, because software GL in headless Chrome runs far below real time. `fw-meta.json` holds the burst list from `__blast.ui2.fx().bursts`.
