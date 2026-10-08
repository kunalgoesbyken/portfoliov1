import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["next-mdx-remote"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ghchart.rshah.org",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    inlineCss: true,
    optimizePackageImports: [
      "lucide-react",
      "react-icons",
      "motion",
    ],
  },
};

export default nextConfig;
