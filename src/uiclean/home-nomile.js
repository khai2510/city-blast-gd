#!/usr/bin/env node
/* City Blast! Home without the district milestone line (Owner 11/11/2026). UI only.
 *   node uiclean/home-nomile.js <in.html> <out.html>
 * 1. swaps the Home plate (uilayout home-plate data URI) for uiclean/assets/home-plate-nomile.png (baked "Downtown 8/12"
 *    bar inpainted with uiclean/tools/home_plate_clean.py), WebP q82 like uilayout/tools/embed.py (encoded with python3/PIL)
 * 2. hides #hMile; 3. City Map entry: a round gold-rim "Map" bubble under No Ads + the crane "LEVEL N" sign, both forward
 *    to #hMile's click (ulMap). Tab bar untouched. Anchors must be found exactly once, else exit 1 and nothing is written. */
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process');
const [IN, OUT] = process.argv.slice(2), MARK = '/* ---- uiclean home-nomile */';
if (!IN || !OUT) { console.error('usage: node uiclean/home-nomile.js <in.html> <out.html>'); process.exit(2); }
if (path.resolve(OUT) === path.resolve(__dirname, '..', 'index.html')) { console.error('refusing to write games/blast/index.html'); process.exit(2); }
let src = fs.readFileSync(IN, 'utf8');
if (src.includes(MARK)) { console.error('already patched'); process.exit(1); }
const old = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'uilayout', 'patch', 'ul-assets.json'), 'utf8'))['home-plate'];
const neu = 'data:image/webp;base64,' + cp.execFileSync('python3', ['-c',
  'import io,sys,base64;from PIL import Image;b=io.BytesIO();Image.open(sys.argv[1]).save(b,"WEBP",quality=82,method=6);sys.stdout.write(base64.b64encode(b.getvalue()).decode())',
  path.join(__dirname, 'assets', 'home-plate-nomile.png')], { maxBuffer: 1 << 26 }).toString();
const css = MARK + `
html body #ulPlate #hMile,html body #ulPlate #hMile.hidden{display:none!important}
html body #ulPlate #uicMapB{left:711px;top:463px;cursor:pointer;translate:calc(-1 * var(--ul-e,0px)) var(--ul-dyr,0px)}
html body #ulPlate #uicMapB i{left:16px;right:16px;top:12px;bottom:26px}
html body #ulPlate #ulSign{cursor:pointer;pointer-events:auto}
`;
const js = `<script>${MARK}(function(){try{
  var m=document.getElementById("hMile"),n=document.getElementById("ulNoAds"),s=document.getElementById("ulSign"),t=document.querySelector("#toMap .ic");
  if(!m||!n)return; var b=document.createElement("button"); b.id="uicMapB"; b.className="ulBub"; b.type="button"; b.setAttribute("aria-label","Open the city map");
  b.innerHTML="<i></i><b>Map</b>"; n.parentNode.insertBefore(b,n.nextSibling);
  if(t)b.firstChild.style.backgroundImage=getComputedStyle(t).backgroundImage;
  var go=function(e){e.preventDefault();e.stopPropagation();m.click();}; b.addEventListener("click",go); if(s){s.addEventListener("click",go);s.setAttribute("role","button");}
}catch(e){console.error("home-nomile",e)}})();</script>
`;
const edits = [[old, neu], ['</style>\n<script>(function(){function u(){', css + '</style>\n<script>(function(){function u(){'], ['</body>', js + '</body>']];
for (const [f] of edits) { const k = src.split(f).length - 1; if (k !== 1) { console.error((k ? 'DUPLICATE ' : 'MISSING ') + 'anchor: ' + f.slice(0, 50)); process.exit(1); } }
for (const [f, r] of edits) src = src.replace(f, () => r);
fs.writeFileSync(OUT, src); console.log('wrote ' + OUT);
