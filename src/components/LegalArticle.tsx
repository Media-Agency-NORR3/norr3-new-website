import Link from "next/link";
import { Container, HeroPill } from "./Container";
import { Reveal } from "./Reveal";
import { Icon } from "./Icon";

export type LegalSection = { title: string; body: string[]; anchor?: string };

/**
 * Shared layout for the two legal pages (privacy, terms).
 *
 * Deliberately quieter than the marketing pages — no marquees, no saturated
 * accents (BRAND_GUIDELINES §2 keeps yellow/lime for infographics) — but still
 * on-brand: Host Grotesk, purple index numbers and links, the brand card radius,
 * and a measure capped near 68ch so long legal prose stays readable.
 */
export function LegalArticle({
  pill,
  heading,
  intro,
  updatedLabel,
  updated,
  tocLabel,
  sections,
  relatedLabel,
  relatedLinks,
}: {
  pill: string;
  heading: string;
  intro: string;
  updatedLabel: string;
  updated: string;
  tocLabel: string;
  sections: LegalSection[];
  relatedLabel: string;
  relatedLinks: { href: string; label: string }[];
}) {
  const anchor = (i: number) => `section-${i + 1}`;

  return (
    <>
      {/* Hero — one h1 per page, restrained scale: legal copy shouldn't shout. */}
      <section className="border-b border-black/10 dark:border-white/10">
        <Container className="py-16 lg:py-24">
          <Reveal>
            <HeroPill>{pill}</HeroPill>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-6 max-w-3xl text-[11vw] font-medium leading-[1.02] tracking-tight text-ink sm:text-6xl lg:text-[4.5rem] dark:text-white">
              {heading}
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-8 max-w-[62ch] text-[15px] leading-relaxed text-ink/75 lg:text-base dark:text-white/75">
              {intro}
            </p>
            <p className="mt-6 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-ink/50 dark:text-white/50">
              <Icon name="update" style={{ fontSize: "16px" }} />
              {updatedLabel}: {updated}
            </p>
          </Reveal>
        </Container>
      </section>

      <Container className="py-16 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] lg:gap-20">
          {/* Sticky section index — purple links per the brand link colour. */}
          <nav aria-label={tocLabel} className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-ink/50 dark:text-white/50">
              {tocLabel}
            </p>
            <ol className="mt-4 space-y-2.5">
              {sections.map((section, i) => (
                <li key={section.title} className="flex gap-3 text-sm leading-snug">
                  <span className="pt-px font-medium tabular-nums text-purple dark:text-light-purple">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <a
                    href={`#${section.anchor ?? anchor(i)}`}
                    className="rounded-sm text-ink/70 transition-colors hover:text-purple focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple dark:text-white/70 dark:hover:text-light-purple dark:focus-visible:outline-light-purple"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="max-w-[68ch]">
            {sections.map((section, i) => (
              <Reveal
                key={section.title}
                delay={0.04}
                className="border-t border-black/10 py-9 first:border-t-0 first:pt-0 dark:border-white/10"
              >
                <h2
                  id={section.anchor ?? anchor(i)}
                  className="scroll-mt-28 text-2xl font-medium tracking-tight text-ink lg:text-h4 dark:text-white"
                >
                  <span className="mr-3 font-medium tabular-nums text-purple dark:text-light-purple">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {section.title}
                </h2>
                <div className="mt-4 space-y-4">
                  {section.body.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="text-[15px] leading-[1.75] text-ink/75 lg:text-base dark:text-white/75"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </Reveal>
            ))}

            <Reveal className="mt-6 rounded-card bg-light-purple p-card-pad dark:bg-white/[0.04] dark:ring-1 dark:ring-white/10">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-ink/50 dark:text-white/50">
                {relatedLabel}
              </p>
              <ul className="mt-4 space-y-2">
                {relatedLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-2 rounded-sm text-[15px] font-medium text-purple transition-colors hover:text-violet focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple dark:text-light-purple dark:hover:text-white dark:focus-visible:outline-light-purple"
                    >
                      {link.label}
                      <span
                        aria-hidden
                        className="inline-block transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </Container>
    </>
  );
}
