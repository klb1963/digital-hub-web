"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { Target, Flame, CheckCircle2, Star } from 'lucide-react';

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

type PanelId = "who" | "pain" | "outcome" | "unique" | null;

export function FocusSection() {
  const [openPanel, setOpenPanel] = useState<PanelId>(null);

    const togglePanel = (id: PanelId) => {
        setOpenPanel((current) => (current === id ? null : id));
    };

  return (
    <section className="bg-[#05070B] text-slate-100 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
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
          "
        >
          {/* Единый ODH card gradient */}
          <div
            className="
              pointer-events-none absolute inset-0
              bg-gradient-to-br
              from-sky-500/10
              via-slate-900/45
              to-purple-500/6
            "
          />
          
          <div className="relative mb-4">
            <h2 className="text-3xl font-semibold text-slate-50">
              Фокус работы
            </h2>

            <p className="mt-2 text-xl text-slate-400">
              Кому я помогаю, какие боли закрываю и что в итоге получают мои клиенты
            </p>

          </div>

          {/* Аккордеон */}
          <div className="relative mt-4 divide-y divide-slate-800/80">
            {/* Панель 1: Для кого я */}
            <AccordionItem
              id="who"
              title="Кто мои клиенты"
              icon={<Target className="h-6 w-6 text-emerald-300" />}
              openPanel={openPanel}
              onToggle={togglePanel}
            >
              <div className="space-y-4 text-base leading-relaxed md:text-lg">
                <p>
                  <span className="font-medium text-xl text-slate-100">
                    → Индивидуальные и начинающие предприниматели
                  </span>
                  <br />
                  которые хотят запустить цифровой продукт быстро и правильно.
                </p>

                <p>
                  <span className="font-medium text-xl text-slate-100">
                    → Фрилансеры и консультанты
                  </span>
                  <br />
                  которым нужна собственная цифровая платформа под своим <span className="text-slate-100 font-bold md:text-xl">персональным брендом</span>.
                </p>

                <p>
                  <span className="font-medium text-xl text-slate-100">
                    → Создатели цифрового контента, онлайн-школы, комьюнити,
                  </span>
                  <br />
                  у которых Tilda/Wix/WordPress перестали тянуть.
                </p>

                <p>
                  <span className="font-medium text-xl text-slate-100">
                    → Малый бизнес (1–20 сотрудников)
                  </span>
                  <br />
                  которому нужна ясная ИТ-архитектура, интеграции и цифровые процессы.
                </p>
            
                <p/>

              </div>
            </AccordionItem>

            {/* Панель 2: Боли */}
            <AccordionItem
              id="pain"
              title="С какими болями ко мне приходят"
              icon={<Flame className="h-6 w-6 text-rose-300" />}
              openPanel={openPanel}
              onToggle={togglePanel}
            >
              <div className="space-y-4 text-base leading-relaxed md:text-lg">
                <p>
                  <span className="text-red-400 text-xl font-bold">
                    → Слишком много неопределённости
                  </span>
                  <br />
                  «Я хочу развивать свой персональный бренд, но не понимаю, с чего начать и как выстроить всё правильно.»
                </p>

                <p>
                  <span className="text-red-400 text-xl font-bold">
                    → Проблема выбора
                  </span>
                  <br />
                  «Не знаю, какие инструменты, платформы и технологии выбрать, чтобы потом не переделывать всё заново.»
                </p>

                <p>
                  <span className="text-red-400 text-xl font-bold">
                    → Разрозненные подрядчики
                  </span>
                  <br />
                  «Каждый делает свою часть — сайт, CRM, блог, рассылки — но никто не отвечает за систему целиком.»
                </p>

                <p>
                  <span className="text-red-400 text-xl font-bold">
                    → Время идёт, результата нет
                  </span>
                  <br />
                  «Контент есть, идеи есть, но нет работающей системы, которая приносит заявки и продажи.»
                </p>

                <p>
                  <span className="text-red-400 text-xl font-bold">
                    → Миллион фрагментов, нет системы
                  </span>
                  <br />
                  «Сайт отдельно, блог отдельно, страницы в соцсетях отдельно, CRM и подписки отдельно. Между ними нет логики и понятного пути клиента.»
                </p>

                <p>
                  <span className="text-red-400 text-xl font-bold">
                    → Я не инженер, не программист и вообще не технарь ни разу.
                  </span>
                  <br />
                  «Мне нужен кто-то, кто соберёт всё правильно: платформы, интеграции и техническую стратегию моего бренда.»
                </p>
              </div>
            </AccordionItem>

            {/* Панель 3: Результаты */}
            <AccordionItem
              id="outcome"
              title="Что получают мои клиенты"
              icon={<CheckCircle2 className="h-6 w-6 text-emerald-300" />}
              openPanel={openPanel}
              onToggle={togglePanel}
            >
              <ul className="space-y-3 leading-relaxed md:text-lg text-slate-200">
                <li>→ Быстрый запуск MVP или платформы для персонального бренда</li>
                <li>→ Экономия десятков тысяч евро на ошибках</li>
                <li>→ Уверенность, что всё построено правильно</li>
                <li>→ Четкий план действий</li>
                <li>→ Высокая скорость работы без головняка и стресса</li>
              </ul>
            </AccordionItem>

            {/* Панель 4: Что меня отличает */}
            <AccordionItem
            id="unique"
            title="Что меня отличает от других"
            icon={<Star className="h-6 w-6 text-amber-300" />}
            openPanel={openPanel}
            onToggle={togglePanel}
            >
            <ul className="space-y-3 leading-relaxed md:text-lg text-slate-200">
                <li>→ Я работаю один — вы общаетесь напрямую и только со мной.</li>
                <li>→ У меня нет команды и субподрядчиков — вы оплачиваете только мою работу, без лишних накруток.</li>
                <li>→ Использую AI-инструменты для достижения скорости, точности и качества результата.</li>
                <li>→ Работаю из дома, не трачу время на дорогу, доступен по согласованному графику.</li>
                <li>→ Несу ответственность за всю систему целиком, а не за отдельные её части.</li>
                <li>→ И да, я сам развиваю персональный бренд и продажи вокруг него. Этот сайт разработан только мной при использовании ИИ.  Присоединяйтесь, будем строить вместе!</li>
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
  icon: React.ReactNode;
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
      <div className="py-3 last:pb-0">

        <button
          type="button"
          onClick={() => onToggle(id)}
          className="
        flex w-full items-center justify-between
        gap-3 py-3
        text-left
    "
        >
          <div className="flex items-center gap-4">
            <span
              className="
              inline-flex h-10 w-10 items-center justify-center
              rounded-full
              border border-emerald-500/25
              bg-emerald-500/10
              shadow-[0_0_0_1px_rgba(16,185,129,0.08),0_10px_30px_rgba(0,0,0,0.35)]
            "
            >
              {icon}
            </span>
            <span className="text-xl md:text-2xl font-semibold text-slate-50">
              {title}
            </span>
          </div>

          <span
            className={`
            inline-flex h-9 w-9 items-center justify-center
            rounded-full
            border border-emerald-500/30
            bg-emerald-500/10
            text-emerald-300
            font-semibold text-xl
            shadow-sm
            transition-all duration-200
            ${isOpen ? "rotate-180" : ""}
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