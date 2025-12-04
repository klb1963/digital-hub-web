// src/app/projects/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects — Open Digital Hub",
  description:
    "Реальные проекты и кейсы: YachtPricer, Seat Map ABC360, Open Digital Hub и другие.",
};

type ProjectCard = {
  slug: string;
  title: string;
  role: string;
  period: string;
  shortDescription: string;
  stack: string[];
  status: "production" | "mvp" | "concept";
};

const projects: ProjectCard[] = [
  {
    slug: "yachtpricer",
    title: "YachtPricer — SaaS для управления ценами на чартер яхт",
    role: "Architect & CTO-as-a-Service",
    period: "2023 — сейчас",
    shortDescription:
      "Платформа для флот-менеджеров: анализ цен конкурентов, принятие решений по ставкам и контроль доходности яхт.",
    stack: ["NestJS", "React", "Prisma", "PostgreSQL", "NauSYS API", "Docker"],
    status: "production",
  },
  {
    slug: "seatmap-abc360",
    title: "Seat Map ABC360 — визуальный выбор мест в Sabre Red 360",
    role: "Solution Architect & Lead Developer",
    period: "2019 — сейчас",
    shortDescription:
      "Интеграция кастомной карты кресел в Sabre Red 360: работа с EnhancedSeatMap, продажа мест и управление посадкой.",
    stack: ["Java", "TypeScript", "React", "Sabre Red 360 SDK"],
    status: "production",
  },
  {
    slug: "open-digital-hub",
    title: "Open Digital Hub — инфраструктура для MVP и цифровых сообществ",
    role: "Founder & Architect",
    period: "2024 — сейчас",
    shortDescription:
      "Экосистема сервисов: лендинги, блог, видео-встречи, LMS, аутентификация и биллинг — под одним техническим зонтиком.",
    stack: ["Next.js", "Tailwind", "Payload CMS", "Clerk", "Stripe"],
    status: "mvp",
  },
  {
    slug: "meet-leonidk",
    title: "Meet LeonidK — персональная система видеоконференцсвязи",
    role: "Product & Architecture",
    period: "2024",
    shortDescription:
      "Точка входа для личного контакта с клиентами: от консультаций до запуска MVP-проектов.",
    stack: ["Next.js", "Tailwind", "MDX"],
    status: "mvp",
  },
];

const statusLabel: Record<ProjectCard["status"], string> = {
  production: "В продакшене",
  mvp: "MVP / активная разработка",
  concept: "Концепт",
};

export default function ProjectsPage() {
  return (
    <main className="bg-[#05070B] text-slate-100">
      <div className="mx-auto max-w-5xl px-6 pt-16 pb-24">
        {/* Заголовок страницы */}
        <header className="mb-10">
          <p className="text-l mb-8 font-medium uppercase tracking-[0.2em] text-emerald-400/80">
            Projects & Cases
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
            Проекты, над которыми я работаю как архитектор и CTO-практик
          </h1>
          <p className="mt-4 max-w-3xl text-sm text-slate-300 md:text-base">
            Здесь собраны живые продукты и MVP, в которых я отвечаю за
            архитектуру, разработку, техническое развитие и путь от идеи до устойчивой
            системы.
          </p>
          <p className="mt-4 max-w-3xl font-bold text-xl text-slate-300 md:text-xl">
            Без соисполнителей и субподрядчиков, но с помощью ИИ.
          </p>
        </header>

        {/* Список проектов */}
        <div className="space-y-6">
          {projects.map((project) => (
            <article
              key={project.slug}
              className="group rounded-2xl border border-slate-800 bg-slate-900/30 p-5 shadow-[0_0_35px_rgba(0,0,0,0.55)] transition hover:border-emerald-400/60 hover:bg-slate-900/60 md:p-6"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-50 md:text-xl">
                    {project.title}
                  </h2>
                  <p className="mt-1 text-xs font-medium text-emerald-300">
                    {project.role} • {project.period}
                  </p>
                  <p className="mt-3 text-sm text-slate-300">
                    {project.shortDescription}
                  </p>
                </div>

                <div className="mt-2 flex flex-col items-start gap-3 md:items-end">
                  {/* Статус */}
                  <span className="inline-flex items-center rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                    {statusLabel[project.status]}
                  </span>

                  {/* CTA (пока без отдельной страницы, но с будущим slug) */}
                  <a
                    href={`/projects/${project.slug}`}
                    className="inline-flex items-center justify-center rounded-full border border-emerald-400/70 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-300 transition group-hover:bg-emerald-500/20"
                  >
                    Смотреть кейс
                    <span className="ml-1 text-base leading-none">↗</span>
                  </a>
                </div>
              </div>

              {/* Стек */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {project.stack.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-slate-700 bg-slate-900/60 px-2.5 py-0.5 text-[11px] text-slate-300"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}