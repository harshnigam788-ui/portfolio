# harshnigam — portfolio

Personal site for Harsh Nigam, Marketing Strategist. A single static page: a Three.js
fly-through of work tiles behind the hero, with Work, About and Contact panels.

No build step. Any static host works (Cloudflare Pages, GitHub Pages, Netlify).

## Files
- `index.html` — all copy, panels, meta tags and Person schema (crawlable without JS)
- `style.css` — design tokens at the top (`--signal` is the accent colour)
- `app.js` — UI (panels, clock, contact form) and the WebGL scene
- `tiles.js` — the tile artwork, drawn in code; client list lives in `CLIENTS`
- `vendor/three.module.min.js` — Three.js r169 (MIT)
- `og.png`, `favicon.svg`, `robots.txt`, `llms.txt`

## Editing
- Copy: edit `index.html`. Client cards in the fly-through come from `CLIENTS` in `tiles.js`.
- Contact form opens the visitor's email app with the enquiry filled in. To send from the
  server instead, add an `/api/contact` function (e.g. Cloudflare Pages Function + Resend) and
  replace the `mailto` line in `app.js`.
- Real work images: add a tile kind that draws an `Image` onto the atlas in `buildAtlas`
  (load images first, then call `P.image(ctx, d)`), and push `{ kind: 'image', src, label }` defs.

## Run locally
    python3 -m http.server 8000   # then open http://localhost:8000
