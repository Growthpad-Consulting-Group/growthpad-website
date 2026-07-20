import type { MetadataRoute } from "next";
import { SITE_URL } from "@/shared/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/studio",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
