import type { CmsMediaInsight, SiteContent } from "@/lib/cms";
import type { Locale } from "@/i18n/config";

/**
 * Reading helpers for the CMS-managed Media Insights boxes ("huomiopallo").
 *
 * The CMS publishes only enabled rows, already ordered by url → priority →
 * position, so all that is left here is matching a box to the page being
 * rendered and picking the right locale.
 *
 * Locale rule: the Finnish text is the workbook's master copy, but an English
 * page never shows it — a Finnish sentence in the English ticker or rail is
 * worse than no box (Michael, Sept 2026: "the bottom bar keeps the Finnish
 * text"). `text_en` is filled on every row today; when a new row lands
 * without it, the row simply stays off the EN pages until it is translated.
 * The source line is the one exception: it is boilerplate ("Lähde: NØRR3
 * Media Insights / Norstat, elokuu 2026, n = 2 022") that `source_en` never
 * carries, so EN derives it from the Finnish line word for word.
 */

/** Strip the /fi or /en prefix and any trailing slash so a box's url matches
 *  the locale-relative path a page is rendered at. "/" stays "/". */
export function normalizeInsightPath(path: string): string {
  let p = (path || "/").trim();
  p = p.replace(/^\/(?:fi|en)(?=\/|$)/, "");
  if (p.length > 1) p = p.replace(/\/+$/, "");
  return p || "/";
}

/** Every enabled insight box suggested for `path`, in publish order. */
export function mediaInsightsFor(content: SiteContent, path: string): CmsMediaInsight[] {
  const target = normalizeInsightPath(path);
  return (content.mediaInsights ?? [])
    .filter((insight) => normalizeInsightPath(insight.url) === target)
    .sort((a, b) => a.priority - b.priority);
}

/** Locale-aware box text. Empty on EN when the row has no English text. */
export function insightText(insight: CmsMediaInsight, locale: Locale): string {
  const value = locale === "en" ? insight.text?.en : insight.text?.fi;
  return (value ?? "").trim();
}

/**
 * Locale-aware source line. EN uses `source_en` when the editor filled it and
 * otherwise an English rendering of the Finnish line — the label, the month
 * and the "rounds" word are the only Finnish in it, the rest is names and
 * numbers.
 */
export function insightSource(insight: CmsMediaInsight, locale: Locale): string {
  const fi = (insight.source?.fi ?? "").trim();
  if (locale !== "en") return fi;
  const en = (insight.source?.en ?? "").trim();
  return en || translateSourceLine(fi);
}

const FI_MONTHS: Record<string, string> = {
  tammikuu: "January",
  helmikuu: "February",
  maaliskuu: "March",
  huhtikuu: "April",
  toukokuu: "May",
  kesäkuu: "June",
  heinäkuu: "July",
  elokuu: "August",
  syyskuu: "September",
  lokakuu: "October",
  marraskuu: "November",
  joulukuu: "December",
};

/** "Lähde: …, elokuu 2026, kierrokset 7–9, n = 2 022" → "Source: …, August 2026, rounds 7–9, n = 2 022". */
export function translateSourceLine(source: string): string {
  return source
    .replace(/^Lähde:/i, "Source:")
    .replace(/\bkierrokset\b/gi, "rounds")
    .replace(/\bkierros\b/gi, "round")
    .replace(/\b([a-zäö]+kuu)(ta)?\b/gi, (match, stem: string) => FI_MONTHS[stem.toLowerCase()] ?? match);
}