import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['103.195.237.96'],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
