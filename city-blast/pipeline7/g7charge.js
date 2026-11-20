  // ---- charges ride their host (Khai 20/11: "bom treo lơ lửng khi toà đã sập"): the charges of one volley go off FUSE_STEP
  // apart, so a building that starts to fall left the later charges hanging in the air where they were placed. After every
  // physics step an unfired charge follows its member (pose x local offset); if the member broke, the charge drops to the
  // ground under gravity. Its blast then goes off where it really is. The red blast-radius sphere is no longer shown.
  var fs7 = fixedStep, _cq = new THREE.Vector3();
  fixedStep = function(){
    var r = fs7.apply(this, arguments), dt = (typeof DT === "number" ? DT : 1/60);
    for(var i=0;i<charges.length;i++){ var c = charges[i]; if(c.fired || !c.host || !c.localPos) continue;
      var h = c.host;
      if(!h.dead && h.rb){ _cq.copy(c.localPos).applyQuaternion(h.Q).add(h.P); c.mesh.position.copy(_cq); c.vy7 = 0; }
      else { c.vy7 = (c.vy7 || 0) - 9.8*dt; c.mesh.position.y = Math.max(0.25, c.mesh.position.y + c.vy7*dt); if(c.mesh.position.y <= 0.25) c.vy7 = 0; }
      if(c.ghost) c.ghost.position.copy(c.mesh.position);
    }
    return r;
  };
  var pc10 = placeCharge;
  placeCharge = function(){ var n0 = charges.length, r = pc10.apply(this, arguments);
    for(var i = n0; i < charges.length; i++) if(charges[i].ghost) charges[i].ghost.visible = false;   // just the bomb, no red zone
    return r; };
