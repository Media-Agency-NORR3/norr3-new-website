# NØRR3 — norr3.fi

The marketing site for **NØRR3** (NORR3 Oy), a Nordic insight and media agency in Helsinki.
Bilingual (Finnish / English), fully static, and built to the NØRR3 brand guidelines.

## Stack

| Concern    | Choice |
| ---------- | ------ |
| Framework  | Next.js 16 (App Router, React 19, TypeScript) |
| Styling    | Tailwind CSS v4 — CSS-first config in `src/app/globals.css` (`@theme inline`), no `tailwind.config.js` |
| Motion     | Framer Motion (reveals, staggers, chart bars) + GSAP (hover lift, parallax) + Lenis (smooth scroll) |
| Icons      | Google Material Symbols — **outlined only**, via the `material-symbols` package |
| Typeface   | Host Grotesk, self-hosted through `next/font` |
| i18n       | Hand-rolled dictionary keyed by locale (`next-intl` is installed but routing/copy is local) |
| Content    | NØRR3 CMS on port 3848 — see [Content](#content) below; `src/content/*` is the fallback |

## Commands

```bash
npm install
npm run dev     # dev server on http://localhost:3000 (redirects / → /fi)
npm run build   # production build — must pass clean before any commit
npm run start   # serve the production build
npm run lint    # eslint (eslint-config-next)
```

## Structure

```
src/
  app/
    layout.tsx              root shell: fonts, metadata, pre-hydration theme script
    globals.css             Tailwind v4 entry — brand tokens, dark variant, keyframes
    page.tsx                / → redirects to the default locale
    [locale]/
      layout.tsx            nav, footer, announcement bar, cookie consent, smooth scroll
      page.tsx              home
      services/  engine/  cases/  team/  insights/  contact/
      privacy/  terms/      legal pages (see the note below)
  components/               presentational + motion components
    cards/                  ServiceCard, CaseCard, BlogCard, BenefitCard, TeamMemberCard, CultureCard
    marquee/                LogoStrip, PillMarquee, HighlightsBand
    simulator/              MediaMixSimulator (Engine page)
  content/                  all copy and data: dictionary.ts, cases, insights, team, services, channels
  i18n/config.ts            locale list + guard
  lib/dictionary.ts         getDictionary(locale)
public/images/brand/        real photography and OG images
```

Pages are server components; anything with state, motion hooks or browser APIs is
a `"use client"` component under `src/components/`.

## Brand

The design system is the NØRR3 brand bible; the short version:

The design system is **editable from the CMS at runtime**. `globals.css` declares
the theme with plain `@theme` (not `@theme inline`) so every utility compiles to
`var(--color-purple)` rather than a baked `#7a06d3`; `ThemeStyle` in the root
layout emits a `:root` block for whatever the CMS has customised, and an
unlayered rule beats Tailwind's `@layer theme` without needing `!important`.
Colours, the dark theme, `--radius-card`, card padding/gap and the type scale are
all reachable from CMS → Design. Anything untouched there injects nothing.

- **Colours are Tailwind tokens, never raw hex in JSX.** Defined in `globals.css`:
  `purple` (#7a06d3, the primary — links and accents), `violet` (dark sections and
  icon tiles), `light-purple` / `pastel-purple` (card tints), `grey`, `ink` (black
  framing, body text, primary buttons), `offwhite`. `yellow` and `lime` are
  **saturated accents** — index numbers, icon tiles and infographics only, never
  general decoration. The `accent-*` colours exist for categorical data-viz.
- **Type:** Host Grotesk only. Medium (500) for headlines and stats, Regular (400)
  for body and labels. Scale tokens: `text-display` 120px, `text-stat` 110px,
  `text-h3` 40px, `text-h4` 26px; body 15–18px.
- **Cards:** `rounded-[25px]` (token: `--radius-card`), 36px padding, 26px gaps,
  alternating pastel-purple / light-purple tints. Icon tiles are square-ish with a
  5px radius, violet background + white icon (or yellow + black on service cards).
- **Buttons** (`PillButton`): primary = solid `ink` pill with a white uppercase
  label, secondary = outlined pill, `text` = label + arrow.
- **Tone of voice:** confident, plain-spoken, growth-driven, Nordic. "Making Media
  a Growth Engine", "every euro of your media", "without the jargon". No fluff.

### The logo

Wordmark only — there used to be a triangle mark shown beside it in the nav, and
the wordmark used to be a self-animating SMIL SVG that morphed the numeral 3
into that triangle on a 6.2s loop. Both were removed: the mark is not part of
the logo as the site uses it, and a shape looping in the header of every page
was more motion than the brand wanted.

```
public/logo-animated.svg   the original, still self-animating — source only
public/logo-wordmark.svg   the shipped file: logo-animated.svg with every
                            <animate> element stripped (171KB down to 6KB)
src/components/Logo.tsx    <Logo artwork={{ wordmark }} />
scripts/generate-icons.mjs regenerates every favicon and app icon
```

The wordmark stays an `<img>` rather than being inlined: it is one asset shared
and cached across every page, and it recolours for dark mode with a
`brightness-0 invert` filter rather than `currentColor`.

It is replaceable from the CMS (Design → Logo). An empty setting means the
shipped file.

**Favicons crop the wordmark's own "N"** rather than reusing a separate mark —
two polygons taken verbatim from `public/logo-wordmark.svg`. A full wordmark
shrunk to 16px is unreadable; one letter reads fine, and it avoids inventing
brand geometry that has to match a wordmark rendered right next to it. Icons
are generated, not live: `node scripts/generate-icons.mjs` rebuilds them, and
nothing in the CMS does it automatically if the wordmark artwork changes.

### Video in an image slot

Any CMS media path may point at a video instead of an image.
`src/components/MediaAsset.tsx` decides from the extension and renders either an
`<img>` or a `<video>`; every slot that can hold CMS media goes through it — the
three heroes with imagery, the six section slots, and `ParallaxImage`.

The video attributes are one unit, and iOS is the reason:

- `muted` — Safari will not autoplay anything with an audio track otherwise.
- `playsInline` — without it, iPhone hands the video to the fullscreen player the
  moment it starts, so a background loop becomes a fullscreen takeover.
- `loop`, `autoPlay` — decoration, not something a viewer chose to watch.
- `preload="metadata"` — the container header is enough to start, and a stack of
  card videos should not pull every full file on load.

**Byte ranges are required, not an optimisation.** Safari asks for the first
bytes to read the container header and treats a 200-with-the-whole-file as an
unseekable source, which on iOS is a black rectangle instead of a video. The
uploads route (`src/app/uploads/[...path]/route.ts`) therefore answers `Range`
with a 206, and the CMS's own preview route does the same.

### Dark mode

Class-based (`@custom-variant dark` in `globals.css`), toggled by `ThemeToggle` and
applied to `<html>` by a tiny pre-hydration script in `src/app/layout.tsx` so the
page never flashes light first. The house dark theme is a near-black violet base
(`#0e0b16`) with off-white text; the purple/violet/yellow accents are deliberately
**not** remapped because they were designed to pop on dark. Two conventions recur:
black pills become `purple` in dark mode, and elevated surfaces become
`dark:bg-white/[0.04] dark:ring-1 dark:ring-white/10`.

**Every visual change must be checked in both themes.**

### Motion

Scroll reveals, card hover and the marquee speeds are configured in the CMS and
reach the components two ways: the marquees read CSS custom properties
(`--marquee-logos` and friends), and `Reveal`, `StaggerGrid`, `HoverLift` and
`RouteWipe` read `MotionSettingsProvider` context. `MotionConfig` stays on
`reducedMotion="user"` and that is not configurable — honouring the OS setting is
not an editorial decision.

Per-block overrides come from the page editor's Style tab and are applied by
`StyleScope` in `src/components/blocks/BlockShell.tsx`, which also scopes a block's
corner radius by setting `--radius-card` on its subtree.

## Content

Copy and collections come from the **NØRR3 CMS** (`/root/norr3-cms`, port 3848),
not from the files in `src/content/`. Those files are still the source of the
*types* and the fallback data:

```
src/lib/cms.ts            fetches the CMS bundle, merges it over src/content/*
src/lib/dictionary.ts     getDictionary(locale) — now async
src/components/blocks/    BlockRenderer: draws CMS-composed pages
src/app/[locale]/[...slug]  serves pages built in the CMS page editor
src/app/[locale]/cms-preview  live preview target for that editor
src/app/api/revalidate    the CMS calls this on publish
src/app/api/cms-status    reports whether we are on CMS or fallback content
src/app/api/contact|brief forward form submissions into the CMS inbox
```

Two properties this layer guarantees:

1. **The site never goes dark.** If the CMS is unreachable or answers with
   something malformed, every accessor falls back to the committed content.
   `curl localhost:3847/api/cms-status` tells you which is in use.
2. **A missing key cannot crash a render.** The CMS payload is merged *over* the
   bundled dictionary, so a value nobody has filled in resolves to the committed
   string rather than `undefined`.

What comes from the CMS, beyond the dictionary and the collections:

| Area | Where it lands |
| --- | --- |
| Heroes | `src/content/heroes.ts` helpers; every hero component takes its words, imagery and copy as props with its shipped values as the default |
| Widget datasets | `src/content/datasets.ts` — chart channels, dashboard figures, company stats, brief channels |
| Section images | `src/content/imageSlots.ts` — named slots on the hand-built pages, alt text and captions per locale |
| Coded-route SEO | `src/lib/pageSeo.ts` — title, description and social image per route |
| Design tokens | `src/components/ThemeStyle.tsx` — emitted as CSS custom properties |
| Motion | `src/components/MotionSettingsProvider.tsx` |

Every one of these falls back to a bundled value, individually. A blank field in
the CMS keeps the designed content; an unreachable CMS renders the site as
committed.

### Code from the CMS

The CMS can send code, not just content, and three places on this side render it:

```
src/components/blocks/CodeEmbed.tsx   a code block: HTML + scoped CSS + JS
src/components/blocks/scopeCss.ts     prefixes selectors with the block's scope
src/components/CustomCode.tsx         site-wide CSS, <head> and end-of-body HTML
```

`scopeCss` is a single-pass tokeniser rather than a regex, because a `}` inside
`content: "}"` or a `{` inside `url("a{b.png")` silently unscopes every rule that
follows it. It tracks a nesting stack so `@media` contents get scoped while
`@keyframes` percentages are left alone.

`CustomCode` inserts its two HTML snippets with a small inline script instead of
rendering them directly, for two reasons that both bite otherwise: a wrapper
`<div>` inside `<head>` is invalid HTML, so the browser relocates it and
hydration fails (React #418); and a `<script>` inserted via `innerHTML` never
executes, so a pasted analytics snippet would silently do nothing. The
consequence to know about is that these two snippets are applied client-side and
are **not** in the server-rendered HTML — a crawler that does not run JavaScript
will not see them.

None of this is sanitised. It is gated on the CMS side, where only an admin can
write a code field; this app renders what it is given.

Configuration lives in `.env.local`:

```
NORR3_CMS_URL=http://127.0.0.1:3848
NORR3_CMS_REVALIDATE_SECRET=…    # must match the CMS's Settings → Website connection
NORR3_CMS_INGEST_SECRET=…        # ditto
```

Static routes always beat the catch-all, so every hand-built page here keeps
winning and `[...slug]` only picks up slugs this repo has no code for. That is
what lets an editor publish a new page without a deploy.

`next.config.ts` sets `allowedDevOrigins` for the VPS IP: without it `next dev`
answers 403 for its own JS chunks when the site is opened over anything but
`localhost`, the page never hydrates, and every scroll-reveal stays at opacity 0.

## Internationalisation

Finnish is the default locale; `/` redirects to `/fi`. The *shape* of the copy is
defined in `src/content/dictionary.ts` as two objects, `fi` and `en`, where `en`
is typed as `Dictionary = typeof fi` — so a missing or renamed key is a build
error, and **FI/EN parity is still enforced by the compiler**. The *values* are
edited in the CMS under Site copy and merged over this file at request time. Longer-form content (cases, insights,
team, services) lives in the other `src/content/*.ts` files with `fi` / `en` fields
per entry.

Any new or sharpened copy must be added to both locales. Locale-specific alt text
and labels that only exist in one page can be inlined there with a
`locale === "fi" ? … : …` ternary, following the existing pages.

## Legal pages

`/[locale]/tietosuojaseloste` and `/[locale]/kayttoehdot` render from `legal`
through the shared `LegalArticle` component. The published wording is edited in
the CMS; `dictionary.ts` holds the shipped fallback. When the privacy policy
changes in the CMS, update the fallback in the same way so the two stay in sync.
