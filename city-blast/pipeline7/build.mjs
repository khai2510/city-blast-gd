// shared: inject a generated level pack + the levels7 engine into the 16/11 base build
import { readFileSync } from 'node:fs';
export function buildHtml(levels, test){
  const base = readFileSync(new URL('./' + (process.env.CB_BASE || 'base-1811.html'), import.meta.url), 'utf8');
  const engine = readFileSync(new URL('./engine.js', import.meta.url), 'utf8');
  const data = '// ---- main/levels7-data.js (pipeline7, generated from Smash Fest blueprints; do not edit by hand)\n' +
    'if(!/[?&]lv7=0(&|$)/.test(location.search)) try{ (function(){ var LV7DEFS = ' + JSON.stringify(levels) + ';\n' +
    '  var TEST7 = ' + (test ? 'true' : 'false') + ';\n' +
    '  LV7DEFS.forEach(function(l){ LEVELS.push(l); }); window.__lv7base = LEVELS.length - LV7DEFS.length;\n' +
    '  if((TEST7 || /[?&]pack7=1(&|$)/.test(location.search)) && save.level < window.__lv7base){ save.level = window.__lv7base;\n' +
    '    try{ save.bseen = save.bseen || {}; Object.keys(BOOST).forEach(function(k){ if(!BOOST[k].hidden) save.bseen[k] = 2; }); }catch(e){}\n' +
    '    writeSave(); }\n})(); }catch(e){ console.error("main/levels7-data.js", e); }\n';
  // base 18/11 (W6863..., no fix4): the engine goes at the end of main(), the level data before the map/UI layout
  const mark = '} // main\n})();', ui = 'try{\n// ---- UILAYOUT v2';
  if(base.split(mark).length !== 2 || base.split(ui).length !== 2) throw new Error('base markers');
  let b = base.replace(mark, engine + '\n' + mark).replace(ui, data + ui);
  if(test){
    b = b.replace('#lvBtn#lvBtn{display:none}', '#lvBtn#lvBtn{display:block}')
      .replace("var n=36;try{if(typeof LEVELS!=='undefined')n=LEVELS.length;}catch(e){}", 'var n=L?L.length:36;')
      .replace("try{var d=LEVELS[i];var t=(d&&(d.tier||d.kind||d.diff||''))+'';if(/boss/i.test(t))b.className='b';else if(/hard/i.test(t))b.className='h';}catch(e){}", "try{var d=L[i];if(d.boss)b.className='b';}catch(e){}");
  }
  return b;
}

