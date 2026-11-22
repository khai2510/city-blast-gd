// ---- gemart DOM runtime (src/gemart): keeps --gh = the element's height (px) on every skinned element, so the 9-slice
// pill caps of gemart.css stay round at any button height. View only; nothing when html.gem is off.
(function(){
  if(!document.documentElement.classList.contains("gem")) return;
  var SEL = "#settings .chead,.big.mint,.big.go,.big.sec,.big.cant,#inCard .inB,#result .card .big,.pillbtn,.pmRow,#meter,#rMeter,#mFill,#rmFill,#rTitle,.bhead";
  var ro = typeof ResizeObserver === "function" ? new ResizeObserver(function(es){ es.forEach(function(e){ set(e.target); }); }) : null, seen = typeof WeakSet === "function" ? new WeakSet() : null;
  function set(el){ var h = el.offsetHeight;   // layout height (a pop-in scale must not shrink the caps)
    if(h > 0) el.style.setProperty("--gh", Math.round(h*10)/10 + "px"); }
  function scan(){ var L = document.querySelectorAll(SEL); for(var i = 0; i < L.length; i++){ var el = L[i]; if(seen && seen.has(el)) continue; if(seen) seen.add(el); if(ro) ro.observe(el); set(el); } }
  var queued = false;
  function later(){ if(queued) return; queued = true; requestAnimationFrame(function(){ queued = false; scan(); }); }
  scan();
  if(typeof MutationObserver === "function") new MutationObserver(later).observe(document.body, { childList:true, subtree:true });
  if(!ro) setInterval(function(){ var L = document.querySelectorAll(SEL); for(var i = 0; i < L.length; i++) set(L[i]); }, 500);
  window.__gemart = { on:true, stats:function(){ var L = document.querySelectorAll(SEL), n = 0; for(var i = 0; i < L.length; i++) if(L[i].style.getPropertyValue("--gh")) n++; return { els:L.length, sized:n, sky:window.GEM_SKY || null }; } };
})();
