import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { isProductionHost } from "@/lib/host";

/**
 * The AI / answer-engine crawlers we explicitly welcome. `*` already allows
 * them, but naming them keeps the policy legible to the people who audit it and
 * makes a future accidental block visible in the diff. Note `Google-Extended`,
 * `Applebot-Extended` and `CCBot` gate AI training and grounding rather than
 * classic search indexing — allowing them is the deliberate choice here.
 */
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "Perplexity-User",
  "ClaudeBot",
  "Claude-User",
  "anthropic-ai",
  "Google-Extended",
  "Applebot-Extended",
  "meta-externalagent",
  "Amazonbot",
  "DuckAssistBot",
  "MistralAI-User",
  "cohere-ai",
  "YouBot",
  "CCBot",
];

/**
 * Production host only. Anything else — the raw VPS IP, a staging subdomain, a
 * preview URL — must never be indexed, or Google picks up a duplicate of the
 * site before the DNS cutover and we ship a half-indexed launch.
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const h = await headers();
  const host = h.get("host");

  if (!isProductionHost(host)) {
    // Staging / preview / raw IP: block everything and do not advertise the
    // production sitemap from a non-production host.
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Tool surfaces, not content: the JSON APIs and the CMS draft preview
        // (which is also noindexed in its own metadata).
        disallow: ["/api/", "/cms-preview/"],
      },
      // Answer engines and AI crawlers, named explicitly so the intent is on
      // record and a future blanket rule cannot silently cut the agency out of
      // AI answers. All of them are welcome on the public pages; only the API
      // and the draft-preview surface stay closed.
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: ["/api/", "/cms-preview/"],
      })),
    ],
    sitemap: "https://norr3.fi/sitemap.xml",
  };
}
