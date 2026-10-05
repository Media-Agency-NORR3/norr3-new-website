import { serializeJsonLd, type JsonLdNode } from "@/lib/jsonld";

/**
 * A `<script type="application/ld+json">` for a page's structured data.
 *
 * Server component. Pass one node or a list; a list becomes one `@graph`
 * (one script per page, so validators see the whole picture at once and
 * `@id` references resolve). Nodes that are `null` are dropped, so callers
 * can pass optional pieces (a FAQPage that may be empty) inline.
 *
 * A native `<script>` rather than next/script: JSON-LD is data, not code,
 * and it belongs in the initial HTML for crawlers.
 */
export function JsonLd({ data }: { data: JsonLdNode | (JsonLdNode | null | undefined)[] }) {
  const nodes = (Array.isArray(data) ? data : [data]).filter((n): n is JsonLdNode => Boolean(n));
  if (nodes.length === 0) return null;
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(nodes) }} />;
}
