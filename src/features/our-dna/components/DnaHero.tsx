"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import ArrowGroup from "@/components/ArrowGroup";
import RotatingBadge from "@/components/RotatingBadge";

export default function DnaHero() {
  const introRef = useRef<HTMLDivElement>(null);

  const handleExplore = () => {
    introRef.current?.nextElementSibling?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Explicit numeric "to" opacity per element (rather than gsap.from's
      // implicit current-value capture): each element's own opacity-0
      // class already set it to 0 before this runs, so an implicit
      // capture would read 0 as the resting target and elements would
      // never fade back in. Same approach as Hero.tsx.
      const els = gsap.utils.toArray<HTMLElement>(".dna-hero-reveal");
      els.forEach((el, i) => {
        const restOpacity = Number(el.dataset.restOpacity ?? 1);
        gsap.fromTo(
          el,
          { y: 28, opacity: 0 },
          {
            y: 0,
            opacity: restOpacity,
            duration: 0.9,
            delay: 0.15 + i * 0.12,
            ease: "power3.out",
          },
        );
      });
    }, introRef);

    return () => ctx.revert();
  }, []);

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
