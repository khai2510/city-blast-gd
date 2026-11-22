// ---- g7hard/order-end.js (src/g7hard/patch.js): at the very end of main(), after every patch and the g7 engine (they address
// LEVELS by appended index while main() runs: A1 / levels6 replace LEVELS[0..4], M14 reads LEVELS[31]), LEVELS takes the play
// order LV7O.ORD. The Home preview built at boot (old order) is rebuilt for the current slot.
try{ (function(){
  var O = window.LV7O; if(!O) return;
  // old-polish (22/11): the rebuilt old levels take their old level's place (appended index), before the reorder; A1 / levels6 have
  // already written LEVELS[0..35] while main() ran. The Home preview of a replaced current level is rebuilt below.
  var oldNow = false;
  if(O.oldOn) Object.keys(O.old).forEach(function(k){ var i = +k; if(i >= 0 && i < O.base){ LEVELS[i] = JSON.parse(JSON.stringify(O.old[k])); if(i === O.id(save.level)) oldNow = true; } });
  if(!O.reorder){ if(oldNow && phase === "title"){ phase = "lv7o"; goHome(); } return; }
  if(LEVELS.length !== O.ORD.length){ console.error("g7hard/order-end.js: " + LEVELS.length + " levels, order lists " + O.ORD.length + ": not reordered"); O.reorder = false; O.ORD = O.ORD.map(function(v, p){ return p; }); O.POS = O.ORD.slice(); return; }
  if(typeof BOOST !== "undefined") O.boost(BOOST);   // a booster added after the boosters2 / sky.js anchors
  var src = LEVELS.slice();
  for(var p = 0; p < src.length; p++) LEVELS[p] = src[O.ORD[p]];
  if(window.__blast && window.__blast.lv7){ window.__blast.lv7.order = O; window.__blast.lv7.slots = O.ORD.map(function(v, p){ return p; }).filter(O.isH); }
  if(phase === "title" && (O.id(save.level) !== save.level || oldNow)){ phase = "lv7o"; goHome(); }
})(); }catch(e){ console.error("g7hard/order-end.js", e); }
