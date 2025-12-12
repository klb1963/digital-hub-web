// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.leonidk.de',
        pathname: '/api/media/**',
      },
    ],
  },
};

export default nextConfig;
