import type { Locale } from "@/i18n/config";

/**
 * Public URL helpers.
 *
 * The site serves Finnish at the domain root (no `/fi` prefix) and English
 * under `/en`, so every route sits as close to the domain as possible while the
 * two locales still resolve to distinct URLs for hreflang. Internally the app
 * keeps routing through the existing `[locale]` segment (`fi`/`en`); middleware
 * rewrites root-level requests to `/fi` transparently.
 */

/** A locale-relative path (leading slash optional) as its public URL. */
export function linkTo(locale: Locale, path = ""): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (locale === "en") return clean === "/" ? "/en" : `/en${clean}`;
  return clean === "/" ? "/" : clean;
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

/** The same page in the other locale, given the current browser pathname. */
export function otherLocaleHref(pathname: string, current: Locale): string {
  const other: Locale = current === "fi" ? "en" : "fi";
  const stripped = pathname.replace(/^\/(?:en|fi)(?=\/|$)/, "");
  // The legal pages use different slugs per locale; map either form to the
  // other locale's slug so the language switch lands on the canonical URL,
  // not a Finnish-slug English URL (or vice-versa).
  const WITHOUT_PREFIX = stripped.replace(/^\/|\/$/g, "");
  const LEGAL_TO_PAGE: Record<string, "privacy" | "terms"> = {
    tietosuojaseloste: "privacy",
    "privacy-policy": "privacy",
    privacy: "privacy",
    kayttoehdot: "terms",
    terms: "terms",
  };
  const page = LEGAL_TO_PAGE[WITHOUT_PREFIX];
  if (page) return legalPath(other, page);
  return linkTo(other, stripped || "/");
}
