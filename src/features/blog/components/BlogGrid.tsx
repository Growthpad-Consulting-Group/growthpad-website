"use client";

import { useEffect, useMemo, useRef, useState, ViewTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Icon } from "@iconify/react";
import { urlForImage } from "@/sanity/image";
import type { BlogListItem } from "@/sanity/queries";
import { Arrow } from "@/shared/components/ArrowGroup";
import Pagination from "@/shared/components/Pagination";

const PAGE_SIZE = 6;

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function PostMeta({ item }: { item: BlogListItem }) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
      <span className="text-primary font-bold uppercase tracking-wider">
        {item.category}
      </span>
      <span className="text-secondary/40">• {formatDate(item.publishedAt)}</span>
      <span className="text-secondary/40">• {item.author.name}</span>
      <span className="text-secondary/40">
        • {item.readingMinutes} min read
      </span>
    </div>
  );
}

function ReadMore() {
  return (
    <span className="text-primary inline-flex items-center gap-2 text-sm font-bold">
      Read article
      <Arrow className="h-3 w-3 rotate-0 transition-transform duration-300 group-hover:rotate-45" />
    </span>
  );
}

export default function BlogGrid({ blogs }: { blogs: BlogListItem[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const topRef = useRef<HTMLDivElement>(null);

  const [search, setSearch] = useState(() => {
    const q = searchParams.get("q") ?? "";
    // /tag/call-center redirects produce hyphenated params — convert to spaces
    // but only if the whole param looks like a slug (no spaces already)
    return q.includes(" ") ? q : q.replace(/-/g, " ").trim();
  });
  const [category, setCategory] = useState(searchParams.get("category") ?? "all");
  const [sort, setSort] = useState<"recent" | "oldest">(
    searchParams.get("sort") === "oldest" ? "oldest" : "recent",
  );
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  // Only show categories that have at least one post
  const activeCategories = useMemo(() => {
    const seen = new Set<string>();
    blogs.forEach((b) => { if (b.category) seen.add(b.category); });
    return Array.from(seen).sort();
  }, [blogs]);

  // Debounce the search box so filtering doesn't refire — and the URL
  // doesn't rewrite — on every keystroke.
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(id);
  }, [search]);

  const visible = useMemo(() => {
    let items = blogs;

    if (debouncedSearch.trim()) {
      const q = debouncedSearch.trim().toLowerCase();
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.excerpt.toLowerCase().includes(q)
      );
    }

    if (category !== "all") {
      items = items.filter((item) => item.category === category);
    }

    items = [...items].sort((a, b) =>
      sort === "recent"
        ? +new Date(b.publishedAt) - +new Date(a.publishedAt)
        : +new Date(a.publishedAt) - +new Date(b.publishedAt),
    );

    return items;
  }, [blogs, debouncedSearch, category, sort]);

  const featured = page === 1 ? visible[0] : undefined;
  const remainder = visible.slice(1);
  const totalPages = Math.max(1, Math.ceil(remainder.length / PAGE_SIZE));
  const clampedPage = Math.min(page, totalPages);
  const pageItems = remainder.slice(
    (clampedPage - 1) * PAGE_SIZE,
    clampedPage * PAGE_SIZE,
  );

  // Keep the URL (q/category/sort/page) in sync so filtered/paginated
  // views are shareable and survive the back button.
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch.trim()) params.set("q", debouncedSearch.trim());
    if (category !== "all") params.set("category", category);
    if (sort !== "recent") params.set("sort", sort);
    if (clampedPage !== 1) params.set("page", String(clampedPage));

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [debouncedSearch, category, sort, clampedPage, pathname, router]);

  const updateFilter = (fn: () => void) => {
    fn();
    setPage(1);
  };

  const goToPage = (nextPage: number) => {
    setPage(nextPage);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div ref={topRef} className="scroll-mt-28">
      {/* Filtering Bar (Pills + Search/Sort) */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-secondary/10 pb-6 mb-10">
        {/* Horizontal Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none md:pb-0">
          <button
            onClick={() => updateFilter(() => setCategory("all"))}
            className={`rounded-full px-5 py-2.5 text-xs font-bold tracking-wider uppercase border transition-all duration-300 whitespace-nowrap cursor-pointer ${
              category === "all"
                ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                : "bg-white text-secondary/70 border-primary/10 hover:border-primary/40 hover:text-secondary"
            }`}
          >
            All Articles
          </button>
          {activeCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => updateFilter(() => setCategory(cat))}
              className={`rounded-full px-5 py-2.5 text-xs font-bold tracking-wider uppercase border transition-all duration-300 whitespace-nowrap cursor-pointer ${
                category === cat
                  ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                  : "bg-white text-secondary/70 border-primary/10 hover:border-primary/40 hover:text-secondary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center md:w-auto">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => updateFilter(() => setSearch(e.target.value))}
              placeholder="Search articles..."
              className="text-secondary placeholder:text-secondary/40 w-full sm:w-60 rounded-xl border border-primary/20 bg-white pl-10 pr-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <Icon
              icon="solar:magnifer-broken"
              width={18}
              height={18}
              className="text-secondary/40 absolute left-3 top-1/2 -translate-y-1/2"
            />
          </div>

          {/* Sort Select */}
          <div className="relative min-w-35">
            <select
              value={sort}
              onChange={(e) =>
                updateFilter(() => setSort(e.target.value as "recent" | "oldest"))
              }
              className="text-secondary text-sm w-full rounded-xl border border-primary/20 bg-white pl-4 pr-10 py-2.5 outline-none appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22><path fill=%22%23231812%22 d=%22M7 10l5 5 5-5z%22/></svg>')] bg-position-[right_1rem_center] bg-no-repeat focus:border-primary focus:ring-1 focus:ring-primary"
            >
              <option value="recent">Recent first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </div>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="py-20 text-center">
          <Icon icon="solar:document-text-broken" width={48} height={48} className="text-secondary/30 mx-auto mb-4" />
          <p className="text-secondary/60 text-lg">
            No articles found matching your criteria.
          </p>
        </div>
      ) : (
        <div key={clampedPage} className="animate-fade-in-page flex flex-col gap-12">
          {/* Featured Post (first item, page 1 only) */}
          {featured && (
            <Link
              href={`/blog/${featured.categorySlug}/${featured.slug}`}
              className="group flex flex-col lg:flex-row items-center gap-8 bg-white/40 p-6 rounded-3xl border border-primary/10 transition-all duration-700 ease-out hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-primary/5 hover:bg-white/60"
            >
              <div className="w-full lg:w-3/5 shrink-0 overflow-hidden rounded-2xl transition-all duration-700 ease-out group-hover:drop-shadow-[0_20px_35px_rgba(240,93,35,0.18)]">
                {featured.coverImage ? (
                  <ViewTransition
                    name={`blog-image-${featured.categorySlug}-${featured.slug}`}
                    share="morph"
                  >
                    <Image
                      src={urlForImage(featured.coverImage).width(900).url()}
                      alt={featured.title}
                      width={900}
                      height={0}
                      unoptimized
                      style={{ height: "auto", width: "100%" }}
                      sizes="(max-width: 1024px) 100vw, 600px"
                      priority
                      className="block transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </ViewTransition>
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-primary/10">
                    <Icon icon="solar:document-text-broken" width={64} height={64} className="text-primary/50" />
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-4 py-2 lg:pr-4 flex-1">
                <div className="flex items-center gap-2">
                  <span className="bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md shadow-primary/25">
                    Featured
                  </span>
                  <PostMeta item={featured} />
                </div>

                <h2 className="font-display text-secondary text-2xl font-bold leading-tight group-hover:text-primary transition-colors duration-300 sm:text-3xl lg:text-4xl">
                  {featured.title}
                </h2>

                <p className="text-secondary/70 text-base leading-relaxed line-clamp-3">
                  {featured.excerpt}
                </p>

                <ReadMore />
              </div>
            </Link>
          )}

          {/* Remaining Posts Grid */}
          {pageItems.length > 0 && (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {pageItems.map((item) => (
                <Link
                  key={item._id}
                  href={`/blog/${item.categorySlug}/${item.slug}`}
                  className="group flex flex-col gap-5 bg-white/20 hover:bg-white/50 border border-primary/5 p-5 rounded-2xl transition-all duration-700 ease-out hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/5"
                >
                  <div className="relative w-full aspect-455/232 overflow-hidden rounded-xl transition-all duration-700 ease-out group-hover:drop-shadow-[0_15px_30px_rgba(240,93,35,0.15)]">
                    {item.coverImage ? (
                      <ViewTransition
                        name={`blog-image-${item.categorySlug}-${item.slug}`}
                        share="morph"
                      >
                        <Image
                          src={urlForImage(item.coverImage).width(455).height(232).url()}
                          alt={item.title}
                          fill
                          unoptimized
                          sizes="(max-width: 768px) 100vw, 320px"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      </ViewTransition>
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-primary/10">
                        <Icon icon="solar:document-text-broken" width={40} height={40} className="text-primary/50" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col flex-1 justify-between gap-4">
                    <div className="flex flex-col gap-2">
                      <PostMeta item={item} />

                      <h3 className="font-display text-secondary text-lg font-bold leading-snug group-hover:text-primary transition-colors duration-300 sm:text-xl line-clamp-2">
                        {item.title}
                      </h3>

                      <p className="text-secondary/70 text-sm leading-relaxed line-clamp-3">
                        {item.excerpt}
                      </p>
                    </div>

                    <ReadMore />
                  </div>
                </Link>
              ))}
            </div>
          )}

          <Pagination
            page={clampedPage}
            totalPages={totalPages}
            onChange={goToPage}
            label="Blog pagination"
          />
        </div>
      )}
    </div>
  );
}
