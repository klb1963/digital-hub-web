// src/sections/home/FocusSection.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, type Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
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

type FocusItemId = 'audience' | 'services' | 'formats';

const focusItems: {
  id: FocusItemId;
  label: string;
  category: string;
  summary: string;
  title: string;
  imageSrc: string;
  imageAlt: string;
  bullets: string[];
}[] = [
  {
    id: 'audience',
    label: 'Кому подойдёт',
    category: 'Для кого я работаю',
    summary: 'Фаундерам, экспертам и малому бизнесу в Европе',
    title: 'Фаундерам, экспертам и малому бизнесу в Европе',
    imageSrc: '/images/focus/focus-audience.jpg',
    imageAlt: 'Цифровой блокнот с контактами и идеями продукта',
    bullets: [
      'Фаундерам с идеей, но без технического партнёра.',
      'Малый и средний бизнес, который вырос из Excel и формочек.',
      'Экспертам и консультантам, которым нужна своя платформа.',
    ],
  },
  {
    id: 'services',
    label: 'Чем могу помочь',
    category: 'Задачи',
    summary: 'От MVP и архитектуры до цифрового хаба вокруг продукта',
    title: 'От первых скетчей до архитектуры и MVP',
    imageSrc: '/images/focus/focus-services.jpg',
    imageAlt: 'Схема архитектуры и интерфейсы продукта',
    bullets: [
      'Помогаю сформулировать MVP так, чтобы его можно было реально собрать.',
      'Проектирую архитектуру, выбираю стек, помогаю команде стартовать без хаоса.',
      'Строю вокруг продукта цифровой хаб: аутентификация, оплата, коммуникация, автоматизация.',
    ],
  },
  {
    id: 'formats',
    label: 'Форматы работы',
    category: 'Как мы можем сотрудничать',
    summary: 'Гибкие форматы: от проекта под ключ до CTO-наставника',
    title: 'Гибкие форматы — от проекта под ключ до CTO-наставника',
    imageSrc: '/images/focus/focus-formats.jpg',
    imageAlt: 'Рабочее место с ноутбуком и заметками по проекту',
    bullets: [
      'Проектная работа под ключ с понятными этапами и результатами.',
      'Архитектурный менторинг для существующей команды разработки.',
      'Долгосрочное сопровождение: эволюция продукта и цифровой инфраструктуры.',
    ],
  },
];

export function FocusSection() {
  const [activeId, setActiveId] = useState<FocusItemId>('audience');

  // Всегда пытаемся найти текущий item по id;
  // если что-то пошло не так — подстраховка: берём первый.
  const current =
    focusItems.find((item) => item.id === activeId) ?? focusItems[0];

  return (
    <section className="bg-[#0F1115] text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-24 md:flex-row md:items-start md:gap-12">
        {/* Левая колонка: заголовок + "аккордеон" табов */}
        <motion.div
          className="w-full md:w-[40%]"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.h2
            variants={itemVariants}
            className="text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl"
          >
            С кем и как я работаю
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="mt-3 max-w-md text-sm text-slate-400 md:text-base"
          >
            {/* Кому я подхожу, какие задачи закрываю и 
            в каких форматах мы можем сотрудничать. */}
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-8 space-y-3"
          >
            {focusItems.map((item) => {
              const isActive = item.id === activeId;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveId(item.id)}
                  className={[
                    'group relative flex w-full flex-col items-start rounded-2xl border px-4 py-4 text-left transition',
                    'border-slate-800/80 bg-slate-900/40 hover:border-indigo-500/70 hover:bg-slate-900/70',
                    isActive
                      ? 'border-indigo-500/80 bg-slate-900/80 shadow-[0_0_35px_rgba(79,70,229,0.45)]'
                      : '',
                  ].join(' ')}
                >
                  <div className="text-[11px] font-medium uppercase tracking-[0.15em] text-slate-400">
                    {item.category}
                  </div>
                  <div className="mt-1 text-sm font-semibold text-slate-50 md:text-base">
                    {item.label}
                  </div>
                  <div className="mt-1 text-xs text-slate-400 md:text-sm">
                    {item.summary}
                  </div>
                </button>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Правая колонка: картинка + раскрытый контент */}
        <motion.div
          className="w-full md:w-[60%]"
          key={current.id}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div
            variants={itemVariants}
            className="overflow-hidden rounded-3xl border border-slate-800/80 bg-gradient-to-b from-slate-950/90 to-slate-950/60 shadow-[0_0_60px_rgba(15,23,42,0.9)]"
          >
            {/* Картинка */}
            <div className="relative h-48 w-full overflow-hidden border-b border-slate-800/70 bg-slate-950/80 md:h-56">
              <Image
                src={current.imageSrc}
                alt={current.imageAlt}
                fill
                className="object-cover opacity-90"
                priority
              />
            </div>

            {/* Текстовый блок */}
            <div className="px-6 py-5 md:px-7 md:py-6">
              <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-indigo-300/80">
                {current.category}
              </div>

              <h3 className="mt-2 text-base font-semibold text-slate-50 md:text-lg">
                {current.title}
              </h3>

              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-200 md:text-base">
                {current.bullets.map((bullet, index) => (
                  <li
                    key={index}
                    className="flex gap-2"
                  >
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-400" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}