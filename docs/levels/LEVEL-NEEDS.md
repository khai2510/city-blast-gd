# City Blast! level needs L1–36 (built against **STD-v1**)

Written 13/11/2026 for D-blast-ROLLOUT, step 1 (Owner: rebuild every level except L32 on (1) our curve, (2) a defined need per level, (3) the L32 standard).
This sheet does not build or edit levels. Machine-readable twin: `levels6/LEVEL-NEEDS.json` (same data; regenerate both together).

- **Standard:** STD-v1 = L32 "Sky Saucer" as of round 6, commit b3d77b3f (L32-MONUMENT.md §3e). Tier scaling: skill `blast-level-standard` §4b; changelog §10. When the standard moves to STD-v2+, the **targets** column of every entry follows §4b automatically; the TNT, aids and "done when" lines are re-read by the batch.
- **Curve:** LEVEL-BRIEF-100 §2–3 (10-level template, tier bands) + PLAN §3 sawtooth, with the built curriculum of L13-36-STATUS §1 (stack L13, RC L17, street L21, glass L25, barrels L32, lot L36: K4).
- **Fixed on every level:** PASS 85%, protected ≤ 5%, street ≤ 10%, unlimited waves (D-blast-THRESH); hero from the tile, difficulty from surroundings only (D-blast-HERO-PROC); monumental hero with glass + interiors + camera (D-blast-HERO-MONUMENT); no body cap (D-blast-NOCAP); expert ends with 0–1 TNT (D-blast-TNTTIGHT).
- Bot numbers: zero upgrades, 4 seeds, not player data. L1–12 bots: L1-12-DRESS §3; L7–L11 heroes were swapped after that gate (no gate on record). L13–36: L13-36-STATUS §9.3.
- Tester: one first-time player on prev-lv6 (1–3 attempts, software GL). Difficulty 1–5.
- Difficulty index 1–10: target from the tier and slot; "tester today" = 2 × tester difficulty − 1 (1→1, 3→5, 5→9).

Contents: §1 curve table and chart · §2 sawtooth check · §3 the 36 entries · §4 batch plan · §5 cross-level problems · §6 decisions for Owner.

## 1. Curve: target vs today

| L | Band slot | Tier now → target | Role | Hero | Batch | TNT now (expert) → target | Target diff | Tester today | Bot today (short) |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 1·x1 | T → **T** | teach | F27 windmill | A1 | 5 (4) → 5 | 1 | 3 | expert 4/4 99.1% (+14.1) |
| 2 | 1·x2 | T → **T** | experience | F28 lighthouse | A1 | 5 (4) → 5 | 2 | 5 | expert 4/4 89.97% (+5.0: under the T margin ≥ +8) |
| 3 | 1·x3 | N → **N** | experience | F01 clock tower | A1 | 8 (6) → 7 | 3 | 7 | expert 4/4 94.8% (+9.8, over the N band) |
| 4 | 1·x4 | N → **N** | teach | F16 deco needle | A1 | 8 (6) → 7 | 4 | 7 | expert 4/4 90.9% (+5.9) |
| 5 | 1·x5 | N → **N** | experience | F24 wedge block | A1 | 9 (9) → 8 | 4 | 5 | expert 4/4 92.7% (+7.7) |
| 6 | 1·x6 | N → **N** | experience | F14 dome hall | B1 | 11 (10) → 10 | 5 | 7 | expert 4/4 92.0% (+7.0) |
| 7 | 1·x7 | H → **H** | combine | F10 triumphal-type arch | B1 | 12 (12) → 11 | 7 | 9 | NOT GATED since the F09→F10 swap (L1-12-DRESS §3 is the old Clock/Lift gate); old hint follower 0/4 |
| 8 | 1·x8 | R → **R** | teach | F03 lattice tower | A2 | 10 (10) → 9 | 3 | 3 | NOT GATED on F03 (old gate: The Beacon 93.3% +8.3, lesson-less 0/4) |
| 9 | 1·x9 | N → **N** | experience | F04 saucer tower (= L32 tile) | A2 | 10 (10) → 9 | 5 | 5 | NOT GATED on F04 (old: 91.3% +6.3, written plan needed a clean-up blast) |
| 10 | 1·x10 | SH (boss label) → **B** | boss | F09 lift bridge | C1 | 11 (11) → 12 | 8 | 9 | NOT GATED on F09 (old boss: 92.2% +7.2, hint follower 0/4) |
| 11 | 2·x1 | R → **R** | teach | F05 shell hall | B1 | 7 (6) → 8 | 3 | 7 | NOT GATED on F05 (old Dome Fair 88.5%, +3.5: thinnest L1-12 margin); lesson-less (one blast) 0/4 |
| 12 | 2·x2 | N → **N** | experience | F21 pedestal | A2 | 9 (9) → 9 | 4 | 5 | expert 4/4 88.96% (+3.96) |
| 13 | 2·x3 | R → **R** | teach | F17 cable bridge | C1 | 10 (8) → 9 | 3 | 7 | expert 4/4 94.6% (+9.6) |
| 14 | 2·x4 | N → **N** | experience | F28 lighthouse (reuse A1) | A2 | 9 (8) → 9 | 5 | 7 | expert 4/4 93.5% (+8.5) |
| 15 | 2·x5 | N → **N** | experience | F30 twin sail towers | A2 | 10 (9) → 10 | 5 | 3 | expert 4/4 90.9% (+5.9) |
| 16 | 2·x6 | H → **H** | combine | F14 dome hall (reuse in B1) | B1 | 12 (12) → 12 | 7 | 9 | expert 4/4 96.6% (+11.6: over the H band) |
| 17 | 2·x7 | R → **R** | teach | F21 pedestal (reuse A2) | A3 | 10 (8) → 9 | 3 | 5 | expert 4/4 89.3% (+4.3) |
| 18 | 2·x8 | N → **N** | experience | F24 wedge (reuse A1) | A3 | 10 (9) → 10 | 5 | 5 | expert 4/4 91.8% (+6.8) |
| 19 | 2·x9 | N → **N** | experience (surprise) | F35 cube houses | B1 | 10 (9) → 10 | 5 | 5 | expert 4/4 98.0% (+13.0: over the N band) |
| 20 | 2·x10 | SH (boss label) → **B** | boss | F32 steel arch bridge | C1 | 11 (10) → 12 | 9 | 5 | expert 4/4 89.2% (+4.2) |
| 21 | 3·x1 | R → **R** | teach | F22 stepped tower | A3 | 10 (8) → 9 | 3 | 5 | expert 4/4 97.8% (+12.8) |
| 22 | 3·x2 | N → **N** | experience | F26 pencil tower | A3 | 11 (10) → 10 | 5 | 7 | expert 4/4 96.2% (+11.2: over the N band) |
| 23 | 3·x3 | N → **N** | experience | F34 tube bundle | A3 | 11 (9) → 10 | 6 | 7 | expert 4/4 95.7% (+10.7) |
| 24 | 3·x4 | H → **H** | combine | F16 deco needle (reuse A1) | A4 | 11 (10) → 11 | 8 | 7 | expert 4/4 98.7% (+13.7: H wants +3…+6) |
| 25 | 3·x5 | R → **R** | teach | F06 glass pyramid | A4 | 10 (8) → 9 | 4 | 7 | expert 4/4 97.3% (+12.3) |
| 26 | 3·x6 | N → **N** | experience | F25 bullet tower | A4 | 9 (8) → 9 | 5 | 7 | expert 4/4 90.8% (+5.8) |
| 27 | 3·x7 | N → **N** | experience | F31 glass shard | A4 | 11 (10) → 10 | 6 | 7 | expert 4/4 95.4% (+10.4) |
| 28 | 3·x8 | H → **H** | combine | F07 three spires + bridges | C1 | 11 (10) → 11 | 8 | 3 | expert 4/4 91.7% (+6.7) |
| 29 | 3·x9 | N → **N** | experience (surprise) | F01 clock tower (reuse A1) | A4 | 11 (10) → 10 | 6 | 7 | expert 4/4 92.4% (+7.4) |
| 30 | 3·x10 | SH (boss label) → **B** | boss | F12 stepped supertall | A5 | 12 (12) → 12 | 9 | 7 | expert 4/4 90.0% (+5.0) |
| 31 | 4·x1 | R → **R** | breather | F19 segment tower | A5 | 10 (8) → 9 | 4 | 7 | expert 4/4 89.3% (+4.3: R wants ≥ +6) |
| 32 | 4·x2 | N → **N** | teach (STANDARD / reference) | F04 saucer tower | STD | 9 (8) → 9 | 6 | 7 | standard (STD-v1) |
| 33 | 4·x3 | N → **N** | experience | F03 lattice tower (reuse A2) | A5 | 9 (8) → 9 | 5 | 7 | expert 4/4 93.3% (+8.3) |
| 34 | 4·x4 | N → **N** | experience | F01 clock tower (reuse A1) | A5 | 10 (9) → 10 | 6 | 5 | expert 4/4 93.8% (+8.8) |
| 35 | 4·x5 | H → **H** | combine | F14 dome hall (reuse in B1) | B1 | 10 (9) → 11 | 8 | 3 | expert 4/4 89.8% (+4.8) |
| 36 | 4·x6 | R → **R** | teach | F30 twin sails (reuse A2) | A5 | 10 (8) → 9 | 4 | 5 | expert 4/4 95.1% (+10.1) |

Chart (difficulty 1–10; `T` = target, `x` = tester today, `*` = both on the same point). Gaps of ≥ 3 are marked `<<` (today far harder) or `>>` (today far easier).

```
L01 T  |T.x.......|
L02 T  |.T..x.....|  <<
L03 N  |..T...x...|  <<
L04 N  |...T..x...|  <<
L05 N  |...Tx.....|
L06 N  |....T.x...|
L07 H  |......T.x.|
L08 R  |..*.......|
L09 N  |....*.....|
L10 B  |.......Tx.|
L11 R  |..T...x...|  <<
L12 N  |...Tx.....|
L13 R  |..T...x...|  <<
L14 N  |....T.x...|
L15 N  |..x.T.....|
L16 H  |......T.x.|
L17 R  |..T.x.....|
L18 N  |....*.....|
L19 N  |....*.....|
L20 B  |....x...T.|  >>
L21 R  |..T.x.....|
L22 N  |....T.x...|
L23 N  |.....Tx...|
L24 H  |......xT..|
L25 R  |...T..x...|  <<
L26 N  |....T.x...|
L27 N  |.....Tx...|
L28 H  |..x....T..|  >>
L29 N  |.....Tx...|
L30 B  |......x.T.|
L31 R  |...T..x...|  <<
L32 N  |.....Tx...|
L33 N  |....T.x...|
L34 N  |....xT....|
L35 H  |..x....T..|  >>
L36 R  |...Tx.....|
       1........10
```

Read-out: the early game is the problem. L2, L3, L4, L11, L13 sit 3 points above target and L6, L7, L16 2 above for a first-time player, while the bots win them comfortably (the solution exists but cannot be seen: §5 problem 1). Most L13–L34 normal levels sit at 7 vs a 5–6 target (TNT tight + steel cost). Two Hards (L28, L35) are far easier than target, L32 (monument, round 5) is harder than its N slot until round 6 is re-tested by a person.

## 2. Sawtooth check (target tiers above)

| Rule | Result | Detail |
|---|---|---|
| No two H/SH/B in a row | **PASS** | H/B at 7, 10, 16, 20, 24, 28, 30, 35: never adjacent (28 → 29 N → 30 B is the tightest). |
| Breather after every boss | **PASS** | L11 R, L21 R, L31 R. After Hards: L8 R, L17 R, L25 R, L36 R; L29 (after L28 H) is N: acceptable (brief: "after most Hards"). |
| Max one new thing per level | **FAIL ×3 (+1 watch)** | L32: barrels + the RC hero both first appear (fixed by K1 = A: RC taught at L17). L11: multi-blast lesson + Wrecking Ball first free use (move the Ball pointer to L12). L21: street lesson + Safety Net first free use (move the Net pointer to L22). Watch L2: brick + first domino (brick keeps the count rule: counted as reuse). |
| H/SH/B never introduce | **FAIL ×1** | L35 Hard introduces trap barrels (show a trap on L34 first, or drop it). |
| H ≤ 3 mechanics, boss ≤ 4 | **FAIL ×3** | L16 H = rotate + direction + stack + protected (4); L28 H = glass + RC + stack + protected (4); L30 boss = street + protected + glass + stack + RC + multi-blast (6). |
| First Hard is the easiest Hard | **FAIL** | L7 (first Hard) is the hardest early level for the tester (5/5, 41%); L28/L35 Hards read as easy (2/5). |
| Same look = same rule | **FAIL (until K1)** | Ladder `rc` dark pier = 1 TNT on contact (L12 core, L17–L31 "dark piers"); M14_RC hero pier = 3 TNT. Both are dark/grey concrete piers with different rules. |
| TNTTIGHT (expert ends with 0–1) | **FAIL ×9** | 2 spare on L3, L4, L13, L17, L21, L23, L25, L31, L36 (brief §6.3 "teach: expert ≤ given − 2" is superseded by D-blast-TNTTIGHT). |

Every FAIL is listed in the entry of the level that carries it; the fixes are surroundings / tip / pointer moves, except "same look = same rule" (K1).

## 3. The 36 entries

Targets come from skill §4b for the level's tier; the fixed thresholds are not repeated. "Aids" follow the L32 order: 1 camera opening, 2 barrels/drums at key legs, 3 dots/pips, 4 cleanup dots, 5 fail-text wording.

### L1 Old Whirly · T · teach

| Field | Need |
|---|---|
| Curve slot · tier | band 1, x1 · T → **T** (target difficulty 1/10) |
| Role | teach |
| Lesson (≤ 6 words) | "Tap a post. Then BLAST!" |
| New / reused | new: tap + BLAST; wood · reused: — |
| Hero · batch | F27 windmill · A1 |
| Materials | hero wood (posts) · market hall wood |
| RC | no: ladder material of the lesson (needs K1 = A) |
| TNT | now 5 (expert 4) → **given 5, expert uses 4–5** (spare 0–1, D-blast-TNTTIGHT) |
| Targets (§4b T) | expert 4/4, margin ≥ +8, 1 blast(s) · sensible 4/4 in 1 blast · variants 8/8 · naive may win · lesson-less n/a · foot not gated · search not gated · hero lock: none · time-bot 60–75 s |
| Aids | 1 push-in on the solution side (monIn) + finger pointer on the first member · 2 n/a (barrels taught at L32); painted yard marks the key legs on T/R/N-teach · 3 cue dots from the first second on every solution member, plus the tip line · 4 cleanup: yes · 5 exact count and place in on-screen words ("Two TNT on each front leg") |
| Problems: bots | expert 4/4 99.1% (+14.1), sensible 4/4, foot random 14/16 (T: not gated) [L1-12-DRESS §3] |
| Problems: tester | First TNT does ~2% and shows "Didn't budge": reads as a fail on L1; waves not explained. (difficulty 2/5) |
| Done when | a scripted and a blind newcomer win on attempt 1; the first TNT visibly breaks its post (no "Didn't budge" on L1); T row of §4b green; tile score ≥ 4. Plus: built and gated against the newest STD (skill §8). |

### L2 Stripey Point · T · experience

| Field | Need |
|---|---|
| Curve slot · tier | band 1, x2 · T → **T** (target difficulty 2/10) |
| Role | experience |
| Lesson (≤ 6 words) | "Tip it onto the row." |
| New / reused | new: brick (same count rule as wood: one TNT per pier) · reused: tap + BLAST |
| Hero · batch | F28 lighthouse · A1 |
| Materials | hero brick · 3 boathouses wood |
| RC | no: ladder material of the lesson (needs K1 = A) |
| TNT | now 5 (expert 4) → **given 5, expert uses 4–5** (spare 0–1, D-blast-TNTTIGHT) |
| Targets (§4b T) | expert 4/4, margin ≥ +8, 1 blast(s) · sensible 4/4 in 1 blast · variants 8/8 · naive may win · lesson-less n/a · foot not gated · search not gated · hero lock: none · time-bot 60–75 s |
| Aids | 1 push-in on the solution side (monIn) + finger pointer on the first member · 2 n/a (barrels taught at L32); painted yard marks the key legs on T/R/N-teach · 3 cue dots from the first second on every solution member, plus the tip line · 4 cleanup: yes · 5 exact count and place in on-screen words ("Two TNT on each front leg") |
| Problems: bots | expert 4/4 89.97% (+5.0: under the T margin ≥ +8), naive 4/4 |
| Problems: tester | "Aim low" only learnt from the fail tip (lost at 77% aiming mid-height); settle phase drags. (difficulty 3/5) |
| Done when | expert margin ≥ +8; cue dots sit on the low piers; blind newcomer wins on attempt 1; T row green. Plus: built and gated against the newest STD (skill §8). |

### L3 Old Tock · N · experience

| Field | Need |
|---|---|
| Curve slot · tier | band 1, x3 · N → **N** (target difficulty 3/10) |
| Role | experience |
| Lesson (≤ 6 words) | "Start the row from the right." |
| New / reused | new: concrete (variant: one TNT per grey column) · reused: count piers, domino |
| Hero · batch | F01 clock tower · A1 |
| Materials | hero brick on stone (concrete) piers · row brick/concrete/wood |
| RC | no: ladder material of the lesson (needs K1 = A) |
| TNT | now 8 (expert 6) → **given 7, expert uses 6–7** (spare 0–1, D-blast-TNTTIGHT) |
| Targets (§4b N) | expert 4/4, margin +3 … +8, 1–2 blast(s) · sensible 4/4, ≤ 2 blasts · variants 6–8/8 · naive 0–1/4 · lesson-less 0/4 · foot ≤ 1/16 · search ≤ 2/24 · hero lock: ≤ (hero min − 2) never · time-bot 95–140 s (L32: 100 s) |
| Aids | 1 push-in on the hero foot (monIn), neutral yaw · 2 n/a (barrels taught at L32); painted yard marks the key legs on T/R/N-teach · 3 damage dots only (appear on a hit member; no cue) · 4 cleanup: yes (= L32 round 6) · 5 trick + place in on-screen words (= L32) |
| Problems: bots | expert 4/4 94.8% (+9.8, over the N band), naive 4/4 (N wants 0–1/4), 2 TNT spare (TNTTIGHT) |
| Problems: tester | Lost twice (22%, 70.6%); fail tip "Tip the right tower left" not actionable; budget leaves no room. (difficulty 4/5) |
| Done when | given 7 / expert 6–7; naive ≤ 1/4; fail text names side + count; N row green; owns the F01 part function (reused L29, L34). Plus: built and gated against the newest STD (skill §8). |

### L4 Needle Court · N · teach

| Field | Need |
|---|---|
| Curve slot · tier | band 1, x4 · N → **N** (target difficulty 4/10) |
| Role | teach |
| Lesson (≤ 6 words) | "Turn around. Blast the back." |
| New / reused | new: rotate the view (protected school/hospital are the reason) · reused: count piers, domino |
| Hero · batch | F16 deco needle · A1 |
| Materials | hero concrete (grey stone) · office block brick · protected ×3 |
| RC | no: ladder material of the lesson (needs K1 = A) |
| TNT | now 8 (expert 6) → **given 7, expert uses 6–7** (spare 0–1, D-blast-TNTTIGHT) |
| Targets (§4b N) | expert 4/4, margin +3 … +8, 1–2 blast(s) · sensible 4/4, ≤ 2 blasts · variants 6–8/8 · naive 0–1/4 · lesson-less 0/4 · foot ≤ 1/16 · search ≤ 2/24 · hero lock: ≤ (hero min − 2) never · time-bot 95–140 s (L32: 100 s) |
| Aids | 1 push-in on the hero foot (monIn), yaw faces the solution side (= L32) · 2 n/a (barrels taught at L32); painted yard marks the key legs on T/R/N-teach · 3 cue dots from the first second on the solution members (= L32) · 4 cleanup: yes (= L32 round 6) · 5 trick + place in on-screen words (= L32) |
| Problems: bots | expert 4/4 90.9% (+5.9), lesson-less 0/4, foot 0/16, 2 TNT spare (TNTTIGHT) |
| Problems: tester | Rotation found by accident; no fall-direction cue; both tries crushed the school; fail tip names the wrong protected building. (difficulty 4/5) |
| Done when | turn button + pointer on first visit; fail text names the building that was hit; lesson-less 0/4; blind newcomer understands the turn by attempt 2. Plus: built and gated against the newest STD (skill §8). |

### L5 Doorstop Corner · N · experience

| Field | Need |
|---|---|
| Curve slot · tier | band 1, x5 · N → **N** (target difficulty 4/10) |
| Role | experience |
| Lesson (≤ 6 words) | "Fall away from the blue." |
| New / reused | new: — · reused: rotate, domino |
| Hero · batch | F24 wedge block · A1 |
| Materials | hero brick (prow cream stone) · office concrete · shed wood · protected ×2 |
| RC | no: ladder material of the lesson (needs K1 = A) |
| TNT | now 9 (expert 9) → **given 8, expert uses 7–8** (spare 0–1, D-blast-TNTTIGHT) |
| Targets (§4b N) | expert 4/4, margin +3 … +8, 1–2 blast(s) · sensible 4/4, ≤ 2 blasts · variants 6–8/8 · naive 0–1/4 · lesson-less 0/4 · foot ≤ 1/16 · search ≤ 2/24 · hero lock: ≤ (hero min − 2) never · time-bot 95–140 s (L32: 100 s) |
| Aids | 1 push-in on the hero foot (monIn), neutral yaw · 2 n/a (barrels taught at L32); painted yard marks the key legs on T/R/N-teach · 3 damage dots only (appear on a hit member; no cue) · 4 cleanup: yes (= L32 round 6) · 5 trick + place in on-screen words (= L32) |
| Problems: bots | expert 4/4 92.7% (+7.7), naive 0/4, foot 0/16 |
| Problems: tester | Won at 85.5% (0.5 over PASS): felt lucky; same lesson as L4 with no gentler step; prow points away from the camera. (difficulty 3/5) |
| Done when | expert margin +4…+8 and sensible variants ≥ 6/8; prow visible at the opening; N row green. Plus: built and gated against the newest STD (skill §8). |

### L6 Dome Square · N · experience

| Field | Need |
|---|---|
| Curve slot · tier | band 1, x6 · N → **N** (target difficulty 5/10) |
| Role | experience |
| Lesson (≤ 6 words) | "Back row out. Mind the school." |
| New / reused | new: — · reused: rotate, fall direction |
| Hero · batch | F14 dome hall · B1 |
| Materials | hero concrete hall + drum · timber hall behind · protected school |
| RC | no: ladder material of the lesson (needs K1 = A) |
| TNT | now 11 (expert 10) → **given 10, expert uses 9–10** (spare 0–1, D-blast-TNTTIGHT) |
| Targets (§4b N) | expert 4/4, margin +3 … +8, 1–2 blast(s) · sensible 4/4, ≤ 2 blasts · variants 6–8/8 · naive 0–1/4 · lesson-less 0/4 · foot ≤ 1/16 · search ≤ 2/24 · hero lock: ≤ (hero min − 2) never · time-bot 95–140 s (L32: 100 s) |
| Aids | 1 push-in on the hero foot (monIn), neutral yaw · 2 n/a (barrels taught at L32); painted yard marks the key legs on T/R/N-teach · 3 damage dots only (appear on a hit member; no cue) · 4 cleanup: yes (= L32 round 6) · 5 trick + place in on-screen words (= L32) |
| Problems: bots | expert 4/4 92.0% (+7.0), 2 blasts, foot 2/16 (N wants ≤ 1/16) |
| Problems: tester | Wide flat hall: hint (back) and fail tip (arcades) disagree; camera drag undiscoverable; lost at 62%. (difficulty 4/5) |
| Done when | tip and fail text name the same members; foot ≤ 1/16; wide-hall framing reads at 390 px; N row green. Plus: built and gated against the newest STD (skill §8). |

### L7 Grand Arch · H · combine

| Field | Need |
|---|---|
| Curve slot · tier | band 1, x7 · H → **H** (target difficulty 7/10) |
| Role | combine |
| Lesson (≤ 6 words) | "Fall along the street." |
| New / reused | new: — (rotate + direction + protected) · reused: rotate, direction, protected |
| Hero · batch | F10 triumphal-type arch · B1 |
| Materials | hero stone (concrete) arch · tower concrete · protected tram stop + sides |
| RC | no: ladder material of the lesson (needs K1 = A) |
| TNT | now 12 (expert 12) → **given 11, expert uses 10–11** (spare 0–1, D-blast-TNTTIGHT) |
| Targets (§4b H) | expert 4/4, margin +3 … +6, 1–2 blast(s) · sensible hint follower carries the misreading: 0–2/4 · variants 3–5/8 · naive 0/4 · lesson-less 0/4 for each combined lesson · foot 0/16 · search 0/24 · hero lock: ≤ (hero min − 1) never · time-bot 180–270 s |
| Aids | 1 push-in on the hero foot, yaw NOT facing the solution · 2 never at the solution legs (a known mechanic may sit elsewhere) · 3 damage dots only (feedback, never a cue) · 4 cleanup: no (only from the second attempt) · 5 names the trick, no counts |
| Problems: bots | NOT GATED since the F09→F10 swap (L1-12-DRESS §3 is the old Clock/Lift gate); old hint follower 0/4, old variants 0/8 (H wants 3–5/8) |
| Problems: tester | Hardest early wall (5/5, 41%): opaque structure, cryptic fail tip "Arch forward, tower back", HARD banner reads as a wall. (difficulty 5/5) |
| Done when | first Hard = easiest Hard: variants 4–5/8; the arch's weak piers readable from the opening; fail text names the trick; H row green. Plus: built and gated against the newest STD (skill §8). |

### L8 Rivet Tower · R · teach

| Field | Need |
|---|---|
| Curve slot · tier | band 1, x8 · R → **R** (target difficulty 3/10) |
| Role | teach |
| Lesson (≤ 6 words) | "Steel holds. Hit grey feet." |
| New / reused | new: steel (one TNT never breaks it) · reused: count piers |
| Hero · batch | F03 lattice tower · A2 |
| Materials | hero steel lattice on concrete feet · water tower steel on concrete · hall wood |
| RC | no: ladder material of the lesson (needs K1 = A) |
| TNT | now 10 (expert 10) → **given 9, expert uses 8–9** (spare 0–1, D-blast-TNTTIGHT) |
| Targets (§4b R) | expert 4/4, margin ≥ +6, 1–2 blast(s) · sensible 4/4, ≤ 2 blasts · variants 7–8/8 · naive ≤ 2/4 · lesson-less 0/4 on a teach level · foot ≤ 5/16 · search ≤ 6/24 · hero lock: ≤ (hero min − 2) never · time-bot 80–100 s |
| Aids | 1 push-in on the solution side (monIn) · 2 n/a (barrels taught at L32); painted yard marks the key legs on T/R/N-teach · 3 cue dots from the first second on a teach level; damage dots only on a relief level · 4 cleanup: yes · 5 count and place in on-screen words |
| Problems: bots | NOT GATED on F03 (old gate: The Beacon 93.3% +8.3, lesson-less 0/4) |
| Problems: tester | Clean win, "a model of a clear hint" (keep the wording). (difficulty 2/5) |
| Done when | lesson-less 0/4 (TNT on steel fails); R row green; keep the tip; owns the F03 part function (reused L33). Plus: built and gated against the newest STD (skill §8). |

### L9 Twin Saucer · N · experience

| Field | Need |
|---|---|
| Curve slot · tier | band 1, x9 · N → **N** (target difficulty 5/10) |
| Role | experience |
| Lesson (≤ 6 words) | "Down the row. Steel: feet." |
| New / reused | new: — · reused: steel feet, domino |
| Hero · batch | F04 saucer tower (= L32 tile) · A2 |
| Materials | hero concrete shaft · row mixed · steel water tower on concrete feet |
| RC | no: ladder material of the lesson (needs K1 = A) |
| TNT | now 10 (expert 10) → **given 9, expert uses 8–9** (spare 0–1, D-blast-TNTTIGHT) |
| Targets (§4b N) | expert 4/4, margin +3 … +8, 1–2 blast(s) · sensible 4/4, ≤ 2 blasts · variants 6–8/8 · naive 0–1/4 · lesson-less 0/4 · foot ≤ 1/16 · search ≤ 2/24 · hero lock: ≤ (hero min − 2) never · time-bot 95–140 s (L32: 100 s) |
| Aids | 1 push-in on the hero foot (monIn), neutral yaw · 2 n/a (barrels taught at L32); painted yard marks the key legs on T/R/N-teach · 3 damage dots only (appear on a hit member; no cue) · 4 cleanup: yes (= L32 round 6) · 5 trick + place in on-screen words (= L32) |
| Problems: bots | NOT GATED on F04 (old: 91.3% +6.3, written plan needed a clean-up blast) |
| Problems: tester | Leftover scraps need extra TNT; waves not explained. (difficulty 3/5) |
| Done when | expert wins without a clean-up blast; cleanup dots on the scraps; hero clearly smaller/different from L32 (see K7); N row green. Plus: built and gated against the newest STD (skill §8). |

### L10 Lift Bridge · B · boss

| Field | Need |
|---|---|
| Curve slot · tier | band 1, x10 · SH (boss label) → **B** (target difficulty 8/10) |
| Role | boss |
| Lesson (≤ 6 words) | "They fall towards each other." |
| New / reused | new: — · reused: rotate, direction, domino, protected |
| Hero · batch | F09 lift bridge · C1 |
| Materials | 2 stone (concrete) towers · steel walkway · blocks concrete/brick · protected ×4 |
| RC | no: ladder material of the lesson (needs K1 = A) |
| TNT | now 11 (expert 11) → **given 12, expert uses 11–12** (spare 0–1, D-blast-TNTTIGHT) |
| Targets (§4b B) | expert 4/4, margin +3 … +5, 2–3 blast(s) · sensible 0–1/4 · variants 1–3/8 · naive 0/4 · lesson-less 0/4 · foot 0/16 · search 0/24 · hero lock: ≤ (hero min − 1) never · time-bot 270–340 s |
| Aids | 1 whole-lot opening, no push-in (set-piece reveal allowed) · 2 no gift barrels · 3 damage dots only on RC members · 4 cleanup: no · 5 names the trick in one line, no counts |
| Problems: bots | NOT GATED on F09 (old boss: 92.2% +7.2, hint follower 0/4) |
| Problems: tester | No readable plan: hint "Find where it can fall" gives no direction; hospital hit (82%) before the player can learn fall direction. (difficulty 5/5) |
| Done when | variants 1–3/8; the boss teaches nothing new; fail text names "inner sides"; B row green; first set piece ≤ 4 mechanics. Plus: built and gated against the newest STD (skill §8). |

### L11 Shell Hall · R · teach

| Field | Need |
|---|---|
| Curve slot · tier | band 2, x1 · R → **R** (target difficulty 3/10) |
| Role | teach |
| Lesson (≤ 6 words) | "Shed first, then the hall." |
| New / reused | new: blast in steps (multi-blast) · reused: count piers |
| Hero · batch | F05 shell hall · B1 |
| Materials | hero concrete podium piers + hall · shed wood · protected ×2 |
| RC | no: ladder material of the lesson (needs K1 = A) |
| TNT | now 7 (expert 6) → **given 8, expert uses 7–8** (spare 0–1, D-blast-TNTTIGHT) |
| Targets (§4b R) | expert 4/4, margin ≥ +6, 1–2 blast(s) · sensible 4/4, ≤ 2 blasts · variants 7–8/8 · naive ≤ 2/4 · lesson-less 0/4 on a teach level · foot ≤ 5/16 · search ≤ 6/24 · hero lock: ≤ (hero min − 2) never · time-bot 80–100 s |
| Aids | 1 push-in on the solution side (monIn) · 2 n/a (barrels taught at L32); painted yard marks the key legs on T/R/N-teach · 3 cue dots from the first second on a teach level; damage dots only on a relief level · 4 cleanup: yes · 5 count and place in on-screen words |
| Problems: bots | NOT GATED on F05 (old Dome Fair 88.5%, +3.5: thinnest L1-12 margin); lesson-less (one blast) 0/4 |
| Problems: tester | Worst early score (4.6%): the shed eats the budget, the hall is barely scratched, no sign which part is the pier, roof looks glitchy. (difficulty 4/5) |
| Done when | blind newcomer passes 50% by attempt 2; podium piers carry cue dots after blast 1; Wrecking Ball pointer moved off this level (K6); R row green. Plus: built and gated against the newest STD (skill §8). |

### L12 Star Pedestal · N · experience

| Field | Need |
|---|---|
| Curve slot · tier | band 2, x2 · N → **N** (target difficulty 4/10) |
| Role | experience |
| Lesson (≤ 6 words) | "Look behind it." |
| New / reused | new: — · reused: multi-blast |
| Hero · batch | F21 pedestal · A2 |
| Materials | hero stone (concrete) plinth · core behind (ladder rc) · blocks brick |
| RC | no: ladder material of the lesson (needs K1 = A) |
| TNT | now 9 (expert 9) → **given 9, expert uses 8–9** (spare 0–1, D-blast-TNTTIGHT) |
| Targets (§4b N) | expert 4/4, margin +3 … +8, 1–2 blast(s) · sensible 4/4, ≤ 2 blasts · variants 6–8/8 · naive 0–1/4 · lesson-less 0/4 · foot ≤ 1/16 · search ≤ 2/24 · hero lock: ≤ (hero min − 2) never · time-bot 95–140 s (L32: 100 s) |
| Aids | 1 push-in on the hero foot (monIn), neutral yaw · 2 n/a (barrels taught at L32); painted yard marks the key legs on T/R/N-teach · 3 damage dots only (appear on a hit member; no cue) · 4 cleanup: yes (= L32 round 6) · 5 trick + place in on-screen words (= L32) |
| Problems: bots | expert 4/4 88.96% (+3.96), sensible 4/4, foot 0/16; old time-bot 313 s (N band 95–140) |
| Problems: tester | Won at 85.0% (razor thin); the hint does not explain the lesson. (difficulty 3/5) |
| Done when | time-bot ≤ 140 s; margin ≥ +4; ladder `rc` core either removed or re-skinned (same look, same rule: K1); N row green. Plus: built and gated against the newest STD (skill §8). |

### L13 Harp Span · R · teach

| Field | Need |
|---|---|
| Curve slot · tier | band 2, x3 · R → **R** (target difficulty 3/10) |
| Role | teach |
| Lesson (≤ 6 words) | "Steel leg? Stack two TNT." |
| New / reused | new: stack two TNT on steel · reused: steel holds |
| Hero · batch | F17 cable bridge · C1 |
| Materials | bridge concrete · deck steel · tank tower steel legs (the lesson) |
| RC | no: ladder material of the lesson (needs K1 = A) |
| TNT | now 10 (expert 8) → **given 9, expert uses 8–9** (spare 0–1, D-blast-TNTTIGHT) |
| Targets (§4b R) | expert 4/4, margin ≥ +6, 1–2 blast(s) · sensible 4/4, ≤ 2 blasts · variants 7–8/8 · naive ≤ 2/4 · lesson-less 0/4 on a teach level · foot ≤ 5/16 · search ≤ 6/24 · hero lock: ≤ (hero min − 2) never · time-bot 80–100 s |
| Aids | 1 push-in on the solution side (monIn) · 2 n/a (barrels taught at L32); painted yard marks the key legs on T/R/N-teach · 3 cue dots from the first second on a teach level; damage dots only on a relief level · 4 cleanup: yes · 5 count and place in on-screen words |
| Problems: bots | expert 4/4 94.6% (+9.6), variants 8/8, lesson-less 0/4, 2 TNT spare (TNTTIGHT) |
| Problems: tester | Stacking reads as "double cost"; ended 83.9% short. (difficulty 4/5) |
| Done when | given 9 / expert 8–9; cue dots on the stacked leg show 2 slots; R row green. Plus: built and gated against the newest STD (skill §8). |

### L14 Stripey Light · N · experience

| Field | Need |
|---|---|
| Curve slot · tier | band 2, x4 · N → **N** (target difficulty 5/10) |
| Role | experience |
| Lesson (≤ 6 words) | "Tip it down the row." |
| New / reused | new: — · reused: stack, domino |
| Hero · batch | F28 lighthouse (reuse A1) · A2 |
| Materials | hero brick · row wood · gantry steel (stack) |
| RC | no: ladder material of the lesson (needs K1 = A) |
| TNT | now 9 (expert 8) → **given 9, expert uses 8–9** (spare 0–1, D-blast-TNTTIGHT) |
| Targets (§4b N) | expert 4/4, margin +3 … +8, 1–2 blast(s) · sensible 4/4, ≤ 2 blasts · variants 6–8/8 · naive 0–1/4 · lesson-less 0/4 · foot ≤ 1/16 · search ≤ 2/24 · hero lock: ≤ (hero min − 2) never · time-bot 95–140 s (L32: 100 s) |
| Aids | 1 push-in on the hero foot (monIn), neutral yaw · 2 n/a (barrels taught at L32); painted yard marks the key legs on T/R/N-teach · 3 damage dots only (appear on a hit member; no cue) · 4 cleanup: yes (= L32 round 6) · 5 trick + place in on-screen words (= L32) |
| Problems: bots | expert 4/4 93.5% (+8.5), variants 6/8, foot 0/16 |
| Problems: tester | Lost at 45.9%: the steel gantry resists with no visible cost. (difficulty 4/5) |
| Done when | damage dots show the gantry needs 2; variants ≥ 6/8; N row green. Plus: built and gated against the newest STD (skill §8). |

### L15 The Sail · N · experience

| Field | Need |
|---|---|
| Curve slot · tier | band 2, x5 · N → **N** (target difficulty 5/10) |
| Role | experience |
| Lesson (≤ 6 words) | "Open the hall, then stack." |
| New / reused | new: — · reused: multi-blast, stack |
| Hero · batch | F30 twin sail towers · A2 |
| Materials | hero concrete towers on steel legs (LISTED: lesson on the hero) · boat hall brick/wood |
| RC | no: ladder material of the lesson (needs K1 = A) |
| TNT | now 10 (expert 9) → **given 10, expert uses 9–10** (spare 0–1, D-blast-TNTTIGHT) |
| Targets (§4b N) | expert 4/4, margin +3 … +8, 1–2 blast(s) · sensible 4/4, ≤ 2 blasts · variants 6–8/8 · naive 0–1/4 · lesson-less 0/4 · foot ≤ 1/16 · search ≤ 2/24 · hero lock: ≤ (hero min − 2) never · time-bot 95–140 s (L32: 100 s) |
| Aids | 1 push-in on the hero foot (monIn), neutral yaw · 2 n/a (barrels taught at L32); painted yard marks the key legs on T/R/N-teach · 3 damage dots only (appear on a hit member; no cue) · 4 cleanup: yes (= L32 round 6) · 5 trick + place in on-screen words (= L32) |
| Problems: bots | expert 4/4 90.9% (+5.9), 2 blasts, variants 8/8 (top of band) |
| Problems: tester | Clean, fun win (5/5/2): a little easy for its slot. (difficulty 2/5) |
| Done when | stack moved off the hero to a side building (HERO-PROC); variants 6–7/8; owns the F30 part function (reused L36). Plus: built and gated against the newest STD (skill §8). |

### L16 Dome Hall · H · combine

| Field | Need |
|---|---|
| Curve slot · tier | band 2, x6 · H → **H** (target difficulty 7/10) |
| Role | combine |
| Lesson (≤ 6 words) | "All fall away from hospital." |
| New / reused | new: — · reused: rotate, direction, stack, protected |
| Hero · batch | F14 dome hall (reuse in B1) · B1 |
| Materials | hero concrete hall · side block B steel (stack) · C, D wood · hospital |
| RC | no: ladder material of the lesson (needs K1 = A) |
| TNT | now 12 (expert 12) → **given 12, expert uses 11–12** (spare 0–1, D-blast-TNTTIGHT) |
| Targets (§4b H) | expert 4/4, margin +3 … +6, 1–2 blast(s) · sensible hint follower carries the misreading: 0–2/4 · variants 3–5/8 · naive 0/4 · lesson-less 0/4 for each combined lesson · foot 0/16 · search 0/24 · hero lock: ≤ (hero min − 1) never · time-bot 180–270 s |
| Aids | 1 push-in on the hero foot, yaw NOT facing the solution · 2 never at the solution legs (a known mechanic may sit elsewhere) · 3 damage dots only (feedback, never a cue) · 4 cleanup: no (only from the second attempt) · 5 names the trick, no counts |
| Problems: bots | expert 4/4 96.6% (+11.6: over the H band), hint follower 0/4, variants 0/8 (H wants 3–5/8), foot 1/16 (H wants 0), order-sensitive 81–98% |
| Problems: tester | 18.6%: the hospital sits under the building, no safe direction is obvious; HARD feels punishing. (difficulty 5/5) |
| Done when | variants 3–5/8, margin +3…+6, foot 0/16; ≤ 3 mechanics; a safe direction readable at the opening; H row green. Plus: built and gated against the newest STD (skill §8). |

### L17 The Pedestal · R · teach

| Field | Need |
|---|---|
| Curve slot · tier | band 2, x7 · R → **R** (target difficulty 3/10) |
| Role | teach |
| Lesson (≤ 6 words) | "Fill the dots on two legs." |
| New / reused | new: massive RC hero: 3 TNT a leg, two neighbours drop it (replaces "dark piers", K1) · reused: count piers |
| Hero · batch | F21 pedestal (reuse A2) · A3 |
| Materials | hero RC tier · steel tower · timber block |
| RC | yes: hero piers hrc, cassettes mdeck (tier M14_RC), storey rule (needs K1 = A) |
| TNT | now 10 (expert 8) → **given 9, expert uses 8–9** (spare 0–1, D-blast-TNTTIGHT) |
| Targets (§4b R) | expert 4/4, margin ≥ +6, 1–2 blast(s) · sensible 4/4, ≤ 2 blasts · variants 7–8/8 · naive ≤ 2/4 · lesson-less 0/4 on a teach level · foot ≤ 5/16 · search ≤ 6/24 · hero lock: ≤ 3 TNT never; min 6 (3+3) on two neighbouring legs · time-bot 80–100 s |
| Aids | 1 push-in on the solution side (monIn) · 2 n/a (barrels taught at L32); painted yard marks the key legs on T/R/N-teach · 3 cue dots from the first second on a teach level; damage dots only on a relief level · 4 cleanup: yes · 5 count and place in on-screen words |
| Problems: bots | expert 4/4 89.3% (+4.3), variants 8/8, foot 4/16 (R ≤ 5), 2 TNT spare |
| Problems: tester | Two blocking power-up popups at the start; lost once by 1%. (difficulty 3/5) |
| Done when | first RC hero: 1 TNT chips, 2 rebar, 3 breaks; neighbour rule 15/15 splits; ≤ 3 TNT never; no popups on a teach level; R row green. Plus: built and gated against the newest STD (skill §8). |

### L18 The Doorstop · N · experience

| Field | Need |
|---|---|
| Curve slot · tier | band 2, x8 · N → **N** (target difficulty 5/10) |
| Role | experience |
| Lesson (≤ 6 words) | "Look behind. Then the core." |
| New / reused | new: — · reused: RC hero, multi-blast |
| Hero · batch | F24 wedge (reuse A1) · A3 |
| Materials | hero RC wedge · hall wood · hidden core RC · side block brick |
| RC | yes: hero piers hrc, cassettes mdeck (tier M14_RC), storey rule (needs K1 = A) |
| TNT | now 10 (expert 9) → **given 10, expert uses 9–10** (spare 0–1, D-blast-TNTTIGHT) |
| Targets (§4b N) | expert 4/4, margin +3 … +8, 1–2 blast(s) · sensible 4/4, ≤ 2 blasts · variants 6–8/8 · naive 0–1/4 · lesson-less 0/4 · foot ≤ 1/16 · search ≤ 2/24 · hero lock: ≤ 3 TNT never; 4 only on the taught shortcut (⚠ K3) · time-bot 95–140 s (L32: 100 s) |
| Aids | 1 push-in on the hero foot (monIn), neutral yaw · 2 n/a (barrels taught at L32); painted yard marks the key legs on T/R/N-teach · 3 damage dots only (appear on a hit member; no cue) · 4 cleanup: yes (= L32 round 6) · 5 trick + place in on-screen words (= L32) |
| Problems: bots | expert 4/4 91.8% (+6.8), 2 blasts, variants 6/8, 67k triangles (over 60k) |
| Problems: tester | Building clipped by the frame; two instructions in one hint. (difficulty 3/5) |
| Done when | one idea in the tip; whole lot in frame; N row green with an RC hero. Plus: built and gated against the newest STD (skill §8). |

### L19 Cube Grove · N · experience (surprise)

| Field | Need |
|---|---|
| Curve slot · tier | band 2, x9 · N → **N** (target difficulty 5/10) |
| Role | experience (surprise) |
| Lesson (≤ 6 words) | "One pole, one TNT." |
| New / reused | new: — · reused: count piers, stack |
| Hero · batch | F35 cube houses · B1 |
| Materials | 5 cubes on concrete poles (LISTED: dark piers) · tank tower steel |
| RC | exception: 5 one-pole cubes cannot take 3 TNT each inside 12; poles stay ladder concrete (K1) |
| TNT | now 10 (expert 9) → **given 10, expert uses 9–10** (spare 0–1, D-blast-TNTTIGHT) |
| Targets (§4b N) | expert 4/4, margin +3 … +8, 1–2 blast(s) · sensible 4/4, ≤ 2 blasts · variants 6–8/8 · naive 0–1/4 · lesson-less 0/4 · foot ≤ 1/16 · search ≤ 2/24 · hero lock: ≤ (hero min − 2) never · time-bot 95–140 s (L32: 100 s) |
| Aids | 1 push-in on the hero foot (monIn), neutral yaw · 2 n/a (barrels taught at L32); painted yard marks the key legs on T/R/N-teach · 3 damage dots only (appear on a hit member; no cue) · 4 cleanup: yes (= L32 round 6) · 5 trick + place in on-screen words (= L32) |
| Problems: bots | expert 4/4 98.0% (+13.0: over the N band), variants 8/8, screen fill 39% of height |
| Problems: tester | The last 10% (steel tower) eats too many TNT. (difficulty 3/5) |
| Done when | margin +3…+8; the steel tank is not the finish (cleanup dots); fills ≥ 60% of the play-area width; N row green. Plus: built and gated against the newest STD (skill §8). |

### L20 Big Bow · B · boss

| Field | Need |
|---|---|
| Curve slot · tier | band 2, x10 · SH (boss label) → **B** (target difficulty 9/10) |
| Role | boss |
| Lesson (≤ 6 words) | "Each pylon has one way down." |
| New / reused | new: — · reused: multi-blast, stack, RC, protected |
| Hero · batch | F32 steel arch bridge · C1 |
| Materials | pylon bases RC (LISTED: dark piers / steel legs) · arch + deck steel · hall + core |
| RC | yes: hero piers hrc, cassettes mdeck (tier M14_RC), storey rule (needs K1 = A) |
| TNT | now 11 (expert 10) → **given 12, expert uses 11–12** (spare 0–1, D-blast-TNTTIGHT) |
| Targets (§4b B) | expert 4/4, margin +3 … +5, 2–3 blast(s) · sensible 0–1/4 · variants 1–3/8 · naive 0/4 · lesson-less 0/4 · foot 0/16 · search 0/24 · hero lock: ≤ 5 never (min 6 everywhere) · time-bot 270–340 s |
| Aids | 1 whole-lot opening, no push-in (set-piece reveal allowed) · 2 no gift barrels · 3 damage dots only on RC members · 4 cleanup: no · 5 names the trick in one line, no counts |
| Problems: bots | expert 4/4 89.2% (+4.2), variants 0/8 (B wants 1–3/8), time 347 s (B ≤ 340) |
| Problems: tester | Fair boss (won 98.5%) but a 6% vs 5% protected fail felt fussy. (difficulty 3/5) |
| Done when | variants 1–3/8; protected margin ≥ 2 points under 5%; ≤ 4 mechanics; B row green. Plus: built and gated against the newest STD (skill §8). |

### L21 The Stepper · R · teach

| Field | Need |
|---|---|
| Curve slot · tier | band 3, x1 · R → **R** (target difficulty 3/10) |
| Role | teach |
| Lesson (≤ 6 words) | "Keep the road clear." |
| New / reused | new: street rule (≤ 10% on the road) · reused: RC hero, rotate |
| Hero · batch | F22 stepped tower · A3 |
| Materials | hero RC · steel tower · timber block · road |
| RC | yes: hero piers hrc, cassettes mdeck (tier M14_RC), storey rule (needs K1 = A) |
| TNT | now 10 (expert 8) → **given 9, expert uses 8–9** (spare 0–1, D-blast-TNTTIGHT) |
| Targets (§4b R) | expert 4/4, margin ≥ +6, 1–2 blast(s) · sensible 4/4, ≤ 2 blasts · variants 7–8/8 · naive ≤ 2/4 · lesson-less 0/4 on a teach level · foot ≤ 5/16 · search ≤ 6/24 · hero lock: ≤ 3 TNT never; min 6 (3+3) on two neighbouring legs · time-bot 80–100 s |
| Aids | 1 push-in on the solution side (monIn) · 2 n/a (barrels taught at L32); painted yard marks the key legs on T/R/N-teach · 3 cue dots from the first second on a teach level; damage dots only on a relief level · 4 cleanup: yes · 5 count and place in on-screen words |
| Problems: bots | expert 4/4 97.8% (+12.8), variants 6/8, lesson-less (front plan) 0/4, 2 TNT spare |
| Problems: tester | Rotation still had to be discovered; road meter "0%/10%" is cryptic. (difficulty 3/5) |
| Done when | road meter reads in words; Safety Net pointer moved to L22 (K6); R row green. Plus: built and gated against the newest STD (skill §8). |

### L22 The Pencil · N · experience

| Field | Need |
|---|---|
| Curve slot · tier | band 3, x2 · N → **N** (target difficulty 5/10) |
| Role | experience |
| Lesson (≤ 6 words) | "Road in front: blast backs." |
| New / reused | new: — · reused: street, rotate, RC hero |
| Hero · batch | F26 pencil tower · A3 |
| Materials | hero RC + one wing · block behind brick · road |
| RC | yes: hero piers hrc, cassettes mdeck (tier M14_RC), storey rule (needs K1 = A) |
| TNT | now 11 (expert 10) → **given 10, expert uses 9–10** (spare 0–1, D-blast-TNTTIGHT) |
| Targets (§4b N) | expert 4/4, margin +3 … +8, 1–2 blast(s) · sensible 4/4, ≤ 2 blasts · variants 6–8/8 · naive 0–1/4 · lesson-less 0/4 · foot ≤ 1/16 · search ≤ 2/24 · hero lock: ≤ 3 TNT never; 4 only on the taught shortcut (⚠ K3) · time-bot 95–140 s (L32: 100 s) |
| Aids | 1 push-in on the hero foot (monIn), neutral yaw · 2 n/a (barrels taught at L32); painted yard marks the key legs on T/R/N-teach · 3 damage dots only (appear on a hit member; no cue) · 4 cleanup: yes (= L32 round 6) · 5 trick + place in on-screen words (= L32) |
| Problems: bots | expert 4/4 96.2% (+11.2: over the N band), street 6% |
| Problems: tester | Lost at 79%: late taps fail silently; heavy TNT cost for one spire. (difficulty 4/5) |
| Done when | margin +3…+8; a placed TNT always gives feedback; N row green. Plus: built and gated against the newest STD (skill §8). |

### L23 Tube Bundle · N · experience

| Field | Need |
|---|---|
| Curve slot · tier | band 3, x3 · N → **N** (target difficulty 6/10) |
| Role | experience |
| Lesson (≤ 6 words) | "Tip it away from the road." |
| New / reused | new: — · reused: street, domino, RC hero |
| Hero · batch | F34 tube bundle · A3 |
| Materials | hero RC tubes · row brick/wood · road |
| RC | yes: hero piers hrc, cassettes mdeck (tier M14_RC), storey rule (needs K1 = A) |
| TNT | now 11 (expert 9) → **given 10, expert uses 9–10** (spare 0–1, D-blast-TNTTIGHT) |
| Targets (§4b N) | expert 4/4, margin +3 … +8, 1–2 blast(s) · sensible 4/4, ≤ 2 blasts · variants 6–8/8 · naive 0–1/4 · lesson-less 0/4 · foot ≤ 1/16 · search ≤ 2/24 · hero lock: ≤ 3 TNT never; 4 only on the taught shortcut (⚠ K3) · time-bot 95–140 s (L32: 100 s) |
| Aids | 1 push-in on the hero foot (monIn), neutral yaw · 2 n/a (barrels taught at L32); painted yard marks the key legs on T/R/N-teach · 3 damage dots only (appear on a hit member; no cue) · 4 cleanup: yes (= L32 round 6) · 5 trick + place in on-screen words (= L32) |
| Problems: bots | expert 4/4 95.7% (+10.7), variants 6/8, 2 TNT spare, 65k triangles |
| Problems: tester | 46.6%: a TNT sponge; weak points unreadable in dark glass; frame clips the building. (difficulty 4/5) |
| Done when | dots on the tube legs; given = expert + 0–1; whole lot in frame; N row green. Plus: built and gated against the newest STD (skill §8). |

### L24 Deco Needle · H · combine

| Field | Need |
|---|---|
| Curve slot · tier | band 3, x4 · H → **H** (target difficulty 8/10) |
| Role | combine |
| Lesson (≤ 6 words) | "Only one way is open." |
| New / reused | new: — · reused: street, protected, stack, rotate |
| Hero · batch | F16 deco needle (reuse A1) · A4 |
| Materials | hero RC · side block C steel (stack) · side blocks · protected ×2 · road |
| RC | yes: hero piers hrc, cassettes mdeck (tier M14_RC), storey rule (needs K1 = A) |
| TNT | now 11 (expert 10) → **given 11, expert uses 10–11** (spare 0–1, D-blast-TNTTIGHT) |
| Targets (§4b H) | expert 4/4, margin +3 … +6, 1–2 blast(s) · sensible hint follower carries the misreading: 0–2/4 · variants 3–5/8 · naive 0/4 · lesson-less 0/4 for each combined lesson · foot 0/16 · search 0/24 · hero lock: ≤ 4 TNT never anywhere (no gift shortcut at the hero) · time-bot 180–270 s |
| Aids | 1 push-in on the hero foot, yaw NOT facing the solution · 2 never at the solution legs (a known mechanic may sit elsewhere) · 3 damage dots only (feedback, never a cue) · 4 cleanup: no (only from the second attempt) · 5 names the trick, no counts |
| Problems: bots | expert 4/4 98.7% (+13.7: H wants +3…+6), variants 0/8 (wants 3–5/8), most layout-sensitive level |
| Problems: tester | Got within 13%; tip too vague. (difficulty 4/5) |
| Done when | margin +3…+6 and variants 3–5/8 together; ≤ 3 mechanics; H row green on 3 placing orders. Plus: built and gated against the newest STD (skill §8). |

### L25 Glass Point · R · teach

| Field | Need |
|---|---|
| Curve slot · tier | band 3, x5 · R → **R** (target difficulty 4/10) |
| Role | teach |
| Lesson (≤ 6 words) | "Glass holds nothing. Hit frames." |
| New / reused | new: glass (breaks wide, carries nothing) · reused: RC hero |
| Hero · batch | F06 glass pyramid · A4 |
| Materials | hero RC frame + mglass steps · 2 brick palace wings |
| RC | yes: hero piers hrc, cassettes mdeck (tier M14_RC), storey rule (needs K1 = A) |
| TNT | now 10 (expert 8) → **given 9, expert uses 8–9** (spare 0–1, D-blast-TNTTIGHT) |
| Targets (§4b R) | expert 4/4, margin ≥ +6, 1–2 blast(s) · sensible 4/4, ≤ 2 blasts · variants 7–8/8 · naive ≤ 2/4 · lesson-less 0/4 on a teach level · foot ≤ 5/16 · search ≤ 6/24 · hero lock: ≤ 3 TNT never; min 6 (3+3) on two neighbouring legs · time-bot 80–100 s |
| Aids | 1 push-in on the solution side (monIn) · 2 n/a (barrels taught at L32); painted yard marks the key legs on T/R/N-teach · 3 cue dots from the first second on a teach level; damage dots only on a relief level · 4 cleanup: yes · 5 count and place in on-screen words |
| Problems: bots | expert 4/4 97.3% (+12.3), variants 7/8, lesson-less 0/4 (30%), 2 TNT spare |
| Problems: tester | 27.7%: the dark frame is hard to hit; the tip gives no count. (difficulty 4/5) |
| Done when | glass taps route to the frame behind (tap assist); cue dots on the frame; R row green. Plus: built and gated against the newest STD (skill §8). |

### L26 The Bullet · N · experience

| Field | Need |
|---|---|
| Curve slot · tier | band 3, x6 · N → **N** (target difficulty 5/10) |
| Role | experience |
| Lesson (≤ 6 words) | "Steel behind glass: stack." |
| New / reused | new: — · reused: glass, stack |
| Hero · batch | F25 bullet tower · A4 |
| Materials | hero RC + steel frame behind glass (LISTED) · glass block · brick block |
| RC | yes: hero piers hrc, cassettes mdeck (tier M14_RC), storey rule (needs K1 = A) |
| TNT | now 9 (expert 8) → **given 9, expert uses 8–9** (spare 0–1, D-blast-TNTTIGHT) |
| Targets (§4b N) | expert 4/4, margin +3 … +8, 1–2 blast(s) · sensible 4/4, ≤ 2 blasts · variants 6–8/8 · naive 0–1/4 · lesson-less 0/4 · foot ≤ 1/16 · search ≤ 2/24 · hero lock: ≤ 3 TNT never; 4 only on the taught shortcut (⚠ K3) · time-bot 95–140 s (L32: 100 s) |
| Aids | 1 push-in on the hero foot (monIn), neutral yaw · 2 n/a (barrels taught at L32); painted yard marks the key legs on T/R/N-teach · 3 damage dots only (appear on a hit member; no cue) · 4 cleanup: yes (= L32 round 6) · 5 trick + place in on-screen words (= L32) |
| Problems: bots | expert 4/4 90.8% (+5.8), variants 6/8, foot 0/16 |
| Problems: tester | 75.8%: stacking doubles the cost; budget too tight. (difficulty 4/5) |
| Done when | steel moved off the hero to a side building or accepted by Owner (LISTED); N row green. Plus: built and gated against the newest STD (skill §8). |

### L27 The Splinter · N · experience

| Field | Need |
|---|---|
| Curve slot · tier | band 3, x7 · N → **N** (target difficulty 6/10) |
| Role | experience |
| Lesson (≤ 6 words) | "Tip the glass tower down." |
| New / reused | new: — · reused: glass, domino |
| Hero · batch | F31 glass shard · A4 |
| Materials | hero RC + glass · row glass/brick/wood · steel tower |
| RC | yes: hero piers hrc, cassettes mdeck (tier M14_RC), storey rule (needs K1 = A) |
| TNT | now 11 (expert 10) → **given 10, expert uses 9–10** (spare 0–1, D-blast-TNTTIGHT) |
| Targets (§4b N) | expert 4/4, margin +3 … +8, 1–2 blast(s) · sensible 4/4, ≤ 2 blasts · variants 6–8/8 · naive 0–1/4 · lesson-less 0/4 · foot ≤ 1/16 · search ≤ 2/24 · hero lock: ≤ 3 TNT never; 4 only on the taught shortcut (⚠ K3) · time-bot 95–140 s (L32: 100 s) |
| Aids | 1 push-in on the hero foot (monIn), neutral yaw · 2 n/a (barrels taught at L32); painted yard marks the key legs on T/R/N-teach · 3 damage dots only (appear on a hit member; no cue) · 4 cleanup: yes (= L32 round 6) · 5 trick + place in on-screen words (= L32) |
| Problems: bots | expert 4/4 95.4% (+10.4), variants 6/8 |
| Problems: tester | 42.7%: spreading TNT (the natural newcomer move) is punished hard; the tip appears only after a fail. (difficulty 4/5) |
| Done when | tip line visible before the first tap; margin +3…+8; N row green. Plus: built and gated against the newest STD (skill §8). |

### L28 Sister Spires · H · combine

| Field | Need |
|---|---|
| Curve slot · tier | band 3, x8 · H → **H** (target difficulty 8/10) |
| Role | combine |
| Lesson (≤ 6 words) | "One way down per spire." |
| New / reused | new: — · reused: glass, RC, stack, protected |
| Hero · batch | F07 three spires + bridges · C1 |
| Materials | spires RC (LISTED: left dark piers, right steel) · bridges steel · protected ×2 |
| RC | yes: hero piers hrc, cassettes mdeck (tier M14_RC), storey rule (needs K1 = A) |
| TNT | now 11 (expert 10) → **given 11, expert uses 10–11** (spare 0–1, D-blast-TNTTIGHT) |
| Targets (§4b H) | expert 4/4, margin +3 … +6, 1–2 blast(s) · sensible hint follower carries the misreading: 0–2/4 · variants 3–5/8 · naive 0/4 · lesson-less 0/4 for each combined lesson · foot 0/16 · search 0/24 · hero lock: ≤ 4 TNT never anywhere (no gift shortcut at the hero) · time-bot 180–270 s |
| Aids | 1 push-in on the hero foot, yaw NOT facing the solution · 2 never at the solution legs (a known mechanic may sit elsewhere) · 3 damage dots only (feedback, never a cue) · 4 cleanup: no (only from the second attempt) · 5 names the trick, no counts |
| Problems: bots | expert 4/4 91.7% (+6.7), variants 1/8 (H wants 3–5/8), 4 mechanics (H ≤ 3) |
| Problems: tester | "HARD" overstated: the easiest of L22–28 for the person (won 91%). (difficulty 2/5) |
| Done when | ≤ 3 mechanics; variants 3–5/8; tester difficulty ≥ 3; H row green. Plus: built and gated against the newest STD (skill §8). |

### L29 Old Tock Row · N · experience (surprise)

| Field | Need |
|---|---|
| Curve slot · tier | band 3, x9 · N → **N** (target difficulty 6/10) |
| Role | experience (surprise) |
| Lesson (≤ 6 words) | "One push. The whole row." |
| New / reused | new: — · reused: domino, materials |
| Hero · batch | F01 clock tower (reuse A1) · A4 |
| Materials | hero RC · row glass/concrete/brick/wood · steel mast |
| RC | yes: hero piers hrc, cassettes mdeck (tier M14_RC), storey rule (needs K1 = A) |
| TNT | now 11 (expert 10) → **given 10, expert uses 9–10** (spare 0–1, D-blast-TNTTIGHT) |
| Targets (§4b N) | expert 4/4, margin +3 … +8, 1–2 blast(s) · sensible 4/4, ≤ 2 blasts · variants 6–8/8 · naive 0–1/4 · lesson-less 0/4 · foot ≤ 1/16 · search ≤ 2/24 · hero lock: ≤ 3 TNT never; 4 only on the taught shortcut (⚠ K3) · time-bot 95–140 s (L32: 100 s) |
| Aids | 1 push-in on the hero foot (monIn), neutral yaw · 2 n/a (barrels taught at L32); painted yard marks the key legs on T/R/N-teach · 3 damage dots only (appear on a hit member; no cue) · 4 cleanup: yes (= L32 round 6) · 5 trick + place in on-screen words (= L32) |
| Problems: bots | expert 4/4 92.4% (+7.4), variants 7/8 |
| Problems: tester | The tip is false: the steel mast breaks the chain (30%, 51%). (difficulty 4/5) |
| Done when | the tip is true (no steel in the chain, or the tip names it); N row green. Plus: built and gated against the newest STD (skill §8). |

### L30 Sky Steps · B · boss

| Field | Need |
|---|---|
| Curve slot · tier | band 3, x10 · SH (boss label) → **B** (target difficulty 9/10) |
| Role | boss |
| Lesson (≤ 6 words) | "Tower back. Mast: stack." |
| New / reused | new: — · reused: street, protected, glass, stack, RC, multi-blast |
| Hero · batch | F12 stepped supertall · A5 |
| Materials | hero RC + glass (LISTED: dark piers) · hall with steel mast · glass block · school · road |
| RC | yes: hero piers hrc, cassettes mdeck (tier M14_RC), storey rule (needs K1 = A) |
| TNT | now 12 (expert 12) → **given 12, expert uses 11–12** (spare 0–1, D-blast-TNTTIGHT) |
| Targets (§4b B) | expert 4/4, margin +3 … +5, 2–3 blast(s) · sensible 0–1/4 · variants 1–3/8 · naive 0/4 · lesson-less 0/4 · foot 0/16 · search 0/24 · hero lock: ≤ 5 never (min 6 everywhere) · time-bot 270–340 s |
| Aids | 1 whole-lot opening, no push-in (set-piece reveal allowed) · 2 no gift barrels · 3 damage dots only on RC members · 4 cleanup: no · 5 names the trick in one line, no counts |
| Problems: bots | expert 4/4 90.0% (+5.0), variants 0/8 (B wants 1–3/8), time 355 s (B ≤ 340), 6 mechanics (B ≤ 4) |
| Problems: tester | The hint lists four mechanics at once; the spire needs more than 8 TNT. (difficulty 4/5) |
| Done when | ≤ 4 mechanics; variants 1–3/8; B row green. Plus: built and gated against the newest STD (skill §8). |

### L31 Stack Tower · R · breather

| Field | Need |
|---|---|
| Curve slot · tier | band 4, x1 · R → **R** (target difficulty 4/10) |
| Role | breather |
| Lesson (≤ 6 words) | "Two legs down. Steel: stack." |
| New / reused | new: Sky Strike booster (first free use) · reused: RC hero, stack |
| Hero · batch | F19 segment tower · A5 |
| Materials | hero RC (dark stilts on the tile) · sheds wood · steel block |
| RC | yes: hero piers hrc, cassettes mdeck (tier M14_RC), storey rule (needs K1 = A) |
| TNT | now 10 (expert 8) → **given 9, expert uses 8–9** (spare 0–1, D-blast-TNTTIGHT) |
| Targets (§4b R) | expert 4/4, margin ≥ +6, 1–2 blast(s) · sensible 4/4, ≤ 2 blasts · variants 7–8/8 · naive ≤ 2/4 · lesson-less n/a (relief) · foot ≤ 5/16 · search ≤ 6/24 · hero lock: ≤ 3 TNT never; min 6 (3+3) on two neighbouring legs · time-bot 80–100 s |
| Aids | 1 push-in on the solution side (monIn) · 2 n/a (barrels taught at L32); painted yard marks the key legs on T/R/N-teach · 3 damage dots only · 4 cleanup: yes · 5 count and place in on-screen words |
| Problems: bots | expert 4/4 89.3% (+4.3: R wants ≥ +6), variants 8/8, 2 TNT spare |
| Problems: tester | 49.1%: budget too tight for stacking + piers. (difficulty 4/5) |
| Done when | margin ≥ +6 with given = expert + 0–1; R row green. Plus: built and gated against the newest STD (skill §8). |

### L32 Sky Saucer · N · teach (STANDARD / reference) · **not rebuilt**

| Field | Need |
|---|---|
| Curve slot · tier | band 4, x2 · N → **N** (target difficulty 6/10) |
| Role | teach (STANDARD / reference) |
| Lesson (≤ 6 words) | "Fill the dots on two legs." |
| New / reused | new: barrels blast for free (+ RC hero if K1 ≠ A) · reused: RC hero (if K1 = A) |
| Hero · batch | F04 saucer tower · STD |
| Materials | hero RC tier · 3 small towers brick/steel legs · barrels |
| RC | yes (the standard) |
| TNT | now 9 (expert 8) → **given 9, expert uses 8–9** (spare 0–1, D-blast-TNTTIGHT) |
| Targets (§4b N) | expert 4/4, margin +3 … +8, 1–2 blast(s) · sensible 4/4, ≤ 2 blasts · variants 6–8/8 · naive 0–1/4 · lesson-less 0/4 · foot ≤ 1/16 · search ≤ 2/24 · hero lock: ≤ 3 TNT never; 4 only on the taught shortcut (⚠ K3) · time-bot 95–140 s (L32: 100 s) |
| Aids | 1 monIn push-in 0.3 s into planning, yaw 0.3 faces the barrel legs · 2 4 on a painted yard at the two front legs (40% / 32%) · 3 fixed slots (2 at barrel legs, 3 elsewhere), cue from the first second; tap on dots places TNT; tip "Fill the dots to crack the leg" until the first BLAST · 4 cleanup: one pulsing dot per remaining plan member after the tower falls + "Now the dots on what is left" · 5 "Fill the dots on the two front legs: the tower falls. Then one TNT by the red drums of each small tower." |
| Problems: bots | STD-v1 (round 6): expert 4/4 88% (+3), 1 TNT left; sensible 4/4 2 blasts; variants 7/8; naive 0/4; lesson-less 0/4 (74%); ≤ 3 TNT 0/128; time 100 s |
| Problems: tester | Round 5 blind tester: legs understood on attempt 2, 3 losses at 80.9–84.9% (finish); round 6 not re-tested by a person. (difficulty 4/5) |
| Done when | not rebuilt; keeps being tuned; every change bumps STD-vN (skill §10). |

### L33 Rivet Tower · N · experience

| Field | Need |
|---|---|
| Curve slot · tier | band 4, x3 · N → **N** (target difficulty 5/10) |
| Role | experience |
| Lesson (≤ 6 words) | "Barrels show the way down." |
| New / reused | new: — · reused: barrels, domino |
| Hero · batch | F03 lattice tower (reuse A2) · A5 |
| Materials | hero steel legs (on the tile) + RC deck · sheds row · barrels at one leg |
| RC | partial: legs are steel on the tile; RC on the deck/shaft |
| TNT | now 9 (expert 8) → **given 9, expert uses 8–9** (spare 0–1, D-blast-TNTTIGHT) |
| Targets (§4b N) | expert 4/4, margin +3 … +8, 1–2 blast(s) · sensible 4/4, ≤ 2 blasts · variants 6–8/8 · naive 0–1/4 · lesson-less 0/4 · foot ≤ 1/16 · search ≤ 2/24 · hero lock: ≤ (hero min − 2) never · time-bot 95–140 s (L32: 100 s) |
| Aids | 1 push-in on the hero foot (monIn), neutral yaw · 2 teach/practice of barrels only: at the key legs on the teach level (L32), elsewhere on a practice level · 3 damage dots only (appear on a hit member; no cue) · 4 cleanup: yes (= L32 round 6) · 5 trick + place in on-screen words (= L32) |
| Problems: bots | expert 4/4 93.3% (+8.3), variants 7/8 |
| Problems: tester | 36.8%: the row of 3 extra towers makes 85% unreachable on 9 TNT. (difficulty 4/5) |
| Done when | the row falls from the tower (domino), not by its own TNT; N row green. Plus: built and gated against the newest STD (skill §8). |

### L34 Tock Yard · N · experience

| Field | Need |
|---|---|
| Curve slot · tier | band 4, x4 · N → **N** (target difficulty 6/10) |
| Role | experience |
| Lesson (≤ 6 words) | "Row, then barrels." |
| New / reused | new: — · reused: barrels, domino |
| Hero · batch | F01 clock tower (reuse A1) · A5 |
| Materials | hero RC · row brick/wood · barrel dump |
| RC | yes: hero piers hrc, cassettes mdeck (tier M14_RC), storey rule (needs K1 = A) |
| TNT | now 10 (expert 9) → **given 10, expert uses 9–10** (spare 0–1, D-blast-TNTTIGHT) |
| Targets (§4b N) | expert 4/4, margin +3 … +8, 1–2 blast(s) · sensible 4/4, ≤ 2 blasts · variants 6–8/8 · naive 0–1/4 · lesson-less 0/4 · foot ≤ 1/16 · search ≤ 2/24 · hero lock: ≤ 3 TNT never; 4 only on the taught shortcut (⚠ K3) · time-bot 95–140 s (L32: 100 s) |
| Aids | 1 push-in on the hero foot (monIn), neutral yaw · 2 teach/practice of barrels only: at the key legs on the teach level (L32), elsewhere on a practice level · 3 damage dots only (appear on a hit member; no cue) · 4 cleanup: yes (= L32 round 6) · 5 trick + place in on-screen words (= L32) |
| Problems: bots | expert 4/4 93.8% (+8.8), variants 7/8, foot 1/16 |
| Problems: tester | Lost by 4% with no TNT left. (difficulty 3/5) |
| Done when | cleanup dots point at the barrel dump; N row green; F01 looks different from L3/L29 (twist or palette). Plus: built and gated against the newest STD (skill §8). |

### L35 Dome Works · H · combine

| Field | Need |
|---|---|
| Curve slot · tier | band 4, x5 · H → **H** (target difficulty 8/10) |
| Role | combine |
| Lesson (≤ 6 words) | "Outer sides only." |
| New / reused | new: trap barrels (a new twist on a Hard: move it, see sawtooth) · reused: barrels, protected, direction |
| Hero · batch | F14 dome hall (reuse in B1) · B1 |
| Materials | hero RC hall · side block B steel · barrels (help behind, trap inside) · school |
| RC | yes: hero piers hrc, cassettes mdeck (tier M14_RC), storey rule (needs K1 = A) |
| TNT | now 10 (expert 9) → **given 11, expert uses 10–11** (spare 0–1, D-blast-TNTTIGHT) |
| Targets (§4b H) | expert 4/4, margin +3 … +6, 1–2 blast(s) · sensible hint follower carries the misreading: 0–2/4 · variants 3–5/8 · naive 0/4 · lesson-less 0/4 for each combined lesson · foot 0/16 · search 0/24 · hero lock: ≤ 4 TNT never anywhere (no gift shortcut at the hero) · time-bot 180–270 s |
| Aids | 1 push-in on the hero foot, yaw NOT facing the solution · 2 never at the solution legs (a known mechanic may sit elsewhere) · 3 damage dots only (feedback, never a cue) · 4 cleanup: no (only from the second attempt) · 5 names the trick, no counts |
| Problems: bots | expert 4/4 89.8% (+4.8), variants 3/8 (in band), 2 blasts |
| Problems: tester | "HARD" vs an easy result (won 89%); trap barrels never explained. (difficulty 2/5) |
| Done when | no new idea on the Hard (trap shown first on L34 or dropped); tester difficulty ≥ 3; H row green. Plus: built and gated against the newest STD (skill §8). |

### L36 Sail Lot · R · teach

| Field | Need |
|---|---|
| Curve slot · tier | band 4, x6 · R → **R** (target difficulty 4/10) |
| Role | teach |
| Lesson (≤ 6 words) | "Drop it in the lot." |
| New / reused | new: target lot · reused: direction, protected |
| Hero · batch | F30 twin sails (reuse A2) · A5 |
| Materials | hero RC twin towers on concrete podium · protected ×2 · lot |
| RC | yes: hero piers hrc, cassettes mdeck (tier M14_RC), storey rule (needs K1 = A) |
| TNT | now 10 (expert 8) → **given 9, expert uses 8–9** (spare 0–1, D-blast-TNTTIGHT) |
| Targets (§4b R) | expert 4/4, margin ≥ +6, 1–2 blast(s) · sensible 4/4, ≤ 2 blasts · variants 7–8/8 · naive ≤ 2/4 · lesson-less 0/4 on a teach level · foot ≤ 5/16 · search ≤ 6/24 · hero lock: ≤ 3 TNT never; min 6 (3+3) on two neighbouring legs · time-bot 80–100 s |
| Aids | 1 push-in on the solution side (monIn) · 2 at the key legs once barrels are taught (L32+); before that n/a · 3 cue dots from the first second on a teach level; damage dots only on a relief level · 4 cleanup: yes · 5 count and place in on-screen words |
| Problems: bots | expert 4/4 95.1% (+10.1), variants 7/8, foot 3/16, 2 TNT spare |
| Problems: tester | 70.6%: "drop it in the lot" is vague; collateral anxiety; frame clips the building. (difficulty 3/5) |
| Done when | the lot is painted and framed at the opening; cue dots on the lot side; R row green. Plus: built and gated against the newest STD (skill §8). |

## 4. Batch plan

### 4.1 Mapping re-check (skill §8 vs the tile docs and the level data)

Source of truth for today's heroes: `levels6/levels-v6.json` + `levels-v6-l13-36.json` (`heroId`). L1-12-DRESS §1 is stale for L7–L11 (a later pass swapped them).

| L | Skill §8 said | Data / tile says | Change |
|---|---|---|---|
| 7 | C (F09 lift bridge) | F10 Grand Arch: a wide stone mass across the street | → **B** |
| 10 | A (F01 Grand Tock) | F09 Lift Bridge: two towers + steel walkway | → **C** |
| 11 | B (as F14) | F05 Shell Hall: hall on a podium | stays B, tile F05 (not F14) |
| 15, 36 | B (F30 listed as a hall) | F30 The Sail: twin sail TOWERS 49 m on a podium | → **A** |
| 20 | B (F32) | F32 Big Bow: steel arch BRIDGE | → **C** |
| 30 | B (F12) | F12 Sky Steps: stepped glass super-TOWER | → **A** |
| 9 | A | F04, the same tile as L32 | A; reuse mon14 or swap (K7) |

Result: **A towers/slabs 25** (1, 2, 3, 4, 5, 8, 9, 12, 14, 15, 17, 18, 21, 22, 23, 24, 25, 26, 27, 29, 30, 31, 33, 34, 36) · **B halls 6** (6, 7, 11, 16, 19, 35) · **C bridges 4** (10, 13, 20, 28) · L32 standard. The skill §8 table is updated to this mapping.

Tile repeats (one part function, owned by the first batch that builds it, read-only for later batches): F01 L3 / L29 / L34 (A1) · F14 L6 / L16 / L35 (B1) · F16 L4 / L24 (A1) · F28 L2 / L14 (A1) · F24 L5 / L18 (A1) · F21 L12 / L17 (A2) · F03 L8 / L33 (A2) · F30 L15 / L36 (A2) · F04 L9 / L32 (mon14).

### 4.2 Batches, in curve order (early levels first: they carry the most players)

| Batch | Levels | Hero type | Lane | Needs first | Recipe | Risks |
|---|---|---|---|---|---|---|
| **H0** | — | shared helpers (one agent, before any batch) | — | — | v14 helpers: (1) a material option on mon parts so a monumental hero can be wood / brick / concrete / steel (ladder) instead of M14_RC; (2) dots, cleanup dots and fail-text helper generic for any member family (slot count = TNT that member needs by the ladder); (3) monIn / push-in and opening-yaw helper callable per level; (4) a per-level aids switch read from the tier (§4b). | Every helper change makes every batch re-run determinism + gate (skill §8). Must not move L32's numbers (re-run L32 gate: same as STD-v1). |
| **A1** | L1, L2, L3, L4, L5 | A towers / slabs (ladder materials) | 1 | H0 | L32 tower recipe (storeys, glass + floorIn interiors, mon:1, lotK, camera) on wood / brick / concrete members; full T/N aid set; owns the F27, F28, F01, F16, F24 part functions. | Tutorial must stay winnable at monumental scale (70–90 m timber windmill: member count, first TNT must visibly break a post); calibrates the T and N rows of §4b, so run it alone first; L1–L5 carry the most players. |
| **B1** | L6, L7, L11, L16, L19, L35 | B halls / wide low masses | 2 | H0 | Hall seen through a glass front; storey = hall bay; interior = hall floor decor; wide-lot framing (fillMax cannot reach 60% of height: frame by width); owns F14 (×3), F10, F05, F35. | Three tester walls are here (L7 5/5, L11 4.6%, L16 18.6%); low heroes lose score to stubs (40% of % = tallest standing member); L19 / L35 RC exception (K1); L35 trap barrels (sawtooth). 6 levels: the biggest batch. |
| **A2** | L8, L9, L12, L14, L15 | A towers (steel legs, saucer, plinth) | 1 | H0, A1 | Tower recipe; steel-leg variants (lattice on concrete feet, sail towers on legs); L9 reuses mon14 (F04) at concrete tier; L14 reuses F28 from A1; owns F03, F21, F30. | L9 is a smaller copy of the L32 standard hero (K7); L15 lesson sits on the hero (LISTED); steel at monumental scale must still read as "steel" next to glass. |
| **C1** | L10, L13, L20, L28 | C bridges / linked towers | 2 | H0, B1 | Deck with traffic (decor), towers by the A recipe with v14 helpers only; bridge decks steel; owns F09, F17, F32, F07. | Two bosses + one Hard: most tuning rounds; L20 / L28 LISTED hero materials; L28 at 4 mechanics; L10 no gate since the swap; bridge spans cross the camera clearance rules. |
| **A3** | L17, L18, L21, L22, L23 | A towers, first RC heroes | 1 | A1, A2 | The full L32 recipe incl. M14_RC tier + storey rule; L17 teaches the RC hero (K1 = A); street lesson L21; reuses F21 (A2), F24 (A1); owns F22, F26, F34. | RC heroes need 6 TNT without barrels (barrels only from L32): little left for neighbours inside 7–12; L23 TNT sponge feedback; triangles over 60k on L18 / L23. |
| **A4** | L24, L25, L26, L27, L29 | A towers, glass band | 1 | A1, A3 | RC tower recipe; glass lesson = the mglass panes that carry nothing (tap assist to the frame); reuses F16, F01 (A1); owns F06, F25, F31. | L24 is the most layout-sensitive level; L26 steel on the hero (LISTED); glass taps must route to the frame or L25 repeats the 27.7% wall. |
| **A5** | L30, L31, L33, L34, L36 | A towers around the standard (barrels band) | 1 | A2, A4 | RC tower recipe next to L32; barrels as practice (L33, L34) with the L32 yard; reuses F03, F30 (A2), F01 (A1); owns F12, F19. | L30 boss at 6 mechanics; L33 row unreachable on 9 TNT for a person; three F01 heroes in the game (L3, L29, L34) must not look alike; closest to L32, so most affected by each STD bump. |

Order: **H0 → A1 (alone) → A2 ∥ B1 → A3 ∥ C1 → A4 → A5.** A1 runs alone because it calibrates the T and N rows of §4b with a blind tester before 30 more levels copy them.

### 4.3 Can batches run in parallel without touching the same files?

| File | Who writes | Parallel-safe? |
|---|---|---|
| levels6/patch/v14-monument.js (RC tier, camera, floorIn, dots) | helper owner only (H0) | yes if H0 lands before any batch; a later helper change forces every running batch to re-run determinism + gate |
| levels6/patch/v15-<batch>.js, tools/src-<batch>.js, checkpoints/index-v10i-<batch>.html, shots/<batch>/, <batch>-STATUS.md | that batch only | yes: one set per batch |
| part functions of a reused tile (F01, F16, F24, F28 in v15-A1; F03, F21, F30 in v15-A2; F14 in v15-B1) | owning batch | yes, read-only for later batches; this is why A2→A3→A4→A5 run in order on lane 1 |
| tools/src-l1-12.js, src-l13-36.js, levels-v6*.json, v10–v13 patches, existing checkpoints | nobody (read only) | yes: level data changes go through the batch build tool as overrides (like M14_SCENE) |
| tools/build-main.js, checkpoints/index-main.html (link 4xikD6) | Lead only, after Owner approves a batch | merge is serial |
| skill §4 / §4b / §10, this sheet | Lead only | serial |

File-wise: lane 1 (A batches, which share part functions) and lane 2 (B1 → C1, own tiles) never write the same file, so **two batches can run at once**. Limits: (1) skill §8 says Owner approves a batch before the next starts (K5); (2) the machine: two bot sets at once already inflate ms/step up to 7× and time out live determinism (L32 issue 2b): no more than two batches at a time, ms/step and fps measured only on a quiet machine; (3) each batch re-runs its gate against the newest STD before hand-in.

## 5. Cross-level problems (top 5)

1. **Weak points cannot be seen.** Bots win L3, L4, L6, L7, L10, L11, L23, L25, L27 comfortably; a first-time player loses by 15–80 points: no fall-direction cue, rotate and vertical drag undiscoverable, dark frames / glass hide the members, first TNT says "Didn't budge". Fix = the L32 aid set by tier (§4b): opening push-in, dots, cleanup dots, fail text in on-screen words.
2. **TNT economy is off in both directions.** 9 levels give 2 spare (against D-blast-TNTTIGHT) while the tester runs dry on steel / stack levels (L13, L14, L19, L26, L31, L33, L34: lost by 1–12 points). Fix by easier-to-find solutions and given = expert + 0–1, never by spare TNT.
3. **Hard / boss bands are miscalibrated.** Bot variants H 0–1/8 (L16, L24, L28) and bosses 0/8 (L20, L30) against 3–5 and 1–3; expert margins +11…+14 on L16, L24 (too forgiving for a pro, too opaque for a newcomer); L7 / L10 / L16 are walls to the tester, L28 / L35 are easy; mechanic counts over the limit on L16, L28, L30.
4. **The standard collides with the ladder.** An RC hero on every level contradicts the wood/brick/concrete/steel lessons and the 1-TNT dark-pier rule (same look, different rule); seven heroes still carry a taught material at their foot ("LISTED": L15, L17, L19, L20, L26, L28, L30) against D-blast-HERO-PROC. Needs K1.
5. **Words and data are stale or untrue.** Tips that are false or vague (L29 "One push", L10, L3, L6, L36), two new things at once (L32, L11, L21) and a new trap on a Hard (L35); no gate on record for L7–L11 since their heroes were swapped; frame clips the lot on L18, L23, L36; F01 / F14 used three times each.

## 6. Decisions only Owner can make

| ID | Topic | Options | Recommend |
|---|---|---|---|
| K1 | RC scope (D-blast-RC says "RC for every hero after") | A: RC from L17, which re-teaches "massive legs: fill the dots on two legs" (replaces the 1-TNT dark-pier lesson; one look = one rule); L1–16 heroes are monumental but on their ladder material. B: RC on every hero from L1 (breaks the wood/brick/concrete/steel lessons). C: RC from L32 only. | A |
| K2 | TNT on tutorial levels below the 7–12 band | Allow T = 4–6 (L1, L2 have 5) or force 7. | allow 4–6 |
| K3 | 4 TNT on the taught shortcut (open ⚠ from L32) | Accept "≤ 3 never, 4 only on the taught spot" as the N rule, or hold D-blast-RC "≤ 4 never". | accept |
| K4 | Curriculum shift (L13-36-STATUS §6.1) | Keep the built order (stack L13, glass L25, barrels L32, lot L36, cantilever L40+) instead of the brief's (glass L22, barrels L26, lot L32). | keep built |
| K5 | Batches in parallel vs skill §8 "Owner approves a batch before the next starts" | Allow two lanes (A-lane, B/C-lane) to run while the previous batch waits for approval, or strictly one batch at a time. | two lanes after A1 |
| K6 | Booster first use on a lesson level (L11 Ball, L21 Net) | Move the free pointer to the next N level (L12, L22). | move (Lead can decide) |
| K7 | L9 uses the same tile as the standard (F04) | Keep (cheap: reuse mon14 at concrete tier) or swap L9 to another tower tile. | swap |

Until K1 is answered, H0, A1, A2 and B1 can start on the ladder-material assumption (option A; B1 leaves L19 / L35 material open); A3 onward waits.
