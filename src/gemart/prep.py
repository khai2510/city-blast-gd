#!/usr/bin/env python3
"""City Blast! gem-art asset prep (Agents-Game, 22/11/2026, Khai: test the Gemini art against the current look).

    python3 src/gemart/prep.py <dir with the 22 Gemini PNGs> [out dir, default src/gemart/assets]

Inputs (names from floormen games/blast/art/gemini-prompts-2026-11-22.md): A01a-i UI kit, A02a-d + A03 + A04 icons
(all on a magenta #FF00FF-ish background), B01-B06 material textures, C01 9:16 backdrop.
What it does, per image:
  * magenta key, tolerant: the key colour is read from the image border (Gemini's magenta drifts, 238-255 / 1-38 / 238-252);
    "magenta-ness" m = min(R, B) - G, alpha = 1 - m / m_key (a navy / white / orange / red pixel has m <= 0: opaque);
    colours are un-mixed from the key (C = a F + (1 - a) K), then any left spill (min(R, B) > G) is pulled down to G,
    so the navy drop shadows stay navy and soft, and no pink fringe is left
  * auto-crop to the alpha box (+ a few px), resize (UI <= 512 px wide, icons 256, textures 512), WebP
  * two-up sheets are split (A01b pressed / disabled, A01f toggle ON / OFF); A01g is split into an empty track
    (the right half mirrored, the 85 % tick painted out) and the orange fill alone
  * textures: low-frequency light flattened (no tile-to-tile brightness steps) and the wrap seams cross-faded
    (left / right and top / bottom edges meet), so B03 / B04 / B05 / B06 repeat without a line
  * C01: the sky + skyline + edge trees down to the grass line, both sides cross-faded so it repeats round the band
Writes <out>/<name>.webp and <out>/assets.json ({name: {w, h, bytes}}). The 18 MB originals are not kept in the repo.
"""
import json, os, sys
import numpy as np
from PIL import Image, ImageFilter

SRC = sys.argv[1] if len(sys.argv) > 1 else '.'
OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(os.path.dirname(os.path.abspath(__file__)), 'assets')
os.makedirs(OUT, exist_ok=True)
META = {}


def load(name):
    for f in os.listdir(SRC):
        if f.startswith(name):
            return np.asarray(Image.open(os.path.join(SRC, f)).convert('RGB')).astype(np.float32) / 255.0
    raise SystemExit('missing source image ' + name)


def key_rgba(a):
    """magenta key -> RGBA float (straight alpha)."""
    h, w, _ = a.shape
    border = np.concatenate([a[:8].reshape(-1, 3), a[-8:].reshape(-1, 3), a[:, :8].reshape(-1, 3), a[:, -8:].reshape(-1, 3)])
    bm = np.minimum(border[:, 0], border[:, 2]) - border[:, 1]
    K = np.median(border[bm > 0.5], axis=0) if (bm > 0.5).sum() > 50 else np.array([1.0, 0.0, 1.0], np.float32)
    mk = min(K[0], K[2]) - K[1]
    m = np.minimum(a[..., 0], a[..., 2]) - a[..., 1]
    # hue gate: only pixels whose red and blue both lead green count as key (a red / orange / blue pixel never does)
    alpha = 1.0 - np.clip((m - 0.06 * mk) / (0.90 * mk - 0.06 * mk), 0.0, 1.0)
    alpha = np.where(alpha < 0.03, 0.0, np.where(alpha > 0.97, 1.0, alpha))
    # un-mix from the key colour
    ae = np.maximum(alpha, 1e-3)[..., None]
    F = (a - (1.0 - ae) * K[None, None, :]) / ae
    F = np.clip(F, 0.0, 1.0)
    # de-spill: min(R, B) above G is magenta cast; pull R and B down by the excess (more at the soft edge)
    ex = np.maximum(np.minimum(F[..., 0], F[..., 2]) - F[..., 1], 0.0)
    pull = np.clip(0.55 + 0.45 * (1.0 - alpha), 0.0, 1.0) * ex
    F[..., 0] -= pull
    F[..., 2] -= pull
    F = np.clip(F, 0.0, 1.0)
    # isolated specks (<2 px) of half alpha in the background: a 3x3 min filter on the "almost clear" mask
    rgba = np.dstack([F, alpha])
    return rgba


def crop(rgba, pad=4):
    """alpha box; rows / columns with <= 3 solid px are specks, not the object."""
    al = rgba[..., 3] > 0.2
    rows, cols = np.where(al.sum(axis=1) > 3)[0], np.where(al.sum(axis=0) > 3)[0]
    y0, y1 = max(0, rows.min() - pad), min(al.shape[0], rows.max() + 1 + pad)
    x0, x1 = max(0, cols.min() - pad), min(al.shape[1], cols.max() + 1 + pad)
    out = rgba[y0:y1, x0:x1].copy()
    # clear the specks outside the object (keep the soft shadow: only alpha < 0.5 islands far from the box edge rows matter)
    return out


def to_img(rgba):
    return Image.fromarray((np.clip(rgba, 0, 1) * 255 + 0.5).astype(np.uint8), 'RGBA' if rgba.shape[2] == 4 else 'RGB')


def save(name, im, width=None, q=86, height=None):
    if width and im.width != width:
        im = im.resize((width, max(1, round(im.height * width / im.width))), Image.LANCZOS)
    if height and im.height != height:
        im = im.resize((max(1, round(im.width * height / im.height)), height), Image.LANCZOS)
    f = os.path.join(OUT, name + '.webp')
    im.save(f, 'WEBP', quality=q, method=6, alpha_quality=90)
    META[name] = {'w': im.width, 'h': im.height, 'bytes': os.path.getsize(f)}
    print('%-14s %4dx%-4d %6.1f KB' % (name, im.width, im.height, META[name]['bytes'] / 1024))


def split_two(rgba):
    """two items side by side: cut at the clearest column near the middle."""
    al = rgba[..., 3].sum(axis=0)
    w = rgba.shape[1]
    mid = int(np.argmin(al[int(w * 0.35):int(w * 0.65)])) + int(w * 0.35)
    return crop(rgba[:, :mid]), crop(rgba[:, mid:])


def seamless(a, band=0.05, flat=True):
    """flatten the slow light gradient, then cross-fade the wrap edges (both axes)."""
    if flat:
        im = to_img(a)
        lo = np.asarray(im.resize((8, 8), Image.BILINEAR).resize((a.shape[1], a.shape[0]), Image.BICUBIC)).astype(np.float32) / 255.0
        mean = a.reshape(-1, 3).mean(axis=0)
        a = np.clip(a * (mean[None, None, :] / np.maximum(lo, 0.05)) * 0.6 + a * 0.4, 0, 1)
    h, w, _ = a.shape
    a = a.copy()
    bw = max(2, int(w * band))
    for i in range(bw):   # left / right
        t = 0.5 * (1.0 - i / bw)
        L, R = a[:, i].copy(), a[:, w - 1 - i].copy()
        a[:, i] = (1 - t) * L + t * R
        a[:, w - 1 - i] = (1 - t) * R + t * L
    bh = max(2, int(h * band))
    for i in range(bh):   # top / bottom
        t = 0.5 * (1.0 - i / bh)
        T, B = a[i].copy(), a[h - 1 - i].copy()
        a[i] = (1 - t) * T + t * B
        a[h - 1 - i] = (1 - t) * B + t * T
    return a


# ---- A01 UI kit
save('btn-green', to_img(crop(key_rgba(load('A01a')))), 512)
p, d = split_two(key_rgba(load('A01b')))
save('btn-green-press', to_img(p), 384)
save('btn-green-off', to_img(d), 384)
save('btn-blue', to_img(crop(key_rgba(load('A01c')))), 512)
save('btn-cream', to_img(crop(key_rgba(load('A01d')))), 512)
save('btn-round', to_img(crop(key_rgba(load('A01e')))), 192)
on, off = split_two(key_rgba(load('A01f')))
save('tog-on', to_img(on), 192)
save('tog-off', to_img(off), 192)
# progress bar: track = right part mirrored (85 % tick painted out), fill = the orange jelly alone
bar = crop(key_rgba(load('A01g')))
h, w, _ = bar.shape
rgb = bar[..., :3]
orange = (rgb[..., 0] > 0.8) & (rgb[..., 1] > 0.28) & (rgb[..., 1] < 0.68) & (rgb[..., 2] < 0.3) & (bar[..., 3] > 0.5)
frac = orange[int(h * 0.3):int(h * 0.7)].mean(axis=0)
best, cur = (0, 0), None   # the longest run of jelly columns (the rim's orange shading is a short run)
for x in range(w + 1):
    if x < w and frac[x] > 0.3:
        cur = x if cur is None else cur
    elif cur is not None:
        if x - cur > best[1] - best[0]:
            best = (cur, x - 1)
        cur = None
fx0, fx1 = best
ys = np.where(orange[:, fx0:fx1 + 1].mean(axis=1) > 0.2)[0]
fy0, fy1 = int(ys.min()), int(ys.max()) + 1
# fill: the bbox of the jelly; navy (B > R) and the yellow rim go clear, a soft edge
fill = bar[fy0:fy1, fx0:fx1 + 1].copy()
fr = bar[fy0:fy1, fx0:fx1 + 1, :3]
om = ((fr[..., 0] > 0.8) & (fr[..., 1] < 0.8) & (fr[..., 0] - fr[..., 2] > 0.25)) | (fr.min(axis=2) > 0.72)   # jelly + its white streak
runs = []
m = np.zeros(om.shape, np.float32)   # per column: solid between the first and the last strict-orange row (a clean pill)
for x in range(om.shape[1]):
    best, cur = (0, -1), None   # the longest run (the rim's orange shading is a separate, short run)
    for y in range(om.shape[0] + 1):
        if y < om.shape[0] and om[y, x]:
            cur = y if cur is None else cur
        elif cur is not None:
            if y - 1 - cur > best[1] - best[0]:
                best = (cur, y - 1)
            cur = None
    runs.append(best)
t_med = int(np.median([r[0] for r in runs if r[1] - r[0] > 2])); b_med = int(np.median([r[1] for r in runs if r[1] - r[0] > 2]))
for x, (r0, r1) in enumerate(runs):   # no column reaches past the jelly's own top / bottom line (the rim's white streak)
    r0, r1 = max(r0, t_med - 2), min(r1, b_med + 2)
    if r1 - r0 >= 0.5 * (b_med - t_med):   # a body column: the full jelly height (the streak's pale edge left holes)
        r0, r1 = min(r0, t_med), max(r1, b_med)
    if r1 - r0 > 2:
        m[r0:r1 + 1, x] = 1.0
m = np.asarray(Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8))).astype(np.float32) / 255
fill[..., 3] = m
save('bar-fill', to_img(crop(fill, pad=1)), 384)
# track: everything right of the fill (+ a gap) is empty track and the right cap; paint out the white tick, mirror it left
right = bar[:, fx1 + int(w * 0.025):].copy()
capw = int(h * 0.62)                                    # the right cap (rim curve), then a clean column of empty track
cap = right[:, -capw:]
mb = right[int(h * 0.35):int(h * 0.65), -capw - 60:-capw - 2, :3].max(axis=2).max(axis=0)   # the darkest column = no tick
cx = -capw - 60 + int(np.argmin(mb))
col = right[:, cx:cx + 1]
track = np.concatenate([cap[:, ::-1], np.repeat(col, h, axis=1), cap], axis=1)
save('bar-track', to_img(track), 512)
save('panel', to_img(crop(key_rgba(load('A01h')))), 512)
save('ribbon', to_img(crop(key_rgba(load('A01i')))), 512)

# ---- A02 / A03 / A04 icons (256)
for src, name in [('A02a', 'ic-ball'), ('A02b', 'ic-net'), ('A02c', 'ic-sky'), ('A02d', 'ic-lock'), ('A03', 'ic-tnt'), ('A04', 'ic-coin')]:
    r = crop(key_rgba(load(src)), pad=6)
    im = to_img(r)
    s = 256 / max(im.width, im.height)
    im = im.resize((max(1, round(im.width * s)), max(1, round(im.height * s))), Image.LANCZOS)
    sq = Image.new('RGBA', (256, 256), (0, 0, 0, 0)); sq.paste(im, ((256 - im.width) // 2, (256 - im.height) // 2))
    save(name, sq, q=84)

# ---- B textures (512, seamless)
for src, name, flat in [('B01', 'tx-glass', False), ('B02', 'tx-brick', True), ('B03', 'tx-concrete', True), ('B04', 'tx-steel', True), ('B05', 'tx-stone', True), ('B06', 'tx-pier', True)]:
    a = load(src)
    im = to_img(seamless(a, 0.04, flat)).convert('RGB').resize((512, 512), Image.LANCZOS)
    save(name, im, q=80)

# ---- C01 backdrop: down to the grass line (first row where the middle turns green), sides cross-faded
c = load('C01')
h, w, _ = c.shape
midc = c[:, w // 3: 2 * w // 3]
green = (midc[..., 1] > midc[..., 2] + 0.05) & (midc[..., 1] > midc[..., 0] + 0.05)
gy = int(np.where(green.mean(axis=1) > 0.6)[0].min())
sky = c[:gy + 6].copy()
bw = int(w * 0.06)
for i in range(bw):
    t = 0.5 * (1.0 - i / bw)
    L, R = sky[:, i].copy(), sky[:, w - 1 - i].copy()
    sky[:, i] = (1 - t) * L + t * R
    sky[:, w - 1 - i] = (1 - t) * R + t * L
save('sky', to_img(sky).convert('RGB'), 768, q=78)
META['sky']['grassY'] = gy

with open(os.path.join(OUT, 'assets.json'), 'w') as f:
    json.dump(META, f, indent=1, sort_keys=True)
tot = sum(v['bytes'] for v in META.values())
print('total %.1f KB in %d files -> %s' % (tot / 1024, len(META), OUT))
