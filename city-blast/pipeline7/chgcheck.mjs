import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { launch, open } from './cdp.mjs';
const html = readFileSync(process.argv[2]);
const srv = createServer((q, s) => { s.writeHead(200, { 'content-type': 'text/html' }); s.end(html); }).listen(8841);
const { proc, port } = await launch(9381); const pg = await open(port, 'http://127.0.0.1:8841/');
for(let i = 0; i < 60; i++){ await new Promise(r => setTimeout(r, 500)); try{ if(await pg.evaluate('!!(window.__blast && __blast.lv7)')) break; }catch(e){} }
await new Promise(r => setTimeout(r, 3000));
console.log(await pg.evaluate(`(()=>{ const T=__blast.test; T.play(__blast.lv7.base,1); T.run(4); const I=__blast.lv7.info();
  const foot=I.filter(b=>b.bid==='A'&&b.f===0&&(b.key==='rc')).slice(0,6), high=I.filter(b=>b.bid==='A'&&b.f===3&&b.key==='wpost').slice(0,6);
  foot.concat(high).forEach(b=>T.charge('tnt',b.i,0,1,0)); T.fire(); const out=[];
  for(let k=0;k<12;k++){ T.run(0.25); const H=__blast.chargeHosts(), M=__blast.members(); const live=H.filter(h=>!h.fired);
    const d=live.map(h=>{ const m=M.find(q=>q.i===h.i); return m?Math.round(Math.hypot(m.sx-h.sx,m.sy-h.sy)):'dead'; });
    out.push('t'+((k+1)*0.25).toFixed(2)+' unfired '+live.length+' px-from-host '+JSON.stringify(d)); }
  return out.join('\\n'); })()`));
pg.close(); proc.kill(); srv.close(); process.exit(0);
