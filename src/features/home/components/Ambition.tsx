"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BigArrow from "@/shared/components/BigArrow";

export default function Ambition() {
  const imageWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (!imageWrapRef.current) return;

      gsap.fromTo(
        imageWrapRef.current,
        { x: -120 },
        {
          x: 0,
          ease: "none",
          scrollTrigger: {
            trigger: imageWrapRef.current,
            start: "top 90%",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      data-theme-section="cream"
      className="theme-bg relative w-full overflow-hidden py-20 lg:py-28"
    >
      <div className="container-fluid grid items-center gap-16 lg:grid-cols-2">
        <div
          ref={imageWrapRef}
          className="relative aspect-589/421 w-full overflow-hidden"
        >
          <Image
            src="/assets/images/misc/nochallenge.png"
            alt="A community looking out over the city, embracing ambition"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        <div className="relative flex flex-col gap-6">
          <div className="text-right">
            <p className="theme-fg text-xl">No challenge is too</p>
            <h2 className="font-display theme-fg text-6xl font-bold sm:text-7xl">
              GREAT
            </h2>
          </div>

          <BigArrow className="text-primary h-48 w-48 self-end sm:h-96 sm:w-96" />

          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="theme-fg text-xl">No goals is too</p>
              <h2 className="font-display theme-fg text-6xl font-bold sm:text-7xl">
                BIG
              </h2>
            </div>

            <p className="theme-fg max-w-xs text-lg leading-8 opacity-70">
              We push the limits, tread paths others don&apos;t, and discover
              the magic that lies when you go beyond.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
