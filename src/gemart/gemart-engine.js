// ---- gemart engine part 1 (src/gemart): the Gemini material textures B01-B06 and the C01 backdrop, ?art=1 only.
// Runs after levelart part 1, before the figmadirect member hooks: it only swaps their inputs (FD_IMG / FD_MAT / LA_IMG),
// so the per-member colour jitter, damage tints, Lambert light, bevel / AO and the protected-blue keep material are as before.
//   glass B01 / brick B02 / concrete B03 / steel B04 / stone B05: one texture per family at a world tile size (m)
//   dark pier B06: concrete-family members whose colour is dark (RC / "Dark Pier", ratio to the family colour < GEM_PIER_T)
//   C01: sky + skyline as the far band (opaque, replaces the keyed Figma strip); lawn, lot and props are the game's own
var GEM_ON = !!window.GEM_ART, GEM_PIER_T = 0.74;
var GEM_TEX = /*GEM_TEX*/{};
if(GEM_ON){
  Object.keys(GEM_TEX).forEach(function(k){ FD_IMG["gem_" + k] = GEM_TEX[k]; });
  if(FD.mats){
    FD_MAT.glass = { tex:"gem_glass", mode:"tile", tile:[3.2, 3.2], v0:0, keys:FD_MAT.glass.keys, post:FD_MAT.glass.post || "" };   // 4 x 4 panes per 3.2 m
    FD_MAT.brick.tex = "gem_brick"; FD_MAT.brick.tile = [2.6, 2.6]; FD_MAT.brick.v0 = 0;      // ~11 courses: 0.24 m a course
    FD_MAT.concrete.tex = "gem_concrete"; FD_MAT.concrete.tile = [3.0, 3.0];                    // 2 cast panels per 3 m
    FD_MAT.steel.tex = "gem_steel"; FD_MAT.steel.mode = "grain"; FD_MAT.steel.tile = [1.0, 1.0]; // rivet rows along the member
    FD_MAT.stone.tex = "gem_stone"; FD_MAT.stone.tile = [2.4, 2.4];                             // 2-3 big blocks a face
  }
  if(LA.sky && GEM_TEX.sky){ LA_IMG.skyline = GEM_TEX.sky; FD_IMG.la_skyline = GEM_TEX.sky;
    // C01 already carries its own haze: main/look.js's band grade (-30 % saturation + haze) is skipped on it (its _lk mark)
    var gemLB = laBackdrop; laBackdrop = function(){ var r = gemLB.apply(this, arguments); if(laSkyMat) laSkyMat._lk = 1; return r; };
  }
}
// ---- end gemart engine part 1
