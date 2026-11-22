#!/usr/bin/env node
/* g7hard order checker (22/11, Khai: "no material / obstacle before it is introduced"). Walks PLACE (patch.js) with the intro
 * triggers (main/intro.js INTRO_SCHED + INTRO_AT in patch.js) over the element audit (order-audit.json, read from the built game)
 * and asserts, for all 41 levels: no element before its intro level; an element's first level is its intro level; at most one new
 * element per level; nothing new on a Hard / boss; no two Hard / boss in a row. Elements the game has no card for are listed (KNOWN).
 *   node src/g7hard/check-order.js            exit 1 on any FAIL */
'use strict';
const fs = require('fs'), path = require('path');
const src = fs.readFileSync(path.join(__dirname, 'patch.js'), 'utf8');
const lit = (name) => { const m = src.match(new RegExp('const ' + name + ' = (\\[[\\s\\S]*?\\]|\\{[\\s\\S]*?\\});')); if (!m) throw new Error('no ' + name + ' in patch.js'); return Function('return ' + m[1])(); };
const ORDER = lit('PLACE'), AT = lit('INTRO_AT');
const A = JSON.parse(fs.readFileSync(path.join(__dirname, 'order-audit.json'), 'utf8')).levels;
const L = Object.fromEntries(Object.entries(A).map(([c, l]) => [c, Object.assign({}, l, { el: new Set(l.el) })]));
// element -> [card id in INTRO_SCHED, the level that carries it originally]
const CARD = { wood:['timber','o1'], brick:['brick','o3'], concrete:['concrete','o4'], blue:['keep','o5'], rotate:['rotate','o6'], steel:['steel','o8'],
  steps:['steps','o11'], dark:['rc','o17'], glass:['glass','o25'], barrels:['barrels','o32'], trap:['trap','o35'] };
const NOCARD = ['stone', 'drop', 'perblast'];
const pos = {}; ORDER.forEach((c, i) => { pos[c] = i + 1; });
if (ORDER.length !== 41 || new Set(ORDER).size !== 41 || Object.keys(L).some(c => !pos[c])) { console.log('FAIL PLACE is not a permutation of the 41 levels'); process.exit(1); }
const introPos = {}; for (const [e, [id, lv]] of Object.entries(CARD)) introPos[e] = pos[AT[id] || lv];
ORDER.forEach((c, i) => { for (const [e, p] of Object.entries(introPos)) if (p === i + 1) L[c].el.add(e); });   // a card shows its element
const first = {}; ORDER.forEach((c, i) => L[c].el.forEach(e => { if (!first[e]) first[e] = i + 1; }));
let fail = 0, known = 0; const rows = [];
ORDER.forEach((c, i) => { const n = i + 1, l = L[c], news = [...l.el].filter(e => first[e] === n), notes = [];
  const before = [...l.el].filter(e => !NOCARD.includes(e) && introPos[e] > n);
  if (before.length) { fail++; notes.push('FAIL before intro: ' + before.map(e => e + ' (intro ' + introPos[e] + ')').join(', ')); }
  const taught = news.filter(e => !NOCARD.includes(e)), untaught = news.filter(e => NOCARD.includes(e));
  if (taught.length > 1) { fail++; notes.push('FAIL ' + taught.length + ' new at once'); }
  if (l.hard && taught.length) { fail++; notes.push('FAIL new element on a Hard / boss'); }
  taught.forEach(e => { if (introPos[e] !== n) { fail++; notes.push('FAIL ' + e + ' first seen here, intro at ' + introPos[e]); } });
  if (untaught.length) { known++; notes.push('KNOWN no card in the game: ' + untaught.join(', ') + (l.hard ? ' (first seen on this Hard)' : '')); }
  if (i && l.hard && L[ORDER[i - 1]].hard) { fail++; notes.push('FAIL two Hard / boss in a row'); }
  rows.push(String(n).padStart(2) + ' ' + c.padEnd(4) + ' ' + (l.boss ? 'B ' : l.tier.padEnd(2)) + ' ' + l.name.padEnd(16) + ' new: ' + (news.join(', ') || '-').padEnd(18) + ' ' + notes.join(' · ')); });
console.log(rows.join('\n'));
console.log('intro levels: ' + Object.entries(introPos).map(([e, p]) => e + ' ' + p).join(' · ') + ' · no card: ' + NOCARD.map(e => e + ' first ' + first[e]).join(', '));
console.log('boss ' + ORDER.map((c, i) => L[c].boss ? i + 1 : 0).filter(Boolean).join(' / ') + ' · Hard / boss at ' + ORDER.map((c, i) => L[c].hard ? i + 1 : 0).filter(Boolean).join(' '));
console.log((fail ? 'FAIL ' + fail : 'PASS') + ' · ' + known + ' KNOWN (elements with no card: proposal for Khai)');
process.exit(fail ? 1 : 0);
