import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { isLocale } from "@/i18n/config";
import { getSiteContent } from "@/lib/dictionary";
import { getSocialPost, socialOgImage } from "@/lib/social";
import { linkTo } from "@/lib/links";
import { absoluteUrl, excerpt, fill, jsonLd, loc, mediaSrc, postImage, type Post, type SharedPost } from "@/lib/socialFormat";
import { Container } from "@/components/Container";
import { PillButton } from "@/components/PillButton";
import { Avatar } from "@/components/social/Avatar";
import { PostCard, postHref, profileHref } from "@/components/social/PostCard";
import { PanelHeading, panelClass } from "@/components/social/ProfileParts";

type Props = { params: Promise<{ locale: string; slug: string }> };

const loadPost = cache((slug: string) => getSocialPost(slug));

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const page = await loadPost(slug);
  if (!page) return {};
  const { post } = page;
  const text = post.body || post.shared?.body || "";
  const snippet = excerpt(text, 70);
  const title = snippet ? `${post.author.name}: “${snippet}” | NØRR3` : `${post.author.name} | NØRR3`;
  const description = excerpt(text, 160) || loc(post.author.headline, locale) || `${post.author.name} — NØRR3`;
  const image = postImage(post) || post.author.photo || "/images/brand/group.webp";
  const imageUrl = socialOgImage(image);
  const url = linkTo(locale, `/feed/${slug}`);
  return {
    title,
    description,
    alternates: { canonical: url, languages: { "fi-FI": `/feed/${slug}`, en: `/en/feed/${slug}`, "x-default": `/feed/${slug}` } },
    openGraph: {
      type: "article" as const,
      siteName: "NØRR3",
      url: absoluteUrl(url),
      locale: locale === "fi" ? "fi_FI" : "en_US",
      title,
      description,
      publishedTime: post.createdAt || undefined,
      modifiedTime: post.updatedAt || undefined,
      authors: [absoluteUrl(profileHref(locale, post.author.slug))],
      images: [{ url: imageUrl, alt: excerpt(text, 100) || post.author.name }],
    },
    twitter: { card: "summary_large_image" as const, title, description, images: [imageUrl] },
  };
}

/** schema.org shape for one post (also used for the shared original). */
function postingLd(post: Post | SharedPost, locale: "fi" | "en") {
  const url = absoluteUrl(postHref(locale, post.slug));
  const images = post.media.filter((m) => m.type === "image").map((m) => absoluteUrl(mediaSrc(m.path)));
  const videos = post.media
    .filter((m) => m.type === "video")
    .map((m) => ({
      "@type": "VideoObject",
      name: excerpt(post.body, 100) || post.author.name,
      contentUrl: absoluteUrl(mediaSrc(m.path)),
      ...(m.poster ? { thumbnailUrl: absoluteUrl(mediaSrc(m.poster)) } : {}),
      uploadDate: post.createdAt,
    }));
  return {
    "@type": "SocialMediaPosting",
    "@id": url,
    url,
    headline: excerpt(post.body, 110) || post.author.name,
    articleBody: post.body,
    inLanguage: post.lang === "fi" ? "fi-FI" : "en-US",
    datePublished: post.createdAt,
    dateModified: post.updatedAt || post.createdAt,
    author: {
      "@type": "Person",
      name: post.author.name,
      url: absoluteUrl(profileHref(locale, post.author.slug)),
      ...(post.author.photo ? { image: absoluteUrl(post.author.photo) } : {}),
    },
    ...(images.length ? { image: images } : {}),
    ...(videos.length ? { video: videos } : {}),
    ...(post.embed ? { sharedContent: { "@type": "WebPage", url: post.embed.url || post.embed.embedUrl } } : {}),
    ...(post.link && !post.embed ? { sharedContent: { "@type": "WebPage", url: post.link.url, name: post.link.title } } : {}),
    interactionStatistic: [
      { "@type": "InteractionCounter", interactionType: "https://schema.org/LikeAction", userInteractionCount: post.likeCount },
      { "@type": "InteractionCounter", interactionType: "https://schema.org/CommentAction", userInteractionCount: post.commentCount },
      { "@type": "InteractionCounter", interactionType: "https://schema.org/ShareAction", userInteractionCount: post.shareCount },
    ],
  };
}

export default async function PostPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const [page, content] = await Promise.all([loadPost(slug), getSiteContent()]);
  if (!page) notFound();
  const t = content.dictionaries[locale].social;
  const { post, more } = page;
  const firstName = post.author.name.split(" ")[0];

  const ld = {
    "@context": "https://schema.org",
    ...postingLd(post, locale),
    ...(post.shared ? { sharedContent: postingLd(post.shared, locale) } : {}),
    ...(post.comments.length
      ? {
          comment: post.comments.map((c) => ({
            "@type": "Comment",
            text: c.body,
            dateCreated: c.createdAt,
            author: { "@type": "Person", name: c.author.name, url: absoluteUrl(profileHref(locale, c.author.slug)) },
          })),
        }
      : {}),
    isPartOf: { "@type": "CollectionPage", url: absoluteUrl(linkTo(locale, "/feed")) },
    publisher: { "@type": "Organization", name: "NØRR3", url: "https://norr3.fi" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(ld) }} />

      <Container className="pb-24 pt-8 lg:pb-32 lg:pt-12">
        <div className="mx-auto grid max-w-[1180px] items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px] xl:gap-12">
          <div className="mx-auto w-full min-w-0 max-w-[720px] lg:mx-0">
            <Link
              href={linkTo(locale, "/feed")}
              className="inline-flex items-center gap-1.5 rounded-sm text-xs font-medium text-ink/50 transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple dark:text-white/50 dark:hover:text-white dark:focus-visible:outline-light-purple"
            >
              <span aria-hidden>←</span> {t.backToFeed}
            </Link>
            {/* The card's own heading is the author; the page title is the post. */}
            <h1 className="sr-only">{excerpt(post.body || post.shared?.body || "", 110) || fill(t.postBy, { name: post.author.name })}</h1>
            <div className="mt-5">
              <PostCard post={post} locale={locale} t={t} variant="full" />
            </div>
          </div>

          <aside aria-label={t.profileLabel} className="space-y-5 lg:sticky lg:top-32">
            <div className={`${panelClass} p-6`}>
              <Link href={profileHref(locale, post.author.slug)} className="group/author flex items-center gap-3 rounded-[6px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple dark:focus-visible:outline-light-purple">
                <Avatar name={post.author.name} photo={post.author.photo} size={56} />
                <span className="min-w-0">
                  <span className="block truncate text-[16px] font-medium text-ink group-hover/author:text-purple dark:text-white dark:group-hover/author:text-light-purple">
                    {post.author.name}
                  </span>
                  <span className="line-clamp-2 block text-[13px] leading-snug text-ink/55 dark:text-white/55">
                    {loc(post.author.headline, locale) || loc(post.author.role, locale)}
                  </span>
                </span>
              </Link>
              <div className="mt-4">
                <PillButton href={profileHref(locale, post.author.slug)} variant="secondary" className="w-full">
                  {content.dictionaries[locale].common.viewProfile}
                </PillButton>
              </div>
            </div>
          </aside>
        </div>

        {more.length > 0 && (
          <section aria-labelledby="post-more" className="mx-auto mt-16 max-w-[1180px] lg:mt-20">
            <PanelHeading id="post-more">{fill(t.moreFrom, { name: firstName })}</PanelHeading>
            <ul className="mt-5 grid items-start gap-4 sm:gap-5 lg:grid-cols-3">
              {more.slice(0, 3).map((p) => (
                <li key={p.id}>
                  <PostCard post={p} locale={locale} t={t} headingLevel={3} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </Container>
    </>
  );
}
