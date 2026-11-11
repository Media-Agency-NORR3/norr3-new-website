#!/usr/bin/env python3
"""Validate a live URL against validator.schema.org and print every error/warning.

Usage: python3 scripts/schema-validate.py <url> [<url> ...]
"""
import json
import subprocess
import sys
import urllib.parse
import urllib.request


def validate(url: str) -> dict:
    data = urllib.parse.urlencode({"url": url}).encode()
    req = urllib.request.Request(
        "https://validator.schema.org/validate", data=data,
        headers={"User-Agent": "norr3-schema-check"},
    )
    raw = urllib.request.urlopen(req, timeout=120).read().decode("utf-8", "replace")
    if raw.startswith(")]}'"):
        raw = raw.split("\n", 1)[1]
    return json.loads(raw)


def main() -> int:
    urls = sys.argv[1:]
    for url in urls:
        try:
            d = validate(url)
        except Exception as exc:  # noqa: BLE001
            print(f"{url}\n  FETCH FAILED: {exc}\n")
            continue
        errs = d.get("errors") or []
        print(f"{url}")
        print(f"  objects={d.get('numObjects')} errors={d.get('totalNumErrors')} warnings={d.get('totalNumWarnings')}")
        for e in errs:
            args = ", ".join(str(a) for a in e.get("args", []))
            sev = e.get("ownerToSeverity", {})
            print(f"  - {e.get('errorType')}({args}) severity={sev} begin={e.get('begin')}")
        print()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
