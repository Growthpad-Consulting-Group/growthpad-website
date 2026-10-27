import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function POST(req: NextRequest) {
  const secret = process.env.CAREERS_REVALIDATE_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ revalidated: false, message: "Unauthorized" }, { status: 401 });
  }
  revalidateTag("kaziJobs", "max");
  return NextResponse.json({ revalidated: true, now: Date.now() });
}
