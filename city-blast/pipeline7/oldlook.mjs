// old-polish look check (Agents-Game 22/11, OLD-POLISH.md): one hand-built level -> test build -> at 393x852:
//   rest probe (8 s: members dead / moved > 0.3 m, bonds broken), the opening shot, and the level's own sol in ONE blast:
//   a shot 2.5 s in and after it settles, with the %.   CB_BASE=out/base-main.html node oldlook.mjs <level.json> <outPrefix> [yawOffset]
import { readFileSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { launch, open } from './cdp.mjs';
import { buildHtml } from './build.mjs';
const lv = JSON.parse(readFileSync(process.argv[2], 'utf8')), pre = process.argv[3], yo = +(process.argv[4] || 0);
const html = buildHtml(lv, true);
const srv = createServer((q, s) => { s.writeHead(200, { 'content-type': 'text/html' }); s.end(html); }).listen(8823);
const { proc, port } = await launch(9377); const pg = await open(port, 'http://127.0.0.1:8823/');
await pg.send('Emulation.setDeviceMetricsOverride', { width: 393, height: 852, deviceScaleFactor: 1, mobile: true });
for(let i = 0; i < 80; i++){ await new Promise(r => setTimeout(r, 500)); try{ if(await pg.evaluate('!!(window.__blast && __blast.lv7 && __blast.lv7.info)')) break; }catch(e){} }
await new Promise(r => setTimeout(r, 3000));
const out = {};
try{
out.rest = JSON.parse(await pg.evaluate(`(()=>{ const T=__blast.test; T.play(__blast.lv7.base,1); const bonds=()=>T.bodies().reduce((a,b)=>a+(b.bonds||0),0); const a=__blast.lv7.info(), b0=bonds(); T.step(Math.round(8/ (1/60))); const b=__blast.lv7.info(), b1=bonds();
  let dead=0, moved=0, mv=[]; b.forEach((m,i)=>{ if(m.an||m.kp) return; if(m.dead && !a[i].dead){ dead++; mv.push(m.key+'@'+m.bid+' dead'); } else if(Math.hypot(m.x-a[i].x,m.y-a[i].y,m.z-a[i].z)>0.3){ moved++; mv.push(m.key+'@'+m.bid+' f'+m.f+' moved'); } });
  const parts={}; b.forEach(m=>{ if(m.an||m.kp) return; parts[m.bid]=(parts[m.bid]||0)+1; });
  const keys={}; b.forEach(m=>{ if(m.an) return; const k=(m.kp?'keep:':'')+m.key; keys[k]=(keys[k]||0)+1; });
  let hmax={}; a.forEach(m=>{ if(m.an||m.kp) return; hmax[m.bid]=Math.max(hmax[m.bid]||0, +(m.sy+m.h).toFixed(1)); });
  return JSON.stringify({ keys, members:b.filter(m=>!m.an&&!m.kp).length, parts, height:hmax, dead, moved, bondsBefore:b0, bondsAfter:b1, list:mv.slice(0,12), pct:Math.round(100*__blast.state().pct) }); })()`));
await pg.evaluate(`(async()=>{ __blast.test.load(__blast.lv7.base,1); ${yo ? `try{ yaw += ${yo}; baseYaw = yaw; }catch(e){}` : ''} __blast.test.run(4); await new Promise(r=>setTimeout(r,2500)); return 1; })()`);
writeFileSync(pre + '-open.jpg', Buffer.from(await pg.shot(), 'base64'));
const sol = lv[0].sol || [];
if(sol.length){
  out.sol = JSON.parse(await pg.evaluate(`(async()=>{ const T=__blast.test; T.play(__blast.lv7.base,1); T.run(4); const r0=T.solve(${JSON.stringify(sol)}); T.fire(); T.step(150); await new Promise(r=>setTimeout(r,1500)); return JSON.stringify({placed:r0}); })()`));
  writeFileSync(pre + '-blast1-mid.jpg', Buffer.from(await pg.shot(), 'base64'));
  out.sol.after = JSON.parse(await pg.evaluate(`(async()=>{ const r=__blast.test.run(25); await new Promise(q=>setTimeout(q,1500)); return JSON.stringify({pct:Math.round(100*r.pct), phase:r.phase, res:r.result}); })()`));
  writeFileSync(pre + '-blast1.jpg', Buffer.from(await pg.shot(), 'base64'));
}
}catch(e){ out.err = String(e).slice(0, 400); }
console.log(JSON.stringify(out)); console.log('errors', JSON.stringify(pg.logs.slice(0, 4)));
pg.close(); proc.kill(); srv.close(); process.exit(0);
