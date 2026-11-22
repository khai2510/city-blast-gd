#!/usr/bin/env node
/* Old-polish -> order-audit.json (Agents-Game 22/11). The rebuilt levels (city-blast/release/g7-old-levels.json) take their old
 * level's code in the element audit (src/g7hard/order-audit.json, read by check-order.js): name and element set are re-read from the
 * new level. Elements from the member keys each level's look check counted (city-blast/levels-gd/O<slot>/results-look.json "keys",
 * the same key -> element table as the 22/11 audit), blue from keeps, mechanics from L.teaches ("rotate" on a rotate level, "steps"
 * on the blast-in-steps level). Tier / boss / hard stay the old level's. ?oldlv=1 levels are not audited (they are the old ones).
 *   node src/g7hard/audit-old.js        (after export-old.js) */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', '..'), GD = path.join(ROOT, 'city-blast', 'levels-gd');
const A = path.join(__dirname, 'order-audit.json'), aud = JSON.parse(fs.readFileSync(A, 'utf8'));
const KEYS = { wood:['wpost','wwall','wfloor'], brick:['bk','bkw'], concrete:['concrete','cpan','crT'], glass:['glass','mglass'],
  steel:['steel','sdeck','mcol','mpost'], dark:['rc','rcs','hrc','hard7v'], stone:['hard7i'], barrels:['tank'] };
const old = JSON.parse(fs.readFileSync(path.join(ROOT, 'city-blast', 'release', 'g7-old-levels.json'), 'utf8'));
const out = [];
for (const l of old) {
  const r = JSON.parse(fs.readFileSync(path.join(GD, l.bp, 'results-look.json'), 'utf8')), keys = (r.rest && r.rest.keys) || r.keys || {};
  const el = Object.entries(KEYS).filter(([, ks]) => ks.some(k => keys[k])).map(([e]) => e);
  if ((l.keeps || []).length) el.push('blue');
  if (l.teaches === 'rotate' || l.faces) el.push('rotate');   // a faces level (aim / rotate) needs the view turned
  if (l.teaches === 'steps') el.push('steps');
  const a = aud.levels[l.replaces]; if (!a) { console.error('audit-old: no ' + l.replaces); process.exit(1); }
  aud.levels[l.replaces] = Object.assign({}, a, { name: l.name, tnt: l.charges.tnt, el, rebuilt: l.bp });
  out.push(l.replaces + '=' + l.bp + ' [' + el.join(' ') + ']');
}
fs.writeFileSync(A, JSON.stringify(aud).replace(/,"(o\d+|H\d|E\d\d)":/g, ',\n"$1":'));
console.log('ok   ' + out.join(' · '));
