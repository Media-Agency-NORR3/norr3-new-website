import type { Locale } from "@/i18n/config";
import type { CaseStudy } from "@/content/cases";

/**
 * Case-page SEO text. Both the route's `generateMetadata` and the page's
 * JSON-LD read these, so the <title> and the structured-data name never
 * disagree.
 *
 * The old title was `${client} — NØRR3-case`: 17–22 characters on the real
 * cases, which Google padded with the client name alone and which said nothing
 * about the work. The shape is now `${client}: ${tagline} | NØRR3` — the case's
 * own words, never invented copy.
 */

/** What Google renders before it truncates a <title>, give or take. */
const TITLE_BUDGET = 60;
/** The part that must survive truncation untouched. */
const BRAND_SUFFIX = " | NØRR3";

/** Cut at a word boundary and never dangle punctuation before the ellipsis. */
function truncateWords(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const space = cut.lastIndexOf(" ");
  const head = space > Math.floor(max * 0.55) ? cut.slice(0, space) : cut;
  return `${head.replace(/[,;:\-–—]\s*$/, "")}…`;
}

/**
 * `${client}: ${tagline} | NØRR3`, trimmed to ~60 characters on a word
 * boundary. A case with no tagline still gets a usable title.
 */
export function caseTitle(study: CaseStudy, locale: Locale): string {
  const client = (study.client ?? "").replace(/\s+/g, " ").trim();
  const tagline = (study.tagline?.[locale] ?? "").replace(/\s+/g, " ").trim();
  const head = tagline ? `${client}: ${tagline}` : client;
  return `${truncateWords(head, TITLE_BUDGET - BRAND_SUFFIX.length)}${BRAND_SUFFIX}`;
}

/**
 * A case page's meta description. The card `tagline` is a headline — 16–47
 * characters on the real cases — and on its own it is too thin: Google filled
 * the gap by scraping the footer's address / phone / business-ID block into the
 * sitelink. Compose tagline + summary (both the case's own copy, never invented)
 * and trim to ≤155 chars on a word boundary. The fallback can never dangle.
 */
export function caseDescription(study: CaseStudy, locale: Locale): string {
  const parts = [study.tagline?.[locale], study.summary?.[locale]]
    .map((p) => (p ?? "").replace(/\s+/g, " ").trim())
    .filter(Boolean);
  let text = parts.join(" — ");
  // Drop a summary that just restates the tagline.
  if (parts.length === 2 && parts[1].toLowerCase().startsWith(parts[0].toLowerCase().slice(0, 24))) {
    text = parts[1];
  }
  if (text.length > 155) {
    const cut = text.slice(0, 155);
    const space = cut.lastIndexOf(" ");
    text = (space > 100 ? cut.slice(0, space) : cut).replace(/[,;:\-–—]\s*$/, "") + "…";
  }
  return text || `${study.client} — NØRR3 case study.`;
}
