import Link from "next/link";
import { Avatar } from "./Avatar";
import { profileHref } from "./PostCard";
import { loc, type MemberSummary } from "@/lib/socialFormat";
import type { Locale } from "@/i18n/config";

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple dark:focus-visible:outline-light-purple";

/** The white panel every profile and side-column section sits on. */
export const panelClass = "rounded-card bg-white ring-1 ring-black/[0.06] dark:bg-white/[0.035] dark:ring-white/10";

/** Small uppercase section label, the site's eyebrow style. */
export function PanelHeading({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="text-[11px] font-medium uppercase tracking-[0.14em] text-purple dark:text-light-purple">
      {children}
    </h2>
  );
}

/** Team members as a compact linked list — the feed's side column and "more from the team". */
export function MemberList({ members, locale, current }: { members: MemberSummary[]; locale: Locale; current?: string }) {
  const shown = members.filter((m) => m.slug !== current);
  if (shown.length === 0) return null;
  return (
    <ul className="-mx-2 space-y-0.5">
      {shown.map((m) => {
        // The subline shows the person's TITLE first — a member's optional
        // headline is a personal statement/quote (e.g. "If you must blink, do
        // it now!"), which reads wrong in a team roster list. Headline is only
        // a last resort for a member the CMS gives no role.
        const subline = loc(m.role, locale) || loc(m.headline, locale);
        return (
          <li key={m.slug}>
            <Link
              href={profileHref(locale, m.slug)}
              className={`group/member flex items-center gap-3 rounded-[6px] px-2 py-2 transition-colors hover:bg-grey/70 dark:hover:bg-white/[0.06] ${focusRing}`}
            >
              <Avatar name={m.name} photo={m.photo} size={40} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] font-medium text-ink group-hover/member:text-purple dark:text-white dark:group-hover/member:text-light-purple">
                  {m.name}
                </span>
                {subline && <span className="block truncate text-[12px] text-ink/55 dark:text-white/55">{subline}</span>}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
