"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Icon } from "@/components/Icon";
import type { Dictionary } from "@/content/dictionary";

/**
 * Email preferences per message type (sql/mail_registry.sql in
 * norr3-business-data-hub). The token in the link identifies the recipient;
 * it is taken out of the address bar once read, like on the NPS page.
 */
const PREFS_API = "https://jhihwsanqszemfrvqwdl.supabase.co/functions/v1/email-prefs";
const KINDS = ["newsletter", "events", "surveys"] as const;
type Kind = (typeof KINDS)[number];
type Prefs = Record<Kind, boolean>;

export function EmailPreferences({ dict, privacyHref }: { dict: Dictionary["emailPrefs"]; privacyHref: string }) {
  const params = useSearchParams();
  const [token] = useState(() => (params.get("t") ?? "").toLowerCase());
  const [state, setState] = useState<"loading" | "invalid" | "form">("loading");
  const [email, setEmail] = useState("");
  const [prefs, setPrefs] = useState<Prefs>({ newsletter: true, events: true, surveys: true });
  const [allOff, setAllOff] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    window.history.replaceState(null, "", window.location.pathname);
    (async () => {
      if (!/^[0-9a-f]{32}$/.test(token)) return setState("invalid");
      const res = await fetch(`${PREFS_API}?t=${token}`).catch(() => null);
      const data = (await res?.json().catch(() => null)) as
        | ({ ok: boolean; email: string; unsubscribed_all: boolean } & Prefs)
        | null;
      if (!data?.ok) return setState("invalid");
      setEmail(data.email);
      setPrefs({ newsletter: data.newsletter, events: data.events, surveys: data.surveys });
      setAllOff(data.unsubscribed_all);
      setState("form");
    })();
  }, [token]);

  async function save(body: Record<string, boolean>, done: string) {
    if (saving) return;
    setSaving(true);
    setError("");
    setNotice("");
    const res = await fetch(PREFS_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ t: token, ...body }),
    }).catch(() => null);
    const data = (await res?.json().catch(() => null)) as { ok: boolean } | null;
    setSaving(false);
    if (!data?.ok) return setError(dict.error);
    setNotice(done);
  }

  const header = (
    <>
      <span className="inline-flex items-center rounded-full border border-purple/40 px-3.5 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-purple dark:border-light-purple/50 dark:text-light-purple">
        {dict.pill}
      </span>
      <h1 className="mt-6 text-4xl font-medium leading-[1.1] tracking-[-0.02em] text-ink dark:text-white lg:text-5xl">
        {dict.title}
      </h1>
    </>
  );

  if (state === "loading") return <div className="min-h-[50vh]" aria-busy="true" />;

  if (state === "invalid") {
    return (
      <div role="status">
        {header}
        <p className="mt-6 text-lg leading-relaxed text-ink/75 dark:text-white/75">{dict.invalid}</p>
      </div>
    );
  }

  return (
    <div>
      {header}
      <p className="mt-6 text-lg leading-relaxed text-ink/75 dark:text-white/75">{dict.intro.replace("{email}", email)}</p>

      <div className="mt-10 space-y-3">
        {KINDS.map((kind) => {
          const on = prefs[kind] && !allOff;
          return (
            <label
              key={kind}
              className="flex cursor-pointer items-start gap-4 rounded-2xl border border-black/10 bg-white p-5 transition-colors hover:border-purple dark:border-white/15 dark:bg-white/5 dark:hover:border-light-purple"
            >
              <input
                type="checkbox"
                checked={on}
                onChange={(e) => {
                  setAllOff(false);
                  setNotice("");
                  setPrefs({ ...prefs, [kind]: e.target.checked });
                }}
                className="mt-1 h-5 w-5 shrink-0 accent-[#7A06D3]"
              />
              <span>
                <span className="block text-lg font-medium text-ink dark:text-white">{dict[kind].title}</span>
                <span className="mt-1 block text-sm leading-relaxed text-ink/70 dark:text-white/70">{dict[kind].body}</span>
              </span>
            </label>
          );
        })}
      </div>

      {(notice || error) && (
        <p
          role={error ? "alert" : "status"}
          className={`mt-6 flex items-center gap-2 text-sm ${error ? "text-red-700 dark:text-red-400" : "text-ink dark:text-white"}`}
        >
          {!error && <Icon name="check_circle" className="text-xl text-purple dark:text-light-purple" />}
          {error || notice}
        </p>
      )}

      <div className="mt-10 flex flex-wrap items-center justify-between gap-6">
        <button
          type="button"
          disabled={saving}
          onClick={() => save({ ...prefs }, dict.saved)}
          className="inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 text-xs font-medium uppercase tracking-[0.08em] text-white transition-colors hover:bg-purple focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple disabled:opacity-60 dark:bg-purple dark:hover:bg-violet"
        >
          {saving ? dict.saving : dict.save}
        </button>
        <button
          type="button"
          disabled={saving}
          onClick={async () => {
            await save({ unsubscribe_all: true }, dict.unsubscribedAll);
            setAllOff(true);
            setPrefs({ newsletter: false, events: false, surveys: false });
          }}
          className="text-sm text-ink/70 underline underline-offset-4 hover:text-purple dark:text-white/70 dark:hover:text-light-purple"
        >
          {dict.unsubscribeAll}
        </button>
      </div>

      <p className="mt-12 text-sm text-ink/60 dark:text-white/60">
        <Link href={privacyHref} className="underline underline-offset-4 hover:text-purple dark:hover:text-light-purple">
          {dict.privacy}
        </Link>
      </p>
    </div>
  );
}
