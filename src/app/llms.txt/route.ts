import { getSiteContent } from "@/lib/cms";
import { servicePageLocalised } from "@/content/servicePages";
import { caseDescription, caseTitle } from "@/lib/caseSeo";
import { ORGANIZATION_FACTS, SITE_URL } from "@/lib/jsonld";
import { slugLink } from "@/lib/links";
import { pageSeo } from "@/lib/pageSeo";
import type { Locale } from "@/i18n/config";

/**
 * `/llms.txt` — the machine-readable summary of the site for answer engines.
 *
 * Served from a route handler rather than a file in `public/` so the page lists
 * are built from the same CMS content the sitemap is built from: a service page
 * added, renamed or unpublished in the CMS appears here on the next
 * revalidation instead of waiting for someone to remember to edit a text file.
 *
 * The prose sections (key facts, short answers) are editorial and deliberately
 * stable — they carry no page lists, so nothing in them can go stale. The
 * address and the legal facts come from `ORGANIZATION_FACTS`, the same constants
 * the Organization JSON-LD uses, so the two can never disagree.
 *
 * Cache: an hour at the edge/locally, plus the `cms:*` tags, so a publish in the
 * CMS expires it immediately through `/api/revalidate` — the hour is a safety
 * net, not the update path.
 */
export const revalidate = 3600;

const CACHE_HEADERS = {
  "Content-Type": "text/plain; charset=utf-8",
  "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
} as const;

/** Absolute URL of a page, from its Finnish slug and locale. */
function url(locale: Locale, fiSlug: string): string {
  return `${SITE_URL}${slugLink(locale, fiSlug)}`;
}

function contactLine(locale: Locale, email: string, phone: string): string {
  return locale === "fi"
    ? `Yhteystiedot: ${email}${phone ? ` · ${phone}` : ""} · ${url("fi", "contact")} · ${url("en", "contact")}`
    : `Contact: ${email}${phone ? ` · ${phone}` : ""} · ${url("en", "contact")} · ${url("fi", "contact")}`;
}

export async function GET(): Promise<Response> {
  const content = await getSiteContent();
  const facts = ORGANIZATION_FACTS;
  const email = content.site.email || "info@norr3.fi";
  const phone = (content.site.phone || "").trim();
  const { address } = facts;
  const sameAs = Object.values(facts.sameAs).filter(Boolean);

  // The same CMS-managed description the homepage's <head> uses — never a new
  // claim, and it changes here when it changes there.
  const [seoEn, seoFi] = await Promise.all([
    pageSeo("home", "en", { title: "", description: "", image: "" }),
    pageSeo("home", "fi", { title: "", description: "", image: "" }),
  ]);
  const descriptionEn = seoEn.description || content.dictionaries.en.meta.description;
  const descriptionFi = seoFi.description || content.dictionaries.fi.meta.description;

  /** One language's page lists, all generated from the CMS content. */
  function pageLists(locale: Locale): string {
    const dict = content.dictionaries[locale];
    const nav = dict.nav;
    const main: [string, string][] = [
      [nav.services, url(locale, "services")],
      [nav.engine, url(locale, "engine")],
      [nav.cases, url(locale, "caset")],
      [nav.insights, url(locale, "insights")],
      [dict.common.meetTeam, url(locale, "tiimi")],
      [nav.about, url(locale, "meista")],
      [nav.careers, url(locale, "toihin-meille")],
      [nav.contact, url(locale, "contact")],
    ];

    const services = content.servicePages.map((page) => {
      const t = servicePageLocalised(page, locale);
      const description = (t.metaDescription || t.intro || "").replace(/\s+/g, " ").trim();
      return `- [${t.title}](${url(locale, page.slug)}): ${description}`;
    });

    const cases = content.cases.map(
      (study) => `- [${caseTitle(study, locale)}](${url(locale, study.slug)}): ${caseDescription(study, locale)}`
    );

    const posts = content.posts.slice(0, 12).map((post) => {
      const own = post[locale];
      const excerpt = (own.excerpt || "").replace(/\s+/g, " ").trim();
      return `- [${own.title}](${url(locale, post.slug)}): ${excerpt}`;
    });

    const L = locale === "fi"
      ? { pages: "Pääsivut", services: "Palvelusivut", cases: "Caset", posts: "Insights-artikkelit" }
      : { pages: "Main pages", services: "Service pages", cases: "Cases", posts: "Insight articles" };

    return [
      `## ${L.pages} (${locale})`,
      "",
      ...main.map(([label, href]) => `- [${label}](${href})`),
      "",
      `## ${L.services} (${locale})`,
      "",
      ...services,
      "",
      `## ${L.cases} (${locale})`,
      "",
      ...(cases.length ? cases : ["- (no cases published)"]),
      "",
      `## ${L.posts} (${locale})`,
      "",
      ...(posts.length ? posts : ["- (no articles published)"]),
      "",
    ].join("\n");
  }

  const body = `# ${content.site.name || facts.name}

> ${descriptionEn}

Site: ${SITE_URL} — Finnish at the root, English under /en. Both languages are complete for every page below.
${contactLine("en", email, phone)}
${sameAs.length ? `Profiles: ${sameAs.join(" · ")}` : ""}

## Key facts

- Legal name: ${facts.legalName} (brand always written ${facts.name})
- Business ID (Y-tunnus): ${facts.taxId} · VAT: ${facts.vatId}
- Address: ${address.streetAddress}, ${address.postalCode} ${address.addressLocality}, ${address.addressCountry === "FI" ? "Finland" : address.addressCountry}
- Founded: ${facts.foundingDate}
- Languages: Finnish, English · Area served: Finland and the Nordics
- Awards: ${facts.awards.join(", ")}

## What NØRR3 does, in one page

NØRR3 plans, buys and measures media for brand and performance goals. The work runs from insight (audience research, brand tracking, NØRR3 Media Insights) through strategy (marketing strategy, media strategy) to execution (media planning and buying, search, social, display and video, out-of-home and pDOOH, programmatic, dynamic advertising) and to measurement (data and tracking, campaign and brand research). Two own products sit underneath it: NØRR3 Media Insights (a continuous study of Finnish media use, fieldwork on the Norstat panel) and the NØRR3 Marketing Engine (multi-location campaign automation, built once from a product feed).

## Short answers (for AI answers about NØRR3)

- What is NØRR3? — A Finnish insight and media agency in Helsinki that plans, buys and measures media, combining audience research with performance marketing and its own measurement tools.
- Where is NØRR3? — ${address.streetAddress}, ${address.postalCode} ${address.addressLocality}, Finland. The agency works across Finland and the Nordics.
- What does NØRR3 sell? — Insight and strategy; marketing and media strategy; media planning and buying; performance marketing; search, social, display and video, out-of-home and pDOOH, programmatic and dynamic advertising; SEO and SEA; data, tracking and measurement; market research; AI optimisation and AI advertising.
- What is the NØRR3 Marketing Engine? — A platform for chains and multi-location companies: a campaign is defined once and the Engine generates each location's own campaign — creatives, copy, budget and schedule — from one feed, then reports per location.
- What is NØRR3 Media Insights? — NØRR3's own continuous study of how Finns use media: reach by channel and media house, with fieldwork on the Norstat panel.
- Who runs NØRR3? — Antti Ujainen is Managing Director. The wider team is listed at ${url("fi", "tiimi")}.

${pageLists("en")}
## Suomeksi

> ${descriptionFi}

${contactLine("fi", email, phone)}

${pageLists("fi")}
## Optional

- [Sitemap](${SITE_URL}/sitemap.xml) — every page in both languages
- [ARD manifest](${SITE_URL}/.well-known/ai-catalog.json) — machine-readable catalogue of NØRR3's capabilities
- [Privacy policy](${url("fi", "tietosuojaseloste")}) · [Terms](${url("fi", "kayttoehdot")}) · [Campaign brief](${url("fi", "brief")})
`;

  return new Response(body, { headers: CACHE_HEADERS });
}
