const WORDMARK_SRC = "/logo-wordmark.svg";

/**
 * The NØRR3 wordmark.
 *
 * There used to be a triangle mark shown beside it (the numeral 3, in the
 * brand's other asset, morphs into one) and the wordmark used to be that
 * animated SVG directly. Both were removed: the mark is not part of the logo
 * as used on the site, and a shape morphing on a 6.2s loop in the header of
 * every page was more motion than the brand wanted. This is the wordmark
 * alone, static — `public/logo-wordmark.svg` is `logo-animated.svg` with its
 * SMIL `<animate>` elements stripped (171KB down to 6KB).
 *
 * Kept as an `<img>` rather than inlined: it is one asset shared and cached
 * across every page, and recolours for dark mode via a `brightness-0 invert`
 * filter rather than `currentColor`, so callers pass that as `className`.
 */
export function Logo({
  className = "",
  artwork,
}: {
  className?: string;
  /** A wordmark file uploaded in the CMS. Empty means the shipped SVG. */
  artwork?: { wordmark?: string };
}) {
  const customWordmark = artwork?.wordmark?.trim() || "";
  return (
    <img
      src={customWordmark || WORDMARK_SRC}
      alt="NØRR3"
      // Explicit intrinsic size: the wordmark is an SVG rendered at h-6, and
      // without width/height the nav shifts horizontally the moment the file
      // resolves (PSI flagged it under "image elements do not have explicit
      // dimensions"). 26px tall keeps the h-6 height; the ratio matches the
      // wordmark's viewBox, and `w-auto` still lets it scale.
      width={140}
      height={26}
      className={`h-6 w-auto select-none ${className}`}
      draggable={false}
    />
  );
}
