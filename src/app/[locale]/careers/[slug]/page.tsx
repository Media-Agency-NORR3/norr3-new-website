import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { isLocale, type Locale } from "@/i18n/config";
import { getSiteContent, getCareerViaPreviewApi, type CmsCareer } from "@/lib/cms";
import { isProductionHost } from "@/lib/host";
import { linkTo } from "@/lib/links";
import { Container, HeroPill } from "@/components/Container";
import { PillButton } from "@/components/PillButton";
import { Icon } from "@/components/Icon";

type Props = { params: Promise<{ locale: string; slug: string }>; searchParams: Promise<{ preview?: string }> };

type CareerWithApply = CmsCareer & { applyUrl?: string; active?: boolean };

/**
 * A single open-role page.
 *
 *   /careers/<slug>  and  /en/careers/<slug>
 *
 * Live roles resolve straight from the site bundle. A role that is still a
 * draft in the CMS (`active = 0`) renders here only when the URL carries a
 * valid signed `?preview=<token>` minted by the CMS; the CMS verifies the
 * token server-side. On norr3.fi (production) the signature is ignored, so a
 * draft never becomes public: it 404s like any other unknown role.
 */

/** Resolve a role: live from the bundle, or draft via the signed preview API. */
async function loadCareer(slug: string, preview?: string): Promise<{ career: CareerWithApply; isPreview: boolean } | null> {
  const content = await getSiteContent();
  const live = content.careers.find((c) => c.id === slug);
  if (live) return { career: live, isPreview: false };

  // Drafts only ever render via a signed preview, and never on production.
  if (!preview || isProductionHost((await headers()).get("host"))) return null;
  const career = await getCareerViaPreviewApi(slug, preview);
  if (!career) return null;
  return { career, isPreview: true };
}

export async function generateMetadata({ params, searchParams }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const preview = (await searchParams).preview;
  const resolved = await loadCareer(slug, preview);
  if (!resolved) return {};
  const { career, isPreview } = resolved;
  const title = career.title[locale as Locale];
  const description = career.description[locale as Locale]?.replace(/\s+/g, " ").trim().slice(0, 155);
  return {
    title: title ? `${title} | NØRR3` : "Open role | NØRR3",
    ...(description ? { description } : {}),
    ...(isPreview ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function CareerPage({ params, searchParams }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const preview = (await searchParams).preview;
  const resolved = await loadCareer(slug, preview);
  if (!resolved) notFound();

  const { career, isPreview } = resolved;
  const loc = locale as Locale;
  const title = career.title[loc];
  const locationText = career.location[loc];
  const description = career.description[loc];
  const requirements = career.requirements[loc] ?? [];
  const applyUrl = (career as CareerWithApply).applyUrl || linkTo(loc, "/toihin-meille#open-roles");
  const isDraft = isPreview;
  const fi = loc === "fi";

  return (
    <>
      {isDraft && (
        <div className="z-[80] bg-yellow py-1.5 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-ink">
          {fi ? "ESIKATSELU – ei julkaistu" : "PREVIEW – not published"}
        </div>
      )}

      <Container className="pt-12 lg:pt-20">
        <HeroPill>{fi ? "AVOIN PAIKKA" : "OPEN ROLE"}</HeroPill>
        <h1 className="mt-6 text-[min(9vw,4rem)] font-medium leading-none tracking-tight text-ink dark:text-white">
          {title}
        </h1>
        {locationText && (
          <p className="mt-4 flex items-center gap-2 text-[15px] text-ink/70 dark:text-white/70">
            <Icon name="place" style={{ fontSize: "18px" }} />
            {locationText}
          </p>
        )}
      </Container>

      <Container className="pb-24 pt-10 lg:pb-32">
        <div className="mx-auto max-w-3xl space-y-10">
          {description && (
            <section aria-label={fi ? "Tehtävän kuvaus" : "Role description"}>
              <div className="space-y-4 whitespace-pre-line text-[15px] leading-relaxed text-ink/80 lg:text-base dark:text-white/80">
                {description}
              </div>
            </section>
          )}

          {requirements.length > 0 && (
            <section aria-labelledby="career-requirements">
              <h2 id="career-requirements" className="mb-4 text-[11px] font-medium uppercase tracking-[0.14em] text-purple dark:text-light-purple">
                {fi ? "Odotamme sinulta" : "What we expect"}
              </h2>
              <ul className="space-y-3">
                {requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-3 text-[15px] leading-relaxed text-ink/80 dark:text-white/80">
                    <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-purple dark:bg-light-purple" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className="flex flex-wrap items-center gap-4 border-t border-black/[0.06] pt-8 dark:border-white/10">
            {isDraft ? (
              <span
                aria-disabled="true"
                className="inline-flex cursor-not-allowed items-center gap-2 rounded-full bg-ink/10 px-7 py-3.5 text-sm font-medium uppercase tracking-wide text-ink/50 dark:bg-white/10 dark:text-white/50"
              >
                <Icon name="lock" style={{ fontSize: "18px" }} />
                {fi ? "Haku ei ole vielä auki" : "Applications not open yet"}
              </span>
            ) : (
              <PillButton href={applyUrl} variant="primary">
                {fi ? "Hae paikkaa" : "Apply"}
              </PillButton>
            )}
            <Link
              href={linkTo(loc, "/toihin-meille#open-roles")}
              className="text-sm font-medium text-ink/60 underline-offset-4 hover:underline dark:text-white/60"
            >
              ← {fi ? "Kaikki avoimet paikat" : "All open roles"}
            </Link>
          </div>
        </div>
      </Container>
    </>
  );
}