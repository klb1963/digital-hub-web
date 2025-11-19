// src/sections/home/AIApproachSection.tsx
"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { useEffect, useState } from "react";

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

const aiImages = [
  {
    src: "/images/Human-and-AI-01.png",
    alt: "Инженер и AI работают с цифровым интерфейсом",
  },
  {
    src: "/images/Human-and-AI-02.png",
    alt: "Человек и AI обсуждают архитектуру продукта",
  },
  {
    src: "/images/Human-and-AI-03.png",
    alt: "Команда и AI в цифровом городе будущего",
  },
];  

export function AIApproachSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // случайный старт
    setCurrentIndex(Math.floor(Math.random() * aiImages.length));

    // авто-слайдер каждые 3 секунды
    const id = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % aiImages.length);
    }, 3000);

    return () => clearInterval(id);
  }, []);

  const currentImage = aiImages[currentIndex];

  return (
    <section className="bg-[#05070B] text-slate-100">
      <div className="mx-auto max-w-6xl px-4 pb-28 pt-28 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="
            relative overflow-hidden
            rounded-3xl border border-slate-800/80
            bg-gradient-to-br from-slate-950/90 via-slate-950/70 to-slate-950/90
            shadow-[0_24px_70px_rgba(0,0,0,0.80)]
          "
        >
          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.2fr)] lg:p-10">
            {/* Левая колонка: текст и пункты */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col justify-center space-y-6"
            >
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300/80">
                  AI в инженерном процессе
                </p>
                <h2 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
                  Искусственный интеллект как инженерный партнёр
                </h2>
                <p className="max-w-xl text-sm text-slate-400 sm:text-base">
                  Я не перекладываю работу на ИИ, а строю с ним совместный
                  инженерный процесс: человек отвечает за смысл и решения,
                  модели — за скорость, перебор вариантов и рутину.
                </p>
              </div>

              <div className="space-y-4 text-sm text-slate-200">
                {/* Пункт 1 */}
                <div className="flex gap-3">
                  <div className="mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500/20">
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="h-4 w-4 text-indigo-300"
                    >
                      <path
                        d="M5 12.5 9 16l10-10"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-50">
                      На всех этапах цикла
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-300 sm:text-sm">
                      Использую AI для проработки архитектуры, генерации и
                      ревью кода, анализа логов, подготовки документации и
                      технических текстов.
                    </p>
                  </div>
                </div>

                {/* Пункт 2 */}
                <div className="flex gap-3">
                  <div className="mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500/20">
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="h-4 w-4 text-indigo-300"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      />
                      <path
                        d="M12 8v4l2 2"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-50">
                      Фокус на качестве решений
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-300 sm:text-sm">
                      Модели помогают увидеть больше вариантов и быстрее прийти
                      к рабочему решению, но ответственность за архитектуру и
                      код остаётся на мне.
                    </p>
                  </div>
                </div>

                {/* Пункт 3 */}
                <div className="flex gap-3">
                  <div className="mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500/20">
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="h-4 w-4 text-indigo-300"
                    >
                      <path
                        d="M5 7h14v4H5zM5 13h8v4H5z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-50">
                      Практика, а не эксперименты
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-300 sm:text-sm">
                      AI — часть повседневного рабочего процесса, а не игрушка.
                      Он ускоряет MVP-цикл, но не подменяет инженерное мышление
                      и ответственность за результат.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

           {/* Правая колонка: иллюстрация */}
            <motion.div
            variants={itemVariants}
            className="relative mt-6 flex items-center justify-center lg:mt-0"
            >
            <div
                className="
                relative
                aspect-square
                w-[420px] lg:w-[520px]
                overflow-hidden
                rounded-2xl
                border border-slate-800/80
                bg-slate-900/60
                shadow-[0_18px_55px_rgba(15,23,42,0.95)]
                ai-glow-card
                "
            >
                <Image
                key={currentImage.src}
                src={currentImage.src}
                alt={currentImage.alt}
                fill
                className="object-cover transition-opacity duration-700"
                priority
                />

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-slate-950/70 via-transparent to-indigo-500/35" />
            </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}