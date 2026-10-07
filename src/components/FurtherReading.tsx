import type { Locale } from "@/i18n/config";
import { externalLinksFor, type ExternalLink } from "@/content/externalLinks";

/**
 * "Sources & further reading" — the outbound-link block for a service page.
 *
 * Outbound links to authoritative third parties are a quality signal for both
 * readers and search engines. Every link opens in a new tab with
 * `rel="noopener"`, and the small note says what the reader gets there, so the
 * list adds context rather than being a bare link dump.
 */
const HEADINGS = {
  fi: { heading: "Lähteet ja lisätietoa", body: "Taustalähteet ja työkalut, joihin tämän sivun työ nojaa." },
  en: { heading: "Sources & further reading", body: "The reference sources and tools this page's work rests on." },
} as const;

export function FurtherReading({ slug, locale }: { slug: string; locale: Locale }) {
  const links = externalLinksFor(slug);
  if (links.length === 0) return null;
  const t = HEADINGS[locale];

  return (
    <section className="mt-14 border-t border-black/10 pt-10 dark:border-white/10">
      <h2 className="text-[11px] font-medium uppercase tracking-[0.14em] text-purple dark:text-light-purple">{t.heading}</h2>
      <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-ink/70 dark:text-white/70">{t.body}</p>
      <ul className="mt-6 grid max-w-3xl gap-4 sm:grid-cols-2">
        {links.map((link) => (
          <li key={link.href}>
            <ExternalLinkRow link={link} locale={locale} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function ExternalLinkRow({ link, locale }: { link: ExternalLink; locale: Locale }) {
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener"
      className="group flex h-full flex-col rounded-card border border-black/10 bg-white/60 p-4 transition-colors hover:border-purple focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-light-purple"
    >
      <span className="flex items-center gap-1.5 text-[15px] font-medium text-ink dark:text-white">
        {link.label}
        <span aria-hidden className="text-purple transition-transform group-hover:translate-x-0.5 dark:text-light-purple">
          ↗
        </span>
      </span>
      <span className="mt-1.5 text-[13px] leading-relaxed text-ink/60 dark:text-white/60">{link.note[locale]}</span>
    </a>
  );
}
