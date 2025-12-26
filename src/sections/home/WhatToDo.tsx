// src/sections/home/WhatToDoSection.tsx
"use client";

import Link from "next/link";
import { useMemo, useRef } from "react";
import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

type Card = {
  title: string;
  description: string;
  bullets: string[];
  href: string;
  cta: string;
  icon: ReactNode;
};

function ArrowRightIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        d="M5 12h12m0 0-5-5m5 5-5 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8 text-[#06BE81]">
      <path
        d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M3 12h18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M12 3c2.8 2.6 4.5 5.9 4.5 9S14.8 18.4 12 21c-2.8-2.6-4.5-5.9-4.5-9S9.2 5.6 12 3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function SaaSIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8 text-[#06BE81]">
      <path
        d="M7 7h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M9 11h6M9 14h6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ToolsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8 text-[#06BE81]">
      <path
        d="M10 13 4 19a2 2 0 0 0 3 3l6-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 11 20 5a2 2 0 0 0-3-3l-6 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 17l-2-2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M16 7l2 2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function RocketIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8 text-[#06BE81]">
      <path
        d="M14 4c3.5 0 6 2.5 6 6-2 7-7 10-11 10-2.8 0-5-2.2-5-5 0-4 3-9 10-11Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M10 14l-2 2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M13 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function ScrollButton({
  dir,
  onClick,
}: {
  dir: "left" | "right";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === "left" ? "Scroll left" : "Scroll right"}
      className="
        inline-flex items-center justify-center
        rounded-full
        border border-slate-200
        bg-white/80
        px-3 py-2
        text-slate-700
        shadow-sm
        backdrop-blur
        transition
        hover:-translate-y-0.5
        hover:bg-white
        hover:shadow-[0_10px_26px_rgba(15,23,42,0.10)]
        focus-visible:outline-none
        focus-visible:ring-2 focus-visible:ring-[#06BE81]/40
      "
    >
      <span className="sr-only">{dir}</span>
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path
          d={dir === "left" ? "M14 6 8 12l6 6" : "M10 6l6 6-6 6"}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

function CardItem({ card }: { card: Card }) {
  return (
      <motion.div
        variants={itemVariants}
        className="
        snap-start
        shrink-0

        w-full
        sm:w-[72%]
        md:w-[520px]
        lg:w-[352px] lg:min-w-[352px] lg:max-w-[352px]
        "
      >
      <div
        className="
          h-full
          rounded-2xl
          border border-slate-200
          bg-white/70
          p-6
          ring-1 ring-black/5
          shadow-sm
          backdrop-blur
          transition
          duration-200
          will-change-transform
          hover:-translate-y-1
          hover:bg-white/90
          hover:shadow-[0_18px_45px_rgba(15,23,42,0.12),0_6px_16px_rgba(15,23,42,0.08)]

          flex flex-col
        "
      >
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl border border-[#06BE81]/25 bg-[#06BE81]/10">
            {card.icon}
          </div>
          <div className="min-w-0">
            <h3 className="text-xl font-semibold text-slate-900">{card.title}</h3>
            <p className="mt-2 text-base leading-relaxed text-slate-700">
              {card.description}
            </p>
          </div>
        </div>

        <ul className="mt-5 space-y-2.5 text-base text-slate-700">
          {card.bullets.map((b) => (
            <li key={b} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#06BE81]" />
              <span>{b}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-5">
          <Link
            href={card.href}
            className="
            inline-flex items-center gap-2
            rounded-lg
            bg-[#05070B]
            px-4 py-2
            text-base font-semibold
            text-[#06BE81]

            transition
            hover:-translate-y-0.5
            hover:bg-[#0B0F16]
            hover:shadow-[0_8px_24px_rgba(5,7,11,0.35)]

            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-[#06BE81]/50
            focus-visible:ring-offset-2
            focus-visible:ring-offset-white
            "
          >
            {card.cta} <ArrowRightIcon />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export function WhatToDoSection() {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const cards = useMemo<Card[]>(
    () => [
      {
        title: "Модернизация или создание сайта",
        description:
          "Понятный сайт, который отвечает на вопросы клиента и приводит к откликам.",
        bullets: [
            "Выбор хостинга и доменного имени", 
            "Перезд или старт на новой, самой модной платформе", 
            "Структура и меню", 
            "Контент, его переиспользование и автопубликации",
            "Техническая сборка и скорость загрузки", 
            "SEO/аналитика/формы"
        ],
        href: "/projects/open-digital-hub", //конкретный кейс
        cta: "Посмотреть пример",
        icon: <GlobeIcon />,
      },
      {
        title: "Разработка веб-сервиса (SaaS)",
        description:
          "Что нужно бизнесу от ИТ: от идеи до рабочего продукта с пользователями.",
        bullets: [
            "Постановка задачи и ТЗ",
            "Понимание пользователей и их сценариев",
            "Перевод с бизнес-языка на программистский",
            "Выбор архитектуры и стека", 
            "Разработка MVP за разумный срок",
            "Интеграции и автоматизация",
            "Запуск и сопровождение"
        ],
        href: "/projects/yachtpricer",
        cta: "Кейс/демо",
        icon: <SaaSIcon />,
      },
      {
        title: "Развертывание Интернет-приложений",
        description:
          "ВКС, мессенджер, HelpDesk и пр. — поднимаю и настраиваю так, чтобы это реально работало.",
        bullets: [
            "Выбор правильного сервиса/продукта под задачу и бюджет",
            "Настройка и кастомизация под ваши нужды",
            "Домены и безопасность (SSL, GDPR)", 
            "Пользователи и доступы (SSO)", 
            "Мониторинг состояния и бэкапы", 
            "Интеграции с почтой и мессенджерами", 
            "Обучение и инструкции для команды"
        ],
        href: "/projects/meet-leonidk",
        cta: "Что уже делал",
        icon: <ToolsIcon />,
      },
      {
        title: "Песочница или MVP под IT-проект",
        description:
          "Быстрый прототип, чтобы проверить гипотезу и принять решение — делать дальше или остановиться.",
        bullets: [
            "Целеполагание и гипотезы",
            "Каркас и пользовательские сценарии",
            "Выбор провайдеров и технологий",
            "Конфигурация VPS и окружения",
            "Подключение внешних API и сервисов",
            "Прототип + аналитика",
            "Риски и “узкие места”",
            "План на ближайшее будущее"],
        href: "/projects/seatmap-abc360",
        cta: "Посмотреть MVP",
        icon: <RocketIcon />,
      },
    ],
    [],
  );

    const scrollByPx = (px: number) => {
        const el = scrollerRef.current;
        if (!el) return;
        el.scrollBy({ left: px, behavior: "smooth" });
    };

    return (
        <section className="bg-slate-50 text-slate-900">
            <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    className="relative"
                >
                    <div className="flex items-start gap-6">
                        <div className="min-w-0 flex-1 max-w-2xl">
                            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                            Что можно сделать вместе
                            </p>

                            <h2 className="mt-3 text-3xl font-semibold text-slate-900">
                            Конкретные кейсы
                            </h2>

                            <p className="mt-3 text-base text-slate-700 md:text-lg">
                            Я помогаю пройти путь от “не понимаю, с чего начать” до “могу похвастаться
                            результатом”.
                            </p>
                        </div>
                    </div>

                    {/* стрелки — mobile only, справа сверху над карточками */}
                    <div className="absolute right-4 top-[9.5rem] z-20 flex gap-2 md:hidden">
                        <ScrollButton dir="left" onClick={() => scrollByPx(-360)} />
                        <ScrollButton dir="right" onClick={() => scrollByPx(360)} />
                    </div>

                    {/* Mobile/tablet: horizontal gallery. Desktop: fixed-width “3 cards” viewport */}
                    <div className="relative mt-10 lg:w-[1104px] lg:max-w-none lg:mx-0">
                       
                        <div
                            ref={scrollerRef}
                            className="
                            flex gap-6
                            overflow-x-auto
                            pb-2
                            px-0
                            snap-x snap-mandatory
                            [-ms-overflow-style:none]
                            [scrollbar-width:none]
                            [&::-webkit-scrollbar]:hidden
                            "
                        >
                            {cards.map((card) => (
                                <CardItem key={card.title} card={card} />
                            ))}
                        </div>
                    </div>

                    {/* стрелки на десктопе/планшете */}
                    <div className="mt-3 ml-auto hidden shrink-0 items-center gap-2 md:flex">
                        <ScrollButton dir="left" onClick={() => scrollByPx(-360)} />
                        <ScrollButton dir="right" onClick={() => scrollByPx(360)} />
                    </div>

                    {/* маленькая подсказка для мобилок */}
                    <p className="mt-4 text-xs text-slate-500 lg:hidden">
                        Подсказка: листайте карточки влево/вправо.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}