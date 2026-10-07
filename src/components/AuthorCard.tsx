import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { TeamMember } from "@/content/team";
import { linkTo } from "@/lib/links";

/**
 * The byline block on an insight article.
 *
 * The CMS stores the author as a plain name on the post (`author_name`). When
 * that name matches someone on the team roster — matched case-insensitively
 * against `TeamMember.name`, the same rule `articleAuthor()` in lib/jsonld.ts
 * uses for the Article schema, so the visible byline and the structured data
 * can never disagree — the card shows that person's real photograph from
 * `/images/team/*` and links to their profile. There is no separate author
 * image to maintain: the portrait comes straight from the team member.
 *
 * Posts credited to the house ("NØRR3") render the wordmark instead of a
 * portrait, so an organisational byline does not pretend to be a person.
 */
const LABELS = {
  fi: { writtenBy: "Kirjoittaja", viewProfile: "Katso profiili", team: "NØRR3:n tiimi", readMore: "Lue lisää" },
  en: { writtenBy: "Written by", viewProfile: "View profile", team: "The NØRR3 team", readMore: "Read more" },
} as const;

/** Resolve a CMS author name to a roster member, or null for the house byline. */
export function authorMember(authorName: string | undefined, team: TeamMember[]): TeamMember | null {
  const wanted = String(authorName ?? "").trim().toLowerCase();
  if (!wanted || wanted === "nørr3" || wanted === "norr3") return null;
  return team.find((m) => m.name.trim().toLowerCase() === wanted) ?? null;
}

export function AuthorCard({
  authorName,
  team,
  locale,
  /** Optional role override — the post's own byline role, when the CMS has one. */
  roleOverride,
}: {
  authorName?: string;
  team: TeamMember[];
  locale: Locale;
  roleOverride?: string;
}) {
  const t = LABELS[locale];
  const member = authorMember(authorName, team);
  const displayName = member?.name ?? (authorName?.trim() || "NØRR3");
  const role = roleOverride?.trim() || member?.role?.[locale] || member?.role?.fi || "";

  const photo = member?.photo;

  return (
    <section
      aria-label={t.writtenBy}
      className="mt-12 flex items-center gap-4 rounded-card border border-black/10 bg-white/60 p-4 sm:gap-5 sm:p-5 dark:border-white/10 dark:bg-white/[0.04]"
    >
      {/* The author's photograph, pulled from the team images. A real portrait is
          always square-cropped; the house byline gets the wordmark on a brand
          tile. */}
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-pastel-purple/60 sm:h-20 sm:w-20 dark:bg-white/10">
        {photo ? (
          <img
            src={photo}
            alt={displayName}
            width={160}
            height={160}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center px-2">
            <img src="/logo-wordmark.svg" alt="NØRR3" width={120} height={24} loading="lazy" className="w-3/4 dark:brightness-0 dark:invert" />
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink/50 dark:text-white/50">{t.writtenBy}</p>
        <p className="mt-1 truncate text-lg font-medium tracking-tight text-ink dark:text-white">{displayName}</p>
        {role && <p className="truncate text-sm text-ink/60 dark:text-white/60">{role}</p>}
        {member ? (
          <Link
            href={linkTo(locale, `/tiimi/${member.id}`)}
            className="mt-2 inline-flex items-center gap-1.5 rounded-sm text-sm font-medium text-purple transition-colors hover:text-violet focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple dark:text-light-purple dark:hover:text-white"
          >
            {t.viewProfile} <span aria-hidden>→</span>
          </Link>
        ) : (
          <p className="mt-2 text-sm text-ink/60 dark:text-white/60">{t.team}</p>
        )}
      </div>
    </section>
  );
}

/** Compact one-line byline for under the headline: "By Name · role". */
export function AuthorByline({
  authorName,
  team,
  locale,
}: {
  authorName?: string;
  team: TeamMember[];
  locale: Locale;
}) {
  const t = LABELS[locale];
  const member = authorMember(authorName, team);
  const displayName = member?.name ?? (authorName?.trim() || "NØRR3");
  const role = member?.role?.[locale] || member?.role?.fi || "";

  return (
    <span className="inline-flex items-center gap-2">
      {member?.photo ? (
        <img src={member.photo} alt="" width={28} height={28} loading="lazy" decoding="async" className="h-6 w-6 rounded-full object-cover" />
      ) : null}
      <span>
        {t.writtenBy} {displayName}
        {role ? <span className="text-ink/40 dark:text-white/40"> · {role}</span> : null}
      </span>
    </span>
  );
}
