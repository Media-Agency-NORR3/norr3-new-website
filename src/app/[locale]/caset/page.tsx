import { isLocale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionary";
import { pageSeo, robotsDirective } from "@/lib/pageSeo";
import { JsonLd } from "@/components/JsonLd";
import { itemList, absolute, homeCrumb, pageGraph, pageUrl, type Crumb } from "@/lib/jsonld";
import { getSiteContent } from "@/lib/cms";
import { Container, HeroPill } from "@/components/Container";
import { SplitHeadline } from "@/components/SplitHeadline";
import { PillButton } from "@/components/PillButton";
import { TextCta } from "@/components/TextCta";
import { Reveal } from "@/components/Reveal";
import { StaggerGrid } from "@/components/StaggerGrid";
import { SectionHeader } from "@/components/SectionHeader";
import { CountUpStat } from "@/components/CountUpStat";
import { LogoStrip } from "@/components/marquee/LogoStrip";
import { CaseCard } from "@/components/cards/CaseCard";
import { CaseFeature } from "@/components/cards/CaseFeature";
import { BlogCard } from "@/components/cards/BlogCard";
import { ContactBanner } from "@/components/ContactBanner";
import { linkTo } from "@/lib/links";
import { ogImage } from "@/lib/ogImage";

/** Editorial widths for the hero collage — varied, so the strip reads as a
 *  magazine contact sheet rather than a uniform row of thumbnails. */
const TILE_WIDTHS = ["w-40 sm:w-56", "w-32 sm:w-44", "w-36 sm:w-52", "w-32 sm:w-44"];

export async function generateMetadata({ params }: PageProps<"/[locale]/caset">) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  // CMS-owned SEO for this route, falling back to the dictionary entry and the
  // page's own social image so an untouched row changes nothing.
  const seo = await pageSeo("cases", locale, {
    title: dict.seo.cases.title,
    description: dict.seo.cases.description,
    image: ogImage("/images/cases/flow-festival.webp"),
  });
  return {
    title: seo.title,
    description: seo.description,
    robots: robotsDirective(seo.robots),
    alternates: { canonical: seo.canonical || linkTo(locale, "/caset"), languages: { "fi-FI": "/caset", en: "/en/caset", "x-default": "/caset" } },
    openGraph: {
      type: "website" as const,
      siteName: "NØRR3",
      url: `https://norr3.fi${linkTo(locale, "/caset")}`,
      locale: locale === "fi" ? "fi_FI" : "en_US",
      title: seo.title,
      description: seo.description,
      images: [{ url: ogImage(seo.image), width: 1600, height: 1066, alt: "NØRR3 case work" }],
    },
    twitter: { card: "summary_large_image" as const, title: seo.title, description: seo.description, images: [ogImage(seo.image)] },
  };
}

export default async function CasesPage({ params }: PageProps<"/[locale]/caset">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = await getSiteContent();
  const { clients } = content.brand;
  const dict = content.dictionaries[locale];
  const cases = content.cases;
  const insights = content.posts;
  const c = dict.cases;

  // Every case hidden in the CMS (e.g. while copies are being checked) means
  // the index shows a honest placeholder instead of crashing on cases[0].
  if (cases.length === 0) {
    return (
      <section className="pb-24 pt-24 lg:pb-32 lg:pt-32">
        <Container>
          <SplitHeadline left={c.heroLeft} accent={c.heroAccent} />
          <p className="mt-6 max-w-xl text-lg text-ink/70">
            {locale === "fi"
              ? "Case-tutkimuksemme päivittyvät parhaillaan — jutut palaavat tähän pian."
              : "Our case studies are being refreshed right now — they will be back shortly."}
          </p>
        </Container>
      </section>
    );
  }

  // Which case opens the index is an editorial choice now: the CMS marks one as
  // featured, and Flow Festival stays the default when nothing is marked.
  const featured =
    cases.find((x) => x.featured) ?? cases.find((x) => x.slug === "flow-festival") ?? cases[0];
  const rest = cases.filter((x) => x.slug !== featured?.slug);

  // The purple stat tile in the collage carries a real case metric rather than a
  // decorative number, read off the case itself so the two can never disagree.
  const statCase = cases.find((x) => x.slug === "suun-terveystalo") ?? featured;

  // Structured data: the same CMS-managed SEO the <head> uses, this page's
  // WebPage node and its breadcrumb (Home › cases).
  const seo = await pageSeo("cases", locale, {
    title: dict.seo.cases.title,
    description: dict.seo.cases.description,
    image: ogImage("/images/cases/flow-festival.webp"),
  });
  const url = absolute(seo.canonical || linkTo(locale, "/caset"));
  const crumbs: Crumb[] = [homeCrumb(locale), { name: dict.nav.cases }];
  const jsonLd = pageGraph({ url, locale, name: seo.title, description: seo.description, image: seo.image, type: "CollectionPage", extra: { mainEntity: itemList(`${url}#list`, cases.map((study) => ({ url: pageUrl(locale, `/${study.slug}`), name: study.client }))) }, crumbs });

  return (
    <>
      <JsonLd data={jsonLd} />
      {/*
        Section rhythm shared with Home / Services / Engine: a run of
        base-background sections opens with `pt-24 lg:pt-32` and every member
        closes with `pb-24 lg:pb-32`; full-width bands reset the run.
      */}

      {/* Hero */}
      <Container className="pb-24 pt-12 lg:pb-32 lg:pt-20">
        <Reveal>
          <HeroPill>{c.pill}</HeroPill>
        </Reveal>
        <SplitHeadline
          left={c.heroLeft}
          accent={c.heroAccent}
          className="mt-6 text-[min(9vw,6.25rem)] leading-none"
        />
        {/* Photo collage strip — real case photography, one tile per case, with
            the client named on the tile so the strip is legible, not abstract. */}
        <div className="mt-10 flex items-end gap-3 overflow-hidden lg:mt-12">
          {cases.map((study, i) => (
            <Reveal key={study.slug} delay={0.15 + i * 0.08} className={`relative shrink-0 ${TILE_WIDTHS[i % TILE_WIDTHS.length]}`}>
              <img
                src={study.image}
                alt={`${study.client} — ${study.tagline[locale]}`}
                width={1600}
                height={1066}
                className="h-40 w-full object-cover sm:h-56"
                // The first tile is in the hero viewport — it should not wait
                // for the lazy pass like the ones scrolling in behind it.
                loading={i === 0 ? "eager" : "lazy"}
                fetchPriority={i === 0 ? "high" : undefined}
              />
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2 pt-8 text-[11px] font-medium uppercase tracking-[0.14em] text-white"
              >
                {study.client}
              </span>
            </Reveal>
          ))}
          {/* Purple stat tile — the brand's solid-colour tile among the photos */}
          <Reveal delay={0.15 + cases.length * 0.08} className="relative hidden shrink-0 w-36 sm:block sm:w-52">
            <div className="flex h-40 w-full flex-col items-center justify-center gap-1 bg-purple px-4 text-center text-white sm:h-56">
              <span className="text-4xl font-medium tabular-nums tracking-tight sm:text-5xl">
                <CountUpStat
                  value={statCase.kpi.value}
                  decimals={statCase.kpi.decimals ?? 0}
                  prefix={statCase.kpi.prefix}
                  suffix={statCase.kpi.suffix}
                  locale={locale}
                />
              </span>
              <span className="text-[11px] leading-snug text-white/80">
                {statCase.client} — {statCase.kpi.label[locale]}
              </span>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.25} className="mt-10 flex flex-col items-start gap-6">
          <p className="max-w-md text-[15px] leading-relaxed text-ink/80 lg:text-base dark:text-white/80">
            {c.heroBody}
          </p>
          <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
            <PillButton href={linkTo(locale, "/contact")}>{dict.common.contactUs}</PillButton>
            <TextCta href="#kaikki-caset">{dict.common.heroSeeCases}</TextCta>
          </div>
        </Reveal>
      </Container>

      <LogoStrip clients={clients} locale={locale} />

      {/* Cases — one promoted feature, then the rest as an even photo grid.
          The old layout put a single orphan card in a three-column row below
          the asymmetric block; a feature + full row reads as an edited index. */}
      <section className="pb-24 pt-24 lg:pb-32 lg:pt-32">
        <Container>
          <SectionHeader id="kaikki-caset" heading={c.heading} body={c.body} />
          <div className="mt-14 lg:mt-16">
            <CaseFeature
              study={featured}
              locale={locale}
              eyebrow={c.featuredLabel}
              ctaLabel={dict.common.readCase}
            />
          </div>
          <StaggerGrid className="mt-16 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:mt-24 lg:grid-cols-3">
            {rest.map((study) => (
              <CaseCard key={study.slug} study={study} locale={locale} ctaLabel={dict.common.readCase} />
            ))}
          </StaggerGrid>
        </Container>
      </section>


      <ContactBanner
        locale={locale}
        heading={c.banner.heading}
        body={c.banner.body}
        cta={dict.common.contactUs}
        tone="yellow"
      />

      {/* Related posts */}
      <section className="pb-24 pt-24 lg:pb-32 lg:pt-32">
        <Container>
          <SectionHeader
            heading={dict.services.relatedPosts}
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

      {/* Pre-footer lavender banner — every other page closes on this beat. */}
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
