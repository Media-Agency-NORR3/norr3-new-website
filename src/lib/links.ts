import type { Locale } from "@/i18n/config";
import { enPath, enSlugFor, fiSlugFor } from "@/lib/slugEn";

/**
 * Public URL helpers.
 *
 * The site serves Finnish at the domain root (no `/fi` prefix) and English
 * under `/en`, so every route sits as close to the domain as possible while the
 * two locales still resolve to distinct URLs for hreflang. Internally the app
 * keeps routing through the existing `[locale]` segment (`fi`/`en`); middleware
 * rewrites root-level requests to `/fi` transparently.
 *
 * English addresses read English: `/hakukonemainonta` is
 * `/en/search-engine-advertising`, not `/en/hakukonemainonta` (see `slugEn.ts`).
 * `linkTo` applies that mapping itself, so every caller — nav, footer, cards,
 * metadata, canonical, hreflang — gets the right address without knowing the
 * table.
 */

/** A locale-relative path (leading slash optional) as its public URL. */
export function linkTo(locale: Locale, path = ""): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (locale === "en") {
    // Translate the Finnish slug into its English address, keeping `#fragment`
    // and `?query` suffixes (a `/engine#tuote` link stays an anchor).
    const english = enPath(clean);
    return english === "/" ? "/en" : `/en${english}`;
  }
  return clean === "/" ? "/" : clean;
}

/**
 * The FI and EN URLs of the same page, given its Finnish (canonical) slug and
 * an optional CMS-managed English slug override. Drives `canonical` and the
 * `hreflang` alternates so both locales point at each other's real address.
 */
export function pagePair(fiSlug: string, cmsSlugEn?: string | null): { fi: string; en: string } {
  const clean = fiSlug.replace(/^\/+|\/+$/g, "");
  const enSlug = clean ? enSlugFor(clean, cmsSlugEn) : "";
  return { fi: linkTo("fi", clean ? `/${clean}` : "/"), en: linkTo("en", enSlug ? `/${enSlug}` : "/") };
}

/** The `alternates.languages` block for a page, from its Finnish slug. */
export function languageAlternates(fiSlug: string, cmsSlugEn?: string | null) {
  const { fi, en } = pagePair(fiSlug, cmsSlugEn);
  return { "fi-FI": fi, en, "x-default": fi };
}

/**
 * The CMS names its core pages in English (`/cases`, `/about`, `/team`,
 * `/careers`, `/privacy`, `/terms`) while the public routes carry Finnish
 * names. The English forms only 301 to the Finnish ones, so anything that
 * turns a CMS href into a link must go through here — otherwise every nav
 * link lands on a redirect (the SEO crawl flagged exactly that).
 */
const PUBLIC_PATHS: Record<string, string> = {
  cases: "caset",
  about: "meista",
  team: "tiimi",
  careers: "toihin-meille",
  privacy: "tietosuojaseloste",
  terms: "kayttoehdot",
};

/**
 * The legal pages use distinct slugs per locale (hard-coded, 2026-10-12):
 * Finnish keeps the descriptive names (`/tietosuojaseloste`, `/kayttoehdot`)
 * while English uses the conventional English slugs (`/privacy-policy`,
 * `/terms`). Add both to the mapping the proxy already aliases, so links,
 * canonicals and hreflang all agree with the resolved routes.
 */
const LEGAL_PATHS: Record<Locale, { privacy: string; terms: string }> = {
  fi: { privacy: "/tietosuojaseloste", terms: "/kayttoehdot" },
  en: { privacy: "/privacy-policy", terms: "/terms" },
};

export { LEGAL_PATHS };

/** The public URL for a legal page, locale-aware (English uses English slugs). */
export function legalPath(locale: Locale, page: "privacy" | "terms"): string {
  return linkTo(locale, LEGAL_PATHS[locale][page]);
}

/** A CMS-style href as the canonical public path (locale-relative, leading slash). */
export function publicPath(href: string): string {
  const clean = href.startsWith("/") ? href : `/${href}`;
  const [pathPart, ...rest] = clean.split(/(?=[?#])/);
  const segments = pathPart.split("/");
  // segments[0] is "" (leading slash); the page slug is the first real segment.
  if (segments[1] && PUBLIC_PATHS[segments[1]]) segments[1] = PUBLIC_PATHS[segments[1]];
  return segments.join("/") + rest.join("");
}

/**
 * The same page in the other locale, given the current browser pathname.
 *
 * The two locales use different slugs (Finnish `/hakukonemainonta`, English
 * `/en/search-engine-advertising`), so the switch maps the path through
 * `slugEn.ts` rather than just swapping the prefix — the Finnish page links to
 * the English page's real address, and vice-versa.
 */
export function otherLocaleHref(pathname: string, current: Locale): string {
  const other: Locale = current === "fi" ? "en" : "fi";
  const stripped = pathname.replace(/^\/(?:en|fi)(?=\/|$)/, "");
  const slug = stripped.replace(/^\/+|\/+$/g, "");
  if (!slug) return linkTo(other, "/");
  if (other === "en") return linkTo("en", `/${slug}`);
  return linkTo("fi", `/${fiSlugFor(slug)}`);
}
