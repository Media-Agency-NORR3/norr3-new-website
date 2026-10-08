"use client";

import { useMotionSettings } from "./MotionSettingsProvider";

import { usePathname } from "next/navigation";

/**
 * Full-viewport violet wipe, played on first paint and on every client-side
 * route change (the `key` remounts it per pathname).
 *
 * The animation is deliberately CSS-only (`.route-wipe` in globals.css) and NOT
 * framer-motion. This overlay covers the entire viewport, so anything that stops
 * it clearing leaves a dead violet page: with a JS-driven wipe, a chunk that
 * failed to load, a hydration error or JS being blocked outright all froze the
 * wipe at full cover and the visitor saw "the site is down — only a violet
 * screen". Driven by CSS it always completes on its own, with no JavaScript
 * involved at all.
 */
export function RouteWipe() {
  const pathname = usePathname();
  const { enabled, routeWipe } = useMotionSettings();

  // Switched off in the CMS, the wipe is simply not mounted — leaving a
  // zero-duration overlay in the tree would still cover the page for a frame.
  if (!enabled || !routeWipe) return null;

  return <div key={pathname} aria-hidden className="route-wipe" />;
}
