// src/app/it-clarity/page.tsx

import Link from "next/link";

type Level = "GREEN" | "YELLOW" | "RED";

function normalizeLevel(input: unknown): Level | null {
  if (typeof input !== "string") return null;
  const v = input.trim().toUpperCase();
  if (v === "GREEN" || v === "YELLOW" || v === "RED") return v;
  return null;
}

const copyByLevel: Record<
  Level,
  {
    badge: string;
    title: string;
    subtitle: string;
    bullets: string[];
    ctaPrimaryLabel: string;
    ctaPrimaryHref: string;
    ctaSecondaryLabel: string;
    ctaSecondaryHref: string;
  }
> = {
  GREEN: {
    badge: "Уровень: GREEN",
    title: "У вас хороший IT-порядок. Осталось не потерять темп.",
    subtitle:
      "Судя по квизу, база уже выглядит здорово. Это отличный момент, чтобы зафиксировать процессы и убрать “точки риска”, пока всё спокойно.",
    bullets: [
      "Проверим, что доступы, домены и хостинг оформлены прозрачно и корректно.",
      "Сверим бэкапы: что именно сохраняется, как быстро восстанавливаемся и кто отвечает.",
      "Соберём короткий IT-паспорт проекта: где что лежит и что делать в аварийной ситуации.",
    ],
    ctaPrimaryLabel: "Хочу IT-паспорт (15 минут)",
    ctaPrimaryHref: "/contact?from=it-clarity&level=GREEN",
    ctaSecondaryLabel: "Пройти квиз ещё раз",
    ctaSecondaryHref: "/it-worries-quiz",
  },
  YELLOW: {
    badge: "Уровень: YELLOW",
    title: "Есть риски. Не критично — но лучше закрыть их сейчас.",
    subtitle:
      "Часть вещей держится на догадках или устных договорённостях. Это поправимо, если быстро навести структуру.",
    bullets: [
      "Определим 2–3 ключевые зоны риска и зафиксируем правила.",
      "Настроим базовую защиту: доступы, бэкапы, ответственность, бюджет.",
      "Соберём план на ближайшие 2–4 недели, чтобы выйти в GREEN.",
    ],
    ctaPrimaryLabel: "Хочу план до GREEN",
    ctaPrimaryHref: "/contact?from=it-clarity&level=YELLOW",
    ctaSecondaryLabel: "Посмотреть FAQ",
    ctaSecondaryHref: "/faq",
  },
  RED: {
    badge: "Уровень: RED",
    title: "Сейчас IT — источник уязвимости. Нужна быстрая стабилизация.",
    subtitle:
      "Ключевые вещи не под контролем — а значит любой сбой может обернуться потерей денег, времени или данных.",
    bullets: [
      "Срочно фиксируем владение: домены, аккаунты, доступы и права.",
      "Проверяем и настраиваем бэкапы с реальным восстановлением.",
      "Готовим антикризисный чек-лист на случай сбоя.",
    ],
    ctaPrimaryLabel: "Нужна быстрая стабилизация",
    ctaPrimaryHref: "/contact?from=it-clarity&level=RED",
    ctaSecondaryLabel: "Вернуться к квизу",
    ctaSecondaryHref: "/it-worries-quiz",
  },
};

export default function ItClarityPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const level = normalizeLevel(searchParams?.level);
  const from =
    typeof searchParams?.from === "string" ? searchParams?.from : undefined;

  const content = level ? copyByLevel[level] : null;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <div className="space-y-8">
        <section className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-black/5 px-3 py-1 text-xs">
            <span className="font-medium">IT Clarity</span>
            <span className="opacity-70">
              {from ? `from: ${from}` : "страница"}
            </span>
          </div>

          <h1 className="text-3xl font-semibold leading-tight">
            {content ? content.title : "IT Clarity — разбор результата"}
          </h1>

          {content ? (
            <p className="text-base opacity-80">{content.subtitle}</p>
          ) : (
            <p className="text-base opacity-80">
              Укажи параметр{" "}
              <code className="rounded bg-black/5 px-1 py-0.5">level</code>:
              {" "}
              <code className="rounded bg-black/5 px-1 py-0.5">GREEN</code>,{" "}
              <code className="rounded bg-black/5 px-1 py-0.5">YELLOW</code> или{" "}
              <code className="rounded bg-black/5 px-1 py-0.5">RED</code>.
            </p>
          )}
        </section>

        {content && (
          <section className="space-y-4">
            <div className="rounded-2xl border border-black/10 p-6">
              <div className="text-xs opacity-60">{content.badge}</div>

              <ul className="mt-4 space-y-2 text-sm">
                {content.bullets.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-black/40" />
                    <span className="opacity-90">{b}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-wrap items-center gap-2">
                <Link
                  href={content.ctaPrimaryHref}
                  className="rounded-xl bg-black px-4 py-2 text-sm text-white"
                >
                  {content.ctaPrimaryLabel}
                </Link>

                <Link
                  href={content.ctaSecondaryHref}
                  className="rounded-xl border border-black/10 px-4 py-2 text-sm opacity-80 hover:opacity-100"
                >
                  {content.ctaSecondaryLabel}
                </Link>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}