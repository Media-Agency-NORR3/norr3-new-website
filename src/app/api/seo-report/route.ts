import { NextRequest, NextResponse } from "next/server";
import { SEO_REPORT_COOKIE, verifySeoReportPassword } from "@/lib/seoReport";

/**
 * Password check for the internal SEO competitor report.
 *   POST /api/seo-report   (form POST: locale, password)
 *
 * Same flow as the draft case preview: the password is verified on the server
 * against the value stored in the CMS, a valid one earns a 30-minute httpOnly
 * cookie, and the visitor lands back on /seo-report. Nothing about the report
 * is served until that cookie is present.
 */
function redirectTo(path: string, status: 302 | 303): NextResponse {
  const res = new NextResponse(null, { status });
  res.headers.set("Location", path);
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  res.headers.set("Cache-Control", "private, no-store");
  return res;
}

export async function POST(req: NextRequest) {
  const form = (await req.formData().catch(() => null)) as FormData | null;
  if (!form) return NextResponse.json({ error: "Malformed" }, { status: 400 });

  const password = String(form.get("password") ?? "");
  const locale = form.get("locale") === "en" ? "en" : "fi";
  const back = `/${locale}/seo-report`;

  let ok = false;
  try {
    ok = await verifySeoReportPassword(password);
  } catch {
    ok = false;
  }
  if (!ok) return redirectTo(`${back}?pw=wrong`, 302);

  const res = redirectTo(back, 303);
  res.cookies.set(SEO_REPORT_COOKIE, password.trim(), {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 30 * 60,
    path: "/",
  });
  return res;
}
