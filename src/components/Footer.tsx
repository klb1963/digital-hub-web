// src/components/Footer.tsx

import Link from "next/link";
import { ManageCookiesButton } from "./ManageCookiesButton";

/* ===== Icons ===== */

function TelegramIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M21.8 4.6 2.9 11.9c-1.3.5-1.3 1.2-.2 1.6l4.8 1.5 1.8 5.6c.2.6.4.8.9.8.4 0 .6-.2.9-.4l2.5-2.4 5.2 3.8c1 .5 1.6.3 1.9-.9L23.9 6c.4-1.4-.5-2-2.1-1.4Z"
        fill="currentColor"
      />
    </svg>
  );
}

function WhatsAppIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20Zm4.4-5.6c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.5 6.5 0 0 1-1.9-1.2 7 7 0 0 1-1.3-1.6c-.1-.2 0-.4.1-.5l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.3 0-.4s-.6-1.4-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3s-.8.8-.8 2 .8 2.3.9 2.5a9.4 9.4 0 0 0 3.6 3.6c.4.2.8.4 1 .4.4.1.8.1 1.1.1.3 0 .9-.4 1-.8s.4-.8.5-1 .1-.3 0-.4Z"
        fill="currentColor"
      />
    </svg>
  );
}

/* ===== Footer ===== */

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-12 border-t border-neutral-800 bg-black/90">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 text-sm text-neutral-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        
        {/* Левая часть — копирайт */}
        <div>
          <p className="text-xs sm:text-sm">
            © {year} Leonid Kleimann · Open Digital Hub
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            IT-Consulting & AI-Engineering · CTO-as-a-Service
          </p>
        </div>

        {/* Правая часть — ссылки + соцсети */}
        <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm">
          <Link href="/projects" className="transition hover:text-emerald-300">
            Projects
          </Link>
          <Link href="/blog" className="transition hover:text-emerald-300">
            Blog
          </Link>
          <Link href="/faq" className="transition hover:text-emerald-300">
            FAQ
          </Link>
          <Link href="/contact" className="transition hover:text-emerald-300">
            Contact
          </Link>

          <span className="hidden h-3 w-px bg-neutral-700 sm:inline-block" />

          <Link href="/privacy" className="transition hover:text-emerald-300">
            Privacy
          </Link>

          <ManageCookiesButton />

          <a
            href="mailto:hello@leonidk.de"
            className="transition hover:text-emerald-300"
          >
            hello@leonidk.de
          </a>

          {/* Соцсети */}
          <span className="hidden h-3 w-px bg-neutral-700 sm:inline-block" />

          <a
            href="https://t.me/leonid_kleimann"
            target="_blank"
            rel="noreferrer"
            aria-label="Telegram"
            className="rounded text-neutral-400 transition hover:text-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/40"
          >
            <TelegramIcon />
          </a>

          <a
            href="https://wa.me/4915678152428?text=%D0%94%D0%BE%D0%B1%D1%80%D1%8B%D0%B9%20%D0%B4%D0%B5%D0%BD%D1%8C%2C%20%D1%8F%20%D1%85%D0%BE%D1%87%D1%83%20%D0%BE%D0%B1%D1%81%D1%83%D0%B4%D0%B8%D1%82%D1%8C%20%D0%B7%D0%B0%D0%B4%D0%B0%D1%87%D1%83"
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp"
            className="rounded text-neutral-400 transition hover:text-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/40"
          >
            <WhatsAppIcon />
          </a>
        </div>
      </div>
    </footer>
  );
}