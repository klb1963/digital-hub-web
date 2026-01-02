// src/sections/home/IntroSection.tsx
"use client";

import { motion, type Variants } from "framer-motion";
import {
  WrenchScrewdriverIcon,
  ShieldCheckIcon,
  MapIcon,
  HandRaisedIcon,
} from "@heroicons/react/24/outline";

const introVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function IntroSection() {
  return (
    <section className="bg-[#05070B] text-slate-100">
      <div className="mx-auto max-w-6xl px-6 pt-24 pb-24 lg:px-8">
        <motion.div
          variants={introVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          <div className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950/70 px-6 py-12 sm:px-10">
            {/* Gradient */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-sky-500/10 via-slate-900/45 to-purple-500/6" />

            <div className="relative grid gap-14 lg:grid-cols-12 lg:items-start">
              {/* LEFT */}
              <div className="lg:col-span-5 lg:mt-10">
                <h2 className="text-3xl font-semibold tracking-tight text-slate-50 md:text-4xl">
                  Чем я могу быть полезен вашему бизнесу
                </h2>

                <p className="mt-4 text-base leading-relaxed text-slate-300 md:text-lg">
                  Я подключаюсь к существующим ИТ-проектам и помогаю владельцу
                  вернуть контроль: убрать хаос, снизить риски и выстроить
                  понятный план развития 
                    <span className="font-semibold text-[#04A974]">
                        {' '} — без космических бюджетов и зависимости от одного подрядчика.
                    </span>
                </p>

                <p className="mt-6 text-base text-slate-200 md:text-lg">
                <span className="font-semibold text-slate-200">
                    Рабочие языки:
                </span>{' '}  
                   русский, английский, немецкий. Германия
                  (регион Аугсбурга), полностью онлайн.
                </p>
              </div>

              {/* RIGHT — 2x2 OFFSET GRID */}
              <div className="lg:col-span-7">
                <div className="grid gap-6 sm:grid-cols-2 lg:mt-10">
                  {/* 1. Диагностика */}
                  <FeatureCard
                    icon={WrenchScrewdriverIcon}
                    title="ИТ-диагностика проекта"
                    text="Разбираю архитектуру, код, платформы, интеграции и процессы — чтобы стало ясно, как система устроена на самом деле и где находятся риски."
                  />

                  {/* 2. Контроль */}
                  <FeatureCard
                    icon={ShieldCheckIcon}
                    title="Навожу порядок и возвращаю контроль"
                    text="Документирую решения, упрощаю архитектуру и убираю зависимость от одного подрядчика — проект перестаёт быть «чёрным ящиком»."
                  />

                  {/* 3. План развития */}
                  <FeatureCard
                    icon={MapIcon}
                    title="Развитие без переплаты"
                    text="Формирую реалистичный план: что действительно стоит дорабатывать, что можно отложить и где не нужно тратить деньги."
                  />

                  {/* 4. Партнёрство */}
                  <FeatureCard
                    icon={HandRaisedIcon}
                    title="Работаю как IT-партнёр"
                    text="Подключаюсь на регулярной основе (20–50 часов в месяц), помогаю принимать технические решения и сопровождать развитие проекта."
                  />
                </div>

                <p className="mt-8 text-base text-slate-200 md:text-lg">
                  2 часа консультации → выводы → план следующих шагов
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- */

export function FeatureCard({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ElementType;
  title: string;
  text: string;
}) {
  return (
    <div
      className="
        rounded-2xl
        bg-white
        p-6
        shadow-[0_10px_30px_rgba(0,0,0,0.12)]
        ring-1 ring-black/5
        transition
        duration-200
        hover:-translate-y-1
        hover:shadow-[0_18px_45px_rgba(0,0,0,0.18)]
      "
    >
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
          <Icon className="h-6 w-6 text-emerald-600" />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            {title}
          </h3>
          <p className="mt-2 text-base leading-relaxed text-slate-600">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}