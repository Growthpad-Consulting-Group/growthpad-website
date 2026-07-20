"use client";

import { useEffect, useRef, useState } from "react";
import type { Heading } from "@/features/blog/lib/toc";

export default function TableOfContents({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string | null>(headings[0]?.id ?? null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-96px 0px -70% 0px" },
    );

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  // Keep the active item in view inside the (short, fixed-height) list as
  // the reader scrolls past sections further down the article.
  useEffect(() => {
    if (!activeId || !listRef.current) return;
    const activeEl = listRef.current.querySelector(`[data-id="${activeId}"]`);
    activeEl?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeId]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    history.pushState(null, "", `#${id}`);
  };

  if (headings.length < 2) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="hidden lg:block sticky top-28 rounded-2xl bg-white p-5 shadow-2xl shadow-secondary/10 transition-all duration-600 ease-out hover:shadow-2xl hover:shadow-primary/10"
    >
      <p className="text-secondary/80 mb-3 text-md font-bold ">
        On this page
      </p>
      <ul
        ref={listRef}
        className="border-secondary/10 flex max-h-80 flex-col gap-1 overflow-y-auto border-l scroll-smooth"
      >
        {headings.map((heading) => (
          <li key={heading.id} data-id={heading.id}>
            <a
              href={`#${heading.id}`}
              onClick={(e) => handleClick(e, heading.id)}
              className={`block border-l-2 py-1 text-sm leading-snug transition-colors -ml-px ${
                heading.level === 3 ? "pl-8" : "pl-4"
              } ${
                activeId === heading.id
                  ? "border-primary text-primary font-semibold"
                  : "border-transparent text-secondary/60 hover:text-secondary"
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
