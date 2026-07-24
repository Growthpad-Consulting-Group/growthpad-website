import { getBlog } from "@/sanity/queries";

type Props = { params: Promise<{ slug: string }> };

export async function GET(req: Request, { params }: Props) {
  const { slug } = await params;
  const post = await getBlog(slug);
  if (!post) return new Response(null, { status: 404 });
  return Response.redirect(
    new URL(`/blog/${post.categorySlug}/${post.slug}`, req.url),
    301,
  );
}
