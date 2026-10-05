"use client";

import { useMemo, useState } from "react";
import { Icon } from "./Icon";
import { team as bundledTeam, type TeamMember } from "@/content/team";
import type { Locale } from "@/i18n/config";

/**
 * The Team hero strip: an always-sliding band of member photos interleaved
 * with brand-colored icon chips and a mini dashboard tile. Hovering (or
 * focusing) pauses the slide and expands the hovered member's card to reveal
 * name + role — per the requested interaction.
 */

type StripItem =
  | { kind: "member"; memberIndex: number }
  | { kind: "chip"; icon: string; tone: string }
  | { kind: "dashboard" };

const CHIP_TONES = [
  "bg-yellow text-ink",
  "bg-pastel-purple text-violet",
  "bg-purple text-white",
  "bg-light-purple text-ink",
];

const CHIP_ICONS = ["trending_up", "interests", "monitoring", "bolt"];

function buildStrip(count: number): StripItem[] {
  const items: StripItem[] = [];
  Array.from({ length: count }).forEach((_, i) => {
    items.push({ kind: "member", memberIndex: i });
    if (i === 3) {
      items.push({ kind: "dashboard" });
    } else if (i % 2 === 1) {
      items.push({
        kind: "chip",
        icon: CHIP_ICONS[(i >> 1) % CHIP_ICONS.length],
        tone: CHIP_TONES[(i >> 1) % CHIP_TONES.length],
      });
    }
  });
  return items;
}


function MiniDashboard() {
  return (
    <div className="flex h-full w-56 shrink-0 flex-col gap-2 self-center rounded-2xl bg-black p-4 text-white ring-1 ring-white/10">
      <p className="text-[10px] font-medium">Campaign Dashboard</p>
      <p className="text-[8px] text-white/50">Real-time performance</p>
      <div className="mt-1 grid grid-cols-2 gap-1.5">
        <div className="rounded-lg bg-white/[0.07] p-2">
          <p className="text-[8px] text-white/50">Active</p>
          <p className="text-sm font-medium text-accent-green">24</p>
        </div>
        <div className="rounded-lg bg-white/[0.07] p-2">
          <p className="text-[8px] text-white/50">Impressions</p>
          <p className="text-sm font-medium text-accent-blue">2.4M</p>
        </div>
      </div>
      <div className="mt-auto flex items-end gap-1">
        {[40, 70, 50, 90, 65].map((h, i) => (
          <div key={i} className="w-full rounded-t-sm bg-purple" style={{ height: `${h * 0.4}px` }} />
        ))}
      </div>
    </div>
  );
}

export function TeamMarquee({
  locale,
  members = bundledTeam,
}: {
  locale: Locale;
  /** Roster from the CMS; the bundled list is the fallback. */
  members?: TeamMember[];
}) {
  const [active, setActive] = useState<number | null>(null);
  // The strip pattern depends on how many people are in the roster, which the
  // CMS can change, so it is derived per render rather than at module load.
  const strip = useMemo(() => buildStrip(members.length), [members.length]);

  const renderStrip = (copy: number) => (
    <div className="flex shrink-0 items-stretch gap-4 pr-4" aria-hidden={copy > 0}>
      {strip.map((item, i) => {
        if (item.kind === "chip") {
          return (
            <span
              key={`${copy}-${i}`}
              className={`flex h-16 w-16 shrink-0 items-center justify-center self-center rounded-full ${item.tone}`}
            >
              <Icon name={item.icon} className="text-[24px]" />
            </span>
          );
        }
        if (item.kind === "dashboard") {
          return <MiniDashboard key={`${copy}-${i}`} />;
        }
        const member = members[item.memberIndex];
        const isActive = active === item.memberIndex;
        const tall = item.memberIndex % 3 === 0;
        return (
          <button
            key={`${copy}-${i}`}
            type="button"
            onMouseEnter={() => setActive(item.memberIndex)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(item.memberIndex)}
            onBlur={() => setActive(null)}
            onClick={() => setActive(isActive ? null : item.memberIndex)}
            aria-label={member.role ? `${member.name} — ${member.role[locale]}` : member.name}
            // The second copy exists only for the seamless loop; it is
            // aria-hidden, so it must not be reachable by keyboard either.
            tabIndex={copy > 0 ? -1 : undefined}
            className={`group/card relative shrink-0 cursor-pointer overflow-hidden rounded-lg transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple dark:focus-visible:outline-light-purple ${
              tall ? "self-stretch" : "self-center"
            } ${isActive ? "w-64" : "w-32 sm:w-36"} ${tall ? "h-full" : "h-40 sm:h-48"}`}
          >
            <img
              src={member.photo}
              // The button's aria-label already names the member — a non-empty
              // alt here would make AT announce the name twice.
              alt=""
              // The strip sits near the bottom of the home page, and the loop
              // copy doubles every photo. Without `lazy`, React's SSR treats
              // each eager <img> as a preload candidate: 19 × 2 team photos
              // (~1 MB) went out as <link rel="preload"> and Link headers ahead
              // of the hero image. Lazy images are neither preloaded nor
              // fetched until the strip scrolls near the viewport.
              loading="lazy"
              decoding="async"
              className={`h-full w-full object-cover transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isActive ? "scale-105 grayscale-0" : "grayscale-[0.2]"
              }`}
              draggable={false}
            />
            <span
              className={`absolute inset-x-0 bottom-0 flex flex-col items-start gap-0.5 bg-gradient-to-t from-black/80 to-transparent p-3 text-left transition-opacity duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isActive ? "opacity-100" : "opacity-0"
              }`}
            >
              <span className="text-sm font-medium text-white">{member.name}</span>
              {member.role && (
                <span className="text-[11px] text-white/80">{member.role[locale]}</span>
              )}
            </span>
            {/* Affordance: a subtle plus chip so users know cards respond */}
            <span
              className={`absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/85 text-ink transition-opacity duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isActive ? "opacity-0" : "opacity-0 group-hover/card:opacity-100"
              }`}
            >
              <Icon name="add" className="text-[16px]" />
            </span>
          </button>
        );
      })}
    </div>
  );

  return (
    <div
      className="marquee-paused h-56 overflow-x-clip sm:h-64"
      style={{ ["--marquee-duration" as string]: "var(--marquee-team, 50s)" }}
    >
      <div className="marquee-track h-full items-stretch">
        {renderStrip(0)}
        {renderStrip(1)}
      </div>
    </div>
  );
}
