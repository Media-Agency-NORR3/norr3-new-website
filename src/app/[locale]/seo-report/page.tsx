import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale } from "@/i18n/config";
import { Icon } from "@/components/Icon";
import { SEO_REPORT_COOKIE, verifySeoReportPassword } from "@/lib/seoReport";

/**
 * Internal SEO competitor report — password-gated.
 *
 * This is the gate, and it runs on the server: without an unlock cookie the
 * page renders the lock screen below and never imports ./SeoReportContent, so
 * none of the report's copy, numbers or prompts reach the HTML, the RSC
 * payload or any client chunk. The same flow as the draft case preview
 * (/case-preview/<slug>): the form POSTs to /api/seo-report, that route checks
 * the password stored in the CMS and sets a 30-minute httpOnly cookie.
 *
 * The route itself is deliberately absent from sitemap.xml. Metadata and the
 * response headers (X-Robots-Tag, Cache-Control in next.config.ts) keep it out
 * of search results and out of Cloudflare's cache.
 */
type Params = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ pw?: string }>;
};

async function unlocked(): Promise<boolean> {
  const store = await cookies();
  const value = store.get(SEO_REPORT_COOKIE)?.value;
  if (!value) return false;
  return verifySeoReportPassword(value);
}

/**
 * The report's own title would give away what the page is, and the locked page
 * must not describe its contents — so the descriptive title is only used once
 * the cookie is present.
 */
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  const fi = locale !== "en";
  const open = await unlocked();
  return {
    title: open
      ? "SEO-kilpailija-analyysi: NØRR3 vs SDM — sisäinen raportti"
      : fi
        ? "Suojattu esikatselu — NØRR3"
        : "Protected preview — NØRR3",
    robots: { index: false, follow: false },
  };
}

export default async function SeoReportPage({ params, searchParams }: Params) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const fi = locale === "fi";
  const wrong = (await searchParams).pw === "wrong";

  if (!(await unlocked())) {
    return (
      <div className="flex min-h-[80svh] flex-col items-center justify-center gap-6 px-6 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-[5px] bg-violet text-white">
          <Icon name="lock" style={{ fontSize: "30px" }} />
        </span>
        <h1 className="text-2xl font-medium text-ink dark:text-white">
          {fi ? "Suojattu esikatselu" : "Protected preview"}
        </h1>
        <p className="max-w-sm text-[14px] leading-relaxed text-ink/60 dark:text-white/60">
          {fi
            ? "Tämä sisäinen raportti on salasanasuojattu. Syötä saamasi salasana nähdäksesi sen."
            : "This internal report is password-protected. Enter the password you received to view it."}
        </p>
        <form action="/api/seo-report" method="POST" className="flex w-full max-w-xs flex-col gap-3">
          <input type="hidden" name="locale" value={locale} />
          {wrong && (
            <p className="text-[12px] font-medium text-red-600 dark:text-red-400">
              {fi ? "Väärä salasana — yritä uudelleen." : "Wrong password — try again."}
            </p>
          )}
          <input
            type="password"
            name="password"
            required
            placeholder={fi ? "Salasana" : "Password"}
            className="w-full rounded-[10px] border border-ink/20 bg-white px-3.5 py-2.5 text-[14px] text-ink outline-none focus:border-purple dark:border-white/20 dark:bg-white/5 dark:text-white"
          />
          <button
            type="submit"
            className="rounded-full bg-ink px-6 py-3 text-xs font-medium uppercase tracking-[0.08em] text-white transition-colors hover:bg-purple dark:bg-purple dark:hover:bg-violet"
          >
            {fi ? "Avaa raportti" : "Open report"}
          </button>
        </form>
      </div>
    );
  }

  // Imported only on the unlocked path, so the report's module is never part
  // of what a locked visitor's browser receives.
  const { default: SeoReportContent } = await import("./SeoReportContent");
  return <SeoReportContent locale={locale} />;
}
