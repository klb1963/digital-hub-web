// tailwind.config.ts
import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      keyframes: {
        scan: {
          '0%': { top: '-8px', opacity: '0' },
          '10%': { opacity: '1' },
          '50%': { opacity: '0.75' },
          '90%': { opacity: '1' },
          '100%': { top: '100%', opacity: '0' },
        },
      },
      animation: {
        scan: 'scan 16s ease-in-out infinite',
        scanFast: 'scan 2s linear infinite',
      },
    },
  },
  plugins: [typography],
};

export default config;