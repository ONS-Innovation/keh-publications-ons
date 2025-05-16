import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  output: "standalone",
  // Improve performance for serverless environments
  serverExternalPackages: ["sharp"],
  // Handle asset prefixes for ECS/ALB environment
  poweredByHeader: false,
  // Optimize image handling
  images: {
    remotePatterns: [],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
  },
  // Handle reverse proxy headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'x-powered-by',
            value: 'Next.js',
          },
        ],
      },
    ];
  },
  // Trust the proxy headers
  httpAgentOptions: {
    keepAlive: true,
  },
};

export default nextConfig;
