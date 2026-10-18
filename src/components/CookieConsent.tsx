"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@/components/Icon";
import { useEffect, useState } from "react";
import { useLocalStorageItem } from "@/lib/useLocalStorageItem";
import {
  ALL_CONSENT,
  CONSENT_OPEN_EVENT,
  CONSENT_STORAGE_KEY,
  NO_CONSENT,
  parseConsent,
  serializeConsent,
  type ConsentCategories,
} from "@/lib/consent";
import type { Dictionary } from "@/content/dictionary";
import type { Locale } from "@/i18n/config";
import { legalPath, linkTo } from "@/lib/links";

type CategoryKey = keyof ConsentCategories;

/**
 * Prior, granular consent (Finnish Act on Electronic Communications Services +
 * GDPR). Three equally available choices: accept all, reject all, or open the
 * categories and pick. Nothing but strictly necessary storage runs before a
 * choice is recorded; the footer's "cookie settings" control re-opens this box
 * so consent can be changed or withdrawn at any time (art. 7(3)).
 */
export function CookieConsent({ dict, locale }: { dict: Dictionary["cookies"]; locale: Locale }) {
  // "pending" keeps the SSR and hydration renders empty — the choice lives in
  // localStorage, which only exists after mount. errorValue "pending" stays
  // silent when storage throws (private mode, blocked cookies).
  const [raw, choose] = useLocalStorageItem(CONSENT_STORAGE_KEY, {
    serverValue: "pending",
    errorValue: "pending",
  });
  const ready = raw !== "pending";
  const stored = ready ? parseConsent(raw) : null;

  // `open` re-shows the box after a choice exists (footer button); `editing`
  // expands the category toggles.
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<ConsentCategories>(NO_CONSENT);

  // The page editor's live preview renders the site inside an iframe. A consent
  // dialog over an editor is noise, and dismissing it there would silently opt
  // the editor's own browser in, so the box sits out the preview route.
  const inEditorPreview = usePathname().includes("/cms-preview");
  // The mobile menu hides the banner via <html data-menu-open> — it was
  // covering menu content on small screens.
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const check = () => setMenuOpen(document.documentElement.hasAttribute("data-menu-open"));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-menu-open"] });
    return () => observer.disconnect();
  }, []);

  // Footer "cookie settings": re-open with the current choice loaded.
  useEffect(() => {
    const reopen = () => {
      let current: ConsentCategories | null = null;
      try {
        current = parseConsent(window.localStorage.getItem(CONSENT_STORAGE_KEY));
      } catch {
        // Storage blocked — start from nothing granted.
      }
      setDraft(current ?? NO_CONSENT);
      setEditing(true);
      setOpen(true);
    };
    window.addEventListener(CONSENT_OPEN_EVENT, reopen);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, reopen);
  }, []);

  const visible = ready && (stored === null || open) && !inEditorPreview && !menuOpen;

  const decide = (categories: ConsentCategories) => {
    choose(serializeConsent(categories));
    setOpen(false);
    setEditing(false);
  };

  const categoryRows: { key: CategoryKey; title: string; body: string }[] = [
    { key: "measurement", title: dict.categories.measurement.title, body: dict.categories.measurement.body },
    { key: "marketing", title: dict.categories.marketing.title, body: dict.categories.marketing.body },
    { key: "experience", title: dict.categories.experience.title, body: dict.categories.experience.body },
  ];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-modal="false"
          aria-label={dict.title}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-3 bottom-[60px] z-[70] mx-auto max-h-[calc(100dvh-4.5rem)] w-auto max-w-[430px] overflow-y-auto rounded-[22px] border border-white/40 bg-white/70 p-5 backdrop-blur-xl sm:inset-x-auto sm:bottom-10 sm:left-6 sm:w-[400px] sm:p-6 dark:border-white/15 dark:bg-white/10 dark:text-white"
        >
          <p className="flex items-center gap-2 font-medium">
            <Icon name="cookie" className="text-[20px] text-ink dark:text-white" />
            {dict.title}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink/70 dark:text-white/70">
            {dict.body}{" "}
            <Link
              href={`${legalPath(locale, "privacy")}#${locale === "fi" ? "evasteet" : "cookies"}`}
              className="rounded-sm text-ink underline underline-offset-2 hover:text-purple focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple dark:text-white dark:hover:text-light-purple dark:focus-visible:outline-light-purple"
            >
              {dict.privacyLink}
            </Link>
          </p>

          {editing && (
            <div className="mt-4 space-y-4 border-t border-ink/10 pt-4 dark:border-white/15">
              <div className="flex items-start justify-between gap-4">
                <span>
                  <span className="block text-sm font-medium">{dict.categories.necessary.title}</span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-ink/60 dark:text-white/60">
                    {dict.categories.necessary.body}
                  </span>
                </span>
                <span
                  aria-hidden
                  className="mt-0.5 flex h-6 w-11 shrink-0 items-center justify-center rounded-full bg-ink/10 text-ink/50 dark:bg-white/15 dark:text-white/60"
                >
                  <Icon name="lock" className="text-[14px]" />
                </span>
              </div>
              {categoryRows.map(({ key, title, body }) => (
                <label key={key} className="flex cursor-pointer items-start justify-between gap-4">
                  <span>
                    <span className="block text-sm font-medium">{title}</span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-ink/60 dark:text-white/60">{body}</span>
                  </span>
                  <span className="relative mt-0.5 inline-flex h-6 w-11 shrink-0 items-center">
                    <input
                      type="checkbox"
                      checked={draft[key]}
                      onChange={(event) => setDraft({ ...draft, [key]: event.target.checked })}
                      className="peer sr-only"
                    />
                    <span
                      aria-hidden
                      className="h-6 w-11 rounded-full bg-ink/15 transition-colors peer-checked:bg-purple peer-focus-visible:ring-2 peer-focus-visible:ring-purple peer-focus-visible:ring-offset-2 dark:bg-white/20 dark:peer-checked:bg-purple dark:peer-focus-visible:ring-offset-transparent"
                    />
                    <span
                      aria-hidden
                      className="pointer-events-none absolute left-0.5 h-5 w-5 rounded-full bg-white transition-transform peer-checked:translate-x-5"
                    />
                  </span>
                </label>
              ))}
            </div>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => decide(ALL_CONSENT)}
              className="min-w-[140px] flex-1 basis-0 rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-purple focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple dark:bg-purple dark:hover:bg-violet dark:focus-visible:outline-light-purple"
            >
              {dict.acceptAll}
            </button>
            <button
              type="button"
              onClick={() => decide(NO_CONSENT)}
              className="min-w-[140px] flex-1 basis-0 rounded-full border border-ink/25 bg-white/70 px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-ink/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple dark:border-white/30 dark:bg-white/5 dark:text-white dark:hover:border-white/60 dark:focus-visible:outline-light-purple"
            >
              {dict.declineAll}
            </button>
            {editing ? (
              <button
                type="button"
                onClick={() => decide(draft)}
                className="w-full rounded-full bg-purple px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple dark:focus-visible:outline-light-purple"
              >
                {dict.save}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setDraft(stored ?? NO_CONSENT);
                  setEditing(true);
                }}
                className="w-full rounded-full px-4 py-2 text-sm font-medium text-ink/70 underline underline-offset-2 transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple dark:text-white/70 dark:hover:text-white dark:focus-visible:outline-light-purple"
              >
                {dict.customize}
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
