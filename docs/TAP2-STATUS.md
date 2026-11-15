# TAP2 status (controls + rule cleanups, 14/11/2026) — DONE, not committed

Decisions: D-blast-TAP2 (+ amendment 04:25), TAPEXACT, NOSTACK, THRESH-2, NOLOT, COIN, ADOPT (3), SCHED (cards only), NONEW, NOHINT, FIGMAFIRST.

## Files
- `main/tap2.js` + `main/tap2-patch.js` (new), step 25 `tap2` in `tools/build-main.js` (after ui2; the prelevel step 26 follows). `?tap2=0` = all old; `?street=1`, `?lot=1`, `?coin=0`, `?soon=1` = one part old.
- `main/intro.js`: INTRO_SCHED (L1 "Double tap a post" hand; L2 "New: BLAST" card `noForce`; Brick L2→L3, Concrete L3→L4, Blue building + rotate tip L4→L5; Road L21, Target Lot L36, Stack L13 rows removed), `noForce` handling in `inForcedWait`, BLAST button icon in MAT_SVG.
- `main/check-main.js`: section T (`ONLY=tap2`, T1–T14), B21/B22 coins, `dblTap` / `blastBtn` helpers (L1 is driven by a double tap); changed with the decision in the item text: A2, A13 (ADOPT 3), A20 (TAPEXACT: feel Q2 off), I3, I11, I12 (SCHED: Brick on L3).
- `levels6/shots/a1/tools/newcomer-main.js`: `MODE=blast` (single taps + BLAST; L1 = double tap on a placed TNT), `MODE=dbl` (last leg is a double tap), `MODE=old`.
- `MAIN-BUILD.md` §2 flags + §13.
- Figma <figma-file>, page "Intro cards premium (14/11)": frame 116:1025 "New: BLAST · L2", frame 116:1071 "L1 · double tap hand, no BLAST", note 116:1084 (motion spec). Built from the kit (Card / Frame, Header Ribbon, Go Glossy, Hand / Pointer 83:25, Tap Ripple 97:92).

## What the game does now
| | Behaviour |
|---|---|
| Single tap | 1 TNT exactly at the finger (exact ray pick incl. glass panes and hero-dress pieces on their member; no tap assist, no Q2 rings, no lower-third snap). T2: 0.6 px from the tap |
| Placed TNT | permanent: no select, no x, no undo, no move |
| Tap on / near a TNT | nothing (same member ≤ 24 px, or anything ≤ 10 px: two legs side by side are ~16 px apart at the L2 opening) |
| Double tap | ≤ 300 ms, ≤ 24 px (pointer timestamps) → 1 TNT (never two), then the BLAST button's own call (all placed TNT) |
| L1 | no BLAST button; hand double-taps a post; after a single tap the hand sits on the blinking TNT |
| L2 | "New: BLAST" card ("Tap to place. BLAST to blow them all.", 8 words, Got It), BLAST shows, hand: leg A → leg B → BLAST |
| Street | rule gone (road kept as scenery; L.street moved aside after the build): no STREET BLOCKED, no street pill / Q8 icon, road / lot / stack sentences dropped from tips and fail lines (7 road levels: 21, 22, 23, 24, 28, 30, 36) |
| Lot | L36 lot6 paint not built, card gone |
| Coins | win 10 / 20 / 30 (28 / 5 / 3 levels), loss 0 |
| Home | Daily, No Ads, coin "+" hidden (CSS, code kept); Shop tab toast unchanged |

## Numbers (combined build, 26 steps, sources 4ac078a549bc)
- check-main full: 120 PASS / 1 FAIL (A20, then fixed) → `ONLY=home` re-run 24/24; `ONLY=tap2` 15/15. 0 console errors.
- loadcheck: ok=true, 0 errors.
- Determinism (R-11, MAXL=36, LIVE=0) L1–5 + L32: DETERMINISTIC, hashes identical to the build without tap2: L1 93.988 % bb9d05a4 · L2 95.578 % a48ee166 · L3 91.599 % 746a1ac3 · L4 93.389 % d115c0ab · L5 91.353 % 8d5be760 · L32 88.257 % eae75bb9 (no new hashes to record).
- Newcomer (blind, `?dev=0`, 2 attempts; JSON `levels6/shots/a1/newcomer-tap2-{before,after-blast,after-dbl}.json`):

| L | before (old build, BLAST) | after, single taps + BLAST | after, double tap |
|---|---|---|---|
| 1 | win a1 90.8 % | win a1 88.2 % | win a1 89.0 % |
| 2 | win a1 94.1 % | win a1 93.8 % | win a1 94.4 % |
| 3 | lost 67 / 75.8 % | **win a1 94.3 %** | **win a1 88.5 %** |
| 4 | lost 83.5 / 84.2 % | lost 83.5 / 87.7 % (hit the blue) | lost 83.5 / 83.5 % (hit the blue) |
| 5 | lost 75.5 / 75.8 % (hit the blue) | lost 78.9 / 78.5 % | lost 78 / 78.8 % (hit the blue) |
| won ≤ 2 | 2 / 5 | 3 / 5 | 3 / 5 |

L3 wins now because the exact tap lands on the legs the newcomer sees (the old snap / redirect moved two of its taps). L4 / L5 still need the level retune (STD-v3, batches).

## Open points / proposals (not built, D-blast-NONEW)
1. Camera reset: double tap no longer resets; BLAST still does. There is no existing zoom / camera pill to tap (the only pill is the zoom hint, shown briefly on monument levels), so no manual reset exists now. Proposal: make that hint pill tappable, or keep reset-on-BLAST only.
2. Auto fuse kept: placing the LAST TNT still starts the 3-2-1 auto fuse (also on L1, where it is the only way to blast without a double tap). Tapping a TNT no longer stops it (nothing to move / remove); BLAST fires it at once.
3. A tap on a glass pane now puts the TNT on the pane (TAPEXACT); hero-dress taps carry the TNT on the dress surface, attached to its member.
4. L5 card "Keep the blue building safe" moved with the schedule; L4 also has a blue building with no card until the geometry pass.
