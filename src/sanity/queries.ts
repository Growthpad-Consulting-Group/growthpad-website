import type { SanityImageSource } from "@sanity/image-url";
import { client } from "@/sanity/client";

export type InsightListItem = {
  _id: string;
  title: string;
  slug: string;
  coverImage: SanityImageSource | null;
  year: number;
  publishedAt: string;
  fileUrl: string | null;
};

const INSIGHTS_QUERY = /* groq */ `
  *[_type == "insight"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    coverImage,
    year,
    publishedAt,
    "fileUrl": file.asset->url
  }
`;

export async function getInsights(): Promise<InsightListItem[]> {
  return client.fetch(INSIGHTS_QUERY, {}, { next: { revalidate: 60 } });
}

export type JobOpeningItem = {
  _id: string;
  title: string;
  department: string;
  employmentType: string;
  workMode: string;
  city: string;
  deadline: string;
  applyUrl: string | null;
};

const JOB_OPENINGS_QUERY = /* groq */ `
  *[_type == "jobOpening" && isOpen != false] | order(deadline asc) {
    _id,
    title,
    department,
    employmentType,
    workMode,
    city,
    deadline,
    applyUrl
  }
`;

export async function getJobOpenings(): Promise<JobOpeningItem[]> {
  return client.fetch(JOB_OPENINGS_QUERY, {}, { next: { revalidate: 60 } });
}
