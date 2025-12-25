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

// Slider
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
        border border-slate-200
        bg-white/70
        ring-1 ring-black/5
        shadow-[0_18px_45px_rgba(15,23,42,0.12),0_6px_16px_rgba(15,23,42,0.08)]
        backdrop-blur
        transition duration-200 will-change-transform
        hover:-translate-y-1
        hover:bg-white/90
        hover:shadow-[0_26px_65px_rgba(15,23,42,0.14),0_10px_24px_rgba(15,23,42,0.10)]
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

            if (Math.abs(offsetX) < 40 && Math.abs(velocityX) < 200) return;

            if (offsetX < 0) goTo(1);
            else goTo(-1);
          }}
        >
          <Image
            src={aiImages[index].src}
            alt={aiImages[index].alt}
            fill
            priority
            className="object-cover"
          />

          {/* мягкий overlay: лёгкий брендовый тон без "ночного кибера" */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-emerald-500/10" />
          {/* чуть затемняем низ, чтобы картинка воспринималась “премиальнее” */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/35 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

export function AIApproachSection() {
  return (
    <section className="bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-6xl px-4 pb-28 pt-28 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="
            relative overflow-hidden
            rounded-3xl
            border border-slate-200
            bg-white/70
            ring-1 ring-black/5
            shadow-[0_18px_45px_rgba(15,23,42,0.12),0_6px_16px_rgba(15,23,42,0.08)]
            backdrop-blur
          "
        >
          {/* мягкий “ODH” градиент (светлый) */}
          <div
            className="
              pointer-events-none
              absolute inset-0
              bg-gradient-to-br
              from-emerald-500/10
              via-white/40
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
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                  AI в инженерном процессе
                </p>

                <h2 className="text-3xl font-semibold text-slate-900">
                  Искусственный интеллект — мой инженерный партнёр
                </h2>

                <p className="mt-2 max-w-xl text-base text-slate-700 md:text-lg">
                  Я не перекладываю работу на ИИ, а строю с ним совместный
                  инженерный процесс: человек отвечает за смысл и решения,
                  модели — за скорость, перебор вариантов и рутину.
                </p>
              </div>

              {/* Points */}
              <div className="space-y-4 text-base text-slate-700">
                {/* Point 1 */}
                <div className="flex gap-3">
                  <div className="mt-1 flex h-7 w-7 items-center justify-center rounded-full border border-[#06BE81]/30 bg-[#06BE81]/10">
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="h-5 w-5 text-[#06BE81]"
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
                    <p className="font-semibold text-slate-900">
                      На всех этапах цикла
                    </p>
                    <p className="mt-1 text-sm leading-normal text-slate-700 md:text-base">
                      Использую AI для проработки архитектуры, генерации и
                      ревью кода, анализа логов, подготовки документации и
                      технических текстов.
                    </p>
                  </div>
                </div>

                {/* Point 2 */}
                <div className="flex gap-3">
                  <div className="mt-1 flex h-7 w-7 items-center justify-center rounded-full border border-[#06BE81]/30 bg-[#06BE81]/10">
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="h-5 w-5 text-[#06BE81]"
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
                    <p className="font-semibold text-slate-900">
                      Фокус на качестве решений
                    </p>
                    <p className="mt-1 text-sm leading-normal text-slate-700 md:text-base">
                      Модели помогают увидеть больше вариантов и быстрее прийти
                      к рабочему решению, но ответственность за архитектуру и
                      код остаётся на мне.
                    </p>
                  </div>
                </div>

                {/* Point 3 */}
                <div className="flex gap-3">
                  <div className="mt-1 flex h-7 w-7 items-center justify-center rounded-full border border-[#06BE81]/30 bg-[#06BE81]/10">
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="h-5 w-5 text-[#06BE81]"
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
                    <p className="font-semibold text-slate-900">
                      Практика, а не эксперименты
                    </p>
                    <p className="mt-1 text-sm leading-normal text-slate-700 md:text-base">
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