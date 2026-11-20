// node debug.mjs B8 : build one blueprint, play the fair player with 40 TNT, list what is left
import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { BLUEPRINTS } from './blueprints.mjs';
import { generate4b as generate3 } from './gen.mjs';
import { buildHtml } from './build.mjs';
import { launch, open } from './cdp.mjs';
const bp = BLUEPRINTS.find(b => b.id === process.argv[2]);
const ALL = process.argv[3] === 'all', html = buildHtml(ALL ? BLUEPRINTS.map(b => generate3(b, { tnt: 40 })) : [generate3(bp, { tnt: 40 })], true);
const srv = createServer((q, s) => { s.writeHead(200, { 'content-type': 'text/html' }); s.end(html); }).listen(8796);
const { proc, port } = await launch(9339); const pg = await open(port, 'http://127.0.0.1:8796/');
for(let i = 0; i < 60; i++){ await new Promise(r => setTimeout(r, 500)); try{ if(await pg.evaluate('!!(window.__blast && __blast.lv7 && __blast.lv7.info)')) break; }catch(e){} }
await new Promise(r => setTimeout(r, 2500));
await pg.evaluate(readFileSync(new URL('./tester.js', import.meta.url), 'utf8'));
const idx = await pg.evaluate('__blast.lv7.base') + (ALL ? BLUEPRINTS.indexOf(bp) : 0);
if(process.argv[4] === 'pre'){ await pg.evaluate(`JSON.stringify(P7.metrics(${idx}))`); await pg.evaluate(`JSON.stringify(P7.oneBomb(${idx}, 18))`); await pg.evaluate(`JSON.stringify(P7.lazy(${idx}))`); }
if(process.argv[4] === 'warm') for(let k = 0; k < BLUEPRINTS.indexOf(bp); k++) await pg.evaluate(`P7.fair(${idx - BLUEPRINTS.indexOf(bp) + k}, 40, 1).then(JSON.stringify)`);
console.log('cam', await pg.evaluate(`(()=>{ __blast.test.play(${idx},1); __blast.test.run(6); return JSON.stringify({z:__blast.zoom(), yaw:__blast.state().yaw, st:__blast.state().screen, p:__blast.state().phase}); })()`));
console.log(await pg.evaluate(`P7.fair(${idx}, 40, 1).then(JSON.stringify)`));
console.log('miss', await pg.evaluate('JSON.stringify((window.P7miss||[]).slice(-12))'));
console.log('tap', await pg.evaluate(`(()=>{ const cv=document.querySelector('canvas'); const r=[]; for(const [x,y] of [[256,332],[255,410]]){ const p0=__blast.state().placed; for(const t of ['pointerdown','pointerup']) cv.dispatchEvent(new PointerEvent(t,{clientX:x,clientY:y,bubbles:true,pointerId:1,isPrimary:true,pointerType:'touch'})); const p1=__blast.state().placed; cv.dispatchEvent(new MouseEvent('click',{clientX:x,clientY:y,bubbles:true})); r.push({p:[p0,p1,__blast.state().placed], toast:document.getElementById('toast').textContent, on:document.getElementById('toast').className, ph:__blast.state().phase, cnt:document.querySelectorAll('canvas').length}); } return JSON.stringify(r); })()`));
console.log('probe', await pg.evaluate(`(()=>{ const inf=__blast.lv7.info(); const out=[]; for(const [x,y] of [[256,332],[255,410],[256,252]]){ const i=__blast.test.pickAt(x,y); out.push([x,y,i, i==null?null:inf[i].key+(inf[i].an?'(anchor)':'')+(inf[i].dead?'(dead)':'')]); } return JSON.stringify({out, charges:__blast.chargeHosts().filter(c=>!c.fired).length, sel:__blast.state().selected, stock:__blast.state().stock}); })()`));
console.log('state', await pg.evaluate('JSON.stringify({scr:__blast.state().screen, ph:__blast.state().phase, lv:__blast.state().level})'));
console.log(await pg.evaluate(`(()=>{ const B=__blast.lv7.info().filter(b=>!b.an&&!b.kp&&!b.dead&&!(b.y<1.5&&b.sy-b.y>0.3)); const g={}; B.forEach(b=>{const k=b.bid+':'+b.key+(b.st?'/stand':'/fallen')+'@y'+Math.round(b.y)+(b.sy<1.5?'(ground-start)':''); g[k]=(g[k]||0)+1;}); const M=__blast.members(); const pk=new Set(M.filter(m=>m.pickable).map(m=>m.i)); return JSON.stringify({left:g, leftPickable:B.filter(b=>pk.has(b.i)).length, of:B.length}); })()`));
pg.close(); proc.kill(); srv.close(); process.exit(0);
