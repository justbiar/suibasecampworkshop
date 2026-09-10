/* Persistent background behind the whole deck: a low wireframe skyline on the
   horizon, data rising off it, and an "agent" core hanging above the city that
   brightens as you move through the slides. One WebGL context, always animating
   (throttled by the browser when the tab is hidden), one still frame under
   reduced motion. */

(function () {
  var canvas = document.getElementById("bg");
  if (!canvas || typeof THREE === "undefined") return;

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var css = getComputedStyle(document.documentElement);
  var cvar = function (n, fb) { return (css.getPropertyValue(n) || fb).trim() || fb; };
  var ACCENT = new THREE.Color(cvar("--accent", "#4da2ff"));
  var ACC2 = new THREE.Color(cvar("--accent-2", "#6ee7c7"));
  var DIM = new THREE.Color("#1e2a44");

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
  } catch (e) { return; }
  renderer.setClearColor(0x000000, 0);

  var scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x05060a, 0.05);

  var camera = new THREE.PerspectiveCamera(50, 1, 0.1, 120);
  camera.position.set(0, 2.4, 15);

  var world = new THREE.Group();
  scene.add(world);

  /* --- skyline --- */
  var city = new THREE.Group();
  city.position.y = -3.2;
  world.add(city);

  var COLS = 26;
  for (var i = 0; i < COLS; i++) {
    var w = 0.7 + Math.random() * 0.8;
    var d = 0.7 + Math.random() * 0.8;
    var h = 1.6 + Math.pow(Math.random(), 1.6) * 8.5;
    var geo = new THREE.BoxGeometry(w, h, d);
    var x = (i - COLS / 2) * 1.5 + (Math.random() - 0.5);
    var z = -4 - Math.random() * 7;
    var edge = new THREE.LineSegments(
      new THREE.EdgesGeometry(geo),
      new THREE.LineBasicMaterial({ color: DIM, transparent: true, opacity: 0.5 })
    );
    edge.position.set(x, h / 2, z);
    var fill = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0x05060a, transparent: true, opacity: 0.55 }));
    fill.position.copy(edge.position);
    city.add(fill, edge);
    // a lit window band near the top of some towers
    if (Math.random() > 0.45) {
      var band = new THREE.Mesh(
        new THREE.PlaneGeometry(w * 0.9, 0.12),
        new THREE.MeshBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.5 })
      );
      band.position.set(x, h - 0.5 - Math.random() * 2, z + d / 2 + 0.001);
      city.add(band);
    }
  }

  var grid = new THREE.GridHelper(80, 40, DIM.getHex(), DIM.getHex());
  grid.material.transparent = true;
  grid.material.opacity = 0.12;
  grid.position.y = -3.2;
  world.add(grid);

  /* --- agent core above the city --- */
  var core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.1, 1),
    new THREE.MeshBasicMaterial({ color: ACCENT, wireframe: true, transparent: true, opacity: 0.4 })
  );
  core.position.set(0, 5.5, -1);
  world.add(core);
  var coreHalo = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.7, 1),
    new THREE.MeshBasicMaterial({ color: ACC2, wireframe: true, transparent: true, opacity: 0.08 })
  );
  coreHalo.position.copy(core.position);
  world.add(coreHalo);

  /* --- data rising off the city --- */
  var N = 520;
  var pos = new Float32Array(N * 3);
  var spd = new Float32Array(N);
  function seed(k, y) {
    pos[k * 3] = (Math.random() - 0.5) * 34;
    pos[k * 3 + 1] = y == null ? -3 + Math.random() * 0.5 : y;
    pos[k * 3 + 2] = -3 - Math.random() * 9;
    spd[k] = 0.4 + Math.random() * 1.3;
  }
  for (var k = 0; k < N; k++) seed(k, -3 + Math.random() * 12);
  var pgeo = new THREE.BufferGeometry();
  pgeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  var pts = new THREE.Points(pgeo, new THREE.PointsMaterial({
    color: ACCENT, size: 0.045, sizeAttenuation: true, transparent: true, opacity: 0.7,
    depthWrite: false, blending: THREE.AdditiveBlending
  }));
  world.add(pts);

  /* --- interaction + progress --- */
  var mood = 0, moodTarget = 0;
  window.addEventListener("deck:change", function (e) {
    var i = (e.detail && e.detail.index) || 0;
    var slides = document.querySelectorAll(".slide").length || 20;
    moodTarget = i / (slides - 1);
  });

  var tmx = 0, tmy = 0, mx = 0, my = 0;
  window.addEventListener("pointermove", function (ev) {
    tmx = (ev.clientX / window.innerWidth - 0.5) * 2;
    tmy = (ev.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  function resize() {
    var w = window.innerWidth, h = window.innerHeight;
    if (!w || !h) return;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize);
  resize();

  function step(dt, t) {
    mood += (moodTarget - mood) * Math.min(1, dt * 2);

    for (var k = 0; k < N; k++) {
      pos[k * 3 + 1] += spd[k] * dt * (0.7 + mood * 0.8);
      if (pos[k * 3 + 1] > 11) seed(k, -3);
    }
    pgeo.attributes.position.needsUpdate = true;
    pts.material.opacity = 0.55 + mood * 0.3;

    world.rotation.y = Math.sin(t * 0.00006) * 0.22 + mx * 0.12;
    world.rotation.x = -0.02 + my * 0.04;

    var pulse = 1 + Math.sin(t * 0.0022) * 0.05;
    var grow = 1 + mood * 0.7;
    core.scale.setScalar(pulse * grow);
    coreHalo.scale.setScalar(pulse * grow * 1.05);
    core.rotation.y += dt * (0.15 + mood * 0.35);
    core.rotation.x += dt * 0.05;
    coreHalo.rotation.y -= dt * 0.1;
    core.material.opacity = 0.32 + mood * 0.4;
    coreHalo.material.opacity = 0.06 + mood * 0.12;

    mx += (tmx - mx) * 0.03;
    my += (tmy - my) * 0.03;
    camera.position.x = mx * 1.4;
    camera.position.y = 2.4 - my * 0.8;
    camera.lookAt(0, 2.6, -1);
  }

  var last = performance.now();
  var raf;
  function frame(now) {
    var dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    step(dt, now);
    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  }

  if (reduce) {
    for (var s = 0; s < 90; s++) step(0.05, s * 50);
    renderer.render(scene, camera);
  } else {
    raf = requestAnimationFrame(frame);
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) { if (raf) cancelAnimationFrame(raf); raf = 0; }
      else if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); }
    });
  }
})();
