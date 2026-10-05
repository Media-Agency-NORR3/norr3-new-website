import { isLocale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionary";
import { pageSeo, robotsDirective } from "@/lib/pageSeo";
import { JsonLd } from "@/components/JsonLd";
import { ORGANIZATION_ID, personRef, absolute, homeCrumb, pageGraph, type Crumb } from "@/lib/jsonld";
import { getSiteContent } from "@/lib/cms";
import { imageSlot } from "@/content/imageSlots";
import { companyStats, dataset } from "@/content/datasets";
import { Container, HeroPill } from "@/components/Container";
import { PillButton } from "@/components/PillButton";
import { Reveal } from "@/components/Reveal";
import { StaggerGrid } from "@/components/StaggerGrid";
import { SectionHeader } from "@/components/SectionHeader";
import { TeamMarquee } from "@/components/TeamMarquee";
import { CultureCard } from "@/components/cards/CultureCard";
import { OpenRoleCard } from "@/components/cards/OpenRoleCard";
import { TeamMemberCard } from "@/components/cards/TeamMemberCard";
import { PhotoInterstitial } from "@/components/PhotoInterstitial";
import { ContactBanner } from "@/components/ContactBanner";
import { StatGrid } from "@/components/StatGrid";
import { CountUpStat } from "@/components/CountUpStat";
import { Icon } from "@/components/Icon";
import { linkTo } from "@/lib/links";
import { ogImage } from "@/lib/ogImage";

export async function generateMetadata({ params }: PageProps<"/[locale]/tiimi">) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  // CMS-owned SEO for this route, falling back to the dictionary entry and the
  // page's own social image so an untouched row changes nothing.
  const seo = await pageSeo("team", locale, {
    title: dict.seo.team.title,
    description: dict.seo.team.description,
    image: ogImage("/images/brand/group.webp"),
  });
  return {
    title: seo.title,
    description: seo.description,
    robots: robotsDirective(seo.robots),
    alternates: { canonical: seo.canonical || linkTo(locale, "/tiimi"), languages: { "fi-FI": "/tiimi", en: "/en/tiimi", "x-default": "/tiimi" } },
    openGraph: {
      type: "website" as const,
      siteName: "NØRR3",
      url: `https://norr3.fi${linkTo(locale, "/tiimi")}`,
      locale: locale === "fi" ? "fi_FI" : "en_US",
      title: seo.title,
      description: seo.description,
      images: [{ url: ogImage(seo.image), width: 2000, height: 1333, alt: "The NØRR3 team in the Helsinki studio" }],
    },
    twitter: { card: "summary_large_image" as const, title: seo.title, description: seo.description, images: [ogImage(seo.image)] },
  };
}

export default async function TeamPage({ params }: PageProps<"/[locale]/tiimi">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = await getSiteContent();
  const dict = content.dictionaries[locale];
  const pillarPhotos = ["team.pillar1", "team.pillar2", "team.pillar3"].map((key, i) =>
    imageSlot(content, key, locale, {
      src: ["/images/brand/team-attitude.webp", "/images/brand/team-technology.webp", "/images/brand/team-talent.webp"][i],
    })
  );
  const teamValuesPhoto = imageSlot(content, "team.values", locale, {
    src: "/images/brand/team-energy.webp",
    alt:
      locale === "fi"
        ? "NØRR3-tiimi juhlii yhteistä saavutusta"
        : "The NØRR3 team celebrating a shared achievement",
  });
  const team = content.team;
  const openRoles = content.openRoles;
  const { valuePills } = content.brand;
  const t = dict.team;

  // The same dataset the home page reads, so the two can never disagree.
  const inNumbers = dataset(content.datasets, "companyStats", locale, companyStats[locale]);

  const pillarAlts = locale === "fi"
    ? [
        "NØRR3:n kollegat vilkkaassa keskustelussa neuvotteluhuoneessa Helsingin studiolla",
        "Kaksi NØRR3:n asiantuntijaa analysoi kampanjadataa iMacilla yhdessä",
        "NØRR3:n tiimi nauramassa yhdessä studion loungen sohvalla",
      ]
    : [
        "NØRR3 colleagues in a lively meeting-room discussion in the Helsinki studio",
        "Two NØRR3 specialists analysing campaign data on an iMac together",
        "NØRR3 team laughing together on the studio lounge sofa",
      ];

  // Structured data: the same CMS-managed SEO the <head> uses, this page's
  // WebPage node and its breadcrumb (Home › team).
  const seo = await pageSeo("team", locale, {
    title: dict.seo.team.title,
    description: dict.seo.team.description,
    image: ogImage("/images/brand/group.webp"),
  });
  const url = absolute(seo.canonical || linkTo(locale, "/tiimi"));
  const crumbs: Crumb[] = [homeCrumb(locale), { name: dict.social.teamHeading }];
  const jsonLd = pageGraph({
    url,
    locale,
    name: seo.title,
    description: seo.description,
    image: seo.image,
    type: "CollectionPage",
    extra: {
      about: { "@id": ORGANIZATION_ID },
      // Every member by their profile's Person @id, so this list, the home
      // page's Organization.employee and the profile pages all agree.
      mainEntity: {
        "@type": "ItemList",
        "@id": `${url}#list`,
        numberOfItems: team.length,
        itemListElement: team.map((m, i) => ({ "@type": "ListItem", position: i + 1, item: personRef(m, locale) })),
      },
    },
    crumbs,
  });

  return (
    <>
      <JsonLd data={jsonLd} />
      {/*
        Section rhythm shared with Home / Services / Engine / Cases: a run of
        base-background sections opens with `pt-24 lg:pt-32` and every member
        closes with `pb-24 lg:pb-32`; full-width bands reset the run.
      */}

      {/* Hero — headline + always-sliding team strip */}
      <Container className="pt-12 lg:pt-20">
        <Reveal>
          <HeroPill>{t.pill}</HeroPill>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="mt-6 max-w-5xl text-[min(8vw,6.25rem)] font-medium leading-[1.02] tracking-tight text-ink dark:text-white">
            {t.heroHeadline}
          </h1>
        </Reveal>
      </Container>
      <div className="mt-10 lg:mt-12">
        <TeamMarquee locale={locale} members={team} />
      </div>
      <Container className="pb-24 pt-12 lg:pb-32">
        <Reveal className="flex flex-col items-start gap-6">
          <p className="max-w-md whitespace-pre-line text-[15px] leading-relaxed text-ink/80 lg:text-base dark:text-white/80">
            {t.heroBody}
          </p>
          <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
            <PillButton href={linkTo(locale, "/contact")}>{dict.common.contactUs}</PillButton>
            {/* The roles section is the second reason people open this page —
                give it a route in from the fold instead of a long scroll. */}
            <PillButton href={linkTo(locale, "/tiimi#open-roles")} variant="secondary">
              {dict.common.openJobs}
            </PillButton>
            {/* Team Social: the same people, posting — profiles hang off the cards below. */}
            <PillButton href={linkTo(locale, "/feed")} variant="text">
              {dict.social.teamFeedCta}
            </PillButton>
          </div>
        </Reveal>
      </Container>

      {/* Intro + pillars */}
      <section className="border-t border-black/5 pb-24 pt-24 lg:pb-32 lg:pt-32 dark:border-white/10">
        <Container>
          <SectionHeader heading={t.intro.heading} body={t.intro.body} />
          <div className="mt-16 space-y-20 lg:mt-20 lg:space-y-28">
            {t.pillars.map((pillar, i) => (
              <Reveal key={pillar.title} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
                <div className={`aspect-[4/3] overflow-hidden rounded-card ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                  <img
                    src={pillarPhotos[i].src}
                    alt={pillarPhotos[i].alt || pillarAlts[i]}
                    width={1600}
                    height={1066}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex h-full flex-col justify-center">
                  {/* Index numerals — the same numbering device the service and
                      culture cards use, so the three brand pillars read as a
                      sequence rather than three unrelated photo rows. */}
                  <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-purple dark:text-light-purple">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-3 text-3xl font-medium leading-[1.1] tracking-tight text-ink lg:text-4xl dark:text-white">
                    {pillar.title}
                  </h3>
                  <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-ink/70 lg:text-base dark:text-white/70">
                    {pillar.body}
                  </p>
                  <div className={`mt-10 grid gap-8 ${pillar.stats.length > 2 ? "grid-cols-3" : "grid-cols-2"}`}>
                    {pillar.stats.map((s) => (
                      <div key={s.label} className="border-t border-black/20 pt-3 dark:border-white/20">
                        <p className="text-3xl font-medium leading-[1.15] tabular-nums tracking-[-0.04em] text-ink lg:text-4xl dark:text-white">
                          <CountUpStat value={s.value} suffix={"suffix" in s ? s.suffix : undefined} locale={locale} />
                        </p>
                        <p className="mt-2 text-[13px] leading-relaxed text-ink/60 dark:text-white/60">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-24 lg:mt-32">
            <StatGrid stats={inNumbers} locale={locale} label={dict.common.inNumbers} />
          </div>
        </Container>
      </section>

      {/* Culture */}
      <section className="pb-24 lg:pb-32">
        <Container>
          <SectionHeader heading={t.culture.heading} body={t.culture.body} />
          <StaggerGrid className="mt-14 grid gap-card-gap sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
            {t.culture.principles.map((p, i) => (
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

      <Container className="pb-24 lg:pb-32">
        <PhotoInterstitial
          image={teamValuesPhoto.src}
          alt={teamValuesPhoto.alt}
          caption={t.valuesCaption}
          pills={valuePills.map((p) => ({ id: p.id, icon: p.icon, label: p[locale] }))}
        />
      </Container>

      {/* Management team — the full roster, the site's most human screen */}
      <section id="tiimi" className="scroll-mt-24 pb-24 lg:pb-32">
        <Container>
          <SectionHeader heading={t.management.heading} body={t.management.body} />
          {/* Four columns from xl so 18 tiles read as one wall of faces rather
              than six long rows; the stagger stays per-card. No closing "View
              all" tile: this already is everyone, and the open roles follow. */}
          <StaggerGrid className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 xl:grid-cols-4">
            {team.map((m) => (
              <TeamMemberCard
                houseBio={content.houseBio}
                key={m.id}
                member={m}
                locale={locale}
                profileHref={linkTo(locale, `/tiimi/${m.id}`)}
                linkedinLabel={dict.common.linkedin}
                emailLabel={dict.common.email}
              />
            ))}
          </StaggerGrid>
        </Container>
      </section>

      {/* Open roles — anchored, so the hero CTA has somewhere to land */}
      <section id="open-roles" className="scroll-mt-24 pb-24 lg:pb-32">
        <Container>
          <SectionHeader heading={t.openRoles.heading} body={t.openRoles.body} />
          {/* Radical-candor line: a real differentiator in Finnish recruiting,
              so it gets its own beat under the section intro. */}
          <Reveal delay={0.05} className="mx-auto mt-6 flex max-w-3xl items-center justify-center gap-2 text-center">
            <Icon name="drafts" className="text-purple dark:text-light-purple" style={{ fontSize: "18px" }} />
            <p className="text-[15px] font-medium text-ink/80 dark:text-white/80">{t.openRoles.candor}</p>
          </Reveal>
          <StaggerGrid className="mt-14 grid gap-card-gap sm:grid-cols-3 lg:mt-16">
            {openRoles.map((role) => (
              <OpenRoleCard key={role.id} role={role} locale={locale} applyLabel={t.openRoles.apply} />
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
