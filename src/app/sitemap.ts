import type { MetadataRoute } from "next";
import { getBlogs, getJobOpenings, getCaseStudies } from "@/sanity/queries";
import { SITE_URL } from "@/shared/lib/site";
import staticRoutes from "@/generated/static-routes.json";

type SitemapMeta = {
  priority: number;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
};

// Per-route overrides; anything not listed here gets DEFAULT_META.
const OVERRIDES: Record<string, SitemapMeta> = {
  "": { priority: 1.0, changeFrequency: "weekly" },
  blog: { priority: 0.9, changeFrequency: "weekly" },
  careers: { priority: 0.8, changeFrequency: "weekly" },
  tenders: { priority: 0.8, changeFrequency: "weekly" },
  insights: { priority: 0.7, changeFrequency: "monthly" },
  services: { priority: 0.7, changeFrequency: "monthly" },
  products: { priority: 0.7, changeFrequency: "monthly" },
  "our-dna": { priority: 0.6, changeFrequency: "monthly" },
  "for-partners": { priority: 0.6, changeFrequency: "monthly" },
  contact: { priority: 0.6, changeFrequency: "monthly" },
};

const DEFAULT_META: SitemapMeta = { priority: 0.5, changeFrequency: "monthly" };

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogs, jobs, caseStudies] = await Promise.all([
    getBlogs(),
    getJobOpenings(),
    getCaseStudies(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map(
    ({ route, lastModified }) => {
      const { priority, changeFrequency } = OVERRIDES[route] ?? DEFAULT_META;
      return {
        url: route ? `${SITE_URL}/${route}` : SITE_URL,
        lastModified: new Date(lastModified),
        changeFrequency,
        priority,
      };
    },
  );

  const blogEntries: MetadataRoute.Sitemap = blogs.map((post) => ({
    url: `${SITE_URL}/blog/${post.categorySlug}/${post.slug}`,
    lastModified: post.updatedAt ?? post.publishedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const jobEntries: MetadataRoute.Sitemap = jobs.map((job) => ({
    url: `${SITE_URL}/careers/${job.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const caseStudyEntries: MetadataRoute.Sitemap = (caseStudies ?? []).map((study) => ({
    url: `${SITE_URL}/case-studies/${study.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticEntries, ...blogEntries, ...jobEntries, ...caseStudyEntries];
}
