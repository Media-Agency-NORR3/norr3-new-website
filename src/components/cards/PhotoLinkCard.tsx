import Link from "next/link";
import type { ReactNode } from "react";

/**
 * The editorial photo card the site uses wherever a picture leads into a link:
 * 4:3 photo, title, summary, outlined READ MORE pill. The whole card is the
 * link, the photo eases in on hover, and the pill inverts — so the card reads
 * as interactive before the click. `CaseCard` and the home page's About Us
 * blocks both render through this so the two grids stay pixel-identical.
 *
 * `stat` is the optional yellow result badge over the photo — the Figma case
 * card carries its headline number, so a case grid reads as proof at a glance
 * instead of as four summaries. From `md` up it sits bottom-left over the
 * photo; below that it drops into the flow between the photo and the title.
 * On a phone the badge is a third of the card's width, and several case
 * photos carry their own typography in that corner (Sambla's Rahalaitos
 * wordmark, for one) — a badge over the picture there covered the words.
 */
export function PhotoLinkCard({
  href,
  image,
  alt,
  title,
  body,
  ctaLabel,
  stat,
  large = false,
  clampBody = false,
}: {
  href: string;
  image: string;
  alt: string;
  title: string;
  body: string;
  ctaLabel: string;
  stat?: ReactNode;
  large?: boolean;
  clampBody?: boolean;
}) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple dark:focus-visible:outline-light-purple"
    >
      <div className="relative">
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={image}
            alt={alt}
            className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
            loading="lazy"
          />
        </div>
        {stat && (
          <span className="mt-4 flex w-fit items-baseline gap-1.5 rounded-full bg-yellow px-3.5 py-1.5 text-ink md:absolute md:bottom-3 md:left-3 md:mt-0">
            {stat}
          </span>
        )}
      </div>
      <h3
        className={`mt-4 font-medium text-ink transition-colors group-hover:text-purple dark:text-white dark:group-hover:text-light-purple ${
          large ? "text-xl" : "text-base"
        }`}
      >
        {title}
      </h3>
      <p
        className={`mt-2 text-sm leading-relaxed text-ink/65 dark:text-white/65 ${
          clampBody ? "line-clamp-4" : ""
        }`}
      >
        {body}
      </p>
      <span className="mt-4 inline-flex w-fit items-center rounded-full border border-ink/40 px-5 py-2 text-[11px] font-medium uppercase tracking-[0.08em] text-ink transition-colors group-hover:bg-ink group-hover:text-white dark:border-white/40 dark:text-white dark:group-hover:bg-white dark:group-hover:text-ink">
        {ctaLabel}
      </span>
    </Link>
  );
}
