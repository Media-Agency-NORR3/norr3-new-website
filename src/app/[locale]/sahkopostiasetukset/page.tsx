import { Suspense } from "react";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/lib/dictionary";
import { legalPath } from "@/lib/links";
import { Container } from "@/components/Container";
import { EmailPreferences } from "@/components/EmailPreferences";

/*
 * Email preferences. Every NØRR3 email links here with the recipient's own
 * token (`/sahkopostiasetukset?t=<token>`, English `/en/email-preferences`).
 * Choices go to the Supabase edge function `email-prefs`
 * (norr3-business-data-hub, sql/mail_registry.sql), which logs every change.
 * The copy is the `emailPrefs` dictionary section, editable in the CMS. The
 * page is personal to the recipient: never indexed, never linked from the site.
 */
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return { title: dict.emailPrefs.metaTitle, robots: { index: false, follow: false } };
}

export default async function EmailPreferencesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <section className="pb-24 pt-32 lg:pt-40">
      <Container>
        <div className="mx-auto max-w-2xl">
          <Suspense fallback={null}>
            <EmailPreferences dict={dict.emailPrefs} privacyHref={legalPath(locale, "privacy")} />
          </Suspense>
        </div>
      </Container>
    </section>
  );
}
