// src/app/contact/page.tsx

"use client";

import Link from "next/link";
import { DiscussIdeaDialog } from "@/components/contact/DiscussIdeaDialog";

export default function ContactPage() {
  return (
    <section className="min-h-[70vh] bg-[#05070B] py-16 text-slate-100">
      <div className="mx-auto max-w-5xl px-6">
        {/* Хлебные крошки */}
        <div className="text-sm text-slate-500">
          <Link href="/" className="hover:text-emerald-300">
            ← На главную
          </Link>
        </div>

        {/* Заголовок + описание */}
        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
            Contact
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-50 md:text-4xl">
            Давайте обсудим вашу задачу или проект
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-slate-300 md:text-base">
            Напишите пару слов об идее, продукте или текущем проекте — я лично
            прочитаю сообщение и предложу формат следующего шага: короткий
            созвон, архитектурную сессию или оценку MVP.
          </p>
        </div>

        {/* Две колонки: слева CTA/форма, справа — контакты */}
        <div className="mt-10 flex flex-col gap-10 md:flex-row md:items-start">
          {/* Левая колонка — кнопка, открывающая форму */}
          <div className="w-full md:w-[55%]">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/40 px-6 py-8 text-center shadow-[0_0_40px_rgba(0,0,0,0.45)] md:px-8 md:py-10">
              <h2 className="text-lg font-semibold text-slate-50 md:text-xl">
                Короткая форма для старта
              </h2>
              <p className="mt-3 text-sm text-slate-300">
                Нажмите кнопку ниже, заполните форму — письмо уйдёт на мой
                рабочий email, а вы получите авто-подтверждение на указанный
                адрес.
              </p>

              <div className="mt-6 flex justify-center">
                <DiscussIdeaDialog />
              </div>

              <p className="mt-4 text-xs text-slate-500">
                Формат общения — без спама и навязчивых продаж. Только обмен
                идеями и поиск реалистичных шагов.
              </p>
            </div>
          </div>

          {/* Правая колонка — прямые контакты */}
          <div className="w-full md:w-[45%]">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/30 px-6 py-8 shadow-[0_0_40px_rgba(0,0,0,0.45)] md:px-8 md:py-10">
              <h3 className="text-base font-semibold text-slate-50 md:text-lg">
                Прямые контакты
              </h3>

              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <p>
                  <span className="font-medium text-slate-100">Email: </span>
                  <a
                    href="mailto:hello@leonidk.de"
                    className="text-emerald-300 hover:text-emerald-200"
                  >
                    hello@leonidk.de
                  </a>
                </p>

                <p>
                  <span className="font-medium text-slate-100">
                    LinkedIn:&nbsp;
                  </span>
                  <a
                    href="https://www.linkedin.com/in/leonidkleimann/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-300 hover:text-emerald-200"
                  >
                    linkedin.com/in/leonidkleimann
                  </a>
                </p>

                <p>
                  <span className="font-medium text-slate-100">
                    GitHub:&nbsp;
                  </span>
                  <a
                    href="https://github.com/klb1963"
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-300 hover:text-emerald-200"
                  >
                    github.com/klb1963
                  </a>
                </p>

                <p>
                  <span className="font-medium text-slate-100">
                    Видеозвонок:&nbsp;
                  </span>
                  <span className="text-slate-300">
                    персональный Jitsi-сервер{" "}
                    <span className="text-slate-100">meet.leonidk.de</span> —
                    ссылку пришлю после согласования времени.
                  </span>
                </p>
              </div>

              <p className="mt-6 text-xs text-slate-500">
                Обычно я отвечаю в рабочие дни и стараюсь начать с короткого
                созвона 20–30 минут, чтобы понять задачу и ожидания.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}