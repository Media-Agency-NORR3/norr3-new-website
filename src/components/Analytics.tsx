"use client";

import { useEffect, useRef } from "react";
import { useLocalStorageItem } from "@/lib/useLocalStorageItem";
import { CONSENT_STORAGE_KEY, parseConsent, type ConsentCategories } from "@/lib/consent";
import { track } from "@/lib/track";

/** Translate the banner's categories into Google Consent Mode v2 signals. */
function consentSignals(categories: { measurement?: boolean; marketing?: boolean }) {
  return {
    analytics_storage: categories.measurement ? "granted" : "denied",
    ad_storage: categories.marketing ? "granted" : "denied",
    ad_user_data: categories.marketing ? "granted" : "denied",
    ad_personalization: categories.marketing ? "granted" : "denied",
  } as const;
}

/** The stored choice, or `null` when the visitor has not decided yet. */
function readStoredConsent(): ConsentCategories | null {
  try {
    return parseConsent(window.localStorage.getItem(CONSENT_STORAGE_KEY));
  } catch {
    return null; // private mode / blocked cookies — treat as no choice.
  }
}

/**
 * Analytics and marketing tags, gated on the granular cookie choice
 * (`norr3-cookie-consent` — see lib/consent).
 *
 * - `gtm` set (CMS → Settings → Google Tag Manager ID): loads the GTM container,
 *   which carries GA4, Google Ads, LinkedIn, Meta and the rest. `ga4` is then
 *   ignored so GA4 is never counted twice.
 * - only `ga4` set: loads GA4 directly with gtag.js.
 *
 * Google Consent Mode v2 in *advanced* mode: every signal is declared "denied"
 * first (`wait_for_update` gives the container a moment to see a stored choice)
 * and the container is loaded on every visit, whether the visitor granted
 * anything or not. Google's own tags may then send cookieless pings — no
 * identifiers, no cookies — so GA4 and Google Ads can model the visits of
 * visitors who have not decided yet or who declined; `ads_data_redaction` and
 * `url_passthrough` keep the ad-click identifiers out of them. Nothing is stored
 * on the device before a choice is recorded, which keeps the privacy policy's
 * promise. Non-Google tags (Meta, LinkedIn, Adform) stay closed in the container
 * until `ad_storage` is granted.
 *
 * A stored choice is pushed into `dataLayer` BEFORE the container is requested,
 * so the container's "All Pages" tags see the real state on their first run. If
 * the visitor decides on this page instead, the choice is pushed as a
 * `consent update` plus a `norr3_consent_update` event — that event is what
 * re-opens the container's non-Google tags on the same page load. Withdrawing
 * consent updates the signals back to denied; previously loaded tags stop
 * measuring.
 *
 * Also emits `email_click` / `phone_click` for every mailto:/tel: link.
 */
export function Analytics({ ga4, gtm }: { ga4: string; gtm?: string }) {
  const [raw] = useLocalStorageItem(CONSENT_STORAGE_KEY, { serverValue: null, errorValue: null });
  const categories = parseConsent(raw);
  const containerId = (gtm ?? "").trim();
  const measurementId = containerId ? "" : ga4.trim();
  /** Signals already pushed, as a stable string — `categories` is a fresh object every render. */
  const applied = useRef<string | null>(null);

  // Consent defaults, a returning visitor's stored choice, and the tag load —
  // always, independent of what that choice is. Consent Mode handles the gating.
  useEffect(() => {
    if (!containerId && !measurementId) return;

    window.dataLayer = window.dataLayer || [];
    if (!window.gtag) {
      // gtag must push the real `arguments` object — gtag.js ignores plain arrays.
      window.gtag = function gtag() {
        // eslint-disable-next-line prefer-rest-params
        window.dataLayer!.push(arguments);
      };
      window.gtag("consent", "default", {
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
        analytics_storage: "denied",
        wait_for_update: 500,
      });
      window.gtag("set", "ads_data_redaction", true);
      window.gtag("set", "url_passthrough", true);
    }

    // Returning visitor: the choice must be in the dataLayer before gtm.js, or
    // the container's All Pages tags run before they know the state.
    const stored = readStoredConsent();
    if (stored) {
      const signals = consentSignals(stored);
      window.gtag("consent", "update", signals);
      applied.current = JSON.stringify(signals);
    }

    const w = window as Window & { __norr3TagsLoaded?: boolean };
    if (w.__norr3TagsLoaded) return;
    w.__norr3TagsLoaded = true;

    const script = document.createElement("script");
    script.async = true;
    if (containerId) {
      window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
      script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(containerId)}`;
    } else {
      window.__norr3Ga4Direct = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
      window.gtag("js", new Date());
      window.gtag("config", measurementId);
    }
    document.head.appendChild(script);
  }, [containerId, measurementId]);

  // The visitor decides in the banner on this page load. The effect above has
  // already pushed a stored choice, so only a *different* set of signals is new.
  useEffect(() => {
    if (!categories || (!containerId && !measurementId)) return;
    const signals = consentSignals(categories);
    const key = JSON.stringify(signals);
    if (applied.current === key) return; // Nothing changed — nothing to re-open.
    applied.current = key;

    window.gtag?.("consent", "update", signals);
    // Non-Google tags stay closed on the gtm.js pass; this event re-opens them.
    window.dataLayer!.push({ event: "norr3_consent_update" });
  }, [categories, containerId, measurementId]);

  // mailto: / tel: clicks anywhere on the site.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.("a[href^='mailto:'], a[href^='tel:']");
      if (!link) return;
      const href = link.getAttribute("href") ?? "";
      track(href.startsWith("tel:") ? "phone_click" : "email_click", { link_url: href.replace(/^(mailto|tel):/, "") });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
