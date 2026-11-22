// ---- gemart engine part 2 (src/gemart): dark pier (B06) inside the concrete family hook, ?art=1 only. The figmadirect line
// "texel x (member colour / family colour)" is swapped for: a dark member (RC, Dark Pier) samples B06, the rest B03.
if(GEM_ON && FD.mats) FD_MAT.concrete.keys.forEach(function(k){
  var m = MATS[k]; if(!m || !MEMBERS[k] || m._gemPier) return; m._gemPier = 1;
  var prev = m.onBeforeCompile, pk = m.customProgramCacheKey, t = fdTex("gem_pier", { repeat:true }), U = { uGemPier:{value:t}, uGemPierOn:{value:t.userData.ready ? 1 : 0} };
  fdWhen(t, function(){ U.uGemPierOn.value = 1; });
  var A = "diffuseColor.rgb = texture2D(uFdTex, tu).rgb*(diffuseColor.rgb/max(uFdBase, vec3(0.02))); }";
  m.onBeforeCompile = function(sh, r){
    if(prev) prev.call(this, sh, r);
    if(sh.fragmentShader.indexOf(A) < 0){ console.warn("gemart: concrete hook not found for " + k); return; }
    sh.uniforms.uGemPier = U.uGemPier; sh.uniforms.uGemPierOn = U.uGemPierOn;
    sh.fragmentShader = sh.fragmentShader.replace("#include <common>", "#include <common>\nuniform sampler2D uGemPier; uniform float uGemPierOn;")
      .replace(A, "vec3 gmR = diffuseColor.rgb/max(uFdBase, vec3(0.02));" +
        " if(uGemPierOn > 0.5 && dot(gmR, vec3(0.3333)) < " + GEM_PIER_T.toFixed(3) + ") diffuseColor.rgb = texture2D(uGemPier, tu*1.5).rgb*min(gmR/0.6, vec3(1.6));" +
        " else diffuseColor.rgb = texture2D(uFdTex, tu).rgb*gmR; }");
  };
  m.customProgramCacheKey = function(){ return (pk ? pk.call(this) : "") + "-gem"; };
  m.needsUpdate = true;
});
// ---- end gemart engine part 2
