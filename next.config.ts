// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {

  images: {
    // 🔴 КЛЮЧЕВОЙ ФИКС
    // unoptimized: true,

    remotePatterns: [
      
      {
        protocol: 'https',
        hostname: 'www.google.com',
        pathname: '/images/**',
      },

      // ─────────────────────────
      // ✅ ЛОКАЛЬНЫЙ PAYLOAD
      // ─────────────────────────
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '3000',
        pathname: '/**',
      },

      // ─────────────────────────
      // ✅ БOЕВОЙ PAYLOAD / API
      // ─────────────────────────
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