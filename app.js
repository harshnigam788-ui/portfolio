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
const onScreen = (el, cb, margin = '0px') => new IntersectionObserver(es => es.forEach(e => cb(e.isIntersecting)), { rootMargin: margin }).observe(el);

/* ================================================================ colour themes per section */
(() => {
  const meta = document.querySelector('meta[name="theme-color"]');
  const HEX = { cream: '#FFF3E3', sun: '#FFD23F', grape: '#6B3BF5', pink: '#FF9ECF', night: '#150E22', lime: '#C9F24A', cobalt: '#2747FF', tang: '#FF5A1F' };
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const t = e.target.dataset.theme; root.dataset.theme = t; meta.content = HEX[t] || HEX.cream;
  }), { rootMargin: '-49% 0px -50% 0px' });
  document.querySelectorAll('section[data-theme]').forEach(s => io.observe(s));
})();

/* ================================================================ clock, toast, copy */
const fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' });
const tick = () => { const t = fmt.format(new Date()); document.querySelectorAll('.js-clock').forEach(c => { c.textContent = t; }); };
tick(); setInterval(tick, 15000);
const toast = document.getElementById('toast'); let tt;
function say(m) { toast.textContent = m; toast.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove('show'), 2400); }
async function copyText(text, label) {
  try { await navigator.clipboard.writeText(text); say(`${label} copied: ${text}`); }
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
function jumpTo(y) {
  if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
  else window.scrollTo(0, y);
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
document.querySelectorAll('.hero-name .rv').forEach(rv => { rv.innerHTML = [...rv.textContent].map(c => `<span class="ch">${c}</span>`).join(''); });
if (hasGsap && !reduce) {
  gsap.from('.hero-name .rv', { yPercent: 105, duration: 1.4, ease: 'expo.out', stagger: 0.12, delay: 0.1 });
  gsap.fromTo('.hero-fig', { clipPath: 'inset(100% -60% -60% -60%)' }, { clipPath: 'inset(0% -60% -60% -60%)', duration: 1.4, ease: 'expo.inOut', delay: 0.25, clearProps: 'clipPath' });
  gsap.from('.hero-photo img', { scale: 1.25, duration: 1.8, ease: 'expo.out', delay: 0.25 });
  gsap.from('.sticker', { scale: 0, rotate: -120, duration: 1.2, ease: 'back.out(2)', delay: 1.1 });
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
const revealEls = document.querySelectorAll('.sec-head > *, .row, .svc li, .nums > div, .ab-story p, .ab-side h3, .rs-side, .mail, .huge, .contact .label, .tk-tabs, .ct-next');
if (!reduce && 'IntersectionObserver' in window) {
  revealEls.forEach(el => el.classList.add('reveal'));
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  revealEls.forEach((el, i) => { el.style.transitionDelay = `${(i % 4) * 60}ms`; io.observe(el); });
}

/* ================================================================ TOOLKIT: logos you can throw */
const TOOLS = [
  { id: 'claude', name: 'Claude', cat: 'AI', lvl: 5, tag: 'Daily driver', use: 'Audits, long briefs, proposal decks and the code behind my trackers. It helped build this site, too.' },
  { id: 'chatgpt', name: 'ChatGPT', cat: 'AI', lvl: 5, tag: 'Daily driver', use: 'Research, first drafts and content ideas. Also one of the five engines I test every month for AI visibility.' },
  { id: 'gemini', name: 'Gemini', cat: 'AI', lvl: 4, tag: 'Power user', use: 'Research inside Google Workspace, and a key engine in monthly AI visibility checks.' },
  { id: 'perplexity', name: 'Perplexity', cat: 'AI', lvl: 4, tag: 'Power user', use: 'Fast, cited research, and a good read on which sources AI search trusts for a brand.' },
  { id: 'copilot', name: 'Copilot', cat: 'AI', lvl: 3, tag: 'Regular', use: 'The fifth engine in AI visibility reporting. For B2B buyers, what Microsoft says matters.' },
  { id: 'n8n', name: 'n8n', cat: 'Automation', lvl: 4, tag: 'Builds workflows', use: 'Multi-step automations that move data between crawls, sheets and reports without anyone copy-pasting.' },
  { id: 'zapier', name: 'Zapier', cat: 'Automation', lvl: 4, tag: 'Builds workflows', use: 'Quick glue between forms, CRMs and chat, so a lead never sits in an inbox.' },
  { id: 'make', name: 'Make', cat: 'Automation', lvl: 4, tag: 'Builds workflows', use: 'Visual scenarios for content ops and reporting pipelines, with branches when things get messy.' },
  { id: 'appsscript', name: 'Apps Script', cat: 'Automation', lvl: 4, tag: 'Writes it', use: 'Custom functions and triggers that turn Google Sheets into trackers and dashboards.' },
  { id: 'sheets', name: 'Google Sheets', cat: 'Automation', lvl: 5, tag: 'Lives here', use: 'Production trackers, rank trackers, keyword maps. If it moves, it gets a sheet.' },
  { id: 'googleads', name: 'Google Ads', cat: 'Ads & social', lvl: 4, tag: 'Runs campaigns', use: 'Search campaigns built around intent, with CPCs that go down instead of up.' },
  { id: 'meta', name: 'Meta Ads', cat: 'Ads & social', lvl: 4, tag: 'Runs campaigns', use: 'Paid social for awareness and leads, tested creative by creative.' },
  { id: 'linkedin', name: 'LinkedIn', cat: 'Ads & social', lvl: 4, tag: 'Grows pages', use: 'Founder-led content and company pages for B2B brands.' },
  { id: 'youtube', name: 'YouTube', cat: 'Ads & social', lvl: 3, tag: 'Optimises channels', use: 'Titles, descriptions, playlists and channel structure, handled in bulk.' },
  { id: 'ga4', name: 'GA4', cat: 'Search & data', lvl: 5, tag: 'Reads it daily', use: 'Traffic, conversions and the story behind both, every month for every client.' },
  { id: 'gsc', name: 'Search Console', cat: 'Search & data', lvl: 5, tag: 'Reads it daily', use: 'Indexing, queries, and the first place I look when rankings move.' },
  { id: 'semrush', name: 'Semrush', cat: 'Search & data', lvl: 5, tag: 'Daily driver', use: 'Keyword research, competitor gaps, site audits and backlink checks.' },
];
(() => {
  const sec = document.getElementById('toolkit'), pit = document.getElementById('tkPit'), card = document.getElementById('tkCard'), tabs = document.getElementById('tkTabs');
  pit.innerHTML = TOOLS.map((t, i) => `<button type="button" class="chip" data-i="${i}" aria-label="${esc(t.name)}: details"><span class="ic"><img src="icons/${t.id}.svg" alt="" width="40" height="40" draggable="false"></span>${esc(t.name)}</button>`).join('');
  const chips = [...pit.children];
  let cat = 'all', bodies = null;
  function show(i) {
    const t = TOOLS[i];
    chips.forEach((c, j) => c.classList.toggle('sel', j === i));
    card.innerHTML = `<div class="tk-top"><span class="ic"><img src="icons/${t.id}.svg" alt=""></span><div><h3>${esc(t.name)}</h3><p class="mono">${esc(t.cat)}</p></div></div>
      <div class="tk-level" aria-label="Level ${t.lvl} of 5"><div class="bars">${[1, 2, 3, 4, 5].map(n => `<i class="${n <= t.lvl ? 'on' : ''}"></i>`).join('')}</div><b>${esc(t.tag)}</b></div>
      <p class="tk-use">${esc(t.use)}</p>
      <p class="tk-foot mono">Self-rated, out of five.</p>`;
  }
  tabs.addEventListener('click', e => {
    const b = e.target.closest('[data-cat]'); if (!b) return;
    cat = b.dataset.cat;
    tabs.querySelectorAll('[data-cat]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    chips.forEach((c, i) => c.classList.toggle('dim', cat !== 'all' && TOOLS[i].cat !== cat));
    if (bodies && window.Matter) bodies.forEach((bd, i) => {
      if (cat === 'all' || TOOLS[i].cat === cat) { window.Matter.Body.setVelocity(bd, { x: (Math.random() - 0.5) * 8, y: -12 - Math.random() * 6 }); window.Matter.Body.setAngularVelocity(bd, (Math.random() - 0.5) * 0.3); }
    });
  });
  // keyboard and static mode: a plain click opens the details
  pit.addEventListener('click', e => { const c = e.target.closest('.chip'); if (c && (!bodies || e.detail === 0)) show(+c.dataset.i); });

  const physics = fine && !reduce && innerWidth >= 760;
  if (!physics) { sec.classList.add('static'); return; }
  let started = false;
  const start = () => {
    if (started || !window.Matter) return; started = true;
    const { Engine, Bodies, Composite, Body, Mouse, MouseConstraint, Query } = window.Matter;
    pit.classList.add('live');
    const engine = Engine.create(); engine.gravity.y = 1.1;
    let W = pit.clientWidth, H = pit.clientHeight;
    const size = chips.map(c => [c.offsetWidth, c.offsetHeight]);
    bodies = chips.map((c, i) => {
      const [w, h] = size[i];
      const b = Bodies.rectangle(w / 2 + 20 + Math.random() * Math.max(1, W - w - 40), -80 - i * 55, w, h, { chamfer: { radius: h / 2 - 1 }, restitution: 0.5, friction: 0.08, frictionAir: 0.012, density: 0.002 });
      Body.setAngle(b, (Math.random() - 0.5) * 0.8); b.plugin.i = i; return b;
    });
    let walls = [];
    const T = 400;
    const makeWalls = () => {
      Composite.remove(engine.world, walls);
      walls = [
        Bodies.rectangle(W / 2, H + T / 2, W * 3, T, { isStatic: true }),
        Bodies.rectangle(-T / 2, 0, T, H * 5, { isStatic: true }),
        Bodies.rectangle(W + T / 2, 0, T, H * 5, { isStatic: true }),
        Bodies.rectangle(W / 2, -H * 1.6 - T / 2, W * 3, T, { isStatic: true }),
      ];
      Composite.add(engine.world, walls);
    };
    makeWalls();
    bodies.forEach((b, i) => setTimeout(() => Composite.add(engine.world, b), i * 90));
    const mouse = Mouse.create(pit);
    ['mousewheel', 'DOMMouseScroll', 'wheel'].forEach(ev => pit.removeEventListener(ev, mouse.mousewheel));
    const mc = MouseConstraint.create(engine, { mouse, constraint: { stiffness: 0.2, damping: 0.1, render: { visible: false } } });
    Composite.add(engine.world, mc);
    let down = null;
    pit.addEventListener('pointerdown', e => { down = [e.clientX, e.clientY]; });
    pit.addEventListener('pointerup', e => {
      if (!down) return; const moved = Math.hypot(e.clientX - down[0], e.clientY - down[1]); down = null;
      if (moved > 6) return;
      const r = pit.getBoundingClientRect(); const hit = Query.point(bodies, { x: e.clientX - r.left, y: e.clientY - r.top })[0];
      if (hit) show(hit.plugin.i);
    });
    pit.addEventListener('pointermove', e => {
      const r = pit.getBoundingClientRect(); const hit = Query.point(bodies, { x: e.clientX - r.left, y: e.clientY - r.top })[0];
      setCursor(hit ? 'Grab' : null);
    });
    pit.addEventListener('pointerleave', () => setCursor(null));
    addEventListener('resize', () => {
      W = pit.clientWidth; H = pit.clientHeight; makeWalls();
      bodies.forEach(b => { if (b.position.x > W - 20 || b.position.x < 20) Body.setPosition(b, { x: W / 2, y: -60 }); });
    });
    let visible = true; onScreen(sec, v => { visible = v; });
    (function loop() {
      requestAnimationFrame(loop);
      if (!visible) return;
      Engine.update(engine, 1000 / 60);
      bodies.forEach((b, i) => {
        if (b.position.y > H + 300 || b.position.x < -300 || b.position.x > W + 300) { Body.setPosition(b, { x: W / 2, y: -60 }); Body.setVelocity(b, { x: 0, y: 0 }); }
        chips[i].style.transform = `translate(${b.position.x - size[i][0] / 2}px,${b.position.y - size[i][1] / 2}px) rotate(${b.angle}rad)`;
      });
    })();
  };
  chips.forEach(c => { c.style.transform = 'translate(-999px,-999px)'; });
  new IntersectionObserver((es, ob) => es.forEach(e => { if (e.isIntersecting) { start(); if (started) ob.disconnect(); } }), { threshold: 0.2 }).observe(pit);
})();

/* ================================================================ BEYOND: particles that morph */
(async () => {
  const sec = document.getElementById('beyond'), cv = document.getElementById('px'), ctx = cv.getContext('2d');
  const items = [...document.querySelectorAll('#bxList li')], dots = [...document.querySelectorAll('.bx-dots i')];
  try { await document.fonts.load('800 120px "Inter Tight"'); await document.fonts.load('700 120px "Inter Tight"'); } catch {}
  const N = small ? 1500 : 3000, S = 440;
  const PAL = [['#FF7A2E', '#FFB27A'], ['#FF9ECF', '#FFD23F', '#FFF3E3', '#B9A6FF'], ['#C9F24A', '#FFF3E3', '#FF9ECF']];
  const hex = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  function ball(g) {
    g.translate(S / 2, S / 2);
    g.fillStyle = PAL[0][0]; g.beginPath(); g.arc(0, 0, S * 0.42, 0, 7); g.fill();
    g.fillStyle = PAL[0][1]; g.beginPath(); g.arc(-S * 0.12, -S * 0.14, S * 0.1, 0, 7); g.fill();
    g.globalCompositeOperation = 'destination-out'; g.lineWidth = S * 0.032;
    g.beginPath(); g.moveTo(0, -S * 0.5); g.lineTo(0, S * 0.5); g.stroke();
    g.beginPath(); g.moveTo(-S * 0.5, 0); g.lineTo(S * 0.5, 0); g.stroke();
    g.beginPath(); g.arc(-S * 0.62, 0, S * 0.46, -1, 1); g.stroke();
    g.beginPath(); g.arc(S * 0.62, 0, S * 0.46, Math.PI - 1, Math.PI + 1); g.stroke();
  }
  function guitar(g) {
    g.translate(S / 2, S / 2); g.rotate(-0.62); g.scale(0.86, 0.86);
    g.fillStyle = PAL[1][0];
    g.beginPath(); g.arc(0, S * 0.2, S * 0.2, 0, 7); g.fill();
    g.beginPath(); g.arc(0, -S * 0.02, S * 0.155, 0, 7); g.fill();
    g.fillStyle = PAL[1][1]; g.fillRect(-S * 0.032, -S * 0.47, S * 0.064, S * 0.32);
    g.beginPath(); g.roundRect(-S * 0.055, -S * 0.575, S * 0.11, S * 0.12, S * 0.025); g.fill();
    g.fillStyle = PAL[1][2]; [-1, 1].forEach(sd => [0, 1, 2].forEach(k => { g.beginPath(); g.arc(sd * S * 0.075, -S * (0.55 - k * 0.04), S * 0.014, 0, 7); g.fill(); }));
    g.globalCompositeOperation = 'destination-out'; g.beginPath(); g.arc(0, S * 0.05, S * 0.06, 0, 7); g.fill();
    g.globalCompositeOperation = 'source-over';
    g.strokeStyle = PAL[1][3]; g.lineWidth = S * 0.014; g.beginPath(); g.arc(0, S * 0.05, S * 0.08, 0, 7); g.stroke();
    g.fillStyle = PAL[1][2]; g.fillRect(-S * 0.085, S * 0.27, S * 0.17, S * 0.035);
    g.strokeStyle = PAL[1][2]; g.lineWidth = S * 0.007;
    [-1.5, -0.5, 0.5, 1.5].forEach(k => { g.beginPath(); g.moveTo(k * S * 0.012, -S * 0.46); g.lineTo(k * S * 0.012, S * 0.28); g.stroke(); });
  }
  function chip(g) {
    g.translate(S / 2, S / 2);
    g.fillStyle = PAL[2][0];
    for (let k = 0; k < 4; k++) {
      const o = (k - 1.5) * S * 0.13;
      [[o, -S * 0.39], [o, S * 0.39], [-S * 0.39, o], [S * 0.39, o]].forEach(([x, y]) => { g.beginPath(); g.arc(x, y, S * 0.026, 0, 7); g.fill(); });
      g.fillRect(o - S * 0.012, -S * 0.39, S * 0.024, S * 0.06); g.fillRect(o - S * 0.012, S * 0.33, S * 0.024, S * 0.06);
      g.fillRect(-S * 0.39, o - S * 0.012, S * 0.06, S * 0.024); g.fillRect(S * 0.33, o - S * 0.012, S * 0.06, S * 0.024);
    }
    g.strokeStyle = PAL[2][0]; g.lineWidth = S * 0.04; g.beginPath(); g.roundRect(-S * 0.3, -S * 0.3, S * 0.6, S * 0.6, S * 0.07); g.stroke();
    g.fillStyle = PAL[2][1]; g.font = `800 ${S * 0.34}px "Inter Tight", Arial, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('AI', 0, S * 0.02);
    g.fillStyle = PAL[2][2]; g.beginPath(); g.arc(-S * 0.2, -S * 0.2, S * 0.03, 0, 7); g.fill();
  }
  function sample(fn, pal) {
    const c = document.createElement('canvas'); c.width = c.height = S;
    const g = c.getContext('2d'); fn(g);
    const d = g.getImageData(0, 0, S, S).data, pts = [], P = pal.map(hex);
    for (let y = 0; y < S; y += 2) for (let x = 0; x < S; x += 2) {
      const k = (y * S + x) * 4; if (d[k + 3] < 170) continue;
      let best = 0, bd = 1e9;
      P.forEach((p, j) => { const dd = (p[0] - d[k]) ** 2 + (p[1] - d[k + 1]) ** 2 + (p[2] - d[k + 2]) ** 2; if (dd < bd) { bd = dd; best = j; } });
      pts.push([x / S - 0.5, y / S - 0.5, best]);
    }
    for (let i = pts.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [pts[i], pts[j]] = [pts[j], pts[i]]; }
    return Array.from({ length: N }, (_, i) => pts[i % pts.length]);
  }
  const SH = [sample(ball, PAL[0]), sample(guitar, PAL[1]), sample(chip, PAL[2])];
  const X = new Float32Array(N), Y = new Float32Array(N), VX = new Float32Array(N), VY = new Float32Array(N), WAIT = new Float32Array(N), PH = new Float32Array(N);
  let W = 0, H = 0, dpr = 1, cx = 0, cy = 0, size = 0, stage = -1, mx = -9999, my = -9999, visible = false, order = [];
  function resize() {
    dpr = Math.min(devicePixelRatio || 1, 2); W = cv.clientWidth; H = cv.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (W / H >= 0.9) { cx = W * 0.7; cy = H * 0.5; size = Math.min(H * 0.86, W * 0.52); }
    else { cx = W / 2; cy = H * 0.33; size = Math.min(W * 0.92, H * 0.5); }
  }
  resize(); addEventListener('resize', resize);
  for (let i = 0; i < N; i++) { X[i] = Math.random() * W; Y[i] = Math.random() * H; PH[i] = Math.random() * 6.283; }
  function setStage(s) {
    if (s === stage) return;
    const first = stage === -1; stage = s;
    items.forEach((li, i) => li.classList.toggle('on', i === s)); dots.forEach((d, i) => d.classList.toggle('on', i === s));
    order = Array.from({ length: N }, (_, i) => i).sort((a, b) => SH[s][a][2] - SH[s][b][2]);
    if (reduce) { for (let i = 0; i < N; i++) { X[i] = cx + SH[s][i][0] * size; Y[i] = cy + SH[s][i][1] * size; } return; }
    for (let i = 0; i < N; i++) {
      const a = Math.random() * 6.283, f = first ? 0 : 4 + Math.random() * 14;
      VX[i] += Math.cos(a) * f; VY[i] += Math.sin(a) * f; WAIT[i] = first ? Math.random() * 30 : 4 + Math.random() * 22;
    }
  }
  const move = (x, y) => { const r = cv.getBoundingClientRect(); mx = x - r.left; my = y - r.top; };
  cv.addEventListener('pointermove', e => move(e.clientX, e.clientY));
  cv.addEventListener('pointerleave', () => { mx = my = -9999; });
  cv.addEventListener('touchmove', e => { const t = e.touches[0]; if (t) move(t.clientX, t.clientY); }, { passive: true });
  cv.addEventListener('touchend', () => { mx = my = -9999; });
  onScreen(sec, v => { visible = v; });
  const progress = () => { const r = sec.getBoundingClientRect(); return Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - innerHeight))); };
  const R = small ? 70 : 110, R2 = R * R, dot = small ? 2.1 : 2.3;
  let t = 0;
  (function loop() {
    requestAnimationFrame(loop);
    if (!visible) return;
    const pr = progress(); setStage(pr < 0.34 ? 0 : pr < 0.67 ? 1 : 2);
    t += 0.016;
    ctx.clearRect(0, 0, W, H);
    const pts = SH[stage], pal = PAL[stage];
    let col = -1;
    for (let n = 0; n < N; n++) {
      const i = order[n], p = pts[i];
      if (!reduce) {
        const tx = cx + p[0] * size + Math.sin(t * 1.3 + PH[i]) * 0.8, ty = cy + p[1] * size + Math.cos(t * 1.1 + PH[i]) * 0.8;
        if (WAIT[i] > 0) WAIT[i]--; else { VX[i] += (tx - X[i]) * 0.022; VY[i] += (ty - Y[i]) * 0.022; }
        const dx = X[i] - mx, dy = Y[i] - my, d2 = dx * dx + dy * dy;
        if (d2 < R2 && d2 > 0.01) { const d = Math.sqrt(d2), f = (1 - d / R) * 3.4; VX[i] += dx / d * f; VY[i] += dy / d * f; }
        VX[i] *= 0.86; VY[i] *= 0.86; X[i] += VX[i]; Y[i] += VY[i];
      }
      if (p[2] !== col) { col = p[2]; ctx.fillStyle = pal[col]; }
      ctx.fillRect(X[i] - dot / 2, Y[i] - dot / 2, dot, dot);
    }
  })();
})();

/* ================================================================ data for work, index, lightbox */
const [TD, MD] = await Promise.all([fetch('data/tiles.json').then(r => r.json()), fetch('data/mosaic.json').then(r => r.json())]);
const tiles = TD.tiles, NAMES = TD.names;
const pages = tiles.filter(t => t.url).map(t => t.i);
document.getElementById('wfPages').textContent = pages.length;
document.querySelectorAll('[data-count]').forEach(el => { el.textContent = TD.counts[el.dataset.count] || 0; });
document.getElementById('idxCount').textContent = `${pages.length} pages · ${tiles.length} tiles`;
const label = t => t.url ? `<b>${esc(NAMES[t.c])}</b> · ${esc(t.t)} · <i>${esc(t.title)}</i>` : t.label;

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
  grid.innerHTML = currentList().map(i => { const t = tiles[i]; return `<button class="card" data-i="${i}"><div class="im"><img loading="lazy" decoding="async" src="thumb/${pad4(i)}.webp" alt=""></div><p class="cm mono">${esc(NAMES[t.c])} · ${esc(t.t)}</p><p class="ct">${esc(t.title)}</p></button>`; }).join('')
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
  lb.img.classList.remove('ready'); lb.img.src = `work/${pad4(t.i)}.webp`; lb.img.alt = `${NAMES[t.c]}: ${t.title}`;
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

/* ================================================================ ARCHIVE: portrait made of work, then an endless flight */
const V = small ? 'sm' : 'lg';
const wfCanvas = document.getElementById('wf'), wfLoad = document.getElementById('wfLoad'), wfPct = document.getElementById('wfPct');
let started = false;
const startWork = () => { if (started) return; started = true; workScene().catch(err => { console.error(err); wfLoad.textContent = 'The 3D view could not load here. Browse all pages instead.'; }); };
new IntersectionObserver((es, ob) => es.forEach(e => { if (e.isIntersecting) { startWork(); ob.disconnect(); } }), { rootMargin: '150% 0px' }).observe(wfSec);
setTimeout(startWork, 6000);

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
  const BG = 0x150E22;
  const renderer = new THREE.WebGLRenderer({ canvas: wfCanvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, small ? 1.75 : 2)); renderer.setClearColor(BG, 1);
  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(52, 1, 0.1, 400); camera.position.set(0, 0, 6);

  const rand = (() => { let s = 20261115; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();
  const C = M.cols, R = M.rows;
  const PH = small ? 15 : 16.5, cellH = PH / R, cellW = cellH * 4 / 3, PZ = -14;
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
    uTintK: { value: small ? 0.76 : 0.74 }, uBg: { value: new THREE.Color(BG) }, uAccent: { value: new THREE.Color(0xC9F24A) }, uWobble: { value: reduce ? 0 : 1 },
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
      col = mix(col, uAccent, smoothstep(-0.016, 0.0, d) * vHover * fade);
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

  // ---------- scroll drives the flight. Near the bottom the page quietly jumps back and the flight carries on: an endless archive.
  const TRANS = 34, PER = small ? 34 : 40, HOLD = 0.06, LOOP_AT = 0.9, LOOP_TO = 0.5;
  const base = pr => pr < HOLD ? 0 : (pr - HOLD) * PER * 10;
  let travel = 0, offset = 0, pointerIn = false, tipX = 0, tipY = 0, inView = false;
  const pointer = new THREE.Vector2(), look = new THREE.Vector2(), rest = new THREE.Vector2();
  new IntersectionObserver(es => es.forEach(e => { inView = e.isIntersecting; }), { threshold: 0 }).observe(wfSec);
  const span = () => Math.max(1, wfSec.offsetHeight - innerHeight);
  const progress = () => { const r = wfSec.getBoundingClientRect(); return Math.min(1, Math.max(0, -r.top / span())); };
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

  const tip = document.getElementById('tip'), hud = document.getElementById('wfLabel'), odo = document.getElementById('wfOdo');
  const hudIdle = small ? `<b>${tiles.length}</b> pieces · tap to open` : `<b>${tiles.length}</b> pieces of work · hover to see, click to open`;
  hud.innerHTML = hudIdle;
  let hovered = -1, frame = 0;
  function resize() {
    const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h;
    camera.fov = w / h < 0.8 ? 64 : 52; camera.updateProjectionMatrix();
    const halfW = Math.tan(camera.fov * Math.PI / 360) * 20 * camera.aspect;
    const CX = w / h >= 0.8 ? Math.min(halfW * 0.42, halfW - C * cellW * 0.5 - 0.6) : 0, CY = w / h >= 0.8 ? -0.4 : 2.6;
    U.uShift.value.set(CX, CY);
  }
  addEventListener('resize', resize); resize();
  function loop() {
    requestAnimationFrame(loop);
    let pr = progress();
    // left the archive upwards: reset so the portrait is waiting next time
    if (pr === 0 && wfSec.getBoundingClientRect().top > innerHeight * 0.5 && offset) { offset = 0; travel = 0; }
    // endless: near the end, jump back and keep the flight continuous
    if (pr > LOOP_AT && !anyOpen()) {
      offset += base(pr) - base(LOOP_TO);
      jumpTo(wfSec.offsetTop + LOOP_TO * span());
      pr = LOOP_TO;
    }
    if (!inView) { if (hovered >= 0) { hovered = -1; U.uHover.value = -1; tip.classList.remove('on'); } return; }
    frame++;
    const now = performance.now();
    const target = base(pr) + offset;
    travel += (target - travel) * (reduce ? 1 : 0.12);
    U.uP.value = travel / TRANS; U.uTravel.value = travel; U.uTime.value = now / 1000;
    wfSec.classList.toggle('flying', travel > 3);
    if ((frame & 7) === 0) odo.textContent = `${Math.round(travel * 3).toLocaleString('en-IN')} m in`;
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
