'use client';

import { motion } from 'framer-motion';
import { fadeInUp } from '../../lib/motion';

export function OpenDigitalHubHero() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-4">
      <motion.section
        initial="hidden"
        animate="show"
        variants={fadeInUp}
        className="max-w-xl rounded-3xl bg-slate-900/80 border border-slate-800/80 px-8 sm:px-10 py-10 sm:py-12 text-center shadow-[0_18px_60px_rgba(0,0,0,0.65)] backdrop-blur"
      >
        <div className="text-xs tracking-[0.32em] text-slate-400 mb-4">
          LEONID KLEIMANN
        </div>

        <h1 className="text-3xl sm:text-4xl font-semibold mb-4">
          <span className="text-slate-200">Open </span>
          <span className="text-sky-400">Digital Hub</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 mb-3">
          Цифровая инфраструктура для MVP-экспертов, сообществ и стартапов.
        </p>

        <p className="text-xs sm:text-sm text-slate-400">
          Site is under construction — MVP &amp; infrastructure in progress.
        </p>
      </motion.section>
    </main>
  );
}