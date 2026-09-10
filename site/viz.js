/* Inline three.js visualisations for two slides:
   - #viz-layers : a 3D stack of the four software layers, binary at the base,
                   with particles rising through them.
   - #viz-loop   : the observe -> think -> act cycle as a tilted 3D ring with a
                   pulse travelling around it.
   Each runs only while its slide is the active one (app.js sets [data-active]
   and fires "deck:change"), pauses when the tab is hidden, and renders a
   single still frame when the user prefers reduced motion. */

(function () {
  if (typeof THREE === "undefined") return;

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var css = getComputedStyle(document.documentElement);
  var cvar = function (name, fb) { return (css.getPropertyValue(name) || fb).trim() || fb; };
  var ACCENT = new THREE.Color(cvar("--accent", "#4da2ff"));
  var INK = new THREE.Color(cvar("--ink", "#fbfaf9"));
  var LINE = new THREE.Color(cvar("--line-2", "#34353f"));

  function labelSprite(text, opts) {
    opts = opts || {};
    var fs = 46, pad = 18;
    var c = document.createElement("canvas");
    var g = c.getContext("2d");
    var font = "600 " + fs + 'px "JetBrains Mono", ui-monospace, monospace';
    g.font = font;
    var w = Math.ceil(g.measureText(text).width) + pad * 2;
    var h = fs + pad * 2;
    c.width = w; c.height = h;
    g.font = font;
    g.textAlign = "center"; g.textBaseline = "middle";
    g.fillStyle = opts.color || "#fbfaf9";
    g.fillText(text, w / 2, h / 2 + 2);
    var tex = new THREE.CanvasTexture(c);
    tex.minFilter = THREE.LinearFilter;
    var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
    var s = opts.scale || 0.5;
    sp.scale.set(s * (w / h), s, 1);
    return sp;
  }

  function mount(id, build) {
    var canvas = document.getElementById(id);
    if (!canvas) return;
    var slide = canvas.closest(".slide");
    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
    } catch (e) { return; }
    renderer.setClearColor(0x000000, 0);

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    var step = build(scene, camera) || function () {};

    var raf = 0, last = 0, active = false, sized = false, retry = 0;

    function resize() {
      var w = canvas.clientWidth, h = canvas.clientHeight;
      if (!w || !h) { sized = false; return; }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      sized = true;
    }

    function frame(now) {
      if (!active) return;
      var dt = Math.min(0.05, (now - last) / 1000); last = now;
      step(dt, now);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    }

    function tick() {
      var on = slide && slide.hasAttribute("data-active");
      if (on && !active) {
        if (!sized) resize();
        if (!sized) { clearTimeout(retry); retry = setTimeout(tick, 250); return; }
        clearTimeout(retry);
        if (reduce) {
          for (var i = 0; i < 40; i++) step(0.05, i * 50);
          renderer.render(scene, camera);
        } else {
          active = true; last = performance.now(); raf = requestAnimationFrame(frame);
        }
      } else if (!on && active) {
        active = false;
        if (raf) cancelAnimationFrame(raf);
      }
    }

    window.addEventListener("deck:change", tick);
    document.addEventListener("visibilitychange", tick);
    window.addEventListener("load", function () { sized = false; tick(); });
    window.addEventListener("resize", function () {
      sized = false;
      if (active) { resize(); } else { tick(); }
    });
    tick();
  }

  /* ---- scene: four layers ---- */
  mount("viz-layers", function (scene, camera) {
    camera.position.set(0, 0.6, 8);
    var g = new THREE.Group();
    g.rotation.x = -0.34;
    scene.add(g);

    var NAMES = ["BINARY", "LOW-LEVEL", "HIGH-LEVEL", "VIBE-CODING"];
    for (var i = 0; i < 4; i++) {
      var y = (i - 1.5) * 1.2;
      var t = i / 3;
      var geo = new THREE.BoxGeometry(3.6, 0.92, 0.05);
      var fill = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.04 + t * 0.05 }));
      fill.position.y = y;
      var edge = new THREE.LineSegments(new THREE.EdgesGeometry(geo),
        new THREE.LineBasicMaterial({ color: i === 3 ? ACCENT : LINE, transparent: true, opacity: 0.3 + t * 0.5 }));
      edge.position.y = y;
      var lab = labelSprite(NAMES[i], { color: i >= 2 ? "#fbfaf9" : "#9d9db2", scale: 0.4 });
      lab.position.set(0, y, 0.2);
      g.add(fill, edge, lab);
    }

    var N = 150;
    var pos = new Float32Array(N * 3);
    function seed(k, y) {
      pos[k * 3] = (Math.random() - 0.5) * 3.2;
      pos[k * 3 + 1] = y == null ? -3.2 - Math.random() * 1.5 : y;
      pos[k * 3 + 2] = (Math.random() - 0.5) * 1.1;
    }
    for (var k = 0; k < N; k++) seed(k, -3.4 + Math.random() * 6.8);
    var pgeo = new THREE.BufferGeometry();
    pgeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    var pts = new THREE.Points(pgeo, new THREE.PointsMaterial({
      color: ACCENT, size: 0.05, transparent: true, opacity: 0.9, depthWrite: false, blending: THREE.AdditiveBlending
    }));
    g.add(pts);

    return function (dt, t) {
      g.rotation.y = Math.sin(t * 0.00018) * 0.5;
      for (var k = 0; k < N; k++) {
        pos[k * 3 + 1] += dt * 1.3;
        if (pos[k * 3 + 1] > 3.3) seed(k, -3.3);
      }
      pgeo.attributes.position.needsUpdate = true;
    };
  });

  /* ---- scene: observe / think / act loop ---- */
  mount("viz-loop", function (scene, camera) {
    camera.position.set(0, 0.15, 7.1);
    var g = new THREE.Group();
    g.position.y = 0.45;
    scene.add(g);
    var tilt = new THREE.Group();
    tilt.rotation.x = -1.02;
    g.add(tilt);

    var R = 2.0;
    tilt.add(new THREE.Mesh(
      new THREE.TorusGeometry(R, 0.014, 10, 140),
      new THREE.MeshBasicMaterial({ color: LINE })
    ));

    var LAB = ["OBSERVE", "THINK", "ACT"];
    for (var i = 0; i < 3; i++) {
      var a = -Math.PI / 2 + i * (Math.PI * 2 / 3);
      var x = Math.cos(a) * R, y = Math.sin(a) * R;
      tilt.add(new THREE.Mesh(new THREE.SphereGeometry(0.14, 20, 20),
        new THREE.MeshBasicMaterial({ color: ACCENT })).translateX(x).translateY(y));
      tilt.add(new THREE.Mesh(new THREE.SphereGeometry(0.28, 18, 18),
        new THREE.MeshBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.09 })).translateX(x).translateY(y));
      var lab = labelSprite(LAB[i], { color: "#fbfaf9", scale: 0.4 });
      lab.position.set(x * 1.26, y * 1.26, 0.3);
      tilt.add(lab);
    }

    var pulse = new THREE.Mesh(new THREE.SphereGeometry(0.085, 16, 16), new THREE.MeshBasicMaterial({ color: INK }));
    var trail = new THREE.Mesh(new THREE.SphereGeometry(0.17, 16, 16),
      new THREE.MeshBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.25, depthWrite: false }));
    tilt.add(pulse, trail);

    return function (dt, t) {
      g.rotation.y = Math.sin(t * 0.00028) * 0.34;
      var a = (t * 0.0011) % (Math.PI * 2);
      pulse.position.set(Math.cos(-Math.PI / 2 + a) * R, Math.sin(-Math.PI / 2 + a) * R, 0);
      var b = a - 0.3;
      trail.position.set(Math.cos(-Math.PI / 2 + b) * R, Math.sin(-Math.PI / 2 + b) * R, 0);
    };
  });
})();
