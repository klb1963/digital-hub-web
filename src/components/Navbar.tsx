// src/components/Navbar.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { GetStartedDialog } from "@/components/contact/GetStartedDialog";
import Image from "next/image";

const navItems = [
  { label: "Главная", href: "/" },
  { label: "Проекты", href: "/projects" },
  { label: "Блог", href: "/blog" },
  { label: "AI-Labs", href: "/ai-labs" },
  { label: "IT-тест", href: "/it-worries-test" },
  { label: "FAQ", href: "/faq" },
  { label: "Контакты", href: "/contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-800 bg-black/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">

        <Link href="/" 
        className="
        group
        flex items-center gap-2
        transition
        duration-200
        will-change-transform
        hover:-translate-y-0.5
        ">
          <Image
            src="/logo-odh-512x256.png" // logo-odh-512x256.png logo-odh-512x256-inverted.png
            alt="Open Digital Hub logo"
            width={100}
            height={60}
            className="
            object-contain
            transition
            duration-200
            drop-shadow-sm
            group-hover:drop-shadow-md
            "
          />
        </Link>

        {/* Десктопная навигация */}
        <div className="hidden items-center gap-8 md:flex">

          {/* Навигационные пункты */}
          <div className="flex items-center gap-7 text-[15px] sm:text-base">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative transition-colors ${
                    active
                      ? "text-white"
                      : "text-neutral-400 hover:text-neutral-200"
                  }`}
                >
                  {item.label}

                  {/* 🔥 Точка под активным пунктом */}
                  {active && (
                    <span
                      className="absolute -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-white opacity-100 transition-opacity"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Login / Register */}
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-neutral-400 hover:text-neutral-200 transition-colors text-[15px] sm:text-base"
            >
              Вход
            </Link>

            {/* Анкета-заявка Get Started */}
            <GetStartedDialog />

          </div>
        </div>

        {/* Мобильный бургер */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center justify-center rounded-md p-2 text-neutral-400 hover:bg-neutral-900 hover:text-white md:hidden"
        >
          <svg
            className={`h-5 w-5 ${open ? "hidden" : "block"}`}
            viewBox="0 0 24 24"
          >
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <svg
            className={`h-5 w-5 ${open ? "block" : "hidden"}`}
            viewBox="0 0 24 24"
          >
            <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
      </nav>

      {/* Мобильное меню */}
      {open && (
        <div className="border-t border-neutral-800 bg-black/95 md:hidden">
          <div className="space-y-1 px-4 py-3 text-sm">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`block rounded-md px-2 py-1.5 ${
                  isActive(item.href)
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-300 hover:bg-neutral-900 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}

            <div className="mt-2 flex flex-col gap-2 border-t border-neutral-800 pt-3">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-1.5 text-neutral-300 hover:bg-neutral-900 hover:text-white"
              >
                Login
              </Link>

              {/* В мобильном меню используем ту же анкету */}
              <div className="px-0.5">
                <GetStartedDialog />
              </div>
              
            </div>

          </div>
        </div>
      )}
    </header>
  );
}