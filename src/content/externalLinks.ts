/**
 * Curated external links ("Sources & further reading").
 *
 * The Oct-2026 SEO audit asked for more outbound links. Outbound links to
 * authoritative third parties are a genuine quality signal — they show the
 * pages are sourced rather than self-referential — so each service page gets a
 * short, topic-relevant list of the industry bodies, measurement houses and
 * platform documentation the work actually rests on.
 *
 * Every URL here was checked live (HTTP 200) before being added; nothing is
 * guessed. `authority` entries are public reference sources, `platform`
 * entries are the ad platforms NØRR3 buys on, `partner` entries are the
 * agencies/publications NØRR3 works with.
 */
export type ExternalLink = {
  href: string;
  label: string;
  /** What the reader gets there, per locale. */
  note: { fi: string; en: string };
};

export const EXTERNAL_LINKS = {
  /** Independent audience and media measurement in Finland. */
  mediaMetrics: {
    href: "https://mediametrics.fi/",
    label: "Media Metrics Finland",
    note: {
      fi: "Suomalaisen median yleisö- ja mainosmittauksen yhteinen lähde.",
      en: "The shared source for Finnish media audience and advertising measurement.",
    },
  },
  iab: {
    href: "https://www.iab.fi/",
    label: "IAB Finland",
    note: {
      fi: "Digimainonnan standardit, määritelmät ja koulutus.",
      en: "Standards, definitions and training for digital advertising.",
    },
  },
  statisticsFinland: {
    href: "https://stat.fi/en",
    label: "Statistics Finland",
    note: {
      fi: "Virallinen tilastoaineisto väestöstä, kulutuksesta ja taloudesta.",
      en: "Official statistics on population, consumption and the economy.",
    },
  },
  kantar: {
    href: "https://www.kantar.com/",
    label: "Kantar",
    note: {
      fi: "Kansainvälinen yleisö- ja bränditutkimus.",
      en: "International audience and brand research.",
    },
  },
  norstat: {
    href: "https://norstat.co/",
    label: "Norstat",
    note: {
      fi: "Paneelikumppanimme NØRR3 Media Insights -tutkimuksen kenttätyössä.",
      en: "Our panel partner for the fieldwork behind NØRR3 Media Insights.",
    },
  },
  statista: {
    href: "https://www.statista.com/",
    label: "Statista",
    note: {
      fi: "Markkina- ja toimialadata vertailuun.",
      en: "Market and industry data for benchmarking.",
    },
  },
  similarweb: {
    href: "https://www.similarweb.com/",
    label: "Similarweb",
    note: {
      fi: "Verkkosivujen liikenne- ja kilpailija-analyysi.",
      en: "Website traffic and competitor analysis.",
    },
  },
  nielsen: {
    href: "https://www.nielsen.com/",
    label: "Nielsen",
    note: {
      fi: "Kansainvälinen media- ja yleisömittaus.",
      en: "International media and audience measurement.",
    },
  },
  googleAds: {
    href: "https://business.google.com/en-all/google-ads/",
    label: "Google Ads",
    note: {
      fi: "Hakumainonnan alusta ja sen virallinen dokumentaatio.",
      en: "The search advertising platform and its official documentation.",
    },
  },
  googleAnalytics: {
    href: "https://marketingplatform.google.com/about/analytics/",
    label: "Google Analytics",
    note: {
      fi: "Verkkosivun kävijämittauksen työkalu.",
      en: "The web analytics measurement tool.",
    },
  },
  linkedinAds: {
    href: "https://business.linkedin.com/",
    label: "LinkedIn Ads",
    note: {
      fi: "B2B-mainonnan alusta ammattilaisyleisöille.",
      en: "The B2B advertising platform for professional audiences.",
    },
  },
  metaBusiness: {
    href: "https://www.facebook.com/business",
    label: "Meta for Business",
    note: {
      fi: "Facebook- ja Instagram-mainonnan virallinen ohjeistus.",
      en: "The official guidance for advertising on Facebook and Instagram.",
    },
  },
  tiktokAds: {
    href: "https://ads.tiktok.com/",
    label: "TikTok for Business",
    note: {
      fi: "TikTok-mainonnan alusta ja formaatit.",
      en: "The TikTok advertising platform and its formats.",
    },
  },
  treKronorMedia: {
    href: "https://www.trekronormedia.com/",
    label: "Tre Kronor Media",
    note: {
      fi: "Pohjoismainen mediatoimistokumppanimme.",
      en: "Our Nordic media agency partner.",
    },
  },
} satisfies Record<string, ExternalLink>;

export type ExternalLinkKey = keyof typeof EXTERNAL_LINKS;

/**
 * Which links each service page carries. Topic-matched rather than one global
 * list, so a page about search advertising cites the search platform and a page
 * about measurement cites the measurement houses. Unknown slugs fall back to
 * `DEFAULT_LINKS`.
 */
const LINKS_BY_SLUG: Record<string, ExternalLinkKey[]> = {
  // Media planning and buying — audience and industry measurement.
  mediasuunnittelu: ["mediaMetrics", "iab", "kantar", "norstat"],
  "mediasuunnittelu/radio": ["mediaMetrics", "kantar"],
  "mediasuunnittelu/televisio": ["mediaMetrics", "kantar", "nielsen"],
  "mediasuunnittelu/elokuvamainonta-eli-cinema": ["mediaMetrics", "kantar"],
  "mediasuunnittelu/printti-eli-lehtimainonta": ["mediaMetrics", "statisticsFinland"],
  "mediasuunnittelu/luovat": ["iab", "mediaMetrics"],
  "mediasuunnittelu/kampanjat-ja-jatkuva-mainonta": ["mediaMetrics", "iab"],
  "mediasuunnittelu/norr3-media-insights": ["norstat", "mediaMetrics", "kantar", "statisticsFinland"],
  mediastrategia: ["mediaMetrics", "kantar", "iab"],
  ulkomainonta: ["mediaMetrics", "iab"],
  "display-ja-videomainonta": ["iab", "mediaMetrics", "metaBusiness"],
  "dynaaminen-mainonta": ["iab", "googleAds", "metaBusiness"],
  // Performance and search.
  "hakukoneoptimointi": ["googleAds", "googleAnalytics", "similarweb"],
  hakukonemainonta: ["googleAds", "googleAnalytics"],
  "performance-markkinointi": ["googleAds", "googleAnalytics", "metaBusiness"],
  somemarkkinointi: ["metaBusiness", "linkedinAds", "tiktokAds", "iab"],
  // Data, measurement and research.
  "data-ja-mittaus": ["googleAnalytics", "statisticsFinland", "nielsen"],
  "data-ja-mittaus/dashboardit": ["googleAnalytics", "statista"],
  "data-ja-mittaus/datan-mallintaminen": ["googleAnalytics", "nielsen", "statista"],
  tutkimukset: ["norstat", "kantar", "statisticsFinland", "mediaMetrics"],
  // Insight and strategy.
  "insight-strategia": ["mediaMetrics", "statisticsFinland", "kantar"],
  markkinointistrategia: ["statisticsFinland", "statista", "kantar"],
  "ohjelmallinen-ostaminen": ["iab", "mediaMetrics"],
  // AI and the Engine.
  "ai-optimointi": ["iab", "googleAds", "metaBusiness"],
  tekoalymainonta: ["iab", "googleAds", "metaBusiness"],
  "marketing-engine-alusta": ["googleAds", "metaBusiness", "iab"],
  // Industry pages.
  "markkinointi-terveydenhuolto": ["statisticsFinland", "statista"],
  "markkinointi-kiinteistonvalitys": ["statisticsFinland", "statista"],
  "markkinointi-vahittaiskauppa": ["statisticsFinland", "statista"],
  "markkinointi-autoliikkeet": ["statisticsFinland", "statista"],
  "markkinointi-franchising": ["statisticsFinland", "statista"],
};

const DEFAULT_LINKS: ExternalLinkKey[] = ["mediaMetrics", "iab", "statisticsFinland"];

/** The resolved external links for a service-page slug. */
export function externalLinksFor(slug: string): ExternalLink[] {
  const keys = LINKS_BY_SLUG[slug] ?? DEFAULT_LINKS;
  return keys.map((key) => EXTERNAL_LINKS[key]).filter(Boolean);
}

/** Partner / public-profile links rendered on the About page. */
export const PARTNER_LINKS: ExternalLink[] = [EXTERNAL_LINKS.treKronorMedia, EXTERNAL_LINKS.mediaMetrics, EXTERNAL_LINKS.iab];
