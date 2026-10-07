"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { HomeHero } from "@/components/HomeHero";
import type { CityLayer } from "@/components/heroes/CityHero";
import { HeroCardStack } from "@/components/heroes/HeroCardStack";
import { DotGrid } from "@/components/DotGrid";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { PillButton } from "@/components/PillButton";
import { TextCta } from "@/components/TextCta";
import { heroAlt, heroImages, heroList, heroLocalised, heroNumber, heroText, heroWords, pickHero } from "@/content/heroes";
import type { CmsHero } from "@/lib/cms";
import type { Locale } from "@/i18n/config";
import { linkTo } from "@/lib/links";

/**
 * Shows one hero per visit, chosen from the ones enabled in the CMS.
 *
 * Which variants take part, how likely each is, the rotating words, the imagery
 * and the copy are all configured there — see the Heroes collection. The draw is
 * weighted, and a variant set to weight 0 stays configured but never appears.
 * With nothing eligible it falls back to the rotating card stack rather than
 * rendering an empty page.
 *
 * When a dark hero is shown it sets `data-city-hero-active` on <html> so the nav
 * forces its dark styling regardless of the theme toggle.
 */

const DARK_VARIANTS = new Set(["city", "sticker"]);

/**
 * The two heavyweight hero variants are loaded on demand.
 *
 * Only ONE hero is shown per visit, but a static import put every variant in the
 * initial JS — including Matter.js (~120 KB) for the sticker hero and the whole
 * cityscape parallax — whether or not it was picked. The hero is chosen after
 * hydration anyway (pre-hydration renders a placeholder), so code-splitting the
 * variants costs nothing at render time and takes them off the critical path.
 */
const CityHero = dynamic(() => import("@/components/heroes/CityHero").then((m) => m.CityHero), { ssr: false });
const StickerHero = dynamic(() => import("@/components/heroes/StickerHero").then((m) => m.StickerHero), { ssr: false });

export function HeroRandomizer({
  locale,
  left,
  accent,
  alts,
  heroBody,
  contactLabel,
  contactHref,
  logoStrip,
  heroes,
}: {
  locale: Locale;
  left: string;
  accent: string;
  alts: [string, string, string];
  heroBody: string;
  contactLabel: string;
  contactHref: string;
  logoStrip: React.ReactNode;
  heroes: CmsHero[];
}) {
  // When the CMS has a single eligible hero there is nothing to randomise, so
  // render it immediately: that puts the hero — and its LCP image — into the
  // SSR HTML instead of leaving a placeholder until hydration.
  const eligible = heroes.filter((candidate) => candidate.enabled && candidate.weight > 0);
  const [hero, setHero] = useState<CmsHero | null | "pending">(() =>
    eligible.length === 1 ? eligible[0] : "pending"
  );

  useEffect(() => {
    const chosen = pickHero(heroes, Math.random());
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHero(chosen);
    const dark = chosen ? DARK_VARIANTS.has(chosen.variant) : false;
    document.documentElement.toggleAttribute("data-city-hero-active", dark);
  }, [heroes]);

  // Pre-hydration: hold the space rather than flash the wrong hero.
  if (hero === "pending") return <div className="h-[100svh] min-h-[620px]" />;

  const variant = hero?.variant ?? "home";
  // English always — see the note at <HomeHero> below.
  const words = heroWords(hero ?? undefined, "en", [accent]);
  const rotateEvery = heroNumber(hero ?? undefined, "rotateEvery", 2400, 400, 30000);

  if (variant === "city") {
    const layers = heroImages(hero ?? undefined, []).map((image) => ({
      src: image.src,
      speed: Number(image.speed) || 0,
      z: Number(image.z) || 0,
      className: typeof image.className === "string" ? image.className : undefined,
    })) as CityLayer[];

    return (
      <>
        <CityHero
          locale={locale}
          rotateEvery={rotateEvery}
          layers={layers.length > 0 ? layers : undefined}
          content={{
            eyebrow: hero?.eyebrow[locale],
            titlePrefix: hero?.headline[locale],
            words,
            body: hero?.body[locale],
            cta: hero?.cta.label[locale],
            ctaHref: hero?.cta.href,
          }}
        />
        <div className="relative z-10 bg-offwhite dark:bg-background">{logoStrip}</div>
      </>
    );
  }

  if (variant === "sticker") {
    const quotes = heroList<Record<string, string[]>>(hero ?? undefined, "quotes", [])[0] as
      | Record<string, string[]>
      | undefined;
    const configQuotes = (hero?.config?.quotes as Record<string, string[]> | undefined)?.[locale];

    return (
      <>
        <StickerHero
          locale={locale}
          content={{
            headline: hero?.headline[locale],
            words,
            body: hero?.body[locale],
            addLabel: hero?.cta.label[locale],
            inputPlaceholder: heroLocalised(hero ?? undefined, "inputPlaceholder", locale, ""),
            hud: {
              impressions: nestedHud(hero, "impressions", locale),
              conversions: nestedHud(hero, "conversions", locale),
              streak: nestedHud(hero, "streak", locale),
            },
            quotes: configQuotes ?? quotes?.[locale],
            glyphs: heroList<string>(hero ?? undefined, "glyphs", []),
            colors: heroList<string>(hero ?? undefined, "colors", []),
            images: heroImages(hero ?? undefined, []).map((image) => image.src),
            maxStickers: heroNumber(hero ?? undefined, "maxStickers", 34, 4, 200),
          }}
        />
        <div className="relative z-10 bg-offwhite dark:bg-background">{logoStrip}</div>
      </>
    );
  }

  if (variant === "cards") {
    const configCards = (hero?.config?.cards ?? []) as { title?: Record<string, string>; body?: Record<string, string> }[];
    const images = heroImages(hero ?? undefined, []);
    return (
      <>
        <section className="relative -mt-20 flex min-h-[calc(100svh-4.25rem)] flex-col overflow-hidden bg-offwhite pt-20 dark:bg-background">
          <div className="relative flex flex-1 flex-col justify-center overflow-hidden pt-4 sm:pt-6 lg:pt-0">
            <DotGrid />
            <Container className="relative z-10 py-8">
              <HeroCardStack
                locale={locale}
                cards={images.map((image, index) => ({
                  title: configCards[index]?.title?.[locale],
                  body: configCards[index]?.body?.[locale],
                  image: image.src,
                  orientation: typeof image.orientation === "string" ? image.orientation : undefined,
                }))}
              />
            </Container>
          </div>
          <div className="relative z-10">{logoStrip}</div>
        </section>
      </>
    );
  }

  // The rotating card stack, and the fallback when nothing is eligible.
  const cardConfig = (hero?.config?.cards ?? []) as { number?: string; icon?: string }[];
  const images = heroImages(hero ?? undefined, []);

  return (
    <section className="relative -mt-20 flex min-h-[calc(100svh-4.25rem)] flex-col overflow-hidden bg-offwhite pt-20 dark:bg-background">
      <div className="relative flex flex-1 flex-col justify-start overflow-hidden pt-4 sm:pt-6 lg:justify-center lg:pt-0">
        <DotGrid />
        <Container className="relative z-10 py-8">
          {/* The home hero stays in English on both locales — the brand line
              "A New Way to _Grow" is the campaign device, not copy to localize
              (Wael's call). So headline/words/body/CTA read the `en` fields of
              the CMS hero even when the page is Finnish; the CTA still routes
              through the locale-aware link. */}
          <HomeHero
            left={heroText(hero?.headline, "en", left)}
            accent={words[words.length - 1] ?? accent}
            alts={alts}
            rotateEvery={rotateEvery}
            cards={images.map((image, index) => ({
              word: words[index],
              src: image.src,
              alt: heroAlt(image, locale, alts[index] ?? ""),
              number: cardConfig[index]?.number,
              icon: (image as { icon?: string }).icon || cardConfig[index]?.icon,
            }))}
          />
          <Reveal delay={0.3} className="mt-7 flex flex-col items-start gap-5 lg:mt-8">
            <p className="max-w-md text-[15px] leading-relaxed text-ink/80 lg:text-base dark:text-white/80">
              {heroText(hero?.body, "en", heroBody)}
            </p>
            {/* Primary pill + non-button ways down the page, like every other
                hero: the pill is for buyers, the text links for browsers —
                one into the services grid, one to the Marketing Engine. */}
            <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
              <PillButton href={hero?.cta.href ? linkTo(locale, `${hero.cta.href.replace(/^\/?/, "/")}`) : contactHref}>
                {heroText(hero?.cta.label, "en", contactLabel)}
              </PillButton>
              <TextCta href="#palvelut">{locale === "fi" ? "Mitä me oikeasti teemme" : "What we actually do"}</TextCta>
              <span aria-hidden className="hidden h-1 w-1 rounded-full bg-ink/30 dark:bg-white/30 sm:inline-block" />
              <TextCta href="#engine">{locale === "fi" ? "Tutustu Marketing Engineen" : "Explore the Marketing Engine"}</TextCta>
            </div>
          </Reveal>
        </Container>
      </div>
      <div className="relative z-10">{logoStrip}</div>
    </section>
  );
}

/** A per-locale HUD label out of the sticker hero's config. */
function nestedHud(hero: CmsHero | null, key: string, locale: Locale): string | undefined {
  const hud = hero?.config?.hud as Record<string, Record<string, string>> | undefined;
  return hud?.[key]?.[locale];
}
