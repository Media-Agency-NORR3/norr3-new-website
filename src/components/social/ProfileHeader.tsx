"use client";

import { useCallback, useState } from "react";
import { Icon } from "@/components/Icon";
import { Avatar } from "./Avatar";
import { StoryViewer } from "./StoryViewer";
import { useSeenStories } from "./useSeenStories";
import type { SocialDict } from "./PostCard";
import { countLabel, fill, loc, mediaSrc, safeHttpUrl, type Profile, type Story } from "@/lib/socialFormat";
import type { Locale } from "@/i18n/config";

const chipClass =
  "inline-flex min-h-10 items-center gap-1.5 rounded-full px-4 py-2 text-[11px] font-medium uppercase tracking-[0.08em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple dark:focus-visible:outline-light-purple";

/**
 * The top of a member's profile: cover (or the brand gradient), a large
 * portrait that doubles as the story button while stories are live, name,
 * headline, role, location and contact buttons — then the highlights row.
 */
export function ProfileHeader({
  member,
  stories,
  highlights,
  locale,
  t,
  linkedinLabel,
  emailLabel,
}: {
  member: Profile;
  stories: Story[];
  highlights: Story[];
  locale: Locale;
  t: SocialDict;
  linkedinLabel: string;
  emailLabel: string;
}) {
  const { seen, markSeen } = useSeenStories();
  const [viewer, setViewer] = useState<{ mode: "stories" | "highlights"; start: number } | null>(null);
  const close = useCallback(() => setViewer(null), []);

  const cover = mediaSrc(member.cover);
  const headline = loc(member.headline, locale);
  const role = loc(member.role, locale);
  const linkedin = safeHttpUrl(member.linkedin);
  const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email) ? member.email : "";
  const allSeen = stories.length > 0 && stories.every((s) => seen.has(s.id));
  const firstUnseen = Math.max(0, stories.findIndex((s) => !seen.has(s.id)));
  const summary = { slug: member.slug, name: member.name, photo: member.photo, role: member.role, headline: member.headline, postCount: member.postCount };

  return (
    <div className="overflow-hidden rounded-card bg-white ring-1 ring-black/[0.06] dark:bg-white/[0.035] dark:ring-white/10">
      {/* Cover */}
      <div className="relative aspect-[3/1] w-full overflow-hidden bg-violet sm:aspect-[4/1]">
        {cover ? (
          <img src={cover} alt="" className="h-full w-full object-cover" fetchPriority="high" />
        ) : (
          <div aria-hidden className="h-full w-full bg-[radial-gradient(120%_140%_at_85%_0%,var(--color-accent-magenta)_0%,var(--color-purple)_38%,var(--color-violet)_70%,#1b0a3a_100%)]">
            <div className="h-full w-full bg-[linear-gradient(to_right,rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:48px_48px]" />
          </div>
        )}
      </div>

      <div className="px-5 pb-6 sm:px-8">
        {/* Portrait, overlapping the cover */}
        <div className="relative z-10 -mt-14 sm:-mt-20">
          {stories.length > 0 ? (
            <button
              type="button"
              onClick={() => setViewer({ mode: "stories", start: allSeen ? 0 : firstUnseen })}
              aria-label={fill(t.viewStories, { name: member.name })}
              className="rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple dark:focus-visible:outline-light-purple"
            >
              <Avatar name={member.name} photo={member.photo} size={132} ring={allSeen ? "seen" : "unseen"} alt={`${member.name}${role ? `, ${role}` : ""}`} priority />
            </button>
          ) : (
            <span className="inline-block rounded-full bg-white p-1.5 dark:bg-[#16131e]">
              <Avatar name={member.name} photo={member.photo} size={132} alt={`${member.name}${role ? `, ${role}` : ""}`} priority />
            </span>
          )}
        </div>

        <div className="mt-4 flex flex-col gap-5 sm:mt-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <h1 className="text-3xl font-medium leading-[1.1] tracking-tight text-ink sm:text-4xl dark:text-white">{member.name}</h1>
            {headline && <p className="mt-2 max-w-2xl text-[16px] leading-snug text-ink/80 dark:text-white/80">{headline}</p>}
            {role && (
              <p className="mt-2.5 text-[11px] font-medium uppercase leading-relaxed tracking-[0.14em] text-purple dark:text-light-purple">{role}</p>
            )}
            <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-ink/55 dark:text-white/55">
              {member.location && (
                <span className="inline-flex items-center gap-1">
                  <Icon name="location_on" style={{ fontSize: "16px" }} />
                  {member.location}
                </span>
              )}
              {member.postCount > 0 && <span>{countLabel(member.postCount, t.postCountOne, t.postCountMany)}</span>}
            </p>
          </div>
          {(linkedin || email) && (
            <div className="flex shrink-0 flex-wrap gap-2">
              {linkedin && (
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer me"
                  aria-label={`${member.name} — ${linkedinLabel}`}
                  className={`${chipClass} bg-ink text-white hover:bg-purple dark:bg-purple dark:hover:bg-violet`}
                >
                  {linkedinLabel}
                  <Icon name="arrow_outward" style={{ fontSize: "14px" }} />
                </a>
              )}
              {email && (
                <a
                  href={`mailto:${email}`}
                  aria-label={`${emailLabel} — ${member.name}`}
                  className={`${chipClass} border border-ink/30 text-ink hover:border-ink hover:bg-ink hover:text-white dark:border-white/30 dark:text-white dark:hover:bg-white dark:hover:text-ink`}
                >
                  {emailLabel}
                  <Icon name="mail" style={{ fontSize: "14px" }} />
                </a>
              )}
            </div>
          )}
        </div>

        {highlights.length > 0 && (
          <section aria-labelledby="profile-highlights" className="mt-7 border-t border-black/[0.06] pt-5 dark:border-white/10">
            <h2 id="profile-highlights" className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink/50 dark:text-white/50">
              {t.highlights}
            </h2>
            <ul className="-mx-1 mt-3 flex gap-4 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" data-lenis-prevent>
              {highlights.map((h, i) => {
                const thumb = mediaSrc(h.mediaType === "image" ? h.path : h.poster);
                const title = h.highlightTitle || h.caption || fill(t.storyCount, { i: i + 1, n: highlights.length });
                return (
                  <li key={h.id} className="shrink-0">
                    <button
                      type="button"
                      onClick={() => setViewer({ mode: "highlights", start: i })}
                      className="group/hl flex w-[76px] flex-col items-center gap-1.5 rounded-[6px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple dark:focus-visible:outline-light-purple"
                    >
                      <span className="rounded-full bg-black/10 p-[2px] dark:bg-white/20">
                        <span className="block rounded-full bg-white p-[2px] dark:bg-[#16131e]">
                          <span className="block h-[62px] w-[62px] overflow-hidden rounded-full bg-pastel-purple dark:bg-white/10">
                            {thumb && (
                              <img
                                src={thumb}
                                alt=""
                                loading="lazy"
                                className="h-full w-full object-cover transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/hl:scale-[1.06]"
                              />
                            )}
                          </span>
                        </span>
                      </span>
                      <span className="w-full truncate text-center text-[12px] text-ink/75 dark:text-white/75">{title}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </div>

      {viewer && (
        <StoryViewer
          groups={[{ member: summary, stories: viewer.mode === "stories" ? stories : highlights }]}
          startIndex={viewer.start}
          locale={locale}
          t={t}
          onClose={close}
          onSeen={viewer.mode === "stories" ? markSeen : undefined}
          highlightMode={viewer.mode === "highlights"}
        />
      )}
    </div>
  );
}
