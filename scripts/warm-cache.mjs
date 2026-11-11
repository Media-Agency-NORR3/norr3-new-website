#!/usr/bin/env node
/**
 * warm-cache.mjs — render every page of the site once, right after a deploy.
 *
 * WHY
 * ---
 * An ISR page has nothing to serve from until it has been rendered once. Next
 * pre-renders everything in `generateStaticParams` at build time, but the release
 * is published as a symlink swap and the regenerated entries live in the running
 * server, so the first request for any page that is *not* in the build output
 * (an on-demand slug, a page added in the CMS since the last build, a page whose
 * entry expired while the SWR window was still zero) pays the full render. That
 * is what a crawler sees as a 3–8 s TTFB — and a crawler asks for every URL
 * exactly once, so it sees only the cold answer, never the warm one.
 *
 * Running this against the freshly deployed release turns those cold first hits
 * into cache hits before any crawler or visitor arrives:
 *
 *     NORR3_URL=http://localhost:3847 node scripts/warm-cache.mjs
 *
 * The URL list comes from `/sitemap.xml`, so it always matches what the site
 * itself declares — nothing to keep in sync.
 *
 * Flags:
 *   NORR3_URL      base URL to warm (default http://localhost:3847)
 *   CONCURRENCY    parallel requests (default 4)
 *   SLOW_MS        report anything slower than this (default 1000)
 *   WARM_ORIGIN    "1" to resolve the host to 127.0.0.1 (warm the origin behind
 *                  a CDN without touching the CDN copy)
 */

const BASE = (process.env.NORR3_URL || "http://localhost:3847").replace(/\/+$/, "");
const CONCURRENCY = Number(process.env.CONCURRENCY || 4);
const SLOW_MS = Number(process.env.SLOW_MS || 1000);

async function sitemapUrls() {
  const res = await fetch(`${BASE}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap.xml -> ${res.status}`);
  const xml = await res.text();
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  if (locs.length === 0) throw new Error("sitemap.xml lists no <loc> entries");
  return locs;
}

async function warm(url) {
  const started = Date.now();
  try {
    // Read the whole body: the render happens on the first byte here, but an
    // aborted body can leave the entry half-written.
    const res = await fetch(url, { headers: { "user-agent": "norr3-warm-cache" } });
    await res.arrayBuffer();
    const ms = Date.now() - started;
    return { url, status: res.status, ms, cache: res.headers.get("x-nextjs-cache") || "-" };
  } catch (error) {
    return { url, status: 0, ms: Date.now() - started, error: String(error), cache: "-" };
  }
}

async function main() {
  const urls = await sitemapUrls();
  console.log(`Warming ${urls.length} URLs from ${BASE} (concurrency ${CONCURRENCY})\n`);

  const results = [];
  let cursor = 0;
  async function worker() {
    while (cursor < urls.length) {
      const url = urls[cursor++];
      results.push(await warm(url));
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  const failed = results.filter((r) => r.status !== 200);
  const slow = results
    .filter((r) => r.status === 200 && r.ms >= SLOW_MS)
    .sort((a, b) => b.ms - a.ms);
  // Named `times`, not `warm`: a `const warm` here sits in the same scope as the
  // `warm()` helper the worker calls, so the reference inside `worker` hit the
  // variable's temporal dead zone and the script died on its first URL.
  const times = results.filter((r) => r.status === 200).map((r) => r.ms).sort((a, b) => a - b);
  const median = times.length ? times[Math.floor(times.length / 2)] : 0;

  for (const r of slow.slice(0, 15)) {
    console.log(`  cold ${String(r.ms).padStart(5)} ms  ${r.url}`);
  }
  console.log(`\nmedian ${median} ms · slowest ${times[times.length - 1] || 0} ms · ${times.length}/${urls.length} ok`);
  if (failed.length) {
    console.log(`\nFAILED (${failed.length}):`);
    for (const r of failed) console.log(`  ${r.status || "ERR"}  ${r.url}  ${r.error || ""}`);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
