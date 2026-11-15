#!/usr/bin/env node
/* City Blast! materials-fx v11 (Owner 10/11/2026): every material reacts to TNT in its own way, visually and physically.
 *   node materials-fx/patch.js <in.html> [out.html]     (no out = patch in place)
 *   node materials-fx/patch.js --check <in.html>         (report anchors only, write nothing)
 * Base: checkpoints/index-v9-v30.html. Output: checkpoints/index-v11-matfx.html. Never games/blast/index.html.
 * Also applies on checkpoints/index-v10-levels6.html (--check), so it can be stacked after levels6.
 * Rules (as juice/patch.js, levels6/patch.js): text anchors only, each found exactly once, no overlapping edits, the
 * file must not already carry the marker; otherwise exit 1 and nothing is written. Block: patch/matfx.js.
 * Flag: ?mfx=0 = the old fragments, throw and sounds (A/B); the code stays in.
 */
'use strict';
const fs = require('fs'), path = require('path');
const DIR = __dirname, MARK = '// ---- materials-fx v11';
const args = process.argv.slice(2), CHECK = args[0] === '--check'; if (CHECK) args.shift();
const IN = args[0], OUT = args[1] || args[0];
if (!IN) { console.error('usage: node materials-fx/patch.js [--check] <in.html> [out.html]'); process.exit(2); }
if (path.resolve(OUT) === path.resolve(DIR, '..', 'index.html')) { console.error('refusing to write games/blast/index.html'); process.exit(2); }
const src = fs.readFileSync(IN, 'utf8');
const block = fs.readFileSync(path.join(DIR, 'patch', 'matfx.js'), 'utf8').replace(/\s+$/, '');
const EDITS = [
  { name: 'block: MATFX table, crumbs, pieces, steel kink, test scene (after the juice presets)',
    find: 'function jWave(){ JU.waveFlash = true;', replace: block + '\nfunction jWave(){ JU.waveFlash = true;' },
  { name: 'level start: the seed of the fragment hash',
    find: '  levelIdx = li;\n  var c = null;', replace: '  levelIdx = li; MFX.seed = seed != null ? seed : 1000 + li*7919;   // materials-fx\n  var c = null;' },
  { name: 'render: a kinked steel member is drawn as two halves',
    find: 'function writeMatrix(b, yOff){\n', replace: 'function writeMatrix(b, yOff){\n  if(b.bent && mfxWriteBent(b)) return;   // materials-fx\n' },
  { name: 'new level instances: crumbs and kinks cleared',
    find: 'function buildInstances(){\n  keepTops = null;', replace: 'function buildInstances(){\n  mfxReset();   // materials-fx\n  keepTops = null;' },
  { name: 'pick: a kinked member can still be tapped',
    find: 'Object.keys(inst).forEach(function(k){ if(k!=="base" && k!=="kbase" && k!=="crate") meshes.push(inst[k].mesh); });\n  var hits = ray.intersectObjects(meshes, false);',
    replace: 'Object.keys(inst).forEach(function(k){ if(k!=="base" && k!=="kbase" && k!=="crate") meshes.push(inst[k].mesh); });\n  if(MB.mesh.visible) meshes.push(MB.mesh);   // materials-fx\n  var hits = ray.intersectObjects(meshes, false);' },
  { name: 'blast impulse: throw per material on free bodies',
    find: '  var J = I0*f*area;', replace: '  var J = I0*f*area*mfxThrow(o);   // materials-fx: fragments and unbonded members only' },
  { name: 'blast: remember the origin (debris flies away from it)',
    find: '  shearDone = false; clangDone = false;\n  probe.blasts.push(', replace: '  shearDone = false; clangDone = false; mfxBlastAt(origin);\n  probe.blasts.push(' },
  { name: 'blast: the smoke takes the colour of the material it hit (same dust() call, same rnd() count)',
    find: '  fxFlash(origin, R); fxRing(origin, R); dust(origin, 7, 1.4*R); jBoom(origin, R, def, scale);',
    replace: '  fxFlash(origin, R); fxRing(origin, R); dust(origin, 7, 1.4*R, mfxBoomTint(origin, R)); jBoom(origin, R, def, scale);' },
  { name: 'blast: glass inside the shock radius shatters',
    find: '    if(dist > R) continue;\n    var fall = Math.pow(',
    replace: '    if(dist > R){ if(mfxShock(b, dist, R, def)) failMember(b, "blast"); continue; }   // materials-fx\n    var fall = Math.pow(' },
  { name: 'blast: steel that survives kinks and sparks',
    find: '    if(isMetal(b) && !b.dead && !def.pierce && !clangDone',
    replace: '    mfxBlastHit(b, origin, fall*mul);   // materials-fx\n    if(isMetal(b) && !b.dead && !def.pierce && !clangDone' },
  { name: 'break sound per material',
    find: '    else matSnd(isBeam(b) ? "beam_snap" : "concrete_crack", b);', replace: '    else mfxBreakSnd(b);   // materials-fx' },
  { name: 'fragments: pieces by material',
    find: 'function fragment(b, cause){\n', replace: 'function fragment(b, cause){\n  if(MFX_ON) return mfxFragment(b, cause);   // materials-fx (below = the old tiling, ?mfx=0)\n' },
  { name: 'budget eviction of a resting piece wakes what rests on it (no hovering rubble)',
    find: '  if(f.rb){ world.removeRigidBody(f.rb); f.rb = null; }\n  if(fade && fragFree.length > 4)',
    replace: '  if(f.rb){ if(MFX_ON && fade) wakeAround(f, 0.3); world.removeRigidBody(f.rb); f.rb = null; }   // materials-fx\n  if(fade && fragFree.length > 4)' },
  { name: 'member impact: steel kinks and sparks',
    find: '  audImpact(b, dv);\n  if(dv > b.def.shatter)', replace: '  audImpact(b, dv); mfxImpact(b, dv);\n  if(dv > b.def.shatter)' },
  { name: 'fragment impact: masonry crumbles, steel sparks',
    find: 'if(fd2 > 16) audImpact(o, Math.sqrt(fd2));', replace: 'if(fd2 > 16){ audImpact(o, Math.sqrt(fd2)); if(MFX_ON) mfxFragHit(o, fd2); }' },
  { name: 'fixed step: crumble queue, debris against glass',
    find: '  checkBonds(); bstStep();   // BOOSTERS', replace: '  mfxFixed(); checkBonds(); bstStep();   // BOOSTERS' },
  { name: 'frame loop: crumbs',
    find: '  PX.step(rdt, rawDt*1000);\n}', replace: '  PX.step(rdt, rawDt*1000); mfxFrame(rdt);\n}' },
  { name: 'impact sound family per material',
    find: 'function matOf(key){ var md = MEMBERS[key];', replace: 'function matOf(key){ var mk = mfxSndMat(key); if(mk) return mk; var md = MEMBERS[key];' },
  { name: 'harness: window.__blast.matfx',
    find: 'window.__blast.boost = BST_API;', replace: 'window.__blast.boost = BST_API;\nwindow.__blast.matfx = MFX_API;' }
];
let fail = 0; const spans = [];
if (src.includes(MARK)) { console.error('already patched (marker found): ' + IN); process.exit(1); }
for (const e of EDITS) {
  const n = src.split(e.find).length - 1;
  if (n !== 1) { console.error((n ? 'DUPLICATE (' + n + ')' : 'MISSING') + ' anchor: ' + e.name); fail++; continue; }
  const at = src.indexOf(e.find); spans.push([at, at + e.find.length, e]);
}
spans.sort((a, b) => a[0] - b[0]);
for (let i = 1; i < spans.length; i++) if (spans[i][0] < spans[i - 1][1]) { console.error('OVERLAP: ' + spans[i - 1][2].name + ' / ' + spans[i][2].name); fail++; }
if (fail) { console.error(fail + ' anchor problem(s); nothing written'); process.exit(1); }
console.log(EDITS.length + ' anchors ok on ' + path.basename(IN));
if (CHECK) process.exit(0);
let out = '', pos = 0;
for (const [a, b, e] of spans) { out += src.slice(pos, a) + e.replace; pos = b; }
out += src.slice(pos);
fs.writeFileSync(OUT, out);
console.log('wrote ' + OUT + ' (' + (out.length - src.length >= 0 ? '+' : '') + ((out.length - src.length)/1024).toFixed(1) + ' KB)');
