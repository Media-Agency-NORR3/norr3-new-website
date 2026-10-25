"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Icon } from "@/components/Icon";
import type { Locale } from "@/i18n/config";

/**
 * Client NPS survey (norr3-business-data-hub: sql/nps_2026.sql, sql/nps_config_signers.sql).
 *
 * The texts and questions are edited in the NPS artifact and published to the
 * `nps.config` table; the edge function returns them with the invite, so a
 * change there reaches this page without a deploy. DEFAULT_TEXTS and
 * DEFAULT_QUESTIONS below are the fallback for an invalid link (no invite, no
 * config) and for any key the published config lacks.
 *
 * The six default questions follow the Bain NPS method and agency-evaluation
 * criteria (Vuoden Toimisto, ANA, Clutch): the 0–10 score from the email, its
 * main reason, 1–5 ratings, which services the client wants to hear more
 * about, contact permission, and — for 9–10 only — permission to quote. The
 * fixed ids (score, reason, ratings, wants_more, may_contact, may_quote) map to
 * their own columns; a question added in the artifact is saved under `extra`.
 */
const NPS_API = "https://jhihwsanqszemfrvqwdl.supabase.co/functions/v1/nps";

type L = { fi?: string; en?: string };
type Texts = Record<string, Record<string, L>>;
type Choice = { key: string; fi: string; en: string };
type QType = "nps" | "text" | "rating" | "multi" | "single" | "yesno";
type Question = {
  id: string;
  type: QType;
  fi: string;
  en: string;
  required?: boolean;
  show_if?: "all" | "promoters" | "detractors";
  items?: Choice[];
  options?: Choice[];
  allow_other?: boolean;
};
type Answers = Record<string, unknown>;
type Invite = {
  ok: boolean;
  first_name?: string | null;
  customer?: string;
  language?: Locale;
  open?: boolean;
  unsubscribed?: boolean;
  config?: { texts?: Texts; questions?: Question[] } | null;
  response?: {
    score: number | null;
    reason: string | null;
    ratings: Record<string, number | null>;
    wants_more: string[];
    wants_more_other: string | null;
    may_contact: boolean | null;
    may_quote: "yes" | "anon" | "no" | null;
    extra?: Answers;
    completed_at: string | null;
  } | null;
};

const FIXED = ["score", "reason", "ratings", "wants_more", "may_contact", "may_quote"];

const DEFAULT_TEXTS: Texts = {
  survey: {
    pill: { fi: "Asiakaskysely", en: "Client survey" },
    hello: { fi: "Hei {etunimi}, miten yhteistyömme sujuu?", en: "Hi {etunimi}, how our cooperation is going?" },
    intro: {
      fi: "Kiitos antamastasi arvosanasta, se on nyt tallessa. Jos ehdit, seuraavaksi pyytäisimme palautettasi viiteen lisäkysymykseen alla - se vie noin kaksi minuuttia. Vastauksesi yhdistetään yritykseen {asiakas}.",
      en: "Thank you, your score is saved. If you have time, next we would like you to tell more about our cooperation through five more questions - this takes about two minutes. Your answers are linked to {asiakas}, and we read every one ourselves.",
    },
    meta_title: { fi: "Miten yhteistyömme sujuu? | NØRR3", en: "How our cooperation is going? | NØRR3" },
    rating_hint: { fi: "1 = heikosti, 5 = erinomaisesti", en: "1 = poorly, 5 = excellently" },
    dont_know: { fi: "En osaa sanoa", en: "Don't know" },
    other_option: { fi: "Jotain muuta", en: "Something else" },
    other_placeholder: { fi: "Mitä?", en: "What?" },
    yes: { fi: "Kyllä", en: "Yes" },
    no: { fi: "Ei", en: "No" },
    required: { fi: "Pakollinen", en: "Required" },
    submit: { fi: "Lähetä vastaukset", en: "Send answers" },
    sending: { fi: "Lähetetään…", en: "Sending…" },
    unsubscribe: { fi: "En halua jatkossa näitä kyselyitä", en: "I do not want these surveys in future" },
  },
  thanks: {
    title: { fi: "Kiitos!", en: "Thank you!" },
    text: { fi: "Palautteesi on meille supertärkeää. Palaamme asiaan, jos annoit siihen luvan.", en: "Your feedback is super important for us. We will follow up if you said we may." },
    edit: { fi: "Muokkaa vastauksia", en: "Edit answers" },
  },
  messages: {
    invalid: {
      fi: "Linkki ei ole voimassa. Tarkista, että avasit tai kopioit sen sähköpostista kokonaan, tai vastaa suoraan osoitteeseen info@norr3.fi.",
      en: "This link is not valid. Check that you opened or copied the whole link from the email, or reply to info@norr3.fi.",
    },
    closed: {
      fi: "Kysely on sulkeutunut. Kiitos mielenkiinnosta! Palautetta voi aina lähettää osoitteeseen info@norr3.fi.",
      en: "The survey has closed. Thank you for your interest! You can always send feedback to info@norr3.fi.",
    },
    error: {
      fi: "Tallennus ei onnistunut. Yritä hetken päästä uudelleen tai vastaa osoitteeseen info@norr3.fi.",
      en: "We could not save your answers. Please try again shortly or reply to info@norr3.fi.",
    },
    unsubscribed: { fi: "Selvä, emme lähetä sinulle enää näitä kyselyitä.", en: "Understood. We will not send you these surveys again." },
    need_contact: { fi: "Vastaa vielä, saammeko olla yhteydessä.", en: "Please answer whether we may contact you." },
    need_required: { fi: "Vastaa vielä pakollisiin kysymyksiin.", en: "Please answer the required questions." },
  },
  email: {
    low: { fi: "En lainkaan todennäköisesti", en: "Not at all likely" },
    high: { fi: "Erittäin todennäköisesti", en: "Extremely likely" },
  },
};

const c = (key: string, fi: string, en: string): Choice => ({ key, fi, en });
const DEFAULT_QUESTIONS: Question[] = [
  { id: "score", type: "nps", required: true, fi: "Kuinka todennäköisesti suosittelisit NØRR3:a kollegalle tai yhteistyökumppanille?", en: "How likely are you to recommend NØRR3 to a colleague or business partner?" },
  { id: "reason", type: "text", fi: "Mikä on tärkein syy antamaasi arvosanaan?", en: "What is the main reason for your score?" },
  {
    id: "ratings", type: "rating", fi: "Miten onnistumme näissä?", en: "How well do we do the following?",
    items: [
      c("business", "Ymmärrämme liiketoimintanne ja tavoitteenne", "We understand your business and goals"),
      c("recommendations", "Suosituksemme ovat perusteltuja ja perustuvat dataan", "Our recommendations are well-founded and based on data"),
      c("goals", "Saavutamme sovitut tavoitteet", "We deliver on the agreed goals"),
      c("collaboration", "Yhteistyö ja aikataulut toimivat", "Collaboration and timelines work well"),
      c("value", "Saatte rahoillenne vastinetta", "You get value for money"),
    ],
  },
  {
    id: "wants_more", type: "multi", allow_other: true,
    fi: "Mistä seuraavista palveluistamme haluaisit kuulla enemmän?", en: "From which of our following services you´d like to know more?",
    options: [
      c("media", "Mediasuunnittelu ja -ostot", "Media planning and buying"),
      c("performance", "Performance-markkinointi", "Performance marketing"),
      c("search_ai", "Haku ja tekoälynäkyvyys", "Search and AI visibility"),
      c("research", "Tutkimukset ja asiakasymmärrys", "Research and customer insight"),
      c("measurement", "Mittaaminen ja data", "Measurement and data"),
      c("engine", "NØRR3 Marketing Engine", "NØRR3 Marketing Engine"),
      c("data_bank", "NØRR3 Data Bank", "NØRR3 Data Bank"),
      c("audits", "Auditit", "Audits"),
      c("dynamic_creative", "Dynaamiset ja luovat ratkaisut", "Dynamic and creative services"),
    ],
  },
  { id: "may_contact", type: "yesno", required: true, fi: "Saammeko olla sinuun yhteydessä vastauksesi johdosta?", en: "May we contact you about your answers?" },
  {
    id: "may_quote", type: "single", show_if: "promoters", fi: "Saammeko käyttää kommenttiasi referenssinä?", en: "May we quote your comment as a reference?",
    options: [c("yes", "Kyllä, nimelläni", "Yes, with my name"), c("anon", "Kyllä, nimettömänä", "Yes, anonymously"), c("no", "Ei", "No")],
  },
];

const optionClass = (active: boolean) =>
  `rounded-xl border px-3 py-2.5 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple ${
    active
      ? "border-purple bg-purple text-white dark:border-light-purple dark:bg-light-purple dark:text-ink"
      : "border-black/10 bg-white text-ink hover:border-purple dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:border-light-purple"
  }`;
const questionClass = "text-lg font-medium text-ink dark:text-white";
const fieldClass =
  "w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-ink outline-none transition-colors focus:border-purple focus-visible:ring-2 focus-visible:ring-purple/40 dark:border-white/15 dark:bg-white/5 dark:text-white";

async function post(body: Record<string, unknown>) {
  const res = await fetch(NPS_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return (await res.json().catch(() => ({ ok: false }))) as { ok: boolean; error?: string };
}

/** {etunimi} and {asiakas}; without a first name "Hei {etunimi}, miten…" becomes "Miten…". */
function fill(text: string, name?: string | null, customer?: string) {
  let s = text.replace(/\{asiakas\}/g, customer ?? "");
  if (name) return s.replace(/\{etunimi\}/g, name);
  s = s.replace(/^[^{]*\{etunimi\}[,!]?\s*/, "").replace(/\s*\{etunimi\}/g, "");
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const visible = (q: Question, score: number | null) =>
  q.show_if === "promoters" ? score !== null && score >= 9 : q.show_if === "detractors" ? score !== null && score <= 6 : true;

const answered = (q: Question, v: unknown) =>
  q.type === "multi" ? Array.isArray(v) && v.length > 0
    : q.type === "rating" ? !!v && typeof v === "object" && Object.keys(v as object).length > 0
      : q.type === "text" ? typeof v === "string" && v.trim() !== ""
        : v !== null && v !== undefined;

export function NpsSurvey({ locale }: { locale: Locale }) {
  const params = useSearchParams();
  // Kept in state: the query string is cleared below, and the token must outlive it.
  const [token] = useState(() => (params.get("t") ?? "").toLowerCase());
  const [scoreParam] = useState(() => params.get("s"));

  const [state, setState] = useState<"loading" | "invalid" | "closed" | "form" | "done" | "unsubscribed">("loading");
  const [invite, setInvite] = useState<Invite | null>(null);
  const [answers, setAnswers] = useState<Answers>({});
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const loaded = useRef(false);

  const texts = invite?.config?.texts ?? {};
  const t = (sec: string, key: string) => texts[sec]?.[key]?.[locale] || DEFAULT_TEXTS[sec]?.[key]?.[locale] || "";
  const questions = invite?.config?.questions?.length ? invite.config.questions : DEFAULT_QUESTIONS;
  const score = typeof answers.score === "number" ? answers.score : null;
  const set = (id: string, v: unknown) => setAnswers((a) => ({ ...a, [id]: v }));

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
      const title = data.config?.texts?.survey?.meta_title?.[locale];
      if (title) document.title = title;
      if (!data.open) return setState("closed");
      if (data.unsubscribed) return setState("unsubscribed");

      const r = data.response;
      const fromEmail = scoreParam !== null && /^(10|[0-9])$/.test(scoreParam) ? Number(scoreParam) : null;
      setAnswers({
        ...(r?.extra ?? {}),
        score: fromEmail ?? r?.score ?? null,
        reason: r?.reason ?? "",
        ratings: r?.ratings ?? {},
        wants_more: r?.wants_more ?? [],
        wants_more_other: r?.wants_more_other ?? "",
        may_contact: r?.may_contact ?? null,
        may_quote: r?.may_quote ?? null,
      });
      if (fromEmail !== null && fromEmail !== r?.score) await post({ t: token, score: fromEmail, language: locale });
      setState(r?.completed_at && fromEmail === null ? "done" : "form");
    })();
  }, [token, scoreParam, locale]);

  async function chooseScore(value: number) {
    set("score", value);
    await post({ t: token, score: value, language: locale });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (sending) return;
    const missing = questions.filter((q) => q.required && visible(q, score) && !answered(q, answers[q.id]));
    if (missing.length) return setError(missing.some((q) => q.id === "may_contact") ? t("messages", "need_contact") : t("messages", "need_required"));
    setSending(true);
    setError("");
    const shown = (id: string) => questions.some((q) => q.id === id && visible(q, score));
    const wants = (answers.wants_more as string[]) ?? [];
    const extra: Answers = {};
    for (const q of questions) {
      if (FIXED.includes(q.id) || !visible(q, score) || answers[q.id] === undefined) continue;
      extra[q.id] = answers[q.id];
      if (answers[`${q.id}_other`] !== undefined) extra[`${q.id}_other`] = answers[`${q.id}_other`];
    }
    const data = await post({
      t: token,
      score,
      ...(shown("reason") ? { reason: answers.reason ?? "" } : {}),
      ...(shown("ratings") ? { ratings: answers.ratings ?? {} } : {}),
      ...(shown("wants_more") ? { wants_more: wants, wants_more_other: wants.includes("other") ? answers.wants_more_other ?? "" : "" } : {}),
      ...(shown("may_contact") ? { may_contact: answers.may_contact } : {}),
      ...(shown("may_quote") ? { may_quote: answers.may_quote } : {}),
      extra,
      language: locale,
      complete: true,
    }).catch(() => ({ ok: false }));
    setSending(false);
    if (data.ok) {
      setState("done");
      // The thank-you is far shorter than the form: bring it into view.
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else setError(t("messages", "error"));
  }

  async function unsubscribe() {
    const data = await post({ t: token, unsubscribe: true }).catch(() => ({ ok: false }));
    if (data.ok) setState("unsubscribed");
    else setError(t("messages", "error"));
  }

  const label = (x: { fi: string; en: string }) => x[locale] || x.fi;

  function renderQuestion(q: Question) {
    const v = answers[q.id];
    const legend = (
      <legend className={questionClass}>
        {label(q)}
        {q.required && q.type !== "nps" && (
          <> <span className="text-sm font-normal text-ink/60 dark:text-white/60">({t("survey", "required")})</span></>
        )}
      </legend>
    );

    if (q.type === "nps") {
      const current = typeof v === "number" ? v : null;
      return (
        <fieldset key={q.id} className="mt-12">
          {legend}
          <div className="mt-4 grid grid-cols-6 gap-2 sm:grid-cols-11">
            {Array.from({ length: 11 }, (_, i) => (
              <button
                key={i}
                type="button"
                aria-pressed={current === i}
                onClick={() => (q.id === "score" ? chooseScore(i) : set(q.id, i))}
                className={`${optionClass(current === i)} font-medium tabular-nums`}
              >
                {i}
              </button>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-xs text-ink/60 dark:text-white/60">
            <span>{t("email", "low")}</span>
            <span>{t("email", "high")}</span>
          </div>
        </fieldset>
      );
    }

    if (q.type === "text") {
      return (
        <label key={q.id} className="mt-12 block">
          <span className={questionClass}>{label(q)}</span>
          <textarea
            value={(v as string) ?? ""}
            onChange={(e) => set(q.id, e.target.value)}
            maxLength={4000}
            rows={4}
            className={`mt-3 ${fieldClass}`}
          />
        </label>
      );
    }

    if (q.type === "rating") {
      const ratings = (v as Record<string, number | null>) ?? {};
      return (
        <fieldset key={q.id} className="mt-12">
          {legend}
          <p className="mt-1 text-sm text-ink/60 dark:text-white/60">{t("survey", "rating_hint")}</p>
          <div className="mt-4 space-y-6">
            {(q.items ?? []).map((item) => (
              <div key={item.key} role="radiogroup" aria-label={label(item)}>
                <p className="text-sm text-ink dark:text-white">{label(item)}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      role="radio"
                      aria-checked={ratings[item.key] === n}
                      onClick={() => set(q.id, { ...ratings, [item.key]: n })}
                      className={`${optionClass(ratings[item.key] === n)} w-11 tabular-nums`}
                    >
                      {n}
                    </button>
                  ))}
                  <button
                    type="button"
                    role="radio"
                    aria-checked={item.key in ratings && ratings[item.key] === null}
                    onClick={() => set(q.id, { ...ratings, [item.key]: null })}
                    className={optionClass(item.key in ratings && ratings[item.key] === null)}
                  >
                    {t("survey", "dont_know")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </fieldset>
      );
    }

    if (q.type === "yesno") {
      return (
        <fieldset key={q.id} className="mt-12">
          {legend}
          <div className="mt-4 flex gap-2" role="radiogroup" aria-label={label(q)}>
            {[true, false].map((b) => (
              <button
                key={String(b)}
                type="button"
                role="radio"
                aria-checked={v === b}
                onClick={() => {
                  set(q.id, b);
                  setError("");
                }}
                className={`${optionClass(v === b)} min-w-20`}
              >
                {b ? t("survey", "yes") : t("survey", "no")}
              </button>
            ))}
          </div>
        </fieldset>
      );
    }

    // multi and single: option chips, optionally with "something else" and a text field.
    const multi = q.type === "multi";
    const chosen: string[] = multi ? ((v as string[]) ?? []) : v ? [String(v)] : [];
    const otherKey = q.id === "wants_more" ? "wants_more_other" : `${q.id}_other`;
    const options = [...(q.options ?? []), ...(q.allow_other ? [{ key: "other", fi: t("survey", "other_option"), en: t("survey", "other_option") }] : [])];
    return (
      <fieldset key={q.id} className="mt-12">
        {legend}
        <div className="mt-4 flex flex-wrap gap-2" role={multi ? undefined : "radiogroup"} aria-label={multi ? undefined : label(q)}>
          {options.map((o) => {
            const on = chosen.includes(o.key);
            return (
              <button
                key={o.key}
                type="button"
                role={multi ? undefined : "radio"}
                aria-pressed={multi ? on : undefined}
                aria-checked={multi ? undefined : on}
                onClick={() => set(q.id, multi ? (on ? chosen.filter((k) => k !== o.key) : [...chosen, o.key]) : o.key)}
                className={optionClass(on)}
              >
                {label(o)}
              </button>
            );
          })}
        </div>
        {chosen.includes("other") && (
          <input
            value={(answers[otherKey] as string) ?? ""}
            onChange={(e) => set(otherKey, e.target.value)}
            maxLength={500}
            placeholder={t("survey", "other_placeholder")}
            aria-label={t("survey", "other_option")}
            className={`mt-3 ${fieldClass}`}
          />
        )}
      </fieldset>
    );
  }

  const header = (
    <>
      <span className="inline-flex items-center rounded-full border border-purple/40 px-3.5 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-purple dark:border-light-purple/50 dark:text-light-purple">
        {t("survey", "pill")}
      </span>
      <h1 className="mt-6 text-4xl font-medium leading-[1.1] tracking-[-0.02em] text-ink dark:text-white lg:text-5xl">
        {fill(t("survey", "hello"), invite?.first_name, invite?.customer)}
      </h1>
    </>
  );

  if (state === "loading") return <div className="min-h-[50vh]" aria-busy="true" />;

  if (state === "invalid" || state === "closed" || state === "unsubscribed") {
    const text = t("messages", state);
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
            <p className="text-2xl font-medium text-ink dark:text-white">{t("thanks", "title")}</p>
            <p className="mt-2 text-lg leading-relaxed text-ink/75 dark:text-white/75">{fill(t("thanks", "text"), invite?.first_name, invite?.customer)}</p>
            <button
              type="button"
              onClick={() => setState("form")}
              className="mt-6 text-sm text-ink underline underline-offset-4 hover:text-purple dark:text-white dark:hover:text-light-purple"
            >
              {t("thanks", "edit")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate>
      {header}
      <p className="mt-6 text-lg leading-relaxed text-ink/75 dark:text-white/75">{fill(t("survey", "intro"), invite?.first_name, invite?.customer)}</p>

      {questions.filter((q) => visible(q, score)).map(renderQuestion)}

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
          {sending ? t("survey", "sending") : t("survey", "submit")}
        </button>
        <button
          type="button"
          onClick={unsubscribe}
          className="text-xs text-ink/60 underline underline-offset-4 hover:text-purple dark:text-white/60 dark:hover:text-light-purple"
        >
          {t("survey", "unsubscribe")}
        </button>
      </div>
    </form>
  );
}
