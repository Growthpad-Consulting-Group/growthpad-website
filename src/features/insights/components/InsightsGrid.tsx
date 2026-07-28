"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { urlForImage } from "@/sanity/image";
import type { InsightListItem } from "@/sanity/queries";
import PdfViewerModal from "@/features/insights/components/PdfViewerModal";
import Pagination from "@/shared/components/Pagination";

const PAGE_SIZE = 6;

const selectClass =
  "text-secondary w-full rounded-xl border border-primary/30 bg-white px-4 py-3 text-base outline-none appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22><path fill=%22%23231812%22 d=%22M7 10l5 5 5-5z%22/></svg>')] bg-position-[right_1rem_center] bg-no-repeat pr-10";

export default function InsightsGrid({
  insights,
}: {
  insights: InsightListItem[];
}) {
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("all");
  const [sort, setSort] = useState<"recent" | "oldest">("recent");
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState<InsightListItem | null>(null);

  const years = useMemo(
    () =>
      Array.from(new Set(insights.map((item) => item.year))).sort(
        (a, b) => b - a,
      ),
    [insights],
  );

  const visible = useMemo(() => {
    let items = insights;

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      items = items.filter((item) => item.title.toLowerCase().includes(q));
    }

    if (year !== "all") {
      items = items.filter((item) => String(item.year) === year);
    }

    items = [...items].sort((a, b) =>
      sort === "recent"
        ? +new Date(b.publishedAt) - +new Date(a.publishedAt)
        : +new Date(a.publishedAt) - +new Date(b.publishedAt),
    );

    return items;
  }, [insights, search, year, sort]);

  const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const clampedPage = Math.min(page, totalPages);
  const pageItems = visible.slice(
    (clampedPage - 1) * PAGE_SIZE,
    clampedPage * PAGE_SIZE,
  );

  const updateFilter = (fn: () => void) => {
    fn();
    setPage(1);
  };

  return (
    <div className="bg-primary/10 rounded-3xl p-8 shadow-2xl shadow-secondary/10 transition-all duration-600 ease-out hover:shadow-2xl hover:shadow-primary/10 sm:p-10">
      {/* Filters */}
      <div className="grid gap-6 sm:grid-cols-3">
        <div className="flex flex-col gap-2">
          <label className="text-secondary text-sm font-medium">Search:</label>
          <input
            type="text"
            value={search}
            onChange={(e) => updateFilter(() => setSearch(e.target.value))}
            placeholder="Search Insights..."
            className="text-secondary placeholder:text-secondary/50 w-full rounded-xl border border-primary/30 bg-white px-4 py-3 text-base outline-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-secondary text-sm font-medium">
            Filter by Year:
          </label>
          <select
            value={year}
            onChange={(e) => updateFilter(() => setYear(e.target.value))}
            className={selectClass}
          >
            <option value="all">All Years</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-secondary text-sm font-medium">
            Sort by Date:
          </label>
          <select
            value={sort}
            onChange={(e) =>
              updateFilter(() => setSort(e.target.value as "recent" | "oldest"))
            }
            className={selectClass}
          >
            <option value="recent">Recent</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="text-secondary/60 mt-12 text-center text-lg">
          No insights found.
        </p>
      ) : (
        <div key={clampedPage} className="animate-fade-in-page mt-12 flex flex-col gap-10">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pageItems.map((item) => (
              <button
                key={item._id}
                type="button"
                onClick={() => item.fileUrl && setViewing(item)}
                disabled={!item.fileUrl}
                className="group flex flex-col gap-4 rounded-2xl border border-primary/5 bg-white p-4 text-left transition-all duration-500 ease-out hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <div className="relative aspect-455/232 w-full overflow-hidden rounded-xl">
                  {item.coverImage ? (
                    <Image
                      src={urlForImage(item.coverImage).width(455).height(232).url()}
                      alt={item.title}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, 320px"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="bg-primary/10 flex h-full w-full items-center justify-center">
                      <Icon icon="mdi:file-pdf-box" width={40} height={40} className="text-primary/50" />
                    </div>
                  )}

                  {item.fileUrl && (
                    <span className="bg-secondary/80 absolute top-3 left-3 flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                      <Icon icon="mdi:file-pdf-box" width={12} height={12} />
                      PDF
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-between gap-3">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-primary text-xs font-bold uppercase tracking-wider">
                      {item.year}
                    </span>
                    <h3 className="font-display text-secondary text-lg font-bold leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-300">
                      {item.title}
                    </h3>
                  </div>

                  {item.fileUrl && (
                    <span className="text-primary inline-flex items-center gap-2 text-sm font-bold">
                      View document
                      <Icon
                        icon="solar:arrow-right-linear"
                        width={14}
                        height={14}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>

          <Pagination
            page={clampedPage}
            totalPages={totalPages}
            onChange={setPage}
            label="Insights pagination"
          />
        </div>
      )}

      {viewing?.fileUrl && (
        <PdfViewerModal
          open={Boolean(viewing)}
          onClose={() => setViewing(null)}
          fileUrl={viewing.fileUrl}
          title={viewing.title}
          year={viewing.year}
        />
      )}
    </div>
  );
}
