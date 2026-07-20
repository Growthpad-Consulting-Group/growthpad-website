import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "i.ytimg.com" },
      { hostname: "cdn.sanity.io" },
    ],
  },
};

export default nextConfig;
