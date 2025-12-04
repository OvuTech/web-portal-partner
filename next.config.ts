import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Ensure fetch works properly in server components
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
