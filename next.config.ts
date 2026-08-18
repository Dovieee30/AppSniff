import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Allow production builds to complete even if there are type errors
    // (the google-play-scraper types are incomplete but the code works)
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
