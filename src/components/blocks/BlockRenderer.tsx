"use client";

import Link from "next/link";
import { Container, HeroPill } from "@/components/Container";
import { PillButton } from "@/components/PillButton";
import { Reveal } from "@/components/Reveal";
import { StaggerGrid } from "@/components/StaggerGrid";
import { SectionHeader } from "@/components/SectionHeader";
import { SplitHeadline } from "@/components/SplitHeadline";
import { StatGrid } from "@/components/StatGrid";
import { Icon } from "@/components/Icon";
import { ParallaxImage } from "@/components/ParallaxImage";
import { TeamMarquee } from "@/components/TeamMarquee";
import { AudienceChart } from "@/components/AudienceChart";
import { DashboardMock } from "@/components/DashboardMock";
import { LogoStrip } from "@/components/marquee/LogoStrip";
import { PillMarquee } from "@/components/marquee/PillMarquee";
import { HighlightsBand } from "@/components/marquee/HighlightsBand";
import { MediaMixSimulator } from "@/components/simulator/MediaMixSimulator";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { CaseCard } from "@/components/cards/CaseCard";
import { BlogCard } from "@/components/cards/BlogCard";
import { BenefitCard } from "@/components/cards/BenefitCard";
import { CultureCard } from "@/components/cards/CultureCard";
import { TeamMemberCard } from "@/components/cards/TeamMemberCard";
import { LeadContactCard } from "@/components/cards/LeadContactCard";
import { ContactForm } from "@/components/ContactForm";
import { StickerHero } from "@/components/heroes/StickerHero";
import { CityHero } from "@/components/heroes/CityHero";
import { heroFor, heroImages, heroList, heroNumber, heroWords } from "@/content/heroes";
import { audienceChannels, dashboardData, dataset } from "@/content/datasets";
import { HeroCardStack } from "@/components/heroes/HeroCardStack";
import { ArrowsDeliver } from "@/components/heroes/ArrowsDeliver";
import { ChessStrategy } from "@/components/heroes/ChessStrategy";
import { bool, num, rows, slots, str, styleOf, text, type Block } from "@/content/blocks";
import { BLOCK_TONE, StyleScope, TONE_IS_DARK, TONE_IS_PALE, pad } from "./BlockShell";
import { CodeEmbed } from "./CodeEmbed";
import { cx } from "@/lib/cx";
import { linkTo } from "@/lib/links";
import type { BlockContext } from "./context";

/**
 * Renders a CMS block document with the site's own components.
 *
 * The mapping here is the whole point of the page builder: an editor arranges
 * abstract blocks, and each one comes out as the same brand component a
 * hand-written page would use — so a composed page is indistinguishable from a
 * coded one, in both themes, with the same motion and spacing.
 *
 * It is a client component on purpose. The published route renders it on the
 * server as usual, and the CMS preview route renders the *same* component from
 * blocks arriving over postMessage, so what an editor drags is what ships.
 */
export function BlockRenderer({
  blocks,
  context,
  selectable = false,
  onSelect,
}: {
  blocks: Block[];
  context: BlockContext;
  /** Preview mode: outline blocks and report clicks back to the editor. */
  selectable?: boolean;
  onSelect?: (blockId: string) => void;
}) {
  return (
    <>
      {blocks
        .filter((block) => !block.hidden)
        .map((block) => (
          <BlockFrame key={block.id} block={block} selectable={selectable} onSelect={onSelect}>
            <StyleScope style={scopeStyle(block)} blockId={block.id}>
              <BlockSwitch block={block} context={context} selectable={selectable} onSelect={onSelect} />
            </StyleScope>
          </BlockFrame>
        ))}
    </>
  );
}

/**
 * Blocks that paint their own full-width surface. StyleScope must not also draw
 * the tone for these or the band would be doubled — the closing CTA keeps a pale
 * lavender in dark mode by design, and the highlights band is a solid black strip.
 */
const SELF_SURFACED = new Set(["cta.banner", "highlights.band"]);

/** The style StyleScope should apply, minus anything the block draws itself. */
function scopeStyle(block: Block) {
  const style = styleOf(block.props);
  return SELF_SURFACED.has(block.type) ? { ...style, tone: "none" } : style;
}

function BlockFrame({
  block,
  selectable,
  onSelect,
  children,
}: {
  block: Block;
  selectable: boolean;
  onSelect?: (blockId: string) => void;
  children: React.ReactNode;
}) {
  if (!selectable) return <>{children}</>;
  return (
    <div
      data-cms-block={block.id}
      onClick={(event) => {
        event.stopPropagation();
        onSelect?.(block.id);
      }}
      className="relative cursor-pointer outline-offset-[-2px] transition-[outline-color] hover:outline hover:outline-2 hover:outline-purple/50"
    >
      {children}
    </div>
  );
}

function BlockSwitch({
  block,
  context,
  selectable,
  onSelect,
}: {
  block: Block;
  context: BlockContext;
  selectable: boolean;
  onSelect?: (blockId: string) => void;
}) {
  const { locale, dict } = context;
  const p = block.props;
  // Background, radius and animation are applied by StyleScope around this
  // switch; spacing, width and alignment are resolved per block below, because
  // "normal" means whatever rhythm the block was designed with.
  const st = styleOf(p);
  const t = (key: string) => text(p[key], locale);
  const href = (value: unknown) => localeHref(str(value), locale);

  switch (block.type) {
    /* ---------------------------------------------------------------- heroes */
    case "hero.split": {
      const visual = str(p.visual, "none");
      return (
        <section>
          {/* Hero visuals read the matching row from the Heroes collection, so a
              composed page's hero is configured in the same place as the home
              page's rather than being a second, separate set of content. */}
          {visual === "stickers" ? (
            <StickerHero locale={locale} content={stickerContent(context, locale)} />
          ) : visual === "city" ? (
            <CityHero
              locale={locale}
              layers={cityLayers(context)}
              rotateEvery={heroNumber(heroFor(context.heroes, "city"), "rotateEvery", 2400, 400, 30000)}
              content={{ words: heroWords(heroFor(context.heroes, "city"), locale, []) }}
            />
          ) : (
            <Container className={pad(st, "pt-12 lg:pt-20")}>
              <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
                <div>
                  <Reveal>
                    <SplitHeadline left={t("headlineLeft")} accent={t("headlineAccent")} />
                  </Reveal>
                  {t("body") && (
                    <Reveal delay={0.1}>
                      <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-ink/80 lg:text-base dark:text-white/80">
                        {t("body")}
                      </p>
                    </Reveal>
                  )}
                  <Reveal delay={0.18} className="mt-8 flex flex-wrap gap-3">
                    {t("ctaLabel") && (
                      <PillButton href={href(p.ctaHref)} variant={buttonVariant(str(p.ctaVariant, "primary"))}>
                        {t("ctaLabel")}
                      </PillButton>
                    )}
                    {t("secondaryLabel") && (
                      <PillButton href={href(p.secondaryHref)} variant="secondary">
                        {t("secondaryLabel")}
                      </PillButton>
                    )}
                  </Reveal>
                </div>
                <div>
                  {visual === "cards" ? (
                    <HeroCardStack locale={locale} />
                  ) : visual === "arrows" ? (
                    <div className="text-purple dark:text-light-purple">
                      <ArrowsDeliver />
                    </div>
                  ) : visual === "chess" ? (
                    <ChessStrategy />
                  ) : visual === "image" && str(p.image) ? (
                    <img
                      src={str(p.image)}
                      alt={t("headlineLeft")}
                      className="w-full rounded-card object-cover"
                    />
                  ) : null}
                </div>
              </div>
            </Container>
          )}
        </section>
      );
    }

    case "hero.page": {
      const centered = st.align === "center";
      return (
        <Container className={pad(st, "pt-12 lg:pt-20")}>
          <div className={centered ? "mx-auto max-w-3xl text-center" : ""}>
            {t("pill") && (
              <Reveal>
                <HeroPill>{t("pill")}</HeroPill>
              </Reveal>
            )}
            <Reveal delay={0.05}>
              <h1 className="mt-6 text-[min(10vw,7.5rem)] font-medium leading-[0.95] tracking-tight text-ink dark:text-white">
                {t("heading")}
              </h1>
            </Reveal>
            {t("body") && (
              <Reveal delay={0.15}>
                <p
                  className={`mt-6 text-[15px] leading-relaxed text-ink/80 lg:text-base dark:text-white/80 ${
                    centered ? "mx-auto max-w-xl" : "max-w-md"
                  }`}
                >
                  {t("body")}
                </p>
              </Reveal>
            )}
            {t("ctaLabel") && (
              <Reveal delay={0.2} className={`mt-8 flex ${centered ? "justify-center" : ""}`}>
                <PillButton href={href(p.ctaHref)} variant={buttonVariant(str(p.ctaVariant, "primary"))}>
                  {t("ctaLabel")}
                </PillButton>
              </Reveal>
            )}
          </div>
        </Container>
      );
    }

    /* ------------------------------------------------------------------ text */
    case "section.header":
      return (
        <Container className={pad(st, "py-16 lg:py-24")}>
          <SectionHeader
            heading={t("heading")}
            body={t("body") || undefined}
            cta={t("ctaLabel") || undefined}
            ctaHref={str(p.ctaHref) ? href(p.ctaHref) : undefined}
          />
        </Container>
      );

    case "richtext": {
      const width =
        st.width === "full" ? "" : st.width === "wide" ? "mx-auto max-w-4xl" : "mx-auto max-w-2xl";
      return (
        <Container className={pad(st, "py-16 lg:py-24")}>
          <Reveal>
            <article
              className={`cms-richtext ${width}`}
              // Sanitised on write by the CMS against a narrow tag allowlist.
              dangerouslySetInnerHTML={{ __html: t("html") }}
            />
          </Reveal>
        </Container>
      );
    }

    case "quote": {
      const clauses = rows(p.clauses).map((row) => text(row.text, locale)).filter(Boolean);
      const onDark = TONE_IS_DARK.has(st.tone);
      return (
          <Container className={pad(st, "py-16 lg:py-24")}>
            <Reveal className="mx-auto max-w-4xl text-center">
              {clauses.length > 0 && (
                <p
                  className={`text-3xl font-medium leading-[1.15] tracking-tight lg:text-h3 ${
                    onDark ? "text-white" : "text-ink dark:text-white"
                  }`}
                >
                  {clauses.map((clause, i) => (
                    <span key={i} className={i === 1 ? "text-purple dark:text-light-purple" : ""}>
                      {clause}{" "}
                    </span>
                  ))}
                </p>
              )}
              {t("body") && (
                <p
                  className={`mx-auto mt-6 max-w-2xl text-[15px] leading-relaxed ${
                    onDark ? "text-white/75" : "text-ink/75 dark:text-white/75"
                  }`}
                >
                  {t("body")}
                </p>
              )}
              {str(p.client) && (
                <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.14em] text-purple dark:text-light-purple">
                  {str(p.client)}
                </p>
              )}
            </Reveal>
        </Container>
      );
    }

    case "accordion": {
      const items = rows(p.items);
      if (items.length === 0) return null;
      return (
        <Container className={pad(st, "py-16 lg:py-24")}>
          {t("heading") && (
            <Reveal>
              <h2 className="mb-8 text-3xl font-medium tracking-tight text-ink lg:text-h3 dark:text-white">
                {t("heading")}
              </h2>
            </Reveal>
          )}
          <div className="mx-auto max-w-3xl divide-y divide-black/10 dark:divide-white/10">
            {items.map((row, i) => (
              <details key={i} className="group py-5">
                <summary className="flex cursor-pointer items-center justify-between gap-4 text-lg font-medium text-ink marker:content-none dark:text-white">
                  {text(row.title, locale)}
                  <Icon
                    name="expand_more"
                    className="shrink-0 text-[22px] text-purple transition-transform group-open:rotate-180 dark:text-light-purple"
                  />
                </summary>
                <p className="mt-3 text-[15px] leading-relaxed text-ink/75 dark:text-white/75">
                  {text(row.body, locale)}
                </p>
              </details>
            ))}
          </div>
        </Container>
      );
    }

    /* ----------------------------------------------------------------- media */
    case "image": {
      const src = str(p.src);
      if (!src) return null;
      const aspect = str(p.aspect, "16/9");
      const width = str(p.width, "container");
      const rounded = bool(p.rounded) ? "rounded-card" : "";
      const image = bool(p.parallax) ? (
        <ParallaxImage src={src} alt={t("alt")} className={`w-full ${rounded}`} />
      ) : (
        <img
          src={src}
          alt={t("alt")}
          loading="lazy"
          className={`w-full object-cover ${rounded}`}
          style={aspect === "auto" ? undefined : { aspectRatio: aspect }}
        />
      );
      const body = (
        <Reveal className={width === "prose" ? "mx-auto max-w-2xl" : ""}>
          <figure>
            {image}
            {t("caption") && (
              <figcaption className="mt-3 text-[13px] text-ink/55 dark:text-white/55">{t("caption")}</figcaption>
            )}
          </figure>
        </Reveal>
      );
      return width === "bleed" ? (
        <section className="py-10 lg:py-14">{body}</section>
      ) : (
        <Container className={pad(st, "py-10 lg:py-14")}>{body}</Container>
      );
    }

    case "image.duo": {
      const left = str(p.left);
      const right = str(p.right);
      if (!left && !right) return null;
      return (
        <Container className={pad(st, "py-10 lg:py-14")}>
          <Reveal>
            <figure>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  [left, t("leftAlt")],
                  [right, t("rightAlt")],
                ]
                  .filter(([src]) => src)
                  .map(([src, alt]) => (
                    <img
                      key={src}
                      src={src}
                      alt={alt}
                      loading="lazy"
                      className="aspect-[4/3] w-full rounded-card object-cover"
                    />
                  ))}
              </div>
              {t("caption") && (
                <figcaption className="mt-3 text-[13px] text-ink/55 dark:text-white/55">{t("caption")}</figcaption>
              )}
            </figure>
          </Reveal>
        </Container>
      );
    }

    case "video.embed": {
      const embed = embedUrl(str(p.url));
      if (!embed) return null;
      return (
        <Container className={pad(st, "py-10 lg:py-14")}>
          <Reveal className="mx-auto max-w-4xl">
            <figure>
              <div className="aspect-video w-full overflow-hidden rounded-card bg-ink">
                <iframe
                  src={embed}
                  title={t("caption") || "Video"}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                  className="h-full w-full"
                />
              </div>
              {t("caption") && (
                <figcaption className="mt-3 text-[13px] text-ink/55 dark:text-white/55">{t("caption")}</figcaption>
              )}
            </figure>
          </Reveal>
        </Container>
      );
    }

    case "logos.strip":
      return (
        <section className="py-8">
          {t("heading") && (
            <Container className="pb-4">
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink/45 dark:text-white/45">
                {t("heading")}
              </p>
            </Container>
          )}
          <LogoStrip clients={context.clients} locale={context.locale} />
        </section>
      );

    /* ----------------------------------------------------------- collections */
    case "services.grid": {
      const limit = num(p.limit, 0);
      const items = limit > 0 ? context.services.slice(0, limit) : context.services;
      if (items.length === 0) return null;
      return (
        <Container className={pad(st, "py-16 lg:py-24")}>
          {(t("heading") || t("body")) && (
            <SectionHeader
              heading={t("heading")}
              body={t("body") || undefined}
              cta={t("ctaLabel") || undefined}
              ctaHref={str(p.ctaHref) ? href(p.ctaHref) : undefined}
            />
          )}
          <StaggerGrid className="mt-14 grid gap-card sm:grid-cols-2 lg:grid-cols-3">
            {items.map((service) => (
              <ServiceCard
                key={service.number + service.en.title}
                number={service.number}
                icon={service.icon}
                title={service[locale].title}
                body={service[locale].body}
                items={
                  bool(p.showItems)
                    ? service.items?.map((item) => ({
                        label: item[locale],
                        desc: locale === "fi" ? item.desc_fi : item.desc_en,
                      }))
                    : undefined
                }
                outcomes={service.outcomes?.[locale]}
                whatYouGetLabel={dict.common.whatYouGet}
              />
            ))}
          </StaggerGrid>
        </Container>
      );
    }

    case "cases.grid": {
      const limit = num(p.limit, 0);
      const all = context.cases;
      const items = limit > 0 ? all.slice(0, limit) : all;
      if (items.length === 0) return null;
      return (
        <Container className={pad(st, "py-16 lg:py-24")}>
          {(t("heading") || t("body")) && (
            <SectionHeader
              heading={t("heading")}
              body={t("body") || undefined}
              cta={t("ctaLabel") || undefined}
              ctaHref={str(p.ctaHref) ? href(p.ctaHref) : undefined}
            />
          )}
          <StaggerGrid className="mt-14 grid gap-card sm:grid-cols-2">
            {items.map((study) => (
              <CaseCard
                key={study.slug}
                study={study}
                locale={locale}
                ctaLabel={dict.common.readCase}
                large={study.size === "large"}
              />
            ))}
          </StaggerGrid>
        </Container>
      );
    }

    case "posts.grid": {
      const category = str(p.category);
      const filtered = category ? context.posts.filter((post) => post.category === category) : context.posts;
      const limit = num(p.limit, 3);
      const items = limit > 0 ? filtered.slice(0, limit) : filtered;
      if (items.length === 0) return null;
      return (
        <Container className={pad(st, "py-16 lg:py-24")}>
          {(t("heading") || t("body")) && (
            <SectionHeader
              heading={t("heading")}
              body={t("body") || undefined}
              cta={t("ctaLabel") || undefined}
              ctaHref={str(p.ctaHref) ? href(p.ctaHref) : undefined}
            />
          )}
          <StaggerGrid className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((post) => (
              <BlogCard
                key={post.slug}
                post={post}
                locale={locale}
                readMoreLabel={dict.common.readMore}
                minReadLabel={dict.insights.minRead}
              />
            ))}
          </StaggerGrid>
        </Container>
      );
    }

    case "team.grid": {
      const pool = bool(p.managementOnly) ? context.team.filter((member) => member.role) : context.team;
      const limit = num(p.limit, 0);
      const items = limit > 0 ? pool.slice(0, limit) : pool;
      if (items.length === 0) return null;
      return (
        <Container className={pad(st, "py-16 lg:py-24")}>
          {(t("heading") || t("body")) && <SectionHeader heading={t("heading")} body={t("body") || undefined} />}
          <StaggerGrid className="mt-14 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((member) => (
              <TeamMemberCard
                key={member.id}
                houseBio={context.houseBio}
                member={member}
                locale={locale}
                linkedinLabel={dict.common.linkedin}
                emailLabel={dict.common.email}
              />
            ))}
          </StaggerGrid>
        </Container>
      );
    }

    case "team.marquee":
      return (
        <section className="py-10 lg:py-14">
          {t("caption") && (
            <Container className="pb-5">
              <p className="max-w-xl text-[15px] leading-relaxed text-ink/70 dark:text-white/70">{t("caption")}</p>
            </Container>
          )}
          <TeamMarquee locale={locale} members={context.team} />
        </section>
      );

    case "careers.list": {
      const roles = context.openRoles;
      return (
        <Container className={pad(st, "py-16 lg:py-24")}>
          {(t("heading") || t("body")) && <SectionHeader heading={t("heading")} body={t("body") || undefined} />}
          {roles.length === 0 ? (
            <p className="mt-10 text-[15px] text-ink/60 dark:text-white/60">{t("note")}</p>
          ) : (
            <ul className="mt-12 divide-y divide-black/10 dark:divide-white/10">
              {roles.map((role) => (
                <li key={role.id} className="flex flex-wrap items-center justify-between gap-4 py-5">
                  <div>
                    <p className="text-xl font-medium text-ink dark:text-white">{role.title[locale]}</p>
                    <p className="mt-1 text-sm text-ink/55 dark:text-white/55">{role.location[locale]}</p>
                  </div>
                  <PillButton href={role.applyUrl || linkTo(locale, "/toihin-meille#open-roles")} variant="secondary">
                    {t("applyLabel") || dict.common.readMore}
                  </PillButton>
                </li>
              ))}
            </ul>
          )}
          {roles.length > 0 && t("note") && (
            <p className="mt-8 max-w-xl text-[13px] leading-relaxed text-ink/55 dark:text-white/55">{t("note")}</p>
          )}
        </Container>
      );
    }

    /* ------------------------------------------------------------------ data */
    case "stats.grid": {
      const stats = rows(p.items).map((row) => ({
        value: num(row.value),
        decimals: num(row.decimals, 0),
        prefix: str(row.prefix),
        suffix: str(row.suffix),
        label: text(row.label, locale),
      }));
      if (stats.length === 0) return null;
      return (
        <Container className={pad(st, "py-16 lg:py-24")}>
          <StatGrid stats={stats} locale={locale} label={t("heading") || undefined} columns={stats.length >= 4 ? 3 : 2} />
        </Container>
      );
    }

    case "benefits.grid": {
      const items = rows(p.items);
      if (items.length === 0) return null;
      const columns = str(p.columns, "3");
      const grid = columns === "2" ? "sm:grid-cols-2" : columns === "4" ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-3";
      return (
        <Container className={pad(st, "py-16 lg:py-24")}>
          {(t("heading") || t("body")) && <SectionHeader heading={t("heading")} body={t("body") || undefined} />}
          <StaggerGrid className={`mt-14 grid gap-card ${grid}`}>
            {items.map((row, i) => (
              <BenefitCard
                key={i}
                icon={str(row.icon, "check")}
                title={text(row.title, locale)}
                body={text(row.body, locale)}
              />
            ))}
          </StaggerGrid>
        </Container>
      );
    }

    case "features.list": {
      const items = rows(p.items);
      if (items.length === 0) return null;
      return (
        <Container className={pad(st, "py-16 lg:py-24")}>
          {(t("heading") || t("body")) && <SectionHeader heading={t("heading")} body={t("body") || undefined} />}
          <StaggerGrid className="mt-14 grid gap-card sm:grid-cols-2 lg:grid-cols-3">
            {items.map((row, i) => (
              <CultureCard
                key={i}
                number={String(i + 1).padStart(2, "0")}
                icon={str(row.icon, "trending_up")}
                title={text(row.title, locale)}
                body={text(row.body, locale)}
              />
            ))}
          </StaggerGrid>
        </Container>
      );
    }

    case "audience.chart":
      return (
        <Container className={pad(st, "py-16 lg:py-24")}>
          {(t("heading") || t("body")) && <SectionHeader heading={t("heading")} body={t("body") || undefined} />}
          <div className="mt-12">
            <AudienceChart
              channels={dataset(context.datasets, "audienceChannels", locale, audienceChannels)}
              legendMen={t("legendMen") || dict.services.insights.legendMen}
              legendWomen={t("legendWomen") || dict.services.insights.legendWomen}
              description={t("chartAlt") || dict.services.insights.chartAlt}
            />
          </div>
        </Container>
      );

    case "engine.simulator":
      return (
        <Container className={pad(st, "py-16 lg:py-24")}>
          {(t("heading") || t("body")) && <SectionHeader heading={t("heading")} body={t("body") || undefined} />}
          <div className="mt-12">
            <MediaMixSimulator locale={locale} labels={dict.engine.simulator} channels={context.channels} />
          </div>
          {t("note") && (
            <p className="mt-6 text-[13px] text-ink/50 dark:text-white/50">{t("note")}</p>
          )}
        </Container>
      );

    case "engine.dashboard":
      return (
        <Container className={pad(st, "py-16 lg:py-24")}>
          {(t("heading") || t("body")) && <SectionHeader heading={t("heading")} body={t("body") || undefined} />}
          <div className="mt-12">
            <DashboardMock
              locale={locale}
              labels={dict.engine.dashboard}
              data={dataset(context.datasets, "dashboard", locale, dashboardData)}
            />
          </div>
        </Container>
      );

    case "pill.marquee":
      return (
        <section className="py-8">
          <PillMarquee
            items={context.mediaGroups.map((group) => ({
              id: group.id,
              icon: group.icon,
              label: group[locale],
            }))}
          />
        </section>
      );

    case "highlights.band":
      return <HighlightsBand clients={context.clients} cases={context.cases} locale={locale} />;

    /* ---------------------------------------------------------------- layout */
    case "columns": {
      const count = num(p.count, 2);
      const children = slots(p.children);
      const align = st.align === "center" ? "lg:items-center" : "lg:items-start";
      return (
          <Container className={pad(st, "py-10 lg:py-14")}>
            <div
              className={`grid gap-8 lg:gap-12 ${align} ${count === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2"}`}
            >
              {Array.from({ length: count }, (_, slot) => (
                <div key={slot} className="min-w-0 [&>*>*]:px-0 [&_.mx-auto]:mx-0">
                  <BlockRenderer
                    blocks={children[slot] ?? []}
                    context={context}
                    selectable={selectable}
                    onSelect={onSelect}
                  />
                </div>
              ))}
            </div>
        </Container>
      );
    }

    case "code.embed":
      return (
        <Container className={pad(st, "py-10 lg:py-14")}>
          <div className={frameClass(st)}>
            <CodeEmbed
              blockId={block.id}
              html={str(p.html)}
              css={str(p.css)}
              js={str(p.js)}
              caption={t("caption") || undefined}
            />
          </div>
        </Container>
      );

    case "spacer": {
      const size = str(p.size, "md");
      return <div aria-hidden className={size === "sm" ? "h-8" : size === "lg" ? "h-32" : "h-16"} />;
    }

    case "divider":
      return (
        <Container className={pad(st, "py-6")}>
          <div className="flex items-center gap-4">
            <span className="h-px flex-1 bg-black/10 dark:bg-white/10" />
            {t("label") && (
              <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink/40 dark:text-white/40">
                {t("label")}
              </span>
            )}
            {t("label") && <span className="h-px flex-1 bg-black/10 dark:bg-white/10" />}
          </div>
        </Container>
      );

    /* ------------------------------------------------------------ conversion */
    case "cta.banner": {
      // The closing CTA is the one band that keeps a pale surface in dark mode —
      // that is the house treatment for it — so it paints its own background
      // instead of taking StyleScope's dark-adapting tint, and its text stays ink.
      const tone = st.tone === "none" ? "lavender" : st.tone;
      const dark = TONE_IS_DARK.has(tone);
      const surface =
        tone === "lavender" || tone === "pastel"
          ? "bg-pastel-purple/60 dark:bg-pastel-purple"
          : BLOCK_TONE[tone] ?? "bg-pastel-purple/60 dark:bg-pastel-purple";
      return (
        <section className={cx(surface, TONE_IS_PALE.has(tone) && "text-ink")}>
          <Container className={pad(st, "py-14 lg:py-16")}>
            <Reveal className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
              <h2
                className={`max-w-xl text-3xl font-medium leading-[1.15] tracking-[-0.015em] lg:text-h3 ${
                  dark ? "text-white" : "text-ink"
                }`}
              >
                {t("heading")}
              </h2>
              <div className="max-w-md">
                <p className={`text-[15px] leading-relaxed ${dark ? "text-white/80" : "text-ink/80"}`}>{t("body")}</p>
                {t("ctaLabel") && (
                  <PillButton
                    href={href(p.ctaHref)}
                    variant={dark ? "outlineLight" : "outlineInk"}
                    className="mt-6"
                  >
                    {t("ctaLabel")}
                  </PillButton>
                )}
              </div>
            </Reveal>
          </Container>
        </section>
      );
    }

    case "form.contact":
      return (
        <Container className={pad(st, "py-16 lg:py-24")}>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              {t("heading") && (
                <h2 className="text-3xl font-medium tracking-tight text-ink lg:text-h3 dark:text-white">
                  {t("heading")}
                </h2>
              )}
              {t("body") && (
                <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink/75 dark:text-white/75">{t("body")}</p>
              )}
              {t("privacyNote") && (
                <p className="mt-8 max-w-md text-[13px] leading-relaxed text-ink/50 dark:text-white/50">
                  {t("privacyNote")}
                </p>
              )}
            </div>
            <ContactForm dict={dict.contact} locale={locale} />
          </div>
        </Container>
      );

    case "form.brief":
      return (
        <Container className={pad(st, "py-16 lg:py-24")}>
          <div className="mx-auto max-w-2xl text-center">
            {t("heading") && (
              <h2 className="text-3xl font-medium tracking-tight text-ink lg:text-h3 dark:text-white">
                {t("heading")}
              </h2>
            )}
            {t("body") && (
              <p className="mx-auto mt-5 max-w-lg text-[15px] leading-relaxed text-ink/75 dark:text-white/75">
                {t("body")}
              </p>
            )}
            <PillButton href={linkTo(locale, "/brief")} variant="primary" className="mt-8">
              {dict.common.briefUs}
            </PillButton>
          </div>
        </Container>
      );

    case "lead.contacts": {
      const leads = context.team.filter((member) => member.role).slice(0, 3);
      if (leads.length === 0) return null;
      return (
        <Container className={pad(st, "py-16 lg:py-24")}>
          {(t("heading") || t("body")) && (
            <SectionHeader
              heading={t("heading")}
              body={t("body") || undefined}
              cta={t("ctaLabel") || undefined}
              ctaHref={str(p.ctaHref) ? href(p.ctaHref) : undefined}
            />
          )}
          <StaggerGrid className="mt-12 grid gap-card sm:grid-cols-2 lg:grid-cols-3">
            {leads.map((member) => (
              <LeadContactCard
                key={member.id}
                member={member}
                locale={locale}
                emailLabel={dict.common.email}
                linkedinLabel={dict.common.linkedin}
              />
            ))}
          </StaggerGrid>
        </Container>
      );
    }

    default:
      // An unknown type means the CMS is ahead of this deploy. Skip it quietly
      // in production; surface it in the editor preview so the gap is visible.
      return selectable ? (
        <Container className={pad(st, "py-6")}>
          <p className="rounded-card border border-dashed border-purple/40 px-5 py-4 text-[13px] text-ink/55 dark:text-white/55">
            The website does not know how to render a “{block.type}” block yet.
          </p>
        </Container>
      ) : null;
  }
}

/* --------------------------------------------------------------- primitives */

/** Width and alignment classes for a block's inner column. */
function frameClass(style: { width: string; align: string }): string {
  const width =
    style.width === "prose" ? "mx-auto max-w-2xl" : style.width === "wide" ? "mx-auto max-w-4xl" : "";
  const align = style.align === "center" ? "text-center" : "";
  return [width, align].filter(Boolean).join(" ");
}

/** The sticker hero's configured content, for use inside a hero block. */
function stickerContent(context: BlockContext, locale: "fi" | "en") {
  const hero = heroFor(context.heroes, "sticker");
  if (!hero) return undefined;
  const quotes = (hero.config?.quotes as Record<string, string[]> | undefined)?.[locale];
  return {
    headline: hero.headline[locale],
    words: heroWords(hero, locale, []),
    body: hero.body[locale],
    addLabel: hero.cta.label[locale],
    quotes,
    glyphs: heroList<string>(hero, "glyphs", []),
    colors: heroList<string>(hero, "colors", []),
    images: heroImages(hero, []).map((image) => image.src),
    maxStickers: heroNumber(hero, "maxStickers", 34, 4, 200),
  };
}

/** The city hero's configured skyline plates, or undefined to use the shipped set. */
function cityLayers(context: BlockContext) {
  const images = heroImages(heroFor(context.heroes, "city"), []);
  if (images.length === 0) return undefined;
  return images.map((image) => ({
    src: image.src,
    speed: Number(image.speed) || 0,
    z: Number(image.z) || 0,
    className: typeof image.className === "string" ? image.className : undefined,
  }));
}

/** CMS links are locale-relative; external and anchor links pass through. */
function localeHref(value: string, locale: "fi" | "en"): string {
  if (!value) return linkTo(locale);
  if (/^(https?:|mailto:|tel:|#)/.test(value)) return value;
  const path = value.startsWith("/") ? value : `/${value}`;
  const stripped = path.replace(/^\/(?:en|fi)(?=\/|$)/, "");
  return linkTo(locale, stripped || "/");
}

function buttonVariant(value: string): "primary" | "secondary" | "text" {
  return value === "secondary" ? "secondary" : value === "text" ? "text" : "primary";
}

/** Convert a watch URL into its privacy-friendly embed form. */
function embedUrl(url: string): string | null {
  if (!url) return null;
  const youtube = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{6,})/.exec(url);
  if (youtube) return `https://www.youtube-nocookie.com/embed/${youtube[1]}`;
  const vimeo = /vimeo\.com\/(?:video\/)?(\d+)/.exec(url);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return null;
}

/** Exported for the CMS preview route, which renders one block at a time. */
export { BlockSwitch };

export default BlockRenderer;

/** A link that respects the locale prefix — used by block CTAs. */
export function BlockLink({
  href,
  locale,
  children,
  className,
}: {
  href: string;
  locale: "fi" | "en";
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link href={localeHref(href, locale)} className={className}>
      {children}
    </Link>
  );
}
