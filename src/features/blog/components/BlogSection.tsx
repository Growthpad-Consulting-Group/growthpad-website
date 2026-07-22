import { Suspense } from "react";
import BlogGrid from "@/features/blog/components/BlogGrid";
import BlogGridSkeleton from "@/features/blog/components/BlogGridSkeleton";
import { getBlogs } from "@/sanity/queries";

export default async function BlogSection() {
  const blogs = await getBlogs();

  return (
    <section
      data-theme-section="gray"
      className="theme-bg relative w-full pt-0 pb-20 lg:py-28"
    >
      <div className="container-fluid flex flex-col gap-12">
        <Suspense fallback={<BlogGridSkeleton />}>
          <BlogGrid blogs={blogs} />
        </Suspense>
      </div>
    </section>
  );
}
