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
          <div
            className="
              relative overflow-hidden
              rounded-3xl border border-slate-800/80
              bg-slate-950/70
              px-6 py-10 sm:px-10 sm:py-12
            "
          >
            <div
              className="
                pointer-events-none absolute inset-0
                bg-gradient-to-br
                from-sky-500/10
                via-slate-900/45
                to-purple-500/6
              "
            />

            <div className="relative space-y-6 text-base leading-relaxed text-slate-200 md:text-lg">
              <h2 className="text-3xl font-semibold text-slate-50">
                Чем я могу быть полезен вашему бизнесу
              </h2>

              <div className="space-y-4">
                {/* 1) Диагностика */}
                <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 px-4 py-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl leading-none text-slate-100">⦿</span>
                    <div>
                      <p className="text-lg font-semibold text-slate-100 md:text-xl">
                        Разбираюсь в существующем ИТ-проекте
                      </p>
                      <p className="mt-1 text-slate-200/90 leading-normal">
                        Провожу ИТ-диагностику: изучаю текущую архитектуру,
                        код, платформы, интеграции и процессы —
                        чтобы стало понятно, как всё устроено на самом деле
                        и где находятся риски.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2) Порядок и контроль */}
                <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 px-4 py-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl leading-none text-slate-100">⦿</span>
                    <div>
                      <p className="text-lg font-semibold text-slate-100 md:text-xl">
                        Навожу порядок и возвращаю контроль владельцу
                      </p>
                      <p className="mt-1 text-slate-200/90 leading-normal">
                        Документирую решения, упрощаю архитектуру,
                        устраняю технический хаос и зависимость
                        от одного разработчика или подрядчика —
                        чтобы проект перестал быть «чёрным ящиком».
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3) Развитие без переплаты */}
                <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 px-4 py-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl leading-none text-slate-100">⦿</span>
                    <div>
                      <p className="text-lg font-semibold text-slate-100 md:text-xl">
                        Помогаю развивать проект без космических бюджетов
                      </p>
                      <p className="mt-1 text-slate-200/90 leading-normal">
                        Предлагаю реалистичный план развития:
                        что действительно стоит дорабатывать,
                        что можно отложить, а от чего лучше отказаться —
                        с понятными сроками и затратами.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 4) Долгосрочное сопровождение */}
                <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 px-4 py-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl leading-none text-slate-100">⦿</span>
                    <div>
                      <p className="text-lg font-semibold text-slate-100 md:text-xl">
                        Работаю как IT-партнёр, а не разовый исполнитель
                      </p>
                      <p className="mt-1 text-slate-200/90 leading-normal">
                        Подключаюсь к проекту на регулярной основе
                        (20–50 часов в месяц), помогаю принимать
                        технические решения и сопровождаю развитие —
                        без долгосрочных контрактов и бюрократии.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <p className="pt-2 text-base text-slate-400">
                Рабочие языки: русский, английский, немецкий. Базируюсь в Германии
                (регион Аугсбурга), работаю полностью онлайн.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}