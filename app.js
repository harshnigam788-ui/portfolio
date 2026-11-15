import * as THREE from 'three';

const root = document.documentElement;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobile = matchMedia('(max-width: 760px)').matches;
const fine = matchMedia('(pointer: fine)').matches;
const small = innerWidth < 760 || matchMedia('(pointer: coarse)').matches;
const gsap = window.gsap, ScrollTrigger = window.ScrollTrigger;
const hasGsap = !!(gsap && ScrollTrigger);
if (hasGsap) gsap.registerPlugin(ScrollTrigger);
const MAIL = 'harshnigam788@gmail.com';
const PLATE = { valintry360: '#0b1f3a', valintry: '#ffffff', ignitehcm: '#1b1719', bullseye: '#ffffff', calance: '#ffffff', prateek: '#0b2a4a', tag: '#141414', advayan: '#0a0f3d', zapfire: '#1a1210', iinfotanks: '#ffffff' };
const TYPES = ['Homepage', 'Service page', 'Case study', 'Blog', 'Brand page'];
const pad4 = n => String(n).padStart(4, '0');
const esc = s => String(s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ================================================================ clock, toast, copy */
const clocks = [document.getElementById('clock'), document.getElementById('clock2')].filter(Boolean);
const fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' });
const tick = () => { const t = fmt.format(new Date()); clocks.forEach(c => { c.textContent = t; }); };
tick(); setInterval(tick, 15000);

const toast = document.getElementById('toast'); let tt;
function say(m) { toast.textContent = m; toast.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove('show'), 2400); }
async function copyText(text, el, label) {
  try { await navigator.clipboard.writeText(text); say(`${label} copied: ${text}`); }
  catch { const r = document.createRange(); r.selectNodeContents(el); const s = getSelection(); s.removeAllRanges(); s.addRange(r); say('Selected. Press Ctrl/Cmd + C to copy.'); }
}
document.getElementById('copyMail').addEventListener('click', () => copyText(MAIL, document.getElementById('mail'), 'Email'));
document.querySelectorAll('[data-copy]').forEach(b => b.addEventListener('click', () => { const el = document.getElementById(b.dataset.copy); copyText(el.textContent, el, 'Link'); }));

/* ================================================================ grain */
(() => {
  const c = document.getElementById('grain'); const x = c.getContext('2d'); c.width = 160; c.height = 160;
  const img = x.createImageData(160, 160);
  for (let i = 0; i < img.data.length; i += 4) { const v = Math.random() * 255 | 0; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255; }
  x.putImageData(img, 0, 0); c.style.imageRendering = 'pixelated';
})();

/* ================================================================ type splitting */
document.querySelectorAll('[data-split]').forEach(el => {
  const t = el.textContent; el.textContent = '';
  t.split('').forEach(ch => { const s = document.createElement('span'); s.className = 'ch'; s.textContent = ch; s.setAttribute('aria-hidden', 'true'); el.appendChild(s); });
});
const man = document.getElementById('manifesto');
(() => {
  const nodes = [...man.childNodes]; man.innerHTML = '';
  nodes.forEach(n => {
    if (n.nodeType === 3) n.textContent.split(/(\s+)/).forEach(part => {
      if (!part) return;
      if (/^\s+$/.test(part)) { man.appendChild(document.createTextNode(part)); return; }
      const s = document.createElement('span'); s.className = 'w'; s.textContent = part; man.appendChild(s);
    });
    else { n.classList.add('w'); man.appendChild(n); }
  });
})();
if (!hasGsap || reduce) man.querySelectorAll('.w').forEach(w => { w.style.opacity = 1; });

/* ================================================================ smooth scroll */
let lenis = null;
if (!reduce && window.Lenis && hasGsap) {
  try {
    lenis = new window.Lenis({ lerp: 0.09, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  } catch { lenis = null; }
}
function goTo(target) {
  if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.6 });
  else target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
}
document.querySelectorAll('[data-scroll]').forEach(a => a.addEventListener('click', ev => {
  const id = a.getAttribute('href'); const target = document.querySelector(id);
  if (!target) return; ev.preventDefault(); goTo(target);
}));

/* ================================================================ cursor */
if (fine && !reduce) {
  const dot = document.querySelector('.cur'), ring = document.querySelector('.cur-ring'), lab = ring.querySelector('span');
  let mx = -100, my = -100, rx = -100, ry = -100;
  addEventListener('pointermove', e => { mx = e.clientX; my = e.clientY; root.classList.add('has-cursor'); }, { passive: true });
  document.addEventListener('pointerleave', () => root.classList.remove('has-cursor'));
  (function loop() { rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18; dot.style.transform = `translate(${mx}px,${my}px)`; ring.style.transform = `translate(${rx}px,${ry}px)`; requestAnimationFrame(loop); })();
  document.addEventListener('pointerover', e => { const el = e.target.closest('[data-cursor]'); if (el) { lab.textContent = el.dataset.cursor; ring.classList.add('big'); } });
  document.addEventListener('pointerout', e => { const el = e.target.closest('[data-cursor]'); if (el && !el.contains(e.relatedTarget)) ring.classList.remove('big'); });
  document.querySelectorAll('.magnet').forEach(el => {
    el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect(); const x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2; el.style.transform = `translate(${x * 0.18}px,${y * 0.3}px)`; });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    el.style.transition = 'transform .35s cubic-bezier(.2,.8,.2,1)';
  });
}

/* ================================================================ hero query typing */
const q = document.getElementById('qtext'), full = q.textContent;
if (!reduce) {
  q.textContent = ''; let qi = 0;
  setTimeout(function type() { q.textContent = full.slice(0, ++qi); if (qi < full.length) setTimeout(type, 38 + Math.random() * 60); }, 500);
}

/* ================================================================ GSAP motion */
if (hasGsap && !reduce) {
  gsap.fromTo('.hero-name .line', { '--wdth': 50, '--wght': 300, yPercent: 18 }, { '--wdth': 125, '--wght': 820, yPercent: 0, duration: 1.8, stagger: .14, ease: 'expo.out', delay: .15 });
  gsap.fromTo('.hero-name .line', { '--wdth': 125 }, { '--wdth': 62, immediateRender: false, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero-name', { yPercent: -30, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.from('.hero-foot > *, .cue', { y: 30, opacity: 0, duration: 1.2, stagger: .1, ease: 'expo.out', delay: .6 });
  gsap.utils.toArray('.st.vw').forEach(el => gsap.fromTo(el, { '--wdth': 54 }, { '--wdth': 112, ease: 'none', scrollTrigger: { trigger: el, start: 'top 96%', end: 'top 40%', scrub: true } }));
  gsap.to('#manifesto .w', { opacity: 1, stagger: .08, ease: 'none', scrollTrigger: { trigger: '#manifesto', start: 'top 78%', end: 'bottom 42%', scrub: true } });
  const skewTo = gsap.quickTo('.mq-track', 'skewX', { duration: .4, ease: 'power3' });
  ScrollTrigger.create({ onUpdate: s => skewTo(gsap.utils.clamp(-12, 12, s.getVelocity() / -260)) });
  gsap.utils.toArray('.numbers .lede, .numbers .eyebrow, .services .eyebrow, .services .lede, .clients-sec .eyebrow, .clients-sec .lede, .cases .eyebrow, .path .eyebrow, .kit .eyebrow, .resume .eyebrow, .contact .eyebrow, .contact .lede, .stat, .item, .kit-grid > div, .cl, .cl-also, .rs, .cdetails, .reach, .avail, .engines-row, .work > .eyebrow')
    .forEach(el => gsap.from(el, { y: 36, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 92%' } }));
  document.querySelectorAll('.num-grid [data-count]').forEach(el => {
    const end = +el.dataset.count, sup = el.querySelector('sup'), supHTML = sup ? sup.outerHTML : '';
    ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: () => { const o = { v: 0 }; gsap.to(o, { v: end, duration: 1.6, ease: 'power3.out', onUpdate: () => { el.innerHTML = Math.round(o.v) + supHTML; } }); } });
  });
  gsap.utils.toArray('[data-bar]').forEach(el => gsap.from(el, { scaleX: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 92%' } }));
  const mm = gsap.matchMedia();
  mm.add('(min-width: 900px)', () => {
    const track = document.getElementById('htrack');
    const dist = () => Math.max(0, track.scrollWidth - innerWidth);
    gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: '.services', start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1 } });
    gsap.utils.toArray('.case').forEach((card, i, all) => {
      if (i === all.length - 1) return;
      gsap.to(card, { scale: .94, filter: 'brightness(.55)', ease: 'none', scrollTrigger: { trigger: all[i + 1], start: 'top bottom', end: 'top ' + (64 + 12 + (i + 1) * 16) + 'px', scrub: true } });
    });
  });
  gsap.fromTo('#rail', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.tl', start: 'top 70%', end: 'bottom 70%', scrub: true } });
  gsap.from('.contact .st em', { '--wdth': 50, color: '#ECEEFF', ease: 'none', scrollTrigger: { trigger: '.contact', start: 'top 70%', end: 'center center', scrub: true } });
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
  else goTo(document.getElementById(t.open === 'about' ? 'numbers' : 'clients'));
}

/* ================================================================ background particle field */
const glCanvas = document.getElementById('gl');
const wfSec = document.getElementById('work');
let workVisible = false;
new IntersectionObserver(es => es.forEach(e => { workVisible = e.isIntersecting && e.intersectionRatio > 0.35; }), { threshold: [0, 0.35, 0.6] }).observe(wfSec);

(function particles() {
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas: glCanvas, alpha: true, antialias: false, powerPreference: 'high-performance' }); }
  catch { glCanvas.style.display = 'none'; return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2)); renderer.setSize(innerWidth, innerHeight, false);
  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(42, innerWidth / innerHeight, 0.1, 100); camera.position.set(0, 0, 8.2);
  const N = mobile ? 4200 : 9000, rnd = Math.random, PI = Math.PI, TAU = PI * 2;
  const seeded = s => () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
  function sphere() { const a = new Float32Array(N * 3), shellN = Math.floor(N * 0.82);
    for (let i = 0; i < N; i++) { let x, y, z;
      if (i < shellN) { const t = (i + 0.5) / shellN, phi = Math.acos(1 - 2 * t), th = PI * (1 + Math.sqrt(5)) * i, r = 2.15; x = r * Math.sin(phi) * Math.cos(th); y = r * Math.cos(phi); z = r * Math.sin(phi) * Math.sin(th); }
      else { const u = rnd(), v = rnd(), rr = 0.5 + rnd() * 1.5, ph = Math.acos(2 * v - 1), tt = TAU * u; x = rr * Math.sin(ph) * Math.cos(tt); y = rr * Math.cos(ph); z = rr * Math.sin(ph) * Math.sin(tt); }
      a[i * 3] = x; a[i * 3 + 1] = y; a[i * 3 + 2] = z; } return a; }
  function wave() { const a = new Float32Array(N * 3), side = Math.ceil(Math.sqrt(N));
    for (let i = 0; i < N; i++) { const ix = i % side, iz = Math.floor(i / side), x = (ix / side - 0.5) * 9, z = (iz / side - 0.5) * 6;
      a[i * 3] = x; a[i * 3 + 1] = 0.38 * Math.sin(x * 1.05 + z * 0.6) + 0.22 * Math.cos(z * 1.6 - x * 0.3); a[i * 3 + 2] = z; } return a; }
  function bars() { const a = new Float32Array(N * 3), B = 9, h = []; let tot = 0;
    for (let k = 0; k < B; k++) { h[k] = 0.45 * Math.pow(1.29, k); tot += h[k]; }
    for (let i = 0; i < N; i++) { let r = rnd() * tot, k2 = 0; while (r > h[k2] && k2 < B - 1) { r -= h[k2]; k2++; }
      const w = 0.34, cx = (k2 - 4) * 0.6, top = rnd() < 0.12;
      a[i * 3] = cx + (rnd() - 0.5) * w; a[i * 3 + 1] = -1.9 + (top ? h[k2] : rnd() * h[k2]); a[i * 3 + 2] = (rnd() - 0.5) * w; } return a; }
  function funnel() { const a = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) { let x, y, z;
      if (rnd() < 0.86) { const u = Math.pow(rnd(), 0.7); y = -2.0 + u * 4.1; const r = 0.16 + 2.35 * Math.pow(u, 1.9), th = rnd() * TAU; x = r * Math.cos(th); z = r * Math.sin(th); }
      else { y = -2.0 - rnd() * 1.4; const r2 = rnd() * 0.14, t2 = rnd() * TAU; x = r2 * Math.cos(t2); z = r2 * Math.sin(t2); }
      a[i * 3] = x; a[i * 3 + 1] = y; a[i * 3 + 2] = z; } return a; }
  function pagesShape() { const a = new Float32Array(N * 3), cols = 7, rows = 3, R = 5;
    for (let i = 0; i < N; i++) { const c = i % cols, rI = Math.floor(i / cols) % rows, card = c * rows + rI, g = seeded(card * 97 + 13);
      const phi = (c - 3) * 0.3, cx = Math.sin(phi) * R, cz = Math.cos(phi) * R - R, cy = (rI - 1) * 1.36; let lx, ly; const w = 0.86, hh = 1.12;
      if (rnd() < 0.28) { const p = rnd() * 2 * (w + hh); if (p < w) { lx = p - w / 2; ly = hh / 2; } else if (p < w + hh) { lx = w / 2; ly = hh / 2 - (p - w); } else if (p < 2 * w + hh) { lx = w / 2 - (p - w - hh); ly = -hh / 2; } else { lx = -w / 2; ly = -hh / 2 + (p - 2 * w - hh); } }
      else { const line = Math.floor(rnd() * 7); let len = 0.5; for (let qq = 0; qq <= line; qq++) len = 0.3 + g() * 0.42; if (line === 0) len = 0.5; lx = -0.32 + rnd() * len; ly = 0.4 - line * 0.13; }
      a[i * 3] = cx + lx * Math.cos(phi); a[i * 3 + 1] = cy + ly; a[i * 3 + 2] = cz - lx * Math.sin(phi); } return a; }
  function helix() { const a = new Float32Array(N * 3), R = 1.05;
    for (let i = 0; i < N; i++) { let x, y, z; const m = i % 5;
      if (m < 4) { const t = rnd() * 2 - 1, ang = t * PI * 4 + (m % 2 ? PI : 0); y = t * 2.7; x = R * Math.cos(ang) + (rnd() - 0.5) * 0.08; z = R * Math.sin(ang) + (rnd() - 0.5) * 0.08; }
      else { const k = Math.floor(rnd() * 28), tk = k / 27 * 2 - 1, ak = tk * PI * 4, u = rnd() * 2 - 1; y = tk * 2.7; x = R * u * Math.cos(ak); z = R * u * Math.sin(ak); }
      a[i * 3] = x; a[i * 3 + 1] = y; a[i * 3 + 2] = z; } return a; }
  function rings() { const a = new Float32Array(N * 3), Rs = [1.05, 1.5, 1.95, 2.4, 2.85], tx = [1.2, -0.5, 0.35, -1.0, 0.15], tz = [0.2, 0.6, -0.45, 0.1, -0.25];
    for (let i = 0; i < N; i++) { let x, y, z;
      if (i < N * 0.1) { const ph = Math.acos(2 * rnd() - 1), th = rnd() * TAU, r = 0.42 * Math.cbrt(rnd()); x = r * Math.sin(ph) * Math.cos(th); y = r * Math.cos(ph); z = r * Math.sin(ph) * Math.sin(th); }
      else { const k = i % 5, ang = rnd() * TAU, R = Rs[k] + (rnd() - 0.5) * 0.05, px = R * Math.cos(ang), py = (rnd() - 0.5) * 0.04, pz = R * Math.sin(ang);
        const cy = Math.cos(tx[k]), sy = Math.sin(tx[k]), y1 = py * cy - pz * sy, z1 = py * sy + pz * cy, cz = Math.cos(tz[k]), sz = Math.sin(tz[k]);
        x = px * cz - y1 * sz; y = px * sz + y1 * cz; z = z1; }
      a[i * 3] = x; a[i * 3 + 1] = y; a[i * 3 + 2] = z; } return a; }
  const shapes = [sphere(), wave(), bars(), funnel(), pagesShape(), helix(), rings()];
  const D = mobile
    ? [[0, 0.6, 0.78, 0.15, .75], [0, -1.4, 0.8, 0.55, .5], [0, 0.2, 0.7, 0.1, .45], [0, 0, 0.75, 0.2, .45], [0, 0, 0.7, 0.05, .35], [0, 0, 0.75, 0.3, .45], [0, 0.2, 0.85, 0.35, .85]]
    : [[2.5, 0.35, 1.0, 0.15, .95], [0, -1.25, 1.05, 0.5, .6], [2.6, -0.1, 0.88, 0.12, .7], [0, 0.1, 1.0, 0.25, .5], [0, 0, 0.92, 0.05, .42], [3.0, 0, 0.95, 0.3, .6], [0, 0.25, 1.0, 0.38, 1.0]];
  const pos = new Float32Array(N * 3); pos.set(shapes[0]);
  const cur = new Float32Array(N * 3); cur.set(shapes[0]);
  for (let s0 = 0; s0 < cur.length; s0++) cur[s0] *= reduce ? 1 : (0.2 + Math.random() * 0.2);
  const col = new Float32Array(N * 3), rnda = new Float32Array(N), delay = new Float32Array(N);
  const hex = h => [parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255];
  const C1 = hex('#C3C9FF'), C2 = hex('#FF7A45'), C3 = hex('#F5E26A');
  for (let i = 0; i < N; i++) { const r = Math.random(), c = r < 0.74 ? C1 : (r < 0.94 ? C2 : C3); col.set(c, i * 3); rnda[i] = Math.random(); delay[i] = Math.random(); }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(cur, 3).setUsage(THREE.DynamicDrawUsage));
  geo.setAttribute('aColor', new THREE.BufferAttribute(col, 3)); geo.setAttribute('aRand', new THREE.BufferAttribute(rnda, 1));
  const mat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uSize: { value: mobile ? 3.4 : 3.0 }, uPR: { value: renderer.getPixelRatio() }, uOpacity: { value: .95 } },
    vertexShader: `uniform float uTime; uniform float uSize; uniform float uPR; attribute vec3 aColor; attribute float aRand; varying vec3 vColor; varying float vA;
      void main(){ vec3 p=position; p+=0.035*vec3(sin(uTime*0.9+aRand*31.0),cos(uTime*0.8+aRand*17.0),sin(uTime*0.7+aRand*11.0));
      vec4 mv=modelViewMatrix*vec4(p,1.0); gl_PointSize=uSize*uPR*(0.55+aRand*0.9)*(8.0/-mv.z); gl_Position=projectionMatrix*mv;
      vColor=aColor; vA=smoothstep(15.0,4.0,-mv.z)*(0.55+0.45*sin(uTime*1.3+aRand*40.0)*0.5+0.25); }`,
    fragmentShader: `uniform float uOpacity; varying vec3 vColor; varying float vA;
      void main(){ float d=length(gl_PointCoord-0.5); float a=smoothstep(0.5,0.05,d); gl_FragColor=vec4(vColor,a*vA*uOpacity); }`,
  });
  const group = new THREE.Group(); group.add(new THREE.Points(geo, mat)); scene.add(group);
  const secs = [...document.querySelectorAll('[data-shape]')]; let marks = [];
  const measure = () => { marks = secs.map(el => { const box = el.parentElement && el.parentElement.classList.contains('pin-spacer') ? el.parentElement : el; return { top: box.getBoundingClientRect().top + scrollY, shape: +el.dataset.shape }; }); };
  measure(); addEventListener('load', measure); if (hasGsap) ScrollTrigger.addEventListener('refresh', measure);
  const sstep = x => { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); };
  function state() {
    const p = scrollY + innerHeight * 0.55; let i = 0;
    for (let k = 0; k < marks.length; k++) if (p >= marks[k].top) i = k;
    if (i >= marks.length - 1) return { a: marks[i].shape, b: marks[i].shape, t: 0 };
    const local = (p - marks[i].top) / Math.max(1, marks[i + 1].top - marks[i].top);
    return { a: marks[i].shape, b: marks[i + 1].shape, t: sstep((local - 0.55) / 0.45) };
  }
  const mouse = { x: 0, y: 0 }, ms = { x: 0, y: 0 };
  addEventListener('pointermove', e => { mouse.x = e.clientX / innerWidth * 2 - 1; mouse.y = e.clientY / innerHeight * 2 - 1; }, { passive: true });
  let lastKey = '', spin = 0, vis = 1; const place = D[0].slice(), clock = new THREE.Clock();
  function frame() {
    requestAnimationFrame(frame);
    const dt = Math.min(clock.getDelta(), 0.05), el = clock.elapsedTime;
    vis += ((workVisible ? 0 : 1) - vis) * 0.08;
    glCanvas.style.opacity = vis.toFixed(3);
    if (vis < 0.01) return;
    const st = state(), key = st.a + '|' + st.b + '|' + st.t.toFixed(3);
    if (key !== lastKey) {
      lastKey = key; const A = shapes[st.a], B = shapes[st.b], t = st.t;
      if (st.a === st.b || t <= 0) pos.set(A); else if (t >= 1) pos.set(B);
      else for (let j = 0; j < N; j++) { const tt = sstep(t * 1.45 - delay[j] * 0.45), o = j * 3; pos[o] = A[o] + (B[o] - A[o]) * tt; pos[o + 1] = A[o + 1] + (B[o + 1] - A[o + 1]) * tt; pos[o + 2] = A[o + 2] + (B[o + 2] - A[o + 2]) * tt; }
      const da = D[st.a], db = D[st.b]; for (let qq = 0; qq < 5; qq++) place[qq] = da[qq] + (db[qq] - da[qq]) * sstep(st.t);
    }
    const ease = reduce ? 1 : Math.min(1, dt * 4.2);
    for (let m = 0; m < cur.length; m++) cur[m] += (pos[m] - cur[m]) * ease;
    geo.attributes.position.needsUpdate = true;
    ms.x += (mouse.x - ms.x) * 0.05; ms.y += (mouse.y - ms.y) * 0.05; spin += reduce ? 0 : dt * 0.09;
    group.position.x += (place[0] - group.position.x) * 0.08; group.position.y += (place[1] - group.position.y) * 0.08;
    const sc = group.scale.x + (place[2] - group.scale.x) * 0.08; group.scale.set(sc, sc, sc);
    group.rotation.y = spin + ms.x * 0.35; group.rotation.x = place[3] + ms.y * 0.18;
    mat.uniforms.uOpacity.value += (place[4] - mat.uniforms.uOpacity.value) * 0.08; mat.uniforms.uTime.value = el;
    renderer.render(scene, camera);
  }
  requestAnimationFrame(frame);
  addEventListener('resize', () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight, false); measure(); });
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
  renderer.setPixelRatio(Math.min(devicePixelRatio, small ? 1.75 : 2)); renderer.setClearColor(0x080C24, 1);
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
    uTintK: { value: small ? 0.7 : 0.66 }, uBg: { value: new THREE.Color(0x080C24) }, uAccent: { value: new THREE.Color(0xFF7A45) }, uWobble: { value: reduce ? 0 : 1 },
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
  if (small) { const l = document.querySelector('.wf-copy .lede'); if (l) l.textContent = l.textContent.replace('Hover a tile to see what it is, click to open it.', 'Tap any tile to open it.'); }
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
        if (id >= 0) { const t = tiles[inst[id].k]; tip.innerHTML = label(t); tip.classList.add('on'); wfCanvas.classList.add('pointing'); hud.innerHTML = label(t); }
        else { tip.classList.remove('on'); wfCanvas.classList.remove('pointing'); hud.innerHTML = hudIdle; }
      }
      if (hovered >= 0) { tip.style.left = tipX + 'px'; tip.style.top = tipY + 'px'; }
    }
    renderer.render(scene, camera);
  }
  textures.forEach(t => renderer.initTexture(t));
  wfPct.textContent = '100%'; wfLoad.classList.add('done');
  loop();
}
