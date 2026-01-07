// src/app/it-worries-quiz/ItWorriesQuizClient.tsx

'use client';

import * as React from 'react';
import type {
  ItWorriesQuizGlobal,
  ItWorriesModeKey,
  ItWorriesSeverity,
  ItWorriesQuestion,
  ItWorriesLocalizedText,
} from '@/lib/cms-types';
import { RichTextRenderer } from '@/components/RichText';
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical';

type Props = {
  quiz: ItWorriesQuizGlobal;
};

type ResultKey = 'green' | 'yellow' | 'red';

const severityToScore: Record<ItWorriesSeverity, number> = {
  GREEN: 0,
  YELLOW: 1,
  RED: 2,
  RED_HOT: 3,
};

function t(mode: ItWorriesModeKey, text: ItWorriesLocalizedText): string {
  // В Payload ключи test/formal/jokes, а modeKey у нас TEST/FORMAL/JOKES
  if (mode === 'TEST') return text.test;
  if (mode === 'FORMAL') return text.formal;
  return text.jokes;
}

function shuffleOnce<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function computeResultKey(
  quiz: ItWorriesQuizGlobal,
  questions: ItWorriesQuestion[],
  selectedSeverityByIndex: (ItWorriesSeverity | null)[]
): ResultKey {
  const { scoring } = quiz;

  let score = 0;
  let hasRedHot = false;

  for (const sev of selectedSeverityByIndex) {
    if (!sev) continue;
    score += severityToScore[sev];
    if (sev === 'RED_HOT') hasRedHot = true;
  }

  // Force rules
  if (scoring.redHotForcesAtLeastYellow && hasRedHot) {
    // минимум yellow
    if (score <= scoring.greenMaxScore) score = scoring.greenMaxScore + 1;
  }

  if (scoring.ownershipRedHotForcesRed) {
    const ownershipIdx = questions.findIndex((q) => q.questionKey === 'ownership');
    if (ownershipIdx >= 0 && selectedSeverityByIndex[ownershipIdx] === 'RED_HOT') {
      return 'red';
    }
  }

  if (score <= scoring.greenMaxScore) return 'green';
  if (score <= scoring.yellowMaxScore) return 'yellow';
  return 'red';
}

/**
 * ⚠️ RichText renderer placeholder
 * Сейчас disclaimer/results.body = unknown (Lexical JSON).
 * Если у тебя уже есть компонент типа <RichText value={...} /> — подключи его тут.
 */
function RenderLexical({ value }: { value: unknown }) {
  const content = (value as SerializedEditorState | null) ?? null;
  if (!content) return null;
  return <RichTextRenderer content={content} />;
}

export default function ItWorriesQuizClient({ quiz }: Props) {
  const [mode, setMode] = React.useState<ItWorriesModeKey>('TEST');

  // Важно: чтобы порядок не менялся при каждом ререндере — фиксируем один раз
  const [orderedQuestions] = React.useState(() => shuffleOnce(quiz.questions ?? []));
  const total = orderedQuestions.length;

  const [step, setStep] = React.useState(0);

  // severity по индексу вопроса в orderedQuestions
  const [selected, setSelected] = React.useState<(ItWorriesSeverity | null)[]>(
    () => Array.from({ length: total }, () => null)
  );

  const [resultKey, setResultKey] = React.useState<ResultKey | null>(null);

  const current = orderedQuestions[step];

  const isDone = resultKey !== null;

  function pickAnswer(sev: ItWorriesSeverity) {
    setSelected((prev) => {
      const next = [...prev];
      next[step] = sev;
      return next;
    });
  }

  function nextStep() {
    if (step < total - 1) setStep((s) => s + 1);
    else {
      const rk = computeResultKey(quiz, orderedQuestions, selected);
      setResultKey(rk);
    }
  }

  function prevStep() {
    if (step > 0) setStep((s) => s - 1);
  }

  function resetAll() {
    setStep(0);
    setSelected(Array.from({ length: total }, () => null));
    setResultKey(null);
  }

  // Пересчитать результат, если пользователь изменит последний ответ и снова "переедет" на итог
  React.useEffect(() => {
    if (!isDone) return;
    const rk = computeResultKey(quiz, orderedQuestions, selected);
    setResultKey(rk);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

    if (!total) {
        return (
            <div className="space-y-6">
                <section className="space-y-4">
                    <h1 className="text-3xl font-semibold leading-tight">{quiz.heroTitle}</h1>
                    {quiz.heroSubtitle ? <p className="text-base opacity-80">{quiz.heroSubtitle}</p> : null}
                    {quiz.disclaimer ? <RenderLexical value={quiz.disclaimer} /> : null}
                </section>

                <div className="rounded-2xl border border-black/10 p-5">
                    <div className="text-sm opacity-80">
                        Локально квиз пока не заполнен в CMS (questions пустые).
                        <br />
                        Заполни Global <b>it-worries-quiz</b> в Payload или подтяни БД/глобал с VPS.
                    </div>
                </div>
            </div>
        );
    }

  return (
    <div className="space-y-10">
      {/* HERO */}
      <section className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-black/5 px-3 py-1 text-xs">
          <span className="font-medium">IT-беспокойство</span>
          <span className="opacity-70">квиз</span>
        </div>

        <h1 className="text-3xl font-semibold leading-tight">{quiz.heroTitle}</h1>

        {quiz.heroSubtitle ? (
          <p className="text-base opacity-80">{quiz.heroSubtitle}</p>
        ) : null}

        {quiz.disclaimer ? <RenderLexical value={quiz.disclaimer} /> : null}
      </section>

      {/* MODE SELECTOR */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Режим прохождения</h2>
        <p
        className="
            inline-flex items-center gap-2
            rounded-full
            border border-black/10
            bg-black/5
            px-4 py-2
            text-sm
            text-black/80

            dark:border-white/20
            dark:bg-white/10
            dark:text-white/80
        "
        >
        <span className="text-base">🧭</span>
        Выберите стиль вопросов, который вам ближе
        </p>
        <div className="grid gap-3 md:grid-cols-3">
          {quiz.modes.map((m) => {
            const active = m.modeKey === mode;
            return (
              <button
                key={m.modeKey}
                type="button"
                onClick={() => setMode(m.modeKey)}
                className={[
                'rounded-xl border px-4 py-3 text-left text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30 dark:focus-visible:ring-white/50',
                active
                    ? 'border-black/30 bg-black/5 ring-2 ring-black/25 dark:border-white/60 dark:bg-white/14 dark:ring-white/60'
                    : 'border-black/10 hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10',
                ].join(' ')}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="text-sm font-semibold">{m.label}</div>
                  {m.badge ? (
                    <div className="rounded-full bg-black/10 px-2 py-0.5 text-[11px] opacity-80">
                      {m.badge}
                    </div>
                  ) : null}
                </div>
                <div className="mt-2 text-sm opacity-80">{m.description}</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* QUIZ FLOW */}
      {!isDone ? (
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm opacity-80">
              Вопрос {step + 1} из {total}
            </div>

            <div className="h-2 w-40 overflow-hidden rounded-full bg-black/10">
              <div
                className="h-full bg-black/40"
                style={{ width: `${Math.round(((step + 1) / total) * 100)}%` }}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 p-5">
            {/* <div className="text-xs opacity-60">{current.questionKey}</div> */}

            <h3 className="mt-2 text-xl font-semibold">
              {t(mode, current.prompt)}
            </h3>

            <div className="mt-4 grid gap-2">
              {current.answers.map((a, idx) => {
                const label = t(mode, a.label);
                const active = selected[step] === a.severity;
                return (
                  <button
                    key={a.id ?? `${current.questionKey}-${idx}`}
                    type="button"
                    onClick={() => pickAnswer(a.severity)}
                    className={[
                    'rounded-xl border px-4 py-3 text-left text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30 dark:focus-visible:ring-white/50',
                    active
                        ? 'border-black/30 bg-black/5 ring-2 ring-black/25 dark:border-white/60 dark:bg-white/14 dark:ring-white/60'
                        : 'border-black/10 hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10',
                    ].join(' ')}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={prevStep}
                disabled={step === 0}
                className="rounded-xl border border-black/10 px-4 py-2 text-sm disabled:opacity-40"
              >
                Назад
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={resetAll}
                  className="rounded-xl border border-black/10 px-4 py-2 text-sm opacity-80 hover:opacity-100"
                >
                  Сначала
                </button>

                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!selected[step]}
                  className="rounded-xl bg-black px-4 py-2 text-sm text-white disabled:opacity-40"
                >
                  {step < total - 1 ? 'Дальше' : 'Показать результат'}
                </button>
              </div>
            </div>
          </div>
        </section>
      ) : (
        // RESULTS
        <section className="space-y-4">
          <div className="rounded-2xl border border-black/10 p-6">
            <div className="text-xs opacity-60">Ваш результат</div>

            <h2 className="mt-2 text-2xl font-semibold">
              {quiz.results[resultKey].title}
            </h2>

            <div className="mt-4">
              <RenderLexical value={quiz.results[resultKey].body} />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <a
                href={quiz.results[resultKey].ctaHref}
                className="rounded-xl bg-black px-4 py-2 text-sm text-white"
              >
                {quiz.results[resultKey].ctaLabel}
              </a>

              <button
                type="button"
                onClick={resetAll}
                className="rounded-xl border border-black/10 px-4 py-2 text-sm opacity-80 hover:opacity-100"
              >
                Пройти ещё раз
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}