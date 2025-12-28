// src/components/ManageCookiesButton.tsx

"use client";

export function ManageCookiesButton() {
  const manageCookies = () => {
    // удаляем cookie (и secure тут не нужен, мы стираем)
    document.cookie = "cookie_consent=; Path=/; Max-Age=0; SameSite=Lax";

    // сообщаем AnalyticsWithConsent
    window.dispatchEvent(new Event("cookie-consent-reset"));
  };

  return (
    <button
      type="button"
      onClick={manageCookies}
      className="hover:text-emerald-300 transition underline underline-offset-4"
    >
      Manage cookies
    </button>
  );
}