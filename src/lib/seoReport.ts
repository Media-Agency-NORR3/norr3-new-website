import crypto from "crypto";
import { cookies } from "next/headers";

/**
 * Password gate for the internal SEO competitor report (/seo-report).
 *
 * The password is NOT in this repo. It lives in the CMS as the `api_settings`
 * row `seo_report_password` (admin: CMS → Settings → "Website connection"),
 * where it can be read and changed. The website's server fetches it over the
 * internal, secret-signed route `/api/public/seo-report` and compares it in
 * constant time — the value itself never travels to a browser.
 *
 * Server-only: this module reads the shared ingest secret from the environment.
 */
export const SEO_REPORT_COOKIE = "norr3-seo-report";

const CMS_URL = (process.env.NORR3_CMS_URL || "http://127.0.0.1:3848").replace(/\/+$/, "");
const INGEST_SECRET = process.env.NORR3_CMS_INGEST_SECRET ?? "";

/**
 * Short-lived cache of the CMS-side password. A page render happens per
 * request (the gate reads a cookie), and hitting the CMS on every one of them
 * would make the report as slow as the CMS. A stale value is kept when the CMS
 * is unreachable: an admin password change takes effect within a minute, while
 * a CMS blip can never lock the report for someone who already has the cookie.
 */
let cached: { at: number; password: string } | null = null;
const CACHE_TTL = 60_000;

async function cmsPassword(): Promise<string> {
  if (cached && Date.now() - cached.at < CACHE_TTL) return cached.password;
  if (!INGEST_SECRET) return cached?.password ?? "";
  try {
    const res = await fetch(`${CMS_URL}/api/public/seo-report`, {
      headers: { "x-norr3-secret": INGEST_SECRET },
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return cached?.password ?? "";
    const data = (await res.json()) as { password?: string };
    cached = { at: Date.now(), password: (data.password ?? "").trim() };
    return cached.password;
  } catch {
    return cached?.password ?? "";
  }
}

/** Constant-time comparison of the candidate against the CMS-stored password. */
export async function verifySeoReportPassword(candidate: string): Promise<boolean> {
  const expected = await cmsPassword();
  const provided = candidate.trim();
  // No password set in the CMS → nobody gets in (a blank form field must never
  // unlock the report).
  if (!expected || !provided) return false;
  const a = crypto.createHash("sha256").update(provided).digest();
  const b = crypto.createHash("sha256").update(expected).digest();
  return crypto.timingSafeEqual(a, b);
}

/** True when the request carries an unlock cookie that still matches the CMS. */
export async function seoReportUnlocked(): Promise<boolean> {
  const store = await cookies();
  const value = store.get(SEO_REPORT_COOKIE)?.value;
  if (!value) return false;
  return verifySeoReportPassword(value);
}
