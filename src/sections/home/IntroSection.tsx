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
      <div className="mx-auto max-w-6xl px-4 pt-24 pb-24 sm:px-6 lg:px-8">
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
                pointer-events-none absolute inset-0
                bg-gradient-to-br
                from-sky-500/10
                via-slate-900/45
                to-purple-500/6
              "
            />

            {/* Основной контент интро */}
            <div className="relative space-y-6 text-base leading-relaxed text-slate-200 md:text-lg">

              <h2 className="text-3xl font-semibold text-slate-50">Что я делаю</h2>

              {/* <p className="mt-2 text-xl text-slate-400">
                Чем могу быть полезен: от MVP до цифровой платформы и архитектуры.
              </p> */}

              <div className="mt-6 space-y-4">
                {/* 1) MVP */}
                <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 px-4 py-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl leading-none text-slate-100">⦿</span>
                    <div>
                      <p className="text-lg font-semibold text-slate-100 md:text-xl">
                        MVP и прототипы
                      </p>
                      <p className="mt-1 text-slate-200/90 leading-normal">
                        Быстро создаю версии продукта, которые сразу приносят пользу и дают бизнес-результат: от
                        лендингов и одностраничных приложений до сложных систем с авторизацией, оплатами и
                        интеграциями.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2) Digital Hub */}
                <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 px-4 py-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl leading-none text-slate-100">⦿</span>
                    <div>
                      <p className="text-lg font-semibold text-slate-100 md:text-xl">
                        Собираю ваш персональный Digital Hub
                      </p>
                      <p className="mt-1 text-slate-200/90 leading-normal">
                        Создаю под ключ <span className="font-semibold text-slate-100">цифровую платформу для вашего личного бренда</span> — сайт,
                        блог, CRM, LMS, видеоконференция, структурированный чат комьюнити, личные кабинеты и оплаты.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3) Архитектура */}
                <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 px-4 py-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl leading-none text-slate-100">⦿</span>
                    <div>
                      <p className="text-lg font-semibold text-slate-100 md:text-xl">
                        Архитектура и проектирование
                      </p>
                      <p className="mt-1 text-slate-200/90 leading-normal">
                        Помогаю сформировать ясную архитектуру продукта: бизнес-логику, модель данных, интеграции,
                        технические решения и безопасный маршрут развития системы — от MVP до масштабирования.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 4) CTO-as-a-service */}
                <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 px-4 py-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl leading-none text-slate-100">⦿</span>
                    <div>
                      <p className="text-lg font-semibold text-slate-100 md:text-xl">
                        CTO-as-a-service
                      </p>
                      <p className="mt-1 text-slate-200/90 leading-normal">
                        Беру на себя роль технического руководителя: выстраиваю архитектуру, процессы, качество разработки и
                        технологическую стратегию — без необходимости нанимать CTO в штат.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <p className="pt-2 text-base text-slate-400">
                Рабочие языки: русский, английский, немецкий. Базируюсь в регионе Аугсбурга (Германия), работаю полностью онлайн.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}