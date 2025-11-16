// src/sections/home/ProcessSection.tsx
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

export function ProcessSection() {
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
            Как мы работаем
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="mt-3 max-w-2xl text-sm text-slate-400 md:text-base"
          >
            Процесс выстроен так, чтобы быстро прийти к ясности, архитектуре и
            работающему результату — без сложности и лишних кругов.
          </motion.p>

          {/* Шаги */}
          <motion.div
            variants={itemVariants}
            className="mt-8 grid gap-6 md:grid-cols-4"
          >
            {/* 1 */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-5">
              <div className="mb-2 text-sm font-medium text-slate-400">
                1. Разбор идеи
              </div>
              <p className="text-xs leading-relaxed text-slate-300 md:text-sm">
                Обсуждаем идею, цели, ограничения, рынок и функционал. Формируем
                общее понимание задачи и приоритетов.
              </p>
            </div>

            {/* 2 */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-5">
              <div className="mb-2 text-sm font-medium text-slate-400">
                2. Архитектура и roadmap
              </div>
              <p className="text-xs leading-relaxed text-slate-300 md:text-sm">
                Выбираем стек, проектируем архитектуру, описываем ключевые
                компоненты и создаем дорожную карту к MVP.
              </p>
            </div>

            {/* 3 */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-5">
              <div className="mb-2 text-sm font-medium text-slate-400">
                3. Разработка MVP
              </div>
              <p className="text-xs leading-relaxed text-slate-300 md:text-sm">
                Собираем рабочий прототип: авторизация, логика, интеграции,
                платежи. MVP готов для демо и первых пользователей.
              </p>
            </div>

            {/* 4 */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-5">
              <div className="mb-2 text-sm font-medium text-slate-400">
                4. Экосистема и развитие
              </div>
              <p className="text-xs leading-relaxed text-slate-300 md:text-sm">
                Расширяем систему: видеосвязь, LMS, чат, автоматизации,
                аналитики. Продукт превращается в устойчивую экосистему.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}