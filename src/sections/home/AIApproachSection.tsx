// src/sections/home/AIApproachSection.tsx
"use client";

import Image from "next/image";
import { motion, type Variants, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

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

// ─────────────────────────────────────────────
// Slider: autoplay, fade + лёгкий zoom, swipe, pause on hover
// ─────────────────────────────────────────────

const slideVariants: Variants = {
  enter: (direction: number) => ({
    opacity: 0,
    scale: 1.04,
    x: direction > 0 ? 40 : -40,
  }),
  center: {
    opacity: 1,
    scale: 1,
    x: 0,
  },
  exit: (direction: number) => ({
    opacity: 0,
    scale: 0.98,
    x: direction > 0 ? -40 : 40,
  }),
};

function AISlider() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const imageCount = aiImages.length;

  const goTo = useCallback(
    (nextDirection: number) => {
      setDirection(nextDirection);
      setIndex((prev) => (prev + nextDirection + imageCount) % imageCount);
    },
    [imageCount],
  );

  useEffect(() => {
    // random старт
    setIndex(Math.floor(Math.random() * imageCount));
  }, [imageCount]);

  useEffect(() => {
    if (isHovered) return;

    const id = setInterval(() => {
      goTo(1);
    }, 5000);

    return () => clearInterval(id);
  }, [isHovered, goTo]);

  return (
    <motion.div
      className="
        relative aspect-square w-full max-w-[22rem] sm:max-w-[24rem] lg:max-w-[32rem]
        overflow-hidden
        rounded-2xl
        border border-slate-800/60
        bg-slate-900/40
        shadow-[0_18px_45px_rgba(0,0,0,0.75)]
      "
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={aiImages[index].src}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            duration: 1.2,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="absolute inset-0"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.18}
          onDragEnd={(_event, info) => {
            const offsetX = info.offset.x;
            const velocityX = info.velocity.x;

            if (Math.abs(offsetX) < 40 && Math.abs(velocityX) < 200) {
              return;
            }

            if (offsetX < 0) {
              goTo(1);
            } else {
              goTo(-1);
            }
          }}
        >
          <Image
            src={aiImages[index].src}
            alt={aiImages[index].alt}
            fill
            priority
            className="object-cover"
          />

          {/* overlay в стиле ODH (без индиго) */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-slate-950/70 via-transparent to-sky-500/20" />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Main section
// ─────────────────────────────────────────────

export function AIApproachSection() {
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
            bg-slate-950/70
            shadow-[0_18px_45px_rgba(0,0,0,0.75)]
          "
        >
          {/* ODH card gradient (same as Intro/Focus) */}
          <div className="
            pointer-events-none
            absolute inset-0
            bg-gradient-to-br
            from-purple-500/10
            via-slate-900/40
            to-sky-500/10
            opacity-90
          " 
          />

          <div className="relative grid min-w-0 gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.2fr)] lg:p-10">
            {/* Left: text */}
            <motion.div
              variants={itemVariants}
              className="min-w-0 flex flex-col justify-center space-y-6"
            >
              <div className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                  AI в инженерном процессе
                </p>

                <h2 className="text-3xl font-semibold text-slate-50">
                  Искусственный интеллект — мой инженерный партнёр
                </h2>

                <p className="mt-2 max-w-xl text-base text-slate-400 md:text-lg">
                  Я не перекладываю работу на ИИ, а строю с ним совместный
                  инженерный процесс: человек отвечает за смысл и решения,
                  модели — за скорость, перебор вариантов и рутину.
                </p>
              </div>

              {/* Points */}
              <div className="space-y-4 text-base text-slate-200">
                {/* Point 1 */}
                <div className="flex gap-3">
                  <div className="mt-1 flex h-7 w-7 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10">
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="h-6 w-6 text-emerald-300"
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
                    <p className="mt-1 text-sm leading-normal text-slate-300 md:text-base">
                      Использую AI для проработки архитектуры, генерации и
                      ревью кода, анализа логов, подготовки документации и
                      технических текстов.
                    </p>
                  </div>
                </div>

                {/* Point 2 */}
                <div className="flex gap-3">
                  <div className="mt-1 flex h-7 w-7 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10">
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="h-6 w-6 text-emerald-300"
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
                    <p className="mt-1 text-sm leading-normal text-slate-300 md:text-base">
                      Модели помогают увидеть больше вариантов и быстрее прийти
                      к рабочему решению, но ответственность за архитектуру и
                      код остаётся на мне.
                    </p>
                  </div>
                </div>

                {/* Point 3 */}
                <div className="flex gap-3">
                  <div className="mt-1 flex h-7 w-7 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10">
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="h-6 w-6 text-emerald-300"
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
                    <p className="mt-1 text-sm leading-normal text-slate-300 md:text-base">
                      AI — часть повседневного рабочего процесса, а не игрушка.
                      Он ускоряет MVP-цикл, но не подменяет инженерное мышление
                      и ответственность за результат.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: slider */}
            <motion.div
              variants={itemVariants}
              className="relative mt-6 flex items-center justify-center lg:mt-0"
            >
              <AISlider />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}