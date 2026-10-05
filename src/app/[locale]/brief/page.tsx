import { isLocale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionary";
import { getSiteContent } from "@/lib/cms";
import { briefChannels, dataset } from "@/content/datasets";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { BriefForm } from "@/components/BriefForm";
import { linkTo } from "@/lib/links";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  const url = `https://norr3.fi${linkTo(locale, "/brief")}`;
  return {
    title: dict.brief.metaTitle,
    description: dict.brief.metaDescription,
    alternates: {
      canonical: linkTo(locale, "/brief"),
      languages: { "fi-FI": "/brief", en: "/en/brief", "x-default": "/brief" },
    },
    openGraph: {
      type: "website" as const,
      siteName: "NØRR3",
      url,
      locale: locale === "fi" ? "fi_FI" : "en_US",
      title: dict.brief.metaTitle,
      description: dict.brief.metaDescription,
      images: [{ url: "/images/brand/og-image.jpg", width: 1200, height: 630, alt: "NØRR3" }],
    },
    twitter: {
      card: "summary_large_image" as const,
      title: dict.brief.metaTitle,
      description: dict.brief.metaDescription,
      images: ["/images/brand/og-image.jpg"],
    },
  };
}

export default async function BriefPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = await getSiteContent();
  const dict = content.dictionaries[locale];

  return (
    <>
      {/* Hero */}
      <Container className="pt-12 lg:pt-20">
        <Reveal>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-purple dark:text-light-purple">
            {dict.brief.pill}
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="mt-5 max-w-3xl text-[clamp(2.5rem,7vw,6rem)] font-medium leading-[0.95] tracking-tight text-ink dark:text-white">
            {dict.brief.heroLeft} <span className="text-purple dark:text-yellow">_{dict.brief.heroAccent}</span>
          </h1>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-ink/70 dark:text-white/70">
            {dict.brief.heroBody}
          </p>
        </Reveal>
      </Container>

      {/* Form */}
      <Container className="pb-24 pt-12 lg:pb-32">
        <div className="rounded-card bg-white p-8 ring-1 ring-black/5 sm:p-10 dark:bg-white/[0.04] dark:ring-white/10">
          <BriefForm
            locale={locale}
            dict={dict.brief}
            channels={dataset(content.datasets, "briefChannels", locale, briefChannels[locale])}
          />
        </div>
      </Container>
    </>
  );
}