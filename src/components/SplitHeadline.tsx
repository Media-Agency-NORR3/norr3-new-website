"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";

/**
 * The Figma hero device: left words and a right "_Accent" word spread to the
 * page edges, all black, with room for a collage or pill row in/below the gap.
 * The underscore blinks like a caret before the accent word settles.
 *
 * `accents` turns the accent word into a cycle: it rotates through the list
 * (Services hero walks "Our services include" through the service spectrum).
 * SSR, no-JS and reduced-motion all render the first word, so the resting
 * headline is always the full static sentence.
 *
 * `as` picks the element. On a service landing page the page's <h1> is the
 * service name (see ServiceLandingView) while this device carries the tagline,
 * so there it renders as a `div` — the tagline stays visible copy, it just is
 * not the heading. The caret is inside this element, so it can never end up in
 * the heading's text content.
 *
 * `middle` is the decorative graphic slot in the gap between the words —
 * mirroring how the home hero fills its middle with the rotating photo stack.
 * On lg+ it flexes between the words (shrinking before it would ever wrap);
 * below lg it drops under the headline as its own centred row, like home.
 *
 * LCP (Oct 2026): both words used to mount at `opacity: 0, y: 24`, so the
 * heading was blank until framer-motion had hydrated — ~7 s of the mobile LCP
 * was pure render delay. They now render in their final state on the server
 * (`initial={false}`) and only the cycling word swaps, via a transform-only CSS
 * animation (`.accent-swap`).
 */
export function SplitHeadline({
  left,
  accent,
  accents,
  middle,
  stack = false,
  className = "",
  as = "h1",
  children,
}: {
  left: string;
  accent: string;
  /** Cycle the accent word through these; falls back to the static `accent`. */
  accents?: string[];
  middle?: ReactNode;
  /** Force the accent word onto its own line below `left`. */
  stack?: boolean;
  className?: string;
  /** Element for the device. `h1` on pages whose heading is this tagline. */
  as?: "h1" | "div";
  children?: ReactNode;
}) {
  const cycling = !!accents && accents.length > 1;
  // Joined key so a fresh array identity per render cannot reset the timer.
  const accentKey = accents ? accents.join("\u0001") : "";
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!cycling) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const list = accentKey.split("\u0001");
    const id = window.setInterval(() => {
      setIdx((i) => (i + 1) % list.length);
    }, 2400);
    return () => window.clearInterval(id);
  }, [cycling, accentKey]);

  const shownAccent = cycling && accents ? accents[idx % accents.length] ?? accent : accent;
  const Tag = as;

  return (
    <div className={className}>
      <Tag
        aria-label={as === "h1" ? `${left} ${accents?.[0] ?? accent}` : undefined}
        className="flex flex-wrap items-baseline justify-between gap-x-8 font-medium leading-[1.05] tracking-tight text-ink dark:text-white"
      >
        <span className="block">{left}</span>
        {middle && (
          <span
            aria-hidden
            className="order-3 mt-8 flex w-full justify-center lg:order-none lg:mt-0 lg:min-w-0 lg:flex-1"
          >
            {middle}
          </span>
        )}
        <span aria-hidden className={stack ? "block basis-full" : "block"}>
          {/* `key` remounts the word on each swap, so the transform-only CSS
              animation replays without ever hiding the text at opacity 0. */}
          <span key={shownAccent} className="accent-swap-rise inline-block">
            <span aria-hidden className="caret-blink">
              _
            </span>
            {shownAccent}
          </span>
        </span>
      </Tag>
      {children}
    </div>
  );
}
