// src/components/AnalyticsWithConsent.tsx

"use client";

import React from "react";
import { GoogleAnalytics } from "@next/third-parties/google";

type Consent = "accepted" | "rejected" | null;

const COOKIE_NAME = "cookie_consent";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 180; // 180 дней

function readConsentCookie(): Consent {
  if (typeof document === "undefined") return null;

  const m = document.cookie.match(
    new RegExp("(^|; )" + COOKIE_NAME.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&") + "=([^;]*)")
  );
  if (!m) return null;

  const val = decodeURIComponent(m[2] || "");
  if (val === "accepted" || val === "rejected") return val;
  return null;
}

function writeConsentCookie(value: "accepted" | "rejected") {
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie =
    `${COOKIE_NAME}=${encodeURIComponent(value)}; Path=/; Max-Age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax` +
    secure;
}

export function AnalyticsWithConsent({ gaId }: { gaId: string }) {
  const [consent, setConsent] = React.useState<Consent>(null);

  React.useEffect(() => {
    setConsent(readConsentCookie());
  }, []);

  const accept = () => {
    writeConsentCookie("accepted");
    setConsent("accepted");
  };

  const reject = () => {
    writeConsentCookie("rejected");
    setConsent("rejected");
  };

  return (
    <>
      {/* GA4 грузим только после согласия */}
      {consent === "accepted" ? <GoogleAnalytics gaId={gaId} /> : null}

      {/* Баннер показываем, только если решения ещё нет */}
      {consent === null ? (
        <div className="fixed inset-x-0 bottom-0 z-50 p-3 sm:p-4">
          <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-neutral-950/95 p-4 shadow-lg backdrop-blur">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-neutral-200">
                <div className="font-medium text-neutral-100">Cookies</div>
                <div className="mt-1 text-neutral-300">
                  Мы используем cookies для аналитики (Google Analytics), чтобы понимать посещаемость и улучшать сайт.
                </div>
                {/* Если у тебя уже есть страница privacy — поменяй href */}
                <a href="/privacy" className="mt-2 inline-block text-neutral-200 underline underline-offset-4 hover:text-white">
                  Privacy Policy
                </a>
              </div>

              <div className="flex gap-2 sm:flex-shrink-0">
                <button
                  onClick={reject}
                  className="rounded-xl border border-white/15 px-4 py-2 text-sm text-neutral-200 hover:bg-white/5"
                >
                  Reject
                </button>
                <button
                  onClick={accept}
                  className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-black hover:bg-neutral-200"
                >
                  Accept
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}