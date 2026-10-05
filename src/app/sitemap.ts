import type { MetadataRoute } from "next";
import { getSiteContent } from "@/lib/cms";
import { linkTo } from "@/lib/links";
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
 * The slug lists here used to be maintained by hand and had already drifted —
 * three of the four article URLs pointed at posts that no longer existed, and
 * newly published ones were missing. Reading the live content means publishing a
 * case, a post or a block page puts it in the sitemap with no second edit.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [content, social] = await Promise.all([getSiteContent(), getSocialSitemap()]);

  // `lastModified` is only emitted when a real date is known (a post's publish
  // date, a CMS page's update time). Stamping every build with "now" teaches
  // crawlers to ignore the field entirely.
  const entry = (
    path: string,
    options: { lastModified?: Date; changeFrequency?: "daily" | "weekly" | "monthly"; priority?: number } = {}
  ) =>
    LOCALES.map((locale) => ({
      url: `${BASE}${linkTo(locale, path || "")}`,
      ...(options.lastModified ? { lastModified: options.lastModified } : {}),
      changeFrequency: options.changeFrequency ?? ("monthly" as const),
      priority: options.priority ?? 0.8,
      alternates: {
        languages: {
          "fi-FI": `${BASE}${linkTo("fi", path || "")}`,
          en: `${BASE}${linkTo("en", path || "")}`,
          // Finnish is the default for anyone we have no better match for.
          "x-default": `${BASE}${linkTo("fi", path || "")}`,
        },
      },
    }));

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
        lastModified: post.isoDate ? new Date(post.isoDate) : undefined,
      })
    ),
    // Team Social: every member profile and every post has its own URL. Until
    // the social API answers, profiles come from the team roster (those pages
    // render from it too) and there are no posts to list.
    ...(social.members.length > 0
      ? social.members.map((m) => ({ slug: m.slug, updatedAt: m.updatedAt }))
      : content.team.map((m) => ({ slug: m.id, updatedAt: "" }))
    ).flatMap((m) => entry(`tiimi/${m.slug}`, { priority: 0.5, lastModified: validDate(m.updatedAt) })),
    ...social.posts.flatMap((p) => entry(`feed/${p.slug}`, { priority: 0.4, lastModified: validDate(p.updatedAt) })),
    // Service landing pages — the keyword-optimised sub-pages under /palvelut.
    ...content.servicePages
      .filter((page) => pageIsLive(content, page.slug))
      .flatMap((page) => entry(page.slug, { priority: 0.7 })),
    // Pages composed in the CMS page editor. `status` is "published" for
    // public pages; anything else (drafts, retired pages like the old
    // media-insights landing) stays out of the sitemap.
    ...content.pages
      .filter((page) => page.slug !== "media-insights")
      .flatMap((page) =>
        entry(page.slug, {
          priority: 0.6,
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
