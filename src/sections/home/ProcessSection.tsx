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
    <section className="bg-[#0F1115] text-slate-100 py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Заголовок */}
          <motion.h2
            variants={itemVariants}
            className="text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl"
          >
            Как строится работа
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="mt-3 max-w-2xl text-sm text-slate-400 md:text-base"
          >
            Простой и быстрый процесс — от первых вопросов
            до работающего прототипа.
          </motion.p>

          {/* Таймлайн */}
          <motion.div
            variants={itemVariants}
            className="relative mt-12 space-y-12"
          >
            {/* Вертикальная линия */}
            <div className="pointer-events-none absolute left-[14px] top-0 h-full w-[2px] bg-slate-700/50" />

            {/* === STEP TEMPLATE === */}
            {[
              {
                step: 'Шаг 1',
                title: 'Созвон и знакомство',
                headline: 'Короткий разговор, чтобы сверить цели и контекст',
                text:
                  '20–30 минут, где мы обсуждаем идею, бизнес-контекст, ограничения и ожидаемый результат. Уже на этом этапе становится понятно, можно ли задачу решить быстро и в какой форме сотрудничества.',
                result:
                  'предварительное понимание сроков, диапазона бюджета и реалистичного MVP-объёма.',
              },
              {
                step: 'Шаг 2',
                title: 'Архитектура и планирование',
                headline: 'Формируем понятную архитектуру и маршрут к MVP',
                text:
                  'Выбираем стек, проектируем ключевые модули, описываем границы первой версии и интеграции. Всё фиксируется в виде архитектурной карты, короткого документа или mindmap.',
                result:
                  'ясный технический план и общий язык между бизнесом и разработкой.',
              },
              {
                step: 'Шаг 3',
                title: 'Разработка итерациями',
                headline: 'Собираем MVP, который можно показывать и пробовать',
                text:
                  'Работа идёт циклами по 2–5 недель: появляются экраны, сценарии, интеграции и платежи. Вы регулярно видите прогресс и управляете приоритетами.',
                result:
                  'прозрачность задач, демонстрации, обратную связь и контроль очередности.',
              },
              {
                step: 'Шаг 4',
                title: 'Ввод в эксплуатацию и развитие',
                headline: 'Запускаем, документируем и готовим почву для роста',
                text:
                  'Продукт разворачивается на вашем хостинге или в облаке, настраиваются домены, доступы и мониторинг. Я передаю документацию и рекомендации для следующих итераций.',
                result:
                  'готовый продукт, понятную архитектуру и основу для масштабирования.',
              },
            ].map((item) => (
              <motion.div
                key={item.step}
                variants={itemVariants}
                className="relative flex gap-6 pl-12"
              >
                {/* Маркер */}
                <div className="absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full border border-emerald-500/40 bg-[#0F1115]">
                  <div className="h-3 w-3 rounded-full bg-emerald-500" />
                </div>

                <div>
                  {/* Step badge */}
                  <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/60 px-3 py-1.5 text-sm font-medium uppercase tracking-wide text-slate-300">
                    <span className="text-emerald-400">{item.step}</span>
                    <span className="text-slate-100">{item.title}</span>
                  </div>

                  <h3 className="mt-3 text-base font-semibold text-slate-100 md:text-lg">
                    {item.headline}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-slate-300 md:text-base">
                    {item.text}
                  </p>

                  {/* Highlight */}
                  <p className="mt-4 rounded-lg border border-slate-700/40 bg-slate-800/40 p-3 text-sm text-slate-200 md:text-base">
                    <span className="font-semibold text-emerald-400">
                      Что вы получаете:
                    </span>{' '}
                    {item.result}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}