#!/usr/bin/env node
/**
 * Redirect-chain and broken-link crawl of the running site.
 *
 *   node scripts/crawl-links.mjs [--base http://localhost:3847] [--host norr3.fi]
 *                                [--external] [--images] [--json out.json]
 *
 * Starts at `/` and `/en`, follows every internal link it finds in the HTML
 * (`a[href]`, `link[rel=canonical|alternate]`, optionally `img[src]`), adds the
 * URLs from `/sitemap.xml`, and records each URL's status and redirect hops.
 * Nothing is executed — the HTML is scanned with regexes, so client-side-only
 * links are not seen. Reports:
 *
 *   - 404s and 5xx (with the pages that link to them)
 *   - redirect chains (more than one hop) and redirects that end in an error
 *   - internal links that point at a redirect instead of the final URL
 *   - with --external: every unique external link HEAD-checked once
 *
 * The `Host` header defaults to norr3.fi so robots/host logic behaves like
 * production even when the crawl targets the local port.
 */

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : fallback;
};
const flag = (name) => args.includes(`--${name}`);

const BASE = opt("base", "http://localhost:3847").replace(/\/$/, "");
const HOST = opt("host", "norr3.fi");
const PUBLIC_ORIGIN = `https://${HOST}`;
const CHECK_EXTERNAL = flag("external");
const CHECK_IMAGES = flag("images");
const JSON_OUT = opt("json", "");
const CONCURRENCY = Number(opt("concurrency", "6"));
const UA = "Mozilla/5.0 (compatible; norr3-link-crawler/1.0; +https://norr3.fi)";

/** Public-origin absolute URL → path on the crawl target; null when not ours. */
function toInternalPath(href, fromPath) {
  if (!href || href.startsWith("#") || /^(mailto|tel|javascript|data|sms):/i.test(href)) return null;
  let url;
  try {
    url = new URL(href, `${PUBLIC_ORIGIN}${fromPath}`);
  } catch {
    return null;
  }
  const host = url.host.replace(/^www\./, "");
  const baseHost = new URL(BASE).host;
  if (host !== HOST && url.host !== baseHost) return { external: url.href };
  if (url.pathname.startsWith("/_next/")) return null;
  return { path: url.pathname + url.search, hash: url.hash };
}

function decode(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&#x2F;/g, "/")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"');
}

/** Every href/src we care about, with the tag it came from. */
function extractLinks(html) {
  const found = [];
  const attr = (tag, re) => {
    for (const m of html.matchAll(re)) found.push({ tag, href: decode(m[1]) });
  };
  attr("a", /<a\b[^>]*?\shref=["']([^"']+)["']/gi);
  for (const m of html.matchAll(/<link\b[^>]*>/gi)) {
    const tag = m[0];
    const rel = /\srel=["']([^"']+)["']/i.exec(tag)?.[1] ?? "";
    const href = /\shref=["']([^"']+)["']/i.exec(tag)?.[1];
    if (href && /canonical|alternate/i.test(rel)) found.push({ tag: `link[rel=${rel}]`, href: decode(href) });
  }
  if (CHECK_IMAGES) {
    attr("img", /<img\b[^>]*?\ssrc=["']([^"']+)["']/gi);
    for (const m of html.matchAll(/<meta\b[^>]*?property=["']og:image["'][^>]*?content=["']([^"']+)["']/gi)) {
      found.push({ tag: "og:image", href: decode(m[1]) });
    }
  }
  return found;
}

async function fetchOnce(url, method = "GET") {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 20_000);
  try {
    const res = await fetch(url, {
      method,
      redirect: "manual",
      headers: { Host: HOST, "User-Agent": UA, Accept: "text/html,*/*" },
      signal: controller.signal,
    });
    const status = res.status;
    const location = res.headers.get("location");
    const type = res.headers.get("content-type") ?? "";
    let body = "";
    if (method === "GET" && status >= 200 && status < 300 && /text\/html|xml/.test(type)) body = await res.text();
    else await res.arrayBuffer().catch(() => {});
    return { status, location, type, body };
  } catch (err) {
    return { status: 0, error: err?.name === "AbortError" ? "timeout" : String(err?.message ?? err) };
  } finally {
    clearTimeout(t);
  }
}

/** Follow redirects manually so every hop is recorded. */
async function resolve(path) {
  const hops = [];
  let current = path;
  let last;
  for (let i = 0; i < 10; i++) {
    last = await fetchOnce(`${BASE}${current}`);
    if (last.status >= 300 && last.status < 400 && last.location) {
      const next = new URL(last.location, `${PUBLIC_ORIGIN}${current}`);
      const nextPath = next.host.replace(/^www\./, "") === HOST || next.host === new URL(BASE).host
        ? next.pathname + next.search
        : next.href;
      hops.push({ from: current, status: last.status, to: nextPath });
      if (nextPath.startsWith("http")) return { path, hops, final: nextPath, status: last.status, external: true };
      current = nextPath;
      continue;
    }
    break;
  }
  return { path, hops, final: current, status: last.status, type: last.type, body: last.body, error: last.error };
}

async function main() {
  const queue = ["/", "/en"];
  const seen = new Set(queue);
  const results = new Map(); // path → resolve() result
  const referrers = new Map(); // path → Set("fromPath tag")
  const external = new Map(); // href → Set(fromPath)

  const addRef = (path, from, tag) => {
    if (!referrers.has(path)) referrers.set(path, new Set());
    referrers.get(path).add(`${from} (${tag})`);
  };
  const enqueue = (path, from, tag) => {
    addRef(path, from, tag);
    if (!seen.has(path)) {
      seen.add(path);
      queue.push(path);
    }
  };

  // Sitemap URLs are seeds too.
  const sitemap = await resolve("/sitemap.xml");
  if (sitemap.body) {
    for (const m of sitemap.body.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      const link = toInternalPath(m[1].trim(), "/sitemap.xml");
      if (link?.path) enqueue(link.path, "/sitemap.xml", "sitemap");
    }
    for (const m of sitemap.body.matchAll(/<xhtml:link[^>]*href="([^"]+)"/g)) {
      const link = toInternalPath(m[1].trim(), "/sitemap.xml");
      if (link?.path) enqueue(link.path, "/sitemap.xml", "sitemap-alternate");
    }
  } else {
    console.error(`sitemap.xml: ${sitemap.status}`);
  }

  let active = 0;
  await new Promise((done) => {
    const pump = () => {
      while (active < CONCURRENCY && queue.length) {
        const path = queue.shift();
        active++;
        resolve(path)
          .then((r) => {
            results.set(path, r);
            if (r.body && /text\/html/.test(r.type ?? "")) {
              for (const { tag, href } of extractLinks(r.body)) {
                const link = toInternalPath(href, r.final);
                if (!link) continue;
                if (link.external) {
                  if (!external.has(link.external)) external.set(link.external, new Set());
                  external.get(link.external).add(path);
                } else enqueue(link.path, path, tag);
              }
            }
          })
          .finally(() => {
            active--;
            if (!queue.length && active === 0) done();
            else pump();
          });
      }
    };
    pump();
  });

  // ── Findings ─────────────────────────────────────────────────────────────
  const broken = [];
  const chains = [];
  const linksToRedirect = [];
  for (const [path, r] of results) {
    const refs = [...(referrers.get(path) ?? [])];
    if (r.status === 0 || r.status === 404 || r.status >= 500) broken.push({ path, status: r.status, error: r.error, final: r.final, refs });
    if (r.hops.length > 1) chains.push({ path, hops: r.hops, finalStatus: r.status });
    if (r.hops.length >= 1 && r.status !== 200) chains.push({ path, hops: r.hops, finalStatus: r.status, note: "redirect ends in non-200" });
    if (r.hops.length >= 1) {
      const pageRefs = refs.filter((x) => !x.startsWith("/sitemap.xml"));
      if (pageRefs.length) linksToRedirect.push({ path, final: r.final, status: r.status, refs: pageRefs });
    }
  }

  const externalFindings = [];
  if (CHECK_EXTERNAL) {
    const hrefs = [...external.keys()];
    let i = 0;
    await Promise.all(
      Array.from({ length: CONCURRENCY }, async () => {
        while (i < hrefs.length) {
          const href = hrefs[i++];
          let res = await fetchExternal(href, "HEAD");
          if (res.status === 405 || res.status === 403 || res.status === 0) res = await fetchExternal(href, "GET");
          if (!(res.status >= 200 && res.status < 400)) externalFindings.push({ href, status: res.status, error: res.error, refs: [...external.get(href)] });
        }
      })
    );
  }

  const summary = {
    base: BASE,
    host: HOST,
    crawled: results.size,
    ok: [...results.values()].filter((r) => r.status === 200 && r.hops.length === 0).length,
    broken,
    chains,
    linksToRedirect,
    externalChecked: CHECK_EXTERNAL ? external.size : 0,
    externalFindings,
  };

  console.log(`Crawled ${summary.crawled} internal URLs on ${BASE} (Host: ${HOST}); ${summary.ok} answered 200 directly.`);
  section("Broken (0/404/5xx)", broken, (b) => `${b.status || b.error}  ${b.path}${b.final !== b.path ? `  → ${b.final}` : ""}\n      linked from: ${b.refs.slice(0, 5).join(", ") || "(seed)"}`);
  section("Redirect chains / redirects ending in non-200", chains, (c) => `${c.path}  ${c.hops.map((h) => `${h.status}→ ${h.to}`).join("  ")}  [${c.finalStatus}]${c.note ? `  ${c.note}` : ""}`);
  section("Internal links that point at a redirect", linksToRedirect, (l) => `${l.path}  →  ${l.final} [${l.status}]\n      linked from: ${l.refs.slice(0, 6).join(", ")}`);
  if (CHECK_EXTERNAL) section(`External links not 2xx/3xx (${external.size} checked)`, externalFindings, (e) => `${e.status || e.error}  ${e.href}\n      linked from: ${e.refs.slice(0, 4).join(", ")}`);

  if (JSON_OUT) {
    const { writeFile } = await import("node:fs/promises");
    await writeFile(JSON_OUT, JSON.stringify({ ...summary, urls: [...results.values()].map((r) => ({ ...r, body: undefined })) }, null, 2));
    console.log(`\nFull results written to ${JSON_OUT}`);
  }
  process.exitCode = broken.length || chains.length ? 1 : 0;
}

async function fetchExternal(href, method) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 15_000);
  try {
    const res = await fetch(href, { method, redirect: "follow", headers: { "User-Agent": UA, Accept: "*/*" }, signal: controller.signal });
    await res.arrayBuffer().catch(() => {});
    return { status: res.status };
  } catch (err) {
    return { status: 0, error: err?.name === "AbortError" ? "timeout" : String(err?.cause?.code ?? err?.message ?? err) };
  } finally {
    clearTimeout(t);
  }
}

function section(title, items, fmt) {
  console.log(`\n## ${title}: ${items.length}`);
  for (const item of items) console.log(`  - ${fmt(item)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
