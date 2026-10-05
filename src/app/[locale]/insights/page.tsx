import { isLocale } from "@/i18n/config";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getDictionary } from "@/lib/dictionary";
import { getSiteContent } from "@/lib/cms";
import { pageSeo, robotsDirective } from "@/lib/pageSeo";
import { JsonLd } from "@/components/JsonLd";
import { itemList, absolute, homeCrumb, pageGraph, pageUrl, type Crumb } from "@/lib/jsonld";
import { Container, HeroPill } from "@/components/Container";
import { SplitHeadline } from "@/components/SplitHeadline";
import { Reveal } from "@/components/Reveal";
import { StaggerGrid } from "@/components/StaggerGrid";
import { TextCta } from "@/components/TextCta";
import { BlogCard } from "@/components/cards/BlogCard";
import { ContactBanner } from "@/components/ContactBanner";
import { getPosts } from "@/lib/cms";
import { linkTo } from "@/lib/links";
import { ogImage } from "@/lib/ogImage";

export async function generateMetadata({ params }: PageProps<"/[locale]/insights">) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  // CMS-owned SEO for this route, falling back to the dictionary entry and the
  // page's own social image so an untouched row changes nothing.
  const seo = await pageSeo("insights", locale, {
    title: dict.seo.insights.title,
    description: dict.seo.insights.description,
    image: ogImage("/images/brand/space-arch.webp"),
  });
  return {
    title: seo.title,
    description: seo.description,
    robots: robotsDirective(seo.robots),
    alternates: {
      canonical: seo.canonical || linkTo(locale, "/insights"),
      languages: { "fi-FI": "/insights", en: "/en/insights", "x-default": "/insights" },
    },
    openGraph: {
      type: "website" as const,
      siteName: "NØRR3",
      url: `https://norr3.fi${linkTo(locale, "/insights")}`,
      locale: locale === "fi" ? "fi_FI" : "en_US",
      title: seo.title,
      description: seo.description,
      images: [
        { url: ogImage(seo.image), width: 1600, height: 1066, alt: "NØRR3 insights" },
      ],
    },
    twitter: {
      card: "summary_large_image" as const,
      title: seo.title,
      description: seo.description,
      images: [ogImage(seo.image)],
    },
  };
}

export default async function InsightsPage({ params }: PageProps<"/[locale]/insights">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const posts = await getPosts();
  const content = await getSiteContent();

  // The CMS marks one post as the lead; without one the newest post takes the
  // slot, which is what the index did before posts became editable.
  const featured = posts.find((post) => post.featured) ?? posts[0];
  const fc = featured?.[locale];
  const rest = posts.filter((post) => post.slug !== featured?.slug);

  // Structured data: the same CMS-managed SEO the <head> uses, this page's
  // WebPage node and its breadcrumb (Home › insights).
  const seo = await pageSeo("insights", locale, {
    title: dict.seo.insights.title,
    description: dict.seo.insights.description,
    image: ogImage("/images/brand/space-arch.webp"),
  });
  const url = absolute(seo.canonical || linkTo(locale, "/insights"));
  const crumbs: Crumb[] = [homeCrumb(locale), { name: dict.nav.insights }];
  const jsonLd = pageGraph({ url, locale, name: seo.title, description: seo.description, image: seo.image, type: "CollectionPage", extra: { mainEntity: itemList(`${url}#list`, posts.map((post) => ({ url: pageUrl(locale, `/${post.slug}`), name: post[locale].title }))) }, crumbs });

  return (
    <>
      <JsonLd data={jsonLd} />
      {/* Hero — the same rhythm as the other index pages: pill, display
          headline, one paragraph, then straight into the editorial feature. */}
      <Container className="pt-12 lg:pt-20">
        <Reveal>
          <HeroPill>{dict.insights.pill}</HeroPill>
        </Reveal>
        <Reveal delay={0.05}>
          <SplitHeadline
            left={dict.insights.heroLeft}
            accent={dict.insights.heroAccent}
            accents={dict.insights.heroAccentWords}
            stack
            className="mt-6 text-[min(9vw,7.5rem)] leading-none"
          />
        </Reveal>
        <Reveal delay={0.15} className="mt-6 flex flex-col items-start gap-6">
          <p className="max-w-md text-[15px] leading-relaxed text-ink/80 lg:text-base dark:text-white/80">
            {dict.insights.body}
          </p>
          <TextCta href="#kaikki-artikkelit">{dict.common.heroSeeInsights}</TextCta>
        </Reveal>
      </Container>

      {/* Featured article — the magazine opener, mirroring the cases index's
          CaseFeature: photo left, meta / title / excerpt / CTA pill right. */}
      {featured && fc && (
      <Container className="pb-24 pt-14 lg:pb-32 lg:pt-16">
        <Reveal>
          <Link
            href={linkTo(locale, `/${featured.slug}`)}
            className="group grid gap-8 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple lg:grid-cols-2 lg:items-center lg:gap-14 dark:focus-visible:outline-light-purple"
          >
            <div className="aspect-[4/3] overflow-hidden rounded-card">
              {featured.image ? (
                <img
                  src={featured.image}
                  alt={fc.title}
                  width={1600}
                  height={1066}
                  fetchPriority="high"
                  className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-pastel-purple/70 dark:bg-white/[0.06]">
                  <span className="select-none text-8xl font-medium text-white/80">{featured.ghost}</span>
                </div>
              )}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center rounded-full bg-yellow px-3.5 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-ink">
                  {dict.insights.featuredLabel}
                </span>
                <span className="text-xs text-ink/50 dark:text-white/50">
                  {featured.date} · {featured.readingMinutes} {dict.insights.minRead}
                </span>
              </div>
              <h2 className="mt-5 text-4xl font-medium leading-[1.05] tracking-tight text-ink transition-colors group-hover:text-purple lg:text-5xl dark:text-white dark:group-hover:text-light-purple">
                {fc.title}
              </h2>
              <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-ink/70 lg:text-base dark:text-white/70">
                {fc.excerpt}
              </p>
              {/* Same outlined pill the case feature and photo cards use, so
                  every "open this" affordance on the site looks alike. */}
              <span className="mt-8 inline-flex w-fit items-center rounded-full border border-ink/40 px-5 py-2 text-[11px] font-medium uppercase tracking-[0.08em] text-ink transition-colors group-hover:bg-ink group-hover:text-white dark:border-white/40 dark:text-white dark:group-hover:bg-white dark:group-hover:text-ink">
                {dict.common.readMore}
              </span>
            </div>
          </Link>
        </Reveal>
      </Container>
      )}

      {/* The rest of the archive under a hairline index header */}
      <Container className="pb-24 lg:pb-32">
        <Reveal id="kaikki-artikkelit" className="flex scroll-mt-32 items-baseline justify-between gap-6 border-t border-black/10 pt-6 dark:border-white/10">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.14em] text-purple dark:text-light-purple">
            {dict.common.allInsights}
          </h2>
          <p className="text-xs text-ink/50 dark:text-white/50">
            {posts.length} {dict.insights.articlesLabel}
          </p>
        </Reveal>
        <StaggerGrid className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
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
