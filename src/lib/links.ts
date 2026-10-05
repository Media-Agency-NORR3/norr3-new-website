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
  return linkTo(other, stripped || "/");
}
