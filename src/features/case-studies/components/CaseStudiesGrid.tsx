"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { caseStudiesPreview } from "@/features/case-studies/data/caseStudiesPreview";
import Pagination from "@/shared/components/Pagination";
import type { CaseStudyListItem } from "@/sanity/queries";
import { urlForImage, isSanityUrl } from "@/sanity/image";

const PAGE_SIZE = 6;

export default function CaseStudiesGrid({
  initialItems = [],
}: {
  initialItems?: CaseStudyListItem[];
}) {
  const topRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Debounce the search box so filtering doesn't refire on every keystroke.
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(id);
  }, [search]);

  // Combine Sanity case studies with fallback mock data
  const mergedItems = useMemo(() => {
    const mappedSanity = (initialItems || []).map((item) => {
      const videoUrl = item.coverVideoUrl || item.heroVideoUrl || null;
      let imageUrl = "";
      if (item.coverImage) {
        imageUrl = urlForImage(item.coverImage).width(455).height(232).url();
      } else if (item.heroImage) {
        imageUrl = urlForImage(item.heroImage).width(455).height(232).url();
      }

      return {
        brand: item.brand,
        slug: item.slug,
        description: item.description || item.heroTitle || "",
        image: imageUrl,
        videoUrl,
      };
    });

    const mappedStatic = caseStudiesPreview.map((item) => ({
      brand: item.brand,
      slug: item.slug,
      description: item.description,
      image: item.image,
      videoUrl: null,
    }));

    const sanitySlugs = new Set(mappedSanity.map((item) => item.slug));
    return [
      ...mappedSanity,
      ...mappedStatic.filter((item) => !sanitySlugs.has(item.slug)),
    ];
  }, [initialItems]);

  const visible = useMemo(() => {
    if (!debouncedSearch.trim()) return mergedItems;
    const q = debouncedSearch.trim().toLowerCase();
    return mergedItems.filter(
      (item) =>
        item.brand.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q),
    );
  }, [debouncedSearch, mergedItems]);

  const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const clampedPage = Math.min(page, totalPages);
  const pageItems = visible.slice(
    (clampedPage - 1) * PAGE_SIZE,
    clampedPage * PAGE_SIZE,
  );

  const goToPage = (nextPage: number) => {
    setPage(nextPage);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section data-theme-section="gray" className="theme-bg w-full py-20 lg:py-28">
      <div ref={topRef} className="container-fluid scroll-mt-28">
        <div className="flex flex-col gap-6 border-b border-primary/10 pb-6 md:flex-row md:items-end md:justify-between">
          <p className="theme-fg max-w-xl text-2xl leading-tight sm:text-3xl">
            We couldn&apos;t fit them all here, but here&apos;s a peek at
            some of our proudest works and how we get them done.
          </p>

          <div className="relative shrink-0">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search case studies..."
              className="text-secondary placeholder:text-secondary/40 w-full rounded-xl border border-primary/20 bg-white py-2.5 pr-4 pl-10 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary sm:w-60"
            />
            <Icon
              icon="solar:magnifer-broken"
              width={18}
              height={18}
              className="text-secondary/40 absolute top-1/2 left-3 -translate-y-1/2"
            />
          </div>
        </div>

        {pageItems.length === 0 ? (
          <div className="py-20 text-center">
            <Icon
              icon="solar:gallery-broken"
              width={48}
              height={48}
              className="text-secondary/30 mx-auto mb-4"
            />
            <p className="theme-fg text-lg opacity-60">
              No case studies found matching your search.
            </p>
          </div>
        ) : (
          <>
            <div
              key={clampedPage}
              className="animate-fade-in-page mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
            >
              {pageItems.map((item) => (
                <Link
                  key={item.brand}
                  href={`/case-studies/${item.slug}`}
                  className="group flex flex-col gap-5 rounded-2xl border border-primary/5 bg-white/20 p-5 transition-all duration-700 ease-out hover:-translate-y-2 hover:bg-white/50 hover:shadow-xl hover:shadow-primary/5"
                >
                  <div className="relative aspect-455/232 w-full overflow-hidden rounded-xl bg-black/5 transition-all duration-700 ease-out group-hover:drop-shadow-[0_15px_30px_rgba(240,93,35,0.15)]">
                    {item.videoUrl ? (
                      <video
                        src={item.videoUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    ) : item.image ? (
                      <Image
                        src={item.image}
                        alt={item.brand}
                        fill
                        unoptimized={isSanityUrl(item.image)}
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-secondary/5 text-secondary/30">
                        <Icon icon="solar:gallery-broken" className="h-12 w-12" />
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="font-display text-secondary text-lg font-bold transition-colors duration-300 group-hover:text-primary sm:text-xl">
                      {item.brand}
                    </h3>
                    <p className="text-secondary/70 mt-2 text-sm leading-relaxed sm:text-base">
                      {item.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            <Pagination
              page={clampedPage}
              totalPages={totalPages}
              onChange={goToPage}
              label="Case studies pagination"
            />
          </>
        )}
      </div>
    </section>
  );
}
