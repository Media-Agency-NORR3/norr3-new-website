import { isLocale } from "@/i18n/config";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getDictionary } from "@/lib/dictionary";
import { pageSeo, robotsDirective } from "@/lib/pageSeo";
import { JsonLd } from "@/components/JsonLd";
import { ORGANIZATION_ID, absolute, homeCrumb, pageGraph, type Crumb } from "@/lib/jsonld";
import { getSiteContent } from "@/lib/cms";
import { imageSlot } from "@/content/imageSlots";
import { Container, HeroPill } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { ContactForm } from "@/components/ContactForm";
import { TeamSlider } from "@/components/TeamSlider";
import { SectionHeader } from "@/components/SectionHeader";

import { LogoStrip } from "@/components/marquee/LogoStrip";
import { PillButton } from "@/components/PillButton";
import { BookingButton } from "@/components/BookingButton";
import { Icon } from "@/components/Icon";
import { MediaAsset } from "@/components/MediaAsset";
import { linkTo } from "@/lib/links";
import { ogImage } from "@/lib/ogImage";

/** The five people who take direct contact on this page. The rest of the
 *  roster lives on /team — this row is a routing aid, not a second roster. */
const LEAD_CONTACT_NAMES = [
  "Antti Ujainen",
  "Maria Malila",
  "Marika Salovaara",
  "Anne-Mari Lahtinen",
  "Karoliina Mäkelä",
];

export async function generateMetadata({ params }: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  // CMS-owned SEO for this route, falling back to the dictionary entry and the
  // page's own social image so an untouched row changes nothing.
  const seo = await pageSeo("contact", locale, {
    title: dict.seo.contact.title,
    description: dict.seo.contact.description,
    image: ogImage("/images/brand/group.webp"),
  });
  return {
    title: seo.title,
    description: seo.description,
    robots: robotsDirective(seo.robots),
    alternates: {
      canonical: seo.canonical || linkTo(locale, "/contact"),
      languages: { "fi-FI": "/contact", en: "/en/contact", "x-default": "/contact" },
    },
    openGraph: {
      type: "website" as const,
      siteName: "NØRR3",
      url: `https://norr3.fi${linkTo(locale, "/contact")}`,
      locale: locale === "fi" ? "fi_FI" : "en_US",
      title: seo.title,
      description: seo.description,
      images: [
        {
          url: ogImage(seo.image),
          width: 1200,
          height: 800,
          alt: dict.contact.photoAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image" as const,
      title: seo.title,
      description: seo.description,
      images: [ogImage(seo.image)],
    },
  };
}

export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = await getSiteContent();
  const { clients } = content.brand;
  const dict = content.dictionaries[locale];
  const contactPhoto = imageSlot(content, "contact.portrait", locale, {
    src: "/images/brand/group.webp",
    alt: dict.contact.photoAlt,
  });
  const team = content.team;

  // Ordered by the list above, not by roster order, and silently skipping a
  // name that ever leaves team.ts rather than rendering a hole.
  const leadContacts = (() => {
    const flagged = team.filter((m) => m.lead);
    if (flagged.length > 0) return flagged;
    return LEAD_CONTACT_NAMES.map((name) => team.find((m) => m.name === name)).filter((m) => m !== undefined);
  })();

  // Structured data: the same CMS-managed SEO the <head> uses, this page's
  // WebPage node and its breadcrumb (Home › contact).
  const seo = await pageSeo("contact", locale, {
    title: dict.seo.contact.title,
    description: dict.seo.contact.description,
    image: ogImage("/images/brand/group.webp"),
  });
  const url = absolute(seo.canonical || linkTo(locale, "/contact"));
  const crumbs: Crumb[] = [homeCrumb(locale), { name: dict.nav.contact }];
  const jsonLd = pageGraph({ url, locale, name: seo.title, description: seo.description, image: seo.image, type: "ContactPage", extra: { about: { "@id": ORGANIZATION_ID }, mainEntity: { "@id": ORGANIZATION_ID } }, crumbs });

  return (
    <>
      <JsonLd data={jsonLd} />
      {/* Yellow hero band, echoing the design's contact banner. The
          response-time promise sits here rather than under the Send button —
          the reassurance is worth more before someone starts typing. */}
      <section className="bg-yellow">
        <Container className="py-12 lg:py-16">
          <Reveal>
            {/* The hero band stays yellow in dark mode, so the pill keeps its purple ink. */}
            <HeroPill onLight>{dict.contact.pill}</HeroPill>
          </Reveal>
          <Reveal delay={0.05} className="mt-5">
            <h1 className="text-[min(8vw,5.25rem)] font-medium leading-[0.95] tracking-tight text-ink">
              {dict.contact.heading}
            </h1>
          </Reveal>
          <Reveal delay={0.15} className="mt-4">
            <p className="max-w-xl text-[15px] leading-relaxed text-ink/80 lg:text-base">{dict.contact.body}</p>
          </Reveal>
          <Reveal delay={0.2} className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
            <BookingButton kind="meeting" locale={locale} variant="secondary">
              {dict.common.bookCall}
            </BookingButton>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-medium text-ink/80">
              <Icon name="schedule" style={{ fontSize: "16px" }} />
              {dict.contact.responseTime}
            </p>
          </Reveal>
        </Container>
      </section>

      <Container className="pb-24 pt-16 lg:pb-32 lg:pt-24">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:items-start lg:gap-16">
          <Reveal>
            {/* Human face before the details — dims reserved so nothing shifts */}
            <div className="aspect-[3/2] w-full overflow-hidden rounded-card">
              <MediaAsset
                src={contactPhoto.src}
                alt={contactPhoto.alt}
                width={1200}
                height={800}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>

            <ul className="mt-8 space-y-3">
              {[
                {
                  href: "mailto:info@norr3.fi",
                  icon: "mail",
                  label: dict.common.email,
                  value: dict.footer.email,
                },
              ].map((row) => (
                <li key={row.href}>
                  <a
                    href={row.href}
                    className="group flex items-center gap-4 rounded-card p-3 transition-colors hover:bg-grey/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple dark:hover:bg-white/[0.06] dark:focus-visible:outline-light-purple"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[5px] bg-purple text-white">
                      <Icon name={row.icon} style={{ fontSize: "20px" }} />
                    </span>
                    <span>
                      <span className="block text-[11px] font-medium uppercase tracking-[0.14em] text-ink/50 dark:text-white/50">
                        {row.label}
                      </span>
                      <span className="block text-lg font-medium text-ink transition-colors group-hover:text-purple dark:text-white dark:group-hover:text-light-purple">
                        {row.value}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>


          </Reveal>

          <Reveal delay={0.1}>
            <ContactForm dict={dict.contact} locale={locale} />
            <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-ink/55 dark:text-white/55">
              <Icon name="lock" style={{ fontSize: "16px" }} />
              <span>
                {dict.contact.privacyNote}{" "}
                <Link
                  href={linkTo(locale, "/tietosuojaseloste")}
                  className="rounded-sm font-medium text-purple underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple dark:text-light-purple dark:focus-visible:outline-light-purple"
                >
                  {dict.footer.privacy}
                </Link>
              </span>
            </p>
          </Reveal>
        </div>
      </Container>

      {/* Bottom card group: Find us + Billing (combined) + Seller instructions.
          The billing card now carries the company identity + e-invoicing together. */}
      <section id="find-us" className="scroll-mt-24 pb-24 lg:pb-32">
        <Container>
          <div className="grid gap-card-gap md:grid-cols-2 lg:grid-cols-3">
            {/* 1. Find us — the existing office card */}
            <Reveal className="rounded-card bg-light-purple p-card-pad dark:bg-white/[0.04] dark:ring-1 dark:ring-white/10">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[5px] bg-violet text-white">
                  <Icon name="location_on" style={{ fontSize: "22px" }} />
                </span>
                <h3 className="text-xs font-medium uppercase tracking-[0.14em] text-ink/70 dark:text-white/70">
                  {dict.contact.locationHeading}
                </h3>
              </div>
              <address className="mt-5 space-y-1 text-[15px] not-italic leading-relaxed text-ink/80 dark:text-white/80">
                {dict.footer.addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Pursimiehenkatu+26+C%2C+00150+Helsinki"
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-ink/40 px-5 py-2 text-[11px] font-medium uppercase tracking-[0.08em] text-ink transition-colors hover:bg-ink hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple dark:border-white/40 dark:text-white dark:hover:bg-white dark:hover:text-ink dark:focus-visible:outline-light-purple"
              >
                {dict.contact.mapLink}
                <Icon name="arrow_outward" style={{ fontSize: "14px" }} />
              </a>
            </Reveal>

            {/* 2. Billing — company identity + e-invoicing in one card */}
            <Reveal delay={0.05} className="rounded-card bg-light-purple p-card-pad dark:bg-white/[0.04] dark:ring-1 dark:ring-white/10">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[5px] bg-violet text-white">
                  <Icon name="receipt_long" style={{ fontSize: "22px" }} />
                </span>
                <h3 className="text-xs font-medium uppercase tracking-[0.14em] text-ink/70 dark:text-white/70">
                  {dict.contact.invoicingHeading}
                </h3>
              </div>
              <div className="mt-5 space-y-1 text-[15px] leading-relaxed text-ink/80 dark:text-white/80">
                <p className="font-medium text-ink dark:text-white">{dict.contact.companyName}</p>
                <p>{dict.contact.businessId}</p>
                <p>{dict.contact.companyAddress}</p>
              </div>
              <ul className="mt-4 space-y-1.5 border-t border-black/10 pt-4 text-[15px] leading-relaxed text-ink/80 dark:border-white/10 dark:text-white/80">
                {dict.contact.invoicing.map((row) => (
                  <li key={row.label}>
                    <span className="font-medium">{row.label}: </span>
                    {row.value}
                  </li>
                ))}
              </ul>
            </Reveal>

            {/* 3. Notes for service sellers */}
            <Reveal delay={0.1} className="rounded-card bg-light-purple p-card-pad dark:bg-white/[0.04] dark:ring-1 dark:ring-white/10 md:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[5px] bg-violet text-white">
                  <Icon name="storefront" style={{ fontSize: "22px" }} />
                </span>
                <h3 className="text-xs font-medium uppercase tracking-[0.14em] text-ink/70 dark:text-white/70">
                  {dict.contact.salesHeading}
                </h3>
              </div>
              <p className="mt-5 text-[15px] leading-relaxed text-ink/70 dark:text-white/70">{dict.contact.salesBody}</p>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Lead contacts — the five people worth reaching directly. The full
          roster stays on /team so this page keeps one job. */}
      <section className="pb-24 lg:pb-32">
        <Container>
          <SectionHeader heading={dict.contact.leads.heading} body={dict.contact.leads.body} />
          <TeamSlider
            members={leadContacts}
            locale={locale}
            emailLabel={dict.common.email}
            linkedinLabel={dict.common.linkedin}
            ariaLabel={dict.contact.leads.heading}
          />
          <Reveal className="mt-12 flex justify-center">
            <PillButton href={linkTo(locale, "/tiimi")} variant="secondary">
              {dict.contact.leads.fullTeam}
            </PillButton>
          </Reveal>
        </Container>
      </section>

      <LogoStrip clients={clients} locale={locale} />
    </>
  );
}
