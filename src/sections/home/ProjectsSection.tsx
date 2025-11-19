// src/sections/home/ProjectsSection.tsx
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

export function ProjectsSection() {
  return (
    <section className="bg-[#0F1115] text-slate-100">
      <div className="mx-auto max-w-5xl pt-24 px-6 pb-24">
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
            Проекты и кейсы
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="mt-3 max-w-2xl text-sm text-slate-400 md:text-base"
          >
            Несколько примеров систем, которые я спроектировал и довёл от идеи
            и архитектуры до работающего решения — с кодом, инфраструктурой и
            реальными пользователями.
          </motion.p>

          {/* Карточки проектов */}
          <motion.div
            variants={itemVariants}
            className="mt-8 grid gap-6 md:grid-cols-3"
          >
            {/* YachtPricer */}
            <div className="flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-900/20 p-5 shadow-sm shadow-black/20">
              <h3 className="text-sm font-semibold text-slate-50 md:text-base">
                YachtPricer — ценообразование чартерных яхт
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-slate-300 md:text-sm">
                SaaS-платформа для чартерной компании в Хорватии. Анализ цен
                конкурентов, история цен по неделям, workflow согласования
                ставки между менеджером и флот-менеджером, интеграция с NauSYS,
                ролевая модель доступа, автоматический деплой на VPS.
              </p>
            </div>

            {/* Seat Map ABC360 */}
            <div className="flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-900/20 p-5 shadow-sm shadow-black/20">
              <h3 className="text-sm font-semibold text-slate-50 md:text-base">
                Seat Map ABC360 — модуль посадки для Sabre Red 360
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-slate-300 md:text-sm">
                Web-модуль для авиакомпаний внутри Sabre Red 360: визуализация
                карты мест, работа с EnhancedSeatMapRQ и GetReservationRQ,
                логика автопосадки и пересадки пассажиров, интеграция с
                внешним seat map-провайдером, подготовка к сертификации в Sabre
                Marketplace.
              </p>
            </div>

            {/* Open Digital Hub */}
            <div className="flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-900/20 p-5 shadow-sm shadow-black/20">
              <h3 className="text-sm font-semibold text-slate-50 md:text-base">
                Open Digital Hub — собственная цифровая экосистема
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-slate-300 md:text-sm">
                Личный цифровой хаб на базе Next.js, Payload CMS, PostgreSQL и
                nginx. Демонстрирует подход к построению экосистемы: лендинг,
                CMS, аутентификация, интеграции, подготовка к подключению
                видеосвязи, LMS, чата и автоматизаций.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}