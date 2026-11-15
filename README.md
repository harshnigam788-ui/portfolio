# Harsh Nigam — portfolio

A static, single-page portfolio: hero, approach, numbers, services, Work, clients, case studies,
path, toolkit, resume and contact. The Work section is a portrait of Harsh made from 700+ tiles of
real client work (websites, blogs, service pages, case studies); scrolling through the section breaks
it into a Three.js fly-through. Every page tile opens a preview linked to the live page, and the
index lists every page by client and type.

Resume: `resume/Harsh_Nigam_Resume_2026.pdf` and `resume/resume.json` (JSON Resume schema) are served
by GitHub Pages and raw.githubusercontent.com. To update, replace the files and push.

No build step to run the site — any static host works (GitHub Pages, Netlify, Cloudflare Pages).

## Site files
- `index.html`, `style.css`, `app.js` — page, styles, motion (GSAP + Lenis from CDN), particle field and the Work scene
- `data/tiles.json` — every tile: client, type, title, live URL (or label for designed tiles), atlas layout
- `data/mosaic.json` — portrait mosaic cells for desktop (`lg`) and mobile (`sm`)
- `atlas/` — texture atlases (`lg-*` 256×192 tiles, `sm-*` 128×96 tiles)
- `work/` — 1024×768 previews for the lightbox · `thumb/` — 320×240 index thumbnails
- `logos/` — client logos · `vendor/three.module.min.js` — Three.js r169 (MIT)

## Rebuilding the tiles (`tools/`)
1. `sitemaps.py` → pull URLs from each client sitemap
2. `select.py` → choose pages per client and type
3. `shoot.py` → screenshot them with Playwright + Chrome
4. `designer/` → designed tiles (logos, case-study cards, metrics), rendered in a browser
5. `assemble.py` → filter, pack atlases, write previews, thumbnails and `tiles.json`
6. `mosaic.py <cut-out portrait.png>` → rebuild the portrait mosaic from any photo

To add new work: add URLs to the selection, re-run 3 and 5, commit.
