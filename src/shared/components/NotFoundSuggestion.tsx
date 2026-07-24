"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { navLinks, footerLinks } from "@/shared/layouts/nav";
import type { BlogSlugItem } from "@/sanity/queries";

const STATIC_PAGES = [...navLinks, ...footerLinks]
  .filter((p, i, arr) => arr.findIndex((x) => x.href === p.href) === i)
  .map((p) => ({ title: p.label, href: p.href }));

function tokenise(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(" ")
    .filter((w) => w.length > 2);
}

function fuzzyScore(pathTokens: string[], candidate: string): number {
  const candidateTokens = new Set(tokenise(candidate));
  return pathTokens.filter((t) => candidateTokens.has(t)).length;
}

function findBest(pathname: string, blogs: BlogSlugItem[]) {
  const segments = pathname.replace(/^\//, "").split("/").filter(Boolean);
  const pathTokens = tokenise(segments.join(" "));
  if (pathTokens.length === 0) return null;

  const blogMatch = blogs
    .map((b) => ({ title: b.title, href: `/blog/${b.categorySlug}/${b.slug}`, score: fuzzyScore(pathTokens, `${b.slug} ${b.title}`) }))
    .filter((b) => b.score >= 2)
    .sort((a, b) => b.score - a.score)[0];

  const pageMatch = STATIC_PAGES
    .map((p) => ({ title: p.title, href: p.href, score: fuzzyScore(pathTokens, `${p.title} ${p.href}`) }))
    .filter((p) => p.score >= 1)
    .sort((a, b) => b.score - a.score)[0];

  return blogMatch && pageMatch
    ? blogMatch.score >= pageMatch.score ? blogMatch : pageMatch
    : blogMatch ?? pageMatch ?? null;
}

export default function NotFoundSuggestion() {
  const [best, setBest] = useState<{ title: string; href: string } | null>(null);

  useEffect(() => {
    const pathname = window.location.pathname;

    fetch("/api/blog-slugs")
      .then((r) => r.json())
      .then((blogs: BlogSlugItem[]) => setBest(findBest(pathname, blogs)))
      .catch(() => null);
  }, []);

  if (!best) return null;

  return (
    <div className="mt-8 flex flex-col items-center gap-3">
      <p className="text-secondary/50 text-sm">Were you looking for…</p>
      <Link
        href={best.href}
        className="group flex items-center gap-3 rounded-2xl border border-primary/20 bg-white/60 px-6 py-4 transition-all duration-300 hover:border-primary/50 hover:bg-white hover:shadow-lg hover:shadow-primary/10"
      >
        <Icon icon="solar:document-text-broken" width={20} height={20} className="text-primary shrink-0" />
        <span className="font-display text-secondary group-hover:text-primary font-semibold transition-colors line-clamp-1">
          {best.title}
        </span>
        <Icon icon="solar:arrow-right-broken" width={16} height={16} className="text-primary/50 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </div>
  );
}
