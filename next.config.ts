// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,

  images: {
    remotePatterns: [
      // прямые ссылки из Payload media
      {
        protocol: 'https',
        hostname: 'cms.leonidk.de',
        pathname: '/api/media/file/**',
      },
      // если где-то в данных/редиректах всплывает api.*
      {
        protocol: 'https',
        hostname: 'api.leonidk.de',
        pathname: '/api/media/file/**',
      },
    ],
  },
};

export default nextConfig;
