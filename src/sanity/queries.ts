import type { SanityImageSource } from "@sanity/image-url";
import type { PortableTextBlock } from "@portabletext/types";
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

export type TenderListItem = {
  _id: string;
  title: string;
  slug: string;
  referenceNumber: string | null;
  coverImage: SanityImageSource | null;
  deadline: string;
  publishedAt: string;
  fileUrl: string | null;
};

const TENDERS_QUERY = /* groq */ `
  *[_type == "tender"] | order(deadline desc) {
    _id,
    title,
    "slug": slug.current,
    referenceNumber,
    coverImage,
    deadline,
    publishedAt,
    "fileUrl": file.asset->url
  }
`;

export async function getTenders(): Promise<TenderListItem[]> {
  return client.fetch(TENDERS_QUERY, {}, { next: { revalidate: 60 } });
}

export type JobOpeningItem = {
  _id: string;
  title: string;
  slug: string;
  department: string;
  reportsTo: string | null;
  experience: string | null;
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
    "slug": slug.current,
    department,
    reportsTo,
    experience,
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

export type JobOpeningDetail = JobOpeningItem & {
  description: PortableTextBlock[] | null;
};

const JOB_OPENING_QUERY = /* groq */ `
  *[_type == "jobOpening" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    department,
    reportsTo,
    experience,
    employmentType,
    workMode,
    city,
    deadline,
    applyUrl,
    description
  }
`;

export async function getJobOpening(slug: string): Promise<JobOpeningDetail | null> {
  return client.fetch(JOB_OPENING_QUERY, { slug }, { next: { revalidate: 60 } });
}

export type BlogListItem = {
  _id: string;
  title: string;
  slug: string;
  coverImage: SanityImageSource | null;
  category: string;
  author: string;
  excerpt: string;
  publishedAt: string;
  readingMinutes: number;
};

const BLOGS_QUERY = /* groq */ `
  *[_type == "blog"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    coverImage,
    category,
    author,
    excerpt,
    publishedAt,
    "readingMinutes": round(length(pt::text(content)) / 5 / 200) + 1
  }
`;

export async function getBlogs(): Promise<BlogListItem[]> {
  return client.fetch(BLOGS_QUERY, {}, { next: { revalidate: 60 } });
}

export type BlogDetail = BlogListItem & {
  content: PortableTextBlock[] | null;
  seoTitle: string | null;
  seoDescription: string | null;
};

const BLOG_QUERY = /* groq */ `
  *[_type == "blog" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    coverImage,
    category,
    author,
    excerpt,
    content,
    seoTitle,
    seoDescription,
    publishedAt,
    "readingMinutes": round(length(pt::text(content)) / 5 / 200) + 1
  }
`;

export async function getBlog(slug: string): Promise<BlogDetail | null> {
  return client.fetch(BLOG_QUERY, { slug }, { next: { revalidate: 60 } });
}

