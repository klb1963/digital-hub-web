// src/sections/home/FooterSection.tsx
'use client';

export function FooterSection() {
  return (
    <footer className="border-t border-slate-800 bg-[#0F1115] text-slate-400">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-6 py-6 text-xs md:flex-row md:items-center md:justify-between md:text-sm">
        <div className="text-slate-500">
          © {new Date().getFullYear()} Leonid Kleimann · Open Digital Hub
        </div>

        <div className="flex flex-wrap gap-4 text-slate-400">
          {/* сюда позже можно подставить реальные URL */}
          <a
            href="mailto:hello@leonidk.de"
            className="transition hover:text-slate-200"
          >
            Email
          </a>
          <a
            href="https://www.linkedin.com"
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-slate-200"
          >
            LinkedIn
          </a>
          <a
            href="https://t.me"
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-slate-200"
          >
            Telegram
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-slate-200"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}