// ---- g7hard/order-early.js (src/g7hard/patch.js, Agents-Game 20/11): LV7O = the ONE level-order table of the main build.
// LEVELS is built in the appended layout (old L1-36 = index 0-35, the hard levels H = 36+k, as pipeline7/build.mjs, then the easy
// pack E = 36+NH+k, 22/11); at the end of
// main() g7hard/order-end.js puts it in the play order (PLACE in patch.js). From then on a level's slot p (= levelIdx, save.level,
// the map, the HUD "LV n") is its position in the game, and everything keyed to a level NUMBER asks LV7O:
//   LV7O.id(p)    the level's appended-layout index: old Ln = n-1, H = 36+k (seeds, art, everything that must stay as tested)
//   LV7O.pos(o)   the slot of appended index o (old L4 = pos(3));  LV7O.num(n) = the new number of old level n
//   LV7O.isH(p)   a hard level (Hard tag in the picker; not counted by nth);  LV7O.isE(p) an easy-pack level;  LV7O.isG(p) either
//                 (a g7 level: no tutorial, no hint, no intro card);  LV7O.orig1(p) = old level number, 0 for a g7 level
//   LV7O.introAt(id)  new number of the level an intro card was moved to (INTRO_AT in patch.js), 0 = the card stays on its own level
//   LV7O.nth(k)   slot of the (k+1)-th non-hard level: "from level N on" thresholds (ads, rewarded) count progress, not one level
//   LV7O.nh = hard + easy (every g7 level: LEVELS.length = base + nh), LV7O.nhd = hard only, LV7O.ne = easy only
// ?lv7=0 = no hard levels (identity), ?lv7ord=0 = hard levels appended after L36 (identity, Mac's layout).
// Save: save.level / best / bp are slots. An old save (appended layout) is moved to the new slots once; the mark is its own key
// (SAVE_KEY + ".lv7o") and is written only together with the save (writeSave), so a load that never saved migrates again.
// The mark names the order the save was written in: "s:" + the slot list (21/11 on), "1" = the 20/11 order (LEGACY in patch.js),
// none = the appended layout. A save from any other order (22/11: one rule for all): best / bp follow their level; save.level = the
// first level of the new order the player has not beaten yet (beaten = every level before save.level in the save's own order).
// A save from an order with fewer levels (22/11: the 41-level orders, before the easy pack) that is at or past its end has beaten
// all of them: it goes to the first new level (41 beaten -> 42), never past it.
var LV7O = (function(){
  var Q = location.search, on = !/[?&]lv7=0(&|$)/.test(Q), NB = LEVELS.length, NHD = __NH__, NE = __NE__, NH = NHD + NE, SLOTS = __SLOTS__;   // NH = every g7 level
  var R = [], i;                                                           // the play order: slot -> appended index
  SLOTS.forEach(function(s){ R.push(s >= 0 ? s : NB - s - 1); });
  for(i = 0; i < NB; i++) if(R.indexOf(i) < 0) R.push(i);
  for(i = 0; i < NH; i++) if(R.indexOf(NB + i) < 0) R.push(NB + i);
  var O = { on:on, reorder:on && !/[?&]lv7ord=0(&|$)/.test(Q), base:NB, nh:on ? NH : 0, nhd:on ? NHD : 0, ne:on ? NE : 0, R:R, ORD:[], POS:[] };
  if(O.reorder) O.ORD = R.slice(); else for(i = 0; i < NB + O.nh; i++) O.ORD.push(i);
  O.ORD.forEach(function(v, p){ O.POS[v] = p; });
  O.id = function(p){ p = Math.max(0, p|0); return p < O.ORD.length ? O.ORD[p] : p; };
  O.pos = function(o){ o = Math.max(0, o|0); return o < O.POS.length ? O.POS[o] : o; };
  O.num = function(n){ return O.pos((n|0) - 1) + 1; };
  O.nth = function(k){ k = k|0; for(var p = 0, c = 0; p < O.ORD.length; p++) if(!O.isH(p) && c++ === k) return p; return k; };   // slot of the (k+1)-th non-hard level
  O.isH = function(p){ var v = O.id(p); return v >= NB && v < NB + O.nhd; };
  O.isE = function(p){ var v = O.id(p); return v >= NB + O.nhd && v < NB + O.nh; };
  O.isG = function(p){ var v = O.id(p); return v >= NB && v < NB + O.nh; };
  O.orig1 = function(p){ return O.isG(p) ? 0 : O.id(p) + 1; };
  // intro cards moved to their element's intro level (INTRO_AT in patch.js): card id -> new level number, 0 = keep its own level
  var IA = __INTRO__;
  O.introAt = function(id){ return O.reorder && IA[id] != null && IA[id] < NB + O.nh ? O.pos(IA[id]) + 1 : 0; };
  // booster unlock levels ("save.level >= unlock" = that boss is beaten) in new numbers; once per booster (boosters are added in two places)
  O.boost = function(B){ Object.keys(B).forEach(function(k){ var b = B[k], u = b && b.unlock; if(b && !b.lv7o && u > 0 && u < 999){ b.unlock = O.num(u); b.lv7o = u; } }); };
  // ---- the save: appended layout <-> slots
  var LEG = __LEGACY__, SIG = "s:" + SLOTS.join(",");
  var rOf = function(sl){ var r = [], i; sl.forEach(function(s){ r.push(s >= 0 ? s : NB - s - 1); }); for(i = 0; i < NB; i++) if(r.indexOf(i) < 0) r.push(i); for(i = 0; i < NH; i++) if(r.indexOf(NB + i) < 0) r.push(NB + i); return r; };
  var markR = function(m){ var sl = m && LEG[m] ? LEG[m] : m && /^s:-?\d+(,-?\d+)*$/.test(m) ? m.slice(2).split(",").map(Number) : null;   // the order a mark names (null = unknown)
    if(!sl || sl.some(function(s){ return s >= NB || s < -NH; })) return null; var r = rOf(sl); if(r.length !== R.length) return null;
    r.n0 = m && LEG[m] ? NB + NHD : m && /^s:/.test(m) ? sl.length : r.length;   // how many levels that order had (20/11 "1": 36 + H1-H5; "s:" lists all)
    return r; };
  var KEY = SAVE_KEY + ".lv7o", had = null, want = O.reorder ? SIG : null;
  try{ had = localStorage.getItem(KEY); }catch(e){}
  var R0 = had ? markR(had) : null;
  // migration (22/11, general orders): from the order the save was written in (R0; no mark = the appended layout) to the order
  // played now (O.ORD): best / bp follow their level (by appended index); save.level = the first level of the new order that the
  // save had not beaten (beaten = every level before save.level in the save's own order). Past the end stays past the end.
  var mig = function(F){ var T = O.ORD, p = save.level|0, beat = {}, q, lv = T.length, n0 = F.n0 || F.length;
    for(q = 0; q < Math.min(p, n0); q++) beat[F[q]] = 1;
    if(p < F.length) for(q = 0; q < T.length; q++) if(!beat[T[q]]){ lv = q; break; }
    var short = p >= n0 && n0 < F.length;                                  // at / past the end of a shorter order: first level not in it
    if(short){ lv = T.length; for(q = 0; q < T.length; q++) if(!beat[T[q]]){ lv = q; break; } }
    save.level = !short && p >= F.length ? T.length + (p - F.length) : lv;
    ["best", "bp"].forEach(function(k){ var o = save[k]; if(!o || typeof o !== "object") return; var n = {};
      Object.keys(o).forEach(function(j){ var v = F[+j], t = v == null ? -1 : T.indexOf(v); if(t >= 0) n[t] = o[j]; }); save[k] = n; }); };
  var ID = []; for(i = 0; i < NB + NH; i++) ID.push(i);
  if(want && !had) mig(ID);                                              // a save in the appended layout (old 36-level game, or ?lv7ord=0)
  else if(want && had !== want && R0) mig(R0);                            // a save from another order
  else if(!want && R0) mig(R0);                                           // ?lv7ord=0 / ?lv7=0 after a reordered save
  O.migrated = want !== had; O.mark = { had:had, want:want, known:!had || !!R0 };
  var ws0 = writeSave;
  writeSave = function(){ var r = ws0.apply(this, arguments); try{ if(want) localStorage.setItem(KEY, want); else localStorage.removeItem(KEY); }catch(e){} return r; };
  window.LV7O = O;
  return O;
})();
