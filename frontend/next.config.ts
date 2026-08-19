//frontend/next.config.ts

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    unoptimized: process.env.NODE_ENV !== 'production',
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8055",
        pathname: "/assets/**",
      },
      {
        protocol: "http",
        hostname: "198.244.232.142",
        port: "8055",
        pathname: "/assets/**",
      },
    ],
  },
};

export default nextConfig;
