// src/sections/home/AboutMeSection.tsx
'use client';

import Image from 'next/image';
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

export function AboutMeSection() {
  return (
    <section className="bg-[#0F1115] text-slate-100 py-24">
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
            Обо мне
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="mt-4 max-w-3xl text-base leading-relaxed text-slate-200 md:text-lg"
          >
            Я — IT-партнёр для владельцев бизнеса: подключаюсь к существующим
            сайтам, Интернет-магазинам и внутренним системам, навожу порядок и
            помогаю развивать их без зависимости от одного подрядчика.
          </motion.p>

          {/* Двухколоночный блок */}
          <motion.div
            variants={itemVariants}
            className="mt-12 grid items-start gap-10 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1.4fr)]"
          >
            {/* Левая колонка: карточка с фото */}
            <div className="rounded-3xl bg-white p-6 shadow-[0_18px_45px_rgba(0,0,0,0.12)] ring-1 ring-black/5 md:p-7">
              {/* Portrait card with hover lift like Hero */}
              <div
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-3xl
                  bg-white
                  ring-1 ring-black/5
                  shadow-[0_18px_45px_rgba(15,23,42,0.18),0_6px_16px_rgba(15,23,42,0.12)]
                  transition
                  duration-200
                  will-change-transform
                  hover:-translate-y-1
                  hover:shadow-[0_26px_65px_rgba(15,23,42,0.22),0_10px_24px_rgba(15,23,42,0.16)]
                "
              >
                <div className="relative h-[360px] w-full">
                  <Image
                    src="/images/avatar-03.png"
                    alt="Leonid Kleimann"
                    fill
                    sizes="(max-width: 768px) 100vw, 360px"
                    className="object-cover object-center"
                    priority={false}
                  />

                  {/* верхний мягкий блик */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-transparent" />
                  {/* мягкий низ */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500">
                  Леонид Кляйман
                </p>

                <p className="text-lg font-semibold text-slate-900 md:text-xl">
                  IT-партнёр для владельцев бизнеса
                </p>

                <p className="text-base leading-relaxed text-slate-700 md:text-lg">
                  Диагностика → порядок → стабильное развитие. Работаю руками:
                  архитектура, код, инфраструктура, CI/CD.
                </p>

                <div className="mt-5 rounded-2xl bg-slate-50 p-4 ring-1 ring-black/5">
                  <p className="text-base leading-relaxed text-slate-700 md:text-lg">
                    <span className="font-semibold text-slate-900">
                      Формат работы:
                    </span>{' '}
                    20–50 часов в месяц · 60 €/час · без долгосрочных контрактов
                  </p>
                </div>
              </div>
            </div>

            {/* Правая колонка: три акцента */}
            <div className="space-y-6">
              <div className="rounded-2xl bg-white p-6 shadow-[0_12px_34px_rgba(0,0,0,0.10)] ring-1 ring-black/5">
                <h3 className="text-lg font-semibold text-slate-900 md:text-xl">
                  20+ лет опыта и инженерный подход
                </h3>
                <p className="mt-3 text-base leading-relaxed text-slate-700 md:text-lg">
                  Я работал инженером, архитектором и руководителем проектов —
                  поэтому умею одновременно видеть детали и общую картину. Моя
                  цель — понятные решения, которые выдерживают реальную
                  эксплуатацию, а не «красивые презентации».
                </p>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-[0_12px_34px_rgba(0,0,0,0.10)] ring-1 ring-black/5">
                <h3 className="text-lg font-semibold text-slate-900 md:text-xl">
                  Подключаюсь к чужим проектам и возвращаю контроль
                </h3>
                <p className="mt-3 text-base leading-relaxed text-slate-700 md:text-lg">
                  Разбираюсь в текущем состоянии: код, платформа, интеграции,
                  доступы, хостинг, процессы. Фиксирую риски и приоритеты,
                  документирую решения и делаю проект управляемым для владельца —
                  чтобы вы могли менять исполнителей без паники и потерь.
                </p>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-[0_12px_34px_rgba(0,0,0,0.10)] ring-1 ring-black/5">
                <h3 className="text-lg font-semibold text-slate-900 md:text-xl">
                  Делаю руками: разработка, инфраструктура и CI/CD
                </h3>
                <p className="mt-3 text-base leading-relaxed text-slate-700 md:text-lg">
                  Я не только советую — я делаю своими руками: исправления в
                  коде, настройку виртуальных серверов, установка Docker и
                  программ, деплой, домены, сертификаты, мониторинг, бэкапы и
                  автоматизация релизов. При необходимости могу работать вместе
                  с вашей командой или подрядчиком и выстроить понятный процесс.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}