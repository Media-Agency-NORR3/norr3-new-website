import type { MetadataRoute } from "next";
import { getSiteContent } from "@/lib/cms";
import { linkTo, pagePair } from "@/lib/links";
import { helsinkiIso } from "@/lib/dates";
import { getSocialSitemap } from "@/lib/social";

const BASE = "https://norr3.fi";
const LOCALES = ["fi", "en"] as const;

/** Routes this repo renders with its own React components. */
const CODED_ROUTES = [
  "",
  "services",
  "engine",
  "caset",
  "meista",
  "toihin-meille",
  "tiimi",
  "feed",
  "merch",
  "insights",
  "contact",
  "brief",
  "tietosuojaseloste",
  "kayttoehdot",
];

/**
 * Route → CMS page slug. A few core routes are named differently in the CMS
 * (which uses canonical English slugs) than in the public Finnish URLs.
 */
const PAGE_SLUG: Record<string, string> = {
  "": "home",
  caset: "cases",
  meista: "about",
  "toihin-meille": "careers",
  tiimi: "team",
  tietosuojaseloste: "privacy",
  kayttoehdot: "terms",
};

const cmsPageSlug = (route: string) => PAGE_SLUG[route] ?? route;

/** Undefined status = page not managed in the CMS → keep it (fail open). */
const pageIsLive = (content: { pageStatus: Record<string, string> }, route: string) => {
  const status = content.pageStatus[cmsPageSlug(route)];
  return status === undefined || status === "published";
};

/**
 * The sitemap is derived from the CMS rather than hand-listed.
 *
 * Every entry carries BOTH addresses — the Finnish slug at the root and the
 * English address under `/en` (see `src/lib/slugEn.ts`; a CMS `slug_en` wins
 * when set) — plus the `alternates.languages` block that ties them together as
 * one page in two languages, which is the hreflang Google reads from a
 * sitemap.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [content, social] = await Promise.all([getSiteContent(), getSocialSitemap()]);

  // `lastModified` is only emitted when a real date is known (a post's publish
  // date, a CMS page's update time). Stamping every build with "now" teaches
  // crawlers to ignore the field entirely.
  const entry = (
    path: string,
    options: {
      lastModified?: Date;
      changeFrequency?: "daily" | "weekly" | "monthly";
      priority?: number;
      /** CMS-managed English slug override for this row. */
      slugEn?: string | null;
    } = {}
  ) => {
    // Home is served at the bare origin — the sitemap `<loc>` must match the
    // canonical the page emits (which has no trailing slash), or Google reads
    // the two as different URLs.
    const bare = (u: string) => (u === "/" ? BASE : `${BASE}${u}`);
    const pair = pagePair(path || "", options.slugEn);
    const languages = {
      "fi-FI": bare(pair.fi),
      en: bare(pair.en),
      // Finnish is the default for anyone we have no better match for.
      "x-default": bare(pair.fi),
    };
    return LOCALES.map((locale) => ({
      url: locale === "fi" ? bare(pair.fi) : bare(pair.en),
      ...(options.lastModified ? { lastModified: options.lastModified } : {}),
      changeFrequency: options.changeFrequency ?? ("monthly" as const),
      priority: options.priority ?? 0.8,
      alternates: { languages },
    }));
  };

  return [
    ...CODED_ROUTES.filter((route) => {
      if (!pageIsLive(content, route)) return false;
      const robots = content.pageSeo[cmsPageSlug(route)]?.robots ?? "index, follow";
      return !robots.includes("noindex");
    }).flatMap((route) =>
      entry(route, {
        changeFrequency: route === "" ? "weekly" : route === "feed" ? "daily" : "monthly",
        priority: route === "" ? 1 : 0.8,
      })
    ),
    ...content.cases.flatMap((study) => entry(study.slug, { priority: 0.6 })),
    ...content.posts.flatMap((post) =>
      entry(post.slug, {
        priority: 0.5,
        slugEn: post.slugEn,
        // <lastmod> = the newest human-written revision (autosaves excluded),
        // falling back to the publish date. Same stamp the article's
        // dateModified carries.
        lastModified: validDate(helsinkiIso(post.updatedAt) ?? post.isoDate),
      })
    ),
    // Team Social: every member profile and every post has its own URL. Until
    // the social API answers, profiles come from the team roster (those pages
    // render from it too) and there are no posts to list.
    ...(social.members.length > 0
      ? social.members.map((m) => ({ slug: m.slug, updatedAt: m.updatedAt }))
      : content.team.map((m) => ({ slug: m.id, updatedAt: "" }))
    ).flatMap((m) => entry(`tiimi/${m.slug}`, { priority: 0.5, lastModified: validDate(m.updatedAt) })),
    // A social post is written in one language and its page canonicalises to
    // that locale's URL alone, so the sitemap lists that single URL (with the
    // page's own hreflang) instead of a FI/EN pair.
    ...social.posts.map((p) => {
      const url = `${BASE}${linkTo(p.lang, `/feed/${p.slug}`)}`;
      const languages = { [p.lang === "fi" ? "fi-FI" : "en"]: url, "x-default": url };
      return {
        url,
        ...(validDate(p.updatedAt) ? { lastModified: validDate(p.updatedAt) } : {}),
        changeFrequency: "monthly" as const,
        priority: 0.4,
        alternates: { languages },
      };
    }),
    // Service landing pages — the keyword-optimised sub-pages under /palvelut.
    ...content.servicePages
      .filter((page) => pageIsLive(content, page.slug))
      .flatMap((page) => entry(page.slug, { priority: 0.7, slugEn: page.slugEn })),
    // Pages composed in the CMS page editor. `status` is "published" for
    // public pages; anything else (drafts, retired pages like the old
    // media-insights landing) stays out of the sitemap.
    ...content.pages
      .filter((page) => page.slug !== "media-insights")
      .flatMap((page) =>
        entry(page.slug, {
          priority: 0.6,
          slugEn: page.slugEn,
          lastModified: page.updatedAt ? new Date(page.updatedAt.replace(" ", "T")) : undefined,
        })
      ),
  ];
}

function validDate(value: string): Date | undefined {
  if (!value) return undefined;
  const date = new Date(value.includes("T") ? value : value.replace(" ", "T"));
  return Number.isNaN(date.getTime()) ? undefined : date;
}
