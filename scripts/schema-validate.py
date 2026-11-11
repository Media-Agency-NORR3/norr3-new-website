#!/usr/bin/env python3
"""Validate a page's structured data against validator.schema.org.

Two modes:

  * a public URL — the validator fetches it itself:
        python3 scripts/schema-validate.py https://norr3.fi/ai-optimointi
  * a local/pre-release page — the HTML is fetched here and submitted to the
    validator as a snippet (validator.schema.org cannot reach localhost):
        python3 scripts/schema-validate.py --html-file /tmp/page.html
        python3 scripts/schema-validate.py --local http://localhost:3899/ai-optimointi

Prints every error/warning with the node type it sits on, e.g.
`UNKNOWN_FIELD(dateModified, Service)` — which is how the Service-node
properties (inLanguage, dateModified) were found to be CreativeWork-only.
"""
import json
import sys
import urllib.error
import urllib.parse
import urllib.request

ENDPOINT = "https://validator.schema.org/validate"


def _post(fields: dict) -> dict:
    data = urllib.parse.urlencode(fields).encode()
    req = urllib.request.Request(ENDPOINT, data=data, headers={"User-Agent": "norr3-schema-check"})
    raw = urllib.request.urlopen(req, timeout=120).read().decode("utf-8", "replace")
    if raw.startswith(")]}'"):
        raw = raw.split("\n", 1)[1]
    return json.loads(raw)


def validate(url: str) -> dict:
    return _post({"url": url})


def validate_html(html: str) -> dict:
    return _post({"html": html})


def _fetch(url: str) -> str:
    req = urllib.request.Request(url, headers={"user-agent": "norr3-schema-check"})
    return urllib.request.urlopen(req, timeout=60).read().decode("utf-8", "replace")


def report(label: str, d: dict, extra: str = "") -> int:
    errs = d.get("errors") or []
    print(f"{label}{extra}")
    print(f"  objects={d.get('numObjects')} errors={d.get('totalNumErrors')} warnings={d.get('totalNumWarnings')}")
    for e in errs:
        args = ", ".join(str(a) for a in e.get("args", []))
        print(f"  - {e.get('errorType')}({args}) severity={e.get('ownerToSeverity')}")
    print()
    return 0


def main() -> int:
    argv = sys.argv[1:]
    if not argv:
        print(__doc__)
        return 2

    if argv[0] == "--html-file":
        for path in argv[1:]:
            with open(path, encoding="utf-8") as handle:
                report(path, validate_html(handle.read()))
        return 0

    if argv[0] == "--local":
        for url in argv[1:]:
            try:
                html = _fetch(url)
            except Exception as exc:  # noqa: BLE001
                print(f"{url}\n  FETCH FAILED: {exc}\n")
                continue
            report(url, validate_html(html), "  (submitted as HTML)")
        return 0

    for url in argv:
        try:
            d = validate(url)
        except Exception as exc:  # noqa: BLE001
            print(f"{url}\n  VALIDATOR FAILED: {exc}\n")
            return 1
        report(url, d)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

