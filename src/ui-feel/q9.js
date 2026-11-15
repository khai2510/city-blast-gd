// ---- ui-feel Q9 A LIVING HOME (H2H-DESIGN.md §5.1 Q9; appended after levels6/patch/v13-feel.js by ui-feel/build.js). CSS only,
// on the Home plate of the new UI: the hanging level sign sways +-2 degrees every 4 s, a taxi crosses every 8 s, two clouds drift
// at 6 screen px/s, Play breathes 1.00 <-> 1.04 every 1.6 s. Flag: __blast.feel.q9, ?feel=-q9. Off with reduced motion.
// PARTIAL until `design` cuts the Home plate into layers: the crane arm, the building and the parked taxi are baked into the one
// plate image, so the SIGN sways (not the arm), and the crossing taxi and the two clouds are simple drawn sprites laid over it.
try{ (function(){
  "use strict";
  var F = window.__blast.feel || (window.__blast.feel = {}), plate = document.getElementById("ulPlate"); if(!plate) return;
  var on = (typeof FEEL_DEFAULT === "undefined" ? "on" : FEEL_DEFAULT) !== "off", v = QS.get("feel");
  if(v != null && v !== ""){ var tok = v.toLowerCase().split(/[,\s]+/).filter(Boolean);
    if(tok[0] === "off" || tok[0] === "0") on = false; else if(tok[0] === "on" || tok[0] === "1") on = true; else if(tok.some(function(t){ return t[0] !== "-"; })) on = false;
    tok.forEach(function(t){ if(t.replace(/^[-+]/, "") === "q9") on = t[0] !== "-"; }); }
  F.q9 = on;
  var CLOUD = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 260 110'%3E%3Cpath d='M38 96a30 30 0 0 1 4-60a44 44 0 0 1 82-14a36 36 0 0 1 62 12a32 32 0 0 1 36 62z' fill='%23DDF0FF'/%3E%3Cpath d='M38 88a26 26 0 0 1 6-52a42 42 0 0 1 78-12a34 34 0 0 1 60 12a28 28 0 0 1 34 52z' fill='%23FFFFFF'/%3E%3C/svg%3E\")";
  var TAXI = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 170 84'%3E%3Cellipse cx='86' cy='76' rx='74' ry='7' fill='%23000' opacity='.18'/%3E%3Cpath d='M12 60V44q0-8 10-10l22-4l14-18q4-6 12-6h38q8 0 13 6l15 19l14 3q10 2 10 12v14q0 6-6 6H18q-6 0-6-6z' fill='%23FFC61A' stroke='%230E2466' stroke-width='5' stroke-linejoin='round'/%3E%3Cpath d='M52 30l10-13q2-3 6-3h14v16zM90 14h17q4 0 6 3l10 13H90z' fill='%239FDcff' stroke='%230E2466' stroke-width='4' stroke-linejoin='round'/%3E%3Cpath d='M14 46h142' stroke='%230E2466' stroke-width='7' stroke-dasharray='9 9'/%3E%3Crect x='70' y='0' width='30' height='9' rx='3' fill='%23FFF4DC' stroke='%230E2466' stroke-width='3'/%3E%3Ccircle cx='46' cy='64' r='13' fill='%232B2140' stroke='%230E2466' stroke-width='4'/%3E%3Ccircle cx='46' cy='64' r='5' fill='%23D9DCE6'/%3E%3Ccircle cx='126' cy='64' r='13' fill='%232B2140' stroke='%230E2466' stroke-width='4'/%3E%3Ccircle cx='126' cy='64' r='5' fill='%23D9DCE6'/%3E%3Ccircle cx='153' cy='42' r='4' fill='%23FFF4DC'/%3E%3C/svg%3E\")";
  var css = [
    ".fq9c,.fq9t{display:none;pointer-events:none;background:center/contain no-repeat;will-change:transform}",
    "body.fq9 .fq9c,body.fq9 .fq9t{display:block}",
    // clouds: plate px; 6 screen px/s = 6/--ups plate px/s (the duration is set from the plate scale in JS)
    ".fq9c{left:0;width:250px;height:106px;opacity:.92;animation:fq9Drift var(--fq9-d,90s) linear infinite}",
    "#fq9c1{top:268px}",
    "#fq9c2{top:86px;width:190px;height:80px;opacity:.85;animation-duration:calc(var(--fq9-d,90s)*1.25);animation-delay:calc(var(--fq9-d,90s)*-.55)}",
    "#fq9c1{animation-delay:calc(var(--fq9-d,90s)*-.2)}",
    "@keyframes fq9Drift{from{transform:translateX(-270px)}to{transform:translateX(880px)}}",
    // the hanging sign: +-2 degrees round its hooks, 4 s
    "body.fq9 #ulSign{transform-origin:50% -34px;animation:fq9Sign 4s ease-in-out infinite}",
    "@keyframes fq9Sign{0%,100%{transform:rotate(6deg)}50%{transform:rotate(10deg)}}",
    // the taxi: down the near lane of the road, one pass in 3.2 s, every 8 s
    ".fq9t{left:0;top:0;width:150px;height:74px;animation:fq9Taxi 8s linear infinite}",
    "@keyframes fq9Taxi{0%{transform:translate(-120px,1050px) rotate(14.4deg)}40%{transform:translate(880px,1307px) rotate(14.4deg)}100%{transform:translate(880px,1307px) rotate(14.4deg)}}",
    // Play breathes 1.00 <-> 1.04, 1.6 s
    "html body.fq9 #play#play.home{animation:fq9Play 1.6s ease-in-out infinite}",
    "@keyframes fq9Play{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}",
    "html body.fq9 #play#play.home:active{animation:none}",
    "html.rm .fq9c,html.rm .fq9t,html.rm body.fq9 #ulSign,html.rm body.fq9 #play#play.home{animation:none!important}",
    "html.rm .fq9t{display:none!important}",
    "@media (prefers-reduced-motion:reduce){.fq9c,.fq9t,body.fq9 #ulSign,html body.fq9 #play#play.home{animation:none!important}.fq9t{display:none!important}}"
  ].join("\n");
  var s = document.createElement("style"); s.id = "feelQ9Css"; s.textContent = css; document.head.appendChild(s);
  var mk = function(id, cls, bg){ var d = document.createElement("div"); d.id = id; d.className = cls; d.setAttribute("aria-hidden", "true"); d.style.backgroundImage = bg; return d; };
  var first = plate.firstChild, c1 = mk("fq9c1", "fq9c", CLOUD), c2 = mk("fq9c2", "fq9c", CLOUD), tx = mk("fq9t", "fq9t", TAXI);
  plate.insertBefore(c2, first); plate.insertBefore(c1, first);     // behind the logo, the bubbles and the sign
  var mile = document.getElementById("hMile"); plate.insertBefore(tx, mile || null);   // behind the milestone pill and Play
  function speed(){ var k = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--ups")) || 0.45; plate.style.setProperty("--fq9-d", (1150*k/6).toFixed(1) + "s"); }
  function apply(){ document.body.classList.toggle("fq9", !!F.q9); speed(); }
  addEventListener("resize", function(){ setTimeout(speed, 80); });
  apply();
  if(window.__blast.feelApi){ var a0 = window.__blast.feelApi.apply; window.__blast.feelApi.apply = function(){ apply(); return a0 ? a0.apply(this, arguments) : null; }; if(window.__blast.feelApi.keys) window.__blast.feelApi.keys.push("q9"); }
  else window.__blast.feelApi = { apply:apply, keys:["q9"] };
})(); }catch(e){ console.error("FEEL Q9", e); }
// ---- end ui-feel Q9
