// src/components/contact/GetStartedDialog.tsx

"use client";

import { useState, type FormEvent } from "react";

type GetStartedFormData = {
  name: string;
  email: string;
  interests: string[];        // Что интересует сейчас
  projectSummary: string;     // Краткая суть проекта / проблемы
  expectedValue: string;      // Какая часть опыта кажется полезной
  collaborationFormat: string; // Формат взаимодействия
  aboutLinks: string;         // Ссылки: сайт, профиль, примеры
  extra?: string;             // Дополнительные комментарии
};

const INTEREST_OPTIONS = [
  "Консультация",
  "MVP",
  "Анализ требований",
  "Аудит проекта",
  "Rescue / реанимация проекта",
  "CTO-наставничество",
];

export function GetStartedDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<GetStartedFormData>({
    name: "",
    email: "",
    interests: [],
    projectSummary: "",
    expectedValue: "",
    collaborationFormat: "",
    aboutLinks: "",
    extra: "",
  });
  const [otherInterest, setOtherInterest] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleInterest = (value: string) => {
    setForm((prev) => {
      const exists = prev.interests.includes(value);
      return {
        ...prev,
        interests: exists
          ? prev.interests.filter((v) => v !== value)
          : [...prev.interests, value],
      };
    });
  };

  const closeModal = () => {
    setIsOpen(false);

    setTimeout(() => {
      setSuccess(false);
      setError(null);
      setForm({
        name: "",
        email: "",
        interests: [],
        projectSummary: "",
        expectedValue: "",
        collaborationFormat: "",
        aboutLinks: "",
        extra: "",
      });
      setOtherInterest("");
    }, 200);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = form.name.trim();
    const trimmedEmail = form.email.trim();
    const trimmedProject = form.projectSummary.trim();

    if (!trimmedName || !trimmedEmail || !trimmedProject) {
      setError("Пожалуйста, заполните обязательные поля: имя, email и краткое описание проекта.");
      return;
    }

    // Добавляем кастомный интерес, если введён
    const interestsCombined = [
      ...form.interests,
      ...(otherInterest.trim() ? [otherInterest.trim()] : []),
    ];

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/get-started", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          interests: interestsCombined,
        }),
      });

      if (!res.ok) throw new Error("Ошибка при отправке");

      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError("Не удалось отправить анкету. Попробуйте позже.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* CTA-кнопка Get Started */}
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
        Get Started
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="
            fixed inset-0 z-50
            flex items-start justify-center pt-26
            bg-black/40 backdrop-blur-sm
            px-4
          "
        >
          <div
            className="
              w-full max-w-2xl
              rounded-2xl bg-white p-6 shadow-2xl
              max-h-[min(90vh,800px)] overflow-y-auto
            "
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900 md:text-xl">
                  Давайте познакомимся и структурируем ваш запрос
                </h2>
                <p className="mt-2 text-xs text-neutral-500 md:text-sm">
                  Мы с вами сильно сэкономим время, если вы заполните эту короткую форму
                  и расскажете, что именно у вас сейчас происходит с проектом.
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
                  Спасибо! Анкета отправлена. Я внимательно её прочитаю и вернусь
                  к вам с предложением по формату и следующему шагу.
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
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Контакты */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                </div>

                {/* Что вас интересует сейчас */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-neutral-600">
                    Что вас интересует в данный момент? <span className="text-red-500">*</span>
                  </label>
                  <p className="text-[11px] text-neutral-400">
                    Можно выбрать несколько вариантов. Например: консультация, MVP, аудит проекта, анализ требований, CTO-наставничество.
                  </p>
                  <div className="mt-1 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {INTEREST_OPTIONS.map((option) => {
                      const checked = form.interests.includes(option);
                      return (
                        <label
                          key={option}
                          className={`
                            flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-xs
                            ${
                              checked
                                ? "border-emerald-400 bg-emerald-50 text-emerald-800"
                                : "border-neutral-200 bg-neutral-50 text-neutral-700 hover:border-neutral-300"
                            }
                          `}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleInterest(option)}
                            className="h-3.5 w-3.5 rounded border-neutral-300 text-emerald-500 focus:ring-emerald-400"
                          />
                          <span>{option}</span>
                        </label>
                      );
                    })}
                  </div>

                  {/* Другое */}
                  <div className="mt-2 flex flex-col gap-1">
                    <label className="text-xs font-medium text-neutral-600">
                      Другое (если ничего из списка не подходит)
                    </label>
                    <input
                      value={otherInterest}
                      onChange={(e) => setOtherInterest(e.target.value)}
                      className="
                        w-full rounded-xl border border-neutral-200
                        bg-neutral-50 px-3 py-2 text-sm
                        text-neutral-900 placeholder:text-neutral-400
                        focus:border-neutral-400 focus:bg-white
                      "
                      placeholder="Например: продуктовая стратегия, оценка команды, что-то ещё…"
                    />
                  </div>
                </div>

                {/* Краткая суть проекта / проблемы */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-neutral-600">
                    Краткая суть проекта или проблемы <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={form.projectSummary}
                    onChange={(e) =>
                      setForm({ ...form, projectSummary: e.target.value })
                    }
                    className="
                      min-h-[90px] w-full rounded-xl border border-neutral-200
                      bg-neutral-50 px-3 py-2 text-sm
                      text-neutral-900 placeholder:text-neutral-400
                      focus:border-neutral-400 focus:bg-white
                    "
                    placeholder="О чём ваш продукт? Какая ситуация сейчас и что хотелось бы изменить?"
                    required
                  />
                </div>

                {/* Какая часть опыта полезна */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-neutral-600">
                    Какая часть моего опыта или компетенций кажется вам наиболее полезной?
                  </label>
                  <textarea
                    value={form.expectedValue}
                    onChange={(e) =>
                      setForm({ ...form, expectedValue: e.target.value })
                    }
                    className="
                      min-h-[70px] w-full rounded-xl border border-neutral-200
                      bg-neutral-50 px-3 py-2 text-sm
                      text-neutral-900 placeholder:text-neutral-400
                      focus:border-neutral-400 focus:bg-white
                    "
                    placeholder="Например: архитектура SaaS, построение MVP, DevOps, интеграции, AI-сервисы…"
                  />
                </div>

                {/* Формат взаимодействия */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-neutral-600">
                    К какому формату взаимодействия вы готовы?
                  </label>
                  <textarea
                    value={form.collaborationFormat}
                    onChange={(e) =>
                      setForm({ ...form, collaborationFormat: e.target.value })
                    }
                    className="
                      min-h-[70px] w-full rounded-xl border border-neutral-200
                      bg-neutral-50 px-3 py-2 text-sm
                      text-neutral-900 placeholder:text-neutral-400
                      focus:border-neutral-400 focus:bg-white
                    "
                    placeholder="Например: разовая сессия, серия консультаций, архитектурный проект, CTO-as-a-Service…"
                  />
                </div>

                {/* Где о вас почитать */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-neutral-600">
                    Где я могу что-то узнать о вас или проекте?
                  </label>
                  <textarea
                    value={form.aboutLinks}
                    onChange={(e) =>
                      setForm({ ...form, aboutLinks: e.target.value })
                    }
                    className="
                      min-h-[70px] w-full rounded-xl border border-neutral-200
                      bg-neutral-50 px-3 py-2 text-sm
                      text-neutral-900 placeholder:text-neutral-400
                      focus:border-neutral-400 focus:bg-white
                    "
                    placeholder="Ссылки на сайт, презентацию, LinkedIn, GitHub или другие материалы."
                  />
                </div>

                {/* Доп. комментарии */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-neutral-600">
                    Дополнительные комментарии (по желанию)
                  </label>
                  <textarea
                    value={form.extra}
                    onChange={(e) =>
                      setForm({ ...form, extra: e.target.value })
                    }
                    className="
                      min-h-[60px] w-full rounded-xl border border-neutral-200
                      bg-neutral-50 px-3 py-2 text-sm
                      text-neutral-900 placeholder:text-neutral-400
                      focus:border-neutral-400 focus:bg-white
                    "
                    placeholder="Любые детали, которые кажутся вам важными."
                  />
                </div>

                {/* Ошибка */}
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
                  {isSubmitting ? "Отправка..." : "Отправить анкету"}
                </button>

                <p className="text-[11px] text-neutral-400">
                  Нажимая кнопку, вы соглашаетесь получить от меня ответ по указанным контактам.
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}