import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { isLocale, type Locale } from "@/i18n/config";
import { getSiteContent } from "@/lib/dictionary";
import { getSocialMember, getSocialMembers, profileFromRoster, socialOgImage, type MemberPage } from "@/lib/social";
import { linkTo } from "@/lib/links";
import { absoluteUrl, excerpt, fill, loc, paragraphs, safeHttpUrl, type MemberSummary } from "@/lib/socialFormat";
import { JsonLd } from "@/components/JsonLd";
import { ORGANIZATION_ID, WEBSITE_ID, breadcrumbList, homeCrumb, inLanguage, organizationRef, pageUrl, personId } from "@/lib/jsonld";
import { Container } from "@/components/Container";
import { PillButton } from "@/components/PillButton";
import { ProfileHeader } from "@/components/social/ProfileHeader";
import { PostCard } from "@/components/social/PostCard";
import { MemberList, PanelHeading, panelClass } from "@/components/social/ProfileParts";
import { SkillChips } from "@/components/social/SkillChips";
import { PortfolioGrid } from "@/components/social/PortfolioGrid";

type Props = { params: Promise<{ locale: string; slug: string }> };

/**
 * The profile, from the social API — or, when the API doesn't know the member
 * yet (CMS side not deployed, or unreachable), from the team roster in the
 * site bundle, so every card on /tiimi always has somewhere to land. A slug in
 * neither is a 404.
 */
const loadProfile = cache(async (slug: string): Promise<MemberPage | null> => {
  const social = await getSocialMember(slug);
  if (social) return social;
  const content = await getSiteContent();
  const rostered = content.team.find((m) => m.id === slug);
  return rostered ? { member: profileFromRoster(rostered), posts: [], highlights: [], stories: [] } : null;
});

/** "About" falls back to the member's bio, but never to the shared house line. */
async function aboutText(page: MemberPage, locale: Locale): Promise<string> {
  const about = loc(page.member.about, locale);
  if (about) return about;
  const { houseBio } = await getSiteContent();
  const bio = loc(page.member.bio, locale);
  return bio && bio !== houseBio[locale] && bio !== houseBio.fi ? bio : "";
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const page = await loadProfile(slug);
  if (!page) return {};
  const { member } = page;
  const role = loc(member.role, locale);
  const headline = loc(member.headline, locale);
  const about = await aboutText(page, locale);
  const title = `${member.name}${role ? ` — ${role}` : ""} | NØRR3`;
  const description = excerpt([headline, about].filter(Boolean).join(" — ") || `${member.name}${role ? `, ${role}` : ""} — NØRR3`, 160);
  const image = member.cover || member.photo || "/images/brand/group.webp";
  const url = linkTo(locale, `/tiimi/${slug}`);
  const [firstName, ...rest] = member.name.split(" ");
  return {
    title,
    description,
    alternates: { canonical: url, languages: { "fi-FI": `/tiimi/${slug}`, en: `/en/tiimi/${slug}`, "x-default": `/tiimi/${slug}` } },
    openGraph: {
      type: "profile" as const,
      siteName: "NØRR3",
      url: absoluteUrl(url),
      locale: locale === "fi" ? "fi_FI" : "en_US",
      title,
      description,
      firstName,
      lastName: rest.join(" ") || undefined,
      username: slug,
      images: [{ url: socialOgImage(image), alt: member.name }],
    },
    twitter: { card: "summary_large_image" as const, title, description, images: [socialOgImage(image)] },
  };
}

export default async function ProfilePage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const page = await loadProfile(slug);
  if (!page) notFound();

  const [content, socialMembers] = await Promise.all([getSiteContent(), getSocialMembers()]);
  const dict = content.dictionaries[locale];
  const t = dict.social;
  const { member, posts, highlights, stories } = page;
  const about = await aboutText(page, locale);
  const role = loc(member.role, locale);
  const url = absoluteUrl(linkTo(locale, `/tiimi/${slug}`));
  const linkedin = safeHttpUrl(member.linkedin);

  const others: MemberSummary[] =
    socialMembers.length > 0
      ? socialMembers
      : content.team.map((m) => ({ slug: m.id, name: m.name, photo: m.photo, role: m.role ?? { fi: "", en: "" }, headline: { fi: "", en: "" }, postCount: 0 }));

  const photo = member.photo ? absoluteUrl(member.photo) : undefined;

  return (
    <>
      {/* ProfilePage whose main entity is the member's Person node. The
          Person @id is locale-independent (…/tiimi/<slug>#person) so the
          home page's Organization.employee list and article authors resolve
          to it from either language. */}
      <JsonLd
        data={[
          {
            "@type": "ProfilePage",
            "@id": url,
            url,
            name: `${member.name}${role ? ` — ${role}` : ""} | NØRR3`,
            inLanguage: inLanguage(locale),
            isPartOf: { "@id": WEBSITE_ID },
            breadcrumb: { "@id": `${url}#breadcrumb` },
            ...(posts[0]?.updatedAt ? { dateModified: posts[0].updatedAt } : {}),
            mainEntity: { "@id": personId(slug) },
          },
          {
            "@type": "Person",
            "@id": personId(slug),
            name: member.name,
            url,
            ...(role ? { jobTitle: role } : {}),
            ...(photo ? { image: photo } : {}),
            ...(about || loc(member.headline, locale) ? { description: excerpt(loc(member.headline, locale) || about, 300) } : {}),
            ...(linkedin ? { sameAs: [linkedin] } : {}),
            ...(member.email ? { email: member.email } : {}),
            ...(member.skills.length ? { knowsAbout: member.skills } : {}),
            ...(member.location ? { homeLocation: { "@type": "Place", name: member.location } } : {}),
            worksFor: organizationRef(),
            memberOf: { "@id": ORGANIZATION_ID },
            ...(member.postCount || posts.length
              ? {
                  agentInteractionStatistic: {
                    "@type": "InteractionCounter",
                    interactionType: "https://schema.org/WriteAction",
                    userInteractionCount: member.postCount || posts.length,
                  },
                }
              : {}),
          },
          breadcrumbList(url, [homeCrumb(locale), { name: t.teamHeading, url: pageUrl(locale, "/tiimi") }, { name: member.name }]),
        ]}
      />

      <Container className="pb-24 pt-8 lg:pb-32 lg:pt-12">
        <div className="mx-auto max-w-[1180px]">
          <nav aria-label={locale === "fi" ? "Murupolku" : "Breadcrumb"} className="mb-5 text-[13px] text-ink/50 dark:text-white/50">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href={linkTo(locale, "/tiimi")} className="rounded-sm hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple dark:hover:text-white dark:focus-visible:outline-light-purple">
                  {t.teamHeading}
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="truncate text-ink/75 dark:text-white/75">
                {member.name}
              </li>
            </ol>
          </nav>

          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px] xl:gap-12">
            <div className="min-w-0 space-y-5">
              {/* Not behind a Reveal: the name is the page's h1 and its LCP. */}
              <ProfileHeader
                  member={member}
                  stories={stories}
                  highlights={highlights}
                  locale={locale}
                  t={t}
                  linkedinLabel={dict.common.linkedin}
                  emailLabel={dict.common.email}
                />

              {about && (
                <section aria-labelledby="profile-about" className={`${panelClass} p-5 sm:p-8`}>
                  <PanelHeading id="profile-about">{t.about}</PanelHeading>
                  <div className="mt-4 max-w-3xl space-y-4 text-[15px] leading-relaxed text-ink/80 lg:text-base dark:text-white/80">
                    {paragraphs(about).map((p, i) => (
                      <p key={i} className="whitespace-pre-line">
                        {p}
                      </p>
                    ))}
                  </div>
                </section>
              )}

              {member.skills.length > 0 && (
                <section aria-labelledby="profile-skills" className={`${panelClass} p-5 sm:p-8`}>
                  <PanelHeading id="profile-skills">{t.skills}</PanelHeading>
                  <div className="mt-4">
                    <SkillChips skills={member.skills} />
                  </div>
                </section>
              )}

              {member.portfolio.length > 0 && (
                <section aria-labelledby="profile-portfolio" className={`${panelClass} p-5 sm:p-8`}>
                  <PanelHeading id="profile-portfolio">{t.portfolio}</PanelHeading>
                  <div className="mt-5">
                    <PortfolioGrid items={member.portfolio} openLabel={t.openPortfolio} />
                  </div>
                </section>
              )}

              <section aria-labelledby="profile-posts" className="pt-3">
                <h2 id="profile-posts" className="mb-4 px-1 text-[11px] font-medium uppercase tracking-[0.14em] text-purple dark:text-light-purple">
                  {t.posts}
                </h2>
                {posts.length > 0 ? (
                  <ol className="space-y-4 sm:space-y-5">
                    {posts.map((post) => (
                      <li key={post.id}>
                        <PostCard post={post} locale={locale} t={t} showPinned headingLevel={3} />
                      </li>
                    ))}
                  </ol>
                ) : (
                  <div className={`${panelClass} px-6 py-10 text-center`}>
                    <p className="text-[15px] text-ink/60 dark:text-white/60">{fill(t.noPostsYet, { name: member.name.split(" ")[0] })}</p>
                    <div className="mt-5">
                      <PillButton href={linkTo(locale, "/feed")} variant="text">
                        {t.teamFeedCta}
                      </PillButton>
                    </div>
                  </div>
                )}
              </section>
            </div>

            <aside aria-labelledby="profile-others" className="lg:sticky lg:top-32">
              <div className={`${panelClass} p-6`}>
                <PanelHeading id="profile-others">{t.otherMembers}</PanelHeading>
                <div className="mt-4 max-h-[min(60vh,560px)] overflow-y-auto overscroll-contain pr-1" data-lenis-prevent>
                  <MemberList members={others} locale={locale} current={member.slug} />
                </div>
                <div className="mt-5 flex flex-col items-start gap-2 border-t border-black/[0.06] pt-4 dark:border-white/10">
                  <PillButton href={linkTo(locale, "/feed")} variant="text">
                    {t.teamFeedCta}
                  </PillButton>
                  <PillButton href={`${linkTo(locale, "/tiimi")}#tiimi`} variant="text">
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
