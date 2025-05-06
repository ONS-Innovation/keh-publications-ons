import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  output: "standalone",
  // Improve performance for serverless environments
  experimental: {
    serverComponentsExternalPackages: ["sharp"],
  },
  // Handle asset prefixes for ECS/ALB environment
  poweredByHeader: false,
  // Optimize image handling
  images: {
    remotePatterns: [],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
  },
};

export default nextConfig;
