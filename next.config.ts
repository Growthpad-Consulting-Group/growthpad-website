import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "i.ytimg.com" },
      { hostname: "cdn.sanity.io" },
    ],
  },
  async redirects() {
    return [
      // Static page remaps
      { source: "/contact-us", destination: "/contact", permanent: true },
      { source: "/career-opportunities", destination: "/careers", permanent: true },
      { source: "/case-studies-industry-leaders", destination: "/case-studies", permanent: true },
      { source: "/about-us-innovative-tech-solutions", destination: "/our-dna", permanent: true },
      { source: "/our-specialties-digital-services", destination: "/services", permanent: true },
      // /tag/:slug → /blog?q=slug (spaces restored from hyphens on the client)
      { source: "/tag/:tag", destination: "/blog?q=:tag", permanent: true },
      // WP PDF upload → insights page
      { source: "/wp-content/uploads/2025/04/Amplifying-Impact-in-Africa-Report-GCG-.pdf", destination: "/insights", permanent: true },
    ];
  },
};

export default nextConfig;
