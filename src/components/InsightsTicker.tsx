"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/Icon";
import type { CmsMediaInsight } from "@/lib/cms";
import type { Locale } from "@/i18n/config";
import { insightText } from "@/content/mediaInsights";

/**
 * A slim, always-visible strip pinned to the bottom of the viewport that lets
 * the page's Media Insights figures slide past (a marquee), replacing the old
 * in-page insight card sections.
 *
 * The items come from `/api/insights?path=…`, which filters server-side (page
 * boxes, home fallback, max six) so no page ships the full insight list in its
 * payload. Results are cached per path in a ref, so client-side navigation
 * back to a visited page doesn't refetch. The ticker is decorative: while
 * loading, on error or when empty it renders nothing at all.
 */

function normalize(path: string): string {
  let p = (path || "/").trim();
  p = p.replace(/^\/(?:fi|en)(?=\/|$)/, "");
  if (p.length > 1) p = p.replace(/\/+$/, "");
  return p || "/";
}

function nbspNumbers(value: string): string {
  return value.replace(/(\d) (?=\d)/g, "$1\u00A0");
}

export function InsightsTicker({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const cache = useRef(new Map<string, CmsMediaInsight[]>());
  const [items, setItems] = useState<CmsMediaInsight[]>([]);

  useEffect(() => {
    const key = normalize(pathname);
    const cached = cache.current.get(key);
    if (cached) {
      setItems(cached);
      return;
    }
    let cancelled = false;
    // Hidden while loading — the ticker must never flash the previous page's
    // figures. The route normalizes the path itself, so pass it raw.
    setItems([]);
    fetch(`/api/insights?path=${encodeURIComponent(pathname)}`)
      .then((res) => (res.ok ? res.json() : { items: [] }))
      .then((data: { items?: CmsMediaInsight[] }) => {
        const next = Array.isArray(data?.items) ? data.items : [];
        cache.current.set(key, next);
        if (!cancelled) setItems(next);
      })
      .catch(() => {
        // Fail silent — a decorative strip never surfaces an error.
        cache.current.set(key, []);
        if (!cancelled) setItems([]);
      });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  if (!items.length) return null;

  const row = (
    <div className="flex shrink-0 items-center">
      <span className="flex items-center gap-2 whitespace-nowrap px-5 py-3">
        <Icon name="insights" className="text-[16px] text-[#F6FF4F]" />
        <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/60">
          Media Insights
        </span>
      </span>
      {items.map((insight) => {
        // The route already filtered on locale; an empty string here would be
        // a cached payload from before it did, and it must not leave a bare number.
        const text = insightText(insight, locale);
        if (!text) return null;
        return (
          <span key={insight.id} className="flex items-center gap-2.5 whitespace-nowrap px-5 py-3">
            <span className="text-sm font-medium tabular-nums tracking-tight text-[#F6FF4F]">
              {nbspNumbers((insight.bigNumber || "").trim())}
            </span>
            <span className="text-sm text-white/80">{nbspNumbers(text)}</span>
            <span aria-hidden className="ml-3 h-4 w-px bg-white/20" />
          </span>
        );
      })}
    </div>
  );

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[65] overflow-hidden border-t border-white/10 bg-ink"
      style={{ ["--marquee-duration" as string]: "45s" }}
      aria-label="Media Insights"
    >
      <div className="marquee-track items-center">
        {row}
        {row}
      </div>
    </div>
  );
}
