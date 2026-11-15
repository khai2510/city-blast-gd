#!/usr/bin/env node
/* City Blast! haptics v2, step 1 (HAPTICS-V2.md §4.2): facade + game hooks, JS only.
 *   node haptics2/patch.js <in.html> <out.html>
 *   node haptics2/patch.js --check <in.html> [out.html]     (report anchors only, write nothing)
 * Base: checkpoints/index-v16b-ui-h2h.html -> checkpoints/index-v17-haptics.html. Stacks on the round-5 levels build too:
 * every anchor is engine / UI code (placeCharge, startCountdown, audBoom, audPancake, matSnd, setMeter, updateLiveHUD,
 * waveEnd, ballPower, skyStrike, skyImpact, bstTapBtn, showResult, flyBonus, rescue, Settings / Pause markup), never level data.
 * Rules (as v31/patch.js): text anchors only, each found exactly once, no overlapping edits, the base must carry the
 * v31 marker and not this one; otherwise exit 1 and nothing is written. Never writes games/blast/index.html.
 * Adds: haptics2/haptics2.js as its own <script> (after three.js), haptics2/glue.js after snd(), a Settings "Vibration"
 * row + the same switch in Pause, window.__blast.haptics (log of every fired hit: time, event, level).
 * Fixes (HAPTICS-V2.md §0): H1 vibration independent of mute + Vibration switch · H2 priorities, gap, focus windows ·
 * H3 gentle lose (L, or L·L for a rule) · H4 Hard banner = hard_intro (M·L), not the protected warning ·
 * H5 unlock card = one pattern (SFX.haptic is inert: the facade owns navigator.vibrate) · H6 Ball / Sky have their own
 * impact events · H7 booster buttons fire booster_arm.
 * native/src/native-bridge.js is NOT changed: on iOS the facade calls @capacitor/haptics itself ("simple" route); the
 * bridge's navigator.vibrate is only used if the Haptics plugin object is missing ("bridge" route: pulse lengths
 * 10 / 24 / 45 ms land in its LIGHT / MEDIUM / HEAVY bands), and stays the fallback if the facade does not load.
 */
'use strict';
const fs = require('fs'), path = require('path');
const DIR = __dirname, MARK = '// ---- haptics2 (haptics2/patch.js';
const NEED = ['// ---- v31 (v31/patch.js'];
const args = process.argv.slice(2), CHECK = args[0] === '--check'; if (CHECK) args.shift();
const IN = args[0], OUT = args[1];
if (!IN || (!CHECK && !OUT)) { console.error('usage: node haptics2/patch.js [--check] <in.html> <out.html>'); process.exit(2); }
if (OUT && path.resolve(OUT) === path.resolve(DIR, '..', 'index.html')) { console.error('refusing to write games/blast/index.html'); process.exit(2); }
if (OUT && path.basename(OUT) === 'index.html') { console.error('refusing to write an index.html'); process.exit(2); }
const src = fs.readFileSync(IN, 'utf8');
const facade = fs.readFileSync(path.join(DIR, 'haptics2.js'), 'utf8').replace(/\s+$/, '');
const glue = fs.readFileSync(path.join(DIR, 'glue.js'), 'utf8').replace(/\s+$/, '');
const VIB_ROW = '\n    <button class="pillbtn tog" id="vibTog" type="button" aria-label="Vibration on/off"></button>';
const PM_ROW = '\n    <button class="pmRow" id="pmVib" type="button" role="switch" aria-checked="true"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="3" width="10" height="18" rx="2.5" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M3.5 8v8M20.5 8v8" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg><span>Vibration</span><i class="sw"></i></button>';
const EDITS = [
  // ---- facade, glue, debug API
  { name: 'facade <script> after three.js', find: 'three.min.js"></script>',
    replace: 'three.min.js"></script>\n<script>/* haptics2 facade (haptics2/haptics2.js) */\n' + facade + '\n</script>' },
  { name: 'snd(): generic sound -> haptic mapping + glue block',
    find: 'function snd(name, p){ return window.SFX ? SFX.play(name, p) : null; }',
    replace: 'function snd(name, p){ hg("snd", name, p); return window.SFX ? SFX.play(name, p) : null; }\n' + glue },
  { name: 'harness: window.__blast.haptics', find: 'window.__blast.matfx = MFX_API;',
    replace: 'window.__blast.matfx = MFX_API;\nwindow.__blast.haptics = window.HG2 ? HG2.dbg : null;' },
  // ---- Settings / Pause: Vibration switch
  { name: 'Settings: Vibration row (after Music)', find: '<use href="#i-music-on"/></svg> Music</button>',
    replace: '<use href="#i-music-on"/></svg> Music</button>' + VIB_ROW },
  { name: 'Pause: Vibration row (after Reduce motion)', find: '<span>Reduce motion</span><i class="sw"></i></button>',
    replace: '<span>Reduce motion</span><i class="sw"></i></button>' + PM_ROW },
  // ---- 2.1 UI
  { name: 'play_tap: Home level button', find: '$("play").addEventListener("click", function(){ audioInit(); snd("ui_tap");',
    replace: '$("play").addEventListener("click", function(){ audioInit(); hg("play", "play_tap"); snd("ui_tap");' },
  { name: 'level start: reset + hard_intro (H4)', find: 'hb.classList.add("on"); snd("protected_hit", { gain:0.5 }); }',
    replace: 'hb.classList.add("on"); hg("play", "hard_intro"); snd("protected_hit", { gain:0.5 }); }' },
  { name: 'level start: per-level haptic state', find: 'phase = "build"; buildT = 0;',
    replace: 'phase = "build"; buildT = 0; hg("level");' },
  // ---- 2.2 plan
  { name: 'placeCharge: place / stack / stack3',
    find: '  snd("place_" + CK[c.key], { index:charges.length - 1, pan:sndPan(pos) });\n  if(pulseShields(pos, R)) toast(',
    replace: '  hg("place", c);\n  snd("place_" + CK[c.key], { index:charges.length - 1, pan:sndPan(pos) });\n  if(pulseShields(pos, R) && (hg("near"), true)) toast(' },
  { name: 'booster_arm (H7)', find: 'snd("select_charge"); snd("ui_tap");\n  if(k !== "sky") skyDisarm();',
    replace: 'hg("play", "booster_arm"); snd("select_charge"); snd("ui_tap");\n  if(k !== "sky") skyDisarm();' },
  { name: 'wave_ready', find: 'snd("dust_tail", { intensity:0.6 }); musicMood("plan");',
    replace: 'hg("play", "wave_ready"); snd("dust_tail", { intensity:0.6 }); musicMood("plan");' },
  // ---- 2.3 countdown, booms
  { name: 'auto_fuse', find: 'snd("horn", { count:1, long:false, distance:0.35 }); snd("fuse", { duration:AUTO_FUSE, intensity:0.7 });',
    replace: 'hg("play", "auto_fuse", { stretch:AUTO_FUSE }); snd("horn", { count:1, long:false, distance:0.35 }); snd("fuse", { duration:AUTO_FUSE, intensity:0.7 });' },
  { name: 'blast_press', find: 'snd("blast_press"); snd("fuse", { duration:0.5, intensity:0.7 });',
    replace: 'hg("play", "blast_press"); snd("blast_press"); snd("fuse", { duration:0.5, intensity:0.7 });' },
  { name: 'fireNow during the auto fuse: drop the rest of auto_fuse', find: 'if(autoCount) snd("blast_press");',
    replace: 'if(autoCount){ hg("cancel", "auto_fuse"); snd("blast_press"); }' },
  { name: 'cancelAuto: drop the rest of auto_fuse', find: 'cdId++; autoCount = false; phase = "plan";',
    replace: 'cdId++; autoCount = false; phase = "plan"; hg("cancel", "auto_fuse");' },
  { name: 'detonateAll: wave start (stack groups)', find: 'waveN = wv.length; jWave();',
    replace: 'waveN = wv.length; jWave(); hg("wave", wv);' },
  { name: 'audBoom: first / stack / follow',
    find: 'var i = boomIdx++, first = i === 0, kind = def.kind === "shaped" ? "cutter" : def.kind === "cluster" ? "cluster" : "tnt";',
    replace: 'var i = boomIdx++, first = i === 0, kind = def.kind === "shaped" ? "cutter" : def.kind === "cluster" ? "cluster" : "tnt";\n  hg("boom", i, origin);' },
  // ---- 2.4 collapse, materials (before the SFX checks: mute / no audio context does not stop them)
  { name: 'timber', find: 'snd("timber", { duration:slowDur(), auto:false });',
    replace: 'hg("timber", slowDur()); snd("timber", { duration:slowDur(), auto:false });' },
  { name: 'timber_catch', find: 'if(slowLeft <= 0){ timeScale = 1; $("vig").classList.remove("on"); }',
    replace: 'if(slowLeft <= 0){ timeScale = 1; $("vig").classList.remove("on"); hg("play", "timber_catch"); }' },
  { name: 'audPancake', find: 'function audPancake(b){\n  if(!window.SFX || !SFX.ctx) return;',
    replace: 'function audPancake(b){\n  hg("pancake", b);\n  if(!window.SFX || !SFX.ctx) return;' },
  { name: 'audImpact: heavy impacts by material', find: 'if(dv < IMP_DV || !window.SFX || !SFX.ctx) return;',
    replace: 'if(dv < IMP_DV) return; hg("impact", o, dv); if(!window.SFX || !SFX.ctx) return;' },
  { name: 'matSnd: material break', find: 'function matSnd(name, b, p){\n  if(!window.SFX || !SFX.ctx) return;',
    replace: 'function matSnd(name, b, p){\n  hg("mat", name);\n  if(!window.SFX || !SFX.ctx) return;' },
  // ---- 2.5 level rules
  { name: 'setMeter: pass_cross', find: 'clearedShown = true; popText("CLEARED!", "clr"); snd("star", { index:2 });',
    replace: 'clearedShown = true; hg("pass"); popText("CLEARED!", "clr"); snd("star", { index:2 });' },
  { name: 'updateLiveHUD: protected_warn / street_warn', find: 'liveBad = !!((L.keep && cl > km*0.5) || (L.street && sh > L.street.max*0.6));',
    replace: 'liveBad = !!((L.keep && cl > km*0.5) || (L.street && sh > L.street.max*0.6)); hg("live", !!(L.keep && cl > km*0.5), !!(L.street && sh > L.street.max*0.6));' },
  // ---- 2.6 boosters (H6: own events, not boom_cutter)
  { name: 'ball_swing', find: 'snd("ball_swing", { duration:Math.min(2, T + 0.1), intensity:0.9, pan:sndPan(pl.pt) });',
    replace: 'hg("play", "ball_swing"); snd("ball_swing", { duration:Math.min(2, T + 0.1), intensity:0.9, pan:sndPan(pl.pt) });' },
  { name: 'ballPower: ball_impact', find: 'var F = BPOW.fx;',
    replace: 'var F = BPOW.fx; hg("play", clang ? "ball_impact_steel" : "ball_impact");' },
  { name: 'skyStrike: sky_marker (was SFX.haptic("booster_arm"), no route)', find: 'if(window.SFX && SFX.haptic) SFX.haptic("booster_arm", 1);',
    replace: 'hg("play", "sky_marker");' },
  { name: 'skyImpact: sky_impact', find: 'w.hit = true; w.hitT = gameT;',
    replace: 'w.hit = true; w.hitT = gameT; hg("play", "sky_impact");' },
  // ---- 2.7 result, meta
  { name: 'showResult: win / lose / lose_rule (H3)', find: 'if(r.ok) snd("win"); else snd("fail", {',
    replace: 'hg("result", r); if(r.ok) snd("win"); else snd("fail", {' },
  { name: 'flyBonus: coin ticks', find: 'bumpPill(); if(done % 2 === 1 || done === n) snd("coin", { index:done });',
    replace: 'bumpPill(); hg("coin", done, n); if(done % 2 === 1 || done === n) snd("coin", { index:done });' },
  { name: 'rescue', find: 'snd("upgrade"); musicMood("plan");', replace: 'hg("play", "rescue"); snd("upgrade"); musicMood("plan");' },
];
let bad = 0; const spans = [];
if (src.includes(MARK)) { console.error('already patched (marker found): ' + IN); process.exit(1); }
for (const m of NEED) if (!src.includes(m)) { console.error('base is missing ' + m + ' (needs the v31 stack)'); bad++; }
for (const e of EDITS) {
  const n = src.split(e.find).length - 1;
  if (n !== 1) { console.error((n ? 'DUPLICATE (' + n + ')' : 'MISSING') + ' anchor: ' + e.name); bad++; continue; }
  const at = src.indexOf(e.find); spans.push([at, at + e.find.length, e]);
}
spans.sort((a, b) => a[0] - b[0]);
for (let i = 1; i < spans.length; i++) if (spans[i][0] < spans[i - 1][1]) { console.error('OVERLAP: ' + spans[i - 1][2].name + ' / ' + spans[i][2].name); bad++; }
if (bad) { console.error(bad + ' problem(s); nothing written'); process.exit(1); }
console.log(EDITS.length + ' anchors ok on ' + path.basename(IN));
if (CHECK) process.exit(0);
let out = '', pos = 0;
for (const [a, b, e] of spans) { out += src.slice(pos, a) + e.replace; pos = b; }
out += src.slice(pos);
if (!out.includes(MARK)) { console.error('internal: marker missing in output'); process.exit(1); }
fs.writeFileSync(OUT, out);
console.log('wrote ' + OUT + ' (' + ((out.length - src.length) / 1024).toFixed(1) + ' KB vs base)');
