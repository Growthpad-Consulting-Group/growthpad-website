import { NextResponse } from "next/server";
import { getBlogSlugs } from "@/sanity/queries";

export async function GET() {
  const slugs = await getBlogSlugs();
  return NextResponse.json(slugs);
}
