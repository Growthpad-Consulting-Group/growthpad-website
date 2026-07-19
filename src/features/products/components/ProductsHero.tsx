"use client";

import { useRef } from "react";
import { useRevealAnimation } from "@/shared/hooks/useRevealAnimation";

export default function ProductsHero() {
  const introRef = useRef<HTMLDivElement>(null);

  useRevealAnimation(introRef, ".products-hero-reveal");

  return (
    <section
      ref={introRef}
      data-theme-section="dark"
      className="theme-bg relative w-full py-28 lg:py-40"
    >
      <div className="container-fluid">
        <h1 className="products-hero-reveal font-display theme-fg max-w-4xl text-3xl leading-tight font-light opacity-0 sm:text-4xl lg:text-5xl">
          Explore Innovative Business Solutions with Growthpad Consulting
          Group
        </h1>
      </div>
    </section>
  );
}
