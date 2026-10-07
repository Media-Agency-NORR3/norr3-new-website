import { Fragment } from "react";
import Link from "next/link";
import { getDictionary } from "@/lib/dictionary";
import { getSiteContent } from "@/lib/cms";
import { linkTo } from "@/lib/links";
import { renderBodySegments } from "@/lib/richtext";
import type { Locale } from "@/i18n/config";
import { Container, HeroPill } from "@/components/Container";
import { SplitHeadline } from "@/components/SplitHeadline";
import { PillButton } from "@/components/PillButton";
import { Reveal } from "@/components/Reveal";
import { FurtherReading } from "@/components/FurtherReading";
import { SectionHeader } from "@/components/SectionHeader";
import { ContactBanner } from "@/components/ContactBanner";
import { Icon } from "@/components/Icon";
import { RailCards } from "@/components/RailCards";
import { buildRail } from "@/lib/rail";
import { servicePageLocalised, type ServicePage } from "@/content/servicePages";

/**
 * Temporarily hide the hero photos on all service landing pages while the
 * final imagery is being produced. Flip to `true` (or remove the guard) to
 * show the `image` field again.
 */
const SHOW_SERVICE_HERO_IMAGES = false;

/**
 * Inline links inside section body copy — the same treatment the site's
 * rich-text prose gives them (`.article-prose a` in globals.css): purple,
 * underlined at 35% strength, brightening on hover, light-purple in dark.
 */
const BODY_LINK_CLASS =
  "text-purple underline decoration-purple/35 underline-offset-3 transition-colors hover:decoration-purple focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple dark:text-light-purple dark:decoration-light-purple/35 dark:hover:decoration-light-purple dark:focus-visible:outline-light-purple";

/**
 * A keyword-optimised service landing page, rendered at a root slug
 * (`/hakukoneoptimointi`, `/mediasuunnittelu` …) via the [...slug] catch-all.
 */
export async function ServiceLandingView({ page, locale, railEnabled }: { page: ServicePage; locale: Locale; railEnabled: boolean }) {
  const dict = await getDictionary(locale);
  const content = await getSiteContent();
  const t = servicePageLocalised(page, locale);
  const related = content.servicePages.filter((p) => p.slug !== page.slug);
  // Right-rail support cards (CMS rail items + rail-placed insights), capped
  // at three by buildRail. Disabled or empty → the tree renders exactly as before.
  const rail = railEnabled
    ? buildRail({
        path: `/${page.slug}`,
        locale,
        insights: content.mediaInsights ?? [],
        items: content.railItems ?? [],
      })
    : [];

  return (
    <>
      <Container className="pt-12 lg:pt-16">
        <Reveal>
          <HeroPill>{t.title}</HeroPill>
        </Reveal>
        <SplitHeadline
          left={t.heroLeft}
          accent={t.heroAccent}
          className="mt-6 text-[min(8vw,6.25rem)] leading-none"
        />
        <Reveal delay={0.1} className="mt-8 flex flex-col items-start gap-6">
          <p className="max-w-xl text-[15px] leading-relaxed text-ink/80 lg:text-base dark:text-white/80">{t.intro}</p>
          <div className="flex flex-wrap items-center gap-3">
            <PillButton href={linkTo(locale, "/contact")}>{dict.common.contactUs}</PillButton>
            <PillButton href={linkTo(locale, "/services")} variant="secondary">
              {dict.common.allServices}
            </PillButton>
          </div>
        </Reveal>
      </Container>

      <section className="py-16 lg:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-16">
            {/* Content column */}
            <div className="space-y-12">
              {t.sections.map((section, i) => (
                <Reveal key={section.heading} delay={i * 0.05}>
                  <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-purple dark:text-light-purple">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h2 className="mt-2 text-2xl font-medium leading-tight tracking-tight text-ink lg:text-3xl dark:text-white">
                    {section.heading}
                  </h2>
                  {/* Body copy: `\n\n` becomes separate paragraphs and
                      `[text](/path)` an internal Link — see src/lib/richtext.ts.
                      A body using neither convention renders exactly as before. */}
                  {renderBodySegments(section.body).map((paragraph, pi) => (
                    <p key={pi} className="mt-3 max-w-xl text-[15px] leading-relaxed text-ink/70 dark:text-white/70">
                      {paragraph.map((segment, si) =>
                        segment.href ? (
                          <Link key={si} href={linkTo(locale, segment.href)} className={BODY_LINK_CLASS}>
                            {segment.text}
                          </Link>
                        ) : (
                          <Fragment key={si}>{segment.text}</Fragment>
                        )
                      )}
                    </p>
                  ))}
                </Reveal>
              ))}
              {/* Source references — small, unnumbered footnote under the last
                  section (never a numbered chapter). Empty = nothing renders. */}
              {t.sources?.trim() ? (
                <Reveal delay={0.1}>
                  <p className="max-w-xl whitespace-pre-line text-[11px] leading-relaxed text-ink/45 dark:text-white/45">
                    {t.sources}
                  </p>
                </Reveal>
              ) : null}

              {/* Outbound links to the industry bodies, measurement houses and
                  platform docs the page's work rests on (more external links —
                  SEO audit, Oct 2026). */}
              <Reveal delay={0.15}>
                <FurtherReading slug={page.slug} locale={locale} />
              </Reveal>
            </div>

            {/* Photo + checklist column — sticky, never taller than the viewport */}
            <div className="space-y-6 lg:sticky lg:top-28 lg:self-start">
              {railEnabled && rail.length > 0 ? <RailCards cards={rail} locale={locale} /> : null}
              {SHOW_SERVICE_HERO_IMAGES && page.image && (
                <Reveal delay={0.05}>
                  <div className="overflow-hidden rounded-card ring-1 ring-black/5 dark:ring-white/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={page.image}
                      alt={t.title}
                      width={800}
                      height={500}
                      loading="lazy"
                      className="max-h-[420px] w-full object-cover"
                    />
                  </div>
                </Reveal>
              )}
              <Reveal delay={0.1}>
                <div className="rounded-card bg-pastel-purple/60 p-card-pad dark:bg-white/[0.04] dark:ring-1 dark:ring-white/10">
                  <h3 className="text-lg font-medium text-ink dark:text-white">{dict.common.whatYouGet}</h3>
                  <ul className="mt-5 space-y-3">
                    {t.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink/75 dark:text-white/75">
                        <Icon name="check" className="mt-[2px] shrink-0 text-[16px] text-purple dark:text-light-purple" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* Media Insights data boxes suggested for this service page (CMS picks
          which are live). Sits between the copy and the related-service links. */}

      {/* Related services — internal links for SEO + navigation */}
      <section className="pb-16 lg:pb-20">
        <Container>
          <SectionHeader heading={dict.services.relatedCases} body={dict.services.areas.body} />
          <Reveal className="mt-10 flex flex-wrap gap-3">
            {related.map((p) => {
              const pt = servicePageLocalised(p, locale);
              return (
                <a
                  key={p.slug}
                  href={linkTo(locale, `/${p.slug}`)}
                  className="group inline-flex items-center gap-2 rounded-full border border-ink/25 bg-white px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white dark:border-white/25 dark:bg-white/5 dark:text-white dark:hover:bg-white dark:hover:text-ink"
                >
                  <Icon name={p.icon} style={{ fontSize: "18px" }} />
                  {pt.title}
                </a>
              );
            })}
          </Reveal>
        </Container>
      </section>

      <ContactBanner
        locale={locale}
        heading={dict.banner.heading}
        body={dict.banner.body}
        cta={dict.common.contactUs}
        tone="lavender"
      />
    </>
  );
}
