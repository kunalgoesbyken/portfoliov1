import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["next-mdx-remote"],
  images: {
    unoptimized: true,
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
