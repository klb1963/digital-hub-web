"use client";

import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";

const words = ["архитектор", "разработчик", "проджект-менеджер", "ИИ-инженер"];

const listVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
    },
  },
};

const wordVariants: Variants = {
  hidden: { opacity: 0, x: -80 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export function HeroSectionNew() {
  const [phase, setPhase] = useState<"words" | "merge" | "final">("words");

  useEffect(() => {
    // примерная длительность: 4 слова * 0.18s стаггер + 0.55s анимация + пауза
    const tMerge = window.setTimeout(() => setPhase("merge"), 4 * 180 + 550 + 200);
    const tFinal = window.setTimeout(() => setPhase("final"), 4 * 180 + 550 + 450);

    return () => {
      window.clearTimeout(tMerge);
      window.clearTimeout(tFinal);
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-6xl px-6 pt-6 pb-16 md:pt-16 md:pb-24">
        <div className="grid items-center gap-10 md:grid-cols-[minmax(0,1fr)_360px]">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
              Леонид Кляйман
            </h1>

            {/* Слова */}
            <div className="relative mt-4">
              <motion.div
                variants={listVariants}
                initial="hidden"
                animate="visible"
                className="relative"
              >
                {words.map((w) => (
                  <motion.div
                    key={w}
                    variants={wordVariants}
                    // в merge — сжимаем/гасим (можно сделать одинаковую “склейку”)
                    animate={
                      phase === "merge"
                        ? { opacity: 0, scale: 0.94, y: -2 }
                        : undefined
                    }
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="mb-2 text-3xl font-semibold leading-tight text-slate-800 md:text-4xl"
                  >
                    {w}
                  </motion.div>
                ))}
              </motion.div>

              {/* Финальная фраза */}
              <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 6 }}
                animate={
                  phase === "final"
                    ? { opacity: 1, scale: 1, y: 0 }
                    : { opacity: 0, scale: 0.98, y: 6 }
                }
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="mt-1 text-3xl font-semibold leading-snug text-slate-800 md:text-4xl"
              >
                ваш персональный ИТ-мастер
              </motion.div>
            </div>

            <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-700 md:text-lg">
              архитектор, разработчик, проджект-менеджер и ИИ-инженер в одном лице
            </p>
          </div>

          <div className="hidden md:block">{/* фото/блок справа */}</div>
        </div>
      </div>
    </section>
  );
}