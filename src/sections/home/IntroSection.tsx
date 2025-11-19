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
      <div className="mx-auto max-w-5xl px-4 pb-32 pt-10 sm:px-6 lg:px-8">
        <motion.div
          variants={introVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          {/* Карточка в стиле Tailwind Header Section */}
          <div
            className="
              relative overflow-hidden
              rounded-3xl border border-slate-800/80
              bg-slate-950/70
              px-6 py-10 sm:px-10 sm:py-12
              shadow-[0_18px_45px_rgba(0,0,0,0.75)]
            "
          >
            {/* Лёгкий цветовой градиент поверх фона */}
            <div
              className="
                pointer-events-none
                absolute inset-0
                bg-gradient-to-r
                from-sky-500/15 via-transparent to-purple-500/20
              "
            />

            {/* Основной контент интро */}
            <div className="relative space-y-5 text-base leading-relaxed text-slate-200 md:text-lg">
              <p>
                <span className="font-medium text-slate-50">
                  Я помогаю фаундерам, экспертам и малому бизнесу в Европе
                </span>{" "}
                превращать идеи в работающие цифровые продукты и устойчивую
                цифровую инфраструктуру.
              </p>

              <p>
                Вместе мы выбираем технологический путь, проектируем
                архитектуру, создаём MVP и выстраиваем вокруг него экосистему:
                от авторизации и платежей до интеграций и автоматизаций.
              </p>

              <p className="pt-3 text-sm text-slate-400">
                Рабочие языки: русский, английский, немецкий. Базируюсь в
                регионе Аугсбурга (Германия), работаю полностью онлайн.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}