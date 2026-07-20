"use client";

import { useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import { urlForImage } from "@/sanity/image";
import type { InsightListItem } from "@/sanity/queries";
import PdfViewerModal from "@/features/insights/components/PdfViewerModal";
import CtaButton from "@/shared/components/CtaButton";

const selectClass =
  "text-secondary w-full rounded-xl border border-primary/30 bg-white px-4 py-3 text-base outline-none appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22><path fill=%22%23231812%22 d=%22M7 10l5 5 5-5z%22/></svg>')] bg-position-[right_1rem_center] bg-no-repeat pr-10";

// The notch path reused across the site (same viewBox: 455×232)
const NOTCH_PATH =
  "M357.206 20C357.206 8.95431 348.252 0 337.206 0H20C8.95431 0 0 8.95432 0 20V193.663C0 204.709 8.95432 213.663 20 213.663H242.008C247.072 213.663 251.176 217.768 251.176 222.832C251.176 227.895 255.281 232 260.345 232H435C446.046 232 455 223.046 455 212V61.457C455 50.4114 446.046 41.457 435 41.457H377.206C366.16 41.457 357.206 32.5027 357.206 21.457V20Z";

export default function InsightsGrid({
  insights,
}: {
  insights: InsightListItem[];
}) {
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("all");
  const [sort, setSort] = useState<"recent" | "oldest">("recent");
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

  return (
    <div className="bg-primary/10 rounded-3xl p-8 sm:p-10">
      {/* Filters */}
      <div className="grid gap-6 sm:grid-cols-3">
        <div className="flex flex-col gap-2">
          <label className="text-secondary text-sm font-medium">Search:</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
            onChange={(e) => setYear(e.target.value)}
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
            onChange={(e) => setSort(e.target.value as "recent" | "oldest")}
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
        <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2">
          {visible.map((item) => (
            <div
              key={item._id}
              className="group flex cursor-pointer items-center gap-6"
              onClick={() => item.fileUrl && setViewing(item)}
              role="button"
              tabIndex={item.fileUrl ? 0 : -1}
              onKeyDown={(e) => {
                if ((e.key === "Enter" || e.key === " ") && item.fileUrl) setViewing(item);
              }}
              aria-label={`View ${item.title}`}
            >
              {/* Notch-shaped cover image — drop-shadow on hover */}
              <div className="relative w-72 shrink-0 transition-all duration-700 ease-out group-hover:drop-shadow-[0_25px_45px_rgba(240,93,35,0.28)]">
                <svg
                  viewBox="0 0 455 232"
                  preserveAspectRatio="xMidYMid meet"
                  className="h-auto w-full"
                  aria-hidden
                >
                  <defs>
                    <clipPath id={`notch-clip-${item._id}`} clipPathUnits="userSpaceOnUse">
                      <path d={NOTCH_PATH} />
                    </clipPath>
                  </defs>

                  <path d={NOTCH_PATH} fill="#fff" />

                  {item.coverImage ? (
                    <image
                      href={urlForImage(item.coverImage).width(455).height(232).url()}
                      x="0"
                      y="0"
                      width="455"
                      height="232"
                      preserveAspectRatio="xMidYMid slice"
                      clipPath={`url(#notch-clip-${item._id})`}
                    />
                  ) : (
                    <foreignObject
                      x="0"
                      y="0"
                      width="455"
                      height="232"
                      clipPath={`url(#notch-clip-${item._id})`}
                    >
                      <div
                        {...{ xmlns: "http://www.w3.org/1999/xhtml" }}
                        className="bg-primary/10 flex h-full w-full items-center justify-center"
                      >
                        <Icon
                          icon="mdi:file-pdf-box"
                          width={48}
                          height={48}
                          className="text-primary/50"
                        />
                      </div>
                    </foreignObject>
                  )}
                </svg>
              </div>

              {/* Text + CTA */}
              <div className="flex flex-col gap-4">
                <h3 className="font-display text-secondary text-lg font-bold leading-tight sm:text-xl">
                  {item.title}
                </h3>
                {item.fileUrl && (
                  <div className="pointer-events-none" aria-hidden>
                    <CtaButton size="sm">View</CtaButton>
                  </div>
                )}
              </div>
            </div>
          ))}
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
