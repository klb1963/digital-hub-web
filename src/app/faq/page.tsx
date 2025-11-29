// src/app/faq/page.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { AskQuestionDialog } from "@/components/contact/AskQuestionDialog";

type FaqItem = {
  question: string;
  answer: string;
  details?: string;
};

type FaqGroup = {
  id: string;
  title: string;
  items: FaqItem[];
};

const faqGroups: FaqGroup[] = [
  {
    id: "about-work",
    title: "О работе и форматах сотрудничества",
    items: [
      {
        question: "Чем вы реально занимаетесь как архитектор и CTO-практик?",
        answer:
          "Я помогаю пройти путь от идеи до работающего цифрового продукта.",
        details:
          "Включаюсь на уровне архитектуры, планирования MVP, выбора технологий, проектирования инфраструктуры и организации разработки. В зависимости от ситуации могу быть архитектором, техническим лидом или внешним CTO, который помогает команде двигаться быстрее и безопаснее."
      },
      {
        question: "Можно ли обратиться только за консультацией?",
        answer: "Да, можно начать с разовой консультации или мини-сессии.",
        details:
          "Частый сценарий: 60–90 минут созвона, где мы разбираем идею, текущий проект или архитектурные решения. По итогам вы получаете более чёткое понимание следующего шага, технических рисков и возможных вариантов реализации."
      },
      {
        question: "Чем вы отличаетесь от обычных фрилансеров и агентств?",
        answer:
          "Моя задача — не «продать разработку», а найти оптимальный путь к результату.",
        details:
          "Я работаю как архитектор и продуктовый инженер. Помогаю не переплатить за лишние фичи, не утонуть в сложности и не попасть в архитектурный тупик. В фокусе — здравый смысл, прозрачность и долгосрочная устойчивость решения."
      }
    ]
  },
  {
    id: "process",
    title: "Процесс: от идеи до MVP",
    items: [
      {
        question: "Как обычно выглядит путь от идеи до MVP?",
        answer: "Обычно это три шага: разбор идеи → архитектура → реализация.",
        details:
          "1) Разбор идей, целей и ограничений. 2) Набросок архитектуры и MVP: какие модули нужны, что можно отложить, какой стек использовать. 3) Реализация короткими итерациями с регулярными демо и обратной связью."
      },
      {
        question: "Сколько времени занимает создание MVP?",
        answer:
          "Зависит от объёма, но чаще всего это от 2–4 недель до 2–3 месяцев.",
        details:
          "Простой MVP с базовым функционалом может быть собран за несколько недель. Если нужны интеграции, роли, аналитика и сложный бекенд, срок естественно растёт. Моя цель — найти минимальную версию, которая уже даёт ценность и может выйти к реальным пользователям."
      },
      {
        question: "Можете ли вы подключиться к уже начатому проекту?",
        answer: "Да, я часто подключаюсь к проектам, которые уже идут.",
        details:
          "Иногда проект «застрял», иногда нужно ревью архитектуры, иногда — выстроить процессы и помочь команде с техническим вектором. В таких случаях мы начинаем с диагностики: что уже есть, что болит, какие ограничения по срокам и бюджету."
      }
    ]
  },
  {
    id: "tech",
    title: "Технологии и архитектура",
    items: [
      {
        question: "С каким стеком вы обычно работаете?",
        answer:
          "Основной стек — современный TypeScript- и JS-мир плюс облачная инфраструктура.",
        details:
          "Frontend: Next.js, React, Tailwind, Framer Motion. Backend: Node.js, NestJS, Prisma, PostgreSQL. CMS: Payload. Инфраструктура: Docker, CI/CD, VPS. Отдельный блок — работа с AI: интеграция GPT, автоматизация контента, сценарии вокруг LLM."
      },
      {
        question:
          "Почему вы часто рекомендуете Next.js + Payload CMS для продуктов?",
        answer:
          "Это сочетание даёт гибкость разработчикам и удобство авторам контента.",
        details:
          "Next.js даёт быстрый рендер, SEO и современную архитектуру, а Payload — мощный headless CMS с блоками, ролями и API. Вместе это позволяет строить лендинги, блог, дашборды и внутренние инструменты в одной экосистеме."
      },
      {
        question: "А если нужен мобильный продукт?",
        answer:
          "Главное — выделить устойчивое API. Дальше есть несколько вариантов.",
        details:
          "Часто имеет смысл начать с адаптивного веб-приложения или PWA, а мобильное приложение на React Native или другом стеке подключить позже, когда станет понятно поведение пользователей и требования к UX."
      }
    ]
  },
  {
    id: "terms",
    title: "Организация работы, оплата и коммуникации",
    items: [
      {
        question: "Как обычно организована работа?",
        answer:
          "Простой и прозрачный формат: диагностика → план → итерации → демо.",
        details:
          "Мы фиксируем цели и ограничения, согласуем формат (консультации, мини-проект, сопровождение как CTO), определяем каналы связи и частоту созвонов. Я стараюсь делать регулярные демонстрации, чтобы вы всегда видели прогресс."
      },
      {
        question: "Можно ли начать с небольшой задачи?",
        answer: "Да, это часто лучший вариант для старта.",
        details:
          "Небольшая консультация, ревью архитектуры, разбор идеи или короткий прототип — хороший способ понять, насколько вам подходит мой подход, стиль коммуникации и глубина погружения."
      },
      {
        question: "Как устроена оплата?",
        answer: "Формат подбирается под задачу и уровень неопределённости.",
        details:
          "Это может быть фиксированная цена за мини-проект, спринтовая модель (оплата за итерации) или формат CTO-as-a-Service c ежемесячным ретейнером. Конкретный вариант обсуждаем после того, как станет ясно, что именно нужно сделать."
      },
      {
        question: "В каких каналах мы будем общаться?",
        answer: "Выбираем те каналы, которые удобны вам.",
        details:
          "Обычно это email, LinkedIn, Telegram и видеосозвоны на моём сервере meet.leonidk.de. Инфраструктура подстраивается под ваш стиль работы — от одиночных фаундеров до небольших команд."
      }
    ]
  }
];

export default function FaqPage() {
  const [openItemId, setOpenItemId] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setOpenItemId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="min-h-[70vh] bg-[#05070B] py-16 text-slate-100">
      <div className="mx-auto max-w-5xl px-6">
        {/* Навигация / крошки */}
        <div className="text-sm text-slate-500">
          <Link href="/" className="hover:text-emerald-300">
            ← На главную
          </Link>
        </div>

        {/* Hero FAQ */}
        <header className="mt-6">
          <p className="text-xl mb-4 font-semibold uppercase tracking-[0.18em] text-emerald-400">
            FAQ
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-50 md:text-4xl">
            Частые вопросы о работе, архитектуре и MVP
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-slate-300 md:text-base">
            Здесь собраны типичные вопросы, которые возникают у фаундеров,
            экспертов и небольших команд, когда они думают о запуске продукта,
            архитектуре и сотрудничестве со мной как с архитектором и CTO.
          </p>
        </header>

        {/* Группы FAQ */}
        <div className="mt-10 space-y-8">
          {faqGroups.map((group) => (
            <FaqGroup
              key={group.id}
              group={group}
              openItemId={openItemId}
              onToggle={toggleItem}
            />
          ))}
        </div>

        {/* CTA внизу FAQ */}
        <div className="mt-12 rounded-3xl border border-slate-800 bg-slate-900/40 px-6 py-8 text-center shadow-[0_0_40px_rgba(0,0,0,0.45)] md:px-10 md:py-10">
          <h2 className="text-lg font-semibold text-slate-50 md:text-xl">
            Не нашли ответ на свой вопрос?
          </h2>
          <p className="mt-3 text-sm text-slate-300 md:text-base">
            Напишите пару строк об идее или проекте — обсудим всё в формате
            короткой созвон-сессии и наметим реалистичные следующие шаги.
          </p>
          <div className="mt-6 flex justify-center">
            <AskQuestionDialog />
          </div>
          <p className="mt-4 text-xs text-slate-500">
            Я отвечаю лично. Без спама и рассылок — только предметный диалог.
          </p>
        </div>
      </div>
    </section>
  );
}

function FaqGroup({
  group,
  openItemId,
  onToggle
}: {
  group: FaqGroup;
  openItemId: string | null;
  onToggle: (id: string) => void;
}) {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/40 p-5 shadow-[0_0_30px_rgba(0,0,0,0.4)] md:p-6">
      <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-300">
        {group.title}
      </h2>
      <div className="mt-4 divide-y divide-slate-800">
        {group.items.map((item, index) => {
          const id = `${group.id}-${index}`;
          const isOpen = openItemId === id;

          return (
            <FaqItem
              key={id}
              id={id}
              item={item}
              isOpen={isOpen}
              onToggle={onToggle}
            />
          );
        })}
      </div>
    </section>
  );
}

function FaqItem({
  id,
  item,
  isOpen,
  onToggle
}: {
  id: string;
  item: FaqItem;
  isOpen: boolean;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="py-3 first:pt-0 last:pb-0">
      <button
        type="button"
        onClick={() => onToggle(id)}
        className="flex w-full items-start justify-between gap-4 text-left"
        aria-expanded={isOpen}
      >
        <div>
          <p className="text-sm font-medium text-slate-100 md:text-[15px]">
            {item.question}
          </p>
          {isOpen && (
            <div className="mt-2 text-sm text-slate-300">
              <p>{item.answer}</p>
              {item.details && (
                <p className="mt-1 text-xs text-slate-400">{item.details}</p>
              )}
            </div>
          )}
        </div>

        <div className="mt-1 flex h-6 w-6 flex-none items-center justify-center rounded-full border border-slate-600 text-xs text-slate-300">
          {isOpen ? "−" : "+"}
        </div>
      </button>
    </div>
  );
}