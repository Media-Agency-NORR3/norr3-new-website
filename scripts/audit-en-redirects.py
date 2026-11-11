#!/usr/bin/env python3
"""Audit every English URL change against the live site.

For each surface whose English address changed (the FI slug no longer being a
valid English URL), check:
  * the NEW English URL answers 200,
  * the OLD English URL answers 301 to the new one.

Usage: python3 scripts/audit-en-redirects.py [base-url]
"""
import re
import sys
import urllib.error
import urllib.request

BASE = (sys.argv[1] if len(sys.argv) > 1 else "https://norr3.fi").rstrip("/")

# Coded routes whose English address differs from the route folder name.
ROUTE_EN = {
    "caset": "cases",
    "meista": "about",
    "toihin-meille": "careers",
    "tiimi": "team",
    "tietosuojaseloste": "privacy-policy",
    "kayttoehdot": "terms",
}

# Service landing pages: FI slug -> EN address (mirrors src/lib/slugEn.ts).
SERVICE_EN = {
    "insight-strategia": "insight-strategy",
    "data-ja-mittaus": "data-and-measurement",
    "data-ja-mittaus/dashboardit": "data-and-measurement/dashboards",
    "data-ja-mittaus/datan-mallintaminen": "data-and-measurement/data-modelling",
    "markkinointistrategia": "marketing-strategy",
    "hakukoneoptimointi": "search-engine-optimisation",
    "ohjelmallinen-ostaminen": "programmatic-buying",
    "mediasuunnittelu": "media-planning",
    "ulkomainonta": "out-of-home-advertising",
    "performance-markkinointi": "performance-marketing",
    "mediasuunnittelu/norr3-media-insights": "media-planning/norr3-media-insights",
    "mediasuunnittelu/radio": "media-planning/radio-advertising",
    "mediasuunnittelu/televisio": "media-planning/tv-advertising",
    "mediasuunnittelu/elokuvamainonta-eli-cinema": "media-planning/cinema-advertising",
    "mediasuunnittelu/printti-eli-lehtimainonta": "media-planning/print-advertising",
    "mediasuunnittelu/luovat": "media-planning/assets-and-production",
    "mediasuunnittelu/kampanjat-ja-jatkuva-mainonta": "media-planning/campaigns-and-always-on",
    "mediastrategia": "media-strategy",
    "dynaaminen-mainonta": "dynamic-advertising",
    "hakukonemainonta": "search-engine-advertising",
    "display-ja-videomainonta": "display-and-video-advertising",
    "somemarkkinointi": "social-media-advertising",
    "tutkimukset": "research",
    "ai-optimointi": "ai-optimisation",
    "tekoalymainonta": "ai-advertising",
    "markkinointi-terveydenhuolto": "healthcare-marketing",
    "markkinointi-kiinteistonvalitys": "real-estate-marketing",
    "markkinointi-vahittaiskauppa": "retail-marketing",
    "markkinointi-autoliikkeet": "automotive-marketing",
    "markkinointi-franchising": "franchise-marketing",
    "marketing-engine-alusta": "marketing-engine",
}


class NoRedirect(urllib.request.HTTPRedirectHandler):
    """Report the redirect itself instead of chasing it — the whole point here
    is to see whether an old URL answers 301, not where a followed chain ends."""

    def redirect_request(self, req, fp, code, msg, headers, newurl):  # noqa: ANN001, D102
        return None


OPENER = urllib.request.build_opener(NoRedirect)


def head(url: str) -> tuple[int, str]:
    req = urllib.request.Request(url, method="GET", headers={"user-agent": "norr3-en-redirect-audit"})
    try:
        with OPENER.open(req, timeout=30) as res:
            return res.status, res.geturl()
    except urllib.error.HTTPError as err:
        return err.code, err.headers.get("location", "")
    except Exception as err:  # noqa: BLE001
        return 0, str(err)


# Insight posts: FI slug -> EN address. Mirrors `posts.slug_en` in the CMS
# (the CMS value wins at render time; this is the list the audit checks).
POST_EN = {
    "radiomainonnan-hinta-ja-kuuntelijamaarat-2026": "radio-advertising-costs-and-listeners-2026",
    "kampanja-15-minuutissa-marketing-engine-iab": "campaign-in-15-minutes-marketing-engine-iab",
    "tekoalyn-kaytto-suomessa-2026": "ai-use-in-finland-2026",
    "tamk-kylassa": "tamk-visit",
    "mediasuunnitelma-mita-siina-pitaa-olla-ja-miten-se-tehdaan": "how-to-build-a-media-plan",
    "tv-vai-video-katselu-suomessa-2026": "tv-or-video-2026",
    "chatgpt-mainonta-suomessa": "chatgpt-ads-in-finland",
    "media-insights-mediatutkimus-ja-mediankaytto-suomessa": "finnish-media-use-2026",
    "norr3-ja-kiinteistomaailma-yhteistyossa-marketing-engine-mullistaa-paikallismarkkinoinnin": "norr3-and-kiinteistomaailma-local-marketing",
    "tre-kronor-media": "tre-kronor-media-finland",
    "voittava-mediamix-2024": "winning-media-mix-2024",
    "isojen-ruutujen-trendit": "big-screen-trends",
}


def main() -> int:
    rows: list[tuple[str, str, str]] = []

    for fi, en in ROUTE_EN.items():
        rows.append((f"/{fi}", f"/en/{fi}", f"/en/{en}"))

    for fi, en in SERVICE_EN.items():
        rows.append((f"/{fi}", f"/en/{fi}", f"/en/{en}"))

    for fi, en in POST_EN.items():
        rows.append((f"/{fi}", f"/en/{fi}", f"/en/{en}"))

    problems = 0
    broken_new = 0
    print(f"{'FI slug':<52} {'OLD /en URL':<56} {'NEW /en URL':<58} old  new")
    for fi, old, new in rows:
        old_code, old_loc = head(f"{BASE}{old}")
        new_code, new_loc = head(f"{BASE}{new}")
        redirect_ok = old_code == 301 and old_loc.rstrip("/").endswith(new.rstrip("/"))
        new_ok = new_code == 200
        if not redirect_ok:
            problems += 1
        if not new_ok:
            broken_new += 1
        flags = "" if (redirect_ok and new_ok) else f"   <-- {'NO 301' if not redirect_ok else ''}{' NEW NOT 200' if not new_ok else ''}"
        print(f"{fi:<52} {old:<56} {new:<58} {old_code:<4} {new_code}{flags}")

    print(f"\n{len(rows) - problems}/{len(rows)} old English URLs 301 to their new address")
    print(f"{len(rows) - broken_new}/{len(rows)} new English URLs answer 200")
    if problems:
        print(f"{problems} old URLs WITHOUT a redirect -> add them (next.config.ts or the CMS redirects table)")
    if broken_new:
        print(f"{broken_new} NEW URLs not answering 200 -> check the route/CMS row")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
