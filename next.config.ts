import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/security/api/:path*',
        destination: `${process.env.CASEMGNT_API_BASE_URL || 'http://localhost:7001'}/security/api/:path*`,
      },
      {
        source: '/api/:path*',
        destination: `${process.env.CASEMGNT_API_BASE_URL || 'http://localhost:7001'}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
