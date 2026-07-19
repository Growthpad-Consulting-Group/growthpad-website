"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function ProductsHero() {
  const introRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".products-hero-reveal",
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          delay: 0.15,
          ease: "power3.out",
        },
      );
    }, introRef);

    return () => ctx.revert();
  }, []);

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
