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
import { StaggerGrid } from "@/components/StaggerGrid";
import { SectionHeader } from "@/components/SectionHeader";
import { BenefitCard } from "@/components/cards/BenefitCard";
import { CultureCard } from "@/components/cards/CultureCard";
import { OpenRoleCard } from "@/components/cards/OpenRoleCard";
import { PhotoInterstitial } from "@/components/PhotoInterstitial";
import { ContactBanner } from "@/components/ContactBanner";
import { OpenApplicationCta } from "@/components/OpenApplicationCta";
import { Icon } from "@/components/Icon";
import { linkTo } from "@/lib/links";
import { ogImage } from "@/lib/ogImage";

export async function generateMetadata({ params }: PageProps<"/[locale]/toihin-meille">) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  // CMS-owned SEO for this route, falling back to the dictionary entry and the
  // page's own social image so an untouched row changes nothing.
  const seo = await pageSeo("careers", locale, {
    title: dict.seo.careers.title,
    description: dict.seo.careers.description,
    image: ogImage("/images/brand/team-energy.webp"),
  });
  return {
    title: seo.title,
    description: seo.description,
    robots: robotsDirective(seo.robots),
    alternates: { canonical: seo.canonical || linkTo(locale, "/toihin-meille"), languages: { "fi-FI": "/toihin-meille", en: "/en/toihin-meille", "x-default": "/toihin-meille" } },
    openGraph: {
      type: "website" as const,
      siteName: "NØRR3",
      url: `https://norr3.fi${linkTo(locale, "/toihin-meille")}`,
      locale: locale === "fi" ? "fi_FI" : "en_US",
      title: seo.title,
      description: seo.description,
      images: [{ url: ogImage(seo.image), width: 1600, height: 1066, alt: "The NØRR3 team celebrating a shared achievement" }],
    },
    twitter: { card: "summary_large_image" as const, title: seo.title, description: seo.description, images: [ogImage(seo.image)] },
  };
}

export default async function CareersPage({ params }: PageProps<"/[locale]/toihin-meille">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = await getSiteContent();
  const dict = content.dictionaries[locale];
  const careersValuesPhoto = imageSlot(content, "careers.values", locale, {
    src: "/images/brand/team-energy.webp",
    alt:
      locale === "fi"
        ? "NØRR3-tiimi juhlii yhteistä saavutusta"
        : "The NØRR3 team celebrating a shared achievement",
  });
  const openRoles = content.openRoles;
  const { valuePills } = content.brand;
  const c = dict.careers;

  // Structured data: the same CMS-managed SEO the <head> uses, this page's
  // WebPage node and its breadcrumb (Home › careers).
  const seo = await pageSeo("careers", locale, {
    title: dict.seo.careers.title,
    description: dict.seo.careers.description,
    image: ogImage("/images/brand/team-energy.webp"),
  });
  const url = absolute(seo.canonical || linkTo(locale, "/toihin-meille"));
  const crumbs: Crumb[] = [homeCrumb(locale), { name: dict.nav.careers }];
  const jsonLd = pageGraph({ url, locale, name: seo.title, description: seo.description, image: seo.image, extra: { about: { "@id": ORGANIZATION_ID } }, crumbs });

  return (
    <>
      <JsonLd data={jsonLd} />
      {/* Same section rhythm as the other interior pages: opener
          `pt-12 lg:pt-20`, members close `pb-24 lg:pb-32`, bands reset. */}

      <Container className="pt-12 lg:pt-20">
        <Reveal>
          <HeroPill>{c.pill}</HeroPill>
        </Reveal>
        <SplitHeadline
          left={c.heroLeft}
          accent={c.heroAccent}
          className="mt-6 text-[min(9vw,7.5rem)] leading-none"
        />
      </Container>
      <Container className="pb-24 pt-12 lg:pb-32">
        <Reveal className="flex flex-col items-start gap-6">
          <p className="max-w-md text-[15px] leading-relaxed text-ink/80 lg:text-base dark:text-white/80">
            {c.heroBody}
          </p>
          <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
            {/* Full path + hash, like the team page's roles CTA, so the link
                resolves the same whether it is clicked or copied. */}
            <PillButton href={linkTo(locale, "/toihin-meille#open-roles")}>{dict.common.openJobs}</PillButton>
            <PillButton href={linkTo(locale, "/meista")} variant="secondary">
              {c.culture.cta}
            </PillButton>
            <TextCta href="#open-roles">{dict.common.heroSeeOpenRoles}</TextCta>
          </div>
        </Reveal>
      </Container>

      {/* Open roles — the same yellow role card as the team page, so a role
          reads identically wherever someone meets it. */}
      <section id="open-roles" className="scroll-mt-24 pb-24 lg:pb-32">
        <Container>
          <SectionHeader heading={c.roles.heading} body={c.roles.body} />
          <Reveal delay={0.05} className="mx-auto mt-6 flex max-w-3xl items-center justify-center gap-2 text-center">
            <Icon name="drafts" className="text-purple dark:text-light-purple" style={{ fontSize: "18px" }} />
            <p className="text-[15px] font-medium text-ink/80 dark:text-white/80">{c.roles.candor}</p>
          </Reveal>
          <StaggerGrid className="mt-14 grid gap-card-gap sm:grid-cols-3 lg:mt-16">
            {openRoles.map((role) => (
              <OpenRoleCard key={role.id} role={role} locale={locale} applyLabel={c.roles.apply} />
            ))}
          </StaggerGrid>
        </Container>
      </section>

      {/* Together + open application — right under the open roles so the
          culture promise and the "no fitting role yet" path sit side by side.
          The application form opens in a popup instead of rendering inline. */}
      <section className="pb-24 lg:pb-32">
        <Container>
          <StaggerGrid className="grid gap-card-gap sm:grid-cols-2">
            <BenefitCard icon="diversity_3" title={c.together.heading} body={c.together.body} />
            <OpenApplicationCta dict={c.application} locale={locale} />
          </StaggerGrid>
        </Container>
      </section>

      <Container className="pb-24 lg:pb-32">
        <PhotoInterstitial
          image={careersValuesPhoto.src}
          alt={careersValuesPhoto.alt}
          pills={valuePills.map((p) => ({ id: p.id, icon: p.icon, label: p[locale] }))}
        />
      </Container>

      {/* Culture — the values block shared with the Meistä/Tiimi page */}
      <section className="pb-24 lg:pb-32">
        <Container>
          <SectionHeader heading={c.culture.heading} body={c.culture.body} />
          <StaggerGrid className="mt-14 grid gap-card-gap sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
            {c.culture.principles.map((p, i) => (
              <CultureCard
                key={p.title}
                number={String(i + 1).padStart(2, "0")}
                icon={p.icon}
                title={p.title}
                body={p.body}
              />
            ))}
          </StaggerGrid>
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
