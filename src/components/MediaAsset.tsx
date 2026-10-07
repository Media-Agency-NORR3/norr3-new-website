/**
 * An image slot that will also take a video.
 *
 * Anywhere the CMS stores "a piece of imagery" — a hero card, a section slot, a
 * case photo — the value is just a path, and it may now point at an MP4 as
 * easily as a WebP. Rather than teaching every component to branch, they render
 * this and it decides.
 *
 * Video is treated as decoration, not as content: silent, looping, no controls.
 * That is what makes autoplay permissible in the first place, and it is why
 * there is no play button — a loop nobody asked to start is not something a
 * viewer should have to stop.
 */

const VIDEO_EXTENSIONS = new Set(["mp4", "webm", "mov"]);

/** True when a stored media path points at a video rather than an image. */
export function isVideo(src: string | null | undefined): boolean {
  const extension = String(src ?? "")
    .split(/[?#]/)[0]
    .split(".")
    .pop()
    ?.toLowerCase();
  return extension ? VIDEO_EXTENSIONS.has(extension) : false;
}

const MIME: Record<string, string> = {
  mp4: "video/mp4",
  webm: "video/webm",
  mov: "video/quicktime",
};

function mimeFor(src: string): string | undefined {
  const extension = src.split(/[?#]/)[0].split(".").pop()?.toLowerCase() ?? "";
  return MIME[extension];
}

/**
 * The sibling MP4 for a WebM/MOV source — a universal fallback track.
 *
 * WebM/VP9 is the format this site standardises on (smaller files), but it is
 * NOT universally playable: iOS Safari only gained WebM/VP9 support recently, so
 * on an older iPhone a WebM-only `<video>` simply never starts. That is exactly
 * what happened when the hero loop was converted MP4 -> WebM with a single
 * source: the attributes were all correct (autoplay/muted/playsInline/loop) and
 * the file served fine, but the phone could not decode it — "the video in the
 * hero is not played by default anymore" (Wael, 2026-10-07).
 *
 * The fix keeps WebM as the first choice (browsers that can play it do, and get
 * the smaller file) and offers the same-named `.mp4` next. A `<source>` the
 * browser cannot use — because of the codec or because the file is absent — is
 * skipped and the next one is tried, so emitting this unconditionally is safe.
 */
export function videoFallbackSrc(src: string): string | null {
  const clean = src.split(/[?#]/)[0];
  const extension = clean.split(".").pop()?.toLowerCase() ?? "";
  if (extension !== "webm" && extension !== "mov") return null;
  return clean.replace(/\.[^.]+$/, ".mp4");
}

export function MediaAsset({
  src,
  alt = "",
  className = "",
  /** Passed to `<img loading>`. Ignored for video, which uses `preload` instead. */
  loading = "lazy",
  /** A still shown while a video's first frame is still arriving. */
  poster,
  draggable = false,
  style,
  /**
   * Intrinsic size, to reserve layout space before the file arrives. Applied to
   * video as well: the attributes mean the same thing on both elements, and a
   * slot that stops reserving space the moment it holds a video would reintroduce
   * the layout shift the numbers were added to prevent.
   */
  width,
  height,
  /** Image-only; a video decodes on its own schedule. */
  decoding,
  /**
   * Image-only hint for above-the-fold art (the hero deck). Left undefined,
   * the browser decides — which it does well for everything but the LCP card.
   */
  fetchPriority,
  ref,
}: {
  src: string;
  alt?: string;
  className?: string;
  loading?: "eager" | "lazy";
  poster?: string;
  draggable?: boolean;
  style?: React.CSSProperties;
  width?: number;
  height?: number;
  decoding?: "async" | "sync" | "auto";
  fetchPriority?: "high" | "low" | "auto";
  /** For callers that animate the element directly, such as ParallaxImage. */
  ref?: React.Ref<HTMLElement>;
}) {
  if (!isVideo(src)) {
    return (
      <img
        ref={ref as React.Ref<HTMLImageElement>}
        src={src}
        alt={alt}
        loading={loading}
        fetchPriority={fetchPriority}
        draggable={draggable}
        className={className}
        style={style}
        width={width}
        height={height}
        decoding={decoding}
      />
    );
  }

  // WebM first (smaller, the site standard), then the sibling MP4 for browsers
  // that cannot decode VP9 — see videoFallbackSrc().
  const fallbackSrc = videoFallbackSrc(src);

  return (
    <video
      ref={ref as React.Ref<HTMLVideoElement>}
      className={className}
      style={style}
      width={width}
      height={height}
      /**
       * These four attributes are one unit, and iOS is the reason.
       *
       * Safari refuses to autoplay anything with an audio track unless it is
       * muted, and on iPhone a video without `playsInline` is taken over by the
       * fullscreen player the moment it starts — so a background loop becomes a
       * fullscreen takeover. `muted` and `playsInline` are therefore not
       * preferences here; without either one this does not work on a phone.
       *
       * React needs `muted` set as a property rather than an attribute for it to
       * stick before the first play attempt, which `muted` as a JSX prop does.
       */
      autoPlay
      muted
      loop
      playsInline
      /**
       * `metadata` rather than `auto`: the container header is enough to start,
       * and a page of card-stack videos should not pull every full file on load.
       */
      preload="metadata"
      poster={poster}
      // Nothing here is a video the viewer chose to watch, so keep it out of the
      // way of AirPlay and the OS media controls.
      disableRemotePlayback
      aria-hidden={alt === "" ? true : undefined}
      aria-label={alt || undefined}
    >
      <source src={src} type={mimeFor(src)} />
      {/* Universal fallback: skipped automatically if the browser can already
          play WebM, or if the MP4 sibling does not exist. */}
      {fallbackSrc && <source src={fallbackSrc} type={mimeFor(fallbackSrc)} />}
    </video>
  );
}
