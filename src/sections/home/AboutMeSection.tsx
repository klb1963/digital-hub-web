// src/sections/home/AboutMeSection.tsx
'use client';

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
    <section className="bg-[#0F1115] text-slate-100">
      <div className="mx-auto max-w-5xl px-6 pb-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Заголовок */}
          <motion.h2
            variants={itemVariants}
            className="text-xl font-semibold tracking-tight text-slate-50 md:text-2xl"
          >
            Обо мне
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="mt-3 max-w-3xl text-sm text-slate-400 md:text-base"
          >
            Коротко — почему со мной можно идти в MVP, архитектуру и построение
            цифровой инфраструктуры.
          </motion.p>

          {/* Карточки */}
          <motion.div
            variants={itemVariants}
            className="mt-8 grid gap-6 md:grid-cols-3"
          >
            {/* Опыт */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-5">
              <h3 className="text-sm font-semibold text-slate-50 md:text-base">
                20+ лет в IT и преподавании
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-slate-300 md:text-sm">
                Работал инженером, архитектором, руководил проектами, создавал
                учебные программы, преподавал программирование. Умею объяснять
                сложное простым языком и вести команды к результату.
              </p>
            </div>

            {/* CTO-подход */}
            <div class-name="rounded-2xl border border-slate-800 bg-slate-900/20 p-5">
              <h3 className="text-sm font-semibold text-slate-50 md:text-base">
                Практикующий CTO и архитектурный ментор
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-slate-300 md:text-sm">
                Выстраиваю продукт и экосистему как единое целое: архитектура,
                стек, процессы, roadmap, интеграции, безопасность, деплой,
                автоматизации.
              </p>
            </div>

            {/* Стек */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-5">
              <h3 className="text-sm font-semibold text-slate-50 md:text-base">
                Современный стек и инженерный подход
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-slate-300 md:text-sm">
                Next.js, Node.js, NestJS, PostgreSQL, Docker, CI/CD, Traefik,
                Payload CMS, Supabase, Stripe, Jitsi, Zulip, n8n — плюс
                системная работа c AI как с инженерным партнёром.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}