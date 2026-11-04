import fs from "node:fs";
import path from "node:path";
import { CMS_TAGS, cmsUrl } from "@/lib/cms";
import { ogImage } from "@/lib/ogImage";
import type { TeamMember } from "@/content/team";
import type {
  Comment,
  Embed,
  LinkPreview,
  Media,
  MemberSummary,
  Post,
  Profile,
  SharedPost,
  Story,
  StoryGroup,
} from "@/lib/socialFormat";

export type * from "@/lib/socialFormat";

/**
 * Team Social read layer — typed fetchers for the CMS's public social API.
 *
 * Same stance as `cms.ts`: the site never goes dark. Until the CMS side is
 * deployed (or whenever it is unreachable or answers 404) every fetcher resolves
 * to an empty result instead of throwing, and the pages render their empty
 * states. Responses are normalised on the way in, so a field the CMS leaves out
 * can't crash a render further down.
 *
 * Revalidation is short (60 s) because a feed goes stale faster than copy does;
 * the CMS also drops `cms:social` through /api/revalidate after every write.
 */

const CACHE = { revalidate: 60, tags: [CMS_TAGS.all, CMS_TAGS.social] };

async function getJson<T>(endpoint: string): Promise<T | null> {
  try {
    const res = await fetch(`${cmsUrl}/api/public/social/${endpoint}`, {
      next: CACHE,
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/* -------------------------------------------------------------- normalise */

const str = (value: unknown): string => (typeof value === "string" ? value : "");
const num = (value: unknown): number => (typeof value === "number" && Number.isFinite(value) ? value : 0);
const arr = <T>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : []);
const pair = (value: unknown) => {
  const v = (value ?? {}) as Record<string, unknown>;
  return { fi: str(v.fi), en: str(v.en) };
};

function member(raw: unknown): MemberSummary {
  const m = (raw ?? {}) as Record<string, unknown>;
  return {
    slug: str(m.slug),
    name: str(m.name),
    photo: str(m.photo),
    role: pair(m.role),
    headline: pair(m.headline),
    postCount: num(m.postCount),
  };
}

function profile(raw: unknown): Profile {
  const m = (raw ?? {}) as Record<string, unknown>;
  return {
    ...member(raw),
    cover: str(m.cover),
    about: pair(m.about),
    bio: pair(m.bio),
    skills: arr<unknown>(m.skills).map(str).filter(Boolean),
    portfolio: arr<Record<string, unknown>>(m.portfolio).map((p) => ({
      title: str(p?.title),
      description: str(p?.description),
      url: str(p?.url),
      image: str(p?.image),
    })),
    linkedin: str(m.linkedin),
    email: str(m.email),
    location: str(m.location),
  };
}

function media(raw: unknown): Media[] {
  return arr<Record<string, unknown>>(raw)
    .filter((m) => m && (m.type === "image" || m.type === "video") && str(m.path))
    .map((m) => ({
      type: m.type as Media["type"],
      path: str(m.path),
      ...(str(m.poster) ? { poster: str(m.poster) } : {}),
      ...(num(m.width) ? { width: num(m.width) } : {}),
      ...(num(m.height) ? { height: num(m.height) } : {}),
      ...(str(m.alt) ? { alt: str(m.alt) } : {}),
    }));
}

function sharedPost(raw: unknown): SharedPost {
  const p = (raw ?? {}) as Record<string, unknown>;
  const link = p.link as LinkPreview | null | undefined;
  const embed = p.embed as Embed | null | undefined;
  return {
    id: num(p.id),
    slug: str(p.slug),
    lang: p.lang === "en" ? "en" : "fi",
    author: member(p.author),
    body: str(p.body),
    media: media(p.media),
    link: link && str(link.url) ? { url: str(link.url), title: str(link.title), description: str(link.description), image: str(link.image), site: str(link.site) } : null,
    embed:
      embed && ["youtube", "vimeo", "linkedin"].includes(str(embed.provider)) && str(embed.embedUrl)
        ? { provider: embed.provider, url: str(embed.url), embedUrl: str(embed.embedUrl) }
        : null,
    pinned: p.pinned === true,
    likeCount: num(p.likeCount),
    commentCount: num(p.commentCount),
    shareCount: num(p.shareCount),
    createdAt: str(p.createdAt),
    updatedAt: str(p.updatedAt) || str(p.createdAt),
  };
}

function post(raw: unknown): Post {
  const p = (raw ?? {}) as Record<string, unknown>;
  const comments = arr<Record<string, unknown>>(p.comments).map(
    (c): Comment => ({ id: num(c?.id), author: member(c?.author), body: str(c?.body), createdAt: str(c?.createdAt) })
  );
  return {
    ...sharedPost(raw),
    shared: p.shared ? sharedPost(p.shared) : null,
    comments,
  };
}

function story(raw: unknown): Story {
  const s = (raw ?? {}) as Record<string, unknown>;
  return {
    id: num(s.id),
    mediaType: s.mediaType === "video" ? "video" : "image",
    path: str(s.path),
    poster: str(s.poster),
    caption: str(s.caption),
    linkUrl: str(s.linkUrl),
    createdAt: str(s.createdAt),
    expiresAt: str(s.expiresAt),
    highlight: s.highlight === true,
    highlightTitle: str(s.highlightTitle),
  };
}

const posts = (raw: unknown) => arr<unknown>(raw).map(post).filter((p) => p.id && p.slug);
const stories = (raw: unknown) => arr<unknown>(raw).map(story).filter((s) => s.id && s.path);

/* -------------------------------------------------------------- fetchers */

export type FeedPage = { posts: Post[]; nextBefore: number | null };

/** `GET /api/public/social/feed` — newest first, paged by the `before` post id. */
export async function getSocialFeed({ limit = 20, before }: { limit?: number; before?: number | null } = {}): Promise<FeedPage> {
  const query = new URLSearchParams({ limit: String(limit) });
  if (before) query.set("before", String(before));
  const data = await getJson<{ posts?: unknown; nextBefore?: unknown }>(`feed?${query}`);
  const nextBefore = typeof data?.nextBefore === "number" && data.nextBefore > 0 ? data.nextBefore : null;
  return { posts: posts(data?.posts), nextBefore };
}

/** `GET /api/public/social/members` — position order. */
export async function getSocialMembers(): Promise<MemberSummary[]> {
  const data = await getJson<{ members?: unknown }>("members");
  return arr<unknown>(data?.members).map(member).filter((m) => m.slug && m.name);
}

export type MemberPage = { member: Profile; posts: Post[]; highlights: Story[]; stories: Story[] };

/** `GET /api/public/social/member/<slug>` — null when unknown, hidden or unreachable. */
export async function getSocialMember(slug: string): Promise<MemberPage | null> {
  const data = await getJson<{ member?: unknown; posts?: unknown; highlights?: unknown; stories?: unknown }>(
    `member/${encodeURIComponent(slug)}`
  );
  if (!data?.member) return null;
  return { member: profile(data.member), posts: posts(data.posts), highlights: stories(data.highlights), stories: stories(data.stories) };
}

export type PostPage = { post: Post; more: Post[] };

/** `GET /api/public/social/post/<slug>` — null when missing or unreachable. */
export async function getSocialPost(slug: string): Promise<PostPage | null> {
  const data = await getJson<{ post?: unknown; more?: unknown }>(`post/${encodeURIComponent(slug)}`);
  if (!data?.post) return null;
  const main = post(data.post);
  if (!main.id || !main.slug) return null;
  return { post: main, more: posts(data.more) };
}

/** `GET /api/public/social/stories` — active stories grouped per member. */
export async function getSocialStories(): Promise<StoryGroup[]> {
  const data = await getJson<{ groups?: unknown }>("stories");
  return arr<Record<string, unknown>>(data?.groups)
    .map((g) => ({ member: member(g?.member), stories: stories(g?.stories) }))
    .filter((g) => g.member.slug && g.stories.length > 0);
}

export type SocialSitemap = {
  members: { slug: string; updatedAt: string }[];
  /** A post declares its own language — its page exists at that locale only. */
  posts: { slug: string; updatedAt: string; lang: "fi" | "en" }[];
};

/** `GET /api/public/social/sitemap`. */
export async function getSocialSitemap(): Promise<SocialSitemap> {
  const data = await getJson<{ members?: unknown; posts?: unknown }>("sitemap");
  const rows = (raw: unknown) =>
    arr<Record<string, unknown>>(raw)
      .map((r) => ({
        slug: str(r?.slug),
        updatedAt: str(r?.updatedAt),
        lang: str(r?.lang) === "en" ? ("en" as const) : ("fi" as const),
      }))
      .filter((r) => r.slug);
  return { members: rows(data?.members), posts: rows(data?.posts) };
}

/**
 * A profile built from the team roster, for members the social API doesn't
 * know yet (CMS side not deployed, or unreachable). The roster itself comes
 * from the CMS bundle and already leaves hidden members out.
 */
export function profileFromRoster(m: TeamMember): Profile {
  return {
    slug: m.id,
    name: m.name,
    photo: m.photo,
    role: m.role ?? { fi: "", en: "" },
    headline: { fi: "", en: "" },
    postCount: 0,
    cover: "",
    about: { fi: "", en: "" },
    bio: m.bio,
    skills: [],
    portfolio: [],
    linkedin: m.linkedin ?? "",
    email: m.email ?? "",
    location: "",
  };
}

/**
 * `ogImage()` for social pages. Team portraits and CMS uploads have no JPG twin
 * under /images/og/, so the twin is only used when it really exists — a
 * scraper gets the WebP rather than a 404.
 */
export function socialOgImage(src: string): string {
  if (!src || /^https?:/i.test(src)) return src;
  const twin = ogImage(src);
  if (twin === src) return src;
  try {
    return fs.existsSync(path.join(process.cwd(), "public", twin)) ? twin : src;
  } catch {
    return src;
  }
}

/* ------------------------------------------------------------------ likes */

const SECRET = process.env.NORR3_CMS_REVALIDATE_SECRET ?? "";

export const likesConfigured = () => Boolean(SECRET);

/** `POST /api/public/social/like` — server-to-server only. */
export async function forwardLike(postId: number, visitor: string, liked: boolean): Promise<{ likeCount: number; liked: boolean } | null> {
  try {
    const res = await fetch(`${cmsUrl}/api/public/social/like`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-norr3-secret": SECRET },
      body: JSON.stringify({ postId, visitor, liked }),
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { likeCount?: unknown; liked?: unknown };
    return { likeCount: num(data.likeCount), liked: data.liked === true };
  } catch {
    return null;
  }
}

/** `GET /api/public/social/like?visitor=..&ids=..` — the ids this visitor has liked. */
export async function fetchLiked(visitor: string, ids: number[]): Promise<number[]> {
  try {
    const query = new URLSearchParams({ visitor, ids: ids.join(",") });
    const res = await fetch(`${cmsUrl}/api/public/social/like?${query}`, {
      headers: { "x-norr3-secret": SECRET },
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { liked?: unknown };
    return arr<unknown>(data.liked).filter((id): id is number => typeof id === "number");
  } catch {
    return [];
  }
}
