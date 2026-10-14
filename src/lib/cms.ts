import { dictionaries, type Dictionary } from "@/content/dictionary";
import { serviceCards, clients, valuePills, mediaPills, type ServiceCard } from "@/content/services";
import { cases as staticCases, type CaseStudy } from "@/content/cases";
import { insights as staticInsights, type Insight } from "@/content/insights";
import { team as staticTeam, houseBio as staticHouseBio, openRoles as staticOpenRoles, type TeamMember, type OpenRole } from "@/content/team";
import { channels as staticChannels, mediaGroups as staticMediaGroups, type Channel } from "@/content/channels";
import { servicePages as bundledServicePages, type ServicePage } from "@/content/servicePages";
import type { Locale } from "@/i18n/config";
import type { Block } from "@/content/blocks";

/**
 * The site's content layer.
 *
 * Copy and collections live in the NØRR3 CMS. This module fetches them, merges
 * them over the bundled `src/content/*` modules and hands the result to the
 * pages in exactly the shape those modules already exported — so a page reads
 * `dict.home.heroLeft` or `cases[0].metrics` without caring where it came from.
 *
 * Two properties matter more than freshness here:
 *
 *  1. **The site never goes dark.** If the CMS is down, mid-deploy, or returns
 *     something malformed, every accessor falls back to the committed content.
 *     A marketing site that 500s because a sidecar service restarted is worse
 *     than one showing yesterday's copy.
 *
 *  2. **Missing keys can't crash a render.** The CMS payload is merged *over*
 *     the static dictionary rather than replacing it, so a key an editor has not
 *     filled in resolves to the committed string instead of `undefined`.
 */

const CMS_URL = (process.env.NORR3_CMS_URL || "http://127.0.0.1:3848").replace(/\/+$/, "");

/** Cache tags the CMS invalidates through /api/revalidate after a publish. */
export const CMS_TAGS = {
  all: "cms",
  dictionary: "cms:dictionary",
  pages: "cms:pages",
  posts: "cms:posts",
  services: "cms:services",
  cases: "cms:cases",
  team: "cms:team",
  channels: "cms:channels",
  careers: "cms:careers",
  chrome: "cms:chrome",
  media: "cms:media",
  /** Team Social: profiles, feed, posts, stories (fetched in src/lib/social.ts). */
  social: "cms:social",
} as const;

const ALL_TAGS = Object.values(CMS_TAGS);

/* ------------------------------------------------------------------- types */

export type CmsPost = Insight & {
  category: string;
  tags: string[];
  author: string;
  featured: boolean;
  readingMinutes: number;
  isoDate: string;
  /**
   * Raw CMS stamps ("YYYY-MM-DD" or "YYYY-MM-DD HH:MM:SS", the latter in UTC):
   * `publishedAt` is the publish date the editor set, `updatedAt` the newest
   * revision someone actually wrote (autosaves excluded). Turned into ISO 8601
   * with the Helsinki offset by `src/lib/dates.ts`.
   */
  publishedAt?: string;
  updatedAt?: string;
  seo: Record<Locale, { title: string; description: string }>;
  fi: Insight["fi"] & { html: string };
  en: Insight["en"] & { html: string };
};

export type CmsNavItem = { label: Record<Locale, string>; href: string; icon: string };

export type CmsCta = {
  label: Record<Locale, string>;
  href: string;
  placement: string;
  variant: "primary" | "secondary" | "text";
};

export type CmsAnnouncement = {
  message: Record<Locale, string>;
  href: string;
  label: Record<Locale, string>;
} | null;

export type CmsCareer = {
  id: string;
  type: string;
  title: Record<Locale, string>;
  location: Record<Locale, string>;
  description: Record<Locale, string>;
  requirements: Record<Locale, string[]>;
};

export type MotionSettings = {
  enabled: boolean;
  reveal: { distance: number; duration: number; stagger: number; margin: number };
  hoverLift: number;
  marquee: { logos: number; pills: number; team: number };
  routeWipe: boolean;
};

/**
 * What the site animates with when the CMS has nothing to say. These are the
 * values the components were written with, so a fallback render is the design.
 */
export const MOTION_DEFAULTS: MotionSettings = {
  enabled: true,
  reveal: { distance: 24, duration: 0.55, stagger: 0.08, margin: 80 },
  hoverLift: 6,
  marquee: { logos: 55, pills: 40, team: 60 },
  routeWipe: true,
};

/**
 * One hero variant, as configured in the CMS.
 *
 * `images` and `config` are intentionally loose: the six variants draw quite
 * different things (the city skyline layers four parallax plates, the card stack
 * wants an orientation per card), and forcing them into one shape would mean
 * mostly-empty fields. Each hero component reads the keys it understands and
 * falls back to its built-in defaults for anything absent.
 */
export type CmsHero = {
  key: string;
  variant: string;
  label: string;
  enabled: boolean;
  weight: number;
  eyebrow: Record<Locale, string>;
  headline: Record<Locale, string>;
  words: Record<Locale, string[]>;
  body: Record<Locale, string>;
  cta: { label: Record<Locale, string>; href: string };
  images: HeroImage[];
  config: Record<string, unknown>;
};

export type HeroImage = {
  src: string;
  alt_fi?: string;
  alt_en?: string;
  [key: string]: unknown;
};

/**
 * A Media Insights "huomiopallo" — a small data box from the NØRR3 Media
 * Insights / Norstat study, suggested for one page. The CMS owns which boxes
 * are enabled per page; the website renders every enabled box whose `url`
 * matches the current path, ordered by priority then position. `text`/`source`
 * are locale pairs; English falls back to Finnish when empty.
 */
export type CmsMediaInsight = {
  id: string;
  url: string;
  priority: number;
  bigNumber: string;
  text: Record<Locale, string>;
  source: Record<Locale, string>;
  /** Where the box renders: `"ticker" | "rail" | "both"` (default "ticker"). */
  placement: string;
};

/**
 * A right-rail support card for the service pages, composed in the CMS
 * (approved + visible rows only). One row renders as two independently
 * toggleable boxes: a **media box** (`image` + `mediaTopic` label +
 * `mediaCaption`, gated by `mediaBoxVisible`) and a **text box**
 * (title/body/`items`/source, gated by `textBoxVisible`). `type` picks the
 * text box's icon and list treatment; `position` orders cards of the same
 * group. An item renders at all only when at least one of its boxes shows in
 * the active locale — the gating rules live in `src/lib/rail.ts`.
 */
export type CmsRailItem = {
  id: number;
  url: string;
  type: "decision_card" | "key_number" | "campaign_lesson" | "table" | "good_to_know" | "process";
  title: Record<Locale, string>;
  body: Record<Locale, string>;
  items: Record<Locale, string[]>;
  source: Record<Locale, string>;
  position: number;
  /** Site-relative media path like `/images/services-gen/x.webp` (empty = no media box). */
  image?: string;
  /**
   * EN-specific media file — e.g. a graph whose Finnish words/decimals were
   * redrawn in English. When empty, both locales render `image`. Normalised
   * by `toRailItem`: absent → "".
   */
  imageEn?: string;
  /** Alt text for `image`, per locale. */
  imageAlt?: Record<Locale, string>;
  /**
   * Whether the media box shows. Normalised by `toRailItem`: an absent flag
   * with a non-empty `image` becomes `true`, so rows seeded before the field
   * existed keep rendering their picture.
   */
  mediaBoxVisible?: boolean;
  /**
   * How the media box renders `image`: `"picture"` (cover-cropped, the
   * default) or `"graph"` (contained on white — charts read better that way).
   */
  mediaKind?: "picture" | "graph";
  /** Small label above the image, per locale. */
  mediaTopic?: Record<Locale, string>;
  /** Caption below the image, per locale. */
  mediaCaption?: Record<Locale, string>;
  /** Whether the text box shows. Normalised by `toRailItem`: absent → `true`. */
  textBoxVisible?: boolean;
};

export type CmsPageSummary = {
  slug: string;
  title: Record<Locale, string>;
  navLabel: Record<Locale, string>;
  updatedAt: string;
};

export type SiteContent = {
  source: "cms" | "fallback";
  generatedAt: string;
  error?: string;
  dictionaries: Record<Locale, Dictionary>;
  services: ServiceCard[];
  servicePages: ServicePage[];
  cases: CaseStudy[];
  posts: CmsPost[];
  team: TeamMember[];
  houseBio: { fi: string; en: string };
  openRoles: OpenRole[];
  careers: CmsCareer[];
  channels: Channel[];
  mediaGroups: { id: string; icon: string; fi: string; en: string }[];
  nav: { header: CmsNavItem[]; footerJoin: CmsNavItem[]; footerLegal: CmsNavItem[] };
  ctas: CmsCta[];
  announcement: CmsAnnouncement;
  pages: CmsPageSummary[];
  heroes: CmsHero[];
  /** Media Insights data boxes (huomiopallo), keyed by the page url they belong to. */
  mediaInsights: CmsMediaInsight[];
  /** Right-rail support cards for the service pages; approved+visible rows only. */
  railItems: CmsRailItem[];
  /** Widget datasets — chart channels, dashboard figures, company stats, brief channels. */
  datasets: Record<string, { fi: unknown; en: unknown }>;
  /** Named section-image slots on the hand-built pages, keyed by slot. */
  imageSlots: Record<string, { src: string; alt: Record<Locale, string>; caption: Record<Locale, string> }>;
  /** SEO the CMS owns for the hand-built routes, keyed by slug ("home" for /). */
  pageSeo: Record<string, { title: Record<Locale, string>; description: Record<Locale, string>; ogImage: string; robots: string; canonical: string }>;
  /**
   * Publish state per CMS page slug. The proxy 404s drafts, and the nav and
   * sitemap skip links whose page is not published.
   */
  pageStatus: Record<string, string>;
  /** CMS-managed redirects, applied by the middleware. */
  redirects: { from: string; to: string; status: number }[];
  /**
   * Runtime feature flags (e.g. `rail_enabled`), flipped in the CMS
   * (Settings → flags, or the MCP `cms_flags` tool). Values are coerced to
   * booleans — only `true` / `1` / `"1"` / `"true"` count as on. Empty when
   * the CMS is unreachable, so every flag is off: a CMS outage can never
   * switch a feature on, only keep one off.
   */
  flags: Record<string, boolean>;
  /** Third-party wiring (GA4, Search Console) owned by the CMS Settings screen. */
  /** gtm: Google Tag Manager container ID (GTM-XXXX). When set it carries every tag and ga4 is ignored. */
  integrations: { ga4: string; gtm?: string; gsc: string; sitemap: string };
  /** Site-wide custom code, written by an admin in the CMS. */
  code: { css: string; head: string; bodyEnd: string };
  /** Design-token overrides, emitted as CSS custom properties by the root layout. */
  theme: { root: Record<string, string>; dark: Record<string, string> };
  motion: MotionSettings;
  brand: {
    clients: string[];
    valuePills: { id: string; icon: string; fi: string; en: string }[];
    mediaPills: { id: string; icon: string; fi: string; en: string }[];
    /**
     * Wordmark override. An empty path means "use the file the site ships
     * with", which is how the brand survives a CMS that nobody has filled in.
     */
    logo: { wordmark: string };
  };
  mediaAlt: Record<string, { fi: string; en: string }>;
  site: {
    name: string;
    email: string;
    phone: string;
    linkedin: string;
    defaultLocale: Locale;
    ai: { enabled: boolean; url: string; model: string };
  };
};

/* ------------------------------------------------------------------ fallback */

/** Committed content, shaped like a CMS response. Used when the CMS is away. */
function fallbackContent(error?: string): SiteContent {
  return {
    source: "fallback",
    generatedAt: new Date(0).toISOString(),
    error,
    dictionaries,
    services: serviceCards,
    servicePages: bundledServicePages,
    cases: staticCases,
    posts: staticInsights.map(toFallbackPost),
    team: staticTeam,
    houseBio: staticHouseBio,
    openRoles: staticOpenRoles,
    careers: staticOpenRoles.map((role) => ({
      id: role.id,
      type: "full-time",
      title: role.title,
      location: role.location,
      description: { fi: "", en: "" },
      requirements: { fi: [], en: [] },
    })),
    channels: staticChannels,
    mediaGroups: staticMediaGroups,
    nav: {
      header: (["services", "engine", "cases", "insights", "contact", "about", "careers", "merch"] as const).map((key) => ({
        label: { fi: dictionaries.fi.nav[key], en: dictionaries.en.nav[key] },
        href: `/${key}`,
        icon: "",
      })),
      footerJoin: dictionaries.fi.footer.joinLinks.map((link, i) => ({
        label: { fi: link.label, en: dictionaries.en.footer.joinLinks[i]?.label ?? link.label },
        href: link.path.startsWith("/") ? link.path : `/${link.path}`,
        icon: "",
      })),
      footerLegal: [
        { label: { fi: dictionaries.fi.footer.privacy, en: dictionaries.en.footer.privacy }, href: "/privacy", icon: "" },
        { label: { fi: dictionaries.fi.footer.terms, en: dictionaries.en.footer.terms }, href: "/terms", icon: "" },
      ],
    },
    ctas: [
      { label: { fi: dictionaries.fi.common.briefUs, en: dictionaries.en.common.briefUs }, href: "/brief", placement: "header", variant: "secondary" },
      { label: { fi: dictionaries.fi.common.contactUs, en: dictionaries.en.common.contactUs }, href: "/contact", placement: "header", variant: "primary" },
    ],
    announcement: {
      message: { fi: dictionaries.fi.announcement.message, en: dictionaries.en.announcement.message },
      href: "/engine",
      label: { fi: "", en: "" },
    },
    pages: [],
    // No hero rows means the components use their own built-in content, which is
    // what the site shipped before heroes became editable.
    heroes: [],
    mediaInsights: [],
    railItems: [],
    datasets: {},
    imageSlots: {},
    pageSeo: {},
    pageStatus: {},
    redirects: [],
    // No CMS, no flags: every runtime switch stays off (the safe direction).
    flags: {},
    integrations: { ga4: "", gtm: "", gsc: "", sitemap: "https://norr3.fi/sitemap.xml" },
    code: { css: "", head: "", bodyEnd: "" },
    theme: { root: {}, dark: {} },
    motion: MOTION_DEFAULTS,
    // Empty means the shipped artwork: public/logo-wordmark.svg.
    brand: { clients, valuePills, mediaPills, logo: { wordmark: "" } },
    mediaAlt: {},
    site: {
      name: "NØRR3",
      email: "info@norr3.fi",
      phone: dictionaries.fi.footer.phone,
      linkedin: "https://www.linkedin.com/company/norr3",
      defaultLocale: "fi",
      ai: {
        enabled: true,
        url: process.env.NORR3_AI_URL || "http://localhost:11434/v1/chat/completions",
        model: process.env.NORR3_AI_MODEL || "glm-5.2:cloud",
      },
    },
  };
}

function toFallbackPost(post: Insight): CmsPost {
  const html = (paragraphs: string[]) => paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join("\n");
  const minutes = (paragraphs: string[]) =>
    Math.max(1, Math.round(paragraphs.join(" ").split(/\s+/).filter(Boolean).length / 200));
  return {
    ...post,
    category: "insights",
    tags: [],
    author: "NØRR3",
    featured: false,
    readingMinutes: minutes(post.en.body),
    isoDate: isoFromFinnish(post.date),
    seo: {
      fi: { title: "", description: post.fi.excerpt },
      en: { title: "", description: post.en.excerpt },
    },
    fi: { ...post.fi, html: html(post.fi.body) },
    en: { ...post.en, html: html(post.en.body) },
  };
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** "25.8.2026" -> "2026-08-25" */
function isoFromFinnish(value: string): string {
  const match = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/.exec(value.trim());
  if (!match) return value;
  return `${match[3]}-${match[2].padStart(2, "0")}-${match[1].padStart(2, "0")}`;
}

/* --------------------------------------------------------------------- fetch */

type RawBundle = {
  generatedAt?: string;
  dictionary?: Record<string, unknown>;
  services?: unknown[];
  servicePages?: unknown[];
  cases?: unknown[];
  insights?: unknown[];
  team?: unknown[];
  houseBio?: { fi: string; en: string };
  openRoles?: unknown[];
  careers?: unknown[];
  channels?: unknown[];
  mediaGroups?: unknown[];
  nav?: { header?: unknown[]; footerJoin?: unknown[]; footerLegal?: unknown[] };
  ctas?: unknown[];
  announcement?: unknown;
  pages?: unknown[];
  heroes?: unknown[];
  mediaInsights?: unknown[];
  railItems?: unknown[];
  datasets?: Record<string, { fi: unknown; en: unknown }>;
  imageSlots?: SiteContent["imageSlots"];
  pageSeo?: SiteContent["pageSeo"];
  pageStatus?: Record<string, string>;
  redirects?: unknown[];
  flags?: Record<string, unknown>;
  integrations?: Partial<SiteContent["integrations"]>;
  code?: { css?: string; head?: string; bodyEnd?: string };
  theme?: { root?: Record<string, string>; dark?: Record<string, string> };
  motion?: Partial<MotionSettings>;
  brand?: Partial<SiteContent["brand"]>;
  media?: Record<string, { fi: string; en: string }>;
  site?: Partial<SiteContent["site"]>;
};

/**
 * Fetch and normalise the CMS bundle.
 *
 * Revalidation is time-based as a safety net (five minutes) and tag-based for
 * immediacy: the CMS calls `/api/revalidate` on publish, which drops these tags.
 */
export async function getSiteContent(): Promise<SiteContent> {
  const fallback = fallbackContent();
  try {
    const res = await fetch(`${CMS_URL}/api/public/site`, {
      next: { revalidate: 300, tags: ALL_TAGS },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return fallbackContent(`CMS replied ${res.status}`);
    const raw = (await res.json()) as RawBundle;
    return merge(raw, fallback);
  } catch (error) {
    return fallbackContent(error instanceof Error ? error.message : "CMS unreachable");
  }
}

/**
 * CMS menu hrefs use CMS slugs (/cases, /about) while the public Finnish
 * routes are /caset, /meista, … — map either form to the page slug the CMS
 * tracks, so unpublished pages can be filtered out of the nav.
 */
function cmsPageSlugForHref(href: string): string | null {
  const path = href
    .split("#")[0]
    .split("?")[0]
    .replace(/^\/en(?=\/|$)/, "")
    .replace(/^\/+|\/+$/g, "");
  if (!path) return "home";
  const aliases: Record<string, string> = {
    caset: "cases",
    cases: "cases",
    tiimi: "team",
    team: "team",
    meista: "about",
    about: "about",
    "toihin-meille": "careers",
    careers: "careers",
    tietosuojaseloste: "privacy",
    privacy: "privacy",
    kayttoehdot: "terms",
    terms: "terms",
  };
  return aliases[path] ?? path;
}

/**
 * One railItems row as the public bundle sends it. The locale pairs
 * (`imageAlt`, `mediaTopic`, `mediaCaption`) arrive nested as `{ fi, en }` —
 * the same Locale-keyed shape title/body/items/source already arrive in — but
 * older payloads may still carry flat `image_alt_fi` / `media_topic_fi` /
 * `media_caption_fi`-style columns. `toRailItem` accepts both shapes and
 * normalises to nested pairs, so the renderer only ever reads `pair[locale]`.
 * The visibility flags arrive as SQLite integers, JSON booleans or strings
 * and are normalised to booleans with back-compat defaults; `mediaKind`
 * defaults to "picture".
 */
type RawRailItem = Omit<
  CmsRailItem,
  "imageAlt" | "mediaBoxVisible" | "mediaKind" | "mediaTopic" | "mediaCaption" | "textBoxVisible"
> & {
  imageEn?: unknown;
  /** Flat column shape older payloads may still carry (normalised like the localePair fields). */
  image_en?: string;
  imageAlt?: unknown;
  image_alt_fi?: string;
  image_alt_en?: string;
  mediaBoxVisible?: unknown;
  mediaKind?: unknown;
  mediaTopic?: unknown;
  media_topic_fi?: string;
  media_topic_en?: string;
  mediaCaption?: unknown;
  media_caption_fi?: string;
  media_caption_en?: string;
  textBoxVisible?: unknown;
};

/**
 * Normalise one locale pair: the nested `{ fi, en }` object wins, flat
 * per-locale columns are the fallback for older payloads, anything else
 * becomes an empty string.
 */
function localePair(nested: unknown, flatFi?: unknown, flatEn?: unknown): Record<Locale, string> {
  const pair =
    typeof nested === "object" && nested !== null ? (nested as Record<string, unknown>) : null;
  const fi = pair ? pair.fi : flatFi;
  const en = pair ? pair.en : flatEn;
  return {
    fi: typeof fi === "string" ? fi : "",
    en: typeof en === "string" ? en : "",
  };
}

/**
 * Tolerant boolean for the visibility flags: `1` / `"1"` / `true` (and
 * `"true"`) are on; an absent value returns `undefined` so the caller applies
 * its own back-compat default; anything else is off.
 */
function toFlag(value: unknown): boolean | undefined {
  if (value === undefined || value === null) return undefined;
  return value === true || value === 1 || value === "1" || value === "true";
}

/**
 * Normalise the CMS `flags` record: every value passes through `toFlag`, so
 * only `true` / `1` / `"1"` / `"true"` count as on and anything else is off.
 * A missing or non-object field becomes `{}` — all flags off.
 */
function toFlags(raw: unknown): Record<string, boolean> {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) return {};
  const out: Record<string, boolean> = {};
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    out[key] = toFlag(value) ?? false;
  }
  return out;
}

function toRailItem(row: RawRailItem): CmsRailItem {
  const {
    imageEn,
    image_en,
    imageAlt,
    image_alt_fi,
    image_alt_en,
    mediaBoxVisible,
    mediaKind,
    mediaTopic,
    media_topic_fi,
    media_topic_en,
    mediaCaption,
    media_caption_fi,
    media_caption_en,
    textBoxVisible,
    ...item
  } = row;
  // Back-compat with the rows seeded before the two-box split: no explicit
  // media flag + a picture present = the media box was showing, keep showing.
  const hasImage = typeof item.image === "string" && item.image.trim() !== "";
  return {
    ...item,
    // EN-specific media file; tolerant like the rest of this parser: absent → "".
    imageEn: typeof imageEn === "string" ? imageEn : typeof image_en === "string" ? image_en : "",
    imageAlt: localePair(imageAlt, image_alt_fi, image_alt_en),
    mediaBoxVisible: toFlag(mediaBoxVisible) ?? hasImage,
    mediaKind: mediaKind === "graph" ? "graph" : "picture",
    mediaTopic: localePair(mediaTopic, media_topic_fi, media_topic_en),
    mediaCaption: localePair(mediaCaption, media_caption_fi, media_caption_en),
    textBoxVisible: toFlag(textBoxVisible) ?? true,
  };
}

function merge(raw: RawBundle, fallback: SiteContent): SiteContent {
  const dictionary = raw.dictionary as Record<Locale, unknown> | undefined;
  const pageStatus = (raw.pageStatus ?? {}) as Record<string, string>;
  const pageIsLive = (href: string) => {
    const slug = cmsPageSlugForHref(href);
    const status = slug ? pageStatus[slug] : undefined;
    return status === undefined || status === "published";
  };
  return {
    source: "cms",
    generatedAt: raw.generatedAt ?? new Date().toISOString(),
    dictionaries: {
      fi: deepMerge(dictionaries.fi, dictionary?.fi) as Dictionary,
      en: deepMerge(dictionaries.en, dictionary?.en) as Dictionary,
    },
    // Services: the CMS owns the labels, but the longer per-item descriptions
    // and outcome lists only live in the bundled content — re-attach them by
    // matching label so a CMS list doesn't silently strip the detail the
    // expandable cards show.
    services: arrOr(raw.services, fallback.services).map((service, index) => {
      const shipped = fallback.services[index]?.number === service.number
        ? fallback.services[index]
        : fallback.services.find((s) => s.number === service.number);
      const mergedItems = (service.items ?? []).map((item) => {
        const match = shipped?.items?.find((candidate) => candidate.fi === item.fi || candidate.en === item.en);
        return match ? { ...match, ...item } : item;
      });
      return {
        ...service,
        items: mergedItems.length > 0 ? mergedItems : shipped?.items,
        outcomes: service.outcomes ?? shipped?.outcomes,
      };
    }) as ServiceCard[],
    servicePages: arrOr(raw.servicePages, fallback.servicePages) as ServicePage[],
    // An empty CMS list is a deliberate editorial choice (e.g. every case
    // hidden while copies are being checked) — only a missing/non-array field
    // falls back to the bundled content, never a present-but-empty one.
    cases: arrOr(raw.cases, fallback.cases) as CaseStudy[],
    posts: arrOr(raw.insights, fallback.posts) as CmsPost[],
    team: arrOr(raw.team, fallback.team) as TeamMember[],
    houseBio: raw.houseBio?.fi ? raw.houseBio : fallback.houseBio,
    openRoles: arrOr(raw.openRoles, fallback.openRoles) as OpenRole[],
    careers: arrOr(raw.careers, fallback.careers) as CmsCareer[],
    channels: arrOr(raw.channels, fallback.channels) as Channel[],
    mediaGroups: arrOr(raw.mediaGroups, fallback.mediaGroups) as SiteContent["mediaGroups"],
    nav: {
      header: (nonEmpty(raw.nav?.header, fallback.nav.header) as CmsNavItem[]).filter((item) =>
        pageIsLive(item.href)
      ),
      footerJoin: (nonEmpty(raw.nav?.footerJoin, fallback.nav.footerJoin) as CmsNavItem[]).filter(
        (item) => pageIsLive(item.href)
      ),
      footerLegal: (nonEmpty(raw.nav?.footerLegal, fallback.nav.footerLegal) as CmsNavItem[]).filter(
        (item) => pageIsLive(item.href)
      ),
    },
    ctas: nonEmpty(raw.ctas, fallback.ctas) as CmsCta[],
    announcement: (raw.announcement as CmsAnnouncement) ?? null,
    pages: (raw.pages ?? []) as CmsPageSummary[],
    heroes: (raw.heroes ?? []) as CmsHero[],
    // Normalize `placement` so a bundle from a CMS that predates the field
    // (no key at all) behaves exactly like today: everything goes to the ticker.
    mediaInsights: ((raw.mediaInsights ?? []) as CmsMediaInsight[]).map((insight) => ({
      ...insight,
      placement: insight.placement === "rail" || insight.placement === "both" ? insight.placement : "ticker",
    })),
    railItems: Array.isArray(raw.railItems) ? (raw.railItems as RawRailItem[]).map(toRailItem) : [],
    datasets: raw.datasets ?? {},
    imageSlots: raw.imageSlots ?? {},
    pageSeo: raw.pageSeo ?? {},
    pageStatus,
    redirects: (raw.redirects ?? []) as SiteContent["redirects"],
    flags: toFlags(raw.flags),
    integrations: (raw.integrations ?? fallback.integrations) as SiteContent["integrations"],
    code: {
      css: raw.code?.css ?? "",
      head: raw.code?.head ?? "",
      bodyEnd: raw.code?.bodyEnd ?? "",
    },
    theme: { root: raw.theme?.root ?? {}, dark: raw.theme?.dark ?? {} },
    motion: {
      ...MOTION_DEFAULTS,
      ...(raw.motion ?? {}),
      reveal: { ...MOTION_DEFAULTS.reveal, ...(raw.motion?.reveal ?? {}) },
      marquee: { ...MOTION_DEFAULTS.marquee, ...(raw.motion?.marquee ?? {}) },
    },
    brand: {
      clients: nonEmpty(raw.brand?.clients, fallback.brand.clients),
      valuePills: nonEmpty(raw.brand?.valuePills, fallback.brand.valuePills),
      mediaPills: nonEmpty(raw.brand?.mediaPills, fallback.brand.mediaPills),
      logo: { wordmark: raw.brand?.logo?.wordmark || "" },
    },
    mediaAlt: raw.media ?? {},
    site: {
      ...fallback.site,
      ...(raw.site ?? {}),
      ai: { ...fallback.site.ai, ...(raw.site?.ai ?? {}) },
    } as SiteContent["site"],
  };
}

function nonEmpty<T>(value: unknown, fallback: T): T {
  return Array.isArray(value) && value.length > 0 ? (value as unknown as T) : fallback;
}

/** Like `nonEmpty` but honours a deliberate empty list from the CMS. */
function arrOr<T>(value: unknown, fallback: T[]): T[] {
  return Array.isArray(value) ? (value as unknown as T[]) : fallback;
}

/**
 * Overlay `source` onto `base`, key by key.
 *
 * Only plain objects recurse — arrays are replaced wholesale, because an ordered
 * list (paragraphs, legal sections, channel columns) is meaningful as a unit and
 * merging index by index would silently mix two versions of it. An empty string
 * from the CMS is treated as "not filled in" and keeps the committed value.
 */
function deepMerge(base: unknown, source: unknown): unknown {
  if (source === undefined || source === null) return base;
  if (Array.isArray(source)) return source.length > 0 ? source : base;
  if (typeof source !== "object") return source === "" ? base : source;
  if (typeof base !== "object" || base === null || Array.isArray(base)) return source;

  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const [key, value] of Object.entries(source as Record<string, unknown>)) {
    out[key] = key in out ? deepMerge(out[key], value) : value;
  }
  return out;
}

/* ------------------------------------------------------------- convenience */

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const content = await getSiteContent();
  return content.dictionaries[locale];
}

export async function getPosts(): Promise<CmsPost[]> {
  return (await getSiteContent()).posts;
}

export async function getPost(slug: string): Promise<CmsPost | undefined> {
  return (await getPosts()).find((post) => post.slug === slug);
}

export async function getCases(): Promise<CaseStudy[]> {
  return (await getSiteContent()).cases;
}

export async function getCase(slug: string): Promise<CaseStudy | undefined> {
  return (await getCases()).find((entry) => entry.slug === slug);
}

/**
 * Draft case preview: fetches a hidden case from the CMS via the
 * password-protected endpoint. The site_url comes from CMS settings, which
 * is also the origin that must proxy the request (the CMS serves the
 * images). The browser carries the granted cookie automatically.
 */
export async function getCaseViaPreviewApi(
  slug: string,
  cookie?: string
): Promise<CaseStudy | undefined> {
  const base = process.env.NORR3_CMS_URL ?? "http://127.0.0.1:3848";
  try {
    const pwParam = cookie ? '&password=' + encodeURIComponent(cookie) : '';
    const res = await fetch(`${base}/api/public/case?slug=${encodeURIComponent(slug)}${pwParam}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return undefined;
    const data = (await res.json()) as { case?: CaseStudy & { parallax?: boolean } };
    return data.case as CaseStudy | undefined;
  } catch {
    return undefined;
  }
}

/* -------------------------------------------------------------- block pages */

export type CmsPage = {
  slug: string;
  kind: string;
  title: Record<Locale, string>;
  seo: Record<Locale, { title: string; description: string }>;
  ogImage: string;
  blocks: Block[];
  status: string;
  updatedAt: string;
};

/** One CMS-built page. `preview` forwards the CMS session so drafts render. */
export async function getCmsPage(slug: string, cookie?: string): Promise<CmsPage | null> {
  const preview = Boolean(cookie);
  try {
    const init: RequestInit = preview
      ? { cache: "no-store", headers: { cookie: cookie ?? "" } }
      : { next: { revalidate: 300, tags: [CMS_TAGS.all, CMS_TAGS.pages] } };
    const res = await fetch(
      `${CMS_URL}/api/public/page?slug=${encodeURIComponent(slug)}${preview ? "&preview=1" : ""}`,
      { ...init, signal: AbortSignal.timeout(4000) }
    );
    if (!res.ok) return null;
    return (await res.json()) as CmsPage;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------ form ingestion */

const INGEST_SECRET = process.env.NORR3_CMS_INGEST_SECRET ?? "";

/**
 * Post a website form submission into the CMS inbox. Server-side only — the
 * shared secret never reaches the browser.
 */
export async function submitToCms(
  form: "contact" | "brief" | "application" | "idea" | "demo" | "meeting",
  data: Record<string, unknown>
): Promise<{ ok: boolean; error?: string }> {
  if (!INGEST_SECRET) {
    return { ok: false, error: "NORR3_CMS_INGEST_SECRET is not configured on the website." };
  }
  try {
    const res = await fetch(`${CMS_URL}/api/public/forms`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-norr3-secret": INGEST_SECRET },
      body: JSON.stringify({ form, data }),
      cache: "no-store",
      signal: AbortSignal.timeout(6000),
    });
    const payload = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) return { ok: false, error: payload.error ?? `CMS replied ${res.status}` };
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "CMS unreachable" };
  }
}

/**
 * Upload a CV attachment for a job application to the CMS (signed with the
 * shared ingest secret, so it never hits the website's public tree). Returns
 * the relative serve path to store on the application record.
 */
export async function uploadApplicationFile(
  file: File
): Promise<{ ok: boolean; path?: string; error?: string }> {
  if (!INGEST_SECRET) {
    return { ok: false, error: "NORR3_CMS_INGEST_SECRET is not configured on the website." };
  }
  try {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(`${CMS_URL}/api/public/application-file`, {
      method: "POST",
      headers: { "x-norr3-secret": INGEST_SECRET },
      body: fd,
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });
    const payload = (await res.json().catch(() => ({}))) as { path?: string; error?: string };
    if (!res.ok) return { ok: false, error: payload.error ?? `CMS replied ${res.status}` };
    return { ok: true, path: payload.path };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "CMS unreachable" };
  }
}

export const cmsUrl = CMS_URL;
