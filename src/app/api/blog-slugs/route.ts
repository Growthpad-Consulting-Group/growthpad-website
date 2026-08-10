import { NextResponse } from "next/server";
import { getBlogSlugs } from "@/sanity/queries";

export async function GET() {
  const slugs = await getBlogSlugs();
  return NextResponse.json(slugs, {
    headers: {
      // Cache at the CDN edge for 1 hour; serve stale for up to 24 hours
      // while revalidating in the background. This prevents a live function
      // invocation on every 404 page hit.
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
