// src/components/Footer.tsx

import Link from "next/link";

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
            AI-Consulting & AI-Engineering · CTO-as-a-Service
          </p>
        </div>

        {/* Правая часть — ссылки */}
        <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm">
          <Link
            href="/projects"
            className="hover:text-emerald-300 transition"
          >
            Projects
          </Link>
          <Link href="/blog" className="hover:text-emerald-300 transition">
            Blog
          </Link>
          <Link href="/faq" className="hover:text-emerald-300 transition">
            FAQ
          </Link>
          <Link href="/contact" className="hover:text-emerald-300 transition">
            Contact
          </Link>

          <span className="hidden h-3 w-px bg-neutral-700 sm:inline-block" />

          <a
            href="mailto:hello@leonidk.de"
            className="hover:text-emerald-300 transition"
          >
            hello@leonidk.de
          </a>
        </div>
      </div>
    </footer>
  );
}