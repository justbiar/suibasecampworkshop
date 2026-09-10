/* Slide-deck controller: arrow keys, on-screen arrows, wheel, swipe, deep links.
   Plus language switch, show-of-hands toggles, and the self-referential QR. */

(function () {
  "use strict";

  var deck = document.getElementById("deck");
  var track = document.getElementById("track");
  var slides = Array.prototype.slice.call(document.querySelectorAll(".slide"));
  var n = slides.length;
  var counter = document.getElementById("counter");
  var progress = document.getElementById("progress");
  var prevBtn = document.getElementById("prev");
  var nextBtn = document.getElementById("next");
  var qrOverlay = document.getElementById("qrOverlay");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var index = 0;
  var supportsInert = "inert" in HTMLElement.prototype;

  function pad(x) { return (x < 9 ? "0" : "") + (x + 1); }

  function slideW() {
    return deck.clientWidth || document.documentElement.clientWidth || window.innerWidth || 0;
  }

  function render(animate) {
    if (!animate) {
      track.classList.add("no-anim");
      track.style.transform = "translateX(" + (-index * slideW()) + "px)";
      void track.offsetWidth; // flush the jump before re-enabling the transition
      track.classList.remove("no-anim");
    } else {
      track.style.transform = "translateX(" + (-index * slideW()) + "px)";
    }

    counter.textContent = pad(index) + " / " + n;
    progress.style.width = (index / (n - 1)) * 100 + "%";
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === n - 1;

    slides.forEach(function (s, k) {
      var hidden = k !== index;
      s.setAttribute("aria-hidden", String(hidden));
      if (supportsInert) s.inert = hidden;
    });

    try { history.replaceState(null, "", "#" + (index + 1)); } catch (e) {}
  }

  function go(i, animate) {
    i = Math.max(0, Math.min(n - 1, i));
    if (i === index) return;
    index = i;
    render(animate !== false && !reduce);
  }
  var next = function () { go(index + 1); };
  var prev = function () { go(index - 1); };

  var rzT;
  function reflow() { clearTimeout(rzT); rzT = setTimeout(function () { render(false); }, 60); }
  window.addEventListener("resize", reflow);
  window.addEventListener("orientationchange", reflow);
  window.addEventListener("load", reflow);
  document.addEventListener("visibilitychange", function () { if (!document.hidden) reflow(); });

  nextBtn.addEventListener("click", next);
  prevBtn.addEventListener("click", prev);
  document.getElementById("brandHome").addEventListener("click", function () { go(0); });

  document.querySelectorAll("[data-goto]").forEach(function (b) {
    b.addEventListener("click", function () { go(parseInt(b.dataset.goto, 10) - 1); });
  });

  /* keyboard */
  document.addEventListener("keydown", function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var t = e.target;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
    if (e.key === "Escape") { if (!qrOverlay.hidden) { qrOverlay.hidden = true; e.preventDefault(); } return; }
    if (e.key === "q" || e.key === "Q") { qrOverlay.hidden = !qrOverlay.hidden; e.preventDefault(); return; }
    switch (e.key) {
      case "ArrowRight": case "PageDown": next(); e.preventDefault(); break;
      case "ArrowLeft": case "PageUp": prev(); e.preventDefault(); break;
      case " ": (e.shiftKey ? prev() : next()); e.preventDefault(); break;
      case "Home": go(0); e.preventDefault(); break;
      case "End": go(n - 1); e.preventDefault(); break;
      case "f": case "F":
        if (!document.fullscreenElement && document.documentElement.requestFullscreen) document.documentElement.requestFullscreen();
        else if (document.exitFullscreen) document.exitFullscreen();
        break;
    }
  });

  /* wheel — one step per gesture */
  var wheelLock = false, wheelAccum = 0;
  document.getElementById("deck").addEventListener("wheel", function (e) {
    var d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    // let a genuinely scrolling tall slide scroll vertically first
    var inner = slides[index];
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && inner.scrollHeight > inner.clientHeight + 4) {
      var atTop = inner.scrollTop <= 0, atBottom = inner.scrollTop + inner.clientHeight >= inner.scrollHeight - 1;
      if (!(d < 0 && atTop) && !(d > 0 && atBottom)) return;
    }
    e.preventDefault();
    if (wheelLock) return;
    wheelAccum += d;
    if (Math.abs(wheelAccum) < 40) return;
    (wheelAccum > 0 ? next() : prev());
    wheelAccum = 0;
    wheelLock = true;
    setTimeout(function () { wheelLock = false; }, 620);
  }, { passive: false });

  /* touch / pointer swipe */
  var sx = 0, sy = 0, tracking = false;
  var deck = document.getElementById("deck");
  deck.addEventListener("pointerdown", function (e) {
    if (e.pointerType === "mouse") return;
    sx = e.clientX; sy = e.clientY; tracking = true;
  }, { passive: true });
  deck.addEventListener("pointerup", function (e) {
    if (!tracking) return;
    tracking = false;
    var dx = e.clientX - sx, dy = e.clientY - sy;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.4) (dx < 0 ? next() : prev());
  }, { passive: true });

  /* language switch */
  if (typeof window.applyLang === "function") {
    document.querySelectorAll(".langs button").forEach(function (b) {
      b.addEventListener("click", function () { window.applyLang(b.dataset.lang); });
    });
    window.applyLang(window.initialLang ? window.initialLang() : "en");
  }

  /* show of hands */
  document.querySelectorAll(".hand").forEach(function (h) {
    h.addEventListener("click", function () {
      h.setAttribute("aria-pressed", String(h.getAttribute("aria-pressed") !== "true"));
    });
  });

  /* self-referential QR */
  var qrEl = document.getElementById("qr");
  var qrUrlEl = document.getElementById("qrUrl");
  var url = location.href.split("#")[0].split("?")[0];
  if (qrUrlEl) qrUrlEl.textContent = url.replace(/^https?:\/\//, "");
  if (qrEl && typeof window.QRCode === "function") {
    try {
      new window.QRCode(qrEl, {
        text: url, width: 148, height: 148,
        colorDark: "#0b0d10", colorLight: "#ffffff",
        correctLevel: window.QRCode.CorrectLevel ? window.QRCode.CorrectLevel.M : 0
      });
    } catch (e) { qrEl.textContent = ""; }
  }

  /* QR overlay — reachable from every slide via the QR button or the Q key */
  var qrBigUrlEl = document.getElementById("qrBigUrl");
  if (qrBigUrlEl) qrBigUrlEl.textContent = url.replace(/^https?:\/\//, "");
  var qrBig = document.getElementById("qrBig");
  if (qrBig && typeof window.QRCode === "function") {
    try {
      new window.QRCode(qrBig, {
        text: url, width: 264, height: 264,
        colorDark: "#0b0d10", colorLight: "#ffffff",
        correctLevel: window.QRCode.CorrectLevel ? window.QRCode.CorrectLevel.M : 0
      });
    } catch (e) {}
  }
  document.getElementById("qrBtn").addEventListener("click", function () { qrOverlay.hidden = false; });
  document.getElementById("qrClose").addEventListener("click", function () { qrOverlay.hidden = true; });
  qrOverlay.addEventListener("click", function (e) { if (e.target === qrOverlay) qrOverlay.hidden = true; });

  /* deep link + init */
  function fromHash() {
    var h = parseInt((location.hash || "").replace("#", ""), 10);
    return h >= 1 && h <= n ? h - 1 : null;
  }
  window.addEventListener("hashchange", function () {
    var i = fromHash();
    if (i !== null && i !== index) { index = i; render(!reduce); }
  });

  var start = fromHash();
  if (start !== null) index = start;
  render(false);
})();
