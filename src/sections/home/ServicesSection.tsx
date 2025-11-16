// src/sections/home/ServicesSection.tsx
'use client';

import { motion, type Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
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

export function ServicesSection() {
  return (
    <section className="bg-[#0F1115] text-slate-100">
      <div className="mx-auto max-w-5xl px-6 pb-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Заголовок секции */}
          <motion.h2
            variants={itemVariants}
            className="text-xl font-semibold tracking-tight text-slate-50 md:text-2xl"
          >
            Основные направления работы
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="mt-3 max-w-2xl text-sm text-slate-400 md:text-base"
          >
            Я не помогаю и не объясняю, как &laquo;писать код&raquo;. Я помогаю пройти путь от идеи
            и первых решений до работающего продукта и устойчивой цифровой
            системы.
          </motion.p>

          {/* Карточки направлений */}
          <motion.div
            variants={itemVariants}
            className="mt-8 grid gap-6 md:grid-cols-3"
          >
            {/* MVP-проекты */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-5 shadow-sm shadow-black/20">
              <h3 className="text-sm font-semibold text-slate-50 md:text-base">
                MVP-проекты
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-slate-300 md:text-sm">
                Совместно формулируем ядро продукта, выбираем стек, проектируем
                архитектуру и собираем MVP: авторизация, базовая бизнес-логика,
                платежи, интеграции. На таком прототипе уже можно показывать
                продукт инвесторам, тестировать рынок и принимать первые
                платежи.
              </p>
            </div>

            {/* Digital Hub / цифровая инфраструктура */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-5 shadow-sm shadow-black/20">
              <h3 className="text-sm font-semibold text-slate-50 md:text-base">
                Digital Hub / цифровая инфраструктура
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-slate-300 md:text-sm">
                Выстраиваю вокруг продукта цифровую экосистему: видеосвязь, LMS,
                чат, база знаний, платежи, автоматизации, единый вход (SSO). Всё
                это работает как целостная система, а не набор случайных
                сервисов.
              </p>
            </div>

            {/* IT-консалтинг и архитектура */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-5 shadow-sm shadow-black/20">
              <h3 className="text-sm font-semibold text-slate-50 md:text-base">
                IT-консалтинг и архитектура
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-slate-300 md:text-sm">
                Помогаю принять технологические решения: выбрать стек,
                спроектировать архитектуру, провести аудит текущей системы,
                наметить roadmap развития и точки, где имеет смысл подключать AI
                и автоматизацию.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}