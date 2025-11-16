// src/sections/home/IntroSection.tsx
'use client';

import { motion, type Variants } from 'framer-motion';

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
    <section className="bg-[#0F1115] text-slate-100">
      <div className="mx-auto max-w-3xl px-6 pb-24">
        <motion.div
          variants={introVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="space-y-4 text-base leading-relaxed text-slate-200 md:text-lg"
        >
          <p>
            <span className="font-medium text-slate-50">
              Я помогаю фаундерам, экспертам и малому бизнесу в Европе
            </span>{' '}
            превращать идеи в работающие цифровые продукты и устойчивую
            цифровую инфраструктуру.
          </p>
          <p>
            Вместе мы выбираем технологический путь, проектируем архитектуру,
            создаём MVP и выстраиваем вокруг него экосистему: от авторизации и
            платежей до интеграций и автоматизаций.
          </p>
          <p className="text-sm text-slate-400">
            Рабочие языки: русский, английский, немецкий. Базируюсь в регионе
            Аугсбурга (Германия), работаю полностью онлайн.
          </p>
        </motion.div>
      </div>
    </section>
  );
}