import { isLocale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { getSiteContent } from "@/lib/cms";
import { imageSlot } from "@/content/imageSlots";
import { companyStats, dashboardData, dataset } from "@/content/datasets";
import { Container } from "@/components/Container";
import { HeroRandomizer } from "@/components/heroes/HeroRandomizer";
import { PillButton } from "@/components/PillButton";
import { TextCta } from "@/components/TextCta";
import { Reveal } from "@/components/Reveal";
import { StaggerGrid } from "@/components/StaggerGrid";
import { SectionHeader } from "@/components/SectionHeader";
import { LogoStrip } from "@/components/marquee/LogoStrip";
import { HighlightsBand } from "@/components/marquee/HighlightsBand";
import { MediaPartnersStrip } from "@/components/marquee/MediaPartnersStrip";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { CaseCard } from "@/components/cards/CaseCard";
import { BlogCard } from "@/components/cards/BlogCard";
import { PhotoLinkCard } from "@/components/cards/PhotoLinkCard";
import { PhotoInterstitial } from "@/components/PhotoInterstitial";
import { ParallaxBand } from "@/components/ParallaxBand";
import { ContactBanner } from "@/components/ContactBanner";
import { DashboardMock } from "@/components/DashboardMock";
import { StatGrid } from "@/components/StatGrid";
import { TeamMarquee } from "@/components/TeamMarquee";
import { MediaAsset } from "@/components/MediaAsset";
import { linkTo } from "@/lib/links";
import { pageSeo } from "@/lib/pageSeo";
import { JsonLd } from "@/components/JsonLd";
import { ORGANIZATION_ID, breadcrumbList, homeCrumb, organizationNode, pageUrl, webPage, webSiteNode } from "@/lib/jsonld";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = await getSiteContent();
  const { clients } = content.brand;
  const dict = content.dictionaries[locale];
  const serviceCards = content.services;
  const cases = content.cases;
  const insights = content.posts;
  const { valuePills } = content.brand;

  // Alt text for the hero's three rotating cards: 01 Plan / 02 Execute / 03 Grow.
  const heroAlts: [string, string, string] =
    locale === "fi"
      ? [
          "NØRR3:n asiantuntijat suunnittelevat kampanjaa yhdessä",
          "NØRR3:n tiimi toteuttaa mainontaa Helsingin studiolla",
          "NØRR3:n tiimi juhlii kasvua kädet ilmassa studiolla",
        ]
      : [
          "NØRR3 specialists planning a campaign together",
          "NØRR3 creative execution in the Helsinki studio",
          "The NØRR3 team celebrating growth with arms raised",
        ];

  // The home page leads with three named cases; if one is unpublished in the
  // CMS the grid backfills from the top of the list rather than leaving a hole.
  // Section photography comes from named slots so it can be repointed in the CMS;
  // each falls back to the path and alt this page shipped with.
  const slot = (key: string, src: string, alt: string, caption?: string) =>
    imageSlot(content, key, locale, { src, alt, caption });

  const valuesPhoto = slot(
    "home.values",
    "/images/brand/space-lounge.webp",
    locale === "fi"
      ? "NØRR3:n studiolounge Helsingissä — avoin, valoisa ja rento"
      : "The NØRR3 studio lounge in Helsinki — open, bright and relaxed",
    dict.home.valuesCaption
  );
  const enginePhoto = slot(
    "home.engine",
    "/images/brand/engine-team.webp",
    locale === "fi"
      ? "NØRR3:n asiantuntijat työskentelevät yhdessä läppärin ääressä"
      : "NØRR3 specialists collaborating around a laptop"
  );
  const joinPhoto = slot(
    "home.join",
    "/images/brand/team-energy.webp",
    locale === "fi"
      ? "NØRR3:n tiimi juhlii kädet ilmassa studion NØRR3-kirjainten alla"
      : "The NØRR3 team celebrating with arms raised under the studio's NØRR3 letters"
  );
  const teamPhoto = slot(
    "home.team",
    "/images/brand/team-couch.webp",
    locale === "fi"
      ? "NØRR3:n tiimi nauramassa yhdessä studion sohvalla"
      : "The NØRR3 team laughing together on the studio sofa"
  );
  const agencyPhoto = slot(
    "home.agency",
    "/images/brand/award.webp",
    locale === "fi"
      ? "NØRR3:n tiimi alan palkinnon kanssa studion loungessa"
      : "The NØRR3 team with an industry award in the studio lounge"
  );

  const preferredCases = ["flow-festival", "kokkola", "st1"];
  const featuredCases = [
    ...preferredCases.map((slug) => cases.find((c) => c.slug === slug)).filter((c) => c !== undefined),
    ...cases.filter((c) => !preferredCases.includes(c.slug)),
  ].slice(0, 3);

  // One dataset, shared with the team page — the two used to keep their own copy
  // of these figures and could disagree.
  const inNumbers = dataset(content.datasets, "companyStats", locale, companyStats[locale]);

  // Structured data: the Organization is declared in full here (every other
  // page references it by @id), plus the WebSite and this page's WebPage.
  const seo = await pageSeo("home", locale, { title: dict.meta.title, description: dict.meta.description, image: "/images/brand/og-image.jpg" });
  const homeUrl = pageUrl(locale, "/");
  const jsonLd = [
    organizationNode(content, locale, dict.meta.description),
    webSiteNode(dict.meta.description),
    webPage({ url: homeUrl, locale, name: seo.title, description: seo.description, image: seo.image, extra: { about: { "@id": ORGANIZATION_ID } } }),
    breadcrumbList(homeUrl, [homeCrumb(locale)]),
  ];

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* Hero — randomizes between the original HomeHero and the CityHero
          (dark Helsinki cityscape parallax) on each page load. The CityHero
          forces the nav into dark-mode styling via data-city-hero-active. */}
      <HeroRandomizer
        locale={locale}
        heroes={content.heroes}
        left={dict.home.heroLeft}
        accent={dict.home.heroAccent}
        alts={heroAlts}
        heroBody={dict.home.heroBody}
        contactLabel={dict.common.contactUs}
        contactHref={linkTo(locale, "/contact")}
        logoStrip={<LogoStrip clients={clients} locale={locale} />}
      />

      {/*
        Section rhythm on this page: a run of base-background sections opens with
        `pt-24 lg:pt-32` and every member closes with `pb-24 lg:pb-32`, so the gap
        between two of them is exactly one unit. Full-width bands (Highlights,
        Engine, ContactBanner) bring their own padding and reset the run.
      */}

      {/* Services */}
      <section id="palvelut" className="scroll-mt-24 pb-24 pt-24 lg:pb-32 lg:pt-32">
        <Container>
          <SectionHeader
            heading={dict.home.services.heading}
            body={dict.home.services.body}
            cta={dict.common.allServices}
            ctaHref={linkTo(locale, "/services")}
          />
          <StaggerGrid className="mt-14 grid gap-card-gap sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
            {serviceCards.map((card) => (
              <ServiceCard
                key={card.number}
                number={card.number}
                icon={card.icon}
                title={card[locale].title}
                body={card[locale].body}
                items={card.items?.map((item) => ({
                  label: item[locale],
                  desc: locale === "fi" ? item.desc_fi : item.desc_en,
                }))}
                outcomes={card.outcomes?.[locale]}
                whatYouGetLabel={dict.common.whatYouGet}
              />
            ))}
          </StaggerGrid>
        </Container>
      </section>

      {/* Media Insights — the study figures behind the "we measure everything"
          promise, straight after the services that make it. */}

      {/* Values — full-bleed, full-screen CSS parallax band */}
      <ParallaxBand
        image={valuesPhoto.src}
        alt={valuesPhoto.alt}
        caption={valuesPhoto.caption}
        pills={valuePills.map((p) => ({ id: p.id, icon: p.icon, label: p[locale] }))}
      />

      {/* Cases */}
      {featuredCases.length > 0 && (
      <section id="caset" className="scroll-mt-24 pb-24 pt-8 lg:pb-32 lg:pt-10">
        <Container>
          <SectionHeader
            heading={dict.home.cases.heading}
            body={dict.home.cases.body}
            cta={dict.common.allCases}
            ctaHref={linkTo(locale, "/caset")}
          />
          <div className="mt-14 grid gap-x-6 gap-y-12 lg:mt-16 lg:grid-cols-2">
            <CaseCard study={featuredCases[0]} locale={locale} ctaLabel={dict.common.readCase} large />
            <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2">
              {featuredCases.slice(1).map((c) => (
                <CaseCard key={c.slug} study={c} locale={locale} ctaLabel={dict.common.readCase} />
              ))}
            </div>
          </div>
        </Container>
      </section>
      )}

      <HighlightsBand clients={clients} cases={cases} locale={locale} />

      {/* Marketing Engine */}
      <section id="engine" className="scroll-mt-24 bg-pastel-purple/40 py-24 lg:py-32 dark:bg-white/[0.04]">
        <Container>
          <SectionHeader
            heading={dict.home.engine.heading}
            body={dict.home.engine.body}
            cta={dict.common.accessDemo}
            ctaHref={linkTo(locale, "/engine")}
          />
          <div className="mt-14 grid items-stretch gap-card-gap lg:mt-16 lg:grid-cols-2">
            <Reveal delay={0.05} className="flex flex-col">
              <div className="overflow-hidden rounded-card">
                <MediaAsset
                  src={enginePhoto.src}
                  width={1500}
                  height={1000}
                  alt={enginePhoto.alt}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink/70 dark:text-white/70">{dict.home.engine.photoCaption}</p>
            </Reveal>
            <Reveal delay={0.15} className="flex flex-col gap-6">
              <DashboardMock locale={locale} labels={dict.engine.dashboard} data={dataset(content.datasets, "dashboard", locale, dashboardData)} />
              <div className="flex justify-center">
                <TextCta href={linkTo(locale, "/engine#simulator")}>{dict.common.heroTryEngineSim}</TextCta>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <ContactBanner
        locale={locale}
        heading={dict.banner.heading}
        body={dict.banner.body}
        cta={dict.common.contactUs}
        tone="yellow"
      />

      {/* About Us — the three blocks are now the same PhotoLinkCard the Cases
          grid above uses, so both grids share one photo/title/pill rhythm and
          the whole card (not just a small pill) is the click target. */}
      <section id="meista" className="scroll-mt-24 pb-24 pt-24 lg:pb-32 lg:pt-32">
        <Container>
          <SectionHeader
            heading={dict.home.about.heading}
            body={dict.home.about.body}
            cta={dict.common.allAboutUs}
            ctaHref={linkTo(locale, "/tiimi")}
          />
          <div className="mt-14 grid gap-x-6 gap-y-12 lg:mt-16 lg:grid-cols-2">
            <PhotoLinkCard
              href={linkTo(locale, "/tiimi")}
              image={joinPhoto.src}
              alt={joinPhoto.alt}
              title={dict.home.about.joinTitle}
              body={dict.home.about.joinBody}
              ctaLabel={dict.common.openJobs}
              large
            />
            <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2">
              <PhotoLinkCard
                href={linkTo(locale, "/tiimi")}
                image={teamPhoto.src}
                alt={teamPhoto.alt}
                title={dict.home.about.teamTitle}
                body={dict.home.about.teamBody}
                ctaLabel={dict.common.readMore}
              />
              <PhotoLinkCard
                href={linkTo(locale, "/tiimi")}
                image={agencyPhoto.src}
                alt={agencyPhoto.alt}
                title={dict.home.about.agencyTitle}
                body={dict.home.about.agencyBody}
                ctaLabel={dict.common.readMore}
              />
            </div>
          </div>

          {/* Numbers first, then the humans behind them — the stat row sets up
              the "Meet the humans behind the numbers" line that follows. */}
          <div className="mt-24 lg:mt-28">
            <StatGrid stats={inNumbers} locale={locale} label={dict.common.inNumbers} />
          </div>

          <div id="ihmiset" className="mt-24 scroll-mt-32 lg:mt-28">
            <Reveal className="mx-auto mb-10 flex max-w-3xl flex-col items-center gap-4 text-center">
              {/* Sub-section head: brand h3 (40px / 125% / -1.5%), one step below
                  the SectionHeader h2 above it. */}
              <h3 className="text-3xl font-medium leading-[1.25] tracking-[-0.015em] text-ink lg:text-h3 dark:text-white">
                {dict.home.people.heading}
              </h3>
              <p className="text-[15px] leading-relaxed text-ink/70 dark:text-white/70">{dict.home.people.body}</p>
            </Reveal>
            <TeamMarquee locale={locale} members={content.team} />
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-4">
              <PillButton href={linkTo(locale, "/tiimi")} variant="secondary">{dict.common.meetTeam}</PillButton>
            </div>
          </div>
        </Container>
      </section>

      {/* Blog */}
      <section id="blogi" className="scroll-mt-24 pb-24 lg:pb-32">
        <Container>
          <SectionHeader
            heading={dict.home.blog.heading}
            body={dict.home.blog.body}
            cta={dict.common.allInsights}
            ctaHref={linkTo(locale, "/insights")}
          />
          <StaggerGrid className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
            {insights.slice(0, 3).map((post) => (
              <BlogCard
                key={post.slug}
                post={post}
                locale={locale}
                readMoreLabel={dict.common.readMore}
                minReadLabel={dict.insights.minRead}
              />
            ))}
          </StaggerGrid>
        </Container>
      </section>

      <ContactBanner
        locale={locale}
        heading={dict.banner.heading}
        body={dict.banner.body}
        cta={dict.common.contactUs}
        tone="lavender"
      />

      {/* Media, platform and technology partners — the old site carried this
          logo line under its closing CTA, and it is what Antti means by the
          "partners banner" (TikTok was added here 2026-09-17). */}
      <MediaPartnersStrip />
    </>
  );
}
