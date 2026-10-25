"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/components/Icon";
import { HoverLift } from "@/components/HoverLift";
import { houseBio as bundledHouseBio, leaveNote, type TeamMember } from "@/content/team";
import type { Locale } from "@/i18n/config";

const COMPANY_LINKEDIN = "https://www.linkedin.com/company/norr3/";

/** Small outlined action chip used for the per-person LinkedIn / email links.
 *  Sized so two chips always fit a card column, and it carries its own focus
 *  ring — the card itself is not a link, so these are the only tab stops. */
const chipClass =
  "inline-flex items-center gap-1.5 rounded-full border border-ink/25 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.08em] text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple dark:border-white/25 dark:text-white dark:hover:border-white dark:hover:bg-white dark:hover:text-ink dark:focus-visible:outline-light-purple";

/** Management Team card: headshot, name, role, LinkedIn/Email chips.
 *
 *  Warm + human: HoverLift + a portrait that sits slightly de-saturated at rest
 *  and lifts to full colour behind a thin purple keyline on hover. Every card
 *  is the same shape — square photo (720×720 → no CLS), name, an always-present
 *  role line (a hairline placeholder keeps rows aligned when a role is unset)
 *  and the chip row pinned to the bottom — so 17 faces read as one roster
 *  rather than 17 different cards.
 *
 *  The description no longer sits under the name. Hovering the portrait spawns
 *  a small yellow info box that rides the cursor: real emojis up top, the
 *  member's own words in black, and their email and phone in purple underneath.
 *  Touch screens have no hover, so a "+" on the portrait opens the same info
 *  as a panel over the photo instead — with the email and phone tappable. */
export function TeamMemberCard({
  member,
  locale,
  linkedinLabel,
  emailLabel,
  houseBio = bundledHouseBio,
  profileHref,
}: {
  member: TeamMember;
  /**
   * The member's Team Social profile. When set, the name and the portrait link
   * there; the chips and the touch "+" keep working on top of the photo link.
   */
  profileHref?: string;
  locale: Locale;
  linkedinLabel: string;
  emailLabel: string;
  /**
   * The line every member shares until they get a real bio. Cards skip it — 17
   * identical paragraphs read as filler — so it has to be the same value the
   * roster carries, which the CMS derives from the roster itself.
   */
  houseBio?: { fi: string; en: string };
}) {
  const linkedinHref = member.linkedin ?? COMPANY_LINKEDIN;
  const emailDisplay = member.email ?? "info@norr3.fi";
  const emailHref = `mailto:${emailDisplay}`;
  const phone = member.phone?.trim() || null;
  const phoneHref = phone ? `tel:${phone.replace(/[^\d+]/g, "")}` : null;
  // Only a bio written for this person earns space in the tooltip.
  // Compared by value, not identity: the roster arrives from the CMS as fresh
  // objects, so a reference check would treat the shared house line as a real bio.
  const ownBio = member.bio[locale] === houseBio[locale] ? null : member.bio[locale];

  // Cursor-following tooltip. Kept in a portal on <body> so no transformed
  // ancestor (HoverLift) or `overflow-hidden` portrait clips it — it stays
  // stuck to the cursor anywhere on screen.
  const [tip, setTip] = useState<null | { x: number; y: number; flipX: boolean; flipY: boolean }>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  /** The tap-to-open panel on touch screens. */
  const [panelOpen, setPanelOpen] = useState(false);

  function moveTip(e: React.PointerEvent<HTMLDivElement>) {
    // Mouse only: a tap fires emulated pointer events too, and the touch path
    // has its own panel — a tooltip stuck to the last tap point is just noise.
    if (e.pointerType !== "mouse") return;
    // Generous box estimate so it flips to the opposite side before clipping.
    const BOX_W = 280;
    const BOX_H = 180;
    setTip({
      x: e.clientX,
      y: e.clientY,
      flipX: e.clientX + 16 + BOX_W > window.innerWidth,
      flipY: e.clientY + 16 + BOX_H > window.innerHeight,
    });
  }

  const visible = tip !== null;

  return (
    <HoverLift className="h-full" lift={4} scale={1.01}>
      <article className="group/member flex h-full flex-col">
        <div
          className="relative aspect-square overflow-hidden rounded-card bg-grey dark:bg-white/[0.06]"
          onPointerEnter={moveTip}
          onPointerMove={moveTip}
          onPointerLeave={() => setTip(null)}
        >
          <img
            src={member.photo}
            alt={member.name}
            width={720}
            height={720}
            className="h-full w-full object-cover grayscale-[0.15] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/member:scale-[1.04] group-hover/member:grayscale-0"
            loading="lazy"
          />
          {/* The name is the keyboard stop for the profile; this just makes the
              photo clickable too. The info panel and "+" sit above it. */}
          {profileHref && (
            <Link href={profileHref} tabIndex={-1} aria-hidden className="absolute inset-0">
              <span className="sr-only">{member.name}</span>
            </Link>
          )}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-card ring-0 ring-inset ring-purple/0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/member:ring-2 group-hover/member:ring-purple/70"
          />

          {/* Touch screens: the same yellow info box, opened from a "+". */}
          <div
            id={`${member.id}-info`}
            hidden={!panelOpen}
            className="absolute inset-x-3 bottom-3 rounded-2xl bg-yellow px-4 py-3 pr-12 text-left"
          >
            <div aria-hidden className="mb-1.5 text-lg leading-none">
              😊 👋
            </div>
            {ownBio && <p className="text-[13px] leading-snug text-ink">{ownBio}</p>}
            <a href={emailHref} className="mt-1.5 block break-all text-[13px] font-medium text-purple underline-offset-2 hover:underline">
              {emailDisplay}
            </a>
            {phone && phoneHref && (
              <a href={phoneHref} className="mt-0.5 block text-[13px] font-medium text-purple underline-offset-2 hover:underline">
                {phone}
              </a>
            )}
          </div>
          <button
            type="button"
            onClick={() => setPanelOpen((v) => !v)}
            aria-expanded={panelOpen}
            aria-controls={`${member.id}-info`}
            aria-label={`${member.name} — info`}
            className="absolute bottom-3 right-3 hidden h-9 w-9 items-center justify-center rounded-full bg-yellow text-ink transition-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple [@media(hover:none)]:flex"
          >
            <Icon name={panelOpen ? "close" : "add"} style={{ fontSize: "20px" }} />
          </button>
        </div>
        <h3 className="mt-5 text-lg font-medium leading-snug text-ink dark:text-white">
          {profileHref ? (
            <Link
              href={profileHref}
              className="rounded-sm transition-colors hover:text-purple focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple dark:hover:text-light-purple dark:focus-visible:outline-light-purple"
            >
              {member.name}
            </Link>
          ) : (
            member.name
          )}
        </h3>
        {member.role ? (
          <p className="mt-1.5 text-[11px] font-medium uppercase leading-relaxed tracking-[0.14em] text-purple dark:text-light-purple">
            {member.role[locale]}
          </p>
        ) : (
          <span aria-hidden className="mt-1.5 block h-px w-8 bg-black/15 dark:bg-white/20" />
        )}
        {/* Away on family leave. Sits between the role and the chips, and is
            set in the brand yellow so it reads as a note about the person
            rather than a second job title. */}
        {member.onLeave && (
          <p className="mt-2.5 inline-flex w-fit items-center rounded-full bg-yellow px-3 py-1 text-[11px] font-medium leading-none text-ink">
            {leaveNote[locale]}
          </p>
        )}
        <div className="mt-auto flex flex-wrap gap-2 pt-5">
          <a
            href={linkedinHref}
            target="_blank"
            rel="noreferrer"
            aria-label={`${member.name} — LinkedIn`}
            className={chipClass}
          >
            {linkedinLabel}
            <Icon name="arrow_outward" style={{ fontSize: "14px" }} />
          </a>
          <a href={emailHref} aria-label={`${emailLabel} — ${member.name}`} className={chipClass}>
            {emailLabel}
            <Icon name="mail" style={{ fontSize: "14px" }} />
          </a>
        </div>
      </article>

      {mounted &&
        createPortal(
          <div
            aria-hidden
            className={`pointer-events-none fixed z-50 max-w-[280px] transition-[opacity,transform] duration-150 ease-out ${
              visible ? "opacity-100" : "opacity-0"
            }`}
            style={{
              left: tip?.x ?? 0,
              top: tip?.y ?? 0,
              transform: `translate(${tip?.flipX ? "calc(-100% - 16px)" : "16px"}, ${
                tip?.flipY ? "calc(-100% - 16px)" : "16px"
              }) scale(${visible ? 1 : 0.85})`,
              transformOrigin: tip?.flipX ? "right top" : "left top",
            }}
          >
            <div className="rounded-2xl bg-yellow px-4 py-3 text-left shadow-lg">
              <div aria-hidden className="mb-1.5 text-lg leading-none">
                😊 👋
              </div>
              {ownBio && <p className="text-[13px] leading-snug text-ink">{ownBio}</p>}
              <p className="mt-1.5 text-[13px] font-medium text-purple">{emailDisplay}</p>
              {phone && <p className="mt-0.5 text-[13px] font-medium text-purple">{phone}</p>}
            </div>
          </div>,
          document.body,
        )}
    </HoverLift>
  );
}
