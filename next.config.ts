import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: {
    // Above the default 1MB Server Action limit so the existing 8MB image upload isn't rejected before it runs.
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
