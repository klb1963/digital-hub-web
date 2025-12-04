// src/sections/home/CtaSection.tsx
'use client';

import { motion, type Variants } from 'framer-motion';
import { DiscussIdeaDialog } from '@/components/contact/DiscussIdeaDialog';

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function CtaSection() {
  return (
    <section className="bg-[#0F1115] text-slate-100">
      <div className="mx-auto max-w-5xl px-6 pb-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="rounded-3xl border border-slate-800 bg-slate-900/30 px-6 py-10 text-center shadow-[0_0_40px_rgba(0,0,0,0.45)] md:px-10 md:py-14"
        >
          <h2 className="text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
            Есть идея или проект, который нужно воплотить в цифровую реальность?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-300 md:text-lg">
            Давайте обсудим ваши задачи, ограничения и возможный путь: от
            первых решений по архитектуре до MVP и устойчивой цифровой
            экосистемы вокруг продукта.
          </p>

          <div className="mt-10 flex justify-center">
            <DiscussIdeaDialog />
          </div>

          <p className="mt-8 text-lg text-slate-500">
            Формат — короткий созвон или онлайн-сессия. Без обязательств, с
            фокусом на ясность и следующие шаги.
          </p>
        </motion.div>
      </div>
    </section>
  );
}