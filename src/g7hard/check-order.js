#!/usr/bin/env node
/* g7hard order checker (22/11, Khai: "no material / obstacle before it is introduced"). Walks PLACE (patch.js) with the intro
 * triggers (main/intro.js INTRO_SCHED + INTRO_AT in patch.js) over the element audit (order-audit.json, read from the built game)
 * and asserts, for all levels (41; 46 with the easy pack E01-E06, 22/11; 51 with E05 E07-E10): no element before its intro level; an element's first level is its intro level; at most one new
 * element per level; nothing new on a Hard / boss; no two Hard / boss in a row. Elements the game has no card for are listed (KNOWN).
 * Easy pack (22/11): an element first seen on an easy level (42-51) is a FAIL, card or not (they come after every intro).
 * ORDER1123 (23/11, D-blast-LAUNCH / D-blast-L50): slots 1-50 follow city-blast/levels-gd/SLOTS-50.md. Checked: every card on its launch
 * slot (LAUNCH below), the launch order, at most one new card per level, no card on a Hard / boss, no two Hard / boss in a row, a relief
 * after every Hard / boss, at most 2 hard-feeling levels in a row (tester walls). Hard / boss levels are exempt from the launch sort
 * (EXCEPTION). A non-hard level that still shows an element before its launch is a FAIL unless SLOTS-50 lists it for conversion or it
 * fills a NEW slot (PENDING / PLACEHOLDER: content lands later). rotate is a control, not an element.
 *   node src/g7hard/check-order.js            exit 1 on any FAIL */
'use strict';
const fs = require('fs'), path = require('path');
const src = fs.readFileSync(path.join(__dirname, 'patch.js'), 'utf8');
const lit = (name) => { const m = src.match(new RegExp('const ' + name + ' = (\\[[\\s\\S]*?\\]|\\{[\\s\\S]*?\\});')); if (!m) throw new Error('no ' + name + ' in patch.js'); return Function('return ' + m[1])(); };
const ORDER = lit('PLACE'), AT = lit('INTRO_AT');
const A = JSON.parse(fs.readFileSync(path.join(__dirname, 'order-audit.json'), 'utf8')).levels;
const L = Object.fromEntries(Object.entries(A).map(([c, l]) => [c, Object.assign({}, l, { el: new Set(l.el.filter(e => e !== 'rotate')) })]));   // rotate = a control (D-blast-LAUNCH)
// element / booster -> [card id in INTRO_SCHED, the level that carries it originally, launch slot (SLOTS-50; 0 = after 50, card off)]
const CARD = { wood:['timber','o1',1], brick:['brick','o3',4], concrete:['concrete','o4',8], Ball:['wreck','o11',12], blue:['keep','o5',15], glass:['glass','o25',20],
  barrels:['barrels','o32',25], Net:['net','o21',30], steps:['steps','o11',35], steel:['steel','o8',40], Sky:['sky','o31',45], dark:['rc','o17',0], trap:['trap','o35',0] };
// FIX-1124 (UX-89, tester round 24/11): the protect card goes on the FIRST level that has protected members, wherever it stands
// (Hard or not): a rule the player can lose to is told before it can be met. Its launch slot is that level (7 Grand Arch now).
const FIRST_BLUE = ORDER.findIndex(c => L[c] && L[c].el.has('blue')) + 1;
if (FIRST_BLUE > 0) CARD.blue[2] = FIRST_BLUE;
const CARD_ON_HARD_OK = ['blue'];
const BOOSTER = ['Ball', 'Net', 'Sky'];
const NOCARD = ['stone', 'drop', 'perblast'];   // + heavy (counted as "dark" by the audit; launch 50, no card yet: D-blast-NONEW proposal)
// SLOTS-50 status "convert" / "rebuild" / "rebuild + convert": the level sits in its slot in its current form until its conversion lands
// + o2 / o3: SLOTS-50 places O02 / O03 there (D-blast-O23, 10 TNT), not wired yet in release/g7-old-levels.json: the old levels stand in
const PENDING = ['o2', 'o3', 'o9', 'E04', 'E02', 'o19', 'E06', 'o15', 'o21', 'o14', 'o13', 'o12', 'o4', 'E07', 'o5', 'o25', 'E03', 'E10', 'o34', 'o33', 'o17', 'o18',   'o29', 'o26', 'o11', 'E05', 'o22', 'o23', 'o27', 'o31', 'E01'];
// PLACE-1124 (24/11): the live re-audit (audit-live.js) finds no element before its launch on any level of this list any more; the list
// stays only because the tester walls (WALL) are still the pre-conversion results: emptying it turns 10 stale WALL rows into FAILs.
// PLACE-1124 (24/11): the NEW slots hold E11-E15 (no placeholder any more); the leftovers stand after 51 (o24 o32 E08 o28 E09 at 52-56):
// beyond the 1-50 launch plan, their later elements are listed (LEFTOVER), not failed (SLOTS-50 §4: natural slots 54-74)
const NEWSLOT = [];
const LEFTOVER = (n) => n > 51;
// tester walls (23/11 digest + 22/11): non-hard levels a first-timer failed, in their CURRENT form (pending / placeholder levels not judged)
const WALL = ['o2', 'o3', 'o5', 'o11', 'o12', 'o17', 'o18', 'E01', 'E02', 'E03', 'E04', 'E05', 'E06', 'E07', 'E08', 'E09'];
const pos = {}; ORDER.forEach((c, i) => { pos[c] = i + 1; });
const NLV = Object.keys(L).length;   // 51
if (ORDER.length !== NLV || new Set(ORDER).size !== NLV || Object.keys(L).some(c => !pos[c])) { console.log('FAIL PLACE is not a permutation of the ' + NLV + ' audited levels'); process.exit(1); }
let fail = 0, known = 0; const out = [];
const introPos = {}; for (const [e, [id, lv]] of Object.entries(CARD)) introPos[e] = AT[id] === 'off' ? Infinity : pos[AT[id] || lv];
for (const [e, [id, , want]] of Object.entries(CARD)) {
  const got = introPos[e], okk = want ? got === want : got === Infinity;
  if (!okk) fail++; out.push((okk ? 'ok   ' : 'FAIL ') + 'card ' + e + ' (' + id + ') on ' + (got === Infinity ? 'off' : 'L' + got) + ', launch ' + (want || 'after 50: off'));
  if (got !== Infinity && L[ORDER[got - 1]].hard) { if (CARD_ON_HARD_OK.includes(e)) { known++; out.push('ok   card ' + e + ' on a Hard (FIX-1124 UX-89: first level with protected members)'); } else { fail++; out.push('FAIL card ' + e + ' on a Hard / boss'); } }
}
const cardsAt = {}; for (const [e, p] of Object.entries(introPos)) if (p !== Infinity) (cardsAt[p] = cardsAt[p] || []).push(e);
Object.entries(cardsAt).forEach(([p, es]) => { if (es.length > 1) { fail++; out.push('FAIL L' + p + ' carries ' + es.length + ' cards: ' + es.join(', ')); } });
// launch order of the cards (the SLOTS-50 launch slots are increasing, so equal to the blueprint = in order)
const seq = Object.keys(CARD).filter(e => CARD[e][2]).sort((a, b) => CARD[a][2] - CARD[b][2]);
seq.forEach((e, i) => { if (i && !(introPos[e] > introPos[seq[i - 1]])) { fail++; out.push('FAIL launch order: ' + e + ' not after ' + seq[i - 1]); } });
const rows = [];
ORDER.forEach((c, i) => { const n = i + 1, l = L[c], notes = [], tag = NEWSLOT.includes(n) ? 'PLACEHOLDER' : LEFTOVER(n) ? 'LEFTOVER (after 51)' : PENDING.includes(c) ? 'PENDING' : '';
  const before = [...l.el].filter(e => !NOCARD.includes(e) && introPos[e] > n);
  if (before.length) {
    const what = before.map(e => e + ' (launch ' + (introPos[e] === Infinity ? '> 50' : introPos[e]) + ')').join(', ');
    if (l.hard) { known++; notes.push('EXCEPTION (Hard, as-is): ' + what); }
    else if (tag) { known++; notes.push(tag + ': ' + what); }
    else { fail++; notes.push('FAIL before launch: ' + what); } }
  const nc = [...l.el].filter(e => NOCARD.includes(e)); if (nc.length && !l.hard) { known++; notes.push((tag || 'KNOWN') + ' no-card element: ' + nc.join(', ')); }
  // PLACE-1124: heavy pieces (hard7v / t / p / e, audit-live.js "heavy") launch at 50 with no card: before 50 on a non-hard level = FAIL
  if (l.heavy && n < 50 && !l.hard) { if (tag) { known++; notes.push(tag + ': heavy (launch 50)'); } else { fail++; notes.push('FAIL before launch: heavy (launch 50)'); } }
  else if (l.heavy && !l.hard) notes.push('heavy (launch 50, no card yet)');
  const H = (k) => L[ORDER[k]].hard, ph = (k) => NEWSLOT.includes(k + 1) || PENDING.includes(ORDER[k]);
  const w = (k) => H(k) || (!ph(k) && WALL.includes(ORDER[k]));
  const near = (ks) => ks.some(k => NEWSLOT.includes(k + 1) || LEFTOVER(k + 1));   // a rule broken only through a placeholder / leftover slot (> 51) is reported, not failed
  const flag = (msg, ks) => { if (near(ks)) { known++; notes.push((ks.some(k => LEFTOVER(k + 1)) ? 'LEFTOVER ' : 'PLACEHOLDER ') + msg); } else { fail++; notes.push('FAIL ' + msg); } };
  if (i && l.hard && H(i - 1)) flag('two Hard / boss in a row', [i - 1, i]);
  if (i && H(i - 1) && w(i) && !l.hard) flag('no relief after the Hard / boss before', [i - 1, i]);
  if (i >= 2 && w(i) && w(i - 1) && w(i - 2)) flag('3 hard-feeling levels in a row', [i - 2, i - 1, i]);
  const card = cardsAt[n] ? 'card: ' + cardsAt[n].join(', ') : '';
  rows.push(String(n).padStart(2) + ' ' + c.padEnd(4) + ' ' + (l.boss ? 'B ' : l.tier.padEnd(2)) + ' ' + l.name.padEnd(16) + ' ' + card.padEnd(14) + ' ' + notes.join(' · ')); });
console.log(rows.join('\n')); console.log(out.join('\n'));
console.log('Hard / boss at ' + ORDER.map((c, i) => L[c].hard ? i + 1 : 0).filter(Boolean).join(' ') + ' · boss ' + ORDER.map((c, i) => L[c].boss ? i + 1 : 0).filter(Boolean).join(' / '));
console.log((fail ? 'FAIL ' + fail : 'PASS') + ' · ' + known + ' EXCEPTION / PENDING / PLACEHOLDER / KNOWN (listed above)');
process.exit(fail ? 1 : 0);
