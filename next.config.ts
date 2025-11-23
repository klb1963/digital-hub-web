// next.config.ts
import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  reactCompiler: true,
  // В продакшене делаем статический export, в dev — обычный режим
  output: isProd ? 'export' : undefined,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;