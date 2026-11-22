  // ---- rs-look in main() (Mac 22/11): R2 warm lot. Cream / stone heroes stood on a cream lot (low value contrast, H2H Royal Smash:
  // warm ground, light objects). The lot texture is a little darker and more neutral (value contrast for cream AND orange heroes; a warm tint sank the L1 windmill); nothing else. ?rs=0 = off. ?rslot=<r,g,b> to try.
  (function(){
    var Qr = new URLSearchParams(location.search); if(Qr.get("rs") === "0") return;
    try{ var t = (Qr.get("rslot") || "0.84,0.80,0.74").split(",").map(Number); if(lot && lot.material && lot.material.color) lot.material.color.setRGB(t[0], t[1], t[2]); }
    catch(e){ console.error("rs-look lot", e); }
  })();
  // ---- end rs-look main
