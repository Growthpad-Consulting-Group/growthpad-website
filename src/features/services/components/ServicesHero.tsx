"use client";

import { useRef } from "react";
import Image from "next/image";
import ArrowGroup from "@/shared/components/ArrowGroup";
import { useRevealAnimation } from "@/shared/hooks/useRevealAnimation";

export default function ServicesHero() {
  const introRef = useRef<HTMLDivElement>(null);

  useRevealAnimation(introRef, ".services-hero-reveal");

  return (
    <section ref={introRef} className="w-full pt-6 sm:pt-10">
      <div className="container-fluid">
        <div className="relative">
          <div className="services-hero-reveal opacity-0 relative aspect-[1280/525] w-full overflow-hidden rounded-2xl">
            <Image
              src="/assets/images/specialties-bg.png"
              alt="Growthpad services — bold moves for bold businesses"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>


        </div>

        <div className="relative mt-10 flex flex-col items-center gap-10 sm:mt-14">
          <p className="services-hero-reveal opacity-0 text-secondary max-w-5xl text-4xl leading-tight font-light sm:text-5xl lg:text-6xl">
            Bold moves to disrupt the present and build the future for your
            organization.
          </p>

          <ArrowGroup
            count={5}
            className="services-hero-reveal opacity-0 lg:absolute lg:right-0 lg:-bottom-10"
          />
        </div>
      </div>
    </section>
  );
}
