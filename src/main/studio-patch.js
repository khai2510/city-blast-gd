#!/usr/bin/env node
/* City Blast! MAIN build step "studio" (after prelevel): the HitMaker Studio card shown first on a cold start (Owner 15/11/2026).
 * Two insertions, each on a text anchor found exactly once (else exit 1, nothing written); a marker so it cannot apply twice:
 *   1. right after <meta name="viewport"> (the top of <head>, ~1 MB before <body>; after it so the iOS bridge + boot gate,
 *      which native/tools/build-www.js puts right after the viewport meta, still run first): html + body painted in the card's navy
 *      while the rest of <head> downloads / parses -> no white or sky flash before the card (class html.hmS, removed when
 *      the card goes; ?studio=0 never sets it).
 *   2. right after <body>: the card's CSS, the card (the logo PNG as a data URI) and main/studio.js (timing, tap, leave). Before every
 *      game script, so it is painted first.
 *      Logo (D-blast-TF6, Owner 18/11/2026: "logo studio v2 chưa ổn, giữ logo cũ"): DEFAULT = the TestFlight 5 / v53 card,
 *      design/studio/hitmaker-lockup-stacked@3x.png with the v53 fade + scale-in (560 ms). Opt-in at BUILD time:
 *      STUDIO_LOGO=v3 node tools/build-main.js = design/studio/v3/hitmaker-v3-lockup-stacked@3x.png ('Candy H', 3D) with its drop + bounce.
 *      The iOS launch screen must use the same logo: native/tools/make-studio-launch.js reads LOGO_SVG from this file.
 * The background (BG) and the logo box (60% of the screen width, max 300 px, centred on the full screen) are the same as
 * the iOS launch screen (native/tools/make-studio-launch.js reads BG from this file), so launch -> card is one picture.
 *   node main/studio-patch.js <in.html> <out.html>
 * Never writes games/blast/index.html. ?studio=0 at runtime = no card. Spec: design/studio/SPEC.md. */
'use strict';
const fs = require('fs'), path = require('path');
const BG = 'radial-gradient(120% 70% at 50% 46%, #26386A 0%, #18243D 55%, #111A30 100%)';
const BASE = '#111A30';
const V3 = process.env.STUDIO_LOGO === 'v3';   // D-blast-TF6: v53 logo by default
const LOGO_PNG = V3 ? 'design/studio/v3/hitmaker-v3-lockup-stacked@3x.png' : 'design/studio/hitmaker-lockup-stacked@3x.png';
const LOGO_SVG = V3 ? 'design/studio/v3/hitmaker-v3-lockup-stacked.svg' : 'design/studio/hitmaker-lockup-stacked.svg';
module.exports = { BG, BASE, LOGO_PNG, LOGO_SVG };
if (require.main !== module) return;
const [IN, OUT] = process.argv.slice(2);
if (!IN || !OUT) { console.error('usage: node main/studio-patch.js <in.html> <out.html>'); process.exit(2); }
if (path.resolve(OUT) === path.resolve(__dirname, '..', 'index.html')) { console.error('refusing to write games/blast/index.html'); process.exit(2); }
const src = fs.readFileSync(IN, 'utf8'), MARK = '<!-- main/studio.js -->';
if (src.includes(MARK)) { console.error('already patched (studio): ' + IN); process.exit(1); }
const once = (re, what) => { const m = src.match(new RegExp(re.source, 'g')) || []; if (m.length !== 1) { console.error((m.length ? 'DUPLICATE (' + m.length + ')' : 'MISSING') + ' anchor ' + what); process.exit(1); } return src.match(re); };
const meta = once(/<meta\s+name=["']viewport["'][^>]*>/i, '<meta name=viewport>'), body = once(/<body>/, '<body>');
const logo = 'data:image/png;base64,' + fs.readFileSync(path.join(__dirname, '..', LOGO_PNG)).toString('base64');
const js = fs.readFileSync(path.join(__dirname, 'studio.js'), 'utf8').replace(/\s+$/, '');
const pre = MARK + '<style id="hmStudioPre">html.hmS,html.hmS body{background:' + BASE + '!important}</style>' +
  '<script>if(!/[?&]studio=0(&|$)/.test(location.search))document.documentElement.classList.add("hmS");</script>';
const css = '<style id="hmStudioCss">' +
  '#hmStudio{position:fixed;left:0;top:0;right:0;bottom:0;z-index:2147483000;background:' + BASE + ';background-image:' + BG + ';' +
  'display:flex;align-items:center;justify-content:center;touch-action:none;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;' +
  'transition:opacity 320ms ease-in}' +
  '#hmStudio img{display:block;width:min(60vw,300px);height:auto;pointer-events:none;-webkit-user-drag:none}' +
  (V3 ? '#hmStudio.anim img{transform-origin:50% 62%;animation:hmStudioIn 820ms linear 40ms both}' +
  '#hmStudio.out{opacity:0}' +
  /* v3: the logo drops in and bounces twice (web only; the native launch -> card hand-off stays still) */ '@keyframes hmStudioIn{0%{opacity:0;transform:translateY(-36px) scale(.97);animation-timing-function:cubic-bezier(.5,0,.9,.5)}' +
  '16%{opacity:1}40%{transform:translateY(0) scale(1.035,.955);animation-timing-function:cubic-bezier(.2,.6,.4,1)}' +
  '58%{transform:translateY(-10px) scale(.99,1.015);animation-timing-function:cubic-bezier(.5,0,.9,.5)}74%{transform:translateY(0) scale(1.012,.988);animation-timing-function:cubic-bezier(.2,.6,.4,1)}' +
  '87%{transform:translateY(-2.5px)}100%{opacity:1;transform:none}}'
  : /* v53 (TestFlight 5) */ '#hmStudio.anim img{animation:hmStudioIn 560ms cubic-bezier(.2,.8,.25,1) 60ms both}' +
  '#hmStudio.out{opacity:0}' +
  '@keyframes hmStudioIn{0%{opacity:0;transform:scale(.9)}100%{opacity:1;transform:scale(1)}}') +
  '</style>';
const card = '<div id="hmStudio" role="img" aria-label="HitMaker Studio"><img id="hmStudioLogo" alt="" src="' + logo + '"></div>';
let out = src.replace(meta[0], () => meta[0] + '\n' + pre);
out = out.replace('<body>', () => '<body>\n' + css + card + '<script>\n' + js + '\n</script>');
fs.writeFileSync(OUT, out);
console.log('ok   logo ' + (V3 ? 'v3 (STUDIO_LOGO=v3)' : 'v53') + ' · S1 navy from the top of <head> · S2 studio card first in <body> (logo ' + Math.round(logo.length / 1024) + ' KB) · S3 leaves at max(1.2 s shown, game ready) · ?studio=0  -> ' + path.basename(OUT));
