// Procedurally drawn "work" tiles for the fly-through.
// Each tile is drawn on a 512x384 logical canvas and packed into one texture atlas.
// To use real screenshots later, add entries with { kind: 'image', src } — see README.

export const TW = 512, TH = 384;

const C = {
  bg: '#141416', bg2: '#1b1b1f', paper: '#ece9e2', ink: '#efede8', dark: '#111113',
  mute: 'rgba(239,237,232,.55)', faint: 'rgba(239,237,232,.14)', line: 'rgba(239,237,232,.09)',
  pmute: 'rgba(17,17,19,.55)', pline: 'rgba(17,17,19,.12)',
  signal: '#ff5a1f', blue: '#8fb4ff', green: '#7fe0a8', yellow: '#ffd36e',
};
const SERIF = '"Instrument Serif", serif';
const SANS = '"Inter Tight", sans-serif';
const MONO = 'ui-monospace, "SFMono-Regular", Menlo, monospace';

export const CLIENTS = [
  { id: 'valintry360', name: 'VALiNTRY360', sector: 'Salesforce consulting', region: 'US', chips: ['SEO', 'AI search', 'Content', 'LinkedIn'] },
  { id: 'valintry', name: 'VALiNTRY', sector: 'Staffing & recruitment', region: 'US', chips: ['SEO', 'Content', 'Social'] },
  { id: 'ignitehcm', name: 'Ignite HCM', sector: 'Payroll & HR consulting', region: 'US', chips: ['SEO', 'Backlinks', 'Reporting'] },
  { id: 'bullseye', name: 'Bullseye Engagement', sector: 'Succession planning SaaS', region: 'US', chips: ['Content', 'SEO', 'Reporting'] },
  { id: 'calance', name: 'Calance', sector: 'IT services', region: 'US · India', chips: ['SEO', 'AI search', 'Email'] },
  { id: 'prateek', name: 'Prateek Group', sector: 'Real estate', region: 'Delhi NCR', chips: ['SEO', 'AI visibility', 'Video'] },
  { id: 'tag', name: 'TAG Manufacturing', sector: 'Excavator attachments', region: 'Chattanooga, US', chips: ['SEO', 'AI search', 'Audit'] },
  { id: 'advayan', name: 'Advayan', sector: 'IT & SAP consulting', region: 'US', chips: ['SEO', 'AI search', 'Web'] },
  { id: 'zapfire', name: 'ZAP FIRE', sector: 'Fire safety', region: 'Gurugram', chips: ['Content', 'SEO', 'Local'] },
];

const METRICS = [
  ['21', 'person team across content, design, dev, QC & off-page'],
  ['300+', 'webpages shipped every month'],
  ['5–10%', 'monthly traffic growth, every client'],
  ['10–15%', 'more leads every quarter'],
  ['2.5:1', 'average ROAS on paid campaigns'],
  ['60+', 'live-crawl audits turned into proposals'],
  ['10+', 'retained clients in India and the US'],
];
const WORDS = [
  ['Answer Engine Optimization', 'AEO'], ['Generative Engine Optimization', 'GEO'], ['Topical authority', 'Content'],
  ['Entity optimization', 'Technical SEO'], ['llms.txt', 'AI crawlers'], ['Schema, everywhere', 'JSON-LD'],
  ['Ship on time', 'Operations'], ['Get cited', 'AI search'], ['Make the numbers move', 'The job'], ['Rank', 'Search'],
];
const QUERIES = [
  'best salesforce consulting partner', 'succession planning software', 'excavator attachments manufacturer',
  'fire safety company gurugram', 'adp payroll consultant', 'apartments in noida extension',
];
const ENGINES = ['ChatGPT', 'Gemini', 'Perplexity', 'Claude', 'Copilot'];

// ------------------------------------------------------------ helpers
export function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
export function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
export function fill(ctx, c) { ctx.fillStyle = c; ctx.fill(); }
export function text(ctx, s, x, y, font, color, align = 'left') { ctx.font = font; ctx.fillStyle = color; ctx.textAlign = align; ctx.fillText(s, x, y); }
export function fit(ctx, s, maxW, size, family, style = '') {
  let f = size; ctx.font = `${style} ${f}px ${family}`;
  while (ctx.measureText(s).width > maxW && f > 12) { f -= 2; ctx.font = `${style} ${f}px ${family}`; }
  return f;
}
export function wrap(ctx, s, x, y, maxW, lh, font, color) {
  ctx.font = font; ctx.fillStyle = color; ctx.textAlign = 'left';
  const words = s.split(' '); let line = '';
  for (const w of words) { const t = line ? line + ' ' + w : w; if (ctx.measureText(t).width > maxW && line) { ctx.fillText(line, x, y); y += lh; line = w; } else line = t; }
  if (line) ctx.fillText(line, x, y); return y;
}
export function bars(ctx, x, y, w, n, color, r, h = 8, gap = 16) { for (let i = 0; i < n; i++) { const bw = w * (0.55 + r() * 0.45); rr(ctx, x, y + i * gap, bw, h, 4); fill(ctx, color); } }
export function chip(ctx, s, x, y, dark = true, accent = false) {
  ctx.font = `500 15px ${SANS}`; const w = ctx.measureText(s).width + 24;
  rr(ctx, x, y, w, 28, 14);
  if (accent) fill(ctx, C.signal); else { ctx.strokeStyle = dark ? C.faint : C.pline; ctx.lineWidth = 1.5; ctx.stroke(); }
  text(ctx, s, x + 12, y + 19, `500 15px ${SANS}`, accent ? '#111' : dark ? C.ink : C.dark);
  return w;
}
export function frame(ctx, bg) { ctx.fillStyle = bg; ctx.fillRect(0, 0, TW, TH); }
function label(ctx, s, dark = true) { text(ctx, s.toUpperCase(), 32, 46, `500 13px ${SANS}`, dark ? C.mute : C.pmute); }

// ------------------------------------------------------------ tile painters
export const P = {
  client(ctx, d) {
    const dark = d.variant !== 'paper';
    frame(ctx, dark ? C.bg : C.paper);
    const ink = dark ? C.ink : C.dark;
    label(ctx, `Client · ${String(d.idx + 1).padStart(2, '0')}`, dark);
    ctx.beginPath(); ctx.arc(TW - 40, 40, 6, 0, 7); fill(ctx, C.signal);
    const f = fit(ctx, d.c.name, TW - 64, 74, SERIF);
    text(ctx, d.c.name, 32, 190, `${f}px ${SERIF}`, ink);
    text(ctx, `${d.c.sector} — ${d.c.region}`, 32, 232, `400 18px ${SANS}`, dark ? C.mute : C.pmute);
    let x = 32; for (const s of d.c.chips) x += chip(ctx, s, x, 316, dark) + 8;
  },
  metric(ctx, d) {
    const pal = d.pal || [C.bg2, C.ink, C.mute];
    frame(ctx, pal[0]);
    text(ctx, 'RESULTS', 32, 46, `500 13px ${SANS}`, pal[2]);
    const f = fit(ctx, d.m[0], TW - 64, 150, SERIF);
    text(ctx, d.m[0], 28, 240, `${f}px ${SERIF}`, pal[1]);
    wrap(ctx, d.m[1], 32, 300, 380, 26, `400 21px ${SANS}`, pal[2]);
  },
  word(ctx, d) {
    const pal = d.pal || [C.dark, C.ink, C.mute, C.signal];
    frame(ctx, pal[0]);
    text(ctx, d.w[1].toUpperCase(), 32, 46, `500 13px ${SANS}`, pal[2]);
    wrap(ctx, d.w[0], 32, 170, TW - 70, 64, `italic 64px ${SERIF}`, pal[1]);
    ctx.fillStyle = pal[3] || C.signal; ctx.fillRect(32, TH - 46, 40, 3);
  },
  serp(ctx, d, r) {
    frame(ctx, '#f4f3ef');
    rr(ctx, 28, 26, TW - 56, 44, 22); ctx.strokeStyle = 'rgba(0,0,0,.14)'; ctx.lineWidth = 1.5; ctx.stroke();
    text(ctx, d.q, 52, 54, `400 17px ${SANS}`, '#222');
    rr(ctx, 28, 88, TW - 56, 120, 12); fill(ctx, '#e7e5f3');
    text(ctx, '✦ AI Overview', 46, 116, `600 14px ${SANS}`, '#4a3fb5');
    bars(ctx, 46, 132, TW - 120, 3, 'rgba(40,30,120,.18)', r, 8, 16);
    rr(ctx, 46, 180, 132, 20, 10); fill(ctx, C.signal); text(ctx, 'Cited source', 58, 195, `600 12px ${SANS}`, '#111');
    for (let i = 0; i < 3; i++) {
      const y = 236 + i * 48;
      rr(ctx, 28, y, 180 + r() * 160, 11, 5); fill(ctx, i === 0 ? '#3d5fd6' : 'rgba(61,95,214,.45)');
      bars(ctx, 28, y + 20, TW - 90, 1, 'rgba(0,0,0,.12)', r, 7, 12);
    }
  },
  ai(ctx, d, r) {
    frame(ctx, C.bg);
    label(ctx, 'AI visibility tracking');
    rr(ctx, TW - 300, 70, 268, 40, 14); fill(ctx, '#2a2a30');
    text(ctx, d.q.length > 30 ? d.q.slice(0, 29) + '…' : d.q, TW - 286, 96, `400 15px ${SANS}`, C.ink);
    rr(ctx, 32, 126, 360, 120, 14); fill(ctx, '#1f1f24');
    bars(ctx, 48, 146, 320, 4, 'rgba(239,237,232,.16)', r, 8, 18);
    rr(ctx, 48, 218, 120, 18, 9); fill(ctx, 'rgba(127,224,168,.22)'); text(ctx, '✓ Brand mentioned', 56, 231, `600 11px ${SANS}`, C.green);
    let x = 32;
    ENGINES.forEach((e, i) => { const on = i === d.e; ctx.font = `500 14px ${SANS}`; const w = ctx.measureText(e).width + 22; rr(ctx, x, 300, w, 30, 15); if (on) fill(ctx, C.ink); else { ctx.strokeStyle = C.faint; ctx.lineWidth = 1.5; ctx.stroke(); } text(ctx, e, x + 11, 320, `500 14px ${SANS}`, on ? '#111' : C.mute); x += w + 6; });
  },
  chart(ctx, d, r) {
    frame(ctx, C.bg2);
    label(ctx, d.t);
    const x0 = 32, y0 = 100, w = TW - 64, h = 220;
    ctx.strokeStyle = C.line; ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) { ctx.beginPath(); ctx.moveTo(x0, y0 + i * h / 4); ctx.lineTo(x0 + w, y0 + i * h / 4); ctx.stroke(); }
    const pts = []; let v = 0.15 + r() * 0.1;
    for (let i = 0; i < 12; i++) { v += 0.03 + r() * 0.07 - (r() < 0.2 ? 0.06 : 0); v = Math.min(v, 0.95); pts.push([x0 + i * w / 11, y0 + h - v * h]); }
    const g = ctx.createLinearGradient(0, y0, 0, y0 + h); g.addColorStop(0, 'rgba(255,90,31,.35)'); g.addColorStop(1, 'rgba(255,90,31,0)');
    ctx.beginPath(); ctx.moveTo(pts[0][0], y0 + h); pts.forEach(p => ctx.lineTo(p[0], p[1])); ctx.lineTo(pts[11][0], y0 + h); ctx.fillStyle = g; ctx.fill();
    ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.strokeStyle = C.signal; ctx.lineWidth = 3; ctx.stroke();
    const l = pts[11]; ctx.beginPath(); ctx.arc(l[0], l[1], 6, 0, 7); fill(ctx, C.ink);
    text(ctx, d.s, x0, TH - 26, `400 15px ${SANS}`, C.mute);
  },
  clusters(ctx, d, r) {
    frame(ctx, C.paper);
    label(ctx, 'Keyword clusters', false);
    const names = d.k;
    names.forEach((n, i) => {
      const y = 92 + i * 52, w = 140 + r() * 230;
      text(ctx, n, 32, y, `500 16px ${SANS}`, C.dark);
      rr(ctx, 32, y + 12, TW - 64, 10, 5); fill(ctx, C.pline);
      rr(ctx, 32, y + 12, w, 10, 5); fill(ctx, i === 0 ? C.signal : C.dark);
    });
  },
  schema(ctx, d) {
    frame(ctx, '#0e0e10');
    label(ctx, 'JSON-LD');
    const lines = d.lines; let y = 92;
    for (const [ind, k, v] of lines) {
      let x = 32 + ind * 22;
      if (k) { text(ctx, `"${k}"`, x, y, `400 17px ${MONO}`, C.blue); x += ctx.measureText(`"${k}"`).width; text(ctx, ': ', x, y, `400 17px ${MONO}`, C.mute); x += ctx.measureText(': ').width; }
      if (v) text(ctx, v, x, y, `400 17px ${MONO}`, v.startsWith('"') ? C.yellow : C.mute);
      y += 28;
    }
  },
  pipeline(ctx, d, r) {
    frame(ctx, C.bg);
    label(ctx, 'Production tracker');
    const cols = ['Content', 'Design', 'Dev', 'Publish', 'QC'], cw = (TW - 64 - 24) / 5;
    cols.forEach((c, i) => {
      const x = 32 + i * (cw + 6);
      text(ctx, c, x, 86, `500 13px ${SANS}`, C.mute);
      const n = 1 + Math.floor(r() * 4);
      for (let j = 0; j < n; j++) { rr(ctx, x, 100 + j * 58, cw, 50, 8); fill(ctx, i === 4 && j === 0 ? C.signal : '#24242a'); bars(ctx, x + 10, 114 + j * 58, cw - 26, 2, i === 4 && j === 0 ? 'rgba(0,0,0,.35)' : 'rgba(239,237,232,.18)', r, 6, 12); }
    });
    text(ctx, 'On time, every page', 32, TH - 26, `italic 24px ${SERIF}`, C.ink);
  },
  calendar(ctx, d, r) {
    frame(ctx, C.paper);
    text(ctx, d.m, 32, 64, `italic 44px ${SERIF}`, C.dark);
    text(ctx, 'EDITORIAL CALENDAR', TW - 32, 56, `500 12px ${SANS}`, C.pmute, 'right');
    const cw = (TW - 64) / 7, ch = 50;
    for (let i = 0; i < 35; i++) {
      const x = 32 + (i % 7) * cw, y = 92 + Math.floor(i / 7) * ch;
      ctx.strokeStyle = C.pline; ctx.lineWidth = 1; ctx.strokeRect(x, y, cw, ch);
      const p = r();
      if (p < 0.42) { rr(ctx, x + 5, y + 8, cw - 10, 12, 4); fill(ctx, p < 0.1 ? C.signal : p < 0.22 ? '#3d5fd6' : C.dark); }
      if (p < 0.12) { rr(ctx, x + 5, y + 26, cw - 18, 10, 4); fill(ctx, 'rgba(17,17,19,.3)'); }
    }
  },
  ad(ctx, d, r) {
    frame(ctx, '#f7f6f2');
    label(ctx, d.p === 'meta' ? 'Meta Ads' : 'Google Ads', false);
    if (d.p === 'meta') {
      rr(ctx, 32, 70, TW - 64, 200, 12); const g = ctx.createLinearGradient(32, 70, TW, 270); g.addColorStop(0, '#2a2a30'); g.addColorStop(1, C.signal); ctx.fillStyle = g; ctx.fill();
      text(ctx, d.h, 52, 230, `italic 40px ${SERIF}`, '#fff');
      text(ctx, 'Sponsored', 32, 300, `600 13px ${SANS}`, C.pmute);
      rr(ctx, TW - 150, 284, 118, 34, 8); fill(ctx, C.dark); text(ctx, 'Learn more', TW - 91, 306, `600 14px ${SANS}`, '#fff', 'center');
    } else {
      text(ctx, 'Sponsored', 32, 92, `700 14px ${SANS}`, '#222');
      text(ctx, d.h, 32, 134, `500 26px ${SANS}`, '#1a3fb8');
      bars(ctx, 32, 160, TW - 80, 3, 'rgba(0,0,0,.14)', r, 8, 18);
      const ks = ['Keyword research', 'Bidding', 'Ad copy', 'Reporting']; let x = 32;
      for (const k of ks) x += chip(ctx, k, x, 250, false) + 8;
      text(ctx, 'Lower CPCs, steady ROAS', 32, TH - 30, `italic 26px ${SERIF}`, C.dark);
    }
  },
  social(ctx, d, r) {
    frame(ctx, C.bg2);
    ctx.beginPath(); ctx.arc(56, 64, 24, 0, 7); fill(ctx, C.signal);
    rr(ctx, 92, 48, 150, 12, 6); fill(ctx, 'rgba(239,237,232,.6)'); rr(ctx, 92, 68, 100, 9, 5); fill(ctx, C.faint);
    text(ctx, 'LinkedIn', TW - 32, 64, `600 13px ${SANS}`, C.mute, 'right');
    wrap(ctx, d.h, 32, 136, TW - 64, 34, `italic 30px ${SERIF}`, C.ink);
    bars(ctx, 32, 236, TW - 64, 3, 'rgba(239,237,232,.14)', r, 8, 18);
    ctx.strokeStyle = C.line; ctx.beginPath(); ctx.moveTo(32, 316); ctx.lineTo(TW - 32, 316); ctx.stroke();
    ['Like', 'Comment', 'Repost', 'Send'].forEach((s, i) => text(ctx, s, 32 + i * 110, 348, `500 14px ${SANS}`, C.mute));
  },
  audit(ctx, d, r) {
    frame(ctx, C.bg);
    label(ctx, 'Live-crawl audit');
    const rows = d.rows;
    rows.forEach(([n, ok], i) => {
      const y = 90 + i * 46;
      ctx.strokeStyle = C.line; ctx.beginPath(); ctx.moveTo(32, y + 18); ctx.lineTo(TW - 32, y + 18); ctx.stroke();
      text(ctx, n, 32, y + 6, `400 18px ${SANS}`, C.ink);
      rr(ctx, TW - 112, y - 12, 80, 24, 12); fill(ctx, ok ? 'rgba(127,224,168,.16)' : 'rgba(255,90,31,.18)');
      text(ctx, ok ? 'Pass' : 'Fix', TW - 72, y + 5, `600 13px ${SANS}`, ok ? C.green : C.signal, 'center');
    });
  },
  proposal(ctx, d) {
    frame(ctx, C.paper);
    label(ctx, 'Retainer proposal', false);
    text(ctx, d.h, 32, 104, `italic 40px ${SERIF}`, C.dark);
    ['Foundation', 'Growth', 'Scale'].forEach((t, i) => {
      const x = 32 + i * 152, y = 140;
      rr(ctx, x, y, 144, 200, 12); if (i === 1) fill(ctx, C.dark); else { ctx.strokeStyle = C.pline; ctx.lineWidth = 1.5; ctx.stroke(); }
      text(ctx, t, x + 16, y + 34, `600 16px ${SANS}`, i === 1 ? '#fff' : C.dark);
      for (let j = 0; j < 5; j++) { rr(ctx, x + 16, y + 62 + j * 24, 112 - (j * 13) % 40, 8, 4); fill(ctx, i === 1 ? 'rgba(255,255,255,.25)' : C.pline); }
      if (i === 1) { rr(ctx, x + 16, y + 168, 70, 18, 9); fill(ctx, C.signal); }
    });
  },
};

// ------------------------------------------------------------ the tile list
export function tileDefs() {
  const defs = [];
  CLIENTS.forEach((c, idx) => {
    defs.push({ kind: 'client', c, idx, variant: 'dark', label: `<b>${c.name}</b> · ${c.sector}`, open: 'work', anchor: c.id, weight: 3 });
    defs.push({ kind: 'client', c, idx, variant: 'paper', label: `<b>${c.name}</b> · ${c.sector}`, open: 'work', anchor: c.id, weight: 3 });
  });
  METRICS.forEach((m, i) => defs.push({ kind: 'metric', m, variant: i % 3 === 1 ? 'accent' : 'dark', label: `${m[0]} ${m[1]}`, open: 'about', weight: 2 }));
  WORDS.forEach((w, i) => defs.push({ kind: 'word', w, variant: i % 2 ? 'paper' : 'dark', label: w[0], open: 'about', weight: 1 }));
  QUERIES.forEach(q => defs.push({ kind: 'serp', q, label: 'SEO + AI Overviews', open: 'work', weight: 1 }));
  QUERIES.slice(0, 5).forEach((q, e) => defs.push({ kind: 'ai', q, e, label: `AI visibility · ${ENGINES[e]}`, open: 'about', weight: 1 }));
  [['Organic sessions', 'Month over month'], ['Leads from search', 'Quarter over quarter'], ['AI citations', 'Across five engines'], ['Pages indexed', 'After a technical fix']]
    .forEach(([t, s]) => defs.push({ kind: 'chart', t, s, label: t, open: 'about', weight: 1 }));
  [['Salesforce consulting', 'Payroll services', 'HR compliance', 'Implementation', 'Staffing'],
   ['Luxury apartments', 'Noida projects', 'NRI investment', 'Ready to move', 'Possession'],
   ['Excavator buckets', 'Thumbs', 'Couplers', 'Rippers', 'Dealers']]
    .forEach(k => defs.push({ kind: 'clusters', k, label: 'Keyword clustering', open: 'about', weight: 1 }));
  [
    [[0, null, '{'], [1, '@type', '"Organization"'], [1, 'name', '"…"'], [1, 'sameAs', '[ … ]'], [1, 'knowsAbout', '[ … ]'], [1, 'address', '{ … }'], [1, 'areaServed', '"US"'], [0, null, '}']],
    [[0, null, '{'], [1, '@type', '"FAQPage"'], [1, 'mainEntity', '['], [2, '@type', '"Question"'], [2, 'name', '"…"'], [2, 'acceptedAnswer', '{ … }'], [1, null, ']'], [0, null, '}']],
    [[0, null, '{'], [1, '@type', '"Service"'], [1, 'provider', '{ … }'], [1, 'serviceType', '"…"'], [1, 'areaServed', '"India"'], [1, 'offers', '{ … }'], [0, null, '}']],
  ].forEach(lines => defs.push({ kind: 'schema', lines, label: 'Schema markup (JSON-LD)', open: 'about', weight: 1 }));
  for (let i = 0; i < 2; i++) defs.push({ kind: 'pipeline', label: 'Production system · content → QC', open: 'about', weight: 1 });
  ['November', 'December', 'January'].forEach(m => defs.push({ kind: 'calendar', m, label: 'Editorial calendars', open: 'about', weight: 1 }));
  defs.push({ kind: 'ad', p: 'google', h: 'Salesforce Consulting Partner', label: 'Google Ads', open: 'about', weight: 1 });
  defs.push({ kind: 'ad', p: 'meta', h: 'Homes worth the wait', label: 'Meta Ads', open: 'about', weight: 1 });
  defs.push({ kind: 'ad', p: 'google', h: 'Payroll, Done Right', label: 'Google Ads', open: 'about', weight: 1 });
  ['Search is now a conversation. Is your brand in it?', 'Succession planning starts before the resignation letter.', 'Content should be strategic. And fun.']
    .forEach(h => defs.push({ kind: 'social', h, label: 'LinkedIn thought leadership', open: 'about', weight: 1 }));
  [
    [['Schema markup', false], ['Core Web Vitals', true], ['llms.txt', false], ['Internal linking', true], ['Entity signals', false], ['Indexing', true]],
    [['Title & meta', true], ['AI crawler access', false], ['Canonicals', true], ['FAQ coverage', false], ['Image alt text', false], ['Sitemap', true]],
    [['Local listings', false], ['Service pages', true], ['Brand mentions', false], ['Backlink profile', true], ['Mobile UX', true], ['Page speed', false]],
  ].forEach(rows => defs.push({ kind: 'audit', rows, label: 'SEO + AI visibility audits', open: 'about', weight: 1 }));
  ['Three ways to grow.', 'Tiered retainers.'].forEach(h => defs.push({ kind: 'proposal', h, label: '60+ proposals', open: 'about', weight: 1 }));
  return defs;
}

// ------------------------------------------------------------ atlas
// Returns { canvas, cols, rows, defs } with every def given atlas coordinates.
export function buildAtlas(defs, tileW) {
  const k = tileW / TW, tileH = Math.round(TH * k), pad = 2;
  const cw = tileW + pad * 2, ch = tileH + pad * 2;
  const maxSize = tileW <= 256 ? 2048 : 4096;
  const cols = Math.max(1, Math.floor(maxSize / cw));
  const rows = Math.ceil(defs.length / cols);
  const canvas = document.createElement('canvas');
  canvas.width = cols * cw; canvas.height = rows * ch;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#09090b'; ctx.fillRect(0, 0, canvas.width, canvas.height);
  defs.forEach((d, i) => {
    const cx = (i % cols) * cw + pad, cy = Math.floor(i / cols) * ch + pad;
    ctx.save(); ctx.translate(cx, cy); ctx.scale(k, k);
    ctx.beginPath(); ctx.rect(0, 0, TW, TH); ctx.clip();
    try { P[d.kind](ctx, d, rng(i * 7919 + 13)); } catch (e) { ctx.fillStyle = '#222'; ctx.fillRect(0, 0, TW, TH); }
    ctx.restore();
    d.rect = [cx / canvas.width, 1 - (cy + tileH) / canvas.height, tileW / canvas.width, tileH / canvas.height];
  });
  return { canvas, cols, rows };
}
