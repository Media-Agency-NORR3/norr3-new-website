import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * The dev server is reached over the VPS's public IP, not localhost. Next
   * blocks cross-origin requests to dev-only assets by default, which silently
   * 403s the JS chunks — the page still renders server-side but never hydrates,
   * so every scroll-reveal stays at opacity 0 and the site looks blank.
   * Production (`next start`) is unaffected; this only widens development.
   */
  allowedDevOrigins: ["127.0.0.1", "localhost", "194.31.55.65", "norr3.fi", "*.norr3.fi"],

  /**
   * ISR pages answer `Cache-Control: s-maxage=<revalidate>, stale-while-
   * revalidate=<expireTime - revalidate>`. The content routes revalidate every
   * 300 s (`src/app/[locale]/layout.tsx`), and without this the SWR window
   * defaults to a year — a CDN could keep handing out a stale page for that
   * long while it re-fetched. One hour bounds it: Cloudflare (or any cache in
   * front) gets `s-maxage=300, stale-while-revalidate=3300`.
   */
  expireTime: 3600,

  /**
   * Permanent redirects — one canonical URL per piece of content.
   *
   * `statusCode: 301` rather than `permanent: true`: the latter answers 308,
   * and the launch checklist (and some older crawlers and link checkers)
   * expect a classic 301 for moved WordPress URLs. Each rule points straight
   * at the final URL — no rule may land on another redirect.
   *
   * Case studies and insight posts live at the domain root (`/st1`,
   * `/isojen-ruutujen-trendit`), which is the same shape the old WordPress
   * site used. That means most old URLs resolve directly with no redirect at
   * all; only the ones whose slug changed, the section-prefixed variants, and
   * the collapsed service hierarchy need an entry here.
   */
  /**
   * Trailing slashes are stripped in `src/proxy.ts` (301) instead of by Next's
   * built-in `/:path+/` → `/:path+` rule. That built-in rule runs *before* the
   * custom redirects below and answers 308, so every old WordPress URL with a
   * trailing slash (`/flow-festivaali/`) used to take two hops: 308 to the
   * slash-less path, then the 301 below. With it disabled, the custom rules
   * match both forms directly (their patterns end in `(?:/)?$`) and any other
   * slashed URL gets one 301 from the proxy.
   */
  skipTrailingSlashRedirect: true,

  async redirects() {
    return [
      // ── Section-prefixed detail URLs → the root slug ────────────────────────
      { source: "/cases/:slug", destination: "/:slug", statusCode: 301 },
      { source: "/insights/:slug", destination: "/:slug", statusCode: 301 },
      { source: "/en/cases/:slug", destination: "/en/:slug", statusCode: 301 },
      { source: "/en/insights/:slug", destination: "/en/:slug", statusCode: 301 },

      // ── Geir's URL structure: old /palvelut/* tree → new root slugs ──────
      { source: "/palvelut/insight-strategia", destination: "/insight-strategia", statusCode: 301 },
      { source: "/palvelut/data", destination: "/data-ja-mittaus", statusCode: 301 },
      { source: "/palvelut/data/mediapanostusdata", destination: "/markkinointistrategia", statusCode: 301 },
      { source: "/palvelut/data/norr3-media-insights", destination: "/mediasuunnittelu/norr3-media-insights", statusCode: 301 },
      { source: "/palvelut/mediat", destination: "/mediastrategia", statusCode: 301 },
      { source: "/palvelut/mediat/dynaaminen-mainonta", destination: "/dynaaminen-mainonta", statusCode: 301 },
      { source: "/palvelut/mediat/mediat-ja-mediamixit", destination: "/mediasuunnittelu", statusCode: 301 },
      { source: "/palvelut/mediat/mediat-ja-mediamixit/sem", destination: "/hakukonemainonta", statusCode: 301 },
      { source: "/palvelut/mediat/mediat-ja-mediamixit/online-video", destination: "/display-ja-videomainonta", statusCode: 301 },
      { source: "/palvelut/mediat/mediat-ja-mediamixit/radio", destination: "/mediasuunnittelu/radio", statusCode: 301 },
      { source: "/palvelut/mediat/mediat-ja-mediamixit/televisio", destination: "/mediasuunnittelu/televisio", statusCode: 301 },
      { source: "/palvelut/mediat/mediat-ja-mediamixit/elokuvamainonta-eli-cinema", destination: "/mediasuunnittelu/elokuvamainonta-eli-cinema", statusCode: 301 },
      { source: "/palvelut/mediat/mediat-ja-mediamixit/printti-eli-lehtimainonta", destination: "/mediasuunnittelu/printti-eli-lehtimainonta", statusCode: 301 },
      { source: "/palvelut/mediat/mediat-ja-mediamixit/ulkomainonta", destination: "/ulkomainonta", statusCode: 301 },
      { source: "/palvelut/mediat/mediat-ja-mediamixit/sosiaalinen-media", destination: "/somemarkkinointi", statusCode: 301 },
      { source: "/palvelut/mediat/mediat-ja-mediamixit/display", destination: "/display-ja-videomainonta", statusCode: 301 },
      { source: "/palvelut/mediat/kampanjat-ja-jatkuva-mainonta", destination: "/mediasuunnittelu/kampanjat-ja-jatkuva-mainonta", statusCode: 301 },
      { source: "/palvelut/mittaaminen", destination: "/data-ja-mittaus", statusCode: 301 },
      { source: "/palvelut/mittaaminen/norr3-brand-performance", destination: "/tutkimukset", statusCode: 301 },
      { source: "/palvelut/mittaaminen/norr3-campaign-performance", destination: "/tutkimukset", statusCode: 301 },
      { source: "/palvelut/mittaaminen/norr3-pre-campaign-performance", destination: "/tutkimukset", statusCode: 301 },
      { source: "/palvelut/mittaaminen/norr3-express-pre-campaign-performance", destination: "/tutkimukset", statusCode: 301 },
      { source: "/palvelut/mittaaminen/dashboardit", destination: "/data-ja-mittaus/dashboardit", statusCode: 301 },
      { source: "/palvelut/mittaaminen/romi-ja-roas-laskenta", destination: "/data-ja-mittaus/datan-mallintaminen", statusCode: 301 },
      { source: "/palvelut/performance-markkinointi", destination: "/performance-markkinointi", statusCode: 301 },
      { source: "/palvelut/luovat", destination: "/mediasuunnittelu/luovat", statusCode: 301 },
      { source: "/palvelut", destination: "/services", statusCode: 301 },
      { source: "/en/palvelut/:path*", destination: "/en/services", statusCode: 301 },

      // ── Route renames: English → Finnish URLs ─────────────────────────────
      { source: "/about", destination: "/meista", statusCode: 301 },
      { source: "/privacy", destination: "/tietosuojaseloste", statusCode: 301 },
      { source: "/terms", destination: "/kayttoehdot", statusCode: 301 },
      { source: "/team", destination: "/tiimi", statusCode: 301 },
      { source: "/careers", destination: "/toihin-meille", statusCode: 301 },

      // ── Old service prefix → the root slug (services now live at /<slug>) ──
      { source: "/palvelut/:slug", destination: "/:slug", statusCode: 301 },
      { source: "/en/palvelut/:slug", destination: "/en/:slug", statusCode: 301 },

      // ── Old Finnish pages ───────────────────────────────────────────────────
      { source: "/cases", destination: "/caset", statusCode: 301 },
      { source: "/tarinat", destination: "/insights", statusCode: 301 },
      { source: "/norr3-marketing-engine", destination: "/engine", statusCode: 301 },
      { source: "/privacy-policy", destination: "/tietosuojaseloste", statusCode: 301 },
      { source: "/sample-page", destination: "/", statusCode: 301 },
      { source: "/yhteystiedot", destination: "/contact", statusCode: 301 },
      { source: "/ota-yhteytta", destination: "/contact", statusCode: 301 },
      { source: "/rekry", destination: "/toihin-meille", statusCode: 301 },
      { source: "/partners", destination: "/meista", statusCode: 301 },
      // The WordPress blog. Team and partner author archives → the team page;
      // everything else that lived under /blog → the insights index.
      { source: "/blog/employee/:path*", destination: "/tiimi", statusCode: 301 },
      { source: "/blog/partner/:path*", destination: "/tiimi", statusCode: 301 },
      { source: "/blog/:path*", destination: "/insights", statusCode: 301 },
      { source: "/blogi/:path*", destination: "/insights", statusCode: 301 },
      // WordPress media library. The old logo URL is still referenced from
      // outside (and by the Organization JSON-LD on the home page), so it
      // lands on the current logo file; every other upload → the home page.
      { source: "/wp-content/uploads/2025/02/Logo-01.png", destination: "/logo-wordmark.svg", statusCode: 301 },
      { source: "/wp-content/uploads/:path*", destination: "/", statusCode: 301 },
      { source: "/services/content/content-creation-services", destination: "/services", statusCode: 301 },

      // ── Old English pages ───────────────────────────────────────────────────
      { source: "/en/home", destination: "/en", statusCode: 301 },
      { source: "/en/norr3", destination: "/en", statusCode: 301 },
      // The old Media Insights landing page → its service landing page.
      { source: "/media-insights", destination: "/mediasuunnittelu/norr3-media-insights", statusCode: 301 },
      { source: "/en/media-insights", destination: "/en/mediasuunnittelu/norr3-media-insights", statusCode: 301 },
      { source: "/about-us", destination: "/en/meista", statusCode: 301 },
      { source: "/en/contact-us", destination: "/en/contact", statusCode: 301 },

      // ── Slugs that changed between the old site and this one ────────────────
      // (cases and posts whose slug matches resolve directly at the root.)
      { source: "/voittava-mediamixia-vuodelle-2024", destination: "/voittava-mediamix-2024", statusCode: 301 },
      { source: "/trekronormedia_norr3", destination: "/tre-kronor-media", statusCode: 301 },
      { source: "/nelja-pohjoismaata-yhdistavat-voimansa-uudessa-mediatoimistoverkostossa", destination: "/tre-kronor-media", statusCode: 301 },

      // ── Old case URLs whose case is not published in the CMS ────────────────
      // `website_cases` rows flow-festival, suun-terveystalo, st1 and esperi are
      // all `visible = 0` / draft, so their pages 404. Until they are
      // published, the old URLs land on the cases index. When one of them goes
      // live: delete its line here (and for /st1 and /esperi that is a must —
      // the rule would otherwise shadow the real page at the same path) and
      // point the renamed ones at the case (/terveystalo → /suun-terveystalo,
      // /flow-festivaali → /flow-festival).
      { source: "/terveystalo", destination: "/caset", statusCode: 301 },
      { source: "/flow-festivaali", destination: "/caset", statusCode: 301 },
      { source: "/st1", destination: "/caset", statusCode: 301 },
      { source: "/esperi", destination: "/caset", statusCode: 301 },

      // ── Old news / blog posts that are drafts in the CMS ────────────────────
      // `posts` rows norr3-vuoden-toimisto-2023 and ai-and-the-creative-future
      // are unpublished; the agency-of-the-year story belongs with the company
      // page, the AI essay with the rest of the insights. Repoint when published.
      { source: "/norr3-on-vuoden-toimisto-2023", destination: "/meista", statusCode: 301 },
      { source: "/ai-and-the-creative-future", destination: "/insights", statusCode: 301 },

      // Grandone's content is no longer reachable on the old site; the Marketing
      // Engine page it sold lives at /engine, everything else → the cases index.
      { source: "/grandone/norr3marketingengine", destination: "/engine", statusCode: 301 },
      { source: "/grandone", destination: "/caset", statusCode: 301 },
    ];
  },
};

export default nextConfig;
