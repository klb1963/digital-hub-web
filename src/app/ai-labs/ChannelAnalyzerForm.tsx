// src/app/ai-labs/ChannelAnalyzerForm.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReportLanguage, PollStatus } from "../api/ai-labs/types";

export function ChannelAnalyzerForm(props: {
  isAuthed: boolean;
  channelInput: string;
  setChannelInput: (v: string) => void;
  reportLanguage: ReportLanguage;
  setReportLanguage: (v: ReportLanguage) => void;
  depth: number;
  setDepth: (v: number) => void;

  status: PollStatus;
  requestId: string | null;
  error: string | null;

  canSubmit: boolean;
  isSubmitting: boolean;
  isBusy: boolean;

  onSubmit: () => void;
}) {
  const {
    isAuthed,
    channelInput,
    setChannelInput,
    reportLanguage,
    setReportLanguage,
    depth,
    setDepth,
    status,
    requestId,
    error,
    canSubmit,
    isSubmitting,
    isBusy,
    onSubmit,
  } = props;

  // ---- Progress UI (demo timeline; no Worker changes needed) ----
  const inProgress = useMemo(() => {
    // isSubmitting — момент нажатия/создания request
    // isBusy — период polling / ожидания
    // дополнительно: если статус уже не IDLE/READY/ERROR
    const s = String(status || "");
    const looksBusy = !["IDLE", "READY", "ERROR"].includes(s);
    return Boolean(isSubmitting || isBusy || looksBusy);
  }, [isSubmitting, isBusy, status]);

  const steps = useMemo(
    () => [
      "Ставлю задачу на анализ",
      "Подключаюсь к каналу",
      `Считываю последние ${Math.max(200, Math.min(500, depth))} сообщений`,
      "Обновляю базу (дедупликация/insert)",
      "Ранжирую посты по просмотрам",
      "Считаю статистику (avg/median/min/max)",
      "Запускаю AI-анализ текста (LLM) и формирую профиль",
      "Собираю инсайты и характерные посты",
      "Формирую итоговый отчет",
    ],
    [depth]
  );

  const [stepIndex, setStepIndex] = useState(0);

  // When progress starts anew (new requestId), remount the block => stepIndex resets naturally
  const progressKey = useMemo(() => {
    if (!inProgress) return "idle";
    return `run:${requestId ?? "noid"}:${String(status ?? "")}`;
  }, [inProgress, requestId, status]);

  useEffect(() => {
    if (!inProgress) return;

    // "Кинематографичный" прогресс: двигаемся по шагам раз в ~2.5 сек.
    // Если реальный READY наступит раньше — родитель просто перестанет быть inProgress.
    const interval = window.setInterval(() => {
      setStepIndex((i) => (i < steps.length - 1 ? i + 1 : i));
    }, 2500);

    return () => window.clearInterval(interval);
  }, [inProgress, steps.length]);

  const isDisabled = !canSubmit || isSubmitting || isBusy;
  const disabledTitle = !canSubmit ? "Введите канал и выберите глубину анализа" : undefined;

  return (
    <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="grid gap-4 min-w-0">
        <input
          value={channelInput}
          onChange={(e) => setChannelInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSubmit();
          }}
          placeholder="https://t.me/username или @username"
          className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-400"
        />

        <label className="grid gap-1.5">
          <span className="text-sm font-medium text-neutral-700">Язык отчёта</span>
          <select
            value={reportLanguage}
            onChange={(e) => setReportLanguage(e.target.value as ReportLanguage)}
            className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-400"
          >
            <option value="EN">English</option>
            <option value="RU">Русский</option>
            <option value="DE">Deutsch</option>
          </select>
        </label>

        <label className="grid gap-1.5">
          <span className="text-sm font-medium text-neutral-700">
            Глубина анализа <span className="text-neutral-500">(200–500)</span>
          </span>
          <input
            type="number"
            min={200}
            max={500}
            value={depth}
            onChange={(e) => setDepth(Number(e.target.value))}
            className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-400"
          />
        </label>

        {!isAuthed && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <div className="font-semibold">Внимание! Вы не вошли в систему.</div>
            <div className="mt-1">
              Анализ будет выполнен, но результат нельзя будет сохранить.
              <br />
              Войдите или зарегистрируйтесь, чтобы сохранить отчёт.
            </div>
          </div>
        )}

        <div title={disabledTitle} className="w-full">
          <button
            disabled={isDisabled}
            onClick={onSubmit}
            className="
              w-full rounded-xl px-4 py-2 text-sm font-medium transition
              bg-[#01BD84] text-white hover:bg-[#00a774]
              focus:outline-none focus:ring-2 focus:ring-[#01BD84] focus:ring-offset-2
              disabled:bg-[#01BD84]/30 disabled:text-[#0b5f46]
              disabled:cursor-not-allowed disabled:opacity-100
            "
          >
            {isSubmitting ? "Анализирую…" : "Получить профиль"}
          </button>
        </div>

        {/* disclaimer */}
        <div className="text-xs text-neutral-500">
          Анализ обычно занимает до 30 секунд (иногда чуть дольше). Не закрывайте вкладку — результат появится автоматически.
        </div>

        {/* progress */}
        {inProgress && (
          <div key={progressKey} className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-sm font-semibold text-neutral-900">Что сейчас происходит</div>
              {requestId ? (
                <div className="text-xs text-neutral-500">
                  requestId: <span className="font-mono text-neutral-700">{requestId}</span>
                </div>
              ) : null}
            </div>

            <div className="mt-3 grid gap-2">
              {steps.map((label, idx) => {
                const done = idx < stepIndex;
                const active = idx === stepIndex;

                return (
                  <div key={`${label}-${idx}`} className="flex items-start gap-3">
                    <div
                      className={[
                        "mt-0.5 h-5 w-5 shrink-0 rounded-full border flex items-center justify-center text-xs",
                        done ? "bg-[#01BD84] border-[#01BD84] text-white" : "",
                        active ? "border-neutral-900 bg-white text-neutral-900" : "",
                        !done && !active ? "border-neutral-300 bg-white text-neutral-400" : "",
                      ].join(" ")}
                    >
                      {done ? "✓" : active ? "…" : ""}
                    </div>

                    <div
                      className={[
                        "text-sm",
                        done ? "text-neutral-700" : "",
                        active ? "text-neutral-900 font-medium" : "",
                        !done && !active ? "text-neutral-500" : "",
                      ].join(" ")}
                    >
                      {label}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-3 text-xs text-neutral-500">
              Мы показываем этапы, чтобы было понятнее, где находится анализ. Это “прогресс-объяснение”, а не точный таймер.
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-900/60 bg-red-950/30 p-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {/* dev-only status line (optional) */}
        {!inProgress && (
          <div className="text-xs text-neutral-400">
            Статус: {status} {requestId && `(requestId=${requestId})`}
          </div>
        )}
      </div>
    </div>
  );
}