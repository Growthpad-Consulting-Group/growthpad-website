import fs from "node:fs";
import path from "node:path";
import type { MetadataRoute } from "next";
import { getBlogs, getJobOpenings, getCaseStudies } from "@/sanity/queries";
import { SITE_URL } from "@/shared/lib/site";

// Routes excluded even if a page.tsx exists there (admin tools, not meant
// to be indexed) — dynamic segments ([slug]) are already skipped below,
// this is a defensive belt-and-suspenders for anything else.
const EXCLUDED = new Set(["studio"]);

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

type DiscoveredRoute = { route: string; lastModified: Date };

// Walks src/app/(site) for page.tsx files instead of hand-listing routes —
// any new static page is picked up automatically, with its lastModified
// taken from the file's own mtime. Dynamic segments ([slug]) are skipped
// since those come from Sanity (see blogEntries/jobEntries below) and need
// real slugs, not a literal "[slug]" in the sitemap.
function discoverStaticRoutes(): DiscoveredRoute[] {
  const siteDir = path.join(process.cwd(), "src/app/(site)");
  const routes: DiscoveredRoute[] = [];

  function walk(dir: string, segments: string[]) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const isDynamic = segments.some((segment) => segment.startsWith("["));
    const isExcluded = segments.some((segment) => EXCLUDED.has(segment));

    const pageEntry = entries.find((e) => e.isFile() && e.name === "page.tsx");
    if (pageEntry && !isDynamic && !isExcluded) {
      routes.push({
        route: segments.length === 0 ? "" : segments.join("/"),
        lastModified: fs.statSync(path.join(dir, pageEntry.name)).mtime,
      });
    }

    for (const entry of entries) {
      if (entry.isDirectory()) {
        walk(path.join(dir, entry.name), [...segments, entry.name]);
      }
    }
  }

  walk(siteDir, []);
  return routes;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogs, jobs, caseStudies] = await Promise.all([
    getBlogs(),
    getJobOpenings(),
    getCaseStudies(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = discoverStaticRoutes().map(
    ({ route, lastModified }) => {
      const { priority, changeFrequency } = OVERRIDES[route] ?? DEFAULT_META;
      return {
        url: route ? `${SITE_URL}/${route}` : SITE_URL,
        lastModified,
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
