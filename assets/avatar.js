/*
 * Sonu's procedural studio avatar. No remote models, images, or runtime dependencies.
 * Build: npm run build
 * Three.js is MIT licensed; see assets/vendor/THREE-LICENSE.txt.
 */
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

(async () => {
  'use strict';
  const canvas = document.getElementById('avatar-canvas');
  const stage = document.getElementById('avatar-guide');
  if (!canvas || !stage) return;
  let renderer;
  let frame = 0;
  let chapter = 0;
  let visible = true;
  let paused = document.documentElement.classList.contains('motion-paused');
  let waving = false;
  let waveTimer = 0;
  let failed = false;
  let compiled = false;
  let lastFrame = 0;
  let elapsed = 0;
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  let reduced = media.matches;
  const cleanups = [];
  const fallback = () => {
    failed = true;
    cancelAnimationFrame(frame);
    frame = 0;
    document.documentElement.dataset.avatar = 'fallback';
    window.dispatchEvent(new CustomEvent('portfolio:avatar-ready', { detail: { supported: false } }));
  };

  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth < 700 ? 1.25 : 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-2.2, 2.2, 2.25, -2.25, 0.1, 35);
    camera.position.set(3.8, 3.15, 11);
    camera.lookAt(0, 1.95, 0);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x8e9e80, 2.6));
    const key = new THREE.DirectionalLight(0xfff5df, 3.9);
    key.position.set(-3.5, 6.5, 7);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xdcebd9, 1.35);
    fill.position.set(4, 2.5, 4);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0xffffff, 2.2);
    rim.position.set(0, 5, -4);
    scene.add(rim);

    const mat = (color, roughness = 0.76, metalness = 0) => new THREE.MeshStandardMaterial({ color, roughness, metalness });
    const skin = mat(0xb97851);
    const warmSkin = mat(0xa96546);
    const hair = mat(0x202523, 0.88);
    const beard = mat(0x30332c, 0.96);
    const ivory = mat(0xefeee4, 0.95);
    const ivoryShade = mat(0xd6d9cb);
    const ink = mat(0x252e29, 0.87);
    const pants = mat(0x38443c, 0.96);
    const sole = mat(0xc9cebe, 1);
    const lime = mat(0xe6f36a, 0.58);
    const lilac = mat(0xa797cd, 0.65);
    const frameMat = mat(0x30352b, 0.38, 0.12);
    const eyeMat = mat(0x101712, 0.3);
    const pearl = mat(0xffffee, 0.45);
    const smileMat = mat(0x743e2c);
    const sphere = new THREE.SphereGeometry(1, 20, 16);
    const geometryCache = new Map();
    const round = (w, h, d, radius = 0.1) => {
      const id = `${w}:${h}:${d}:${radius}`;
      if (!geometryCache.has(id)) geometryCache.set(id, new RoundedBoxGeometry(w, h, d, 3, radius));
      return geometryCache.get(id);
    };
    const mesh = (geometry, material, parent, x = 0, y = 0, z = 0) => {
      const object = new THREE.Mesh(geometry, material);
      object.position.set(x, y, z);
      parent.add(object);
      return object;
    };
    const orb = (material, parent, x, y, z, sx, sy = sx, sz = sx) => {
      const object = mesh(sphere, material, parent, x, y, z);
      object.scale.set(sx, sy, sz);
      return object;
    };
    const tube = (points, radius, material, parent) => {
      const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)));
      return mesh(new THREE.TubeGeometry(curve, 16, radius, 6, false), material, parent);
    };
    const capsule = (radius, length, material, parent, y) => mesh(new THREE.CapsuleGeometry(radius, Math.max(0.01, length - radius * 2), 4, 12), material, parent, 0, y, 0);

    // A matte plinth and layered translucent discs provide depth without shadow maps.
    const base = new THREE.Group();
    scene.add(base);
    mesh(new THREE.CylinderGeometry(1.13, 1.17, 0.085, 56), mat(0xd0daba, 1), base, 0, 0.005, 0);
    mesh(new THREE.CylinderGeometry(1.12, 1.12, 0.022, 56), mat(0xe4eacb, 1), base, 0, 0.06, 0);
    for (let i = 0; i < 6; i++) {
      const disc = mesh(new THREE.CircleGeometry(0.36 + i * 0.073, 40), new THREE.MeshBasicMaterial({ color: 0x455b40, transparent: true, opacity: 0.024, depthWrite: false }), base, 0, 0.074 + i * 0.0001, 0);
      disc.rotation.x = -Math.PI / 2;
      disc.scale.y = 0.65;
    }
    const body = new THREE.Group();
    body.position.y = 0.08;
    scene.add(body);
    const torso = new THREE.Group();
    torso.position.y = 1.46;
    body.add(torso);
    mesh(round(0.89, 0.92, 0.54, 0.17), ink, torso, 0, 0.47, 0.015);
    // The open overshirt is built as two rounded panels over the dark tee.
    mesh(round(0.35, 0.98, 0.6, 0.11), ivory, torso, -0.345, 0.48, -0.006).rotation.z = -0.055;
    mesh(round(0.35, 0.98, 0.6, 0.11), ivory, torso, 0.345, 0.48, -0.006).rotation.z = 0.055;
    mesh(round(0.83, 0.98, 0.17, 0.08), ivory, torso, 0, 0.48, -0.27);
    const collarL = mesh(round(0.21, 0.28, 0.085, 0.035), ivory, torso, -0.16, 0.86, 0.307);
    collarL.rotation.z = -0.35;
    const collarR = mesh(round(0.21, 0.28, 0.085, 0.035), ivory, torso, 0.16, 0.86, 0.307);
    collarR.rotation.z = 0.35;
    mesh(round(0.20, 0.205, 0.025, 0.025), ivoryShade, torso, 0.34, 0.57, 0.312);
    mesh(round(0.19, 0.035, 0.035, 0.008), ivory, torso, 0.34, 0.66, 0.328);
    for (const y of [0.22, 0.47, 0.72]) orb(sole, torso, -0.225, y, 0.327, 0.015);
    mesh(round(0.81, 0.34, 0.5, 0.14), pants, body, 0, 1.4, 0);
    const legs = [];
    for (const side of [-1, 1]) {
      const leg = new THREE.Group();
      leg.position.set(side * 0.235, 1.33, 0);
      body.add(leg);
      mesh(round(0.35, 1.04, 0.39, 0.13), pants, leg, 0, -0.49, 0);
      mesh(round(0.36, 0.095, 0.405, 0.03), ink, leg, 0, -0.95, 0);
      mesh(round(0.39, 0.225, 0.69, 0.10), ivory, leg, 0, -1.1, 0.12);
      mesh(round(0.40, 0.085, 0.7, 0.03), sole, leg, 0, -1.2, 0.12);
      for (let j = 0; j < 3; j++) mesh(round(0.2, 0.018, 0.024, 0.006), pearl, leg, 0, -0.981, 0.15 + j * 0.077);
      leg.rotation.y = side * -0.065;
      legs.push(leg);
    }
    capsule(0.145, 0.37, skin, body, 2.54);
    const head = new THREE.Group();
    head.position.set(0, 3.07, 0.015);
    body.add(head);
    mesh(round(1.03, 1.11, 0.91, 0.33), skin, head, 0, 0, 0);
    for (const side of [-1, 1]) {
      orb(skin, head, side * 0.525, -0.04, -0.005, 0.13, 0.19, 0.11);
      orb(warmSkin, head, side * 0.577, -0.043, 0.032, 0.045, 0.095, 0.066);
      orb(warmSkin, head, side * 0.3, -0.15, 0.437, 0.13, 0.065, 0.035);
    }
    // A rounded jaw, visible mouth and tiny moustache make the face readable at dock size.
    orb(beard, head, 0, -0.34, 0.24, 0.421, 0.247, 0.25);
    orb(skin, head, 0, -0.258, 0.451, 0.306, 0.116, 0.055);
    for (const side of [-1, 1]) {
      orb(beard, head, side * 0.086, -0.223, 0.5, 0.098, 0.028, 0.024).rotation.z = side * 0.11;
    }
    tube([[-0.107, -0.283, 0.508], [0, -0.307, 0.515], [0.112, -0.278, 0.506]], 0.012, smileMat, head);
    orb(skin, head, 0, -0.065, 0.494, 0.093, 0.102, 0.102);
    const eyes = [];
    for (const side of [-1, 1]) {
      orb(pearl, head, side * 0.222, 0.067, 0.457, 0.079, 0.092, 0.045);
      const eye = orb(eyeMat, head, side * 0.217 + 0.006, 0.06, 0.498, 0.041, 0.054, 0.023);
      eye.userData.animated = true;
      eyes.push(eye);
      orb(pearl, head, side * 0.217 - 0.002, 0.079, 0.521, 0.011);
      const brow = mesh(round(0.166, 0.041, 0.042, 0.019), hair, head, side * 0.214, 0.267, 0.457);
      brow.rotation.z = side * -0.1;
      const glasses = mesh(new THREE.TorusGeometry(0.178, 0.018, 7, 36), frameMat, head, side * 0.219, 0.078, 0.537);
      glasses.scale.y = 0.93;
      tube([[side * 0.39, 0.10, 0.527], [side * 0.505, 0.10, 0.21], [side * 0.54, 0.09, -0.006]], 0.015, frameMat, head);
    }
    tube([[-0.04, 0.085, 0.539], [0, 0.101, 0.56], [0.04, 0.085, 0.539]], 0.014, frameMat, head);
    // Sculpted dark hair, with a swept quiff rather than a texture map.
    mesh(round(1.045, 0.46, 0.95, 0.205), hair, head, 0, 0.43, -0.058);
    orb(hair, head, -0.235, 0.55, 0.205, 0.31, 0.215, 0.28).rotation.z = -0.28;
    orb(hair, head, 0.072, 0.586, 0.18, 0.36, 0.204, 0.29).rotation.z = -0.17;
    orb(hair, head, 0.318, 0.477, 0.12, 0.211, 0.19, 0.272);
    for (const side of [-1, 1]) mesh(round(0.08, 0.3, 0.27, 0.035), hair, head, side * 0.493, 0.15, -0.036);

    function makeArm(side) {
      const shoulder = new THREE.Group();
      shoulder.position.set(side * 0.505, 2.29, 0);
      body.add(shoulder);
      capsule(0.16, 0.48, ivory, shoulder, -0.19);
      const elbow = new THREE.Group();
      elbow.position.y = -0.42;
      shoulder.add(elbow);
      capsule(0.133, 0.31, ivory, elbow, -0.08);
      mesh(round(0.255, 0.10, 0.27, 0.03), ivoryShade, elbow, 0, -0.218, 0);
      capsule(0.09, 0.205, skin, elbow, -0.3);
      const hand = new THREE.Group();
      hand.position.y = -0.40;
      elbow.add(hand);
      mesh(round(0.195, 0.205, 0.1, 0.055), skin, hand, 0, -0.06, 0.016);
      for (let j = 0; j < 4; j++) {
        const finger = capsule(0.023, [0.128, 0.168, 0.153, 0.118][j], skin, hand, -0.168 - [0, 0.019, 0.012, 0][j]);
        finger.position.x = -0.068 + j * 0.046;
        finger.position.z = 0.022;
        finger.rotation.z = (j - 1.5) * 0.065;
      }
      const thumb = capsule(0.031, 0.127, skin, hand, -0.045);
      thumb.position.x = side * 0.115;
      thumb.position.z = 0.045;
      thumb.rotation.z = side * -0.58;
      if (side === 1) {
        mesh(round(0.24, 0.075, 0.23, 0.03), ink, elbow, 0, -0.272, 0);
        mesh(round(0.12, 0.061, 0.065, 0.022), lime, elbow, 0, -0.273, 0.129);
      }
      return { shoulder, elbow, hand };
    }
    const right = makeArm(-1);
    const left = makeArm(1);

    // Small floating objects stay part of the scene, with no DOM animation overhead.
    const code = new THREE.Group();
    code.position.set(-1.03, 1.69, 0.04);
    code.rotation.set(0.08, 0.28, -0.12);
    scene.add(code);
    mesh(round(0.67, 0.49, 0.10, 0.06), lime, code);
    const codeInk = mat(0x4b5835);
    tube([[-0.09, 0.09, 0.066], [-0.2, 0, 0.067], [-0.09, -0.09, 0.067]], 0.018, codeInk, code);
    tube([[0.09, 0.09, 0.066], [0.2, 0, 0.067], [0.09, -0.09, 0.067]], 0.018, codeInk, code);
    tube([[0.04, 0.115, 0.066], [-0.04, -0.115, 0.066]], 0.013, codeInk, code);
    const cube = mesh(round(0.27, 0.27, 0.27, 0.05), lilac, scene, 1.0, 2.89, -0.22);
    cube.rotation.set(0.32, 0.52, -0.2);

    // Batch immutable pieces within each joint; pose groups remain independently movable.
    // This roughly halves draw calls without losing hands, glasses, or facial detail.
    function batchStaticParts(group) {
      for (const child of [...group.children]) if (child.isGroup) batchStaticParts(child);
      const batches = new Map();
      for (const child of group.children) {
        if (!child.isMesh || child.userData.animated) continue;
        const parts = batches.get(child.material) || [];
        parts.push(child);
        batches.set(child.material, parts);
      }
      for (const [material, parts] of batches) {
        if (parts.length < 2) continue;
        const geometries = parts.map(part => {
          part.updateMatrix();
          const geometry = part.geometry.index ? part.geometry.toNonIndexed() : part.geometry.clone();
          return geometry.applyMatrix4(part.matrix);
        });
        const combined = mergeGeometries(geometries, false);
        geometries.forEach(geometry => geometry.dispose());
        if (combined) {
          parts.forEach(part => group.remove(part));
          group.add(new THREE.Mesh(combined, material));
        }
      }
    }
    batchStaticParts(body);
    batchStaticParts(code);

    const poses = [
      // shoulder.z, elbow.z, shoulder.x, elbow.x, wrist.z per arm.
      { r: [-2.10, -0.62, 0.05, -0.2, 0], l: [0.08, 0.12, 0.02, -0.16, 0], head: -0.06, turn: -0.045 },
      { r: [-0.10, -0.13, 0, -0.17, 0], l: [0.82, 1.09, 0.12, -0.62, 0.30], head: 0.075, turn: -0.10 },
      { r: [-0.13, -0.12, 0, -0.12, 0], l: [1.65, 2.40, 0.05, 0.52, -0.16], head: 0.075, turn: 0.035 },
      { r: [-0.65, 1.0, 0.04, -0.25, 0.12], l: [0.65, -1.0, 0.04, -0.25, -0.12], head: 0.045, turn: -0.035 },
      { r: [-1.98, -0.69, 0.01, -0.23, 0], l: [0.53, 0.69, -0.03, -0.3, 0.18], head: -0.07, turn: -0.02 }
    ];
    const state = { r: [...poses[0].r], l: [...poses[0].l], head: poses[0].head, turn: poses[0].turn };
    let lastTime = 0;
    let renderCount = 0;
    const active = () => compiled && !failed && !document.hidden && visible && !paused && !reduced;

    function applyPose(dt, immediate = false) {
      const p = poses[waving ? 0 : chapter];
      const smooth = immediate ? 1 : 1 - Math.exp(-dt * 7.5);
      for (const [name, arm] of [['r', right], ['l', left]]) {
        state[name].forEach((value, i) => {
          state[name][i] += (p[name][i] - value) * smooth;
        });
        const a = state[name];
        arm.shoulder.rotation.set(a[2], 0, a[0]);
        arm.elbow.rotation.set(a[3], 0, a[1]);
        arm.hand.rotation.z = a[4];
      }
      state.head += (p.head - state.head) * smooth;
      state.turn += (p.turn - state.turn) * smooth;
      head.rotation.set(0, 0, state.head);
      body.rotation.y = state.turn;
      const moving = !paused && !reduced;
      if (moving) {
        const breath = Math.sin(elapsed * 1.7);
        torso.scale.y = 1 + breath * 0.005;
        head.position.y = 3.07 + breath * 0.007;
        head.rotation.y = Math.sin(elapsed * 0.65) * 0.035;
        head.rotation.x = chapter === 2 ? -0.045 + Math.sin(elapsed * 1.1) * 0.026 : Math.sin(elapsed * 0.8) * 0.014;
        if (waving || chapter === 0 || chapter === 4) {
          const wave = Math.sin(elapsed * 3.0) * 0.115;
          right.hand.rotation.z += wave;
          right.elbow.rotation.z += wave * 0.22;
        }
        code.position.y = 1.69 + Math.sin(elapsed * 1.25) * 0.045;
        code.rotation.y = 0.28 + Math.sin(elapsed * 0.65) * 0.1;
        cube.position.y = 2.89 + Math.cos(elapsed * 1.1) * 0.065;
        cube.rotation.y = 0.52 + Math.sin(elapsed * 0.7) * 0.28;
        const blink = elapsed % 5.9;
        const eyeScale = blink > 5.69 && blink < 5.82 ? 0.14 : 1;
        for (const eye of eyes) eye.scale.y = 0.054 * eyeScale;
      } else {
        torso.scale.y = 1;
        head.position.y = 3.07;
        head.rotation.x = 0;
        head.rotation.y = 0;
        for (const eye of eyes) eye.scale.y = 0.054;
      }
    }
    function render() {
      if (!compiled || failed) return;
      renderer.render(scene, camera);
      renderCount++;
    }
    function tick(time) {
      frame = 0;
      if (!active()) return;
      if (time - lastFrame >= 1000 / 30) {
        const dt = Math.min((time - (lastTime || time)) / 1000, 0.08);
        elapsed += dt;
        lastTime = time;
        lastFrame = time;
        applyPose(dt);
        render();
      }
      frame = requestAnimationFrame(tick);
    }
    function wake(force = false) {
      if (failed) return;
      if (force) {
        applyPose(0, paused || reduced);
        render();
      }
      if (active() && !frame) {
        lastTime = 0;
        frame = requestAnimationFrame(tick);
      } else if (!active() && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    }
    function resize() {
      if (failed) return;
      // Layout dimensions exclude the guide's temporary FLIP transform.
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (!width || !height) return;
      const aspect = width / height;
      const halfHeight = 2.19;
      camera.left = -halfHeight * aspect;
      camera.right = halfHeight * aspect;
      camera.top = halfHeight;
      camera.bottom = -halfHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth < 700 ? 1.25 : 1.5));
      renderer.setSize(width, height, false);
      wake(true);
    }
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    const intersection = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      wake(visible);
    }, { threshold: 0 });
    intersection.observe(stage);
    const onVisibility = () => wake(!document.hidden);
    const onMotion = event => {
      paused = Boolean(event.detail?.paused);
      wake(true);
    };
    const onWave = () => {
      waving = true;
      clearTimeout(waveTimer);
      wake(true);
      waveTimer = window.setTimeout(() => {
        waving = false;
        wake(true);
      }, 2300);
    };
    const onChapter = event => {
      chapter = Math.max(0, Math.min(4, Number(event.detail?.index) || 0));
      reduced = media.matches || Boolean(event.detail?.reducedMotion);
      wake(true);
    };
    const onPreference = event => {
      reduced = event.matches;
      wake(true);
    };
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('portfolio:motion', onMotion);
    window.addEventListener('portfolio:chapter', onChapter);
    window.addEventListener('portfolio:wave', onWave);
    media.addEventListener('change', onPreference);
    canvas.addEventListener('webglcontextlost', event => {
      event.preventDefault();
      fallback();
    });
    cleanups.push(() => observer.disconnect(), () => intersection.disconnect(), () => document.removeEventListener('visibilitychange', onVisibility), () => window.removeEventListener('resize', resize), () => window.removeEventListener('portfolio:motion', onMotion), () => window.removeEventListener('portfolio:chapter', onChapter), () => window.removeEventListener('portfolio:wave', onWave), () => clearTimeout(waveTimer), () => media.removeEventListener('change', onPreference));
    window.portfolioAvatar = {
      get stats() { return { chapter, waving, paused, reducedMotion: reduced, visible, running: Boolean(frame), renders: renderCount, drawCalls: renderer.info.render.calls, triangles: renderer.info.render.triangles, pixelRatio: renderer.getPixelRatio() }; },
      dispose() {
        failed = true;
        cancelAnimationFrame(frame);
        frame = 0;
        cleanups.forEach(fn => fn());
        const geometries = new Set();
        const materials = new Set();
        scene.traverse(object => {
          if (object.geometry) geometries.add(object.geometry);
          if (object.material) materials.add(object.material);
        });
        geometries.forEach(geometry => geometry.dispose());
        materials.forEach(material => material.dispose());
        renderer.dispose();
      }
    };
    applyPose(0, true);
    resize();
    // Let supported drivers compile shaders asynchronously before the first frame.
    await renderer.compileAsync(scene, camera);
    if (failed) return;
    compiled = true;
    resize();
    document.documentElement.dataset.avatar = 'ready';
    window.dispatchEvent(new CustomEvent('portfolio:avatar-ready', { detail: { supported: true } }));
    wake();
  } catch (error) {
    console.warn('The 3D guide is unavailable; the portfolio remains ready.', error?.message || 'WebGL unavailable');
    renderer?.dispose();
    cleanups.forEach(fn => fn());
    fallback();
  }
})();
