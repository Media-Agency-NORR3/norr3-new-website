import { Reveal } from "./Reveal";
import { PillMarquee } from "./marquee/PillMarquee";

/**
 * Full-bleed, full-screen parallax band: the photograph fills the viewport as a
 * CSS background (cover) and uses `background-attachment: fixed` on desktop so
 * it stays put while the page scrolls over it — the classic "reveal on scroll"
 * parallax, no JavaScript. On touch devices (where `fixed` attachment is
 * unreliable) the image simply scrolls with the band, which is the graceful
 * degradation.
 *
 * The caption is centred; the pill marquee runs edge-to-edge with no gutter so
 * it is a true full-bleed strip. The band carries the photograph as a CSS
 * background, so it has no `<img>` to hold alt text — the accessible name lives
 * on an inner `role="img"` wrapper instead of on the `<section>` itself.
 * (Lighthouse's agentic-browsing audit flags `role="img"` on a `<section>`:
 * ARIA-in-HTML does not allow that role on a sectioning element, which breaks
 * the accessibility tree agents read.)
 */
export function ParallaxBand({
  image,
  alt,
  caption,
  pills,
}: {
  image: string;
  alt: string;
  caption?: string;
  pills: { id: string; icon: string; label: string }[];
}) {
  return (
    <section
      className="relative flex min-h-[100svh] w-full flex-col justify-end bg-cover bg-center bg-scroll md:bg-fixed"
      style={{ backgroundImage: `url(${image})` }}
    >
      {/* The photograph as an accessible image: a div (not the section) carries
          role="img" + the label, since role="img" is invalid on <section>. */}
      <div role="img" aria-label={alt} className="absolute inset-0" />

      {/* Legibility gradient over the photograph. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/45 via-ink/10 to-ink/60" />

      <div className="relative z-10 pb-8 lg:pb-10">
        <Reveal className="flex justify-center px-6">
          {caption && (
            <p className="max-w-3xl text-center text-2xl font-medium leading-snug text-white sm:text-3xl lg:text-4xl">
              {caption}
            </p>
          )}
        </Reveal>
        <div className="mt-14 w-full overflow-hidden">
          <PillMarquee items={pills} duration="40s" monochrome />
        </div>
      </div>
    </section>
  );
}
