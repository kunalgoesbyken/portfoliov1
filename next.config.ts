import type { NextConfig } from "next";
import { IMAGE_QUALITIES } from "./lib/image";

const nextConfig: NextConfig = {
  transpilePackages: ["next-mdx-remote"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ghchart.rshah.org",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
    qualities: IMAGE_QUALITIES,
  },
  async redirects() {
    return [{ source: "/contact", destination: "/", permanent: true }];
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
