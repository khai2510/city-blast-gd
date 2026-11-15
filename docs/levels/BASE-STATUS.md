# BASE: "đế trụ khó đổ" — why the ground storey of early buildings feels too hard (14/11/2026)

Task from Lead: Owner says the base / foot piers of ALL buildings (hero + neighbours) on the early rounds are too hard: TNT on the
bottom does not bring them down. Phase 1 measure (read-only), Phase 2 prototype in scratch builds (`levels6/patch/v15-base.js`).
Not committed. main/*, v14, v15-a1, index-main.html untouched.

## 1. Causes (Phase 1, measured; logs `shots/base/logs/{main,a2,b1}-before.txt`)

One TNT kills EVERY wood / brick / concrete ground pier we tried (s1 "killed 1/1" on all 60+ buildings, `need` 1): the material
ladder per pier is right. What is hard is the BUILDING's answer to a lost pier:

| # | Cause | Where (numbers = % of the building down) |
|---|---|---|
| C1 | **Frames with 3+ posts a face carry a lost corner on their bonds** (the slab cantilevers; no rule) | 3x2 timber houses (L2 B/C/E, L3, L4 C, L8 C, L6/L11 sheds): 1 post 8-13 %, corner + its nearest post 14-17 %. 2x2 concrete blocks (L3 B, L5 C, L8 W/V, L9 B/W/F, L10 B, L12 D): 1 pier 2-8 % (2 TNT on one pier 87-99 %: the splash takes a second pier). 2x2 brick houses 21-24 %. Only 2x2 TIMBER sheds fall from one post (73-98 %) |
| C2 | **Scripted rules say "one lost pier never drops it" and count only NEIGHBOURS** (v14 `tip`, A1/A2 heroes; v14 `ring` L1 mill) | 1 leg: L1 1 %, L2 3 %, L3 1 %, L4 1 %, L5 0 %, L9 2 %. **4 alternate legs of 8 gone: L2 10 %, L4 4 %, L9 7 %** (half the legs gone, tower stands). Two neighbours: 100 % |
| C3 | B1 hall rule: two NEIGHBOURS in one ROW; a hall has 14-32 ground piers | L6 dome hall: 1 pier 1 %, corner + nearest (other row) 27 %, 4 corners 3 %; L11: 4 corners 5 % |
| C4 | Old main-build L6-L12 mass heroes (deep column grids, no rule) | L6 old dome 20 piers: pair 19-20 %, 4 corners 10 %; L11 old hall 10 piers: pair 2 %, 4 corners 4 %; L12 old pedestal: pair 4-5 %, corners 9 % |
| C5 | Members wider than 1.2 m never "crush" (`isColumn` half < 0.6) and need 2 TNT | L8 lattice legs 1.7-1.9 m (but their concrete foot drops it from 1 TNT: 92 %) |
| C6 | Tap assist: a tap on a pane goes to the pier behind it (B1 §6.1) | halls L6/L11/L16: the TNT lands on the far row, the hall falls away from the player (not re-measured here) |

Not causes: blast-proof floors (above the base only), the hinge `hold` (it only delays the far face of a fall that already started),
concrete feet on steel (L8: 1 TNT on a foot drops it), base anchors (fixed slab), plateHw (decor).

## 2. The fix: a per-building BASE setting (`patch/v15-base.js`, scratch builds only)

Level data says, per building id, how its ground storey answers a lost pier. Missing = today's behaviour (nothing global changes).

```
L.base = { "<bid>": spec | "<preset>", "*": spec | "<preset>" }
spec   = { rule:"tip"|"ring"|"keep"|"none", n:1|2, reach:<gaps>, hold:<s>, sag:0|1, pierTnt:<k>, shove:<m/s>, own:0|1, force:0|1 }
```

| Knob | Meaning | Values |
|---|---|---|
| `rule` | tip = the near half of the ground storey on the lost side gives way in order, middle line 0.4 s later, far line = hinge or crushed at 0.7 s → leans/falls THAT way · ring = all ground piers crush (straight drop) · keep = the builder's own rule (A1/v14 tip, v14 ring, B1 hall, A2 feet) · none = physics only | default keep |
| `n` | piers lost before the rule fires | 1 = one pier (weak base) · 2 = two (stiff base) |
| `reach` | with n = 2: how far apart the two may be, in pier gaps | 1.6 = neighbours only (plan wording "side by side") · 2.6 = one pier between (fixes "4 alternate legs gone, still stands") |
| `hold` | far line is a hinge (not crushable) for s seconds: tips like a tree | 0 (low frames: drop + lean) · 2.5 (towers) |
| `sag` | n = 2: the first lost pier already breaks the skin panels next to it (dust): visible "it moved" | 0/1 |
| `pierTnt` | TNT one ground pier takes in one blast (sets hp from `M14.api.perTnt`) | omit = its ladder material |
| `shove` | push of the ground-storey floors towards the lost side (low wide frames) | m/s, default 0 |
| `own` | a hero with the v14 tip: 1 = replace it by the generic rule; default = **via mode**: keep its hinge + `onTip` (wedge), the setting only decides WHEN it fires by breaking the pier that completes the pair | |
| `force` | apply to an RC (`hrc`) base too (default: RC keeps its storey rule) | |

Presets: `weak` {tip, n1, hold 0} · `weak-tip` {tip, n1, hold 2.5} · `stiff` {tip, n2, reach 2.6, hold 0, sag} · `stiff-tip` {tip, n2,
reach 2.6, hold 2.5, sag} · `crush` {ring, n2} · `rc`/`keep` · `none`. Which side: the mean of the lost piers from the storey centre; a
lone corner pier goes to the side its TNT sat on (nearest fired charge). Deterministic: game-time `later()` only.
URL: `?base=0` = setting ignored · `?base=<preset>` = that preset on every non-RC target (probe) · `?baseproof=0` = no proof data.
Test API `__blast.base.info()`. MATERIAL-CURVE mapping: L1 hero `weak-tip`; L2-6 heroes `stiff-tip` (or reach 1.6 for strict "side
by side"); B1 halls `keep` (row rule = "2 per row"); every ladder neighbour `weak`; RC heroes (L31/32/35) untouched.

## 3. Before / after (proof levels; `logs/*-before.txt` vs `*-after*.txt`, gates `gate-*-base*.txt`)

Per building: % down after 1 TNT on one ground pier (s1) · 4 TNT on alternate ring piers (c1). Hero = A.

| L | Setting | Hero s1 · c1 before → after | Neighbours s1 before → after | Expert (A1/A2/B1 hand-in → base) | Sens. | Naive | Lesson-less | Foot 16 | Search 24 | R-11 |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 T | A weak-tip, * weak | 1 · 100 → **100** · 100 | barn 27 → 59 | 97 +12 → 94 +9 | ✓ | wins (T: may) | n/a | not gated | – | ✓ `bb9d05a4` |
| 2 T | A stiff-tip, * weak | 3 · **10** → 3 · **100** | huts 11-13 → 94-99 | 95 +10 → 96 +11 | ✓ | fails | passes 86 (T: n/a) | 0 | 1 | ✓ |
| 3 N | A stiff-tip, * weak | 1 · 100 → 1 · 100 | 6-97 → 94-99 | 91 +6 → 92 +7 | ✓ 88 | fails | fails 81 | 0 | 1 | ✓ |
| 4 N | A stiff-tip, * weak | 1 · **4** → 1 · **100** | 13-92 → 92-99 | 92 +7 → 93 +8 | ✓ 95 | fails | fails (coll.) | 0 | 2 | ✓ |
| 5 N | A stiff-tip (wedge onTip kept), * weak | 0 · 100 → 0 · 100 | 2-92 → 97-100 | 92 +7 → 91 +6 | ✓ 90 | fails | fails (coll.) | 0 | 1 | ✓ |
| 9 N (A2) | A stiff-tip, * weak | 2 · **7** → 2 · **100** | 3-97 → 94-100 | 91 +6 → 92 +7 | ✓ 91 | fails | fails 82 | 0 | 1 | ✓ |
| 6 N (B1) | A keep (hall rule), * weak | 1 · 3 → same | shed 8 → 100, kiosk 21 → 94 | 93 +8 → 91 +6 | ✓ 91 | fails | fails (coll.) | 0 | 1 | ✓ |

Hero lock: one TNT on one hero leg (L2-L5, L9) still 0-3 % (plan: "never drops"); L1 now 100 % (plan: 1 TNT). Determinism: seq /
after / fresh / wait / raf 3/3 on all seven; live loop L1-2 see log. `?base=0` = old numbers (L1 97 %, L5 92 %, diag).
Shots `shots/base/`: `L2-hero-4alt-before-vs-after.png` (4 alternate legs gone: stands → tips), `L2-boathouse-1tnt-before-vs-after.png`
(one post: 11 % → 99 %), single frames `*-{before,after}-{0-placed,1.5s,4s}.png`.

## Progress log (newest last)
- 14/11 start: skill + MAIN-BUILD §1-3,§11 + A1/A2/B1 status read. Tools in `levels6/shots/base/tools/`, logs in `.../logs/`.
- Probe `shots/base/tools/basebot.js` (per target building: s1/s2/s3 = k TNT on one corner pier, p1/p2 = k TNT on a corner + its
  nearest pier, c1 = 1 TNT on each of 4 corners, f1 = 1 TNT on every pier of the z+ face; "down" = > 50 % of the building's mass dead
  or dropped > 1.2 m). Running on index-main L1-12, a2 L8,9,12,14,15, b1 L6,7,11,16,19. Logs `shots/base/logs/*-before.txt`.
- First numbers: one TNT ALWAYS kills a wood/brick/concrete ground pier (ladder fine), but the building does not move:
  L2 lighthouse 1 leg 3 %, **4 alternate legs of 8 gone: 10 %**; L1 mill 1 post 1 %; L3 clock tower 1 %; 6-post timber neighbours
  (3x2) 11-13 %, even two posts gone at a corner 14-17 %; 4-leg concrete blocks 3-6 %. 4-post timber sheds fall from one (74-97 %).
- Prototype `patch/v15-base.js` written (per-building base setting, see its header); scratch builds in scratchpad/base/.
- Probe before: main L1-12 done (`logs/main-before.txt`), a2 L8/L9 done (`a2-before.txt`, a2 L12/14/15 not run: browser budget),
  b1 L6/L11 running. Prototype r1 → r4 (`logs/gate-main-base-r*.txt`): via-mode for heroes with the v14 tip (keeps hinge + wedge
  onTip), stub sweep, charge-side tie break. Coordinator: MATERIAL-CURVE.md → L1 hero 1 TNT, L2-6 2 legs, neighbours 1 pier.
- r4 gate (main-base, L1-5, N=1): expert 94/96/92/93/91 (+9/+11/+7/+8/+6), sensible 5/5, naive fails L3+; L2 lesson-less
  passes (86 %): T tier = n/a in §4b. Determinism LIVE=0 x3 running.
- 14/11 r4 = final proof data (MATERIAL-CURVE mapping). Gates met L1-5 (main-base), L9 (a2-base), L6 (b1-base); foot 0/16 and
  search 1-2/24 on all; determinism LIVE=0 3/3 all seven; loadcheck ok on the three scratch builds. Live loop L1-2 running.
- Live loop (cold + warm) L1, L2: identical (`det-live-main-base.txt`). Hand-in.

## 4. Merge + risks
- Merge: `patch/v15-base.js` as a step after the last v15 batch block, before `glue-final` (same anchor `} // main`; tool
  `shots/base/tools/src-base.js` shows how). Its `BASE.proof()` block = the L1-6/L9 settings; move them into each batch's level data
  (`L.base`) when the material-curve pass rebuilds the levels, then drop `proof()`.
- Risks: (1) not re-run: time-bot, newcomer, jitter, gesture, the other levels (L7, L8, L10-36 have no setting = unchanged);
  (2) weak neighbours make cheap 1-TNT clears: TNT counts / expert plans must be re-set by the plan (L1 now needs fewer TNT);
  (3) L2 lesson-less plan now passes (T = n/a); (4) side = mean of lost piers, corner tie = side of its TNT: a player's off-centre
  tap can flip a corner's fall; (5) hall heroes (B1) still need 2 neighbours in one row and the pane tap assist still aims at the
  far row (C6): not changed here; (6) buildings must be axis-aligned (true for all current parts).

## 5. Merged into MAIN (14/11, Lead's request; not committed, not published)
- Step `base` (17 in `--list`): `levels6/tools/src-base.js` + `patch/v15-base.js` (proof() removed; only ladder ground storeys
  wpost/bk/concrete take a rule). Data: L1-5 in `patch/v15-a1.js` set(…, { base }), L6-12 in `tools/src-l1-12.js` (heroes keep,
  neighbours weak). MAIN-BUILD.md: pipeline row 15c, `?base=0` flag, §12, check numbers.
- Rebuilt `checkpoints/index-main.html` sources `d535b948a218`: loadcheck ok · check-main 86/0 · R-11 L1-5 new hashes (= proof
  build), L32 `eae75bb9` unchanged · gate L1-5 as §3. Newcomer before (`?base=0`) vs after: `logs/newcomer-{before,after}.txt`.
- D-blast-NONEW (arrived after the merge request): the base rule is a new collapse rule added on the Lead's instruction; `sag`
  (panels next to a first lost pier break) is the one purely new visual and can be dropped (presets without sag) if Owner wants.
- Newcomer blind (2 attempts) before `?base=0` → after: L1 win (2 blasts) → win with 1 tap; L2 win a2 → win a1; L3 lost → lost
  (66/76); L4 lost (hospital) → win a2 85.5; L5 lost → lost (74/75). 2/5 → 3/5. Machine load 40 on 4 cores during the runs (L3-5
  re-run with longer page timeouts: `shots/base/tools/newcomer-main-slow.js`).
