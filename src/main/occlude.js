  // ---- main/occlude.js (14/11/2026, Owner: "đặt TNT xong xoay camera sang góc khác vẫn thấy bom xuyên qua khối 3D"). Appended inside main().
  // A placed charge obeys the real view occlusion: a building (or the host itself, seen from the far side) in front of it hides it.
  // Before: every charge material was drawn over the whole scene (depthTest:false, gloss/patch.js, v1look chargeMatOf, figmadirect
  // fdChargeModel sprite), so a TNT on the far face showed through the building.
  // Now: depthTest on (and depthWrite on for the opaque 3D model, which leaves the transparent pass), plus two render-only fixes in
  // the charge's vertex shader so it still reads where the player put it:
  //   1) SHELL: pick() sees through the hero kit dress (L6_KD boxes / cylinders: the windmill boards, the facades) and through decor /
  //      props / curtain glass (FIX1, v5Redirect), so the member a tap lands on can lie metres INSIDE the visible shell (L1: a tap
  //      between two front posts lands on a back post 10 m deep; L5: a brick member 3.7 m behind facade decor). The old look drew
  //      the charge on top, so it seemed to sit on the shell. At placement a ray from the camera to the charge finds that shell
  //      (the first opaque surface in front of it, only if it is kit dress or a decor / prop member, <= 12 m, and only when the
  //      charge's face looks at the camera); the charge is DRAWN 0.18 m in front of that shell point (a world offset, turned
  //      into the object's own space every draw: uOcclOff).
  //      From any other angle it stays on that spot of the shell, so the building hides it like any object on its surface.
  //   2) SIZE: its depth (only) is pulled toward the camera by K x its world height (screen position unchanged), so the face it
  //      sits on never cuts the ~0.8-1.2 m model / sprite in half; anything farther in front than that hides it.
  // c.mesh.position (blast origin, stacking, chargeAt, the "x" button, chargeHosts), the blast-radius ghost and every gameplay rule
  // are untouched: render only, determinism unchanged. Each placed charge gets its own clone of its kind's material (same shader
  // program) to carry its own offset.
  // Not changed on purpose: the drag-aim ghost (feel Q2, under the finger, cloned material with depthTest off = a cursor), the blast
  // radius ghost (already depth tested, centred on the real charge), the Sky Strike target ring / shadow (a transient booster aim
  // marker; its falling bomb is already depth tested), the rooftop signs, the selected-charge "x" and the L32 pips (DOM UI).
  // ?occl=0 = the old always-on-top look.
  (function(){
    var OFF = new URLSearchParams(location.search).get("occl") === "0";
    var OC = window.__blastOccl = { on:!OFF, fixed:0, shells:[] };
    if(OFF) return;
    var ZERO = { value:new THREE.Vector3() };
    var DECL = "\nuniform vec3 uOcclOff;\n";
    var SPR = "vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );";
    var PULL = "\n{ float oL = max(1e-3, length(mvPosition.xyz)), oP = OCCL_K*length(modelMatrix[1].xyz);\n" +
      "  vec4 oC = projectionMatrix*vec4(mvPosition.xyz*max(0.02, (oL - oP)/oL), 1.0); gl_Position.z = oC.z/oC.w*gl_Position.w; }\n";
    var hook = function(m, prev, prevKey, kk){
      m.onBeforeCompile = function(sh, r){
        if(prev && prev !== THREE.Material.prototype.onBeforeCompile) prev.call(this, sh, r);
        if(this.depthTest === false) return;   // a clone made always-on-top again (the aim ghost): left as it was
        sh.uniforms.uOcclOff = this._occlU || ZERO;
        // uOcclOff is the offset in the object's own space (set per draw in onBeforeRender): viewMatrix is not uploaded for sprites in r128
        var v = sh.vertexShader.replace("void main()", "#define OCCL_K " + kk + DECL + "void main()");
        if(v.indexOf(SPR) >= 0) v = v.replace(SPR, SPR.replace("vec4( 0.0, 0.0, 0.0, 1.0 )", "vec4( uOcclOff, 1.0 )"));   // sprite
        else v = v.replace("#include <project_vertex>", "transformed += uOcclOff;\n#include <project_vertex>");
        sh.vertexShader = v.replace("#include <logdepthbuf_vertex>", PULL + "#include <logdepthbuf_vertex>");
      };
      m.customProgramCacheKey = function(){ return (prevKey && prevKey !== THREE.Material.prototype.customProgramCacheKey ? prevKey.call(this) : "") + "-occl" + (this.depthTest === false ? "0" : kk); };
      m._occlHook = [prev, prevKey, kk];
    };
    var fix = function(m, k, opaque){
      if(!m || m._occlHook) return m;
      m.depthTest = true;
      if(opaque){ m.transparent = false; m.depthWrite = true; }   // the 3D toy model: solid, writes depth (opacity was 1 anyway)
      hook(m, m.onBeforeCompile, m.customProgramCacheKey, k.toFixed(3));
      m.needsUpdate = true; OC.fixed++;
      return m;
    };
    // a per-charge copy (Material.clone drops onBeforeCompile / customProgramCacheKey in r128: put them back)
    var own = function(m, u){ if(!m || !m._occlHook) return m; var c = m.clone(); hook(c, m._occlHook[0], m._occlHook[1], m._occlHook[2]); c._occlU = u; c._occlOwn = true; return c; };
    // K = depth pull / the object's world height: the model's unit is 1 m (extent ~0.8-1 m x its scale), the sprite's unit is its height
    var K_MODEL = 0.55, K_SPRITE = 0.6, K_BALL = 0.55;
    var cmo = chargeMatOf; chargeMatOf = function(k){ return fix(cmo(k), K_MODEL, true); };
    var cms = chargeMats; chargeMats = function(k){ var r = cms(k); fix(r.mat, K_BALL, true); return r; };   // the old ball material (kept in c.mat)
    var fdm = fdChargeModel; fdChargeModel = function(k){ var g = fdm(k);
      if(g) g.traverse(function(o){ if(o.isSprite) fix(o.material, K_SPRITE, false); });   // a soft-edged picture: stays transparent, depth tested
      return g; };
    Object.keys(CHARGE_MAT).forEach(function(k){ fix(CHARGE_MAT[k], K_MODEL, true); });   // made before this point (none at boot today)
    Object.keys(CMATS).forEach(function(k){ fix(CMATS[k].mat, K_BALL, true); });
    Object.keys(FD_CHG_MAT).forEach(function(k){ fix(FD_CHG_MAT[k], K_SPRITE, false); });
    // 1) the shell in front of a new charge, seen from the camera that placed it
    var SHELL_MAX = 12, rc = new THREE.Raycaster(), _inv = new THREE.Matrix4(), _d = new THREE.Vector3(), _t = new THREE.Vector3();
    var shellOff = function(c, n){
      var pos = c.mesh.position; _t.copy(camera.position).sub(pos);
      if(n && n.dot(_t) <= 0) return null;   // its face looks away from this camera (a scripted placement): nothing to correct
      var dist = _t.length(); if(dist < 1) return null;
      var kd = {}, meshes = [];
      Object.keys(L6_KD.mesh).forEach(function(g){ var q = L6_KD.mesh[g]; if(q && q.visible){ kd[q.uuid] = 1; meshes.push(q); } });
      Object.keys(inst).forEach(function(k){ if(inst[k] && inst[k].mesh && inst[k].mesh.visible) meshes.push(inst[k].mesh); });
      if(MB.mesh && MB.mesh.visible) meshes.push(MB.mesh);
      _d.copy(_t).multiplyScalar(-1/dist);   // camera -> charge
      rc.set(camera.position, _d); rc.near = 0; rc.far = dist - 0.3;
      var hits = rc.intersectObjects(meshes, false);
      for(var i=0;i<hits.length;i++){ var h = hits[i], o = h.object, m = Array.isArray(o.material) ? o.material[0] : o.material;
        if(m && (m.transparent && !m.depthWrite || m.visible === false || m.colorWrite === false)) continue;   // see-through glass / glare
        var b = o.userData && o.userData.list ? o.userData.list[h.instanceId] : null, shell;
        if(kd[o.uuid]) shell = true;
        else if(b){ if(b.dead || b === c.host) continue; shell = !!(b.def.decor || b.bonus || b.prop || b.key === "aqua"); }
        else continue;
        if(!shell) return null;   // a real member in front of it: it really is behind that, no correction
        if(dist - h.distance > SHELL_MAX) return null;
        return h.point.clone().addScaledVector(_d, -0.18).sub(pos);   // drawn 0.18 m in front of the shell point
      }
      return null;
    };
    var pc0 = placeCharge; placeCharge = function(block, point, normal){
      var n0 = charges.length, r = pc0.apply(this, arguments);
      for(var i=n0;i<charges.length;i++){ var c = charges[i]; if(c._occl) continue;
        var off = null; try{ off = shellOff(c, normal ? normal.clone().normalize() : null); }catch(e){ off = null; }
        c._occl = { off:off }; OC.shells.push(off ? +off.length().toFixed(2) : 0);
        c.mesh.traverse(function(o){ if(!o.material || !o.material._occlHook) return;
          var u = { value:new THREE.Vector3() }; o.material = own(o.material, u);
          if(off){ o.frustumCulled = false;   // drawn away from its own position
            o.onBeforeRender = function(){ _inv.copy(this.matrixWorld).invert(); u.value.setFromMatrixPosition(this.matrixWorld).add(off).applyMatrix4(_inv); }; } });
      }
      return r;
    };
    // a removed / fired charge: drop its own material copy with it
    var rm = function(c){ if(c && c.mesh) c.mesh.traverse(function(o){ if(o.material && o.material._occlOwn) o.material.dispose(); }); };
    var cc0 = clearCharges; clearCharges = function(){ charges.forEach(rm); return cc0.apply(this, arguments); };
    var rc0 = removeCharge; removeCharge = function(c, silent){ var ok = c && !c.fired && c.def && c.def.kind !== "wreck" && charges.indexOf(c) >= 0;
      var r = rc0.apply(this, arguments); if(ok && charges.indexOf(c) < 0) rm(c); return r; };
    OC.shellOf = function(i){ var c = charges[i]; return c && c._occl && c._occl.off ? c._occl.off.toArray() : null; };   // tools: the drawn offset of charge i
  })();
