/* Page behaviour: nav state, mobile menu, language switch, layer accordion,
   show-of-hands toggles, self-referential QR, scroll reveals, footer year. */

(function () {
  "use strict";

  var nav = document.getElementById("nav");
  var navLinks = document.getElementById("navLinks");
  var menuToggle = document.getElementById("menuToggle");

  /* nav shadow on scroll */
  function onScroll() { nav.setAttribute("data-scrolled", String(window.scrollY > 8)); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* mobile menu */
  function closeMenu() {
    navLinks.removeAttribute("data-open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
  menuToggle.addEventListener("click", function () {
    var open = navLinks.getAttribute("data-open") === "true";
    if (open) closeMenu();
    else { navLinks.setAttribute("data-open", "true"); menuToggle.setAttribute("aria-expanded", "true"); }
  });
  navLinks.addEventListener("click", function (e) { if (e.target.tagName === "A") closeMenu(); });
  window.addEventListener("resize", function () { if (window.innerWidth > 720) closeMenu(); });

  /* language switch */
  if (typeof window.applyLang === "function") {
    document.querySelectorAll(".langs button").forEach(function (b) {
      b.addEventListener("click", function () { window.applyLang(b.dataset.lang); });
    });
    window.applyLang(window.initialLang ? window.initialLang() : "en");
  }

  /* layer accordion */
  var layers = Array.prototype.slice.call(document.querySelectorAll("#stack .layer"));
  layers.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") === "true";
      layers.forEach(function (o) { o.setAttribute("aria-expanded", "false"); });
      btn.setAttribute("aria-expanded", String(!open));
    });
  });

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
        text: url,
        width: 156,
        height: 156,
        colorDark: "#0b0d10",
        colorLight: "#ffffff",
        correctLevel: window.QRCode.CorrectLevel ? window.QRCode.CorrectLevel.M : 0
      });
    } catch (e) { qrEl.textContent = ""; }
  }

  /* scroll reveals */
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealables = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    revealables.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("in"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealables.forEach(function (el) { io.observe(el); });
  }

  /* footer year */
  var y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());
})();
