"use client";

import { useRef } from "react";
import NotchImage from "@/shared/components/NotchImage";
import { useRevealAnimation } from "@/shared/hooks/useRevealAnimation";

export default function BlogHero() {
  const introRef = useRef<HTMLDivElement>(null);

  useRevealAnimation(introRef, ".blog-hero-reveal");

  return (
    <section ref={introRef} className="w-full pt-6 sm:pt-10">
      <div className="container-fluid">
        <div className="blog-hero-reveal opacity-0">
          <NotchImage
            src="/assets/images/blog-hero.jpg"
            alt="Growthpad Blog — stories, news and perspectives"
            variant="concave"
            showBorder={false}
            fit="meet"
            className="w-full h-[320px] sm:h-[400px] lg:h-[510px]"
            priority
            sizes="100vw"
          />
        </div>
      </div>
    </section>
  );
}
