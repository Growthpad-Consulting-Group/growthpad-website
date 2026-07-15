"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  type ReactNode,
} from "react";
import { Arrow } from "@/components/ArrowGroup";

export default function Carousel({
  children,
  itemsPerView = 2,
  gapRem = 1,
  autoPlay = true,
  autoPlayInterval = 3500,
  className = "",
}: {
  children: ReactNode[];
  itemsPerView?: number;
  gapRem?: number;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  className?: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const loopWidthRef = useRef(0);
  const isHoveredRef = useRef(false);
  const n = children.length;

  // Rendered as clone–original–clone. The visible scroll position is meant
  // to always sit within the middle (real) copy; whenever it drifts into a
  // clone on either side, we silently snap back by exactly one copy's
  // width with no animation. Since the clone is pixel-identical to the
  // real content it's snapping to, that jump is invisible — this is what
  // makes the loop feel like it scrolls forever instead of visibly
  // rewinding once it hits the "last" item.
  const tripled = [...children, ...children, ...children];

  const measure = useCallback(() => {
    const start = itemRefs.current[n];
    const end = itemRefs.current[2 * n];
    if (!start || !end) return 0;
    return end.offsetLeft - start.offsetLeft;
  }, [n]);

  useLayoutEffect(() => {
    const el = scrollerRef.current;
    const start = itemRefs.current[n];
    if (!el || !start) return;
    loopWidthRef.current = measure();
    el.scrollLeft = start.offsetLeft;
  }, [n, measure]);

  useEffect(() => {
    const handleResize = () => {
      loopWidthRef.current = measure();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [n, measure]);

  const normalize = useCallback(() => {
    const el = scrollerRef.current;
    const loopWidth = loopWidthRef.current;
    const middleStart = itemRefs.current[n]?.offsetLeft ?? 0;
    if (!el || !loopWidth) return;

    if (el.scrollLeft >= middleStart + loopWidth) {
      el.scrollLeft -= loopWidth;
    } else if (el.scrollLeft < middleStart - 4) {
      el.scrollLeft += loopWidth;
    }
  }, [n]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    // "scrollend" isn't universally supported yet; a short timeout after
    // the smooth-scroll's own duration is a safe fallback for browsers
    // that lack it (the check itself is idempotent, so both firing is
    // harmless).
    let fallback: ReturnType<typeof setTimeout>;
    const handleScroll = () => {
      clearTimeout(fallback);
      fallback = setTimeout(normalize, 500);
    };

    el.addEventListener("scrollend", normalize);
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      clearTimeout(fallback);
      el.removeEventListener("scrollend", normalize);
      el.removeEventListener("scroll", handleScroll);
    };
  }, [normalize]);

  const advance = (direction: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth, behavior: "smooth" });
  };

  useEffect(() => {
    if (!autoPlay) return;

    const id = setInterval(() => {
      if (!isHoveredRef.current) advance(1);
    }, autoPlayInterval);

    return () => clearInterval(id);
  }, [autoPlay, autoPlayInterval]);

  return (
    <div
      className={className}
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
      }}
    >
      <div
        ref={scrollerRef}
        style={{ gap: `${gapRem}rem` }}
        className="flex snap-x snap-mandatory overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden"
      >
        {tripled.map((child, index) => (
          <div
            key={index}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            style={{
              width: `calc((100% - ${(itemsPerView - 1) * gapRem}rem) / ${itemsPerView})`,
            }}
            className="shrink-0 snap-start"
          >
            {child}
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => advance(-1)}
          aria-label="Previous"
          className="bg-secondary flex h-11 w-11 items-center justify-center rounded-full text-white"
        >
          <Arrow className="h-4 w-4 rotate-180" />
        </button>
        <button
          type="button"
          onClick={() => advance(1)}
          aria-label="Next"
          className="bg-primary flex h-11 w-11 items-center justify-center rounded-full text-white"
        >
          <Arrow className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
