"""Filter screenshots, pack atlases, write lightbox images, thumbnails, tile index and portrait mosaic."""
import json, os, re, random, math, shutil
import numpy as np
from PIL import Image, ImageOps

B = '/home/claude/build'; SITE = '/home/claude/portfolio'
for d in ['atlas', 'work', 'thumb', 'logos', 'data']:
    os.makedirs(f'{SITE}/{d}', exist_ok=True)
for f in os.listdir(f'{SITE}/work'): os.remove(f'{SITE}/work/{f}')
for f in os.listdir(f'{SITE}/thumb'): os.remove(f'{SITE}/thumb/{f}')

NAMES = {'valintry360': 'VALiNTRY360', 'valintry': 'VALiNTRY', 'ignitehcm': 'Ignite HCM', 'bullseye': 'Bullseye Engagement', 'calance': 'Calance',
         'prateek': 'Prateek Group', 'tag': 'TAG Manufacturing', 'advayan': 'Advayan', 'zapfire': 'ZAP FIRE', 'iinfotanks': 'IInfotanks'}
BAD_TITLE = re.compile(r'(404|not found|page not found|just a moment|attention required|access denied|forbidden|error|under maintenance|coming soon)', re.I)

def dhash(im, n=12):
    g = im.convert('L').resize((n + 1, n), Image.BILINEAR); a = np.asarray(g, dtype=np.int16)
    return (a[:, 1:] > a[:, :-1]).flatten()

def clean_title(t, client):
    t = re.sub(r'\s+', ' ', t or '').strip()
    t = re.split(r'\s+[|–—-]\s+(?=[^|–—-]*$)', t)[0] if re.search(r'\s[|–—-]\s', t) else t
    return t[:110]

shots = json.load(open(f'{B}/shots.json'))
kept, hashes, dropped = [], [], {'blank': 0, 'title': 0, 'dupe': 0}
for s in shots:
    try: im = Image.open(f"{B}/{s['file']}").convert('RGB')
    except Exception: continue
    a = np.asarray(im.resize((64, 48)), dtype=np.float32)
    if a.std() < 9: dropped['blank'] += 1; continue
    if re.search(r'/(contact|contact-us|get-in-touch|lets-connect)/?$', s['url'].lower().split('?')[0]): dropped.setdefault('contact', 0); dropped['contact'] += 1; continue
    if BAD_TITLE.search(s.get('title', '')) and not s.get('h1'): dropped['title'] += 1; continue
    h = dhash(im)
    if any(c == s['client'] and np.count_nonzero(h != hh) <= 5 for c, hh in hashes): dropped['dupe'] += 1; continue
    hashes.append((s['client'], h)); s['im'] = im; kept.append(s)
print('screenshots kept', len(kept), 'dropped', dropped)

designed = json.load(open(f'{B}/designed.json'))
tiles = []
for s in kept:
    title = s.get('h1') or clean_title(s.get('title'), s['client'])
    title = re.sub(r'\s+', ' ', title).strip()[:110]
    title = re.sub(r'\s*[—–]\s*', ' · ', title).strip(' ·')
    tiles.append({'src': s['im'], 'client': s['client'], 'cat': s['cat'], 'title': title, 'url': s.get('final') or s['url'], 'shot': True})
for d in designed:
    tiles.append({'src': Image.open(f"{B}/{d['file']}").convert('RGB'), 'client': d['client'], 'cat': 'Design', 'label': d['label'], 'open': d['open'], 'shot': False})

# interleave so each atlas holds a mix
rnd = random.Random(11); rnd.shuffle(tiles)
print('total unique tiles', len(tiles))

# ---------- per-tile images + colour stats
LG, SM, PAD = (256, 192), (128, 96), 2
meta = []
for i, t in enumerate(tiles):
    im = ImageOps.fit(t['src'], (1280, 960), Image.LANCZOS) if t['shot'] else t['src'].resize((1280, 960), Image.LANCZOS)
    t['lg'] = im.resize(LG, Image.LANCZOS); t['sm'] = im.resize(SM, Image.LANCZOS)
    small = np.asarray(im.resize((8, 6), Image.BILINEAR), dtype=np.float32) / 255
    t['avg'] = small.reshape(-1, 3).mean(0)
    m = {'i': i, 'c': t['client'], 't': t['cat'], 'rgb': [round(float(v), 3) for v in t['avg']]}
    if t['shot']:
        im.resize((1024, 768), Image.LANCZOS).save(f'{SITE}/work/{i:04d}.webp', 'WEBP', quality=72, method=5)
        im.resize((320, 240), Image.LANCZOS).save(f'{SITE}/thumb/{i:04d}.webp', 'WEBP', quality=74, method=5)
        m.update({'title': t['title'], 'url': t['url']})
    else:
        m.update({'label': t['label'], 'open': t['open']})
    meta.append(m)

# ---------- atlases
def pack(size, key, maxpx):
    cw, ch = size[0] + PAD * 2, size[1] + PAD * 2
    cols, rows = maxpx // cw, maxpx // ch; per = cols * rows
    n = math.ceil(len(tiles) / per)
    for a in range(n):
        chunk = tiles[a * per:(a + 1) * per]; r = math.ceil(len(chunk) / cols)
        W, H = cols * cw, r * ch
        # power-of-two-ish heights keep mipmaps tidy
        H2 = 1 << (H - 1).bit_length()
        atlas = Image.new('RGB', (W, min(H2, maxpx)), (9, 9, 11))
        for j, t in enumerate(chunk):
            x, y = (j % cols) * cw, (j // cols) * ch
            tile = t[key]
            # edge-extend padding to stop bleeding
            atlas.paste(tile.resize((size[0] + PAD * 2, size[1] + PAD * 2)), (x, y)); atlas.paste(tile, (x + PAD, y + PAD))
        atlas.save(f'{SITE}/atlas/{key}-{a}.webp', 'WEBP', quality=80, method=5)
        print(key, a, atlas.size, os.path.getsize(f'{SITE}/atlas/{key}-{a}.webp') // 1024, 'KB')
    return {'cols': cols, 'per': per, 'count': n, 'cw': cw, 'ch': ch, 'tw': size[0], 'th': size[1], 'pad': PAD, 'w': cols * cw}
for f in os.listdir(f'{SITE}/atlas'): os.remove(f'{SITE}/atlas/{f}')
layout = {'lg': pack(LG, 'lg', 4096), 'sm': pack(SM, 'sm', 2048)}
# atlas heights for uv maths
for k in layout:
    layout[k]['heights'] = [Image.open(f'{SITE}/atlas/{k}-{a}.webp').size[1] for a in range(layout[k]['count'])]

# ---------- portrait mosaic
por = Image.open(f'{B}/src/portrait_cut.png').convert('RGBA')
bbox = por.getchannel('A').point(lambda v: 255 if v > 40 else 0).getbbox(); por = por.crop(bbox)
def mosaic(cols, seed):
    w, h = por.size
    rows = round(cols * (h / w) * (4 / 3))
    g = np.asarray(por.resize((cols, rows), Image.LANCZOS), dtype=np.float32) / 255
    avgs = np.array([t['avg'] for t in tiles]); usage = np.zeros(len(tiles)); r = random.Random(seed)
    cells = []
    for y in range(rows):
        for x in range(cols):
            rr, gg, bb, a = g[y, x]
            if a < 0.45: continue
            if a < 0.8 and r.random() > a: continue
            tgt = np.array([rr, gg, bb])
            d = ((avgs - tgt) ** 2).sum(1) + usage * 0.006
            cand = np.argpartition(d, 16)[:16]; k = int(cand[r.randrange(16)])
            usage[k] += 1
            lum = 0.299 * rr + 0.587 * gg + 0.114 * bb
            cells.append([x, y, k, round(float(rr), 3), round(float(gg), 3), round(float(bb), 3), round(float(lum), 3)])
    pv = Image.new('RGB', (cols * 16, rows * 12), (9, 9, 11))
    for x, y, k, rr_, gg_, bb_, lum in cells:
        t = np.asarray(tiles[k]['sm'].resize((16, 12)), dtype=np.float32) / 255
        mix = t * 0.45 + np.array([rr_, gg_, bb_]) * 0.55
        pv.paste(Image.fromarray((mix * 255).astype(np.uint8)), (x * 16, y * 12))
    pv.save(f'/tmp/mosaic_{cols}.jpg', quality=85)
    print('mosaic', cols, 'x', rows, 'cells', len(cells), 'tiles used', int((usage > 0).sum()), 'of', len(tiles))
    return {'cols': cols, 'rows': rows, 'cells': cells}
json.dump({'lg': mosaic(76, 1), 'sm': mosaic(50, 2)}, open(f'{SITE}/data/mosaic.json', 'w'), separators=(',', ':'))

counts = {}
for m in meta:
    if 'url' in m: counts[m['c']] = counts.get(m['c'], 0) + 1
json.dump({'layout': layout, 'tiles': meta, 'names': NAMES, 'counts': counts}, open(f'{SITE}/data/tiles.json', 'w'), separators=(',', ':'))
for f in os.listdir(f'{B}/logos/final'):
    if not f.endswith('_plate.png'):
        im = Image.open(f'{B}/logos/final/{f}'); im.thumbnail((480, 160), Image.LANCZOS); im.save(f'{SITE}/logos/{f}', optimize=True)
print('counts', counts, 'pages', sum(counts.values()))
