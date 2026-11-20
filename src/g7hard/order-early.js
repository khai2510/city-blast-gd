// ---- g7hard/order-early.js (src/g7hard/patch.js, Agents-Game 20/11): LV7O = the ONE level-order table of the main build.
// LEVELS is built in the appended layout (old L1-36 = index 0-35, the hard levels H = 36+k, as pipeline7/build.mjs); at the end of
// main() g7hard/order-end.js puts it in the play order (PLACE in patch.js). From then on a level's slot p (= levelIdx, save.level,
// the map, the HUD "LV n") is its position in the game, and everything keyed to a level NUMBER asks LV7O:
//   LV7O.id(p)    the level's appended-layout index: old Ln = n-1, H = 36+k (seeds, art, everything that must stay as tested)
//   LV7O.pos(o)   the slot of appended index o (old L4 = pos(3));  LV7O.num(n) = the new number of old level n
//   LV7O.isH(p)   a hard level (no tutorial, no hint, no intro card);  LV7O.orig1(p) = old level number, 0 for a hard level
// ?lv7=0 = no hard levels (identity), ?lv7ord=0 = hard levels appended after L36 (identity, Mac's layout).
// Save: save.level / best / bp are slots. An old save (appended layout) is moved to the new slots once; the mark is its own key
// (SAVE_KEY + ".lv7o") and is written only together with the save (writeSave), so a load that never saved migrates again.
var LV7O = (function(){
  var Q = location.search, on = !/[?&]lv7=0(&|$)/.test(Q), NB = LEVELS.length, NH = __NH__, SLOTS = __SLOTS__;
  var R = [], i;                                                           // the play order: slot -> appended index
  SLOTS.forEach(function(s){ R.push(s >= 0 ? s : NB - s - 1); });
  for(i = 0; i < NB; i++) if(R.indexOf(i) < 0) R.push(i);
  for(i = 0; i < NH; i++) if(R.indexOf(NB + i) < 0) R.push(NB + i);
  var O = { on:on, reorder:on && !/[?&]lv7ord=0(&|$)/.test(Q), base:NB, nh:on ? NH : 0, R:R, ORD:[], POS:[] };
  if(O.reorder) O.ORD = R.slice(); else for(i = 0; i < NB + O.nh; i++) O.ORD.push(i);
  O.ORD.forEach(function(v, p){ O.POS[v] = p; });
  O.id = function(p){ p = Math.max(0, p|0); return p < O.ORD.length ? O.ORD[p] : p; };
  O.pos = function(o){ o = Math.max(0, o|0); return o < O.POS.length ? O.POS[o] : o; };
  O.num = function(n){ return O.pos((n|0) - 1) + 1; };
  O.isH = function(p){ var v = O.id(p); return v >= NB && v < NB + O.nh; };
  O.orig1 = function(p){ return O.isH(p) ? 0 : O.id(p) + 1; };
  // booster unlock levels ("save.level >= unlock" = that boss is beaten) in new numbers; once per booster (boosters are added in two places)
  O.boost = function(B){ Object.keys(B).forEach(function(k){ var b = B[k], u = b && b.unlock; if(b && !b.lv7o && u > 0 && u < 999){ b.unlock = O.num(u); b.lv7o = u; } }); };
  // ---- the save: appended layout <-> slots
  var KEY = SAVE_KEY + ".lv7o", had = null, want = O.reorder ? "1" : null;
  try{ had = localStorage.getItem(KEY); }catch(e){}
  var fwd = function(o){ return o >= NB ? o + NH : R.indexOf(o); };          // appended index -> slot (a save past L36 stays past the end)
  var back = function(p){ if(p >= R.length) return p - NH; for(var q = p; q < R.length; q++) if(R[q] < NB) return R[q]; return NB; };   // slot -> old index (a hard slot: the next old level)
  var mv = function(f, keyF){ save.level = f(save.level|0);
    ["best", "bp"].forEach(function(k){ var o = save[k]; if(!o || typeof o !== "object") return; var n = {}; Object.keys(o).forEach(function(j){ var t = keyF(+j); if(t != null && t >= 0) n[t] = o[j]; }); save[k] = n; }); };
  if(want === "1" && had !== "1") mv(fwd, function(o){ return o < NB ? R.indexOf(o) : null; });
  else if(want !== "1" && had === "1") mv(back, function(p){ return p < R.length && R[p] < NB ? R[p] : null; });
  O.migrated = want !== had;
  var ws0 = writeSave;
  writeSave = function(){ var r = ws0.apply(this, arguments); try{ if(want) localStorage.setItem(KEY, want); else localStorage.removeItem(KEY); }catch(e){} return r; };
  window.LV7O = O;
  return O;
})();
