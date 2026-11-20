// report.md from out/final/results-final.json (numbers are copied from the tester output, never typed)
import { readFileSync, writeFileSync } from 'node:fs';
const R = JSON.parse(readFileSync(new URL('./out/final-v3/results-final.json', import.meta.url))).map((r, k) => Object.assign(r, { lv: 37 + k }));
const P = (n) => n == null ? '–' : n;
let t = '';
t += '| Lv | Màn | Bậc | Mẫu SF (màn) | SF: vật cứng % · vị trí cứng | CB đo được: cứng % (toà chính) · vị trí | Lõi | Lớp cứng | Hàng cột (sâu) | Số toà |\n|---|---|---|---|---|---|---|---|---|---|---|\n';
R.forEach(r => { const m = r.metrics, mm = m.main, p = mm.pos;
  const where = Object.entries({ 'đỉnh': p.top, 'giữa': p.mid, 'đáy': p.bottom, 'viền': p.edge, 'lõi': p.core }).filter(([k, v]) => v).map(([k, v]) => k + ' ' + v).join(', ');
  t += `| ${r.lv} | ${r.name} | ${r.tier} | ${r.pattern} (${r.sf.join(', ')}) | ${r.sfMetric.hard_pct}% · ${r.sfMetric.hard_pos} | ${mm.hardPct}% · ${where} | ${mm.core} | ${mm.hardLayers} | ${mm.depthRows} | ${m.stacks} |\n`; });
let u = '| Lv | Màn | 1 bom tốt nhất % | Dồn hết TNT ở chân % | Chỉ đánh chân % | TNT cho | Người chơi thường: thắng | dư TNT | số đợt | ước thời gian |\n|---|---|---|---|---|---|---|---|---|---|\n';
R.forEach(r => { const f = r.fair;
  u += `| ${r.lv} | ${r.name} | ${r.oneBomb.pct}% | ${r.allFoot.pct}% | ${r.footOnly.pct}% | ${r.tnt} | ${f.filter(x => x.win).length}/3 | ${Math.min(...f.map(x => x.left))}–${Math.max(...f.map(x => x.left))} | ${Math.min(...f.map(x => x.waves))}–${Math.max(...f.map(x => x.waves))} | ${Math.min(...f.map(x => x.estSec))}–${Math.max(...f.map(x => x.estSec))} s |\n`; });
writeFileSync(new URL('./out/final-v3/tables.md', import.meta.url), '## Cấu trúc: Smash Fest vs City Blast\n\n' + t + '\n## Tester\n\n' + u);
console.log(t); console.log(u);
