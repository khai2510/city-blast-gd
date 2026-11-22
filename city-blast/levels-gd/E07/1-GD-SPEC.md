# E07 "Bathhouse": step 1, GD spec (easy pack, Normal, TEACH)

**Slot 7 in the plan. Role: TEACH** (restraint, gentle).
**Lesson (one line): a blue building to keep clear.** The first easy level with a protected building (keep6). Gentle: the school stands at a generous gap, so a careful player never comes close; only a big careless blast, or a hall tipped towards it, reaches it.

**Inspiration:** a domed public bathhouse of the early 1900s: a stucco hall with tall half-round "thermal" windows, an attic with pediments, a shallow copper dome with a glazed lantern, colonnades either side. Inspiration only: our own plan, sizes and colours, no real works. No duplicate of an F-landmark (the F-list's "dome hall" is a tall glass dome on a drum; this is a low saucer dome on a square attic), of H1–H5 or of E01–E06 (E05 is a tall brick drum with a slit dome).

## Shape (x: left → right; z+: towards the camera)

| Building | Position | Size | Structure | Role |
|---|---|---|---|---|
| **Bath hall** (A) | x 0 | 13 × 11 m, hall 6.5 m + attic 3.2 m + dome ≈ 14 m | **8 stucco brick piers** (`bk`, one TNT each, tip rule with a 1.6 s hinge), thermal windows front and back (`mglass`), brick side walls with arched windows, an attic storey (`bk` / `bkw`) with pediments; a shallow copper dome in two members (4 quarter pieces + a cap with a glazed lantern, `g7tile`); inside a big pool, benches and steam (decor on the terrace) | main: the dome drops into the hall |
| **Colonnade wings** (B, C) | x ±11.5, 2.6 m gap | 4.8 × 10 m, 4.6 m + tile roof | timber columns clad as marble (`wpost`), a back screen, changing booths and a fountain, a light tiled roof body (`g7roofL`) | **easy** |
| **School** (blue, keep6) | behind the right wing (x 11.5, z −14.5) | 2 floors | the game's protected school | **keep**: damage > 5 % loses |

Ordered layout: one axis, the wings a matched pair (same size, same gap, fronts in line); the school sits square behind the right wing, its front in line with nothing it could be confused with, and shows above the colonnade from the opening view.

## Mechanics (all existing)
`keep6` + `keep`, tip rule (`M14.api.tip`) on the hall piers, `hard7` scoring, `drop7` on `mdB` (plumbing only).

## Realization moment (no text, no arrows)
1. A big first blast (all the hall's piers at once, or the back-right piers) throws the dome and the attic back and right: the school is hit, the level is lost.
2. Two or three bombs on the front piers: the hall leans forward and the dome drops into the hall, the school untouched. "Small blasts drop it in place."

## Wow (chain)
The dome sinks straight into the hall, the lantern last, and the pool vanishes under the copper.

## Tester targets (Normal, easy pack)
| Test | Bar |
|---|---|
| oneBomb | < 70 % |
| allFoot / footOnly | < 80 % (or the blue hit > 5 %) |
| oneWave | reported only (the blue damage reported with it) |
| fair (blind: never aims away from the blue) | 3/3 wins, spare ≥ 2, ≥ 2 blasts, 20–75 s, blue ≤ 5 % |
| lesson probe | front piers (away from the blue) vs back-right piers (towards it): blue damage of each |
| curve | no jump > 40 points between consecutive bomb counts |
| at rest | nothing moves or dies in 8 s; 0 bonds cracked |

Fail line (≤ 9 words, a principle): **"Small blasts drop it in place. Keep blue clear."** No opening tip.

## As built (after tuning)
Positions, sizes and keys above are the first design. Tuning (Lead 22/11: lots ≤ ≈ 24 m; bar fixes) moved the layout and added heavy pieces; the built values, hero position and the reasons are in `E07-SUMMARY.md` ("Fixes made on the way").
