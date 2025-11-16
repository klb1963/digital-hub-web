// src/sections/home/AIApproachSection.tsx
'use client';

import { motion, type Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
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

export function AIApproachSection() {
  return (
    <section className="bg-[#0F1115] text-slate-100">
      <div className="mx-auto max-w-5xl px-6 pb-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Заголовок секции */}
          <motion.h2
            variants={itemVariants}
            className="text-xl font-semibold tracking-tight text-slate-50 md:text-2xl"
          >
            Искусственный интеллект как инженерный партнёр
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="mt-3 max-w-2xl text-sm text-slate-400 md:text-base"
          >
            Я не перекладываю работу на ИИ, а строю с ним совместный инженерный
            процесс: человек отвечает за смысл и решения, модели&nbsp;— за
            скорость, перебор вариантов и рутину.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-6 grid gap-6 md:grid-cols-3"
          >
            <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-5 text-sm text-slate-200">
              <h3 className="text-sm font-semibold text-slate-50 md:text-base">
                На всех этапах цикла
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-slate-300 md:text-sm">
                Использую AI для проработки архитектуры, генерации и ревью кода,
                анализа логов, подготовки документации и технических текстов.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-5 text-sm text-slate-200">
              <h3 className="text-sm font-semibold text-slate-50 md:text-base">
                Фокус на качестве решений
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-slate-300 md:text-sm">
                Модели помогают увидеть больше вариантов и быстрее прийти к
                рабочему решению, но ответственность за архитектуру и код
                остаётся на мне.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-5 text-sm text-slate-200">
              <h3 className="text-sm font-semibold text-slate-50 md:text-base">
                Практика, а не эксперименты
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-slate-300 md:text-sm">
                AI&nbsp;— часть повседневного рабочего процесса, а не игрушка.
                Он ускоряет MVP-цикл, но не подменяет инженерное мышление и
                ответственность за результат.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}