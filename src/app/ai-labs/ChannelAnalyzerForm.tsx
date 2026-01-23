// src/app/ai-labs/ChannelAnalyzerForm.tsx

"use client";

import type { ReportLanguage, PollStatus } from "./useChannelAnalyzer";

export function ChannelAnalyzerForm(props: {
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

        <div title={disabledTitle} className="w-full">
          <button
            disabled={isDisabled}
            onClick={onSubmit}
            className="
              w-full rounded-xl px-4 py-2 text-sm font-medium transition
              bg-emerald-600 text-white hover:bg-emerald-700
              focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
              disabled:bg-emerald-100 disabled:text-emerald-800
              disabled:cursor-not-allowed disabled:opacity-100
            "
          >
            {isSubmitting ? "Анализирую…" : "Получить профиль"}
          </button>
        </div>

        <div className="text-sm text-neutral-400">
          Статус: {status} {requestId && `(requestId=${requestId})`}
        </div>

        {error && (
          <div className="rounded-xl border border-red-900/60 bg-red-950/30 p-3 text-sm text-red-200">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}