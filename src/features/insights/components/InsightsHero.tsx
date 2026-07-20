"use client";

import { useRef } from "react";
import ArrowGroup from "@/shared/components/ArrowGroup";
import NotchImage from "@/shared/components/NotchImage";
import { useRevealAnimation } from "@/shared/hooks/useRevealAnimation";

export default function InsightsHero() {
  const introRef = useRef<HTMLDivElement>(null);

  useRevealAnimation(introRef, ".insights-hero-reveal");

  return (
    <section ref={introRef} className="w-full pt-6 sm:pt-10">
      <div className="container-fluid">
        <div className="insights-hero-reveal opacity-0">
          <NotchImage
            src="/assets/images/insights-hero.jpg"
            alt="Growthpad Insights — research and thought leadership"
            variant="concave"
            showBorder={false}
            className="w-full h-[320px] sm:h-[400px] lg:h-[510px]"
            priority
            sizes="100vw"
          />
        </div>

        <div className="relative mt-10 flex flex-col items-center gap-10 sm:mt-14">
          <p className="insights-hero-reveal opacity-0 text-secondary max-w-5xl text-4xl leading-tight font-light sm:text-5xl lg:text-6xl">
            Research, perspectives, and ideas that move Africa&apos;s most
            ambitious organisations forward.
          </p>

          <ArrowGroup
            count={5}
            className="insights-hero-reveal opacity-0 lg:absolute lg:right-0 lg:bottom-0"
          />
        </div>
      </div>
    </section>
  );
}
