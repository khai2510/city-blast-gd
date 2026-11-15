// ---- main/studio.js: HitMaker Studio card (Owner 15/11/2026 "tạo màn splash cho tên này"). Put right after <body> by
// main/studio-patch.js, before every game script, so it is the first thing painted. The game is NOT edited.
//   - cold start only: the card is in the page once and removes itself; returning from a level never shows it again.
//   - shown at least MIN ms (counted from when the card is first on screen; on iOS the native launch screen shows the
//     same picture before it, see native/ios/App/App/Base.lproj/LaunchScreen.storyboard), and it never waits for
//     anything but the game: it leaves as soon as MIN has passed AND the game is ready (window.__blast + SETTLE ms for
//     the Home's own layout passes; on iOS also the boot gate has revealed the page + NATIVE_HOLD ms for the splash fade).
//   - a tap before "ready" does nothing (the card swallows it); after "ready" a tap leaves at once.
//   - CAP: leaves whatever happens (an engine that never boots shows its own error underneath).
//   - no sound. Web: logo fades / scales in (none with Reduce motion). iOS: logo already in place (= launch screen).
//   - ?studio=0 = no card at all.  window.__studio = timings for tests (main/check-main.js ONLY=studio).
(function () {
  'use strict';
  var MIN = 1200, SETTLE = 300, NATIVE_HOLD = 250, CAP = 20000, FADE = 320;
  var el = document.getElementById('hmStudio'), de = document.documentElement;
  var S = window.__studio = { on: true, native: false, shownAt: performance.now(), gameAt: 0, gateAt: 0, readyAt: 0, leftAt: 0, goneAt: 0, why: '', taps: 0, early: 0 };
  if (!el) { S.on = false; return; }
  if (/[?&]studio=0(&|$)/.test(location.search)) { S.on = false; el.parentNode.removeChild(el); de.classList.remove('hmS'); return; }
  var G = window.__bootGate, nat = S.native = !!(G && G.on);
  var still = nat;
  try { still = still || matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  el.className = still ? 'still' : 'anim';
  var seenGame = 0, seenGate = 0;
  function leave(why) {
    if (S.leftAt) return;
    S.leftAt = performance.now(); S.why = why;
    el.classList.add('out');
    el.style.pointerEvents = 'none';
    setTimeout(function () {
      if (el.parentNode) el.parentNode.removeChild(el);
      de.classList.remove('hmS');
      S.goneAt = performance.now();
      try { window.dispatchEvent(new Event('studiodone')); } catch (e) {}
    }, FADE + 40);
  }
  function ready(now) {
    if (!seenGame && window.__blast) seenGame = S.gameAt = now;
    if (nat && !seenGate && G.revealedAt > 0) seenGate = S.gateAt = now;
    var ok = seenGame && now - seenGame >= SETTLE && (!nat || (seenGate && now - seenGate >= NATIVE_HOLD));
    if (ok && !S.readyAt) S.readyAt = now;
    return ok;
  }
  el.addEventListener('pointerdown', function () { S.taps++; if (S.readyAt) leave('tap'); else S.early++; });
  function tick() {
    if (S.leftAt) return;
    var now = performance.now();
    if (now - S.shownAt > CAP) return leave('cap');
    if (ready(now) && now - S.shownAt >= MIN) return leave('ready');
  }
  function frame() { tick(); if (!S.leftAt) requestAnimationFrame(frame); }
  requestAnimationFrame(frame);
  var iv = setInterval(function () { tick(); if (S.leftAt) clearInterval(iv); }, 120);   // rAF is paused in a hidden tab
})();
