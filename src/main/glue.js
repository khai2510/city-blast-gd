#!/usr/bin/env node
/* City Blast! MAIN build glue (D-blast-ONELINK, 12/11/2026): the few edits that belong to no feature patch. They make the UI line
 * (v31 ... combo, Home) and the levels6 line (v10-v14, feel) work in ONE file. Run by tools/build-main.js; see MAIN-BUILD.md §4.
 *   node main/glue.js <stage> <in.html> <out.html>        stage = ui (after combo, before the levels6 add-ons) | final | fixes (colour rules) | intro (very last: main/intro.js)
 *   node main/glue.js --check <stage> <in.html>
 * Rules (as every patcher here): text anchors only, each found exactly once, no overlapping edits; otherwise exit 1 and nothing is
 * written. Never writes games/blast/index.html. A new conflict between two patches = a new entry here, with its reason. */
'use strict';
const fs = require('fs'), path = require('path');
const args = process.argv.slice(2), CHECK = args[0] === '--check'; if (CHECK) args.shift();
const [STAGE, IN, OUT] = args;
const STAGES = {
  ui: [
    // C1: materials-fx (UI line) changes how DEBRIS moves: the piece plan per material, throw, contact, kick, glass panes that leave
    // no rigid piece, crumbling masonry, glass broken by flying debris, a wake-up when a resting piece is evicted. Every levels6 level
    // (L1-36, the L32 RC hero) was gated on the engine WITHOUT it: with it the expert plan loses L4 (92% -> 67%) and L32 (90% -> 84%),
    // and 20+ levels move by up to 9 points. In MAIN the LOOK and SOUND of materials-fx stay on (crumbs, dust, chips, glints, sparks,
    // smoke tint, steel kink, break / impact sounds per material); the rigid pieces and their physics are the ones the levels were
    // gated on, so every level plays exactly as in the levels6 build (same pose hash). ?mfxphys=1 = the materials-fx debris physics.
    { name: 'C1 materials-fx: debris physics off by default; ?mfxphys=1 = on, ?mfxoff=... still wins',
      find: 'var MFX_OFF = (function(){ var o = {}; (QS.get("mfxoff") || "").split(",")',
      replace: 'var MFX_PHYS = QS.get("mfxphys") === "1", MFX_OFF_MAIN = "split,throw,contact,kick,glass,debris,crumble,shock";   // main/glue.js C1\n' +
        '// the material\'s own break look (crumbs, dust, chips, glints, sparks) on the old rigid pieces\n' +
        'function mfxLook(b, cause, v){ if(!MFX_ON) return; var C = mfxOf(b); MFX.st[C.name]++; mfxBreakFx(b, C, cause, v); }\n' +
        'var MFX_OFF = (function(){ var o = {}; (QS.get("mfxoff") != null ? QS.get("mfxoff") : MFX_PHYS ? "" : MFX_OFF_MAIN).split(",")' },
    { name: 'C1 materials-fx: the per-material piece plan only with ?mfxphys=1',
      find: '  if(MFX_ON) return mfxFragment(b, cause);   // materials-fx (below = the old tiling, ?mfx=0)\n',
      replace: '  if(MFX_ON && MFX_PHYS) return mfxFragment(b, cause);   // materials-fx; main/glue.js C1: below = the tiling the levels were gated on\n' },
    { name: 'C1 materials-fx: its break look on the old pieces',
      find: '    if(cause !== "impact"){ dust(b.P, 2, 1.4); removeBlockBody(b); writeMatrix(b); return; }\n    b.rubble = true; return;\n  }\n  var key = b.key, col = key==="slab" ? L.palette : MEMBERS[key].color;\n',
      replace: '    if(cause !== "impact"){ dust(b.P, 2, 1.4); mfxLook(b, cause, v); removeBlockBody(b); writeMatrix(b); return; }\n    b.rubble = true; return;\n  }\n  mfxLook(b, cause, v);   // main/glue.js C1\n  var key = b.key, col = key==="slab" ? L.palette : MEMBERS[key].color;\n' },
    { name: 'C1 materials-fx: the wake-up round an evicted piece only with ?mfxphys=1',
      find: '  if(f.rb){ if(MFX_ON && fade) wakeAround(f, 0.3); world.removeRigidBody(f.rb); f.rb = null; }   // materials-fx\n',
      replace: '  if(f.rb){ if(MFX_ON && MFX_PHYS && fade) wakeAround(f, 0.3); world.removeRigidBody(f.rb); f.rb = null; }   // materials-fx; main/glue.js C1\n' },
    // ---- the state of the main link on 11/11 (index-v32b-demo.html, two hand edits that had no script)
    { name: 'combo praise off unless ?combo=1 (Owner 11/11, v32b)',
      find: 'function cmbRelease(atSettle){', replace: 'function cmbRelease(atSettle){ if(!/[?&]combo=1/.test(location.search)) return;   // main/glue.js' },
    { name: 'the "TIMBER!" caption passes uiclean\'s in-level pop-text block (Owner 11/11, v32b)',
      find: 'var _pop = popText; popText = function(){ if(screen === "game") return; return _pop.apply(this, arguments); };',
      replace: 'var _pop = popText; popText = function(t){ if(screen === "game" && String(t).indexOf("TIMBER") < 0) return; return _pop.apply(this, arguments); };   // main/glue.js' },
  ],
  // ---- last step, after levels6/tools/src-l32.js
  final: [
    // C8 (18/11, feedback/2026-11-18/l32-swap/REPORT.md §1, Owner on device: "L32 shows two levels"): the base starts its render loop with
    // a plain `animate();` INSIDE main(), before every later patch runs. The first frame's pbTick() prebuilds the Home level from the
    // UNPATCHED LEVELS[save.level], and Play adopts that prebuild (warm -> pbSwap): after a relaunch with save.level = 31 the first L32 was
    // the old one (TNT 10, no RC hero), L36 kept the lot pad tap2 removes. The first frame now waits for the next animation frame, when
    // main() (every patch included) has finished; animate() re-arms itself as before.
    { name: 'C8 first frame after every patch (no prebuild from unpatched level data)',
      find: '\nwarmUp();\nanimate();\n',
      replace: '\nwarmUp();\nrequestAnimationFrame(function(){ animate(); });   // main/glue.js C8: after main() and every patch (stale prebuild of LEVELS[n])\n' },
    // C3: uiclean hides the zoom hint in play ("no zoom hint", S3); the L32 monument (v14) uses that same pill to teach its new camera
    // ("Drag up / down to look ..."). Both kept: no hint on ordinary levels (uiclean), and on a monument level (L.mon) the pill shows
    // once at the start, in uiclean's bubble style, cut to <= 6 words (v31 text rule). Appended last in main(), so nothing in
    // v14-monument.js is anchored on (that file is still being tuned).
    { name: 'C3 camera hint on monument levels only (uiclean hides it elsewhere), short text',
      find: '\n} // main\n',
      replace: '\n// ---- main/glue.js C3: the camera hint on monument levels (uiclean: no zoom hint on the others)\n' +
        'try{ (function(){\n' +
        '  var st = document.createElement("style"); st.textContent = "html body.m14Hint:not(.ulMenu) #zhint:not(.hidden){display:block!important}"; document.head.appendChild(st);\n' +
        '  var mon = function(){ return !!(L && L.mon && screen === "game"); };\n' +
        '  var zh1 = zHint; zHint = function(on){ var r = zh1.apply(this, arguments); document.body.classList.toggle("m14Hint", mon());\n' +
        '    if(on && mon()) $("zhint").textContent = matchMedia("(pointer:coarse)").matches ? "Drag up / down. Pinch to zoom." : "Drag up / down. Scroll to zoom."; return r; };\n' +
        '  var sl1 = startLevel; startLevel = function(){ var r = sl1.apply(this, arguments); document.body.classList.toggle("m14Hint", mon()); return r; };\n' +
        '})(); }catch(e){ console.error("main glue C3", e); }\n} // main\n' },
    // C5: tools/lvpick-overlay.html puts a yellow 48 px LV button bottom-left: on top of the new UI's Shop tab (Home), next to BLAST!
    // (play). The overlay file is shared with the level builds, so it is restyled here: the owner opens the plain claude.ai artifact
    // link (cannot add ?dev=1), so the DEFAULT is the bright, clearly labelled yellow "Level" button (58x36), top-left under the
    // avatar / pause button, off the tab bar, BLAST! and the tray. ?dev=0 hides it (screenshots, store captures). ?lv=N works either way.
    { name: 'C5 LV level picker: bright yellow "Level" button by default, off the tab bar and the tray; ?dev=0 hidden',
      find: '<button id="lvBtn" aria-label="Chọn màn">LV</button>',
      replace: '<style>/* main/glue.js C5: LV = level picker, bright by default */\n' +
        '#lvBtn#lvBtn{left:calc(6px + env(safe-area-inset-left));top:calc(98px + env(safe-area-inset-top));bottom:auto;min-width:58px;width:58px;height:36px;padding:0;border-radius:10px;border:2px solid #1d2a4a;' +
        'background:#FFB400;color:#1d2a4a;font:800 14px/32px system-ui,sans-serif;letter-spacing:.3px;box-shadow:0 2px 0 #1d2a4a}\n' +
        '#lvBtn#lvBtn::after{content:"";position:absolute;inset:-6px -6px}\n' +
        'html.dev0 #lvBtn#lvBtn{display:none}\n</style>\n' +
        '<script>(function(){var d=new URLSearchParams(location.search).get("dev");if(d==="0")document.documentElement.classList.add("dev0");})();</script>\n' +
        '<button id="lvBtn" aria-label="Level picker">Level</button>' },
  ],
  // ---- after glue-final: UI colour rules from the screen review (research/h2h-design/SCREENS-H2H-SF-2026-11-13.md, screens 13 / 11 / 03).
  // Owned by the main build only (no edit in v14 / v15 / src-a1). Rules: orange = boss everywhere; meter fill orange below PASS and gold
  // at / above PASS (play and result card); no threatening red on the Upgrades prices.
  fixes: [
    { name: 'F1 boss intro banner says "Boss!" and wears the boss class (orange, not purple)',
      find: 'var hb = $("hardBan"); hb.classList.remove("on");',
      replace: 'var hb = $("hardBan"); hb.textContent = L.boss ? "\\u26A0 Boss! \\u26A0" : "\\u26A0 Hard! \\u26A0"; hb.classList.toggle("boss", !!L.boss); hb.classList.remove("on");   // main/glue.js F1\n' },
    { name: 'F1 pre-level card gets the boss class (orange header and "Boss!" line)',
      find: '$("bPick").classList.toggle("hard", hd);',
      replace: '$("bPick").classList.toggle("hard", hd); $("bPick").classList.toggle("boss", !!Lv.boss);   // main/glue.js F1\n' },
    { name: 'F1-F3 CSS: boss accents orange, meter fill orange / gold, Upgrades price in ink',
      find: '<div id="hardVig"></div>',
      replace: '<style>/* main/glue.js fixes (F1 boss = orange, F2 meter fill, F3 no red price) */\n' +
        '/* F1: boss = orange everywhere; Hard stays purple */\n' +
        'html body #hardBan.boss{background:linear-gradient(180deg,rgba(253,112,42,0),rgba(253,112,42,.94) 22%,rgba(253,112,42,.94) 78%,rgba(253,112,42,0));-webkit-text-stroke:8px #7A3200;text-shadow:0 3px 0 #7A3200;color:#FFE27A}\n' +
        'body.uicBoss #hardVig{background:radial-gradient(ellipse 75% 60% at 50% 45%,rgba(253,112,42,0) 60%,rgba(253,112,42,.28) 100%)}\n' +
        'body.hardlv.uicBoss #top #lvPill{border-color:#7A3200;background:linear-gradient(#FFB640,#FB8C18 60%)}\n' +
        'body.hardlv.uicBoss #top #meter{box-shadow:0 0 0 calc(6 * var(--us)) #FD702A,0 calc(9 * var(--us)) 0 calc(6 * var(--us)) rgba(122,50,0,.3)!important}\n' +
        'body.hardlv.uicBoss #mTag{border-color:#FD702A;color:#C8410A} body.hardlv.uicBoss #mTag::after{border-top-color:#FD702A}\n' +
        'body.hardlv.uicBoss #tip{box-shadow:0 0 0 calc(5 * var(--us)) #FD702A,0 calc(8 * var(--us)) 0 calc(5 * var(--us)) rgba(122,50,0,.28)}\n' +
        'html body #bPick.boss .bhead{background:#FD702A}\n' +
        'html body #bPick.boss #bpHard{color:#C8410A}\n' +
        '/* F2: meter fill orange below PASS, gold at / above PASS, in play and on the result card (was green on the card) */\n' +
        'html body #result #rmFill{background:linear-gradient(#FF9A55,#FD702A 55%,#F05A18);box-shadow:inset 0 4px 0 rgba(255,255,255,.3)}\n' +
        'html body #result #rmFill.go{background:linear-gradient(#FFE27A,#FFB400)}\n' +
        '/* F3: unaffordable price in ink, never red */\n' +
        'html body .cant .price,html body .cant small,html body .up button.cant .price{color:var(--ink)!important}\n' +
        '</style>\n<div id="hardVig"></div>' },
  ],
  // ---- very last (after fixes): the booster / obstacle introduction layer (D-blast-INTRO-BTF, Bus Fever pattern). The code lives in
  // main/intro.js (one block, appended at the end of main() so it wraps the final startLevel / show / bstSync / b2Grant).
  // Nothing in v14 / v15 / src-a1 is anchored on. Level data is read at runtime (blocks, L.street, lotpad, volatile barrels).
  intro: [
    { name: 'I1 booster / obstacle intro layer (main/intro.js): tray with Lv.N slots, Unlocked card + Free x2, forced first use, New card',
      find: '\n} // main\n',
      replace: '\n' + fs.readFileSync(path.join(__dirname, 'intro.js'), 'utf8').replace(/\s+$/, '') + '\n} // main\n' },
  ],
  // ---- after intro: ElevenLabs audio (D-blast-AUDIO-EL). main/audio-el.js wraps window.SFX (music / ambience / one-shots / stings);
  // the base64 set comes from audio/el/*.mp3 (tools/prep-audio-el.py). Alternates (-alt, amb-alt) stay files, not embedded.
  audio: [
    { name: 'A1 ElevenLabs audio layer (main/audio-el.js) + embedded base64 set',
      find: '\n} // main\n',
      replace: (function(){
        const B = path.join(__dirname, '..', 'audio', 'el'), D = {};
        ['menu', 'amb', 'play', 'horn', 'beep', 'birds', 'crane', 'pigeon', 'unlock', 'new', 'win', 'hard', 'lose'].forEach(k => { D[k] = fs.readFileSync(path.join(B, k + '.mp3')).toString('base64'); });
        return '\n' + fs.readFileSync(path.join(__dirname, 'audio-el.js'), 'utf8').replace(/\s+$/, '').split('/*@@EL_AUDIO@@*/null').join(JSON.stringify(D)) + '\n} // main\n';
      })() },
  ],
};
if (!STAGES[STAGE] || !IN || (!CHECK && !OUT)) { console.error('usage: node main/glue.js [--check] <ui|final|fixes|intro|audio> <in.html> <out.html>'); process.exit(2); }
if (OUT && path.resolve(OUT) === path.resolve(__dirname, '..', 'index.html')) { console.error('refusing to write games/blast/index.html'); process.exit(2); }
const src = fs.readFileSync(IN, 'utf8'), MARK = '<!-- main/glue.js ' + STAGE + ' -->';
if (src.includes(MARK)) { console.error('already patched (' + STAGE + '): ' + IN); process.exit(1); }
let bad = 0; const spans = [];
for (const e of STAGES[STAGE]) {
  const n = src.split(e.find).length - 1;
  if (n !== 1) { console.error((n ? 'DUPLICATE (' + n + ')' : 'MISSING') + ' anchor: ' + e.name); bad++; continue; }
  const at = src.indexOf(e.find); spans.push([at, at + e.find.length, e]); console.log('ok   ' + e.name);
}
spans.sort((a, b) => a[0] - b[0]);
for (let i = 1; i < spans.length; i++) if (spans[i][0] < spans[i - 1][1]) { console.error('OVERLAP: ' + spans[i - 1][2].name + ' / ' + spans[i][2].name); bad++; }
const t = src.indexOf('<title>'); if (t < 0) { console.error('no <title>'); bad++; }
if (bad) { console.error(bad + ' problem(s); nothing written'); process.exit(1); }
console.log(STAGES[STAGE].length + ' anchors ok on ' + path.basename(IN) + ' (glue ' + STAGE + ')');
if (CHECK) process.exit(0);
spans.push([t, t, { replace: MARK }]); spans.sort((a, b) => a[0] - b[0]);
let out = '', pos = 0;
for (const [a, b, e] of spans) { out += src.slice(pos, a) + e.replace; pos = b; }
fs.writeFileSync(OUT, out + src.slice(pos));
console.log('wrote ' + OUT);
