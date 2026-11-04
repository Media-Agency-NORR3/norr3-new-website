import Link from "next/link";
import { CountUpStat } from "@/components/CountUpStat";
import { Reveal } from "@/components/Reveal";
import type { CaseStudy } from "@/content/cases";
import type { Locale } from "@/i18n/config";
import { linkTo } from "@/lib/links";

/**
 * The magazine opener for the cases index: one case promoted to a two-column
 * feature — photo left, client / thesis line / summary / results-in-numbers
 * right. The whole feature is a single link (so no nested anchors) and the CTA
 * pill inverts on hover, matching PhotoLinkCard's behaviour.
 *
 * The three figures come straight from the case's own `metrics`, so the index
 * leads with proof rather than with a longer summary than the cards below it.
 */
export function CaseFeature({
  study,
  locale,
  eyebrow,
  ctaLabel,
}: {
  study: CaseStudy;
  locale: Locale;
  eyebrow: string;
  ctaLabel: string;
}) {
  const metrics = study.metrics.slice(0, 3);

  return (
    <Reveal>
      <Link
        href={linkTo(locale, `/${study.slug}`)}
        className="group grid gap-8 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple lg:grid-cols-2 lg:items-center lg:gap-14 dark:focus-visible:outline-light-purple"
      >
        {/* The featured case's creative is shown WHOLE on a matte: a 4:3 cover
            crop sliced the edge of the artwork, where the client's wordmark
            often sits. No hover zoom either — scaling a contained image crops
            it again. */}
        <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-card bg-grey/70 dark:bg-white/[0.04]">
          <img
            src={study.image}
            alt={`${study.client} — ${study.tagline[locale]}`}
            width={1600}
            height={1066}
            className="h-full w-full object-contain"
            loading="lazy"
          />
        </div>

        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-purple dark:text-light-purple">
            {eyebrow}
          </p>
          <h3 className="mt-4 text-4xl font-medium leading-[1.05] tracking-tight text-ink transition-colors group-hover:text-purple lg:text-5xl dark:text-white dark:group-hover:text-light-purple">
            {study.client}
          </h3>
          <p className="mt-4 max-w-xl text-lg font-medium leading-snug tracking-tight text-ink/85 lg:text-xl dark:text-white/85">
            {study.tagline[locale]}
          </p>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink/65 dark:text-white/65">
            {study.summary[locale]}
          </p>

          {/* Same figure-over-hairline treatment as StatGrid, at card scale */}
          <div className="mt-8 grid grid-cols-3 gap-x-4 sm:gap-x-6">
            {metrics.map((m) => (
              <div key={m.label[locale]} className="border-t border-black/20 pt-3 dark:border-white/20">
                <p className="text-2xl font-medium leading-[1.15] tabular-nums tracking-[-0.04em] text-ink sm:text-3xl lg:text-4xl dark:text-white">
                  <CountUpStat
                    value={m.value}
                    decimals={m.decimals ?? 0}
                    prefix={m.prefix}
                    suffix={m.suffix}
                    locale={locale}
                  />
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-ink/65 dark:text-white/65">
                  {m.label[locale]}
                </p>
              </div>
            ))}
          </div>

          <span className="mt-8 inline-flex w-fit items-center rounded-full border border-ink/40 px-5 py-2 text-[11px] font-medium uppercase tracking-[0.08em] text-ink transition-colors group-hover:bg-ink group-hover:text-white dark:border-white/40 dark:text-white dark:group-hover:bg-white dark:group-hover:text-ink">
            {ctaLabel}
          </span>
        </div>
      </Link>
    </Reveal>
  );
}
