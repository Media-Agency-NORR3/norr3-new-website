import { isLocale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionary";
import { LegalArticle } from "@/components/LegalArticle";
import { linkTo } from "@/lib/links";

export async function generateMetadata({ params }: PageProps<"/[locale]/kayttoehdot">) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return {
    title: dict.seo.terms.title,
    description: dict.seo.terms.description,
    alternates: {
      canonical: linkTo(locale, "/kayttoehdot"),
      languages: { "fi-FI": "/kayttoehdot", en: "/en/kayttoehdot", "x-default": "/kayttoehdot" },
    },
    openGraph: {
      type: "website" as const,
      siteName: "NØRR3",
      url: `https://norr3.fi${linkTo(locale, "/kayttoehdot")}`,
      locale: locale === "fi" ? "fi_FI" : "en_US",
      title: dict.seo.terms.title,
      description: dict.seo.terms.description,
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
      title: dict.seo.terms.title,
      description: dict.seo.terms.description,
      images: ["/images/brand/og-image.jpg"],
    },
  };
}

/*
 * TEMPLATE COPY — the wording lives in dictionary.ts under `legal.terms` and is
 * a structured placeholder for a Finnish marketing agency. It must be reviewed
 * by legal counsel before this page goes live.
 */
export default async function TermsPage({ params }: PageProps<"/[locale]/kayttoehdot">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const legal = dict.legal;

  return (
    <LegalArticle
      pill={legal.terms.pill}
      heading={legal.terms.heading}
      intro={legal.terms.intro}
      updatedLabel={legal.updatedLabel}
      updated={legal.terms.updated}
      tocLabel={legal.tocLabel}
      sections={legal.terms.sections}
      relatedLabel={legal.relatedLabel}
      relatedLinks={[
        { href: linkTo(locale, "/tietosuojaseloste"), label: dict.footer.privacy },
        { href: linkTo(locale, "/contact"), label: dict.common.contactUs },
      ]}
      reviewNote={legal.reviewNote}
    />
  );
}
