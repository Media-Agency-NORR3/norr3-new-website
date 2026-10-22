"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useInView, animate, useReducedMotion } from "framer-motion";
import type { Locale } from "@/i18n/config";

// Vertical inset used both for the in-view trigger and for the
// "already on screen at load" check below, so the two agree.
const BOTTOM_INSET = 80;

export function CountUpStat({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  locale = "en",
  className = "",
  grouping = true,
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  locale?: Locale;
  className?: string;
  grouping?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  // Trigger on the vertical inset only. A symmetric margin also clips the
  // left/right viewport edges, so on phones a number sitting in the left ~80px
  // of the screen (card badges, first grid column) never intersects and stays
  // at 0 forever. Horizontal clipping is never wanted here.
  const inView = useInView(ref, { once: true, margin: `0px 0px -${BOTTOM_INSET}px 0px` });
  const prefersReduced = useReducedMotion();
  // Start from the real value so the server-rendered HTML carries the actual
  // figure. Crawlers and AI assistants read that HTML without running JS; a
  // 0 there made them guess our NPS and revenue.
  const [display, setDisplay] = useState(value);
  // True once the number has been reset to 0 and is waiting to count up.
  const [armed, setArmed] = useState(false);

  // Before the first paint after hydration: numbers below the fold drop to 0
  // so they can count up when scrolled to. Numbers already on screen keep
  // their value, so nobody sees a jump from the figure to 0.
  useLayoutEffect(() => {
    if (prefersReduced) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const onScreen = rect.top < window.innerHeight - BOTTOM_INSET && rect.bottom > 0;
    if (!onScreen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplay(0);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setArmed(true);
    }
    // Run once on mount: later scrolling is handled by inView.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!armed || !inView) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [armed, inView, value]);

  const shown = armed ? display : value;
  const formatted = shown.toLocaleString(locale === "fi" ? "fi-FI" : "en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: grouping,
  });

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
