// src/app/ai-labs/page.tsx

"use client";

import { ChannelAnalyzerForm } from "./ChannelAnalyzerForm";
import { ChannelAnalyzerReport } from "./ChannelAnalyzerReport";
import { useChannelAnalyzer } from "./useChannelAnalyzer";

export default function AiLabsPage() {
  const a = useChannelAnalyzer();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-black">
        AI-Labs — анализ Telegram-канала
      </h1>
      <p className="mt-3">
        Получите профиль актуального контента любого публичного Telegram-канала и 
        базовую статистику по просмотрам/реакциям/комментариям
        (в пределах данных, доступных через публичный Telegram API).
      </p>
      <p className="mt-3">
        Введите в форме имя канала или ссылку на него.
      </p>

      <ChannelAnalyzerForm
        channelInput={a.channelInput}
        setChannelInput={a.setChannelInput}
        reportLanguage={a.reportLanguage}
        setReportLanguage={a.setReportLanguage}
        depth={a.depth}
        setDepth={a.setDepth}
        status={a.status}
        requestId={a.requestId}
        error={a.error}
        canSubmit={a.canSubmit}
        isSubmitting={a.isSubmitting}
        isBusy={a.isBusy}
        onSubmit={a.submit}
      />

      <ChannelAnalyzerReport status={a.status} result={a.result} meta={a.meta} />
    </main>
  );
}