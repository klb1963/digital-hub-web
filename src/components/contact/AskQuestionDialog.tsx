// src/components/contact/AskQuestionDialog.tsx

"use client";

import { useState, type FormEvent } from "react";

type QuestionFormData = {
  name: string;
  email: string;
  message: string;
  // honeypot-поле для ботов
  company?: string;
};

export function AskQuestionDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<QuestionFormData>({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const closeModal = () => {
    setIsOpen(false);

    setTimeout(() => {
      setSuccess(false);
      setError(null);
      setForm({
        name: "",
        email: "",
        message: "",
        company: "",
      });
    }, 200);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Пожалуйста, заполните обязательные поля.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          type: "FAQ", // 👈 ключ для различения писем
        }),
      });

      if (!res.ok) throw new Error("Ошибка при отправке");

      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError("Не удалось отправить. Попробуйте позже.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* CTA button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="
          btn-shine
          inline-flex items-center justify-center
          rounded-full
          border border-emerald-400/70
          bg-emerald-500/10
          px-7 py-3
          text-sm font-semibold text-emerald-300
          shadow-[0_0_20px_rgba(16,185,129,0.15)]
          transition
          hover:bg-emerald-500/20
          hover:shadow-[0_0_26px_rgba(16,185,129,0.25)]
        "
      >
        Задать вопрос
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">
                  Задать вопрос
                </h2>
                <p className="mt-1 text-sm text-neutral-500">
                  Напишите вопрос — я отвечу лично в течение суток.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-full p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
              >
                ×
              </button>
            </div>

            {success ? (
              <div className="space-y-4">
                <p className="text-sm text-neutral-700">
                  Спасибо! Ваш вопрос получил. Ответ будет отправлен вам на email.
                </p>

                <button
                  type="button"
                  onClick={closeModal}
                  className="
                    inline-flex w-full items-center justify-center
                    rounded-full bg-black
                    px-6 py-3
                    text-sm font-medium text-white
                    shadow-lg hover:bg-neutral-900 transition
                  "
                >
                  Закрыть
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Honeypot-поле для ботов — скрыто от реальных пользователей */}
                <div className="hidden" aria-hidden="true">
                  <label>
                    Company
                    <input
                      type="text"
                      autoComplete="off"
                      tabIndex={-1}
                      value={form.company}
                      onChange={(e) =>
                        setForm({ ...form, company: e.target.value })
                      }
                    />
                  </label>
                </div>

                {/* Name */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-neutral-600">
                    Имя <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    className="
                      w-full rounded-xl border border-neutral-200
                      bg-neutral-50 px-3 py-2 text-sm
                      text-neutral-900 placeholder:text-neutral-400
                      focus:border-neutral-400 focus:bg-white
                    "
                    placeholder="Как к вам обращаться?"
                    required
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-neutral-600">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    type="email"
                    className="
                      w-full rounded-xl border border-neutral-200
                      bg-neutral-50 px-3 py-2 text-sm
                      text-neutral-900 placeholder:text-neutral-400
                      focus:border-neutral-400 focus:bg-white
                    "
                    placeholder="you@example.com"
                    required
                  />
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-neutral-600">
                    Ваш вопрос <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    className="
                      min-h-[100px] w-full rounded-xl border border-neutral-200
                      bg-neutral-50 px-3 py-2 text-sm
                      text-neutral-900 placeholder:text-neutral-400
                      focus:border-neutral-400 focus:bg-white
                    "
                    placeholder="Например: Сколько стоит MVP для SaaS проекта?"
                    required
                  />
                </div>

                {/* Error */}
                {error && <p className="text-sm text-red-600">{error}</p>}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="
                    inline-flex w-full items-center justify-center
                    rounded-full bg-black
                    px-7 py-3.5 text-base font-semibold text-white
                    shadow-[0_4px_12px_rgba(0,0,0,0.35)]
                    transition-transform transition-shadow duration-200
                    hover:-translate-y-0.5
                    hover:shadow-[0_8px_24px_rgba(0,0,0,0.35)]
                    disabled:cursor-not-allowed disabled:opacity-60
                  "
                >
                  {isSubmitting ? "Отправка..." : "Задать вопрос"}
                </button>

                <p className="text-[11px] text-neutral-400">
                  Нажимая кнопку, вы соглашаетесь получить ответ на email.
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}