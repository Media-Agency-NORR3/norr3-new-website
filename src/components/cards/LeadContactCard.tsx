import { Icon } from "@/components/Icon";
import { HoverLift } from "@/components/HoverLift";
import { leaveNote, type TeamMember } from "@/content/team";
import type { Locale } from "@/i18n/config";

const COMPANY_LINKEDIN = "https://www.linkedin.com/company/norr3/";

/** Featured contact card for the Contact page's lead-contact row.
 *
 *  Louder than the roster card on /team — the portrait sits on a filled
 *  surface and the email address is spelled out as a full row rather than a
 *  chip, because on this page the address is the thing people came for.
 *  Personal addresses have not been supplied for the roster, so the row falls
 *  back to the shared inbox rather than inventing a firstname.lastname@
 *  pattern; the same rule the /team card follows. Roles render only when the
 *  brand materials state one — no titles are invented for real people. */
export function LeadContactCard({
  member,
  locale,
  emailLabel,
  linkedinLabel,
}: {
  member: TeamMember;
  locale: Locale;
  emailLabel: string;
  linkedinLabel: string;
}) {
  const email = member.email ?? "info@norr3.fi";
  return (
    <HoverLift className="h-full" lift={4} scale={1.01}>
      <article className="flex h-full flex-col overflow-hidden rounded-card bg-grey/70 dark:bg-white/[0.04] dark:ring-1 dark:ring-white/10">
        <div className="aspect-[4/5] overflow-hidden bg-grey dark:bg-white/[0.06]">
          <img
            src={member.photo}
            alt={member.name}
            width={720}
            height={900}
            className="h-full w-full object-cover grayscale-[0.15] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.03] hover:grayscale-0"
            loading="lazy"
          />
        </div>
        <div className="flex flex-1 flex-col p-6">
          <h3 className="text-lg font-medium leading-snug text-ink dark:text-white">{member.name}</h3>
          {member.role ? (
            <p className="mt-1.5 text-[11px] font-medium uppercase leading-relaxed tracking-[0.14em] text-purple dark:text-light-purple">
              {member.role[locale]}
            </p>
          ) : (
            <span aria-hidden className="mt-1.5 block h-px w-8 bg-black/15 dark:bg-white/20" />
          )}
          {member.onLeave && (
            <p className="mt-2.5 inline-flex w-fit items-center rounded-full bg-yellow px-3 py-1 text-[11px] font-medium leading-none text-ink">
              {leaveNote[locale]}
            </p>
          )}
          <div className="mt-auto space-y-2 pt-6">
            <a
              href={`mailto:${email}`}
              aria-label={`${emailLabel} — ${member.name}`}
              className="group/mail flex items-center gap-2.5 rounded-sm text-sm text-ink/70 transition-colors hover:text-purple focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple dark:text-white/70 dark:hover:text-light-purple dark:focus-visible:outline-light-purple"
            >
              <Icon name="mail" style={{ fontSize: "18px" }} />
              <span className="break-all">{email}</span>
            </a>
            {member.phone && (
              <a
                href={`tel:${member.phone.replace(/\s/g, "")}`}
                aria-label={`${member.name} — ${member.phone}`}
                className="flex items-center gap-2.5 rounded-sm text-sm text-ink/70 transition-colors hover:text-purple focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple dark:text-white/70 dark:hover:text-light-purple dark:focus-visible:outline-light-purple"
              >
                <Icon name="call" style={{ fontSize: "18px" }} />
                <span>{member.phone}</span>
              </a>
            )}
            <a
              href={member.linkedin ?? COMPANY_LINKEDIN}
              target="_blank"
              rel="noreferrer"
              aria-label={`${member.name} — LinkedIn`}
              className="flex w-fit items-center gap-2.5 rounded-sm text-sm text-ink/70 transition-colors hover:text-purple focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple dark:text-white/70 dark:hover:text-light-purple dark:focus-visible:outline-light-purple"
            >
              <Icon name="arrow_outward" style={{ fontSize: "18px" }} />
              {linkedinLabel}
            </a>
          </div>
        </div>
      </article>
    </HoverLift>
  );
}
