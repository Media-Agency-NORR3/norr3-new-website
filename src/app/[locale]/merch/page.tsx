import { isLocale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionary";
import { pageSeo, robotsDirective } from "@/lib/pageSeo";
import { getSiteContent } from "@/lib/cms";
import { Container, HeroPill } from "@/components/Container";
import { SplitHeadline } from "@/components/SplitHeadline";
import { PillButton } from "@/components/PillButton";
import { TextCta } from "@/components/TextCta";
import { Reveal } from "@/components/Reveal";
import { StaggerGrid } from "@/components/StaggerGrid";
import { SectionHeader } from "@/components/SectionHeader";
import { Icon } from "@/components/Icon";
import { ProductArt, type ProductArtKind } from "@/components/merch/ProductArt";
import { linkTo } from "@/lib/links";
import { ogImage } from "@/lib/ogImage";

export async function generateMetadata({ params }: PageProps<"/[locale]/merch">) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  const seo = await pageSeo("merch", locale, {
    title: dict.seo.merch.title,
    description: dict.seo.merch.description,
    image: ogImage("/images/brand/team-energy.webp"),
  });
  return {
    title: seo.title,
    description: seo.description,
    robots: robotsDirective(seo.robots),
    alternates: {
      canonical: seo.canonical || linkTo(locale, "/merch"),
      languages: { "fi-FI": "/merch", en: "/en/merch", "x-default": "/merch" },
    },
    openGraph: {
      type: "website" as const,
      siteName: "NØRR3",
      url: `https://norr3.fi${linkTo(locale, "/merch")}`,
      locale: locale === "fi" ? "fi_FI" : "en_US",
      title: seo.title,
      description: seo.description,
      images: [{ url: ogImage(seo.image), width: 1600, height: 1066, alt: "NØRR3 merch" }],
    },
    twitter: { card: "summary_large_image" as const, title: seo.title, description: seo.description, images: [ogImage(seo.image)] },
  };
}

export default async function MerchPage({ params }: PageProps<"/[locale]/merch">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = await getSiteContent();
  const dict = content.dictionaries[locale];
  const m = dict.merch;

  // Orders go by email for now — there is no checkout, so the mailto is the
  // whole funnel. The address comes from the footer so it only lives once.
  const email = dict.footer.email.replace("(at)", "@");
  const orderHref = `mailto:${email}?subject=${encodeURIComponent(m.emailSubject)}`;

  return (
    <>
      <Container className="pt-12 lg:pt-20">
        <Reveal>
          <HeroPill>{m.pill}</HeroPill>
        </Reveal>
        <SplitHeadline
          left={m.heroLeft}
          accent={m.heroAccent}
          className="mt-6 text-[min(9vw,7.5rem)] leading-none"
        />
      </Container>
      <Container className="pb-24 pt-12 lg:pb-32">
        <Reveal className="flex flex-col items-start gap-6">
          <p className="max-w-md text-[15px] leading-relaxed text-ink/80 lg:text-base dark:text-white/80">
            {m.heroBody}
          </p>
          <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
            <PillButton href={orderHref}>{m.cta}</PillButton>
            <TextCta href={linkTo(locale, "/contact")}>{dict.common.contactUs}</TextCta>
          </div>
          <p className="text-xs font-medium text-ink/70 dark:text-white/70">{m.ctaNote}</p>
        </Reveal>
      </Container>

      {/* The threshold offer is the point of the page, so it sits above the
          grid: spend over the line, take the beanie and stickers with you. */}
      <section className="pb-24 lg:pb-32">
        <Container>
          <Reveal className="grid gap-8 rounded-card bg-yellow p-8 text-ink lg:grid-cols-[auto_1fr] lg:items-center lg:gap-12 lg:p-12">
            <span className="flex h-[72px] w-[72px] items-center justify-center rounded-[5px] bg-ink text-yellow">
              <Icon name="storefront" style={{ fontSize: "34px" }} />
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-ink/60">{m.offer.label}</p>
              <h2 className="mt-2 text-3xl font-medium leading-tight lg:text-4xl">{m.offer.heading}</h2>
              <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink/80 lg:text-base">{m.offer.body}</p>
              <p className="mt-2 text-xs text-ink/50">{m.offer.note}</p>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="pb-24 lg:pb-32">
        <Container>
          <SectionHeader heading={m.heading} body={m.body} />
          <StaggerGrid className="mt-14 grid gap-card-gap sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
            {m.products.map((product) => (
              <article
                key={product.id}
                className="flex h-full flex-col rounded-card border border-black/5 bg-white p-6 dark:border-white/10 dark:bg-white/[0.04]"
              >
                <div className="flex h-[190px] items-center justify-center rounded-[5px] bg-offwhite dark:bg-white/5">
                  <ProductArt kind={product.id as ProductArtKind} className="h-[150px] w-auto" />
                </div>
                <h3 className="mt-6 text-lg font-medium text-ink dark:text-white">{product.name}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink/70 dark:text-white/70">{product.body}</p>
                <div className="mt-auto flex items-center justify-between gap-4 pt-6">
                  <span className="text-lg font-medium text-ink dark:text-white">{product.price}</span>
                  <a
                    href={orderHref}
                    className="inline-flex items-center gap-1 rounded-full border border-ink/15 px-4 py-2 text-xs font-medium uppercase tracking-[0.08em] text-ink transition-colors hover:border-ink/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple dark:border-white/20 dark:text-white dark:hover:border-white/50 dark:focus-visible:outline-light-purple"
                  >
                    {m.orderLabel} <span aria-hidden>→</span>
                  </a>
                </div>
              </article>
            ))}
          </StaggerGrid>
        </Container>
      </section>
    </>
  );
}
