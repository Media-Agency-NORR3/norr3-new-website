import { Suspense } from "react";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { Container } from "@/components/Container";
import { NpsSurvey } from "@/components/NpsSurvey";

/*
 * Client NPS survey. The 0–10 buttons in the NPS email link here with the
 * recipient's token and score (`/nps?t=<token>&s=<score>`); the score is saved
 * on arrival and the remaining questions are optional. Answers go to the
 * Supabase edge function `nps` (norr3-business-data-hub, sql/nps_2026.sql),
 * which holds every key itself, so the site needs none. The page is personal
 * to the recipient: never indexed, never linked from the site.
 */
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    title: locale === "fi" ? "Miten meillä menee? | NØRR3" : "How are we doing? | NØRR3",
    robots: { index: false, follow: false },
  };
}

export default async function NpsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <section className="pb-24 pt-32 lg:pt-40">
      <Container>
        <div className="mx-auto max-w-2xl">
          {/* The token and score live in the query string, read on the client so the page itself stays static. */}
          <Suspense fallback={null}>
            <NpsSurvey locale={locale} />
          </Suspense>
        </div>
      </Container>
    </section>
  );
}
