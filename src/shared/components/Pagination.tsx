import { Arrow } from "@/shared/components/ArrowGroup";

export default function Pagination({
  page,
  totalPages,
  onChange,
  label = "Pagination",
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  label?: string;
}) {
  if (totalPages <= 1) return null;

  // Always show first/last plus a window around the current page, and
  // collapse the rest into an ellipsis instead of listing every page.
  const pages: (number | "ellipsis")[] = [];
  for (let p = 1; p <= totalPages; p++) {
    const isEdge = p === 1 || p === totalPages;
    const isNearCurrent = Math.abs(p - page) <= 1;
    if (isEdge || isNearCurrent) {
      pages.push(p);
    } else if (pages[pages.length - 1] !== "ellipsis") {
      pages.push("ellipsis");
    }
  }

  return (
    <nav aria-label={label} className="mt-4 flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/10 text-secondary transition-colors hover:border-primary/40 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <Arrow className="h-3.5 w-3.5 -rotate-90" />
      </button>

      {pages.map((p, i) =>
        p === "ellipsis" ? (
          <span
            key={`ellipsis-${i}`}
            aria-hidden
            className="text-secondary/40 flex h-10 w-10 items-center justify-center text-sm"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            aria-current={p === page ? "page" : undefined}
            className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-colors ${
              p === page
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "text-secondary/60 hover:bg-primary/5 hover:text-secondary"
            }`}
          >
            {p}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/10 text-secondary transition-colors hover:border-primary/40 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <Arrow className="h-3.5 w-3.5 rotate-0" />
      </button>
    </nav>
  );
}
