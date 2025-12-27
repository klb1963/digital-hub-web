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
          opacity-[0.02] md:opacity-[0.03]
          hero-binary-bg
          hero-binary-animated
        "
      />

      {/* Светлая вуаль для читаемости */}
      <div
        className="
          pointer-events-none
          absolute inset-0
          bg-gradient-to-b
          from-white/95 via-white/85 to-white/95
        "
      />

      {/* Контент поверх подложки */}
      <div className="relative mx-auto max-w-6xl px-6 pt-2 pb-16 md:pt-16 md:pb-24">
        <div className="grid items-center gap-10 md:grid-cols-[minmax(0,1fr)_360px]">
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

            {/* Роль */}
            <motion.p
              variants={itemVariants}
              className="mt-2 text-sm text-slate-600 md:text-base"
            >
              ИТ-консалтинг &amp; ИИ-инженерия
            </motion.p>

            {/* Позиционирование */}
            <motion.p
              variants={itemVariants}
              className="mt-2 text-2xl font-semibold leading-snug text-slate-800 md:text-3xl"
            >
              Ваш ИТ-мастер на все руки
            </motion.p>

            {/* Миссия / позиционирование */}
            <motion.p
              variants={itemVariants}
              className="mt-2 max-w-2xl text-base leading-relaxed text-slate-700 md:text-lg"
            >
              архитектор, разработчик, проджект-менеджер и ИИ-инженер в одном лице
            </motion.p> 

            {/* Why here and now */}
            <motion.div
              variants={itemVariants}
              className="
                mt-4 mb-4
                rounded-2xl
                border border-slate-200
                bg-white/70
                px-6 py-5
                shadow-sm
                backdrop-blur
                transition
                duration-200
                hover:-translate-y-1
                hover:bg-white/90
                hover:shadow-[0_18px_45px_rgba(15,23,42,0.12),0_6px_16px_rgba(15,23,42,0.08)]
              "
            >
              <div className="space-y-1">
                <p className="text-base leading-normal text-slate-700 md:text-lg">
                  Когда:
                </p>

                <p className="text-base leading-normal text-slate-700 md:text-lg">
                  → нужно срочно что-то запустить или реанимировать в Интернете,
                </p>

                <p className="text-base leading-normal text-slate-700 md:text-lg">
                  → при этом нет времени разбираться в технологиях и платформах,
                </p>

                <p className="text-base leading-normal text-slate-700 md:text-lg">
                  → и важно не ошибиться с архитектурой, а главное,  с подрядчиками,
                </p>

                <p className="text-base leading-normal text-slate-700 md:text-lg">
                  → при этом результат нужен был еще вчера,
                </p>

                <p className="text-base leading-normal text-slate-700 md:text-lg">
                  то можно сразу обратиться ко мне.
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
              Или просто обсудить ситуацию — первая консультация бесплатна.
            </motion.p>
          </motion.div>

          {/* RIGHT: фото */}
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

    ring-1 ring-black/5
    shadow-[0_18px_45px_rgba(15,23,42,0.18),0_6px_16px_rgba(15,23,42,0.12)]

    transition
    duration-200
    will-change-transform

    hover:-translate-y-1
    hover:ring-black/10
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

            {/* верхний мягкий блик */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-transparent" />

            {/* мягкий низ для гармонии со светлой темой */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent" />
            
          </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}