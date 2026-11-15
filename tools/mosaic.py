"""Recompute data/mosaic.json from a cut-out portrait, using tile colours already in data/tiles.json."""
import json, random, sys
import numpy as np
from PIL import Image
SITE = '/home/claude/portfolio'
src = sys.argv[1] if len(sys.argv) > 1 else 'src/portrait2_cut.png'
TD = json.load(open(f'{SITE}/data/tiles.json'))
rgb = np.array([t['rgb'] for t in TD['tiles']]); lumT = rgb @ np.array([.299, .587, .114])
por = Image.open(src).convert('RGBA')
bbox = por.getchannel('A').point(lambda v: 255 if v > 40 else 0).getbbox(); por = por.crop(bbox)
w, h = por.size; por = por.crop((0, 0, w, int(min(h, w * 1.42))))   # head and shoulders
def mosaic(cols, seed):
    w, h = por.size; rows = round(cols * (h / w) * (4 / 3))
    g = np.asarray(por.resize((cols, rows), Image.LANCZOS), dtype=np.float32) / 255
    usage = np.zeros(len(rgb)); r = random.Random(seed); cells = []
    for y in range(rows):
        for x in range(cols):
            R, G, B, a = g[y, x]
            if a < 0.45 or (a < 0.8 and r.random() > a): continue
            lum = .299 * R + .587 * G + .114 * B
            lum = min(1, max(0, (lum - 0.04) * 1.12))          # a touch more contrast
            d = (lumT - lum) ** 2 + usage * 0.0035
            cand = np.argpartition(d, 18)[:18]; k = int(cand[r.randrange(18)]); usage[k] += 1
            lum = float(lum); cells.append([x, y, k, round(lum, 3), round(lum, 3), round(lum, 3), round(lum, 3)])
    pv = Image.new('RGB', (cols * 12, rows * 9), (8, 12, 36))
    for x, y, k, l, *_ in cells:
        c = rgb[k] * 0.45 + l * 0.55
        pv.paste(tuple(int(v * 255) for v in c), (x * 12, y * 9, x * 12 + 11, y * 9 + 8))
    pv.save(f'/tmp/mosaic2_{cols}.jpg', quality=85)
    print('mosaic', cols, 'x', rows, 'cells', len(cells), 'tiles used', int((usage > 0).sum()), 'of', len(rgb))
    return {'cols': cols, 'rows': rows, 'cells': cells}
json.dump({'lg': mosaic(68, 1), 'sm': mosaic(46, 2)}, open(f'{SITE}/data/mosaic.json', 'w'), separators=(',', ':'))
