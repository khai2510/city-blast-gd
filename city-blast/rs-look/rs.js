// ---- rs-look (Mac, 22/11/2026): H2H Royal Smash visual layer. View only. ?rs=0 = off. API: window.__blast.rs
(function(){
  var Q = new URLSearchParams(location.search), H = document.documentElement;
  var ON = Q.get("rs") !== "0";
  // API: window.__blast is made later (main() runs after load), so attach when it appears
  var api = { on:function(){ return ON; }, v:"r3" }, tA = setInterval(function(){ if(window.__blast){ window.__blast.rs = api; clearInterval(tA); } }, 100);
  if(!ON) return;
  H.classList.add("rs");
  // R1 deck: the construction-site stand under the tray (foreground anchor, like a cannon dais). After #bottom in the DOM so
  // "#bottom:not(.hidden) ~ #rsDeck" shows it only in play.
  var deck = document.createElement("div"); deck.id = "rsDeck"; deck.setAttribute("aria-hidden", "true");
  deck.innerHTML = '<i class="rsTop"></i>';
  document.body.appendChild(deck);
  // R3 Reduce motion (OS or the game's own switch: save.reduce / html.rm) turns the R3 animations off
  var rm = function(){ var g = false; try{ g = !!(window.__blast.save().reduce || window.__blast.save().rm); }catch(e){}
    H.classList.toggle("rsRM", g || H.classList.contains("rm") || (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches)); };
  rm(); setInterval(rm, 2000);
  // R3 TNT count bump: the chip pops when its number changes
  var last = null;
  setInterval(function(){
    var c = document.querySelector("#chips .chip"), b = c && c.querySelector(".n b"); if(!b) return;
    var v = b.textContent; if(last !== null && v !== last){ c.classList.remove("rsBump"); void c.offsetWidth; c.classList.add("rsBump"); }
    last = v;
  }, 80);
})();
// ---- end rs-look
