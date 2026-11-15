import * as THREE from 'three';

const root = document.documentElement;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(pointer: fine)').matches;
const small = innerWidth < 760 || matchMedia('(pointer: coarse)').matches;
const gsap = window.gsap, ScrollTrigger = window.ScrollTrigger;
const hasGsap = !!(gsap && ScrollTrigger);
if (hasGsap) gsap.registerPlugin(ScrollTrigger);
const MAIL = 'harshnigam788@gmail.com';
const API = 'https://harshnigam788-ui.github.io/portfolio/resume/resume.json';
const PLATE = { valintry360: '#0b1f3a', valintry: '#ffffff', ignitehcm: '#1b1719', bullseye: '#ffffff', calance: '#ffffff', prateek: '#0b2a4a', tag: '#141414', advayan: '#0a0f3d', zapfire: '#1a1210', iinfotanks: '#ffffff' };
const TYPES = ['Homepage', 'Service page', 'Case study', 'Blog', 'Brand page'];
const pad4 = n => String(n).padStart(4, '0');
const esc = s => String(s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const wfSec = document.getElementById('archive');

/* ================================================================ clock, toast, copy */
const fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' });
const tick = () => { const t = fmt.format(new Date()); document.querySelectorAll('.js-clock').forEach(c => { c.textContent = t; }); };
tick(); setInterval(tick, 15000);
const toast = document.getElementById('toast'); let tt;
function say(m) { toast.textContent = m; toast.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove('show'), 2400); }
async function copyText(text, label) {
  try { await navigator.clipboard.writeText(text); say(`${label} copied — ${text}`); }
  catch { say(`${label}: ${text}`); }
}
document.getElementById('copyMail').addEventListener('click', () => copyText(MAIL, 'Email'));
document.getElementById('copyApi').addEventListener('click', () => copyText(API, 'JSON URL'));

/* ================================================================ smooth scroll */
let lenis = null;
if (!reduce && window.Lenis && hasGsap) {
  try {
    lenis = new window.Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  } catch { lenis = null; }
}
function goTo(target) {
  if (!target) return;
  if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.6 });
  else target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
}
document.querySelectorAll('[data-scroll]').forEach(a => a.addEventListener('click', ev => {
  const target = document.querySelector(a.getAttribute('href')); if (!target) return;
  ev.preventDefault(); goTo(target);
}));

/* ================================================================ cursor */
const cur = document.querySelector('.cursor'), curLabel = cur.querySelector('span');
let setCursor = () => {};
if (fine && !reduce) {
  let mx = -100, my = -100, cx = -100, cy = -100;
  addEventListener('pointermove', e => { mx = e.clientX; my = e.clientY; root.classList.add('has-cursor'); }, { passive: true });
  document.addEventListener('pointerleave', () => root.classList.remove('has-cursor'));
  (function loop() { cx += (mx - cx) * 0.2; cy += (my - cy) * 0.2; cur.style.transform = `translate(${cx}px,${cy}px)`; requestAnimationFrame(loop); })();
  setCursor = label => { if (label) { curLabel.textContent = label; cur.classList.add('big'); } else cur.classList.remove('big'); };
  document.addEventListener('pointerover', e => { const el = e.target.closest('[data-cursor]'); if (el) setCursor(el.dataset.cursor); });
  document.addEventListener('pointerout', e => { const el = e.target.closest('[data-cursor]'); if (el && !el.contains(e.relatedTarget)) setCursor(null); });
}

/* ================================================================ hero + statement + reveals */
if (hasGsap && !reduce) {
  gsap.from('.hero-name .rv', { yPercent: 105, duration: 1.4, ease: 'expo.out', stagger: 0.12, delay: 0.1 });
  gsap.from('.hero-fig', { clipPath: 'inset(100% 0 0 0)', duration: 1.4, ease: 'expo.inOut', delay: 0.25 });
  gsap.from('.hero-fig img', { scale: 1.25, duration: 1.8, ease: 'expo.out', delay: 0.25 });
  gsap.from('.hero-corners p, .hero-fig figcaption', { y: 16, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.08, delay: 0.9 });
  gsap.to('.hn-l', { xPercent: -14, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hn-r', { xPercent: 14, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero-fig', { yPercent: -18, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
}
(() => {
  const big = document.getElementById('big');
  const wrap = node => {
    [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(p => { if (!p) return; if (/^\s+$/.test(p)) frag.appendChild(document.createTextNode(p)); else { const s = document.createElement('span'); s.className = 'w'; s.textContent = p; frag.appendChild(s); } });
        n.replaceWith(frag);
      } else wrap(n);
    });
  };
  wrap(big);
  const words = [...big.querySelectorAll('.w')];
  if (!hasGsap || reduce) { words.forEach(w => w.classList.add('on')); return; }
  ScrollTrigger.create({ trigger: big, start: 'top 82%', end: 'bottom 45%', scrub: true,
    onUpdate: s => { const n = Math.round(s.progress * words.length); words.forEach((w, i) => w.classList.toggle('on', i < n)); } });
})();
const revealEls = document.querySelectorAll('.sec-head > *, .row, .svc li, .nums > div, .note, .ab-story p, .path li, .kit, .rs-row > *, .ct-grid a, .facts > div, .mail, .huge, .contact .label');
if (!reduce && 'IntersectionObserver' in window) {
  revealEls.forEach(el => el.classList.add('reveal'));
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  revealEls.forEach((el, i) => { el.style.transitionDelay = `${(i % 4) * 60}ms`; io.observe(el); });
}

/* ================================================================ data for work, index, lightbox */
const [TD, MD] = await Promise.all([fetch('data/tiles.json').then(r => r.json()), fetch('data/mosaic.json').then(r => r.json())]);
const tiles = TD.tiles, NAMES = TD.names;
const pages = tiles.filter(t => t.url).map(t => t.i);
document.getElementById('wfCount').textContent = tiles.length;
document.getElementById('wfPages').textContent = pages.length;
document.querySelectorAll('[data-count]:not(.num-grid [data-count])').forEach(el => { el.textContent = TD.counts[el.dataset.count] || 0; });
document.getElementById('idxCount').textContent = `${pages.length} pages · ${tiles.length} tiles`;
const label = t => t.url ? `<b>${esc(NAMES[t.c])}</b> · ${esc(t.t)} <i>— ${esc(t.title)}</i>` : t.label;

/* ================================================================ overlays */
const drawer = document.getElementById('drawer'), lbEl = document.getElementById('lightbox');
const lock = on => { root.classList.toggle('locked', on); if (lenis) on ? lenis.stop() : lenis.start(); };
const anyOpen = () => drawer.classList.contains('open') || root.classList.contains('lb');
function openIndex(client) {
  buildIndex(); fClient = client || 'all'; fType = 'all'; renderIndex();
  drawer.classList.add('open'); drawer.setAttribute('aria-hidden', 'false'); lock(true);
  setTimeout(() => drawer.querySelector('.x').focus({ preventScroll: true }), 60);
}
function closeIndex() { drawer.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true'); if (!root.classList.contains('lb')) lock(false); }
document.addEventListener('click', e => {
  const ix = e.target.closest('[data-index]');
  if (ix) { e.preventDefault(); openIndex(ix.dataset.index); return; }
  if (e.target.closest('[data-lbclose]')) { closeLightbox(); return; }
  if (e.target.closest('[data-close]')) { if (root.classList.contains('lb')) closeLightbox(); else closeIndex(); }
});
addEventListener('keydown', e => {
  if (root.classList.contains('lb')) {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') lbStep(1);
    if (e.key === 'ArrowLeft') lbStep(-1);
  } else if (e.key === 'Escape' && drawer.classList.contains('open')) closeIndex();
});

let fClient = 'all', fType = 'all', indexBuilt = false;
const grid = document.getElementById('grid');
function buildIndex() {
  if (indexBuilt) return; indexBuilt = true;
  const byC = {}; pages.forEach(i => { const c = tiles[i].c; byC[c] = (byC[c] || 0) + 1; });
  const fc = document.getElementById('fClient'), ft = document.getElementById('fType');
  fc.innerHTML = `<button data-fc="all">All clients<small>${pages.length}</small></button>` + Object.keys(NAMES).filter(c => byC[c]).map(c => `<button data-fc="${c}">${esc(NAMES[c])}<small>${byC[c]}</small></button>`).join('');
  ft.innerHTML = `<button data-ft="all">All types</button>` + TYPES.map(t => `<button data-ft="${t}">${t === 'Case study' ? 'Case studies' : t + 's'}</button>`).join('');
  fc.addEventListener('click', e => { const b = e.target.closest('[data-fc]'); if (b) { fClient = b.dataset.fc; renderIndex(); } });
  ft.addEventListener('click', e => { const b = e.target.closest('[data-ft]'); if (b) { fType = b.dataset.ft; renderIndex(); } });
  grid.addEventListener('click', e => { const c = e.target.closest('[data-i]'); if (c) openLightbox(+c.dataset.i, currentList()); });
}
const currentList = () => pages.filter(i => (fClient === 'all' || tiles[i].c === fClient) && (fType === 'all' || tiles[i].t === fType));
function renderIndex() {
  document.querySelectorAll('[data-fc]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.fc === fClient)));
  document.querySelectorAll('[data-ft]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.ft === fType)));
  grid.innerHTML = currentList().map(i => { const t = tiles[i]; return `<button class="card" data-i="${i}"><div class="im"><img loading="lazy" decoding="async" src="thumb/${pad4(i)}.webp" alt=""></div><p class="cm">${esc(NAMES[t.c])} · ${esc(t.t)}</p><p class="ct">${esc(t.title)}</p></button>`; }).join('')
    || '<p class="lede">Nothing matches that filter yet.</p>';
  grid.closest('.drawer-body').scrollTop = 0;
}

const lb = { img: document.getElementById('lbImg'), logo: document.getElementById('lbLogo'), client: document.getElementById('lbClient'), type: document.getElementById('lbType'),
  title: document.getElementById('lbTitle'), url: document.getElementById('lbUrl'), link: document.getElementById('lbLink'), pos: document.getElementById('lbPos'),
  prev: document.getElementById('lbPrev'), next: document.getElementById('lbNext') };
let lbList = [], lbAt = 0;
lb.img.addEventListener('load', () => lb.img.classList.add('ready'));
function openLightbox(i, list) {
  lbList = list && list.includes(i) ? list : pages.filter(j => tiles[j].c === tiles[i].c);
  lbAt = Math.max(0, lbList.indexOf(i)); showLb(); root.classList.add('lb'); lbEl.setAttribute('aria-hidden', 'false'); lock(true);
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
function closeLightbox() { root.classList.remove('lb'); lbEl.setAttribute('aria-hidden', 'true'); if (!drawer.classList.contains('open')) lock(false); }
function activateTile(i) {
  const t = tiles[i];
  if (t.url) openLightbox(i);
  else if (t.c) openIndex(t.c);
  else goTo(document.getElementById(t.open === 'about' ? 'services' : 'work'));
}


/* ================================================================ work rows: hover preview */
(() => {
  const pv = document.querySelector('.preview'), img = pv.querySelector('img');
  const best = {};
  for (const t of tiles) {
    if (!t.url) continue;
    const rank = { Homepage: 0, 'Case study': 1, 'Service page': 2, Blog: 3, 'Brand page': 4 }[t.t] ?? 5;
    if (!best[t.c] || rank < best[t.c][1]) best[t.c] = [t.i, rank];
  }
  if (!fine) return;
  let x = 0, y = 0, px = 0, py = 0, on = false;
  const rows = document.getElementById('rows');
  rows.addEventListener('pointerover', e => { const r = e.target.closest('.row'); if (!r) return; const b = best[r.dataset.index]; if (!b) return; img.src = `work/${pad4(b[0])}.webp`; pv.classList.add('on'); on = true; });
  rows.addEventListener('pointerleave', () => { pv.classList.remove('on'); on = false; });
  addEventListener('pointermove', e => { x = e.clientX; y = e.clientY; }, { passive: true });
  (function loop() {
    px += (x - px) * 0.14; py += (y - py) * 0.14;
    if (on) {
      const el = document.elementFromPoint(x, y);
      if (!el || !el.closest('#rows')) { pv.classList.remove('on'); on = false; }
      else { pv.style.left = `${px + 30}px`; pv.style.top = `${py - 120}px`; }
    }
    requestAnimationFrame(loop);
  })();
})();

/* ================================================================ WORK: portrait made of work */
const V = small ? 'sm' : 'lg';
const wfCanvas = document.getElementById('wf'), wfLoad = document.getElementById('wfLoad'), wfPct = document.getElementById('wfPct');
let started = false;
const startWork = () => { if (started) return; started = true; workScene().catch(err => { console.error(err); wfLoad.textContent = 'The 3D view could not load here — browse all pages instead.'; }); };
new IntersectionObserver((es, ob) => es.forEach(e => { if (e.isIntersecting) { startWork(); ob.disconnect(); } }), { rootMargin: '200% 0px' }).observe(wfSec);
setTimeout(startWork, 3500);

async function loadAtlases() {
  const L = TD.layout[V];
  const urls = Array.from({ length: L.count }, (_, a) => `atlas/${V}-${a}.webp`);
  const got = new Array(urls.length).fill(0), tot = new Array(urls.length).fill(0);
  const show = () => { const t = tot.reduce((a, b) => a + b, 0), g = got.reduce((a, b) => a + b, 0); wfPct.textContent = (t ? Math.min(99, Math.round(g / t * 100)) : 0) + '%'; };
  return Promise.all(urls.map(async (u, a) => {
    const res = await fetch(u); tot[a] = +res.headers.get('content-length') || 2e6; let blob;
    if (res.body && res.body.getReader) {
      const rd = res.body.getReader(), parts = [];
      for (;;) { const { done, value } = await rd.read(); if (done) break; parts.push(value); got[a] += value.length; show(); }
      blob = new Blob(parts, { type: 'image/webp' });
    } else { blob = await res.blob(); got[a] = tot[a]; show(); }
    const img = new Image(); img.src = URL.createObjectURL(blob); await img.decode(); return img;
  }));
}

async function workScene() {
  const imgs = await loadAtlases();
  const L = TD.layout[V], M = MD[V];
  const renderer = new THREE.WebGLRenderer({ canvas: wfCanvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, small ? 1.75 : 2)); renderer.setClearColor(0x0E0E0E, 1);
  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(52, 1, 0.1, 400); camera.position.set(0, 0, 6);

  const rand = (() => { let s = 20261115; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();
  const C = M.cols, R = M.rows;
  const PH = small ? 15 : 16.5, cellH = PH / R, cellW = cellH * 4 / 3, PZ = -14;
  let CX = 0, CY = 0;
  const toLin = v => Math.pow(v, 2.2);
  const inst = [], used = new Set();
  for (const [cx, cy, k, r, g, b, lum] of M.cells) {
    used.add(k);
    const x = (cx - C / 2 + 0.5) * cellW, y = (R / 2 - cy - 0.5) * cellH;
    const dn = Math.min(1, Math.hypot(x / (C * cellW * 0.5), y / (PH * 0.5)));
    inst.push({ k, p0: [x, y, PZ + (lum - 0.45) * 0.7 + (rand() - 0.5) * 0.18, cellW * 0.94], tint: [toLin(r), toLin(g), toLin(b)], delay: 0.55 * (0.55 * rand() + 0.45 * dn) });
  }
  for (const t of tiles) if (!used.has(t.i)) { const a = rand() * 6.283, rr = 14 + rand() * 10; inst.push({ k: t.i, p0: [Math.cos(a) * rr, Math.sin(a) * rr * 0.7, PZ - 30 - rand() * 30, 0], tint: [0, 0, 0], delay: 0.2 + rand() * 0.35 }); }
  const N = inst.length, seen = new Set(), KEEP = small ? 0.2 : 0.18;
  inst.forEach(o => { o.keep = !seen.has(o.k) || rand() < KEEP; seen.add(o.k); });
  const kept = inst.filter(o => o.keep).length;
  const DEPTH = Math.max(small ? 180 : 240, kept * (small ? 0.16 : 0.12)), FAR = small ? 110 : 150;
  for (const o of inst) {
    const a = rand() * Math.PI * 2, r = 2.4 + Math.pow(rand(), 0.8) * (small ? 6.5 : 11.5);
    o.p1 = [Math.cos(a) * r * (small ? 0.72 : 1.45), Math.sin(a) * r * 0.85, rand() * DEPTH, o.keep ? (small ? 0.85 + rand() * 0.95 : 0.95 + rand() * 1.5) : 0];
  }
  const textures = imgs.map(img => { const t = new THREE.Texture(img); t.flipY = false; t.colorSpace = THREE.SRGBColorSpace; t.minFilter = THREE.LinearMipmapLinearFilter; t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy()); t.needsUpdate = true; return t; });
  const U = {
    uP: { value: 0 }, uTravel: { value: 0 }, uDepth: { value: DEPTH }, uFar: { value: FAR }, uHover: { value: -1 }, uTime: { value: 0 }, uShift: { value: new THREE.Vector2() },
    uTintK: { value: small ? 0.76 : 0.74 }, uBg: { value: new THREE.Color(0x0E0E0E) }, uAccent: { value: new THREE.Color(0xFF4D12) }, uWobble: { value: reduce ? 0 : 1 },
  };
  const vert = `
    attribute vec4 aP0; attribute vec4 aP1; attribute vec4 aTint; attribute vec4 aRect; attribute float aId;
    uniform float uP, uTravel, uDepth, uHover, uTime, uWobble; uniform vec2 uShift;
    varying vec2 vUv; varying vec2 vLocal; varying float vDepth; varying float vHover; varying float vTintAmt; varying float vRound; varying vec3 vTint;
    float ease(float t) { return t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0; }
    void main() {
      float q = ease(clamp((uP - aTint.w) / 0.45, 0.0, 1.0));
      float zt = mod(aP1.z + uTravel, uDepth) - uDepth + 4.5;
      vec3 p0 = aP0.xyz + vec3(uShift, 0.0); p0.z += sin(uTime * 0.7 + aP0.x * 1.9 + aP0.y * 1.3) * 0.05 * uWobble;
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
  const frag = `
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
  const plane = new THREE.PlaneGeometry(1, 0.75), groups = textures.map(() => []);
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
    const mesh = new THREE.Mesh(g, new THREE.ShaderMaterial({ uniforms: { ...U, uMap: { value: textures[a] } }, vertexShader: vert, fragmentShader: frag }));
    mesh.frustumCulled = false; scene.add(mesh);
  });

  // ---------- scroll drives the flight; pointer only hovers and clicks
  const TRANS = 34, FLY = small ? 150 : 210, HOLD = 0.07;
  let travel = 0, pointerIn = false, tipX = 0, tipY = 0, inView = false;
  const pointer = new THREE.Vector2(), look = new THREE.Vector2(), rest = new THREE.Vector2();
  new IntersectionObserver(es => es.forEach(e => { inView = e.isIntersecting; }), { threshold: 0 }).observe(wfSec);
  const progress = () => { const r = wfSec.getBoundingClientRect(); return Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - innerHeight))); };
  const setPointer = e => { const r = wfCanvas.getBoundingClientRect(); pointer.set((e.clientX - r.left) / r.width * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); tipX = e.clientX; tipY = e.clientY; };
  wfCanvas.addEventListener('pointermove', e => { pointerIn = true; setPointer(e); });
  wfCanvas.addEventListener('pointerleave', () => { pointerIn = false; });
  let downAt = null;
  wfCanvas.addEventListener('pointerdown', e => { downAt = [e.clientX, e.clientY, scrollY]; });
  wfCanvas.addEventListener('pointerup', e => {
    if (!downAt || Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1]) > 8 || Math.abs(scrollY - downAt[2]) > 8) return;
    pointerIn = true; setPointer(e); const id = pick(); if (id >= 0) activateTile(inst[id].k);
  });

  const ease = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const v4 = new THREE.Vector4(), VP = new THREE.Matrix4();
  function pick() {
    if (anyOpen() || !pointerIn) return -1;
    VP.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    const e = camera.projectionMatrix.elements, p = travel / TRANS, sx = U.uShift.value.x, sy = U.uShift.value.y;
    let best = -1, bw = 1e9;
    for (let i = 0; i < N; i++) {
      const o = inst[i], qq = ease(Math.min(1, Math.max(0, (p - o.delay) / 0.45)));
      const s = o.p0[3] + (o.p1[3] - o.p0[3]) * qq; if (s < 0.02) continue;
      const zt = ((o.p1[2] + travel) % DEPTH + DEPTH) % DEPTH - DEPTH + 4.5;
      const x0 = o.p0[0] + sx, y0 = o.p0[1] + sy;
      const x = x0 + (o.p1[0] - x0) * qq, y = y0 + (o.p1[1] - y0) * qq, z = o.p0[2] + (zt - o.p0[2]) * qq + Math.sin(qq * Math.PI) * 3;
      v4.set(x, y, z, 1).applyMatrix4(VP); const w = v4.w; if (w < 1.2 || w > FAR * 0.7 || w > bw) continue;
      const hx = s * 0.5 * e[0] / w, hy = s * 0.375 * e[5] / w;
      if (Math.abs(v4.x / w - pointer.x) < hx && Math.abs(v4.y / w - pointer.y) < hy) { best = i; bw = w; }
    }
    return best;
  }

  const tip = document.getElementById('tip'), bar = document.getElementById('wfBar'), hud = document.getElementById('wfLabel');
  const hudIdle = small ? `<b>${tiles.length}</b> pieces · tap to open` : `<b>${tiles.length}</b> pieces of work · hover to see, click to open`;
  if (small) { const l = document.querySelector('.ar-copy .lede'); if (l) l.innerHTML = l.innerHTML.replace("Hover to see what's what, click to open one.", 'Tap any tile to open it.'); }
  hud.innerHTML = hudIdle;
  let hovered = -1, t0 = performance.now(), frame = 0;
  function resize() {
    const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h;
    camera.fov = w / h < 0.8 ? 64 : 52; camera.updateProjectionMatrix();
    // desktop: portrait sits right of the copy; mobile: centred, lifted above the copy
    const halfW = Math.tan(camera.fov * Math.PI / 360) * 20 * camera.aspect;
    CX = w / h >= 0.8 ? Math.min(halfW * 0.42, halfW - C * cellW * 0.5 - 0.6) : 0; CY = w / h >= 0.8 ? -0.4 : 2.6;
    U.uShift.value.set(CX, CY);
  }
  addEventListener('resize', resize); resize();
  function loop() {
    requestAnimationFrame(loop);
    if (!inView) { if (hovered >= 0) { hovered = -1; U.uHover.value = -1; tip.classList.remove('on'); } return; }
    frame++;
    const now = performance.now(); t0 = now;
    const pr = progress(), target = pr < HOLD ? 0 : (pr - HOLD) / (1 - HOLD) * (TRANS + FLY);
    travel += (target - travel) * (reduce ? 1 : 0.12);
    U.uP.value = travel / TRANS; U.uTravel.value = travel; U.uTime.value = now / 1000;
    wfSec.classList.toggle('flying', travel > 3);
    bar.style.transform = `scaleX(${pr.toFixed(4)})`;
    look.lerp(pointerIn && !small ? pointer : rest, reduce ? 0.02 : 0.045);
    camera.position.x = look.x * 0.9; camera.position.y = look.y * 0.6;
    camera.lookAt(look.x * 0.25, look.y * 0.15, -30); camera.updateMatrixWorld();
    if (!small && (frame & 1) === 0) {
      const id = pick();
      if (id !== hovered) {
        hovered = id; U.uHover.value = id;
        if (id >= 0) { const t = tiles[inst[id].k]; tip.innerHTML = label(t); tip.classList.add('on'); wfCanvas.classList.add('pointing'); hud.innerHTML = label(t); setCursor('Open'); }
        else { tip.classList.remove('on'); wfCanvas.classList.remove('pointing'); hud.innerHTML = hudIdle; setCursor(null); }
      }
      if (hovered >= 0) { tip.style.left = tipX + 'px'; tip.style.top = tipY + 'px'; }
    }
    renderer.render(scene, camera);
  }
  textures.forEach(t => renderer.initTexture(t));
  wfPct.textContent = '100%'; wfLoad.classList.add('done');
  loop();
}
