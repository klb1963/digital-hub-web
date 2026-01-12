// src/sections/home/HeroSection.tsx

"use client";

import { motion, type Variants } from "framer-motion";
import { DiscussIdeaDialog } from "@/components/contact/DiscussIdeaDialog";
import Image from "next/image";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function HeroSection() {
  return (
    <section className="relative min-h-[70vh] overflow-hidden bg-slate-50 text-slate-900">
      {/* Фоновое изображение (очень легкое) */}
      <div
        className="
          pointer-events-none
          absolute inset-0
          opacity-[0.05] md:opacity-[0.09]
          hero-binary-bg
          hero-binary-animated
        "
      />

      {/* Анимированная линия */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="
            absolute -inset-x-10 h-[3px]
            bg-[#06BA7E]/60
            blur-[0.5px]
            will-change-[top,opacity]
            animate-scan
          "
        />
      </div>

      {/* Светлая вуаль для читаемости 
      <div
        className="
          pointer-events-none
          absolute inset-0
          bg-gradient-to-b
          from-white/95 via-white/85 to-white/95
        "
      /> */}

      {/* Контент поверх подложки */}
      <div className="relative mx-auto max-w-6xl px-6 pt-4 pb-16 md:pt-16 md:pb-24">
        <div className="grid items-center gap-10 md:grid-cols-[minmax(0,1fr)_420px]">
          {/* LEFT */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-3xl"
          >
            {/* Имя Фамилия */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl font-semibold tracking-tight text-slate-900 md:mt-0 md:text-5xl"
            >
              Леонид Кляйман
            </motion.h1>

            {/* Роль / категория */}
            <motion.p
              variants={itemVariants}
              className="mt-2 text-sm text-slate-600 md:text-base"
            >
              IT-партнёр для владельцев бизнеса
            </motion.p>

            {/* Заголовок */}
            <motion.p
              variants={itemVariants}
              className="mt-2 text-2xl font-semibold leading-snug text-slate-800 md:text-3xl"
            >
              Берусь за существующие ИТ-проекты и привожу их в порядок
            </motion.p>

            {/* Подзаголовок */}
            <motion.p
              variants={itemVariants}
              className="mt-3 max-w-2xl text-base leading-relaxed text-slate-800 md:text-lg"
            >
              Помогаю владельцам бизнеса разобраться, стабилизировать и развивать сайты,
              интернет-магазины и внутренние ИТ-системы — без космических бюджетов и зависимости
              от одного программиста или агентства.
            </motion.p>

            {/* Микрострока формата */}
            <motion.p
              variants={itemVariants}
              className="mt-3 text-sm text-slate-700 md:text-base"
            >
              <span className="font-semibold text-slate-900">
                Формат работы:
              </span>{' '}
              20–50 часов в месяц · 60 €/час · без долгосрочных контрактов
            </motion.p>

            {/* Входной оффер */}
            <motion.div
              variants={itemVariants}
              className="
                relative
                mt-5 mb-4
                overflow-hidden
                rounded-2xl
                bg-white/70
                px-6 py-5
                ring-1 ring-slate-200/70
                shadow-[0_10px_28px_rgba(15,23,42,0.08)]
                backdrop-blur
                transition
                duration-200
                hover:-translate-y-1
                hover:bg-white/90
                hover:shadow-[0_18px_45px_rgba(15,23,42,0.12),0_6px_16px_rgba(15,23,42,0.08)]
              "
            >
              {/* left accent bar */}
              <span
                aria-hidden="true"
                className="absolute left-0 top-0 h-full w-[3px] bg-[#06BE81]"
              />

              <div className="space-y-2">
                <p className="text-base font-semibold leading-normal text-slate-900 md:text-lg">
                  ИТ-диагностика проекта
                </p>

                <p className="text-base leading-normal text-slate-700 md:text-lg">
                  2 часа консультации · выводы · план дальнейших шагов
                </p>

                <p className="text-sm leading-relaxed text-slate-600 md:text-base">
                  Разберём текущую ситуацию, найдём узкие места и риски, наметим приоритеты —
                  чтобы вы понимали, что делать дальше и сколько это может стоить.
                </p>
                <p className="text-sm leading-relaxed text-slate-600 md:text-base">
                  Начинаем с ИТ-диагностики — и {' '}
                  <span className="font-semibold text-[#04A974]">
                    шаг за шагом идём c нуля до результата за адекватный бюджет.
                  </span>
                </p>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div variants={itemVariants} className="mt-6 mb-6">
              <DiscussIdeaDialog />
            </motion.div>

            {/* Микротекст под CTA */}
            <motion.p
              variants={itemVariants}
              className="mt-3 text-sm text-slate-600 md:text-base"
            >
              Напишите пару строк о проекте, будем разбираться.
              <br />
              <p className="mt-2 text-sm italic font-bold leading-relaxed text-slate-900 md:text-base">
                ИТ-диагностика делается бесплатно и ни к чему не обязывает.
              </p>
            </motion.p>
          </motion.div>

          {/* RIGHT: banner + фото */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="mx-auto w-full space-y-12 md:max-w-none"
          >
            {/* БАННЕР */}
            <div
              className="
              relative
              overflow-hidden
              rounded-2xl
              border border-emerald-200/60
              bg-white/70
              p-5
              backdrop-blur

              shadow-[0_18px_45px_rgba(15,23,42,0.18),0_6px_16px_rgba(15,23,42,0.12)]
              ring-1 ring-black/5

              transition
              duration-200
              will-change-transform
              hover:-translate-y-1
              hover:shadow-[0_26px_65px_rgba(15,23,42,0.22),0_10px_24px_rgba(15,23,42,0.16)]
              "
            >
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#06BA7E]/20 blur-2xl" />
              <div className="pointer-events-none absolute -left-12 -bottom-12 h-40 w-40 rounded-full bg-[#06BA7E]/10 blur-2xl" />

              <div className="inline-flex items-center gap-2 rounded-full bg-[#06BA7E]/10 px-3 py-1 text-xs font-semibold text-[#047a56]">
                <span className="h-2 w-2 rounded-full bg-[#06BA7E]" />
                2 минуты · бесплатно
              </div>

              <div className="mt-3 flex items-start gap-3">
                <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#06BA7E] text-white shadow-md">
                  <span className="text-lg">🧭</span>
                </div>

                <div className="space-y-2">
                  <div className="text-base font-semibold text-slate-900">
                    IT-тест для владельцев бизнеса
                  </div>

                  <div className="text-sm text-slate-700">
                    За 2 минуты поймёте: <span className="font-semibold">ИТ под контролем</span> —
                    или система держится «на честном слове».
                  </div>

                  <a
                    href="/it-worries-test"
                    className="
                    inline-flex items-center justify-center
                    rounded-xl
                    bg-[#06BA7E]
                    px-5 py-3
                    text-sm font-semibold
                    text-white
                    shadow-[0_12px_25px_rgba(6,186,126,0.35)]
                    hover:bg-[#06BA7E]/90
                    transition
                  "
                  >
                    Пройти тест →
                  </a>
                </div>
              </div>
            </div>

            {/* ФОТО */}
            <div
              className="
              relative
              h-[420px] w-full
              overflow-hidden
              rounded-2xl
              bg-white/70
              backdrop-blur-md
              ring-1 ring-black/5
              shadow-[0_18px_45px_rgba(15,23,42,0.18),0_6px_16px_rgba(15,23,42,0.12)]
              transition duration-200 will-change-transform
              hover:-translate-y-1 hover:ring-black/10
              hover:shadow-[0_26px_65px_rgba(15,23,42,0.22),0_10px_24px_rgba(15,23,42,0.16)]
            "
            >
              <Image
                src="/images/hero/leonid-portrait-v3.png"
                alt="Леонид Кляйман"
                fill
                priority
                className="object-cover object-center"
              />

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-transparent" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent" />
            </div>
          </motion.div>



        </div>
      </div>
    </section>
  );
}