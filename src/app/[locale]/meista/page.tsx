import { isLocale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionary";
import { pageSeo, robotsDirective } from "@/lib/pageSeo";
import { JsonLd } from "@/components/JsonLd";
import { ORGANIZATION_ID, absolute, homeCrumb, pageGraph, type Crumb } from "@/lib/jsonld";
import { getSiteContent } from "@/lib/cms";
import { imageSlot } from "@/content/imageSlots";
import { Container, HeroPill } from "@/components/Container";
import { SplitHeadline } from "@/components/SplitHeadline";
import { PillButton } from "@/components/PillButton";
import { TextCta } from "@/components/TextCta";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { PillMarquee } from "@/components/marquee/PillMarquee";
import { LogoStrip } from "@/components/marquee/LogoStrip";
import { TeamMarquee } from "@/components/TeamMarquee";
import { ContactBanner } from "@/components/ContactBanner";
import { StatGrid } from "@/components/StatGrid";
import { PrinciplesGrid } from "@/components/PrinciplesGrid";
import { MediaAsset } from "@/components/MediaAsset";
import { linkTo } from "@/lib/links";
import { ogImage } from "@/lib/ogImage";

export async function generateMetadata({ params }: PageProps<"/[locale]/meista">) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  // CMS-owned SEO for this route, falling back to the dictionary entry and the
  // page's own social image so an untouched row changes nothing.
  const seo = await pageSeo("about", locale, {
    title: dict.seo.about.title,
    description: dict.seo.about.description,
    image: ogImage("/images/brand/group.webp"),
  });
  return {
    title: seo.title,
    description: seo.description,
    robots: robotsDirective(seo.robots),
    alternates: { canonical: seo.canonical || linkTo(locale, "/meista"), languages: { "fi-FI": "/meista", en: "/en/meista", "x-default": "/meista" } },
    openGraph: {
      type: "website" as const,
      siteName: "NØRR3",
      url: `https://norr3.fi${linkTo(locale, "/meista")}`,
      locale: locale === "fi" ? "fi_FI" : "en_US",
      title: seo.title,
      description: seo.description,
      images: [{ url: ogImage(seo.image), width: 2000, height: 1333, alt: "The NØRR3 team in the Helsinki studio" }],
    },
    twitter: { card: "summary_large_image" as const, title: seo.title, description: seo.description, images: [ogImage(seo.image)] },
  };
}

export default async function AboutPage({ params }: PageProps<"/[locale]/meista">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = await getSiteContent();
  const { clients } = content.brand;
  const dict = content.dictionaries[locale];
  // Alt falls back to the dictionary value this page already used.
  const storyPhoto = imageSlot(content, "about.story", locale, {
    src: "/images/brand/group.webp",
    alt: dict.about.story.photoAlt,
  });
  const { valuePills } = content.brand;
  const a = dict.about;

  const pills = valuePills.map((p) => ({ id: p.id, icon: p.icon, label: p[locale] }));

  // Structured data: the same CMS-managed SEO the <head> uses, this page's
  // WebPage node and its breadcrumb (Home › about).
  const seo = await pageSeo("about", locale, {
    title: dict.seo.about.title,
    description: dict.seo.about.description,
    image: ogImage("/images/brand/group.webp"),
  });
  const url = absolute(seo.canonical || linkTo(locale, "/meista"));
  const crumbs: Crumb[] = [homeCrumb(locale), { name: dict.nav.about }];
  const jsonLd = pageGraph({ url, locale, name: seo.title, description: seo.description, image: seo.image, type: "AboutPage", extra: { about: { "@id": ORGANIZATION_ID }, mainEntity: { "@id": ORGANIZATION_ID } }, crumbs });

  return (
    <>
      <JsonLd data={jsonLd} />
      {/*
        Same section rhythm as Home / Services / Team: a run of base-background
        sections opens with `pt-24 lg:pt-32` and every member closes with
        `pb-24 lg:pb-32`; full-bleed bands reset the run.
      */}

      {/* Hero — no middle graphic here: the story section below carries the
          group photo, and a second visual in the fold would fight it. */}
      <Container className="pt-12 lg:pt-20">
        <Reveal>
          <HeroPill>{a.pill}</HeroPill>
        </Reveal>
        <SplitHeadline
          left={a.heroLeft}
          accent={a.heroAccent}
          className="mt-6 text-[min(9vw,7.5rem)] leading-none"
        />
      </Container>
      <Container className="pb-24 pt-12 lg:pb-32">
        <Reveal className="flex flex-col items-start gap-6">
          <p className="max-w-md text-[15px] leading-relaxed text-ink/80 lg:text-base dark:text-white/80">
            {a.heroBody}
          </p>
          <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
            <PillButton href={linkTo(locale, "/contact")}>{dict.common.contactUs}</PillButton>
            <PillButton href={linkTo(locale, "/toihin-meille")} variant="secondary">
              {dict.common.openJobs}
            </PillButton>
            <TextCta href={linkTo(locale, "/tiimi")}>{dict.common.heroMeetTeam}</TextCta>
          </div>
        </Reveal>
      </Container>

      <LogoStrip clients={clients} locale={locale} />

      {/* The story — photo left, narrative right */}
      <section className="pb-24 pt-24 lg:pb-32 lg:pt-32">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal className="overflow-hidden rounded-card">
              <MediaAsset
                src={storyPhoto.src}
                width={2000}
                height={1333}
                alt={storyPhoto.alt}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </Reveal>
            <Reveal delay={0.05} className="flex flex-col items-start gap-6">
              <h2 className="text-4xl font-medium leading-[1.1] tracking-tight text-ink lg:text-5xl dark:text-white">
                {a.story.heading}
              </h2>
              <p className="text-[15px] leading-relaxed text-ink/70 lg:text-base dark:text-white/70">
                {a.story.body}
              </p>
              <div className="space-y-5">
                {a.story.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="max-w-xl text-[15px] leading-relaxed text-ink/70 lg:text-base dark:text-white/70"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Values — a tinted band so the intro and the value pills read as one
          unit instead of a floating centred header over a lone strip. The
          intro is left-aligned editorial (Figma style); the marquee runs
          full-bleed beneath it inside the same band. */}
      <section className="bg-pastel-purple/40 py-24 lg:py-32 dark:bg-white/[0.04]">
        <Container>
          <Reveal>
            <h2 className="max-w-4xl text-4xl font-medium leading-[1.1] tracking-tight text-ink lg:text-5xl dark:text-white">
              {a.values.heading}
            </h2>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-ink/70 lg:text-base dark:text-white/70">
              {a.values.body}
            </p>
          </Reveal>
        </Container>
        <div className="mt-12 lg:mt-16">
          <PillMarquee items={pills} />
        </div>
      </section>

      {/* Principles — three equal cards side by side. Top padding separates
          this from the tinted Arvomme band above; the "what the three add up
          to" line lives in the header body. */}
      <section className="py-24 lg:py-32">
        <Container>
          <SectionHeader heading={a.principles.heading} body={a.principles.body} />
          <div className="mt-14 lg:mt-16">
            <PrinciplesGrid items={a.principles.items} />
          </div>
        </Container>
      </section>

      {/* Big numbers */}
      <section className="pb-24 lg:pb-32">
        <Container>
          <StatGrid stats={a.stats.items.map((s) => ({ ...s }))} locale={locale} label={a.stats.heading} />
        </Container>
      </section>


      <ContactBanner
        locale={locale}
        heading={dict.banner.heading}
        body={dict.banner.body}
        cta={dict.common.contactUs}
        tone="yellow"
      />

      {/* Team teaser — the sliding roster, with the full team one click away */}
      <section className="pb-24 pt-24 lg:pb-32 lg:pt-32">
        <Container>
          <SectionHeader heading={a.team.heading} body={a.team.body} />
        </Container>
        <div className="mt-14 lg:mt-16">
          <TeamMarquee locale={locale} members={content.team} />
        </div>
        <Container className="mt-12 flex justify-center">
          <PillButton href={linkTo(locale, "/tiimi")}>{dict.common.meetTeam}</PillButton>
        </Container>
      </section>

      <ContactBanner
        locale={locale}
        heading={dict.banner.heading}
        body={dict.banner.body}
        cta={dict.common.contactUs}
        tone="lavender"
      />
    </>
  );
}
