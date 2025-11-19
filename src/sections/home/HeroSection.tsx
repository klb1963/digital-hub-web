// src/sections/home/HeroSection.tsx
"use client";

import { motion, type Variants } from "framer-motion";

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
      className="
        relative
        min-h-[80vh]
        overflow-hidden
        bg-[#05070B]
        text-slate-100
      "
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
            Leonid Kleimann
          </motion.h1>

          {/* Роль */}
          <motion.p
            variants={itemVariants}
            className="mt-3 text-xl text-slate-200 md:text-2xl"
          >
            Technology Architect &amp; Product Engineer
          </motion.p>

          {/* CTO-строка */}
          <motion.p
            variants={itemVariants}
            className="mt-1 text-sm italic text-slate-400"
          >
            CTO (Chief Technology Officer)*
          </motion.p>

          {/* Steps */}
          <motion.div
            variants={itemVariants}
            className="mt-8 space-y-2 text-base md:text-lg"
          >
            <p className="text-slate-300 font-medium">Веду:</p>
            <p className="text-slate-200">→ от идеи и первых вопросов</p>
            <p className="text-slate-200">→ к понятной архитектуре</p>
            <p className="text-slate-200">→ к работающему MVP</p>
            <p className="text-slate-200">
              → к вашей устойчивой цифровой экосистеме
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div variants={itemVariants} className="mt-8">
            <button
              className="
                inline-flex items-center justify-center
                rounded-full border border-slate-500/60
                px-6 py-2.5
                text-sm font-medium text-slate-50
                hover:border-slate-300 hover:bg-slate-50/5
                transition
              "
            >
              Обсудить идею
            </button>
          </motion.div>

          {/* Сноска CTO */}
          <motion.p
            variants={itemVariants}
            className="mt-10 max-w-xl text-xs leading-relaxed text-slate-500"
          >
            * CTO — роль, отвечающая за архитектуру, стек, процессы и
            технологическое развитие продукта.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}