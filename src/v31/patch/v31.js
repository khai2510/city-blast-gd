// ---- v31 (v31/patch.js, Lead 11/11/2026): steel throw x2, BLAST label only, Smash Fest text cut, boosters hidden ----
// Flags (query string, read once at load):
//   ?steelk=<n>   steel throw multiplier on freed steel (materials-fx MATFX.steel.throw). Default STEEL_THROW = 2
//                 (materials-fx shipped 4; 2 is the Lead's safe default while Owner decides). ?mfx=0 ignores it.
//   ?boosters=1   Safety Net (L13) / +1 TNT (L16) unlock, NEW! cards and Home lock bubble back (hidden by default
//                 until those levels are rebuilt). The code is untouched; only the unlock is switched off.
//   ?notes=1      (levels6 flag) also brings back the stub levels' original long tips and intro / win lines.
var STEEL_THROW = 2;   // the ONE knob for the default (v31/TEXT-CUT.md is the text list, this is physics)
var V31 = (function(){
  var k = parseFloat(QS.get("steelk"));
  return { steelk: isFinite(k) && k > 0 ? Math.max(0.5, Math.min(8, k)) : STEEL_THROW, boosters: QS.get("boosters") === "1" };
})();
if(typeof MATFX === "object" && MATFX.steel) MATFX.steel.throw = V31.steelk;   // mfxThrow() reads it at every blast
// boosters: hidden = no bar, no NEW! card, no Home "Lv 13" bubble, no map goal, no pre-level picker tile
if(L6.tntOnly && !V31.boosters) ["net", "tnt1"].forEach(function(k){ if(BOOST[k]){ BOOST[k].hidden = true; BOOST[k].unlock = 999; } });
// text cut (Smash Fest style, v31/TEXT-CUT.md): stub levels L13-36 get one short TNT-only tip (<= 6 words); the
// "what is this building" intro and the win line are dropped from the level data so nothing can show them.
var V31_TIPS = {
  13:"TNT the 2 BACK legs.", 14:"TNT the MIDDLE columns.", 15:"BOSS! Iron legs.", 16:"TNT 2 FRONT posts.",
  17:"TNT on the LEFT.", 18:"TNT the BACK row.", 19:"TNT 2 FRONT piers.", 20:"BOSS! TNT the BACK row.",
  21:"TNT 2 FRONT posts.", 22:"HARD. TNT the LEFT side.", 23:"TNT 1 BACK column each.", 24:"TNT the 2 LEFT legs.",
  25:"BOSS! TNT both towers.", 26:"TNT the BACK of all 3.", 27:"HARD. TNT right on piers.", 28:"TNT the 2 BACK piers.",
  29:"TNT 2 BACK piers.", 30:"BOSS! Mind the schools.", 31:"TNT the 2 MIDDLE ones.", 32:"HARD. Keep it off the road.",
  33:"TNT both RIGHT legs.", 34:"TNT all 4 TOWER legs.", 35:"BOSS! Mind the road.", 36:"TNT each FRONT foot."
};
var V31_TIP2 = { 27:"TNT 3 MIDDLE FRONT piers." };
if(!L6.notes) LEVELS.forEach(function(Lv, i){
  delete Lv.intro; delete Lv.win;
  if(V31_TIPS[i + 1] && Lv.stub){ Lv.tip = V31_TIPS[i + 1]; if(Lv.tip2) Lv.tip2 = V31_TIP2[i + 1] || null; }
});
// ---- end v31 block
