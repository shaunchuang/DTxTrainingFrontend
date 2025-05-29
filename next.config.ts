import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '7001',
        pathname: '/security/api/**',
      },
    ],
  },  async rewrites() {
    return [
      {
        source: '/security/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_CASEMGNT_API_BASE_URL || 'http://localhost:7001'}/security/api/:path*`,
      },
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_CASEMGNT_API_BASE_URL || 'http://localhost:7001'}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
