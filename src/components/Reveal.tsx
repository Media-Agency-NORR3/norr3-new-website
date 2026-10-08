"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useMotionSettings } from "./MotionSettingsProvider";

const EASE = "cubic-bezier(.16,1,.3,1)";

/**
 * Scroll-reveal wrapper. Distance, duration, stagger and trigger margin come
 * from the CMS's animation settings; `y` and `delay` remain per-use overrides
 * for the places that deliberately differ.
 *
 * Implemented with a CSS transition + one IntersectionObserver per element
 * rather than a framer-motion `motion.div`. There are ~26 of these on a page,
 * and hydrating 26 motion components dominated the mobile main-thread budget
 * (PageSpeed audit, Oct 2026: 11.8 s main-thread work, TBT 3.3 s). The resting
 * state is byte-for-byte the same — opacity 0 + a translateY offset on the
 * server, revealed once the element scrolls into view, once only — so crawlers
 * and reduced-motion users see exactly what they saw before.
 */
export function Reveal({
  children,
  delay = 0,
  y,
  className = "",
  as = "div",
  id,
}: {
  children: ReactNode;
  delay?: number;
  /** Overrides the configured reveal distance for this one element. */
  y?: number;
  className?: string;
  as?: "div" | "li";
  /** Forwarded so anchor links (sub-menus, hero text-links) can target a section. */
  id?: string;
}) {
  const { enabled, reveal } = useMotionSettings();
  const distance = y ?? reveal.distance;
  const ref = useRef<HTMLElement | null>(null);
  // With animation switched off — or before the observer can run — render the
  // final state directly rather than hiding content.
  const [shown, setShown] = useState(!enabled);

  useEffect(() => {
    if (!enabled) {
      setShown(true);
      return;
    }
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    // Honour the OS setting the same way framer-motion's reducedMotion="user" did.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        }
      },
      // Vertical inset only — a symmetric margin would clip the left/right
      // viewport edges and small elements near them could never reveal on phones.
      { rootMargin: `0px 0px -${reveal.margin}px 0px`, threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [enabled, reveal.margin]);

  const Tag = as;
  const style: React.CSSProperties | undefined = enabled
    ? {
        opacity: shown ? 1 : 0,
        transform: shown ? undefined : `translateY(${distance}px)`,
        transition: `opacity ${reveal.duration}s ${EASE} ${delay}s, transform ${reveal.duration}s ${EASE} ${delay}s`,
      }
    : undefined;

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag id={id} ref={ref as any} style={style} className={className}>
      {children}
    </Tag>
  );
}
