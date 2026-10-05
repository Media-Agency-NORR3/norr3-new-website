import { NextResponse } from "next/server";
import { getSiteContent } from "@/lib/cms";
import { insightText, normalizeInsightPath } from "@/content/mediaInsights";
import type { Locale } from "@/i18n/config";

/**
 * The Media Insights ticker's data endpoint.
 *
 * The ticker used to receive all ~137 enabled insights in every page payload
 * and filter them in the browser; this route does the filtering on the server
 * so a page ships at most the six boxes it actually shows. `getSiteContent()`
 * is cached (300 s + tags), so the per-request cost is just the filtering —
 * hence `no-store` on the response: the data is cheap to recompute and must
 * reflect a CMS publish immediately.
 *
 * Semantics match the old component exactly: rail-only rows leave the ticker,
 * a page with no boxes of its own falls back to the home set, cap at six.
 *
 * The locale comes from the path prefix (`/en/...` → en). A row without text
 * in that locale never reaches the ticker — an English page must not scroll a
 * Finnish sentence — and the home fallback is picked from the same filtered
 * set, so an untranslated page falls back to English home boxes, not Finnish.
 */
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const path = new URL(request.url).searchParams.get("path");
  const content = await getSiteContent();
  const target = normalizeInsightPath(path ?? "/");
  const locale: Locale = /^\/en(?=\/|$)/.test((path ?? "").trim()) ? "en" : "fi";
  const ticker = (content.mediaInsights ?? [])
    .filter((i) => i.placement !== "rail")
    .filter((i) => insightText(i, locale) !== "");
  const forPage = ticker.filter((i) => normalizeInsightPath(i.url) === target);
  const home = ticker.filter((i) => normalizeInsightPath(i.url) === "/");
  const items = (forPage.length ? forPage : home).slice(0, 6);
  return NextResponse.json({ items }, { headers: { "Cache-Control": "no-store" } });
}
