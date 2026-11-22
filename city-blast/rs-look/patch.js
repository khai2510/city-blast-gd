#!/usr/bin/env node
/* City Blast! MAIN build step "rs-look" (Mac, 22/11/2026, Khai: "chạy design polish cho game, theo royal smash, h2h compared, làm nhiều round").
 * Visual-only layer, appended LAST: rs-look/rs.css before </head>, rs-look/rs.js before </body>. Touches no rule, level, member,
 * charge, save key or text; only looks (CSS) and a few view-only DOM nodes. ?rs=0 = off (the build without this step).
 *   node city-blast/rs-look/patch.js <in.html> <out.html>      Notes / rounds / h2h shots: city-blast/rs-look/README.md */
'use strict';
const fs = require('fs'), path = require('path');
const [IN, OUT] = process.argv.slice(2);
if (!IN || !OUT) { console.error('usage: node rs-look/patch.js <in.html> <out.html>'); process.exit(2); }
if (path.basename(OUT) === 'index.html') { console.error('refusing to write an index.html'); process.exit(2); }
let src = fs.readFileSync(IN, 'utf8');
const MARK = '<!-- rs-look -->';
if (src.includes(MARK)) { console.error('already patched (rs-look): ' + IN); process.exit(1); }
for (const a of ['</head>', '</body>']) { const n = src.split(a).length - 1; if (n !== 1) { console.error((n ? 'DUPLICATE (' + n + ')' : 'MISSING') + ' anchor ' + a); process.exit(1); } }
for (const need of ['id="bottom"', 'id="bbar"', 'id="blast"', 'id="chips"', 'id="vig"', 'id="top"', 'id="result"', 'window.__blast = {'])
  if (!src.includes(need)) { console.error('MISSING UI text: ' + need); process.exit(1); }
const css = fs.readFileSync(path.join(__dirname, 'rs.css'), 'utf8').trim(), js = fs.readFileSync(path.join(__dirname, 'rs.js'), 'utf8').trim();
src = src.replace('</head>', () => MARK + '\n<style id="rsCss">\n' + css + '\n</style>\n</head>');
const A = '\n} // main\n', na = src.split(A).length - 1;
if (na !== 1) { console.error((na ? 'DUPLICATE (' + na + ')' : 'MISSING') + ' anchor "} // main"'); process.exit(1); }
if (!/\nvar lot = new THREE\.Mesh\(/.test(src)) { console.error('MISSING engine text: var lot = new THREE.Mesh('); process.exit(1); }
const mjs = fs.readFileSync(path.join(__dirname, 'rs-main.js'), 'utf8').replace(/\s+$/, '');
src = src.replace(A, () => '\n' + mjs + A);
src = src.replace('</body>', () => '<script id="rsJs">\n' + js + '\n</script>\n</body>');
fs.writeFileSync(OUT, src);
console.log('ok   rs-look (H2H Royal Smash visual layer, ?rs=0 = off) -> ' + path.basename(OUT));
