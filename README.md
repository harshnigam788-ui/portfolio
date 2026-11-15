# Harsh Nigam: portfolio

A static, single-page portfolio that changes colour section by section: hero with photo, statement,
services, an interactive toolkit, notes, a "beyond the resume" particle section, about, resume,
contact, and finally the work. The work ends in the archive, a portrait of Harsh made from 700+ tiles
of real client work (websites, blogs, service pages, case studies). Scrolling breaks it into a
Three.js fly-through that never ends: near the bottom the page jumps back and the flight carries on.
Every page tile opens a preview linked to the live page, and the index lists every page by client and type.

Resume: `resume/Harsh_Nigam_Resume_2026.pdf` and `resume/resume.json` (JSON Resume schema) are served
by GitHub Pages and raw.githubusercontent.com. To update, replace the files and push.

No build step to run the site. Any static host works (GitHub Pages, Netlify, Cloudflare Pages).

## Site files
- `index.html`, `style.css`, `app.js`: page, styles, motion (GSAP + Lenis from CDN), toolkit physics, particles and the archive scene
- `data/tiles.json`: every tile with client, type, title, live URL (or label for designed tiles), atlas layout
- `data/mosaic.json`: portrait mosaic cells for desktop (`lg`) and mobile (`sm`)
- `atlas/`: texture atlases (`lg-*` 256×192 tiles, `sm-*` 128×96 tiles)
- `work/`: 1024×768 previews for the lightbox. `thumb/`: 320×240 index thumbnails
- `logos/`: client logos
- `icons/`: tool logos (Simple Icons, CC0; Lobe Icons, MIT; Super Tiny Icons, MIT)
- `vendor/three.module.min.js`: Three.js r169 (MIT). `vendor/matter.min.js`: Matter.js (MIT)

## Editing the toolkit
The tools, categories, levels (out of five) and one-line descriptions live in the `TOOLS` list near
the top of `app.js`. Add an SVG to `icons/` with the same id to add a tool.

## Rebuilding the tiles (`tools/`)
1. `sitemaps.py`: pull URLs from each client sitemap
2. `select.py`: choose pages per client and type
3. `shoot.py`: screenshot them with Playwright + Chrome
4. `designer/`: designed tiles (logos, case-study cards, metrics), rendered in a browser
5. `assemble.py`: filter, pack atlases, write previews, thumbnails and `tiles.json`
6. `mosaic.py <cut-out portrait.png>`: rebuild the portrait mosaic from any photo

To add new work: add URLs to the selection, re-run 3 and 5, commit.
