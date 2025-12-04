"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

type PanelId = "who" | "pain" | "outcome | null";

export function FocusSection() {
  const [openPanel, setOpenPanel] = useState<PanelId>(null);

    const togglePanel = (id: PanelId) => {
        setOpenPanel((current) => (current === id ? null : id));
    };

  return (
    <section className="bg-[#05070B] text-slate-100 py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="
            relative overflow-hidden
            rounded-3xl border border-slate-800/80
            bg-slate-950/70 px-6 py-10 sm:px-10 sm:py-12
            shadow-[0_18px_45px_rgba(0,0,0,0.75)]
            space-y-4
          "
        >
          {/* лёгкий общий градиент */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-purple-500/10 via-slate-900/40 to-sky-500/10" />

          <div className="relative mb-4">
            <h2 className="text-3xl font-semibold text-slate-50">
              Фокус работы
            </h2>
            <p className="mt-2 text-xl text-slate-400">
              Кому я помогаю, какие боли закрываю и что в итоге получают мои клиенты.
            </p>
          </div>

          {/* Аккордеон */}
          <div className="relative divide-y divide-slate-800/80">
            {/* Панель 1: Для кого я */}
            <AccordionItem
              id="who"
              title="Кто мои клиенты"
              icon="🎯"
              openPanel={openPanel}
              onToggle={togglePanel}
            >
              <div className="space-y-4 text-base leading-relaxed md:text-lg">
                <p>
                  <span className="font-medium text-xl text-slate-100">
                    → Индивидуальные и начинающие предприниматели
                  </span>
                  <br />
                  которые хотят запустить продукт быстро и правильно.
                </p>

                <p>
                  <span className="font-medium text-xl text-slate-100">
                    → Фрилансеры и консультанты
                  </span>
                  <br />
                  которым нужна собственная цифровая платформа под своим брендом.
                </p>

                <p>
                  <span className="font-medium text-xl text-slate-100">
                    → Малый бизнес (1–20 сотрудников)
                  </span>
                  <br />
                  которому нужна ясная архитектура, интеграции и цифровые процессы.
                </p>

                <p>
                  <span className="font-medium text-xl text-slate-100">
                    → Создатели цифрового контента, онлайн-школы, комьюнити
                  </span>
                  <br />
                  у которых Tilda/Wix/WordPress перестали тянуть.
                </p>
              </div>
            </AccordionItem>

            {/* Панель 2: Боли */}
            <AccordionItem
              id="pain"
              title="Какие боли и проблемы"
              icon="🔥"
              openPanel={openPanel}
              onToggle={togglePanel}
            >
              <div className="space-y-4 text-base leading-relaxed md:text-lg">
                <p>
                  <span className="text-red-400 text-xl font-bold">
                    → Слишком много неопределённости
                  </span>
                  <br />
                  «Я не знаю, с чего начать и как всё правильно построить».
                </p>

                <p>
                  <span className="text-red-400 text-xl font-bold">
                    → Проблема выбора
                  </span>
                  <br />
                  «Я боюсь ошибиться в архитектуре и потом платить за это годами».
                </p>

                <p>
                  <span className="text-red-400 text-xl font-bold">
                    → Ненадёжные подрядчики
                  </span>
                  <br />
                  «Я не могу найти тех, кому можно доверить техническую часть проекта».
                </p>

                <p>
                  <span className="text-red-400 text-xl font-bold">
                    → Время не ждёт
                  </span>
                  <br />
                  «Всё идёт медленно. Я буксую. Я встал».
                </p>

                <p>
                  <span className="text-red-400 text-xl font-bold">
                    → Миллион фрагментов, нет системы
                  </span>
                  <br />
                  «Сайт здесь, CRM там, интеграций нет. Я тону».
                </p>

                <p>
                  <span className="text-red-400 text-xl font-bold">
                    → Я не инженер
                  </span>
                  <br />
                  «Мне нужна уверенность, что мой проект построен правильно».
                </p>
              </div>
            </AccordionItem>

            {/* Панель 3: Результаты */}
            <AccordionItem
              id="outcome"
              title="Что получают мои клиенты"
              icon="✅"
              openPanel={openPanel}
              onToggle={togglePanel}
            >
              <ul className="space-y-3 leading-relaxed md:text-lg text-slate-200">
                <li>→ Быстрый запуск прототипа</li>
                <li>→ Снижение рисков на 70–90%</li>
                <li>→ Экономия десятков тысяч евро на ошибках</li>
                <li>→ Уверенность, что всё построено правильно</li>
                <li>→ Понятная, масштабируемая архитектура</li>
                <li>→ Четкий план действий</li>
                <li>→ Платформа, которая работает и растёт</li>
                <li>→ Высокая скорость и отсутствие стресса</li>
                <li>→ Надёжный технический партнёр</li>
              </ul>
            </AccordionItem>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

type AccordionProps = {
  id: PanelId;
  title: string;
  icon: string;
  openPanel: PanelId;
  onToggle: (id: PanelId) => void;
  children: React.ReactNode;
};

function AccordionItem({
  id,
  title,
  icon,
  openPanel,
  onToggle,
  children,
}: AccordionProps) {
  const isOpen = openPanel === id;

    return (
        <div className="py-3">

            <button
                type="button"
                onClick={() => onToggle(id)}
                className="
        flex w-full items-center justify-between
        gap-4 py-4
        text-left
    "
            >
                <div className="flex items-center gap-4">
                    <span className="text-3xl">{icon}</span>
                    <span className="text-xl md:text-2xl font-semibold text-slate-50">
                        {title}
                    </span>
                </div>

                <span
                    className={`
        inline-flex h-10 w-10 items-center justify-center
        rounded-full bg-white text-[#05070B] font-bold text-2xl
        shadow-md transition-all duration-200
    `}
                >
                    {isOpen ? "–" : "+"}
                </span>
            </button>

      <div
        className={`
          overflow-hidden transition-all duration-300 ease-out
          ${isOpen ? "mt-3 max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <div className="rounded-2xl bg-slate-900/70 px-4 py-5 border border-slate-800/60">
          {children}
        </div>
      </div>
    </div>
  );
}