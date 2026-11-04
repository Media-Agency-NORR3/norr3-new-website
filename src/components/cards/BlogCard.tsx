import Link from "next/link";
import { readingMinutes, type Insight } from "@/content/insights";
import type { Locale } from "@/i18n/config";
import { slugLink } from "@/lib/links";

/**
 * Blog card per Figma: a photo OR a lavender tile with a giant ghost figure,
 * then a date · read-time meta line, title, excerpt and a "Read more →" text
 * link. `minReadLabel` is what makes the read time appear — every blog grid on
 * the site passes it, so the estimate is stated the same way everywhere.
 */
export function BlogCard({
  post,
  locale,
  readMoreLabel,
  minReadLabel,
}: {
  /** CMS posts carry a derived `readingMinutes`; bundled ones do not. */
  post: Insight & { readingMinutes?: number };
  locale: Locale;
  readMoreLabel: string;
  minReadLabel?: string;
}) {
  const content = post[locale];
  const minutes = post.readingMinutes ?? readingMinutes(content.body);
  return (
    <Link
      href={slugLink(locale, post.slug, post.slugEn)}
      className="group flex h-full flex-col rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple dark:focus-visible:outline-light-purple"
    >
      <div className="aspect-[5/4] overflow-hidden">
        {post.image ? (
          <img
            src={post.image}
            alt={content.title}
            className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-pastel-purple/70 dark:bg-white/[0.06]">
            <span className="select-none text-7xl font-medium text-white/80 lg:text-8xl">
              {post.ghost}
            </span>
          </div>
        )}
      </div>
      <p className="mt-4 text-xs text-ink/50 dark:text-white/50">
        {post.date}
        {minReadLabel && ` · ${minutes} ${minReadLabel}`}
      </p>
      <h3 className="mt-1.5 text-base font-medium leading-snug text-ink transition-colors group-hover:text-purple dark:text-white dark:group-hover:text-light-purple">
        {content.title}
      </h3>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink/65 dark:text-white/65">{content.excerpt}</p>
      <span className="mt-auto inline-flex items-center gap-1 pt-4 text-xs font-medium text-ink transition-transform group-hover:translate-x-0.5 dark:text-white">
        {readMoreLabel} <span aria-hidden>→</span>
      </span>
    </Link>
  );
}
