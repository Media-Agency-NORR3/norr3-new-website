import type { Locale } from "@/i18n/config";

/**
 * Narrative copy as HTML.
 *
 * The CMS delivers case sections as sanitised rich text; the bundled fallback
 * content in `src/content/cases.ts` is still plain prose. Both render through
 * `dangerouslySetInnerHTML`, so the plain variety is wrapped in paragraphs
 * here — the same rule the CMS applies before it sends anything.
 */
export function proseHtml(value: string | null | undefined): string {
  const text = String(value ?? "").trim();
  if (!text) return "";
  if (/<[a-z][^>]*>/i.test(text)) return text;
  return text
    .split(/\n\s*\n|\r\n\s*\r\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => `<p>${escapeHtml(block).replace(/\r?\n/g, "<br />")}</p>`)
    .join("");
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Wrap every `<table>` in a horizontally scrollable region.
 *
 * Data tables in articles are wider than a phone, and scrolling the table
 * itself (`display: block`) costs it its table semantics in some screen
 * readers. The wrapper scrolls instead; `tabindex` lets keyboard users scroll
 * it and the label tells assistive tech what the region holds — the table's
 * caption when it has one. Runs on HTML the CMS has already sanitised, which
 * never nests tables.
 */
export function wrapTables(html: string, locale: Locale): string {
  if (!html.includes("<table")) return html;
  const fallback = locale === "fi" ? "Taulukko" : "Table";
  return html.replace(/<table\b[\s\S]*?<\/table>/gi, (table) => {
    const caption = /<caption[^>]*>([\s\S]*?)<\/caption>/i.exec(table)?.[1] ?? "";
    const label = caption.replace(/<[^>]*>/g, "").replace(/"/g, "&quot;").replace(/\s+/g, " ").trim() || fallback;
    return `<div class="prose-table" role="region" tabindex="0" aria-label="${label}">${table}</div>`;
  });
}
