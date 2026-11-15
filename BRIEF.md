# City Blast! — game-design review brief (placeholder)

> The full brief (with per-level evidence packs) is still being prepared and will replace this file. Until then, this short
> version is enough to start: it names the 5 tasks, the files to read and the output format.

## Opening prompt (paste into AI Studio after importing this repo)

```
You are a senior mobile game designer (hybrid-casual and physics puzzle games; you know Smash Fest, Car Sort, Royal Match,
Angry Birds, Teardown). You are reviewing "City Blast!", a portrait physics demolition puzzle. The whole game is in this repo:
index.html (playable build, run it in the preview), src/ (its real source), data/ (levels, materials, tuning, bot results),
docs/ (design docs and decisions). Read README.md first, then data/*.json, then docs/LEVEL-STANDARD.md,
docs/GAME-DESIGN-CHECKLIST.md, docs/MATERIAL-CURVE.md and docs/DECISIONS.md. Play at least L1-L12 and one Hard, one Boss
and L32 in the preview (?lv=N opens level N).

Fixed rules you must NOT change (owner decisions): tap a member = one TNT exactly there; double tap = one more TNT + BLAST;
PASS 85 % on every level; protected (blue) buildings max 5 % damage; unlimited blasts while TNT lasts; TNT is the only charge
on L1-36; no placement hints; props are not counted; Hard = purple, Boss = orange; difficulty comes from the surroundings, never
from changing the hero building. Do not rewrite or port the game. Anything new (rule, material, obstacle, mechanic, button,
screen) goes in a clearly marked PROPOSAL, never into a level as if it existed.

Do these 5 tasks. For every finding give: ID (A-1, B-2 ...), level(s), evidence (file + field / line, bot number, or what you
saw in the preview at which level and moment), why it matters for the player, one concrete change with the number to change,
and how to verify it (which bot / metric should move and to what). Mark anything you did not see or read directly as [inferred].

A. BLAST IMPACT. Is the core moment satisfying and readable? TNT damage and falloff (data/blast-tuning.json, function blast()
   in index.html), what one / two / three TNT do to each material, how fast the first member breaks, collapse length, dead air
   before the result, camera framing of the collapse. Name the 5 biggest feel gaps and the exact constants you would tune.

B. MATERIALS. Review the material ladder wood < brick < concrete < RC < steel (data/materials.json, docs/MATERIAL-CURVE.md):
   is each material distinct and learnable from how it looks and reacts, is "TNT to break one pier" consistent per material,
   do base types (weak / stiff / tip / crush) behave as the look suggests? Flag any "same look, different rule" case.

C. LOGIC AND FAIRNESS. Using data/bot-results.json and data/levels.json: levels where the intended plan fails or wins by
   luck, where a naive plan wins, where the fail cause is not visible, where the protected-building rule fails a good plan
   (e.g. L10 expert clears 95 % but hits the protected building), tier labels that do not match the numbers (Hard that the
   sensible bot always wins, Relief that it always loses). Score every level 1-5 on the rubric of
   docs/GAME-DESIGN-CHECKLIST.md section 6 (one table) and give Keep / Rework (one lever) / Cut.

D. NEAR-LOSE / NEAR-WIN. Using docs/NEAR-MISS.md definitions and the per-level nearLose80to84 / nearWin85to88 counts: where do
   good plans fail by 1-5 points (good tension) and where by 30-60 points (a slap)? Where are wins razor-thin on Normal levels?
   Propose per level how to move the distribution (surroundings only) and what the lose card / fail offer should say.

E. 10 NEW LEVELS. Propose 10 levels for after L36 as JSON in the format of data/level-template.json (one object per level,
   ready to paste into the level editor), each with: tier, the idea in <= 6 words, which existing mechanic it tests / twists /
   combines, naive move and why it fails visibly, intended plan (sol), bot hints, expected expert / sensible / naive outcome,
   TNT count, fail tip (<= 9 words, a principle, never a spot). Reuse existing hero tiles (hero_catalogue) or plain buildings;
   follow the sawtooth (Hard around the 5th-8th, Boss 10th, Relief after). Only materials, obstacles and boosters that exist.

Output: one Markdown report with sections A-E, a top-10 list of changes ranked by player impact / effort, and the 10 level JSONs
in a fenced ```json block at the end.
```

## Files the tasks rely on

| Task | Read first |
|---|---|
| A blast impact | `data/blast-tuning.json`, `data/materials.json`, `docs/PHYSICS-AUDIT.md`, `docs/DESIGN.md`, `docs/research/h2h-smashfest-FEEL-Q1-9.md`, `index.html` (`function blast(`) |
| B materials | `data/materials.json`, `docs/MATERIAL-CURVE.md`, `docs/levels/BASE-STATUS.md`, `docs/levels/L32-MONUMENT.md` |
| C logic / fairness | `data/bot-results.json`, `data/levels.json`, `docs/LEVEL-STANDARD.md` §4-4b, `docs/levels/L13-36-STATUS.md`, `docs/PROTECTED-SPEC.md` |
| D near-lose / near-win | `docs/NEAR-MISS.md`, `data/bot-results.json`, `data/economy.json` (fail offer), `docs/SHOP-SPEC.md` |
| E new levels | `data/level-template.json`, `data/levels.json`, `docs/LEVEL-BRIEF-100.md`, `data/tutorial-schedule.json`, `data/boosters.json` |

Bot caveats: the gate ran with 2 seeds and the physics is deterministic, so each bot is one plan, not a sample. The bots place TNT
through the test API, not through taps. The sensible bot follows each level's stored hints (`bot.hints`); on many L13-36 levels it ends at
39-60 % clear. Read docs/levels/L13-36-STATUS.md before deciding whether that is the level or the hints.
