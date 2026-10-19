#!/usr/bin/env python3
"""Generate right-sized poster variants for a CMS hero video.

The hero card stack plays a portrait video whose `poster` still is the LCP
element on the home page. The poster the CMS stores is a full-size still
(720x1280, ~91 kB) while the card box is only ~190 CSS px wide on a phone, so
the browser was fetching ~2.6x more image than it could ever paint.

This writes two WebP siblings next to the still, by filename convention:

    <stem>-p450.webp    450x800   mobile cards (<= 40 kB)
    <stem>-p720.webp    720x1280  desktop / high-DPR cards

`src/components/heroes/HeroVideo.tsx` builds its `srcset` from the same
convention, and falls back to the untouched original if a variant is missing.

Usage:
    python3 scripts/gen-hero-poster-variants.py <path/to/poster.webp> [more...]
    python3 scripts/gen-hero-poster-variants.py --all public/uploads/brand
"""
import os
import sys

try:
    from PIL import Image
except ImportError:  # pragma: no cover
    sys.exit("Pillow is required: pip install pillow")

# width -> webp quality. A width at or above the source's own width keeps the
# source's dimensions and is only re-encoded; anything smaller is resized.
VARIANTS = [(450, 78), (720, 74)]


def variants_for(path: str) -> list[str]:
    if not path.lower().endswith(".webp") or not os.path.isfile(path):
        print(f"skip (not a webp / missing): {path}")
        return []
    stem = path[: -len(".webp")]
    out: list[str] = []
    with Image.open(path) as source:
        size = source.size
        for width, quality in VARIANTS:
            if width < size[0]:
                height = round(size[1] * width / size[0])
            elif width == size[0]:
                height = size[1]
            else:
                continue  # never upscale
            target = f"{stem}-p{width}.webp"
            image = source.convert("RGB") if source.mode not in ("RGB", "RGBA") else source
            if width < size[0]:
                resample = getattr(Image, "Resampling", Image).LANCZOS
                image = image.resize((width, height), resample)
            image.save(target, "WEBP", quality=quality, method=6)
            out.append(f"{target}  {os.path.getsize(target) / 1024:.1f} kB  {width}x{height}")
    for line in out:
        print(line)
    return out


def main() -> None:
    args = sys.argv[1:]
    if not args:
        sys.exit(__doc__)
    paths: list[str] = []
    if args[0] == "--all":
        root = args[1] if len(args) > 1 else "public/uploads/brand"
        # Only video posters: a .webp that has a video sibling of the same stem.
        for name in sorted(os.listdir(root)):
            if not name.endswith(".webp"):
                continue
            stem = os.path.join(root, name[: -len(".webp")])
            if any(os.path.isfile(stem + ext) for ext in (".mp4", ".webm", ".mov")):
                paths.append(os.path.join(root, name))
    else:
        paths = args
    for path in paths:
        variants_for(path)


if __name__ == "__main__":
    main()
