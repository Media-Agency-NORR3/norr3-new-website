import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getCase, getCmsPage, getPost, getSiteContent } from "@/lib/cms";
import { buildBlockContext } from "@/components/blocks/context";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { CaseDetailView } from "@/components/views/CaseDetailView";
import { InsightArticleView } from "@/components/views/InsightArticleView";
import { ServiceLandingView } from "@/components/views/ServiceLandingView";
import { servicePageLocalised } from "@/content/servicePages";
import { linkTo } from "@/lib/links";
import { ogImage } from "@/lib/ogImage";
import { pageSeo } from "@/lib/pageSeo";
import { railEnabled, splitRailPreview } from "@/lib/rail";
import { JsonLd } from "@/components/JsonLd";
import { absolute, faqItemsFromBlocks, faqPage, homeCrumb, pageGraph, pageUrl, serviceGraph, type Crumb } from "@/lib/jsonld";

/**
 * Serves everything that lives at a short, root-level slug:
 *
 *  1. hand-built routes (/services, /cases, /insights …) — Next matches static
 *     segments before a catch-all, so those always win;
 *  2. case studies — `/kiinteistomaailma`, `/st1` — the same URLs the old
 *     WordPress site used, so their accumulated SEO carries over unchanged;
 *  3. insight posts — `/isojen-ruutujen-trendit`;
 *  4. service landing pages — `/hakukoneoptimointi`, `/mediasuunnittelu` …;
 *  5. pages composed in the CMS page editor — any slug an editor publishes.
 *
 * The section URLs (`/cases/st1`, `/insights/…`) 301 to these root slugs, so
 * there is exactly one canonical URL per piece of content.
 */
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

export async function generateMetadata({ params }: Params) {
  const { locale, slug: rawSlug } = await params;
  if (!isLocale(locale)) return {};
  // The staging rail preview renders the real page's metadata (canonical
  // included) — the `__rail` segment is an internal detail, never a URL.
  const { slug } = splitRailPreview(rawSlug);
  const path = slug.join("/");

  // Case study at the root slug.
  const study = slug.length === 1 ? await getCase(slug[0]) : undefined;
  if (study) {
    const title = locale === "fi" ? `${study.client} — NØRR3-case` : `${study.client} — NØRR3 case`;
    const description = study.tagline[locale];
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

  // Insight post at the root slug.
  const post = slug.length === 1 ? await getPost(slug[0]) : undefined;
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

  // Service landing page at the root slug.
  const servicePage = (await getSiteContent()).servicePages.find((p) => p.slug === slug.join("/"));
  if (servicePage) {
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
  if (!page) return {};

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

  // Case study at the root slug.
  if (slug.length === 1) {
    const study = await getCase(slug[0]);
    if (study) {
      const dict = (await getSiteContent()).dictionaries[locale];
      return <CaseDetailView study={study} locale={locale} dict={dict} />;
    }

    const post = await getPost(slug[0]);
    if (post) {
      const dict = (await getSiteContent()).dictionaries[locale];
      return <InsightArticleView post={post} locale={locale} dict={dict} />;
    }

  }

  // Service landing pages can be nested (e.g. /mediasuunnittelu/radio).
  // The rail switch rides in on the cached CMS bundle (see rail.ts), so this
  // stays an ISR page: a flip shows up at the next revalidation or publish.
  const rail = await railEnabled(railPreview);
  const content = await getSiteContent();
  const dict = content.dictionaries[locale];
  const path = slug.join("/");
  const servicePage = content.servicePages.find((p) => p.slug === path);
  if (servicePage) {
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
  // 'coded' pages are owned by a real route in this repo; if one reaches here
  // the route is missing, and a 404 is more honest than an empty shell.
  if (!page || page.kind !== "blocks" || page.blocks.length === 0) notFound();

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
