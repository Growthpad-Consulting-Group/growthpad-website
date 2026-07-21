"use client";

import { useRef } from "react";
import HeroGrid from "@/features/home/components/HeroGrid";
import { useRevealAnimation } from "@/shared/hooks/useRevealAnimation";

export default function TrainingHero() {
  const introRef = useRef<HTMLDivElement>(null);

  useRevealAnimation(introRef, ".training-hero-reveal");

  return (
    <section
      data-theme-section="dark"
      className="theme-bg relative w-full overflow-hidden py-28 lg:py-40"
    >
      <div ref={introRef} className="container-fluid relative z-10">
        <div className="lg:max-w-[52%]">
          <h1 className="training-hero-reveal font-display theme-fg max-w-4xl text-3xl leading-tight font-light opacity-0 sm:text-4xl lg:text-5xl">
            Bridging the digital skills gap for businesses
          </h1>

          <p className="training-hero-reveal theme-fg mt-6 max-w-2xl text-lg leading-8 opacity-0 sm:text-xl">
            Many businesses face a skills shortfall due to today&apos;s rapid
            digital transformation. Through GDC Training, we enrich you and
            your teams with up-to-date essential digital skills to exploit
            the maximum digital potential of your business.
          </p>
        </div>
      </div>

      <div className="pointer-events-none absolute top-1/2 right-0 hidden w-[45%] max-w-2xl -translate-y-1/2 lg:block">
        <HeroGrid />
      </div>
    </section>
  );
}
