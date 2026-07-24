import { redirect, notFound } from "next/navigation";
import { getBlog } from "@/sanity/queries";

type Props = { params: Promise<{ slug: string }> };

// Old flat /blog/:slug URLs — look up the post and 301 to /blog/:category/:slug
export default async function BlogSlugRedirect({ params }: Props) {
  const { slug } = await params;
  const post = await getBlog(slug);
  if (!post) notFound();
  redirect(`/blog/${post.categorySlug}/${post.slug}`);
}
