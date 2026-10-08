#!/usr/bin/env python3
"""Generate JPG social-sharing twins for every team portrait.

Social scrapers (LinkedIn, Facebook, iMessage, Slack) do not reliably render
WebP, so `ogImage()` in `src/lib/ogImage.ts` maps
`/images/team/<slug>.webp` -> `/images/og/team/<slug>.jpg` and only uses the
twin when the file actually exists. This script creates those twins.

Each twin is a 1200x630 (OG/summary_large_image) JPEG cropped from the square
studio portrait so the face sits in the vertical centre: the crop band is
anchored at ANCHOR of the source height (the studio shots all place the head in
roughly the top third).

Run from the repo root:  python3 scripts/gen-team-og.py
"""
from __future__ import annotations

import glob
import os

from PIL import Image

SRC_GLOB = "public/images/team/*.webp"
OUT_DIR = "public/images/og/team"
W, H = 1200, 630
ANCHOR = 0.32  # y fraction of the source that lands on the band's centre
QUALITY = 88


def crop_band(im: Image.Image) -> Image.Image:
    """Crop a W:H band from `im`, centred on ANCHOR of the source height."""
    src_w, src_h = im.size
    ratio = W / H
    if src_w / src_h > ratio:  # wider than the target: crop the sides
        band_w = round(src_h * ratio)
        x0 = (src_w - band_w) // 2
        box = (x0, 0, x0 + band_w, src_h)
    else:  # taller/narrower than the target: crop top+bottom, face-centred
        band_h = round(src_w / ratio)
        y0 = round(ANCHOR * src_h - band_h / 2)
        y0 = max(0, min(src_h - band_h, y0))
        box = (0, y0, src_w, y0 + band_h)
    return im.convert("RGB").crop(box).resize((W, H), Image.LANCZOS)


def main() -> None:
    os.makedirs(OUT_DIR, exist_ok=True)
    made = []
    for src in sorted(glob.glob(SRC_GLOB)):
        slug = os.path.splitext(os.path.basename(src))[0]
        out = os.path.join(OUT_DIR, f"{slug}.jpg")
        with Image.open(src) as im:
            crop_band(im).save(out, "JPEG", quality=QUALITY, optimize=True, progressive=True)
        made.append((slug, os.path.getsize(out)))
    for slug, size in made:
        print(f"{slug:28s} {size / 1024:6.1f} KB")
    print(f"\n{len(made)} twin(s) written to {OUT_DIR}/ at {W}x{H}")


if __name__ == "__main__":
    main()
