#!/usr/bin/env node
/* City Blast! combo praise v18 (11/11/2026, combo/COMBO.md): tiered praise per BLAST (Nice! Great! Excellent! Amazing!
 * Unbelievable!), one word at a time: Figma sprite + ElevenLabs voice line + rising chime + haptic.
 *   node combo/patch.js <in.html> <out.html>
 *   node combo/patch.js --check <in.html>            (report anchors only, write nothing)
 *   COMBO_SET=b node combo/patch.js ...               (embed the B takes instead of A; Owner is still choosing)
 * Base: checkpoints/index-v16b-ui-h2h.html + voice/patch.js -> checkpoints/index-v18-combo.html. Stacks on haptics2 and
 * the round-5 levels: every anchor is engine / audio code (detonateAll, fixedStep, blast, failMember, waveEnd, comboMul,
 * the SFX composite), never level data. Works without voice/patch.js (no TIMBER-call wait) and without haptics2 (plain
 * vibrate). Rules (as v31/patch.js): text anchors only, each found exactly once, no overlapping edits, the file must not
 * carry this patch's marker; otherwise exit 1 and nothing is written. Never writes an index.html.
 * Inputs: combo/patch/combo.js (game), combo/patch/engine.js (composite), combo/assets/w1..5.webp (combo/tools/cut_words.py),
 * combo/audio/*_{a,b}.mp3 (combo/prep.sh).
 */
'use strict';
const fs = require('fs'), path = require('path');
const DIR = __dirname, MARK = '// ---- combo v18 (combo/patch.js';
const args = process.argv.slice(2), CHECK = args[0] === '--check'; if (CHECK) args.shift();
const IN = args[0], OUT = args[1];
if (!IN || (!CHECK && !OUT)) { console.error('usage: node combo/patch.js [--check] <in.html> <out.html>'); process.exit(2); }
if (OUT && path.basename(OUT) === 'index.html') { console.error('refusing to write an index.html'); process.exit(2); }
const SET = (process.env.COMBO_SET || 'a').toLowerCase();
if (!/^[ab]$/.test(SET)) { console.error('COMBO_SET must be a or b'); process.exit(2); }
const src = fs.readFileSync(IN, 'utf8');

// active-speech RMS (dB) of combo/audio/*.mp3 (ffmpeg silenceremove -40 dB + volumedetect), per set
const RMS = { a: { w1: -18.9, w2: -17.9, w3: -15.5, w4: -17.1, w5: -15.6, chime: -17.8 },
              b: { w1: -18.6, w2: -17.8, w3: -17.0, w4: -18.5, w5: -16.5, chime: -20.5 } }[SET];
// into the voice bus: the TIMBER call sits at about -16.4 dB (voice/patch.js); praise a little under it, rising per tier
const TARGET = [0, -19, -18.5, -18, -17, -16], CHIME_TARGET = -25;
const g = db => Math.round(Math.pow(10, db / 20) * 1000) / 1000;
const VGAIN = [0].concat([1, 2, 3, 4, 5].map(n => g(TARGET[n] - RMS['w' + n])));
const NAMES = [null, 'nice', 'great', 'excellent', 'amazing', 'unbelievable'];
const b64 = f => fs.readFileSync(path.join(DIR, f)).toString('base64');
let bytes = 0; const sz = f => (bytes += fs.statSync(path.join(DIR, f)).size, b64(f));
const AUD = {}; for (let n = 1; n <= 5; n++) AUD['w' + n] = sz('audio/' + NAMES[n] + '_' + SET + '.mp3'); AUD.chime = sz('audio/combo_chime_' + SET + '.mp3');
const IMG = ['""'].concat([1, 2, 3, 4, 5].map(n => '"data:image/webp;base64,' + sz('assets/w' + n + '.webp') + '"'));

const game = fs.readFileSync(path.join(DIR, 'patch', 'combo.js'), 'utf8').replace(/\s+$/, '');
const eng = fs.readFileSync(path.join(DIR, 'patch', 'engine.js'), 'utf8').replace(/\s+$/, '');
const DATA = MARK + ') data: voice set "' + SET + '" (MP3 80 kbps mono), word sprites (WebP, Figma combo-words-v2)\n' +
  'var CMB_SET = "' + SET + '";\n' +
  'window.CMB_AUDIO = {' + Object.keys(AUD).map(k => k + ':"' + AUD[k] + '"').join(',') + '};\n' +
  'var CMB_IMG = [' + IMG.join(',') + '];\n';
const ENGINE = '    ' + MARK + ') engine constants\n' +
  '    var CMB_VGAIN = ' + JSON.stringify(VGAIN) + ', CMB_SEMI = [0, 0, 2, 4, 7, 9], CMB_CHIME_GAIN = ' + g(CHIME_TARGET - RMS.chime) + ';\n' + eng + '\n';

const EDITS = [
  { name: 'game: combo module before comboMul()',
    find: 'function comboMul(){ return 1 + Math.min(0.5, Math.max(0, combo-1)*0.05); }',
    replace: DATA + game + '\nfunction comboMul(){ return 1 + Math.min(0.5, Math.max(0, combo-1)*0.05); }' },
  { name: 'detonateAll: a BLAST starts a chain',
    find: '  phase = "boom"; boomIdx = 0; groanDone = false;\n',
    replace: '  phase = "boom"; boomIdx = 0; groanDone = false;\n  cmbVolley();   // combo v18\n' },
  { name: 'fixedStep: measure every 6 steps',
    find: '  if(stepCount % 6 === 0 && typeof v5BonusStep === "function") v5BonusStep();\n',
    replace: '  if(stepCount % 6 === 0 && typeof v5BonusStep === "function") v5BonusStep();\n  if(stepCount % 6 === 3) cmbStep();   // combo v18\n' },
  { name: 'blast: remember the cause (fuel = chain, not a hit)',
    find: '  var P = opt.noUpg ? {d:1,p:1,r:1} : powerMul();\n',
    replace: '  cmbOpt = opt;   // combo v18\n  var P = opt.noUpg ? {d:1,p:1,r:1} : powerMul();\n' },
  { name: 'blast: a member in range marks its building as hit',
    find: '    damage(b, dmg*fall*mul*b.def.dmg, !!def.pierce, "blast");\n',
    replace: '    damage(b, dmg*fall*mul*b.def.dmg, !!def.pierce, "blast");\n    cmbHit(b);   // combo v18\n' },
  { name: 'failMember: steel breaks, Ball / Sky kills',
    find: '  if(cause === "impact" && !b.keep) comboEvent();\n',
    replace: '  cmbFail(b, cause);   // combo v18\n  if(cause === "impact" && !b.keep) comboEvent();\n' },
  { name: 'waveEnd: settle = last word or none (fail-bound)',
    find: '  if(bstHold()) return;   // BOOSTERS: wait for the ball; Aftershock runs before a short attempt ends\n',
    replace: '  if(bstHold()) return;   // BOOSTERS: wait for the ball; Aftershock runs before a short attempt ends\n  cmbSettle();   // combo v18\n' },
  { name: 'SFX composite: praise lines + chime on the voice bus',
    find: '    E.setComboStyle = function () {};                // combo is v1: no-op\n',
    replace: '    E.setComboStyle = function () {};                // combo is v1: no-op\n' + ENGINE },
];
const NEED = ['/*@@SFX-BEGIN*/', 'function verdict(){', 'function stockLeft(){'];

let bad = 0; const spans = [];
if (src.includes(MARK)) { console.error('already patched (marker found): ' + IN); process.exit(1); }
for (const m of NEED) if (src.split(m).length - 1 !== 1) { console.error('base must contain exactly one ' + m); bad++; }
for (const e of EDITS) {
  const n = src.split(e.find).length - 1;
  if (n !== 1) { console.error((n ? 'DUPLICATE (' + n + ')' : 'MISSING') + ' anchor: ' + e.name); bad++; continue; }
  const at = src.indexOf(e.find); spans.push([at, at + e.find.length, e]);
}
spans.sort((a, b) => a[0] - b[0]);
for (let i = 1; i < spans.length; i++) if (spans[i][0] < spans[i - 1][1]) { console.error('OVERLAP: ' + spans[i - 1][2].name + ' / ' + spans[i][2].name); bad++; }
if (bad) { console.error(bad + ' problem(s); nothing written'); process.exit(1); }
console.log(EDITS.length + ' anchors ok on ' + path.basename(IN) + (src.includes('// ---- voice v16 (voice/patch.js') ? ' (voice v16 present: words wait for the TIMBER call)' : ' (no voice v16)'));
if (CHECK) process.exit(0);
let out = '', pos = 0;
for (const [a, b, e] of spans) { out += src.slice(pos, a) + e.replace; pos = b; }
out += src.slice(pos);
fs.writeFileSync(OUT, out);
console.log('wrote ' + OUT + ' (+' + ((out.length - src.length) / 1024).toFixed(1) + ' KB vs base; embedded files ' + (bytes / 1024).toFixed(1) + ' KB raw, set ' + SET + ')');
