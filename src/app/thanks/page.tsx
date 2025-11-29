// src/app/thanks/page.tsx

import Link from "next/link";

export default function ThanksPage() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-black px-4">
      <div className="w-full max-w-xl rounded-3xl border border-emerald-500/30 bg-neutral-900/60 px-6 py-10 text-center shadow-[0_0_60px_rgba(16,185,129,0.25)] backdrop-blur">
        <h1 className="text-2xl font-semibold text-white sm:text-3xl">
          Спасибо за ваш запрос! ✉️
        </h1>
        <p className="mt-4 text-sm text-neutral-300 sm:text-base">
          Я получил ваше сообщение и внимательно его прочитаю.
          В ближайшее время вернусь к вам с ответом и предложением
          по следующему шагу.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3">
          <Link
            href="/"
            className="
              inline-flex items-center justify-center
              rounded-full border border-emerald-400/70
              bg-emerald-500/10 px-6 py-2.5
              text-sm font-medium text-emerald-300
              shadow-[0_0_20px_rgba(16,185,129,0.2)]
              transition hover:bg-emerald-500/20 hover:shadow-[0_0_26px_rgba(16,185,129,0.3)]
            "
          >
            Вернуться на главную
          </Link>
        </div>

        <p className="mt-4 text-[11px] text-neutral-500">
          Если ответ не пришёл в течение суток, загляните в папку Spam
          или напишите напрямую на{" "}
          <a
            href="mailto:hello@leonidk.de"
            className="text-emerald-300 underline-offset-2 hover:underline"
          >
            hello@leonidk.de
          </a>.
        </p>
      </div>
    </main>
  );
}