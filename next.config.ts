// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {

  images: {

    remotePatterns: [  
      {
        protocol: 'https',
        hostname: 'api.leonidk.de',
        pathname: '/api/media/file/**',
      },
      {
        protocol: 'https',
        hostname: 'cms.leonidk.de',
        pathname: '/api/media/file/**',
      },
    ],
  },
};

export default nextConfig;