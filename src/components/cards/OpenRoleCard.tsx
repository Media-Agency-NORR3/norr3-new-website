import Link from "next/link";
import { Icon } from "@/components/Icon";
import { linkTo } from "@/lib/links";
import type { Locale } from "@/i18n/config";
import type { OpenRole } from "@/content/team";

/**
 * The yellow "open role" card, shared by the Careers page and the Team page so a
 * role reads and behaves identically wherever someone meets it.
 *
 * The card must send the candidate to the role's OWN destination — the
 * recruitment system page the role is advertised on (`applyUrl`) — not to the
 * generic contact page. Every role used to link to `/contact`, so clicking any
 * posting dumped the candidate on the contact form instead of the position.
 *
 * `applyUrl` is external, so it opens in a new tab with `rel="noopener"`; a role
 * with no URL yet (e.g. the committed fallback roles when the CMS is away) falls
 * back to the open-roles list rather than the contact page.
 */
export function OpenRoleCard({
  role,
  locale,
  applyLabel,
}: {
  role: OpenRole;
  locale: Locale;
  applyLabel: string;
}) {
  const external = Boolean(role.applyUrl);
  const href = role.applyUrl || linkTo(locale, "/toihin-meille#open-roles");

  const className =
    "group flex h-full flex-col rounded-card bg-yellow p-8 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple dark:focus-visible:outline-light-purple";

  const inner = (
    <>
      <span className="flex h-[64px] w-[64px] items-center justify-center rounded-[5px] bg-white/60 text-ink">
        <Icon name="work" style={{ fontSize: "28px" }} />
      </span>
      <h3 className="mt-8 text-lg font-medium leading-snug text-ink">{role.title[locale]}</h3>
      <p className="mt-1.5 text-sm text-ink/70">{role.location[locale]}</p>
      <span className="mt-auto inline-flex items-center gap-1 pt-8 text-xs font-medium uppercase tracking-[0.08em] text-ink transition-transform group-hover:translate-x-0.5">
        {applyLabel} <span aria-hidden>→</span>
      </span>
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {inner}
    </Link>
  );
}
