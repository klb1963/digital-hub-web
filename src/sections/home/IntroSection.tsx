// src/sections/home/IntroSection.tsx
"use client";

import { motion, type Variants } from "framer-motion";

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
      <div className="mx-auto max-w-5xl px-4 pt-24 pb-24 sm:px-6 lg:px-8">
        <motion.div
          variants={introVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          {/* Карточка в стиле Tailwind Header Section */}
          <div
            className="
              relative overflow-hidden
              rounded-3xl border border-slate-800/80
              bg-slate-950/70
              px-6 py-10 sm:px-10 sm:py-12
              shadow-[0_18px_45px_rgba(0,0,0,0.75)]
            "
          >
            {/* Лёгкий цветовой градиент поверх фона */}
            <div
              className="
                pointer-events-none
                absolute inset-0
                bg-gradient-to-r
                from-sky-500/15 via-transparent to-purple-500/20
              "
            />

            {/* Основной контент интро */}
            <div className="relative space-y-6 text-base leading-relaxed text-slate-200 md:text-lg">

              <p className="font-bold text-slate-50 text-2xl">
                Что я делаю:
              </p>

              <div className="space-y-4">
                <p>
                  <span className="text-slate-100 font-bold md:text-xl">⦿ Архитектура и проектирование</span><br />
                  Помогаю сформировать ясную архитектуру продукта: бизнес-логику, модель данных, интеграции, технические решения и безопасный маршрут развития системы — от MVP до масштабирования.
                </p>

                <p>
                  <span className="text-slate-100 font-bold md:text-xl">⦿ MVP и прототипы</span><br />
                  Быстро создаю рабочие версии продукта, которые можно показать клиентам, протестировать гипотезы и подготовить бизнес к следующему этапу инвестиций или запуска.
                </p>

                <p>
                  <span className="text-slate-100 font-bold md:text-xl">⦿ Собираю ваш Digital Hub</span><br />
                  Создаю под ключ цифровую платформу под ваш бренд — сайт, блог, CRM, LMS, VCS, комьюнити, личные кабинеты и оплаты.
                </p>

                <p>
                  <span className="text-slate-100 font-bold md:text-xl">⦿ CTO-as-a-service</span><br />
                  Беру на себя роль технического руководителя: выстраиваю архитектуру, процессы, качество разработки и технологическую стратегию — без необходимости нанимать CTO в штат.
                </p>
              </div>

              <p className="pt-2 text-l text-slate-400">
                Рабочие языки: русский, английский, немецкий. Базируюсь в регионе Аугсбурга (Германия), работаю полностью онлайн.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}