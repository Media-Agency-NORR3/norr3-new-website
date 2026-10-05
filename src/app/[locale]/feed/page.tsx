import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary, getSiteContent } from "@/lib/dictionary";
import { pageSeo, robotsDirective } from "@/lib/pageSeo";
import { getSocialFeed, getSocialMembers, getSocialStories } from "@/lib/social";
import { linkTo } from "@/lib/links";
import { ogImage } from "@/lib/ogImage";
import { absoluteUrl, jsonLd, type MemberSummary } from "@/lib/socialFormat";
import { Container, HeroPill } from "@/components/Container";
import { PillButton } from "@/components/PillButton";
import { Reveal } from "@/components/Reveal";
import { FeedList } from "@/components/social/FeedList";
import { StoriesBar } from "@/components/social/StoriesBar";
import { MemberList, PanelHeading, panelClass } from "@/components/social/ProfileParts";
import { postHref, profileHref } from "@/components/social/PostCard";
import { Avatar } from "@/components/social/Avatar";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  const seo = await pageSeo("feed", locale, {
    title: dict.seo.feed.title,
    description: dict.seo.feed.description,
    image: ogImage("/images/brand/group.webp"),
  });
  const url = linkTo(locale, "/feed");
  return {
    title: seo.title,
    description: seo.description,
    robots: robotsDirective(seo.robots),
    // Hashtag filters (?tag=) are views of this page, not pages of their own.
    alternates: { canonical: seo.canonical || url, languages: { "fi-FI": "/feed", en: "/en/feed", "x-default": "/feed" } },
    openGraph: {
      type: "website" as const,
      siteName: "NØRR3",
      url: absoluteUrl(url),
      locale: locale === "fi" ? "fi_FI" : "en_US",
      title: seo.title,
      description: seo.description,
      images: [{ url: ogImage(seo.image), width: 2000, height: 1333, alt: "The NØRR3 team in the Helsinki studio" }],
    },
    twitter: { card: "summary_large_image" as const, title: seo.title, description: seo.description, images: [ogImage(seo.image)] },
  };
}

/**
 * The public Team Social feed: stories bar, everyone's posts newest first, and
 * on desktop a side column introducing the people. Everything renders — with
 * an empty state — when the social API has nothing (or isn't there yet).
 */
export default async function FeedPage({ params, searchParams }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const query = await searchParams;
  const rawTag = typeof query.tag === "string" ? query.tag.replace(/^#/, "").trim() : "";
  const tag = /^[\p{L}\p{N}_]{2,64}$/u.test(rawTag) ? rawTag : undefined;

  const [content, feed, stories, socialMembers] = await Promise.all([
    getSiteContent(),
    getSocialFeed({ limit: 20 }),
    getSocialStories(),
    getSocialMembers(),
  ]);
  const dict = content.dictionaries[locale];
  const t = dict.social;

  // Until the social API answers, the roster from the site bundle stands in.
  const members: MemberSummary[] =
    socialMembers.length > 0
      ? socialMembers
      : content.team.map((m) => ({
          slug: m.id,
          name: m.name,
          photo: m.photo,
          role: m.role ?? { fi: "", en: "" },
          headline: { fi: "", en: "" },
          postCount: 0,
        }));

  const pageUrl = absoluteUrl(linkTo(locale, "/feed"));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: dict.seo.feed.title,
            description: dict.seo.feed.description,
            url: pageUrl,
            inLanguage: locale === "fi" ? "fi-FI" : "en-US",
            isPartOf: { "@type": "WebSite", name: "NØRR3", url: "https://norr3.fi" },
            publisher: { "@type": "Organization", name: "NØRR3", url: "https://norr3.fi" },
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: feed.posts.length,
              itemListElement: feed.posts.map((post, i) => ({
                "@type": "ListItem",
                position: i + 1,
                url: absoluteUrl(postHref(locale, post.slug)),
              })),
            },
          }),
        }}
      />

      <Container className="pb-24 pt-12 lg:pb-32 lg:pt-16">
        <div className="mx-auto max-w-[1180px]">
          <Reveal className="max-w-2xl">
            <HeroPill>{t.pill}</HeroPill>
            <h1 className="mt-5 text-4xl font-medium leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl dark:text-white">
              {t.feedHeadline}
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-ink/70 lg:text-base dark:text-white/70">{t.feedIntro}</p>
          </Reveal>

          <div className="mt-10 grid items-start gap-8 lg:mt-12 lg:grid-cols-[minmax(0,1fr)_320px] xl:gap-12">
            <div className="mx-auto w-full min-w-0 max-w-[680px] space-y-5 lg:mx-0">
              <StoriesBar groups={stories} locale={locale} t={t} />

              {feed.posts.length > 0 ? (
                <FeedList initialPosts={feed.posts} initialNextBefore={feed.nextBefore} locale={locale} t={t} tag={tag} />
              ) : (
                <EmptyFeed members={members} locale={locale} title={t.emptyTitle} body={t.emptyBody} cta={t.viewTeam} />
              )}
            </div>

            <aside className="hidden lg:sticky lg:top-32 lg:block" aria-labelledby="feed-side-heading">
              <div className={`${panelClass} p-6`}>
                <PanelHeading>{t.teamHeading}</PanelHeading>
                <p id="feed-side-heading" className="mt-3 text-xl font-medium leading-snug tracking-tight text-ink dark:text-white">
                  {t.sideHeading}
                </p>
                <p className="mt-2 text-[14px] leading-relaxed text-ink/65 dark:text-white/65">{t.sideBody}</p>
                <div className="mt-5 max-h-[min(60vh,560px)] overflow-y-auto overscroll-contain pr-1" data-lenis-prevent>
                  <MemberList members={members} locale={locale} />
                </div>
                <div className="mt-5 border-t border-black/[0.06] pt-4 dark:border-white/10">
                  <PillButton href={linkTo(locale, "/tiimi")} variant="text">
                    {t.viewTeam}
                  </PillButton>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </Container>
    </>
  );
}

function EmptyFeed({ members, locale, title, body, cta }: { members: MemberSummary[]; locale: "fi" | "en"; title: string; body: string; cta: string }) {
  const faces = members.filter((m) => m.photo).slice(0, 6);
  return (
    <div className={`${panelClass} flex flex-col items-center px-6 py-14 text-center sm:px-12`}>
      {faces.length > 0 && (
        <div className="flex -space-x-3" aria-hidden>
          {faces.map((m) => (
            <Link key={m.slug} href={profileHref(locale, m.slug)} tabIndex={-1} className="rounded-full ring-4 ring-white dark:ring-[#16131e]">
              <Avatar name={m.name} photo={m.photo} size={52} />
            </Link>
          ))}
        </div>
      )}
      <h2 className="mt-6 text-2xl font-medium tracking-tight text-ink dark:text-white">{title}</h2>
      <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink/65 dark:text-white/65">{body}</p>
      <div className="mt-7">
        <PillButton href={linkTo(locale, "/tiimi")}>{cta}</PillButton>
      </div>
    </div>
  );
}
