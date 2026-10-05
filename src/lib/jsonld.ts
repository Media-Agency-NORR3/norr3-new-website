import type { Locale } from "@/i18n/config";
import type { SiteContent } from "@/lib/cms";
import type { Block } from "@/content/blocks";
import { linkTo } from "@/lib/links";

/**
 * Structured data (schema.org JSON-LD) for the site.
 *
 * One vocabulary of node builders, so every page describes itself the same
 * way and every cross-reference resolves to the same `@id`:
 *
 *  - `https://norr3.fi/#organization`   the company (declared in full on the home page)
 *  - `https://norr3.fi/#website`        the site
 *  - `https://norr3.fi/tiimi/<slug>#person`  a team member (declared on their profile page)
 *  - `<page url>#breadcrumb`, `#service`, `#faq` — page-local nodes
 *
 * Pages other than the home page only *reference* the organization and the
 * people by `@id` (plus a name so the node is still readable on its own);
 * the full descriptions live on the pages that own them.
 *
 * Render with `<JsonLd data={…} />` (src/components/JsonLd.tsx), which
 * serialises safely against `</script>` in CMS text.
 */

export const SITE_URL = "https://norr3.fi";
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/** Brand facts that are not (yet) in the CMS. Keep in one place. */
export const ORGANIZATION_FACTS = {
  name: "NØRR3",
  legalName: "NORR3 Oy",
  vatId: "FI29620748",
  taxId: "2962074-8",
  foundingDate: "2019",
  /** The wordmark the site itself uses as its logo (Logo.tsx). */
  logo: `${SITE_URL}/logo-wordmark.svg`,
  /**
   * Public profiles. Only URLs confirmed on the site (footer) or in the CMS
   * are listed; empty strings are filtered out at build time.
   * TODO(Geir): add the Mynewsdesk newsroom and Teamtailor careers URLs —
   * neither is referenced anywhere in the site, dictionary or CMS yet.
   */
  sameAs: {
    linkedin: "https://www.linkedin.com/company/norr3",
    instagram: "https://www.instagram.com/norr3.fi/",
    mynewsdesk: "",
    teamtailor: "",
  },
  /** TODO(Geir): confirm the award years — only 2023 is cited in the site copy. */
  awards: ["Vuoden Toimisto 2022", "Vuoden Toimisto 2023"],
  /**
   * Team slugs of the founders, referenced as `founder` on the Organization.
   * TODO(Geir): fill in — no source in the CMS or site copy names the founders,
   * so this stays empty rather than guessing.
   */
  founderSlugs: [] as string[],
} as const;

/* ----------------------------------------------------------------- basics */

export type JsonLdNode = Record<string, unknown> & { "@type": string };

export function absolute(path: string): string {
  if (!path) return SITE_URL;
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** The public URL of a locale-relative path. */
export function pageUrl(locale: Locale, path = "/"): string {
  return absolute(linkTo(locale, path));
}

export function inLanguage(locale: Locale): string {
  return locale === "fi" ? "fi-FI" : "en-US";
}

/** The `@id` of a team member's Person node — locale-independent on purpose. */
export function personId(slug: string): string {
  return `${SITE_URL}/tiimi/${slug}#person`;
}

/** A minimal reference to the organization, usable on any page. */
export function organizationRef(): JsonLdNode {
  return { "@type": "Organization", "@id": ORGANIZATION_ID, name: ORGANIZATION_FACTS.name, url: SITE_URL };
}

/** A minimal reference to a team member, usable on any page. */
export function personRef(member: { id: string; name: string; role?: { fi: string; en: string } }, locale: Locale): JsonLdNode {
  const jobTitle = member.role?.[locale] || member.role?.fi || "";
  return {
    "@type": "Person",
    "@id": personId(member.id),
    name: member.name,
    url: `${SITE_URL}/tiimi/${member.id}`,
    ...(jobTitle ? { jobTitle } : {}),
  };
}

/** Publisher block for Article/CreativeWork nodes. */
export function publisherRef(): JsonLdNode {
  return {
    ...organizationRef(),
    logo: { "@type": "ImageObject", url: ORGANIZATION_FACTS.logo },
  };
}

function compact<T extends Record<string, unknown>>(obj: T): T {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined && v !== "" && v !== null)) as T;
}

/* ------------------------------------------------------------- breadcrumb */

export type Crumb = { name: string; url?: string };

/** Home › … › current page. The last crumb carries no URL (it is the page itself). */
export function breadcrumbList(url: string, crumbs: Crumb[]): JsonLdNode {
  return {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      ...(crumb.url && i < crumbs.length - 1 ? { item: crumb.url } : {}),
    })),
  };
}

/** The site's root crumb, in the page locale. */
export function homeCrumb(locale: Locale): Crumb {
  return { name: ORGANIZATION_FACTS.name, url: pageUrl(locale, "/") };
}

/* ---------------------------------------------------------------- web page */

export type WebPageInput = {
  url: string;
  locale: Locale;
  name: string;
  description?: string;
  image?: string;
  /** "WebPage" (default), "CollectionPage", "AboutPage", "ContactPage", "ProfilePage" … */
  type?: string;
  /** Extra properties merged onto the node (mainEntity, about, dateModified …). */
  extra?: Record<string, unknown>;
};

export function webPage({ url, locale, name, description, image, type = "WebPage", extra }: WebPageInput): JsonLdNode {
  return compact({
    "@type": type,
    "@id": url,
    url,
    name,
    description,
    inLanguage: inLanguage(locale),
    isPartOf: { "@id": WEBSITE_ID },
    breadcrumb: { "@id": `${url}#breadcrumb` },
    ...(image ? { primaryImageOfPage: { "@type": "ImageObject", url: absolute(image) } } : {}),
    ...extra,
  });
}

/**
 * A page plus its breadcrumb — the pair every hand-built route emits. Returns
 * an array of nodes for a single `@graph`.
 */
export function pageGraph(input: WebPageInput & { crumbs: Crumb[] }): JsonLdNode[] {
  const { crumbs, ...page } = input;
  return [webPage(page), breadcrumbList(page.url, crumbs)];
}

/** An ItemList of links (for CollectionPage.mainEntity). */
export function itemList(id: string, items: { url: string; name?: string }[]): JsonLdNode {
  return {
    "@type": "ItemList",
    "@id": id,
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: item.url,
      ...(item.name ? { name: item.name } : {}),
    })),
  };
}

/* ----------------------------------------------------------------- service */

export type ServiceInput = {
  url: string;
  locale: Locale;
  /** The service name (the page's own title, not the SEO title). */
  name: string;
  /** SEO title of the page — used for the WebPage node. */
  pageTitle: string;
  description: string;
  image?: string;
  crumbs: Crumb[];
  /** Industry pages: the audience the service is packaged for. */
  audience?: string;
};

/**
 * Service + WebPage + BreadcrumbList for a service landing page. The
 * provider is the organization by reference; area served is Finland.
 */
export function serviceGraph({ url, locale, name, pageTitle, description, image, crumbs, audience }: ServiceInput): JsonLdNode[] {
  const serviceId = `${url}#service`;
  return [
    compact({
      "@type": "Service",
      "@id": serviceId,
      name,
      serviceType: name,
      description,
      url,
      inLanguage: inLanguage(locale),
      provider: { "@id": ORGANIZATION_ID },
      areaServed: { "@type": "Country", name: "FI" },
      ...(image ? { image: absolute(image) } : {}),
      ...(audience ? { audience: { "@type": "BusinessAudience", name: audience } } : {}),
    }),
    webPage({ url, locale, name: pageTitle, description, image, extra: { mainEntity: { "@id": serviceId } } }),
    breadcrumbList(url, crumbs),
  ];
}

/* --------------------------------------------------------------------- faq */

export type FaqItem = { question: string; answer: string };

export function faqPage(url: string, items: FaqItem[]): JsonLdNode | null {
  const rows = items.filter((i) => i.question.trim() && i.answer.trim());
  if (rows.length === 0) return null;
  return {
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    mainEntity: rows.map((row) => ({
      "@type": "Question",
      name: row.question.trim(),
      acceptedAnswer: { "@type": "Answer", text: row.answer.trim() },
    })),
  };
}

/**
 * FAQ content of a CMS block page: every visible `accordion` block
 * ("Collapsible question / answer list" in the CMS) contributes its rows.
 * The hand-built routes, service pages, cases and posts have no FAQ field.
 */
export function faqItemsFromBlocks(blocks: Block[], locale: Locale): FaqItem[] {
  const text = (value: unknown): string => {
    if (typeof value === "string") return value;
    if (value && typeof value === "object") {
      const v = value as Record<string, unknown>;
      const picked = v[locale] ?? v.fi ?? v.en;
      return typeof picked === "string" ? picked : "";
    }
    return "";
  };
  const items: FaqItem[] = [];
  for (const block of blocks) {
    if (block.hidden || block.type !== "accordion") continue;
    const rows = Array.isArray(block.props.items) ? (block.props.items as Record<string, unknown>[]) : [];
    for (const row of rows) {
      if (!row || typeof row !== "object") continue;
      items.push({ question: text(row.title), answer: text(row.body).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ") });
    }
  }
  return items;
}

/* ------------------------------------------------------------ organization */

/**
 * The full Organization node — declared once, on the home page. Everything
 * else on the site points at its `@id`.
 */
export function organizationNode(content: SiteContent, locale: Locale, description: string): JsonLdNode {
  const dict = content.dictionaries[locale];
  const facts = ORGANIZATION_FACTS;
  const team = content.team;
  const bySlug = new Map(team.map((m) => [m.id, m]));
  const founders = facts.founderSlugs.map((slug) => bySlug.get(slug)).filter((m) => m !== undefined);
  const sameAs = Object.values(facts.sameAs).filter(Boolean);
  const email = content.site.email || "info@norr3.fi";
  const telephone = (content.site.phone || dict.footer.phone || "").trim();

  return compact({
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: content.site.name || facts.name,
    legalName: facts.legalName,
    alternateName: "NORR3",
    url: SITE_URL,
    logo: { "@type": "ImageObject", url: facts.logo },
    image: `${SITE_URL}/images/brand/og-image.jpg`,
    description,
    foundingDate: facts.foundingDate,
    vatID: facts.vatId,
    taxID: facts.taxId,
    email,
    telephone: telephone || undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Pursimiehenkatu 26 C",
      postalCode: "00150",
      addressLocality: "Helsinki",
      addressCountry: "FI",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email,
      ...(telephone ? { telephone } : {}),
      availableLanguage: ["fi", "en"],
      areaServed: "FI",
    },
    areaServed: { "@type": "Country", name: "FI" },
    knowsLanguage: ["fi", "en"],
    sameAs: sameAs.length ? sameAs : undefined,
    award: facts.awards,
    numberOfEmployees: team.length ? { "@type": "QuantitativeValue", value: team.length } : undefined,
    founder: founders.length ? founders.map((m) => personRef(m, locale)) : undefined,
    employee: team.length ? team.map((m) => personRef(m, locale)) : undefined,
  });
}

export function webSiteNode(description: string): JsonLdNode {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: ORGANIZATION_FACTS.name,
    description,
    publisher: { "@id": ORGANIZATION_ID },
    inLanguage: ["fi", "en"],
  };
}

/* --------------------------------------------------------------- articles */

/**
 * The author of an insight post. The CMS stores a free-text author name; when
 * it matches a team member the author is that Person (by `@id`, so it links
 * to their profile page). Otherwise — "NØRR3", empty, or an unknown name —
 * the organization is the author.
 */
export function articleAuthor(authorName: string, team: SiteContent["team"], locale: Locale): JsonLdNode {
  const wanted = authorName.trim().toLowerCase();
  if (wanted && wanted !== "nørr3" && wanted !== "norr3") {
    const member = team.find((m) => m.name.trim().toLowerCase() === wanted);
    if (member) return personRef(member, locale);
    // A real person's name that is not on the roster: still a Person, just unlinked.
    return { "@type": "Person", name: authorName.trim(), worksFor: { "@id": ORGANIZATION_ID } };
  }
  return organizationRef();
}

/* ------------------------------------------------------------- serialise */

/**
 * The document: one `@context`, one `@graph`. Safe inside a `<script>`:
 * `<` is escaped so `</script>` in CMS text cannot close the tag, and the
 * JS line separators JSON.stringify leaves raw are neutralised.
 */
export function serializeJsonLd(nodes: JsonLdNode | JsonLdNode[]): string {
  const list = (Array.isArray(nodes) ? nodes : [nodes]).filter(Boolean);
  const doc = list.length === 1 ? { "@context": "https://schema.org", ...list[0] } : { "@context": "https://schema.org", "@graph": list };
  return JSON.stringify(doc)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
