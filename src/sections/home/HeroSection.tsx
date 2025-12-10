// src/sections/home/HeroSection.tsx

"use client";

import { motion, type Variants } from "framer-motion";
import { DiscussIdeaDialog } from "@/components/contact/DiscussIdeaDialog";


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
    className="relative min-h-[70vh] 
    overflow-hidden bg-[#05070B] text-slate-100"
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
      <div className="relative mx-auto flex max-w-3xl flex-col justify-center px-6 pt-32 pb-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Имя */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl font-semibold tracking-tight md:text-5xl"
          >
            Леонид Кляйман
          </motion.h1>

          {/* Роль */}
          <motion.p
            variants={itemVariants}
            className="mt-6 text-xl text-slate-200 md:text-xl"
          >
            Цифровые решения для бизнеса &amp; AI-инженерия
          </motion.p>

           {/* Позиционирование */}
          <motion.p
            variants={itemVariants}
            className="mt-4 text-2xl md:text-3xl font-semibold text-slate-300 leading-snug"
          >
            Запускаю вместе с предпринимателями цифровые продукты для роста бизнеса
          </motion.p>

          <motion.p
            variants={itemVariants}
            className="mt-4 text-base text-slate-400 md:text-xl"
          >
            Digital Platforms · MVP · AI Integration  · CTO-as-a-service
          </motion.p>

          {/* Steps */}
          <motion.div
            variants={itemVariants}
            className="mt-8 mb-4 space-y-2 text-lg md:text-xl"
          >
            <p className="text-slate-300 font-medium text-base md:text-xl">Веду как сталкер:</p>
            <p className="text-slate-200 md:text-xl">→ от идеи и массы вопросов</p>
            <p className="text-slate-200 md:text-xl">→ к понятной ИТ-архитектуре и сервисам</p>
            <p className="text-slate-200 md:text-xl">→ к работающему прототипу (MVP) и продукту</p>
            <p className="text-slate-200 md:text-xl">
              → к вашей устойчивой цифровой экосистеме!
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div variants={itemVariants} className="mt-10 mb-6">
            {/* Главная CTA-кнопка, открывающая модалку */}
            <DiscussIdeaDialog />
          </motion.div>

          {/* CTO-строка */}
          <motion.p
            variants={itemVariants}
            className="mt-4 text-xl italic text-slate-400"
          >
            с Вашим персональным CTO *
          </motion.p>

          {/* Сноска CTO */}
          <motion.p
            variants={itemVariants}
            className="mt-4 max-w-xl text-lg leading-relaxed text-slate-500"
          >
            * CTO — роль, отвечающая за архитектуру, стек используемых технологий, ИТ-процессы и
            технологическое развитие продукта.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}