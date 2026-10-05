"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { Icon } from "./Icon";
import { linkTo, otherLocaleHref, publicPath } from "@/lib/links";
import { servicePages as bundledServicePages, servicePageLocalised, type ServicePage } from "@/content/servicePages";
import type { Dictionary } from "@/content/dictionary";
import type { Locale } from "@/i18n/config";

// Every control in the site chrome gets the same house focus ring.
const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple dark:focus-visible:outline-light-purple";

/** One menu entry as the CMS stores it: locale labels and a locale-relative href. */
export type NavEntry = { label: Record<Locale, string>; href: string };

/**
 * The header nav, now with sub-menus.
 *
 * Top-level order and labels come from the CMS (dictionary fallback). The
 * sub-links under Palvelut / Engine / Caset / Meistä jump straight to the
 * relevant section of the target page — an anchor (`/services#data`) where the
 * target has one, a filtered list where it doesn't. They are defined here per
 * route and labelled from the dictionary, so they stay translated and are one
 * place to maintain.
 */
export function Nav({
  locale,
  dict,
  menu,
    logo,
    ctas,
    servicePages,
    cases,
  }: {
  locale: Locale;
  dict: Dictionary;
  /** Wordmark override, editable in the CMS under Design. */
  logo?: { wordmark: string };
  /**
   * Menu managed in the CMS. Order, labels and visibility are editable there;
   * when it is absent (CMS unreachable) the nav falls back to the seven routes
   * the site has always shipped, labelled from the dictionary.
   */
  menu?: NavEntry[];
  /**
   * Header CTA buttons managed in the CMS. The two pills keep their fixed
   * targets (/engine, /brief) and pick up the label the CMS holds for that
   * target, so renaming a button there changes it here.
   */
  ctas?: NavEntry[];
  /** Service landing pages (CMS-managed; bundled list is the fallback). */
  servicePages?: ServicePage[];
  /**
   * The cases the site currently shows (the CMS bundle leaves hidden ones
   * out), so the Caset dropdown never links to a hidden case.
   */
  cases?: { slug: string; client: string }[];
}) {
  const pathname = usePathname();
  const sp = servicePages ?? bundledServicePages;

  // Resolve a service page's title for the mega-menu without crashing if the
  // CMS list is missing a slug. The CMS owns the copy but the nav is hardcoded
  // to a fixed set of slugs; when an editor renames one (or a publish lands a
  // partial list) the lookup degrades to the bundled page, and finally to the
  // raw slug, instead of throwing on a non-null assertion.
  const spTitle = (slug: string): string => {
    const page = sp.find((p) => p.slug === slug) ?? bundledServicePages.find((p) => p.slug === slug);
    return page ? servicePageLocalised(page, locale).title : slug;
  };

  const ctaLabel = (href: string, fallback: string) =>
    ctas?.find((c) => c.href === href || c.href === linkTo(locale, href))?.label[locale] || fallback;
  const engineCta = ctaLabel("/engine", dict.nav.engine);
  const briefCta = ctaLabel("/brief", dict.common.briefUs);
  const [open, setOpen] = useState(false);
  /** Which top-level item's panel is open on desktop (its key), or null. */
  const [subOpen, setSubOpen] = useState<string | null>(null);
  const closeTimer = useRef<number | null>(null);

  // Close any open panel when the route changes.
  useEffect(() => {
    setSubOpen(null);
    setOpen(false);
  }, [pathname]);

  // Hide the cookie banner while the mobile menu is open (it was covering
  // menu content) — the banner listens for this attribute.
  useEffect(() => {
    document.documentElement.toggleAttribute("data-menu-open", open);
    return () => document.documentElement.removeAttribute("data-menu-open");
  }, [open]);

  const t = dict.nav;

  // The Palvelut mega-menu: main services as columns, their subservices under
  // each. Structure mirrors the 6-box service map on /services.
  const MEGA_GROUPS: { key: string; label: string; href: string; icon: string; children: { key: string; label: string; href: string }[] }[] = [
    {
      key: "insight",
      label: locale === "fi" ? "Insight & Strategia" : "Insight & Strategy",
      href: linkTo(locale, "/insight-strategia"),
      icon: "strategy",
      children: [
        { key: "is", label: spTitle("insight-strategia"), href: linkTo(locale, "/insight-strategia") },
        { key: "ms", label: spTitle("markkinointistrategia"), href: linkTo(locale, "/markkinointistrategia") },
        { key: "mediastrat", label: spTitle("mediastrategia"), href: linkTo(locale, "/mediastrategia") },
        { key: "tutk", label: spTitle("tutkimukset"), href: linkTo(locale, "/tutkimukset") },
      ],
    },
    {
      key: "media",
      label: locale === "fi" ? "Mediapalvelut" : "Media Services",
      href: linkTo(locale, "/mediasuunnittelu"),
      icon: "campaign",
      children: [
        { key: "ms", label: spTitle("mediasuunnittelu"), href: linkTo(locale, "/mediasuunnittelu") },
        { key: "radio", label: spTitle("mediasuunnittelu/radio"), href: linkTo(locale, "/mediasuunnittelu/radio") },
        { key: "tv", label: spTitle("mediasuunnittelu/televisio"), href: linkTo(locale, "/mediasuunnittelu/televisio") },
        { key: "oo", label: spTitle("ulkomainonta"), href: linkTo(locale, "/ulkomainonta") },
        { key: "mi", label: spTitle("mediasuunnittelu/norr3-media-insights"), href: linkTo(locale, "/mediasuunnittelu/norr3-media-insights") },
      ],
    },
    {
      key: "digital",
      label: locale === "fi" ? "Digimainonta" : "Digital Advertising",
      href: linkTo(locale, "/display-ja-videomainonta"),
      icon: "grid_view",
      children: [
        { key: "dv", label: spTitle("display-ja-videomainonta"), href: linkTo(locale, "/display-ja-videomainonta") },
        { key: "sm", label: spTitle("somemarkkinointi"), href: linkTo(locale, "/somemarkkinointi") },
        { key: "oo2", label: spTitle("ohjelmallinen-ostaminen"), href: linkTo(locale, "/ohjelmallinen-ostaminen") },
        { key: "dm", label: spTitle("dynaaminen-mainonta"), href: linkTo(locale, "/dynaaminen-mainonta") },
      ],
    },
    {
      key: "perf",
      label: locale === "fi" ? "Performance & data" : "Performance & Data",
      href: linkTo(locale, "/performance-markkinointi"),
      icon: "trending_up",
      children: [
        { key: "pm", label: spTitle("performance-markkinointi"), href: linkTo(locale, "/performance-markkinointi") },
        { key: "dm2", label: spTitle("data-ja-mittaus"), href: linkTo(locale, "/data-ja-mittaus") },
        { key: "db", label: spTitle("data-ja-mittaus/dashboardit"), href: linkTo(locale, "/data-ja-mittaus/dashboardit") },
        { key: "dmod", label: spTitle("data-ja-mittaus/datan-mallintaminen"), href: linkTo(locale, "/data-ja-mittaus/datan-mallintaminen") },
      ],
    },
    {
      key: "seo-ai",
      label: "SEM, SEO, GEO & AI",
      href: linkTo(locale, "/hakukoneoptimointi"),
      icon: "search",
      children: [
        { key: "seo", label: spTitle("hakukoneoptimointi"), href: linkTo(locale, "/hakukoneoptimointi") },
        { key: "hm", label: spTitle("hakukonemainonta"), href: linkTo(locale, "/hakukonemainonta") },
        { key: "ai", label: spTitle("ai-optimointi"), href: linkTo(locale, "/ai-optimointi") },
        { key: "aiads", label: spTitle("tekoalymainonta"), href: linkTo(locale, "/tekoalymainonta") },
        { key: "luovat", label: spTitle("mediasuunnittelu/luovat"), href: linkTo(locale, "/mediasuunnittelu/luovat") },
      ],
    },
  ];

  const sub: Record<string, { key: string; label: string; href: string }[]> = {
    services: MEGA_GROUPS.flatMap((g) => g.children),
    engine: [
      { key: "product", label: t.engineSub.product, href: linkTo(locale, "/engine#tuote") },
      { key: "workflow", label: t.engineSub.workflow, href: linkTo(locale, "/engine#toiminta") },
      { key: "simulator", label: t.engineSub.simulator, href: linkTo(locale, "/engine#simulator") },
      { key: "demo", label: t.engineSub.demo, href: linkTo(locale, "/engine#demo") },
    ],
    cases: [
      { key: "all", label: t.casesSub.all, href: linkTo(locale, "/caset#kaikki-caset") },
      ...(cases ?? []).map((c) => ({ key: `case-${c.slug}`, label: c.client, href: linkTo(locale, `/${c.slug}`) })),
    ],
    insights: [
      { key: "all", label: t.insightsSub.all, href: linkTo(locale, "/insights#kaikki-artikkelit") },
    ],
    about: [
      { key: "story", label: t.aboutSub.story, href: linkTo(locale, "/meista") },
      { key: "team", label: t.aboutSub.team, href: linkTo(locale, "/tiimi") },
      { key: "careers", label: t.aboutSub.careers, href: linkTo(locale, "/toihin-meille") },
    ],
  };

  const baseItems =
    menu && menu.length > 0
      ? menu
          // The CMS menu also feeds the footer; keep the header to real sections.
          .filter((entry) => !["/tietosuojaseloste", "/kayttoehdot", "/privacy", "/terms"].includes(entry.href))
          .map((entry) => {
            // The key stays the CMS name (`cases`, `about`) — the sub-menu map
            // above is keyed by it — while the href becomes the public route
            // (`/caset`, `/meista`) so no nav link lands on a 301.
            const key = entry.href.replace(/^\//, "") || "home";
            return {
              key,
              label: entry.label[locale] || entry.label.fi,
              href: linkTo(locale, publicPath(entry.href)),
              children: sub[key] ?? [],
            };
          })
      : ([
          { key: "services", label: t.services, href: linkTo(locale, "/services"), children: sub.services ?? [] },
          { key: "engine", label: t.engine, href: linkTo(locale, "/engine"), children: sub.engine ?? [] },
          { key: "caset", label: t.cases, href: linkTo(locale, "/caset"), children: sub.cases ?? [] },
          { key: "insights", label: t.insights, href: linkTo(locale, "/insights"), children: sub.insights ?? [] },
          { key: "contact", label: t.contact, href: linkTo(locale, "/contact"), children: [] },
          { key: "meista", label: t.about, href: linkTo(locale, "/meista"), children: sub.about ?? [] },
          { key: "toihin-meille", label: t.careers, href: linkTo(locale, "/toihin-meille"), children: [] },
        ] as { key: string; label: string; href: string; children: { key: string; label: string; href: string }[] }[]);

  // Team Social's feed sits right after Insights. The CMS menu predates it, so
  // it is added here unless an editor has already put /feed in the menu.
  // HIDDEN FOR NOW (Wael, 2026-09-15): flip FEED_IN_NAV back to true to relaunch.
  const FEED_IN_NAV = false;
  const feedItem = { key: "feed", label: t.feed, href: linkTo(locale, "/feed"), children: [] };
  const items = !FEED_IN_NAV || baseItems.some((item) => item.href === feedItem.href)
    ? baseItems
    : (() => {
        const at = baseItems.findIndex((item) => item.key === "insights");
        const list = [...baseItems];
        list.splice(at >= 0 ? at + 1 : list.length, 0, feedItem);
        return list;
      })();

  const other: Locale = locale === "fi" ? "en" : "fi";
  const otherPath = otherLocaleHref(pathname, locale);
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const openSub = (key: string) => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setSubOpen(key);
  };
  const scheduleCloseSub = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setSubOpen(null), 120);
  };

  return (
    <header className="site-nav relative z-50 bg-white/95 backdrop-blur dark:bg-background/95">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5 lg:px-14"
      >
        <Link
          href={linkTo(locale)}
          className={`shrink-0 rounded-sm transition-opacity hover:opacity-75 ${focusRing}`}
        >
          <Logo artwork={{ wordmark: logo?.wordmark }} className="dark:brightness-0 dark:invert" />
        </Link>

        {/* Figma nav: plain links, purple dot before the active page. Items
            with children open a hover panel that jumps straight to the
            relevant section — the nav is now a map of the site, not just its
            top level. Shown from xl: the full bar (logo + links + theme /
            language + both CTAs) needs ~1131px, so at lg it overflowed the
            viewport and cut the last CTA off. */}
        <nav className="hidden items-center gap-8 xl:flex">
          {items.map((item) => {
            const hasChildren = item.children.length > 0;
            const active = isActive(item.href);
            return (
              <div
                key={item.key}
                className="relative"
                onMouseEnter={hasChildren ? () => openSub(item.key) : undefined}
                onMouseLeave={hasChildren ? scheduleCloseSub : undefined}
              >
                <Link
                  href={item.href}
                  aria-haspopup={hasChildren || undefined}
                  aria-expanded={hasChildren ? subOpen === item.key : undefined}
                  onFocus={hasChildren ? () => openSub(item.key) : undefined}
                  className={`relative flex items-center gap-1.5 rounded-sm py-1 text-[15px] text-ink transition-colors hover:text-purple dark:text-white dark:hover:text-light-purple ${focusRing}`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-active-dot"
                      className="inline-block h-2 w-2 rounded-full bg-purple"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  {item.label}
                  {hasChildren && (
                    <span
                      aria-hidden
                      className={`text-[9px] text-ink/40 transition-transform duration-200 dark:text-white/40 ${subOpen === item.key ? "rotate-180" : ""}`}
                    >
                      ▾
                    </span>
                  )}
                </Link>

                <AnimatePresence>
                  {hasChildren && subOpen === item.key && item.key === "services" && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute left-0 top-full z-50 mt-1"
                    >
                      <div
                        role="menu"
                        aria-label={item.label}
                        className="w-[min(80vw,1060px)] overflow-hidden rounded-card bg-white p-5 ring-1 ring-black/5 sm:p-6 dark:bg-[#171225] dark:ring-white/10"
                      >
                        <div className="grid grid-cols-2 gap-x-5 gap-y-5 md:grid-cols-3 lg:grid-cols-5">
                          {MEGA_GROUPS.map((group) => (
                            <div key={group.key}>
                              <Link
                                href={group.href}
                                className="group/g flex items-center gap-2 rounded-[10px] px-2 py-1.5 text-[13px] font-semibold text-ink transition-colors hover:text-purple dark:text-white dark:hover:text-light-purple"
                              >
                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[5px] bg-violet text-white">
                                  <Icon name={group.icon} className="text-[16px]" />
                                </span>
                                {group.label}
                              </Link>
                              <ul className="mt-1.5 space-y-0.5">
                                {group.children.map((child) => (
                                  <li key={child.key}>
                                    <Link
                                      href={child.href}
                                      role="menuitem"
                                      className="block rounded-[8px] px-2 py-1.5 text-[12.5px] leading-snug text-ink/70 transition-colors hover:bg-pastel-purple/50 hover:text-ink dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
                                    >
                                      {child.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                        <div className="mt-5 flex items-center justify-between border-t border-black/[0.06] pt-4 dark:border-white/10">
                          <Link href={linkTo(locale, "/services")} className="text-[12px] font-medium text-purple hover:underline dark:text-light-purple">
                            {locale === "fi" ? "Kaikki palvelut →" : "All services →"}
                          </Link>
                          <Link href={linkTo(locale, "/engine")} className="text-[12px] font-medium text-purple hover:underline dark:text-light-purple">
                            {dict.nav.engine} →
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  {hasChildren && subOpen === item.key && item.key !== "services" && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute left-1/2 top-full z-50 mt-1 -translate-x-1/2"
                    >
                      <div
                        role="menu"
                        aria-label={item.label}
                        className="min-w-56 overflow-hidden rounded-card bg-white p-2 ring-1 ring-black/5 dark:bg-[#171225] dark:ring-white/10"
                      >
                        {item.children.map((child) => (
                          <Link
                            key={child.key}
                            href={child.href}
                            role="menuitem"
                            className="block rounded-[10px] px-4 py-2.5 text-sm text-ink/80 transition-colors hover:bg-pastel-purple/50 hover:text-ink focus-visible:bg-pastel-purple/50 dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-5">
          <ThemeToggle label={dict.common.toggleTheme} />
          <Link
            href={otherPath}
            className={`rounded-sm text-sm font-medium tracking-wide text-ink/60 transition-colors hover:text-ink dark:text-white/60 dark:hover:text-white ${focusRing}`}
          >
            {other.toUpperCase()}
          </Link>
          {/* Primary CTA — BRAND_GUIDELINES.md §5 solid black pill. On dark a
              black pill disappears into the base, so it becomes the brand
              primary accent (§8) instead. */}
          <Link
            href={linkTo(locale, "/engine")}
            className={`hidden rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-purple xl:inline-flex dark:bg-purple dark:text-white dark:hover:bg-violet ${focusRing}`}
          >
            {engineCta}
          </Link>
          {/* Secondary CTA — Brief us (Antti's header CTA) */}
          <Link
            href={linkTo(locale, "/brief")}
            className={`hidden rounded-full border border-ink/30 px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white xl:inline-flex dark:border-white/30 dark:text-white dark:hover:bg-white dark:hover:text-ink ${focusRing}`}
          >
            {briefCta}
          </Link>
          <button
            aria-label={dict.common.menu}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className={`flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-full xl:hidden ${focusRing}`}
          >
            <span className={`h-[1.5px] w-5 bg-ink transition-transform dark:bg-white ${open ? "translate-y-[3.5px] rotate-45" : ""}`} />
            <span className={`h-[1.5px] w-5 bg-ink transition-transform dark:bg-white ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex max-h-[calc(100svh-8rem)] flex-col gap-1 overflow-y-auto overscroll-contain border-t border-black/5 px-6 pb-8 pt-4 xl:hidden dark:border-white/10"
          >
            {items.map((item) => (
              <div key={item.key}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-2 rounded-sm py-2.5 text-base text-ink transition-colors hover:text-purple dark:text-white dark:hover:text-light-purple ${focusRing}`}
                >
                  {isActive(item.href) && <span className="h-2 w-2 rounded-full bg-purple" />}
                  {item.label}
                </Link>
                {/* Mobile: services collapse into an accordion (5 groups are
                    too long to dump open); others as flat list. */}
                {item.children.length > 0 && item.key === "services" && (
                  <div className="ml-3 flex flex-col gap-3 border-l border-black/10 pl-3 dark:border-white/10">
                    {MEGA_GROUPS.map((group) => (
                      <div key={group.key}>
                        <Link
                          href={group.href}
                          onClick={() => setOpen(false)}
                          className={`flex items-center gap-2 py-1 text-[13px] font-semibold text-ink dark:text-white ${focusRing}`}
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[4px] bg-violet text-white">
                            <Icon name={group.icon} className="text-[14px]" />
                          </span>
                          {group.label}
                        </Link>
                        <div className="mt-0.5 flex flex-col">
                          {group.children.map((child) => (
                            <Link
                              key={child.key}
                              href={child.href}
                              onClick={() => setOpen(false)}
                              className={`rounded-sm py-1.5 pl-8 text-[13px] text-ink/60 transition-colors hover:text-purple dark:text-white/60 dark:hover:text-light-purple ${focusRing}`}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {item.children.length > 0 && item.key !== "services" && (
                  <div className="ml-4 flex flex-col border-l border-black/10 dark:border-white/10">
                    {item.children.map((child) => (
                      <Link
                        key={child.key}
                        href={child.href}
                        onClick={() => setOpen(false)}
                        className={`rounded-sm py-2 pl-4 text-sm text-ink/60 transition-colors hover:text-purple dark:text-white/60 dark:hover:text-light-purple ${focusRing}`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link
              href={linkTo(locale, "/engine")}
              onClick={() => setOpen(false)}
              className={`mt-3 w-full rounded-full bg-ink px-5 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-purple dark:bg-purple dark:hover:bg-violet ${focusRing}`}
            >
              {engineCta}
            </Link>
            <Link
              href={linkTo(locale, "/brief")}
              onClick={() => setOpen(false)}
              className={`mt-2 w-full rounded-full border border-ink/30 px-5 py-3 text-center text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-white dark:border-white/30 dark:text-white dark:hover:bg-white dark:hover:text-ink ${focusRing}`}
            >
              {briefCta}
            </Link>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
