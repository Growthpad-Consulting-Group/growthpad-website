import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { parseBody } from "next-sanity/webhook";

type RevalidateDocument = {
  _type: string;
  slug?: { current?: string } | string;
};

export async function POST(req: NextRequest) {
  const { isValidSignature, body } = await parseBody<RevalidateDocument>(
    req,
    process.env.SANITY_REVALIDATE_SECRET,
  );

  if (!isValidSignature) {
    return NextResponse.json({ revalidated: false, message: "Invalid signature" }, { status: 401 });
  }

  if (!body?._type) {
    return NextResponse.json({ revalidated: false, message: "Missing _type" }, { status: 400 });
  }

  const tags = [body._type];
  const slug = typeof body.slug === "string" ? body.slug : body.slug?.current;
  if (slug) {
    tags.push(`${body._type}:${slug}`);
  }

  for (const tag of tags) {
    revalidateTag(tag, "max");
  }

  return NextResponse.json({ revalidated: true, tags, now: Date.now() });
}
