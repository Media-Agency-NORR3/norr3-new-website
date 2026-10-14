/**
 * Publication stamps for structured data.
 *
 * The CMS stores two shapes of stamp:
 *   - a bare calendar date (`2026-10-06`) when an editor set the publish date;
 *   - a UTC timestamp (`2026-10-14 10:26:57`) — SQLite's `datetime('now')`,
 *     which is always UTC.
 *
 * schema.org wants ISO 8601 with a timezone, and the site is a Finnish one, so
 * both are expressed in `Europe/Helsinki` with the offset that was actually in
 * force on that date (+03:00 in summer, +02:00 in winter). Getting the offset
 * from `Intl` rather than assuming +03:00 keeps DST correct all year.
 */

const HELSINKI = "Europe/Helsinki";

/** The offset (ms) that `tz` was at for a given instant. */
function tzOffsetMs(utcMs: number, tz: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(new Date(utcMs));
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  const asUtc = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour") % 24, get("minute"), get("second"));
  return asUtc - utcMs;
}

const pad = (n: number, len = 2) => String(n).padStart(len, "0");

function format(localMs: number, offsetMs: number): string {
  const d = new Date(localMs);
  const sign = offsetMs < 0 ? "-" : "+";
  const abs = Math.abs(offsetMs);
  return (
    `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}` +
    `T${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}` +
    `${sign}${pad(Math.floor(abs / 3_600_000))}:${pad(Math.floor((abs % 3_600_000) / 60_000))}`
  );
}

/**
 * A CMS stamp as ISO 8601 with the Helsinki offset, or `undefined` when there
 * is nothing usable to format.
 */
export function helsinkiIso(value?: string | null): string | undefined {
  if (!value) return undefined;
  const raw = String(value).trim();
  const m = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?)?$/.exec(raw);
  if (!m) {
    const parsed = new Date(raw);
    return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
  }
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  if (m[4] === undefined) {
    // A bare date is a local calendar day: the output should read 00:00 that
    // day in Helsinki. `localWall` is that wall clock expressed as if it were
    // UTC; two offset passes settle a DST boundary.
    const localWall = Date.UTC(y, mo - 1, d, 0, 0, 0);
    let offset = tzOffsetMs(localWall, HELSINKI);
    offset = tzOffsetMs(localWall - offset, HELSINKI);
    return format(localWall, offset);
  }
  const utcMs = Date.UTC(y, mo - 1, d, Number(m[4]), Number(m[5]), Number(m[6] ?? 0));
  const offset = tzOffsetMs(utcMs, HELSINKI);
  return format(utcMs + offset, offset);
}

/**
 * `dateModified` for an article: the content-update stamp, except never
 * earlier than the publish stamp (schema.org readers treat a modified date
 * before the published one as broken markup).
 */
export function modificationIso(publishedAt?: string | null, updatedAt?: string | null): string | undefined {
  const published = helsinkiIso(publishedAt);
  const updated = helsinkiIso(updatedAt);
  if (!updated) return published;
  if (!published) return updated;
  return new Date(updated).getTime() >= new Date(published).getTime() ? updated : published;
}

/** The schema.org `datePublished` — the publish stamp, or the update one as a fallback. */
export function publicationIso(publishedAt?: string | null, updatedAt?: string | null): string | undefined {
  return helsinkiIso(publishedAt) ?? helsinkiIso(updatedAt);
}
