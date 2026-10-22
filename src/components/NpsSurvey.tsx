"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Icon } from "@/components/Icon";
import type { Locale } from "@/i18n/config";

/**
 * Client NPS survey (sql/nps_2026.sql in norr3-business-data-hub).
 *
 * Six questions, chosen from the Bain NPS method and agency-evaluation
 * criteria (Vuoden Toimisto, ANA, Clutch): the 0–10 score from the email, its
 * main reason, five 1–5 ratings, where the client wants more in 2027, contact
 * permission, and — for 9–10 only — permission to quote. Only the score and
 * the contact permission are required; everything else is optional so the
 * survey stays near two minutes.
 */
const NPS_API = "https://jhihwsanqszemfrvqwdl.supabase.co/functions/v1/nps";

type Ratings = Record<string, number | null>;
type Invite = {
  ok: boolean;
  first_name?: string | null;
  customer?: string;
  language?: Locale;
  open?: boolean;
  unsubscribed?: boolean;
  response?: {
    score: number | null;
    reason: string | null;
    ratings: Ratings;
    wants_more: string[];
    wants_more_other: string | null;
    may_contact: boolean | null;
    may_quote: "yes" | "anon" | "no" | null;
    completed_at: string | null;
  } | null;
};

const RATING_KEYS = ["business", "recommendations", "goals", "collaboration", "value"] as const;
const WANT_KEYS = ["media", "performance", "search_ai", "research", "measurement", "engine", "ideas", "other"] as const;

const COPY = {
  fi: {
    pill: "Asiakaskysely",
    hello: (name?: string | null) => (name ? `Hei ${name}, miten meillä menee?` : "Miten meillä menee?"),
    intro: (customer?: string) =>
      `Kiitos arvosanasta, se on nyt tallessa. Jos ehdit, viisi lisäkysymystä vie noin kaksi minuuttia. Vastauksesi yhdistetään yritykseen ${customer ?? ""}, ja luemme jokaisen vastauksen itse.`,
    q1: "Kuinka todennäköisesti suosittelisit NØRR3:a kollegalle tai yhteistyökumppanille?",
    low: "En lainkaan todennäköisesti",
    high: "Erittäin todennäköisesti",
    q2: "Mikä on tärkein syy antamaasi arvosanaan?",
    q3: "Miten onnistumme näissä?",
    q3hint: "1 = heikosti, 5 = erinomaisesti",
    ratings: {
      business: "Ymmärrämme liiketoimintanne ja tavoitteenne",
      recommendations: "Suosituksemme ovat perusteltuja ja perustuvat dataan",
      goals: "Saavutamme sovitut tavoitteet",
      collaboration: "Yhteistyö ja aikataulut toimivat",
      value: "Saatte rahoillenne vastinetta",
    } as Record<string, string>,
    dontKnow: "En osaa sanoa",
    q4: "Missä haluaisit meiltä enemmän vuonna 2027?",
    wants: {
      media: "Mediasuunnittelu ja -ostot",
      performance: "Performance-markkinointi",
      search_ai: "Haku ja tekoälynäkyvyys",
      research: "Tutkimukset ja asiakasymmärrys",
      measurement: "Mittaaminen ja data",
      engine: "NØRR3 Marketing Engine",
      ideas: "Proaktiiviset ideat ja kehitysehdotukset",
      other: "Jotain muuta",
    } as Record<string, string>,
    otherPlaceholder: "Mitä?",
    q5: "Saammeko olla sinuun yhteydessä vastauksesi johdosta?",
    yes: "Kyllä",
    no: "Ei",
    q6: "Saammeko käyttää kommenttiasi referenssinä?",
    quote: { yes: "Kyllä, nimelläni", anon: "Kyllä, nimettömänä", no: "Ei" } as Record<string, string>,
    required: "Pakollinen",
    submit: "Lähetä vastaukset",
    sending: "Lähetetään…",
    doneTitle: "Kiitos!",
    doneText: "Luemme jokaisen vastauksen itse ja palaamme asiaan, jos annoit siihen luvan.",
    edit: "Muokkaa vastauksia",
    invalid: "Linkki ei ole voimassa. Tarkista, että avasit sen sähköpostista kokonaan, tai vastaa suoraan osoitteeseen info@norr3.fi.",
    closed: "Kysely on sulkeutunut. Kiitos mielenkiinnosta! Palautetta voi aina lähettää osoitteeseen info@norr3.fi.",
    error: "Tallennus ei onnistunut. Yritä hetken päästä uudelleen tai vastaa osoitteeseen info@norr3.fi.",
    unsubscribe: "En halua jatkossa näitä kyselyitä",
    unsubscribed: "Selvä, emme lähetä sinulle enää näitä kyselyitä.",
    needContact: "Vastaa vielä, saammeko olla yhteydessä.",
  },
  en: {
    pill: "Client survey",
    hello: (name?: string | null) => (name ? `Hi ${name}, how are we doing?` : "How are we doing?"),
    intro: (customer?: string) =>
      `Thank you, your score is saved. If you have time, five more questions take about two minutes. Your answers are linked to ${customer ?? "your company"}, and we read every one ourselves.`,
    q1: "How likely are you to recommend NØRR3 to a colleague or business partner?",
    low: "Not at all likely",
    high: "Extremely likely",
    q2: "What is the main reason for your score?",
    q3: "How well do we do the following?",
    q3hint: "1 = poorly, 5 = excellently",
    ratings: {
      business: "We understand your business and goals",
      recommendations: "Our recommendations are well-founded and based on data",
      goals: "We deliver on the agreed goals",
      collaboration: "Collaboration and timelines work well",
      value: "You get value for money",
    } as Record<string, string>,
    dontKnow: "Don't know",
    q4: "Where would you like more from us in 2027?",
    wants: {
      media: "Media planning and buying",
      performance: "Performance marketing",
      search_ai: "Search and AI visibility",
      research: "Research and customer insight",
      measurement: "Measurement and data",
      engine: "NØRR3 Marketing Engine",
      ideas: "Proactive ideas and suggestions",
      other: "Something else",
    } as Record<string, string>,
    otherPlaceholder: "What?",
    q5: "May we contact you about your answers?",
    yes: "Yes",
    no: "No",
    q6: "May we quote your comment as a reference?",
    quote: { yes: "Yes, with my name", anon: "Yes, anonymously", no: "No" } as Record<string, string>,
    required: "Required",
    submit: "Send answers",
    sending: "Sending…",
    doneTitle: "Thank you!",
    doneText: "We read every answer ourselves and will follow up if you said we may.",
    edit: "Edit answers",
    invalid: "This link is not valid. Check that you opened the whole link from the email, or reply to info@norr3.fi.",
    closed: "The survey has closed. Thank you for your interest! You can always send feedback to info@norr3.fi.",
    error: "We could not save your answers. Please try again shortly or reply to info@norr3.fi.",
    unsubscribe: "I do not want these surveys in future",
    unsubscribed: "Understood. We will not send you these surveys again.",
    needContact: "Please answer whether we may contact you.",
  },
} as const;

const optionClass = (active: boolean) =>
  `rounded-xl border px-3 py-2.5 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple ${
    active
      ? "border-purple bg-purple text-white dark:border-light-purple dark:bg-light-purple dark:text-ink"
      : "border-black/10 bg-white text-ink hover:border-purple dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:border-light-purple"
  }`;
const questionClass = "text-lg font-medium text-ink dark:text-white";

async function post(body: Record<string, unknown>) {
  const res = await fetch(NPS_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return (await res.json().catch(() => ({ ok: false }))) as { ok: boolean; error?: string };
}

export function NpsSurvey({ locale }: { locale: Locale }) {
  const params = useSearchParams();
  // Kept in state: the query string is cleared below, and the token must outlive it.
  const [token] = useState(() => (params.get("t") ?? "").toLowerCase());
  const [scoreParam] = useState(() => params.get("s"));
  const t = COPY[locale];

  const [state, setState] = useState<"loading" | "invalid" | "closed" | "form" | "done" | "unsubscribed">("loading");
  const [invite, setInvite] = useState<Invite | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [reason, setReason] = useState("");
  const [ratings, setRatings] = useState<Ratings>({});
  const [wants, setWants] = useState<string[]>([]);
  const [wantsOther, setWantsOther] = useState("");
  const [mayContact, setMayContact] = useState<boolean | null>(null);
  const [mayQuote, setMayQuote] = useState<"yes" | "anon" | "no" | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const loaded = useRef(false);

  // Load the invite once, then save the score from the email straight away so
  // it counts even if the recipient closes the tab here.
  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    // The token is a personal link: take it out of the address bar so analytics,
    // shared screenshots and the browser history do not carry it.
    window.history.replaceState(null, "", window.location.pathname);
    (async () => {
      if (!/^[0-9a-f]{32}$/.test(token)) return setState("invalid");
      const res = await fetch(`${NPS_API}?t=${token}`).catch(() => null);
      const data = (await res?.json().catch(() => null)) as Invite | null;
      if (!data?.ok) return setState("invalid");
      setInvite(data);
      if (!data.open) return setState("closed");
      if (data.unsubscribed) return setState("unsubscribed");

      const r = data.response;
      const fromEmail = scoreParam !== null && /^(10|[0-9])$/.test(scoreParam) ? Number(scoreParam) : null;
      const initial = fromEmail ?? r?.score ?? null;
      setScore(initial);
      setReason(r?.reason ?? "");
      setRatings(r?.ratings ?? {});
      setWants(r?.wants_more ?? []);
      setWantsOther(r?.wants_more_other ?? "");
      setMayContact(r?.may_contact ?? null);
      setMayQuote(r?.may_quote ?? null);
      if (fromEmail !== null && fromEmail !== r?.score) await post({ t: token, score: fromEmail, language: locale });
      setState(r?.completed_at && fromEmail === null ? "done" : "form");
    })();
  }, [token, scoreParam, locale]);

  async function chooseScore(value: number) {
    setScore(value);
    if (value < 9) setMayQuote(null);
    await post({ t: token, score: value, language: locale });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (sending) return;
    if (mayContact === null) return setError(t.needContact);
    setSending(true);
    setError("");
    const data = await post({
      t: token,
      score,
      reason,
      ratings,
      wants_more: wants,
      wants_more_other: wants.includes("other") ? wantsOther : "",
      may_contact: mayContact,
      may_quote: score !== null && score >= 9 ? mayQuote : null,
      language: locale,
      complete: true,
    }).catch(() => ({ ok: false }));
    setSending(false);
    if (data.ok) {
      setState("done");
      // The thank-you is far shorter than the form: bring it into view.
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else setError(t.error);
  }

  async function unsubscribe() {
    const data = await post({ t: token, unsubscribe: true }).catch(() => ({ ok: false }));
    if (data.ok) setState("unsubscribed");
    else setError(t.error);
  }

  const header = (
    <>
      <span className="inline-flex items-center rounded-full border border-purple/40 px-3.5 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-purple dark:border-light-purple/50 dark:text-light-purple">
        {t.pill}
      </span>
      <h1 className="mt-6 text-4xl font-medium leading-[1.1] tracking-[-0.02em] text-ink dark:text-white lg:text-5xl">
        {t.hello(invite?.first_name)}
      </h1>
    </>
  );

  if (state === "loading") return <div className="min-h-[50vh]" aria-busy="true" />;

  if (state === "invalid" || state === "closed" || state === "unsubscribed") {
    const text = state === "invalid" ? t.invalid : state === "closed" ? t.closed : t.unsubscribed;
    return (
      <div role="status">
        {header}
        <p className="mt-6 text-lg leading-relaxed text-ink/75 dark:text-white/75">{text}</p>
      </div>
    );
  }

  if (state === "done") {
    return (
      <div role="status">
        {header}
        <div className="mt-10 flex items-start gap-4">
          <Icon name="check_circle" className="text-4xl text-purple dark:text-light-purple" />
          <div>
            <p className="text-2xl font-medium text-ink dark:text-white">{t.doneTitle}</p>
            <p className="mt-2 text-lg leading-relaxed text-ink/75 dark:text-white/75">{t.doneText}</p>
            <button
              type="button"
              onClick={() => setState("form")}
              className="mt-6 text-sm text-ink underline underline-offset-4 hover:text-purple dark:text-white dark:hover:text-light-purple"
            >
              {t.edit}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate>
      {header}
      <p className="mt-6 text-lg leading-relaxed text-ink/75 dark:text-white/75">{t.intro(invite?.customer)}</p>

      {/* 1. Score */}
      <fieldset className="mt-12">
        <legend className={questionClass}>{t.q1}</legend>
        <div className="mt-4 grid grid-cols-6 gap-2 sm:grid-cols-11">
          {Array.from({ length: 11 }, (_, i) => (
            <button
              key={i}
              type="button"
              aria-pressed={score === i}
              onClick={() => chooseScore(i)}
              className={`${optionClass(score === i)} font-medium tabular-nums`}
            >
              {i}
            </button>
          ))}
        </div>
        <div className="mt-2 flex justify-between text-xs text-ink/60 dark:text-white/60">
          <span>{t.low}</span>
          <span>{t.high}</span>
        </div>
      </fieldset>

      {/* 2. Reason */}
      <label className="mt-12 block">
        <span className={questionClass}>{t.q2}</span>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          maxLength={4000}
          rows={4}
          className="mt-3 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-ink outline-none transition-colors focus:border-purple focus-visible:ring-2 focus-visible:ring-purple/40 dark:border-white/15 dark:bg-white/5 dark:text-white"
        />
      </label>

      {/* 3. Ratings */}
      <fieldset className="mt-12">
        <legend className={questionClass}>{t.q3}</legend>
        <p className="mt-1 text-sm text-ink/60 dark:text-white/60">{t.q3hint}</p>
        <div className="mt-4 space-y-6">
          {RATING_KEYS.map((key) => (
            <div key={key} role="radiogroup" aria-label={t.ratings[key]}>
              <p className="text-sm text-ink dark:text-white">{t.ratings[key]}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((v) => (
                  <button
                    key={v}
                    type="button"
                    role="radio"
                    aria-checked={ratings[key] === v}
                    onClick={() => setRatings({ ...ratings, [key]: v })}
                    className={`${optionClass(ratings[key] === v)} w-11 tabular-nums`}
                  >
                    {v}
                  </button>
                ))}
                <button
                  type="button"
                  role="radio"
                  aria-checked={key in ratings && ratings[key] === null}
                  onClick={() => setRatings({ ...ratings, [key]: null })}
                  className={optionClass(key in ratings && ratings[key] === null)}
                >
                  {t.dontKnow}
                </button>
              </div>
            </div>
          ))}
        </div>
      </fieldset>

      {/* 4. More of in 2027 */}
      <fieldset className="mt-12">
        <legend className={questionClass}>{t.q4}</legend>
        <div className="mt-4 flex flex-wrap gap-2">
          {WANT_KEYS.map((key) => {
            const on = wants.includes(key);
            return (
              <button
                key={key}
                type="button"
                aria-pressed={on}
                onClick={() => setWants(on ? wants.filter((w) => w !== key) : [...wants, key])}
                className={optionClass(on)}
              >
                {t.wants[key]}
              </button>
            );
          })}
        </div>
        {wants.includes("other") && (
          <input
            value={wantsOther}
            onChange={(e) => setWantsOther(e.target.value)}
            maxLength={500}
            placeholder={t.otherPlaceholder}
            aria-label={t.wants.other}
            className="mt-3 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-ink outline-none focus:border-purple dark:border-white/15 dark:bg-white/5 dark:text-white"
          />
        )}
      </fieldset>

      {/* 5. Contact permission (required) */}
      <fieldset className="mt-12">
        <legend className={questionClass}>
          {t.q5} <span className="text-sm font-normal text-ink/60 dark:text-white/60">({t.required})</span>
        </legend>
        <div className="mt-4 flex gap-2" role="radiogroup" aria-label={t.q5}>
          {[true, false].map((v) => (
            <button
              key={String(v)}
              type="button"
              role="radio"
              aria-checked={mayContact === v}
              onClick={() => {
                setMayContact(v);
                setError("");
              }}
              className={`${optionClass(mayContact === v)} min-w-20`}
            >
              {v ? t.yes : t.no}
            </button>
          ))}
        </div>
      </fieldset>

      {/* 6. Quote permission, promoters only */}
      {score !== null && score >= 9 && (
        <fieldset className="mt-12">
          <legend className={questionClass}>{t.q6}</legend>
          <div className="mt-4 flex flex-wrap gap-2" role="radiogroup" aria-label={t.q6}>
            {(["yes", "anon", "no"] as const).map((v) => (
              <button
                key={v}
                type="button"
                role="radio"
                aria-checked={mayQuote === v}
                onClick={() => setMayQuote(v)}
                className={optionClass(mayQuote === v)}
              >
                {t.quote[v]}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {error && (
        <p role="alert" className="mt-8 text-sm text-red-700 dark:text-red-400">
          {error}
        </p>
      )}

      <div className="mt-12 flex flex-wrap items-center justify-between gap-6">
        <button
          type="submit"
          disabled={sending}
          className="inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 text-xs font-medium uppercase tracking-[0.08em] text-white transition-colors hover:bg-purple focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple disabled:opacity-60 dark:bg-purple dark:hover:bg-violet"
        >
          {sending ? t.sending : t.submit}
        </button>
        <button
          type="button"
          onClick={unsubscribe}
          className="text-xs text-ink/60 underline underline-offset-4 hover:text-purple dark:text-white/60 dark:hover:text-light-purple"
        >
          {t.unsubscribe}
        </button>
      </div>
    </form>
  );
}
