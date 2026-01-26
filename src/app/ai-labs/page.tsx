// src/app/ai-labs/page.tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

import { ChannelAnalyzerForm } from "./ChannelAnalyzerForm";
import { ChannelAnalyzerReport } from "./ChannelAnalyzerReport";
import { useChannelAnalyzer } from "./useChannelAnalyzer";
import { normalizeChannelInput } from "./useChannelAnalyzer";

function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-black">{title}</h2>
          <p className="mt-2 text-sm text-black/70">{subtitle}</p>
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function ButtonLike({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium",
        "border border-black/15 bg-black text-white hover:bg-black/90",
        "disabled:cursor-not-allowed disabled:opacity-60",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export default function AiLabsPage() {
  const a = useChannelAnalyzer();
  const { isSignedIn } = useUser();

  // UI state: show analyzer section when user picks Card #1
  const [showAnalyzer, setShowAnalyzer] = useState(false);

  const fullResultHref = useMemo(() => {
    if (a.status !== "READY") return null;
    const slug = normalizeChannelInput(a.channelInput);
    if (!slug) return null;
    // v=open_v1 by default (как обсуждали)
    return `/ai-labs/channel/${encodeURIComponent(slug)}?v=open_v1`;
  }, [a.status, a.channelInput]);

  const compareHref = useMemo(() => {
    // можно поменять на "/ai-labs/history" если сначала делаем "Мои анализы"
    return "/ai-labs/compare";
  }, []);

  const signInHref = useMemo(() => {
    // типичный путь Clerk; если у тебя другой — заменим
    const redirect = encodeURIComponent("/ai-labs");
    return `/sign-in?redirect_url=${redirect}`;
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-black">AI-Labs</h1>
      <p className="mt-3 text-black/80">
        Выберите, что хотите сделать. Анализ публичных Telegram-каналов работает в
        пределах данных, доступных через публичный Telegram API.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Card #1 */}
        <Card
          title="Понять, стоит ли подписываться на TG-канал"
          subtitle="Получите профиль актуального контента любого публичного Telegram-канала и базовую статистику по просмотрам/реакциям/комментариям (в пределах данных, доступных через публичный Telegram API)."
        >
          <div className="flex flex-wrap items-center gap-3">
            <ButtonLike onClick={() => setShowAnalyzer(true)}>
              Проанализировать канал
            </ButtonLike>
            <span className="text-sm text-black/60">
              Результат можно посмотреть без регистрации. Сохранение — после входа.
            </span>
          </div>
        </Card>

        {/* Card #2 */}
        <Card
          title="Сравнить TG-каналы (профили и статистику)"
            subtitle={
              <div className="space-y-2">
                <p>
                  Получите профили нескольких публичных Telegram-каналов,
                  сохраните их и выполняйте анализ:
                </p>
                <ul className="list-disc pl-5">
                  <li>один канал vs другой</li>
                  <li>канал сейчас vs 3 месяца назад</li>
                  <li>канал vs “средний по нише”</li>
                </ul>
              </div>
            }
          >
          <div className="flex flex-wrap items-center gap-3">
            {isSignedIn ? (
              <Link
                href={compareHref}
                className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium border border-black/15 bg-white text-black hover:bg-black/5"
              >
                Перейти к сравнению
              </Link>
            ) : (
              <>
                <span className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-black/5 px-3 py-2 text-sm text-black/70">
                  🔒 Требует входа
                </span>
                <Link
                  href={signInHref}
                  className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium border border-black/15 bg-white text-black hover:bg-black/5"
                >
                  Войти, чтобы сравнивать
                </Link>
              </>
            )}
          </div>
        </Card>
      </div>

      {/* Existing analyzer flow (kept intact) */}
      {showAnalyzer && (
        <section className="mt-10 rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-black">
                Анализ Telegram-канала
              </h2>
              <p className="mt-2 text-sm text-black/70">
                Введите имя канала или ссылку на него.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAnalyzer(false)}
              className="rounded-lg px-2 py-1 text-sm text-black/60 hover:bg-black/5"
              aria-label="Свернуть"
              title="Свернуть"
            >
              ✕
            </button>
          </div>

          <div className="mt-6">
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
          </div>

          <div className="mt-6">
            <ChannelAnalyzerReport
              status={a.status}
              result={a.result}
              meta={a.meta}
            />
          </div>

          {isSignedIn && a.status === "READY" && fullResultHref && (
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href={fullResultHref}
                className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium border border-black/15 bg-white text-black hover:bg-black/5"
              >
                Открыть полный результат
              </Link>
              <span className="text-sm text-black/60">
                (Если страница пока 404 — это ок, потом подключим роут. Кнопка уже готова.)
              </span>
            </div>
          )}

          {!isSignedIn && a.status === "READY" && (
            <div className="mt-6 rounded-xl border border-black/10 bg-black/5 p-4">
              <div className="text-sm text-black/80">
                Хотите сохранить этот результат и сравнивать позже?{" "}
                <Link href={signInHref} className="underline">
                  Войдите
                </Link>
                .
              </div>
            </div>
          )}
        </section>
      )}
    </main>
  );
}