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
    qualities: [60, 75],
  },
  experimental: {
    inlineCss: false,
    optimizePackageImports: [
      "lucide-react",
      "react-icons",
      "motion",
    ],
  },
};

export default nextConfig;
