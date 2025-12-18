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
    <section
      className="relative min-h-[70vh] overflow-hidden bg-[#05070B] text-slate-100"
    >
      {/* 🔹 Фоновое изображение с анимацией */}
      <div
        className="
          pointer-events-none
          absolute inset-0
          opacity-25
          hero-binary-bg
          hero-binary-animated
        "
      />

      {/* 🔹 Тёмная вуаль + градиент для читаемости текста */}
      <div
        className="
          pointer-events-none
          absolute inset-0
          bg-gradient-to-b
          from-black/70 via-black/50 to-black/80
        "
      />

      {/* Контент поверх подложки */}
      <div className="relative mx-auto max-w-6xl px-6 pt-8 pb-16 md:pt-32 md:pb-24">
        <div className="grid items-center gap-10 md:grid-cols-[minmax(0,1fr)_360px]">
          {/* LEFT: текст (всё твое — без изменений) */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-3xl"
          >
            {/* Имя Фамилия*/}
            <motion.h1
              variants={itemVariants}
              className="text-4xl font-semibold tracking-tight md:mt-0 md:text-5xl"
            >
              Леонид Кляйман
            </motion.h1>

            {/* Роль */}
            <motion.p
              variants={itemVariants}
              className="mt-4 text-xl text-slate-200 md:text-xl"
            >
              ИТ-консалтинг &amp; ИИ-инженерия
            </motion.p>

            {/* Позиционирование */}
            <motion.p
              variants={itemVariants}
              className="mt-4 text-2xl font-semibold leading-snug text-slate-300 md:text-3xl"
            >
              Цифровые продукты для личного бренда и бизнеса
            </motion.p>

            <motion.p
              variants={itemVariants}
              className="mt-4 text-base text-slate-400 md:text-xl"
            >
              Digital Platforms · MVP · AI Integration · CTO-as-a-service*
            </motion.p>

            {/* Steps */}
            <motion.div
              variants={itemVariants}
              className="mt-4 mb-4 space-y-1 text-lg md:text-xl"
            >
              <p className="text-slate-300 font-medium text-base md:text-xl">
                Веду вас:
              </p>
              <p className="text-slate-200 md:text-xl">→ от идеи и массы вопросов</p>
              <p className="text-slate-200 md:text-xl">
                → к понятной ИТ-архитектуре и сервисам
              </p>
              <p className="text-slate-200 md:text-xl">
                → к работающему прототипу (MVP) и продукту
              </p>
              <p className="text-slate-200 md:text-xl">
                → и, наконец, к вашей устойчивой цифровой экосистеме!
              </p>
            </motion.div>

            {/* CTA */}
            <motion.div variants={itemVariants} className="mt-4 mb-4">
              <DiscussIdeaDialog />
            </motion.div>

            {/* CTO-строка */}
            <motion.p
              variants={itemVariants}
              className="mt-4 text-xl italic text-slate-400"
            >
              с Вашим персональным ИТ-консультантом
            </motion.p>

            {/* Сноска CTO */}
            <motion.p
              variants={itemVariants}
              className="mt-4 max-w-xl text-sm leading-snug text-slate-500 md:text-base md:leading-normal"
            >
              * CTO — роль, отвечающая за архитектуру, стек используемых технологий, ИТ-процессы и
              технологическое развитие продукта.
            </motion.p>
          </motion.div>

          {/* RIGHT: фото (новое) */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="mx-auto w-full max-w-[320px] md:max-w-none"
          >
          <div
            className="
              relative
              h-[420px] w-[320px]
              overflow-hidden
              rounded-2xl
              bg-white
              shadow-xl
            "
          >
            <Image
              src="/images/hero/leonid-portrait-v2.jpg"
              alt="Леонид Кляйман"
              fill
              priority
              className="object-cover object-center"
            />

              {/* мягкий низ для «премиума» и читаемости рядом */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#05070B]/35 via-transparent to-transparent" />
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}