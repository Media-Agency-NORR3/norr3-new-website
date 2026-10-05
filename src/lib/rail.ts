import { insightSource, normalizeInsightPath } from "@/content/mediaInsights";
import { getSiteContent, type CmsMediaInsight, type CmsRailItem } from "@/lib/cms";
import type { Locale } from "@/i18n/config";

/**
 * The right rail on the service pages: feature flag + card selection.
 *
 * Server-side only — this module reads the CMS bundle and must never be
 * imported from a client component.
 */

/**
 * Internal path segment the proxy prefixes when a reviewer on a non-production
 * host asks for `?rail=1`: `/hakukonemainonta?rail=1` is rewritten to
 * `/fi/__rail/hakukonemainonta`. The catch-all page strips it again with
 * `splitRailPreview`. A separate *path* (rather than a query string or a
 * header read) keeps the preview and the real page as two distinct ISR cache
 * entries, so neither the page nor this module has to touch a Request-time API
 * — `headers()` / `searchParams` here used to make every service, case and
 * insight page dynamic and uncacheable.
 */
export const RAIL_PREVIEW_SEGMENT = "__rail";

/** Strip the rail-preview segment off a catch-all slug: `[preview, realSlug]`. */
export function splitRailPreview(slug: string[]): { preview: boolean; slug: string[] } {
  if (slug.length > 1 && slug[0] === RAIL_PREVIEW_SEGMENT) return { preview: true, slug: slug.slice(1) };
  return { preview: false, slug };
}

/**
 * Whether the right rail renders — a layered switch, first match wins:
 *
 *  1. `RIGHT_RAIL_ENABLED=true/1` in the env: the hard-wired master enable
 *     (back-compat). It beats everything, including the CMS — flipping it
 *     still means `.env.local` + restart.
 *  2. the CMS flag `rail_enabled`: the everyday switch, flipped in the CMS
 *     (Settings → flags, or the MCP `cms_flags` tool). It rides in on the
 *     fetched bundle (revalidated every 300 s and expired by the publish
 *     hook), so a flip takes effect without a rebuild, restart or env edit.
 *     CMS unreachable → `flags` is `{}` → off.
 *  3. `preview`: the `?rail=1` staging-only preview. The host check lives in
 *     the proxy (production never rewrites, so norr3.fi ignores the param).
 *
 * Deliberately free of `headers()` / `cookies()`: the pages that call this are
 * ISR-cached, and the flag reaches them through the cached bundle instead.
 */
export async function railEnabled(preview = false): Promise<boolean> {
  const env = (process.env.RIGHT_RAIL_ENABLED ?? "").trim().toLowerCase();
  if (env === "true" || env === "1") return true;
  // The flag lives in the CMS bundle, so consult it (cached like every other
  // getSiteContent read, and deduped with the page's own fetch).
  const flags = (await getSiteContent()).flags;
  if (flags.rail_enabled) return true;
  return preview;
}

/** One rail card: either a Media Insights box or a CMS-composed rail item. */
export type RailCard =
  | { kind: "insight"; insight: CmsMediaInsight }
  | { kind: "item"; item: CmsRailItem };

const GROUP_A_TYPES = new Set(["decision_card", "process"]);
const GROUP_B_TYPES = new Set(["campaign_lesson", "key_number", "table", "good_to_know"]);

/**
 * The image the media box shows in `locale`, trimmed ("" = nothing to show).
 *
 * On EN the row may carry its own English media file — `imageEn`, e.g. a
 * graph whose Finnish words/decimals were redrawn in English. When filled it
 * wins; otherwise — and always on FI — the shared `image` is used. Exported
 * so the gate (`mediaBoxShows`) and the renderer (`RailCards.tsx` →
 * `MediaBox`) resolve to exactly the same file.
 */
export function mediaBoxImage(item: CmsRailItem, locale: Locale): string {
  const imageEn = (item.imageEn ?? "").trim();
  if (locale === "en" && imageEn) return imageEn;
  return (item.image ?? "").trim();
}

/**
 * Whether an item's media box shows in `locale`.
 *
 * The box needs its visibility flag and a non-empty image — as resolved by
 * `mediaBoxImage`, so on EN the row's own `imageEn` counts when filled; on
 * top of that the locale gate never falls back to Finnish — when the FI
 * topic/caption is filled in but the active locale's is empty, the box is
 * hidden in that locale rather than showing a half-translated label.
 * (`toRailItem` already normalises an absent `mediaBoxVisible` — absent +
 * image = visible, the shape the seeded rows shipped in — so `?? true` here
 * only covers hand-built items that skipped parsing.)
 *
 * Exported because the renderer (`RailCards.tsx` → `ItemCard`) must agree
 * with this filter down to the last condition.
 */
export function mediaBoxShows(item: CmsRailItem, locale: Locale): boolean {
  if (!(item.mediaBoxVisible ?? true)) return false;
  if (!mediaBoxImage(item, locale)) return false;
  const fiTopic = (item.mediaTopic?.fi ?? "").trim();
  if (fiTopic && !(item.mediaTopic?.[locale] ?? "").trim()) return false;
  const fiCaption = (item.mediaCaption?.fi ?? "").trim();
  if (fiCaption && !(item.mediaCaption?.[locale] ?? "").trim()) return false;
  return true;
}

/**
 * Whether an item's text box shows in `locale`: the flag on (absent → on)
 * AND something to say — title, body or a non-empty list in that locale, so
 * Finnish copy never leaks onto the EN page (or vice versa).
 */
export function textBoxShows(item: CmsRailItem, locale: Locale): boolean {
  if (!(item.textBoxVisible ?? true)) return false;
  const title = (item.title?.[locale] ?? "").trim();
  const body = (item.body?.[locale] ?? "").trim();
  const list = (item.items?.[locale] ?? []).some((entry) => entry?.trim());
  return Boolean(title) || Boolean(body) || list;
}

/**
 * Pick the (at most three) cards the right rail shows on `path`.
 *
 * Pure — all data comes in through `opts`. Order: decision/process items
 * first, then up to two rail-placed Media Insights, then the lighter item
 * types; the whole rail is capped at three cards.
 */
export function buildRail(opts: {
  path: string;
  locale: Locale;
  insights: CmsMediaInsight[];
  items: CmsRailItem[];
}): RailCard[] {
  const target = normalizeInsightPath(opts.path);
  const locale = opts.locale;

  // Insights: rail-placed rows for this page, ordered by priority. The bundle
  // is already ordered url → priority → position → id, and Array#sort is
  // stable, so sorting on priority alone keeps the CMS order within a level.
  const insightCards: RailCard[] = (opts.insights ?? [])
    .filter((insight) => insight.placement === "rail" || insight.placement === "both")
    .filter((insight) => normalizeInsightPath(insight.url) === target)
    .sort((a, b) => a.priority - b.priority)
    // Locale gate — on EN, never fall back to Finnish: a row without English
    // text is hidden rather than half-translated. The source line counts when
    // `insightSource` can say it in English (an editor's `source_en`, or the
    // boilerplate Finnish line rendered in English — see mediaInsights.ts).
    .filter((insight) =>
      locale === "en"
        ? Boolean(insight.text?.en?.trim()) && Boolean(insightSource(insight, "en"))
        : Boolean(insight.text?.fi?.trim())
    )
    .slice(0, 2)
    .map((insight) => ({ kind: "insight" as const, insight }));

  // Items: rows for this page with at least one box to show in the active
  // locale — the media box (visible + image + locale-complete topic/caption)
  // or the text box (visible + title/body/list in that locale). An item whose
  // boxes are both hidden here is dropped before ordering, so the renderer
  // never receives an empty card.
  const visibleItems = (opts.items ?? [])
    .filter((item) => normalizeInsightPath(item.url) === target)
    .filter((item) => mediaBoxShows(item, locale) || textBoxShows(item, locale));

  const byPositionThenId = (a: CmsRailItem, b: CmsRailItem) => a.position - b.position || a.id - b.id;
  const groupA = visibleItems.filter((item) => GROUP_A_TYPES.has(item.type)).sort(byPositionThenId);
  const groupB = visibleItems.filter((item) => GROUP_B_TYPES.has(item.type)).sort(byPositionThenId);

  return [
    ...groupA.map((item) => ({ kind: "item" as const, item })),
    ...insightCards,
    ...groupB.map((item) => ({ kind: "item" as const, item })),
  ].slice(0, 3);
}
