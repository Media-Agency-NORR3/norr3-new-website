"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import type { Dictionary } from "@/content/dictionary";
import type { Locale } from "@/i18n/config";
import { isLocale } from "@/i18n/config";
import { Container, HeroPill } from "@/components/Container";
import { SplitHeadline } from "@/components/SplitHeadline";
import { Reveal } from "@/components/Reveal";
import { linkTo } from "@/lib/links";

/**
 * The body of the custom 404, with the locale resolved on the client side of
 * the boundary.
 *
 * `not-found` components receive no props, and the server half used to read
 * the locale from the `x-norr3-locale` request header. That was the last
 * Request-time API in the root layout's tree: a segment's not-found element
 * is passed into the NotFoundBoundary as a prop, so React Server Components
 * evaluate it during *every* page render — and one `headers()` call there
 * marked every route on the site dynamic (no ISR, `Cache-Control: no-store`).
 *
 * `useParams()` gives the same answer with no request-time read: the 404
 * renders inside `[locale]`, so the segment param of the URL that missed
 * (`/en/whatever` → `en`) is the language to answer in. The server passes
 * both dictionaries' 404 copy; this picks one.
 */
export function NotFoundContent({ copy }: { copy: Record<Locale, Dictionary["notFound"]> }) {
  const params = useParams<{ locale?: string }>();
  const locale: Locale = params?.locale && isLocale(params.locale) ? params.locale : "fi";
  const n = copy[locale];

  const linkHrefs: Record<string, string> = {
    home: linkTo(locale),
    services: linkTo(locale, "/services"),
    cases: linkTo(locale, "/caset"),
    insights: linkTo(locale, "/insights"),
    contact: linkTo(locale, "/contact"),
  };

  return (
    <Container className="pb-24 pt-12 lg:pb-32 lg:pt-20">
      <Reveal>
        <HeroPill>{n.pill}</HeroPill>
      </Reveal>
      <SplitHeadline
        left={n.left}
        accent={n.accent}
        className="mt-6 text-[min(9vw,7.5rem)] leading-none"
      />
      <Reveal delay={0.15} className="mt-10 flex flex-col items-start gap-8">
        <p className="max-w-md text-[15px] leading-relaxed text-ink/80 lg:text-base dark:text-white/80">
          {n.body}
        </p>
        <nav aria-label={n.searchLabel} className="flex flex-wrap gap-3">
          {n.links.map((item) => (
            <Link
              key={item.key}
              href={linkHrefs[item.key] ?? linkTo(locale)}
              className="inline-flex items-center rounded-full border border-ink/30 px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple dark:border-white/30 dark:text-white dark:hover:border-white dark:hover:bg-white dark:hover:text-ink dark:focus-visible:outline-light-purple"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </Reveal>
    </Container>
  );
}
