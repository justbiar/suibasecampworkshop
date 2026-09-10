/* Hero animation: bits rising through four layers into a single bright node.
   Bottom = binary noise; as points rise they converge and brighten, ending at
   the "agent" core. Decoration only — one static frame when motion is reduced
   or WebGL is unavailable. */

(function () {
  var canvas = document.getElementById("scene");
  if (!canvas || typeof THREE === "undefined") return;

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var small = window.matchMedia && window.matchMedia("(max-width: 720px)").matches;

  var BLUE = new THREE.Color("#1e3a5f");
  var CYAN = new THREE.Color("#4da2ff");
  var WHITE = new THREE.Color("#dff1ff");

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
  } catch (e) { return; }
  renderer.setClearColor(0x000000, 0);

  var scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x05060a, 0.09);

  var camera = new THREE.PerspectiveCamera(46, 1, 0.1, 100);
  camera.position.set(0, 0.4, 7.2);

  var group = new THREE.Group();
  scene.add(group);

  var TOP = 2.6;    // agent core height
  var BOTTOM = -3.8;

  /* --- four layer lines --- */
  var lineYs = [-3.0, -1.3, 0.4, 2.0];
  var lg = new THREE.BufferGeometry();
  var lp = [];
  lineYs.forEach(function (y) { lp.push(-6, y, 0, 6, y, 0); });
  lg.setAttribute("position", new THREE.BufferAttribute(new Float32Array(lp), 3));
  var lines = new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: CYAN, transparent: true, opacity: 0.12 }));
  group.add(lines);

  /* --- agent core --- */
  var core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.5, 1),
    new THREE.MeshBasicMaterial({ color: CYAN, wireframe: true, transparent: true, opacity: 0.95 })
  );
  core.position.y = TOP;
  group.add(core);
  var halo = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.78, 1),
    new THREE.MeshBasicMaterial({ color: CYAN, wireframe: true, transparent: true, opacity: 0.14 })
  );
  halo.position.y = TOP;
  group.add(halo);

  /* --- rising streams --- */
  var N = small ? 520 : 1400;
  var pos = new Float32Array(N * 3);
  var col = new Float32Array(N * 3);
  var spd = new Float32Array(N);
  var wob = new Float32Array(N);
  var tmp = new THREE.Color();

  function spawn(i, initialY) {
    var ix = i * 3;
    pos[ix] = (Math.random() - 0.5) * 9;
    pos[ix + 1] = initialY != null ? initialY : BOTTOM - Math.random() * 1.5;
    pos[ix + 2] = (Math.random() - 0.5) * 4 - 0.5;
    spd[i] = 0.5 + Math.random() * 1.4;
    wob[i] = Math.random() * Math.PI * 2;
  }
  for (var k = 0; k < N; k++) spawn(k, BOTTOM + Math.random() * (TOP - BOTTOM));

  var geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
  var streams = new THREE.Points(geo, new THREE.PointsMaterial({
    size: small ? 0.05 : 0.042, sizeAttenuation: true, vertexColors: true,
    transparent: true, opacity: 0.95, depthWrite: false, blending: THREE.AdditiveBlending
  }));
  group.add(streams);

  function step(dt, now) {
    for (var i = 0; i < N; i++) {
      var ix = i * 3, iy = ix + 1, iz = ix + 2;
      pos[iy] += spd[i] * dt * 0.55;
      var h = (pos[iy] - BOTTOM) / (TOP - BOTTOM); // 0 bottom -> 1 top
      if (pos[iy] > TOP) { spawn(i, BOTTOM - Math.random()); continue; }
      // converge toward the center column as they climb
      var pull = Math.min(1, h * h);
      pos[ix] += (0 - pos[ix]) * pull * dt * 1.6;
      pos[iz] += (-0.5 - pos[iz]) * pull * dt * 1.6;
      // gentle horizontal wobble, fading near the top
      pos[ix] += Math.sin(now * 0.001 + wob[i]) * (1 - h) * dt * 0.9;
      // colour: dim blue low, cyan mid, white near the core
      var c = h < 0.6 ? h / 0.6 : 1;
      tmp.copy(BLUE).lerp(CYAN, c);
      if (h > 0.7) tmp.lerp(WHITE, (h - 0.7) / 0.3);
      var fade = Math.min(1, h * 3) * Math.min(1, (1 - h) * 6 + 0.35);
      col[ix] = tmp.r * fade; col[iy] = tmp.g * fade; col[iz] = tmp.b * fade;
    }
    geo.attributes.position.needsUpdate = true;
    geo.attributes.color.needsUpdate = true;
  }

  /* --- interaction + sizing --- */
  var tmx = 0, tmy = 0, mx = 0, my = 0;
  window.addEventListener("pointermove", function (ev) {
    tmx = (ev.clientX / window.innerWidth - 0.5) * 2;
    tmy = (ev.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  function resize() {
    var w = canvas.clientWidth || window.innerWidth;
    var h = canvas.clientHeight || window.innerHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize);
  resize();

  var last = performance.now();
  var running = true;
  var raf;

  function frame(now) {
    if (!running) return;
    var dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    step(dt, now);
    group.rotation.y = Math.sin(now * 0.00013) * 0.18;

    var pulse = 1 + Math.sin(now * 0.003) * 0.06;
    core.scale.setScalar(pulse);
    halo.scale.setScalar(pulse * 1.04);
    core.rotation.y += dt * 0.4;
    halo.rotation.y -= dt * 0.25;

    mx += (tmx - mx) * 0.04; my += (tmy - my) * 0.04;
    camera.position.x = mx * 0.7;
    camera.position.y = 0.4 - my * 0.4;
    camera.lookAt(0, 0.3, 0);

    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  }

  if (reduce) {
    for (var s = 0; s < 60; s++) step(0.05, s * 50);
    renderer.render(scene, camera);
  } else {
    raf = requestAnimationFrame(frame);
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) { running = false; if (raf) cancelAnimationFrame(raf); }
      else if (!running) { running = true; last = performance.now(); raf = requestAnimationFrame(frame); }
    });
  }
})();
