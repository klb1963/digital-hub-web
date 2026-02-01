/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // DEV: local payload / local proxy
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