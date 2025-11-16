// src/sections/home/WorkFormatsSection.tsx
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

export function WorkFormatsSection() {
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
            Форматы работы
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="mt-3 max-w-2xl text-sm text-slate-400 md:text-base"
          >
            Можно начать с разовой стратегической сессии или сразу зайти в
            полноценный проект — MVP, цифровой хаб или регулярное
            сопровождение.
          </motion.p>

          {/* Форматы */}
          <motion.div
            variants={itemVariants}
            className="mt-8 grid gap-6 md:grid-cols-4"
          >
            {/* 1. Стратегическая сессия */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-5">
              <h3 className="text-sm font-semibold text-slate-50 md:text-base">
                Стратегическая сессия
              </h3>
              <p className="mt-1 text-xs text-slate-400 md:text-sm">
                1–2 часа
              </p>
              <p className="mt-3 text-xs leading-relaxed text-slate-300 md:text-sm">
                Разбираем идею, текущую ситуацию и ограничения. Определяем цель,
                формируем первые архитектурные решения и понятный следующий
                шаг.
              </p>
            </div>

            {/* 2. MVP под ключ */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-5">
              <h3 className="text-sm font-semibold text-slate-50 md:text-base">
                MVP &laquo;под ключ&raquo;
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-slate-300 md:text-sm">
                Полный цикл: от требований и архитектуры до работающего
                прототипа с авторизацией, базовой логикой, интеграциями и
                платежами. Готовый продукт для демо и первых клиентов.
              </p>
            </div>

            {/* 3. Digital Hub */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-5">
              <h3 className="text-sm font-semibold text-slate-50 md:text-base">
                Построение Digital Hub
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-slate-300 md:text-sm">
                Создание цифровой экосистемы вокруг продукта: видеосвязь, LMS,
                чат, база знаний, платежи, автоматизации, единый вход. Всё
                работает как одна система.
              </p>
            </div>

            {/* 4. Техническое менторство */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-5">
              <h3 className="text-sm font-semibold text-slate-50 md:text-base">
                Техническое менторство
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-slate-300 md:text-sm">
                Регулярные созвоны и сопровождение фаундера или небольшой
                команды. Помогаю принимать технические решения и держать систему
                в порядке.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}