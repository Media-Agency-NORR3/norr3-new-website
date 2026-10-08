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
 * The universally-decodable MP4 sibling of a WebM/MOV source — the track that
 * must go FIRST in the `<video>`.
 *
 * WebM/VP9 files are smaller, but WebM is not safe as the primary source:
 * WebKit answers `canPlayType("video/webm")` with "maybe" even when it cannot
 * actually decode the file, so Safari picks the WebM `<source>` — and per the
 * HTML spec a source that is selected and then fails to decode is NOT retried
 * against the next one. The visitor gets a hero video that never starts, with
 * no fallback and no error. (This is the classic "Safari doesn't support webm
 * but still selects it and the video fails" trap, and it is why shipping the
 * MP4 *second* did not fix autoplay on phones — see the source order below.)
 *
 * The MP4 sibling is emitted first and the WebM/MOV second, so every engine
 * takes a track it can genuinely play.
 */
export function videoFallbackSrc(src: string): string | null {
  const clean = src.split(/[?#]/)[0];
  const extension = clean.split(".").pop()?.toLowerCase() ?? "";
  if (extension !== "webm" && extension !== "mov") return null;
  return clean.replace(/\.[^.]+$/, ".mp4");
}

/**
 * A still frame for a video, used as `poster`.
 *
 * iOS refuses to autoplay at all in Low Power Mode (and under Safari's stricter
 * Auto-Play setting), and the poster is what keeps the slot looking deliberate
 * rather than empty until the visitor interacts. Stills are generated beside
 * the video at the same basename with a `.webp` extension; when one is absent
 * the attribute simply 404s and the browser falls back to painting the video's
 * own first frame — the previous behaviour, so this is safe to emit always.
 */
export function videoPosterSrc(src: string): string | null {
  if (!isVideo(src)) return null;
  return src.split(/[?#]/)[0].replace(/\.[^.]+$/, ".webp");
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

  // MP4 first, then the WebM/MOV original. The ORDER is load-bearing: WebKit
  // says it can play video/webm and then fails to decode it, and a selected
  // <source> is never retried against the next one — see videoFallbackSrc().
  const universalSrc = videoFallbackSrc(src);
  const sources = universalSrc ? [universalSrc, src] : [src];

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
      // Still frame for the slot while the video is banned from autoplaying
      // (iOS Low Power Mode) or is still fetching — see videoPosterSrc().
      poster={poster ?? videoPosterSrc(src) ?? undefined}
      // Nothing here is a video the viewer chose to watch, so keep it out of the
      // way of AirPlay and the OS media controls.
      disableRemotePlayback
      aria-hidden={alt === "" ? true : undefined}
      aria-label={alt || undefined}
    >
      {sources.map((source) => (
        <source key={source} src={source} type={mimeFor(source)} />
      ))}
    </video>
  );
}
