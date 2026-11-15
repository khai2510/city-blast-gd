<!-- Copied from the team's internal game-designer checklist (agent skill 'game-designer'), 15/11/2026. -->

# Game designer

Use this whenever you touch levels, mechanics, obstacles, controls, tips/tutorial text or difficulty.

**Depth and sources:**
- `games/playbook/GAME-DESIGN.md`
- tier bands: `games/playbook/PROCESS.md` §3
- genre rules: `games/playbook/PLAYBOOK.md`

**Reading the numbers.** They are working targets, not laws: most are inferred [I] or come from search snippets [S]. Tune them with real data when it exists.

## 0. Ten principles

1. **Toy first.** The core verb must be fun with no goal. Rules sit on top of a fun toy; they never replace it.
2. **Difficulty comes from the decision, never from the verb.**
   - Don't shrink targets, add lag, hide feedback or cut the payoff to make a level harder.
   - Use the budget, structure, hazards, tolerances, combinations and how explicit the tip is.
3. **One idea per level.** Name its trick in ≤ 6 words. If you can't, the level has none.
4. **One new thing at a time.**
   - Teach → test → twist → combine (kishōtenketsu: introduce → develop → twist → conclude).
   - Never introduce a new element on a Hard or a boss.
5. **Same input, same outcome.**
   - Physics that decides pass/fail is seeded and fixed-step.
   - The intended plan wins ≥ 9/10 seeds; the naive plan fails clearly.
   - Chaos is for the spectacle and the stars, not for pass/fail.
6. **Readable cause and effect.**
   - Before: the player can see why the plan should work (telegraphing, previews).
   - After: they can see in ≤ 1 s why it failed.
7. **Sawtooth, labelled.**
   - Rise → labelled Hard → relief.
   - Every Hard/Super Hard is announced *before* it starts.
   - An unlabelled spike is a bug.
8. **Near-miss, not slap.** A good-but-imperfect plan on a Hard fails by 1–3%, never by 100%. Show the bar that failed.
9. **The game frames the problem.**
   - Never require camera control, precision or hidden knowledge to *find* the solution.
   - Optional camera is fine.
10. **Protect the payoff.**
    - Feedback within 100 ms of every input.
    - The big moment always plays, on a win or a fail.
    - No dead air over ~1 s after the fun ends.

## 1. Level design template

Fill this in for every level, in the level book or the task file, **before** building it.

```
L<n> <Name>            district: <d>   tier: T | N | H | SH | R
Idea (≤6 words):       <the one thing this level is about>
New element:           <none | element name>  stage: teach | test | twist | combine
Elements active:       <list>  (N ≤2, H ≤3, boss ≤4, all already taught)
Recipe hash:           side × tool(s) × waves × goal-type   (must differ from the last 5 levels)
Variety axis changed:  layout | obstacle | goal type | constraint
Naive move:            <what a first-timer does>  → fails because <visible reason>
Trick / aha:           <the right idea>  — learnable from what's on screen? Y/N
Telegraphing:          <how the screen shows the rule without text>
Tip (≤ 32 chars):      <names wave if waves matter: "Wave 1: …">
Fail reasons expected: <1–2, each with the on-screen evidence shown>
Target metrics:        first-try win __%  mean attempts __  p90 ≤ __
Bot proxies:           expert 10/10 seeds · sensible __% · naive __%
Tolerance:             expert plan's margin to each threshold ≥ 3–5 pts on 10/10 seeds
Payoff moment:         <what the 3–6 s ad clip of this level is>
```

## 2. Feature introduction schedule template

| Element | What it does (1 line) | Telegraph (look/colour/icon) | Teach (sandbox) | Test | Twist (the aha) | Combine (Hard/boss) | Retire/rotate |
|---|---|---|---|---|---|---|---|
| … | … | … | L_ | L_ | L_ | L_ | |

**Rules**
- **Cadence.**
  - In the first 30 levels, a new element every 2–4 levels.
  - After that, every 5–10.
  - Max 1 per level.
- **Where.** A teach level is a **relief or early Normal**: ≥ 95% win, with the element the only new thing on screen.
- **Gaps.** Twist comes 1–4 levels after teach. Combine comes on the next Hard or boss.
- **First appearance.** It gets a one-line intro card and a pointer. After that, no text.
- **Same look ⇒ same rule, always.** If the tip says "TNT does nothing to steel", it must do nothing.

## 3. Difficulty-curve rules (numbers)

| Tier | Share | First-try human win | Mean attempts | p90 attempts | Sensible-bot win | Live churn cap |
|---|---|---|---|---|---|---|
| T Tutorial | first 3–5 | ≥ 90% | ≤ 1.1 | ≤ 2 | 100% | ≤ 2% |
| N Normal | 55–65% | 60–85% | 1.2–1.7 | ≤ 4 | 70–95% | ≤ 3% |
| H Hard (labelled) | 15–20% | 30–50% | 2–3.5 | ≤ 8 | 30–60% | ≤ 5% |
| SH Super Hard/boss | 8–10% | 15–30% | 3.5–7 | ≤ 12 | 10–40% | ≤ 8% |
| R Relief | 10–20% | ≥ 90% | ≤ 1.1 | ≤ 2 | 100% | ≤ 2% |

- **Attempts.** Mean attempts ≈ 1 / first-try-win rate (SayGames: a 50% fail rate ≈ 2 attempts).
- **Watch the p90, not just the mean.** Mean 2 with p90 > 10 is a churn trap.
- **Cycle.** About 10 levels: T/N climb → H at about the 5th–8th → boss at the 10th → R right after the boss, and after most Hards.
- **Timing.**
  - First fail possible by L4–5.
  - First labelled Hard by L8–10.
  - First boss at L10.
  - No two H/SH in a row.
- **Live flags.** Churn > 2× its 4 neighbours' average, or a win rate outside the band, means re-tune. Change **one lever** per iteration.
- **No hidden DDA on outcomes.** Help is visible and opt-in:
  - after 2 fails, a stronger hint;
  - after 3, a ghost of the expert's first move;
  - the fail offer.
- **Upgrades that make levels easier** must be counted: tune bands at zero upgrades **and** at the expected upgrade level for that point.

## 4. Controls checklist

- [ ] **Reach.** Primary buttons sit in the bottom third. One-hand portrait works at 375×667 and 390×844.
- [ ] **Hit areas.** Every UI target is ≥ 44 pt. Every in-world target has an invisible hit volume of ≥ 44 pt; thin members get proxies.
- [ ] **Snapping and magnetism.** A tap within about 24 pt snaps to the nearest *valid* member for the selected tool. The snap target highlights on touch-down.
- [ ] **Tap vs drag.**
  - A tap is ≤ 8–10 pt of movement and < 300 ms.
  - A drag never places.
  - Decide on release.
- [ ] **Remove and move are explicit.**
  - A tap on a placed item selects it (ring + ✕). A drag moves it.
  - Removal has its own puff, sound and haptic.
  - Never remove silently on a repeat tap.
- [ ] **One-tap undo** for every reversible action.
- [ ] **Confirm vs instant.** Reversible actions are instant; the irreversible commit (BLAST) is explicit. Auto-commit only in a tutorial where the budget is 1.
- [ ] **Preview.** A ghost of the effect (radius) and the predicted outcome (fall arrow) shows on touch-down. Full early on, fading later; it can be a paid hint.
- [ ] **Camera.**
  - The start pose shows every solution face and hazard.
  - Hidden faces get a start-on-that-face or 90° snap-turn buttons.
  - Occluders fade.
  - The angle is kept on Retry.
  - Free camera is optional, never required.
- [ ] **Quick retry.** One tap, same camera, with an option to keep placements.
- [ ] **Skip.** Tap to skip settle once the outcome is decided; auto fast-forward when nothing visible moves.
- [ ] **Tip text is unambiguous about order and waves** ("Wave 1: … Wave 2: …").

## 5. Game-feel checklist

- [ ] **Latency.** Tap → visual ≤ 1 frame (never > 50 ms); sound/haptic ≤ 50 ms; consequence or anticipation starts ≤ 100 ms.
- [ ] **Level start.** PLAY → playable ≤ 1 s, with no main-thread freeze on the tap.
- [ ] **Anticipation → action → follow-through** on the core moment (fuse beeps/inhale → boom/flash → dust/settle).
- [ ] **Hit-stop.** 50–100 ms on primary impacts only, timed on real time.
- [ ] **Shake.** Smooth noise, 0.1–0.3 s, fast decay, scaled to impact; primary events only; an option to reduce it.
- [ ] **Hierarchy.** Primary events get visual, sound and haptic; secondary get less. Secondary never looks like primary.
- [ ] **Density.** Repeating feedback is rate-limited, so big moments stay big.
- [ ] **Squash and stretch** on UI/pickups (chips, coins, stars), not on realistic physics bodies.
- [ ] **The payoff plays on a fail too.** Then the fail cause is highlighted.
- [ ] **No dead air.** The result is ≤ 1 s after motion becomes uninteresting.
- [ ] **Celebration** scales with achievement (1★ < 3★ < boss), and fail payouts are < win payouts.

## 6. Level review rubric (score 1–5 each)

| Criterion | 1 | 3 | 5 |
|---|---|---|---|
| **Clarity** | can't tell the goal or the hazards; tip ambiguous | goal clear, rule needs the tip | goal, hazards and rule readable from the screen in 3 s |
| **Fairness** | following the intended idea fails; outcome varies by seed; fail cause hidden | intended plan wins most seeds; fail reason shown | intended plan wins ≥ 9/10 seeds with ≥ 3-pt margin; fail is a visible near-miss |
| **Aha** | no trick, or a guess | a trick, but obvious or told outright | naive move fails visibly; the fix is learnable and feels smart |
| **Variety** | same recipe as a level in the last 5 / a boss re-skin | one axis changed | ≥ 2 axes changed; a set piece for a boss |
| **Feel** | payoff cut, dead air, laggy input | standard payoff | signature moment, clip-worthy, no dead air |
| **Controls** | needs precision, camera hunting, or accidental actions happen | works with some effort | every target is easy; no camera needed; nothing accidental |

**Verdict**
- **Keep:** all ≥ 3 and average ≥ 3.5.
- **Rework:** any 2, or average 2.5–3.4. Name the one lever to change.
- **Cut:** any 1 that can't be fixed with one lever, or Variety 1 with no unique idea.

**Also check the tier band** (§3). A level can score 5s and still sit in the wrong slot of the curve.

## 7. Red flags (stop and fix)

- The tip and the physics disagree. "Do X" fails, or "Y does nothing" works.
- One word ("then") means different things on different levels.
- A fail at 98% with a big red title: the wrong bar is shown.
- A solution needs a camera swipe the game never taught, or the needed face is occluded.
- A repeated tap silently undoes, or a drag places.
- More than about 1.5 s of watching still rubble before the result.
- A boss that re-skins a recent level, or the same recipe twice in 5 levels.
- New element on a Hard, two new elements at once, or more than 4 mechanics active.
- The sensible bot wins a "Hard" 28/28, or the intended plan wins < 9/10 seeds.
- Hard levels with no label, two Hards in a row, or no relief after a boss.
- Fail payout ≥ win payout; the shop after every level once coins stop mattering.
- Hidden DDA, or randomness that decides pass/fail for a correct plan.
- Upgrades trivialise the curve, so the bands weren't tuned with them.
- Content loops silently ("LV 16" = L1).

## 8. Method (how to run a design or review pass)

1. Read the game's DESIGN/BUILDINGS docs, the latest tester feedback and this skill.
2. Write or refresh the **feature schedule** (§2) and the **curve** (§3) for the next 10–30 levels before touching a level.
3. Fill in the **level template** (§1) per level. Check the recipe hashes for repeats.
4. Build. Then run the bot sweep (≥ 10 seeds; expert, sensible and naive), plus a fresh tester-user.
5. Score the **rubric** (§6). Tune one lever per level, then re-run.
6. Record the verdicts and numbers in the level book or design doc. Report the red flags (§7) found.
