# City Blast! material and base curve, L1–36 (the one plan)

Written 14/11/2026 for **D-blast-MATCURVE** (Owner). Level designer pass; nothing built or tuned here.
Read with: skill `blast-level-standard` (STD-v3), skill `game-designer`, `LEVEL-NEEDS.md` (per-level needs), `L32-MONUMENT.md` §3 / §5 / §6.
Evidence for "now": the main build `checkpoints/index-main.html` and the batch checkpoints `index-v10i-a2.html`, `index-v10i-b1.html`,
loaded headless and every live body counted per part and member key (scratchpad dump, 14/11; method in §8).

## Tóm tắt cho Owner

- Giữ nguyên cách dựng toà học từ L32 (to, nhiều tầng, kính, nội thất). Thay đổi: **vật liệu và kiểu chân** của toà chính đi theo đường độ khó.
- **L1–6 mềm:** gỗ → gạch → bê tông thường; chân đơn giản (cột gỗ hở, vòng chân gạch, hàng cột sảnh). L1: **1 TNT** ở chân là đổ; L2–6: **2 TNT** hai chân cạnh nhau là nghiêng đổ về phía đó.
- **Giữa game:** thép dạy ở L8 (thép không vỡ, phá chân bê tông bên dưới), xếp 2 TNT lên chân thép ở L13; chân 1 cột ở L19; kính ở L25.
- **RC (bê tông cốt thép, 3 TNT/cột) chỉ ở cuối và chỉ 3 toà "bài thi":** dạy ở L31 (tháp trên 4 chân to), L32 (chuẩn, thùng nổ), L35 (Hard). Không còn "toà nào cũng RC" và bỏ hẳn "cột tối 1 TNT".
- **Mỗi màn tối đa 1 thứ mới**, thứ mới luôn có thẻ "New" ở màn dạy (T/R/N) trước khi lên màn Hard.
- Sửa lịch hiện tại: tách L4 (đang dạy cả toà xanh + xoay), booster dời khỏi màn nghỉ sau boss (L11→L12, L21→L22, L31→L33),
  bẫy thùng dời L35→L34, bỏ chữ "yard" ở L21 (lot chỉ dạy ở L36), bỏ cột tối `rc` ở L12/L17/L18/L25/L31.
- Độ khó vẫn đến từ xung quanh, số TNT, góc mở; hình toà vẫn theo ô Figma.
- **Cần Owner chọn:** (1) luật "đường ≤10%" chạy từ L1 hay từ L21; (2) L17 để trống (màn nghỉ) hay dạy thêm 1 thứ; (3) cho L8 "1 TNT ở chân bê tông là đổ tháp thép" (đúng bài học, nhưng phá luật khoá toà).

## 1. What this changes in earlier rules (for the Lead to record)

| Earlier rule | Where | Now (this plan) |
|---|---|---|
| "Every structural pier `hrc`, every cassette `mdeck` (tier `M14_RC`)", "its material is the fixed RC tier" | skill §1, §3, §4, §7 DoD; L32-MONUMENT §5.2 / §5.7; D-blast-RC "thông số RC dùng lại cho mọi toà sau" | `M14_RC` only on **L31, L32, L35**. Every other hero is on the ladder material this table gives. The L32 **look** (scale, storeys, glass, interiors, camera) stays the standard for every hero. |
| K1: RC hero from **L17** ("massive legs: fill the dots on two legs") | D-blast-K1, LEVEL-NEEDS L17–L36 "RC: yes" | RC taught at **L31** (R, F19 on massive stilts). L17 becomes a plain relief. The LEVEL-NEEDS "RC" line of L17–30, L34, L36 is void. |
| Skill §9 anti-pattern "steel-leg / dark-pier hero bases → move the material lesson to a neighbour" | skill §9; LEVEL-NEEDS L15, L26, L28 "LISTED" | A hero **may** stand on steel when its tile shows steel and this table plans it (L8, L26, L33). The anti-pattern stays for anything not in this table. |
| Ladder `rc` "Dark pier" (hp 220, 1 TNT on contact) as a lesson (L17 card "Dark piers need TNT right on them") | v10 ladder; main L12 core, L17, L18 core, L25 frame, L31; intro.js L17 | **Retired from level data.** A dark grey pier always means `M14_RC` (3 TNT, damage stays). Same look = same rule. Former `rc` members become `concrete` (1 TNT). The ladder key itself stays in v10 (read only) and is simply not placed. |
| Booster first use on the relief right after a boss (L11 / L21 / L31) | intro.js INTRO_SCHED, boosters2 | Won on the boss as now; **first use on the next rising N**: L12, L22, L33 (D-blast-INTRO-BTF item 5: "mở booster đúng lúc độ khó bắt đầu tăng"). |
| A1 order: L2 brick + first domino, L3 concrete, L4 protected + rotate | A1 build, intro.js | L2 brick, L3 domino, L4 concrete, L5 protected, L6 rotate (one each). |
| Trap barrels first seen on L35 (Hard) | LEVEL-NEEDS L35, intro.js | Taught on **L34** (N); L35 combines. |
| Hero lock row "RC hero" of skill §4b | skill §4b | Applies to L31, L32, L35 only. Ladder heroes use the ladder row, with the drop minimums of §4 below. |

Not changed: D-blast-THRESH thresholds, D-blast-HERO-PROC (shape = tile; difficulty from surroundings, TNT, yaw), D-blast-HERO-MONUMENT,
D-blast-TNTTIGHT, D-blast-NOHINT, K2 (T levels 4–6 TNT), K3 (RC: ≤ 3 never, 4 only on the taught spot), the blast-proof ladder floors of STD-v2.

## 2. Material ladder per TNT (from v10, unchanged) and base types

v10 damage of one TNT: `260 × (1 − d/3.8)^1.1 × dmg × (1 − armor)`, d = distance to the member; charges in one volley add up; ladder
members reset at every BLAST, `M14_RC` keeps its damage.

| Material (key) | hp · armor | One TNT on contact | TNT to break one base member | Splash | Reads as |
|---|---|---|---|---|---|
| Wood (`wpost`; walls `wwall` 15) | 30 · 0 | ≈ 286 (×9.5) | **1** | breaks posts within 3.3 m: one TNT between two posts takes **both** | warm timber |
| Brick (`bk`; walls `bkw` 40) | 70 · 0.1 | ≈ 234 (×3.3) | **1** | within 2.5 m | red / cream brick |
| Concrete (`concrete`; panels `cpan` 60) | 130 · 0 | ≈ 260 (×2) | **1**, right on it | only its own column (≤ 1.8 m) | light grey stone |
| Steel (`steel`, lattice `a2lat`) | 300 · 0.25 | ≈ 195 (×0.65) | **2 stacked** in one blast | on the member only (≤ 0.7 m) | blue-grey, rivets |
| Steel band / deck (`sdeck`) | 450 · 0.25 | ≈ 195 | 3 stacked (never a target) | — | bridge decks, belts |
| Reinforced concrete `M14_RC` (`hrc`, `mdeck`) | 600 · 0.05 | ≈ 247 (39 %) | **3**, damage stays between blasts; **2** next to barrels | contact | dark grey, rebar shows at 2 |
| Glass (`mglass`) | 14 | breaks | carries nothing | — | panes; a tap on a pane goes to the pier behind it (`mon:1`) |
| ~~Ladder `rc` "dark pier"~~ | 220 · 0.05 | ≈ 247 | 1 on contact | — | **retired** (looked like `M14_RC`, broke like concrete) |

Ladder heroes keep STD-v2's blast-proof floors (`M14.api.floors`): one TNT high up never drops a tower. The base is where it falls.

**Base / foot types** (all built with the v14 helpers). Rule family = what the player must learn.

| Base type | Rule family | Tiles that show it | First (level) |
|---|---|---|---|
| Open post ring (no walls at the foot) | "break the front, it falls that way" (L1) | F27 | L1 |
| Ring of brick / stone legs, tip rule (`M14.api.tip`) | two legs side by side → it tips that way | F28, F01, F16, F22, F26, F04-small | L2 |
| Arcade (piers with arches under a shaft) | same as legs ring | F01 | L3 |
| Hall piers in rows (`B1.hall`) | two side by side in one row → that row goes, the hall turns over | F14, F10, F05 | L6 (variation, same rule) |
| Concrete feet under steel | steel holds; the foot under it is concrete (1 TNT) | F03 | **L8** |
| Steel legs, no feet | two TNT stacked on each | tank towers, gantries; F25 cage | **L13** (neighbour), L26 (hero) |
| Podium pier rows under towers | hall rule on the podium | F30, F05 | L11 / L15 (variation) |
| Single pole per mass | one pole, one TNT | F35 | **L19** |
| Splayed stilts / pilotis | legs ring rule | F31, F34 | L23 (variation) |
| Glass frame (no pier behind most panes) | glass carries nothing: hit the frame | F06 | **L25** |
| Bridge pylons + steel deck | towers by the legs rule; the deck is never the target | F09, F17, F32, F07 | L10 |
| Massive RC stilts / pier ring (storey rule `ring()`) | 3 TNT a pier, two neighbours drop it, damage stays | F19, F04, F14 | **L31** |

A "variation" is a new look under a rule already taught: allowed on any N/H level as a variety axis, not counted as a new thing.
A base type in **bold** has its own rule and is a new thing (one per level, on a teach level).

## 3. Rules of the curve

1. **At most one new thing per level** (material, base type with its own rule, obstacle, mechanic or booster). Combining known things is free.
2. **Teach before test.** A material or base type is first used on a T / R / N level, with its "New" card (material, obstacle,
   booster) or its lesson tip (mechanic, base type), before any Hard, Super Hard or boss uses it. H / SH / B never introduce.
3. **Soft start (L1–6).** Wood, brick, plain concrete only; open posts, a legs ring or hall rows. On the taught side, **L1: 1 TNT drops
   the hero; L2–6: 2 TNT (two legs side by side) visibly tip it.** One TNT on one leg from L2 on breaks that leg in front of the player
   (physical feedback, D-blast-NOHINT) and never drops the hero. The extra TNT of the budget goes to neighbours, not into the hero.
4. **Base strength grows with the curve, not by surprise:** minimum TNT that drops the hero on the taught spot ≈ 1 (L1) → 2 (L2–30,
   ladder) → 4 on steel legs (2 + 2, from L26 on the hero) → 6 RC (3 + 3; 4 at barrels) only on L31, L32, L35.
5. **RC is late and a test.** `M14_RC` appears only on L31 (teach), L32 (standard, barrels) and L35 (Hard). Bosses L10 / L20 / L30 stay
   on ladder materials. No dark-grey member anywhere else.
6. **Steel slot.** L8 teaches "steel holds: break what it stands on" (concrete feet), L13 "two TNT stacked on a steel leg" (on a
   neighbour), L26 puts stacked steel on the hero, L33 twists the L8 tower with barrels.
7. **Same look = same rule.** Grey = concrete 1 TNT; blue-grey with rivets = steel 2 stacked; dark grey with rebar = RC 3. Never tint a
   ladder member dark (A1's L3 arcade `dk` 0.45 reads as steel/RC). Glass panes may sit on any hero from L1 because a tap on a pane
   goes to the pier behind it; before the L25 card no solution may depend on glass.
8. **Difficulty from the surroundings** (neighbours, protected, barrels, TNT, opening yaw) per D-blast-HERO-PROC; the hero's **shape** is
   its tile. Its **material and base structure** follow this table (new: D-blast-MATCURVE).
9. **Boosters** are won on a boss and first used on the next rising N level, alone on that level.
10. **Cards in ladder order** (H2H research §13): wood L1 → brick L2 → concrete L4 → steel L8 → glass L25 → RC L31.

## 4. Per-level plan

Columns: hero material and base; **pier** = TNT to break one base member; **drop** = minimum TNT on the taught spot that brings the
hero down (the tier's hero lock follows from it); neighbours; the ONE new thing; TNT given (expert ends with 0–1 left, D-blast-TNTTIGHT);
time band (skill §4b, STD-v2 early band for L1–5). Tiers as `LEVEL-NEEDS.md` §1 (T/R/N/H/B).

| L | Tier | Hero (tile) | Hero material | Base / foot | Pier | Drop | Neighbours | NEW (one) | TNT | Time |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | T | F27 windmill | wood | open ring of **6** posts, no foot walls | 1 (takes 2 posts) | **1** | barn wood | Tap + BLAST (wood, by hand) | 4 | 60–75 s |
| 2 | T | F28 lighthouse | brick (white bands; no grey floor or rock read) | ring of 8 brick legs, tip rule | 1 | **2** | 3 huts wood (off the fall line) | **Brick** card | 5 | 60–75 s |
| 3 | N | F01 clock tower | brick shaft on a **brick** arcade (cream, no dark tint) | arcade, tip rule | 1 | 2 | row of brick / wood houses | **Domino** (the fall knocks the row) | 7 | 70–110 s |
| 4 | N | F16 deco needle | concrete (grey stone) | ring of stone columns, tip rule | 1 (on it) | 2 | wood / brick blocks | **Concrete** card | 7 | 70–110 s |
| 5 | N | F24 wedge | brick, cream nose | brick legs at the wide end, tip rule (2, not 3) | 1 | 2 | shed wood, office concrete, blue hospital at the side | **Protected building** card | 8 | 80–110 s |
| 6 | N | F14 dome hall | concrete | hall piers in rows (variation) | 1 | 2 per row | timber shed, brick kiosk, school in front | **Rotate** (blast the back) | 9 | 95–120 s |
| 7 | H | F10 arch | concrete | four arch legs, two piers each (hall rule) | 1 | 3 | concrete tower, tram stop, school + hospital | — (rotate + direction + protected) | 11 | 180–270 s |
| 8 | R | F03 lattice tower | steel lattice | **3 concrete feet under steel** | steel 2 · foot 1 | 1 (a foot) | 2 steel water towers on concrete feet, wood sheds | **Steel** card ("Steel holds. Break what it stands on.") | 9 | 80–100 s |
| 9 | N | F04 small saucer | concrete | closed 8-sided shaft on a pier ring | 1 | 2 | mixed row, steel water tower on concrete feet | — (domino + steel feet) | 9 | 95–140 s |
| 10 | B | F09 lift bridge | concrete towers, steel walkway | two tower rings; walkway = steel band (never the target) | 1 | 2 + 2 | concrete / brick blocks, protected ×4 | — (rotate, domino, protected, steel feet) | 12 | 270–340 s |
| 11 | R | F05 shell hall | concrete | podium pier rows behind two sheds | 1 | 2 | 2 timber sheds in front, school, hospital | **Multi-blast** (blast in steps) | 8 | 80–100 s |
| 12 | N | F21 pedestal | concrete | pier ring inside the plinth; hidden block behind is **concrete** (not ladder `rc`) | 1 | 2 | hidden concrete block, wood sheds, brick | **Wrecking Ball** (first use) | 9 | 95–140 s |
| 13 | R | F17 harp span | concrete pylons, steel deck | pylon legs (tip rule); tank tower on 4 **steel legs, no feet** | concrete 1 · steel 2 | 2 per pylon | tank tower steel (the lesson), concrete block | **Stack two on steel** | 9 | 80–100 s |
| 14 | N | F28 lighthouse | brick | as L2 | 1 | 2 | row wood, steel gantry (stack) | — | 9 | 95–140 s |
| 15 | N | F30 twin sails | concrete, glass faces | podium pier rows under both towers (variation) | 1 | 2 | boat hall wood (cover), steel block (stack) | — | 10 | 95–140 s |
| 16 | H | F14 dome hall | concrete | hall rows | 1 | 2 per row | hospital in front, a block each side (brick or steel-legged) | — (rotate, direction, protected; stack if steel) | 12 | 180–270 s |
| 17 | R | F21 pedestal | **brick** (softer than L12: relief) | pier ring in the plinth | 1 | 2 | steel tower (stack), timber block | — (relief; was the RC teach) | 8 | 80–100 s |
| 18 | N | F24 wedge | brick | as L5; hidden core block behind is concrete | 1 | 2 | timber hall in front, concrete core block, brick side | — (multi-blast + rotate) | 10 | 95–140 s |
| 19 | N | F35 cube grove | concrete poles, brick-panel houses | **one pole per house** | 1 | 1 per house | steel tank on 4 legs (stack) | **Single pole** ("One pole, one TNT") | 10 | 95–140 s |
| 20 | B | F32 steel arch bridge | concrete pylons, steel arch + deck (band) | two pylons, 4 legs each | 1 | 2 + 2 | hall + core block, protected ×3 | — (multi-blast, stack, protected) | 12 | 270–340 s |
| 21 | R | F22 stepper | concrete (sandstone tint) | pier ring at the foot | 1 | 2 | steel tower (stack), timber block, road | **Street rule** (Road card) | 9 | 80–100 s |
| 22 | N | F26 pencil | concrete + glass | narrow pier ring + one wing | 1 | 2 | brick block behind, road | **Safety Net** (first use) | 10 | 95–140 s |
| 23 | N | F34 tube bundle | concrete tubes, dark glass | each tube on two stilts; tubes linked (one side's stilts → the bundle tips) | 1 | 2–3 | row brick / wood, road | — (street + domino) | 10 | 95–140 s |
| 24 | H | F16 deco needle | concrete | as L4 | 1 | 2 | side block on steel legs (stack), protected ×2, road | — (street, protected, stack) | 11 | 180–270 s |
| 25 | R | F06 glass pyramid | glass on a concrete frame | frame columns, no pier behind most panes | frame 1 · glass 0 | 2 | 2 brick palace wings | **Glass** card | 9 | 80–100 s |
| 26 | N | F25 bullet | **steel** diagrid behind glass (the tile is a steel cage) | ring of steel legs | 2 stacked | 4 (2 + 2) | glass block, brick block | — (stack on the hero = twist) | 9 | 95–140 s |
| 27 | N | F31 glass shard | glass on concrete splayed legs | 4 splayed legs (variation) | 1 | 2 | row glass / brick / wood, steel tower | — (glass + domino) | 10 | 95–140 s |
| 28 | H | F07 three spires + bridges | concrete spires, glass faces; steel bridges (band) | a pier ring per spire | 1 | 2 per spire | protected ×2, road | — (glass, protected, street; no RC) | 11 | 180–270 s |
| 29 | N | F01 clock tower | brick | as L3 | 1 | 2 | row glass / concrete / brick / wood, **no steel in the chain** | — (domino surprise) | 10 | 95–140 s |
| 30 | B | F12 sky steps | concrete + glass | wide pier ring under the setbacks | 1 | 3 | hall with a steel mast (stack), glass block, school, road | — (street, protected, glass, stack: 4) | 12 | 270–340 s |
| 31 | R | F19 stack tower | **RC** `M14_RC` | 4 massive stilts, storey rule | 3 | **6** (3 + 3) | timber sheds, steel block | **Reinforced concrete** card | 9 | 80–110 s |
| 32 | N | F04 saucer (standard) | RC (STD, unchanged) | RC pier ring, storey rule | 3 (2 at barrels) | 4 at barrels / 6 | 3 small towers brick / steel legs | **Barrels** card | 9 | 95–140 s (100) |
| 33 | N | F03 lattice tower | steel on concrete feet | as L8 | steel 2 · foot 1 | 1 (a foot) | shed row, barrels by one foot | **Sky Strike** (first use) | 9 | 95–140 s |
| 34 | N | F01 clock tower | brick shaft, concrete arcade (own palette) | arcade | 1 | 2 | row brick / wood, barrel dump, barrels next to a blue | **Trap barrels** (barrels push: not near blue) | 10 | 95–140 s |
| 35 | H | F14 dome hall | RC (one frame, `link`) | RC hall rows | 3 | 6 (3 + 3) | school, blocks on steel legs, drums help / trap | — (RC, barrels, protected) | 11 | 180–270 s |
| 36 | R | F30 twin sails | concrete | podium pier rows | 1 | 2 | protected ×2, road | **Target Lot** card | 9 | 80–100 s |

Notes on single rows:
- **L1:** 6 posts at ≈ 3 m centres so one TNT between two front posts takes both (wood splash 3.3 m) and the mill tips forward.
  The storey rule on a 6-post ring keeps "one post alone never drops it" true. Expert: 1 on the mill + 2 on the barn, 1 spare.
- **L2–6:** the tip rule stays (two neighbouring legs gone → the third of that face gives way) but the plan never needs a third TNT on
  the hero; A1 plans put 3 on the hero (L2–L5). The hinge may stay at 2.5 s, but the lean must start within 0.3 s so the player sees
  the result of the 2 TNT at once (game-designer §0.10).
- **L8 / L33:** one TNT on one concrete foot drops the 81 m tower (A2: 67–69 %). That is the lesson, and it empties the ladder hero
  lock (min 1). Kept as a deliberate exception (open question 3).
- **L16:** B1 built brick side blocks; LEVEL-NEEDS wanted a steel block (stack). Either is in plan; with steel the Hard has 4 mechanics
  (rotate, direction, protected, stack): keep brick.
- **L26:** the hero's own steel legs are the first "stack on the hero" (twist of L13); 2 + 2 on two neighbouring legs.
- **L31:** R tier with an RC hero: TNT 9 = 3 + 3 on two neighbouring stilts + neighbours. Time band 80–110 s (one RC pier takes longer
  to read). Fail principle: "Reinforced: three TNT a pier, two side by side."

## 5. Feature schedule (teach → practise → twist → combine)

| Element | Teach (card / tip) | Practised on | Twist | Combined (H / B) |
|---|---|---|---|---|
| Tap + BLAST, wood, open posts | L1 (hand only) | L2, L3 (wood neighbours everywhere) | — | — |
| Brick | L2 card | L3, L5, L14 | L17 hero (relief) | L16 blocks |
| Domino | L3 tip | L4, L9 | L29 (surprise: whole row) | L10 |
| Concrete | L4 card | L5–L7, L9, L11, L12 | — | L7, L10 |
| Protected building | L5 card | L6, L11 | L18 | L7, L10, L16, L24, L28, L30, L35 |
| Rotate | L6 tip | L9, L12, L18 | L22 (road in front) | L7, L10, L16 |
| Steel + concrete feet | L8 card | L9 | L33 (with barrels) | L10 |
| Multi-blast | L11 tip | L15, L18 | — | L20 |
| Wrecking Ball | L12 card + first use | free after | — | — |
| Stack two on steel | L13 tip | L14, L15, L17, L19 | L26 (on the hero) | L20, L24, L30 (L16 only if its side block is steel) |
| Single pole | L19 tip | — | — | (L20 hall) |
| Street rule | L21 card | L22, L23 | — | L24, L28, L30 |
| Safety Net | L22 card + first use | free after | — | — |
| Glass | L25 card | L26, L27 | — | L28, L30 |
| Reinforced concrete | L31 card | L32 | L32 (barrels open it) | L35 |
| Barrels | L32 card | L33 | L34 (trap) | L35 |
| Sky Strike | L33 card + first use | free after | — | — |
| Trap barrels | L34 tip | — | — | L35 |
| Target Lot | L36 card | L37–39 (next run) | — | — |

New things per level: 1 on L1–6, 8, 11, 12, 13, 19, 21, 22, 25, 31–34, 36; 0 elsewhere. Gaps: L13 → L19 is 6 levels (the guide
says 2–4 in the first 30; see open question 2); L25 → L31 is 6.

## 6. Intro schedule that results (`main/intro.js` INTRO_SCHED)

Same format as the file today; only the rows that change are marked.

```js
var INTRO_SCHED = [
  { lv:1,  kind:"charge",   id:"tnt",      name:"TNT",           how:"hand" },
  { lv:1,  kind:"material", id:"timber",   name:"Wood",          how:"hand" },
  { lv:1,  kind:"lesson",   id:"tapblast", name:"Tap a post, BLAST", how:"hand" },
  { lv:2,  kind:"material", id:"brick",    name:"Brick",         how:"card", fam:"brick",    line:"Brick: one TNT per leg." },
  { lv:3,  kind:"lesson",   id:"domino",   name:"Knock the row", how:"tip" },                                              // NEW row
  { lv:4,  kind:"material", id:"concrete", name:"Concrete",      how:"card", fam:"concrete", line:"Grey columns: one TNT each." },   // L3 -> L4
  { lv:5,  kind:"obstacle", id:"keep",     name:"Blue Building", how:"card", pick:"keep",    line:"Keep the blue building safe." }, // L4 -> L5
  { lv:6,  kind:"lesson",   id:"rotate",   name:"Turn the view", how:"tip" },                                              // L4 -> L6
  { lv:8,  kind:"material", id:"steel",    name:"Steel",         how:"card", fam:"steel",    line:"Steel holds. Break what it stands on." }, // spot-free line (A2 §5.2)
  { lv:11, kind:"lesson",   id:"steps",    name:"Blast in steps", how:"tip" },
  { lv:12, kind:"booster",  id:"wreck",    k:"wreck",            how:"card" },             // won on L10 (boss), first use L12 (was L11)
  { lv:13, kind:"lesson",   id:"stack",    name:"Stack two TNT", how:"tip" },
  { lv:19, kind:"lesson",   id:"pole",     name:"One pole each", how:"tip" },                                              // NEW row
  { lv:21, kind:"obstacle", id:"street",   name:"Road",          how:"card", pick:"street",  line:"Keep rubble off the road." },
  { lv:22, kind:"booster",  id:"net",      k:"net",              how:"card" },             // won on L20 (boss), first use L22 (was L21)
  { lv:25, kind:"material", id:"glass",    name:"Glass",         how:"card", fam:"glass",    line:"Glass holds nothing. Hit the frames." },
  { lv:31, kind:"material", id:"rc",       name:"Reinforced",    how:"card", fam:"rc",       line:"Reinforced: three TNT a pier." },  // L17 "Dark Pier" -> L31
  { lv:32, kind:"obstacle", id:"barrels",  name:"Barrels",       how:"card", pick:"barrel",  line:"Barrels blast for free." },
  { lv:33, kind:"booster",  id:"sky",      k:"sky",              how:"card" },             // won on L30 (boss), first use L33 (was L31)
  { lv:34, kind:"lesson",   id:"trap",     name:"Trap barrels",  how:"tip" },              // L35 (Hard) -> L34
  { lv:36, kind:"obstacle", id:"lot",      name:"Target Lot",    how:"card", pick:"lot",     line:"Drop the tower in the lot." }
];
```

Implementation notes for app-dev (not done here): the forced-tap selector `mfxClassOf(B.key) === e.fam` must find `hrc` for `fam:"rc"`
(check what class `hrc` returns; today the `rc` card targets the ladder `rc` key); the tray "Lv.N" locks follow `boosterLv()` and move
by themselves; `main/check-main.js` items that name L11 / L21 / L31 for the booster cards (I4 and the like) move with them.

## 7. Diff vs now

"Main" = `checkpoints/index-main.html` (L1–5 = batch A1, L32 = monument, every other level = the old levels6 data with the v11/v12
heroes, not yet monumental). "Batch" = the checkpoint waiting for approval (A2 `index-v10i-a2.html`, B1 `index-v10i-b1.html`).
"Plan before" = LEVEL-NEEDS + K1 (RC hero from L17).

| L | Main now: hero material / base · TNT · new | Batch / plan before | This plan | Change needed |
|---|---|---|---|---|
| 1 | wood mill, 8 posts a storey, storey rule (2 neighbours) · 5 · tap | — | 6 posts, 1 TNT drops · 4 | fewer posts, budget 4 |
| 2 | brick lighthouse, 8 legs; floors `a1lite` + rock foot read grey · 5 · brick **+ domino** | — | brick only, 2 TNT tip · 5 | no grey on the hero; huts off the fall line; plan 2 legs not 3 |
| 3 | brick shaft on **concrete** arcade tinted dark (`dk` 0.45) · 7 · concrete card | — | brick arcade, no tint · 7 · domino | arcade to brick; drop dark tint |
| 4 | concrete needle, 80 columns · 7 · **protected + rotate** (2 new) | — | concrete card, no protected · 7 | move blue + rotate out; re-tune |
| 5 | brick wedge, 20 ground legs, 3-leg rule · 8 · — | — | protected card, 2-leg tip · 8 | plan uses 2 legs |
| 6 | old concrete hall · 11 | B1: F14 concrete hall rows · 10 | rotate teach · 9 | B1 L6 = rotate teach, TNT 9 |
| 7 | old concrete arch · 12 | B1: concrete · 11 | same | none |
| 8 | old steel tower on concrete feet · 10 | A2: lattice on 3 feet · 9 | same | none |
| 9 | old concrete saucer · 10 | A2: concrete · 9 | same | none |
| 10 | concrete towers + steel band · 11 | C1 not built | same · 12 | C1: keep ladder |
| 11 | old concrete hall · 7 · multi-blast **+ Wreck** | B1: concrete podium · 8 | multi-blast only | Wreck to L12 |
| 12 | concrete plinth + **ladder `rc` core** (12 + 6) · 9 | A2: concrete plinth, hidden concrete block · 9 | + Wreck first use | ladder `rc` gone (A2 already); card |
| 13 | concrete bridge, steel deck; steel block · 10 | C1 not built | same · 9 | none |
| 14 | brick + concrete lighthouse · 9 | A2: A1's brick lighthouse · 9 | same | none |
| 15 | concrete sails · 12 | A2: concrete, stack on a neighbour · 10 | same | none |
| 16 | concrete hall · 8 (LEVEL-NEEDS: 12) | B1: concrete hall, brick blocks · 12 | same | none |
| 17 | concrete + **ladder `rc`** "Dark piers" card | plan: first RC hero (K1) | brick relief, no card · 8 | drop RC teach; no `rc` |
| 18 | brick wedge + **ladder `rc` core** · 10 | plan: RC wedge | brick + concrete core · 10 | no RC, no `rc` |
| 19 | concrete poles · 10 | B1: concrete poles · 10 | + "one pole" tip | intro row |
| 20 | concrete pylons + steel band · 8 | plan: RC pylon bases | concrete pylons · 12 | no RC |
| 21 | concrete stepper · 10 · street, tip "fall into the yard" **+ Net** | plan: RC | concrete · 9 · street only | Net to L22; "yard" out (lot is L36) |
| 22 | concrete pencil · 11 | plan: RC | concrete + Net · 10 | no RC |
| 23 | concrete tubes · 11 | plan: RC tubes | concrete stilts · 10 | no RC |
| 24 | concrete needle · 7 (LEVEL-NEEDS: 11) | plan: RC | concrete · 11 | no RC |
| 25 | glass + concrete frame + **ladder `rc`** ×4 · 10 | plan: RC frame | concrete frame · 9 | no `rc`, no RC |
| 26 | concrete + glass; steel on a neighbour · 10 | plan: RC, steel moved off | **steel** hero legs · 9 | steel on the hero (tile) |
| 27 | concrete + glass · 11 | plan: RC | concrete splayed legs · 10 | no RC |
| 28 | concrete spires, steel bridges · 8 | plan: RC, 4 mechanics | concrete, 3 mechanics · 11 | no RC |
| 29 | brick tower, **steel mast in the chain** · 11 | plan: RC | brick, no steel in the chain · 10 | tip true |
| 30 | concrete + glass · 8 · 6 mechanics | plan: RC | concrete, 4 mechanics · 12 | no RC, cut mechanics |
| 31 | concrete + glass + **ladder `rc`** ×4 · 10 · **Sky Strike** | plan: RC | **RC teach** · 9 | RC card here; Sky to L33 |
| 32 | RC standard · 9 · barrels | STD | same | none |
| 33 | steel lattice on feet · 9 | plan: steel legs + RC deck | steel on concrete feet + Sky · 9 | no RC deck |
| 34 | brick tower · 10 | plan: RC | brick / concrete + trap barrels · 10 | trap taught here |
| 35 | concrete hall · 8 · **trap barrels on a Hard** | B1: **RC** hall · 11 | RC · 11 | none (B1 matches) |
| 36 | concrete sails · 10 · lot | plan: RC podium | concrete · 9 | no RC |

**Known mismatches, checked against the build:**
1. **Material before its card.** Concrete on L2 (A1 lighthouse: grey `a1lite` floors and rock foot) and L3 (concrete arcade; card
   at L3, plan L4). Steel on L3: the arcade piers are tinted dark slate (`dk` 0.45, `0x3E4654`), which reads as steel / RC, plus a
   water-tank roof on block B; no steel key is in the built L3, so it is a look problem. RC on L12 and L18: the hidden core `R` is ladder
   `rc` (12 + 6 and 18 + 9 members), dark, 1 TNT, while L32 / L35 dark piers take 3.
2. **Two new things on one level:** L2 (brick + domino), L4 (Blue Building card + rotate tip), L11 (multi-blast + Wrecking Ball),
   L21 (street + Safety Net), L35 (trap barrels on a Hard).
3. **Boosters on the relief after a boss:** L11, L21, L31 → L12, L22, L33.
4. **Target Lot before L36:** L21's lesson text is "Keep the road clear: fall into the yard" (an aim zone 15 levels early); L32's yellow
   fuel yard under the barrels. Plan: L21 = "fall away from the road"; the L36 lot must not look like the L32 hazard pad.
5. **Street rule only from L21** (`street:{at:3, max:0.1}` on L21–24, 28, 30, 36 in the main data) vs D-blast-THRESH "≤ 10 % every
   level". **Open question 1** below; not changed by this plan.
6. **Glass panes from L4** (A1 L4: 80 panes, L5 13; B1 L6 24, L11 20; A2 L12 8, L15 64) before the L25 card: allowed by rule 7 (the tap
   goes to the pier behind; no solution needs glass before L25).
7. Early stiffness, measured: A1 plans put 3 TNT on the hero on L2–L5 and 2 (+ 2 on the barn) on L1; L5's wedge has 20 ground legs and
   342 bodies; tester difficulty 3–4/5 on L2–L4 (LEVEL-NEEDS §1).

## 8. Open questions for Owner

1. **Street ≤ 10 % from L1 or from L21?** D-blast-THRESH says every level; the game checks the road only on L21–24, 28, 30, 36.
   (a) Every level: the Road card moves to the first level with a road in the fall zone (L3 at the earliest), and L21 teaches something
   else. (b) From L21 as built: THRESH gets the words "from L21". Designer's recommendation: (b) for now (early levels have no road in the fall zone), and write it into THRESH.
2. **L17:** relief with nothing new (6-level gap after L13), or teach one more thing there (for example "wide plinth: a whole side must
   go", a new base rule on F21)? Plan assumes relief.
3. **L8 / L33:** one TNT on one concrete foot drops the steel tower. It is the lesson, but no other ladder hero falls to one TNT after L1.
   Keep, or give the tower a fourth foot so it needs two?
4. **L3–L5 TNT 7–8** stay in the N band (8–11 needs ≥ 8; L3–L4 at 7 as A1 built). Keep 7, or extend K2 (4–6 TNT) to L3–L4?

## 9. Method (how "now" was measured)

`index-main.html`, `index-v10i-a2.html`, `index-v10i-b1.html` copied to the scratchpad with one line that exposes `blocks`, `MEMBERS`
and `L`; each level started with `__blast.start(i)` (`?intro=0`); every live, non-anchor body counted by part id and member key, with
its start hp, `__blast.m14.need(i)` and how many sit on the ground storey. TNT from the level data. Raw output:
`<scratch>/mc/` (`main.txt`, `a2.json`, `b1.json`).
No bots were run; drop minimums in §4 are targets, to be checked by each batch with the structured hero check (skill §6).
