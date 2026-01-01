// 

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
      <div className="mx-auto max-w-6xl px-6 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Заголовок */}
          <motion.h2
            variants={itemVariants}
            className="text-3xl font-semibold tracking-tight text-slate-50 md:text-4xl"
          >
            Как строится работа
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="mt-4 max-w-3xl text-base leading-relaxed text-slate-300 md:text-lg"
          >
            Простой и прозрачный процесс — от ИТ-диагностики до понятного плана и
            стабильной работы вашего проекта.
          </motion.p>

          {/* Таймлайн */}
          <motion.div variants={itemVariants} className="relative mt-12 space-y-12">
            {/* Вертикальная линия */}
            <div className="pointer-events-none absolute left-[14px] top-0 h-full w-[2px] bg-slate-700/50" />

            {[
              {
                step: 'Шаг 1:',
                title: 'ИТ-диагностика',
                headline: 'Разбираемся, что у вас есть сейчас — и где реальные риски',
                text:
                  'За 2 часа собираем картину проекта: платформа, код, интеграции, доступы, хостинг, процессы и «узкие места». Цель — убрать неопределённость и понять, что действительно происходит с системой.',
                result:
                  'конкретные выводы и список проблем/рисков, приоритеты и план дальнейших шагов.',
              },
              {
                step: 'Шаг 2:',
                title: 'План и приоритеты',
                headline: 'Фиксируем маршрут: что делаем в первую очередь и зачем',
                text:
                  'По итогам диагностики формируем понятный план работ: быстрые победы, критические исправления, улучшения архитектуры и опции развития. Если нужно — определяем целевую архитектуру и правила «как дальше делать правильно».',
                result:
                  'прозрачный план работ, ориентиры по срокам и затратам, общий язык между бизнесом и разработкой.',
              },
              {
                step: 'Шаг 3:',
                title: 'Стабилизация и улучшения',
                headline: 'Убираем хаос: делаем проект надёжным и управляемым',
                text:
                  'Делаем то, что даёт максимальный эффект: исправляем критичные проблемы, повышаем стабильность, настраиваем мониторинг и резервные копии, приводим в порядок окружения, документацию и доступы.',
                result:
                  'стабильная работа, меньше аварий, понятная структура и контроль над проектом.',
              },
              {
                step: 'Шаг 4:',
                title: 'Сопровождение и развитие',
                headline: 'Развиваем проект без космических бюджетов и зависимости',
                text:
                  'Подключаюсь как IT-партнёр на регулярной основе (20–50 часов в месяц): планируем итерации, двигаем приоритеты, внедряем улучшения и новые функции. Вы видите прогресс и понимаете, за что платите.',
                result:
                  'предсказуемое развитие проекта, прозрачность задач и снижение зависимости от одного подрядчика.',
              },
            ].map((item) => (
              <motion.div
                key={item.step}
                variants={itemVariants}
                className="relative flex gap-6 pl-12"
              >
                {/* Маркер */}
                <div className="absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full border border-emerald-500/40 bg-[#0F1115]">
                  <div className="h-3.5 w-3.5 rounded-full bg-emerald-500" />
                </div>

                <div className="w-full">
                  {/* Step badge — увеличили */}
                  <div className="
                    inline-flex items-center gap-3
                    rounded-full
                    bg-slate-900/60
                    px-2 py-1
                    text-lg font-semibold
                    tracking-wide
                    text-slate-200
                    md:text-2xl
                    ">
                    <span className="text-emerald-400">{item.step}</span>
                    <span className="text-slate-50">{item.title}</span>
                  </div>

                  <h3 className="mt-4 text-lg font-semibold text-slate-100 md:text-xl">
                    {item.headline}
                  </h3>

                  <p className="mt-3 text-base leading-relaxed text-slate-300 md:text-lg">
                    {item.text}
                  </p>

                  {/* Highlight — как “карточка результата”, тоже крупнее */}
                  <p className="
                  mt-5 rounded-2xl 
                  border border-slate-700/40 
                  bg-slate-800/40 p-4 
                  text-base 
                  leading-relaxed 
                  text-slate-200 
                  md:text-xl">
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