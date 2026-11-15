import { P, TW, TH, rr, fill, text, fit, wrap, chip, rng, frame } from './tiles.js';

const SERIF = '"Instrument Serif", serif';
const SANS = '"Inter Tight", sans-serif';

// [background, ink, muted, accent]
export const PAL = [
  ['#ff5a1f', '#111111', 'rgba(17,17,17,.62)', '#111111'],   // signal orange
  ['#2f5bff', '#ffffff', 'rgba(255,255,255,.7)', '#c6f432'],  // cobalt
  ['#c6f432', '#111111', 'rgba(17,17,17,.6)', '#2f5bff'],     // lime
  ['#ff4fa3', '#111111', 'rgba(17,17,17,.62)', '#ffffff'],    // pink
  ['#7b5cff', '#ffffff', 'rgba(255,255,255,.72)', '#ffd23f'], // violet
  ['#12c2a5', '#0b1d1a', 'rgba(11,29,26,.62)', '#ffffff'],    // teal
  ['#ffd23f', '#111111', 'rgba(17,17,17,.6)', '#ff5a1f'],     // yellow
  ['#ece9e2', '#111113', 'rgba(17,17,19,.55)', '#ff5a1f'],    // paper
  ['#141416', '#efede8', 'rgba(239,237,232,.55)', '#ff5a1f'], // ink
  ['#0f2a24', '#d8f5e8', 'rgba(216,245,232,.6)', '#12c2a5'],  // forest
  ['#2a0f3d', '#f6e9ff', 'rgba(246,233,255,.6)', '#ff4fa3'],  // plum
  ['#0c1c35', '#ffffff', 'rgba(255,255,255,.65)', '#f4821f'], // midnight
];

// client brand info: colours, logo, and whether the logo is drawn for dark or light grounds
export const BRANDS = {
  valintry360: { name: 'VALiNTRY360', sector: 'Salesforce consulting', region: 'US', bg: '#0b1f3a', bg2: '#3bb3e6', logo: 'valintry360.png', on: 'dark', chips: ['SEO', 'AI search', 'Content', 'LinkedIn'], line: 'Search, content and AI visibility for a Salesforce consulting partner' },
  valintry: { name: 'VALiNTRY', sector: 'Staffing & recruitment', region: 'US', bg: '#e8f3f8', bg2: '#1d4e6b', logo: 'valintry.png', on: 'light', chips: ['SEO', 'Content', 'Social'], line: 'Full-funnel marketing for a US staffing brand' },
  ignitehcm: { name: 'Ignite HCM', sector: 'Payroll & HR consulting', region: 'US', bg: '#1b1719', bg2: '#f2a33a', logo: 'ignitehcm.png', on: 'dark', chips: ['SEO', 'Backlinks', 'Reporting'], line: 'SEO, off-page and content for an ADP payroll and HR consultancy' },
  bullseye: { name: 'Bullseye Engagement', sector: 'Succession planning SaaS', region: 'US', bg: '#ffffff', bg2: '#3a2ca8', logo: 'bullseye.png', on: 'light', chips: ['Content', 'SEO', 'Reporting'], line: 'Content engine and SEO reporting for a talent and succession SaaS' },
  calance: { name: 'Calance', sector: 'IT services', region: 'US · India', bg: '#ffffff', bg2: '#214be8', logo: 'calance.png', on: 'light', chips: ['SEO', 'AI search', 'Email'], line: 'SEO, service-page builds and AI visibility for a global IT services firm' },
  prateek: { name: 'Prateek Group', sector: 'Real estate', region: 'Delhi NCR', bg: '#0b2a4a', bg2: '#faa61a', logo: 'prateek.png', on: 'dark', chips: ['SEO', 'AI visibility', 'Video'], line: 'SEO, YouTube and AI sentiment tracking for an NCR developer' },
  tag: { name: 'TAG Manufacturing', sector: 'Excavator attachments', region: 'Chattanooga, US', bg: '#141414', bg2: '#f5c400', logo: 'tag.png', on: 'dark', chips: ['SEO', 'AI search', 'Audit'], line: 'SEO and AI visibility for a US attachments manufacturer' },
  advayan: { name: 'Advayan', sector: 'IT & SAP consulting', region: 'US', bg: '#0a0f3d', bg2: '#6ab7ff', logo: 'advayan.png', on: 'dark', chips: ['SEO', 'AI search', 'Web'], line: 'SEO, AI visibility and a website revamp for an IT and SAP consultancy' },
  zapfire: { name: 'ZAP FIRE', sector: 'Fire safety', region: 'Gurugram', bg: '#1a1210', bg2: '#f26b21', logo: 'zapfire.png', on: 'dark', chips: ['Content', 'SEO', 'Local'], line: 'Content and local SEO for a fire protection company' },
  iinfotanks: { name: 'IInfotanks', sector: 'AI-powered marketing agency', region: 'Bengaluru', bg: '#ffffff', bg2: '#1a6fe0', logo: 'iinfotanks.png', on: 'light', chips: ['SEO', 'Content', 'Pages at scale'], line: 'In-house: case studies, 300+ location pages and the agency’s own search' },
};

const imgs = {};
export async function loadLogos() {
  await Promise.all(Object.entries(BRANDS).map(([k, b]) => new Promise(res => { const i = new Image(); i.onload = () => { imgs[k] = i; res(); }; i.onerror = res; i.src = b.logo; })));
}
function drawLogo(ctx, k, cx, cy, maxW, maxH) {
  const i = imgs[k]; if (!i) return;
  const s = Math.min(maxW / i.width, maxH / i.height); const w = i.width * s, h = i.height * s;
  ctx.drawImage(i, cx - w / 2, cy - h / 2, w, h);
}
const lum = hex => { const n = parseInt(hex.slice(1), 16); return ((n >> 16 & 255) * .299 + (n >> 8 & 255) * .587 + (n & 255) * .114) / 255; };

P.logo = (ctx, d) => {
  const b = BRANDS[d.k];
  const bg = d.variant === 'alt' ? (b.on === 'dark' ? b.bg2 : '#f4f2ee') : (b.on === 'dark' ? b.bg : '#ffffff');
  frame(ctx, bg);
  const dark = lum(bg) < .5;
  if (d.variant === 'alt' && b.on === 'dark') { ctx.fillStyle = b.bg; rr(ctx, 40, 110, TW - 80, 150, 18); ctx.fill(); }
  drawLogo(ctx, d.k, TW / 2, TH / 2 - 6, TW - 140, 110);
  text(ctx, `${b.sector} — ${b.region}`.toUpperCase(), TW / 2, TH - 34, `500 12px ${SANS}`, dark ? 'rgba(255,255,255,.55)' : 'rgba(0,0,0,.5)', 'center');
};
P.case = (ctx, d, r) => {
  const b = BRANDS[d.k]; const pal = d.pal;
  frame(ctx, pal[0]);
  text(ctx, 'CASE STUDY', 32, 46, `600 13px ${SANS}`, pal[2]);
  text(ctx, b.name, TW - 32, 46, `500 13px ${SANS}`, pal[2], 'right');
  wrap(ctx, d.h, 32, 120, TW - 64, 50, `italic 48px ${SERIF}`, pal[1]);
  // logo plate
  const plateBg = b.on === 'dark' ? b.bg : '#ffffff';
  rr(ctx, 32, TH - 98, 170, 64, 12); fill(ctx, plateBg);
  drawLogo(ctx, d.k, 32 + 85, TH - 66, 140, 40);
  let x = 220; for (const c of b.chips.slice(0, 2)) x += chip(ctx, c, x, TH - 82, lum(pal[0]) < .5) + 8;
};
P.brandcard = (ctx, d) => {
  const b = BRANDS[d.k];
  const g = ctx.createLinearGradient(0, 0, TW, TH); g.addColorStop(0, b.bg); g.addColorStop(1, b.bg2);
  ctx.fillStyle = g; ctx.fillRect(0, 0, TW, TH);
  const dark = lum(b.bg) < .5;
  rr(ctx, 32, 32, 200, 72, 14); fill(ctx, b.on === 'dark' ? 'rgba(0,0,0,.35)' : '#ffffff');
  drawLogo(ctx, d.k, 132, 68, 168, 48);
  wrap(ctx, b.line, 32, 190, TW - 64, 40, `italic 38px ${SERIF}`, '#ffffff');
  text(ctx, 'FULL MARKETING · ' + b.region.toUpperCase(), 32, TH - 32, `600 12px ${SANS}`, 'rgba(255,255,255,.8)');
};

const METRICS = [
  ['21', 'person team across content, design, dev, QC & off-page'], ['300+', 'webpages shipped every month'],
  ['5–10%', 'monthly traffic growth, every client'], ['10–15%', 'more leads every quarter'],
  ['2.5:1', 'average ROAS on paid campaigns'], ['60+', 'live-crawl audits turned into proposals'], ['10+', 'retained clients in India and the US'],
];
const WORDS = [
  ['Answer Engine Optimization', 'AEO'], ['Generative Engine Optimization', 'GEO'], ['Topical authority', 'Content'],
  ['Entity optimization', 'Technical SEO'], ['llms.txt', 'AI crawlers'], ['Schema, everywhere', 'JSON-LD'],
  ['Ship on time', 'Operations'], ['Get cited', 'AI search'], ['Make the numbers move', 'The job'], ['Rank', 'Search'],
  ['Strategic. Engaging. Fun.', 'Content'], ['Lower CPCs', 'Paid media'],
];
const CASE_LINES = {
  valintry360: ['Agentforce content that ranks and gets cited', 'A Salesforce partner, findable in AI answers'],
  valintry: ['Staffing pages built state by state', 'Candidates and clients, from one search engine'],
  ignitehcm: ['A monthly report the CEO actually reads', 'Payroll expertise, turned into search demand'],
  bullseye: ['Succession planning, explained at scale', 'Skyscraper content for an HR SaaS'],
  calance: ['Service pages by the dozen, internally linked', 'SharePoint content that wins the queries'],
  prateek: ['Real estate search, from Sector 150 to YouTube', 'AI sentiment tracked across five engines'],
  tag: ['From live-crawl audit to a 90-day plan', 'Excavator attachments, found by dealers'],
  advayan: ['A revamp built for search and AI', 'SAP expertise with an entity footprint'],
  zapfire: ['Fire safety, found locally', 'Service pages for every protection system'],
  iinfotanks: ['300+ location pages, one system', 'An agency that ships its own SEO'],
};

export function allDefs() {
  const defs = []; const keys = Object.keys(BRANDS);
  keys.forEach((k, i) => {
    const b = BRANDS[k];
    defs.push({ kind: 'logo', k, variant: 'main', client: k, label: `<b>${b.name}</b> · ${b.sector}` });
    defs.push({ kind: 'logo', k, variant: 'alt', client: k, label: `<b>${b.name}</b> · ${b.region}` });
    defs.push({ kind: 'brandcard', k, client: k, label: `<b>${b.name}</b> · full marketing` });
    CASE_LINES[k].forEach((h, j) => defs.push({ kind: 'case', k, h, pal: PAL[(i * 2 + j) % PAL.length], client: k, label: `<b>Case study</b> · ${b.name}` }));
    defs.push({ kind: 'client', c: { name: b.name, sector: b.sector, region: b.region, chips: b.chips }, idx: i, variant: i % 2 ? 'paper' : 'dark', client: k, label: `<b>${b.name}</b> · ${b.sector}` });
  });
  METRICS.forEach((m, i) => { defs.push({ kind: 'metric', m, pal: PAL[i % PAL.length], label: `${m[0]} ${m[1]}`, open: 'about' }); defs.push({ kind: 'metric', m, pal: PAL[(i + 5) % PAL.length], label: `${m[0]} ${m[1]}`, open: 'about' }); });
  WORDS.forEach((w, i) => { defs.push({ kind: 'word', w, pal: PAL[(i * 3) % PAL.length], label: w[0], open: 'about' }); defs.push({ kind: 'word', w, pal: PAL[(i * 3 + 7) % PAL.length], label: w[0], open: 'about' }); });
  const QUERIES = ['best salesforce consulting partner', 'succession planning software', 'excavator attachments manufacturer', 'fire safety company gurugram', 'adp payroll consultant', 'apartments in noida extension', 'sharepoint migration services', 'it staffing agency texas'];
  const ENGINES = ['ChatGPT', 'Gemini', 'Perplexity', 'Claude', 'Copilot'];
  QUERIES.forEach(q => defs.push({ kind: 'serp', q, label: 'SEO + AI Overviews', open: 'about' }));
  QUERIES.forEach((q, e) => defs.push({ kind: 'ai', q, e: e % 5, label: `AI visibility · ${ENGINES[e % 5]}`, open: 'about' }));
  [['Organic sessions', 'Month over month'], ['Leads from search', 'Quarter over quarter'], ['AI citations', 'Across five engines'], ['Pages indexed', 'After a technical fix'], ['Referring domains', 'Off-page, every month'], ['Branded search', 'Rising with content']]
    .forEach(([t, s]) => defs.push({ kind: 'chart', t, s, label: t, open: 'about' }));
  [['Salesforce consulting', 'Agentforce', 'Implementation', 'Managed services', 'Staffing'], ['Luxury apartments', 'Sector 150', 'NRI investment', 'Ready to move', 'Possession'],
   ['Excavator buckets', 'Thumbs', 'Couplers', 'Rippers', 'Dealers'], ['SharePoint', 'Microsoft 365', 'Help desk', 'Cybersecurity', 'Azure'], ['Payroll services', 'HR compliance', 'Time & labor', 'Benefits', 'Year-end']]
    .forEach(k => defs.push({ kind: 'clusters', k, label: 'Keyword clustering', open: 'about' }));
  [
    [[0, null, '{'], [1, '@type', '"Organization"'], [1, 'name', '"…"'], [1, 'sameAs', '[ … ]'], [1, 'knowsAbout', '[ … ]'], [1, 'address', '{ … }'], [1, 'areaServed', '"US"'], [0, null, '}']],
    [[0, null, '{'], [1, '@type', '"FAQPage"'], [1, 'mainEntity', '['], [2, '@type', '"Question"'], [2, 'name', '"…"'], [2, 'acceptedAnswer', '{ … }'], [1, null, ']'], [0, null, '}']],
    [[0, null, '{'], [1, '@type', '"Service"'], [1, 'provider', '{ … }'], [1, 'serviceType', '"…"'], [1, 'areaServed', '"India"'], [1, 'offers', '{ … }'], [0, null, '}']],
    [[0, null, '{'], [1, '@type', '"Article"'], [1, 'headline', '"…"'], [1, 'author', '{ … }'], [1, 'datePublished', '"2026-…"'], [1, 'publisher', '{ … }'], [0, null, '}']],
  ].forEach(lines => defs.push({ kind: 'schema', lines, label: 'Schema markup (JSON-LD)', open: 'about' }));
  for (let i = 0; i < 3; i++) defs.push({ kind: 'pipeline', label: 'Production system · content → QC', open: 'about' });
  ['November', 'December', 'January', 'February'].forEach(m => defs.push({ kind: 'calendar', m, label: 'Editorial calendars', open: 'about' }));
  [['google', 'Salesforce Consulting Partner'], ['meta', 'Homes worth the wait'], ['google', 'Payroll, Done Right'], ['meta', 'Talent, ready to grow'], ['google', 'Fire Safety AMC Experts']]
    .forEach(([p, h]) => defs.push({ kind: 'ad', p, h, label: p === 'meta' ? 'Meta Ads' : 'Google Ads', open: 'about' }));
  ['Search is now a conversation. Is your brand in it?', 'Succession planning starts before the resignation letter.', 'Content should be strategic. And fun.', 'Agentforce is here. Is your team ready?']
    .forEach(h => defs.push({ kind: 'social', h, label: 'LinkedIn thought leadership', open: 'about' }));
  [
    [['Schema markup', false], ['Core Web Vitals', true], ['llms.txt', false], ['Internal linking', true], ['Entity signals', false], ['Indexing', true]],
    [['Title & meta', true], ['AI crawler access', false], ['Canonicals', true], ['FAQ coverage', false], ['Image alt text', false], ['Sitemap', true]],
    [['Local listings', false], ['Service pages', true], ['Brand mentions', false], ['Backlink profile', true], ['Mobile UX', true], ['Page speed', false]],
    [['Duplicate URLs', false], ['HTTPS links', true], ['Orphan pages', false], ['Redirect chains', true], ['Thin content', false], ['Hreflang', true]],
  ].forEach(rows => defs.push({ kind: 'audit', rows, label: 'SEO + AI visibility audits', open: 'about' }));
  ['Three ways to grow.', 'Tiered retainers.', 'A 90-day pilot.'].forEach(h => defs.push({ kind: 'proposal', h, label: '60+ proposals', open: 'about' }));
  return defs;
}

export async function renderAll(scale = 1.25) {
  await loadLogos();
  const defs = allDefs(); const out = [];
  for (const [i, d] of defs.entries()) {
    const c = document.createElement('canvas'); c.width = TW * scale; c.height = TH * scale;
    const ctx = c.getContext('2d'); ctx.scale(scale, scale);
    P[d.kind](ctx, d, rng(i * 7919 + 13));
    const { kind, k, client, label, open } = d;
    out.push({ kind, client: client || k || null, label, open: open || (client ? 'work' : 'about'), data: c.toDataURL('image/png') });
  }
  return out;
}
