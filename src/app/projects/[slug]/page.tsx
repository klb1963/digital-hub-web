// src/app/projects/[slug]/page.tsx

import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { projects } from "@/lib/projects";

// Генерируем статические пути: /projects/yachtpricer, /projects/seatmap-abc360 и т.д.
export function generateStaticParams(): { slug: string }[] {
  return projects.map((p) => ({ slug: p.id }));
}

// ВАЖНО: params — теперь Promise, поэтому делаем async + await
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Ищем проект по id (id == slug)
  const project = projects.find((p) => p.id === slug);

  if (!project) {
    return notFound();
  }

  // Если screenshots нет — используем основной image
  const screenshots =
    project.screenshots && project.screenshots.length > 0
      ? project.screenshots
      : [project.image];

  return (
    <main className="bg-[#05070B] text-slate-100">
      <div className="mx-auto max-w-5xl px-6 pt-16 pb-24">
        {/* Навигация назад */}
        <div className="mb-6 text-sm">
          <Link
            href="/projects"
            className="text-slate-400 transition hover:text-emerald-300"
          >
            ← Все проекты
          </Link>
        </div>

        {/* Header кейса */}
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400/80">
            Projects &amp; Cases
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
            {project.title}
          </h1>

          {project.subtitle && (
            <p className="mt-2 text-sm font-medium text-emerald-300">
              {project.subtitle}
            </p>
          )}

          <p className="mt-3 text-sm text-slate-300 md:text-base">
            {project.description}
          </p>

          {project.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-emerald-400/50 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] text-emerald-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* CTA внизу intro-блока */}
        <section className="mt-4 border-t border-slate-800 pt-6">
          <p className="text-m text-slate-300">
            Хотите обсудить похожий проект?
          </p>
          <p className="mt-1 text-m text-slate-300">
            Напишите пару слов об идее — мы вместе посмотрим, какой путь
            реалистичен по срокам, бюджету и архитектуре.
          </p>
          <div className="mt-4">
            <Link
              href="/#contact"
              className="inline-flex items-center rounded-full border border-emerald-400/70 bg-emerald-500/10 px-5 py-2 text-sm font-medium text-emerald-300 transition hover:bg-emerald-500/20"
            >
              Обсудить похожий проект
              <span className="ml-1 text-lg leading-none">↗</span>
            </Link>
          </div>
        </section>

        {/* Скриншоты / галерея */}
        <section className="mt-10 space-y-8">
          {screenshots.map((src, i) => (
            <div
              key={`${src}-${i}`}
              className="overflow-hidden rounded-xl border border-slate-800 shadow-lg shadow-black/40"
            >
              <Image
                src={src}
                alt={`${project.title} — скриншот ${i + 1}`}
                width={1600}
                height={900}
                className="h-auto w-full"
              />
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}