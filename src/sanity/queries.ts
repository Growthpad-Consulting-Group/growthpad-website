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
