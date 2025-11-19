import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// ⬇️ Добавляем импорт Navbar
import { Navbar } from "../components/Navbar";

// Шрифты, как у тебя
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Open Digital Hub",
  description: "Digital infrastructure for MVPs and SaaS projects",
};

// ⬇️ Основной layout приложения
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* 
        ⬇️ Добавляем темную тему body + плавный градиент 
        чтобы Navbar идеально лег на фон (как у Payload)
      */}
      <body
        className={`
          ${geistSans.variable} 
          ${geistMono.variable} 
          antialiased
          bg-black text-neutral-100 
          min-h-screen 
          bg-gradient-to-b from-black via-neutral-950 to-black
        `}
      >
        {/* ⬇️ Navbar теперь в layout — появляется на всех страницах */}
        <Navbar />

        {/* ⬇️ Сдвигаем контент чуть вниз, чтобы не перекрывался Navbar */}
        <main className="pt-4 sm:pt-6">
          {children}
        </main>
      </body>
    </html>
  );
}