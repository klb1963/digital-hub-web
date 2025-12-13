// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cms.leonidk.de',
        pathname: '/api/media/**',
      },
    ],
  },
};

export default nextConfig;
