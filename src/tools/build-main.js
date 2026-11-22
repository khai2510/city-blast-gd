#!/usr/bin/env node
/* City Blast! MAIN build (D-blast-ONELINK, Owner 12/11/2026): ONE build for every line. All future updates go here.
 *   node games/blast/tools/build-main.js [out.html]        default out: checkpoints/index-main.html
 *     env FEEL_DEFAULT=off   the same build with feel Q1-Q9 off by default (A/B twin for the bots; ?feel=... still wins)
 *     env KEEP=<dir>         keep every intermediate file (NN-step.html) in <dir>
 *     --list                 print the steps and exit
 * Every step is one existing patcher / source script, run as its own process on the previous step's output. Nothing is copied
 * from an old checkpoint except the root base (checkpoints/index-v9-v30.html, read only). Re-run after ANY patch or level
 * source changes: the whole chain is rebuilt (about 5 s). A step whose anchors no longer match stops the build (exit 1) and
 * the old index-main.html stays. Order, reasons, conflicts and "how to add a patch": games/blast/MAIN-BUILD.md.
 * Never writes games/blast/index.html (the Lead publishes). */
'use strict';
const fs = require('fs'), os = require('os'), path = require('path'), cp = require('child_process'), crypto = require('crypto');
const DIR = path.join(__dirname, '..'), G = (...p) => path.join(DIR, ...p);
const BASE = G('checkpoints', 'index-v9-v30.html');
// step = { id, what, run: [script, ...args] with $IN / $OUT / $TMP, env, src: files hashed into the build stamp, marks: text the output must carry }
const STEPS = [
  { id: 'levels-json', what: 'L1-12 level data (levels6/tools/src-l1-12.js) -> a temp levels-v6.json', nohtml: true,
    run: ['levels6/tools/build-levels.js', BASE, '$TMP/levels-v6.json'], src: ['levels6/tools/src-l1-12.js', 'levels6/tools/build-levels.js'] },
  { id: 'levels6-v10', what: 'levels6 engine: massive buildings, TNT only, multi-wave rule (no wave limit), PASS 85 / protected 5% / street 10%, type roofs, determinism',
    run: ['levels6/patch.js', '$IN', '$OUT'], env: { LEVELS6_JSON: '$TMP/levels-v6.json' }, src: ['levels6/patch.js', 'levels6/patch/v10.js'], marks: ['// ---- levels6 v10 builders', 'var L6_MAXW = 99;'] },
  { id: 'materials-fx', what: 'every material reacts to TNT its own way', run: ['materials-fx/patch.js', '$IN', '$OUT'], src: ['materials-fx/patch.js', 'materials-fx/patch/matfx.js'], marks: ['// ---- materials-fx v11'] },
  { id: 'v31', what: 'BLAST! label only, text cut, steel throw', run: ['v31/patch.js', '$IN', '$OUT'], src: ['v31/patch.js', 'v31/patch/v31.js'], marks: ['// ---- v31 (v31/patch.js'] },
  { id: 'uiclean', what: 'UI clean-up: Home, HUD, type system, settings row, district themes in play', run: ['uiclean/patch.js', '$IN', '$OUT'], src: ['uiclean/patch.js', 'uiclean/patch/uiclean.css', 'uiclean/patch/uiclean.js'], marks: ['// ---- uiclean v14 (uiclean/patch.js'] },
  { id: 'boosters2', what: 'boosters: Wrecking Ball / Safety Net / Sky Strike, boss-win unlock schedule', run: ['boosters2/patch.js', '$IN', '$OUT'], src: ['boosters2/patch.js', 'boosters2/patch/boosters2.js', 'boosters2/patch/sky.js', 'boosters2/patch/boosters2.css'], marks: ['// ---- boosters2 v15 (boosters2/patch.js'] },
  { id: 'metrics', what: 'play-time metrics panel (?metrics=1, 5 taps on the Home logo)', run: ['metrics/patch.js', '$IN', '$OUT'], src: ['metrics/patch.js', 'metrics/patch/metrics.js'], marks: ['// ---- metrics v13 (metrics/patch.js'] },
  { id: 'voice', what: 'the recorded TIMBER! shout', run: ['voice/patch.js', '$IN', '$OUT'], src: ['voice/patch.js', 'voice/timber-call.mp3'], marks: ['// ---- voice v16 (voice/patch.js'] },
  { id: 'haptics2', what: 'haptics v2: facade, Vibration switch (Settings + Pause)', run: ['haptics2/patch.js', '$IN', '$OUT'], src: ['haptics2/patch.js', 'haptics2/haptics2.js', 'haptics2/glue.js'], marks: ['// ---- haptics2 (haptics2/patch.js'] },
  { id: 'combo', what: 'combo praise (in the file; off unless ?combo=1, see glue-ui)', run: ['combo/patch.js', '$IN', '$OUT'], src: ['combo/patch.js', 'combo/patch/combo.js', 'combo/patch/engine.js'], marks: ['// ---- combo v18 (combo/patch.js'] },
  { id: 'glue-ui', what: 'main-link state of 11/11: combo off by default, TIMBER! caption shown', run: ['main/glue.js', 'ui', '$IN', '$OUT'], src: ['main/glue.js'], marks: ['<!-- main/glue.js ui -->'] },
  { id: 'home-nomile', what: 'Home without the district line; Map bubble + crane LEVEL sign open the map', run: ['uiclean/home-nomile.js', '$IN', '$OUT'], src: ['uiclean/home-nomile.js', 'uiclean/assets/home-plate-nomile.png'], marks: ['/* ---- uiclean home-nomile */'] },
  { id: 'levels6-l13-36', what: 'L13-36 level data + hero kits and dresses (v11, v12)', run: ['levels6/tools/src-l13-36.js', '$IN', '$OUT'], src: ['levels6/tools/src-l13-36.js', 'levels6/patch/v11.js', 'levels6/patch/v12.js'], marks: ['// ---- levels6 v11', '// ---- levels6 v12'] },
  { id: 'feel', what: 'game feel Q1-Q8 (on by default) + Q9 living Home', run: ['levels6/tools/src-feel.js', '$IN', '$OUT'], env: { FEEL_EXTRA: G('ui-feel', 'q9.js'), FEEL_DEFAULT: process.env.FEEL_DEFAULT === 'off' ? 'off' : 'on' },
    src: ['levels6/tools/src-feel.js', 'levels6/patch/v13-feel.js', 'ui-feel/q9.js'], marks: ['// ---- levels6 v13 FEEL', '// ---- ui-feel Q9'] },
  { id: 'l32-monument', what: 'L32 monument (RC hero), vertical pan / zoom camera, BODY_CAP 1e9 + the LV level picker (?lv=N)', run: ['levels6/tools/src-l32.js', '$IN', '$OUT'], env: { M14_OPEN: '0' },
    src: ['levels6/tools/src-l32.js', 'levels6/patch/v14-monument.js', 'tools/lvpick-overlay.html'], marks: ['// ---- levels6 v14 MONUMENT', 'id="lvBtn"'] },
  { id: 'a1-levels', what: 'batch A1 (D-blast-ROLLOUT): L1-L5 remade on the L32 standard (monumental ladder-material heroes, tip rule, aids by tier); L6-36 untouched', run: ['levels6/tools/src-a1.js', '$IN', '$OUT'], env: { A1_OPEN: '0' },
    src: ['levels6/tools/src-a1.js', 'levels6/patch/v15-a1.js'], marks: ['// ---- levels6 v15 A1', '// ---- end levels6 v15 A1'] },
  { id: 'base', what: 'per-building base type (D-blast-MATCURVE): ladder neighbours fall from one pier, L1 hero from one, L2-5 heroes from two on one side; ?base=0 = off', run: ['levels6/tools/src-base.js', '$IN', '$OUT'],
    src: ['levels6/tools/src-base.js', 'levels6/patch/v15-base.js'], marks: ['// ---- levels6 v15 BASE', '// ---- end levels6 v15 BASE'] },
  { id: 'glue-final', what: 'conflict fixes between the two lines (MAIN-BUILD.md §4)', run: ['main/glue.js', 'final', '$IN', '$OUT'], src: ['main/glue.js'], marks: ['<!-- main/glue.js final -->'] },
  { id: 'glue-ui-fixes', what: 'colour rules: boss = orange everywhere, meter fill orange / gold, no red price (screens 13 / 11 / 03)', run: ['main/glue.js', 'fixes', '$IN', '$OUT'], src: ['main/glue.js'], marks: ['<!-- main/glue.js fixes -->'] },
  { id: 'glue-intro', what: 'booster / obstacle intro (D-blast-INTRO-BTF): Lv.N tray slots, Unlocked card + Claim x2 (free), forced first use, New card, L1 hand only', run: ['main/glue.js', 'intro', '$IN', '$OUT'], src: ['main/glue.js', 'main/intro.js'], marks: ['<!-- main/glue.js intro -->', '// ---- main/intro.js'] },
  { id: 'audio-el', what: 'ElevenLabs audio (D-blast-AUDIO-EL): menu / play music loops, city ambience, random one-shots, unlock / new / hard / win / lose stings; ?bgm=0 = old procedural, ?bgm=2 = other take', run: ['main/glue.js', 'audio', '$IN', '$OUT'],
    src: ['main/glue.js', 'main/audio-el.js'].concat(['menu', 'amb', 'play', 'horn', 'beep', 'birds', 'crane', 'pigeon', 'unlock', 'new', 'win', 'hard', 'lose'].map(k => 'audio/el/' + k + '.mp3')), marks: ['<!-- main/glue.js audio -->', '// ---- main/audio-el.js'] },
  { id: 'occlude', what: 'placed charges obey view occlusion: depth tested, drawn on the shell the tap saw, hidden behind buildings (render only); ?occl=0 = old always-on-top', run: ['main/occlude-patch.js', '$IN', '$OUT'], src: ['main/occlude-patch.js', 'main/occlude.js'], marks: ['<!-- main/occlude.js -->', '// ---- main/occlude.js'] },
  { id: 'perf', what: 'perf pass (D-blast-PERF): prebuild only while idle in planning, pixel ratio cap 2 + shadow 1024, camera clearance ease, shadow pass on the chamfer box, shadow every 2nd frame in a collapse, member LOD by on-screen bevel', run: ['main/perf-patch.js', '$IN', '$OUT'], src: ['main/perf-patch.js', 'main/perf.js'], marks: ['<!-- main/perf.js -->', '// ---- main/perf.js'] },
  { id: 'frame', what: 'hero opening framing (Owner 15/11 "camera too far"): at level start the hero fills ~72% of the playable height or 68% of the width, centred between HUD and tray, 3/4 view, 1 s ease-in (ease-out cubic, none with Reduce motion); BLAST / pinch-out hand back to the whole lot; ?frame=0 = old opening', run: ['main/frame-patch.js', '$IN', '$OUT'], src: ['main/frame-patch.js', 'main/frame.js'], marks: ['<!-- main/frame.js -->', '// ---- main/frame.js'] },
  { id: 'look', what: 'visual polish vs Car Sort (H2H-DESIGN F1/F2/F5/F6/F7/F10): calm world (old green lawn, ?lkgrass=1 = sage + haze; sand contrast, graded skyline), collapse framed on hero + debris, gloss + contact AO on concrete / brick, softer higher sun, white rim on charged members + TNT, glossy Upgrades icons; ?look=0 = old look', run: ['main/look-patch.js', '$IN', '$OUT'], src: ['main/look-patch.js', 'main/look.js', 'design/home-elements/e7e8-coin.png'], marks: ['<!-- main/look.js -->', '// ---- main/look.js'] },
  { id: 'ui2', what: 'UI2 cleanliness pass vs Smash Fest: HUD <= 5 items, level pill = meter cap, dev button only ?dev=1, one type system, win confetti strengthened, lose / pre-level / settings / Upgrades restyled; ?ui2=0 = old UI', run: ['main/ui2-patch.js', '$IN', '$OUT'], src: ['main/ui2-patch.js', 'main/ui2.js', 'design/home-elements/e1-plate-864x1536.png', 'design/home-elements/e2-hero.png', 'design/home-elements/e6v2-shop.png', 'design/home-elements/e6v2-home.png', 'design/home-elements/e6v2-upgrades.png', 'design/home-elements/e7v2-gear.png'], marks: ['<!-- main/ui2.js -->', '// ---- main/ui2.js'] },
  { id: 'tap2', what: 'controls + rule cleanups (D-blast-TAP2/TAPEXACT/STACKOK/THRESH-2/NOLOT/COIN/ADOPT): exact tap, no removal, stacking allowed (?nostack=1 = old), double tap = TNT + BLAST, no BLAST on L1, L1/L2 hand, no street rule, no lot, coins 10/20/30, coming-soon hidden; ?tap2=0 = old', run: ['main/tap2-patch.js', '$IN', '$OUT'], src: ['main/tap2-patch.js', 'main/tap2.js'], marks: ['<!-- main/tap2.js -->', '// ---- main/tap2.js'] },
  { id: 'prelevel', what: 'pre-level booster offer (D-blast-ADOPT): Hard / Boss popup, 3 tiles (count / + / locked Lv.N), 1 use per pick at level start, teach hand; ?pre=0 = old picker', run: ['main/prelevel-patch.js', '$IN', '$OUT'], src: ['main/prelevel-patch.js', 'main/prelevel.js', 'design/intro-premium/art-wreck.webp', 'design/intro-premium/art-net.webp', 'design/intro-premium/art-sky.webp'], marks: ['<!-- main/prelevel.js -->', '// ---- main/prelevel.js'] },
  { id: 'studio', what: 'HitMaker Studio card first on a cold start (Owner 15/11): navy from the top of <head>, logo card first in <body>, leaves at max(1.2 s shown, game ready + 0.3 s), 20 s cap, tap only once ready, no sound, same picture as the iOS launch screen; ?studio=0 = none', run: ['main/studio-patch.js', '$IN', '$OUT'], src: ['main/studio-patch.js', 'main/studio.js', require('../main/studio-patch.js').LOGO_PNG], marks: ['<!-- main/studio.js -->', '// ---- main/studio.js'] },
  { id: 'shop', what: 'Shop / Upgrades / No Ads (D-blast-SHOP): Shop screen (coin packs, bundles, Starter, No Ads, Restore), Upgrades ~3,400 curve + Coin Bonus on the win reward + Booster Pocket, No Ads Home button L15+, ads facade (rewarded x2 / +1 TNT, interstitial rules), Fail Offer; real money hidden until IAP_READY, ?iapdev=1 / ?adsdev=1 simulate; ?shop2=0 = old', run: ['main/shop-patch.js', '$IN', '$OUT'],
    src: ['main/shop-patch.js', 'main/shop.js'].concat(['pile-s', 'pile-m', 'pile-l', 'pile-xl', 'coin', 'check', 'clock'].map(k => 'design/shop/assets/' + k + '.svg')), marks: ['<!-- main/shop.js -->', '// ---- main/shop.js'] },
  { id: 'polish', what: 'H2H polish (Smash Fest UX/UI + Car Sort F4, 15/11): in-level coin pill = bank, win payoff (+N under the stamp then to the pill, camera centres the rubble, Home count-up), New: cards tap-anywhere, 2nd empty tap re-shows the hand, Pause = Settings rows, two-line Play buttons, lose "need 85%", L1 label + 400 ms, 48 pt targets, locked chips hidden, muted idle BLAST; ?polish=0 = off', run: ['main/polish-patch.js', '$IN', '$OUT'], src: ['main/polish-patch.js', 'main/polish.js'], marks: ['<!-- main/polish.js -->', '// ---- main/polish.js'] },
  // ---- Agents-Game (city-blast/OWNERS.md): the hard levels from Mac, LAST (the g7 engine wraps the final build's functions; city-blast/release/INTEGRATE.md §3)
  { id: 'g7-hard', what: 'hard levels H1-H5 (Mac, city-blast/release/): g7 engine (bombs ride their block, no red ring) + level data as pipeline7/build.mjs test=false; play order (21/11, GD-48) 1-9 old L1-9, 10 H2, 11-15 L10-14, 16 H3, 17-19 L15-17, 20 H1, 21-29 L18-26, 30 H4, 31-35 L27-31, 36 H5, 37-41 L32-36 (saves of the 20/11 order follow their levels); number-keyed features follow their old level (LV7O); ?lv7=0 = old 36 levels, ?lv7ord=0 = H after L36, ?pack7=1 = first hard level', run: ['g7hard/patch.js', '$IN', '$OUT'],
    src: ['g7hard/patch.js', 'g7hard/order-early.js', 'g7hard/order-end.js', '../city-blast/pipeline7/engine.js', '../city-blast/release/g7-hard-levels.json'], marks: ['// ---- main/levels7.js', '// ---- main/levels7-data.js', '// ---- g7hard/order-early.js', '// ---- g7hard/order-end.js'] },
  // ---- Agents-Game (Khai 22/11: test the Gemini art vs the current look): view only, OFF unless ?art=1 (GEM_ART_DEFAULT=on = test-link build); before rs-look
  { id: 'gem-art', what: 'Gemini art TEST (src/gemart): UI kit skin (buttons, toggles, meter, panels, ribbon, round buttons), icons (TNT, boosters, lock, coin), material textures B01-B06, C01 backdrop band; off by default, ?art=1 = on', run: ['gemart/patch.js', '$IN', '$OUT'],
    src: ['gemart/patch.js', 'gemart/gemart.css', 'gemart/gemart.js', 'gemart/gemart-engine.js', 'gemart/gemart-engine2.js', 'gemart/assets/assets.json'].concat(Object.keys(require('../gemart/assets/assets.json')).map(n => 'gemart/assets/' + n + '.webp')), marks: ['<!-- gemart -->', '// ---- end gemart engine part 1', '// ---- end gemart engine part 2'] },
  // ---- Agents-Game (Khai 22/11: the 18/11 "SF-style corners" demo into main, ON by default): in-level layout + planning camera; after g7-hard and gem-art, before rs-look
  { id: 'sflay', what: 'SF-style corners layout (Khai 22/11, demo 18/11): TNT card top-left, gear top-right, level label + post-BLAST meter top-centre, Ball / Net / Sky Strike round buttons in the bottom corners (padlock + wiggle while locked), BLAST centred between them, front-on planning camera (hard / boss openings keep main\'s); ?sflay=0 = old layout', run: ['main/sflay-patch.js', '$IN', '$OUT'],
    src: ['main/sflay-patch.js', 'main/sflay.js'], marks: ['<!-- main/sflay.js -->', '// ---- main/sflay.js', '// ---- end main/sflay.js'] },
  // ---- Mac (Khai 22/11: "chạy design polish cho game, theo royal smash, h2h compared"): visual-only layer, LAST; city-blast/rs-look/README.md
  { id: 'rs-look', what: 'H2H Royal Smash visual layer (Mac): BLAST shine sweep + TNT count bump (deck, locked discs, gloss and lot tint removed per Khai 22/11); view only, ?rs=0 = off', run: ['../city-blast/rs-look/patch.js', '$IN', '$OUT'],
    src: ['../city-blast/rs-look/patch.js', '../city-blast/rs-look/rs.css', '../city-blast/rs-look/rs.js', '../city-blast/rs-look/rs-main.js'], marks: ['<!-- rs-look -->', '// ---- rs-look (Mac', '// ---- rs-look in main()'] },
];
if (process.argv.includes('--list')) { STEPS.forEach((s, i) => console.log(String(i + 1).padStart(2) + '. ' + s.id.padEnd(15) + s.what)); process.exit(0); }
const OUT = path.resolve(process.argv[2] || G('checkpoints', 'index-main.html'));
if (path.basename(OUT) === 'index.html') { console.error('refusing to write an index.html (the Lead publishes)'); process.exit(2); }
const TMP = process.env.KEEP ? path.resolve(process.env.KEEP) : fs.mkdtempSync(path.join(os.tmpdir(), 'blast-main-'));
fs.mkdirSync(TMP, { recursive: true });
const sub = (s) => String(s).replace('$TMP', TMP);
const sha = (f) => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex').slice(0, 10);
const stamp = [['base', path.basename(BASE), sha(BASE)]];
let cur = BASE, n = 0, failed = null;
for (const s of STEPS) {
  n++;
  const out = path.join(TMP, String(n).padStart(2, '0') + '-' + s.id + '.html');
  const argv = s.run.map((a, i) => i === 0 ? G(a) : a === '$IN' ? cur : a === '$OUT' ? out : sub(a));
  const env = Object.assign({}, process.env); delete env.LAB; delete env.L12LAB; delete env.FEEL_EXTRA; delete env.LEVELS6_JSON; delete env.COMBO_SET;
  Object.keys(s.env || {}).forEach(k => { env[k] = sub(s.env[k]); });
  const r = cp.spawnSync(process.execPath, argv, { env, encoding: 'utf8', maxBuffer: 1 << 26 });
  const log = ((r.stdout || '') + (r.stderr || '')).trim().split('\n');
  if (r.status !== 0) { console.error('FAIL ' + n + '. ' + s.id + '\n  ' + log.filter(l => !/^ok /.test(l)).slice(-12).join('\n  ')); failed = s.id; break; }
  if (!s.nohtml) {
    const html = fs.readFileSync(out, 'utf8'), miss = (s.marks || []).filter(m => !html.includes(m));
    if (miss.length) { console.error('FAIL ' + n + '. ' + s.id + ': the output does not carry ' + JSON.stringify(miss)); failed = s.id; break; }
    cur = out;
  }
  s.src.forEach(f => stamp.push([s.id, f, sha(G(f))]));
  console.log('ok  ' + String(n).padStart(2) + '. ' + s.id.padEnd(15) + log[log.length - 1].replace(TMP + path.sep, '').slice(0, 110));
}
if (failed) { console.error('\nbuild-main: stopped at "' + failed + '"; ' + path.relative(process.cwd(), OUT) + ' was not touched. See MAIN-BUILD.md §5.'); process.exit(1); }
let html = fs.readFileSync(cur, 'utf8');
// build stamp: which sources made this file (no date: the same sources give the same bytes)
const srcHash = crypto.createHash('sha256').update(stamp.map(x => x.join(' ')).join('\n')).digest('hex').slice(0, 12);
const note = '<!-- City Blast! MAIN build (tools/build-main.js, D-blast-ONELINK) sources ' + srcHash + (process.env.FEEL_DEFAULT === 'off' ? ' FEEL_DEFAULT=off' : '') + '\n' +
  stamp.map(x => '  ' + x[0].padEnd(15) + x[2] + '  ' + x[1]).join('\n') + '\n-->\n';
const t = html.indexOf('<!doctype'), t2 = t >= 0 ? html.indexOf('>', t) + 1 : -1;
html = t2 > 0 ? html.slice(0, t2) + '\n' + note + html.slice(t2).replace(/^\n/, '') : note + html;
if (html.split('\nwindow.__blast = {').length !== 2) { console.error('build stamp: "window.__blast = {" not found exactly once'); process.exit(1); }
html = html.replace('\nwindow.__blast = {', '\nwindow.__blastBuild = { id:"main", sources:"' + srcHash + '" };\nwindow.__blast = {');
fs.writeFileSync(OUT, html);
if (!process.env.KEEP) fs.rmSync(TMP, { recursive: true, force: true });
console.log('\nwrote ' + path.relative(process.cwd(), OUT) + '  ' + (html.length / 1048576).toFixed(2) + ' MB (' + fs.statSync(OUT).size + ' bytes), ' + STEPS.length + ' steps, sources ' + srcHash);
