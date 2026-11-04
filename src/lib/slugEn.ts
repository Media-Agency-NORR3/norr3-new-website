/**
 * English addresses for the Finnish URLs.
 *
 * Finnish lives at the domain root (`/hakukonemainonta`) and English under
 * `/en`. Until Oct 2026 the English page simply reused the Finnish slug with an
 * `/en` prefix (`/en/hakukonemainonta`) — a readable English address was not
 * possible, because the CMS had a single slug field shared by both locales.
 *
 * This module is the FI → EN path table for the surfaces whose address should
 * read English in the English version: the hand-built routes, the service
 * landing pages and the insight posts. A case study keeps its own slug in both
 * locales (its slug is the client's name, not Finnish copy), so it needs no
 * entry.
 *
 * The CMS carries the same value per row (`slug_en` on `pages`, `service_pages`
 * and `posts`) and its value WINS when set — this table is the fallback the
 * site uses when the CMS is unreachable, and the value the CMS was backfilled
 * from. Editing a slug in the CMS therefore also needs the matching `redirects`
 * row for the old English URL; the middleware 301s the legacy `/en/<fi-slug>`
 * form from this table.
 */

/** Coded routes: the route folder is Finnish, the English URL is not. */
export const ROUTE_EN_SLUG: Record<string, string> = {
  caset: "cases",
  meista: "about",
  "toihin-meille": "careers",
  tiimi: "team",
  tietosuojaseloste: "privacy-policy",
  kayttoehdot: "terms",
};

/** Service landing pages (`service_pages.slug` → English address). */
export const SERVICE_EN_SLUG: Record<string, string> = {
  "insight-strategia": "insight-strategy",
  "data-ja-mittaus": "data-and-measurement",
  "data-ja-mittaus/dashboardit": "data-and-measurement/dashboards",
  "data-ja-mittaus/datan-mallintaminen": "data-and-measurement/data-modelling",
  markkinointistrategia: "marketing-strategy",
  hakukoneoptimointi: "search-engine-optimisation",
  "ohjelmallinen-ostaminen": "programmatic-buying",
  mediasuunnittelu: "media-planning",
  ulkomainonta: "out-of-home-advertising",
  "performance-markkinointi": "performance-marketing",
  "mediasuunnittelu/norr3-media-insights": "media-planning/norr3-media-insights",
  "mediasuunnittelu/radio": "media-planning/radio-advertising",
  "mediasuunnittelu/televisio": "media-planning/tv-advertising",
  "mediasuunnittelu/elokuvamainonta-eli-cinema": "media-planning/cinema-advertising",
  "mediasuunnittelu/printti-eli-lehtimainonta": "media-planning/print-advertising",
  "mediasuunnittelu/luovat": "media-planning/assets-and-production",
  "mediasuunnittelu/kampanjat-ja-jatkuva-mainonta": "media-planning/campaigns-and-always-on",
  mediastrategia: "media-strategy",
  "dynaaminen-mainonta": "dynamic-advertising",
  hakukonemainonta: "search-engine-advertising",
  "display-ja-videomainonta": "display-and-video-advertising",
  somemarkkinointi: "social-media-advertising",
  tutkimukset: "research",
  "ai-optimointi": "ai-optimisation",
  tekoalymainonta: "ai-advertising",
  "markkinointi-terveydenhuolto": "healthcare-marketing",
  "markkinointi-kiinteistonvalitys": "real-estate-marketing",
  "markkinointi-vahittaiskauppa": "retail-marketing",
  "markkinointi-autoliikkeet": "automotive-marketing",
  "markkinointi-franchising": "franchise-marketing",
  "marketing-engine-alusta": "marketing-engine",
};

/** Insight posts (`posts.slug` → English address). */
export const POST_EN_SLUG: Record<string, string> = {
  "tekoalyn-kaytto-suomessa-2026": "ai-use-in-finland-2026",
  "tamk-kylassa": "tamk-visit",
  "mediasuunnitelma-mita-siina-pitaa-olla-ja-miten-se-tehdaan": "how-to-build-a-media-plan",
  "tv-vai-video-katselu-suomessa-2026": "tv-or-video-2026",
  "chatgpt-mainonta-suomessa": "chatgpt-ads-in-finland",
  "media-insights-mediatutkimus-ja-mediankaytto-suomessa": "finnish-media-use-2026",
  "norr3-ja-kiinteistomaailma-yhteistyossa-marketing-engine-mullistaa-paikallismarkkinoinnin":
    "norr3-and-kiinteistomaailma-local-marketing",
  "tre-kronor-media": "tre-kronor-media-finland",
  "voittava-mediamix-2024": "winning-media-mix-2024",
  "isojen-ruutujen-trendit": "big-screen-trends",
  "radiomainonnan-hinta-ja-kuuntelijamaarat-2026": "radio-advertising-costs-and-listeners-2026",
  "somekanavien-kayttajat-suomessa-2026": "social-media-users-in-finland-2026",
  "kampanjasuunnitelma-nain-teet-sen": "how-to-make-a-campaign-plan",
};

/** Every known FI → EN path (exact slugs). */
const ALL: Record<string, string> = { ...ROUTE_EN_SLUG, ...SERVICE_EN_SLUG, ...POST_EN_SLUG };

/**
 * Nested coded routes whose first segment is translated for children too:
 * a team profile is `/tiimi/<member>` in Finnish and `/team/<member>` in
 * English. A slug below an unknown parent passes through unchanged.
 */
const PREFIX_EN: Record<string, string> = { tiimi: "team", caset: "cases" };

const PREFIX_FI: Record<string, string> = Object.fromEntries(
  Object.entries(PREFIX_EN).map(([fi, en]) => [en, fi])
);

const FI_FROM_EN: Record<string, string> = Object.fromEntries(
  Object.entries(ALL).map(([fi, en]) => [en, fi])
);

/**
 * The English path for a Finnish slug, honouring a CMS override when given.
 * A CMS value that only repeats the Finnish slug is not an override: the CMS
 * copies `slug` into `slug_en` when a post is created, and the post editor
 * cannot change `slug_en` yet, so such a row falls through to this table.
 */
export function enSlugFor(fiSlug: string, cmsSlugEn?: string | null): string {
  const override = (cmsSlugEn ?? "").trim().replace(/^\/+|\/+$/g, "");
  if (override && override !== fiSlug.replace(/^\/+|\/+$/g, "")) return override;
  return eagerEn(fiSlug);
}

/** Map a Finnish slug (no leading slash) to its English form. */
function eagerEn(fiSlug: string): string {
  const slug = fiSlug.replace(/^\/+|\/+$/g, "");
  if (!slug) return "";
  if (ALL[slug]) return ALL[slug];
  const slash = slug.indexOf("/");
  if (slash > 0) {
    const head = slug.slice(0, slash);
    const rest = slug.slice(slash);
    if (PREFIX_EN[head]) return `/${PREFIX_EN[head]}${rest}`.replace(/^\//, "");
  }
  return slug;
}

/** The Finnish slug for an English path (reverse of `enSlugFor`). */
export function fiSlugFor(enSlug: string): string {
  const slug = enSlug.replace(/^\/+|\/+$/g, "");
  if (!slug) return "";
  if (FI_FROM_EN[slug]) return FI_FROM_EN[slug];
  const slash = slug.indexOf("/");
  if (slash > 0) {
    const head = slug.slice(0, slash);
    const rest = slug.slice(slash);
    if (PREFIX_FI[head]) return `/${PREFIX_FI[head]}${rest}`.replace(/^\//, "");
  }
  return slug;
}

/**
 * Translate a locale-relative path (no `/en` prefix) into its English form,
 * preserving any `?query` / `#fragment` suffix. An unknown path is returned
 * unchanged, so this is safe to run over every link on the site.
 */
export function enPath(fiPath: string): string {
  const clean = fiPath.startsWith("/") ? fiPath : `/${fiPath}`;
  const [pathPart, ...rest] = clean.split(/(?=[?#])/);
  const slug = pathPart.replace(/^\/+|\/+$/g, "");
  const tail = rest.join("");
  if (!slug) return `/${tail}`;
  return `/${eagerEn(slug)}${tail}`;
}

/** True when the path is a legacy Finnish slug that now has an English form. */
export function hasEnVersion(fiPath: string): boolean {
  const slug = fiPath.replace(/^\/+|\/+$/g, "");
  if (ALL[slug]) return true;
  const slash = slug.indexOf("/");
  return slash > 0 && Boolean(PREFIX_EN[slug.slice(0, slash)]);
}
