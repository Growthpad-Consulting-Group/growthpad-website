"use client";

import { useRef } from "react";
import PartnersImageGrid from "@/features/for-partners/components/PartnersImageGrid";
import { useRevealAnimation } from "@/shared/hooks/useRevealAnimation";

export default function PartnersHero() {
  const introRef = useRef<HTMLDivElement>(null);

  useRevealAnimation(introRef, ".partners-hero-reveal");

  return (
    <section className="relative w-full overflow-hidden py-20 lg:py-12">
      <div className="container-fluid grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div ref={introRef} className="relative z-10 flex flex-col gap-6">
          <h1 className="font-display max-w-2xl leading-[1.1]">
            <span className="partners-hero-reveal text-primary opacity-0 block text-6xl font-bold sm:text-7xl lg:text-8xl">
              You+
            </span>
            <span className="partners-hero-reveal text-primary opacity-0 block text-6xl font-bold sm:text-7xl lg:text-8xl">
              Growthpad
            </span>
          </h1>
        </div>

        <div className="pointer-events-none hidden lg:block">
          <PartnersImageGrid />
        </div>
      </div>
    </section>
  );
}
