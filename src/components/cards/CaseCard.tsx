import type { CaseStudy } from "@/content/cases";
import type { Locale } from "@/i18n/config";
import { PhotoLinkCard } from "./PhotoLinkCard";
import { CountUpStat } from "@/components/CountUpStat";
import { linkTo } from "@/lib/links";

/**
 * Photo-led case card: image, headline result badge, client name, summary,
 * outlined CTA. The badge restates the case's own headline metric (never a new
 * claim) and counts up on scroll — per the brand's "every claim carries a
 * number" rule, a case grid should read as evidence before it reads as copy.
 */
export function CaseCard({
  study,
  locale,
  ctaLabel,
  large = false,
}: {
  study: CaseStudy;
  locale: Locale;
  ctaLabel: string;
  large?: boolean;
}) {
  return (
    <PhotoLinkCard
      href={linkTo(locale, `/${study.slug}`)}
      image={study.image}
      alt={`${study.client} — ${study.tagline[locale]}`}
      title={study.client}
      body={study.summary[locale]}
      ctaLabel={ctaLabel}
      stat={
        <>
          <span className="text-sm font-medium tabular-nums">
            <CountUpStat
              value={study.kpi.value}
              decimals={study.kpi.decimals ?? 0}
              prefix={study.kpi.prefix}
              suffix={study.kpi.suffix}
              locale={locale}
            />
          </span>
          <span className="text-[11px]">{study.kpi.label[locale]}</span>
        </>
      }
      large={large}
      clampBody
      fit="contain"
    />
  );
}
