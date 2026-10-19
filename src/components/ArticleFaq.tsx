import type { ArticleFaqSection } from "@/lib/jsonld";
import { Icon } from "@/components/Icon";

/**
 * The FAQ of an insight post as the site's house collapsible — the same
 * hairline-divided rows and turning chevron the CMS block pages use, so a
 * reader meets one pattern everywhere. Native `<details>`/`<summary>` keeps
 * it keyboard-accessible and working without JavaScript, and keeps every
 * question and answer in the served HTML: the FAQPage structured data
 * (built from the same parsed section) quotes exactly this copy.
 */
export function ArticleFaq({ section }: { section: ArticleFaqSection }) {
  return (
    <section className="mt-11">
      <h2
        className="text-[28px] font-medium leading-[1.2] tracking-[-0.015em] text-ink dark:text-white"
        dangerouslySetInnerHTML={{ __html: section.heading }}
      />
      <div className="mt-2 divide-y divide-black/10 dark:divide-white/10">
        {section.items.map((item, index) => (
          <details key={index} className="group py-5">
            <summary className="flex cursor-pointer items-center justify-between gap-4 marker:content-none">
              <h3
                className="flex-1 text-lg font-medium text-ink dark:text-white"
                dangerouslySetInnerHTML={{ __html: item.question }}
              />
              <Icon
                name="expand_more"
                className="shrink-0 text-[22px] text-purple transition-transform group-open:rotate-180 dark:text-light-purple"
              />
            </summary>
            <div className="faq-answer mt-3" dangerouslySetInnerHTML={{ __html: item.answer }} />
          </details>
        ))}
      </div>
    </section>
  );
}
