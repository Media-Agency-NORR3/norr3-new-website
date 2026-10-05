import { isLocale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionary";
import { pageSeo, robotsDirective } from "@/lib/pageSeo";
import { JsonLd } from "@/components/JsonLd";
import { ORGANIZATION_ID, absolute, homeCrumb, pageGraph, type Crumb } from "@/lib/jsonld";
import { getSiteContent } from "@/lib/cms";
import { dashboardData, dataset } from "@/content/datasets";
import { Container, HeroPill } from "@/components/Container";
import { SplitHeadline } from "@/components/SplitHeadline";
import { PillButton } from "@/components/PillButton";
import { BookingButton } from "@/components/BookingButton";
import { Reveal } from "@/components/Reveal";
import { StaggerGrid } from "@/components/StaggerGrid";
import { SectionHeader } from "@/components/SectionHeader";
import { MediaMixSimulator } from "@/components/simulator/MediaMixSimulator";
import { DashboardMock } from "@/components/DashboardMock";
import { FloatingCard } from "@/components/FloatingCard";
import { HoverLift } from "@/components/HoverLift";
import { EngineAppsShowcase } from "@/components/heroes/EngineAppsShowcase";
import { Icon } from "@/components/Icon";
import { linkTo } from "@/lib/links";
import { ogImage } from "@/lib/ogImage";

export async function generateMetadata({ params }: PageProps<"/[locale]/engine">) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  const seo = await pageSeo("engine", locale, {
    title: dict.seo.engine.title,
    description: dict.seo.engine.description,
    image: ogImage("/images/brand/engine-team.webp"),
  });
  return {
    title: seo.title,
    description: seo.description,
    robots: robotsDirective(seo.robots),
    alternates: { canonical: seo.canonical || linkTo(locale, "/engine"), languages: { "fi-FI": "/engine", en: "/en/engine", "x-default": "/engine" } },
    openGraph: {
      type: "website" as const,
      siteName: "NØRR3",
      url: `https://norr3.fi${linkTo(locale, "/engine")}`,
      locale: locale === "fi" ? "fi_FI" : "en_US",
      title: seo.title,
      description: seo.description,
      images: [{ url: ogImage(seo.image), width: 1500, height: 1000, alt: "The team behind the NØRR3 Marketing Engine" }],
    },
    twitter: { card: "summary_large_image" as const, title: seo.title, description: seo.description, images: [ogImage(seo.image)] },
  };
}

export default async function EnginePage({ params }: PageProps<"/[locale]/engine">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = await getSiteContent();
  const dict = content.dictionaries[locale];
  const e = dict.engine;

  // Structured data: the same CMS-managed SEO the <head> uses, this page's
  // WebPage node and its breadcrumb (Home › engine).
  const seo = await pageSeo("engine", locale, {
    title: dict.seo.engine.title,
    description: dict.seo.engine.description,
    image: ogImage("/images/brand/engine-team.webp"),
  });
  const url = absolute(seo.canonical || linkTo(locale, "/engine"));
  const crumbs: Crumb[] = [homeCrumb(locale), { name: dict.nav.engine }];
  const jsonLd = pageGraph({ url, locale, name: seo.title, description: seo.description, image: seo.image, extra: { about: { "@type": "SoftwareApplication", name: "NØRR3 Marketing Engine", applicationCategory: "BusinessApplication", provider: { "@id": ORGANIZATION_ID } } }, crumbs });

  return (
    <>
      <JsonLd data={jsonLd} />
      {/* Hero — copy left, the live product (animated dashboard) right */}
      <Container className="pt-12 lg:pt-16">
        <Reveal>
          <HeroPill>{e.pill}</HeroPill>
        </Reveal>
        <SplitHeadline
          left={e.heroLeft}
          accent={e.heroAccent}
          accents={e.heroAccentWords}
          className="mt-6 text-[min(9vw,7.5rem)] leading-none"
        />
        <div className="mt-12 grid items-center gap-10 lg:mt-16 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-16">
          <Reveal className="flex flex-col items-start gap-6">
            <p className="max-w-md text-[15px] leading-relaxed text-ink/80 lg:text-base dark:text-white/80">
              {e.heroBody}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <PillButton href={linkTo(locale, "/contact")}>{dict.common.contactUs}</PillButton>
              <BookingButton kind="demo" locale={locale} variant="secondary">
                {dict.common.bookDemo}
              </BookingButton>
              <BookingButton kind="meeting" locale={locale} variant="secondary">
                {dict.common.bookCall}
              </BookingButton>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <FloatingCard className="rounded-card">
              <DashboardMock
                locale={locale}
                labels={e.dashboard}
                data={dataset(content.datasets, "dashboard", locale, dashboardData)}
              />
            </FloatingCard>
          </Reveal>
        </div>
      </Container>

      {/* The five apps — interactive showcase: pick an app, see it live */}
      <section className="py-16 lg:py-20">
        <Container>
          <SectionHeader heading={e.apps.heading} body={e.apps.body} />
          <div className="mt-12 lg:mt-14">
            <EngineAppsShowcase
              locale={locale}
              apps={e.apps.items}
              labels={{
                upcomingBadge: e.apps.upcomingBadge,
                upcomingWindow: e.apps.upcomingWindow,
                demoCampaigns: e.apps.demoCampaigns,
              }}
            />
          </div>
        </Container>
      </section>

      {/* Licence what you need + setup — four compact facts */}
      <section className="bg-pastel-purple/40 py-16 lg:py-20 dark:bg-white/[0.04]">
        <Container>
          <SectionHeader heading={e.licensing.heading} body={e.licensing.body} />
          <StaggerGrid className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
            {e.licensing.points.map((point) => (
              <HoverLift key={point.title} className="h-full">
                <div className="flex h-full flex-col gap-3 rounded-card bg-white p-5 ring-1 ring-black/5 dark:bg-white/[0.04] dark:ring-white/10">
                  <span className="flex h-11 w-11 items-center justify-center rounded-[5px] bg-violet text-white">
                    <Icon name={point.icon} style={{ fontSize: "20px" }} />
                  </span>
                  <h3 className="text-[15px] font-medium text-ink dark:text-white">{point.title}</h3>
                  <p className="text-[13px] leading-relaxed text-ink/60 dark:text-white/65">{point.body}</p>
                </div>
              </HoverLift>
            ))}
            <HoverLift className="h-full">
              <div className="flex h-full flex-col gap-3 rounded-card bg-yellow p-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-[5px] bg-ink text-white">
                  <Icon name="schedule" style={{ fontSize: "20px" }} />
                </span>
                <h3 className="text-[15px] font-medium text-ink">{e.setup.heading}</h3>
                <p className="text-[13px] leading-relaxed text-ink/70">{e.setup.body}</p>
              </div>
            </HoverLift>
          </StaggerGrid>
        </Container>
      </section>

      {/* Media Insights — the reach behind the Engine's channels (Meta, retail
          pDOOH, news display, city centres), before the live simulator. */}

      {/* Interactive media-mix simulator — the live demo */}
      <section id="simulator" className="scroll-mt-24 bg-ink py-16 lg:py-20 dark:border-y dark:border-white/10">
        <Container>
          <SectionHeader heading={e.simulator.heading} body={e.simulator.body} tone="light" />
          <Reveal delay={0.1} className="mt-12 lg:mt-14">
            <MediaMixSimulator locale={locale} labels={e.simulator} channels={content.channels} />
          </Reveal>
        </Container>
      </section>

      {/* Benefit + close — one band, one set of CTAs */}
      <section className="bg-violet py-16 lg:py-20">
        <Container>
          <Reveal className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
            <h2 className="text-3xl font-medium leading-[1.1] tracking-tight text-white lg:text-4xl">
              {e.benefit.heading}
            </h2>
            <p className="max-w-xl text-[15px] leading-relaxed text-white/75">{e.benefit.body}</p>
            <div className="flex flex-wrap justify-center gap-x-7 gap-y-2">
              {e.benefit.points.map((p) => (
                <span key={p.label} className="flex items-center gap-2 text-sm text-white/85">
                  <Icon name={p.icon} className="text-yellow" style={{ fontSize: "18px" }} />
                  {p.label}
                </span>
              ))}
            </div>
            <div className="mt-2 flex flex-wrap justify-center gap-3">
              <PillButton href={linkTo(locale, "/contact")} variant="lavender">
                {dict.common.contactUs}
              </PillButton>
              <BookingButton kind="demo" locale={locale} variant="outlineLight">
                {dict.common.bookDemo}
              </BookingButton>
              <BookingButton kind="meeting" locale={locale} variant="outlineLight">
                {dict.common.bookCall}
              </BookingButton>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
