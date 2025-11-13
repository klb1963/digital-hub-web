// src/lib/motion.ts
import type { Variants } from 'framer-motion';

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      // ease можно добавить числовым массивом,
      // например [0.16, 1, 0.3, 1], но строку 'easeOut'
      // новые типы уже не любят.
    },
  },
};