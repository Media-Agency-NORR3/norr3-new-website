import { MediaAsset } from "@/components/MediaAsset";
import { partners as bundledPartners, type Partner } from "@/content/partners";

/**
 * Media, platform and technology partner logos — the "partners line" the old
 * site carried under the mid-page CTA. A quiet monochrome marquee: logos sit
 * at reduced opacity in greyscale and colour in on hover, so the band reads as
 * one calm texture rather than forty competing brand palettes.
 *
 * Dark mode keeps the same greyscale treatment but puts each logo on its own
 * white tile. A white silhouette (brightness-0 + invert) flattened every mark
 * with a filled shape (the award badges, MTV, LinkedIn, YouTube, Ilta-Sanomat,
 * Outshine…) into a blank block; the tile keeps all of them readable.
 *
 * The marquee loops by rendering the row twice; the duplicate is hidden from
 * assistive tech and its images carry empty alt text so the partner names are
 * announced exactly once.
 */
export function MediaPartnersStrip({ partners = bundledPartners }: { partners?: Partner[] }) {
  const row = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {partners.map((partner) => (
        <div key={partner.id} className="mx-6 flex h-10 shrink-0 items-center dark:mx-2 dark:h-12 dark:rounded-lg dark:bg-white dark:px-4">
          <MediaAsset
            src={partner.src}
            alt={hidden ? "" : partner.label}
            className="h-8 w-auto max-w-[150px] object-contain opacity-70 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0"
          />
        </div>
      ))}
    </div>
  );

  return (
    <section className="border-y border-black/5 py-10 dark:border-white/10">
      <div
        className="marquee-paused mask-fade overflow-x-clip"
        style={{ ["--marquee-duration" as string]: "var(--marquee-partners, 70s)" }}
      >
        <div className="marquee-track items-center">
          {row(false)}
          {row(true)}
        </div>
      </div>
    </section>
  );
}
