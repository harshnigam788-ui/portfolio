import * as THREE from 'three';
import { tileDefs, buildAtlas } from './tiles.js';

const body = document.body;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const small = innerWidth < 760 || matchMedia('(pointer: coarse)').matches;

/* ================================================================ UI */
const MAIL = ['harshnigam788', 'gmail.com'].join('@');

const clock = document.getElementById('clock');
const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' });
const tick = () => { clock.textContent = fmt.format(new Date()) + ' IST'; };
tick(); setInterval(tick, 15000);

document.querySelectorAll('.js-mail').forEach(a => { a.href = `mailto:${MAIL}`; });
document.getElementById('copymail').addEventListener('click', async e => {
  try { await navigator.clipboard.writeText(MAIL); e.target.textContent = 'copied ✓'; }
  catch { e.target.textContent = MAIL; }
  setTimeout(() => { e.target.textContent = 'copy my address'; }, 2200);
});

let openName = null;
function openPanel(name, anchor) {
  const panel = document.getElementById('panel-' + name);
  if (!panel) return;
  document.querySelectorAll('.panel.open').forEach(p => { if (p !== panel) { p.classList.remove('open'); p.setAttribute('aria-hidden', 'true'); } });
  panel.classList.add('open'); panel.setAttribute('aria-hidden', 'false');
  body.classList.add('panel-open'); openName = name;
  document.querySelectorAll('.nav a').forEach(a => a.setAttribute('aria-current', String(a.dataset.open === name)));
  try { const url = new URL(location.href); url.searchParams.set('open', name); history.replaceState(null, '', url); } catch {}
  const scroller = panel.querySelector('.panel-body');
  if (anchor) {
    const el = panel.querySelector('#c-' + anchor);
    if (el) setTimeout(() => { el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' }); el.classList.add('flash'); setTimeout(() => el.classList.remove('flash'), 1600); }, 350);
  } else scroller.scrollTop = 0;
  setTimeout(() => panel.querySelector('.close').focus({ preventScroll: true }), 50);
}
function closePanel() {
  if (!openName) return;
  document.querySelectorAll('.panel.open').forEach(p => { p.classList.remove('open'); p.setAttribute('aria-hidden', 'true'); });
  body.classList.remove('panel-open'); openName = null;
  document.querySelectorAll('.nav a').forEach(a => a.setAttribute('aria-current', 'false'));
  try { const url = new URL(location.href); url.searchParams.delete('open'); history.replaceState(null, '', url); } catch {}
}
document.addEventListener('click', e => {
  const o = e.target.closest('[data-open]');
  if (o) { e.preventDefault(); openPanel(o.dataset.open); return; }
  if (e.target.closest('[data-close]')) closePanel();
});
addEventListener('keydown', e => { if (e.key === 'Escape') closePanel(); });
const initial = new URL(location.href).searchParams.get('open');
if (initial) openPanel(initial);

// contact form → email (swap for an /api/contact endpoint once an email service is connected)
const form = document.getElementById('cform');
const status = document.getElementById('cstatus');
form.addEventListener('submit', e => {
  e.preventDefault();
  let ok = true;
  form.querySelectorAll('[required]').forEach(f => { const bad = !f.value.trim() || (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(f.value)); f.classList.toggle('invalid', bad); if (bad) ok = false; });
  if (!ok) { status.textContent = 'Please fill in your name, a valid email and a few project details.'; return; }
  const d = new FormData(form);
  const needs = d.getAll('need').join(', ') || 'Not specified';
  const subject = `Project enquiry — ${d.get('name')}${d.get('company') ? ' (' + d.get('company') + ')' : ''}`;
  const lines = [`Name: ${d.get('name')}`, `Email: ${d.get('email')}`, `Company: ${d.get('company') || '—'}`, `Needs: ${needs}`, '', d.get('message')];
  location.href = `mailto:${MAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
  status.textContent = 'Opening your email app with everything filled in…';
});

if (small) document.querySelector('.hint-text').textContent = 'Swipe up to fly through the work';

/* ================================================================ SCENE */
function webglOK() { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; } }
if (!webglOK()) { body.classList.add('no-webgl'); }
else { await document.fonts.load('64px "Instrument Serif"').catch(() => {}); await document.fonts.load('italic 64px "Instrument Serif"').catch(() => {}); await document.fonts.load('500 16px "Inter Tight"').catch(() => {}); start(); }

function start() {
  const canvas = document.getElementById('field');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, small ? 1.75 : 2));
  renderer.setClearColor(0x09090b, 1);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 300);
  camera.position.set(0, 0, 6);

  // --- tiles & atlas
  const defs = tileDefs();
  const { canvas: atlasCanvas } = buildAtlas(defs, small ? 224 : 448);
  const tex = new THREE.CanvasTexture(atlasCanvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  tex.generateMipmaps = true; tex.minFilter = THREE.LinearMipmapLinearFilter;

  // --- layout: a long tunnel of tiles; the camera flies along -z
  const DEPTH = small ? 150 : 210;
  const COUNT = small ? 260 : 520;
  const FAR = DEPTH * 0.92;
  const pool = []; defs.forEach((d, i) => { for (let w = 0; w < d.weight; w++) pool.push(i); });
  const rand = (() => { let s = 20261115; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();
  const inst = [];
  for (let i = 0; i < COUNT; i++) {
    const a = rand() * Math.PI * 2;
    const r = 2.4 + Math.pow(rand(), 0.8) * (small ? 5.5 : 9);
    const size = 1.15 + rand() * (small ? 0.9 : 1.5);
    inst.push({
      def: i < defs.length ? i : pool[Math.floor(rand() * pool.length)],
      x: Math.cos(a) * r * (small ? 0.7 : 1.35), y: Math.sin(a) * r * 0.8,
      z: (i / COUNT) * DEPTH + rand() * (DEPTH / COUNT), s: size,
      rz: (rand() - 0.5) * 0.08, ph: rand() * 6.28, h: 0,
    });
  }
  // keep the first stretch in front of the hero calm so the headline stays readable
  inst.forEach(o => { if (o.z > DEPTH - 14 && Math.hypot(o.x, o.y) < 3.6) { o.x *= 1.8; o.y *= 1.8; } });

  const geo = new THREE.PlaneGeometry(1, 0.75);
  const aRect = new Float32Array(COUNT * 4), aHover = new Float32Array(COUNT);
  inst.forEach((o, i) => aRect.set(defs[o.def].rect, i * 4));
  geo.setAttribute('aRect', new THREE.InstancedBufferAttribute(aRect, 4));
  const hoverAttr = new THREE.InstancedBufferAttribute(aHover, 1); hoverAttr.setUsage(THREE.DynamicDrawUsage);
  geo.setAttribute('aHover', hoverAttr);

  const mat = new THREE.ShaderMaterial({
    uniforms: { uMap: { value: tex }, uFar: { value: FAR }, uBg: { value: new THREE.Color(0x09090b) }, uVel: { value: 0 }, uAccent: { value: new THREE.Color(0xff5a1f) }, uHero: { value: 1 }, uHeroX: { value: small ? 2.0 : 0.05 } },
    vertexShader: /* glsl */`
      attribute vec4 aRect; attribute float aHover;
      uniform float uVel;
      varying vec2 vUv; varying vec2 vLocal; varying float vDepth; varying float vHover; varying vec3 vClip;
      void main() {
        vLocal = uv;
        vUv = aRect.xy + uv * aRect.zw;
        vec3 p = position;
        p.y += sin(uv.x * 3.14159) * uVel * 0.06;          // gentle bend while flying fast
        vec4 mv = modelViewMatrix * instanceMatrix * vec4(p, 1.0);
        vDepth = -mv.z; vHover = aHover;
        gl_Position = projectionMatrix * mv;
        vClip = gl_Position.xyw;
      }`,
    fragmentShader: /* glsl */`
      uniform sampler2D uMap; uniform float uFar; uniform vec3 uBg; uniform vec3 uAccent; uniform float uHero; uniform float uHeroX;
      varying vec2 vUv; varying vec2 vLocal; varying float vDepth; varying float vHover; varying vec3 vClip;
      float rbox(vec2 p, vec2 b, float r) { vec2 q = abs(p) - b + r; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r; }
      void main() {
        vec2 p = (vLocal - 0.5) * vec2(1.0, 0.75);
        float d = rbox(p, vec2(0.5, 0.375), 0.028);
        if (d > 0.0) discard;
        vec4 c = texture2D(uMap, vUv);
        float fade = pow(smoothstep(uFar, uFar * 0.08, vDepth), 1.6) * smoothstep(0.4, 3.2, vDepth);
        vec3 col = mix(uBg, c.rgb, fade);
        float edge = smoothstep(-0.012, 0.0, d);
        col = mix(col, uAccent, edge * vHover * fade);
        col += vHover * 0.035;
        vec2 s = vClip.xy / vClip.z;                                   // screen position, -1..1
        float hero = (1.0 - smoothstep(uHeroX - 0.45, uHeroX, s.x)) * (1.0 - smoothstep(0.15, 0.55, s.y));
        col = mix(col, uBg, hero * uHero * 0.88);                      // keep the headline area quiet
        gl_FragColor = vec4(col, 1.0);
        #include <colorspace_fragment>
      }`,
  });
  const mesh = new THREE.InstancedMesh(geo, mat, COUNT);
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  mesh.frustumCulled = false;
  mesh.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, -DEPTH / 2), DEPTH);
  scene.add(mesh);

  // --- input: wheel, drag/touch, keys → a target travel distance we ease toward
  let target = 0, travel = 0, vel = 0, userDist = 0, lastInput = 0, dragging = false, dragY = 0, dragStart = 0, moved = 0;
  const pointer = new THREE.Vector2(0, 0), ndc = new THREE.Vector2(9, 9), look = new THREE.Vector2();
  const push = d => { if (openName) return; target += d; lastInput = performance.now(); userDist = Math.max(0, userDist + d); body.classList.toggle('flying', userDist > 3); };
  addEventListener('wheel', e => { if (openName) return; e.preventDefault(); push(e.deltaY * (e.deltaMode === 1 ? 0.5 : 0.012)); }, { passive: false });
  canvas.addEventListener('pointerdown', e => { dragging = true; dragY = dragStart = e.clientY; moved = 0; canvas.classList.add('dragging'); canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener('pointermove', e => {
    pointer.set(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
    ndc.copy(pointer); tipX = e.clientX; tipY = e.clientY;
    if (dragging) { const dy = e.clientY - dragY; dragY = e.clientY; moved += Math.abs(dy); push(-dy * 0.06); }
  });
  const endDrag = () => { if (!dragging) return; dragging = false; canvas.classList.remove('dragging'); };
  canvas.addEventListener('pointerup', e => { const wasClick = moved < 6; endDrag(); if (wasClick) click(e); });
  canvas.addEventListener('pointercancel', endDrag);
  canvas.addEventListener('pointerleave', () => { ndc.set(9, 9); });
  addEventListener('keydown', e => {
    if (openName || e.target.closest('input,textarea')) return;
    const k = { ArrowDown: 6, PageDown: 18, ' ': 18, ArrowUp: -6, PageUp: -18 }[e.key];
    if (k) { e.preventDefault(); push(k); }
  });

  // --- hover / click
  const ray = new THREE.Raycaster(); const tip = document.getElementById('tip');
  let hovered = -1, tipX = 0, tipY = 0;
  function pick() {
    if (openName || dragging || ndc.x > 2) return -1;
    ray.setFromCamera(ndc, camera);
    const hits = ray.intersectObject(mesh);
    for (const h of hits) { if (h.distance > 1.2 && h.distance < FAR * 0.6) return h.instanceId; }
    return -1;
  }
  function click() {
    const id = pick(); if (id < 0) return;
    const d = defs[inst[id].def]; openPanel(d.open, d.anchor);
  }

  // --- frame loop
  const dummy = new THREE.Object3D(); const progress = document.getElementById('progress');
  let t0 = performance.now(), visible = true;
  document.addEventListener('visibilitychange', () => { visible = !document.hidden; if (visible) { t0 = performance.now(); loop(); } });

  function resize() {
    const w = innerWidth, h = innerHeight;
    renderer.setSize(w, h, false); camera.aspect = w / h;
    camera.fov = w / h < 0.8 ? 68 : 52; camera.updateProjectionMatrix();
  }
  addEventListener('resize', resize); resize();

  function loop() {
    if (!visible) return;
    requestAnimationFrame(loop);
    const now = performance.now(), dt = Math.min(0.05, (now - t0) / 1000); t0 = now;
    const idle = now - lastInput > 2600;
    if (!reduced && idle && !openName && !dragging) target += dt * 1.1;  // slow cruise when idle
    const prev = travel;
    travel += (target - travel) * (1 - Math.pow(0.0009, dt));
    vel += ((travel - prev) / Math.max(dt, 1e-3) - vel) * 0.1;
    mat.uniforms.uVel.value = Math.max(-6, Math.min(6, vel * 0.25));
    progress.style.transform = `scaleX(${((travel % DEPTH) + DEPTH) % DEPTH / DEPTH})`;

    mat.uniforms.uHero.value += ((body.classList.contains('flying') || openName ? 0 : 1) - mat.uniforms.uHero.value) * 0.05;
    look.lerp(pointer, reduced ? 0.02 : 0.05);
    camera.position.x = look.x * 0.9; camera.position.y = look.y * 0.55;
    camera.lookAt(look.x * 0.3, look.y * 0.2, -30);

    const id = pick();
    if (id !== hovered) {
      if (hovered >= 0) inst[hovered].hv = 0;
      hovered = id;
      if (id >= 0) { inst[id].hv = 1; tip.innerHTML = defs[inst[id].def].label; tip.classList.add('on'); canvas.classList.add('pointing'); }
      else { tip.classList.remove('on'); canvas.classList.remove('pointing'); }
    }
    if (hovered >= 0) tip.style.left = tipX + 'px', tip.style.top = tipY + 'px';

    const tsec = now / 1000;
    for (let i = 0; i < COUNT; i++) {
      const o = inst[i];
      const z = (((o.z + travel) % DEPTH) + DEPTH) % DEPTH - DEPTH + 4.5;
      o.h += ((o.hv || 0) - o.h) * 0.15; aHover[i] = o.h;
      const bob = reduced ? 0 : Math.sin(tsec * 0.5 + o.ph) * 0.06;
      dummy.position.set(o.x, o.y + bob, z);
      dummy.rotation.set(-o.y * 0.025 + mat.uniforms.uVel.value * 0.01, -o.x * 0.03, o.rz);
      dummy.scale.setScalar(o.s * (1 + o.h * 0.06));
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true; hoverAttr.needsUpdate = true;
    renderer.render(scene, camera);
  }
  loop();
}
