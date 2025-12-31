import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/patientli',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
