"use client";

import { useRef } from "react";
import Image from "next/image";
import ArrowGroup from "@/shared/components/ArrowGroup";
import RotatingBadge from "@/shared/components/RotatingBadge";
import { useRevealAnimation } from "@/shared/hooks/useRevealAnimation";

export default function DnaHero() {
  const introRef = useRef<HTMLDivElement>(null);

  const handleExplore = () => {
    introRef.current?.nextElementSibling?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useRevealAnimation(introRef, ".dna-hero-reveal");

  return (
    <section
      ref={introRef}
      className="w-full pt-6 sm:pt-10"
    >
      <div className="container-fluid">
        <div className="relative">
          <div className="dna-hero-reveal opacity-0 relative aspect-1120/499 w-full overflow-hidden">
            <Image
              src="/assets/images/dna-hero.png"
              alt="The Growthpad team in a strategy session"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>

          <div className="hidden sm:block">
            <RotatingBadge
              text="Explore more"
              size="h-36 w-36 lg:h-48 lg:w-48"
              bgClassName="bg-primary"
              textFill="black"
              textClassName="text-2xl font-medium tracking-wide lg:text-4xl"
              arrowClassName="text-black h-8 w-8 lg:h-10 lg:w-10"
              arrowRotate={90}
              onClick={handleExplore}
              className="dna-hero-reveal opacity-0 absolute -mt-40 left-6 shadow-lg shadow-black/20 sm:left-20 "
            />
          </div>
        </div>

        <div className="relative mt-10 flex flex-col items-center gap-10 sm:mt-14">
          <p
            className="dna-hero-reveal opacity-0 text-secondary max-w-5xl text-4xl leading-tight font-light sm:text-5xl lg:text-6xl"
          >
            We&apos;re a company of people who love helping businesses
            succeed, taking great pride in their victories.
          </p>

          <ArrowGroup
            count={5}
            className="dna-hero-reveal opacity-0 lg:absolute lg:right-0 lg:bottom-0"
          />
        </div>
      </div>
    </section>
  );
}
