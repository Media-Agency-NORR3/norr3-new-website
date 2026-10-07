"use client";

import { Children, useEffect, useRef, useState } from "react";
import { useMotionSettings } from "./MotionSettingsProvider";

const EASE = "cubic-bezier(.16,1,.3,1)";

/**
 * Grid whose children fade up one after another. The distance, duration and the
 * gap between children come from the CMS's animation settings; `stagger` stays
 * a per-use override.
 *
 * Like `Reveal`, this is a CSS transition driven by a single IntersectionObserver
 * on the container rather than a framer-motion tree — the per-child
 * `motion.div`s were a large slice of the mobile main-thread budget (PageSpeed
 * audit, Oct 2026). The DOM shape is unchanged (each child still gets its own
 * wrapper when motion is on, and no wrapper when it is off).
 */
export function StaggerGrid({
  children,
  className = "",
  stagger,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}) {
  const { enabled, reveal } = useMotionSettings();
  const gap = stagger ?? reveal.stagger;
  const ref = useRef<HTMLDivElement | null>(null);
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
      // Vertical inset only (see MotionSettingsProvider): symmetric margins
      // clip the viewport's left/right edges on phones.
      { rootMargin: `0px 0px -${reveal.margin}px 0px`, threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [enabled, reveal.margin]);

  if (!enabled) return <div className={className}>{children}</div>;

  return (
    <div ref={ref} className={className}>
      {Children.map(children, (child, index) => (
        <div
          style={{
            opacity: shown ? 1 : 0,
            transform: shown ? undefined : `translateY(${reveal.distance}px)`,
            transition: `opacity ${reveal.duration}s ${EASE} ${index * gap}s, transform ${reveal.duration}s ${EASE} ${index * gap}s`,
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
