import * as THREE from 'three';

const body = document.body;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const small = innerWidth < 760 || matchMedia('(pointer: coarse)').matches;
const V = small ? 'sm' : 'lg';
const MAIL = ['harshnigam788', 'gmail.com'].join('@');
const PLATE = { valintry360: '#0b1f3a', valintry: '#ffffff', ignitehcm: '#1b1719', bullseye: '#ffffff', calance: '#ffffff', prateek: '#0b2a4a', tag: '#141414', advayan: '#0a0f3d', zapfire: '#1a1210', iinfotanks: '#ffffff' };
const TYPES = ['Homepage', 'Service page', 'Case study', 'Blog', 'Brand page'];
const pad4 = n => String(n).padStart(4, '0');
const esc = s => String(s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ================================================================ basics */
const clock = document.getElementById('clock');
const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' });
const tick = () => { clock.textContent = fmt.format(new Date()); };
tick(); setInterval(tick, 15000);
document.querySelectorAll('.js-mail').forEach(a => { a.href = `mailto:${MAIL}`; });
document.querySelectorAll('.js-mail-text').forEach(a => { a.textContent = MAIL; });
document.getElementById('copymail').addEventListener('click', async e => {
  try { await navigator.clipboard.writeText(MAIL); e.target.textContent = 'copied ✓'; } catch { e.target.textContent = MAIL; }
  setTimeout(() => { e.target.textContent = 'copy my address'; }, 2200);
});
const form = document.getElementById('cform'), status = document.getElementById('cstatus');
form.addEventListener('submit', e => {
  e.preventDefault(); let ok = true;
  form.querySelectorAll('[required]').forEach(f => { const bad = !f.value.trim() || (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(f.value)); f.classList.toggle('invalid', bad); if (bad) ok = false; });
  if (!ok) { status.textContent = 'Please fill in your name, a valid email and a few project details.'; return; }
  const d = new FormData(form); const needs = d.getAll('need').join(', ') || 'Not specified';
  const subject = `Project enquiry — ${d.get('name')}${d.get('company') ? ' (' + d.get('company') + ')' : ''}`;
  const lines = [`Name: ${d.get('name')}`, `Email: ${d.get('email')}`, `Company: ${d.get('company') || '—'}`, `Needs: ${needs}`, '', d.get('message')];
  location.href = `mailto:${MAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
  status.textContent = `Opening your email app with everything filled in. If nothing opens, write to ${MAIL}.`;
});

/* ================================================================ data */
const [TD, MD] = await Promise.all([fetch('data/tiles.json').then(r => r.json()), fetch('data/mosaic.json').then(r => r.json())]);
const tiles = TD.tiles, NAMES = TD.names;
const pages = tiles.filter(t => t.url).map(t => t.i);
document.getElementById('workCount').textContent = tiles.length;
document.querySelectorAll('[data-count]').forEach(el => { el.textContent = TD.counts[el.dataset.count] || 0; });
document.getElementById('idxCount').textContent = `${pages.length} pages · ${tiles.length} tiles`;
const label = t => t.url ? `<b>${esc(NAMES[t.c])}</b> · ${esc(t.t)} <i>— ${esc(t.title)}</i>` : t.label;

/* ================================================================ panels */
let openName = null;
const setUrl = (k, v) => { try { const u = new URL(location.href); v ? u.searchParams.set(k, v) : u.searchParams.delete(k); history.replaceState(null, '', u); } catch {} };
function openPanel(name, anchor) {
  const panel = document.getElementById('panel-' + name); if (!panel) return;
  if (name === 'index') buildIndex();
  document.querySelectorAll('.panel.open').forEach(p => { if (p !== panel) { p.classList.remove('open'); p.setAttribute('aria-hidden', 'true'); } });
  panel.classList.add('open'); panel.setAttribute('aria-hidden', 'false');
  body.classList.add('panel-open'); openName = name;
  document.querySelectorAll('.nav a').forEach(a => a.setAttribute('aria-current', String(a.dataset.open === name)));
  setUrl('open', name);
  const scroller = panel.querySelector('.panel-body');
  if (anchor) {
    const el = panel.querySelector('#c-' + anchor);
    if (el) setTimeout(() => { el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' }); el.classList.add('flash'); setTimeout(() => el.classList.remove('flash'), 1600); }, 350);
  } else if (name !== 'index') scroller.scrollTop = 0;
  setTimeout(() => panel.querySelector('.close').focus({ preventScroll: true }), 60);
}
function closePanel() {
  if (!openName) return;
  document.querySelectorAll('.panel.open').forEach(p => { p.classList.remove('open'); p.setAttribute('aria-hidden', 'true'); });
  body.classList.remove('panel-open'); openName = null; setUrl('open', null);
  document.querySelectorAll('.nav a').forEach(a => a.setAttribute('aria-current', 'false'));
}
document.addEventListener('click', e => {
  const ix = e.target.closest('[data-index]');
  if (ix) { e.preventDefault(); fClient = ix.dataset.index; fType = 'all'; openPanel('index'); renderIndex(); return; }
  const o = e.target.closest('[data-open]');
  if (o) { e.preventDefault(); openPanel(o.dataset.open); return; }
  if (e.target.closest('[data-lbclose]')) { closeLightbox(); return; }
  if (e.target.closest('[data-close]')) { if (body.classList.contains('lb-open')) closeLightbox(); else closePanel(); }
});
addEventListener('keydown', e => {
  if (body.classList.contains('lb-open')) {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') lbStep(1);
    if (e.key === 'ArrowLeft') lbStep(-1);
    return;
  }
  if (e.key === 'Escape') closePanel();
});

/* ================================================================ index */
let fClient = 'all', fType = 'all', indexBuilt = false;
const grid = document.getElementById('grid');
function buildIndex() {
  if (indexBuilt) return; indexBuilt = true;
  const byC = {}; pages.forEach(i => { const c = tiles[i].c; byC[c] = (byC[c] || 0) + 1; });
  const fc = document.getElementById('fClient'), ft = document.getElementById('fType');
  fc.innerHTML = `<button data-fc="all">All clients<small>${pages.length}</small></button>` +
    Object.keys(NAMES).filter(c => byC[c]).map(c => `<button data-fc="${c}">${esc(NAMES[c])}<small>${byC[c]}</small></button>`).join('');
  ft.innerHTML = `<button data-ft="all">All types</button>` + TYPES.map(t => `<button data-ft="${t}">${t === 'Case study' ? 'Case studies' : t + 's'}</button>`).join('');
  fc.addEventListener('click', e => { const b = e.target.closest('[data-fc]'); if (b) { fClient = b.dataset.fc; renderIndex(); } });
  ft.addEventListener('click', e => { const b = e.target.closest('[data-ft]'); if (b) { fType = b.dataset.ft; renderIndex(); } });
  grid.addEventListener('click', e => { const c = e.target.closest('[data-i]'); if (c) openLightbox(+c.dataset.i, currentList()); });
  renderIndex();
}
const currentList = () => pages.filter(i => (fClient === 'all' || tiles[i].c === fClient) && (fType === 'all' || tiles[i].t === fType));
function renderIndex() {
  if (!indexBuilt) return;
  document.querySelectorAll('[data-fc]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.fc === fClient)));
  document.querySelectorAll('[data-ft]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.ft === fType)));
  const list = currentList();
  grid.innerHTML = list.map(i => { const t = tiles[i]; return `<button class="card" data-i="${i}"><div class="im"><img loading="lazy" decoding="async" src="thumb/${pad4(i)}.webp" alt=""></div><p class="cm">${esc(NAMES[t.c])} · ${esc(t.t)}</p><p class="ct">${esc(t.title)}</p></button>`; }).join('')
    || '<p class="intro">Nothing matches that filter yet.</p>';
  grid.closest('.panel-body').scrollTop = 0;
}

/* ================================================================ lightbox */
const lb = { img: document.getElementById('lbImg'), logo: document.getElementById('lbLogo'), client: document.getElementById('lbClient'), type: document.getElementById('lbType'),
  title: document.getElementById('lbTitle'), url: document.getElementById('lbUrl'), link: document.getElementById('lbLink'), pos: document.getElementById('lbPos'),
  prev: document.getElementById('lbPrev'), next: document.getElementById('lbNext') };
let lbList = [], lbAt = 0;
lb.img.addEventListener('load', () => lb.img.classList.add('ready'));
function openLightbox(i, list) {
  lbList = list && list.includes(i) ? list : pages.filter(j => tiles[j].c === tiles[i].c);
  lbAt = Math.max(0, lbList.indexOf(i)); showLb(); body.classList.add('lb-open');
  document.getElementById('lightbox').setAttribute('aria-hidden', 'false');
  setTimeout(() => lb.next.focus({ preventScroll: true }), 50);
}
function showLb() {
  const t = tiles[lbList[lbAt]];
  lb.img.classList.remove('ready'); lb.img.src = `work/${pad4(t.i)}.webp`; lb.img.alt = `${NAMES[t.c]} — ${t.title}`;
  lb.logo.style.setProperty('--pb', PLATE[t.c] || '#fff'); lb.logo.innerHTML = `<img src="logos/${t.c}.png" alt="${esc(NAMES[t.c])} logo">`;
  lb.client.textContent = NAMES[t.c]; lb.type.textContent = t.t; lb.title.textContent = t.title || NAMES[t.c];
  let pretty = t.url; try { const u = new URL(t.url); pretty = u.host.replace(/^www\./, '') + decodeURI(u.pathname).replace(/\/$/, ''); } catch {}
  lb.url.textContent = pretty; lb.link.href = t.url;
  lb.pos.textContent = `${lbAt + 1} / ${lbList.length}`; lb.prev.disabled = lbAt === 0; lb.next.disabled = lbAt === lbList.length - 1;
  [lbList[lbAt + 1], lbList[lbAt - 1]].forEach(j => { if (j != null) { const im = new Image(); im.src = `work/${pad4(j)}.webp`; } });
}
const lbStep = d => { const n = lbAt + d; if (n >= 0 && n < lbList.length) { lbAt = n; showLb(); } };
lb.prev.addEventListener('click', () => lbStep(-1)); lb.next.addEventListener('click', () => lbStep(1));
function closeLightbox() { body.classList.remove('lb-open'); document.getElementById('lightbox').setAttribute('aria-hidden', 'true'); }

function activateTile(i) {
  const t = tiles[i];
  if (t.url) openLightbox(i);
  else if (t.c === 'iinfotanks') { fClient = 'iinfotanks'; fType = 'all'; openPanel('index'); renderIndex(); }
  else if (t.open === 'work' && t.c) openPanel('work', t.c);
  else openPanel(t.open || 'about');
}

const initial = new URL(location.href).searchParams.get('open');

/* ================================================================ scene */
function webglOK() { try { const c = document.createElement('canvas'); return !!c.getContext('webgl2'); } catch { return false; } }
const pctEl = document.getElementById('loaderPct');
if (!webglOK()) { body.classList.add('no-webgl'); body.classList.remove('loading'); if (initial) openPanel(initial); }
else start().catch(err => { console.error(err); body.classList.add('no-webgl'); body.classList.remove('loading'); });

async function loadAtlases() {
  const L = TD.layout[V];
  const urls = Array.from({ length: L.count }, (_, a) => `atlas/${V}-${a}.webp`);
  const got = new Array(urls.length).fill(0), tot = new Array(urls.length).fill(0);
  const show = () => { const t = tot.reduce((a, b) => a + b, 0); const g = got.reduce((a, b) => a + b, 0); pctEl.textContent = (t ? Math.min(99, Math.round(g / t * 100)) : 0) + '%'; };
  return Promise.all(urls.map(async (u, a) => {
    const res = await fetch(u); tot[a] = +res.headers.get('content-length') || 2e6;
    let blob;
    if (res.body && res.body.getReader) {
      const rd = res.body.getReader(); const parts = [];
      for (;;) { const { done, value } = await rd.read(); if (done) break; parts.push(value); got[a] += value.length; show(); }
      blob = new Blob(parts, { type: 'image/webp' });
    } else { blob = await res.blob(); got[a] = tot[a]; show(); }
    const img = new Image(); img.src = URL.createObjectURL(blob); await img.decode(); return img;
  }));
}

async function start() {
  await document.fonts.ready;
  const imgs = await loadAtlases();
  const L = TD.layout[V], M = MD[V];
  const canvas = document.getElementById('field');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, small ? 1.75 : 2));
  renderer.setClearColor(0x09090b, 1);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 400);
  camera.position.set(0, 0, 6);

  // ---------- instances: every mosaic cell, plus the tiles the face didn't need
  const rand = (() => { let s = 20261115; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();
  const C = M.cols, R = M.rows;
  const PH = small ? 15.5 : 15.2, cellH = PH / R, cellW = cellH * 4 / 3, PZ = -14, CY = small ? 2.2 : 0.7;
  const toLin = v => Math.pow(v, 2.2);
  const inst = []; const used = new Set();
  for (const [cx, cy, k, r, g, b, lum] of M.cells) {
    used.add(k);
    const x = (cx - C / 2 + 0.5) * cellW, y = (R / 2 - cy - 0.5) * cellH + CY;
    const dn = Math.min(1, Math.hypot(x / (C * cellW * 0.5), (y - CY) / (PH * 0.5)));
    inst.push({ k, p0: [x, y, PZ + (lum - 0.45) * 1.6 + (rand() - 0.5) * 0.3, cellW * 0.93], tint: [toLin(r), toLin(g), toLin(b)], delay: 0.55 * (0.55 * rand() + 0.45 * dn) });
  }
  for (const t of tiles) if (!used.has(t.i)) {
    const a = rand() * 6.283, rr = 14 + rand() * 10;
    inst.push({ k: t.i, p0: [Math.cos(a) * rr, Math.sin(a) * rr * 0.7, PZ - 30 - rand() * 30, 0], tint: [0, 0, 0], delay: 0.2 + rand() * 0.35 });
  }
  const N = inst.length, seen = new Set(), KEEP = small ? 0.22 : 0.2;
  inst.forEach(o => { o.keep = !seen.has(o.k) || rand() < KEEP; seen.add(o.k); });
  const kept = inst.filter(o => o.keep).length;
  const DEPTH = Math.max(small ? 180 : 240, kept * (small ? 0.16 : 0.12)), FAR = small ? 110 : 150;
  for (const o of inst) {
    const a = rand() * Math.PI * 2, r = 2.4 + Math.pow(rand(), 0.8) * (small ? 6.5 : 11.5);
    const s = o.keep ? (small ? 0.85 + rand() * 0.95 : 0.95 + rand() * 1.5) : 0;
    o.p1 = [Math.cos(a) * r * (small ? 0.72 : 1.45), Math.sin(a) * r * 0.85, rand() * DEPTH, s];
  }

  const textures = imgs.map(img => {
    const t = new THREE.Texture(img); t.flipY = false; t.colorSpace = THREE.SRGBColorSpace; t.generateMipmaps = true;
    t.minFilter = THREE.LinearMipmapLinearFilter; t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy()); t.needsUpdate = true; return t;
  });
  const uniforms = {
    uP: { value: 0 }, uTravel: { value: 0 }, uDepth: { value: DEPTH }, uFar: { value: FAR }, uHover: { value: -1 }, uTime: { value: 0 },
    uTintK: { value: 0.6 }, uBg: { value: new THREE.Color(0x09090b) }, uAccent: { value: new THREE.Color(0xff5a1f) }, uWobble: { value: reduced ? 0 : 1 },
  };
  const vert = /* glsl */`
    attribute vec4 aP0; attribute vec4 aP1; attribute vec4 aTint; attribute vec4 aRect; attribute float aId;
    uniform float uP, uTravel, uDepth, uHover, uTime, uWobble;
    varying vec2 vUv; varying vec2 vLocal; varying float vDepth; varying float vHover; varying float vTintAmt; varying float vRound; varying vec3 vTint;
    float ease(float t) { return t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0; }
    void main() {
      float q = ease(clamp((uP - aTint.w) / 0.45, 0.0, 1.0));
      float zt = mod(aP1.z + uTravel, uDepth) - uDepth + 4.5;
      vec3 p0 = aP0.xyz; p0.z += sin(uTime * 0.7 + aP0.x * 1.9 + aP0.y * 1.3) * 0.05 * uWobble;
      vec3 pos = mix(p0, vec3(aP1.xy, zt), q);
      pos.z += sin(q * 3.14159) * 3.0;
      float h = 1.0 - step(0.5, abs(aId - uHover));
      float s = mix(aP0.w, aP1.w, q) * (1.0 + h * mix(1.6, 0.06, q));
      pos.z += h * (1.0 - q) * 0.9;
      vec4 mv = modelViewMatrix * vec4(pos + position * s, 1.0);
      vUv = vec2(aRect.x + uv.x * aRect.z, aRect.y + (1.0 - uv.y) * aRect.w);
      vLocal = uv; vDepth = -mv.z; vHover = h; vTint = aTint.rgb; vTintAmt = 1.0 - q; vRound = mix(0.06, 0.028, q);
      gl_Position = projectionMatrix * mv;
    }`;
  const frag = /* glsl */`
    uniform sampler2D uMap; uniform float uFar; uniform float uTintK; uniform vec3 uBg; uniform vec3 uAccent;
    varying vec2 vUv; varying vec2 vLocal; varying float vDepth; varying float vHover; varying float vTintAmt; varying float vRound; varying vec3 vTint;
    float rbox(vec2 p, vec2 b, float r) { vec2 q = abs(p) - b + r; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r; }
    void main() {
      vec2 p = (vLocal - 0.5) * vec2(1.0, 0.75);
      float d = rbox(p, vec2(0.5, 0.375), vRound);
      if (d > 0.0) discard;
      vec3 c = texture2D(uMap, vUv).rgb;
      c = mix(c, vTint, vTintAmt * uTintK * (1.0 - vHover));
      float fade = pow(smoothstep(uFar, uFar * 0.1, vDepth), 1.3) * smoothstep(0.3, 2.4, vDepth);
      vec3 col = mix(uBg, c, fade);
      col = mix(col, uAccent, smoothstep(-0.014, 0.0, d) * vHover * fade);
      gl_FragColor = vec4(col, 1.0);
      #include <colorspace_fragment>
    }`;
  const plane = new THREE.PlaneGeometry(1, 0.75);
  const groups = textures.map(() => []);
  inst.forEach((o, i) => { o.id = i; groups[Math.floor(o.k / L.per)].push(o); });
  groups.forEach((list, a) => {
    if (!list.length) return;
    const g = new THREE.InstancedBufferGeometry();
    g.index = plane.index; g.setAttribute('position', plane.getAttribute('position')); g.setAttribute('uv', plane.getAttribute('uv'));
    const n = list.length, P0 = new Float32Array(n * 4), P1 = new Float32Array(n * 4), T = new Float32Array(n * 4), RC = new Float32Array(n * 4), ID = new Float32Array(n);
    list.forEach((o, j) => {
      P0.set(o.p0, j * 4); P1.set(o.p1, j * 4); T.set([...o.tint, o.delay], j * 4); ID[j] = o.id;
      const jj = o.k % L.per, x = (jj % L.cols) * L.cw + L.pad, y = Math.floor(jj / L.cols) * L.ch + L.pad, H = L.heights[a];
      RC.set([x / L.w, y / H, L.tw / L.w, L.th / H], j * 4);
    });
    g.setAttribute('aP0', new THREE.InstancedBufferAttribute(P0, 4)); g.setAttribute('aP1', new THREE.InstancedBufferAttribute(P1, 4));
    g.setAttribute('aTint', new THREE.InstancedBufferAttribute(T, 4)); g.setAttribute('aRect', new THREE.InstancedBufferAttribute(RC, 4));
    g.setAttribute('aId', new THREE.InstancedBufferAttribute(ID, 1)); g.instanceCount = n;
    const mat = new THREE.ShaderMaterial({ uniforms: { ...uniforms, uMap: { value: textures[a] } }, vertexShader: vert, fragmentShader: frag });
    const mesh = new THREE.Mesh(g, mat); mesh.frustumCulled = false; scene.add(mesh);
  });

  // ---------- input
  const TRANS = 34;
  let target = 0, travel = 0, lastInput = 0, dragging = false, dragY = 0, moved = 0, pointerIn = false;
  const pointer = new THREE.Vector2(0, 0), look = new THREE.Vector2(); let tipX = 0, tipY = 0;
  const blocked = () => openName || body.classList.contains('lb-open');
  const push = d => { if (blocked()) return; target = Math.max(0, target + d); lastInput = performance.now(); };
  addEventListener('wheel', e => { if (blocked()) return; e.preventDefault(); push(e.deltaY * (e.deltaMode === 1 ? 0.6 : 0.016)); }, { passive: false });
  canvas.addEventListener('pointerdown', e => { dragging = true; dragY = e.clientY; moved = 0; canvas.classList.add('dragging'); try { canvas.setPointerCapture(e.pointerId); } catch {} });
  canvas.addEventListener('pointermove', e => {
    pointerIn = true; pointer.set(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight) * 2 + 1); tipX = e.clientX; tipY = e.clientY;
    if (dragging) { const dy = e.clientY - dragY; dragY = e.clientY; moved += Math.abs(dy); push(-dy * (small ? 0.09 : 0.06)); }
  });
  const endDrag = () => { dragging = false; canvas.classList.remove('dragging'); };
  canvas.addEventListener('pointerup', e => {
    const click = moved < 6; endDrag();
    if (click) { pointerIn = true; pointer.set(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight) * 2 + 1); const id = pick(); if (id >= 0) activateTile(inst[id].k); }
  });
  canvas.addEventListener('pointercancel', endDrag);
  canvas.addEventListener('pointerleave', () => { pointerIn = false; });
  addEventListener('keydown', e => {
    if (blocked() || e.target.closest('input,textarea')) return;
    const k = { ArrowDown: 6, PageDown: 18, ' ': 18, ArrowUp: -6, PageUp: -18 }[e.key];
    if (k) { e.preventDefault(); push(k); }
  });
  document.getElementById('explore').addEventListener('click', () => { target = Math.max(target, TRANS + 6); lastInput = performance.now(); });

  // ---------- CPU picking (mirrors the vertex shader)
  const ease = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const v4 = new THREE.Vector4(), VP = new THREE.Matrix4();
  function pick() {
    if (blocked() || !pointerIn) return -1;
    VP.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    const e = camera.projectionMatrix.elements, p = travel / TRANS;
    let best = -1, bw = 1e9;
    for (let i = 0; i < N; i++) {
      const o = inst[i]; const q = ease(Math.min(1, Math.max(0, (p - o.delay) / 0.45)));
      const s = o.p0[3] + (o.p1[3] - o.p0[3]) * q; if (s < 0.02) continue;
      const zt = ((o.p1[2] + travel) % DEPTH + DEPTH) % DEPTH - DEPTH + 4.5;
      const x = o.p0[0] + (o.p1[0] - o.p0[0]) * q, y = o.p0[1] + (o.p1[1] - o.p0[1]) * q, z = o.p0[2] + (zt - o.p0[2]) * q + Math.sin(q * Math.PI) * 3;
      v4.set(x, y, z, 1).applyMatrix4(VP); const w = v4.w; if (w < 1.2 || w > FAR * 0.7 || w > bw) continue;
      const hx = s * 0.5 * e[0] / w, hy = s * 0.375 * e[5] / w;
      if (Math.abs(v4.x / w - pointer.x) < hx && Math.abs(v4.y / w - pointer.y) < hy) { best = i; bw = w; }
    }
    return best;
  }

  // ---------- frame loop
  const tip = document.getElementById('tip'), progress = document.getElementById('progress'), hudLabel = document.getElementById('hudLabel');
  const hudIdle = `<b>${tiles.length}</b> pieces of work · scroll, drag or swipe`;
  let hovered = -1, t0 = performance.now(), visible = true, frame = 0;
  document.addEventListener('visibilitychange', () => { visible = !document.hidden; if (visible) { t0 = performance.now(); loop(); } });
  function resize() {
    const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h;
    camera.fov = w / h < 0.8 ? 66 : 52; camera.updateProjectionMatrix();
  }
  addEventListener('resize', resize); resize();
  const rest = new THREE.Vector2();

  function loop() {
    if (!visible) return; requestAnimationFrame(loop); frame++;
    const now = performance.now(), dt = Math.min(0.05, (now - t0) / 1000); t0 = now;
    if (!reduced && travel / TRANS > 1.05 && now - lastInput > 3000 && !blocked() && !dragging) target += dt * 1.3;
    travel += (target - travel) * (1 - Math.pow(0.0012, dt));
    uniforms.uP.value = travel / TRANS; uniforms.uTravel.value = travel; uniforms.uTime.value = now / 1000;
    body.classList.toggle('flying', travel / TRANS > 0.1);
    progress.style.transform = `scaleX(${travel > TRANS ? (((travel - TRANS) % DEPTH) / DEPTH).toFixed(4) : 0})`;

    look.lerp(pointerIn && !small ? pointer : rest, reduced ? 0.02 : 0.045);
    camera.position.x = look.x * 0.9; camera.position.y = look.y * 0.6;
    camera.lookAt(look.x * 0.25, look.y * 0.15, -30); camera.updateMatrixWorld();

    if (!small && (frame & 1) === 0) {
      const id = pick();
      if (id !== hovered) {
        hovered = id; uniforms.uHover.value = id;
        if (id >= 0) { const t = tiles[inst[id].k]; tip.innerHTML = label(t); tip.classList.add('on'); canvas.classList.add('pointing'); hudLabel.innerHTML = label(t); }
        else { tip.classList.remove('on'); canvas.classList.remove('pointing'); hudLabel.innerHTML = hudIdle; }
      }
      if (hovered >= 0) { tip.style.left = tipX + 'px'; tip.style.top = tipY + 'px'; }
    }
    renderer.render(scene, camera);
  }
  hudLabel.innerHTML = hudIdle;
  textures.forEach(t => renderer.initTexture(t));
  loop();
  pctEl.textContent = '100%';
  requestAnimationFrame(() => requestAnimationFrame(() => { body.classList.remove('loading'); if (initial) openPanel(initial); }));
}
