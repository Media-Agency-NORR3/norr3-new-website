# Cloudflare cache rules for the website HTML

Date: 2026-11-11 · owner: Wael Helmi · status: **manual change, not in code**

## Why this file exists

The site is ISR-cached at the origin, but Cloudflare does not cache HTML by
default: every request for a page — a visitor's, and every single request from a
crawler — reaches the VPS (`cf-cache-status: DYNAMIC`). The origin answers a cache
hit in 50–150 ms, so the audit finding ("TTFB median 0.59 s, worst 3.9–4.7 s, 82
slow pages") is not about the origin being slow; it is about *every* request
paying a round trip to Helsinki, and the first request after an ISR entry expires
paying for the render as well.

Two things had to be true for this to be the only remaining fix:

1. **Origin side (in code, this PR):** `expireTime` was equal to `revalidate`, so
   the stale-while-revalidate window was zero — an expired page blocked on a full
   re-render instead of serving stale. Fixed in `next.config.ts`.
2. **Edge side (manual, this document):** Cloudflare must be told to cache HTML.

## The rule

**Rules → Cache Rules → Create rule**, name `norr3 HTML cache`.

Cache eligibility: **Eligible for cache**

Expression:

```
(http.host eq "norr3.fi" and
 not starts_with(http.request.uri.path, "/api/") and
 not starts_with(http.request.uri.path, "/brief") and
 not starts_with(http.request.uri.path, "/en/brief") and
 not starts_with(http.request.uri.path, "/cms-preview") and
 not starts_with(http.request.uri.path, "/en/cms-preview") and
 not starts_with(http.request.uri.path, "/case-preview") and
 not starts_with(http.request.uri.path, "/en/case-preview") and
 not starts_with(http.request.uri.path, "/seo-report") and
 not starts_with(http.request.uri.path, "/en/seo-report") and
 not http.request.headers["rsc"][0] exists and
 not http.cookie contains "norr3-cms-session" and
 not http.cookie contains "norr3-draft-")
```

Settings:

| Setting | Value | Why |
| --- | --- | --- |
| Edge TTL | **Override origin — 600 s** | A CMS publish expires Next's ISR entry, but nothing purges Cloudflare, so without an override a page would sit at the edge until its own TTL ran out. 600 s caps that staleness at ten minutes. |
| Browser TTL | Respect origin | The origin sends `max-age=0` for HTML; browsers must always revalidate. |
| Cache key | Default (path + query) | Query strings stay part of the key — `?utm_*` traffic then shares one cached copy per URL, and `__rail` previews keep their own entry. |

Two conditions carry the weight:

- **`not http.request.headers["rsc"][0] exists`** — Next's client-side navigation
  fetches the same URL with an `rsc: 1` header and expects an RSC payload, not
  HTML. Cloudflare does not honour the origin's `Vary: rsc` header, so without
  this condition a cached HTML response could be handed to a navigation request
  (and the RSC payload to a page view).
- **the cookie checks** — the CMS session cookie (`norr3-cms-session`) renders
  draft previews, and `norr3-draft-*` unlocks a single previewed item. Those
  responses must never be cached or shared.

Dynamic on purpose, still excluded: `/api/*`, `/brief` (form), `/cms-preview`,
`/case-preview`, `/seo-report` (password-gated competitor report, also
`private, no-store` from the origin).

Do **not** touch Email Address Obfuscation — it stays on (spam decision).

## Verify after enabling

```bash
# first request: MISS, then the edge answers in a few ms
curl -sI https://norr3.fi/ai-optimointi | grep -i cf-cache-status   # MISS
curl -sI https://norr3.fi/ai-optimointi | grep -i cf-cache-status   # HIT
curl -o /dev/null -s -w '%{time_starttransfer}\n' https://norr3.fi/ai-optimointi
```

Expect `cf-cache-status: HIT` and a TTFB in the tens of milliseconds on the
second and later requests. Then re-run the Ahrefs crawl.

## Proposal (NOT implemented — needs approval)

### Purge Cloudflare on CMS publish

Today a publish posts to the website's `/api/revalidate`, which expires Next's
ISR entry. The edge still holds the old HTML for up to the 600 s Edge TTL, so a
freshly published page can be up to ten minutes stale for visitors. Pairing the
revalidate with a targeted purge removes that window entirely.

Design:

1. **Secret:** the Cloudflare API token lives only on the server, in the same
   place as the other credentials — e.g. `/root/secrets/cloudflare-purge.env`:

   ```
   CF_ZONE_ID=<zone id of norr3.fi>
   CF_API_TOKEN=<token, permission "Zone → Cache Purge → Purge">
   ```

   Never in the repo, never in the CMS UI, never in a log line. The website
   reads it in the route handler only.

2. **CMS sends paths, not tags.** `/api/revalidate` currently receives cache tags
   (`cms:posts`, …). Tags cannot be mapped to URLs reliably (one post tag covers
   every post), so the CMS should add the affected paths it already knows:

   ```json
   { "tags": ["cms:posts"], "paths": ["/uusi-artikkeli", "/en/new-article"] }
   ```

3. **Website handler purges those URLs** after the tag revalidation:

   ```ts
   // src/app/api/revalidate/route.ts (sketch)
   const { CF_ZONE_ID, CF_API_TOKEN } = process.env;
   if (paths.length && CF_ZONE_ID && CF_API_TOKEN) {
     await fetch(`https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/purge_cache`, {
       method: "POST",
       headers: { Authorization: `Bearer ${CF_API_TOKEN}`, "Content-Type": "application/json" },
       body: JSON.stringify({ files: paths.map((p) => `https://norr3.fi${p}`) }),
       // Purge must not fail the publish: log and continue.
     });
   }
   ```

   Fallback for a publish that touches many pages (menus, dictionary, theme):
   purge everything with `{"purge_everything": true}` — a full purge costs a
   colder first hit on every URL, so it is worth doing only for site-wide edits.

4. **Opt-in:** behind an env flag (`CF_PURGE=1`), off until the token exists, so
   a missing secret degrades to today's behaviour instead of erroring.

Not implemented because it needs the token (an access decision) and a CMS-side
change (a second PR in `norr3-cms`).

### Publish scheduled posts on time

`revalidate` on the content routes is 3600 s, so a post scheduled for a future
`published_at` becomes visible within the hour (the CMS already returns scheduled
posts whose `published_at` has passed — `lib/public-content.ts`). To make that
exact rather than "within the hour", the CMS needs a one-minute scheduler that
fires `revalidateSite([TAGS.posts])` when a row's `published_at` arrives. Not
implemented — see the PR description for the details.
