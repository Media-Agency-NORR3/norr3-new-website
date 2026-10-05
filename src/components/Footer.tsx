"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Dictionary } from "@/content/dictionary";
import type { Locale } from "@/i18n/config";
import { linkTo, publicPath } from "@/lib/links";
import { CookieSettingsButton } from "@/components/CookieSettingsButton";


export function Footer({
  locale,
  dict,
  logo,
}: {
  locale: Locale;
  dict: Dictionary;
  /** Wordmark override, editable in the CMS under Design. */
  logo?: { wordmark: string };
}) {
  const wordmarkSrc = logo?.wordmark?.trim() || "/logo-wordmark.svg";
  return (
    <footer className="bg-purple text-white">
      {/* Giant logo wordmark — the static SVG (no morph, no loop), so it does not
          idle-animate every time it scrolls into view. Drawn through a CSS mask
          in pastel purple (the reversed tint the lavender banners use), so the
          colour is an exact brand token rather than a filter approximation.
          Letters still rise in on scroll for the reveal itself.

          The mask is cropped to the artwork's INK bounds, so the visible edges
          of the wordmark line up with the text columns below. The raw viewBox
          (-20 -35 1145 305) carries ~3% empty space on the left and ~5% on the
          right; the ink sits at 12.19 19.12 1055.68 185.96. Hence mask-size
          1145/1055.68 = 108.46% and the offsets below. The wrapper keeps the
          original spacing to the row above/below with % paddings (which resolve
          against the same content width as the grid's px-6/lg:px-14). */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "0px 0px -60px 0px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto flex max-w-[1600px] items-end justify-center overflow-hidden px-6 lg:px-14"
      >
        <div className="w-full pb-[5.67%] pt-[calc(32px+4.73%)]">
          <div
            className="aspect-[1056/186] w-full select-none bg-pastel-purple"
            style={{
              WebkitMaskImage: `url("${wordmarkSrc}")`,
              maskImage: `url("${wordmarkSrc}")`,
              WebkitMaskSize: "108.46% auto",
              maskSize: "108.46% auto",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "36.04% 45.47%",
              maskPosition: "36.04% 45.47%",
            }}
          />
        </div>
      </motion.div>

      {/* Content-sized columns spread evenly edge-to-edge on desktop: first
          column on the left margin, last on the right, equal gaps between all
          of them (so the menu spans exactly the wordmark's width above without
          a dead hole before the last column). */}
      <div className="mx-auto grid max-w-[1600px] gap-12 px-6 pb-16 pt-24 sm:grid-cols-2 lg:flex lg:justify-between lg:px-14 lg:pt-36">
        <div>
          <p className="text-lg font-medium">NØRR3</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/80">{dict.footer.blurb1}</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/80">{dict.footer.blurb2}</p>
        </div>

        <div>
          <p className="text-lg font-medium">{dict.footer.contactHeading}</p>
          <div className="mt-4 space-y-1 text-sm leading-relaxed text-white/80">
            {dict.footer.addressLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
            <p className="pt-2">{dict.footer.email}</p>
            <p>{dict.footer.phone}</p>
            <div className="pt-2">
              {dict.footer.companyLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <p className="pt-1">
              <Link
                href={linkTo(locale, "/contact")}
                className="rounded-sm underline decoration-white/40 underline-offset-2 transition-colors hover:text-white hover:decoration-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {dict.footer.billing}
              </Link>
            </p>
          </div>
        </div>

        <div>
          <p className="text-lg font-medium">{dict.footer.followHeading}</p>
          <div className="mt-4 space-y-1.5 text-sm text-white/80">
            <a
              href="https://linkedin.com/company/norr3"
              target="_blank"
              rel="noreferrer"
              className="block w-fit rounded-sm transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              LinkedIn
            </a>
            <a
              href="https://instagram.com/norr3.fi"
              target="_blank"
              rel="noreferrer"
              className="block w-fit rounded-sm transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Instagram
            </a>
          </div>
        </div>

        {/* Last column hugs the right edge on desktop so the menu spans the same
            width as the giant wordmark above (the left column anchors the left
            edge, this one anchors the right). Stays left-aligned when stacked. */}
        <div className="lg:text-right">
          <p className="text-lg font-medium">{dict.footer.joinHeading}</p>
          <div className="mt-4 space-y-1.5 text-sm text-white/80">
            {/* Each label now has its own route (About / Careers / Team)
                instead of three links all landing on /team. */}
            {dict.footer.joinLinks.map((item) => (
              <Link
                key={item.key}
                href={linkTo(locale, publicPath(item.path))}
                className="block w-fit rounded-sm transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:ml-auto"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Legal row: real routes now exist, so these are no longer href="#". */}
      <div className="mx-auto flex max-w-[1600px] flex-col gap-2 px-6 pb-8 text-xs text-white/80 sm:flex-row sm:items-center sm:justify-between lg:px-14">
        <p>{dict.footer.copyright}</p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <Link
            href={linkTo(locale, "/tietosuojaseloste")}
            className="rounded-sm underline decoration-white/30 underline-offset-4 transition-colors hover:text-white hover:decoration-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {dict.footer.privacy}
          </Link>
          <Link
            href={linkTo(locale, "/kayttoehdot")}
            className="rounded-sm underline decoration-white/30 underline-offset-4 transition-colors hover:text-white hover:decoration-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {dict.footer.terms}
          </Link>
          <CookieSettingsButton label={dict.cookies.settings} />
        </div>
      </div>
    </footer>
  );
}
