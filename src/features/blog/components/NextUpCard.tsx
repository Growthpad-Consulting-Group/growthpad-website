"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { urlForImage } from "@/sanity/image";
import type { BlogListItem } from "@/sanity/queries";

// Renders a sentinel near the end of the article body; once it scrolls into
// view (reader is close to finishing), a floating card slides in suggesting
// what to read next — replaces a static "more articles" block that nobody
// reaches until after they've already left.
export default function NextUpCard({ post }: { post: BlogListItem }) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinelRef} aria-hidden className="h-px" />

      <div
        className={`fixed bottom-6 left-1/2 z-40 w-[calc(100%-3rem)] max-w-sm -translate-x-1/2 transition-all duration-500 ease-out sm:right-6 sm:left-auto sm:translate-x-0 ${
          visible && !dismissed
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <div className="relative flex items-center gap-4 rounded-2xl border border-primary/10 bg-white p-3 shadow-2xl shadow-secondary/20">
            <button
              type="button"
              onClick={() => setDismissed(true)}
              aria-label="Dismiss"
              className="text-secondary/40 hover:bg-secondary/5 hover:text-secondary absolute -top-2.5 -right-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-sm transition-colors"
            >
              <Icon icon="solar:close-circle-bold" width={20} height={20} />
            </button>

            <Link href={`/blog/${post.slug}`} className="group flex flex-1 items-center gap-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                {post.coverImage ? (
                  <Image
                    src={urlForImage(post.coverImage).width(128).height(128).url()}
                    alt={post.title}
                    fill
                    sizes="64px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="bg-primary/10 flex h-full w-full items-center justify-center">
                    <Icon icon="solar:document-text-broken" width={20} height={20} className="text-primary/50" />
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1 overflow-hidden">
                <span className="text-primary text-[10px] font-bold uppercase tracking-wider">
                  Up next
                </span>
                <span className="font-display text-secondary group-hover:text-primary line-clamp-2 text-sm font-bold leading-snug transition-colors">
                  {post.title}
                </span>
              </div>
            </Link>
        </div>
      </div>
    </>
  );
}
