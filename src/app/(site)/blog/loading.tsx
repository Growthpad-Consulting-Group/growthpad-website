import BlogGridSkeleton from "@/features/blog/components/BlogGridSkeleton";

export default function BlogLoading() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="w-full pt-6 sm:pt-10">
        <div className="container-fluid">
          <div className="h-[320px] w-full animate-pulse rounded-2xl bg-secondary/10 sm:h-[400px] lg:h-[510px]" />
        </div>
      </div>

      <section className="theme-bg relative w-full py-20 lg:py-28">
        <div className="container-fluid">
          <BlogGridSkeleton />
        </div>
      </section>
    </div>
  );
}
