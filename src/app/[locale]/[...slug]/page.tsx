import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { getCase, getCmsPage, getPost, getSiteContent } from "@/lib/cms";
import type { CaseStudy } from "@/content/cases";
import { buildBlockContext } from "@/components/blocks/context";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { CaseDetailView } from "@/components/views/CaseDetailView";
import { InsightArticleView } from "@/components/views/InsightArticleView";
import { ServiceLandingView } from "@/components/views/ServiceLandingView";
import { servicePageLocalised } from "@/content/servicePages";
import { linkTo } from "@/lib/links";
import { caseDescription, caseTitle } from "@/lib/caseSeo";
import { ogImage } from "@/lib/ogImage";
import { pageSeo } from "@/lib/pageSeo";
import { railEnabled, splitRailPreview } from "@/lib/rail";
import { JsonLd } from "@/components/JsonLd";
import { modificationIso, publicationIso } from "@/lib/dates";
import { absolute, faqItemsFromBlocks, faqPage, homeCrumb, pageGraph, pageUrl, serviceGraph, type Crumb } from "@/lib/jsonld";

/**
 * Serves everything that lives at a short, root-level slug:
 *
 *  1. hand-built routes (/services, /cases, /insights …) — Next matches static
 *     segments before a catch-all, so those always win;
 *  2. case studies — `/kiinteistomaailma`, `/st1` — the same URLs the old
 *     WordPress site used, so their accumulated SEO carries over unchanged;
 *  3. service landing pages — `/hakukoneoptimointi`, `/mediasuunnittelu` …;
 *  4. pages composed in the CMS page editor — any slug an editor publishes;
 *  5. insight posts — `/isojen-ruutujen-trendit`.
 *
 * The order of 3–5 is deliberate and load-bearing: a published blog post must
 * never take over the address of a service page or a CMS page (see
 * `logSlugConflict` below). The CMS refuses such a slug at save/publish time;
 * this route is the second line of defence, so a post that got in through older
 * data still cannot hide a page.
 *
 * The section URLs (`/cases/st1`, `/insights/…`) 301 to these root slugs, so
 * there is exactly one canonical URL per piece of content.
 */

/**
 * Two surfaces claimed the same root-level slug. The page wins here; the
 * conflict is a content bug the CMS has to fix (the post keeps its URN, so it
 * becomes unreachable), so leave a trail rather than overriding silently.
 */
function logSlugConflict(path: string, locale: string, winner: string, loser: string) {
  console.warn(
    `[norr3][slug-conflict] /${path} (${locale}): ${winner} wins over ${loser} — ` +
      `give the losing surface a new slug in the CMS.`
  );
}
/**
 * No `searchParams` here on purpose: awaiting them makes the route dynamic
 * (rendered per request, `Cache-Control: no-store`). Every page below is
 * ISR-cached instead; the one query-driven feature — the `?rail=1` staging
 * preview — arrives as the `__rail` path segment the proxy rewrites to.
 */
type Params = {
  params: Promise<{ locale: string; slug: string[] }>;
};

/** Pre-render the content we know at build time; anything else renders on demand. */
export async function generateStaticParams() {
  const content = await getSiteContent();
  return [
    ...content.cases.map((study) => ({ slug: [study.slug] })),
    ...content.posts.map((post) => ({ slug: [post.slug] })),
    ...content.servicePages.map((page) => ({ slug: [page.slug] })),
  ];
}

/**
 * A case page's meta description lives in `@/lib/caseSeo` so the <title>, the
 * meta description and the page's JSON-LD all come from one place.
 */
export async function generateMetadata({ params }: Params) {
  const { locale, slug: rawSlug } = await params;
  if (!isLocale(locale)) return {};
  // The staging rail preview renders the real page's metadata (canonical
  // included) — the `__rail` segment is an internal detail, never a URL.
  const { slug } = splitRailPreview(rawSlug);
  const path = slug.join("/");
  // The post is resolved up front only so the precedence chain below can log a
  // shadowed post; it is the LAST surface consulted, mirroring the page body.
  const post = slug.length === 1 ? await getPost(slug[0]) : undefined;

  // Case study at the root slug.
  const study = slug.length === 1 ? await getCase(slug[0]) : undefined;
  if (study) {
    if (post) logSlugConflict(path, locale, `case study “${study.slug}”`, `blog post “${post.slug}”`);
    const title = caseTitle(study, locale);
    const description = caseDescription(study, locale);
    return {
      title,
      description,
      alternates: {
        canonical: linkTo(locale, `/${slug[0]}`),
        languages: { "fi-FI": `/${slug[0]}`, en: `/en/${slug[0]}`, "x-default": `/${slug[0]}` },
      },
      openGraph: {
        type: "article" as const,
        siteName: "NØRR3",
        url: `https://norr3.fi${linkTo(locale, `/${slug[0]}`)}`,
        locale: locale === "fi" ? "fi_FI" : "en_US",
        title,
        description,
        images: [{ url: ogImage(study.image), width: 1600, height: 1066, alt: `${study.client} — ${study.tagline[locale]}` }],
      },
      twitter: { card: "summary_large_image" as const, title, description, images: [ogImage(study.image)] },
    };
  }

  // Service landing page at the root slug.
  const servicePage = (await getSiteContent()).servicePages.find((p) => p.slug === slug.join("/"));
  if (servicePage) {
    if (post) logSlugConflict(path, locale, `service page “${servicePage.slug}”`, `blog post “${post.slug}”`);
    const t = servicePageLocalised(servicePage, locale);
    // SEO is CMS-managed (Pages screen) with the bundled copy as fallback, so
    // the service landing pages behave like every other hand-built route.
    const seo = await pageSeo(slug.join("/"), locale, {
      title: t.metaTitle,
      description: t.metaDescription,
      image: "/images/brand/services-planning.webp",
    });
    return {
      title: seo.title,
      description: seo.description,
      alternates: {
        // The full path, not slug[0]: nested service pages (mediasuunnittelu/radio)
        // must point at themselves, not at their parent.
        canonical: linkTo(locale, `/${path}`),
        languages: { "fi-FI": `/${path}`, en: `/en/${path}`, "x-default": `/${path}` },
      },
      openGraph: {
        type: "website" as const,
        siteName: "NØRR3",
        url: `https://norr3.fi${linkTo(locale, `/${path}`)}`,
        locale: locale === "fi" ? "fi_FI" : "en_US",
        title: seo.title,
        description: seo.description,
        images: [{ url: ogImage(seo.image), width: 1600, height: 1066, alt: t.title }],
      },
      twitter: { card: "summary_large_image" as const, title: seo.title, description: seo.description, images: [ogImage(seo.image)] },
    };
  }

  // A page composed in the CMS page editor.
  const page = await getCmsPage(path);
  if (page && post) logSlugConflict(path, locale, `CMS page “${page.slug}”`, `blog post “${post.slug}”`);
  if (!page) {
    // Insight post at the root slug — consulted last, so a service page or a
    // CMS page with the same slug keeps its own title/description.
    if (post) {
      const content = post[locale];
      const image = ogImage(post.image ?? "/images/brand/space-arch.webp");
      return {
        title: post.seo[locale].title || `${content.title} — NØRR3`,
        description: post.seo[locale].description || content.excerpt,
        alternates: {
          canonical: linkTo(locale, `/${slug[0]}`),
          languages: { "fi-FI": `/${slug[0]}`, en: `/en/${slug[0]}`, "x-default": `/${slug[0]}` },
        },
        openGraph: {
          type: "article" as const,
          siteName: "NØRR3",
          url: `https://norr3.fi${linkTo(locale, `/${slug[0]}`)}`,
          locale: locale === "fi" ? "fi_FI" : "en_US",
          title: content.title,
          description: content.excerpt,
          // article:published_time / article:modified_time. Same ISO stamps as
          // the JSON-LD, so the <head> and the structured data never disagree.
          ...(publicationIso(post.publishedAt, post.updatedAt)
            ? { publishedTime: publicationIso(post.publishedAt, post.updatedAt) }
            : {}),
          ...(modificationIso(post.publishedAt, post.updatedAt)
            ? { modifiedTime: modificationIso(post.publishedAt, post.updatedAt) }
            : {}),
          images: [{ url: image, width: 1600, height: 1066, alt: content.title }],
        },
        twitter: {
          card: "summary_large_image" as const,
          title: content.title,
          description: content.excerpt,
          images: [image],
        },
      };
    }
    return {};
  }

  const seo = page.seo[locale];
  const title = seo.title || `${page.title[locale] || page.title.fi} — NØRR3`;
  const description = seo.description || undefined;
  const image = page.ogImage || "/images/brand/og-image.jpg";

  return {
    title,
    description,
    alternates: {
      canonical: linkTo(locale, `/${path}`),
      languages: { "fi-FI": `/${path}`, en: `/en/${path}`, "x-default": `/${path}` },
    },
    openGraph: {
      type: "website" as const,
      siteName: "NØRR3",
      url: `https://norr3.fi${linkTo(locale, `/${path}`)}`,
      locale: locale === "fi" ? "fi_FI" : "en_US",
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: page.title[locale] || "NØRR3" }],
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
      images: [image],
    },
  };
}

export default async function RootSlugPage({ params }: Params) {
  const { locale, slug: rawSlug } = await params;
  if (!isLocale(locale)) notFound();
  const { preview: railPreview, slug } = splitRailPreview(rawSlug);
  const path = slug.join("/");

  const content = await getSiteContent();
  const dict = content.dictionaries[locale];

  // A published blog post on this slug, if any. Read up front so the page
  // surfaces below can report a conflict, but rendered LAST: a service page or
  // a CMS page owns its URL (see the file header).
  const post = slug.length === 1 ? await getPost(slug[0]) : undefined;

  // Case study at the root slug.
  if (slug.length === 1) {
    const study = await getCase(slug[0]);
    if (study) {
      if (post) logSlugConflict(path, locale, `case study “${study.slug}”`, `blog post “${post.slug}”`);
      return <CaseDetailView study={study} locale={locale} dict={dict} />;
    }
  }

  // Service landing pages can be nested (e.g. /mediasuunnittelu/radio).
  // The rail switch rides in on the cached CMS bundle (see rail.ts), so this
  // stays an ISR page: a flip shows up at the next revalidation or publish.
  const rail = await railEnabled(railPreview);
  const servicePage = content.servicePages.find((p) => p.slug === path);
  if (servicePage) {
    if (post) logSlugConflict(path, locale, `service page “${servicePage.slug}”`, `blog post “${post.slug}”`);
    const t = servicePageLocalised(servicePage, locale);
    // The same CMS-managed SEO generateMetadata reads, so the structured data
    // and the <head> never disagree.
    const seo = await pageSeo(path, locale, {
      title: t.metaTitle,
      description: t.metaDescription,
      image: "/images/brand/services-planning.webp",
    });
    const url = absolute(seo.canonical || linkTo(locale, `/${path}`));
    // Home › Services › (parent service, when nested) › this page.
    const parent = slug.length > 1 ? content.servicePages.find((p) => p.slug === slug.slice(0, -1).join("/")) : undefined;
    const crumbs: Crumb[] = [
      homeCrumb(locale),
      { name: dict.nav.services, url: pageUrl(locale, "/services") },
      ...(parent ? [{ name: servicePageLocalised(parent, locale).title, url: pageUrl(locale, `/${parent.slug}`) }] : []),
      { name: t.title },
    ];
    return (
      <>
        <JsonLd data={serviceGraph({ url, locale, name: t.title, pageTitle: seo.title, description: seo.description, image: seo.image, crumbs })} />
        <ServiceLandingView page={servicePage} locale={locale} railEnabled={rail} />
      </>
    );
  }

  // A page composed in the CMS page editor.
  const page = await getCmsPage(path);
  if (page && post) logSlugConflict(path, locale, `CMS page “${page.slug}”`, `blog post “${post.slug}”`);
  // 'coded' pages are owned by a real route in this repo; if one reaches here
  // the route is missing, and a 404 is more honest than an empty shell.
  if (page && page.kind === "blocks" && page.blocks.length > 0) {
    const context = buildBlockContext(content, locale);
    const pageTitle = page.title[locale] || page.title.fi;
    const pageHref = pageUrl(locale, `/${path}`);

    return (
      <>
        {/* WebPage + breadcrumb, and a FAQPage when the editor placed an
            accordion (question / answer) block on the page. */}
        <JsonLd
          data={[
            ...pageGraph({
              url: pageHref,
              locale,
              name: page.seo[locale].title || pageTitle,
              description: page.seo[locale].description || undefined,
              image: page.ogImage || undefined,
              crumbs: [homeCrumb(locale), { name: pageTitle }],
            }),
            faqPage(pageHref, faqItemsFromBlocks(page.blocks, locale)),
          ]}
        />
        <BlockRenderer blocks={page.blocks} context={context} />
      </>
    );
  }

  // Insight post at the root slug — reached only when no page surface claimed
  // the URL, which is what keeps a post from replacing a service page.
  if (post) return <InsightArticleView post={post} locale={locale} dict={dict} />;

  notFound();
}
