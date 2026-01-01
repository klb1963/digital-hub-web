// src/components/hero/HeroSkillsOrbit.tsx
"use client";

import { motion, type Variants } from "framer-motion";

type OrbitItem = {
  label: string;
  // desktop orbit position (percent of container)
  x: number;
  y: number;
};

const items: OrbitItem[] = [
  { label: "Архитектор", x: 18, y: 16 },
  { label: "Программист", x: 82, y: 16 },
  { label: "Менеджер проекта", x: 20, y: 52 },
  { label: "ИИ-инженер", x: 84, y: 52 },
  { label: "WEB-дизайнер", x: 22, y: 86 },
  { label: "Копирайтер", x: 82, y: 86 },
];

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const nodeVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

const centerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const lineVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

function DotIcon() {
  return (
    <span
      aria-hidden="true"
      className="h-2 w-2 shrink-0 rounded-full bg-[#06BE81]"
    />
  );
}

export function HeroSkillsOrbit() {
  // Layout notes:
  // - Desktop/tablet: absolute “orbit” with SVG connectors
  // - Mobile: stacked list with center card on top
  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="w-full"
    >
      {/* MOBILE */}
      <div className="md:hidden">
        <motion.div
          variants={centerVariants}
          className="
            rounded-2xl
            bg-white/80
            backdrop-blur
            ring-1 ring-black/5
            px-5 py-4
            shadow-[0_14px_34px_rgba(15,23,42,0.10)]
          "
        >
          <p className="text-sm font-semibold text-slate-900">Сайт</p>
          <p className="text-sm font-semibold text-slate-900">Приложение</p>
          <p className="mt-2 text-xs text-slate-600">
            Результат, к которому сходятся роли
          </p>
        </motion.div>

        <div className="mt-4 space-y-2">
          {items.map((it) => (
            <motion.div
              key={it.label}
              variants={nodeVariants}
              className="
                flex items-center gap-3
                rounded-xl
                bg-white/70
                backdrop-blur
                ring-1 ring-black/5
                px-4 py-3
              "
            >
              <DotIcon />
              <span className="text-sm font-medium text-slate-800">
                {it.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* DESKTOP / TABLET */}
      <div className="relative hidden md:block">
        {/* Aspect box */}
        <div className="relative mx-auto w-full max-w-[760px]">
          <div
            className="
              relative
              h-[420px]
              w-full
              rounded-3xl
              bg-white/40
              backdrop-blur
              ring-1 ring-black/5
              shadow-[0_18px_45px_rgba(15,23,42,0.08)]
              overflow-hidden
            "
          >
            {/* subtle background glow */}
            <div
              className="
                pointer-events-none absolute inset-0
                bg-[radial-gradient(circle_at_50%_45%,rgba(6,190,129,0.16),transparent_55%)]
              "
            />

            {/* CONNECTORS (SVG) */}
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {items.map((it) => (
                <motion.path
                  key={it.label}
                  variants={lineVariants}
                  d={`M 50 50 L ${it.x} ${it.y}`}
                  fill="none"
                  stroke="rgba(15,23,42,0.20)"
                  strokeWidth="0.55"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </svg>

            {/* CENTER */}
            <motion.div
              variants={centerVariants}
              className="
                absolute left-1/2 top-1/2
                -translate-x-1/2 -translate-y-1/2
              "
            >
              <div
                className="
                  rounded-2xl
                  bg-white/85
                  backdrop-blur
                  ring-1 ring-black/5
                  px-6 py-5
                  shadow-[0_16px_42px_rgba(15,23,42,0.12)]
                "
              >
                <div className="flex items-center gap-3">
                  <span className="h-9 w-9 rounded-xl bg-[#06BE81]/12 ring-1 ring-[#06BE81]/25 flex items-center justify-center">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#06BE81]" />
                  </span>
                  <div>
                    <p className="text-lg font-semibold text-slate-900 leading-tight">
                      Сайт
                    </p>
                    <p className="text-lg font-semibold text-slate-900 leading-tight">
                      Приложение
                    </p>
                    <p className="mt-1 text-xs text-slate-600">
                      Результат, к которому сходятся роли
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* NODES */}
            {items.map((it) => (
              <motion.div
                key={it.label}
                variants={nodeVariants}
                className="absolute"
                style={{
                  left: `${it.x}%`,
                  top: `${it.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div
                  className="
                    group
                    flex items-center gap-2
                    rounded-full
                    bg-white/80
                    backdrop-blur
                    ring-1 ring-black/5
                    px-4 py-2
                    shadow-[0_10px_26px_rgba(15,23,42,0.10)]
                    transition
                    hover:-translate-y-0.5
                    hover:shadow-[0_16px_40px_rgba(15,23,42,0.14)]
                  "
                >
                  <span className="h-2 w-2 rounded-full bg-[#06BE81]" />
                  <span className="whitespace-nowrap text-sm font-semibold text-slate-800">
                    {it.label}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}