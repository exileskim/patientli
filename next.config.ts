import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/checkout',
        destination: '/choose-your-plan',
        permanent: false,
      },
      {
        source: '/checkout/',
        destination: '/choose-your-plan/',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
