// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,

  images: {
    // 🔴 КЛЮЧЕВОЙ ФИКС
    unoptimized: true,

    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.leonidk.de',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cms.leonidk.de',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'api.leonidk.de',
        pathname: '/api/media/file/**',
      },
      {
        protocol: 'https',
        hostname: 'cms.leonidk.de',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
