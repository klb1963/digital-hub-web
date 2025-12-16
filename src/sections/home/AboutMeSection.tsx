// src/sections/home/AboutMeSection.tsx
'use client';

import Image from 'next/image';
import { motion, type Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function AboutMeSection() {
  return (
    <section className="bg-[#0F1115] text-slate-100 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Заголовок */}
          <motion.h2
            variants={itemVariants}
            className="text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl"
          >
            Обо мне
          </motion.h2>

          {/* <motion.p
            variants={itemVariants}
            className="mt-3 max-w-3xl text-sm text-slate-400 md:text-base"
          >
            Коротко — почему со мной можно идти в MVP, архитектуру и построение
            цифровой инфраструктуры.
          </motion.p> */}

          {/* Двухколоночный блок */}
          <motion.div
            variants={itemVariants}
            className="mt-10 grid items-start gap-10 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1.4fr)]"
          >
            {/* Левая колонка: карточка с фото */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 shadow-[0_18px_45px_rgba(0,0,0,0.55)] md:p-7">
              <Image
                src="/images/avatar-03.png"
                alt="Leonid Kleimann"
                width={200}
                height={200}
                className="h-90 w-90 rounded-2xl object-cover ring-2 ring-slate-700/70"
              />

              <div className="mt-5 space-y-3">
                <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-slate-400">
                  Леонид Кляйман
                </p>
                <p className="text-sm font-semibold text-slate-50 md:text-base">
                  ИТ-консультант &amp; ИИ-инженер
                </p>
                <p className="text-xs text-slate-400 md:text-sm">
                  Помогающий практик для фаундеров, фрилансеров и ИТ-команд.
                </p>
              </div>
            </div>

            {/* Правая колонка: три акцента */}
            <div className="space-y-5">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
                <h3 className="text-base font-semibold text-slate-50 md:text-lg">
                  20+ лет в IT-индустрии
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-300 md:text-base">
                  Работал инженером, архитектором, руководил проектами, создавал
                  учебные программы, преподавал программирование. Умею объяснять
                  сложное простым языком и вести проект к результату.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
                <h3 className="text-base font-semibold text-slate-50 md:text-lg">
                  Практикующий CTO
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-300 md:text-base">
                  Смотрю на продукт и экосистему целиком: архитектура, стек,
                  процессы, roadmap, интеграции, безопасность, деплой,
                  автоматизации. Помогаю фаундерам принимать технологические
                  решения, которые выдерживают реальность, а не только
                  презентации.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
                <h3 className="text-base font-semibold text-slate-50 md:text-lg">
                  Современный стек и использование AI
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-300 md:text-base">
                  Next.js, Node.js, NestJS, PostgreSQL, Docker, CI/CD, Traefik,
                  Payload CMS, Supabase, Stripe, Jitsi, Zulip, n8n — плюс
                  системная работа с AI как с инженерным партнёром, а не просто
                  «генерацией текстов».
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}