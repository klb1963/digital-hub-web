// src/sections/home/AudienceSection.tsx
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

const cardVariants: Variants = {
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

export function AudienceSection() {
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
            variants={cardVariants}
            className="text-xl font-semibold tracking-tight text-slate-50 md:text-2xl"
          >
            Для кого я работаю
          </motion.h2>

          <motion.p
            variants={cardVariants}
            className="mt-3 max-w-2xl text-sm text-slate-400 md:text-base"
          >
            Я работаю с фаундерами, экспертами и командами, которым нужен
            практикующий технологический партнёр, а не ещё один подрядчик по
            разработке.
          </motion.p>

          {/* Карточки аудиторий */}
          <motion.div
            variants={cardVariants}
            className="mt-8 grid gap-6 md:grid-cols-3"
          >
            {/* 1. Русскоязычные фаундеры в Европе */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-5 shadow-sm shadow-black/20">
              <h3 className="text-sm font-semibold text-slate-50 md:text-base">
                Русскоязычные фаундеры и предприниматели в Европе
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-slate-300 md:text-sm">
                Строите продукт, сервис или онлайн-платформу и не хотите
                раздувать штат разработки. Нужен человек, который понимает и
                бизнес, и технологию, помогает принять архитектурные решения и
                довести MVP до результата.
              </p>
            </div>

            {/* 2. Фаундеры и малый бизнес DACH / EU */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-5 shadow-sm shadow-black/20">
              <h3 className="text-sm font-semibold text-slate-50 md:text-base">
                Фаундеры и малый бизнес в DACH / ЕС
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-slate-300 md:text-sm">
                Ведёте консалтинг, образовательный проект, онлайн-сообщество
                или нишевый SaaS. Нужна надёжная технологическая основа —
                авторизация, платежи, аналитика, интеграции — без перегрева по
                бюджету и срокам.
              </p>
            </div>

            {/* 3. Образовательные проекты и эксперты */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-5 shadow-sm shadow-black/20">
              <h3 className="text-sm font-semibold text-slate-50 md:text-base">
                Образовательные проекты и эксперты
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-slate-300 md:text-sm">
                Курсы, школы, клубы и комьюнити, которые хотят уйти от зоопарка
                платформ к единой цифровой экосистеме: видеосвязь, LMS, чат,
                база знаний, автоматизация и единый вход для участников.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}