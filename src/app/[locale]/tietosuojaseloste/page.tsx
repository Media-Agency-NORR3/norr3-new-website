import { isLocale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionary";
import { LegalArticle } from "@/components/LegalArticle";
import { JsonLd } from "@/components/JsonLd";
import { homeCrumb, pageGraph, pageUrl } from "@/lib/jsonld";
import { linkTo, legalPath, LEGAL_PATHS } from "@/lib/links";

export async function generateMetadata({ params }: PageProps<"/[locale]/tietosuojaseloste">) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return {
    title: dict.seo.privacy.title,
    description: dict.seo.privacy.description,
    alternates: {
      canonical: legalPath(locale, "privacy"),
      languages: { "fi-FI": legalPath("fi", "privacy"), en: legalPath("en", "privacy"), "x-default": legalPath("fi", "privacy") },
    },
    openGraph: {
      type: "website" as const,
      siteName: "NØRR3",
      url: `https://norr3.fi${legalPath(locale, "privacy")}`,
      locale: locale === "fi" ? "fi_FI" : "en_US",
      title: dict.seo.privacy.title,
      description: dict.seo.privacy.description,
      images: [
        {
          url: "/images/brand/og-image.jpg",
          width: 1200,
          height: 630,
          alt: "The NØRR3 team in the Helsinki studio",
        },
      ],
    },
    twitter: {
      card: "summary_large_image" as const,
      title: dict.seo.privacy.title,
      description: dict.seo.privacy.description,
      images: ["/images/brand/og-image.jpg"],
    },
  };
}

/*
 * The wording is edited in the CMS (`legal.privacy`); dictionary.ts holds the
 * shipped fallback, kept in sync with the published version.
 */
export default async function PrivacyPage({ params }: PageProps<"/[locale]/tietosuojaseloste">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const legal = dict.legal;

  return (
    <>
      <JsonLd
        data={pageGraph({
          url: pageUrl(locale, LEGAL_PATHS[locale].privacy),
          locale,
          name: dict.seo.privacy.title,
          description: dict.seo.privacy.description,
          image: "/images/brand/og-image.jpg",
          crumbs: [homeCrumb(locale), { name: legal.privacy.heading }],
        })}
      />
      <LegalArticle
        pill={legal.privacy.pill}
        heading={legal.privacy.heading}
        intro={legal.privacy.intro}
        updatedLabel={legal.updatedLabel}
        updated={legal.privacy.updated}
        tocLabel={legal.tocLabel}
        sections={legal.privacy.sections}
        relatedLabel={legal.relatedLabel}
        relatedLinks={[
          { href: legalPath(locale, "terms"), label: dict.footer.terms },
          { href: linkTo(locale, "/contact"), label: dict.common.contactUs },
        ]}
      />
    </>
  );
}
