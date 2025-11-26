// src/sections/home/ProjectsSection.tsx

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { projects, type Project, type ProjectId } from '@/lib/projects';
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
  const activeProject =
    projects.find((p) => p.id === activeId) ?? projects[0];

  return (
    <section
      id="projects"
      className="bg-neutral-950/95 py-28 text-neutral-50"
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Общий flex-контейнер для двух колонок */}
        <div className="mt-10 flex flex-col gap-10 md:mt-16 md:flex-row md:items-start">
          {/* Левая панель — заголовок + табы */}
          <div className="w-full md:w-[25%] space-y-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
                Projects & Cases
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-50 md:text-4xl">
                От идеи и эксперимента до работающих цифровых продуктов.
              </h2>
              <p className="mt-4 text-sm text-neutral-400 md:text-base">
                Несколько знаковых проектов, через которые виден мой подход
                к архитектуре, MVP и работе с бизнесом.
              </p>
            </div>

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
                    className={`relative flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition ${isActive
                        ? 'bg-neutral-800/80'
                        : 'hover:bg-neutral-900/80'
                      }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="project-tab-active"
                        className="absolute inset-y-1 left-1 w-[3px] rounded-full bg-emerald-400"
                      />
                    )}

                    <div className="ml-2 flex flex-col">
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
                        {project.title}
                      </span>
                      <span className="mt-1 text-sm font-medium text-neutral-50">
                        {project.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </motion.div>
          </div>

        {/* Правая панель — одна колонка, картинка под текстом */}
        <div className="w-full md:w-[75%] overflow-visible">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProject.id}
                variants={previewVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="group relative rounded-3xl bg-neutral-900/90 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.65)] ring-1 ring-neutral-800/80
                         md:ml-6 lg:ml-16 xl:ml-24 2xl:ml-32
                         md:w-[115%] lg:w-[135%] xl:w-[150%]
                         transition-transform duration-500 group-hover:scale-[1.01]"
              >
                {/* Текстовая часть */}
                <div className="space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
                    {activeProject.title}
                  </p>

                  <h3 className="text-2xl font-semibold text-neutral-50 md:text-3xl">
                    {activeProject.tagline}
                  </h3>

                  <p className="text-sm leading-relaxed text-neutral-300 md:text-[15px]">
                    {activeProject.description}
                  </p>

                  {/* Теги */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {activeProject.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-neutral-700 bg-neutral-900/80 px-3 py-1 text-xs text-neutral-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Картинка во всю ширину карточки, под текстом */}
                <div className="mt-6">
                  <div
                    className="relative w-full aspect-[16/9] overflow-hidden rounded-3xl border border-neutral-700/80 bg-neutral-950/90 shadow-2xl"
                  >
                    <Image
                      src={activeProject.image}
                      alt={activeProject.title}
                      fill
                      className="h-full w-full object-cover object-top object-left"
                      sizes="(min-width: 1024px) 700px, 100vw"
                    />
                  </div>
                </div>

                {/* CTA под картинкой */}
                {activeProject.href && (
                  <div className="mt-5">
                    <Link
                      href={activeProject.href}
                      className="inline-flex items-center rounded-full border border-emerald-400/70 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-300 transition hover:bg-emerald-500/20"
                    >
                      Подробнее о проекте
                      <span className="ml-1 text-lg leading-none">↗</span>
                    </Link>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>


        </div>
      </div>
    </section>
  );
}