//

import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center bg-[#05070B] px-6 text-slate-100">
      <div className="text-center max-w-lg">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
          404 — Страница не найдена
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-50 md:text-4xl">
          Эта страница ещё в разработке
        </h1>

        <p className="mt-4 text-sm text-slate-400 md:text-base">
          Возможно, я как раз работаю над этим разделом!  
          Попробуйте вернуться на главную или открыть список проектов.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3">

          {/* ← На главную */}
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-emerald-400/70 bg-emerald-500/10 px-6 py-2 text-sm font-medium text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.15)] transition hover:bg-emerald-500/20 hover:shadow-[0_0_26px_rgba(16,185,129,0.25)]"
          >
            На главную →
          </Link>

          {/* ← Смотреть проекты */}
          <Link
            href="/projects"
            className="text-sm text-slate-400 hover:text-emerald-300 transition"
          >
            Смотреть проекты
          </Link>
        </div>
      </div>
    </section>
  );
}