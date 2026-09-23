"use client";

import { useRef } from "react";
import PracticeAreasHeroVisual from "@/features/practice-areas/components/PracticeAreasHeroVisual";
import { useRevealAnimation } from "@/shared/hooks/useRevealAnimation";

export default function PracticeAreasHero() {
  const introRef = useRef<HTMLDivElement>(null);

  useRevealAnimation(introRef, ".practice-areas-hero-reveal");

  return (
    <section
      ref={introRef}
      className="theme-bg theme-fg w-full pt-6 pb-20 sm:pt-10 lg:pb-28"
    >
      <div className="container-fluid grid items-start gap-12 lg:grid-cols-[2fr_3fr] lg:gap-16">
        <div className="flex flex-col gap-6">
          <p
            className="practice-areas-hero-reveal text-primary opacity-0 text-sm font-semibold tracking-wide uppercase"
            data-rest-opacity="1"
          >
            Our Practice Areas
          </p>

          <h1 className="text-secondary practice-areas-hero-reveal opacity-0 max-w-xl text-3xl leading-tight font-light sm:text-4xl lg:text-5xl">
            Communication, digital delivery, learning systems and research
            organised around real-world progress.
          </h1>
        </div>

        <div className="practice-areas-hero-reveal opacity-0">
          <PracticeAreasHeroVisual />
        </div>
      </div>
    </section>
  );
}
