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
      <div className="mx-auto max-w-4xl px-6 pb-24">
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
            Простой, прозрачный и быстрый процесс — от первых вопросов до работающего
            продукта и устойчивой цифровой экосистемы.
          </motion.p>

          {/* Таймлайн */}
          <motion.div
            variants={itemVariants}
            className="relative mt-10 space-y-10 md:space-y-12"
          >
            {/* Вертикальная линия */}
            <div className="pointer-events-none absolute left-3 top-0 h-full w-[2px] bg-slate-700/60" />

            {/* Шаг 1 */}
            <motion.div
              variants={itemVariants}
              className="relative flex gap-5 pl-10"
            >
              {/* Маркер */}
              <div className="absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full border border-indigo-500/40 bg-[#0F1115]">
                <div className="h-3 w-3 rounded-full bg-indigo-500" />
              </div>

              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/60 px-3 py-1.5 text-[12px] font-medium uppercase tracking-wide text-slate-300 md:text-[13px]">
                  <span className="text-[11px] text-indigo-400">Шаг 1</span>
                  <span className="text-slate-300/80">Созвон и знакомство</span>
                </div>

                <h3 className="mt-3 text-base font-semibold text-slate-100 md:text-lg">
                  Короткий разговор, чтобы сверить цели и контекст
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-slate-300 md:text-base">
                  20–30 минут, где мы обсуждаем идею, бизнес-контекст,
                  ограничения и ожидаемый результат. На этом этапе становится
                  ясно, можно ли задачу решить быстро и в какой форме
                  сотрудничества это будет удобнее.
                </p>

                <p className="mt-2 text-xs text-slate-500 md:text-sm">
                  Что вы получаете: предварительное понимание сроков, диапазона
                  бюджета и реалистичного MVP-объёма.
                </p>
              </div>
            </motion.div>

            {/* Шаг 2 */}
            <motion.div
              variants={itemVariants}
              className="relative flex gap-5 pl-10"
            >
              <div className="absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full border border-indigo-500/40 bg-[#0F1115]">
                <div className="h-3 w-3 rounded-full bg-indigo-500" />
              </div>

              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/60 px-3 py-1.5 text-[12px] font-medium uppercase tracking-wide text-slate-300 md:text-[13px]">
                  <span className="text-[11px] text-indigo-400">Шаг 2</span>
                  <span className="text-slate-300/80">
                    Архитектура и планирование
                  </span>
                </div>

                <h3 className="mt-3 text-base font-semibold text-slate-100 md:text-lg">
                  Формируем понятную архитектуру и маршрут к MVP
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-slate-300 md:text-base">
                  Выбираем стек, проектируем ключевые модули, описываем границы
                  первой версии и интеграции. Всё фиксируется в виде карты
                  архитектуры, короткого документа или mindmap.
                </p>

                <p className="mt-2 text-xs text-slate-500 md:text-sm">
                  Результат: ясный технический план, общий язык между бизнесом и
                  разработкой.
                </p>
              </div>
            </motion.div>

            {/* Шаг 3 */}
            <motion.div
              variants={itemVariants}
              className="relative flex gap-5 pl-10"
            >
              <div className="absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full border border-indigo-500/40 bg-[#0F1115]">
                <div className="h-3 w-3 rounded-full bg-indigo-500" />
              </div>

              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/60 px-3 py-1.5 text-[12px] font-medium uppercase tracking-wide text-slate-300 md:text-[13px]">
                  <span className="text-[11px] text-indigo-400">Шаг 3</span>
                  <span className="text-slate-300/80">
                    Разработка короткими итерациями
                  </span>
                </div>

                <h3 className="mt-3 text-base font-semibold text-slate-100 md:text-lg">
                  Собираем MVP, который можно показывать и трогать
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-slate-300 md:text-base">
                  Работа идёт циклами по 2–5 недель: появляются экраны, сценарии,
                  интеграции, платежи. Вместо «большого запуска через несколько
                  месяцев» вы регулярно видите прогресс и можете управлять
                  приоритетами.
                </p>

                <p className="mt-2 text-xs text-slate-500 md:text-sm">
                  Принцип общения: без бюрократии, прозрачность во всех
                  задачах, максимум демонстраций и обратной связи.
                </p>
              </div>
            </motion.div>

            {/* Шаг 4 */}
            <motion.div
              variants={itemVariants}
              className="relative flex gap-5 pl-10"
            >
              <div className="absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full border border-indigo-500/40 bg-[#0F1115]">
                <div className="h-3 w-3 rounded-full bg-indigo-500" />
              </div>

              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/60 px-3 py-1.5 text-[12px] font-medium uppercase tracking-wide text-slate-300 md:text-[13px]">
                  <span className="text-[11px] text-indigo-400">Шаг 4</span>
                  <span className="text-slate-300/80">
                    Доставка, передача и развитие
                  </span>
                </div>

                <h3 className="mt-3 text-base font-semibold text-slate-100 md:text-lg">
                  Запускаем, документируем и готовим почву для роста
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-slate-300 md:text-base">
                  Готовый продукт разворачивается на вашем хостинге или в
                  облаке, настраиваются домены, доступы и мониторинг. Я
                  оставляю документацию по базовой архитектуре и по схеме
                  для связи поддержки и следующей итерации.
                </p>

                <p className="mt-2 text-xs text-slate-500 md:text-sm">
                  В итоге: не абстрактная «консультация», а живой и понятный
                  продукт с планом его дальнейшего развития.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}