import { notFound } from "next/navigation";
import { MotionConfig } from "framer-motion";
import { Host_Grotesk } from "next/font/google";
import "../material-symbols.css";
import "../globals.css";
import { ThemeStyle } from "@/components/ThemeStyle";
import { CustomBodyEnd, CustomHead } from "@/components/CustomCode";
import { locales, isLocale } from "@/i18n/config";
import { getDictionary } from "@/lib/dictionary";
import { getSiteContent } from "@/lib/cms";
import { pageSeo, robotsDirective } from "@/lib/pageSeo";
import { linkTo } from "@/lib/links";
import { ogImage } from "@/lib/ogImage";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import type { NavDict, NavServicePage } from "@/components/Nav";
import type { FooterDict } from "@/components/Footer";
import { SmoothScroll } from "@/components/SmoothScroll";
import { RouteWipe } from "@/components/RouteWipe";
import { CookieConsent } from "@/components/CookieConsent";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { InsightsTicker } from "@/components/InsightsTicker";
import { Analytics } from "@/components/Analytics";
import { MotionSettingsProvider } from "@/components/MotionSettingsProvider";
import VisualEditor from "@/components/visual/VisualEditor";

const hostGrotesk = Host_Grotesk({
  variable: "--font-host-grotesk",
  subsets: ["latin", "latin-ext"],
});

/**
 * ISR for every content page under this layout.
 *
 * Nothing in the shared chrome reads a Request-time API any more (`headers()`
 * used to be called here for the non-production noindex, which made *every*
 * route dynamic: `Cache-Control: private, no-store`, a full React render per
 * request, Cloudflare "DYNAMIC"). The CMS bundle fetch in `src/lib/cms.ts`
 * already revalidates on the same window and carries the `cms:*` tags, so the
 * HTML is served from the ISR cache with `s-maxage=3600, stale-while-revalidate`
 * and the publish hook (`/api/revalidate` → `revalidateTag`) expires it
 * on demand — the window is only a safety net.
 *
 * The window is an hour, not five minutes (Oct 2026): a page whose cache entry
 * had expired was re-rendered from the CMS on the request that hit it, and those
 * cold renders measured 3–8.5 s (e.g. /insight-strategia at 8.5 s). Publishing
 * clears the cache explicitly, so a shorter window bought nothing but slow
 * first-hits.
 *
 * Routes that must stay dynamic opt out themselves: `/cms-preview`
 * (`force-dynamic`), `/case-preview` (cookies), `/feed` (searchParams).
 */
export const revalidate = 3600;

/**
 * Runs before first paint so the stored theme is on <html> ahead of hydration —
 * without it the page paints light, then snaps to dark (FOUC). Kept
 * dependency-free and tiny on purpose; it ships inside every document.
 */
const THEME_SCRIPT = `try{var t=localStorage.getItem("norr3-theme");var d=t?t==="dark":matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",d)}catch(e){}`;

/**
 * The locale segment IS the root layout: every page request routes through it
 * (the proxy rewrites root-level paths to `/fi/…`), and nothing outside it
 * renders a document — the rest are route handlers and metadata files. That
 * keeps `<html lang>` correct per locale in the SSR output crawlers see, which
 * the old root-layout setup could not do (it had no access to the locale).
 */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  // The home route's SEO, owned by the CMS Pages screen.
  const seo = await pageSeo("home", locale, {
    title: dict.meta.title,
    description: dict.meta.description,
    image: "/images/brand/og-image.jpg",
  });
  const homeUrl = `https://norr3.fi${linkTo(locale)}`;
  // Non-production hosts (staging, raw IP) are noindexed by the proxy, which
  // sets `X-Robots-Tag: noindex, nofollow` per request (src/proxy.ts). That
  // used to be a `headers()` read here — but a Request-time API in the root
  // layout's metadata makes every route dynamic and uncacheable, and the
  // cached HTML must not bake one host's answer in anyway.
  return {
    metadataBase: new URL("https://norr3.fi"),
    applicationName: "NØRR3",
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
      ],
      apple: [{ url: "/icon-180.png", sizes: "180x180", type: "image/png" }],
    },
    manifest: "/manifest.webmanifest",
    robots: robotsDirective(seo.robots),
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: seo.canonical || linkTo(locale),
      languages: { "fi-FI": "/", en: "/en", "x-default": "/" },
    },
    openGraph: {
      // Metadata is merged shallowly, so this object replaces the root
      // layout's openGraph — type/siteName/images must be repeated here.
      type: "website" as const,
      siteName: "NØRR3",
      url: homeUrl,
      locale: locale === "fi" ? "fi_FI" : "en_US",
      title: seo.title,
      description: seo.description,
      images: [
        {
          url: ogImage(seo.image),
          width: 1200,
          height: 630,
          alt: "The NØRR3 team in the Helsinki studio",
        },
      ],
    },
    twitter: {
      // Shallow-merged like openGraph — repeat the card + image and localize
      // title/description so the Finnish pages don't inherit English strings.
      card: "summary_large_image" as const,
      title: seo.title,
      description: seo.description,
      images: [ogImage(seo.image)],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const content = await getSiteContent();
  const dict = content.dictionaries[locale];

  /**
   * The chrome only gets the fields it renders.
   *
   * Nav and Footer are client components, so every prop is serialised into the
   * RSC payload that ships with *every* page. Passing the whole dictionary
   * (~57 KB per locale, all ~23 page blocks) and the whole `servicePages`
   * collection (~263 KB across both locales) meant the home page carried
   * ~375 KB of payload for a menu and a footer. The menu needs each service
   * page's title, nothing else — the full page copy is fetched by the service
   * page itself when it renders.
   */
  const navDict: NavDict = {
    nav: dict.nav,
    common: {
      briefUs: dict.common.briefUs,
      toggleTheme: dict.common.toggleTheme,
      menu: dict.common.menu,
    },
  };
  const footerDict: FooterDict = {
    footer: dict.footer,
    cookies: { settings: dict.cookies.settings },
  };
  const navServicePages: NavServicePage[] = content.servicePages.map((page) => ({
    slug: page.slug,
    fi: { title: page.fi.title },
    en: { title: page.en.title },
  }));

  return (
    // suppressHydrationWarning: the theme script mutates <html>'s class list
    // before React hydrates, so the client class never matches the SSR one.
    <html
      lang={locale}
      className={`${hostGrotesk.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        {/* The icon font is font-display: block, so icons stay invisible until
            it arrives — start fetching it with the HTML, not after the CSS. */}
        <link rel="preload" href="/fonts/material-symbols-subset.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        {/* Google Search Console site verification — content owned by the CMS. */}
        {content.integrations.gsc && (
          <meta name="google-site-verification" content={content.integrations.gsc} />
        )}
        {/* Design-token overrides from the CMS, after the stylesheet so they win. */}
        <ThemeStyle />
        {/* Admin-written CSS and head snippet, after the tokens so it can override them. */}
        <CustomHead />
      </head>
      <body className="min-h-full flex flex-col bg-offwhite pb-11 text-ink dark:bg-background dark:text-foreground">
        {/* reducedMotion="user" is not configurable: the OS setting always wins over
            whatever is set in the CMS. */}
        <MotionConfig reducedMotion="user">
          <MotionSettingsProvider value={content.motion}>
          {/* Keyboard users otherwise cross ~16 tab stops of chrome per page. */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple dark:focus:bg-purple dark:focus-visible:outline-light-purple"
          >
            {dict.common.skipToContent}
          </a>
          <SmoothScroll />
          <RouteWipe />
          {/* Sticky header: the announcement bar and nav stay visible while
              scrolling (the bar no longer scrolls away at the top). */}
          <div className="sticky top-0 z-50">
            <AnnouncementBar
              locale={locale}
              dict={dict.announcement}
              message={content.announcement?.message[locale]}
              href={content.announcement?.href || "/engine"}
            />
            <Nav locale={locale} dict={navDict} menu={content.nav.header} logo={content.brand.logo} ctas={content.ctas} servicePages={navServicePages} cases={content.cases.map(({ slug, client }) => ({ slug, client }))} />
          </div>
          <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
            {children}
          </main>
          <Footer locale={locale} dict={footerDict} logo={content.brand.logo} />
          {/* Always-visible sliding Media Insights strip — fetches its own
              page-filtered items from /api/insights (see the component). */}
          <InsightsTicker locale={locale} />
          <CookieConsent dict={dict.cookies} locale={locale} />
          {/* GA4, gated on cookie consent (see the component). */}
          <Analytics ga4={content.integrations.ga4} gtm={content.integrations.gtm} />
          </MotionSettingsProvider>
        </MotionConfig>
        <CustomBodyEnd />
        {/* Inert unless the CMS framed this page in edit mode — see the
            component for why it can be shipped to every visitor safely. */}
        <VisualEditor />
      </body>
    </html>
  );
}
