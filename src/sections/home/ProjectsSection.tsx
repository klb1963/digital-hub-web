// src/sections/home/ProjectsSection.tsx

'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { projects, type ProjectId } from '@/lib/projects';
import Link from 'next/link';

const tabsVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const previewVariants = {
  initial: { opacity: 0, y: 10, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -10, scale: 0.98 },
};

export function ProjectsSection() {
  const [activeId, setActiveId] = useState<ProjectId>('yachtpricer');
  const activeProject = projects.find((p) => p.id === activeId) ?? projects[0];

  const screenshots =
    activeProject.screenshots && activeProject.screenshots.length > 0
      ? activeProject.screenshots
      : [activeProject.image];

  const [screenIndex, setScreenIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setScreenIndex(0));
  }, [activeProject.id]);

  useEffect(() => {
    if (isHovered || screenshots.length <= 1) return;

    const id = setInterval(() => {
      setScreenIndex((prev) => (prev + 1) % screenshots.length);
    }, 5000);

    return () => clearInterval(id);
  }, [isHovered, screenshots.length]);

  return (
    <section id="projects" className="bg-neutral-950/95 py-28 text-neutral-50">
      <div className="mx-auto max-w-6xl xl:max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="mt-10 flex flex-col gap-10 md:mt-16 md:flex-row md:items-start">
          {/* LEFT */}
          <div className="w-full space-y-8 md:w-[28%]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-300">
                Projects &amp; Cases
              </p>

              <h2 className="mt-3 text-xl font-semibold leading-snug text-neutral-50 md:text-2xl">
                Практика работы с реальными ИТ-проектами
              </h2>

              <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-400 md:text-lg">
                Несколько проектов, в которых виден мой подход к работе с бизнесом.
              </p>
            </div>

            {/* Tabs */}
            <motion.div
              variants={tabsVariants}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4 }}
              className="space-y-2 rounded-2xl bg-neutral-900/80 p-2 ring-1 ring-neutral-800"
            >
              {projects.map((project) => {
                const isActive = project.id === activeId;

                return (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => setActiveId(project.id)}
                    className={`relative flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition ${
                      isActive ? 'bg-neutral-800/80' : 'hover:bg-neutral-900/80'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="project-tab-active"
                        className="absolute inset-y-1 left-1 w-[3px] rounded-full bg-emerald-400"
                      />
                    )}

                    <div className="ml-2 flex flex-col">
                      {/* не прыгаем md:text-xl — делаем стабильный стиль */}
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400 md:text-sm">
                        {project.title}
                      </span>
                      <span className="mt-1 text-sm font-medium text-neutral-50 md:text-base">
                        {project.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </motion.div>
          </div>

          {/* RIGHT */}
          <div className="w-full overflow-visible md:w-[72%] md:pr-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProject.id}
                variants={previewVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="
                  group relative w-full
                  rounded-3xl bg-neutral-900/90 p-6
                  shadow-[0_30px_80px_rgba(0,0,0,0.65)]
                  ring-1 ring-neutral-800/80
                  md:ml-6 lg:ml-10 xl:ml-12 2xl:ml-16
                  transition-transform duration-500 group-hover:scale-[1.01]
                "
              >
                {/* Text */}
                <div className="space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400 md:text-sm">
                    {activeProject.title}
                  </p>

                  <h3 className="text-xl font-semibold leading-snug text-neutral-50 md:text-2xl">
                    {activeProject.tagline}
                  </h3>

                  <p className="text-sm leading-relaxed text-neutral-300 md:text-lg">
                    {activeProject.description}
                  </p>

                  {/* Tags */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {activeProject.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-neutral-700 bg-neutral-900/80 px-3 py-1 text-xs text-neutral-300 md:text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Slider */}
                <div
                  className="mt-6"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <div className="flex justify-center">
                    <div className="relative aspect-[16/9] w-full max-w-[900px] overflow-hidden rounded-3xl border border-neutral-700/80 bg-neutral-950/90 shadow-2xl">
                      <Image
                        src={screenshots[screenIndex]}
                        alt={activeProject.title}
                        fill
                        className="h-full w-full object-cover object-top"
                        sizes="(min-width: 1024px) 900px, 100vw"
                      />
                      {/* лёгкий overlay, чтобы скрины не «выстреливали» по контрасту */}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-neutral-950/45 via-transparent to-transparent" />
                    </div>
                  </div>

                  {screenshots.length > 1 && (
                    <div className="mt-4 flex justify-center gap-2">
                      {screenshots.map((src, idx) => (
                        <button
                          key={src + idx}
                          type="button"
                          onClick={() => setScreenIndex(idx)}
                          className={`h-2.5 w-2.5 rounded-full transition ${
                            idx === screenIndex
                              ? 'scale-110 bg-emerald-400'
                              : 'bg-neutral-700 hover:bg-neutral-500'
                          }`}
                          aria-label={`Показать скриншот ${idx + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* CTA */}
                <div className="mt-6">
                  <Link
                    href={`/projects/${activeProject.id}`}
                    className="
                      inline-flex items-center rounded-full
                      border border-emerald-400/70 bg-emerald-500/10
                      px-5 py-2 text-base font-medium text-emerald-300
                      transition hover:bg-emerald-500/20
                    "
                  >
                    Подробнее о проекте
                    <span className="ml-1 text-lg leading-none">↗</span>
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}