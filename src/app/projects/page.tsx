// src/app/projects/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

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
  previewImage?: string;
};

const projects: ProjectCard[] = [
  {
    slug: "yachtpricer",
    title:
      "YachtPricer — SaaS для динамического ценообразования в чартерных компаниях",
    role: "Architect & CTO-as-a-Service",
    period: "2023 — сейчас",
    shortDescription:
      "Платформа для чартерных компаний и владелцев яхт: анализ цен конкурентов, принятие решений по недельным ценам и скидкам, план-факт и контроль доходности бизнеса.",
    stack: ["NestJS", "React", "Prisma", "PostgreSQL", "NauSYS API", "Docker"],
    status: "production",
    previewImage: "/images/projects/yachtpricer-01.png",
  },
  {
    slug: "seatmap-abc360",
    title: "Seat Map ABC360 — визуальный выбор мест в Sabre Red 360",
    role: "Solution Architect & Lead Developer",
    period: "2019 — сейчас",
    shortDescription:
      "Интеграция кастомной карты мест SeatMaps ABC в Sabre Red 360 (рабочее место агента по продаже авиабилетов) с возможностью ручного и автоматического назначения мест пассажирам.",
    stack: ["Java", "TypeScript", "React", "Sabre Red 360 SDK"],
    status: "mvp",
    previewImage: "/images/projects/seatmap-02.png",
  },
  {
    slug: "open-digital-hub",
    title:
      "Open Digital Hub — цифровая экосистема для развития персонального бренда",
    role: "Founder & Architect",
    period: "2024 — сейчас",
    shortDescription:
      "Экосистема цифровых сервисов: лендинги, блог, видео-встречи, дистанционное обучение, структурированный коммьюнити-чат, аутентификация и биллинг — под одним техническим зонтиком.",
    stack: ["Next.js", "Tailwind", "Payload CMS", "Clerk", "Stripe"],
    status: "mvp",
    previewImage: "/images/projects/digital-hub-02.png",
  },
  {
    slug: "frozenocean",
    title: "FrozenOcean.travel — сайт полярных яхтенных экспедиций (EN/DE/RU)",
    role: "Lead Developer & Product Engineering",
    period: "2025",
    shortDescription:
      "Маркетинговый сайт и каталог экспедиций: мультиязычность (i18n), страницы экспедиций и флота, карточки с доступностью и ценами, единый стиль UI и аккуратная типографика.",
    stack: ["React", "TypeScript", "Tailwind", "i18next", "Vite"],
    status: "production",
    previewImage: "/images/projects/frozenocean-01.png",
  },
  {
    slug: "meet-leonidk",
    title: "Meet LeonidK — персональная система видеоконференцсвязи",
    role: "Product & Architecture",
    period: "2024",
    shortDescription:
      "Точка входа для личного контакта с клиентами из любой точки мира, где есть Интернет: от консультаций до запуска MVP-проектов. Полная независимость от блокируемых сервисов и сторонних платформ.",
    stack: ["Next.js", "Tailwind", "MDX"],
    status: "production",
    previewImage: "/images/projects/meet-leonidk-03.png",
  },
];

const statusLabel: Record<ProjectCard["status"], string> = {
  production: "PROD",
  mvp: "MVP",
  concept: "CONCEPT",
};

function statusClass(status: ProjectCard["status"]) {
  if (status === "production") {
    return "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/40";
  }
  if (status === "mvp") {
    return "bg-amber-400/15 text-amber-300 ring-1 ring-amber-400/40";
  }
  return "bg-slate-500/20 text-slate-300 ring-1 ring-slate-400/40";
}

export default function ProjectsPage() {
  return (
    <main className="bg-[#05070B] text-slate-100">
      <div className="mx-auto max-w-5xl px-6 pb-24 pt-16">
        <header className="mb-10">
          <div className="mb-6 text-sm md:text-base">
            <Link
              href="/"
              className="text-slate-400 transition hover:text-emerald-300"
            >
              ← На главную
            </Link>
          </div>

          <p className="text-l mb-8 font-medium uppercase tracking-[0.2em] text-emerald-400/80">
            Projects & Cases
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-3xl">
            Проекты, над которыми я работаю как проджект-менеджер, архитектор, дизайнер, 
            разработчик, тестировщик и ... это кайф!
          </h1>

          <p className="mt-4 max-w-3xl text-base text-slate-300 md:text-xl">
            Здесь собраны продукты и MVP, в которых я отвечаю за путь от идеи до
            реализации. Без соисполнителей и субподрядчиков, но с помощью ИИ.
          </p>

        </header>

        <div className="space-y-6">
          {projects.map((project) => (
            <article
              key={project.slug}
              className="
                group relative overflow-hidden rounded-2xl
                border border-slate-800 bg-slate-900/30
                shadow-[0_0_35px_rgba(0,0,0,0.55)]
                transition hover:border-emerald-400/60 hover:bg-slate-900/55
              "
            >
              {/* Status: mobile inline */}
              <div className="px-5 pt-5 md:hidden">
                <span
                  className={[
                    "inline-flex items-center rounded-full px-3 py-1",
                    "text-[11px] font-semibold uppercase tracking-wide",
                    "backdrop-blur-md",
                    statusClass(project.status),
                  ].join(" ")}
                >
                  {statusLabel[project.status]}
                </span>
              </div>

              {/* Desktop layout: image left + content right */}
              <div className="grid gap-0 md:grid-cols-[260px_minmax(0,1fr)]">
                {/* Left preview (desktop only) */}
                <div className="relative hidden md:block">
                  <div className="absolute inset-0">
                    {project.previewImage ? (
                      <Image
                        src={project.previewImage}
                        alt=""
                        fill
                        className="object-cover object-left-top"
                        sizes="260px"
                        unoptimized
                        priority={project.slug === "yachtpricer"}
                      />
                    ) : null}

                    {/* readability + style (только затемнение, без blur) */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#05070B]/10 via-[#05070B]/45 to-[#05070B]/95" />
                  </div>

                  {/* subtle inner border */}
                  <div className="absolute inset-y-4 right-0 w-px bg-slate-700/40" />
                </div>

                {/* Right content */}
                <div className="relative p-5 md:p-6">
                  {/* Status: desktop corner (inside content area) */}
                  <span
                    className={[
                      "hidden md:inline-flex",
                      "absolute right-6 top-6 z-10",
                      "items-center rounded-full px-3 py-1",
                      "text-[11px] font-semibold uppercase tracking-wide",
                      "backdrop-blur-md",
                      statusClass(project.status),
                    ].join(" ")}
                  >
                    {statusLabel[project.status]}
                  </span>

                  <div className="md:pr-36">
                    <h2 className="text-lg font-semibold text-slate-50 md:text-xl">
                      {project.title}
                    </h2>

                    <p className="mt-1 text-xs font-medium text-emerald-300">
                      {project.role} • {project.period}
                    </p>

                    <p className="mt-3 text-lg text-slate-300">
                      {project.shortDescription}
                    </p>

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
                  </div>

                  <div className="mt-5 flex justify-end">
                    <a
                      href={`/projects/${project.slug}`}
                      className="
                        inline-flex items-center justify-center rounded-full
                        border border-emerald-400/70 bg-emerald-500/10
                        px-4 py-1.5 text-xs font-medium text-emerald-300
                        transition hover:bg-emerald-500/20
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60
                      "
                    >
                      Смотреть кейс
                      <span className="ml-1 text-base leading-none">↗</span>
                    </a>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}